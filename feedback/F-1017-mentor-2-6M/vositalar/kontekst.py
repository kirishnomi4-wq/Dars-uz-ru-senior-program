import re, sys
exec(open(sys.argv[1],encoding='utf-8').read().split('T = {')[0])
def show(f, rx, upto, pre=False):
    sc,_ = screens(f)
    print(f"\n=== {f.split('/')[-1]} /{rx}/ (praktika ekran {upto} dan keyin)")
    for i,(n,t) in enumerate(sc[:upto+3]):
        v = strip_ru(t)
        for m in list(re.finditer(rx, v))[:1]:
            s=v[max(0,m.start()-90):m.end()+90].replace('\n',' ⏎ ')
            print(f"  s{i} {n}{' (KEYIN)' if i>upto else ''}: …{s}…")
    if pre:
        idx = ORDER.index(f)
        for p in ORDER[:idx]:
            try: txt = strip_ru(open(p,encoding='utf-8').read())
            except FileNotFoundError: continue
            ms = list(re.finditer(rx, txt))
            if ms:
                m=ms[0]; print(f"  [oldingi] {p.split('/')[-1]} ({len(ms)}x): …{txt[max(0,m.start()-80):m.end()+80].replace(chr(10),' ⏎ ')}…")
for a in sys.argv[2:]:
    f, rx, upto, pre = a.split('||'); show('src/'+f, rx, int(upto), pre=='1')
