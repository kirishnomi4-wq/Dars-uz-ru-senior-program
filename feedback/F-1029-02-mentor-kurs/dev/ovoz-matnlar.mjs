// Vercel ko'rik sayti uchun (03.11): har dars har ekranini ochib, ovozga berilgan HAMMA matnni yig'adi
// (shim window.__ttsTexts: useAudio segmentlari + pushOneOff). Variantlar bosiladi — xato izohlari ovozi ham.
// 04.11: satr/variant bosilgandan keyin kutish 250→700 / 350→500 ms — LineCheck «to'g'ri» ovozi 300 ms kechikib keladi, avval tushib qolardi (F-1104-20)
// ISHLATISH (dev :5333 yoniq): node dev/ovoz-matnlar.mjs <out.json> [lang]   → { dars: [matn, …] }
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'fs';
const [out, lang = 'uz'] = process.argv.slice(2);
const DARSLAR = (process.env.DARSLAR || 'pg-01,pg-02,jest-01,jest-02,cicd-01,cicd-02,tgpg-01,ws1-01,ws2-01,wh-01,nest-01,nest-02').split(','); // DARSLAR=pg-01 — faqat bitta dars
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const res = {};
async function walk(d) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const all = new Set();
  const grab = async () => { try { (await page.evaluate(() => [...(window.__ttsTexts || [])])).forEach((t) => all.add(t)); } catch (e) {} };
  const url = (i) => `${process.env.BASE || "http://localhost:5333"}/mentor-kurs.html?dars=${d}&s=${i}&lang=${lang}`;
  await page.goto(url(0), { waitUntil: 'load' }); await page.waitForSelector('.mk-stage', { timeout: 30000 });
  const total = await page.evaluate(() => { const m = document.body.innerText.match(/\b(\d+)\s*\/\s*(\d+)\b/); return m ? Number(m[2]) : 0; });
  for (let i = 0; i < total; i++) {
    await page.goto(url(i), { waitUntil: 'load' }); await page.waitForSelector('.mk-stage');
    await page.waitForTimeout(300);
    const mute = await page.$('.mk-audio button'); if (mute) await mute.click().catch(() => {});
    for (let t = 0; t < 25; t++) { // 26.11: bosish .catch bilan — element yo'qolsa (qayta chizildi) yiqilmasin
      await page.waitForTimeout(250);
      const ask = await page.$('.mk-ask .row button'); if (ask) { await ask.click({ timeout: 1500 }).catch(() => {}); continue; }
      const act = await page.$('.n1-acthint') && await page.$('.n1-act'); if (act) { await act.click({ timeout: 1500 }).catch(() => {}); continue; } // F-1120-02
      const man = await page.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) { await man.click({ timeout: 1500 }).catch(() => {}); continue; }
      const st = await page.evaluate(() => { const b = [...document.querySelectorAll('.mk-nav .mk-btn')].pop(); const dd = [...document.querySelectorAll('.mk-dots i')]; return { ready: b && !b.disabled, on: dd.findIndex((x) => x.classList.contains('on')), n: dd.length }; });
      if (st.ready || (st.n > 0 && st.on === st.n - 1 && t > 3)) break;
    }
    await grab();
    // variantlar: hammasini bosib chiqamiz (xato izohlari va to'g'ri javob ovozi)
    const o = await page.$$('.mk-opt');
    const skip = [];
    for (let k = 0; k < o.length; k++) { try { if (await o[k].isDisabled()) { skip.push(k); continue; } await o[k].click({ timeout: 1500 }); await page.waitForTimeout(500); await grab(); } catch (e) {} }
    // 26.11 (F-1125-01): to'g'ri javob bosilgach qolgan variantlar qulflanadi — ularning xato izohi ovozi yig'ilmay qolardi
    // (saytda shu izohlar 404, ovozsiz). Har qulflangan variant yangi yuklashda birinchi bo'lib bosiladi.
    for (const k of skip) {
      try {
        await page.goto(url(i), { waitUntil: 'load' }); await page.waitForSelector('.mk-stage');
        const m2 = await page.$('.mk-audio button'); if (m2) await m2.click();
        for (let t = 0; t < 40; t++) { const oo = await page.$$('.mk-opt'); if (oo[k] && !(await oo[k].isDisabled())) { await oo[k].click({ timeout: 1500 }); await page.waitForTimeout(500); await grab(); break; } await page.waitForTimeout(250); }
      } catch (e) {}
    }
    // satr-tekshiruv: hamma bosiladigan satr
    const ln = await page.$$('.mk-ln.clk');
    for (const b of ln) { try { await b.click({ timeout: 1000 }); await page.waitForTimeout(700); await grab(); } catch (e) {} }
    await grab();
  }
  res[d] = [...all];
  console.error(`${d}: ${total} ekran, ${all.size} matn`);
  await page.close();
}
const q = [...DARSLAR];
await Promise.all([0, 1, 2, 3].map(async () => { while (q.length) await walk(q.shift()); }));
writeFileSync(out, JSON.stringify(res, null, 1));
await browser.close();
