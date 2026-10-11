/* VIT Connect — landing page. Minimal JS: nav state, reveal, year. */

(function () {
  'use strict';

  /* sticky nav background flips once you leave the dark hero */
  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');
  var heroEnd = hero ? hero.offsetTop + hero.offsetHeight - 80 : 0;

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > heroEnd);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* fade sections in once, never out */
  var items = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
