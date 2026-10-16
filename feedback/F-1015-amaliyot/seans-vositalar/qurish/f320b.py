#!/usr/bin/env python3
# F-1015-320 · 2-qadam: lint-qolip q14 (tugma → QTugma) · q15 (Screen1 → QReja). f320.py dan keyin, bir marta.
import sys
P = sys.argv[1]
s = open(P, encoding='utf-8').read()

def rep(old, new):
    global s
    n = s.count(old)
    assert n == 1, f'{n}× : {old[:80]!r}'
    s = s.replace(old, new)

def cut(start, end, new):
    global s
    assert s.count(start) == 1 and s.count(end) == 1, (start[:60], end[:60])
    a = s.index(start); b = s.index(end); assert a < b
    s = s[:a] + new + s[b:]

# --- q15: Reja ekrani QReja dan; «Avval tayyorlaning» — QReja bolasi, CSS order bilan mentor gapidan keyin tepada ---
cut("      <div className=\"screen q-ekran q-reja am-reja\">", "    </Stage>\n  );\n};\n\n// ===== s5 — TOPSHIRISH",
"""      <QReja zoom={Zoomable}
        sarlavha={tr({ uz: <>Dars oxirida portfolio sahifangiz <span className="italic" style={{ color: T.accent }}>tayyor bo'ladi</span>.</>, ru: <>К концу урока ваша страница-портфолио <span className="italic" style={{ color: T.accent }}>будет готова</span>.</> })}
        mentor={<Mentor>{tr({ uz: "Ish o'z kompyuteringizda: kodni Gemini yozadi, siz faylga qo'yasiz va Live Server'da tekshirasiz.", ru: 'Работа на вашем компьютере: код пишет Gemini, вы вставляете его в файл и проверяете в Live Server.' })}</Mentor>}
        chapYorliq={tr({ uz: 'Dars oxirida · namuna', ru: 'К концу урока · образец' })}
        chap={<PfSite tushish={demo} yorit={demo} baland={230} />}
        ongYorliq={tr({ uz: 'Bugungi 3 blok', ru: '3 блока сегодня' })}
        qadamlar={REJA.map(r => ({ t: tr(r.t), teg: r.teg }))}
      >
        <div className="am-tayyor fade-up delay-1">
          <p className="am-tayyor-h">{tr({ uz: 'Avval tayyorlaning', ru: 'Сначала подготовьтесь' })}</p>
          <ol className="am-tayyor-l">{TAYYOR.map((x, i) => <li key={i}><span className="am-tayyor-n">{i + 1}</span><span>{tr(x)}</span></li>)}</ol>
          <p className="am-tayyor-s">{tr({ uz: "Tayyor bo'lsa — «Boshlaymiz».", ru: 'Готово — «Начинаем».' })}</p>
        </div>
      </QReja>
""")
rep("// ===== SCREEN 1 — REJA (QReja tuzilmasi): chapda dars oxiridagi sahifa (bir marta o'zi yuradi) · o'ngda «Avval tayyorlaning» + 3 blok (F-1015-320, pilot m1-10) =====",
    "// ===== SCREEN 1 — REJA (QReja): chapda dars oxiridagi sahifa (bir marta o'zi yuradi) · o'ngda 3 blok · «Avval tayyorlaning» — mentor gapidan keyin, tepada (F-1015-320) =====")
rep("        @media (max-width: 860px) { .am-reja .q-split > .q-col:last-child { order: -1; } }\n",
    "        .q-reja > .am-tayyor { order: 1; } .q-reja > .zoomable { order: 2; } /* «Avval tayyorlaning» — reja ustida, telefonda ham birinchi */\n")

# --- q14: tugmalar QTugma dan ---
rep("""<button type="button" className="am-nusxa" onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</button>""",
    """<QTugma onClick={nusxa}>{ok ? tr({ uz: '✓ Nusxalandi', ru: '✓ Скопировано' }) : tr({ uz: 'Promptni nusxalash', ru: 'Скопировать промпт' })}</QTugma>""")
rep("""{b.forma && <button type="button" className="am-saqla" disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : b.toldir)}</button>}""",
    """{b.forma && <QTugma disabled={!toliq} onClick={saqla}>{tr(toliq ? { uz: 'Saqlash', ru: 'Сохранить' } : b.toldir)}</QTugma>}""")
rep("""<button type="button" className="am-nusxa" onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</button>""",
    """<QTugma ikkinchi onClick={() => setYigil(false)}>{tr({ uz: 'Tahrirlash', ru: 'Изменить' })}</QTugma>""")
rep("""{matn && <button type="button" className="am-saqla am-ochil" onClick={keyingi}>{tr({ uz: 'Keyingi kamchilik', ru: 'Следующий недочёт' })}</button>}""",
    """{matn && <QTugma ikkinchi className="am-ochil" onClick={keyingi}>{tr({ uz: 'Keyingi kamchilik', ru: 'Следующий недочёт' })}</QTugma>}""")
for line in [
    "        .am-nusxa { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 16px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }\n",
    "        .am-nusxa:hover { background: ${T.accentSoft}; }\n",
    "        .am-saqla { align-self: flex-start; background: ${T.paper}; color: ${T.ink}; border: 1.5px solid ${T.accent}; border-radius: 10px; padding: 9px 18px; font: 700 13px 'Manrope', sans-serif; cursor: pointer; }\n",
    "        .am-saqla:hover:not(:disabled) { background: ${T.accentSoft}; }\n",
    "        .am-saqla:disabled { border-color: ${T.line}; color: ${T.ink2}; cursor: default; }\n"]:
    rep(line, "")

open(P, 'w', encoding='utf-8').write(s)
print('OK', len(s.splitlines()), 'qator')
