import re,sys,glob,collections
files=[]
for d in sys.argv[1].split(','):
    files+=glob.glob(f'src/{d}/*.jsx')
pairs=[]
pat=re.compile(r"uz:\s*(['\"])((?:\\.|(?!\1).)*)\1\s*,\s*ru:\s*(['\"])((?:\\.|(?!\3).)*)\3")
for f in files:
    s=open(f,encoding='utf-8').read()
    for m in pat.finditer(s):
        pairs.append((m.group(2),m.group(4),f))
print('juftlar:',len(pairs),'fayl:',len(files))
terms=[l.split('|') for l in open(sys.argv[2],encoding='utf-8').read().strip().split('\n')]
for t in terms:
    uz=t[0]; rus=t[1:]
    hits=[(u,r) for u,r,f in pairs if re.search(uz,u,re.I)]
    c=collections.Counter()
    for u,r in hits:
        for ru in rus:
            if re.search(ru,r,re.I): c[ru]+=1
    print(f'{uz:28s} uz-satr {len(hits):4d} | '+' · '.join(f'{k}:{v}' for k,v in c.most_common()))
