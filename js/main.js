// App entry: fills restaurant info and starts modules.
(function () {
  const s = window.SETTINGS || {};
  const esc = window.Sheet.esc;
  const address = s.address || '';
  const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Si Dolce, ' + address);

  document.getElementById('heroAddress').textContent = address;
  const r = s.reviewStats;
  if (r && r.count) {
    document.getElementById('heroRating').textContent =
      `★ ${r.averageRating.toFixed(1)} · ${r.count} відгуки гостей`;
  }
  document.getElementById('year').textContent = new Date().getFullYear();

  // Reviews block: real rating from the old menu + Google Maps links.
  if (r && r.count) {
    document.getElementById('scoreNum').textContent = r.averageRating.toFixed(1);
    document.getElementById('scoreMeta').textContent = `Середня оцінка за ${r.count} відгуками гостей`;
  }
  document.getElementById('reviewsLink').href = mapUrl;
  document.getElementById('reviewWrite').href = mapUrl;
  document.getElementById('map').src =
    'https://maps.google.com/maps?q=' + encodeURIComponent('Si Dolce, ' + address) + '&z=15&output=embed';

  const icons = {
    map: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15z"/><path d="m9 13 8-6"/></svg>',
  };
  const labels = { instagram: 'Instagram', telegram: 'Telegram' };

  const cards = [
    { href: mapUrl, icon: 'map', label: 'Адреса', value: address },
    ...(s.contacts || []).map((c) => ({
      href: c.link.replace('/@', '/'),
      icon: c.icon,
      label: labels[c.icon] || c.icon,
      value: '@' + c.title,
    })),
  ];

  document.getElementById('contactsGrid').innerHTML = cards.map((c) => `
    <a class="contact" href="${esc(c.href)}" target="_blank" rel="noopener">
      <span class="contact__icon">${icons[c.icon] || icons.map}</span>
      <span><span class="contact__label">${esc(c.label)}</span><span class="contact__value">${esc(c.value)}</span></span>
    </a>`).join('');

  window.initHero();
  window.initMenu();
})();
