import { chromium } from '/home/kali/Desktop/internetLesson/node_modules/playwright-core/index.mjs';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const V = {
  v1: () => { // yorliq natija ostida izoh bo'lib, ⛶ karta burchagida
    document.querySelectorAll('.q-blok .q-split > .q-col:last-child').forEach(col => {
      const y = col.querySelector(':scope > .q-yorliq'); const z = col.querySelector(':scope > .zoomable');
      if (y && z) { z.after(y); y.style.marginTop = '6px'; }
      const zb = col.querySelector('.zoom-btn'); if (zb && z) { z.style.position = 'relative'; zb.style.position = 'absolute'; zb.style.top = '6px'; zb.style.right = '6px'; zb.style.zIndex = 3; z.appendChild(zb); }
      const zq = col.querySelector('.zb-qator'); if (zq) { zq.style.setProperty('padding-top', '0px', 'important'); }
    });
  },
  v2: () => { // ikki ustun ham yorliq bilan boshlanadi: chapda «Qadamlar», o'ngda yorliq + ⛶ bir qatorda
    document.querySelectorAll('.q-blok .q-split').forEach(sp => {
      const [l, r] = sp.children; const y = r.querySelector(':scope > .q-yorliq');
      const ly = document.createElement('span'); ly.className = 'q-yorliq'; ly.textContent = 'QADAMLAR'; l.prepend(ly);
      const zb = r.querySelector('.zoom-btn'); if (y && zb) { const row = document.createElement('div'); row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;min-height:22px'; y.before(row); row.append(y); zb.style.position = 'static'; row.append(zb); }
    });
  },
};
for (const [key, lid, sc, tt] of [['m7-07', 'm7-07-v1', 3, 12], ['m7-06', 'm7-06-v1', 6, 12]]) {
  for (const v of ['v1']) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 773 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
    await p.addInitScript(([lid, sc, tt]) => { localStorage.setItem('cc_lang', 'uz'); localStorage.setItem('ccProgress:' + lid, JSON.stringify({ screen: sc, answers: {}, earned: [], total: tt, savedAt: Date.now() })); }, [lid, sc, tt]);
    await p.goto(`http://localhost:5300/#/lesson/${key}`, { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.lesson-root');
    const kir = p.getByText(/Kodsiz/); if (await kir.count()) await kir.first().click({ timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(1400);
    if (V[v]) await p.evaluate(V[v]); await p.waitForTimeout(300);
    const d = await p.evaluate(() => { const sp = document.querySelector('.q-blok .q-split'); const l = sp.children[0].querySelector('.q-blok-q'); const r = sp.children[1].querySelector('.q-blok-natija'); return [Math.round(l.getBoundingClientRect().top), Math.round(r.getBoundingClientRect().top)]; });
    console.log(key, v, JSON.stringify(d));
    await p.screenshot({ path: `q159p-${key}-${v}.jpg`, type: 'jpeg', quality: 70, clip: { x: 0, y: 180, width: 1280, height: 420 } }); await ctx.close();
  }
}
await b.close();
