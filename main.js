/* ═══════════════════════════════════════════════════════════
   ANNÉE PIED DE PAGE
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('[data-annee]').forEach(span => { span.textContent = new Date().getFullYear(); });

/* ═══════════════════════════════════════════════════════════
   MENU MOBILE
═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   ACTIVITÉS: show / hide
═══════════════════════════════════════════════════════════ */
function showActivite(id) {
  document.getElementById('activites-grid').style.display = 'none';
  document.getElementById('activite-detail').style.display = 'block';
  document.querySelectorAll('.activite-content').forEach(el => el.style.display = 'none');
  document.getElementById('detail-' + id).style.display = 'block';
  document.getElementById('activites').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideActivite() {
  document.getElementById('activite-detail').style.display = 'none';
  document.getElementById('activites-grid').style.display = 'block';
}

/* ═══════════════════════════════════════════════════════════
   FORMULAIRE: EmailJS
═══════════════════════════════════════════════════════════ */
(function () {
  const EMAILJS_PUBLIC_KEY  = '6UGo377_ymCKmYMxR';
  const EMAILJS_SERVICE_ID  = 'service_5ar1p2i';
  const EMAILJS_TEMPLATE_ID = 'template_eihbxq4';

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

    if (!name || !email || !message) { setFeedback('Tous les champs sont requis.', 'err'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFeedback('Adresse email invalide.', 'err'); return; }

    setLoading(true);
    feedback.hidden = true;

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { nom: name, email, message });
      form.reset();
      setFeedback('Message envoyé. On revient vers vous vite.', 'ok');
    } catch (_) {
      setFeedback('Réseau indisponible. Réessayez ou contactez-nous directement.', 'err');
    } finally {
      setLoading(false);
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   CHARGEMENT CONTENU -> fichiers JSON
═══════════════════════════════════════════════════════════ */

function el(id) { return document.getElementById(id); }

function renderHero(h) {
  if (el('tagline-text'))      el('tagline-text').textContent      = h.tagline_banner;
  if (el('hero-kicker'))       el('hero-kicker').textContent       = h.kicker;
  if (el('hero-h1'))           el('hero-h1').innerHTML             = `${h.h1_pre} <span class="accent">${h.h1_accent}</span><br>${h.h1_post}`;
  if (el('hero-lead'))         el('hero-lead').textContent         = h.lead;
  if (el('hero-btn-primary'))  el('hero-btn-primary').textContent  = h.btn_primary;
  if (el('hero-btn-secondary'))el('hero-btn-secondary').textContent= h.btn_secondary;
  if (el('hero-badges')) {
    el('hero-badges').innerHTML = h.badges.map(b =>
      `<div class="badge"><b>${b.titre}</b><span>${b.sous}</span></div>`
    ).join('');
  }
}

function renderRealisations(r) {
  if (el('real-titre')) el('real-titre').textContent = r.titre;
  if (el('real-sous'))  el('real-sous').textContent  = r.sous;

  const grid1 = el('real-grid-1');
  const grid2 = el('real-grid-2');
  if (grid1 && grid2) {
    r.cartes.forEach(c => {
      const art = document.createElement('article');
      art.className = 'real-card';
      art.innerHTML = `<img src="${c.image}" alt="${c.alt}" loading="lazy"/><div><h3>${c.titre}</h3><p>${c.desc}</p></div>`;
      (c.centree ? grid2 : grid1).appendChild(art);
    });
  }

  const gp = el('graffiti-panel');
  if (gp) {
    const g = r.graffiti;
    gp.innerHTML = `
      <h3>${g.titre}</h3>
      <p>${g.texte}</p>
      <p><strong>Applications :</strong></p>
      <ul>${g.applications.map(a => `<li>${a}</li>`).join('')}</ul>
      <p><strong>Avantages :</strong></p>
      <div class="avantages-grid">
        ${g.avantages.map(a => `<div class="avantage-item"><span class="avantage-check">✓</span><span>${a}</span></div>`).join('')}
      </div>`;
  }

  if (el('video-kicker')) el('video-kicker').textContent = r.video_kicker;
  if (el('video-titre'))  el('video-titre').textContent  = r.video_titre;
  if (r.video_src && el('main-video-source')) {
    el('main-video-source').src = r.video_src;
    el('main-video').load();
  }
}

function renderActivites(act) {
  if (el('activites-kicker')) el('activites-kicker').textContent = act.kicker;
  if (el('activites-titre'))  el('activites-titre').textContent  = act.titre;

  const cardsEl = el('activites-cards');
  if (!cardsEl) return;

  act.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'real-card activite-card';
    card.setAttribute('onclick', `showActivite('${item.id}')`);
    card.innerHTML = `
      <div class="real-card-emoji"><img src="${item.icon}" alt="${item.card_titre}" loading="lazy"/></div>
      <div><h3>${item.card_titre}</h3><p>${item.card_desc}</p></div>`;
    cardsEl.appendChild(card);

    const det = el('detail-' + item.id);
    if (!det) return;

    const imgHTML = `<div class="section-photo"><img src="${item.detail_image}" alt="${item.detail_titre}" loading="lazy"/></div>`;
    let extraHTML = '';
    if (item.chips && item.chips.length) {
      extraHTML = `<div class="chips">${item.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>`;
    } else if (item.info_panel) {
      extraHTML = `<div class="info-panel"><b class="gold-txt">Applications :</b><br>${item.info_panel}</div>`;
    }
    const citationHTML = item.citation
      ? `<p style="font-size:22px;border-left:4px solid #c0913a;padding-left:18px;margin:18px 0">${item.citation}</p>`
      : '';

    const textBlock = `
      <div>
        <div class="kicker">${item.detail_kicker}</div>
        <h3>${item.detail_titre}</h3>
        <p class="lead">${item.detail_lead}</p>
        ${citationHTML}
        ${extraHTML}
      </div>`;

    det.innerHTML = `<div class="split">${item.image_droite ? textBlock + imgHTML : imgHTML + textBlock}</div>`;
  });
}

function renderPrestations(d) {
  const p = d.prestations;
  if (el('prest-titre')) el('prest-titre').textContent = p.titre;
  if (el('prest-sous'))  el('prest-sous').textContent  = p.sous;
  const servEl = el('prest-services');
  if (servEl) {
    servEl.innerHTML = p.services.map(s => `
      <div class="service">
        <h3>${s.titre}</h3>
        <ul>${s.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>`).join('');
  }

  const t = d.tarifs;
  if (el('tarifs-titre')) el('tarifs-titre').textContent = t.titre;
  if (el('tarifs-lead'))  el('tarifs-lead').textContent  = t.lead;
  const tarPanel = el('tarifs-panel');
  if (tarPanel) {
    tarPanel.innerHTML = `
      <h3>${t.panel_titre}</h3>
      <p>${t.panel_intro}</p>
      <ul>${t.panel_items.map(i => `<li>${i}</li>`).join('')}</ul>
      <p>${t.panel_conclusion}</p>`;
  }
}

function renderContact(c) {
  if (el('contact-kicker')) el('contact-kicker').textContent = c.kicker;
  if (el('contact-titre'))  el('contact-titre').textContent  = c.titre;

  ['nav-tel', 'mobile-tel'].forEach(id => {
    const a = el(id);
    if (a) { a.href = `tel:+33${c.telephone.replace(/\s/g,'').replace(/^0/,'')}`; a.textContent = c.telephone; }
  });

  const ci = el('contact-info');
  if (ci) {
    ci.innerHTML = `
      <a href="tel:+33${c.telephone.replace(/\s/g,'').replace(/^0/,'')}">${c.telephone}</a>
      <a href="mailto:${c.email}?subject=Demande de devis - MP Décap Laser">${c.email}</a>
      <p>${c.adresse}<br>${c.zone}</p>
      <p style="color:#e3bf68"><strong>MP Décap Laser</strong><br>${c.tagline}</p>`;
  }
}

/* Chargement de tous les fichiers en parallèle */
Promise.all([
  fetch('content/hero.json').then(r => r.json()),
  fetch('content/realisations.json').then(r => r.json()),
  fetch('content/activites.json').then(r => r.json()),
  fetch('content/prestations.json').then(r => r.json()),
  fetch('content/contact.json').then(r => r.json()),
]).then(([hero, real, act, prest, contact]) => {
  renderHero(hero);
  renderRealisations(real);
  renderActivites(act);
  renderPrestations(prest);
  renderContact(contact);
}).catch(err => console.error('Erreur chargement contenu :', err));