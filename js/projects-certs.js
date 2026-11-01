/**
 * projects-certs.js – Project & Certificate Interactive Showcase
 * - Project details modal
 * - Dynamic Certificate Gallery from data/certificates.json
 * - Category filtering (Semua, AI, Web, Organisasi)
 * - 9-item pagination toggle (Tampilkan Lebih Banyak / Lebih Sedikit)
 * - Accessible Full-Featured Lightbox (Prev/Next loop, Keyboard, Touch swipe, Focus trap)
 */

'use strict';

/* ══════════════════════════════════════════════════
   PROJECT DETAILS DATA & MODAL
   ══════════════════════════════════════════════════ */
const PROJECTS_DATA = {
  snapDetector: {
    title: 'Snap Detector',
    category: 'Riset & AI',
    period: '2025 — 2026',
    badge: 'Proyek Unggulan',
    description: 'Aplikasi desktop pendeteksi deepfake real-time berbasis Xception dan YOLO dengan antarmuka PyQt6. Mengklasifikasikan wajah REAL atau DEEPFAKE dari gambar, video, layar, dan kamera, dilengkapi visualisasi Grad-CAM dan riwayat pemindaian.',
    summary: 'Aplikasi desktop pendeteksi deepfake yang menganalisis gambar, video, tangkapan layar, dan kamera secara real-time.',
    approach: 'YOLOv11 melokalisasi wajah pada frame; Xception (Depthwise Separable Convolutions) mengekstrak artefak frekuensi tinggi dan inkonsistensi tekstur kulit; Grad-CAM menampilkan heatmap pada area manipulasi; worker multi-thread (MSS dan QThread) menjaga antarmuka tetap responsif.',
    highlights: [
      'Klasifikasi REAL atau DEEPFAKE dengan skor probabilitas dan ambang sigmoid 0,50.',
      'Unggah gambar atau video; pantau layar dan kamera.',
      'Riwayat pemindaian tersimpan di history.json.',
      'Antarmuka PyQt6 bertema Cyber-Orange.'
    ],
    note: 'Tautan demo membuka halaman presentasi proyek. Aplikasi desktop dijalankan di komputer lokal dengan TensorFlow.',
    tech: ['Python', 'PyQt6', 'TensorFlow', 'Xception', 'YOLO'],
    demo: 'https://fachrilakbar12.github.io/Snap-Detector/',
    repo: 'https://github.com/fachrilakbar12/Snap-Detector',
    github: 'https://github.com/fachrilakbar12/Snap-Detector'
  },
  nusantaraAceh: {
    title: 'Nusantara Aceh: 23 Negeri, Satu Tanah Rencong',
    category: 'Aplikasi Web',
    period: '2026',
    badge: 'Aplikasi Web',
    description: 'Peta 3D interaktif yang mengangkat budaya, tari, musik, kuliner, dan sejarah dari 23 kabupaten dan kota di Provinsi Aceh, dirancang sebagai diorama kertas berlapis.',
    summary: 'Peta 3D interaktif yang mengangkat kekayaan budaya dari 23 kabupaten dan kota di Aceh.',
    highlights: [
      'Diorama 23 wilayah (18 kabupaten dan 5 kota) berlapis kertas dengan landmark khas dan pegunungan Bukit Barisan.',
      'Musik dengan lima instrumen (Rapa\'i, Bambu Gayo, Gong Alas, Rebana, dan petikan Bungong Jeumpa).',
      'Pencarian wilayah dan filter wilayah (Pesisir Utara–Timur, Gayo–Alas, Barat–Selatan, Kepulauan).',
      'Tur otomatis 23 negeri.',
      'Pengaturan suasana (tersedia mode malam).',
      'Catatan khazanah budaya (tari tradisional, sejarah kesultanan, kearifan smong, kopi Gayo, motif Aceh).'
    ],
    tech: ['Three.js', 'WebGL', 'Next.js'],
    demo: 'https://nusantara-aceh-gis.vercel.app/',
    repo: 'https://github.com/fachrilakbar12/nusantara-aceh-gis',
    github: 'https://github.com/fachrilakbar12/nusantara-aceh-gis'
  },
  siakad: {
    title: 'SIAKAD: Sistem Informasi Data Mahasiswa',
    category: 'Aplikasi Web',
    period: '2024 — 2026',
    badge: 'Aplikasi Web',
    description: 'Simulasi web dari aplikasi desktop Java untuk manajemen data mahasiswa dengan MySQL melalui JDBC, mencakup operasi CRUD, pencarian dan filter, ekspor CSV dan JSON, serta audit kueri.',
    summary: 'Simulasi web dari sistem informasi data mahasiswa yang terhubung ke MySQL melalui JDBC pada versi desktop Java.',
    highlights: [
      'Login administrator.',
      'Ringkasan pangkalan data (total mahasiswa, rata-rata IPK, mahasiswa aktif, cumlaude).',
      'Tambah, ubah, dan hapus data (CRUD) dengan konfirmasi.',
      'Pencarian, filter program studi dan status, serta pengurutan.',
      'Ekspor CSV dan JSON.',
      'Cetak laporan rekap.',
      'Kartu tanda mahasiswa (KTM).',
      'Konsol audit kueri.'
    ],
    architecture: 'Pola MVC dengan lapisan DAO (Mahasiswa, MahasiswaDAO, DatabaseConnection, MainFrame); skema tabel mahasiswa dengan indeks pada program studi, status, dan nama.',
    note: 'Halaman demo adalah simulasi dengan data contoh.',
    tech: ['Java', 'MySQL', 'JDBC', 'MVC'],
    demo: 'https://fachrilakbar12.github.io/manajemen-data-mahasiswa/',
    repo: 'https://github.com/fachrilakbar12/manajemen-data-mahasiswa',
    github: 'https://github.com/fachrilakbar12/manajemen-data-mahasiswa'
  },
  lifeDashboard: {
    title: 'Life Dashboard',
    category: 'Aplikasi Web',
    period: '2026',
    badge: 'Aplikasi Web',
    description: 'Dasbor produktivitas harian berisi sapaan dan jam, timer fokus 25 menit, tautan cepat, dan daftar tugas, lengkap dengan mode gelap.',
    highlights: [
      'Sapaan dinamis dan jam digital real-time.',
      'Timer fokus Pomodoro 25 menit dengan kontrol mulai, jeda, dan atur ulang.',
      'Manajemen tautan cepat (quick links) dan daftar tugas harian.',
      'Dukungan mode terang dan gelap.'
    ],
    tech: ['HTML', 'CSS', 'JavaScript'],
    demo: 'https://fachrilakbar12.github.io/CodingCamp-5Oktober26-fachrilakbar/',
    repo: 'https://github.com/fachrilakbar12/CodingCamp-5Oktober26-fachrilakbar',
    github: 'https://github.com/fachrilakbar12/CodingCamp-5Oktober26-fachrilakbar',
    image: 'assets/projects/life-dashboard.webp'
  },
  frutixLab: {
    title: 'FRUTIX.LAB',
    category: 'Aplikasi Web',
    period: '2026',
    badge: 'Aplikasi Web',
    description: 'Situs edukasi sains nutrisi buah: katalog buah, perbandingan makan utuh dan jus, Fruit Fusion Lab, konsultasi buah, dan kalkulator porsi harian.',
    highlights: [
      'Katalog buah interaktif dengan anatomi irisan dan profil nutrisi.',
      'Perbandingan ilmiah antara konsumsi buah utuh dan dijus.',
      'Fitur Fruit Fusion Lab, konsultasi buah, dan kalkulator porsi harian.'
    ],
    tech: ['HTML', 'CSS', 'JavaScript'],
    demo: 'https://fachrilakbar12.github.io/frutixlab-web/',
    repo: 'https://github.com/fachrilakbar12/frutixlab-web',
    github: 'https://github.com/fachrilakbar12/frutixlab-web',
    image: 'assets/projects/frutix-lab.webp'
  },
  nexamartRetention: {
    title: 'NexaMart Customer Retention & RFM Churn Analytics',
    category: 'Analitik Data',
    period: '2026',
    badge: 'Analitik Data',
    description: 'Dasbor analitik retensi pelanggan dengan matriks kohor, segmentasi RFM, dan simulator penyelamatan churn, dilengkapi kueri SQL dan skrip Python.',
    highlights: [
      'Matriks retensi kohor bulanan untuk evaluasi retensi pelanggan.',
      'Segmentasi pelanggan berbasis RFM (Recency, Frequency, Monetary).',
      'Simulator penyelamatan churn serta dokumentasi pipeline SQL dan Python.'
    ],
    tech: ['SQL', 'Python', 'Chart.js'],
    demo: 'https://fachrilakbar12.github.io/nexamart-retention-analytics/',
    repo: 'https://github.com/fachrilakbar12/nexamart-retention-analytics',
    github: 'https://github.com/fachrilakbar12/nexamart-retention-analytics',
    image: 'assets/projects/nexamart-retention-analytics.webp'
  },
  nexalogixInventory: {
    title: 'NexaLogix Supply: Inventory Control & Stockout Forecasting',
    category: 'Analitik Data',
    period: '2026',
    badge: 'Analitik Data',
    description: 'Dasbor pengendalian persediaan dengan klasifikasi ABC-XYZ, kalkulator reorder point dan safety stock, serta simulator service level.',
    highlights: [
      'Matriks klasifikasi inventaris ABC-XYZ interaktif.',
      'Kalkulator Reorder Point (ROP) dan Safety Stock.',
      'Simulator service level gudang dengan integrasi kueri SQL dan skrip Python.'
    ],
    tech: ['SQL', 'Python', 'Chart.js'],
    demo: 'https://fachrilakbar12.github.io/inventory-control-stockout-forecasting/',
    repo: 'https://github.com/fachrilakbar12/inventory-control-stockout-forecasting',
    github: 'https://github.com/fachrilakbar12/inventory-control-stockout-forecasting',
    image: 'assets/projects/nexalogix-inventory-forecasting.webp'
  },
  kopiSenjaLooker: {
    title: 'Dashboard Kinerja Penjualan Kopi Senja (Q1 2024)',
    category: 'Dashboard & Spreadsheet',
    period: '2024',
    badge: 'Dashboard & Spreadsheet',
    description: 'Dashboard Looker Studio yang merangkum kinerja penjualan Kopi Senja pada kuartal pertama 2024.',
    highlights: [
      'Ringkasan KPI pendapatan dan jumlah transaksi Q1 2024.',
      'Visualisasi tren penjualan bulanan, distribusi kategori produk, dan metode pembayaran.'
    ],
    tech: ['Looker Studio'],
    link: 'https://lookerstudio.google.com/reporting/b7b85cb0-4e8d-4e87-9bc4-8f11769e08d8',
    image: 'assets/projects/proyek-looker-kopi-senja.webp'
  },
  pecahBelahSheets: {
    title: 'Laporan Penjualan Barang Pecah Belah 2025',
    category: 'Dashboard & Spreadsheet',
    period: '2025',
    badge: 'Dashboard & Spreadsheet',
    description: 'Laporan penjualan 2025 untuk peralatan makan dan minum (cangkir, piring, mangkuk, gelas) berisi data transaksi dan satu lembar dashboard.',
    highlights: [
      'Lembar data transaksi penjualan peralatan makan dan minum tahun 2025.',
      'Lembar dashboard interaktif berisi KPI, tren penjualan bulanan, dan proporsi kategori.'
    ],
    tech: ['Google Sheets'],
    link: 'https://docs.google.com/spreadsheets/d/1suxmDFy_FXggFfPgBBUK_Ug3RIFgLvAn68iy6uyjSqM/edit?usp=sharing',
    image: 'assets/projects/proyek-sheets-pecah-belah.webp'
  },
  dashboardSdmSheets: {
    showModalImage: true,
    title: 'Dashboard Data SDM (PT Contoh Nusantara)',
    category: 'Dashboard & Spreadsheet · HR Analytics',
    period: 'November 2026',
    badge: 'Dashboard & Spreadsheet',
    summary: 'Sistem informasi dan dashboard analitik Sumber Daya Manusia (SDM) terintegrasi berbasis Google Sheets untuk memantau 80 karyawan aktif lintas 5 divisi operasional (Keuangan, Operasional, Pemasaran, SDM, dan Teknologi Informasi). Dirancang dalam lima lembar kerja saling terhubung yang mencakup basis data master karyawan, pusat analisis & pivot kepegawaian, dashboard visual interaktif, laporan eksekutif manajemen, hingga standar operasional prosedur (SOP) tata kelola arsip.',
    approachLabel: 'Arsitektur 5 Lembar Kerja Terintegrasi:',
    approach: 'Mengintegrasikan pencatatan operasional HR dengan pelaporan eksekutif secara otomatis menggunakan formula dinamis, fitur pencarian cepat ID karyawan, validasi data (dropdown chip), peringatan dini masa berakhir kontrak (<60 hari), serta kontrol filter (slicer) interaktif berdasarkan divisi dan status kepegawaian.',
    highlightsLabel: 'Rincian Isi & Fitur Utama:',
    highlights: [
      'Kartu Indikator Kinerja Utama (KPI SDM): Memantau secara real-time Total Karyawan (80 orang), Kontrak Segera Berakhir (14 orang dengan indikator peringatan merah), Rata-Rata Masa Kerja (2,9 tahun), dan Total Sisa Cuti (643 hari).',
      'Visualisasi Grafik & Slicer Interaktif (Tab Dashboard SDM): Menampilkan Grafik Batang Distribusi Karyawan per Divisi (Teknologi Informasi 22, Operasional 20, Keuangan 14, Pemasaran 14, SDM 10), Grafik Donat Komposisi Status Kepegawaian (Tetap 60%, Kontrak 27,5%, Magang 12,5%), dan Grafik Garis Tren Rekrutmen Tahunan (2019–2026), dilengkapi kontrol Filter Divisi dan Filter Status Kepegawaian.',
      'Basis Data Master & Pencarian Cepat (Tab Data Karyawan): Memuat 80 data personel (KRY-001 s.d. KRY-080) lengkap dengan fitur Cari ID Karyawan instan serta kalkulasi otomatis masa kerja, sisa hak cuti tahunan, dan status peringatan kontrak (Aman / Segera Berakhir).',
      'Pusat Analisis & Pivot Kepegawaian (Tab Analisis & Pivot): Menyajikan tabel rekapitulasi jumlah karyawan per divisi, proporsi status kepegawaian (48 Tetap, 22 Kontrak, 10 Magang), serta tren pertumbuhan rekrutmen dari tahun 2019 hingga 2026.',
      'Laporan Eksekutif & Tata Kelola Arsip (Tab Laporan Eksekutif & Petunjuk): Menyediakan ringkasan eksekutif, temuan kunci, rekomendasi strategis manajemen (evaluasi 14 kontrak yang segera berakhir dan penjadwalan cuti bergilir), serta SOP struktur direktori dan standar penamaan berkas SDM.'
    ],
    tech: ['Google Sheets', 'HR Analytics', 'Pivot Table & Slicer', 'Dynamic Formulas', 'Executive Reporting'],
    link: 'https://docs.google.com/spreadsheets/d/1jYpdDnrPZSEBT9Aj5tU071HDcmwUVgBmTtVh9iOcGkw/edit?usp=sharing',
    image: 'assets/projects/proyek-sheets-dashboard-sdm.webp'
  },
  desainKepemerintahan: {
    isDesign: true,
    title: 'Desain Media Pemerintahan: Penguatan Kepercayaan Publik (Kemenkominfo RI)',
    category: 'Desain & Publikasi · Kehumasan Instansi',
    period: '2026',
    badge: 'Humas & Komunikasi Pemerintah',
    image: 'assets/projects/desain/desain-kepemerintahan.jpg',
    summary: 'Rancangan materi publisitas strategis bertajuk "Boost Public Trust with Government Media Designs" yang merepresentasikan wajah komunikasi digital Kementerian Komunikasi dan Informatika RI. Dalam fungsi kehumasan pemerintah (Government Public Relations), keseragaman identitas visual dan kualitas penyampaian informasi di media sosial menjadi instrumen utama untuk merawat kepercayaan publik (public trust) serta menjembatani kebijakan negara dengan masyarakat luas.',
    approachLabel: 'Strategi Komunikasi & Kehumasan:',
    approach: 'Mengemas empat isu prioritas pemerintah ke dalam format feed Instagram (4:5) yang informatif, transparan, dan mudah dipahami publik. Menggunakan visualisasi mockup perangkat seluler yang menampilkan profil resmi Kementerian Komunikasi dan Informatika (1.822 unggahan, 2,5 juta pengikut) dengan empat kartu konten tematik yang melayang keluar dari layar sebagai simbol keterbukaan informasi publik.',
    highlightsLabel: 'Bedah Isi & Pesan Utama Visual:',
    highlights: [
      'Tajuk Utama Persuasif: "BOOST PUBLIC TRUST WITH GOVERNMENT MEDIA DESIGNS" dengan tipografi bold sans-serif putih di atas latar biru institusional yang memancarkan kewibawaan dan kredibilitas.',
      'Pilar Publikasi 1 — Spirit Pembangunan: Visualisasi pidato kepemimpinan nasional dengan bendera Merah Putih dan podium Garuda untuk mengomunikasikan arah pembangunan nasional.',
      'Pilar Publikasi 2 — Indonesia Sehat: Edukasi layanan kesehatan masyarakat bersama figur tenaga medis profesional dan simbol palang kesehatan hijau.',
      'Pilar Publikasi 3 — Infrastruktur Untuk Negeri: Publikasi transparansi pembangunan jalan layang/tol nasional bersama insinyur lapangan dan cetak biru (blueprint) konstruksi.',
      'Pilar Publikasi 4 — Peduli Pajak: Kampanye literasi dan kepatuhan pajak digital melalui ilustrasi aplikasi pembayaran, koin, dan kalender jatuh tempo.',
      'Atribut Resmi & Saluran Pengaduan Publik: Dilengkapi logo resmi Kementerian Komunikasi dan Informatika, alamat kantor (Jl. Medan Merdeka Barat No. 9, Jakarta Pusat), QR Code akses cepat, serta kontak layanan masyarakat via WhatsApp (+62 811-1234-567) dan telepon (+62 811-9876-543).'
    ],
    architectureLabel: 'Direksi Kreatif & Tata Letak (Feed 4:5):',
    architecture: 'Menggunakan komposisi simetris 3D perspective showcase pada rasio feed Instagram 4:5 (1080×1350 piksel) dengan palet warna Institutional Royal Blue yang mencerminkan integritas, stabilitas, dan profesionalisme birokrasi.',
    techLabel: 'Kompetensi Kehumasan & Tools:',
    tech: ['Humas Pemerintah', 'Komunikasi Publik', 'Social Media Branding', 'Visual Storytelling', 'Canva / Photoshop'],
    noteLabel: 'Sasaran Audiens & Dampak Publikasi:',
    note: 'Ditujukan bagi masyarakat umum, warganet, dan pemangku kepentingan guna memperkuat citra lembaga pemerintah yang terbuka, komunikatif, serta responsif terhadap kebutuhan informasi warga.'
  },
  dokumentasiRapat: {
    isDesign: true,
    title: 'Publikasi Dokumentasi Sidang Paripurna DPR RI',
    category: 'Desain & Publikasi · Humas Kelembagaan',
    period: '12 November 2026',
    badge: 'Dokumentasi & Humas Parlemen',
    image: 'assets/projects/desain/dokumentasi-rapat.jpg',
    summary: 'Karya publikasi visual kehumasan untuk peliputan dan dokumentasi kelembagaan negara bertajuk "Dokumentasi Sidang Paripurna — 12 November 2026". Dalam tugas kehumasan dan keprotokolan parlemen, publikasi dokumentasi persidangan merupakan bentuk akuntabilitas serta keterbukaan informasi kepada rakyat terkait jalannya fungsi legislasi, anggaran, dan pengawasan.',
    approachLabel: 'Strategi Komunikasi & Kehumasan:',
    approach: 'Mengemas foto dokumentasi persidangan yang bersifat formal menjadi konten media sosial bergaya editorial yang menarik perhatian publik (thumb-stopping visual). Metafora dua layar televisi klasik digunakan untuk membingkai dua sudut pandang peliputan humas: fokus pada diskusi substantif anggota dewan di meja sidang (layar atas) serta suasana menyeluruh ruang Sidang Paripurna (layar bawah).',
    highlightsLabel: 'Bedah Isi & Pesan Utama Visual:',
    highlights: [
      'Atribut Kelembagaan Negara: Menyematkan lambang Garuda Pancasila dan logo resmi DPR RI di puncak komposisi sebagai penanda otoritas informasi lembaga legislatif.',
      'Tipografi Kontras & Penanda Kronologis: Perpaduan huruf serif putih tegas pada kata "Dokumentasi" dan aksen script emas pada "Sidang Paripurna", dilengkapi label tanggal aktual "12 November 2026".',
      'Layar Dokumentasi Atas (Fokus Substansi): Menampilkan potret jarak menengah jajaran pimpinan dan anggota dewan yang sedang menyimak berkas serta membahas agenda rapat secara saksama.',
      'Layar Dokumentasi Bawah (Sudut Lebar Paripurna): Menampilkan potret wide-angle suasana ruang Sidang Paripurna DPR RI lengkap dengan mimbar pimpinan berlatar bendera Merah Putih dan kehadiran anggota dewan.',
      'Integrasi Kanal Media Sosial Humas: Mencantumkan identitas akun resmi @dpr_ri (Instagram, YouTube, TikTok) dan @humas_dpr di bagian bawah poster untuk mengarahkan masyarakat ke liputan lengkap.'
    ],
    architectureLabel: 'Direksi Kreatif & Tata Letak (Feed 4:5):',
    architecture: 'Memadukan latar Deep Crimson Red yang berwibawa dengan teknik foreground framing berupa tumpukan naskah RUU dan buku-buku hukum yang dibuat buram (depth of field), menciptakan kesan kedalaman ruang yang sinematik pada format 4:5.',
    techLabel: 'Kompetensi Kehumasan & Tools:',
    tech: ['Humas Parlemen', 'Dokumentasi Protokoler', 'Jurnalistik Visual', 'Manajemen Media Sosial', 'Photo Compositing'],
    noteLabel: 'Sasaran Audiens & Dampak Publikasi:',
    note: 'Ditujukan bagi masyarakat luas, insan pers, akademisi, dan konstituen untuk meningkatkan literasi parlemen serta transparansi kinerja lembaga perwakilan rakyat.'
  },
  finallyLolosMaganghub: {
    isDesign: true,
    title: 'Kampanye Selebrasi & Engagement: "Akhirnya Lolos MagangHub"',
    category: 'Desain & Publikasi · Kampanye Komunitas',
    period: '2026',
    badge: 'Publisitas & Engagement Publik',
    image: 'assets/projects/desain/finally-lolos-maganghub.jpg',
    summary: 'Materi publisitas kreatif bertajuk "Akhirnya Lolos MagangHub" yang dirancang sebagai konten selebrasi pasca-pengumuman seleksi (post-announcement engagement). Dalam strategi komunikasi program kepemudaan dan karier, konten human-interest yang merayakan keberhasilan peserta sangat efektif untuk membangun ikatan emosional (emotional resonance) dan kebanggaan komunitas.',
    approachLabel: 'Strategi Komunikasi & Kehumasan:',
    approach: 'Menggunakan pendekatan storytelling awal perjalanan karier (the beginning of a new journey) yang divisualisasikan melalui rombongan peserta magang berseragam kemeja putih yang berangkat bersama menggunakan camper van klasik membawa koper. Kutipan perjuangan di bagian bawah memperkuat pesan resiliensi dan mengundang interaksi organik (repost, komentar, dan berbagi pengalaman) dari para peserta.',
    highlightsLabel: 'Bedah Isi & Pesan Utama Visual:',
    highlights: [
      'Tipografi Selebrasi yang Segar: Kombinasi huruf script putih pada kata "Akhirnya" dan huruf tebal berdimensi biru langit pada "Lolos MagangHub" yang selaras dengan suasana langit cerah.',
      'Visualisasi Antusiasme & Solidaritas: Potret sekelompok peserta magang yang tersenyum gembira dan melambaikan tangan dari dalam maupun atap mobil VW Combi biru-krem lengkap dengan koper perjalanan.',
      'Latar Kawasan Institusional: Berlatar jalan perkotaan yang asri dengan gedung berkubah di kejauhan, menyimbolkan kesiapan peserta memasuki dunia kerja dan instansi tempat magang.',
      'Kutipan Motivasi Perjuangan: Kalimat "Tidak ada kata menyerah sebelum akhir perang" di sudut kiri bawah memberikan apresiasi atas ketekunan peserta melewati proses seleksi.'
    ],
    architectureLabel: 'Direksi Kreatif & Tata Letak (Feed 4:5):',
    architecture: 'Menerapkan komposisi rule of thirds pada kanvas vertikal 4:5 dengan pencahayaan alami yang cerah (Sky Blue & Daylight Cream), memberikan ruang langit yang lega bagi tipografi utama serta ruang bawah untuk kutipan motivasi.',
    techLabel: 'Kompetensi Kehumasan & Tools:',
    tech: ['Audience Engagement', 'Youth Public Relations', 'Campaign Storytelling', 'Copywriting Motivasi', 'Visual Content Design'],
    noteLabel: 'Sasaran Audiens & Dampak Publikasi:',
    note: 'Ditujukan bagi mahasiswa, fresh graduate, dan peserta seleksi MagangHub; mendorong tingkat keterbagian (shareability) yang tinggi di Instagram serta memperkuat citra positif program magang.'
  },
  gerakanPeduli: {
    isDesign: true,
    title: 'Kampanye Sosial: Gerakan Bakti Sosial Aceh Peduli Lingkungan',
    category: 'Desain & Publikasi · Kampanye Sosial',
    period: '2026',
    badge: 'Kampanye Sosial & Komunitas',
    image: 'assets/projects/desain/gerakan-peduli.jpg',
    summary: 'Desain publisitas kampanye sosial dan hubungan masyarakat (community relations) untuk kegiatan "Gerakan Bakti Sosial — Aceh Peduli Lingkungan" dengan tema "Peduli Sesama, Berbagi Harapan". Poster ini dirancang untuk mengetuk empati publik, mengedukasi pentingnya kepedulian sosial-lingkungan, serta mengajak masyarakat berpartisipasi sebagai relawan maupun donatur.',
    approachLabel: 'Strategi Komunikasi & Kehumasan:',
    approach: 'Menerapkan struktur pesan persuasif tiga lapis khas kampanye kehumasan sosial: (1) Identitas & Tema Utama (Gerakan Bakti Sosial: Peduli Sesama, Berbagi Harapan), (2) Pesan Empati untuk menggugah kepedulian, serta (3) Ajakan Bertindak (Call-to-Action) untuk bergabung. Gestur subjek utama yang tersenyum sambil mengulurkan tangan ke arah audiens menciptakan komunikasi dua arah yang hangat, ramah, dan inklusif.',
    highlightsLabel: 'Bedah Isi & Pesan Utama Visual:',
    highlights: [
      'Co-Branding & Identitas Daerah: Menampilkan logo "The Light of Aceh" dengan simbol daun dan bumi hijau di puncak poster, diikuti sub-tajuk "ACEH PEDULI LINGKUNGAN".',
      'Tajuk Kampanye Humanis: Tipografi "Gerakan Bakti Sosial" berdimensi hangat yang diperkuat slogan "Peduli Sesama, Berbagi Harapan".',
      'Dua Kotak Pesan Persuasif: Sisi kiri memuat ajakan empati ("Mari berbagi, ringankan beban, ciptakan senyuman, untuk sesama") dan sisi kanan memuat ajakan bergabung ("Ayo Bergabung Bersama Aceh Peduli Lingkungan").',
      'Ilustrasi Bantuan & Aksi Lapangan: Menampilkan kotak donasi berlabel tangan-hati berisi sembako, buku, dan kebutuhan pokok di sisi kiri, serta siluet aksi gotong royong para relawan di latar belakang.',
      'Saluran Resmi & Tagar Kampanye: Mencantumkan akun Instagram dan TikTok @aceh_pedulilingkungan serta tagar #AcehPeduliLingkungan dan #TheLightOfAceh pada pita informasi bawah.'
    ],
    architectureLabel: 'Direksi Kreatif & Tata Letak (Feed 4:5):',
    architecture: 'Mengusung palet warna Warm Golden Orange & Earthy Cream pada rasio 4:5 yang memancarkan kehangatan, semangat kemanusiaan, energi positif, dan solidaritas sosial.',
    techLabel: 'Kompetensi Kehumasan & Tools:',
    tech: ['Community Relations', 'Kampanye Sosial & CSR', 'Persuasive Copywriting', 'Publisitas Kegiatan', 'Branding Komunitas'],
    noteLabel: 'Sasaran Audiens & Dampak Publikasi:',
    note: 'Ditujukan bagi generasi muda, mahasiswa, komunitas relawan, dan masyarakat Aceh guna meningkatkan partisipasi aksi bakti sosial serta memperluas jangkauan pesan kepedulian lingkungan.'
  },
  jagaKesehatan: {
    isDesign: true,
    title: 'Iklan Layanan Masyarakat (ILM): Imbauan Darurat "Jaga Kesehatan"',
    category: 'Desain & Publikasi · Layanan Masyarakat',
    period: '2026',
    badge: 'Komunikasi Krisis & ILM',
    image: 'assets/projects/desain/jaga-kesehatan.jpg',
    summary: 'Materi Iklan Layanan Masyarakat (ILM) dan komunikasi risiko kesehatan publik bertajuk "Jaga Kesehatan — Tetap Selalu Jaga Kesehatan Dimanapun dan Kapanpun". Dalam kehumasan publik dan manajemen komunikasi krisis, visual dengan daya gugah tinggi sangat dibutuhkan agar masyarakat segera menyadari ancaman kesehatan (seperti kabut asap karhutla atau polusi udara) dan menerapkan langkah perlindungan diri.',
    approachLabel: 'Strategi Komunikasi & Kehumasan:',
    approach: 'Mengedepankan pendekatan direct protective appeal melalui gestur tangan tokoh nasional yang menyerahkan kartu hologram masker medis tepat ke arah mata pembaca. Kontras antara latar situasi darurat berapi/berasap dengan simbol palang kesehatan hijau menegaskan bahwa menjaga kesehatan diri adalah prioritas mendesak di mana pun dan kapan pun.',
    highlightsLabel: 'Bedah Isi & Pesan Utama Visual:',
    highlights: [
      'Atribut Kebangsaan Resmi: Menyertakan elemen bendera berkibar "Merah Putih" di kiri atas dan lambang negara Garuda Pancasila di kanan atas sebagai penegas bobot imbauan nasional.',
      'Focal Point Kartu Masker & Simbol Peringatan: Kartu transparan di tengah komposisi menampilkan ilustrasi masker medis beserta ikon peringatan bahaya kesehatan (biohazard & tanda seru merah).',
      'Simbol Medis di Tengah Situasi Krisis: Ikon-ikon palang kesehatan hijau (green health cross) melayang di sekitar subjek di tengah latar kabut asap, merepresentasikan upaya perlindungan medis.',
      'Pesan Imbauan Singkat & Tegas: Tajuk besar "Jaga Kesehatan" diikuti sub-pesan "Tetap Selalu Jaga Kesehatan Dimanapun dan Kapanpun" agar mudah diingat masyarakat dalam sekali pandang.'
    ],
    architectureLabel: 'Direksi Kreatif & Tata Letak (Feed 4:5):',
    architecture: 'Menggunakan pencahayaan dramatis (cinematic lighting) dan efek shallow depth-of-field pada kanvas 4:5, mempertemukan warna hangat latar krisis (Fiery Amber) dengan aksen dingin keselamatan medis (Emerald Green & Clean White).',
    techLabel: 'Kompetensi Kehumasan & Tools:',
    tech: ['Iklan Layanan Masyarakat', 'Komunikasi Krisis', 'Edukasi Kesehatan Publik', 'Visual Impact Direction', 'Digital Imaging'],
    noteLabel: 'Sasaran Audiens & Dampak Publikasi:',
    note: 'Ditujukan bagi masyarakat luas, khususnya warga di wilayah terdampak penurunan kualitas udara atau kabut asap, guna meningkatkan kepatuhan penggunaan masker dan kewaspadaan kesehatan.'
  },
  lolosGoogleMaganghub: {
    isDesign: true,
    title: 'Pengumuman Publik: Cek Status Seleksi MagangHub Batch 3 (Kemnaker RI)',
    category: 'Desain & Publikasi · Informasi Publik',
    period: '2026',
    badge: 'Pengumuman & Informasi Publik',
    image: 'assets/projects/desain/lolos-google-maganghub.jpg',
    summary: 'Materi publisitas pengumuman resmi bertajuk "Cari Status Magang, Cek Lolos Seleksi — MagangHub Batch 3" untuk program MagangHub Kementerian Ketenagakerjaan RI (Kemnaker). Dalam standar kehumasan pemerintah, konten pengumuman seleksi nasional harus menyajikan instruksi yang jelas, mencegah disinformasi atau tautan palsu, serta mengarahkan peserta langsung ke portal resmi.',
    approachLabel: 'Strategi Komunikasi & Kehumasan:',
    approach: 'Menggunakan pendekatan familiar UI simulation (simulasi kartu pencarian Google) untuk memandu peserta secara visual mengenai cara mengakses portal resmi https://maganghub.kemnaker.go.id. Tampilan judul hasil pencarian "Selamat! Anda Dinyatakan LOLOS Seleksi MagangHub Batch 3" dirancang sebagai pemicu tindakan segera (call-to-action trigger) agar peserta langsung memeriksa akun dashboard masing-masing.',
    highlightsLabel: 'Bedah Isi & Pesan Utama Visual:',
    highlights: [
      'Co-Branding Resmi Kemnaker & MagangHub: Menampilkan logo Kementerian Ketenagakerjaan RI (KEMNAKER) berdampingan dengan logo "Maganghub oleh Kemnaker" di sudut kiri atas.',
      'Headline Pengumuman & Pita Aksen Kuning: Tajuk "CARI STATUS MAGANG CEK LOLOS SELEKSI" dipertegas dengan pita kuning kontras bertuliskan "KINI TERSEDIA! CEK STATUS SELEKSI MAGANGHUB BATCH 3 SEKARANG!".',
      'Simulasi Pencarian Google yang Edukatif: Menampilkan kata kunci pencarian "maganghub", hasil tautan domain resmi https://maganghub.kemnaker.go.id, serta petunjuk pengecekan nama pada dashboard resmi Kemnaker RI.',
      'Atribut Portal Resmi & Ekosistem SIAPkerja: Mencantumkan alamat maganghub.kemnaker.go.id di kiri bawah serta identitas SIAPkerja dan tagar #LolosMagangHub di kanan bawah.'
    ],
    architectureLabel: 'Direksi Kreatif & Tata Letak (Feed 4:5):',
    architecture: 'Menggunakan latar Corporate Deep Navy Blue dengan kontras kartu pencarian putih bersih dan pita aksen Attention Yellow pada proporsi 4:5 sehingga hierarki informasi terbaca sangat jelas di layar perangkat seluler.',
    techLabel: 'Kompetensi Kehumasan & Tools:',
    tech: ['Informasi Publik Pemerintah', 'Humas Kemnaker', 'Digital Campaign CTA', 'UI Mockup Storytelling', 'Brand Guideline'],
    noteLabel: 'Sasaran Audiens & Dampak Publikasi:',
    note: 'Ditujukan bagi seluruh pendaftar program MagangHub Batch 3 di seluruh Indonesia untuk mempercepat penyebaran informasi kelulusan secara akurat dan aman menuju portal resmi Kemnaker RI.'
  }
};

/* ── DOM References for Projects ── */
const projectModalBackdrop = document.getElementById('projectModal');

function openProjectModal(key) {
  const data = PROJECTS_DATA[key];
  const modalBackdrop = projectModalBackdrop || document.getElementById('projectModal');
  if (!data || !modalBackdrop) return;

  const titleEl      = document.getElementById('pmTitle');
  const catEl        = document.getElementById('pmCategory');
  const badgeEl      = document.getElementById('pmBadge');
  const githubEl     = document.getElementById('pmGithub');
  const modalBody    = modalBackdrop.querySelector('.modal-body');

  if (titleEl) titleEl.textContent = data.title;
  if (catEl) catEl.textContent = `${data.category || ''} · ${data.period || ''}`;

  if (badgeEl) {
    if (data.badge) {
      badgeEl.textContent = data.badge;
      badgeEl.style.display = 'inline-flex';
    } else {
      badgeEl.style.display = 'none';
    }
  }

  if (modalBody) {
    let bodyHtml = '';

    // 0. Pratinjau Visual 4:5 (khusus proyek Desain & Publikasi)
    if (data.isDesign && data.image) {
      bodyHtml += `
        <div class="modal-design-preview-wrap">
          <div class="modal-design-preview">
            <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}" width="1080" height="1350" loading="lazy" decoding="async" />
          </div>
          <span class="modal-design-caption"><i class="fab fa-instagram" aria-hidden="true"></i> Format Feed Instagram 4:5 (1080 × 1350 px)</span>
        </div>
      `;
    } else if (data.showModalImage && data.image) {
      bodyHtml += `
        <div class="modal-design-preview-wrap">
          <div class="modal-sheet-preview">
            <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.title)}" width="1200" height="750" loading="lazy" decoding="async" />
          </div>
          <span class="modal-design-caption"><i class="fas fa-table" aria-hidden="true"></i> Pratinjau Lembar Kerja Dashboard SDM (Google Sheets)</span>
        </div>
      `;
    }

    // 1. Ringkasan
    const summaryText = data.summary || data.description;
    if (summaryText) {
      bodyHtml += `<p class="modal-desc" id="pmDesc">${escapeHtml(summaryText)}</p>`;
    }

    // 2. Pendekatan / Strategi Komunikasi & Kehumasan (hanya jika ada)
    if (data.approach) {
      const approachHeading = data.approachLabel || 'Pendekatan:';
      bodyHtml += `
        <div>
          <h4 style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-bright);">${escapeHtml(approachHeading)}</h4>
          <p class="modal-desc" style="line-height:1.65;">${escapeHtml(data.approach)}</p>
        </div>
      `;
    }

    // 3. Fitur Utama / Bedah Isi & Pesan Utama Visual (hanya jika ada)
    if (data.highlights && data.highlights.length > 0) {
      const highlightsHeading = data.highlightsLabel || 'Fitur Utama:';
      bodyHtml += `
        <div>
          <h4 style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-bright);">${escapeHtml(highlightsHeading)}</h4>
          <ul class="modal-highlights" id="pmHighlights">
            ${data.highlights.map(h => `<li><i class="fas fa-check-circle" aria-hidden="true"></i> <span>${escapeHtml(h)}</span></li>`).join('')}
          </ul>
        </div>
      `;
    }

    // 4. Arsitektur / Direksi Kreatif & Tata Letak (hanya jika ada)
    if (data.architecture) {
      const archHeading = data.architectureLabel || 'Arsitektur:';
      bodyHtml += `
        <div>
          <h4 style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-bright);">${escapeHtml(archHeading)}</h4>
          <p class="modal-desc" style="line-height:1.65;">${escapeHtml(data.architecture)}</p>
        </div>
      `;
    }

    // 5. Teknologi yang Digunakan / Kompetensi Kehumasan (hanya jika ada)
    if (data.tech && data.tech.length > 0) {
      const techHeading = data.techLabel || 'Teknologi yang Digunakan:';
      bodyHtml += `
        <div>
          <h4 style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-bright);">${escapeHtml(techHeading)}</h4>
          <div class="project-tags" id="pmTech">
            ${data.tech.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      `;
    }

    // 6. Catatan / Sasaran Audiens & Dampak Publikasi (hanya jika ada)
    if (data.note) {
      const noteHeading = data.noteLabel || 'Catatan:';
      bodyHtml += `
        <div>
          <h4 style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-bright);">${escapeHtml(noteHeading)}</h4>
          <p class="modal-desc" style="font-size:0.85rem; opacity:0.9; line-height:1.6;">${escapeHtml(data.note)}</p>
        </div>
      `;
    }

    modalBody.innerHTML = bodyHtml;
  }

  // Footer Button
  if (githubEl) {
    if (data.isDesign && data.image) {
      githubEl.href = data.image;
      githubEl.innerHTML = '<i class="fas fa-expand"></i> Lihat Desain Ukuran Penuh';
      githubEl.style.display = 'inline-flex';
    } else if (data.github || data.repo) {
      githubEl.href = data.github || data.repo;
      githubEl.innerHTML = '<i class="fab fa-github"></i> Kunjungi Repositori';
      githubEl.style.display = 'inline-flex';
    } else if (data.demo || data.link) {
      const targetUrl = data.demo || data.link;
      githubEl.href = targetUrl;
      if (targetUrl.includes('docs.google.com/spreadsheets')) {
        githubEl.innerHTML = '<i class="fas fa-table"></i> Buka Google Sheets';
      } else {
        githubEl.innerHTML = '<i class="fas fa-external-link-alt"></i> Kunjungi Web';
      }
      githubEl.style.display = 'inline-flex';
    } else {
      githubEl.style.display = 'none';
    }
  }

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modalBackdrop = projectModalBackdrop || document.getElementById('projectModal');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('open');
    if (!document.getElementById('certLightbox')?.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }
}

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;

if (projectModalBackdrop) {
  projectModalBackdrop.addEventListener('click', (e) => {
    if (e.target === projectModalBackdrop) closeProjectModal();
  });
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-project-modal]');
  if (trigger) {
    const key = trigger.getAttribute('data-project-modal');
    if (key && PROJECTS_DATA[key]) {
      openProjectModal(key);
    }
  }
});

document.querySelectorAll('.project-thumb-4x5[role="button"]').forEach((thumb) => {
  thumb.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const key = thumb.getAttribute('data-project-modal');
      if (key) openProjectModal(key);
      else thumb.click();
    }
  });
});

/* ── Project Filter Tabs ── */
const projectTabs  = document.querySelectorAll('.project-tab');
const projectCards = document.querySelectorAll('.project-card');

projectTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    projectTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-pressed', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-pressed', 'true');

    const filter = tab.dataset.filter;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      const show =
        filter === 'all' ||
        categories.includes(filter) ||
        (filter === 'ai' && categories.includes('desktop'));

      if (card._filterTimer) {
        clearTimeout(card._filterTimer);
        card._filterTimer = null;
      }

      if (show) {
        card.hidden = false;
        card.style.display = '';
        card.classList.add('visible', 'mx-in');
        card.style.transitionDelay = '0s';

        if (!reduceMotion) {
          card.style.transition = 'none';
          card.style.opacity = '0';
          void card.offsetWidth;
          card.style.transition = 'opacity 0.3s ease';
          card.style.opacity = '1';
          card._filterTimer = setTimeout(() => {
            card.style.transition = '';
            card.style.opacity = '';
          }, 310);
        } else {
          card.style.transition = '';
          card.style.opacity = '';
        }
      } else {
        card.hidden = true;
        card.style.display = 'none';
        card.style.transition = '';
        card.style.opacity = '';
      }
    });
  });
});


/* ══════════════════════════════════════════════════
   CERTIFICATES GALLERY & LIGHTBOX
   ══════════════════════════════════════════════════ */

/* Fallback dataset (21 verified certificates) */
const CERTIFICATES_FALLBACK = [
  {
    "id": "dibimbing-fullstack-web-development",
    "title": "Event Online: Fullstack Web Development",
    "issuer": "Dibimbing.id",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-fullstack-web-development-dibimbing.webp",
    "image": "assets/certificates/large/sertifikat-fullstack-web-development-dibimbing.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat-Fullstack-Web-Development-Dibimbing.pdf",
    "type": "pdf"
  },
  {
    "id": "yec-data-analyst-persiapan-bnsp",
    "title": "Data Analyst untuk Persiapan Sertifikasi BNSP",
    "issuer": "YEC.CO.ID",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/fachril-akbar-data-analyst-untuk-persiapan-sertifikasi-bnsp.webp",
    "image": "assets/certificates/large/fachril-akbar-data-analyst-untuk-persiapan-sertifikasi-bnsp.webp",
    "file": "css/sertifikat-for-fortolio/Fachril Akbar - Data Analyst untuk Persiapan Sertifikasi BNSP.pdf",
    "type": "pdf",
    "credentialId": "00174779"
  },
  {
    "id": "kemnaker-canva-ai-otomatisasi",
    "title": "Meningkatkan Produktivitas Pembuatan Konten dengan Canva, AI, dan Otomatisasi",
    "issuer": "Kementerian Ketenagakerjaan RI (BBPKK)",
    "year": "2026",
    "category": "ai",
    "thumb": "assets/certificates/thumbs/sertifikat-produktivitas-canva-ai-otomatisasi-bbpkk.webp",
    "image": "assets/certificates/large/sertifikat-produktivitas-canva-ai-otomatisasi-bbpkk.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat-Produktivitas-Canva-AI-Otomatisasi-BBPKK.pdf",
    "type": "pdf",
    "credentialId": "DS-2026-10-21-008"
  },
  {
    "id": "specialskill-machine-learning",
    "title": "Machine Learning",
    "issuer": "SpecialSkill Indonesia",
    "year": "2026",
    "category": "ai",
    "thumb": "assets/certificates/thumbs/certificate-meachine-learning-1791728559528.webp",
    "image": "assets/certificates/large/certificate-meachine-learning-1791728559528.webp",
    "file": "css/sertifikat-for-fortolio/certificate-Meachine Learning-1791728559528.pdf",
    "type": "pdf",
    "credentialId": "1d1c03e8014d045b"
  },
  {
    "id": "uipath-ioh-automation",
    "title": "Automation Webinar: UiPath x IOH",
    "issuer": "UiPath & Indosat Ooredoo Hutchison",
    "year": "2026",
    "category": "ai",
    "thumb": "assets/certificates/thumbs/certificate-of-appreciation.webp",
    "image": "assets/certificates/large/certificate-of-appreciation.webp",
    "file": "css/sertifikat-for-fortolio/CERTIFICATE-OF-APPRECIATION.pdf",
    "type": "pdf",
    "credentialId": "22848/ONE-WEBINAR-SERTIF/X/2026"
  },
  {
    "id": "asean-foundation-ai-readiness",
    "title": "AI Career Readiness Training",
    "issuer": "ASEAN Foundation & LinkedIn",
    "year": "2026",
    "category": "ai",
    "thumb": "assets/certificates/thumbs/certificate-ai-career-readiness.webp",
    "image": "assets/certificates/large/certificate-ai-career-readiness.webp",
    "file": "css/sertifikat-for-fortolio/certificate_ai-career-readiness.png",
    "type": "image",
    "verifyUrl": "https://ada.aseanfoundation.org"
  },
  {
    "id": "yec-excel-administrasi-perkantoran",
    "title": "Dasar Microsoft Excel Administrasi Perkantoran",
    "issuer": "YEC.CO.ID",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/fachril-akbar-dasar-microsoft-excel-administrasi-perkantoran.webp",
    "image": "assets/certificates/large/fachril-akbar-dasar-microsoft-excel-administrasi-perkantoran.webp",
    "file": "css/sertifikat-for-fortolio/Fachril Akbar - Dasar Microsoft Excel Administrasi Perkantoran.pdf",
    "type": "pdf",
    "credentialId": "00174688"
  },
  {
    "id": "amanexcel-basic-microsoft-excel",
    "title": "Basic Microsoft Excel",
    "issuer": "AmanExcel",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/fachril-akbar.webp",
    "image": "assets/certificates/large/fachril-akbar.webp",
    "file": "css/sertifikat-for-fortolio/FACHRIL AKBAR.jpg",
    "type": "image",
    "credentialId": "029/ATBME/009/IX/2026"
  },
  {
    "id": "dibimbing-hr-digital-skill-fair",
    "title": "Digital Skill Fair 55.0: Human Resources",
    "issuer": "Dibimbing.id",
    "year": "2026",
    "category": "org",
    "thumb": "assets/certificates/thumbs/sertifikat-hr-dibimbing.webp",
    "image": "assets/certificates/large/sertifikat-hr-dibimbing.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat-HR-Dibimbing.pdf",
    "type": "pdf"
  },
  {
    "id": "kemnaker-business-model-canvas-ai",
    "title": "Strategi Menyusun Business Model Canvas dengan AI dan Automation",
    "issuer": "Kementerian Ketenagakerjaan RI (BBPKK)",
    "year": "2026",
    "category": "ai",
    "thumb": "assets/certificates/thumbs/sertifikat-strategi-meyusun-moden-canvas.webp",
    "image": "assets/certificates/large/sertifikat-strategi-meyusun-moden-canvas.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat-Strategi meyusun moden canvas.pdf",
    "type": "pdf",
    "credentialId": "MC-2026-09-01-005"
  },
  {
    "id": "myskill-artificial-intelligence",
    "title": "Artificial Intelligence",
    "issuer": "MySkill",
    "year": "2026",
    "category": "ai",
    "thumb": "assets/certificates/thumbs/sertifikat-artificial-intelligence.webp",
    "image": "assets/certificates/large/sertifikat-artificial-intelligence.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat_Artificial Intelligence.pdf",
    "type": "pdf",
    "credentialId": "MS-20261012-hgsfvVo0PnoljxKMJ5Rr"
  },
  {
    "id": "aws-generative-ai",
    "title": "Introduction to Generative AI - Art of the Possible",
    "issuer": "AWS Training & Certification",
    "year": "2026",
    "category": "ai",
    "thumb": "assets/certificates/thumbs/sertifikat-aws-introduction-to-generative.webp",
    "image": "assets/certificates/large/sertifikat-aws-introduction-to-generative.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat_AWS_Introduction to Generative.pdf",
    "type": "pdf"
  },
  {
    "id": "myskill-career-self-development",
    "title": "Career & Self Development",
    "issuer": "MySkill",
    "year": "2026",
    "category": "org",
    "thumb": "assets/certificates/thumbs/sertifikat-career-self-development.webp",
    "image": "assets/certificates/large/sertifikat-career-self-development.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat_CAREER & SELF DEVELOPMENT.pdf",
    "type": "pdf",
    "credentialId": "MS-20261009-HEsL6fGFqYa5hNzExbIR"
  },
  {
    "id": "dicoding-pemrograman-solid",
    "title": "Belajar Prinsip Pemrograman SOLID",
    "issuer": "Dicoding Academy",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-course-169-4063807-101026155638-pemrograman-solid.webp",
    "image": "assets/certificates/large/sertifikat-course-169-4063807-101026155638-pemrograman-solid.webp",
    "file": "css/sertifikat-for-fortolio/sertifikat_course_169_4063807_101026155638_Pemrograman SOLID.pdf",
    "type": "pdf",
    "credentialId": "NVP7WQ47RZR0",
    "verifyUrl": "https://www.dicoding.com/certificates/NVP7WQ47RZR0"
  },
  {
    "id": "dicoding-program-java",
    "title": "Memulai Pemrograman Dengan Java",
    "issuer": "Dicoding Academy",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-course-60-4063807-131026091203-programjava.webp",
    "image": "assets/certificates/large/sertifikat-course-60-4063807-131026091203-programjava.webp",
    "file": "css/sertifikat-for-fortolio/sertifikat_course_60_4063807_131026091203_ProgramJava.pdf",
    "type": "pdf",
    "credentialId": "07Z6Q0QQMZQR",
    "verifyUrl": "https://www.dicoding.com/certificates/07Z6Q0QQMZQR"
  },
  {
    "id": "dicoding-manajemen-proyek",
    "title": "Belajar Dasar Manajemen Proyek",
    "issuer": "Dicoding Academy",
    "year": "2026",
    "category": "org",
    "thumb": "assets/certificates/thumbs/sertifikat-dicoding-course-belajar-dasar-manajemen-proyek.webp",
    "image": "assets/certificates/large/sertifikat-dicoding-course-belajar-dasar-manajemen-proyek.webp",
    "file": "css/sertifikat-for-fortolio/sertifikat_Dicoding_course_Belajar Dasar Manajemen Proyek.pdf",
    "type": "pdf",
    "credentialId": "6RPNO10V5X2M",
    "verifyUrl": "https://www.dicoding.com/certificates/6RPNO10V5X2M"
  },
  {
    "id": "revou-digital-marketing",
    "title": "Intro to Digital Marketing",
    "issuer": "RevoU",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-digital-markrting-revou.webp",
    "image": "assets/certificates/large/sertifikat-digital-markrting-revou.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat_Digital Markrting_RevoU.pdf",
    "type": "pdf",
    "credentialId": "DMMC-28092026-01-1-00333"
  },
  {
    "id": "myskill-graphic-design",
    "title": "Graphic Design",
    "issuer": "MySkill",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-graphic-design.webp",
    "image": "assets/certificates/large/sertifikat-graphic-design.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat_GRAPHIC DESIGN.pdf",
    "type": "pdf",
    "credentialId": "MS-20261012-H0iA5WXPP2DwM27q8AgT"
  },
  {
    "id": "myskill-office-suite",
    "title": "Microsoft Excel, Word and PowerPoint",
    "issuer": "MySkill",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-microsoft-excel-word-and-powerpoint.webp",
    "image": "assets/certificates/large/sertifikat-microsoft-excel-word-and-powerpoint.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat_MICROSOFT EXCEL, WORD AND POWERPOINT.pdf",
    "type": "pdf",
    "credentialId": "MS-20261010-1lYupUKQXNcaLAJARlwh"
  },
  {
    "id": "revou-software-engineering",
    "title": "Intro to Software Engineering",
    "issuer": "RevoU",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-software-engginering-revou.webp",
    "image": "assets/certificates/large/sertifikat-software-engginering-revou.webp",
    "file": "css/sertifikat-for-fortolio/Sertifikat_Software Engginering_Revou.pdf",
    "type": "pdf",
    "credentialId": "CCSE-051026-01-1-00049"
  },
  {
    "id": "myskill-website-apps-development",
    "title": "Website & Apps Development",
    "issuer": "MySkill",
    "year": "2026",
    "category": "web",
    "thumb": "assets/certificates/thumbs/sertifikat-website-apps-development.webp",
    "image": "assets/certificates/large/sertifikat-website-apps-development.webp",
    "file": "css/sertifikat-for-fortolio/SERTIFIKAT_Website & Apps Development.pdf",
    "type": "pdf",
    "credentialId": "MS-20261005-8Qz3ab6Y6REybm5fMmWC"
  }
];

/* ── Gallery State ── */
let allCertificates = [];
let filteredCertificates = [];
let activeFilter = 'all';
let isExpanded = false;
const PAGE_SIZE = 9;
let currentLightboxIndex = 0;
let lastFocusedElement = null;

/* ── DOM References for Certificates & Lightbox ── */
const certificatesGrid   = document.getElementById('certificatesGrid');
const certPaginationWrap = document.getElementById('certPaginationWrap');
const certLoadMoreBtn    = document.getElementById('certLoadMoreBtn');
const certLoadMoreText   = document.getElementById('certLoadMoreText');
const certLoadMoreIcon   = document.getElementById('certLoadMoreIcon');
const certFilterTabs     = document.querySelectorAll('.cert-tab');

const certLightbox = document.getElementById('certLightbox');
const clBackdrop   = document.getElementById('clBackdrop');
const clCloseBtn   = document.getElementById('clCloseBtn');
const clPrevBtn    = document.getElementById('clPrevBtn');
const clNextBtn    = document.getElementById('clNextBtn');
const clContent    = document.getElementById('clContent');
const clSpinner    = document.getElementById('clSpinner');
const clImage      = document.getElementById('clImage');
const clCounter    = document.getElementById('clCounter');
const clTitle      = document.getElementById('clTitle');
const clMeta       = document.getElementById('clMeta');
const clOpenBtn    = document.getElementById('clOpenBtn');
const clOpenText   = document.getElementById('clOpenText');
const clOpenIcon   = document.getElementById('clOpenIcon');

/* ── Utility: Escape HTML ── */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Load Certificate Data ── */
async function loadCertificatesData() {
  try {
    const response = await fetch('data/certificates.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      allCertificates = data;
    } else {
      allCertificates = CERTIFICATES_FALLBACK;
    }
  } catch (err) {
    // Graceful fallback if opened via file:// or fetch fails
    allCertificates = CERTIFICATES_FALLBACK;
  }

  filteredCertificates = [...allCertificates];
  renderCertificatesGrid();
}

/* ── Render Certificate Cards into Grid ── */
function renderCertificatesGrid() {
  if (!certificatesGrid) return;

  const totalFiltered = filteredCertificates.length;
  if (totalFiltered === 0) {
    certificatesGrid.innerHTML = `
      <div class="cert-error-msg">
        <i class="fas fa-folder-open" aria-hidden="true"></i>
        <p>Tidak ada sertifikat dalam kategori ini.</p>
      </div>
    `;
    if (certPaginationWrap) certPaginationWrap.style.display = 'none';
    return;
  }

  const visibleCount = isExpanded ? totalFiltered : Math.min(PAGE_SIZE, totalFiltered);
  const visibleCerts = filteredCertificates.slice(0, visibleCount);

  certificatesGrid.innerHTML = '';

  const fragment = document.createDocumentFragment();

  visibleCerts.forEach((cert, idx) => {
    const card = document.createElement('article');
    card.className = 'cert-card-gallery reveal visible';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-haspopup', 'dialog');
    card.setAttribute('aria-label', `Lihat pratinjau sertifikat ${cert.title}`);
    card.dataset.id = cert.id;
    card.dataset.category = cert.category;

    card.innerHTML = `
      <div class="cert-thumb-wrap">
        <img class="cert-thumb-img" src="${escapeHtml(cert.thumb)}" alt="Sertifikat ${escapeHtml(cert.title)}" loading="lazy" decoding="async" width="600" height="412" />
        <div class="cert-hover-overlay" aria-hidden="true">
          <div class="cert-zoom-icon">
            <i class="fas fa-search-plus"></i>
          </div>
        </div>
      </div>
      <div class="cert-card-info">
        <h3 class="cert-card-title">${escapeHtml(cert.title)}</h3>
        <p class="cert-card-meta">${escapeHtml(cert.issuer)} &bull; ${escapeHtml(cert.year)}</p>
      </div>
    `;

    // Click handler to open lightbox
    card.addEventListener('click', () => {
      openCertLightbox(idx);
    });

    // Keyboard access (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertLightbox(idx);
      }
    });

    fragment.appendChild(card);
  });

  certificatesGrid.appendChild(fragment);

  // Update pagination button state
  if (certPaginationWrap) {
    if (totalFiltered > PAGE_SIZE) {
      certPaginationWrap.style.display = 'flex';
      if (certLoadMoreText) {
        certLoadMoreText.textContent = isExpanded ? 'Tampilkan Lebih Sedikit' : `Tampilkan Lebih Banyak (${totalFiltered - PAGE_SIZE} lainnya)`;
      }
      if (certLoadMoreIcon) {
        certLoadMoreIcon.className = isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
      }
    } else {
      certPaginationWrap.style.display = 'none';
    }
  }
}

/* ── Toggle Pagination Expand/Collapse ── */
if (certLoadMoreBtn) {
  certLoadMoreBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    renderCertificatesGrid();

    // If collapsing back, scroll gently to top of certificates section
    if (!isExpanded) {
      const section = document.getElementById('certificates');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

/* ── Filter Tabs Handling ── */
certFilterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    certFilterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    activeFilter = tab.dataset.filter || 'all';

    if (activeFilter === 'all') {
      filteredCertificates = [...allCertificates];
    } else {
      filteredCertificates = allCertificates.filter(c => c.category === activeFilter);
    }

    // Reset expansion state on category change
    isExpanded = false;
    renderCertificatesGrid();
  });
});

/* ══════════════════════════════════════════════════
   LIGHTBOX MODAL LOGIC
   ══════════════════════════════════════════════════ */

function openCertLightbox(index) {
  if (!certLightbox || filteredCertificates.length === 0) return;

  lastFocusedElement = document.activeElement;
  currentLightboxIndex = index;

  updateLightboxView();

  certLightbox.classList.add('open');
  certLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Set focus into modal
  if (clCloseBtn) {
    clCloseBtn.focus();
  }
}

function closeCertLightbox() {
  if (!certLightbox) return;

  certLightbox.classList.remove('open');
  certLightbox.setAttribute('aria-hidden', 'true');

  if (!projectModalBackdrop?.classList.contains('open')) {
    document.body.style.overflow = '';
  }

  // Restore keyboard focus
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function updateLightboxView() {
  const cert = filteredCertificates[currentLightboxIndex];
  if (!cert) return;

  const total = filteredCertificates.length;

  // Counter
  if (clCounter) {
    clCounter.textContent = `${currentLightboxIndex + 1} / ${total}`;
  }

  // Loading spinner state
  if (clSpinner) clSpinner.style.display = 'flex';
  if (clImage) {
    clImage.style.opacity = '0';
    clImage.onload = () => {
      if (clSpinner) clSpinner.style.display = 'none';
      clImage.style.opacity = '1';
    };
    clImage.onerror = () => {
      if (clSpinner) clSpinner.style.display = 'none';
      clImage.style.opacity = '1';
    };
    clImage.src = cert.image;
    clImage.alt = `Sertifikat ${cert.title}`;

    if (clImage.complete && clImage.naturalWidth > 0) {
      if (clSpinner) clSpinner.style.display = 'none';
      clImage.style.opacity = '1';
    }
  }

  // Titles and meta
  if (clTitle) clTitle.textContent = cert.title;
  if (clMeta) {
    let metaHtml = `${escapeHtml(cert.issuer)} &bull; ${escapeHtml(cert.year)}`;
    if (cert.credentialId) {
      metaHtml += ` &bull; <span style="font-family:var(--font-mono, monospace); font-size:0.85em; opacity:0.85;">ID: ${escapeHtml(cert.credentialId)}</span>`;
    }
    clMeta.innerHTML = metaHtml;
  }

  // Direct action button (Buka PDF / Buka Gambar)
  if (clOpenBtn) {
    clOpenBtn.href = cert.file;
    clOpenBtn.setAttribute('target', '_blank');
    clOpenBtn.setAttribute('rel', 'noopener noreferrer');

    if (cert.type === 'pdf') {
      if (clOpenText) clOpenText.textContent = 'Buka PDF';
      if (clOpenIcon) clOpenIcon.className = 'fas fa-file-pdf';
    } else {
      if (clOpenText) clOpenText.textContent = 'Buka Gambar';
      if (clOpenIcon) clOpenIcon.className = 'fas fa-file-image';
    }
  }

  // Prev / Next button visibility (hide if only 1 item in filter)
  if (clPrevBtn && clNextBtn) {
    if (total <= 1) {
      clPrevBtn.style.display = 'none';
      clNextBtn.style.display = 'none';
    } else {
      clPrevBtn.style.display = 'flex';
      clNextBtn.style.display = 'flex';
    }
  }
}

function prevCert() {
  if (filteredCertificates.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + filteredCertificates.length) % filteredCertificates.length;
  updateLightboxView();
}

function nextCert() {
  if (filteredCertificates.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % filteredCertificates.length;
  updateLightboxView();
}

/* ── Lightbox Button Listeners ── */
if (clCloseBtn) clCloseBtn.addEventListener('click', closeCertLightbox);
if (clBackdrop) clBackdrop.addEventListener('click', closeCertLightbox);
if (clPrevBtn)  clPrevBtn.addEventListener('click', prevCert);
if (clNextBtn)  clNextBtn.addEventListener('click', nextCert);

/* ── Keyboard Navigation & Focus Trap ── */
document.addEventListener('keydown', (e) => {
  const isLightOpen = certLightbox && certLightbox.classList.contains('open');
  const isProjOpen  = projectModalBackdrop && projectModalBackdrop.classList.contains('open');

  if (e.key === 'Escape') {
    if (isLightOpen) {
      closeCertLightbox();
      return;
    }
    if (isProjOpen) {
      closeProjectModal();
      return;
    }
  }

  if (isLightOpen) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevCert();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextCert();
    } else if (e.key === 'Tab') {
      // Focus trap within lightbox
      const focusable = certLightbox.querySelectorAll('button:not([style*="display: none"]), a:not([style*="display: none"]), [tabindex="0"]');
      const focusableArr = Array.from(focusable);
      if (focusableArr.length === 0) return;

      const firstEl = focusableArr[0];
      const lastEl  = focusableArr[focusableArr.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }
});

/* ── Mobile Touch Swipe Support ── */
let touchStartX = 0;
let touchStartY = 0;

if (clContent) {
  clContent.addEventListener('touchstart', (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }
  }, { passive: true });

  clContent.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].screenX - touchStartX;
    const deltaY = e.changedTouches[0].screenY - touchStartY;

    // Detect horizontal swipe with threshold 50px
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        nextCert();
      } else {
        prevCert();
      }
    }
  }, { passive: true });
}

/* ── Initialize Certificates on DOM Ready ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCertificatesData);
} else {
  loadCertificatesData();
}

/* ── Expose Global Functions ── */
window.openProjectModal  = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.openCertLightbox  = openCertLightbox;
window.closeCertLightbox = closeCertLightbox;
