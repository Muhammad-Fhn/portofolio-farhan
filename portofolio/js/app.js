(function () {
  "use strict";
  const grid = document.getElementById("works-grid");
  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");
  const closeBtn = document.getElementById("modal-close");
  let opener = null;

  // Garis konstruksi: grid 8x8, tiap 12 unit
  const guide = (() => { let d = ""; for (let i = 0; i <= 96; i += 12) d += `M${i} 0V96M0 ${i}H96`; return d; })();
  const svg = (w, lg) => `<svg class="mark${lg ? " lg" : ""}" viewBox="0 0 96 96" aria-hidden="true"><path class="guide" d="${guide}"/><path class="shape" d="${w.mark}"/></svg>`;
  const isLight = hex => { const c = hex.slice(1); const [r, g, b] = [0, 2, 4].map(i => parseInt(c.substr(i, 2), 16)); return (r * 299 + g * 587 + b * 114) / 1000 > 150; };

  function render() {
    grid.innerHTML = worksData.map((w, i) => `
      <button type="button" class="card reveal" data-i="${i}" style="transition-delay:${i * 40}ms" aria-label="${w.title}, buka detail">
        <div class="card-top">${svg(w)}<span class="idx">${w.id}</span></div>
        <div><p class="cat">${w.category}</p><h3>${w.title}</h3><p class="meta">${w.client} · ${w.year}</p></div>
      </button>`).join("");
    grid.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => open(worksData[c.dataset.i], c)));
  }

  function open(w, from) {
    opener = from;
    body.innerHTML = `${svg(w, true)}
      <p class="cat">${w.category} · ${w.year}</p>
      <h3 id="m-title">${w.title}</h3>
      <p class="d">${w.description}</p>
      <div class="sub"><p class="muted">Palet</p><div class="swatches">${w.palette.map(c => `<div class="swatch" style="background:${c};color:${isLight(c) ? "#0F0F10" : "#F7F7F5"}">${c}</div>`).join("")}</div></div>
      <div class="sub"><p class="muted">Klien</p><p>${w.client}</p></div>
      <div class="tags">${w.tags.map(t => `<span>${t}</span>`).join("")}</div>`;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (opener) opener.focus();
  }

  function reveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    render(); reveal();
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) close(); });
  });
})();
