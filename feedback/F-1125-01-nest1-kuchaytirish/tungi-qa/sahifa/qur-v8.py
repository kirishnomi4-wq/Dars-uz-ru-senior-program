#!/usr/bin/env python3
"""Qaror sahifasi v8 (26.11 kech): Telegraf + PG natijasi + ikki savol (Jest-1 yo'li, qolgan 5 darsga agentlar).
ISHLATISH: python3 qur-v8.py <deploy-id>  → qaror-v8.html (shu papkada). Uslub — v6 bilan bir xil (uslub.css)."""
import base64, pathlib, sys
H = pathlib.Path(__file__).resolve().parent
def img(name): return 'data:image/jpeg;base64,' + base64.b64encode((H / f'{name}.jpg').read_bytes()).decode()
CSS = (H / 'uslub.css').read_text() + """
.thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 640px) { .thumbs { grid-template-columns: 1fr; } }
td .pill { white-space: normal; }
.opt .t, .opt .d { display: block; }
.small { font-size: 14px; color: var(--muted); }
section.done a, .small a { color: var(--accent); }
"""
PAGE = (H / 'qolip-v8.html').read_text().replace('/*CSS*/', CSS).replace('__DEPLOY__', sys.argv[1] if len(sys.argv) > 1 else '—')
for k in ('tg-25-tekshiruv', 'jest1-20'):
  assert f'IMG:{k}' in PAGE, k
  PAGE = PAGE.replace(f'IMG:{k}', img(k))
assert 'IMG:' not in PAGE
(H / 'qaror-v8.html').write_text(PAGE)
print('qaror-v8.html', len(PAGE) // 1024, 'KB')
