---
name: project-v2.0
description: Beebook v2.0 - Mayıs 2026 arazi entegrasyonu ve v2.0 çıkışı
metadata:
  type: project
---

# Beebook v2.0 — Mayıs 2026

Beebook v2.0 Mayıs 2026'da yayınlandı. Ana değişiklik: bağımsız `arazi-duzen.html` dosyası `aricilik.html`'e entegre edildi.

**Why:** Kullanıcı tek dosyadan erişmek istedi; ayrı dosyanın bakımı zorlaşıyordu.

**How to apply:** Arazi ile ilgili tüm JS fonksiyonları `arazi` prefix'i taşır (`araziInitPage`, `araziRender` vb.); sabitler `ARAZI_QC`, `ARAZI_QL`; CSS `#page-arazi` scope'u altında. CLAUDE.md GitHub'dan kaldırıldı — sadece yerel disk'te ve Claude Code context'inde.
