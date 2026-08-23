/* ===== Tesettür Moda Atölyesi — giydirme oyunu =====
   Mina'yı giydiriyoruz. Sol/üstte parça rafları (eşarp, elbise,
   ayakkabı, çanta), ortada karakter. Her parçaya dokununca adı
   söylenir ve anında üzerine giydirilir — okuma gerekmez.
   Serbest mod: istediğini giy. Görev modu: "Camiye gidiyoruz,
   uygun kombini hazırla" gibi hedefler. */
window.GameGiydirme = (function () {

  /* ---- parça katalogu ---- */
  const PARCA = {
    esarp: [
      { id: 'esp-pembe',  ad: 'Pembe eşarp',   renk: '#F7A8C4' },
      { id: 'esp-lila',   ad: 'Lila eşarp',    renk: '#C9AEE8' },
      { id: 'esp-mint',   ad: 'Mint eşarp',    renk: '#A8DCC8' },
      { id: 'esp-krem',   ad: 'Krem eşarp',    renk: '#EBDCC2' },
      { id: 'esp-mavi',   ad: 'Mavi eşarp',    renk: '#A9C8E8' },
      { id: 'esp-bordo',  ad: 'Bordo eşarp',   renk: '#B36B7E' }
    ],
    elbise: [
      { id: 'elb-pembe',  ad: 'Pembe elbise',  renk: '#F2A2BE' },
      { id: 'elb-lila',   ad: 'Lila elbise',   renk: '#BFA4E0' },
      { id: 'elb-yesil',  ad: 'Yeşil elbise',  renk: '#9FD3B8' },
      { id: 'elb-krem',   ad: 'Krem elbise',   renk: '#E8D8BC' },
      { id: 'elb-lacivert',ad: 'Lacivert elbise', renk: '#5C6B96' },
      { id: 'elb-sari',   ad: 'Sarı elbise',   renk: '#F0D188' }
    ],
    ayakkabi: [
      { id: 'ayk-pembe',  ad: 'Pembe ayakkabı', renk: '#F2A2BE' },
      { id: 'ayk-beyaz',  ad: 'Beyaz ayakkabı', renk: '#F4F1EC' },
      { id: 'ayk-kahve',  ad: 'Kahve bot',      renk: '#A87C58' },
      { id: 'ayk-mavi',   ad: 'Mavi ayakkabı',  renk: '#8FB4DC' }
    ],
    canta: [
      { id: 'cnt-yok',    ad: 'Çanta yok',      renk: null },
      { id: 'cnt-pembe',  ad: 'Pembe çanta',    renk: '#F2A2BE' },
      { id: 'cnt-krem',   ad: 'Krem çanta',     renk: '#E5D3B3' },
      { id: 'cnt-lila',   ad: 'Lila çanta',     renk: '#C4A8E4' }
    ]
  };

  const RAF = [
    { anahtar: 'esarp',    ad: 'Eşarp',     e: '🧕' },
    { anahtar: 'elbise',   ad: 'Elbise',    e: '👗' },
    { anahtar: 'ayakkabi', ad: 'Ayakkabı',  e: '👟' },
    { anahtar: 'canta',    ad: 'Çanta',     e: '👜' }
  ];

  /* ---- görevler: hangi ortama ne yakışır ---- */
  const GOREVLER = [
    { id: 'gyd-cami',   e: '🕌', metin: 'Camiye gidiyoruz. Sade ve şık bir kombin hazırla!',
      ipucu: 'Camiye giderken sade renkler ve uzun elbise güzel durur.',
      kural: k => k.elbise && k.esarp,
      ders: 'Camiye giderken temiz, sade ve kapalı giyinmek güzel bir edeptir.' },
    { id: 'gyd-bayram', e: '🎁', metin: 'Bayram sabahı! En güzel kombini hazırla.',
      ipucu: 'Bayramda canlı ve neşeli renkler seçebilirsin.',
      kural: k => k.elbise && k.esarp && k.ayakkabi,
      ders: 'Bayramda en güzel kıyafetimizi giymek, o günü kutlamaktır.' },
    { id: 'gyd-park',   e: '🌳', metin: 'Parka gidiyoruz. Rahat bir kombin hazırla!',
      ipucu: 'Parkta koşacağız, rahat ayakkabı önemli.',
      kural: k => k.elbise && k.ayakkabi,
      ders: 'Oynayacağımız yerlerde rahat kıyafet seçmek en iyisidir.' },
    { id: 'gyd-misafir',e: '🍰', metin: 'Misafirliğe gidiyoruz. Şık bir kombin hazırla!',
      ipucu: 'Misafirliğe giderken çanta da güzel tamamlar.',
      kural: k => k.elbise && k.esarp && k.canta && k.canta !== 'cnt-yok',
      ders: 'Misafirliğe düzgün giyinmek, ev sahibine gösterdiğimiz saygıdır.' },
    { id: 'gyd-okul',   e: '📚', metin: 'Okula gidiyoruz. Düzenli bir kombin hazırla!',
      ipucu: 'Okulda sade renkler ve rahat ayakkabı iyi olur.',
      kural: k => k.elbise && k.esarp && k.ayakkabi,
      ders: 'Okula düzenli gitmek, öğrenmeye hazır olmak demektir.' },
    { id: 'gyd-serbest',e: '✨', metin: 'Şimdi tamamen serbest! İstediğin kombini yap.',
      ipucu: 'Ne istersen giyebilirsin, bu senin tasarımın.',
      kural: () => true,
      ders: 'Kendi tarzını bulmak çok güzel. Sen ne seçtiysen o güzel.' }
  ];

  let ctx = null, gi = 0, secili = {}, acikRaf = 'esarp', karakterEl = null;

  function mount(c) {
    ctx = c; gi = 0;
    secili = { esarp: 'esp-pembe', elbise: 'elb-pembe', ayakkabi: 'ayk-pembe', canta: 'cnt-yok' };
    ctx.say({ id: 'sys-oyun-giydirme', text: "Mina'yı birlikte giydirelim!" });
    ctx.duck(2600);
    setTimeout(kur, 2700);
  }

  function parcaBul(anahtar, id) {
    return PARCA[anahtar].find(p => p.id === id) || PARCA[anahtar][0];
  }

  /* Mina'nın SVG'si — seçilen renklere göre çizilir */
  function minaSVG() {
    const es = parcaBul('esarp', secili.esarp).renk;
    const el = parcaBul('elbise', secili.elbise).renk;
    const ay = parcaBul('ayakkabi', secili.ayakkabi).renk;
    const cn = parcaBul('canta', secili.canta).renk;
    return `
<svg viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg" class="mina-svg" aria-hidden="true">
  <defs>
    <linearGradient id="elbG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${el}"/>
      <stop offset="1" stop-color="${el}" stop-opacity=".78"/>
    </linearGradient>
  </defs>
  <!-- elbise -->
  <path d="M100 96 C72 96 60 112 56 134 L34 268 C60 282 140 282 166 268 L144 134 C140 112 128 96 100 96 Z"
        fill="url(#elbG)" stroke="rgba(0,0,0,.16)" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- kollar -->
  <path d="M62 118 L40 200 L58 208 L76 136 Z"  fill="${el}" stroke="rgba(0,0,0,.14)" stroke-width="2"/>
  <path d="M138 118 L160 200 L142 208 L124 136 Z" fill="${el}" stroke="rgba(0,0,0,.14)" stroke-width="2"/>
  <!-- eller -->
  <circle cx="48" cy="209" r="10" fill="#F6D3B8"/>
  <circle cx="152" cy="209" r="10" fill="#F6D3B8"/>
  <!-- ayakkabılar -->
  <ellipse cx="80" cy="288" rx="20" ry="11" fill="${ay}" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
  <ellipse cx="122" cy="288" rx="20" ry="11" fill="${ay}" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
  <!-- yüz -->
  <ellipse cx="100" cy="62" rx="34" ry="38" fill="#F8DCC4"/>
  <!-- eşarp -->
  <path d="M100 16 C64 16 56 46 58 70 C60 96 74 106 74 106 L60 132 C78 142 122 142 140 132 L126 106
           C126 106 140 96 142 70 C144 46 136 16 100 16 Z"
        fill="${es}" stroke="rgba(0,0,0,.14)" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M100 16 C74 16 64 38 64 60 C78 44 122 44 136 60 C136 38 126 16 100 16 Z"
        fill="#fff" opacity=".18"/>
  <!-- yüz açıklığı -->
  <ellipse cx="100" cy="64" rx="26" ry="31" fill="#F8DCC4"/>
  <!-- gözler ve gülümseme -->
  <ellipse cx="90" cy="62" rx="4.4" ry="5.2" fill="#3A2A45"/>
  <ellipse cx="110" cy="62" rx="4.4" ry="5.2" fill="#3A2A45"/>
  <circle cx="91.6" cy="60.2" r="1.5" fill="#fff"/>
  <circle cx="111.6" cy="60.2" r="1.5" fill="#fff"/>
  <ellipse cx="80" cy="72" rx="6" ry="4" fill="#F4A8B8" opacity=".6"/>
  <ellipse cx="120" cy="72" rx="6" ry="4" fill="#F4A8B8" opacity=".6"/>
  <path d="M92 76 q8 7 16 0" fill="none" stroke="#B4667A" stroke-width="2.6" stroke-linecap="round"/>
  ${cn ? `<!-- çanta -->
  <rect x="150" y="196" width="34" height="30" rx="7" fill="${cn}" stroke="rgba(0,0,0,.16)" stroke-width="2"/>
  <path d="M158 196 q9 -14 18 0" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="3"/>` : ''}
</svg>`;
  }

  function kur() {
    const g = GOREVLER[gi];
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="gorev-serit"><span class="gorev-e">${g.e}</span>
          <span class="gorev-t">${g.metin}</span></div>
      </div>`;
    ctx.setProgress(gi, GOREVLER.length);
    ctx.duck(3000);
    ctx.say({ id: g.id, text: g.metin });

    ctx.options.className = 'options-area giydirme';
    ctx.options.style.gridTemplateColumns = '';
    ctx.options.innerHTML = `
      <div class="giy-sahne"><div class="giy-mina" id="giyMina">${minaSVG()}</div></div>
      <div class="giy-panel">
        <div class="raf-sekme" id="rafSekme"></div>
        <div class="raf-parcalar" id="rafParca"></div>
        <button class="pill-btn green giy-hazir" id="giyHazir">✅ Hazır!</button>
      </div>`;
    karakterEl = ctx.options.querySelector('#giyMina');
    sekmeCiz();
    rafCiz();
    ctx.options.querySelector('#giyHazir').addEventListener('click', hazir);
  }

  function sekmeCiz() {
    const el = ctx.options.querySelector('#rafSekme');
    el.innerHTML = '';
    RAF.forEach(r => {
      const b = document.createElement('button');
      b.className = 'raf-btn' + (r.anahtar === acikRaf ? ' acik' : '');
      b.innerHTML = `<span class="raf-e">${r.e}</span><span class="raf-ad">${r.ad}</span>`;
      b.addEventListener('click', () => {
        acikRaf = r.anahtar;
        Snd.sfx.tap();
        Snd.say({ id: 'giy-raf-' + r.anahtar, text: r.ad });
        Snd.duck(1200);
        sekmeCiz(); rafCiz();
      });
      el.appendChild(b);
    });
  }

  function rafCiz() {
    const el = ctx.options.querySelector('#rafParca');
    el.innerHTML = '';
    PARCA[acikRaf].forEach(p => {
      const b = document.createElement('button');
      b.className = 'parca' + (secili[acikRaf] === p.id ? ' secili' : '');
      b.innerHTML = p.renk
        ? `<span class="parca-renk" style="background:${p.renk}"></span>`
        : `<span class="parca-renk yok">✖</span>`;
      b.setAttribute('aria-label', p.ad);
      b.addEventListener('click', () => {
        secili[acikRaf] = p.id;
        Snd.sfx.tap();
        Snd.duck(1400);
        Snd.say({ id: p.id, text: p.ad });      // parçanın adı söylenir
        karakterEl.innerHTML = minaSVG();
        karakterEl.classList.remove('giydi'); void karakterEl.offsetWidth;
        karakterEl.classList.add('giydi');
        rafCiz();
      });
      el.appendChild(b);
    });
  }

  function hazir() {
    const g = GOREVLER[gi];
    Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
    const r = karakterEl.getBoundingClientRect();
    FX.confetti(90, r.left + r.width / 2, r.top + r.height / 3);
    ctx.duck(5200);
    ctx.say({ id: g.id + '-ders', text: g.ders }, { delay: 700 });

    const kutu = document.createElement('div');
    kutu.className = 'aciklama-balon gorun';
    kutu.textContent = g.ders;
    ctx.prompt.appendChild(kutu);

    gi++;
    ctx.setProgress(gi, GOREVLER.length);
    setTimeout(() => {
      if (gi >= GOREVLER.length) {
        ctx.options.className = 'options-area';
        ctx.finish(3, 'Bütün kombinleri hazırladın!');
      } else {
        Snd.sfx.star();
        kur();
      }
    }, Math.min(2200 + g.ders.length * 82, 7500));
  }

  return {
    id: 'giydirme', title: 'Moda<br>Atölyesi', emoji: '🧕', mode: 'custom',
    intro: { id: 'sys-oyun-giydirme', text: "Mina'yı birlikte giydirelim!" },
    mount
  };
})();
