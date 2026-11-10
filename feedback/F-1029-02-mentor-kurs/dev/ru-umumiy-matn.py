#!/usr/bin/env python3
"""RU tarjima (M24, 05.11) — umumiy ekranlardagi darsga xos o'zbekcha matnlar (RU_S kalitlari uchun manba):
TITLE (LESSON_TITLE) · COVER (muqova ro'yxati) · FIN_INTRO · FIN_PASS · NEXT_T / NEXT_D · FILE · EYEBROW. Ishlatish: python3 dev/ru-umumiy-matn.py <dars>"""
import re, sys, glob
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]
src = '\n'.join(Path(f).read_text() for f in sorted(glob.glob(str(ROOT / f'src/mentor-kurs/{d}/parts/0[4-8]*.jsx'))))
def g(name, pat, flags=0):
  m = re.search(pat, src, flags); print(f'{name} = {m.group(1) if m else "—"}')
g('TITLE', r"const LESSON_TITLE = (.+);")
g('FIN_INTRO', r": !st\.showResult\n\s*\? (.+)")
g('FIN_PASS', r"voice\(sc >= 6 \? t\((\"(?:[^\"\\]|\\.)*\")")
g('NEXT', r"\{t\(\"((?:Kursdagi|Bu kursdagi)[^\"]*)\".*?</h5><div style=\{\{ fontSize: 15, fontWeight: 700 \}\}>\{t\(([^,]+), RS\('NEXT_T'\)\)\}</div><div style=\{\{ fontSize: 13\.5, color: T\.ink2 \}\}>\{t\(([^,]+), RS\('NEXT_D'\)\)\}")
m = re.search(r"RS\('NEXT_T'\)", src)
mm = re.search(r"\{t\((\"[^\"]*\"|'[^']*'), RS\('NEXT_T'\)\)\}.*?\{t\((\"[^\"]*\"|'[^']*'), RS\('NEXT_D'\)\)\}", src)
if mm: print('NEXT_T =', mm.group(1)); print('NEXT_D =', mm.group(2))
g('FILE', r"a\.download = t\(('[^']+')")
m = re.search(r"\{t\((\[.*?\]), RS\('COVER'\)\)", src)
print('COVER =', m.group(1) if m else '—')
