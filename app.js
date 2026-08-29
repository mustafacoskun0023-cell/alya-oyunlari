/* ===== Alya'nın Oyunları — ana uygulama ===== */
(function () {
  'use strict';

  const $ = s => document.querySelector(s);
  const screens = { splash: $('#splash'), menu: $('#menu'), game: $('#game'), reward: $('#reward') };

  const GAMES = {
    numbers: window.GameNumbers,
    shapes:  window.GameShapes,
    letters: window.GameLetters,
    memory:  window.GameMemory,
    dua:     window.GameDua,
    abdest:  window.GameAbdest,
    sofra:   window.GameSofra,
    dis:     window.GameDis,
    // v9 — yeni oyunlar
    kelime:   window.GameKelime,
    hikaye:   window.GameHikaye,
    arapharf: window.GameArapharf,
    cami:     window.GameCami,
    kabe:     window.GameKabe,
    ramazan:  window.GameRamazan,
    bayram:   window.GameBayram,
    peygamber:window.GamePeygamber,
    agac:     window.GameAgac,
    duygu:    window.GameDuygu,
    empati:   window.GameEmpati,
    paylasma: window.GamePaylasma,
    guzelsoz: window.GameGuzelsoz,
    gorev:    window.GameGorev,
    bugun:    window.GameBugun,
    bahce:    window.GameBahce,
    elyikama: window.GameElyikama,
    banyo:    window.GameBanyo,
    toplan:   window.GameToplan,
    rutin:    window.GameRutin,
    saglik:   window.GameSaglik,
    giyinme:  window.GameGiyinme,
    giydirme: window.GameGiydirme,
    kombin:   window.GameKombin,
    renkuyum: window.GameRenkuyum,
    moda:     window.GameModa,
    boyama:   window.GameBoyama,
    cizim:    window.GameCizim,
    muzik:    window.GameMuzik,
    ilahi:    window.GameIlahi,
    hareket:  window.GameHareket,
    nefes:    window.GameNefes
  };

  const KATEGORILER = [
    { id: 'zeka', ad: 'Zeka<br>Oyunları', emoji: '🧠', bg: '#FFE7C2', oyunlar: [
      { id: 'numbers', emoji: '🔢', label: 'Sayıları<br>Öğren',      bg: '#FFE7C2', ready: true },
      { id: 'shapes',  emoji: '🎨', label: 'Renkler ve<br>Şekiller', bg: '#D9ECFF', ready: true },
      { id: 'memory',  emoji: '🧩', label: 'Hafıza<br>Oyunu',        bg: '#FFE0EF', ready: true }
    ]},
    { id: 'harf', ad: 'Harfler<br>ve Dil', emoji: '🔤', bg: '#E5FBD8', oyunlar: [
      { id: 'letters', emoji: '🔤', label: 'Harfleri<br>Öğren', bg: '#E5FBD8', ready: true },
      { id: 'kelime',  emoji: '💬', label: 'Kelime<br>Dağarcığı', ready: true },
      { id: 'hikaye',  emoji: '📖', label: 'Hikaye<br>Dinle',     ready: true }
    ]},
    { id: 'dini', ad: 'Dini<br>Eğitim', emoji: '🕌', bg: '#E8E2FF', oyunlar: [
      { id: 'dua',       emoji: '🤲', label: 'Dua<br>Eşleştirme',  bg: '#E8E2FF', ready: true },
      { id: 'abdest',    emoji: '💧', label: 'Abdest<br>Puzzle',   bg: '#D9F3FF', ready: true },
      { id: 'arapharf',  emoji: '📿', label: 'Arap<br>Harfleri',       ready: true },
      { id: 'cami',      emoji: '🕌', label: "Cami'yi<br>Bul",         ready: true },
      { id: 'kabe',      emoji: '🕋', label: 'Minik Kâbe<br>Yolculuğu',ready: true },
      { id: 'ramazan',   emoji: '🌙', label: "Ramazan'ı<br>Keşfet",    ready: true },
      { id: 'bayram',    emoji: '🎁', label: 'Bayram<br>Hazırlığı',    ready: true },
      { id: 'peygamber', emoji: '📜', label: 'Peygamber<br>Hikayeleri',ready: true },
      { id: 'agac',      emoji: '🌳', label: 'İyilik<br>Ağacı',        ready: true }
    ]},
    { id: 'ahlak', ad: 'Ahlak ve<br>Arkadaşlık', emoji: '💗', bg: '#FFE0EF', oyunlar: [
      { id: 'duygu',    emoji: '😊', label: 'Duyguları<br>Tanı',      ready: true },
      { id: 'empati',   emoji: '🤝', label: 'Empati<br>Oyunu',        ready: true },
      { id: 'paylasma', emoji: '🎈', label: 'Paylaşma<br>Zamanı',     ready: true },
      { id: 'guzelsoz', emoji: '💌', label: 'Güzel<br>Sözler',        ready: true },
      { id: 'gorev',    emoji: '⭐', label: 'Arkadaşlık<br>Görevleri',ready: true },
      { id: 'bugun',    emoji: '🌟', label: 'Bugünün<br>İyiliği',     ready: true },
      { id: 'bahce',    emoji: '🌷', label: 'Dostluk<br>Bahçesi',     ready: true }
    ]},
    { id: 'temizlik', ad: 'Temizlik<br>ve Görgü', emoji: '🧼', bg: '#DDF4FF', oyunlar: [
      { id: 'sofra',    emoji: '🍽️', label: 'Sofra<br>Adabı',      bg: '#FFF0DC', ready: true },
      { id: 'dis',      emoji: '🪥', label: 'Diş<br>Fırçalama',    bg: '#DDF4FF', ready: true },
      { id: 'elyikama', emoji: '🧼', label: 'El<br>Yıkama',        ready: true },
      { id: 'banyo',    emoji: '🛁', label: 'Banyo<br>Zamanı',     ready: true },
      { id: 'toplan',   emoji: '🧺', label: 'Toplanma<br>Vakti',   ready: true },
      { id: 'rutin',    emoji: '⏰', label: 'Günlük<br>Rutinim',   ready: true },
      { id: 'saglik',   emoji: '🤧', label: 'Hapşırma<br>Adabı',   ready: true },
      { id: 'giyinme',  emoji: '👟', label: 'Giyinme<br>ve Düzen', ready: true }
    ]},
    { id: 'moda', ad: 'Moda<br>ve Stil', emoji: '👗', bg: '#FFE4F1', oyunlar: [
      { id: 'giydirme', emoji: '🧕', label: 'Mina’yı<br>Giydir', bg: '#FFE4F1', ready: true },
      { id: 'moda',     emoji: '👗', label: 'Moda<br>Atölyesi', ready: true },
      { id: 'kombin',   emoji: '👜', label: 'Kombin<br>Oyunu',  ready: true },
      { id: 'renkuyum', emoji: '🎀', label: 'Renk<br>Uyumu',    ready: true }
    ]},
    { id: 'yaratici', ad: 'Yaratıcılık', emoji: '🖍️', bg: '#FFF3C4', oyunlar: [
      { id: 'boyama', emoji: '🖍️', label: 'Boyama<br>Kitabı',   ready: true },
      { id: 'cizim',  emoji: '✏️', label: 'Serbest<br>Çizim',   ready: true },
      { id: 'muzik',  emoji: '🥁', label: 'Müzik<br>ve Ritim',  ready: true },
      { id: 'ilahi',  emoji: '🎶', label: 'İlahi ve<br>Şarkılar',ready: true }
    ]},
    { id: 'hareket', ad: 'Hareket', emoji: '🥋', bg: '#DFF6EA', oyunlar: [
      { id: 'hareket', emoji: '🥋', label: 'Hareket<br>Oyunu',  ready: true },
      { id: 'nefes',   emoji: '🌬️', label: 'Nefes<br>Egzersizi', ready: true }
    ]}
  ];

  const PRAISE = [
    { id: 'ovgu-1', text: 'Aferin Alya!' }, { id: 'ovgu-2', text: 'Harikasın!' },
    { id: 'ovgu-3', text: 'Çok güzel!' },   { id: 'ovgu-4', text: 'Bravo!' },
    { id: 'ovgu-5', text: 'Süpersin Alya!' },{ id: 'ovgu-6', text: 'Mükemmel!' },
    { id: 'ovgu-7', text: 'Çok iyi!' }
  ];
  const ENCOURAGE = [
    { id: 'tekrar-1', text: 'Olsun, tekrar dene.' },
    { id: 'tekrar-2', text: 'Az kaldı, bir daha bak.' },
    { id: 'tekrar-3', text: 'Hadi tekrar deneyelim.' },
    { id: 'tekrar-4', text: 'Yaklaştın, tekrar dene.' }
  ];
  const YILDIZ_SES = {
    1: { id: 'sys-yildiz-1', text: 'Tebrikler Alya! Bir yıldız kazandın!' },
    2: { id: 'sys-yildiz-2', text: 'Tebrikler Alya! İki yıldız kazandın!' },
    3: { id: 'sys-yildiz-3', text: 'Tebrikler Alya! Üç yıldız kazandın!' }
  };

  /* ---------- kalıcı veri ---------- */
  function load(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  let totalStars = load('alya_stars', 0);
  let musicPref = load('alya_music', true);

  /* ---------- oyun ilerlemesi (tablet kapansa da kalır) ----------
     { oyunId: { oynandi: 3, enIyi: 2, sonKez: '2026-08-23' } }        */
  let ilerleme = load('alya_ilerleme', {});
  function ilerlemeKaydet(oyunId, yildiz) {
    const k = ilerleme[oyunId] || { oynandi: 0, enIyi: 0 };
    k.oynandi++;
    if (yildiz > k.enIyi) k.enIyi = yildiz;
    k.sonKez = new Date().toISOString().slice(0, 10);
    ilerleme[oyunId] = k;
    save('alya_ilerleme', ilerleme);
  }
  function ilerlemeSifirla() {
    ilerleme = {}; totalStars = 0;
    save('alya_ilerleme', ilerleme); save('alya_stars', 0);
    renderStars(); buildMenu();
  }

  function show(name) {
    Object.keys(screens).forEach(k => screens[k].classList.toggle('active', k === name));
  }
  const SEVIYELER = [
    { min:   0, no: 1, ad: 'Bismillah Öğrencisi' },
    { min:  10, no: 2, ad: 'İyilik Çırağı' },
    { min:  25, no: 3, ad: 'Merhamet Dostu' },
    { min:  50, no: 4, ad: 'Güzel Ahlak Kahramanı' },
    { min: 100, no: 5, ad: 'Minik İyilik Elçisi' }
  ];
  function seviye(y) { return SEVIYELER.slice().reverse().find(s => y >= s.min) || SEVIYELER[0]; }

  function renderStars() {
    const sv = seviye(totalStars);
    $('#totalStars').innerHTML =
      `<img class="seviye-rozet" src="gorseller/rozet-${sv.no}.webp" alt=""
         onerror="this.remove()"><span>⭐ ${totalStars}</span>` +
      `<span class="seviye-ad">${sv.ad}</span>`;
  }

  const menuBackBtn = $('#menuBackBtn');
  const topbar = $('#topbar');
  const brandTitle = $('#brandTitle');
  let acikKategori = null;

  const GORSEL = 'gorseller/';
  function gorselli(dosya, emoji, sinif) {
    // görsel yoksa emoji'ye düşer, uygulama bozulmaz
    return `<img class="${sinif}" src="${GORSEL}${dosya}.webp" alt="" loading="lazy"
              onerror="this.replaceWith(Object.assign(document.createElement('span'),
                       {className:'${sinif} emoji-yedek',textContent:'${emoji}'}))">`;
  }

  function kart(o, tiklama) {
    const b = document.createElement('button');
    b.className = 'game-card' + (o.ready === false ? ' locked' : '');
    if (o.bg) b.style.background = o.bg;
    b.innerHTML = gorselli(o.gorsel, o.emoji, 'kart-gorsel') +
                  `<span class="label">${o.label}</span>` +
                  (o.ready === false ? '<span class="soon-tag">YAKINDA</span>' : '') +
                  (o.rozet ? `<span class="card-badge">${o.rozet}</span>` : '') +
                  (o.yildiz ? `<span class="kart-yildiz">${'⭐'.repeat(o.yildiz)}</span>` : '');
    b.addEventListener('click', tiklama);
    return b;
  }

  function buildMenu() {
    acikKategori = null;
    topbar.classList.remove('in-category');
    brandTitle.innerHTML = "Alya'nın Oyunları";
    const grid = $('#menuGrid');
    grid.innerHTML = '';
    // Sadece oynanabilir oyunu olan kategoriler görünür — Alya
    // dokunup açılmayan karta takılmasın.
    KATEGORILER.filter(k => k.oyunlar.some(o => o.ready)).forEach(k => {
      const hazir = k.oyunlar.filter(o => o.ready);
      const bitmis = hazir.filter(o => ilerleme[o.id]).length;
      grid.appendChild(kart(
        { emoji: k.emoji, gorsel: 'kategori-' + k.id, label: k.ad, bg: k.bg, ready: true,
          rozet: bitmis ? bitmis + '/' + hazir.length + ' ✓' : hazir.length + ' oyun' },
        () => { Snd.sfx.tap(); openCategory(k.id); }
      ));
    });
    izgaraAyarla(grid);
  }

  /* Az kart varsa ızgara ortalansın ve kartlar büyüsün. */
  function izgaraAyarla(grid) {
    const n = grid.children.length;
    const dikey = innerHeight > innerWidth;
    const sut = dikey ? Math.min(n, 2) : Math.min(n, n <= 4 ? n : 4);
    grid.style.gridTemplateColumns = 'repeat(' + Math.max(sut, 1) + ',minmax(0,1fr))';
    grid.style.justifyContent = 'center';
    // flex içinde margin:auto stretch'i bozuyor — genişliği açıkça veriyoruz
    grid.style.width = sut <= 2 ? 'min(100%,720px)' : '100%';
    grid.style.marginInline = 'auto';
  }

  function openCategory(id) {
    const k = KATEGORILER.find(x => x.id === id);
    if (!k) return;
    acikKategori = id;
    topbar.classList.add('in-category');
    brandTitle.innerHTML = k.ad.replace(/<br>/g, ' ');
    const grid = $('#menuGrid');
    grid.innerHTML = '';
    // Hazır olmayan oyunlar menüde hiç görünmüyor; hepsi serbestçe seçilebilir.
    k.oyunlar.filter(o => o.ready).forEach(o => {
      o.gorsel = 'oyun-' + o.id;
      o.yildiz = (ilerleme[o.id] || {}).enIyi || 0;
      grid.appendChild(kart(o, () => { Snd.sfx.tap(); startGame(o.id); }));
    });
    izgaraAyarla(grid);
  }

  menuBackBtn.addEventListener('click', () => { Snd.sfx.tap(); Snd.stopVoice(); buildMenu(); });

  /* ---------- Anne-baba paneli ----------
     ⚙ düğmesine 2 saniye basılı tutmak gerekiyor; 4 yaşındaki bir
     çocuk kazayla açıp ilerlemeyi silemesin diye.                  */
  (function ayarKur() {
    const btn = $('#ayarBtn'), panel = $('#ayarPanel'), ozet = $('#ayarOzet');
    let zaman = null;
    function ac() {
      const hazir = [];
      KATEGORILER.forEach(k => k.oyunlar.forEach(o => { if (o.ready) hazir.push(o); }));
      const satir = hazir.map(o => {
        const k = ilerleme[o.id];
        const ad = o.label.replace(/<br>/g, ' ');
        return k
          ? `<div class="ozet-satir"><span>${ad}</span><b>${'⭐'.repeat(k.enIyi)} · ${k.oynandi} kez · ${k.sonKez}</b></div>`
          : `<div class="ozet-satir bos"><span>${ad}</span><b>henüz oynanmadı</b></div>`;
      }).join('');
      ozet.innerHTML = `<div class="ozet-baslik">Toplam ⭐ ${totalStars}</div>` + satir;
      panel.hidden = false;
    }
    function bas() { clearTimeout(zaman); zaman = setTimeout(() => { Snd.sfx.tap(); ac(); }, 2000); btn.classList.add('basili'); }
    function birak() { clearTimeout(zaman); btn.classList.remove('basili'); }
    btn.addEventListener('pointerdown', bas);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(e => btn.addEventListener(e, birak));
    $('#ayarKapat').addEventListener('click', () => { panel.hidden = true; });
    panel.addEventListener('click', e => { if (e.target === panel) panel.hidden = true; });
    $('#sifirlaBtn').addEventListener('click', function () {
      if (this.dataset.onay) { ilerlemeSifirla(); panel.hidden = true; delete this.dataset.onay; this.textContent = 'Tüm ilerlemeyi sıfırla'; return; }
      this.dataset.onay = '1'; this.textContent = 'Emin misin? Tekrar bas';
      setTimeout(() => { delete this.dataset.onay; this.textContent = 'Tüm ilerlemeyi sıfırla'; }, 5000);
    });
  })();

  const musicBtn = $('#musicBtn');
  function syncMusicBtn() { musicBtn.setAttribute('aria-pressed', Snd.musicOn ? 'true' : 'false'); }
  musicBtn.addEventListener('click', () => {
    const on = Snd.musicToggle();
    musicPref = on; save('alya_music', on);
    syncMusicBtn(); Snd.sfx.tap();
  });

  /* ---------- oyun çerçevesi ---------- */
  let G = null, qi = 0, q = null, firstTry = true, correctFirst = 0, locked = false;
  const gameCat = $('#gameCat'), promptArea = $('#promptArea'), optionsArea = $('#optionsArea');

  const MINA_KATEGORI = ['dini', 'ahlak', 'moda', 'temizlik'];
  function oyunKategorisi(oyunId) {
    const k = KATEGORILER.find(x => x.oyunlar.some(o => o.id === oyunId));
    return k ? k.id : null;
  }
  function catHappy() {
    Mascot.flashTip(gameCat, 'happy', 1800);
    gameCat.classList.add('happy');
    setTimeout(() => gameCat.classList.remove('happy'), 1300);
  }
  function catOops() { Mascot.flashTip(gameCat, 'oops', 1400); }

  function setProgress(cur, total) {
    $('#progressLabel').textContent = cur + ' / ' + total;
    $('#progressFill').style.width = (cur / total * 100) + '%';
  }

  /* Her oyun açılışı yeni bir "tur" numarası alır. Önceki oyunun
     gecikmeli kodu (setTimeout ile gelen) bu numarayı taşımıyorsa
     ekrana hiçbir şey yazamaz. Yoksa Alya yeni oyunu açtığında
     saniyelerce ESKİ oyunun sorusunu görüyor, hatta ona dokunuyordu. */
  let tur = 0;
  let acilisTimer = null;
  const turGecerli = t => t === tur;

  /* Ekranı anında temizle; eski oyunun kartları bir an bile kalmasın. */
  function ekraniTemizle() {
    clearTimeout(acilisTimer);
    promptArea.innerHTML = '';
    optionsArea.className = 'options-area yukleniyor-alan';
    optionsArea.style.gridTemplateColumns = '';
    optionsArea.innerHTML = '<div class="yukleniyor"><span></span><span></span><span></span></div>';
    $('#progressFill').style.width = '0%';
    $('#progressLabel').textContent = '';
  }

  function startGame(id) {
    G = GAMES[id];
    if (!G) return;
    tur++;
    const buTur = tur;
    tanitDur();
    Snd.stopVoice();
    FX.clear();
    qi = 0; correctFirst = 0;
    ekraniTemizle();
    show('game');
    const kat = oyunKategorisi(id);
    Mascot.set(gameCat, MINA_KATEGORI.includes(kat) ? 'mina' : 'kedi', 'idle');
    $('#repeatBtn').style.visibility = G.mode === 'custom' ? 'hidden' : 'visible';

    if (G.mode === 'custom') {
      optionsArea.className = 'options-area';
      optionsArea.innerHTML = '';
      G.mount({
        prompt: promptArea, options: optionsArea,
        setProgress, duck: Snd.duck,
        say: (s, o) => { if (turGecerli(buTur)) Snd.say(s, o); },
        happy: catHappy, oops: catOops,
        finish: (yildiz, alt) => { if (turGecerli(buTur)) customFinish(yildiz, alt); },
        gecerli: () => turGecerli(buTur)
      });
      return;
    }

    G.start();
    Snd.say(G.intro);
    Snd.duck(1500);
    acilisTimer = setTimeout(() => { if (turGecerli(buTur)) nextQuestion(); }, 350);
  }

  /* ---------- Seçenek kartı: DİNLE + SEÇ ----------
     Alya okuma bilmiyor. Kartın büyük kısmına dokununca kart ne
     olduğunu söylüyor (seçmiyor). Seçmek için alttaki yeşil
     "Seç" şeridine dokunuyor. Böylece istediği kadar dinleyip
     kararını kendi veriyor; sesler birbirine girmiyor.        */
  function kartYap(o, secildi) {
    const b = document.createElement('div');
    b.className = 'opt';
    b.innerHTML =
      `<button class="opt-dinle" type="button">${o.html}</button>` +
      `<button class="opt-sec" type="button"><span class="sec-ikon">✓</span></button>` +
      `<span class="opt-check">✅</span>`;
    b._opt = o;
    b.querySelector('.opt-dinle').addEventListener('click', () => kartDinle(b, o));
    b.querySelector('.opt-sec').addEventListener('click', () => { Snd.sfx.tap(); secildi(); });
    return b;
  }
  function kartBul(o) {
    return [...optionsArea.children].find(c => c._opt === o);
  }
  function kartDinle(b, o) {
    if (locked) return;
    [...optionsArea.children].forEach(c => c.classList.remove('tanit'));
    b.classList.add('tanit');
    clearTimeout(b._tt);
    b._tt = setTimeout(() => b.classList.remove('tanit'), 1200);
    if (o.ses) Snd.say(o.ses);
    else if (o.dinleSes) Snd.say(o.dinleSes);
    else Snd.sfx.tap();
    Snd.duck(1600);
  }

  function nextQuestion() {
    if (qi >= G.total) return finish();
    q = G.question(qi);
    firstTry = true; locked = false;

    setProgress(qi, G.total);
    $('#progressLabel').textContent = (qi + 1) + ' / ' + G.total;

    promptArea.innerHTML = q.prompt;
    optionsArea.className = 'options-area';
    optionsArea.style.gridTemplateColumns = 'repeat(' + (q.cols || 3) + ',1fr)';
    optionsArea.innerHTML = '';
    q.options.forEach(o => {
      optionsArea.appendChild(kartYap(o, () => answer(kartBul(o), o)));
    });

    sayQuestion();
    // sıradaki sorunun kliplerini önceden indir
    if (qi + 1 < G.total) {
      try {
        const nx = G.question(qi + 1);
        Snd.preload([nx.say && nx.say.id, nx.sayFollow && nx.sayFollow.id]
          .concat((nx.options || []).map(o => o.ses && o.ses.id)));
      } catch (e) {}
    }
  }

  /* ---------- kartların kendini tanıtması ----------
     Alya okuma yazma bilmiyor. Soru sorulduktan sonra her kart
     sırayla parlar ve kendi adını söyler; çocuk hangisinin ne
     olduğunu duyarak öğrenir. İstediği an dokunup kesebilir.     */
  let tanitTimer = [];
  function tanitDur() {
    tanitTimer.forEach(clearTimeout);
    tanitTimer = [];
    [...optionsArea.children].forEach(b => { clearTimeout(b._tt); b.classList.remove('tanit'); });
  }

  function sayQuestion() {
    tanitDur();
    Snd.duck(2800);
    Snd.say(q.say);
    if (q.sayFollow) {
      Snd.say(q.sayFollow, { delay: q.sayFollow.delay || 900, keep: true });
    }
  }

  function answer(btn, opt) {
    if (locked) return;
    tanitDur();          // çocuk seçtiyse tanıtımı kes
    if (opt.correct) {
      locked = true;
      btn.classList.add('correct');
      [...optionsArea.children].forEach(c => { if (c !== btn) c.classList.add('dim'); });
      Snd.sfx.correct(); Snd.sfx.applause();
      const r = btn.getBoundingClientRect();
      FX.confetti(80, r.left + r.width / 2, r.top + r.height / 2);
      catHappy();
      let bekle = q.bekle || 2000;
      // Oyuna özel kutlama (ör. sayı oyununda nesneleri tek tek sayma)
      if (q.onCorrectFx) {
        try {
          q.onCorrectFx(btn, {
            praise: (gec) => Snd.say(U.pick(PRAISE), { delay: gec || 300, keep: true })
          });
        } catch (e) {}
      }
      if (opt.onCorrect) {
        Snd.say(opt.onCorrect, { delay: 300 });
        Snd.say(U.pick(PRAISE), { delay: 1500, keep: true });
        bekle = Math.max(bekle, 2600);
      } else if (!q.onCorrectFx) {
        Snd.say(U.pick(PRAISE), { delay: 380 });
      }
      // Öğretici kısım: neden doğru olduğunu anlat
      if (q.aciklama) {
        const gec = q.onCorrectFx ? Math.max(1400, bekle - 900) : 1400;
        const kutu = document.createElement('div');
        kutu.className = 'aciklama-balon';
        kutu.textContent = q.aciklama.text;
        promptArea.appendChild(kutu);
        setTimeout(() => {
          promptArea.contains(kutu) && kutu.classList.add('gorun');
        }, q.onCorrectFx ? gec - 200 : 30);
        Snd.say(q.aciklama, { delay: gec, keep: true });
        // klip uzunluğu metne göre değişiyor — kısa cümlede bekletme, uzunda kesme
        const okuma = 1100 + (q.aciklama.text || '').length * 82;
        bekle = Math.max(bekle, gec + Math.min(okuma, 7000));
      }
      Snd.duck(Math.max(2200, bekle - 150));
      if (firstTry) correctFirst++;
      qi++;
      setProgress(qi, G.total);
      const cevapTuru = tur;
      acilisTimer = setTimeout(() => { if (turGecerli(cevapTuru)) nextQuestion(); }, bekle);
    } else {
      firstTry = false;
      btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      Snd.sfx.wrong(); catOops();
      Snd.duck(1400);
      Snd.say(U.pick(ENCOURAGE));
      setTimeout(() => btn.classList.remove('wrong'), 600);
    }
  }

  function odul(stars, altYazi) {
    totalStars += stars; save('alya_stars', totalStars); renderStars();
    if (G && G.id) ilerlemeKaydet(G.id, stars);
    $('#rewardTitle').textContent = 'Tebrikler Alya!';
    $('#rewardScore').textContent = altYazi;
    const row = $('#starsRow');
    row.innerHTML = '<span class="st">⭐</span><span class="st">⭐</span><span class="st">⭐</span>';
    Mascot.set($('#rewardCat'), gameCat._tip || 'kedi', 'happy');
    show('reward');

    Snd.sfx.fanfare();
    FX.starRain(34);
    FX.confetti(110, innerWidth / 2, innerHeight * 0.35);
    Snd.duck(3200);
    Snd.say(YILDIZ_SES[stars], { delay: 500 });

    const sts = row.querySelectorAll('.st');
    for (let i = 0; i < stars; i++) {
      setTimeout(() => { sts[i].classList.add('on'); Snd.sfx.star(); }, 700 + i * 520);
    }
  }

  function finish() {
    const stars = correctFirst >= 9 ? 3 : correctFirst >= 6 ? 2 : 1;
    odul(stars, `${G.total} sorudan ${correctFirst} tanesini ilk denemede bildin!`);
  }
  function customFinish(stars, altYazi) { odul(stars, altYazi); }

  /* ---------- butonlar ---------- */
  function eveDon() {
    tanitDur();
    /* Turu ilerlet: bu oyunun bekleyen hiçbir gecikmeli kodu artık
       ekrana yazamaz. Aksi halde menüdeyken oyun ekranı çiziliyordu. */
    tur++;
    clearTimeout(acilisTimer);
    Snd.stopVoice(); Snd.sfx.tap(); FX.clear();
    promptArea.innerHTML = '';
    optionsArea.innerHTML = '';
    optionsArea.className = 'options-area';
    optionsArea.style.gridTemplateColumns = '';
    if (acikKategori) openCategory(acikKategori);
    show('menu');
  }
  $('#backBtn').addEventListener('click', eveDon);
  $('#homeBtn').addEventListener('click', eveDon);
  $('#repeatBtn').addEventListener('click', () => { if (q && G && G.mode !== 'custom') sayQuestion(); });
  $('#againBtn').addEventListener('click', () => { Snd.sfx.tap(); FX.clear(); startGame(G.id); });

  /* ---------- açılış ---------- */
  Mascot.render($('#splashCat'), 'happy');
  Mascot.render($('#menuCat'), 'idle');
  buildMenu();
  renderStars();

  $('#startBtn').addEventListener('click', () => {
    Snd.unlock(); Snd.sfx.star();
    if (musicPref) Snd.musicStart();
    syncMusicBtn();
    show('menu');
    Snd.duck(2400);
    Snd.say({ id: 'sys-merhaba', text: 'Merhaba Alya! Hangi oyunu oynamak istersin?' }, { delay: 350 });
  });

  /* ---------- ekranı uyanık tut ---------- */
  let wl = null;
  async function keepAwake() {
    try { if ('wakeLock' in navigator) wl = await navigator.wakeLock.request('screen'); } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') keepAwake(); else Snd.stopVoice();
  });
  $('#startBtn').addEventListener('click', keepAwake, { once: true });

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

  /* ---------- "Ana ekrana ekle" ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e;
    const fab = document.createElement('button');
    fab.className = 'install-fab';
    fab.textContent = '⬇︎ Ana ekrana ekle';
    fab.addEventListener('click', async () => {
      fab.remove();
      if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
    });
    screens.menu.appendChild(fab);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
      // Ses ve görselleri sayfa tamamen açıldıktan SONRA indirt —
      // açılışta hepsini birden çekmek uygulamayı kasıyordu.
      navigator.serviceWorker.ready.then(reg => {
        setTimeout(() => {
          const sw = reg.active || navigator.serviceWorker.controller;
          if (sw) sw.postMessage({ tip: 'medya-yukle' });
        }, 5000);
      }).catch(() => {});
    });
  }
})();
