# Beebook v2.0 — Arazi Entegrasyon Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `arazi-duzen.html` bağımsız sayfasını `aricilik.html`'e entegre etmek, CLAUDE.md'yi gitignore'a almak ve dokümantasyonu v2.0 olarak güncellemek.

**Architecture:** Arazi sayfası `<div class="page" id="page-arazi">` olarak eklenir; tüm JS değişken ve fonksiyonları `arazi` prefix'i alır; ana uygulamanın `showToast()` ve `navigate()` fonksiyonları paylaşılır; `data.hives`'ten veri beslenir, pozisyonlar ayrı localStorage anahtarında saklanır.

**Tech Stack:** Vanilla HTML/CSS/JS, localStorage, arazi-duzen.html kaynak referans olarak kullanılır.

---

## Dosya Haritası

| Dosya | İşlem | Ne Değişir |
|---|---|---|
| `aricilik.html` | Modify | CSS (~90 satır), HTML (~80 satır), JS (~380 satır), navigate() switch (+1 case), erişim butonları (+2 yerde) |
| `CLAUDE.md` | Modify | v2.0 güncelleme, arazi sayfası ekleme |
| `.gitignore` | Create/Modify | CLAUDE.md eklenir |
| `memory/project_v2.0.md` | Create | v2.0 proje hafızası |
| `memory/MEMORY.md` | Modify | v2.0 satırı eklenir |

**Değişmeyen:** `arazi-duzen.html` (referans olarak repoda kalır)

---

## Task 1: CLAUDE.md'yi Gitignore'a Al

**Files:**
- Create/Modify: `.gitignore`

- [ ] **Adım 1: .gitignore dosyasını kontrol et ve CLAUDE.md ekle**

```bash
cd "E:\ksaim\claude programlar\aricilik"
```

`.gitignore` dosyasına şu satırı ekle (dosya yoksa oluştur):
```
CLAUDE.md
```

- [ ] **Adım 2: CLAUDE.md'yi git takibinden çıkar**

```bash
git rm --cached CLAUDE.md
```

Beklenen çıktı: `rm 'CLAUDE.md'`

- [ ] **Adım 3: Commit ve push**

```bash
git add .gitignore
git commit -m "chore: CLAUDE.md gitignore alındı, GitHub'da görünmeyecek"
git push origin master && git push origin master:main
```

- [ ] **Adım 4: GitHub'da kontrol**

`https://github.com/kamilsaim/beebook` adresinde CLAUDE.md dosyasının artık görünmediğini doğrula.

---

## Task 2: Arazi CSS'ini aricilik.html'e Ekle

**Files:**
- Modify: `aricilik.html` — satır 555'ten önce (`</style>` kapatma taginden hemen önce)

- [ ] **Adım 1: CSS bloğunu `</style>` taginden hemen önce ekle (satır ~555)**

```css
  /* ═══════════════════════════════════════
     ARAZİ DÜZENİ SAYFASI
  ═══════════════════════════════════════ */
  :root { --arazi-cell: 80px; }

  #page-arazi {
    padding: 0;
    overflow: hidden;
  }
  #page-arazi.active {
    display: flex;
    flex-direction: column;
  }

  /* Toolbar */
  #arazi-toolbar {
    height: 46px; min-height: 46px;
    background: var(--smoke); border-bottom: 1px solid #E0D0B0;
    display: flex; align-items: center; gap: 6px; padding: 0 10px;
    overflow-x: auto; z-index: 200; flex-shrink: 0;
  }
  #arazi-toolbar::-webkit-scrollbar { display: none; }
  .atbtn {
    background: white; border: 1.5px solid #E0D0B0;
    color: var(--text-mid); border-radius: 7px; padding: 5px 10px;
    font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap;
    transition: all .15s; flex-shrink: 0;
  }
  .atbtn.active, .atbtn:active { background: var(--honey); border-color: var(--honey-dark); color: #1a1208; }
  .asep { width: 1px; height: 24px; background: #E0D0B0; flex-shrink: 0; margin: 0 2px; }
  .atlab { font-size: 11px; color: var(--text-soft); font-weight: 700; white-space: nowrap; flex-shrink: 0; }
  #arazi-zoom-range { accent-color: var(--honey); width: 80px; flex-shrink: 0; }
  #arazi-sel-badge {
    background: var(--comb); border-radius: 6px;
    padding: 3px 8px; font-size: 11px; font-weight: 700; color: var(--text-mid);
    white-space: nowrap; flex-shrink: 0;
  }

  /* Canvas */
  #arazi-cw {
    flex: 1; overflow: scroll; cursor: default;
    background: var(--cream);
    background-image: radial-gradient(circle, rgba(0,0,0,.08) 1px, transparent 1px);
    background-size: var(--arazi-cell) var(--arazi-cell);
  }
  #arazi-canvas { position: relative; min-width: 3000px; min-height: 2000px; }

  /* North indicator */
  #arazi-north {
    position: absolute; bottom: 20px; right: 16px;
    width: 44px; height: 44px; background: rgba(0,0,0,.55);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: white; font-size: 11px; font-weight: 900; z-index: 200;
    border: 2px solid rgba(255,255,255,.25); pointer-events: none;
  }

  /* Hive items */
  #page-arazi .hi {
    position: absolute; display: flex; flex-direction: column; align-items: center;
    gap: 2px; cursor: grab; user-select: none; touch-action: none; transition: filter .15s;
  }
  #page-arazi .hi.dragging { cursor: grabbing; filter: drop-shadow(0 8px 20px rgba(0,0,0,.5)); z-index: 500!important; transition: none; }
  #page-arazi .hi.sel .hbody { outline: 3px solid #64b5f6; outline-offset: 3px; }
  #page-arazi .hbody { border-radius: 5px; position: relative; overflow: visible; }
  #page-arazi .hbody svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35)); }
  #page-arazi .hnum-overlay {
    position: absolute; bottom: 27%; left: 50%; transform: translateX(-50%);
    font-size: 11px; font-weight: 900; color: white;
    text-shadow: 0 1px 4px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,.7);
    pointer-events: none; white-space: nowrap; letter-spacing: .3px;
  }
  #page-arazi .hrace-overlay {
    position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
    font-size: 8px; color: rgba(255,255,255,.92);
    text-shadow: 0 1px 3px rgba(0,0,0,1);
    pointer-events: none; white-space: nowrap;
    max-width: 90%; overflow: hidden; text-overflow: ellipsis;
  }
  /* Durum vurgusu */
  #page-arazi .hi.qs-no    .hbody svg { filter: drop-shadow(0 0 7px #e53935) drop-shadow(0 0 14px rgba(229,57,53,.5)) drop-shadow(0 2px 6px rgba(0,0,0,.35)); }
  #page-arazi .hi.qs-bakire .hbody svg { filter: drop-shadow(0 0 7px #f9a825) drop-shadow(0 0 14px rgba(249,168,37,.5)) drop-shadow(0 2px 6px rgba(0,0,0,.35)); }
  #page-arazi .hi.qs-meme  .hbody svg { filter: drop-shadow(0 0 7px #9c27b0) drop-shadow(0 0 14px rgba(156,39,176,.5)) drop-shadow(0 2px 6px rgba(0,0,0,.35)); }
  #page-arazi .hstatus {
    font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 8px;
    color: white; white-space: nowrap; pointer-events: none; text-shadow: 0 1px 2px rgba(0,0,0,.4);
  }
  #page-arazi .hstatus.s-no     { background: #e53935; }
  #page-arazi .hstatus.s-bakire { background: #f9a825; color: #1a1208; }
  #page-arazi .hstatus.s-meme   { background: #9c27b0; }

  /* Spacer */
  #page-arazi .spi {
    position: absolute; cursor: grab; user-select: none; touch-action: none;
    border: 2px dashed rgba(0,0,0,.2); border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(0,0,0,.2); font-size: 18px;
  }
  #page-arazi .spi.sel { border-color: rgba(21,101,192,.7); color: rgba(21,101,192,.7); }
  #page-arazi .spi.dragging { cursor: grabbing; z-index: 500!important; transition: none; }

  /* Popup */
  #arazi-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,.55); backdrop-filter: blur(4px);
    z-index: 800; display: flex; align-items: center; justify-content: center; padding: 20px;
    opacity: 0; pointer-events: none; transition: opacity .25s;
  }
  #arazi-overlay.open { opacity: 1; pointer-events: all; }
  #arazi-popup {
    background: var(--cream); border-radius: 20px;
    width: 100%; max-width: 480px; padding: 0 0 24px;
    box-shadow: 0 8px 40px rgba(0,0,0,.4);
    transform: scale(0.93) translateY(12px); opacity: 0;
    transition: transform .28s cubic-bezier(.34,1.56,.64,1), opacity .25s;
    max-height: 80vh; overflow-y: auto;
  }
  #arazi-overlay.open #arazi-popup { transform: scale(1) translateY(0); opacity: 1; }
  .arazi-popup-hdr {
    display: flex; align-items: center; gap: 10px; padding: 14px 18px 12px;
    background: linear-gradient(135deg, var(--comb), #FFF8DC);
    border-bottom: 2px solid var(--honey);
  }
  .arazi-popup-num { font-size: 24px; font-weight: 900; color: var(--honey-dark); font-family: 'Playfair Display', serif; }
  .arazi-popup-type { font-size: 13px; color: var(--text-soft); font-weight: 700; }
  .arazi-popup-qdot { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid rgba(0,0,0,.2); margin-left: auto; flex-shrink: 0; }
  .arazi-popup-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; }
  .arazi-info-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--smoke); }
  .arazi-info-lbl { font-size: 12px; color: var(--text-soft); font-weight: 700; }
  .arazi-info-val { font-size: 13px; font-weight: 800; color: var(--text-dark); }
  .arazi-sdot { width: 12px; height: 12px; border-radius: 50%; background: #EEE; }
  .arazi-sdot.on { background: var(--honey); }
  .arazi-fbox { background: var(--comb); border: 2px solid var(--honey-dark); border-radius: 4px; width: 22px; }
  .arazi-popup-btns { display: flex; gap: 8px; padding: 0 18px; margin-top: 4px; }
  .arazi-pbtn { flex: 1; padding: 11px; border-radius: 10px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; }
  .arazi-pbtn.close { background: var(--smoke); color: var(--text-dark); }
  .arazi-pbtn.nav { background: var(--blue-info); color: white; }
```

- [ ] **Adım 2: Tarayıcıda aç, CSS hata olmadığını kontrol et (konsol temiz)**

---

## Task 3: page-arazi HTML Yapısını Ekle

**Files:**
- Modify: `aricilik.html` — `<div id="bottom-nav">` taginden hemen önce (satır ~1160)

- [ ] **Adım 1: Aşağıdaki HTML bloğunu `<div id="bottom-nav">` satırından önce ekle**

```html
    <!-- ARAZİ DÜZENİ -->
    <div class="page" id="page-arazi">
      <div id="arazi-toolbar">
        <div id="arazi-sel-badge">0 kovan</div>
        <div class="asep"></div>
        <button class="atbtn" onclick="araziDeleteSelected()">🗑️ Sil</button>
        <div class="asep"></div>
        <span class="atlab">Boyut</span>
        <input type="range" id="arazi-zoom-range" min="48" max="130" value="80" oninput="araziSetZoom(this.value)">
        <div class="asep"></div>
        <span class="atlab">Snap</span>
        <button class="atbtn" id="arazi-snap-h" onclick="araziSetSnap(0.5,this)">½×</button>
        <button class="atbtn active" id="arazi-snap-q" onclick="araziSetSnap(0.25,this)">¼×</button>
        <button class="atbtn" id="arazi-snap-f" onclick="araziSetSnap(0,this)">Serbest</button>
        <div class="asep"></div>
        <button class="atbtn" onclick="araziAutoArrange()">🔀 Otomatik</button>
        <button class="atbtn" onclick="araziRefresh()">🔄 Yenile</button>
        <button class="atbtn" onclick="araziSaveLayout()">💾 Kaydet</button>
        <button class="atbtn" onclick="araziExportLayout()">📤 Dışa Aktar</button>
        <div class="asep"></div>
        <button class="atbtn" id="arazi-btn-spacer" onclick="araziToggleSpacerMode()">+ Boşluk</button>
      </div>

      <div id="arazi-cw">
        <div id="arazi-canvas"></div>
        <div id="arazi-north">K<br>↑</div>
      </div>

      <!-- Popup -->
      <div id="arazi-overlay" onclick="araziClosePopup(event)">
        <div id="arazi-popup">
          <div class="arazi-popup-hdr">
            <div>
              <div class="arazi-popup-num" id="arazi-pu-num"></div>
              <div class="arazi-popup-type" id="arazi-pu-type"></div>
            </div>
            <div class="arazi-popup-qdot" id="arazi-pu-qdot"></div>
          </div>
          <div class="arazi-popup-body" id="arazi-pu-body"></div>
          <div class="arazi-popup-btns">
            <button class="arazi-pbtn close" onclick="araziClosePopup()">Kapat</button>
            <button class="arazi-pbtn nav" id="arazi-pu-nav" onclick="araziNavToSelected()">🎯 Kovan'a Git</button>
          </div>
        </div>
      </div>
    </div>
```

- [ ] **Adım 2: Tarayıcıda `navigate('arazi')` konsola yaz, sayfanın açıldığını (boş da olsa) doğrula**

---

## Task 4: Erişim Butonlarını Ekle

**Files:**
- Modify: `aricilik.html` — dashboard quick-actions (satır ~678) ve kovanlar sayfası (satır ~761)

- [ ] **Adım 1: Dashboard quick-actions grid CSS'ini 5 kolona çek**

Satır ~350'deki CSS'i bul:
```css
.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
```
Değiştir:
```css
.quick-actions { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 12px; }
```

Responsive override'ı da güncelle (satır ~517):
```css
.quick-actions { grid-template-columns: repeat(5, 1fr); }
```

- [ ] **Adım 2: Dashboard'a Arazi butonu ekle — Ayarlar butonundan hemen önce**

Bul:
```html
        <button class="quick-action" onclick="navigate('settings')">
          <span class="qa-icon">⚙️</span><span class="qa-label">Ayarlar</span>
        </button>
```
Önüne ekle:
```html
        <button class="quick-action" onclick="navigate('arazi')">
          <span class="qa-icon">🗺️</span><span class="qa-label">Arazi</span>
        </button>
```

- [ ] **Adım 3: Kovanlar sayfasına Arazi Düzeni butonu ekle**

Kovanlar sayfasında şu satırı bul (`flex-between` div içinde, buton grubunun sonuna):
```html
          <button class="btn btn-primary btn-sm" onclick="openHiveModal()">+ Kovan Ekle</button>
```
Önüne ekle:
```html
          <button class="btn btn-secondary btn-sm" onclick="navigate('arazi')">🗺️ Arazi</button>
```

- [ ] **Adım 4: Tarayıcıda dashboard'u aç, 5 quick action göründüğünü doğrula; Arazi butonuna bas, navigate('arazi') çalıştığını gör**

---

## Task 5: JS Sabitleri ve Durum Değişkenleri

**Files:**
- Modify: `aricilik.html` — `init();` satırından önce, JS bölümünün sonuna ekle (satır ~4376)

- [ ] **Adım 1: Arazi sabit ve değişken bloğunu ekle**

```javascript
// ═══════════════════════════════════════════════════════
//  ARAZİ DÜZENİ — Sabitler ve Durum
// ═══════════════════════════════════════════════════════
const ARAZI_QC = {white:'#FFFFFF',yellow:'#FFD700',red:'#E74C3C',green:'#27AE60',blue:'#3498DB',unpainted:'transparent'};
const ARAZI_QL = {yes:'✅ Ana Arı Var',no:'❌ Ana Arı Yok',unknown:'❓ Bilinmiyor',bakire:'🐝 Bakire',new:'🐝 Bakire',meme:'🫙 Meme Var'};

let araziHives     = [];   // data.hives'ten kopyalanır
let araziPositions = {};   // id → {x, y}
let araziSpacers   = [];   // [{id, x, y, w, h}]
let araziSelectedId  = null;
let araziCellPx      = 80;
let araziSnapFactor  = 0.25;
let araziSpacerMode  = false;
let araziPopupHiveId = null;
let araziLastSnapBtn = null;  // araziInitPage'de set edilir
let araziEventsReady = false; // canvas click/keyboard bir kez bağlanır

function araziLsGet(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch(e) { return null; } }
function araziLsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
```

---

## Task 6: araziGetHiveTypeSvg Fonksiyonu

**Files:**
- Modify: `aricilik.html` — Task 5 bloğunun hemen altına ekle

- [ ] **Adım 1: SVG builder fonksiyonunu ekle**

```javascript
function araziGetHiveTypeSvg(type, floors, queenColor) {
  const c = { body:'#D4A017', body2:'#F0C040', roof:'#C47A1E', peak:'#9A5A10', base:'#8B5E3C', frame:'#F5E090', log:'#A0703A' };
  const twoFloor = Number(floors) >= 2;

  const mkQDot = (cx, cy) => {
    if (!queenColor) return '';
    const color = ARAZI_QC[queenColor] || '#CCC';
    const fill  = color === 'transparent' ? 'white' : color;
    const dash  = color === 'transparent' ? ' stroke-dasharray="2,1.5"' : '';
    return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${fill}" stroke="rgba(0,0,0,0.5)" stroke-width="1.2"${dash}/>`;
  };

  const langstroth = twoFloor
    ? `<svg viewBox="0 0 40 64" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="56" width="36" height="4" rx="1.5" fill="${c.base}"/><rect x="3" y="42" width="34" height="14" rx="2" fill="${c.body}" stroke="${c.base}" stroke-width="1.5"/><line x1="3" y1="49" x2="37" y2="49" stroke="${c.base}" stroke-width="1"/><rect x="3" y="28" width="34" height="14" rx="2" fill="${c.body2}" stroke="${c.base}" stroke-width="1.5"/><line x1="3" y1="35" x2="37" y2="35" stroke="${c.base}" stroke-width="1"/><rect x="1" y="23" width="38" height="5" rx="1" fill="${c.roof}"/><polygon points="0,23 20,13 40,23" fill="${c.peak}"/>${mkQDot(20,20)}</svg>`
    : `<svg viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="44" width="36" height="4" rx="1.5" fill="${c.base}"/><rect x="3" y="30" width="34" height="14" rx="2" fill="${c.body}" stroke="${c.base}" stroke-width="1.5"/><line x1="3" y1="37" x2="37" y2="37" stroke="${c.base}" stroke-width="1"/><rect x="3" y="20" width="34" height="10" rx="2" fill="${c.body2}" stroke="${c.base}" stroke-width="1.5"/><rect x="1" y="15" width="38" height="5" rx="1" fill="${c.roof}"/><polygon points="0,15 20,5 40,15" fill="${c.peak}"/>${mkQDot(20,12)}</svg>`;

  const dadant = twoFloor
    ? `<svg viewBox="0 0 44 64" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="56" width="40" height="4" rx="1.5" fill="${c.base}"/><rect x="2" y="40" width="40" height="16" rx="2" fill="${c.body}" stroke="${c.base}" stroke-width="1.5"/><line x1="2" y1="48" x2="42" y2="48" stroke="${c.base}" stroke-width="1"/><rect x="2" y="24" width="40" height="16" rx="2" fill="${c.body2}" stroke="${c.base}" stroke-width="1.5"/><line x1="2" y1="32" x2="42" y2="32" stroke="${c.base}" stroke-width="1"/><rect x="3" y="19" width="38" height="5" rx="1" fill="${c.roof}"/><polygon points="2,19 22,10 42,19" fill="${c.peak}"/>${mkQDot(22,16)}</svg>`
    : `<svg viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="44" width="40" height="4" rx="1.5" fill="${c.base}"/><rect x="2" y="26" width="40" height="18" rx="2" fill="${c.body}" stroke="${c.base}" stroke-width="1.5"/><line x1="2" y1="35" x2="42" y2="35" stroke="${c.base}" stroke-width="1"/><rect x="6" y="18" width="32" height="8" rx="2" fill="${c.body2}" stroke="${c.base}" stroke-width="1.5"/><rect x="3" y="13" width="38" height="5" rx="1" fill="${c.roof}"/><polygon points="2,13 22,4 42,13" fill="${c.peak}"/>${mkQDot(22,10)}</svg>`;

  const svgs = {
    'Langstroth': langstroth,
    'Dadant': dadant,
    'Yerli': `<svg viewBox="0 0 50 38" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="6" width="38" height="26" rx="13" fill="${c.log}" stroke="#5A3A20" stroke-width="1.5"/><line x1="6" y1="14" x2="42" y2="14" stroke="#5A3A20" stroke-width="0.8"/><line x1="5" y1="19" x2="43" y2="19" stroke="#5A3A20" stroke-width="0.8"/><line x1="6" y1="24" x2="42" y2="24" stroke="#5A3A20" stroke-width="0.8"/><ellipse cx="43" cy="19" rx="6" ry="11.5" fill="#C4956A" stroke="#5A3A20" stroke-width="1.5"/><circle cx="8" cy="24" r="2.5" fill="#3A2010"/>${mkQDot(25,12)}</svg>`,
    'Çerçeveli': `<svg viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="44" width="40" height="4" rx="1.5" fill="${c.base}"/><rect x="3" y="16" width="38" height="28" rx="2" fill="${c.body}" stroke="${c.base}" stroke-width="1.5"/><rect x="7" y="19" width="5" height="22" rx="1" fill="${c.frame}" stroke="#C4A020" stroke-width="0.8"/><rect x="15" y="19" width="5" height="22" rx="1" fill="${c.frame}" stroke="#C4A020" stroke-width="0.8"/><rect x="23" y="19" width="5" height="22" rx="1" fill="${c.frame}" stroke="#C4A020" stroke-width="0.8"/><rect x="31" y="19" width="5" height="22" rx="1" fill="${c.frame}" stroke="#C4A020" stroke-width="0.8"/><rect x="1" y="11" width="42" height="5" rx="1" fill="${c.roof}"/><polygon points="0,11 22,2 44,11" fill="${c.peak}"/>${mkQDot(22,8)}</svg>`,
    'Ana Arı Kovanı': `<svg viewBox="0 0 36 52" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="44" width="32" height="4" rx="1.5" fill="${c.base}"/><rect x="3" y="26" width="30" height="18" rx="2" fill="#F5C842" stroke="${c.base}" stroke-width="1.5"/><text x="18" y="40" font-size="13" text-anchor="middle" fill="${c.base}" font-family="serif">♛</text><rect x="5" y="18" width="26" height="8" rx="2" fill="#F8D860" stroke="${c.base}" stroke-width="1.5"/><rect x="2" y="13" width="32" height="5" rx="1" fill="${c.roof}"/><polygon points="1,13 18,4 35,13" fill="${c.peak}"/>${mkQDot(18,10)}</svg>`,
    'Nükleus (Ruşet)': `<svg viewBox="0 0 46 48" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="40" width="42" height="4" rx="1.5" fill="${c.base}"/><rect x="2" y="24" width="19" height="16" rx="2" fill="${c.body2}" stroke="${c.base}" stroke-width="1.5"/><rect x="25" y="24" width="19" height="16" rx="2" fill="${c.body2}" stroke="${c.base}" stroke-width="1.5"/><ellipse cx="11.5" cy="39.5" rx="3" ry="1" fill="#3A2010"/><ellipse cx="34.5" cy="39.5" rx="3" ry="1" fill="#3A2010"/><rect x="2" y="17" width="42" height="7" rx="2" fill="${c.body}" stroke="${c.base}" stroke-width="1.5"/><rect x="1" y="12" width="44" height="5" rx="1" fill="${c.roof}"/><polygon points="0,12 23,3 46,12" fill="${c.peak}"/>${mkQDot(23,9)}</svg>`,
    'Diğer': `<svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="40" width="36" height="4" rx="1.5" fill="${c.base}"/><rect x="3" y="22" width="34" height="18" rx="2" fill="${c.body}" stroke="${c.base}" stroke-width="1.5"/><line x1="3" y1="31" x2="37" y2="31" stroke="${c.base}" stroke-width="1"/><rect x="1" y="17" width="38" height="5" rx="1" fill="${c.roof}"/><polygon points="0,17 20,7 40,17" fill="${c.peak}"/>${mkQDot(20,14)}</svg>`,
  };
  return svgs[type] || svgs['Diğer'];
}
```

---

## Task 7: Placement ve Render Fonksiyonları

**Files:**
- Modify: `aricilik.html` — Task 6 bloğunun hemen altına ekle

- [ ] **Adım 1: araziPlaceNew, araziRender, araziRenderHive, araziRenderSpacer ekle**

```javascript
function araziPlaceNew(list) {
  if (!list.length) return;
  const cols  = Math.max(3, Math.ceil(Math.sqrt(list.length)));
  const cStep = Math.round(araziCellPx * 1.6);
  const rStep = Math.round(araziCellPx * 2.4);
  const used  = new Set(Object.values(araziPositions).map(p => `${Math.round(p.x/cStep)},${Math.round(p.y/rStep)}`));
  let c = 0, r = 0;
  list.forEach(h => {
    while (used.has(`${c},${r}`)) { c++; if (c >= cols) { c = 0; r++; } }
    araziPositions[h.id] = { x: c * cStep + 40, y: r * rStep + 40 };
    used.add(`${c},${r}`); c++; if (c >= cols) { c = 0; r++; }
  });
}

function araziRender() {
  const canvas = document.getElementById('arazi-canvas');
  canvas.innerHTML = '';
  araziSpacers.forEach(sp => araziRenderSpacer(sp));
  araziHives.forEach(h => araziRenderHive(h));
  araziUpdateBadge();
}

function araziRenderHive(h) {
  const canvas = document.getElementById('arazi-canvas');
  const pos = araziPositions[h.id] || { x: 20, y: 20 };
  const fls = Math.max(1, Number(h.floors) || 1);
  const W   = Math.round(araziCellPx * 0.85);

  const el = document.createElement('div');
  el.className = 'hi';
  el.dataset.id = h.id;
  el.style.cssText = `left:${pos.x}px;top:${pos.y}px;width:${W}px`;
  if (araziSelectedId === h.id) el.classList.add('sel');

  const svgWrap = document.createElement('div');
  svgWrap.className = 'hbody';
  svgWrap.style.width = W + 'px';
  svgWrap.innerHTML = araziGetHiveTypeSvg(h.type, fls, h.queenColor);

  const numEl = document.createElement('div');
  numEl.className = 'hnum-overlay';
  numEl.textContent = '#' + h.num;
  svgWrap.appendChild(numEl);

  const raceText = [h.race, h.generation].filter(Boolean).join(' ');
  if (raceText) {
    const raceEl = document.createElement('div');
    raceEl.className = 'hrace-overlay';
    raceEl.textContent = raceText;
    svgWrap.appendChild(raceEl);
  }

  el.appendChild(svgWrap);

  const qsMap   = { no:'qs-no', bakire:'qs-bakire', new:'qs-bakire', meme:'qs-meme' };
  const qsLabel = { no:'❌ Arısız', bakire:'🐝 Bakire', new:'🐝 Bakire', meme:'🫙 Meme' };
  const qsCls   = { no:'s-no', bakire:'s-bakire', new:'s-bakire', meme:'s-meme' };
  if (qsMap[h.queenStatus]) {
    el.classList.add(qsMap[h.queenStatus]);
    const badge = document.createElement('div');
    badge.className = 'hstatus ' + qsCls[h.queenStatus];
    badge.textContent = qsLabel[h.queenStatus];
    el.appendChild(badge);
  }

  araziAttachDrag(el, h.id, 'hive');
  el.addEventListener('dblclick', e => { e.stopPropagation(); araziOpenPopup(h.id); });
  el.addEventListener('click',    e => { e.stopPropagation(); araziSelectItem(h.id); });
  canvas.appendChild(el);
}

function araziRenderSpacer(sp) {
  const canvas = document.getElementById('arazi-canvas');
  const el = document.createElement('div');
  el.className = 'spi';
  el.dataset.id = sp.id;
  el.style.cssText = `left:${sp.x}px;top:${sp.y}px;width:${sp.w}px;height:${sp.h}px`;
  if (araziSelectedId === sp.id) el.classList.add('sel');
  el.textContent = '◻';
  araziAttachDrag(el, sp.id, 'spacer');
  el.addEventListener('click', e => { e.stopPropagation(); araziSelectItem(sp.id); });
  canvas.appendChild(el);
}
```

- [ ] **Adım 2: Tarayıcıda arazi sayfasına git, konsola `araziRender()` yaz — hata olmamalı (boş canvas gösterir)**

---

## Task 8: Drag, Seçim ve Badge

**Files:**
- Modify: `aricilik.html` — Task 7 bloğunun hemen altına ekle

- [ ] **Adım 1: araziAttachDrag, araziSelectItem, araziUpdateBadge ekle**

```javascript
function araziAttachDrag(el, id, type) {
  let sx, sy, sl, st, moved = false;

  el.addEventListener('pointerdown', e => {
    if (e.button && e.button !== 0) return;
    e.stopPropagation();
    el.setPointerCapture(e.pointerId);
    sx = e.clientX; sy = e.clientY;
    sl = parseFloat(el.style.left) || 0;
    st = parseFloat(el.style.top)  || 0;
    moved = false;
    el.classList.add('dragging');
    el.style.zIndex = 500;
  }, { passive: false });

  el.addEventListener('pointermove', e => {
    if (!el.classList.contains('dragging')) return;
    e.preventDefault();
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    let nx = sl + dx, ny = st + dy;
    if (araziSnapFactor > 0) {
      const s = araziCellPx * araziSnapFactor;
      nx = Math.round(nx / s) * s; ny = Math.round(ny / s) * s;
    }
    nx = Math.max(0, nx); ny = Math.max(0, ny);
    el.style.left = nx + 'px'; el.style.top = ny + 'px';
  }, { passive: false });

  el.addEventListener('pointerup', e => {
    if (!el.classList.contains('dragging')) return;
    el.releasePointerCapture(e.pointerId);
    el.classList.remove('dragging');
    el.style.zIndex = '';
    const nx = parseFloat(el.style.left), ny = parseFloat(el.style.top);
    if (type === 'hive') araziPositions[id] = { x: nx, y: ny };
    else { const sp = araziSpacers.find(s => s.id === id); if (sp) { sp.x = nx; sp.y = ny; } }
  });
}

function araziSelectItem(id) {
  araziSelectedId = (araziSelectedId === id) ? null : id;
  document.querySelectorAll('#arazi-canvas .hi, #arazi-canvas .spi').forEach(el => {
    el.classList.toggle('sel', el.dataset.id === araziSelectedId);
  });
  araziUpdateBadge();
}

function araziUpdateBadge() {
  const b = document.getElementById('arazi-sel-badge');
  if (!b) return;
  if (araziSelectedId) {
    const h = araziHives.find(x => x.id === araziSelectedId);
    b.textContent = h ? '#' + h.num + ' seçili' : 'seçili';
  } else {
    b.textContent = araziHives.length + ' kovan';
  }
}
```

---

## Task 9: Popup Fonksiyonları

**Files:**
- Modify: `aricilik.html` — Task 8 bloğunun hemen altına ekle

- [ ] **Adım 1: araziOpenPopup, araziClosePopup, araziNavToSelected ekle**

```javascript
function araziOpenPopup(id) {
  const h = araziHives.find(x => x.id === id); if (!h) return;
  araziPopupHiveId = id;
  araziSelectItem(id);

  document.getElementById('arazi-pu-num').textContent  = 'Kovan #' + h.num;
  document.getElementById('arazi-pu-type').textContent = [h.type, h.race, h.generation].filter(Boolean).join(' · ');

  const qd = document.getElementById('arazi-pu-qdot');
  const qc = ARAZI_QC[h.queenColor] || '#CCC';
  qd.style.background = qc;
  if (h.queenColor === 'unpainted') qd.style.cssText = 'width:18px;height:18px;border-radius:50%;background:white;border:2px dashed #888;margin-left:auto;flex-shrink:0';

  const fls = Math.max(1, Number(h.floors) || 1);
  const str = Number(h.strength) || 0;
  const dots     = [1,2,3,4,5].map(i => `<div class="arazi-sdot${i<=str?' on':''}"></div>`).join('');
  const floorViz = Array.from({length:fls}, (_, i) => {
    const h2 = 28 + i * 4;
    return `<div class="arazi-fbox" style="height:${h2}px"></div>`;
  }).reverse().join('');

  document.getElementById('arazi-pu-body').innerHTML = `
    <div class="arazi-info-row"><span class="arazi-info-lbl">Ana Arı</span><span class="arazi-info-val">${ARAZI_QL[h.queenStatus]||h.queenStatus||'-'}</span></div>
    <div class="arazi-info-row"><span class="arazi-info-lbl">Irk</span><span class="arazi-info-val">${h.race||'-'}</span></div>
    <div class="arazi-info-row"><span class="arazi-info-lbl">Kuşak</span><span class="arazi-info-val">${h.generation||'-'}</span></div>
    <div class="arazi-info-row"><span class="arazi-info-lbl">Tip</span><span class="arazi-info-val">${h.type||'-'}</span></div>
    <div class="arazi-info-row"><span class="arazi-info-lbl">Kat</span><div style="display:flex;gap:4px;align-items:flex-end">${floorViz}</div></div>
    <div class="arazi-info-row"><span class="arazi-info-lbl">Güç</span><div style="display:flex;gap:4px">${dots}</div></div>
    ${h.notes ? `<div class="arazi-info-row" style="border:none"><span class="arazi-info-lbl">Not</span><span class="arazi-info-val" style="font-size:12px;text-align:right;max-width:200px">${h.notes}</span></div>` : ''}
  `;

  document.getElementById('arazi-overlay').classList.add('open');
}

function araziClosePopup(e) {
  if (e && e.target !== document.getElementById('arazi-overlay')) return;
  document.getElementById('arazi-overlay').classList.remove('open');
  araziPopupHiveId = null;
}

function araziNavToSelected() {
  const id = araziPopupHiveId; if (!id) return;
  araziClosePopup();
  navigate('hives');
  // Kovanlar sayfası açıkken kovanı bul ve scroll et (renderHives zaten render eder)
}
```

- [ ] **Adım 2: Tarayıcıda arazi sayfasında bir kovana çift tık yap, popup açılmalı; "Kovan'a Git" tıkla, kovanlar sayfasına dönmeli**

---

## Task 10: Araç Çubuğu Aksiyonları

**Files:**
- Modify: `aricilik.html` — Task 9 bloğunun hemen altına ekle

- [ ] **Adım 1: Zoom, snap, spacer mode, delete, auto-arrange, save, refresh, export fonksiyonlarını ekle**

```javascript
function araziSetZoom(v) {
  araziCellPx = Number(v);
  document.documentElement.style.setProperty('--arazi-cell', araziCellPx + 'px');
  araziRender();
}

function araziSetSnap(v, btn) {
  araziSnapFactor = v;
  if (araziLastSnapBtn) araziLastSnapBtn.classList.remove('active');
  if (btn) { btn.classList.add('active'); araziLastSnapBtn = btn; }
}

function araziToggleSpacerMode() {
  araziSpacerMode = !araziSpacerMode;
  const btn = document.getElementById('arazi-btn-spacer');
  if (!btn) return;
  btn.textContent = araziSpacerMode ? '✓ Boşluk' : '+ Boşluk';
  btn.style.background = araziSpacerMode ? 'var(--honey)' : '';
  showToast(araziSpacerMode ? 'Haritaya tıklayarak boşluk ekle' : 'Boşluk ekleme iptal');
}

function araziDeleteSelected() {
  if (!araziSelectedId) { showToast('Önce bir öğe seç'); return; }
  if (araziSelectedId.startsWith('sp_')) {
    araziSpacers = araziSpacers.filter(s => s.id !== araziSelectedId);
  } else {
    delete araziPositions[araziSelectedId];
  }
  araziSelectedId = null; araziRender(); showToast('Silindi');
}

function araziAutoArrange() {
  araziPositions = {};
  const sorted = [...araziHives].sort((a, b) => Number(a.num) - Number(b.num));
  araziPlaceNew(sorted);
  araziRender(); showToast('Yeniden düzenlendi');
}

function araziRefresh() {
  const prev = new Set(araziHives.map(h => h.id));
  araziHives = [...(data.hives || [])];
  // Pozisyonu olmayan yeni kovanları yerleştir
  const newOnes = araziHives.filter(h => !araziPositions[h.id]);
  araziPlaceNew(newOnes);
  // Silinmiş kovanların pozisyonlarını temizle
  const current = new Set(araziHives.map(h => h.id));
  Object.keys(araziPositions).forEach(id => { if (!current.has(id)) delete araziPositions[id]; });
  araziRender();
  showToast('Güncellendi (' + araziHives.length + ' kovan)');
}

function araziSaveLayout() {
  araziLsSet('beebook_arazi_v2', { hives: araziHives, positions: araziPositions, spacers: araziSpacers, savedAt: new Date().toISOString() });
  showToast('Arazi düzeni kaydedildi ✓');
}

function araziExportLayout() {
  const blob = new Blob([JSON.stringify({ hives: araziHives, positions: araziPositions, spacers: araziSpacers }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'arazi-duzen.json';
  a.click();
}
```

---

## Task 11: araziInitPage ve navigate() Entegrasyonu

**Files:**
- Modify: `aricilik.html` — Task 10 bloğunun hemen altına ekle; ayrıca navigate() switch'e case ekle

- [ ] **Adım 1: araziInitPage fonksiyonunu ekle**

```javascript
function araziInitPage() {
  // Veriyi data.hives'ten al
  araziHives = [...(data.hives || [])];

  // Kayıtlı pozisyonları yükle
  const saved = araziLsGet('beebook_arazi_v2');
  if (saved) {
    araziPositions = saved.positions || {};
    araziSpacers   = saved.spacers   || [];
  }

  // Pozisyonu olmayan kovanları yerleştir
  const newOnes = araziHives.filter(h => !araziPositions[h.id]);
  araziPlaceNew(newOnes);

  // Render
  araziRender();

  // Canvas tıklama (spacer ekleme) — sadece bir kez bağla
  if (!araziEventsReady) {
    const canvas = document.getElementById('arazi-canvas');
    const cw     = document.getElementById('arazi-cw');

    canvas.addEventListener('click', e => {
      if (!araziSpacerMode) return;
      const rect = canvas.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      if (araziSnapFactor > 0) {
        const s = araziCellPx * araziSnapFactor;
        x = Math.round(x / s) * s; y = Math.round(y / s) * s;
      }
      const W = Math.round(araziCellPx * 0.78), H = Math.round(W * 0.7);
      const sp = { id: 'sp_' + Date.now(), x: Math.max(0, x), y: Math.max(0, y), w: W, h: H };
      araziSpacers.push(sp); araziRenderSpacer(sp);
      showToast('Boşluk eklendi');
    });

    cw.addEventListener('click', () => {
      if (araziSpacerMode) return;
      araziSelectedId = null;
      document.querySelectorAll('#arazi-canvas .hi.sel, #arazi-canvas .spi.sel').forEach(el => el.classList.remove('sel'));
      araziUpdateBadge();
    });

    araziEventsReady = true;
  }

  // Snap butonunu başlat
  araziLastSnapBtn = document.getElementById('arazi-snap-q');

  // Zoom değerini sıfırla
  const zoomRange = document.getElementById('arazi-zoom-range');
  if (zoomRange) { zoomRange.value = araziCellPx; }
}
```

- [ ] **Adım 2: navigate() switch'e arazi case'ini ekle**

`aricilik.html`'de `function navigate(page)` içindeki switch bloğunu bul:
```javascript
    case 'settings': renderSettings(); break;
```
Sonuna şunu ekle:
```javascript
    case 'arazi': araziInitPage(); break;
```

- [ ] **Adım 3: Klavye kısayollarını ekle — sadece arazi aktifken çalışsın**

Ana uygulamanın `document.addEventListener('keydown', ...)` bloğu varsa oraya ekle; yoksa yeni bir handler ekle:

```javascript
document.addEventListener('keydown', e => {
  if (currentPage !== 'arazi') return;
  if (e.key === 'Escape') {
    if (araziSpacerMode) { araziToggleSpacerMode(); return; }
    araziSelectedId = null;
    document.querySelectorAll('#arazi-canvas .hi.sel, #arazi-canvas .spi.sel').forEach(el => el.classList.remove('sel'));
    araziUpdateBadge(); return;
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && araziSelectedId) {
    e.preventDefault(); araziDeleteSelected(); return;
  }
  const arrows = { ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1] };
  if (arrows[e.key] && araziSelectedId) {
    e.preventDefault();
    const step = e.shiftKey ? araziCellPx * 4 : (araziSnapFactor > 0 ? araziCellPx * araziSnapFactor : 10);
    const [dx, dy] = arrows[e.key];
    const el = document.querySelector(`#arazi-canvas [data-id="${araziSelectedId}"]`); if (!el) return;
    let nx = Math.max(0, parseFloat(el.style.left) + dx * step);
    let ny = Math.max(0, parseFloat(el.style.top)  + dy * step);
    el.style.left = nx + 'px'; el.style.top = ny + 'px';
    if (!araziSelectedId.startsWith('sp_')) araziPositions[araziSelectedId] = { x: nx, y: ny };
    else { const sp = araziSpacers.find(s => s.id === araziSelectedId); if (sp) { sp.x = nx; sp.y = ny; } }
  }
});
```

- [ ] **Adım 4: Tam test — tarayıcıda arazi sayfasına gir**

Kontrol listesi:
- [ ] Kovanlar sayfasında 🗺️ Arazi butonu görünüyor
- [ ] Dashboard'da 5 quick action görünüyor, Arazi butonu var
- [ ] Arazi sayfası açılıyor, kovanlar listeleniyor
- [ ] Kovan sürüklenebiliyor, snap çalışıyor
- [ ] Zoom kaydırıcısı çalışıyor
- [ ] Çift tıkla popup açılıyor, bilgiler doğru
- [ ] Ana arısız/bakire/meme kovanlar renkli glow gösteriyor
- [ ] 💾 Kaydet → sayfayı kapat ve aç → pozisyonlar korunsun
- [ ] 🔄 Yenile çalışıyor
- [ ] Boşluk ekleme çalışıyor
- [ ] Diğer sayfalar (dashboard, kovanlar, vb.) bozulmamış

- [ ] **Adım 5: Commit**

```bash
git add aricilik.html
git commit -m "feat: arazi düzeni aricilik.html'e entegre edildi (v2.0)"
git push origin master && git push origin master:main
```

---

## Task 12: Dokümantasyon Güncellemeleri

**Files:**
- Modify: `CLAUDE.md`
- Create: `memory/project_v2.0.md`
- Modify: `memory/MEMORY.md`

- [ ] **Adım 1: CLAUDE.md'yi v2.0 olarak güncelle**

`CLAUDE.md` içinde şu değişiklikleri yap:

**Sayfalar tablosuna ekle** (Ayarlar satırından önce):
```markdown
| Arazi Düzeni | arazi | Kovan konumlarını haritaya yerleştir — Kovanlar sayfası ve Dashboard'dan erişilir |
```

**Önemli Fonksiyonlar tablosuna ekle:**
```markdown
| `araziInitPage()` | Arazi sayfasını başlatır: data.hives'ten kovan al, pozisyonları yükle, render et |
| `araziRender()` | Arazi canvas'ını temizleyip tüm kovanları ve boşlukları çizer |
| `araziSaveLayout()` | Kovan pozisyonlarını ve boşlukları `beebook_arazi_v2` anahtarına kaydeder |
| `araziRefresh()` | data.hives ile arazi kovan listesini senkronize eder |
| `araziGetHiveTypeSvg()` | Arazi için SVG builder (ana arı renk noktasını üçgen içine gömer) |
```

**Versiyon geçmişine ekle** (v1.9'dan önce):
```markdown
- **v2.0** (Mayıs 2026) — Mevcut durum
  - Arazi Düzeni aricilik.html'e entegre edildi (ayrı dosyadan ana uygulamaya)
  - Erişim: Kovanlar sayfası 🗺️ butonu + Dashboard hızlı erişim
  - Ana arısız/bakire/meme kovanlar renkli glow ve etiketle vurgulandı
  - Ana arı renk noktası SVG üçgen içine taşındı
  - CLAUDE.md GitHub'dan kaldırıldı (.gitignore)
```

- [ ] **Adım 2: memory/project_v2.0.md dosyasını oluştur**

```markdown
---
name: project-v2.0
description: Beebook v2.0 - Mayıs 2026 arazi entegrasyonu ve v2.0 çıkışı
metadata:
  type: project
---

Beebook v2.0 Mayıs 2026'da yayınlandı. Ana değişiklik: bağımsız `arazi-duzen.html` dosyası `aricilik.html`'e entegre edildi.

**Why:** Kullanıcı tek dosyadan erişmek istedi; ayrı dosyanın bakımı zorlaşıyordu.

**How to apply:** Arazi ile ilgili tüm JS fonksiyonları `arazi` prefix'i taşır (`araziInitPage`, `araziRender` vb.); sabitler `ARAZI_QC`, `ARAZI_QL`; CSS `#page-arazi` scope'u altında.

CLAUDE.md GitHub'dan kaldırıldı — sadece yerel disk'te ve Claude Code context'inde.
```

- [ ] **Adım 3: memory/MEMORY.md'ye yeni satır ekle**

Mevcut indeksin başına ekle:
```markdown
- [Beebook v2.0 Değişiklikleri](project_v2.0.md) — Mayıs 2026: arazi entegrasyonu, CLAUDE.md gitignore, v2.0
```

- [ ] **Adım 4: Commit ve push**

```bash
git add CLAUDE.md memory/
git commit -m "docs: v2.0 dokümantasyon ve hafıza güncellendi"
git push origin master && git push origin master:main
```

---

## Task 13: Final Doğrulama

- [ ] **Adım 1: GitHub Pages'i kontrol et**

`https://kamilsaim.github.io/beebook/` adresinde:
- Arazi sayfasına Dashboard ve Kovanlar'dan erişilebildiğini doğrula
- Diğer tüm sayfaların çalıştığını doğrula

- [ ] **Adım 2: CLAUDE.md GitHub'da görünmüyor**

`https://github.com/kamilsaim/beebook` adresinde CLAUDE.md listede yok.

- [ ] **Adım 3: Tüm test kriterlerini işaretle**

Spec'teki test listesinin tamamı geçti:
- [ ] `navigate('arazi')` her iki erişim noktasından çalışır
- [ ] `data.hives`'teki tüm kovanlar görünür
- [ ] Kovan sürükleme, snap, zoom çalışır
- [ ] Ana arı renk noktası üçgen içinde
- [ ] Ana arısız/bakire/meme glow+etiket görünür
- [ ] Kaydet/yükle pozisyonları korur
- [ ] Yenile yeni kovanlarda çalışır
- [ ] Diğer sayfalar bozulmamış
- [ ] CLAUDE.md GitHub'da yok, disk'te var
