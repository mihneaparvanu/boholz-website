"""
Download hero images from the provided URLs, convert to WebP, upload to R2,
output more-hero-images.json for DB linking.
"""
import subprocess, json, sys
from pathlib import Path
from PIL import Image
import urllib.request
import io

R2_ENDPOINT = "https://294d3965b7100cc2d62ccf8cd24c588a.r2.cloudflarestorage.com"
BUCKET      = "boholz"
AWS_CLI     = r"C:\Program Files\Amazon\AWSCLIV2\aws.exe"
OUT_DIR     = Path(__file__).parent / "downloaded-hero-images"
OUT_DIR.mkdir(exist_ok=True)

HERO_MAP = [
    {
        "modelCode": "0-166",
        "category":  "cube-house",
        "alt":       "Boholz Kubus 0-166 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2025/02/Kubus-166-0-0_2025.jpg",
    },
    {
        "modelCode": "22-166",
        "category":  "city-villa",
        "alt":       "Boholz Stadtvilla 22-166 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2024/01/Stadtvilla-22-166_2025.jpg",
    },
    {
        "modelCode": "35-181-150",
        "category":  "single-family",
        "alt":       "Boholz Einfamilienhaus 35-181-150 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2022/04/SchaeferHaus_EFH_181-35-150_72dpi_1500p.jpg",
    },
    # NOTE: Stadtvilla-145-22-0_1500.jpg — no matching model in DB (skipped)
    {
        "modelCode": "25-168-190",
        "category":  "single-family",
        "alt":       "Boholz Einfamilienhaus 25-168-190 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2021/08/EFH_25-168-190_weiss.jpg",
    },
    {
        "modelCode": "22-157",
        "category":  "city-villa",
        "alt":       "Boholz Stadtvilla 22-157 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2021/08/Stadtvilla_22-157-_Alternaive-Form.jpg",
    },
    {
        "modelCode": "45-139-75",
        "category":  "single-family",
        "alt":       "Boholz Einfamilienhaus 45-139-75 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2019/07/EFH-139-45-75-Hausbild.jpg",
    },
]

results = []

def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()

for entry in HERO_MAP:
    code = entry["modelCode"]
    cat  = entry["category"]
    url  = entry["url"]
    alt  = entry["alt"]

    print(f"\n{code}:")

    try:
        data = download(url)
        print(f"  Downloaded ({len(data)//1024} KB)")
    except Exception as e:
        print(f"  FAILED download: {e}")
        continue

    # Convert to WebP, max 1500px wide
    img = Image.open(io.BytesIO(data)).convert("RGB")
    if img.width > 1500:
        ratio = 1500 / img.width
        img = img.resize((1500, int(img.height * ratio)), Image.LANCZOS)
    w, h = img.size
    webp_name = f"{cat}-{code}-hero-{w}x{h}.webp"
    local_path = OUT_DIR / webp_name
    img.save(local_path, "WEBP", quality=85)
    print(f"  Converted -> {webp_name} ({w}x{h})")

    # Upload to R2
    r2_key = f"images/models/{cat}/{code}/hero/{webp_name}"
    cmd = [
        AWS_CLI, "s3", "cp", str(local_path),
        f"s3://{BUCKET}/{r2_key}",
        "--endpoint-url", R2_ENDPOINT,
        "--content-type", "image/webp",
        "--no-progress",
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        print(f"  UPLOAD FAILED: {res.stderr.strip()}")
        continue
    print(f"  Uploaded  -> {r2_key}")

    results.append({
        "modelCode":   code,
        "path":        f"/{r2_key}",
        "alt":         alt,
        "width":       w,
        "height":      h,
        "isHero":      True,
        "isThumbnail": True,
    })

out_path = Path(__file__).parent / "more-hero-images.json"
out_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
print(f"\nDone. {len(results)}/6 images processed. Written to {out_path}")
print("\nNOTE: Stadtvilla-145-22-0_1500.jpg was skipped — no matching model in DB.")
