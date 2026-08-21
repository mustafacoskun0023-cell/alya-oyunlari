/* ===== Alya'nın Oyunları — ana uygulama ===== */
(function () {
  'use strict';

  const $ = s => document.querySelector(s);
  const screens = { splash: $('#splash'), menu: $('#menu'), game: $('#game'), reward: $('#reward') };

  const GAMES = { numbers: window.GameNumbers, shapes: window.GameShapes };

  const MENU = [
    { id: 'numbers', emoji: '🔢', label: 'Sayıları<br>Öğren', bg: '#FFE7C2', ready: true },
    { id: 'shapes',  emoji: '🎨', label: 'Renkler ve<br>Şekiller', bg: '#D9ECFF', ready: true },
    { id: 'letters', emoji: '🔤', label: 'Harfleri<br>Öğren', ready: false },
    { id: 'memory',  emoji: '🧠', label: 'Hafıza<br>Oyunu', ready: false },
    { id: 'arabic',  emoji: '🕌', label: 'Arap<br>Harfleri', ready: false },
    { id: 'move',    emoji: '🥋', label: 'Hareket<br>Oyunu', ready: false },
    { id: 'emotion', emoji: '😊', label: 'Duyguları<br>Tanı', ready: false },
    { id: 'draw',    emoji: '🖍️', label: 'Çizim ve<br>Boyama', ready: false }
  ];

  const PRAISE = ['Aferin Alya!', 'Harikasın!', 'Çok güzel!', 'Bravo!', 'Süpersin Alya!', 'Mükemmel!', 'Çok iyi!'];
  const ENCOURAGE = ['Olsun, tekrar dene.', 'Az kaldı, bir daha bak.', 'Hadi tekrar deneyelim.', 'Yaklaştın, tekrar dene.'];

  /* ---------- kalıcı veri ---------- */
  function load(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  let totalStars = load('alya_stars', 0);
  let musicPref = load('alya_music', true);

  /* ---------- ekran geçişi ---------- */
  function show(name) {
    Object.keys(screens).forEach(k => screens[k].classList.toggle('active', k === name));
  }

  /* ---------- menü ---------- */
  function renderStars() { $('#totalStars').textContent = '⭐ ' + totalStars; }

  function buildMenu() {
    const grid = $('#menuGrid');
    grid.innerHTML = '';
    MENU.forEach(m => {
      const b = document.createElement('button');
      b.className = 'game-card' + (m.ready ? '' : ' locked');
      if (m.bg) b.style.background = m.bg;
      b.innerHTML = `<span class="emoji">${m.emoji}</span><span class="label">${m.label}</span>` +
                    (m.ready ? '' : '<span class="soon-tag">YAKINDA</span>');
      if (m.ready) {
        b.addEventListener('click', () => { Snd.sfx.tap(); startGame(m.id); });
      } else {
        b.addEventListener('click', () => { Snd.sfx.whoosh(); Snd.speak('Bu oyun çok yakında geliyor!'); });
      }
      grid.appendChild(b);
    });
  }

  /* ---------- müzik butonu ---------- */
  const musicBtn = $('#musicBtn');
  function syncMusicBtn() { musicBtn.setAttribute('aria-pressed', Snd.musicOn ? 'true' : 'false'); }
  musicBtn.addEventListener('click', () => {
    const on = Snd.musicToggle();
    musicPref = on; save('alya_music', on);
    syncMusicBtn();
    Snd.sfx.tap();
  });

  /* ---------- oyun döngüsü ---------- */
  let G = null, qi = 0, q = null, firstTry = true, correctFirst = 0, locked = false;
  const gameCat = $('#gameCat'), promptArea = $('#promptArea'), optionsArea = $('#optionsArea');

  function startGame(id) {
    G = GAMES[id];
    if (!G) return;
    qi = 0; correctFirst = 0;
    G.start();
    show('game');
    Mascot.render(gameCat, 'idle');
    Snd.speak(G.intro);
    Snd.duck(1500);
    setTimeout(nextQuestion, 1400);
  }

  function nextQuestion() {
    if (qi >= G.total) return finish();
    q = G.question(qi);
    firstTry = true; locked = false;

    $('#progressLabel').textContent = (qi + 1) + ' / ' + G.total;
    $('#progressFill').style.width = ((qi) / G.total * 100) + '%';

    promptArea.innerHTML = q.prompt;
    optionsArea.style.gridTemplateColumns = 'repeat(' + (q.cols || 3) + ',1fr)';
    optionsArea.innerHTML = '';
    q.options.forEach(o => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.innerHTML = o.html + '<span class="opt-check">✅</span>';
      b.addEventListener('click', () => answer(b, o.correct));
      optionsArea.appendChild(b);
    });

    sayQuestion();
  }

  function sayQuestion() {
    Snd.duck(2600);
    Snd.speak(q.say);
    if (q.sayFollow) Snd.speak(q.sayFollow.text, { queue: true, delay: q.sayFollow.delay });
  }

  function answer(btn, isCorrect) {
    if (locked) return;
    if (isCorrect) {
      locked = true;
      btn.classList.add('correct');
      [...optionsArea.children].forEach(c => { if (c !== btn) c.classList.add('dim'); });
      Snd.sfx.correct();
      Snd.sfx.applause();
      const r = btn.getBoundingClientRect();
      FX.confetti(80, r.left + r.width / 2, r.top + r.height / 2);
      Mascot.flash(gameCat, 'happy', 1800);
      gameCat.classList.add('happy');
      setTimeout(() => gameCat.classList.remove('happy'), 1300);
      Snd.duck(1600);
      Snd.speak(U.pick(PRAISE), { delay: 380 });
      if (firstTry) correctFirst++;
      qi++;
      $('#progressFill').style.width = (qi / G.total * 100) + '%';
      setTimeout(nextQuestion, 2000);
    } else {
      firstTry = false;
      btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      Snd.sfx.wrong();
      Mascot.flash(gameCat, 'oops', 1400);
      Snd.duck(1400);
      Snd.speak(U.pick(ENCOURAGE));
      setTimeout(() => btn.classList.remove('wrong'), 600);
    }
  }

  function finish() {
    const stars = correctFirst >= 9 ? 3 : correctFirst >= 6 ? 2 : 1;
    totalStars += stars; save('alya_stars', totalStars); renderStars();

    $('#rewardTitle').textContent = 'Tebrikler Alya!';
    $('#rewardScore').textContent = `${G.total} sorudan ${correctFirst} tanesini ilk denemede bildin!`;
    const row = $('#starsRow');
    row.innerHTML = '<span class="st">⭐</span><span class="st">⭐</span><span class="st">⭐</span>';
    Mascot.render($('#rewardCat'), 'happy');
    show('reward');

    Snd.sfx.fanfare();
    FX.starRain(34);
    FX.confetti(110, innerWidth / 2, innerHeight * 0.35);
    Snd.duck(3000);
    Snd.speak(`Tebrikler Alya! ${stars === 1 ? 'Bir' : stars === 2 ? 'İki' : 'Üç'} yıldız kazandın!`, { delay: 500 });

    const sts = row.querySelectorAll('.st');
    for (let i = 0; i < stars; i++) {
      setTimeout(() => { sts[i].classList.add('on'); Snd.sfx.star(); }, 700 + i * 520);
    }
  }

  /* ---------- butonlar ---------- */
  $('#backBtn').addEventListener('click', () => { Snd.stopSpeak(); Snd.sfx.tap(); FX.clear(); show('menu'); });
  $('#repeatBtn').addEventListener('click', () => { if (q) sayQuestion(); });
  $('#againBtn').addEventListener('click', () => { Snd.sfx.tap(); FX.clear(); startGame(G.id); });
  $('#homeBtn').addEventListener('click', () => { Snd.stopSpeak(); Snd.sfx.tap(); FX.clear(); show('menu'); });

  /* ---------- açılış ---------- */
  Mascot.render($('#splashCat'), 'happy');
  Mascot.render($('#menuCat'), 'idle');
  buildMenu();
  renderStars();

  $('#startBtn').addEventListener('click', () => {
    Snd.unlock();
    Snd.sfx.star();
    if (musicPref) Snd.musicStart();
    syncMusicBtn();
    show('menu');
    Snd.duck(2200);
    Snd.speak('Merhaba Alya! Hangi oyunu oynamak istersin?', { delay: 350 });
  });

  /* ---------- ekranı uyanık tut ---------- */
  let wl = null;
  async function keepAwake() {
    try { if ('wakeLock' in navigator) wl = await navigator.wakeLock.request('screen'); } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') keepAwake();
    else Snd.stopSpeak();
  });
  $('#startBtn').addEventListener('click', keepAwake, { once: true });

  /* ---------- istenmeyen davranışları engelle ---------- */
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

  /* ---------- service worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
