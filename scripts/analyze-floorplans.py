"""
Downloads floor plan images from R2 for a given model slug,
then uses GitHub Models (GPT-4o vision) to analyze them
and infer: levelCount, bedroomCount, bathroomCount, familiesCount, hasGarage.

Usage:
  python scripts/analyze-floorplans.py [--all] [--model <slug>] [--dry-run]

Requirements:
  pip install boto3 openai python-dotenv

.env must contain:
  GITHUB_TOKEN=ghp_...
  AWS_ACCESS_KEY_ID=...
  AWS_SECRET_ACCESS_KEY=...
"""

import os
import re
import sys
import json
import base64
import argparse
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

try:
    import boto3
    from botocore.client import Config
except ImportError:
    print("Missing boto3 — run: pip install boto3")
    sys.exit(1)

try:
    from openai import OpenAI
except ImportError:
    print("Missing openai — run: pip install openai")
    sys.exit(1)

R2_ENDPOINT = "https://294d3965b7100cc2d62ccf8cd24c588a.r2.cloudflarestorage.com"
BUCKET = "boholz"
DOWNLOAD_DIR = Path("scripts/downloaded-floorplans")

# ── S3 / R2 client ────────────────────────────────────────────────────────────
s3 = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    config=Config(signature_version="s3v4"),
    region_name="auto",
)


def list_r2_images() -> list[str]:
    """Return all image keys in the bucket."""
    keys = []
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET):
        for obj in page.get("Contents", []):
            k = obj["Key"]
            if re.search(r"\.(jpg|jpeg|png|webp)$", k, re.I):
                keys.append(k)
    return keys


def download_image(key: str) -> Path:
    """Download an R2 object and return its local path."""
    local_path = DOWNLOAD_DIR / key.replace("/", "_")
    if local_path.exists():
        return local_path
    DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)
    print(f"  Downloading: {key}")
    s3.download_file(BUCKET, key, str(local_path))
    return local_path


def image_to_base64(path: Path) -> tuple[str, str]:
    """Return (base64_data, media_type)."""
    suffix = path.suffix.lower()
    media_type = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }.get(suffix, "image/jpeg")
    data = base64.standard_b64encode(path.read_bytes()).decode("utf-8")
    return data, media_type


ANALYSIS_PROMPT = """
You are analyzing floor plan images of a German residential house.

Look at the floor plan(s) provided and extract the following information:
- levelCount: total number of floors (e.g. 1 for EG only, 2 for EG+OG/DG, 3 for KG+EG+DG)
- bedroomCount: number of bedrooms (Schlafzimmer, Kinderzimmer count as bedrooms)
- bathroomCount: number of bathrooms + WCs combined (Bad, Dusche, WC)
- familiesCount: 1 normally, 2 if there are separate apartments (Einliegerwohnung/WE 1/WE 2)
- hasGarage: true if a Garage or Carport is shown in the floor plan

Return ONLY a JSON object like:
{
  "levelCount": 2,
  "bedroomCount": 3,
  "bathroomCount": 2,
  "familiesCount": 1,
  "hasGarage": false,
  "confidence": "high",
  "notes": "optional notes about what you saw"
}

If you cannot determine a value confidently, use null for that field.
"""


def analyze_images_with_github_models(image_paths: list[Path]) -> dict:
    """Send floor plan images to GPT-4o via GitHub Models and get structured room data."""
    client = OpenAI(
        base_url="https://models.inference.ai.azure.com",
        api_key=os.environ["GITHUB_TOKEN"],
    )

    content = []
    for path in image_paths[:4]:  # max 4 images per call
        try:
            data, media_type = image_to_base64(path)
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:{media_type};base64,{data}"},
            })
        except Exception as e:
            print(f"  Could not encode {path.name}: {e}")

    content.append({"type": "text", "text": ANALYSIS_PROMPT})

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": content}],
        max_tokens=512,
    )

    raw = response.choices[0].message.content.strip()
    # Extract JSON from response
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        return json.loads(match.group())
    raise ValueError(f"No JSON found in response: {raw}")


def slug_from_key(key: str) -> str | None:
    """Extract model slug from path like images/models/<cat>/<slug>/file.jpg"""
    parts = key.split("/")
    try:
        idx = parts.index("models") + 2
        return parts[idx] if idx < len(parts) - 1 else None
    except ValueError:
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="Analyze all models")
    parser.add_argument("--model", type=str, help="Only analyze this slug")
    parser.add_argument("--dry-run", action="store_true", help="List images but don't call Claude")
    args = parser.parse_args()

    if not os.environ.get("GITHUB_TOKEN"):
        print("ERROR: GITHUB_TOKEN not set in .env")
        sys.exit(1)

    print("Listing R2 images...")
    all_images = list_r2_images()
    print(f"Found {len(all_images)} images in R2")

    # Only floor-plan-style images (exclude hero/thumb/selector/exterior)
    floorplan_keys = [
        k for k in all_images
        if re.search(r"(floor|grundriss|eg|dg|og|kg|plan)", k, re.I)
        or re.search(r"(erdgeschoss|dachgeschoss|obergeschoss|keller)", k, re.I)
    ]

    if not floorplan_keys:
        print("\nNo floor plan images found by name. Using all images as fallback.")
        floorplan_keys = all_images

    # Group by model slug
    by_slug: dict[str, list[str]] = {}
    for key in floorplan_keys:
        slug = slug_from_key(key)
        if slug:
            by_slug.setdefault(slug, []).append(key)

    if args.model:
        by_slug = {k: v for k, v in by_slug.items() if k == args.model}

    print(f"\nModels with floor plan images: {list(by_slug.keys())}")

    results = {}
    for slug, keys in sorted(by_slug.items()):
        print(f"\n── {slug} ({len(keys)} images) ──")
        local_paths = [download_image(k) for k in keys]

        if args.dry_run:
            print("  [dry-run] Would analyze:", [p.name for p in local_paths])
            continue

        try:
            data = analyze_images_with_github_models(local_paths)
            results[slug] = data
            print(f"  Result: {json.dumps(data, indent=2)}")
        except Exception as e:
            print(f"  ERROR analyzing {slug}: {e}")
            results[slug] = {"error": str(e)}

    if not args.dry_run:
        output_path = Path("scripts/floorplan-analysis.json")
        output_path.write_text(json.dumps(results, indent=2, ensure_ascii=False))
        print(f"\nResults saved to {output_path}")


if __name__ == "__main__":
    main()
