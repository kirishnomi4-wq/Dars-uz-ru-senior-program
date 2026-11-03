#!/usr/bin/env python3
"""PostgreSQL-2 mentor darsi: MD (manba-haqiqat) → src/mentor-kurs/pg2/parts/03-matn.gen.jsx (pg1-matn.py nusxasi)
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/pg2-matn.py
Chiqadi: har ekran — kicker, eyebrow, title, segmentlar [id, kalit-HTML, ovoz]; tekshiruvlar — savol/ovoz/variant/izoh;
yakuniy sinov — FINAL. Kalit iboradagi qizil so'zlar (M6) — EMPH lug'atida (MD'da ** ichida ** yozib bo'lmaydi).
Qo'lda tahrirlanmaydi: matn o'zgarsa — MD tahrirlanadi va skript qayta yurgiziladi.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/08-PostgreSQL2-mentor-v1.md'
OUT = ROOT / 'src/mentor-kurs/pg2/parts/03-matn.gen.jsx'

# Kalit iboradagi qizil (<b>) bo'laklar: '<ekran><segment>' → MD matnidagi aynan bo'lak(lar)
EMPH = {
  '1a': ["to'rt buyruq bilan boshqaramiz"], '1b': ["do'konning o'zi bilan"], '1c': ['Express ichida'], '1d': ['Shoshilmang'],
  '2a': ['bosh harfi'], '2b': ['o\'z buyrug\'i bor'], '2c': ['endpoint bo\'ladi'], '2d': ['bitta endpoint\'i bor'],
  '3a': ['shu jadvalni ko\'radi'], '3b': ['qo\'shilgan qatorlar soni'], '3c': ['baza o\'zi berdi'], '3d': ['`NOT NULL` yo\'q'],
  '4a': ['faqat kerakli ustunlar'], '4b': ['uchta mahsulot'], '4c': ['faqat quloqchin'], '4d': ['`WHERE` qatorlarni tanlaydi'],
  '5a': ['`UPDATE 1`'], '5b': ['`DELETE 1`'], '5c': ['tartib kafolatlanmaydi'], '5d': ['xato emas'], '5e': ['javobdagi sonni o\'qing'],
  '7a': ['o\'z bazangizda bajarasiz'], '7b': ['ikki filtr'], '7c': ['qatorlar soni'], '7d': ['«Boshqacha chiqdimi?»'],
  '8a': ['hamma qator'], '8b': ['`UPDATE 3`'], '8c': ['jadval bo\'sh'], '8d': ['hammasi joyida'], '8e': ['`BEGIN` ichida sinang'],
  '10a': ['tranzaksiya ichida'], '10b': ['hamma narx bir xil'], '10c': ['klaviaturaning narxi'], '10d': ['«Boshqacha chiqdimi?»'],
  '11a': ['bitta `s` yetmaydi'], '11b': ['noto\'g\'ri ustunni taklif qiladi'], '11c': ['`invalid input syntax`'], '11d': ['ikki marta yoziladi'], '11e': ['jadval tuzilishi bilan solishtiring'],
  '12a': ['xato yo\'q'], '12b': ['bo\'sh nomli qator'], '12c': ['faqat yozilgan qoidani'], '12d': ['`NOT NULL` yozishni'],
  '14a': ['server ichida'], '14b': ['bir joyda'], '14c': ['`rows`'], '14d': ['status 500 va xato matni'], '14e': ['server bazaga shu yo\'l bilan ulanadi'],
  '15a': ['status 201'], '15b': ['`DEFAULT` yo\'q'], '15c': ['200'], '15d': ['to\'g\'ri qarori'], '15e': ['topilmasa — 404'],
  '16a': ['Sinab ko\'rdik'], '16b': ['`deleted: 3`'], '16c': ['jadval joyida'], '16d': ['`$1, $2` bilan'],
  '17a': ['o\'zingiz qilasiz'], '17b': ['`express` va `pg`'], '17c': ['`POST` javobining statusi'], '17d': ['«Boshqacha chiqdimi?»'],
  '18a': ['`INSERT`da `price`'], '18b': ['jadval va ustun'], '18c': ['POST → 201'], '18d': ['`\\d cars` bilan solishtiring'],
  '19a': ['server baribir ishga tushadi'], '19b': ['`undefined`'], '19c': ['POST → 201'], '19d': ['`express.json()`'],
  '20a': ['xato birinchi so\'rovda'], '20b': ['`password authentication failed`', '`client password must be a string`'], '20c': ['pastki chiziq tushib qolgan'], '20d': ['`ECONNREFUSED` ko\'rinadi'], '20e': ['faqat Express'],
  '21a': ['hech narsa o\'zgarmadi'], '21b': ['xato bermay chiqib ketdi'], '21c': ['callback uni o\'qimaydi'], '21d': ['bitta terminal'],
  '23a': ['ataylab chiqarasiz va tuzatasiz'], '23b': ['xabarni o\'qing'], '23c': ['500 xabarining matni'], '23d': ['«Boshqacha chiqdimi?»'],
  '24a': ['haqiqiy PostgreSQL terminali'], '24b': ['javobdagi sonni so\'rang'], '24c': ['noto\'g\'ri `HINT`'], '24d': ['PostgreSQL terminali ochilishini'],
  '25a': ['to\'qqiz ekran'], '25b': ['har kimda boshqacha'], '25c': ['port band bo\'lsa ham «ishlayapti»'], '25d': ['bitta terminal qoidasi'],
  '26a': ['olti holat'], '26b': ['apostrof ikki marta'], '26c': ['bo\'sh xabar'], '26d': ['xabarni o\'quvchi bilan birga o\'qing'],
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
if bad: sys.exit('\n'.join(bad))

OUT.parent.mkdir(parents=True, exist_ok=True)
js = json.dumps(screens, ensure_ascii=False, indent=1)
OUT.write_text(
  '\n// ============================================================\n'
  '//  PG-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/pg2-matn.py (manba: 08-PostgreSQL2-mentor-v1.md)\n'
  '//  QO\'LDA TAHRIRLANMAYDI: matn MD\'da o\'zgaradi, keyin skript qayta yurgiziladi.\n'
  '// ============================================================\n'
  f'const MDT = {js};\n')
print(f'yozildi: {OUT.relative_to(ROOT)} · ekran {len(screens)} · segment {sum(len(s.get("seg", [])) for s in screens.values())}')
