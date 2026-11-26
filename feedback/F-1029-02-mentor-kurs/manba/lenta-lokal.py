#!/usr/bin/env python3
"""AI yozgan GitHub Actions workflow'ni LOKAL «lenta»da yurgizish (F-1125-01, 26.11) — CI/CD-1 1-amaliyotidagi «lentani qo'lda yurgizish» usuli.
ISHLATISH: python3 lenta-lokal.py <AI-nusxa-papkasi> <yml-yo'li (nusxaga nisbatan)> <ish-papka> > natija.txt
- Toza mashina o'rniga: AI nusxasining `baza` commiti `git archive` bilan yangi papkaga + AI qo'shgan/o'zgartirgan fayllar (git status) ustiga;
  node_modules YO'Q (npm ci o'zi o'rnatadi).
- `uses:` qadamlar yurgizilmaydi, faqat yoziladi: checkout — nusxa allaqachon bor; setup-node — mashinadagi Node (node --version) bilan solishtiriladi.
- `run:` qadamlar yml tartibida, bash -e bilan; birinchi qizil qadamdan keyin qolganlari «yurmadi» (Actions'dagidek).
GitHub runner bilan farq: runner'dagi Node/npm versiyasi yml'dagi node-version'ga qarab boshqacha bo'lishi mumkin — natijada ochiq yoziladi."""
import os, subprocess, sys, yaml, pathlib, shutil
src, yml_rel, work = sys.argv[1], sys.argv[2], pathlib.Path(sys.argv[3])
work.mkdir(parents=True, exist_ok=False)
wf = yaml.safe_load(pathlib.Path(src, yml_rel).read_text())
node = subprocess.run(['node', '--version'], capture_output=True, text=True).stdout.strip()
npm = subprocess.run(['npm', '--version'], capture_output=True, text=True).stdout.strip()
print(f'# lokal lenta · {yml_rel} · mashina: Node {node}, npm {npm}')
subprocess.run(f'git -C "{src}" archive baza | tar -x -C "{work}"', shell=True, check=True)
st = subprocess.run(['git', '-C', src, 'status', '--porcelain', '-uall'], capture_output=True, text=True).stdout.split('\n')
for L in st:
    if not L.strip(): continue
    f = L[3:]
    if f.startswith('node_modules/'): continue
    d = work / f; d.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(pathlib.Path(src, f), d)
    print(f'# AI fayli ustiga: {L[:2].strip()} {f}')
env = {k: v for k, v in os.environ.items() if k in ('HOME', 'PATH', 'LANG')}; env.update(CI='true', NO_COLOR='1', FORCE_COLOR='0')
for jn, job in (wf.get('jobs') or {}).items():
    print(f'\n## job {jn} · runs-on: {job.get("runs-on")}')
    red = False
    for i, s in enumerate(job.get('steps') or [], 1):
        name = s.get('name') or s.get('uses') or s.get('run', '').split('\n')[0]
        if red: print(f'{i}. {name} · yurmadi (oldingi qadam qizil)'); continue
        if 'uses' in s:
            w = s.get('with') or {}
            note = ''
            if 'setup-node' in s['uses']:
                nv = str(w.get('node-version', w.get('node-version-file', '—')))
                note = f' · node-version: {nv} · mashinada {node}' + (' (mos)' if nv and node.lstrip('v').startswith(nv.split('.')[0].lstrip('v')) else ' (MOS EMAS — lokal Node bilan yuriladi)')
            print(f'{i}. {name} · uses {s["uses"]}{note} · lokal: yurgizilmaydi'); continue
        cmd = s['run']
        r = subprocess.run(['bash', '-e', '-c', cmd], cwd=work, env=env, capture_output=True, text=True)
        out = (r.stdout + r.stderr).strip().split('\n')
        print(f'{i}. {name} · $ {cmd.strip()} · chiqish kodi {r.returncode} · {"✓" if r.returncode == 0 else "✗ QIZIL"}')
        for L in (out[-14:] if r.returncode == 0 else out[-30:]): print('   ' + L)
        if r.returncode != 0: red = True
    print(f'\nNATIJA ({jn}): {"✗ qizil" if red else "✓ yashil"}')
