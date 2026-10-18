# F-1015-362/363 (17.10, foydalanuvchi «362 ha · 363 ha»): m2-12 PILOT.
# 362: «Avval tayyorlaning» — pastga ochilmaydi, o'rtada oyna (⛶ kabi), ✕/Esc/fon bilan yopiladi; ramka yumshoq.
# 363: a1 — kod oynasi o'ng ustunda prompt ostida; nusxalangach prompt bitta qatorga yig'iladi (bosilsa ochiladi);
#      «Savatga»/«Tozalash» bosilganda o'zgargan qatorlar va oyna sarlavhasi sariq yonadi.
# Joyida qo'llanadi (f343.py dan keyin); assert bilan.
import sys
p = sys.argv[1] if len(sys.argv) > 1 else '/home/kali/Desktop/internetLesson/src/2-Modull/PracticeLesson4.jsx'
s = open(p, encoding='utf-8').read()
def r(a, b):
    global s
    assert s.count(a) == 1, ('topilmadi/takror', a[:70])
    s = s.replace(a, b)

# ---- 363: PromptBlok — ixtiyoriy yig'ilish ----
r("""const PromptBlok = ({ matn, tayyor }) => {
  const [ok, setOk] = useState(false);
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  return (
    <div className="am-karta fade-up delay-2">""",
"""const PromptBlok = ({ matn, tayyor, yigil = false, onYigil }) => {
  const [ok, setOk] = useState(false);
  const [yig, setYig] = useState(false); // F-1015-363: nusxalangach prompt bitta qatorga yig'iladi, joyiga kod oynasi ko'tariladi
  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); if (yigil) setTimeout(() => { setYig(true); onYigil && onYigil(); }, 650); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };
  if (yig) return (
    <button type="button" className="am-karta am-yig fade-step" aria-expanded="false" onClick={() => setYig(false)}>
      <span className="am-yig-ok">✓ {tr({ uz: 'Prompt nusxalandi', ru: 'Промпт скопирован' })}</span>
      <span className="am-yig-k">{tr({ uz: "Ko'rish", ru: 'Показать' })} <span className="am-qt-ic" aria-hidden="true">▾</span></span>
    </button>
  );
  return (
    <div className="am-karta fade-up delay-2">""")

# ---- 362: TayyorTugma — oyna ----
r("""const TayyorTugma = () => {
  const [ochiq, setOchiq] = useState(false);
  const [korgan, setKorgan] = useState(false);
  return (
    <div className="fade-up delay-1"><div className={`am-tayyor am-tt ${ochiq ? 'on' : ''} ${korgan ? '' : 'am-tt-nafas'}`}>
      <button type="button" className="am-tt-btn" aria-expanded={ochiq} onClick={() => { setOchiq(o => !o); setKorgan(true); }}>
        <span className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })} · {tr({ uz: `${TAYYOR.length} qadam`, ru: `${TAYYOR.length} шага` })}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && <div className="am-tt-ich am-ochil">
        <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
        <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
      </div>}
    </div></div>
  );
};""",
"""// F-1015-362: pastga ochilmaydi — o'rtada oyna (⛶ kabi); ✕, Esc yoki fon bilan yopiladi, fokus tugmaga qaytadi
const TayyorTugma = () => {
  const [ochiq, setOchiq] = useState(false);
  const [korgan, setKorgan] = useState(false);
  const btnRef = useRef(null);
  const yopRef = useRef(null);
  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };
  useEffect(() => {
    if (!ochiq) return;
    const onKey = (e) => { if (e.key === 'Escape') yop(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    yopRef.current && yopRef.current.focus();
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [ochiq]);
  const sarlavha = <>{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })} · {tr({ uz: `${TAYYOR.length} qadam`, ru: `${TAYYOR.length} шага` })}</>;
  return (
    <div className="fade-up delay-1"><div className={`am-tayyor am-tt ${korgan ? '' : 'am-tt-nafas'}`}>
      <button ref={btnRef} type="button" className="am-tt-btn" aria-haspopup="dialog" aria-expanded={ochiq} onClick={() => { setOchiq(true); setKorgan(true); }}>
        <span className="am-tayyor-h">{sarlavha}</span>
        <span className="am-qt-ic" aria-hidden="true">▾</span>
      </button>
      {ochiq && createPortal(<>
        <div className="zoom-backdrop" onClick={yop} />
        <div className="am-tt-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}>
          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{sarlavha}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
          <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div></div>
  );
};""")

# ---- 363: SavatKod — o'zgargan qatorlar va sarlavha yonadi ----
r("""const SavatKod = ({ items, savat, oxirgi }) => {""", """const SavatKod = ({ items, savat, oxirgi, nur = 0 }) => {""")
r("""      <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">script.js · {tr({ uz: 'qiymatlar hozir', ru: 'значения сейчас' })}</span></div>
      <div className="rj-body">
        <div className="sk-izoh">// {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</div>
        <div key={oxirgi + savat.length} className="rj-li sk-nur">{oxirgi || '—'}</div>
        <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
        <div className="rj-li"><span className="sk-k">savat</span> = [{nomlar.join(', ')}];  <span className="sk-izoh">// savat.length = {savat.length}</span></div>
        <div className="rj-li"><span className="sk-k">jami</span> = {jamiSon(items, savat)};{narxlar.length > 1 && <>  <span className="sk-izoh">// for: {yigindi}</span></>}</div>""",
"""      <div key={'b' + nur} className={`rj-bar ${nur ? 'sk-bar-nur' : ''}`}><span className="bb-dots"><i /><i /><i /></span><span className="rj-fayl">script.js · {tr({ uz: 'qiymatlar hozir', ru: 'значения сейчас' })}</span></div>
      <div className="rj-body">
        <div className="sk-izoh">// {tr({ uz: 'oxirgi amal', ru: 'последнее действие' })}</div>
        <div key={'o' + nur} className={`rj-li ${nur ? 'sk-nur' : ''}`}>{oxirgi || '—'}</div>
        <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
        <div key={'s' + nur} className={`rj-li ${nur ? 'sk-nur' : ''}`}><span className="sk-k">savat</span> = [{nomlar.join(', ')}];  <span className="sk-izoh">// savat.length = {savat.length}</span></div>
        <div key={'j' + nur} className={`rj-li ${nur ? 'sk-nur' : ''}`}><span className="sk-k">jami</span> = {jamiSon(items, savat)};{narxlar.length > 1 && <>  <span className="sk-izoh">// for: {yigindi}</span></>}</div>""")

# ---- 363: ScreenSavat — kod o'ngga, nur hisobi, ko'rinmasa ko'rinadigan joyga suriladi ----
r("""  const [oxirgi, setOxirgi] = useState('');
  const qosh = (i) => { setSavat(s => [...s, i]); setOxirgi(`savat.push("${kat.items[i].n}");`); };
  const tozala = () => { setSavat([]); setOxirgi('savat = [];'); };""",
"""  const [oxirgi, setOxirgi] = useState('');
  const [nur, setNur] = useState(0); // F-1015-363: har bosishda kod oynasi yonadi
  const [yig, setYig] = useState(0);
  const kodRef = useRef(null);
  const korsat = () => setTimeout(() => { const el = kodRef.current; if (!el) return; const b = el.getBoundingClientRect(); if (b.top < 0 || b.bottom > window.innerHeight) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 420); // Mentor yig'ilib bo'lgach (F-1015-364) — kerak bo'lsagina suriladi
  const qosh = (i) => { setSavat(s => [...s, i]); setOxirgi(`savat.push("${kat.items[i].n}");`); setNur(n => n + 1); korsat(); };
  const tozala = () => { setSavat([]); setOxirgi('savat = [];'); setNur(n => n + 1); korsat(); };""")
r("""Bosib ko'ring: pastdagi kod har safar o'zgaradi.</>, ru: <>Корзина — это <b style={{ color: T.ink }}>массив</b>: при нажатии «В корзину» товар добавляется в него через <span className="qcode">push</span>. Итог — сумма цен через <b style={{ color: T.ink }}>цикл for</b>. Попробуйте: код ниже меняется при каждом нажатии.</> })}</Mentor>""",
"""Bosib ko'ring: <span className="qcode">script.js</span> oynasidagi kod har safar o'zgaradi.</>, ru: <>Корзина — это <b style={{ color: T.ink }}>массив</b>: при нажатии «В корзину» товар добавляется в него через <span className="qcode">push</span>. Итог — сумма цен через <b style={{ color: T.ink }}>цикл for</b>. Попробуйте: код в окне <span className="qcode">script.js</span> меняется при каждом нажатии.</> })}</Mentor>""")
r("""            <DokonSavat nom={kat.nom} items={kat.items} savat={savat} onSavatga={qosh} onTozala={tozala} jami={somF(jamiSon(kat.items, savat))} />
            <SavatKod items={kat.items} savat={savat} oxirgi={oxirgi} />
          </Col>
          <Col>
            <PromptBlok matn={a1Prompt(kat.nom)} />
            <QadamTugma b={A1} />""",
"""            <DokonSavat nom={kat.nom} items={kat.items} savat={savat} onSavatga={qosh} onTozala={tozala} jami={somF(jamiSon(kat.items, savat))} />
          </Col>
          <Col>
            <PromptBlok matn={a1Prompt(kat.nom)} yigil onYigil={() => setYig(y => y + 1)} />
            <div ref={kodRef} key={'k' + yig} className={yig ? 'sk-kotar' : ''}><SavatKod items={kat.items} savat={savat} oxirgi={oxirgi} nur={nur} /></div>
            <QadamTugma b={A1} />""")

# ---- CSS ----
r("""        .am-tayyor { background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 16px;""",
"""        .am-tayyor { background: ${T.paper}; border: 1.5px solid rgba(255,79,40,0.35); border-radius: 16px;""")
r("""        @keyframes am-nafas { 0%, 100% { box-shadow: 0 10px 24px -10px rgba(255,79,40,0.35), 0 0 0 0 rgba(255,79,40,0.3); } 50% { box-shadow: 0 10px 24px -10px rgba(255,79,40,0.35), 0 0 0 7px rgba(255,79,40,0); } }""",
"""        .am-tayyor.am-tt { box-shadow: none; } /* F-1015-362: yordamchi blok — yumshoq ramka, soyasiz */
        @keyframes am-nafas { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,79,40,0.18); } 50% { box-shadow: 0 0 0 6px rgba(255,79,40,0); } }
        .am-tt-oyna { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(560px,92vw); max-height: calc(88vh / var(--lz, 1)); overflow: auto; z-index: 1001; background: ${T.paper}; border-radius: 18px; padding: clamp(18px,3vw,28px); display: flex; flex-direction: column; gap: 14px; box-shadow: 0 30px 80px -20px rgba(${T.shadowBase},0.5); animation: zoom-pop 0.3s cubic-bezier(.34,1.3,.4,1); }
        .am-tt-oyna-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .am-tt-yop { flex: none; width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid ${T.line}; background: ${T.paper}; color: ${T.ink2}; font-size: 15px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .am-tt-yop:hover { color: ${T.accent}; border-color: ${T.accent}; }
        .am-tt-yop:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .am-yig { width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px; border: none; cursor: pointer; text-align: left; font: inherit; padding: 14px 18px; }
        .am-yig-ok { font-weight: 700; color: ${T.success}; font-size: 14.5px; }
        .am-yig-k { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 13.5px; color: ${T.ink2}; }
        .am-yig:hover .am-yig-k { color: ${T.accent}; }
        .am-yig:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }
        .sk-kotar { animation: sk-kotar 0.5s cubic-bezier(.2,.7,.3,1) both; } /* F-1015-363: prompt yig'ilgach kod oynasi yuqoriga ko'tariladi */
        @keyframes sk-kotar { from { opacity: 0.4; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .sk-bar-nur { animation: sk-bar-nur 1.1s ease-out; }
        @keyframes sk-bar-nur { from { box-shadow: inset 0 -2px 0 rgba(250,204,21,0.9); background: rgba(250,204,21,0.22); } to { box-shadow: inset 0 -2px 0 rgba(250,204,21,0); } }
        @media (prefers-reduced-motion: reduce) { .sk-kotar, .sk-bar-nur, .am-tt-oyna { animation: none !important; } }""")
r("""        .sk-nur { border-radius: 6px; animation: sk-nur 0.9s ease-out; }
        @keyframes sk-nur { from { background: rgba(250,204,21,0.35); } to { background: transparent; } }""",
"""        .sk-nur { border-radius: 6px; animation: sk-nur 1.2s ease-out; }
        @keyframes sk-nur { 0%, 35% { background: rgba(250,204,21,0.38); } 100% { background: transparent; } }""")
r("import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';\n", "import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';\nimport { createPortal } from 'react-dom'; // F-1015-362: «Avval tayyorlaning» oynasi .lesson-root ga (fade-up transform ichida fixed ishlamaydi)\n")
open(p, 'w', encoding='utf-8').write(s); print('ok')

# ---- F-1015-364 (17.10, foydalanuvchi): a1 da «Savatga» (do'kon ichida biror bosish) — Mentor gapi kompyuterda ham yig'iladi, script.js to'liq ko'rinsin ----
s = open(p, encoding='utf-8').read()
r("""const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic }) => {""",
"""const Stage = ({ children, eyebrow, screen, totalScreens = TOTAL_SCREENS, navContent, narrow, mentorStatic, mentorYigil }) => {""")
r("""  const collapseOn = isNarrow && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi""",
"""  const collapseOn = (isNarrow || mentorYigil) && !mentorStatic; // F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi; istisno mentorYigil (F-1015-364) — bosishda kompyuterda ham""")
r("""    if (!collapseOn || mCollapsed) return;
    const el = contentRef.current;""", """    if (!collapseOn || mCollapsed || !isNarrow) return; // kompyuterda (mentorYigil) — faqat bosishda, aylantirishda emas
    const el = contentRef.current;""")
r("""    <Stage eyebrow={tr({ uz: 'Amaliyot 1 · Gemini', ru: 'Практика 1 · Gemini' })} screen={screen} navContent""",
"""    <Stage mentorYigil eyebrow={tr({ uz: 'Amaliyot 1 · Gemini', ru: 'Практика 1 · Gemini' })} screen={screen} navContent""")
open(p, 'w', encoding='utf-8').write(s); print('ok 364')

# ---- F-1015-365 (17.10, foydalanuvchi surati): a2 xato ovida script.js chapda do'kon ostida — skrolsiz ko'rinmaydi → o'ng ustunga, «Qadamlar» ostiga ----
s = open(p, encoding='utf-8').read()
r("""            {qism === 'jami' && <div ref={kodRef}><BugKod items={kat.items} savat={savat} tuzatildi={tuzatildi} tanlangan={qator} onQator={setQator} /></div>}
          </Col>""", """          </Col>""")
r("""            {tuzatildi && <PromptBlok matn={a2Prompt(nima, qanday)} />}
            <QadamTugma b={A2} />
          </Col>""", """            {tuzatildi && <PromptBlok matn={a2Prompt(nima, qanday)} />}
            <QadamTugma b={A2} />
            {qism === 'jami' && <div ref={kodRef} className="am-ochil"><BugKod items={kat.items} savat={savat} tuzatildi={tuzatildi} tanlangan={qator} onQator={setQator} /></div>}
          </Col>""")
open(p, 'w', encoding='utf-8').write(s); print('ok 365')
