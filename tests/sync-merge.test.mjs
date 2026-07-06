// Beebook sync merge testleri — bağımlılık yok.
// Çalıştır: node tests/sync-merge.test.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';

const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'aricilik.html'), 'utf8');
const m = html.match(/\/\* BB-MERGE-START \*\/([\s\S]*?)\/\* BB-MERGE-END \*\//);
if (!m) { console.error('HATA: BB-MERGE marker bloğu aricilik.html içinde bulunamadı'); process.exit(1); }
const api = new Function(m[1] +
  '\nreturn { BB_SYNC_COLLECTIONS, bbStable, bbPruneTombstones, bbBuildSnapshot, bbDiffAndStamp, bbMergeData, bbMergeSettings };')();

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log('  ✓ ' + name); }
  catch (e) { fail++; console.error('  ✗ ' + name + '\n    ' + e.message); }
}
const D = (over = {}) => Object.assign(
  { hives: [], sales: [], expenses: [], milk: [], queens: [], tasks: [], seasons: [], stock: [], deleted: [] }, over);
const rec = (id, up, extra = {}) => Object.assign({ id, _up: up }, extra);

// ---- bbMergeData: union ----
t('offline eklenen yerel kayıt yaşar (local-only union)', () => {
  const r = api.bbMergeData(D({ sales: [rec('a', 5)] }), D());
  assert.equal(r.merged.sales.length, 1);
  assert.equal(r.remoteDirty, true);
  assert.equal(r.localDirty, false);
});
t('diğer cihazın eklediği kayıt yaşar (remote-only union)', () => {
  const r = api.bbMergeData(D(), D({ sales: [rec('b', 5)] }));
  assert.equal(r.merged.sales.length, 1);
  assert.equal(r.localDirty, true);
});

// ---- bbMergeData: LWW ----
t('_up büyük olan kazanır', () => {
  const r = api.bbMergeData(
    D({ hives: [rec('h', 10, { num: 'yerel' })] }),
    D({ hives: [rec('h', 20, { num: 'uzak' })] }));
  assert.equal(r.merged.hives[0].num, 'uzak');
});
t('eşit _up: remote kazanır', () => {
  const r = api.bbMergeData(
    D({ hives: [rec('h', 10, { num: 'yerel' })] }),
    D({ hives: [rec('h', 10, { num: 'uzak' })] }));
  assert.equal(r.merged.hives[0].num, 'uzak');
});
t('legacy _up\'sız kayıt: remote alınır, hata yok', () => {
  const r = api.bbMergeData(
    D({ hives: [{ id: 'h', num: 'yerel' }] }),
    D({ hives: [{ id: 'h', num: 'uzak' }] }));
  assert.equal(r.merged.hives[0].num, 'uzak');
});

// ---- bbMergeData: tombstone ----
t('silme kayıttan yeniyse kayıt gider', () => {
  const r = api.bbMergeData(
    D({ deleted: [{ id: 'x', c: 'sales', ts: 30 }] }),
    D({ sales: [rec('x', 10)] }));
  assert.equal(r.merged.sales.length, 0);
  assert.equal(r.merged.deleted.length, 1);
});
t('silmeden sonra düzenlenen kayıt dirilir, tombstone düşer', () => {
  const r = api.bbMergeData(
    D({ deleted: [{ id: 'x', c: 'sales', ts: 30 }] }),
    D({ sales: [rec('x', 40)] }));
  assert.equal(r.merged.sales.length, 1);
  assert.equal(r.merged.deleted.length, 0);
});
t('tombstone birleştirme: aynı id için büyük ts kalır', () => {
  const r = api.bbMergeData(
    D({ deleted: [{ id: 'x', c: 'sales', ts: 10 }] }),
    D({ deleted: [{ id: 'x', c: 'sales', ts: 20 }] }));
  assert.equal(r.merged.deleted.length, 1);
  assert.equal(r.merged.deleted[0].ts, 20);
});

// ---- bbMergeData: bayraklar ve bloblar ----
t('aynı veri: dirty bayrakları false', () => {
  const r = api.bbMergeData(D({ sales: [rec('a', 5)] }), D({ sales: [rec('a', 5)] }));
  assert.equal(r.localDirty, false);
  assert.equal(r.remoteDirty, false);
});
t('araziLayout: _up büyük olan blob kazanır', () => {
  const r = api.bbMergeData(
    D({ araziLayout: { _up: 10, positions: { a: 1 } } }),
    D({ araziLayout: { _up: 20, positions: { a: 2 } } }));
  assert.equal(r.merged.araziLayout.positions.a, 2);
});

// ---- bbPruneTombstones ----
t('90 günden eski tombstone temizlenir', () => {
  const now = Date.now();
  const out = api.bbPruneTombstones(
    [{ id: 'a', c: 'sales', ts: now - 91 * 864e5 }, { id: 'b', c: 'sales', ts: now - 10 * 864e5 }], now);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 'b');
});

// ---- bbDiffAndStamp ----
t('yeni kayıt damgalanır', () => {
  const d = D({ sales: [{ id: 'n1', total: 100 }] });
  api.bbDiffAndStamp(d, api.bbBuildSnapshot(D()), 999);
  assert.equal(d.sales[0]._up, 999);
});
t('değişen kayıt yeniden damgalanır', () => {
  const snap = api.bbBuildSnapshot(D({ sales: [rec('a', 5, { total: 100 })] }));
  const d = D({ sales: [rec('a', 5, { total: 200 })] });
  api.bbDiffAndStamp(d, snap, 999);
  assert.equal(d.sales[0]._up, 999);
});
t('değişmeyen kayıt damgalanmaz', () => {
  const d = D({ sales: [rec('a', 5, { total: 100 })] });
  const snap = api.bbBuildSnapshot(d);
  api.bbDiffAndStamp(d, snap, 999);
  assert.equal(d.sales[0]._up, 5);
});
t('silinen kayıt tombstone olur', () => {
  const snap = api.bbBuildSnapshot(D({ sales: [rec('a', 5)] }));
  const d = D();
  api.bbDiffAndStamp(d, snap, 999);
  assert.equal(d.deleted.length, 1);
  assert.deepEqual(d.deleted[0], { id: 'a', c: 'sales', ts: 999 });
});

// ---- bbMergeSettings ----
t('settings: _up büyük olan blob kazanır', () => {
  assert.equal(api.bbMergeSettings({ _up: 10, city: 'Ankara' }, { _up: 20, city: 'Bolu' }).city, 'Bolu');
  assert.equal(api.bbMergeSettings({ _up: 30, city: 'Ankara' }, { _up: 20, city: 'Bolu' }).city, 'Ankara');
});
t('settings eşit _up: assign (remote alan bazında ezer, yereldeki fazla alan kalır)', () => {
  const s = api.bbMergeSettings({ city: 'Ankara', fontSize: 16 }, { city: 'Bolu' });
  assert.equal(s.city, 'Bolu');
  assert.equal(s.fontSize, 16);
});

console.log('\n' + pass + ' geçti, ' + fail + ' kaldı');
process.exit(fail ? 1 : 0);
