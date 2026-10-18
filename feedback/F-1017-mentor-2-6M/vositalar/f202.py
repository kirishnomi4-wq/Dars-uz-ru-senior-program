def ed(f, pairs):
    t = open(f, encoding='utf-8').read()
    for o, n in pairs:
        assert t.count(o) == 1, (f, t.count(o), o[:60]); t = t.replace(o, n)
    open(f, 'w', encoding='utf-8').write(t)
SH = "0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3)"
ed('src/4-Modull/DataIntroLesson.jsx', [
 ("padding: 7px 12px; border-radius: 10px; background: #fff; border: 2px solid ${T.accent}; color: ${T.accent}; box-shadow: 0 5px 14px -6px rgba(${T.shadowBase},0.2); cursor: grab;",
  "padding: 9px 14px; border-radius: 10px; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; color: #fff; box-shadow: " + SH + "; cursor: grab;"),
 ("font-size: 13px; font-weight: 600; transition: transform 0.15s, box-shadow 0.2s; } /* F-0926-06: sudraladigan chip — oq + 2px accent ramka + accent matn + ⠿ (159/15) */",
  "font-size: 13px; font-weight: 700; transition: transform 0.15s, box-shadow 0.2s; } /* F-1017-202 (DE 159.15): sudraladigan chip — to'ldirilgan gradient, oq matn, ⠿ ushlagich */"),
 (".cdrag-chip:hover { transform: translateY(-2px); box-shadow: 0 9px 20px -6px rgba(${T.shadowBase},0.28); }",
  ".cdrag-chip:hover { transform: translateY(-2px); box-shadow: 0 12px 20px -8px rgba(255,79,40,.7), inset 0 2px 0 rgba(255,255,255,.3); }"),
 (".cdrag-chip.fk { color: ${T.accent}; box-shadow: 0 5px 14px -6px rgba(255,79,40,0.35), inset 0 0 0 1.5px ${T.accent}44; }",
  ".cdrag-chip .tc-badge.fk { background: rgba(255,255,255,0.92); color: ${T.accent}; } .cdrag-chip .tc-fork { color: #fff; } /* gradient ustida FK belgisi o'qilsin */"),
])
ed('src/4a-Modull/NestArchResourceLesson.jsx', [
 ("font-weight: 700; font-size: 12.5px; color: ${T.accent}; background: ${T.paper}; border: 2px solid ${T.accent}; border-radius: 10px; padding: 8px 12px; cursor: grab; } /* F-0926-06: sudraladigan chip — oq fon + accent chegara + ⠿ (159/15) */",
  "font-weight: 700; font-size: 12.5px; color: #fff; background: linear-gradient(170deg, #FF8A3D, ${T.accent}); border: none; border-radius: 10px; padding: 10px 14px; cursor: grab; box-shadow: " + SH + "; } /* F-1017-202 (DE 159.15): sudraladigan chip — to'ldirilgan gradient, oq matn, ⠿ matnda */"),
 (".oc-plate-chip.held { background: ${T.accentSoft}; }",
  ".oc-plate-chip.held { animation: none; box-shadow: 0 0 0 2px ${T.paper}, 0 0 0 4px ${T.accent}; } /* tanlangan — halqa (pulsatsiya halqani bosmasin) */"),
])
print('OK')
