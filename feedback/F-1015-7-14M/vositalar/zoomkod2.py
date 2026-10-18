# F-1015-125 (2): «burchak ichida» rejimida ⛶ matn/belgini yopmasin — joy ichkarida bo'lsa, o'sha to'rtburchakda matnli yoki
# almashtiriladigan (img/svg/input/button) element bormi tekshiriladi; tegsa — eski 206 qatori (zaxira). python3 zoomkod2.py <fayl...> [--yoz]
import sys
yoz = '--yoz' in sys.argv; fl = [a for a in sys.argv[1:] if not a.startswith('--')]
A = """        const joy = (zr0.right - R) * k >= 44; const xs = (R - zr0.left) * k;
        el.style.setProperty('--zb-x', (joy ? xs + 8 : xs - 38) + 'px');"""
B = """        const joy = (zr0.right - R) * k >= 44; const xs = (R - zr0.left) * k;
        // ichkarida bo'lsa — tugma o'rnida matn/belgi yo'qligini tekshirish (206: ⛶ hech narsani yopmaydi); tegsa — qator (zaxira)
        const ust = joy ? false : (() => { const s = pt / k, bl = R - 41 / k, bt = T - s + 5 / k, br = R - 5 / k, bb = T - s + 41 / k;
          for (const n of el.querySelectorAll('*')) { if (n.closest('.zoom-btn')) continue;
            const yaprq = /^(IMG|svg|INPUT|BUTTON|TEXTAREA|SELECT|CANVAS|VIDEO)$/.test(n.tagName) || [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
            if (!yaprq || (n.closest('svg') && n.tagName !== 'svg')) continue; const b = n.getBoundingClientRect(); if (b.width < 1) continue;
            if (b.left < br && b.right > bl && b.top - s < bb && b.bottom - s > bt) return true; } return false; })();
        if (!ust) {
        el.style.setProperty('--zb-x', (joy ? xs + 8 : xs - 38) + 'px');"""
A2 = """        setZJoy(true); setZFloat(false); return;
      }"""
B2 = """        setZJoy(true); setZFloat(false); return;
        }
      }"""
for f in fl:
    s = open(f, encoding='utf-8').read()
    if s.count(A) != 1 or s.count(A2) != 1: print('!!', f, s.count(A), s.count(A2)); continue
    s = s.replace(A, B).replace(A2, B2); print(f, 'ok')
    if yoz: open(f, 'w', encoding='utf-8').write(s)
