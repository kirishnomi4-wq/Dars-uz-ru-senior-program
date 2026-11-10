#!/usr/bin/env python3
"""M48 (F-1104-17, 04.11): to'g'ri javob eng uzun variant bo'lib qolmasin — mentor bilmasa ham «eng uzunini» tanlab o'tib ketmasin.
Sanaydi: har tekshiruv (MCRetry) va yakuniy sinov savolida to'g'ri variant YAGONA eng uzun bo'lsa — «uzun belgi», YAGONA eng qisqa bo'lsa — «qisqa belgi» (teskari belgi ham javobni ochadi).
Me'yor: darsda har belgi turi ≤ savollar sonining 1/4 (pastga yaxlitlab; 11 savol → ≤ 2). Oshsa — chiqish kodi 1.
ISHLATISH: python3 dev/javob-uzunlik.py <dars-papka yoki 03-matn.gen.jsx> [...]   (masalan src/mentor-kurs/jest1)
  MDT bo'lmagan darslar (Nest-1, Nest-2) uchun: dars bo'laklaridagi `{ q: …, o: [...], c: N }` va `opts={[...]} … correct={N}` o'qiladi.
"""
import json, re, sys
from pathlib import Path

def from_mdt(p):
  t = p.read_text(encoding='utf-8')
  d = json.loads(t.split('const MDT = ', 1)[1].rstrip().rstrip(';'))
  qs = []
  for n, sc in d.items():
    if sc.get('opts'): qs.append((f'{n}-ekran', sc['opts'], sc['correct']))
    for i, q in enumerate(sc.get('final', [])): qs.append((f'sinov {i + 1}', q['o'], q['c']))
  return qs

STR = r"""(["'])((?:\\.|(?!\1).)*)\1"""
def from_parts(files):
  src = '\n'.join(f.read_text(encoding='utf-8') for f in files if not f.name.startswith('08-ru'))
  qs = []
  for i, m in enumerate(re.finditer(r"\{\s*q:\s*" + STR + r",\s*o:\s*\[([^\]]*)\],\s*c:\s*(\d)", src)):
    o = [x[1] for x in re.findall(STR, m.group(3))]
    qs.append((f'sinov {i + 1}', o, int(m.group(4))))
  for i, m in enumerate(re.finditer(r"opts=\{(?:t\()?\[([^\]]*)\][\s\S]{0,600}?correct=\{(\d)\}", src)):
    o = [x[1] for x in re.findall(STR, m.group(1))]
    qs.append((f'tekshiruv {i + 1}', o, int(m.group(2))))
  return qs

bad = 0
for a in sys.argv[1:]:
  p = Path(a)
  gen = p if p.name.endswith('.gen.jsx') else p / 'parts' / '03-matn.gen.jsx'
  qs = from_mdt(gen) if gen.exists() else from_parts(sorted((p / 'parts' if (p / 'parts').exists() else p).glob('*.jsx')))
  tell, short = [], []
  for name, o, c in qs:
    L = [len(x) for x in o]
    if L and L[c] == max(L) and L.count(max(L)) == 1: tell.append(name)
    if L and L[c] == min(L) and L.count(min(L)) == 1: short.append(name)
  lim = len(qs) // 4
  ok = len(tell) <= lim and len(short) <= lim
  bad += 0 if ok else 1
  print(f"{'✓' if ok else '✗'} {a}: savol {len(qs)} · to'g'risi eng uzun {len(tell)} · eng qisqa {len(short)} (me'yor ≤ {lim} har biri)"
        + ('' if not tell else ' · uzun: ' + ', '.join(tell)) + ('' if not short else ' · qisqa: ' + ', '.join(short)))
sys.exit(1 if bad else 0)
