#!/usr/bin/env python3
"""M48 (F-1104-17): MD dagi tekshiruv va yakuniy sinov variantlarini almashtiradi — to'g'ri javob o'rni va izohlar o'zgarmaydi.
ISHLATISH: python3 dev/variant-yoz.py <dars-MD> <spec.json>
spec: {"mc": {"<ekran>": [4 variant]}, "final_screen": <ekran>, "final": {"<savol #>": [4 variant]}}
MC: «- Variantlar (to'g'risi — N): 1 … · 2 … · 3 … · 4 …» qatori; yakuniy: «  | k | savol | variantlar | ✔ | izoh | s |» jadvali.
"""
import json, sys
md, spec = sys.argv[1], json.load(open(sys.argv[2], encoding='utf-8'))
L = open(md, encoding='utf-8').read().split('\n')
cur, done_mc, done_f = None, set(), set()
for i, l in enumerate(L):
  if l.startswith('## '):
    try: cur = int(l[3:].split(' ')[0])
    except ValueError: cur = None
  if str(cur) in spec.get('mc', {}) and l.startswith("- Variantlar (to'g'risi — "):
    opts = spec['mc'][str(cur)]; assert len(opts) == 4 and ' · ' not in ''.join(opts), cur
    head = l.split(':', 1)[0]
    L[i] = head + ': ' + ' · '.join(f'{k + 1} {o}' for k, o in enumerate(opts)); done_mc.add(str(cur))
  if cur == spec.get('final_screen') and l.startswith('  | ') and l[4:5].isdigit() and l[5:8] == ' | ':
    cells = [c.strip() for c in l.strip().strip('|').split(' | ')]
    k = cells[0]
    if k in spec.get('final', {}):
      opts = spec['final'][k]; assert len(opts) == 4 and ' · ' not in ''.join(opts) and '|' not in ''.join(opts), k
      cells[2] = ' · '.join(opts); L[i] = '  | ' + ' | '.join(cells) + ' |'; done_f.add(k)
miss = (set(spec.get('mc', {})) - done_mc) | (set(spec.get('final', {})) - done_f)
if miss: sys.exit(f'topilmadi: {sorted(miss)}')
open(md, 'w', encoding='utf-8').write('\n'.join(L))
print(f'yozildi: {md} · tekshiruv {len(done_mc)} · sinov {len(done_f)}')
