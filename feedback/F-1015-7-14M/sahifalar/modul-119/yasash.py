# F-1015-119: 14-Modul supurishi — oldin/keyin sahifasi
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__)); SUR = os.path.join(D, '..', '..', 'suratlar')
def img(p, k, s):
    with open(os.path.join(SUR, p, f'{k}-{s}.jpg'), 'rb') as f: return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
e = lambda x: html.escape(x, quote=False)
DARS = [
 ('m12-01', 'Investorga pitchni qanday tuzasiz?', 'tuzatildi', "Reja teglari va nomlar ustidagi kulrang qator, Airbnb nuqtalari va «n/3», kartadagi «n / 6», «Pitchim · n/6», karta raqami."),
 ('m12-02', 'Mahsulotingiz hikoyasini qanday aytasiz?', 'tuzatildi', "Reja teglari va uchta bo'sh uya, iPhone nuqtalari, «Hikoyam · n/3», karta raqami, ikki marta yozilgan «Mentor misoli»."),
 ('m12-03', "Mahsulot tezligi: o'lchaymiz va tezlashtiramiz", 'tuzatildi', "Reja teglari, beshta ekrandagi qadam belgilari, topilma kartasidagi «n / 3»."),
 ('m12-04', 'Loyiha kuni: demo uchun sayqal', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m12-05', 'Guruh pitchingizda nimani tuzatishni aytadi?', 'tuzatildi', "Reja teglari va bo'sh qatorlar, kartalardagi sanoq, bosilmaydigan qism chiplari, «Varaqim» va «Tuzatishlarim» sanog'i."),
 ('m12-06', 'Demoga tayyorgarlik: risklar va B reja', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m12-07', "Investor ko'zi bilan: demo buzilmaydimi?", 'tuzatildi', "Reja teglari, karta raqami, Mentor yozuvlari ustidagi «n / 3»."),
 ('m12-08', 'Final pitchingiz 5 daqiqaga tayyormi?', 'tuzatildi', "Reja teglari, «Tuzatishlar» va «Savol-javob» sanoqlari, kartalardagi sanoq, «Final pitch · qo'llandi N»."),
 ('m12-09', "Video-portfolio: 3 daqiqada o'zingiz va mahsulot", 'tuzatildi', "Saralash ustidagi taxmin, «Karta n / 6», «Yopiladigan joy» va «Kadr» sanoqlari."),
 ('m12-10', 'Birinchi buyurtmani qayerdan topasiz?', 'tuzatildi', "Reja teglari, «Buyurtma va xatlarim · n/5», buyurtma kartasidagi «n / 3»."),
 ('m12-11', 'Qaysi xalqaro dasturga ariza berasiz?', 'tuzatildi', "Reja teglari, solishtirish ustidagi taxmin, «Eshitilgan gap · n / 6», «Arizam · n/6», karta raqami."),
 ('m12-12', 'Keyingi olti oyda nima qilasiz?', 'tuzatildi', "Reja teglari, joylash ustidagi taxmin va «n / 3», «Rejam» sanog'i (ikki ekranda), karta raqami."),
 ('m12-13', "Demo Day'ga tayyormisiz?", 'tuzatildi', "Reja teglari, «Vaziyat n / 3», karta raqami, «Hakam varag'i · n / N»."),
]
JUFT = [
 ('m12-01','s1',"Reja: teglar va nomlar ustidagi kulrang qator"),('m12-01','s3',"Airbnb: nuqtalar va «Airbnb · 1/3»"),('m12-01','s10',"Kartadagi «1 / 6» — tugma sanaydi"),('m12-01','s11',"«Pitchim · 0/6» va «1 · Muammo»"),
 ('m12-02','s1',"Reja: teglar va uchta raqamli bo'sh uya"),('m12-02','s4',"iPhone: nuqtalar va «iPhone · 1/3»"),('m12-02','s8',"«Hikoyam · 0/3» va «1 · Kim»"),('m12-02','s9',"«Mentor misoli» ikki marta"),
 ('m12-03','s4',"Qadam belgilari — har qadamni Mentor aytadi"),('m12-03','s11',"Topilma kartasidagi «1 / 3»"),
 ('m12-05','s1',"Reja: teglar va uchta bo'sh qator"),('m12-05','s4',"Karta «1 / 3» va «Tuzatishlar ro'yxati · 0 / 3»"),('m12-05','s6',"Qism chiplari va «Varaqim · 0/6»"),
 ('m12-07','s5',"Karta sarlavhasi «1 · Tarmoq uzilishi»"),('m12-07','s6',"Mentor yozuvi ustidagi «1 / 3»"),
 ('m12-08','s7',"«Savol-javob · 0/3», «Savol 1 / 3», «Final pitch · qo'llandi»"),
 ('m12-09','s2',"Saralash ustidagi taxmin va «Karta 1 / 6»"),('m12-09','s5',"«Yopiladigan joy: 0/4» va «Kadr 1/4»"),
 ('m12-10','s7',"«Buyurtma va xatlarim · 0/5» va «Buyurtma · 1 / 3»"),
 ('m12-11','s2',"Solishtirish ustidagi taxmin va «Eshitilgan gap · 1 / 6»"),('m12-11','s7',"«Arizam · 0/6» va «1 · Dastur»"),
 ('m12-12','s2',"Joylash ustidagi taxmin va «1 / 3»"),('m12-12','s6',"«Rejam · 0/3» va «1 · Mahsulot»"),('m12-12','s7',"«Rejam · 0/3» — jadval o'zi ko'rsatadi"),
 ('m12-13','s3',"«Vaziyat 1 / 3» — «mashq vaziyati» yorlig'i bilan bir ma'no"),('m12-13','s5',"Karta sarlavhasi «1 · Backend»"),
]
YAKKA = [
 ('m12-01','s10-bos',"Birinchi gap joyiga tushgach: kartada sanoq yo'q, tugmada «(1/6)»."),
 ('m12-02','s4-bos',"Bashoratdan keyin: yorliqda faqat «iPhone»."),
 ('m12-03','s7-bos',"Tugmalarning o'zi nomlarni ko'rsatadi, ostidagi qadam qatori yo'q."),
 ('m12-05','s7-bir',"O'quvchi varag'i bilan (namuna ma'lumot): «Tuzatishlarim · n/3» va karta sanog'i yo'q."),
 ('m12-08','s5-bos',"Bo'lak tanlangach: «Tuzatishlar» chizig'i va «Tuzatish» kartasi sanoqsiz."),
 ('m12-09','s2-xato',"Taxminsiz: xato javobda darhol maslahat chiqadi."),
 ('m12-13','s3-bos',"Belgi qo'yilgach: karta ustida faqat «mashq vaziyati»."),
]
import json
_bz = {(x['key'], x['s']): x for x in json.load(open(os.path.join(D, '..', '..', 'olchov-ekran-1553.json'), encoding='utf-8')) if x['key'].startswith('m12-')}
_ky = {}
for L in open(os.path.join(D, '..', '..', 'malumot', 'olchov-119-keyin.jsonl'), encoding='utf-8'):
    if L.strip(): x = json.loads(L); _ky[(x['key'], x['s'])] = x
_oq = [k for k, x in _bz.items() if x['type'] not in ('test', 'stats', 'flashcards', 'summary') and k in _ky]
SUM = lambda src, f: sum(src[k][f] for k in _oq)
OZG = sum(1 for k in _oq if any(_bz[k][f] != _ky[k][f] for f in ('words', 'blocks', 'small')))
fmt = lambda n: f'{n:,}'.replace(',', ' ')
OLCH = dict(n=len(_oq), ozg=OZG, w=(SUM(_bz,'words'), SUM(_ky,'words')), b=(SUM(_bz,'blocks'), SUM(_ky,'blocks')), m=(SUM(_bz,'small'), SUM(_ky,'small')))
print('OLCHOV', OLCH)
rows = ''.join(f'<tr><td class="k">{k}</td><td>{e(n)}</td><td><span class="h h-{"ok" if h=="tuzatildi" else ("p" if h=="pilot" else "n")}">{e(h)}</span></td><td>{e(t)}</td></tr>' for k,n,h,t in DARS)
cards = ''.join(f'''<section class="juft" id="{k}-{s}"><h3><span class="k">{k} · {int(s[1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img('F-1015-119-oldin',k,s)}" alt="{k} {s} oldin" loading="lazy"></figure>
<figure><figcaption>Keyin</figcaption><img src="{img('F-1015-119-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in JUFT)
yakka = ''.join(f'''<section class="juft"><h3><span class="k">{k} · {int(s.split('-')[0][1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar bitta"><figure><figcaption>Keyin</figcaption><img src="{img('F-1015-119-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in YAKKA)
H = f'''<title>14-Modul tozalash</title>
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
figure img {{ width:100%; height:auto; border:1px solid var(--chiziq); border-radius:8px; display:block; }}
ul {{ margin:0; padding-left:20px; display:grid; gap:6px; }}
.ogoh {{ background:var(--ogohFon); border:1px solid var(--chiziq); border-radius:10px; padding:12px 16px; }} .ogoh b {{ color:var(--ogoh); }}

.rasmlar.bitta {{ grid-template-columns:minmax(0,1fr); max-width:760px; }}
@media (max-width:720px) {{ .rasmlar {{ grid-template-columns:minmax(0,1fr); }} }}
</style>
<main class="sahifa">
<header class="kirish"><span class="yorliq">F-1015-119 · 208-qonun · 14-Modul</span>
<h1>14-Modul: 13 darsdagi takrorlar olindi</h1>
<p>Har dars joyida tuzatildi. Qoida avvalgidek: bir narsani ikkinchi marta aytgan hisob, yorliq, chip yoki taxmin olinadi. <b>Matn qisqartirilmadi.</b></p>
<p>11 ta dars tuzatildi, 2 tasida takror topilmadi. Har darsdan keyin 12 ta darvoza toza, sahifada JavaScript xatosi yo'q.</p></header>
<section class="blok"><h2>Darslar</h2><div class="ur"><table><thead><tr><th>Dars</th><th>Nomi</th><th>Holat</th><th>Nima olindi</th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="blok"><h2>O'lchov: {OLCH['n']} ta o'quv ekrani</h2>
<div class="raqam"><div><b>{OLCH['ozg']}</b><span>ekran o'zgardi</span></div><div><b>{fmt(OLCH['w'][0])} → {fmt(OLCH['w'][1])}</b><span>so'z</span></div><div><b>{fmt(OLCH['b'][0])} → {fmt(OLCH['b'][1])}</b><span>matn bloki</span></div><div><b>{fmt(OLCH['m'][0])} → {fmt(OLCH['m'][1])}</b><span>mayda yozuv</span></div></div>
<p class="izoh">Testlar, podium, kartochka va yakun ekranlari sanalmagan. O'lchov ekranning boshlang'ich holatida olinadi. Olingan takrorlarning bir qismi tugma bosilgandan keyin yoki o'quvchi ma'lumoti bilan chiqadi, shuning uchun raqamda hammasi ko'rinmaydi.</p></section>
<div class="ogoh"><b>Bu modulda eng ko'p uchragani — ikki joyda turgan sanoq.</b> Pastki tugma «(n/N)» deb sanab turgan joyda kartada, chiziqda yoki sarlavhada ham «n / N» bor edi. Ular olindi, tugmadagisi qoldi. Bundan tashqari 3 ta ekranda xatoli topshiriq ustidagi taxmin olindi (13-Moduldagi kabi), 6 ta ekranda bosilmaydigan qadam qatori yoki qism chiplari olindi.</div>
{cards}
<section class="blok"><h2>O'quvchi ma'lumoti bilan ko'rilgan ekranlar</h2><p class="izoh">Bu ekranlar o'quvchining roadmap'i yoki yozgan bo'laklari bilan to'ladi. «Oldin» surati bo'sh holatda olingan, shuning uchun bu yerda faqat «keyin» surati bor. Har birida nima olingani yozilgan.</p></section>
{yakka}
<section class="blok"><h2>Ataylab qoldirilganlar</h2><ul>
<li>Tugmada sanoq bo'lmagan joyda kartadagi hisob qoldi — u yagona: m12-03 tartib kartasi «n / 6», m12-07 «Savol n / 3» va «Risk n / 3», m12-06 «Risk n / 5».</li>
<li>Bosiladigan tugmalar qatori va ular ustidagi taxmin qoldi (bosib kuzatish): «1 Pitch · 2 Varaq · 3 Hakam savoli» va shu kabilar.</li>
<li>Reja ekranidagi «Dars oxirida» chizmasi nomlari bo'lsa yoki animatsiya bo'lsa qoldi (m12-01, m12-03, m12-11); faqat raqamli bo'sh qutilar olindi (m12-02, m12-05).</li>
<li>Bitta joyda yorliqni butunlay olgandim, keyin qaytardim: m12-12 7-ekranda «Rejam» jadval nomi sifatida kerak ekan (sanog'i olindi).</li></ul></section>
<section class="blok ogoh"><h2>Sizdan qaror kerak</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">m12-02 2-ekranda raqamli bo'sh qutilar olingach, «Dars oxirida» ustunida telefon chizig'i va 1 daqiqalik chiziq qoldi — m11-06 dagidek siyrak. Shunday qoldiraymi?</p></section>
<section class="blok"><h2>Keyingi qadam</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">7-Modulga o'taman (src/5-Modull).</p></section>
</main>'''
open(os.path.join(D,'modul-119.html'),'w',encoding='utf-8').write(H); print('OK', round(len(H)/1024),'KB')
