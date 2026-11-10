#!/usr/bin/env python3
"""RU tarjima (M24) — barcha mentor darslarida BIR XIL qolipdagi ekranlar: o'z-sinov (yakuniy), yakun va muqova.
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/ru-umumiy.py <dars-papka>
- Umumiy matnlar (tugma, yorliq, Stage kicker) — t('uz', 'ru') bilan shu yerda (manba: nest2 ruschasi, 03.11 tasdiqlangan uslub).
- Darsga xos matnlar RS('KALIT') orqali ru/<dars>-sahna.js dagi RU_S dan: FIN_INTRO, FIN_PASS, YAK (segmentlar), CHEAT, FILE,
  NEXT_T, NEXT_D, TITLE, COVER, EYEBROW. RS(), yakRu() — ru-qur.py yozadigan 09-ru.gen.jsx da.
- Qayta yurgizish xavfsiz: o'rnatilgani qayta qo'yilmaydi. Bo'laklar arxiv/F-1105-ru-oldin/<dars>/ da (ru-sahna-qoy.py birinchi yurishi)."""
import re, sys, glob, shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]
P = ROOT / f'src/mentor-kurs/{d}/parts'
B = ROOT / f'arxiv/F-1105-ru-oldin/{d}'
if not B.exists():
  B.mkdir(parents=True)
  for f in glob.glob(str(P / '0[4-8]*.jsx')): shutil.copy2(f, B)
f = next(Path(x) for x in sorted(glob.glob(str(P / '0[4-8]*.jsx'))) if 'Sinovni qayta topshirish' in Path(x).read_text())
s = s0 = f.read_text()
EX = [  # aniq almashtirishlar (uz → t(uz, ru))
  ('kicker="O\'z-sinov"', 'kicker={t("O\'z-sinov", \'Самопроверка\')}'),
  ("lockHint={!finished ? 'Savollarga javob bering' : 'Natijani oching'}", "lockHint={!finished ? t('Savollarga javob bering', 'Ответьте на вопросы') : t('Natijani oching', 'Откройте результат')}"),
  ("<p className=\"mk-eyebrow\">O'z-sinov · natija{attempt > 1 ? ` · ${attempt}-urinish` : ''}</p>", "<p className=\"mk-eyebrow\">{t(\"O'z-sinov · natija\", 'Самопроверка · результат')}{attempt > 1 ? t(` · ${attempt}-urinish`, ` · попытка ${attempt}`) : ''}</p>"),
  ('{score >= 6 ? "dars o\'zlashtirildi" : "yana bir ko\'rib chiqing"}', '{score >= 6 ? t("dars o\'zlashtirildi", \'урок усвоен\') : t("yana bir ko\'rib chiqing", \'посмотрите ещё раз\')}'),
  ('>{f.s}-ekran</button>', '>{t(`${f.s}-ekran`, `экран ${f.s}`)}</button>'),
  ('>Sinovni qayta topshirish</button>', ">{t('Sinovni qayta topshirish', 'Пройти тест заново')}</button>"),
  ('>Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.</span>', ">{t('Ekranga qaytib «Davom» bossangiz, shu natijaga qaytasiz.', 'Если вернётесь к экрану и нажмёте «Далее», попадёте обратно к этому результату.')}</span>"),
  ("<p className=\"mk-eyebrow\">O'z-sinov · {i + 1} / {FINAL.length} · bitta urinish · to'g'ri: {score}</p>", "<p className=\"mk-eyebrow\">{t(\"O'z-sinov\", 'Самопроверка')} · {i + 1} / {FINAL.length} · {t(\"bitta urinish · to'g'ri:\", 'одна попытка · верно:')} {score}</p>"),
  ('{picked === q.c ? "To\'g\'ri" : "Noto\'g\'ri — to\'g\'risi yashil"}', '{picked === q.c ? t("To\'g\'ri", \'Верно\') : t("Noto\'g\'ri — to\'g\'risi yashil", \'Неверно — правильный ответ зелёный\')}'),
  ("{i < FINAL.length - 1 ? 'Keyingi savol →' : \"Natijani ko'rish →\"}", "{i < FINAL.length - 1 ? t('Keyingi savol →', 'Следующий вопрос →') : t(\"Natijani ko'rish →\", 'Посмотреть результат →')}"),
  ('kicker="Yakun"', "kicker={t('Yakun', 'Итог')}"),
  ('nextLabel="Darsni yakunlash"', "nextLabel={t('Darsni yakunlash', 'Завершить урок')}"),
  ('lockHint="Ustoz gapirib bo\'lgach ochiladi"', 'lockHint={t("Ustoz gapirib bo\'lgach ochiladi", \'Откроется, когда учитель договорит\')}'),
  ("title={passed ? 'Barakalla! Endi siz bilasiz' : 'Endi siz bilasiz'}", "title={passed ? t('Barakalla! Endi siz bilasiz', 'Отлично! Теперь вы знаете') : t('Endi siz bilasiz', 'Теперь вы знаете')}"),
  ('>Mentor eslatmasi · 1 sahifa</div>', ">{t('Mentor eslatmasi · 1 sahifa', 'Памятка ментора · 1 страница')}</div>"),
  ('>yuklab olish (.md)</button>', ">{t('yuklab olish (.md)', 'скачать (.md)')}</button>"),
  ('<h1>{LESSON_TITLE}</h1>', "<h1>{t(LESSON_TITLE, RS('TITLE'))}</h1>"),
  ("<p>Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.</p>", "<p>{t(\"Bu dars ovozli. Ustoz har ekranda gapiradi, ekran u bilan birga o'zgaradi. Quloqchin yoki ovoz balandligini tekshiring.\", 'Урок озвучен. На каждом экране говорит учитель, экран меняется вместе с ним. Проверьте наушники или громкость.')}</p>"),
]
miss = []
for a, b in EX:
  if b in s: continue
  if s.count(a) != 1: miss.append(f'{s.count(a)} marta: {a[:80]}'); continue
  s = s.replace(a, b)
RX = [  # qolip, ichida darsga xos matn
  (r'>(Kursdagi keyingi mentor darsi|Bu kursdagi oxirgi mentor darsi)</h5>', lambda m: ">{t(" + js(m[1]) + ", " + js('Следующий урок курса для менторов' if m[1].startswith('Kursdagi') else 'Последний урок для менторов в этом курсе') + ")}</h5>", "')}</h5>"),
  (r'>Uyga vazifa · ([\d–]+) daqiqa</div>', r">{t('Uyga vazifa · \1 daqiqa', 'Домашнее задание · \1 минут')}</div>", "'Домашнее задание · "),
  (r'const text = !st\.showResult\n', "const text = LANG === 'ru' ? (!st.showResult ? RS('FIN_INTRO')\n      : sc >= 6 ? 'Ваш результат сохранён: ' + sc + ' из восьми. Урок усвоен, нажмите «Далее».'\n        : 'Хорошо, одну ошибку вы разобрали. Вернитесь и к экранам остальных красных вопросов. Когда будете готовы, нажмите кнопку «Пройти тест заново».')\n      : !st.showResult\n", "const text = LANG === 'ru'"),
  (r'voice\(sc >= 6 \? ("(?:[^"\\]|\\.)*") : ("Hali bir necha joy mustahkam emas\.[^"]*")\)', r"voice(sc >= 6 ? t(\1, RS('FIN_PASS')) : t(\2, 'Несколько мест пока не закрепились. Вернитесь к указанным экранам, потом пройдите тест заново.'))", "RS('FIN_PASS')"),
  (r'(const s\d+Segments = \(passed\) => )\[\n((?:.*\n)*?)\];\n', r'\1yakRu(passed, [\n\2]);\n', 'yakRu(passed'),
  (r'const sheet = (CHEATSHEET\w+);', r"const sheet = t(\1, RS('CHEAT'));", "RS('CHEAT')"),
  (r"a\.download = ('[^']+\.md')", r"a.download = t(\1, RS('FILE'))", "RS('FILE')"),
  (r'(<div style=\{\{ fontSize: 15, fontWeight: 700 \}\}>)([^{<]+)(</div><div style=\{\{ fontSize: 13\.5, color: T\.ink2 \}\}>)([^{<]+)(</div>)', lambda m: f"{m[1]}{{t({js(m[2])}, RS('NEXT_T'))}}{m[3]}{{t({js(m[4])}, RS('NEXT_D'))}}{m[5]}", "RS('NEXT_T')"),
  (r'<p className="mk-eyebrow">(Mentor kursi · [^<{]+)</p>', lambda m: f"<p className=\"mk-eyebrow\">{{t({js(m[1])}, {js(m[1].replace('Mentor kursi', 'Курс для менторов'))})}}</p>", "Курс для менторов"),
  (r'<ul>\n(\s*)\{(\[.*\])\.map\(\(x\) => <li', r"<ul>\n\1{t(\2, RS('COVER')).map((x) => <li", "RS('COVER')"),
]
import json
def js(x): return json.dumps(x, ensure_ascii=False)
for pat, rep, mark in RX:
  if mark in s: continue
  s2, n = re.subn(pat, rep, s, count=1)
  if n != 1: miss.append(f'qolip topilmadi: {pat[:60]}'); continue
  s = s2
if miss: sys.exit(f'{d}/{f.name}:\n  ' + '\n  '.join(miss))
if s != s0: f.write_text(s)
print(f"{d}: umumiy RU {'qo`yildi' if s != s0 else 'allaqachon bor'} → {f.name}")
