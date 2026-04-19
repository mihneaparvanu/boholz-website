"""
1. Converts new floor plan images (from Downloads) to WebP
2. Uploads to R2 under the canonical path
3. Outputs a JSON file (scripts/new-floorplans.json) for the DB-linking TS script

Only processes models that are missing floor plans in R2:
  - EFH: 25-168-190, 22-173-190, 28-194-170
  - Bungalow: 22-134
  - Kubus: 0-190
  - Stadtvilla: 22-166, 22-173

Skips alternative/ELW-variant images and models already uploaded.
"""

import os, json, subprocess, sys
from pathlib import Path
from PIL import Image

DOWNLOADS = Path(os.environ["USERPROFILE"]) / "Downloads"
WORK_DIR  = Path(__file__).parent
OUT_DIR   = WORK_DIR / "converted-floorplans"
OUT_DIR.mkdir(exist_ok=True)

R2_ENDPOINT = "https://294d3965b7100cc2d62ccf8cd24c588a.r2.cloudflarestorage.com"
BUCKET      = "boholz"
AWS_CLI     = r"C:\Program Files\Amazon\AWSCLIV2\aws.exe"

# level label → human title
LEVEL_TITLES = {
    "ground":   "Erdgeschoss",
    "upper":    "Obergeschoss",
    "attic":    "Dachgeschoss",
    "basement": "Kellergeschoss",
}

# Mapping: (source_path_relative_to_DOWNLOADS, category_slug, model_code, level)
# level must be one of: ground | upper | attic | basement
PLAN_MAP = [
    # ── Einfamilienhaus 25-168-190 ─────────────────────────────────────────
    ("EFH/EFH_HO-168-25-190_EG.jpg",        "single-family", "25-168-190", "ground"),
    ("EFH/EFH_HO-168-25-190_OG.jpg",        "single-family", "25-168-190", "attic"),
    # ── Einfamilienhaus 22-173-190 (ELW) ──────────────────────────────────
    ("EFH/EFH-ELW-173-22-190_EG.jpg",       "single-family", "22-173-190", "ground"),
    ("EFH/EFH-ELW-173-22-190_OG.jpg",       "single-family", "22-173-190", "attic"),
    # ── Einfamilienhaus 28-194-170 ─────────────────────────────────────────
    ("EFH/EFH-28-194-170-oL-EG.png",        "single-family", "28-194-170", "ground"),
    ("EFH/EFH-28-194-170-oL-OG.png",        "single-family", "28-194-170", "attic"),
    # ── Bungalow 22-134 ───────────────────────────────────────────────────
    ("BU-ELW-134-22-0-EG.png",              "bungalow",      "22-134",     "ground"),
    # ── Kubus 0-190 ───────────────────────────────────────────────────────
    ("KUBUS-190-0-0_EG.jpg",                "cube-house",    "0-190",      "ground"),
    ("KUBUS-190-0-0_OG.jpg",                "cube-house",    "0-190",      "upper"),
    # ── Stadtvilla 22-166 ─────────────────────────────────────────────────
    ("STADT-VILLA/SV-166-0-0_EG.jpg",       "city-villa",    "22-166",     "ground"),
    ("STADT-VILLA/SV-166-0-0_OG.jpg",       "city-villa",    "22-166",     "upper"),
    # ── Stadtvilla 22-173 (ELW) ───────────────────────────────────────────
    ("STADT-VILLA/SV-ELW-173-22-0-EG-NEU.png", "city-villa", "22-173",    "ground"),
    ("STADT-VILLA/SV-ELW-173-22-0-OG-NEU.png", "city-villa", "22-173",    "upper"),
]

results = []

for rel_src, category, model, level in PLAN_MAP:
    src = DOWNLOADS / rel_src
    if not src.exists():
        print(f"  MISSING SOURCE: {src}")
        continue

    # Convert to WebP + get dimensions
    img = Image.open(src).convert("RGB")
    w, h = img.size
    webp_name = f"{category}-{model}-floor-plan-{level}-{w}x{h}.webp"
    local_webp = OUT_DIR / webp_name
    img.save(local_webp, "WEBP", quality=85, method=6)
    print(f"  Converted: {src.name} -> {webp_name} ({w}x{h})")

    # R2 key
    r2_key  = f"images/models/{category}/{model}/floor-plans/{webp_name}"
    r2_path = f"images/models/{category}/{model}/floor-plans/{webp_name}"

    # Upload
    cmd = [
        AWS_CLI, "s3", "cp", str(local_webp),
        f"s3://{BUCKET}/{r2_key}",
        "--endpoint-url", R2_ENDPOINT,
        "--content-type", "image/webp",
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        print(f"  UPLOAD FAILED: {proc.stderr.strip()}")
        continue
    print(f"  Uploaded -> {r2_key}")

    results.append({
        "category": category,
        "modelCode": model,
        "level": level,
        "title": LEVEL_TITLES.get(level, level),
        "path": r2_path,
        "width": w,
        "height": h,
        "sortOrder": list(LEVEL_TITLES).index(level),
    })

out_json = WORK_DIR / "new-floorplans.json"
with open(out_json, "w") as f:
    json.dump(results, f, indent=2)

print(f"\nDone. {len(results)} images processed. Written to {out_json}")
