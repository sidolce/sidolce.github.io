// Bottom sheet with full dish details.
window.Sheet = (function () {
  const sheet = document.getElementById('sheet');
  const body = document.getElementById('sheetBody');
  let lastFocus = null;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function modsHtml(item) {
    const groups = item.groupModifications || [];
    if (!groups.length) return '';
    return '<div class="mods">' + groups.map((g) => `
      <h4>${esc(g.name)}</h4>
      <ul>${(g.modifications || []).map((m) => `
        <li><span>${esc(m.name)}</span><span>${m.price ? '+' + window.formatPrice(m.price) : 'включено'}</span></li>
      `).join('')}</ul>`).join('') + '</div>';
  }

  function open(item) {
    lastFocus = document.activeElement;
    body.innerHTML = `
      <img class="sheet__img" src="${window.photoOf(item)}" alt="${esc(item.name)}"
           onerror="this.onerror=null;this.src='img/logo.jpg'">
      <div class="sheet__content">
        <p class="sheet__cat">${esc(item.categoryName)}</p>
        <h3 class="sheet__title" id="sheetTitle">${esc(item.name)}</h3>
        ${item.description ? `<p class="sheet__desc">${esc(item.description)}</p>` : ''}
        <p class="sheet__price">${window.formatPrice(item.price)}${item.isWeight ? ' <small>/ 100 г</small>' : ''}</p>
        ${modsHtml(item)}
      </div>`;
    sheet.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => sheet.classList.add('is-open'));
    sheet.querySelector('.sheet__close').focus();
  }

  function close() {
    sheet.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { sheet.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  }

  sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) close(); });

  return { open, close, esc };
})();
