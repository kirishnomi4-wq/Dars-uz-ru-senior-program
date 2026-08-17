// PmLesson6 KODING konversiyasi (o'z harness window.__out/chiqar → HtmlCompiler): mkKodTask manbadan kesib olinadi.
import { readFileSync } from 'node:fs';
import { open, chips } from './tc-lib.mjs';
const { b, p } = await open();
const src = readFileSync('C:/Users/ADMIN/internetLesson/src/2-Modull/PmLesson6.jsx', 'utf8').replace(/\r\n/g, '\n');
const cut = (re) => { const m = re.exec(src); if (!m) throw new Error('kesim yo\'q ' + re); return m[0]; };
const DEF = [
  cut(/^const JARGON = \{[\s\S]*?\n\};/m), cut(/^const JARGON_WORDS = .*$/m), cut(/^const wholeWordAt = [\s\S]*?\n\};/m), cut(/^const findJargon = [\s\S]*?\n\};/m),
  cut(/^const KOD_HELPER = `[\s\S]*?`;/m), cut(/^const ensureHelper = .*$/m), cut(/^const KOD_STARTER = KOD_HELPER \+ `[\s\S]*?`;/m),
  cut(/^const KOD_CONDS = \[[\s\S]*?\n\];/m), cut(/^const KOD_FILE = .*$/m), cut(/^const KOD_EVAL_C1 = .*$/m), cut(/^const KOD_EVAL_C2 = .*$/m), cut(/^const KOD_EVAL_C3 = .*$/m),
  cut(/^const kodJargon = [\s\S]*?\n\};/m), cut(/^const mkKodTask = \(starter\) => \(\{[\s\S]*?\n\}\);/m).replace(/^\s*brief: \{[\s\S]*?\},\n/m, ''),
].join('\n');
const HONEST = `const chiqarilgan = [];
function chiqar(v) { chiqarilgan.push(String(v)); console.log(v); }
const sistema = { korinish: "Mijoz menyuni va narxlarni ko'radi", ishlash: "Buyurtmani qabul qilib, hisobni chiqaradi", malumot: "Narxlar va buyurtmalarni eslab qoladi" };
const qatlamlar = ["korinish", "ishlash", "malumot"];
const nomlar = { korinish: "Ko'rinadigan qism", ishlash: "Ishni bajaradigan qism", malumot: "Ma'lumot saqlanadigan joy" };
function oddiyGap(qatlam) { return nomlar[qatlam] + ": " + sistema[qatlam]; }
for (let i = 0; i < qatlamlar.length; i++) { chiqar(oddiyGap(qatlamlar[i])); }`;
const mount = async (code, lang = 'uz') => {
  const r = await p.evaluate(({ DEF, code, lang }) => {
    const C = window.HC.checks; const React = window.React; const tr = (o) => (o && (o.uz || o.ru)) || o;
    try { eval(DEF + '\nwindow.__pm6 = { mkKodTask, KOD_STARTER, ensureHelper };'); } catch (e) { return { err: 'EVAL: ' + e.message }; }
    const { mkKodTask, KOD_STARTER, ensureHelper } = window.__pm6;
    localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = '';
    window.mountHC({ task: mkKodTask(code == null ? KOD_STARTER : ensureHelper(code)), lang, storageKey: 'pm-m2d13-code:code' });
    return { ok: true };
  }, { DEF, code, lang });
  if (r.err) throw new Error(r.err);
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1600);
  const c = await chips(p); return { str: c.map(x => (x.ok ? '✓' : '✗')).join(''), c, ed: await p.$eval('.hc-root textarea.hc-code', e => e.value) };
};
let bad = 0; const T = (ok, l, i = '') => { if (!ok) bad++; console.log(`${ok ? '✓' : '✗ KUTILMAGAN'} [${l}] ${i}`); };
let r = await mount(null);
T(r.str === '✗✗✗✓' && r.c.length === 4 && /function chiqar/.test(r.ed), 'starter → c1-3 ✗, c4 (jargon yo\'q) ✓; chiqar-yordamchi starterda', r.str);
r = await mount(HONEST); T(r.str === '✓✓✓✓', 'halol → 4/4', r.str);
r = await mount(HONEST.replace('malumot: "Narxlar va buyurtmalarni eslab qoladi"', 'malumot: "yo\'q"')); T(r.str === '✗✓✓✓', 'bir maydon qisqa (<6) → c1 ✗', r.str);
r = await mount(HONEST.replace('+ sistema[qatlam]', '+ ""')); T(r.str === '✓✗✓✓', 'oddiyGap sistema\'siz → c2 ✗', r.str);
r = await mount(HONEST.replace('chiqar(oddiyGap(qatlamlar[i]));', 'if (i < 2) chiqar(oddiyGap(qatlamlar[i]));')); T(r.str === '✓✓✗✓', '2 marta chiqar → c3 ✗', r.str);
r = await mount(HONEST.replace('Buyurtmani qabul qilib', 'Server buyurtmani qabul qilib'));
T(r.str === '✓✓✓✗' && /«Server»/.test(r.c[3].hint), 'jargon «Server» → c4 ✗, hint\'da so\'z', r.str + ' hint=' + JSON.stringify(r.c[3].hint));
r = await mount(HONEST.replace('Buyurtmani qabul qilib', 'Buyurtmani qabul qilib, ma\'lumotlar bazasiga yozadi'));
T(r.str === '✓✓✓✗' && /bazasi/.test(r.c[3].hint), "jargon «ma'lumotlar bazasi» (apostrofli, qo'shtirnoq ichida) → c4 ✗", r.str + ' hint=' + JSON.stringify(r.c[3].hint));
r = await mount(HONEST + '\n// izohda server so\'zi — jargon EMAS'); T(r.str === '✓✓✓✓', 'izohdagi «server» sanalmaydi (faqat literallar)', r.str);
r = await mount(HONEST.replace('const chiqarilgan = [];\nfunction chiqar(v) { chiqarilgan.push(String(v)); console.log(v); }\n', ''));
T(r.str === '✓✓✓✓' && /function chiqar/.test(r.ed), 'ESKI saqlangan kod (chiqar yordamchisiz) → yordamchi avtomatik qo\'shildi, 4/4', r.str);
r = await mount('window.__out=["a","b","c"];\nconst chiqarilgan=[];function chiqar(v){}\nconst sistema={};function oddiyGap(){}');
T(r.str === '✗✗✗✓', 'eski `window.__out` spoof → c3 ✗ (chiqarilgan bo\'sh)', r.str);
r = await mount(null, 'ru'); T(/Три слоя/.test(r.c[0].label) && /Без профессиональных/.test(r.c[3].label), 'ru labellar', r.c.map(x => x.label).join(' | '));
console.log(bad ? `XATO: ${bad}` : `HAMMASI KUTILGANDEK (${bad} xato)`);
await b.close();
