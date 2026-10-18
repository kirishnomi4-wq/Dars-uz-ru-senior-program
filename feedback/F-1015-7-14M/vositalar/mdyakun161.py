# F-1015-161 MD sinxroni: Yakun «Belgi» → «✓ Dars tugadi · Testlar: N/N», arena yozuvidan «N SAVOL · N SONIYA · PODIUM» olinadi.
import glob, re, sys
YOZ = '--yoz' in sys.argv
fs = glob.glob('feedback/F-0928-QA-5modul/YAKUNIY/*.md') + glob.glob('feedback/F-0929-QA-6modul/YAKUNIY/*.md') + glob.glob('feedback/F-1005-*/YAKUNIY/*.md') + glob.glob('feedback/F-1006-12modul/YAKUNIY/*.md') + glob.glob('feedback/F-1006-12modul/*-v3.md') + glob.glob('feedback/F-1007-13modul/*-v3.md') + glob.glob('feedback/F-1008-14modul/*-v3.md')
n = 0
for f in sorted(fs):
    s = open(f).read()
    m = re.search(r'\n## [^\n]*(Yakun\b|Yakun ·|· Yakun)[^\n]*\n(.*?)(?=\n## |\Z)', s, re.S)
    if not m: continue
    b = m.group(2); o = b
    b = re.sub(r'^- Belgi: .*$', "- Belgi: ✓ Dars tugadi · Testlar: N/N ✎ F-1015-161", b, flags=re.M)
    b = re.sub(r'\d+ SAVOL · \d+ SONIYA · PODIUM · ', '', b)
    if b != o:
        n += 1; print(f)
        if YOZ: open(f, 'w').write(s[:m.start(2)] + b + s[m.end(2):])
print('ozgardi', n)
