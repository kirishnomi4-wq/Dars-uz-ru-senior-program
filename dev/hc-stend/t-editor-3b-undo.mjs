import { open, setCode, sel, val } from './t-lib.mjs';
const { b, p } = await open();
await setCode(p, '');
await p.waitForTimeout(600); // break coalescing
await p.keyboard.type('salom dunyo yaxshi');
await p.keyboard.press('Control+z');
console.log('typed 18 chars, Ctrl+Z x1 →', JSON.stringify(await val(p)));
await p.keyboard.press('Control+z');
console.log('x2 →', JSON.stringify(await val(p)));
// plain textarea reference
await p.evaluate(() => { const t = document.createElement('textarea'); t.id = 'ref'; document.body.appendChild(t); t.focus(); });
await p.keyboard.type('salom dunyo yaxshi');
await p.keyboard.press('Control+z');
console.log('plain textarea Ctrl+Z x1 →', JSON.stringify(await p.$eval('#ref', el => el.value)));
// Tab then Ctrl+Z after real typing
await p.click('.hc-code');
await p.keyboard.press('Control+A'); await p.keyboard.press('Delete');
await p.waitForTimeout(600);
await p.keyboard.type('abc');
await p.waitForTimeout(600);
await p.keyboard.press('Tab');
await p.keyboard.press('Control+z');
console.log('abc, Tab, Ctrl+Z →', JSON.stringify(await sel(p)));
// Enter then Ctrl+Z
await p.keyboard.press('Control+A'); await p.keyboard.press('Delete');
await p.keyboard.type('  abc');
await p.waitForTimeout(600);
await p.keyboard.press('Enter');
await p.keyboard.type('def');
await p.keyboard.press('Control+z');
console.log('  abc, Enter, def, Ctrl+Z →', JSON.stringify(await sel(p)));
await p.keyboard.press('Control+z');
console.log('Ctrl+Z x2 →', JSON.stringify(await sel(p)));
// Ctrl+Z when nothing: history empty → value? (React controlled)
// Redo after typing new text should be empty
await p.keyboard.type('Z');
await p.keyboard.press('Control+y');
console.log('type Z, Ctrl+Y →', JSON.stringify(await val(p)));
// Ctrl+Shift+Z redo?
await p.keyboard.press('Control+z');
await p.keyboard.press('Control+Shift+z');
console.log('Ctrl+Z, Ctrl+Shift+Z →', JSON.stringify(await val(p)));
// undo past the reset? Reset uses setCodes → history contains old… test: type, Zanovo x2, Ctrl+Z
await p.keyboard.press('Control+A'); await p.keyboard.press('Delete');
await p.keyboard.type('<h1>Mening</h1>');
await p.click('.hc-ghost:has-text("Qaytadan")');
await p.click('.hc-ghost:has-text("Rostdanmi")');
await p.waitForTimeout(100);
console.log('after reset:', JSON.stringify(await val(p)), 'restore btn?', !!(await p.$('.hc-undo')));
await p.click('.hc-code');
await p.keyboard.press('Control+z');
console.log('Ctrl+Z after reset →', JSON.stringify(await val(p)));
await p.click('.hc-undo').catch(()=>console.log('no restore btn'));
console.log('restore btn →', JSON.stringify(await val(p)));
await b.close();
