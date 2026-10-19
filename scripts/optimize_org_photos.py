"""
optimize_org_photos.py
Optimizes organization documentation photos to WebP format.
- Max width: 1200px
- Quality: 82
- Output folder: assets/organizations/
- Target size: < 250 KB
"""

import os
import sys
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(BASE_DIR, "dokumentasi-organisasi")
DEST_DIR = os.path.join(BASE_DIR, "assets", "organizations")

# Photo mapping definition
MAPPING = [
    {
        "role": "Anggota Humas",
        "period": "Periode 2024 – 2025",
        "src_file": "anggota-humas.png",
        "dest_file": "anggota-humas.webp"
    },
    {
        "role": "Wakil Ketua Himpunan",
        "period": "Periode 2025 – 2026",
        "src_file": "wakahim.jpeg",
        "dest_file": "wakil-ketua-himpunan.webp"
    },
    {
        "role": "Staff Kominfo BEM UNIMAL",
        "period": "Periode 2025 – 2026",
        "src_file": "staff-kominfo.jpeg",
        "dest_file": "staff-kominfo-bem.webp"
    }
]

def optimize_photos():
    os.makedirs(DEST_DIR, exist_ok=True)
    results = []

    for item in MAPPING:
        src_path = os.path.join(SRC_DIR, item["src_file"])
        dest_path = os.path.join(DEST_DIR, item["dest_file"])

        if not os.path.exists(src_path):
            print(f"Error: Source file not found: {src_path}", file=sys.stderr)
            continue

        with Image.open(src_path) as im:
            # Convert RGBA/P to RGB if needed for clean WebP
            if im.mode in ("RGBA", "LA"):
                # keep alpha for png or convert to RGB if fully opaque
                pass
            orig_size = im.size
            orig_bytes = os.path.getsize(src_path)

            target_width = 1200
            w, h = im.size
            new_height = int(round(h * target_width / w))

            resized = im.resize((target_width, new_height), Image.Resampling.LANCZOS)
            resized.save(dest_path, format="WEBP", quality=82, method=6)

            dest_bytes = os.path.getsize(dest_path)
            results.append({
                "role": item["role"],
                "period": item["period"],
                "src_file": item["src_file"],
                "dest_file": item["dest_file"],
                "orig_size": orig_size,
                "orig_kb": orig_bytes / 1024,
                "new_size": (target_width, new_height),
                "new_kb": dest_bytes / 1024
            })

    print("=== OPTIMIZATION RESULTS ===")
    for r in results:
        print(f"Role: {r['role']} ({r['period']})")
        print(f"  Source: {r['src_file']} ({r['orig_size'][0]}x{r['orig_size'][1]}, {r['orig_kb']:.1f} KB)")
        print(f"  Result: {r['dest_file']} ({r['new_size'][0]}x{r['new_size'][1]}, {r['new_kb']:.1f} KB)")
        print(f"  Status: {'OK (<250KB)' if r['new_kb'] < 250 else 'EXCEEDS 250KB'}\n")

if __name__ == "__main__":
    optimize_photos()

