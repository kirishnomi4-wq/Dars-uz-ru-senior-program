# F-1015-121: dars faylidagi emoji bor qatorlarni chiqaradi (o'yin qatlami / Yakun / mentor-podium bloklari belgilanadi).
# python3 emoqator.py <fayl.jsx>   — faqat ko'rish, o'zgartirmaydi
import re, sys
EMO = re.compile(r'[\U0001F300-\U0001FAFF☀-➿⭐⏳✅❌❓]')
OYIN = re.compile(r'ACHIEVEMENTS|ach-|pod-|podium|qz-|Podium|Nishon|nishon|emoji:|icon:|pcb|pcn|fc-done|hero-|mstats|Badges|🥇|🥈|🥉|🏆|🎉|🔥x')
p = sys.argv[1]
for i, l in enumerate(open(p, encoding='utf-8'), 1):
    if not EMO.search(l): continue
    s = l.strip()
    if s.startswith(('//', '/*', '.', '@')) or '/*' in s[:3]: continue
    t = 'OYIN ' if OYIN.search(l) else '     '
    em = ''.join(sorted(set(EMO.findall(l))))
    print(f'{i:5} {t}{em:6} {s[:150]}')
