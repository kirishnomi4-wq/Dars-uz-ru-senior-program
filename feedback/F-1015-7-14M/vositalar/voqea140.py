# F-1015-140 (A): QVoqea kartasida Zoomable faqat maketni o'rasa — ⛶ karta o'rtasida qoladi. Zoomable butun karta mazmunini o'raydi,
# karta div'i `data-zoom-asosiy` (206.6: ⛶ shu elementning yuqori o'ng burchagida). python3 voqea140.py [--yoz] fayl...
import re, sys, shutil, os
B = '/home/kali/Desktop/internetLesson/arxiv/F-1015-140-oldin/'
yoz = '--yoz' in sys.argv
for p in [a for a in sys.argv[1:] if not a.startswith('--')]:
    s = open(p, encoding='utf-8').read(); n = 0; pos = 0
    while True:
        m = re.compile(r'karta=\{<div className="([a-z0-9]+-voqea)"( key=\{[^}]*\})?>').search(s, pos)
        if not m: break
        # karta bloki oxiri: shu div yopilishi — chuqurlik bo'yicha
        i = m.end(); d = 1
        for t in re.finditer(r'<div\b[^>]*?(/?)>|</div>', s[i:]):
            if t.group(0) == '</div>': d -= 1
            elif not t.group(1): d += 1
            if d == 0: end = i + t.end(); break
        blok = s[m.start():end]
        zs = [x for x in re.finditer(r'<Zoomable>', blok)]
        if len(zs) != 1 or blok.count('</Zoomable>') != 1: print('!!', p, m.group(1), 'Zoomable', len(zs)); pos = end; continue
        yangi = blok.replace('<Zoomable>', '', 1).replace('</Zoomable>', '', 1)
        yangi = yangi.replace(m.group(0), 'karta={<Zoomable><div className="%s"%s data-zoom-asosiy>' % (m.group(1), m.group(2) or ''), 1)
        assert yangi.endswith('</div>'); yangi = yangi + '</Zoomable>'
        s = s[:m.start()] + yangi + s[end:]; n += 1; pos = m.start() + len(yangi)
    print(p, n)
    if yoz and n:
        if not os.path.exists(B + os.path.basename(p)): shutil.copy(p, B + os.path.basename(p))
        open(p, 'w', encoding='utf-8').write(s)
