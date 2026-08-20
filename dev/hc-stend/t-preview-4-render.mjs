import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open();
let navs = 0; p.on('framenavigated', f => { if (f !== p.mainFrame()) navs++; });
const getFrame = (p) => p.frames().find(f => f.url() === 'about:srcdoc' && f.parentFrame() === p.mainFrame());
await p.click('.hc-code'); await p.keyboard.press('Control+A'); await p.keyboard.press('Delete'); await p.waitForTimeout(600); navs = 0;
const t0 = Date.now(); await p.keyboard.type('<h1>Salom dunyo!</h1><p>Bu mening sahifam</p>', { delay: 40 }); const typed = Date.now() - t0;
await p.waitForTimeout(800); console.log(`tez yozish (${typed}ms, 47 belgi): iframe navigatsiya =`, navs);
navs = 0; await p.keyboard.type(' yana', { delay: 400 }); await p.waitForTimeout(800); console.log('sekin yozish (400ms/belgi, 5 belgi): navigatsiya =', navs);
// ▶ tugma HTML rejimida
navs = 0; await p.click('.hc-mini'); await p.waitForTimeout(600); console.log('▶ HTML rejimda: navigatsiya =', navs, '| bar:', await p.$eval('.hc-preview-pane .hc-pane-bar', e => e.textContent));
// scroll holati saqlanadimi? uzun sahifa, pastga scroll, keyin yozish
await setCode(p, '<h1>Top</h1>' + '<p>satr</p>'.repeat(200) + '<h2 id=end>END</h2>'); await p.waitForTimeout(700);
await getFrame(p).evaluate(() => window.scrollTo(0, 99999)); const s0 = await getFrame(p).evaluate(() => scrollY);
await p.click('.hc-code'); await p.keyboard.press('End'); await p.keyboard.type('!'); await p.waitForTimeout(800);
console.log('scroll before', s0, 'after edit', await getFrame(p).evaluate(() => scrollY));
// IMG_FALLBACK holatlari
const IMGS = [
  ['tashqi mavjud emas', '<img src="https://example.invalid/x.png" alt="Olma">'],
  ['nisbiy yo`l', '<img src="rasm.png" alt="Nok">'],
  ['bo`sh src', '<img src="" alt="Bo`sh">'],
  ['alt yo`q', '<img src="rasm.png">'],
  ['data: 1px', '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="d">'],
  ['ishlaydigan URL', '<img src="https://picsum.photos/200" alt="pic">'],
  ['ikkita buzuq', '<img src="a.png" alt="A"><img src="b.png" alt="B">'],
  ['srcsiz', '<img alt="src yoq">'],
  ['keyin src o`zgardi (JS)', '<img id=i src="a.png" alt="A"><script>setTimeout(()=>{document.getElementById("i").src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"},200)</script>'],
];
for (const [n, code] of IMGS) {
  await setCode(p, code); await p.waitForTimeout(1500);
  const r = await getFrame(p).evaluate(() => ({ fb: [...document.querySelectorAll('.hc-imgfb')].map(e => e.innerText.replace(/\n/g, ' / ')), imgs: [...document.querySelectorAll('img')].map(i => `${i.style.display||'shown'} ${i.complete} ${i.naturalWidth}x${i.naturalHeight}`) }));
  console.log(n, JSON.stringify(r));
  if (n === 'ikkita buzuq') await shot(p, 'shot-img-fallback.png');
}
// baseStyle: bola hech narsa yozmasa — standart margin/padding/font
await setCode(p, '<h1>Sarlavha</h1><p>Matn</p><img src="x.png" alt="rasm"><ul><li>a</li><li></li></ul>'); await p.waitForTimeout(800);
console.log('baseStyle:', await getFrame(p).evaluate(() => { const g = (s, pr) => getComputedStyle(document.querySelector(s))[pr]; return { bodyPad: g('body','padding'), bodyFont: g('body','fontFamily').slice(0,40), bodyLH: g('body','lineHeight'), h1font: g('h1','fontFamily'), h1margin: g('h1','margin'), imgRadius: g('img','borderRadius'), imgDisplay: g('img','display'), pMargin: g('p','margin'), emptyLi: g('li:empty','display') }; }));
await shot(p, 'shot-basestyle.png');
// bola body{margin:0} yozganda? va o'z shrifti
await setCode(p, '<style>body{margin:0;font-family:Arial}h1{margin:0}img{border-radius:0}</style><h1>S</h1><img src="x.png" alt="r">'); await p.waitForTimeout(800);
console.log('bola override:', await getFrame(p).evaluate(() => { const g = (s, pr) => getComputedStyle(document.querySelector(s))[pr]; return { bodyPad: g('body','padding'), bodyMargin: g('body','margin'), font: g('body','fontFamily'), h1m: g('h1','margin'), imgR: g('img','borderRadius') }; }));
await b.close();
