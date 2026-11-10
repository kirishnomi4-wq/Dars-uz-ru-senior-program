#!/usr/bin/env python3
"""Jest-1 mentor darsi: MD (manba-haqiqat) → src/mentor-kurs/jest1/parts/03-matn.gen.jsx (pg1-matn.py nusxasi)
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/jest1-matn.py
Chiqadi: har ekran — kicker, eyebrow, title, segmentlar [id, kalit-HTML, ovoz]; tekshiruvlar — savol/ovoz/variant/izoh;
yakuniy sinov — FINAL. Kalit iboradagi qizil so'zlar (M6) — EMPH lug'atida (MD'da ** ichida ** yozib bo'lmaydi).
Qo'lda tahrirlanmaydi: matn o'zgarsa — MD tahrirlanadi va skript qayta yurgiziladi.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/10-Jest1-mentor-v1.md'
OUT = ROOT / 'src/mentor-kurs/jest1/parts/03-matn.gen.jsx'

# Kalit iboradagi qizil (<b>) bo'laklar: '<ekran><segment>' → MD matnidagi aynan bo'lak(lar)
EMPH = {
  '1a': ["qo'lda tekshirib bo'lmaydi"], '1b': ['birinchi testni yozasiz'], '1c': ["yolg'on yashil", "noto'g'ri qizil"], '1d': ['Shoshilmang'],
  '2a': ['mashina'], '2b': ['«shu kirishga aynan shu chiqish»'], '2c': ['`src/order.ts`'], '2d': ['bitta kutilgan natija'],
  '3a': ['allaqachon sozlangan'], '3b': ['`src`', '`.spec.ts`'], '3c': ['`No tests found`'], '3d': ['`src/` ichida'],
  '5a': ['funksiya yonida'], '5b': ['guruh'], '5c': ['bitta holat'], '5d': ['tasdiq'], '5e': ['`expect` — nima kutiladi'],
  '6a': ['fayl topildi va yurdi'], '6b': ['`✓ 2 kitob narxini hisoblaydi`'], '6c': ['`it`lar soni'], '6d': ['nechta `it` tekshirildi'],
  '7a': ['yashil PASS'], '7b': ['`No tests found`'], '7c': ['`Tests:` satri'], '7d': ['«Boshqacha chiqdimi?»'],
  '8a': ['test buni tutadimi?'], '8b': ['qaysi holat yiqildi'], '8c': ['20000 kutildi, 10002 keldi'], '8d': ['qaysi satr yiqilganini'], '8e': ['FAIL o\'qish tartibi'],
  '9a': ['etalon xato yozildi'], '9b': ['teskari'], '9c': ['kod xato degani emas'], '9d': ['kim xato'],
  '10a': ['solishtirilmaydi'], '10b': ['hech narsani tekshirmadi'], '10c': ['faqat `expect`'], '10d': ['PASS yolg\'on'],
  '12a': ['uch xil buzasiz'], '12b': ['FAIL'], '12c': ['`Received`'], '12d': ['«Boshqacha chiqdimi?»'],
  '13a': ['100 000 dan'], '13b': ['`--verbose`'], '13c': ['«aynan 100 000» qizil'], '13d': ['aynan chegara'],
  '14a': ['faqat ikkitasi haqiqiy'], '14b': ['`expect` bormi?'], '14c': ['etalon to\'g\'rimi?'], '14d': ['ikki savol'],
  '16a': ['bitta chegara xatosi'], '16b': ['4 passed'], '16c': ['qizil testning nomi'], '16d': ['«Boshqacha chiqdimi?»'],
  '17a': ['koddan tashqarida'], '17b': ['`No tests found`'], '17c': ['`npm install` ishlaydi'], '17d': ['joy va nom'],
  '18a': ['darsdagi buyruqlar yetmaydi'], '18b': ['`Must use import to load ES Module`'], '18c': ['TypeScript 6 yoki 7'], '18d': ['`typescript@5`'], '18e': ['Nest loyihasida'],
  '20a': ['`No tests found`'], '20b': ['loyiha ildiziga'], '20c': ['`.test.ts`'], '20d': ['«Boshqacha chiqdimi?»'],
  '21a': ['Jestbot'], '21b': ['6-ekrandagini ko\'rsatasiz'], '21c': ['«kim xato» savoli'], '21d': ['`src/` ichida'],
  '22a': ['robot misolida'], '22b': ['etalon kartochkasi — `expect`'], '22c': ['kodda ham taniydi'], '22d': ['kod satri bilan birga'],
  '23a': ['allaqachon bor'], '23b': ['zarari yo\'q'], '23c': ['«Nest buni oldindan qo\'ygan»'], '23d': ['yetarli emas'],
  '24a': ['olti holat'], '24b': ['`npm install`'], '24c': ['uch test'], '24d': ['xabarni birga o\'qing'],
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
  '//  JEST-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-matn.py (manba: 10-Jest1-mentor-v1.md)\n'
  '//  QO\'LDA TAHRIRLANMAYDI: matn MD\'da o\'zgaradi, keyin skript qayta yurgiziladi.\n'
  '// ============================================================\n'
  f'const MDT = {js};\n')
print(f'yozildi: {OUT.relative_to(ROOT)} · ekran {len(screens)} · segment {sum(len(s.get("seg", [])) for s in screens.values())}')
