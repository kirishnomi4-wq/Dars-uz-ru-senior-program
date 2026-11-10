#!/usr/bin/env python3
"""Ekran tartib raqami → komponent funksiyasi va kodi (04.11). ISHLATISH: python3 dev/ekran-kod.py <dars-papka: jest2> <1,3,6>"""
import re, sys, pathlib
d, pos = sys.argv[1], [int(x) for x in sys.argv[2].split(',')]
P = pathlib.Path('/home/kali/Desktop/internetLesson/src/mentor-kurs') / d / 'parts'
if d == 'nest1': P = pathlib.Path('/home/kali/Desktop/internetLesson/src/mentor-kurs/parts')
files = sorted(P.glob('*.jsx')); src = {f: f.read_text() for f in files}
allt = '\n'.join(src.values())
m = re.search(r'const SCREENS = \[(.*?)\];', allt, re.S); names = [x.strip() for x in m.group(1).split(',') if x.strip()]
for n in pos:
    fn = names[n - 1]; print(f'===== {n}: {fn}')
    for f, t in src.items():
        i = t.find(f'function {fn}(')
        if i < 0: continue
        sm = re.search(r'S(\w*) = (?:mkS|mkPractice)\(', t[t.rfind('\n', 0, max(0, i - 1500)):i])
        body = t[i:]; j = body.find('\n}\n'); body = body[:j + 2]
        # S ta'rifi
        sv = re.search(r'<Lesson p=\{p\} S=\{(\w+)\}', body)
        if sv:
            dm = re.search(rf'^const {sv.group(1)} = .*$', t, re.M)
            if dm: print(dm.group(0)[:300])
        print('\n'.join(l[:240] for l in body.split('\n')[:24])); break
