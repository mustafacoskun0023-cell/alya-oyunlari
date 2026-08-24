/* ===== Tesettür Moda Atölyesi — sürükle & bırak giydirme =====
   Alya parçayı parmağıyla tutup Mina'nın üstüne götürüyor ve bırakıyor.
   Doğru bölgeye bırakırsa giydiriyor, yanlış bölgeye bırakırsa Mina
   nazikçe "eşarp başa gider" diyor. Dokunup bırakmak da çalışıyor
   (sürükleyemeyen küçük parmaklar için).

   Görseller gorseller/ klasöründen katman katman geliyor; görsel
   yoksa emoji yedeğe düşüyor, oyun yine oynanıyor.                */
window.GameGiydirme = (function () {

  /* Katmanların sahne üzerindeki yeri — yüzde, sahne kutusuna göre.
     Görseller değişirse tek yerden ayarlanır.                      */
  const KATMAN = {
    esarp:    { top: 1,  left: 50, w: 47, z: 4, bolge: [0, 42],   ad: 'Eşarp',    e: '🧕' },
    elbise:   { top: 24, left: 50, w: 66, z: 2, bolge: [24, 88],  ad: 'Elbise',   e: '👗' },
    ayakkabi: { top: 84, left: 50, w: 48, z: 3, bolge: [78, 100], ad: 'Ayakkabı', e: '👟' },
    canta:    { top: 50, left: 82, w: 24, z: 5, bolge: [34, 78],  ad: 'Çanta',    e: '👜' }
  };
  const SIRA = ['esarp', 'elbise', 'ayakkabi', 'canta'];

  const PARCA = {
    esarp: [
      { id: 'giy-esarp-pembe',  ad: 'Pembe eşarp',    dosya: 'giy-esarp-pembe',  renk: '#F7A8C4' },
      { id: 'giy-esarp-lila',   ad: 'Lila eşarp',     dosya: 'giy-esarp-lila',   renk: '#C9AEE8' },
      { id: 'giy-esarp-mint',   ad: 'Mint eşarp',     dosya: 'giy-esarp-mint',   renk: '#A8DCC8' },
      { id: 'giy-esarp-krem',   ad: 'Krem eşarp',     dosya: 'giy-esarp-krem',   renk: '#EBDCC2' },
      { id: 'giy-esarp-mavi',   ad: 'Mavi eşarp',     dosya: 'giy-esarp-mavi',   renk: '#A9C8E8' },
      { id: 'giy-esarp-bordo',  ad: 'Bordo eşarp',    dosya: 'giy-esarp-bordo',  renk: '#B36B7E' }
    ],
    elbise: [
      { id: 'giy-elbise-pembe', ad: 'Pembe elbise',   dosya: 'giy-elbise-pembe', renk: '#F2A2BE' },
      { id: 'giy-elbise-lila',  ad: 'Lila elbise',    dosya: 'giy-elbise-lila',  renk: '#BFA4E0' },
      { id: 'giy-elbise-yesil', ad: 'Yeşil elbise',   dosya: 'giy-elbise-yesil', renk: '#9FD3B8' },
      { id: 'giy-elbise-krem',  ad: 'Krem elbise',    dosya: 'giy-elbise-krem',  renk: '#E8D8BC' },
      { id: 'giy-elbise-lacivert', ad: 'Lacivert elbise', dosya: 'giy-elbise-lacivert', renk: '#5C6B96' },
      { id: 'giy-elbise-sari',  ad: 'Sarı elbise',    dosya: 'giy-elbise-sari',  renk: '#F0D188' }
    ],
    ayakkabi: [
      { id: 'giy-ayk-pembe',    ad: 'Pembe ayakkabı', dosya: 'giy-ayk-pembe',    renk: '#F2A2BE' },
      { id: 'giy-ayk-beyaz',    ad: 'Beyaz ayakkabı', dosya: 'giy-ayk-beyaz',    renk: '#F4F1EC' },
      { id: 'giy-ayk-kahve',    ad: 'Kahve bot',      dosya: 'giy-ayk-kahve',    renk: '#A87C58' },
      { id: 'giy-ayk-mavi',     ad: 'Mavi ayakkabı',  dosya: 'giy-ayk-mavi',     renk: '#8FB4DC' }
    ],
    canta: [
      { id: 'giy-canta-pembe',  ad: 'Pembe çanta',    dosya: 'giy-canta-pembe',  renk: '#F2A2BE' },
      { id: 'giy-canta-krem',   ad: 'Krem çanta',     dosya: 'giy-canta-krem',   renk: '#E5D3B3' },
      { id: 'giy-canta-lila',   ad: 'Lila çanta',     dosya: 'giy-canta-lila',   renk: '#C4A8E4' },
      { id: 'giy-canta-yok',    ad: 'Çanta istemiyorum', dosya: null,            renk: null }
    ]
  };

  const GOREVLER = [
    { id: 'gyd-cami',   e: '🕌', metin: 'Camiye gidiyoruz. Mina’yı sade ve şık giydirelim!',
      gerek: ['esarp', 'elbise', 'ayakkabi'],
      ders: 'Camiye giderken temiz, sade ve kapalı giyinmek güzel bir edeptir.' },
    { id: 'gyd-bayram', e: '🎁', metin: 'Bayram sabahı! En güzel kombini hazırla.',
      gerek: ['esarp', 'elbise', 'ayakkabi', 'canta'],
      ders: 'Bayramda en güzel kıyafetimizi giymek, o günü kutlamaktır.' },
    { id: 'gyd-park',   e: '🌳', metin: 'Parka gidiyoruz. Rahat bir kombin hazırla!',
      gerek: ['elbise', 'ayakkabi'],
      ders: 'Oynayacağımız yerlerde rahat kıyafet seçmek en iyisidir.' },
    { id: 'gyd-misafir',e: '🍰', metin: 'Misafirliğe gidiyoruz. Çantayı da unutma!',
      gerek: ['esarp', 'elbise', 'ayakkabi', 'canta'],
      ders: 'Misafirliğe düzgün giyinmek, ev sahibine gösterdiğimiz saygıdır.' },
    { id: 'gyd-okul',   e: '📚', metin: 'Okula gidiyoruz. Düzenli bir kombin hazırla!',
      gerek: ['esarp', 'elbise', 'ayakkabi'],
      ders: 'Okula düzenli gitmek, öğrenmeye hazır olmak demektir.' },
    { id: 'gyd-serbest',e: '✨', metin: 'Şimdi tamamen serbest! İstediğin kombini yap.',
      gerek: ['elbise'],
      ders: 'Kendi tarzını bulmak çok güzel. Sen ne seçtiysen o güzel.' }
  ];

  const GORSEL = 'gorseller/';
  let ctx = null, gi = 0, giyili = {}, acikRaf = 'esarp';
  let sahneEl = null, katmanEl = {}, surukle = null, hayalet = null;

  function mount(c) {
    ctx = c; gi = 0; giyili = {}; acikRaf = 'esarp';
    ctx.say({ id: 'sys-oyun-giydirme', text: 'Kıyafetleri parmağınla tutup Mina’nın üstüne bırak!' });
    ctx.duck(3400);
    setTimeout(kur, 3500);
  }

  /* --- görsel ya da emoji --- */
  function parcaGorsel(anahtar, p, sinif) {
    const k = KATMAN[anahtar];
    if (!p.dosya) return `<span class="${sinif} yedek-e">✖</span>`;
    return `<img class="${sinif}" src="${GORSEL}${p.dosya}.webp" alt="" draggable="false"
              onerror="this.replaceWith(Object.assign(document.createElement('span'),
                {className:'${sinif} yedek-e',textContent:'${k.e}',
                 style:'color:${p.renk || '#bbb'}'}))">`;
  }

  function kur() {
    const g = GOREVLER[gi];
    giyili = {};
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="gorev-serit"><span class="gorev-e">${g.e}</span>
          <span class="gorev-t">${g.metin}</span></div>
      </div>`;
    ctx.setProgress(gi, GOREVLER.length);
    ctx.duck(3200);
    ctx.say({ id: g.id, text: g.metin });

    ctx.options.className = 'options-area giydirme';
    ctx.options.style.gridTemplateColumns = '';
    ctx.options.innerHTML = `
      <div class="giy-sahne" id="giySahne">
        <img class="giy-taban" src="${GORSEL}giy-mina.webp" alt="" draggable="false"
             onerror="this.replaceWith(Object.assign(document.createElement('span'),
               {className:'giy-taban yedek-e',textContent:'🧍‍♀️'}))">
        <div class="giy-katmanlar" id="giyKatman"></div>
        <div class="giy-hedef" id="giyHedef"></div>
      </div>
      <div class="giy-panel">
        <div class="raf-sekme" id="rafSekme"></div>
        <div class="raf-parcalar" id="rafParca"></div>
        <div class="giy-ipucu" id="giyIpucu">Parçayı tut, Mina’nın üstüne bırak</div>
        <button class="pill-btn green giy-hazir" id="giyHazir">✅ Hazır!</button>
      </div>`;
    sahneEl = ctx.options.querySelector('#giySahne');
    katmanEl = {};
    sekmeCiz(); rafCiz();
    hedefCiz();
    ctx.options.querySelector('#giyHazir').addEventListener('click', hazir);
  }

  /* Bırakma bölgelerini görünmez kutular olarak hazırla */
  function hedefCiz() {
    const el = ctx.options.querySelector('#giyHedef');
    el.innerHTML = SIRA.map(a => {
      const k = KATMAN[a];
      return `<div class="hedef-kutu" data-a="${a}"
               style="top:${k.bolge[0]}%;height:${k.bolge[1] - k.bolge[0]}%"></div>`;
    }).join('');
  }

  function sekmeCiz() {
    const el = ctx.options.querySelector('#rafSekme');
    el.innerHTML = '';
    SIRA.forEach(a => {
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
    PARCA[acikRaf].forEach(p => {
      const b = document.createElement('div');
      b.className = 'parca' + (giyili[acikRaf] === p.id ? ' secili' : '');
      b.innerHTML = parcaGorsel(acikRaf, p, 'parca-img');
      b.dataset.id = p.id;
      b._p = p; b._a = acikRaf;
      tutmaBagla(b, p, acikRaf);
      el.appendChild(b);
    });
  }

  /* ---------- sürükle & bırak ---------- */
  function tutmaBagla(el, p, anahtar) {
    el.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      el.setPointerCapture(ev.pointerId);
      surukle = { p, anahtar, x: ev.clientX, y: ev.clientY, tasidi: false, el };
      Snd.duck(1500);
      Snd.say({ id: p.id, text: p.ad });   // tutar tutmaz adını söyler
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
      else giydir(anahtar, p);          // sürüklemeden dokunduysa da giydir
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
    return SIRA.find(a => {
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

    const ust = hedefAlti(x, y);
    if (ust === anahtar) { giydir(anahtar, p); return; }

    // yanlış bölge — nazikçe yönlendir
    Snd.sfx.wrong(); ctx.oops(); Snd.duck(2200);
    const yer = { esarp: 'başına', elbise: 'üstüne', ayakkabi: 'ayağına', canta: 'eline' }[anahtar];
    Snd.say({ id: 'giy-yanlis-' + anahtar, text: `${KATMAN[anahtar].ad} ${yer} gider. Bir daha dene!` });
    const ip = ctx.options.querySelector('#giyIpucu');
    if (ip) {
      ip.textContent = `${KATMAN[anahtar].ad} ${yer} gider 👆`;
      ip.classList.add('uyari');
      setTimeout(() => { ip.textContent = 'Parçayı tut, Mina’nın üstüne bırak'; ip.classList.remove('uyari'); }, 2600);
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

    // hepsi tamamsa "Hazır" düğmesi parlasın
    const g = GOREVLER[gi];
    const tamam = g.gerek.every(a => giyili[a]);
    const hz = ctx.options.querySelector('#giyHazir');
    if (hz) hz.classList.toggle('parla', tamam);
  }

  function hazir() {
    const g = GOREVLER[gi];
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
    ctx.setProgress(gi, GOREVLER.length);
    setTimeout(() => {
      if (gi >= GOREVLER.length) {
        ctx.options.className = 'options-area';
        ctx.finish(3, 'Bütün kombinleri hazırladın!');
      } else { Snd.sfx.star(); kur(); }
    }, Math.min(2400 + g.ders.length * 82, 7500));
  }

  return {
    id: 'giydirme', title: 'Mina’yı<br>Giydir', emoji: '🧕', mode: 'custom',
    intro: { id: 'sys-oyun-giydirme', text: 'Kıyafetleri parmağınla tutup Mina’nın üstüne bırak!' },
    mount
  };
})();
