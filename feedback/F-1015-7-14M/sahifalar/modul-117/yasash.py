# F-1015-117: 12-Modul supurishi — oldin/keyin sahifasi
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__)); SUR = os.path.join(D, '..', '..', 'suratlar')
def img(p, k, s):
    with open(os.path.join(SUR, p, f'{k}-{s}.jpg'), 'rb') as f: return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
e = lambda x: html.escape(x, quote=False)
DARS = [
 ('m10-01', 'Mahsulotingizni bir sahifada qanday tanishtirasiz?', 'tuzatildi', "Reja teglari, qadam-qatori, Instagram nuqtalari, «Sahifam · n / 4» sanog'i, «Ko'rish · Yozish · Solishtirish» qatori."),
 ('m10-02', "WebSocket: ekran o'zi yangilanadigan ulanish", 'tuzatildi', "Reja teglari, tanlash topshirig'i ustidagi taxmin va jadvaldagi «N / 5»."),
 ('m10-03', "Ekran o'zi yangilanishi uchun nimani yozasiz?", 'tuzatildi', "Reja teglari va bo'sh varaq, ichki tugmadagi «1/3», «Vaziyat N/3», karta yorlig'idagi sanoq."),
 ('m10-04', 'Loyiha kuni: jonli xabar va eslatma', "o'zgarishsiz", 'Takror topilmadi.'),
 ('m10-05', 'Ulanish uzilsa: buzamiz va tuzatamiz', 'tuzatildi', "Reja teglari, kutilayotgan urinishlar qatori, karta yorlig'idagi sanoq."),
 ('m10-06', 'Birinchi foydalanuvchilar sizni qayerdan topadi?', 'tuzatildi', "Reja teglari, Facebook nuqtalari, uch ekrandagi sanoqlar va ①…⑥ qatori."),
 ('m10-07', '50 foydalanuvchiga qanday yetasiz?', 'tuzatildi', "Reja teglari, jadval sanog'i, «1-bosqich · 2-bosqich · 3-bosqich» qatori."),
 ('m10-08', "Foydalanuvchilar qaysi qadamda to'xtab qolyapti?", 'tuzatildi', 'Reja teglari, Netflix nuqtalari.'),
 ('m10-09', 'Loyiha kuni: foydalanuvchini qaytaradigan eslatma', 'tuzatildi', "Bildirishnomadagi «Matn N / 4» sanog'i."),
 ('m10-10', '50 foydalanuvchiga yetdingizmi?', 'tuzatildi', "Reja teglari, Duolingo nuqtalari, uch qadam-qatori, «Hisobot · n / 4» chizig'i va karta sanoqlari."),
 ('m10-11', "Raqamlaringiz pitchni qanday o'zgartiradi?", 'tuzatildi', "Reja teglari, ikki topshiriq ustidagi taxmin, uch ekrandagi sanoqlar va karta yorliqlari."),
 ('m10-12', 'Raqamlaringiz zalni ishontiradimi?', 'tuzatildi', "Reja teglari, Uzum nuqtalari, «Pitchim · n/5» sanog'i va karta yorlig'idagi sanoq."),
]
JUFT = [
 ('m10-01','s4',"Qadam-qatori — funksiya nomi kartada, hisob tugmada"),('m10-01','s9',"«Sahifam · n / 4» — tugma «Yana N ta bo'lak» aytadi"),('m10-01','s10',"«Ko'rish · Yozish · Solishtirish» — Mentor va tugma aytadi"),
 ('m10-02','s1','Reja teglari keyingi eyebrow\'larni takrorlardi'),('m10-02','s12',"Tanlash topshirig'i ustidagi taxmin va «N / 5»"),
 ('m10-03','s1',"Bo'sh talab varag'i — u 2-ekranda chiqadi"),('m10-03','s5',"Karta yorlig'i «1 · Hodisalar · 1 / 3»"),
 ('m10-05','s9',"Kutilayotgan urinishlar «1 · 2 · 3»"),('m10-05','s12',"Karta yorlig'i «1 / 3 · Internetni uzish»"),
 ('m10-06','s6',"«n / 6» va ①…⑥ qatori"),('m10-06','s7','Facebook: nuqtalar'),('m10-06','s9',"«Kanallarim · n / 3» va karta «1 / 3»"),
 ('m10-07','s5',"«1-bosqich · 2-bosqich · 3-bosqich» va karta sanog'i"),('m10-08','s5','Netflix: nuqtalar'),
 ('m10-10','s10',"«Hisobot · n / 4» chizig'i va karta «1 / 4»"),('m10-10','s11',"Qadam-qatori va «Mentor tekshiruvi · 1 / 3»"),
 ('m10-11','s2',"Belgilash topshirig'i ustidagi taxmin"),('m10-11','s3',"Variant tanlash ustidagi taxmin"),('m10-11','s5',"«Da'volarim · n» va karta «Muammo · 1 / 3»"),
 ('m10-12','s6','Uzum: nuqtalar'),('m10-12','s10',"«Pitchim · n/5» va karta «Muammo · 1 / 5»"),
]
YAKKA = [
 ('m10-02','s12-tayyor',"Besh qator to'ldirilgach: «bitta hodisa besh sabab bilan» xulosada qoldi, taxmin qatori yo'q."),
 ('m10-07','s4-bos',"Jadval sarlavhasida sanoq yo'q — hisob tugmada «(1/3)»."),
 ('m10-09','s5-izoh',"Bildirishnomada «Matn N / 4» yo'q, matnning o'z izohi qoldi; hisob tugmada «(1/4)»."),
 ('m10-10','s2-bos',"Taxmindan keyin: qadam-qatori yo'q — qator nomlari varaqda, bosiladigan joy ham varaq."),
 ('m10-10','s10-saqla',"Qator saqlangach: u chapdagi varaqqa tushdi, karta yorlig'i yo'q, tugma «Yana 3 ta qator yozing»."),
 ('m10-11','s6-data',"O'quvchi da'volari bilan: «Dalillar» chizig'i sanoqsiz, karta «Da'vo · Muammo»."),
]
import json
_bz = {(x['key'], x['s']): x for x in json.load(open(os.path.join(D, '..', '..', 'olchov-ekran-1553.json'), encoding='utf-8')) if x['key'].startswith('m10-')}
_ky = {}
for L in open(os.path.join(D, '..', '..', 'malumot', 'olchov-117-keyin.jsonl'), encoding='utf-8'):
    if L.strip(): x = json.loads(L); _ky[(x['key'], x['s'])] = x
_oq = [k for k, x in _bz.items() if x['type'] not in ('test', 'stats', 'flashcards', 'summary') and k in _ky]
SUM = lambda src, f: sum(src[k][f] for k in _oq)
OZG = sum(1 for k in _oq if any(_bz[k][f] != _ky[k][f] for f in ('words', 'blocks', 'small')))
fmt = lambda n: f'{n:,}'.replace(',', ' ')
OLCH = dict(n=len(_oq), ozg=OZG, w=(SUM(_bz,'words'), SUM(_ky,'words')), b=(SUM(_bz,'blocks'), SUM(_ky,'blocks')), m=(SUM(_bz,'small'), SUM(_ky,'small')))
print('OLCHOV', OLCH)
rows = ''.join(f'<tr><td class="k">{k}</td><td>{e(n)}</td><td><span class="h h-{"ok" if h=="tuzatildi" else ("p" if h=="pilot" else "n")}">{e(h)}</span></td><td>{e(t)}</td></tr>' for k,n,h,t in DARS)
cards = ''.join(f'''<section class="juft" id="{k}-{s}"><h3><span class="k">{k} · {int(s[1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img('F-1015-117-oldin',k,s)}" alt="{k} {s} oldin" loading="lazy"></figure>
<figure><figcaption>Keyin</figcaption><img src="{img('F-1015-117-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in JUFT)
yakka = ''.join(f'''<section class="juft"><h3><span class="k">{k} · {int(s.split('-')[0][1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar bitta"><figure><figcaption>Keyin</figcaption><img src="{img('F-1015-117-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in YAKKA)
H = f'''<title>12-Modul tozalash</title>
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
<header class="kirish"><span class="yorliq">F-1015-117 · 208-qonun · 12-Modul</span>
<h1>12-Modul: 12 darsdagi takrorlar olindi</h1>
<p>Har dars joyida tuzatildi. Qoida avvalgidek: bir narsani ikkinchi marta aytgan hisob, yorliq, chip yoki taxmin olinadi. <b>Matn qisqartirilmadi.</b></p>
<p>11 ta dars tuzatildi, 1 tasida takror topilmadi. Har darsdan keyin 12 ta darvoza toza, sahifada JavaScript xatosi yo'q.</p></header>
<section class="blok"><h2>Darslar</h2><div class="ur"><table><thead><tr><th>Dars</th><th>Nomi</th><th>Holat</th><th>Nima olindi</th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="blok"><h2>O'lchov: {OLCH['n']} ta o'quv ekrani</h2>
<div class="raqam"><div><b>{OLCH['ozg']}</b><span>ekran o'zgardi</span></div><div><b>{fmt(OLCH['w'][0])} → {fmt(OLCH['w'][1])}</b><span>so'z</span></div><div><b>{fmt(OLCH['b'][0])} → {fmt(OLCH['b'][1])}</b><span>matn bloki</span></div><div><b>{fmt(OLCH['m'][0])} → {fmt(OLCH['m'][1])}</b><span>mayda yozuv</span></div></div>
<p class="izoh">Testlar, podium, kartochka va yakun ekranlari sanalmagan. O'lchov ekranning boshlang'ich holatida olinadi. Olingan takrorlarning bir qismi tugma bosilgandan keyin yoki o'quvchi ma'lumoti bilan chiqadi, shuning uchun raqamda hammasi ko'rinmaydi.</p></section>
<div class="ogoh"><b>Qolganini qanday ajratdim.</b> Qadam-qatori bosilib, bo'limni qayta ochsa yoki boshqa joyda aytilmagan nomlarni bersa, qoldi. Faqat sanoq bo'lsa yoki karta sarlavhasini takrorlasa, olindi. Taxmin o'quvchi o'zi qaror qiladigan topshiriq ustida tursa olindi, bosib kuzatiladigan ekranda qoldi.</div>
{cards}
<section class="blok"><h2>O'quvchi ma'lumoti bilan ko'rilgan ekranlar</h2><p class="izoh">Bu ekranlar o'quvchining roadmap'i yoki yozgan bo'laklari bilan to'ladi. «Oldin» surati bo'sh holatda olingan, shuning uchun bu yerda faqat «keyin» surati bor. Har birida nima olingani yozilgan.</p></section>
{yakka}
<section class="blok"><h2>Ataylab qoldirilganlar</h2><ul>
<li>Bosiladigan qadam-qatorlari qoldi (bajarilgan bo'lim bosilib qayta ochiladi): m10-03, m10-05, m10-11 ning 5-ekrani.</li>
<li>Boshqa joyda aytilmagan nomlarni beradigan qadam-qatorlari qoldi: m10-06 10-ekran («Ro'yxat», «Yuborish»), m10-08 6-ekran, m10-10 8-ekran.</li>
<li>Boshqa narsani sanaydigan hisoblar qoldi: «Bu hafta: N / 2» (m10-09), maydon va qator sanoqlari (m10-06, m10-08).</li>
<li>m10-10 9-ekrandagi «Hisobot» chizig'i qoldi, chunki SQL natijasi unga uchib tushadi. m10-12 11-ekrandagi «Ayting · Baholang · Tuzating» ham qoldi: ular bosqichni qayta ko'rish uchun bosiladi.</li>
<li>Bosib kuzatiladigan ekranlardagi taxminlar va nishon sharti qatori (151) qoldi.</li></ul></section>
<section class="blok"><h2>Keyingi qadam</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">13-Modulga o'taman (12 dars).</p></section>
</main>'''
open(os.path.join(D,'modul-117.html'),'w',encoding='utf-8').write(H); print('OK', round(len(H)/1024),'KB')
