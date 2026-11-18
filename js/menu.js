// Renders categories, dish cards, search and sticky category chips.
window.formatPrice = (p) => `${Number(p).toLocaleString('uk-UA')} ₴`;
// Every item has a local photo at img/menu/<index>.jpg (original or picked to match).
window.photoOf = (item) => `img/menu/${item._id}.jpg`;

window.initMenu = function () {
  const items = window.MENU || [];
  const esc = window.Sheet.esc;
  const list = document.getElementById('menuList');
  const chips = document.getElementById('chips');
  const empty = document.getElementById('menuEmpty');
  const search = document.getElementById('search');

  // Group by category, keeping the original order.
  const groups = [];
  const byCat = new Map();
  items.forEach((item, i) => {
    item._id = i;
    if (!byCat.has(item.categoryName)) {
      const g = { name: item.categoryName, slug: 'cat-' + groups.length, items: [] };
      byCat.set(item.categoryName, g);
      groups.push(g);
    }
    byCat.get(item.categoryName).items.push(item);
  });

  function card(item) {
    return `<button class="dish reveal" data-id="${item._id}">
      <span class="dish__media">
        <img class="dish__img" src="${window.photoOf(item)}" alt="${esc(item.name)}" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='img/logo.jpg';this.classList.add('is-fallback')">
      </span>
      <span class="dish__info">
        <span class="dish__name">${esc(item.name)}</span>
        <span class="dish__desc">${esc(item.description || item.categoryName)}</span>
        <span class="dish__price">${window.formatPrice(item.price)}${item.isWeight ? ' <small>/ 100 г</small>' : ''}</span>
      </span></button>`;
  }

  function rail(side, index, name) {
    return `<div class="rail rail--${side}" aria-hidden="true"><div class="rail__inner">
      <span class="rail__num">${String(index + 1).padStart(2, '0')}</span>
      <span class="rail__line"></span>
      <span class="rail__arrows"><i></i><i></i><i></i></span>
      <span class="rail__name">${esc(name)}</span>
    </div></div>`;
  }

  // Cards fade up as they enter the screen.
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('is-visible');
      revealer.unobserve(el);
      setTimeout(() => { el.style.transitionDelay = ''; }, 900);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  function render(query) {
    const q = query.trim().toLowerCase();
    let total = 0;
    const visible = groups
      .map((g) => ({ ...g, items: q ? g.items.filter((it) =>
        it.name.toLowerCase().includes(q) || (it.description || '').toLowerCase().includes(q)) : g.items }))
      .filter((g) => g.items.length);

    list.innerHTML = visible.map((g, i) => {
      total += g.items.length;
      return `<section class="menu__section" id="${g.slug}">
        ${rail('l', i, g.name)}${rail('r', i, g.name)}
        <h2 class="menu__heading">${esc(g.name)} <small>${g.items.length}</small></h2>
        <div class="grid">${g.items.map(card).join('')}</div>
      </section>`;
    }).join('');

    chips.innerHTML =
      `<a class="chip chip--star" href="#reviews">★ Відгуки</a>` +
      visible.map((g) =>
        `<a class="chip" href="#${g.slug}" data-slug="${g.slug}">${esc(g.name)}</a>`).join('');

    empty.hidden = total > 0;
    list.querySelectorAll('.grid').forEach((grid) =>
      grid.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${(i % 2) * 90}ms`;
        revealer.observe(el);
      }));
    observe();
  }

  // Highlight the chip of the category currently on screen.
  let observer;
  function setActive(slug) {
    chips.querySelectorAll('.chip').forEach((c) => {
      const on = c.dataset.slug === slug;
      c.classList.toggle('is-active', on);
      if (on) chips.scrollTo({ left: c.offsetLeft - (chips.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
    });
  }
  function observe() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-130px 0px -60% 0px' });
    list.querySelectorAll('.menu__section').forEach((s) => observer.observe(s));
  }

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.dish');
    if (btn) window.Sheet.open(items[btn.dataset.id]);
  });

  let t;
  search.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => render(search.value), 150);
  });

  render('');
};
