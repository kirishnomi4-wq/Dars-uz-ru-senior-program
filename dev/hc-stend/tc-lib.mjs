// [tc-* = tekshiruv-motori sinovlari] Umumiy yordamchi: brauzer ochadi, HtmlCompiler.jsx ichki
// (export qilinmagan) funksiyalarini manbadan kesib olib sahifaga in'ektsiya qiladi ->
// window.__X.{lintHtml,parseCss,checks,specToCheck,buildLabel,normalizeReq,runOne,mkCtx,tr,setLang,...}
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const SRC = readFileSync('C:/Users/ADMIN/internetLesson/src/compilator/HtmlCompiler.jsx', 'utf8');
const lines = SRC.split('\n');
function slice(startRe, endRe) {
  const s = lines.findIndex(l => startRe.test(l)); if (s < 0) throw new Error('start ' + startRe);
  let e = lines.findIndex((l, i) => i >= s && endRe.test(l) && (i > s || String(startRe) === String(endRe))); if (e < 0) throw new Error('end ' + endRe);
  return lines.slice(s, e + 1).join('\n');
}
const parts = [
  slice(/^let __lang = 'uz';/, /^};/),                       // tr
  slice(/^const norm = /, /^const norm = /),
  slice(/^const stripJsComments/, /^};/),
  slice(/^const checks = \{/, /^};/),
  slice(/^function specToCheck/, /^}/),
  slice(/^function buildLabel/, /^}/),
  slice(/^function normalizeReq/, /^}/),
  slice(/^function parseCss/, /^}/),
  slice(/^const VOID_TAGS/, /^\]\);/),
  slice(/^const OPTIONAL_CLOSE/, /^const OPTIONAL_CLOSE/),
  slice(/^const BLOCK_TAGS/, /^\]\);/),
  slice(/^function closesOnOpen/, /^}/),
  slice(/^const TEXT_TAGS/, /^\]\);/),
  slice(/^const inTextTag/, /^};/),
  slice(/^function lintHtml/, /^}/),
  slice(/^function runOne/, /^}/),
  slice(/^const CONSOLE_FORWARD/, /^<[\\][\/]script>`;/),
  slice(/^const buildHarness/, /^<[\\][\/]script>`;/),
  slice(/^const baseStyle/, /^  \.hc-imgfb code/),
  slice(/^const IMG_FALLBACK/, /^<[\\][\/]script>`;/),
  slice(/^const wrapDoc/, /^<[\/]html>`;/),
];
export const INJECT = `window.__X = (function(){ const isValidElement = (n) => !!(n && n.$$typeof);
${parts.join('\n')}
function mkCtx(html, css, js){
  const parsed = new DOMParser().parseFromString(html || '', 'text/html');
  return { html, css, js, doc: parsed,
    $: (s) => { try { return parsed.querySelector(s); } catch { return null; } },
    $$: (s) => { try { return [...parsed.querySelectorAll(s)]; } catch { return []; } },
    cssRules: parseCss(css) };
}
return { tr, setLang:(l)=>{__lang=l;}, checks, specToCheck, buildLabel, normalizeReq, parseCss, lintHtml, closesOnOpen, inTextTag, runOne, mkCtx, stripJsComments, wrapDoc, buildHarness, CONSOLE_FORWARD };
})();`;
export async function open(opts = {}) {
  const b = await chromium.launch({ executablePath: process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const ctx = await b.newContext({ viewport: { width: 1400, height: 900 } });
  const p = await ctx.newPage();
  const log = [];
  p.on('pageerror', e => log.push('PAGEERROR ' + e.message));
  p.on('console', m => log.push(m.type() + ': ' + m.text()));
  await p.goto('http://127.0.0.1:4517/');
  await p.addScriptTag({ content: INJECT });
  return { b, p, log, ctx };
}
// UI orqali: task bilan mount, kodni to'g'ridan-to'g'ri React'ka yozish
export async function mount(p, props) {
  await p.evaluate((props) => { localStorage.clear(); return window.mountHC(props); }, props);
  await p.waitForSelector('.hc-root textarea.hc-code', { timeout: 10000 });
  await p.waitForTimeout(200);
}
export const setCode = async (p, code) => {
  await p.click('.hc-code');
  await p.keyboard.press('Control+A');
  await p.evaluate((code) => { document.execCommand('insertText', false, code); }, code);
};
export const chips = (p) => p.$$eval('.hc-chip', els => els.map(e => ({ ok: e.classList.contains('ok'), label: e.textContent.trim(), hint: e.title })));
export const errBox = (p) => p.$eval('.hc-err', el => el.textContent).catch(() => null);
export const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
