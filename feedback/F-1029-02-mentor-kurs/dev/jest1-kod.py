#!/usr/bin/env python3
"""Jest-1 v2 (F-1104-01): ekrandagi kod bo'laklari — OrderBotNest teglaridan va haqiqiy yurgizilgan test fayllaridan AYNAN (satr raqami bilan, M10/M43).
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/jest1-kod.py → src/mentor-kurs/jest1/parts/03b-kod.gen.jsx
Manba: /home/kali/Desktop/order-bot (teglar jest1-start, jest1-done) · manba/jest1v2-out/kod-*.spec.ts, orderplaced.spec.ts · manba/jest1v2-ai/ai1, ai2.
Qo'lda tahrirlanmaydi: loyiha yoki chiqish o'zgarsa — drive-jest1v2*.sh, keyin shu skript qayta yurgiziladi."""
import json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
REPO = Path('/home/kali/Desktop/order-bot')
OUTD = ROOT / 'feedback/F-1029-02-mentor-kurs/manba/jest1v2-out'
AI = ROOT / 'feedback/F-1029-02-mentor-kurs/manba/jest1v2-ai'
OUT = ROOT / 'src/mentor-kurs/jest1/parts/03b-kod.gen.jsx'
def show(tag, f): return subprocess.check_output(['git', '-C', str(REPO), 'show', f'{tag}:{f}'], text=True)
TG = 'src/api/telegram/'
S = {  # kalit: (manba, ekrandagi fayl yo'li, from, to)
  'TX_SOM': (('git', 'jest1-start', TG + 'texts.ts'), TG + 'texts.ts', 1, 4),
  'TX_STATUS': (('git', 'jest1-start', TG + 'texts.ts'), TG + 'texts.ts', 6, 11),
  'KB_NAV': (('git', 'jest1-start', TG + 'keyboards.ts'), TG + 'keyboards.ts', 18, 25),
  'KB_ORDER': (('git', 'jest1-start', TG + 'keyboards.ts'), TG + 'keyboards.ts', 37, 51),
  'PKG_TEST': (('git', 'jest1-start', 'package.json'), 'package.json', 14, 14),
  'PKG': (('git', 'jest1-start', 'package.json'), 'package.json', 45, 57),
  'SPEC02': (('f', OUTD / 'kod-02-texts.spec.ts'), TG + 'texts.spec.ts', None, None),
  'SPEC04': (('f', OUTD / 'kod-04-texts.spec.ts'), TG + 'texts.spec.ts', None, None),
  'SPEC05': (('f', OUTD / 'kod-05-yolgon.spec.ts'), TG + 'yolgon.spec.ts', None, None),
  'SPEC06': (('f', OUTD / 'kod-06-savat.spec.ts'), TG + 'savat.spec.ts', None, None),
  'SPEC06B': (('f', OUTD / 'kod-06b-tobe.spec.ts'), TG + 'tobe.spec.ts', None, None),
  'SPEC_KB': (('git', 'jest1-done', TG + 'keyboards.spec.ts'), TG + 'keyboards.spec.ts', None, None),
  'SPEC_OP': (('f', OUTD / 'orderplaced.spec.ts'), TG + 'texts.spec.ts', None, None),
  'AI1_STATUS': (('f', AI / 'ai1/texts.spec.ts'), TG + 'texts.spec.ts', 41, 47),
  'AI1_NORM': (('f', AI / 'ai1/texts.spec.ts'), TG + 'texts.spec.ts', 4, 7),
}
out = {}
for k, (src, f, a, b) in S.items():
  txt = show(src[1], src[2]) if src[0] == 'git' else Path(src[1]).read_text()
  if ' ' in txt: raise SystemExit(f'{k}: faylda haqiqiy U+00A0 belgi bor — etalon escape bilan yozilishi kerak')
  L = txt.rstrip('\n').split('\n')
  a = a or 1; b = b or len(L)
  out[k] = {'file': f, 'tag': src[1] if src[0] == 'git' else 'chiqish', 'lines': [{'t': L[i - 1], 'n': i} for i in range(a, b + 1)]}
# Terminal chiqishlari — jest1v2-out/*.txt aynan; scratchpad yo'llari ekranda «…/OrderBotNest» (M10: chiqish o'zgarmaydi, faqat yo'l qisqaradi)
import re
def clean(s):
  s = re.sub(r'/tmp/claude-1000/[^\s)]*?/scratchpad/[^/\s]+(?:/[a-z0-9-]+)?/src', '…/OrderBotNest/src', s)
  s = re.sub(r'\(\.\./(?:\.\./)+home/kali/Desktop/order-bot/node_modules/', '(node_modules/', s)
  return s.rstrip('\n')
OUTS = {}
for f in sorted(OUTD.glob('[0-9][0-9]*.txt')):
  OUTS[f.stem.split('-')[0]] = clean(f.read_text())
out['OUT'] = OUTS
# 11-ekran LineCheck: buzilgan fayl — 23-linecheck-buzuq.txt dagi «cat -n» ro'yxatidan aynan
L23 = (OUTD / '23-linecheck-buzuq.txt').read_text().split('\n')
op = [re.match(r'^\s*(\d+)\t(.*)$', l) for l in L23[1:]]
op = [{'t': m.group(2), 'n': int(m.group(1))} for m in op if m]
out['SPEC_OP_BUZUQ'] = {'file': TG + 'texts.spec.ts', 'tag': 'chiqish', 'lines': op[:19]}
# 18-ekran: AI javoblari — git diff --stat va parchalar (ai2 dagi ko'rinmas belgi ATAYLAB saqlanadi: u — topilmaning o'zi)
out['AI_DIFF1'] = (AI / 'ai1/diff-stat.txt').read_text().rstrip('\n')
out['AI_DIFF2'] = (AI / 'ai2/diff-stat.txt').read_text().rstrip('\n')
A2 = (AI / 'ai2/texts.spec.ts').read_text().split('\n')
out['AI2_LINES'] = {'file': TG + 'texts.spec.ts', 'tag': 'ai2', 'lines': [{'t': A2[i - 1], 'n': i} for i in (33, 134)]}
out['PROMPT1'] = (AI / '00-promptlar.md').read_text().split('## Prompt 1\n')[1].split('\n')[0]
out['PROMPT2'] = (AI / 'p2-prompt.txt').read_text().rstrip('\n')
# Har bo'lak alohida const (ekranda ham alohida ko'rinadi; lint-emoji blok bo'yicha sanaydi — repodagi status matnlari emojisi haqiqiy kod)
J = lambda v: json.dumps(v, ensure_ascii=False, indent=1)
parts, refs = [], []
for kk, v in out.items():
  if kk == 'OUT':
    orefs = []
    for ok_, ov in v.items():
      parts.append(f'const KOD_OUT_{ok_.upper()} = {J(ov)};'); orefs.append(f"'{ok_}': KOD_OUT_{ok_.upper()}")
    refs.append('OUT: { ' + ', '.join(orefs) + ' }')
  else:
    parts.append(f'const KOD_{kk} = {J(v)};'); refs.append(f'{kk}: KOD_{kk}')
OUT.write_text('\n// AVTO: feedback/F-1029-02-mentor-kurs/dev/jest1-kod.py — OrderBotNest teglari va haqiqiy test fayllaridan aynan (qo\'lda tahrirlanmaydi)\n' + '\n'.join(parts) + '\nconst KOD = { ' + ', '.join(refs) + ' };\n')
print('yozildi:', OUT.relative_to(ROOT), '·', {k: (len(v['lines']) if isinstance(v, dict) and 'lines' in v else len(v)) for k, v in out.items()})
