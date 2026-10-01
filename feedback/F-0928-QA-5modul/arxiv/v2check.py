import re,sys,os,glob
FB='/home/kali/Desktop/internetLesson/feedback/F-0928-QA-5modul/'
EMO=re.compile('[\U0001F300-\U0001FAFF☀-⛿✅❌⭐✨❗‼⏰-⏺]')
def ticks(md):
    # quiz lines: "N. question ... ✔ ..." -> index of ✔ among ' · ' split parts (after '?')
    out=[]
    for l in md.split('\n'):
        m=re.match(r'^\s*(\d+)\. (.*)$',l)
        if m and '✔' in l and ' · ' in l:
            body=m.group(2); q,_,opts=body.partition('? ')
            parts=[p.strip() for p in opts.split(' · ')] if opts else [p.strip() for p in body.split(' · ')]
            idx=[i for i,p in enumerate(parts) if p.startswith('✔')]
            out.append((int(m.group(1)), idx[0] if idx else None, len(parts)))
    return out
def inline(md):
    res=[]; cur=None; n=0
    for l in md.split('\n'):
        h=re.match(r'^## (\d+) · ',l)
        if h: cur=int(h.group(1)); n=0; continue
        m=re.match(r'^  - (.*)$',l)
        if cur is not None and m:
            if m.group(1).startswith('✔'): res.append((cur,n))
            n+=1
    return res
for p in sorted(glob.glob(sys.argv[1]+'/*-v2.md')):
    name=os.path.basename(p); nn=name[:2]
    v2=open(p,encoding='utf-8').read()
    old=open(glob.glob(FB+nn+'-*-sozlar.md')[0],encoding='utf-8').read()
    heads=len(re.findall(r'^## \d+ · ',v2,re.M)); heads_old=len(re.findall(r'^## \d+ · ',old,re.M))
    txt=[l for l in v2.split('\n') if re.match(r'^(- |  - |[0-9]+\. |\| )',l) and not l.startswith('| #') and 'Olib tashlanadi' not in l and not l.startswith('✎')]
    emo=[l[:70] for l in txt if EMO.search(re.sub(r'✅ \(final\)|\| ✅ \||✅$','',l))]
    T='\n'.join(l for l in txt if not l.startswith('| ')); bj=len(re.findall(r'Botjon',T)); df=len(re.findall(r'[Dd]aftar',T)); cyr=len(re.findall(r'[Ѐ-ӿ]',v2)); curly=len(re.findall(r'[‘’ʻʼ]',v2))
    tq_new=ticks(v2); tq_old=ticks(old)
    dq=[(a,b) for (a,b) in zip(tq_old,tq_new) if a[1]!=b[1] or a[0]!=b[0]]
    il_new=inline(v2); il_old=inline(old)
    kd='Keyingi dars' in v2
    print(f"{name}: ekran {heads}/{heads_old} · Botjon {bj} · daftar {df} · kirill {cyr} · qiyshiq ' {curly} · emoji-qator {len(emo)} · arena ✔ {len(tq_new)}/{len(tq_old)} farq {len(dq)} · inline ✔ new{il_new} old{il_old} · keyingi-dars {kd}")
    for e in emo[:4]: print('   EMO:',e)
    for d in dq[:4]: print('   ARENA farq:',d)
