# F-1015-123 S2 (A): PM 7–8-M uy vazifasi — «To'liq/Qisqa» tanlovi qoladi; karta P-025 ko'rinishida, joyida (popup/varaq yo'q),
# bitta ustun, Yakun siqilmaydi (:has(.hw-chips) qoidalari olinadi), «Keyingi dars» karta ichida. python3 pmhw.py <fayl> [--yoz]
import re, sys
f = sys.argv[1]; yoz = '--yoz' in sys.argv
s = open(f, encoding='utf-8').read()
cut = s.index('const CSS_BASE = `') if 'const CSS_BASE = `' in s else s.index('<style>')
J, C = s[:cut], s[cut:]; xab = []

# --- 1. «Keyingi dars» qatori (karta tashqarisida) → ifodasi olinadi, qator o'chadi
key = None
m = re.search(r'\n[ \t]*\{/\*[^\n]*Keyingi dars[^\n]*\*/\}[ \t]*(?=\n)', J)
if m: J = J[:m.start()] + J[m.end():]
m = re.search(r'\n[ \t]*<p className="(?:next-lesson|next-l|next-note|body next-l)[^"]*"[^>]*>(\{tr\(.*\)\})</p>[ \t]*(?=\n)', J)
if m: key = m.group(1); J = J[:m.start()] + J[m.end():]
m = re.search(r'\n[ \t]*const nextLine = <p [^>]*>(\{tr\(.*\)\})</p>;[ \t]*(?=\n)', J)
if m:
    key = m.group(1); J = J[:m.start()] + J[m.end():]
    J, n = re.subn(r'\n[ \t]*\{nextLine\}[ \t]*(?=\n)', '', J); xab.append(f'nextLine {n}')
if key: key = re.sub(r'(🚀|📱|🎓) ', '', key)
xab.append('keyingi: ' + (key[:60] if key else "YO'Q"))

# --- 2. HwCard: keyingi prop, sarlavha-qator (tanlangan chip bilan takror) olinadi, P-025 klasslari
J = J.replace('const HwCard = ({ variant, onPick', 'const HwCard = ({ variant, onPick, keyingi', 1)
h0 = J.index('const HwCard = ('); h1 = J.index('\n};', h0)
hw = J[h0:h1]
hw = re.sub(r'\n[ \t]*<div className="pmtask-head">.*?</div>[ \t]*(?=\n)', '', hw)
for a, b in [('"pmtask fade-step"', '"hwk-task fade-step"'), ('"pmtask-rows"', '"hwk-karta"'), ('"pmtask-row"', '"hwk-q"'), ('"pmtask-k"', '"hwk-k"'),
             ('"pmtask-v"', '"hwk-v"'), ('"pmtask-steps"', '"hwk-qadam"'), ('"pmtask-step"', '"hwk-s"')]:
    hw = hw.replace(a, b)
i = hw.rindex('\n    </div>\n  );')
hw = hw[:i] + '\n      {keyingi && <p className="hwk-keyingi">{keyingi}</p>}' + hw[i:]
J = J[:h0] + hw + J[h1:]
if 'pmtask' in J: xab.append('!! JSX da pmtask qoldi')

# --- 3. Yakun: popup/varaq → joyida; keyingi uzatiladi
kp = f' keyingi={key}' if key else ''
m = re.search(r'\{hwOpen && \(\n[ \t]*<div className="hw-(?:ov|sheet)".*?\n[ \t]*<HwCard ([^\n]*?) />\n.*?\n[ \t]*\)\}', J, re.S)
if m:
    J = J[:m.start()] + '{hwOpen && <HwCard ' + m.group(1) + kp + ' />}' + J[m.end():]; xab.append('popup → joyida')
else:
    J, n = re.subn(r'(\{hwOpen && (?:<div ref=\{xulRef\}>)?<HwCard [^\n]*?)( />)', lambda q: q.group(1) + kp + q.group(2), J, count=1); xab.append(f'joyida {n}')
# Escape effekti (faqat popup uchun edi) va uning izohi
m = re.search(r'(\n[ \t]*//[^\n]*)*\n[ \t]*useEffect\(\(\) => \{\n[ \t]*if \(!hwOpen\) return;\n.*?\n[ \t]*\}, \[hwOpen\]\);', J, re.S)
if m and 'Escape' in m.group(0): J = J[:m.start()] + J[m.end():]; xab.append('Escape effekti olindi')
J, n = re.subn(r"className=\{`screen\$\{hwOpen \? ' hw-on' : ''\}`\}", 'className="screen"', J); n and xab.append('hw-on olindi')

# --- 4. CSS: siquvchi / popup / pmtask qoidalari olinadi (qatordagi HAMMA qoida mos bo'lsa); hwk qo'shiladi
OL = re.compile(r':has\(\.hw-chips\)|\.pmtask|\.hw-ov|\.hw-sheet|\.s-fin \.hw-big|\.screen\.hw-on')
def selektorlar(l):
    c = re.sub(r'\$\{[^}]*\}', 'X', l); c = re.sub(r'/\*.*?\*/', '', c)
    c = re.sub(r'^\s*@media[^{]*\{', '', c)
    return [x.strip() for x in re.findall(r'(?:^|\})\s*([^{}]+?)\s*\{', c)]
out, olindi, aralash = [], 0, []
for l in C.split('\n'):
    sel = selektorlar(l)
    cl = re.sub(r'\$\{[^}]*\}', 'X', l)
    if sel and all(OL.search(x) for x in sel) and (not re.match(r'\s*@media', l) or (cl.count('{') == cl.count('}') and cl.rstrip().endswith('}'))):
        olindi += 1; continue
    if sel and any(OL.search(x) for x in sel): aralash.append(l.strip()[:150])
    out.append(l)
C = '\n'.join(out)
C = re.sub(r'\n[ \t]*@media[^{\n]*\{[ \t]*\n[ \t]*\}[ \t]*(?=\n)', '', C)  # bo'sh @media
HWK = ("  .hwk-task { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }"
       " .hwk-karta { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 8px; }"
       " .hwk-q { display: flex; flex-direction: column; gap: 3px; padding: 9px 11px; border-radius: 10px; background: ${T.bg}; border: 1px solid ${T.line}; }"
       " .hwk-k { font-family: 'Manrope'; font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: ${T.ink2}; }"
       " .hwk-v { font-family: 'Manrope'; font-size: 13.5px; font-weight: 700; line-height: 1.35; color: ${T.ink}; } .hwk-v b { font-weight: 700; }"
       " .hwk-qadam { display: flex; flex-direction: column; gap: 8px; }"
       " .hwk-s { display: flex; gap: 10px; align-items: flex-start; font-family: 'Manrope'; font-size: 14px; line-height: 1.5; color: ${T.ink}; }"
       " .hwk-s i { flex: 0 0 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-style: normal; font-weight: 800; font-size: 12px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft}; }"
       " p.hwk-keyingi { margin: 12px 0 0; font-size: 13.5px; line-height: 1.5; color: ${T.ink2}; } p.hwk-keyingi b { color: ${T.ink}; }")
m = re.search(r'\n([ \t]*)\.hw-big \{[^\n]*', C)
C = C[:m.end()] + '\n' + HWK + C[m.end():]
xab.append(f'css olindi {olindi}')
if aralash: xab.append('!! aralash qator: ' + ' | '.join(aralash))
print(f, '·', ' · '.join(xab))
if yoz: open(f, 'w', encoding='utf-8').write(J + C)
