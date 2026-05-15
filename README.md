# 🍯 Beebook — Arıcının El Defteri

Arıcılar için mobil öncelikli, offline-first kovan yönetim uygulaması.

**Canlı uygulama:** [kamilsaim.github.io/beebook](https://kamilsaim.github.io/beebook/)

---

## Özellikler

### Kovan Yönetimi
- Langstroth, Dadant, Yerli, Çerçeveli, Ana Arı Kovanı, Nükleus (Ruşet) tipleri
- Her tipe özel SVG illüstrasyon
- Grid / Liste görünüm toggle
- QR kod ile kovan arama
- Ana arı durumu takibi (Var, Yok, Bakire, Meme Var, Bilinmiyor)
- Ana arı renk kodu sistemi (yıla göre otomatik)
- Toplu kovan ekleme

### Ana Arı Üretimi
- Seri bazlı takip: ırk, kuşak, damızlık kovan
- Gelişim timeline: Transfer → Kapanma (G8) → Pupa (G10) → Çıkım (G16) → Dağıtım (G20)
- Meme başına durum takibi

### Finansal Takip
- Satış kayıtları: Bal, Ana Arı, Arı Sütü, Petek Bal, Karakovan Bal, Arı Satışı
- Ödeme türleri: Nakit, Havale, Veresiye, Hediye, Zekat
- Gider kayıtları ve kategori grafikleri
- Finansal özet ve dağılım grafikleri

### Stok Yönetimi
- Süzme Bal, Petek Bal, Arı Sütü, Karakovan Bal takibi
- Hasat kaydında otomatik stok artışı
- Satışlarda otomatik stok düşümü

### Hava Durumu
- Güncel durum: sıcaklık, nem, rüzgar, hissedilen
- Saatlik tahmin şeridi (sonraki 12 saat)
- open-meteo.com API (ücretsiz, anahtar gerektirmez)

### Diğer
- Arı sütü hasat kayıtları ve grafik
- Görev listesi
- Sezon yönetimi
- Karanlık tema + yazı boyutu ayarı

---

## Teknik Yapı

| | |
|---|---|
| **Frontend** | Vanilla HTML + CSS + JavaScript (framework yok) |
| **Yerel Veri** | localStorage |
| **Bulut Sync** | Supabase (PostgreSQL) |
| **Auth** | Google OAuth via Supabase |
| **Hosting** | GitHub Pages |
| **Hava Durumu** | open-meteo.com |
| **QR Okuma** | BarcodeDetector API |

---

## Kurulum

Uygulama tarayıcıda doğrudan çalışır, herhangi bir kurulum gerektirmez.

```
# Repoyu klonla
git clone https://github.com/kamilsaim/beebook.git

# aricilik.html dosyasını tarayıcıda aç — bu kadar.
```

**Mobil kurulum:** Tarayıcıda aç → "Ana Ekrana Ekle" ile PWA gibi yükle.

---

## Veri ve Gizlilik

- Tüm veriler cihazınızda (localStorage) saklanır.
- Google ile giriş yapıldığında veriler Supabase'e yedeklenir.
- Giriş yapmadan da tam işlevsel olarak kullanılabilir (offline mod).
- Ayarlar → Yedek bölümünden JSON olarak dışa/içe aktarım yapılabilir.

---

## Versiyon

**v1.4** — Mayıs 2026

- Supabase entegrasyonu ve Google OAuth
- Offline-first mimari, otomatik çift yönlü senkronizasyon
- Sync badge göstergesi
- GitHub Pages ve GitHub Actions otomatik deploy

---

## Lisans

Kişisel kullanım için geliştirilmiştir.
