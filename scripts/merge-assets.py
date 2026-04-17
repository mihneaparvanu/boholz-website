#!/usr/bin/env python3
"""
Merge public/sorted-assets/ into public/images/ with English name fixes.
- Renames German folder/file names to English
- Copies sorted-assets content into public/images/
- Removes empty directories
- Deletes facetune photo
- Rebuilds manifest.json
"""
import os
import shutil
import json
from pathlib import Path

BASE = Path("public/sorted-assets")
DEST = Path("public/images")

# === German → English folder renames (applied to model slug dirs) ===
FOLDER_RENAMES = {
    "kubus-172-0-0-1800": "172-0-0-1800",
    "kubus-193-0-0-1800": "193-0-0-1800",
    "kampagne-mehrfamilien": "campaign-multi-family",
    "haus-ost": "house-east",
    "10-familienhaus": "10-family-house",
    "efh-ho-169-25-190-winter-72vg": "169-25-190",
    "alternativ-166-22-0": "alternative-166-22-0",
}

# === German → English file renames (basename mapping) ===
FILE_RENAMES = {
    "horst-hellmann-foto-klein.jpg": "horst-hellmann.jpg",
}

# Files to delete
DELETE_FILES = [
    BASE / "team" / "facetune-10-03-2022-14-52-23.jpg",
]

# Mapping from sorted-assets subdirs → images subdirs
DIR_MAPPING = {
    "house-models": "models",
    "homepage": "homepage",
    "showhouses": "showhouses",
    "team": "team",
    "construction": "construction",
    "professional-photography": "photography",
    "branding": "branding",
    "banners": "banners",
    "brochures": "brochures",
}


def fix_filename(name, old_slug, new_slug):
    """Update filename when its parent slug changed."""
    if old_slug and new_slug and old_slug != new_slug:
        return name.replace(old_slug, new_slug)
    # Also check file-level renames
    if name in FILE_RENAMES:
        return FILE_RENAMES[name]
    return name


def apply_folder_renames():
    """Rename German folders in sorted-assets in-place."""
    renames_done = []
    for old_name, new_name in FOLDER_RENAMES.items():
        # Find the folder anywhere under house-models
        for dirpath, dirnames, filenames in os.walk(BASE / "house-models"):
            if old_name in dirnames:
                old_path = Path(dirpath) / old_name
                new_path = Path(dirpath) / new_name
                if old_path.exists() and not new_path.exists():
                    # First rename files inside that reference the old slug
                    for root, dirs, files in os.walk(old_path):
                        for f in files:
                            new_f = fix_filename(f, old_name, new_name)
                            if new_f != f:
                                src = Path(root) / f
                                dst = Path(root) / new_f
                                src.rename(dst)
                                renames_done.append(f"  file: {src} → {dst.name}")
                    old_path.rename(new_path)
                    renames_done.append(f"  dir:  {old_path} → {new_path}")
    return renames_done


def apply_file_renames():
    """Rename German filenames in sorted-assets."""
    renames_done = []
    for root, dirs, files in os.walk(BASE):
        for f in files:
            if f in FILE_RENAMES:
                old_path = Path(root) / f
                new_path = Path(root) / FILE_RENAMES[f]
                if old_path.exists() and not new_path.exists():
                    old_path.rename(new_path)
                    renames_done.append(f"  {old_path} → {new_path.name}")
    return renames_done


def delete_unwanted():
    """Delete files we don't want."""
    deleted = []
    for fp in DELETE_FILES:
        if fp.exists():
            fp.unlink()
            deleted.append(f"  deleted: {fp}")
    return deleted


def remove_empty_dirs():
    """Remove empty directories bottom-up."""
    removed = []
    for root, dirs, files in os.walk(BASE, topdown=False):
        for d in dirs:
            dp = Path(root) / d
            if dp.is_dir() and not any(dp.iterdir()):
                dp.rmdir()
                removed.append(f"  {dp}")
    return removed


def merge_to_images():
    """Copy sorted-assets content into public/images/."""
    copied = []
    skipped = []
    
    for src_subdir, dst_subdir in DIR_MAPPING.items():
        src_dir = BASE / src_subdir
        dst_dir = DEST / dst_subdir
        
        if not src_dir.exists():
            continue
        
        for root, dirs, files in os.walk(src_dir):
            for f in files:
                if f == ".DS_Store":
                    continue
                src_file = Path(root) / f
                # Calculate relative path from src_subdir
                rel = src_file.relative_to(src_dir)
                dst_file = dst_dir / rel
                
                if dst_file.exists():
                    skipped.append(f"  exists: {dst_file}")
                    continue
                
                dst_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_file, dst_file)
                copied.append(f"  {dst_file}")
    
    return copied, skipped


def build_manifest():
    """Build manifest.json of all images in public/images/."""
    manifest = {}
    
    for root, dirs, files in os.walk(DEST):
        for f in sorted(files):
            if f in (".DS_Store", "manifest.json"):
                continue
            fp = Path(root) / f
            rel = fp.relative_to(DEST)
            
            # Determine category from top-level dir
            parts = rel.parts
            category = parts[0] if len(parts) > 1 else "root"
            
            if category not in manifest:
                manifest[category] = []
            
            manifest[category].append({
                "path": f"/images/{rel}",
                "file": f,
            })
    
    manifest_path = DEST / "manifest.json"
    with open(manifest_path, "w") as mf:
        json.dump(manifest, mf, indent=2)
    
    total = sum(len(v) for v in manifest.values())
    return manifest_path, total, list(manifest.keys())


def main():
    print("=== Step 1: Rename German folders ===")
    renames = apply_folder_renames()
    for r in renames:
        print(r)
    print(f"  {len(renames)} renames")

    print("\n=== Step 2: Rename German filenames ===")
    file_renames = apply_file_renames()
    for r in file_renames:
        print(r)
    print(f"  {len(file_renames)} renames")

    print("\n=== Step 3: Delete unwanted files ===")
    deleted = delete_unwanted()
    for d in deleted:
        print(d)
    print(f"  {len(deleted)} deleted")

    print("\n=== Step 4: Remove empty directories ===")
    removed = remove_empty_dirs()
    for r in removed:
        print(r)
    print(f"  {len(removed)} removed")

    print("\n=== Step 5: Merge into public/images/ ===")
    copied, skipped = merge_to_images()
    for c in copied:
        print(c)
    if skipped:
        print("  Skipped (already exist):")
        for s in skipped:
            print(s)
    print(f"  {len(copied)} copied, {len(skipped)} skipped")

    print("\n=== Step 6: Build manifest ===")
    path, total, categories = build_manifest()
    print(f"  {path}: {total} images in {len(categories)} categories")
    print(f"  Categories: {', '.join(sorted(categories))}")

    print("\n=== Done ===")


if __name__ == "__main__":
    main()
