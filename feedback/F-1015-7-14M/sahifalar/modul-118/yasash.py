# F-1015-118: 13-Modul supurishi — oldin/keyin sahifasi
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__)); SUR = os.path.join(D, '..', '..', 'suratlar')
def img(p, k, s):
    with open(os.path.join(SUR, p, f'{k}-{s}.jpg'), 'rb') as f: return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
e = lambda x: html.escape(x, quote=False)
DARS = [
 ('m11-01', 'Bitta foydalanuvchi sizga qanchaga tushadi?', 'tuzatildi', "Reja teglari, «Ikki sonim · n/3» sanog'i va karta sarlavhasi, 8–9-ekrandagi «Ikki sonim 0/3» chizig'i."),
 ('m11-02', 'Mahsulotingiz qanday pul topadi?', 'tuzatildi', "Reja teglari, nuqtalar va «n / 5», Telegram nuqtalari, «Modelim · n/3» chizig'i, qadam qatori."),
 ('m11-03', "Webhook: to'lov Backend'ga qanday yetib keladi", 'tuzatildi', "Reja teglari, tanlash ustidagi taxmin va jadvaldagi «n / 5»."),
 ('m11-04', 'Narxni qanday belgilaysiz?', 'tuzatildi', "Reja teglari, karta sarlavhasidagi «n / 5»."),
 ('m11-05', "Loyiha kuni: to'lovni ulaymiz va buzib ko'ramiz", 'tuzatildi', "Ikki ekrandagi qadam qatorlari (har qadamni Mentor aytadi)."),
 ('m11-06', 'Pul haqida qanday gaplashasiz?', 'tuzatildi', "Reja teglari va bo'sh varaq, ikki topshiriq ustidagi taxmin, «6 gap» katakchalari, sanoqlar."),
 ('m11-07', 'Foydalanuvchiga shartlarni qanday ochiq aytasiz?', 'tuzatildi', "Reja teglari, ikki topshiriq ustidagi taxmin, karta sanoqlari va katakchalar."),
 ('m11-08', "Loyiha kuni: ketayotgan foydalanuvchini qaytarish", "o'zgarishsiz", 'Takror topilmadi.'),
 ('m11-09', "Kim haqiqatan to'lashga tayyor?", 'tuzatildi', "Reja teglari, ajratish ustidagi taxmin, «6 javob» katakchalari, uch qadam qatori va karta sanoqlari."),
 ('m11-10', 'Loyiha kuni: taklif havolasi va mukofot', 'tuzatildi', "«Hisob n / 4» → «Hisob n»."),
 ('m11-11', 'Mahsulotingiz hozir qayerda?', 'tuzatildi', "Reja teglari, holat ustidagi taxmin, «Karta · n / 5», Tesla nuqtalari, qism qatori."),
 ('m11-12', 'Loyiha kuni: barqarorlashtirish', 'tuzatildi', "Raqamli chiziq ①…⑤, ajratish ustidagi taxmin, «Taklif n / 4»; Mentor gapi moslashtirildi."),
]
JUFT = [
 ('m11-01','s7',"«Ikki sonim · n/3» va karta sarlavhasi «1 · Kanallar»"),('m11-01','s9',"«Ikki sonim 0/3» — 7-ekran sanog'i, bu yerda vazifasi yo'q"),
 ('m11-02','s4',"Nuqtalar va «1 / 5»"),('m11-02','s8',"«Modelim · 0/3» chizig'i va karta «1 / 3»"),('m11-02','s9',"«Ayting · Belgilang · Tuzating» — Mentor va tugma aytadi"),
 ('m11-03','s12',"«Kimga» tanlash ustidagi taxmin va «0 / 5»"),('m11-04','s5',"Karta sarlavhasi «1 / 5 · Xarajat»"),
 ('m11-05','s2',"Qadam qatori — har qadamni Mentor aytadi"),('m11-05','s5',"Qadam qatori «Solishtiring · Agentga bering · …»"),
 ('m11-06','s1',"Bo'sh varaq (208/0 d)"),('m11-06','s2',"Ajratish ustidagi taxmin, «6 gap» va «Gap 1 / 6»"),('m11-06','s4',"Belgi qo'yish ustidagi taxmin va «Suhbatlar · 0 / 3»"),
 ('m11-07','s2',"«Ekranda bor / yo'q» ustidagi taxmin, «Savol 1 / 6»"),('m11-07','s4',"«Bugun / Real» ustidagi taxmin, «Band 1 / 6»"),
 ('m11-09','s2',"Ajratish ustidagi taxmin va «6 javob»"),('m11-09','s6',"Qism qatori — Mentor har qismni aytadi"),
 ('m11-11','s2',"Holat ustidagi taxmin va «Karta · 1/5»"),('m11-11','s4','Tesla: nuqtalar va «Tesla · 1/3»'),
 ('m11-12','s2',"Raqamli chiziq ①…⑤"),('m11-12','s5',"Ajratish ustidagi taxmin va «Taklif 1 / 4»"),
]
YAKKA = [
 ('m11-03','s12-tayyor',"Besh qator to'ldirilgach: xulosa joyida, taxmin qatori yo'q."),
 ('m11-04','s5-bos',"Band saqlangach: qadam qatorida ✓ va ✎ (bosiladi — qoldi), karta sarlavhasiz."),
 ('m11-10','s5-bos',"«Hisob 1», «Hisob 2» ✓; hisob tugmada «(2/4)»."),
 ('m11-11','s2-bos',"Birinchi karta uchta ishni birga belgilaydi — dizayn shunday."),
]
import json
_bz = {(x['key'], x['s']): x for x in json.load(open(os.path.join(D, '..', '..', 'olchov-ekran-1553.json'), encoding='utf-8')) if x['key'].startswith('m11-')}
_ky = {}
for L in open(os.path.join(D, '..', '..', 'malumot', 'olchov-118-keyin.jsonl'), encoding='utf-8'):
    if L.strip(): x = json.loads(L); _ky[(x['key'], x['s'])] = x
_oq = [k for k, x in _bz.items() if x['type'] not in ('test', 'stats', 'flashcards', 'summary') and k in _ky]
SUM = lambda src, f: sum(src[k][f] for k in _oq)
OZG = sum(1 for k in _oq if any(_bz[k][f] != _ky[k][f] for f in ('words', 'blocks', 'small')))
fmt = lambda n: f'{n:,}'.replace(',', ' ')
OLCH = dict(n=len(_oq), ozg=OZG, w=(SUM(_bz,'words'), SUM(_ky,'words')), b=(SUM(_bz,'blocks'), SUM(_ky,'blocks')), m=(SUM(_bz,'small'), SUM(_ky,'small')))
print('OLCHOV', OLCH)
rows = ''.join(f'<tr><td class="k">{k}</td><td>{e(n)}</td><td><span class="h h-{"ok" if h=="tuzatildi" else ("p" if h=="pilot" else "n")}">{e(h)}</span></td><td>{e(t)}</td></tr>' for k,n,h,t in DARS)
cards = ''.join(f'''<section class="juft" id="{k}-{s}"><h3><span class="k">{k} · {int(s[1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img('F-1015-118-oldin',k,s)}" alt="{k} {s} oldin" loading="lazy"></figure>
<figure><figcaption>Keyin</figcaption><img src="{img('F-1015-118-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in JUFT)
yakka = ''.join(f'''<section class="juft"><h3><span class="k">{k} · {int(s.split('-')[0][1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar bitta"><figure><figcaption>Keyin</figcaption><img src="{img('F-1015-118-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in YAKKA)
H = f'''<title>13-Modul tozalash</title>
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
<header class="kirish"><span class="yorliq">F-1015-118 · 208-qonun · 13-Modul</span>
<h1>13-Modul: 12 darsdagi takrorlar olindi</h1>
<p>Har dars joyida tuzatildi. Qoida avvalgidek: bir narsani ikkinchi marta aytgan hisob, yorliq, chip yoki taxmin olinadi. <b>Matn qisqartirilmadi.</b></p>
<p>11 ta dars tuzatildi, 1 tasida takror topilmadi. Har darsdan keyin 12 ta darvoza toza, sahifada JavaScript xatosi yo'q.</p></header>
<section class="blok"><h2>Darslar</h2><div class="ur"><table><thead><tr><th>Dars</th><th>Nomi</th><th>Holat</th><th>Nima olindi</th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="blok"><h2>O'lchov: {OLCH['n']} ta o'quv ekrani</h2>
<div class="raqam"><div><b>{OLCH['ozg']}</b><span>ekran o'zgardi</span></div><div><b>{fmt(OLCH['w'][0])} → {fmt(OLCH['w'][1])}</b><span>so'z</span></div><div><b>{fmt(OLCH['b'][0])} → {fmt(OLCH['b'][1])}</b><span>matn bloki</span></div><div><b>{fmt(OLCH['m'][0])} → {fmt(OLCH['m'][1])}</b><span>mayda yozuv</span></div></div>
<p class="izoh">Testlar, podium, kartochka va yakun ekranlari sanalmagan. O'lchov ekranning boshlang'ich holatida olinadi. Olingan takrorlarning bir qismi tugma bosilgandan keyin yoki o'quvchi ma'lumoti bilan chiqadi, shuning uchun raqamda hammasi ko'rinmaydi.</p></section>
<div class="ogoh"><b>Bu modulda ko'p taxmin olindi.</b> 13-Modulda 8 ta ekranda taxmin o'quvchi o'zi qaror qiladigan, xatosi bor topshiriq ustida turgan edi. Ular olindi, asosiy fikr xulosada qoldi. Bosib kuzatiladigan ekranlarda taxmin qoldi. Bir ekranda (m11-12) Mentor «natijani taxminingiz bilan solishtiring» der edi — gap moslashtirildi.</div>
{cards}
<section class="blok"><h2>O'quvchi ma'lumoti bilan ko'rilgan ekranlar</h2><p class="izoh">Bu ekranlar o'quvchining roadmap'i yoki yozgan bo'laklari bilan to'ladi. «Oldin» surati bo'sh holatda olingan, shuning uchun bu yerda faqat «keyin» surati bor. Har birida nima olingani yozilgan.</p></section>
{yakka}
<section class="blok"><h2>Ataylab qoldirilganlar</h2><ul>
<li>Bosiladigan qatorlar va tablar qoldi: m11-01 7–8-ekran, m11-04 5-ekran (✎ bilan).</li>
<li>Boshqa narsani sanaydigan hisoblar qoldi: «O'yinchi n / 4» (m11-08), «Bu hafta … n / 2», «Yozuvlarim · real n / 3», javob hisoblagichlari.</li>
<li>«Varaqdan bosib toping» ekranidagi taxmin qoldi (m11-09 4-ekran) — m10-10 dagi kabi kuzatish deb hisoblandi.</li>
<li>m11-02 10-ekrandagi «Modelim · to'lashi mumkin: ?» qoldi — SQL natijasi shu yerga yoziladi.</li></ul></section>
<section class="blok ogoh"><h2>Sizdan qaror kerak</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">m11-06 2-ekranda (reja) bo'sh varaq olingach, chap ustunda faqat sarlavha va bitta kulrang qator qoldi — joy siyrak ko'rinadi. Yangi rasm qo'shish supurish doirasidan tashqari. Shunday qoldiraymi yoki boshqa yo'l kerakmi?</p></section>
<section class="blok"><h2>Keyingi qadam</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">14-Modulga o'taman (13 dars).</p></section>
</main>'''
open(os.path.join(D,'modul-118.html'),'w',encoding='utf-8').write(H); print('OK', round(len(H)/1024),'KB')
