#!/usr/bin/env python3
"""Qaror sahifasi v7 (26.11 kunduzi): 1-savol A va 2-savol A natijasi (oldin/keyin suratlar) + yangi savol (qolgan 7 dars).
ISHLATISH: python3 qur-v7.py <deploy-id>  → qaror-v7.html (shu papkada). Uslub — v6 bilan bir xil (uslub.css)."""
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
PAGE = (H / 'qolip-v7.html').read_text().replace('/*CSS*/', CSS).replace('__DEPLOY__', sys.argv[1] if len(sys.argv) > 1 else '—')
for k in ('q1-nest2-oldin', 'q1-nest2-keyin', 'q1-jest1-oldin', 'q1-jest1-keyin', 'j2-20-topshiriq', 'j2-20-natija', 'j2-22-tekshiruv'):
  assert f'IMG:{k}' in PAGE, k
  PAGE = PAGE.replace(f'IMG:{k}', img(k))
assert 'IMG:' not in PAGE
(H / 'qaror-v7.html').write_text(PAGE)
print('qaror-v7.html', len(PAGE) // 1024, 'KB')
