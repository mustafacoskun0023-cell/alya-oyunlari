/* ===== Rutin motoru — Dr. Panda modeli =====
   Tek sahne, nesneler ortada. SADECE sıradaki adımın nesnesi
   parıldar, diğerleri sönük durur. Çocuk parıldayan nesneyi
   kullanır; yanlış nesneye dokunursa HİÇBİR ŞEY OLMAZ — ceza yok,
   hata sesi yok. Sıra yazıyla değil, ışıkla öğretilir.

   Jest tipleri:
     dokun   → nesneye bir kez dokun
     surukle → nesneyi gövde bölgesine sürükle
     ovala   → nesneyi tutup gezdir; ilerleme dolunca adım biter
               (gerçek hayattaki yıkama/fırçalama hareketi)

   cfg: { id, title, emoji, intro, bitis, arka, govde, adimlar }
   adım: { id, e, ad, tip, sure?, hedefAd? }                       */
window.MotorRutin = function (cfg) {
  let ctx = null, i = 0, tekrar = 0, ilerleme = 0, aktifEl = null, ovalT = null;
  const TEKRAR = cfg.tekrar || 1;      // tüm rutin kaç kez yapılacak
  const TOPLAM = cfg.adimlar.length * TEKRAR;

  function mount(c) {
    ctx = c; i = 0; tekrar = 0;
    ctx.options.className = 'options-area rutin';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say(cfg.intro);
    ctx.duck(3000);
    setTimeout(kur, 300);
  }

  function kur() {
    ctx.options.innerHTML = `
      <div class="rt-sahne" id="rtSahne">
        <div class="rt-arka">${cfg.arka || ''}</div>
        <div class="rt-govde" id="rtGovde">${cfg.govde || ''}</div>
        <div class="rt-kopuk" id="rtKopuk"></div>
        <div class="rt-ilerleme" id="rtIlerleme" hidden>
          <div class="rt-il-dolu" id="rtIlDolu"></div>
        </div>
      </div>
      <div class="rt-yol" id="rtYol"></div>
      <div class="rt-nesneler" id="rtNesne"></div>`;
    yolCiz();
    nesneCiz();
    adimBasla();
  }

  /* üstte adım yolu: yapılanlar dolu, sıradaki parlıyor */
  function yolCiz() {
    const el = ctx.options.querySelector('#rtYol');
    el.innerHTML = cfg.adimlar.map((a, n) =>
      `<span class="rt-yol-k ${n < i ? 'dolu' : n === i ? 'simdi' : ''}">${n < i ? a.e : n + 1}</span>`
    ).join('');
  }

  function nesneCiz() {
    const el = ctx.options.querySelector('#rtNesne');
    el.innerHTML = '';
    cfg.adimlar.forEach((a, n) => {
      const b = document.createElement('div');
      b.className = 'rt-nesne';
      b.dataset.n = n;
      b.innerHTML = `<span class="rt-nesne-e">${a.e}</span><span class="rt-parilti"></span>`;
      b.addEventListener('click', () => {
        if (n !== i) { nesneTanit(b, a); return; }   // sırası değilse sadece adını söyler
        if (a.tip === 'dokun') tamamla();
        else nesneTanit(b, a);
      });
      if (a.tip !== 'dokun') sürükleBagla(b, a, n);
      el.appendChild(b);
    });
    aktifle();
  }

  function nesneTanit(b, a) {
    ctx.duck(1500);
    Snd.say({ id: a.id, text: a.ad });
    b.classList.add('tanit');
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('tanit'), 1100);
  }

  function aktifle() {
    [...ctx.options.querySelectorAll('.rt-nesne')].forEach(b =>
      b.classList.toggle('aktif', +b.dataset.n === i));
  }

  function sürükleBagla(b, a, n) {
    Surukle.bagla(b, {
      veri: a,
      hayaletHtml: `<span class="hayalet-e">${a.e}</span>`,
      tutuldu: () => {
        if (n !== i) { nesneTanit(b, a); return; }
        aktifEl = b;
        ctx.duck(2000);
        Snd.say({ id: a.id, text: a.ad });
        if (a.tip === 'ovala') ovalamaBasla(a);
      },
      tekDokunus: () => { if (n !== i) nesneTanit(b, a); },
      hedefSec: (x, y) => {
        if (n !== i) return;
        const g = ctx.options.querySelector('#rtGovde');
        const h = Surukle.hedefBul(ctx.options, '.rt-govde', x, y);
        if (g) g.classList.toggle('aktif', !!h);
        if (a.tip === 'ovala' && h) ovalaAdim();
      },
      birakildi: (v, x, y) => {
        const g = ctx.options.querySelector('#rtGovde');
        if (g) g.classList.remove('aktif');
        if (n !== i) return;
        const h = Surukle.hedefBul(ctx.options, '.rt-govde', x, y);
        if (a.tip === 'surukle') { if (h) tamamla(); }
        else if (a.tip === 'ovala') { if (ilerleme < 100) ovalamaDur(); }
      }
    });
  }

  /* ---- ovalama: gövde üzerinde gezdikçe ilerleme dolar ---- */
  function ovalamaBasla(a) {
    ilerleme = 0;
    const bar = ctx.options.querySelector('#rtIlerleme');
    if (bar) bar.hidden = false;
    ovalaCiz();
  }
  function ovalaAdim() {
    if (ilerleme >= 100) return;
    ilerleme = Math.min(100, ilerleme + 2.6);
    ovalaCiz();
    if (ilerleme >= 100) ovalamaBitti();
  }
  function ovalaCiz() {
    const d = ctx.options.querySelector('#rtIlDolu');
    if (d) d.style.width = ilerleme + '%';
    const k = ctx.options.querySelector('#rtKopuk');
    if (k) {
      const adet = Math.floor(ilerleme / 12);
      if (k.children.length < adet) {
        const s = document.createElement('span');
        s.className = 'rt-kopuk-e';
        s.textContent = cfg.kopukE || '🫧';
        s.style.left = (12 + Math.random() * 72) + '%';
        s.style.top = (18 + Math.random() * 58) + '%';
        s.style.animationDelay = (Math.random() * .4) + 's';
        k.appendChild(s);
      }
    }
  }
  function ovalamaDur() { /* bırakınca ilerleme korunur, ceza yok */ }
  function ovalamaBitti() {
    Surukle.hayaletSil();
    const bar = ctx.options.querySelector('#rtIlerleme');
    if (bar) bar.hidden = true;
    tamamla();
  }

  function tamamla() {
    const a = cfg.adimlar[i];
    Snd.sfx.correct(); ctx.happy();
    const g = ctx.options.querySelector('#rtGovde');
    if (g) {
      g.classList.remove('yapildi'); void g.offsetWidth; g.classList.add('yapildi');
      const r = g.getBoundingClientRect();
      FX.confetti(28, r.left + r.width / 2, r.top + r.height / 2);
    }
    ctx.duck(2200);
    Snd.say({ id: a.id, text: a.ad });

    i++;
    ctx.setProgress(tekrar * cfg.adimlar.length + i, TOPLAM);
    yolCiz(); aktifle();

    if (i >= cfg.adimlar.length) {
      setTimeout(turBitti, 1500);
    } else {
      setTimeout(adimBasla, 1400);
    }
  }

  /* sıradaki adımı sesle duyur */
  function adimBasla() {
    const a = cfg.adimlar[i];
    if (!a) return;
    const kopuk = ctx.options.querySelector('#rtKopuk');
    if (kopuk && a.tip === 'ovala') kopuk.innerHTML = '';
    ctx.duck(2400);
    Snd.say({ id: a.id + '-yonerge', text: a.yonerge || a.ad });
  }

  function turBitti() {
    tekrar++;
    if (tekrar >= TEKRAR) {
      ctx.options.className = 'options-area';
      ctx.finish(3, cfg.bitis || 'Hepsini sırayla yaptın!');
      return;
    }
    Snd.sfx.star(); ctx.duck(2000);
    Snd.say(cfg.tekrarSes || { id: 'sys-rutin-tekrar', text: 'Bir kez daha yapalım!' });
    i = 0;
    setTimeout(kur, 2100);
  }

  return {
    id: cfg.id, title: cfg.title, emoji: cfg.emoji, mode: 'custom',
    intro: cfg.intro, mount
  };
};
