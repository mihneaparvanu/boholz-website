"""
Download remaining hero images from RTF URL list, convert to WebP, upload to R2.
"""
import subprocess, json
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
        "modelCode": "28-299",
        "category":  "duplex",
        "alt":       "Boholz Doppelhaus 28-299 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2019/07/DH-299-28-0.jpg",
    },
    {
        "modelCode": "38-138-125",
        "category":  "single-family",
        "alt":       "Boholz Einfamilienhaus 38-138-125 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2024/07/EFH-138-38-125.jpg",
    },
    {
        "modelCode": "0-278",
        "category":  "cube-house",
        "alt":       "Boholz Kubus 0-278 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2019/07/Kubus-278-0-0.jpg",
    },
    {
        "modelCode": "38-128-125",
        "category":  "single-family",
        "alt":       "Boholz Einfamilienhaus 38-128-125 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2020/05/EFH-128-38-125.jpg",
    },
    {
        "modelCode": "35-146-150",
        "category":  "single-family",
        "alt":       "Boholz Einfamilienhaus 35-146-150 Außenansicht",
        "url": "https://boholz-haus.de/wp-content/uploads/2024/07/EFH-146-35-150.jpg",
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

    img = Image.open(io.BytesIO(data)).convert("RGB")
    if img.width > 1500:
        ratio = 1500 / img.width
        img = img.resize((1500, int(img.height * ratio)), Image.LANCZOS)
    w, h = img.size
    webp_name = f"{cat}-{code}-hero-{w}x{h}.webp"
    local_path = OUT_DIR / webp_name
    img.save(local_path, "WEBP", quality=85)
    print(f"  Converted -> {webp_name} ({w}x{h})")

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

out_path = Path(__file__).parent / "rtf-hero-images.json"
out_path.write_text(json.dumps(results, indent=2), encoding="utf-8")
print(f"\nDone. {len(results)}/5 images processed. Written to {out_path}")
