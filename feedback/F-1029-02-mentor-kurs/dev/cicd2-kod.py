#!/usr/bin/env python3
"""CI/CD-2 v2 (F-1104-21): ekrandagi yml, kod, terminal chiqishlari va HAQIQIY GitHub Actions run'lari — manbadan AYNAN (M10/M43).
Ishlatish: python3 feedback/F-1029-02-mentor-kurs/dev/cicd2-kod.py → src/mentor-kurs/cicd2/parts/03b-kod.gen.jsx
Manba: /home/kali/Desktop/order-bot (teglar cicd2-start = cicd1-done, cicd2-done) · manba/cicd2v2-yml/*.yml · manba/cicd2v2-ai/ai*/.github/workflows/ci.yml ·
       manba/cicd2v2-out/0N-*.txt (lokal) · run'lar: manba/cicd1v2-out/{10,11,18}-*.txt (Actions ichi, cache) + manba/cicd2v2-out/{3N,4N}-*.txt (matrix, smoke, secret, PR) + runlar-api.tsv (ikkala papka).
Qo'lda tahrirlanmaydi: loyiha yoki chiqish o'zgarsa — drive-cicd2v2*.sh, keyin shu skript qayta yurgiziladi."""
import json, re, subprocess
from datetime import datetime
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
REPO = Path('/home/kali/Desktop/order-bot')
M = ROOT / 'feedback/F-1029-02-mentor-kurs/manba'
OUTD = M / 'cicd2v2-out'; OUT1 = M / 'cicd1v2-out'; YML = M / 'cicd2v2-yml'; AI = M / 'cicd2v2-ai'
MD = ROOT / 'feedback/F-1029-02-mentor-kurs/24-CICD2-mentor-v2.md'
OUT = ROOT / 'src/mentor-kurs/cicd2/parts/03b-kod.gen.jsx'
def show(tag, f): return subprocess.check_output(['git', '-C', str(REPO), 'show', f'{tag}:{f}'], text=True)
def lines(txt, a=None, b=None):
  L = txt.rstrip('\n').split('\n'); a = a or 1; b = b or len(L)
  return [{'t': L[i - 1], 'n': i} for i in range(a, b + 1)]
out = {}
# --- kod (repo teglaridan) ---
out['CI_START'] = {'file': '.github/workflows/ci.yml', 'tag': 'cicd2-start', 'lines': lines(show('cicd2-start', '.github/workflows/ci.yml'))}
out['CI_DONE'] = {'file': '.github/workflows/ci.yml', 'tag': 'cicd2-done', 'lines': lines(show('cicd2-done', '.github/workflows/ci.yml'))}
RD = show('cicd2-done', 'README.md'); out['README_BADGE'] = {'file': 'README.md', 'tag': 'cicd2-done', 'lines': lines(RD, 1, 3)}
SM = show('cicd2-done', 'scripts/smoke.js'); smL = SM.split('\n')
i_url = next(i for i, l in enumerate(smL, 1) if 'process.env.SMOKE_DB_URL || process.env.DATABASE_URL' in l)
i_db = next(i for i, l in enumerate(smL, 1) if '_smoke`' in l)
out['SMOKE_URL'] = {'file': 'scripts/smoke.js', 'tag': 'cicd2-done', 'lines': lines(SM, i_url - 1, i_url + 1)}
out['SMOKE_DB'] = {'file': 'scripts/smoke.js', 'tag': 'cicd2-done', 'lines': lines(SM, i_db, i_db + 2)}
PK = show('cicd2-done', 'package.json'); pkL = PK.split('\n')
i_sm = next(i for i, l in enumerate(pkL, 1) if '"smoke"' in l)
out['PKG_SMOKE'] = {'file': 'package.json', 'tag': 'cicd2-done', 'lines': lines(PK, i_sm - 2, i_sm)}
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
  return s.replace("yo\\x27q", "yo'q").rstrip('\n')
OUTS = {}
for f in sorted(OUTD.glob('0[0-9]*.txt')):
  OUTS[f.stem.split('-')[0]] = clean(f.read_text())
for f in sorted((M / 'cicd2-out').glob('0[1-4]*.txt')):  # o'quvchi namunasi — lokal, 01.11 (22-ekran)
  OUTS['v1-' + f.stem.split('-')[0]] = clean(f.read_text())
out['OUT'] = OUTS
# --- GitHub run'lari: cicd1v2-out 10/11/18 + cicd2v2-out 3N/4N ---
api = {}
for d in (OUT1, OUTD):
  p = d / 'runlar-api.tsv'
  if not p.exists(): continue
  for l in p.read_text().splitlines():
    c = l.split('\t')
    if len(c) < 5 or not c[0].isdigit(): continue
    rid, n, title, cr, up = c[0], c[1], c[2], c[3], c[4]
    api[rid] = {'n': int(n), 'title': title, 'at': cr, 'ev': c[8] if len(c) > 8 else 'push', 'dur': int((datetime.strptime(up, '%Y-%m-%dT%H:%M:%SZ') - datetime.strptime(cr, '%Y-%m-%dT%H:%M:%SZ')).total_seconds())}
T = lambda s: datetime.strptime(s, '%Y-%m-%dT%H:%M:%SZ')
fmt = lambda s: f'{s} s' if s < 60 else f'{s // 60} daq {s % 60} s'
ST = {'success': 'ok', 'failure': 'bad', 'skipped': 'skip', 'cancelled': 'off'}
ANSI = re.compile(r'\x1b\[[0-9;]*m')
RUNS = {}
files = [OUT1 / f for f in ('10-yashil.txt', '11-test-qizil.txt', '15-tsc-bor-qizil.txt', '18-main-yashil.txt')] + sorted(OUTD.glob('[34][0-9]*.txt'))
for f in files:
  if not f.exists(): continue
  k = ('c1-' if f.parent == OUT1 else '') + f.stem.split('-')[0]; t = f.read_text()
  m = re.search(r'^# run (\d+) · branch (\S+) · commit (\w+) · natija: (\S+)', t, re.M)
  if not m: continue
  rid, br, sha, concl = m.groups(); a = api.get(rid, {})
  end = t.find('## annotatsiyalar'); logpos = t.find("## to'liq log")
  jobs = []
  ms = list(re.finditer(r'^JOB (.+?) · (\w*) · (\S+) → (\S+)', t[:end], re.M))
  for q, jm in enumerate(ms):
    nm, co, s0, e0 = jm.groups(); seg = t[jm.start():(ms[q + 1].start() if q + 1 < len(ms) else end)]
    steps = [[n2, ST.get(c2, 'wait'), f'{int((T(e2) - T(s2)).total_seconds())} s'] for n2, c2, s2, e2 in re.findall(r'^  \d+\. (.+?) · (\w*) · (\S+) → (\S+)', seg, re.M)]
    try: jd = fmt(int((T(e0) - T(s0)).total_seconds()))
    except Exception: jd = '-'
    jobs.append({'name': nm, 'st': ST.get(co, 'wait'), 'dur': jd, 'steps': steps})
  ann = [[lv, msg] for lv, msg in re.findall(r'^  \[(\w+)\] [^:\n]*: (.*)$', t[end:logpos], re.M) if 'Node.js 20 is deprecated' not in msg and 'ubuntu-latest label' not in msg]
  gh = re.search(r"## gh run view\n(.*?)\n## job", t, re.S); gh1 = gh.group(1).strip().split('\n') if gh else []
  wf_issue = any('workflow file issue' in x for x in gh1)
  log = {}
  for ln in t[logpos:].split('\n'):
    mm = re.match(r'^([^\t]+)\t([^\t]+)\t﻿?(?:\d{4}-\d\d-\d\dT[\d:.]+Z )?(.*)$', ln)
    if not mm: continue
    job, step, txt = mm.group(1), mm.group(2), re.sub(r'\^\[\[[0-9;]*m', '', ANSI.sub('', mm.group(3))).replace(chr(0xFEFF), '')
    if txt.startswith('##[group]') or txt.startswith('##[endgroup]') or txt.startswith('shell: ') or not txt.strip(): continue
    txt = txt.replace(chr(0xA0), ' ')  # smoke logidagi som() U+00A0 (haqiqiy) — ekranda oddiy probel
    if step.startswith('Run ') and txt.strip() == step[4:]: txt = '$ ' + step[4:]
    key = step if len(jobs) <= 1 else f'{job} · {step}'
    log.setdefault(key, []).append(txt)
  for s in log: log[s] = log[s][:80]
  RUNS[k] = {'id': rid, 'n': a.get('n'), 'title': a.get('title'), 'ev': a.get('ev', 'push'), 'br': br, 'sha': sha, 'st': ST.get(concl, 'wait'), 'dur': fmt(a['dur']) if a else '-', 'at': a.get('at'), 'jobs': jobs, 'ann': ann, 'wfIssue': wf_issue, 'log': log}
out['RUNS'] = RUNS
out['PROMPT1'] = (AI / 'p1-prompt.txt').read_text().rstrip('\n')
mp = re.search(r'^- Prompt \(nusxalash\): «(.+?)»\s*$', MD.read_text(), re.M)
out['PROMPT2'] = mp.group(1).replace('`', '') if mp else ''
for pr in ('36b-pr-holat.txt', '00-secret.txt'):
  p = OUTD / pr
  if p.exists(): out['TXT_' + pr.split('-')[0].upper()] = clean(p.read_text())
for k, v in out.items():
  if ' ' in json.dumps(v, ensure_ascii=False): raise SystemExit(f'{k}: haqiqiy U+00A0 belgi bor')
J = lambda v: json.dumps(v, ensure_ascii=False, indent=1)
parts, refs = [], []
for kk, v in out.items():
  if kk in ('OUT', 'RUNS'):
    orefs = []
    for ok_, ov in v.items():
      nm = re.sub(r'[^A-Z0-9]+', '_', ok_.upper())
      parts.append(f'const KOD_{kk}_{nm} = {J(ov)};'); orefs.append(f"'{ok_}': KOD_{kk}_{nm}")
    refs.append(kk + ': { ' + ', '.join(orefs) + ' }')
  else:
    parts.append(f'const KOD_{kk} = {J(v)};'); refs.append(f'{kk}: KOD_{kk}')
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text('\n// AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-kod.py — OrderBotNest teglari, yml variantlari, chiqishlar va haqiqiy GitHub Actions run\'lari (qo\'lda tahrirlanmaydi)\n' + '\n'.join(parts) + '\nconst KOD = { ' + ', '.join(refs) + ' };\n')
print('yozildi:', OUT.relative_to(ROOT), '· kod', [k for k in out if k not in ('OUT', 'RUNS')], '· OUT', list(OUTS), '· RUNS', {k: (v['st'], v['n'], [j['name'] for j in v['jobs']], list(v['log'])[:4]) for k, v in RUNS.items()})
