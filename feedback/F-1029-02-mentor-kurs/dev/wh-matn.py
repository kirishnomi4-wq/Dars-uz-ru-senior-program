#!/usr/bin/env python3
"""Webhook mentor darsi: MD (manba-haqiqat) → src/mentor-kurs/wh/parts/03-matn.gen.jsx (pg1-matn.py nusxasi)
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/wh-matn.py
Chiqadi: har ekran — kicker, eyebrow, title, segmentlar [id, kalit-HTML, ovoz]; tekshiruvlar — savol/ovoz/variant/izoh;
yakuniy sinov — FINAL. Kalit iboradagi qizil so'zlar (M6) — EMPH lug'atida (MD'da ** ichida ** yozib bo'lmaydi).
Qo'lda tahrirlanmaydi: matn o'zgarsa — MD tahrirlanadi va skript qayta yurgiziladi.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/23-WH-mentor-v1.md'
OUT = ROOT / 'src/mentor-kurs/wh/parts/03-matn.gen.jsx'

# Kalit iboradagi qizil (<b>) bo'laklar: '<ekran><segment>' → MD matnidagi aynan bo'lak(lar)
EMPH = {
  '1a': ["to'lov xizmatidan biladi"], '1b': ["soxtasi qanday to'xtatiladi"], '1c': ['haqiqiy yurgizilgan'], '1d': ['Shoshilmang'],
  '2a': ["to'rt ishtirokchi"], '2b': ['faqat xizmatda'], '2c': ["o'zi yuboradi"], '2d': ['dalil emas'],
  '3a': ['mashq sahifasi'], '3b': ["To'rt tugma"], '3c': ['`POST /tolov/webhook`'], '3d': ['`200 {"ok":true}`'],
  '5a': ['begona odam'], '5b': ['HMAC'], '5c': ['`timingSafeEqual`'], '5d': ["hech bir xabar o'tmaydi"],
  '6a': ['401 «Imzo mos emas»'], '6b': ['Boshqa kalit'], '6c': ["summa 10 000 dan 1 ga o'zgartirilgan"], '6d': ["bitta ham yozuv yo'q"],
  '7a': ['boshqa matn'], '7b': ['`rawBody: true`'], '7c': ["haqiqiy «To'lash» ham 401"], '7d': ['avval kalit, keyin `rawBody`'],
  '9a': ["o'z kompyuteringizda"], '9b': ['`TOLOV_KALITI`'], '9c': ['ro\'yxat (login)'], '9d': ['«Boshqacha chiqdimi?»'],
  '10a': ['ikkinchi marta yozmasin'], '10b': ['`takror`'], '10c': ["noyoblik ikkinchisini to'xtatadi"], '10d': ['ikki himoyasi'],
  '11a': ['holat `rad`'], '11b': ['javob jadvalda'], '11c': ['Pro hali ochilmaydi'], '11d': ['qabul va yozuv'],
  '13a': ['takror va imzosiz'], '13b': ['ikkinchi javob'], '13c': ['«Boshqacha chiqdimi?»'],
  '14a': ['«to\'landi» xabarini yasay oladi'], '14b': ['skrinshotga yozilmaydi'], '14c': ['har xabar 401'], '14d': ['yangisi'],
  '15a': ["o'zingiz buzib ko'rasiz"], '15b': ['`{ rawBody: true }`'], '15c': ['yana 200'], '15d': ['«Boshqacha chiqdimi?»'],
  '17a': ['20 ekran'], '17b': ["Og'ir qism"], '17c': ['Pul chegarasi'], '17d': ['kalit gigiyenasi'],
  '18a': ['koddagi joyini'], '18b': ['401 bilan bog\'liq'], '18c': ['`login`'], '18d': ['xabar matnini o\'qing'],
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
  '//  WEBHOOK MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/wh-matn.py (manba: 23-WH-mentor-v1.md)\n'
  '//  QO\'LDA TAHRIRLANMAYDI: matn MD\'da o\'zgaradi, keyin skript qayta yurgiziladi.\n'
  '// ============================================================\n'
  f'const MDT = {js};\n')
print(f'yozildi: {OUT.relative_to(ROOT)} · ekran {len(screens)} · segment {sum(len(s.get("seg", [])) for s in screens.values())}')
