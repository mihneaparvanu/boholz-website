"""Dump house model pages from PDF (pages 25-98)."""
import fitz, sys

PDF_PATH = "public/BOL_Gesamtkatalog_01-26.pdf"
doc = fitz.open(PDF_PATH)

# Pages 25-51 are house models (0-indexed: 24-98)
for i in range(24, min(len(doc), 51)):
    page = doc[i]
    # Try to decode with latin-1 to handle the encoding issues
    text = page.get_text("text", flags=fitz.TEXT_PRESERVE_WHITESPACE)
    text_clean = text.encode('latin-1', errors='replace').decode('latin-1')
    if text_clean.strip():
        print(f"\n{'='*60}")
        print(f"PAGE {i+1} (PDF page {i+1})")
        print('='*60)
        print(text_clean[:2000])

doc.close()
