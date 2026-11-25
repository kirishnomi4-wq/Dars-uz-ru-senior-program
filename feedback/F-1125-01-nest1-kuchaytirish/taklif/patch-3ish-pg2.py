#!/usr/bin/env python3
"""F-1125-01 3-ish — PG-2 AI bloki (M56; foydalanuvchi: Nest-1 ko'rildi — «hammasi zo'r», qolgan uchtasiga davom).
- pg2/parts/06b-ai.jsx (yangi): 6-bosqich · AI yozgan SQL (ScreenAI) + Tekshiruv 5 (ScreenLCAI) — ai-pg2/ haqiqiy natijasi.
- MD (generator manbasi): reja 7 bosqich, 1-ekran c/d, tekshiruvlar «/ 5», «7-bosqich» kickerlari, 28-ekran a ovozi (M56.5);
  AI ekranlari hujjati «## AI-1», «## AI-2» (generator o'qimaydi — raqamli sarlavha emas, segment «- a ·», jadvalsiz).
- Kod: PLAN1, S1 hl, SCREENS, SUM31 + MAP31 + b7, eslatma. RU: qism JSON + pg2-sahna.js.
Keyin: dev/pg2-matn.py → dev/ru-ajrat.py pg2 → dev/ru-qur.py pg2 → dev/yig.sh.
"""
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
MK = os.path.join(ROOT, 'feedback', 'F-1029-02-mentor-kurs')
P = os.path.join(ROOT, 'src', 'mentor-kurs', 'pg2', 'parts')


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


shutil.copy(os.path.join(HERE, 'pg2-06b-ai.jsx'), os.path.join(P, '06b-ai.jsx'))
print('ok 06b-ai.jsx (yangi)')

AI_DOC = r'''
## AI-1 · AI yozgan SQL bazada: to'rt amal, ikki topshiriq — Kolonka o'chmadi  ← `Lesson` (F-1125-01, M56; kod `pg2/parts/06b-ai.jsx`, saytda 28-ekran; matn kodda — generator bu bo'limni o'qimaydi)
- Kicker (kodda): `6-bosqich · AI yozgan SQL`. Manba (haqiqiy, Claude Haiku ×2, fayl va buyruqsiz): `feedback/F-1125-01-nest1-kuchaytirish/ai-pg2/` — `00-promptlar.md`, `A-oddiy/`, `A-oddiy-nomlar/`, `B-tuzilish/`, `A-tuzatilgan/`, `qoshimcha-drop-column/`, `XULOSA.md`.
- Topshiriq — o'quvchi m4-06 amaliyotidagi to'rt amal (arzonlar · Quloqchin 90 000 · «Kolonkani o'chir» · Monitor qo'shish), baza — 1-bosqichdagi `shop · products`. A — oddiy so'z bilan, B — jadval tuzilishi va «WHERE, avval SELECT» qoidasi bilan.
- a · **O'quvchi amaliyotidagi to'rt amalni haqiqiy AI'ga berdik: oddiy so'z bilan va jadval tuzilishi bilan** — sahna: ikki topshiriq + to'rt amal.
- b · **A jadval nomini o'ylab topdi — beshala buyruq bir xil xato** — A ning SQL'i (aynan, `mahsulotlar`, `nomi`, `narxi`) + `ERROR: relation "mahsulotlar" does not exist`.
- c · **«Kolonkani o'chir» — ikkala AI ham uni jadval ustuni deb tushundi** — A: `ALTER TABLE mahsulotlar DROP COLUMN kolonka;` · B: «qaysi kolonka aniq emas» + `ALTER TABLE products DROP COLUMN <kolonka_nomi>;`; topshiriq — `DELETE … WHERE`. `DROP COLUMN stock` sinab ko'rildi → `ALTER TABLE`, to'rtala qatordan qiymat yo'qoldi.
- d · **Bazada: ikkalasida Kolonka joyida, B da Monitor ham qo'shilmadi** — A (nomlar AI aytganidek almashtirilgan): 3 qator · `UPDATE 1` · ERROR column · `INSERT 0 1`; B (butun javob): 3 qator · `BEGIN · UPDATE 1 · COMMIT` · ERROR syntax `<` · ERROR `current transaction is aborted`.
- e · **Xulosa: AI buyrug'ini fe'l, nom va son bilan tekshiring** — qoida kartasi; `ALTER` / `DROP` so'ralmagan bo'lsa — yurgizilmaydi.

## AI-2 · Tekshiruv 5 — AI yozgan SQL: to'rt amal, lekin Kolonka joyida qoldi  ← `LineCheck` (kodda; saytda 29-ekran)
- Kod: `A-oddiy-nomlar/sorovlar.sql` 1–7 (A ning SQL'i, nomlar almashtirilgan). To'g'ri satr: 6 `ALTER TABLE products DROP COLUMN kolonka;`.
- Tuzatish (yurgizilgan, `A-tuzatilgan/`): `DELETE FROM products WHERE name = 'Kolonka';` → `DELETE 1`; yakuniy holat kutilgan bilan bir xil.
'''

MD = os.path.join(MK, '08-PostgreSQL2-mentor-v2.md')
edit(MD, [
    ('| Hajm | **31 ekran** · 6 bosqich · 4 amaliyot · 4 tekshiruv ·',
     '| Hajm | **33 ekran** (25.11, F-1125-01: 6-bosqich · AI yozgan SQL — «## AI-1», «## AI-2», saytda 28–29-ekran; MD raqamlari 28–31 saytda 30–33) · 7 bosqich · 4 amaliyot · 5 tekshiruv ·'),
    ('- Sahna: chapda reja (6 bosqich);', '- Sahna: chapda reja (7 bosqich);'),
    ("· 05 Buzamiz va tuzatamiz · 06 Sinfga tayyorgarlik", "· 05 Buzamiz va tuzatamiz · 06 AI yozgan SQL · 07 Sinfga tayyorgarlik"),
    ("Serverni ataylab buzamiz va tuzatamiz.» · reja 04–05", "Serverni ataylab buzamiz va tuzatamiz. Keyin AI yozgan SQL'ni bazada tekshiramiz.» · reja 04–06"),
    ("4. **Olti bosqich, to'rt amaliyot;", "4. **Yetti bosqich, to'rt amaliyot;"),
    ('Ovoz: «Dars olti bosqichdan iborat,', 'Ovoz: «Dars yetti bosqichdan iborat,'),
    ("Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 06", "Ustoz gapirib bo'lgach Davom ochiladi. Boshlaymiz.» · reja 07"),
    ("AI bilan o'z do'konini yaratadi, shuning uchun PostgreSQL har kompyuterda ishlab turishi shart.»",
     "AI bilan o'z do'konini yaratadi, shuning uchun PostgreSQL har kompyuterda ishlab turishi shart. AI yozgan buyruqni oltinchi bosqichdagidek tekshirasiz.»"),
    ('\n## 28 · ', AI_DOC + '\n## 28 · '),
], regex=[
    (r'Eyebrow: `Tekshiruv · ([1-4]) / 4', r'Eyebrow: `Tekshiruv · \1 / 5', 4),
    (r'Kicker: `6-bosqich · ', 'Kicker: `7-bosqich · ', 2),
])

edit(os.path.join(P, '05-s01-s13.jsx'), [
    ("'Buzamiz va tuzatamiz', 'Sinfga tayyorgarlik'];", "'Buzamiz va tuzatamiz', 'AI yozgan SQL', 'Sinfga tayyorgarlik'];"),
    ("{ hl: [3, 4] }, { hl: [5] }], { plan: PLAN1 });", "{ hl: [3, 4, 5] }, { hl: [6] }], { plan: PLAN1 });"),
    ("gridTemplateColumns: 'repeat(6,minmax(0,1fr))'", "gridTemplateColumns: 'repeat(7,minmax(0,1fr))'"),
])
edit(os.path.join(P, '07-s28-s31.jsx'), [
    ('ScreenP27, Screen28,', 'ScreenP27, ScreenAI, ScreenLCAI, Screen28,'),
    # SUM31 — b-segmentlar tartibida (slice(0, shown)): 'ai' b7 ga mos, shuning uchun oxirida
    ("\n];\n// F-1120-02 (M51): xulosa — darsning o'sha rasmi (CrudMachine)",
     "\n  { k: 'ai', t: \"AI yozgan SQL: fe'l topshiriqqa mosmi (o'chirish — DELETE, ALTER/DROP emas) · nomlar \\\\d bilan · javobdagi son · oxirida SELECT *\", st: ['psql'] },\n];\n// F-1120-02 (M51): xulosa — darsning o'sha rasmi (CrudMachine)"),
    ("  class: { path: 'both',", "  ai: { path: 'psql', on: PS31.psql, psqlLine: ['shop=#', \"DELETE FROM products WHERE name = 'Kolonka';\", 'DELETE 1'] },\n  class: { path: 'both',"),
    ("## Sizning uyga vazifangiz (50–70 daqiqa)\n",
     "## AI yozgan SQL\n"
     "fe'l topshiriqqa mosmi: ko'rish SELECT · o'zgartirish UPDATE · o'chirish DELETE · qo'shish INSERT; ALTER / DROP — so'ralmagan bo'lsa yurgizilmaydi (DROP COLUMN stock → ALTER TABLE, so'roqsiz, hamma qatordan qiymat yo'qoladi) · nomlar \\\\d products bilan (AI tuzilishni bilmasa o'ylab topadi: relation \"mahsulotlar\" does not exist) · javobdagi son · oxirida SELECT * · haqiqiy AI «Kolonkani o'chir»ni ustun deb tushundi (ikkalasi) · butun javobni nusxalamang: shablondagi <…> xatosi tranzaksiyani buzadi, keyingi INSERT ham bajarilmaydi\n"
     "## Sizning uyga vazifangiz (50–70 daqiqa)\n"),
], regex=[
    (r"(\n  sg\('b6', [^\n]*\n)", lambda m: m.group(1) + "  sg('b7', \"AI yozgan SQL: <b>fe'l, nom va son</b>; ALTER yoki DROP so'ralmagan bo'lsa — yurgizmang\", \"Yettinchi: AI yozgan SQL'ni fe'l, nom va son bilan tekshiring. O'chirish delete bo'lishi kerak; alter yoki drop so'ralmagan bo'lsa, uni yurgizmang. Haqiqiy AI kolonkani ustun deb tushundi, buni o'z ko'zingiz bilan ko'rdingiz.\", { hl: 'ai' }),\n", 1),
])
edit(os.path.join(MK, 'ru', 'pg2-sahna.js'), [
    ("'Ломаем и чиним', 'Подготовка к классу'] },", "'Ломаем и чиним', 'SQL от ИИ', 'Подготовка к классу'] },"),
    ("\n]);\nru(HOMEWORK31, [", "\n  { t: 'SQL от ИИ: глагол соответствует заданию (удалить — DELETE, не ALTER/DROP) · имена по \\\\d · число в ответе · в конце SELECT *' },\n]);\nru(HOMEWORK31, ["),
    ("## Ваше домашнее задание (50–70 минут)\n",
     "## SQL от ИИ\n"
     "глагол соответствует заданию: посмотреть SELECT · изменить UPDATE · удалить DELETE · добавить INSERT; ALTER / DROP — если не просили, не запускать (DROP COLUMN stock → ALTER TABLE, без вопроса, значение пропадает во всех строках) · имена по \\\\d products (если ИИ не знает структуру, он придумывает: relation \"mahsulotlar\" does not exist) · число в ответе · в конце SELECT * · настоящий ИИ понял «Kolonkani o'chir» как колонку (оба) · не копируйте ответ целиком: ошибка <…> в шаблоне ломает транзакцию, следующий INSERT тоже не выполняется\n"
     "## Ваше домашнее задание (50–70 минут)\n"),
], regex=[
    (r"(\n  b6: \[[^\n]*\n)", lambda m: m.group(1) + "  b7: ['SQL от ИИ: <b>глагол, имя и число</b>; ALTER или DROP без просьбы — не запускайте', 'Седьмое: SQL от ИИ проверяйте глаголом, именем и числом. Удаление — это delete; если alter или drop не просили, не запускайте. Настоящий ИИ понял kolonka как колонку, вы видели это своими глазами.'],\n", 1),
])


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


jset('pg2-1.json', {
    '1.seg.c.voice': lambda s: s.rstrip() + ' Потом проверим в базе SQL, написанный ИИ.',
    '1.seg.d.key': rep('Шесть этапов,', 'Семь этапов,'),
    '1.seg.d.voice': rep('из шести этапов', 'из семи этапов'),
    '7.eyebrow': rep('1 / 4', '1 / 5'), '12.eyebrow': rep('2 / 4', '2 / 5'), '16.eyebrow': rep('3 / 4', '3 / 5'),
})
jset('pg2-2.json', {
    '26.eyebrow': rep('4 / 4', '4 / 5'),
    '28.kicker': rep('Этап 6', 'Этап 7'), '29.kicker': rep('Этап 6', 'Этап 7'),
    '28.seg.a.voice': lambda s: s.rstrip() + ' Команду от ИИ вы проверяете, как на шестом этапе.',
})
