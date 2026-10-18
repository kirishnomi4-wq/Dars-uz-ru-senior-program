import re, sys
exec(open(sys.argv[1],encoding='utf-8').read().split('T = {')[0])
f, upto = sys.argv[2], int(sys.argv[3])
sc,_ = screens(f)
def uzvals(t):
    out=[]
    for m in re.finditer(r"uz:\s*(\"((?:[^\"\\]|\\.)*)\"|'((?:[^'\\]|\\.)*)'|`([^`]*)`|<>(.*?)</>)", t, flags=re.S):
        v = next(g for g in m.groups()[1:] if g is not None)
        v = re.sub(r"<[^>]+>", "", v); v = re.sub(r"\{['\"]([^'\"]*)['\"]\}", r"\1", v); v = re.sub(r"\{[^{}]*\}", "", v)
        v = re.sub(r"\s+"," ",v).strip()
        if v: out.append(v)
    return out
def codes(t):
    t2 = re.sub(r"(uz|ru):\s*(\"(?:[^\"\\]|\\.)*\"|'(?:[^'\\]|\\.)*'|`[^`]*`|<>.*?</>)", "", t, flags=re.S)
    t2 = re.sub(r"(className|style|key|id|src|alt|href|aria-\w+|data-\w+|type|role|viewBox|fill|stroke|d)=(\"[^\"]*\"|\{[^{}]*\})", "", t2)
    out=[]
    for m in re.finditer(r"\"((?:[^\"\\\n]|\\.){2,})\"|'((?:[^'\\\n]|\\.){2,})'|`([^`]{2,})`", t2):
        v = next(g for g in m.groups() if g is not None)
        if re.search(r"[<>;{}()=+\[\]]|console|let |const |function|return|for |if ", v) and not re.search(r"^[\w\- ]+$", v) and '${' not in v[:3]:
            out.append(re.sub(r"\s+"," ",v.replace('\\n',' ⏎ '))[:140])
    return out
for i,(n,t) in enumerate(sc[:upto+1]):
    u = uzvals(t); c = codes(t)
    print(f"\n[s{i} {n}]")
    print("  MATN: " + " ‖ ".join(u)[:1400])
    if c: print("  KOD: " + " ‖ ".join(dict.fromkeys(c))[:700])
