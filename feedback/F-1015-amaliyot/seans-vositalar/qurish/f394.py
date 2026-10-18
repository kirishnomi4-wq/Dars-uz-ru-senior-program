# F-1015-394: 216-qonun — LMS 2–6 praktika bo'lmagan darslar (+ m2-08, m4-08) kirish javobi qisqa. Foydalanuvchi: «kerak bo'lsa barcha darslarga tarqat, LMS 2–6». ReactFirstComponent — 3-seans ishlayapti, tegilmadi.
import shutil, os
R = '/home/kali/Desktop/internetLesson/'
A = ('Aynan!', 'Именно!')
D = {
 '1-Modull/PmLesson2.jsx': ({'a': ("Rang emas — bo'limlar tartibi farq qiladi.", 'Не цвет — отличается порядок разделов.'), 'b': ("Aynan! Tartib to'g'ri bo'lsa, kerakli narsa darrov topiladi.", 'Именно! При верном порядке нужное находится сразу.'), 'c': ('Matn bir xil — tartibi boshqa.', 'Текст тот же — порядок другой.')},
   ("Bugun shu tartibni qurishni o'rganasiz.", 'Сегодня научитесь выстраивать этот порядок.')),
 '1-Modull/PmLesson3.jsx': ({'a': ('Sayt bir xil — farq qanday aytilganida.', 'Сайт тот же — разница в том, как сказано.'), 'b': ("Aynan! Zal o'z qiyinchiligini taniydi.", 'Именно! Зал узнаёт свою трудность.'), 'c': ('Uzunlik emas — boshlanish farq qiladi.', 'Не длина — отличается начало.')},
   ("Bugun ota-onangiz oldida aytadigan 3 daqiqalik nutqni tayyorlaymiz.", 'Сегодня готовим 3-минутную речь для родителей.')),
 '1-Modull/VsCodeLesson.jsx': ({'a': ('Word matn uchun — kod uchun emas.', 'Word — для текста, не для кода.'), 'b': ('Aynan! Bu — VS Code.', 'Именно! Это — VS Code.'), 'c': ('Brauzer kodni ochadi, yozish uchun emas.', 'Браузер открывает код, а не пишет его.')},
   ("Bugun VS Code'ni kompyuteringizga o'rnatamiz.", 'Сегодня установим VS Code на ваш компьютер.')),
 '2-Modull/JsFunctionsLesson.jsx': ({'a': ("Qo'lda qayta yozish — sekin va xato ko'p.", 'Переписывать вручную — долго и с ошибками.'), 'b': ('Aynan! Bu — funksiya.', 'Именно! Это — функция.'), 'c': ('Hisobsiz o\'yin ishlamaydi.', 'Без подсчёта игра не работает.')},
   ("Bugun funksiya yozib, uni nom bilan chaqirishni o'rganamiz.", 'Сегодня научимся писать функцию и вызывать её по имени.')),
 '2-Modull/PeanStackLesson.jsx': ({'a': ('Internet ishlayapti — izoh saqlanmagan.', 'Интернет работает — комментарий не сохранён.'), 'b': A, 'c': ("Sayt buzilmagan — izohni saqlaydigan joy yo'q.", 'Сайт не сломан — комментарий негде хранить.')},
   ('Bugun izohni saqlaydigan server va baza bilan tanishamiz.', 'Сегодня познакомимся с сервером и базой, которые хранят данные.')),
 '2-Modull/PracticeLesson1.jsx': ({'a': A, 'b': ("Internet emas — saytda JavaScript yo'q.", 'Дело не в интернете — на сайте нет JavaScript.'), 'c': ('Tugma chiroyli — lekin unga JavaScript kerak.', 'Кнопка красивая — но ей нужен JavaScript.')},
   ("Bugun saytga JavaScript qo'shamiz — tugma bosilganda ishlaydi.", 'Сегодня добавим на сайт JavaScript — кнопка заработает.')),
 '3-Modull/PmLesson7.jsx': ({'a': ('Qisqalik emas — aniqlik farq qiladi.', 'Не краткость — отличается точность.'), 'b': A, 'c': ("Farq bor: noaniq buyruq — noto'g'ri natija.", 'Разница есть: неясная просьба — неверный результат.')},
   ("Bugun shunday aniq so'rov — User Story yozishni o'rganamiz.", 'Сегодня учимся писать такую точную просьбу — User Story.')),
 '3-Modull/ReactApiPostLesson.jsx': ({'a': ('Internet emas — GET faqat oladi.', 'Дело не в интернете — GET только получает.'), 'b': A, 'c': ('Server tanlamaydi — GET hech narsa yubormaydi.', 'Сервер не выбирает — GET ничего не отправляет.')},
   ("Bugun serverga yuborishni o'rganamiz: POST, PUT, DELETE.", 'Сегодня учимся отправлять на сервер: POST, PUT, DELETE.')),
 '3-Modull/ReactPropsReuseLesson.jsx': ({'a': ("6 ta shart emas — kod bir xil, faqat ma'lumot boshqa.", 'Не 6 — код один, разные только данные.'), 'b': A, 'c': ("Bitta yetadi — farq faqat ma'lumotda.", 'Хватит одного — разница только в данных.')},
   ("Bugun ma'lumotni props bilan uzatib, butun katalogni quramiz.", 'Сегодня передадим данные через props и построим весь каталог.')),
 '4-Modull/ApiPostmanLesson.jsx': ({'a': ("Kod ichida emas — sayt serverdan so'raydi.", 'Не в коде — сайт спрашивает у сервера.'), 'b': A, 'c': ("Sayt bazaga o'zi kira olmaydi — server orqali.", 'Сайт не ходит в базу сам — только через сервер.')},
   ("Bugun sayt va server orasidagi so'rov–javobni o'rganamiz.", 'Сегодня изучим запрос и ответ между сайтом и сервером.')),
 '4-Modull/AuthEnvLesson.jsx': ({'a': ("Unda har kim mahsulotni o'chira oladi.", 'Тогда любой сможет удалить товар.'), 'b': A, 'c': ("Qog'oz — orqaga qadam; login yetarli.", 'Бумага — шаг назад; хватит входа по логину.')},
   ("Bugun login qo'shamiz: faqat kirgan odam o'zgartira oladi.", 'Сегодня добавим вход: изменять сможет только вошедший.')),
 '4-Modull/BackendCrudPracticeLesson.jsx': ({'a': ("Yangilasangiz, o'zgarish yo'qoladi.", 'Обновите страницу — изменения пропадут.'), 'b': A, 'c': ("Rang emas — ma'lumot saqlanmayapti.", 'Не цвет — данные не сохраняются.')},
   ("Bugun ma'lumotni bazada saqlaydigan backend quramiz.", 'Сегодня построим backend, который хранит данные в базе.')),
 '4-Modull/DataIntroLesson.jsx': ({'a': ('Havoda emas — ular diskda saqlanadi.', 'Не «в воздухе» — они хранятся на диске.'), 'b': ("Server o'chdi — lekin postlar qoldi.", 'Сервер выключился — а посты остались.'), 'c': A},
   ("Bugun ma'lumotlar bazasi bilan tanishamiz.", 'Сегодня знакомимся с базой данных.')),
 '4-Modull/DbSqlNosqlLesson.jsx': ({'a': ('Jadval har doim ham qulay emas.', 'Таблица удобна не всегда.'), 'b': ("Zamonaviylik — sabab emas.", 'Новизна — не причина.'), 'c': A},
   ("Bugun tanlashni o'rganamiz va nega PostgreSQL mos kelishini ko'ramiz.", 'Сегодня учимся выбирать и увидим, почему нам подходит PostgreSQL.')),
 '4-Modull/NodeServerLesson.jsx': ({'a': ("Brauzer faqat so'raydi — javob bermaydi.", 'Браузер только спрашивает — не отвечает.'), 'b': ('Internet faqat yetkazadi — javobni server beradi.', 'Интернет только доставляет — отвечает сервер.'), 'c': A},
   ("Bugun shu serverni Node.js bilan o'zingiz yozasiz.", 'Сегодня сами напишете этот сервер на Node.js.')),
 '4-Modull/PostgresCrudLesson.jsx': ({'a': ("Qo'lda yozilsa, har o'zgarishda kodni tahrirlash kerak.", 'Если вписать вручную — код придётся править при каждом изменении.'), 'b': A, 'c': ("Brauzer xotirasi yo'qoladi — baza esa qoladi.", 'Память браузера пропадает — база остаётся.')},
   ("Bugun bazani o'zimiz boshqarishni o'rganamiz.", 'Сегодня учимся сами управлять базой.')),
 '4-Modull/RoutingLesson.jsx': ({'a': ('Tasodif emas — server aniq qoida bilan tanlaydi.', 'Не случайно — сервер выбирает по точному правилу.'), 'b': ('Birinchisi emas — manzilga mosi tanlanadi.', 'Не первый — выбирается подходящий по адресу.'), 'c': ('Aynan! Bu — routing.', 'Именно! Это — routing.')},
   ("Bugun method va path bo'yicha routing'ni Nest'da ochamiz.", 'Сегодня разберём routing по method и path в Nest.')),
 '4a-Modull/NestArchAliveLesson.jsx': ({'a': ('Bitta fayl yana chalkashib ketadi.', 'В одном файле снова будет путаница.'), 'b': A, 'c': ('Tashlab ketish shart emas — tartibga solinadi.', 'Бросать не нужно — достаточно навести порядок.')},
   ('Bugun tayyor NestJS loyihasini clone qilib, ishga tushiramiz.', 'Сегодня клонируем готовый проект NestJS и запустим его.')),
 '4b-Modull/EdgeCasesTestLesson.jsx': ({'a': ('Unda do\'kon manfiy buyurtmani ham qabul qiladi.', 'Тогда магазин примет и отрицательный заказ.'), 'b': A, 'c': ('Bunday mijoz doim topiladi.', 'Такой клиент всегда найдётся.')},
   ("Bugun noto'g'ri kirishni ham sinaymiz — edge cases.", 'Сегодня проверяем и неверный ввод — edge cases.')),
 '4b-Modull/JestUnitTestLesson.jsx': ({'a': ("Qo'lda tekshirish — sekin va charchatadi.", 'Проверять вручную — долго и утомительно.'), 'b': A, 'c': ('Tekshirmasangiz, xatoni mijoz topadi.', 'Без проверки ошибку найдёт клиент.')},
   ("Bugun Jest bilan test yozamiz — kompyuter o'zi tekshiradi.", 'Сегодня пишем тесты на Jest — компьютер проверяет сам.')),
}
q = lambda t: '"' + t + '"' if "'" in t else "'" + t + "'"
for f, (ack, bugun) in D.items():
    p = R + 'src/' + f; s = open(p, encoding='utf-8').read()
    if 'ACK_KIRISH' in s: print('bor', f); continue
    for k, v in ack.items(): assert len(v[0]) + 1 + len(bugun[0]) <= 120, (f, k)
    shutil.copy(p, R + 'arxiv/F-1015-394-oldin/' + os.path.basename(f))
    i = s.index('{picked !== null && <p className="hook-ack')
    e = s.index('</p>}', i) + 5
    s = s[:i] + '{picked !== null && <p className="hook-ack fade-step"><b>{tr(ACK_KIRISH[picked])}</b> {tr({ uz: ' + q(bugun[0]) + ', ru: ' + q(bugun[1]) + ' })}</p>}' + s[e:]
    a = s.rfind('\nconst Screen', 0, i) + 1
    c = "// F-1015-394 (216-qonun): kirish javobi — variantga bitta qisqa gap + «Bugun…» qatori (eski uzun umumiy matn o'qilmasdi)\nconst ACK_KIRISH = {\n" + ',\n'.join(f"  {k}: {{ uz: {q(v[0])}, ru: {q(v[1])} }}" for k, v in ack.items()) + '\n};\n'
    s = s[:a] + c + s[a:]
    open(p, 'w', encoding='utf-8').write(s); print('ok', f)
