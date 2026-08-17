// K-C-11 kengaytirilgan smoke: HAQIQIY dars-tasklari (TASK_* obyektlari manbadan kesib olinadi)
// yangi closure-harness bilan — halol yechim → hamma chip yashil; spoof → logs-chip qizil.
import { readFileSync } from 'node:fs';
import { open, chips } from './tc-lib.mjs';
const { b, p } = await open();
const LESSONS = {
  JsVarsLesson: 'src/2-Modull/JsVarsLesson.jsx', JsLoopsLesson: 'src/2-Modull/JsLoopsLesson.jsx',
  JsConditionsLesson: 'src/2-Modull/JsConditionsLesson.jsx', JsFunctionsLesson: 'src/2-Modull/JsFunctionsLesson.jsx',
  PeanStackLesson: 'src/2-Modull/PeanStackLesson.jsx', PracticeLesson1: 'src/2-Modull/PracticeLesson1.jsx',
  // K-C-04: CSS darslari (cssProp/cssValue)
  CssLesson1: 'src/1-Modull/CssLesson1.jsx', CssLesson2: 'src/1-Modull/CssLesson2.jsx', CssPractice: 'src/1-Modull/CssPractice.jsx',
};
// halol yechimlar (fayl-nomi → kod)
const SOL = {
  'JsVarsLesson/TASK_BALL': { 'script.js': `let ball = 0;\nball = 25;\nconsole.log(ball);` },
  'JsVarsLesson/TASK_QUOTES': { 'script.js': `console.log(5 + 5);\nconsole.log("5" + "5");` },
  'JsVarsLesson/TASK_QUTILAR': { 'script.js': `let ism = "Aziz";\nlet yosh = 14;\nconst tugilgan_yil = 2012;\nconsole.log(ism, yosh, tugilgan_yil);` },
  'JsLoopsLesson/TASK_SANOQ': { 'script.js': `for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}` },
  'JsLoopsLesson/TASK_MEVA': { 'script.js': `let mevalar = ["olma", "banan", "uzum"];\nfor (let i = 0; i < mevalar.length; i++) {\n  console.log(mevalar[i]);\n}` },
  'JsConditionsLesson/TASK_IF': { 'script.js': `let ball = 90;\nif (ball >= 80) {\n  console.log("Ajoyib");\n}` },
  'JsConditionsLesson/TASK_ELSE': { 'script.js': `let son = 3;\nif (son > 5) {\n  console.log("Katta");\n} else {\n  console.log("Kichik");\n}` },
  'JsConditionsLesson/TASK_ELSEIF': { 'script.js': `let ball = 40;\nif (ball >= 80) {\n  console.log("Ajoyib");\n} else if (ball >= 60) {\n  console.log("Yaxshi");\n} else {\n  console.log("Mashq");\n}` },
  'JsFunctionsLesson/TASK_SALOM': { 'script.js': `function salom() {\n  console.log("Salom");\n}\nsalom();` },
  'JsFunctionsLesson/TASK_KVADRAT': { 'script.js': `function zarar(x) {\n  return x * 3;\n}\nconsole.log(zarar(5));` },
  'JsFunctionsLesson/TASK_QAYTA': { 'script.js': `function salomla(ism) {\n  console.log("Salom, " + ism);\n}\nsalomla("Aziza");\nsalomla("Bobur");` },
  'PeanStackLesson/TASK_HISOB': { 'script.js': `function narx(soni) {\n  return soni * 25000;\n}\nconsole.log(narx(3));` },
  'PeanStackLesson/TASK_BAZA': { 'script.js': `let mahsulotlar = ["Lavash", "Burger", "Shashlik"];\nfor (let i = 0; i < mahsulotlar.length; i++) {\n  console.log(mahsulotlar[i]);\n}` },
  'PracticeLesson1/TASK_LIKE': { 'index.html': `<button id="like">❤ Like</button>\n<p id="son">0</p>`, 'script.js': `let son = 0;\ndocument.querySelector('#like').addEventListener('click', function(){ son = son + 1; document.querySelector('#son').textContent = son; });` },
  'PracticeLesson1/TASK_TOGGLE': { 'index.html': `<button id="rejim">Kunduz</button>`, 'script.js': `document.querySelector('#rejim').addEventListener('click', function(){ var b = document.querySelector('#rejim'); b.textContent = b.textContent === 'Kunduz' ? 'Tun' : 'Kunduz'; });` },
  'PracticeLesson1/TASK_FORM': { 'index.html': `<input id="ism"><button id="yubor">Yubor</button><p id="xabar"></p>`, 'script.js': `document.querySelector('#yubor').addEventListener('click', function(){ var v = document.querySelector('#ism').value; if (v === '') { document.querySelector('#xabar').textContent = 'Ism kiriting'; } else { document.querySelector('#xabar').textContent = 'Salom, ' + v; } });` },
  'CssLesson1/TASK_COLOR': { 'style.css': `h1 { color: red; background-color: #FFE066; }` },
  'CssLesson1/TASK_TEXT': { 'style.css': `h1 { font-size: 40px; text-align: center; }` },
  'CssLesson1/TASK_BOX': { 'style.css': `.box { padding: 20px; margin: 20px; }` },
  'CssLesson2/TASK_FLEX': { 'style.css': `.row { display: flex; gap: 12px; }` },
  'CssLesson2/TASK_CENTER': { 'style.css': `.box { display: flex; justify-content: center; align-items: center; }` },
  'CssLesson2/TASK_COLUMN': { 'style.css': `.menu { display: flex; flex-direction: column; }` },
  'CssPractice/TASK_HEADER': { 'style.css': `h1 { color: #FF4F28; text-align: center; }` },
  'CssPractice/TASK_MENU': { 'style.css': `nav { display: flex; gap: 14px; }` },
  'CssPractice/TASK_BUTTON': { 'style.css': `.btn { background-color: #FF4F28; padding: 10px 20px; }` },
};
const rows = [];
for (const [lesson, file] of Object.entries(LESSONS)) {
  const src = readFileSync(file, 'utf8');
  const re = /^const (TASK_[A-Z_0-9]+) = \{[\s\S]*?\n\};/gm; let m;
  while ((m = re.exec(src))) {
    const name = m[1], key = `${lesson}/${name}`, sol = SOL[key];
    const taskSrc = m[0].replace(/^const TASK_[A-Z_0-9]+ = /, '(').replace(/;s*$/, '') + ')';
    if (!sol) { rows.push([key, 'YECHIM YO\'Q — o\'tkazildi', '', '']); continue; }
    async function mountWith(files) {
      const r = await p.evaluate(({ taskSrc, files }) => {
        const C = window.HC.checks; const tr = (o) => (o && o.uz) || o; let task;
        try { task = eval(taskSrc); } catch (e) { return { err: 'EVAL: ' + e.message }; }
        task.files = task.files.map(f => ({ ...f, starter: files[f.name] != null ? files[f.name] : f.starter }));
        localStorage.clear(); window.mountHC({ task, lang: 'uz' }); return { ok: true, n: task.requirements.length };
      }, { taskSrc, files });
      if (r.err) return r;
      await p.waitForSelector('.hc-root textarea.hc-code'); await p.waitForTimeout(1600);
      return { chips: await chips(p) };
    }
    const honest = await mountWith(sol);
    if (honest.err) { rows.push([key, honest.err, '', '']); continue; }
    const hStr = honest.chips.map(c => (c.ok ? '✓' : '✗')).join(''); if (hStr.includes('✗')) console.log('  !! halol qizil:', JSON.stringify(honest.chips));
    // spoof: logs-taskda console.log O'RNIGA __logs yozish; DOM-taskda hisobotni forge qilish
    const hasLogs = /C\.logs\(/.test(taskSrc);
    let sStr = '—';
    if (hasLogs) {
      const spoofJs = sol['script.js'].replace(/console\.log\(([^;]*)\);?/g, (_, a) => `try{(window.__logs=window.__logs||[]).push(String(${a}));}catch(e){}`) + `\ntry{window.__logs=window.__logs||[];}catch(e){}`;
      const spoof = await mountWith({ ...sol, 'script.js': spoofJs });
      sStr = spoof.chips.map(c => (c.ok ? '✓' : '✗')).join('');
    }
    rows.push([key, hStr, honest.chips.length, sStr]);
    console.log(key, 'halol', hStr, '| spoof', sStr);
  }
}
console.log('\n| Task | Halol chiplar | Spoof (__logs) chiplar |\n|---|---|---|');
for (const r of rows) console.log(`| ${r[0]} | ${r[1]} | ${r[3]} |`);
await b.close();
