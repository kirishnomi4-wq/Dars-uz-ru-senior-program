// ============================================================
//  react-merge — chiqish faylining BOSHIDAGI bir nechta `react` importini
//  BITTAGA birlashtiradi. build-lms.mjs va build-shared-module.mjs ishlatadi.
//
//  Nega kerak: esbuild har manba fayl uchun alohida `import … from "react"`
//  qoldiradi. Ikkalasi ham to'g'ri ESM, lekin LMS tomonda oddiy (regexli)
//  yuklovchi bo'lsa — bittasi e'tibordan qolishi mumkin.
//  FAQAT fayl BOSHIDAGI import-bloki tegiladi: dars matnidagi kod-namunalar
//  (`import …` yozilgan template-satr) o'z holicha qoladi.
// ============================================================
const IMPORT_LINE = /^import\s+(.+?)\s+from\s+["']react["'];?\s*$/;

export function mergeReactImports(code) {
  const lines = code.split('\n');
  let end = 0;                                   // import-blokining oxiri
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '' || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) { end = i + 1; continue; }
    if (/^import\s/.test(t)) { end = i + 1; continue; }
    break;                                       // birinchi «haqiqiy» kod — to'xtaymiz
  }

  const defaults = [];                           // `React`
  const named = [];                              // `useState as useState2`
  let first = -1;

  for (let i = 0; i < end; i++) {
    const m = IMPORT_LINE.exec(lines[i].trim());
    if (!m) continue;
    if (first === -1) first = i;
    lines[i] = null;                             // o'chiriladi, o'rniga birlashgani qo'yiladi
    const clause = m[1].trim();
    const br = clause.indexOf('{');
    const defPart = (br === -1 ? clause : clause.slice(0, br)).replace(/,\s*$/, '').trim();
    const namedPart = br === -1 ? '' : clause.slice(br + 1, clause.lastIndexOf('}'));
    if (defPart) defaults.push(defPart);
    for (const s of namedPart.split(',').map((x) => x.trim()).filter(Boolean)) {
      if (!named.includes(s)) named.push(s);
    }
  }
  if (first === -1) return code;                 // react importi yo'q — tegmaymiz

  // Bir nechta default bo'lsa: birinchisi default qoladi, qolganlari `default as X`
  const [d0, ...rest] = defaults;
  for (const d of rest) if (!named.includes(`default as ${d}`)) named.push(`default as ${d}`);
  const clause = [d0, named.length ? `{ ${named.join(', ')} }` : ''].filter(Boolean).join(', ');
  lines[first] = `import ${clause} from "react";`;

  return lines.filter((l) => l !== null).join('\n');
}
