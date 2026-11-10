#!/usr/bin/env python3
"""CI/CD-2: manba/cicd2-out/NN-*.txt + runlar-api.tsv (haqiqiy GitHub Actions run'lari) → src/mentor-kurs/cicd2/parts/04-runlar.gen.jsx
Ishlatish (repo ildizidan): python3 feedback/F-1029-02-mentor-kurs/dev/cicd2-runlar.py
Har run: raqam (#N), nom (commit xabari), tarmoq, sha, holat, davomiylik (createdAt → updatedAt), job'lar va qadamlar (API soniyalari), izohlar.
Qo'lda tahrirlanmaydi.
"""
import os
from pathlib import Path
ROOT = Path(__file__).resolve().parents[3]
os.chdir(ROOT / 'feedback/F-1029-02-mentor-kurs/manba/cicd2-out')
OUT = ROOT / 'src/mentor-kurs/cicd2/parts/04-runlar.gen.jsx'
import re,glob,json
from datetime import datetime
f=lambda s: datetime.strptime(s,'%Y-%m-%dT%H:%M:%SZ')
api={}
for l in open('runlar-api.tsv'):
  n,i,wf,br,ev,co,title,a,b=l.rstrip('\n').split('\t')
  api[i]=dict(n=int(n),title=title,dur=int((f(b)-f(a)).total_seconds()),at=a)
fmt=lambda s: f'{s} s' if s<60 else f'{s//60} daq {s%60} s'
ST={'success':'ok','failure':'bad','skipped':'skip','cancelled':'off'}
out={}
for p in sorted(glob.glob('[1-6][0-9]-*.txt')):
  t=open(p).read(); k=p[:2]
  m=re.search(r'^# run (\d+) · branch (\S+) · commit (\w+)',t,re.M)
  if not m: continue
  rid,br,sha=m.groups(); a=api.get(rid,{})
  end=t.find('## annotatsiyalar')
  ms=list(re.finditer(r'^JOB (.+?) · (\w*) · (\S+) → (\S+) · ',t,re.M))
  jobs=[]
  for q,jm in enumerate(ms):
    nm,co,s,e=jm.groups()
    seg=t[jm.start():(ms[q+1].start() if q+1<len(ms) else end)]
    try: d=fmt(int((f(e)-f(s)).total_seconds()))
    except Exception: d='-'
    steps=[[n2,ST.get(c2,'wait'),f'{int((f(e2)-f(s2)).total_seconds())} s'] for n2,st2,c2,s2,e2 in re.findall(r'^  \d+\. (.+?) · (\w+)/(\w*) · (\S+) → (\S+)$',seg,re.M)]
    jobs.append({'name':nm,'st':ST.get(co,'wait'),'dur':d,'steps':steps})
  ann=re.findall(r'^  \[(\w+)\] [^:\n]*: (.*)$',t,re.M)
  h=re.search(r'natija: (\S+)',t).group(1)
  out[k]={'id':rid,'n':a.get('n'),'title':a.get('title'),'br':br,'sha':sha,'st':ST.get(h,'wait'),'dur':fmt(a['dur']) if a else '-','at':a.get('at'),'jobs':jobs,'ann':ann}
OUT.write_text("\n// ============================================================\n//  CI/CD-2 RUN MA'LUMOTI — AVTO: dev/cicd2-runlar.py (manba: manba/cicd2-out, GitHub API)\n// ============================================================\nconst RUNS = " + json.dumps(out, ensure_ascii=False) + ";\n")
print("yozildi:", OUT.relative_to(ROOT), len(out), "run")
