# F-1015-123 S3: uy vazifasi qadamlaridagi ①②③④ belgisi → raqam-doira (P-025, m7-06 etaloni).
# python3 hwraqam.py <fayl.jsx> [--yoz]   — --yoz siz faqat ko'rsatadi.
# Faqat uy vazifasi bloki: belgi `HW_`/`-hw-`/`<li><i>`/`r: '` qatorlarida; boshqa ekranlardagi «uyga vazifa ①» havolalari tegilmaydi.
import re, sys
f = sys.argv[1]; yoz = '--yoz' in sys.argv
src = open(f, encoding='utf-8').read(); L = src.split('\n')
G = {'①': '1', '②': '2', '③': '3', '④': '4', '⑤': '5'}
DOIRA = ("flex: 0 0 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; "
         "font-style: normal; font-weight: 800; font-size: 12px; line-height: 1; color: ${T.accent}; background: ${T.accentSoft};")
ozg = []
for n, s in enumerate(L):
    if not re.search('[①②③④⑤]', s): continue
    if re.search(r"ulgur=|navLabel|NavNext|<Bp>|^\s*//", s): continue
    yangi = s
    # 1) ['①', '②', '③'][i] → i + 1
    yangi = re.sub(r"\[\s*'①'(?:\s*,\s*'[②③④⑤]')*\s*\]\[(\w+)\]", r"\1 + 1", yangi)
    # 2) HW_RAQAM = ['①', …] → ['1', …]
    if re.search(r"HW_RAQAM\s*=", yangi) or re.search(r"\br:\s*'[①②③④⑤]'", yangi) or re.search(r"<i>[①②③④⑤]</i>", yangi):
        yangi = re.sub("'([①②③④⑤])'", lambda m: "'" + G[m.group(1)] + "'", yangi) if 'HW_RAQAM' in yangi or "r: '" in yangi else yangi
        yangi = re.sub(r"\br:\s*'([①②③④⑤])'", lambda m: "r: '" + G[m.group(1)] + "'", yangi)
        yangi = re.sub(r"<i>([①②③④⑤])</i>", lambda m: '<i>' + G[m.group(1)] + '</i>', yangi)
    if yangi != s: ozg.append((n, s, yangi)); L[n] = yangi
# CSS: bitta «-hw-qadam … i {» qoidasi
css = [n for n, s in enumerate(L) if re.search(r"-hw-qadam(?: li)?(?: >)? i \{", s)]
for n in css:
    s = L[n]
    yangi = re.sub(r"(-hw-qadam(?: li)?(?: >)? i \{)(?:\$\{[^}]*\}|[^{}])*\}", lambda m: m.group(1) + ' ' + DOIRA + ' }', s, count=1)
    if yangi != s: ozg.append((n, s, yangi)); L[n] = yangi
qoldi = [n + 1 for n, s in enumerate(L) if re.search('[①②③④⑤]', s) and re.search(r"-hw|HW_", s)]
for n, a, b in ozg:
    print(f'{n+1}:\n  - {a.strip()[:230]}\n  + {b.strip()[:230]}')
print(f'# {f}: {len(ozg)} qator · css {len(css)} · hw-qatorda qolgan belgi: {qoldi} · accentSoft: {"accentSoft" in src}')
if yoz: open(f, 'w', encoding='utf-8').write('\n'.join(L))
