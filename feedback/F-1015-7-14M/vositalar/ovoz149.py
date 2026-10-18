# F-1015-146 + 149 — qolipsiz 24 dars (7–8-M): yakun ball belgisi «Testlar: 1/2» (neytral / hammasi to'g'ri — yashil),
# test javobida ovoz (jonli darsda jim) + 🔈 o'chirish tugmasi, yakunda «tugadi» ovozi. python3 ovoz149.py fayl...
import re, sys, shutil, os
B = '/home/kali/Desktop/internetLesson/arxiv/F-1015-146-oldin/'
CHIP_A = "<span className=\"score-chip fade-up\">{correct}/{total} {tr({ uz: \"to'g'ri\", ru: 'верно' })}</span>"
CHIP_B = "<span className={`score-chip fade-up ${total > 0 && correct === total ? 'toliq' : 'neytral'}`}>{tr({ uz: 'Testlar', ru: 'Тесты' })}: {correct}/{total}</span>"
PICK_A = "    if (solved || isMentorLive) return;\n    const isCorrect = i === correctIdx;\n"
PICK_B = PICK_A + "    if (!oneShot) ovoz(isCorrect ? 'ok' : 'xato'); // F-1015-149: jonli darsda javob sir — ovoz yo'q\n"
FB_A = "<p className=\"small mono\" style={{ margin: '0 0 6px', fontWeight: 600, color: waiting"
FB_B = "{!waiting && !isMentorLive && <OvozTugma />}\n          " + FB_A
CSS = (".score-chip.neytral { color: ${T.ink2}; background: ${T.paper}; box-shadow: inset 0 0 0 1px ${T.line}; } .score-chip.toliq { color: ${T.success}; background: ${T.successSoft}; } /* F-1015-146 */ "
       ".q-ovoz { float: right; margin: -4px -4px 4px 8px; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 8px; background: transparent; color: ${T.ink2}; cursor: pointer; opacity: 0.7; } .q-ovoz:hover, .q-ovoz:focus-visible { opacity: 1; } .q-ovoz.jim { opacity: 0.45; } /* F-1015-149 */\n")
IMP = "import { ovoz } from '../qolip/ovoz.js';\nimport { OvozTugma } from '../qolip/index.jsx';\n"
for p in sys.argv[1:]:
    s = open(p, encoding='utf-8').read()
    if 'F-1015-149' in s: print('bor', p); continue
    for a in (CHIP_A, PICK_A, FB_A): assert s.count(a) == 1, (p, a[:40])
    if not os.path.exists(B + os.path.basename(p)): shutil.copy(p, B + os.path.basename(p))
    s = s.replace(PICK_A, PICK_B).replace(FB_A, FB_B)
    # yakun komponenti: score-chip turgan komponent boshiga «tugadi» ovozi
    i = s.index(CHIP_A); m = None
    for m0 in re.finditer(r'(?m)^(const [A-Z]\w* = \([^\n]*\) => \{|function [A-Z]\w*\([^\n]*\) \{)\n', s[:i]): m = m0
    assert m, (p, 'komponent')
    s = s[:m.end()] + "  useEffect(() => { ovoz('tugadi'); }, []); // F-1015-149: dars tugashi\n" + s[m.end():]
    s = s.replace(CHIP_A, CHIP_B)
    m = re.search(r'\.score-chip \{(?:\$\{[^}]*\}|[^{}])*\}[^\n]*\n', s); assert m, (p, 'css')
    ind = re.match(r'[ \t]*', s[s.rfind('\n', 0, m.start()) + 1:]).group(0)
    s = s[:m.end()] + ind + CSS + s[m.end():]
    j = [x for x in re.finditer(r"(?m)^import [^\n]*\n", s)][-1]; s = s[:j.end()] + IMP + s[j.end():]
    open(p, 'w', encoding='utf-8').write(s); print('ok', p)
