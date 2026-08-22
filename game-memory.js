/* ===== Oyun 4: Hafıza Oyunu (kart çevirme) ===== */
window.GameMemory = (function () {
  // Her kartın adı var — çocuk eşleştirirken kelimeyi de görüyor
  const HAVUZ = [
    { e: '🍎', ad: 'Elma' },    { e: '🍌', ad: 'Muz' },      { e: '🍓', ad: 'Çilek' },
    { e: '⭐', ad: 'Yıldız' },  { e: '🐟', ad: 'Balık' },    { e: '🎈', ad: 'Balon' },
    { e: '🐞', ad: 'Uğur böceği' }, { e: '🌸', ad: 'Çiçek' }, { e: '🍪', ad: 'Kurabiye' },
    { e: '🐥', ad: 'Civciv' },  { e: '🦋', ad: 'Kelebek' },  { e: '🚗', ad: 'Araba' },
    { e: '🐱', ad: 'Kedi' },    { e: '🐘', ad: 'Fil' },      { e: '🦆', ad: 'Ördek' },
    { e: '🎩', ad: 'Şapka' },   { e: '⚽', ad: 'Top' },      { e: '🍇', ad: 'Üzüm' },
    { e: '🤖', ad: 'Robot' },   { e: '🥁', ad: 'Davul' },    { e: '🌹', ad: 'Gül' },
    { e: '🐓', ad: 'Horoz' }
  ];
  // seviye: çift sayısı
  const SEVIYELER = [3, 4, 6];
  const TOPLAM_CIFT = SEVIYELER.reduce((a, n) => a + n, 0); // 13

  // kart sayısı + ekran yönüne göre sütun sayısı (kartlar kareye yakın kalsın)
  function sutunSayisi(kart) {
    const dikey = innerHeight > innerWidth;
    if (dikey) return kart <= 8 ? 2 : 3;
    return kart <= 6 ? 3 : 4;
  }

  let ctx = null, seviye = 0, bulunan = 0, hata = 0;
  let acik = [], kilit = false, kalan = 0;

  function mount(c) {
    ctx = c; seviye = 0; bulunan = 0; hata = 0;
    ctx.say({ id: 'sys-oyun-hafiza', text: 'Hafıza oyunu! Aynı olan kartları bul.' });
    ctx.duck(1800);
    setTimeout(kur, 1900);
  }

  function kur() {
    const cift = SEVIYELER[seviye];
    const sutun = sutunSayisi(cift * 2);
    const semboller = U.sample(HAVUZ, cift);
    const kartlar = U.shuffle(semboller.concat(semboller));
    acik = []; kilit = false; kalan = cift;

    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="prompt-q big">Aynı olan kartları bul!</div>
        <div class="level-dots">${
          SEVIYELER.map((_, i) =>
            `<span class="dot ${i < seviye ? 'done' : i === seviye ? 'now' : ''}"></span>`).join('')
        }</div>
      </div>`;

    ctx.options.className = 'options-area memory-grid';
    ctx.options.style.gridTemplateColumns = `repeat(${sutun},1fr)`;
    ctx.options.innerHTML = '';

    kartlar.forEach(k => {
      const b = document.createElement('button');
      b.className = 'card';
      b.innerHTML = `<span class="card-face back">🐾</span>` +
                    `<span class="card-face front" data-ad="${k.ad}">${k.e}</span>`;
      b.dataset.sym = k.e;
      b.dataset.ad = k.ad;
      b.addEventListener('click', () => cevir(b));
      ctx.options.appendChild(b);
    });

    ctx.setProgress(bulunan, TOPLAM_CIFT);
    gozAt();
  }

  /* Seviye başında kartlara kısa bir "göz atma" — 4 yaş için hafızayı
     zorlamadan çalıştıran klasik yöntem. Seviye büyüdükçe süre kısalır. */
  function gozAt() {
    const sure = [2600, 2200, 1800][seviye] || 1800;
    const kartlar = [...ctx.options.querySelectorAll('.card')];
    kilit = true;
    kartlar.forEach(b => b.classList.add('open', 'onizleme'));
    ctx.duck(1600);
    ctx.say({ id: 'sys-hafiza-bak', text: 'Kartlara iyi bak!' });
    setTimeout(() => {
      kartlar.forEach(b => b.classList.remove('open', 'onizleme'));
      kilit = false;
    }, sure);
  }

  function cevir(b) {
    if (kilit || b.classList.contains('open') || b.classList.contains('matched')) return;
    b.classList.add('open');
    Snd.sfx.tap();
    acik.push(b);
    if (acik.length < 2) return;

    kilit = true;
    const [a, c] = acik;
    if (a.dataset.sym === c.dataset.sym) {
      setTimeout(() => {
        a.classList.add('matched'); c.classList.add('matched');
        Snd.sfx.correct();
        const r = c.getBoundingClientRect();
        FX.confetti(30, r.left + r.width / 2, r.top + r.height / 2);
        ctx.happy();
        ctx.duck(1900);
        ctx.say({ id: 'sys-hafiza-esles', text: 'Eşleşti!' });
        // eşleşen kartın adını söyle — kelime dağarcığı da gelişsin
        const ad = a.dataset.ad || '';
        if (ad) {
          const kod = ad.toLocaleLowerCase('tr-TR').replace(/\s+/g, '')
            .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i')
            .replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u');
          Snd.say({ id: 'ad-' + kod, text: ad }, { delay: 800, keep: true });
        }
        bulunan++; kalan--;
        ctx.setProgress(bulunan, TOPLAM_CIFT);
        acik = []; kilit = false;
        if (kalan === 0) setTimeout(seviyeBitti, 900);
      }, 420);
    } else {
      hata++;
      setTimeout(() => {
        a.classList.add('shake'); c.classList.add('shake');
        Snd.sfx.wrong();
        ctx.oops();
      }, 380);
      setTimeout(() => {
        a.classList.remove('open', 'shake'); c.classList.remove('open', 'shake');
        acik = []; kilit = false;
      }, 1150);
    }
  }

  function seviyeBitti() {
    seviye++;
    if (seviye >= SEVIYELER.length) {
      // yıldız: toplam hatalı çevirme sayısına göre
      const yildiz = hata <= 4 ? 3 : hata <= 10 ? 2 : 1;
      ctx.options.className = 'options-area';
      ctx.finish(yildiz, `${TOPLAM_CIFT} çiftin hepsini buldun!`);
      return;
    }
    Snd.sfx.star();
    ctx.duck(1200);
    ctx.say({ id: 'sys-hafiza-devam', text: 'Devam et, hepsini bul!' });
    setTimeout(kur, 1100);
  }

  return {
    id: 'memory', title: 'Hafıza<br>Oyunu', emoji: '🧠',
    mode: 'custom',
    intro: { id: 'sys-oyun-hafiza', text: 'Hafıza oyunu! Aynı olan kartları bul.' },
    mount
  };
})();
