#!/usr/bin/env python3
"""WebSocket-1 v2 (F-1104-22): ekrandagi kod, terminal chiqishlari, panel holatlari va AI natijalari — manbadan AYNAN (M10/M43).
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/ws1-kod.py → src/mentor-kurs/ws1/parts/03b-kod.gen.jsx
Manba: /home/kali/Desktop/order-bot (teg ws1-done) · /home/kali/Desktop/maydon-jamoa (teg m12-dars-03-done) ·
       manba/ws1v2-out/*.txt (drive-ws1v2.sh, drive-ws1v2-extra.sh) · manba/ws1v2-ai/ (drive-ws1v2-ai.sh).
Fayllar to'liq satr raqami bilan beriladi; bo'laklar satrni MATN bo'yicha topadi (raqam qo'lda yozilmaydi).
Qo'lda tahrirlanmaydi: loyiha yoki chiqish o'zgarsa — skriptlar, keyin shu fayl qayta yurgiziladi."""
import json, re, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
OB = Path('/home/kali/Desktop/order-bot'); MJ = Path('/home/kali/Desktop/maydon-jamoa')
M = ROOT / 'feedback/F-1029-02-mentor-kurs/manba'
OUTD = M / 'ws1v2-out'; AI = M / 'ws1v2-ai'
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/19-WS1-mentor-v2.md'
OUT = ROOT / 'src/mentor-kurs/ws1/parts/03b-kod.gen.jsx'
def show(repo, tag, f): return subprocess.check_output(['git', '-C', str(repo), 'show', f'{tag}:{f}'], text=True)
def lines(txt): return [{'t': l, 'n': i} for i, l in enumerate(txt.rstrip('\n').split('\n'), 1)]
out = {}
FILES = {
  'GATEWAY': 'src/api/live/live.gateway.ts', 'TOKEN': 'src/api/live/admin-token.ts', 'CTRL': 'src/api/live/admin.controller.ts',
  'MODULE': 'src/api/live/live.module.ts', 'TG': 'src/api/telegram/telegram.service.ts', 'TGMOD': 'src/api/telegram/telegram.module.ts',
  'HTML': 'public/admin.html', 'CLIENT': 'scripts/live-client.js', 'ENV': '.env.example',
}
for k, f in FILES.items():
  out[k] = {'file': f, 'tag': 'ws1-done', 'lines': lines(show(OB, 'ws1-done', f))}
rd = show(OB, 'ws1-done', 'README.md').split('\n')
a = rd.index('## Jonli panel (WebSocket)'); b = next(i for i in range(a + 1, len(rd)) if rd[i].startswith('## '))
out['README'] = {'file': 'README.md', 'tag': 'ws1-done', 'lines': [{'t': rd[i], 'n': i + 1} for i in range(a, b) if rd[i].strip()]}
mr = show(MJ, 'm12-dars-03-done', 'README.md').split('\n')
a = mr.index('## Real vaqt'); b = next(i for i in range(a + 1, len(mr)) if mr[i].startswith('### '))
out['MJ_README'] = {'file': 'README.md', 'tag': 'm12-dars-03-done', 'lines': [{'t': mr[i], 'n': i + 1} for i in range(a, b) if mr[i].strip()]}
out['MJ_ULANISH'] = {'file': 'mobil/src/ulanish.ts', 'tag': 'm12-dars-03-done', 'lines': lines(show(MJ, 'm12-dars-03-done', 'mobil/src/ulanish.ts'))}
def clean(s):
  s = s.replace(chr(0xA0), ' ').replace(chr(0x202F), ' ')  # som() / toLocaleString('ru-RU') bo'linmas probeli (haqiqiy) — ekranda oddiy probel
  s = re.sub(r'/tmp/claude-1000/[^\s)\']*?/scratchpad/[a-z0-9-]+/', '…/OrderBotNest/', s)
  return s.rstrip('\n')
OUTS = {}
for f in sorted(OUTD.glob('[01][0-9]*.txt')):
  OUTS[f.stem.split('-')[0]] = clean(f.read_text())
out['OUT'] = OUTS
# panel bosqichlari (10-panel.txt): «HH:MM:SS 10a-… — izoh» / «  belgi: …» / qatorlar «[yangi] 3 | Bobur | … »
PANEL = []
for blk in re.split(r'\n(?=\d\d:\d\d:\d\d 10)', clean((OUTD / '10-panel.txt').read_text()).split('\n# server logi')[0]):
  L = [x for x in blk.split('\n') if x.strip()]
  m = re.match(r'(\d\d:\d\d:\d\d) (10\w)-[\w-]+ — (.*)', L[0])
  if not m: continue
  belgi = L[1].split('belgi: ')[1]
  rows = []
  for r in L[2:]:
    r = r.strip(); yangi = r.startswith('[yangi] ')
    cells = r.replace('[yangi] ', '').split(' | ')
    rows.append({'yangi': yangi, 'cells': cells} if len(cells) == 7 else {'msg': r})
  PANEL.append({'k': m.group(2), 't': m.group(1), 'note': m.group(3), 'belgi': belgi, 'rows': rows})
out['PANEL'] = PANEL
AIR = {}
for n in ('ai1', 'ai2'):
  d = {}
  for f in sorted((AI / n).glob('0[1-4]-*.txt')): d[f.stem.split('-')[0]] = clean(f.read_text()).split('\n# Server logi')[0]  # darsda faqat klient qismi
  d['stat'] = (AI / n / 'diff-stat.txt').read_text().rstrip('\n').split('\n')[-1].strip()
  AIR[n] = d
out['AI'] = AIR
out['PROMPT1'] = (AI / 'p1-prompt.txt').read_text().rstrip('\n')
mp = re.search(r'^- Prompt \(nusxalash\): «(.+?)»\s*$', MD.read_text(), re.M)
out['PROMPT2'] = mp.group(1).replace('`', '')
for k, v in out.items():
  if '\u00a0' in json.dumps(v, ensure_ascii=False): raise SystemExit(f'{k}: haqiqiy U+00A0 belgi bor')
# Ekranda ko'rsatiladigan BOSHQA ilovaning (OrderBotNest paneli) localStorage kaliti — darsning o'z saqlovi emas:
# preview-keys darvozasi uni dars kaliti deb o'qimasin, qo'shtirnoq JSON-escape bilan (ekranda aynan bir xil).
J = lambda v: re.sub(r"(Storage\.(?:get|set|remove)Item\()'", lambda m: m.group(1) + '\\u0027', json.dumps(v, ensure_ascii=False, indent=1))
parts, refs = [], []
for kk, v in out.items():
  if kk == 'AI':
    for n, d in v.items(): parts.append(f'const KOD_AI_{n.upper()} = {J(d)};')
    refs.append('AI: { ' + ', '.join(f"{n}: KOD_AI_{n.upper()}" for n in v) + ' }')
  elif kk in ('OUT',):
    orefs = []
    for ok_, ov in v.items():
      nm = re.sub(r'[^A-Z0-9]+', '_', ok_.upper())
      parts.append(f'const KOD_OUT_{nm} = {J(ov)};'); orefs.append(f"'{ok_}': KOD_OUT_{nm}")
    refs.append('OUT: { ' + ', '.join(orefs) + ' }')
  else:
    parts.append(f'const KOD_{kk} = {J(v)};'); refs.append(f'{kk}: KOD_{kk}')
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text('\n// AVTO: feedback/F-1029-02-mentor-kurs/dev/ws1-kod.py — OrderBotNest ws1-done, maydon-jamoa m12-dars-03-done, haqiqiy chiqishlar (qo\'lda tahrirlanmaydi)\n' + '\n'.join(parts) + '\nconst KOD = { ' + ', '.join(refs) + ' };\n')
print('yozildi:', OUT.relative_to(ROOT), '· fayllar', {k: len(out[k]['lines']) for k in list(FILES) + ['README', 'MJ_README', 'MJ_ULANISH']}, '· OUT', list(OUTS), '· PANEL', [(p['k'], p['belgi'], len(p['rows'])) for p in PANEL], '· AI', {n: list(d) for n, d in AIR.items()})
