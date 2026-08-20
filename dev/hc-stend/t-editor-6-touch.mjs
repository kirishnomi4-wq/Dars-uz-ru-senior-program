import { open, setCode, sel, val, shot } from './t-lib.mjs';
import { devices } from 'playwright-core';
const log = (...a) => console.log(...a);
// A) telefon 390px, coarse
{
  const { b, p, errs } = await open({ url: 'http://127.0.0.1:4517/t-mobile.html', context: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 } });
  log('6a coarse?', await p.evaluate(() => matchMedia('(pointer: coarse)').matches), 'narrow?', await p.evaluate(() => matchMedia('(max-width: 860px)').matches));
  log('6a keys panel?', !!(await p.$('.hc-keys')), 'panetabs?', !!(await p.$('.hc-panetabs')), 'statusbar?', !!(await p.$('.hc-statusbar')));
  const layout = await p.evaluate(() => {
    const q = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), display: getComputedStyle(e).display }; };
    return { root: q('.hc-root'), top: q('.hc-top'), split: q('.hc-split'), editor: q('.hc-editor-pane'), preview: q('.hc-preview-pane'), keys: q('.hc-keys'), bottom: q('.hc-bottom'), ta: q('.hc-code'), docW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight, winH: innerHeight, winW: innerWidth, bodyScrollH: document.body.scrollHeight };
  });
  log('6a layout:', JSON.stringify(layout));
  await shot(p, 'e6a-phone.png');
  // key buttons text and sizes
  log('6a keys:', await p.$$eval('.hc-key', els => els.map(e => ({ t: e.textContent, w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height) }))));
  // tap a key: caret placement
  await p.tap('.hc-code');
  await p.$eval('.hc-code', el => { el.focus(); el.setSelectionRange(0, 0); });
  await p.tap('.hc-key:has-text("<")');
  await p.waitForTimeout(80);
  log('6a tap `<`:', JSON.stringify(await sel(p)), 'menu?', !!(await p.$('.hc-menu')), 'focus', await p.evaluate(() => document.activeElement.className));
  const mtip = await p.$eval('.hc-menu-tip', e => e.textContent).catch(() => null);
  log('6a menu tip:', mtip);
  await p.tap('.hc-menu-row:nth-child(4)').catch(e => log('tap row err', e.message));
  await p.waitForTimeout(80);
  log('6a after tap row:', JSON.stringify(await sel(p)));
  // menu position within box on narrow
  await p.keyboard.type(' <');
  const mm = await p.evaluate(() => { const m = document.querySelector('.hc-menu'); if (!m) return null; const r = m.getBoundingClientRect(), bx = document.querySelector('.hc-code-box').getBoundingClientRect(); return { l: r.left - bx.left, r: r.right - bx.left, boxW: bx.width, w: r.width, t: r.top - bx.top, b: r.bottom - bx.top, boxH: bx.height, vw: innerWidth, absR: r.right }; });
  log('6a menu rect narrow:', JSON.stringify(mm));
  await shot(p, 'e6a-phone-menu.png');
  await p.keyboard.press('Escape');
  // tap key mid-text
  await p.$eval('.hc-code', el => { el.setSelectionRange(2, 2); });
  await p.tap('.hc-key:has-text("/")');
  log('6a tap `/` at 2:', JSON.stringify(await sel(p)));
  // ⇥ key
  await p.tap('.hc-key.wide');
  log('6a tap ⇥:', JSON.stringify(await sel(p)));
  // Natija tab
  await p.tap('.hc-panetabs button:has-text("Natija")');
  await p.waitForTimeout(100);
  log('6a result pane visible:', await p.$eval('.hc-preview-pane', e => getComputedStyle(e).display), 'editor', await p.$eval('.hc-editor-pane', e => getComputedStyle(e).display));
  await shot(p, 'e6a-phone-result.png');
  // Ishga tushirish button in narrow: is it visible in editor bar? width overflow?
  await p.tap('.hc-panetabs button:has-text("Kod")');
  const bar = await p.evaluate(() => { const b = document.querySelector('.hc-tabs-bar').getBoundingClientRect(); const els = [...document.querySelectorAll('.hc-tabs-bar > *, .hc-tools > *')].map(e => { const r = e.getBoundingClientRect(); return { c: e.className, l: Math.round(r.left), r: Math.round(r.right) }; }); return { barR: Math.round(b.right), els }; });
  log('6a bar overflow?', JSON.stringify(bar));
  // long line horizontal scroll on phone
  // Font A-/A+ not available in narrow (statusbar hidden) — check
  log('6a bottom buttons:', await p.$$eval('.hc-bottom button', els => els.map(e => ({ t: e.textContent.trim(), w: Math.round(e.getBoundingClientRect().width), y: Math.round(e.getBoundingClientRect().y) }))));
  log('6a ERRS', errs);
  await b.close();
}
// B) planshet 820px coarse (narrow, tabbed)
{
  const { b, p } = await open({ url: 'http://127.0.0.1:4517/t-mobile.html', context: { viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true } });
  log('6b keys?', !!(await p.$('.hc-keys')), 'panetabs?', !!(await p.$('.hc-panetabs')));
  await shot(p, 'e6b-tablet.png');
  await b.close();
}
// C) planshet landscape 1024 coarse — side by side + keys
{
  const { b, p } = await open({ url: 'http://127.0.0.1:4517/t-mobile.html', context: { viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true } });
  log('6c keys?', !!(await p.$('.hc-keys')), 'panetabs?', !!(await p.$('.hc-panetabs')), 'statusbar?', !!(await p.$('.hc-statusbar')));
  const h = await p.evaluate(() => ({ ta: document.querySelector('.hc-code').getBoundingClientRect().height, split: document.querySelector('.hc-split').getBoundingClientRect().height, root: document.querySelector('.hc-root').getBoundingClientRect().height, docH: document.documentElement.scrollHeight, winH: innerHeight }));
  log('6c heights:', JSON.stringify(h));
  await shot(p, 'e6c-tablet-land.png');
  await b.close();
}
// D) laptop tor oyna 800px, mouse (fine) — no keys, tabbed
{
  const { b, p } = await open({ context: { viewport: { width: 800, height: 700 } } });
  log('6d keys?', !!(await p.$('.hc-keys')), 'panetabs?', !!(await p.$('.hc-panetabs')));
  await shot(p, 'e6d-narrow-mouse.png');
  await b.close();
}
