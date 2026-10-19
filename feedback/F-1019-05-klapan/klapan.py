# F-1019-01/05 · klapan qatori «Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq» olinadi; klapan ochiq tugma «Davom etish» deydi.
# python3 klapan.py <fayl...>   (zaxira arxiv/F-1019-05-oldin/)
import re, sys, os, shutil
R = '/home/kali/Desktop/internetLesson'
QATOR = re.compile(r"\n?[ \t]*\{[^{}\n]*&& <p [^>\n]*>\{tr\(\{ uz: \"Qolganini keyinroq birga ko'rib chiqamiz — «Davom etish» ochiq\.\", ru: '[^'\n]*' \}\)\}</p>\}")
DAVOM = "tr({ uz: 'Davom etish', ru: 'Продолжить' })"
def blok(s, i):  # s[i] == '{' → mos '}' indeksi
    d = 0; j = i; q = None
    while j < len(s):
        c = s[j]
        if q:
            if c == '\\': j += 2; continue
            if c == q: q = None
        elif c in '"\'`': q = c
        elif c == '{': d += 1
        elif c == '}':
            d -= 1
            if d == 0: return j
        j += 1
    raise ValueError('blok yopilmadi')
for f in sys.argv[1:]:
    p = f'{R}/{f}'; s = open(p, encoding='utf8').read()
    b = f'{R}/arxiv/F-1019-05-oldin/{f}'; os.makedirs(os.path.dirname(b), exist_ok=True)
    if not os.path.exists(b): shutil.copy2(p, b)
    s, nq = QATOR.subn('', s)
    nn = 0; skip = []; i = 0
    while True:
        k = s.find('<NavNext', i)
        if k < 0: break
        e = k; d = 0
        while True:  # teg oxiri: '/>' blok tashqarisida
            c = s[e]
            if c == '{': e = blok(s, e) + 1; continue
            if s.startswith('/>', e): break
            e += 1
        teg = s[k:e]
        m = re.search(r"disabled=\{!(\w+) && !(_resc|rescue)\}", teg)
        if m and 'label=' in teg and 'F-1019-05' not in teg:
            done, resc = m.group(1), m.group(2)
            a = teg.index('label=') + len('label=')
            if teg[a] == '{':
                z = blok(teg, a); old = teg[a + 1:z]
                yangi = teg[:a] + '{' + f"{resc} && !{done} ? {DAVOM} : ({old})" + '}' + teg[z + 1:]
                s = s[:k] + yangi + s[e:]; e = k + len(yangi); nn += 1
            else: skip.append(teg[:80])
        elif re.search(r"!(_resc|rescue)", teg) and 'label=' in teg: skip.append(teg[:90])
        i = e
    open(p, 'w', encoding='utf8').write(s)
    print(f'{f}: qator −{nq}, tugma yorlig\'i {nn}' + (f' · O\'TKAZILDI {len(skip)}: {skip}' if skip else ''))
