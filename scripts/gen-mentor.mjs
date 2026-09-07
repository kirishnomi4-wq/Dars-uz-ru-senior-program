// gen-mentor — mentor-sayt uchun dars ma'lumotini IKKI demodan yig'adi.
// Qo'lda ko'chirish YO'Q: lazy-importlar va modul bloklari manba fayllardan olinadi,
// faqat modul raqami/sarlavhasi yangi o'quv rejaga moslanadi (1-Modul = Foundation, biznikimas).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const m1 = readFileSync('src/m1-demo/M1DemoApp.jsx', 'utf8');
const fb = readFileSync('src/fb-demo/FbDemoApp.jsx', 'utf8');

const imports = (s) => (s.match(/^const \w+ = lazy\(\(\) => import\('[^']+'\)\)$/gm) || []);
const modulesBody = (s) => {
  const i = s.indexOf('const MODULES = [');
  const j = s.indexOf('\n]\n', i);
  if (i === -1 || j === -1) throw new Error('MODULES topilmadi');
  return s.slice(i + 'const MODULES = ['.length, j);
};

// ── importlar (takrorsiz, yo'l chuqurligi bir xil: src/<papka>/ → ../<Modul>/) ──
const seen = new Set();
const allImports = [...imports(m1), ...imports(fb)].filter((l) => {
  const name = /^const (\w+)/.exec(l)[1];
  if (seen.has(name)) return false;
  seen.add(name);
  return true;
});

// ── modul bloklari ──
let a = modulesBody(m1);
let b = modulesBody(fb);

// Yangi raqamlash. TARTIB MUHIM: avval m2→m3, keyin m1→m2 (aks holda to'qnashadi).
const META = {
  m3: {
    label: "{ uz: '3-Modul', ru: '3-Модуль' }",
    heading: "{ uz: '3-Modul — JavaScript', ru: '3-Модуль — JavaScript' }",
    lead: "{ uz: \"Algoritmdan interaktiv loyihagacha: o'zgaruvchi, shart, sikl, funksiya.\", ru: 'От алгоритма до интерактивного проекта: переменная, условие, цикл, функция.' }",
  },
  m2: {
    label: "{ uz: '2-Modul', ru: '2-Модуль' }",
    heading: "{ uz: '2-Modul — HTML va CSS', ru: '2-Модуль — HTML и CSS' }",
    lead: "{ uz: 'Internetdan tirik saytgacha: HTML, CSS, VS Code, Git va deploy.', ru: 'От интернета до живого сайта: HTML, CSS, VS Code, Git и деплой.' }",
  },
};

const retitle = (text, oldId, newId) => {
  const start = text.indexOf(`id: '${oldId}',`);
  if (start === -1) throw new Error(`id ${oldId} topilmadi`);
  const lessonsAt = text.indexOf('lessons: [', start);
  const head = text.slice(start, lessonsAt);
  const m = META[newId];
  const newHead = `id: '${newId}',\n    label: ${m.label},\n    heading: ${m.heading},\n    lead: ${m.lead},\n    `;
  return text.slice(0, start) + newHead + text.slice(lessonsAt);
};

// ── Har darsga lessonId ── mentor-sayt uni «o'zim ochaman» rejimini urug'lash uchun
// ishlatadi (localStorage: liveSession:<lessonId>). Qo'lda yozilmaydi — dars faylidan olinadi.
const idOfComp = {};
for (const line of allImports) {
  const [, name, rel] = /^const (\w+) = lazy\(\(\) => import\('([^']+)'\)\)$/.exec(line);
  const file = 'src/' + rel.replace(/^\.\.\//, '');
  try {
    const m = /lessonId:\s*'([^']+)'/.exec(readFileSync(file, 'utf8'));
    if (m) idOfComp[name] = m[1];
  } catch { /* fayl yo'q — pastda hisobotda ko'rinadi */ }
}
const withIds = (t) => t.replace(/comp: (\w+) \}/g, (whole, name) =>
  idOfComp[name] ? `comp: ${name}, lessonId: '${idOfComp[name]}' }` : whole);

a = retitle(a, 'm2', 'm3');
a = retitle(a, 'm1', 'm2');
b = b.replace("id: 'fe',", "id: 'm4',").replace("id: 'be',", "id: 'm5',").replace("id: 'nest',", "id: 'm6',");
// FB'da ruscha yorliq «4-Модуль» shaklida — o'zgartirmaymiz, raqamlar allaqachon to'g'ri.

const aa = withIds(a), bb = withIds(b);
const missing = allImports.length - Object.keys(idOfComp).length;

const out = `// ============================================================
//  AVTO-YIG'ILGAN FAYL — QO'LDA TAHRIRLAMANG.
//  Manba:  src/m1-demo/M1DemoApp.jsx  +  src/fb-demo/FbDemoApp.jsx
//  Qayta yig'ish:  npm run gen:mentor
//
//  O'quv rejasi raqamlashi: 1-Modul = Foundation (bizniki emas), shuning uchun
//  darslarimiz 2-Moduldan boshlanadi:
//    2 HTML/CSS · 3 JavaScript · 4 React · 5 Express+PostgreSQL · 6 NestJS+Test+CI/CD
// ============================================================
import { lazy } from 'react'

${allImports.join('\n')}

export const MODULES = [${aa}${bb}]

export const ALL_LESSONS = MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })))
`;

mkdirSync('src/mentor', { recursive: true });
writeFileSync('src/mentor/lessons.jsx', out, 'utf8');

const nMod = (out.match(/^ {4}id: 'm\d',$/gm) || []).length;
const nLes = (out.match(/key: '/g) || []).length;
const nComp = (out.match(/comp: /g) || []).length;
const nId = (out.match(/lessonId: '/g) || []).length;
console.log(`src/mentor/lessons.jsx yozildi — ${nMod} modul · ${nLes} dars qatori · ${nComp} tasida komponent · ${nId} tasida lessonId${missing ? ` · ${missing} faylda lessonId topilmadi` : ''}`);
