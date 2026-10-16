#!/usr/bin/env python3
# F-1015-320 · HtmlPractice (m1-08) 13 → 9 ekran, pilot m1-10 naqshi. Bir martalik; har almashtirish count==1 bilan.
# Chaqirish: python3 -I f320.py <repo>/src/1-Modull/HtmlPractice.jsx
import sys
P = sys.argv[1]
s = open(P, encoding='utf-8').read()

def rep(old, new):
    global s
    n = s.count(old)
    assert n == 1, f'{n}× : {old[:80]!r}'
    s = s.replace(old, new)

def cut(start, end, new):
    """start (kiradi) dan end (kirmaydi) gacha almashtiradi"""
    global s
    assert s.count(start) == 1, f'start {s.count(start)}× : {start[:80]!r}'
    assert s.count(end) == 1, f'end {s.count(end)}× : {end[:80]!r}'
    a = s.index(start); b = s.index(end)
    assert a < b, (start[:40], end[:40])
    s = s[:a] + new + s[b:]

# ---------- 1. Sarlavha izohi ----------
cut('// HTML PRAKTIKA — PORTFOLIO SAYT (m1-08', '// ============================================================\n\n// D3:',
"""// HTML PRAKTIKA — PORTFOLIO SAYT (m1-08, LMS 2-Modul 10-dars) · praktika qolipi F-1015 (pilot m1-10 naqshi)
// F-1015-320 (16.10, foydalanuvchi bilan sahifama-sahifa kelishildi): 13 → 9 ekran —
// kirish → reja → A1 (forma → prompt) → A2 (forma → prompt) → A3 (dizayn) → topshirish (yagona ballik) → A4 yaxshilash → podium → yakun.
// Ish o'quvchi kompyuterida: VS Code + gemini.google.com + Live Server; ustoz birga — isbot, «Bajardim», namuna kodi yo'q.
// Saqlangan: lessonId · arena QUIZ_BANK (12 savol, aynan) · s5 kaliti (3) · HOMEWORK eksporti · F-1012 (maxReached, mentorLock).
// Oldingi 13 ekranli: arxiv/F-1015-amaliyot-oldin/HtmlPractice.jsx · eski 20 ekranli: arxiv/F-1013-amaliyot-oldin/HtmlPractice.jsx
""")

rep("// 13 ekran · loyiha kuni qolipi (172): 8 ekran + 4 amaliyot bloki + kartochkalar (F-1005-88: alohida ekran; A4 dizayn — F-1014-06)",
    "// 9 ekran · praktika qolipi (F-1015-320): 3 amaliyot bloki + yagona ballik savol + yaxshilash (kartochkalar o'rniga)")

# ---------- 2. SCREEN_META ----------
cut("  { id: 's0',  type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },\n  { id: 's1',  type: 'rule',",
    "const TOTAL_SCREENS = SCREEN_META.length;",
"""  { id: 's0',  type: 'hook',     template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',     template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a3',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 's5',  type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 'a4',  type: 'practice', template: 'custom',   scored: false, scope: null }, // F-1015-320: kartochkalar o'rniga — sahifani tekshirish va yaxshilash
  { id: 'podium', type: 'stats', template: 'custom',   scored: false, scope: null },
  { id: 's6',  type: 'summary',  template: 'custom',   scored: false, scope: null }
];
""")

# ---------- 3. INLINE_KEYS + RECAPS ----------
cut("const INLINE_KEYS = { s3: 2, s5: 3 };", "function RecapOverlay(",
"""const INLINE_KEYS = { s5: 3 };
// 📖 RECAPS — ballik test uchun 3 karta (kalit = ekran INDEKSI: 5 — topshirish)
const RECAPS = {
  5: {
    title: { uz: "Bo'limga havola", ru: 'Ссылка на раздел' },
    cards: [
      { ic: '<a href="#aloqa">', h: { uz: 'Menyudagi havola', ru: 'Ссылка в меню' }, body: { uz: <>Qaysi bo'limga tushishini <b className="mono">#</b> dan keyingi nom aytadi.</>, ru: <>К какому разделу перейти, говорит имя после <b className="mono">#</b>.</> } },
      { ic: '<section id="aloqa">', h: { uz: "Bo'limning nomi", ru: 'Имя раздела' }, body: { uz: <>Havoladagi nom bilan bir xil bo'lishi kerak.</>, ru: <>Должно совпадать с именем в ссылке.</> } },
      { ic: '<a href="mailto:…">', h: { uz: 'Pochta havolasi', ru: 'Ссылка на почту' }, body: { uz: <>Xat yozish oynasini ochadi.</>, ru: <>Открывает окно письма.</> }, ask: { uz: "id ni yozish esdan chiqsa, havola bosilganda nima bo'ladi?", ru: 'Что будет при нажатии на ссылку, если забыть написать id?' } }
    ]
  }
};

""")

# ---------- 4. PfSite: ishlatilmay qolgan teglar rejimi ----------
rep("// teglar: har bo'lak ustida o'z tegi (F-1014-09: test «qaysi teg o'rab turadi?» — javob saytda ko'rinadi)\nconst PF_TEG = { header: '<header>', men: '<section>', loyiha: '<section>', aloqa: '<section>', footer: '<footer>' };\n", "")
rep(", halqa = null, xom = false, teglar = false }) => {", ", halqa = null, xom = false }) => {")
rep("      {teglar && <span className=\"pf-teg\" aria-hidden=\"true\">{PF_TEG[id]}</span>}\n", "")

# ---------- 5. Reja ekrani ----------
cut("// ===== SCREEN 1 — REJA (QReja):", "// ===== Taxmin savoli",
"""// ===== SCREEN 1 — REJA (QReja tuzilmasi): chapda dars oxiridagi sahifa (bir marta o'zi yuradi) · o'ngda «Avval tayyorlaning» + 3 blok (F-1015-320, pilot m1-10) =====
const REJA = [
  { t: { uz: "Header va «Men haqimda»", ru: 'Header и «Обо мне»' }, teg: 'header' },
  { t: { uz: 'Menyu, loyihalar va aloqa', ru: 'Меню, проекты и контакты' }, teg: 'nav' },
  { t: { uz: 'Dizayn', ru: 'Дизайн' }, teg: 'style.css' }
];
const TAYYOR = [
  { uz: <>Ish stolida <span className="qcode">portfolio</span> papkasini yarating va VS Code'da oching.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">portfolio</span> и откройте её в VS Code.</> },
  { uz: <>Ichida <span className="qcode">index.html</span> va <span className="qcode">style.css</span> yarating; <span className="qcode">index.html</span> da <span className="qcode">!</span> + Tab, Go Live.</>, ru: <>Создайте внутри <span className="qcode">index.html</span> и <span className="qcode">style.css</span>; в <span className="qcode">index.html</span> — <span className="qcode">!</span> + Tab, Go Live.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' }
];
const Screen1 = ({ screen, onNext, onPrev }) => {
  const [demo, setDemo] = useState(null);
  useEffect(() => { // DE-200: maket bir marta o'zi yuradi — menyudagi «Aloqa» → bo'limga tushadi → yuqoriga qaytadi
    const a = setTimeout(() => setDemo('aloqa'), 1400);
    const b = setTimeout(() => setDemo(null), 3800);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  return (
    <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={tr({ uz: 'Boshlaymiz', ru: 'Начинаем' })} onClick={onNext} /></>}>
      <div className="screen q-ekran q-reja am-reja">
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Dars oxirida portfolio sahifangiz <span className="italic" style={{ color: T.accent }}>tayyor bo'ladi</span>.</>, ru: <>К концу урока ваша страница-портфолио <span className="italic" style={{ color: T.accent }}>будет готова</span>.</> })}</h2></div>
        <Mentor>{tr({ uz: "Ish o'z kompyuteringizda: kodni Gemini yozadi, siz faylga qo'yasiz va Live Server'da tekshirasiz.", ru: 'Работа на вашем компьютере: код пишет Gemini, вы вставляете его в файл и проверяете в Live Server.' })}</Mentor>
        <div className="q-split">
          <div className="q-col">
            <span className="q-yorliq">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</span>
            <Zoomable><PfSite tushish={demo} yorit={demo} baland={230} /></Zoomable>
          </div>
          <div className="q-col">
            <div className="am-tayyor fade-up delay-1">
              <p className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}</p>
              <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
              <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
            </div>
            <span className="q-yorliq">{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</span>
            <ol className="q-reja-ro">{REJA.map((q, i) => (
              <li key={i} className="q-reja-k fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s` }}>
                <span className="q-reja-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="q-reja-b"><span className="q-reja-t">{tr(q.t)}</span><span className="q-reja-teg">{q.teg}</span></span>
              </li>
            ))}</ol>
          </div>
        </div>
      </div>
    </Stage>
  );
};

""")

# ---------- 6. Tushuncha ekranlari va 1-savol olinadi; topshirish savoli ----------
cut("// ===== Taxmin savoli", "// ===== 🏅 BADGES",
"""// ===== s5 — TOPSHIRISH (QTest, yagona ballik; INLINE_KEYS.s5 = 3 — eski kalit saqlandi). Avval sahifa ustozga ko'rsatiladi (pilot m1-10) =====
const Screen5 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Topshirish', ru: 'Сдача' })}
    questionText="Menyudagi «Aloqa» bosildi, sahifa qimirlamadi. Nima yetishmaydi?"
    question={<>{tr({ uz: <h2 className="title h-ask">Menyudagi «Aloqa» bosildi, sahifa qimirlamadi. <span className="italic" style={{ color: T.accent }}>Nima yetishmaydi?</span></h2>, ru: <h2 className="title h-ask">Нажали «Контакты» в меню, страница не сдвинулась. <span className="italic" style={{ color: T.accent }}>Чего не хватает?</span></h2> })}<div style={{ marginTop: 'clamp(10px,1.6vw,14px)' }}><Mentor>{tr({ uz: "Avval sahifangizni ustozga ko'rsating. Keyin savolga javob bering.", ru: 'Сначала покажите страницу учителю. Потом ответьте на вопрос.' })}</Mentor></div></>}
    options={[
      { uz: 'Menyu atrofida `<nav>` tegi yo\\'q', ru: 'Вокруг меню нет тега `<nav>`' },
      { uz: '«Aloqa» sarlavhasi `<h3>` bilan yozilgan', ru: 'Заголовок «Контакты» написан через `<h3>`' },
      { uz: 'Sahifa oxirida `<footer>` tegi yo\\'q', ru: 'В конце страницы нет тега `<footer>`' },
      { uz: 'Bo\\'limda `id="aloqa"` yozilmagan', ru: 'У раздела не написан `id="aloqa"`' }
    ]} correctIdx={3}
    explainCorrect={{ uz: '`#aloqa` sahifadan `id="aloqa"` ni qidiradi — topmasa, joyida qoladi.', ru: '`#aloqa` ищет на странице `id="aloqa"` — не найдя, остаётся на месте.' }}
    explainWrong={{
      0: { uz: "Havola `<nav>` ichida bo'lmasa ham ishlaydi.", ru: 'Ссылка работает и без `<nav>`.' },
      1: { uz: "Sarlavha o'lchami havolaga ta'sir qilmaydi.", ru: 'Размер заголовка не влияет на ссылку.' },
      2: { uz: 'Footer yo\\'qligi menyuga tegmaydi.', ru: 'Отсутствие footer не влияет на меню.' },
      default: { uz: '`#aloqa` sahifadan nimani qidirishini eslang.', ru: 'Вспомните, что ищет на странице `#aloqa`.' }
    }} />
);

""")

# ---------- 7. Nishonlar ----------
cut("const ACHIEVEMENTS = {\n  built:", "function AchCelebrate(",
"""const ACHIEVEMENTS = {
  built:    { icon: '🧲', name: 'Built It!', desc: { uz: "Sahifa boshini va birinchi bo'limni qurdingiz", ru: 'Вы собрали начало страницы и первый раздел' } },
  coder:    { icon: '🏷️', name: 'Tag It!',   desc: { uz: "Menyu havolalarini bo'limlarga uladingiz", ru: 'Вы связали ссылки меню с разделами' } },
  graduate: { icon: '🏆', name: 'Level Up!', desc: { uz: 'Portfolio sahifangizni oxirigacha qurdingiz', ru: 'Вы собрали страницу-портфолио до конца' } },
};
// F-1015-320 (pilot F-1015-303 naqshi): nishon BLOKKA bog'lanadi — blok «Davom etish»da beriladi (bonus; isbot yo'q — ustoz ko'rib turadi).
const BLOK_ACH = { a1: 'built', a2: 'coder', a3: 'graduate' };
// Testga bog'langan nishon yo'q (yagona ballik — s5).
const ACH_TRIGGERS = {};

""")

rep("""// Podium savol yorliqlari (SCORED_IDX indekslariga mos: 4, 8, 11, 14, 15)
const Q_LABELS = {
  4: { uz: "1 — Bo'lim tegi", ru: '1 — Тег раздела' },
  7: { uz: "2 — Bo'limga havola", ru: '2 — Ссылка на раздел' }
};""", """// Podium savol yorlig'i (SCORED_IDX: 5)
const Q_LABELS = {
  5: { uz: "Bo'limga havola", ru: 'Ссылка на раздел' }
};""")

# ---------- 8. Amaliyot bloklari (QBlok + «Bajardim» + namuna + mentor-signal) olinadi ----------
cut("// ===== AMALIYOT BLOKI (172/173)", "// 🏠 LMS uchun statik uy-vazifa deklaratsiyasi", "")

cut("// «Ortda qoldingizmi» — namuna kodini nusxalash", "// ===== YAKUN — qolipdan: QYakun",
r"""// ===== a1 · a2 · a3 — AMALIYOT BLOKLARI (F-1015-320, pilot m1-10 naqshi: forma → «Saqlash» → prompt; o'ngda «Qadamlar») =====
// O'quvchi yozgani faqat o'z brauzerida (localStorage) — promptga qo'yiladi, LMS'ga yuborilmaydi.
const PF_KEY = 'ccPortfolio';
const pfRead = () => { try { const v = JSON.parse(localStorage.getItem(PF_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const pfWrite = (patch) => { try { localStorage.setItem(PF_KEY, JSON.stringify({ ...pfRead(), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
const AM_MAYDON = {
  a1: [
    { k: 'ism', l: { uz: 'Ismingiz', ru: 'Ваше имя' }, ph: { uz: 'masalan: Aziza Karimova', ru: 'например: Азиза Каримова' } },
    { k: 'yonalish', l: { uz: "Yo'nalishingiz", ru: 'Ваше направление' }, ph: { uz: 'masalan: Frontend dasturchi', ru: 'например: Frontend-разработчик' } },
    { k: 'haqida', l: { uz: "O'zingiz haqingizda 2 gap", ru: '2 предложения о себе' }, ph: { uz: "masalan: HTML o'rganyapman. Rasm chizishni yaxshi ko'raman.", ru: 'например: Изучаю HTML. Люблю рисовать.' } }
  ],
  a2: [
    { k: 'l1', l: { uz: '1-loyiha', ru: 'Проект 1' }, ph: { uz: 'masalan: Birinchi HTML sahifam', ru: 'например: Моя первая HTML-страница' } },
    { k: 'l2', l: { uz: '2-loyiha', ru: 'Проект 2' }, ph: { uz: "masalan: Ro'yxatdan o'tish formasi", ru: 'например: Форма регистрации' } },
    { k: 'l3', l: { uz: '3-loyiha', ru: 'Проект 3' }, ph: { uz: 'masalan: CSS bilan bezalgan kartochka', ru: 'например: Карточка, оформленная CSS' } },
    { k: 'pochta', l: { uz: 'Pochtangiz', ru: 'Ваша почта' }, ph: { uz: 'masalan: aziza@mail.uz', ru: 'например: aziza@mail.uz' } }
  ],
  a3: [
    { k: 'rang', min: 2, l: { uz: 'Asosiy rangingiz', ru: 'Ваш основной цвет' }, ph: { uz: "masalan: ko'k", ru: 'например: синий' } }
  ]
};
const AMALIYOT = {
  a1: {
    eyebrow: { uz: "Amaliyot 1 · header, bo'lim", ru: 'Практика 1 · header, раздел' },
    title: { uz: "O'zingiz haqingizda yozing — Gemini HTML'ni quradi.", ru: 'Расскажите о себе — Gemini соберёт HTML.' },
    karta: { uz: 'Siz haqingizda', ru: 'О вас' }, forma: true,
    toldir: { uz: "Uchala qatorni to'ldiring", ru: 'Заполните три строки' },
    qadamlar: [
      { uz: "Ma'lumotlaringizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.", ru: 'Впишите свои данные и нажмите «Сохранить» — промпт будет готов.' },
      { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
      { uz: "Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` (вместо старого), `Ctrl+S`.' },
      { uz: "Live Server'da qarang: ismingiz, yo'nalishingiz va «Men haqimda» bormi? Yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».", ru: 'Посмотрите в Live Server: есть имя, направление и «Обо мне»? Если нет, напишите Gemini точно: «… нет, добавь».' }
    ],
    prompt: (p) => ({ uz: `Portfolio sahifam uchun index.html'ni yozib ber.\n<header> ichida: ismim — ${p.ism} (<h1>), yo'nalishim — ${p.yonalish} (<p>).\nKeyin <section id="men">: sarlavha «Men haqimda» (<h2>) va shu matn: ${p.haqida}\nstyle.css <link> bilan ulangan bo'lsin. Hozircha CSS yozma, faqat HTML. To'liq faylni qaytar.`, ru: `Напиши index.html для моей страницы-портфолио.\nВнутри <header>: моё имя — ${p.ism} (<h1>), направление — ${p.yonalish} (<p>).\nЗатем <section id="men">: заголовок «Обо мне» (<h2>) и этот текст: ${p.haqida}\nПодключи style.css через <link>. Пока не пиши CSS, только HTML. Верни файл целиком.` }),
    yigilgan: (f) => <><p className="am-loyiha-nom">{f.ism}</p><p className="am-satr">{f.yonalish}</p><p className="am-satr"><b>{tr({ uz: 'Men haqimda:', ru: 'Обо мне:' })}</b> {f.haqida}</p></>,
    natija: () => <PfSite xom qismlar={['header', 'men']} menyu={0} baland={220} />
  },
  a2: {
    eyebrow: { uz: 'Amaliyot 2 · menyu, havola', ru: 'Практика 2 · меню, ссылка' },
    title: { uz: "Menyu, loyihalar va aloqa bo'limini qo'shing.", ru: 'Добавьте меню, проекты и раздел контактов.' },
    karta: { uz: 'Loyihalar va aloqa', ru: 'Проекты и контакты' }, forma: true,
    toldir: { uz: "To'rtala qatorni to'ldiring", ru: 'Заполните четыре строки' },
    yordam: { uz: 'Haqiqiy telefon raqamingiz va uy manzilingizni yozmang.', ru: 'Не пишите настоящий номер телефона и домашний адрес.' },
    qadamlar: [
      { uz: "Loyihalaringiz va pochtangizni yozing, «Saqlash»ni bosing — prompt tayyor bo'ladi.", ru: 'Впишите свои проекты и почту, нажмите «Сохранить» — промпт будет готов.' },
      { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код вашего `index.html`.' },
      { uz: "Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` (вместо старого), `Ctrl+S`.' },
      { uz: "Menyudagi har havolani bosing: o'z bo'limiga tushadimi? Tushmasa, Gemini'ga yozing: «Aloqa bosilsa, sahifa qimirlamayapti. href va id ni tekshirib tuzat.»", ru: 'Нажмите каждую ссылку меню: переходит к своему разделу? Если нет, напишите Gemini: «При нажатии на Контакты страница не двигается. Проверь href и id и исправь.»' }
    ],
    prompt: (p) => ({ uz: `Sahifamga menyu va qolgan bo'limlarni qo'sh.\n<header> ichida, yo'nalishimdan keyin <nav>: «Men haqimda» (#men), «Loyihalarim» (#loyihalar), «Aloqa» (#aloqa).\n«Men haqimda»dan keyin <section id="loyihalar">: sarlavha «Loyihalarim» (<h2>) va 3 bandli ro'yxat (<ul>): ${p.l1}; ${p.l2}; ${p.l3}.\nKeyin <section id="aloqa">: sarlavha «Aloqa» (<h2>) va pochta havolasi: ${p.pochta} (mailto:).\nEng oxirida <footer>: ${p.ism}, 2026.\nBor matnlarimni o'zgartirma. To'liq index.html'ni qaytar.\nMana hozirgi kodim: {index.html kodini shu yerga qo'ying}`, ru: `Добавь на мою страницу меню и остальные разделы.\nВнутри <header>, после направления, <nav>: «Обо мне» (#men), «Мои проекты» (#loyihalar), «Контакты» (#aloqa).\nПосле «Обо мне» — <section id="loyihalar">: заголовок «Мои проекты» (<h2>) и список из 3 пунктов (<ul>): ${p.l1}; ${p.l2}; ${p.l3}.\nЗатем <section id="aloqa">: заголовок «Контакты» (<h2>) и ссылка на почту: ${p.pochta} (mailto:).\nВ самом конце <footer>: ${p.ism}, 2026.\nМои тексты не меняй. Верни index.html целиком.\nВот мой текущий код: {вставьте сюда код index.html}` }),
    yigilgan: (f) => <><ul className="am-band">{['l1', 'l2', 'l3'].map(k => <li key={k}>{f[k]}</li>)}</ul><p className="am-satr"><b>{tr({ uz: 'Pochta:', ru: 'Почта:' })}</b> {f.pochta}</p></>,
    natija: () => <PfSite xom baland={260} />
  },
  a3: {
    eyebrow: { uz: 'Amaliyot 3 · dizayn', ru: 'Практика 3 · дизайн' },
    title: { uz: 'Sahifangizga dizayn bering.', ru: 'Задайте странице дизайн.' },
    karta: { uz: 'Rang', ru: 'Цвет' },
    yordam: { uz: "Rangni so'z bilan yozing: «ko'k», «yashil». Kodini Gemini o'zi tanlaydi.", ru: 'Напишите цвет словом: «синий», «зелёный». Код цвета Gemini подберёт сам.' },
    qadamlar: [
      { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код вашего `index.html`.' },
      { uz: "Javobdagi kodni `style.css` ga qo'ying, `Ctrl+S`.", ru: 'Вставьте код из ответа в `style.css`, `Ctrl+S`.' },
      { uz: "Live Server'da qarang: rang, kartochkalar, menyu — siz yozgandekmi? Mos kelmasa, Gemini'ga aniq yozing.", ru: 'Посмотрите в Live Server: цвет, карточки, меню — как вы написали? Если нет — точно напишите Gemini.' }
    ],
    prompt: (p) => ({ uz: `Sahifamga dizayn ber — faqat style.css'ni yoz, HTML'ni o'zgartirma.\nAsosiy rang — ${p.rang}: sarlavhalar va havolalar shu rangda.\nFon och kulrang, sahifa markazda, eni 800px dan oshmasin.\nHeader qorong'i, ism oq; har bo'lim oq kartochka, burchaklari yumaloq; menyu bir qatorda.\nMana kodim: {index.html kodini shu yerga qo'ying}`, ru: `Задай дизайн моей странице — напиши только style.css, HTML не меняй.\nОсновной цвет — ${p.rang}: заголовки и ссылки этого цвета.\nФон светло-серый, страница по центру, ширина не больше 800px.\nHeader тёмный, имя белое; каждый раздел — белая карточка со скруглёнными углами; меню в одну строку.\nВот мой код: {вставьте сюда код index.html}` }),
    natija: () => <PfSite baland={260} />,
    osti: { uz: "HTML — sahifaning tuzilmasi, CSS — ko'rinishi.", ru: 'HTML — структура страницы, CSS — её вид.' }
  }
};
const PromptBlok = ({ matn, tayyor }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta fade-up delay-2">
      {tayyor && <p className="am-tayyor-ok">{tr(tayyor)}</p>}
      <div className="am-prompt-h"><span className="q-yorliq">{tr({ uz: 'Prompt', ru: 'Промпт' })}</span><button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button></div>
      <pre className="am-masalan">{matn}</pre>
    </div>
  );
};
const Qadamlar = ({ b, cls = '' }) => (
  <div className={`am-karta ${cls}`}>
    <span className="q-yorliq">{tr({ uz: 'Qadamlar', ru: 'Шаги' })}</span>
    <ol className="am-qadam">{b.qadamlar.map((x, i) => <li key={i}><span className="am-qn">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>
  </div>
);
const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {
  const id = SCREEN_META[screen].id;
  const b = AMALIYOT[id];
  const maydon = AM_MAYDON[id];
  const [f, setF] = useState(() => { const d = pfRead(); return Object.fromEntries(maydon.map(m => [m.k, d[m.k] || ''])); });
  const [saqlangan, setSaqlangan] = useState(() => !!pfRead()[`${id}Saqlangan`]);
  const [yigil, setYigil] = useState(() => !!(b.forma && pfRead()[`${id}Saqlangan`])); // saqlangach forma yig'iladi, «Tahrirlash» bilan ochiladi
  const toliq = maydon.every(m => f[m.k].trim().length >= (m.min || 3));
  const yoz = (k, v) => { setF(n => ({ ...n, [k]: v })); pfWrite({ [k]: v }); };
  const saqla = () => { if (!toliq) return; pfWrite({ [`${id}Saqlangan`]: true }); setSaqlangan(true); setYigil(true); };
  // bosqichma-bosqich: forma — saqlangach (tahrirlashda ham prompt jonli yangilanadi); a3 — rang yozilgach
  const ochiq = toliq && (b.forma ? saqlangan : true);
  const tf = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()]));
  const ism = (pfRead().ism || '').trim() || tr({ uz: '{ismingiz}', ru: '{ваше имя}' });
  const matn = ochiq ? tr(b.prompt({ ...tf, ism })) : null;
  return (
    <Stage eyebrow={tr(b.eyebrow)} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen q-ekran" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr(b.title)}</h2></div>
        <div className="q-split">
          <div className="q-col">
            {!yigil && <div className="am-karta fade-up delay-1">
              <span className="q-yorliq">{tr(b.karta)}</span>
              {maydon.map((m, i) => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="am-input" value={f[m.k]} placeholder={tr(m.ph)} autoFocus={i === 0 && !f[m.k]} onChange={e => yoz(m.k, e.target.value)} /></label>)}
              {b.yordam && <p className="am-izoh">{tr(b.yordam)}</p>}
              {b.forma && <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : b.toldir)}</button>}
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><span className="q-yorliq">{tr(b.karta)}</span><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              {b.yigilgan(tf)}
            </div>}
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={b.forma ? { uz: 'Prompt tayyor — endi Gemini orqali quring.', ru: 'Промпт готов — теперь стройте с помощью Gemini.' } : null} /></div>}
            {!b.forma && matn && <Qadamlar b={b} cls="am-ochil" />}
          </div>
          <div className="q-col">
            {b.forma && <Qadamlar b={b} cls="fade-up delay-2" />}
            <span className="q-yorliq">{tr({ uz: 'Kutilgan natija · namuna', ru: 'Ожидаемый результат · образец' })}</span>
            <Zoomable>{b.natija()}</Zoomable>
            {b.osti && <p className="am-osti">{fmtCode(tr(b.osti))}</p>}
          </div>
        </div>
      </div>
    </Stage>
  );
};

// ===== a4 — YAXSHILASH (F-1015-320, pilot m1-10: kartochkalar o'rniga): ro'yxat bo'yicha tekshirish → bitta kamchilik → prompt; dars oxirigacha takror =====
const TEKSHIR = [
  { uz: "Menyudagi uchala havola o'z bo'limiga tushadimi?", ru: 'Все три ссылки меню ведут к своим разделам?' },
  { uz: '«Pochta» bosilsa, xat oynasi ochiladimi?', ru: 'При нажатии «Почта» открывается окно письма?' },
  { uz: 'Hamma matn siz haqingizdami?', ru: 'Весь текст — про вас?' },
  { uz: "Oynani toraytiring: telefonda hammasi sig'adimi?", ru: 'Сузьте окно: на телефоне всё помещается?' },
  { uz: 'Eng pastda footer bormi?', ru: 'Внизу есть footer?' }
];
const YAX_QADAM = {
  qadamlar: [
    { uz: "Ro'yxat bo'yicha sahifangizga qarang va bitta kamchilikni tanlang.", ru: 'Проверьте страницу по списку и выберите один недочёт.' },
    { uz: "Uni yozing — prompt yig'iladi.", ru: 'Опишите его — промпт соберётся.' },
    { uz: "«Promptni nusxalash» → Gemini'ga yuboring, javobdagi kodni faylga qo'ying, `Ctrl+S`.", ru: '«Скопировать промпт» → отправьте в Gemini, вставьте код из ответа в файл, `Ctrl+S`.' },
    { uz: '«Keyingi kamchilik» — va yana. Dars oxirigacha.', ru: '«Следующий недочёт» — и снова. До конца урока.' }
  ]
};
const YAX_MAYDON = [
  { k: 'yoqmadi', l: { uz: 'Nima yoqmadi?', ru: 'Что не нравится?' }, ph: { uz: 'masalan: menyu havolalari bir-biriga yopishib turibdi', ru: 'например: ссылки меню слиплись друг с другом' } },
  { k: 'qanday', l: { uz: "Qanday bo'lsin?", ru: 'Как должно быть?' }, ph: { uz: "masalan: havolalar orasida bo'sh joy bo'lsin", ru: 'например: пусть между ссылками будет отступ' } }
];
const ScreenYaxshilash = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState({ yoqmadi: '', qanday: '' });
  const [soni, setSoni] = useState(() => pfRead().yaxshi || 0);
  const tayyor = YAX_MAYDON.every(m => f[m.k].trim().length >= 3);
  const keyingi = () => { const n = soni + 1; setSoni(n); pfWrite({ yaxshi: n }); setF({ yoqmadi: '', qanday: '' }); };
  const matn = tayyor ? tr({ uz: `Sahifamni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma.\nYoqmagani: ${f.yoqmadi.trim()}.\nQanday bo'lsin: ${f.qanday.trim()}.\nO'zgargan faylni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Улучши мою страницу — меняй только это место, остальное не трогай.\nНе нравится: ${f.yoqmadi.trim()}.\nКак должно быть: ${f.qanday.trim()}.\nВерни изменённый файл целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 4 · yaxshilash', ru: 'Практика 4 · улучшение' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen q-ekran" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Sahifangizni tekshiring va yaxshilang.', ru: 'Проверьте и улучшите страницу.' })}</h2></div>
        <div className="q-split">
          <div className="q-col">
            <div className="am-karta fade-up delay-1">
              <div className="am-prompt-h"><span className="q-yorliq">{tr({ uz: 'Bitta kamchilik', ru: 'Один недочёт' })}</span>{soni > 0 && <span className="am-soni">{tr({ uz: `Yaxshilandi: ${soni}`, ru: `Улучшено: ${soni}` })}</span>}</div>
              {YAX_MAYDON.map((m, i) => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="am-input" value={f[m.k]} placeholder={tr(m.ph)} autoFocus={i === 0} onChange={e => setF({ ...f, [m.k]: e.target.value })} /></label>)}
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: "Prompt tayyor — Gemini'ga yuboring.", ru: 'Промпт готов — отправьте в Gemini.' }} /></div>}
            {matn && <button type="button" className="am-saqla am-ochil" onClick={keyingi}>{tr({ uz: 'Keyingi kamchilik', ru: 'Следующий недочёт' })}</button>}
          </div>
          <div className="q-col">
            <div className="am-karta fade-up delay-1">
              <span className="q-yorliq">{tr({ uz: 'Sahifangizni tekshiring', ru: 'Проверьте страницу' })}</span>
              <ul className="am-band">{TEKSHIR.map((x, i) => <li key={i}>{tr(x)}</li>)}</ul>
            </div>
            <Qadamlar b={YAX_QADAM} cls="fade-up delay-2" />
          </div>
        </div>
      </div>
    </Stage>
  );
};

""")

# ---------- 9. Yakun ekrani ----------
rep("""          <p className="pf-asosiy fade-up d2">{tr({ uz: "Sahifa bo'laklardan yig'iladi — brauzer ularni kodda yozilgan tartibda chizadi.", ru: 'Страница собирается из частей — браузер рисует их в порядке кода.' })}</p>
""", "")
rep("""  const RECAP = [
    { uz: "Sahifani header, bo'limlar va footer'ga bo'lib yozasiz", ru: 'Пишете страницу частями: header, разделы и footer' },
    { uz: "Menyu havolasini `id` orqali bo'limga ulaysiz", ru: 'Связываете ссылку меню с разделом через `id`' },
    { uz: '`mailto:` bilan pochta havolasini yasaysiz', ru: 'Делаете ссылку на почту через `mailto:`' }
  ];""", """  const RECAP = [
    { uz: "Gemini'ga sahifani qismlari bilan aniq so'raysiz: header, bo'limlar, footer", ru: 'Точно просите у Gemini страницу по частям: header, разделы, footer' },
    { uz: "Menyu havolasini `id` orqali bo'limga ulaysiz", ru: 'Связываете ссылку меню с разделом через `id`' },
    { uz: "Dizaynni faqat `style.css` da so'raysiz — HTML o'zgarmaydi", ru: 'Дизайн просите только в `style.css` — HTML не меняется' },
    { uz: "Sahifani ro'yxat bo'yicha tekshirib, aniq so'rov bilan yaxshilaysiz", ru: 'Проверяете страницу по списку и улучшаете её точным запросом' }
  ];""")
rep("""<>Keyingi dars — <b>CSS Praktika</b>: Gemini bergan dizaynni tushunib, o'zingiz o'zgartirasiz.</>, ru: <>Следующий урок — <b>CSS практика</b>: разберёте дизайн от Gemini и измените его сами.</>""",
    """<>Keyingi dars — <b>CSS Praktika</b>: Demo Day saytingizni boshlaysiz.</>, ru: <>Следующий урок — <b>CSS практика</b>: начнёте сайт для Demo Day.</>""")

# ---------- 10. Root ----------
rep("""  // 🃏 Flashcard ekrani jonli darsda (mentor boshqaruvida) o'quvchida ko'rsatilmaydi
  const FLASH_IDX = SCREEN_META.findIndex(m => m.id === 'sflash');
  const flashHidden = () => live.mode === 'student' && live.status !== 'ended' && live.mentorAlive;
  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });
  const prev = () => setScreen(s => { let n = Math.max(s - 1, 0); if (n === FLASH_IDX && flashHidden()) n = Math.max(n - 1, 0); return n; });""",
"""  // F-1015-320: kartochkalar ekrani yo'q; amaliyot bloki «Davom etish»da nishon beradi (pilot m1-10); praktika-signali yo'q
  const next = () => {
    const ach = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id];
    if (ach && live.mode !== 'mentor') earn(ach);
    setScreen(s => Math.min(s + 1, TOTAL_SCREENS - 1));
  };
  const prev = () => setScreen(s => Math.max(s - 1, 0));""")
rep("""    if (_m && _m.scored && _m.scope === 'final' && data && data.solved && live.mode === 'student') live.submitAnswer(""",
    """    if (_m && _m.scored && _m.scope === 'final' && _m.template !== 'MCScreen' && data && data.solved && live.mode === 'student') live.submitAnswer(""")
cut("  // ===== Amaliyot bloki yakuni — oxirgi «Bajardim» (ScreenBlok).", "  // F-0730-01: har o'zgarishda progress saqlanadi", "")
rep("  const screens = [Screen0, Screen1, Screen2, ScreenA1, Screen3, Screen4, ScreenA2, Screen5, ScreenA3, ScreenA4, ScreenPodium, ScreenFlashcards, SummaryScreen];",
    "  const screens = [Screen0, Screen1, ScreenAmaliyot, ScreenAmaliyot, ScreenAmaliyot, Screen5, ScreenYaxshilash, ScreenPodium, SummaryScreen];")
rep(" onFinish={finishLesson} live={live} onBlokDone={blokDone} />", " onFinish={finishLesson} live={live} />")

# ---------- 11. CSS: olingan ekranlar uslubi → amaliyot bloklari uslubi ----------
cut("        .pf-harakat { display: flex; flex-direction: column; gap: 12px; }", "        .hw-izoh {", "")
cut("        .pf-teg { position: absolute;", "        .btn-white-accent { font-family:",
r"""        @media (prefers-reduced-motion: reduce) { .pf-qism, .pf-navbat :is(.q-chip, .q-variant), .pf-halqa { animation: none !important; } .pf-body { scroll-behavior: auto; } }
        /* ===== F-1015-320 · praktika qolipi (pilot m1-10): amaliyot bloklari, «Avval tayyorlaning», yaxshilash ===== */
        .am-karta { background: ${T.paper}; border-radius: 14px; padding: clamp(12px,1.8vw,16px) clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 8px; box-shadow: 0 6px 16px -6px rgba(${T.shadowBase},0.14); }
        .lesson-root .am-band { margin: 0; padding-left: 20px; list-style: disc outside; display: flex; flex-direction: column; gap: 5px; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-masalan { margin: 0; background: ${CODE.bg}; color: ${CODE.text}; font-family: 'JetBrains Mono', monospace; font-size: clamp(11.5px,1.35vw,13px); line-height: 1.6; border-radius: 10px; padding: 12px 14px; white-space: pre-wrap; word-break: break-word; }
        .lesson-root .am-qadam { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .am-qadam li { display: flex; gap: 10px; align-items: flex-start; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-qn { flex: none; width: 22px; height: 22px; border-radius: 50%; background: ${T.accentSoft}; color: ${T.ink}; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; justify-content: center; }
        .am-osti, .am-izoh { margin: 0; font-size: clamp(12.5px,1.4vw,13.5px); color: ${T.ink2}; line-height: 1.5; }
        .am-satr { margin: 0; font-size: clamp(13px,1.55vw,15px); color: ${T.ink}; line-height: 1.5; }
        .am-nusxa { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 16px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-nusxa:hover { background: ${T.accentSoft}; }
        .am-prompt-h { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
        .am-tayyor { background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 16px; padding: clamp(14px,2vw,18px); display: flex; flex-direction: column; gap: 10px; box-shadow: 0 10px 24px -10px ${fon(T.accent, 0.35)}; }
        .am-tayyor-h { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: clamp(16px,2vw,19px); color: ${T.ink}; }
        .lesson-root .am-tayyor-l { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .am-tayyor-l li { display: flex; gap: 12px; align-items: flex-start; font-size: clamp(14px,1.6vw,15.5px); color: ${T.ink}; line-height: 1.5; }
        .am-tayyor-n { flex: none; width: 28px; height: 28px; border-radius: 50%; background: ${T.accent}; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
        .am-tayyor-s { margin: 0; font-size: 13px; color: ${T.ink2}; }
        @media (max-width: 860px) { .am-reja .q-split > .q-col:last-child { order: -1; } }
        .am-maydon { display: flex; flex-direction: column; gap: 5px; font-size: 13px; font-weight: 600; color: ${T.ink}; }
        .am-input { width: 100%; font: 500 14px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 10px 12px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .am-input::placeholder { color: ${T.ink2}; opacity: 0.85; }
        .am-input:hover { border-color: ${T.ink2}; }
        .am-input:focus { border-color: ${T.accent}; box-shadow: 0 0 0 4px ${T.accentSoft}; }
        .am-saqla { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 18px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }
        .am-saqla:hover:not(:disabled) { background: ${T.accentSoft}; }
        .am-saqla:disabled { border-color: ${T.line}; color: ${T.ink2}; cursor: default; }
        .am-loyiha-nom { margin: 0; font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 18px; color: ${T.ink}; }
        .am-soni { font: 700 12px 'Manrope', sans-serif; color: ${T.ok}; background: ${T.okFon}; border-radius: 999px; padding: 3px 10px; }
        .am-tayyor-ok { margin: 0; font-weight: 700; color: ${T.ok}; font-size: 14px; }
        .am-ochil { animation: am-ochil 0.45s cubic-bezier(.2,.7,.3,1) both; }
        @keyframes am-ochil { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .am-ochil { animation: none; } }
        /* Uyga vazifa tugmasidagi suzuvchi so'zlar — qolip CSS'ida yo'q (F-1015-319 dagi sinf) · telefonda nur halqasi yon tomonga chiqmaydi */
        .hw-sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .hw-tok { position: absolute; font-family: 'JetBrains Mono', monospace; font-feature-settings: "liga" 0, "calt" 0; font-weight: 700; color: rgba(255,255,255,0.16); animation: hw-float var(--d, 7s) ease-in-out infinite alternate; }
        @keyframes hw-float { from { transform: translateY(4px); } to { transform: translateY(-7px); } }
        @media (prefers-reduced-motion: reduce) { .hw-tok { animation: none; } }
        @media (max-width: 600px) { .hw-big-wrap::before { inset: -12px 0; } }
""")

open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()), 'qator')
