// ============================================================
//  codemod-ligatura — JetBrains Mono ligaturasini O'CHIRADI (F-0808-02 · F-0812-03 · F-0922-19).
//
//  MUAMMO: JetBrains Mono dasturchi-shrifti `===` `!==` `>=` `<=` `=>` `->` ni BITTA glifga
//  qo'shib chizadi. Bola kodda `===` yozilganini ko'rmaydi — boshqa belgi ko'radi.
//  Ildizdagi `font-feature-settings: "ss01","cv11"` meros bo'ladi, lekin ligaturani O'CHIRMAYDI.
//
//  YECHIM: har mono-e'lonning O'Z ichiga `font-feature-settings: "liga" 0, "calt" 0`.
//  🔴 `font-variant-ligatures` BILAN BIRGA yozilmaydi — Chrome unda butun qatorni tashlab ketadi.
//  🔴 Guruh-selektorga yozilmaydi — ro'yxat unutishga moyil (JsConditions'da 3 arena-selektori
//     tushib qolgan edi). Shuning uchun HAR e'lon alohida.
//
//  Ishlatish:
//    node scripts/codemod-ligatura.mjs --dry            → hisobot, fayl o'zgarmaydi
//    node scripts/codemod-ligatura.mjs                  → qo'yadi (7-Modul va arxiv TEGILMAYDI)
//    node scripts/codemod-ligatura.mjs --check          → qoldiq bormi (0 bo'lishi shart)
//    node scripts/codemod-ligatura.mjs <fayl…>          → faqat berilgan fayllar
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PROP = 'font-feature-settings: "liga" 0, "calt" 0;';
const JSPROP = `fontFeatureSettings: '"liga" 0, "calt" 0'`;
const SKIP_DIR = (n) => n === 'node_modules' || n.startsWith('.') || n.includes('eski') || n === '7-Modull';

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIR(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.jsx')) out.push(p);
  }
  return out;
}

// CSS: font-family: 'JetBrains Mono'[…];  |  …}  (nuqta-vergulsiz yakun — 1 hodisa bor)
const CSS = /font-family:\s*'JetBrains Mono'([^;}]*)(;|(?=\}))/g;
// JS inline: fontFamily: "'JetBrains Mono'…"
const JS = /fontFamily:\s*("[^"]*JetBrains Mono[^"]*")/g;

const args = process.argv.slice(2);
const dry = args.includes('--dry');
const check = args.includes('--check');
const files = args.filter((a) => !a.startsWith('--'));
const targets = files.length ? files : walk('src');

let fCss = 0, fJs = 0, touched = 0, already = 0, left = 0;
const samples = [];

for (const f of targets) {
  const src = readFileSync(f, 'utf8');
  let css = 0, js = 0;
  const out = src.split('\n').map((line) => {
    // --- CSS e'loni ---
    if (line.includes('JetBrains Mono') && line.includes('font-family')) {
      if (line.includes('liga" 0')) { already++; return line; }
      const next = line.replace(CSS, (m, tail, semi) => {
        css++; return `font-family: 'JetBrains Mono'${tail}; ${PROP}`;
      });
      if (next !== line) { if (samples.length < 3) samples.push([f, line.trim().slice(0, 120), next.trim().slice(0, 170)]); line = next; }
    }
    // --- JS inline uslubi ---
    if (line.includes('JetBrains Mono') && /fontFamily:/.test(line) && !line.includes('fontFeatureSettings')) {
      const next = line.replace(JS, (m, val) => { js++; return `fontFamily: ${val}, ${JSPROP}`; });
      if (next !== line) { if (samples.length < 5) samples.push([f, line.trim().slice(0, 120), next.trim().slice(0, 170)]); line = next; }
    }
    return line;
  }).join('\n');

  if (check) {
    const openCss = (src.match(CSS) || []).filter((m) => !m.includes('liga" 0')).length;
    const openJs = (src.match(JS) || []).length;
    // qoldiq: e'lon bor, lekin o'sha qatorda liga yo'q
    const bad = src.split('\n').filter((l) => l.includes('JetBrains Mono') && (l.includes('font-family') || /fontFamily:/.test(l)) && !l.includes('liga" 0')).length;
    if (bad) { left += bad; console.log(`  ${f} → ${bad} ochiq`); }
    continue;
  }
  if (css || js) { fCss += css; fJs += js; touched++; if (!dry) writeFileSync(f, out); }
}

if (check) { console.log(left ? `\n🔴 QOLDIQ: ${left} e'lon` : '✅ QOLDIQ YO\'Q — hamma mono-e\'loni yopiq'); process.exit(left ? 1 : 0); }

console.log(`\nfayl ko'rildi: ${targets.length} · tegilgan: ${touched}`);
console.log(`CSS e'loni: ${fCss} · JS inline: ${fJs} · allaqachon yopiq edi: ${already}`);
if (samples.length) { console.log('\nnamunalar:'); for (const [f, a, b] of samples) console.log(`  ${f}\n   ESKI: ${a}\n   YANGI: ${b}`); }
console.log(dry ? '\n(--dry: fayl O\'ZGARMADI)' : '\n✅ yozildi');
