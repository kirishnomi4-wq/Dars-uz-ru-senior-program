#!/usr/bin/env python3
# F-1015-340 · PracticeLesson3 (m2-11) 19 → 8 ekran: o'quvchi o'zi reja tuzadi (REJA.md), Gemini bilan 1-qadam (katalog), Copilot bilan +2 mahsulot.
import sys, re
R = sys.argv[1]
P = R + '/src/2-Modull/PracticeLesson3.jsx'
s = open(P, encoding='utf-8').read()
p2 = open(R + '/src/2-Modull/PracticeLesson2.jsx', encoding='utf-8').read()

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
rep("""// Mavzu: AI'ni ochishdan oldin rejalashtirish; bo'laklash (katta -> kichik qadam);
//        MVP (shart vs keyin); qadamlarni tartiblash; qadam -> buyruq; o'zakni AI bilan qurish.
// Loyiha: mini-do'kon — MVP o'zagi (mahsulotlar ro'yxati + narx). Savat/jami -> 4-dars.
// Asosiy xabar: "Avval bo'laklab rejalashtir, keyin AI'ni och. Siz — arxitektor."
// Tool: Antigravity (haqiqiy uyga vazifa muhiti).""",
"""// F-1015-340 (16.10, foydalanuvchi bilan sahifama-sahifa): 19 → 8 ekran. O'quvchi O'ZI mini-do'kon rejasini tuzadi (REJA.md: shart/keyin, poydevordan),
//        keyin faqat 1-qadamni quradi (gemini.google.com: mahsulotlar va narxlar) va Copilot bilan 2 mahsulot qo'shadi. Savat/jami -> 4-dars (o'sha papka).
// Asosiy xabar: "Avval bo'laklang, keyin AI'ni oching. Bitta qadam — bitta so'rov." Antigravity ishlatilmaydi (18+). Oldingi 19 ekranli: arxiv/F-1015-practice3-oldin/.""")

# ---------- 2. SCREEN_META ----------
cut("const SCREEN_META = [", "const TOTAL_SCREENS = SCREEN_META.length;",
"""const SCREEN_META = [
  { id: 's0',  type: 'hook',     template: 'custom',   scored: false, scope: 'hook' },
  { id: 's1',  type: 'rule',     template: 'custom',   scored: false, scope: null },
  { id: 'a1',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a2',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 'a3',  type: 'practice', template: 'custom',   scored: false, scope: null },
  { id: 's4',  type: 'test',     template: 'MCScreen', scored: true,  scope: 'final' }, // F-1015-340: yagona ballik (eski s4, kalit A saqlandi)
  { id: 's15b', type: 'stats',   template: 'custom',   scored: false, scope: null },
  { id: 's16', type: 'summary',  template: 'custom',   scored: false, scope: null }
];
""")

# ---------- 3. Recap (faqat s4 → indeks 5), kalitlar, nishonlar, podium ----------
rep("// Kalitlar — MCQ scored test ekranlarining indekslari (4, 7, 10; s15 — final drag, recap yo'q).",
    "// Kalitlar — MCQ scored test ekranining indeksi (F-1015-340: faqat s4 → 5).")
a = s.index("const RECAPS = {"); b = s.index("\n};\n", a)
seg = s[a:b]
i7 = seg.index("\n  // s7 — ")
seg = seg[:i7].rstrip() + "\n"
seg = seg.replace("  // s4 — \"MVP nima degani?\" → Eng kichik, lekin ishlaydigan versiya\n  4: {", "  // idx 5 — s4: \"MVP nima degani?\" → Eng kichik, lekin ishlaydigan versiya (F-1015-340: yagona ballik)\n  5: {", 1)
assert "  5: {" in seg and "  7: {" not in seg and "  10: {" not in seg
s = s[:a] + seg + s[b:]
rep("const INLINE_KEYS = { s4: 0, s7: 1, s10: 0, s15: 0 };", "const INLINE_KEYS = { s4: 0 }; // F-1015-340: s7, s10, s15 olindi")
rep("// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi). s15 = -1 (yakuniy amaliy).", "// Server-baholash javob kaliti (mentor darsni ochganda avto-yuklanadi).")
s = re.sub(r"const Q_LABELS = \{[^\n]*\};", "const Q_LABELS = { 5: { uz: 'MVP nima', ru: 'Что такое MVP' } };", s, count=1)
cut("const ACHIEVEMENTS = {", "// 🏅 151-qonun: amaliy topshiriq nishoni",
"""const ACHIEVEMENTS = {
  planner:   { icon: '🧭', name: 'Planner!',   desc: { uz: "Do'kon rejasini o'zingiz yozdingiz", ru: 'Вы сами написали план магазина' } },
  mvp:       { icon: '🎯', name: 'MVP!',       desc: { uz: "MVP'ning birinchi qadamini qurdingiz", ru: 'Вы построили первый шаг MVP' } },
  graduate:  { icon: '🏆', name: 'Level Up!',  desc: { uz: "Do'kon katalogini oxirigacha qurdingiz", ru: 'Вы достроили каталог магазина' } },
  architect: { icon: '📐', name: 'Architect!', desc: { uz: 'MVP nimaligini birinchi urinishda topdingiz', ru: 'Вы с первой попытки определили, что такое MVP' } },
};
// F-1015-340: blok nishonlari «Davom etish»da (bonus; isbot yo'q — ustoz ko'rib turadi); test nishoni — s4 (birinchi urinish)
const BLOK_ACH = { a1: 'planner', a2: 'mvp', a3: 'graduate' };
const ACH_TRIGGERS = { s4: 'architect' };

""")
rep("""  // 🏅 Yakuniy ekranga yetganda: bitiruvchi nishoni
  useEffect(() => { if (screen === TOTAL_SCREENS - 1) earn('graduate'); }, [screen]); // eslint-disable-line
""", """  // F-1015-340: «graduate» endi a3 blokida (BLOK_ACH) — yakuniy ekranda avtomatik berilmaydi
""")
rep("""  const next = () => setScreen(s => {
    let n = Math.min(s + 1, TOTAL_SCREENS - 1);
    if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
    return n;
  });""", """  const next = () => {
    const blokAch = BLOK_ACH[SCREEN_META[screen] && SCREEN_META[screen].id]; // F-1015-340: blok «Davom etish»da nishon
    if (blokAch && live.mode !== 'mentor') earn(blokAch);
    setScreen(s => {
      let n = Math.min(s + 1, TOTAL_SCREENS - 1);
      if (n === FLASH_IDX && flashHidden()) n = Math.min(n + 1, TOTAL_SCREENS - 1);
      return n;
    });
  };""")

# ---------- 4. Kirish: «agent» → «AI» ----------
_a = s.index("const Screen0 = "); _b = s.index("// ===== SCREEN 1 — REJA =====")
_seg = s[_a:_b]
assert _seg.count("tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' })") == 1 and _seg.count("tr({ uz: 'Agent quryapti…', ru: 'Агент строит…' })") == 1
_seg = _seg.replace("tr({ uz: 'Agentga yuborish', ru: 'Отправить агенту' })", "tr({ uz: \"AI'ga yuborish\", ru: 'Отправить AI' })").replace("tr({ uz: 'Agent quryapti…', ru: 'Агент строит…' })", "tr({ uz: 'AI quryapti…', ru: 'AI строит…' })")
s = s[:_a] + _seg + s[_b:]

# ---------- 5. Reja + amaliyot ekranlari ----------
tt = blok(p2, "// F-1015-334 (foydalanuvchi, A variant): «Avval tayyorlaning»", "const Screen1 = ({ screen, onNext, onPrev }) => (")
yord = blok(p2, "const PromptBlok = ({ matn, tayyor }) => {", "// ===== a1 — 4 qismli prompt")

NEW = r"""// ===== SCREEN 1 — REJA (F-1015-340): «Avval tayyorlaning ▾» + bugungi qoida + 3 blok =====
const TAYYOR = [
  { uz: <>Ish stolida <span className="qcode">mini-dokon</span> papkasini yarating va VS Code'da oching; ichida <span className="qcode">REJA.md</span>, <span className="qcode">index.html</span> va <span className="qcode">style.css</span>, Go Live.</>, ru: <>Создайте на рабочем столе папку <span className="qcode">mini-dokon</span> и откройте её в VS Code; внутри <span className="qcode">REJA.md</span>, <span className="qcode">index.html</span> и <span className="qcode">style.css</span>, Go Live.</> },
  { uz: "Boshqa oynada gemini.google.com'ni oching.", ru: 'В другом окне откройте gemini.google.com.' },
  { uz: "Copilot yoqilganini tekshiring — VS Code pastki chizig'ida Copilot belgisi bor.", ru: 'Проверьте, что Copilot включён — в нижней строке VS Code есть значок Copilot.' }
];
const REJA_BLOK = [
  { t: { uz: 'Reja', ru: 'План' }, tag: { uz: "o'zingiz · REJA.md", ru: 'сами · REJA.md' } },
  { t: { uz: 'Mahsulotlar va narx', ru: 'Товары и цены' }, tag: 'Gemini' },
  { t: { uz: 'Yana 2 mahsulot', ru: 'Ещё 2 товара' }, tag: 'Copilot' }
];
""" + tt + r"""const Screen1 = ({ screen, onNext, onPrev }) => (
  <Stage eyebrow={tr({ uz: 'Reja', ru: 'План' })} screen={screen} mentorStatic navContent={<><NavBack onPrev={onPrev} /><NavNext label={{ uz: 'Boshlaymiz', ru: 'Начинаем' }} onClick={onNext} /></>}>
    <div className="screen" style={{ gap: 'clamp(14px,2.4vw,20px)' }}>
      <div className="head"><h2 className="title h-title fade-up">{tr({ uz: <>Do'konni qaysi <span className="italic" style={{ color: T.accent }}>qadamdan</span> boshlaysiz?</>, ru: <>С какого <span className="italic" style={{ color: T.accent }}>шага</span> начнёте магазин?</> })}</h2></div>
      <Mentor>{tr({ uz: <>Bugun maktab mini-do'konini qurasiz. AI'ni darrov ochmaymiz: avval <b style={{ color: T.ink }}>reja</b> tuzasiz, keyin faqat birinchi qadamni qurasiz.</>, ru: <>Сегодня строите школьный мини-магазин. AI сразу не открываем: сначала составите <b style={{ color: T.ink }}>план</b>, потом построите только первый шаг.</> })}</Mentor>
      <TayyorTugma />
      <Split>
        <Col>
          <p className="flow-label">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <DokonMaket nom={tr(DK_NOM)} items={[...DK_MAHSULOT, ...DK_QOSHIMCHA].map(x => ({ n: tr(x.n), p: x.p }))} />
        </Col>
        <Col>
          <p className="flow-label am-yorliq-joy" aria-hidden="true">{tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}</p>
          <div className="am-karta am-reja-k fade-up delay-1">
            <p className="flow-label">{tr({ uz: 'Bugungi qoida', ru: 'Правило дня' })}</p>
            <p className="am-qoida-m">{tr({ uz: <>Avval <span style={{ color: T.accent, fontStyle: 'italic' }}>bo'laklang</span>, keyin AI'ni oching.</>, ru: <>Сначала <span style={{ color: T.accent, fontStyle: 'italic' }}>разбейте</span>, потом открывайте AI.</> })}</p>
            <hr className="am-chiziq" />
            <p className="flow-label">{tr({ uz: `Bugungi ${REJA_BLOK.length} blok`, ru: `${REJA_BLOK.length} блока сегодня` })}</p>
            <ol className="am-blok-qator">{REJA_BLOK.map((b, i) => <li key={i}><span className="am-blok-n">{String(i + 1).padStart(2, '0')}</span><b>{tr(b.t)}</b><span className="am-blok-teg">{tr(b.tag)}</span></li>)}</ol>
          </div>
        </Col>
      </Split>
    </div>
  </Stage>
);

// ===== Bitta ip — o'quvchining mini-do'koni: REJA.md (a1) va katalog (a2, a3) yozganidan jonli quriladi =====
const DOKON_KEY = 'ccDokon';
const dkRead = () => { try { const v = JSON.parse(localStorage.getItem(DOKON_KEY) || 'null'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } };
const dkWrite = (patch) => { try { localStorage.setItem(DOKON_KEY, JSON.stringify({ ...dkRead(), ...patch, savedAt: Date.now() })); } catch { /* saqlab bo'lmadi */ } };
const DK_NOM = { uz: "Maktab mini-do'koni", ru: 'Школьный мини-магазин' };
const REJA_NAMUNA = [
  { uz: 'Mahsulotlar va narxlar', ru: 'Товары и цены' }, { uz: "Savatga qo'shish", ru: 'Добавление в корзину' }, { uz: 'Jami narx', ru: 'Итоговая сумма' },
  { uz: 'Qidiruv', ru: 'Поиск' }, { uz: 'Sharhlar', ru: 'Отзывы' }, { uz: 'Login', ru: 'Логин' }
];
const DK_MAHSULOT = [
  { n: { uz: 'Ruchka', ru: 'Ручка' }, p: '3 000' }, { n: { uz: 'Kitob', ru: 'Книга' }, p: '35 000' },
  { n: { uz: 'Sumka', ru: 'Рюкзак' }, p: '90 000' }, { n: { uz: "Chizg'ich", ru: 'Линейка' }, p: '4 000' }
];
const DK_QOSHIMCHA = [{ n: { uz: 'Sharbat', ru: 'Сок' }, p: '6 000' }, { n: { uz: 'Bulochka', ru: 'Булочка' }, p: '4 000' }];
const narxToza = (p) => (p || '').replace(/\s*(so'm|сум)\s*$/i, '').trim();
const DokonMaket = ({ nom, items, yangi = 0 }) => (
  <div className={`dk-sayt ${items.length > 4 ? 'dk-6' : ''}`}>
    <div className="dk-bar"><span className="bb-dots"><i /><i /><i /></span><span className="dk-url">mini-dokon · Live Server</span></div>
    <div className="dk-body">
      <p className="dk-h1">{nom && nom.trim() ? nom.trim() : <span className="dk-yoq">? {tr({ uz: "do'kon nomi", ru: 'название магазина' })}</span>}</p>
      <div className="dk-grid">{items.map((x, i) => (
        <div key={i} className={`dk-karta ${i >= items.length - yangi ? 'dk-yangi' : ''}`}>
          {i >= items.length - yangi && <span className="dk-teg">Copilot</span>}
          <span className="dk-rasm" />
          {x.n && x.n.trim() ? <b>{x.n.trim()}</b> : <span className="dk-yoq">? {tr({ uz: 'nomi', ru: 'название' })}</span>}
          {narxToza(x.p) ? <span className="dk-narx">{narxToza(x.p)} {tr({ uz: "so'm", ru: 'сум' })}</span> : <span className="dk-yoq">? {tr({ uz: 'narx', ru: 'цена' })}</span>}
        </div>
      ))}</div>
    </div>
  </div>
);
const rejaQism = (rows) => {
  const yoz = rows.filter(r => r.t.trim());
  return { shart: yoz.filter(r => r.b === 'shart'), keyin: yoz.filter(r => r.b === 'keyin'), belgisiz: yoz.filter(r => !r.b) };
};
const rejaMatn = (rows) => {
  const q = rejaQism(rows);
  return tr({ uz: `# Mini-do'kon — reja\n\n## Shart (MVP)\n${q.shart.map((r, i) => `${i + 1}. ${r.t.trim()}`).join('\n')}\n\n## Keyin\n${q.keyin.map(r => `- ${r.t.trim()}`).join('\n')}\n`,
    ru: `# Мини-магазин — план\n\n## Нужно (MVP)\n${q.shart.map((r, i) => `${i + 1}. ${r.t.trim()}`).join('\n')}\n\n## Потом\n${q.keyin.map(r => `- ${r.t.trim()}`).join('\n')}\n` });
};
// REJA.md — VS Code oynasi ko'rinishida; hali yozilmagan joy — «?»
const RejaMaket = ({ rows }) => {
  const q = rejaQism(rows);
  const yoq = <div className="rj-li rj-yoq">?</div>;
  return (
    <div className="rj-oyna">
      <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">REJA.md</span></div>
      <div className="rj-body">
        <div className="rj-h1">{tr({ uz: "# Mini-do'kon — reja", ru: '# Мини-магазин — план' })}</div>
        <div className="rj-h2">{tr({ uz: '## Shart (MVP)', ru: '## Нужно (MVP)' })}</div>
        {q.shart.length ? q.shart.map((r, i) => <div key={i} className="rj-li">{i + 1}. {r.t.trim()}</div>) : yoq}
        <div className="rj-h2">{tr({ uz: '## Keyin', ru: '## Потом' })}</div>
        {q.keyin.length ? q.keyin.map((r, i) => <div key={i} className="rj-li">- {r.t.trim()}</div>) : yoq}
        {q.belgisiz.length > 0 && <><div className="rj-h2 rj-yoq">{tr({ uz: "## ? belgi qo'yilmagan", ru: '## ? без отметки' })}</div>{q.belgisiz.map((r, i) => <div key={i} className="rj-li rj-yoq">- {r.t.trim()}</div>)}</>}
      </div>
    </div>
  );
};

""" + yord + r"""
// ===== a1 — reja (AI'siz): qadamlar → shart/keyin → tartib → REJA.md =====
const A1 = {
  qadamlar: [
    { uz: "Do'kon uchun qadamlarni yozing — kamida 4 ta, har biri bitta ish.", ru: 'Запишите шаги для магазина — минимум 4, каждый — одно дело.' },
    { uz: "Har qadamga belgi qo'ying: «Shart» yoki «Keyin».", ru: 'Отметьте каждый шаг: «Нужно» или «Потом».' },
    { uz: "«Shart» qadamlarni ↑ bilan tartiblang — poydevor tepada tursin.", ru: 'Расставьте шаги «Нужно» кнопкой ↑ — фундамент сверху.' },
    { uz: "«Saqlash» → «Nusxalash» → `REJA.md` ga qo'ying, `Ctrl+S`.", ru: '«Сохранить» → «Скопировать» → вставьте в `REJA.md`, `Ctrl+S`.' }
  ]
};
const BOSH_REJA = () => Array.from({ length: 6 }, () => ({ t: '', b: null }));
const ScreenReja = ({ screen, onNext, onPrev }) => {
  const [rows, setRows] = useState(() => { const d = dkRead().reja; return Array.isArray(d) && d.length === 6 ? d.map(r => ({ t: r.t || '', b: r.b || null })) : BOSH_REJA(); });
  const [saqlangan, setSaqlangan] = useState(() => !!dkRead().rejaSaqlangan);
  const [yigil, setYigil] = useState(() => !!dkRead().rejaSaqlangan);
  const ozgar = (fn) => setRows(o => { const n = fn(o.map(r => ({ ...r }))); dkWrite({ reja: n }); return n; });
  const q = rejaQism(rows);
  const toliq = rows.filter(r => r.t.trim().length >= 2).length >= 4 && q.belgisiz.length === 0 && q.shart.length > 0 && q.keyin.length > 0;
  const saqla = () => { if (!toliq) return; dkWrite({ rejaSaqlangan: true }); setSaqlangan(true); setYigil(true); };
  return (
    <Stage eyebrow={tr({ uz: "Amaliyot 1 · AI'siz", ru: 'Практика 1 · без AI' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Do'konni qadamlarga bo'lib, rejani yozing.", ru: 'Разбейте магазин на шаги и напишите план.' })}</h2></div>
        <Mentor>{tr({ uz: <><b style={{ color: T.ink }}>Shart</b> — do'kon busiz ishlamaydi. <b style={{ color: T.ink }}>Keyin</b> — foydali, lekin kutsa bo'ladi. Faqat «shart» qadamlar — bu <b style={{ color: T.ink }}>MVP</b>: eng kichik, lekin ishlaydigan do'kon.</>, ru: <><b style={{ color: T.ink }}>Нужно</b> — без этого магазин не работает. <b style={{ color: T.ink }}>Потом</b> — полезно, но может подождать. Только шаги «нужно» — это <b style={{ color: T.ink }}>MVP</b>: самый маленький, но работающий магазин.</> })}</Mentor>
        <Split>
          <Col>
            {!yigil && <div className="am-karta fade-up delay-1">
              <p className="flow-label">{tr({ uz: "Do'kon qadamlari", ru: 'Шаги магазина' })}</p>
              {rows.map((r, i) => (
                <div key={i} className="rj-qator">
                  <span className="am-qn">{i + 1}</span>
                  <input className="am-input" value={r.t} placeholder={tr({ uz: `masalan: ${REJA_NAMUNA[i].uz}`, ru: `например: ${REJA_NAMUNA[i].ru}` })} onChange={e => { const v = e.target.value; ozgar(n => { n[i].t = v; return n; }); }} />
                  <div className="am-chips">
                    <button type="button" className={`am-chip rj-shart ${r.b === 'shart' ? 'on' : ''}`} aria-pressed={r.b === 'shart'} onClick={() => ozgar(n => { n[i].b = 'shart'; return n; })}>{tr({ uz: 'Shart', ru: 'Нужно' })}</button>
                    <button type="button" className={`am-chip ${r.b === 'keyin' ? 'on' : ''}`} aria-pressed={r.b === 'keyin'} onClick={() => ozgar(n => { n[i].b = 'keyin'; return n; })}>{tr({ uz: 'Keyin', ru: 'Потом' })}</button>
                  </div>
                  <button type="button" className="rj-up" disabled={i === 0} aria-label={tr({ uz: 'Yuqoriga', ru: 'Вверх' })} onClick={() => ozgar(n => { [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })}>↑</button>
                </div>
              ))}
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: 'Kamida 4 qadam va har biriga belgi', ru: 'Минимум 4 шага и отметка у каждого' })}</button>
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Sizning rejangiz', ru: 'Ваш план' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-satr">{tr({ uz: `Shart: ${q.shart.length} · Keyin: ${q.keyin.length}`, ru: `Нужно: ${q.shart.length} · Потом: ${q.keyin.length}` })}</p>
            </div>}
            {toliq && saqlangan && <div className="am-karta am-ochil">
              <p className="am-tayyor-ok">{tr({ uz: "Reja tayyor — uni REJA.md ga qo'ying.", ru: 'План готов — вставьте его в REJA.md.' })}</p>
              <KodNusxa yorliq={{ uz: 'REJA.md ga', ru: 'в REJA.md' }} kod={rejaMatn(rows)} />
            </div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'REJA.md · yozganingizdan quriladi', ru: 'REJA.md · строится из вашего текста' })}</p>
            <RejaMaket rows={rows} />
            <QadamTugma b={A1} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a2 — 1-qadam (Gemini): faqat mahsulotlar va narxlar, savatsiz =====
const A2 = {
  qadamlar: [
    { uz: "Do'kon nomi va 4 mahsulotni yozing → «Saqlash».", ru: 'Впишите название магазина и 4 товара → «Сохранить».' },
    { uz: "«Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring.", ru: '«Скопировать промпт» → вставьте в gemini.google.com и отправьте.' },
    { uz: "Javobdagi kodlarni `mini-dokon` papkasidagi `index.html` va `style.css` ga qo'ying, `Ctrl+S`.", ru: 'Вставьте код из ответа в `index.html` и `style.css` папки `mini-dokon`, `Ctrl+S`.' },
    { uz: "Live Server'da tekshiring: 4 karta, har birida narx bor, savat yo'q.", ru: 'Проверьте в Live Server: 4 карточки, у каждой цена, корзины нет.' }
  ]
};
const a2Prompt = (nom, m) => {
  const uz = m.map(x => `${x.n.trim()} — ${narxToza(x.p)} so'm`).join(', ');
  const ru = m.map(x => `${x.n.trim()} — ${narxToza(x.p)} сум`).join(', ');
  return { uz: `${nom} uchun sahifa yasa: 4 ta mahsulot — ${uz}.\nHar biri alohida kartada: nomi va narxi.\nHozircha faqat shu: savat va tugmalar qo'shma.\nindex.html va style.css'ni alohida, to'liq yoz.`,
    ru: `Сделай страницу для: ${nom}. 4 товара — ${ru}.\nКаждый в отдельной карточке: название и цена.\nПока только это: корзину и кнопки не добавляй.\nНапиши index.html и style.css отдельно и целиком.` };
};
const BOSH_KAT = () => Array.from({ length: 4 }, () => ({ n: '', p: '' }));
const ScreenKatalog = ({ screen, onNext, onPrev }) => {
  const [nom, setNom] = useState(() => dkRead().nom || '');
  const [m, setM] = useState(() => { const d = dkRead().mahsulot; return Array.isArray(d) && d.length === 4 ? d.map(x => ({ n: x.n || '', p: x.p || '' })) : BOSH_KAT(); });
  const [saqlangan, setSaqlangan] = useState(() => !!dkRead().katSaqlangan);
  const [yigil, setYigil] = useState(() => !!dkRead().katSaqlangan);
  const yozNom = (v) => { setNom(v); dkWrite({ nom: v }); };
  const yozM = (i, k, v) => setM(o => { const n = o.map(x => ({ ...x })); n[i][k] = v; dkWrite({ mahsulot: n }); return n; });
  const toliq = nom.trim().length >= 3 && m.every(x => x.n.trim().length >= 2 && /\d/.test(x.p));
  const saqla = () => { if (!toliq) return; dkWrite({ katSaqlangan: true }); setSaqlangan(true); setYigil(true); };
  const matn = toliq && saqlangan ? tr(a2Prompt(nom.trim(), m)) : null;
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 2 · Gemini', ru: 'Практика 2 · Gemini' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: 'Rejangizning faqat birinchi qadamini quring.', ru: 'Постройте только первый шаг своего плана.' })}</h2></div>
        <Mentor>{tr({ uz: <>Gemini'ga butun do'konni emas, faqat <b style={{ color: T.ink }}>mahsulotlar va narxlarni</b> berasiz. Bitta qadam — bitta so'rov: natijani rejangiz bilan solishtirish oson.</>, ru: <>Даёте Gemini не весь магазин, а только <b style={{ color: T.ink }}>товары и цены</b>. Один шаг — один запрос: результат легко сверить с планом.</> })}</Mentor>
        <Split>
          <Col>
            {!yigil && <div className="am-karta fade-up delay-1">
              <label className="am-maydon"><span>{tr({ uz: "Do'kon nomi", ru: 'Название магазина' })}</span><input className="am-input" value={nom} placeholder={tr({ uz: `masalan: ${DK_NOM.uz}`, ru: `например: ${DK_NOM.ru}` })} onChange={e => yozNom(e.target.value)} /></label>
              <div className="am-chips"><button type="button" className="am-chip" onClick={() => yozNom(tr(DK_NOM))}>{tr(DK_NOM)}</button></div>
              <div className="am-maydon"><span>{tr({ uz: '4 ta mahsulot — nomi va narxi', ru: '4 товара — название и цена' })}</span>
                {m.map((x, i) => (
                  <div key={i} className="rj-qator">
                    <span className="am-qn">{i + 1}</span>
                    <input className="am-input" value={x.n} placeholder={tr({ uz: `masalan: ${DK_MAHSULOT[i].n.uz}`, ru: `например: ${DK_MAHSULOT[i].n.ru}` })} onChange={e => yozM(i, 'n', e.target.value)} />
                    <input className="am-input dk-narx-in" inputMode="numeric" value={x.p} placeholder={DK_MAHSULOT[i].p} aria-label={tr({ uz: "Narxi, so'm", ru: 'Цена, сум' })} onChange={e => yozM(i, 'p', e.target.value)} />
                  </div>
                ))}
              </div>
              <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : { uz: "Nom va 4 mahsulotni to'ldiring", ru: 'Заполните название и 4 товара' })}</button>
            </div>}
            {yigil && <div className="am-karta am-ochil">
              <div className="am-prompt-h"><p className="flow-label">{tr({ uz: 'Sizning katalogingiz', ru: 'Ваш каталог' })}</p><button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button></div>
              <p className="am-loyiha-nom">{nom}</p>
              <p className="am-satr">{m.map(x => x.n.trim()).join(' · ')}</p>
            </div>}
            {matn && <div className="am-ochil"><PromptBlok matn={matn} tayyor={{ uz: "Prompt tayyor — Gemini'ga yuboring.", ru: 'Промпт готов — отправьте в Gemini.' }} /></div>}
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Natija · yozganingizdan quriladi', ru: 'Результат · строится из вашего текста' })}</p>
            <DokonMaket nom={nom} items={m} />
            <p className="small am-osti">{tr({ uz: "Savat hali yo'q — u rejangizdagi keyingi qadam.", ru: 'Корзины пока нет — это следующий шаг вашего плана.' })}</p>
            <QadamTugma b={A2} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

// ===== a3 — Copilot bilan yana 2 mahsulot =====
const A3_IZOH = { uz: "<!-- yana bitta mahsulot kartasi: Sharbat, 6 000 so'm -->", ru: '<!-- ещё одна карточка товара: Сок, 6 000 сум -->' };
const A3 = {
  qadamlar: [
    { uz: "`index.html` da oxirgi mahsulot kartasidan keyin izohni qo'ying va `Enter` bosing.", ru: 'В `index.html` после последней карточки товара вставьте комментарий и нажмите `Enter`.' },
    { uz: "Kulrang taklif chiqadi — o'qing, to'g'ri bo'lsa `Tab` bilan qabul qiling.", ru: 'Появится серая подсказка — прочитайте, если верно, примите клавишей `Tab`.' },
    { uz: "Ikkinchi mahsulot uchun izohni o'zingiz yozing: nomi va narxi bilan.", ru: 'Для второго товара напишите комментарий сами: с названием и ценой.' },
    { uz: "`Ctrl+S` — brauzerda 6 karta. `REJA.md` da 1-qadam yoniga ✓ qo'ying.", ru: '`Ctrl+S` — в браузере 6 карточек. В `REJA.md` поставьте ✓ рядом с шагом 1.' }
  ]
};
const ScreenCopilot = ({ screen, onNext, onPrev }) => {
  const d = dkRead();
  const ozi = Array.isArray(d.mahsulot) && d.mahsulot.every(x => x && x.n && x.n.trim() && /\d/.test(x.p || ''));
  const asos = ozi ? d.mahsulot : DK_MAHSULOT.map(x => ({ n: tr(x.n), p: x.p }));
  const nom = ozi && d.nom && d.nom.trim() ? d.nom : tr(DK_NOM);
  return (
    <Stage eyebrow={tr({ uz: 'Amaliyot 3 · Copilot', ru: 'Практика 3 · Copilot' })} screen={screen} navContent={<><NavBack onPrev={onPrev} /><NavNext optionalLive onClick={onNext} /></>}>
      <div className="screen" style={{ gap: 'clamp(12px,2vw,18px)' }}>
        <div className="head"><h2 className="title h-title fade-up">{tr({ uz: "Copilot bilan yana ikki mahsulot qo'shing.", ru: 'Добавьте ещё два товара с Copilot.' })}</h2></div>
        <Mentor>{tr({ uz: <>Copilot sahifangizdagi kartalarni ko'rib, xuddi shunday yangisini taklif qiladi. Nom va narxni <b style={{ color: T.ink }}>siz</b> berasiz.</>, ru: <>Copilot видит карточки на странице и предлагает такую же новую. Название и цену задаёте <b style={{ color: T.ink }}>вы</b>.</> })}</Mentor>
        <Split>
          <Col>
            <div className="am-karta fade-up delay-1"><KodNusxa yorliq={{ uz: "index.html ga — oxirgi kartadan keyin", ru: 'в index.html — после последней карточки' }} kod={tr(A3_IZOH)} /></div>
            <Qadamlar b={A3} cls="fade-up delay-2" />
            <details className="am-yordam"><summary>{tr({ uz: 'Taklif chiqmadimi?', ru: 'Подсказка не появилась?' })}</summary><p>{tr({ uz: "Izohdan keyin Enter'ni yana bir bosing. Baribir chiqmasa — pastki chiziqdagi Copilot belgisini tekshiring yoki shu izohni Gemini'ga yuboring.", ru: 'Нажмите Enter после комментария ещё раз. Если нет — проверьте значок Copilot в нижней строке или отправьте комментарий в Gemini.' })}</p></details>
          </Col>
          <Col>
            <p className="flow-label">{tr({ uz: 'Kutilgan natija · 6 mahsulot', ru: 'Ожидаемый результат · 6 товаров' })}</p>
            <DokonMaket nom={nom} items={[...asos, ...DK_QOSHIMCHA.map(x => ({ n: tr(x.n), p: x.p }))]} yangi={2} />
          </Col>
        </Split>
      </div>
    </Stage>
  );
};

"""
cut("// ===== SCREEN 1 — REJA =====", "// ===== SCREEN 4 — TEST 1 =====", NEW)
cut("// ===== SCREEN 5 — QADAMLARNI TARTIBLASH", "// ===== SCREEN 16 — YAKUN =====", "")

# ---------- 6. Test (s4): standart ko'rinish, kalit A saqlanadi ----------
a = s.index("const Screen4 = (props) => (")
b = s.index("\n);\n", a) + 4
s = s[:a] + """const Screen4 = (props) => (
  <QuestionScreen {...props} scope="final" eyebrow={tr({ uz: 'Topshirish', ru: 'Сдача' })}
    questionText={tr({ uz: 'MVP nima degani?', ru: 'Что означает MVP?' })}
    question={<h2 className="title h-ask">{tr({ uz: <><span className="mono" style={{ color: T.accent }}>MVP</span> nima degani?</>, ru: <>Что означает <span className="mono" style={{ color: T.accent }}>MVP</span>?</> })}</h2>}
    options={[tr({ uz: 'Eng kichik, lekin ishlaydigan versiya', ru: 'Самая маленькая, но работающая версия' }), tr({ uz: 'Eng chiroyli, jozibali dizayn', ru: 'Самый красивый, эффектный дизайн' }), tr({ uz: 'Eng qimmat, murakkab funksiya', ru: 'Самая дорогая, сложная функция' }), tr({ uz: 'Loyihaning oxirgi, tayyor varianti', ru: 'Последняя, готовая версия проекта' })]} correctIdx={0}
    explainCorrect={tr({ uz: "MVP — ishlaydigan birinchi versiya, qolgani keyin keladi.", ru: 'MVP — первая работающая версия, остальное добавят потом.' })}
    explainWrong={{
      1: tr({ uz: "Chiroyli dizayn keyin qo'shiladi, MVP'da u asosiy emas.", ru: 'Красивый дизайн добавят потом — в MVP он не главное.' }),
      2: tr({ uz: "Qimmat va murakkab funksiya MVP'ga kirmaydi.", ru: 'Дорогая и сложная функция в MVP не входит.' }),
      3: tr({ uz: "MVP oxirgi emas — undan keyin ham ko'p narsa qo'shiladi.", ru: 'MVP — не последняя версия, после неё добавляют ещё много.' }),
      default: tr({ uz: "Rejangizni eslang: «shart» qadamlar qanday do'kon berardi?", ru: 'Вспомните план: какой магазин дают шаги «нужно»?' })
    }} />
);
""" + s[b:]

# ---------- 7. Arena: olingan ekranlarga tayangan 3 savol (to'g'ri indeks o'zgarmaydi) ----------
def qrep(qstart, new):
    global s
    a = s.index("const QUIZ_BANK = [")
    i = s.index(qstart, a); j = s.index("\n", i)
    assert s.count(qstart) == 1
    s = s[:i] + new + s[j:]
qrep("  { q: { uz: \"Dasturchi loyihada kim rolini o'ynaydi?\"",
     """  { q: { uz: 'Rejani kim tuzadi?', ru: 'Кто составляет план?' }, opts: [{ uz: "Siz, AI'ni ochishdan oldin", ru: 'Вы, до того как открыть AI' }, { uz: "AI, birinchi so'rovdan keyin", ru: 'AI, после первого запроса' }, { uz: 'Copilot, kod yozayotganda', ru: 'Copilot, пока пишет код' }, { uz: 'Hech kim, reja shart emas', ru: 'Никто, план не нужен' }], correct: 0 },""")
qrep("  { q: { uz: 'Agent quryotganidan oldin nima qiladi?'",
     """  { q: { uz: "Gemini'ga qaysi qadamni berasiz?", ru: 'Какой шаг Вы дадите Gemini?' }, opts: [{ uz: "Butun do'konni birdaniga", ru: 'Весь магазин сразу' }, { uz: 'Rejadagi faqat birinchi qadamni', ru: 'Только первый шаг из плана' }, { uz: 'Eng chiroyli qadamni', ru: 'Самый красивый шаг' }, { uz: "Oxirgi, «keyin» qadamni", ru: 'Последний шаг из «потом»' }], correct: 1 },""")
qrep("  { q: { uz: 'Mashhur ilovalar qanday boshlangan?'",
     """  { q: { uz: "«Keyin» qadamlar qachon quriladi?", ru: 'Когда строятся шаги «потом»?' }, opts: [{ uz: 'Birinchi navbatda, hammasidan oldin', ru: 'В первую очередь, раньше всего' }, { uz: 'Hech qachon qurilmaydi', ru: 'Никогда не строятся' }, { uz: "Faqat dizayn tayyor bo'lganda", ru: 'Только когда готов дизайн' }, { uz: 'MVP ishlagandan keyin', ru: 'После того, как MVP заработает' }], correct: 3 },""")

# ---------- 8. Yakun ----------
s = re.sub(r"  const RECAP = \[tr\(\{ uz: \"Rejasiz boshlash[^\n]*\];", """  const RECAP = [tr({ uz: "Katta ishni AI'ga berishdan oldin qadamlarga bo'lasiz", ru: 'Перед тем как дать большую работу AI, разбиваете её на шаги' }), tr({ uz: "«Shart» (MVP) — busiz do'kon ishlamaydi; «keyin» — kutsa bo'ladi", ru: '«Нужно» (MVP) — без этого магазин не работает; «потом» — может подождать' }), tr({ uz: 'Poydevordan boshlaysiz: avval mahsulotlar va narxlar', ru: 'Начинаете с фундамента: сначала товары и цены' }), tr({ uz: "Bitta qadam — bitta so'rov", ru: 'Один шаг — один запрос' }), tr({ uz: 'Copilot naqshni davom ettiradi — mazmunini siz berasiz', ru: 'Copilot продолжает образец — содержание задаёте вы' })];""", s, count=1)
assert "Poydevordan boshlaysiz" in s
s = re.sub(r"  const HOMEWORK = \[\{ b: tr\(\{ uz: \"O'z g'oyangiz\"[^\n]*\];", """  const HOMEWORK = [{ b: tr({ uz: '«Keyin» qadamlar', ru: 'Шаги «потом»' }), t: tr({ uz: "— REJA.md da ularni ham muhimlik bo'yicha tartiblang", ru: '— расставьте и их в REJA.md по важности' }) }, { b: tr({ uz: 'Savat uchun prompt', ru: 'Промпт для корзины' }), t: tr({ uz: "— rejangizdagi keyingi qadamga bitta aniq prompt yozib qo'ying", ru: '— напишите один точный промпт для следующего шага плана' }) }, { b: tr({ uz: 'Papkani saqlang', ru: 'Сохраните папку' }), t: tr({ uz: '— mini-dokon keyingi darsda davom etadi', ru: '— mini-dokon продолжится на следующем уроке' }) }];""", s, count=1)
assert "Savat uchun prompt" in s and "Antigravity'da" not in s
rep("""{tr({ uz: 'Rejalashtirishni mashq qiling:', ru: 'Потренируйте планирование:' })}""", """{tr({ uz: "VS Code'da, mini-dokon papkasida:", ru: 'В VS Code, в папке mini-dokon:' })}""")
rep("""{tr({ uz: <>Endi siz — loyihaning <span className="italic" style={{ color: T.accent }}>arxitektori</span></>""", """{tr({ uz: <>Endi siz ishni <span className="italic" style={{ color: T.accent }}>reja bilan</span> boshlaysiz</>""")

# ---------- 9. Root ----------
rep("  const screens = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7, Screen8, Screen9, Screen10, Screen11, Screen12, Screen13, Screen14, Screen15, ScreenPodium, ScreenFlashcards, Screen16];",
    "  const screens = [Screen0, Screen1, ScreenReja, ScreenKatalog, ScreenCopilot, Screen4, ScreenPodium, Screen16];")
if "<Current key={screen}" not in s:
    rep("<Current screen={screen} storedAnswer=", "<Current key={screen} screen={screen} storedAnswer=")

# ---------- 10. CSS: m2-09 amaliyot bloklari + REJA.md va do'kon maketi ----------
i = p2.index("        /* ===== F-1015-303/309 · praktika qolipi"); j = p2.index("        /* ===== F-1015-336 · promo maketi")
c1 = "".join(l for l in p2[i:j].splitlines(True) if ".bb-dots" not in l)
i = j; j = p2.index("        /* ===== F-1015-337 · reja bitta kartada")
c2 = "".join(l for l in p2[i:j].splitlines(True) if l.lstrip().startswith((".am-chips", ".am-chip {", ".am-chip:hover", ".am-chip.on", ".am-chip:focus")))
assert c2.count("\n") == 5, c2
i = j; j = p2.index("        .pm-hero { position: relative; overflow: hidden; }")
c3 = "".join(l for l in p2[i:j].splitlines(True) if "F-1015-337" not in l)
i = p2.index("        .am-kod { display: flex;"); j = p2.index("      `}</style>")
c4 = "".join(l for l in p2[i:j].splitlines(True) if ".am-uslub-1" not in l)
NEWCSS = r"""        /* ===== F-1015-340 · REJA.md maketi, do'kon maketi va reja formasi (izohda backtick yo'q) ===== */
        .bb-dots { display: flex; gap: 5px; } .bb-dots i { width: 9px; height: 9px; border-radius: 50%; }
        .bb-dots i:first-child { background: #ff5f57; } .bb-dots i:nth-child(2) { background: #febc2e; } .bb-dots i:nth-child(3) { background: #28c840; }
        .am-qoida-m { margin: 0; font-family: 'Source Serif 4', serif; font-weight: 600; font-size: clamp(18px,2.4vw,22px); line-height: 1.3; color: ${T.ink}; }
        .am-satr { margin: 0; font-size: 14px; color: ${T.ink2}; }
        .rj-qator { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .rj-qator .am-input { flex: 1 1 150px; width: auto; min-width: 0; padding: 8px 10px; }
        .rj-qator .dk-narx-in { flex: 0 0 104px; }
        .rj-up { flex: none; width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid ${T.line}; background: ${T.bg}; color: ${T.ink}; font: 700 14px 'Manrope', sans-serif; cursor: pointer; }
        .rj-up:hover:not(:disabled) { border-color: ${T.ink2}; }
        .rj-up:disabled { opacity: 0.35; cursor: default; }
        .rj-up:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-chip.on.rj-shart { border-color: ${T.success}; color: ${T.success}; box-shadow: 0 0 0 1.5px ${T.success}; }
        .rj-oyna { border-radius: 12px; overflow: hidden; background: ${CODE.bg}; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); }
        .rj-bar { display: flex; align-items: center; gap: 10px; background: #111827; padding: 7px 12px; }
        .rj-fayl { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #cbd5e1; }
        .rj-body { padding: 12px 16px 14px; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.75; color: ${CODE.text}; }
        .rj-h1 { color: ${CODE.tag}; font-weight: 700; }
        .rj-h2 { color: ${CODE.attr}; font-weight: 700; margin-top: 6px; }
        .rj-li { white-space: pre-wrap; overflow-wrap: anywhere; }
        .rj-yoq { color: #94a3b8; font-style: italic; }
        .dk-sayt { border-radius: 12px; overflow: hidden; background: #fff; box-shadow: 0 10px 26px -10px rgba(${T.shadowBase},0.3); font-family: 'Manrope', Arial, sans-serif; }
        .dk-bar { display: flex; align-items: center; gap: 10px; background: #ECE9E1; padding: 7px 12px; }
        .dk-url { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${T.ink2}; }
        .dk-body { display: flex; flex-direction: column; gap: 10px; padding: 14px; background: #f8fafc; }
        .lesson-root .dk-h1 { margin: 0; font-size: 18px; font-weight: 800; line-height: 1.2; color: #0f172a; }
        .dk-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
        .dk-6 .dk-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
        .dk-karta { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 3px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; font-size: 12.5px; color: #0f172a; overflow-wrap: anywhere; }
        .dk-karta b { font-weight: 800; }
        .dk-rasm { align-self: stretch; height: 34px; border-radius: 7px; background: linear-gradient(135deg, #dbeafe, #e0e7ff); margin-bottom: 4px; }
        .dk-narx { font-weight: 700; color: #1d4ed8; }
        .dk-yoq { display: inline-flex; border: 1.5px dashed #94a3b8; border-radius: 7px; padding: 1px 8px; color: #475569; font-weight: 700; font-size: 12px; font-style: normal; }
        .dk-yangi { border: 2px solid ${T.success}; }
        .dk-teg { position: absolute; top: 6px; right: 6px; font: 700 9.5px 'JetBrains Mono', monospace; background: ${T.success}; color: #fff; padding: 1px 6px; border-radius: 5px; }
"""
rep("      `}</style>", c1 + c2 + c3 + c4 + NEWCSS + "      `}</style>")
open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()), 'qator')
