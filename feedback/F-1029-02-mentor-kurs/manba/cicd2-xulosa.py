#!/usr/bin/env python3
"""CI/CD-2: cicd2-out/NN-*.txt (drive-cicd2-actions.sh chiqishlari) → qisqa xulosa (stdout, Markdown jadval).
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/manba/cicd2-xulosa.py > /tmp/x.md
Har run: natija · qadamlar (API) · yiqilgan qadam · logdagi asosiy satrlar (##[error], npm error, FAIL, Expected/Received, exit code).
Faqat o'qiydi — hech narsani o'zgartirmaydi.
"""
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent / 'cicd2-out'
KEY = re.compile(r"##\[error\]|##\[warning\]|npm error (code|`|The|enoent|Missing)|^\s*FAIL\b|Expected:|Received:|Tests:|exit code|Invalid workflow|not found|Error:|Warning:|deprecated|\*\*\*|Node\.js v|node --version|^v\d+\.|Cache (restored|saved|not found)|Image:|Version:|Runner Image|added \d+ packages|Unexpected|Required property|block sequence|compact mappings")

def summarize(p):
  t = p.read_text(errors='replace')
  head = re.search(r'^# run (\d+) · branch (\S+) · commit (\w+) · natija: (\S+)', t, re.M)
  note = t.split('\n', 1)[0].lstrip('# ').strip()
  steps = re.findall(r'^  (\d+)\. (.+?) · (\w+)/(\w*) · (\S+) → (\S+)$', t, re.M)
  jobs = re.findall(r'^JOB (.+?) · (\w+) · ', t, re.M)
  ann = re.findall(r'^  \[(\w+)\] (.*)$', t, re.M)
  log = t.split("## to'liq log", 1)[1] if "## to'liq log" in t else ''
  keys = []
  for line in log.splitlines():
    parts = line.split('\t')
    body = parts[-1] if parts else line
    body = re.sub(r'^\d{4}-\d\d-\d\dT[\d:.]+Z ', '', body)
    if KEY.search(body):
      step = parts[1] if len(parts) > 2 else ''
      keys.append(f'{step} │ {body.strip()}'[:200])
  return head, note, jobs, steps, ann, keys

def dur(a, b):
  try:
    from datetime import datetime
    f = lambda s: datetime.strptime(s.replace('Z', ''), '%Y-%m-%dT%H:%M:%S')
    return f'{int((f(b) - f(a)).total_seconds())} s'
  except Exception:
    return '-'

for p in sorted(OUT.glob('[1-6][0-9]-*.txt')):
  head, note, jobs, steps, ann, keys = summarize(p)
  print(f'### {p.stem}')
  print(f'- {note}')
  if head:
    print(f'- run {head.group(1)} · {head.group(2)} · {head.group(3)} · **{head.group(4)}**')
  for j in jobs:
    print(f'- job: {j[0]} · {j[1]}')
  for n, name, st, co, a, b in steps:
    print(f'  - {n}. {name} · {co or st} · {dur(a, b)}')
  for a in ann:
    print(f'- annotatsiya [{a[0]}] {a[1][:220]}')
  for k in keys[:14]:
    print(f'  > {k}')
  print()
