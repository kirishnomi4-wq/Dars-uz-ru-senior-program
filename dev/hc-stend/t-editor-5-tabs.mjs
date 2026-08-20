import { open, setCode, sel, val, shot } from './t-lib.mjs';
const props = { lang: 'uz', storageKey: 'hcTest1', task: {
  title: 'Uch fayl', requirements: [{ tag: 'h1' }],
  files: [
    { name: 'index.html', lang: 'html', starter: '<h1>Boshi</h1>\n' },
    { name: 'style.css', lang: 'css', starter: 'h1 { color: red; }\n' },
    { name: 'script.js', lang: 'js', starter: 'console.log("hi");\n' },
  ] } };
const { b, p, errs } = await open({ props });
const log = (...a) => console.log(...a);
const tab = (n) => p.click(`.hc-tab:has-text("${n}")`);
const lang = () => p.$eval('.hc-sb-lang', el => el.textContent);
const hlCls = () => p.$eval('.hc-hl', el => [...new Set([...el.querySelectorAll('i')].map(i => i.className))].join(','));
log('5a initial:', JSON.stringify(await val(p)), 'lang', await lang(), 'hl', await hlCls(), 'krasivo?', !!(await p.$('.hc-ic.wide')));
// edit html
await p.click('.hc-code'); await p.keyboard.press('Control+End'); await p.keyboard.type('<p>yangi</p>');
await tab('style.css');
await p.waitForTimeout(100);
log('5a css tab:', JSON.stringify(await val(p)), 'lang', await lang(), 'hl', await hlCls(), 'krasivo?', !!(await p.$('.hc-ic.wide')), 'status', await p.$eval('.hc-sb-pos', e => e.textContent), 'file', await p.$eval('.hc-sb-file', e => e.textContent));
// focus after tab switch?
log('5a focus after tab click:', await p.evaluate(() => document.activeElement.className));
await p.click('.hc-code'); await p.keyboard.press('Control+End'); await p.keyboard.type('p { color: blue }');
// menu in css: type `<`
await p.keyboard.type('\n<');
log('5a css `<` menu?', !!(await p.$('.hc-menu')));
await p.keyboard.press('Backspace');
// css brace pair + Enter
await p.keyboard.type('.a {');
log('5a css brace:', JSON.stringify((await sel(p)).v.slice(-8)));
await p.keyboard.press('Enter');
log('5a css brace Enter:', JSON.stringify((await sel(p)).v.slice(-12)), JSON.stringify(await sel(p)).slice(0, 20));
await tab('script.js');
await p.waitForTimeout(100);
log('5a js tab:', JSON.stringify(await val(p)), 'lang', await lang(), 'hl', await hlCls());
await p.click('.hc-code'); await p.keyboard.press('Control+End');
await p.keyboard.type("let s = 'o'");
log('5a js quote pair (o\')…:', JSON.stringify((await sel(p)).v.slice(-12)));
await p.keyboard.type("zim");
log('5a js apostrophe mid-word:', JSON.stringify((await sel(p)).v.slice(-14)));
await p.keyboard.type("';\nfoo(");
log('5a js paren:', JSON.stringify((await sel(p)).v.slice(-6)));
await p.keyboard.type(')');
log('5a js paren overtype:', JSON.stringify((await sel(p)).v.slice(-6)));
await p.keyboard.type('\n(');
await p.keyboard.press('Backspace');
log('5a js Backspace pair:', JSON.stringify((await sel(p)).v.slice(-4)));
// selection wrap
await p.keyboard.type('salom');
await p.keyboard.down('Shift'); for (let i = 0; i < 5; i++) await p.keyboard.press('ArrowLeft'); await p.keyboard.up('Shift');
await p.keyboard.type('"');
log('5a js wrap selection:', JSON.stringify((await sel(p)).v.slice(-8)));
// back to html: content kept?
await tab('index.html');
await p.waitForTimeout(100);
log('5b html kept:', JSON.stringify(await val(p)));
await tab('style.css');
log('5b css kept:', JSON.stringify(await val(p)));
// storage
await p.waitForTimeout(600);
const ls = await p.evaluate(() => localStorage.getItem('hcTest1'));
log('5c localStorage:', ls && ls.slice(0, 120));
// reload → mount same props → codes restored?
await p.reload();
await p.evaluate((props) => window.mountHC(props), props);
await p.waitForSelector('.hc-code');
await p.waitForTimeout(200);
log('5c after reload html:', JSON.stringify(await val(p)));
await tab('script.js'); log('5c after reload js:', JSON.stringify(await val(p)));
log('5c active tab after reload:', await p.$eval('.hc-tab.active', e => e.textContent));
// reset: current tab js. Click Qaytadan → armed → click again → all files reset?
await tab('style.css');
await p.click('.hc-ghost:has-text("Qaytadan")');
log('5d armed text:', await p.$eval('.hc-ghost.armed', e => e.textContent), 'status', await p.$eval('.hc-status', e => e.textContent));
await shot(p, 'e5d-armed.png');
await p.click('.hc-ghost.armed');
await p.waitForTimeout(100);
log('5d after reset css:', JSON.stringify(await val(p)));
await tab('index.html'); log('5d after reset html:', JSON.stringify(await val(p)));
await tab('script.js'); log('5d after reset js:', JSON.stringify(await val(p)));
log('5d status:', await p.$eval('.hc-status', e => e.textContent));
await p.click('.hc-undo');
await p.waitForTimeout(100);
log('5d restored js:', JSON.stringify(await val(p)));
await tab('index.html'); log('5d restored html:', JSON.stringify(await val(p)));
// arm then blur (click elsewhere) → disarm?
await p.click('.hc-ghost:has-text("Qaytadan")');
await p.click('.hc-code');
await p.waitForTimeout(100);
log('5d armed after blur?', !!(await p.$('.hc-ghost.armed')));
// arm then wait 4.1s
await p.click('.hc-ghost:has-text("Qaytadan")');
await p.waitForTimeout(4200);
log('5d armed after 4.2s?', !!(await p.$('.hc-ghost.armed')));
// reset → restore window 8s; after 8s restore gone; localStorage overwritten
await p.click('.hc-ghost:has-text("Qaytadan")'); await p.click('.hc-ghost.armed');
await p.waitForTimeout(8300);
log('5d restore btn after 8.3s?', !!(await p.$('.hc-undo')));
log('5d ls after reset:', (await p.evaluate(() => localStorage.getItem('hcTest1'))).slice(0, 100));
// Undo via Ctrl+Z after reset in current tab?
await p.click('.hc-code'); await p.keyboard.press('Control+z');
log('5d Ctrl+Z after reset:', JSON.stringify(await val(p)));
// task change (different file set) with same storageKey → fresh
await p.evaluate((props) => window.mountHC({ ...props, task: { ...props.task, files: props.task.files.slice(0, 2) } }), props);
await p.waitForTimeout(200);
log('5e task changed → codes:', JSON.stringify(await val(p)));
// storage saved per file including reset — fine
// tabs keyboard access: Tab key from textarea → focus goes? (Tab consumed) — check Shift+Tab from textarea escapes?
await p.click('.hc-code'); await p.keyboard.press('Shift+Tab');
log('5f Shift+Tab focus:', await p.evaluate(() => document.activeElement.className));
// hc-tab buttons have type? aria?
log('5f tab btn attrs:', await p.$$eval('.hc-tab', els => els.map(e => ({ type: e.getAttribute('type'), aria: e.getAttribute('aria-selected'), role: e.getAttribute('role') }))));
log('ERRS', errs);
await b.close();
