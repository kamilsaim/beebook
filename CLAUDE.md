# Beebook — Proje Bağlamı

Ana dosya: **aricilik.html** — CSS, HTML ve JavaScript tek dosyada.

**Canlı URL:** https://kamilsaim.github.io/beebook/

---

## Proje Nedir?

Beebook, arıcılar için mobil-öncelikli bir yönetim uygulaması. Slogan: "Arıcının El Defteri". Offline-first çalışır (hava durumu hariç), localStorage birincil depo, Supabase senkronizasyon hedefi.

**Erişim:** GitHub Pages üzerinden veya dosyayı tarayıcıda aç. Telefona ana ekrana ekle ile PWA gibi kurulabilir.

---

## Teknik Yapı

- **Dil:** Vanilla HTML + CSS + JavaScript (framework yok)
- **Yerel veri:** `localStorage` — key: `aribook_data` ve `aribook_settings`
- **Bulut sync:** Supabase (PostgreSQL + Auth) — `user_data` tablosu
- **Auth:** Google OAuth via Supabase
- **Hava durumu API:** open-meteo.com (ücretsiz, anahtar gerektirmez)
- **Harita/Geocoding:** geocoding-api.open-meteo.com
- **QR okuma:** BarcodeDetector API (Chrome/Android öncelikli) + jsQR fallback (iOS/Firefox dahil tüm tarayıcılar)
- **Hosting:** GitHub Pages (`kamilsaim/beebook`)
- **Satır sayısı:** ~3500 satır

---

## Supabase Bilgileri

- **Proje:** beebook (`pdxnpnlwrtswwifevlil`) — eu-central-1
- **URL:** `https://pdxnpnlwrtswwifevlil.supabase.co`
- **Tablo:** `user_data` (user_id PK, data JSONB, settings JSONB, updated_at)
- **RLS:** Açık — her kullanıcı yalnızca kendi satırını görür
- **Auth provider:** Google OAuth
- **Keep-alive:** GitHub Actions `.github/workflows/keep-alive.yml` (her 3 günde ping)

---

## Veri Modeli

```javascript
data = {
  hives: [{
    id, num, type, queenStatus, queenColor, strength,
    race, generation, year, notes, createdAt
  }],
  sales: [{
    id, type, customer, date, qty, unit, price, total, payment, note
  }],
  expenses: [{
    id, type, amount, date, desc
  }],
  milk: [{
    id, amount, date, hiveCount, note
  }],
  queens: [{           // Ana arı üretim serileri
    id, name, race, generation,
    motherHive,        // Damızlık kovan id
    starterHive,       // Başlatıcı kovan id
    transfer,          // Larva transfer tarihi
    grafted,           // Graftlanan sayısı
    accepted,          // Tutan (meme) sayısı
    emerged,           // Çıkan sayısı
    sold,
    status,            // 'active' | 'completed' | 'failed'
    notes,
    queens: [{         // Her meme ayrı takip
      id, num, status, targetHive
      // status: 'pending' | 'kovana_aktarildi' | 'satildi' | 'oldu'
    }]
  }],
  tasks: [{ id, text, done }],
  seasons: [{ id, year, name, active }],
  stock: [{ id, product, action, amount, unit, date, note }]
}

settings = {
  city,          // Hava durumu şehri
  darkMode,
  fontSize,
  userName,
  userPhone,
  activeSeason,
  lastBackup
}
```

---

## Sayfalar (Bottom Nav)

| Sayfa | ID | Açıklama |
|---|---|---|
| Ana Sayfa | dashboard | Hava durumu, istatistikler, görevler, son işlemler |
| Özet | ozet | Tüm dağılım grafikleri ve finansal özet |
| Kovanlar | hives | Grid/Liste görünümü, QR arama, kovan detay |
| Ana Arı | queens | Seri yönetimi, meme takibi, gelişim takvimi |
| Arı Sütü | milk | Hasat kayıtları ve grafik |
| Satışlar | sales | Satış kayıtları |
| Stok | stock | Ürün stok yönetimi |
| Giderler | expenses | Gider kayıtları ve kategori grafikleri |
| Ayarlar | settings | Profil, hava, görünüm, sezon yönetimi, yedekleme, hesap |

> Sezon ve Yedek alt menüde YOK — Ayarlar sayfasına taşındı.

---

## Ana Özellikler

### Kovanlar
- Grid / Liste görünüm toggle (⊞ / ☰)
- Her kovan tipine özel SVG illüstrasyon (Langstroth, Dadant, Yerli, Çerçeveli, Ana Arı Kovanı, Nükleus/Ruşet)
- QR kod okuma ile kovan arama ve numara girişi (📷 butonu)
- Ana arı durumları: Var, Yok, Bakire, Meme Var, Bilinmiyor
- Kovan tipleri: Langstroth, Dadant, Yerli, Çerçeveli, Ana Arı Kovanı, Nükleus (Ruşet), Diğer
- Ana arı renk kodu sistemi (5 renk, yıla göre otomatik)
- Toplu kovan ekleme (başlangıç no + adet)

### Ana Arı Üretimi
- Seri bazlı takip: ırk, kuşak, damızlık kovan, başlatıcı kovan seçimi
- Gelişim timeline bar: Transfer → Kapanma (G8) → Pupa (G10) → Çıkım (G16) → Dağıtım (G20)
- Meme başına durum takibi: Kovana aktarıldı / Satıldı / Öldü / Bekliyor
- Sonuç girişi: tutan adet, çıkan adet

### Hava Durumu
- Sol: şehir + derece + simge + nem/rüzgar/hissedilen
- Sağ: saatlik tahmin şeridi (sonraki 12 saat)
- open-meteo.com API

### Finansal
- Satış türleri: Bal, Ana Arı, Arı Sütü, Petek Bal, Karakovan Bal, 🐝 Arı Satışı
- Ödeme türleri: Nakit, Havale, Veresiye, Hediye 🎁, Zekat 🌙
- Hediye/Zekat: fiyat=0, stok yine düşer
- Gider kayıtları ve kategori grafikleri

### Stok Yönetimi
- Ürünler: Süzme Bal (kg), Petek Bal (kg), Arı Sütü (gr), Karakovan Bal (kg)
- Arı sütü hasatı otomatik stoğa eklenir
- Satışlarda stoktan otomatik düşme

### Auth & Sync (v1.5)
- Google ile giriş (Supabase OAuth)
- Offline-first: internet olmadan da çalışır
- Otomatik senkronizasyon: her `saveData()` çağrısında Supabase'e yazar — upsert'e `updated_at` dahil
- Açılışta uzak veri çekme: `.maybeSingle()` ile 406 hatası giderildi, 8s timeout eklendi
- Sync başarısında aktif sayfayı yeniden render eder (`navigate(currentPage)`)
- Sync badge: syncing / ok / err — offline'da anında err gösterir
- Ayarlar sayfasında kullanıcı kartı + çıkış butonu

---

## CSS Değişkenleri (Tema)

```css
--honey, --honey-dark, --honey-light, --amber   /* Bal sarısı tonları */
--forest, --forest-mid, --forest-light           /* Orman yeşili */
--cream, --smoke                                  /* Arka plan */
--text-dark, --text-mid, --text-soft             /* Metin renkleri */
--red-warn, --green-ok, --blue-info, --purple-special
--radius: 16px; --nav-height: 68px;
```

Karanlık tema: `[data-theme="dark"]` ile override edilir.

---

## Önemli Fonksiyonlar

| Fonksiyon | Ne Yapar |
|---|---|
| `init()` | Başlangıç: localStorage + initSupabase + tema + splash |
| `startApp()` | Splash sonrası: auth durumuna göre dashboard veya auth ekranı |
| `initSupabase()` | Supabase client kur, auth state listener ekle |
| `signInWithGoogle()` | Google OAuth başlat |
| `useOfflineMode()` | Auth ekranını kapat, çevrimdışı devam et |
| `signOut()` | Supabase oturumu kapat, auth ekranı göster |
| `syncToSupabase()` | data+settings'i Supabase'e upsert et (fire-and-forget) |
| `syncFromSupabase()` | Uzak veriyi çek, timestamp'e göre merge et |
| `setSyncBadge(state)` | Sync durumu göstergesi: syncing / ok / err |
| `renderAuthInfoCard()` | Ayarlar'daki hesap kartını güncelle |
| `navigate(page)` | Sayfa geçişi + içerik yenileme |
| `renderDashboard()` | Ana sayfa + hava durumu |
| `loadWeather()` | open-meteo API'den güncel + saatlik veri |
| `getHiveTypeSvg(type)` | Kovan tipine SVG illüstrasyon |
| `buildQueenTimeline(date)` | Transfer tarihinden gelişim aşamaları |
| `saveData()` / `loadData()` | localStorage okuma/yazma + Supabase sync tetikleme |
| `exportData()` / `importData()` | JSON yedek indir/yükle |

---

## Versiyon Geçmişi

- **v1.5** (Mayıs 2026) — Mevcut durum
  - Supabase sync kritik hataları giderildi: `.single()` → `.maybeSingle()` (406 fix), `updated_at` upsert'e eklendi
  - Sync sonrası aktif sayfa otomatik yenilenir
  - Sync badge: offline'da anında err, 8s timeout, sarıda takılı kalma giderildi
  - QR okuma: jsQR kütüphanesi ile iOS/Firefox desteği (BarcodeDetector yoksa fallback)
  - PWA: `manifest.json` + `apple-touch-icon` + `mobile-web-app-capable` — ana ekrana eklemede logo görünür
  - Alt menü kaydırma sayfayı kaydırma sorununu giderdi (`overscroll-behavior-x: contain`)
  - Ayarlar: logo kartı en üste, oturum kartı altında; Nahl Suresi 68-69 ayeti eklendi
  - `currentPage` değişkeni ile aktif sayfa takibi
- **v1.4** (Mayıs 2026)
  - Supabase entegrasyonu (beebook projesi, eu-central-1)
  - Google OAuth ile giriş
  - Offline-first mimari
  - Otomatik çift yönlü senkronizasyon
  - Sync badge göstergesi
  - Ayarlar'da hesap kartı + çıkış butonu
  - GitHub Pages yayını (kamilsaim/beebook)
  - GitHub Actions: keep-alive (her 3 günde) + otomatik deploy
- **v1.3** (Mayıs 2026)
  - QR kod okuma
  - Saatlik hava durumu (sağ panel)
  - Kovan tipi SVG illüstrasyonları
  - Özet sayfası
  - Ana arı seri gelişim timeline + meme takip sistemi
  - Sezon + Yedek → Ayarlar'a taşındı
  - Bakire Ana Arı + Meme Var durumları
  - Ana Arı Kovanı + Nükleus (Ruşet) tipleri
  - Grid / Liste görünüm toggle
  - SistemArı → Beebook yeniden markalama
  - Stok yönetimi + satışlarda otomatik düşme
  - Header açık mavi, logo.png gömüldü
  - Toplu kovan ekleme
  - Arı sütü hasatı otomatik stoğa
  - Arı Satışı türü + Hediye/Zekat ödeme
  - Favicon dinamik inject
  - Yazı boyutu ayarı (rem tabanlı)

---

## Devam Edilebilecek Konular

- [ ] Harita entegrasyonu (arılık konumu)
- [ ] Kovan başına verimlilik takibi (kg bal / kovan)
- [ ] Varroa tedavi takvimi
- [ ] Fotoğraf ekleme (kovan başına)
- [ ] PDF rapor çıktısı
- [x] PWA manifest ve apple-touch-icon (v1.5)
- [ ] Service worker (tam offline cache)
- [ ] Çoklu arılık desteği (lokasyon bazlı gruplama)
- [ ] Muayene geçmişi (kovan muayene defteri)
