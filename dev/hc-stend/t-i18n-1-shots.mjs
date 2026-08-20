// i18n sinovi 1 — har ikki tilda, bir nechta enlarda ekran-holatlarini skrinshot qiladi
// va ko'rinadigan matnlarni + kesilish (overflow) holatini yig'adi.
import { open, setCode, shot, HERE } from './t-lib.mjs';
import { writeFileSync } from 'node:fs';

const LANGS = ['uz', 'ru'];
const WIDTHS = [1400, 1100, 768, 480];
const report = [];
const log = (...a) => { const s = a.join(' '); console.log(s); report.push(s); };

// Ko'rinadigan matn + kesilish tekshiruvi
const collect = (p) => p.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const ov = (el) => el && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1);
  const txt = (s) => q(s).map((e) => e.textContent.trim());
  const cut = (s) => q(s).filter(ov).map((e) => `${s}:«${e.textContent.trim().slice(0, 60)}» sw=${e.scrollWidth} cw=${e.clientWidth} sh=${e.scrollHeight} ch=${e.clientHeight}`);
  const root = document.querySelector('.hc-root');
  return {
    eyebrow: txt('.hc-eyebrow'), title: txt('.hc-title'), brief: txt('.hc-brief'),
    count: txt('.hc-count'), chips: txt('.hc-chip'), chipTitles: q('.hc-chip').map((e) => e.title),
    err: txt('.hc-err'), hint: txt('.hc-hint'), note: txt('.hc-note'),
    status: txt('.hc-status'), next: txt('.hc-next'), nextTitle: q('.hc-next').map((e) => e.title),
    ghost: txt('.hc-ghost'), ghostTitles: q('.hc-ghost').map((e) => e.title),
    tabs: txt('.hc-tab'), tools: q('.hc-ic').map((e) => `${e.textContent.trim()}|${e.title}|${e.getAttribute('aria-label')}`),
    mini: txt('.hc-mini'), paneName: txt('.hc-pane-name'), live: txt('.hc-live,.hc-stale'),
    sb: txt('.hc-statusbar'), sbTitles: q('.hc-sb-btn').map((e) => e.title),
    divider: q('.hc-divider').map((e) => e.title), panetabs: txt('.hc-panetabs button'),
    placeholder: q('.hc-code').map((e) => e.placeholder), menuTip: txt('.hc-menu-tip'),
    menu: q('.hc-menu-row').map((e) => e.textContent.trim()),
    consoleEmpty: txt('.hc-console-empty'), consoleTitle: txt('.hc-console-title'), consoleClear: txt('.hc-console-clear'),
    keys: txt('.hc-key'), keysTitle: q('.hc-key').map((e) => e.title).filter(Boolean),
    iframeTitle: q('iframe').map((e) => e.title),
    cut: [...cut('.hc-err'), ...cut('.hc-hint'), ...cut('.hc-note'), ...cut('.hc-chip'), ...cut('.hc-next'), ...cut('.hc-ghost'), ...cut('.hc-status span'), ...cut('.hc-mini'), ...cut('.hc-tab'), ...cut('.hc-menu-d'), ...cut('.hc-panetabs button'), ...cut('.hc-brief'), ...cut('.hc-title'), ...cut('.hc-stale'), ...cut('.hc-live'), ...cut('.hc-sb-pos'), ...cut('.hc-msg')],
    rootOverflow: root ? { sw: root.scrollWidth, cw: root.clientWidth, sh: root.scrollHeight, ch: root.clientHeight } : null,
    docOverflow: { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth },
  };
});

const dump = (tag, r) => {
  log(`\n#### ${tag}`);
  for (const [k, v] of Object.entries(r)) {
    if (Array.isArray(v) && v.length === 0) continue;
    log(`  ${k}: ${JSON.stringify(v)}`);
  }
};

const JS_TASK = {
  eyebrow: { uz: 'JS praktika', ru: 'JS практика' },
  title: { uz: 'Tugma sanasin', ru: 'Пусть кнопка считает' },
  brief: { uz: 'Tugma bosilganda son oshsin.', ru: 'При нажатии число растёт.' },
  files: [
    { name: 'index.html', lang: 'html', starter: '<button id="b">+1</button>\n<p id="out">0</p>\n' },
    { name: 'style.css', lang: 'css', starter: '' },
    { name: 'app.js', lang: 'js', starter: { uz: '// bu yerga yozing\n', ru: '// пишите здесь\n' } },
  ],
  requirements: [
    { tag: 'button', text: true },
    { css: { sel: 'button', prop: 'color' } },
    { js: /addEventListener/ },
    { logs: 5 },
    { click: '#b', read: '#out', expect: '1' },
    { toggle: '#b', read: '#out', a: 'on', b: 'off' },
    { eval: 'typeof f', equals: 'function' },
    { tag: 'ul', child: 'li' },
    { tag: 'li', count: 3 },
    { tag: 'img', attrs: ['src', 'alt'] },
    { tag: 'a', attr: 'href' },
    { tag: 'a', attr: 'target', equals: '_blank' },
    { css: { sel: 'p', prop: 'color', value: 'red' } },
    { foo: 1 },
  ],
};

for (const width of WIDTHS) {
  for (const lang of LANGS) {
    const { b, p, errs, ctx } = await open({ props: { lang }, context: { viewport: { width, height: 900 } } });
    const T = `${lang}-${width}`;
    // 1) bo'sh holat
    dump(`${T} · bo'sh`, await collect(p));
    await shot(p, `i18n-${T}-1-empty.png`);
    // 2) sintaksis xatosi
    await setCode(p, '<h1>Salom</h2>\n<p>matn\n<img src="a.png" alt="x">');
    await p.click('body', { position: { x: 5, y: 5 } }).catch(() => {});
    await p.waitForTimeout(1200);
    dump(`${T} · xato`, await collect(p));
    await shot(p, `i18n-${T}-2-error.png`);
    // 3) shartlar bajarilgan, lekin sintaksis qoldi
    await setCode(p, '<h1>Salom</h1>\n<p>matn</p>\n<img src="a.png" alt="x">\n<b>ochiq');
    await p.click('body', { position: { x: 5, y: 5 } }).catch(() => {});
    await p.waitForTimeout(1200);
    dump(`${T} · blockedBySyntax`, await collect(p));
    await shot(p, `i18n-${T}-3-blocked.png`);
    // 4) hammasi o'tdi
    await setCode(p, '<h1>Salom</h1>\n<p>matn</p>\n<img src="a.png" alt="x">');
    await p.waitForTimeout(1200);
    dump(`${T} · o'tdi`, await collect(p));
    await shot(p, `i18n-${T}-4-pass.png`);
    // 5) taklif-ro'yxati
    await setCode(p, '');
    await p.keyboard.type('<');
    await p.waitForTimeout(300);
    dump(`${T} · menu`, await collect(p));
    await shot(p, `i18n-${T}-5-menu.png`);
    await p.keyboard.press('Escape');
    // 6) atribut-menyu
    await setCode(p, '');
    await p.keyboard.type('<img ');
    await p.waitForTimeout(300);
    dump(`${T} · attrmenu`, await collect(p));
    await shot(p, `i18n-${T}-6-attrmenu.png`);
    await p.keyboard.press('Escape');
    // 7) Qaytadan (1-bosish → ogohlantirish; 2-bosish → tozalandi+Qaytarish)
    await setCode(p, '<h1>Salom</h1>');
    const ghosts = await p.$$('.hc-ghost');
    const resetBtn = ghosts[ghosts.length - 1];
    await resetBtn.click(); await p.waitForTimeout(200);
    dump(`${T} · reset-armed`, await collect(p));
    await shot(p, `i18n-${T}-7-reset-armed.png`);
    await resetBtn.click(); await p.waitForTimeout(200);
    dump(`${T} · reset-done`, await collect(p));
    await shot(p, `i18n-${T}-8-reset-done.png`);
    // 8) Chiroyli — allaqachon chiroyli / sintaksis xatosi
    await setCode(p, '<h1>Salom</h1>');
    await p.click('.hc-ic.wide'); await p.waitForTimeout(200);
    dump(`${T} · prettify-already`, await collect(p));
    await shot(p, `i18n-${T}-9-pretty-note.png`);
    await setCode(p, '<h1>Salom');
    await p.click('.hc-ic.wide'); await p.waitForTimeout(200);
    dump(`${T} · prettify-syntax`, await collect(p));
    await shot(p, `i18n-${T}-9b-pretty-syntax.png`);
    if (errs.length) log(`  ERRS(${T}): ${JSON.stringify(errs.slice(0, 5))}`);
    await b.close();

    // JS-task: konsol, stale/live, deklarativ label/hint
    if (width === 1400 || width === 768) {
      const o2 = await open({ props: { lang, task: JS_TASK }, context: { viewport: { width, height: 900 } } });
      await o2.p.waitForTimeout(1500);
      dump(`${T} · js-task boshi`, await collect(o2.p));
      await shot(o2.p, `i18n-${T}-10-js-task.png`);
      // hover har chipni — hint (title) allaqachon collect'da; stale nishoni:
      await o2.p.click('.hc-tab:nth-child(3)').catch(() => {});
      await o2.p.click('.hc-code'); await o2.p.keyboard.type('x'); await o2.p.waitForTimeout(600);
      dump(`${T} · js-task stale`, await collect(o2.p));
      await shot(o2.p, `i18n-${T}-11-js-stale.png`);
      // Har chip uchun hint (title) — alohida ro'yxat
      await o2.b.close();
    }
  }
}
// previewUrl + placeholder + tr(starter obj)
for (const lang of LANGS) {
  const { b, p } = await open({ props: { lang, task: { title: { uz: 'Sayt', ru: 'Сайт' }, previewUrl: 'olx.uz', placeholder: { uz: '<h1>Nom</h1>', ru: '<h1>Имя</h1>' }, requirements: [{ tag: 'h1', text: true }] } } });
  dump(`${lang} · previewUrl`, await collect(p));
  await shot(p, `i18n-${lang}-12-previewurl.png`);
  // rasm topilmadi fallback (iframe ichi)
  await setCode(p, '<h1>Salom</h1><img src="yoq.png" alt="mushuk">');
  await p.waitForTimeout(1500);
  const fb = await p.frames().find((f) => f !== p.mainFrame());
  const fbTxt = fb ? await fb.evaluate(() => (document.querySelector('.hc-imgfb') || {}).textContent || 'YO\'Q') : 'frame yo\'q';
  log(`  ${lang} · img-fallback iframe matni: «${fbTxt}» · lang attr: ${fb ? await fb.evaluate(() => document.documentElement.lang) : '?'}`);
  await shot(p, `i18n-${lang}-13-imgfb.png`);
  await b.close();
}
// sensor-panel (pointer: coarse)
for (const lang of LANGS) {
  const { b, p } = await open({ props: { lang }, context: { viewport: { width: 820, height: 1100 }, hasTouch: true, isMobile: true } });
  const coarse = await p.evaluate(() => matchMedia('(pointer: coarse)').matches);
  log(`\n${lang} · pointer:coarse = ${coarse}`);
  await p.click('.hc-code'); await p.keyboard.type('<'); await p.waitForTimeout(300);
  dump(`${lang}-touch`, await collect(p));
  await shot(p, `i18n-${lang}-14-touch.png`);
  await b.close();
}
writeFileSync(`${HERE}/t-i18n-1-out.txt`, report.join('\n'));
console.log('\nDONE →', `${HERE}/t-i18n-1-out.txt`);
