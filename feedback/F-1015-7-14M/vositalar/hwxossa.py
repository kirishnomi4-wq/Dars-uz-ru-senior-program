# F-1015-123: uy vazifasi kartasidagi qolgan farqlar — maydon qutisi (ramka+padding), raqam doirasi 24px, «Keyingi dars» 13.5px ink2.
# Bitta qatorli CSS qoidasining faqat ko'rsatilgan xossalari almashtiriladi/qo'shiladi (qolgan deklaratsiyalar saqlanadi).
# python3 hwxossa.py <fayl...> [--yoz]
import re, sys
yoz = '--yoz' in sys.argv; fl = [a for a in sys.argv[1:] if not a.startswith('--')]
tanla = [i for i, k in enumerate(['--q', '--i', '--k']) if k in sys.argv]  # qaysi qoidalar
REGEX = r'\{((?:\$\{[^}]*\}|[^{}])*)\}'
QOIDA = [  # (selektor regex — prefiks-hw-…, {xossa: qiymat})
 (r'\.[a-z]{2,3}-hw-q', {'padding': '9px 11px', 'border': '1px solid ${T.line}', 'border-radius': '10px', 'background': '${T.bg}'}),
 (r'(?:ol\.)?\.?[a-z]{2,3}-hw-(?:qadam|q|band)(?: li)?(?: >)? (?:li )?(?:> )?i', {'flex': '0 0 24px', 'width': None, 'height': '24px'}),
 (r'(?:p\.|span\.)?\.?[a-z]{2,3}-hw-keyingi', {'font-size': '13.5px', 'line-height': '1.5', 'color': '${T.ink2}'}),
]
def tahrir(dek, x):
    d = [p.strip() for p in re.split(r';(?![^{]*\})', dek) if p.strip()]
    kv = []
    for p in d:
        k, _, v = p.partition(':'); kv.append([k.strip(), v.strip()])
    for k, v in x.items():
        hit = [e for e in kv if e[0] == k]
        if v is None: kv = [e for e in kv if e[0] != k]; continue
        if hit: hit[0][1] = v
        else: kv.append([k, v])
    return ' ' + '; '.join(f'{k}: {v}' for k, v in kv) + '; '
for f in fl:
    s = open(f, encoding='utf-8').read(); n0 = s; cnt = []
    for qi, (sel, x) in enumerate(QOIDA):
        if qi not in tanla: continue
        pat = re.compile(r'(?m)(^[ \t]*|\}[ \t]*)(' + sel + r') ' + REGEX)
        ms = [m for m in pat.finditer(s) if not re.search(r'@media', s[s.rfind('\n', 0, m.start()):m.start()])]
        for m in reversed(ms):
            s = s[:m.start()] + m.group(1) + m.group(2) + ' {' + tahrir(m.group(3), x) + '}' + s[m.end():]
        cnt.append(len(ms))
    print(f, cnt, 'ozgardi' if s != n0 else '-')
    if yoz: open(f, 'w', encoding='utf-8').write(s)
