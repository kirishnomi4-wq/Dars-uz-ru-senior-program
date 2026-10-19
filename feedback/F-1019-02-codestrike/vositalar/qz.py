import re, json, os, sys
R='/home/kali/Desktop/internetLesson'
app=open(R+'/src/App.jsx',encoding='utf8').read()
imp={}
for m in re.finditer(r"(?:import\s+(\w+)\s+from\s+'(\./[^']+)')|(?:const\s+(\w+)\s*=\s*(?:React\.lazy|lazy|L)\(\(\)\s*=>\s*import\('(\./[^']+)'\)\))", app):
    n=m.group(1) or m.group(3); pth=m.group(2) or m.group(4); imp[n]=pth
blocks=[(m.start(), m.group(1)) for m in re.finditer(r"\n    id: '(\d+)', slug:", app)]
rows=[]
for bi,(pos,mid) in enumerate(blocks):
    end=blocks[bi+1][0] if bi+1<len(blocks) else len(app)
    seg=app[pos:end]
    for lm in re.finditer(r"\{ key: '([^']+)'[^\n]*?comp: (\w+)", seg):
        key,comp=lm.groups(); p=imp.get(comp)
        if not p: rows.append((int(mid),key,comp,None)); continue
        f=os.path.normpath(os.path.join(R,'src',p)); f=f if f.endswith('.jsx') else f+'.jsx'
        rows.append((int(mid),key,comp,f))
out=[]
for mid,key,comp,f in rows:
    if not (2<=mid<=10): continue
    if not f or not os.path.exists(f): out.append(dict(m=mid,key=key,comp=comp,file=None)); continue
    s=open(f,encoding='utf8').read()
    a=s.find('const QUIZ_BANK = [')
    if a<0: out.append(dict(m=mid,key=key,comp=comp,file=f[len(R)+1:],n=0)); continue
    b=s.find('\n];',a); body=s[a:b]
    qs=[]
    for line in body.split('\n'):
        if "q: {" not in line: continue
        qu=re.search(r"q:\s*\{\s*uz:\s*(['\"])(.*?)(?<!\\)\1",line)
        opts=re.findall(r"\{\s*uz:\s*(['\"])(.*?)(?<!\\)\1",line)
        c=re.search(r"correct:\s*(\d)",line)
        qs.append(dict(q=qu.group(2) if qu else None, opts=[o[1] for o in opts[1:]], c=int(c.group(1)) if c else None))
    out.append(dict(m=mid,key=key,comp=comp,file=f[len(R)+1:],n=len(qs),qs=qs))
json.dump(out,open(sys.argv[1],'w',encoding='utf8'),ensure_ascii=False,indent=1)
from collections import Counter
cm=Counter(); cq=Counter(); nf=[]
long=0; tot=0; lens=[]
for o in out:
    cm[o['m']]+=1; cq[o['m']]+=o.get('n',0)
    if not o.get('file') or not o.get('n'): nf.append((o['m'],o['key'],o['comp'],o.get('file')))
    for q in o.get('qs',[]):
        if q['q'] is None: continue
        L=len(q['q'])+sum(len(x) for x in q['opts']); lens.append(L); tot+=1
print('modul: dars / savol'); [print(f'  LMS {k}: {cm[k]} dars, {cq[k]} savol') for k in sorted(cm)]
print('jami savol', tot)
lens.sort(); 
for p in (50,75,90,95,99): print(f'  p{p} belgi (savol+4 variant): {lens[int(len(lens)*p/100)-1]}')
print('QUIZ_BANKsiz / fayl topilmadi:', len(nf)); [print('   ',x) for x in nf[:40]]
