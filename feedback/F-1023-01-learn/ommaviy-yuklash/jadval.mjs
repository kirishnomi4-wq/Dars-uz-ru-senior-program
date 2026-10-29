// Class → Learn jadvali (F-1023-01): CRM o'qilgan xom ma'lumot + LMS_REESTR + SHA256-172.csv → CLASS-LEARN.csv / .md
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const D = new URL('.', import.meta.url).pathname;
const raw = readdirSync(D).filter((f) => f.startsWith('crm-oqildi-')).sort().pop();
const R = JSON.parse(readFileSync(D + '../../../LMS_REESTR.json', 'utf8'));
const sha = Object.fromEntries(readFileSync(D + 'SHA256-172.csv', 'utf8').trim().split('\n').slice(1).map((l) => { const c = l.split(','); return [c[2], { fayl: c[3], sha: c[5] }]; }));
const bolim2mod = Object.fromEntries(Object.entries(R.crm_bolim).map(([m, b]) => [b.id, +m]));
const TUR = { Cl: 'Class', Le: 'Learn', U: 'Uyga vazifa', De: 'Demoday' };
const mods = {};
for (const l of readFileSync(D + raw, 'utf8').split('\n')) {
  const m = /^(\d+)>(.*)$/.exec(l); if (!m) continue;
  mods[m[1]] = m[2].trim().split(' ').map((s) => { const [id, t, tur, st, q] = s.split(':'); return { id: +id, t: +t, tur: TUR[tur] || tur, st, q: q ? q.split('+').map(Number) : [] }; });
}
const q2dars = {}; for (const [lid, d] of Object.entries(R.darslar)) for (const q of [d.crm?.uz, d.crm?.ru]) if (q) q2dars[+q] = lid;
const rows = []; const ishlatilgan = new Set();
for (const [b, list] of Object.entries(mods)) {
  const act = list.filter((r) => r.st === 'Ac').sort((a, z) => a.t - z.t);
  for (const r of list.filter((x) => x.tur === 'Class' || x.tur === 'Demoday' || x.tur === 'Learn')) {
    const lids = [...new Set(r.q.map((q) => q2dars[q]).filter(Boolean))];
    const lid = lids[0]; if (lid) ishlatilgan.add(lid);
    const d = lid ? R.darslar[lid] : null;
    const keyingi = act.find((x) => x.t > r.t);
    const learnNow = list.filter((x) => x.tur === 'Learn' && x.t > r.t && (!keyingi || x.t < keyingi.t || x.id === keyingi.id));
    const bosh = keyingi ? keyingi.t - r.t - 1 : 99;
    rows.push({ modul: bolim2mod[b], bolim: +b, class_id: r.id, tartib: r.t, tur: r.tur, holat: { Ac: 'Active', Dr: 'Draft', Ar: 'Archive' }[r.st], lid: lid || '', ikki: lids.length > 1 ? lids.join('+') : '', nom: d?.nom_uz || '', fayl: lid ? sha[lid]?.fayl || '' : '', sha: lid ? sha[lid]?.sha || '' : '',
      keyingi_id: keyingi?.id || '', keyingi_tartib: keyingi?.t ?? '', keyingi_tur: keyingi?.tur || '— (oxirgi)', learn_hozir: learnNow.map((x) => `${x.id} (${x.t}, ${({ Ac: 'Active', Dr: 'Draft', Ar: 'Archive' })[x.st]})`).join(' '),
      learn_tartib: r.st === 'Ac' && lid ? (bosh >= 1 ? r.t + Math.min(2, bosh) : 'JOY YO\'Q') : '' });
  }
}
rows.sort((a, z) => a.modul - z.modul || a.tartib - z.tartib);
const yoq = Object.keys(R.darslar).filter((l) => !ishlatilgan.has(l));
const H = ['modul', 'bolim', 'class_id', 'tartib', 'tur', 'holat', 'lid', 'ikki', 'nom', 'fayl', 'sha', 'keyingi_id', 'keyingi_tartib', 'keyingi_tur', 'learn_hozir', 'learn_tartib'];
writeFileSync(D + 'CLASS-LEARN.csv', [H.join(',')].concat(rows.map((r) => H.map((h) => /[,"]/.test(String(r[h])) ? JSON.stringify(String(r[h])) : r[h]).join(','))).join('\n') + '\n');
const act = rows.filter((r) => r.holat === 'Active');
const s = { jami: rows.length, active: act.length, jsxli: act.filter((r) => r.lid).length, jsxsiz: act.filter((r) => !r.lid).map((r) => `${r.modul}-M ${r.class_id} (${r.tur})`), ikki: rows.filter((r) => r.ikki).map((r) => r.class_id + ':' + r.ikki), joyyoq: rows.filter((r) => r.learn_tartib === "JOY YO'Q").map((r) => r.class_id), keyingi: act.filter((r) => r.lid).reduce((a, r) => (a[r.keyingi_tur] = (a[r.keyingi_tur] || 0) + 1, a), {}), learn_hozir: rows.filter((r) => r.learn_hozir).map((r) => r.class_id + '→' + r.learn_hozir), reestrda_classsiz: yoq, archive_jsx: rows.filter((r) => r.holat === 'Archive' && r.lid).map((r) => r.class_id + ':' + r.lid) };
console.log(JSON.stringify(s, null, 1));
// ── MD jadval ──
const md = ['# Class → Learn mosligi · 2–14-Modul (CRM 27.10.2026 da o\'qildi)', '',
  'Qoida (Abdulloh, 27.10): backend shu moduldagi `order` kattaroq **birinchi faol** darsni oladi. U Learn bo\'lsa — yashiriladi; boshqa tur bo\'lsa — Learn qidirilmaydi.', '',
  '«Hozir keyingi faol dars» — bugungi CRM holati. «Learn tartibi (reja)» — Learn shu raqam bilan qo\'yilsa, Class\'dan keyingi birinchi faol dars Learn bo\'ladi.', ''];
for (const m of [...new Set(rows.map((r) => r.modul))]) {
  const rs = rows.filter((r) => r.modul === m && r.holat === 'Active');
  md.push(`## ${m}-Modul · CRM bo'lim ${rs[0].bolim}`, '', '| Class id | Tartib | JSX dars (lesson_id) | SHA-256 (boshi) | Hozir keyingi faol dars | Learn tartibi (reja) |', '|---|---|---|---|---|---|');
  for (const r of rs) md.push(`| ${r.class_id}${r.tur !== 'Class' ? ' · ' + r.tur : ''} | ${r.tartib} | ${r.lid ? `${r.nom} (\`${r.lid}\`)` : '— JSX yo\'q, Learn kerak emas'} | ${r.sha ? '`' + r.sha.slice(0, 12) + '…`' : ''} | ${r.keyingi_id ? `${r.keyingi_tur} ${r.keyingi_id} (${r.keyingi_tartib})` : '— modul oxiri'}${r.learn_hozir ? ' · Learn ' + r.learn_hozir : ''} | ${r.learn_tartib} |`);
  md.push('');
}
writeFileSync(D + 'CLASS-LEARN.md', md.join('\n'));
