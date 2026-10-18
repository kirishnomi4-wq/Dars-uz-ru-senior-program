# F-1015-122: dars ekranlari oralig'ida uz/ru satr BOSHIDAGI bezak emojini oladi (2-variant).
# python3 emoboshi.py <fayl> [--yoz]   — --yoz bo'lmasa faqat ko'rsatadi
import re, sys
p = sys.argv[1]; YOZ = '--yoz' in sys.argv
L = open(p, encoding='utf-8').read().split('\n')
st = next((i for i,l in enumerate(L) if re.search(r'^(const|function) Screen0\b|===== SCREEN 0\b', l)), 0)
en = next((i for i,l in enumerate(L) if i > st and re.search(r'^(const|function) (ScreenPodium|ScreenFlashcards|Arena|QuizArena|SummaryScreen|ScreenArena)\b|^const QUIZ_BANK\b|===== (PODIUM|ARENA|FLASHCARD)', l)), len(L))
E = r'(?:[\U0001F000-\U0001FAFF☀-➿⭐⭕⌚-⏿])(?:️|‍[\U0001F000-\U0001FAFF☀-➿])*'
WL = '▶▸◂◀✓✔✕✗×↻↺⏹✎➜'
# maket / sxema / o'yin — tegilmaydi
QOL = re.compile(r'<Kw>|Phone label|rn-text|rn-topbar|cart-badge|tg-|as-txt|ff-node|bnode|af-ic|ksc-|ach-rule|🏅|icon:|fc-done|\bch: |\bico\b|mstats|qz-|pod-|ACHIEVEMENTS')
pat = re.compile(r"((?:uz|ru): (?:<>)?['\"`]?|name=\"|name=\{['\"])(" + E + r")[  ]?")
n = 0
for i in range(st, en):
    l = L[i]
    if l.strip().startswith(('//', '/*', '*', '.', '@')) or QOL.search(l): continue
    def f(m):
        e = m.group(2).replace('️', '')
        if e in WL: return m.group(0)
        return m.group(1)
    new = pat.sub(f, l)
    if new != l:
        n += 1
        if not YOZ: print(f'{i+1:5} - {l.strip()[:120]}\n      + {new.strip()[:120]}')
        L[i] = new
if YOZ: open(p, 'w', encoding='utf-8').write('\n'.join(L))
print(f'# {p}: {n} satr', file=sys.stderr)
