#!/usr/bin/env python3
"""F-1125-01 3-ish — Nest-2 AI bloki (M56; foydalanuvchi: Nest-1 ko'rildi — «hammasi zo'r», qolgan uchtasiga davom).
- nest2/parts/05b-ai.jsx (yangi): 6-bosqich · AI yozgan kod (ScreenAI) + Tekshiruv 5 (ScreenLCAI) — ai-nest2/ haqiqiy natijasi.
- SCREENS: ScreenP4 dan keyin ikki ekran (29 → 31). Reja 7 bosqich; o'quvchi darsini o'tish va sinf ekranlari «7-bosqich».
- Tekshiruvlar «N / 4» → «N / 5»; 22-ekran «Oxirgi tekshiruv» olib tashlanadi.
- Yakunga 7-band (SUM2 + b7), m4a-04 ekraniga bir gap, eslatmaga «AI yozgan resursni tekshirish».
PARTS=<nusxa> — quruq sinov.
"""
import os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.environ.get('PARTS') or os.path.join(HERE, '..', '..', '..', 'src', 'mentor-kurs', 'nest2', 'parts')


def edit(name, pairs, regex=()):
    path = os.path.join(P, name)
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        assert s.count(old) == 1, (name, s.count(old), old[:90])
        s = s.replace(old, new)
    for pat, rep, cnt in regex:
        s2, n = re.subn(pat, rep, s)
        assert n == cnt, (name, pat, n, cnt)
        s = s2
    open(path, 'w', encoding='utf-8').write(s)
    print('ok', name, len(pairs) + len(regex))


shutil.copy(os.path.join(HERE, 'nest2-05b-ai.jsx'), os.path.join(P, '05b-ai.jsx'))
print('ok 05b-ai.jsx (yangi)')
EY = lambda n: [(r'(Tekshiruv · [1-4]) / 4', r'\1 / 5', n), (r'(Проверка · [1-4]) / 4', r'\1 / 5', n)]

edit('03-s01-s07.jsx', [
    ("'Guard va token', 'Buzamiz', \"O'quvchi darslarini o'tish\"],", "'Guard va token', 'Buzamiz', 'AI yozgan kod', \"O'quvchi darslarini o'tish\"],"),
    ("gridTemplateColumns: 'repeat(6,minmax(0,1fr))'", "gridTemplateColumns: 'repeat(7,minmax(0,1fr))'"),
    ('{ hl: [4, 5] }', '{ hl: [4, 6] }'),
    ("sg('e', \"Olti bosqich, to'rt amaliyot.", "sg('e', \"Yetti bosqich, to'rt amaliyot."),
    ('"Dars olti bosqichdan iborat,', '"Dars yetti bosqichdan iborat,'),
], regex=EY(1))
edit('04-s08-s15.jsx', [], regex=EY(1))
edit('05-s16-s23.jsx', [
    ('q={t("Oxirgi tekshiruv, sinfdagi haqiqiy holat. To\'rtinchi tekshiruv.', 'q={t("Sinfdagi haqiqiy holat. To\'rtinchi tekshiruv.'),
    ("'Последняя проверка, реальный случай из класса. Четвёртая проверка.", "'Реальный случай из класса. Четвёртая проверка."),
], regex=EY(2))
edit('06-s24-s30.jsx', [
    ('ScreenP4, Screen24,', 'ScreenP4, ScreenAI, ScreenLCAI, Screen24,'),
    # SUM2 — b-segmentlar tartibida (slice(0, shown)): 'ai' b7 ga mos, shuning uchun oxirida
    ("\n];\n// F-1120-02 (M51): xulosa", "\n  { k: 'ai', t: \"AI yozgan resurs: besh qatlam, himoya va kutilmagan so'rovlar bilan tekshiriladi — javob 500 bo'lsa terminal\", st: ['pipe', 'guard'] },\n];\n// F-1120-02 (M51): xulosa"),
    ("O'quvchi yozmaydi: buyuradi, natijani tekshiruv ro'yxati bilan solishtiradi va shundan keyingina qabul qiladi.\"",
     "O'quvchi yozmaydi: buyuradi, natijani tekshiruv ro'yxati bilan solishtiradi va shundan keyingina qabul qiladi. Agent yozgan resursni siz oltinchi bosqichdagidek tekshirasiz: besh qatlam, himoya va kutilmagan so'rovlar.\""),
    ("## Sizning uyga vazifangiz\n",
     "## AI yozgan resursni tekshirish\n"
     "besh qatlam (core/index.ts, forFeature, AppModule) · himoya: guard'lar klass ustida, GET — @Roles('public'), yozish — superAdmin, admin · kutilmagan so'rovlar: /resurs/abc → 400 (ParseUUIDPipe), bo'sh body → 400, begona maydon → 400 (forbidNonWhitelisted), takror unique qiymat → 500 bo'lsa terminalni o'qing · AI loyihadagi namunani zaifligi bilan ko'chiradi\n"
     "## Sizning uyga vazifangiz\n"),
], regex=[
    (r'kicker: "6-bosqich · o\'quvchi darsini o\'tish"', 'kicker: "7-bosqich · o\'quvchi darsini o\'tish"', 3),
    (r"kicker: '6-bosqich · sinfda'", "kicker: '7-bosqich · sinfda'", 1),
    (r"(\n  sg\('b6', [^\n]*\n)", lambda m: m.group(1) + "  sg('b7', \"AI yozgan resurs: <b>besh qatlam, himoya</b> va <b>kutilmagan so'rovlar</b>\", \"Yettinchi: AI yozgan resursni besh qatlam va himoya bilan o'qing, keyin kutilmagan so'rovlar yuboring: harfli id, bo'sh body, begona maydon va takror qiymat. Javob besh yuz bo'lsa, sabab terminalda.\", { hl: 'ai' }),\n", 1),
])
edit('08-ru.jsx', [
    ("'Guard и токен', 'Ломаем', 'Как вести уроки ученика'],", "'Guard и токен', 'Ломаем', 'Код от ИИ', 'Как вести уроки ученика'],"),
    ('Шесть этапов, четыре практики.', 'Семь этапов, четыре практики.'),
    ('Урок состоит из шести этапов,', 'Урок состоит из семи этапов,'),
    ("\n]);\nru(HOMEWORK2, [", "\n  { t: 'Ресурс от ИИ проверяют по пяти слоям, защите и неожиданным запросам — при 500 читайте терминал' },\n]);\nru(HOMEWORK2, ["),
    ("Ученик не пишет: он командует, сверяет результат со списком проверки и только после этого принимает.'",
     "Ученик не пишет: он командует, сверяет результат со списком проверки и только после этого принимает. Ресурс, написанный агентом, вы проверяете, как на шестом этапе: пять слоёв, защита и неожиданные запросы.'"),
    ("## Ваше домашнее задание\n",
     "## Проверка ресурса от ИИ\n"
     "пять слоёв (core/index.ts, forFeature, AppModule) · защита: guard над классом, GET — @Roles('public'), запись — superAdmin, admin · неожиданные запросы: /ресурс/abc → 400 (ParseUUIDPipe), пустой body → 400, чужое поле → 400 (forbidNonWhitelisted), повтор unique-значения → при 500 читайте терминал · ИИ копирует образец из проекта вместе с его слабостью\n"
     "## Ваше домашнее задание\n"),
], regex=[
    (r"kicker: 'Этап 6 · ", "kicker: 'Этап 7 · ", 4),
    (r"(\n  b6: rs\([^\n]*\n)", lambda m: m.group(1) + "  b7: rs('Ресурс от ИИ: <b>пять слоёв, защита</b> и <b>неожиданные запросы</b>', 'Седьмое: ресурс от ИИ читайте по пяти слоям и защите, потом отправляйте неожиданные запросы: id из букв, пустой body, чужое поле и повторное значение. Если ответ пятьсот, причина в терминале.'),\n", 1),
])
ru_ai = r"""
// --- F-1125-01: 6-bosqich · AI yozgan kod (05b-ai.jsx) ---
ru(S_AI2, {
  kicker: 'Этап 6 · код от ИИ', title: 'Ресурс customer от ИИ: два задания, два результата',
  segments: {
    a: rs('Мы поручили ИИ ресурс <b>customer</b> в репозитории ученика: один ИИ, <b>два разных задания</b>', 'На первом уроке по Nest мы поручали ИИ модуль customers в cars api. Теперь то же самое сделали в репозитории ученика, где уже добавлен ресурс car. ИИ один, Claude Haiku, а задания два: слева простыми словами, справа в стиле репозитория. На этот раз проверка шире: пять слоёв, защита и база.'),
    b: rs('Проверка 1 — <b>пять слоёв и защита</b>: оба ИИ собрали правильно', 'Первая проверка — структура. На месте ли пять слоёв: Entity, DTO, Service с наследованием от Base service, Controller, Module с forFeature и главный модуль. Защита: guard над классом, GET открыты через public, запись только у superadmin и admin. Оба ИИ сделали всё это правильно, в терминале пять строк Mapped для customer.'),
    c: rs('Проверка 2 — <b>запросы</b>: на обычных оба одинаковы, <b>репозиторий помогает сам</b>', 'Вторая проверка — запросами. На обычных запросах оба одинаковы: список открыт всем, добавление без токена — четыреста один, возраст пятнадцать, пустой body и чужое поле id — четыреста. Чужое поле останавливает не ИИ, а сам репозиторий: в ValidationPipe включён forbidNonWhitelisted.'),
    d: rs('Неожиданные запросы: <b>id из букв</b> и <b>повторный телефон</b> — у B оба дали 500', 'Два неожиданных запроса вышли по-разному. id из букв: A вернул четыреста, потому что поставил ParseUUIDPipe, а B — пятьсот. B скопировал строку из ресурса car: на третьем этапе запрос car один тоже дал пятьсот. Повторный телефон: у B телефон unique, база отказала, но ответ пятьсот. У A unique нет, и второй клиент создан с тем же телефоном.'),
    e: rs('Вывод: ИИ копирует образец из проекта <b>вместе с его слабостью</b> — неожиданные запросы отправляйте сами', 'Вывод. ИИ копирует образец из проекта вместе с его слабостью. Даже если структура и защита правильные, ответ раскрывают неожиданные запросы: id из букв, пустой body, чужое поле и повторное значение. Значит, ресурс от ИИ проверяйте по пяти слоям, защите и четырём неожиданным запросам.'),
  },
});
"""
with open(os.path.join(P, '08-ru.jsx'), 'a', encoding='utf-8') as f:
    f.write(ru_ai)
print('ok 08-ru.jsx (S_AI2)')
