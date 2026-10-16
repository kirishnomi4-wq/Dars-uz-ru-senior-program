import re,sys,json
rows=json.load(open(sys.argv[1]))
def clean(x):
    x=re.sub(r'<[^>]+>','',x); x=re.sub(r'\{[^{}]*\}','',x); return re.sub(r'\s+',' ',x).strip()
for r in rows:
    s=open(r['f'],encoding='utf8').read()
    order=re.search(r'const screens\s*=\s*\[([^\]]*)\]',s).group(1).split(',')
    order=[o.strip() for o in order if o.strip()]
    print(f"\n### {r['k']} {r['f']} ({len(order)})")
    starts=[(m.start(),m.group(1)) for m in re.finditer(r'^(?:const|function) (Screen\w*)\b',s,re.M)]
    blocks={}
    for i,(p,n) in enumerate(starts):
        e=starts[i+1][0] if i+1<len(starts) else len(s)
        blocks[n]=s[p:e]
    for i,n in enumerate(order):
        b=blocks.get(n,'')
        eb=re.search(r"eyebrow=\{\{ ?uz: ?'([^']*)'",b) or re.search(r'eyebrow=\{\{ ?uz: ?"([^"]*)"',b)
        h=re.search(r'<h[12][^>]*>\{tr\(\{ ?uz: ?(.{0,220})',b)
        title=clean(h.group(1))[:90] if h else ''
        tags=[]
        for k,p in [('BAJARDIM','Bajardim'),('CHECK','StepChecklist'),('QBLOK','QBlok'),('COMPILER','Compiler'),('NUSXA','Nusxala|clipboard'),('TEXTAREA','<textarea'),('INPUT','<input'),('SIM_TIMER','setTimeout'),('VSCODE','VS ?Code'),('TERMINAL','[Tt]erminal'),('ANTIGRAV','Antigravity'),('GEMINI','Gemini'),('POSTMAN','Postman'),('MC','MCScreen|options='),('DRAG','Drag|Sort'),('PRACTICEDONE','onPracticeDone|blokDone|PRACTICE_BASE')]:
            if re.search(p,b): tags.append(k)
        if b.strip().startswith('const %s = (props) =>'%n) or 'MCScreen' in b[:400]: tags.append('TEST')
        print(f"{i:2d} {n:18s} [{eb.group(1) if eb else ''}] {title} | {' '.join(tags)} | {len(b.splitlines())}q")
