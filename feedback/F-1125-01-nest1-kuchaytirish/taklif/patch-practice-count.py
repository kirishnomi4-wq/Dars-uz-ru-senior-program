#!/usr/bin/env python3
"""F-1125-01 · tungi jonli QA (26.11): saytda (vite build, minify) mentor hamma amaliyotni bajarsa ham onFinished.passed = false.
Sabab: PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\\d/.test(S.name)).length — production build'da funksiya nomi qisqaradi
(PgIntro bundle: ScreenP1 → `Tt`), son 0 chiqadi, practices.length (4) === 0 → practiceDone false → passed false.
Lokal dev (:5333) nomni saqlaydi — e2e lokal o'tgani uchun ko'rinmagan; jonli e2e (PG-1) ko'rsatdi.
Tuzatish: har darsdagi SCREENS qatoridan ScreenP<raqam> nomlari olinadi va havola bo'yicha sanaladi (minify'ga chidamli).
Ishlatish (repo ildizidan): python3 feedback/F-1125-01-nest1-kuchaytirish/taklif/patch-practice-count.py
Har faylda: SCREENS qatori aynan 1 ta, eski PRACTICE_COUNT qatori aynan 1 ta — aks holda hech narsa yozilmaydi."""
import re
from pathlib import Path
R = Path(__file__).resolve().parents[3]
FILES = ['parts/07-s24-s28.jsx', 'nest2/parts/06-s24-s30.jsx', 'pg1/parts/08-s23-s28.jsx', 'pg2/parts/07-s28-s31.jsx',
         'jest1/parts/07-s22-s25.jsx', 'jest2/parts/07-s23-s25.jsx', 'cicd1/parts/07-s17-s25.jsx', 'cicd2/parts/07-s16-s25.jsx',
         'tgpg/parts/07-s25-s28.jsx', 'ws1/parts/07-s17-s25.jsx', 'ws2/parts/07-s17-s25.jsx', 'wh/parts/07-s18-s25.jsx']
OLD = 'const PRACTICE_COUNT = SCREENS.filter((S) => /^ScreenP\\d/.test(S.name)).length;'
out = {}
for f in FILES:
  p = R / 'src/mentor-kurs' / f; s = p.read_text()
  sc = re.findall(r'^const SCREENS = \[([^\]]+)\];(?:\s*//.*)?$', s, re.M)
  if len(sc) != 1: raise SystemExit(f'{f}: SCREENS qatori {len(sc)} ta (1 kutilgan)')
  if s.count(OLD) != 1: raise SystemExit(f'{f}: eski PRACTICE_COUNT {s.count(OLD)} ta (1 kutilgan)')
  pr = [x.strip() for x in sc[0].split(',') if re.fullmatch(r'ScreenP\d+', x.strip())]
  if not pr: raise SystemExit(f'{f}: amaliyot ekrani topilmadi')
  new = (f'const PRACTICE_COUNT = [{", ".join(pr)}].filter((S) => SCREENS.includes(S)).length; '
         f"// 26.11 (F-1125-01): havola bo'yicha — build (minify) funksiya nomini qisqartiradi, nom bo'yicha son 0 chiqib passed doim false edi")
  out[p] = s.replace(OLD, new); print(f'{f}: {len(pr)} amaliyot — {", ".join(pr)}')
for p, s in out.items(): p.write_text(s)
print(f'{len(out)} fayl')
