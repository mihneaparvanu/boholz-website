"""
Download hero images from boholz-haus.de for models that exist on the old site,
convert to WebP, upload to R2, output hero-images.json for DB linking.
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

# Map: modelCode -> (category_slug, source_url, full_res_url)
HERO_MAP = [
    {
        "modelCode": "22-141-190",
        "category": "single-family",
        "url": "https://boholz-haus.de/wp-content/uploads/2019/07/EFH-141-22-190-V2.jpg",
    },
    {
        "modelCode": "22-162-190",
        "category": "single-family",
        "url": "https://boholz-haus.de/wp-content/uploads/2020/05/EFH-HO-166-22-190-Betonoptikfassade.jpg",
    },
    {
        "modelCode": "38-238-125",
        "category": "duplex",
        # Try full-res first, fall back to thumbnail
        "url": "https://boholz-haus.de/wp-content/uploads/2019/07/DH-238-38-125.jpg",
        "fallback": "https://boholz-haus.de/wp-content/uploads/2019/07/DH-238-38-125-1024x724.jpg",
    },
    {
        "modelCode": "28-264-160",
        "category": "generation-house",
        "url": "https://boholz-haus.de/wp-content/uploads/2019/06/GH-28-264-160_neu.jpg",
        "fallback": "https://boholz-haus.de/wp-content/uploads/2019/06/GH-28-264-160_neu-936x480.jpg",
    },
    {
        "modelCode": "21-349-225",
        "category": "pent-roof",
        "url": "https://boholz-haus.de/wp-content/uploads/2025/02/PDH-ELW-349-21-225_2025.jpg",
        "fallback": "https://boholz-haus.de/wp-content/uploads/2025/02/PDH-ELW-349-21-225_2025-1024x724.jpg",
    },
    {
        "modelCode": "22-173",
        "category": "city-villa",
        "url": "https://boholz-haus.de/wp-content/uploads/2025/02/Stadtvilla-170-22-0_2025.jpg",
        "fallback": "https://boholz-haus.de/wp-content/uploads/2025/02/Stadtvilla-170-22-0_2025_mobile.jpg",
    },
    {
        "modelCode": "28-182-170",
        "category": "single-family",
        "url": "https://boholz-haus.de/wp-content/uploads/2024/03/3795_BoHolzHaus_EFH_128_28_170_Kam5_03.png",
        "fallback": "https://boholz-haus.de/wp-content/uploads/2024/03/3795_BoHolzHaus_EFH_128_28_170_Kam5_03-1024x724.png",
    },
]

results = []

def download(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read()

for entry in HERO_MAP:
    code = entry["modelCode"]
    cat  = entry["category"]
    url  = entry["url"]
    fallback = entry.get("fallback")

    print(f"\n{code}:")

    # Download
    data = None
    used_url = url
    try:
        data = download(url)
        print(f"  Downloaded {url}")
    except Exception as e:
        if fallback:
            try:
                data = download(fallback)
                used_url = fallback
                print(f"  Fallback: {fallback}")
            except Exception as e2:
                print(f"  FAILED: {e2}")
                continue
        else:
            print(f"  FAILED: {e}")
            continue

    # Convert to WebP
    img = Image.open(io.BytesIO(data)).convert("RGBA")
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
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  UPLOAD FAILED: {result.stderr.strip()}")
        continue
    print(f"  Uploaded -> {r2_key}")

    results.append({
        "modelCode": code,
        "path": f"/{r2_key}",
        "alt": f"Hausbild {code}",
        "width": w,
        "height": h,
        "isHero": True,
        "isThumbnail": True,
    })

out_path = Path(__file__).parent / "new-hero-images.json"
out_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
print(f"\nDone. {len(results)} images processed. Written to {out_path}")
