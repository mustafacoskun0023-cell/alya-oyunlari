/* Alya'nın Oyunları — Service Worker (tam offline) */
const CACHE = 'alya-v4.0.0';

/* Uygulamanın çalışması için zorunlu dosyalar */
const CORE = [
  './',
  './index.html',
  './app.css',
  './manifest.webmanifest',
  './util.js',
  './audio.js',
  './mascot.js',
  './fx.js',
  './game-numbers.js',
  './game-shapes.js',
  './game-letters.js',
  './game-memory.js',
  './game-dua.js',
  './game-abdest.js',
  './app.js',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

/* Seslendirme klipleri — eksik olan varsa kurulum bozulmaz, sadece o klip atlanır
   (uygulama o cümleyi cihazın kendi ses motoruyla okur) */
const SES = [
  'sys-merhaba',
  'sys-oyun-sayi',
  'sys-oyun-renk',
  'sys-yakinda',
  'sys-yildiz-1',
  'sys-yildiz-2',
  'sys-yildiz-3',
  'ovgu-1',
  'ovgu-2',
  'ovgu-3',
  'ovgu-4',
  'ovgu-5',
  'ovgu-6',
  'ovgu-7',
  'tekrar-1',
  'tekrar-2',
  'tekrar-3',
  'tekrar-4',
  'sayi-1',
  'sayi-2',
  'sayi-3',
  'sayi-4',
  'sayi-5',
  'sayi-6',
  'sayi-7',
  'sayi-8',
  'sayi-9',
  'sayi-10',
  'soru-1',
  'soru-2',
  'soru-3',
  'soru-4',
  'soru-5',
  'soru-6',
  'soru-7',
  'soru-8',
  'soru-9',
  'soru-10',
  'nesne-elma',
  'nesne-muz',
  'nesne-cilek',
  'nesne-yildiz',
  'nesne-balik',
  'nesne-balon',
  'nesne-ugurbocegi',
  'nesne-cicek',
  'nesne-kurabiye',
  'nesne-civciv',
  'nesne-kelebek',
  'nesne-araba',
  'renk-kirmizi',
  'renk-mavi',
  'renk-sari',
  'renk-yesil',
  'renk-turuncu',
  'renk-mor',
  'renk-pembe',
  'sekil-daire',
  'sekil-kare',
  'sekil-ucgen',
  'sekil-yildiz',
  'sekil-kalp',
  'sekil-dikdortgen',
  'rs-kirmizi-daire',
  'rs-kirmizi-kare',
  'rs-kirmizi-ucgen',
  'rs-kirmizi-yildiz',
  'rs-kirmizi-kalp',
  'rs-kirmizi-dikdortgen',
  'rs-mavi-daire',
  'rs-mavi-kare',
  'rs-mavi-ucgen',
  'rs-mavi-yildiz',
  'rs-mavi-kalp',
  'rs-mavi-dikdortgen',
  'rs-sari-daire',
  'rs-sari-kare',
  'rs-sari-ucgen',
  'rs-sari-yildiz',
  'rs-sari-kalp',
  'rs-sari-dikdortgen',
  'rs-yesil-daire',
  'rs-yesil-kare',
  'rs-yesil-ucgen',
  'rs-yesil-yildiz',
  'rs-yesil-kalp',
  'rs-yesil-dikdortgen',
  'rs-turuncu-daire',
  'rs-turuncu-kare',
  'rs-turuncu-ucgen',
  'rs-turuncu-yildiz',
  'rs-turuncu-kalp',
  'rs-turuncu-dikdortgen',
  'rs-mor-daire',
  'rs-mor-kare',
  'rs-mor-ucgen',
  'rs-mor-yildiz',
  'rs-mor-kalp',
  'rs-mor-dikdortgen',
  'rs-pembe-daire',
  'rs-pembe-kare',
  'rs-pembe-ucgen',
  'rs-pembe-yildiz',
  'rs-pembe-kalp',
  'rs-pembe-dikdortgen',
  'sys-oyun-harf',
  'sys-harf-ayni',
  'sys-harf-ses',
  'sys-oyun-hafiza',
  'sys-hafiza-esles',
  'sys-hafiza-devam',
  'harf-a',
  'harf-b',
  'harf-c',
  'harf-cc',
  'harf-d',
  'harf-e',
  'harf-f',
  'harf-g',
  'harf-h',
  'harf-ii',
  'harf-i',
  'harf-j',
  'harf-k',
  'harf-l',
  'harf-m',
  'harf-n',
  'harf-o',
  'harf-oo',
  'harf-p',
  'harf-r',
  'harf-s',
  'harf-ss',
  'harf-t',
  'harf-u',
  'harf-uu',
  'harf-v',
  'harf-y',
  'harf-z',
  'kelime-aslan',
  'kelime-balik',
  'kelime-civciv',
  'kelime-cilek',
  'kelime-davul',
  'kelime-elma',
  'kelime-fil',
  'kelime-gul',
  'kelime-horoz',
  'kelime-isik',
  'kelime-inek',
  'kelime-jaguar',
  'kelime-kedi',
  'kelime-limon',
  'kelime-muz',
  'kelime-nota',
  'kelime-otobus',
  'kelime-ordek',
  'kelime-pasta',
  'kelime-robot',
  'kelime-sut',
  'kelime-sapka',
  'kelime-top',
  'kelime-ucak',
  'kelime-uzum',
  'kelime-vazo',
  'kelime-yildiz',
  'kelime-zurafa',
  'sys-oyun-dua', 'sys-oyun-abdest', 'sys-abdest-devam',
  'soz-bismillah', 'soz-elhamdulillah', 'soz-masallah',
  'soz-insallah', 'soz-selam', 'soz-razi',
  'dua-yemek-basi', 'dua-yemek-sonu', 'dua-guzel', 'dua-eve-girer', 'dua-yardim',
  'dua-yarin', 'dua-ise-basla', 'dua-iyilesme', 'dua-bebek', 'dua-cami',
  'abdest-1', 'abdest-2', 'abdest-3', 'abdest-4', 'abdest-5', 'abdest-6'
].map(id => './sesler/' + id + '.mp3');

/* Görseller — eksik olan varsa kurulum bozulmaz */
const GORSEL = [
  'elif',
  'kategori-ahlak',
  'kategori-dini',
  'kategori-hareket',
  'kategori-harf',
  'kategori-moda',
  'kategori-yaratici',
  'kategori-zeka',
  'lina',
  'mina-alkis',
  'mina-dua',
  'mina-dusunuyor',
  'mina-mutlu',
  'mina-normal',
  'mina-uzgun',
  'oyun-abdest',
  'oyun-agac',
  'oyun-arapharf',
  'oyun-bahce',
  'oyun-bayram',
  'oyun-boyama',
  'oyun-bugun',
  'oyun-cami',
  'oyun-cizim',
  'oyun-dua',
  'oyun-duygu',
  'oyun-empati',
  'oyun-gorev',
  'oyun-guzelsoz',
  'oyun-hareket',
  'oyun-hikaye',
  'oyun-ilahi',
  'oyun-kabe',
  'oyun-kelime',
  'oyun-kombin',
  'oyun-letters',
  'oyun-memory',
  'oyun-moda',
  'oyun-muzik',
  'oyun-nefes',
  'oyun-numbers',
  'oyun-paylasma',
  'oyun-peygamber',
  'oyun-ramazan',
  'oyun-renkuyum',
  'oyun-shapes',
  'rozet-1',
  'rozet-2',
  'rozet-3',
  'rozet-4',
  'rozet-5',
  'sare',
  'zeynep'
].map(id => './gorseller/' + id + '.webp');

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE);                                  // zorunlu
    await Promise.allSettled(SES.map(u => c.add(u)));      // opsiyonel
    await Promise.allSettled(GORSEL.map(u => c.add(u)));   // opsiyonel
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy));
        return r;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(r => {
        if (r && r.status === 200) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
