# Alya'nın Oyunları — v1

4 yaş için Türkçe, tamamen çevrimdışı çalışan eğitici oyun uygulaması (PWA).

## İçerik
- **Ana menü** — 2 aktif oyun + 6 "yakında" kategorisi, sağ üstte müzik aç/kapa
- **Sayıları Öğren (1–10)** — sayı gösterilir + sesli okunur, doğru sayıda nesneyi bulma
- **Renkler ve Şekiller** — renk / şekil / renk+şekil eşleştirme (3 kademeli zorluk)
- Her turda 10 soru, sonunda yıldız ödülü; yıldızlar cihazda saklanır

## Dosyalar
```
index.html              uygulama iskeleti
app.css                 tüm stiller
manifest.webmanifest    PWA tanımı (ad, ikon, tam ekran)
sw.js                   service worker — çevrimdışı çalışma
icon-*.png              uygulama ikonları (192, 512, maskable)
util.js                 yardımcılar
audio.js             seslendirme (Web Speech API, tr-TR) + sesler/müzik (Web Audio API)
mascot.js            maskot kedi (SVG, 3 ruh hali)
fx.js                konfeti / yıldız efektleri
game-numbers.js      sayı tanıma oyunu
game-shapes.js       renk-şekil oyunu
app.js               menü, oyun döngüsü, ödül, PWA kaydı
```

## Yayınlama
Bu klasörün içeriğini **HTTPS** üzerinden yayınlayan herhangi bir statik hosting yeter
(GitHub Pages, Netlify, Cloudflare Pages, kendi sunucun). HTTPS şart — service worker
ancak https:// veya localhost üzerinde çalışır.

### GitHub Pages ile (ücretsiz)
1. github.com'da yeni bir repo aç (ör. `alya-oyunlari`), **Public** seç.
2. Bu klasördeki tüm dosyaları repoya yükle (Add file → Upload files).
3. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)` → Save.
4. 1–2 dakika sonra adres hazır: `https://KULLANICIADIN.github.io/alya-oyunlari/`

## Tablete kurma
- **Android / Chrome:** adresi aç → menü → "Uygulamayı yükle" / "Ana ekrana ekle"
- **iPad / Safari:** adresi aç → Paylaş → "Ana Ekrana Ekle"

Kurulduktan sonra internet olmadan da çalışır (ilk açılışta dosyalar cihaza kaydedilir).

## Notlar
- Seslendirme cihazın kendi Türkçe ses motorunu kullanır. Tablette Türkçe ses paketi
  yüklü değilse Ayarlar → Dil/Erişilebilirlik → Metin okuma bölümünden eklenebilir.
- Reklam, dış bağlantı, veri toplama ve satın alma yoktur. Hiçbir veri cihaz dışına çıkmaz.
- Yıldız sayısı tarayıcının yerel deposunda tutulur.
