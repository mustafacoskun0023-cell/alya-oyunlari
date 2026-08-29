/* ===== Renkler ve Şekiller — Busy Shapes modeli =====
   Ekranda şekiller ve onlara ait DELİKLER var. Çocuk şekli tutup
   deliğe sürükler. Doğruysa içeri düşer ve adı söylenir
   ("kırmızı üçgen!"). Yanlış deliğe götürürse şekil fiziksel
   olarak GİRMEZ — sessizce geri döner. Hata sesi yok, ceza yok.

   Zorluk kademeli:
     Tur 1-3  : sadece ŞEKİL önemli (hepsi aynı renk)
     Tur 4-6  : sadece RENK önemli (hepsi aynı şekil)
     Tur 7-10 : ikisi birden                                      */
window.GameShapes = (function () {

  const RENKLER = [
    { id: 'kirmizi', ad: 'kırmızı', hex: '#FF3B30', koyu: '#B3160E' },
    { id: 'mavi',    ad: 'mavi',    hex: '#2E86FF', koyu: '#134FA8' },
    { id: 'sari',    ad: 'sarı',    hex: '#FFC800', koyu: '#B58A00' },
    { id: 'yesil',   ad: 'yeşil',   hex: '#22C55E', koyu: '#12813A' },
    { id: 'turuncu', ad: 'turuncu', hex: '#FF8A00', koyu: '#B35F00' },
    { id: 'mor',     ad: 'mor',     hex: '#8B5CF6', koyu: '#5B32C4' },
    { id: 'pembe',   ad: 'pembe',   hex: '#FF5FA2', koyu: '#C42C6E' }
  ];

  const SEKILLER = [
    { id: 'daire',      ad: 'daire',      d: 'M100 20 a80 80 0 1 0 .1 0 z' },
    { id: 'kare',       ad: 'kare',       d: 'M28 28 h144 v144 h-144 z' },
    { id: 'ucgen',      ad: 'üçgen',      d: 'M100 22 L178 172 L22 172 z' },
    { id: 'yildiz',     ad: 'yıldız',     d: 'M100 18 L122 74 L182 78 L136 116 L151 175 L100 142 L49 175 L64 116 L18 78 L78 74 z' },
    { id: 'kalp',       ad: 'kalp',       d: 'M100 172 C20 118 26 52 66 44 C86 40 98 54 100 66 C102 54 114 40 134 44 C174 52 180 118 100 172 z' },
    { id: 'dikdortgen', ad: 'dikdörtgen', d: 'M18 56 h164 v88 h-164 z' }
  ];

  const NOT_SEKIL = {
    daire: 'Daire yuvarlaktır, hiç köşesi yoktur. Top gibi, tekerlek gibi.',
    kare: 'Karenin dört köşesi ve dört eşit kenarı vardır.',
    ucgen: 'Üçgenin üç köşesi vardır. Çatı gibi sivridir.',
    yildiz: 'Yıldızın beş sivri ucu vardır, gökyüzünde parlar.',
    kalp: 'Kalp sevgiyi anlatır. Üstü iki tümsek, altı sivridir.',
    dikdortgen: 'Dikdörtgen de dört köşelidir ama kareden uzundur. Kapı gibi.'
  };
  const NOT_RENK = {
    kirmizi: 'Kırmızı elmanın, domatesin rengidir.',
    mavi: 'Mavi gökyüzünün ve denizin rengidir.',
    sari: 'Sarı güneşin ve muzun rengidir.',
    yesil: 'Yeşil çimenin ve yaprakların rengidir.',
    turuncu: 'Turuncu havucun ve portakalın rengidir.',
    mor: 'Mor üzümün ve menekşenin rengidir.',
    pembe: 'Pembe çiçeklerin ve pamuk şekerin rengidir.'
  };

  const TUR = 10;
  let ctx = null, i = 0, hedefler = [], kalan = 0, hata = 0;

  function mount(c) {
    ctx = c; i = 0; hata = 0;
    ctx.options.className = 'options-area sekil';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say({ id: 'sys-oyun-renk', text: 'Şekilleri deliklerine yerleştirelim!' });
    ctx.duck(2800);
    setTimeout(kur, 300);
  }

  function sekilSVG(s, renk, sinif) {
    return `<svg viewBox="0 0 200 200" class="${sinif}" xmlns="http://www.w3.org/2000/svg">
      <path d="${s.d}" fill="${renk ? renk.hex : '#2B1B54'}"
        stroke="${renk ? renk.koyu : '#000'}" stroke-width="7" stroke-linejoin="round"/></svg>`;
  }
  function delikSVG(s) {
    return `<svg viewBox="0 0 200 200" class="sk-delik-svg" xmlns="http://www.w3.org/2000/svg">
      <path d="${s.d}" fill="rgba(43,27,84,.16)" stroke="rgba(255,255,255,.85)"
        stroke-width="6" stroke-dasharray="12 8" stroke-linejoin="round"/></svg>`;
  }

  /* tur numarasına göre hangi kriter önemli */
  function turAyari() {
    if (i < 3)  return { kriter: 'sekil', adet: 3 };
    if (i < 6)  return { kriter: 'renk',  adet: 3 };
    return { kriter: 'ikisi', adet: 3 };
  }

  function kur() {
    if (i >= TUR) return bitir();
    const { kriter, adet } = turAyari();
    ctx.setProgress(i, TUR);

    let parcalar;
    if (kriter === 'sekil') {
      const r = U.pick(RENKLER);
      parcalar = U.sample(SEKILLER, adet).map(s => ({ s, r, id: s.id }));
    } else if (kriter === 'renk') {
      const s = U.pick(SEKILLER);
      parcalar = U.sample(RENKLER, adet).map(r => ({ s, r, id: r.id }));
    } else {
      const ss = U.sample(SEKILLER, adet);
      const rr = U.sample(RENKLER, adet);
      parcalar = ss.map((s, n) => ({ s, r: rr[n], id: s.id + '-' + rr[n].id }));
    }

    kalan = parcalar.length;
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">${
      kriter === 'renk' ? 'Renkleri yerine koy!' : 'Şekilleri deliğine koy!'
    }</div></div>`;

    ctx.options.innerHTML = `
      <div class="sk-delikler" id="skDelik">${
        U.shuffle(parcalar.slice()).map(p =>
          `<div class="sk-delik" data-id="${p.id}"
             style="${kriter === 'renk' ? `--dr:${p.r.hex}` : ''}">
             ${delikSVG(p.s)}
             ${kriter === 'renk' ? `<span class="sk-renk-ipucu" style="background:${p.r.hex}"></span>` : ''}
           </div>`).join('')
      }</div>
      <div class="sk-parcalar" id="skParca"></div>`;

    const kap = ctx.options.querySelector('#skParca');
    U.shuffle(parcalar.slice()).forEach(p => {
      const b = document.createElement('div');
      b.className = 'sk-parca';
      b.dataset.id = p.id;
      b.innerHTML = sekilSVG(p.s, p.r, 'sk-svg');
      parcaBagla(b, p, kriter);
      kap.appendChild(b);
    });

    ctx.duck(2200);
    Snd.say({ id: kriter === 'renk' ? 'sys-renk-koy' : 'sys-sekil-koy',
      text: kriter === 'renk' ? 'Renkleri yerine koy!' : 'Şekilleri deliğine koy!' });
  }

  function parcaBagla(b, p, kriter) {
    const sesId = kriter === 'renk' ? 'renk-' + p.r.id
                : kriter === 'sekil' ? 'sekil-' + p.s.id
                : 'rs-' + p.r.id + '-' + p.s.id;
    const sesTx = kriter === 'renk' ? p.r.ad
                : kriter === 'sekil' ? p.s.ad
                : p.r.ad + ' ' + p.s.ad;
    Surukle.bagla(b, {
      veri: p,
      hayaletHtml: sekilSVG(p.s, p.r, 'sk-svg hayalet'),
      tutuldu: () => { ctx.duck(1600); Snd.say({ id: sesId, text: sesTx }); },
      tekDokunus: () => { ctx.duck(1600); Snd.say({ id: sesId, text: sesTx }); },
      hedefSec: (x, y) => {
        const h = Surukle.hedefBul(ctx.options, '.sk-delik', x, y);
        [...ctx.options.querySelectorAll('.sk-delik')].forEach(d =>
          d.classList.toggle('aktif', d === h && d.dataset.id === p.id && !d.classList.contains('dolu')));
      },
      birakildi: (v, x, y) => {
        [...ctx.options.querySelectorAll('.sk-delik')].forEach(d => d.classList.remove('aktif'));
        const h = Surukle.hedefBul(ctx.options, '.sk-delik', x, y);
        if (!h) return;                                   // boşluğa bıraktı, bir şey olmaz
        if (h.dataset.id !== p.id || h.classList.contains('dolu')) {
          // yanlış delik: şekil GİRMEZ, sadece geri seker — ses yok
          h.classList.remove('sekti'); void h.offsetWidth; h.classList.add('sekti');
          hata++;
          return;
        }
        yerlesti(b, h, p, sesId, sesTx, kriter);
      }
    });
  }

  function yerlesti(b, delik, p, sesId, sesTx, kriter) {
    delik.classList.add('dolu');
    delik.innerHTML = sekilSVG(p.s, p.r, 'sk-svg yerlesti');
    b.remove();
    Snd.sfx.correct(); ctx.happy();
    const r = delik.getBoundingClientRect();
    FX.confetti(30, r.left + r.width / 2, r.top + r.height / 2);
    ctx.duck(2000);
    Snd.say({ id: sesId, text: sesTx });

    kalan--;
    if (kalan <= 0) {
      const notId = kriter === 'renk' ? 'not-renk-' + p.r.id : 'not-sekil-' + p.s.id;
      const notTx = kriter === 'renk' ? NOT_RENK[p.r.id] : NOT_SEKIL[p.s.id];
      setTimeout(() => turBitti(notId, notTx), 900);
    }
  }

  function turBitti(notId, notTx) {
    Snd.sfx.applause();
    FX.confetti(70, innerWidth / 2, innerHeight / 2);
    ctx.duck(5000);
    Snd.say({ id: notId, text: notTx }, { delay: 400 });

    const balon = document.createElement('div');
    balon.className = 'aciklama-balon gorun';
    balon.textContent = notTx;
    ctx.prompt.appendChild(balon);

    i++;
    ctx.setProgress(i, TUR);
    setTimeout(kur, Math.min(1800 + notTx.length * 82, 6400));
  }

  function bitir() {
    const yildiz = hata <= 2 ? 3 : hata <= 6 ? 2 : 1;
    ctx.options.className = 'options-area';
    ctx.finish(yildiz, 'Bütün şekilleri ve renkleri yerleştirdin!');
  }

  return {
    id: 'shapes', title: 'Renkler ve<br>Şekiller', emoji: '🎨', mode: 'custom',
    intro: { id: 'sys-oyun-renk', text: 'Şekilleri deliklerine yerleştirelim!' },
    mount
  };
})();
