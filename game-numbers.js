/* ===== Oyun 1: Sayı Tanıma (1-10) ===== */
window.GameNumbers = (function () {
  const WORDS = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'];
  const OBJECTS = [
    { e: '🍎', kod: 'elma',       cogul: 'Elmalar!' },
    { e: '🍌', kod: 'muz',        cogul: 'Muzlar!' },
    { e: '🍓', kod: 'cilek',      cogul: 'Çilekler!' },
    { e: '⭐', kod: 'yildiz',     cogul: 'Yıldızlar!' },
    { e: '🐟', kod: 'balik',      cogul: 'Balıklar!' },
    { e: '🎈', kod: 'balon',      cogul: 'Balonlar!' },
    { e: '🐞', kod: 'ugurbocegi', cogul: 'Uğur böcekleri!' },
    { e: '🌸', kod: 'cicek',      cogul: 'Çiçekler!' },
    { e: '🍪', kod: 'kurabiye',   cogul: 'Kurabiyeler!' },
    { e: '🐥', kod: 'civciv',     cogul: 'Civcivler!' },
    { e: '🦋', kod: 'kelebek',    cogul: 'Kelebekler!' },
    { e: '🚗', kod: 'araba',      cogul: 'Arabalar!' }
  ];
  const BW = ['', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On'];
  const BAS = 850;   // doğru cevaptan sonra saymaya başlama gecikmesi
  const ADIM = 620;  // her nesne arası — 4 yaş için acele etmeyen tempo
  const NUM_COLORS = ['#FF4757', '#2E86FF', '#22C55E', '#FF8A00', '#8B5CF6', '#12C2C2', '#FF5FA2'];

  let order = [];

  function start() { order = U.shuffle([1,2,3,4,5,6,7,8,9,10]); }

  function objGrid(count, emoji) {
    // Kare/dar kart için düzen
    const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
    const rows = Math.ceil(count / cols);
    // Geniş kart için düzen (en fazla 2 satır)
    const rowsW = count <= 4 ? 1 : 2;
    const colsW = Math.ceil(count / rowsW);
    let cells = '';
    for (let i = 0; i < count; i++) cells += `<span>${emoji}</span>`;
    return `<div class="obj-grid" style="--cols:${cols};--rows:${rows};--colsW:${colsW};--rowsW:${rowsW}">${cells}</div>`;
  }

  // Türkçe'ye uygun büyük harf (i -> İ)
  function upper(t) { return t.toLocaleUpperCase('tr-TR'); }

  function question(i) {
    const n = order[i % order.length];
    const obj = U.pick(OBJECTS);
    const color = NUM_COLORS[i % NUM_COLORS.length];

    // Yanlış seçenekler: hedefe yakın ama farklı sayılar
    const pool = [];
    for (let d = 1; d <= 4; d++) { if (n - d >= 1) pool.push(n - d); if (n + d <= 10) pool.push(n + d); }
    const wrongs = U.sample(pool, 2);

    const opts = U.shuffle([
      { count: n, correct: true },
      { count: wrongs[0], correct: false },
      { count: wrongs[1], correct: false }
    ]).map(o => ({ html: objGrid(o.count, obj.e), correct: o.correct }));

    return {
      prompt: `
        <div class="prompt-side">
          <div class="prompt-bubble">
            <div class="big-number" style="color:${color}">${n}</div>
            <div class="number-word" style="color:${color}">${upper(WORDS[n])}</div>
          </div>
          <div class="prompt-q">Hangisinde ${WORDS[n]} tane var?</div>
        </div>`,
      say: { id: 'nesne-' + obj.kod, text: obj.cogul },
      sayFollow: { id: 'soru-' + n,
                   text: `${BW[n]}! Hangisinde ${WORDS[n]} tane var?`, delay: 950 },
      options: opts,
      cols: 3,
      // Doğru cevapta nesneleri tek tek sayar — çocuk saymayı hem duyar hem görür
      bekle: BAS + n * ADIM + 1500,
      onCorrectFx: (btn, yardim) => {
        const ler = [...btn.querySelectorAll('.obj-grid span')];
        ler.forEach((el, i) => setTimeout(() => {
          el.style.setProperty('--no', i + 1);
          el.classList.add('sayilan');
          Snd.say({ id: 'sayi-' + (i + 1), text: BW[i + 1] }, { keep: i > 0 });
        }, BAS + i * ADIM));
        // sayma bitince övgü
        yardim && yardim.praise(BAS + n * ADIM + 420);
      }
    };
  }

  return {
    id: 'numbers', title: 'Sayıları<br>Öğren', emoji: '🔢',
    intro: { id: 'sys-oyun-sayi', text: 'Hadi sayıları öğrenelim!' },
    total: 10, start, question
  };
})();
