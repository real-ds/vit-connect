/* VIT Connect — nav state, scroll reveals and footer year. */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var hero = document.querySelector(".hero");
  var items = document.querySelectorAll(".reveal");
  var year = document.getElementById("year");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var observer;

  function updateNav() {
    if (!nav) return;
    var heroEnd = hero ? hero.getBoundingClientRect().bottom + window.scrollY - 80 : 0;
    nav.classList.toggle("is-stuck", window.scrollY > heroEnd);
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
  window.addEventListener("resize", updateNav, { passive: true });

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach(function (item) { item.classList.add("is-in"); });
  } else {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    items.forEach(function (item) { observer.observe(item); });
  }

  if (year) year.textContent = String(new Date().getFullYear());
})();
