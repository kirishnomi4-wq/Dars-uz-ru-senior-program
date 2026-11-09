// 20-hisobot (Abdulloh 18-javobi §8 talablari bilan): 50 xabar × o'quvchi → 20a CSV + 20 MD.
// Manba: prod/ev/*.json (eski payload + 422 xatosi) · prod/sess/*.json (jonli sessiya ishtirokchilari: reached_end, finish_reason)
//        · prod/dry2.json (F-1109-03 qoidalari bilan sinov qayta yig'ish, excluded_by, total_before/after) · 16a reestr · LMS_DEPLOY_JURNAL.md
import fs from 'node:fs';
import path from 'node:path';
const SP = '/tmp/claude-1000/-home-kali-Desktop-internetLesson/5771fc95-86e5-4346-9eed-844bdda0c66d/scratchpad/prod';
const ROOT = '/home/kali/Desktop/internetLesson';
const R = `${ROOT}/feedback/F-1105-03-analitika`;
const OUT_CSV = `${R}/20a-50-XABAR-HISOBOT-V2.csv`, OUT_MD = `${R}/20-ABDULLOH-50-XABAR-HISOBOT-V2-UZ.md`;
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const C = (s) => '`' + s + '`';
const dry = J(`${SP}/dry2.json`);
const health = J(`${SP}/health.json`);

// --- 16a reestr: lesson_id → {version, class, learn, eski ids}
const csvRows = (txt) => txt.split('\n').filter(Boolean).map((l) => { const out = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; });
const r16 = csvRows(fs.readFileSync(`${R}/16a-REESTR-DARS-CLASS-LEARN.csv`, 'utf8'));
const h16 = r16[0]; const ix = (n) => h16.indexOf(n);
const reestr = new Map(); const oldToNew = new Map();
for (const c of r16.slice(1)) {
  const row = { lesson_id: c[ix('lesson_id')], v: c[ix('lesson_version')], class_id: c[ix('class_id')], learn_id: c[ix('learn_id')], eski: ix('eski_lesson_id') >= 0 ? c[ix('eski_lesson_id')] : '' };
  reestr.set(row.lesson_id, row);
  for (const o of String(row.eski || '').split('|').map((x) => x.trim()).filter(Boolean)) oldToNew.set(o, row.lesson_id);
}

// --- LMS_DEPLOY_JURNAL: dars → [(sana, versiya)] (sana bo'yicha o'sish); 19.10 reliz = hammasi v3
const timeline = new Map(); let fullV3Date = null;
for (const line of fs.readFileSync(`${ROOT}/LMS_DEPLOY_JURNAL.md`, 'utf8').split('\n')) {
  const m = /^\|\s*(\d{4}-\d{2}-\d{2})\s*\|[^|]*\|[^|]*\|[^|]*\|([^|]*)\|/.exec(line);
  if (!m) continue;
  const [, date, list] = m;
  if (/TO'LIQ reliz/.test(list) && /-v3/.test(list)) { fullV3Date = fullV3Date && fullV3Date < date ? fullV3Date : date; continue; }
  for (const item of list.split(',')) { const mm = /^\s*([A-Za-z0-9._-]+)\s+(v\d+)\s*$/.exec(item); if (!mm) continue; if (!timeline.has(mm[1])) timeline.set(mm[1], []); timeline.get(mm[1]).push([date, mm[2]]); }
}
for (const l of timeline.values()) l.sort((a, b) => a[0].localeCompare(b[0]));
const histVersion = (lessonId, dateIso) => {
  const d = String(dateIso || '').slice(0, 10); if (!d) return '';
  const l = timeline.get(lessonId) || [];
  let v = null; for (const [dt, ver] of l) if (dt <= d) v = ver;
  if (v) return v;
  if (fullV3Date && d >= fullV3Date) return 'v3';
  return 'reestr oldi (sentyabr yuklash)';
};

// --- eski hodisalar va sessiyalar
const byId = new Map();
for (const f of fs.readdirSync(`${SP}/ev`)) { const e = J(path.join(`${SP}/ev`, f)); byId.set(e.event_id, e); }
const sessById = new Map();
if (fs.existsSync(`${SP}/sess`)) for (const f of fs.readdirSync(`${SP}/sess`)) sessById.set(f.replace(/\.json$/, ''), J(path.join(`${SP}/sess`, f)));

const parseDropped = (s) => { const per = new Map(); let size = null; for (const part of String(s || '').split(';').map((x) => x.trim()).filter(Boolean)) { let m = /^size:(\d+)$/.exec(part); if (m) { size = Number(m[1]); continue; } m = /^\w+:(\d+)\s*\((.*)\)$/.exec(part); if (m) per.set(m[1], m[2]); } return { per, size }; };
const reason = (txt) => /text obyekt/.test(txt) ? 'invalid_text' : /key≠text|answer≠option|correct≠key/.test(txt) ? 'version_mismatch' : /answered≠questions|correct≠questions/.test(txt) ? 'matnsiz savol' : txt;
const attCount = (st) => (st?.questions || []).filter((q) => q.kind === 'test').reduce((n, q) => n + (q.attempts?.length || 0), 0);
const qCount = (st) => (st?.questions || []).filter((q) => q.kind === 'test').length;
const bool = (v) => (v === true ? 'ha' : v === false ? "yo'q" : '');
const esc = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ''));
const setDiff = (a, b) => a.filter((x) => !b.includes(x));

const rows = [], ev = [], excludedRows = [], badgeRows = [], causes = new Map();
const pairCount = new Map();
for (const r of dry.results) { const e = byId.get(r.event_id); for (const s of e?.payload?.students || []) { const k = `${e.payload.lesson_id ?? r.lesson_id}:${s.student_id}`; pairCount.set(k, (pairCount.get(k) || 0) + 1); } }

for (const r of dry.results) {
  const e = byId.get(r.event_id); const old = e?.payload; const oldErr = (e?.last_error || '').replace(/\s*\(and \d+ more errors?\)/, '').replace(/\s+/g, ' ');
  const { per, size } = parseDropped(r.details_dropped);
  const newBy = new Map((r.payload?.students || []).map((s) => [String(s.student_id), s]));
  const exBy = new Map((r.excluded_by || []).map((x) => [String(x.student_id), x]));
  const excluded = new Set((r.excluded || []).map(String)), notSrc = new Set((r.not_in_source || []).map(String));
  const lid = old?.lesson_id ?? r.lesson_id; const sana = (old?.started_at || e?.created_at || '').slice(0, 10);
  const sess = sessById.get(r.event_id); const parts = new Map((sess?.participants || []).filter((p) => p.role === 'student').map((p) => [String(p.subject_id), p]));
  const oldTotal = r.total_before ?? old?.total_questions ?? ''; const newTotal = r.total_after ?? r.payload?.total_questions ?? '';
  const lidNow = reestr.has(lid) ? lid : (oldToNew.get(lid) || '');
  let attDropped = 0;
  for (const os of old?.students || []) {
    const sid = String(os.student_id); const ns = newBy.get(sid); const p = parts.get(sid);
    const oldAtt = attCount(os), newAtt = ns ? attCount(ns) : null;
    const dropped = ns && qCount(ns) ? Math.max(0, oldAtt - newAtt) : 0; attDropped += dropped;
    if (per.has(sid)) causes.set(reason(per.get(sid)), (causes.get(reason(per.get(sid))) || 0) + 1);
    const detail = per.has(sid) ? `tushirildi: ${reason(per.get(sid))}` : size ? 'tushirildi: size' : ns ? (qCount(ns) ? "to'liq" : ((ns.answered || 0) > 0 ? 'TEKSHIRING: javob bor, yozuv yo\'q' : "to'liq (javob yo'q)")) : '';
    if (ns && detail === "to'liq") causes.set("to'liq", (causes.get("to'liq") || 0) + 1);
    const reachedEnd = p ? (p.reached_end === true ? 'ha' : "yo'q") : (r.mode === 'solo' ? (ns ? (ns.completed ? 'ha (urinish completed)' : "yo'q (auto_7d)") : '') : '');
    const finish = p ? (p.finish_reason || '') : '';
    // o'zgarish sabablari
    const why = [];
    if (ns) {
      if (String(oldTotal) !== String(newTotal)) why.push(`total ${oldTotal}→${newTotal} (${Number(newTotal) < Number(oldTotal) ? 'amaliyot ekrani testdan chiqarildi' : 'eski payload totali'})`);
      if (String(os.answered ?? '') !== String(ns.answered ?? '')) why.push(`answered ${os.answered}→${ns.answered} (${Number(ns.answered) < Number(os.answered) ? 'amaliyot ekrani testdan chiqarildi' : 'manbada ko\'proq javob'})`);
      if (String(os.correct_answers ?? '') !== String(ns.correct_answers ?? '')) why.push(`correct ${os.correct_answers}→${ns.correct_answers} (${Number(ns.correct_answers) > Number(os.correct_answers) ? 'kalit bo\'yicha qayta hisob, F-1106-01' : 'amaliyot ekrani testdan chiqarildi'})`);
      if (os.completed !== ns.completed) why.push(`completed ${bool(os.completed)}→${bool(ns.completed)} (reached_end=${reachedEnd})`);
      const ob = os.badges || [], nb = ns.badges || [];
      const added = setDiff(nb, ob), removed = setDiff(ob, nb);
      if (added.length || removed.length) {
        const note = [];
        if (removed.includes('participant') || added.includes('participant')) note.push('participant — faqat bo\'sh ro\'yxat o\'rnini bosuvchi');
        if ((added.includes('speedster') || removed.includes('speedster')) && !why.some((w) => /total|correct|answered/.test(w))) note.push('speedster — guruh medianasi/nisbat (boshqa o\'quvchilar hisobi o\'zgardi)');
        if (added.includes('graduate') || removed.includes('graduate')) note.push('graduate ← completed');
        if (added.some((x) => /all_correct|first_try/.test(x)) || removed.some((x) => /all_correct|first_try/.test(x))) note.push('all_correct/first_try ← correct va total');
        if (added.some((x) => /^top_/.test(x)) || removed.some((x) => /^top_/.test(x))) note.push('top_N ← podium qayta (amaliyot ball sifatida kirmaydi; to\'g\'ri soni, vaqt)');
        badgeRows.push({ event_id: r.event_id, lesson_id: lid, student_id: sid, eski: ob.join('|'), yangi: nb.join('|'), qoshildi: added.join('|'), olib: removed.join('|'), sabab: [...why, ...note].join('; ') });
      }
    }
    const holat = excluded.has(sid) ? 'chiqariladi' : notSrc.has(sid) ? 'manbada topilmadi' : r.action === 'send' && ns ? 'yuboriladi' : r.action === 'error' ? `xato: ${r.error}` : r.action === 'skip' ? 'chiqariladi (hodisa butunlay)' : '';
    const ex = exBy.get(sid);
    if (excluded.has(sid)) excludedRows.push({ event_id: r.event_id, lesson_id: lid, student_id: sid, orniga: ex?.event_id || '', holat: ex?.status === 'planned' ? 'shu to\'plamda oldinroq yuboriladi' : (ex?.status || ''), vaqt: ex?.delivered_at || '' });
    const dalil = ns ? (qCount(ns) ? `javob paytida yozilgan matn, kalit↔matn mos (${qCount(ns)} savol, ${attCount(ns)} urinish)` : ((ns.answered || 0) === 0 ? 'javob yo\'q' : '')) : '';
    rows.push({
      event_id: r.event_id, sana, mode: r.mode ?? old?.mode, lesson_id: lid, lesson_id_hozir: lidNow === lid ? '' : lidNow, class_id: reestr.get(lidNow)?.class_id || '', learn_id: reestr.get(lidNow)?.learn_id || '',
      lesson_version_tarixiy: histVersion(lidNow || lid, sana), lesson_version_hozir: reestr.get(lidNow)?.v || '',
      student_id: sid, takror: (pairCount.get(`${lid}:${sid}`) || 1) > 1 ? 'ha' : '',
      eski_xato: oldErr.slice(0, 80), eski_total: oldTotal, yangi_total: ns ? newTotal : '',
      eski_answered: os.answered ?? '', eski_correct: os.correct_answers ?? '', eski_completed: bool(os.completed), eski_badges: (os.badges || []).join('|'),
      yangi_answered: ns?.answered ?? '', yangi_correct: ns?.correct_answers ?? '', yangi_completed: ns ? bool(ns.completed) : '', yangi_badges: ns ? (ns.badges || []).join('|') : '',
      ozgarish_sababi: why.join('; '), reached_end: reachedEnd, urinish_yakuni: finish,
      tafsilot: detail, dalil,
      chiqarilgan_urinishlar: dropped ? `${dropped} (${r.mode === 'live' ? 'jonli: ikkinchi urinish' : 'boshqa dars versiyasi'})` : (ns && !qCount(ns) && oldAtt ? `${oldAtt} (tafsilot bilan birga)` : ''),
      bizda_holat: holat, orniga_hodisa: ex?.event_id || '', orniga_holat: ex ? (ex.status === 'planned' ? 'shu to\'plamda' : ex.status) : '', orniga_yetkazilgan: ex?.delivered_at || '',
      sizda_tekshirish: '',
    });
  }
  ev.push({ event_id: r.event_id, sana, mode: r.mode ?? old?.mode, lesson_id: lid, action: r.action, before: r.students_before ?? (old?.students || []).length, after: r.students_after ?? '', excluded: (r.excluded || []).length, not_in_source: (r.not_in_source || []).length, correct_changes: (r.correct_changes || []).length, dCorrect: (r.correct_changes || []).reduce((n, c) => n + (c.after - c.before), 0), dropped_students: per.size + (size ? (r.students_after || 0) : 0), attDropped, error: r.error || '', oldErr: oldErr.slice(0, 60), oldTotal, newTotal, reachedEnd: sess ? `${[...parts.values()].filter((p) => p.reached_end).length}/${parts.size}` : '' });
}

const head = Object.keys(rows[0]);
fs.writeFileSync(OUT_CSV, [head.join(','), ...rows.map((r) => head.map((k) => esc(r[k])).join(','))].join('\n') + '\n');

const T = dry.totals || {}; const sum = (k) => ev.reduce((n, x) => n + (Number(x[k]) || 0), 0);
const uniqPairs = new Set(rows.map((r) => `${r.lesson_id}:${r.student_id}`)).size, uniqStudents = new Set(rows.map((r) => r.student_id)).size;
const sendRows = rows.filter((r) => r.bizda_holat === 'yuboriladi');
const compFlip = sendRows.filter((r) => r.eski_completed !== r.yangi_completed);
const ansChg = sendRows.filter((r) => String(r.eski_answered) !== String(r.yangi_answered));
const totChg = ev.filter((x) => String(x.oldTotal) !== String(x.newTotal) && x.action === 'send');
const corrChg = sendRows.filter((r) => String(r.eski_correct) !== String(r.yangi_correct));
const badgeSend = badgeRows.filter((b) => sendRows.some((r) => r.event_id === b.event_id && r.student_id === b.student_id));
const oldIds = [...new Set(rows.filter((r) => r.lesson_id_hozir).map((r) => `${r.lesson_id} → ${r.lesson_id_hozir}`))];
const missingReestr = [...new Set(rows.filter((r) => !r.lesson_version_hozir).map((r) => r.lesson_id))];

const L = [];
L.push(`# Abdullohga: 50 ta xabar — sinov rejimida qayta yig'ish hisoboti, 2-nashr (hech narsa yuborilmagan)`);
L.push('');
L.push(`**Sana:** ${new Date().toISOString().slice(0, 10)} · **Asos:** sizning 18-javobingiz (bizda ${C('19-ABDULLOH-16-17-JAVOB-UZ.md')}), 8-bo'lim talablari · **Jadval:** ${C('20a-50-XABAR-HISOBOT-V2.csv')} (${rows.length} qator = o'quvchi × xabar)`);
L.push(`**Manba:** prod Dars API ${C(health.version)}, qayta yig'ish ${C('dry: true')} — bazaga yozilmadi, School API'ga yuborilmadi. 17-hisobot (1-nashr) bekor, bu nashr uning o'rnini bosadi.`);
L.push('');
L.push(`## 0. 1-nashrdan keyin nima o'zgardi (sizning javobingiz bo'yicha)`);
L.push('');
L.push(`| № | O'zgarish | Sabab (18-javob) | Natija shu hisobotda |`);
L.push(`|---|---|---|---|`);
L.push(`| 1 | Qisman tafsilot bekor: validator tenglikka qaytdi (F-1109-02, prod 17:04) | §2 — School API ${C('answered = questions')} tengligini tekshiradi | Qisman qator YO'Q. 14:24–16:48 da 20 oddiy hodisa 422 olgan edi, qayta yuborildi, qabul qilindi |`);
L.push(`| 2 | Amaliyot ekrani (kalit ${C('-1')}) ${C('tests')} hisobidan chiqdi: ${C('answered')}, ${C('correct_answers')}, ${C('total_questions')}, ${C('questions[]')} | §2 — tekshiruvsiz «Bajardim» tekshirilgan to'g'ri javob emas, ${C('correct:null')} kelishuvi | ${ansChg.length} qatorda ${C('answered')} kamaydi (amaliyot chiqdi), tafsilot shu o'quvchilarda endi to'liq |`);
L.push(`| 3 | Jonli ${C('completed')} faqat ${C('reached_end')} (oxirgi o'quv ekraniga yetganlik) | §4 — kelishilgan mezon | 30321 · ${C('css-01-v17')}: ${C('completed')} ${C('false')} qoladi (quyida dalil) |`);
L.push(`| 4 | Qayta yig'ishda ${C('total_questions')} = hodisa yopilgan paytdagi total (saqlangan xabardan) − shu sessiyada bajarilgan amaliyot ekrani | §8.2 — nishon o'zgarishi sababi | 1-nashrdagi 20 ta ${C('html-practice-portfolio-v2')} nishon-o'zgarishi BIZNING XATO edi (dars 16.10 da 6 test → 1 test, eski kalitlar bazada qolib total 6→7); endi total tarixiy |`);
L.push(`| 5 | Chiqarilgan har qator uchun o'rnini bosgan hodisa ${C('event_id')}, holati, yetkazilgan vaqti | §8.1 | 1-bo'lim jadvali |`);
L.push(`| 6 | Tarixiy versiya ustuni ${C('lesson_version_tarixiy')} (LMS yuklash jurnali bo'yicha, sessiya kuniga) va ${C('dalil')} ustuni | §8.3 | CSV |`);
L.push(`| 7 | ${C('event_id')} o'sha qoladi, ${C('_r1')} avtomatik qo'shilmaydi | §8.4 | Qabul |`);
L.push('');
L.push(`## 1. Yig'ma`);
L.push('');
L.push(`| | Soni |`);
L.push(`|---|---|`);
L.push(`| Xabarlar | ${ev.length} (jonli ${ev.filter((x) => x.mode === 'live').length}, uyda ${ev.filter((x) => x.mode === 'solo').length}) |`);
L.push(`| O'quvchi natijasi yozuvlari (eski xabarlarda) | ${rows.length} |`);
L.push(`| Noyob o'quvchi | ${uniqStudents} · noyob o'quvchi + dars: ${uniqPairs} |`);
L.push(`| Qayta yig'ilganda yuboriladigan yozuvlar (NOMZOD, tasdiqlangan ro'yxat emas) | ${T.students ?? sum('after')} |`);
L.push(`| Bizda chiqariladi (o'rnini bosgan hodisa 2-bo'limda) | ${sum('excluded')} |`);
L.push(`| ${C('total_questions')} o'zgargan xabarlar | ${totChg.length}${totChg.length ? ` (${totChg.map((x) => `${x.lesson_id}: ${x.oldTotal}→${x.newTotal}`).join('; ')})` : ''} |`);
L.push(`| ${C('answered')} o'zgaradi | ${ansChg.length} (hammasi amaliyot ekrani chiqqani uchun, ${C('ozgarish_sababi')} ustuni) |`);
L.push(`| ${C('correct_answers')} o'zgaradi | ${corrChg.length} qatorda, jami ${sum('dCorrect') >= 0 ? '+' : ''}${sum('dCorrect')}: oshgani ${corrChg.filter((r) => Number(r.yangi_correct) > Number(r.eski_correct)).length} (kalit bo'yicha qayta hisob, F-1106-01), kamaygani ${corrChg.filter((r) => Number(r.yangi_correct) < Number(r.eski_correct)).length} (amaliyot ekrani ${C('correct_answers')} dan chiqdi) |`);
L.push(`| ${C('completed')} o'zgaradi | ${compFlip.length}${compFlip.length ? ` — hammasi ${C('true')} → ${C('false')}: eski xabarda «hamma savolga javob berdi» zaxira qoidasi bilan tugatgan hisoblangan, urinish jadvalida ${C('reached_end')} yo'q (${compFlip.map((r) => `${r.lesson_id} · ${r.student_id}`).join('; ')})` : ''} |`);
L.push(`| ${C('badges')} o'zgaradi (yuboriladigan qatorlarda) | ${badgeSend.length} — sabablari 3-bo'limda |`);
L.push(`| Tafsilot | ${[...causes.entries()].map(([k, v]) => `${C(k)} ${v}`).join(' · ')} |`);
L.push(`| Tarixdan chiqarilgan urinishlar | ${sum('attDropped')} (jonli: ikkinchi urinish; uyda: boshqa dars versiyasi) |`);
L.push(`| Xabar holati | yuboriladi ${ev.filter((x) => x.action === 'send').length} · butunlay chiqariladi ${ev.filter((x) => x.action === 'skip').length} · xato ${ev.filter((x) => x.action === 'error').length} |`);
L.push('');
L.push(`**Tafsilot holatlari.** ${C("to'liq")} — ${C('answered')} = ${C('questions[]')}, har yozuvda matn va kalit. ${C('tushirildi: invalid_text')} — bitta dars (${C('pg-crud-04-05-v18')}), matn o'rniga ${C('[object Object]')} yozilgan: asosiy natija ketadi, tafsilot yo'q. ${C('tushirildi: matnsiz savol')} — test savoli (haqiqiy kalitli maxsus ekran) matnsiz yozilgan: tenglik buzilmasin deb o'sha o'quvchining tafsiloti tushiriladi, asosiy natija ketadi; 172 dars relizida bunday ekranlar matn yozadigan bo'ladi.`);
L.push('');
L.push(`**${C('completed')} pasaygan ${compFlip.length} o'quvchi haqida.** Bu sizning 4-bo'limingizdagi talabning to'g'ridan-to'g'ri natijasi: tugatganlik faqat oxirgi o'quv ekraniga yetganlik bilan o'lchanadi. Hammasida testlar to'liq javoblangan, lekin urinish yozuvida ${C('reached_end')} yo'q (sessiya ${C('live_ended')} bilan yopilgan). Eski xabar ularni zaxira qoida bilan tugatgan deb yuborgan edi; yangi xabarda ${C('completed: false')}, ${C('graduate')} nishoni yo'q, coin huquqi yo'q. Agar siz bu o'quvchilar uchun CRM tarixida boshqa dalil ko'rsangiz, qatorni belgilang — alohida ko'rib chiqamiz.`);
L.push('');
L.push(`## 2. Chiqarilgan ${excludedRows.length} yozuv — o'rnini bosgan hodisa (8.1)`);
L.push('');
L.push(`Qoida: shu o'quvchining shu dars bo'yicha ${C('completed: true')} natijasi boshqa hodisada yetkazilgan (${C('delivered')}) yoki shu to'plamda oldinroq yuboriladi. «Yetkazilgan» coin berilganini bildirmaydi — buni siz reyestr bilan tekshirasiz; biz faqat hodisani ko'rsatamiz.`);
L.push('');
L.push(`| Chiqarilgan hodisa | Dars | O'quvchi | O'rnini bosgan hodisa | Holati | Yetkazilgan (UTC) |`);
L.push(`|---|---|---|---|---|---|`);
for (const x of excludedRows) L.push(`| ${C(x.event_id)} | ${x.lesson_id} | ${x.student_id} | ${x.orniga ? C(x.orniga) : '—'} | ${x.holat} | ${x.vaqt || '—'} |`);
L.push('');
L.push(`## 3. ${C('badges')} o'zgargan ${badgeSend.length} yozuv — sabablari (8.2)`);
L.push('');
L.push(`Nishon qoidalari (o'zgarmagan): ${C('all_correct')} = correct = total · ${C('first_try')} = hammasiga birinchi urinishda to'g'ri · ${C('speedster')} = guruh medianasidan tez va nisbat ≥ 0.8 · ${C('graduate')} = completed · ${C('top_N')} = podium · ${C('participant')} = ro'yxat bo'sh qolganda o'rnini bosuvchi (nishon emas). Sabab ustunida qaysi kirish o'zgargani yozilgan.`);
L.push('');
L.push(`| Hodisa | Dars | O'quvchi | Eski | Yangi | Sabab |`);
L.push(`|---|---|---|---|---|---|`);
for (const b of badgeSend) L.push(`| ${C(b.event_id)} | ${b.lesson_id} | ${b.student_id} | ${b.eski || '—'} | ${b.yangi || '—'} | ${b.sabab} |`);
L.push('');
L.push(`## 4. 30321 · ${C('css-01-v17')} · ${C('sess_819195_20261012T103453Z')} (4-bo'lim)`);
L.push('');
const s30 = rows.find((r) => r.student_id === '30321' && r.event_id === 'sess_819195_20261012T103453Z');
const sess30 = sessById.get('sess_819195_20261012T103453Z');
const p30 = sess30 ? (sess30.participants || []).find((p) => String(p.subject_id) === '30321') : null;
L.push(`- Sessiya: mentor yopgan (${C(sess30?.session?.end_reason || '')}, ${sess30?.session?.finished_at || ''}); o'quvchilar ${sess30 ? (sess30.participants || []).filter((p) => p.role === 'student').length : '?'}, oxiriga yetgan (${C('reached_end')}) ${sess30 ? (sess30.participants || []).filter((p) => p.role === 'student' && p.reached_end).length : '?'}.`);
L.push(`- 30321: urinish ${C(p30?.attempt_status || '')}, yakun sababi ${C(p30?.finish_reason || '')}, ${C('reached_end')} = **${p30 ? String(p30.reached_end) : '?'}**; bazada javob ${p30?.answers ?? '?'} (to'g'ri ${p30?.correct ?? '?'}), matnli urinish ${p30?.attempts ?? '?'}.`);
L.push(`- 1-nashrdagi «5-javob» — ${C('s15')} yakuniy amaliyot ekrani (CSS qoidasini qo'lda yozish; kod uni tekshiradi, lekin savol-variant matni yo'q). Endi u ${C('tests')} hisobiga kirmaydi: ${C('answered')} ${s30?.eski_answered}→${s30?.yangi_answered}, ${C('correct_answers')} ${s30?.eski_correct}→${s30?.yangi_correct}, ${C('total')} ${s30?.eski_total}→${s30?.yangi_total}.`);
L.push(`- ${C('completed')}: **${s30?.yangi_completed}** (${C('reached_end')} ${s30?.reached_end}). Yangi yakunlash va coin huquqi YO'Q — sizning talabingizga mos.`);
L.push('');
L.push(`## 5. ${C('pm-m2d13-v1')} (3-bo'lim)`);
L.push('');
L.push(`- Dars id ${C('pm-m2d13-v1')} → ${C('pm-m2d13-v2')} 19.10.2026 da o'zgargan (pitch darslari qisqartirilganda, bizning commit ${C('ffd6e14a')}); 19.10 relizida LMS'ga v2 yuklangan. 7 natija 21–25.09 dagi, ya'ni sentyabr LMS tuzilmasi (o'sha paytdagi Class'ni bizning reestr bilmaydi, reestr 19.10 dan yuritiladi).`);
L.push(`- 16a reestrga ${C('eski_lesson_id')} ustuni qo'shildi${oldIds.length ? ` (shu hisobotda: ${oldIds.map(C).join(', ')})` : ''}. Bu faqat «qaysi dars» mosligi; o'sha kundagi CRM Class/Learn'ni siz tasdiqlaysiz, biz avtomatik birlashtirmaymiz.`);
if (missingReestr.length) L.push(`- Reestrda topilmagan dars id'lari: ${missingReestr.map(C).join(', ')}.`);
L.push('');
L.push(`## 6. Tarixiy versiya dalili (8.3)`);
L.push('');
L.push(`- ${C('lesson_version_tarixiy')} — sessiya kunida LMS'da turgan versiya (LMS yuklash jurnali bo'yicha: 19.10 to'liq reliz v3, keyingi yuklashlar sana bilan). 19.10 dan oldingi sessiyalar uchun «reestr oldi (sentyabr yuklash)». ${C('lesson_version_hozir')} — hozirgi versiya, yordamchi.`);
L.push(`- ${C('dalil')} — baholashga ishlatilgan savol/variant/kalit mosligi: tafsilotdagi matnlar o'quvchi javob bergan PAYTDA yozilgan (${C('answer_attempts.texts')}), qayta yig'ishda kalit shu matnga tekshiriladi (${C('correct_answer')} = ${C('options[correct_option]')}); mos kelmasa yozuv chiqariladi (${C('chiqarilgan_urinishlar')}) yoki tafsilot tushiriladi (${C('version_mismatch')}). Ya'ni dalil hodisaning ichida: har savolda matn + kalit + o'quvchi javobi.`);
L.push(`- Hozir ${C('attempts')} da versiya ustuni yo'q (16-hujjat 4.2 rejasi) — shuning uchun versiya jurnal bo'yicha, kalit↔matn tekshiruvi esa yozuv darajasida.`);
L.push('');
L.push(`## 7. Xabarlar bo'yicha`);
L.push('');
L.push(`| # | Sana | ${C('event_id')} | Rejim | Dars | Eski xato | Total eski→yangi | O'quvchi: eski → yangi | Chiqarildi | ${C('correct')} o'zgardi | reached_end | Holat |`);
L.push(`|---|---|---|---|---|---|---|---|---|---|---|---|`);
ev.forEach((x, i) => L.push(`| ${i + 1} | ${x.sana} | ${C(x.event_id)} | ${x.mode} | ${x.lesson_id} | ${x.oldErr} | ${x.oldTotal}→${x.newTotal} | ${x.before} → ${x.after} | ${x.excluded} | ${x.correct_changes}${x.dCorrect ? ` (${x.dCorrect > 0 ? '+' : ''}${x.dCorrect})` : ''} | ${x.reachedEnd || '—'} | ${x.action === 'send' ? 'yuboriladi' : x.action === 'skip' ? 'chiqariladi' : `xato: ${x.error}`} |`));
L.push('');
L.push(`## 8. CSV ustunlari`);
L.push('');
L.push(`| Ustun | Ma'nosi |`);
L.push(`|---|---|`);
L.push(`| ${C('event_id')}, ${C('sana')}, ${C('mode')}, ${C('lesson_id')} | Xabar va dars (${C('lesson_id')} — o'sha paytdagi tashqi id) |`);
L.push(`| ${C('lesson_id_hozir')}, ${C('class_id')}, ${C('learn_id')} | Reestrdagi hozirgi id va bog'lanish (eski id bo'lsa ${C('eski_lesson_id')} orqali); Class/Learn'ni siz tasdiqlaysiz |`);
L.push(`| ${C('lesson_version_tarixiy')} / ${C('lesson_version_hozir')} | Sessiya kunidagi versiya (yuklash jurnali) / hozirgi |`);
L.push(`| ${C('student_id')}, ${C('takror')} | LMS id; shu o'quvchi + dars 50 ta xabarning boshqasida ham bor |`);
L.push(`| ${C('eski_xato')} | School API'ning 422 sababi |`);
L.push(`| ${C('eski_total')} / ${C('yangi_total')} | Xabardagi ${C('total_questions')} |`);
L.push(`| ${C('eski_*')} / ${C('yangi_*')} | 422 olgan xabardagi / qayta yig'ilgan qiymat |`);
L.push(`| ${C('ozgarish_sababi')} | Har o'zgargan qiymat uchun sabab (amaliyot ekrani chiqdi · kalit bo'yicha qayta hisob · reached_end) |`);
L.push(`| ${C('reached_end')}, ${C('urinish_yakuni')} | Jonli: urinish jadvalidan (oxirgi ekranga yetganmi, qanday yakunlangan); uyda: urinish holatidan |`);
L.push(`| ${C('tafsilot')} | ${C("to'liq")} · ${C('tushirildi: matnsiz savol')} (test savoli matnsiz — maxsus ekran) · ${C('tushirildi: invalid_text')} ([object Object], bitta dars) · ${C('tushirildi: version_mismatch')} · ${C('tushirildi: size')} |`);
L.push(`| ${C('dalil')} | Tafsilot matni javob paytida yozilgan, kalit↔matn mos (savol/urinish soni) |`);
L.push(`| ${C('chiqarilgan_urinishlar')} | Savol tarixidan olib tashlangan urinishlar soni va sababi |`);
L.push(`| ${C('bizda_holat')} | ${C('yuboriladi')} (nomzod) · ${C('chiqariladi')} · ${C('manbada topilmadi')} |`);
L.push(`| ${C('orniga_hodisa')}, ${C('orniga_holat')}, ${C('orniga_yetkazilgan')} | Chiqarilgan qator uchun o'rnini bosgan hodisa |`);
L.push(`| ${C('sizda_tekshirish')} | Bo'sh — CRM brauzer tarixi va coin reyestri bo'yicha sizning belgingiz |`);
L.push('');
L.push(`## 9. Tartib (o'zgarmagan)`);
L.push('');
L.push(`Siz ${C('yuboriladi')} qatorlardan tasdiqlanganlarini belgilaysiz → bitta xabar (${C('event_id')} o'sha, suffix yo'q) → sizda saqlash va haqiqiy mukofot tekshiruvi → qolganlari. Bizda saqlangan chiqsa — avval aniqlaymiz, ${C('_r1')} avtomatik emas.`);
L.push('');
fs.writeFileSync(OUT_MD, L.join('\n'));
console.log(JSON.stringify({ rows: rows.length, events: ev.length, send: ev.filter((x) => x.action === 'send').length, skip: ev.filter((x) => x.action === 'skip').length, error: ev.filter((x) => x.action === 'error').length, excluded: sum('excluded'), excluded_with_event: excludedRows.filter((x) => x.orniga).length, dCorrect: sum('dCorrect'), ansChg: ansChg.length, compFlip: compFlip.length, totChg: totChg.length, badgeSend: badgeSend.length, causes: [...causes.entries()], sessions: sessById.size, oldIds, missingReestr }));
