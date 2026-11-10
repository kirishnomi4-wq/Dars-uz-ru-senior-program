// Ekranning OXIRGI holatini suratga oladi (04.11): ovoz o'chiriladi, segmentlar o'zi o'tadi, oxirgi nuqta yonguncha kutiladi
// (sahna-olchov.mjs ham shu holatni o'lchaydi). ISHLATISH (dev :5333): node dev/surat-oxirgi.mjs <dars> <ekranlar 1-asosli, vergul bilan> <papka> [WxH]
import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const [dars, list, dir, size = '1280x720'] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: W, height: H } });
for (const e of list.split(',').map(Number)) {
  await p.goto(`http://localhost:5333/mentor-kurs.html?dars=${dars}&s=${e - 1}`, { waitUntil: 'load' });
  await p.waitForSelector('.mk-stage');
  await p.waitForTimeout(250);
  const mute = await p.$('.mk-audio button'); if (mute) await mute.click();
  for (let t = 0; t < 120; t++) {
    const st = await p.evaluate(() => { const d = [...document.querySelectorAll('.mk-dots i')]; return { n: d.length, last: d.length ? d[d.length - 1].classList.contains('on') || d.every((x) => x.classList.contains('done') || x.classList.contains('on')) : true }; });
    if (st.last) break;
    const ask = await p.$('.mk-ask .row button'); if (ask) { await ask.click(); continue; }
    const man = await p.$('button:text-matches("^(Keyingi qadam|Следующий шаг)")'); if (man) { await man.click(); await p.waitForTimeout(150); continue; }
    await p.waitForTimeout(150);
  }
  if (process.env.QATOR) { const ln = await p.$$('.mk-ln.clk'); if (ln[Number(process.env.QATOR)]) { await ln[Number(process.env.QATOR)].click(); await p.waitForTimeout(900); } }
  if (process.env.JAVOB) { const o = await p.$$('.mk-opt'); for (const bt of o) { if (await bt.isDisabled()) continue; await bt.click(); await p.waitForTimeout(500); if (await p.$('.mk-opt.ok')) break; } }
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${dir}/e${e}.png` });
  console.log(`OK e${e}`);
}
await b.close();
