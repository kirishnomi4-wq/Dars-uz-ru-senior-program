// F-1028-01 (28.10) — LMS'dagi modullar jadvali: lms-modullar-20261028.json → jadval.html → PNG.
// Hisob: dars = Class + Demo Day (Active) · haftasiga 3 dars · 1 oy = 13 dars (≈ 4,33 hafta). «Sinov darslari» muddatga kirmaydi.
// Ishlatish (repo ildizidan): node feedback/F-1028-01-lms-modullar/jadval.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const DIR = dirname(fileURLToPath(import.meta.url));
const d = JSON.parse(readFileSync(join(DIR, 'lms-modullar-20261028.json'), 'utf8'));
const HAFTA = 3, OY = 13;
const f1 = (x) => (Math.round(x * 10) / 10).toFixed(1).replace('.', ',').replace(/,0$/, '');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

let cum = 0;
const rows = d.modullar.map((m, i) => {
  const jami = m.class + m.demoday;
  const r = { n: i + 1, ...m, jami };
  if (m.muddatga === false) return r;
  const a = cum, b = cum + jami; cum = b;
  r.hafta = jami / HAFTA; r.oy = jami / OY;
  r.hf = [Math.floor(a / HAFTA) + 1, Math.ceil(b / HAFTA)];
  r.oyR = [Math.floor(a / OY) + 1, Math.ceil(b / OY)];
  return r;
});
const oq = rows.filter((r) => r.muddatga !== false);
const T = { cls: oq.reduce((s, r) => s + r.class, 0), dd: oq.reduce((s, r) => s + r.demoday, 0) };
T.jami = T.cls + T.dd; T.hafta = T.jami / HAFTA; T.oy = T.jami / OY;
const sinov = rows.filter((r) => r.muddatga === false);

const range = ([a, b], suf) => (a === b ? `${a}${suf}` : `${a}–${b}${suf}`);
const tr = (r) => {
  const sv = r.muddatga === false;
  const nom = `<b>${esc(r.uz)}</b>${r.ru && r.ru !== r.uz ? `<span class="ru">${esc(r.ru)}</span>` : ''}`;
  const dd = r.demoday ? `<span class="dd">${esc(r.dd)}</span>` : '<span class="mut">—</span>';
  return `<tr class="${sv ? 'sv' : ''}"><td class="n">${r.n}</td><td>${nom}</td><td class="c">${r.class}</td><td>${dd}</td><td class="c j">${r.jami}</td>`
    + (sv ? '<td colspan="3" class="mut">muddatga kirmaydi (kirish darslari)</td>'
      : `<td>≈ ${f1(r.hafta)} hafta <span class="mut">(${f1(r.oy)} oy)</span></td><td class="c">${range(r.hf, '')}</td><td class="c oy">${range(r.oyR, '-oy')}</td>`) + '</tr>';
};

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box} body{margin:0;background:#fff;font-family:'Manrope','Segoe UI',system-ui,sans-serif;color:#1d2433}
.w{width:1240px;padding:28px 32px 26px}
h1{font-size:24px;margin:0 0 4px} .sub{color:#5b6475;font-size:13.5px;margin:0 0 14px}
.sum{border:2px solid #2f9e5b;background:#eefaf2;border-radius:12px;padding:12px 16px;font-size:15px;display:flex;flex-wrap:wrap;gap:6px 26px;margin-bottom:16px}
.sum b{color:#1a7a40}
table{width:100%;border-collapse:collapse;font-size:14px}
th{background:#1f2a44;color:#fff;text-align:left;padding:10px 10px;font-size:13px;font-weight:700}
td{padding:9px 10px;border-bottom:1px solid #e3e7ef;vertical-align:top}
tr:nth-child(even) td{background:#f7f9fc}
td.n{width:34px;font-weight:700;color:#5b6475} td.c{text-align:center} td.j{font-weight:800;font-size:15px}
td.oy{font-weight:700;color:#1f2a44;white-space:nowrap}
.ru{display:block;color:#7a8394;font-size:12px;margin-top:2px}
.dd{display:inline-block;background:#e8eefc;color:#2a49a8;border-radius:6px;padding:2px 7px;font-size:12px;font-weight:700}
.mut{color:#8a93a3} tr.sv td{background:#fff8e6 !important}
tr.tot td{background:#1f2a44 !important;color:#fff;font-weight:800;border:0} tr.tot .mut{color:#c9d2e3}
.foot{color:#5b6475;font-size:12.5px;margin-top:12px;line-height:1.55}
</style></head><body><div class="w">
<h1>AI startup — LMS'dagi modullar va o'qish muddati</h1>
<p class="sub">Manba: go.coddycamp.uz, kurs «AI startup» (id 20), ${esc(d.manba.match(/\d\d\.\d\d\.\d{4} \d\d:\d\d/)[0])} holati. Faqat o'qildi — LMS'da hech narsa o'zgartirilmadi.</p>
<div class="sum"><span>O'quv darslari: <b>${T.jami}</b> (Class ${T.cls} + Demo Day ${T.dd})</span><span>Haftasiga <b>3</b> dars → <b>≈ ${f1(T.hafta)} hafta</b></span><span>≈ <b>${f1(T.oy)} oy</b></span><span>Modullar: <b>${oq.length}</b> + Sinov darslari (${sinov.reduce((s, r) => s + r.jami, 0)} dars, muddatdan tashqari)</span></div>
<table><thead><tr><th>#</th><th>Modul nomi (LMS)</th><th style="text-align:center">Class</th><th>Demo Day</th><th style="text-align:center">Jami dars</th><th>Davomiylik</th><th style="text-align:center">Haftalar</th><th style="text-align:center">O'qishning oyi</th></tr></thead><tbody>
${rows.map(tr).join('\n')}
<tr class="tot"><td></td><td>JAMI (Sinov darslarisiz)</td><td class="c">${T.cls}</td><td>${T.dd}</td><td class="c j">${T.jami}</td><td>≈ ${f1(T.hafta)} hafta <span class="mut">(${f1(T.oy)} oy)</span></td><td class="c">1–${Math.ceil(T.jami / HAFTA)}</td><td class="c">1–${Math.ceil(T.jami / OY)}-oy</td></tr>
</tbody></table>
<p class="foot">Hisob qoidasi: dars = LMS'da turi <b>Class</b> yoki <b>Demoday</b>, holati <b>Active</b> bo'lgan yozuv (nomi «amaliyot» bo'lsa ham). Learn (test), Practice, Uyga vazifa, Draft va Archive yozuvlar hamda arxivlangan modullar (NestJS, Testlash ×2, CI/CD va Deploy) sanalmadi.<br>
Haftasiga 3 dars; 1 oy = 13 dars (≈ 4,33 hafta). «Haftalar» va «O'qishning oyi» — modullar ketma-ket o'tilganda, FOUNDATION 1-haftadan boshlanadi deb hisoblangan. Ta'til va rezerv kunlari qo'shilmagan.</p>
</div></body></html>`;

writeFileSync(join(DIR, 'jadval.html'), html);
const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true });
const pg = await b.newPage({ viewport: { width: 1240, height: 800 }, deviceScaleFactor: 2 });
await pg.goto('file://' + join(DIR, 'jadval.html'));
await pg.screenshot({ path: join(DIR, 'LMS-modullar-oqish-muddati-20261028.png'), fullPage: true });
await b.close();
console.log(`Jami ${T.jami} dars (Class ${T.cls} + DD ${T.dd}) · ${f1(T.hafta)} hafta · ${f1(T.oy)} oy`);
rows.forEach((r) => console.log(`${r.n}. ${r.uz} — ${r.jami}${r.hf ? ` · ${f1(r.hafta)} hf · ${range(r.hf, '')} · ${range(r.oyR, '-oy')}` : ' (muddatsiz)'}`));
