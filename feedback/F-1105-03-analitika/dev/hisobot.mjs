// 16 §5 formati: 50 xabar × o'quvchi → CSV + MD xulosa. Manba: prod/ev/*.json (eski payload) + prod/dry.json (sinov qayta yig'ish) + 16a reestr.
import fs from 'node:fs';
import path from 'node:path';
const SP = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod';
const R = '/home/kali/Desktop/internetLesson/feedback/F-1105-03-analitika';
const OUT_CSV = `${R}/17a-50-XABAR-HISOBOT.csv`, OUT_MD = `${R}/17-ABDULLOH-50-XABAR-HISOBOT-UZ.md`;
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const dry = J(`${SP}/dry.json`);
const reestr = new Map(fs.readFileSync(`${R}/16a-REESTR-DARS-CLASS-LEARN.csv`, 'utf8').split('\n').slice(1).filter(Boolean).map((l) => { const c = l.split(','); return [c[4], c[5]]; }));
const byId = new Map();
for (const f of fs.readdirSync(`${SP}/ev`)) { const e = J(path.join(`${SP}/ev`, f)); byId.set(e.event_id, e); }
const parseDropped = (s) => { // "lms:31347 (q text obyekt s5b, q key≠text s12); size:1234567"
  const per = new Map(); let size = null;
  for (const part of String(s || '').split(';').map((x) => x.trim()).filter(Boolean)) {
    let m = /^size:(\d+)$/.exec(part); if (m) { size = Number(m[1]); continue; }
    m = /^\w+:(\d+)\s*\((.*)\)$/.exec(part); if (m) per.set(m[1], m[2]);
  }
  return { per, size };
};
const reason = (txt) => /text obyekt/.test(txt) ? 'invalid_text' : /key≠text|answer≠option|correct≠key/.test(txt) ? 'version_mismatch' : /answered≠questions|correct≠questions/.test(txt) ? 'matnsiz savol' : txt;
const causes = new Map();
const attCount = (st) => (st?.questions || []).filter((q) => q.kind === 'test').reduce((n, q) => n + (q.attempts?.length || 0), 0);
const qCount = (st) => (st?.questions || []).filter((q) => q.kind === 'test').length;
const bool = (v) => (v === true ? 'ha' : v === false ? "yo'q" : '');
const esc = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ''));
const rows = [], ev = [];
const pairCount = new Map();
for (const r of dry.results) { const e = byId.get(r.event_id); for (const s of e?.payload?.students || []) { const k = `${e.payload.lesson_id ?? r.lesson_id}:${s.student_id}`; pairCount.set(k, (pairCount.get(k) || 0) + 1); } }
for (const r of dry.results) {
  const e = byId.get(r.event_id); const old = e?.payload; const oldErr = (e?.last_error || '').replace(/\s*\(and \d+ more errors?\)/, '');
  const { per, size } = parseDropped(r.details_dropped);
  const newBy = new Map((r.payload?.students || []).map((s) => [String(s.student_id), s]));
  const excluded = new Set((r.excluded || []).map(String)), notSrc = new Set((r.not_in_source || []).map(String));
  const lid = old?.lesson_id ?? r.lesson_id; const sana = (e?.created_at || '').slice(0, 10);
  let attDropped = 0;
  for (const os of old?.students || []) {
    const sid = String(os.student_id); const ns = newBy.get(sid);
    const oldAtt = attCount(os), newAtt = ns ? attCount(ns) : null;
    const dropped = ns && qCount(ns) ? Math.max(0, oldAtt - newAtt) : 0; attDropped += dropped;
    if (per.has(sid)) causes.set(reason(per.get(sid)), (causes.get(reason(per.get(sid))) || 0) + 1);
    const detail = per.has(sid) ? `tushirildi: ${reason(per.get(sid))}${qCount(os) === 0 && (os.answered || 0) > 0 ? ' (eski xabarda ham yo\'q edi)' : ''}` : size ? `tushirildi: size` : ns ? (qCount(ns) ? (qCount(ns) < (ns.answered || 0) ? 'qisman (amaliyot ekranisiz)' : "to'liq") : ((ns.answered || 0) > 0 ? 'qisman (faqat amaliyot ekrani, 0 yozuv)' : "to'liq (javob yo'q)")) : '';
    if (ns && /^qisman/.test(detail)) causes.set('qisman', (causes.get('qisman') || 0) + 1);
    const holat = excluded.has(sid) ? 'chiqariladi: shu dars bo\'yicha tugallangan natija allaqachon yetkazilgan yoki shu to\'plamda oldinroq yuboriladi'
      : notSrc.has(sid) ? 'manbada topilmadi' : r.action === 'send' && ns ? 'yuboriladi' : r.action === 'error' ? `xato: ${r.error}` : r.action === 'skip' ? 'hodisa butunlay chiqariladi' : '';
    rows.push({
      event_id: r.event_id, sana, mode: r.mode ?? old?.mode, lesson_id: lid, lesson_version_hozir: reestr.get(lid) || '', student_id: sid,
      takror: (pairCount.get(`${lid}:${sid}`) || 1) > 1 ? 'ha' : '',
      eski_xato: oldErr.replace(/\s+/g, ' ').slice(0, 80),
      eski_answered: os.answered ?? '', eski_correct: os.correct_answers ?? '', eski_completed: bool(os.completed), eski_badges: (os.badges || []).join('|'),
      yangi_answered: ns?.answered ?? '', yangi_correct: ns?.correct_answers ?? '', yangi_completed: ns ? bool(ns.completed) : '', yangi_badges: ns ? (ns.badges || []).join('|') : '',
      tafsilot: detail,
      chiqarilgan_urinishlar: dropped ? `${dropped} (${r.mode === 'live' ? 'jonli: ikkinchi urinish' : 'boshqa dars versiyasi'})` : (ns && !qCount(ns) && oldAtt ? `${oldAtt} (tafsilot bilan birga)` : ''),
      bizda_holat: holat, sizda_tekshirish: '',
    });
  }
  ev.push({ event_id: r.event_id, sana, mode: r.mode ?? old?.mode, lesson_id: lid, action: r.action, before: r.students_before ?? (old?.students || []).length, after: r.students_after ?? '', excluded: (r.excluded || []).length, not_in_source: (r.not_in_source || []).length, correct_changes: (r.correct_changes || []).length, dCorrect: (r.correct_changes || []).reduce((n, c) => n + (c.after - c.before), 0), dropped_students: per.size + (size ? (r.students_after || 0) : 0), attDropped, error: r.error || '', oldErr: oldErr.replace(/\s+/g, ' ').slice(0, 60) });
}
const head = Object.keys(rows[0]);
fs.writeFileSync(OUT_CSV, [head.join(','), ...rows.map((r) => head.map((k) => esc(r[k])).join(','))].join('\n') + '\n');
const T = dry.totals || {}; const sum = (k) => ev.reduce((n, x) => n + (Number(x[k]) || 0), 0);
const uniqPairs = new Set(rows.map((r) => `${r.lesson_id}:${r.student_id}`)).size, uniqStudents = new Set(rows.map((r) => r.student_id)).size;
const compFlip = rows.filter((r) => r.yangi_completed && r.eski_completed !== r.yangi_completed);
const ansChg = rows.filter((r) => r.yangi_answered !== '' && String(r.eski_answered) !== String(r.yangi_answered));
const chgTxt = (list, a, b) => list.length ? ` (${list.map((r) => `${r.lesson_id} · ${r.student_id}: ${r[a]} → ${r[b]}`).join('; ')})` : '';
const md = `# Abdullohga: 50 ta xabar — sinov rejimida qayta yig'ish hisoboti (hech narsa yuborilmagan)

**Sana:** ${new Date().toISOString().slice(0, 10)} · **Format:** \`16-…\` hujjat 5-bo'limi · **Jadval:** \`17a-50-XABAR-HISOBOT.csv\` (${rows.length} qator = o'quvchi × xabar)
**Manba:** prod Dars API, server \`${J(`${SP}/health.json`).version}\`, qayta yig'ish \`dry: true\` — bazaga yozilmadi, School API'ga yuborilmadi.

## 1. Yig'ma

| | Soni |
|---|---|
| Xabarlar | ${ev.length} (jonli ${ev.filter((x) => x.mode === 'live').length}, uyda ${ev.filter((x) => x.mode === 'solo').length}) |
| O'quvchi natijasi yozuvlari (eski xabarlarda) | ${rows.length} |
| Noyob o'quvchi | ${uniqStudents} · noyob o'quvchi + dars juftligi: ${uniqPairs} (takror ${rows.filter((r) => r.takror).length} qator) |
| Qayta yig'ilganda yuboriladigan yozuvlar | ${T.students ?? sum('after')} |
| Bizda chiqariladi (shu dars bo'yicha tugallangan natija allaqachon yetkazilgan) | ${sum('excluded')} |
| Manbada topilmadi | ${sum('not_in_source')} |
| \`correct_answers\` o'zgaradi | ${T.correct_changes ?? sum('correct_changes')} o'quvchida, jami ${sum('dCorrect') >= 0 ? '+' : ''}${sum('dCorrect')} |
| \`answered\` o'zgaradi | ${ansChg.length}${chgTxt(ansChg, 'eski_answered', 'yangi_answered')} |
| \`completed\` o'zgaradi | ${compFlip.length}${chgTxt(compFlip, 'eski_completed', 'yangi_completed')} |
| Tafsiloti tushirilgan yozuvlar | ${sum('dropped_students')} |
| Tarixdan chiqarilgan urinishlar | ${sum('attDropped')} |
| Xabar holati | yuboriladi ${ev.filter((x) => x.action === 'send').length} · butunlay chiqariladi ${ev.filter((x) => x.action === 'skip').length} · xato ${ev.filter((x) => x.action === 'error').length} |

${compFlip.length ? `**\`completed\` o'zgargan ${compFlip.length} o'quvchi:** eski xabarda oxirgi javobi yo'q edi — u natija yig'ilgandan keyin serverga yetgan (dars tarmoqdan qayta urinadi). Manbada hamma savolga javob bor, shuning uchun qayta yig'ilganda \`completed: true\` (qoida: barcha savolga javob bergan = tugatgan). Bu yozuvda coin huquqi paydo bo'ladi — \`sizda_tekshirish\` uchun alohida e'tibor.\n\n` : ''}**Tafsilot holati** (javob bergan o'quvchilar ichida): ${[...causes.entries()].map(([k, v]) => `\`${k}\` — ${v}`).join(' · ') || "hammasi to'liq"}.
- \`qisman\` — o'quvchi darsning yakuniy amaliyot ekranini (yozma topshiriq, variantsiz) bajargan: u \`answered\` ga kiradi, lekin \`questions[]\` da yozuvi yo'q, qolgan savollar to'liq. 16-hujjat 2.2 \`details.status: partial\`. Dars API qoidasi 09.11 da shunga moslandi (avval bunday o'quvchining butun tafsiloti tushirilardi — eski xabarlarda ham shunday edi).
- \`tushirildi: invalid_text\` — \`[object Object]\` (bitta dars, \`pg-crud-04-05-v18\`, 14-hujjat 1.2): asosiy natija ketadi, tafsilot yo'q.
- \`tushirildi: version_mismatch\` — kalit o'quvchi ko'rgan matnga mos emas.
- \`tushirildi: matnsiz savol\` — faqat eski qoida bilan yig'ilgan hisobotda uchraydi; yangi qoidada \`qisman\` ga aylanadi.

## 2. Xabarlar bo'yicha

| # | Sana | \`event_id\` | Rejim | Dars | Eski xato | O'quvchi: eski → yangi | Chiqarildi | \`correct\` o'zgardi | Tafsilot tushdi | Urinish chiqdi | Holat |
|---|---|---|---|---|---|---|---|---|---|---|---|
${ev.map((x, i) => `| ${i + 1} | ${x.sana} | \`${x.event_id}\` | ${x.mode} | ${x.lesson_id} | ${x.oldErr} | ${x.before} → ${x.after} | ${x.excluded}${x.not_in_source ? ` (+${x.not_in_source} manbada yo'q)` : ''} | ${x.correct_changes}${x.dCorrect ? ` (${x.dCorrect > 0 ? '+' : ''}${x.dCorrect})` : ''} | ${x.dropped_students} | ${x.attDropped} | ${x.action === 'send' ? 'yuboriladi' : x.action === 'skip' ? 'chiqariladi' : `xato: ${x.error}`} |`).join('\n')}

## 3. CSV ustunlari

| Ustun | Ma'nosi |
|---|---|
| \`event_id\`, \`sana\`, \`mode\`, \`lesson_id\`, \`lesson_version_hozir\` | Xabar va dars. Versiya — reestrdagi hozirgi versiya (eski urinishning aniq versiyasi yozilmagan) |
| \`student_id\` | LMS id |
| \`takror\` | Shu o'quvchi + dars 50 ta xabarning boshqasida ham bor |
| \`eski_xato\` | School API'ning 422 sababi |
| \`eski_*\` / \`yangi_*\` | 422 olgan xabardagi qiymat / qayta yig'ilgan qiymat (\`answered\`, \`correct\`, \`completed\`, \`badges\`) |
| \`tafsilot\` | \`to'liq\` · \`qisman (amaliyot ekranisiz)\` (16-hujjat 2.2 \`partial\`) · \`tushirildi: invalid_text\` ([object Object]) · \`tushirildi: version_mismatch\` (kalit o'quvchi ko'rgan matnga mos emas) · \`tushirildi: size\` |
| \`chiqarilgan_urinishlar\` | Savol tarixidan olib tashlangan urinishlar soni va sababi |
| \`bizda_holat\` | \`yuboriladi\` · \`chiqariladi: …\` · \`manbada topilmadi\` |
| \`sizda_tekshirish\` | Bo'sh — brauzer natijasi va coin reyestri bo'yicha sizning belgingiz |

## 4. Qoidalar (16-hujjat 5-bo'limi)

- \`correct\` o'quvchi ko'rgan savol versiyasining kaliti bilan: \`correct_answer\` matni urinish paytida yozilgan, kalit indeksi shu matnga mos kelmasa yozuv chiqarilgan. Savol yoki variant matni birinchi urinishdan farq qilsa — chiqarilgan.
- Jonli darsda har savolga faqat birinchi urinish.
- Agregat \`correct_answers\` qayta hisoblangan, jadvalda eski va yangi yonma-yon.
- \`event_id\` o'sha qoladi. Siz «yuboriladi» qatorlardan qaysilari ketishini belgilaysiz; keyin bitta xabar → sizda tekshiruv → qolganlari.
`;
fs.writeFileSync(OUT_MD, md);
console.log(JSON.stringify({ rows: rows.length, events: ev.length, send: ev.filter((x) => x.action === 'send').length, skip: ev.filter((x) => x.action === 'skip').length, error: ev.filter((x) => x.action === 'error').length, excluded: sum('excluded'), dCorrect: sum('dCorrect'), dropped_students: sum('dropped_students'), attDropped: sum('attDropped'), uniqStudents, uniqPairs }));
