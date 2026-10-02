import re, os, sys
css=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'lms-host.css'),encoding='utf8').read()
tw={}
# F-0929-94 (S12=A, 01.10): avvalgi `(^|})` yopuvchi } ni yeb har ikkinchi qoidani o`tkazib yuborardi (401/812 sinf) — endi bo`sh guruh
for m in re.finditer(r'()([^{}]+)\{([^{}]*)\}',css):
    for sel in m.group(2).split(','):
        mm=re.fullmatch(r'\.([a-zA-Z][\w-]*)',sel.strip())
        if mm: tw[mm.group(1)]=m.group(3)[:60]
R='/home/kali/Desktop/internetLesson/'
targets=sys.argv[1:]
def expr_after(src,i):
    j=i+9
    while j<len(src) and src[j] in ' \t': j+=1
    if j>=len(src) or src[j] not in '=:': return None
    j+=1
    while src[j] in ' \t': j+=1
    c=src[j]
    if c in '"\'': return src[j:src.index(c,j+1)+1]
    if c=='`': return src[j:src.index('`',j+1)+1]
    if c=='{':
        d=0;k=j
        while k<len(src):
            if src[k]=='{': d+=1
            elif src[k]=='}':
                d-=1
                if d==0: return src[j:k+1]
            k+=1
    k=j
    while k<len(src) and src[k] not in ',\n}': k+=1
    return src[j:k]
def toks(e):
    e=re.sub(r'style=\{\{.*?\}\}','',e,flags=re.S)
    out=set()
    for s in re.findall(r"'([^'\n]*)'",e)+re.findall(r'"([^"\n]*)"',e): out.update(s.split())
    for s in re.findall(r'`([^`]*)`',e): out.update(re.sub(r'\$\{[^}]*\}',' ',s).split())
    return out
files=[]
for t in targets:
    p=R+t
    if os.path.isdir(p): files+= [t.rstrip('/')+'/'+f for f in sorted(os.listdir(p)) if f.endswith(('.jsx','.js'))]
    else: files.append(t)
seen={}
for f in files:
    src=open(R+f,encoding='utf8',errors='replace').read()
    for m in re.finditer(r'className',src):
        e=expr_after(src,m.start())
        if not e: continue
        for t in toks(e):
            if t in tw and t!='italic':
                ln=src.count('\n',0,m.start())+1
                seen.setdefault((f,t),[]).append((ln,e[:110].replace('\n',' ')))
for (f,t),v in seen.items():
    print(f'{f}  .{t} {{{tw[t]}}}  ×{len(v)}  qator: {",".join(str(x[0]) for x in v[:6])}\n      {v[0][1]}')
print('JAMI:',len(seen),'(fayl×sinf) ·',len({f for f,_ in seen}),'fayl')
