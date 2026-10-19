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
  deepfake: {
    title: 'Sistem Deteksi Deepfake Wajah',
    category: 'AI / Deep Learning',
    period: '2025 — 2026',
    badge: 'Proyek Skripsi & Unggulan',
    description: 'Sistem kecerdasan buatan untuk mendeteksi manipulasi wajah digital (deepfake) pada gambar dan video. Menggunakan arsitektur Convolutional Neural Network (CNN) dan pipeline pemrosesan citra digital OpenCV untuk memverifikasi keaslian wajah dengan akurasi tinggi.',
    highlights: [
      'Arsitektur Convolutional Neural Network (CNN) yang dioptimasi untuk ekstraksi fitur mikroskopik wajah.',
      'Pipeline preprocessing: face detection, alignment, cropping, dan normalisasi pixel.',
      'Mampu mendeteksi berbagai jenis manipulasi wajah digital dengan skor probabilitas keaslian.',
      'Eksplorasi dataset benchmark untuk evaluasi performa dan generalisasi model.'
    ],
    tech: ['Python', 'Deep Learning', 'TensorFlow', 'OpenCV', 'CNN', 'NumPy', 'Matplotlib'],
    github: 'https://github.com/fachrilakbar12'
  },
  portfolio: {
    title: 'Website Portofolio Pribadi',
    category: 'Web Development',
    period: '2026',
    badge: 'Showcase Interaktif',
    description: 'Website portofolio profesional dengan estetika modern, animasi interaktif halus, performa tinggi, dan tata letak responsif penuh di berbagai perangkat mulai dari ponsel hingga monitor desktop lebar.',
    highlights: [
      'Desain tema kontras elegan dengan perpaduan aksen crimson (#c4352b) dan warm amber.',
      'Komponen interaktif: animasi chip melayang, spinning ring avatar, canvas partikel, dan typewriter effect.',
      'Modal lightbox untuk melihat foto profil, rincian proyek, serta sertifikat kredensial.',
      'Formulir kontak terintegrasi langsung dengan EmailJS SDK untuk pengiriman pesan instan.'
    ],
    tech: ['HTML5', 'CSS3 Modern', 'JavaScript ES6+', 'EmailJS', 'Responsive Web Design'],
    github: 'https://github.com/fachrilakbar12'
  },
  crud: {
    title: 'Aplikasi Manajemen Data Mahasiswa',
    category: 'Desktop App',
    period: '2024',
    badge: 'Aplikasi Desktop Java',
    description: 'Aplikasi desktop berbasis Java untuk manajemen informasi mahasiswa dengan antarmuka grafis yang ramah pengguna. Mendukung siklus penuh operasi CRUD (Create, Read, Update, Delete) yang terhubung ke basis data MySQL.',
    highlights: [
      'Implementasi prinsip Object-Oriented Programming (OOP) yang terstruktur dan modular.',
      'Konektivitas database persisten menggunakan JDBC (Java Database Connectivity) ke MySQL.',
      'Fitur pencarian cepat, filter data berdasarkan program studi, dan validasi formulir input.',
      'Pencegahan error dengan penanganan eksepsi (exception handling) menyeluruh.'
    ],
    tech: ['Java', 'MySQL', 'JDBC', 'OOP', 'Desktop GUI', 'Database Design'],
    github: 'https://github.com/fachrilakbar12'
  }
};

/* ── DOM References for Projects ── */
const projectModalBackdrop = document.getElementById('projectModal');

function openProjectModal(key) {
  const data = PROJECTS_DATA[key];
  if (!data || !projectModalBackdrop) return;

  const titleEl      = document.getElementById('pmTitle');
  const catEl        = document.getElementById('pmCategory');
  const badgeEl      = document.getElementById('pmBadge');
  const descEl       = document.getElementById('pmDesc');
  const highlightsEl = document.getElementById('pmHighlights');
  const techEl       = document.getElementById('pmTech');
  const githubEl     = document.getElementById('pmGithub');

  if (titleEl)      titleEl.textContent = data.title;
  if (catEl)        catEl.textContent = `${data.category} · ${data.period}`;
  if (badgeEl)      badgeEl.textContent = data.badge;
  if (descEl)       descEl.textContent = data.description;

  if (highlightsEl) {
    highlightsEl.innerHTML = '';
    data.highlights.forEach(h => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i> <span>${h}</span>`;
      highlightsEl.appendChild(li);
    });
  }

  if (techEl) {
    techEl.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      techEl.appendChild(span);
    });
  }

  if (githubEl) {
    githubEl.href = data.github;
  }

  projectModalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (projectModalBackdrop) {
    projectModalBackdrop.classList.remove('open');
    if (!document.getElementById('certLightbox')?.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }
}

if (projectModalBackdrop) {
  projectModalBackdrop.addEventListener('click', (e) => {
    if (e.target === projectModalBackdrop) closeProjectModal();
  });
}

/* ── Project Filter Tabs ── */
const projectTabs  = document.querySelectorAll('.project-tab');
const projectCards = document.querySelectorAll('.project-card');

projectTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    projectTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;

    projectCards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      const show = filter === 'all' || categories.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  });
});


/* ══════════════════════════════════════════════════
   CERTIFICATES GALLERY & LIGHTBOX
   ══════════════════════════════════════════════════ */

/* Fallback dataset (18 verified certificates) */
const CERTIFICATES_FALLBACK = [
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
