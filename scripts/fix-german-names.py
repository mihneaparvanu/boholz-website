#!/usr/bin/env python3
"""Fix remaining German words in sorted-assets model slugs and filenames.

German remnants found:
  - kubus → cube (in slug names)
  - kampagne-mehrfamilien → campaign-multi-family
  - haus-ost → house-east
  - efh-ho → sfh (single-family-house abbreviation, but cleaner)
  - alternativ → alternative
  - foto-klein → photo-small
  - bungalow/bungalow → redundant slug
  - 10-familienhaus → 10-family-house
  Town names (dombuehl, satteldorf-nord, ilshofen) kept as-is — proper nouns.
"""
import os, re, shutil, json
from PIL import Image

BASE = "public/sorted-assets"
MODELS_DIR = os.path.join(BASE, "house-models")

# Slug-level translations (applied to folder names and filenames)
SLUG_RENAMES = {
    # kubus in slug → cube
    "kubus-172-0-0-1800": "cube-172-0-0-1800",
    "kubus-193-0-0-1800": "cube-193-0-0-1800",
    # kampagne-mehrfamilien → campaign-multi-family
    "kampagne-mehrfamilien": "campaign-multi-family",
    # haus-ost → house-east
    "haus-ost": "house-east",
    # efh-ho-169-25-190-winter-72vg → too long/messy, simplify
    "efh-ho-169-25-190-winter-72vg": "169-25-190",
    # alternativ-166-22-0 → just 166-22-0-alt
    "alternativ-166-22-0": "166-22-0-alt",
    # 10-familienhaus → 10-family
    "10-familienhaus": "10-family",
    # ilshofen stays (town name)
    # mehrfamilienhaus-ilshofen was already cleaned to ilshofen
}

# Filename substring replacements
FILENAME_FIXES = {
    "foto-klein": "photo-small",
    "kubus-": "cube-",
    "kampagne-mehrfamilien": "campaign-multi-family",
    "haus-ost": "house-east",
    "efh-ho-169-25-190-winter-72vg": "169-25-190",
    "alternativ-166-22-0": "166-22-0-alt",
    "10-familienhaus": "10-family",
}

# ── Dry run: show what will change ──
print("=== Slug renames ===")
changes = []
for cat in sorted(os.listdir(MODELS_DIR)):
    cat_path = os.path.join(MODELS_DIR, cat)
    if not os.path.isdir(cat_path):
        continue
    for slug in sorted(os.listdir(cat_path)):
        slug_path = os.path.join(cat_path, slug)
        if not os.path.isdir(slug_path):
            continue
        new_slug = SLUG_RENAMES.get(slug, slug)
        if new_slug != slug:
            print(f"  {cat}/{slug} → {cat}/{new_slug}")
            changes.append((cat, slug, new_slug))

print(f"\n=== Filename fixes (preview) ===")
file_fixes = []
for cat in sorted(os.listdir(MODELS_DIR)):
    cat_path = os.path.join(MODELS_DIR, cat)
    if not os.path.isdir(cat_path):
        continue
    for slug in sorted(os.listdir(cat_path)):
        slug_path = os.path.join(cat_path, slug)
        if not os.path.isdir(slug_path):
            continue
        for root, dirs, files in os.walk(slug_path):
            for fname in files:
                new_fname = fname
                for old, new in FILENAME_FIXES.items():
                    new_fname = new_fname.replace(old, new)
                if new_fname != fname:
                    print(f"  {fname} → {new_fname}")
                    file_fixes.append((os.path.join(root, fname), os.path.join(root, new_fname)))

# Also fix site assets
print(f"\n=== Site asset filename fixes ===")
site_fixes = []
SITE_FOLDERS = ["team", "showhouses", "homepage", "professional-photography",
                "construction"]
for folder in SITE_FOLDERS:
    fpath = os.path.join(BASE, folder)
    if not os.path.isdir(fpath):
        continue
    for fname in sorted(os.listdir(fpath)):
        new_fname = fname
        for old, new in FILENAME_FIXES.items():
            new_fname = new_fname.replace(old, new)
        if new_fname != fname:
            print(f"  {folder}/{fname} → {new_fname}")
            site_fixes.append((os.path.join(fpath, fname), os.path.join(fpath, new_fname)))

# ── Execute ──
print(f"\n=== Executing ===")

# 1. Rename files first (within old slug dirs)
for old_path, new_path in file_fixes + site_fixes:
    if os.path.exists(old_path):
        os.makedirs(os.path.dirname(new_path), exist_ok=True)
        os.rename(old_path, new_path)
        
# 2. Rename slug directories  
for cat, old_slug, new_slug in changes:
    old_dir = os.path.join(MODELS_DIR, cat, old_slug)
    new_dir = os.path.join(MODELS_DIR, cat, new_slug)
    if os.path.exists(old_dir):
        # Also rename files inside that reference the old slug
        for root, dirs, files in os.walk(old_dir):
            for fname in files:
                new_fname = fname.replace(old_slug, new_slug)
                if new_fname != fname:
                    os.rename(os.path.join(root, fname), os.path.join(root, new_fname))
        os.rename(old_dir, new_dir)
        print(f"  Renamed {cat}/{old_slug} → {cat}/{new_slug}")

print("  Done")

# ── Verify: any German words left? ──
print(f"\n=== Remaining German check ===")
german_words = ["kubus", "kampagne", "mehrfamilien", "haus-ost", "alternativ",
                "familienhaus", "foto-klein", "grundriss", "efh-"]
found_any = False
for root, dirs, files in os.walk(BASE):
    for name in dirs + files:
        if name in ("manifest.json", "NOTES.md", ".DS_Store"):
            continue
        lower = name.lower()
        for word in german_words:
            if word in lower:
                rel = os.path.relpath(os.path.join(root, name), BASE)
                print(f"  FOUND: {rel} (contains '{word}')")
                found_any = True
if not found_any:
    print("  Clean! No German words found.")
