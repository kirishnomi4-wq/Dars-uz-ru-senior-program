// K-C-03: js() shartida satr ichidagi // yoki /* qatorni yeydi
import { open, chips } from './tc-lib.mjs';
const { b, p } = await open();
const cases = [
  ['URL " ichida + alert', `/alert\\(/`, `const u = "https://example.com/x"; alert(1);`, true],
  ['URL \' ichida + addEventListener', `/addEventListener/`, `const link = 'http://t.me/x'; btn.addEventListener('click', f);`, true],
  ['template ichida //', `/fetch\\(/`, 'const u = `https://api.x/${id}`; fetch(u);', true],
  ['"/*" satr ichida', `/alert\\(/`, `const s = "/*"; alert(1); const e = "*/";`, true],
  ['regex-literal ichida //', `/test\\(/`, `const re = /https:\\/\\/x/; re.test("a");`, true],
  ['haqiqiy // izoh o\'chadi', `/alert\\(/`, `// alert(1)\nconst a = 2;`, false],
  ['haqiqiy /* */ izoh o\'chadi', `/alert\\(/`, `/* alert(1) */ const a = 2;`, false],
  ['izohdan keyingi kod ko\'rinadi', `/alert\\(/`, `const a = 1; // izoh\nalert(1);`, true],
  ['satr ichida qochirilgan tirnoq', `/alert\\(/`, `const s = "a\\"b // c"; alert(1);`, true],
  ['satrdagi apostrof (o\'quvchi matni)', `/alert\\(/`, `console.log("O'quvchi // salom"); alert(1);`, true],
  ['bo\'linish: a / b / c', `/alert\\(/`, `const x = a / b / c; alert(1);`, true],
];
let bad = 0;
for (const [label, re, js, expect] of cases) {
  await p.evaluate(({ re, js }) => { const C = window.HC.checks; localStorage.clear(); window.mountHC({ lang: 'uz', task: { title: 't', files: [{ name: 'script.js', lang: 'js', starter: js }], requirements: [{ id: 'a', label: 'a', check: C.js(eval(re), 'h') }] } }); }, { re, js });
  await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(500);
  const ok = (await chips(p))[0].ok;
  if (ok !== expect) bad++;
  console.log(`${ok === expect ? '✓' : '✗ KUTILMAGAN'} [${label}] chip=${ok ? 'yashil' : 'qizil'} (kutilgan ${expect ? 'yashil' : 'qizil'})`);
}
console.log(bad ? `XATO: ${bad}` : 'HAMMASI KUTILGANDEK');
await b.close();
