// Shared page behaviour: reveal-on-scroll, autoplaying reels, sticky buy bar, nav state, chip groups.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page;
  document.querySelectorAll(`[data-nav="${page}"]`).forEach((a) => a.setAttribute("aria-current", "page"));

  const els = [...document.querySelectorAll(".reveal")];
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.remove("pending"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight) { el.classList.add("pending"); io.observe(el); }
    });
  }

  const vids = document.querySelectorAll("video[data-autoplay]");
  const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting && !reduce) v.play().catch(() => {}); else v.pause();
  }), { threshold: 0.35 });
  vids.forEach((v) => vio.observe(v));

  const bar = document.querySelector(".buybar");
  const anchor = document.querySelector("[data-buy-anchor]");
  if (bar && anchor) {
    new IntersectionObserver(([e]) => bar.classList.toggle("show", !e.isIntersecting && e.boundingClientRect.top < 0))
      .observe(anchor);
  }

  document.querySelectorAll("[data-chips]").forEach((group) => {
    group.addEventListener("click", (ev) => {
      const btn = ev.target.closest("button.chip");
      if (!btn) return;
      group.querySelectorAll("button.chip").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      group.dispatchEvent(new CustomEvent("pick", { detail: btn.dataset.value, bubbles: true }));
    });
  });
})();

// Store: show the first-order offer in the top bar (themes published before v10 still carry the old bar)
(() => {
  const bar = document.querySelector('div.announce');
  if (!bar || /WELCOME10/.test(bar.textContent) || !document.querySelector('a.skip')) return;
  const a = document.createElement('a');
  a.className = 'announce';
  a.href = '/discount/WELCOME10?redirect=%2Fproducts%2Fcustom-pet-portrait-woven-blanket';
  a.innerHTML = '10% off your first order: <b>WELCOME10</b> (applied for you) · Free US shipping<span class="hide-sm"> · Order by Dec 10 for Christmas</span>';
  bar.replaceWith(a);
})();
