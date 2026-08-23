/* ===== Dini Eğitim — 6 yeni oyun ===== */

/* 1) Cami'yi Tanı */
window.GameCami = Motor.secmece({
  id: 'cami', title: "Cami'yi<br>Tanı", emoji: '🕌',
  intro: { id: 'sys-oyun-cami', text: 'Camiyi birlikte tanıyalım!' },
  havuz: {
    minare:  { e: '🗼', t: 'Minare',      id: 'cmi-minare' },
    kubbe:   { e: '🕌', t: 'Kubbe',       id: 'cmi-kubbe' },
    seccade: { e: '🧎', t: 'Seccade',     id: 'cmi-seccade' },
    sadirvan:{ e: '⛲', t: 'Şadırvan',    id: 'cmi-sadirvan' },
    mihrab:  { e: '🚪', t: 'Mihrap',      id: 'cmi-mihrab' },
    kuran:   { e: '📖', t: 'Kur’an', id: 'cmi-kuran' },
    tesbih:  { e: '📿', t: 'Tesbih',      id: 'cmi-tesbih' }
  },
  durumlar: [
    { e: '🗼', soru: 'Ezanın okunduğu uzun kule nedir?',      dogru: 'minare',   id: 'cam-1',
      neden: 'Minare uzun olur ki ezan uzaklardan duyulsun.' },
    { e: '⛲', soru: 'Camide abdest aldığımız yer neresi?',     dogru: 'sadirvan', id: 'cam-2',
      neden: 'Şadırvan, camiye girmeden abdest aldığımız yerdir.' },
    { e: '🧎', soru: 'Üzerinde namaz kıldığımız şey nedir?',    dogru: 'seccade',  id: 'cam-3',
      neden: 'Seccade temiz bir zemin sağlar.' },
    { e: '🕌', soru: 'Caminin yuvarlak çatısına ne denir?',     dogru: 'kubbe',    id: 'cam-4',
      neden: 'Kubbe sesin güzel yayılmasını sağlar.' },
    { e: '📖', soru: 'Camide okunan kutsal kitabımız nedir?',   dogru: 'kuran',    id: 'cam-5',
      neden: 'Kur’an-ı Kerim bize güzel yolu gösterir.' },
    { e: '📿', soru: 'Zikir çekerken elimizde ne olur?',        dogru: 'tesbih',   id: 'cam-6',
      neden: 'Tesbih, saymayı kolaylaştırır.' },
    { e: '🧭', soru: 'İmamın önünde durduğu girinti nedir?',    dogru: 'mihrab',   id: 'cam-7',
      neden: 'Mihrap kıble yönünü gösterir.' },
    { e: '🔊', soru: 'Namaz vaktini haber veren ses nereden gelir?', dogru: 'minare', id: 'cam-8',
      neden: 'Ezan minareden okunur.' },
    { e: '👣', soru: 'Camiye girerken ayakkabıları ne yaparız?', dogru: 'seccade', id: 'cam-9',
      neden: 'Ayakkabıları çıkarırız ki namaz kıldığımız yer temiz kalsın.' },
    { e: '💧', soru: 'Namazdan önce ne yaparız?',               dogru: 'sadirvan', id: 'cam-10',
      neden: 'Abdest alarak temizleniriz.' },
    { e: '📚', soru: 'Camide hangi kitabı okuruz?',             dogru: 'kuran',    id: 'cam-11',
      neden: 'Kur’an, Allah’ın bize gönderdiği kitaptır.' },
    { e: '🏛️', soru: 'Caminin üstündeki büyük yarım küre?',     dogru: 'kubbe',    id: 'cam-12',
      neden: 'Kubbe hem güzel görünür hem içeriyi ferah yapar.' }
  ]
});

/* 2) Ramazan'ı Keşfet */
window.GameRamazan = Motor.secmece({
  id: 'ramazan', title: "Ramazan'ı<br>Keşfet", emoji: '🌙',
  intro: { id: 'sys-oyun-ramazan', text: "Ramazan'ı birlikte keşfedelim!" },
  havuz: {
    sahur:   { e: '🌌', t: 'Sahur',        id: 'rmz-sahur' },
    iftar:   { e: '🍽️', t: 'İftar',        id: 'rmz-iftar' },
    oruc:    { e: '🤲', t: 'Oruç',         id: 'rmz-oruc' },
    teravih: { e: '🕌', t: 'Teravih',      id: 'rmz-teravih' },
    sadaka:  { e: '💝', t: 'Sadaka',       id: 'rmz-sadaka' },
    hilal:   { e: '🌙', t: 'Hilal',        id: 'rmz-hilal' },
    davul:   { e: '🥁', t: 'Ramazan davulu', id: 'rmz-davul' }
  },
  durumlar: [
    { e: '🌌', soru: 'Sabah çok erken yenen yemeğe ne denir?', dogru: 'sahur',  id: 'ram-1',
      neden: 'Sahur, gün boyu güç vermesi için yenen yemektir.' },
    { e: '🌇', soru: 'Akşam ezanıyla açılan sofraya ne denir?',  dogru: 'iftar',  id: 'ram-2',
      neden: 'İftar, ailenin bir arada olduğu en güzel andır.' },
    { e: '🥁', soru: 'Sahura kalkalım diye sokakta ne çalınır?', dogru: 'davul',  id: 'ram-3',
      neden: 'Ramazan davulcusu eski ve güzel bir gelenektir.' },
    { e: '🌙', soru: 'Ramazan’ın gökyüzündeki işareti nedir?', dogru: 'hilal', id: 'ram-4',
      neden: 'İnce ay, yeni ayın başladığını gösterir.' },
    { e: '🕌', soru: 'Ramazan gecelerinde camide kılınan namaz?', dogru: 'teravih', id: 'ram-5',
      neden: 'Teravih sadece Ramazan’da kılınır.' },
    { e: '💝', soru: 'İhtiyacı olana verilen yardıma ne denir?',  dogru: 'sadaka', id: 'ram-6',
      neden: 'Sadaka, sevincimizi paylaşmaktır.' },
    { e: '⏳', soru: 'Sahurdan iftara kadar yemek yememeye ne denir?', dogru: 'oruc', id: 'ram-7',
      neden: 'Oruç, sabrı ve aç kalanı anlamayı öğretir.' },
    { e: '🍲', soru: 'Ezan okundu, sofraya oturduk. Bu vakit?',  dogru: 'iftar',  id: 'ram-8',
      neden: 'İftar vakti, oruç açma vaktidir.' },
    { e: '🧒', soru: 'Küçük çocuklar için oruç zorunlu değil ama ne yapabilirler?', dogru: 'sadaka', id: 'ram-9',
      neden: 'Küçükler paylaşarak, yardım ederek Ramazan’ı yaşar.' },
    { e: '⭐', soru: 'Ramazan hangi işaretle başlar?',            dogru: 'hilal',  id: 'ram-10',
      neden: 'Hilalin görünmesi Ramazan’ın müjdesidir.' },
    { e: '🌜', soru: 'Gece yarısından sonra kalkıp yenen yemek?', dogru: 'sahur',  id: 'ram-11',
      neden: 'Sahura kalkmak sünnettir, güç verir.' },
    { e: '🤲', soru: 'Ramazan’da tutulan ibadetin adı nedir?', dogru: 'oruc', id: 'ram-12',
      neden: 'Oruç Ramazan’ın en önemli ibadetidir.' }
  ]
});

/* 3) Bayram Hazırlığı */
window.GameBayram = Motor.davranis({
  id: 'bayram', title: 'Bayram<br>Hazırlığı', emoji: '🎁',
  intro: { id: 'sys-oyun-bayram', text: 'Bayrama nasıl hazırlanırız, öğrenelim!' },
  durumlar: [
    { e: '🛁', soru: 'Bayram sabahı ilk ne yaparız?',
      dogru: { e: '🚿', t: 'Yıkanıp temizleniriz' }, yanlis: { e: '😴', t: 'Uyumaya devam ederiz' },
      neden: 'Bayram sabahı temizlenmek, güne güzel başlamaktır.', id: 'byr-1' },
    { e: '👗', soru: 'Bayramda ne giyeriz?',
      dogru: { e: '✨', t: 'En güzel, temiz kıyafetimizi' }, yanlis: { e: '👕', t: 'Kirli pijamamızı' },
      neden: 'Bayram özel bir gündür, güzel giyinmek onu kutlamaktır.', id: 'byr-2' },
    { e: '🧓', soru: 'Büyüklerimizi görünce ne yaparız?',
      dogru: { e: '🤝', t: 'Elini öper, bayramını kutlarız' }, yanlis: { e: '🏃', t: 'Yanından geçeriz' },
      neden: 'Büyüklerin elini öpmek, saygımızı gösterir.', id: 'byr-3' },
    { e: '🍬', soru: 'Misafirler geldi, ne yaparız?',
      dogru: { e: '🍫', t: 'Şeker ikram ederiz' }, yanlis: { e: '🚪', t: 'Odamıza kaçarız' },
      neden: 'İkram etmek misafiri onurlandırmaktır.', id: 'byr-4' },
    { e: '💰', soru: 'Bayram harçlığı aldık, ne deriz?',
      dogru: { e: '🙏', t: '"Teşekkür ederim" deriz' }, yanlis: { e: '🤏', t: '"Az olmuş" deriz' },
      neden: 'Verilene teşekkür etmek, veren kişiyi mutlu eder.', id: 'byr-5' },
    { e: '🏠', soru: 'Bayramda uzaktaki dedemizi arayamadık.',
      dogru: { e: '📞', t: 'Telefonla bayramını kutlarız' }, yanlis: { e: '🤷', t: 'Boş veririz' },
      neden: 'Bir telefon bile büyükleri çok mutlu eder.', id: 'byr-6' },
    { e: '🕌', soru: 'Bayram sabahı camide ne kılınır?',
      dogru: { e: '🤲', t: 'Bayram namazı kılınır' }, yanlis: { e: '😪', t: 'Hiçbir şey yapılmaz' },
      neden: 'Bayram namazı, bayramın ilk güzelliğidir.', id: 'byr-7' },
    { e: '🧒', soru: 'Komşumuzun çocuğu bayramda yalnız.',
      dogru: { e: '🎈', t: 'Onu da oyunumuza çağırırız' }, yanlis: { e: '🙈', t: 'Görmezden geliriz' },
      neden: 'Bayram, kimsenin yalnız kalmaması gereken gündür.', id: 'byr-8' },
    { e: '🍽️', soru: 'Bayram sofrasında ilk kim yer?',
      dogru: { e: '🧓', t: 'Büyükler başlar, sonra biz' }, yanlis: { e: '⚡', t: 'Hemen biz başlarız' },
      neden: 'Sofra adabında büyüklere öncelik veririz.', id: 'byr-9' },
    { e: '🎁', soru: 'Bize hediye verildi ama beğenmedik.',
      dogru: { e: '😊', t: 'Yine de teşekkür ederiz' }, yanlis: { e: '😕', t: '"Bunu istemedim" deriz' },
      neden: 'Hediyenin değeri, verilirken düşünülen sevgidedir.', id: 'byr-10' },
    { e: '🕊️', soru: 'Bayramdan önce küs olduğumuz arkadaşımız var.',
      dogru: { e: '🤗', t: 'Barışmak için gideriz' }, yanlis: { e: '🚷', t: 'Küs kalırız' },
      neden: 'Bayram, küslüklerin bittiği gündür.', id: 'byr-11' },
    { e: '🧹', soru: 'Bayramdan önce ev dağınık.',
      dogru: { e: '✨', t: 'Temizliğe yardım ederiz' }, yanlis: { e: '📺', t: 'Televizyon izleriz' },
      neden: 'Bayram temizliğine yardım etmek de bayramın parçasıdır.', id: 'byr-12' }
  ]
});

/* 4) Minik Kâbe Yolculuğu — sıralama */
window.GameKabe = Motor.sirala({
  id: 'kabe', title: 'Minik Kâbe<br>Yolculuğu', emoji: '🕋',
  intro: { id: 'sys-oyun-kabe', text: 'Kâbe yolculuğunu sırayla dizelim!' },
  bitisMetni: 'Yolculuğu tamamladın!',
  devamSes: { id: 'sys-kabe-devam', text: 'Şimdi bütün yolculuğu dizelim!' },
  adimlar: [
    { e: '🤲', ad: 'Niyet eder, dua ederiz', id: 'kbe-1' },
    { e: '👕', ad: 'Beyaz ihram giyilir',    id: 'kbe-2' },
    { e: '✈️', ad: 'Mekke’ye gidilir',  id: 'kbe-3' },
    { e: '🕋', ad: 'Kâbe’yi görürüz',   id: 'kbe-4' },
    { e: '🔄', ad: 'Kâbe etrafında dönülür', id: 'kbe-5' },
    { e: '🚶', ad: 'Safa ile Merve arasında yürünür', id: 'kbe-6' },
    { e: '💧', ad: 'Zemzem suyu içilir',     id: 'kbe-7' },
    { e: '💖', ad: 'Dua edip veda ederiz',   id: 'kbe-8' }
  ],
  turlar: [4, 8]
});

/* 5) İyilik Ağacı */
window.GameAgac = Motor.davranis({
  id: 'agac', title: 'İyilik<br>Ağacı', emoji: '🌳',
  intro: { id: 'sys-oyun-agac', text: 'Her iyilik ağacımızı büyütür!' },
  durumlar: [
    { e: '🧓', soru: 'Komşu teyzenin poşetleri ağır.',
      dogru: { e: '💪', t: 'Taşımasına yardım ederiz' }, yanlis: { e: '🚶', t: 'Yanından geçeriz' },
      neden: 'Yardım etmek, kalbimizi de büyütür.', id: 'agc-1' },
    { e: '🐦', soru: 'Kışın kuşlar aç kalmış.',
      dogru: { e: '🌾', t: 'Balkona yem koyarız' }, yanlis: { e: '🪟', t: 'Perdeyi kapatırız' },
      neden: 'Bir avuç yem, bir kuşu kışa çıkarır.', id: 'agc-2' },
    { e: '🚮', soru: 'Parkta yerde çöpler var.',
      dogru: { e: '🧤', t: 'Toplayıp kutuya atarız' }, yanlis: { e: '🤷', t: '"Ben atmadım" deriz' },
      neden: 'Temiz bir park, herkesin hakkı.', id: 'agc-3' },
    { e: '💧', soru: 'Musluk boşuna akıyor.',
      dogru: { e: '🚰', t: 'Kapatırız' }, yanlis: { e: '👀', t: 'Bakıp geçeriz' },
      neden: 'Suyu boşa harcamamak da bir iyiliktir.', id: 'agc-4' },
    { e: '👶', soru: 'Küçük bir çocuk ağlıyor, annesi yok.',
      dogru: { e: '🙋', t: 'Bir büyüğe haber veririz' }, yanlis: { e: '😐', t: 'Görmezden geliriz' },
      neden: 'Yardım çağırmak, en doğru adımdır.', id: 'agc-5' },
    { e: '📚', soru: 'Artık okumadığımız kitaplarımız var.',
      dogru: { e: '🎁', t: 'İhtiyacı olana veririz' }, yanlis: { e: '📦', t: 'Kutuda çürütürüz' },
      neden: 'Bize lazım olmayan, başkasına hazine olabilir.', id: 'agc-6' },
    { e: '🌱', soru: 'Elimizde bir fide var.',
      dogru: { e: '🌳', t: 'Toprağa dikeriz' }, yanlis: { e: '🗑️', t: 'Atarız' },
      neden: 'Diktiğimiz her ağaç yıllarca gölge ve nefes verir.', id: 'agc-7' },
    { e: '🍞', soru: 'Sofrada ekmek artmış.',
      dogru: { e: '🧺', t: 'Saklar, ziyan etmeyiz' }, yanlis: { e: '🗑️', t: 'Çöpe atarız' },
      neden: 'Ekmek israfı, en büyük ziyandır.', id: 'agc-8' },
    { e: '🐕', soru: 'Sokak köpeği ürkek bir şekilde bakıyor.',
      dogru: { e: '💧', t: 'Su kabı bırakırız' }, yanlis: { e: '🪨', t: 'Taş atarız' },
      neden: 'Hayvana iyilik etmek, insanı yüceltir.', id: 'agc-9' },
    { e: '💡', soru: 'Boş odada ışık yanıyor.',
      dogru: { e: '🔌', t: 'Söndürürüz' }, yanlis: { e: '🚪', t: 'Kapatıp gideriz' },
      neden: 'Küçük tasarruflar dünyaya büyük iyilik yapar.', id: 'agc-10' },
    { e: '😢', soru: 'Sınıfta biri yalnız oturuyor.',
      dogru: { e: '🪑', t: 'Yanına oturur, konuşuruz' }, yanlis: { e: '👥', t: 'Kendi grubumuzda kalırız' },
      neden: 'Bir arkadaşlık teklifi, birinin gününü kurtarabilir.', id: 'agc-11' },
    { e: '🎈', soru: 'Bir çocuğun balonu uçtu, ağlıyor.',
      dogru: { e: '🎁', t: 'Kendi balonumuzu veririz' }, yanlis: { e: '😆', t: 'Güleriz' },
      neden: 'Vazgeçmek, sahip olmaktan daha güzel bir duygudur.', id: 'agc-12' }
  ]
});

/* 6) Bugünün İyiliği — her turda bir iyilik seçilir */
window.GameBugun = Motor.davranis({
  id: 'bugun', title: 'Bugünün<br>İyiliği', emoji: '🌟',
  intro: { id: 'sys-oyun-bugun', text: 'Bugün hangi iyiliği yapalım, seçelim!' },
  durumlar: [
    { e: '🌅', soru: 'Güne nasıl başlarız?',
      dogru: { e: '☀️', t: 'Ailemize günaydın deriz' }, yanlis: { e: '😑', t: 'Konuşmadan çıkarız' },
      neden: 'Güzel bir söz, günün tamamını değiştirir.', id: 'bgn-1' },
    { e: '🛏️', soru: 'Sabah yataktan kalktık.',
      dogru: { e: '🧹', t: 'Yatağımızı toplarız' }, yanlis: { e: '🌪️', t: 'Dağınık bırakırız' },
      neden: 'Günün ilk küçük başarısı, yatağı toplamaktır.', id: 'bgn-2' },
    { e: '🍽️', soru: 'Yemek bitti, sofra duruyor.',
      dogru: { e: '🥄', t: 'Tabağımızı kaldırırız' }, yanlis: { e: '🏃', t: 'Kalkıp gideriz' },
      neden: 'Küçük bir yardım, annemizi çok rahatlatır.', id: 'bgn-3' },
    { e: '🧸', soru: 'Odamız dağılmış.',
      dogru: { e: '🧺', t: 'Oyuncakları toplarız' }, yanlis: { e: '🚪', t: 'Kapıyı kapatırız' },
      neden: 'Kendi dağıttığımızı toplamak sorumluluktur.', id: 'bgn-4' },
    { e: '📞', soru: 'Dedemizi/babaannemizi uzun zamandır aramadık.',
      dogru: { e: '☎️', t: 'Arayıp hatırını sorarız' }, yanlis: { e: '📺', t: 'Televizyon izleriz' },
      neden: 'Bir "nasılsın", büyükleri günlerce mutlu eder.', id: 'bgn-5' },
    { e: '🪴', soru: 'Evdeki çiçeğin toprağı kurumuş.',
      dogru: { e: '💧', t: 'Suveririz' }, yanlis: { e: '👀', t: 'Bakıp geçeriz' },
      neden: 'Bize emanet edilen her canlı, bakım hakkına sahiptir.', id: 'bgn-6' },
    { e: '🎒', soru: 'Yarın için çantamız hazır değil.',
      dogru: { e: '📚', t: 'Akşamdan hazırlarız' }, yanlis: { e: '⏰', t: 'Sabah acele ederiz' },
      neden: 'Hazırlıklı olmak sabahı huzurlu yapar.', id: 'bgn-7' },
    { e: '👟', soru: 'Ayakkabılarımız ortada duruyor.',
      dogru: { e: '📥', t: 'Yerine kaldırırız' }, yanlis: { e: '🤷', t: 'Öyle bırakırız' },
      neden: 'Herkesin kolayca geçebilmesi için yolları açık tutalım.', id: 'bgn-8' },
    { e: '🤲', soru: 'Yatmadan önce ne yaparız?',
      dogru: { e: '🌙', t: 'Dua eder, teşekkür ederiz' }, yanlis: { e: '📱', t: 'Ekran açık uyuruz' },
      neden: 'Günü şükürle bitirmek huzur verir.', id: 'bgn-9' },
    { e: '🗣️', soru: 'Kardeşimiz bizden bir şey istedi.',
      dogru: { e: '💛', t: 'Güzelce yardım ederiz' }, yanlis: { e: '😤', t: 'Bağırırız' },
      neden: 'Kardeşimiz en yakın arkadaşımızdır.', id: 'bgn-10' },
    { e: '🧼', soru: 'Ellerimiz kirli ama acıkmışız.',
      dogru: { e: '💦', t: 'Önce ellerimizi yıkarız' }, yanlis: { e: '🍪', t: 'Hemen yeriz' },
      neden: 'Sağlık, her zaman acelenin önündedir.', id: 'bgn-11' },
    { e: '❤️', soru: 'Annemiz yorgun görünüyor.',
      dogru: { e: '🤗', t: 'Sarılıp yardım teklif ederiz' }, yanlis: { e: '🎮', t: 'Oyun oynamaya devam ederiz' },
      neden: 'Bir sarılma, en güzel iyiliktir.', id: 'bgn-12' }
  ]
});
