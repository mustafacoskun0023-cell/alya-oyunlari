/* ===== Hikaye içerikleri — 2 oyun ===== */

/* 1) Hikaye Dinle — günlük hayattan kısa kıssalar */
window.GameHikaye = HikayeMotoru({
  id: 'hikaye', title: 'Hikaye<br>Dinle', emoji: '📖',
  intro: { id: 'sys-oyun-hikaye', text: 'Sana güzel hikayeler anlatacağım, hazır mısın?' },
  hikayeler: [
    { id: 'hik-balon',
      sahneler: [
        { e: '🎈', t: 'Alya parka gitti. Elinde kırmızı bir balon vardı.' },
        { e: '😢', t: 'Küçük bir çocuk balonunu kaçırdı ve ağlamaya başladı.' },
        { e: '🤔', t: 'Alya durdu ve düşündü.' }
      ],
      soru: { metin: 'Alya ne yapmalı?',
        dogru: { e: '🎁', t: 'Balonunu ona verir' },
        yanlis: { e: '🏃', t: 'Koşup uzaklaşır' } },
      ders: 'Alya balonunu verdi. Çocuk güldü, Alya da içi ısınarak eve döndü. Vermek almaktan güzeldir.' },

    { id: 'hik-kedi',
      sahneler: [
        { e: '🌧️', t: 'Yağmurlu bir gündü. Alya pencereden dışarı baktı.' },
        { e: '🐱', t: 'Küçük bir kedi yağmurun altında titriyordu.' },
        { e: '🏠', t: 'Kedinin sığınacak yeri yoktu.' }
      ],
      soru: { metin: 'Alya ne yapmalı?',
        dogru: { e: '📦', t: 'Kutudan sığınak yapar' },
        yanlis: { e: '🪟', t: 'Perdeyi kapatır' } },
      ders: 'Alya bir kutu ve battaniye koydu. Kedi ısındı. En küçük canlıya bile merhamet göstermek büyük bir iyiliktir.' },

    { id: 'hik-vazo',
      sahneler: [
        { e: '🏺', t: 'Alya evde koşarken annesinin vazosuna çarptı.' },
        { e: '💥', t: 'Vazo düştü ve kırıldı.' },
        { e: '😰', t: 'Kimse görmemişti. Alya korktu.' }
      ],
      soru: { metin: 'Alya ne yapmalı?',
        dogru: { e: '🗣️', t: 'Anneye doğruyu söyler' },
        yanlis: { e: '🤫', t: 'Saklayıp bir şey demez' } },
      ders: 'Alya annesine söyledi. Annesi kızmadı, sarıldı. Doğruyu söylemek cesaret ister ama içimizi rahatlatır.' },

    { id: 'hik-sira',
      sahneler: [
        { e: '🛝', t: 'Parkta kaydırağın önünde uzun bir sıra vardı.' },
        { e: '⏳', t: 'Alya sırasını bekliyordu.' },
        { e: '🏃', t: 'Bir çocuk öne geçmek için koştu.' }
      ],
      soru: { metin: 'Alya ne yapmalı?',
        dogru: { e: '🙋', t: 'Kibarca sıra olmasını söyler' },
        yanlis: { e: '🤜', t: 'İtip kendi öne geçer' } },
      ders: 'Alya kibarca "Sıraya geçelim" dedi. Herkes sırayla kaydı. Kibar bir söz, kavgadan daha güçlüdür.' },

    { id: 'hik-oyuncak',
      sahneler: [
        { e: '🧸', t: 'Alya\'nın en sevdiği oyuncak ayısı vardı.' },
        { e: '👧', t: 'Misafir gelen küçük kız ayıyla oynamak istedi.' },
        { e: '😟', t: 'Alya ayısını çok seviyordu.' }
      ],
      soru: { metin: 'Alya ne yapmalı?',
        dogru: { e: '🤝', t: 'Sırayla oynamayı teklif eder' },
        yanlis: { e: '🙅', t: 'Ayıyı saklar' } },
      ders: 'Alya "Sırayla oynayalım" dedi. İkisi de eğlendi ve arkadaş oldu. Paylaşmak oyuncağı azaltmaz, arkadaşı çoğaltır.' },

    { id: 'hik-ekmek',
      sahneler: [
        { e: '🍞', t: 'Sofrada bir dilim ekmek artmıştı.' },
        { e: '🗑️', t: 'Alya onu çöpe atmak üzereydi.' },
        { e: '👵', t: 'Babaannesi durdurdu ve gülümsedi.' }
      ],
      soru: { metin: 'Ekmek ne yapılmalı?',
        dogru: { e: '🧺', t: 'Saklanır, ziyan edilmez' },
        yanlis: { e: '🚮', t: 'Çöpe atılır' } },
      ders: 'Babaanne ekmeği sakladı, akşam çorbaya kattı. Nimeti ziyan etmemek, şükretmenin bir yoludur.' }
  ]
});

/* 2) Peygamber Hikayeleri — 4-5 yaş seviyesinde, sade kıssalar */
window.GamePeygamber = HikayeMotoru({
  id: 'peygamber', title: 'Peygamber<br>Hikayeleri', emoji: '📜',
  intro: { id: 'sys-oyun-peygamber', text: 'Peygamberlerimizden güzel hikayeler dinleyelim!' },
  hikayeler: [
    { id: 'pey-nuh',
      sahneler: [
        { e: '🌊', t: 'Nuh Peygamber çok büyük bir gemi yaptı.' },
        { e: '🐘', t: 'Her hayvandan ikişer tane gemiye aldı.' },
        { e: '☔', t: 'Sonra çok şiddetli bir yağmur başladı.' }
      ],
      soru: { metin: 'Nuh Peygamber hayvanlara nasıl davrandı?',
        dogru: { e: '💚', t: 'Hepsini korudu' },
        yanlis: { e: '🚫', t: 'Dışarıda bıraktı' } },
      ders: 'Nuh Peygamber bütün canlıları korudu. Hayvanlara iyi davranmak, peygamber ahlakıdır.' },

    { id: 'pey-yusuf',
      sahneler: [
        { e: '⭐', t: 'Yusuf Peygamber çok güzel bir rüya gördü.' },
        { e: '😔', t: 'Kardeşleri onu kıskandı ve ona kötülük yaptı.' },
        { e: '👑', t: 'Yıllar sonra Yusuf çok önemli biri oldu ve onları buldu.' }
      ],
      soru: { metin: 'Yusuf kardeşlerine ne yaptı?',
        dogru: { e: '🤗', t: 'Affetti' },
        yanlis: { e: '😠', t: 'İntikam aldı' } },
      ders: 'Yusuf Peygamber kardeşlerini affetti. Affetmek, en güçlü insanların yapabildiği şeydir.' },

    { id: 'pey-ibrahim',
      sahneler: [
        { e: '🏜️', t: 'İbrahim Peygamber çölde misafir bekliyordu.' },
        { e: '🚶', t: 'Uzaktan yorgun yolcular geldi.' },
        { e: '🍲', t: 'İbrahim Peygamber hemen hazırlığa başladı.' }
      ],
      soru: { metin: 'Misafirlere ne yaptı?',
        dogru: { e: '🍽️', t: 'Yemek ikram etti' },
        yanlis: { e: '🚪', t: 'Kapıyı kapattı' } },
      ders: 'İbrahim Peygamber misafirlerini doyurdu. Misafiri ağırlamak çok güzel bir davranıştır.' },

    { id: 'pey-muhammed-kedi',
      sahneler: [
        { e: '🐈', t: 'Peygamber Efendimiz namaza kalkacaktı.' },
        { e: '😴', t: 'Ama bir kedi cübbesinin üstünde uyuyordu.' },
        { e: '🤔', t: 'Kediyi uyandırmak istemedi.' }
      ],
      soru: { metin: 'Peygamber Efendimiz ne yaptı?',
        dogru: { e: '✂️', t: 'Cübbesinin o kısmını kesti' },
        yanlis: { e: '👋', t: 'Kediyi itti' } },
      ders: 'Kediyi uyandırmamak için cübbesini kesti. Merhamet, en küçük canlıyı bile düşünmektir.' },

    { id: 'pey-musa',
      sahneler: [
        { e: '👶', t: 'Musa Peygamber bebekken sepette nehre bırakıldı.' },
        { e: '🌊', t: 'Nehir onu sarayın önüne getirdi.' },
        { e: '👑', t: 'Sarayda büyüdü, sonra insanlara doğruyu anlattı.' }
      ],
      soru: { metin: 'Musa Peygamber insanlara ne anlattı?',
        dogru: { e: '💡', t: 'Doğruyu ve adaleti' },
        yanlis: { e: '🤥', t: 'Yalanları' } },
      ders: 'Musa Peygamber hep doğruyu söyledi. Doğruluk, peygamberlerin en önemli özelliğidir.' },

    { id: 'pey-muhammed-emin',
      sahneler: [
        { e: '🕋', t: 'Peygamber Efendimiz gençken Mekke\'de yaşıyordu.' },
        { e: '🤝', t: 'Herkes ona emanetlerini bırakırdı.' },
        { e: '💎', t: 'Hiçbir emanete asla dokunmazdı.' }
      ],
      soru: { metin: 'Bu yüzden ona ne dediler?',
        dogru: { e: '⭐', t: 'Muhammed’ül Emin — güvenilir' },
        yanlis: { e: '😕', t: 'Hiçbir şey' } },
      ders: 'Ona "El-Emin", yani güvenilir dediler. Sözünde durmak ve emanete sahip çıkmak çok değerlidir.' }
  ]
});
