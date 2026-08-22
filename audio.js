/* ===== Ses motoru: konuşma (Web Speech API) + efektler & müzik (Web Audio API) ===== */
window.Snd = (function () {
  let ctx = null, master = null, musicGain = null, sfxGain = null;
  let musicOn = false, musicTimer = null, musicStep = 0, unlocked = false;
  let trVoice = null, voicesReady = false;

  /* ---------- Konuşma ---------- */
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices() || [];
    if (!vs.length) return;
    voicesReady = true;
    const tr = vs.filter(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith('tr'));
    if (tr.length) {
      // Kadın/çocuk tonuna yakın olanı tercih et
      trVoice = tr.find(v => /female|kadın|yelda|filiz|seda|google/i.test(v.name)) || tr[0];
    } else {
      trVoice = null;
    }
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  /* ---------- Kayıtlı ses klipleri (varsa) + Web Speech yedeği ---------- */
  const CLIP_DIR = 'sesler/';
  const missing = new Set();     // 404 alınan id'ler — bir daha denenmez
  const preloaded = new Map();   // id -> HTMLAudioElement
  let curAudio = null;
  let timers = [];

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function stopVoice() {
    clearTimers();
    try { speechSynthesis.cancel(); } catch (e) {}
    if (curAudio) { try { curAudio.pause(); } catch (e) {} curAudio = null; }
  }

  function speak(text, opts) {
    opts = opts || {};
    if (!('speechSynthesis' in window) || !text) return;
    try {
      if (!opts.keep) speechSynthesis.cancel();
      if (!voicesReady) pickVoice();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = opts.lang || 'tr-TR';
      if (trVoice && u.lang === 'tr-TR') u.voice = trVoice;
      u.rate = opts.rate != null ? opts.rate : 0.92;
      u.pitch = opts.pitch != null ? opts.pitch : 1.05;
      u.volume = 1;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* spec: "düz metin"  |  { id: 'ovgu-1', text: 'Aferin Alya!' }
     Önce sesler/<id>.mp3 aranır; yoksa cihazın konuşma motoruna düşer. */
  function say(spec, opts) {
    opts = opts || {};
    if (!spec) return;
    if (opts.delay) {
      timers.push(setTimeout(() => say(spec, Object.assign({}, opts, { delay: 0 })), opts.delay));
      return;
    }
    if (!opts.keep) stopVoice();

    const id = typeof spec === 'object' ? spec.id : null;
    const text = typeof spec === 'object' ? spec.text : spec;

    if (!id || missing.has(id)) { speak(text, opts); return; }

    let a = preloaded.get(id);
    if (!a) { a = new Audio(CLIP_DIR + id + '.mp3'); a.preload = 'auto'; }
    try { a.currentTime = 0; } catch (e) {}
    curAudio = a;
    let dustu = false;
    // Dosya gerçekten yoksa (404) bir daha denemeyelim
    a.onerror = () => {
      missing.add(id); preloaded.delete(id);
      if (!dustu) { dustu = true; speak(text, opts); }
    };
    // play() reddi genelde geçici (otomatik oynatma politikası) — klibi kalıcı silme
    const pr = a.play();
    if (pr && pr.catch) pr.catch(() => { if (!dustu) { dustu = true; speak(text, opts); } });
  }

  /* Bir sonraki soruların kliplerini sessizce indir */
  function preload(ids) {
    (ids || []).forEach(id => {
      if (!id || missing.has(id) || preloaded.has(id)) return;
      const a = new Audio(CLIP_DIR + id + '.mp3');
      a.preload = 'auto';
      a.onerror = () => { missing.add(id); preloaded.delete(id); };
      preloaded.set(id, a);
    });
  }

  /* ---------- Web Audio kurulumu ---------- */
  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.85; sfxGain.connect(master);
    return ctx;
  }
  function unlock() {
    ensure();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (!unlocked) {
      // iOS için sessiz bir buffer çal
      const b = ctx.createBuffer(1, 1, 22050);
      const s = ctx.createBufferSource(); s.buffer = b; s.connect(master); s.start(0);
      unlocked = true;
    }
  }

  function tone(freq, start, dur, type, vol, dest) {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, ctx.currentTime + start);
    g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    o.connect(g); g.connect(dest || sfxGain);
    o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + 0.05);
  }

  function noiseBurst(start, dur, vol, freq, q) {
    if (!ctx) return;
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
    bp.frequency.value = freq || 1800; bp.Q.value = q || 0.9;
    const g = ctx.createGain(); g.gain.value = vol;
    src.connect(bp); bp.connect(g); g.connect(sfxGain);
    src.start(ctx.currentTime + start);
  }

  /* ---------- Efektler ---------- */
  const SFX = {
    tap() { unlock(); tone(880, 0, 0.08, 'triangle', 0.16); },
    correct() {
      unlock();
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.085, 0.28, 'triangle', 0.22));
      tone(1567.98, 0.36, 0.5, 'sine', 0.12);
    },
    wrong() {
      unlock();
      tone(392, 0, 0.16, 'sine', 0.16);
      tone(311, 0.14, 0.26, 'sine', 0.14);
    },
    applause() {
      unlock();
      if (!ctx) return;
      for (let i = 0; i < 34; i++) {
        const t = Math.random() * 1.15;
        noiseBurst(t, 0.07 + Math.random() * 0.05, 0.10 + Math.random() * 0.07,
                   1200 + Math.random() * 2400, 0.7 + Math.random());
      }
      noiseBurst(0, 1.3, 0.05, 900, 0.5);
    },
    star() {
      unlock();
      [1046.5, 1318.5, 1567.9, 2093].forEach((f, i) => tone(f, i * 0.07, 0.34, 'sine', 0.16));
    },
    fanfare() {
      unlock();
      const seq = [[523.25, 0], [523.25, .14], [523.25, .28], [659.25, .44], [783.99, .62], [1046.5, .8]];
      seq.forEach(([f, t]) => { tone(f, t, 0.35, 'square', 0.10); tone(f, t, 0.4, 'triangle', 0.16); });
    },
    whoosh() { unlock(); noiseBurst(0, 0.3, 0.06, 700, 0.6); }
  };

  /* ---------- Arka plan müziği (basit, döngüsel, yumuşak) ---------- */
  // C majör pentatonik, neşeli ninni hissi
  const MELODY = [
    523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 659.25, 523.25,
    587.33, 698.46, 880.00, 698.46, 659.25, 587.33, 523.25, 0
  ];
  const BASS = [130.81, 0, 174.61, 0, 196.00, 0, 174.61, 0,
                130.81, 0, 174.61, 0, 196.00, 0, 130.81, 0];

  function musicTick() {
    if (!musicOn || !ctx) return;
    const i = musicStep % MELODY.length;
    const f = MELODY[i];
    if (f) {
      const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2200;
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.30, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.42);
      o.connect(lp); lp.connect(g); g.connect(musicGain);
      o.start(); o.stop(ctx.currentTime + 0.5);
    }
    const bf = BASS[i];
    if (bf) {
      const o2 = ctx.createOscillator(), g2 = ctx.createGain();
      o2.type = 'sine'; o2.frequency.value = bf;
      g2.gain.setValueAtTime(0.0001, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.26, ctx.currentTime + 0.06);
      g2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);
      o2.connect(g2); g2.connect(musicGain);
      o2.start(); o2.stop(ctx.currentTime + 0.85);
    }
    musicStep++;
  }

  function musicStart() {
    unlock(); if (!ctx) return;
    musicOn = true;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setTargetAtTime(0.16, ctx.currentTime, 0.4);
    if (!musicTimer) musicTimer = setInterval(musicTick, 430);
  }
  function musicStop() {
    musicOn = false;
    if (ctx) { musicGain.gain.cancelScheduledValues(ctx.currentTime); musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.25); }
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  }
  function musicToggle() { musicOn ? musicStop() : musicStart(); return musicOn; }

  /* Konuşurken müziği kıs */
  function duck(ms) {
    if (!ctx || !musicOn) return;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setTargetAtTime(0.05, ctx.currentTime, 0.12);
    setTimeout(() => {
      if (musicOn && ctx) musicGain.gain.setTargetAtTime(0.16, ctx.currentTime, 0.3);
    }, ms || 1600);
  }

  return {
    unlock, say, speak, preload,
    stopSpeak: stopVoice, stopVoice, sfx: SFX,
    musicStart, musicStop, musicToggle, duck,
    get musicOn() { return musicOn; }
  };
})();
