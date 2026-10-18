# F-1015-393: kirish javobi — tanlangan variantga bitta qisqa gap + bitta «Bugun…» qatori (m4-13 F-1015-392 naqshi, 10 praktika)
import shutil, os
R = '/home/kali/Desktop/internetLesson/'
D = {
 'src/1-Modull/DeployLesson.jsx': ({
   'a': ("Fayl telefonda sayt bo'lib ochilmaydi.", 'Файл на телефоне не откроется как сайт.'),
   'b': ('Aynan!', 'Именно!'),
   'c': ("Har safar kelib ko'rish — qulay emas.", 'Каждый раз приходить — неудобно.')},
   ("Bugun saytni internetga chiqarib, havola olasiz.", 'Сегодня выложите сайт в интернет и получите ссылку.')),
 'src/2-Modull/PracticeLesson3.jsx': ({
   'a': ('Aynan!', 'Именно!'),
   'b': ("Tezlik emas — reja yo'q edi.", 'Дело не в скорости — не было плана.'),
   'c': ("Kompyuter emas — reja yo'q edi.", 'Дело не в компьютере — не было плана.')},
   ("Bugun katta vazifani bo'laklab, reja tuzishni o'rganamiz.", 'Сегодня учимся разбивать большую задачу и составлять план.')),
 'src/2-Modull/PracticeLesson4.jsx': ({
   'a': ('Aynan!', 'Именно!'),
   'b': ('Rang bosilganni eslab qolmaydi.', 'Цвет не запоминает нажатие.'),
   'c': ("Mahsulot ko'paysa ham, bosilgani eslanmaydi.", 'Больше товаров — нажатие всё равно не запомнится.')},
   ("Bugun JavaScript bilan savat qo'shamiz va do'konni internetga chiqaramiz.", 'Сегодня добавим корзину на JavaScript и выложим магазин в интернет.')),
 'src/3-Modull/ReactCrudPracticeLesson.jsx': ({
   'a': ("Hozir ilova faqat ko'rsatadi — bu yetmaydi.", 'Сейчас приложение только показывает — этого мало.'),
   'b': ('Aynan!', 'Именно!'),
   'c': ('Rang emas — amallar yetishmaydi.', 'Не цвет — не хватает действий.')},
   ("Bugun qo'shish, o'zgartirish va o'chirishni qo'shamiz.", 'Сегодня добавим создание, изменение и удаление.')),
 'src/3-Modull/ReactRouterPracticeLesson.jsx': ({
   'a': ('Ana shu eski usul — har bosishda qayta yuklaydi.', 'Это и есть старый способ — перезагрузка при каждом клике.'),
   'b': ('Aynan! Router faqat kerakli qismni almashtiradi.', 'Именно! Router меняет только нужную часть.'),
   'c': ('Internet emas — Router faqat kerakli qismni almashtiradi.', 'Дело не в интернете — Router меняет только нужную часть.')},
   ("Bugun robo-games'ni ko'p sahifali qilamiz.", 'Сегодня сделаем robo-games многостраничным.')),
 'src/3-Modull/ReactProjectDayLesson.jsx': ({
   'a': ('Har biri — bitta ilovaning qismi.', 'Каждая — часть одного приложения.'),
   'b': ('Aynan!', 'Именно!'),
   'c': ("Siz ham qila olasiz — AI yordamida.", 'Вы тоже сможете — с помощью AI.')},
   ("Bugun bo'sh sahifadan to'liq AvtoIjara ilovasini qurasiz.", 'Сегодня с пустой страницы построите полное приложение AvtoIjara.')),
 'src/4-Modull/FullstackFeedbackLesson.jsx': ({
   'a': ('Sinfdosh aybdor emas — panel bir bosishda chiqarib yubordi.', 'Одноклассник не виноват — панель выпустила машину одним нажатием.'),
   'b': ('Aynan!', 'Именно!'),
   'c': ('Taqiqlash yechim emas — chiqarish baribir kerak.', 'Запрет — не решение: выпускать всё равно нужно.')},
   ("Bugun sinfdoshlardan fikr yig'ib, panelni yaxshilaymiz.", 'Сегодня соберём отзывы одноклассников и улучшим панель.')),
 'src/4c-Modull/FullPipelineProjectLesson.jsx': ({
   'a': ("Qo'lda — bittasini unutsangiz, yuk tekshirilmay uchadi.", 'Вручную — забудете одну, и багаж улетит непроверенным.'),
   'b': ('Aynan!', 'Именно!'),
   'c': ('Qolgan 4 nuqta tekshirilmay qoladi.', 'Остальные 4 точки останутся без проверки.')},
   ('Bugun 5 nuqtani bitta LENTAga birlashtiramiz.', 'Сегодня соединим 5 точек в один КОНВЕЙЕР.')),
 'src/4c-Modull/AiPipelineProjectLesson.jsx': ({
   'a': ("Hammasini o'zingiz o'qisangiz — sekin.", 'Читать всё самому — медленно.'),
   'b': ('Aynan!', 'Именно!'),
   'c': ('Tekshirmasangiz — xato productionga chiqadi.', 'Без проверки ошибка уйдёт в production.')},
   ("Bugun Copilot'dan aniq so'rashni va javobini tekshirishni o'rganamiz.", 'Сегодня учимся точно спрашивать Copilot и проверять его ответ.')),
 'src/4c-Modull/FullProPipelineLesson.jsx': ({
   'a': ('Boshqa server kelganda yana sinadi.', 'Придёт другой сервер — снова сломается.'),
   'b': ('Aynan!', 'Именно!'),
   'c': ('Unda xatoni foydalanuvchi topadi.', 'Тогда ошибку найдёт пользователь.')},
   ('Bugun lentani bir nechta muhitda parallel tekshiramiz.', 'Сегодня проверим ленту параллельно в нескольких средах.')),
}
q = lambda t: '"' + t + '"' if "'" in t else "'" + t + "'"
for f, (ack, bugun) in D.items():
    p = R + f; s = open(p, encoding='utf-8').read()
    if 'ACK_KIRISH' in s: print('bor', f); continue
    shutil.copy(p, R + 'arxiv/F-1015-393-oldin/' + os.path.basename(f))
    i = s.index('{picked !== null && <p className="hook-ack')
    e = s.index('</p>}', i) + 5
    s = s[:i] + '{picked !== null && <p className="hook-ack fade-step"><b>{tr(ACK_KIRISH[picked])}</b> {tr({ uz: ' + q(bugun[0]) + ', ru: ' + q(bugun[1]) + ' })}</p>}' + s[e:]
    a = s.rfind('\nconst Screen', 0, i) + 1
    const = "// F-1015-393: kirish javobi — variantga bitta qisqa gap + «Bugun…» qatori (eski uzun umumiy matn o'qilmasdi)\nconst ACK_KIRISH = {\n" + ',\n'.join(f"  {k}: {{ uz: {q(v[0])}, ru: {q(v[1])} }}" for k, v in ack.items()) + '\n};\n'
    s = s[:a] + const + s[a:]
    open(p, 'w', encoding='utf-8').write(s); print('ok', f)
