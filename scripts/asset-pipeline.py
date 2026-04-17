#!/usr/bin/env python3
"""
BoHolz Asset Management Pipeline
=================================
Parses WordPress WXR export XML, maps images to house models,
culls low-quality assets, and produces an S3-ready sorted library.

Usage: python3 scripts/asset-pipeline.py
"""

import json
import os
import re
import shutil
import hashlib
from pathlib import Path
from collections import defaultdict

from lxml import etree
from PIL import Image

# ─── Configuration ──────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "public" / "to-organize" / "uploads"
XML_FILE = ROOT / "public" / "to-organize" / "boholz-haus.WordPress.2026-04-17.xml"
OUTPUT_DIR = ROOT / "sorted-assets"
UNKNOWN_DIR = OUTPUT_DIR / "unknown-assets"

MIN_SHORT_SIDE = 1200
MIN_FILE_SIZE = 100 * 1024  # 100KB

# Thumbnail patterns to purge
THUMB_PATTERN = re.compile(r'-\d+x\d+(?:\.\w+)$')
SCALED_PATTERN = re.compile(r'-scaled(?:\.\w+)$')

# WP namespaces
NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    'dc': 'http://purl.org/dc/elements/1.1/',
}

# Category mapping: property_type long name → folder slug
CATEGORY_MAP = {
    'einfamilienhaus': 'einfamilienhaus',
    'einfamilienhäuser': 'einfamilienhaus',
    'efh': 'einfamilienhaus',
    'bungalow': 'bungalow',
    'stadtvilla': 'stadtvilla',
    'doppelhaus': 'doppelhaus',
    'pultdachhaus': 'pultdachhaus',
    'pultdach': 'pultdachhaus',
    'kubushaus': 'kubushaus',
    'kubus': 'kubushaus',
    'generationenhaus': 'generationenhaus',
    'mehrgenerationen': 'generationenhaus',
    'zweifamilienhaus': 'zweifamilienhaus',
    'mehrfamilienhaus': 'mehrfamilienhaus',
}

# ─── Umlaut / special char replacement ────────────────────────────
def sanitize_name(name: str) -> str:
    """Lowercase, replace umlauts, strip special chars for SEO filenames."""
    name = name.lower()
    replacements = {
        'ü': 'ue', 'ö': 'oe', 'ä': 'ae', 'ß': 'ss',
        'Ü': 'ue', 'Ö': 'oe', 'Ä': 'ae',
    }
    for k, v in replacements.items():
        name = name.replace(k, v)
    # Remove anything not alphanumeric, dash, or underscore
    name = re.sub(r'[^a-z0-9\-_.]', '-', name)
    name = re.sub(r'-+', '-', name).strip('-')
    return name


def extract_model_code(title: str) -> str:
    """Extract the house model code like '38-138-125' from a title like 'Einfamilienhaus 38-138-125'."""
    match = re.search(r'(\d{1,2}-\d{2,3}(?:-\d{2,3})?)', title)
    return match.group(1) if match else None


def classify_category(categories: list) -> str:
    """Map WordPress property_type categories to our folder slugs."""
    for cat in categories:
        cat_lower = cat.lower()
        for keyword, slug in CATEGORY_MAP.items():
            if keyword in cat_lower:
                return slug
    return None


def classify_from_title(title: str) -> str:
    """Fallback: infer category from the post title itself."""
    title_lower = title.lower()
    for keyword, slug in CATEGORY_MAP.items():
        if keyword in title_lower:
            return slug
    return None


def detect_asset_type(title: str, filename: str, description: str = '') -> str:
    """Determine if image is hero, gallery, or floorplan."""
    combined = f"{title} {filename} {description}".lower()
    
    floorplan_keywords = ['grundriss', 'floorplan', 'floor-plan', 'floor_plan',
                          'blueprint', 'eg_', '_eg', '_og', 'og_', '_dg', 'dg_',
                          'erdgeschoss', 'obergeschoss', 'dachgeschoss']
    for kw in floorplan_keywords:
        if kw in combined:
            return 'floor-plans'
    
    hero_keywords = ['hauptbild', 'hero', 'titelbild', 'landing', 'main',
                     'aussen', 'außen', 'front', 'eingang', 'strasse', 'straße']
    for kw in hero_keywords:
        if kw in combined:
            return 'hero'
    
    return 'gallery'


def is_thumbnail(filename: str) -> bool:
    """Check if filename is a WordPress-generated thumbnail."""
    # Match patterns like -150x150, -768x432, -1024x791 etc.
    if re.search(r'-\d+x\d+\.\w+$', filename):
        return True
    if '-scaled.' in filename:
        return True
    return False


def get_image_dimensions(filepath: Path) -> tuple:
    """Get (width, height) of an image, or (0, 0) on error."""
    try:
        with Image.open(filepath) as img:
            return img.size
    except Exception:
        return (0, 0)


def file_hash(filepath: Path) -> str:
    """SHA256 hash of first 64KB for duplicate detection."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        h.update(f.read(65536))
    return h.hexdigest()


# ─── XML Parsing ──────────────────────────────────────────────────
def parse_xml():
    """Parse the WXR export and return (posts_by_id, attachments)."""
    print(f"📖 Parsing XML: {XML_FILE}")
    parser = etree.XMLParser(recover=True, encoding='utf-8')
    tree = etree.parse(str(XML_FILE), parser)
    root = tree.getroot()

    posts_by_id = {}   # post_id → {title, categories, slug, category_slug}
    attachments = []    # list of {post_id, parent_id, title, url, filepath, alt, description, excerpt}

    for item in root.iter('item'):
        post_type_el = item.find('wp:post_type', NS)
        if post_type_el is None:
            continue
        post_type = post_type_el.text

        post_id_el = item.find('wp:post_id', NS)
        post_id = int(post_id_el.text) if post_id_el is not None and post_id_el.text else 0
        title_el = item.find('title')
        title = title_el.text if title_el is not None and title_el.text else ''
        
        if post_type == 'property':
            cats = [c.text for c in item.findall('category')
                    if c.get('domain') == 'property_type' and c.text]
            slug_el = item.find('wp:post_name', NS)
            slug = slug_el.text if slug_el is not None and slug_el.text else ''
            
            cat_slug = classify_category(cats) or classify_from_title(title)
            model_code = extract_model_code(title)
            
            posts_by_id[post_id] = {
                'title': title,
                'categories': cats,
                'slug': slug,
                'category_slug': cat_slug,
                'model_code': model_code,
            }

        elif post_type == 'attachment':
            parent_el = item.find('wp:post_parent', NS)
            parent_id = int(parent_el.text) if parent_el is not None and parent_el.text else 0
            
            url_el = item.find('wp:attachment_url', NS)
            url = url_el.text if url_el is not None and url_el.text else ''
            
            # Extract the relative filepath from _wp_attached_file meta
            filepath = ''
            alt_text = ''
            for meta in item.findall('wp:postmeta', NS):
                key_el = meta.find('wp:meta_key', NS)
                val_el = meta.find('wp:meta_value', NS)
                if key_el is None or val_el is None:
                    continue
                key = key_el.text
                val = val_el.text or ''
                if key == '_wp_attached_file':
                    filepath = val
                elif key == '_wp_attachment_image_alt':
                    alt_text = val

            content_el = item.find('content:encoded', NS)
            description = content_el.text if content_el is not None and content_el.text else ''
            excerpt_el = item.find('excerpt:encoded', NS)
            excerpt = excerpt_el.text if excerpt_el is not None and excerpt_el.text else ''

            attachments.append({
                'post_id': post_id,
                'parent_id': parent_id,
                'title': title,
                'url': url,
                'filepath': filepath,
                'alt': alt_text,
                'description': description,
                'excerpt': excerpt,
            })

    # Also index landing-page-haus and page posts as potential parents
    for item in root.iter('item'):
        post_type_el = item.find('wp:post_type', NS)
        if post_type_el is None:
            continue
        post_type = post_type_el.text
        if post_type in ('landing-page-haus', 'page', 'post'):
            post_id_el = item.find('wp:post_id', NS)
            post_id = int(post_id_el.text) if post_id_el is not None and post_id_el.text else 0
            if post_id in posts_by_id:
                continue
            title_el = item.find('title')
            title = title_el.text if title_el is not None and title_el.text else ''
            cats = [c.text for c in item.findall('category')
                    if c.get('domain') == 'property_type' and c.text]
            cat_slug = classify_category(cats) or classify_from_title(title)
            model_code = extract_model_code(title)
            slug_el = item.find('wp:post_name', NS)
            slug = slug_el.text if slug_el is not None and slug_el.text else ''
            
            posts_by_id[post_id] = {
                'title': title,
                'categories': cats,
                'slug': slug,
                'category_slug': cat_slug,
                'model_code': model_code,
            }

    print(f"   Found {len(posts_by_id)} parent posts, {len(attachments)} attachments")
    return posts_by_id, attachments


# ─── Physical File Discovery ─────────────────────────────────────
def discover_files():
    """Walk source directory and index all image files."""
    print(f"🔍 Scanning {SOURCE_DIR} for images...")
    files = {}  # relative_path → absolute_path
    extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    
    for path in SOURCE_DIR.rglob('*'):
        if path.is_file() and path.suffix.lower() in extensions:
            rel = str(path.relative_to(SOURCE_DIR))
            files[rel] = path
    
    print(f"   Found {len(files)} image files on disk")
    return files


# ─── Phase A: Quality Cull ────────────────────────────────────────
def phase_a_cull(disk_files: dict) -> dict:
    """Remove thumbnails, under-size, and under-dimension files. Returns survivors."""
    print("\n🗑️  Phase A: Quality Cull")
    
    survivors = {}
    stats = {'thumb_purged': 0, 'too_small_bytes': 0, 'too_small_dims': 0, 'kept': 0, 'errors': 0}
    
    # Group files by their base name (without -WxH suffix) for dedup
    base_groups = defaultdict(list)  # base_name → [(rel_path, abs_path, width, height)]
    
    total = len(disk_files)
    for i, (rel, abspath) in enumerate(disk_files.items()):
        if (i + 1) % 2000 == 0:
            print(f"   Scanning {i+1}/{total}...")
        
        filename = abspath.name
        
        # 1. Thumbnail purge
        if is_thumbnail(filename):
            stats['thumb_purged'] += 1
            continue
        
        # 2. File size gate
        try:
            size = abspath.stat().st_size
        except OSError:
            stats['errors'] += 1
            continue
            
        if size < MIN_FILE_SIZE:
            stats['too_small_bytes'] += 1
            continue
        
        # 3. Dimension gate
        w, h = get_image_dimensions(abspath)
        if w == 0 and h == 0:
            stats['errors'] += 1
            continue
        
        short_side = min(w, h)
        if short_side < MIN_SHORT_SIDE:
            stats['too_small_dims'] += 1
            continue
        
        # Group for dedup
        # Strip the -WxH suffix to find the base
        base_name = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', filename)
        dir_prefix = str(abspath.parent.relative_to(SOURCE_DIR))
        base_key = f"{dir_prefix}/{base_name}"
        base_groups[base_key].append((rel, abspath, w, h, size))
    
    # 4. Duplicate cleanup: keep highest resolution per base group
    for base_key, variants in base_groups.items():
        # Sort by total pixels descending
        variants.sort(key=lambda x: x[2] * x[3], reverse=True)
        best = variants[0]
        survivors[best[0]] = best[1]
        stats['kept'] += 1
    
    print(f"   Thumbnail purge: {stats['thumb_purged']}")
    print(f"   Too small (bytes): {stats['too_small_bytes']}")
    print(f"   Too small (dims): {stats['too_small_dims']}")
    print(f"   Errors: {stats['errors']}")
    print(f"   ✅ Survivors: {stats['kept']}")
    
    return survivors


# ─── Phase B: Mapping & Identification ────────────────────────────
def phase_b_map(survivors: dict, posts_by_id: dict, attachments: list):
    """
    Map surviving files to house models.
    Returns list of dicts: {src, category, house_slug, asset_type, alt, width, height, ext}
    """
    print("\n🗺️  Phase B: Mapping & Identification")
    
    # Build lookup: filename → attachment record(s)
    file_to_attachment = defaultdict(list)
    for att in attachments:
        if att['filepath']:
            # filepath is like "2019/06/image.jpg"
            file_to_attachment[att['filepath']].append(att)
            # Also index by just the filename
            fname = att['filepath'].split('/')[-1] if '/' in att['filepath'] else att['filepath']
            file_to_attachment[fname].append(att)
        if att['url']:
            # Extract filename from URL
            url_fname = att['url'].split('/')[-1]
            file_to_attachment[url_fname].append(att)
    
    # Build a secondary index: for attachments without parents, try matching by title/excerpt
    # containing model codes
    model_codes = {}  # model_code → post info
    for pid, post in posts_by_id.items():
        if post['model_code']:
            model_codes[post['model_code']] = {**post, 'post_id': pid}
    
    mapped = []
    unmapped = []
    
    for rel, abspath in survivors.items():
        filename = abspath.name
        w, h = get_image_dimensions(abspath)
        ext = abspath.suffix.lower().lstrip('.')
        
        # Try to find attachment record
        atts = file_to_attachment.get(rel, []) or file_to_attachment.get(filename, [])
        
        matched_post = None
        att_record = None
        
        if atts:
            att_record = atts[0]
            parent_id = att_record['parent_id']
            
            # Direct parent match
            if parent_id and parent_id in posts_by_id:
                matched_post = posts_by_id[parent_id]
            else:
                # Try to match from attachment's own title/excerpt/description
                combined = f"{att_record['title']} {att_record['excerpt']} {att_record['description']}"
                for code, post_info in model_codes.items():
                    if code in combined:
                        matched_post = post_info
                        break
        
        # Fallback: try to match filename against model codes
        if not matched_post:
            for code, post_info in model_codes.items():
                code_slug = code.replace('-', '')
                fname_clean = filename.lower().replace('-', '').replace('_', '')
                if code in filename or code_slug in fname_clean:
                    matched_post = post_info
                    break
        
        # Fallback: try matching by category keywords in filename
        if not matched_post:
            fname_lower = filename.lower()
            for keyword, slug in CATEGORY_MAP.items():
                if keyword in fname_lower:
                    # We know the category but not the specific model
                    matched_post = {
                        'category_slug': slug,
                        'model_code': None,
                        'title': filename,
                        'slug': sanitize_name(Path(filename).stem),
                    }
                    break
        
        # If matched_post exists but has no category, try to infer from filename
        if matched_post and not matched_post.get('category_slug'):
            fname_lower = filename.lower()
            for keyword, slug in CATEGORY_MAP.items():
                if keyword in fname_lower:
                    matched_post['category_slug'] = slug
                    break
        
        if matched_post and matched_post.get('category_slug'):
            category = matched_post['category_slug']
            model_code = matched_post.get('model_code', '')
            house_slug = model_code if model_code else sanitize_name(matched_post.get('slug', Path(filename).stem))
            
            asset_type = detect_asset_type(
                att_record['title'] if att_record else '',
                filename,
                att_record['description'] if att_record else ''
            )
            
            alt_text = att_record['alt'] if att_record else ''
            
            mapped.append({
                'src': str(abspath),
                'category': category,
                'house_slug': house_slug,
                'asset_type': asset_type,
                'alt': alt_text,
                'width': w,
                'height': h,
                'ext': ext if ext in ('jpg', 'jpeg', 'webp', 'png') else 'jpg',
                'original_filename': filename,
            })
        else:
            unmapped.append({
                'src': str(abspath),
                'original_filename': filename,
                'width': w,
                'height': h,
            })
    
    print(f"   ✅ Mapped: {len(mapped)}")
    print(f"   ❓ Unmapped (→ unknown-assets): {len(unmapped)}")
    
    # Print mapped categories summary
    cat_summary = defaultdict(int)
    for m in mapped:
        cat_summary[m['category']] += 1
    for cat, count in sorted(cat_summary.items()):
        print(f"      {cat}: {count}")
    
    return mapped, unmapped


# ─── Phase C: Rename, Organize, Output ────────────────────────────
def phase_c_output(mapped: list, unmapped: list):
    """Copy and rename files into the sorted-assets structure."""
    print("\n📂 Phase C: Building sorted-assets/")
    
    # Clean output directory
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    
    OUTPUT_DIR.mkdir(parents=True)
    UNKNOWN_DIR.mkdir(parents=True)
    
    manifest = {}  # house_slug → { category, images: [] }
    counters = defaultdict(int)  # (cat, slug, type) → counter
    
    for item in mapped:
        category = item['category']
        house_slug = sanitize_name(item['house_slug'])
        asset_type = item['asset_type']
        w, h = item['width'], item['height']
        ext = item['ext']
        if ext == 'jpeg':
            ext = 'jpg'
        
        # Build destination directory
        dest_dir = OUTPUT_DIR / category / house_slug / asset_type
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        # Build filename: {category}_{house-slug}_{type}_{dimensions}.{ext}
        key = (category, house_slug, asset_type)
        counters[key] += 1
        count = counters[key]
        
        if count == 1:
            dest_name = f"{category}_{house_slug}_{asset_type.replace('-', '_')}_{w}x{h}.{ext}"
        else:
            dest_name = f"{category}_{house_slug}_{asset_type.replace('-', '_')}_{count}_{w}x{h}.{ext}"
        
        dest_path = dest_dir / dest_name
        
        # Copy file
        try:
            shutil.copy2(item['src'], dest_path)
        except Exception as e:
            print(f"   ⚠️  Error copying {item['src']}: {e}")
            continue
        
        # Strip EXIF (but preserve ICC)
        try:
            with Image.open(dest_path) as img:
                # Get ICC profile if present
                icc = img.info.get('icc_profile')
                
                # Re-save without EXIF
                save_kwargs = {'quality': 95}
                if icc:
                    save_kwargs['icc_profile'] = icc
                if ext == 'webp':
                    save_kwargs['method'] = 4
                
                img.save(dest_path, **save_kwargs)
        except Exception:
            pass  # If stripping fails, keep the copy as-is
        
        # Add to manifest
        manifest_key = f"{category}/{house_slug}"
        if manifest_key not in manifest:
            manifest[manifest_key] = {
                'category': category,
                'house_slug': house_slug,
                'images': [],
            }
        
        manifest[manifest_key]['images'].append({
            'filename': dest_name,
            'path': f"{category}/{house_slug}/{asset_type}/{dest_name}",
            'type': asset_type,
            'alt': item.get('alt', ''),
            'width': w,
            'height': h,
            'format': ext,
        })
    
    # Copy unmapped files
    for item in unmapped:
        src = Path(item['src'])
        dest = UNKNOWN_DIR / src.name
        # Avoid collisions
        if dest.exists():
            stem = dest.stem
            suffix = dest.suffix
            i = 1
            while dest.exists():
                dest = UNKNOWN_DIR / f"{stem}_{i}{suffix}"
                i += 1
        try:
            shutil.copy2(src, dest)
        except Exception:
            pass
    
    # Write manifest
    manifest_path = OUTPUT_DIR / "manifest.json"
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f"\n📋 Manifest written: {manifest_path}")
    print(f"   {len(manifest)} house models in manifest")
    total_images = sum(len(m['images']) for m in manifest.values())
    print(f"   {total_images} total images catalogued")
    
    return manifest


def write_notes(manifest, mapped, unmapped):
    """Generate NOTES.md documenting the processing run."""
    notes_path = OUTPUT_DIR / "NOTES.md"
    
    cat_summary = defaultdict(lambda: {'models': set(), 'images': 0})
    for m in mapped:
        cat_summary[m['category']]['models'].add(m['house_slug'])
        cat_summary[m['category']]['images'] += 1
    
    with open(notes_path, 'w', encoding='utf-8') as f:
        f.write("# BoHolz Asset Pipeline — Processing Notes\n\n")
        f.write(f"**Run Date:** {__import__('datetime').datetime.now().isoformat()}\n\n")
        f.write("## Processing Summary\n\n")
        f.write(f"- **Source:** `public/to-organize/uploads/`\n")
        f.write(f"- **XML Source:** `boholz-haus.WordPress.2026-04-17.xml`\n")
        f.write(f"- **Mapped images:** {len(mapped)}\n")
        f.write(f"- **Unmapped images:** {len(unmapped)} (moved to `unknown-assets/`)\n\n")
        
        f.write("## Category Breakdown\n\n")
        f.write("| Category | Models | Images |\n")
        f.write("|----------|--------|--------|\n")
        for cat in sorted(cat_summary.keys()):
            info = cat_summary[cat]
            f.write(f"| {cat} | {len(info['models'])} | {info['images']} |\n")
        
        f.write("\n## New Categories Created\n\n")
        expected = {'einfamilienhaus', 'bungalow', 'stadtvilla', 'doppelhaus', 'pultdachhaus', 'generationenhaus'}
        extra = set(cat_summary.keys()) - expected
        if extra:
            for cat in sorted(extra):
                f.write(f"- **{cat}**: Not in original agent.md spec but found in WordPress data.\n")
        else:
            f.write("None — all categories were pre-specified.\n")
        
        f.write("\n## Quality Gate Settings\n\n")
        f.write(f"- Min short side: {MIN_SHORT_SIDE}px\n")
        f.write(f"- Min file size: {MIN_FILE_SIZE // 1024}KB\n")
        f.write(f"- Thumbnail patterns: `-WxH.ext`, `-scaled.ext`\n")
        f.write(f"- EXIF stripped, ICC profiles preserved\n")
        
        f.write("\n## Heuristics Applied\n\n")
        f.write("- **Asset Type Detection**: Filenames containing 'grundriss', 'EG', 'OG', 'DG' → floorplan. ")
        f.write("Filenames with 'hauptbild', 'eingang', 'front', 'aussen' → hero. Everything else → gallery.\n")
        f.write("- **Category Inference**: First from WP `property_type` taxonomy, then from post title keywords, ")
        f.write("then from filename patterns.\n")
        f.write("- **Model Matching**: Attachment → parent post_id → property post. Fallback: model code in ")
        f.write("attachment excerpt/title. Final fallback: model code pattern in filename.\n")
    
    print(f"📝 Notes written: {notes_path}")


# ─── Main ─────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  BoHolz Asset Management Pipeline")
    print("=" * 60)
    
    # 1. Parse XML
    posts_by_id, attachments = parse_xml()
    
    # 2. Discover physical files
    disk_files = discover_files()
    
    # 3. Phase A: Quality cull
    survivors = phase_a_cull(disk_files)
    
    # 4. Phase B: Map to house models
    mapped, unmapped = phase_b_map(survivors, posts_by_id, attachments)
    
    # 5. Phase C: Rename, organize, output
    manifest = phase_c_output(mapped, unmapped)
    
    # 6. Write notes
    write_notes(manifest, mapped, unmapped)
    
    print("\n" + "=" * 60)
    print("  ✅ Pipeline complete!")
    print(f"  Output: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == '__main__':
    main()
