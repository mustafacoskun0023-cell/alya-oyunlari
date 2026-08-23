/* ===== Hikaye motoru =====
   Sahne sahne anlatılır, çocuk "devam" der gibi büyük butona dokunur.
   Sonunda hikayeyle ilgili bir soru sorulur. Okuma gerekmez —
   her sahne seslendirilir, büyük bir görselle desteklenir. */
window.HikayeMotoru = function (cfg) {
  let ctx = null, hi = 0, sahne = 0, dogru = 0, hikayeler = [];
  const TOPLAM = cfg.hikayeler.length;

  function mount(c) {
    ctx = c; hi = 0; dogru = 0;
    hikayeler = U.shuffle(cfg.hikayeler).slice(0, TOPLAM);
    ctx.say(cfg.intro); ctx.duck(2400);
    setTimeout(hikayeBasla, 2500);
  }

  function hikayeBasla() {
    sahne = 0;
    ctx.options.className = 'options-area hikaye-alt';
    ctx.options.style.gridTemplateColumns = '1fr';
    sahneGoster();
  }

  function sahneGoster() {
    const h = hikayeler[hi];
    const s = h.sahneler[sahne];
    ctx.prompt.innerHTML = `
      <div class="hikaye-sahne">
        <div class="hikaye-gorsel">${s.e}</div>
        <div class="hikaye-metin">${s.t}</div>
        <div class="hikaye-noktalar">${
          h.sahneler.map((_, i) => `<span class="hn ${i <= sahne ? 'dolu' : ''}"></span>`).join('')
        }</div>
      </div>`;
    ctx.duck(1000 + s.t.length * 80);
    ctx.say({ id: h.id + '-s' + (sahne + 1), text: s.t });
    ctx.setProgress(hi, TOPLAM);

    ctx.options.innerHTML = '';
    const b = document.createElement('button');
    b.className = 'opt devam-btn';
    b.innerHTML = '<span class="devam-e">▶️</span><span class="devam-t">Devam</span>';
    b.addEventListener('click', () => {
      Snd.sfx.tap();
      sahne++;
      if (sahne < h.sahneler.length) sahneGoster();
      else soruGoster();
    });
    ctx.options.appendChild(b);
  }

  function soruGoster() {
    const h = hikayeler[hi];
    const secenekler = U.shuffle([
      { s: h.soru.dogru, correct: true },
      { s: h.soru.yanlis, correct: false }
    ]);
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="prompt-bubble"><div class="durum-emoji">❓</div></div>
        <div class="prompt-q">${h.soru.metin}</div>
      </div>`;
    ctx.duck(2600);
    ctx.say({ id: h.id + '-soru', text: h.soru.metin });

    ctx.options.className = 'options-area';
    ctx.options.style.gridTemplateColumns = 'repeat(2,1fr)';
    ctx.options.innerHTML = '';
    let kilit = false;
    const btnler = [];
    secenekler.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.innerHTML = `<span class="davranis"><span class="davranis-e">${o.s.e}</span>
                       <span class="davranis-t">${o.s.t}</span></span><span class="opt-check">✅</span>`;
      b.addEventListener('click', () => {
        if (kilit) return;
        tanitDur();
        if (o.correct) {
          kilit = true; dogru++;
          b.classList.add('correct');
          btnler.forEach(x => { if (x !== b) x.classList.add('dim'); });
          Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
          const r = b.getBoundingClientRect();
          FX.confetti(70, r.left + r.width / 2, r.top + r.height / 2);
          ctx.duck(5200);
          ctx.say({ id: h.id + '-ders', text: h.ders }, { delay: 900 });
          const kutu = document.createElement('div');
          kutu.className = 'aciklama-balon';
          kutu.textContent = h.ders;
          ctx.prompt.appendChild(kutu);
          requestAnimationFrame(() => kutu.classList.add('gorun'));
          setTimeout(sonraki, Math.min(1600 + h.ders.length * 82, 8000));
        } else {
          b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
          Snd.sfx.wrong(); ctx.oops(); ctx.duck(1400);
          ctx.say(U.pick([
            { id: 'tekrar-1', text: 'Olsun, tekrar dene.' },
            { id: 'tekrar-3', text: 'Hadi tekrar deneyelim.' }
          ]));
          setTimeout(() => b.classList.remove('wrong'), 600);
        }
      });
      btnler.push(b);
      ctx.options.appendChild(b);
    });
    tanitKartlar(btnler, secenekler, h.id);
  }

  /* Kartlar kendini tanıtır (okuma gerekmesin) */
  let tanitT = [];
  function tanitDur() {
    tanitT.forEach(clearTimeout); tanitT = [];
    [...ctx.options.querySelectorAll('.tanit')].forEach(b => b.classList.remove('tanit'));
  }
  function tanitKartlar(btnler, secenekler, hid) {
    tanitDur();
    let t = 2600;
    btnler.forEach((b, i) => {
      const an = t, o = secenekler[i];
      tanitT.push(setTimeout(() => {
        b.classList.add('tanit');
        Snd.say({ id: hid + (o.correct ? '-d' : '-y'), text: o.s.t }, { keep: an > 2600 });
        tanitT.push(setTimeout(() => b.classList.remove('tanit'), 900));
      }, t));
      t += 1350;
    });
    ctx.duck(t + 200);
  }

  function sonraki() {
    hi++;
    ctx.setProgress(hi, TOPLAM);
    if (hi >= TOPLAM) {
      const yildiz = dogru >= TOPLAM ? 3 : dogru >= TOPLAM - 1 ? 2 : 1;
      ctx.options.className = 'options-area';
      ctx.finish(yildiz, `${TOPLAM} hikayeyi dinledin!`);
      return;
    }
    Snd.sfx.star();
    setTimeout(hikayeBasla, 900);
  }

  return {
    id: cfg.id, title: cfg.title, emoji: cfg.emoji, mode: 'custom',
    intro: cfg.intro, mount
  };
};
