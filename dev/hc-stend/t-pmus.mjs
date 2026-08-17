// PmUserStoryLesson KODING konversiyasi (o'z harness window.__logs → HtmlCompiler): c3 = harness closure `logs` ustida eval.
import { readFileSync } from 'node:fs';
import { open, chips } from './tc-lib.mjs';
const { b, p } = await open();
const src = readFileSync('C:/Users/ADMIN/internetLesson/src/pm/PmUserStoryLesson.jsx', 'utf8').replace(/\r\n/g, '\n');
const cut = (re) => { const m = re.exec(src); if (!m) throw new Error('kesim yo\'q ' + re); return m[0]; };
const DEF = [
  cut(/^const KODING_STARTER = `[\s\S]*?`;/m), cut(/^const KODING_CONDS = \[[\s\S]*?\n\];/m),
  cut(/^const KOD_FILE = .*$/m), cut(/^const KOD_PROBE = .*$/m), cut(/^const KOD_EVAL_C1 = .*$/m), cut(/^const KOD_EVAL_C2 = .*$/m), cut(/^const KOD_EVAL_C3 = .*$/m),
  cut(/^const mkKodTask = \(starter\) => \(\{[\s\S]*?\n\}\);/m).replace(/^\s*brief: <>[\s\S]*?<\/>,\n/m, ''),
].join('\n');
const HONEST = "function hikoyaYasa(kim, nima, natija) {\n  return `Men ${kim} sifatida, ${nima}ni xohlayman, ${natija} uchun.`;\n}\nconsole.log(hikoyaYasa('yangi mehmon', 'loyihalarni bitta ekranda korish', 'meni tez tanib olishlari'));\nconsole.log(hikoyaYasa('o\\'qituvchi', 'baholarni tez kiritish', 'vaqt tejash'));\nconsole.log(hikoyaYasa('ota-ona', 'davomatni korish', 'xotirjam bolish'));";
const mount = async (code) => {
  const r = await p.evaluate(({ DEF, code }) => {
    const C = window.HC.checks; const React = window.React;
    try { eval(DEF + '\nwindow.__pmus = { mkKodTask, KODING_STARTER };'); } catch (e) { return { err: 'EVAL: ' + e.message }; }
    const { mkKodTask, KODING_STARTER } = window.__pmus;
    localStorage.clear(); try { window.unmountHC(); } catch {} document.getElementById('root').innerHTML = '';
    window.mountHC({ task: mkKodTask(code == null ? KODING_STARTER : code), lang: 'uz', storageKey: 'pm-m3d2-koding:code' });
    return { ok: true };
  }, { DEF, code });
  if (r.err) throw new Error(r.err);
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1600);
  const c = await chips(p); return { str: c.map(x => (x.ok ? '✓' : '✗')).join(''), c };
};
let bad = 0; const T = (ok, l, i = '') => { if (!ok) bad++; console.log(`${ok ? '✓' : '✗ KUTILMAGAN'} [${l}] ${i}`); };
let r = await mount(null); T(r.str === '✗✗✗' && r.c.length === 3, 'starter (return "") → 0/3', r.str);
r = await mount(HONEST); T(r.str === '✓✓✓', 'halol 3 hikoya → 3/3', r.str);
r = await mount(HONEST.replace('sifatida', 'bolib')); T(r.str === '✓✗✗', 'qolip buzuq (sifatida yo\'q) → c2 ✗, c3 ✗', r.str);
r = await mount(HONEST.split('\n').slice(0, 5).join('\n')); T(r.str === '✓✓✗', 'faqat 2 hikoya → c3 ✗', r.str);
r = await mount(HONEST.replace(/console\.log\(/g, 'window.__logs=(window.__logs||[]);window.__logs.push('));
T(r.str === '✓✓✗', 'K-C-11: __logs spoof (console.log o\'rniga) → c3 ✗', r.str);
r = await mount(HONEST.replace('return `Men', 'return "";\n  return `Men')); T(r.str === '✗✗✗', 'bo\'sh return → 0/3', r.str);
r = await mount('function hikoyaYasa(){ return "Men x sifatida, y ni xohlayman, z uchun." }\nfor (let i = 0; i < 3; i++) console.log(hikoyaYasa());');
T(r.str === '✓✓✓', 'sikl bilan 3 marta log → 3/3 (runtime logs, statik emas)', r.str);
r = await mount('function hikoyaYasa(){ return "Men x sifatida, y ni xohlayman, z uchun." }\nString.prototype.indexOf=function(){return 0};\nconsole.log(1);console.log(2);console.log(3);');
T(r.str !== '✓✓✓', 'prototip-zahar (indexOf→0) bilan 3/3 OLINMAYDI', r.str);
console.log(bad ? `XATO: ${bad}` : `HAMMASI KUTILGANDEK (${bad} xato)`);
await b.close();
