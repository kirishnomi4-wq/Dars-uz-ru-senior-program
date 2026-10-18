# Har darsdagi har ekran: «Keyingi» tugmasi qaysi holatga qulflangan va u holat qaytganda tiklanadimi.
import re, sys, json, collections
ROOT='/home/kali/Desktop/internetLesson/'
KW = re.compile(r'storedAnswer|stored\b|saved|initial|answers\[|prev\b|restore|progRead|localStorage', re.I)
IGN = {'isMentor','_resc','true','false','null','undefined','live','mode','length','tr','T','Math','Boolean','Object','Array','includes','every','some','filter','size','has','map','keys','values'}
def split_components(src):
    starts = [m.start() for m in re.finditer(r'\n(?:const [A-Z]\w* = |function [A-Z]\w*\s*\()', src)]
    starts.append(len(src))
    for a, b in zip(starts, starts[1:]):
        m = re.match(r'\n(?:const ([A-Z]\w*)|function ([A-Z]\w*))', src[a:])
        yield (m.group(1) or m.group(2)), a, src[a:b]
def ids(expr):
    return set(re.findall(r'(?<![\.\w])([A-Za-z_]\w*)', expr)) - IGN
def analyze(body):
    gates = []
    for m in re.finditer(r'<NavNext\b', body):
        seg = body[m.start(): m.start()+900]
        d = re.search(r'disabled=\{', seg)
        if not d or d.start() > seg.find('/>') > 0 and seg.find('/>') < d.start(): continue
        i = d.end(); depth = 1; j = i
        while j < len(seg) and depth:
            depth += {'{':1,'}':-1}.get(seg[j],0); j += 1
        gates.append(seg[i:j-1].strip())
    gates = [g for g in gates if g not in ('false',)]
    if not gates: return None
    states = {}
    for m in re.finditer(r'const \[(\w+),\s*(set\w+)\]\s*=\s*(useState|useReducer)\(', body):
        i = m.end(); depth = 1; j = i
        while j < len(body) and depth:
            depth += {'(':1,')':-1}.get(body[j],0); j += 1
        init = body[i:j-1]
        restored = bool(KW.search(init))
        # useEffect ichida storedAnswer bilan set qilinadimi
        for e in re.finditer(r'useEffect\(\(\)\s*=>\s*\{', body):
            blk = body[e.end(): e.end()+600]
            if 'storedAnswer' in blk and m.group(2)+'(' in blk: restored = True
        states[m.group(1)] = (restored, init.strip()[:50])
    derived = {}
    for m in re.finditer(r'const (\w+)\s*=\s*([^;\n]+)', body):
        if m.group(1) not in states and not m.group(2).lstrip().startswith(('use', '(', 'async')):
            derived[m.group(1)] = m.group(2)
    hooks = {}
    for m in re.finditer(r'const (?:\{([^}]*)\}|\[([^\]]*)\]|(\w+))\s*=\s*(use(?!State|Reducer|Ref|Context|Effect|Memo|Callback)\w+)\(', body):
        for n in re.findall(r'\w+', m.group(1) or m.group(2) or m.group(3)): hooks[n] = m.group(4)
    memo = {}
    for m in re.finditer(r'const (\w+)\s*=\s*useMemo\(', body): derived[m.group(1)] = body[m.end(): m.end()+300]
    bad, unk, seen = set(), set(), set()
    def walk(n, depth=0):
        if n in seen or depth > 6: return
        seen.add(n)
        if n in states:
            if not states[n][0]: bad.add(n)
        elif n in hooks: unk.add(f'{n}←{hooks[n]}')
        elif n in derived:
            if KW.search(derived[n]): return
            for x in ids(derived[n]): walk(x, depth+1)
    for g in gates:
        for x in ids(g): walk(x)
    return dict(gate=gates[0][:70], bad=sorted(bad), unk=sorted(unk), onAnswer='onAnswer(' in body, stored='storedAnswer' in body,
                valve='_resc' in body, mentor='isMentor' in gates[0])
rows = []
for line in open(sys.argv[1]):
    mod, path = line.strip().split('|')
    src = open(ROOT+path).read()
    m = re.search(r'const screens\s*=\s*\[([^\]]+)\]', src)
    names = [x.strip() for x in m.group(1).split(',')] if m else []
    comps = {n: body for n, a, body in split_components(src)}
    for idx, n in enumerate(names):
        if n not in comps: continue
        r = analyze(comps[n])
        if r: rows.append(dict(mod=mod, file=path.split('/')[-1], idx=idx, screen=n, **r))
json.dump(rows, open('scan.json','w'), ensure_ascii=False, indent=0)
k = collections.Counter('BAD' if r['bad'] else ('UNK' if r['unk'] else 'OK') for r in rows)
print('qulflangan ekranlar:', len(rows), dict(k))
for r in rows:
    if r['bad'] or r['unk']:
        print(f"{'BAD' if r['bad'] else 'UNK'} {r['file']:34} {r['idx']:>2} {r['screen']:22} gate={r['gate'][:45]!r} bad={r['bad']} unk={r['unk']} onA={int(r['onAnswer'])}")
