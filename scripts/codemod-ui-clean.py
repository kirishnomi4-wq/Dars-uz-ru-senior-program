#!/usr/bin/env python3
# codemod-ui-clean — bridge-tozalikning 5–6-Modulda qo'lda qilingan qismlari bitta skriptda (F-0926-04, 159-qonun).
#   python3 scripts/codemod-ui-clean.py [--write] <fayl...>
# Qiladi:
#   Y  — variant/maket ostidagi kursiv yo'riq-qatori «… bosing ←» (mentor aytadi) — butun `{shart && <p … italic>…</p>}` olinadi
#   B  — tugma matni boshidagi emoji (▶ ✓ → ← ↻ qoladi)                         `<button …>{tr({ uz: '🍕 Menyu'`
#   H  — h1/h2 sarlavha ichidagi emoji                                           `<h2 className="title…">{tr({ uz: <>🧭 …`
#   Q  — test-savol matni boshidagi emoji                                        `q: { uz: '💾 Ilova …'`, `questionText=` va h.k.
#   L  — obyekt-yorliq emojisi                                                   `label/title/h/name/t/opt: { uz: '📋 …'` (Telegram-tugmalari tegilmaydi)
#   T  — karta/slayd tepasidagi gradient chiziq  `.k-slide/.bigidea/.s1demo/...::before { … height: 3–6px … linear-gradient … }`
#   Z  — Zoomable: bo'sh ustunda ⛶ va yorliq osilmasin (DOM bo'yicha o'lchov + `.z-empty`)
# Har bosqich soni hisobotda; `--write` bo'lmasa — quruq yurish.
import re, sys
W = '--write' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]
E = r'(?:[\U0001F300-\U0001FAFF☀-⛿✅❌✨⭐]️?)'
TG = re.compile(r'TgBtns|Bubble|inline=|btns|keyboard|kb:|<Tg|status=|chatLabel|from="|from=\'')

Y = re.compile(r"\n[ \t]*\{[^{}\n]*&& <p className=\"small\" style=\{\{[^}]*fontStyle: 'italic'[^}]*\}\}>\{tr\(\{ uz: (['\"])(?:(?!\1).)*(?:bosing|←|→|tanlang)(?:(?!\1).)*\1, ru: (['\"])(?:(?!\2).)*\2 \}\)\}</p>\}")
BU = re.compile(r"(<button[^>]*>\{tr\(\{\s*uz:\s*['\"])" + E + r" ")
BR = re.compile(r"(<button[^>]*>\{tr\(\{\s*uz:\s*(['\"])(?:(?!\2).)*\2,\s*ru:\s*['\"])" + E + r" ")
HU = re.compile(r"(<h[12] className=\"title[^\"]*\"[^>]*>\{tr\(\{ uz: <>[^<\n]{0,80}?)" + E + r" ")
HR = re.compile(r"(<h[12] className=\"title[^\"]*\"[^>]*>\{tr\(\{ uz: <>[^\n]*?</>, ru: <>[^<\n]{0,80}?)" + E + r" ")
QU = re.compile(r"(\b(?:q|question|questionText|savol|ask)\s*[:=]\s*\{?\s*(?:tr\()?\{\s*uz:\s*['\"])" + E + r" ")
QR = re.compile(r"(\b(?:q|question|questionText|savol|ask)\s*[:=]\s*\{?\s*(?:tr\()?\{\s*uz:\s*(['\"])(?:(?!\2).)*\2\s*,\s*ru:\s*['\"])" + E + r" ")
LU = re.compile(r"(\b(?:label|lbl|name|t|txt|title|h|hd|heading|opt|o)\s*:\s*\{\s*uz:\s*['\"])" + E + r" ")
LR = re.compile(r"(\b(?:label|lbl|name|t|txt|title|h|hd|heading|opt|o)\s*:\s*\{\s*uz:\s*(['\"])(?:(?!\2).)*\2\s*,\s*ru:\s*['\"])" + E + r" ")
TOP = re.compile(r"^[ \t]*\.[\w-]+::before \{[^\n]*height:\s*[3-6]px[^\n]*linear-gradient[^\n]*\}[ \t]*\n", re.M)
# to'liq enli tepa-bar (gradientsiz ham): left:0; right:0; top:0; height 2–6px
TOP2 = re.compile(r"^[ \t]*\.[\w.-]+::before \{[^\n]*\bleft:\s*0;[^\n]*\bright:\s*0;[^\n]*\btop:\s*0;[^\n]*\bheight:\s*[2-6]px;[^\n]*\}[ \t]*\n", re.M)

Z_OLD = "  const [big, setBig] = useState(false);\n"
Z_NEW = ("  const [big, setBig] = useState(false);\n"
         "  // bo'sh ustunda ⛶ va yorliq yolg'iz osilmasin (F-0926-01, 111-qonun): mazmun DOM bo'yicha o'lchanadi\n"
         "  const zref = useRef(null);\n  const [hasContent, setHasContent] = useState(true);\n"
         "  useEffect(() => {\n    const el = zref.current; if (!el) return;\n"
         "    const kids = [...el.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains('zoom-btn')));\n"
         "    const c = kids.some(n => (n.textContent || '').trim().length > 0 || (n.nodeType === 1 && n.querySelector('img,svg,canvas,input,textarea,video,iframe,button')));\n"
         "    if (c !== hasContent) setHasContent(c);\n  });\n")

tot = {}
for f in files:
    s = open(f, encoding='utf-8').read(); o = s; c = {}
    s, c['Y'] = Y.subn('', s)
    s, a = BU.subn(r'\1', s); s, b = BR.subn(r'\1', s); c['B'] = a + b
    s, a = HU.subn(r'\1', s); s, b = HR.subn(r'\1', s); c['H'] = a + b
    s, a = QU.subn(r'\1', s); s, b = QR.subn(r'\1', s); c['Q'] = a + b
    L = s.split('\n'); n = 0
    for i, l in enumerate(L):
        if TG.search(l): continue
        l2, a = LU.subn(r'\1', l); l2, b = LR.subn(r'\1', l2)
        if a or b: L[i] = l2; n += a + b
    s = '\n'.join(L); c['L'] = n
    s, c['T'] = TOP.subn('', s)
    s, t2 = TOP2.subn('', s); c['T'] += t2
    c['Z'] = 0
    if 'className="zoom-btn"' in s and 'const zref = useRef' not in s and 'const Zoomable' in s:
        zb = s.index('const Zoomable')
        seg = s[zb:zb + 1500]
        if Z_OLD in seg:
            s = s[:zb] + seg.replace(Z_OLD, Z_NEW, 1) + s[zb + 1500:]
            s, a = re.subn(r"<div className=\{`zoomable \$\{big \? 'zoom-on' : ''\}`\}>", "<div ref={zref} className={`zoomable ${big ? 'zoom-on' : ''}${hasContent ? '' : ' z-empty'}`}>", s, count=1)
            s, b = re.subn(r"(\n[ \t]*)(<button type=\"button\" className=\"zoom-btn\" onClick=\{\(\) => setBig\(b => !b\)\}[^\n]*</button>)", r"\1{hasContent && \2}", s, count=1)
            m = re.search(r'^([ \t]*)\.zoomable \{[^\n]*\n', s, re.M)
            if m and a and b:
                s = s[:m.end()] + m.group(1) + ".flow-label:has(+ .zoomable.z-empty) { display: none; } /* bo'sh ustun ustida yorliq yolg'iz osilmasin (bridge 40-band) */\n" + s[m.end():]
                c['Z'] = 1
            if 'useRef' not in s.split('\n')[0]: print('  ⚠ useRef import yo`q —', f)
    for k, v in c.items(): tot[k] = tot.get(k, 0) + v
    print(f"{f}: " + ' '.join(f"{k}={v}" for k, v in c.items()))
    if W and s != o: open(f, 'w', encoding='utf-8').write(s)
print('JAMI ' + ' '.join(f"{k}={v}" for k, v in tot.items()) + (' (yozildi)' if W else ' (quruq)'))
