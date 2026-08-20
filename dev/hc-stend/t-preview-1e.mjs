import { open, setCode, shot } from './t-lib.mjs';
const { b, p, errs } = await open();
const hl = () => p.evaluate(() => history.length);
console.log('start history.length', await hl());
for (let i = 0; i < 5; i++) { await setCode(p, '<h1>Salom ' + i + '</h1>'); await p.waitForTimeout(700); }
console.log('after 5 edits', await hl());
await setCode(p, '<p>self</p><script>setTimeout(()=>{location.href="https://example.com/"},100)</script>'); await p.waitForTimeout(1500);
console.log('after ext nav', await hl());
await setCode(p, '<p>self</p><script>setTimeout(()=>{location.href="https://example.com/?2"},100)</script>'); await p.waitForTimeout(1500);
console.log('after ext nav2', await hl());
// Endi top-level Back bosamiz — LMS'dagi kabi
await p.goBack().catch(e=>console.log('goBack err', e.message)); await p.waitForTimeout(800);
console.log('after top goBack: url', p.url(), 'frames', p.frames().map(f=>f.url()), 'root', await p.$('.hc-root') ? 'alive':'gone');
await b.close();
