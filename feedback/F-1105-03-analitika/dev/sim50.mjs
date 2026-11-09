// 50 prod payload → yangi builder bilan detallarni qayta qurish (payload'dan tiklangan manba), validator + correct o'zgarishi
import fs from 'node:fs';
import path from 'node:path';
const dir = process.argv[2];
const B = await import(path.resolve('src/modules/results/result-builder.js'));
let ev = 0, stu = 0, ok = 0, bad = [], dCorrect = 0, changedStu = 0, droppedAtt = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('ev_'))) {
  const e = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); const p = e.payload; ev++;
  for (const s of p.students) {
    stu++;
    const qs = (s.questions || []).filter((q) => q.kind === 'test');
    if (!qs.length) { ok++; continue; }
    const keys = qs.map((q) => ({ question_id: q.question_id, correct_idx: Number.isInteger(q.correct_option) ? q.correct_option : -1 }));
    const answers = [], attempts = [];
    qs.forEach((q, i) => {
      const sc = i + 1;
      answers.push({ question_id: q.question_id, screen_idx: sc, picked: q.attempts[0].option, correct: q.attempts[0].correct, elapsed_ms: q.attempts[0].elapsed_ms, answered_at: q.attempts[0].at });
      q.attempts.forEach((a, j) => {
        const same = a.option >= 0 && a.option < q.options.length && a.answer === q.options[a.option];
        attempts.push({ screen_idx: sc, question_id: q.question_id, attempt_no: j + 1, picked: a.option, correct: a.correct, elapsed_ms: a.elapsed_ms, answered_at: a.at,
          texts: { question: q.question, options: same || j === 0 ? q.options : [...q.options.slice(0, -1), `${a.answer} (boshqa versiya)`], picked: a.answer, correct: q.correct_answer, lang: s.lang } });
      });
    });
    const d = B.buildStudentDetails({ answers, attempts, keys, achievements: [], catalog: [], mode: p.mode });
    droppedAtt += qs.reduce((n, q) => n + q.attempts.length, 0) - d.questions.reduce((n, q) => n + q.attempts.length, 0);
    const before = qs.filter((q) => q.correct).length, after = d.questions.filter((q) => q.correct).length;
    dCorrect += after - before; if (after !== before) changedStu++;
    const errs = B.validateStudentDetails({ id_type: 'lms', student_id: s.student_id, answered: d.questions.length, correct_answers: after, ...d }, p.mode);
    if (errs.length) bad.push(`${e.event_id} ${s.student_id}: ${errs.join(', ')}`); else ok++;
  }
}
console.log({ ev, stu, ok, bad: bad.length, dCorrect, changedStu, droppedAtt });
bad.slice(0, 5).forEach((b) => console.log(b));
