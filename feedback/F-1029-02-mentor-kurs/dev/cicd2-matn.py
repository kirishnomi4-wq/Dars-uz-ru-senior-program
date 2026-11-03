#!/usr/bin/env python3
"""CI/CD-2 «GitHub Actions» mentor darsi: MD (manba-haqiqat) → src/mentor-kurs/cicd2/parts/03-matn.gen.jsx (cicd1-matn.py nusxasi)
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/cicd2-matn.py
Chiqadi: har ekran — kicker, eyebrow, title, segmentlar [id, kalit-HTML, ovoz]; tekshiruvlar — savol/ovoz/variant/izoh;
yakuniy sinov — FINAL. Kalit iboradagi qizil so'zlar (M6) — EMPH lug'atida (MD'da ** ichida ** yozib bo'lmaydi).
Qo'lda tahrirlanmaydi: matn o'zgarsa — MD tahrirlanadi va skript qayta yurgiziladi.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/24-CICD2-mentor-v1.md'
OUT = ROOT / 'src/mentor-kurs/cicd2/parts/03-matn.gen.jsx'

# Kalit iboradagi qizil (<b>) bo'laklar: '<ekran><segment>' → MD matnidagi aynan bo'lak(lar)
EMPH = {
  '1a': ['28 tajriba'], '1b': ['qizil run logi'], '1c': ['matrix, cache, secrets haqiqati'], '1d': ['uch amaliyot'],
  '2a': ['yangi qator — run'], '2b': ['commit xabari'], '2c': ['qaysidir qadam yiqildi'], '2d': ['tarixi saqlanadi'],
  '3a': ['bitta job `test`'], '3b': ['`Run …` nomli qadam'], '3c': ['GitHub o\'zi qo\'shadi'], '3d': ['«nuqta» desa — job', '«amal» desa — qadam'],
  '4a': ['tayyor qadam'], '4b': ['faqat oxirgi commit\'ni'], '4c': ['mashinada tayyor turibdi'], '4d': ['logini oching'],
  '6a': ['run\'ni ochasiz'], '6b': ['qadamlar ro\'yxati'], '6c': ['`node:` satri'], '6d': ['«Boshqacha chiqdimi?»'],
  '7a': ['endi GitHub\'da'], '7b': ['kulrang, yurmadi'], '7c': ['qadam logida'], '7d': ['qizil qadamni oching'],
  '8a': ['xato turini'], '8b': ['«yo\'q» dedi'], '8c': ['buyruq topilmadi'], '8d': ['logdagi birinchi `error` satri'],
  '9a': ['birinchi qadamda qizil'], '9b': ['lock fayl eskirgan'], '9c': ['lock umuman yo\'q'], '9d': ['`npm install` yozing'],
  '10a': ['GitHub\'da ham bo\'sh'], '10b': ['mashinadagi ish papkasi'], '10c': ['`jest: not found`, kod 127'], '10d': ['checkout, setup-node, `npm install`, `npm test`, build'],
  '12a': ['tartibini buzasiz'], '12b': ['`npm install`dan oldinga'], '12c': ['qizil qadamdagi kod'], '12d': ['«Boshqacha chiqdimi?»'],
  '13a': ['GitHub\'da qanday ko\'rinadi'], '13b': ['job ham, qadam ham, log ham yo\'q'], '13c': ['qator 4', '8-qatorda'], '13d': ['ikki nuqta'], '13e': ['qadamsiz qizil run — fayl xatosi'],
  '14a': ['run umuman yo\'q yoki tugamaydi'], '14b': ['GitHub faylni ko\'rmaydi'], '14c': ['uch daqiqadan keyin ham kutmoqda'], '14d': ['papka nomi', '`runs-on` nomi'],
  '16a': ['uch parallel job'], '16b': ['uchalasi yashil'], '16c': ['matrix `setup-node`ga ulanmagan'], '16d': ['18, 20 va 22 haqiqatan'],
  '17a': ['«5 baravar tez»'], '17b': ['cache qadami qizil'], '17c': ['`cache: npm`'], '17d': ['ikkinchi run\'dan ishlaydi'],
  '18a': ['tekshirdik'], '18b': ['`***`'], '18c': ['to\'liq ochiq'], '18d': ['logga umuman chiqarmang'],
  '19a': ['logdan tekshirasiz'], '19b': ['`node-version: ${{ matrix.node }}`'], '19c': ['`test (20)` dagi versiya'], '19d': ['«Boshqacha chiqdimi?»'],
  '21a': ['yo\'l xaritasi, nuqta, amal'], '21b': ['har run\'da ogohlantiradi'], '21c': ['uch tuzatish'], '21d': ['Actions\'da birga o\'qing'],
  '22a': ['run\'ni qizil qiladi'], '22b': ['faqat o\'qish'], '22c': ['Testsiz lenta — yashil'], '22d': ['faqat yozilgan qadamlar'],
  '23a': ['Actions oynasidagi joy'], '23b': ['run\'ning o\'zidan'], '23c': ['kod va logdan'], '23d': ['birga o\'qing'],
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
  '//  CI/CD-2 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-matn.py (manba: 24-CICD2-mentor-v1.md)\n'
  '//  QO\'LDA TAHRIRLANMAYDI: matn MD\'da o\'zgaradi, keyin skript qayta yurgiziladi.\n'
  '// ============================================================\n'
  f'const MDT = {js};\n')
print(f'yozildi: {OUT.relative_to(ROOT)} · ekran {len(screens)} · segment {sum(len(s.get("seg", [])) for s in screens.values())}')
