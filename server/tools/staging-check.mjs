#!/usr/bin/env node
// ============================================================================
//  staging-check — deploy qilingan dars-api'ni TASHQARIDAN (bizning kompyuter) qabul-tekshiruvi.
//  Kristina manzil bergan kuni bitta buyruq: hamma ✓ bo'lsa pilot yig'iladi (STAGING_QABUL_UZ.md).
//
//    node --env-file=.env.deploy.staging tools/staging-check.mjs https://staging-dars-api.coddycamp.uz
//    node --env-file=.env.deploy.prod    tools/staging-check.mjs https://dars-api.coddycamp.uz --read-only
//    lokal:  node --env-file=.env tools/staging-check.mjs http://127.0.0.1:3001 --local
//
//  Env'dan (deploy-fayl bilan bir xil bo'lishi kerak — aynan shu solishtiriladi):
//    DARS_ENV · CODDYCAMP_LIVE_JWT_SECRET/ISSUER/AUDIENCE/KEY_ID (sinov-token yasash) · _NEXT juftligi (rotatsiya: jwt_next) · CORS_ORIGINS · ADMIN_USER/ADMIN_PASSWORD · RESULT_DETAILS
//  Bayroqlar:
//    --read-only     sessiya yaratmaydi, token ro'yxatga olmaydi (prod uchun)
//    --local         proksi/TLS talablari yo'q (127.0.0.1)
//    --lesson <id>   sinov darsi (default internet-01-v18 — katalogda bo'lishi shart)
//    --sha <qisqa>   kutilgan GIT_SHA (health.version oxiri)
//    --origin <url>  CORS uchun brauzer-origin (default CORS_ORIGINS'dagi birinchisi yoki https://lms.coddycamp.uz)
//    --timeout <ms>  har so'rov uchun (default 8000)
//  Chiqish kodi: ✗ soni (0 = qabul).
//  Nima tekshirilmaydi (faqat serverda ko'rinadi): zaxira-dump, log-rotatsiya, konteyner resurs-limitlari — TZ §6.
// ============================================================================
import { readdirSync, readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { randomUUID } from 'node:crypto';
import { SignJWT } from 'jose';
import { keyFromSecret } from '../src/modules/lms/jwt.js';

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const BASE = (argv.find((a) => /^https?:\/\//.test(a)) || '').replace(/\/+$/, '');
if (!BASE) { console.error('Manzil kerak: node --env-file=.env.deploy.staging tools/staging-check.mjs https://…'); process.exit(2); }
const READ_ONLY = flag('read-only');
const LOCAL = flag('local');
const LESSON = opt('lesson', 'internet-01-v18');
const EXPECT_SHA = opt('sha', null);
const TIMEOUT = Number(opt('timeout', 8000));
const ORIGIN = opt('origin', (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)[0] || 'https://lms.coddycamp.uz');
const ENV = process.env;
const JWT = { secret: ENV.CODDYCAMP_LIVE_JWT_SECRET, iss: ENV.CODDYCAMP_LIVE_JWT_ISSUER || 'coddycamp-lms', aud: ENV.CODDYCAMP_LIVE_JWT_AUDIENCE || 'dars-platform', kid: ENV.CODDYCAMP_LIVE_JWT_KEY_ID || 'v1' };
const API = `${BASE}/api/v1`;
const SUB_MENTOR = 990001, GID = 990001, SUB_STUDENT = 990002; // sinov-shaxslar: LMS'da yo'q (School API 404 kutiladi)

const C = { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' };
const results = [];
class Warn extends Error {}
class Skip extends Error {}
async function check(name, fn) {
  const t0 = performance.now();
  try {
    const detail = await fn();
    results.push({ name, st: 'ok' });
    console.log(` ${C.g}✓${C.x} ${name.padEnd(16)} ${C.d}${detail || ''}${C.x}`);
  } catch (e) {
    const st = e instanceof Warn ? 'warn' : e instanceof Skip ? 'skip' : 'fail';
    results.push({ name, st, msg: e.message });
    const mark = st === 'warn' ? `${C.y}⚠${C.x}` : st === 'skip' ? `${C.d}–${C.x}` : `${C.r}✗${C.x}`;
    console.log(` ${mark} ${name.padEnd(16)} ${st === 'fail' ? C.r : C.y}${String(e.message).slice(0, 300)}${C.x}`);
  }
  return performance.now() - t0;
}

/** fetch + timeout + JSON/text + vaqt. Tarmoq xatosi → aniq xabar. */
async function req(url, init = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  const t0 = performance.now();
  let r;
  try {
    r = await fetch(url, { redirect: 'manual', ...init, signal: ctrl.signal });
  } catch (e) {
    const cause = e?.cause?.code || e?.cause?.message || e?.name;
    throw new Error(`tarmoq: ${cause || e.message} (${url})`);
  } finally { clearTimeout(timer); }
  const ms = Math.round(performance.now() - t0);
  const text = await r.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* JSON emas */ }
  return { status: r.status, headers: r.headers, json, text, ms };
}
const h = (r, name) => r.headers.get(name);
const expectJsonError = (r, status, code) => {
  if (r.status !== status) throw new Error(`HTTP ${r.status} (kutilgan ${status}) — ${r.text.slice(0, 120) || 'bo\'sh'}`);
  if (!r.json || r.json.error !== code) throw new Error(`javob ${code} emas: ${r.text.slice(0, 120)} — so'rov ilovaga yetmayapti (proksi sahifasi?)`);
};

async function mint({ role, sub, name, gid, secret = JWT.secret, iat = Math.floor(Date.now() / 1000), ttl = 900, kid = JWT.kid }) {
  if (!secret) throw new Skip('CODDYCAMP_LIVE_JWT_SECRET env\'da yo\'q — token-tekshiruvlar o\'tkazildi');
  const payload = { role, name, jti: `check-${randomUUID()}` };
  if (role === 'mentor') payload.gid = gid; else payload.crm_id = 1;
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256', typ: 'JWT', kid })
    .setIssuer(JWT.iss).setAudience(JWT.aud).setSubject(String(sub))
    .setIssuedAt(iat).setNotBefore(iat).setExpirationTime(iat + ttl).sign(keyFromSecret(secret));
}
const bearer = (t) => ({ authorization: `Bearer ${t}`, 'content-type': 'application/json' });
const rpc = (fn, body) => req(`${API}/live/rpc/${fn}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

const localMigrations = readdirSync(new URL('../migrations/', import.meta.url)).filter((f) => f.endsWith('.sql')).length;
let localCatalog = null;
try { localCatalog = JSON.parse(readFileSync(new URL('../data/lesson-catalog.json', import.meta.url), 'utf8')).count; } catch { /* katalog yo'q */ }

console.log(`${C.b}dars-api qabul-tekshiruvi${C.x} → ${BASE}${C.d}  (${new Date().toISOString().slice(0, 16)}Z · ${READ_ONLY ? 'faqat o\'qish' : 'to\'liq'}${LOCAL ? ' · lokal' : ''})${C.x}`);
let health = null;

await check('health', async () => {
  const r = await req(`${API}/health`);
  if (r.status !== 200 || !r.json) throw new Error(`HTTP ${r.status}: ${r.text.slice(0, 160) || 'bo\'sh'}`);
  if (r.json.checks?.db !== 'ok') throw new Error(`baza: ${r.json.checks?.db} (${r.json.status})`);
  if (h(r, 'cache-control') !== 'no-store') throw new Warn(`cache-control: ${h(r, 'cache-control')} (no-store kutilgan — proksi kesh qo'shyaptimi?)`);
  health = r.json;
  const up = Math.round(health.uptime_s / 60);
  return `${health.version} · ${health.env} · ${up} daqiqa · db ${health.checks.db_ms} ms · ${r.ms} ms`;
});
if (!health) { summary(); process.exit(1); }

await check('env', async () => {
  if (!ENV.DARS_ENV) throw new Warn('DARS_ENV env\'da yo\'q — solishtirilmadi');
  if (health.env !== ENV.DARS_ENV) throw new Error(`serverda ${health.env}, env-faylda ${ENV.DARS_ENV} — boshqa instansiya/port?`);
  return health.env;
});

await check('version', async () => {
  const sha = String(health.version).split('+')[1] || '';
  if (EXPECT_SHA) { if (!sha.startsWith(EXPECT_SHA)) throw new Error(`serverda +${sha}, kutilgan +${EXPECT_SHA} — eski image`); return `+${sha} = kutilgan`; }
  if (!sha || sha === 'unknown' || sha === 'dev') throw new Warn(`GIT_SHA yo'q (${health.version}) — CI build-arg uzatilmagan; --sha bilan tekshirib bo'lmaydi`);
  return `+${sha} (--sha bilan solishtiring)`;
});

await check('migrations', async () => {
  const n = health.checks?.migrations;
  if (n === undefined) throw new Error('health\'da migrations yo\'q — eski image (2026-09-08 dan oldingi)');
  if (n === null) throw new Error('schema_migrations jadvali yo\'q — migrate xizmati ishlamagan');
  if (n !== localMigrations) throw new Error(`serverda ${n}, lokal ${localMigrations} ta migratsiya — image eski yoki migrate yiqilgan`);
  return `${n}/${localMigrations}`;
});

await check('catalog', async () => {
  const n = health.checks?.catalog;
  if (n === undefined || n === null) throw new Error('katalog soni yo\'q — eski image yoki jadval yo\'q');
  if (n === 0) throw new Error('lesson_catalog BO\'SH — seed:catalog yurmagan (compose migrate: migrate && seed); har join «dars topilmadi» beradi');
  if (localCatalog && n !== localCatalog) throw new Warn(`serverda ${n}, lokal ${localCatalog} dars — katalog eski (keyingi deploy yangilaydi)`);
  return `${n} dars`;
});

await check('features', async () => {
  if (!health.features) throw new Warn('health\'da features yo\'q (eski image) — ko\'prik holati bridge_401/mentor_flow bandlaridan ko\'rinadi');
  const f = health.features;
  if (!f.lms_bridge) throw new Error('LMS-ko\'prik O\'CHIQ — CODDYCAMP_* / TOKEN_ENC_KEY env-faylda yetmayapti');
  const want = ENV.RESULT_DETAILS || 'off';
  const notes = [];
  if (!f.results_worker) notes.push('natija-ishchi o\'chiq (RESULTS_WORKER_ENABLED=false) — natijalar LMS\'ga ketmaydi');
  if (f.result_details !== want) notes.push(`RESULT_DETAILS serverda ${f.result_details}, env-faylda ${want}`);
  if (notes.length) throw new Warn(notes.join(' · '));
  return `bridge on · worker on · details ${f.result_details}`;
});

await check('clock', async () => {
  const t = Date.parse(health.time || '') || Date.parse(h((await req(`${API}/health`)), 'date') || '');
  if (!t) throw new Warn('server vaqti o\'qilmadi');
  const skew = Math.abs(t - Date.now()) / 1000;
  if (skew > 30) throw new Error(`server soati ${Math.round(skew)} s farq qiladi — JWT ±60 s chegarasi; NTP tekshirilsin`);
  return `farq ${skew.toFixed(1)} s`;
});

await check('tls', async () => {
  if (LOCAL) throw new Skip('lokal');
  if (!BASE.startsWith('https://')) throw new Error('manzil https emas — JWT ochiq kanalda ketadi');
  const http = BASE.replace(/^https:/, 'http:');
  try {
    const r = await req(`${http}/api/v1/health`);
    if (r.status >= 300 && r.status < 400 && String(h(r, 'location')).startsWith('https://')) return `http → https ${r.status}`;
    if (r.status === 200) throw new Warn('http (shifrsiz) ham 200 beradi — https\'ga yo\'naltirish tavsiya');
    throw new Warn(`http ${r.status} (yo'naltirish yo'q)`);
  } catch (e) { if (e instanceof Warn) throw e; return 'http yopiq (faqat https)'; }
});

await check('not_found', async () => {
  const r = await req(`${API}/__yoq_${Date.now()}`);
  expectJsonError(r, 404, 'not_found');
  const leak = h(r, 'x-powered-by');
  if (leak) throw new Warn(`x-powered-by: ${leak} sarlavhasi ochiq`);
  return `404 JSON · server: ${h(r, 'server') || '—'}`;
});

await check('cors_allow', async () => {
  const r = await req(`${API}/lms/join`, { method: 'OPTIONS', headers: { origin: ORIGIN, 'access-control-request-method': 'POST', 'access-control-request-headers': 'authorization,content-type' } });
  const allow = h(r, 'access-control-allow-origin');
  if (allow !== ORIGIN) throw new Error(`Origin ${ORIGIN} → allow-origin: ${allow || 'YO\'Q'} (HTTP ${r.status}) — CORS_ORIGINS env yoki proksi sarlavhani yutyapti`);
  const hdr = String(h(r, 'access-control-allow-headers') || '').toLowerCase();
  if (!hdr.includes('authorization')) throw new Error(`allow-headers'da authorization yo'q: ${hdr}`);
  return `${ORIGIN} ✓ · authorization ✓`;
});

await check('cors_deny', async () => {
  const bad = 'https://begona.example';
  const r = await req(`${API}/health`, { headers: { origin: bad } });
  const allow = h(r, 'access-control-allow-origin');
  if (allow === '*' ) throw new Error('allow-origin: * — proksi (Apache Header set) hammaga ochib qo\'ygan');
  if (allow === bad) throw new Error('begona origin ruxsat olgan');
  return 'begona origin rad';
});

await check('body_path', async () => {
  // katta lekin ruxsatli tana (48 KB) ilovaga yetib boradimi (Apache LimitRequestBody / WAF): sxema-xato → 400 JSON kutiladi
  const body = JSON.stringify({ p_pin: '000000', p_token: 'x'.repeat(48 * 1024) });
  const r = await rpc('session_heartbeat', JSON.parse(body));
  if (r.status === 413 || r.status === 403 || r.status === 502) throw new Error(`HTTP ${r.status} — proksi tanani kesyapti (LimitRequestBody/WAF); progress 64 KB gacha bo'lishi kerak`);
  if (!r.json || !r.json.error) throw new Error(`HTTP ${r.status}, JSON emas: ${r.text.slice(0, 100)}`);
  return `48 KB → ${r.status} ${r.json.error}`;
});

await check('bridge_401', async () => {
  const r = await req(`${API}/lms/join`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lesson_id: LESSON }) });
  if (r.status === 503 && r.json?.error === 'lms_bridge_disabled') throw new Error('LMS-ko\'prik o\'chiq (env yetmayapti)');
  expectJsonError(r, 401, 'unauthorized');
  return 'tokensiz → 401';
});

await check('jwt_reject', async () => {
  const expired = await mint({ role: 'student', sub: SUB_STUDENT, name: 'Muddati o\'tgan', iat: Math.floor(Date.now() / 1000) - 7200, ttl: 3600 });
  const r1 = await req(`${API}/lms/join`, { method: 'POST', headers: bearer(expired), body: JSON.stringify({ lesson_id: LESSON }) });
  if (r1.status !== 401) throw new Error(`muddati o'tgan token → HTTP ${r1.status} (401 kutilgan): ${r1.text.slice(0, 100)}`);
  const wrong = await mint({ role: 'student', sub: SUB_STUDENT, name: 'Begona kalit', secret: 'begona-secret-begona-secret-1234' });
  const r2 = await req(`${API}/lms/join`, { method: 'POST', headers: bearer(wrong), body: JSON.stringify({ lesson_id: LESSON }) });
  if (r2.status !== 401) throw new Error(`begona secret → HTTP ${r2.status} (401 kutilgan)`);
  const badKid = await mint({ role: 'student', sub: SUB_STUDENT, name: 'Kid', kid: 'v0' });
  const r3 = await req(`${API}/lms/join`, { method: 'POST', headers: bearer(badKid), body: JSON.stringify({ lesson_id: LESSON }) });
  if (r3.status !== 401) throw new Error(`noma'lum kid → HTTP ${r3.status} (401 kutilgan)`);
  return 'muddati o\'tgan · begona secret · noma\'lum kid → 401';
});

await check('jwt_next', async () => {
  // Rotatsiya (SIRLAR_ROTATSIYASI_UZ.md): env-faylda _NEXT juftligi bo'lsa, kid=v2 token serverda QABUL qilinishi kerak.
  // Yon ta'sirsiz tekshiruv: /lms/me — 401 = rad, 404 «Ochiq sessiya yo'q» yoki 200 = qabul.
  const secretNext = ENV.CODDYCAMP_LIVE_JWT_SECRET_NEXT, kidNext = ENV.CODDYCAMP_LIVE_JWT_KEY_ID_NEXT;
  if (!secretNext || !kidNext) throw new Skip('env-faylda _NEXT juftligi yo\'q (rotatsiya boshlanmagan)');
  const tok = await mint({ role: 'mentor', sub: SUB_MENTOR, gid: GID, name: 'Rotatsiya tekshiruvi', secret: secretNext, kid: kidNext });
  const r = await req(`${API}/lms/me?lesson_id=${encodeURIComponent(LESSON)}`, { headers: bearer(tok) });
  if (r.status === 401) throw new Error(`kid=${kidNext} token RAD (${r.json?.error}) — serverdagi env'da _NEXT juftligi yo'q yoki secret boshqa`);
  if (r.status !== 404 && r.status !== 200) throw new Error(`kutilmagan HTTP ${r.status}: ${r.text.slice(0, 100)}`);
  return `kid=${kidNext} qabul (HTTP ${r.status}) — ikkala kalit parallel ishlayapti`;
});

await check('proxy_ip', async () => {
  const plain = (await req(`${API}/health`)).json?.client;
  const spoof = (await req(`${API}/health`, { headers: { 'x-forwarded-for': '203.0.113.9' } })).json?.client;
  if (!plain || !spoof) throw new Warn('health\'da client yo\'q (eski image)');
  const priv = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1$|fc|fd)/i.test(plain.ip || '');
  if (LOCAL) return `ip ${plain.ip} (lokal)`;
  if (!plain.forwarded || priv) throw new Error(`server mijozni ${plain.ip} deb ko'ryapti (forwarded=${plain.forwarded}) — proksi X-Forwarded-For uzatmayapti: butun maktab bitta IP → rate-limit hamma uchun`);
  // DIQQAT: bu yerda SON tavsiya qilinmaydi. Konteyner oldida docker-proxy turadi,
  // soket manzili doim docker ko'prigi bo'ladi va Fastify 5 da sonli trustProxy da
  // req.ip o'sha ko'prik bo'lib qoladi — ya'ni yuqoridagi tekshiruv aynan shu xatoni
  // ushlaydi: butun maktab bitta IP. To'g'ri qiymat — ishonchli tarmoqlar ro'yxati.
  if (spoof.ip === '203.0.113.9') throw new Warn(`X-Forwarded-For soxtalanadi (TRUST_PROXY=true hamma zanjirga ishonadi) — env'da TRUST_PROXY=loopback,172.16.0.0/12 qo'ying (SON BERMANG: req.ip hammaga bitta bo'lib qoladi); hozircha faqat rate-limit aylanib o'tiladi`);
  return `mijoz-IP ${plain.ip} · soxta XFF rad`;
});

await check('admin', async () => {
  const anon = await req(`${BASE}/admin/api/overview`);
  if (anon.status === 404) throw new Warn('admin o\'chiq (ADMIN_USER/ADMIN_PASSWORD env-faylda yo\'q)');
  if (anon.status !== 401 || !/Basic/i.test(h(anon, 'www-authenticate') || '')) throw new Error(`parolsiz → HTTP ${anon.status} (401 Basic kutilgan)`);
  if (!ENV.ADMIN_USER || !ENV.ADMIN_PASSWORD) throw new Warn('401 ✓; env-faylda ADMIN_* yo\'q — kirish sinalmadi');
  const auth = { authorization: 'Basic ' + Buffer.from(`${ENV.ADMIN_USER}:${ENV.ADMIN_PASSWORD}`).toString('base64') };
  const ok = await req(`${BASE}/admin/api/overview`, { headers: auth });
  if (ok.status !== 200 || !ok.json?.queue) throw new Error(`parol bilan → HTTP ${ok.status} — env-fayldagi ADMIN_PASSWORD serverdagidan farq qiladi?`);
  const page = await req(`${BASE}/admin`, { headers: auth });
  if (!/text\/html/.test(h(page, 'content-type') || '')) throw new Warn(`/admin sahifasi HTML emas (${page.status})`);
  const q = Object.entries(ok.json.queue).map(([k, v]) => `${k} ${v}`).join(', ') || 'bo\'sh';
  return `401 ✓ · kirish ✓ · navbat: ${q} · faol: live ${ok.json.active_sessions?.live} solo ${ok.json.active_sessions?.solo}`;
});

let mentorSession = null;
await check('mentor_flow', async () => {
  if (READ_ONLY) throw new Skip('--read-only');
  const tok = await mint({ role: 'mentor', sub: SUB_MENTOR, gid: GID, name: 'Staging tekshiruv' });
  const j = await req(`${API}/lms/join`, { method: 'POST', headers: bearer(tok), body: JSON.stringify({ lesson_id: LESSON }) });
  if (j.status === 401) throw new Error(`token rad (${j.json?.error}) — env-fayldagi CODDYCAMP_LIVE_JWT_SECRET/ISSUER/AUDIENCE/KEY_ID serverdagidan farq qiladi`);
  if (j.status === 404) throw new Error(`dars ${LESSON} katalogda yo'q (${j.json?.message}) — seed:catalog`);
  if (j.status === 503) throw new Error(`503 ${j.json?.error}: ${j.json?.message} — LIVE_MENTOR_CODE yoki baza`);
  if (j.status !== 200 || j.json?.mode !== 'mentor' || !j.json.pin) throw new Error(`join → HTTP ${j.status}: ${j.text.slice(0, 160)}`);
  mentorSession = { pin: j.json.pin, token: j.json.token, tok };
  const notes = [`pin ${j.json.pin}${j.json.resumed ? ' (davom)' : ''}`];
  try {
    const s1 = await req(`${API}/live/session/${j.json.pin}`);
    if (s1.status !== 200 || s1.json?.status !== 'live') throw new Error(`session → ${s1.status} ${s1.json?.status}`);
    const etag = h(s1, 'etag');
    if (!etag) throw new Error('ETag yo\'q — proksi (mod_deflate?) sarlavhani olib tashlagan; polling 304 ishlamaydi');
    const s2 = await req(`${API}/live/session/${j.json.pin}`, { headers: { 'if-none-match': etag } });
    if (s2.status !== 304) throw new Error(`If-None-Match → ${s2.status} (304 kutilgan) — proksi ETag'ni o'zgartiryapti`);
    notes.push('ETag/304 ✓');
    const hb = await rpc('session_heartbeat', { p_pin: j.json.pin, p_token: j.json.token });
    if (hb.status !== 204) throw new Error(`heartbeat → ${hb.status} ${hb.text.slice(0, 80)}`);
    const me = await req(`${API}/lms/me?lesson_id=${encodeURIComponent(LESSON)}`, { headers: bearer(tok) });
    if (me.status !== 200 || me.json?.pin !== j.json.pin) throw new Error(`/lms/me → ${me.status} ${me.text.slice(0, 80)}`);
    notes.push('heartbeat ✓', 'me ✓');
  } finally {
    const end = await rpc('end_session', { p_pin: j.json.pin, p_token: j.json.token });
    if (end.status !== 204) notes.push(`end_session → ${end.status} (sessiya ochiq qolgan bo'lishi mumkin: pin ${j.json.pin})`);
    else {
      const s3 = await req(`${API}/live/session/${j.json.pin}`);
      notes.push(s3.json?.status === 'ended' ? 'yopildi ✓' : `yopilmadi (${s3.json?.status})`);
    }
  }
  return notes.join(' · ');
});

await check('school_api', async () => {
  if (READ_ONLY) throw new Skip('--read-only');
  const tok = await mint({ role: 'student', sub: SUB_STUDENT, name: 'Staging tekshiruv' });
  const r = await req(`${API}/lms/join`, { method: 'POST', headers: bearer(tok), body: JSON.stringify({ lesson_id: LESSON }) });
  const code = r.json?.error;
  if (r.status === 403 && code === 'forbidden') return `School API ulanishi ✓ (noma'lum o'quvchi ${SUB_STUDENT} → kontekst 404 → 403, ${r.ms} ms)`;
  if (r.status === 503 && code === 'school_api_auth') throw new Error('School API kontekst-tokenni rad etdi (401/403) — CODDYCAMP_CONTEXT_API_TOKEN noto\'g\'ri/rotatsiya qilingan');
  if (r.status === 503 && code === 'school_api_unavailable') throw new Error('server School API\'ga chiqa olmadi (DNS/firewall/timeout) — Kristina: konteynerdan school-api.coddycamp.uz ochiqmi?');
  if (r.status === 503 && code === 'school_api_rate_limited') throw new Warn('School API 429 — limit; keyinroq qayta');
  if (r.status === 503) throw new Error(`503 ${code}: ${r.json?.message}`);
  if (r.status === 200 && LOCAL) return `soxta School API ${SUB_STUDENT} ni topdi (rejim ${r.json?.mode}) — lokal`;
  if (r.status === 200) throw new Warn(`${SUB_STUDENT} School API'da TOPILDI (rejim ${r.json?.mode}) — sinov-id band; boshqa id kerak`);
  if (r.status === 401) throw new Error(`token rad (${r.json?.error}) — env-fayldagi CODDYCAMP_LIVE_JWT_* serverdagidan farq qiladi`);
  throw new Error(`HTTP ${r.status}: ${r.text.slice(0, 160)}`);
});

await check('latency', async () => {
  const ms = [];
  for (let i = 0; i < 8; i++) ms.push((await req(`${API}/health`)).ms);
  ms.sort((a, b) => a - b);
  const p50 = ms[Math.floor(ms.length / 2)], p95 = ms[ms.length - 1];
  if (p95 > 1500) throw new Error(`p95 ${p95} ms — juda sekin (polling 2,5 s)`);
  if (p95 > 600) throw new Warn(`p50 ${p50} ms · p95 ${p95} ms — sekinroq (internet yoki server)`);
  return `p50 ${p50} ms · p95 ${p95} ms (8 so'rov, bizning tarmoqdan)`;
});

function summary() {
  const n = (st) => results.filter((r) => r.st === st).length;
  const fails = n('fail');
  console.log(`\n${C.b}Yakun:${C.x} ${C.g}${n('ok')} ✓${C.x} · ${fails ? C.r : ''}${fails} ✗${C.x} · ${C.y}${n('warn')} ⚠${C.x} · ${n('skip')} o'tkazildi`);
  if (fails) {
    console.log(`${C.r}Qabul YO'Q.${C.x} ✗ bandlari: ${results.filter((r) => r.st === 'fail').map((r) => r.name).join(', ')} — kimga: STAGING_QABUL_UZ.md jadvali.`);
  } else {
    console.log(`${C.g}Qabul: server tayyor.${C.x} Keyingi qadam: pilot yig'ish (STAGING_QABUL_UZ.md, 2-qadam).`);
  }
  return fails;
}
process.exit(summary() ? 1 : 0);
