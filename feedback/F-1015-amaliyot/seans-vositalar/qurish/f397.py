# F-1015-397: m4-14 doska ekrani (04/08) — kartada sinfdosh gapi, mentor bog'lovchi jumla, katakda izoh.
# Zaxira: arxiv/F-1015-397-oldin/. Qayta yurgizilmaydi (assert count==1).
import re, pathlib
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/4-Modull/FullstackFeedbackLesson.jsx')
s = P.read_text()

def rep(old, new, n=1):
    global s
    assert s.count(old) == n, (s.count(old), old[:80])
    s = s.replace(old, new)

# 1) Mentor: Demo Day'dan kelgan 4 fikr — bog'lovchi jumla; «4 katak, ikki o'lchov» qisqardi
rep("Siz — jamoa rahbari. Bu — <b style={{ color: T.ink }}>ustuvorlik doskasi</b>: 4 katak, ikki o'lchov — <b style={{ color: T.ink }}>foyda</b> (qancha naf beradi) va <b style={{ color: T.ink }}>mehnat</b> (qancha ish talab qiladi).",
    "Demo Day'dan <b style={{ color: T.ink }}>4 fikr</b> keldi — hammasini birdan qilib bo'lmaydi. Bu — <b style={{ color: T.ink }}>ustuvorlik doskasi</b>: <b style={{ color: T.ink }}>foyda</b> (qancha naf beradi) va <b style={{ color: T.ink }}>mehnat</b> (qancha ish talab qiladi).")
rep("Вы — лидер команды. Это — <b style={{ color: T.ink }}>доска приоритетов</b>: 4 клетки, два измерения — <b style={{ color: T.ink }}>польза</b> (сколько даёт) и <b style={{ color: T.ink }}>усилия</b> (сколько работы требует).",
    "С Demo Day пришли <b style={{ color: T.ink }}>4 отзыва</b> — всё сразу не сделать. Это — <b style={{ color: T.ink }}>доска приоритетов</b>: <b style={{ color: T.ink }}>польза</b> (сколько даёт) и <b style={{ color: T.ink }}>усилия</b> (сколько работы требует).")

# 2) Karta: nom + ostida sinfdosh gapi (FEEDBACK.text)
rep('<Ava name={f.who} color={f.color} sm /><span className="vlbl">{tr(f.short)}</span>',
    '<Ava name={f.who} color={f.color} sm /><span className="vtxt"><span className="vlbl">{tr(f.short)}</span><span className="vsub">{tr(f.text)}</span></span>')

# 3) Katak: nom ostida izoh (QUAD.sub)
rep('<span className="quad-lbl" style={{ color: QUAD[q].color }}>{tr(QUAD[q].lbl)}</span>',
    '<span className="quad-lbl" style={{ color: QUAD[q].color }}>{tr(QUAD[q].lbl)}<span className="quad-sub">{tr(QUAD[q].sub)}</span></span>', n=2)

# CSS
rep("        .vlbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }",
    "        .vlbl { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13.5px; color: ${T.ink}; }\n"
    "        .vtxt { display: flex; flex-direction: column; gap: 2px; min-width: 0; } /* F-1015-397: nom + sinfdosh gapi */\n"
    "        .vsub { font-size: 12.5px; line-height: 1.4; color: ${T.ink2}; font-style: italic; }")
rep("        .quad { background: #fff; border-radius: 11px; padding: 9px; min-height: 70px; display: flex; flex-direction: column; gap: 6px; }",
    "        .quad { background: #fff; border-radius: 11px; padding: 9px; min-height: 96px; display: flex; flex-direction: column; gap: 6px; } /* F-1015-397: izoh sig'sin */")
rep("        .quad-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; }",
    "        .quad-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11px; display: flex; flex-direction: column; gap: 1px; }\n"
    "        .quad-sub { font-weight: 600; font-size: 10px; color: ${T.ink2}; text-transform: none; letter-spacing: 0; } /* F-1015-397: katak izohi */")
P.write_text(s)
print('OK f397')
