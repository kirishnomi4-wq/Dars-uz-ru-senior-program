// JsVars praktika-kompilyatori uchun tutun-testi (F-0803-09)
// 1) Uy vazifasi (TASK_OMBOR) — kompilyator ochiladi, to'g'ri yechim 3/3 shartni yopadi
// 2) Runtime `log_includes` yo'li — konsol natijasi bo'yicha tekshiruv ishlaydi (P1/P2)
import { chromium } from 'playwright-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:5300/#/lesson/m2-03';
const LID = 'js-vars-01-v18';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const ctx = await browser.newContext();
await ctx.addInitScript((id) => {
  try {
  localStorage.setItem('liveSession:' + id, '{"mode":"self"}');
  localStorage.removeItem('ccPractice:' + id);
  // to'g'ridan-to'g'ri yakun-sahifaga (s16 = 19-indeks, jami 20 ekran)
  localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: 19, answers: {}, earned: [], startedAt: Date.now(), total: 20, savedAt: Date.now() }));
  } catch {}
}, LID);
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: ' + String(e.message).slice(0, 120)));

await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(600);

// — oxirgi ekrangacha: "Davom etish"/next tugmasini bosaverish —
let reached = false;
for (let i = 0; i < 60; i++) {
  const hw = await page.locator('button.hw-big').count();
  if (hw > 0) { reached = true; break; }
  const btns = page.locator('button:visible');
  const n = await btns.count();
  let clicked = false;
  for (let k = n - 1; k >= 0; k--) {
    const b = btns.nth(k);
    const t = (await b.textContent() || '').trim();
    if (/Davom etish|Boshlash|Keyingi|Tushundim|Yakuniy|→$/.test(t) && await b.isEnabled()) { await b.click({ timeout: 2000 }).catch(() => {}); clicked = true; break; }
  }
  if (!clicked) {
    // test/tanlov ekrani — birinchi variantni bosamiz
    const opt = page.locator('[class*="option"]:visible, .qz-btn:visible').first();
    if (await opt.count()) await opt.click({ timeout: 2000 }).catch(() => {});
  }
  await page.waitForTimeout(220);
}
console.log('yakun-sahifaga yetdi:', reached);

let hwOk = false, reqOk = '';
if (reached) {
  await page.locator('button.hw-big').click();
  await page.waitForTimeout(900);
  const run = page.locator('button.hw-run');
  hwOk = await run.count() > 0;
  if (hwOk) {
    await run.click();
    await page.waitForTimeout(700);
    const ta = page.locator('.hc-root textarea').first();
    await ta.waitFor({ timeout: 5000 });
    await ta.fill('let ism = "Aziza"\nlet yosh = 14\nconst tugilgan_yil = 2011\n');
    await page.waitForTimeout(1200);
    reqOk = await page.locator('.hc-root').innerText().then(t => t.split('\n').filter(l => /✓|✗/.test(l)).join(' | ')).catch(() => '');
    const nextBtn = page.locator('.hc-next');
    const enabled = await nextBtn.count() ? await nextBtn.first().isEnabled() : false;
    console.log('kompilyator ochildi:', true, '· "Davom etish" faol:', enabled);
  }
}
console.log('uy-vazifa tugmasi bor:', hwOk);
console.log('shartlar paneli:', reqOk.slice(0, 300));

// — 2) runtime log_includes yo'li (P1/P2 shartlari shu yo'ldan o'tadi) —
const logCheck = await page.evaluate(async () => {
  const doc = `<!doctype html><html><head><script>
window.__logs=[];
(function(){var _l=console.log;console.log=function(){
  for(var i=0;i<arguments.length;i++){var a=arguments[i];
    try{window.__logs.push(typeof a==='object'?JSON.stringify(a):String(a));}catch(e){window.__logs.push(String(a));}}
  try{_l.apply(console,arguments);}catch(e){}
};})();
<\/script></head><body>
<script>let ball = 0
ball = 25
console.log(ball)
console.log(5 + 5)
console.log("5" + "5")<\/script>
<script>parent.postMessage({t:'res', logs: window.__logs.join(' ')}, '*');<\/script>
</body></html>`;
  return await new Promise((res) => {
    const f = document.createElement('iframe');
    f.style.display = 'none';
    const on = (e) => { if (e.data && e.data.t === 'res') { window.removeEventListener('message', on); f.remove(); res(e.data.logs); } };
    window.addEventListener('message', on);
    f.srcdoc = doc;
    document.body.appendChild(f);
    setTimeout(() => res('TIMEOUT'), 4000);
  });
});
console.log('konsol chiqishi:', JSON.stringify(logCheck));
console.log('  P1 (25):', logCheck.includes('25'), '· P2 (10):', logCheck.includes('10'), '· P2 (55):', logCheck.includes('55'));
console.log('sahifa xatolari:', errs.length ? errs : 'yo\'q');

await browser.close();
