/* ===== Temizlik ve Görgü: Diş Fırçalama =====
   Üç bölüm: hazırlık sıralaması -> dokunarak fırçalama -> bitiriş sıralaması */
window.GameDis = (function () {
  const HAZIRLIK = [
    { e:'🚰', ad:'Musluğu aç',        id:'dis-h1' },
    { e:'🪥', ad:'Fırçayı ıslat',     id:'dis-h2' },
    { e:'🧴', ad:'Macunu sık',        id:'dis-h3' },
    { e:'🚱', ad:'Musluğu kapat',     id:'dis-h4' }
  ];
  const BITIRIS = [
    { e:'💦', ad:'Ağzını çalkala',    id:'dis-b1' },
    { e:'🪥', ad:'Fırçayı yıka',      id:'dis-b2' },
    { e:'🥤', ad:'Bardağı yerine koy',id:'dis-b3' }
  ];
  const TOPLAM = HAZIRLIK.length + 16 + BITIRIS.length; // 4 + 16 diş + 3

  let ctx = null, bolum = 0, yapilan = 0, hata = 0;
  let beklenen = 0, liste = [], temizDis = 0, firca = null;

  function mount(c) {
    ctx = c; bolum = 0; yapilan = 0; hata = 0;
    ctx.say({ id:'sys-oyun-dis', text:'Dişlerimizi nasıl fırçalarız? Hadi öğrenelim!' });
    ctx.duck(2200);
    setTimeout(hazirlikKur, 2300);
  }

  /* ---------- 1 & 3: sıralama bölümleri ---------- */
  function siralamaKur(adimlar, baslik) {
    liste = adimlar; beklenen = 0;
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="prompt-q big">${baslik}</div>
        <div class="siralama-yolu">${
          adimlar.map((_, i) => `<span class="yol-kutu" data-i="${i}">${i + 1}</span>`).join('')
        }</div>
      </div>`;
    ctx.options.className = 'options-area abdest-grid';
    ctx.options.style.gridTemplateColumns = `repeat(${adimlar.length <= 3 ? 3 : 2},1fr)`;
    ctx.options.innerHTML = '';
    U.shuffle(adimlar).forEach(a => {
      const b = document.createElement('button');
      b.className = 'opt adim';
      b.innerHTML = `<span class="adim-emoji">${a.e}</span><span class="adim-ad">${a.ad}</span>`;
      b.addEventListener('click', () => siraSec(b, a));
      ctx.options.appendChild(b);
    });
    ctx.setProgress(yapilan, TOPLAM);
  }
  function hazirlikKur() { siralamaKur(HAZIRLIK, 'Önce hazırlanalım — sırayla seç!'); }
  function bitirisKur()  { siralamaKur(BITIRIS,  'Son adımlar — sırayla seç!'); }

  function siraSec(btn, adim) {
    if (btn.classList.contains('done')) return;
    if (adim.id === liste[beklenen].id) {
      btn.classList.add('done');
      const k = ctx.prompt.querySelector(`.yol-kutu[data-i="${beklenen}"]`);
      if (k) { k.textContent = adim.e; k.classList.add('dolu'); }
      Snd.sfx.correct(); ctx.happy(); ctx.duck(1300);
      ctx.say({ id: adim.id, text: adim.ad });
      beklenen++; yapilan++; ctx.setProgress(yapilan, TOPLAM);
      if (beklenen >= liste.length) {
        setTimeout(bolum === 0 ? firçalaKur : bitti, 1300);
      }
    } else {
      hata++;
      btn.classList.remove('wrong'); void btn.offsetWidth; btn.classList.add('wrong');
      Snd.sfx.wrong(); ctx.oops(); ctx.duck(1200);
      ctx.say({ id:'tekrar-1', text:'Olsun, tekrar dene.' });
      setTimeout(() => btn.classList.remove('wrong'), 600);
    }
  }

  /* ---------- 2: dokunarak fırçalama ---------- */
  function disSVG() {
    let ust = '', alt = '';
    for (let i = 0; i < 8; i++) {
      const x = 30 + i * 55;
      ust += `<rect class="dis" data-d="u${i}" x="${x}" y="30"  width="46" height="62" rx="14"/>`;
      alt += `<rect class="dis" data-d="a${i}" x="${x}" y="128" width="46" height="62" rx="14"/>`;
    }
    return `<svg id="agiz" viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="488" height="208" rx="40" fill="#FFD7E4"/>
      <rect x="18" y="18" width="464" height="184" rx="32" fill="#C9436B"/>
      ${ust}${alt}
    </svg>`;
  }

  function firçalaKur() {
    bolum = 1; temizDis = 0;
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="prompt-q big">Parmağınla dişlerin üstünde gezdir!</div>
        <div class="dis-sayac"><span id="disSayac">0</span> / 16 diş temiz</div>
      </div>`;
    ctx.options.className = 'options-area dis-alan';
    ctx.options.style.gridTemplateColumns = '1fr';
    ctx.options.innerHTML = `<div class="agiz-kutu">${disSVG()}<div class="firca">🪥</div></div>`;
    firca = ctx.options.querySelector('.firca');

    const kutu = ctx.options.querySelector('.agiz-kutu');
    const temizle = (x, y) => {
      const el = document.elementFromPoint(x, y);
      if (firca) {
        const r = kutu.getBoundingClientRect();
        firca.style.left = (x - r.left) + 'px';
        firca.style.top  = (y - r.top) + 'px';
        firca.style.opacity = 1;
      }
      if (el && el.classList && el.classList.contains('dis') && !el.classList.contains('temiz')) {
        el.classList.add('temiz');
        temizDis++; yapilan++;
        const s = ctx.prompt.querySelector('#disSayac');
        if (s) s.textContent = temizDis;
        ctx.setProgress(yapilan, TOPLAM);
        Snd.sfx.tap();
        if (temizDis === 8) { ctx.duck(1200); ctx.say({ id:'dis-devam', text:'Harika! Şimdi alt dişler.' }); }
        if (temizDis >= 16) {
          Snd.sfx.correct(); ctx.happy(); ctx.duck(1600);
          ctx.say({ id:'dis-bitti', text:'Bütün dişlerin tertemiz oldu!' });
          setTimeout(bitirisKur, 1800);
        }
      }
    };
    let basili = false;
    kutu.addEventListener('pointerdown', e => { basili = true; temizle(e.clientX, e.clientY); });
    kutu.addEventListener('pointermove', e => { if (basili) temizle(e.clientX, e.clientY); });
    addEventListener('pointerup', () => { basili = false; if (firca) firca.style.opacity = .45; });
    ctx.duck(2000);
    ctx.say({ id:'dis-firca', text:'Fırçayı dişlerin üstünde gezdir, hepsini temizle!' });
  }

  function bitti() {
    const yildiz = hata <= 1 ? 3 : hata <= 4 ? 2 : 1;
    ctx.options.className = 'options-area';
    ctx.finish(yildiz, 'Dişlerini baştan sona doğru fırçaladın!');
  }

  return {
    id: 'dis', title: 'Diş<br>Fırçalama', emoji: '🪥',
    mode: 'custom',
    intro: { id:'sys-oyun-dis', text:'Dişlerimizi nasıl fırçalarız? Hadi öğrenelim!' },
    mount
  };
})();
