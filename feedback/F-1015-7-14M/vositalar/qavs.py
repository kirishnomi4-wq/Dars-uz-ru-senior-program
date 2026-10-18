# F-1015-123 saboq: CSS qoidasini regex bilan almashtirgandan keyin o'zgargan qatorlarda qavs balansi (`${T.x}` ichidagi } — tuzoq).
# python3 qavs.py <zaxira-ildiz> <fayl...> — o'zgargan har qatorda { va } soni teng, «}; }» qoldiq yo'q.
import sys, difflib, re
ildiz, fayllar = sys.argv[1], sys.argv[2:]; xato = 0
for f in fayllar:
    a = open(f'{ildiz}/{f}', encoding='utf-8').read().split('\n'); b = open(f, encoding='utf-8').read().split('\n')
    for s in (l[1:] for l in difflib.unified_diff(a, b, lineterm='', n=0) if l.startswith('+') and not l.startswith('+++')):
        if '<' in s or '=>' in s or ':' not in s or s.lstrip().startswith(('if ', 'const ', 'let ', 'for ', '//')): continue  # JSX/JS qatori — CSS emas
        c = re.sub(r'\$\{[^}]*\}', 'X', s)
        if c.count('{') != c.count('}') or re.search(r'\}\s*;', c):
            xato += 1; print('!!', f, s.strip()[:160])
print('qavs: xato', xato, '·', len(fayllar), 'fayl')
