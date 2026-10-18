# O'lik ekran tahlili (faqat o'qiydi): screens massivida yo'q Screen* komponentlari, qator oralig'i,
# faqat ular ishlatadigan top-level const'lar. Ishlatish: python3 olik_ekran_tahlil.py <jsx>
import re, sys
f = sys.argv[1]; s = open(f).read(); lines = s.split('\n')
m = re.search(r"const screens = \[([^\]]*)\]", s); used = set(x.strip() for x in m.group(1).split(','))
# top-level bloklar: "const NAME = " dan keyingi top-level "};" / "];" / ");" gacha
starts = [(mm.start(), mm.group(1)) for mm in re.finditer(r"^(?:export default )?(?:const|function) ([A-Za-z0-9_]+)\b", s, re.M)]  # export default ham chegara (aks holda oxirgi blok faylning oxirigacha cho'ziladi)
blocks = {}
for i, (p, name) in enumerate(starts):
    end = starts[i+1][0] if i+1 < len(starts) else len(s)
    blocks[name] = (p, end)
dead = [n for n in blocks if n.startswith('Screen') and n not in used and s.count(n) == 1]
print("FAYL", f, "| ekranlar", len(used), "| o'lik:", dead)
total = 0
for n in dead:
    p, e = blocks[n]; l1 = s[:p].count('\n') + 1; l2 = s[:e].count('\n')
    total += l2 - l1 + 1
    print(f"  {n}: {l1}–{l2} ({l2-l1+1} qator)")
# faqat o'lik bloklar ichida ishlatiladigan const'lar
deadtxt = ''.join(s[blocks[n][0]:blocks[n][1]] for n in dead)
rest = s
for n in dead: rest = rest.replace(s[blocks[n][0]:blocks[n][1]], '')
only = []
for name in blocks:
    if name in dead: continue
    if re.search(r"\b%s\b" % name, deadtxt) and len(re.findall(r"\b%s\b" % name, rest)) == 1:
        p, e = blocks[name]; only.append((name, s[:p].count('\n')+1, s[:e].count('\n')))
print("  faqat o'lik ekranlar ishlatadigan const:", [(n, a, b) for n, a, b in only])
# CSS klasslar: o'lik ekranlarda bor, tiriklarda yo'q
cls = set(re.findall(r'className=\{?["`]([^"`$]+)', deadtxt))
cls = set(c for grp in cls for c in grp.split())
orphan = sorted(c for c in cls if not re.search(r'className=\{?["`][^"`]*\b%s\b' % re.escape(c), rest))
print("  faqat o'lik ekranlardagi CSS klasslar:", orphan)
print("  jami o'lik qator ≈", total)
