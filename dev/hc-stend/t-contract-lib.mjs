// t-contract-* umumiy yordamchi (contract.html + bundle-contract.js)
import { chromium } from 'playwright-core';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export async function open() {
  const b = await chromium.launch({ executablePath: CHROME, headless: true });
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const log = [];
  p.on('pageerror', e => log.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') log.push(m.type().toUpperCase() + ' ' + m.text().slice(0, 300)); });
  await p.goto('http://127.0.0.1:4517/contract.html');
  await p.evaluate(() => localStorage.clear());
  return { b, p, log, ctx, take: () => log.splice(0) };
}
export async function mount(p, props = {}, opts = {}, id = 'root') {
  // props/opts: obyekt YOKI JS-manba satri (sahifada baholanadi: C=window.HC.checks, React, h=React.createElement)
  await p.evaluate(({ props, opts, id }) => {
    const ev = (x) => (typeof x === 'string' ? new Function('C', 'React', 'h', 'return (' + x + ')')(window.HC.checks, window.React, window.React.createElement) : x);
    return window.mountAt(id, ev(props), ev(opts));
  }, { props, opts, id });
  await p.waitForSelector('#' + id + ' .hc-root', { timeout: 8000 });
  await p.waitForTimeout(250);
}
export const rerender = async (p, props, id = 'root') => {
  await p.evaluate(({ props, id }) => { const ev = (x) => (typeof x === 'string' ? new Function('C', 'React', 'h', 'return (' + x + ')')(window.HC.checks, window.React, window.React.createElement) : x); return window.rerenderAt(id, ev(props)); }, { props, id });
  await p.waitForTimeout(250);
};
export const unmount = (p, id = 'root') => p.evaluate((id) => window.unmountAt(id), id);
export const setCode = async (p, code, id = 'root') => {
  await p.click(`#${id} .hc-code`); await p.keyboard.press('Control+A');
  await p.evaluate((code) => { document.execCommand('insertText', false, code); }, code);
};
export const val = (p, id = 'root') => p.$eval(`#${id} .hc-code`, el => el.value);
export const chips = (p, id = 'root') => p.$$eval(`#${id} .hc-chip`, els => els.map(e => ({ ok: e.classList.contains('ok'), label: e.textContent.trim(), hint: e.title })));
export const state = (p, id = 'root') => p.evaluate((id) => {
  const r = document.querySelector(`#${id} .hc-root`); if (!r) return null;
  const q = (s) => r.querySelector(s);
  return {
    eyebrow: q('.hc-eyebrow')?.textContent ?? null, title: q('.hc-title')?.textContent ?? null, brief: q('.hc-brief')?.textContent ?? null,
    count: q('.hc-count')?.textContent, tabs: [...r.querySelectorAll('.hc-tab')].map(t => t.textContent),
    nextDisabled: q('.hc-next')?.disabled, nextText: q('.hc-next')?.textContent, hasBack: !!q('.hc-bottom .hc-ghost:first-child') && r.querySelector('.hc-bottom').firstElementChild.textContent.includes('←'),
    status: q('.hc-status')?.textContent, msg: q('.hc-msg')?.textContent, placeholder: q('.hc-code')?.placeholder,
    paneName: q('.hc-pane-name')?.textContent ?? null, url: q('.hc-url')?.textContent ?? null, console: !!q('.hc-console'),
    firstBottom: r.querySelector('.hc-bottom').firstElementChild.textContent,
  };
}, id);
export const ls = (p) => p.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])));
export const events = (p) => p.evaluate(() => window.__events.splice(0));
export const R = (name, ok, detail = '') => console.log(`${ok ? '✓' : '✗'} ${name}${detail ? '  — ' + detail : ''}`);
