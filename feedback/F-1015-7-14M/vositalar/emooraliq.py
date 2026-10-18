# F-1015-122: dars ekranlari oralig'idagi (Screen0 … podium/arena dan oldin) emoji bor satrlar. python3 emooraliq.py <fayl> [--hammasi]
import re, sys
WL = set('▶▸◂◀✓✔✕✗×↻↺←→↑↓↔⏹✎•·—–↩⬆⬇➜')
EM = re.compile(r'(?:[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌚-⏿←-⇿㊗㊙])(?:️|‍[\U0001F000-\U0001FAFF☀-➿])*')
def ems(l): return [e for e in (x.replace('️','') for x in EM.findall(l)) if e not in WL]
p = sys.argv[1]; L = open(p, encoding='utf-8').read().split('\n')
st = next((i for i,l in enumerate(L) if re.search(r'^(const|function) Screen0\b|===== SCREEN 0\b', l)), 0)
en = next((i for i,l in enumerate(L) if i > st and re.search(r'^(const|function) (ScreenPodium|ScreenFlashcards|Arena|QuizArena|SummaryScreen|ScreenArena)\b|^const QUIZ_BANK\b|===== (PODIUM|ARENA|FLASHCARD)', l)), len(L))
for i in range(st, en):
    l = L[i]; t = l.strip()
    if t.startswith(('//', '.', '@', '/*', '*')): continue
    e = ems(l)
    if e: print(f'{i+1:5} {"".join(dict.fromkeys(e)):8} {t[:160]}')
print(f'# oraliq {st+1}-{en}', file=sys.stderr)
