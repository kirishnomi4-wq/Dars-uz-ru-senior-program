import { chromium } from 'playwright-core';
const PORT = Number(process.env.PORT) || 5173;
const LESSONS = [
  ['m1-04','html-02-v16','Htmllesson2'],
  ['m1-06','css-01-v17','CssLesson1'],
  ['m1-07','css-02-v18','CssLesson2'],
  ['m1-08','html-practice-portfolio-v2','HtmlPractice'],
  ['m1-10','css-practice-portfolio-v3','CssPractice'],
  ['m1-14','html-takrorlash-01-05-v2','HtmlTakrorlash'],
  ['m1-15','vscode-start-01-v1','VsCodeLesson'],
  ['m2-08','practice-01-jonlantirish-v18','PracticeLesson1'],
];
const b = await chromium.launch({ channel: 'chrome', headless: true });
const rows = [];
for (const [key, lid, name] of LESSONS) {
  const pg = await b.newPage();
  let verdict = '';
  try {
    await pg.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await pg.evaluate((lid) => { localStorage.clear(); localStorage.setItem('liveSession:'+lid, JSON.stringify({mode:'self'})); }, lid);
    await pg.goto(`http://localhost:${PORT}/#/lesson/${key}`, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(1200);
    // ekran sonini aniqlab, oxirgi ekranga sakraymiz
    const total = await pg.evaluate(() => { const m = [...document.body.innerText.matchAll(/(\d+)\s*\/\s*(\d+)/g)].map(x=>+x[2]).filter(n=>n>6); return m.length?Math.max(...m):0; });
    if (!total) { rows.push([name,'?','ekran soni topilmadi']); await pg.close(); continue; }
    await pg.evaluate(([lid,t]) => localStorage.setItem('ccProgress:'+lid, JSON.stringify({screen:t-1,answers:{},earned:[],startedAt:Date.now(),total:t,savedAt:Date.now()})), [lid,total]);
    await pg.reload({ waitUntil: 'networkidle' }); await pg.waitForTimeout(1400);
    const hw = pg.locator('button:visible').filter({hasText:/Uyga vazifa|Домашнее/i}).first();
    if (!(await hw.count())) { rows.push([name, total, "uyga-vazifa tugmasi yo'q"]); await pg.close(); continue; }
    await hw.click(); await pg.waitForTimeout(1500);
    const ta = pg.locator('textarea').first();
    if (!(await ta.count())) { rows.push([name, total, 'kompilyator ochilmadi']); await pg.close(); continue; }
    await ta.click(); await ta.fill('<h1>MARKER-102</h1>');
    await pg.waitForTimeout(1100);
    await pg.reload({ waitUntil: 'networkidle' }); await pg.waitForTimeout(1900);
    const open = (await pg.locator('textarea').count()) > 0;
    const kept = open ? (await pg.locator('textarea').first().inputValue()).includes('MARKER-102') : false;
    verdict = (open?'oyna ✅':'oyna ❌') + '  ' + (kept?'kod ✅':'kod ❌');
    rows.push([name, total, verdict]);
  } catch (e) { rows.push([name,'-','XATO: '+String(e.message).split('\n')[0].slice(0,50)]); }
  await pg.close();
}
console.log('\n===== 102-QONUN BRAUZER-TESTI (reload = tabdan qaytish) =====');
for (const [n,t,v] of rows) console.log(String(n).padEnd(18), String(t).padStart(3), ' ', v);
await b.close();
