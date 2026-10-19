"""
scripts/convert_certificates.py
===============================
Skrip otomatis untuk mengonversi sertifikat (PDF & gambar) menjadi WebP:
- Thumbnail: lebar 600px, quality ~80, target < 80 KB -> assets/certificates/thumbs/
- Large: lebar 1600px, quality ~85, target < 350 KB -> assets/certificates/large/

Dapat dijalankan ulang dengan aman (melewati file yang sudah dikonversi kecuali --force).
File asli TIDAK PERNAH diubah, dipindah, atau dihapus.
"""

import os
import re
import sys
import argparse
from pathlib import Path
from PIL import Image

try:
    import pymupdf  # PyMuPDF
except ImportError:
    try:
        import fitz as pymupdf
    except ImportError:
        print("ERROR: PyMuPDF tidak ditemukan. Pasang dengan: pip install pymupdf pillow")
        sys.exit(1)


def sanitize_filename(filename: str) -> str:
    """Mengubah nama file asli menjadi slug bersih: huruf kecil, angka, dan tanda hubung."""
    stem = Path(filename).stem
    # Ganti karakter non alfanumerik dengan tanda hubung
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', stem).strip('-').lower()
    # Hindari tanda hubung beruntun
    slug = re.sub(r'-+', '-', slug)
    return slug + ".webp"


def convert_pdf_page_to_image(pdf_path: str, page_number: int = 0, dpi: int = 200) -> Image.Image:
    """Merender halaman pertama PDF pada resolusi ~200 DPI dan mengembalikan objek PIL Image."""
    doc = pymupdf.open(pdf_path)
    if len(doc) == 0:
        doc.close()
        raise ValueError(f"PDF kosong: {pdf_path}")
    page = doc[page_number]
    zoom = dpi / 72.0  # default 72 points per inch
    matrix = pymupdf.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    doc.close()
    return img


def save_optimized_webp(img: Image.Image, out_path: str, target_width: int, initial_quality: int, max_bytes: int):
    """Menyesuaikan ukuran gambar sesuai lebar target dan menyimpannya sebagai WebP teroptimasi."""
    # Hitung tinggi proporsional
    orig_w, orig_h = img.size
    if orig_w > target_width:
        target_height = int(orig_h * (target_width / orig_w))
        resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    else:
        resized = img.copy()

    quality = initial_quality
    out_dir = os.path.dirname(out_path)
    os.makedirs(out_dir, exist_ok=True)

    # Simpan WebP dengan kompresi kualitas
    resized.save(out_path, format="WEBP", quality=quality, method=6)
    size = os.path.getsize(out_path)

    # Jika melebihi batas target, turunkan kualitas bertahap
    while size > max_bytes and quality > 60:
        quality -= 5
        resized.save(out_path, format="WEBP", quality=quality, method=6)
        size = os.path.getsize(out_path)

    return size, quality


def main():
    parser = argparse.ArgumentParser(description="Konversi sertifikat PDF/gambar ke WebP.")
    parser.add_argument("--source", default=r"css/sertifikat-for-fortolio", help="Folder sumber file sertifikat")
    parser.add_argument("--thumbs", default=r"assets/certificates/thumbs", help="Folder output thumbnail")
    parser.add_argument("--large", default=r"assets/certificates/large", help="Folder output gambar besar")
    parser.add_argument("--force", action="store_true", help="Paksa konversi ulang file yang sudah ada")
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    source_dir = project_root / args.source
    thumbs_dir = project_root / args.thumbs
    large_dir = project_root / args.large

    if not source_dir.exists():
        print(f"ERROR: Folder sumber tidak ditemukan: {source_dir}")
        sys.exit(1)

    thumbs_dir.mkdir(parents=True, exist_ok=True)
    large_dir.mkdir(parents=True, exist_ok=True)

    allowed_exts = {".pdf", ".jpg", ".jpeg", ".png", ".webp"}
    raw_files = [f for f in sorted(os.listdir(source_dir)) if Path(f).suffix.lower() in allowed_exts]

    print("=" * 60)
    print(f"Memproses {len(raw_files)} file sertifikat dari: {source_dir}")
    print("=" * 60)

    converted_count = 0
    skipped_count = 0

    for idx, fname in enumerate(raw_files, 1):
        src_path = str(source_dir / fname)
        slug_name = sanitize_filename(fname)
        thumb_out = str(thumbs_dir / slug_name)
        large_out = str(large_dir / slug_name)

        thumb_exists = os.path.exists(thumb_out)
        large_exists = os.path.exists(large_out)

        if thumb_exists and large_exists and not args.force:
            print(f"[{idx}/{len(raw_files)}] LEWATI (sudah ada): {slug_name}")
            skipped_count += 1
            continue

        print(f"[{idx}/{len(raw_files)}] Mengonversi: {fname} -> {slug_name}")
        ext = Path(fname).suffix.lower()

        try:
            if ext == ".pdf":
                img = convert_pdf_page_to_image(src_path, page_number=0, dpi=200)
            else:
                img = Image.open(src_path)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")

            # 1. Simpan Thumbnail (lebar 600px, kualitas ~80, target < 80 KB)
            t_size, t_q = save_optimized_webp(img, thumb_out, target_width=600, initial_quality=80, max_bytes=80 * 1024)

            # 2. Simpan Gambar Besar (lebar 1600px, kualitas ~85, target < 350 KB)
            l_size, l_q = save_optimized_webp(img, large_out, target_width=1600, initial_quality=85, max_bytes=350 * 1024)

            print(f"       -> Thumb: {t_size/1024:.1f} KB (q={t_q}) | Large: {l_size/1024:.1f} KB (q={l_q})")
            converted_count += 1
        except Exception as e:
            print(f"       [ERROR] Gagal memproses {fname}: {e}")

    print("=" * 60)
    print(f"Selesai! Dikonversi: {converted_count}, Dilewati: {skipped_count}, Total: {len(raw_files)}")
    print("=" * 60)


if __name__ == "__main__":
    main()

