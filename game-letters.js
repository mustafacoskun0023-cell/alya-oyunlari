/* ===== Harfleri Öğren — Endless Alphabet modeli =====
   1) Kelimenin harfleri karışık dizilir, silüetleri boş durur.
   2) Çocuk harfi tutup silüetteki yerine sürükler.
      SÜRÜKLERKEN harf kendi SESİNİ tekrar tekrar söyler ("mmm, mmm").
      Bırakınca susar — ses çocuğun parmağına bağlı, nedensellik.
   3) Silüet doğru yeri gösterdiği için yanlış yapmak imkânsız;
      yanlış yere bırakılan harf sessizce havuzda kalır. Ceza yok.
   4) Kelime tamamlanınca anlamı canlandıran animasyon oynar
      ve kelime sesli okunur.                                      */
window.GameLetters = (function () {

  const KELIMELER = [
    { kel: 'ARI',   kod: 'ari',   e: '🐝', anim: 'uc',    ders: 'Arı çiçekten çiçeğe uçar, bal yapar.' },
    { kel: 'ELMA',  kod: 'elma',  e: '🍎', anim: 'zipla', ders: 'Elma kırmızıdır ve çok faydalıdır.' },
    { kel: 'KEDİ',  kod: 'kedi',  e: '🐱', anim: 'salla', ders: 'Kedi miyavlar, tüyleri yumuşacıktır.' },
    { kel: 'BALIK', kod: 'balik', e: '🐟', anim: 'yuz',   ders: 'Balık suda yüzer, hiç durmadan.' },
    { kel: 'GÜL',   kod: 'gul',   e: '🌹', anim: 'buyu',  ders: 'Gül mis gibi kokar, dikenleri vardır.' },
    { kel: 'TOP',   kod: 'top',   e: '⚽', anim: 'zipla', ders: 'Top yuvarlaktır, zıplar ve yuvarlanır.' },
    { kel: 'MUZ',   kod: 'muz',   e: '🍌', anim: 'salla', ders: 'Muz sarıdır, bize güç verir.' },
    { kel: 'FİL',   kod: 'fil',   e: '🐘', anim: 'buyu',  ders: 'Fil çok büyüktür, hortumuyla su içer.' },
    { kel: 'NAR',   kod: 'nar',   e: '🥭', anim: 'zipla', ders: 'Narın içi kırmızı tanelerle doludur.' },
    { kel: 'SÜT',   kod: 'sut',   e: '🥛', anim: 'buyu',  ders: 'Süt kemiklerimizi güçlendirir.' },
    { kel: 'KUŞ',   kod: 'kus',   e: '🐦', anim: 'uc',    ders: 'Kuş kanatlarıyla gökyüzünde uçar.' },
    { kel: 'AY',    kod: 'ay',    e: '🌙', anim: 'salla', ders: 'Ay geceleri gökyüzünde parlar.' }
  ];

  /* harf → kayıtlı ses klibinin kodu */
  const KOD = { 'A':'a','B':'b','C':'c','Ç':'cc','D':'d','E':'e','F':'f','G':'g',
    'H':'h','I':'ii','İ':'i','J':'j','K':'k','L':'l','M':'m','N':'n','O':'o',
    'Ö':'oo','P':'p','R':'r','S':'s','Ş':'ss','T':'t','U':'u','Ü':'uu','V':'v',
    'Y':'y','Z':'z' };

  const RENK = ['#FF4757', '#2E86FF', '#22C55E', '#FF8A00', '#8B5CF6', '#12C2C2', '#FF5FA2'];

  const TUR = 8;
  let ctx = null, sira = [], qi = 0, kelime = null, yerlesen = 0, sesT = null;

  function mount(c) {
    ctx = c; qi = 0;
    sira = U.shuffle(KELIMELER).slice(0, TUR);
    ctx.options.className = 'options-area harf';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say({ id: 'sys-oyun-harf', text: 'Harfleri yerine koyalım!' });
    ctx.duck(2600);
    setTimeout(kur, 2700);
  }

  function kur() {
    if (qi >= sira.length) return bitir();
    kelime = sira[qi];
    yerlesen = 0;
    const harfler = kelime.kel.split('');
    ctx.setProgress(qi, TUR);

    ctx.prompt.innerHTML = `<div class="prompt-side"><div class="hf-resim" id="hfResim">${kelime.e}</div></div>`;

    ctx.options.innerHTML = `
      <div class="hf-yuvalar" id="hfYuva">${
        harfler.map((h, n) =>
          `<span class="hf-yuva" data-n="${n}" data-h="${h}"><span class="hf-golge">${h}</span></span>`
        ).join('')
      }</div>
      <div class="hf-havuz" id="hfHavuz"></div>`;

    const havuz = ctx.options.querySelector('#hfHavuz');
    U.shuffle(harfler.map((h, n) => ({ h, n }))).forEach(o => {
      const b = document.createElement('div');
      b.className = 'hf-harf';
      b.style.color = RENK[o.n % RENK.length];
      b.textContent = o.h;
      b.dataset.h = o.h;
      harfBagla(b, o.h);
      havuz.appendChild(b);
    });

    ctx.duck(2400);
    Snd.say({ id: 'kel-' + kelime.kod, text: kelime.kel });
  }

  function harfBagla(b, h) {
    const kod = KOD[h] || 'a';
    Surukle.bagla(b, {
      veri: h,
      hayaletHtml: `<span class="hf-harf hayalet" style="color:${b.style.color}">${h}</span>`,
      tutuldu: () => {
        Snd.say({ id: 'harf-' + kod, text: h });
        clearInterval(sesT);
        sesT = setInterval(() => Snd.say({ id: 'harf-' + kod, text: h }), 720);
        ctx.duck(5000);
      },
      tekDokunus: () => {
        clearInterval(sesT);
        ctx.duck(1500);
        Snd.say({ id: 'harf-' + kod, text: h });
        const y = [...ctx.options.querySelectorAll('.hf-yuva')]
          .find(v => !v.classList.contains('dolu') && v.dataset.h === h);
        if (y) setTimeout(() => yerlestir(b, y, h), 520);
      },
      hedefSec: (x, y) => {
        const t = Surukle.hedefBul(ctx.options, '.hf-yuva', x, y);
        [...ctx.options.querySelectorAll('.hf-yuva')].forEach(v =>
          v.classList.toggle('aktif',
            v === t && !v.classList.contains('dolu') && v.dataset.h === h));
      },
      birakildi: (v, x, y) => {
        clearInterval(sesT);
        [...ctx.options.querySelectorAll('.hf-yuva')].forEach(k => k.classList.remove('aktif'));
        const t = Surukle.hedefBul(ctx.options, '.hf-yuva', x, y);
        if (t && !t.classList.contains('dolu') && t.dataset.h === h) yerlestir(b, t, h);
      }
    });
  }

  function yerlestir(b, yuva, h) {
    if (yuva.classList.contains('dolu')) return;
    yuva.classList.add('dolu');
    yuva.innerHTML = `<span class="hf-yerlesti" style="color:${b.style.color}">${h}</span>`;
    b.remove();
    Snd.sfx.correct();
    const r = yuva.getBoundingClientRect();
    FX.confetti(18, r.left + r.width / 2, r.top + r.height / 2);
    yerlesen++;
    if (yerlesen >= kelime.kel.length) setTimeout(tamamlandi, 700);
  }

  function tamamlandi() {
    const res = ctx.prompt.querySelector('#hfResim');
    if (res) res.classList.add('anim-' + kelime.anim);
    const yuv = ctx.options.querySelector('#hfYuva');
    if (yuv) yuv.classList.add('tamam');

    Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
    FX.confetti(90, innerWidth / 2, innerHeight / 3);

    ctx.duck(5600);
    Snd.say({ id: 'kel-' + kelime.kod, text: kelime.kel });
    Snd.say({ id: 'kel-' + kelime.kod + '-ders', text: kelime.ders }, { delay: 1000, keep: true });

    const balon = document.createElement('div');
    balon.className = 'aciklama-balon gorun';
    balon.textContent = kelime.ders;
    ctx.prompt.appendChild(balon);

    qi++;
    ctx.setProgress(qi, TUR);
    setTimeout(kur, Math.min(2600 + kelime.ders.length * 82, 7000));
  }

  function bitir() {
    ctx.options.className = 'options-area';
    ctx.finish(3, `${TUR} kelimeyi harflerinden kurdun!`);
  }

  return {
    id: 'letters', title: 'Harfleri<br>Öğren', emoji: '🔤', mode: 'custom',
    intro: { id: 'sys-oyun-harf', text: 'Harfleri yerine koyalım!' },
    mount
  };
})();
