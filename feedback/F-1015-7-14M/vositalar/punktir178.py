import re,sys,os,shutil
NEYTRAL=re.compile(r'T\.(line|ink|ink2|ink3)\b|fon\(T\.(ink|ink2|line)')
def ishla(s):
    # ${...} ni vaqtincha almashtiramiz (ichidagi {} qoidani buzmasin)
    ph=[]
    def sakla(m): ph.append(m.group(0)); return f'\u0001{len(ph)-1}\u0002'
    t=re.sub(r'\$\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', sakla, s)
    ols=lambda x: re.sub(r'\u0001(\d+)\u0002', lambda m: ph[int(m.group(1))], x)
    soni=[0,0,0,0]
    def qoida(m):
        sel,dec=m.group(1),m.group(2)
        if 'dashed' not in dec: return m.group(0)
        bor_fon=re.search(r'(^|;)\s*background(-color)?\s*:', dec) is not None
        soni_oldin=soni[0]
        def quti(mm):
            w,rang=mm.group(1),mm.group(2).strip()
            if NEYTRAL.search(ols(rang)) or re.search(r'#[0-9A-Fa-f]{3,8}',ols(rang)) and 'accent' not in ols(rang):
                soni[0]+=1
                return f'border: {w} solid transparent' + ('' if bor_fon else '; background: ${T.bg}')
            soni[1]+=1
            return f'border: {w} solid {rang}'
        dec2=re.sub(r'border\s*:\s*([\d.]+px)\s+dashed\s+([^;]+?)(?=\s*(;|$))', quti, dec)
        def yon(mm):
            soni[2]+=1; return f'border-{mm.group(1)}: {mm.group(2)} solid'
        dec2=re.sub(r'border-(top|bottom|left|right)\s*:\s*([\d.]+px)\s+dashed', yon, dec2)
        def stil(mm):
            soni[3]+=1; return 'border-style: solid'
        dec2=re.sub(r'border-style\s*:\s*dashed', stil, dec2)
        # neytral quti fonsiz qolmasin: oq/shaffof fon -> yumshoq dars foni (ramka endi shaffof)
        if soni_oldin != soni[0] and bor_fon:
            dec2=re.sub(r'(background(?:-color)?\s*:\s*)(transparent|none|#fff\b|#ffffff\b|white|\u0001\d+\u0002)', lambda mm: mm.group(1)+'${T.bg}' if (mm.group(2) in ('transparent','none','#fff','#ffffff','white') or 'T.paper' in ols(mm.group(2))) else mm.group(0), dec2)
        return sel+'{'+dec2+'}'
    t2=re.sub(r'([^{}\n]+)\{([^{}]*)\}', qoida, t)
    return ols(t2), soni
jami=[0,0,0,0]; o_zgardi=[]
for f in open(sys.argv[1]).read().split():
    s=open(f).read(); n,soni=ishla(s)
    if n!=s:
        d='arxiv/F-1015-178-oldin/'+os.path.dirname(f); os.makedirs(d,exist_ok=True)
        if not os.path.exists(d+'/'+os.path.basename(f)): shutil.copy(f,d)
        if '--yoz' in sys.argv: open(f,'w').write(n)
        o_zgardi.append((f,soni,n.count('dashed')))
    jami=[a+b for a,b in zip(jami,soni)]
for x in o_zgardi: print(x)
print('jami: neytral quti',jami[0],'· rangli quti',jami[1],'· yon chiziq',jami[2],'· border-style',jami[3],'· fayl',len(o_zgardi))
