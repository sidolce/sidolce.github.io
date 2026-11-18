// Automatic smooth crossfade of hero background photos.
window.initHero = function () {
  const slides = document.querySelectorAll('#heroSlides .hero__slide');
  if (!slides.length) return;

  let current = 0;
  slides[0].classList.add('is-active');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || slides.length < 2) return;

  setInterval(() => {
    if (document.hidden) return;
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, 5000);
};
