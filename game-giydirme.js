/* ===== Tesettür Moda Atölyesi — sürükle & bırak giydirme =====
   5 karakter, 12 mekan, 6 raf dolusu kıyafet.
   Alya önce arkadaşını seçiyor, sonra "bugün nereye gidiyoruz"
   sorusuna göre onu giydiriyor. Parçayı parmağıyla tutup
   karakterin üstüne bırakıyor; yanlış yere bırakırsa nazikçe
   yönlendiriliyor. Okuma hiçbir yerde gerekmiyor.

   Görseller gorseller/ klasöründen katman katman geliyor;
   görsel yoksa emoji yedeğe düşüyor, oyun yine oynanıyor.     */
window.GameGiydirme = (function () {

  /* ---------- karakterler ---------- */
  const KARAKTER = [
    { id: 'kr-mina',   ad: 'Mina',   dosya: 'giy-kr-mina',   e: '👧' },
    { id: 'kr-lina',   ad: 'Lina',   dosya: 'giy-kr-lina',   e: '👧' },
    { id: 'kr-zeynep', ad: 'Zeynep', dosya: 'giy-kr-zeynep', e: '👧' },
    { id: 'kr-elif',   ad: 'Elif',   dosya: 'giy-kr-elif',   e: '👧' },
    { id: 'kr-sare',   ad: 'Sare',   dosya: 'giy-kr-sare',   e: '👧' }
  ];

  /* ---------- katman yerleşimi (sahne yüzdesi) ---------- */
  const KATMAN = {
    namazlik: { top: 0,  left: 50, w: 78, z: 7, bolge: [0, 96],   ad: 'Namaz örtüsü', e: '🧎' },
    esarp:    { top: 1,  left: 50, w: 47, z: 5, bolge: [0, 40],   ad: 'Eşarp',        e: '🧕' },
    elbise:   { top: 24, left: 50, w: 66, z: 2, bolge: [24, 80],  ad: 'Elbise',       e: '👗' },
    dis:      { top: 22, left: 50, w: 74, z: 3, bolge: [22, 74],  ad: 'Dış giyim',    e: '🧥' },
    ayakkabi: { top: 84, left: 50, w: 48, z: 4, bolge: [80, 100], ad: 'Ayakkabı',     e: '👟' },
    canta:    { top: 50, left: 82, w: 24, z: 6, bolge: [40, 78],  ad: 'Çanta',        e: '👜' },
    aksesuar: { top: 30, left: 50, w: 26, z: 8, bolge: [26, 46],  ad: 'Aksesuar',     e: '🎀' }
  };

  /* ---------- parça rafları ---------- */
  const PARCA = {
    esarp: [
      { id: 'giy-esarp-pembe',   ad: 'Pembe eşarp',    dosya: 'giy-esarp-pembe' },
      { id: 'giy-esarp-lila',    ad: 'Lila eşarp',     dosya: 'giy-esarp-lila' },
      { id: 'giy-esarp-mint',    ad: 'Mint eşarp',     dosya: 'giy-esarp-mint' },
      { id: 'giy-esarp-krem',    ad: 'Krem eşarp',     dosya: 'giy-esarp-krem' },
      { id: 'giy-esarp-mavi',    ad: 'Mavi eşarp',     dosya: 'giy-esarp-mavi' },
      { id: 'giy-esarp-bordo',   ad: 'Bordo eşarp',    dosya: 'giy-esarp-bordo' },
      { id: 'giy-esarp-cicekli', ad: 'Çiçekli eşarp',  dosya: 'giy-esarp-cicekli' },
      { id: 'giy-esarp-beyaz',   ad: 'Beyaz eşarp',    dosya: 'giy-esarp-beyaz' }
    ],
    elbise: [
      { id: 'giy-elbise-pembe',    ad: 'Pembe elbise',     dosya: 'giy-elbise-pembe' },
      { id: 'giy-elbise-lila',     ad: 'Lila elbise',      dosya: 'giy-elbise-lila' },
      { id: 'giy-elbise-yesil',    ad: 'Yeşil elbise',     dosya: 'giy-elbise-yesil' },
      { id: 'giy-elbise-krem',     ad: 'Krem elbise',      dosya: 'giy-elbise-krem' },
      { id: 'giy-elbise-lacivert', ad: 'Lacivert elbise',  dosya: 'giy-elbise-lacivert' },
      { id: 'giy-elbise-sari',     ad: 'Sarı elbise',      dosya: 'giy-elbise-sari' },
      { id: 'giy-elbise-cicekli',  ad: 'Çiçekli elbise',   dosya: 'giy-elbise-cicekli' },
      { id: 'giy-elbise-bayram',   ad: 'Bayramlık elbise', dosya: 'giy-elbise-bayram' },
      { id: 'giy-elbise-tunik',    ad: 'Tunik ve etek',    dosya: 'giy-elbise-tunik' },
      { id: 'giy-elbise-rahat',    ad: 'Rahat ev elbisesi',dosya: 'giy-elbise-rahat' }
    ],
    dis: [
      { id: 'giy-dis-yok',      ad: 'Dış giyim istemiyorum', dosya: null },
      { id: 'giy-dis-hirka',    ad: 'Örgü hırka',      dosya: 'giy-dis-hirka' },
      { id: 'giy-dis-ferace',   ad: 'Ferace',          dosya: 'giy-dis-ferace' },
      { id: 'giy-dis-mont',     ad: 'Kışlık mont',     dosya: 'giy-dis-mont' },
      { id: 'giy-dis-yagmurluk',ad: 'Yağmurluk',       dosya: 'giy-dis-yagmurluk' },
      { id: 'giy-dis-yelek',    ad: 'İnce yelek',      dosya: 'giy-dis-yelek' }
    ],
    ayakkabi: [
      { id: 'giy-ayk-pembe',   ad: 'Pembe ayakkabı',  dosya: 'giy-ayk-pembe' },
      { id: 'giy-ayk-beyaz',   ad: 'Beyaz spor ayakkabı', dosya: 'giy-ayk-beyaz' },
      { id: 'giy-ayk-kahve',   ad: 'Kahve bot',       dosya: 'giy-ayk-kahve' },
      { id: 'giy-ayk-mavi',    ad: 'Mavi ayakkabı',   dosya: 'giy-ayk-mavi' },
      { id: 'giy-ayk-sandalet',ad: 'Sandalet',        dosya: 'giy-ayk-sandalet' },
      { id: 'giy-ayk-terlik',  ad: 'Ev terliği',      dosya: 'giy-ayk-terlik' }
    ],
    canta: [
      { id: 'giy-canta-yok',   ad: 'Çanta istemiyorum', dosya: null },
      { id: 'giy-canta-pembe', ad: 'Pembe çanta',     dosya: 'giy-canta-pembe' },
      { id: 'giy-canta-krem',  ad: 'Krem çanta',      dosya: 'giy-canta-krem' },
      { id: 'giy-canta-lila',  ad: 'Lila çanta',      dosya: 'giy-canta-lila' },
      { id: 'giy-canta-sirt',  ad: 'Sırt çantası',    dosya: 'giy-canta-sirt' },
      { id: 'giy-canta-sepet', ad: 'Piknik sepeti',   dosya: 'giy-canta-sepet' }
    ],
    aksesuar: [
      { id: 'giy-aks-yok',    ad: 'Aksesuar istemiyorum', dosya: null },
      { id: 'giy-aks-bros',   ad: 'Broş',            dosya: 'giy-aks-bros' },
      { id: 'giy-aks-sal',    ad: 'İnce şal',        dosya: 'giy-aks-sal' },
      { id: 'giy-aks-kemer',  ad: 'Kemer',           dosya: 'giy-aks-kemer' },
      { id: 'giy-aks-bere',   ad: 'Bere',            dosya: 'giy-aks-bere' }
    ],
    namazlik: [
      { id: 'giy-nmz-beyaz',   ad: 'Beyaz namaz örtüsü',   dosya: 'giy-nmz-beyaz' },
      { id: 'giy-nmz-pembe',   ad: 'Pembe namaz örtüsü',   dosya: 'giy-nmz-pembe' },
      { id: 'giy-nmz-mavi',    ad: 'Mavi namaz örtüsü',    dosya: 'giy-nmz-mavi' },
      { id: 'giy-nmz-cicekli', ad: 'Çiçekli namaz örtüsü', dosya: 'giy-nmz-cicekli' }
    ]
  };

  /* ---------- mekanlar / görevler ---------- */
  const GOREVLER = [
    { id: 'gyd-ev', e: '🏡', mekan: 'mekan-ev', metin: 'Bugün evdeyiz. Rahat bir kombin hazırla!',
      raflar: ['elbise', 'ayakkabi'], gerek: ['elbise', 'ayakkabi'],
      ders: 'Evde rahat kıyafet giymek en iyisidir. Rahat olunca daha çok oynarız.' },

    { id: 'gyd-cami', e: '🕌', mekan: 'mekan-cami', metin: 'Camiye gidiyoruz. Sade ve şık giydirelim!',
      raflar: ['esarp', 'elbise', 'dis', 'ayakkabi'], gerek: ['esarp', 'elbise', 'ayakkabi'],
      ders: 'Camiye giderken temiz, sade ve kapalı giyinmek güzel bir edeptir.' },

    { id: 'gyd-namaz', e: '🧎', mekan: 'mekan-namaz', metin: 'Namaz vakti! Namaz örtüsünü giydirelim.',
      raflar: ['namazlik'], gerek: ['namazlik'],
      ders: 'Namaza dururken temiz ve örtülü olmak, huzurla ibadet etmemizi sağlar.' },

    { id: 'gyd-misafir', e: '🍰', mekan: 'mekan-misafir', metin: 'Misafirliğe gidiyoruz. Çantayı da unutma!',
      raflar: ['esarp', 'elbise', 'ayakkabi', 'canta', 'aksesuar'],
      gerek: ['esarp', 'elbise', 'ayakkabi', 'canta'],
      ders: 'Misafirliğe düzgün giyinmek, ev sahibine gösterdiğimiz saygıdır.' },

    { id: 'gyd-bayram', e: '🎁', mekan: 'mekan-bayram', metin: 'Bayram sabahı! En güzel kombini hazırla.',
      raflar: ['esarp', 'elbise', 'dis', 'ayakkabi', 'canta', 'aksesuar'],
      gerek: ['esarp', 'elbise', 'ayakkabi', 'canta'],
      ders: 'Bayramda en güzel kıyafetimizi giymek, o günü kutlamaktır.' },

    { id: 'gyd-okul', e: '📚', mekan: 'mekan-okul', metin: 'Okula gidiyoruz. Düzenli bir kombin hazırla!',
      raflar: ['esarp', 'elbise', 'ayakkabi', 'canta'],
      gerek: ['esarp', 'elbise', 'ayakkabi', 'canta'],
      ders: 'Okula düzenli gitmek, öğrenmeye hazır olmak demektir.' },

    { id: 'gyd-park', e: '🌳', mekan: 'mekan-park', metin: 'Parka gidiyoruz. Rahat ve hareketli olsun!',
      raflar: ['esarp', 'elbise', 'dis', 'ayakkabi'],
      gerek: ['elbise', 'ayakkabi'],
      ders: 'Oynayacağımız yerlerde rahat kıyafet ve rahat ayakkabı seçeriz.' },

    { id: 'gyd-kis', e: '❄️', mekan: 'mekan-kis', metin: 'Dışarısı buz gibi! Sıcak tutan bir kombin seç.',
      raflar: ['esarp', 'elbise', 'dis', 'ayakkabi', 'aksesuar'],
      gerek: ['esarp', 'elbise', 'dis', 'ayakkabi'],
      ders: 'Soğukta kalın giyinmek bizi hasta olmaktan korur.' },

    { id: 'gyd-yagmur', e: '🌧️', mekan: 'mekan-yagmur', metin: 'Yağmur yağıyor. Islanmayacak bir kombin seç!',
      raflar: ['esarp', 'elbise', 'dis', 'ayakkabi'],
      gerek: ['esarp', 'elbise', 'dis', 'ayakkabi'],
      ders: 'Yağmurda yağmurluk giymek hem bizi kurutur hem hastalanmayı önler.' },

    { id: 'gyd-piknik', e: '🧺', mekan: 'mekan-piknik', metin: 'Pikniğe gidiyoruz! Sepeti de al.',
      raflar: ['esarp', 'elbise', 'ayakkabi', 'canta'],
      gerek: ['elbise', 'ayakkabi', 'canta'],
      ders: 'Doğaya çıkarken rahat giyinmek ve yanımıza gerekli şeyleri almak önemlidir.' },

    { id: 'gyd-dugun', e: '💐', mekan: 'mekan-dugun', metin: 'Düğüne davetliyiz. Çok şık olsun!',
      raflar: ['esarp', 'elbise', 'ayakkabi', 'canta', 'aksesuar'],
      gerek: ['esarp', 'elbise', 'ayakkabi', 'canta', 'aksesuar'],
      ders: 'Özel günlerde güzel giyinmek, davet edeni mutlu eder.' },

    { id: 'gyd-serbest', e: '✨', mekan: 'mekan-serbest', metin: 'Şimdi tamamen serbest! İstediğin kombini yap.',
      raflar: ['esarp', 'elbise', 'dis', 'ayakkabi', 'canta', 'aksesuar'],
      gerek: ['elbise'],
      ders: 'Kendi tarzını bulmak çok güzel. Sen ne seçtiysen o güzel.' }
  ];

  const GORSEL = 'gorseller/';
  const TUR = 6;                      // her oyunda 6 mekan
  let ctx = null, gi = 0, gorevler = [], giyili = {}, acikRaf = 'elbise';
  let karakter = KARAKTER[0];
  let sahneEl = null, katmanEl = {}, surukle = null, hayalet = null;

  function mount(c) {
    ctx = c; gi = 0; giyili = {};
    karakterSec();
  }

  /* ---------- 1. adım: arkadaşını seç ---------- */
  function karakterSec() {
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="gorev-serit"><span class="gorev-e">👗</span>
          <span class="gorev-t">Kimi giydirelim? Arkadaşını seç!</span></div>
      </div>`;
    ctx.setProgress(0, TUR);
    ctx.duck(2600);
    ctx.say({ id: 'sys-giy-kimi', text: 'Kimi giydirelim? Arkadaşını seç!' });

    ctx.options.className = 'options-area kr-secim';
    ctx.options.style.gridTemplateColumns = `repeat(${innerHeight > innerWidth ? 2 : 5},1fr)`;
    ctx.options.innerHTML = '';
    KARAKTER.forEach(k => {
      const b = document.createElement('button');
      b.className = 'kr-kart';
      b.innerHTML =
        `<img class="kr-img" src="${GORSEL}${k.dosya}.webp" alt="" draggable="false"
           onerror="this.replaceWith(Object.assign(document.createElement('span'),
             {className:'kr-img yedek-e',textContent:'${k.e}'}))">` +
        `<span class="kr-ad">${k.ad}</span>`;
      b.addEventListener('click', () => {
        karakter = k;
        Snd.sfx.tap(); Snd.duck(1400);
        Snd.say({ id: k.id, text: k.ad });
        gorevler = U.shuffle(GOREVLER).slice(0, TUR);
        setTimeout(kur, 900);
      });
      ctx.options.appendChild(b);
    });
  }

  /* --- görsel ya da emoji --- */
  function parcaGorsel(anahtar, p, sinif) {
    const k = KATMAN[anahtar];
    if (!p.dosya) return `<span class="${sinif} yedek-e">✖</span>`;
    return `<img class="${sinif}" src="${GORSEL}${p.dosya}.webp" alt="" draggable="false"
              onerror="this.replaceWith(Object.assign(document.createElement('span'),
                {className:'${sinif} yedek-e',textContent:'${k.e}'}))">`;
  }

  function kur() {
    const g = gorevler[gi];
    giyili = {};
    acikRaf = g.raflar[0];
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="gorev-serit"><span class="gorev-e">${g.e}</span>
          <span class="gorev-t">${g.metin}</span></div>
      </div>`;
    ctx.setProgress(gi, TUR);
    ctx.duck(3200);
    ctx.say({ id: g.id, text: g.metin });

    ctx.options.className = 'options-area giydirme';
    ctx.options.style.gridTemplateColumns = '';
    ctx.options.innerHTML = `
      <div class="giy-sahne" id="giySahne">
        <img class="giy-mekan" src="${GORSEL}${g.mekan}.webp" alt=""
             onerror="this.remove()">
        <img class="giy-taban" src="${GORSEL}${karakter.dosya}.webp" alt="" draggable="false"
             onerror="this.replaceWith(Object.assign(document.createElement('span'),
               {className:'giy-taban yedek-e',textContent:'🧍‍♀️'}))">
        <div class="giy-katmanlar" id="giyKatman"></div>
        <div class="giy-hedef" id="giyHedef"></div>
      </div>
      <div class="giy-panel">
        <div class="raf-sekme" id="rafSekme"></div>
        <div class="raf-parcalar" id="rafParca"></div>
        <div class="giy-ipucu" id="giyIpucu">Parçayı tut, ${karakter.ad}'ın üstüne bırak</div>
        <button class="pill-btn green giy-hazir" id="giyHazir">✅ Hazır!</button>
      </div>`;
    sahneEl = ctx.options.querySelector('#giySahne');
    katmanEl = {};
    sekmeCiz(); rafCiz(); hedefCiz();
    ctx.options.querySelector('#giyHazir').addEventListener('click', hazir);
  }

  function hedefCiz() {
    const g = gorevler[gi];
    const el = ctx.options.querySelector('#giyHedef');
    el.innerHTML = g.raflar.map(a => {
      const k = KATMAN[a];
      return `<div class="hedef-kutu" data-a="${a}"
               style="top:${k.bolge[0]}%;height:${k.bolge[1] - k.bolge[0]}%"></div>`;
    }).join('');
  }

  function sekmeCiz() {
    const g = gorevler[gi];
    const el = ctx.options.querySelector('#rafSekme');
    el.style.gridTemplateColumns = `repeat(${g.raflar.length},1fr)`;
    el.innerHTML = '';
    g.raflar.forEach(a => {
      const k = KATMAN[a];
      const b = document.createElement('button');
      b.className = 'raf-btn' + (a === acikRaf ? ' acik' : '') + (giyili[a] ? ' giyildi' : '');
      b.innerHTML = `<span class="raf-e">${k.e}</span><span class="raf-ad">${k.ad}</span>` +
                    (giyili[a] ? '<span class="raf-tik">✓</span>' : '');
      b.addEventListener('click', () => {
        acikRaf = a; Snd.sfx.tap();
        Snd.duck(1200); Snd.say({ id: 'giy-raf-' + a, text: k.ad });
        sekmeCiz(); rafCiz();
      });
      el.appendChild(b);
    });
  }

  function rafCiz() {
    const el = ctx.options.querySelector('#rafParca');
    el.innerHTML = '';
    (PARCA[acikRaf] || []).forEach(p => {
      const b = document.createElement('div');
      b.className = 'parca' + (giyili[acikRaf] === p.id ? ' secili' : '');
      b.innerHTML = parcaGorsel(acikRaf, p, 'parca-img');
      b.dataset.id = p.id;
      tutmaBagla(b, p, acikRaf);
      el.appendChild(b);
    });
  }

  /* ---------- sürükle & bırak ---------- */
  function tutmaBagla(el, p, anahtar) {
    el.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      try { el.setPointerCapture(ev.pointerId); } catch (e) {}
      surukle = { p, anahtar, x: ev.clientX, y: ev.clientY, tasidi: false, el };
      Snd.duck(1500);
      Snd.say({ id: p.id, text: p.ad });
      el.classList.add('tutuluyor');
    });
    el.addEventListener('pointermove', ev => {
      if (!surukle || surukle.el !== el) return;
      const dx = ev.clientX - surukle.x, dy = ev.clientY - surukle.y;
      if (!surukle.tasidi && Math.hypot(dx, dy) < 10) return;
      if (!surukle.tasidi) { surukle.tasidi = true; hayaletYap(p, anahtar); }
      hayaletTasi(ev.clientX, ev.clientY);
      hedefVurgula(ev.clientX, ev.clientY);
    });
    ['pointerup', 'pointercancel'].forEach(t => el.addEventListener(t, ev => {
      if (!surukle || surukle.el !== el) return;
      el.classList.remove('tutuluyor');
      if (surukle.tasidi) birak(ev.clientX, ev.clientY);
      else giydir(anahtar, p);
      hayaletSil(); surukle = null;
      [...ctx.options.querySelectorAll('.hedef-kutu')].forEach(h => h.classList.remove('aktif'));
    }));
  }

  function hayaletYap(p, anahtar) {
    hayaletSil();
    hayalet = document.createElement('div');
    hayalet.className = 'giy-hayalet';
    hayalet.innerHTML = parcaGorsel(anahtar, p, 'hayalet-img');
    document.body.appendChild(hayalet);
  }
  function hayaletTasi(x, y) { if (hayalet) { hayalet.style.left = x + 'px'; hayalet.style.top = y + 'px'; } }
  function hayaletSil() { if (hayalet) { hayalet.remove(); hayalet = null; } }

  function hedefAlti(x, y) {
    if (!sahneEl) return null;
    const r = sahneEl.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return null;
    const oran = (y - r.top) / r.height * 100;
    const g = gorevler[gi];
    return g.raflar.find(a => {
      const [b1, b2] = KATMAN[a].bolge;
      return oran >= b1 && oran <= b2;
    }) || null;
  }

  function hedefVurgula(x, y) {
    const a = surukle && surukle.anahtar;
    const ust = hedefAlti(x, y);
    [...ctx.options.querySelectorAll('.hedef-kutu')].forEach(h =>
      h.classList.toggle('aktif', h.dataset.a === a && ust === a));
  }

  function birak(x, y) {
    const { p, anahtar } = surukle;
    const r = sahneEl.getBoundingClientRect();
    const icinde = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    if (!icinde) { Snd.sfx.whoosh(); return; }

    // bölgeler çakışabiliyor; taşınan parçanın kendi bölgesi içindeyse kabul
    const oran = (y - r.top) / r.height * 100;
    const [b1, b2] = KATMAN[anahtar].bolge;
    if (oran >= b1 && oran <= b2) { giydir(anahtar, p); return; }

    Snd.sfx.wrong(); ctx.oops(); Snd.duck(2400);
    const yer = { esarp: 'başına', elbise: 'üstüne', dis: 'üstüne', ayakkabi: 'ayağına',
                  canta: 'eline', aksesuar: 'üstüne', namazlik: 'başından aşağı' }[anahtar];
    Snd.say({ id: 'giy-yanlis-' + anahtar, text: `${KATMAN[anahtar].ad} ${yer} gider. Bir daha dene!` });
    const ip = ctx.options.querySelector('#giyIpucu');
    if (ip) {
      ip.textContent = `${KATMAN[anahtar].ad} ${yer} gider 👆`;
      ip.classList.add('uyari');
      setTimeout(() => {
        ip.textContent = `Parçayı tut, ${karakter.ad}'ın üstüne bırak`;
        ip.classList.remove('uyari');
      }, 2600);
    }
    const hk = ctx.options.querySelector(`.hedef-kutu[data-a="${anahtar}"]`);
    if (hk) { hk.classList.add('goster'); setTimeout(() => hk.classList.remove('goster'), 2200); }
  }

  function giydir(anahtar, p) {
    giyili[anahtar] = p.id;
    const kap = ctx.options.querySelector('#giyKatman');
    const k = KATMAN[anahtar];
    let el = katmanEl[anahtar];
    if (!el) {
      el = document.createElement('div');
      el.className = 'giy-katman k-' + anahtar;
      el.style.cssText = `top:${k.top}%;left:${k.left}%;width:${k.w}%;z-index:${k.z}`;
      kap.appendChild(el);
      katmanEl[anahtar] = el;
    }
    el.innerHTML = p.dosya ? parcaGorsel(anahtar, p, 'katman-img') : '';
    el.classList.remove('giydi'); void el.offsetWidth; el.classList.add('giydi');

    Snd.sfx.correct();
    const r = el.getBoundingClientRect();
    FX.confetti(24, r.left + r.width / 2, r.top + r.height / 2);
    sekmeCiz(); rafCiz();

    const g = gorevler[gi];
    const tamam = g.gerek.every(a => giyili[a]);
    const hz = ctx.options.querySelector('#giyHazir');
    if (hz) hz.classList.toggle('parla', tamam);
  }

  function hazir() {
    const g = gorevler[gi];
    const eksik = g.gerek.filter(a => !giyili[a]);
    if (eksik.length) {
      Snd.sfx.wrong(); ctx.oops(); Snd.duck(2400);
      const ad = KATMAN[eksik[0]].ad;
      Snd.say({ id: 'giy-eksik-' + eksik[0], text: `${ad} eksik. Onu da giydirelim!` });
      acikRaf = eksik[0]; sekmeCiz(); rafCiz();
      const hk = ctx.options.querySelector(`.hedef-kutu[data-a="${eksik[0]}"]`);
      if (hk) { hk.classList.add('goster'); setTimeout(() => hk.classList.remove('goster'), 2400); }
      return;
    }

    Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
    const r = sahneEl.getBoundingClientRect();
    FX.confetti(100, r.left + r.width / 2, r.top + r.height / 3);
    ctx.duck(5400);
    ctx.say({ id: g.id + '-ders', text: g.ders }, { delay: 700 });

    const kutu = document.createElement('div');
    kutu.className = 'aciklama-balon gorun';
    kutu.textContent = g.ders;
    ctx.prompt.appendChild(kutu);
    sahneEl.classList.add('kutlama');

    gi++;
    ctx.setProgress(gi, TUR);
    setTimeout(() => {
      if (gi >= TUR) {
        ctx.options.className = 'options-area';
        ctx.finish(3, `${karakter.ad} için ${TUR} kombin hazırladın!`);
      } else { Snd.sfx.star(); kur(); }
    }, Math.min(2400 + g.ders.length * 82, 7500));
  }

  return {
    id: 'giydirme', title: 'Moda<br>Atölyesi', emoji: '🧕', mode: 'custom',
    intro: { id: 'sys-oyun-giydirme', text: 'Arkadaşlarımızı giydirelim!' },
    mount
  };
})();
