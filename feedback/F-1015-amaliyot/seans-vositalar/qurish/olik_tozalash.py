# O'lik kodni tozalash (F-1015-408…416, foydalanuvchi: «2 qil» — bir ruxsat, 9 dars ketma-ket).
# Ishlatish: python3 olik_tozalash.py <jsx> <F-ID>   (masalan F-1015-408)
# Nima qiladi:
#   1) zaxira arxiv/<F-ID>-oldin/
#   2) screens massivida yo'q Screen* komponentlari — o'lik; faqat o'liklar ishlatadigan top-level bloklar ham (iterativ)
#   3) CSS seksiyalari (/* === … === */ sarlavhali): barcha klasslari JSX'da qolmagan bo'lsa — olinadi; qolgan yetim klasslar hisobotda
#   4) ScreenLivePractice ketgan bo'lsa INLINE_KEYS.practice ham
#   5) har olingan nom izohsiz kodda qayta qidiriladi (assert)
import re, sys, pathlib, shutil
f = pathlib.Path(sys.argv[1]).resolve(); fid = sys.argv[2]
root = pathlib.Path('/home/kali/Desktop/internetLesson')
bk = root / 'arxiv' / f'{fid}-oldin'; bk.mkdir(parents=True, exist_ok=True)
if not (bk / f.name).exists(): shutil.copy(f, bk / f.name)  # zaxira bir marta (qayta yurgizishda ustiga yozilmaydi)
s = f.read_text(); orig_lines = s.count('\n')

def strip_comments(t):
    return re.sub(r"/\*.*?\*/|(?<=[^:])//[^\n]*", "", t, flags=re.S)

def blocks_of(t):
    starts = [(m.start(), m.group(1)) for m in re.finditer(r"^(?:export default )?(?:const|function) ([A-Za-z0-9_]+)\b", t, re.M)]
    # blok boshi = bevosita oldidagi // izoh qatorlari bilan; blok oxiri = KEYINGI blokning (izohli) boshi — oraliqlar kesishmaydi (408-saboq)
    qs = []
    for p, n in starts:
        q = p
        while True:
            prev = t.rfind('\n', 0, q - 1) + 1
            line = t[prev:q - 1]
            if line.startswith('//') and 'F-' not in line[:4]: q = prev
            else: break
        qs.append((q, n))
    out = {}
    for i, (q, n) in enumerate(qs):
        e = qs[i + 1][0] if i + 1 < len(qs) else len(t)
        out[n] = (q, e)
    return out

m = re.search(r"const screens = \[([^\]]*)\]", s); used = set(x.strip() for x in m.group(1).split(','))
blocks = blocks_of(s)
dead = set(n for n in blocks if n.startswith('Screen') and n not in used and len(re.findall(r"\b%s\b" % n, strip_comments(s))) == 1)
# iterativ: faqat o'lik bloklar ishlatadigan bloklar
while True:
    rest = strip_comments(''.join(s[a:b] for n, (a, b) in sorted(blocks.items(), key=lambda x: x[1]) if n not in dead)
                           + s[:min(a for a, b in blocks.values())] + s[max(b for a, b in blocks.values()):])
    add = set()
    for n in blocks:
        if n in dead or n == 'screens': continue
        if len(re.findall(r"\b%s\b" % n, rest)) == 1 and any(re.search(r"\b%s\b" % n, s[blocks[d][0]:blocks[d][1]]) for d in dead):
            add.add(n)
    if not add: break
    dead |= add
order = sorted(dead, key=lambda n: blocks[n][0])
print(f"{f.name}: o'lik bloklar ({len(order)}):", order)
for n in reversed(order):
    a, b = blocks[n]; s = s[:a] + s[b:]
code = strip_comments(s)
for n in order:
    assert not re.search(r"\b%s\b" % n, code), ("hali ishlatiladi:", n)

# INLINE_KEYS.practice
if 'ScreenLivePractice' in dead and re.search(r"const INLINE_KEYS = \{[^}]*\bpractice: -1", s):
    s = re.sub(r"(const INLINE_KEYS = \{[^}]*?),?\s*practice: -1", r"\1", s, count=1)
    s = s.replace("const INLINE_KEYS = {", "const INLINE_KEYS = {", 1); print("  INLINE_KEYS.practice olindi")

# CSS: faqat o'lik qatlam klasslari (fc-*, lp-*, done-mini, dm-*, .fc) — qator-qator; seksiya-usuli rad (JONLI PRAKTIKA seksiyasida tirik .bhint bor)
style_i = s.rfind('<style>'); style_j = s.find('</style>', style_i)
jsx_part = s[:style_i] + s[style_j:]
PREF = ('fc-', 'lp-', 'done-mini', 'dm-sub', 'dm-')
def dead_cls(c): return c == 'fc' or c.startswith(PREF)
for c in ['fc', 'fc-', 'lp-', 'done-mini', 'dm-sub']:
    assert not re.search(r"[\"'`\s]%s" % re.escape(c), jsx_part) or c == 'fc' and not re.search(r"[\"'`\s]fc[\"'`\s]", jsx_part), ("JSX da hali bor:", c)
kept = []; removed_css = 0
for line in s[style_i:style_j].split('\n'):
    st = line.strip()
    m = re.match(r"@keyframes\s+([A-Za-z0-9_-]+)", st)
    if m and dead_cls(m.group(1)): removed_css += 1; continue
    if st and not st.startswith(('/*', '@', '}')) and '{' in st:
        sel = st.split('{', 1)[0]
        classes = re.findall(r"\.([A-Za-z][A-Za-z0-9_-]*)", sel)
        parts = [x.strip() for x in sel.split(',') if x.strip()]
        if classes and parts and all(any(dead_cls(c) for c in re.findall(r"\.([A-Za-z][A-Za-z0-9_-]*)", pt)) for pt in parts):
            removed_css += 1; continue
    kept.append(line)
s = s[:style_i] + '\n'.join(kept) + s[style_j:]
print("  olingan CSS qatorlar:", removed_css)
f.write_text(s)
print(f"  qator: {orig_lines} → {s.count(chr(10))}  (−{orig_lines - s.count(chr(10))})")
