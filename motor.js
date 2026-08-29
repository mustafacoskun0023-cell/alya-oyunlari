/* ===== Ortak oyun motorları =====
   Oyunların çoğu aynı üç mekanikten biri. Motoru bir kez yazıp
   her oyuna sadece veri veriyoruz. Böylece hepsi aynı kalitede
   çalışıyor: kartlar kendini tanıtıyor, doğru cevapta NEDEN'i
   anlatılıyor, okuma yazma hiçbir yerde gerekmiyor. */
window.Motor = (function () {

  function durumPrompt(d) {
    return `
      <div class="prompt-side">
        <div class="prompt-bubble">
          <div class="durum-emoji">${d.e}</div>
        </div>
        <div class="prompt-q">${d.soru}</div>
      </div>`;
  }

  function davranisHtml(s) {
    return `<span class="davranis"><span class="davranis-e">${s.e}</span>
              <span class="davranis-t">${s.t}</span></span>`;
  }

  /* ---------- A) Doğru davranışı seç (iki kart) ----------
     cfg: { id, title, emoji, intro, durumlar, total }
     durum: { e, soru, dogru:{e,t}, yanlis:{e,t}, neden, id }        */
  function davranis(cfg) {
    let sira = [];
    return {
      id: cfg.id, title: cfg.title, emoji: cfg.emoji, intro: cfg.intro,
      total: cfg.total || 10,
      start() { sira = U.shuffle(cfg.durumlar); },
      question(i) {
        const d = sira[i % sira.length];
        const secenekler = U.shuffle([
          { s: d.dogru, correct: true },
          { s: d.yanlis, correct: false }
        ]);
        return {
          prompt: durumPrompt(d),
          say: { id: d.id, text: d.soru },
          aciklama: { id: d.id + '-neden', text: d.neden },
          options: secenekler.map(o => ({
            html: davranisHtml(o.s),
            correct: o.correct,
            ses: { id: d.id + (o.correct ? '-d' : '-y'), text: o.s.t }
          })),
          cols: 2
        };
      }
    };
  }

  /* ---------- B) Havuzdan doğru cevabı seç (üç kart) ----------
     cfg: { id, title, emoji, intro, durumlar, havuz, total, cols }
     havuz: { anahtar: { e, t, id, anlam? } }
     durum: { e, soru, dogru:'anahtar', neden, id }                  */
  function secmece(cfg) {
    let sira = [];
    const anahtarlar = Object.keys(cfg.havuz);
    return {
      id: cfg.id, title: cfg.title, emoji: cfg.emoji, intro: cfg.intro,
      total: cfg.total || 10,
      start() { sira = U.shuffle(cfg.durumlar); },
      question(i) {
        const d = sira[i % sira.length];
        const yanlislar = U.sample(anahtarlar.filter(k => k !== d.dogru), 2);
        const secenekler = U.shuffle([
          { k: d.dogru, correct: true },
          { k: yanlislar[0], correct: false },
          { k: yanlislar[1], correct: false }
        ]);
        const dogruKart = cfg.havuz[d.dogru];
        return {
          prompt: durumPrompt(d),
          say: { id: d.id, text: d.soru },
          aciklama: d.neden ? { id: d.id + '-neden', text: d.neden } : null,
          options: secenekler.map(o => {
            const k = cfg.havuz[o.k];
            return {
              html: davranisHtml({ e: k.e, t: k.t }),
              correct: o.correct,
              ses: { id: k.id, text: k.t },
              onCorrect: o.correct ? { id: dogruKart.id, text: dogruKart.t } : null
            };
          }),
          cols: 3
        };
      }
    };
  }

  /* ---------- C) Sırayla diz ----------
     cfg: { id, title, emoji, intro, adimlar, turlar, bitisMetni,
            devamSes }
     adim: { e, ad, id }                                             */
  function sirala(cfg) {
    const TURLAR = cfg.turlar || [Math.min(4, cfg.adimlar.length), cfg.adimlar.length];
    const TOPLAM = TURLAR.reduce((a, n) => a + n, 0);
    let ctx = null, tur = 0, yapilan = 0, hata = 0, beklenen = 0, adimlar = [];

    function kur() {
      const n = TURLAR[tur];
      adimlar = cfg.adimlar.slice(0, n);
      beklenen = 0;
      ctx.prompt.innerHTML = `
        <div class="prompt-side">
          <div class="prompt-q big">Sıradaki adımı seç!</div>
          <div class="siralama-yolu" id="siraYolu">${
            adimlar.map((_, i) => `<span class="yol-kutu" data-i="${i}">${i + 1}</span>`).join('')
          }</div>
        </div>`;
      ctx.options.className = 'options-area abdest-grid';
      ctx.options.style.gridTemplateColumns = `repeat(${n <= 4 ? 2 : 3},1fr)`;
      ctx.options.innerHTML = '';
      U.shuffle(adimlar).forEach(a => {
        const b = document.createElement('div');
        b.className = 'opt adim';
        b.innerHTML =
          `<button class="opt-dinle" type="button">` +
          `<span class="adim-icerik"><span class="adim-emoji">${a.e}</span>` +
          `<span class="adim-ad">${a.ad}</span></span></button>` +
          `<button class="opt-sec" type="button"><span class="sec-ikon">✓</span></button>`;
        b.dataset.id = a.id;
        b.querySelector('.opt-dinle').addEventListener('click', () => dinle(b, a));
        b.querySelector('.opt-sec').addEventListener('click', () => { Snd.sfx.tap(); sec(b, a); });
        ctx.options.appendChild(b);
      });
      ctx.setProgress(yapilan, TOPLAM);
    }

    /* Dokununca ne olduğunu söyler, seçmez */
    function dinle(b, a) {
      if (b.classList.contains('done')) return;
      [...ctx.options.children].forEach(c => { clearTimeout(c._tt); c.classList.remove('tanit'); });
      b.classList.add('tanit');
      b._tt = setTimeout(() => b.classList.remove('tanit'), 1200);
      ctx.duck(1600);
      Snd.say({ id: a.id, text: a.ad });
    }

    function sec(btn, adim) {
      [...ctx.options.children].forEach(c => { clearTimeout(c._tt); c.classList.remove('tanit'); });
      if (btn.classList.contains('done')) return;
      const hedef = adimlar[beklenen];
      if (adim.id === hedef.id) {
        btn.classList.add('done');
        const kutu = ctx.prompt.querySelector(`.yol-kutu[data-i="${beklenen}"]`);
        if (kutu) { kutu.textContent = adim.e; kutu.classList.add('dolu'); }
        Snd.sfx.correct(); ctx.happy(); ctx.duck(1400);
        ctx.say({ id: adim.id, text: adim.ad });
        beklenen++; yapilan++;
        ctx.setProgress(yapilan, TOPLAM);
        if (beklenen >= adimlar.length) setTimeout(turBitti, 1500);
      } else {
        hata++;
        btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
        Snd.sfx.wrong(); ctx.oops(); ctx.duck(1300);
        ctx.say(U.pick([
          { id: 'tekrar-1', text: 'Olsun, tekrar dene.' },
          { id: 'tekrar-3', text: 'Hadi tekrar deneyelim.' }
        ]));
        setTimeout(() => btn.classList.remove('wrong'), 600);
      }
    }

    function turBitti() {
      tur++;
      if (tur >= TURLAR.length) {
        const yildiz = hata <= 1 ? 3 : hata <= 4 ? 2 : 1;
        ctx.options.className = 'options-area';
        ctx.finish(yildiz, cfg.bitisMetni || 'Hepsini sırayla dizdin!');
        return;
      }
      Snd.sfx.star(); ctx.duck(1500);
      ctx.say(cfg.devamSes || { id: 'sys-sirala-devam', text: 'Şimdi hepsini birlikte dizelim!' });
      setTimeout(kur, 1600);
    }

    return {
      id: cfg.id, title: cfg.title, emoji: cfg.emoji, mode: 'custom', intro: cfg.intro,
      mount(c) {
        ctx = c; tur = 0; yapilan = 0; hata = 0;
        ctx.say(cfg.intro); ctx.duck(2200);
        setTimeout(kur, 300);
      }
    };
  }

  return { davranis, secmece, sirala };
})();
