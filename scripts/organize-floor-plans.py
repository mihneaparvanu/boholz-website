#!/usr/bin/env python3
"""Pull per-floor plan images from source, label them with floor names (EG/OG/DG/KG),
and rename existing generic floor plans."""

import os, re, shutil, json
from PIL import Image
from collections import defaultdict

BASE = "sorted-assets/house-models"
SRC = "public/to-organize/uploads"
THUMB_RE = re.compile(r'-\d+x\d+\.\w+$')

existing_models = {}
for cat in os.listdir(BASE):
    cat_path = os.path.join(BASE, cat)
    if not os.path.isdir(cat_path):
        continue
    for slug in os.listdir(cat_path):
        if os.path.isdir(os.path.join(cat_path, slug)):
            existing_models[slug] = (cat, slug, os.path.join(cat_path, slug))

print(f"Found {len(existing_models)} existing model slugs")

def parse_grundriss(fname):
    fl = fname.lower()
    floor = None
    if any(x in fl for x in ['erdgeschoss', '_eg_', 'eg-grundriss', '-eg.', '-eg-', 'grundriss-eg', 'grundriss_eg', 'bodenplatte', '-eg_']):
        floor = "eg"
    elif any(x in fl for x in ['dachgeschoss', '_dg_', 'dg-grundriss', '-dg.', '-dg-', 'grundriss-dg', '-dg_']):
        floor = "dg"
    elif any(x in fl for x in ['obergeschoss', '_og_', 'og-grundriss', '-og.', '-og-', 'grundriss-og', '1og', '2og', '-og_']):
        floor = "og"
    elif any(x in fl for x in ['_kg_', 'keller', 'kg-grundriss', '-kg.', '-kg-', '-kg_']):
        floor = "kg"

    category = None
    model_nums = []
    patterns = [
        (r'BU-(\d+)-(\d+)-(\d+)', 'bungalow'),
        (r'EFH[-_](?:ELW[-_]|HO[-_])?(\d+)[-_](\d+)[-_](\d+)', 'einfamilienhaus'),
        (r'Bungalow[-_](\d+)[-_](\d+)[-_](\d+)', 'bungalow'),
        (r'DH[-_](\d+)[-_](\d+)[-_](\d+)', 'doppelhaus'),
        (r'Generationenhaus[-_](\d+)[-_](\d+)[-_](\d+)', 'generationenhaus'),
        (r'Kubus[-_](\d+)[-_](\d+)[-_](\d+)', 'kubushaus'),
        (r'Stadtvilla[-_](\d+)[-_](\d+)[-_](\d+)', 'stadtvilla'),
        (r'SV[-_](\d+)[-_](\d+)[-_](\d+)', 'stadtvilla'),
        (r'ZFH[-_](\d+)[-_](\d+)[-_](\d+)', 'zweifamilienhaus'),
        (r'PDH[-_](?:ELW[-_])?(\d+)[-_](\d+)[-_](\d+)', 'pultdachhaus'),
        (r'Einfamilienhaus[-_](\d+)[-_](\d+)[-_](\d+)', 'einfamilienhaus'),
        (r'Mehrfamilienhaus[-_](\d+)[-_](\d+)[-_](\d+)', 'mehrfamilienhaus'),
    ]
    for pattern, cat in patterns:
        m = re.search(pattern, fname, re.IGNORECASE)
        if m:
            category = cat
            model_nums = list(m.groups())
            break

    # Special cases
    if not category:
        if 'satteldorf' in fl:
            category = 'mehrfamilienhaus'
            return floor, category, ['satteldorf-nord']
        if 'dombuehl' in fl or 'dombuhl' in fl:
            category = 'mehrfamilienhaus'
            return floor, category, ['dombuehl']
        if 'hausost' in fl:
            category = 'mehrfamilienhaus'
            return floor, category, ['haus-ost']

    return floor, category, model_nums

def nums_to_slug(category, nums):
    if not nums or not category:
        return None
    # Special string slugs
    if nums[0] in ('satteldorf-nord', 'dombuehl', 'haus-ost'):
        slug = nums[0]
        if slug in existing_models:
            return slug
        return slug

    model = nums[0]
    roof = nums[1] if len(nums) > 1 else '0'
    mod = nums[2] if len(nums) > 2 else '0'

    # Try slug patterns
    candidates = set()
    candidates.add(f"{roof}-{model}-{mod}")
    candidates.add(f"{roof}-{model}")
    if mod == '0':
        candidates.add(f"{roof}-{model}")
    if roof == '0' and mod == '0':
        candidates.add(f"0-{model}")

    for c in candidates:
        if c in existing_models and existing_models[c][0] == category:
            return c

    # Fuzzy: find slug containing model number in same category
    cat_path = os.path.join(BASE, category)
    if os.path.isdir(cat_path):
        for s in os.listdir(cat_path):
            if os.path.isdir(os.path.join(cat_path, s)) and model in s:
                return s

    # No match found — create a new slug
    if mod == '0':
        new_slug = f"{roof}-{model}"
    else:
        new_slug = f"{roof}-{model}-{mod}"
    return new_slug

# Scan source for floor plans
floor_plans = []
for root, dirs, files in os.walk(SRC):
    for f in files:
        fl = f.lower()
        if not any(fl.endswith(e) for e in ('.jpg', '.jpeg', '.png', '.webp')):
            continue
        if THUMB_RE.search(f) or '-scaled.' in f:
            continue
        has_kw = any(kw in fl for kw in [
            'grundriss', '_eg_', '_og_', '_dg_', '_kg_',
            'eg-grundriss', 'og-grundriss', 'dg-grundriss',
        ])
        if not has_kw:
            continue
        fp = os.path.join(root, f)
        try:
            with Image.open(fp) as im:
                w, h = im.size
                short = min(w, h)
        except:
            continue
        if short < 800:
            continue
        floor, cat, nums = parse_grundriss(f)
        if not floor or not cat:
            continue
        slug = nums_to_slug(cat, nums)
        floor_plans.append({
            'file': f, 'path': fp, 'floor': floor,
            'category': cat, 'slug': slug,
            'w': w, 'h': h, 'short': short,
        })

print(f"Found {len(floor_plans)} floor plan candidates (>=800px, with floor label)")

# Deduplicate by (category, slug, floor) keeping highest resolution
best = {}
for p in floor_plans:
    if not p['slug']:
        print(f"  UNMATCHED: {p['file']} → {p['category']}/{p.get('slug','?')}")
        continue
    key = (p['category'], p['slug'], p['floor'])
    if key not in best or p['short'] > best[key]['short']:
        best[key] = p

print(f"\nBest per-floor plans to import: {len(best)}")

# Delete ALL existing floor plans — we'll rebuild from source with proper labels
for cat in os.listdir(BASE):
    cat_path = os.path.join(BASE, cat)
    if not os.path.isdir(cat_path):
        continue
    for slug in os.listdir(cat_path):
        fp_dir = os.path.join(cat_path, slug, 'floor-plans')
        if not os.path.isdir(fp_dir):
            continue
        for f in os.listdir(fp_dir):
            os.remove(os.path.join(fp_dir, f))

# Copy best floor plans
copied = 0
new_models = set()
for (cat, slug, floor), p in sorted(best.items()):
    model_dir = os.path.join(BASE, cat, slug)
    if not os.path.isdir(model_dir):
        os.makedirs(os.path.join(model_dir, 'hero'), exist_ok=True)
        os.makedirs(os.path.join(model_dir, 'gallery'), exist_ok=True)
        new_models.add(f"{cat}/{slug}")

    fp_dir = os.path.join(model_dir, 'floor-plans')
    os.makedirs(fp_dir, exist_ok=True)

    ext = p['file'].rsplit('.', 1)[-1].lower()
    new_name = f"{cat}_{slug}_floor-plan-{floor}_{p['w']}x{p['h']}.{ext}"
    dst = os.path.join(fp_dir, new_name)

    if os.path.exists(dst):
        continue

    shutil.copy2(p['path'], dst)
    # Strip EXIF, keep ICC
    try:
        img = Image.open(dst)
        icc = img.info.get('icc_profile')
        data = list(img.getdata())
        clean = Image.new(img.mode, img.size)
        clean.putdata(data)
        kw = {'quality': 95}
        if icc:
            kw['icc_profile'] = icc
        clean.save(dst, **kw)
    except Exception as e:
        pass  # Keep original if EXIF strip fails
    copied += 1

print(f"\nCopied {copied} per-floor plans")
if new_models:
    print(f"New model folders created: {new_models}")

# Summary
total_fps = 0
floor_counts = defaultdict(int)
for root, dirs, files in os.walk(BASE):
    if 'floor-plans' not in root:
        continue
    for f in files:
        total_fps += 1
        fl = f.lower()
        if '-eg_' in fl or '-eg.' in fl:
            floor_counts['EG'] += 1
        elif '-og_' in fl or '-og.' in fl:
            floor_counts['OG'] += 1
        elif '-dg_' in fl or '-dg.' in fl:
            floor_counts['DG'] += 1
        elif '-kg_' in fl or '-kg.' in fl:
            floor_counts['KG'] += 1
        else:
            floor_counts['unlabeled'] += 1

print(f"\n=== Summary ===")
print(f"Total floor plan files: {total_fps}")
print(f"Floor breakdown: {dict(floor_counts)}")

# Show per-model
print("\nPer-model floor plans:")
for cat in sorted(os.listdir(BASE)):
    cat_path = os.path.join(BASE, cat)
    if not os.path.isdir(cat_path):
        continue
    for slug in sorted(os.listdir(cat_path)):
        fp_dir = os.path.join(cat_path, slug, 'floor-plans')
        if not os.path.isdir(fp_dir):
            continue
        plans = os.listdir(fp_dir)
        if plans:
            floors = []
            for p in sorted(plans):
                for tag in ['eg', 'og', 'dg', 'kg']:
                    if f'-{tag}_' in p.lower():
                        floors.append(tag.upper())
                        break
                else:
                    floors.append('?')
            print(f"  {cat}/{slug}: {', '.join(floors)}")
