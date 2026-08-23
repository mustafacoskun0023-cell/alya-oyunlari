/* ===== Oyun 3: Harf Tanıma (Türkçe alfabe, büyük harfler) ===== */
window.GameLetters = (function () {
  // Ğ yok: Türkçe'de hiçbir kelime Ğ ile başlamaz
  const A = [
    { h:'A', kod:'a',  kel:'Aslan',  kkod:'aslan',  e:'🦁' },
    { h:'B', kod:'b',  kel:'Balık',  kkod:'balik',  e:'🐟' },
    { h:'C', kod:'c',  kel:'Civciv', kkod:'civciv', e:'🐥' },
    { h:'Ç', kod:'cc', kel:'Çilek',  kkod:'cilek',  e:'🍓' },
    { h:'D', kod:'d',  kel:'Davul',  kkod:'davul',  e:'🥁' },
    { h:'E', kod:'e',  kel:'Elma',   kkod:'elma',   e:'🍎' },
    { h:'F', kod:'f',  kel:'Fil',    kkod:'fil',    e:'🐘' },
    { h:'G', kod:'g',  kel:'Gül',    kkod:'gul',    e:'🌹' },
    { h:'H', kod:'h',  kel:'Horoz',  kkod:'horoz',  e:'🐓' },
    { h:'I', kod:'ii', kel:'Işık',   kkod:'isik',   e:'💡' },
    { h:'İ', kod:'i',  kel:'İnek',   kkod:'inek',   e:'🐄' },
    { h:'J', kod:'j',  kel:'Jaguar', kkod:'jaguar', e:'🐆' },
    { h:'K', kod:'k',  kel:'Kedi',   kkod:'kedi',   e:'🐱' },
    { h:'L', kod:'l',  kel:'Limon',  kkod:'limon',  e:'🍋' },
    { h:'M', kod:'m',  kel:'Muz',    kkod:'muz',    e:'🍌' },
    { h:'N', kod:'n',  kel:'Nota',   kkod:'nota',   e:'🎵' },
    { h:'O', kod:'o',  kel:'Otobüs', kkod:'otobus', e:'🚌' },
    { h:'Ö', kod:'oo', kel:'Ördek',  kkod:'ordek',  e:'🦆' },
    { h:'P', kod:'p',  kel:'Pasta',  kkod:'pasta',  e:'🎂' },
    { h:'R', kod:'r',  kel:'Robot',  kkod:'robot',  e:'🤖' },
    { h:'S', kod:'s',  kel:'Süt',    kkod:'sut',    e:'🥛' },
    { h:'Ş', kod:'ss', kel:'Şapka',  kkod:'sapka',  e:'🎩' },
    { h:'T', kod:'t',  kel:'Top',    kkod:'top',    e:'⚽' },
    { h:'U', kod:'u',  kel:'Uçak',   kkod:'ucak',   e:'✈️' },
    { h:'Ü', kod:'uu', kel:'Üzüm',   kkod:'uzum',   e:'🍇' },
    { h:'V', kod:'v',  kel:'Vazo',   kkod:'vazo',   e:'🏺' },
    { h:'Y', kod:'y',  kel:'Yıldız', kkod:'yildiz', e:'⭐' },
    { h:'Z', kod:'z',  kel:'Zürafa', kkod:'zurafa', e:'🦒' }
  ];
  const RENK = ['#FF4757','#2E86FF','#22C55E','#FF8A00','#8B5CF6','#12C2C2','#FF5FA2'];

  let plan = [], order = [];

  function start() {
    // İlk 5 soru harf eşleştirme (kolay), sonrası ilk ses (zor)
    plan = ['ayni','ayni','ayni','ayni','ayni','ses','ses','ses','ses','ses'];
    order = U.shuffle(A);
  }

  function question(i) {
    const t = order[i % order.length];
    const tip = plan[i % plan.length];
    const renk = RENK[i % RENK.length];

    if (tip === 'ayni') {
      // Aynı harfi bul: 3 harf seçeneği
      const digerleri = U.sample(A.filter(x => x.h !== t.h), 2);
      const secenekler = U.shuffle([
        { x: t, correct: true },
        { x: digerleri[0], correct: false },
        { x: digerleri[1], correct: false }
      ]);
      return {
        prompt: `
          <div class="prompt-side">
            <div class="prompt-bubble">
              <div class="big-letter" style="color:${renk}">${t.h}</div>
            </div>
            <div class="prompt-q">Aynı harfi bul!</div>
          </div>`,
        say: { id: 'harf-' + t.kod, text: t.h + '!' },
        sayFollow: { id: 'sys-harf-ayni', text: 'Aynı harfi bul!', delay: 850 },
        options: secenekler.map(o => ({
          html: `<span class="opt-letter">${o.x.h}</span>`,
          correct: o.correct,
          ses: { id: 'harf-' + o.x.kod, text: o.x.h }
        })),
        cols: 3
      };
    }

    // İlk ses: hangi nesne bu harfle başlıyor?
    const digerleri = U.sample(A.filter(x => x.h !== t.h), 2);
    const secenekler = U.shuffle([
      { x: t, correct: true },
      { x: digerleri[0], correct: false },
      { x: digerleri[1], correct: false }
    ]);
    return {
      prompt: `
        <div class="prompt-side">
          <div class="prompt-bubble">
            <div class="big-letter" style="color:${renk}">${t.h}</div>
          </div>
          <div class="prompt-q">Hangisi bu sesle başlıyor?</div>
        </div>`,
      say: { id: 'harf-' + t.kod, text: t.h + '!' },
      sayFollow: { id: 'sys-harf-ses', text: 'Hangisi bu sesle başlıyor?', delay: 850 },
      aciklama: { id: 'not-harf-' + t.kod,
                  text: `${t.kel} kelimesi ${t.h} sesiyle başlar.` },
      options: secenekler.map(o => ({
        html: `<span class="opt-pic">${o.x.e}</span><span class="opt-cap">${o.x.kel}</span>`,
        correct: o.correct,
        ses: { id: 'kelime-' + o.x.kkod, text: o.x.kel },
        // doğru cevapta kelimeyi söyle
        onCorrect: o.correct ? { id: 'kelime-' + t.kkod, text: t.kel + '!' } : null
      })),
      cols: 3
    };
  }

  return {
    id: 'letters', title: 'Harfleri<br>Öğren', emoji: '🔤',
    intro: { id: 'sys-oyun-harf', text: 'Hadi harfleri öğrenelim!' },
    total: 10, start, question
  };
})();
