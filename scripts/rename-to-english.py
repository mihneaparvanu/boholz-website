#!/usr/bin/env python3
"""Rename all sorted-assets to English kebab-case.

- German category names → English
- German floor codes (eg/og/dg/kg) → English (ground/upper/attic/basement)
- Enforce strict kebab-case: lowercase, hyphens only, no underscores
- Clean up messy slugs (WordPress artifacts, redundant prefixes)
"""
import os, re, shutil, json
from PIL import Image

BASE = "sorted-assets"
MODELS_DIR = os.path.join(BASE, "house-models")

# ── Category translations ──
CATEGORY_MAP = {
    "bungalow": "bungalow",
    "doppelhaus": "duplex",
    "einfamilienhaus": "single-family",
    "generationenhaus": "multi-generation",
    "kubushaus": "cube-house",
    "mehrfamilienhaus": "multi-family",
    "pultdachhaus": "mono-pitch",
    "stadtvilla": "city-villa",
    "zweifamilienhaus": "two-family",
}

# ── Floor translations ──
FLOOR_MAP = {
    "eg": "ground",
    "og": "upper",
    "dg": "attic",
    "kg": "basement",
}


def to_kebab(s):
    """Convert string to strict kebab-case: lowercase, hyphens only."""
    s = s.lower().strip()
    s = s.replace("_", "-")
    s = re.sub(r"-{2,}", "-", s)  # collapse multiple hyphens
    s = s.strip("-")
    return s


def clean_slug(slug, de_category):
    """Clean up messy model slugs."""
    s = to_kebab(slug)
    # Remove WordPress hash suffixes like -e1572894695752
    s = re.sub(r"-e\d{10,}$", "", s)
    # Remove redundant German category prefix from slug (e.g. "bungalow-145-0-0")
    de_cat_kebab = to_kebab(de_category)
    if s.startswith(de_cat_kebab + "-") and s != de_cat_kebab:
        remainder = s[len(de_cat_kebab) + 1:]
        if remainder:  # don't strip if it leaves nothing
            s = remainder
    # Remove "scha-fer-fertighaus-" prefix (Schäfer Fertighaus branding)
    s = re.sub(r"^scha-fer-fertighaus-", "", s)
    # Remove redundant German category embedded in slug after branding removal
    # e.g. "kubus-172-0-0-1800" from "scha-fer-fertighaus-kubus-172-0-0_1800"
    for de_cat in CATEGORY_MAP:
        prefix = to_kebab(de_cat) + "-"
        if s.startswith(prefix):
            remainder = s[len(prefix):]
            if remainder and re.match(r"\d", remainder):
                s = remainder
                break
    # Remove "grundriss-eg-" or "grundriss-eg-stadtvilla-" prefix (floor plan artifacts used as slugs)
    s = re.sub(r"^grundriss-(?:eg|og|dg|kg)-(?:stadtvilla-|efh-|)?", "", s)
    # Remove "-alternativ" suffix  
    s = re.sub(r"-alternativ$", "", s)
    # Remove "-final" suffix
    s = re.sub(r"-final$", "", s)
    # Starts with dash? strip
    s = s.lstrip("-")
    # Collapse hyphens again
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s


def translate_filename(fname, de_category, en_category, slug_old, slug_new):
    """Translate a single filename to English kebab-case."""
    name, ext = os.path.splitext(fname)
    ext = ext.lower()
    name = to_kebab(name)

    # Replace German category with English in the filename prefix
    de_cat_kebab = to_kebab(de_category)
    if name.startswith(de_cat_kebab + "-"):
        name = en_category + "-" + name[len(de_cat_kebab) + 1:]
    elif name.startswith(de_cat_kebab):
        name = en_category + name[len(de_cat_kebab):]

    # Replace old slug with new slug in filename
    slug_old_kebab = to_kebab(slug_old)
    if slug_old_kebab and slug_new != slug_old_kebab:
        name = name.replace(slug_old_kebab, slug_new, 1)

    # Replace floor codes
    for de_floor, en_floor in FLOOR_MAP.items():
        name = name.replace(f"floor-plan-{de_floor}", f"floor-plan-{en_floor}")

    # Final kebab cleanup
    name = re.sub(r"-{2,}", "-", name).strip("-")
    return name + ext


def translate_site_filename(fname):
    """Enforce kebab-case on site asset filenames."""
    name, ext = os.path.splitext(fname)
    return to_kebab(name) + ext.lower()


# ── Main ──

# 1. Build the rename plan for house models
model_renames = []  # (old_dir, new_dir, [(old_file, new_file), ...])
for de_cat in sorted(os.listdir(MODELS_DIR)):
    de_cat_path = os.path.join(MODELS_DIR, de_cat)
    if not os.path.isdir(de_cat_path):
        continue
    en_cat = CATEGORY_MAP.get(de_cat, to_kebab(de_cat))
    
    for slug_dir in sorted(os.listdir(de_cat_path)):
        slug_path = os.path.join(de_cat_path, slug_dir)
        if not os.path.isdir(slug_path):
            continue
        new_slug = clean_slug(slug_dir, de_cat)
        
        old_model_dir = os.path.join(MODELS_DIR, de_cat, slug_dir)
        new_model_dir = os.path.join(MODELS_DIR, en_cat, new_slug)
        
        file_renames = []
        for sub in sorted(os.listdir(slug_path)):
            sub_path = os.path.join(slug_path, sub)
            if not os.path.isdir(sub_path):
                continue
            for fname in sorted(os.listdir(sub_path)):
                if not os.path.isfile(os.path.join(sub_path, fname)):
                    continue
                new_fname = translate_filename(fname, de_cat, en_cat, slug_dir, new_slug)
                file_renames.append((
                    os.path.join(sub, fname),     # relative from model dir
                    os.path.join(sub, new_fname),  # relative from model dir
                ))
        
        model_renames.append((old_model_dir, new_model_dir, file_renames))

# 2. Build rename plan for site assets
site_renames = []  # (folder, [(old, new), ...])
SITE_FOLDERS = ["team", "showhouses", "homepage", "professional-photography",
                "branding", "banners", "brochures", "construction"]
for folder in SITE_FOLDERS:
    folder_path = os.path.join(BASE, folder)
    if not os.path.isdir(folder_path):
        continue
    pairs = []
    for fname in sorted(os.listdir(folder_path)):
        if not os.path.isfile(os.path.join(folder_path, fname)):
            continue
        new_fname = translate_site_filename(fname)
        if new_fname != fname:
            pairs.append((fname, new_fname))
    if pairs:
        site_renames.append((folder_path, pairs))

# ── Preview ──
print("=== House model renames ===")
for old_dir, new_dir, files in model_renames:
    old_short = os.path.relpath(old_dir, MODELS_DIR)
    new_short = os.path.relpath(new_dir, MODELS_DIR)
    if old_short != new_short:
        print(f"  DIR: {old_short} → {new_short}")
    for old_f, new_f in files:
        if old_f != new_f:
            print(f"    FILE: {os.path.basename(old_f)} → {os.path.basename(new_f)}")

print(f"\n=== Site asset renames ===")
for folder_path, pairs in site_renames:
    folder = os.path.basename(folder_path)
    for old_f, new_f in pairs:
        print(f"  {folder}/{old_f} → {new_f}")

# ── Execute ──
print("\n=== Executing renames ===")

# House models: copy to new structure, then remove old
# We need to handle this carefully because categories are being renamed
# Strategy: build everything into a temp dir, then swap

import tempfile
tmp_models = os.path.join(BASE, "_house-models-tmp")
os.makedirs(tmp_models, exist_ok=True)

for old_dir, new_dir, files in model_renames:
    # new_dir is relative to MODELS_DIR; rebuild under tmp
    rel = os.path.relpath(new_dir, MODELS_DIR)
    dst_model = os.path.join(tmp_models, rel)
    
    # Copy subdirs structure
    for sub in os.listdir(old_dir):
        sub_path = os.path.join(old_dir, sub)
        if os.path.isdir(sub_path):
            os.makedirs(os.path.join(dst_model, sub), exist_ok=True)
    
    # Copy and rename files
    for old_rel, new_rel in files:
        src = os.path.join(old_dir, old_rel)
        dst = os.path.join(dst_model, new_rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)

# Swap old house-models with new
old_backup = os.path.join(BASE, "_house-models-old")
os.rename(MODELS_DIR, old_backup)
os.rename(tmp_models, MODELS_DIR)
shutil.rmtree(old_backup)
print("  House models: done")

# Site assets: rename in place
for folder_path, pairs in site_renames:
    for old_f, new_f in pairs:
        src = os.path.join(folder_path, old_f)
        dst = os.path.join(folder_path, new_f)
        if src != dst:
            # Handle case-only renames via temp
            if old_f.lower() == new_f.lower():
                tmp = src + ".tmp"
                os.rename(src, tmp)
                os.rename(tmp, dst)
            else:
                os.rename(src, dst)
print("  Site assets: done")

# ── Rebuild manifest ──
print("\n=== Rebuilding manifest ===")
manifest = {}

for cat in sorted(os.listdir(MODELS_DIR)):
    cat_path = os.path.join(MODELS_DIR, cat)
    if not os.path.isdir(cat_path):
        continue
    for slug in sorted(os.listdir(cat_path)):
        slug_path = os.path.join(cat_path, slug)
        if not os.path.isdir(slug_path):
            continue
        key = f"{cat}/{slug}"
        entry = {"category": cat, "house_slug": slug, "images": []}
        for root, dirs, files in os.walk(slug_path):
            for fname in sorted(files):
                fpath = os.path.join(root, fname)
                img_type = os.path.basename(os.path.dirname(fpath))
                try:
                    with Image.open(fpath) as im:
                        w, h = im.size
                        fmt = (im.format or "").lower() or fname.rsplit(".", 1)[-1]
                except Exception:
                    w, h, fmt = 0, 0, fname.rsplit(".", 1)[-1]
                entry["images"].append({
                    "filename": fname,
                    "path": os.path.relpath(fpath, BASE),
                    "type": img_type,
                    "alt": f"{cat} {slug} {img_type}",
                    "width": w, "height": h, "format": fmt,
                })
        manifest[key] = entry

site_assets = {}
for folder in SITE_FOLDERS:
    folder_path = os.path.join(BASE, folder)
    if not os.path.isdir(folder_path):
        continue
    images = []
    for fname in sorted(os.listdir(folder_path)):
        fpath = os.path.join(folder_path, fname)
        if not os.path.isfile(fpath):
            continue
        try:
            with Image.open(fpath) as im:
                w, h = im.size
                fmt = (im.format or "").lower() or fname.rsplit(".", 1)[-1]
        except Exception:
            w, h, fmt = 0, 0, fname.rsplit(".", 1)[-1]
        images.append({
            "filename": fname,
            "path": os.path.relpath(fpath, BASE),
            "type": folder,
            "alt": fname.rsplit(".", 1)[0].replace("-", " "),
            "width": w, "height": h, "format": fmt,
        })
    site_assets[folder] = {"category": "site", "folder": folder, "images": images}
manifest["_site_assets"] = site_assets

with open(os.path.join(BASE, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

total_models = len([k for k in manifest if not k.startswith("_")])
total_imgs = sum(len(v["images"]) for k, v in manifest.items() if not k.startswith("_"))
total_site = sum(len(v["images"]) for v in site_assets.values())
print(f"  Manifest: {total_models} models ({total_imgs} images), {total_site} site assets")

# ── Final summary ──
print("\n=== Category mapping ===")
for de, en in sorted(CATEGORY_MAP.items()):
    print(f"  {de} → {en}")
print("\n=== Floor mapping ===")
for de, en in sorted(FLOOR_MAP.items()):
    print(f"  {de} → {en}")
