# Beebook v2.0 — Arazi Düzeni Entegrasyon Spec

**Tarih:** 2026-05-21  
**Versiyon:** 2.0  
**Kapsam:** arazi-duzen.html → aricilik.html entegrasyonu, CLAUDE.md GitHub'dan kaldırma, dokümantasyon güncelleme

---

## 1. Genel Bakış

`arazi-duzen.html` bağımsız dosyası, ana `aricilik.html` uygulamasına yeni bir sayfa olarak entegre edilir. Kullanıcı Kovanlar sayfasından veya Dashboard'dan erişir. Alt menü (bottom nav) görünür kalır.

---

## 2. Sayfa Yapısı

### HTML

```html
<div class="page" id="page-arazi">
  <div id="arazi-toolbar">...</div>
  <div id="arazi-cw">
    <div id="arazi-canvas"></div>
  </div>
  <!-- arazi-overlay (popup) -->
  <!-- arazi-north (K↑ göstergesi) -->
  <!-- (load modal kaldırılır) -->
</div>
```

### CSS Boyutlandırma

Ana uygulama `#pages { flex:1; position:relative }` konteyneri header (60px) ve nav (68px) alanını zaten yönetir. `.page { position:absolute; inset:0 }` ile sayfalar bu alanı tam doldurur.

```css
/* .page varsayılan display:block'u flex ile ezilir */
#page-arazi {
  padding: 0;
  overflow: hidden;
}
#page-arazi.active {
  display: flex;
  flex-direction: column;
}
#arazi-toolbar {
  height: 46px; flex-shrink: 0;
}
#arazi-cw {
  flex: 1; overflow: scroll;
  background: var(--cream);
  background-image: radial-gradient(circle, rgba(0,0,0,.08) 1px, transparent 1px);
  background-size: var(--arazi-cell) var(--arazi-cell);
}
```

`--arazi-cell` CSS değişkeni, ana uygulamanın `--cell`'iyle çakışmaması için ayrı isimlendirilir.

---

## 3. JavaScript — Yeniden Adlandırma Tablosu

Tüm arazi global değişkenleri ve fonksiyonları prefix alır. Ana uygulamayla çakışma sıfıra indirilir.

| Eski (standalone) | Yeni (entegre) | Not |
|---|---|---|
| `let hives` | `let araziHives` | `data.hives`'ten beslenir |
| `let positions` | `let araziPositions` | localStorage'da ayrı saklanır |
| `let spacers` | `let araziSpacers` | |
| `let selectedId` | `let araziSelectedId` | |
| `let cellPx` | `let araziCellPx` | |
| `let snapFactor` | `let araziSnapFactor` | |
| `let spacerMode` | `let araziSpacerMode` | |
| `let popupHiveId` | `let araziPopupHiveId` | |
| `const canvas` (DOM ref) | `araziCanvas` (fonksiyon içinde `document.getElementById`) | |
| `render()` | `araziRender()` | navigate içinden çağrılır |
| `renderHive()` | `araziRenderHive()` | |
| `renderSpacer()` | `araziRenderSpacer()` | |
| `getHiveTypeSvg()` | `araziGetHiveTypeSvg()` | |
| `placeNew()` | `araziPlaceNew()` | |
| `autoArrange()` | `araziAutoArrange()` | |
| `openPopup()` | `araziOpenPopup()` | |
| `closePopup()` | `araziClosePopup()` | |
| `navToSelected()` | `araziNavToSelected()` | |
| `attachDrag()` | `araziAttachDrag()` | |
| `selectItem()` | `araziSelectItem()` | |
| `updateBadge()` | `araziUpdateBadge()` | |
| `deleteSelected()` | `araziDeleteSelected()` | |
| `setZoom()` | `araziSetZoom()` | |
| `setSnap()` | `araziSetSnap()` | |
| `toggleSpacerMode()` | `araziToggleSpacerMode()` | |
| `saveLayout()` | `araziSaveLayout()` | |
| `exportLayout()` | `araziExportLayout()` | |
| `lsGet()` | `araziLsGet()` | |
| `lsSet()` | `araziLsSet()` | |
| `showToast()` | **ana uygulamanın `showToast()`** | yeniden tanımlanmaz |
| `QC`, `QL`, `QBorder` | `ARAZI_QC`, `ARAZI_QL`, `ARAZI_QBorder` | çakışma riski düşük ama prefix alır |

---

## 4. Veri Akışı

```
navigate('arazi') çağrılır
  → araziHives = [...data.hives]          // ana uygulamanın güncel kovan listesi
  → {araziPositions, araziSpacers} = araziLsGet('beebook_arazi_v2') || {}
  → araziPlaceNew(yeni_kovanlar)          // pozisyonu olmayan kovanlar otomatik yerleştirilir
  → araziRender()
```

**Kaydet:** Sadece `araziPositions` ve `araziSpacers` kaydedilir — kovan verileri ana uygulamanın `saveData()`'sına aittir.

**Yenile butonu:** `araziHives = [...data.hives]` → `araziPlaceNew(yeniler)` → `araziRender()`. Silinen kovanların pozisyonları temizlenir.

---

## 5. Load Modal → Kaldırılır

Standalone versiyondaki "Beebook'tan Otomatik Al" ve "JSON Dosyası Seç" modalı entegre versiyonda gereksiz — veriler zaten `data.hives`'ten geliyor. Yerine sadece `🔄 Yenile` butonu toolbar'da.

---

## 6. Erişim Noktaları

### Kovanlar Sayfası
Mevcut kovanlar sayfası header/toolbar'ına buton eklenir:
```html
<button onclick="navigate('arazi')">🗺️ Arazi Düzeni</button>
```

### Dashboard
Kovan istatistik bölümüne (veya hızlı erişim alanına) küçük buton:
```html
<button onclick="navigate('arazi')">🗺️ Arazi</button>
```

---

## 7. navigate() Entegrasyonu

Ana uygulamanın `navigate(page)` fonksiyonu arazi sayfasını da yönetir. `navigate('arazi')` çağrıldığında:
1. Diğer sayfalar gizlenir (mevcut `navigate` mantığı)
2. `#page-arazi` gösterilir
3. `araziInitPage()` çağrılır (veri sync + render)

`navigate()` fonksiyonuna arazi için özel bir `renderX()` çağrısı eklenir (diğer sayfalar gibi: `renderDashboard()`, `renderHives()` vb.).

---

## 8. Toolbar İçeriği (Entegre Versiyon)

Standalone'daki başlık çubuğu (`#hdr`) kaldırılır. Toolbar:

```
[🗑️ Sil] [|] [Boyut ━━━━] [|] [Snap: ½× ¼× Serbest] [|] [🔀 Otomatik] [🔄 Yenile] [💾 Kaydet] [📤 Dışa Aktar]
```

Seçim badge (`sel-badge`) toolbar'ın soluna alınır.

---

## 9. CLAUDE.md — GitHub'dan Kaldırma

```bash
git rm --cached CLAUDE.md
echo "CLAUDE.md" >> .gitignore
git add .gitignore
git commit -m "chore: CLAUDE.md gitignore'a alındı"
git push origin master && git push origin master:main
```

CLAUDE.md disk'te kalır; Claude Code bunu yerel olarak okur.

---

## 10. Dokümantasyon Güncellemeleri

### CLAUDE.md
- Versiyon `v2.0` olarak güncellenir
- Arazi Düzeni sayfası tablo ve fonksiyon listesine eklenir
- `arazi` sayfası nav tablosuna eklenir (Kovanlar altında erişim notu ile)
- Versiyon geçmişine v2.0 satırı eklenir

### memory/project_v1.9.md (veya yeni v2.0 dosyası)
- Yeni `project_v2.0.md` oluşturulur
- MEMORY.md indeksine eklenir

---

## 11. Standalone arazi-duzen.html

Entegrasyon tamamlandıktan sonra `arazi-duzen.html` dosyası **silinmez** — referans/backup olarak repoda kalır. İleride geliştirme prototipi olarak kullanılabilir. `.gitignore`'a alınmaz.

---

## 12. Test Kriterleri

- [ ] `navigate('arazi')` Kovanlar ve Dashboard butonundan çalışır
- [ ] Arazi açılınca `data.hives`'teki tüm kovanlar görünür
- [ ] Kovan sürükleme, snap, zoom çalışır
- [ ] Ana arı renk noktası üçgen içinde görünür
- [ ] Ana arısız/bakire/meme glow+etiket görünür
- [ ] Kaydet: sayfayı kapatıp açınca pozisyonlar korunur
- [ ] Yenile: yeni eklenen kovan arazi'de görünür
- [ ] Diğer sayfalar (dashboard, kovanlar vb.) bozulmamış
- [ ] Dark mode arazi'de çalışır
- [ ] CLAUDE.md GitHub'da görünmüyor, disk'te var
