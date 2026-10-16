#!/usr/bin/env python3
# F-1015-328 · DeployLesson (m1-11) 17 → 12 ekran: boshida amaliyot (qolgan sahifalar · animatsiya), oxirida Netlify (tushuntirish · 2 test · yuklash · yakuniy).
# Bir martalik; har almashtirish count==1. Chaqirish: python3 -I f328.py <repo>
import sys
R = sys.argv[1]
P = R + '/src/1-Modull/DeployLesson.jsx'
s = open(P, encoding='utf-8').read()
css = open(R + '/src/1-Modull/CssPractice.jsx', encoding='utf-8').read()

def rep(old, new):
    global s
    n = s.count(old)
    assert n == 1, f'{n}× : {old[:90]!r}'
    s = s.replace(old, new)

def cut(start, end, new):
    global s
    assert s.count(start) == 1, f'start {s.count(start)}× : {start[:80]!r}'
    assert s.count(end) == 1, f'end {s.count(end)}× : {end[:80]!r}'
    a = s.index(start); b = s.index(end); assert a < b
    s = s[:a] + new + s[b:]

def blok(src, start, end):
    assert src.count(start) == 1 and src.count(end) == 1, (start[:50], end[:50])
    a = src.index(start); b = src.index(end); assert a < b
    return src[a:b]

# ---------- 1. Sarlavha izohi ----------
rep("""// M1-D13 — NETLIFY VA DEPLOY — deploy-amaliyoti (v19)
// Mavzu: o'quvchi Demo Day uchun o'z loyihasini tanlaydi, tayyor topshiriq bilan
//        AI'dan kod oladi, GitHub'ga qo'yadi, Netlify'ga GitHub bilan kirib
//        deploy qiladi va havolani oladi. Nazariya minimal, amaliyot asosiy.""",
"""// M1-D13 — NETLIFY VA DEPLOY — deploy-amaliyoti (v20, F-1015-328)
// Mavzu: CSS Praktikada boshlangan Demo Day saytini DAVOM ettiradi — qolgan sahifalar va animatsiya
//        (VS Code + gemini.google.com), keyin Netlify: tushuntirish → 2 savol → GitHub bilan kirib,
//        papkani sudrab tashlash → havola. 17 → 12 ekran (foydalanuvchi bilan sahifama-sahifa, 16.10).
// Oldingi 17 ekranli: arxiv/F-1015-deploy-oldin/DeployLesson.jsx""")

# ---------- 2. SCREEN_META ----------
cut("const SCREEN_META = [\n  // F-0914-07: 1-QISM", "const TOTAL_SCREENS = SCREEN_META.length;",
"""const SCREEN_META = [
  // F-1015-328: 1-QISM amaliyot (~40 daqiqa: qolgan sahifalar + animatsiya) → 2-QISM Netlify (~30 daqiqa: tushuntirish, savollar, yuklash)
  { id: 's0',     type: 'hook',        template: 'custom',   scored: false, scope: 'hook' },
  { id: 'sreja',  type: 'rule',        template: 'custom',   scored: false, scope: null },
  { id: 'apages', type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 'aanim',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's1',     type: 'exploration', template: 'custom',   scored: false, scope: null },
  { id: 's2',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 's6',     type: 'test',        template: 'MCScreen', scored: true,  scope: 'module-mikro' },
  { id: 'sdrop',  type: 'practice',    template: 'custom',   scored: false, scope: null },
  { id: 's12',    type: 'test',        template: 'MCScreen', scored: true,  scope: 'final' },
  { id: 's14b',   type: 'stats',       template: 'custom',   scored: false, scope: null },
  { id: 'sflash', type: 'flashcard',   template: 'custom',   scored: false, scope: null },
  { id: 's16',    type: 'summary',     template: 'custom',   scored: false, scope: null }
];
""")

# ---------- 3. RECAPS kalitlari (ekran indeksi): s2 9 → 5 · s6 6 o'zgarmaydi ----------
rep("  // idx 9 — s2: «Netlify nima qiladi?» (F-0914-07: amaliyotdan keyin)\n  9: {", "  // idx 5 — s2: «Netlify nima qiladi?» (F-1015-328: Netlify tushuntirishidan keyin)\n  5: {")
rep("Q_LABELS = { 6: { uz: 'Bosh sahifa fayli', ru: 'Файл главной страницы' }, 9: { uz: 'Netlify vazifasi', ru: 'Задача Netlify' }, 12: { uz: 'Havola (yakuniy)', ru: 'Ссылка (финал)' } };",
    "Q_LABELS = { 5: { uz: 'Netlify vazifasi', ru: 'Задача Netlify' }, 6: { uz: 'Bosh sahifa fayli', ru: 'Файл главной страницы' }, 8: { uz: 'Havola (yakuniy)', ru: 'Ссылка (финал)' } };")

# ---------- 4. DoScreen endi ishlatilmaydi (Screen5, Screen8 olindi) ----------
cut("// Bitta ekran — bitta ish (92-qonun): chapda kutilgan natija, o'ngda qadamlar.", "// ===== Netlify oynasi maketi", "")

# ---------- 5. Kirish javobi: «davom ettirasiz» ----------
rep("Bugun avval Demo Day saytingizni yasaysiz, keyin shunday havola olasiz.</>", "Bugun saytingizni davom ettirasiz va shunday havola olasiz.</>")
rep("Сегодня сначала сделаете сайт для Demo Day, потом получите такую ссылку.</>", "Сегодня продолжите свой сайт и получите такую ссылку.</>")

# ---------- 6. Reja ----------
rep("""  { ic: '⭐', h: { uz: 'Demo Day saytingizni yasaysiz', ru: 'Делаете сайт для Demo Day' }, s: { uz: "AI yordamida, 4–5 sahifa", ru: 'с помощью AI, 4–5 страниц' } },""",
    """  { ic: '⭐', h: { uz: 'Saytingizni davom ettirasiz', ru: 'Продолжаете свой сайт' }, s: { uz: "qolgan sahifalar va animatsiya", ru: 'остальные страницы и анимация' } },""")
rep("""        <Mentor>{tr({ uz: "Dars oxirida saytingiz internetda turadi — havolasini istagan odamga yubora olasiz.", ru: 'К концу урока ваш сайт будет в интернете — ссылку можно отправить кому угодно.' })}</Mentor>
        <div className="rj-row">""",
    """        <Mentor>{tr({ uz: "Dars oxirida saytingiz internetda turadi — havolasini istagan odamga yubora olasiz.", ru: 'К концу урока ваш сайт будет в интернете — ссылку можно отправить кому угодно.' })}</Mentor>
        <div className="am-tayyor fade-up delay-1">
          <p className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}</p>
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
        </div>
        <div className="rj-row">""")
rep("<b>Faqat mentorga:</b> darsning 1 soati — Demo Day sayti (1-qadam), qolgan 30 daqiqa — Netlify va deploy (2–3-qadam).</>",
    "<b>Faqat mentorga:</b> ~40 daqiqa — saytni davom ettirish (1-qadam), ~30 daqiqa — Netlify va deploy (2–3-qadam).</>")
rep("<b>Только для ментора:</b> 1 час урока — сайт для Demo Day (шаг 1), оставшиеся 30 минут — Netlify и деплой (шаги 2–3).</>",
    "<b>Только для ментора:</b> ~40 минут — продолжение сайта (шаг 1), ~30 минут — Netlify и деплой (шаги 2–3).</>")

# ---------- 7. Amaliyot ekranlari (g'oya · sahifalar · uslub · AI · 2-savol joyi · yaxshilash · kirish) → a1 + a2 ----------
TAYYOR_KOD = """const TAYYOR = [
  { uz: <>CSS Praktikada boshlagan <span className="qcode">mening-saytim</span> papkangizni VS Code'da oching.</>, ru: <>Откройте в VS Code папку <span className="qcode">mening-saytim</span>, которую начали на CSS-практике.</> },
  { uz: <><span className="qcode">index.html</span> da Go Live — bosh sahifangiz ochilsin.</>, ru: <>В <span className="qcode">index.html</span> — Go Live, пусть откроется главная страница.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' }
];
"""
rep("const ScreenReja = ({ screen, onNext, onPrev }) => {", TAYYOR_KOD + "const ScreenReja = ({ screen, onNext, onPrev }) => {")

maket = blok(css, "const STYLES = [\n  { id: 'minimal', name:", "// ===== SCREEN 0 — KIRISH (QKirish)")
maket = maket.replace("// ccDemoDay — uslub va shu darsda yozilgan loyiha (css: { nom, muammo, talab }); eski muammo/yechim o'qilmaydi (F-1015-313)\n", "// ccDemoDay — CSS Praktikada saqlangan: uslub, css: { nom, muammo, talab }; bu dars shu ipni davom ettiradi (F-1015-328)\n")
maket = maket.replace("const DemoSahifa = ({ holat = 'uslub', uslub = USLUB_STD, halqa = null }) => {\n  const cls = ['ds', holat === 'xom' ? 'ds-xom' : `ds-${uslub}`, holat === 'rang' ? 'ds-rang' : ''].filter(Boolean).join(' ');",
                      "const DemoSahifa = ({ holat = 'uslub', uslub = USLUB_STD, halqa = null, anim = null }) => {\n  const cls = ['ds', holat === 'xom' ? 'ds-xom' : `ds-${uslub}`, holat === 'rang' ? 'ds-rang' : '', anim ? `dsa-${anim}` : ''].filter(Boolean).join(' ');")
assert 'anim ? `dsa-' in maket
qp = blok(css, "const PromptBlok = ({ matn, tayyor }) => {", "const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {")
qp = qp.replace("const Qadamlar = ({ b, uslub, cls = '' }) => (", "const Qadamlar = ({ b, cls = '' }) => (")
qp = qp.replace("{fmtCode(tr(typeof x === 'function' ? x(USLUB_ACC[uslub]) : x))}", "{fmtCode(tr(x))}")
assert 'USLUB_ACC' not in qp

AMAL = maket + qp + r"""// ===== a1 · a2 — AMALIYOT (F-1015-328, praktika qolipi): saytni DAVOM ettirish — qolgan sahifalar, keyin animatsiya =====
const SAHIFA_PH = [
  { n: { uz: 'masalan: Jadval', ru: 'например: Расписание' }, m: { uz: "masalan: har kunning to'garaklari va vaqti", ru: 'например: кружки и время на каждый день' } },
  { n: { uz: 'masalan: Ustozlar', ru: 'например: Учителя' }, m: { uz: 'masalan: har ustoz, uning to\'garagi va xonasi', ru: 'например: каждый учитель, его кружок и кабинет' } },
  { n: { uz: 'masalan: Aloqa', ru: 'например: Контакты' }, m: { uz: 'masalan: telefon, manzil va ish vaqti', ru: 'например: телефон, адрес и часы работы' } },
];
const A1 = {
  qadamlar: [
    { uz: "Sahifalaringizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.", ru: 'Впишите свои страницы и нажмите «Сохранить» — промпт будет готов.' },
    { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` va `style.css` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код `index.html` и `style.css`.' },
    { uz: "`mening-saytim` papkasida Gemini aytgan nomlar bilan yangi fayllar yarating, kodlarni qo'ying; `index.html` ni ham yangisiga almashtiring, `Ctrl+S`.", ru: 'В папке `mening-saytim` создайте новые файлы с именами от Gemini и вставьте код; `index.html` тоже замените новым, `Ctrl+S`.' },
    { uz: "Live Server'da menyudagi har havolani bosing: sahifa ochiladimi, dizayni bir xilmi? Ochilmasa, Gemini'ga yozing: «… sahifasi ochilmayapti, menyudagi havolani tuzat».", ru: 'В Live Server нажмите каждую ссылку меню: страница открывается, дизайн тот же? Если нет, напишите Gemini: «Страница … не открывается, исправь ссылку в меню».' }
  ]
};
const a1Prompt = (nom, sh) => ({
  uz: `Saytimni davom ettiramiz. Loyiham — «${nom}». Bosh sahifa (index.html) va style.css tayyor, ular quyida.\nYana 3 sahifa qo'sh, har biri alohida .html fayl:\n${sh.map(x => `– «${x.n}» — ${x.m};`).join('\n')}\nFayl nomlari lotin harflarida, kichik harf, bo'sh joysiz bo'lsin (masalan: jadval.html).\nHar sahifada bosh sahifadagi menyu va footer bir xil tursin; menyuda hamma sahifa bo'lsin, index.html dagi menyuni ham yangila.\nYangi sahifalar ham shu style.css ga ulansin va shu dizaynda bo'lsin; kerak bo'lsa style.css ga yangi qoidalar qo'sh.\nHar faylni alohida, to'liq yoz va tepasiga fayl nomini yoz.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`,
  ru: `Продолжаем мой сайт. Мой проект — «${nom}». Главная страница (index.html) и style.css готовы, они ниже.\nДобавь ещё 3 страницы, каждая — отдельный .html файл:\n${sh.map(x => `– «${x.n}» — ${x.m};`).join('\n')}\nИмена файлов — латиницей, маленькими буквами, без пробелов (например: jadval.html).\nНа каждой странице — то же меню и footer, что на главной; в меню все страницы, меню в index.html тоже обнови.\nНовые страницы подключи к тому же style.css и сделай в том же дизайне; при необходимости добавь в style.css новые правила.\nКаждый файл напиши отдельно и целиком, сверху укажи имя файла.\nВот мой код: {вставьте сюда код index.html и style.css}`
});
const ScreenSahifalar = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const css0 = demo.d.css || {};
  const sv = demo.d.deploy || {};
  const [nom, setNom] = useState(() => (sv.nom || css0.nom || demo.d.yechim || ''));
  const [sh, setSh] = useState(() => [0, 1, 2].map(i => ({ n: (sv.sahifa && sv.sahifa[i] && sv.sahifa[i].n) || '', m: (sv.sahifa && sv.sahifa[i] && sv.sahifa[i].m) || '' })));
  const [yigil, setYigil] = useState(() => !!sv.saqlangan);
  const toliq = nom.trim().length >= 3 && sh.every(x => x.n.trim().length >= 2 && x.m.trim().length >= 3);
  const yoz = (nNom, nSh) => demo.set({ deploy: { ...(demo.d.deploy || {}), nom: nNom, sahifa: nSh } });
  const setNom2 = (v) => { setNom(v); yoz(v, sh); };
  const setSh2 = (i, k, v) => { const n = sh.map((x, j) => (j === i ? { ...x, [k]: v } : x)); setSh(n); yoz(nom, n); };
  const saqla = () => {
    if (!toliq) return;
    demo.set({ deploy: { ...(demo.d.deploy || {}), nom, sahifa: sh, saqlangan: true } });
    projWrite({ turi: 'demo', sahifalar: [tr({ uz: 'Bosh sahifa', ru: 'Главная' }), ...sh.map(x => x.n.trim())], mazmun: ['', ...sh.map(x => x.m.trim())] }); // PmLesson3 / preview shu kalitni o'qiydi
    setYigil(true);
  };
  const ochiq = toliq && !!(demo.d.deploy && demo.d.deploy.saqlangan);
  const matn = ochiq ? tr(a1Prompt(nom.trim(), sh.map(x => ({ n: x.n.trim(), m: x.m.trim() })))) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 1 · sahifalar', ru: 'Практика 1 · страницы' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Saytingizga qolgan sahifalarni qo'shing.", ru: 'Добавьте на сайт остальные страницы.' })}</h2></div>
        <Split>
          <Col>
            {!yigil && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</p>
              <label className="am-maydon"><span>{tr({ uz: 'Loyihangiz nomi', ru: 'Название проекта' })}</span><input className="am-input" value={nom} placeholder={tr({ uz: "masalan: To'garak jadvali", ru: 'например: Расписание кружков' })} onChange={e => setNom2(e.target.value)} /></label>
              {sh.map((x, i) => (
                <div key={i} className="am-sahifa">
                  <span className="am-qn">{i + 2}</span>
                  <input className="am-input" value={x.n} placeholder={tr(SAHIFA_PH[i].n)} autoFocus={i === 0 && !x.n && !!nom} aria-label={tr({ uz: `${i + 2}-sahifa nomi`, ru: `Название страницы ${i + 2}` })} onChange={e => setSh2(i, 'n', e.target.value)} />
                  <input className="am-input" value={x.m} placeholder={tr(SAHIFA_PH[i].m)} aria-label={tr({ uz: `${i + 2}-sahifada nima bo'ladi`, ru: `Что будет на странице ${i + 2}` })} onChange={e => setSh2(i, 'm', e.target.value)} />
                </div>
              ))}
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr({ uz: "1-sahifa — bosh sahifangiz, u tayyor.", ru: 'Страница 1 — ваша главная, она готова.' })}</p>
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: "Hamma qatorni to'ldiring", ru: 'Заполните все строки' })}</button>
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Saytingiz', ru: 'Ваш сайт' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-loyiha-nom">{nom}</p>
              <ol className="am-hw">{[tr({ uz: 'Bosh sahifa — tayyor', ru: 'Главная — готова' }), ...sh.map(x => `${x.n} — ${x.m}`)].map((t, i) => <li key={i}>{t}</li>)}</ol>
            </div>}
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: 'Prompt tayyor — endi Gemini orqali quring.', ru: 'Промпт готов — теперь стройте с помощью Gemini.' }} /></div>}
          </Col>
          <Col>
            <Qadamlar b={A1} cls="fade-up delay-2" />
            <p className="flow-label">{tr({ uz: 'Saytingiz uslubi · namuna', ru: 'Стиль вашего сайта · образец' })}</p>
            <Zoomable><DemoSahifa holat="uslub" uslub={demo.d.uslub || USLUB_STD} /></Zoomable>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// a2 — animatsiya: bittasi tanlanadi, o'ngdagi maketda (o'quvchining uslubida) jonli ishlaydi; prompt faqat style.css
const ANIMS = [
  { id: 'paydo', name: { uz: "Silliq paydo bo'lish", ru: 'Плавное появление' }, sub: { uz: "bo'limlar pastdan suzib chiqadi", ru: 'блоки выплывают снизу' },
    p: { uz: "Sahifa ochilganda bosh qism (hero) va kartalar pastdan silliq suzib chiqsin: shaffofdan to'liq ko'rinishga, 20px pastdan joyiga, har biri biroz kechikib (0.6 soniya).", ru: 'При открытии страницы главный блок (hero) и карточки плавно выплывают снизу: из прозрачного в видимое, с 20px ниже на место, каждый с небольшой задержкой (0.6 секунды).' } },
  { id: 'karta', name: { uz: 'Jonli kartalar', ru: 'Живые карточки' }, sub: { uz: "sichqoncha kelsa ko'tariladi", ru: 'поднимаются при наведении' },
    p: { uz: "Sichqoncha kartaga kelganda karta 6px ko'tarilsin va soyasi kattalashsin; tugmalar ham ustiga kelganda biroz kattalashsin. O'tish 0.3 soniya, silliq.", ru: 'При наведении мыши карточка поднимается на 6px и тень становится больше; кнопки при наведении слегка увеличиваются. Переход 0.3 секунды, плавный.' } },
  { id: 'fon', name: { uz: 'Harakatdagi fon', ru: 'Живой фон' }, sub: { uz: 'bosh qism ranglari oqadi', ru: 'цвета главного блока перетекают' },
    p: { uz: "Bosh qism (hero) foni saytimdagi ranglardan ikki rangli gradient bo'lsin va sekin oqib tursin: background-size 200%, 8 soniyalik takrorlanadigan animatsiya.", ru: 'Фон главного блока (hero) — градиент из двух цветов моего сайта, который медленно перетекает: background-size 200%, анимация 8 секунд по кругу.' } },
  { id: 'yozuv', name: { uz: 'Yozuv terilishi', ru: 'Печатающийся текст' }, sub: { uz: 'sarlavha harfma-harf yoziladi', ru: 'заголовок печатается по буквам' },
    p: { uz: "Bosh qismdagi katta sarlavha sahifa ochilganda chapdan o'ngga harfma-harf yozilayotgandek chiqsin (2.5 soniya), oxirida yonida kursor miltillasin.", ru: 'Крупный заголовок главного блока при открытии страницы появляется слева направо, будто печатается по буквам (2.5 секунды), в конце рядом мигает курсор.' } },
];
const A2 = {
  qadamlar: [
    { uz: "«Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` va `style.css` kodingizni qo'ying.", ru: '«Скопировать промпт» → вставьте в Gemini, вместо `{…}` в конце — код `index.html` и `style.css`.' },
    { uz: "Javobdagi kodni `style.css` ga qo'ying (bor kod o'rniga), `Ctrl+S`.", ru: 'Вставьте код из ответа в `style.css` (вместо старого), `Ctrl+S`.' },
    { uz: "Live Server'da sahifani yangilang (`F5`): animatsiya o'ngdagi namunadagidek ishlayaptimi? Yana birini qo'shmoqchi bo'lsangiz — boshqasini tanlab, promptni yana yuboring.", ru: 'Обновите страницу в Live Server (`F5`): анимация работает, как в образце справа? Хотите ещё одну — выберите другую и отправьте промпт снова.' }
  ]
};
const ScreenAnimatsiya = ({ screen, onNext, onPrev }) => {
  const demo = useDemo();
  const tanlov = (demo.d.deploy && demo.d.deploy.anim) || null;
  const [qayta, setQayta] = useState(0); // tanlanganda maket animatsiyasi boshidan qayta o'ynaydi
  const tanla = (id) => { demo.set({ deploy: { ...(demo.d.deploy || {}), anim: id } }); setQayta(n => n + 1); };
  const a = ANIMS.find(x => x.id === tanlov);
  const matn = a ? tr({ uz: `Saytimga animatsiya qo'sh — faqat style.css'ni o'zgartir, HTML'ni o'zgartirma, bor dizaynimni buzma.\n${a.p.uz}\n@keyframes va transition bilan yoz. Harakatni yoqtirmaydiganlar uchun @media (prefers-reduced-motion: reduce) ichida animatsiya o'chsin.\nO'zgargan style.css ni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Добавь на мой сайт анимацию — меняй только style.css, HTML не трогай, мой дизайн не ломай.\n${a.p.ru}\nПиши через @keyframes и transition. Для тех, кто не любит движение, в @media (prefers-reduced-motion: reduce) анимация отключается.\nВерни изменённый style.css целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · animatsiya', ru: 'Практика 2 · анимация' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Saytingizni jonlantiring.', ru: 'Оживите свой сайт.' })}</h2></div>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Animatsiya', ru: 'Анимация' })}</p>
              <div className="am-uslub">{ANIMS.map(x => <button key={x.id} type="button" className={`am-uslub-btn ${tanlov === x.id ? 'on' : ''}`} onClick={() => tanla(x.id)}><b>{tr(x.name)}</b><span>{tr(x.sub)}</span></button>)}</div>
              <p className="small" style={{ margin: 0, color: T.ink2 }}>{tr(tanlov ? { uz: "Bosib ko'ring — namunada qayta o'ynaydi.", ru: 'Нажмите ещё раз — в образце проиграется снова.' } : { uz: "Bittasini tanlang — o'ngdagi namunada ko'rasiz, keyin prompt ochiladi.", ru: 'Выберите одну — увидите в образце справа, затем откроется промпт.' })}</p>
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} /></div>}
            {matn && <Qadamlar b={A2} cls="am-ochil" />}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Saytingiz · namuna', ru: 'Ваш сайт · образец' })}</p>
            <Zoomable><div key={`${tanlov}-${qayta}`}><DemoSahifa holat="uslub" uslub={demo.d.uslub || USLUB_STD} anim={tanlov} /></div></Zoomable>
            <p className="small am-osti">{tr({ uz: "Animatsiya — faqat CSS: HTML o'zgarmaydi.", ru: 'Анимация — только CSS: HTML не меняется.' })}</p>
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

"""
cut("// ===== SCREEN 3 — DEMO DAY G'OYASI", "// ===== SCREEN 6 — TEST 2 =====", AMAL)
cut("// ===== SCREEN IMPROVE —", "// ===== SCREEN DROP —", "")

# ---------- 8. Netlify: kirish (GitHub) + yuklash — bitta ekran ----------
rep("""const DROP_STEPS = [
  { id: 'page', nav: { uz: 'maydon', ru: 'зона' },""", """const DROP_STEPS = [
  // F-1015-328: Netlify'ga kirish (oldingi alohida ekran) shu yerga qo'shildi — bitta ekranda kirish, yuklash, havola
  { id: 'open', nav: { uz: 'netlify.com', ru: 'netlify.com' },
    t: { uz: 'Brauzerda `netlify.com` saytini oching', ru: 'Откройте в браузере сайт `netlify.com`' },
    d: { uz: "Manzilni qo'lda yozing — bu rasmiy sayt.", ru: 'Наберите адрес вручную — это официальный сайт.' },
    res: () => <NetWin title="netlify.com"><span className="nfy-btn ghost">Log in</span><span className="nfy-btn">Sign up</span></NetWin> },
  { id: 'github', nav: { uz: 'GitHub', ru: 'GitHub' },
    t: { uz: '«Log in» → «Log in with GitHub», keyin GitHub sahifasida «Authorize Netlify»', ru: '«Log in» → «Log in with GitHub», затем на странице GitHub — «Authorize Netlify»' },
    d: { uz: "Alohida parol o'ylab topmaysiz: GitHub hisobingiz yetadi.", ru: 'Отдельный пароль придумывать не нужно: хватит вашего GitHub.' },
    help: { uz: "Tugma ko'rinmasa — sahifani pastga suring. GitHub parol so'rasa — hisobingizga kiring va tugmani qayta bosing.", ru: 'Если кнопки не видно — прокрутите вниз. Если GitHub просит пароль — войдите и нажмите кнопку снова.' },
    res: () => <NetWin title="app.netlify.com"><span className="nfy-row on">🐙 Log in with GitHub</span><span className="nfy-row">✉️ Log in with email</span></NetWin> },
  { id: 'page', nav: { uz: 'maydon', ru: 'зона' },""")
rep("""<>Papkani tashlang — sayt <span className="italic" style={{ color: T.accent }}>internetga chiqadi</span></>, ru: <>Бросьте папку — сайт <span className="italic" style={{ color: T.accent }}>выйдет в интернет</span></>""",
    """<>Saytingizni <span className="italic" style={{ color: T.accent }}>internetga chiqaring</span>.</>, ru: <>Выложите сайт <span className="italic" style={{ color: T.accent }}>в интернет</span>.</>""")
rep("""<>Saytni internetga chiqarish <b style={{ color: T.ink }}>deploy</b> deyiladi. Netlify'da buning uchun sayt papkasini sudrab tashlash yetadi.</>""",
    """<>Saytni internetga chiqarish <b style={{ color: T.ink }}>deploy</b> deyiladi. Netlify'ga GitHub bilan kirasiz va sayt papkasini sudrab tashlaysiz.</>""")
rep("""<>Выложить сайт в интернет — это <b style={{ color: T.ink }}>деплой</b>. В Netlify для этого достаточно перетащить папку сайта.</>""",
    """<>Выложить сайт в интернет — это <b style={{ color: T.ink }}>деплой</b>. Входите в Netlify через GitHub и перетаскиваете папку сайта.</>""")

# ---------- 9. Uyga vazifa ekrani olinadi — vazifalar yakun kartasiga ----------
cut("// ===== SCREEN 13 — UYGA VAZIFA =====", "// 🃏 FLASHCARDS", "")
rep("""            <p className="hw-note">{tr({ uz: 'Uyda saytni tugatib, havolani platformadagi vazifa-savoliga yozib yuboring.', ru: 'Доделайте сайт дома и отправьте ссылку в задание на платформе.' })}</p>""",
    """            <ul>{UYGA_TASKS.map((h, i) => (<li key={i}><b>{tr(h.b)}</b> <span className="t">{tr(h.t)}</span></li>))}</ul>
            <p className="hw-note">{tr({ uz: <>Bu havola <b>Demo Day</b> repetitsiyasida ham kerak bo'ladi.</>, ru: <>Эта ссылка понадобится и на репетиции <b>Demo Day</b>.</> })}</p>""")
rep("// ===== SCREEN 16 — YAKUN =====", """// Uyga vazifa (F-1015-328: alohida ekran o'rniga yakun kartasida)
const UYGA_TASKS = [
  { b: { uz: 'Saytni tugating', ru: 'Доведите сайт до конца' }, t: { uz: '— hamma sahifa ochilsin, menyu ishlasin', ru: '— чтобы открывались все страницы и работало меню' } },
  { b: { uz: 'Matnni tekshiring', ru: 'Проверьте тексты' }, t: { uz: "— har gap loyihangiz haqida bo'lsin", ru: '— каждая фраза должна быть о вашем проекте' } },
  { b: { uz: 'Saytni yangilang', ru: 'Обновите сайт' }, t: { uz: "— Netlify'da saytingiz nomini bosing, Deploys bo'limini oching va o'zgargan papkani o'sha yerga qayta sudrab tashlang", ru: '— в Netlify нажмите на имя сайта, откройте раздел Deploys и снова перетащите туда изменённую папку' } },
  { b: { uz: 'Havolani yuboring', ru: 'Отправьте ссылку' }, t: { uz: "— platformadagi vazifa-savoliga va do'stlaringizga", ru: '— в задание на платформе и друзьям' } },
];
// ===== SCREEN 16 — YAKUN =====""")
rep("""    { uz: "Demo Day saytini AI'ga aniq topshiriq berib qurish", ru: 'Сборка сайта для Demo Day по точному заданию для AI' },
    { uz: 'AI javobini tekshirib, yaxshilatish', ru: 'Проверка ответа AI и улучшение' },
    { uz: "Netlify'ga GitHub hisobi bilan kirish", ru: 'Вход в Netlify через аккаунт GitHub' },
    { uz: 'Papkani sudrab tashlab deploy qilish va havolani olish', ru: 'Деплой перетаскиванием папки и получение ссылки' },
  ];""", """    { uz: "Saytga Gemini bilan qolgan sahifalarni qo'shish va menyuni ulash", ru: 'Добавление страниц через Gemini и связка меню' },
    { uz: 'Saytni CSS animatsiya bilan jonlantirish', ru: 'Оживление сайта CSS-анимацией' },
    { uz: "Netlify'ga GitHub hisobi bilan kirish", ru: 'Вход в Netlify через аккаунт GitHub' },
    { uz: 'Papkani sudrab tashlab deploy qilish va havolani olish', ru: 'Деплой перетаскиванием папки и получение ссылки' },
  ];""")

# ---------- 10. Kartochkalar: olingan ekranlarga tayangan 2 ta karta almashadi ----------
rep("""  { front: { uz: "AI yozgan saytni qanday yaxshilaymiz?", ru: 'Как улучшить сайт, который написал AI?' }, back: { uz: 'Tekshirib, yaxshilash topshirig\\'ini beramiz', ru: 'Проверяем и даём задание на улучшение' }, note: { uz: '✗ qo\\'yilgan bandlar topshiriqqa tushadi', ru: 'пункты с ✗ попадают в задание' } },""",
    """  { front: { uz: 'Saytga animatsiya qaysi faylga yoziladi?', ru: 'В какой файл пишется анимация сайта?' }, back: 'style.css', note: { uz: '@keyframes va transition — HTML o\\'zgarmaydi', ru: '@keyframes и transition — HTML не меняется' } },""")
rep("""  { front: { uz: "Sayt telefonda ham chiroyli chiqishi uchun AI topshirig'iga nima yozdik?", ru: 'Что мы написали в задании для AI, чтобы сайт красиво выглядел и на телефоне?' }, back: { uz: "Telefonda ham, kompyuterda ham chiroyli ko'rinsin", ru: 'Пусть красиво выглядит и на телефоне, и на компьютере' }, note: { uz: 'Topshiriqdagi 5-shart', ru: '5-е условие в задании' } },""",
    """  { front: { uz: 'Menyudagi havola yangi sahifani ochishi uchun href ga nima yoziladi?', ru: 'Что пишется в href, чтобы ссылка меню открыла новую страницу?' }, back: { uz: 'Fayl nomi', ru: 'Имя файла' }, note: '<a href="jadval.html">' },""")

# ---------- 11. Root ----------
rep("  const screens = [Screen0, ScreenReja, Screen3, ScreenPages, Screen4, Screen5, Screen6, ScreenImprove, Screen1, Screen2, Screen8, ScreenDrop, Screen12, Screen13, ScreenPodium, ScreenFlashcards, Screen16];",
    "  const screens = [Screen0, ScreenReja, ScreenSahifalar, ScreenAnimatsiya, Screen1, Screen2, Screen6, ScreenDrop, Screen12, ScreenPodium, ScreenFlashcards, Screen16];")
rep("              <Current screen={screen} storedAnswer=", "              <Current key={screen} screen={screen} storedAnswer=")

# ---------- 12. CSS: amaliyot bloklari + sayt maketi (CssPractice dan) + animatsiya namunalari ----------
cssblok = blok(css, "        /* ===== F-1015-303/309 · praktika qolipi: amaliyot bloklari va DemoSahifa (izohda backtick yo'q) ===== */", "      `}</style>")
cssblok = cssblok.replace("        @media (max-width: 760px) { .am-reja .split > .col:last-child { order: -1; } }\n", "")
ANIM_CSS = r"""        /* ===== F-1015-328 · a2 animatsiya namunalari — maket ichida (sinflar izohda backtiksiz) ===== */
        .am-sahifa { display: grid; grid-template-columns: 22px minmax(0,0.8fr) minmax(0,1.4fr); gap: 8px; align-items: center; }
        @media (max-width: 520px) { .am-sahifa { grid-template-columns: 22px 1fr; } .am-sahifa > .am-input:last-child { grid-column: 2; } }
        .dsa-paydo .ds-hero-t > *, .dsa-paydo .ds-svg, .dsa-paydo .ds-karta { animation: dsa-up 0.7s cubic-bezier(.2,.7,.3,1) both; }
        .dsa-paydo .ds-hero-t > :nth-child(2) { animation-delay: 0.12s; } .dsa-paydo .ds-hero-t > :nth-child(3) { animation-delay: 0.24s; } .dsa-paydo .ds-hero-t > :nth-child(4) { animation-delay: 0.36s; }
        .dsa-paydo .ds-svg { animation-delay: 0.3s; } .dsa-paydo .ds-karta:nth-child(1) { animation-delay: 0.5s; } .dsa-paydo .ds-karta:nth-child(2) { animation-delay: 0.62s; } .dsa-paydo .ds-karta:nth-child(3) { animation-delay: 0.74s; }
        @keyframes dsa-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        .dsa-karta .ds-karta { transition: transform 0.3s, box-shadow 0.3s; animation: dsa-lift 3.6s ease-in-out infinite; }
        .dsa-karta .ds-karta:nth-child(2) { animation-delay: 1.2s; } .dsa-karta .ds-karta:nth-child(3) { animation-delay: 2.4s; }
        .dsa-karta .ds-karta:hover { transform: translateY(-6px); box-shadow: 0 14px 26px -10px rgba(0,0,0,0.35); }
        @keyframes dsa-lift { 0%, 40%, 100% { transform: none; box-shadow: none; } 15%, 28% { transform: translateY(-6px); box-shadow: 0 14px 26px -10px rgba(0,0,0,0.35); } }
        .dsa-karta .ds-tugma { animation: dsa-pul 3.6s ease-in-out infinite; }
        @keyframes dsa-pul { 0%, 60%, 100% { transform: none; } 75% { transform: scale(1.08); } }
        .dsa-fon .ds-hero { background: linear-gradient(120deg, var(--ds-bub), var(--ds-bg), var(--ds-bub)); background-size: 200% 200%; animation: dsa-fon 4s ease-in-out infinite; }
        @keyframes dsa-fon { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .dsa-yozuv .ds-h1 { animation: dsa-yoz 2.5s steps(28) both; }
        .dsa-yozuv .ds-h1::after { content: ''; display: inline-block; width: 2px; height: 1em; margin-left: 3px; vertical-align: -0.12em; background: var(--ds-acc); animation: dsa-kursor 0.8s step-end infinite; }
        @keyframes dsa-yoz { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes dsa-kursor { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .dsa-paydo *, .dsa-karta *, .dsa-fon .ds-hero, .dsa-yozuv .ds-h1, .dsa-yozuv .ds-h1::after { animation: none !important; } }
"""
rep("      `}</style>", cssblok + ANIM_CSS + "      `}</style>")

open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()), 'qator')
