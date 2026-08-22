/* ===== Maskot: Pati (turuncu kedi yavrusu) ===== */
window.Mascot = (function () {

  function eyes(mood) {
    if (mood === 'happy') {
      return `
      <path d="M30 46 q7 -10 14 0" fill="none" stroke="#3A2A16" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M56 46 q7 -10 14 0" fill="none" stroke="#3A2A16" stroke-width="4.5" stroke-linecap="round"/>`;
    }
    if (mood === 'oops') {
      return `
      <ellipse cx="37" cy="47" rx="8" ry="8.5" fill="#fff"/>
      <ellipse cx="63" cy="47" rx="8" ry="8.5" fill="#fff"/>
      <circle cx="37" cy="49" r="5" fill="#3A2A16"/>
      <circle cx="63" cy="49" r="5" fill="#3A2A16"/>
      <path d="M29 39 q8 -4 15 1" fill="none" stroke="#3A2A16" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M71 39 q-8 -4 -15 1" fill="none" stroke="#3A2A16" stroke-width="3.4" stroke-linecap="round"/>`;
    }
    return `
      <ellipse cx="37" cy="46" rx="8.5" ry="9.5" fill="#fff"/>
      <ellipse cx="63" cy="46" rx="8.5" ry="9.5" fill="#fff"/>
      <circle cx="37.5" cy="47" r="5.6" fill="#3A2A16"/>
      <circle cx="63.5" cy="47" r="5.6" fill="#3A2A16"/>
      <circle cx="39.6" cy="44.6" r="2.1" fill="#fff"/>
      <circle cx="65.6" cy="44.6" r="2.1" fill="#fff"/>`;
  }

  function mouth(mood) {
    if (mood === 'happy') {
      return `<path d="M42 63 q8 12 16 0 q-8 4 -16 0 z" fill="#E4557A" stroke="#3A2A16" stroke-width="2.6" stroke-linejoin="round"/>`;
    }
    if (mood === 'oops') {
      return `<path d="M43 67 q7 -6 14 0" fill="none" stroke="#3A2A16" stroke-width="3.2" stroke-linecap="round"/>`;
    }
    return `<path d="M50 60 q-5 7 -9 2 M50 60 q5 7 9 2" fill="none" stroke="#3A2A16" stroke-width="3.2" stroke-linecap="round"/>`;
  }

  /* mood: idle | happy | oops */
  function svg(mood) {
    mood = mood || 'idle';
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:100%;height:100%;display:block">
  <defs>
    <linearGradient id="furG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFB35C"/><stop offset="1" stop-color="#F08A2E"/>
    </linearGradient>
  </defs>
  <!-- kulaklar -->
  <path d="M20 34 L23 9 L45 24 Z" fill="url(#furG)" stroke="#C96A18" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M80 34 L77 9 L55 24 Z" fill="url(#furG)" stroke="#C96A18" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M26 30 L28 16 L40 25 Z" fill="#FF9EBB"/>
  <path d="M74 30 L72 16 L60 25 Z" fill="#FF9EBB"/>
  <!-- baş -->
  <ellipse cx="50" cy="52" rx="36" ry="33" fill="url(#furG)" stroke="#C96A18" stroke-width="2.5"/>
  <!-- alın çizgileri -->
  <path d="M50 22 v9 M40 24 l3 8 M60 24 l-3 8" stroke="#C96A18" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- yanak allık -->
  <ellipse cx="24" cy="58" rx="7.5" ry="5" fill="#FF7FA8" opacity=".55"/>
  <ellipse cx="76" cy="58" rx="7.5" ry="5" fill="#FF7FA8" opacity=".55"/>
  ${eyes(mood)}
  <!-- burun -->
  <path d="M46 56 h8 l-4 4.5 z" fill="#E4557A" stroke="#C33D60" stroke-width="1.2" stroke-linejoin="round"/>
  ${mouth(mood)}
  <!-- bıyıklar -->
  <path d="M17 54 h13 M16 61 h14 M83 54 h-13 M84 61 h-14"
        stroke="#FFF3DF" stroke-width="2.4" stroke-linecap="round" opacity=".95"/>
</svg>`;
  }

  function render(el, mood) {
    if (!el) return;
    el.innerHTML = svg(mood);
  }

  /* Geçici mood: belli süre sonra idle'a döner */
  function flash(el, mood, ms) {
    if (!el) return;
    render(el, mood);
    clearTimeout(el._mt);
    el._mt = setTimeout(() => render(el, 'idle'), ms || 1600);
  }

  /* ---- Mina (görsel karakter) ---- */
  const MINA = { idle:'mina-normal', happy:'mina-mutlu', oops:'mina-uzgun',
                 dua:'mina-dua', think:'mina-dusunuyor', clap:'mina-alkis' };

  function minaRender(el, mood) {
    if (!el) return;
    const d = MINA[mood] || MINA.idle;
    el.innerHTML = `<img src="gorseller/${d}.webp" alt="" style="width:100%;height:100%;object-fit:contain;display:block"
      onerror="this.replaceWith(Object.assign(document.createElement('div'),{innerHTML:window.Mascot.svg('${mood||'idle'}')}))">`;
  }

  /* tip: 'kedi' | 'mina' */
  function set(el, tip, mood) {
    if (!el) return;
    el._tip = tip;
    if (tip === 'mina') minaRender(el, mood); else render(el, mood);
  }
  function flashTip(el, mood, ms) {
    if (!el) return;
    set(el, el._tip || 'kedi', mood);
    clearTimeout(el._mt);
    el._mt = setTimeout(() => set(el, el._tip || 'kedi', 'idle'), ms || 1600);
  }

  return { svg, render, flash, set, flashTip, minaRender };
})();
