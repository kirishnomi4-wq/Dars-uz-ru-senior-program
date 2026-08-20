import { open, mount, setCode, val, state } from './t-contract-lib.mjs';
const { b, p, take } = await open();
const TASK = (t) => `({ lang:'${t}', task:{ title:'T', requirements:[] } })`;
await mount(p, TASK('uz'), '({})', 'A'); await mount(p, TASK('ru'), '({})', 'B');
await setCode(p, '<p>x</p>', 'B'); await p.waitForTimeout(900);          // B fokus, B oxirgi render (ru)
await setCode(p, '<p>y</p>', 'A'); await p.waitForTimeout(900);          // A yozildi → A oxirgi render (__lang=uz)
// B'ning ✨ tugmasi: onMouseDown preventDefault — fokus A'da qoladi, B render bo'lmaydi → note tr() __lang=uz o'qiydi
await p.click('#B .hc-ic.wide'); await p.waitForTimeout(150);
console.log('B(ru) ✨ note matni:', JSON.stringify((await state(p, 'B')).msg));
await b.close();
