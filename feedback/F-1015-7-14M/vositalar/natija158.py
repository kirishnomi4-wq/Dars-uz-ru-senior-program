# F-1015-158: Natijalar sahifasi 102 darsda bitta ko'rinish — m5-08 (PmLesson20) kartasi, halqa atrofidagi ortiqcha chiziqsiz.
# 94 dars: «Kim g'olib?» (mustaqil) → «Bugungi natijangiz» karta (halqa + nishonlar + izoh); jonli rejim (podium) o'zgarmaydi.
# 8 dars (pod-card bor): `.pod-card .ring-wrap` dagi box-shadow 6px olinadi.
import glob, re, sys, os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
F = [a for a in sys.argv[1:] if a.endswith('.jsx')] or sorted(glob.glob(ROOT + '/src/[5-9]-Modull/*.jsx') + glob.glob(ROOT + '/src/1[0-2]-Modull/*.jsx')) + [ROOT + '/src/pm/PmMetricsLesson.jsx']
YOZ = '--yoz' in sys.argv
ZAX = ROOT + '/arxiv/F-1015-158-oldin'
BLOK_ESKI = re.compile(r"""\{!isLive \? \(\n(\s*)<div className="fade-up" style=\{\{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' \}\}>\n\s*<ScoreRing correct=\{selfCorrect\} total=\{totalQ\} /><p className="ring-iz">(\{tr\(\{ uz: "Testlarda birinchi urinishda topilgan to'g'ri javoblar", ru: '[^']*' \}\)\})</p>\n\s*<div className="frame-soft" style=\{\{ maxWidth: 480 \}\}><p className="body" style=\{\{ margin: 0 \}\}>\{tr\(\{ uz: '[^']*', ru: '[^']*' \}\)\}</p></div>\n\s*</div>\n""")
def blok_yangi(ind, iz):
    i = ind
    return ("{!isLive ? (\n"
        f"{i}<div className=\"fade-up\" style={{{{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}}}>\n"
        f"{i}  <div className=\"pod-card\">\n"
        f"{i}    <div className=\"pod-card-ring\"><ScoreRing correct={{selfCorrect}} total={{totalQ}} /></div><p className=\"ring-iz\">{iz}</p>\n"
        f"{i}    <div className=\"pod-card-sec\">\n"
        f"{i}      <span className=\"pod-card-lbl\">{{tr({{ uz: 'Nishonlar', ru: 'Значки' }})}} · {{Object.keys(ACHIEVEMENTS).filter(id => achievements && achievements.has(id)).length}}/{{Object.keys(ACHIEVEMENTS).length}}</span>\n"
        f"{i}      <div className=\"pod-card-badges\">\n"
        f"{i}        {{Object.entries(ACHIEVEMENTS).map(([id, a], k) => {{ const got = !!(achievements && achievements.has(id)); return <span key={{id}} className={{`pcb ${{got ? 'got' : ''}}`}} style={{{{ '--k': k }}}} title={{tr(a.desc)}}><span className=\"pcb-ic\" aria-hidden=\"true\">{{got ? a.icon : '🔒'}}</span><span className=\"pcb-nm\">{{got ? a.name : '?'}}</span></span>; }})}}\n"
        f"{i}      </div>\n"
        f"{i}    </div>\n"
        f"{i}    <div className=\"pod-card-note\"><span className=\"pcn-ic\" aria-hidden=\"true\">💡</span><p className=\"body\">{{tr({{ uz: \"Bu — shaxsiy natijangiz. Jonli darsda shu yerda butun guruhning natijalar ro'yxati va 🥇🥈🥉 eng yaxshi uchtalik (podium) chiqadi.\", ru: 'Это ваш личный результат. На живом уроке здесь появится список результатов всей группы и 🥇🥈🥉 тройка лучших (подиум).' }})}}</p></div>\n"
        f"{i}  </div>\n"
        f"{i}</div>\n")
SARL = re.compile(r"""(<div className="head head-c"><h2 className="title h-title fade-up">)\{(tr\(\{ uz: <>Kim <span className="italic" style=\{\{ color: T\.accent \}\}>g'olib</span>\?</>, ru: <>Кто <span className="italic" style=\{\{ color: T\.accent \}\}>(?:победитель|победил)</span>\?</> \}\))\}(</h2></div>)""")
SARL_YANGI = r"""\1{isLive ? \2 : tr({ uz: <>Bugungi <span className="italic" style={{ color: T.accent }}>natijangiz</span></>, ru: <>Ваш сегодняшний <span className="italic" style={{ color: T.accent }}>результат</span></> })}\3"""
CSS = """        /* F-1015-158: natija — bitta karta (m5-08 namunasi): halqa, nishonlar, 💡 izoh; halqa atrofida qo'shimcha chiziq yo'q */
        .pod-card { position: relative; width: 100%; max-width: 480px; margin-top: 6px; background: ${T.paper}; border-radius: 20px; padding: 0 clamp(14px,2.4vw,20px) clamp(14px,2.4vw,20px); display: flex; flex-direction: column; gap: 12px; box-shadow: 0 16px 34px -20px rgba(${T.shadowBase},0.35); }
        .pod-card-ring { display: flex; justify-content: center; padding-top: clamp(14px,2.4vw,20px); } .pod-card-ring > * { margin-top: 0 !important; }
        .screen:has(.pod-card) .head { text-align: center; }
        .pod-card-sec { background: ${T.bg}; border-radius: 14px; padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .pod-card-lbl { font-family: 'Manrope'; font-weight: 800; font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase; color: ${T.accent}; }
        .pod-card-badges { display: flex; justify-content: center; gap: clamp(8px,1.6vw,12px); flex-wrap: wrap; }
        .pcb { width: 84px; display: flex; flex-direction: column; align-items: center; gap: 5px; }
        .pcb-ic { width: 50px; height: 50px; border-radius: 14px; display: grid; place-items: center; font-size: 26px; line-height: 1; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; }
        .pcb.got .pcb-ic { background: ${T.accentSoft}; box-shadow: inset 0 0 0 2px ${T.accent}; animation: pcb-pop 0.5s cubic-bezier(.3,1.6,.5,1) both; animation-delay: calc(0.35s + var(--k) * 0.12s); }
        .pcb:not(.got) .pcb-ic { font-size: 18px; filter: grayscale(1); opacity: 0.55; }
        .pcb-nm { font-family: 'Manrope'; font-size: 10.5px; line-height: 1.25; text-align: center; color: ${T.ink3}; }
        .pcb.got .pcb-nm { color: ${T.ink}; font-weight: 700; }
        @keyframes pcb-pop { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .pod-card-note { display: flex; gap: 10px; align-items: flex-start; background: ${T.accentSoft}; border-radius: 14px; padding: 11px 13px; }
        .pcn-ic { width: 32px; height: 32px; flex: none; border-radius: 50%; display: grid; place-items: center; background: ${T.paper}; font-size: 16px; }
        .pod-card-note .body { margin: 0; font-size: clamp(13px,1.5vw,14.5px); }
        @media (prefers-reduced-motion: reduce) { .pcb.got .pcb-ic { animation: none; } }
"""
HALO = " box-shadow: 0 0 0 6px ${T.accentSoft}; }"
ok = xato = 0
for f in F:
    s = open(f).read(); o = s; nom = os.path.relpath(f, ROOT)
    if 'pod-card' in s:
        n = s.count(HALO)
        if n != 1: print('HALO?', nom, n); xato += 1; continue
        s = s.replace(HALO, " } /* F-1015-158: tashqi chiziq olindi */")
    else:
        i = s.index('const ScreenPodium = ({ screen, answers, onNext, onPrev })')
        s = s.replace('const ScreenPodium = ({ screen, answers, onNext, onPrev })', 'const ScreenPodium = ({ screen, answers, achievements, onNext, onPrev })', 1)
        m = BLOK_ESKI.search(s, i)
        if not m: print('BLOK?', nom); xato += 1; continue
        s = s[:m.start()] + blok_yangi(m.group(1), m.group(2)) + s[m.end():]
        s, n = SARL.subn(SARL_YANGI, s, count=1)
        if n != 1: print('SARL?', nom); xato += 1; continue
        rm = re.search(r"\n(\s*)\.ring-iz \{[^\n]*\n", s)
        if 'qolipRang(' in s: css = CSS.replace('color: ${T.ink3}; }\n        .pcb.got', 'color: ${T.ink2}; }\n        .pcb.got')
        else: css = CSS
        if not rm or not re.search(r'^const ACHIEVEMENTS\b', s, re.M): print('CSS/ACH?', nom); xato += 1; continue
        ind = rm.group(1)
        s = s[:rm.end()] + css.replace('        ', ind) + s[rm.end():]
    if YOZ:
        os.makedirs(ZAX + '/' + os.path.dirname(nom), exist_ok=True)
        if not os.path.exists(ZAX + '/' + nom): shutil.copy(f, ZAX + '/' + nom)
        open(f, 'w').write(s)
    ok += 1
print('ok', ok, 'xato', xato, '(yozildi)' if YOZ else '(quruq)')
