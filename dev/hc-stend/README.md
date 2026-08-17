# HC-stend — kompilyatorni yakka holda sinash stendi

- Manba: `src/compilator/HtmlCompiler.jsx` (TAHRIRLANMAYDI — faqat sinov)
- Yig'ish: `node dev/hc-stend/build.mjs` → bundle.js (React 19 + kompilyator, IIFE)
- Server: `node dev/hc-stend/serve.mjs` → http://127.0.0.1:4517/  (allaqachon ishlab turibdi)
- Sahifada: `window.mountHC({ task, starterCode, storageKey, lang })` — kompilyatorni ochadi
  (onContinue/onBack chaqiriqlari `window.__events` ga tushadi), `window.unmountHC()`,
  `window.HC` = { HtmlCompiler, checks, highlight, formatHtml }, `window.React`.
- Playwright: `import { chromium } from 'playwright-core'` + `chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })`
  namuna: `dev/hc-stend/probe.mjs`. Skrinshotlar shu papkaga.
- Selektorlar: `.hc-root`, `textarea.hc-code`, `.hc-top` (shart-chiplari `.hc-chip`, `.hc-chip.ok`),
  `.hc-bottom` (tugmalar), iframe = natija.
