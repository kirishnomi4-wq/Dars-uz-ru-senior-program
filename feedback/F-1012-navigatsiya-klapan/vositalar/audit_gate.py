# Har darsdagi har ekran-komponent: «Keyingi» tugmasi topshiriqqa qulflanganmi, holat storedAnswer'dan tiklanadimi,
# bajarilganda onAnswer chaqiriladimi, klapan (useStuckValve / _resc) bormi.
import re, sys, json
rows = []
for line in open(sys.argv[1]):
    mod, path = line.strip().split('|')
    src = open(path).read()
    # dars ekranlari ro'yxati
    m = re.search(r"const screens = \[([^\]]+)\]", src)
    names = [x.strip() for x in m.group(1).split(',')] if m else []
    starts = []
    for n in names:
        mm = re.search(r"\n(?:const|function) " + re.escape(n) + r"\b", src)
        if mm: starts.append((mm.start(), n))
    allstarts = sorted(set(x.start() for x in re.finditer(r"\n(?:const [A-Z]\w* = |function [A-Z]\w*\()", src)))
    valve = 'useStuckValve' in src
    for pos, n in sorted(starts):
        nxt = next((s for s in allstarts if s > pos), len(src))
        body = src[pos:nxt]
        gates = re.findall(r"<NavNext[^>]*?disabled=\{([^}]*)\}", body) + re.findall(r"className=\"btn-white-accent\"[^>]*?disabled=\{([^}]*)\}", body)
        gates = [g.strip() for g in gates if g.strip() not in ('false',)]
        if not gates: continue
        sa = 'storedAnswer' in body
        oa = 'onAnswer(' in body
        resc = '_resc' in body or 'rescue' in body
        kind = 'OK'
        if not sa: kind = 'TIKLANMAYDI'          # qaytganda topshiriq boshidan
        elif not oa: kind = 'SAQLANMAYDI'        # bajarilgani yozilmaydi
        rows.append(dict(mod=mod, file=path.split('/')[-1], screen=n, gate=gates[0][:60], stored=sa, onAnswer=oa, valve=resc, kind=kind))
json.dump(rows, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
import collections
c = collections.Counter(r['kind'] for r in rows)
print('qulflangan ekranlar:', len(rows), dict(c))
print('klapanli ekranlar:', sum(r['valve'] for r in rows), '· darslar:', len({r['file'] for r in rows if r['valve']}))
for r in rows:
    if r['kind'] != 'OK': print(f"  {r['kind']:12} {r['mod']:9} {r['file']:34} {r['screen']:18} disabled={{{r['gate']}}}")
