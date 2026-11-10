#!/usr/bin/env python3
"""TgPg v2 (F-1103-10): ekrandagi kod bo'laklari — OrderBotNest teglaridan AYNAN (satr raqami bilan, M10/M43).
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/tgpg-kod.py → src/mentor-kurs/tgpg/parts/03b-kod.gen.jsx
Qo'lda tahrirlanmaydi: loyiha o'zgarsa — skript qayta yurgiziladi."""
import json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
REPO = Path('/home/kali/Desktop/order-bot')
OUT = ROOT / 'src/mentor-kurs/tgpg/parts/03b-kod.gen.jsx'
BUZUQ = ROOT / 'feedback/F-1029-02-mentor-kurs/manba/orderbot-buzuq-order.service.ts'
def show(tag, f): return subprocess.check_output(['git', '-C', str(REPO), 'show', f'{tag}:{f}'], text=True)
S = {
  'START_START': ('tgpg-start', 'src/api/telegram/telegram.service.ts', 56, 60),
  'START_USER': ('tgpg-start', 'src/api/user/user.service.ts', 5, 22),
  'START_ORDER': ('tgpg-start', 'src/api/order/order.service.ts', 11, 15),
  'START_CAT': ('tgpg-start', 'src/api/catalog/catalog.service.ts', 6, 14),
  'DONE_PRODUCT': ('tgpg-done', 'src/core/entity/product.entity.ts', 1, 17),
  'DONE_MIG': ('tgpg-done', 'src/infrastructure/migrations/1762200000000-init.ts', 7, 14),
  'DONE_USER': ('tgpg-done', 'src/core/entity/user.entity.ts', 11, 32),
  'DONE_CART': ('tgpg-done', 'src/api/cart/cart.service.ts', 19, 28),
  'DONE_PLACE': ('tgpg-done', 'src/api/order/order.service.ts', 24, 61),
  'DONE_DS': ('tgpg-done', 'src/infrastructure/data-source.ts', 7, 19),
}
out = {}
for k, (tag, f, a, b) in S.items():
  L = show(tag, f).split('\n')
  out[k] = {'file': f, 'tag': tag, 'lines': [{'t': L[i - 1], 'n': i} for i in range(a, b + 1)]}
L = BUZUQ.read_text().split('\n')
out['BUZUQ'] = {'file': 'src/api/order/order.service.ts', 'tag': 'buzuq', 'lines': [{'t': L[i - 1], 'n': i} for i in range(29, 42)]}
OUT.write_text('\n// AVTO: feedback/F-1029-02-mentor-kurs/dev/tgpg-kod.py — OrderBotNest teglaridan aynan (qo\'lda tahrirlanmaydi)\nconst KOD = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n')
print('yozildi:', OUT.relative_to(ROOT), '·', {k: len(v['lines']) for k, v in out.items()})
