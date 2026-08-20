import { open } from './t-lib.mjs';
const props = { lang: 'uz', task: { title: 'Uch fayl', requirements: [{ tag: 'h1' }], files: [
  { name: 'index.html', lang: 'html', starter: '<h1>Boshi</h1>\n' }, { name: 'style.css', lang: 'css', starter: 'h1{}' }, { name: 'script.js', lang: 'js', starter: '' } ] } };
for (const w of [1024, 1100, 1280, 1366]) {
  const { b, p } = await open({ props, context: { viewport: { width: w, height: 768 } } });
  const r = await p.evaluate(() => { const t = document.querySelector('.hc-tabs').getBoundingClientRect(); return { paneW: Math.round(document.querySelector('.hc-editor-pane').getBoundingClientRect().width), tabsW: Math.round(t.width), vis: [...document.querySelectorAll('.hc-tab')].map(e => e.getBoundingClientRect().right <= t.right + 1) }; });
  console.log(w, JSON.stringify(r));
  await b.close();
}
