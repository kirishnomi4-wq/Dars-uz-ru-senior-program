#!/usr/bin/env python3
"""PostgreSQL-1 mentor darsi: MD (manba-haqiqat) → src/mentor-kurs/pg1/parts/03-matn.gen.jsx
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/pg1-matn.py
Chiqadi: har ekran — kicker, eyebrow, title, segmentlar [id, kalit-HTML, ovoz]; tekshiruvlar — savol/ovoz/variant/izoh;
yakuniy sinov — FINAL. Kalit iboradagi qizil so'zlar (M6) — EMPH lug'atida (MD'da ** ichida ** yozib bo'lmaydi).
Qo'lda tahrirlanmaydi: matn o'zgarsa — MD tahrirlanadi va skript qayta yurgiziladi.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/06-PostgreSQL1-mentor-v1.md'
OUT = ROOT / 'src/mentor-kurs/pg1/parts/03-matn.gen.jsx'

# Kalit iboradagi qizil (<b>) bo'laklar: '<ekran><segment>' → MD matnidagi aynan bo'lak(lar)
EMPH = {
  '1a': ['xuddi shu blogni PostgreSQL\'da'], '1b': ['ikki jadval va JOIN'], '1c': ['o\'z ko\'zingiz bilan'], '1d': ['siz o\'rnatasiz'], '1e': ['Shoshilmang'],
  '2a': ['farqi ma\'lumot shaklida'], '2b': ['jingalak qavs ichidagi hujjat'], '2c': ['tepada ustunlar, har yozuv bitta qator'], '2d': ['jadvalga so\'rov yozish tili'], '2e': ['jadval, ustun va qator'],
  '3a': ['siz bilgan Mongo'], '3b': ['`ref: \'User\'`'], '3c': ['butun foydalanuvchi hujjatini'], '3d': ['ikkalasi ham bor'],
  '4a': ['Ikki tajriba'], '4b': ['`author: null`'], '4c': ['boshqa maydonlar bilan'], '4d': ['bazaning o\'zi'],
  '5a': ['jufti bor'], '5b': ['turi aniq ustun'], '5c': ['tashqi kalit', '`JOIN`'], '5d': ['bazaning o\'ziga'], '5e': ['qoidalar qayerda turishida'],
  '7a': ['rasmiy saytdan'], '7b': ['Command Line Tools kerak'], '7c': ['Parolni yozib qo\'ying'], '7d': ['PATH\'ga qo\'shmaydi'], '7e': ['uch narsani tekshiring'],
  '8a': ['Postgres.app'], '8b': ['Initialize'], '8c': ['bitta PATH buyrug\'i'], '8d': ['`postgres` roli yo\'q'], '8e': ['`postgres` foydalanuvchisini yarating'],
  '9a': ['`mongosh` kabi'], '9b': ['belgi chiqmaydi'], '9c': ['nuqta-vergul bilan'], '9d': ['bazalar ro\'yxati'], '9e': ['qaysi bazada turganingizni'],
  '10a': ['o\'z kompyuteringizga'], '10b': ['parolni yozib qo\'ymasdan'], '10c': ['natija qatorining boshi'], '10d': ['«Boshqacha chiqdimi?»'],
  '11a': ['ikki bog\'langan jadval'], '11b': ['`CREATE DATABASE`'], '11c': ['o\'zi o\'sadi', 'bo\'sh bo\'lmaydi'], '11d': ['jadval allaqachon bor', 'tushib qolgan vergul'], '11e': ['strelka ko\'rsatgan so\'zdan oldin'],
  '12a': ['muallifiga bog\'lanadi'], '12b': ['tashqi kalit qatori'], '12c': ['qatorlar soni'], '12d': ['`\\c blog`'], '12e': ['bazaga yozadi'],
  '13a': ['uch savol bilan'], '13b': ['`NOT NULL`', '`UNIQUE`'], '13c': ['tashqi kalit bilan rad etdi'], '13d': ['posti bor foydalanuvchini'], '13e': ['`DETAIL`dagi qiymat'],
  '15a': ['o\'zingiz yaratasiz'], '15b': ['javob satrini tekshiring'], '15c': ['o\'zingiz chiqaring'], '15d': ['«Boshqacha chiqdimi?»'],
  '16a': ['bitta javobda'], '16b': ['`ON`'], '16c': ['`LEFT JOIN`'], '16d': ['`ON` satrini'], '16e': ['`ON` satrida'],
  '18a': ['natijalarni solishtirasiz'], '18b': ['ataylab buzing'], '18c': ['qatorlar soni'], '18d': ['«Boshqacha chiqdimi?»'],
  '19a': ['bitta telefon, ikki xaridor'], '19b': ['`CHECK (stock >= 0)`'], '19c': ['kutib turibdi'], '19d': ['`UPDATE 0`'], '19e': ['shart va qator qulfi'],
  '20a': ['ikki ish'], '20b': ['`CHECK` bilan rad etildi'], '20c': ['`ROLLBACK`'], '20d': ['Mongo ham bittaga sotdi'], '20e': ['hammasi bekor'],
  '21a': ['shunday ustun bor'], '21b': ['`extra JSONB`'], '21c': ['bitta jadvalda'], '21d': ['JSON ichidagi maydon bo\'yicha'], '21e': ['erkin qo\'shimcha'],
  '23a': ['ikki terminal oynasini'], '23b': ['`COMMIT`siz'], '23c': ['2-oynadagi oxirgi satr'], '23d': ['«Boshqacha chiqdimi?»'],
  '24a': ['siz o\'rnatasiz'], '24b': ['m4-03 dan keyin, m4-06 dan oldin'], '24c': ['bitta parol'], '24d': ['bitta buyruq bilan'], '24e': ['har kompyuterda'],
  '25a': ['`psql` ochmaydi'], '25b': ['«ikkalasi ham to\'g\'ri»'], '25c': ['JOIN va oxirgi telefon'], '25d': ['to\'rtta savoldan iborat'], '25e': ['bazada ko\'rsata olasiz'],
  '26a': ['ikkalasini birga aytasiz'], '26b': ['Excel jadvali', 'papkadagi turli qog\'ozlar'], '26c': ['«SQL nazorati»'], '26d': ['avval o\'quvchining so\'zi, keyin atama'],
  '27a': ['soddalashtirilgan'], '27b': ['shart va qulf'], '27c': ['kod qo\'riqlaydi'], '27d': ['besh savoli'], '27e': ['Mongo\'ni yomonlamang'],
}

def code_html(s):
  s = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
  return re.sub(r'`([^`]+)`', r'<code>\1</code>', s)

def plain(s):
  return re.sub(r'`([^`]+)`', r'\1', s)

def key_html(sid, key):
  parts = EMPH.get(sid, [])
  for p in parts:
    if p not in key:
      sys.exit(f'EMPH topilmadi: {sid} → {p!r} kalitda: {key!r}')
  # belgilash: bo'lakni vaqtincha \x01…\x02 bilan o'raymiz, keyin HTML
  for p in parts:
    key = key.replace(p, '\x01' + p + '\x02', 1)
  h = code_html(key)
  return h.replace('\x01', '<b>').replace('\x02', '</b>')

src = MD.read_text()
chunks = re.split(r'\n## (\d+) · ', src)
screens = {}
for i in range(1, len(chunks), 2):
  n = int(chunks[i]); body = chunks[i + 1]
  head = body.split('\n')[0]
  typ = head.split('←')[1].strip(' `') if '←' in head else ''
  sc = {'type': typ}
  m = re.search(r'^- Kicker: `([^`]+)`(?: · Eyebrow: `([^`]+)`)?(?: · Sarlavha: \*\*(.+?)\*\*)?', body, re.M)
  if m:
    sc['kicker'] = m.group(1)
    if m.group(2): sc['eyebrow'] = m.group(2)
    if m.group(3): sc['title'] = plain(m.group(3))
  if 'title' not in sc:
    m = re.search(r'^- Sarlavha: \*\*(.+?)\*\*', body, re.M)
    if m: sc['title'] = plain(m.group(1))
  segs = []
  for sm in re.finditer(r'^(\d)\. \*\*(.+?)\*\*\s*\n\s+Ovoz: «(.+?)»(?= ·|\s*$)', body, re.M):
    sid = f'{n}{"abcde"[int(sm.group(1)) - 1]}'
    segs.append(["abcde"[int(sm.group(1)) - 1], key_html(sid, sm.group(2)), sm.group(3)])
  if segs: sc['seg'] = segs
  # tekshiruvlar (MCRetry / LineCheck)
  def grab(label, rx=r'«(.+?)»(?=\s*·\s|\s*$)'):  # F-1102-17: ichki «…» da to'xtamasin
    mm = re.search(r'^- ' + label + r'[^:\n]*: ' + rx, body, re.M)
    return mm.group(1) if mm else None
  if typ in ('MCRetry', 'LineCheck'):
    sc['q'] = grab(r'Ovoz(?: \(`q`\))?') if typ == 'LineCheck' else grab('Ovoz')
    sc['ok'] = grab(r"To'g'ri \(ovoz")
    ms = re.search(r"· qisqa: «(.+?)»\s*$", body, re.M) or re.search(r"^- Qisqa \(`okShort`\): «(.+?)»(?=\s*·\s|\s*$)", body, re.M)
    if ms: sc['okShort'] = code_html(ms.group(1))
    mh = re.search(r"^- Maslahat[^:\n]*: «(.+?)»(?=\s*·\s|\s*$)", body, re.M)
    if mh: sc['hint'] = plain(mh.group(1))
    mt = re.search(r"^- Shart \(`task`\): «(.+?)»(?=\s*·\s|\s*$)", body, re.M)
    if mt: sc['task'] = code_html(mt.group(1)).replace('**', '')
    if mt: sc['task'] = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', code_html(mt.group(1)))
    mv = re.search(r"^- Variantlar \(to'g'risi — (\d)\): (.+)$", body, re.M)
    if mv:
      sc['correct'] = int(mv.group(1)) - 1
      sc['opts'] = [plain(re.sub(r'^\d ', '', o)) for o in mv.group(2).split(' · ')]
    mw = re.search(r"^- Xato izohlari: (.+)$", body, re.M)
    if mw:
      sc['wrong'] = {int(a) - 1: plain(b) for a, b in re.findall(r'(\d) — «(.+?)»(?=\s*·\s|\s*$)', mw.group(1))}
  if typ == 'Screen27':
    fin = []
    for row in re.findall(r'^  \| (\d) \| (.+?) \| (.+?) \| (\d) \| (.+?) \| (\d+) \|$', body, re.M):
      fin.append({'q': plain(row[1]), 'o': [plain(x) for x in row[2].split(' · ')], 'c': int(row[3]) - 1, 'e': plain(row[4]), 's': int(row[5])})
    sc['final'] = fin
  screens[n] = sc

# F-1102-17 himoyasi: ovoz/izoh matnida « ochilib yopilmagan bo'lsa — generator to'xtaydi
def _q_ok(v):
  return not isinstance(v, str) or v.count('«') == v.count('»')
for n_, sc_ in screens.items():
  for k_, v_ in sc_.items():
    vals_ = v_.values() if isinstance(v_, dict) else ([x for s_ in v_ for x in s_] if k_ == 'seg' else [v_])
    for x_ in vals_:
      if not _q_ok(x_): sys.exit(f'{n_}.{k_}: yopilmagan « — matn kesilgan: {str(x_)[:80]}')

# tekshiruv: har Lesson/Practice'da segment bor, MC'da q/ok/opts
bad = []
for n, sc in screens.items():
  if sc['type'] in ('Lesson', 'Practice') and not sc.get('seg'): bad.append(f'{n}: segment yo\'q')
  if sc['type'] in ('MCRetry',) and not (sc.get('q') and sc.get('ok') and sc.get('opts')): bad.append(f'{n}: MC to\'liq emas')
  if sc['type'] == 'LineCheck' and not (sc.get('q') and sc.get('ok') and sc.get('task') and sc.get('hint')): bad.append(f'{n}: LineCheck to\'liq emas')
  if sc['type'] == 'Screen27' and len(sc.get('final', [])) != 8: bad.append(f'{n}: FINAL {len(sc.get("final", []))}')
used = {k for n, sc in screens.items() for k in [f'{n}{s[0]}' for s in sc.get('seg', [])]}
for k in EMPH:
  if k not in used: bad.append(f'EMPH ortiqcha: {k}')
for n, sc in screens.items():
  for s in sc.get('seg', []):
    if '<b>' not in s[1]: bad.append(f'qizil yo\'q: {n}{s[0]}')
# M48 (F-1104-17): to'g'ri javob yagona eng uzun yoki yagona eng qisqa bo'lgan savollar — har biri ≤ 1/4
_qs = [(f'{n}', sc['opts'], sc['correct']) for n, sc in screens.items() if sc.get('opts')] + [(f'sinov {i + 1}', q['o'], q['c']) for sc in screens.values() for i, q in enumerate(sc.get('final', []))]
_L = lambda o: [len(x) for x in o]
_long = [n for n, o, c in _qs if _L(o)[c] == max(_L(o)) and _L(o).count(max(_L(o))) == 1]
_short = [n for n, o, c in _qs if _L(o)[c] == min(_L(o)) and _L(o).count(min(_L(o))) == 1]
if len(_long) > len(_qs) // 4: bad.append(f"M48: to'g'risi eng uzun {len(_long)} > {len(_qs) // 4}: {', '.join(_long)}")
if len(_short) > len(_qs) // 4: bad.append(f"M48: to'g'risi eng qisqa {len(_short)} > {len(_qs) // 4}: {', '.join(_short)}")
if bad: sys.exit('\n'.join(bad))

OUT.parent.mkdir(parents=True, exist_ok=True)
js = json.dumps(screens, ensure_ascii=False, indent=1)
OUT.write_text(
  '\n// ============================================================\n'
  '//  PG-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg1-matn.py (manba: 06-PostgreSQL1-mentor-v1.md)\n'
  '//  QO\'LDA TAHRIRLANMAYDI: matn MD\'da o\'zgaradi, keyin skript qayta yurgiziladi.\n'
  '// ============================================================\n'
  f'const MDT = {js};\n')
print(f'yozildi: {OUT.relative_to(ROOT)} · ekran {len(screens)} · segment {sum(len(s.get("seg", [])) for s in screens.values())}')
