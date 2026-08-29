/* ===== Müzik ve Ritim — Toca Band modeli =====
   Sahnede 3 sıra podyum var. Kenarda müzisyen karakterler duruyor.
   Çocuk karakteri podyuma sürükler, karakter kendi döngüsünü
   çalmaya başlar. Bütün döngüler aynı tempoda ve aynı gamda
   yazıldığı için KÖTÜ SES ÇIKARMAK İMKÂNSIZ — çocuk hiçbir müzik
   bilgisi olmadan "beste yapıyorum" hisseder.

   Ön sıra kısık, arka sıra coşkulu çalar.
   Ortadaki yıldız podyum SOLO yeridir: oradaki karakter otomatik
   çalmaz, çocuk dokundukça çalar.                                 */
window.GameMuzik = (function () {

  const BPM = 96;
  const OLCU = (60 / BPM) * 4 * 1000;      // bir ölçü (ms)

  /* pentatonik — hangi kombinasyon çalarsa çalsın uyumlu */
  const N = { do: 261.63, re: 293.66, mi: 329.63, sol: 392.00, la: 440.00,
              do2: 523.25, re2: 587.33, mi2: 659.25, sol1: 196.00, la1: 220.00 };

  const KARAKTER = [
    { id: 'mz-davul',  ad: 'Davul',    e: '🥁', renk: '#FF4757', tip: 'vurmali',
      desen: [1, 0, 0, 0, 1, 0, 1, 0], hz: 90 },
    { id: 'mz-tef',    ad: 'Tef',      e: '🪘', renk: '#FF8A00', tip: 'vurmali',
      desen: [0, 0, 1, 0, 0, 0, 1, 0], hz: 190 },
    { id: 'mz-zil',    ad: 'Zil',      e: '🔔', renk: '#FFC800', tip: 'vurmali',
      desen: [0, 1, 0, 1, 0, 1, 0, 1], hz: 1400 },
    { id: 'mz-baglama',ad: 'Bağlama',  e: '🪕', renk: '#22C55E', tip: 'ezgi',
      desen: [N.do, 0, N.mi, 0, N.sol, 0, N.mi, 0] },
    { id: 'mz-flut',   ad: 'Flüt',     e: '🎶', renk: '#2E86FF', tip: 'ezgi',
      desen: [N.sol, 0, 0, N.la, 0, N.do2, 0, 0] },
    { id: 'mz-piyano', ad: 'Piyano',   e: '🎹', renk: '#8B5CF6', tip: 'ezgi',
      desen: [N.do2, N.sol, 0, N.mi, 0, N.re, 0, N.do] },
    { id: 'mz-bas',    ad: 'Bas',      e: '🎸', renk: '#12C2C2', tip: 'ezgi',
      desen: [N.sol1, 0, 0, 0, N.la1, 0, 0, 0] },
    { id: 'mz-alkis',  ad: 'Alkış',    e: '👏', renk: '#FF5FA2', tip: 'vurmali',
      desen: [0, 0, 0, 0, 1, 0, 0, 0], hz: 500 }
  ];

  /* 3 sıra × 3 slot; orta sıranın ortası SOLO */
  const SLOTLAR = [
    { id: 's0', sira: 0, ses: 1.00 }, { id: 's1', sira: 0, ses: 1.00 }, { id: 's2', sira: 0, ses: 1.00 },
    { id: 's3', sira: 1, ses: 0.75 }, { id: 'solo', sira: 1, ses: 1.00, solo: true }, { id: 's5', sira: 1, ses: 0.75 },
    { id: 's6', sira: 2, ses: 0.55 }, { id: 's7', sira: 2, ses: 0.55 }, { id: 's8', sira: 2, ses: 0.55 }
  ];

  let ctx = null, ac = null, dolu = {}, dongu = null, adim = 0, calan = 0;

  function sesAc() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (ac && ac.state === 'suspended') ac.resume();
    return ac;
  }

  function nota(hz, sure, guc, tip) {
    const a = sesAc(); if (!a) return;
    const t0 = a.currentTime;
    const g = a.createGain();
    g.connect(a.destination);
    if (tip === 'vurmali' && hz > 800) {
      // zil: kısa gürültü
      const bl = a.createBuffer(1, a.sampleRate * 0.12, a.sampleRate);
      const d = bl.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const src = a.createBufferSource(); src.buffer = bl;
      g.gain.setValueAtTime(0.16 * guc, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
      src.connect(g); src.start(t0);
      return;
    }
    const o = a.createOscillator();
    o.type = tip === 'vurmali' ? 'sine' : 'triangle';
    o.frequency.setValueAtTime(hz, t0);
    if (tip === 'vurmali') o.frequency.exponentialRampToValueAtTime(Math.max(40, hz * 0.5), t0 + 0.12);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime((tip === 'vurmali' ? 0.30 : 0.16) * guc, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (sure || 0.3));
    o.connect(g); o.start(t0); o.stop(t0 + (sure || 0.3) + 0.05);
  }

  function mount(c) {
    ctx = c; dolu = {}; adim = 0; calan = 0;
    ctx.options.className = 'options-area muzik';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say({ id: 'sys-oyun-muzik', text: 'Müzisyenleri sahneye taşı, kendi şarkını yap!' });
    ctx.duck(3400);
    setTimeout(kur, 300);
  }

  function kur() {
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">Müzisyeni sahneye bırak!</div></div>`;
    ctx.options.innerHTML = `
      <div class="mz-sahne" id="mzSahne">
        ${[0, 1, 2].map(s => `<div class="mz-sira s${s}">${
          SLOTLAR.filter(x => x.sira === s).map(x =>
            `<div class="mz-slot${x.solo ? ' solo' : ''}" data-id="${x.id}">
               <span class="mz-slot-ic">${x.solo ? '⭐' : ''}</span></div>`).join('')
        }</div>`).join('')}
      </div>
      <div class="mz-raf" id="mzRaf"></div>`;

    const raf = ctx.options.querySelector('#mzRaf');
    KARAKTER.forEach(k => {
      const b = document.createElement('div');
      b.className = 'mz-kar';
      b.style.setProperty('--kr', k.renk);
      b.dataset.id = k.id;
      b.innerHTML = `<span class="mz-kar-e">${k.e}</span>`;
      karBagla(b, k);
      raf.appendChild(b);
    });

    baslatDongu();
    ctx.setProgress(0, 6);
  }

  function karBagla(b, k) {
    Surukle.bagla(b, {
      veri: k,
      hayaletHtml: `<span class="hayalet-e">${k.e}</span>`,
      tutuldu: () => { sesAc(); ctx.duck(1400); Snd.say({ id: k.id, text: k.ad }); },
      tekDokunus: () => {
        // dokununca ilk boş slota koy
        const bos = SLOTLAR.find(s => !dolu[s.id]);
        if (bos) yerlestir(k, bos.id);
        else { ctx.duck(1400); Snd.say({ id: k.id, text: k.ad }); }
      },
      hedefSec: (x, y) => {
        const h = Surukle.hedefBul(ctx.options, '.mz-slot', x, y);
        [...ctx.options.querySelectorAll('.mz-slot')].forEach(s =>
          s.classList.toggle('aktif', s === h));
      },
      birakildi: (v, x, y) => {
        [...ctx.options.querySelectorAll('.mz-slot')].forEach(s => s.classList.remove('aktif'));
        const h = Surukle.hedefBul(ctx.options, '.mz-slot', x, y);
        if (h) yerlestir(k, h.dataset.id);
      }
    });
  }

  function yerlestir(k, slotId) {
    const slot = ctx.options.querySelector(`.mz-slot[data-id="${slotId}"]`);
    const bilgi = SLOTLAR.find(s => s.id === slotId);
    if (!slot || !bilgi) return;
    // aynı karakter başka slottaysa oradan kaldır
    Object.keys(dolu).forEach(sid => { if (dolu[sid] && dolu[sid].id === k.id) bosalt(sid); });

    dolu[slotId] = k;
    slot.classList.add('dolu');
    slot.style.setProperty('--kr', k.renk);
    slot.innerHTML = `<span class="mz-slot-e">${k.e}</span>` +
                     (bilgi.solo ? '<span class="mz-solo-rozet">⭐</span>' : '');
    slot.onclick = () => {
      if (bilgi.solo) soloCal(k, slot);
      else { bosalt(slotId); }
    };
    Snd.sfx.tap();
    calan = Object.keys(dolu).length;
    ctx.setProgress(Math.min(calan, 6), 6);
    if (calan >= 6) setTimeout(bitir, 4000);
  }

  function bosalt(slotId) {
    const slot = ctx.options.querySelector(`.mz-slot[data-id="${slotId}"]`);
    const bilgi = SLOTLAR.find(s => s.id === slotId);
    delete dolu[slotId];
    if (slot) {
      slot.classList.remove('dolu');
      slot.innerHTML = `<span class="mz-slot-ic">${bilgi && bilgi.solo ? '⭐' : ''}</span>`;
      slot.onclick = null;
    }
    calan = Object.keys(dolu).length;
  }

  function soloCal(k, slot) {
    slot.classList.add('calan');
    setTimeout(() => slot.classList.remove('calan'), 220);
    const d = k.desen.filter(x => x);
    const v = d[Math.floor(Math.random() * d.length)] || 440;
    nota(k.tip === 'vurmali' ? (k.hz || 200) : v, 0.34, 1, k.tip);
  }

  function baslatDongu() {
    clearInterval(dongu);
    const adimSure = OLCU / 8;
    dongu = setInterval(() => {
      adim = (adim + 1) % 8;
      SLOTLAR.forEach(s => {
        const k = dolu[s.id];
        if (!k || s.solo) return;                 // solo otomatik çalmaz
        const v = k.desen[adim];
        if (!v) return;
        nota(k.tip === 'vurmali' ? (k.hz || 200) : v, k.tip === 'vurmali' ? 0.16 : 0.34,
             s.ses, k.tip);
        const el = ctx.options.querySelector(`.mz-slot[data-id="${s.id}"]`);
        if (el) { el.classList.add('calan'); setTimeout(() => el.classList.remove('calan'), 140); }
      });
      const nb = ctx.options.querySelector('.mz-sahne');
      if (nb && adim % 2 === 0) { nb.classList.add('vurus'); setTimeout(() => nb.classList.remove('vurus'), 120); }
    }, adimSure);
  }

  function bitir() {
    clearInterval(dongu);
    ctx.options.className = 'options-area';
    ctx.finish(3, 'Kendi şarkını yaptın, harikaydı!');
  }

  return {
    id: 'muzik', title: 'Müzik<br>ve Ritim', emoji: '🥁', mode: 'custom',
    intro: { id: 'sys-oyun-muzik', text: 'Müzisyenleri sahneye taşı, kendi şarkını yap!' },
    mount
  };
})();
