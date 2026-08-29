/* ===== Duyguları Tanı — iki mekanik bir arada =====
   A) AYNA (Avokiddo Emotions modeli): çocuk bir nesneyi karaktere
      sürükler, karakterin yüzü ANINDA değişir. "Benim yaptığım şey
      karşımdakinin duygusunu değiştiriyor" — empatinin çekirdeği.
   B) SAKİNLEŞME (Breathe-Think-Do modeli): karakter üzülünce
      nefes halkası çıkar, çocuk parmağını basılı tutarak nefesi
      takip eder, karakter sakinleşir.

   Doğru/yanlış yok, ceza yok — keşif var.                        */
window.GameDuygu = (function () {

  /* yüzler: SVG ile çizilir, anında değişir */
  const YUZ = {
    normal:  { agiz: 'M78 122 q22 14 44 0',            kas: '', ek: '' },
    mutlu:   { agiz: 'M74 116 q26 30 52 0 q-26 12 -52 0 z', kas: '', ek: 'parlak' },
    uzgun:   { agiz: 'M78 132 q22 -16 44 0',           kas: 'M62 78 q14 -8 26 2 M138 78 q-14 -8 -26 2', ek: 'yas' },
    saskin:  { agiz: 'M100 124 m-13 0 a13 16 0 1 0 26 0 a13 16 0 1 0 -26 0', kas: 'M62 72 q14 -10 26 0 M138 72 q-14 -10 -26 0', ek: '' },
    igrenmis:{ agiz: 'M76 126 q12 -10 24 4 q12 10 24 -6', kas: 'M62 80 q14 -6 26 4 M138 74 q-14 -6 -26 4', ek: '' },
    korkmus: { agiz: 'M100 126 m-11 0 a11 14 0 1 0 22 0 a11 14 0 1 0 -22 0', kas: 'M60 70 q16 -6 28 4 M140 70 q-16 -6 -28 4', ek: 'titre' },
    uykulu:  { agiz: 'M84 126 q16 8 32 0',             kas: '', ek: 'uyku' }
  };

  const NESNELER = [
    { e: '🍦', ad: 'Dondurma',   tepki: 'mutlu',    id: 'dg-dondurma',
      neden: 'Sevdiğimiz bir şey görünce mutlu oluruz.' },
    { e: '🎁', ad: 'Hediye',     tepki: 'mutlu',    id: 'dg-hediye',
      neden: 'Hediye almak insanı sevindirir.' },
    { e: '🧸', ad: 'Oyuncak ayı',tepki: 'mutlu',    id: 'dg-ayi',
      neden: 'Sevdiğimiz oyuncak bizi mutlu eder.' },
    { e: '🥦', ad: 'Brokoli',    tepki: 'igrenmis', id: 'dg-brokoli',
      neden: 'Bazı tatları sevmeyiz. Ama denemek her zaman iyidir.' },
    { e: '🐛', ad: 'Solucan',    tepki: 'igrenmis', id: 'dg-solucan',
      neden: 'Bazı şeyler bize itici gelir. Bu da bir duygudur.' },
    { e: '💔', ad: 'Kırık oyuncak', tepki: 'uzgun', id: 'dg-kirik',
      neden: 'Sevdiğimiz bir şey bozulunca üzülürüz.' },
    { e: '🌧️', ad: 'Yağmur',     tepki: 'uzgun',    id: 'dg-yagmur',
      neden: 'Dışarı çıkamayınca canımız sıkılabilir.' },
    { e: '👻', ad: 'Hayalet',    tepki: 'korkmus',  id: 'dg-hayalet',
      neden: 'Korkmak normaldir. Birine söyleyince geçer.' },
    { e: '🌩️', ad: 'Şimşek',     tepki: 'korkmus',  id: 'dg-simsek',
      neden: 'Yüksek ses korkutabilir ama zarar vermez.' },
    { e: '🎉', ad: 'Sürpriz',    tepki: 'saskin',   id: 'dg-surpriz',
      neden: 'Beklemediğimiz bir şey olunca şaşırırız.' },
    { e: '🎩', ad: 'Sihir',      tepki: 'saskin',   id: 'dg-sihir',
      neden: 'Anlamadığımız bir şey bizi şaşırtır.' },
    { e: '🛏️', ad: 'Yatak',      tepki: 'uykulu',   id: 'dg-yatak',
      neden: 'Yorulunca uykumuz gelir. Uyku bizi dinlendirir.' },
    { e: '🌙', ad: 'Gece',       tepki: 'uykulu',   id: 'dg-gece',
      neden: 'Gece olunca vücudumuz dinlenmek ister.' },
    { e: '🎈', ad: 'Balon',      tepki: 'mutlu',    id: 'dg-balon',
      neden: 'Renkli şeyler bizi neşelendirir.' }
  ];

  const DUYGU_AD = {
    mutlu: 'Mutlu', uzgun: 'Üzgün', saskin: 'Şaşkın',
    igrenmis: 'Hoşlanmadı', korkmus: 'Korkmuş', uykulu: 'Uykulu', normal: 'Sakin'
  };

  const TUR = 10;
  let ctx = null, sira = [], i = 0, mod = 'ayna', suanki = 'normal', nefesT = null;

  function mount(c) {
    ctx = c; i = 0;
    sira = U.shuffle(NESNELER).slice(0, TUR);
    ctx.options.className = 'options-area duygu';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say({ id: 'sys-oyun-duygu', text: 'Mina’ya bir şey göster, yüzü ne olacak bakalım!' });
    ctx.duck(3400);
    setTimeout(kur, 300);
  }

  function yuzSVG(d) {
    const y = YUZ[d] || YUZ.normal;
    const gozKapali = d === 'uykulu' || d === 'mutlu';
    return `
<svg viewBox="0 0 200 200" class="dg-yuz ${y.ek}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="82" fill="#FFD9A8" stroke="#E8B27C" stroke-width="3"/>
  ${y.kas ? `<path d="${y.kas}" fill="none" stroke="#7A5A3A" stroke-width="6" stroke-linecap="round"/>` : ''}
  ${gozKapali
    ? `<path d="M62 96 q14 12 28 0" fill="none" stroke="#3A2A45" stroke-width="6" stroke-linecap="round"/>
       <path d="M110 96 q14 12 28 0" fill="none" stroke="#3A2A45" stroke-width="6" stroke-linecap="round"/>`
    : `<ellipse cx="76" cy="98" rx="11" ry="13" fill="#fff"/>
       <ellipse cx="124" cy="98" rx="11" ry="13" fill="#fff"/>
       <circle cx="76" cy="100" r="7" fill="#3A2A45"/>
       <circle cx="124" cy="100" r="7" fill="#3A2A45"/>
       <circle cx="79" cy="96" r="2.4" fill="#fff"/>
       <circle cx="127" cy="96" r="2.4" fill="#fff"/>`}
  <ellipse cx="58" cy="118" rx="11" ry="7" fill="#FF9AB0" opacity=".55"/>
  <ellipse cx="142" cy="118" rx="11" ry="7" fill="#FF9AB0" opacity=".55"/>
  <path d="${y.agiz}" fill="${d === 'mutlu' ? '#D9536F' : 'none'}"
        stroke="#B4475F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  ${d === 'uzgun' ? '<circle cx="76" cy="122" r="6" fill="#7EC8F0" class="dg-yas"/>' : ''}
  ${d === 'uykulu' ? '<text x="150" y="60" font-size="30" fill="#8B7BB8">z</text>' : ''}
</svg>`;
  }

  function kur() {
    if (i >= sira.length) return sakinlesmeTuru();
    const n = sira[i];
    suanki = 'normal';
    ctx.setProgress(i, TUR + 1);
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">Mina’ya göster!</div></div>`;
    ctx.options.innerHTML = `
      <div class="dg-sahne" id="dgSahne">
        <div class="dg-yuz-kap" id="dgYuz">${yuzSVG('normal')}</div>
        <div class="dg-etiket" id="dgEtiket"></div>
      </div>
      <div class="dg-raf" id="dgRaf"></div>`;

    const raf = ctx.options.querySelector('#dgRaf');
    // doğru nesne + 2 çeldirici; hepsi geçerli, hepsi bir tepki verir
    U.shuffle([n].concat(U.sample(NESNELER.filter(x => x.id !== n.id), 2))).forEach(o => {
      const b = document.createElement('div');
      b.className = 'dg-nesne';
      b.innerHTML = `<span class="dg-nesne-e">${o.e}</span>`;
      Surukle.bagla(b, {
        veri: o,
        hayaletHtml: `<span class="hayalet-e">${o.e}</span>`,
        tutuldu: () => { ctx.duck(1400); Snd.say({ id: o.id, text: o.ad }); },
        tekDokunus: () => goster(o),
        hedefSec: (x, y) => {
          const h = Surukle.hedefBul(ctx.options, '.dg-sahne', x, y);
          const s = ctx.options.querySelector('#dgSahne');
          if (s) s.classList.toggle('aktif', !!h);
        },
        birakildi: (v, x, y) => {
          const s = ctx.options.querySelector('#dgSahne');
          if (s) s.classList.remove('aktif');
          if (Surukle.hedefBul(ctx.options, '.dg-sahne', x, y)) goster(o);
        }
      });
      raf.appendChild(b);
    });

    ctx.duck(2200);
    Snd.say({ id: 'sys-duygu-goster', text: 'Bir şeyi tutup Mina’ya göster!' });
  }

  function goster(o) {
    const yuz = ctx.options.querySelector('#dgYuz');
    const et = ctx.options.querySelector('#dgEtiket');
    /* Oyundan çıkılmışsa bu ögeler artık yok — çakılmadan sessizce çık. */
    if (!yuz || !et) return;
    suanki = o.tepki;
    yuz.innerHTML = yuzSVG(o.tepki);
    yuz.classList.remove('degisti'); void yuz.offsetWidth; yuz.classList.add('degisti');
    et.textContent = DUYGU_AD[o.tepki];
    et.className = 'dg-etiket gorun d-' + o.tepki;

    if (o.tepki === 'mutlu') { Snd.sfx.correct(); ctx.happy(); }
    else if (o.tepki === 'uzgun' || o.tepki === 'korkmus') ctx.oops();
    else Snd.sfx.tap();

    ctx.duck(4400);
    Snd.say({ id: 'duy-' + o.tepki, text: DUYGU_AD[o.tepki] });
    Snd.say({ id: o.id + '-neden', text: o.neden }, { delay: 1100, keep: true });

    i++;
    ctx.setProgress(i, TUR + 1);
    setTimeout(kur, Math.min(2400 + o.neden.length * 80, 6000));
  }

  /* ---------- son tur: sakinleşme nefesi ---------- */
  function sakinlesmeTuru() {
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">Mina üzüldü. Onu sakinleştirelim!</div></div>`;
    ctx.options.innerHTML = `
      <div class="dg-sakin">
        <div class="dg-yuz-kap buyuk" id="dgYuz2">${yuzSVG('uzgun')}</div>
        <button class="dg-nefes" id="dgNefes">
          <span class="dg-halka"></span>
          <span class="dg-nefes-t" id="dgNefesT">Parmağını basılı tut</span>
        </button>
      </div>`;
    ctx.duck(4200);
    Snd.say({ id: 'sys-nefes-tut', text: 'Parmağını balona basılı tut ve derin nefes al.' });

    const btn = ctx.options.querySelector('#dgNefes');
    const yazi = ctx.options.querySelector('#dgNefesT');
    let sure = 0, sayac = null;

    function basla() {
      btn.classList.add('basili');
      yazi.textContent = 'Nefes al…';
      Snd.say({ id: 'nefes-al', text: 'Nefes al' });
      ctx.duck(5000);
      clearInterval(sayac);
      sayac = setInterval(() => {
        sure++;
        if (sure === 4) { yazi.textContent = 'Tut…'; Snd.say({ id: 'nefes-tut', text: 'Tut' }); }
        if (sure === 6) { yazi.textContent = 'Nefes ver…'; Snd.say({ id: 'nefes-ver', text: 'Nefes ver' }); }
        if (sure >= 10) { clearInterval(sayac); sakinlesti(); }
      }, 1000);
    }
    function dur() {
      btn.classList.remove('basili');
      clearInterval(sayac);
      if (sure < 10) { sure = 0; yazi.textContent = 'Parmağını basılı tut'; }
    }
    btn.addEventListener('pointerdown', basla);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => btn.addEventListener(t, dur));
  }

  function sakinlesti() {
    const yuz = ctx.options.querySelector('#dgYuz2');
    if (yuz) { yuz.innerHTML = yuzSVG('mutlu'); yuz.classList.add('degisti'); }
    Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
    FX.confetti(90, innerWidth / 2, innerHeight / 2);
    ctx.duck(4600);
    Snd.say({ id: 'dg-sakin-ders',
      text: 'Derin nefes almak bizi sakinleştirir. Üzülünce hep böyle yapabilirsin.' });
    ctx.setProgress(TUR + 1, TUR + 1);
    setTimeout(() => {
      ctx.options.className = 'options-area';
      ctx.finish(3, 'Duyguları tanıdın ve sakinleşmeyi öğrendin!');
    }, 5200);
  }

  return {
    id: 'duygu', title: 'Duyguları<br>Tanı', emoji: '😊', mode: 'custom',
    intro: { id: 'sys-oyun-duygu', text: 'Mina’ya bir şey göster, yüzü ne olacak bakalım!' },
    mount
  };
})();
