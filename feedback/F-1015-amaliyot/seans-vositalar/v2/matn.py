import re,sys
f=sys.argv[1]; s=open(f,encoding='utf8').read()
order=[o.strip() for o in re.search(r'const screens\s*=\s*\[([^\]]*)\]',s).group(1).split(',') if o.strip()]
starts=[(m.start(),m.group(1)) for m in re.finditer(r'^(?:const|function) (Screen\w*)\b',s,re.M)]
B={}
for i,(p,n) in enumerate(starts):
    e=starts[i+1][0] if i+1<len(starts) else len(s); B[n]=s[p:e]
def clean(x): x=re.sub(r'<[^>]+>','',x); x=re.sub(r'\{[^{}]*\}','',x); return re.sub(r'\s+',' ',x).strip()
lim=int(sys.argv[2]) if len(sys.argv)>2 else 7
for i,n in enumerate(order):
    b=B.get(n,'')[:9000]
    uz=[clean(u) for u in re.findall(r"uz:\s*(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`[^`]*`|<>.*?</>)",b,re.S)]
    uz=[u for u in uz if len(u)>12][:lim]
    print(f'--{i} {n}: '+' ¦ '.join(u[:110] for u in uz))
