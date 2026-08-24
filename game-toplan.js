/* ===== Toplanma Vakti — sürükle & bırak =====
   Oda dağınık. Alya eşyayı parmağıyla tutup doğru kutuya bırakıyor.
   Oda temizlendikçe arkadaki "dağınıklık" azalıyor.
   Klasik soru-cevap değil: gerçek toplanma hissi.               */
window.GameToplan = (function () {

  const KUTULAR = [
    { id: 'tpl-oyuncakkutu', e: '🧺', ad: 'Oyuncak sepeti' },
    { id: 'tpl-kitaplik',    e: '📚', ad: 'Kitaplık' },
    { id: 'tpl-kirlisepet',  e: '🧦', ad: 'Kirli sepeti' },
    { id: 'tpl-cop',         e: '🗑️', ad: 'Çöp kutusu' },
    { id: 'tpl-bulasik',     e: '🍽️', ad: 'Mutfak' },
    { id: 'tpl-ayakkabilik', e: '👟', ad: 'Ayakkabılık' }
  ];

  const ESYALAR = [
    { id: 'esy-ayi',     e: '🧸', ad: 'Oyuncak ayı',  yer: 'tpl-oyuncakkutu',
      neden: 'Oyuncaklar sepette durursa hem bulmak kolay olur hem oda derli toplu.' },
    { id: 'esy-yapboz',  e: '🧩', ad: 'Yapboz',       yer: 'tpl-oyuncakkutu',
      neden: 'Parçalar kutuda durursa kaybolmaz.' },
    { id: 'esy-top',     e: '⚽', ad: 'Top',          yer: 'tpl-oyuncakkutu',
      neden: 'Yerde duran top ayağa takılır, birileri düşebilir.' },
    { id: 'esy-kitap',   e: '📖', ad: 'Kitap',        yer: 'tpl-kitaplik',
      neden: 'Kitaplar rafta durunca yıpranmaz.' },
    { id: 'esy-boyama',  e: '🎨', ad: 'Boyama kitabı',yer: 'tpl-kitaplik',
      neden: 'Kitaplar bir arada durursa kolay bulunur.' },
    { id: 'esy-tisort',  e: '👕', ad: 'Kirli tişört', yer: 'tpl-kirlisepet',
      neden: 'Kirli kıyafet sepete atılırsa yıkanır, oda da kokmaz.' },
    { id: 'esy-corap',   e: '🧦', ad: 'Kirli çorap',  yer: 'tpl-kirlisepet',
      neden: 'Çoraplar sepete gitmezse hep kaybolur.' },
    { id: 'esy-muz',     e: '🍌', ad: 'Muz kabuğu',   yer: 'tpl-cop',
      neden: 'Yere atılan kabuğa basıp düşebiliriz.' },
    { id: 'esy-kagit',   e: '📰', ad: 'Buruşuk kağıt',yer: 'tpl-cop',
      neden: 'İşe yaramayan kağıt çöpe gider.' },
    { id: 'esy-bardak',  e: '🥤', ad: 'Boş bardak',   yer: 'tpl-bulasik',
      neden: 'Bardağı mutfağa götürmek büyük bir yardımdır.' },
    { id: 'esy-kasik',   e: '🥄', ad: 'Kaşık',        yer: 'tpl-bulasik',
      neden: 'Tabağımızı kendimiz kaldırmak sorumluluktur.' },
    { id: 'esy-ayakkabi',e: '👟', ad: 'Ayakkabı',     yer: 'tpl-ayakkabilik',
      neden: 'Ayakkabılar yerinde durursa evi kirletmez.' },
    { id: 'esy-terlik',  e: '🩴', ad: 'Terlik',       yer: 'tpl-ayakkabilik',
      neden: 'Terlikler kapının yanında dururlarsa hemen buluruz.' },
    { id: 'esy-defter',  e: '📓', ad: 'Defter',       yer: 'tpl-kitaplik',
      neden: 'Defterimiz rafta olursa yarın hemen bulunur.' },
    { id: 'esy-tabak',   e: '🍽️', ad: 'Boş tabak',    yer: 'tpl-bulasik',
      neden: 'Sofrayı toplamak, yemeği yapan kişiye teşekkürdür.' }
  ];

  const TUR = 10;
  let ctx = null, sira = [], i = 0, hata = 0, kilit = false;

  function mount(c) {
    ctx = c; i = 0; hata = 0;
    sira = U.shuffle(ESYALAR).slice(0, TUR);
    ctx.options.className = 'options-area toplan';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say({ id: 'sys-oyun-toplan', text: 'Oda dağılmış! Eşyaları tutup doğru yerine bırakalım.' });
    ctx.duck(3600);
    setTimeout(kur, 3700);
  }

  function kur() {
    ctx.options.innerHTML = `
      <div class="tpl-oda" id="tplOda">
        <div class="tpl-kirli" id="tplKirli"></div>
        <div class="tpl-esya" id="tplEsya"></div>
      </div>
      <div class="tpl-kutular" id="tplKutular"></div>`;
    kutulariCiz();
    kirliCiz();
    esyaCiz();
  }

  function kutulariCiz() {
    const el = ctx.options.querySelector('#tplKutular');
    el.innerHTML = '';
    KUTULAR.forEach(k => {
      const b = document.createElement('button');
      b.className = 'tpl-kutu';
      b.dataset.id = k.id;
      b.innerHTML = `<span class="tpl-kutu-e">${k.e}</span><span class="tpl-kutu-ad">${k.ad}</span>`;
      b.addEventListener('click', () => {
        // dokununca kutu kendini tanıtır
        Snd.sfx.tap(); ctx.duck(1400);
        Snd.say({ id: k.id, text: k.ad });
        b.classList.add('tanit');
        setTimeout(() => b.classList.remove('tanit'), 1100);
      });
      el.appendChild(b);
    });
  }

  /* Odada kalan dağınıklık — her doğru yerleştirmede biri kaybolur */
  function kirliCiz() {
    const el = ctx.options.querySelector('#tplKirli');
    const kalan = sira.slice(i + 1, i + 6);
    el.innerHTML = kalan.map((e, n) =>
      `<span class="kirli-e" style="left:${8 + n * 19}%;top:${18 + (n % 3) * 26}%">${e.e}</span>`).join('');
  }

  function esyaCiz() {
    if (i >= sira.length) return bitir();
    const e = sira[i];
    kilit = false;
    ctx.setProgress(i, TUR);
    const kap = ctx.options.querySelector('#tplEsya');
    kap.innerHTML = `<div class="tpl-tut" id="tplTut">
        <span class="tpl-tut-e">${e.e}</span>
        <span class="tpl-tut-ad">${e.ad}</span>
        <span class="tpl-el">👆</span>
      </div>`;
    const tut = kap.querySelector('#tplTut');

    ctx.duck(1800);
    Snd.say({ id: e.id, text: e.ad });

    Surukle.bagla(tut, {
      veri: e,
      hayaletHtml: `<span class="hayalet-e">${e.e}</span>`,
      tutuldu: () => { ctx.duck(1500); Snd.say({ id: e.id, text: e.ad }); },
      tekDokunus: () => { ctx.duck(1500); Snd.say({ id: e.id, text: e.ad }); },
      hedefSec: (x, y) => {
        const h = Surukle.hedefBul(ctx.options, '.tpl-kutu', x, y);
        [...ctx.options.querySelectorAll('.tpl-kutu')].forEach(k =>
          k.classList.toggle('aktif', k === h));
      },
      birakildi: (veri, x, y) => {
        [...ctx.options.querySelectorAll('.tpl-kutu')].forEach(k => k.classList.remove('aktif'));
        const h = Surukle.hedefBul(ctx.options, '.tpl-kutu', x, y);
        if (!h) { Snd.sfx.whoosh(); return; }
        if (h.dataset.id === veri.yer) dogru(veri, h);
        else yanlis(veri, h);
      }
    });
  }

  function dogru(e, kutu) {
    if (kilit) return;
    kilit = true;
    kutu.classList.add('doldu');
    setTimeout(() => kutu.classList.remove('doldu'), 700);
    Snd.sfx.correct(); ctx.happy();
    const r = kutu.getBoundingClientRect();
    FX.confetti(40, r.left + r.width / 2, r.top + r.height / 2);
    const kap = ctx.options.querySelector('#tplEsya');
    kap.innerHTML = '';

    ctx.duck(4600);
    Snd.say({ id: e.id + '-neden', text: e.neden }, { delay: 500 });
    const balon = document.createElement('div');
    balon.className = 'tpl-balon gorun';
    balon.textContent = e.neden;
    ctx.options.querySelector('#tplOda').appendChild(balon);

    i++;
    ctx.setProgress(i, TUR);
    kirliCiz();
    setTimeout(() => { balon.remove(); esyaCiz(); },
      Math.min(1600 + e.neden.length * 80, 6200));
  }

  function yanlis(e, kutu) {
    hata++;
    kutu.classList.remove('yanlis'); void kutu.offsetWidth; kutu.classList.add('yanlis');
    Snd.sfx.wrong(); ctx.oops(); ctx.duck(2200);
    const dogruKutu = KUTULAR.find(k => k.id === e.yer);
    Snd.say({ id: e.id + '-ipucu', text: `${e.ad} ${dogruKutu.ad} içine gider.` });
    const dk = ctx.options.querySelector(`.tpl-kutu[data-id="${e.yer}"]`);
    if (dk) { dk.classList.add('goster'); setTimeout(() => dk.classList.remove('goster'), 2200); }
    setTimeout(() => kutu.classList.remove('yanlis'), 600);
  }

  function bitir() {
    const yildiz = hata <= 1 ? 3 : hata <= 4 ? 2 : 1;
    ctx.options.className = 'options-area';
    ctx.finish(yildiz, 'Oda tertemiz oldu!');
  }

  return {
    id: 'toplan', title: 'Toplanma<br>Vakti', emoji: '🧺', mode: 'custom',
    intro: { id: 'sys-oyun-toplan', text: 'Oda dağılmış! Eşyaları doğru yerine koyalım.' },
    mount
  };
})();
