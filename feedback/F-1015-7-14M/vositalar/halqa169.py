# F-1015-169: 11–14-M guruh ramkasi olinadi (outline + ::after to'lqin); bitta element ishorasida doimiy outline olinadi, yumshoq ::after to'lqin qoladi (7–8-M turn-ring uslubi).
import glob, re, sys, os, shutil
ROOT = '/home/kali/Desktop/internetLesson'; YOZ = '--yoz' in sys.argv; ZAX = ROOT + '/arxiv/F-1015-169-oldin'
GURUH = re.compile(r'guruh|q-variantlar-kol|\.q-variantlar(?![\w-])|\.q-bashorat(?![\w-])')
ELEM = re.compile(r'halqa|btn-white-accent|\.q-btn')
SKIP = re.compile(r':focus|\.on\b|b-qizil|b-yashil|fc-front|\.ok\b|\.err\b')
OUT = re.compile(r'\s*outline: 2(?:\.5)?px solid [^;]+;|\s*outline-offset: [^;]+;')
jami = {'guruh_after': 0, 'guruh_outline': 0, 'elem_outline': 0}
for f in sorted(glob.glob(ROOT + '/src/[1-9]*-Modull/*.jsx')):
    s = open(f).read()
    if 'tolqin' not in s: continue
    L = s.split('\n'); o = list(L); nom = os.path.relpath(f, ROOT)
    for i, l in enumerate(L):
        t = l.strip()
        if not t.startswith('.') or '{' not in t: continue
        sel = t.split('{')[0]
        if SKIP.search(sel): continue
        if GURUH.search(sel):
            if '::after' in sel and 'tolqin' in t: L[i] = None; jami['guruh_after'] += 1
            elif 'outline: 2px solid' in t: L[i] = OUT.sub('', l); jami['guruh_outline'] += 1
        elif ELEM.search(sel) and re.search(r'outline: 2(?:\.5)?px solid', t) and '::after' not in sel:
            L[i] = OUT.sub('', l); jami['elem_outline'] += 1
    L = [x for x in L if x is not None]
    if L != o:
        print(nom, sum(1 for a, b in zip(o, o) if a) and '', len(o) - len(L), 'qator olindi')
        if YOZ:
            os.makedirs(ZAX + '/' + os.path.dirname(nom), exist_ok=True)
            if not os.path.exists(ZAX + '/' + nom): shutil.copy(f, ZAX + '/' + nom)
            open(f, 'w').write('\n'.join(L))
print(jami, '(yozildi)' if YOZ else '(quruq)')
