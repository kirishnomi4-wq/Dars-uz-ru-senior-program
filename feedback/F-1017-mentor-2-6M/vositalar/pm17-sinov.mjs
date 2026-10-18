import { readFileSync } from 'node:fs';
const t = readFileSync('/home/kali/Desktop/internetLesson/src/4c-Modull/PmLesson17.jsx', 'utf8');
const st = t.match(/const KOD_STARTER = \{ uz: `([\s\S]*?)`, ru: `([\s\S]*?)` \};/);
const DATA = t.match(/const KOD_DATA = "(.*)";/)[1];
const exprs = [...t.matchAll(/check: C\.evalEquals\(`([\s\S]*?)`, '([^']*)'/g)].map(m => [m[1].replaceAll('${KOD_DATA}', DATA), m[2]]);
console.log('tekshiruvlar:', exprs.length);
for (const [til, kod] of [['uz', st[1]], ['ru', st[2]]]) {
  for (const [nom, k] of [['skelet', kod], ['yechim', kod.replace('if (false) {', 'if (kunlar + ish.kun > SIGIM) {')], ['>= xato', kod.replace('if (false) {', 'if (kunlar + ish.kun >= SIGIM) {')]]) {
    const res = exprs.map(([e, want]) => { try { const r = (0, eval)(k.replace(/console\.log\([^\n]*\n?/g, '') + '\n;' + e); return String(r) === want; } catch (x) { return 'XATO:' + x.message; } });
    console.log(til, nom, JSON.stringify(res));
  }
}
