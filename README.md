<div align="center">

<img src="logo.png" alt="Beebook" width="240">

# Beebook

**Arıcının El Defteri**

_Arıcılar için mobil öncelikli, offline çalışan kovan ve işletme yönetim uygulaması._

[**▶ Uygulamayı Aç**](https://kamilsaim.github.io/beebook/)

</div>

---

## Beebook nedir?

Beebook, arıcıların kovanlarını, ana arı üretimini, satışlarını ve giderlerini tek bir yerden takip etmesi için geliştirilmiş bir el defteri uygulaması. Kağıt deftere veya dağınık notlara alternatif olarak, arazide de ofiste de aynı rahatlıkla kullanılabilmesi hedeflenir.

İnternet olmadan da tam işlevseldir — kovan bilgileri, satışlar, giderler ve üretim kayıtları cihazda saklanır. Google ile giriş yapıldığında veriler otomatik olarak buluta yedeklenir ve birden fazla cihaz arasında senkronize edilir.

## Nasıl çalışır?

1. **Kovanları tanımla** — tip, ana arı durumu, ırk ve kuşak bilgisiyle kovan listeni oluştur.
2. **Üretimi kaydet** — ana arı serileri, arı sütü hasadı ve stok girişlerini işle.
3. **Satış ve gideri işle** — her satış otomatik olarak stoktan düşer, ödeme durumu (ödendi/bekliyor/kısmi) takip edilir.
4. **Özet sayfasından bak** — kovan, üretim ve finansal dağılımları grafiklerle gör.
5. **Google ile giriş yaparsan** verilerin otomatik olarak senkronize edilir, cihaz değiştirsen de kaldığın yerden devam edersin.

## Öne çıkan özellikler

- 🐝 **Kovan takibi** — Langstroth, Dadant, Yerli gibi tiplere özel illüstrasyonlar, QR ile hızlı arama, grid/liste görünüm
- 👑 **Ana arı üretimi** — seri bazlı takip, transfer'den dağıtıma gelişim takvimi, meme başına durum
- 🍯 **Arı sütü ve stok** — hasat kayıtları otomatik stoğa işler, satışta otomatik düşer
- 💰 **Satış ve gider takibi** — çoklu ürün satışı, ödendi/bekliyor/kısmi ödeme, hediye ve zekat kayıtları
- 📋 **Envanter** — kovan, ballık, körük, elbise gibi ekipmanları adet ve durumuyla (sağlam/tamir/eksik) kaydet, rapor halinde gör
- 🗺️ **Arazi düzeni** — kovanlarını haritada konumlandır, tek bakışta arazini gör
- ☀️ **Hava durumu** — güncel durum ve saatlik tahmin, arazi planlaması için
- 📊 **Özet ve raporlar** — kovan, üretim ve finansal dağılımlar; satış, gider ve stok raporları
- 🌸 **Sezon yönetimi** — her sezon ayrı hesap dönemi; satış, gider ve hasat kayıtları sezona göre ayrılır, kovanlar ve stok devam eder
- 📴 **Offline-first** — internet olmadan da tam işlevsel, bağlantı gelince otomatik senkronize olur

## Teknoloji

Beebook, [Supabase](https://supabase.com) (PostgreSQL + Google OAuth) üzerinde çalışan, framework kullanmayan tek dosyalık bir HTML/JS uygulamasıdır; hava durumu için [open-meteo.com](https://open-meteo.com) kullanır ve [GitHub Pages](https://pages.github.com) üzerinden yayınlanır. Telefona ana ekrana ekle ile PWA gibi kurulabilir, ayrıca Capacitor ile paketlenmiş bir Android (APK) sürümü mevcuttur.

## Sürüm Geçmişi

| Sürüm | Öne çıkanlar |
|-------|--------------|
| **v2.6.1** | Android geri tuşu artık standart davranıyor (ana sayfaya dön, çift basışta çık) ve arka plandan dönünce oturum açık kalıyor |
| **v2.6** | Yenilenen alt menü — renkli "Daha Fazla" paneli, sabit sekmeleri kişiselleştirme (uzun bas), bekleyen ödeme rozetleri |
| **v2.5** | Envanter bölümü (ekipman/malzeme takibi); taşan menü için "Daha Fazla" paneli; uygulama içi hesap silme ve gizlilik politikası |
| **v2.4** | Sezonlar gerçek hesap dönemi oldu — satış, gider ve arı sütü aktif sezona göre ayrılır; stok raporu; sezon rozeti sezon adını gösterir |
| **v2.3** | Kayıt bazlı senkronizasyon merge'i — tombstone ve `_up` damgasıyla sessiz veri kaybı önlendi |
| **v2.2** | Kısmi ödeme takibi, hızlı ödeme alma butonu, ana arı takvimi düzeltmesi |
| **v2.1** | Çoklu ürün satışı, sipariş durumu, satış/gider raporları, zekat hesabı |
| **v2.0** | Arazi düzeni ana uygulamaya entegre edildi, arısız kovan durumu eklendi |
| **v1.7** | Kovan tipi/ırk/satış/gider listeleri ayarlardan özelleştirilebilir hale geldi |
| **v1.6** | Arı ırkı güncellemeleri, düzenleme butonları, tıklanabilir özet grafikleri |
| **v1.5** | Supabase senkronizasyon iyileştirmeleri, iOS/Firefox QR desteği, PWA desteği |
| **v1.4** | Supabase entegrasyonu, Google OAuth, GitHub Pages yayını |

## Katkı

Beebook kişisel bir proje olarak geliştiriliyor. Öneri ve hata bildirimleri için depo üzerinden issue açabilirsin.

---

<div align="center">
<sub>🍯 Beebook — Arıcının El Defteri</sub>

<sub>Geliştirici: <a href="https://kamilsaim.web.app">kamilsaim.web.app</a></sub>
</div>
