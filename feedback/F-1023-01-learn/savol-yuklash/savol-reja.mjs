// savol-reja (28.10) — Learn'ga yuklanadigan 344 LMS JSON'ni tekshiradi va «qaysi fayl → qaysi Learn» rejasini yozadi.
// Ishlatish (repo ildizidan): node <bu-fayl> [--yoz]
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const YOZ = process.argv.includes('--yoz');
const csv = (p) => {
  const [h, ...rows] = readFileSync(p, 'utf8').trim().split('\n');
  const cols = h.split(',');
  return rows.map((r) => { const v = []; let cur = '', q = false; for (const ch of r) { if (ch === '"') q = !q; else if (ch === ',' && !q) { v.push(cur); cur = ''; } else cur += ch; } v.push(cur); return Object.fromEntries(cols.map((c, i) => [c, v[i]])); });
};
const CL = csv('feedback/F-1023-01-learn/ommaviy-yuklash/CLASS-LEARN.csv').filter((r) => r.lid);
const LO = Object.fromEntries(csv('feedback/F-1023-01-learn/ommaviy-yuklash/LEARN-OCHILDI.csv').map((r) => [r.class_id, r.learn_id]));
const byLid = Object.fromEntries(CL.map((r) => [r.lid, r]));

const xato = []; const reja = []; let fayl = 0, savol = 0;
const cyr = /[А-Яа-яЁё]/;
for (const mod of readdirSync('codestrike-savollar').filter((d) => /^\d+-Modul$/.test(d)).sort((a, b) => parseInt(a) - parseInt(b))) {
  for (const f of readdirSync(join('codestrike-savollar', mod)).filter((x) => x.endsWith('.json')).sort()) {
    const j = JSON.parse(readFileSync(join('codestrike-savollar', mod, f), 'utf8'));
    const base = f.replace(/\.json$/, '');
    const c = byLid[j.lessonId];
    const learn = c ? LO[c.class_id] : undefined;
    if (!c) xato.push(`${mod}/${f}: CLASS-LEARN'da yo'q (${j.lessonId})`);
    else if (!learn) xato.push(`${mod}/${f}: Learn id yo'q (Class ${c.class_id})`);
    else if (String(c.modul) !== String(j.modul)) xato.push(`${mod}/${f}: modul farqi ${c.modul} ≠ ${j.modul}`);
    const qatorlar = {};
    for (const lang of ['uz', 'ru']) {
      const p = join('codestrike-savollar/lms', mod, `${base}-${lang}.json`);
      let arr; try { arr = JSON.parse(readFileSync(p, 'utf8')); fayl++; } catch (e) { xato.push(`${p}: o'qilmadi`); continue; }
      const e = (m) => xato.push(`${p}: ${m}`);
      if (!Array.isArray(arr) || arr.length !== 12) e(`savol soni ${arr?.length}`);
      let ruBor = 0;
      arr.forEach((q, i) => {
        savol++;
        if (q.type !== 'selected-file') e(`#${i + 1} type ${q.type}`);
        if (q.lang !== lang) e(`#${i + 1} lang ${q.lang}`);
        const kutil = (lang === 'ru' ? 12 : 0) + i + 1; if (q.order_number !== kutil) e(`#${i + 1} order_number ${q.order_number} (kutilgan ${kutil})`);
        if (typeof q.question !== 'string' || !q.question.trim()) e(`#${i + 1} savol bo'sh`);
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) e(`#${i + 1} variant soni ${q.options?.length}`);
        else {
          if (q.options.some((o) => typeof o.value !== 'string' || !o.value.trim())) e(`#${i + 1} bo'sh variant`);
          if (q.options.some((o) => o.value.trim() === '0')) e(`#${i + 1} variant «0» — CRM bo'sh deb rad etadi`);
          if (new Set(q.options.map((o) => o.value.trim())).size !== q.options.length) e(`#${i + 1} takror variant`);
          if (!Number.isInteger(q.answer_index) || q.answer_index < 0 || q.answer_index >= q.options.length) e(`#${i + 1} answer_index ${q.answer_index}`);
          const ok = lang === 'uz' ? "To'g'ri!" : 'Верно!', no = lang === 'uz' ? "Noto'g'ri" : 'Неверно';
          q.options.forEach((o, k) => { if (o.hint !== (k === q.answer_index ? ok : no)) e(`#${i + 1} hint ${k}: ${o.hint}`); });
          // ikki til fayli bir-biriga mos: bir xil to'g'ri javob raqami va variant soni
          if (j.savollar?.[i] && j.savollar[i].togri !== q.answer_index) e(`#${i + 1} to'g'ri javob ${q.answer_index} ≠ manba ${j.savollar[i].togri}`);
        }
        if (/`/.test(JSON.stringify(q))) e(`#${i + 1} teskari qo'shtirnoq qoldi`);
        if (cyr.test(q.question)) ruBor++;
        if (lang === 'uz' && cyr.test(q.question)) e(`#${i + 1} uz savolida kirill`);
      });
      if (lang === 'ru' && ruBor < 6) e(`ru faylda ruscha savol kam: ${ruBor}/12`);
      qatorlar[lang] = `lms/${mod}/${base}-${lang}.json`;
    }
    reja.push({ modul: j.modul, tartib: j.tartib, nomUz: j.nom?.uz, nomRu: j.nom?.ru, lid: j.lessonId, classId: c?.class_id, learn, bolim: c?.bolim, uz: qatorlar.uz, ru: qatorlar.ru });
  }
}
const learnlar = reja.map((r) => r.learn).filter(Boolean);
if (new Set(learnlar).size !== learnlar.length) xato.push('bitta Learn ikki darsga tushgan');
console.log(`Dars: ${reja.length} · LMS fayl: ${fayl} · savol: ${savol} · Learn moslik: ${learnlar.length}/${reja.length} · xato: ${xato.length}`);
xato.slice(0, 30).forEach((x) => console.log('  ✗ ' + x));

if (YOZ && !xato.length) {
  const dir = 'feedback/F-1023-01-learn/savol-yuklash'; mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'YUKLASH-REJA.csv'), 'modul,bolim,tartib,class_id,learn_id,lesson_id,uz_fayl,ru_fayl,holat\n' + reja.map((r) => [r.modul, r.bolim, r.tartib, r.classId, r.learn, r.lid, 'codestrike-savollar/' + r.uz, 'codestrike-savollar/' + r.ru, ''].join(',')).join('\n') + '\n');
  let md = `# CodeStrike savollari → Learn (yuklash rejasi, 28.10.2026)\n\nHar Learn'ga ikki fayl: uz va ru (har birida 12 savol, \`selected-file\`). Manba: darsdagi \`QUIZ_BANK\` (\`scripts/codestrike-savollar.mjs --tekshir\` 172/172).\nLearn id: \`ommaviy-yuklash/LEARN-OCHILDI.csv\`. Hammasi Draft — savol yuklansa ham o'quvchiga ko'rinmaydi.\n`;
  for (const m of [...new Set(reja.map((r) => r.modul))]) {
    const rs = reja.filter((r) => r.modul === m);
    md += `\n## ${m}-Modul · CRM bo'lim ${rs[0].bolim} · ${rs.length} Learn\n\n| # | Dars (Class) | Learn id | uz fayl | ru fayl | ✓ |\n|---|---|---|---|---|---|\n`;
    for (const r of rs) md += `| ${r.tartib} | ${r.nomUz} (${r.classId}) | **${r.learn}** | \`${r.uz.split('/').pop()}\` | \`${r.ru.split('/').pop()}\` | ☐ |\n`;
  }
  writeFileSync(join(dir, 'YUKLASH-REJA.md'), md);
  console.log(`Yozildi: ${dir}/YUKLASH-REJA.md + .csv`);
}
process.exit(xato.length ? 1 : 0);
