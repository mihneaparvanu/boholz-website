#!/usr/bin/env python3
"""Find showhouse candidate images in source uploads, memory-efficient."""
import os, struct, sys

TERMS = ['muster', 'showh', 'ausstellung', 'bemusterung', 'fellbach', 'vilbel',
         'fuerth', 'fürth', 'musterhauspark', 'fertighaus', 'world-of', 'schaefer-haus',
         'verkauf', 'buero', 'büro', 'office', 'vertrieb']
BASE = 'public/to-organize/uploads'
MIN_SHORT = 800
EXTS = {'.jpg', '.jpeg', '.png', '.webp'}


def get_jpeg_size(fp):
    with open(fp, 'rb') as f:
        f.read(2)  # SOI
        while True:
            marker = f.read(2)
            if len(marker) < 2:
                return None
            if marker[0] != 0xFF:
                return None
            if marker[1] == 0xC0 or marker[1] == 0xC2:
                f.read(3)  # length + precision
                h = struct.unpack('>H', f.read(2))[0]
                w = struct.unpack('>H', f.read(2))[0]
                return w, h
            else:
                length = struct.unpack('>H', f.read(2))[0]
                f.read(length - 2)


def get_png_size(fp):
    with open(fp, 'rb') as f:
        f.read(16)  # sig + IHDR chunk header
        w = struct.unpack('>I', f.read(4))[0]
        h = struct.unpack('>I', f.read(4))[0]
        return w, h


def get_image_size(fp):
    """Read dimensions from header only — no PIL, no memory issues."""
    ext = os.path.splitext(fp)[1].lower()
    try:
        if ext in ('.jpg', '.jpeg'):
            return get_jpeg_size(fp)
        elif ext == '.png':
            return get_png_size(fp)
        elif ext == '.webp':
            with open(fp, 'rb') as f:
                header = f.read(30)
                if header[12:16] == b'VP8 ':
                    w = struct.unpack('<H', header[26:28])[0] & 0x3FFF
                    h = struct.unpack('<H', header[28:30])[0] & 0x3FFF
                    return w, h
                elif header[12:16] == b'VP8L':
                    bits = struct.unpack('<I', header[21:25])[0]
                    w = (bits & 0x3FFF) + 1
                    h = ((bits >> 14) & 0x3FFF) + 1
                    return w, h
                elif header[12:16] == b'VP8X':
                    w = struct.unpack('<I', header[24:27] + b'\x00')[0] + 1
                    h = struct.unpack('<I', header[27:30] + b'\x00')[0] + 1
                    return w, h
    except Exception:
        pass
    return None


hits = []
scanned = 0
for root, dirs, files in os.walk(BASE):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext not in EXTS:
            continue
        fl = f.lower()
        if not any(t in fl for t in TERMS):
            continue
        fp = os.path.join(root, f)
        dims = get_image_size(fp)
        if dims:
            w, h = dims
            if min(w, h) >= MIN_SHORT:
                hits.append((fp, w, h))
        scanned += 1

hits.sort(key=lambda x: x[0])
for fp, w, h in hits:
    print(f"  {w}x{h}  {fp}")
print(f"\nScanned {scanned} matching files, found {len(hits)} candidates (≥{MIN_SHORT}px)")
