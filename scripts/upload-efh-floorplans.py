"""
Upload missing EFH (and one Stadtvilla) floor plans from Downloads folder:
- Convert to WebP
- Upload to R2
- Output efh-floorplans.json for DB linking
"""
import subprocess, json, sys
from pathlib import Path
from PIL import Image

R2_ENDPOINT = "https://294d3965b7100cc2d62ccf8cd24c588a.r2.cloudflarestorage.com"
BUCKET      = "boholz"
AWS_CLI     = r"C:\Program Files\Amazon\AWSCLIV2\aws.exe"
SRC_DIR     = Path(r"C:\Users\m\Downloads\EFH")
OUT_DIR     = Path(__file__).parent / "converted-efh-floorplans"
OUT_DIR.mkdir(exist_ok=True)

# Already uploaded (skip these):
ALREADY_DONE = {
    "EFH_HO-168-25-190_EG.jpg",
    "EFH_HO-168-25-190_OG.jpg",
    "EFH-28-194-170-oL-EG.png",
    "EFH-28-194-170-oL-OG.png",
    "EFH-ELW-173-22-190_EG.jpg",
    "EFH-ELW-173-22-190_OG.jpg",
    "EFH-115-38-125_EG.jpg",
    "EFH-115-38-125_OG.jpg",
}

# Map filename -> (modelCode, category_slug, level_slug, title, sortOrder)
FILE_MAP = [
    # 22-162-190
    ("EFH_HO-162-22-190_EG.jpg",           "22-162-190", "single-family", "ground", "Erdgeschoss",           0),
    ("EFH_HO-162-22-190_OG.jpg",           "22-162-190", "single-family", "attic",  "Dachgeschoss",          1),
    # 35-181-150
    ("EFH_HO-181-35-150_EG.jpg",           "35-181-150", "single-family", "ground", "Erdgeschoss",           0),
    ("EFH_HO-181-35-50_OG.jpg",            "35-181-150", "single-family", "attic",  "Dachgeschoss",          1),
    ("EFH-HO-181-35-150_EG-alternativ.jpg","35-181-150", "single-family", "ground-alt", "Erdgeschoss (Alternativ)", 2),
    # 38-128-125
    ("EFH-128-38-125_EG.jpg",              "38-128-125", "single-family", "ground", "Erdgeschoss",           0),
    ("EFH-128-38-125_OG.jpg",              "38-128-125", "single-family", "attic",  "Dachgeschoss",          1),
    # 38-138-125
    ("EFH-138-38-125_EG.jpg",              "38-138-125", "single-family", "ground", "Erdgeschoss",           0),
    ("EFH-138-38-125_OG.jpg",              "38-138-125", "single-family", "attic",  "Dachgeschoss",          1),
    ("EFH-138-38-125_EG-alternativ.jpg",   "38-138-125", "single-family", "ground-alt", "Erdgeschoss (Alternativ)", 2),
    # 45-139-75
    ("EFH-139-45-75_EG.jpg",              "45-139-75",  "single-family", "ground", "Erdgeschoss",            0),
    ("EFH-139-45-75_OG.jpg",              "45-139-75",  "single-family", "attic",  "Dachgeschoss",           1),
    # 22-141-190
    ("EFH-141-22-190_EG.jpg",             "22-141-190", "single-family", "ground", "Erdgeschoss",            0),
    ("EFH-141-22-190_OG.jpg",             "22-141-190", "single-family", "attic",  "Dachgeschoss",           1),
    # 35-146-150
    ("EFH-146-35-150_EG.jpg",             "35-146-150", "single-family", "ground", "Erdgeschoss",            0),
    ("EFH-146-35-150_OG.jpg",             "35-146-150", "single-family", "attic",  "Dachgeschoss",           1),
    # 28-194-170 extra variant
    ("28-194-170-mit-ELW-oL-EG-2.png",    "28-194-170", "single-family", "ground-alt", "Erdgeschoss (Variante 2)", 2),
    # Stadtvilla 22-173 alternative
    ("Stadtvilla-22-173_Alternatives-EG.jpg", "22-173", "city-villa",    "ground-alt", "Erdgeschoss (Alternativ)", 2),
]

results = []
errors  = []

for (fname, model_code, cat, level, title, sort) in FILE_MAP:
    src = SRC_DIR / fname
    if not src.exists():
        print(f"  MISSING FILE: {fname}")
        errors.append(fname)
        continue

    img = Image.open(src).convert("RGBA")
    w, h = img.size
    webp_name = f"{cat}-{model_code}-floor-plan-{level}-{w}x{h}.webp"
    local_path = OUT_DIR / webp_name
    img.save(local_path, "WEBP", quality=85)

    r2_key = f"images/models/{cat}/{model_code}/floor-plans/{webp_name}"
    cmd = [
        AWS_CLI, "s3", "cp", str(local_path),
        f"s3://{BUCKET}/{r2_key}",
        "--endpoint-url", R2_ENDPOINT,
        "--content-type", "image/webp",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  UPLOAD FAILED ({model_code} {level}): {result.stderr.strip()}")
        errors.append(fname)
        continue

    print(f"  OK  {model_code} {level}  -> {r2_key}")
    results.append({
        "modelCode": model_code,
        "path": f"/{r2_key}",
        "alt": f"Grundriss {title} {model_code}",
        "width": w,
        "height": h,
        "title": title,
        "sortOrder": sort,
    })

out_path = Path(__file__).parent / "efh-floorplans.json"
out_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
print(f"\nDone. {len(results)} uploaded, {len(errors)} failed. Written to {out_path}")
