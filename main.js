function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('is-open');
  document.getElementById('mobileMenuOverlay').classList.toggle('is-open');
  document.getElementById('navBurger').classList.toggle('is-open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('is-open');
  document.getElementById('mobileMenuOverlay').classList.remove('is-open');
  document.getElementById('navBurger').classList.remove('is-open');
}

function showActivite(id) {
  document.getElementById('activites-grid').style.display = 'none';
  document.getElementById('activite-detail').style.display = 'block';
  document.querySelectorAll('.activite-content').forEach(function(el) { el.style.display = 'none'; });
  document.getElementById('detail-' + id).style.display = 'block';
  document.getElementById('activites').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideActivite() {
  document.getElementById('activite-detail').style.display = 'none';
  document.getElementById('activites-grid').style.display = 'block';
}

/* ═══════════════════════════════════════════════════════════
   FORMULAIRE (EmailJS)
═══════════════════════════════════════════════════════════ */

(function () {
  const EMAILJS_PUBLIC_KEY  = '6UGo377_ymCKmYMxR';
  const EMAILJS_SERVICE_ID  = 'service_5ar1p2i';
  const EMAILJS_TEMPLATE_ID = 'template_eihbxq4';

  /* Initialisation du SDK */
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form     = document.getElementById('contact-form');
  const btn      = form && form.querySelector('.form-submit-btn');
  const label    = form && form.querySelector('.form-submit-label');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  function setFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = 'form-feedback form-feedback--' + type;
    feedback.hidden      = false;
  }

  function setLoading(on) {
    btn.disabled = on;
    label.textContent = on ? 'ENVOI...' : 'Envoyer la demande';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name').value.trim();
    const email   = form.querySelector('#cf-email').value.trim();
    const message = form.querySelector('#cf-message').value.trim();

    /* Validation côté client */
    if (!name || !email || !message) {
      setFeedback('Tous les champs sont requis.', 'err');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('Adresse email invalide.', 'err');
      return;
    }

    setLoading(true);
    feedback.hidden = true;

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        nom:     name,
        email:   email,
        message: message,
      });

      form.reset();
      setFeedback('Message envoyé. On revient vers vous vite.', 'ok');

    } catch (_) {
      setFeedback('Réseau indisponible. Réessayez ou contactez-nous directement.', 'err');
    } finally {
      setLoading(false);
    }
  });
})();