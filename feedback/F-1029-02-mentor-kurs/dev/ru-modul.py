#!/usr/bin/env python3
"""RU tarjima (M24, 05.11) — darsning modul darajasidagi o'zbekcha matnli bloklarini chiqaradi (ru() bilan tarjima qilinadiganlar):
`const X = [ … ];` / `const X = { … };` / const X = (shablon); / `const sNNSegments = (passed) => …` va muqova ro'yxati, FIN matnlari.
Ishlatish: python3 dev/ru-modul.py <dars>"""
import re, sys, glob
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]
UZ = re.compile(r"\b(va|bu|ham|uchun|bilan|emas|kerak|yo['’]q|bor|qator|satr|ekran|bosqich|o'\w+|g'\w+|\w+'(ga|da|ni|dan|ning))\b|\w+\\'\w")
SKIP = re.compile(r'^const (KOD|F|JC|BASE_FILES|SPOKEN|CSS\d*|LESSON_ID|ESC|T\d+\w*|BREAK\d+|FIX\d+|FILES|ALL_FILES|S\d+|MDT|FINAL)\b')
for f in sorted(glob.glob(str(ROOT / f'src/mentor-kurs/{d}/parts/0[4-8]*.jsx'))):
  L = Path(f).read_text().split('\n'); i = 0
  while i < len(L):
    l = L[i]
    m = re.match(r'^const (\w+) = (\[|\{|`|\(passed\) =>)', l)
    if m and not SKIP.match(l):
      j = i
      if not (l.rstrip().endswith('];') or l.rstrip().endswith('};') or l.rstrip().endswith('`;') or l.rstrip().endswith(');')):
        j = i + 1
        while j < len(L) and not re.match(r'^(\];|\};|.*`;$|\]\);$)', L[j]): j += 1
      blk = '\n'.join(L[i:j + 1])
      if UZ.search(blk): print(f'### {Path(f).name}:{i+1}\n{blk}\n')
      i = j + 1; continue
    i += 1
