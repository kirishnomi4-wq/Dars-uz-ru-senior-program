# RU compiler vazifalari: compiler/<id>/{starter,yechim,kutilgan.txt,meta.json} → compiler/<id>/ru/... (matn almashtirish ro'yxati bilan).
# Ishlatish: python3 vositalar/ru-compiler.py — har almashtirish aynan topilishi shart (topilmasa xato); oxirida o'zbekcha qoldiq qidiriladi.
import json, os, re, shutil, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'compiler')

# Barcha fayllarga (starter + yechim + kutilgan) qo'llanadigan juftlar, uzunidan qisqasiga
T = {
'2-3': [("<title>Brawl Stars</title>", "<title>Brawl Stars</title>"),
        ("<h2>Nega yoqadi?</h2>", "<h2>Почему нравится?</h2>"),
        ("<li>O'yin 3 daqiqada tugaydi</li>", "<li>Матч длится всего 3 минуты</li>"),
        ("<li>Do'stlar bilan jamoa bo'lib o'ynash mumkin</li>", "<li>Можно играть командой с друзьями</li>"),
        ("<li>Har oy yangi qahramonlar chiqadi</li>", "<li>Каждый месяц выходят новые герои</li>"),
        ("<h2>Qanday o'ynaladi?</h2>", "<h2>Как играть?</h2>"),
        ("<li>Qahramon tanlaysiz</li>", "<li>Выбираете героя</li>"),
        ("<li>Rejimni tanlaysiz</li>", "<li>Выбираете режим</li>"),
        ("<li>Raqib jamoadan oldin 3 ta yulduz yig'asiz</li>", "<li>Собираете 3 звезды раньше команды соперника</li>"),
        ("<p>Bu o'yinda eng <strong>muhimi</strong> — jamoa bilan <em>birga</em> harakat qilish.</p>", "<p>В этой игре <strong>главное</strong> — действовать <em>вместе</em> с командой.</p>"),
        (">Rasmiy sayt</a>", ">Официальный сайт</a>")],
'2-4': [("<title>Futbol to'garagi</title>", "<title>Футбольная секция</title>"),
        ("<h1>«Chempion» futbol to'garagi</h1>", "<h1>Футбольная секция «Чемпион»</h1>"),
        ('alt="Yashil futbol maydoni va to\'p"', 'alt="Зелёное футбольное поле и мяч"'),
        ("<p>Haftada uch marta, maktab stadionida.</p>", "<p>Три раза в неделю, на школьном стадионе.</p>"),
        ('<label for="ism">Ismingiz:</label>', '<label for="ism">Ваше имя:</label>'),
        ('<label for="parol">Parol:</label>', '<label for="parol">Пароль:</label>'),
        ("<button>Yozilish</button>", "<button>Записаться</button>"),
        ("<p>Telefon: +998 90 123 45 67 · © 2026</p>", "<p>Телефон: +998 90 123 45 67 · © 2026</p>")],
'2-5': [("<title>Kirish</title>", "<title>Вход</title>"),
        ('alt="RoboKlub logotipi"', 'alt="Логотип RoboKlub"'),
        ("<h1>Xush kelibsiz</h1>", "<h1>Добро пожаловать</h1>"),
        ("<p>Hisobingizga kiring</p>", "<p>Войдите в свой аккаунт</p>"),
        ('placeholder="siz@mail.uz"', 'placeholder="name@mail.uz"'),
        ('<label for="parol">Parol</label>', '<label for="parol">Пароль</label>'),
        ("<button>Kirish</button>", "<button>Войти</button>"),
        (">Parolni unutdingizmi?</a>", ">Забыли пароль?</a>"),
        ("/* Namuna (AI-agent bilan yozilgan qism): vazifa rasmi shu sahifadan olinadi */", "/* Образец (часть, написанная с AI-агентом): картинка к заданию снята с этой страницы */")],
'2-7': [("<title>Kino afishasi</title>", "<title>Киноафиша</title>"),
        ('<h1 id="title">Yulduzlararo sayohat</h1>', '<h1 id="title">Путешествие к звёздам</h1>'),
        ('<p class="genre">Fantastika · 12+</p>', '<p class="genre">Фантастика · 12+</p>'),
        ("<p>Seans: shanba, 18:00 · Kinoteatr «Navro'z»</p>", "<p>Сеанс: суббота, 18:00 · Кинотеатр «Навруз»</p>"),
        ("<p>Chipta narxi: 40 000 so'm</p>", "<p>Цена билета: 40 000 сум</p>")],
'2-8': [("<title>Robotika to'garagi</title>", "<title>Кружок робототехники</title>"),
        ('<a href="#">Darslar</a>', '<a href="#">Уроки</a>'),
        ('<a href="#">Musobaqa</a>', '<a href="#">Соревнования</a>'),
        ('<a href="#">Aloqa</a>', '<a href="#">Контакты</a>'),
        ("<h1>Robot yasashni o'rganing</h1>", "<h1>Научитесь собирать роботов</h1>"),
        ("<p>Har shanba, 12–16 yoshlilar uchun.</p>", "<p>Каждую субботу, для ребят 12–16 лет.</p>"),
        ("<h3>Boshlang'ich</h3>", "<h3>Начальный</h3>"),
        ("<p>Sensor va motor bilan birinchi robot.</p>", "<p>Первый робот с датчиком и мотором.</p>"),
        ("<h3>O'rta</h3>", "<h3>Средний</h3>"),
        ("<p>Chiziq bo'ylab yuradigan robot.</p>", "<p>Робот, который едет по линии.</p>"),
        ("<h3>Musobaqa</h3>", "<h3>Соревнования</h3>"),
        ("<p>Sumo-robotlar jangi uchun tayyorgarlik.</p>", "<p>Подготовка к битве сумо-роботов.</p>"),
        ("<button>Batafsil</button>", "<button>Подробнее</button>"),
        ("<p>RoboKlub · Toshkent · 2026</p>", "<p>RoboKlub · Ташкент · 2026</p>"),
        ("/* Flex qoidalari — o'quvchi o'zi yozadi */", "/* Flex-правила — ученик пишет сам */"),
        ("/* Bezak va harakat — AI-agent bilan */", "/* Оформление и анимация — с AI-агентом */")],
'3-3': [("// O'yinchi profili", "// Профиль игрока"),
        ("// 1. const bilan playerName va birthYear oching", "// 1. Создайте через const playerName и birthYear"),
        ("// 2. let bilan score = 0 va isOnline = true oching", "// 2. Создайте через let score = 0 и isOnline = true"),
        ("// 3. score ni avval 50 qiling, keyin score = score + 25", "// 3. Сначала сделайте score = 50, потом score = score + 25"),
        ("// 4. To'rt qatorni konsolga chiqaring", "// 4. Выведите в консоль четыре строки")],
'3-4': [("// 1. Baho", "// 1. Оценка"),
        ("// sinab bo'lgach, yana 78 qilib qo'ying", "// после проверки верните обратно 78"),
        ("// 2. PIN-kod", "// 2. PIN-код"),
        ("// 3. Zaryad", "// 3. Заряд"),
        ('"Baho: ', '"Оценка: '),
        ('"Telefon ochildi"', '"Телефон разблокирован"'),
        ("\"PIN noto'g'ri\"", '"Неверный PIN"'),
        ('"Zaryad kam!"', '"Мало заряда!"'),
        ('"Zaryad yetarli"', '"Заряда хватает"')],
'3-5': [("// 1. for bilan har narxni chiqaring: \"1-mahsulot: 12000 so'm\"", '// 1. Через for выведите каждую цену: "Товар 1: 12000 сум"'),
        ("// 2. for bilan jamini hisoblang: \"Jami: 40000 so'm\"", '// 2. Через for посчитайте сумму: "Итого: 40000 сум"'),
        ("// 3. while: kuniga 3000 so'm yig'asiz, 20000 ga yetguncha nechta kun?", "// 3. while: вы откладываете 3000 сум в день — сколько дней до 20000?"),
        ("console.log((i + 1) + \"-mahsulot: \" + prices[i] + \" so'm\");", 'console.log("Товар " + (i + 1) + ": " + prices[i] + " сум");'),
        ("console.log(\"Jami: \" + jami + \" so'm\");", 'console.log("Итого: " + jami + " сум");'),
        ("console.log(day + \" kunda \" + money + \" so'm\");", 'console.log("За " + day + " дней " + money + " сум");')],
'3-6': [("// 1. zarar(kuch, bonus) — kuch: urish kuchi, bonus: krit bonus. kuch * 3 + bonus ni qaytarsin", "// 1. zarar(kuch, bonus) — kuch: сила удара, bonus: крит-бонус. Возвращает kuch * 3 + bonus"),
        ("// 2. jon(qoldi, urilgan) — qoldi: qolgan jon, urilgan: kelgan zarba. qoldi - urilgan ni qaytarsin; natija 0 dan kichik bo'lsa 0", "// 2. jon(qoldi, urilgan) — qoldi: оставшаяся жизнь, urilgan: полученный удар. Возвращает qoldi - urilgan; если меньше 0 — возвращает 0"),
        ("// 3. jami(narxlar) — narxlar: sonlar massivi. for bilan hamma sonni qo'shib, yig'indini qaytarsin", "// 3. jami(narxlar) — narxlar: массив чисел. Складывает все числа через for и возвращает сумму"),
        ("// 4. Natijalarni o'zgaruvchiga saqlab chiqaring", "// 4. Сохраните результаты в переменные и выведите")],
'3-8': [("<title>Profil</title>", "<title>Профиль</title>"),
        ("<h1>Mening sahifam</h1>", "<h1>Моя страница</h1>"),
        ('<button id="toggle">Ko\'rsat / yashir</button>', '<button id="toggle">Показать / скрыть</button>'),
        ("<p>Men 8-sinfda o'qiyman. Futbol va o'yin yasashni yaxshi ko'raman.</p>", "<p>Я учусь в 8-м классе. Люблю футбол и создавать игры.</p>"),
        ('<label for="name">Ismingiz:</label>', '<label for="name">Ваше имя:</label>'),
        ('<button id="send">Yuborish</button>', '<button id="send">Отправить</button>'),
        ("// 1. Ko'rsat / yashir", "// 1. Показать / скрыть"),
        ("// 2. Jonli salom", "// 2. Живое приветствие"),
        ("// 3. Forma tekshiruvi", "// 3. Проверка формы"),
        ('"Salom, "', '"Привет, "'), ('"Ism kiriting"', '"Введите имя"'), ('"Rahmat, "', '"Спасибо, "')],
'3-9': [("<title>Shaxmat to'garagi</title>", "<title>Шахматный кружок</title>"),
        ("<h1>Shaxmat to'garagi</h1>", "<h1>Шахматный кружок</h1>"),
        ("<p>Har kuni 30 daqiqa — va har hafta yangi g'alaba.</p>", "<p>30 минут в день — и каждую неделю новая победа.</p>"),
        ("<button>Yozilish</button>", "<button>Записаться</button>"),
        ("<div class=\"card\"><h3>Murabbiy</h3><p>Tajribali murabbiy bilan darslar.</p></div>", "<div class=\"card\"><h3>Тренер</h3><p>Занятия с опытным тренером.</p></div>"),
        ("<div class=\"card\"><h3>Turnirlar</h3><p>Har oy sinf turniri.</p></div>", "<div class=\"card\"><h3>Турниры</h3><p>Каждый месяц — турнир класса.</p></div>"),
        ("<div class=\"card\"><h3>Onlayn</h3><p>Uydan ham o'ynash mumkin.</p></div>", "<div class=\"card\"><h3>Онлайн</h3><p>Можно играть и из дома.</p></div>"),
        ("<!-- prompt: Shaxmat to'garagi promo sahifasiga sarlavhasi \"Tariflar\" bo'lgan yangi bo'lim qo'sh.\nUnda 3 ta karta yonma-yon tursin: \"Boshlang'ich\" 150 000 so'm, \"Faol\" 250 000 so'm, \"Chempion\" 400 000 so'm.\nHar kartada nom, oylik narx va 3 ta imkoniyat ro'yxati, pastida \"Tanlash\" tugmasi.\nUslub: sahifadagi mavjud kartalar kabi oq fon, yumshoq burchak; tanlangan karta qora ramka bilan ajralsin.\n\"Tanlash\" bosilganda pastda \"Siz tanladingiz: <nom>\" chiqsin, boshqasi tanlansa almashsin. -->",
         "<!-- prompt: Добавь на промо-страницу шахматного кружка новый раздел с заголовком \"Тарифы\".\nВ нём 3 карточки рядом: \"Начальный\" 150 000 сум, \"Активный\" 250 000 сум, \"Чемпион\" 400 000 сум.\nВ каждой карточке — название, цена за месяц и список из 3 возможностей, внизу кнопка \"Выбрать\".\nСтиль: как у карточек на странице — белый фон, мягкие углы; выбранная карточка выделяется чёрной рамкой.\nПри нажатии \"Выбрать\" внизу появляется \"Вы выбрали: <название>\", при выборе другой — меняется. -->"),
        ("<!-- 2-prompt: \"Faol\" kartasi tepasiga kichik \"Mashhur\" yorlig'ini qo'sh, boshqa hech narsani o'zgartirma. -->", "<!-- 2-й промпт: добавь над карточкой \"Активный\" маленький ярлык \"Популярный\", больше ничего не меняй. -->"),
        ("<h2>Tariflar</h2>", "<h2>Тарифы</h2>"),
        ('data-nom="Boshlang\'ich"', 'data-nom="Начальный"'), ("<h3>Boshlang'ich</h3>", "<h3>Начальный</h3>"),
        ('data-nom="Faol"', 'data-nom="Активный"'), ("<h3>Faol</h3>", "<h3>Активный</h3>"),
        ('data-nom="Chempion"', 'data-nom="Чемпион"'), ("<h3>Chempion</h3>", "<h3>Чемпион</h3>"),
        ("<span class=\"yorliq\">Mashhur</span>", "<span class=\"yorliq\">Популярный</span>"),
        ("so'm / oy", "сум / мес"),
        ("<li>Haftada 2 dars</li><li>Onlayn mashqlar</li><li>Sinf turniri</li>", "<li>2 занятия в неделю</li><li>Онлайн-упражнения</li><li>Турнир класса</li>"),
        ("<li>Haftada 3 dars</li><li>Partiya tahlili</li><li>Shahar turniri</li>", "<li>3 занятия в неделю</li><li>Разбор партий</li><li>Городской турнир</li>"),
        ("<li>Har kuni dars</li><li>Shaxsiy murabbiy</li><li>Respublika turniri</li>", "<li>Занятия каждый день</li><li>Личный тренер</li><li>Республиканский турнир</li>"),
        ('<button class="tanlash">Tanlash</button>', '<button class="tanlash">Выбрать</button>'),
        ('"Siz tanladingiz: "', '"Вы выбрали: "')],
'3-11': [("<title>Mini-do'kon</title>", "<title>Мини-магазин</title>"),
         ("<h1>Mini-do'kon</h1>", "<h1>Мини-магазин</h1>"),
         ('<button data-t="hammasi">Hammasi</button>', '<button data-t="hammasi">Все</button>'),
         ('<button data-t="kiyim">Kiyim</button>', '<button data-t="kiyim">Одежда</button>'),
         ('<button data-t="sport">Sport</button>', '<button data-t="sport">Спорт</button>'),
         ('<button data-t="sevimli">♥ Faqat sevimlilar</button>', '<button data-t="sevimli">♥ Только избранное</button>'),
         ('<div id="sevSon">Sevimli: 0</div>', '<div id="sevSon">Избранное: 0</div>'),
         ('nom: "Futbolka"', 'nom: "Футболка"'), ('nom: "Kepka"', 'nom: "Кепка"'), ('nom: "Krossovka"', 'nom: "Кроссовки"'),
         ("nom: \"To'p\"", 'nom: "Мяч"'), ('nom: "Raketka"', 'nom: "Ракетка"'), ('nom: "Skakalka"', 'nom: "Скакалка"'),
         ("\" so'm</div></div>\"", "\" сум</div></div>\""),
         ('"Sevimli: "', '"Избранное: "'),
         ("// REJA:", "// ПЛАН:"),
         ("// 1. Har mahsulotga \"sevimli\" belgisi (true/false) — massivda saqlanadi.", "// 1. У каждого товара — флаг \"sevimli\" (true/false), хранится в массиве."),
         ("// 2. Har kartochkaga ♥ tugmasi: bosilsa belgi almashadi, katalog qayta chiziladi.", "// 2. На каждой карточке кнопка ♥: при нажатии флаг меняется, каталог перерисовывается."),
         ("// 3. Tepada \"Sevimli: N\" — belgilanganlar soni.", "// 3. Вверху \"Избранное: N\" — число отмеченных."),
         ("// 4. \"Faqat sevimlilar\" tugmasi — faqat belgilanganlarni ko'rsatadi.", "// 4. Кнопка \"Только избранное\" показывает только отмеченные.")],
'3-12': [("<title>Mini-do'kon</title>", "<title>Мини-магазин</title>"),
         ("<h1>Mini-do'kon</h1>", "<h1>Мини-магазин</h1>"),
         ("<h2>Savat</h2>", "<h2>Корзина</h2>"),
         ("<p>Jami: <b id=\"jami\">0</b> so'm</p>", "<p>Итого: <b id=\"jami\">0</b> сум</p>"),
         ('<button id="buyurtma">Buyurtma berish</button>', '<button id="buyurtma">Оформить заказ</button>'),
         ('nom: "Futbolka"', 'nom: "Футболка"'), ('nom: "Kepka"', 'nom: "Кепка"'), ("nom: \"To'p\"", 'nom: "Мяч"'), ('nom: "Skakalka"', 'nom: "Скакалка"'),
         ("\" so'm</p><button data-i=\\\"\" + i + '\">Savatga</button></div>'", "\" сум</p><button data-i=\\\"\" + i + '\">В корзину</button></div>'"),
         ("// AI'ga yozgan so'rovim: \"Savatga Kepka qo'shsam jami 0 o'rniga «045000» chiqyapti. Narx matn bo'lib qolgan.\n// Jami doim son bo'lib hisoblansin — Number() bilan. Boshqa joyni o'zgartirma.\"",
          "// Мой запрос к AI: \"Когда добавляю в корзину Кепку, итог показывает «045000» вместо числа. Цена осталась строкой.\n// Пусть итог всегда считается как число — через Number(). Больше ничего не меняй.\""),
         ("// Buyurtma berish", "// Оформить заказ"),
         ("\"Savat bo'sh\"", '"Корзина пуста"'),
         ('"Buyurtma qabul qilindi: " + jami() + " so\'m"', '"Заказ принят: " + jami() + " сум"')],
}
# 3-5 kutilgan: qator boshidagi raqamni ko'chirish kerak — alohida
KUTILGAN = {'3-3': None, '3-6': None,
  '3-4': "Оценка: 4\nНеверный PIN\nМало заряда!\n",
  '3-5': "Товар 1: 12000 сум\nТовар 2: 8000 сум\nТовар 3: 15000 сум\nТовар 4: 5000 сум\nИтого: 40000 сум\nЗа 7 дней 21000 сум\n"}
RUBRIKA = {
 '2-4': [("not just 'rasm' or empty", "not just 'картинка'/'rasm' or empty")],
 '3-4': [("'Baho: 5', 70+ → 'Baho: 4', 60+ → 'Baho: 3', else 'Baho: 2'", "'Оценка: 5', 70+ → 'Оценка: 4', 60+ → 'Оценка: 3', else 'Оценка: 2'"),
         ("prints 'Telefon ochildi' or \"PIN noto'g'ri\"", "prints 'Телефон разблокирован' or 'Неверный PIN'"),
         ("prints 'Zaryad kam!' or 'Zaryad yetarli'", "prints 'Мало заряда!' or 'Заряда хватает'"),
         ("Baho: 4 / PIN noto'g'ri / Zaryad kam!", "Оценка: 4 / Неверный PIN / Мало заряда!")],
 '3-5': [("'1-mahsulot: 12000 so'm' … '4-mahsulot: 5000 so'm'", "'Товар 1: 12000 сум' … 'Товар 4: 5000 сум'"),
         ("'Jami: 40000 so'm'", "'Итого: 40000 сум'"), ("'7 kunda 21000 so'm'", "'За 7 дней 21000 сум'")],
 '3-8': [("'Salom, <name>!'", "'Привет, <name>!'"), ("'Ism kiriting', otherwise 'Rahmat, <name>!'", "'Введите имя', otherwise 'Спасибо, <name>!'")],
 '3-9': [("a 'Tariflar' section", "a 'Тарифы' section"), ("a 'Tanlash' button", "a 'Выбрать' button"), ("Clicking 'Tanlash'", "Clicking 'Выбрать'"), ("'Siz tanladingiz: <name>'", "'Вы выбрали: <name>'")],
 '3-11': [("A 'Sevimli: N' counter", "An 'Избранное: N' counter"), ("A 'Faqat sevimlilar' button", "A 'Только избранное' button")],
 '3-12': [("shows 'Savat bo'sh'", "shows 'Корзина пуста'"), ("shows 'Buyurtma qabul qilindi: N so'm'", "shows 'Заказ принят: N сум'"), ("adding Kepka (\"45000\")", "adding Кепка (\"45000\")")],
}
xato = 0
for id_, juftlar in T.items():
    src = os.path.join(ROOT, id_); dst = os.path.join(src, 'ru')
    shutil.rmtree(dst, ignore_errors=True)
    ishlatildi = set()
    for q in ('starter', 'yechim'):
        os.makedirs(os.path.join(dst, q))
        for f in os.listdir(os.path.join(src, q)):
            s = open(os.path.join(src, q, f), encoding='utf8').read()
            for i, (a, b) in enumerate(juftlar):
                if a in s: s = s.replace(a, b); ishlatildi.add(i)
            open(os.path.join(dst, q, f), 'w', encoding='utf8').write(s)
    for i, (a, b) in enumerate(juftlar):
        if i not in ishlatildi and a != b:
            print(f'✗ {id_}: topilmadi: {a[:70]}'); xato += 1
    if KUTILGAN.get(id_) is not None: open(os.path.join(dst, 'kutilgan.txt'), 'w').write(KUTILGAN[id_])
    elif os.path.exists(os.path.join(src, 'kutilgan.txt')): shutil.copy(os.path.join(src, 'kutilgan.txt'), os.path.join(dst, 'kutilgan.txt'))
    meta = json.load(open(os.path.join(src, 'meta.json')))
    for a, b in RUBRIKA.get(id_, []):
        if a not in meta['rubrika']: print(f'✗ {id_} rubrika: topilmadi: {a[:60]}'); xato += 1
        meta['rubrika'] = meta['rubrika'].replace(a, b)
    json.dump(meta, open(os.path.join(dst, 'meta.json'), 'w'), ensure_ascii=False, indent=1)
# o'zbekcha qoldiq: izoh/matnlarda o' g' yoki tipik so'zlar (kod nomlari — istisno ro'yxati)
ISTISNO = {"mahsulotlar","savat","savatList","jamiEl","jami","chiz","chizSavat","katalog","toifa","toifalar","tugmalar","sevimli","sevSon","joriyToifa","korsat","son","nom","narx","emoji","karta","kartalar","tanlov","tanlash","tanlangan","tarif","tariflar","yorliq","buyurtma","xabar","hammasi","kiyim","sport","zarar","kuch","bonus","jon","qoldi","urilgan","natija","narxlar","ism","parol","joy","money","day","RoboKlub","Toshkent"}
for id_ in T:
    for q in ('starter', 'yechim'):
        d = os.path.join(ROOT, id_, 'ru', q)
        for f in os.listdir(d):
            for n, line in enumerate(open(os.path.join(d, f), encoding='utf8'), 1):
                # kod ichidagi '…'/"…" va izohlarni tekshiramiz
                for w in re.findall(r"[A-Za-z]+'[a-z]+|\b(?:va|bilan|uchun|qiling|bo'lsa|so'm|kerak|tugma|qo'sh)\b", line):
                    if w not in ISTISNO and not re.search(r"(it|don|can)'", w):
                        print(f'? {id_}/ru/{q}/{f}:{n}: «{w}» — {line.strip()[:80]}'); xato += 1
print('✓ RU compiler fayllari yozildi' if not xato else f'✗ {xato} ta muammo')
sys.exit(1 if xato else 0)
