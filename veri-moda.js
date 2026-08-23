/* ===== Moda ve Stil — 3 oyun ===== */

/* 1) Moda Atölyesi — hangi parça hangi duruma uygun */
window.GameModa = Motor.secmece({
  id: 'moda', title: 'Moda<br>Atölyesi', emoji: '👗',
  intro: { id: 'sys-oyun-moda', text: 'Hangi kıyafet nereye yakışır, birlikte seçelim!' },
  havuz: {
    elbise:   { e: '👗', t: 'Şık elbise',    id: 'mda-elbise' },
    esofman:  { e: '🩱', t: 'Eşofman',       id: 'mda-esofman' },
    pijama:   { e: '🩳', t: 'Pijama',        id: 'mda-pijama' },
    mayo:     { e: '🩴', t: 'Deniz kıyafeti', id: 'mda-mayo' },
    palto:    { e: '🧥', t: 'Palto',         id: 'mda-palto' },
    tunik:    { e: '🥻', t: 'Uzun tunik',    id: 'mda-tunik' },
    tulum:    { e: '👘', t: 'Rahat tulum',   id: 'mda-tulum' }
  },
  durumlar: [
    { e: '🎂', soru: 'Doğum günü partisine gidiyoruz.',   dogru: 'elbise',  id: 'mod-1',
      neden: 'Özel günlerde şık giyinmek, o günü kutlamaktır.' },
    { e: '⚽', soru: 'Parkta koşup oynayacağız.',          dogru: 'esofman', id: 'mod-2',
      neden: 'Rahat kıyafetle daha çok koşabiliriz.' },
    { e: '🌙', soru: 'Uyuma vakti geldi.',                dogru: 'pijama',  id: 'mod-3',
      neden: 'Pijama, uykuda vücudumuzu sıkmaz.' },
    { e: '🏖️', soru: 'Denize gidiyoruz.',                 dogru: 'mayo',    id: 'mod-4',
      neden: 'Deniz kıyafeti çabuk kurur, rahat yüzeriz.' },
    { e: '❄️', soru: 'Dışarısı buz gibi.',                dogru: 'palto',   id: 'mod-5',
      neden: 'Kalın palto soğuk havada bizi korur.' },
    { e: '🕌', soru: 'Camiye gidiyoruz.',                 dogru: 'tunik',   id: 'mod-6',
      neden: 'Camiye giderken sade ve kapalı giyiniriz.' },
    { e: '🏡', soru: 'Bugün evde oyun oynayacağız.',       dogru: 'tulum',   id: 'mod-7',
      neden: 'Evde rahat kıyafet en iyisidir.' },
    { e: '📸', soru: 'Aile fotoğrafı çektireceğiz.',       dogru: 'elbise',  id: 'mod-8',
      neden: 'Fotoğraf uzun yıllar kalır, güzel görünmek isteriz.' },
    { e: '🤸', soru: 'Jimnastik dersimiz var.',            dogru: 'esofman', id: 'mod-9',
      neden: 'Spor kıyafeti hareketi kolaylaştırır.' },
    { e: '☔', soru: 'Yağmurlu ve soğuk bir gün.',          dogru: 'palto',   id: 'mod-10',
      neden: 'Kalın giyinmek hastalanmamızı önler.' },
    { e: '🍽️', soru: 'Akşam misafirliğe gidiyoruz.',       dogru: 'tunik',   id: 'mod-11',
      neden: 'Misafirliğe düzgün giyinmek saygı göstergesidir.' },
    { e: '🛋️', soru: 'Kanepede kitap okuyacağız.',         dogru: 'tulum',   id: 'mod-12',
      neden: 'Rahat kıyafetle kitap okumak keyiflidir.' }
  ]
});

/* 2) Kombin Oyunu — hangi parça hangisiyle gider */
window.GameKombin = Motor.secmece({
  id: 'kombin', title: 'Kombin<br>Oyunu', emoji: '👜',
  intro: { id: 'sys-oyun-kombin', text: 'Hangi parçalar birbirine yakışır, bakalım!' },
  havuz: {
    bot:      { e: '🥾', t: 'Bot',          id: 'kmb-bot' },
    sandalet: { e: '🩴', t: 'Sandalet',     id: 'kmb-sandalet' },
    spor:     { e: '👟', t: 'Spor ayakkabı', id: 'kmb-spor' },
    sapka:    { e: '👒', t: 'Şapka',        id: 'kmb-sapka' },
    atki:     { e: '🧣', t: 'Atkı',         id: 'kmb-atki' },
    canta:    { e: '👜', t: 'Çanta',        id: 'kmb-canta' },
    gozluk:   { e: '🕶️', t: 'Güneş gözlüğü', id: 'kmb-gozluk' }
  },
  durumlar: [
    { e: '🧥', soru: 'Kalın palto giydik. Ayağımıza ne giyeriz?', dogru: 'bot',      id: 'kmb-1',
      neden: 'Kışlık paltoya bot yakışır ve ayağımızı sıcak tutar.' },
    { e: '👗', soru: 'Yazlık elbise giydik. Ayağımıza ne?',       dogru: 'sandalet', id: 'kmb-2',
      neden: 'Yaz elbisesiyle sandalet hem serin hem şık.' },
    { e: '🩱', soru: 'Eşofman giydik. Ayağımıza ne giyeriz?',      dogru: 'spor',     id: 'kmb-3',
      neden: 'Spor kıyafetin arkadaşı spor ayakkabıdır.' },
    { e: '☀️', soru: 'Güneş çok parlak. Gözümüze ne takarız?',     dogru: 'gozluk',   id: 'kmb-4',
      neden: 'Güneş gözlüğü gözlerimizi korur.' },
    { e: '❄️', soru: 'Boynumuz üşüyor. Ne takarız?',              dogru: 'atki',     id: 'kmb-5',
      neden: 'Atkı boynumuzu sıcak tutar, boğaz ağrısını önler.' },
    { e: '🏖️', soru: 'Plaja gidiyoruz, başımıza ne takarız?',      dogru: 'sapka',    id: 'kmb-6',
      neden: 'Şapka güneşten korur.' },
    { e: '🛍️', soru: 'Eşyalarımızı nasıl taşırız?',               dogru: 'canta',    id: 'kmb-7',
      neden: 'Çanta ellerimizi serbest bırakır.' },
    { e: '⛄', soru: 'Karda yürüyeceğiz. Ayağımıza ne?',           dogru: 'bot',      id: 'kmb-8',
      neden: 'Bot su geçirmez, ayağımız ıslanmaz.' },
    { e: '🏃', soru: 'Koşu yapacağız. Ayağımıza ne?',              dogru: 'spor',     id: 'kmb-9',
      neden: 'Spor ayakkabı ayağımızı yorulmaktan korur.' },
    { e: '🌊', soru: 'Deniz kenarında yürüyeceğiz.',              dogru: 'sandalet', id: 'kmb-10',
      neden: 'Sandalet kumda rahat, çabuk kurur.' },
    { e: '🌬️', soru: 'Soğuk rüzgar var, kulaklarımız üşüyor.',     dogru: 'atki',     id: 'kmb-11',
      neden: 'Atkıyı kulaklarımıza kadar çekebiliriz.' },
    { e: '☀️', soru: 'Öğle güneşinde parkta oynayacağız.',         dogru: 'sapka',    id: 'kmb-12',
      neden: 'Şapkasız uzun süre güneşte kalmak başımızı ağrıtır.' }
  ]
});

/* 3) Renk Uyumu */
window.GameRenkuyum = Motor.secmece({
  id: 'renkuyum', title: 'Renk<br>Uyumu', emoji: '🎀',
  intro: { id: 'sys-oyun-renkuyum', text: 'Hangi renkler birbirine yakışır, bulalım!' },
  havuz: {
    kirmizi: { e: '🟥', t: 'Kırmızı', id: 'ru-kirmizi' },
    mavi:    { e: '🟦', t: 'Mavi',    id: 'ru-mavi' },
    sari:    { e: '🟨', t: 'Sarı',    id: 'ru-sari' },
    yesil:   { e: '🟩', t: 'Yeşil',   id: 'ru-yesil' },
    mor:     { e: '🟪', t: 'Mor',     id: 'ru-mor' },
    turuncu: { e: '🟧', t: 'Turuncu', id: 'ru-turuncu' },
    beyaz:   { e: '⬜', t: 'Beyaz',   id: 'ru-beyaz' }
  },
  durumlar: [
    { e: '🍓', soru: 'Çilek hangi renktir?',            dogru: 'kirmizi', id: 'ryu-1',
      neden: 'Olgun çilek kıpkırmızı olur.' },
    { e: '🌊', soru: 'Deniz hangi renktir?',            dogru: 'mavi',    id: 'ryu-2',
      neden: 'Deniz gökyüzünü yansıtır, mavi görünür.' },
    { e: '🍋', soru: 'Limon hangi renktir?',            dogru: 'sari',    id: 'ryu-3',
      neden: 'Limon sapsarıdır.' },
    { e: '🌿', soru: 'Yapraklar hangi renktir?',        dogru: 'yesil',   id: 'ryu-4',
      neden: 'Yapraklar yeşildir, bitkiye güneşten yemek yapar.' },
    { e: '🍇', soru: 'Üzüm hangi renk olabilir?',       dogru: 'mor',     id: 'ryu-5',
      neden: 'Siyah üzüm aslında koyu mordur.' },
    { e: '🥕', soru: 'Havuç hangi renktir?',            dogru: 'turuncu', id: 'ryu-6',
      neden: 'Havuç turuncudur, gözlerimize çok iyi gelir.' },
    { e: '☁️', soru: 'Bulutlar hangi renktir?',         dogru: 'beyaz',   id: 'ryu-7',
      neden: 'Bulutlar pamuk gibi bembeyazdır.' },
    { e: '🍅', soru: 'Domates hangi renktir?',          dogru: 'kirmizi', id: 'ryu-8',
      neden: 'Olgunlaşan domates kırmızıya döner.' },
    { e: '🌻', soru: 'Ayçiçeğinin yaprakları?',         dogru: 'sari',    id: 'ryu-9',
      neden: 'Ayçiçeği güneş gibi sarıdır.' },
    { e: '🥦', soru: 'Brokoli hangi renktir?',          dogru: 'yesil',   id: 'ryu-10',
      neden: 'Yeşil sebzeler bizi güçlü yapar.' },
    { e: '❄️', soru: 'Kar hangi renktir?',              dogru: 'beyaz',   id: 'ryu-11',
      neden: 'Kar taneleri ışığı yansıttığı için beyaz görünür.' },
    { e: '🎃', soru: 'Bal kabağı hangi renktir?',       dogru: 'turuncu', id: 'ryu-12',
      neden: 'Bal kabağı turuncudur.' }
  ]
});
