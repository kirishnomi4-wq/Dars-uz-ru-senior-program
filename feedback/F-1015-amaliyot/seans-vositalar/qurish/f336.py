#!/usr/bin/env python3
# F-1015-336 · PracticeLesson2 (m2-09) 19 → 8 ekran: Gemini'ga aniq yozish — 4 qismli prompt (forma + jonli maket), iteratsiya, Copilot bo'limi.
import sys, re
R = sys.argv[1]
P = R + '/src/2-Modull/PracticeLesson2.jsx'
s = open(P, encoding='utf-8').read()
css = open(R + '/src/1-Modull/CssPractice.jsx', encoding='utf-8').read()
p1 = open(R + '/src/2-Modull/PracticeLesson1.jsx', encoding='utf-8').read()

def rep(old, new, n=1):
    global s
    c = s.count(old)
    assert c == n, f'{c}× : {old[:90]!r}'
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
rep("""// Mavzu: vibecoding; yaxshi PROMPT (4 ingredient: mavzu, uslub, rang, qismlar);
//        yomon vs yaxshi prompt; iteratsiya (qayta so'rash); natijani tekshirish.
// Loyiha: bloklardan prompt yig'ib, promo landing sahifa qurish (jonli preview).
// Asosiy xabar: "AI tezlik beradi — SIFATni siz ta'minlaysiz."
// Tool: Antigravity (haqiqiy uyga vazifa muhiti).""" if "4 ingredient: mavzu, uslub" in s else """// Mavzu: vibecoding; yaxshi PROMPT (4 ingredient: mavzu, stil, rang, qismlar);
//        yomon vs yaxshi prompt; iteratsiya (qayta so'rash); natijani tekshirish.
// Loyiha: bloklardan prompt yig'ib, promo landing sahifa qurish (jonli preview).
// Asosiy xabar: "AI tezlik beradi — SIFATni siz ta'minlaysiz."
// Tool: Antigravity (haqiqiy uyga vazifa muhiti).""",
"""// F-1015-336 (16.10, foydalanuvchi bilan sahifama-sahifa): 19 → 8 ekran. O'quvchi O'Z mavzusiga promo sahifa quradi (VS Code + gemini.google.com + Copilot):
//        yaxshi prompt = 4 qism (mavzu · uslub · rang · bo'limlar) — forma, o'ngda maket shu yozuvdan jonli quriladi; iteratsiya; Copilot bilan bo'lim.
// Asosiy xabar: "AI tezlik beradi — SIFATni siz ta'minlaysiz." Antigravity ishlatilmaydi (18+). Oldingi 19 ekranli: arxiv/F-1015-practice2-oldin/.""")

# ---------- 2. SCREEN_META ----------
cut("const SCREEN_META = [", "const TOTAL_SCREENS = SCREEN_META.length;",
"""const SCREEN_META = [
  { id: 's0',  type: 'hook',     template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',     template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a3',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 's7',  type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' }, // F-1015-336: yagona ballik (eski s7, kalit B saqlandi)
  { id: 's15b', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'summary',  template: 'custom',   scored: false, scope: null }
];
""")

# ---------- 3. Recap (eski s7 kartalari, kalit indeks 5), kalitlar, nishonlar, podium ----------
r7 = blok(s, "  7: {\n    title: { uz: \"Qaysi buyruq eng yaxshi?\"", "  9: {\n    title: { uz: \"AI birinchi urinishda mos qilmasa?\"")
r7 = r7.replace("  7: {\n", "  5: {\n", 1).replace("rang, stil va qismlarni", "rang, uslub va bo'limlarni").replace("Qismlarni sanab ber", "Bo'limlarni sanab ber").replace("sahifaning <b>qismlari</b> aytiladi", "sahifaning <b>bo'limlari</b> aytiladi")
cut("const RECAPS = {", "// Overlay — ekran ustida (indekslarga tegmaydi)", "const RECAPS = {\n  // idx 5 — s7: «Qaysi so'rov eng aniq?» (F-1015-336: yagona ballik)\n" + r7 + "};\n\n")
rep("const INLINE_KEYS = { s4: 0, s7: 1, s9: 2, s15: -1 };", "const INLINE_KEYS = { s7: 1 }; // F-1015-336: s4, s9, s15 olindi")
rep("""  prompt:  { icon: '🎯', name: 'Prompt Pro',  desc: { uz: 'Yaxshi promptni yomonidan ajratdingiz', ru: 'Вы отличили хороший промпт от плохого' } },""",
    """  prompt:  { icon: '🎯', name: 'Prompt Pro',  desc: { uz: "To'rt qismli prompt bilan sahifa qurdingiz", ru: 'Вы построили страницу промптом из четырёх частей' } },""")
rep("""  iterate: { icon: '🔁', name: 'Iterator',    desc: { uz: 'Iteratsiya bilan natijani yaxshiladingiz', ru: 'Вы улучшили результат итерацией' } },
  builder: { icon: '🚀', name: 'Ship It!',    desc: { uz: "O'z promo saytingizni qurib nashr qildingiz", ru: 'Вы построили и опубликовали свой промо-сайт' } },""",
    """  iterate: { icon: '🔁', name: 'Iterator',    desc: { uz: "Sahifani aniq so'rab yaxshiladingiz", ru: 'Вы улучшили страницу точными запросами' } },
  builder: { icon: '🚀', name: 'Ship It!',    desc: { uz: "Sahifaga Copilot bilan bo'lim qo'shdingiz", ru: 'Вы добавили раздел с Copilot' } },""")
rep("const ACH_TRIGGERS = { s4: 'prompt', s7: 'best', s9: 'iterate' };", """// F-1015-336: blok nishonlari «Davom etish»da (bonus; isbot yo'q — ustoz ko'rib turadi); test nishoni — s7
const BLOK_ACH = { a1: 'prompt', a2: 'iterate', a3: 'builder' };
const ACH_TRIGGERS = { s7: 'best' };""")
s = re.sub(r"const Q_LABELS = \{[^\n]*\};", "const Q_LABELS = { 5: { uz: \"Eng aniq so'rov\", ru: 'Самый точный запрос' } };", s, count=1)
cut("const PRACTICE_AFTER = {\n", "export default function PracticeLesson2(", "const PRACTICE_AFTER = {}; // F-1015-336: PromoBuilder praktikasi olindi — ish o'quvchining VS Code'ida\n\n")

# ---------- 4. Kirish: «agent» → «AI», noto'g'ri javobga «To'g'ri» emas ----------
rep('''<Mentor>{tr({ uz: "Shu qisqa buyruqni agentga yuboring va natijaga qarang — kutganingizday chiqdimi?", ru: 'Отправьте агенту эту короткую команду и посмотрите на результат — вышло, как вы ждали?' })}</Mentor>''',
    '''<Mentor>{tr({ uz: "Shu qisqa buyruqni AI'ga yuboring va natijaga qarang — kutganingizday chiqdimi?", ru: 'Отправьте AI эту короткую команду и посмотрите на результат — вышло, как вы ждали?' })}</Mentor>''')
_a = s.index("const Screen0 = "); _b = s.index("// ===== SCREEN 1 — REJA =====")
_seg = s[_a:_b]; assert _seg.count("tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' })") == 1
s = s[:_a] + _seg.replace("tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' })", "tr({ uz: \"AI'ga yuborish\", ru: 'Отправить AI' })") + s[_b:]
rep("""{tr({ uz: <>To'g'ri! AI tez, lekin o'ylaganingizni o'qiy olmaydi. <b>Aniq aytsangiz — aniq natija.</b></>,""",
    """{tr({ uz: <>{picked === 'a' ? "To'g'ri!" : 'Aslida,'} AI tez, lekin o'ylaganingizni o'qiy olmaydi. <b>Aniq aytsangiz — aniq natija.</b></>,""")

# ---------- 5. Reja + amaliyot ekranlari ----------
qp = blok(css, "const PromptBlok = ({ matn, tayyor }) => {", "const ScreenAmaliyot = ({ screen, onNext, onPrev }) => {")
qp = qp.replace("const Qadamlar = ({ b, uslub, cls = '' }) => (", "const Qadamlar = ({ b, cls = '' }) => (").replace("{fmtCode(tr(typeof x === 'function' ? x(USLUB_ACC[uslub]) : x))}", "{fmtCode(tr(x))}")
qt = blok(p1, "// F-1015-330: a2/a3 da qadamlar bitta tugmada", "const DEMO_KEY = 'ccDemoDay';") if "// F-1015-330: a2/a3 da qadamlar bitta tugmada" in p1 and p1.index("// F-1015-330: a2/a3 da qadamlar bitta tugmada") < p1.index("const DEMO_KEY = 'ccDemoDay';") else blok(p1, "// F-1015-330: a2/a3 da qadamlar bitta tugmada", "// rejim: tungi rejim tugmasi")
tt = blok(p1, "// F-1015-334 (foydalanuvchi, A variant): «Avval tayyorlaning»", "const Screen1 = ({ screen, onNext, onPrev }) => (")
kn = blok(p1, "const KodNusxa = ({ yorliq, kod }) => {", "// ===== a1 · a2 · a3 · a4 — AMALIYOT")

NEW = r"""// ===== SCREEN 1 — REJA (F-1015-336): «Avval tayyorlaning ▾» + «Yaxshi prompt — 4 qism» + 3 blok =====
const TAYYOR = [
  { uz: <>Ish stolida <span className="qcode">promo</span> papkasini yarating va VS Code'da oching; ichida <span className="qcode">index.html</span> va <span className="qcode">style.css</span>, Go Live.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">promo</span> и откройте её в VS Code; внутри <span className="qcode">index.html</span> и <span className="qcode">style.css</span>, Go Live.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' },
  { uz: "Copilot yoqilganini tekshiring — VS Code pastki chizig'ida Copilot belgisi bor.", ru: 'Проверьте, что Copilot включён — в нижней строке VS Code есть значок Copilot.' }
];
const QISMLAR = [{ uz: 'mavzu', ru: 'тема' }, { uz: 'uslub', ru: 'стиль' }, { uz: 'rang', ru: 'цвет' }, { uz: "bo'limlar", ru: 'разделы' }];
const REJA_BLOK = [
  { t: { uz: 'Promo sahifa', ru: 'Промо-страница' }, tag: { uz: 'Gemini · 4 qism', ru: 'Gemini · 4 части' } },
  { t: { uz: 'Yaxshilash', ru: 'Улучшение' }, tag: { uz: "Gemini · aniq so'rov", ru: 'Gemini · точный запрос' } },
  { t: { uz: "Yangi bo'lim", ru: 'Новый раздел' }, tag: 'Copilot' }
];
""" + tt + r"""const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={{ uz: 'Reja', ru: 'План' }} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Bugun AI'ga <span className="italic" style={{ color: T.accent }}>aniq</span> yozishni o'rganasiz.</>, ru: <>Сегодня научитесь писать AI <span className="italic" style={{ color: T.accent }}>точно</span>.</> })}</h2></div>
      <Mentor>{tr({ uz: <>O'zingiz tanlagan mavzuga promo sahifa qurasiz: turnir, klub yoki o'yin. Yaxshi prompt <b style={{ color: T.ink }}>4 qismdan</b> iborat — ularni o'ngda ko'rasiz.</>, ru: <>Построите промо-страницу на свою тему: турнир, клуб или игра. Хороший промпт состоит из <b style={{ color: T.ink }}>4 частей</b> — они справа.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <PromoMaket f={PROMO_NAMUNA} qoidalar />
        </Col>
        <Col>
          <p className="flow-label">{tr({ uz: 'Yaxshi prompt — 4 qism', ru: 'Хороший промпт — 4 части' })}</p>
          <div className="am-qism-ro fade-up delay-1">{QISMLAR.map((q, i) => <span key={i} className="am-qism"><b>{i + 1}</b>{tr(q)}</span>)}</div>
          <p className="flow-label" style={{ marginTop: 6 }}>{tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}</p>
          <ol className="am-blok-ro">{REJA_BLOK.map((b, i) => <li key={i} className="am-karta fade-up" style={{ animationDelay: `${0.08 + i * 0.06}s` }}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== Bitta vizual — o'quvchi yozganidan jonli quriladigan promo sahifa (4 qism ko'rinib turadi; yetishmagani — uzuq «?») =====
const PROMO_KEY = 'ccPromo';
const promoRead = () => { try { const v = JSON.parse(localStorage.getItem(PROMO_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const promoWrite = (patch) => { try { localStorage.setItem(PROMO_KEY, JSON.stringify({ ...promoRead(), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
const PM_USLUB = [{ id: 'zamonaviy', l: { uz: 'Zamonaviy', ru: 'Современный' } }, { id: 'quvnoq', l: { uz: 'Quvnoq', ru: 'Весёлый' } }, { id: 'sodda', l: { uz: 'Sodda', ru: 'Простой' } }];
const PM_RANG = [{ id: 'kok', l: { uz: "Ko'k", ru: 'Синий' }, c: '#1d4ed8' }, { id: 'yashil', l: { uz: 'Yashil', ru: 'Зелёный' }, c: '#15803d' }, { id: 'sariq', l: { uz: "To'q sariq", ru: 'Оранжевый' }, c: '#c2410c' }, { id: 'binafsha', l: { uz: 'Binafsha', ru: 'Фиолетовый' }, c: '#6d28d9' }];
const PM_MISOL = [{ uz: 'Maktab futbol turniri', ru: 'Школьный футбольный турнир' }, { uz: "O'yin klubi", ru: 'Игровой клуб' }, { uz: 'Kibersport turniri', ru: 'Киберспортивный турнир' }];
const PROMO_NAMUNA = { mavzu: 'Maktab futbol turniri', uslub: 'zamonaviy', rang: 'kok', tugma: "Ro'yxatdan o'tish", kartalar: '25-oktabr, Maktab stadioni, Kubok va medallar' };
const PromoMaket = ({ f = {}, qoidalar = false }) => {
  const rang = PM_RANG.find(r => r.id === f.rang);
  const c = rang ? rang.c : null;
  const uslub = f.uslub || null;
  const kartalar = (f.kartalar || '').split(',').map(x => x.trim()).filter(Boolean).slice(0, 3);
  const bosh = (t, cls = '') => <span className={`pm-yoq ${cls}`}>? {tr(t)}</span>;
  return (
    <div className={`pm-sayt ${uslub ? `pm-${uslub}` : 'pm-uslubsiz'}`} style={{ '--pm': c || '#64748b' }}>
      <div className="pm-bar"><span className="bb-dots"><i /><i /><i /></span><span className="pm-url">promo · Live Server</span></div>
      <div className="pm-body">
        <div className={`pm-hero ${c ? '' : 'pm-rangsiz'}`}>
          {f.mavzu && f.mavzu.trim() ? <p className="pm-h1">{f.mavzu.trim()}</p> : bosh({ uz: 'mavzu', ru: 'тема' }, 'pm-yoq-h')}
          <p className="pm-p">{tr({ uz: 'Bizga qo\'shiling — joylar soni cheklangan!', ru: 'Присоединяйтесь — мест немного!' })}</p>
          {f.tugma && f.tugma.trim() ? <span className="pm-tugma">{f.tugma.trim()}</span> : bosh({ uz: 'tugma', ru: 'кнопка' })}
          {!c && <span className="pm-izoh">{tr({ uz: 'rang aytilmadi', ru: 'цвет не назван' })}</span>}
          {!uslub && <span className="pm-izoh">{tr({ uz: 'uslub aytilmadi', ru: 'стиль не назван' })}</span>}
        </div>
        <div className="pm-kartalar">{[0, 1, 2].map(i => kartalar[i] ? <div key={i} className="pm-karta"><i />{kartalar[i]}</div> : <div key={i} className="pm-karta pm-karta-yoq">?</div>)}</div>
        {qoidalar && <div className="pm-qoida am-ochil"><p className="pm-h2">{tr({ uz: 'Qoidalar', ru: 'Правила' })}</p><ul>{[{ uz: 'Jamoada 7 o\'yinchi', ru: '7 игроков в команде' }, { uz: "O'yin 2 × 20 daqiqa", ru: 'Игра 2 × 20 минут' }, { uz: "Ro'yxat 24-oktabrgacha", ru: 'Запись до 24 октября' }].map((x, i) => <li key={i}>{tr(x)}</li>)}</ul></div>}
        <div className="pm-ft">{(f.mavzu && f.mavzu.trim()) || tr({ uz: 'Promo sahifa', ru: 'Промо-страница' })} · 2026</div>
      </div>
    </div>
  );
};
""" + qp + qt + kn + r"""
// ===== a1 — 4 qismli prompt (forma → Saqlash → prompt; maket yozuvdan jonli) =====
const A1 = {
  qadamlar: [
    { uz: "4 qismni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi.", ru: 'Заполните 4 части и нажмите «Сохранить» — промпт будет готов.' },
    { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
    { uz: "Javobdagi kodlarni `promo` papkasidagi `index.html` va `style.css` ga qo'ying, `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` и `style.css` папки `promo`, `Ctrl+S`.' },
    { uz: "Live Server'da solishtiring: mavzu — sarlavhada, rang — tugmada, bo'limlar — kartalarda bormi?", ru: 'Сравните в Live Server: тема — в заголовке, цвет — на кнопке, разделы — в карточках?' }
  ]
};
const a1Prompt = (f) => {
  const u = PM_USLUB.find(x => x.id === f.uslub), r = PM_RANG.find(x => x.id === f.rang);
  return { uz: `${f.mavzu} uchun promo sahifa yasa.\nUslubi ${tr(u.l).toLowerCase()}, asosiy rang ${tr(r.l).toLowerCase()}.\nSahifada: katta sarlavha, «${f.tugma}» tugmasi va 3 ta karta — ${f.kartalar}.\nindex.html va style.css'ni alohida, to'liq yoz.`,
    ru: `Сделай промо-страницу для: ${f.mavzu}.\nСтиль ${tr(u.l).toLowerCase()}, основной цвет ${tr(r.l).toLowerCase()}.\nНа странице: крупный заголовок, кнопка «${f.tugma}» и 3 карточки — ${f.kartalar}.\nНапиши index.html и style.css отдельно и целиком.` };
};
const ScreenPrompt = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState(() => { const d = promoRead(); return { mavzu: d.mavzu || '', uslub: d.uslub || null, rang: d.rang || null, tugma: d.tugma || '', kartalar: d.kartalar || '' }; });
  const [saqlangan, setSaqlangan] = useState(() => !!promoRead().saqlangan);
  const [yigil, setYigil] = useState(() => !!promoRead().saqlangan);
  const yoz = (k, v) => { setF(n => ({ ...n, [k]: v })); promoWrite({ [k]: v }); };
  const toliq = f.mavzu.trim().length >= 3 && !!f.uslub && !!f.rang && f.tugma.trim().length >= 2 && f.kartalar.trim().length >= 3;
  const saqla = () => { if (!toliq) return; promoWrite({ saqlangan: true }); setSaqlangan(true); setYigil(true); };
  const matn = toliq && saqlangan ? tr(a1Prompt({ ...f, mavzu: f.mavzu.trim(), tugma: f.tugma.trim(), kartalar: f.kartalar.trim() })) : null;
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 1 · 4 qism', ru: 'Практика 1 · 4 части' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Promo sahifangizni bitta aniq prompt bilan quring.', ru: 'Постройте промо-страницу одним точным промптом.' })}</h2></div>
        <Split>
          <Col>
            {!yigil && <div className="am-karta fade-up delay-1">
              <label className="am-maydon"><span>{tr({ uz: '1 · Mavzu — kim uchun, nima', ru: '1 · Тема — для кого, что' })}</span><input className="am-input" value={f.mavzu} placeholder={tr({ uz: 'masalan: Maktab futbol turniri', ru: 'например: Школьный футбольный турнир' })} onChange={e => yoz('mavzu', e.target.value)} /></label>
              <div className="am-chips">{PM_MISOL.map((m, i) => <button key={i} type="button" className="am-chip" onClick={() => yoz('mavzu', tr(m))}>{tr(m)}</button>)}</div>
              <div className="am-maydon"><span>{tr({ uz: '2 · Uslub', ru: '2 · Стиль' })}</span><div className="am-chips">{PM_USLUB.map(u => <button key={u.id} type="button" className={`am-chip ${f.uslub === u.id ? 'on' : ''}`} aria-pressed={f.uslub === u.id} onClick={() => yoz('uslub', u.id)}>{tr(u.l)}</button>)}</div></div>
              <div className="am-maydon"><span>{tr({ uz: '3 · Rang', ru: '3 · Цвет' })}</span><div className="am-chips">{PM_RANG.map(r => <button key={r.id} type="button" className={`am-chip ${f.rang === r.id ? 'on' : ''}`} aria-pressed={f.rang === r.id} onClick={() => yoz('rang', r.id)}><i className="am-chip-rang" style={{ background: r.c }} />{tr(r.l)}</button>)}</div></div>
              <label className="am-maydon"><span>{tr({ uz: "4 · Bo'limlar — tugma yozuvi", ru: '4 · Разделы — надпись кнопки' })}</span><input className="am-input" value={f.tugma} placeholder={tr({ uz: "masalan: Ro'yxatdan o'tish", ru: 'например: Записаться' })} onChange={e => yoz('tugma', e.target.value)} /></label>
              <label className="am-maydon"><span>{tr({ uz: "3 ta karta — vergul bilan", ru: '3 карточки — через запятую' })}</span><input className="am-input" value={f.kartalar} placeholder={tr({ uz: 'masalan: sana, joy, sovrin', ru: 'например: дата, место, приз' })} onChange={e => yoz('kartalar', e.target.value)} /></label>
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: "4 qismni to'ldiring", ru: 'Заполните 4 части' })}</button>
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Sizning 4 qismingiz', ru: 'Ваши 4 части' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-loyiha-nom">{f.mavzu}</p>
              <p className="am-satr">{tr(PM_USLUB.find(x => x.id === f.uslub).l)} · {tr(PM_RANG.find(x => x.id === f.rang).l)} · «{f.tugma}» · {f.kartalar}</p>
            </div>}
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: 'Prompt tayyor — endi Gemini orqali quring.', ru: 'Промпт готов — теперь стройте с помощью Gemini.' }} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Natija · yozganingizdan quriladi", ru: 'Результат · строится из вашего текста' })}</p>
            <PromoMaket f={f} />
            <p className="small am-osti">{tr({ uz: "Qaysi qism yetishmasa, sahifada «?» bo'lib turadi — AI uni o'zi to'ldiradi.", ru: 'Если какой-то части нет, на странице стоит «?» — AI заполнит её сам.' })}</p>
            <QadamTugma b={A1} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — iteratsiya (pilot «Yaxshilash» shakli): bitta kamchilik → aniq so'rov; kamida ikki marta =====
const TEKSHIR = [
  { uz: 'Sarlavha mavzuingizni aytyaptimi?', ru: 'Заголовок говорит о вашей теме?' },
  { uz: "Tugma ko'zga tashlanadimi?", ru: 'Кнопка заметна?' },
  { uz: '3 karta bir qatordami?', ru: '3 карточки в один ряд?' },
  { uz: 'Rang hamma joyda bir xilmi?', ru: 'Цвет везде одинаковый?' },
  { uz: "Oynani toraytiring: telefonda sig'adimi?", ru: 'Сузьте окно: помещается на телефоне?' }
];
const YAX_QADAM = {
  qadamlar: [
    { uz: "Ro'yxat bo'yicha sahifangizga qarang va bitta kamchilikni tanlang.", ru: 'Проверьте страницу по списку и выберите один недочёт.' },
    { uz: "Uni aniq yozing: «rang» emas — «tugma rangi to'q yashil bo'lsin».", ru: 'Опишите точно: не «цвет», а «пусть кнопка будет тёмно-зелёной».' },
    { uz: "«Promptni nusxalash» → Gemini'ga yuboring, javobdagi kodni faylga qo'ying, `Ctrl+S`.", ru: '«Скопировать промпт» → отправьте в Gemini, вставьте код из ответа в файл, `Ctrl+S`.' },
    { uz: '«Keyingi kamchilik» — va yana. Kamida ikki marta.', ru: '«Следующий недочёт» — и снова. Минимум два раза.' }
  ]
};
const YAX_MAYDON = [
  { k: 'yoqmadi', l: { uz: 'Nima yoqmadi?', ru: 'Что не нравится?' }, ph: { uz: 'masalan: tugma juda kichik', ru: 'например: кнопка слишком маленькая' } },
  { k: 'qanday', l: { uz: "Qanday bo'lsin?", ru: 'Как должно быть?' }, ph: { uz: "masalan: kattaroq va to'q yashil bo'lsin", ru: 'например: побольше и тёмно-зелёная' } }
];
const ScreenIteratsiya = ({ screen, onNext, onPrev }) => {
  const [f, setF] = useState({ yoqmadi: '', qanday: '' });
  const [soni, setSoni] = useState(() => promoRead().yaxshi || 0);
  const tayyor = YAX_MAYDON.every(m => f[m.k].trim().length >= 3);
  const keyingi = () => { const n = soni + 1; setSoni(n); promoWrite({ yaxshi: n }); setF({ yoqmadi: '', qanday: '' }); };
  const matn = tayyor ? tr({ uz: `Sahifamni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma.\nYoqmagani: ${f.yoqmadi.trim()}.\nQanday bo'lsin: ${f.qanday.trim()}.\nO'zgargan faylni to'liq qaytar.\nMana kodim: {index.html va style.css kodini shu yerga qo'ying}`, ru: `Улучши мою страницу — меняй только это место, остальное не трогай.\nНе нравится: ${f.yoqmadi.trim()}.\nКак должно быть: ${f.qanday.trim()}.\nВерни изменённый файл целиком.\nВот мой код: {вставьте сюда код index.html и style.css}` }) : null;
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 2 · iteratsiya', ru: 'Практика 2 · итерация' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Natijani aniq so'rab yaxshilang.", ru: 'Улучшите результат точными запросами.' })}</h2></div>
        <Mentor>{tr({ uz: <>Birinchi natija kamdan-kam mukammal bo'ladi. Bitta so'rov — <b style={{ color: T.ink }}>bitta o'zgarish</b>: shunda AI nimani o'zgartirganini darrov ko'rasiz.</>, ru: <>Первый результат редко бывает идеальным. Один запрос — <b style={{ color: T.ink }}>одно изменение</b>: так сразу видно, что изменил AI.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Bitta kamchilik', ru: 'Один недочёт' })}</p>{soni > 0 && <span className="am-soni">{tr({ uz: `Yaxshilandi: ${soni}`, ru: `Улучшено: ${soni}` })}</span>}</div>
              {YAX_MAYDON.map((m, i) => <label key={m.k} className="am-maydon"><span>{tr(m.l)}</span><input className="am-input" value={f[m.k]} placeholder={tr(m.ph)} autoFocus={i === 0} onChange={e => setF({ ...f, [m.k]: e.target.value })} /></label>)}
            </div>
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: "Prompt tayyor — Gemini'ga yuboring.", ru: 'Промпт готов — отправьте в Gemini.' }} /></div>}
            {matn && <button type="button" className="am-saqla am-ochil" onClick={keyingi}>{tr({ uz: 'Keyingi kamchilik', ru: 'Следующий недочёт' })}</button>}
          </Col>
          <Col>
            <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: 'Sahifangizni tekshiring', ru: 'Проверьте страницу' })}</p>
              <ul className="am-band">{TEKSHIR.map((x, i) => <li key={i}>{tr(x)}</li>)}</ul>
            </div>
            <Qadamlar b={YAX_QADAM} cls="fade-up delay-2" />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a3 — Copilot bilan yangi bo'lim =====
const A3_IZOH = "<!-- qoidalar bo'limi: sarlavha va 3 bandli ro'yxat -->";
const A3 = {
  qadamlar: [
    { uz: "`index.html` da kartalardan keyin izohni qo'ying va `Enter` bosing.", ru: 'В `index.html` после карточек вставьте комментарий и нажмите `Enter`.' },
    { uz: "Kulrang taklif chiqadi — o'qing, to'g'ri bo'lsa `Tab` bilan qabul qiling.", ru: 'Появится серая подсказка — прочитайте, если верно, примите клавишей `Tab`.' },
    { uz: "`Ctrl+S` — brauzerda tekshiring. Qoidalar sizning mavzuingizga mos bo'lmasa, o'zingiz tuzating.", ru: '`Ctrl+S` — проверьте в браузере. Если правила не подходят к вашей теме — исправьте сами.' }
  ]
};
const ScreenBolim = ({ screen, onNext, onPrev }) => {
  const f = promoRead();
  const fx = f.mavzu && f.uslub && f.rang ? f : PROMO_NAMUNA;
  return (
    <Stage eyebrow={{ uz: 'Amaliyot 3 · Copilot', ru: 'Практика 3 · Copilot' }} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Copilot bilan sahifaga yangi bo'lim qo'shing.", ru: 'Добавьте раздел на страницу с Copilot.' })}</h2></div>
        <Mentor>{tr({ uz: <>Izoh yozasiz — bo'limni Copilot taklif qiladi. Taklifni qabul qilish yoki o'zgartirish — <b style={{ color: T.ink }}>sizning</b> qaroringiz.</>, ru: <>Пишете комментарий — раздел предлагает Copilot. Принять или изменить — решаете <b style={{ color: T.ink }}>вы</b>.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1"><KodNusxa yorliq={{ uz: 'index.html ga — kartalardan keyin', ru: 'в index.html — после карточек' }} kod={A3_IZOH} /></div>
            <Qadamlar b={A3} cls="fade-up delay-2" />
            <details className="am-yordam"><summary>{tr({ uz: 'Taklif chiqmadimi?', ru: 'Подсказка не появилась?' })}</summary><p>{tr({ uz: "Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — pastki chiziqdagi Copilot belgisini tekshiring yoki shu izohni Gemini'ga yuboring.", ru: 'Нажмите Enter после комментария ещё раз. Если нет — проверьте значок Copilot в нижней строке или отправьте комментарий в Gemini.' })}</p></details>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: "Kutilgan natija · «Qoidalar» bo'limi", ru: 'Ожидаемый результат · раздел «Правила»' })}</p>
            <PromoMaket f={fx} qoidalar />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

"""
cut("// ===== SCREEN 1 — REJA =====", "// ===== SCREEN 7 — TEST 2 =====", NEW)
cut("// ===== SCREEN 8 — ITERATSIYA =====", "// ===== SCREEN 16 — YAKUN =====", "")

# ---------- 6. Test (s7): variantlar teng uzunlikda, «4 qism» ----------
a = s.index("const Screen7 = (props) => (")
b = s.index("\n);\n", a) + 4
s = s[:a] + """const Screen7 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={{ uz: 'Topshirish', ru: 'Сдача' }}
    questionText="O'yin promo sahifasi uchun qaysi so'rov eng aniq?"
    question={<h2 className="title h-ask">{tr({ uz: <>O'yin promo sahifasi uchun qaysi so'rov <span className="italic" style={{ color: T.accent }}>eng aniq</span>?</>, ru: <>Какой запрос для промо-страницы игры <span className="italic" style={{ color: T.accent }}>самый точный</span>?</> })}</h2>}
    options={[tr({ uz: '«Menga biror sayt qilib ber, chiroyli bo\\'lsin»', ru: '«Сделай мне какой-нибудь сайт, чтобы красиво»' }), tr({ uz: "«Ko'k, zamonaviy o'yin sahifasi: tugma va 3 karta»", ru: '«Синяя современная страница игры: кнопка и 3 карточки»' }), tr({ uz: '«Chiroyli, zamonaviy va yorqin sahifa qilib ber»', ru: '«Сделай красивую, современную и яркую страницу»' }), tr({ uz: "«O'yin haqida sahifa kerak, hammasini o'zing tanla»", ru: '«Нужна страница про игру, всё выбери сам»' })]} correctIdx={1}
    explainCorrect={tr({ uz: "Unda to'rt qism bor: mavzu, uslub, rang va bo'limlar.", ru: 'В нём все четыре части: тема, стиль, цвет и разделы.' })}
    explainWrong={{
      0: tr({ uz: 'Mavzu ham, rang ham aytilmagan.', ru: 'Не названы ни тема, ни цвет.' }),
      2: tr({ uz: "Uslub bor, lekin mavzu va bo'limlar yo'q.", ru: 'Стиль есть, а темы и разделов нет.' }),
      3: tr({ uz: 'Tanlovni AI\\'ga berdingiz — natija tasodifiy.', ru: 'Вы отдали выбор AI — результат случайный.' }),
      default: tr({ uz: "4 qismni eslang: qaysi so'rovda hammasi bor?", ru: 'Вспомните 4 части: в каком запросе есть все?' })
    }} />
);
""" + s[b:]

# ---------- 7. Viktorina, yakun: «ingredient»/«stil» → «qism»/«uslub» ----------
for o, n in [("Yaxshi promptning 4 ingredienti qaysi?", "Yaxshi promptning 4 qismi qaysi?"), ("4 ингредиента хорошего промпта?", '4 части хорошего промпта?'),
             ("'Mavzu, stil, rang, qismlar', ru: 'Тема, стиль, цвет, части'", "\"Mavzu, uslub, rang, bo'limlar\", ru: 'Тема, стиль, цвет, разделы'"),
             ("Promptdagi «stil» ingredienti nimani belgilaydi?", "Promptdagi «uslub» qismi nimani belgilaydi?"), ("Что задаёт ингредиент «стиль» в промпте?", 'Что задаёт часть «стиль» в промпте?'),
             ("Qaysi qismlar bo'lishi", "Qaysi bo'limlar bo'lishi"), ("Какие будут части", 'Какие будут разделы'),
             ("'4 ingredientli, aniq va yaxshi', ru: 'Из 4 ингредиентов, точный и хороший'", "'4 qismli, aniq va yaxshi', ru: 'Из 4 частей, точный и хороший'")]:
    rep(o, n)
s = re.sub(r"  const RECAP = \[tr\(\{ uz: \"AI tezlik beradi[^\n]*\];", """  const RECAP = [tr({ uz: "AI tezlik beradi — sifatni siz ta'minlaysiz", ru: 'AI даёт скорость — качество обеспечиваете вы' }), tr({ uz: "Yaxshi prompt = 4 qism: mavzu, uslub, rang, bo'limlar", ru: 'Хороший промпт = 4 части: тема, стиль, цвет, разделы' }), tr({ uz: "Iteratsiya — bitta so'rov, bitta o'zgarish", ru: 'Итерация — один запрос, одно изменение' }), tr({ uz: "Copilot taklifini o'qib, keyin qabul qilasiz", ru: 'Подсказку Copilot сначала читаете, потом принимаете' })];""", s, count=1)
s = re.sub(r"  const HOMEWORK = \[\{ b: tr\(\{ uz: \"Antigravity'da\"[^\n]*\];", """  const HOMEWORK = [{ b: tr({ uz: 'Ikkinchi promo sahifa', ru: 'Вторая промо-страница' }), t: tr({ uz: "— boshqa mavzuga 4 qismli prompt bilan yangi sahifa quring", ru: '— постройте новую страницу на другую тему промптом из 4 частей' }) }, { b: tr({ uz: 'Ikki marta yaxshilang', ru: 'Улучшите дважды' }), t: tr({ uz: "— har safar bitta aniq so'rov bilan", ru: '— каждый раз одним точным запросом' }) }, { b: tr({ uz: "Netlify'ga chiqaring", ru: 'Выложите на Netlify' }), t: tr({ uz: '— papkani tashlang va havolani platformadagi vazifa-savoliga yuboring', ru: '— перетащите папку и отправьте ссылку в задание на платформе' }) }];""", s, count=1)
assert "Antigravity'da" not in s

# ---------- 8. Root ----------
rep("  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen13, Screen12, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];",
    "  const screens = [Screen0, Screen1, ScreenPrompt, ScreenIteratsiya, ScreenBolim, Screen7, ScreenPodium, Screen16];")
rep("              <Current screen={screen} storedAnswer=", "              <Current key={screen} screen={screen} storedAnswer=")
open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()), 'qator')

# ---------- 9. Nishon blokda + CSS (f336 davomi) ----------
s = open(P, encoding='utf-8').read()
def rep2(o, n):
    global s
    c = s.count(o); assert c == 1, f'{c}× : {o[:80]!r}'; s = s.replace(o, n)
rep2("  const next = () => setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });",
     "  const next = () => {\n    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-336: blok «Davom etish»da nishon\n    if (blokAch && live.mode !== 'mentor') earn(blokAch);\n    setScreen(s => { let n = Math.min(s + 1, TOTAL_SCREENS - 1); if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1); return n; });\n  };")
amcss = blok(css, "        /* ===== F-1015-303/309 · praktika qolipi: amaliyot bloklari va DemoSahifa (izohda backtick yo'q) ===== */", "        .ds { border-radius: 12px;")
amcss = amcss.replace("        @media (max-width: 760px) { .am-reja .split > .col:last-child { order: -1; } }\n", "")
p1css = blok(p1, "        .am-tt { padding: 0; gap: 0; }", "        /* ===== F-1015-332 · jonli sayt namunasi")
p1qt = blok(p1, "        /* ===== F-1015-330 · qadamlar tugmasi (a2, a3) ===== */", "        .bb-dots { display: flex; gap: 5px; }")
p1ext = blok(p1, "        .am-kod { display: flex; flex-direction: column; gap: 6px; }", "      `}</style>")
PM = r"""        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        /* ===== F-1015-336 · promo maketi (o'quvchi yozganidan) va forma chiplari ===== */
        .am-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .am-chip { display: inline-flex; align-items: center; gap: 6px; font: 600 12.5px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.bg}; border: 1.5px solid ${T.line}; border-radius: 999px; padding: 6px 12px; cursor: pointer; }
        .am-chip:hover { border-color: ${T.ink2}; }
        .am-chip.on { border-color: ${T.ink}; background: ${T.paper}; box-shadow: 0 0 0 1.5px ${T.ink}; }
        .am-chip:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-chip-rang { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .am-qism-ro { display: flex; flex-wrap: wrap; gap: 8px; }
        .am-qism { display: inline-flex; align-items: center; gap: 8px; background: ${T.paper}; border-radius: 999px; padding: 7px 14px 7px 7px; font: 700 14px 'Manrope', sans-serif; color: ${T.ink}; box-shadow: 0 4px 12px -6px rgba(${T.shadowBase},0.16); }
        .am-qism b { width: 22px; height: 22px; border-radius: 50%; background: ${T.accent}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
        .pm-sayt { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); font-family: 'Manrope', Arial, sans-serif; }
        .pm-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .pm-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .pm-body { display: flex; flex-direction: column; gap: 10px; padding: 12px; background: #f8fafc; }
        .pm-hero { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 22px 18px; color: #fff; background: linear-gradient(135deg, var(--pm), color-mix(in srgb, var(--pm), #000 25%)); border-radius: 12px; transition: background 0.3s, border-radius 0.3s; }
        .pm-quvnoq .pm-hero { border-radius: 22px; background: radial-gradient(circle at 85% 20%, color-mix(in srgb, var(--pm), #fff 30%) 0 18%, transparent 19%), linear-gradient(135deg, var(--pm), color-mix(in srgb, var(--pm), #000 20%)); }
        .pm-sodda .pm-hero { background: #fff; color: #0f172a; border: 2px solid var(--pm); border-radius: 6px; }
        .pm-uslubsiz .pm-hero { border: 2px dashed #94a3b8; }
        .pm-rangsiz { background: #e2e8f0 !important; color: #0f172a !important; }
        .lesson-root .pm-h1 { margin: 0; font-size: 21px; font-weight: 800; line-height: 1.15; }
        .lesson-root .pm-p { margin: 0; font-size: 12px; opacity: 0.92; }
        .pm-tugma { background: #fff; color: var(--pm); font-size: 12px; font-weight: 800; padding: 7px 14px; border-radius: 999px; }
        .pm-sodda .pm-tugma { background: var(--pm); color: #fff; }
        .pm-quvnoq .pm-tugma { border-radius: 10px; }
        .pm-rangsiz .pm-tugma { background: #475569; color: #fff; }
        .pm-yoq { display: inline-flex; align-items: center; border: 1.5px dashed currentColor; border-radius: 8px; padding: 4px 10px; font-size: 12px; font-weight: 700; opacity: 0.85; }
        .pm-yoq-h { font-size: 16px; padding: 6px 12px; }
        .pm-izoh { font: 600 10.5px 'JetBrains Mono', monospace; background: rgba(15,23,42,0.75); color: #fff; padding: 2px 8px; border-radius: 6px; }
        .pm-kartalar { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
        .pm-karta { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 6px; font-size: 11.5px; font-weight: 700; color: #0f172a; overflow-wrap: anywhere; }
        .pm-karta i { width: 8px; height: 8px; border-radius: 50%; background: var(--pm); }
        .pm-quvnoq .pm-karta { border-radius: 16px; } .pm-sodda .pm-karta { border-radius: 4px; }
        .pm-karta-yoq { border-style: dashed; border-color: #94a3b8; color: #475569; font-size: 15px; }
        .pm-qoida { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; }
        .lesson-root .pm-h2 { margin: 0 0 4px; font-size: 13px; font-weight: 800; color: #0f172a; }
        .lesson-root .pm-qoida ul { margin: 0; padding-left: 18px; list-style: disc; font-size: 11.5px; color: #334155; line-height: 1.6; }
        .pm-ft { text-align: center; font-size: 10.5px; color: #475569; padding-top: 2px; }
"""
rep2("      `}</style>", amcss + p1qt + p1css + PM + p1ext + "      `}</style>")
open(P, 'w', encoding='utf-8').write(s)
print('OK2', len(s.splitlines()))
