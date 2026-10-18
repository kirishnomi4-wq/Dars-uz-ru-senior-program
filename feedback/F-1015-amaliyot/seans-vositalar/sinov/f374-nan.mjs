// F-1015-374 · jim NaN: matn ichida qo'shtirnoq yopilib, ikki matn orasida * - / % < > qolgan joylar ("— <Route path="*"> …" → NaN). esbuild JSX→JS, acorn AST.
// Chaqirish: node …/f374-nan.mjs <fayl...>   (acorn — global @nestjs/cli ichidagi nusxa)
import { transformSync } from 'esbuild';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const acorn = req('/usr/local/lib/node_modules/@nestjs/cli/node_modules/acorn/dist/acorn.js');
const OPS = new Set(['*', '-', '/', '%', '<', '>', '<=', '>=', '**']);
const isStr = (n) => n && ((n.type === 'Literal' && typeof n.value === 'string') || n.type === 'TemplateLiteral');
let jami = 0;
for (const f of process.argv.slice(2)) {
  let code; try { code = transformSync(readFileSync(f, 'utf8'), { loader: 'jsx', jsx: 'transform', sourcemap: false }).code; } catch (e) { console.log('ESBUILD', f, e.message.slice(0, 80)); continue; }
  const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
  const stack = [ast];
  while (stack.length) {
    const n = stack.pop(); if (!n || typeof n.type !== 'string') continue;
    if (n.type === 'BinaryExpression' && OPS.has(n.operator) && (isStr(n.left) || isStr(n.right)) && (isStr(n.left) ? n.right.type !== 'Identifier' : true)) {
      const l = isStr(n.left) && isStr(n.right);
      if (l || ['*', '/', '%', '**'].includes(n.operator)) { jami++; console.log(`${f}: «${code.slice(n.start, Math.min(n.end, n.start + 110)).replace(/\n/g, ' ')}»`); }
    }
    for (const k of Object.keys(n)) { const v = n[k]; if (Array.isArray(v)) v.forEach(x => x && typeof x.type === 'string' && stack.push(x)); else if (v && typeof v.type === 'string') stack.push(v); }
  }
}
console.log('topildi:', jami);
