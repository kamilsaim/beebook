// delete-account — Beebook hesap silme Edge Function
//
// Google Play zorunluluğu: kullanıcı, uygulama içinden hesabını silebilmeli.
// Bu fonksiyon SADECE giriş yapmış kullanıcının KENDİ hesabını siler (verify_jwt=true).
//
// PAYLAŞILAN AUTH TUZAĞI: pdxnpnlwrtswwifevlil projesindeki auth.users, 5 uygulama
// tarafından paylaşılıyor (Beebook=user_data, Bal Defteri=bd_*, Borç Takip=borc_*,
// Hediye Defteri=hediye_*, Bereket=brkt_data). Bu yüzden auth hesabını KÖRLEMESİNE
// silmeyiz — önce sadece Beebook verisini sileriz, sonra kullanıcının başka
// uygulamada verisi kalmış mı bakarız:
//   - Başka uygulamada verisi VARSA  -> auth hesabı korunur (account_deleted:false)
//   - Başka uygulamada verisi YOKSA  -> auth hesabı tümüyle silinir (account_deleted:true)
//
// ÖNEMLİ: Bu projede her uygulamanın KENDİ önekli silme fonksiyonu var
// (bd-delete-account, bereket-delete-account, delete-account=Borç Defteri).
// Beebook bu yüzden 'beebook-delete-account' adını kullanır — önek almazsan
// Borç Defteri'nin delete-account fonksiyonunu ezersin!
//
// Deploy:  supabase functions deploy beebook-delete-account   (verify_jwt varsayılan true)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Kurucu/yönetici hesabı — uygulama sahipsiz kalmasın diye silme reddedilir
const FOUNDER_EMAIL = 'saimkamil@gmail.com';

// Diğer uygulamaların tabloları (hepsinde user_id kolonu var).
// Kullanıcının bu tablolardan herhangi birinde satırı varsa auth hesabı korunur.
const OTHER_APP_TABLES = [
  // Bal Defteri
  'bd_sezonlar', 'bd_hasatlar', 'bd_siparisler', 'bd_zekatlar', 'bd_ayarlar',
  // Borç Takip
  'borc_ayarlar', 'borc_people', 'borc_debts', 'borc_payments', 'borc_cards',
  // Hediye Defteri
  'hediye_persons', 'hediye_records',
  // Bereket
  'brkt_data',
];

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'missing_token' }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Token'dan kullanıcıyı doğrula
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) return json({ error: 'invalid_token' }, 401);
  const user = userData.user;

  // Kurucu hesabı silinemez
  if ((user.email || '').toLowerCase() === FOUNDER_EMAIL.toLowerCase()) {
    return json({ error: 'founder_protected', message: 'Yönetici hesabı silinemez.' }, 403);
  }

  try {
    // 1) Beebook verisini sil
    const { error: delErr } = await admin.from('user_data').delete().eq('user_id', user.id);
    if (delErr) throw delErr;

    // 2) Diğer uygulamalarda verisi var mı? (herhangi birinde satır bulursak dur)
    let hasOtherData = false;
    for (const table of OTHER_APP_TABLES) {
      const { count, error } = await admin
        .from(table)
        .select('user_id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (error) continue; // tablo yoksa/erişilemezse atla
      if ((count || 0) > 0) { hasOtherData = true; break; }
    }

    if (hasOtherData) {
      // Auth hesabı korunur — kişi diğer uygulamalarda kullanmaya devam edebilir
      return json({ ok: true, account_deleted: false });
    }

    // 3) Başka veri yok -> auth hesabını tümüyle sil
    const { error: authDelErr } = await admin.auth.admin.deleteUser(user.id);
    if (authDelErr) throw authDelErr;

    return json({ ok: true, account_deleted: true });
  } catch (e) {
    return json({ error: 'delete_failed', message: String(e?.message || e) }, 500);
  }
});
