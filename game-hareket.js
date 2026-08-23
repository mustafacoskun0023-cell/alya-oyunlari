/* ===== Hareket Oyunu ve Nefes Egzersizi =====
   İkisi de ekrana bakıp vücutla yapılıyor — hiç okuma yok,
   büyük görsel + sesli yönerge + geri sayım. */

/* ---------- 1) Hareket Oyunu: "Pati'nin dediğini yap" ---------- */
window.GameHareket = (function () {
  const HAREKETLER = [
    { e: '🙆', ad: 'Kollarını yukarı kaldır', id: 'hrk-kollar', sure: 6 },
    { e: '🦵', ad: 'Tek ayak üstünde dur',    id: 'hrk-tekayak', sure: 8 },
    { e: '🤸', ad: 'Yerinde zıpla',           id: 'hrk-zipla',   sure: 8 },
    { e: '🏃', ad: 'Yerinde koş',             id: 'hrk-kos',     sure: 8 },
    { e: '👏', ad: 'Ellerini çırp',           id: 'hrk-cirp',    sure: 6 },
    { e: '🙇', ad: 'Öne doğru eğil',          id: 'hrk-egil',    sure: 6 },
    { e: '🔄', ad: 'Kendi etrafında dön',     id: 'hrk-don',     sure: 6 },
    { e: '🧘', ad: 'Bağdaş kurup otur',       id: 'hrk-bagdas',  sure: 8 },
    { e: '🐸', ad: 'Kurbağa gibi zıpla',      id: 'hrk-kurbaga', sure: 8 },
    { e: '🦅', ad: 'Kollarını kanat gibi aç', id: 'hrk-kanat',   sure: 6 },
    { e: '🐻', ad: 'Ayı gibi yürü',           id: 'hrk-ayi',     sure: 8 },
    { e: '⭐', ad: 'Yıldız gibi kollarını ve bacaklarını aç', id: 'hrk-yildiz', sure: 6 }
  ];

  let ctx = null, sira = [], hi = 0, sayacT = null;
  const TUR = 8;

  function mount(c) {
    ctx = c; hi = 0;
    sira = U.shuffle(HAREKETLER).slice(0, TUR);
    ctx.options.className = 'options-area hareket-alan';
    ctx.options.style.gridTemplateColumns = '1fr';
    ctx.say({ id: 'sys-oyun-hareket', text: 'Hadi birlikte hareket edelim! Ekranı izle ve aynısını yap.' });
    ctx.duck(3400);
    setTimeout(basla, 3500);
  }

  function basla() {
    if (hi >= sira.length) {
      clearInterval(sayacT);
      ctx.options.className = 'options-area';
      ctx.finish(3, `${TUR} hareketin hepsini yaptın!`);
      return;
    }
    const h = sira[hi];
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">Hazır mısın?</div></div>`;
    ctx.setProgress(hi, sira.length);

    ctx.options.innerHTML = `
      <div class="hrk-kutu">
        <div class="hrk-emoji">${h.e}</div>
        <div class="hrk-ad">${h.ad}</div>
        <div class="hrk-halka"><svg viewBox="0 0 100 100"><circle class="hrk-iz" cx="50" cy="50" r="44"/>
          <circle class="hrk-dolu" id="hrkDolu" cx="50" cy="50" r="44"/></svg>
          <span class="hrk-sayi" id="hrkSayi">${h.sure}</span></div>
        <button class="pill-btn green kucuk hrk-atla" id="hrkAtla">➡️ Sıradaki</button>
      </div>`;

    ctx.duck(2400);
    Snd.say({ id: h.id, text: h.ad });

    ctx.options.querySelector('#hrkAtla').addEventListener('click', () => {
      Snd.sfx.tap(); bitir();
    });

    let kalan = h.sure;
    const daire = ctx.options.querySelector('#hrkDolu');
    const yazi = ctx.options.querySelector('#hrkSayi');
    const cevre = 2 * Math.PI * 44;
    daire.style.strokeDasharray = cevre;
    daire.style.strokeDashoffset = 0;

    clearInterval(sayacT);
    sayacT = setInterval(() => {
      kalan--;
      if (yazi) yazi.textContent = Math.max(kalan, 0);
      if (daire) daire.style.strokeDashoffset = cevre * (1 - kalan / h.sure);
      if (kalan <= 3 && kalan > 0) Snd.sfx.tap();
      if (kalan <= 0) { clearInterval(sayacT); bitir(); }
    }, 1000);
  }

  function bitir() {
    clearInterval(sayacT);
    Snd.sfx.correct(); ctx.happy();
    const el = ctx.options.querySelector('.hrk-kutu');
    if (el) {
      const r = el.getBoundingClientRect();
      FX.confetti(50, r.left + r.width / 2, r.top + r.height / 2);
    }
    hi++;
    ctx.setProgress(hi, sira.length);
    ctx.duck(1400);
    Snd.say(U.pick([
      { id: 'ovgu-1', text: 'Aferin Alya!' }, { id: 'ovgu-4', text: 'Bravo!' },
      { id: 'ovgu-7', text: 'Çok iyi!' }
    ]));
    setTimeout(basla, 1500);
  }

  return {
    id: 'hareket', title: 'Hareket<br>Oyunu', emoji: '🥋', mode: 'custom',
    intro: { id: 'sys-oyun-hareket', text: 'Hadi birlikte hareket edelim!' },
    mount
  };
})();

/* ---------- 2) Nefes Egzersizi: büyüyüp küçülen balon ---------- */
window.GameNefes = (function () {
  // 4 saniye al — 2 tut — 4 ver
  const TUR = 6;
  const AL = 4000, TUT = 2000, VER = 4000;
  let ctx = null, tur = 0, zaman = [], calisir = false;

  function mount(c) {
    ctx = c; tur = 0; calisir = true;
    ctx.options.className = 'options-area nefes-alan';
    ctx.options.style.gridTemplateColumns = '1fr';
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">Balonla birlikte nefes al</div></div>`;
    ctx.options.innerHTML = `
      <div class="nefes-kutu">
        <div class="nefes-balon" id="nfBalon"><span class="nefes-e">🎈</span></div>
        <div class="nefes-yazi" id="nfYazi">Hazır ol...</div>
        <div class="nefes-noktalar" id="nfN"></div>
      </div>`;
    noktalar();
    ctx.say({ id: 'sys-oyun-nefes', text: 'Balon büyürken burnundan nefes al, küçülürken ağzından ver.' });
    ctx.duck(4200);
    zamanla(() => dongu(), 4300);
  }

  function zamanla(fn, ms) { zaman.push(setTimeout(fn, ms)); }
  function temizle() { zaman.forEach(clearTimeout); zaman = []; }

  function noktalar() {
    const el = ctx.options.querySelector('#nfN');
    if (el) el.innerHTML = Array.from({ length: TUR }, (_, i) =>
      `<span class="nn ${i < tur ? 'dolu' : ''}"></span>`).join('');
  }

  function dongu() {
    if (!calisir) return;
    if (tur >= TUR) {
      ctx.options.className = 'options-area';
      ctx.finish(3, 'Nefes egzersizini tamamladın, çok rahatladın!');
      return;
    }
    const balon = ctx.options.querySelector('#nfBalon');
    const yazi = ctx.options.querySelector('#nfYazi');
    if (!balon) return;

    // AL
    yazi.textContent = 'Nefes al…';
    yazi.className = 'nefes-yazi al';
    balon.style.transition = `transform ${AL}ms cubic-bezier(.4,0,.5,1)`;
    balon.style.transform = 'scale(1.55)';
    ctx.duck(AL + 400);
    Snd.say({ id: 'nefes-al', text: 'Nefes al' });

    zamanla(() => {
      // TUT
      yazi.textContent = 'Tut…';
      yazi.className = 'nefes-yazi tut';
      Snd.say({ id: 'nefes-tut', text: 'Tut' });
      zamanla(() => {
        // VER
        yazi.textContent = 'Nefes ver…';
        yazi.className = 'nefes-yazi ver';
        balon.style.transition = `transform ${VER}ms cubic-bezier(.4,0,.5,1)`;
        balon.style.transform = 'scale(1)';
        ctx.duck(VER + 400);
        Snd.say({ id: 'nefes-ver', text: 'Nefes ver' });
        zamanla(() => {
          tur++;
          noktalar();
          ctx.setProgress(tur, TUR);
          Snd.sfx.star();
          dongu();
        }, VER);
      }, TUT);
    }, AL);
  }

  return {
    id: 'nefes', title: 'Nefes<br>Egzersizi', emoji: '🌬️', mode: 'custom',
    intro: { id: 'sys-oyun-nefes', text: 'Balonla birlikte nefes alalım.' },
    mount
  };
})();
