#!/usr/bin/env node
// sinov-natija — qo'shma sinovdan keyin dalillarni bir buyruqda yig'adi (§5.2 → Axadulla).
// Nima qiladi: admin API'dan sessiyani topadi → sessiya-detali, School API'ga ketgan payload va uning
// tasdig'i (verify) ni fayllarga yozadi; --onfinished bilan brauzerdan olingan onFinished JSON ni
// tekshiradi (elapsed_ms · at · earned_at · solved · Unicode) va xabar-loyihasini yozadi.
// HECH NARSANI o'zgartirmaydi (faqat GET).
//
// MUHIM: `onFinished` — brauzer-qatlami (Axadulla C-varianti). U serverda saqlanmaydi: o'quvchi
// brauzeridan olinadi (DevTools → Network → LMS front so'rovi, yoki LMS jamoasi bazasidan).
//
// Ishlatish (server/ ichidan):
//   node --env-file=.env.deploy.staging tools/sinov-natija.mjs https://staging-dars-api.coddycamp.uz
//   qo'shimcha: --pin 782030 · --session <uuid> · --gid 1071 · --out <papka> (default ../feedback/lms-sinov-2026-09-09)
//              --onfinished <fayl.json> — brauzerdan olingan onFinished JSON (tekshiriladi va ilova qilinadi)
// Token va parol hech qachon yozilmaydi; payload ichida ism yo'q (LMS ID'lar).

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const BASE = (args.find((a) => /^https?:\/\//.test(a)) || 'https://staging-dars-api.coddycamp.uz').replace(/\/$/, '');
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const PIN = opt('--pin', null);
const SESSION = opt('--session', null);
const GID = opt('--gid', null);
const OUT = opt('--out', '../feedback/lms-sinov-2026-09-09');
const ONFIN = opt('--onfinished', null);
const ENV = process.env;
if (!ENV.ADMIN_USER || !ENV.ADMIN_PASSWORD) {
  console.error("ADMIN_USER/ADMIN_PASSWORD yo'q — `node --env-file=.env.deploy.staging tools/sinov-natija.mjs <url>` bilan yurgizing");
  process.exit(2);
}
const AUTH = { authorization: 'Basic ' + Buffer.from(`${ENV.ADMIN_USER}:${ENV.ADMIN_PASSWORD}`).toString('base64') };

async function get(path) {
  const r = await fetch(BASE + path, { headers: AUTH });
  const text = await r.text();
  let body = null;
  try { body = JSON.parse(text); } catch { /* JSON emas */ }
  if (!r.ok) throw new Error(`GET ${path} → HTTP ${r.status} ${text.slice(0, 200)}`);
  return body;
}

const iso = (v) => (v ? new Date(v).toISOString().replace(/\.\d{3}Z$/, 'Z') : null);
const ok = (b) => (b ? '✓' : '✗');

/** Payload ichidagi matnlarni bir joyga yigadi (Unicode tekshiruvi uchun). */
function matnlar(student) {
  const out = [];
  for (const q of student.questions || []) {
    if (q.question) out.push(q.question);
    for (const o of q.options || []) out.push(o);
    if (q.correct_answer) out.push(q.correct_answer);
    for (const t of q.attempts || []) if (t.answer) out.push(t.answer);
  }
  for (const a of student.achievements || []) { if (a.name) out.push(a.name); if (a.title) out.push(a.title); }
  return out;
}

/** Axadulla tekshiradigan 5 maydon bo'yicha o'z-o'zini tekshiruv. */
function tekshir(student) {
  const qs = student.questions || [];
  const att = qs.flatMap((q) => q.attempts || []);
  const vaqtlar = new Set(att.map((t) => t.at).filter(Boolean));
  const yutuq = student.achievements || [];
  const yutuqVaqt = new Set(yutuq.map((a) => a.earned_at).filter(Boolean));
  const txt = matnlar(student).join('\n');
  const strelka = (txt.match(/→/g) || []).length;
  const savolBelgi = (txt.match(/\?/g) || []).length;
  return {
    savollar: qs.length,
    urinishlar: att.length,
    elapsed_nolmas: att.filter((t) => (t.elapsed_ms || 0) > 0).length,
    at_turlicha: vaqtlar.size,
    yutuqlar: yutuq.length,
    earned_at_turlicha: yutuqVaqt.size,
    solved_true: qs.filter((q) => q.solved === true).length,
    solved_false: qs.filter((q) => q.solved === false).length,
    strelka,
    savol_belgisi: savolBelgi,
    lang: student.lang || '-',
  };
}

function xulosa(t) {
  return [
    `  savollar ${t.savollar} · urinishlar ${t.urinishlar} · yutuqlar ${t.yutuqlar} · til ${t.lang}`,
    `  ${ok(t.elapsed_nolmas > 0)} elapsed_ms > 0: ${t.elapsed_nolmas}/${t.urinishlar} urinishda`,
    `  ${ok(t.at_turlicha > 1 || t.urinishlar <= 1)} urinish vaqtlari turlicha: ${t.at_turlicha} ta har xil "at"`,
    `  ${ok(t.earned_at_turlicha > 1 || t.yutuqlar <= 1)} earned_at turlicha: ${t.earned_at_turlicha} ta har xil vaqt`,
    `  ${ok(t.solved_false > 0 || t.savollar === 0)} solved: ${t.solved_true} true · ${t.solved_false} false`,
    `  ${ok(t.strelka > 0)} Unicode dalili: matnlarda "→" ${t.strelka} ta (savol belgisi "?" ${t.savol_belgisi} ta)`,
  ].join('\n');
}

const main = async () => {
  console.log(`sinov-natija → ${BASE}`);
  let sid = SESSION;
  let qatorlar = [];
  if (!sid) {
    qatorlar = await get('/admin/api/sessions?limit=50');
    let nomzod = qatorlar;
    if (PIN) nomzod = nomzod.filter((s) => String(s.pin) === String(PIN));
    if (GID) nomzod = nomzod.filter((s) => String(s.gid) === String(GID));
    const natijali = nomzod.filter((s) => s.result_status);
    const tanlov = (natijali[0] || nomzod.find((s) => s.status === 'ended') || nomzod[0]);
    if (!tanlov) { console.error('Mos sessiya topilmadi (--pin / --gid / --session bilan aniqlashtiring).'); process.exit(1); }
    sid = tanlov.id;
    console.log(`sessiya: ${tanlov.lesson_id} · pin ${tanlov.pin} · gid ${tanlov.gid ?? '-'} · mentor ${tanlov.teacher_id ?? '-'} · holat ${tanlov.status} (${tanlov.end_reason ?? '-'})`);
  }

  const detail = await get(`/admin/api/sessions/${sid}`);
  const pin = detail.session.pin;
  const oquvchilar = (detail.participants || []).filter((p) => p.role === 'student');
  console.log(`o'quvchilar: ${oquvchilar.map((p) => `${p.subject_id} (javob ${p.answers}, urinish ${p.attempts}, yutuq ${p.achievements})`).join(' · ') || '-'}`);

  if (!detail.results || !detail.results.length) {
    console.error("\nBu sessiyada natija-hodisa yo'q — mentor «Erkin qilish» qildimi? (natija tugagach qayta yurgizing)");
    process.exit(1);
  }

  mkdirSync(OUT, { recursive: true });
  const pref = `sinov-${pin}`;
  const yozildi = [];
  const yoz = (nom, obj) => { const p = join(OUT, nom); writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8'); yozildi.push(p); };
  yoz(`${pref}-sessiya.json`, { at: new Date().toISOString(), base: BASE, detail });

  const xabarBlok = [];
  for (const ev of detail.results) {
    const row = await get(`/admin/api/results/${encodeURIComponent(ev.event_id)}`);
    const verify = await get(`/admin/api/results/${encodeURIComponent(ev.event_id)}/verify`).catch((e) => ({ xato: String(e.message) }));
    yoz(`${pref}-schoolapi-${ev.event_id}.json`, row.payload);
    yoz(`${pref}-verify-${ev.event_id}.json`, verify);
    const idlar = (row.payload?.students || []).map((st) => st.student_id ?? '?');
    console.log(`\nhodisa ${ev.event_id} · ${row.status} · HTTP ${row.last_http_status ?? '-'} · yetkazildi ${iso(row.delivered_at) ?? '-'}`);
    console.log(`  payload (School API): ${iso(row.payload?.started_at)} → ${iso(row.payload?.finished_at)} · o'quvchi ${idlar.join(', ') || '-'}`);
    console.log(`  ${ok(verify?.remote?.found)} LMS tomonida topildi (verify)`);
    for (const st of row.payload?.students || []) {
      console.log(`  o'quvchi ${st.student_id}: javob ${st.answered ?? '-'} · to'g'ri ${st.correct_answers ?? '-'} · nishon ${st.badges_count ?? '-'} · o'rin ${st.rank ?? '-'}`);
    }
    xabarBlok.push({ event_id: ev.event_id, status: row.status, http: row.last_http_status, idlar, payload: row.payload, verify });
  }

  // onFinished (brauzer-qatlami) — Axadulla tekshiradigan 5 maydon shu yerda
  let onfinNom = null;
  let onfinTekshir = null;
  let onfinOgoh = [];
  if (ONFIN) {
    const det = JSON.parse(readFileSync(ONFIN, 'utf8'));
    onfinNom = `${pref}-onFinished.json`;
    yoz(onfinNom, det);
    const t = tekshir(det);
    onfinTekshir = t;
    console.log(`\nonFinished JSON (${ONFIN}) · dars ${det.lessonId ?? '-'}`);
    console.log(xulosa(t));
    const ogoh = onfinOgoh;
    if (!t.savollar) ogoh.push('questions bo\'sh — eski yig\'ma bilan o\'tkazilganmi? (T5: CRM\'da yangi nusxa turishi shart)');
    if (t.urinishlar && !t.elapsed_nolmas) ogoh.push('hamma elapsed_ms = 0 — F-0909-02 tuzatishi yig\'mada yo\'q');
    if (t.yutuqlar > 1 && t.earned_at_turlicha <= 1) ogoh.push('yutuqlarning earned_at vaqti bir xil — tarix saqlanmagan');
    if (t.savollar && !t.solved_false) ogoh.push('birorta solved:false yo\'q — xato javob berilmaganmi? (F-0909-03 dalili yo\'qoladi)');
    if (!t.strelka) ogoh.push('matnlarda "→" topilmadi — s15 savoliga javob berilmaganmi? (Unicode dalili yo\'qoladi)');
    for (const o of ogoh) console.log('  ⚠ ' + o);
    if (!ogoh.length) console.log('  hammasi joyida — Axadulla\'ga yuborsa bo\'ladi');
  } else {
    console.log('\n⚠ onFinished JSON berilmadi (--onfinished <fayl>). U brauzerdan olinadi:');
    console.log('   DevTools → Network (Preserve log yoqiq) → dars tugagach LMS frontining so\'rovi → Request payload → faylga saqlang.');
  }

  const xabar = [
    `# Sinov natijasi — Axadulla uchun (${new Date().toISOString().slice(0, 10)})`,
    '',
    "Assalomu alaykum. Yangi yig'ma bilan to'liq test darsi o'tkazildi. Quyidagilarni yuboryapmiz:",
    '',
    ...xabarBlok.flatMap((b) => [
      `**event_id:** \`${b.event_id}\` (bizda holat: ${b.status}, School API javobi HTTP ${b.http ?? '-'}${b.verify?.remote?.found ? ', GET bilan tasdiqlandi' : ''})`,
      `**o'quvchi ID:** ${b.idlar.join(', ')}`,
      `**dars:** ${b.payload?.lesson_id ?? '-'} · ${iso(b.payload?.started_at)} → ${iso(b.payload?.finished_at)}`,
      '',
    ]),
    onfinNom
      ? `**onFinished JSON:** ilova qilingan fayl \`${onfinNom}\` (o'quvchi brauzeridan olingan, o'zgartirilmagan).`
      : "**onFinished JSON:** ilova qilinadi (brauzerdan olinadi).",
    '',
    ...(onfinTekshir ? [
      `Ichida: ${onfinTekshir.savollar} savol · ${onfinTekshir.urinishlar} urinish · ${onfinTekshir.yutuqlar} yutuq · til \`${onfinTekshir.lang}\`.`,
      `\`elapsed_ms\` noldan katta: ${onfinTekshir.elapsed_nolmas}/${onfinTekshir.urinishlar} urinishda · har xil \`at\` vaqti: ${onfinTekshir.at_turlicha} ta ·`,
      `har xil \`earned_at\`: ${onfinTekshir.earned_at_turlicha} ta · \`solved\`: ${onfinTekshir.solved_true} true, ${onfinTekshir.solved_false} false ·`,
      `matnlarda \`→\` belgisi: ${onfinTekshir.strelka} ta.`,
      '',
      ...(onfinOgoh.length
        ? ['Eslatma (bizning tomondan ochiq qolgan joylar):', ...onfinOgoh.map((o) => `- ${o}`), '']
        : ["Saqlangan yozuvda shu qiymatlar va `→` belgisi o'zgarmasdan turganini tekshirib ko'rsangiz."]),
    ] : []),
    '',
    'Rahmat!',
  ].join('\n');
  const xp = join(OUT, `${pref}-xabar-axadulla.md`);
  writeFileSync(xp, xabar + '\n', 'utf8');
  yozildi.push(xp);

  console.log('\nyozildi:');
  for (const p of yozildi) console.log('  ' + p);
};

main().catch((e) => { console.error('XATO:', e.message); process.exit(1); });
