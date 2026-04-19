"""Dump raw text from first 15 pages of the PDF to understand structure."""
import fitz, sys

PDF_PATH = "public/BOL_Gesamtkatalog_01-26.pdf"
doc = fitz.open(PDF_PATH)

for i in range(min(15, len(doc))):
    page = doc[i]
    text = page.get_text("text").strip()
    if text:
        print(f"\n{'='*60}")
        print(f"PAGE {i+1}")
        print('='*60)
        print(text[:1200])

doc.close()
