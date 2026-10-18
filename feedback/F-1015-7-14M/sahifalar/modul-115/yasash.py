# F-1015-115: 10-Modul supurishi — oldin/keyin sahifasi
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__)); SUR = os.path.join(D, '..', '..', 'suratlar')
def img(p, k, s):
    with open(os.path.join(SUR, p, f'{k}-{s}.jpg'), 'rb') as f: return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
e = lambda x: html.escape(x, quote=False)
DARS = [
 ('m8-01', 'Bir oyda qaysi raqamni o\\', 'tuzatildi', "Reja teglari, saralash ustidagi taxmin va karta hisobi, «OKR'im 1–5» qatori."),
 ('m8-02', 'Hodisalar tizimi: har harakat jadvalga yoziladi', 'tuzatildi', 'Reja teglari, ekran ichidagi tugmalardagi «1/3», «1/5» va telefon ekranidagi «1 / 5».'),
 ('m8-03', 'Loyiha kuni: jonli dashboard', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m8-04', 'Ikki variantdan qaysi biri yaxshiroq ishlaydi?', 'tuzatildi', 'Reja teglari, Booking nuqtalari, taxmin bosqichida Mentor yorliq gapini takrorlardi.'),
 ('m8-05', 'Kiberxavfsizlik: zaiflikni topib yopamiz', 'tuzatildi', 'Reja teglari (chapdagi karta nomlari bilan bir xil), ekran ichidagi tugmadagi «n/3».'),
 ('m8-06', 'Foydalanuvchi sizga ma\\', 'tuzatildi', 'Reja teglari, raqamli chiziq 1–6 va karta «N/6» (jadval ustuni aytadi).'),
 ('m8-07', 'Production deploy: domen, SSL, monitoring', 'tuzatildi', "To'rt ekranda ekran ichidagi tugmalardagi hisob."),
 ('m8-08', 'Loyiha kuni: prodga ko\\', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m8-09', 'Loyiha kuni: prodga ko\\', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m8-10', 'Bir yilda nimalarni qurdingiz?', 'tuzatildi', 'Reja teglari, Uzum nuqtalari, «1 / 2».'),
 ('m8-11', 'Besh daqiqada nimani ko\\', 'tuzatildi', 'Reja teglari, Airbnb nuqtalari, saralash ustidagi taxmin va karta hisobi, «1 / 2».'),
]
JUFT = [
 ('m8-01','s1','Reja teglari'),('m8-01','s4','Saralash ustidagi taxmin'),('m8-01','s9',"«OKR'im 1–5 N/5» qatori"),
 ('m8-02','s4','Telefon ekranidagi «1 / 5»'),('m8-04','s1','Reja teglari (atama misoldan oldin)'),('m8-04','s4','Booking: nuqtalar'),
 ('m8-05','s1','Reja teglari kartalar nomini takrorlardi'),('m8-06','s5','Raqamli chiziq va «N/6» — jadval aytadi'),
 ('m8-07','s2','Ekran ichidagi tugmadagi «1/3»'),('m8-10','s6','Uzum: nuqtalar'),('m8-10','s10','«1 / 2» — raqamli belgi aytadi'),
 ('m8-11','s4','Airbnb: nuqtalar'),('m8-11','s8','Saralash ustidagi taxmin'),('m8-11','s12','«1 / 2» olindi'),
]
rows = ''.join(f'<tr><td class="k">{k}</td><td>{e(n)}</td><td><span class="h h-{"ok" if h=="tuzatildi" else ("p" if h=="pilot" else "n")}">{e(h)}</span></td><td>{e(t)}</td></tr>' for k,n,h,t in DARS)
cards = ''.join(f'''<section class="juft" id="{k}-{s}"><h3><span class="k">{k} · {int(s[1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img('F-1015-115-oldin',k,s)}" alt="{k} {s} oldin" loading="lazy"></figure>
<figure><figcaption>Keyin</figcaption><img src="{img('F-1015-115-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in JUFT)
H = f'''<title>10-Modul tozalash</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
/* Ish-hisobot: jadval (12 dars) → raqamlar → oldin/keyin juftlari → qolganlar */
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
figure img {{ width:100%; border:1px solid var(--chiziq); border-radius:8px; display:block; }}
ul {{ margin:0; padding-left:20px; display:grid; gap:6px; }}
.ogoh {{ background:var(--ogohFon); border:1px solid var(--chiziq); border-radius:10px; padding:12px 16px; }} .ogoh b {{ color:var(--ogoh); }}
@media (max-width:720px) {{ .rasmlar {{ grid-template-columns:minmax(0,1fr); }} }}
</style>
<main class="sahifa">
<header class="kirish"><span class="yorliq">F-1015-115 · 208-qonun · 10-Modul</span>
<h1>10-Modul: 11 darsdagi takrorlar olindi</h1>
<p>Har dars joyida tuzatildi. Pilotdagi qoida ishlatildi: bir narsani ikkinchi marta aytgan hisob, yorliq, chip va taxmin olinadi. <b>Matn qisqartirilmadi.</b></p>
<p>8 ta dars tuzatildi, 3 tasida takror topilmadi. Har darsdan keyin 12 ta darvoza toza, sahifada JavaScript xatosi yo'q.</p></header>
<section class="blok"><h2>Darslar</h2><div class="ur"><table><thead><tr><th>Dars</th><th>Nomi</th><th>Holat</th><th>Nima olindi</th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="blok"><h2>O'lchov: 92 ta o'quv ekrani</h2>
<div class="raqam"><div><b>17</b><span>ekran o'zgardi</span></div><div><b>8 808 → 8 747</b><span>so'z</span></div><div><b>1 060 → 1 056</b><span>matn bloki</span></div><div><b>1 708 → 1 661</b><span>mayda yozuv</span></div></div>
<p class="izoh">Testlar va yakun ekranlari sanalmagan. Boshlang'ich holatda o'zgarish kam ko'rinadi: olingan takrorlarning ko'pi tugma bosilgandan keyin chiqadi (ekran ichidagi hisob, saralash ustidagi taxmin).</p></section>
<div class="ogoh"><b>Yangi topilgan takror.</b> Ekran ichidagi tugmada «Yuborish 1/5» yozilgan, pastdagi tugmada esa «So'rovlarni yuboring (0/5)». Bitta hisob ikki joyda edi. Endi hisob faqat pastki tugmada.</div>
{cards}
<section class="blok"><h2>Ataylab qoldirilganlar</h2><ul>
<li>Nishon sharti qatori qoldi, buni 151-qonun talab qiladi.</li>
<li>Bosib ko'riladigan va tajriba ekranlaridagi taxminlar qoldi.</li>
<li>Texnik darslardagi reja teglari («GET · POST», «transform») qoldi. Ular matnni takrorlamaydi, texnik nomni beradi.</li>
<li>Bosish yo'riqnomasi bo'lgan qadam ro'yxatlari qoldi, ular o'quvchiga nimani bosishni aytadi.</li>
<li>m8-01 dagi «O'tgan hafta» voronkasi beshta ekranda turadi. U darsning yagona misoli va «hozir 6» raqamining manbai, shuning uchun qoldi.</li><li>Yangi texnik nom beradigan reja teglari qoldi (m8-07: «SSL», «/health»).</li></ul></section>
<section class="blok"><h2>Keyingi qadam</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">11-Modulga o'taman (16 dars).</p></section>
</main>'''
open(os.path.join(D,'modul-115.html'),'w',encoding='utf-8').write(H); print('OK', round(len(H)/1024),'KB')
