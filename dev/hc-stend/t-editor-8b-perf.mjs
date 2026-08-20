import { open, setCode, val } from './t-lib.mjs';
const { b, p } = await open();
const measure = async (label) => {
  await p.keyboard.press('Control+End');
  // measure inside page: time between keydown and next paint via input event → rAF
  const res = await p.evaluate(async () => {
    const ta = document.querySelector('.hc-code'); const times = [];
    for (let i = 0; i < 15; i++) {
      const t0 = performance.now();
      document.execCommand('insertText', false, 'a');
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    return { median: times[7].toFixed(1), max: times[14].toFixed(1) };
  });
  console.log(label, (await val(p)).length, 'chars → ms/insert (median/max):', JSON.stringify(res));
};
await setCode(p, '<p>x</p>'); await measure('small');
await setCode(p, Array.from({ length: 150 }, (_, i) => `<p class="c${i}">qator ${i} matn</p>`).join('\n')); await measure('5k');
await setCode(p, Array.from({ length: 400 }, (_, i) => `<p class="c${i}">qator ${i} matn</p>`).join('\n')); await measure('14k');
await setCode(p, Array.from({ length: 700 }, (_, i) => `<p class="c${i}">qator ${i} matn</p>`).join('\n')); await measure('24k(no hl)');
await b.close();
