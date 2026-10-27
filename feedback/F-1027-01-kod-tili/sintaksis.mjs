// Tez sintaksis-tekshiruv (esbuild transform). node sintaksis.mjs <jsx>…
import { readFileSync } from 'node:fs'; import { createRequire } from 'node:module';
const { transformSync } = createRequire(process.cwd() + '/package.json')('esbuild');
let bad = 0; for (const f of process.argv.slice(2)) { try { transformSync(readFileSync(f, 'utf8'), { loader: 'jsx' }); } catch (e) { bad++; console.log('✗', f, e.message.split('\n')[0]); } }
console.log(bad ? `XATO ${bad}` : `✓ ${process.argv.length - 2} fayl toza`);
