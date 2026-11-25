#!/usr/bin/env python3
"""F-1125-01 3-ish — PG-1 AI bloki (M56; foydalanuvchi: Nest-1 ko'rildi — «hammasi zo'r», qolgan uchtasiga davom).
- pg1/parts/07b-ai.jsx (yangi): 6-bosqich · AI tavsiyasi (ScreenAI) + Tekshiruv 5 (ScreenLCAI) — ai-pg1/ haqiqiy natijasi.
- MD (generator manbasi): reja 7 bosqich, 1-ekran c/e, tekshiruvlar «/ 5», «7-bosqich» kickerlari, 25-ekran c ovozi;
  AI ekranlari hujjati «## AI-1», «## AI-2» (generator ularni o'qimaydi — raqamli sarlavha emas, segmentlar «- a ·» shaklida).
- Kod: PLAN1, S1 hl, SCREENS, SUM28 + b7, xulosa xaritasi, eslatma. RU: qism JSON + pg1-sahna.js.
Keyin: dev/pg1-matn.py → dev/ru-ajrat.py pg1 → dev/ru-qur.py pg1 → dev/yig.sh.
"""
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
MK = os.path.join(ROOT, 'feedback', 'F-1029-02-mentor-kurs')
P = os.path.join(ROOT, 'src', 'mentor-kurs', 'pg1', 'parts')


def edit(path, pairs, regex=()):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        assert s.count(old) == 1, (os.path.basename(path), s.count(old), old[:90])
        s = s.replace(old, new)
    for pat, rep, cnt in regex:
        s2, n = re.subn(pat, rep, s)
        assert n == cnt, (os.path.basename(path), pat, n, cnt)
        s = s2
    open(path, 'w', encoding='utf-8').write(s)
    print('ok', os.path.relpath(path, ROOT), len(pairs) + len(regex))


shutil.copy(os.path.join(HERE, 'pg1-07b-ai.jsx'), os.path.join(P, '07b-ai.jsx'))
print('ok 07b-ai.jsx (yangi)')

AI_DOC = r'''
## AI-1 · AI'dan chat uchun baza: ikki topshiriq, ikki javob  ← `Lesson` (F-1125-01, M56; kod `pg1/parts/07b-ai.jsx`, saytda 24-ekran; matn kodda — generator bu bo'limni o'qimaydi)
- Kicker (kodda): `6-bosqich · AI tavsiyasi`. Manba (haqiqiy, Claude Haiku ×2, vositasiz): `feedback/F-1125-01-nest1-kuchaytirish/ai-pg1/` — `00-promptlar.md`, `A-oddiy/`, `B-mezon/`, `B-mezon-tuzatilgan/`, `XULOSA.md`.
- Savol — o'quvchi darsi m4-03 (`DbSqlNosqlLesson.jsx` Screen11) dagi aynan tugma «Oddiy chat ilovasi»; darsdagi tayyor javob — NoSQL (MongoDB).
- a · **O'quvchi darsidagi savolni haqiqiy AI'ga berdik: chat ilovasi, ikki xil topshiriq** — sahna: A va B topshiriq matni + darsdagi tayyor javob kartasi.
- b · **Ikkala AI ham — PostgreSQL; bahs to'rtinchi mezonda** — A sababi (aynan parcha) + B ning 4 javobi (aynan): 1–2 → SQL, 3 — yo'q, 4 — «indekslar bilan PostgreSQL ko'taradi» (bahsli).
- c · **AI xato emas — javobni sabab hal qiladi** — 4-savol: darsda millionlab xabar → NoSQL · AI: oddiy chat → PostgreSQL · «Sinfda»: «Javobni AI emas, sabab hal qiladi…».
- d · **Sxema bazada: uchta yozuvni baza o'zi to'xtatdi, uchtasi o'tib ketdi** — jadval A/B: yo'q foydalanuvchi, NULL, takror username → ERROR (ikkalasida); `''` → INSERT 0 1 (ikkalasida); A: a'zo bo'lmagan yozdi → INSERT 0 1; `ali`ni o'chirish: A ERROR (rad etildi), B DELETE 1 — vali'ning xabarlari 3 → 0.
- e · **Xulosa: tavsiyani 4 mezon bilan, sxemani bazada tekshiring** — qoida kartasi.

## AI-2 · Tekshiruv 5 — AI yozgan sxema: ali o'chirildi, vali yozgan xabar ham yo'qoldi  ← `LineCheck` (kodda; saytda 25-ekran)
- Kod: B ning `schema.sql` 9–15 (aynan). To'g'ri satr: 12 `receiver_id … REFERENCES users(id) ON DELETE CASCADE` («Va alaykum!»: vali → ali).
- Tuzatish (yurgizilgan, `B-mezon-tuzatilgan/`): 11–12-satrdan `ON DELETE CASCADE` olindi → `DELETE` rad etildi (`still referenced from table "messages"`), vali'ning 3 xabari joyida.
'''

MD = os.path.join(MK, '06-PostgreSQL1-mentor-v1.md')
edit(MD, [
    ('| Hajm | **29 ekran** · 6 bosqich · 4 amaliyot · 4 tekshiruv ·',
     '| Hajm | **31 ekran** (25.11, F-1125-01: 6-bosqich · AI tavsiyasi — «## AI-1», «## AI-2», saytda 24–25-ekran; MD raqamlari 24–29 saytda 26–31) · 7 bosqich · 4 amaliyot · 5 tekshiruv ·'),
    ('- Sahna: chapda reja (6 bosqich,', '- Sahna: chapda reja (7 bosqich,'),
    ("· 05 Ishonchlilik: oxirgi telefon · 06 O'quvchi darsini o'tish", "· 05 Ishonchlilik: oxirgi telefon · 06 AI tavsiyasi · 07 O'quvchi darsini o'tish"),
    ("va nima uni saqlab qolishini aniq bilasiz.» · reja 05", "va nima uni saqlab qolishini aniq bilasiz. Keyin AI tavsiya qilgan bazani va u yozgan jadvallarni ham bazada tekshirasiz.» · reja 05–06"),
    ("qanday o'tishni ham oxirgi bosqichda ko'ramiz.» · reja 06", "qanday o'tishni ham oxirgi bosqichda ko'ramiz.» · reja 07"),
    ("5. **Olti bosqich, to'rt amaliyot.", "5. **Yetti bosqich, to'rt amaliyot."),
    ('Ovoz: «Dars olti bosqichdan iborat,', 'Ovoz: «Dars yetti bosqichdan iborat,'),
    ("Buni inkor qilmang, bu to'g'ri.» · 3-blok", "Buni inkor qilmang: millionlab xabarda bu to'g'ri. Oddiy chat uchun esa haqiqiy AI PostgreSQL dedi, oltinchi bosqichda ko'rdingiz.» · 3-blok"),
    ('\n## 24 · Sinf kompyuterlari', AI_DOC + '\n## 24 · Sinf kompyuterlari'),
], regex=[
    (r'Eyebrow: `Tekshiruv · ([1-4]) / 4', r'Eyebrow: `Tekshiruv · \1 / 5', 4),
    (r'Kicker: `6-bosqich · ', 'Kicker: `7-bosqich · ', 4),
])

edit(os.path.join(P, '05-s01-s09.jsx'), [
    ("'Ishonchlilik: oxirgi telefon', \"O'quvchi darsini o'tish\"];", "'Ishonchlilik: oxirgi telefon', 'AI tavsiyasi', \"O'quvchi darsini o'tish\"];"),
    ("{ hl: [4] }, { hl: [5] }, { hl: [] }], { plan: PLAN1 });", "{ hl: [4, 5] }, { hl: [6] }, { hl: [] }], { plan: PLAN1 });"),
    ("gridTemplateColumns: 'repeat(6,minmax(0,1fr))'", "gridTemplateColumns: 'repeat(7,minmax(0,1fr))'"),
])
edit(os.path.join(P, '08-s23-s28.jsx'), [
    ('ScreenP4, Screen23,', 'ScreenP4, ScreenAI, ScreenLCAI, Screen23,'),
    # 7 band 1280×720 ga sig'sin — faqat shu ro'yxat zichroq (surat: 42 px qirqilgan edi)
    ('<div className="mk-plan">{SUM28.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? \'hl\' : \'\'} style={{ animation: \'mk-up .45s ease both\' }}>', '{/* F-1125-01: 7 band 1280×720 ga sig\'sin (yangi band pastda qirqilmasin) — faqat shu ro\'yxatda zichroq */}\n            <div className="mk-plan" style={{ gap: 6 }}>{SUM28.slice(0, shown).map((it, i) => <div key={it.k} className={it.k === hl ? \'hl\' : \'\'} style={{ animation: \'mk-up .45s ease both\', padding: \'8px 14px\' }}>'),
    # SUM28 — b-segmentlar tartibida (slice(0, shown)): 'ai' b7 ga mos, shuning uchun oxirida
    ("\n];\n// F-1120-02 (M51): xulosa — darsning o'sha rasmi (blog bazasi)",
     "\n  { k: 'ai', t: \"AI tavsiyasi: sabab — 4 mezon bilan (chat uchun AI PostgreSQL dedi, darsda MongoDB — sabab hal qiladi); sxema — bazada: bo'sh matn '', ON DELETE CASCADE\", st: ['rule'] },\n];\n// F-1120-02 (M51): xulosa — darsning o'sha rasmi (blog bazasi)"),
    ("<BlogDb rules={hl === 'mongo' || hl === 'rule' || hl === 'tx' || hl === 'all'}", "<BlogDb rules={hl === 'mongo' || hl === 'rule' || hl === 'tx' || hl === 'ai' || hl === 'all'}"),
    ("## Sizning uyga vazifangiz\n",
     "## AI tavsiyasi va AI yozgan sxema\n"
     "sabab — 4 mezon bilan (bog'langanmi · shakli qat'iymi · xato qimmatmi · ulkan hajm va tezlik); haqiqiy AI chat uchun PostgreSQL dedi, m4-03 dagi tayyor javob — MongoDB: sabab hal qiladi · sxemani bazada yurgizing: yo'q id → tashqi kalit xatosi · NULL → NOT NULL · takror → UNIQUE · bo'sh matn '' — NOT NULL to'xtatmaydi → CHECK (trim(body) <> '') · ON DELETE CASCADE — xabari bor foydalanuvchini o'chirish uning hamma xabarini xato bermay o'chiradi; olib tashlansa — DELETE rad etiladi\n"
     "## Sizning uyga vazifangiz\n"),
], regex=[
    (r"(\n  sg\('b6', [^\n]*\n)", lambda m: m.group(1) + "  sg('b7', \"AI tavsiyasi: <b>sabab 4 mezon bilan</b>, sxema <b>bazada</b>\", \"Yettinchi: AI tavsiyasini sabab bilan qabul qiling va to'rt mezon bilan solishtiring. AI yozgan sxemani bazada yurgizing: bo'sh matn, takror qiymat va xabari bor foydalanuvchini o'chirib ko'ring. On delete cascade bilan o'chirish xato bermay boshqa jadvalga ham o'tadi.\", { hl: 'ai' }),\n", 1),
])
edit(os.path.join(MK, 'ru', 'pg1-sahna.js'), [
    ("'Надёжность: последний телефон', 'Как вести урок ученика'] },", "'Надёжность: последний телефон', 'Совет ИИ', 'Как вести урок ученика'] },"),
    ("\n]);\nru(HOMEWORK28, [", "\n  { t: 'Совет ИИ: причина — по 4 критериям (для чата ИИ сказал PostgreSQL, в уроке MongoDB — решает причина); схема — в базе: пустой текст \\'\\', ON DELETE CASCADE' },\n]);\nru(HOMEWORK28, ["),
    ("## Ваше домашнее задание\n",
     "## Совет ИИ и схема от ИИ\n"
     "причина — по 4 критериям (связаны ли · строгая ли форма · дорога ли ошибка · огромный объём и скорость); настоящий ИИ для чата сказал PostgreSQL, готовый ответ в m4-03 — MongoDB: решает причина · схему запускайте в базе: несуществующий id → ошибка внешнего ключа · NULL → NOT NULL · повтор → UNIQUE · пустой текст '' — NOT NULL не останавливает → CHECK (trim(body) <> '') · ON DELETE CASCADE — удаление пользователя с сообщениями удаляет все его сообщения без ошибки; без него — DELETE отклоняется\n"
     "## Ваше домашнее задание\n"),
], regex=[
    (r"(\n  b6: \[[^\n]*\n)", lambda m: m.group(1) + "  b7: ['Совет ИИ: <b>причина — по 4 критериям</b>, схема — <b>в базе</b>', 'Седьмое: принимайте совет ИИ с причиной и сравнивайте его с четырьмя критериями. Схему от ИИ запустите в базе: попробуйте пустой текст, повтор значения и удаление пользователя, у которого есть сообщения. С on delete cascade удаление без ошибки переходит и в другую таблицу.'],\n", 1),
])

# RU qism JSON — o'zgargan o'zbekcha kalitlarning tarjimasi
def jset(name, upd):
    path = os.path.join(MK, 'ru', 'qism', name)
    d = json.load(open(path, encoding='utf-8'))
    for k, f in upd.items():
        assert k in d, (name, k)
        old = d[k]; d[k] = f(old); assert d[k] != old, (name, k)
    open(path, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
    print('ok ru/qism/' + name, len(upd))


def rep(a, b):
    def f(s):
        assert s.count(a) == 1, (a, s[:80]); return s.replace(a, b)
    return f


jset('pg1-1.json', {
    '1.seg.c.voice': lambda s: s.rstrip() + ' Потом в базе проверите и совет ИИ по выбору базы, и таблицы, которые он написал.',
    '1.seg.e.key': rep('Шесть этапов,', 'Семь этапов,'),
    '1.seg.e.voice': rep('из шести этапов', 'из семи этапов'),
    '6.eyebrow': rep('1 / 4', '1 / 5'),
})
jset('pg1-3.json', {'14.eyebrow': rep('2 / 4', '2 / 5'), '17.eyebrow': rep('3 / 4', '3 / 5')})
jset('pg1-4.json', {
    '22.eyebrow': rep('4 / 4', '4 / 5'),
    '24.kicker': rep('Этап 6', 'Этап 7'), '25.kicker': rep('Этап 6', 'Этап 7'), '26.kicker': rep('Этап 6', 'Этап 7'),
    '25.seg.c.voice': rep('Не отрицайте это, это правда.', 'Не отрицайте это: для миллионов сообщений это правда. А для простого чата настоящий ИИ сказал PostgreSQL — вы видели это на шестом этапе.'),
})
jset('pg1-5.json', {'27.kicker': rep('Этап 6', 'Этап 7')})
