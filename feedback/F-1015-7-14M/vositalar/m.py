import re,glob,sys
emo=re.compile('[\U0001F300-\U0001FAFF☀-➿⭐⬆↔-⇿]')
hexc=re.compile(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b')
tot={}
print("modul | fayl | emoji | noyob hex | 'ufq' | ekran~")
for d in range(5,13):
    fs=sorted(glob.glob(f'src/{d}-Modull/*.jsx'))
    e=0;H=set();u=0;sc=0
    for f in fs:
        t=open(f,encoding='utf8').read()
        e+=len(emo.findall(t)); H|=set(x.lower() for x in hexc.findall(t)); u+=len(re.findall(r'[Uu]fq',t))
        m=re.search(r'SCREEN_META\s*=\s*\[(.*?)\];',t,re.S)
        if m: sc+=m.group(1).count('{')
    print(f"{d+2}-M ({d}) | {len(fs)} | {e} | {len(H)} | {u} | {sc}")
