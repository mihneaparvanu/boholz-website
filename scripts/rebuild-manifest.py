#!/usr/bin/env python3
"""Rebuild manifest.json from the current sorted-assets folder structure."""
import os, json
from PIL import Image

BASE = "sorted-assets"
MODELS_DIR = os.path.join(BASE, "house-models")
SITE_FOLDERS = ["team", "showhouses", "homepage", "professional-photography", "branding", "banners", "brochures", "construction"]

manifest = {}

# Scan house models
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
                except:
                    w, h, fmt = 0, 0, fname.rsplit(".", 1)[-1]
                entry["images"].append({
                    "filename": fname,
                    "path": os.path.relpath(fpath, BASE),
                    "type": img_type,
                    "alt": f"{cat} {slug} {img_type}",
                    "width": w, "height": h, "format": fmt,
                })
        manifest[key] = entry

# Scan site-wide folders
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
        except:
            w, h, fmt = 0, 0, fname.rsplit(".", 1)[-1]
        images.append({
            "filename": fname,
            "path": os.path.relpath(fpath, BASE),
            "type": folder,
            "alt": fname.rsplit(".", 1)[0].replace("-", " ").replace("_", " "),
            "width": w, "height": h, "format": fmt,
        })
    site_assets[folder] = {"category": "site", "folder": folder, "images": images}

manifest["_site_assets"] = site_assets

with open(os.path.join(BASE, "manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

total_models = len([k for k in manifest if not k.startswith("_")])
total_model_imgs = sum(len(v["images"]) for k, v in manifest.items() if not k.startswith("_"))
total_site = sum(len(v["images"]) for v in site_assets.values())
print(f"Manifest: {total_models} house models ({total_model_imgs} images), {total_site} site assets across {len(site_assets)} folders")
