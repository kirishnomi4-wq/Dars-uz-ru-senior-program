# F-1015-343 · m2-12 PracticeLesson4: 19 → 8 ekran (kirish · reja · a1 savat+jami · a2 xato ovi · a3 Netlify · s15 · podium · yakun)
import os, re, shutil
ROOT = '/home/kali/Desktop/internetLesson'
P = ROOT + '/src/2-Modull/PracticeLesson4.jsx'
P3 = ROOT + '/src/2-Modull/PracticeLesson3.jsx'
Q = ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/'
ARX = ROOT + '/arxiv/F-1015-practice4-oldin/PracticeLesson4.jsx'
if not os.path.exists(ARX):
    os.makedirs(os.path.dirname(ARX), exist_ok=True); shutil.copy(P, ARX)
s = open(ARX, encoding='utf-8').read()   # har doim zaxiradan quriladi (qayta yurgizsa bo'ladi)
def R(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, (c, old[:90])
    s = s.replace(old, new)

# 1) bosh izoh
R("// Tool: Antigravity (haqiqiy uyga vazifa muhiti).\n",
  "// F-1015-343 (16.10, foydalanuvchi bilan): 19 → 8 ekran. Ip — m2-11 dagi jonli katalog (ccDokon: nom, katalog {n,p,t}, reja):\n"
  "//        a1 Gemini — savat (massiv + push) va jami (for sikli, funksiya), kod oynasi qiymatlarni ko'rsatadi; a2 xato ovi — narx matn (\"3000\")\n"
  "//        bo'lib qolgan, jami «03000»; a3 Netlify — papkani sudrab tashlash, havola ccDokon.havola. Antigravity ishlatilmaydi (18+).\n"
  "//        Oldingi 19 ekranli: arxiv/F-1015-practice4-oldin/.\n")
# 2) SCREEN_META
i = s.index('const SCREEN_META = ['); j = s.index('];', i) + 2
s = s[:i] + """const SCREEN_META = [
  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // F-1015-343: savat + jami (Gemini)
  { id: 'a2',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // xato ovi
  { id: 'a3',  type: 'exploration', template: 'custom',   scored: false, scope: null }, // Netlify
  { id: 's15', type: 'test',        template: 'custom',   scored: true,  scope: 'final' }, // yagona ballik — 5 qadam tartibi
  { id: 's15b', type: 'stats',      template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'summary',     template: 'custom',   scored: false, scope: null }
];""" + s[j:]
# 3) ekranlar 0–14 → yangi blok
i = s.index('// ===== SCREEN 0 — HOOK'); j = s.index('// ===== SCREEN 15 — YAKUNIY')
s = s[:i] + open(Q + 'f343-blok.jsx', encoding='utf-8').read() + '\n' + s[j:]
# 4) yakun: RECAP, uyga vazifa
i = s.index('  const RECAP = [{ uz: "Savat va jami narx'); j = s.index('\n', i)
s = s[:i] + """  const RECAP = [{ uz: "Savat — massiv: «Savatga» bosilganda mahsulot push bilan qo'shiladi", ru: 'Корзина — массив: при нажатии «В корзину» товар добавляется через push' }, { uz: "Jami — for sikli bilan narxlar yig'indisi, funksiyada hisoblanadi", ru: 'Итог — сумма цен циклом for, считается в функции' }, { uz: '"3000" — matn, 3000 — son: matnga «+» yopishtiradi, songa qo\\'shadi', ru: '"3000" — текст, 3000 — число: к тексту «+» приклеивает, к числу прибавляет' }, { uz: "AI'ga xatoni aniq aytasiz: nima bo'ldi va nima bo'lishi kerak", ru: 'Ошибку AI описываете точно: что случилось и как должно быть' }, { uz: "Deploy — papkani Netlify'ga tashlab, havolani ulashish", ru: 'Деплой — перетащить папку в Netlify и поделиться ссылкой' }];""" + s[j:]
i = s.index('  const HOMEWORK = [{ b: { uz: "O\'z g\'oyangiz"'); j = s.index('\n', i)
s = s[:i] + """  const HOMEWORK = [{ b: { uz: '«Buyurtma berish»', ru: '«Оформить заказ»' }, t: { uz: "— tugma qo'shing: bosilsa savat tozalansin va «Rahmat!» chiqsin (Gemini yoki Copilot bilan)", ru: '— добавьте кнопку: по нажатию корзина очищается и появляется «Спасибо!» (с Gemini или Copilot)' } }, { b: { uz: "Bo'sh savat", ru: 'Пустая корзина' }, t: { uz: "— savat bo'sh bo'lsa «Savat bo'sh» yozuvi chiqsin", ru: '— если корзина пуста, пусть появляется надпись «Корзина пуста»' } }, { b: { uz: 'Havolani yuboring', ru: 'Отправьте ссылку' }, t: { uz: "— do'stingiz savatni sinab ko'rsin; o'zgargan papkani Netlify'ga qayta tashlang", ru: '— пусть друг проверит корзину; изменённую папку снова перетащите в Netlify' } }];""" + s[j:]
R("""O'z ilovangizni quring va chiqaring:", ru: 'Постройте и выпустите своё приложение:'""", """VS Code'da, mini-dokon papkasida:", ru: 'В VS Code, в папке mini-dokon:'""")
R("""Demak: siz istalgan g'oyani real, ishlaydigan loyihaga aylantira olasiz. 🚀", ru: 'Вывод: Вы можете превратить любую идею в реальный работающий проект. 🚀'""",
  """Esda tuting: har o'zgarishdan keyin tekshiring — keyin chiqaring.", ru: 'Помните: после каждого изменения проверяйте — потом выпускайте.'""")
# 5) podium yorliqlari, kalitlar, nishonlar
i = s.index('const Q_LABELS = {'); j = s.index('\n', i)
s = s[:i] + "const Q_LABELS = { 5: { uz: '1 — Loyiha 5 qadami', ru: '1 — 5 шагов проекта' } }; // F-1015-343: yagona ballik — s15" + s[j:]
R("const INLINE_KEYS = { s4: 0, s8: 2, s10: 3, s15: 0 };", "const INLINE_KEYS = { s15: 0 }; // F-1015-343: s4, s8, s10 olindi")
R("""  fixer:    { icon: '🐞', name: 'Nice Fix!',    desc: { uz: "AI'ning xatosini aniq tushuntirib tuzatdingiz", ru: 'Вы точно объяснили и починили ошибку ИИ' } },""",
  """  fixer:    { icon: '🐞', name: 'Nice Fix!',    desc: { uz: 'Xatoni topib, tuzatdingiz', ru: 'Вы нашли и исправили ошибку' } },""")
R("""  shipper:  { icon: '🚀', name: 'Shipped It!',  desc: { uz: "MVP'ni dunyoga chiqardingiz", ru: 'Вы выпустили MVP в мир' } },""",
  """  shipper:  { icon: '🚀', name: 'Shipped It!',  desc: { uz: "Do'koningizni internetga chiqardingiz", ru: 'Вы выпустили свой магазин в интернет' } },""")
R("""// Ekran id → nishon (recordAnswer'da faqat SCORED test ekranda, data.correct bo'lsa beriladi)
const ACH_TRIGGERS = { s4: 'builder', s8: 'fixer', s10: 'shipper' };""",
  """// F-1015-343: blok nishonlari «Davom etish»da (bonus; isbot yo'q — ustoz ko'rib turadi); planner — s15 ichida (birinchi urinish)
const BLOK_ACH = { a1: 'builder', a2: 'fixer', a3: 'shipper' };
const ACH_TRIGGERS = {};""")
i = s.index('const PRACTICE_AFTER = {'); j = s.index('};', i) + 3
s = s[:i] + s[j:]
# 6) arena: 10 va 12-savol (to'g'ri o'rin o'zgarmaydi)
R("""  { q: { uz: 'Har mahsulot ikki marta hisoblanib, jami ikki barobar chiqsa — bu...', ru: 'Каждый товар считается дважды и итог вдвое больше — это...' }, opts: [{ uz: "To'g'ri natija", ru: 'Правильный результат' }, { uz: 'Oddiy dizayn', ru: 'Обычный дизайн' }, { uz: 'Yangi funksiya', ru: 'Новая функция' }, { uz: 'Bug (xato)', ru: 'Баг (ошибка)' }], correct: 3 },""",
  """  { q: { uz: 'Narx "3000" (qo\\'shtirnoqda) bo\\'lsa, 0 + "3000" nima beradi?', ru: 'Если цена "3000" (в кавычках), что даст 0 + "3000"?' }, opts: [{ uz: '3000 — son', ru: '3000 — число' }, { uz: 'Sayt to\\'xtab qoladi', ru: 'Сайт зависнет' }, { uz: '0 — nol', ru: '0 — ноль' }, { uz: '"03000" — matn', ru: '"03000" — текст' }], correct: 3 },""")
R("""  { q: { uz: "Savat sanagichi '+' bosilganda nima bo'ladi?", ru: 'Что происходит при нажатии «+» у счётчика корзины?' }, opts: [{ uz: 'Umuman hech narsa', ru: 'Вообще ничего' }, { uz: "Hodisa → reaksiya → o'zgarish", ru: 'Событие → реакция → изменение' }, { uz: "Butun sayt o'chadi", ru: 'Весь сайт выключается' }, { uz: "Fon rangi o'zgaradi", ru: 'Меняется цвет фона' }], correct: 1 },""",
  """  { q: { uz: "«Savatga» bosilganda savat massivi bilan nima bo'ladi?", ru: 'Что происходит с массивом корзины при нажатии «В корзину»?' }, opts: [{ uz: "Butunlay o'chirib tashlanadi", ru: 'Полностью удаляется' }, { uz: "push bilan mahsulot qo'shiladi", ru: 'Через push добавляется товар' }, { uz: "Alifbo bo'yicha saralanadi", ru: 'Сортируется по алфавиту' }, { uz: "Hech narsa o'zgarmay qoladi", ru: 'Ничего не меняется' }], correct: 1 },""")
# 7) asosiy komponent: amaliyot signali → blok nishoni (m2-11 dagidek)
R("  const [mentorPractice, setMentorPractice] = useState(null); // jonli mentor amaliyot paneli\n", "")
R("""  const advance = () => setScreen(s => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });
""", "")
R("""  // "Davom etish": shu ekrandan keyin amaliy bosqich bo'lsa — signal yuboriladi (simulyatsiya, kompilatorsiz).
  const next = () => {
    const entry = PRACTICE_AFTER[screen];
    if (!entry) { advance(); return; }
    if (live && live.mode === 'mentor') { setMentorPractice({ ...entry, fromScreen: screen }); advance(); return; }
    if (live && live.mode === 'student' && live.status !== 'ended') live.submitAnswer(PRACTICE_DONE_BASE + screen, `practice-${screen}`, 0, true, 0);
    advance();
  };""", """  const next = () => {
    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-343: blok «Davom etish»da nishon
    if (blokAch && live.mode !== 'mentor') earn(blokAch);
    setScreen(s => {
      let n = Math.min(s + 1, TOTAL_SCREENS - 1);
      if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
      return n;
    });
  };""")
R("setScreen(0); setMentorPractice(null); startTimeRef.current", "setScreen(0); startTimeRef.current")
R("            {mentorPractice && <MentorPracticeOverlay entry={mentorPractice} live={live} onClose={() => setMentorPractice(null)} />}\n", "")
R("  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];",
  "  const screens = [Screen0, Screen1, ScreenSavat, ScreenXato, ScreenDeploy, Screen15, ScreenPodium, Screen16];")
# 7b) ishlatilmay qolgan eski qismlar (soxta agent paneli, eski do'kon maketlari)
i = s.index('// ===== BROWSER (jonli sayt preview) ====='); j = s.index('function useScrollIntoViewOnMobile(trigger)')
s = s[:i] + s[j:]
i = s.index("// Ishlaydigan mini-do'kon: savatga qo'shish"); j = s.index('// Animatsiyani katta ekranda')
s = s[:i] + s[j:]
i = s.index('// ===== ✍️ JONLI PRAKTIKA PANELI (mentor)'); j = s.index('// 🧩 Qayta ishlatiladigan DRAG-DROP')
s = s[:i] + s[j:]
# F-1015-352 (foydalanuvchi, 17.10): drag-drop chipi — to'q sariq gradient + oq matn + ⠿ (F-1002-59 qarori; oq+chegara varianti bekor)
R("""        .dd-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: ${T.accent}; background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 11px; padding: 9px 13px; cursor: grab; touch-action: none; box-shadow: 0 6px 14px -8px rgba(${T.shadowBase},.35); transition: transform .12s; user-select: none; }
        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .55; font-weight: 400; } /* F-0926-06 (159/15): oq fon + 2px accent chegara + ushlagich — baland to'q-sariq gradient olindi */""",
  """        .dd-chip { font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 800; font-size: clamp(13px,1.7vw,15px); color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 11px; padding: 11px 15px; cursor: grab; touch-action: none; box-shadow: 0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3); transition: transform .12s; user-select: none; }
        .dd-chip::before { content: '⠿'; margin-right: 7px; opacity: .75; font-weight: 400; } /* F-1015-352 (F-1002-59): to'ldirilgan gradient chip, ⠿ ushlagich sudralishni aytadi */""")
# 8) CSS: m2-11 dagi praktika qolipi (am-*, rj-*, dk-*, ql-*) + yangi
t3 = open(P3, encoding='utf-8').read()
a = t3.index("        /* ===== F-1015-303/309 · praktika qolipi")
b = t3.index("\n", t3.index("        @media (prefers-reduced-motion: reduce) { .ql-silk, .ql-xabar")) + 1
qolip = t3[a:b]
yangi = open(Q + 'f343.css', encoding='utf-8').read()
R("      `}</style>", qolip + yangi + "      `}</style>")
open(P, 'w', encoding='utf-8').write(s)
print('ok', len(s.splitlines()))
