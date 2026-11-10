#!/usr/bin/env python3
"""CI/CD-1 v2 (F-1104-20): ekrandagi kod, yml, terminal chiqishlari va HAQIQIY GitHub Actions run'lari — manbadan AYNAN (M10/M43).
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/cicd1-kod.py → src/mentor-kurs/cicd1/parts/03b-kod.gen.jsx
Manba: /home/kali/Desktop/order-bot (teglar jest2-done, cicd1-done) · manba/cicd1v2-yml/*.yml · manba/cicd1v2-ai/ai*/.github/workflows/*.yml ·
       manba/cicd1v2-out/0N-*.txt (lokal, toza muhit) · manba/cicd1v2-out/1N-*.txt + runlar-api.tsv (GitHub run'lari: job, qadam, soniya, annotatsiya, log).
Qo'lda tahrirlanmaydi: loyiha yoki chiqish o'zgarsa — drive-cicd1v2*.sh, keyin shu skript qayta yurgiziladi."""
import json, re, subprocess
from datetime import datetime
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
REPO = Path('/home/kali/Desktop/order-bot')
M = ROOT / 'feedback/F-1029-02-mentor-kurs/manba'
OUTD = M / 'cicd1v2-out'; YML = M / 'cicd1v2-yml'; AI = M / 'cicd1v2-ai'
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/14-CICD1-mentor-v2.md'
OUT = ROOT / 'src/mentor-kurs/cicd1/parts/03b-kod.gen.jsx'
def show(tag, f): return subprocess.check_output(['git', '-C', str(REPO), 'show', f'{tag}:{f}'], text=True)
def lines(txt, a=None, b=None):
  L = txt.rstrip('\n').split('\n'); a = a or 1; b = b or len(L)
  return [{'t': L[i - 1], 'n': i} for i in range(a, b + 1)]
out = {}
# --- kod (repo teglaridan) ---
ORD = show('jest2-done', 'src/api/order/order.service.ts'); USR = show('jest2-done', 'src/api/user/user.service.ts'); PKG = show('jest2-done', 'package.json')
LOCK = show('jest2-done', 'package-lock.json')
assert '        if (p.stock < c.qty) {' in ORD.split('\n')[35], 'order.service.ts 36-satr o\'zgargan'
assert 'const telegram_id = String(from.id);' in USR.split('\n')[15], 'user.service.ts 16-satr o\'zgargan'
pk = next(i for i, l in enumerate(PKG.split('\n'), 1) if '"telegraf"' in l)
lk = next(i for i, l in enumerate(LOCK.split('\n'), 1) if '"node_modules/telegraf": {' in l)
out['ORDER_36'] = {'file': 'src/api/order/order.service.ts', 'tag': 'jest2-done', 'lines': lines(ORD, 33, 40)}
out['USER_20'] = {'file': 'src/api/user/user.service.ts', 'tag': 'jest2-done', 'lines': lines(USR, 15, 23)}
out['PKG_TELEGRAF'] = {'file': 'package.json', 'tag': 'jest2-done', 'lines': lines(PKG, pk - 2, pk + 2)}
out['LOCK_TELEGRAF'] = {'file': 'package-lock.json', 'tag': 'jest2-done', 'lines': lines(LOCK, lk, lk + 2)}
out['CI_DONE'] = {'file': '.github/workflows/ci.yml', 'tag': 'cicd1-done', 'lines': lines(show('cicd1-done', '.github/workflows/ci.yml'))}
assert [l['t'] for l in out['CI_DONE']['lines']] == (YML / '1-tavsiya.yml').read_text().rstrip('\n').split('\n'), 'cicd1-done ci.yml ≠ 1-tavsiya.yml'
# --- yml variantlari ---
for f in sorted(YML.glob('*.yml')):
  k = 'YML_' + re.sub(r'[^A-Z0-9]+', '_', f.stem.upper()).strip('_')
  out[k] = {'file': '.github/workflows/ci.yml', 'tag': f.name, 'lines': lines(f.read_text())}
for n in ('ai1', 'ai2'):
  f = next((AI / n / '.github/workflows').glob('*.yml'))
  out[f'YML_{n.upper()}'] = {'file': f'.github/workflows/{f.name}', 'tag': n, 'lines': lines(f.read_text())}
# --- lokal chiqishlar (0N) ---
def clean(s):
  s = re.sub(r'/tmp/claude-1000/[^\s)\']*?/scratchpad/[a-z0-9-]+(?:/[a-z0-9-]+)?/', '…/OrderBotNest/', s)
  s = s.replace("yo\\x27q", "yo'q")
  return s.rstrip('\n')
OUTS = {}
for f in sorted(OUTD.glob('0[0-9]*.txt')):
  OUTS[f.stem.split('-')[0]] = clean(f.read_text())
out['OUT'] = OUTS
# --- GitHub run'lari (1N) ---
api = {}
for l in (OUTD / 'runlar-api.tsv').read_text().splitlines():
  rid, n, title, cr, up, st, br, co = l.split('\t')
  api[rid] = {'n': int(n), 'title': title, 'at': cr, 'dur': int((datetime.strptime(up, '%Y-%m-%dT%H:%M:%SZ') - datetime.strptime(cr, '%Y-%m-%dT%H:%M:%SZ')).total_seconds())}
T = lambda s: datetime.strptime(s, '%Y-%m-%dT%H:%M:%SZ')
fmt = lambda s: f'{s} s' if s < 60 else f'{s // 60} daq {s % 60} s'
ST = {'success': 'ok', 'failure': 'bad', 'skipped': 'skip', 'cancelled': 'off'}
ANSI = re.compile(r'\x1b\[[0-9;]*m')
RUNS = {}
for f in sorted(OUTD.glob('[12][0-9]*.txt')):
  k = f.stem.split('-')[0]; t = f.read_text()
  m = re.search(r'^# run (\d+) · branch (\S+) · commit (\w+) · natija: (\S+)', t, re.M)
  rid, br, sha, concl = m.groups(); a = api.get(rid, {})
  end = t.find('## annotatsiyalar'); logpos = t.find("## to'liq log")
  jobs = []
  ms = list(re.finditer(r'^JOB (.+?) · (\w*) · (\S+) → (\S+)', t[:end], re.M))
  for q, jm in enumerate(ms):
    nm, co, s0, e0 = jm.groups(); seg = t[jm.start():(ms[q + 1].start() if q + 1 < len(ms) else end)]
    steps = [[n2, ST.get(c2, 'wait'), f'{int((T(e2) - T(s2)).total_seconds())} s'] for n2, c2, s2, e2 in re.findall(r'^  \d+\. (.+?) · (\w*) · (\S+) → (\S+)', seg, re.M)]
    jobs.append({'name': nm, 'st': ST.get(co, 'wait'), 'dur': fmt(int((T(e0) - T(s0)).total_seconds())), 'steps': steps})
  ann = [[lv, msg] for lv, msg in re.findall(r'^  \[(\w+)\] [^:\n]*: (.*)$', t[end:logpos], re.M) if 'Node.js 20 is deprecated' not in msg and 'ubuntu-latest label' not in msg]
  gh = re.search(r"## gh run view\n(.*?)\n## job", t, re.S); gh1 = (gh.group(1).strip().split('\n') + [''])[:4] if gh else []
  wf_issue = any('workflow file issue' in x for x in gh1)
  # log: qadam → satrlar (vaqt belgisi va ANSI olib tashlanadi; ##[group]/endgroup tashlanadi)
  log = {}
  for ln in t[logpos:].split('\n'):
    mm = re.match(r'^[^\t]+\t([^\t]+)\t﻿?(?:\d{4}-\d\d-\d\dT[\d:.]+Z )?(.*)$', ln)
    if not mm: continue
    step, txt = mm.group(1), re.sub(r'\^\[\[[0-9;]*m', '', ANSI.sub('', mm.group(2))).replace(chr(0xFEFF), '')  # gh log: ESC literal «^[» bo'lib keladi
    if step.startswith('Run ') and txt.strip() == step[4:]: txt = '$ ' + step[4:]
    elif txt.strip() in ('npm ci', 'npm test') and not log.get(step): txt = '$ ' + txt.strip()
    if txt.startswith('##[group]') or txt.startswith('##[endgroup]') or txt.startswith('shell: ') or not txt.strip(): continue
    log.setdefault(step, []).append(txt)
  keep = {s: v for s, v in log.items() if re.match(r'^(Run npm|Run npx|Kutubxonalarni|Bog.liqliklarni|Testlar)', s)}
  for s in keep: keep[s] = keep[s][:60]
  RUNS[k] = {'id': rid, 'n': a.get('n'), 'title': a.get('title'), 'br': br, 'sha': sha, 'st': ST.get(concl, 'wait'), 'dur': fmt(a['dur']) if a else '-', 'at': a.get('at'), 'jobs': jobs, 'ann': ann, 'wfIssue': wf_issue, 'log': keep}
out['RUNS'] = RUNS
out['PROMPT1'] = (AI / 'p1-prompt.txt').read_text().rstrip('\n')
mp = re.search(r'^- Prompt \(nusxalash\): «(.+?)»\s*$', MD.read_text(), re.M)
out['PROMPT2'] = mp.group(1).replace('`', '')
out['VERSIONS'] = {'local': (OUTD / '00-versiyalar.txt').read_text().rstrip('\n'), 'actions': (OUTD / '09-versiyalar-actions.txt').read_text().rstrip('\n')}
for k, v in out.items():
  s = json.dumps(v, ensure_ascii=False)
  if ' ' in s: raise SystemExit(f'{k}: haqiqiy U+00A0 belgi bor')
J = lambda v: json.dumps(v, ensure_ascii=False, indent=1)
parts, refs = [], []
for kk, v in out.items():
  if kk in ('OUT', 'RUNS'):
    orefs = []
    for ok_, ov in v.items():
      parts.append(f'const KOD_{kk}_{ok_.upper()} = {J(ov)};'); orefs.append(f"'{ok_}': KOD_{kk}_{ok_.upper()}")
    refs.append(kk + ': { ' + ', '.join(orefs) + ' }')
  else:
    parts.append(f'const KOD_{kk} = {J(v)};'); refs.append(f'{kk}: KOD_{kk}')
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text('\n// AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-kod.py — OrderBotNest teglari, yml variantlari, toza-muhit chiqishlari va haqiqiy GitHub Actions run\'lari (qo\'lda tahrirlanmaydi)\n' + '\n'.join(parts) + '\nconst KOD = { ' + ', '.join(refs) + ' };\n')
print('yozildi:', OUT.relative_to(ROOT), '· kod', [k for k in out if k not in ('OUT', 'RUNS')], '· OUT', list(OUTS), '· RUNS', {k: (v['st'], v['n'], len(v['jobs'][0]['steps']) if v['jobs'] else 0, list(v['log'])) for k, v in RUNS.items()})
