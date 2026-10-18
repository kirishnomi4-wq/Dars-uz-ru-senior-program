# F-1015-125 (3): ⛶ joyi — 1) vizual yonida, 2) vizual burchagi ichida (ikkalasida tugma o'rnida matn/belgi yo'qligi tekshiriladi),
# 3) aks holda 36px qatorda, lekin VIZUAL o'ng chetida (ustun chetida emas). python3 zoomkod3.py <fayl...> [--yoz]
import sys
yoz = '--yoz' in sys.argv; fl = [a for a in sys.argv[1:] if not a.startswith('--')]
SRC = open('src/7-Modull/PmDesignMotionLesson.jsx', encoding='utf-8').read()
a = SRC.index("      if (asosiy.length && zr0.width) {"); b = SRC.index("      setZJoy(false);", a)
ESKI = SRC[a:b]
YANGI = """      if (asosiy.length && zr0.width) {
        let T = 1e9, R = -1e9; for (const n of asosiy) { const b = n.getBoundingClientRect(); T = Math.min(T, b.top); R = Math.max(R, b.right); }
        const k = el.offsetWidth / zr0.width; const pt = parseFloat(getComputedStyle(el).paddingTop) || 0; const xs = (R - zr0.left) * k;
        // ⛶ uchun joy (qator olingan holat koordinatasida): zoomable ichida va o'rnida matn/belgi yo'q bo'lsin (206: ⛶ hech narsani yopmaydi)
        const band = (dx, dy) => { const s = pt / k, bl = R + (dx - 3) / k, br = bl + 36 / k, bt = T - s + (dy - 3) / k, bb = bt + 36 / k;
          if (bl < zr0.left - 1 || br > zr0.right + 1) return true;
          for (const n of el.querySelectorAll('*')) { if (n.closest('.zoom-btn')) continue;
            const yaprq = /^(IMG|svg|INPUT|BUTTON|TEXTAREA|SELECT|CANVAS|VIDEO)$/.test(n.tagName) || [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
            if (!yaprq || (n.closest('svg') && n.tagName !== 'svg')) continue; const b = n.getBoundingClientRect(); if (b.width < 1) continue;
            if (b.left < br && b.right > bl && b.top - s < bb && b.bottom - s > bt) return true; } return false; };
        const j = [[8, 0], [-38, 8]].find(([dx, dy]) => !band(dx, dy)); // 1) yonida · 2) burchak ichida
        if (j) {
          el.style.setProperty('--zb-x', (xs + j[0]) + 'px'); el.style.setProperty('--zb-y', Math.max(0, (T - zr0.top) * k - pt + j[1]) + 'px');
          setZQator(false); setZJoy(true); setZFloat(false); return;
        }
        el.style.setProperty('--zb-x', Math.max(0, xs - 30) + 'px'); // 3) 36px qatorda, vizual o'ng chetida
        setZJoy(false); setZQator(true); setZFloat(false); return;
      }
"""
for f in fl:
    s = open(f, encoding='utf-8').read(); bad = []
    if f != 'src/7-Modull/PmDesignMotionLesson.jsx' and s.count(ESKI) != 1: bad.append('blok')
    for x in ["      setZJoy(false);\n", "  const [zJoy, setZJoy] = useState(false); // F-1015-125: ⛶ joyi JS bilan topildi\n", "${zJoy ? ' zb-joy' : ''}`}>"]:
        if s.count(x) != 1: bad.append(x[:20])
    css_a = "/* F-1015-125 (206.6): ⛶ asosiy vizual burchagida; 36px qator — faqat zaxira */"
    if s.count(css_a) != 1: bad.append('css')
    if bad: print('!!', f, bad); continue
    s = s.replace(ESKI, YANGI)
    s = s.replace("      setZJoy(false);\n", "      setZJoy(false); setZQator(false);\n")
    s = s.replace("  const [zJoy, setZJoy] = useState(false); // F-1015-125: ⛶ joyi JS bilan topildi\n", "  const [zJoy, setZJoy] = useState(false); // F-1015-125: ⛶ joyi JS bilan topildi\n  const [zQator, setZQator] = useState(false); // F-1015-125: joy yo'q — 36px qatorda, vizual o'ng chetida\n")
    s = s.replace("${zJoy ? ' zb-joy' : ''}`}>", "${zJoy ? ' zb-joy' : ''}${zQator ? ' zb-qator' : ''}`}>")
    s = s.replace(css_a, css_a + " .zoomable.zb-qator:not(.zoom-on) { padding-top: 36px !important; } .zoomable.zb-qator:not(.zoom-on) > .zoom-btn { top: 0 !important; left: var(--zb-x, auto) !important; right: auto !important; visibility: visible !important; }")
    print(f, 'ok')
    if yoz: open(f, 'w', encoding='utf-8').write(s)
