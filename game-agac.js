/* ===== İyilik Ağacı — büyüyen ağaç =====
   Ortada bir fidan var. Her doğru iyilik seçiminde ağaç büyüyor:
   yaprak → çiçek → meyve → kuşlar → kelebekler.
   Soru-cevap değil; çocuk iyiliği ağaca "asıyor" ve sonucu görüyor. */
window.GameAgac = (function () {

  const ASAMA = [
    { e: '🌱', ad: 'fidan',   arka: '#EAF7EE' },
    { e: '🌿', ad: 'filiz',   arka: '#E3F6E9' },
    { e: '🪴', ad: 'küçük ağaç', arka: '#DEF5E6' },
    { e: '🌳', ad: 'ağaç',    arka: '#D6F3E0' },
    { e: '🌳', ad: 'çiçekli ağaç', arka: '#CFF1DB', suslu: ['🌸', '🌸'] },
    { e: '🌳', ad: 'meyveli ağaç', arka: '#C8EFD6', suslu: ['🍎', '🌸', '🍎'] },
    { e: '🌳', ad: 'kuşlu ağaç',   arka: '#C1EDD1', suslu: ['🐦', '🍎', '🌸', '🍎', '🦋'] }
  ];

  const IYILIKLER = [
    { e: '🧓', soru: 'Komşu teyzenin poşetleri ağır.',
      dogru: { e: '💪', t: 'Taşımasına yardım ederim' }, yanlis: { e: '🚶', t: 'Yanından geçerim' },
      neden: 'Yardım etmek, kalbimizi de büyütür.', id: 'agc-1' },
    { e: '🐦', soru: 'Kışın kuşlar aç kalmış.',
      dogru: { e: '🌾', t: 'Balkona yem koyarım' }, yanlis: { e: '🪟', t: 'Perdeyi kapatırım' },
      neden: 'Bir avuç yem, bir kuşu kışa çıkarır.', id: 'agc-2' },
    { e: '🚮', soru: 'Parkta yerde çöpler var.',
      dogru: { e: '🧤', t: 'Toplayıp kutuya atarım' }, yanlis: { e: '🤷', t: '"Ben atmadım" derim' },
      neden: 'Temiz bir park, herkesin hakkı.', id: 'agc-3' },
    { e: '💧', soru: 'Musluk boşuna akıyor.',
      dogru: { e: '🚰', t: 'Kapatırım' }, yanlis: { e: '👀', t: 'Bakıp geçerim' },
      neden: 'Suyu boşa harcamamak da bir iyiliktir.', id: 'agc-4' },
    { e: '👶', soru: 'Küçük bir çocuk ağlıyor, annesi yok.',
      dogru: { e: '🙋', t: 'Bir büyüğe haber veririm' }, yanlis: { e: '😐', t: 'Görmezden gelirim' },
      neden: 'Yardım çağırmak, en doğru adımdır.', id: 'agc-5' },
    { e: '📚', soru: 'Artık okumadığım kitaplarım var.',
      dogru: { e: '🎁', t: 'İhtiyacı olana veririm' }, yanlis: { e: '📦', t: 'Kutuda çürütürüm' },
      neden: 'Bize lazım olmayan, başkasına hazine olabilir.', id: 'agc-6' },
    { e: '🌱', soru: 'Elimde bir fide var.',
      dogru: { e: '🌳', t: 'Toprağa dikerim' }, yanlis: { e: '🗑️', t: 'Atarım' },
      neden: 'Diktiğimiz her ağaç yıllarca gölge ve nefes verir.', id: 'agc-7' },
    { e: '🍞', soru: 'Sofrada ekmek artmış.',
      dogru: { e: '🧺', t: 'Saklarım, ziyan etmem' }, yanlis: { e: '🗑️', t: 'Çöpe atarım' },
      neden: 'Ekmek israfı, en büyük ziyandır.', id: 'agc-8' },
    { e: '🐕', soru: 'Sokak köpeği ürkek bakıyor.',
      dogru: { e: '💧', t: 'Su kabı bırakırım' }, yanlis: { e: '🪨', t: 'Taş atarım' },
      neden: 'Hayvana iyilik etmek, insanı yüceltir.', id: 'agc-9' },
    { e: '💡', soru: 'Boş odada ışık yanıyor.',
      dogru: { e: '🔌', t: 'Söndürürüm' }, yanlis: { e: '🚪', t: 'Kapatıp giderim' },
      neden: 'Küçük tasarruflar dünyaya büyük iyilik yapar.', id: 'agc-10' },
    { e: '😢', soru: 'Sınıfta biri yalnız oturuyor.',
      dogru: { e: '🪑', t: 'Yanına oturur, konuşurum' }, yanlis: { e: '👥', t: 'Kendi grubumda kalırım' },
      neden: 'Bir arkadaşlık teklifi, birinin gününü kurtarabilir.', id: 'agc-11' },
    { e: '🎈', soru: 'Bir çocuğun balonu uçtu, ağlıyor.',
      dogru: { e: '🎁', t: 'Kendi balonumu veririm' }, yanlis: { e: '😆', t: 'Gülerim' },
      neden: 'Vazgeçmek, sahip olmaktan daha güzel bir duygudur.', id: 'agc-12' }
  ];

  const TUR = 7;                   // 7 iyilik = ağaç tam büyür
  let ctx = null, sira = [], i = 0, buyume = 0, hata = 0, kilit = false;

  function mount(c) {
    ctx = c; i = 0; buyume = 0; hata = 0;
    sira = U.shuffle(IYILIKLER).slice(0, TUR);
    ctx.options.className = 'options-area agac';
    ctx.options.style.gridTemplateColumns = '';
    ctx.say({ id: 'sys-oyun-agac', text: 'Her iyilik ağacımızı biraz daha büyütür. Hadi başlayalım!' });
    ctx.duck(3600);
    setTimeout(kur, 3700);
  }

  function agacHtml() {
    const a = ASAMA[Math.min(buyume, ASAMA.length - 1)];
    const susler = (a.suslu || []).map((s, n) =>
      `<span class="agc-sus" style="left:${16 + n * 17}%;top:${18 + (n % 3) * 15}%;
        animation-delay:${n * .18}s">${s}</span>`).join('');
    return `<div class="agc-sahne" style="background:${a.arka}">
        <span class="agc-e" key="${buyume}">${a.e}</span>${susler}
        <div class="agc-toprak"></div>
      </div>`;
  }

  function kur() {
    ctx.options.innerHTML = `
      <div class="agc-ust" id="agcUst">${agacHtml()}</div>
      <div class="agc-alt">
        <div class="agc-soru" id="agcSoru"></div>
        <div class="agc-secim" id="agcSecim"></div>
      </div>`;
    soruCiz();
  }

  function agacYenile(buyudu) {
    const ust = ctx.options.querySelector('#agcUst');
    ust.innerHTML = agacHtml();
    if (buyudu) {
      const s = ust.querySelector('.agc-sahne');
      s.classList.add('buyudu');
      const r = s.getBoundingClientRect();
      FX.confetti(45, r.left + r.width / 2, r.top + r.height / 2);
    }
  }

  function soruCiz() {
    if (i >= sira.length) return bitir();
    const d = sira[i];
    kilit = false;
    ctx.setProgress(i, TUR);
    ctx.options.querySelector('#agcSoru').innerHTML =
      `<span class="agc-soru-e">${d.e}</span><span class="agc-soru-t">${d.soru}</span>`;
    ctx.duck(3000);
    Snd.say({ id: d.id, text: d.soru });

    const kap = ctx.options.querySelector('#agcSecim');
    kap.innerHTML = '';
    U.shuffle([{ s: d.dogru, ok: true }, { s: d.yanlis, ok: false }]).forEach(o => {
      const b = document.createElement('div');
      b.className = 'agc-kart';
      b.innerHTML =
        `<button class="opt-dinle" type="button">
           <span class="davranis"><span class="davranis-e">${o.s.e}</span>
             <span class="davranis-t">${o.s.t}</span></span></button>
         <button class="opt-sec" type="button"><span class="sec-ikon">✓</span></button>`;
      b.querySelector('.opt-dinle').addEventListener('click', () => {
        if (kilit) return;
        [...kap.children].forEach(c => c.classList.remove('tanit'));
        b.classList.add('tanit');
        clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('tanit'), 1200);
        ctx.duck(1600);
        Snd.say({ id: d.id + (o.ok ? '-d' : '-y'), text: o.s.t });
      });
      b.querySelector('.opt-sec').addEventListener('click', () => {
        if (kilit) return;
        Snd.sfx.tap();
        o.ok ? dogru(d, b) : yanlisCevap(b);
      });
      kap.appendChild(b);
    });
  }

  function dogru(d, kart) {
    kilit = true;
    kart.classList.add('correct');
    [...kart.parentNode.children].forEach(c => { if (c !== kart) c.classList.add('dim'); });
    Snd.sfx.correct(); Snd.sfx.applause(); ctx.happy();
    buyume++;
    agacYenile(true);
    ctx.duck(5200);
    Snd.say({ id: d.id + '-neden', text: d.neden }, { delay: 700 });

    const balon = document.createElement('div');
    balon.className = 'tpl-balon gorun';
    balon.textContent = d.neden;
    ctx.options.querySelector('#agcUst').appendChild(balon);

    i++;
    ctx.setProgress(i, TUR);
    setTimeout(() => { balon.remove(); soruCiz(); },
      Math.min(2000 + d.neden.length * 82, 6800));
  }

  function yanlisCevap(kart) {
    hata++;
    kart.classList.remove('wrong'); void kart.offsetWidth; kart.classList.add('wrong');
    Snd.sfx.wrong(); ctx.oops(); ctx.duck(1500);
    Snd.say(U.pick([
      { id: 'tekrar-1', text: 'Olsun, tekrar dene.' },
      { id: 'tekrar-3', text: 'Hadi tekrar deneyelim.' }
    ]));
    setTimeout(() => kart.classList.remove('wrong'), 600);
  }

  function bitir() {
    const yildiz = hata <= 1 ? 3 : hata <= 3 ? 2 : 1;
    ctx.options.className = 'options-area';
    ctx.finish(yildiz, 'İyilik ağacın kocaman oldu, kuşlar bile geldi!');
  }

  return {
    id: 'agac', title: 'İyilik<br>Ağacı', emoji: '🌳', mode: 'custom',
    intro: { id: 'sys-oyun-agac', text: 'Her iyilik ağacımızı biraz daha büyütür!' },
    mount
  };
})();
