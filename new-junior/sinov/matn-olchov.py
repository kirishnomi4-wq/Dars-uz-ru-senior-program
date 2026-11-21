"""Dars manbasini o'lchaydi (2-versiya tuzilmasi): tayanch gaplar soni, bola qachon birinchi marta o'zi dastur ishlatadi, qarash va ishlash daqiqalari, proyektorda ism bor-yo'qligi."""
import sys, re
src = open(sys.argv[1], encoding='utf-8').read()
parts = re.split(r'^## ', src, flags=re.M)[1:]
t = 0
rows = []
for p in parts:
    name, _, body = p.partition('\n')
    m = re.match(r'^(\d+) · (.+)$', name.strip())
    if not m:
        continue
    mins = int(re.search(r'\((\d+) daqiqa', body).group(1))
    blk = re.search(r'- \*\*Tayanch gaplar:\*\*\n((?:  .*\n)+)', body)
    gap = len(re.findall(r'^  \d+\. ', blk.group(1), flags=re.M)) if blk else 0
    parta = re.search(r'parta=([a-z]+)', body).group(1)
    us = re.search(r'\*\*Ustoz satri:\*\* (.*)', body).group(1)
    sahna = re.search(r'\*\*Sahna:\*\* (.*)', body).group(1)
    ism = bool(re.search(r'\b(Aziz|Madina|Jasur|Sevara|Bekzod|Laylo|Sardor|Nilufar|Otabek|Zarina|Temur|Kamola|Diyor|Malika)\b', us + ' ' + sahna))
    rows.append((m.group(1), m.group(2), t, mins, gap, parta, ism))
    t += mins
print('%-3s %-40s %5s %4s %4s %-8s' % ('№', 'nom', 'bosh', 'daq', 'gap', 'parta'))
for r in rows:
    print('%-3s %-40s %5d %4d %4d %-8s %s' % (r[0], r[1][:40], r[2], r[3], r[4], r[5], 'ISM PROYEKTORDA!' if r[6] else ''))
print('jami daqiqa', t, '| tayanch gaplar', sum(r[4] for r in rows), '| bir sahnada eng ko\'pi', max(r[4] for r in rows))
own = [r for r in rows if r[5] == 'studiya']
print("bola o'zi dastur ishlatadigan birinchi sahna:", own[0][0], '— boshlanishi', own[0][2], '-daqiqa')
ish = sum(r[3] for r in rows if r[5] in ('studiya', 'joy'))
print("o'z dasturi bilan ishlash:", ish, 'daqiqa (%d%%)' % round(ish * 100 / t))
print('faqat qarash:', sum(r[3] for r in rows if r[5] == 'kut'), 'daqiqa')
print('tanlash/ovoz/tugma/ism:', sum(r[3] for r in rows if r[5] in ('variant', 'tugma', 'tanlov', 'ism')), "daqiqa; noutbuksiz yoki ko'rsatish:", sum(r[3] for r in rows if r[5] in ('yopiq', 'yakun', 'toliq')))
print('proyektorda ism chiqadigan sahnalar:', sum(1 for r in rows if r[6]))
