/* ===== Dini Eğitim: Dua Eşleştirme ===== */
window.GameDua = (function () {
  // Kısa, 4 yaş için tanıdık sözler
  const SOZLER = {
    bismillah:    { id: 'soz-bismillah',    metin: 'Bismillah' },
    elhamdulillah:{ id: 'soz-elhamdulillah',metin: 'Elhamdülillah' },
    masallah:     { id: 'soz-masallah',     metin: 'Maşallah' },
    insallah:     { id: 'soz-insallah',     metin: 'İnşallah' },
    selam:        { id: 'soz-selam',        metin: 'Selamünaleyküm' },
    razi:         { id: 'soz-razi',         metin: 'Allah razı olsun' }
  };

  const DURUMLAR = [
    { e: '🍽️', soru: 'Yemeğe başlarken ne deriz?',        dogru: 'bismillah',     id: 'dua-yemek-basi' },
    { e: '😋', soru: 'Yemeği bitirince ne deriz?',          dogru: 'elhamdulillah', id: 'dua-yemek-sonu' },
    { e: '🌸', soru: 'Çok güzel bir şey görünce ne deriz?', dogru: 'masallah',      id: 'dua-guzel' },
    { e: '🚪', soru: 'Eve girerken ne deriz?',              dogru: 'selam',         id: 'dua-eve-girer' },
    { e: '🎁', soru: 'Biri bize yardım edince ne deriz?',   dogru: 'razi',          id: 'dua-yardim' },
    { e: '🌙', soru: 'Yarın parka gideceğiz, ne deriz?',    dogru: 'insallah',      id: 'dua-yarin' },
    { e: '📖', soru: 'Bir işe başlarken ne deriz?',         dogru: 'bismillah',     id: 'dua-ise-basla' },
    { e: '🤒', soru: 'Hastalıktan iyileşince ne deriz?',    dogru: 'elhamdulillah', id: 'dua-iyilesme' },
    { e: '👶', soru: 'Sevimli bir bebek görünce ne deriz?', dogru: 'masallah',      id: 'dua-bebek' },
    { e: '🕌', soru: 'Camiye girerken ne deriz?',           dogru: 'selam',         id: 'dua-cami' }
  ];

  const RENK = ['#8B5CF6', '#12C2C2', '#FF8A00', '#22C55E', '#2E86FF', '#FF5FA2'];
  let sira = [];

  function start() { sira = U.shuffle(DURUMLAR); }

  function question(i) {
    const d = sira[i % sira.length];
    const renk = RENK[i % RENK.length];
    const yanlislar = U.sample(Object.keys(SOZLER).filter(k => k !== d.dogru), 2);
    const secenekler = U.shuffle([
      { k: d.dogru, correct: true },
      { k: yanlislar[0], correct: false },
      { k: yanlislar[1], correct: false }
    ]);

    return {
      prompt: `
        <div class="prompt-side">
          <div class="prompt-bubble">
            <div class="durum-emoji">${d.e}</div>
          </div>
          <div class="prompt-q">${d.soru}</div>
        </div>`,
      say: { id: d.id, text: d.soru },
      options: secenekler.map(o => ({
        html: `<span class="soz-karti" style="color:${renk}">${SOZLER[o.k].metin}</span>`,
        correct: o.correct,
        onCorrect: o.correct ? SOZLER[d.dogru] : null
      })),
      cols: 3
    };
  }

  return {
    id: 'dua', title: 'Dua<br>Eşleştirme', emoji: '🤲',
    intro: { id: 'sys-oyun-dua', text: 'Hangi durumda ne deriz, birlikte öğrenelim!' },
    total: 10, start, question
  };
})();
