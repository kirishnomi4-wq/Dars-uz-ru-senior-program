# Axadulla 25.09 hujjatidagi 4 jadvalni SQLite'da qayta quradi, prod-paket payload'larini ularga «yozadi»
# (hujjatdagi ustun→payload moslik bo'yicha) va har ustun/qoidani tekshiradi.
import json, sqlite3, sys, collections, re

rows = json.load(open(sys.argv[1]))
db = sqlite3.connect(':memory:')
db.executescript('''
create table jsx_lesson_results(id integer primary key, lms_student_id, lesson_id, source_lesson_id, lesson_title_uz, lesson_title_ru,
  lang, live_mode, details_version, completed, passed, final_score, final_total, total_questions, correct_answers, score_percent,
  duration_sec, total_screens, started_at, finished_at, retake_pressed, retake_total_questions, retake_correct_answers,
  retake_score_percent, retake_duration_sec, missed_question_ids, truncated, truncated_fields, questions_present, achievements_present,
  scen, file, bytes);
create table jsx_lesson_questions(id integer primary key, jsx_lesson_result_id, source_question_id, kind, position, question_order,
  question_text, options_json, correct_option, correct_answer, first_try_correct, solved, attempts_present);
create table jsx_lesson_attempts(id integer primary key, jsx_lesson_question_id, position, attempt_number, selected_option, answer_text,
  is_correct, elapsed_ms, answered_at);
create table jsx_lesson_achievements(id integer primary key, jsx_lesson_result_id, position, source_achievement_id, name, title, earned_at);
''')
b = lambda v: None if v is None else (1 if v else 0)
miss = collections.Counter()   # payload'da yo'q bo'lgan maydon → nechta yurishda
fails = []
student = 0
for r in rows:
    p = r.get('payload')
    if not p:
        fails.append((r.get('name'), r.get('scen'), r.get('errs'), r.get('err'))); continue
    for k in ['lessonId','lessonTitle','lang','liveMode','detailsVersion','passed','finalScore','finalTotal','totalQuestions','correctAnswers',
              'scorePercent','durationSec','totalScreens','startedAt','finishedAt','retake','missed','truncated','questions','achievements']:
        if k not in p: miss[(k, r['scen'])] += 1
    student += 1
    rt = p.get('retake') or {}
    lp = rt.get('lastPass') or {}
    cur = db.execute('insert into jsx_lesson_results values(null,?,?,?,?,?,?,?,?,1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', (
        student, None, p.get('lessonId'), (p.get('lessonTitle') or {}).get('uz'), (p.get('lessonTitle') or {}).get('ru'),
        p.get('lang'), p.get('liveMode'), p.get('detailsVersion'), b(p.get('passed')), p.get('finalScore'), p.get('finalTotal'),
        p.get('totalQuestions'), p.get('correctAnswers'), p.get('scorePercent'), p.get('durationSec'), p.get('totalScreens'),
        p.get('startedAt'), p.get('finishedAt'), b(rt.get('pressed')) if p.get('retake') is not None else None,
        lp.get('totalQuestions'), lp.get('correctAnswers'), lp.get('scorePercent'), lp.get('durationSec'),
        json.dumps(p.get('missed')) if 'missed' in p else None, b(p.get('truncated')), json.dumps(p.get('truncatedFields')) if p.get('truncatedFields') else None,
        1 if isinstance(p.get('questions'), list) else 0, 1 if isinstance(p.get('achievements'), list) else 0,
        r['scen'], r['mod'] + '/' + r['name'], len(json.dumps(p, ensure_ascii=False).encode())))
    rid = cur.lastrowid
    for pos, q in enumerate(p.get('questions') or []):
        c = db.execute('insert into jsx_lesson_questions values(null,?,?,?,?,?,?,?,?,?,?,?,?)', (rid, q.get('question_id'), q.get('kind'), pos,
            q.get('order'), q.get('question'), json.dumps(q.get('options'), ensure_ascii=False) if 'options' in q else None, q.get('correct_option'),
            q.get('correct_answer'), b(q.get('correct')), b(q.get('solved')), 1 if isinstance(q.get('attempts'), list) else 0))
        for apos, a in enumerate(q.get('attempts') or []):
            db.execute('insert into jsx_lesson_attempts values(null,?,?,?,?,?,?,?,?)', (c.lastrowid, apos, a.get('n'), a.get('option'),
                a.get('answer'), b(a.get('correct')), a.get('elapsed_ms'), a.get('at')))
    for pos, a in enumerate(p.get('achievements') or []):
        db.execute('insert into jsx_lesson_achievements values(null,?,?,?,?,?,?)', (rid, pos, a.get('id'), a.get('name'), a.get('title'), a.get('earned_at')))

Q = lambda s, *a: db.execute(s, a).fetchall()
print('== YURISHLAR', len(rows), '· payload', student, '· yiqilgan', len(fails))
for f in fails[:10]: print('   ✗', f)
print('== payload\'da YO\'Q maydonlar (maydon, ssenariy): soni'); [print('  ', k, v) for k, v in sorted(miss.items())]
print('== jadval hajmi', {t: Q(f'select count(*) from {t}')[0][0] for t in ['jsx_lesson_results','jsx_lesson_questions','jsx_lesson_attempts','jsx_lesson_achievements']})
print('== dars soni (source_lesson_id)', Q("select count(distinct source_lesson_id) from jsx_lesson_results")[0][0])
print('== hajm bayt: min/avg/max', Q('select min(bytes), avg(bytes), max(bytes) from jsx_lesson_results')[0], '· truncated=1:', Q('select count(*) from jsx_lesson_results where truncated=1')[0][0])

# 1. correct_answers (asosiy ball) vs savollar jadvalidan qayta hisob
r1 = Q('''select r.file, r.scen, r.total_questions, r.correct_answers,
  (select count(*) from jsx_lesson_questions q where q.jsx_lesson_result_id=r.id and q.kind='test') tq,
  (select count(*) from jsx_lesson_questions q where q.jsx_lesson_result_id=r.id and q.kind='test' and q.first_try_correct=1) tc
  from jsx_lesson_results r where r.scen='A-uz' ''')
mism = [x for x in r1 if x[2] != x[4]]
print(f'== 1) total_questions ≠ savollar(test) soni: {len(mism)}/{len(r1)} dars')
for x in mism[:12]: print('    ', x[0], 'total', x[2], '· test-qator', x[4], '· correct', x[3], 'vs', x[5])
zero = [x for x in r1 if x[4] == 0]
print(f'   savollar jadvalida 0 ta test-savol: {len(zero)} dars', [x[0] for x in zero][:12])

# 2. missed vs first_try_correct=0
bad = 0
for rid, missed in Q("select id, missed_question_ids from jsx_lesson_results"):
    m = set(json.loads(missed or '[]'))
    w = {x[0] for x in Q("select source_question_id from jsx_lesson_questions where jsx_lesson_result_id=? and kind='test' and first_try_correct=0", rid)}
    if m != w: bad += 1
print('== 2) missed ≠ (test & first_try_correct=0):', bad)

# 3. dars ichida takror source_question_id
d = Q("select r.file, q.source_question_id, count(*) from jsx_lesson_questions q join jsx_lesson_results r on r.id=q.jsx_lesson_result_id where r.scen='C-live' group by q.jsx_lesson_result_id, q.source_question_id having count(*)>1")
print('== 3) bitta natijada takror question_id:', len(d), d[:5])
# 3b. darslar orasida bir xil source_question_id
d2 = Q("select q.source_question_id, count(distinct r.source_lesson_id) n from jsx_lesson_questions q join jsx_lesson_results r on r.id=q.jsx_lesson_result_id where r.scen='A-uz' group by 1 having n>1 order by n desc")
print(f'== 3b) bir xil question_id bir nechta darsda: {len(d2)} id, eng ko\'pi', d2[:6])

# 4. arena
print('== 4) arena qatorlari (C-live):', Q("select count(*), sum(correct_option is null), sum(question_text is null), sum(options_json is null) from jsx_lesson_questions q join jsx_lesson_results r on r.id=q.jsx_lesson_result_id where r.scen='C-live' and q.kind='arena'")[0], '(jami, correct_option NULL, matn NULL, variant NULL)')
print('   arena missed\'ga kiradimi:', Q("select count(*) from jsx_lesson_results where scen='C-live' and missed_question_ids like '%quiz-%'")[0][0])

# 5. selected_option = -1, answer NULL
print('== 5) selected_option=-1:', Q('select count(*) from jsx_lesson_attempts where selected_option=-1')[0][0], '· answer_text NULL:', Q('select count(*) from jsx_lesson_attempts where answer_text is null')[0][0])
# 6. bir xil answered_at
print('== 6) bir savolda bir xil answered_at juftliklari:', Q('select count(*) from (select jsx_lesson_question_id, answered_at, count(*) c from jsx_lesson_attempts group by 1,2 having c>1)')[0][0])
# 7. elapsed_ms monoton (ekran ochilgandan beri jami) — bitta savol ichida o'sadimi
print('== 7) elapsed_ms kamaygan juftlik:', Q('select count(*) from jsx_lesson_attempts a join jsx_lesson_attempts b on a.jsx_lesson_question_id=b.jsx_lesson_question_id and b.position=a.position+1 where b.elapsed_ms<a.elapsed_ms')[0][0])

# 8. til: bitta savol uz/ru matni farqli
print('== 8) uz vs ru: bir xil (dars, question_id), boshqa question_text:', Q('''select count(*) from jsx_lesson_questions a join jsx_lesson_results ra on ra.id=a.jsx_lesson_result_id and ra.scen='A-uz'
  join jsx_lesson_results rb on rb.source_lesson_id=ra.source_lesson_id and rb.scen='A-ru' join jsx_lesson_questions b on b.jsx_lesson_result_id=rb.id and b.source_question_id=a.source_question_id
  where a.question_text != b.question_text''')[0][0])
print('   ru yurishda lang:', Q("select lang, count(*) from jsx_lesson_results where scen='A-ru' group by 1"))

# 9. retake
print('== 9) retake: ', Q("select scen, retake_pressed, count(*), sum(retake_correct_answers is null), sum(retake_duration_sec is null) from jsx_lesson_results group by 1,2"))
# 10. passed / final
print('== 10) final_total=0 bo\'lgan darslar:', Q("select count(*) from jsx_lesson_results where scen='A-uz' and final_total=0")[0][0], '· final_total>1:', Q("select count(*) from jsx_lesson_results where scen='A-uz' and final_total>1")[0][0])
# 11. lessonId versiya-qo'shimchasi
ids = [x[0] for x in Q("select distinct source_lesson_id from jsx_lesson_results")]
print('== 11) lessonId -vNN bilan:', sum(1 for i in ids if re.search(r'-v\d+$', i)), '/', len(ids), ids[:6])
# 12. vaqt formati
print('== 12) vaqt Z-formatda emas:', Q("select count(*) from jsx_lesson_results where started_at not like '____-__-__T__:__:__Z' or finished_at not like '____-__-__T__:__:__Z'")[0][0],
      '· started_at NULL:', Q('select count(*) from jsx_lesson_results where started_at is null')[0][0])
# 13. nishon
print('== 13) nishonlar: jami', Q('select count(*) from jsx_lesson_achievements')[0][0], '· achievements bo\'sh natija:', Q('select count(*) from jsx_lesson_results r where not exists(select 1 from jsx_lesson_achievements a where a.jsx_lesson_result_id=r.id)')[0][0])
# 14. JOIN tuzog'i: ko'paygan qatorlar bo'yicha o'rtacha ball
print('== 14) o\'rtacha score_percent: to\'g\'ri', round(Q("select avg(score_percent) from jsx_lesson_results where scen='A-uz'")[0][0],1),
      '· JOIN bilan (xato)', round(Q("select avg(r.score_percent) from jsx_lesson_results r join jsx_lesson_questions q on q.jsx_lesson_result_id=r.id where r.scen='A-uz'")[0][0],1))
# 15. eng qiyin savol so'rovi (ular tavsiya qilgan)
print('== 15) hujjatdagi «qiyin savol» so\'rovi ishlaydimi (top 3):', Q("""select r.source_lesson_id, q.source_question_id, avg(1-q.first_try_correct) err
  from jsx_lesson_questions q join jsx_lesson_results r on r.id=q.jsx_lesson_result_id where q.kind='test' group by 1,2 order by err desc limit 3"""))
