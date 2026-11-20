# Natija sahifasiga dars bo'limini qo'shadi: python3 art-add.py <id> "<sarlavha>" "<izoh>" "<rasm|sarlavha|matn>" ...
import sys
p='/home/kali/Desktop/internetLesson/feedback/F-1029-02-mentor-kurs/jonli-sahna-F-1120-02/artifact/jonli-sahna.html'
s=open(p,encoding='utf-8').read()
sid, title, sub = sys.argv[1:4]
items=[a.split('|',2) for a in sys.argv[4:]]
arts=''.join(f'<article><h3>{h}</h3><p>{tx}</p><div class="pair solo"><figure><img src="img/{k}" alt="{title} — {h}" width="1600" height="900" loading="lazy"><figcaption>{title} · keyin</figcaption></figure></div></article>' for k,h,tx in items)
sec=f'\n  <section id="{sid}">\n    <div class="done-h"><span class="pill">Bajarildi · 20.11</span><h2>{title}</h2></div>\n    <p class="sub">{sub}</p>\n    <div class="res">{arts}</div>\n  </section>\n'
if f'<section id="{sid}">' in s:
    a=s.index(f'\n  <section id="{sid}">'); b=s.index('  </section>\n', a)+len('  </section>\n'); s=s[:a]+s[b:]
anchor='  <section>\n    <h2>Hozirgi holat</h2>'
assert anchor in s
s=s.replace(anchor, sec.lstrip('\n')+anchor,1)
open(p,'w',encoding='utf-8').write(s); print('ok', sid)
