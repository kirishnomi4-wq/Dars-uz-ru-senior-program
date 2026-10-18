// F-1015-378…380 · m3-13: kirish — sayt to'liq (ichki aylantirish yo'q), ⛶ faqat sayt; a1 — oyna 400, ⛶ da aylantirishsiz; yakuniy — harf va «boshqa narsa» izohlari.
// Chaqirish: node …/f378-tekshir.mjs <chiqish>
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
const ROOT = '/home/kali/Desktop/internetLesson'; const FILE = ROOT + '/src/3-Modull/ReactBuildSiteLesson.jsx'; const ID = 'react-build-site-final-p4-v18';
const OUT = process.argv[2];
const res = await build({ stdin: { contents: `import React from 'react'; import { createRoot } from 'react-dom/client'; import L from ${JSON.stringify(FILE)}; createRoot(document.getElementById('root')).render(React.createElement(L, { lang: 'uz' }));`, resolveDir: ROOT, loader: 'jsx' },
  bundle: true, format: 'iife', jsx: 'automatic', nodePaths: [ROOT + '/node_modules'], loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.mp3': 'dataurl', '.webp': 'dataurl', '.gif': 'dataurl' }, charset: 'utf8', write: false, logLevel: 'silent' });
const page = OUT + '/m313.html'; writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root"></div><script>${res.outputFiles[0].text}<\/script></body></html>`);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const natija = []; const ok = (n, sh, iz = '') => natija.push(`${sh ? '✅' : '❌'} ${n}${iz ? ' — ' + iz : ''}`);
async function och(s, h = 1080) { const ctx = await b.newContext({ viewport: { width: 1920, height: h } }); await ctx.route(/^https?:\/\//, (r) => r.abort());
  await ctx.addInitScript(([id, s]) => { localStorage.clear(); localStorage.setItem('liveSession:' + id, JSON.stringify({ mode: 'self' })); localStorage.setItem('ccProgress:' + id, JSON.stringify({ screen: s, maxReached: s, answers: {}, earned: [], startedAt: Date.now(), total: 9, savedAt: Date.now() })); for (const r of ['mentor','learner','student','self']) { localStorage.setItem('inetOnboarded_'+r,'1'); localStorage.setItem('hcOnboarded_'+r,'1'); } }, [ID, s]);
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.goto('file://' + page); await p.waitForTimeout(1300); return { p, ctx, errs }; }
const ichki = (p) => p.evaluate(() => { const bd = [...document.querySelectorAll('.bp-body')].find(x => x.offsetParent); return bd ? { sh: bd.scrollHeight, ch: bd.clientHeight } : null; });
{ const { p, ctx, errs } = await och(0);
  const h = await ichki(p); ok('kirish: sayt to\'liq — ichki aylantirish yo\'q', h && h.sh <= h.ch + 1, JSON.stringify(h));
  await p.click('.chip:has-text("Bo\'laklarga ajratish")'); await p.waitForTimeout(400);
  await p.click('.zoom-btn'); await p.waitForTimeout(500);
  const z = await p.evaluate(() => { const zo = document.querySelector('.zoom-on'); if (!zo) return null; const bd = zo.querySelector('.bp-body'); return { variant: !!zo.querySelector('.hook-option'), bdSh: bd.scrollHeight, bdCh: bd.clientHeight, zoSh: zo.scrollHeight, zoCh: zo.clientHeight }; });
  ok('kirish ⛶: faqat sayt (variantlar yo\'q)', z && !z.variant, JSON.stringify(z));
  ok('kirish ⛶: sayt ham, oyna ham aylantirishsiz (1920×1080)', z && z.bdSh <= z.bdCh + 1 && z.zoSh <= z.zoCh + 1, JSON.stringify(z));
  await p.screenshot({ path: OUT + '/kirish-zoom.png' }); await p.keyboard.press('Escape'); await p.waitForTimeout(300); await p.screenshot({ path: OUT + '/kirish.png' });
  ok('kirish: pageerror yo\'q', !errs.length, errs.join('|')); await ctx.close(); }
{ const { p, ctx, errs } = await och(2);
  const st = await p.evaluate(() => { const bd = [...document.querySelectorAll('.bp-body')].find(x => x.offsetParent); return bd.style.maxHeight; });
  ok('a1: sayt oynasi 400px', st === '400px', st);
  await p.click('.zoom-btn'); await p.waitForTimeout(500);
  const z = await p.evaluate(() => { const zo = document.querySelector('.zoom-on'); const bd = zo.querySelector('.bp-body'); return { daraxt: !!zo.querySelector('.code-box'), bdSh: bd.scrollHeight, bdCh: bd.clientHeight, zoSh: zo.scrollHeight, zoCh: zo.clientHeight }; });
  ok('a1 ⛶: sayt aylantirishsiz, daraxt yonida', z.daraxt && z.bdSh <= z.bdCh + 1, JSON.stringify(z));
  ok('a1 ⛶: oynaning o\'zi ham sig\'adi (1920×1080)', z.zoSh <= z.zoCh + 1, JSON.stringify(z));
  await p.screenshot({ path: OUT + '/a1-zoom.png' });
  ok('a1: pageerror yo\'q', !errs.length, errs.join('|')); await ctx.close(); }
for (const [yoz, kut] of [['function TaomCard(props) {', 'otdi'], ['function TaomCard(props)', 'otdi'], ['Function TaomCard(props) {', 'harf'], ['function TaomCard(Props) {', 'harf'], ['FUNCTION TAOMCARD(PROPS) {', 'harf'], ['function taomCard(props) {', 'katta'], ['cdscsdcsc', 'boshqa'], ['<GameCard name="Minecraft" />', 'boshqa'], ['fun', 'jim']]) {
  const { p, ctx } = await och(6);
  await p.fill('.vsc-input', yoz); await p.waitForTimeout(500);
  const h = await p.evaluate(() => ({ otdi: !!document.querySelector('.frame-success') || ![...document.querySelectorAll('button.btn-white-accent')].pop().disabled, w: [...document.querySelectorAll('.frame-warn')].map(e => e.innerText).join(' | ') }));
  const n = h.otdi ? 'otdi' : /harfni farqlaydi/.test(h.w) ? 'harf' : /Katta harf/.test(h.w) ? 'katta' : /kalit so'zi bilan boshlanadi/.test(h.w) ? 'boshqa' : 'jim';
  ok(`yakuniy «${yoz}» → ${kut}`, n === kut, n + (h.w ? ' · ' + h.w.slice(0, 80) : ''));
  await ctx.close();
}
await b.close(); console.log(natija.join('\n')); console.log(`${natija.filter(x => x.startsWith('✅')).length}/${natija.length}`);
