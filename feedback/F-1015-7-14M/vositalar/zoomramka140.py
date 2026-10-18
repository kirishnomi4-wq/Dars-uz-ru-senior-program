# F-1015-140 (A): zoomable o'zi ramkali karta bo'lsa (fon yoki chegara) — ⛶ kartaning yuqori o'ng burchagida, ichkarida (8px).
# Joy band bo'lsa — 36px qatorda, karta o'ng chetida. Boshqa holatlar 206.6 (Z1) dagidek. python3 zoomramka140.py fayl...
import sys, shutil, os
B = '/home/kali/Desktop/internetLesson/arxiv/F-1015-140-oldin/'
A1 = 'const xs = (R - zr0.left) * k;'
N1 = ("const boy = (n) => { if (!n) return false; const c = getComputedStyle(n), g = c.backgroundColor.match(/[\\d.]+/g); return (g && (g.length < 4 || Number(g[3]) > 0.05)) || parseFloat(c.borderTopWidth) > 0; }; "
      "const ota = el.parentElement, ob = ota && ota.getBoundingClientRect(); "
      "const ramka = !qol && (boy(el) || (boy(ota) && ob.width * ob.height > 0 && zr0.width * zr0.height >= 0.8 * ob.width * ob.height)); "
      "if (ramka) { T = zr0.top + pt / k; R = zr0.right; } // F-1015-140: ramkali karta — ⛶ karta burchagida\n        " + A1)
A2 = 'const j = [[8, 0], [-38, 8]].find(([dx, dy]) => !band(dx, dy));'
N2 = 'const j = (ramka ? [[-38, 8]] : [[8, 0], [-38, 8]]).find(([dx, dy]) => !band(dx, dy));'
for p in sys.argv[1:]:
    s = open(p, encoding='utf-8').read()
    if 'F-1015-140' in s: print('bor', p); continue
    assert s.count(A1) == 1 and s.count(A2) == 1, p
    if not os.path.exists(B + os.path.basename(p)): shutil.copy(p, B + os.path.basename(p))
    s = s.replace(A1, N1).replace(A2, N2); open(p, 'w', encoding='utf-8').write(s)
print('tayyor')
