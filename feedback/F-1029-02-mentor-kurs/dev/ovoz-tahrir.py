#!/usr/bin/env python3
# MD ovoz matnini aniq tahrirlash (F-1102-13/14 · M32, M33). Kirish: JSON fayl
#   {"md": "<MD yo'li>", "R": [[eski, yangi], ...], "P": {"<ekran raqami>": "Demak, ..."}}
# R — har juft MD'da AYNAN bir marta uchrashi shart (aks holda hech narsa yozilmaydi).
# P — amaliyot ekranlari: oxirgi «Boshqacha» segmenti (3- yoki 4-raqam) kalit iborasi M34 ko'rinishiga keltiriladi va ovoz oxiriga «Demak, …» qo'shiladi.
# Oxirida 60 so'zdan uzun segment ovozlari ro'yxati chiqadi (M21).
import json, re, sys

cfg = json.load(open(sys.argv[1]))
s = open(cfg['md']).read()
for a, b in cfg.get('R', []):
    c = s.count(a)
    if c != 1:
        sys.exit(f'MOS EMAS ({c}): {a[:90]}')
    s = s.replace(a, b)
OLDK = "**Boshqacha chiqsa — pastdagi «Boshqacha chiqdimi?» tugmasi; katakcha va isbotsiz Davom ochilmaydi**"
NEWK = "**Boshqacha chiqsa, «Boshqacha chiqdimi?» tugmasini bosing — yechimlar oynasi ochiladi**"
for n, dm in cfg.get('P', {}).items():
    a = s.index(f'\n## {n} · '); b = s.find('\n## ', a + 5); b = len(s) if b < 0 else b
    sec = s[a:b]
    if sec.count(OLDK) != 1: sys.exit(f'{n}: amaliyot kalit iborasi topilmadi')
    sec = sec.replace(OLDK, NEWK)
    m = re.search(r"(\n\d\. \*\*Boshqacha.*\*\*\n\s+Ovoz: «Boshqacha chiqsa, pastdagi «Boshqacha chiqdimi» tugmasini bosing)(.*?)(»\s*\n)", sec, re.S)
    if not m: sys.exit(f'{n}: amaliyot ovozi topilmadi')
    body = m.group(2)
    body = re.sub(r'^:\s*(\w)', lambda x: '. ' + x.group(1).upper(), body, count=1)
    body = ', yechimlar oynasi ochiladi' + (body if body.startswith('.') else '.' + body)
    sec = sec[:m.start()] + m.group(1) + body.rstrip() + ' ' + dm + m.group(3) + sec[m.end():]
    s = s[:a] + sec + s[b:]
open(cfg['md'], 'w').write(s)
long = []
for i, l in enumerate(s.split('\n'), 1):
    mm = re.match(r'^\s+Ovoz: «(.+)»(?: · .*)?$', l)
    if mm and len(mm.group(1).split()) > 60: long.append((i, len(mm.group(1).split())))
print('ok', len(cfg.get('R', [])), 'juft,', len(cfg.get('P', {})), 'amaliyot · 60 so\'zdan uzun:', long or 'yo\'q')
