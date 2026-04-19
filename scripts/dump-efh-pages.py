"""Dump all pages with house model data (earlier pages for Einfamilienhaus)."""
import fitz, sys

PDF_PATH = "public/BOL_Gesamtkatalog_01-26.pdf"
doc = fitz.open(PDF_PATH)

# Pages 10-25 likely contain the Einfamilienhaus models
for i in range(10, 25):
    page = doc[i]
    text = page.get_text("text", flags=fitz.TEXT_PRESERVE_WHITESPACE)
    if text.strip():
        print(f"\n{'='*60}")
        print(f"PDF PAGE {i+1}")
        print('='*60)
        print(text[:2500])

doc.close()
