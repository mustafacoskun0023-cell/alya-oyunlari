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
    abdest:  window.GameAbdest
  };

  const KATEGORILER = [
    { id: 'zeka', ad: 'Zeka<br>Oyunları', emoji: '🧠', bg: '#FFE7C2', oyunlar: [
      { id: 'numbers', emoji: '🔢', label: 'Sayıları<br>Öğren',      bg: '#FFE7C2', ready: true },
      { id: 'shapes',  emoji: '🎨', label: 'Renkler ve<br>Şekiller', bg: '#D9ECFF', ready: true },
      { id: 'memory',  emoji: '🧩', label: 'Hafıza<br>Oyunu',        bg: '#FFE0EF', ready: true }
    ]},
    { id: 'harf', ad: 'Harfler<br>ve Dil', emoji: '🔤', bg: '#E5FBD8', oyunlar: [
      { id: 'letters', emoji: '🔤', label: 'Harfleri<br>Öğren', bg: '#E5FBD8', ready: true },
      { id: 'kelime',  emoji: '💬', label: 'Kelime<br>Dağarcığı', ready: false },
      { id: 'hikaye',  emoji: '📖', label: 'Hikaye<br>Dinle',     ready: false }
    ]},
    { id: 'dini', ad: 'Dini<br>Eğitim', emoji: '🕌', bg: '#E8E2FF', oyunlar: [
      { id: 'dua',       emoji: '🤲', label: 'Dua<br>Eşleştirme',  bg: '#E8E2FF', ready: true },
      { id: 'abdest',    emoji: '💧', label: 'Abdest<br>Puzzle',   bg: '#D9F3FF', ready: true },
      { id: 'arapharf',  emoji: '📿', label: 'Arap<br>Harfleri',       ready: false },
      { id: 'cami',      emoji: '🕌', label: "Cami'yi<br>Bul",         ready: false },
      { id: 'kabe',      emoji: '🕋', label: 'Minik Kâbe<br>Yolculuğu',ready: false },
      { id: 'ramazan',   emoji: '🌙', label: "Ramazan'ı<br>Keşfet",    ready: false },
      { id: 'bayram',    emoji: '🎁', label: 'Bayram<br>Hazırlığı',    ready: false },
      { id: 'peygamber', emoji: '📜', label: 'Peygamber<br>Hikayeleri',ready: false },
      { id: 'agac',      emoji: '🌳', label: 'İyilik<br>Ağacı',        ready: false }
    ]},
    { id: 'ahlak', ad: 'Ahlak ve<br>Arkadaşlık', emoji: '💗', bg: '#FFE0EF', oyunlar: [
      { id: 'duygu',    emoji: '😊', label: 'Duyguları<br>Tanı',      ready: false },
      { id: 'empati',   emoji: '🤝', label: 'Empati<br>Oyunu',        ready: false },
      { id: 'paylasma', emoji: '🎈', label: 'Paylaşma<br>Zamanı',     ready: false },
      { id: 'guzelsoz', emoji: '💌', label: 'Güzel<br>Sözler',        ready: false },
      { id: 'gorev',    emoji: '⭐', label: 'Arkadaşlık<br>Görevleri',ready: false },
      { id: 'bugun',    emoji: '🌟', label: 'Bugünün<br>İyiliği',     ready: false },
      { id: 'bahce',    emoji: '🌷', label: 'Dostluk<br>Bahçesi',     ready: false }
    ]},
    { id: 'moda', ad: 'Moda<br>ve Stil', emoji: '👗', bg: '#FFE4F1', oyunlar: [
      { id: 'moda',     emoji: '👗', label: 'Moda<br>Atölyesi', ready: false },
      { id: 'kombin',   emoji: '👜', label: 'Kombin<br>Oyunu',  ready: false },
      { id: 'renkuyum', emoji: '🎀', label: 'Renk<br>Uyumu',    ready: false }
    ]},
    { id: 'yaratici', ad: 'Yaratıcılık', emoji: '🖍️', bg: '#FFF3C4', oyunlar: [
      { id: 'boyama', emoji: '🖍️', label: 'Boyama<br>Kitabı',   ready: false },
      { id: 'cizim',  emoji: '✏️', label: 'Serbest<br>Çizim',   ready: false },
      { id: 'muzik',  emoji: '🥁', label: 'Müzik<br>ve Ritim',  ready: false },
      { id: 'ilahi',  emoji: '🎶', label: 'İlahi ve<br>Şarkılar',ready: false }
    ]},
    { id: 'hareket', ad: 'Hareket', emoji: '🥋', bg: '#DFF6EA', oyunlar: [
      { id: 'hareket', emoji: '🥋', label: 'Hareket<br>Oyunu',  ready: false },
      { id: 'nefes',   emoji: '🌬️', label: 'Nefes<br>Egzersizi', ready: false }
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

  function show(name) {
    Object.keys(screens).forEach(k => screens[k].classList.toggle('active', k === name));
  }
  function renderStars() { $('#totalStars').textContent = '⭐ ' + totalStars; }

  const menuBackBtn = $('#menuBackBtn');
  const topbar = $('#topbar');
  const brandTitle = $('#brandTitle');
  let acikKategori = null;

  function kart(o, tiklama) {
    const b = document.createElement('button');
    b.className = 'game-card' + (o.ready === false ? ' locked' : '');
    if (o.bg) b.style.background = o.bg;
    b.innerHTML = `<span class="emoji">${o.emoji}</span><span class="label">${o.label}</span>` +
                  (o.ready === false ? '<span class="soon-tag">YAKINDA</span>' : '') +
                  (o.rozet ? `<span class="card-badge">${o.rozet}</span>` : '');
    b.addEventListener('click', tiklama);
    return b;
  }

  function buildMenu() {
    acikKategori = null;
    topbar.classList.remove('in-category');
    brandTitle.innerHTML = "Alya'nın Oyunları";
    const grid = $('#menuGrid');
    grid.innerHTML = '';
    KATEGORILER.forEach(k => {
      const hazir = k.oyunlar.filter(o => o.ready).length;
      grid.appendChild(kart(
        { emoji: k.emoji, label: k.ad, bg: k.bg, ready: true,
          rozet: hazir ? hazir + ' oyun' : 'yakında' },
        () => { Snd.sfx.tap(); openCategory(k.id); }
      ));
    });
  }

  function openCategory(id) {
    const k = KATEGORILER.find(x => x.id === id);
    if (!k) return;
    acikKategori = id;
    topbar.classList.add('in-category');
    brandTitle.innerHTML = k.ad.replace(/<br>/g, ' ');
    const grid = $('#menuGrid');
    grid.innerHTML = '';
    k.oyunlar.forEach(o => {
      grid.appendChild(kart(o, () => {
        if (o.ready) { Snd.sfx.tap(); startGame(o.id); }
        else {
          Snd.sfx.whoosh();
          Snd.say({ id: 'sys-yakinda', text: 'Bu oyun çok yakında geliyor!' });
        }
      }));
    });
  }

  menuBackBtn.addEventListener('click', () => { Snd.sfx.tap(); Snd.stopVoice(); buildMenu(); });

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

  function catHappy() {
    Mascot.flash(gameCat, 'happy', 1800);
    gameCat.classList.add('happy');
    setTimeout(() => gameCat.classList.remove('happy'), 1300);
  }
  function catOops() { Mascot.flash(gameCat, 'oops', 1400); }

  function setProgress(cur, total) {
    $('#progressLabel').textContent = cur + ' / ' + total;
    $('#progressFill').style.width = (cur / total * 100) + '%';
  }

  function startGame(id) {
    G = GAMES[id];
    if (!G) return;
    qi = 0; correctFirst = 0;
    show('game');
    Mascot.render(gameCat, 'idle');
    optionsArea.className = 'options-area';
    optionsArea.style.gridTemplateColumns = '';
    $('#repeatBtn').style.visibility = G.mode === 'custom' ? 'hidden' : 'visible';

    if (G.mode === 'custom') {
      G.mount({
        prompt: promptArea, options: optionsArea,
        setProgress, say: Snd.say, duck: Snd.duck,
        happy: catHappy, oops: catOops,
        finish: customFinish
      });
      return;
    }

    G.start();
    Snd.say(G.intro);
    Snd.duck(1500);
    setTimeout(nextQuestion, 1400);
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
      const b = document.createElement('button');
      b.className = 'opt';
      b.innerHTML = o.html + '<span class="opt-check">✅</span>';
      b.addEventListener('click', () => answer(b, o));
      optionsArea.appendChild(b);
    });

    sayQuestion();
    // sıradaki sorunun kliplerini önceden indir
    if (qi + 1 < G.total) {
      try {
        const nx = G.question(qi + 1);
        Snd.preload([nx.say && nx.say.id, nx.sayFollow && nx.sayFollow.id]);
      } catch (e) {}
    }
  }

  function sayQuestion() {
    Snd.duck(2800);
    Snd.say(q.say);
    if (q.sayFollow) Snd.say(q.sayFollow, { delay: q.sayFollow.delay || 900, keep: true });
  }

  function answer(btn, opt) {
    if (locked) return;
    if (opt.correct) {
      locked = true;
      btn.classList.add('correct');
      [...optionsArea.children].forEach(c => { if (c !== btn) c.classList.add('dim'); });
      Snd.sfx.correct(); Snd.sfx.applause();
      const r = btn.getBoundingClientRect();
      FX.confetti(80, r.left + r.width / 2, r.top + r.height / 2);
      catHappy();
      Snd.duck(2200);
      if (opt.onCorrect) {
        Snd.say(opt.onCorrect, { delay: 300 });
        Snd.say(U.pick(PRAISE), { delay: 1500, keep: true });
      } else {
        Snd.say(U.pick(PRAISE), { delay: 380 });
      }
      if (firstTry) correctFirst++;
      qi++;
      setProgress(qi, G.total);
      setTimeout(nextQuestion, opt.onCorrect ? 2600 : 2000);
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
    $('#rewardTitle').textContent = 'Tebrikler Alya!';
    $('#rewardScore').textContent = altYazi;
    const row = $('#starsRow');
    row.innerHTML = '<span class="st">⭐</span><span class="st">⭐</span><span class="st">⭐</span>';
    Mascot.render($('#rewardCat'), 'happy');
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
    Snd.stopVoice(); Snd.sfx.tap(); FX.clear();
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
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
