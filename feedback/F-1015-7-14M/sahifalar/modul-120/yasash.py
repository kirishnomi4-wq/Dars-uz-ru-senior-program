# F-1015-120: 7-Modul supurishi — oldin/keyin sahifasi
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__)); SUR = os.path.join(D, '..', '..', 'suratlar')
def img(p, k, s):
    with open(os.path.join(SUR, p, f'{k}-{s}.jpg'), 'rb') as f: return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
e = lambda x: html.escape(x, quote=False)
DARS = [
 ('m5-01', "Bot nima", "o'zgarishsiz", "Takror topilmadi (7-Modulning etalon darsi)."),
 ('m5-02', "Botingizni birinchi kim ochadi?", 'tuzatildi', "Keys slaydidagi «n / 5» (tugma sanaydi)."),
 ('m5-03', "Telegram Bot API + tugmalar", 'tuzatildi', "Bosilmaydigan qadam qatori, tartib uyalaridagi «N-qadam»."),
 ('m5-04', "Bot eslab qoladi — holat va PostgreSQL", "o'zgarishsiz", 'Takror topilmadi.'),
 ('m5-05', "Loyiha kuni: AI bilan bot", "o'zgarishsiz", 'Takror topilmadi.'),
 ('m5-06', "Bot ichida AI", 'tuzatildi', "Tartib uyalaridagi «N-qadam»."),
 ('m5-07', "Loyiha kuni: bot + DB + AI", "o'zgarishsiz", 'Takror topilmadi.'),
 ('m5-08', "Botingizni ishlatgan odamdan nimani so'raysiz?", 'tuzatildi', "Keys yorlig'idagi «Airbnb · n / 5», «Savol n / 4»."),
 ('m5-09', "Foydalanuvchi fikri va iteratsiya", "o'zgarishsiz", 'Takror topilmadi.'),
 ('m5-10', "AI-agent yaratish", 'tuzatildi', "«Vaziyat N/3», tartib uyalaridagi «N-qadam»."),
 ('m5-11', "Kecha kelgan odam bugun ham keldimi?", 'tuzatildi', "Panel va jadval ustidagi «n / 5», «n / 4», keys yorlig'idagi sanoq."),
 ('m5-14', "Botingiz yaxshi ishlayotganini qaysi raqam aytadi?", 'tuzatildi', "Keys yorlig'idagi «Booking.com · n / 5», «Savol n / 3»."),
]
JUFT = [
 ('m5-02','s6',"Keys slaydi: «1 / 5» — tugmada «Keyingi bosqich (1/5)»"),
 ('m5-03','s9',"Qadam qatori «1 · /menu · 2 · Pitsa · 3 · Biz haqimizda» — bosilmaydi"),('m5-03','s15',"Uyada raqam ikki marta: «1» va «1-qadam»"),
 ('m5-06','s15',"Uyada raqam ikki marta"),
 ('m5-08','s6',"«Airbnb · 1 / 5»"),('m5-08','s9',"«Savol 1 / 4» — tugmada «Yana 4 savol qoldi»"),
 ('m5-10','s7',"«Vaziyat 1/3» — tugmada «(0/3)»"),('m5-10','s15',"Uyada raqam ikki marta"),
 ('m5-11','s4',"Panel «0 / 5» — kunlar jadvalda ko'rinadi"),('m5-11','s6',"«Duolingo · 1 / 5»"),('m5-11','s9',"«1 / 4» — tugmada «Yana 4 qatorni belgilang»"),
 ('m5-14','s9',"«Booking.com · 1 / 5»"),('m5-14','s11',"«Savol 1 / 3» — tugmada «Yana 3 savolni tekshiring»"),
]
YAKKA = [
 ('m5-02','s6-bos',"Bashorat bosqichi: yorliqda faqat «Avval o'zingiz belgilab ko'ring»."),
 ('m5-03','s9-bos',"Birinchi qadam: kod qatori va bot tugmasi nomni aytadi."),
 ('m5-11','s4-bos',"Ikki kun ochilgach: hisob jadvalda, tugmada «Yana 3 kunni oching»."),
]
EMO = [
 ('m5-01','s1',"Xabar yo'li sxemasi: 📩 hodisa · 📄 handler · 💬 javob (167-qonun belgi-lug'ati)"),
 ('m5-06','s1',"AI sxemasi: 📩 · 📄 · 🧠 · 💬"),
 ('m5-02','s6',"Keys sahnasi: 🏛 universitet belgisi"),
 ('m5-08','s6',"Keys sahnasi: 🏠 🛏 ✈ 📷"),
 ('m5-11','s6',"Keys sahnasi: 📱 🔥"),
]
import json
_bz = {(x['key'], x['s']): x for x in json.load(open(os.path.join(D, '..', '..', 'olchov-ekran-1553.json'), encoding='utf-8')) if x['key'].startswith('m5-')}
_ky = {}
for L in open(os.path.join(D, '..', '..', 'malumot', 'olchov-120-keyin.jsonl'), encoding='utf-8'):
    if L.strip(): x = json.loads(L); _ky[(x['key'], x['s'])] = x
_oq = [k for k, x in _bz.items() if x['type'] not in ('test', 'stats', 'flashcards', 'summary') and k in _ky]
SUM = lambda src, f: sum(src[k][f] for k in _oq)
OZG = sum(1 for k in _oq if any(_bz[k][f] != _ky[k][f] for f in ('words', 'blocks', 'small')))
fmt = lambda n: f'{n:,}'.replace(',', ' ')
OLCH = dict(n=len(_oq), ozg=OZG, w=(SUM(_bz,'words'), SUM(_ky,'words')), b=(SUM(_bz,'blocks'), SUM(_ky,'blocks')), m=(SUM(_bz,'small'), SUM(_ky,'small')))
print('OLCHOV', OLCH)
rows = ''.join(f'<tr><td class="k">{k}</td><td>{e(n)}</td><td><span class="h h-{"ok" if h=="tuzatildi" else ("p" if h=="pilot" else "n")}">{e(h)}</span></td><td>{e(t)}</td></tr>' for k,n,h,t in DARS)
cards = ''.join(f'''<section class="juft" id="{k}-{s}"><h3><span class="k">{k} · {int(s[1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar"><figure><figcaption>Oldin</figcaption><img src="{img('F-1015-120-oldin',k,s)}" alt="{k} {s} oldin" loading="lazy"></figure>
<figure><figcaption>Keyin</figcaption><img src="{img('F-1015-120-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in JUFT)
yakka = ''.join(f'''<section class="juft"><h3><span class="k">{k} · {int(s.split('-')[0][1:])+1}-ekran</span> {e(t)}</h3>
<div class="rasmlar bitta"><figure><figcaption>Keyin</figcaption><img src="{img('F-1015-120-keyin',k,s)}" alt="{k} {s} keyin" loading="lazy"></figure></div></section>''' for k,s,t in YAKKA)
H = f'''<title>7-Modul tozalash</title>
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
<header class="kirish"><span class="yorliq">F-1015-120 · 208-qonun · 7-Modul</span>
<h1>7-Modul: 12 darsdagi takrorlar olindi</h1>
<p>Har dars joyida tuzatildi. Qoida avvalgidek: bir narsani ikkinchi marta aytgan hisob, yorliq, chip yoki taxmin olinadi. <b>Matn qisqartirilmadi.</b></p>
<p>7 ta dars tuzatildi, 5 tasida takror topilmadi. Har darsdan keyin 12 ta darvoza toza, sahifada JavaScript xatosi yo'q.</p></header>
<section class="blok"><h2>Darslar</h2><div class="ur"><table><thead><tr><th>Dars</th><th>Nomi</th><th>Holat</th><th>Nima olindi</th></tr></thead><tbody>{rows}</tbody></table></div></section>
<section class="blok"><h2>O'lchov: {OLCH['n']} ta o'quv ekrani</h2>
<div class="raqam"><div><b>{OLCH['ozg']}</b><span>ekran o'zgardi</span></div><div><b>{fmt(OLCH['w'][0])} → {fmt(OLCH['w'][1])}</b><span>so'z</span></div><div><b>{fmt(OLCH['b'][0])} → {fmt(OLCH['b'][1])}</b><span>matn bloki</span></div><div><b>{fmt(OLCH['m'][0])} → {fmt(OLCH['m'][1])}</b><span>mayda yozuv</span></div></div>
<p class="izoh">Testlar, podium, kartochka va yakun ekranlari sanalmagan. O'lchov ekranning boshlang'ich holatida olinadi. Olingan takrorlarning bir qismi tugma bosilgandan keyin yoki o'quvchi ma'lumoti bilan chiqadi, shuning uchun raqamda hammasi ko'rinmaydi.</p></section>
<div class="ogoh"><b>7-Modul umumiy qolipda emas</b> — darslar o'z ko'rinishida, ko'plari ilgari bir necha fidbek davridan o'tgan. Shuning uchun takror kam chiqdi: asosan kartadagi «n / N» (tugma sanab turgan joyda) va tartib mashqida uya raqamining ikki marta yozilishi.</div>
{cards}
<section class="blok"><h2>O'quvchi ma'lumoti bilan ko'rilgan ekranlar</h2><p class="izoh">Bu ekranlar o'quvchining roadmap'i yoki yozgan bo'laklari bilan to'ladi. «Oldin» surati bo'sh holatda olingan, shuning uchun bu yerda faqat «keyin» surati bor. Har birida nima olingani yozilgan.</p></section>
{yakka}
<section class="blok"><h2>Ataylab qoldirilganlar</h2><ul>
<li>Bosiladigan nuqtalar (keys slaydida o'tilgan bosqichga qaytaradi) va bosiladigan tablar qoldi.</li>
<li>Boshqa narsani sanaydigan hisob qoldi: m5-06 «0 / 4» — kontekst oynasining sig'imi, tugma esa xabarlarni sanaydi; m5-02 «Yig'ildi n / 20» — o'yin holati.</li>
<li>Bot simulyatsiyasining o'z tugmalaridagi emoji («🍕 Menyu», «📦 Buyurtma») qoldi — bu o'quvchi yozadigan bot kodining natijasi. Nishon, podium, Yakun ham tegilmadi.</li></ul></section>
<section class="blok ogoh"><h2>Sizdan qaror kerak: chizmalardagi emoji</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)"><b>Yangilandi (8-Modul ko'rigidan keyin):</b> emoji faqat chizmalarda emas — takrorlash oynasi, test xabarlari va Mentor qatlamida ham bor; bu sahifadagi ro'yxat ekranlarning boshlang'ich holatidan olingan va to'liq emas. Umumiy savol va raqamlar 8-Modul sahifasida. 208-qonunning 4-bandi emojini 7–8-Modulda ham faqat o'yin qatlamiga (nishon, podium, arena) qoldiradi. Lekin 5 ta ekranda emoji chizmaning o'zida turibdi: xabar yo'li sxemalarida 167-qonun (02.10, sizning so'rovingiz: «vizual ham ko'rinsin») ataylab kiritgan belgi-lug'ati, keys sahnalarida esa joy/narsa belgilari. Olib tashlasam, tugunlarda faqat nom qoladi yoki sahnani chizilgan shaklga qayta qurish kerak bo'ladi. Ikki qonun bir-biriga zid, shuning uchun hozir tegmadim. Variantlar: (1) shunday qoldirish — 167 ustun; (2) faqat sxemadagi belgilarni olish, nom qoladi; (3) hammasini olish, keys sahnalarini chizilgan belgilar bilan qayta qurish (alohida ish).</p></section>
''' + ''.join(f'<section class="juft"><h3><span class="k">{k} · {int(c[1:])+1}-ekran</span> {e(t)}</h3><div class="rasmlar bitta"><figure><figcaption>Hozir</figcaption><img src="{img("F-1015-120-oldin",k,c)}" alt="{k} {c}" loading="lazy"></figure></div></section>' for k,c,t in EMO) + '''
<section class="blok"><h2>Keyingi qadam</h2><p class="izoh" style="font-size:15px;color:var(--siyoh)">8-Modulga o'taman (src/6-Modull). Emoji bo'yicha qaroringiz 8-Modulga ham tegishli.</p></section>
</main>'''
open(os.path.join(D,'modul-120.html'),'w',encoding='utf-8').write(H); print('OK', round(len(H)/1024),'KB')
