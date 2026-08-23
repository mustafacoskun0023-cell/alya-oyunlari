/* ===== Temizlik ve Görgü — 6 oyun ===== */

/* 1) El Yıkama — sıralama */
window.GameElyikama = Motor.sirala({
  id: 'elyikama', title: 'El<br>Yıkama', emoji: '🧼',
  intro: { id: 'sys-oyun-elyikama', text: 'Ellerimizi nasıl yıkarız? Sırayla dizelim!' },
  bitisMetni: 'Ellerin tertemiz oldu!',
  devamSes: { id: 'sys-elyikama-devam', text: 'Şimdi bütün adımları dizelim!' },
  adimlar: [
    { e: '🚰', ad: 'Musluğu açarız',            id: 'ely-1' },
    { e: '💧', ad: 'Ellerimizi ıslatırız',      id: 'ely-2' },
    { e: '🧼', ad: 'Sabun alırız',              id: 'ely-3' },
    { e: '🫧', ad: 'Köpürtüp ovarız',           id: 'ely-4' },
    { e: '🚿', ad: 'Bol suyla durularız',       id: 'ely-5' },
    { e: '🧻', ad: 'Havluyla kurularız',        id: 'ely-6' }
  ]
});

/* 2) Banyo Zamanı — sıralama */
window.GameBanyo = Motor.sirala({
  id: 'banyo', title: 'Banyo<br>Zamanı', emoji: '🛁',
  intro: { id: 'sys-oyun-banyo', text: 'Banyo yaparken ne sırayla yaparız?' },
  bitisMetni: 'Mis gibi oldun!',
  devamSes: { id: 'sys-banyo-devam', text: 'Şimdi bütün adımları dizelim!' },
  adimlar: [
    { e: '👕', ad: 'Kıyafetlerimizi çıkarırız', id: 'bny-1' },
    { e: '🌡️', ad: 'Suyu ılık ayarlarız',       id: 'bny-2' },
    { e: '🚿', ad: 'Vücudumuzu ıslatırız',      id: 'bny-3' },
    { e: '🧴', ad: 'Şampuanla saçımızı yıkarız', id: 'bny-4' },
    { e: '🧽', ad: 'Sabunla vücudumuzu ovarız', id: 'bny-5' },
    { e: '💦', ad: 'Bol suyla durularız',       id: 'bny-6' },
    { e: '🛁', ad: 'Havluya sarılırız',         id: 'bny-7' },
    { e: '🧥', ad: 'Temiz kıyafet giyeriz',     id: 'bny-8' }
  ],
  turlar: [4, 8]
});

/* 3) Günlük Rutinim — sıralama */
window.GameRutin = Motor.sirala({
  id: 'rutin', title: 'Günlük<br>Rutinim', emoji: '⏰',
  intro: { id: 'sys-oyun-rutin', text: 'Bir günümüz nasıl geçer? Sırayla dizelim!' },
  bitisMetni: 'Günün tam sırasıyla geçti!',
  devamSes: { id: 'sys-rutin-devam', text: 'Şimdi bütün günü dizelim!' },
  adimlar: [
    { e: '🌅', ad: 'Sabah uyanırız',        id: 'rtn-1' },
    { e: '🪥', ad: 'Dişlerimizi fırçalarız', id: 'rtn-2' },
    { e: '🥣', ad: 'Kahvaltı yaparız',      id: 'rtn-3' },
    { e: '🎒', ad: 'Hazırlanıp çıkarız',    id: 'rtn-4' },
    { e: '🧩', ad: 'Gün boyu oynar öğreniriz', id: 'rtn-5' },
    { e: '🍲', ad: 'Akşam yemeği yeriz',    id: 'rtn-6' },
    { e: '🛁', ad: 'Banyo yaparız',         id: 'rtn-7' },
    { e: '🌙', ad: 'Uyuruz',                id: 'rtn-8' }
  ],
  turlar: [4, 8]
});

/* 4) Toplanma Vakti — hangi eşya nereye? */
window.GameToplan = Motor.secmece({
  id: 'toplan', title: 'Toplanma<br>Vakti', emoji: '🧺',
  intro: { id: 'sys-oyun-toplan', text: 'Hangi eşya nereye gider, bulalım!' },
  havuz: {
    oyuncakkutu: { e: '🧺', t: 'Oyuncak sepeti', id: 'tpl-oyuncakkutu' },
    kitaplik:    { e: '📚', t: 'Kitaplık',       id: 'tpl-kitaplik' },
    dolap:       { e: '🚪', t: 'Dolap',          id: 'tpl-dolap' },
    kirlisepet:  { e: '🧦', t: 'Kirli sepeti',   id: 'tpl-kirlisepet' },
    cop:         { e: '🗑️', t: 'Çöp kutusu',     id: 'tpl-cop' },
    bulasik:     { e: '🍽️', t: 'Bulaşık',        id: 'tpl-bulasik' },
    ayakkabilik: { e: '👟', t: 'Ayakkabılık',    id: 'tpl-ayakkabilik' }
  },
  durumlar: [
    { e: '🧸', soru: 'Oyuncak ayı nereye gider?',      dogru: 'oyuncakkutu', id: 'tpn-1',
      neden: 'Oyuncaklar sepette durursa hem bulmak kolay olur hem oda derli toplu.' },
    { e: '📖', soru: 'Okuduğumuz kitap nereye gider?',  dogru: 'kitaplik',    id: 'tpn-2',
      neden: 'Kitaplar rafta durunca yıpranmaz.' },
    { e: '👕', soru: 'Giydiğimiz kirli tişört nereye?', dogru: 'kirlisepet',  id: 'tpn-3',
      neden: 'Kirli kıyafet sepete atılırsa yıkanır, oda da kokmaz.' },
    { e: '🍌', soru: 'Muz kabuğu nereye gider?',        dogru: 'cop',         id: 'tpn-4',
      neden: 'Yere atılan kabuğa basıp düşebiliriz.' },
    { e: '🥤', soru: 'Bittikten sonra bardak nereye?',  dogru: 'bulasik',     id: 'tpn-5',
      neden: 'Bardağı mutfağa götürmek büyük bir yardımdır.' },
    { e: '👟', soru: 'Eve girince ayakkabılar nereye?', dogru: 'ayakkabilik', id: 'tpn-6',
      neden: 'Ayakkabılar yerinde durursa evi kirletmez.' },
    { e: '🧥', soru: 'Temiz montumuz nereye asılır?',   dogru: 'dolap',       id: 'tpn-7',
      neden: 'Asılan mont buruşmaz, ertesi gün hazır olur.' },
    { e: '🧩', soru: 'Yapboz parçaları nereye?',        dogru: 'oyuncakkutu', id: 'tpn-8',
      neden: 'Parçalar kutuda durursa kaybolmaz.' },
    { e: '📰', soru: 'Yırtılmış kağıt nereye gider?',   dogru: 'cop',         id: 'tpn-9',
      neden: 'İşe yaramayan kağıt çöpe, temiz kağıt geri dönüşüme.' },
    { e: '🧦', soru: 'Giyilmiş çorap nereye gider?',    dogru: 'kirlisepet',  id: 'tpn-10',
      neden: 'Çoraplar sepete gitmezse hep kaybolur.' },
    { e: '🥄', soru: 'Yemek bitti, kaşık nereye?',      dogru: 'bulasik',     id: 'tpn-11',
      neden: 'Tabağımızı kendimiz kaldırmak sorumluluktur.' },
    { e: '🎨', soru: 'Boyama kitabı nereye gider?',     dogru: 'kitaplik',    id: 'tpn-12',
      neden: 'Kitaplar bir arada durursa kolay bulunur.' }
  ]
});

/* 5) Hapşırma ve Sağlık Adabı */
window.GameSaglik = Motor.davranis({
  id: 'saglik', title: 'Hapşırma<br>Adabı', emoji: '🤧',
  intro: { id: 'sys-oyun-saglik', text: 'Sağlığımızı nasıl koruruz, öğrenelim!' },
  durumlar: [
    { e: '🤧', soru: 'Hapşıracağız, ne yaparız?',
      dogru: { e: '💪', t: 'Dirseğimize hapşırırız' }, yanlis: { e: '🖐️', t: 'Avucumuza hapşırırız' },
      neden: 'Elimizle her yere dokunuruz. Dirsek mikropları yaymaz.', id: 'sag-1' },
    { e: '😷', soru: 'Öksürüğümüz var, ne yaparız?',
      dogru: { e: '🧻', t: 'Peçeteyle ağzımızı kaparız' }, yanlis: { e: '😮', t: 'Açık öksürürüz' },
      neden: 'Öksürükle çıkan damlacıklar başkalarını hasta edebilir.', id: 'sag-2' },
    { e: '🧻', soru: 'Peçeteye burnumuzu sildik, sonra?',
      dogru: { e: '🗑️', t: 'Çöpe atıp el yıkarız' }, yanlis: { e: '👖', t: 'Cebe koyarız' },
      neden: 'Kullanılmış peçete mikrop doludur, hemen çöpe gitmeli.', id: 'sag-3' },
    { e: '🍽️', soru: 'Yemekten önce ne yaparız?',
      dogru: { e: '🧼', t: 'Ellerimizi yıkarız' }, yanlis: { e: '🍗', t: 'Hemen başlarız' },
      neden: 'Mikroplar en çok ağızdan girer. El yıkamak en güçlü kalkandır.', id: 'sag-4' },
    { e: '🚻', soru: 'Tuvaletten çıkınca ne yaparız?',
      dogru: { e: '🧼', t: 'Sabunla el yıkarız' }, yanlis: { e: '🏃', t: 'Koşarak çıkarız' },
      neden: 'Tuvalet sonrası el yıkamak sağlığın ilk kuralıdır.', id: 'sag-5' },
    { e: '💧', soru: 'Gün içinde ne kadar su içmeliyiz?',
      dogru: { e: '🥛', t: 'Sık sık su içeriz' }, yanlis: { e: '🥤', t: 'Sadece şekerli içeriz' },
      neden: 'Su vücudumuzu çalıştırır. Şekerli içecek dişleri çürütür.', id: 'sag-6' },
    { e: '🤒', soru: 'Kendimizi kötü hissediyoruz.',
      dogru: { e: '🗣️', t: 'Anneye söyleriz' }, yanlis: { e: '🤐', t: 'Saklarız' },
      neden: 'Söylersek erken iyileşiriz. Saklamak hastalığı büyütür.', id: 'sag-7' },
    { e: '👀', soru: 'Ellerimiz kirliyken gözümüz kaşınıyor.',
      dogru: { e: '🧼', t: 'Önce elimizi yıkarız' }, yanlis: { e: '🖐️', t: 'Hemen ovuştururuz' },
      neden: 'Kirli elle göze dokunmak enfeksiyon yapabilir.', id: 'sag-8' },
    { e: '🍎', soru: 'Meyveyi yemeden önce?',
      dogru: { e: '💦', t: 'Suyla yıkarız' }, yanlis: { e: '😋', t: 'Direkt ısırırız' },
      neden: 'Meyvenin üstünde toz ve mikrop olabilir.', id: 'sag-9' },
    { e: '💤', soru: 'Gece geç oldu ama oyun oynuyoruz.',
      dogru: { e: '🛏️', t: 'Uyuma vaktinde yatarız' }, yanlis: { e: '🕹️', t: 'Sabaha kadar oynarız' },
      neden: 'Uyku, vücudumuzun kendini onardığı zamandır.', id: 'sag-10' },
    { e: '🥤', soru: 'Arkadaşımızın bardağından içmek istiyoruz.',
      dogru: { e: '🥛', t: 'Kendi bardağımızı kullanırız' }, yanlis: { e: '🤝', t: 'Aynı bardaktan içeriz' },
      neden: 'Aynı bardak, mikropları da paylaşmak demektir.', id: 'sag-11' },
    { e: '🏃', soru: 'Bütün gün ekran karşısındayız.',
      dogru: { e: '🤸', t: 'Kalkıp hareket ederiz' }, yanlis: { e: '📱', t: 'Oturmaya devam ederiz' },
      neden: 'Hareket etmek kaslarımızı ve kalbimizi güçlendirir.', id: 'sag-12' }
  ]
});

/* 6) Giyinme ve Düzen — hava/duruma göre kıyafet */
window.GameGiyinme = Motor.secmece({
  id: 'giyinme', title: 'Giyinme<br>ve Düzen', emoji: '👟',
  intro: { id: 'sys-oyun-giyinme', text: 'Bugün ne giyelim? Havaya bakalım!' },
  havuz: {
    mont:    { e: '🧥', t: 'Kalın mont',      id: 'giy-mont' },
    tisort:  { e: '👕', t: 'İnce tişört',     id: 'giy-tisort' },
    yagmurluk:{ e: '🧥', t: 'Yağmurluk',      id: 'giy-yagmurluk' },
    pijama:  { e: '🩳', t: 'Pijama',          id: 'giy-pijama' },
    esofman: { e: '🩱', t: 'Eşofman',         id: 'giy-esofman' },
    bere:    { e: '🧢', t: 'Bere ve atkı',    id: 'giy-bere' },
    sapka:   { e: '👒', t: 'Güneş şapkası',   id: 'giy-sapka' }
  },
  durumlar: [
    { e: '❄️', soru: 'Dışarısı çok soğuk, ne giyeriz?',       dogru: 'mont',      id: 'giy-1',
      neden: 'Kalın mont sıcaklığımızı içeride tutar.' },
    { e: '☀️', soru: 'Hava çok sıcak, ne giyeriz?',           dogru: 'tisort',    id: 'giy-2',
      neden: 'İnce kıyafet teri kurutur, serin tutar.' },
    { e: '🌧️', soru: 'Yağmur yağıyor, ne giyeriz?',           dogru: 'yagmurluk', id: 'giy-3',
      neden: 'Yağmurluk ıslanmamızı önler, hasta olmayız.' },
    { e: '🌙', soru: 'Uyuma vakti geldi, ne giyeriz?',        dogru: 'pijama',    id: 'giy-4',
      neden: 'Pijama rahattır, uykuda vücudumuzu sıkmaz.' },
    { e: '🤸', soru: 'Spor yapmaya gidiyoruz, ne giyeriz?',   dogru: 'esofman',   id: 'giy-5',
      neden: 'Eşofman rahat hareket etmemizi sağlar.' },
    { e: '🌬️', soru: 'Kar var ve rüzgar esiyor. Başımıza ne takarız?', dogru: 'bere', id: 'giy-6',
      neden: 'Vücut ısısının çoğu baştan kaçar. Bere çok işe yarar.' },
    { e: '🏖️', soru: 'Güneş çok kuvvetli, kafamıza ne takarız?', dogru: 'sapka',  id: 'giy-7',
      neden: 'Şapka güneş çarpmasından korur.' },
    { e: '⛄', soru: 'Kardan adam yapacağız, ne giyeriz?',    dogru: 'mont',      id: 'giy-8',
      neden: 'Karda uzun süre kalacaksak kalın giyinmeliyiz.' },
    { e: '🌊', soru: 'Denize gidiyoruz, güneş yakıyor.',      dogru: 'sapka',     id: 'giy-9',
      neden: 'Deniz kenarında güneş daha da kuvvetlidir.' },
    { e: '☔', soru: 'Sabah bulutlu, yağmur bekleniyor.',      dogru: 'yagmurluk', id: 'giy-10',
      neden: 'Hazırlıklı olmak, sonradan üşümekten iyidir.' },
    { e: '🏃', soru: 'Parkta koşacağız, ne giyeriz?',          dogru: 'esofman',   id: 'giy-11',
      neden: 'Dar kıyafetle koşmak zordur.' },
    { e: '🛏️', soru: 'Yataktan kalktık, hâlâ pijamayla mıyız?', dogru: 'tisort',  id: 'giy-12',
      neden: 'Gündüz gündüz kıyafeti giymek bizi güne hazırlar.' }
  ]
});
