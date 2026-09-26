#!/usr/bin/env python3
# codemod-fc-hint — fleshkarta «bosing» yo'rig'ini olib tashlaydi (F-0926-04, foydalanuvchi 26.09:
# «InternetLesson'da 1-2-3 kartada bo'lsin, qolganiga umuman kerak emas; boshqa darslarda 1-kartada ham bo'lmasin — UI'ni buzadi»).
#   python3 scripts/codemod-fc-hint.py [--write] <fayl...>
# Olinadi: karta old yuzidagi «Javobni o'ylang 🤔 bosing» (.fc-cue) va karta ostidagi «👆 Kartani bosing…» (.fc-hint matni).
# `.fc-hint` elementi bo'sh holda QOLADI (min-height joyi saqlanadi — tugmalar paydo bo'lganda sahifa sakramasin).
# InternetLesson — bu skript bilan ishlanmaydi (u yerda swapRef.current < 3 sharti qo'lda).
import re, sys
W = '--write' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]
# 3-shakl: butun cue tr({ uz: <>… <span className="fc-tap">…</span></>, … }) ichida
CUE3 = re.compile(r'<span className="fc-cue">\{tr\(\{ uz: <>.*?</> \}\)\}</span>')
CUE = re.compile(r'<span className="fc-cue">(?:(?!</span></span>).)*?<span className="fc-tap">(?:(?!</span>).)*</span></span>')
CUE2 = re.compile(r'<span className="fc-cue">(?:(?!</span>).)*</span>')  # fc-tap'siz sodda shakl
HINT = re.compile(r'<p className="fc-hint">(?!</p>)(?:(?!</p>).)+</p>')
tot = 0
for f in files:
    if 'InternetLesson' in f: continue
    s = open(f, encoding='utf-8').read(); o = s
    s, a3 = CUE3.subn('', s)
    s, a = CUE.subn('', s); a += a3
    s, a2 = CUE2.subn('', s)
    s, b = HINT.subn('<p className="fc-hint" />', s)
    n = a + a2 + b; tot += n
    left = len(re.findall(r'Kartani bosing|Нажмите на карт|className="fc-cue"', s))
    print(f"{f}: cue={a + a2} hint={b}{'  ⚠ qoldiq ' + str(left) if left else ''}")
    if W and s != o: open(f, 'w', encoding='utf-8').write(s)
print('jami', tot, '(yozildi)' if W else '(quruq)')
