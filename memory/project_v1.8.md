---
name: project-v1-8
description: Beebook v1.8 sürümünde yapılan tüm değişiklikler ve özellikler (Mayıs 2026)
metadata: 
  node_type: memory
  type: project
  originSessionId: 2a50b3db-8beb-4f84-a7da-b66d79568143
---

# Beebook v1.8 — Yapılanlar (Mayıs 2026)

**Why:** Kullanıcı deneyimi iyileştirmeleri, yönetici özellikleri ve yeni işlevsellik eklemek için kapsamlı güncelleme.
**How to apply:** Sonraki sohbette neyin var neyin yok olduğunu bilmek için bu kayda bak.

---

## 18 Özellik ve Düzeltme

### 1. Admin-only Liste Yönetimi
- `ADMIN_EMAIL = 'saimkamil@gmail.com'` ve `isAdmin()` fonksiyonu eklendi
- Ayarlar sayfasındaki 4 liste kartı (Kovan Tipleri, Arı Irkları, Satış Türleri, Gider Türleri) `id="admin-list-section"` div'ine alındı — sadece `saimkamil@gmail.com` ile girişte görünür
- `startApp()`, `signOut()`, `useOfflineMode()` fonksiyonlarında admin section görünürlüğü güncelleniyor

### 2. Stok Türleri Yönetimi (Admin)
- `DEFAULT_STOCK_TYPES` sabiti eklendi (Süzme Bal/kg, Petek Bal/kg, Arı Sütü/gr, Karakovan Bal/kg)
- `getStockTypes()` fonksiyonu → `settings.stockTypes || DEFAULT_STOCK_TYPES`
- `addStockTypeItem()`, `moveStockType()`, `deleteStockType()` CRUD fonksiyonları
- Stok ekleme modal'ı ve `renderStock()` artık `getStockTypes()`'tan dinamik doluyor
- `saveStockEntry()` birim de `getStockTypes()`'tan alıyor

### 3. Kovan Arama Temizle Butonu
- Arama kutusuna yazı girilince sağda ✕ butonu çıkar
- `toggleSearchClear()` ve `clearHiveSearch()` fonksiyonları

### 4. FAB Kovan Ekleme Butonu
- `.fab-btn` CSS: sağ altta fixed, 56px yuvarlak, bal sarısı gradient
- `id="fab-add-hive"` → sadece kovanlar sayfasında görünür
- `navigate()` içinde sayfa geçişinde göster/gizle

### 5. Kovan Formunda Ana Arısız → Alanları Gizle
- `hive-queen-status` select'ine `onchange="onQueenStatusChange()"` eklendi
- "Ana Arı Yok" seçilince: Çıkış Yılı, Ana Arı Rengi, Arı Irkı, Kuşak alanları gizleniyor
- 4 form-group id: `hive-year-group`, `hive-queen-color-group`, `hive-race-group`, `hive-generation-group`
- `openHiveModal()` ve `editHive()` sonunda `onQueenStatusChange()` çağrılıyor

### 6. Boyasız Ana Arı Rengi
- `.color-dot.qc-unpainted` CSS: beyaz arka plan, kesik kenarlık
- Renk seçiciye 6. seçenek olarak "Boyasız ⭕" eklendi
- `queenColorMap`'e `unpainted: 'transparent'` eklendi (tüm render noktalarında)

### 7. İki Katlı Kovan SVG
- `getHiveTypeSvg(type, floors)` — 2. parametre eklendi
- `Number(floors) >= 2` ise Langstroth (viewBox 40x64) ve Dadant (viewBox 44x64) iki katlı SVG render eder
- Tüm çağrılar `getHiveTypeSvg(h.type, h.floors)` olarak güncellendi

### 8. Kovan Görünümü İyileştirmeleri
- Grid view: renk dairesi 20x20px, `box-shadow` ile güzel görünüm
- Liste view: renk dairesi 16x16px, `qIcon` emoji sağ sütunda
- Boyasız için kesik kenarlık (dashed border) her görünümde

### 9. Bakire ve Meme Filtre Chipleri
- Kovanlar sayfasına `Bakire 🐝` ve `Meme Var 🫙` filtre chipleri eklendi
- `renderHives()` içinde `bakire` ve `meme` filtreleme case'leri

### 10. Sezon Oluştururken Veri Aktarım Seçimi
- `new-season-modal`'a 3 checkbox eklendi: 🏠 Kovanlar (varsayılan ✓), 📦 Stok, 📋 Tamamlanmamış görevler
- Stok seçilince her ürünün mevcut bakiyesi yeni sezon başlangıcına "X sezonu devri" notu ile `in` kaydı olarak eklenir
- Toast mesajı seçimlere göre detay verir

### 11. Takvimli Görevler
- Dashboard'da "Hızlı Görevler" ve "Takvimli Görevler" iki ayrı bölüm
- Mini aylık takvim: Pazartesi başlangıçlı, görev olan günlerde nokta işareti
- Güne tıklayınca `cal-task-modal` açılır, görev eklenir
- `renderCalTaskList()`: güne göre gruplama, geçmiş tarihler ⚠️ kırmızı başlıkla
- Görev veri modeli: `{ id, text, done, dueDate? }` — dueDate opsiyonel
- `calCurrentMonth`, `calSelectedDate` global değişkenler
- `toggleTask()` ve `deleteTask()` sonrası takvim de yenileniyor

### 12. Dashboard Son Kovan İşlemleri
- `saveHive()` artık `updatedAt: today()` ve `lastAction` ('Kovan eklendi'/'Kovan düzenlendi') kaydediyor
- Dashboard'da "Son Kovan İşlemleri" bölümü: son 4 kovan işlemi, tarihle birlikte
- `renderRecentHiveOps()` fonksiyonu

### 13. Arı Satışında Kovan Seçimi
- Satış türü "Arı Satışı" seçilince kovan checkbox listesi açılır
- `renderBeeHiveSelect()` fonksiyonu
- Satış kaydına `soldHives: []` alanı eklendi
- Satış listesinde `bee` türü satışlarda kovan numaraları gösteriliyor (örn: "Kovan: #3, #7")
- Düzenleme modalında eski seçimler geri yükleniyor

### 14. Queen Timeline — Dağıtım Günü Düzeltmesi
- Dağıtım: G20 → **G14** (çıkımdan 2 gün önce)
- Yeni sıra: Transfer(0) → Larva Kapanma(8) → Pupa(10) → **Dağıtım(14)** → Çıkım(16)
- `totalDays = 16` (eskisi 20)

### 15. Etiket Değişiklikleri
- Seri formunda ve kart görünümünde: "Graftlanan" → **"Adet"**
- Veri alanı `grafted` değişmedi, sadece görünen metin

### 16. Baş Harf Otomatik Büyük
- `capitalizeFirst(el)` fonksiyonu eklendi
- 10 input/textarea'ya `autocapitalize="sentences"` ve `oninput="capitalizeFirst(this)"` eklendi

### 17. Versiyon v1.8
- Ayarlar sayfasında `v1.8` güncellendi

---

## Teknik Notlar

- Tüm kod tek dosya: `aricilik.html` (~4200 satır)
- v1.8 sonrası commit sayısı: 10 commit
- Push: `git push origin master && git push origin master:main`
- Canlı: https://kamilsaim.github.io/beebook/

---

## Gelecek Planlanan Özellikler (henüz yapılmadı)

- Harita entegrasyonu: kullanıcı kendi arılık konumunu işaretler, diğer arıcıları haritada görür
  - Leaflet.js veya Google Maps kullanılabilir
  - Supabase `public_profiles` tablosu + opt-in konum paylaşımı
  - KVKK uyumu: gizlilik için açık onay gerekli
- Service worker (tam offline cache)
- Kovan başına verimlilik takibi (kg bal / kovan)
- Varroa tedavi takvimi
- Fotoğraf ekleme (kovan başına)
- PDF rapor çıktısı
- Çoklu arılık desteği (lokasyon bazlı gruplama)
- Muayene geçmişi (kovan muayene defteri)
