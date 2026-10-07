# 14-Modul MD v3 ni mustaqil tekshirish (13-Modul vositalari asosida, 08.10.2026, F-1008-554)
#   python3 feedback/F-1008-14modul/vositalar/mdtekshir.py feedback/F-1008-14modul/NN-*-v3.md
import re, sys, collections, subprocess, os
REJA = {'01': 16, '02': 15, '03': 19, '04': 12, '05': 12, '06': 12, '07': 12, '08': 12, '09': 12, '10': 12, '11': 12, '12': 12, '13': 12}
NOM = {}
for l in open(os.path.join(os.path.dirname(__file__), '..', '00-NOMLAR.md'), encoding='utf-8'):
    m = re.match(r'\| (\d+) \| m12-\d+ \| [^|]+ \| \*\*(.+?)\*\*', l)
    if m: NOM[int(m.group(1))] = m.group(2)
for p in sys.argv[1:]:
    s = open(p, encoding='utf-8').read(); L = s.split('\n'); nn = os.path.basename(p)[:2]
    scr = [l for l in L if re.match(r'^## \d+ · ', l)]
    i = s.lower().find('## jonli viktorina'); j = s.find('\n## ', i + 5)
    ar = collections.Counter(re.findall(r'✔\s*\**\s*([ABCD])\b', s[i:j])) if i >= 0 else None
    if i >= 0 and not ar:  # ikkinchi shakl: «N. savol» + «   - ✔ variant» (✔ o'rni = harf)
        ar = collections.Counter()
        for blok in re.split(r'\n(?=\d+\. )', s[i:j])[1:]:
            v = [l for l in blok.split('\n') if re.match(r'^\s+- ', l)]
            for k, l in enumerate(v[:4]):
                if '✔' in l: ar['ABCD'[k]] += 1
        if not ar:  # uchinchi shakl: «N. savol? ✔ a · b · c · d» (bir qatorda)
            for l in s[i:j].split('\n'):
                if re.match(r'^\d+\. ', l) and '✔' in l:
                    opts = re.split(r' · ', l.split('?', 1)[-1])
                    for k, o in enumerate(opts[:4]):
                        if '✔' in o: ar['ABCD'[k]] += 1
    uzun = []
    for n, l in enumerate(L):
        m = re.search(r'Sarlavha:\s*\*\*(.+?)\*\*', l)
        if m and len(m.group(1)) > 55: uzun.append(('sarlavha', n + 1, len(m.group(1))))
        m = re.match(r'^- Xulosa[^:]*:\s*(.+?)\s*$', l)
        if m:
            t = re.sub(r'\s*\(\d+\)\s*$', '', re.sub(r'\s*<!--.*?-->', '', m.group(1)))
            if len(t) > 110: uzun.append(('xulosa', n + 1, len(t)))
    k = int(nn); kel = NOM.get(k + 1) if k < 13 else 'Zaxira dars: zalni tayyorlash'
    keyingi_ok = bool(kel) and (kel in s)
    pat = {
        'kafolat': r'\bhar doim\b|\bhech qachon\b|\bdarhol\b|\bdarrov\b|100%|\bkafolat|\balbatta\b',
        'kelajak': r'tez orada|yaqinda|keyingi darsda',
        'ayb': r'xatongiz emas|sizda emas',
        'inglizcha prozada': r'\b(performance|polish|bundle|lazy load|feature freeze|storytelling|Q&A|progon)\b',
        'kod raqam': r'\bm12-\d\d\b|Modul 14\b|src/12',
        'sinov (demo)': r'demo sinov|sinov progon|sinov o.tish',
        'investitsiya summasi': r'investitsiya (summasi|so.raymiz|kerak)|\$\s?\d|\d+\s?(mln|ming) dollar',
        'taqiq so\'z': r'\bsir\b|\bsehr|mo.jiza|professional|\bmohiyat',
        'emoji': r'[\U0001F300-\U0001FAFF]',
    }
    if nn != '13': pat['Demo Day (faqat 13-dars, 9.13)'] = r'Demo Day'  # 08.10: 07 arena distraktorida topildi
    bad = {}
    for kk, v in pat.items():
        hits = [n + 1 for n, l in enumerate(L) if re.search(v, l, re.I)]
        if hits: bad[kk] = hits[:8]
    tx = len(re.findall(r'<!-- TAXMIN T\d+', s))
    lint = subprocess.run(['npm', 'run', '-s', 'lint:til', '--', p], capture_output=True, text=True)
    lo = re.sub(r'\x1b\[[0-9;]*m', '', lint.stdout + lint.stderr)
    m = re.search(r'error:\s*(\d+)', lo); err = int(m.group(1)) if m else (0 if 'TOZA' in lo else '?')
    print(f'### {os.path.basename(p)}: {len(L)} qator · ekran {len(scr)}/{REJA.get(nn)} · arena {dict(ar) if ar else "yo`q"} · uzun {uzun} · '
          f'keyingi dars {"✓" if keyingi_ok else "✗ (" + str(kel) + ")"} · TAXMIN {tx} · lint:til error {err}')
    for kk, v in bad.items(): print(f'   [{kk}] qatorlar: {v}')
