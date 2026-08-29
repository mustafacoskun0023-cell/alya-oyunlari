/* ===== Yaratıcılık: Boyama, Serbest Çizim, Müzik, İlahi ===== */

/* ---------- Ortak: parmakla çizim tuvali ---------- */
function TuvalKur(el, opt) {
  const cv = document.createElement('canvas');
  cv.className = 'tuval';
  el.appendChild(cv);
  const cx = cv.getContext('2d');
  let ciziyor = false, sonX = 0, sonY = 0, renk = opt.renk || '#FF4757', kalinlik = opt.kalinlik || 18;
  let doldu = false;

  function boyutla() {
    const r = el.getBoundingClientRect();
    const kaydet = cv.width ? cx.getImageData(0, 0, cv.width, cv.height) : null;
    cv.width = Math.max(1, Math.floor(r.width));
    cv.height = Math.max(1, Math.floor(r.height));
    cx.lineCap = 'round'; cx.lineJoin = 'round';
    if (kaydet) { try { cx.putImageData(kaydet, 0, 0); } catch (e) {} }
    if (opt.arkaPlan) opt.arkaPlan(cx, cv);
  }
  const ro = new ResizeObserver(boyutla);
  ro.observe(el);
  boyutla();

  function nokta(ev) {
    const r = cv.getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top];
  }
  cv.addEventListener('pointerdown', e => {
    cv.setPointerCapture(e.pointerId);
    ciziyor = true;
    [sonX, sonY] = nokta(e);
    cx.strokeStyle = renk; cx.lineWidth = kalinlik;
    cx.beginPath(); cx.moveTo(sonX, sonY); cx.lineTo(sonX + .1, sonY + .1); cx.stroke();
    if (!doldu) { doldu = true; opt.ilkDokunus && opt.ilkDokunus(); }
    opt.cizdi && opt.cizdi();
  });
  cv.addEventListener('pointermove', e => {
    if (!ciziyor) return;
    const [x, y] = nokta(e);
    cx.strokeStyle = renk; cx.lineWidth = kalinlik;
    cx.beginPath(); cx.moveTo(sonX, sonY); cx.lineTo(x, y); cx.stroke();
    sonX = x; sonY = y;
    opt.cizdi && opt.cizdi();
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t =>
    cv.addEventListener(t, () => { ciziyor = false; }));

  return {
    renkSec(r) { renk = r; },
    kalinlikSec(k) { kalinlik = k; },
    temizle() {
      cx.clearRect(0, 0, cv.width, cv.height);
      if (opt.arkaPlan) opt.arkaPlan(cx, cv);
    },
    kapat() { ro.disconnect(); },
    get doldu() { return doldu; }
  };
}

const BOYA_RENK = [
  { ad: 'Kırmızı', hex: '#FF4757' }, { ad: 'Turuncu', hex: '#FF8A00' },
  { ad: 'Sarı',    hex: '#FFC800' }, { ad: 'Yeşil',   hex: '#22C55E' },
  { ad: 'Mavi',    hex: '#2E86FF' }, { ad: 'Mor',     hex: '#8B5CF6' },
  { ad: 'Pembe',   hex: '#FF5FA2' }, { ad: 'Kahve',   hex: '#8B5E34' },
  { ad: 'Siyah',   hex: '#2B1B54' }
];

function renkPaleti(tuval, ilkHex) {
  const bar = document.createElement('div');
  bar.className = 'boya-bar';
  BOYA_RENK.forEach(r => {
    const b = document.createElement('button');
    b.className = 'boya-renk' + (r.hex === ilkHex ? ' secili' : '');
    b.style.background = r.hex;
    b.setAttribute('aria-label', r.ad);
    b.addEventListener('click', () => {
      tuval.renkSec(r.hex);
      Snd.sfx.tap();
      [...bar.querySelectorAll('.boya-renk')].forEach(x => x.classList.remove('secili'));
      b.classList.add('secili');
    });
    bar.appendChild(b);
  });
  return bar;
}

/* ---------- 1) Boyama Kitabı ---------- */
window.GameBoyama = (function () {
  // Basit, kalın konturlu şekiller — çocuk içini boyar
  const SEKILLER = [
    { ad: 'Kalp',    id: 'boy-kalp',
      ciz: (c, w, h) => { const s = Math.min(w, h) * .34, x = w / 2, y = h / 2;
        c.beginPath();
        c.moveTo(x, y + s * .8);
        c.bezierCurveTo(x - s * 1.5, y - s * .3, x - s * .5, y - s * 1.2, x, y - s * .35);
        c.bezierCurveTo(x + s * .5, y - s * 1.2, x + s * 1.5, y - s * .3, x, y + s * .8);
        c.closePath(); c.stroke(); } },
    { ad: 'Yıldız',  id: 'boy-yildiz',
      ciz: (c, w, h) => { const R = Math.min(w, h) * .38, x = w / 2, y = h / 2;
        c.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 ? R * .45 : R, a = -Math.PI / 2 + i * Math.PI / 5;
          c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r);
        }
        c.closePath(); c.stroke(); } },
    { ad: 'Ev',      id: 'boy-ev',
      ciz: (c, w, h) => { const s = Math.min(w, h) * .3, x = w / 2, y = h / 2;
        c.beginPath();
        c.rect(x - s, y - s * .2, s * 2, s * 1.3);
        c.moveTo(x - s * 1.25, y - s * .2); c.lineTo(x, y - s * 1.15); c.lineTo(x + s * 1.25, y - s * .2);
        c.moveTo(x - s * .3, y + s * 1.1); c.lineTo(x - s * .3, y + s * .35);
        c.lineTo(x + s * .3, y + s * .35); c.lineTo(x + s * .3, y + s * 1.1);
        c.stroke(); } },
    { ad: 'Çiçek',   id: 'boy-cicek',
      ciz: (c, w, h) => { const s = Math.min(w, h) * .13, x = w / 2, y = h / 2 - s;
        for (let i = 0; i < 6; i++) {
          const a = i * Math.PI / 3;
          c.beginPath(); c.arc(x + Math.cos(a) * s * 1.35, y + Math.sin(a) * s * 1.35, s, 0, 7); c.stroke();
        }
        c.beginPath(); c.arc(x, y, s * .75, 0, 7); c.stroke();
        c.beginPath(); c.moveTo(x, y + s * 2.2); c.lineTo(x, y + s * 5); c.stroke(); } },
    { ad: 'Balık',   id: 'boy-balik',
      ciz: (c, w, h) => { const s = Math.min(w, h) * .3, x = w / 2, y = h / 2;
        c.beginPath(); c.ellipse(x, y, s, s * .62, 0, 0, 7); c.stroke();
        c.beginPath(); c.moveTo(x + s * .9, y); c.lineTo(x + s * 1.6, y - s * .55);
        c.lineTo(x + s * 1.6, y + s * .55); c.closePath(); c.stroke();
        c.beginPath(); c.arc(x - s * .48, y - s * .16, s * .1, 0, 7); c.stroke(); } },
    { ad: 'Kelebek', id: 'boy-kelebek',
      ciz: (c, w, h) => { const s = Math.min(w, h) * .2, x = w / 2, y = h / 2;
        c.beginPath(); c.ellipse(x - s * .95, y - s * .4, s * .8, s * .62, -.4, 0, 7); c.stroke();
        c.beginPath(); c.ellipse(x + s * .95, y - s * .4, s * .8, s * .62, .4, 0, 7); c.stroke();
        c.beginPath(); c.ellipse(x - s * .8, y + s * .75, s * .6, s * .5, .4, 0, 7); c.stroke();
        c.beginPath(); c.ellipse(x + s * .8, y + s * .75, s * .6, s * .5, -.4, 0, 7); c.stroke();
        c.beginPath(); c.ellipse(x, y + s * .1, s * .17, s * 1.15, 0, 0, 7); c.stroke(); } }
  ];

  let ctx = null, tuval = null, si = 0, bitti = 0;

  function mount(c) {
    ctx = c; si = 0; bitti = 0;
    ctx.say({ id: 'sys-oyun-boyama', text: 'Şekilleri istediğin renklerle boyayalım!' });
    ctx.duck(2400);
    setTimeout(kur, 300);
  }

  function kur() {
    const s = SEKILLER[si];
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">${s.ad}</div></div>`;
    ctx.options.className = 'options-area tuval-alan';
    ctx.options.style.gridTemplateColumns = '1fr';
    ctx.options.innerHTML = '';

    const kutu = document.createElement('div');
    kutu.className = 'tuval-kutu';
    ctx.options.appendChild(kutu);

    if (tuval) tuval.kapat();
    tuval = TuvalKur(kutu, {
      renk: BOYA_RENK[0].hex, kalinlik: 26,
      arkaPlan: (cx, cv) => {
        cx.save();
        cx.strokeStyle = '#2B1B54'; cx.lineWidth = Math.max(5, Math.min(cv.width, cv.height) * .022);
        cx.lineJoin = 'round'; cx.lineCap = 'round';
        s.ciz(cx, cv.width, cv.height);
        cx.restore();
      },
      ilkDokunus: () => Snd.sfx.tap()
    });

    const alt = document.createElement('div');
    alt.className = 'tuval-arac';
    alt.appendChild(renkPaleti(tuval, BOYA_RENK[0].hex));

    const temizle = document.createElement('button');
    temizle.className = 'pill-btn blue kucuk';
    temizle.textContent = '🧽 Temizle';
    temizle.addEventListener('click', () => { Snd.sfx.tap(); tuval.temizle(); });

    const tamam = document.createElement('button');
    tamam.className = 'pill-btn green kucuk';
    tamam.textContent = '✅ Bitti';
    tamam.addEventListener('click', () => {
      Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
      const r = kutu.getBoundingClientRect();
      FX.confetti(80, r.left + r.width / 2, r.top + r.height / 2);
      ctx.duck(1800);
      ctx.say(U.pick([
        { id: 'ovgu-1', text: 'Aferin Alya!' }, { id: 'ovgu-2', text: 'Harikasın!' },
        { id: 'ovgu-3', text: 'Çok güzel!' }
      ]));
      bitti++;
      ctx.setProgress(bitti, SEKILLER.length);
      setTimeout(sonraki, 1500);
    });

    const btnler = document.createElement('div');
    btnler.className = 'tuval-btnler';
    btnler.appendChild(temizle); btnler.appendChild(tamam);
    alt.appendChild(btnler);
    ctx.options.appendChild(alt);

    ctx.setProgress(bitti, SEKILLER.length);
    ctx.duck(1400);
    ctx.say({ id: 'boy-' + s.id, text: s.ad + ' boyayalım!' });
  }

  function sonraki() {
    si++;
    if (si >= SEKILLER.length) {
      if (tuval) { tuval.kapat(); tuval = null; }
      ctx.options.className = 'options-area';
      ctx.finish(3, `${SEKILLER.length} resmi de boyadın!`);
      return;
    }
    Snd.sfx.star();
    setTimeout(kur, 600);
  }

  return {
    id: 'boyama', title: 'Boyama<br>Kitabı', emoji: '🖍️', mode: 'custom',
    intro: { id: 'sys-oyun-boyama', text: 'Şekilleri istediğin renklerle boyayalım!' },
    mount
  };
})();

/* ---------- 2) Serbest Çizim ---------- */
window.GameCizim = (function () {
  let ctx = null, tuval = null, kaydedilen = 0;

  function mount(c) {
    ctx = c; kaydedilen = 0;
    ctx.say({ id: 'sys-oyun-cizim', text: 'Ne istersen çizebilirsin! Hadi başlayalım.' });
    ctx.duck(2600);
    setTimeout(kur, 300);
  }

  function kur() {
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">Ne çizmek istersin?</div></div>`;
    ctx.options.className = 'options-area tuval-alan';
    ctx.options.style.gridTemplateColumns = '1fr';
    ctx.options.innerHTML = '';

    const kutu = document.createElement('div');
    kutu.className = 'tuval-kutu beyaz';
    ctx.options.appendChild(kutu);

    tuval = TuvalKur(kutu, { renk: BOYA_RENK[4].hex, kalinlik: 14, ilkDokunus: () => Snd.sfx.tap() });

    const alt = document.createElement('div');
    alt.className = 'tuval-arac';
    alt.appendChild(renkPaleti(tuval, BOYA_RENK[4].hex));

    const kalinBar = document.createElement('div');
    kalinBar.className = 'kalinlik-bar';
    [8, 16, 30].forEach((k, i) => {
      const b = document.createElement('button');
      b.className = 'kalinlik' + (i === 1 ? ' secili' : '');
      b.innerHTML = `<span style="width:${k}px;height:${k}px"></span>`;
      b.addEventListener('click', () => {
        tuval.kalinlikSec(k); Snd.sfx.tap();
        [...kalinBar.children].forEach(x => x.classList.remove('secili'));
        b.classList.add('secili');
      });
      kalinBar.appendChild(b);
    });

    const temizle = document.createElement('button');
    temizle.className = 'pill-btn blue kucuk';
    temizle.textContent = '🧽 Yeni sayfa';
    temizle.addEventListener('click', () => { Snd.sfx.tap(); tuval.temizle(); });

    const tamam = document.createElement('button');
    tamam.className = 'pill-btn green kucuk';
    tamam.textContent = '✅ Bitti';
    tamam.addEventListener('click', () => {
      Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
      const r = kutu.getBoundingClientRect();
      FX.confetti(80, r.left + r.width / 2, r.top + r.height / 2);
      kaydedilen++;
      ctx.setProgress(kaydedilen, 3);
      ctx.duck(1800);
      ctx.say(U.pick([
        { id: 'ovgu-2', text: 'Harikasın!' }, { id: 'ovgu-4', text: 'Bravo!' },
        { id: 'ovgu-6', text: 'Mükemmel!' }
      ]));
      if (kaydedilen >= 3) {
        setTimeout(() => {
          if (tuval) { tuval.kapat(); tuval = null; }
          ctx.options.className = 'options-area';
          ctx.finish(3, 'Üç güzel resim çizdin!');
        }, 1600);
      } else {
        setTimeout(() => tuval.temizle(), 1500);
      }
    });

    const btnler = document.createElement('div');
    btnler.className = 'tuval-btnler';
    btnler.appendChild(kalinBar);
    btnler.appendChild(temizle); btnler.appendChild(tamam);
    alt.appendChild(btnler);
    ctx.options.appendChild(alt);
    ctx.setProgress(0, 3);
  }

  return {
    id: 'cizim', title: 'Serbest<br>Çizim', emoji: '✏️', mode: 'custom',
    intro: { id: 'sys-oyun-cizim', text: 'Ne istersen çizebilirsin!' },
    mount
  };
})();

/* ---------- 4) İlahi ve Şarkılar — melodiyi tanı ---------- */
window.GameIlahi = (function () {
  // Basit, tanınabilir melodiler (nota frekans dizileri)
  const N = { do: 261.63, re: 293.66, mi: 329.63, fa: 349.23, sol: 392, la: 440, si: 493.88, do2: 523.25 };
  const PARCALAR = [
    { ad: 'Daha Dün Annemizin', e: '👶', id: 'ilh-dahadun',
      nota: ['do','do','sol','sol','la','la','sol'] },
    { ad: 'Mini Mini Bir Kuş', e: '🐦', id: 'ilh-minimini',
      nota: ['mi','re','do','re','mi','mi','mi'] },
    { ad: 'Portakalı Soydum',  e: '🍊', id: 'ilh-portakal',
      nota: ['sol','sol','la','sol','fa','mi','re'] },
    { ad: 'Bir Şişe Su',       e: '💧', id: 'ilh-sise',
      nota: ['do','re','mi','fa','sol','fa','mi'] },
    { ad: 'Ali Baba’nın Çiftliği', e: '🐄', id: 'ilh-alibaba',
      nota: ['sol','sol','sol','re','mi','mi','re'] },
    { ad: 'İyi ki Doğdun',     e: '🎂', id: 'ilh-dogumgunu',
      nota: ['do','do','re','do','fa','mi'] }
  ];

  let ctx = null, sira = [], qi = 0, dogru = 0, ac = null;

  function ses(hz, gecikme, sure) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = ac.currentTime + (gecikme || 0);
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.value = hz;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.28, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + (sure || 0.42));
      o.connect(g); g.connect(ac.destination);
      o.start(t0); o.stop(t0 + (sure || 0.42) + 0.05);
    } catch (e) {}
  }

  function melodiCal(p) {
    p.nota.forEach((n, i) => ses(N[n], i * 0.46));
    return p.nota.length * 460 + 300;
  }

  function mount(c) {
    ctx = c; qi = 0; dogru = 0;
    sira = U.shuffle(PARCALAR);
    ctx.say({ id: 'sys-oyun-ilahi', text: 'Melodiyi dinle, hangi şarkı olduğunu bul!' });
    ctx.duck(3000);
    setTimeout(soru, 300);
  }

  function soru() {
    if (qi >= sira.length) {
      const yildiz = dogru >= sira.length ? 3 : dogru >= sira.length - 1 ? 2 : 1;
      ctx.options.className = 'options-area';
      ctx.finish(yildiz, 'Bütün şarkıları tanıdın!');
      return;
    }
    const t = sira[qi];
    const digerleri = U.sample(PARCALAR.filter(x => x.id !== t.id), 2);
    const secenekler = U.shuffle([
      { p: t, correct: true }, { p: digerleri[0], correct: false }, { p: digerleri[1], correct: false }
    ]);

    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="prompt-bubble"><div class="durum-emoji">🎵</div></div>
        <div class="prompt-q">Hangi şarkı bu?</div>
      </div>`;
    ctx.setProgress(qi, sira.length);
    ctx.options.className = 'options-area';
    ctx.options.style.gridTemplateColumns = 'repeat(3,1fr)';
    ctx.options.innerHTML = '';

    let kilit = false;
    const btnler = [];
    secenekler.forEach(o => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.innerHTML = `<span class="davranis"><span class="davranis-e">${o.p.e}</span>
                       <span class="davranis-t">${o.p.ad}</span></span><span class="opt-check">✅</span>`;
      b.addEventListener('click', () => {
        if (kilit) return;
        if (o.correct) {
          kilit = true; dogru++;
          b.classList.add('correct');
          btnler.forEach(x => { if (x !== b) x.classList.add('dim'); });
          Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
          const r = b.getBoundingClientRect();
          FX.confetti(70, r.left + r.width / 2, r.top + r.height / 2);
          ctx.duck(2600);
          ctx.say({ id: t.id, text: t.ad }, { delay: 600 });
          qi++;
          setTimeout(soru, 2600);
        } else {
          b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
          Snd.sfx.wrong(); ctx.oops();
          setTimeout(() => b.classList.remove('wrong'), 600);
        }
      });
      btnler.push(b);
      ctx.options.appendChild(b);
    });

    // önce melodiyi çal, sonra kartları tanıt
    const sure = melodiCal(t);
    ctx.duck(sure + secenekler.length * 1300);
    secenekler.forEach((o, i) => {
      setTimeout(() => {
        const b = btnler[i];
        b.classList.add('tanit');
        Snd.say({ id: o.p.id, text: o.p.ad }, { keep: i > 0 });
        setTimeout(() => b.classList.remove('tanit'), 900);
      }, sure + i * 1300);
    });

    // tekrar dinleme düğmesi
    const tekrar = document.createElement('button');
    tekrar.className = 'melodi-tekrar';
    tekrar.innerHTML = '🔁 Tekrar çal';
    tekrar.addEventListener('click', () => { Snd.sfx.tap(); melodiCal(t); });
    ctx.prompt.querySelector('.prompt-side').appendChild(tekrar);
  }

  return {
    id: 'ilahi', title: 'İlahi ve<br>Şarkılar', emoji: '🎶', mode: 'custom',
    intro: { id: 'sys-oyun-ilahi', text: 'Melodiyi dinle, hangi şarkı olduğunu bul!' },
    mount
  };
})();
