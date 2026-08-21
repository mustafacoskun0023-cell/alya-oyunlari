# Alya'nın Oyunları — v2

4 yaş için Türkçe, tamamen çevrimdışı çalışan eğitici oyun uygulaması (PWA).

**Canlı:** https://mustafacoskun0023-cell.github.io/alya-oyunlari/

## Oyunlar

| Oyun | İçerik |
|---|---|
| **Sayıları Öğren** | 1–10 arası sayılar; sayı gösterilip seslendirilir, o adette nesne bulunur |
| **Renkler ve Şekiller** | 7 renk × 6 şekil; önce renk, sonra şekil, sonra ikisi birlikte |
| **Harfleri Öğren** | Türk alfabesi 28 harf; aynı harfi bulma + ilk sesi tanıma |
| **Hafıza Oyunu** | Kart çevirme; 3 seviye (3 → 4 → 6 çift) |

Yakında: Arap harfleri, hareket oyunu, duygu tanıma, çizim.

Her tur sonunda performansa göre 1–3 yıldız. Yıldızlar cihazda birikir.

## Dosyalar
```
index.html              uygulama iskeleti
app.css                 tüm stiller
manifest.webmanifest    PWA tanımı
sw.js                   service worker — çevrimdışı çalışma
icon-*.png              uygulama ikonları (192, 512, maskable)
util.js                 yardımcılar
audio.js                seslendirme + sesler/müzik (Web Audio API)
mascot.js               maskot kedi (SVG, 3 ruh hali)
fx.js                   konfeti / yıldız efektleri
game-numbers.js         sayı tanıma
game-shapes.js          renk-şekil eşleştirme
game-letters.js         harf tanıma
game-memory.js          hafıza oyunu
app.js                  menü, oyun döngüsü, ödül, PWA kaydı
sesler/                 (opsiyonel) kayıtlı seslendirme klipleri
```

Tüm dosyalar repo kökünde — GitHub'ın web yükleyicisi alt klasör yapısını korumadığı için.

## Seslendirme
Uygulama önce `sesler/<id>.mp3` dosyasını arar; bulamazsa cihazın kendi konuşma
motoruna (Web Speech API, tr-TR) düşer. Yani ses dosyaları eksikken de çalışır,
klipler eklendikçe kalite yükselir. Klip listesi ve metinler proje dokümanlarında.

## Kurulum
- **Android / Chrome:** adresi aç → menü → "Uygulamayı yükle"
- **iPad / Safari:** adresi aç → Paylaş → "Ana Ekrana Ekle"

İlk açılıştan sonra internet olmadan da çalışır.

## Notlar
- Reklam, dış bağlantı, satın alma ve veri toplama yok. Hiçbir veri cihaz dışına çıkmaz.
- Yıldızlar ve müzik tercihi tarayıcının yerel deposunda tutulur.
