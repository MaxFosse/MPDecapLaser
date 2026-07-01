/* ═══════════════════════════════════════════════════════════
   GALERIE -> chargement depuis content/galerie.json
═══════════════════════════════════════════════════════════ */

function openLightbox(src, alt) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-img').alt = alt;
  document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

fetch('content/galerie.json')
  .then(r => r.json())
  .then(d => {

    /* ── Textes ── */
    const heroSous = document.getElementById('galerie-hero-sous');
    if (heroSous) heroSous.textContent = d.hero_sous;

    const vKicker = document.getElementById('galerie-videos-kicker');
    const vTitre  = document.getElementById('galerie-videos-titre');
    const pKicker = document.getElementById('galerie-photos-kicker');
    const pTitre  = document.getElementById('galerie-photos-titre');
    if (vKicker) vKicker.textContent = d.videos_kicker;
    if (vTitre)  vTitre.textContent  = d.videos_titre;
    if (pKicker) pKicker.textContent = d.photos_kicker;
    if (pTitre)  pTitre.textContent  = d.photos_titre;

    /* ── Vidéos ── */
    const videoGrid = document.getElementById('galerie-videos');
    if (videoGrid && d.videos) {
      d.videos.forEach(v => {
        const item = document.createElement('div');
        item.className = 'video-item';
        item.innerHTML = `
          <video controls muted playsinline preload="metadata">
            <source src="${v.src}" type="video/mp4"/>
          </video>
          <p class="caption">${v.caption}</p>`;
        videoGrid.appendChild(item);
      });
    }

    /* ── Photos ── */
    const photoGrid = document.getElementById('galerie-photos');
    if (photoGrid && d.photos) {
      d.photos.forEach(p => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.setAttribute('onclick', `openLightbox('${p.image}', '${p.alt}')`);
        item.innerHTML = `
          <img src="${p.image}" alt="${p.alt}" loading="lazy"/>
          <p class="caption">${p.caption}</p>`;
        photoGrid.appendChild(item);
      });
    }

  })
  .catch(err => console.error('content/galerie.json introuvable :', err));
