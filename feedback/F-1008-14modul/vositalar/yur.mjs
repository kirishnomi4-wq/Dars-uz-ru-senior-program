// 14-Modul (08.10, F-1008-575): ekranni haqiqiy bosish bilan oxirigacha yurgizib, tugagan holatni suratga oladi va o lchaydi (server 127.0.0.1:5176).
// N=<ekranlar soni> node feedback/F-1008-14modul/vositalar/yur.mjs <kalit> <lessonId> <ekran> <W> <H> <chiqish-prefiks> step... ; step: t=Matn | s=css | shot=nom | w=ms | m=css (o'lcham)
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [key, id, scr, W, H, out, ...steps] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const p = await b.newPage({ viewport: { width: +W, height: +H } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.addInitScript(([id, s, N, A]) => { if (!sessionStorage.getItem('_k')) { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: +s, answers: A, total: +N, savedAt: Date.now() })); sessionStorage.setItem('_k', '1'); } }, [id, scr, +(process.env.N || 16), JSON.parse(process.env.ANS || '{}')]);
await p.goto(`http://127.0.0.1:5176/#/lesson/${key}`, { waitUntil: 'networkidle' }); await p.waitForTimeout(1600);
for (const st of steps) {
  const [k, ...r] = st.split('='); const v = r.join('=');
  try {
    if (k === 't') await p.getByRole('button', { name: v }).first().click({ timeout: 5000 });
    else if (k === 's') await p.locator(v).first().click({ timeout: 5000 });
    else if (k === 'w') await p.waitForTimeout(+v);
    else if (k === 'shot') await p.screenshot({ path: `${out}-${v}.png` });
    else if (k === 'm') console.log('o\'lcham', v, JSON.stringify(await p.evaluate(sel => [...document.querySelectorAll(sel)].map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; }), v)));
    else if (k === 'c') console.log('soni', v, await p.locator(v).count());
    else if (k === 'd') { const [a, b2] = v.split('|'); await p.locator(a).first().dragTo(p.locator(b2).first()); }
  } catch (e) { console.log('QADAM XATO', st, e.message.split('\n')[0]); }
  await p.waitForTimeout(250);
}
console.log(errs.length ? 'pageerror: ' + errs.join(' | ') : 'pageerror yo\'q');
await b.close();
