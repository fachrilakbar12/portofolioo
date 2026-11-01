"""
scripts/optimize_projects.py
============================
Skrip yang dapat dijalankan ulang untuk mengoptimasi gambar tangkapan layar proyek:
- Input (asli, tidak ditimpa): assets/projects/raw/
- Output teroptimasi: assets/projects/
- Format: WebP, lebar 1200px, rasio 16:10 (1200x750), dipotong dari atas (top crop)
- Kualitas awal: 82 (diturunkan bertahap bila ukuran > 200 KB)
- Target ukuran: < 200 KB
"""

import os
import sys
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "assets" / "projects" / "raw"
OUT_DIR = BASE_DIR / "assets" / "projects"

TARGET_WIDTH = 1200
TARGET_HEIGHT = 750  # Rasio 16:10
INITIAL_QUALITY = 82
MAX_BYTES = 200 * 1024  # 200 KB

PROJECTS_MAP = [
    {
        "title": "Snap Detector",
        "src": "snap-detector.png",
        "dest": "snap-detector.webp",
    },
    {
        "title": "Nusantara Aceh: 23 Negeri, Satu Tanah Rencong",
        "src": "nusantara-aceh.png",
        "dest": "nusantara-aceh.webp",
    },
    {
        "title": "SIAKAD: Sistem Informasi Data Mahasiswa",
        "src": "siakad.png",
        "dest": "siakad.webp",
    },
    {
        "title": "Life Dashboard",
        "src": "life-dashboard.png",
        "dest": "life-dashboard.webp",
    },
    {
        "title": "FRUTIX.LAB",
        "src": "frutix-lab.png",
        "dest": "frutix-lab.webp",
    },
    {
        "title": "NexaMart Customer Retention & RFM Churn Analytics",
        "src": "nexamart-retention-analytics.png",
        "dest": "nexamart-retention-analytics.webp",
    },
    {
        "title": "NexaLogix Supply: Inventory Control & Stockout Forecasting",
        "src": "nexalogix-inventory-forecasting.png",
        "dest": "nexalogix-inventory-forecasting.webp",
    },
    {
        "title": "Dashboard Kinerja Penjualan Kopi Senja (Q1 2024)",
        "src": "proyek-looker-kopi-senja.png",
        "dest": "proyek-looker-kopi-senja.webp",
    },
    {
        "title": "Laporan Penjualan Barang Pecah Belah 2025",
        "src": "proyek-sheets-pecah-belah.png",
        "dest": "proyek-sheets-pecah-belah.webp",
    },
    {
        "title": "Dashboard Data SDM",
        "src": "proyek-sheets-dashboard-sdm.png",
        "dest": "proyek-sheets-dashboard-sdm.webp",
    },
]


def optimize_project_images():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if not RAW_DIR.exists():
        print(f"ERROR: Folder sumber {RAW_DIR} tidak ditemukan.", file=sys.stderr)
        sys.exit(1)

    print("=" * 72)
    print(f"Mengoptimasi gambar proyek dari {RAW_DIR} ke {OUT_DIR}")
    print("=" * 72)

    for item in PROJECTS_MAP:
        src_path = RAW_DIR / item["src"]
        dest_path = OUT_DIR / item["dest"]

        if not src_path.exists():
            print(f"[LEWATI] Berkas asli belum tersedia: {src_path.name}")
            continue

        orig_bytes = src_path.stat().st_size
        with Image.open(src_path) as im:
            if im.mode in ("RGBA", "LA", "P"):
                im = im.convert("RGB")
            orig_w, orig_h = im.size

            # Skala proporsional ke lebar 1200px (atau minimal memenuhi tinggi 750px)
            scale = max(TARGET_WIDTH / orig_w, TARGET_HEIGHT / orig_h)
            scaled_w = int(round(orig_w * scale))
            scaled_h = int(round(orig_h * scale))
            resized = im.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)

            # Potong dari bagian atas (top-aligned crop, 1200x750)
            left = (scaled_w - TARGET_WIDTH) // 2
            top = 0
            cropped = resized.crop((left, top, left + TARGET_WIDTH, top + TARGET_HEIGHT))

            quality = INITIAL_QUALITY
            cropped.save(dest_path, format="WEBP", quality=quality, method=6)
            out_bytes = dest_path.stat().st_size

            while out_bytes > MAX_BYTES and quality > 55:
                quality -= 4
                cropped.save(dest_path, format="WEBP", quality=quality, method=6)
                out_bytes = dest_path.stat().st_size

            print(
                f"[OK] {item['title']}\n"
                f"     Asli : {src_path.name} ({orig_w}x{orig_h}, {orig_bytes / 1024:.1f} KB)\n"
                f"     WebP : {dest_path.name} ({TARGET_WIDTH}x{TARGET_HEIGHT}, {out_bytes / 1024:.1f} KB, q={quality})"
            )

    print("=" * 72)


if __name__ == "__main__":
    optimize_project_images()

