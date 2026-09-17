#!/usr/bin/env node
// lint-keys — darslarning javob-kaliti (INLINE_KEYS) bilan ball-ekranlari (SCREEN_META scored: true) bir xil to'plammi.
// F-0916-03 (2026-09-16): server `total_questions`ni kalitdagi `s<raqam>` qolipli savollardan hisoblaydi; ishtirok-kalitlar
// (`practice/kadrlar/joy/koding: -1`, s-qolipsiz) hisobga kirmaydi. Demak dars tomonida qoida:
//   QOIDA 1  s-qolipli kalitlar to'plami == scored:true ekranlar id-to'plami (yakuniy amaliy `s16: -1` ham scored bo'lishi shart);
//   QOIDA 2  ishtirok-kalit (-1) s-qolipda BO'LMASIN, agar ekran scored bo'lmasa (aks holda maxraj yana oshadi).
// Ishlatish: node scripts/lint-keys.mjs [fayl...]   (argumentsiz — src/ dagi INLINE_KEYS'li barcha darslar). Xato bo'lsa exit 1.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (n === 'node_modules' || n === 'eski' || n === 'live') continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.jsx')) out.push(p);
  }
  return out;
}

export function checkFile(file) {
  const src = readFileSync(file, 'utf8');
  const kl = /const INLINE_KEYS\s*=\s*\{([^}]*)\}/.exec(src);
  if (!kl) return null; // jonli modulsiz dars — tekshirilmaydi
  const keys = [...kl[1].matchAll(/([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(-?\d+)/g)].map((m) => ({ id: m[1], idx: Number(m[2]) }));
  const metaBody = (/SCREEN_META\s*=\s*\[([\s\S]*?)\n\];/.exec(src) || [])[1] || '';
  const scored = new Set([...metaBody.matchAll(/\{\s*id:\s*'([^']+)'[^}]*?scored:\s*true/g)].map((m) => m[1]));
  const sKeys = new Set(keys.filter((k) => /^s\d+[a-z]*$/i.test(k.id)).map((k) => k.id));
  const participation = keys.filter((k) => k.idx === -1 && !/^s\d+[a-z]*$/i.test(k.id)).map((k) => k.id);
  const errs = [];
  for (const id of scored) if (!sKeys.has(id)) errs.push(`scored ekran ${id} kalitda yo'q`);
  for (const id of sKeys) if (!scored.has(id)) errs.push(`kalit ${id} scored ekran emas (server maxrajga qo'shadi)`);
  return { file, scored: scored.size, sKeys: sKeys.size, participation, errs };
}

const args = process.argv.slice(2);
const files = args.length ? args : walk('src');
let n = 0, bad = 0;
for (const f of files) {
  const r = checkFile(f);
  if (!r) continue;
  n++;
  if (r.errs.length) { bad++; console.log(`✗ ${f}: scored ${r.scored} · s-kalit ${r.sKeys} — ${r.errs.join('; ')}`); }
}
console.log(`lint-keys: ${n} dars tekshirildi · nomos ${bad}`);
process.exit(bad ? 1 : 0);
