# F-1015-113: pilot m7-01 oldin/keyin sahifasi (rasmlar data: URI bilan ichiga)
import base64, html, os
D = os.path.dirname(os.path.abspath(__file__))
SUR = os.path.join(D, '..', '..', 'suratlar')
def img(papka, nom):
    with open(os.path.join(SUR, papka, f'm7-01-{nom}.jpg'), 'rb') as f:
        return 'data:image/jpeg;base64,' + base64.b64encode(f.read()).decode()
E = [
 ('2-ekran · Reja', 's1', 's1', 'd', ["Pastdagi bo'sh KIM / MUAMMO / YECHIM kartasi olindi. Karta 13-ekranda o'z o'rnida chiqadi.", "Har qadam yonidagi kichik teg (farq, tahlil, voqea, juftlik) olindi. U qadam matnini qayta aytardi."]),
 ('3-ekran · Loyiha va mahsulot (animatsiyadan keyin)', 's2-keyin', 's2-keyin', 'b', ["Har kartadagi «loyiha» / «mahsulot» yorlig'i olindi. Guruh nomi tepada aytadi.", "«avval — qurish ishi» strelkasi olindi. Xulosa shuni aytadi."]),
 ('4-ekran · 1-test (javobdan keyin)', 's3-keyin', 's3-keyin', 'c', ["Javobdan keyin savol ustida chiqadigan karta olindi. Izoh «To'g'ri» xuddi shuni aytadi.", "Endi darsdagi to'rt test bir xil ko'rinadi: savol, variantlar, izoh."]),
 ('5-ekran · Uch mahsulot', 's4', 's4', 'a', ["Telefon ustidagi «1 Yandex Go · 2 Payme · 3 Google Translate» qatori olindi. Karta nomi va tugmadagi (0/3) shuni aytadi.", "Mentor gapi o'zgardi. Eski gapda boshqa dars nomi va «auditoriya-karta» atamasi bor edi. Yangisi oddiy so'z bilan."]),
 ('6-ekran · 2-test (javobdan keyin)', 's5-keyin', 's5-keyin', 'c', ["Javobdan keyingi Uzum Market kartasi olindi. Izoh shuni aytadi."]),
 ('7-ekran · Dropbox (taxmin bosqichi)', 's6-bashorat', 's6-bashorat', 'a', ["«Dropbox · 3/5 ●●●●●» nuqtalar qatori olindi. Tugma «Keyingi bosqich (3/5)» shuni aytadi.", "Variantlardagi ✓ / ✗ belgisi olindi. Ostidagi natija qatori to'g'ri javobni aytadi."]),
 ('9-ekran · Telefondagi ilovalar', 's8', 's8', 'a', ["Tepadagi 1 · 2 · 3 doiralar olindi. Tugma «Uch kartani yozing (0/3)» shuni aytadi."]),
 ('10-ekran · Mentor ro\'yxati (saralash)', 's9-saralash', 's9-saralash', 'e', ["«Olti yozuvdan nechtasi muammo?» taxmini olindi. Bu darsdagi uchinchi taxmin edi va tugmalarni qulflab turardi.", "Karta ichidagi «3 / 6» olindi. Tugma «Yozuvlarni joylang (2/6)» shuni aytadi."]),
 ('11-ekran · Kecha kim qayerda qiynaldi', 's10', 's10', 'a', ["Beshta nuqta va «0 / 5» olindi. Tugma «Yana 5 ta muammo yozing» shuni aytadi.", "Yakka rejimdagi qadam tugmalari olindi. Mentor gapi xuddi shuni aytadi. Juftlikda ular qoladi, chunki taymerni boshqaradi."]),
 ('14-ekran · Boshqalarda ham bormi', 's13', 's13', 'b', ["«1 Ovoz chiqarib ayting · 2 KIM qatorini yozing» qatori olindi. Mentor gapi va pastki tugma shuni aytadi."]),
]
TUR = {'a': 'Hisob ikki joyda', 'b': "Bir gap ikki joyda", 'c': 'Test boshqacha ko\'rinardi', 'd': "Bo'sh skelet", 'e': 'Ortiqcha taxmin'}
O = [ # ekran, so'z oldin, keyin, blok, blok, mayda, mayda
 ('2 · Reja', 54,45, 8,7, 9,1), ('5 · Uch mahsulot', 75,62, 8,8, 9,6), ('6 · 2-test, javobdan keyin', 63,46, None,None,None,None),
 ('4 · 1-test, javobdan keyin', 61,53, None,None,None,None), ('7 · Dropbox', 50,47, 6,5, 6,5), ('10 · Mentor ro\'yxati', 73,60, 11,9, 11,9),
 ('11 · Kecha kim qiynaldi', 50,39, 6,4, 3,3), ('14 · Boshqalarda ham', 55,49, 8,6, 4,4)]
def e(x): return html.escape(x, quote=False)
kartalar = []
for i,(nom, o, k, t, bandlar) in enumerate(E):
    li = ''.join(f'<li>{e(b)}</li>' for b in bandlar)
    kartalar.append(f'''<section class="juft" id="e{i}">
  <header class="juft-bosh"><h2>{e(nom)}</h2><span class="tur t-{t}">{e(TUR[t])}</span></header>
  <ul class="bandlar">{li}</ul>
  <div class="rasmlar">
    <figure><figcaption>Oldin</figcaption><img src="{img('F-1015-113-oldin', o)}" alt="{e(nom)}: oldin" loading="lazy"></figure>
    <figure><figcaption>Keyin</figcaption><img src="{img('F-1015-113-keyin', k)}" alt="{e(nom)}: keyin" loading="lazy"></figure>
  </div>
</section>''')
def f(a,b): return '—' if a is None else f'{a} → <b>{b}</b>'
qator = ''.join(f'<tr><td>{e(n)}</td><td>{f(a,b)}</td><td>{f(c,d)}</td><td>{f(g,h)}</td></tr>' for n,a,b,c,d,g,h in O)
H = f'''<title>m7-01 pilot</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
/* Ish-hujjat: bir ustun, har o'zgarish — sarlavha, sabab, oldin/keyin surati yonma-yon */
:root {{
  --bg: #F6F5FA; --qogoz: #FFFFFF; --siyoh: #1D1A2E; --siyoh2: #5E5A73; --chiziq: #E3E0EE;
  --urg: #5B3FD6; --urgFon: #EEEAFD; --ok: #1F8A4C; --okFon: #E5F4EB; --ogoh: #A85F00; --ogohFon: #FBF0DF;
  --sh: 'Onest', system-ui, sans-serif; --mono: 'JetBrains Mono', ui-monospace, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #15131F; --qogoz: #1E1B2C; --siyoh: #ECEAF5; --siyoh2: #A7A3BC; --chiziq: #33304A;
  --urg: #A893FF; --urgFon: #2A2445; --ok: #5FD08F; --okFon: #1B3226; --ogoh: #F0B35C; --ogohFon: #3A2C17; color-scheme: dark; }} }}
:root[data-theme="dark"] {{
  --bg: #15131F; --qogoz: #1E1B2C; --siyoh: #ECEAF5; --siyoh2: #A7A3BC; --chiziq: #33304A;
  --urg: #A893FF; --urgFon: #2A2445; --ok: #5FD08F; --okFon: #1B3226; --ogoh: #F0B35C; --ogohFon: #3A2C17; color-scheme: dark; }}
body {{ background: var(--bg); color: var(--siyoh); font-family: var(--sh); font-size: 15px; line-height: 1.55; }}
.sahifa {{ max-width: 1120px; margin: 0 auto; padding-block: 32px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: grid; gap: 28px; }}
.yorliq {{ font-family: var(--mono); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--siyoh2); }}
h1 {{ font-size: clamp(26px, 4vw, 36px); line-height: 1.15; margin: 6px 0 10px; text-wrap: balance; }}
.kirish p {{ max-width: 68ch; margin: 0 0 8px; color: var(--siyoh2); }}
.kirish p b {{ color: var(--siyoh); }}
.qoida {{ background: var(--ogohFon); border: 1px solid var(--chiziq); border-radius: 10px; padding: 14px 16px; max-width: 80ch; }}
.qoida b {{ color: var(--ogoh); }}
.blok {{ background: var(--qogoz); border: 1px solid var(--chiziq); border-radius: 12px; padding: 18px 20px; display: grid; gap: 10px; }}
.blok h2 {{ font-size: 18px; margin: 0; }}
.jadval-ur {{ overflow-x: auto; }}
table {{ border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; font-size: 14px; }}
th, td {{ text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--chiziq); white-space: nowrap; }}
th {{ font-family: var(--mono); font-size: 11.5px; letter-spacing: .05em; text-transform: uppercase; color: var(--siyoh2); font-weight: 700; }}
td b {{ color: var(--ok); }}
.izoh {{ font-size: 13px; color: var(--siyoh2); margin: 0; }}
.mundarija {{ display: flex; flex-wrap: wrap; gap: 8px; }}
.mundarija a {{ font-size: 13px; color: var(--urg); background: var(--urgFon); padding: 5px 10px; border-radius: 999px; text-decoration: none; }}
.mundarija a:focus-visible, .mundarija a:hover {{ outline: 2px solid var(--urg); outline-offset: 1px; }}
.juft {{ background: var(--qogoz); border: 1px solid var(--chiziq); border-radius: 12px; padding: 18px 20px; display: grid; gap: 12px; scroll-margin-top: 16px; }}
.juft-bosh {{ display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px; }}
.juft h2 {{ font-size: 19px; margin: 0; }}
.tur {{ font-family: var(--mono); font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: var(--urgFon); color: var(--urg); }}
.bandlar {{ margin: 0; padding-left: 20px; display: grid; gap: 4px; max-width: 90ch; }}
.rasmlar {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }}
figure {{ margin: 0; display: grid; gap: 6px; min-width: 0; }}
figcaption {{ font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--siyoh2); }}
figure:last-child figcaption {{ color: var(--ok); }}
figure img {{ width: 100%; border: 1px solid var(--chiziq); border-radius: 8px; display: block; }}
.qolgan ul {{ margin: 0; padding-left: 20px; display: grid; gap: 4px; }}
.savol {{ border: 2px solid var(--urg); }}
@media (max-width: 720px) {{ .rasmlar {{ grid-template-columns: minmax(0, 1fr); }} }}
</style>
<main class="sahifa">
  <header class="kirish">
    <span class="yorliq">F-1015-113 · 208-qonun · pilot</span>
    <h1>m7-01 «Loyihangiz kimga kerak?» — oldin va keyin</h1>
    <p>Mavjud dars <b>joyida</b> to'g'rilandi, yangi dars yaratilmadi. Faqat takror elementlar olindi: bir narsani ikkinchi marta aytgan hisob, yorliq, karta va chip.</p>
    <p>Matn qisqartirilmadi. Faqat bitta Mentor gapi soddaroq so'z bilan qayta yozildi. Barcha 12 darvoza toza.</p>
  </header>
  <div class="qoida"><b>Qat'iy qoida (sizning so'zingiz):</b> so'zni qisqartiraman deb o'quvchiga tushunarsiz so'z ishlatilmaydi. Mentor gapi yoqimli va tushunarli qoladi. Bu qoida 208-qonunning 0-bandiga va matn korpusining 228-bo'limiga yozildi.</div>
  <section class="blok">
    <h2>O'lchov: o'zgargan ekranlar</h2>
    <div class="jadval-ur"><table>
      <thead><tr><th>Ekran</th><th>So'z</th><th>Matn bloki</th><th>Mayda yozuv</th></tr></thead>
      <tbody>{qator}</tbody>
    </table></div>
    <p class="izoh">1280 piksel kenglikdagi ekranda o'lchandi. Test ekranlari uchun so'z javobdan keyin sanaldi. 3-ekran va yakun ekrani o'zgarmadi.</p>
  </section>
  <nav class="mundarija" aria-label="Ekranlar">{''.join(f'<a href="#e{i}">{e(x[0].split(" · ")[0])}</a>' for i,x in enumerate(E))}</nav>
  {''.join(kartalar)}
  <section class="blok qolgan">
    <h2>Ataylab qoldirilganlar</h2>
    <ul>
      <li>«Birinchi urinishda to'g'ri bajarsangiz, nishon sizniki» qatori qoldi. 151-qonun shartni oldindan aytishni talab qiladi.</li>
      <li>3- va 7-ekrandagi taxmin qoldi. 181-qonun bosib ko'riladigan ekranda taxminni talab qiladi.</li>
      <li>Brend ranglari (Yandex sariq, Payme moviy) qoldi. Rang soni qolip darajasida, relizdan keyin bir joyda kamaytiriladi.</li>
      <li>Kod ekrani va yakun ekrani o'zgarmadi. Yakun ekrani 207-qonun bilan hamma darsda bir xil.</li>
    </ul>
  </section>
  <section class="blok savol">
    <h2>Sizdan kerak</h2>
    <p class="izoh" style="font-size:15px;color:var(--siyoh)">Shu yo'nalish maqulmi? Maqul bo'lsa, xuddi shu qoida bilan 7–14-Modulning qolgan darslariga o'taman: modulma-modul, har modul oxirida sizga shu kabi sahifa. Biror o'zgarish yoqmasa, ekran raqamini ayting, qaytaraman. Darsni o'zingiz ham ochishingiz mumkin: localhost:5300/#/lesson/m7-01</p>
  </section>
</main>'''
open(os.path.join(D, 'pilot-113.html'), 'w', encoding='utf-8').write(H)
print('OK', round(len(H)/1024), 'KB')
