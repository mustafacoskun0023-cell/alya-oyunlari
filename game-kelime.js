/* ===== Harfler ve Dil: Kelime Dağarcığı =====
   Kelime söylenir, çocuk doğru resmi bulur. Tamamen sesle oynanır. */
window.GameKelime = (function () {
  const NESNELER = [
    { e: '🍎', ad: 'Elma',     kod: 'elma',     grup: 'meyve' },
    { e: '🍌', ad: 'Muz',      kod: 'muz',      grup: 'meyve' },
    { e: '🍓', ad: 'Çilek',    kod: 'cilek',    grup: 'meyve' },
    { e: '🍇', ad: 'Üzüm',     kod: 'uzum',     grup: 'meyve' },
    { e: '🐱', ad: 'Kedi',     kod: 'kedi',     grup: 'hayvan' },
    { e: '🐕', ad: 'Köpek',    kod: 'kopek',    grup: 'hayvan' },
    { e: '🐘', ad: 'Fil',      kod: 'fil',      grup: 'hayvan' },
    { e: '🐟', ad: 'Balık',    kod: 'balik',    grup: 'hayvan' },
    { e: '🦆', ad: 'Ördek',    kod: 'ordek',    grup: 'hayvan' },
    { e: '🐓', ad: 'Horoz',    kod: 'horoz',    grup: 'hayvan' },
    { e: '🚗', ad: 'Araba',    kod: 'araba',    grup: 'tasit' },
    { e: '🚌', ad: 'Otobüs',   kod: 'otobus',   grup: 'tasit' },
    { e: '✈️', ad: 'Uçak',     kod: 'ucak',     grup: 'tasit' },
    { e: '🚲', ad: 'Bisiklet', kod: 'bisiklet', grup: 'tasit' },
    { e: '👟', ad: 'Ayakkabı', kod: 'ayakkabi', grup: 'esya' },
    { e: '🎩', ad: 'Şapka',    kod: 'sapka',    grup: 'esya' },
    { e: '📚', ad: 'Kitap',    kod: 'kitap',    grup: 'esya' },
    { e: '🪑', ad: 'Sandalye', kod: 'sandalye', grup: 'esya' },
    { e: '🌸', ad: 'Çiçek',    kod: 'cicek',    grup: 'doga' },
    { e: '🌳', ad: 'Ağaç',     kod: 'agac',     grup: 'doga' },
    { e: '☀️', ad: 'Güneş',    kod: 'gunes',    grup: 'doga' },
    { e: '🌙', ad: 'Ay',       kod: 'ay',       grup: 'doga' },
    { e: '⭐', ad: 'Yıldız',   kod: 'yildiz',   grup: 'doga' },
    { e: '🥛', ad: 'Süt',      kod: 'sut',      grup: 'yiyecek' },
    { e: '🍞', ad: 'Ekmek',    kod: 'ekmek',    grup: 'yiyecek' },
    { e: '🧀', ad: 'Peynir',   kod: 'peynir',   grup: 'yiyecek' }
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
      cols: 3
    };
  }

  return {
    id: 'kelime', title: 'Kelime<br>Dağarcığı', emoji: '💬',
    intro: { id: 'sys-oyun-kelime', text: 'Söylediğim şeyi bulalım!' },
    total: 12, start, question
  };
})();
