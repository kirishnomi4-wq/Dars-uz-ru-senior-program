import re,sys,collections
p=sys.argv[1]; s=open(p,encoding='utf-8').read(); L=s.split('\n')
scr=[l for l in L if re.match(r'^## \d+ · ',l)]
i=s.lower().find('## jonli viktorina'); j=s.find('\n## ',i+5)
ar=collections.Counter(re.findall(r'✔\s*\**\s*([ABCD])\b',s[i:j])) if i>=0 else 'yo\'q'
bad=[]
for k,v in {'serverda/serverning':r'serverda|serverning','qonun nomi':r'\bFuqarolik','karta raqami':r'\b\d{4} \d{4} \d{4} \d{4}\b','ayb':r'xatongiz emas|sizda emas','webhook testi (prozada)':r'webhook testi','test holati':r'test holati'}.items():
    n=len(re.findall(v,s)); 
    if n: bad.append(f'{k}:{n}')
long=[]
for n,l in enumerate(L):
    m=re.search(r'Sarlavha:\s*\*\*(.+?)\*\*',l)
    if m and len(m.group(1))>55: long.append((n+1,len(m.group(1))))
print(f'{p.split("/")[-1]}: {len(L)} qator · ekran {len(scr)} · arena {dict(ar) if not isinstance(ar,str) else ar} · sarlavha>55 {long} · belgilar {bad}')
