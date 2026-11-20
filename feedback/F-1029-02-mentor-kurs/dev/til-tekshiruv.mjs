// TIL TEKSHIRUVI (F-1030-38) — serverlar: tts :5332, vite :5333.
// node til-tekshiruv.mjs <ekranlar: all | 0,1,2> <uz|ru> [surat-papka|""] [dars-kaliti, default nest-01] [natija.json]
// 1) Qoldiq: har ekranni ?s=N&lang=… bilan ovozsiz oxirigacha yuradi (savol, qadam, variant, satr, katakcha, «Boshqacha chiqdimi?», «Kodni ochish»),
//    «Matn»ni ochadi; ekrandagi va ovozga ketgan matnda o'zbekcha so'z qidiradi (ru) · ovoz belgisi tilga mosligini tekshiradi.
// 2) Solishtiruv: natija.json — har ekranning yakuniy matni + muqova + ovoz matnlari. Ikki versiyani (masalan RU qo'shilgandan
//    oldin/keyin, lang=uz) solishtirib, o'zbekcha bitta belgiga ham o'zgarmaganini isbotlaydi; .oz.jsx ni ham shu bilan sinash mumkin
//    (dev/main.jsx DARSLAR'ga vaqtincha kalit qo'shib).
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const list = process.argv[2] && process.argv[2] !== 'all' ? process.argv[2].split(',').map(Number) : [...Array(39).keys()];
const lang = process.argv[3] || 'ru';
const shots = process.argv[4] || '';
const dars = process.argv[5] || 'nest-01';
const dumpFile = process.argv[6] || '';
const dump = {};
const UZW = /\b(va|bu|ham|uchun|bilan|emas|kerak|qiling|bosing|nima|qaysi|yoki|endi|keyin|xato|ekran\w*|qadam\w*|satr\w*|isbot\w*|bor|yo['’]q|mashina\w*|fayl\w*|chiqadi|ishlaydi|oching|yozing|tekshiring|qator\w*|daqiqa\w*|Davom|Orqaga|Matn|ustoz\w*|Xulosa|bosqich\w*|Amaliyot|jamoa\w*|siz\w*|javob\w*|savol\w*|Tuzatildi|nusxa\w*|qabul|qiladi|beradi|ochiladi|yuboring|kiriting|shu|bitta|ikki|uch|hamma|faqat|agar|lekin|chunki|ya['’]ni)\b/g;
const APOS = /\b[A-Za-z]*[oOgG]['ʻ’][a-z]+\b/g;
const SUFF = /[A-Za-z]['’](ga|da|ni|dan|ning|lar\w*|i|si|dagi|ning|imiz|ingiz)\b/g;
const scan = (s) => {
  const out = new Set();
  // kod bloklari ichidagi identifikatorlarni kamroq olish uchun: matnni o'zicha tekshiramiz, keyin qo'lda ko'rib chiqiladi
  for (const re of [UZW, APOS, SUFF]) for (const m of s.matchAll(re)) out.add(m[0]);
  return [...out];
};
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errs = [];
page.on('pageerror', (e) => errs.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
const report = {};
const tc = async (h) => { try { await h.click({ timeout: 2000 }); return true; } catch (e) { return false; } };
const ttsAll = new Set();
// muqova
await page.goto(`${process.env.BASE || "http://localhost:5333"}/mentor-kurs.html?dars=${dars}&lang=${lang}`, { waitUntil: 'load' }); await page.waitForSelector('.mk-cover', { timeout: 20000 });
dump.cover = await page.evaluate(() => document.body.innerText);
report.cover = scan(await page.evaluate(() => document.body.innerText));
for (const i of list) {
  await page.goto(`${process.env.BASE || "http://localhost:5333"}/mentor-kurs.html?dars=${dars}&s=${i}&lang=${lang}`, { waitUntil: 'load' }); await page.waitForSelector('.mk-stage', { timeout: 20000 });
  await page.waitForTimeout(250);
  const mute = await page.$('.mk-audio button'); if (mute) await tc(mute);
  const texts = new Set();
  const grab = async () => texts.add(await page.evaluate(() => { const r = document.querySelector('#root'); return (r ? r.innerText : '') + '\n' + [...document.querySelectorAll('[title],[placeholder]')].map((n) => (n.getAttribute('title') || '') + ' ' + (n.getAttribute('placeholder') || '')).join('\n'); }));
  for (let k = 0; k < 70; k++) {
    await page.waitForTimeout(260);
    await grab();
    const ask = await page.$('.mk-ask .row button'); if (ask) { await tc(ask); continue; }
    const act = await page.$('.n1-acthint') && await page.$('.n1-act'); if (act) { await tc(act); continue; } // F-1120-02: «o'zingiz buzasiz» — kodda yonib turgan so'z
    const man = await page.$('button:has-text("Следующий шаг"), button:has-text("Keyingi qadam")'); if (man) { await tc(man); continue; }
    const opt = await page.$('.mk-opt:not([disabled])'); if (opt && !(await page.$('.mk-opt.ok'))) { await tc(opt); await page.waitForTimeout(350); continue; }
    const ln = await page.$('.mk-ln.clk:not(.bad)'); if (ln) { const tx = await ln.innerText(); if (tx.trim().length > 3) { await tc(ln); await page.waitForTimeout(350); continue; } }
    const cb = await page.$('.mk-step input[type=checkbox]:not(:checked)'); if (cb) { await tc(cb); continue; }
    const tr = await page.$('.mk-trbtn[aria-expanded="false"]'); if (tr) { await tc(tr); await page.waitForTimeout(200); continue; } // F-1031-03: yopiq jadvalni ochib, matnini ham tekshiradi
    const inp = await page.$('.mk-input'); if (inp && !(await inp.inputValue())) { await inp.fill('x'); continue; }
    // kod ochish tugmalari (amaliyot)
    const kod = await page.$$('button:has-text("Открыть код"), button:has-text("Kodni ochish")');
    if (kod.length && !texts.has('__kod')) { texts.add('__kod'); for (let j = 0; j < kod.length; j++) { const b = (await page.$$('button:has-text("Открыть код"), button:has-text("Kodni ochish")'))[j]; if (!b) break; await tc(b); await page.waitForTimeout(200); await grab(); const back = await page.$('button:has-text("Назад к шагам"), button:has-text("Qadamlarga qaytish")'); if (back) await tc(back); await page.waitForTimeout(150); } continue; }
    const nxt = [...await page.$$('.mk-nav .mk-btn')].pop();
    if (nxt && !(await nxt.isDisabled())) break;
  }
  const tb = await page.$('button:has-text("Текст"), button:has-text("Matn")'); if (tb) { await tc(tb); await page.waitForTimeout(150); await grab(); }
  if (shots) await page.screenshot({ path: `${shots}/s${String(i + 1).padStart(2, '0')}.png` });
  const tts = await page.evaluate(() => [...(window.__ttsTexts || [])]);
  tts.forEach((x) => ttsAll.add(x));
  const all = [...texts].join('\n');
  dump[i + 1] = await page.evaluate(() => { const r = document.querySelector('#root'); return r ? r.innerText : ''; });
  report[i + 1] = scan(all);
}
const ttsBad = [...ttsAll].filter((x) => (lang === 'ru' ? !x.startsWith('[Русское произношение]') : !x.startsWith("[O'zbekcha")) || scan(x.replace(/\[[^\]]+\]/g, '')).length);
for (const [k, v] of Object.entries(report)) if (v.length) console.log(`ekran ${k}: ${v.join(' · ')}`);
console.log(`ovoz matnlari: ${ttsAll.size}, shubhali: ${ttsBad.length}`);
ttsBad.slice(0, 40).forEach((x) => console.log('  TTS> ' + x.slice(0, 160) + ' ⇢ ' + scan(x.replace(/\[[^\]]+\]/g, '')).join(' · ')));
console.log('xatolar:', errs.filter((e) => !/autoplay|interrupted|play\(\)/.test(e)).slice(0, 10));
if (dumpFile) { const fs = await import('fs'); dump.tts = [...ttsAll].sort(); fs.writeFileSync(dumpFile, JSON.stringify(dump, null, 1)); }
await browser.close();
