/* ===== Sayıları Öğren — dokunarak sayma =====
   Endless Numbers modeli: soyut rakam → somut miktar → sayma sesi
   üçü aynı ekranda birleşir.

   1) Rakam parçalara ayrılmış olarak gelir; çocuk parçayı sürükler,
      sürüklerken rakam kendi adını söyler ("üüüç").
   2) Rakam tamamlanınca o sayı kadar nesne belirir.
   3) Çocuk nesnelere TEK TEK dokunur; her dokunuşta sayılır
      ("bir… iki… üç") ve dokunulan nesne işaretlenir — aynı nesne
      iki kez sayılmaz.
   4) Hepsi sayılınca nesneler birlikte kutlama yapar.

   Yanlış diye bir şey yok, ceza sesi yok.                          */
window.GameNumbers = (function () {

  const WORDS = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];
  const BW    = ['', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On'];

  const OBJELER = [
    { e: '🍎', kod: 'elma',       cogul: 'elma' },
    { e: '🍌', kod: 'muz',        cogul: 'muz' },
    { e: '🐟', kod: 'balik',      cogul: 'balık' },
    { e: '⭐', kod: 'yildiz',     cogul: 'yıldız' },
    { e: '🎈', kod: 'balon',      cogul: 'balon' },
    { e: '🐞', kod: 'ugurbocegi', cogul: 'uğur böceği' },
    { e: '🌸', kod: 'cicek',      cogul: 'çiçek' },
    { e: '🍪', kod: 'kurabiye',   cogul: 'kurabiye' },
    { e: '🐥', kod: 'civciv',     cogul: 'civciv' },
    { e: '🦋', kod: 'kelebek',    cogul: 'kelebek' },
    { e: '🚗', kod: 'araba',      cogul: 'araba' },
    { e: '🍓', kod: 'cilek',      cogul: 'çilek' }
  ];

  const RENKLER = ['#FF4757', '#2E86FF', '#22C55E', '#FF8A00', '#8B5CF6', '#12C2C2', '#FF5FA2'];

  const TUR = 10;
  let ctx = null, sira = [], i = 0, sayilan = 0, hedef = 0, obj = null, renk = '';

  function mount(c) {
    ctx = c; i = 0;
    sira = U.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    ctx.options.className = 'options-area sayma';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say({ id: 'sys-oyun-sayi', text: 'Hadi birlikte sayalım!' });
    ctx.duck(2400);
    setTimeout(kur, 300);
  }

  /* ---------- 1. aşama: rakamı tamamla ---------- */
  function kur() {
    if (i >= TUR) return bitir();
    hedef = sira[i];
    obj = OBJELER[Math.floor(Math.random() * OBJELER.length)];
    renk = RENKLER[i % RENKLER.length];
    sayilan = 0;

    ctx.setProgress(i, TUR);
    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="prompt-q big">Rakamı yerine koy!</div></div>`;
    ctx.options.innerHTML = `
      <div class="sy-sahne">
        <div class="sy-yuva" id="syYuva">
          <span class="sy-golge" style="color:${renk}">${hedef}</span>
        </div>
        <div class="sy-parca" id="syParca"></div>
      </div>`;

    const parcaKap = ctx.options.querySelector('#syParca');
    const p = document.createElement('div');
    p.className = 'sy-tut';
    p.innerHTML = `<span class="sy-rakam" style="color:${renk}">${hedef}</span>`;
    parcaKap.appendChild(p);

    ctx.duck(2000);
    Snd.say({ id: 'sayi-' + hedef, text: BW[hedef] });

    let sesTekrar = null;
    Surukle.bagla(p, {
      veri: hedef,
      hayaletHtml: `<span class="sy-rakam hayalet" style="color:${renk}">${hedef}</span>`,
      tutuldu: () => {
        // sürüklendiği sürece rakam kendi adını tekrar eder
        Snd.say({ id: 'sayi-' + hedef, text: BW[hedef] });
        clearInterval(sesTekrar);
        sesTekrar = setInterval(() => Snd.say({ id: 'sayi-' + hedef, text: BW[hedef] }), 1100);
        ctx.duck(4000);
      },
      tekDokunus: () => { clearInterval(sesTekrar); yerlesti(p); },
      hedefSec: (x, y) => {
        const h = Surukle.hedefBul(ctx.options, '.sy-yuva', x, y);
        const yuva = ctx.options.querySelector('#syYuva');
        if (yuva) yuva.classList.toggle('aktif', !!h);
      },
      birakildi: (v, x, y) => {
        clearInterval(sesTekrar);
        const yuva = ctx.options.querySelector('#syYuva');
        if (yuva) yuva.classList.remove('aktif');
        const h = Surukle.hedefBul(ctx.options, '.sy-yuva', x, y);
        if (h) yerlesti(p);
        // yuvaya değilse hiçbir şey olmaz — ceza yok, parça yerinde kalır
      }
    });
  }

  function yerlesti(p) {
    const yuva = ctx.options.querySelector('#syYuva');
    if (!yuva || yuva.classList.contains('dolu')) return;
    yuva.classList.add('dolu');
    yuva.innerHTML = `<span class="sy-rakam yerlesti" style="color:${renk}">${hedef}</span>`;
    p.remove();
    Snd.sfx.correct();
    const r = yuva.getBoundingClientRect();
    FX.confetti(35, r.left + r.width / 2, r.top + r.height / 2);
    ctx.duck(2000);
    Snd.say({ id: 'sayi-' + hedef, text: BW[hedef] });
    setTimeout(saymaAsamasi, 1300);
  }

  /* ---------- 2. aşama: nesnelere dokunarak say ---------- */
  function saymaAsamasi() {
    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="sy-kucuk-rakam" style="color:${renk}">${hedef}</div>
        <div class="prompt-q">Hepsine dokun ve sayalım!</div>
      </div>`;

    const sut = hedef <= 3 ? hedef : hedef <= 6 ? 3 : hedef <= 8 ? 4 : 5;
    ctx.options.innerHTML = `<div class="sy-nesneler" id="syNesne"
        style="grid-template-columns:repeat(${sut},1fr)"></div>`;
    const kap = ctx.options.querySelector('#syNesne');

    for (let n = 0; n < hedef; n++) {
      const b = document.createElement('button');
      b.className = 'sy-nesne';
      b.innerHTML = `<span class="sy-nesne-e">${obj.e}</span><span class="sy-no"></span>`;
      b.addEventListener('click', () => dokun(b));
      kap.appendChild(b);
    }

    ctx.duck(2600);
    Snd.say({ id: 'sys-sayalim', text: 'Hepsine dokun ve sayalım!' });
  }

  function dokun(b) {
    if (b.classList.contains('sayildi')) return;   // aynı nesne iki kez sayılmaz
    sayilan++;
    b.classList.add('sayildi');
    b.style.setProperty('--no', sayilan);
    b.querySelector('.sy-no').textContent = sayilan;
    Snd.say({ id: 'sayi-' + sayilan, text: BW[sayilan] });
    ctx.duck(1200);

    if (sayilan >= hedef) setTimeout(tamamlandi, 900);
  }

  function tamamlandi() {
    const kap = ctx.options.querySelector('#syNesne');
    if (kap) kap.classList.add('kutlama');
    Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
    const r = kap ? kap.getBoundingClientRect() : { left: 0, width: innerWidth, top: 0, height: innerHeight };
    FX.confetti(90, r.left + r.width / 2, r.top + r.height / 2);

    ctx.prompt.innerHTML = `
      <div class="prompt-side">
        <div class="sy-sonuc"><span class="sy-sonuc-r" style="color:${renk}">${hedef}</span>
          <span class="sy-sonuc-t">${BW[hedef]} ${obj.cogul}!</span></div>
      </div>`;
    ctx.duck(3000);
    Snd.say({ id: 'sayi-' + hedef, text: BW[hedef] });
    Snd.say({ id: 'nesne-' + obj.kod, text: obj.cogul }, { delay: 800, keep: true });

    i++;
    ctx.setProgress(i, TUR);
    setTimeout(kur, 2800);
  }

  function bitir() {
    ctx.options.className = 'options-area';
    ctx.finish(3, 'Bire kadar ona kadar saydın!');
  }

  return {
    id: 'numbers', title: 'Sayıları<br>Öğren', emoji: '🔢', mode: 'custom',
    intro: { id: 'sys-oyun-sayi', text: 'Hadi birlikte sayalım!' },
    mount
  };
})();
