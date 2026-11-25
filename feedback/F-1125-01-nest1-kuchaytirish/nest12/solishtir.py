#!/usr/bin/env python3
"""F-1125-01 · Nest 11 chiqishlari (F-1029-02 manba/nest-out) bilan Nest 12 chiqishlarini solishtiradi.
O'zgaruvchan qismlar (PID, vaqt, +Nms, yo'l, stek satrlari, ETag, Date) tekislanadi — qolgan har farq ko'rsatiladi.
Ishlatish: solishtir.py <eski papka> <yangi papka> [holat-nomi ...]"""
import sys, os, re, difflib

OLD, NEW = sys.argv[1], sys.argv[2]
ONLY = sys.argv[3:]
# yangi nom -> eski nom (asl skriptlarda boshqacha atalganlari)
ALIAS = {'09-abc': '19-abc-nazorat'}
ANSI = re.compile(r'\x1b\[[0-9;?]*[A-Za-z]')


def norm_log(s):
    s = ANSI.sub('', s).replace('\r', '')
    out = []
    for ln in s.split('\n'):
        ln = re.sub(r'^\[Nest\] \d+\s+- [\d/]+, [\d:]+ [AP]M\s+', '[Nest] ', ln)
        ln = re.sub(r'\s+\+\d+ms$', '', ln)
        ln = re.sub(r'/tmp/claude-\S*?/cars-api/', '<loyiha>/', ln)
        ln = re.sub(r"id: '[0-9a-f]+'", "id: '<id>'", ln)
        ln = re.sub(r'^\[Nest\]\s+(LOG|ERROR|WARN|DEBUG|VERBOSE)\s+', r'[Nest] \1 ', ln)
        if re.match(r'^\s+at ', ln):
            ln = '    at <stek>'
            if out and out[-1] == ln:
                continue
        out.append(ln.rstrip())
    while out and not out[-1]:
        out.pop()
    return out


def norm_curl(s):
    s = s.replace('\r', '')
    out = []
    for ln in s.split('\n'):
        if ln.startswith('### '):
            h = ln[4:].strip()
            h = re.sub(r'^curl\s+', '', h)
            if h.startswith('POST-empty:'):
                h = 'POST ' + h[11:] + ' {}'
            elif h.startswith('POST-nobody:'):
                h = 'POST ' + h[12:] + ' NOBODY'
            elif h.startswith('/'):
                h = 'GET ' + h
            elif re.match(r'^POST /\S+$', h):
                h = h + ' {"brand":"Chevrolet","model":"Cobalt","price":145}'
            ln = '### ' + h
        if re.match(r'^(Date|ETag|Keep-Alive|Connection):', ln, re.I):
            continue
        out.append(ln.rstrip())
    out = [x for i, x in enumerate(out) if x or (i and out[i - 1])]
    while out and not out[-1]:
        out.pop()
    return out


def read(d, name):
    p = os.path.join(d, name)
    return open(p, encoding='utf-8', errors='replace').read() if os.path.exists(p) else None


names = sorted(f for f in os.listdir(NEW) if os.path.isfile(os.path.join(NEW, f)))
same, diff, yangi = [], [], []
for f in names:
    base, ext = os.path.splitext(f)
    if ONLY and base not in ONLY:
        continue
    oldf = ALIAS.get(base, base) + ext if base in ALIAS else f
    a, b = read(OLD, oldf), read(NEW, f)
    if a is None:
        yangi.append(f)
        continue
    fn = norm_curl if ext == '.curl' else norm_log
    A, B = fn(a), fn(b)
    if A == B:
        same.append(f)
        continue
    diff.append(f)
    print(f'\n━━━━ {f}  (eski: {oldf}) ━━━━')
    for ln in difflib.unified_diff(A, B, 'Nest 11', 'Nest 12', lineterm='', n=1):
        print(ln[:300])
print('\n==== XULOSA ====')
print('bir xil  :', ', '.join(same) or '—')
print('farq bor :', ', '.join(diff) or '—')
print("eskisi yo'q (faqat yangi):", ', '.join(yangi) or '—')
