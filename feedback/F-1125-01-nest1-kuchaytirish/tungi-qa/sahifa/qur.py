#!/usr/bin/env python3
"""Qaror sahifasi (26.11 tong): tungi ish natijasi + savollar. Natija jadvali scratchpad/qa/natija loglaridan o'qiladi.
ISHLATISH: python3 qur.py  → qaror.html (shu papkada)"""
import base64, json, re, pathlib, html
H = pathlib.Path(__file__).resolve().parent
N = H.parent / 'qa' / 'natija'
DARS = [('nest-01', 'Nest-1'), ('nest-02', 'Nest-2'), ('pg-01', 'PostgreSQL-1'), ('pg-02', 'PostgreSQL-2'), ('jest-01', 'Jest-1'), ('jest-02', 'Jest-2'),
        ('cicd-01', 'CI/CD-1'), ('cicd-02', 'CI/CD-2'), ('tgpg-01', 'Telegraf + PG'), ('ws1-01', 'WebSocket-1'), ('ws2-01', 'WebSocket-2'), ('wh-01', 'Webhook')]
def img(name): return 'data:image/jpeg;base64,' + base64.b64encode((H / f'{name}.jpg').read_bytes()).decode()
def pill(cls, t): return f'<span class="pill {cls}">{html.escape(t)}</span>'
def sweep(L, d):
  f = N / f'sweep-{L}-{d}.tsv'
  if not f.exists(): return pill('no', 'yurmadi'), None
  last = f.read_text().strip().split('\n')[-1]
  m = re.search(r'JAMI (\d+) ekran · muammo (\d+)', last)
  if not m: return pill('warn', 'skript yiqildi'), None
  return (pill('ok', 'xato 0') if m.group(2) == '0' else pill('bad', f'xato {m.group(2)}')), int(m.group(1))
def e2e(d):
  f = N / f'e2e-uz-{d}.log'
  if not f.exists(): return pill('no', 'yurmadi')
  t = f.read_text(); m = re.search(r'^onFinished: (\{.*\})$', t, re.M)
  if not m: return pill('warn', "to'xtadi")
  o = json.loads(m.group(1))
  if o.get('passed'): return pill('ok', f"o'tdi · sinov {o['correctAnswers']}/{o['totalQuestions']}")
  return pill('bad', f"passed false · sinov {o.get('correctAnswers')}/{o.get('totalQuestions')}")
LOG = (N.parent / 'tungi.log').read_text()
def olchov(L, d, total):
  f = N / f'olchov-{L}-{d}.tsv'
  if not f.exists() or f' olchov {L} {d} · ' not in LOG: return pill('no', "o'lchanmadi")
  rows = [r.split('\t') for r in f.read_text().strip().split('\n') if r.count('\t') >= 3]
  bad = [r for r in rows if r[2].strip().isdigit() and int(r[2]) > 0 and not (r[3].startswith('PRE') and total and int(r[1]) == total)]
  if not rows: return pill('warn', 'skript yiqildi')
  if not bad: return pill('ok', 'yo\'q')
  return pill('warn', ', '.join(f'{r[1]}-ekran {r[2]} px' for r in bad))
rows = []
for d, nom in DARS:
  su, tot = sweep('uz', d); sr, tot2 = sweep('ru', d); tot = tot or tot2
  rows.append(f'<tr><td>{nom}</td><td class="num">{tot or "—"}</td><td>{su}</td><td>{sr}</td><td>{e2e(d)}</td><td>{olchov("uz", d, tot)}</td><td>{olchov("ru", d, tot)}</td></tr>')
CSS = (H / 'uslub.css').read_text() + """
.thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 640px) { .thumbs { grid-template-columns: 1fr; } }
td .pill { white-space: normal; }
.opt .t, .opt .d { display: block; }
.small { font-size: 14px; color: var(--muted); }
"""
TABLE = '\n'.join(rows)
PAGE = (H / 'qolip.html').read_text()
PAGE = PAGE.replace('/*CSS*/', CSS).replace('<!--JADVAL-->', TABLE)
for k in ('cicd1-20', 'ws2-19', 'jest1-20', 'nest2-20', 'jest1-14'): PAGE = PAGE.replace(f'IMG:{k}', img(k))
(H / 'qaror.html').write_text(PAGE)
print('qaror.html', len(PAGE) // 1024, 'KB')
