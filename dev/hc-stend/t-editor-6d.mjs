import { open } from './t-lib.mjs';
const props = { lang: 'uz', task: { title: 'Uch fayl', requirements: [{ tag: 'h1' }], files: [
  { name: 'index.html', lang: 'html', starter: '<h1>Boshi</h1>\n' }, { name: 'style.css', lang: 'css', starter: 'h1{}' }, { name: 'script.js', lang: 'js', starter: '' } ] } };
const { b, p } = await open({ props, context: { viewport: { width: 1366, height: 768 } } });
const r = await p.$eval('.hc-tabs-bar', e => e.getBoundingClientRect());
await p.screenshot({ path: 'e6g-1366-tabs.png', clip: { x: r.x, y: r.y, width: r.width, height: r.height } });
await b.close();
