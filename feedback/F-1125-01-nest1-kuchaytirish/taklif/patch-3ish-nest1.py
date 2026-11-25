#!/usr/bin/env python3
"""F-1125-01 3-ish — Nest-1 AI bloki (foydalanuvchi 25.11: «A — avval Nest-1», agentlar «Ha», resurs customers).
- parts/06b-ai.jsx (yangi): 6-bosqich · AI yozgan kod (ScreenAI6) + Tekshiruv 6 (ScreenLCAI) — haqiqiy AI natijasi (ai-nest1/).
- SCREENS: ScreenP3 dan keyin ikki ekran (39 → 41). Joyi — dars tanasi (M41: AI kodini tekshirish mentorning o'z ko'nikmasi).
- Tekshiruvlar «N / 5» → «N / 6»; 23-ekran «Oxirgi tekshiruv» olib tashlanadi (oxirgisi endi 6-tekshiruv).
- Reja 6-bandi; 33-ekran (o'quvchi darsi xaritasi) 6-blokiga bir gap; yakun xulosasiga 7-band; eslatmaga AI tekshiruvi va lug'at.
patch-2ish-nest1.py va patch-2ish-ru.py dan KEYIN qo'llanadi. PARTS=<nusxa> — quruq sinov.
"""
import os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.environ.get('PARTS') or os.path.join(HERE, '..', '..', '..', 'src', 'mentor-kurs', 'parts')


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


shutil.copy(os.path.join(HERE, '06b-ai.jsx'), os.path.join(P, '06b-ai.jsx'))
print('ok 06b-ai.jsx (yangi)')

# Reja: 6-band
edit('03-s01-s05.jsx', [("\"Amaliyot (to'rt bo'lak)\", \"O'quvchi darsini o'tish\"]", "\"Amaliyot va AI yozgan kod\", \"O'quvchi darsini o'tish\"]")])
# Tekshiruvlar soni 5 → 6 (UZ va RU eyebrow; t() ichida)
for f, n in [('04-s06-s11.jsx', 1), ('05-s12-s17.jsx', 2), ('06-s18-s23.jsx', 2)]:
    edit(f, [], regex=[(r'(Tekshiruv · [1-5]) / 5', r'\1 / 6', n), (r'(Проверка · [1-5]) / 5', r'\1 / 6', n)])
# 23-ekran endi oxirgi emas
edit('06-s18-s23.jsx', [
    ('q={t("Oxirgi tekshiruv, sinfdagi haqiqiy holat. Beshinchi tekshiruv.', 'q={t("Sinfdagi haqiqiy holat. Beshinchi tekshiruv.'),
    ("'Последняя проверка, настоящая ситуация в классе. Пятая проверка.", "'Настоящая ситуация в классе. Пятая проверка."),
])
edit('07-s24-s28.jsx', [
    # Ekranlar: AI bloki 4-amaliyotdan keyin, o'quvchi darsini o'tishdan oldin
    ('Screen23, ScreenP3, Screen25a,', 'Screen23, ScreenP3, ScreenAI6, ScreenLCAI, Screen25a,'),
    # 33-ekran (xarita) 6-blok: bugungi AI tekshiruviga bog'lanadi
    ("Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi.\", hl: [5] },",
     "Debugging ekranida siz bugun o'rgangan qoida ishlaydi: Controller'da hisob bo'lmaydi. AI yozgan kodni esa oltinchi bosqichdagidek tekshirasiz: to'rt savol va uchta kutilmagan so'rov.\", hl: [5] },"),
    # Yakun: 7-band
    ("  { k: 'err', t: \"Nest xatosi o'qiladi: qaysi klass · qaysi dependency · qaysi fayl\" },\n];",
     "  { k: 'err', t: \"Nest xatosi o'qiladi: qaysi klass · qaysi dependency · qaysi fayl\" },\n  { k: 'ai', t: \"AI yozgan kod: 4 savol va 3 kutilmagan so'rov bilan tekshiriladi\" },\n];"),
    # Eslatma: AI tekshiruvi + lug'at (Uyga vazifa oldidan)
    ("## Uyga vazifa\ncars-api'ga users moduli:",
     "## AI yozgan kodni tekshirish\n"
     "4 savol: fayllar (module · controller · service) · ro'yxatlar (providers, AppModule imports, terminalda Mapped) · logika Service'da · decorator'lar\n"
     "3 kutilmagan so'rov: harfli id (/customers/abc → 400, 404 «NaN» emas) · bo'sh body ({} → 400, 201 emas) · begona maydon (\"id\": 1 → id'ni server beradi)\n"
     "Yoyish tartibi: { ...data, id } — id oxirida; { id, ...data } — body'dagi id ustidan yozadi\n"
     "TS1272 «must be imported with 'import type'» → Controller'dagi tipni import type bilan oling\n"
     "## Lug'at\n"
     "decorator — @ bilan boshlanadigan belgi · provider — modul yaratib beradigan narsa (asosan Service) · instance — klassdan yasalgan obyekt · inject — Nest'ning tayyor obyektni konstruktorga berishi · path — manzil, route — path + metod · Mapped — terminaldagi ulangan route satri · pipe — kiruvchi qiymatni tekshiradi yoki o'zgartiradi (ParseIntPipe) · DTO — kiruvchi ma'lumot shakli · HttpException — status bilan qaytadigan xatolar oilasi · CLI — nest g buyruqlari\n"
     "## Uyga vazifa\ncars-api'ga users moduli:"),
], regex=[
    # b6 dan keyin b7 segmenti
    (r"(\n  \{ id: 'b6', key: [^\n]*\n)", lambda m: m.group(1) + "  { id: 'b7', key: \"AI yozgan kod: <b>4 savol</b> va <b>3 kutilmagan so'rov</b> bilan tekshiriladi\", text: \"Va yana bittasi: AI yozgan kodni to'rt savol bilan o'qing va uchta kutilmagan so'rov yuboring: harfli id, bo'sh body va begona maydon.\", hl: 'ai' },\n", 1),
])
edit('08-ru.jsx', [
    ("'Практика (четыре части)', 'Как вести урок ученика']", "'Практика и код от ИИ', 'Как вести урок ученика']"),
    ("затем практическое задание и арена. На экране debugging работает правило, которое вы сегодня выучили: в Controller не считают.' },",
     "затем практическое задание и арена. На экране debugging работает правило, которое вы сегодня выучили: в Controller не считают. А код от ИИ проверяете, как на шестом этапе: четыре вопроса и три неожиданных запроса.' },"),
    ("  { t: 'Ошибку Nest читают: какой класс · какой dependency · какой файл' },\n]);",
     "  { t: 'Ошибку Nest читают: какой класс · какой dependency · какой файл' },\n  { t: 'Код от ИИ проверяют 4 вопросами и 3 неожиданными запросами' },\n]);"),
    ("## Домашнее задание\n", "## Проверка кода от ИИ\n"
     "4 вопроса: файлы (module · controller · service) · списки (providers, imports в AppModule, Mapped в терминале) · логика в Service · decorator\n"
     "3 неожиданных запроса: id из букв (/customers/abc → 400, а не 404 «NaN») · пустой body ({} → 400, а не 201) · чужое поле (\"id\": 1 → id выдаёт сервер)\n"
     "Порядок разворота: { ...data, id } — id в конце; { id, ...data } — id из body записывается поверх\n"
     "TS1272 «must be imported with 'import type'» → тип в Controller импортируйте через import type\n"
     "## Словарь\n"
     "decorator — метка, начинается с @ · provider — то, что создаёт модуль (в основном Service) · instance — объект, созданный из класса · inject — Nest передаёт готовый объект в конструктор · path — адрес, route — path + метод · Mapped — строка подключённого route в терминале · pipe — проверяет или меняет входное значение (ParseIntPipe) · DTO — форма входных данных · HttpException — семейство ошибок со статусом · CLI — команды nest g\n"
     "## Домашнее задание\n"),
], regex=[
    (r"(\n  b6: \{ key: 'Ошибку Nest[^\n]*\n)", lambda m: m.group(1) + "  b7: { key: 'Код от ИИ проверяют <b>4 вопросами</b> и <b>3 неожиданными запросами</b>', text: 'И ещё одно: код от ИИ читайте по четырём вопросам и отправляйте три неожиданных запроса: id из букв, пустой body и чужое поле.' },\n", 1),
])
# Ruscha AI ekrani (S_AI) — 08-ru.jsx oxiriga
ru_ai = r"""
// --- F-1125-01: 6-bosqich · AI yozgan kod (06b-ai.jsx) ---
ru(S_AI, {
  kicker: 'Этап 6 · код от ИИ', title: 'Модуль customers от ИИ: два задания, два результата',
  segments: {
    a: { key: 'Мы поручили ИИ модуль <b>customers</b>: один и тот же ИИ, <b>два разных задания</b>', text: 'Сейчас большую часть кода пишет ИИ, ваша работа — его проверить. Мы поручили ИИ добавить в проект cars api модуль арендаторов, то есть customers. ИИ один, Claude Haiku, а задания два: слева простыми словами, справа на языке Nest. В обоих одно правило: если возраст меньше восемнадцати, не добавлять.', show: 'Сейчас большую часть кода пишет ИИ, ваша работа — его проверить. Мы поручили ИИ добавить в проект <code>cars-api</code> модуль арендаторов, то есть <b>customers</b>. ИИ один, Claude Haiku, а задания два: слева простыми словами, справа на языке Nest. В обоих одно правило: если возраст меньше 18, не добавлять.' },
    b: { key: 'Проверка 1 — <b>структура</b>: четыре вопроса, оба ИИ прошли', text: 'Первая проверка — структура, четыре вопроса сегодняшнего урока. Файлы: есть ли module, controller, service. Списки: Service в providers, модуль в imports у AppModule, появились ли в терминале три строки Mapped для customers. Логика: правило возраста в Service. Decorator на месте. Оба ИИ прошли все четыре вопроса.' },
    c: { key: 'Проверка 2 — <b>запросы</b>: на <code>/customers/abc</code> A вернул <b>404 «NaN»</b>', text: 'Вторая проверка — запросами. Список, клиент девяносто девять и клиент пятнадцати лет у обоих правильные. Но на запрос customers abc A вернул четыреста четыре и NaN: в нём нет ParseIntPipe, id взят через Number, ровно как на двадцать первом экране. У B ParseIntPipe есть, потому что его просили в задании.', show: 'Вторая проверка — запросами. Список, <code>/customers/99</code> и клиент 15 лет у обоих правильные. Но на <code>/customers/abc</code> A вернул <b>404</b> и «NaN»: в нём нет <code>ParseIntPipe</code>, id взят через <code>Number</code>, ровно как на 21-м экране. У B <code>ParseIntPipe</code> есть, потому что его просили в задании.' },
    d: { key: 'Неожиданные запросы: <b>пустой POST</b> и <b>id: 1</b> в body — у B оба прошли', text: 'Теперь два неожиданных запроса: пустой POST и id один внутри body. A остановил оба: на пустой POST четыреста, а id из body проигнорировал. B создал пустого клиента, и в списке появился второй id один. Теперь запрос customers один возвращает старого, а новый лежит в списке с повторным id.', show: 'Теперь два неожиданных запроса: пустой <code>POST {}</code> и <code>"id": 1</code> внутри body. A остановил оба: на пустой POST <b>400</b>, а id из body проигнорировал. B создал пустого клиента, и в списке появился <b>второй id: 1</b>. Теперь <code>/customers/1</code> возвращает старого, а новый лежит в списке с повторным id.' },
    e: { key: 'Вывод: каждый ИИ пропустил <b>то, чего не было в задании</b> — проверяйте <b>4 вопросами и 3 запросами</b>', text: 'Вывод. Каждый ИИ пропустил то, чего не было в задании: простое задание — ParseIntPipe, который нужен именно в Nest, задание на языке Nest — проверку входных данных. Это одна проверка, другой ИИ напишет иначе. Значит, читайте код от ИИ по четырём вопросам и отправляйте три неожиданных запроса: id из букв, пустой body и чужое поле.' },
  },
});
"""
with open(os.path.join(P, '08-ru.jsx'), 'a', encoding='utf-8') as f:
    f.write(ru_ai)
print('ok 08-ru.jsx (S_AI)')
