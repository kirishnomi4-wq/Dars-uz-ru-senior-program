# lint-practice-signal — MentorPracticeStats o'qiydigan indeks == o'quvchi yozadigan indeks (F-0925-03).
# Ishlatish: python3 scripts/lint-practice-signal.py   (src/ bo'ylab; 0 «muammoli» shart)
import re,glob
out=[]
for f in sorted(glob.glob('src/**/*.jsx',recursive=True)):
    if '/eski/' in f: continue
    s=open(f,encoding='utf-8').read()
    parts=re.split(r'\n(?=(?:export\s+)?(?:const|function)\s+[A-Za-z]\w*\s*(?:=|\())',s)
    comp={}
    for p in parts:
        m=re.match(r'(?:export\s+)?(?:const|function)\s+(\w+)',p); comp[m.group(1) if m else '?']=p
    mps=comp.get('MentorPracticeStats')
    if not mps: continue
    r=re.search(r'liveAnswers\(\s*[\w.]+\s*,\s*([^)]+)\)',mps)
    read=r.group(1).strip() if r else '??'
    rb='PRACTICE_BASE' in read
    helpers={n for n,p in comp.items() if re.search(r'submitAnswer\(\s*PRACTICE_BASE',p) and n[0].islower()}
    for n,p in comp.items():
        if '<MentorPracticeStats' not in p: continue
        w=[x.strip() for x in re.findall(r'\.submitAnswer\(\s*([^,]+),',p)]
        w+=['PRACTICE_BASE(helper '+h+')' for h in helpers if re.search(r'\b'+h+r'\(',p)]
        # children components used in this screen that submit
        kids=[k for k in comp if k[0].isupper() and k!=n and re.search(r'<'+k+r'\b',p)]
        for k in kids:
            w+=[x.strip()+' (<'+k+'>)' for x in re.findall(r'\.submitAnswer\(\s*([^,]+),',comp[k])]
            w+=['PRACTICE_BASE(helper '+h+' in <'+k+'>)' for h in helpers if re.search(r'\b'+h+r'\(',comp[k])]
        if not w: out.append((f,n,read,'YOZUV TOPILMADI')); continue
        ok=[x for x in w if ('PRACTICE_BASE' in x)==rb]
        if not ok: out.append((f,n,read,'MOS EMAS: '+' | '.join(w)))
for o in out: print(*o,sep=' :: ')
print('muammoli:',len(out))
