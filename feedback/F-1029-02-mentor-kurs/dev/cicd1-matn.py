#!/usr/bin/env python3
"""CI/CD-1 mentor darsi v2 (04.11, M41, F-1104-20): MD (manba-haqiqat) → src/mentor-kurs/cicd1/parts/03-matn.gen.jsx (jest2-matn.py dan)
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/cicd1-matn.py
Chiqadi: har ekran — kicker, eyebrow, title, segmentlar [id, kalit-HTML, ovoz]; tekshiruvlar — savol/ovoz/variant/izoh/Demak;
amaliyotlar — qadamlar/isbot/«Boshqacha chiqdimi?» jadvali; yakuniy sinov — FINAL.
v2 farqi: kalit iboradagi qizil bo'lak MD'da ==…== bilan (EMPH lug'ati bekor); `- Demak: «…»` → sc.demak; amaliyot jadvallari MD'dan.
04.11: Sarlavha regex'i ochko'z (.+) — «***» ichidagi ** sarlavhani kesib qo'ygan edi (CI/CD-2 14-ekran).
Qo'lda tahrirlanmaydi: matn o'zgarsa — MD tahrirlanadi va skript qayta yurgiziladi.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/14-CICD1-mentor-v2.md'
OUT = ROOT / 'src/mentor-kurs/cicd1/parts/03-matn.gen.jsx'

def code_html(s):
  s = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
  return re.sub(r'`([^`]+)`', r'<code>\1</code>', s)

def plain(s):
  return re.sub(r'`([^`]+)`', r'\1', s)

def key_html(sid, key):
  if '==' not in key:
    sys.exit(f'qizil bo\'lak yo\'q (==…==): {sid} → {key!r}')
  key = re.sub(r'==(.+?)==', '\x01\\1\x02', key)
  h = code_html(key)
  return h.replace('\x01', '<b>').replace('\x02', '</b>')

def table_rows(block, ncols):
  """`  | a | b | … |` qatorlari (sarlavha va |---| chizig'isiz)."""
  rows = []
  for line in block.split('\n'):
    m = re.match(r'^\s*\|(.+)\|\s*$', line)
    if not m:
      if rows: break
      continue
    cells = [c.strip() for c in m.group(1).split('|')]
    if len(cells) != ncols or all(re.fullmatch(r'-+', c) for c in cells): continue
    if rows == [] and cells[0] in ('#', 'Chiqdi'): continue
    rows.append(cells)
  return rows

src = MD.read_text()
chunks = re.split(r'\n## (\d+) · ', src)
screens = {}
for i in range(1, len(chunks), 2):
  n = int(chunks[i]); body = chunks[i + 1]
  head = body.split('\n')[0]
  typ = head.split('←')[1].strip(' `') if '←' in head else ''
  sc = {'type': typ}
  m = re.search(r'^- Kicker: `([^`]+)`(?: · Eyebrow: `([^`]+)`)?(?: · Sarlavha: \*\*(.+)\*\*)?', body, re.M)
  if m:
    sc['kicker'] = m.group(1)
    if m.group(2): sc['eyebrow'] = m.group(2)
    if m.group(3): sc['title'] = plain(m.group(3))
  if 'title' not in sc:
    m = re.search(r'^- Sarlavha: \*\*(.+)\*\*', body, re.M)
    if m: sc['title'] = plain(m.group(1))
  segs = []
  for sm in re.finditer(r'^(\d)\. \*\*(.+?)\*\*\s*\n\s+Ovoz: «(.+?)»(?= ·|\s*$)', body, re.M):
    # F-1120-02 (M52): «0.» — mentor o'zi bosadigan segment (id 'x'), keyingi satr «Bosish: «…»» — chap paneldagi ko'rsatma
    k = int(sm.group(1)); sl = 'x' if k == 0 else "abcde"[k - 1]
    seg = [sl, key_html(f'{n}{sl}', sm.group(2)), sm.group(3)]
    ma = re.match(r'[^\n]*\n\s+Bosish: «(.+?)»\s*$', body[sm.end():], re.M)
    if ma: seg.append(re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', code_html(ma.group(1))))
    elif k == 0: sys.exit(f'{n}x: «Bosish: «…»» satri yo\'q')
    segs.append(seg)
  if segs: sc['seg'] = segs
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
    if mt: sc['task'] = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', code_html(mt.group(1)))
    md = re.search(r"^- Demak: «(.+?)»\s*$", body, re.M)
    if md: sc['demak'] = code_html(md.group(1))
    mv = re.search(r"^- Variantlar \(to'g'risi — (\d)\): (.+)$", body, re.M)
    if mv:
      sc['correct'] = int(mv.group(1)) - 1
      sc['opts'] = [plain(re.sub(r'^\d ', '', o)) for o in mv.group(2).split(' · ')]
    mw = re.search(r"^- Xato izohlari: (.+)$", body, re.M)
    if mw:
      sc['wrong'] = {int(a) - 1: plain(b) for a, b in re.findall(r'(\d) — «(.+?)»(?=\s*·\s|\s*$)', mw.group(1))}
  if typ == 'Practice':
    mq = re.search(r'^- Qadamlar:\n((?:\s*\|.*\n)+)', body, re.M)
    if mq:
      sc['steps'] = [{'t': plain(r[1]), 'cmds': [plain(c).strip() for c in r[2].split(' · ')], 'exp': plain(r[3])} for r in table_rows(mq.group(1), 4)]
    mp = re.search(r"^- Isbot: «(.+?)» · placeholder: «(.+?)» · KOD: `/(.+)/([a-z]*)`(?: · xato: «(.+?)»)?", body, re.M)
    if mp:
      sc['proof'] = {'label': plain(mp.group(1)), 'placeholder': plain(mp.group(2)), 're': mp.group(3), 'flags': mp.group(4), 'wrong': plain(mp.group(5) or '')}
    mtr = re.search(r'^- «Boshqacha chiqdimi\?»:\n((?:\s*\|.*\n)+)', body, re.M)
    if mtr:
      sc['trouble'] = [[plain(r[0]), plain(r[1])] for r in table_rows(mtr.group(1), 2) if not r[0].startswith('Hech biri emas')]
  if typ == 'Screen27':
    fin = []
    for row in re.findall(r'^  \| (\d) \| (.+?) \| (.+?) \| (\d) \| (.+?) \| (\d+) \|$', body, re.M):
      fin.append({'q': plain(row[1]), 'o': [plain(x) for x in row[2].split(' · ')], 'c': int(row[3]) - 1, 'e': plain(row[4]), 's': int(row[5])})
    sc['final'] = fin
  screens[n] = sc

# F-1102-17 himoyasi: ovoz/izoh matnida « ochilib yopilmagan bo'lsa — generator to'xtaydi
def _q_ok(v):
  return not isinstance(v, str) or v.count('«') == v.count('»')
def _walk(v):
  if isinstance(v, dict): return [x for vv in v.values() for x in _walk(vv)]
  if isinstance(v, list): return [x for vv in v for x in _walk(vv)]
  return [v]
for n_, sc_ in screens.items():
  for k_, v_ in sc_.items():
    for x_ in _walk(v_):
      if not _q_ok(x_): sys.exit(f'{n_}.{k_}: yopilmagan « — matn kesilgan: {str(x_)[:80]}')

bad = []
for n, sc in screens.items():
  if sc['type'] in ('Lesson', 'Practice') and not sc.get('seg'): bad.append(f'{n}: segment yo\'q')
  if sc['type'] == 'Practice' and not (sc.get('steps') and sc.get('proof') and sc.get('trouble')): bad.append(f'{n}: amaliyot jadvali to\'liq emas')
  if sc['type'] == 'Practice' and sc.get('steps') and len(sc['steps']) != 4: bad.append(f'{n}: qadamlar {len(sc["steps"])} (4 kutilgan)')
  if sc['type'] == 'MCRetry' and not (sc.get('q') and sc.get('ok') and sc.get('opts') and sc.get('demak')): bad.append(f'{n}: MC to\'liq emas (q/ok/opts/demak)')
  if sc['type'] == 'LineCheck' and not (sc.get('q') and sc.get('ok') and sc.get('task') and sc.get('hint')): bad.append(f'{n}: LineCheck to\'liq emas')
  if sc['type'] == 'Screen27' and len(sc.get('final', [])) != 8: bad.append(f'{n}: FINAL {len(sc.get("final", []))}')
  for s in sc.get('seg', []):
    if len(s[2].split()) > 60: bad.append(f'{n}{s[0]}: ovoz {len(s[2].split())} so\'z (>60)')
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
  '//  CI/CD-1 MATNLARI — AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-matn.py (manba: 14-CICD1-mentor-v2.md, M41)\n'
  '//  QO\'LDA TAHRIRLANMAYDI: matn MD\'da o\'zgaradi, keyin skript qayta yurgiziladi.\n'
  '// ============================================================\n'
  f'const MDT = {js};\n')
types = {}
for sc in screens.values(): types[sc['type']] = types.get(sc['type'], 0) + 1
print(f'yozildi: {OUT.relative_to(ROOT)} · ekran {len(screens)} · segment {sum(len(s.get("seg", [])) for s in screens.values())} · {types}')
