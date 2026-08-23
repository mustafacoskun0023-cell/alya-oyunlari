/* ===== Dini Eğitim: Arap Harfleri =====
   İlk 12 harf. Önce "aynısını bul", sonra "sesini bul". */
window.GameArapharf = (function () {
  const HARFLER = [
    { h: 'ا', ad: 'Elif', kod: 'elif' },
    { h: 'ب', ad: 'Be',   kod: 'be' },
    { h: 'ت', ad: 'Te',   kod: 'te' },
    { h: 'ث', ad: 'Se',   kod: 'se' },
    { h: 'ج', ad: 'Cim',  kod: 'cim' },
    { h: 'ح', ad: 'Ha',   kod: 'ha' },
    { h: 'خ', ad: 'Hı',   kod: 'hi' },
    { h: 'د', ad: 'Dal',  kod: 'dal' },
    { h: 'ذ', ad: 'Zel',  kod: 'zel' },
    { h: 'ر', ad: 'Ra',   kod: 'ra' },
    { h: 'ز', ad: 'Ze',   kod: 'ze' },
    { h: 'س', ad: 'Sin',  kod: 'sin' }
  ];
  const RENK = ['#8B5CF6', '#12C2C2', '#FF8A00', '#22C55E', '#2E86FF', '#FF5FA2', '#FF4757'];

  let sira = [];
  function start() { sira = U.shuffle(HARFLER); }

  function question(i) {
    const t = sira[i % sira.length];
    const renk = RENK[i % RENK.length];
    const digerleri = U.sample(HARFLER.filter(x => x.kod !== t.kod), 2);
    const secenekler = U.shuffle([
      { x: t, correct: true },
      { x: digerleri[0], correct: false },
      { x: digerleri[1], correct: false }
    ]);

    // İlk yarı: harfi göster, aynısını bul. İkinci yarı: adını söyle, harfi bul.
    const gorunur = i < 6;
    return {
      prompt: `
        <div class="prompt-side">
          <div class="prompt-bubble">
            <div class="arap-harf" style="color:${renk}">${gorunur ? t.h : '👂'}</div>
          </div>
          <div class="prompt-q">${gorunur ? 'Aynı harfi bul!' : `Hangisi ${t.ad}?`}</div>
        </div>`,
      say: { id: 'ah-' + t.kod, text: t.ad },
      sayFollow: gorunur
        ? { id: 'sys-arap-ayni', text: 'Aynı harfi bul!', delay: 850 }
        : { id: 'sys-arap-hangi', text: `Hangisi ${t.ad}?`, delay: 850 },
      aciklama: { id: 'ah-not-' + t.kod, text: `Bu harfin adı ${t.ad}.` },
      options: secenekler.map(o => ({
        html: `<span class="arap-harf opt-arap">${o.x.h}</span>`,
        correct: o.correct,
        ses: { id: 'ah-' + o.x.kod, text: o.x.ad },
        onCorrect: o.correct ? { id: 'ah-' + t.kod, text: t.ad + '!' } : null
      })),
      cols: 3
    };
  }

  return {
    id: 'arapharf', title: 'Arap<br>Harfleri', emoji: '📿',
    intro: { id: 'sys-oyun-arapharf', text: 'Arap harflerini birlikte tanıyalım!' },
    total: 12, start, question
  };
})();
