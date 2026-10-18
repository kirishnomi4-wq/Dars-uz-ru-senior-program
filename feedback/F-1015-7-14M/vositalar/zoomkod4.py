# F-1015-125 (4): ⛶ joyi tekshiruvi zoomable TASHQARISIDAGI elementlarni ham ko'radi (elementsFromPoint, 5 nuqta) — m11-04 s7.
import sys
yoz = '--yoz' in sys.argv; fl = [a for a in sys.argv[1:] if not a.startswith('--')]
A = "if (b.left < br && b.right > bl && b.top - s < bb && b.bottom - s > bt) return true; } return false; };"
B = ("if (b.left < br && b.right > bl && b.top - s < bb && b.bottom - s > bt) return true; }\n"
     "          // zoomable tashqarisidagi qo'shni matn/belgi (qo'shni ustun, pastki izoh)\n"
     "          for (const [px, py] of [[bl, bt], [br, bt], [bl, bb], [br, bb], [(bl + br) / 2, (bt + bb) / 2]]) for (const n of document.elementsFromPoint(px, py)) {\n"
     "            if (el.contains(n) || n.contains(el) || n.closest('.zoom-btn')) continue;\n"
     "            if (/^(IMG|svg|INPUT|BUTTON|TEXTAREA|SELECT|CANVAS|VIDEO)$/.test(n.tagName) || [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())) return true; }\n"
     "          return false; };")
for f in fl:
    s = open(f, encoding='utf-8').read()
    if s.count(A) != 1: print('!!', f, s.count(A)); continue
    s = s.replace(A, B); print(f, 'ok')
    if yoz: open(f, 'w', encoding='utf-8').write(s)
