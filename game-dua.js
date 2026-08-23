/* ===== Dini Eğitim: Dua Eşleştirme ===== */
window.GameDua = (function () {
  // Kısa, 4 yaş için tanıdık sözler
  const SOZLER = {
    bismillah:    { id: 'soz-bismillah',    metin: 'Bismillah', e: '⭐', renk: '#8B5CF6',
                    anlam: 'Bismillah, Allah’ın adıyla başlıyorum demektir.' },
    elhamdulillah:{ id: 'soz-elhamdulillah',metin: 'Elhamdülillah', e: '💚', renk: '#22C55E',
                    anlam: 'Elhamdülillah, Allah’a çok şükür demektir.' },
    masallah:     { id: 'soz-masallah',     metin: 'Maşallah', e: '✨', renk: '#FF8A00',
                    anlam: 'Maşallah, Allah nazardan korusun demektir.' },
    insallah:     { id: 'soz-insallah',     metin: 'İnşallah', e: '🌙', renk: '#2E86FF',
                    anlam: 'İnşallah, Allah izin verirse demektir.' },
    selam:        { id: 'soz-selam',        metin: 'Selamünaleyküm', e: '👋', renk: '#12C2C2',
                    anlam: 'Selamünaleyküm, selam ve huzur olsun demektir.' },
    razi:         { id: 'soz-razi',         metin: 'Allah razı olsun', e: '💐', renk: '#FF5FA2',
                    anlam: 'Allah razı olsun, teşekkür ederim demektir.' }
  };

  const DURUMLAR = [
    { e: '🍽️', soru: 'Yemeğe başlarken ne deriz?',        dogru: 'bismillah',     id: 'dua-yemek-basi',
      neden: 'Yemeğe Bismillah ile başlarız.' },
    { e: '😋', soru: 'Yemeği bitirince ne deriz?',          dogru: 'elhamdulillah', id: 'dua-yemek-sonu',
      neden: 'Karnımız doyunca Elhamdülillah deriz.' },
    { e: '🌸', soru: 'Çok güzel bir şey görünce ne deriz?', dogru: 'masallah',      id: 'dua-guzel',
      neden: 'Güzel bir şey görünce Maşallah deriz.' },
    { e: '🚪', soru: 'Eve girerken ne deriz?',              dogru: 'selam',         id: 'dua-eve-girer',
      neden: 'Eve girerken selam veririz.' },
    { e: '🎁', soru: 'Biri bize yardım edince ne deriz?',   dogru: 'razi',          id: 'dua-yardim',
      neden: 'Yardım edene Allah razı olsun deriz.' },
    { e: '🌙', soru: 'Yarın parka gideceğiz, ne deriz?',    dogru: 'insallah',      id: 'dua-yarin',
      neden: 'Gelecekten söz ederken İnşallah deriz.' },
    { e: '📖', soru: 'Bir işe başlarken ne deriz?',         dogru: 'bismillah',     id: 'dua-ise-basla',
      neden: 'Her işe Bismillah ile başlarız.' },
    { e: '🤒', soru: 'Hastalıktan iyileşince ne deriz?',    dogru: 'elhamdulillah', id: 'dua-iyilesme',
      neden: 'İyileşince Elhamdülillah deriz.' },
    { e: '👶', soru: 'Sevimli bir bebek görünce ne deriz?', dogru: 'masallah',      id: 'dua-bebek',
      neden: 'Sevimli bir bebeğe Maşallah deriz.' },
    { e: '🕌', soru: 'Camiye girerken ne deriz?',           dogru: 'selam',         id: 'dua-cami',
      neden: 'Camiye girerken selam veririz.' },
    { e: '😴', soru: 'Uyumadan önce ne deriz?',             dogru: 'bismillah',     id: 'dua-uyku',
      neden: 'Uyumadan önce Bismillah deriz.' },
    { e: '🌧️', soru: 'Yağmur yağıp toprak canlanınca ne deriz?', dogru: 'elhamdulillah', id: 'dua-yagmur',
      neden: 'Nimet için Elhamdülillah deriz.' },
    { e: '🎨', soru: 'Arkadaşın çok güzel resim yaptı, ne deriz?', dogru: 'masallah', id: 'dua-resim',
      neden: 'Beğendiğimiz şeye Maşallah deriz.' },
    { e: '👋', soru: 'Arkadaşımızı görünce ne deriz?',      dogru: 'selam',         id: 'dua-arkadas',
      neden: 'Arkadaşımızı görünce selam veririz.' },
    { e: '🍬', soru: 'Birisi bize şeker ikram etti, ne deriz?', dogru: 'razi',       id: 'dua-ikram',
      neden: 'İkram edene Allah razı olsun deriz.' },
    { e: '🚗', soru: 'Yola çıkmadan önce ne deriz?',        dogru: 'bismillah',     id: 'dua-yol',
      neden: 'Yola Bismillah ile çıkarız.' }
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
        html: `<span class="soz-karti" style="--sc:${SOZLER[o.k].renk}">
                 <span class="soz-e">${SOZLER[o.k].e}</span>
                 <span class="soz-t">${SOZLER[o.k].metin}</span>
               </span>`,
        correct: o.correct,
        // Alya okuma bilmiyor: her kart kendi sözünü söyler
        ses: { id: SOZLER[o.k].id, text: SOZLER[o.k].metin },
        onCorrect: o.correct
          ? { id: SOZLER[d.dogru].id, text: SOZLER[d.dogru].metin } : null
      })),
      // Öğretici kısım: sözün ne demek olduğunu anlatır
      aciklama: { id: 'anlam-' + d.dogru, text: SOZLER[d.dogru].anlam },
      cols: 3
    };
  }

  return {
    id: 'dua', title: 'Dua<br>Eşleştirme', emoji: '🤲',
    intro: { id: 'sys-oyun-dua', text: 'Hangi durumda ne deriz, birlikte öğrenelim!' },
    total: 10, start, question
  };
})();
