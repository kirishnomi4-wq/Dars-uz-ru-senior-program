# F-1015-144 (A): «Ortda qoldingizmi» bloklari o'quvchi ekranidan olinadi — JSX'dagi `ortda={…}` atributi (qiymati oddiy
# identifikator bo'lmasa) qavs-moslik bilan o'chiriladi. Render qatorlari `{ortda && …}` / QBlok `ortda = []` sukuti bilan o'zi yo'qoladi.
# python3 ortda144.py [--yoz] fayl...
import re, sys, shutil, os
yoz = '--yoz' in sys.argv
for p in [a for a in sys.argv[1:] if not a.startswith('--')]:
    s = open(p, encoding='utf-8').read(); out = []; i = 0; n = 0
    for m in re.finditer(r'\s+ortda=\{', s):
        if m.start() < i: continue
        j = m.end(); d = 1; q = None
        while d:
            c = s[j]
            if q:
                if c == '\\': j += 1
                elif c == q: q = None
            elif c in '\'"`': q = c
            elif c == '{': d += 1
            elif c == '}': d -= 1
            j += 1
        val = s[m.end():j - 1].strip()
        if re.fullmatch(r'[A-Za-z_]\w*', val): continue
        out.append(s[i:m.start()]); i = j; n += 1
    out.append(s[i:]); t = ''.join(out)
    print(p, n)
    if yoz and n:
        b = '/home/kali/Desktop/internetLesson/arxiv/F-1015-144-oldin/' + os.path.basename(p)
        if not os.path.exists(b): shutil.copy(p, b)
        open(p, 'w', encoding='utf-8').write(t)
