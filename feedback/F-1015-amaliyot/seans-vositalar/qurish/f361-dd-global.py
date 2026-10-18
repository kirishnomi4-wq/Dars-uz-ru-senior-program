# F-1015-361 (17.10, foydalanuvchi 13-A): sudraladigan .dd-chip — brend gradient HAMMA modullarda (DE-159.15, F-1002-59; KATTA F-1002-59 ro'yxati).
# Faqat .dd-chip va .dd-chip::before qatorlari; ::before yo'q faylda — .dd-chip qatoridan keyin qo'shiladi. Takror yurgizilsa xavfsiz.
import re, sys, subprocess
ROOT = '/home/kali/Desktop/internetLesson'
exec(open(ROOT + '/feedback/F-1015-amaliyot/seans-vositalar/qurish/dd_gradient.py', encoding='utf-8').read())
fayllar = subprocess.run("grep -l '^\\s*\\.dd-chip {' src/*/*.jsx | xargs grep -L '\\.dd-chip {[^}]*linear-gradient'", shell=True, cwd=ROOT, capture_output=True, text=True).stdout.split()
for f in fayllar:
    p = ROOT + '/' + f; s = open(p, encoding='utf-8').read()
    if not re.search(r'(?m)^        \.dd-chip::before \{', s):
        s = re.sub(r'(?m)^(        \.dd-chip \{.*)$', lambda m: m.group(1) + '\n' + DD_BEFORE, s, count=1)
    t = dd_gradient(s)
    open(p, 'w', encoding='utf-8').write(t); print('ozgardi', f)
