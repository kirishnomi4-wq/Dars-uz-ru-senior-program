#!/usr/bin/env python3
# codemod-zbtn-float — ⛶ bo'sh joy ustida osilib turmasin (F-0926-04, 159-qonun 3-band; page-audit ZBTN o'lchovi).
#   python3 scripts/codemod-zbtn-float.py [--write] <fayl...>
# Bo'sh-holat ramkasi olingach ⛶ bo'sh ustun ustida yolg'iz qoladi (5–6-Modul: 77 ekran). Zoomable o'zini o'lchaydi:
# tugma ostidagi ustunda ko'rinadigan narsa (to'g'ridan-to'g'ri matn, media/maydon, fon/chegara/soya) yo'q bo'lsa —
# `.z-float` (tugma visibility:hidden, joyi saqlanadi). MutationObserver bosishdan keyin qayta o'lchaydi.
# Talab: Zoomable'da codemod-ui-clean Z-patch bo'lsin (`const zref = useRef`, `hasContent`).
import re, sys
W = '--write' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]

ANCHOR = "  const [hasContent, setHasContent] = useState(true);\n"
ADD = r"""  // ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun): tugma ostidagi ustunda ko'rinadigan narsa yo'q bo'lsa — yashirin.
  const [zFloat, setZFloat] = useState(false);
  useEffect(() => {
    const el = zref.current; if (!el || typeof MutationObserver === 'undefined') return;
    const ink = (n) => {
      if (!el.contains(n) || n === el || n.classList?.contains('zoom-btn') || n.closest?.('.zoom-btn')) return false;
      if (/^(IMG|svg|CANVAS|INPUT|TEXTAREA|BUTTON|VIDEO|SELECT|path|rect|circle|line|polygon)$/.test(n.tagName)) return true;
      if ([...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())) return true;
      const cs = getComputedStyle(n); const bg = cs.backgroundColor.match(/[\d.]+/g);
      return (bg && (bg.length < 4 || Number(bg[3]) > 0.05)) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
    };
    const run = () => {
      const zb = el.querySelector(':scope > .zoom-btn');
      if (!zb || el.classList.contains('zoom-on')) { setZFloat(false); return; }
      const r = zb.getBoundingClientRect(), zr = el.getBoundingClientRect(); if (!r.width) return;
      let hit = false;
      for (let y = r.top; y < Math.min(r.top + 220, zr.bottom) && !hit; y += 18) for (const x of [r.left - 30, r.left - 140]) {
        if (x < zr.left) continue; if (document.elementsFromPoint(x, y).some(ink)) { hit = true; break; }
      }
      setZFloat(!hit);
    };
    let raf = 0; const sch = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(run); };
    sch(); const t = setTimeout(sch, 700); // fade-kirish tugagach yana bir bor
    const mo = new MutationObserver(sch); mo.observe(el, { childList: true, subtree: true, characterData: true });
    window.addEventListener('resize', sch);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); mo.disconnect(); window.removeEventListener('resize', sch); };
  }, []);
"""
CLS = re.compile(r"(className=\{`zoomable \$\{big \? 'zoom-on' : ''\}\$\{hasContent \? '' : ' z-empty'\})(`\})")
CSS_AT = re.compile(r'^([ \t]*)\.zoomable \{[^\n]*\n', re.M)
CSS = ".zoomable.z-float > .zoom-btn { visibility: hidden; } /* ⛶ bo'sh joy ustida osilmasin (ZBTN, 159-qonun) */\n"

for f in files:
    s = open(f, encoding='utf-8').read(); o = s
    if 'setZFloat' in s: print(f, 'allaqachon'); continue
    zb = s.find('const Zoomable'); a = s.find(ANCHOR, zb)
    if zb < 0 or a < 0 or a - zb > 1500: print(f, '⚠ Z-patch topilmadi'); continue
    s = s[:a + len(ANCHOR)] + ADD + s[a + len(ANCHOR):]
    s, n1 = CLS.subn(r"\1${zFloat ? ' z-float' : ''}\2", s, count=1)
    m = CSS_AT.search(s); n2 = 0
    if m: s = s[:m.end()] + m.group(1) + CSS + s[m.end():]; n2 = 1
    ok = n1 == 1 and n2 == 1 and re.search(r'\buseEffect\b', s.split('\n', 3)[0] + s[:600])
    print(f"{f}: cls={n1} css={n2}" + ('' if ok else '  ⚠ tekshiring (useEffect import?)'))
    if W and ok and s != o: open(f, 'w', encoding='utf-8').write(s)
