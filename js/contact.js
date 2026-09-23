/**
 * contact.js – Contact Form Submission via EmailJS
 *
 * Handles:
 *  - Form submit with loading, success, and error states
 *  - Button visual feedback
 *  - Auto-reset after success
 */

/* EmailJS is initialised in index.html via the SDK script */

function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn  = form.querySelector('button[type=submit]');
  const originalHTML = btn.innerHTML;

  /* ── Loading state ── */
  btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  btn.disabled   = true;
  btn.style.opacity = '0.8';

  emailjs
    .sendForm('service_jeiisnj', 'template_xb5zm2a', form)
    .then(() => {
      /* ── Success state ── */
      btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
      btn.style.background = 'linear-gradient(135deg, #16a34a, #4ade80)';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.innerHTML  = originalHTML;
        btn.style.background = '';
        btn.style.opacity    = '';
        btn.disabled   = false;
        form.reset();
      }, 3000);
    })
    .catch((error) => {
      /* ── Error state ── */
      console.error('EmailJS error:', error);
      btn.innerHTML = '<i class="fas fa-times"></i> Gagal, coba lagi';
      btn.style.background = 'linear-gradient(135deg, #dc2626, #f87171)';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.innerHTML  = originalHTML;
        btn.style.background = '';
        btn.style.opacity    = '';
        btn.disabled   = false;
      }, 3000);
    });
}
