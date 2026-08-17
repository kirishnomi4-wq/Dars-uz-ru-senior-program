// PmLesson5 KODING konversiyasi (o'z harness → HtmlCompiler): mkKodTask manbadan kesib olinadi,
// halol/qisman/noto'g'ri/spoof yechimlar → chiplar; saqlov-migratsiya (eski kod → starter).
import { readFileSync } from 'node:fs';
import { open, chips } from './tc-lib.mjs';
const { b, p } = await open();
const src = readFileSync('C:/Users/ADMIN/internetLesson/src/2-Modull/PmLesson5.jsx', 'utf8');
const cut = (re) => { const m = re.exec(src); if (!m) throw new Error('kesim yo\'q ' + re); return m[0]; };
const STARTER = cut(/^const KODING_STARTER = `[\s\S]*?`;/m);
const CONDS = cut(/^const KODING_CONDS = \[[\s\S]*?\n\];/m);
const KODFILE = cut(/^const KOD_FILE = .*$/m);
const EVAL = cut(/^const KOD_EVAL_C3 = .*$/m);
let MK = cut(/^const mkKodTask = \(starter\) => \(\{[\s\S]*?\n\}\);/m).replace(/^\s*brief: \{[\s\S]*?\},\n/m, '');
const DEF = [STARTER, CONDS, KODFILE, EVAL, MK].join('\n');
const HONEST = `const nomlar = ["Seanslar va narxlar", "Ish vaqti va manzil", "Chipta band qilish tugmasi", "Chegirma kodi", "Bufet menyusi", "Tomoshabin sharhlari"];
const darajalar = ["v1", "v1", "v1", "backlog", "v2", "backlog"];
function ochilishRoyxati(nomlar, darajalar) {
  let natija = "";
  for (let i = 0; i < nomlar.length; i++) {
    if (darajalar[i] === "v1") { natija = natija + nomlar[i] + "\\n"; }
  }
  return natija;
}
console.log(ochilishRoyxati(nomlar, darajalar));`;
const mount = async (code, lang = 'uz') => {
  const r = await p.evaluate(({ DEF, code, lang }) => {
    const C = window.HC.checks; const React = window.React; let mkKodTask, KODING_STARTER, KOD_FILE;
    try { eval(DEF + '\nwindow.__pm5 = { mkKodTask, KODING_STARTER, KOD_FILE };'); } catch (e) { return { err: 'EVAL: ' + e.message }; }
    ({ mkKodTask, KODING_STARTER, KOD_FILE } = window.__pm5);
    localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = '';
    window.mountHC({ task: mkKodTask(code == null ? KODING_STARTER : code), lang, storageKey: 'pm-m2d7-code:code' });
    return { ok: true };
  }, { DEF, code, lang });
  if (r.err) throw new Error(r.err);
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1600);
  const c = await chips(p); return { str: c.map(x => (x.ok ? '✓' : '✗')).join(''), c };
};
let bad = 0; const T = (ok, l, i = '') => { if (!ok) bad++; console.log(`${ok ? '✓' : '✗ KUTILMAGAN'} [${l}] ${i}`); };
let r = await mount(null);
T(r.str === '✗✗✗' && r.c.length === 3, 'starter → 0/3', r.str + ' ' + JSON.stringify(r.c.map(x => x.label)));
r = await mount(HONEST); T(r.str === '✓✓✓', 'halol yechim → 3/3', r.str);
r = await mount(HONEST.replace('=== "v1"', "=== 'v1'")); T(r.str === '✓✓✓', "halol ('v1' bitta tirnoq) → 3/3", r.str);
r = await mount(HONEST.replace('if (darajalar[i] === "v1") { natija = natija + nomlar[i] + "\\n"; }', 'const d = darajalar[i]; if (d === "v1") { natija = natija + nomlar[i] + "\\n"; }'));
T(r.str === '✓✓✓', 'halol (darajalar[i] o\'zgaruvchiga olingan) → 3/3', r.str);
r = await mount(HONEST.replace('if (darajalar[i] === "v1") { natija = natija + nomlar[i] + "\\n"; }', 'natija = natija + nomlar[i] + "\\n";'));
T(r.str === '✗✗✗', 'shartsiz (hamma nom) → c1 ✗ c2 ✗ c3 ✗', r.str);
r = await mount(HONEST.replace('if (darajalar[i] === "v1")', 'if (darajalar[i] === "v2")'));
T(r.str === '✓✗✗', 'v2 tekshirsa → c1 ✓ c2 ✗ c3 ✗ (natija noto\'g\'ri)', r.str);
r = await mount(HONEST.replace('natija = natija + nomlar[i] + "\\n";', '')); T(r.str === '✓✓✗', 'shart bor, lekin natija bo\'sh → c3 ✗', r.str);
r = await mount(HONEST.replace('return natija;', 'return natija;\n}\nwindow.__logs=["Seanslar va narxlar Ish vaqti va manzil Chipta band qilish tugmasi"];\nfunction _x(){'));
T(r.str === '✓✓✓', 'K-C-11: __logs spoof c3\'ga TA\'SIR QILMAYDI (eval haqiqiy natijani o\'qiydi; kod o\'zi halol) → 3/3', r.str);
r = await mount('window.__logs=["Seanslar va narxlar","Ish vaqti va manzil","Chipta band qilish tugmasi"];\nfunction ochilishRoyxati(){return ""}\nconst nomlar=[],darajalar=[];');
T(r.str === '✗✗✗', 'K-C-11: faqat spoof, halol kod yo\'q → 0/3', r.str);
r = await mount(HONEST.replace('let natija = "";', 'let natija = "";\n  while(true){}'));
T(r.str.length === 3 && !/✓✓✓/.test(r.str), 'cheksiz sikl → chip yashil emas, stend tirik (K-P-01)', r.str);
// saqlov-migratsiya: task starter = eski kod (mkKodTask(code)) → muharrirda o'sha
r = await mount('// MENING ESKI KODIM\n' + HONEST); const ed = await p.$eval('.hc-root textarea.hc-code', e => e.value.slice(0, 20));
T(ed === '// MENING ESKI KODIM', 'eski `pm-m2d7-code`.code starter bo\'lib ochiladi', JSON.stringify(ed));
// storageKey (yangi format) ustun: saqlangan kod bo'lsa starter emas, o'sha
await p.evaluate(() => { localStorage.setItem('pm-m2d7-code:code', JSON.stringify({ codes: { 'ochilishRoyxati.js': '// YANGI SAQLOV' }, savedAt: 1 })); });
await p.evaluate(() => { const { mkKodTask } = window.__pm5; try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = ''; window.mountHC({ task: mkKodTask('// STARTER'), lang: 'uz', storageKey: 'pm-m2d7-code:code' }); });
await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(600);
const ed2 = await p.$eval('.hc-root textarea.hc-code', e => e.value);
T(ed2 === '// YANGI SAQLOV', 'yangi storageKey saqlovi starter\'dan ustun', JSON.stringify(ed2));
r = await mount(null, 'ru'); T(r.c.length === 3 && /Внутри цикла/.test(r.c[0].label), 'ru chip-label', JSON.stringify(r.c[0].label));
console.log(bad ? `XATO: ${bad}` : `HAMMASI KUTILGANDEK (${bad} xato)`);
await b.close();
