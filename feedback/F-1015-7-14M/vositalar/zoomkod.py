# F-1015-125/126/127 (Z1 A): Zoomable ⛶ ni asosiy vizual burchagiga qo'yadi; 206 dagi 36px qator — faqat zaxira (vizual topilmasa).
# Asosiy vizual: eng tashqi chizilgan elementlar ichidan eng kattasi + yuzasi undan ≥ 50% bo'lganlar; qo'lda — [data-zoom-asosiy].
# O'ngda ≥ 44px joy bo'lsa — tashqarida (vizual tepasi chizig'ida), bo'lmasa — burchak ichida 8px. --lz (CSS zoom) hisobga olinadi.
# python3 zoomkod.py <fayl...> [--yoz]
import re, sys
yoz = '--yoz' in sys.argv; fl = [a for a in sys.argv[1:] if not a.startswith('--')]
ESKI_RUN = """    const run = () => {
      const zb = el.querySelector(':scope > .zoom-btn');
      if (!zb || el.classList.contains('zoom-on')) { setZFloat(false); return; }
      const r = zb.getBoundingClientRect(), zr = el.getBoundingClientRect(); if (!r.width) return;"""
YANGI_RUN = """    const run = () => {
      const zb = el.querySelector(':scope > .zoom-btn');
      if (!zb || el.classList.contains('zoom-on')) { setZFloat(false); return; }
      // F-1015-125: ⛶ asosiy vizual burchagida (206 dagi qator o'rniga) — eng tashqi chizilgan elementlardan eng kattasi (+ ≥ 50% yuzalilari)
      const zr0 = el.getBoundingClientRect(); const qol = el.querySelector('[data-zoom-asosiy]'); const tash = [];
      if (qol) tash.push(qol);
      else { const q = [...el.children].filter(n => !n.classList.contains('zoom-btn')); while (q.length) { const n = q.shift(); const b = n.getBoundingClientRect(); if (b.width < 2 || b.height < 2) { q.push(...n.children); continue; } if (n.tagName === 'svg' || ink(n)) tash.push(n); else q.push(...n.children); } }
      const yuza = (n) => { const b = n.getBoundingClientRect(); return b.width * b.height; };
      const maks = tash.length ? Math.max(...tash.map(yuza)) : 0;
      const asosiy = tash.filter(n => yuza(n) >= maks * 0.5);
      if (asosiy.length && zr0.width) {
        let T = 1e9, R = -1e9; for (const n of asosiy) { const b = n.getBoundingClientRect(); T = Math.min(T, b.top); R = Math.max(R, b.right); }
        const k = el.offsetWidth / zr0.width; const pt = parseFloat(getComputedStyle(el).paddingTop) || 0;
        const joy = (zr0.right - R) * k >= 44; const xs = (R - zr0.left) * k;
        el.style.setProperty('--zb-x', (joy ? xs + 8 : xs - 38) + 'px');
        el.style.setProperty('--zb-y', Math.max(0, (T - zr0.top) * k - pt + (joy ? 0 : 8)) + 'px');
        setZJoy(true); setZFloat(false); return;
      }
      setZJoy(false);
      const r = zb.getBoundingClientRect(), zr = el.getBoundingClientRect(); if (!r.width) return;"""
ESKI_ST = "  const [zFloat, setZFloat] = useState(false);\n"
YANGI_ST = "  const [zFloat, setZFloat] = useState(false);\n  const [zJoy, setZJoy] = useState(false); // F-1015-125: ⛶ joyi JS bilan topildi\n"
ESKI_CLS = "${zFloat ? ' z-float' : ''}`}>"
YANGI_CLS = "${zFloat ? ' z-float' : ''}${zJoy ? ' zb-joy' : ''}`}>"
CSS = ("        .zoomable.zb-joy:not(.zoom-on) { padding-top: 0 !important; } .zoomable.zb-joy:not(.zoom-on) > .zoom-btn { top: var(--zb-y, 0px) !important; left: var(--zb-x, auto) !important; right: auto !important; visibility: visible !important; }"
       " /* F-1015-125 (206.6): ⛶ asosiy vizual burchagida; 36px qator — faqat zaxira */")
for f in fl:
    s = open(f, encoding='utf-8').read(); x = []
    z0 = s.find('const Zoomable = ('); z1 = s.find('\n};', z0)
    if z0 < 0: print('!!', f, 'Zoomable yo\'q'); continue
    zb = s[z0:z1]
    ok = all(zb.count(a) == 1 for a in (ESKI_RUN, ESKI_ST, ESKI_CLS))
    if not ok: print('!!', f, 'naqsh mos emas', [zb.count(a) for a in (ESKI_RUN, ESKI_ST, ESKI_CLS)]); continue
    zb = zb.replace(ESKI_RUN, YANGI_RUN).replace(ESKI_ST, YANGI_ST).replace(ESKI_CLS, YANGI_CLS)
    s = s[:z0] + zb + s[z1:]
    m = list(re.finditer(r'\n[ \t]*\.zoom-btn \{[^\n]*', s))
    if not m: print('!!', f, '.zoom-btn css yo\'q'); continue
    i = m[0].end(); s = s[:i] + '\n' + CSS + s[i:]
    print(f, 'ok')
    if yoz: open(f, 'w', encoding='utf-8').write(s)
