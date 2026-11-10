#!/usr/bin/env python3
"""Jest-2 v2 (F-1104-19): ekrandagi kod bo'laklari — OrderBotNest teglaridan va haqiqiy yurgizilgan test fayllaridan AYNAN (satr raqami bilan, M10/M43).
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/jest2-kod.py → src/mentor-kurs/jest2/parts/03b-kod.gen.jsx
Manba: /home/kali/Desktop/order-bot (teglar jest2-start, jest2-done) · manba/jest2v2-out/kod-*.spec.ts, *.txt · manba/jest2v2-ai/.
Qo'lda tahrirlanmaydi: loyiha yoki chiqish o'zgarsa — drive-jest2v2*.sh, keyin shu skript qayta yurgiziladi."""
import json, re, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
REPO = Path('/home/kali/Desktop/order-bot')
OUTD = ROOT / 'feedback/F-1029-02-mentor-kurs/manba/jest2v2-out'
AI = ROOT / 'feedback/F-1029-02-mentor-kurs/manba/jest2v2-ai'
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/12-Jest2-mentor-v2.md'
OUT = ROOT / 'src/mentor-kurs/jest2/parts/03b-kod.gen.jsx'
def show(tag, f): return subprocess.check_output(['git', '-C', str(REPO), 'show', f'{tag}:{f}'], text=True)
TG = 'src/api/telegram/'; OR = 'src/api/order/'
S = {  # kalit: (manba, ekrandagi fayl yo'li, from, to)
  'TS_PHONE': (('git', 'jest2-start', TG + 'telegram.service.ts'), TG + 'telegram.service.ts', 12, 12),
  'TS_ONTEXT': (('git', 'jest2-start', TG + 'telegram.service.ts'), TG + 'telegram.service.ts', 152, 160),
  'TS_IMPORT_NEW': (('git', 'jest2-done', TG + 'telegram.service.ts'), TG + 'telegram.service.ts', 9, 11),
  'TS_ONTEXT_NEW': (('git', 'jest2-done', TG + 'telegram.service.ts'), TG + 'telegram.service.ts', 152, 159),
  'PHONE_OLD': (('f', OUTD / 'kod-02-phone.ts'), TG + 'phone.ts', None, None),
  'PHONE_NEW': (('f', OUTD / 'kod-03-phone.ts'), TG + 'phone.ts', None, None),
  'SPEC_PHONE_02': (('f', OUTD / 'kod-02-phone.spec.ts'), TG + 'phone.spec.ts', None, None),
  'SPEC_PHONE_04': (('f', OUTD / 'kod-04-phone.spec.ts'), TG + 'phone.spec.ts', None, None),
  'ORDER_PLACE': (('git', 'jest2-start', OR + 'order.service.ts'), OR + 'order.service.ts', 24, 45),
  'ORDER_SETSTATUS': (('git', 'jest2-done', OR + 'order.service.ts'), OR + 'order.service.ts', 66, 87),
  'SPEC_ORDER_05': (('f', OUTD / 'kod-05-order.service.spec.ts'), OR + 'order.service.spec.ts', None, None),
  'SPEC_ORDER_06': (('f', OUTD / 'kod-06-order-rejects.spec.ts'), OR + 'order.service.spec.ts', None, None),
  'SPEC_ORDER_07': (('f', OUTD / 'kod-07-order-tothrow.spec.ts'), OR + 'order.service.spec.ts', None, None),
  'SPEC_ORDER_08': (('f', OUTD / 'kod-08-order-await-yoq.spec.ts'), OR + 'order.service.spec.ts', None, None),
  'SPEC_ORDER_08B': (('f', OUTD / 'kod-08b-order-await-xato.spec.ts'), OR + 'order.service.spec.ts', None, None),
  'SPEC_ORDER_10': (('f', OUTD / 'kod-10-order-chegara.spec.ts'), OR + 'order.service.spec.ts', None, None),
  'APP_CTRL': (('git', 'jest2-done', 'src/api/app.controller.ts'), 'src/api/app.controller.ts', 1, 10),
  'SPEC_APP': (('f', OUTD / 'kod-11-app.controller.spec.ts'), 'src/api/app.controller.spec.ts', None, None),
  'AI1_ORDER': (('f', AI / 'ai1/order.service.spec.ts'), OR + 'order.service.spec.ts', 44, 48),
  'AI1_TEL': (('f', AI / 'ai1/telegram.service.phone.spec.ts'), TG + 'telegram.service.phone.spec.ts', 84, 96),
  'AI2_ORDER': (('f', AI / 'ai2/order.service.spec.ts'), OR + 'order.service.spec.ts', 33, 38),
  'AI2_TEL': (('f', AI / 'ai2/telegram.service.spec.ts'), TG + 'telegram.service.spec.ts', 18, 22),
}
out = {}
for k, (src, f, a, b) in S.items():
  txt = show(src[1], src[2]) if src[0] == 'git' else Path(src[1]).read_text()
  if ' ' in txt: raise SystemExit(f'{k}: faylda haqiqiy U+00A0 belgi bor')
  L = txt.rstrip('\n').split('\n')
  a = a or 1; b = b or len(L)
  out[k] = {'file': f, 'tag': src[1] if src[0] == 'git' else 'chiqish', 'lines': [{'t': L[i - 1], 'n': i} for i in range(a, b + 1)]}
# Terminal chiqishlari — jest2v2-out/*.txt aynan; scratchpad yo'li ekranda …/OrderBotNest
def clean(s):
  s = re.sub(r'/tmp/claude-1000/[^\s)]*?/scratchpad/[^/\s]+(?:/[a-z0-9-]+)?/src', '…/OrderBotNest/src', s)
  s = re.sub(r'\(\.\./(?:\.\./)+home/kali/Desktop/order-bot/node_modules/', '(node_modules/', s)
  s = re.sub(r'/tmp/claude-1000/[^\s)]*?/scratchpad/jest2v2-run', '…/OrderBotNest', s)
  return s.rstrip('\n')
OUTS = {}
for f in sorted(OUTD.glob('[0-9][0-9]*.txt')):
  OUTS[f.stem.split('-')[0]] = clean(f.read_text())
out['OUT'] = OUTS
out['AI_DIFF1'] = (AI / 'ai1/diff-stat.txt').read_text().rstrip('\n')
out['AI_DIFF2'] = (AI / 'ai2/diff-stat.txt').read_text().rstrip('\n')
out['PROMPT1'] = (AI / 'p1-prompt.txt').read_text().rstrip('\n')
m = re.search(r'^- Prompt \(nusxalash\): «(.+?)»\s*$', MD.read_text(), re.M)
out['PROMPT2'] = m.group(1).replace('`', '')
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
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text('\n// AVTO: feedback/F-1029-02-mentor-kurs/dev/jest2-kod.py — OrderBotNest teglari va haqiqiy test fayllaridan aynan (qo\'lda tahrirlanmaydi)\n' + '\n'.join(parts) + '\nconst KOD = { ' + ', '.join(refs) + ' };\n')
print('yozildi:', OUT.relative_to(ROOT), '·', {k: (len(v['lines']) if isinstance(v, dict) and 'lines' in v else len(v)) for k, v in out.items()})
