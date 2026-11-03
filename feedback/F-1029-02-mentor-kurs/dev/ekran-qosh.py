#!/usr/bin/env python3
# Mentor darsiga yangi ekran qo'shishdan OLDIN raqamlarni suradi (F-1102-21, M39). Yangi ekran raqami K:
# K va undan katta hamma ekran +1. Yangi «## K · …» bo'limini va komponentni keyin qo'lda qo'shasiz.
# ISHLATISH (repo ildizidan):
#   python3 feedback/F-1029-02-mentor-kurs/dev/ekran-qosh.py <MD> <generator.py> <parts-papka> <K>
# Nima suriladi: MD sarlavhalari · «Ekranlar:» jadvali · o'z-sinov jadvalidagi «s» ustuni · «N-ekran», «N–M-ekran», «N- va M-ekran»
# havolalari (Nest-1/Nest-2 ekranlari bundan mustasno) · «**N ekran**» hajmi · generator EMPH kalitlari · kodda mkS(n, MDT[n], «N-ekran», «//  N · ».
# So'z bilan aytilgan raqamlar («uchinchi ekranda») avtomatik surilmaydi — skript ularni ro'yxat qilib chiqaradi, qo'lda tuzatiladi.
import re, sys, pathlib

md_p, gen_p, parts_p, K = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
inc = lambda n: n + 1 if n >= K else n

def refs(s):
    s = re.sub(r'(?<![\w-])(\d+)–(\d+)(-ekran)', lambda m: f'{inc(int(m.group(1)))}–{inc(int(m.group(2)))}{m.group(3)}', s)
    s = re.sub(r'(?<![\w-])(\d+)(- va )(\d+)(-ekran)', lambda m: f'{inc(int(m.group(1)))}{m.group(2)}{inc(int(m.group(3)))}{m.group(4)}', s)
    s = re.sub(r'(Nest-\d )?(?<![\w–-])(\d+)(-ekran)', lambda m: m.group(0) if m.group(1) else f'{inc(int(m.group(2)))}{m.group(3)}', s)
    return s

# --- MD
s = open(md_p).read()
s = re.sub(r'^## (\d+) · ', lambda m: f'## {inc(int(m.group(1)))} · ', s, flags=re.M)
a = s.index('**Ekranlar:**'); b = s.index('\n\n', s.index('|---', a))
s = s[:a] + re.sub(r'^\| (\d+) \|', lambda m: f'| {inc(int(m.group(1)))} |', s[a:b], flags=re.M) + s[b:]
m = re.search(r'^## \d+ · .*← `Screen27`', s, re.M)
if m:
    a = m.start(); b = s.index('\n## ', a + 3)
    s = s[:a] + re.sub(r'^(  \| \d \| .+? \| .+? \| \d \| .+? \| )(\d+) \|$', lambda x: x.group(1) + str(inc(int(x.group(2)))) + ' |', s[a:b], flags=re.M) + s[b:]
s = refs(s)
s = re.sub(r'\*\*(\d+) ekran\*\*', lambda m: f'**{int(m.group(1)) + 1} ekran**', s)
open(md_p, 'w').write(s)
spoken = sorted(set(re.findall(r"[A-Za-z'‘’]+(?:inchi|nchi) ekran\w*", s)))
print('MD ✓  · so\'z bilan aytilgan ekran havolalari (qo\'lda tekshiring):', spoken or 'yo\'q')

# --- generator EMPH
g = open(gen_p).read()
a = g.index('EMPH = {'); b = g.index('\n}\n', a) + 3
g = g[:a] + re.sub(r"'(\d+)([a-e])':", lambda m: f"'{inc(int(m.group(1)))}{m.group(2)}':", g[a:b]) + g[b:]
open(gen_p, 'w').write(g); print('generator ✓')

# --- kod
for f in sorted(pathlib.Path(parts_p).glob('*.jsx')):
    if f.name.startswith('03-matn') or f.name.endswith('-ru.jsx'): continue
    c = open(f).read(); o = c
    c = re.sub(r'\bmkS\((\d+),', lambda m: f'mkS({inc(int(m.group(1)))},', c)
    c = re.sub(r'\bMDT\[(\d+)\]', lambda m: f'MDT[{inc(int(m.group(1)))}]', c)
    c = re.sub(r'^//  (\d+) · ', lambda m: f'//  {inc(int(m.group(1)))} · ', c, flags=re.M)
    c = refs(c)
    if c != o: open(f, 'w').write(c); print('kod ✓', f.name)
print('Qo\'lda: yangi «## K» bo\'lim, EMPH K-kalitlari, komponent + SCREENS, dev/e2e·surat·olchov sozlamalari.')
