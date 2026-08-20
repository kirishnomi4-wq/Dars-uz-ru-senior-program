import { open, setCode, shot } from './t-lib.mjs';
let { b, p, errs } = await open({ props: { lang: 'uz', task: { title: 'C', files: [ { name: 'index.html', lang: 'html', starter: '<p>x</p>' }, { name: 'app.js', lang: 'js', starter: '' } ], requirements: [] } } });
await p.click('.hc-tab:has-text("app.js")');
const L = () => p.$$eval('.hc-console-line', e => e.map(x => x.textContent));
await setCode(p, 'alert("Salom!"); console.log("alertdan keyin")'); await p.click('.hc-mini'); await p.waitForTimeout(800); console.log('alert JS rejim:', await L());
await setCode(p, 'let ism = prompt("Ismingiz?"); console.log("Salom, " + ism); let ok = confirm("Rozimisiz?"); console.log(ok)'); await p.click('.hc-mini'); await p.waitForTimeout(800); console.log('prompt/confirm:', await L());
// e.lineno bo'lganda qanchaga siljigan bo'lardi — hujjat ichida script qaysi qatordan boshlanadi
await setCode(p, 'window.addEventListener("error", e => console.log("LINENO", e.lineno, "COL", e.colno)); \n\nfoo()'); await p.click('.hc-mini'); await p.waitForTimeout(800); console.log('lineno (bola 3-qator):', await L());
// window.onerror ni bola o'zi yozsa harness buziladimi
await setCode(p, 'window.onerror = () => {}; console.log("ok")'); await p.click('.hc-mini'); await p.waitForTimeout(600); console.log('onerror override:', await L());
// bola console.log ni override qilsa
await setCode(p, 'console.log = () => {}; console.info("info ishlaydi"); console.log("yo`q")'); await p.click('.hc-mini'); await p.waitForTimeout(600); console.log('console override:', await L());
// juda tez ko'p run — nonce
for (let i = 0; i < 5; i++) { await setCode(p, 'setTimeout(()=>console.log("kech ' + i + '"), 400)'); await p.click('.hc-mini'); await p.waitForTimeout(80); }
await p.waitForTimeout(1500); console.log('5 tez run (faqat oxirgi 4 chiqishi kerak):', await L());
// HTML rejim (konsol yo'q): script xatosi va console.log ko'rinmaydi
await p.evaluate(() => { window.unmountHC(); window.mountHC({ lang: 'uz' }); }); await p.waitForSelector('.hc-code');
await setCode(p, '<h1>A</h1><script>console.log("salom"); alert("hi"); foo()</script>'); await p.waitForTimeout(800);
console.log('HTML rejim: konsol paneli bormi?', await p.$('.hc-console') ? 'bor' : "yo'q", '| status:', await p.$eval('.hc-status', e => e.textContent), '| msg:', await p.$eval('.hc-msg', e => e.textContent));
await b.close();
