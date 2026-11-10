#!/usr/bin/env python3
"""RU tarjima (M24) — sahna qoldig'i: dars bo'laklaridagi (04–08) o'zbekcha satr-literallar va JSX matnlari ro'yxati.
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/ru-sahna-skan.py <dars-papka> [--hammasi]
Chiqadi: fayl:qator · tur (str | jsx | tpl) · matn. Izoh qatorlari (//) o'tkazib yuboriladi. Tarjimasi bor matnlar
(ru/<dars>-sahna.js da t('…', …) yoki RU_S/ru() ichida aynan uchraganlar) --hammasi bo'lmasa ko'rsatilmaydi."""
import re, sys, glob
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
d = sys.argv[1]; ALL = '--hammasi' in sys.argv
P = ROOT / f'src/mentor-kurs/{d}/parts'
UZ = re.compile(r"\b(va|bu|ham|uchun|bilan|emas|kerak|qiling|bosing|nima|qaysi|yoki|endi|keyin|xato|ekran\w*|qadam\w*|satr\w*|isbot\w*|bor|yo['’]q|fayl\w*|chiqadi|ishlaydi|oching|yozing|tekshiring|qator\w*|daqiqa\w*|Davom|Orqaga|Xulosa|bosqich\w*|Amaliyot|siz\w*|javob\w*|savol\w*|qabul|qiladi|beradi|ochiladi|shu|bitta|ikki|uch|hamma|faqat|agar|lekin|chunki|ya['’]ni|haqiqiy|ko'r\w*|bo'l\w*|o'\w+|g'\w+|\w+['’](ga|da|ni|dan|ning|dagi))\b")
# 05.11 (F-1105-01): so'z ro'yxati tor edi («Kalit qayerda», «Qayta so'rash — majburiy» tushib qolgan) — qo'shimcha va otlar bilan kengaytirildi
UZ2 = re.compile(r"\b(\w+(lar|lari|larni|larga|larda|ni|ga|da|dan|ning|dagi|siz|ingiz|adi|aydi|ydi|gan|madi|moqda|ish|ishi)|qayerda|kalit\w*|butun|himoya|sahifa\w*|terminal\w*|nusxa\w*|yangi|eski|oldin|majburiy|ulanish\w*|ulangan|uzildi|logi|sinov\w*|tasdiq\w*|buyurtma\w*|mahsulot\w*|savat\w*|tugma\w*|qizil|yashil|sariq|xom|tana\w*|imzo\w*|maydon\w*|summa\w*|raqam\w*|xabar\w*|natija\w*|sabab\w*|vaqt\w*|kun|soat|soniya\w*|baza\w*|jadval\w*|ustun\w*|qadam\w*|ochiq|yopiq|tez|sekin|katta|kichik|to'g'ri|noto'g'ri|xato\w*)\b", re.I)
_UZ1 = UZ
class _U:
  def search(self, t): return _UZ1.search(t) or UZ2.search(t)
# 05.11 (F-1105-01) 3-qatlam: inglizcha lug'atda, kod identifikatorlarida va ruscha tarjimalarda (lotincha qoldirilgan atama) yo'q so'z — o'zbekcha.
#   Ro'yxat qanchalik kengaymasin, to'liq bo'lmaydi («Mijoz: «to'ladim»», «Bizniki»); lug'at usuli qolganini ushlaydi.
_EN = set()
for _f in ('/usr/share/dict/american-english', '/usr/share/dict/words'):
  try: _EN |= {w.strip().lower() for w in open(_f, encoding='utf-8', errors='ignore')}; break
  except OSError: pass
_LAT = re.compile(r"[A-Za-z][A-Za-z'’]{2,}")
_ID = set()
for _f in glob.glob(str(ROOT / 'src/mentor-kurs/parts/0[12]*.jsx')) + glob.glob(str(P / '*.jsx')):
  _c = re.sub(r"""'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`|>[^<>{}]*<""", ' ', Path(_f).read_text())
  # 05.11: satrni regex bilan olib tashlash shablon ichidagi apostrofda adashadi — identifikator faqat kod belgisi bilan:
  #   .nom · nom( · nom = · camelCase · snake_case · <Teg · atribut=
  _r = Path(_f).read_text()
  _ID |= {w.lower() for w in re.findall(r'(?<=\.)[A-Za-z_]\w*|[A-Za-z_]\w*(?=\()|[A-Za-z_]\w*(?=\s*=[^=>])|\b[a-z]+[A-Z]\w*|\b\w*_\w*|(?<=<)[A-Za-z]\w*|(?<=</)[A-Za-z]\w*', _r)}
for _f in glob.glob(str(ROOT / 'feedback/F-1029-02-mentor-kurs/ru/qism/*.json')) + glob.glob(str(ROOT / 'feedback/F-1029-02-mentor-kurs/ru/*-ru.json')):
  try:
    import json as _j
    for _v in _j.loads(Path(_f).read_text()).values():
      # faqat <code>…</code> ichidagi lotincha — ruscha tarjimadagi o'zbekcha dastur chiqishi (manzil, To'landi) istisnoga kirmasin
      if isinstance(_v, str): _ID |= {w.lower() for c in re.findall(r'<code>(.*?)</code>', _v) for w in _LAT.findall(c)}
  except Exception: pass
def _lug(t):
  for w in _LAT.findall(t):
    lw = w.lower().replace('’', "'")
    if "'" in lw.strip("'"): return True  # to'lov, o'quvchi — so'z ichida apostrof
    if lw not in _EN and lw.rstrip('s') not in _EN and lw not in _ID: return True
  return False
class _U2:
  def search(self, t): return _UZ1.search(t) or UZ2.search(t) or _lug(t)
UZ = _U2()
done = ''
s = ROOT / f'feedback/F-1029-02-mentor-kurs/ru/{d}-sahna.js'
if s.exists(): done = s.read_text()
STR = re.compile(r"""'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`""")
JSX = re.compile(r'(?<=[>}])([^<>{}]*[A-Za-z][^<>{}]*)(?=[<{])')  # 05.11: {ifoda} · matn <code> — } va { chegarasi ham
def strip_t(s):
  """t( … ) chaqiruvlarini (qavs va satrlarni hisobga olib) olib tashlaydi; qatorda yopilmasa — qolgan qism ham."""
  out, i = [], 0
  while True:
    m = re.search(r'(?<![\w.])t\(', s[i:])
    if not m: out.append(s[i:]); break
    a = i + m.start(); out.append(s[i:a]); j = a + 2; depth = 1; q = None
    while j < len(s) and depth:
      c = s[j]
      if q:
        if c == '\\': j += 1
        elif c == q: q = None
      elif c in '"\'`': q = c
      elif c == '(': depth += 1
      elif c == ')': depth -= 1
      j += 1
    if depth: break
    out.append(' '); i = j
  return ''.join(out)
def _done(t):  # 05.11: butun sahna.js da pastki satr emas — faqat tirnoqli aniq literal («va» izohda uchragani uchun yashirilardi)
  return any(q + t + q in done for q in ("'", '"', '`'))
rows = []
for f in sorted(glob.glob(str(P / '0[4-8]*.jsx'))):
  name = Path(f).name
  for i, line in enumerate(Path(f).read_text().split('\n'), 1):
    st = line.strip()
    if st.startswith('//'): continue
    # 05.11 (F-1105-01): avval t(…) bor qator butunlay tashlanardi — bir qatorli JSX dagi qolgan yorliqlar (Card h=, Term title=) tushib qolgan.
    # Endi faqat t(…) chaqiruvlarining o'zi kesiladi, qatorning qolgani skanerlanadi.
    code = strip_t(re.sub(r'\s//\s.*$', '', line))
    for m in STR.finditer(code):
      t = next(g for g in m.groups() if g is not None)
      if UZ.search(t) and (ALL or not _done(t)): rows.append((name, i, 'str', t))
    for m in JSX.finditer(code):
      t = m.group(1).strip()
      if re.search(r"[\"'],\s*[\"']", t): continue  # satr ichidagi HTML (sg('b1', "…<b>…</b>…", "…")) — JSX emas
      if not t or re.fullmatch(r'[\s\w.]*\)\s*=>\s*|.*\b(return|else|=>)\b.*', t): continue
      if UZ.search(t) and (ALL or not _done(t)): rows.append((name, i, 'jsx', t))
for r in rows: print(f'{r[0]}:{r[1]} · {r[2]} · {r[3]}')
print(f'-- {d}: {len(rows)} ta o\'zbekcha matn qoldi', file=sys.stderr)
