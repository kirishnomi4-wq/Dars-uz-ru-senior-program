#!/usr/bin/env python3
"""Jest-2 mentor darsi: MD (manba-haqiqat) → src/mentor-kurs/jest2/parts/03-matn.gen.jsx (pg1-matn.py nusxasi)
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/jest2-matn.py
Chiqadi: har ekran — kicker, eyebrow, title, segmentlar [id, kalit-HTML, ovoz]; tekshiruvlar — savol/ovoz/variant/izoh;
yakuniy sinov — FINAL. Kalit iboradagi qizil so'zlar (M6) — EMPH lug'atida (MD'da ** ichida ** yozib bo'lmaydi).
Qo'lda tahrirlanmaydi: matn o'zgarsa — MD tahrirlanadi va skript qayta yurgiziladi.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/12-Jest2-mentor-v1.md'
OUT = ROOT / 'src/mentor-kurs/jest2/parts/03-matn.gen.jsx'

# Kalit iboradagi qizil (<b>) bo'laklar: '<ekran><segment>' → MD matnidagi aynan bo'lak(lar)
EMPH = {
  '1a': ["noto'g'ri kirishni sinaymiz"], '1b': ["noto'g'ri natija qaytaradi"], '1c': ['ataylab buzamiz'], '1d': ['Shoshilmang'],
  '2a': ['Happy path'], '2b': ['Edge case'], '2c': ["Noto'g'ri tur"], '2d': ['bir nechta chegara holati'],
  '3a': ['bepul buyurtma'], '3b': ["do'kon mijozga pul to'laydimi?"], '3c': ['hech kim sezmaydi'], '3d': ["noto'g'ri ishlaydi"],
  '5a': ['Test avval yoziladi'], '5b': ['ikki edge testi qizil'], '5c': ['funksiya xato tashlamadi'], '5d': ['himoya yo\'q yoki shart noto\'g\'ri'],
  '6a': ['avval shart, keyin xato, keyin hisob'], '6b': ['uchta tekshiruv'], '6c': ['funksiyani to\'xtatadi'], '6d': ['beshala test yashil'], '6e': ['eng kichik to\'g\'ri holat ham'],
  '7a': ['qizilni ko\'rasiz'], '7b': ['`did not throw`'], '7c': ['`Tests:` satri'], '7d': ['«Boshqacha chiqdimi?»'],
  '8a': ["o'ralganmi yoki o'ralmaganmi?"], '8b': ['xato testni qulatadi'], '8c': ['funksiya ichidan uchdi'], '8d': ['`() =>` ichida'],
  '9a': ['qaysi xato ekanini'], '9b': ['`Received message`'], '9c': ['qaysi shartdan kelganini'],
  '10a': ['`if` yo\'q'], '10b': ['happy va 1 dona — qizil'], '10c': ['«0 dona» testi qizil'], '10d': ['qattiqligini', 'yumshoqligini'],
  '12a': ['uch xil buzasiz'], '12b': ['`() =>`ni olib tashlang'], '12c': ['`Received message` satri'], '12d': ['«Boshqacha chiqdimi?»'],
  '13a': ['TypeScript faylda'], '13b': ['turlarni tekshirmaydi'], '13c': ['qizil chizadi'], '13d': ["`'ikki' as any`"],
  '14a': ["ko'rsatmaydi"], '14b': ['`npx jest --verbose`'], '14c': ['xato emas'],
  '16a': ["o'z ko'zingiz bilan"], '16b': ['`npm test` yuradi'], '16c': ['`Received` qiymati'], '16d': ['«Boshqacha chiqdimi?»'],
  '17a': ['0 dan 100 gacha'], '17b': ['Olti test'], '17c': ['«chegara 100 %» qizil'], '17d': ['chegaraning ikki tomoni'],
  '19a': ['guard va olti test'], '19b': ['hammasi yashil'], '19c': ['qizil test nomini'], '19d': ['«Boshqacha chiqdimi?»'],
  '20a': ['«shumtaka mijoz»'], '20b': ["o'ralmagan holatning xabarini"], '20c': ['`as any`'], '20d': ['to\'rt chegara qiymati'],
  '21a': ['«edge case»'], '21b': ['shart, xato, hisob'], '21c': ['kod bilan birga'],
  '22a': ['olti holat'], '22b': ['uch sabab'], '22c': ['`as any`'], '22d': ['xabarni o\'quvchi bilan birga o\'qing'],
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
  '//  JEST-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-matn.py (manba: 12-Jest2-mentor-v1.md)\n'
  '//  QO\'LDA TAHRIRLANMAYDI: matn MD\'da o\'zgaradi, keyin skript qayta yurgiziladi.\n'
  '// ============================================================\n'
  f'const MDT = {js};\n')
print(f'yozildi: {OUT.relative_to(ROOT)} · ekran {len(screens)} · segment {sum(len(s.get("seg", [])) for s in screens.values())}')
