/* ===== Rutin motoruyla çalışan oyunlar ===== */

/* 1) Abdest — dünyada eşi olmayan etkileşimli hali.
      İbadet zaten sıralı fiziksel hareket dizisi; jestle öğreniliyor. */
window.GameAbdest = MotorRutin({
  id: 'abdest', title: 'Abdest<br>Alalım', emoji: '💧',
  intro: { id: 'sys-oyun-abdest', text: 'Hadi abdest alalım! Parlayan şeye dokun.' },
  bitis: 'Abdestin tamam oldu, maşallah!',
  kopukE: '💧',
  tekrar: 2,
  tekrarSes: { id: 'sys-abdest-tekrar', text: 'Bir kez daha, şimdi sen yap!' },
  arka: '<span class="rt-arka-e">🚿</span>',
  govde: '<span class="rt-govde-e">🧕</span>',
  adimlar: [
    { id: 'abd-1', e: '🤲', ad: 'Bismillah',        tip: 'dokun',
      yonerge: 'Önce Bismillah deriz. Ellere dokun.' },
    { id: 'abd-2', e: '🚰', ad: 'Musluğu açarız',   tip: 'dokun',
      yonerge: 'Musluğu açalım.' },
    { id: 'abd-3', e: '🖐️', ad: 'Ellerimizi yıkarız', tip: 'ovala',
      yonerge: 'Ellerini yıka. Parmağınla ovala!' },
    { id: 'abd-4', e: '👄', ad: 'Ağzımızı çalkalarız', tip: 'surukle',
      yonerge: 'Ağzını çalkala.' },
    { id: 'abd-5', e: '👃', ad: 'Burnumuza su veririz', tip: 'surukle',
      yonerge: 'Burnuna su ver.' },
    { id: 'abd-6', e: '😊', ad: 'Yüzümüzü yıkarız', tip: 'ovala',
      yonerge: 'Yüzünü yıka. Ovala bakalım!' },
    { id: 'abd-7', e: '💪', ad: 'Kollarımızı yıkarız', tip: 'ovala',
      yonerge: 'Kollarını yıka.' },
    { id: 'abd-8', e: '💧', ad: 'Başımızı mesh ederiz', tip: 'surukle',
      yonerge: 'Islak elini başına sür.' },
    { id: 'abd-9', e: '👂', ad: 'Kulaklarımızı mesh ederiz', tip: 'surukle',
      yonerge: 'Kulaklarını mesh et.' },
    { id: 'abd-10', e: '🦶', ad: 'Ayaklarımızı yıkarız', tip: 'ovala',
      yonerge: 'Ayaklarını yıka.' }
  ]
});

/* 2) El Yıkama */
window.GameElyikama = MotorRutin({
  id: 'elyikama', title: 'El<br>Yıkama', emoji: '🧼',
  intro: { id: 'sys-oyun-elyikama', text: 'Ellerimizi yıkayalım! Parlayan şeye dokun.' },
  bitis: 'Ellerin tertemiz oldu!',
  kopukE: '🫧',
  tekrar: 2,
  tekrarSes: { id: 'sys-elyikama-tekrar', text: 'Bir kez daha yapalım!' },
  arka: '<span class="rt-arka-e">🚿</span>',
  govde: '<span class="rt-govde-e">🙌</span>',
  adimlar: [
    { id: 'ely-1', e: '🚰', ad: 'Musluğu açarız',       tip: 'dokun',
      yonerge: 'Musluğu aç.' },
    { id: 'ely-2', e: '💧', ad: 'Ellerimizi ıslatırız', tip: 'surukle',
      yonerge: 'Ellerini ıslat.' },
    { id: 'ely-3', e: '🧼', ad: 'Sabun alırız',         tip: 'surukle',
      yonerge: 'Sabunu al.' },
    { id: 'ely-4', e: '🫧', ad: 'Köpürtüp ovarız',      tip: 'ovala',
      yonerge: 'Şimdi güzelce ovala! Yirmi saniye ovalıyoruz.' },
    { id: 'ely-5', e: '🚿', ad: 'Bol suyla durularız',  tip: 'ovala',
      yonerge: 'Bol suyla durula.' },
    { id: 'ely-6', e: '🧻', ad: 'Havluyla kurularız',   tip: 'surukle',
      yonerge: 'Havluyla kurula.' }
  ]
});

/* 3) Banyo Zamanı */
window.GameBanyo = MotorRutin({
  id: 'banyo', title: 'Banyo<br>Zamanı', emoji: '🛁',
  intro: { id: 'sys-oyun-banyo', text: 'Banyo zamanı! Parlayan şeye dokun.' },
  bitis: 'Mis gibi oldun!',
  kopukE: '🫧',
  arka: '<span class="rt-arka-e">🛁</span>',
  govde: '<span class="rt-govde-e">🧒</span>',
  adimlar: [
    { id: 'bny-1', e: '👕', ad: 'Kıyafetlerimizi çıkarırız', tip: 'dokun',
      yonerge: 'Önce kıyafetlerini çıkar.' },
    { id: 'bny-2', e: '🌡️', ad: 'Suyu ılık ayarlarız',       tip: 'dokun',
      yonerge: 'Suyu ılık yap. Çok sıcak olmasın!' },
    { id: 'bny-3', e: '🚿', ad: 'Islanırız',                 tip: 'surukle',
      yonerge: 'Şimdi ıslan.' },
    { id: 'bny-4', e: '🧴', ad: 'Şampuanla saçımızı yıkarız', tip: 'ovala',
      yonerge: 'Saçını şampuanla ovala.' },
    { id: 'bny-5', e: '🧽', ad: 'Sabunla ovarız',            tip: 'ovala',
      yonerge: 'Vücudunu sabunla ovala.' },
    { id: 'bny-6', e: '💦', ad: 'Durularız',                 tip: 'ovala',
      yonerge: 'Bol suyla durula.' },
    { id: 'bny-7', e: '🛁', ad: 'Havluya sarılırız',         tip: 'surukle',
      yonerge: 'Havluya sarıl.' },
    { id: 'bny-8', e: '🧥', ad: 'Temiz kıyafet giyeriz',     tip: 'surukle',
      yonerge: 'Temiz kıyafetini giy.' }
  ]
});

/* 4) Diş Fırçalama — mevcut interaktif oyun korunuyor, sadece
      hazırlık/bitiş adımları rutin motoruna taşındı olsaydı
      diş silme jesti kaybolurdu. game-dis.js kendi haliyle kalıyor. */
