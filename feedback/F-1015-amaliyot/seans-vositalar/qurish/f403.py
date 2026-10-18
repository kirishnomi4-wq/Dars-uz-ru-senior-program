# F-1015-403: m4c-04 03/08 «Lenta quruvchisi» — o'ng ustun 4 ssenariy ko'rilguncha bo'sh edi (m4a-04 03/09, F-399 sinfi).
# Endi boshidanoq «Lenta tartibi» + 5 xira bo'sh slot (ipuchalar bilan) + «avval 4 ssenariyni ko'ring ←» qatori; seenAll bo'lgach haqiqiy quruvchi.
# Zaxira: arxiv/F-1015-403-oldin/. Qayta yurgizilmaydi.
import pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4c-Modull/FullPipelineProjectLesson.jsx')
s = P.read_text()
def rep(old, new):
    global s
    assert s.count(old) == 1, (s.count(old), old[:90]); s = s.replace(old, new)

rep("""            {!seenAll
              ? null
              : (
                <>
                  <p className="flow-label">{tr({ uz: 'Lenta tartibi', ru: 'Порядок конвейера' })}</p>{/* F-0926-06 (159/1): yo'riq mentor gapida — yorliq ot bo'ldi */}
                  <DragDropOrder""",
"""            {/* F-1015-403: ssenariylar ko'rilguncha ham ustun bo'sh turmaydi — xira slotlar + chorlov */}
            <p className="flow-label">{tr({ uz: 'Lenta tartibi', ru: 'Порядок конвейера' })}</p>
            {!seenAll
              ? (
                <div className="dd-locked" aria-hidden="true">
                  <div className="dd-slots">
                    {BELT_HINTS.map((h, i) => <div key={i} className="dd-slot"><span className="dd-slotn">{i + 1}</span><span className="dd-hint">{tr(h)}</span></div>)}
                  </div>
                  <p className="dd-locked-note">{tr({ uz: "avval chapdagi 4 ssenariyni ko'ring ←", ru: 'сначала посмотрите 4 сценария слева ←' })}</p>
                </div>
              )
              : (
                <>
                  <DragDropOrder""")
rep("""                    hints={[{ uz: "avval nima yig'iladi", ru: 'сначала — что собирается' }, """,
    """                    hints={BELT_HINTS}{/* F-1015-403: ipuchalar bitta ro'yxatda — qulf-holat ham shuni ko'rsatadi */}{/* """)
# hints massivining qolgan qismini izoh ichiga olmaymiz — uni BELT_HINTS ga ko'chiramiz:
import re
m = re.search(r"hints=\{BELT_HINTS\}\{/\* F-1015-403[^*]*\*/\}\{/\* (\{ uz: 'keyin nima skanerlanadi'.*?\])\}\n", s)
assert m, 'hints qoldig\'i topilmadi'
tail = m.group(1)  # "{ uz: 'keyin…' }, …, { uz: 'eng oxiri…' }]"
s = s.replace(m.group(0), "hints={BELT_HINTS}{/* F-1015-403: ipuchalar BELT_HINTS da — qulf-holat ham shuni ko'rsatadi */}\n")
hints_src = "[{ uz: \"avval nima yig'iladi\", ru: 'сначала — что собирается' }, " + tail
assert hints_src.count('uz:') == 5, hints_src
rep("const Screen6 = (", "const BELT_HINTS = " + hints_src + "; // F-1015-403\nconst Screen6 = (")
# CSS
rep("        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }",
    "        .dd-slot.filled { border-style: solid; border-color: ${T.line}; }\n"
    "        .dd-locked { display: flex; flex-direction: column; gap: 8px; opacity: 0.55; } /* F-1015-403: qulf-holat — slotlar ko'rinadi, bosilmaydi */\n"
    "        .dd-locked .dd-slot { pointer-events: none; }\n"
    "        .dd-locked-note { margin: 0; font-size: 13px; font-style: italic; color: ${T.ink2}; }")
P.write_text(s); print('OK f403')
# (tuzatish, shu seansda): JSX atribut ro'yxati ichida `{/* */}` izoh bo'lmaydi (sintaksis xatosi, sinov yiqildi) — `//` izohga almashtirildi.
# (tuzatish 2): `//` izoh ham atribut ichida lint:jsx 🔴 — izoh butunlay olindi (BELT_HINTS e'lonida izoh bor).
