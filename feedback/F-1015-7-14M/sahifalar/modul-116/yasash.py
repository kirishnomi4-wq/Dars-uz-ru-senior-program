# F-1015-116: 11-Modul supurishi — oldin/keyin sahifasi
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__)); SUR = os.path.join(D, '..', '..', 'suratlar')
def img(p, k, s):
    with open(os.path.join(SUR, p, f'{k}-{s}.jpg'), 'rb') as f: return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
e = lambda x: html.escape(x, quote=False)
DARS = [
 ('m9-01', "Oltita g'oyani qayerdan topasiz?", 'tuzatildi', "Reja teglari va bo'sh karta-skelet, Starbucks nuqtalari, «G'oyalarim · n/6» chizig'i."),
 ('m9-02', "Oltita g'oyadan qaysi uchtasi qoladi?", 'tuzatildi', 'Reja teglari, Stories nuqtalari.'),
 ('m9-03', "Ikki g'oyadan qaysi biri odamlarga kerak?", 'tuzatildi', "Reja teglari, karta «N/5», Airbnb nuqtalari, forma sarlavhasini takrorlagan qadam-qatori."),
 ('m9-04', "O'n intervyudan keyin qaysi g'oya qoladi?", 'tuzatildi', "Reja teglari, YouTube nuqtalari, forma tablari bilan bir xil «Doskam» chizig'i."),
 ('m9-05', "G'oyangiz bir sahifaga sig'adimi?", 'tuzatildi', "Reja teglari, karta «Qo'shimcha ish · N/4», Amazon nuqtalari."),
 ('m9-06', 'Bitiruvgacha nimani qachon qurasiz?', 'tuzatildi', 'Reja teglari, Uzum nuqtalari.'),
 ('m9-07', "Jonli prototip: qog'ozdan bosiladigan ekrangacha", 'tuzatildi', "Reja teglari, to'rt ekrandagi ichki hisoblagichlar va karta «N/6»."),
 ('m9-08', 'Arxitektura va platforma: web yoki mobil ilova', 'tuzatildi', "Reja teglari, saralash ustidagi taxmin, to'rt ekrandagi ichki hisoblagichlar."),
 ('m9-09', 'React Native va Expo: prototip telefonda', 'tuzatildi', "Reja teglari, to'rt ekrandagi «Almashdi / Ochildi / Shart N/k» hisoblagichlari."),
 ('m9-10', 'Loyiha kuni: poydevor', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m9-11', 'Loyiha kuni: 1-asosiy funksiya', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m9-12', 'Loyiha kuni: 2-asosiy funksiya', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m9-13', 'Uch foydalanuvchidan keyin nimani tuzatasiz?', 'tuzatildi', 'Reja teglari, Cyberpunk nuqtalari.'),
 ('m9-14', 'Loyiha kuni: 3-asosiy funksiya', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m9-15', "Roadmap bo'yicha qayerdasiz?", 'tuzatildi', "Reja teglari, saralash ustidagi taxmin, qadam-qatori, javobdan keyingi karta, uch ekrandagi hisoblagichlar."),
 ('m9-16', "G'oyangiz va ilovangiz guruhni ishontiradimi?", 'tuzatildi', "Reja teglari, iPhone nuqtalari, «Pitchim · n/4» chizig'i, juftlik-mashqidagi qadam-chiplar."),
]
JUFT = [
 ('m9-01','s1',"Reja teglari va bo'sh karta-skelet"),('m9-01','s6','Starbucks: nuqtalar'),('m9-01','s9',"«G'oyalarim · n/6» chizig'i"),
 ('m9-03','s2','Karta «N/5» — pastki tugma aytadi'),('m9-03','s9','Qadam-qatori forma sarlavhasini takrorlardi'),
 ('m9-04','s9',"«Doskam» chizig'i — forma tablari bilan bir xil"),('m9-05','s4',"Karta «Qo'shimcha ish · N/4»"),
 ('m9-07','s2','Ichki hisoblagich «Joylandi N/k»'),('m9-07','s10','Ichki hisoblagich «Farq N/k»'),
 ('m9-08','s3','Saralash ustidagi taxmin va «Joylandi N/6»'),('m9-08','s13','Karta «· N / 4»'),
 ('m9-09','s2','Hisoblagich «Almashdi N/k»'),('m9-13','s4','Cyberpunk: nuqtalar'),
 ('m9-15','s1','Reja teglari'),('m9-15','s2','Saralash ustidagi taxmin tugmalarni qulflardi'),('m9-15','s3',"Qadam-qatori «Backend · Foydalanuvchilar · Telefon» — pastki tugma «(n/3)» aytadi"),
 ('m9-16','s1','Reja teglari'),('m9-16','s6',"iPhone: nuqtalar va «iPhone · N/3» yorlig'i"),('m9-16','s10',"«Pitchim · n/4» chizig'i — forma ustidagi bo'lak chiplari aytadi"),
 ('m9-16','s11',"Qadam-chiplar «Ayting · Baholang · Tuzating» — Mentor har bosqichni aytadi"),
]
# O'quvchi ma'lumoti bilan olingan holat — «oldin» surati bo'sh holatda edi, juft emas
YAKKA = [
 ('m9-15','s4-javob',"Javobdan keyin: to'g'ri variant matnini so'zma-so'z qaytargan risk kartasi olindi — endi faqat izoh."),
 ('m9-15','s5',"Doska sarlavhasi yonidagi «n / N» olindi — hisob pastki tugmada «(1/6)»."),
 ('m9-15','s6',"«Risklarim · n / 3» va «Roadmap'im · holatlar n/N» sanoqlari olindi — chiplar va pastki tugma aytadi."),
 ('m9-15','s7',"Karta tepasidagi «Qadam n / 3» olindi — hisob pastki tugmada «(1/3)»."),
 ('m9-16','s10-saqla',"Bo'lak saqlangach: ✓ forma ustidagi chipda, hisob pastki tugmada «(1/4)»."),
]
import json
_bz = {(x['key'], x['s']): x for x in json.load(open(os.path.join(D, '..', '..', 'olchov-ekran-1553.json'), encoding='utf-8')) if x['key'].startswith('m9-')}
_ky = {}
for L in open(os.path.join(D, '..', '..', 'malumot', 'olchov-116-keyin.jsonl'), encoding='utf-8'):
    if L.strip(): x = json.loads(L); _ky[(x['key'], x['s'])] = x
_oq = [k for k, x in _bz.items() if x['type'] not in ('test', 'stats', 'flashcards', 'summary') and k in _ky]
SUM = lambda src, f: sum(src[k][f] for k in _oq)
OZG = sum(1 for k in _oq if any(_bz[k][f] != _ky[k][f] for f in ('words', 'blocks', 'small')))
fmt = lambda n: f'{n:,}'.replace(',', ' ')
OLCH = dict(n=len(_oq), ozg=OZG, w=(SUM(_bz,'words'), SUM(_ky,'words')), b=(SUM(_bz,'blocks'), SUM(_ky,'blocks')), m=(SUM(_bz,'small'), SUM(_ky,'small')))
print('OLCHOV', OLCH)
rows = ''.join(f'<tr><td class="k">{k}</td><td>{e(n)}</td><td><span class="h h-{"ok" if h=="tuzatildi" else ("p" if h=="pilot" else "n")}">{e(h)}</span></td><td>{e(t)}</td></tr>' for k,n,h,t in DARS)
cards = ''.join(f'''<section class="juft" id="{k}-{s}"><h3><span class="k">{k} · {int(s[1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img('F-1015-116-oldin',k,s)}" alt="{k} {s} oldin" loading="lazy"></figure>
<figure><figcaption>Keyin</figcaption><img src="{img('F-1015-116-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in JUFT)
yakka = ''.join(f'''<section class="juft"><h3><span class="k">{k} · {int(s.split('-')[0][1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar bitta"><figure><figcaption>Keyin</figcaption><img src="{img('F-1015-116-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in YAKKA)
H = f'''<title>11-Modul tozalash</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
/* Ish-hisobot: jadval (16 dars) → raqamlar → oldin/keyin juftlari → qolganlar */
:root {{ --bg:#F6F5FA; --qogoz:#FFFFFF; --siyoh:#1D1A2E; --siyoh2:#5E5A73; --chiziq:#E3E0EE; --urg:#5B3FD6; --urgFon:#EEEAFD; --ok:#1F8A4C; --okFon:#E5F4EB; --ogoh:#A85F00; --ogohFon:#FBF0DF;
  --sh:'Onest', system-ui, sans-serif; --mono:'JetBrains Mono', ui-monospace, monospace; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#15131F; --qogoz:#1E1B2C; --siyoh:#ECEAF5; --siyoh2:#A7A3BC; --chiziq:#33304A; --urg:#A893FF; --urgFon:#2A2445; --ok:#5FD08F; --okFon:#1B3226; --ogoh:#F0B35C; --ogohFon:#3A2C17; color-scheme: dark; }} }}
:root[data-theme="dark"] {{ --bg:#15131F; --qogoz:#1E1B2C; --siyoh:#ECEAF5; --siyoh2:#A7A3BC; --chiziq:#33304A; --urg:#A893FF; --urgFon:#2A2445; --ok:#5FD08F; --okFon:#1B3226; --ogoh:#F0B35C; --ogohFon:#3A2C17; color-scheme: dark; }}
body {{ background:var(--bg); color:var(--siyoh); font-family:var(--sh); font-size:15px; line-height:1.55; }}
.sahifa {{ max-width:1120px; margin:0 auto; padding-block:32px 64px; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); display:grid; gap:24px; }}
.yorliq {{ font-family:var(--mono); font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--siyoh2); }}
h1 {{ font-size:clamp(26px,4vw,34px); line-height:1.15; margin:6px 0 10px; text-wrap:balance; }}
h2 {{ font-size:18px; margin:0; }}
.kirish p {{ max-width:70ch; margin:0 0 8px; color:var(--siyoh2); }} .kirish b {{ color:var(--siyoh); }}
.blok {{ background:var(--qogoz); border:1px solid var(--chiziq); border-radius:12px; padding:18px 20px; display:grid; gap:12px; }}
.ur {{ overflow-x:auto; }}
table {{ border-collapse:collapse; width:100%; font-size:14px; font-variant-numeric:tabular-nums; }}
th, td {{ text-align:left; padding:8px 10px; border-bottom:1px solid var(--chiziq); vertical-align:top; }}
th {{ font-family:var(--mono); font-size:11.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--siyoh2); }}
td.k, .k {{ font-family:var(--mono); font-size:12.5px; font-weight:700; white-space:nowrap; }}
.h {{ font-family:var(--mono); font-size:11.5px; font-weight:700; padding:2px 8px; border-radius:6px; white-space:nowrap; }}
.h-ok {{ background:var(--okFon); color:var(--ok); }} .h-p {{ background:var(--urgFon); color:var(--urg); }} .h-n {{ background:var(--bg); color:var(--siyoh2); border:1px solid var(--chiziq); }}
.raqam {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(150px,1fr)); gap:10px; }}
.raqam div {{ border:1px solid var(--chiziq); border-radius:10px; padding:10px 12px; }}
.raqam b {{ display:block; font-size:22px; font-variant-numeric:tabular-nums; }} .raqam span {{ font-size:13px; color:var(--siyoh2); }}
.izoh {{ font-size:13px; color:var(--siyoh2); margin:0; }}
.juft {{ background:var(--qogoz); border:1px solid var(--chiziq); border-radius:12px; padding:16px 18px; display:grid; gap:10px; }}
.juft h3 {{ margin:0; font-size:16px; display:flex; flex-wrap:wrap; gap:4px 10px; align-items:baseline; }}
.juft h3 .k {{ color:var(--urg); }}
.rasmlar {{ display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:12px; }}
figure {{ margin:0; display:grid; gap:6px; min-width:0; }}
figcaption {{ font-family:var(--mono); font-size:12px; font-weight:700; color:var(--siyoh2); }} figure:last-child figcaption {{ color:var(--ok); }}
figure img {{ width:100%; height:auto; border:1px solid var(--chiziq); border-radius:8px; display:block; }}
ul {{ margin:0; padding-left:20px; display:grid; gap:6px; }}
.ogoh {{ background:var(--ogohFon); border:1px solid var(--chiziq); border-radius:10px; padding:12px 16px; }} .ogoh b {{ color:var(--ogoh); }}

.rasmlar.bitta {{ grid-template-columns:minmax(0,1fr); max-width:760px; }}
@media (max-width:720px) {{ .rasmlar {{ grid-template-columns:minmax(0,1fr); }} }}
</style>
<main class="sahifa">
<header class="kirish"><span class="yorliq">F-1015-116 · 208-qonun · 11-Modul</span>
<h1>11-Modul: 16 darsdagi takrorlar olindi</h1>
<p>Har dars joyida tuzatildi. Qoida pilotdagidek: bir narsani ikkinchi marta aytgan hisob, yorliq, chip yoki taxmin olinadi. <b>Matn qisqartirilmadi.</b></p>
<p>12 ta dars tuzatildi, 4 tasida takror topilmadi. Har darsdan keyin 12 ta darvoza toza, sahifada JavaScript xatosi yo'q.</p></header>
<section class="blok"><h2>Darslar</h2><div class="ur"><table><thead><tr><th>Dars</th><th>Nomi</th><th>Holat</th><th>Nima olindi</th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="blok"><h2>O'lchov: {OLCH['n']} ta o'quv ekrani</h2>
<div class="raqam"><div><b>{OLCH['ozg']}</b><span>ekran o'zgardi</span></div><div><b>{fmt(OLCH['w'][0])} → {fmt(OLCH['w'][1])}</b><span>so'z</span></div><div><b>{fmt(OLCH['b'][0])} → {fmt(OLCH['b'][1])}</b><span>matn bloki</span></div><div><b>{fmt(OLCH['m'][0])} → {fmt(OLCH['m'][1])}</b><span>mayda yozuv</span></div></div>
<p class="izoh">Testlar, podium, kartochka va yakun ekranlari sanalmagan. O'lchov ekranning boshlang'ich holatida olinadi. Olingan takrorlarning bir qismi tugma bosilgandan keyin yoki o'quvchi ma'lumoti bilan chiqadi, shuning uchun raqamda hammasi ko'rinmaydi.</p></section>
<div class="ogoh"><b>Yangi topilgan takror.</b> Testda javobdan keyin chiqadigan karta to'g'ri variant matnini so'zma-so'z qaytarardi (m9-15, 4-ekran). Javob yashil bo'lib turibdi, izoh ham bor. Karta olindi.</div>
{cards}
<section class="blok"><h2>O'quvchi ma'lumoti bilan ko'rilgan ekranlar</h2><p class="izoh">Bu ekranlar o'quvchining roadmap'i yoki yozgan bo'laklari bilan to'ladi. «Oldin» surati bo'sh holatda olingan, shuning uchun bu yerda faqat «keyin» surati bor. Har birida nima olingani yozilgan.</p></section>
{yakka}
<section class="blok"><h2>Ataylab qoldirilganlar</h2><ul>
<li>Nishon sharti qatori qoldi, buni 151-qonun talab qiladi.</li>
<li>Qadamlar ketma-ket bosilib natija kuzatiladigan ekranlardagi taxminlar qoldi (masalan, m9-16 ning 2, 4 va 8-ekranlari).</li>
<li>Test rasmlari qoldi, agar javob matnini qaytarmasa (m9-15 8-ekran, m9-16 3, 5, 7, 12-ekranlar).</li>
<li>«Risk N» karta nomi qoldi: tahrirda qaysi risk ochilganini aytadi.</li>
<li>Yakun ekranidagi «Pitchim» va «Roadmap'im» chiziqlari qoldi, Yakun 207-qonun bo'yicha.</li></ul></section>
<section class="blok"><h2>Keyingi qadam</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">12-Modulga o'taman (12 dars).</p></section>
</main>'''
open(os.path.join(D,'modul-116.html'),'w',encoding='utf-8').write(H); print('OK', round(len(H)/1024),'KB')
