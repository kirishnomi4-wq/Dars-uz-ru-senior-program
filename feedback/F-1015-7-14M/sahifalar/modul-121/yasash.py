# F-1015-121: 8-Modul supurishi — oldin/keyin sahifasi
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__)); SUR = os.path.join(D, '..', '..', 'suratlar')
def img(p, k, s):
    with open(os.path.join(SUR, p, f'{k}-{s}.jpg'), 'rb') as f: return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
e = lambda x: html.escape(x, quote=False)
DARS = [
 ('m6-01', "Komponentlardan tizim", 'tuzatildi', "Reja teglari, so'rov yo'li ustidagi taxmin (yo'naltirish xatoli topshiriq)."),
 ('m6-02', "Bitta gapni uch kishi bir xil tushunadimi?", 'tuzatildi', "Keys yorlig'i «Haqiqiy voqea · n / 7» (eyebrow va tugma takrorlardi)."),
 ('m6-03', "Arxitektura patternlari", 'tuzatildi', "Reja teglari, «Kod bo'lagi n/3», «Tizim n/3»."),
 ('m6-04', "AI-agent nima", 'tuzatildi', "Reja teglari, «Vazifa n/4»."),
 ('m6-05', "Claude Skills — nima", 'tuzatildi', "Reja teglari."),
 ('m6-06', "Ilova o'zi qaror qilsa, kimga tegadi?", 'tuzatildi', "Keys yorlig'i «Haqiqiy holat · n / 5»."),
 ('m6-07', "O'z Skill'ingizni yozing", 'tuzatildi', "Reja teglari."),
 ('m6-08', "Loyiha kuni: to'liq pipeline", 'tuzatildi', "Reja teglari."),
 ('m6-09', "React Native — asoslari", 'tuzatildi', "Reja teglari."),
 ('m6-10', "RN: komponent, navigatsiya, API", 'tuzatildi', "Reja teglari."),
 ('m6-11', "Loyiha kuni: mobil ilova", "o'zgarishsiz", "Ekranda o'zgarish yo'q (faqat bo'sh, ko'rinmaydigan teg ma'lumoti olindi)."),
 ('m6-12', "Bugun qaysi ish boshlanadi?", 'tuzatildi', "Keys «n / 6», karta «n / 6»."),
 ('m6-13', "Loyiha kuni: to'liq tizim", 'tuzatildi', "Reja teglari."),
 ('m6-14', "Raqamingiz nimani isbotlaydi?", 'tuzatildi', "Keys «Airbnb · n / 6», juftlik «n / 3»."),
]
JUFT = [
 ('m6-01','s1',"Reja: qadamlar yonidagi teglar"),('m6-01','s3',"So'rov yo'li ustidagi taxmin — yo'naltirishning birinchi qadamini so'rardi"),
 ('m6-02','s6',"«Haqiqiy voqea · 1 / 7» — eyebrow ham «Haqiqiy voqea», tugmada «(1/7)»"),
 ('m6-03','s1',"Reja teglari («mvc», «moslash» …)"),('m6-03','s6',"«Kod bo'lagi 1/3» — tugmada «Moslang (0/3)»"),('m6-03','s12',"«Tizim 1/3» — tugmada «Ajrating (0/3)»"),
 ('m6-04','s10',"«Vazifa 1/4» — tugmada «Tanlang (0/4)»"),
 ('m6-06','s6',"«Haqiqiy holat · 1 / 5»"),
 ('m6-08','s1',"Reja: «jonli», «amaliyot» teglari"),
 ('m6-12','s6',"Keys «1 / 6»"),('m6-12','s9',"Karta «1 / 6» — tugmada «(0/6)»"),
 ('m6-14','s6',"«Airbnb · 1 / 6»"),('m6-14','s9',"Juftlik ustidagi «1 / 3»"),
]
YAKKA = [
 ('m6-01','s3-bos',"Taxminsiz: xato tanlovda darhol tushuntirish chiqadi."),
 ('m6-02','s6-bos',"Bashorat bosqichi: yorliqda faqat «Avval o'zingiz belgilab ko'ring»."),
]
EMO = [
 ('m6-02','s0',"Kirish variantlari: 🗣 🧠 ikonlari"),
 ('m6-02','s8',"Varaq qatorlari va placeholder: 🔴 👤 🛠 📊, yorliq 🎯"),
 ('m6-04','s0',"Yorliqlar: «💬 Oddiy AI», «🤖 AI-agent»"),
 ('m6-07','s0',"Fayl tabi «📄 SKILL.md (1-urinish)»"),
 ('m6-09','s2',"Bo'lim sarlavhasi «📱 React Native nima?»"),
]
import json
_bz = {(x['key'], x['s']): x for x in json.load(open(os.path.join(D, '..', '..', 'olchov-ekran-1553.json'), encoding='utf-8')) if x['key'].startswith('m6-')}
_ky = {}
for L in open(os.path.join(D, '..', '..', 'malumot', 'olchov-121-keyin.jsonl'), encoding='utf-8'):
    if L.strip(): x = json.loads(L); _ky[(x['key'], x['s'])] = x
_oq = [k for k, x in _bz.items() if x['type'] not in ('test', 'stats', 'flashcards', 'summary') and k in _ky]
SUM = lambda src, f: sum(src[k][f] for k in _oq)
OZG = sum(1 for k in _oq if any(_bz[k][f] != _ky[k][f] for f in ('words', 'blocks', 'small')))
fmt = lambda n: f'{n:,}'.replace(',', ' ')
OLCH = dict(n=len(_oq), ozg=OZG, w=(SUM(_bz,'words'), SUM(_ky,'words')), b=(SUM(_bz,'blocks'), SUM(_ky,'blocks')), m=(SUM(_bz,'small'), SUM(_ky,'small')))
print('OLCHOV', OLCH)
rows = ''.join(f'<tr><td class="k">{k}</td><td>{e(n)}</td><td><span class="h h-{"ok" if h=="tuzatildi" else ("p" if h=="pilot" else "n")}">{e(h)}</span></td><td>{e(t)}</td></tr>' for k,n,h,t in DARS)
cards = ''.join(f'''<section class="juft" id="{k}-{s}"><h3><span class="k">{k} · {int(s[1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img('F-1015-121-oldin',k,s)}" alt="{k} {s} oldin" loading="lazy"></figure>
<figure><figcaption>Keyin</figcaption><img src="{img('F-1015-121-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in JUFT)
yakka = ''.join(f'''<section class="juft"><h3><span class="k">{k} · {int(s.split('-')[0][1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar bitta"><figure><figcaption>Keyin</figcaption><img src="{img('F-1015-121-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in YAKKA)
H = f'''<title>8-Modul tozalash</title>
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
<header class="kirish"><span class="yorliq">F-1015-121 · 208-qonun · 8-Modul</span>
<h1>8-Modul: 14 darsdagi takrorlar olindi</h1>
<p>Har dars joyida tuzatildi. Qoida avvalgidek: bir narsani ikkinchi marta aytgan hisob, yorliq, chip yoki taxmin olinadi. <b>Matn qisqartirilmadi.</b></p>
<p>13 ta dars tuzatildi, 1 tasida ekranda o'zgarish yo'q. Har darsdan keyin 12 ta darvoza toza, sahifada JavaScript xatosi yo'q.</p></header>
<section class="blok"><h2>Darslar</h2><div class="ur"><table><thead><tr><th>Dars</th><th>Nomi</th><th>Holat</th><th>Nima olindi</th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="blok"><h2>O'lchov: {OLCH['n']} ta o'quv ekrani</h2>
<div class="raqam"><div><b>{OLCH['ozg']}</b><span>ekran o'zgardi</span></div><div><b>{fmt(OLCH['w'][0])} → {fmt(OLCH['w'][1])}</b><span>so'z</span></div><div><b>{fmt(OLCH['b'][0])} → {fmt(OLCH['b'][1])}</b><span>matn bloki</span></div><div><b>{fmt(OLCH['m'][0])} → {fmt(OLCH['m'][1])}</b><span>mayda yozuv</span></div></div>
<p class="izoh">Testlar, podium, kartochka va yakun ekranlari sanalmagan. O'lchov ekranning boshlang'ich holatida olinadi. Olingan takrorlarning bir qismi tugma bosilgandan keyin yoki o'quvchi ma'lumoti bilan chiqadi, shuning uchun raqamda hammasi ko'rinmaydi.</p></section>
<div class="ogoh"><b>8-Modulda eng ko'p uchragani — reja qadamlari yonidagi teglar</b> (10 darsda; qadam matnini bir so'z bilan qaytarardi) va keys slaydi yorlig'idagi sanoq. Bitta joyda o'zimni tuzatdim: m6-02 8-ekrandagi «1 Muammo · 2 Kim …» doiralarini takror deb olgandim — joriy katak nomini ko'rsatadigan yagona joy ekan, qaytardim.</div>
{cards}
<section class="blok"><h2>O'quvchi ma'lumoti bilan ko'rilgan ekranlar</h2><p class="izoh">Bu ekranlar o'quvchining roadmap'i yoki yozgan bo'laklari bilan to'ladi. «Oldin» surati bo'sh holatda olingan, shuning uchun bu yerda faqat «keyin» surati bor. Har birida nima olingani yozilgan.</p></section>
{yakka}
<section class="blok"><h2>Ataylab qoldirilganlar</h2><ul>
<li>Joriy bandni ko'rsatadigan qadam qatorlari qoldi: m6-02 «1 Muammo · 2 Kim …», m6-06 «1-chegara …», m6-08 sikl ro'yxati.</li>
<li>Tugmada sanoq bo'lmagan joyda kartadagi hisob qoldi — yagona: m6-10 «tanlandi: 0/5».</li>
<li>Bosib kuzatiladigan ekranlardagi taxmin qoldi (m6-01 6, 12-ekran).</li></ul></section>
<section class="blok"><h2>Emoji: 2-variant bajarildi (F-1015-122)</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">Sizning qaroringiz bo'yicha 7–8-Modulda dars yuzasidagi bezak emoji olindi: bo'lim sarlavhalari, yorliqlar, karta ikonlari, fayl tablari, eyebrow'lar, bashorat va amaliyot yorliqlari, «Bajardim» tugmasi, tartib mashqi xabari — 16 ta faylda ~175 joy. Qoldi: sxema tugunlari va keys sahnalari, o'yin qatlami (nishon, arena, podium), Yakun, takrorlash oynasi, test xabarlari va Mentor paneli (9–14-Modulda ham shunday), bot/ilova maketidagi mahsulot mazmuni (🍕 Menyu, 🛒, «📱 Telefon»). Darvoza qoidasi bo'yicha kodda: 7-Modul 288 → 284, 8-Modul 554 → 454; qolgani asosan arena va Mentor qatlami. Har fayl 12/12, hamma ekran JavaScript xatosiz ochildi.</p></section>
''' + ''.join(f'<section class="juft"><h3><span class="k">{k} · {int(c[1:])+1}-ekran</span> {e(t)}</h3><div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img("F-1015-121-oldin",k,c)}" alt="{k} {c} oldin" loading="lazy"></figure><figure><figcaption>Keyin</figcaption><img src="{img("F-1015-122-keyin",k,c)}" alt="{k} {c} keyin" loading="lazy"></figure></div></section>' for k,c,t in EMO) + '''
<section class="blok"><h2>Keyingi qadam</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">7–14-Modul supurishi va 7–8-Modul emoji ishi tugadi. Keyingi seans — QA fidbeklari.</p></section>
</main>'''
open(os.path.join(D,'modul-121.html'),'w',encoding='utf-8').write(H); print('OK', round(len(H)/1024),'KB')
