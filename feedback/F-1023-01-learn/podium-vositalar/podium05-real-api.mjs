// podium05-real-api (28.10, F-1023-01 PODIUM-05) — HAQIQIY Dars API'da (HTTP) arena yopilishi kafolatini tekshiradi:
// mentor sessiya ochadi → 3 o'quvchi → arena 2 savol → done → KECHIKKAN javoblar (o'zi, boshqalar, yangi savol, record_attempt)
// → jadval o'zgarmasligi kerak. Yangi qoida (0010) bo'lmagan serverda kechikkan javob QABUL QILINADI (= Abdulloh topgan nuqson).
//   node podium05-real-api.mjs --url https://staging-dars-api.coddycamp.uz --env-file server/.env.deploy.staging [--lesson internet-01-v18]
// Mentor kodi env-fayldan (LIVE_MENTOR_CODE) o'qiladi, hech qayerga chiqarilmaydi. Sessiya oxirida end_session bilan yopiladi.
import { readFileSync } from 'node:fs';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const URL_ = (arg('--url') || '').replace(/\/+$/, '');
const ENV = arg('--env-file');
const LESSON = arg('--lesson', 'internet-01-v18');
if (!URL_ || !ENV) { console.error('kerak: --url <api> --env-file <.env>'); process.exit(2); }
const CODE = (readFileSync(ENV, 'utf8').match(/^LIVE_MENTOR_CODE=(.*)$/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
if (!CODE) { console.error('env-faylda LIVE_MENTOR_CODE yo\'q'); process.exit(2); }

const API = `${URL_}/api/v1/live`;
const rpc = async (fn, body) => {
  const r = await fetch(`${API}/rpc/${fn}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${fn}: ${r.status} ${(await r.text()).slice(0, 200)}`);
  if (r.status === 204) return null;
  const t = await r.text(); return t ? JSON.parse(t) : null;
};
const get = async (p) => { const r = await fetch(`${URL_}${p}`); if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const res = []; let bad = 0;
const chk = (nom, ok, info = '') => { res.push(`${ok ? '✓' : '✗'} ${nom}${info ? ' — ' + info : ''}`); if (!ok) bad++; };
const jadval = async (pin) => (await get(`/api/v1/live/answers/${pin}?range=arena`)).map((r) => [r.player_id, r.screen_idx, r.picked].join(':')).sort().join(' ');

const health = await get('/api/v1/health').catch((e) => ({ xato: String(e) }));
console.log('health:', JSON.stringify({ ok: health.ok ?? health.status, migrations: health.checks?.migrations, version: health.version || health.git || health.commit }).slice(0, 300));

const [s] = await rpc('create_session', { p_lesson_id: LESSON, p_mentor_code: CODE });
const ctrl = (state, q = -1) => rpc('quiz_control', { p_pin: s.pin, p_token: s.token, p_state: state, p_q: q });
const submit = (p, screen, qid, picked) => rpc('submit_answer', { p_pin: s.pin, p_player_id: p.player_id, p_token: p.token, p_screen: screen, p_question_id: qid, p_picked: picked, p_correct: false, p_elapsed_ms: 900 });
const attempt = (p, screen, qid, picked) => rpc('record_attempt', { p_pin: s.pin, p_player_id: p.player_id, p_token: p.token, p_screen: screen, p_question_id: qid, p_picked: picked, p_elapsed_ms: 900, p_texts: { question: 'sinov', picked: 'sinov' } });
try {
  const ps = [];
  for (const n of ['Sinov-Ali', 'Sinov-Vali', 'Sinov-Gani']) ps.push((await rpc('join_session', { p_pin: s.pin, p_nickname: n }))[0]);
  const [ali, vali, gani] = ps;
  console.log(`sessiya PIN ${s.pin}, o'yinchilar 3`);

  await ctrl('lobby'); await ctrl('q', 0);
  chk('done gacha: Ali quiz-0 yoziladi', (await submit(ali, 100, 'quiz-0', 2)) === true);
  chk('done gacha: Vali quiz-0 yoziladi', (await submit(vali, 100, 'quiz-0', 1)) === true);
  await ctrl('r', 0); await ctrl('q', 1);
  chk('done gacha: Ali quiz-1 yoziladi', (await submit(ali, 101, 'quiz-1', 1)) === true);
  await ctrl('r', 1);
  await ctrl('done', 1);
  const oldin = await jadval(s.pin);
  chk('done paytida jadvalda 3 javob', oldin.split(' ').length === 3, oldin);

  await sleep(300);
  const r1 = await submit(gani, 100, 'quiz-0', 2);
  const r2 = await submit(vali, 101, 'quiz-1', 1);
  const r3 = await submit(ali, 102, 'quiz-2', 0);
  const r4 = await attempt(gani, 101, 'quiz-1', 1);
  chk('done dan KEYIN: Gani kechikkan quiz-0 → rad (false)', r1 === false, `keldi ${r1}`);
  chk('done dan KEYIN: Vali kechikkan quiz-1 → rad (false)', r2 === false, `keldi ${r2}`);
  chk('done dan KEYIN: Ali yangi savol quiz-2 → rad (false)', r3 === false, `keldi ${r3}`);
  chk('done dan KEYIN: record_attempt → 0', r4 === 0, `keldi ${r4}`);
  const keyin = await jadval(s.pin);
  chk('done dan keyin jadval O\'ZGARMAGAN', keyin === oldin, keyin === oldin ? '' : `oldin [${oldin}] keyin [${keyin}]`);

  await ctrl('lobby'); await ctrl('q', 2);
  const r5 = await submit(gani, 102, 'quiz-2', 0);
  chk('arena qayta ochilsa ham (lobby→q) → rad', r5 === false, `keldi ${r5}`);
  await ctrl('done', 2);
  chk('qayta done dan keyin ham jadval o\'sha', (await jadval(s.pin)) === oldin);

  const d = await submit(ali, 4, 's4', 1);
  chk('dars ekrani savoli (screen 4) done dan keyin ham yoziladi', d === true, `keldi ${d}`);
} finally {
  await rpc('end_session', { p_pin: s.pin, p_token: s.token }).catch(() => {});
}
console.log(res.join('\n'));
console.log(bad ? `\n${bad} tekshiruv YIQILDI — serverda arena yopilishi qoidasi (0010) yo'q yoki ishlamayapti` : '\nHammasi o\'tdi — done dan keyin arena jadvali o\'zgarmaydi');
process.exit(bad ? 1 : 0);
