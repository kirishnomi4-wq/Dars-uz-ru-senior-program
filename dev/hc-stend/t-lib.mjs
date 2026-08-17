// Umumiy yordamchi — editor sinovlari uchun
import { chromium } from 'playwright-core';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const HERE = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

export async function open(opts = {}) {
  const b = await chromium.launch({ executablePath: CHROME, headless: true, ignoreDefaultArgs: ['--hide-scrollbars'] });
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 }, ...opts.context });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type().toUpperCase() + ' ' + m.text()); });
  await p.goto(opts.url || 'http://127.0.0.1:4517/');
  await p.evaluate((props) => { localStorage.clear(); return window.mountHC(props); }, opts.props || { lang: 'uz' });
  await p.waitForSelector('.hc-root textarea.hc-code', { timeout: 10000 });
  await p.waitForTimeout(300);
  return { b, p, errs, ctx };
}

// Textarea ↔ .hc-hl geometriya solishtiruvi
export async function geom(p) {
  return p.evaluate(() => {
    const ta = document.querySelector('.hc-code'), hl = document.querySelector('.hc-hl'), gut = document.querySelector('.hc-gutter');
    const cs = getComputedStyle(ta), hs = getComputedStyle(hl);
    const pick = (s) => ({ font: s.fontFamily.slice(0, 40), fs: s.fontSize, lh: s.lineHeight, pad: s.padding, ws: s.whiteSpace, tab: s.tabSize, ls: s.letterSpacing, ffs: s.fontFeatureSettings });
    return {
      ta: { ...pick(cs), scrollTop: ta.scrollTop, scrollLeft: ta.scrollLeft, sh: ta.scrollHeight, sw: ta.scrollWidth, ch: ta.clientHeight, cw: ta.clientWidth },
      hl: { ...pick(hs), scrollTop: hl.scrollTop, scrollLeft: hl.scrollLeft, sh: hl.scrollHeight, sw: hl.scrollWidth, ch: hl.clientHeight, cw: hl.clientWidth },
      gut: { scrollTop: gut.scrollTop, sh: gut.scrollHeight, lines: gut.textContent.split('\n').length },
      hlHtmlLen: hl.innerHTML.length,
    };
  });
}

export const setCode = async (p, code) => {
  await p.click('.hc-code');
  await p.keyboard.press('Control+A');
  await p.evaluate((code) => { document.execCommand('insertText', false, code); }, code);
  await p.waitForTimeout(150);
};
export const val = (p) => p.$eval('.hc-code', el => el.value);
export const sel = (p) => p.$eval('.hc-code', el => ({ s: el.selectionStart, e: el.selectionEnd, v: el.value }));
export const status = (p) => p.$eval('.hc-sb-pos', el => el.textContent).catch(() => null);
export const shot = (p, name) => p.screenshot({ path: `${HERE}/${name}` });
