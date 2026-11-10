#!/usr/bin/env python3
"""RU tarjima (M24) — sahna juftliklarini dars bo'laklariga qo'llaydi: ru/sahna/<dars>-*.json → src/mentor-kurs/<dars>/parts/
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/ru-sahna-qoy.py <dars-papka>
Juftlik: [fayl, eski, yangi] — eski matn faylda AYNAN bir marta bo'lishi shart; yangi allaqachon bor bo'lsa o'tkaziladi (qayta yurgizish xavfsiz).
Birinchi yurishda bo'laklar arxiv/F-1105-ru-oldin/<dars>/ ga nusxalanadi (tahrirdan oldingi holat)."""
import json, re, sys, glob, shutil
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]
P = ROOT / f'src/mentor-kurs/{d}/parts'
B = ROOT / f'arxiv/F-1105-ru-oldin/{d}'
if not B.exists():
  B.mkdir(parents=True)
  for f in glob.glob(str(P / '0[4-8]*.jsx')): shutil.copy2(f, B)
qoy = otk = 0; xato = []
def _norm(x):  # {t("uz", "ru")} → uz (avto-o'ram izi)
  return re.sub(r'\{t\("((?:[^"\\]|\\.)*)", "(?:[^"\\]|\\.)*"\)\}', lambda m: json.loads('"' + m.group(1) + '"'), x)
files = {}
def _pairs(jf):  # 05.11: .json — [[fayl, eski, yangi]] · .py — PAIRS = [(fayl, r'''eski''', r'''yangi''')] (qo'shtirnoq muammosiz)
  if jf.endswith('.py'): g = {}; exec(Path(jf).read_text(), g); return g['PAIRS']
  return json.loads(Path(jf).read_text())
for jf in sorted([x for x in glob.glob(str(ROOT / f'feedback/F-1029-02-mentor-kurs/ru/sahna/{d}-*.json')) if not re.search(r'-rows\d*\.json$', x)] + glob.glob(str(ROOT / f'feedback/F-1029-02-mentor-kurs/ru/sahna/{d}-*.py'))):
  for fn, old, new in _pairs(jf):
    if fn not in files: files[fn] = (P / fn).read_text()
    s = files[fn]
    if new in s and old not in s.replace(new, ''): otk += 1; continue
    if old not in s and _norm(new) in _norm(s): otk += 1; continue  # 05.11: keyin avto-o'ram ichiga {t("x", "y")} qo'shgan bo'lsa ham — qo'yilgan
    c = s.count(old)
    if c != 1: xato.append(f'{Path(jf).name}: {fn}: {c} marta — {old[:90]}'); continue
    files[fn] = s.replace(old, new); qoy += 1
if xato: sys.exit('\n'.join(xato))
for fn, s in files.items(): (P / fn).write_text(s)
print(f'{d}: qo\'yildi {qoy} · allaqachon bor {otk}')
