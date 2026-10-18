# F-1015-362…364 umumiy qismlari (m2-12 da tasdiqlangan, 17.10) — boshqa praktikalarga tarqatish uchun.
# Har funksiya s (fayl matni) ni oladi va qaytaradi; topilmasa AssertionError. Takror yurgizilsa xavfsiz (belgi bo'yicha o'tkazib yuboradi).
import re

PORTAL_IMPORT = "import { createPortal } from 'react-dom'; // F-1015-362: «Avval tayyorlaning» oynasi .lesson-root ga (fade-up transform ichida fixed ishlamaydi)\n"

def _import(s):
    if PORTAL_IMPORT in s: return s
    m = re.search(r"(?m)^import React[^\n]*from 'react';\n", s); assert m, 'react import'
    return s[:m.end()] + PORTAL_IMPORT + s[m.end():]

def tayyor_oyna(s):
    """362: TayyorTugma — pastga ochilmaydi, o'rtada oyna (portal .lesson-root), ✕/Esc/fon; ramka yumshoq."""
    if 'aria-haspopup="dialog"' in s: return s
    a = s.find('const TayyorTugma = () => {'); assert a >= 0, 'TayyorTugma'
    b = s.find('\n};\n', a); assert b > a
    eski = s[a:b]
    m = re.search(r'<span>(\{(?:fmtCode\()?tr\(x\)\)?\})</span></li>\)\}</ol>', eski); assert m, 'TayyorTugma li'
    li = m.group(1)
    yangi = """// F-1015-362: pastga ochilmaydi — o'rtada oyna (⛶ kabi); ✕, Esc yoki fon bilan yopiladi, fokus tugmaga qaytadi; portal — .lesson-root (zoom va CSS shu yerda)
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
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>LI</span></li>)}</ol>
          <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
        </div>
      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}
    </div></div>
  );""".replace('<span>LI</span>', '<span>' + li + '</span>')
    s = s[:a] + yangi + s[b:]
    return _import(s)

CSS_YANGI = """        .am-tayyor.am-tt { box-shadow: none; } /* F-1015-362: yordamchi blok — yumshoq ramka, soyasiz */
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
        @media (prefers-reduced-motion: reduce) { .sk-kotar, .sk-bar-nur, .am-tt-oyna { animation: none !important; } }"""

def css(s):
    if '.am-tt-oyna {' in s: return s
    s, n = re.subn(r'(\.am-tayyor \{[^\n]*?)border: 2px solid \$\{T\.accent\};', r'\1border: 1.5px solid rgba(255,79,40,0.35);', s, count=1); assert n == 1, 'am-tayyor css'
    s, n = re.subn(r'(?m)^        @keyframes am-nafas \{.*$', lambda m: CSS_YANGI, s, count=1); assert n == 1, 'am-nafas'
    s, n = re.subn(r'(?m)^        \.sk-nur \{.*$', "        .sk-nur { border-radius: 6px; animation: sk-nur 1.2s ease-out; }", s, count=1)
    s, n2 = re.subn(r'(?m)^        @keyframes sk-nur \{.*$', "        @keyframes sk-nur { 0%, 35% { background: rgba(250,204,21,0.38); } 100% { background: transparent; } }", s, count=1)
    if n == 0 and n2 == 0:  # sk-nur yo'q darsda — qo'shiladi
        s = s.replace(CSS_YANGI, CSS_YANGI + "\n        .sk-nur { border-radius: 6px; animation: sk-nur 1.2s ease-out; }\n        @keyframes sk-nur { 0%, 35% { background: rgba(250,204,21,0.38); } 100% { background: transparent; } }", 1)
    return s

def stage_yigil(s):
    """364: Stage `mentorYigil` — kompyuterda ham bosishda Mentor yig'iladi (aylantirishda emas)."""
    if 'mentorYigil' in s: return s
    s, n = re.subn(r'(const Stage = \(\{[^}]*?)mentorStatic', r'\1mentorStatic, mentorYigil', s, count=1); assert n == 1, 'Stage sig'
    s, n = re.subn(r'const collapseOn = isNarrow && !mentorStatic;', 'const collapseOn = (isNarrow || mentorYigil) && !mentorStatic;', s, count=1); assert n == 1, 'collapseOn'
    s = s.replace("// F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi", "// F-0914-08 (foydalanuvchi): kompyuterda Mentor doim ochiq, faqat tor ekranda yig'iladi; istisno mentorYigil (F-1015-364) — bosishda kompyuterda ham", 1)
    a = s.find('const onContentScroll = () => {'); assert a >= 0, 'onContentScroll'
    k = "if (!collapseOn || mCollapsed) return;"
    j = s.find(k, a); assert 0 <= j - a < 120, 'scroll guard'
    s = s[:j] + "if (!collapseOn || mCollapsed || !isNarrow) return; // kompyuterda (mentorYigil) — faqat bosishda, aylantirishda emas" + s[j + len(k):]
    return s

PROMPT_ESKI = re.compile(r"const PromptBlok = \(\{ ([^}]*?)\}\) => \{\n  const \[ok, setOk\] = useState\(false\);\n  const nusxa = async \(\) => \{ try \{ await navigator\.clipboard\.writeText\(matn\); setOk\(true\); setTimeout\(\(\) => setOk\(false\), 1600\); \} catch \{ /\* clipboard yopiq — ustoz ko'rsatadi \*/ \} \};\n  return \(\n")
def prompt_yigil(s):
    """363: PromptBlok `yigil` — nusxalangach bitta qatorga yig'iladi («✓ Prompt nusxalandi · Ko'rish ▾»)."""
    if 'F-1015-363: nusxalangach prompt' in s: return s
    m = PROMPT_ESKI.search(s); assert m, 'PromptBlok'
    props = m.group(1).strip().rstrip(',')
    yangi = ("const PromptBlok = ({ " + props + ", yigil = false, onYigil }) => {\n  const [ok, setOk] = useState(false);\n"
             "  const [yig, setYig] = useState(false); // F-1015-363: nusxalangach prompt bitta qatorga yig'iladi, joyiga kod oynasi ko'tariladi\n"
             "  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); if (yigil) setTimeout(() => { setYig(true); onYigil && onYigil(); }, 650); } catch { /* clipboard yopiq — ustoz ko'rsatadi */ } };\n"
             "  if (yig) return (\n    <button type=\"button\" className=\"am-karta am-yig fade-step\" aria-expanded=\"false\" onClick={() => setYig(false)}>\n"
             "      <span className=\"am-yig-ok\">✓ {tr({ uz: 'Prompt nusxalandi', ru: 'Промпт скопирован' })}</span>\n"
             "      <span className=\"am-yig-k\">{tr({ uz: \"Ko'rish\", ru: 'Показать' })} <span className=\"am-qt-ic\" aria-hidden=\"true\">▾</span></span>\n    </button>\n  );\n  return (\n")
    return s[:m.start()] + yangi + s[m.end():]

def hammasi(s, prompt=False, stage=False):
    s = tayyor_oyna(s); s = css(s)
    if stage: s = stage_yigil(s)
    if prompt: s = prompt_yigil(s)
    return s


# ---- 1-Modul pilot darslari: «Avval tayyorlaning» doim ochiq blok (TayyorTugma yo'q) → oyna-tugma (F-1015-370) ----
TT_CSS_ASOS = """        .am-qt-ic { color: ${T.accent}; font-size: 16px; transition: transform 0.2s; }
        .am-tt { padding: 0; gap: 0; }
        .am-tt-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: none; border: none; cursor: pointer; text-align: left; padding: clamp(14px,2vw,18px); border-radius: 14px; font: inherit; }
        .am-tt-btn:hover { background: ${T.accentSoft}; }
        .am-tt-btn:focus-visible { outline: 2px solid ${T.accent}; outline-offset: -2px; }
        .am-tt.on .am-qt-ic { transform: rotate(180deg); }
        .am-tt-nafas { animation: am-nafas 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .am-tt-nafas { animation: none; } }"""

def tayyor_blokdan(s):
    """Doim ochiq <div className="am-tayyor fade-up delay-1"> blokini <TayyorTugma /> ga almashtiradi; komponent TAYYOR massividan keyin qo'shiladi."""
    if 'aria-haspopup="dialog"' in s: return s
    m = re.search(r'(?m)^( *)<div className="am-tayyor fade-up delay-1">\n((?:\1  [^\n]*\n)+?)\1</div>\n', s); assert m, 'tayyor blok'
    ich = m.group(2)
    lm = re.search(r'<span>(\{(?:fmtCode\()?tr\(x\)\)?\})</span></li>\)\}</ol>', ich); assert lm, 'blok li'
    fm = re.search(r'<p className="am-tayyor-s">([^\n]*)</p>', ich)
    s = s[:m.start()] + m.group(1) + '<TayyorTugma />\n' + s[m.end():]
    a = s.find('const TAYYOR = ['); assert a >= 0, 'TAYYOR'
    b = s.find('\n];\n', a) + 4
    s = s[:b] + 'const TayyorTugma = () => {\n};\n' + s[b:]
    s = tayyor_oyna(s.replace('const TayyorTugma = () => {\n};', 'const TayyorTugma = () => {\n  return (\n        <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>' + lm.group(1) + '</span></li>)}</ol>\n  );\n};', 1))
    # izoh-qator (bo'lsa) shu darsniki; o'rama klassi am-tt-w (ota CSS tartibi uchun)
    if fm: s = s.replace('<p className="am-tayyor-s">{tr({ uz: "Tayyor bo\'lsa — «Boshlaymiz».", ru: \'Готово — «Начинаем».\' })}</p>', '<p className="am-tayyor-s">' + fm.group(1) + '</p>', 1)
    else: s = s.replace('\n          <p className="am-tayyor-s">{tr({ uz: "Tayyor bo\'lsa — «Boshlaymiz».", ru: \'Готово — «Начинаем».\' })}</p>', '', 1)
    s = s.replace('<div className="fade-up delay-1"><div className={`am-tayyor am-tt', '<div className="am-tt-w fade-up delay-1"><div className={`am-tayyor am-tt', 1)
    if "from '../qolip" in s:  # qolip-dars: tugma — maket tugmasi (D2); lint faqat BIRINCHI «// qolip-maket:» qatorini o'qiydi
        if re.search(r'(?m)^// qolip-maket:', s): s = re.sub(r'(?m)^(// qolip-maket:[^\n]*)$', r'\1 am-tt-btn am-tt-yop', s, count=1)
        else: s = s.replace('// F-1015-362: pastga ochilmaydi', '// qolip-maket: am-tt-btn am-tt-yop\n// F-1015-362: pastga ochilmaydi', 1)
    return s

def css_blokdan(s):
    """Tugma uchun asos CSS (am-tt, am-qt-ic, nafas) + yangi CSS — .am-tayyor qatoridan keyin."""
    if '.am-tt-oyna {' in s: return s
    s, n = re.subn(r'(\.am-tayyor \{[^\n]*?)border: 2px solid \$\{T\.accent\};', r'\1border: 1.5px solid rgba(255,79,40,0.35);', s, count=1); assert n == 1, 'am-tayyor css'
    m = re.search(r'(?m)^        \.am-tayyor \{.*$', s)
    asos = TT_CSS_ASOS if '.am-qt-ic {' not in s else '\n'.join(l for l in TT_CSS_ASOS.split('\n') if not l.startswith('        .am-qt-ic {'))
    faqat_tt = '\n'.join(l for l in CSS_YANGI.split('\n') if not re.match(r'\s*(\.am-yig|\.sk-|@keyframes sk-)', l)).replace('.sk-kotar, .sk-bar-nur, .am-tt-oyna', '.am-tt-oyna')  # qolip-darsda T.success yo'q; prompt/kod qismi kerak emas
    s = s[:m.end()] + '\n' + asos + '\n' + faqat_tt + s[m.end():]
    if '.q-reja > .am-tayyor { order: 1; }' in s: s = s.replace('.q-reja > .am-tayyor { order: 1; }', '.q-reja > .am-tayyor, .q-reja > .am-tt-w { order: 1; }', 1)
    return s


# ---- F-1015-372: «Qadamlar» ham oyna (Avval tayyorlaning kabi) ----
QT_RE = re.compile(r"const QadamTugma = \(\{ b(, cls = '')? \}\) => \{\n  const \[ochiq, setOchiq\] = useState\(false\);\n  return \(\n    <div className=\{`am-karta am-qt \$\{ochiq \? 'on' : ''\}( \$\{cls\})?`\}>\n      <button type=\"button\" className=\"am-qt-btn\" aria-expanded=\{ochiq\} onClick=\{\(\) => setOchiq\(o => !o\)\}>\n        <span>\{tr\(\{ uz: 'Qadamlar', ru: 'Шаги' \}\)\} · \{(b(?:\.qadamlar)?)\.length\}</span><span className=\"am-qt-ic\" aria-hidden=\"true\">▾</span>\n      </button>\n      \{ochiq && <ol className=\"am-qadam am-ochil\">\{(b(?:\.qadamlar)?)\.map\(\(x, i\) => <li key=\{i\}><span className=\"am-qn\">\{i \+ 1\}</span><span>\{fmtCode\(tr\(x\)\)\}</span></li>\)\}</ol>\}\n    </div>\n  \);\n\};")
def qadam_oyna(s):
    if 'F-1015-372' in s: return s
    m = QT_RE.search(s); assert m, 'QadamTugma'
    cls = bool(m.group(1)); arr = m.group(3)
    yangi = ("// F-1015-372: «Qadamlar» pastga ochilmaydi — o'rtada oyna («Avval tayyorlaning» kabi); ✕, Esc yoki fon bilan yopiladi, fokus tugmaga qaytadi\n"
      "const QadamTugma = ({ b" + (", cls = ''" if cls else "") + " }) => {\n"
      "  const [ochiq, setOchiq] = useState(false);\n  const btnRef = useRef(null);\n  const yopRef = useRef(null);\n"
      "  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };\n"
      "  useEffect(() => {\n    if (!ochiq) return;\n    const onKey = (e) => { if (e.key === 'Escape') yop(); };\n    document.body.style.overflow = 'hidden';\n    window.addEventListener('keydown', onKey);\n    yopRef.current && yopRef.current.focus();\n"
      "    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };\n  }, [ochiq]);\n"
      "  const sarlavha = <>{tr({ uz: 'Qadamlar', ru: 'Шаги' })} · {" + arr + ".length}</>;\n"
      "  return (\n    <div className={`am-karta am-qt" + (" ${cls}" if cls else "") + "`}>\n"
      "      <button ref={btnRef} type=\"button\" className=\"am-qt-btn\" aria-haspopup=\"dialog\" aria-expanded={ochiq} onClick={() => setOchiq(true)}>\n"
      "        <span>{sarlavha}</span><span className=\"am-qt-ic\" aria-hidden=\"true\">▾</span>\n      </button>\n"
      "      {ochiq && createPortal(<>\n        <div className=\"zoom-backdrop\" onClick={yop} />\n"
      "        <div className=\"am-tt-oyna\" role=\"dialog\" aria-modal=\"true\" aria-label={tr({ uz: 'Qadamlar', ru: 'Шаги' })}>\n"
      "          <div className=\"am-tt-oyna-h\"><span className=\"am-tayyor-h\">{sarlavha}</span><button ref={yopRef} type=\"button\" className=\"am-tt-yop\" onClick={yop} aria-label={tr({ uz: 'Yopish', ru: 'Закрыть' })}>✕</button></div>\n"
      "          <ol className=\"am-qadam\">{" + arr + ".map((x, i) => <li key={i}><span className=\"am-qn\">{i + 1}</span><span>{fmtCode(tr(x))}</span></li>)}</ol>\n"
      "        </div>\n      </>, (btnRef.current && btnRef.current.closest('.lesson-root')) || document.body)}\n    </div>\n  );\n};")
    s = s[:m.start()] + yangi + s[m.end():]
    return _import(s)

# ---- F-1015-371: chap va o'ng ustun bloklari bir chiziqdan (bir ustun yorliq bilan boshlansa, ikkinchisiga ko'rinmas yorliq) ----
USTUN_CSS = """        @media (min-width: 761px) { .split:has(> .col > .flow-label:first-child) > .col:not(:has(> .flow-label:first-child))::before { content: "."; visibility: hidden; font-family: 'Manrope'; font-weight: 700; font-size: 10px; letter-spacing: 0.14em; } } /* F-1015-371: ikki ustun bloklari bir chiziqdan boshlanadi */"""
def ustun_tekis(s):
    if 'F-1015-371' in s: return s
    m = re.search(r'(?m)^        \.flow-label \{[^\n]*$', s)
    if not m: return s  # qolip-dars (HtmlPractice): .flow-label yo'q — o'tkaziladi
    return s[:m.end()] + '\n' + USTUN_CSS + s[m.end():]

# ---- 363/366: KodOyna — har bosishda o'zgargan qatorlar + sarlavha yonadi (m3-07, m3-11 dagi bir xil KodOyna) ----
def kodoyna_nur(s):
    if "const KodOyna = ({ oxirgi, qatorlar, nur = 0 })" in s: return s
    a = """const KodOyna = ({ oxirgi, qatorlar }) => (
  <div className="rj-oyna">
    <div className="rj-bar"><span className="bb-dots"><i /><i /><i /></span>"""
    b = """const KodOyna = ({ oxirgi, qatorlar, nur = 0 }) => (
  <div className="rj-oyna">
    <div key={'b' + nur} className={`rj-bar ${nur ? 'sk-bar-nur' : ''}`}><span className="bb-dots"><i /><i /><i /></span>"""
    assert s.count(a) == 1, 'KodOyna'; s = s.replace(a, b)
    a = """      <div key={oxirgi} className="rj-li sk-nur">{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i} className="rj-li">{q}</div>)}"""
    b = """      <div key={'o' + nur} className={`rj-li ${nur ? 'sk-nur' : ''}`}>{oxirgi || '—'}</div>
      <div className="sk-izoh">// {tr({ uz: 'hozir', ru: 'сейчас' })}</div>
      {qatorlar.map((q, i) => <div key={i + '-' + nur} className={`rj-li ${nur ? 'sk-nur' : ''}`}>{q}</div>)}"""
    assert s.count(a) == 1, 'KodOyna ichi'; return s.replace(a, b)


# ---- F-1015-385: yig'iq prompt kartasi (m4-08 da tasdiqlangan) — DOIMIY promptlar uchun; o'quvchi quradigan prompt ochiq qoladi ----
PK_KOMP = '// Prompt yig\'iq karta: «Ko\'rish» — oynada to\'liq matn, «Promptni nusxalash» — nusxa (Qadamlar kabi; sahifa uzaymaydi)\nconst PromptKarta = ({ matn }) => {\n  const [ok, setOk] = useState(false);\n  const [ochiq, setOchiq] = useState(false);\n  const btnRef = useRef(null);\n  const yopRef = useRef(null);\n  const nusxa = async () => { try { await navigator.clipboard.writeText(matn); setOk(true); setTimeout(() => setOk(false), 1600); } catch { /* clipboard yopiq — ustoz ko\'rsatadi */ } };\n  const yop = () => { setOchiq(false); setTimeout(() => btnRef.current && btnRef.current.focus(), 0); };\n  useEffect(() => {\n    if (!ochiq) return;\n    const onKey = (e) => { if (e.key === \'Escape\') yop(); };\n    document.body.style.overflow = \'hidden\';\n    window.addEventListener(\'keydown\', onKey);\n    yopRef.current && yopRef.current.focus();\n    return () => { document.body.style.overflow = \'\'; window.removeEventListener(\'keydown\', onKey); };\n  }, [ochiq]);\n  const birinchi = matn.split(\'\\n\')[0];\n  return (\n    <div className="am-karta pk-karta">\n      <div className="am-prompt-h">\n        <p className="flow-label">{tr({ uz: \'Prompt\', ru: \'Промпт\' })}</p>\n        <span className="pk-tg">\n          <button ref={btnRef} type="button" className="pk-kor" aria-haspopup="dialog" onClick={() => setOchiq(true)}>{tr({ uz: "Ko\'rish", ru: \'Показать\' })}</button>\n          <button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: \'✓ Nusxalandi\', ru: \'✓ Скопировано\' }) : tr({ uz: \'Promptni nusxalash\', ru: \'Скопировать промпт\' })}</button>\n        </span>\n      </div>\n      <p className="pk-bosh">{birinchi}</p>\n      {ochiq && createPortal(<>\n        <div className="zoom-backdrop" onClick={yop} />\n        <div className="am-tt-oyna pk-oyna" role="dialog" aria-modal="true" aria-label={tr({ uz: \'Prompt\', ru: \'Промпт\' })}>\n          <div className="am-tt-oyna-h"><span className="am-tayyor-h">{tr({ uz: \'Prompt\', ru: \'Промпт\' })}</span><button ref={yopRef} type="button" className="am-tt-yop" onClick={yop} aria-label={tr({ uz: \'Yopish\', ru: \'Закрыть\' })}>✕</button></div>\n          <pre className="am-masalan">{matn}</pre>\n          <button type="button" className="am-nusxa pk-ich" onClick={nusxa}>{ok ? tr({ uz: \'✓ Nusxalandi\', ru: \'✓ Скопировано\' }) : tr({ uz: \'Promptni nusxalash\', ru: \'Скопировать промпт\' })}</button>\n        </div>\n      </>, (btnRef.current && btnRef.current.closest(\'.lesson-root\')) || document.body)}\n    </div>\n  );\n};\n'
PK_CSS = "        .pk-tg { display: inline-flex; gap: 8px; flex-wrap: wrap; } /* F-1015-384/385: yig'iq prompt — Ko'rish + Nusxalash */\n        .pk-kor { font: 700 13px 'Manrope', sans-serif; color: ${T.ink}; background: ${T.paper}; border: 1.5px solid ${T.line}; border-radius: 10px; padding: 8px 14px; cursor: pointer; }\n        .pk-kor:hover { border-color: ${T.accent}; color: ${T.accent}; }\n        .pk-kor:focus-visible { outline: 2px solid ${T.accent}; outline-offset: 2px; }\n        .pk-bosh { margin: 0; font: 500 13px 'JetBrains Mono', monospace; color: ${T.ink2}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n        .am-tt-oyna.pk-oyna { width: min(680px,94vw); }\n        .pk-oyna .am-masalan { margin: 0; }\n        .pk-ich { align-self: flex-end; }"
def prompt_karta(s):
    """PromptKarta komponenti (PromptBlok'dan keyin) + CSS (.am-tt-oyna dan keyin). Ishlatishni chaqiruvchi o'zi almashtiradi."""
    if 'const PromptKarta = ' in s: return s
    a = s.find('const PromptBlok = ('); assert a >= 0, 'PromptBlok'
    b = s.find('\n};\n', a) + 4
    s = s[:b] + PK_KOMP + s[b:]
    i = s.index('        .am-tt-oyna {'); j = s.index('\n', i)
    return _import(s[:j] + '\n' + PK_CSS + s[j:])
