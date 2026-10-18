# F-1015-161: Yakun ekrani 102 darsda bir xil — yorliq «Dars tugadi» (sarlavha natijani aytadi, yorliq takrorlamaydi),
# CODE STRIKE banneri yozuvsiz (stats={false}). Zaxira arxiv/F-1015-161-oldin/.
import glob, re, sys, os, shutil
ROOT = '/home/kali/Desktop/internetLesson'
F = [a for a in sys.argv[1:] if a.endswith('.jsx')] or sorted(glob.glob(ROOT + '/src/[5-9]-Modull/*.jsx') + glob.glob(ROOT + '/src/1[0-2]-Modull/*.jsx')) + [ROOT + '/src/pm/PmMetricsLesson.jsx']
YOZ = '--yoz' in sys.argv
ZAX = ROOT + '/arxiv/F-1015-161-oldin'
YANGI = "tr({ uz: 'Dars tugadi', ru: 'Урок окончен' })"
def jufti(s, i):
    # s[i] == '{' → mos '}' indeksi (satr ichidagi qavslarni hisobga olib)
    d = 0; q = None; k = i
    while k < len(s):
        c = s[k]
        if q:
            if c == '\\': k += 2; continue
            if c == q: q = None
        elif c in '\'"`': q = c
        elif c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: return k
        k += 1
    raise ValueError('jufti yoq')
ok = 0
for f in F:
    s = open(f).read(); nom = os.path.relpath(f, ROOT)
    m = re.search(r'<QYakun\b', s) or re.search(r'className="hero-chips"', s)
    st = s.rfind('\nconst ', 0, m.start()); en = s.find('\n};', m.start())
    b = s[st:en]; o = b; izoh = []
    c = re.search(r'chip=\{', b)
    if c and '<QYakun' in b:
        j = jufti(b, c.end() - 1); b = b[:c.end()] + YANGI + b[j:]; izoh.append('chip')
    else:
        c = re.search(r'<span className="tick">✓</span> \{', b)
        if c:
            j = jufti(b, c.end() - 1); b = b[:c.end()] + YANGI + b[j:]; izoh.append('tick')
        else: print('CHIP?', nom)
    b, n = re.subn(r'<CsWordmark(?![^>]*\bstats=)', '<CsWordmark stats={false}', b); 
    if n: izoh.append(f'stats+{n}')
    if b != o:
        if YOZ:
            os.makedirs(ZAX + '/' + os.path.dirname(nom), exist_ok=True)
            if not os.path.exists(ZAX + '/' + nom): shutil.copy(f, ZAX + '/' + nom)
            open(f, 'w').write(s[:st] + b + s[en:])
        ok += 1
    if izoh and izoh != ['chip'] and izoh != ['tick']: print(nom, izoh)
print('ozgardi', ok, '(yozildi)' if YOZ else '(quruq)')
