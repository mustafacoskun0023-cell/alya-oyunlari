/* ===== Dini Eğitim: Abdest Puzzle (sıralama) ===== */
window.GameAbdest = (function () {
  const ADIMLAR = [
    { e: '🤲', ad: 'Bismillah deriz',        id: 'abdest-1' },
    { e: '🖐️', ad: 'Ellerimizi yıkarız',     id: 'abdest-2' },
    { e: '😊', ad: 'Yüzümüzü yıkarız',       id: 'abdest-3' },
    { e: '💪', ad: 'Kollarımızı yıkarız',    id: 'abdest-4' },
    { e: '💧', ad: 'Başımızı mesh ederiz',   id: 'abdest-5' },
    { e: '🦶', ad: 'Ayaklarımızı yıkarız',   id: 'abdest-6' }
  ];
  // 1. tur 4 adım (kolay), 2. tur 6 adım (tamamı)
  const TURLAR = [4, 6];
  const TOPLAM = TURLAR.reduce((a, n) => a + n, 0); // 10

  let ctx = null, tur = 0, yapilan = 0, hata = 0, beklenen = 0, adimlar = [];

  function mount(c) {
    ctx = c; tur = 0; yapilan = 0; hata = 0;
    ctx.say({ id: 'sys-oyun-abdest', text: 'Abdest nasıl alınır? Sırayla dizelim!' });
    ctx.duck(2000);
    setTimeout(kur, 300);
  }

  function kur() {
    const n = TURLAR[tur];
    adimlar = ADIMLAR.slice(0, n);
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
      const b = document.createElement('button');
      b.className = 'opt adim';
      b.innerHTML = `<span class="adim-emoji">${a.e}</span><span class="adim-ad">${a.ad}</span>`;
      b.dataset.id = a.id;
      b.addEventListener('click', () => sec(b, a));
      ctx.options.appendChild(b);
    });

    ctx.setProgress(yapilan, TOPLAM);
  }

  function sec(btn, adim) {
    if (btn.classList.contains('done')) return;
    const hedef = adimlar[beklenen];

    if (adim.id === hedef.id) {
      btn.classList.add('done');
      const kutu = ctx.prompt.querySelector(`.yol-kutu[data-i="${beklenen}"]`);
      if (kutu) { kutu.textContent = adim.e; kutu.classList.add('dolu'); }
      Snd.sfx.correct();
      ctx.happy();
      ctx.duck(1400);
      ctx.say({ id: adim.id, text: adim.ad });
      beklenen++; yapilan++;
      ctx.setProgress(yapilan, TOPLAM);
      if (beklenen >= adimlar.length) setTimeout(turBitti, 1400);
    } else {
      hata++;
      btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      Snd.sfx.wrong();
      ctx.oops();
      ctx.duck(1300);
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
      ctx.finish(yildiz, 'Abdest adımlarını sırayla dizdin!');
      return;
    }
    Snd.sfx.star();
    ctx.duck(1400);
    ctx.say({ id: 'sys-abdest-devam', text: 'Şimdi hepsini birlikte dizelim!' });
    setTimeout(kur, 1500);
  }

  return {
    id: 'abdest', title: 'Abdest<br>Puzzle', emoji: '💧',
    mode: 'custom',
    intro: { id: 'sys-oyun-abdest', text: 'Abdest nasıl alınır? Sırayla dizelim!' },
    mount
  };
})();
