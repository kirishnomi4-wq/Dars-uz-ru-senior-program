#!/usr/bin/env python3
"""RU tarjima (M24, 05.11) — sahna matnlarini raqam bo'yicha t(uz, ru) bilan o'rash.
1) python3 dev/ru-sahna-auto.py <dars> --snap   → ru/sahna/<dars>-rows.json (ru-sahna-skan.py qatorlari, raqamlangan) va ro'yxat:
   N · fayl:qator · tur · [M] · matn   (M — modul darajasi: render'dan tashqarida, t() ishlamaydi → ru(MASSIV, …) <dars>-sahna.js da)
2) ru/sahna/<dars>-auto.txt: "N ⇒ ruscha" qatorlari → python3 dev/ru-sahna-auto.py <dars>  → bo'laklarda o'rash.
   str: 'uz' → t('uz', "ru") (JSX atributida title="uz" → title={t("uz", "ru")}) · jsx: >uz< → >{t("uz", "ru")}< (bo'shliqlar saqlanadi).
   UZ qiymat aynan o'sha qoladi (t() LANG=uz da birinchi argumentni qaytaradi). Qayta yurgizish xavfsiz. Oldingi holat: arxiv/F-1105-ru-oldin/<dars>/."""
import json, re, sys, glob, shutil, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]
P = ROOT / f'src/mentor-kurs/{d}/parts'
SD = ROOT / 'feedback/F-1029-02-mentor-kurs/ru/sahna'; SD.mkdir(parents=True, exist_ok=True)
import os
TUR = os.environ.get('RU_TUR', '')  # 05.11: 2-tur (skaner tuzatilgandan keyin) — <dars>-rows2.json + <dars>-auto2.txt
RF = SD / f'{d}-rows{TUR}.json'
def module_level(lines, i):  # i — 0-asosli; eng yaqin 0-ustundan boshlangan qator
  for j in range(i, -1, -1):
    l = lines[j]
    if l and not l[0].isspace() and not l.startswith('//') and not l.startswith('}') and not l.startswith(')') and not l.startswith(']'):
      return not (l.startswith('function ') or re.match(r'const \w+ = \([^)]*\) =>', l) or re.match(r'const \w+ = \w+ =>', l))
  return True
if '--snap' in sys.argv:
  out = subprocess.run([sys.executable, '-I', str(Path(__file__).parent / 'ru-sahna-skan.py'), d], capture_output=True, text=True).stdout
  rows = []
  for line in out.rstrip('\n').split('\n'):
    if not line.strip(): continue
    loc, kind, txt = line.split(' · ', 2)
    fn, ln = loc.rsplit(':', 1)
    src = (P / fn).read_text().split('\n')
    m = module_level(src, int(ln) - 1)
    # jsx bo'lagi shu qatordagi str ichida bo'lsa — takror, o'tkaziladi
    rows.append({'f': fn, 'l': int(ln), 'k': kind, 'x': txt, 'm': m})
  dup = set()
  for i, r in enumerate(rows):
    if r['k'] == 'jsx' and any(o['f'] == r['f'] and o['l'] == r['l'] and o['k'] == 'str' and r['x'] in o['x'] for o in rows): dup.add(i)
  rows = [r for i, r in enumerate(rows) if i not in dup]
  RF.write_text(json.dumps(rows, ensure_ascii=False, indent=0))
  for i, r in enumerate(rows): print(f"{i} · {r['f']}:{r['l']} · {r['k']}{' · M' if r['m'] else ''} · {r['x']}")
  print(f'-- {len(rows)} qator (takror jsx {len(dup)} olib tashlandi)', file=sys.stderr); sys.exit()
rows = json.loads(RF.read_text())
B = ROOT / f'arxiv/F-1105-ru-oldin/{d}'
if not B.exists():
  B.mkdir(parents=True)
  for f in glob.glob(str(P / '0[4-8]*.jsx')): shutil.copy2(f, B)
tr = {}
for line in (SD / f'{d}-auto{TUR}.txt').read_text().split('\n'):
  if not line.strip() or line.startswith('#'): continue
  n, sep, ru = line.partition(' ⇒ ')
  if not sep: sys.exit(f'⇒ yo\'q: {line[:60]}')
  tr[int(n)] = ru.rstrip()
files = {}; ok = skip = 0; err = []
J = lambda s: json.dumps(s, ensure_ascii=False)
for n, ru in sorted(tr.items()):
  r = rows[n]
  if r['m']: err.append(f"{n}: modul darajasi — ru(…) bilan sahna.js da"); continue
  fn = r['f']
  if fn not in files: files[fn] = (P / fn).read_text().split('\n')
  L = files[fn]; s = L[r['l'] - 1]; x = r['x']
  if r['k'] == 'str':
    done = False
    for q in ("'", '"', '`'):
      tok = q + x + q
      i = s.find(tok)
      if i < 0: continue
      if s[max(0, i - 2):i] == 't(' : done = True; skip += 1; break
      if q == '`' and '${' in x: err.append(f'{n}: shablon ${{}} — qo\'lda'); done = True; break
      if re.search(r'\w=$', s[:i]): new = '{t(' + tok + ', ' + J(ru) + ')}'
      else: new = 't(' + tok + ', ' + J(ru) + ')'
      L[r['l'] - 1] = s[:i] + new + s[i + len(tok):]; ok += 1; done = True; break
    if not done: err.append(f'{n}: satr topilmadi — {x[:50]}')
  else:
    if '&' in x: err.append(f'{n}: & entity — qo\'lda'); continue
    m = re.search(r'(?<=[>}])(\s*)' + re.escape(x) + r'(\s*)(?=[<{])', s)  # 05.11: } … { chegarasi ham
    if not m:
      if 't(' + J(x) in s or J(x) in s or re.search(r't\("\s*' + re.escape(J(x)[1:-1]) + r'\s*"', s): skip += 1; continue  # 05.11: bo'shliqli o'ram ham «oldin bor»
      err.append(f'{n}: jsx topilmadi — {x[:50]}'); continue
    a, b = m.group(1), m.group(2)
    L[r['l'] - 1] = s[:m.start()] + '{t(' + J(a + x + b) + ', ' + J(a + ru + b) + ')}' + s[m.end():]; ok += 1
for fn, L in files.items(): (P / fn).write_text('\n'.join(L))
print(f'{d}: o\'raldi {ok} · oldin bor {skip} · xato {len(err)}')
for e in err: print('  ✗', e)
