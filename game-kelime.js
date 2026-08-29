/* ===== Harfler ve Dil: Kelime Dağarcığı =====
   Kelime söylenir, çocuk doğru resmi bulur. Tamamen sesle oynanır. */
window.GameKelime = (function () {
  const NESNELER = [
    { e: '🍎', ad: 'Elma',     kod: 'elma',     grup: 'meyve', anim: 'salla' },
    { e: '🍌', ad: 'Muz',      kod: 'muz',      grup: 'meyve', anim: 'salla' },
    { e: '🍓', ad: 'Çilek',    kod: 'cilek',    grup: 'meyve', anim: 'salla' },
    { e: '🍇', ad: 'Üzüm',     kod: 'uzum',     grup: 'meyve', anim: 'salla' },
    { e: '🐱', ad: 'Kedi',     kod: 'kedi',     grup: 'hayvan', anim: 'zipla' },
    { e: '🐕', ad: 'Köpek',    kod: 'kopek',    grup: 'hayvan', anim: 'zipla' },
    { e: '🐘', ad: 'Fil',      kod: 'fil',      grup: 'hayvan', anim: 'salla' },
    { e: '🐟', ad: 'Balık',    kod: 'balik',    grup: 'hayvan', anim: 'yuz' },
    { e: '🦆', ad: 'Ördek',    kod: 'ordek',    grup: 'hayvan', anim: 'yuz' },
    { e: '🐓', ad: 'Horoz',    kod: 'horoz',    grup: 'hayvan', anim: 'zipla' },
    { e: '🚗', ad: 'Araba',    kod: 'araba',    grup: 'tasit', anim: 'salla' },
    { e: '🚌', ad: 'Otobüs',   kod: 'otobus',   grup: 'tasit', anim: 'salla' },
    { e: '✈️', ad: 'Uçak',     kod: 'ucak',     grup: 'tasit', anim: 'uc' },
    { e: '🚲', ad: 'Bisiklet', kod: 'bisiklet', grup: 'tasit', anim: 'salla' },
    { e: '👟', ad: 'Ayakkabı', kod: 'ayakkabi', grup: 'esya', anim: 'zipla' },
    { e: '🎩', ad: 'Şapka',    kod: 'sapka',    grup: 'esya', anim: 'zipla' },
    { e: '📚', ad: 'Kitap',    kod: 'kitap',    grup: 'esya', anim: 'salla' },
    { e: '🪑', ad: 'Sandalye', kod: 'sandalye', grup: 'esya', anim: 'salla' },
    { e: '🌸', ad: 'Çiçek',    kod: 'cicek',    grup: 'doga', anim: 'buyu' },
    { e: '🌳', ad: 'Ağaç',     kod: 'agac',     grup: 'doga', anim: 'buyu' },
    { e: '☀️', ad: 'Güneş',    kod: 'gunes',    grup: 'doga', anim: 'buyu' },
    { e: '🌙', ad: 'Ay',       kod: 'ay',       grup: 'doga', anim: 'uc' },
    { e: '⭐', ad: 'Yıldız',   kod: 'yildiz',   grup: 'doga', anim: 'uc' },
    { e: '🥛', ad: 'Süt',      kod: 'sut',      grup: 'yiyecek', anim: 'zipla' },
    { e: '🍞', ad: 'Ekmek',    kod: 'ekmek',    grup: 'yiyecek', anim: 'zipla' },
    { e: '🧀', ad: 'Peynir',   kod: 'peynir',   grup: 'yiyecek', anim: 'zipla' }
  ];

  let sira = [];
  function start() { sira = U.shuffle(NESNELER); }

  function question(i) {
    const t = sira[i % sira.length];
    // yanlış şıklar aynı gruptan gelirse fazla zorlaşır — karışık seçiyoruz
    const digerleri = U.sample(NESNELER.filter(x => x.kod !== t.kod), 2);
    const secenekler = U.shuffle([
      { x: t, correct: true },
      { x: digerleri[0], correct: false },
      { x: digerleri[1], correct: false }
    ]);
    return {
      prompt: `
        <div class="prompt-side">
          <div class="prompt-bubble">
            <div class="durum-emoji kulak">👂</div>
          </div>
          <div class="prompt-q">Hangisi ${t.ad.toLocaleLowerCase('tr-TR')}?</div>
        </div>`,
      say: { id: 'kel-soru-' + t.kod, text: `Hangisi ${t.ad.toLocaleLowerCase('tr-TR')}?` },
      options: secenekler.map(o => ({
        html: `<span class="opt-pic">${o.x.e}</span><span class="opt-cap">${o.x.ad}</span>`,
        correct: o.correct,
        ses: { id: 'kel-' + o.x.kod, text: o.x.ad },
        onCorrect: o.correct ? { id: 'kel-' + t.kod, text: t.ad + '!' } : null
      })),
      /* Doğru bilince kelime CANLANIR: uçak uçar, balık yüzer,
         çiçek büyür — anlam, hareketle pekişir (Endless Alphabet). */
      onCorrectFx: (btn, fx) => {
        const pic = btn.querySelector('.opt-pic');
        if (pic) pic.classList.add('kelime-canlan', 'anim-' + (t.anim || 'zipla'));
        fx.praise(500);
      },
      bekle: 2600,
      cols: 3
    };
  }

  return {
    id: 'kelime', title: 'Kelime<br>Dağarcığı', emoji: '💬',
    intro: { id: 'sys-oyun-kelime', text: 'Söylediğim şeyi bulalım!' },
    total: 12, start, question
  };
})();
