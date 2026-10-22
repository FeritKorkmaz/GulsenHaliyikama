# Gülsen Halı Yıkama

Konya'daki Gülsen Halı Yıkama için hazırlanan hibrit tanıtım sitesi. Bölümler halinde akan ana sayfa, beş bağımsız hizmet detay sayfasına bağlanır.

## İçerik

- Halı, koltuk, yorgan ve battaniye, perde ve stor perde, yatak yıkama hizmetleri
- Hakkımızda ve iletişim sayfaları
- WhatsApp mesajı hazırlayan hizmet talebi formu
- Google Haritalar konumu, telefon ve WhatsApp bağlantıları
- Mobil menü, sık sorulan sorular ve hizmete özel SEO bilgileri

## Kullanım

`index.html` doğrudan tarayıcıda açılabilir. HTTP önizleme için Node.js ile:

```sh
npm start
```

Adres: http://localhost:4173

Harici paket kurulumu gerektirmez. Form bilgileri sunucuya kaydedilmez; ziyaretçi hazırlanan mesajı WhatsApp'ta kontrol edip gönderir.

## Düzenleme

Sayfa içerikleri ve ortak bölümler `scripts/build.mjs`, tasarım `assets/style.css`, etkileşimler `assets/site.js` içindedir.

```sh
npm run build
npm run check
```

HTML dosyaları üretilmiş içerikleriyle birlikte depoda tutulur; site JavaScript olmadan da okunabilir.

## Yayına hazırlık

Kök dizindeki HTML dosyaları, `robots.txt`, `assets/` ve `hizmetler/` klasörleri statik hosting'e yüklenebilir. Gerçek alan adı için `SITE_URL` ortam değişkenini ayarlayıp yeniden derleyerek canonical adresleri ve `sitemap.xml` dosyasını üretin. Ayrıntılar `BENI-OKU.txt` içindedir.

Görseller temsili stok fotoğraflardır. Kaynaklar ve yazı tipi lisansı `assets/` klasöründedir. Sitede kullanılan logo depoya dahildir; orijinal WhatsApp görselleri yerelde korunur.
