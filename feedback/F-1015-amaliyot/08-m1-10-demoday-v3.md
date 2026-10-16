# 2-Modul (kod: 1-Modul) · 11-dars «CSS Praktika» — MD v3 · **v2: Demo Day saytini boshlash** (F-1015-309)

Fayl: `src/1-Modull/CssPractice.jsx` · `lessonId: css-practice-portfolio-v3` (o'zgarmaydi — LMS kaliti) · **9 ekran** · faqat o'zbekcha (ru — qoralama)
Asos: GATE V2 (15.10): Q1 A · Q2 A · Q3 A · Q4 A · Q5 A — `02-m1-10-v2-reja.md`. Qolip — pilot v1 (`01-m1-10-v3.md`, qabul ✅) aynan: vazifa · prompt maslahati · natija surati, «Davom etish», isbot yo'q.
Pilot v1 (portfolio) — `arxiv/F-1015-pilot-v1/CssPractice.jsx`. Faqat Gemini (Copilot — 3-Moduldan).

**⚠️ F-1015-311 (fidbek F-1015-310, Q1–Q4 A) — pastdagi ekran tavsiflaridan USTUN:**
- Maket (`DemoSahifa`) **doim namuna**: «To'garak jadvali endi telefoningizda», yorliq «Kutilgan natija · namuna» (a3 — «· masalan»). O'quvchi g'oyasi faqat promptga.
- Maket — landing: kichik yozuv · katta sarlavha · gap · «Batafsil» · 3 ikonkali karta (Jadval, Manzil, Telefonda) · footer; 4 uslub + «rang» holati.
- a1, a2: «Promptda ayting» + «Masalan» o'rniga — **Qadamlar** (4 qator, tugmasiz) + **Prompt** (to'liq) + «Promptni nusxalash».
  a1 qadamlari: «Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring · Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S` · Live Server'da qarang: menyu, sarlavha, tugma, 3 karta, footer — hammasi bormi? · Biror qism yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».
  a2 qadamlari: Uslubni tanlang — prompt o'zgaradi · «Promptni nusxalash» → Gemini'ga qo'ying, oxiridagi `{…}` o'rniga `index.html` kodingizni qo'ying · Javobdagi kodni `style.css` ga qo'ying, `Ctrl+S` · Live Server'da natijani o'ngdagi surat bilan solishtiring.
  a1 prompti: tuzilish (tepa · bosh qism · 3 karta · footer) + class nomlari (header, hero, kartalar, karta, footer). a2 prompti: uslub + `USLUB_SPEC` (ranglar, Google Fonts shrifti, menyu, kartalar) + bosh qism 48px, kartalar orasi 24px, eni 1000px, telefonda ustma-ust.
- s1: bankdan tanlanganda ro'yxat yopilmaydi (tanlangani belgilanadi); s0: javob izohiga joy oldindan — ekran siljimaydi.

**⚠️ F-1015-312 (o'z auditi, qolip `QOLIP.md` bilan solishtirildi) — yana USTUN:**
- s0 (QKirish): **maket chapda**, variantlar + javob o'ngda; variantlar animatsiyasiz (oldin 3 s xira turardi). Mentor joy so'zisiz.
- s1 (QReja): chapda «Dars oxirida · namuna» + maket; o'ngda «Bugungi 3 blok» → g'oya (bank 2×2 yoki karta) → «Tayyorlanish».
- a1–a3 (QBlok): chapda qadamlar + prompt («Promptni nusxalash» — prompt sarlavhasi yonida, tepada); o'ngda maket + izoh + «Ortda qoldingizmi».
- a1: «Vazifa» kartasi olindi (sarlavha va prompt aytadi, §216). a2 4-qadam: «Live Server'dagi natijani «Kutilgan natija» surati bilan solishtiring.»
- a3 1-qadam: rang — o'quvchi tanlagan uslubniki (Minimalist `#d4380d` · Yorqin `#c2410c` · Qorong'i `#34d399` · Gradient `#7e22ce`).
- Kartochka: «Gemini'ga dizayn so'rovida nima qo'shiladi?» → «Hozirgi index.html va «HTML'ni o'zgartirma»».
- Maket to'liq ko'rinadi (footer kesilmaydi).

**⚠️ F-1015-313 (fidbek: 4 rasm) — eng ustun:**
- Maket — haqiqiy rangli landing: rangli menyu + «Kirish» tugmasi · rangli bosh qism (gradient) · yonida jadval kartasi (Robototexnika 15:00 · 204-xona, Shaxmat, Futbol) · ikki tugma · ikonkali 3 karta. Tanlanmaguncha uslub — **Yorqin**.
- s1: g'oya-banki va «Sizning g'oyangiz» olindi. O'ngda birinchi — **«Avval tayyorlaning»** (alohida karta, to'q sariq ramka, katta raqamlar; telefonda eng tepada), keyin «Bugungi 3 blok» (01 «Loyiha va bosh sahifa»).
- a1: sarlavha **«Loyihangizni yozing — Gemini HTML'ni quradi.»**; forma — «Loyihangiz nomi» · «Qanday muammoni hal qiladi?» · «Saytda nima bo'lsin? (talablaringiz)» (bo'sh boshlanadi, eski yozilgan olinmaydi).
  Uchalasi to'lgach: «Prompt tayyor — endi Gemini orqali quring.» + prompt (nom, muammo, talablar bilan) + qadamlar ochiladi (animatsiya). Yozilgani `ccDemoDay.css`, `yechim`, `muammo` ga saqlanadi (Netlify darsi uchun).
- a2: avval faqat uslub tanlovi; tanlangach prompt va qadamlar ochiladi (animatsiya). «Uslubni tanlang» qadami olindi (3 qadam).
- Kichik yozuv («Maktab to'garaklari · 2026») — oq pill ichida (kontrast ≥ 4.5 hamma uslubda).
- **F-1015-315:** bosh qism rasmi — kod ichida chizilgan illyustratsiya (telefon ichida jadval + robot, shaxmat, futbol belgilari, rangli dog'lar); yuklanmaydi, uslubga qarab rangi o'zgaradi; xom holatda yo'q.

**⚠️ F-1015-316 (fidbek: 3 rasm) — eng ustun; ekranlar: s0 · s1 · a1 · a2 · a3 · s16 · a4 · spodium · s17 (9):**
- Maydonlar minimalistik: ingichka ramka, soyasiz; bosilganda to'q sariq ramka + yorug' halqa; a1 da birinchi maydon o'zi tanlanadi.
- a1: uchala qator to'lgach — **«Saqlash»** (oldin «Uchala qatorni to'ldiring», faol emas) → forma yig'iladi: nom (katta) · Muammo · Talablar + **«Tahrirlash»**; tahrirlashda prompt jonli yangilanadi.
  O'ngda maket o'rniga — **Qadamlar** (1. Loyihangizni yozing va «Saqlash»ni bosing — prompt tayyor bo'ladi. · 2. «Promptni nusxalash» → gemini.google.com'ga qo'ying va yuboring. · 3. Javobdagi kodni `index.html` ga qo'ying (bor kod o'rniga), `Ctrl+S`. · 4. Live Server'da qarang: … Yo'q bo'lsa, Gemini'ga aniq yozing: «… qo'shilmagan, qo'sh».)
- «Ortda qoldingizmi? Namuna kodini nusxalash» — hamma ekrandan olindi (namuna kodlari ham).
- **Kartochkalar ekrani olindi** (foydalanuvchi qarori — QYakun standartidan istisno). O'rniga testdan keyin **a4 · «Saytingizni tekshiring va yaxshilang.»**:
  chapda «Bitta kamchilik» (Nima yoqmadi? · Qanday bo'lsin?) → «Prompt tayyor — Gemini'ga yuboring.» + prompt («Saytimni yaxshila — faqat shu joyni o'zgartir, qolganiga tegma. Yoqmagani: … Qanday bo'lsin: … O'zgargan faylni to'liq qaytar. Mana kodim: {…}») + «Keyingi kamchilik» (maydonlar tozalanadi, «Yaxshilandi: N»);
  o'ngda «Saytingizni tekshiring» (5 savol: menyu havolalari · telefonda kartalar · matn loyiha haqidami · tugma va sarlavha rangi · footer) + Qadamlar (4).
- Yakun «Endi siz bilasiz»ga: «Saytni ro'yxat bo'yicha tekshirib, aniq so'rov bilan yaxshilaysiz».

## A. Tayanch
1. **Ip:** o'quvchining **Demo Day sayti** — `ccDemoDay` (muammo, yechim): PM darsida tanlangan, VS Code darsida tasdiqlangan. Bugun — **bosh sahifa** (`mening-saytim` papkasi: `index.html` + `style.css`).
   Netlify darsida qolgan sahifalar shu dizaynda qo'shiladi va sayt internetga chiqadi.
2. **Urg'u — CSS:** HTML'ni Gemini bir blokda tez yozadi (a1); dizayn uslubi — a2; o'zgartirish o'zingiz — a3.
3. **G'oyasi yo'q o'quvchi** (yoki boshqa qurilma): Reja ekranida g'oyalar bankidan tanlaydi (VS Code darsidagi 4 g'oya, aynan) — tanlov `ccDemoDay` ga yoziladi.
4. **Uslub (Q3 A):** 4 uslub Netlify darsidan ko'chadi (Minimalist · Yorqin · Qorong'i · Gradient — tavsiflari aynan); tanlov `ccDemoDay.uslub` ga yoziladi.
5. **Bitta vizual — `DemoSahifa` (KOD):** bosh sahifa maketi: tepada sayt nomi va menyu · katta sarlavha (yechim) · bir gap (muammo) · «Batafsil» tugmasi · 3 afzallik kartasi · footer.
   Holatlar: `xom` (HTML, CSS'siz) → `uslub` (tanlangan uslub) → `rang` (asosiy rang almashgan). Matni — o'quvchining g'oyasidan; yo'q bo'lsa — namuna «To'garak jadvali».

---

## s0 · Kirish  ← QKirish
- Eyebrow: CSS Praktika · kirish
- Sarlavha: **Saytingizga kirgan odam avval nimani ko'radi?** (44)
- Mentor: Bugun Demo Day saytingizning bosh sahifasi shunday bo'ladi. Unga qarang va javobni tanlang. (F-1015-312: maket CHAPDA, variantlar o'ngda — QKirish; joy so'zi yo'q)
- Maket: `DemoSahifa uslub` (o'quvchi g'oyasi bilan).
- Variantlar (navbat bilan): Sayt qaysi muammoni hal qilishini ✔ · Saytning hamma sahifalari ro'yxatini · Saytni kim yasaganini
- Javob: ✔ «**Aynan!** Bosh sahifa bir qarashda aytadi: qanday muammo va sayt uni qanday hal qiladi.» · boshqa: «**Qiziq fikr!** Sarlavhaga qarang: u muammoga yechimni aytadi — odam shuni birinchi ko'radi.»

## s1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun Demo Day saytingizni boshlaysiz** (37)
- Mentor: Bugun bosh sahifa: HTML'ni Gemini tez yozadi, asosiy vaqt — dizaynga. Qolgan sahifalar — Netlify darsida.
- Chapda — «Sizning g'oyangiz»: muammo · yechim (o'quvchinikidan). Yo'q bo'lsa: «G'oyangizni tanlang» + 4 g'oya (bank) — bosilgani saqlanadi.
- Chapda — «Tayyorlanish» (3 qator): 1. Ish stolida `mening-saytim` papkasini yarating va VS Code'da oching. · 2. Ichida `index.html` va `style.css`; `index.html` da `!` + Tab, Go Live. · 3. Boshqa oynada gemini.google.com.
- O'ngda — «Bugungi 3 blok»: `01 · Bosh sahifa · HTML` · `02 · Dizayn · uslub` · `03 · O'z rangingiz · Ctrl+H` + kichik `DemoSahifa rang`.
- Tugma: Davom etish

## a1 · Amaliyot 1 — bosh sahifa HTML (Gemini)
- Eyebrow: Amaliyot 1 · HTML
- Sarlavha: **Bosh sahifaning HTML'ini Gemini'ga yozdiring.** (44)
- **Vazifa:** Bosh sahifaning hamma qismi bo'lsin — dizaynsiz, faqat HTML.
- **Promptda ayting:** muammo va yechimingiz · qismlar: sayt nomi va menyu, sarlavha, muammo haqida bir gap, «Batafsil» tugmasi, 3 afzallik kartasi, footer · faqat HTML, `style.css` ulangan
- **Masalan** (g'oya o'quvchinikidan qo'yiladi):
  > Demo Day loyiham uchun bosh sahifa — index.html'ni yoz.
  > Muammo: {muammo}. Saytim: {yechim}.
  > Sahifada: tepada sayt nomi va menyu (Bosh sahifa, Aloqa), katta sarlavha, muammo haqida bitta gap,
  > «Batafsil» tugmasi, saytning 3 ta afzalligi — 3 ta karta, eng pastda footer.
  > style.css <link> bilan ulangan bo'lsin. Hozircha CSS yozma, faqat HTML.
- Natija: `DemoSahifa xom`. Ostida: «HTML — sahifaning tuzilmasi: hamma qism bor, lekin hali bezaksiz.»
- Ortda qoldingizmi? [Namuna kodini nusxalash] (bo'sh boshlanish — `!` + Tab, `style.css` ulangan)
- Nishon (bonus): **Kick Off!** — «Demo Day saytingiz bosh sahifasini boshladingiz»

## a2 · Amaliyot 2 — dizayn (Gemini)
- Eyebrow: Amaliyot 2 · dizayn
- Sarlavha: **Saytingiz uchun uslub tanlang.** (30)
- **Uslub** (4 tugma, emojisiz): Minimalist — oq fon, tinch · Yorqin — quvnoq ranglar · Qorong'i — to'q fon, oq matn · Gradient — rang o'tishlari. «Har kim boshqa uslub tanlasa, sinfda bir xil sayt chiqmaydi.»
- **Promptda ayting:** uslub · kartalar bir qatorda, tugma ko'zga tashlansin · faqat `style.css`, HTML'ga tegmasin · hozirgi `index.html`
- **Masalan** (tanlangan uslub tavsifi qo'yiladi):
  > Bosh sahifamga dizayn ber — faqat style.css'ni yoz, HTML'ni o'zgartirma.
  > Uslub: {uslub tavsifi}
  > 3 ta karta bir qatorda, orasida bo'shliq; «Batafsil» tugmasi ko'zga tashlansin.
  > Mana kodim: {index.html kodini shu yerga qo'ying}
- Natija: `DemoSahifa uslub` (tanlangan uslubda). Ostida: «Gemini javobida kartalarni yonma-yon qo'ygan `display: flex` va `gap` ni toping.»
- Ortda qoldingizmi? [Namuna kodini nusxalash] (a1 oxiridagi `index.html`)
- Nishon (bonus): **Styled!** — «Saytingizga o'zingiz tanlagan uslubni berdingiz»

## a3 · Amaliyot 3 — o'z rangingiz (Gemini'siz)
- Eyebrow: Amaliyot 3 · Gemini'siz
- Sarlavha: **Saytga o'zingiz tanlagan rangni bering.** (39)
- Qadamlar — pilot v1 dagidek: 1. `style.css` da asosiy rangni toping — tugma va sarlavhalarda takrorlanadigan kod (namunada `#d4380d`). · 2. `Ctrl+H` … `Ctrl+Alt+Enter` — hammasi birdan almashadi. · 3. `Ctrl+S` — Live Server.
- Yordam: rang tanlagich (pilotdagidek).
- Natija: `DemoSahifa rang` (yorliq «Kutilgan natija · masalan»).
- Ortda qoldingizmi? [Namuna kodini nusxalash] (a2 oxiridagi `style.css`, Minimalist)
- Nishon (bonus): **Color Master** — «Saytga o'zingiz tanlagan rangni berdingiz»

## s16 · Topshirish  ← QTest — pilot v1 dagidek (✔ C `ul { display: flex; }`, `INLINE_KEYS.s16 = 2`)
- Savol matni: **Kartochkalarni bir qatorga qaysi qoida tizadi?** · Mentor: «Avval sahifangizni ustozga ko'rsating. Keyin savolga javob bering.»

## Natijalar · Kartochkalar · Yakun
- Arena 12 savol aynan (mavzular F-1015-304 da tekshirilgan).
- Kartochkalar (10): pilotdagi 10 ta, `:hover` o'rniga — «Shriftni qaysi xususiyat beradi? → `font-family`».
- Yakun — «Endi siz bilasiz»: Gemini'ga HTML'ni qismlari bilan aniq so'raysiz · uslubni so'z bilan tasvirlab, dizayn olasiz · `display: flex` + `gap` — kartalar bir qatorda · rangni butun faylda `Ctrl+H` bilan o'zingiz almashtirasiz.
- Uyga vazifa (VS Code, skrinshot) — **Saytingizning qolgan sahifalarini rejalang:** 1) saytingizda yana qaysi 3 sahifa bo'lishini yozing (masalan, `sahifalar.txt`) · 2) har biriga bir gap — unda nima turadi · 3) bosh sahifa skrinshotini platformaga yuklang.
- Keyingi qadam qatori: «Keyingi dars — Git va GitHub. Netlify darsida saytni tugatib, internetga chiqarasiz.»

## Nishonlar (id lar saqlanadi, nomi/tavsifi yangilanadi)
| id | Nomi | Qachon | Tavsif |
|---|---|---|---|
| spacer | Kick Off! | a1 | Demo Day saytingiz bosh sahifasini boshladingiz |
| layout | Styled! | a2 | Saytingizga o'zingiz tanlagan uslubni berdingiz |
| color | Color Master | a3 | Saytga o'zingiz tanlagan rangni berdingiz |
| graduate | Designer | yakun | CSS praktikani oxirigacha bajardingiz |

## «KOD» ro'yxati
1. `PfSahifa` (portfolio) → `DemoSahifa` (3 holat × 4 uslub; matn `ccDemoDay` dan, yo'q bo'lsa namuna). `PS_*` → `DS_*`.
2. `IDEA_BANK` (VsCodeLesson dan aynan), `STYLES` (DeployLesson dan aynan, emojisiz ko'rsatiladi), `demoRead/demoWrite` (`ccDemoDay`; yangi maydon `uslub`).
3. `AMALIYOT` — a1/a2 matnlari, a2 da uslub tugmalari va jonli «Masalan»; `NAMUNA_HTML` (to'garak namunasi), `NAMUNA_BOSH`, `NAMUNA_CSS` (Minimalist).
4. s0/s1 yangi; s16, natijalar, arena, kontrast ranglari, eski progress himoyasi — pilotdagidek. `HOMEWORK` bandlari yangilanadi (`type: 'file'`).
5. Chegaradan tashqari (nazorat): `DeployLesson.jsx` 6 ekran (Q1 A — ruxsat kutilmoqda) · `App.jsx` + `mentor/lessons.jsx` nomi (Q5 A): uz «CSS Praktika — Demo Day saytini bezaymiz», sub «bosh sahifa: HTML — Gemini, dizayn — siz»;
   ru «CSS практика — оформляем сайт для Demo Day», sub «главная страница: HTML — Gemini, дизайн — вы». · `HtmlPractice.jsx` 1820 «Keyingi dars» qatori.
6. Sinov: gates · lint:jsx · lint:til · 9 ekran 1280 + 390 · kontrast ≥ 4.5 · eski progress · `ccDemoDay` bor/yo'q holatlari · navtest2 · mentor · smoke (ruxsat bilan).
