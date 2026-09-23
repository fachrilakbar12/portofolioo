"""
app.py – Simple local development server untuk portfolio static.
Jalankan: python app.py
Buka di browser: http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Tampilkan log yang lebih bersih
        print(f"  [{self.address_string()}] {format % args}")


if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n{'='*45}")
        print(f"  Portfolio Fachril Akbar — Dev Server")
        print(f"  Buka di browser: {url}")
        print(f"  Tekan Ctrl+C untuk stop")
        print(f"{'='*45}\n")
        webbrowser.open(url)
        httpd.serve_forever()
