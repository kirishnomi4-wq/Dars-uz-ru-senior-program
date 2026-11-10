#!/usr/bin/env python3
"""RU tarjima (M24, 05.11) — qatorli tarjima fayli → JSON: ru/qism/<dars>-<N>.txt ("kalit = qiymat", bir qatorda) → ru/qism/<dars>-<N>.json.
Ishlatish: python3 dev/ru-txt.py <dars> [--uz]   (--uz: ru/<dars>-uz.json ni shu formatda chiqaradi — tarjima uchun manba)
Tekshiruv: kalit o'zbekchada bormi · <b>/<code> teglari soni teng · qiymat bo'sh emas · o'zbekcha so'z qolmaganmi (ogohlantirish)."""
import json, re, sys, glob
from pathlib import Path
R = Path(__file__).resolve().parents[1] / 'ru'
d = sys.argv[1]
uz = json.loads((R / f'{d}-uz.json').read_text())
if '--uz' in sys.argv:
  for k, v in uz.items(): print(f'{k} = {v}')
  sys.exit()
UZW = re.compile(r"\b(va|uchun|bilan|emas|kerak|qiling|bosing|nima|qaysi|yoki|endi|keyin|xato|bor|yo'q|o'\w+|g'\w+|\w+'(ga|da|ni|dan|ning))\b")
TAG = re.compile(r'</?(b|code|i|br)\b')
jami = 0; ogoh = []
for f in sorted(glob.glob(str(R / 'qism' / f'{d}-[0-9]*.txt'))):
  out = {}
  for n, line in enumerate(Path(f).read_text().split('\n'), 1):
    if not line.strip() or line.startswith('#'): continue
    k, sep, v = line.partition(' = ')
    if not sep: sys.exit(f'{f}:{n}: " = " yo\'q')
    k = k.strip(); v = v.strip()
    if k not in uz: sys.exit(f'{f}:{n}: o\'zbekchada yo\'q kalit {k}')
    if not v: sys.exit(f'{f}:{n}: bo\'sh qiymat {k}')
    if len(TAG.findall(uz[k])) != len(TAG.findall(v)): ogoh.append(f'teg soni: {k}')
    if re.search('[А-Яа-я]', v) is None and re.search('[А-Яа-я]', v) is None and UZW.search(v): ogoh.append(f'uz qoldi?: {k} = {v[:70]}')
    out[k] = v
  Path(f[:-4] + '.json').write_text(json.dumps(out, ensure_ascii=False, indent=1)); jami += len(out)
tr = {}
for f in glob.glob(str(R / 'qism' / f'{d}-[0-9]*.json')): tr.update(json.loads(Path(f).read_text()))
yoq = [k for k in uz if k not in tr]
print(f'{d}: tarjima {len(tr)}/{len(uz)} · yo\'q {len(yoq)}' + (f' (birinchisi {yoq[0]})' if yoq else ''))
for o in ogoh: print('  ⚠', o)
