# 5-Modul umumiy tozalash (F-1001-69). Idempotent. Fayllar argument sifatida.
import re, sys

BTN_OLD = ".btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.bg}; color: ${T.ink}; border: none; border-radius: 10px; padding: 9px 15px; font-size: 13px; }"
BTN_NEW = ".btn-soft { font-family: 'Manrope'; font-weight: 600; cursor: pointer; transition: all 0.2s; background: ${T.paper}; color: ${T.ink}; border: 1px solid ${T.line}; border-radius: 10px; padding: 8px 14px; font-size: 13px; }"
RING_OLD = ".ring-wrap { position: relative; width: 128px; height: 128px; flex-shrink: 0; }"
RING_NEW = RING_OLD + " .ring-wrap svg { width: 100%; height: 100%; }"
CNT_OLD = "<div className=\"mono small\" style={{ color: T.ink3 }}>{String(screen + 1).padStart(2, '0')}"
CNT_NEW = "<div className=\"mono small\" style={{ color: T.ink3, whiteSpace: 'nowrap' }}>{String(screen + 1).padStart(2, '0')}"

for f in sys.argv[1:]:
    s = open(f).read(); o = s; log = []
    if not re.search(r"\bpaper:", s) or not re.search(r"\bline:", s):
        print(f, 'T.paper/T.line YO\'Q — btn-soft o\'tkazildi');
    elif BTN_OLD in s:
        s = s.replace(BTN_OLD, BTN_NEW); log.append('btn-soft')
    if RING_OLD in s and '.ring-wrap svg' not in s:
        s = s.replace(RING_OLD, RING_NEW, 1); log.append('ring')
    if CNT_OLD in s:
        s = s.replace(CNT_OLD, CNT_NEW); log.append('hisoblagich')
    # Nishon hisoblagichi sarlavhasi: emoji va inglizcha «Badges»
    n = s.count("🏅 Badges — {count}/{total}")
    if n:
        s = s.replace("🏅 Badges — {count}/{total}", "{tr({ uz: 'Nishonlar', ru: 'Значки' })} — {count}/{total}"); log.append(f'Badges×{n}')
    n = s.count("<div className=\"ach-pop-h\">{tr({ uz: '🏅 Nishonlar', ru: '🏅 Значки' })}")
    if n:
        s = s.replace("<div className=\"ach-pop-h\">{tr({ uz: '🏅 Nishonlar', ru: '🏅 Значки' })}", "<div className=\"ach-pop-h\">{tr({ uz: 'Nishonlar', ru: 'Значки' })}"); log.append('ach-pop-h')
    for a, b in [("{ uz: '🏅 Nishonlaringiz —', ru: '🏅 Ваши значки —' }", "{ uz: 'Nishonlaringiz —', ru: 'Ваши значки —' }"),
                 ("{ uz: '⏳ Mentorni kuting', ru: '⏳ Дождитесь ментора' }", "{ uz: 'Mentorni kuting', ru: 'Дождитесь ментора' }")]:
        n = s.count(a)
        if n: s = s.replace(a, b); log.append(f'{a[7:20]}×{n}')
    if s != o: open(f, 'w').write(s)
    print(f.split('/')[-1], '·', ', '.join(log) or '—')
