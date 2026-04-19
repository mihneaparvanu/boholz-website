"""
Extract house model data from BOL_Gesamtkatalog_01-26.pdf using PyMuPDF (fitz).
Outputs structured JSON of all models found.
"""
import fitz
import json
import re
import sys

PDF_PATH = "public/BOL_Gesamtkatalog_01-26.pdf"

doc = fitz.open(PDF_PATH)
total_pages = len(doc)
print(f"PDF has {total_pages} pages", file=sys.stderr)

# Extract all text, page by page
pages_text = []
for i, page in enumerate(doc):
    text = page.get_text("text")
    pages_text.append({"page": i + 1, "text": text})

doc.close()

# --- Find model entries ---
# Model codes look like: EFH-120, KUB-142, STV-158, GEN-180, BGL-100, etc.
# Pattern: 2-3 uppercase letters, dash, 2-3 digits
MODEL_CODE_RE = re.compile(r'\b([A-Z]{2,4}-\d{2,4}[A-Z]?)\b')

# Collect all text as one blob, tracking which page each block came from
all_entries = []

for pt in pages_text:
    codes = MODEL_CODE_RE.findall(pt["text"])
    if codes:
        all_entries.append({
            "page": pt["page"],
            "codes": list(dict.fromkeys(codes)),  # dedupe, preserve order
            "text_snippet": pt["text"][:600].replace("\n", " ").strip()
        })

# Also dump full unique code list
all_codes = []
seen = set()
for e in all_entries:
    for c in e["codes"]:
        if c not in seen:
            all_codes.append(c)
            seen.add(c)

print(json.dumps({
    "total_pages": total_pages,
    "unique_model_codes": all_codes,
    "pages_with_models": [
        {"page": e["page"], "codes": e["codes"]}
        for e in all_entries
    ]
}, ensure_ascii=False, indent=2))
