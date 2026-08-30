/* ===== Tesettür Moda Atölyesi — sürükle & bırak giydirme =====
   5 karakter, 12 mekan, 6 raf dolusu kıyafet.
   Alya önce arkadaşını seçiyor, sonra "bugün nereye gidiyoruz"
   sorusuna göre onu giydiriyor. Parçayı parmağıyla tutup
   karakterin üstüne bırakıyor; yanlış yere bırakırsa nazikçe
   yönlendiriliyor. Okuma hiçbir yerde gerekmiyor.

   Görseller gorseller/ klasöründen katman katman geliyor;
   görsel yoksa emoji yedeğe düşüyor, oyun yine oynanıyor.     */
window.GameGiydirme = (function () {

  /* ---------- karakterler ----------
     NOT: Lina ve Sare görselleri soluk/beyaz saçlı üretilmiş; çocuk
     karakteri gibi durmuyorlar. Yeni görseller gelene kadar listede
     yoklar (aktif:false). Görsel yenilenince aktif:true yapmak yeter. */
  const KARAKTER_TUM = [
    { id: 'kr-mina',   ad: 'Mina',   dosya: 'giy-kr-mina',   e: '👧', aktif: true },
    { id: 'kr-lina',   ad: 'Lina',   dosya: 'giy-kr-lina',   e: '👧', aktif: false },
    { id: 'kr-zeynep', ad: 'Zeynep', dosya: 'giy-kr-zeynep', e: '👧', aktif: true },
    { id: 'kr-elif',   ad: 'Elif',   dosya: 'giy-kr-elif',   e: '👧', aktif: true },
    { id: 'kr-sare',   ad: 'Sare',   dosya: 'giy-kr-sare',   e: '👧', aktif: false }
  ];
  const KARAKTER = KARAKTER_TUM.filter(k => k.aktif);

  /* ---------- katman yerleşimi ----------
     Ölçüler KARAKTERİN kendi kutusuna göredir (sahneye göre değil).
     Karakter çiziminin anatomisi ölçülerek bulundu (507x760 üzerinde):
       baş üstü %2 · başın en geniş yeri %20 · BOYUN %29
       omuz %32 · bel %70 · bilek %93 · ayak altı %98

     tam:true  -> görsel karakterle birebir aynı çerçeveye çizilmiş
                  (eşarp ve namazlık böyle); olduğu gibi bindirilir.
     tam:false -> görsel ürün fotoğrafı; içeriğine kırpıldı ve
                  aşağıdaki anatomik banda oturtulur.
     top/h  = karakter kutusunun yüzdesi, w = karakter kutusu genişliğinin
     yüzdesi. Genişlik verilirse yükseklik orandan hesaplanır.          */
  const KATMAN = {
    /* Namaz örtüsü ve eşarp karakterle aynı çerçevede çizildi; yüz açıklıkları
       karakterin gerçek yüz hizasına göre yeniden çizildi (v13), bu yüzden
       artık hiçbir dosyaya dikey düzeltme gerekmiyor.                 */
    namazlik: { tam: true, dy: 0, z: 8, bolge: [0, 96], ad: 'Namaz örtüsü', e: '🧎' },
    esarp:    { tam: true, dy: 0, z: 6, bolge: [0, 32], ad: 'Eşarp',        e: '🧕' },
    /* Boyundan (%29) ayak bileğine (%95) — yüzü asla kapatmaz */
    elbise:   { top: 28, left: 50, h: 67, z: 2, bolge: [32, 72], ad: 'Elbise',    e: '👗' },
    /* Hırka/mont: omuzdan diz üstüne */
    dis:      { top: 29, left: 50, h: 56, z: 5, bolge: [32, 72], ad: 'Dış giyim', e: '🧥' },
    /* Ayakkabı ELBİSENİN ÜSTÜNDE (z:3): uzun etekli elbiselerde ayakkabının
       neredeyse tamamı eteğin arkasında kalıyordu; çocuk seçtiği ayakkabıyı
       göremiyordu. Artık etek ucunun önünde, tam görünür duruyor.     */
    ayakkabi: { top: 86, left: 50, h: 13, z: 3, bolge: [86, 100], ad: 'Ayakkabı', e: '👟' },
    /* Çanta: elin hizasında, kalçada sarkar (havada uçmaz) */
    canta:    { top: 50, left: 68, h: 18, z: 7, bolge: [40, 80],  ad: 'Çanta',    e: '👜' },
    aksesuar: { top: 30, left: 50, h: 14, z: 9, bolge: [22, 60],  ad: 'Aksesuar', e: '🎀' }
  };

  /* Her eşarbın yüz deliği farklı yükseklikte çizilmiş (AI üretimi).
     Deliğin ÜST kenarı ölçüldü; hepsi pembe eşarbın hizasına (%10)
     çekiliyor ki kumaş kenarı hiçbirinde GÖZLERE inmesin.           */
  const ESARP_DY = {};   /* eşarplar tek geometride yeniden çizildi; düzeltme gerekmiyor */

  /* Aksesuarlar birbirinden çok farklı: bere başa, kemer bele,
     broş göğse, şal omuza gider. Her biri kendi yerine otursun.
     z verilirse katmanın varsayılan z'sini ezer (kemer elbisenin
     üstünde ama eşarbın/dış giyimin ALTINDA durmalı).              */
  const AKSESUAR_YERI = {
    'giy-aks-bere':  { top: -9, left: 50, w: 27 },           /* baş üstü */
    'giy-aks-kemer': { top: 53, left: 50, w: 22, z: 4 },   /* bel — eşarp eteğinin altında kalmasın */
    'giy-aks-sal':   { top: 41, left: 50, w: 44 },           /* omuz     */
    'giy-aks-bros':  { top: 36, left: 60, w: 13 }            /* göğüs    */
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
  let sahneEl = null, katmanEl = {}, surukle = null, hayalet = null, gecis = false;

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
    /* Eşarplar tam kare üzerinde çizili (sahnedeki yerinde duruyorlar); rafta
       ve uçuşta karenin sadece üst yarısını doldurup küçük görünüyorlardı. */
    const kirp = anahtar === 'esarp' ? ' esarp-kirp' : '';
    return `<img class="${sinif}${kirp}" src="${GORSEL}${p.dosya}.webp" alt="" draggable="false"
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
        <div class="giy-ipucu" id="giyIpucu">Parçaya dokun, ${karakter.ad} hemen giyinsin ✨</div>
        <button class="pill-btn green giy-hazir" id="giyHazir">✅ Hazır!</button>
      </div>`;
    sahneEl = ctx.options.querySelector('#giySahne');
    katmanEl = {};
    sekmeCiz(); rafCiz(); hedefCiz();
    ctx.options.querySelector('#giyHazir').addEventListener('click', hazir);
    katmanKutusuHizala();
    requestAnimationFrame(katmanKutusuHizala);
  }

  /* ---------- katman kutusunu karaktere oturt ----------
     Kıyafet katmanlarının top/height değerleri karakter çiziminin
     kendisine göre ölçüldü (507x760). Ama kutu sahnenin TAMAMINI
     kaplıyordu; sahne genişleyip karakter küçülünce kıyafet yukarı
     kayıp YÜZÜ KAPATIYORDU. Artık kutu, karakterin ekranda gerçekten
     kapladığı dikdörtgene birebir oturuyor.                          */
  const KR_EN = 507, KR_BOY = 760;   /* karakter çiziminin ölçüsü */

  function katmanKutusuHizala() {
    if (!sahneEl || !ctx) return;
    const kap = ctx.options.querySelector('#giyKatman');
    const hedef = ctx.options.querySelector('#giyHedef');
    if (!kap) return;
    const s = sahneEl.getBoundingClientRect();
    if (!s.height) return;
    /* .giy-taban kuralı: height:94%, width:auto, max-width:90% */
    let boy = s.height * 0.94;
    let en = boy * (KR_EN / KR_BOY);
    const enSinir = s.width * 0.90;
    if (en > enSinir) { en = enSinir; boy = en * (KR_BOY / KR_EN); }
    const ust = s.height * 0.03;
    const sol = (s.width - en) / 2;
    [kap, hedef].forEach(el => {
      if (!el) return;
      el.style.left = sol + 'px';
      el.style.top = ust + 'px';
      el.style.width = en + 'px';
      el.style.height = boy + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    });
  }

  /* Ekran döndüğünde / boyut değişince yeniden hizala */
  let hizaZaman = null;
  window.addEventListener('resize', () => {
    clearTimeout(hizaZaman);
    hizaZaman = setTimeout(katmanKutusuHizala, 120);
  });

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
      b.dataset.a = a;
      b.setAttribute('aria-label', k.ad);
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
    kaydirmaIsareti(el);
  }

  /* Raf taşıyorsa panelde aşağı doğru yumuşak bir soluklaşma + ok belirir;
     yarım kalan satır "bozuk" değil "devamı var" diye okunur. */
  function kaydirmaIsareti(el) {
    const panel = el.closest('.giy-panel');
    if (!panel) return;
    const guncelle = () => {
      if (!el.isConnected) return;
      const yatay = el.scrollWidth - el.clientWidth > 6;
      if (yatay) {
        const sonda = el.scrollLeft + el.clientWidth >= el.scrollWidth - 6;
        panel.classList.toggle('kaydirilir-x', !sonda);
        panel.classList.remove('kaydirilir');
      } else {
        const tasiyor = el.scrollHeight - el.clientHeight > 6;
        const sonda = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;
        panel.classList.toggle('kaydirilir', tasiyor && !sonda);
        panel.classList.remove('kaydirilir-x');
      }
    };
    requestAnimationFrame(guncelle);
    setTimeout(guncelle, 260);
    el.onscroll = guncelle;
  }

  /* ---------- seçim: dokun (asıl yol) + fare ile sürükle (isteğe bağlı) ----------
     4 yaşındaki bir çocuk için sürükleme zor; üstelik dokunmatikte sürükleme
     dinleyicisi rafın kendi kaydırmasını yutuyordu ve alttaki parçalara hiç
     ulaşılamıyordu. Artık: TEK DOKUNUŞ = giydir. Parça karakterin üstüne
     uçarak gider. Sürükleme yalnız fare ile çalışır, parmakla asla. */
  function tutmaBagla(el, p, anahtar) {
    el.addEventListener('pointerdown', ev => {
      const fare = ev.pointerType === 'mouse';
      surukle = { p, anahtar, x: ev.clientX, y: ev.clientY, tasidi: false, el, fare };
      Snd.duck(1500);
      Snd.say({ id: p.id, text: p.ad });
      if (fare) { try { el.setPointerCapture(ev.pointerId); } catch (e) {} }
      el.classList.add('tutuluyor');
    });
    el.addEventListener('pointermove', ev => {
      if (!surukle || surukle.el !== el) return;
      const dx = ev.clientX - surukle.x, dy = ev.clientY - surukle.y;
      if (!surukle.fare) {
        /* parmak: 12px'ten fazla kaydıysa bu bir kaydırma hareketidir,
           seçimi iptal et ve rafın kaymasına izin ver. */
        if (Math.hypot(dx, dy) > 12) { el.classList.remove('tutuluyor'); surukle = null; }
        return;
      }
      if (!surukle.tasidi && Math.hypot(dx, dy) < 10) return;
      if (!surukle.tasidi) { surukle.tasidi = true; hayaletYap(p, anahtar); }
      hayaletTasi(ev.clientX, ev.clientY);
      hedefVurgula(ev.clientX, ev.clientY);
    });
    ['pointerup', 'pointercancel'].forEach(t => el.addEventListener(t, ev => {
      if (!surukle || surukle.el !== el) return;
      el.classList.remove('tutuluyor');
      if (surukle.tasidi) birak(ev.clientX, ev.clientY);
      else if (ev.type === 'pointerup') ucurVeGiydir(el, p, anahtar);
      hayaletSil(); surukle = null;
      [...ctx.options.querySelectorAll('.hedef-kutu')].forEach(h => h.classList.remove('aktif'));
    }));
  }

  /* Dokunulan parça, karakterin üstündeki doğru bölgeye uçar; sonra giydirilir.
     Sürüklemenin verdiği "ben taşıdım" hissi korunur, zorluğu kalmaz. */
  function ucurVeGiydir(el, p, anahtar) {
    if (!sahneEl) { giydir(anahtar, p); return; }
    const r = el.getBoundingClientRect();
    const sr = sahneEl.getBoundingClientRect();
    const [b1, b2] = KATMAN[anahtar].bolge;
    const hx = sr.left + sr.width * 0.5;
    const hy = sr.top + sr.height * ((b1 + b2) / 2) / 100;

    const u = document.createElement('div');
    u.className = 'giy-ucus';
    u.innerHTML = parcaGorsel(anahtar, p, 'ucus-img');
    u.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
    document.body.appendChild(u);
    const hk = ctx.options.querySelector(`.hedef-kutu[data-a="${anahtar}"]`);
    if (hk) hk.classList.add('aktif');
    requestAnimationFrame(() => {
      u.style.transform = `translate(${hx - (r.left + r.width / 2)}px,${hy - (r.top + r.height / 2)}px) scale(1.5)`;
      u.style.opacity = '.2';
    });
    setTimeout(() => {
      u.remove();
      if (hk) hk.classList.remove('aktif');
      giydir(anahtar, p);
    }, 300);
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

    /* 4 yaşındaki bir çocuk parçayı milimetrik yere bırakamaz.
       Sahnenin HERHANGİ bir yerine bıraktıysa kıyafet giydirilir ve
       zaten doğru yerine (boynuna, ayağına) kendisi oturur. Ceza yok. */
    if (icinde) {
      giydir(anahtar, p);
      const yer = { esarp: 'başına', elbise: 'üstüne', dis: 'üstüne', ayakkabi: 'ayağına',
                    canta: 'koluna', aksesuar: 'üstüne', namazlik: 'başından aşağı' }[anahtar];
      const ip = ctx.options.querySelector('#giyIpucu');
      if (ip) {
        ip.textContent = `${KATMAN[anahtar].ad} ${yer} gitti ✨`;
        setTimeout(() => {
          if (ip.isConnected) ip.textContent = `Parçaya dokun, ${karakter.ad} hemen giyinsin ✨`;
        }, 1800);
      }
      return;
    }

    /* Sahnenin tamamen dışına bırakıldı: sessizce geri döner. */
    Snd.sfx.whoosh();
    const hk = ctx.options.querySelector(`.hedef-kutu[data-a="${anahtar}"]`);
    if (hk) { hk.classList.add('goster'); setTimeout(() => hk.classList.remove('goster'), 1800); }
  }

  /* ---------- katman uyumu ----------
     Eşarp/namazlık khimar tarzı: gövdeyi de örtüyor. Örtü giyiliyken
     1) elbise ve dış giyimin YAKASI yüz deliğinden sızıp karmaşa
        yaratıyordu -> üstten kliplenir, delikte yalnız yüz kalır;
        etekleri örtünün altından yine görünür.
     2) çanta örtünün ortasına yapışıyordu -> ele, kenara kayar.
     Örtü çıkarsa her şey normal yerine döner. (PIL'de A/B/C varyant
     karşılaştırmasıyla seçildi.)                                    */
  function katmanUyumu() {
    /* Eşarplar artık referanstaki gibi: başı ve omuzları sarar,
       gövdeyi ÖRTMEZ (görseller omuz hizasında yumuşak uçla bitecek
       şekilde dönüştürüldü) — elbise, kemer, çanta hep görünür.
       Tam boy olan tek örtü NAMAZ ÖRTÜSÜ; uyum kuralları ona özel. */
    const ortulu = !!giyili.namazlik;
    [['elbise', 30], ['dis', 34]].forEach(([a, k]) => {
      const img = katmanEl[a] && katmanEl[a].querySelector('.katman-img');
      if (img) img.style.clipPath = ortulu ? `inset(${k}% 0 0 0)` : '';
    });
    const c = katmanEl.canta;
    if (c && giyili.canta && giyili.canta !== 'giy-canta-yok') {
      c.style.left = (ortulu ? 75 : KATMAN.canta.left) + '%';
      c.style.top = (ortulu ? 57 : KATMAN.canta.top) + '%';
      c.style.height = (ortulu ? 15 : KATMAN.canta.h) + '%';
    }
    /* Namaz örtüsü üstüne kemer takılmaz */
    const aks = katmanEl.aksesuar;
    if (aks) aks.style.display = (ortulu && giyili.aksesuar === 'giy-aks-kemer') ? 'none' : '';
  }

  /* Bir parçanın karakter üstündeki yerleşim kuralını üretir. */
  function yerlesim(anahtar, p) {
    const k = KATMAN[anahtar];
    if (k.tam) {
      /* Karakterle birebir çerçeve. dy: katmanın genel kaydırması
         (namaz örtüsü +6) + parçaya özel eşarp düzeltmesi.          */
      const dy = (k.dy || 0) + ((p && ESARP_DY[p.dosya]) || 0);
      const kaydir = dy ? `transform:translateY(${dy}%);` : '';
      return `inset:0;${kaydir}z-index:${k.z}`;
    }
    const ozel = (anahtar === 'aksesuar' && p && AKSESUAR_YERI[p.dosya]) || null;
    const y = ozel || k;
    const boyut = y.w != null ? `width:${y.w}%;height:auto` : `height:${y.h}%;width:auto`;
    const z = y.z != null ? y.z : k.z;
    return `top:${y.top}%;left:${y.left}%;${boyut};z-index:${z}`;
  }

  function giydir(anahtar, p) {
    giyili[anahtar] = p.id;
    const kap = ctx.options.querySelector('#giyKatman');
    const k = KATMAN[anahtar];
    let el = katmanEl[anahtar];
    if (!el) {
      el = document.createElement('div');
      el.className = 'giy-katman k-' + anahtar;
      kap.appendChild(el);
      katmanEl[anahtar] = el;
    }
    /* Yerleşim her parçada yeniden hesaplanır — bere ile kemer aynı
       rafta ama bambaşka yerlere gider. */
    el.style.cssText = yerlesim(anahtar, p);
    el.innerHTML = p.dosya ? parcaGorsel(anahtar, p, 'katman-img') : '';
    el.classList.remove('giydi'); void el.offsetWidth; el.classList.add('giydi');
    katmanUyumu();

    Snd.sfx.correct();
    const r = el.getBoundingClientRect();
    FX.confetti(24, r.left + r.width / 2, r.top + r.height / 2);
    sekmeCiz(); rafCiz();

    /* Sago Mini mekaniği: karakter yeni kıyafetine SEVİNİR.
       Küçük bir zıplama + parça adını söyleme — çocuk yaptığının
       karşılığını anında görür ve duyar.                          */
    const taban = ctx.options.querySelector('.giy-taban');
    if (taban) {
      taban.classList.remove('sevinc'); void taban.offsetWidth;
      taban.classList.add('sevinc');
    }
    /* Kayıtlı övgü kliplerinden biri: 'Çok güzel!', 'Harikasın!'…
       (parçanın adı zaten tutarken okunuyor; burada sevinç sesi) */
    if (p.dosya) {
      const ovgu = 1 + Math.floor(Math.random() * 7);
      Snd.say({ id: 'ovgu-' + ovgu, text: ['', 'Aferin Alya!', 'Harikasın!', 'Çok güzel!', 'Bravo!', 'Süpersin Alya!', 'Mükemmel!', 'Çok iyi!'][ovgu] });
    }

    const g = gorevler[gi];
    const tamam = g.gerek.every(a => giyili[a]);
    const hz = ctx.options.querySelector('#giyHazir');
    if (hz) hz.classList.toggle('parla', tamam);
    if (tamam) {
      /* Kombin tamam: karakter büyük sevinç, Hazır düğmesi göz kırpar */
      ctx.happy();
      if (taban) {
        setTimeout(() => {
          taban.classList.remove('sevinc'); void taban.offsetWidth;
          taban.classList.add('sevinc');
        }, 500);
      }
    }
  }

  function hazir() {
    /* Çocuk heyecanla iki kez basarsa görev atlanmasın, ders balonu takılı
       kalmasın: geçiş bitene kadar düğme etkisiz. */
    if (gecis) return;
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

    gecis = true;
    gi++;
    ctx.setProgress(gi, TUR);
    setTimeout(() => {
      gecis = false;
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
