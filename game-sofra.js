/* ===== Temizlik ve Görgü: Sofra Adabı =====
   Durum gösterilir, iki davranıştan doğrusu seçilir.
   Doğru cevapta NEDEN'i de anlatılır — asıl öğretici kısım burası. */
window.GameSofra = (function () {
  const DURUMLAR = [
    { e:'🍽️', soru:'Sofraya oturmadan önce ne yaparız?',
      dogru:{ e:'🧼', t:'Ellerimizi yıkarız' },
      yanlis:{ e:'🏃', t:'Koşarak otururuz' },
      neden:'Ellerimizde gözle görülmeyen mikroplar olur. Yıkayınca yemeğe karışmaz.',
      id:'sofra-1' },

    { e:'😋', soru:'Yemek çiğnerken ağzımız nasıl olmalı?',
      dogru:{ e:'🤐', t:'Kapalı çiğneriz' },
      yanlis:{ e:'😮', t:'Açık çiğneriz' },
      neden:'Ağzımız kapalıyken ses çıkmaz, yanımızdakiler de rahat eder.',
      id:'sofra-2' },

    { e:'💬', soru:'Ağzımız doluyken konuşmak istersek?',
      dogru:{ e:'👌', t:'Önce yutar, sonra konuşuruz' },
      yanlis:{ e:'🗣️', t:'Hemen konuşuruz' },
      neden:'Ağzımız doluyken konuşursak boğazımıza kaçabilir. Önce yutmak daha güvenli.',
      id:'sofra-3' },

    { e:'🪑', soru:'Sofrada nasıl otururuz?',
      dogru:{ e:'🧍', t:'Dik ve düzgün otururuz' },
      yanlis:{ e:'🤸', t:'Ayaklarımızı sandalyeye koyarız' },
      neden:'Dik oturmak hem sağlıklı hem de kibar. Yemek de daha kolay iner.',
      id:'sofra-4' },

    { e:'🤲', soru:'Yemeğe başlarken ne deriz?',
      dogru:{ e:'✨', t:'Bismillah deriz' },
      yanlis:{ e:'🍴', t:'Hiçbir şey demeden başlarız' },
      neden:'Bismillah demek, yemeğe güzel bir başlangıç yapmaktır.',
      id:'sofra-5' },

    { e:'🙏', soru:'Yemek bitince ne yaparız?',
      dogru:{ e:'💖', t:'Elhamdülillah der, teşekkür ederiz' },
      yanlis:{ e:'🚪', t:'Hemen kalkıp gideriz' },
      neden:'Teşekkür etmek, yemeği hazırlayanı mutlu eder.',
      id:'sofra-6' },

    { e:'🧂', soru:'Uzaktaki tuzu istiyoruz, ne yaparız?',
      dogru:{ e:'🙋', t:'"Verir misin lütfen" deriz' },
      yanlis:{ e:'💪', t:'Uzanıp kendimiz alırız' },
      neden:'Uzanınca bardaklar devrilebilir. Rica etmek hem kolay hem kibar.',
      id:'sofra-7' },

    { e:'😕', soru:'Yemeği beğenmediysek ne deriz?',
      dogru:{ e:'🌸', t:'"Teşekkürler, doydum" deriz' },
      yanlis:{ e:'👎', t:'"Bu çok kötü" deriz' },
      neden:'O yemeği biri emek verip yaptı. Kırıcı olmadan da söyleyebiliriz.',
      id:'sofra-8' },

    { e:'💧', soru:'Sofraya su döktük, ne yaparız?',
      dogru:{ e:'🧻', t:'Peçeteyle sileriz' },
      yanlis:{ e:'🙈', t:'Görmezden geliriz' },
      neden:'Kendi dökdüğümüzü kendimiz temizlemek sorumluluk almaktır.',
      id:'sofra-9' },

    { e:'🥛', soru:'Su içerken nasıl içeriz?',
      dogru:{ e:'🐢', t:'Yavaş yavaş içeriz' },
      yanlis:{ e:'⚡', t:'Bir dikişte bitiririz' },
      neden:'Yavaş içmek midemizi rahatlatır, hızlı içince boğazımıza kaçabilir.',
      id:'sofra-10' },

    { e:'👄', soru:'Yemekten sonra ağzımızı neyle sileriz?',
      dogru:{ e:'🧻', t:'Peçeteyle sileriz' },
      yanlis:{ e:'👕', t:'Kolumuzla sileriz' },
      neden:'Peçete bunun için var. Kolumuz kirlenirse üstümüz de kirlenir.',
      id:'sofra-11' },

    { e:'🚶', soru:'Sofradan kalkarken ne yaparız?',
      dogru:{ e:'🙋', t:'İzin isteyip kalkarız' },
      yanlis:{ e:'💨', t:'Sessizce kaçarız' },
      neden:'İzin istemek, sofradakilere değer verdiğimizi gösterir.',
      id:'sofra-12' }
  ];

  let sira = [];
  function start() { sira = U.shuffle(DURUMLAR); }

  function question(i) {
    const d = sira[i % sira.length];
    const secenekler = U.shuffle([
      { s: d.dogru, correct: true },
      { s: d.yanlis, correct: false }
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
      aciklama: { id: d.id + '-neden', text: d.neden },
      options: secenekler.map(o => ({
        html: `<span class="davranis"><span class="davranis-e">${o.s.e}</span>
                 <span class="davranis-t">${o.s.t}</span></span>`,
        correct: o.correct,
        ses: { id: d.id + (o.correct ? '-d' : '-y'), text: o.s.t }
      })),
      cols: 2
    };
  }

  return {
    id: 'sofra', title: 'Sofra<br>Adabı', emoji: '🍽️',
    intro: { id: 'sys-oyun-sofra', text: 'Sofrada nasıl davranırız, birlikte öğrenelim!' },
    total: 10, start, question
  };
})();
