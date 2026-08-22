/* ===== Oyun 2: Renk - Şekil Eşleştirme ===== */
window.GameShapes = (function () {
  const COLORS = [
    { id: 'kirmizi', n: 'kırmızı', hex: '#FF3B30', dark: '#B3160E' },
    { id: 'mavi',    n: 'mavi',    hex: '#2E86FF', dark: '#134FA8' },
    { id: 'sari',    n: 'sarı',    hex: '#FFC800', dark: '#B58A00' },
    { id: 'yesil',   n: 'yeşil',   hex: '#22C55E', dark: '#12813A' },
    { id: 'turuncu', n: 'turuncu', hex: '#FF8A00', dark: '#B35F00' },
    { id: 'mor',     n: 'mor',     hex: '#8B5CF6', dark: '#5B32C4' },
    { id: 'pembe',   n: 'pembe',   hex: '#FF5FA2', dark: '#C42C6E' }
  ];
  const SHAPES = [
    { id: 'daire',  n: 'daire',  acc: 'daireyi',
      not: 'Daire yuvarlaktır, hiç köşesi yoktur. Top gibi, tekerlek gibi.' },
    { id: 'kare',   n: 'kare',   acc: 'kareyi',
      not: 'Karenin dört köşesi ve dört eşit kenarı vardır.' },
    { id: 'ucgen',  n: 'üçgen',  acc: 'üçgeni',
      not: 'Üçgenin üç köşesi vardır. Çatı gibi sivridir.' },
    { id: 'yildiz', n: 'yıldız', acc: 'yıldızı',
      not: 'Yıldızın beş sivri ucu vardır, gökyüzünde parlar.' },
    { id: 'kalp',   n: 'kalp',   acc: 'kalbi',
      not: 'Kalp sevgiyi anlatır. Üstü iki tümsek, altı sivridir.' },
    { id: 'dikdortgen', n: 'dikdörtgen', acc: 'dikdörtgeni',
      not: 'Dikdörtgen de dört köşelidir ama kareden uzundur. Kapı gibi.' }
  ];
  const RENK_NOT = {
    kirmizi: 'Kırmızı elmanın, domatesin rengidir.',
    mavi:    'Mavi gökyüzünün ve denizin rengidir.',
    sari:    'Sarı güneşin ve muzun rengidir.',
    yesil:   'Yeşil çimenin ve yaprakların rengidir.',
    turuncu: 'Turuncu portakalın ve havucun rengidir.',
    mor:     'Mor üzümün ve menekşenin rengidir.',
    pembe:   'Pembe çiçeklerin ve pamuk şekerin rengidir.'
  };

  function path(shapeId) {
    switch (shapeId) {
      case 'daire': return '<circle cx="50" cy="50" r="40"/>';
      case 'kare': return '<rect x="12" y="12" width="76" height="76" rx="10"/>';
      case 'ucgen': return '<path d="M50 9 L92 85 H8 Z" stroke-linejoin="round"/>';
      case 'yildiz': return '<path d="M50 6 L61.8 38.2 L95 40.5 L69.5 62 L77.6 94 L50 76 L22.4 94 L30.5 62 L5 40.5 L38.2 38.2 Z" stroke-linejoin="round"/>';
      case 'kalp': return '<path d="M50 88 C10 60 10 26 30 20 C40 17 47 23 50 30 C53 23 60 17 70 20 C90 26 90 60 50 88 Z" stroke-linejoin="round"/>';
      case 'dikdortgen': return '<rect x="6" y="26" width="88" height="48" rx="8"/>';
    }
    return '';
  }

  function shapeSVG(shape, color, cls) {
    return `<svg class="${cls || 'opt-shape'}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      fill="${color.hex}" stroke="${color.dark}" stroke-width="5">${path(shape.id)}</svg>`;
  }

  // Türkçe'ye uygun büyük harf / ilk harf büyütme
  function upper(t) { return t.toLocaleUpperCase('tr-TR'); }
  function cap(t) { return t.charAt(0).toLocaleUpperCase('tr-TR') + t.slice(1); }

  let plan = [];
  function start() {
    // Zorluk artışı: önce renk, sonra şekil, sonra ikisi birden
    plan = ['color','color','color','shape','shape','shape','both','both','both','both'];
  }

  function question(i) {
    const type = plan[i % plan.length];
    const tColor = U.pick(COLORS);
    const tShape = U.pick(SHAPES);
    let opts = [], say, promptLabel, sesId;

    if (type === 'color') {
      // Aynı şekil, farklı renkler → rengi bul
      const others = U.sample(COLORS.filter(c => c.id !== tColor.id), 2);
      opts = U.shuffle([
        { c: tColor, s: tShape, correct: true },
        { c: others[0], s: tShape, correct: false },
        { c: others[1], s: tShape, correct: false }
      ]);
      say = `${tColor.n} olanı bul!`; sesId = 'renk-' + tColor.id;
      promptLabel = upper(tColor.n);
    } else if (type === 'shape') {
      // Aynı renk, farklı şekiller → şekli bul
      const others = U.sample(SHAPES.filter(s => s.id !== tShape.id), 2);
      opts = U.shuffle([
        { c: tColor, s: tShape, correct: true },
        { c: tColor, s: others[0], correct: false },
        { c: tColor, s: others[1], correct: false }
      ]);
      say = `${tShape.acc} bul!`; sesId = 'sekil-' + tShape.id;
      promptLabel = upper(tShape.n);
    } else {
      // Hem renk hem şekil
      const oc = U.pick(COLORS.filter(c => c.id !== tColor.id));
      const os = U.pick(SHAPES.filter(s => s.id !== tShape.id));
      opts = U.shuffle([
        { c: tColor, s: tShape, correct: true },
        { c: oc, s: tShape, correct: false },   // doğru şekil, yanlış renk
        { c: tColor, s: os, correct: false }    // doğru renk, yanlış şekil
      ]);
      say = `${tColor.n} ${tShape.acc} bul!`; sesId = `rs-${tColor.id}-${tShape.id}`;
      promptLabel = upper(tColor.n + ' ' + tShape.n);
    }

    return {
      prompt: `
        <div class="prompt-side">
          <div class="prompt-bubble">
            ${shapeSVG(tShape, tColor, 'target-shape')}
            <div class="number-word" style="color:${tColor.dark}">${promptLabel}</div>
          </div>
          <div class="prompt-q">${cap(say)}</div>
        </div>`,
      say: { id: sesId, text: say },
      aciklama: (type === 'shape' || type === 'both')
        ? { id: 'not-sekil-' + tShape.id, text: tShape.not }
        : { id: 'not-renk-' + tColor.id, text: RENK_NOT[tColor.id] },
      options: opts.map(o => ({ html: shapeSVG(o.s, o.c), correct: o.correct })),
      cols: 3
    };
  }

  return {
    id: 'shapes', title: 'Renkler ve<br>Şekiller', emoji: '🎨',
    intro: { id: 'sys-oyun-renk', text: 'Renkleri ve şekilleri bulalım!' },
    total: 10, start, question
  };
})();
