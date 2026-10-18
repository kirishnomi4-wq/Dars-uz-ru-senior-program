# 3-Modul m3-13 «Praktika: Istalgan saytni qurish — bo'laklash + aniq prompt» — yakuniy matn

Fayl: `src/3-Modull/ReactBuildSiteLesson.jsx` · 9 ekran · Oldingi: «Praktika: Loyiha kuni — AvtoIjara» (m3-12) · Keyingi: «Ishlayotgan saytingizni qanday ko'rsatasiz?» (m3-14, PM)
Ip: «Yetkaz» (ovqat yetkazib berish) — o'rgatish namunasi; oxirida o'quvchining o'z sayti · AI: Gemini (Antigravity olindi)
Holat: 2026-10-17 — kodga mos (F-1015-347 → 352 → 357 → 370…372 → 377 → 378…381 dan keyin; foydalanuvchi «yaxshi bo'ladi», tasdiq). `lessonId` = `react-build-site-final-p4-v18` (o'zgarmagan)
Zaxira: 23 ekranli — `arxiv/F-1015-reactbuildsite-oldin/` · 377 dan oldin — `arxiv/F-1015-377-oldin/`. Qurish: `qurish/f347.py` → … → `f377.py` → `f378.py` (joyida).

## 0 · Kirish
- Sarlavha: Endi o'zingiz sayt qurasiz — AI'ga **nima** deysiz?
- Mentor: Mana tayyor sayt — "Yetkaz" ovqat yetkazib berish. Ko'p narsa bor: tepa menyu, banner, taomlar... AI'dan "shuni qur" desangiz — u qayerdan boshlashni bilmaydi. Yechim bitta: 🔍 **Bo'laklarga ajrating** tugmasini bosing — nima ko'rasiz?
- Chapda: «Bo'laklarga ajratish» → «oddiy bloklar!» · «Yetkaz — localhost:5173» — sayt **to'liq** (aylantirishsiz, F-1015-378): Navbar · Hero «30 daqiqada yetkazamiz 🚀» · toifalar · 4 taom (Pepperoni Pitsa, Cheeseburger, Lavash, Coca-Cola 0.5) · Footer; bo'laklanganda har bo'lim yorlig'i (`<Navbar />` …). ⛶ — faqat sayt.
- O'ngda «Bunday saytni AI bilan qanday quramiz?» (ballsiz, bo'laklagandan keyin ochiladi): Bitta jumla: "menga ovqat sayti qur" · ✔ Bo'laklab, har qismni aniq aytib · Hammasini o'zim qo'lda yozaman

## 1 · Reja
- Sarlavha: Istalgan sayt — **bir xil yo'l** bilan.
- Mentor: Bu — modulning oxirgi darsi. Avval «Yetkaz» saytida yo'lni o'rganasiz: **bo'laklash → aniq prompt → tekshirish**. Keyin xuddi shu yo'l bilan o'z saytingizni boshlaysiz.
- «Avval tayyorlaning · 3 qadam ▾» (oyna): 1. Terminalda: `npm create vite@latest yetkaz` (React, JavaScript), keyin `cd yetkaz`, `npm install`, `npm run dev`. · 2. Papkani VS Code'da oching — `src` ichida `components` papkasini yarating. · 3. Boshqa oynada gemini.google.com'ni oching.
- Chapda «Namuna · Yetkaz» · O'ngda «Bugungi 4 blok»: 01 Bo'laklash (o'zingiz) · 02 Yetkaz — aniq prompt (Gemini) · 03 AI xatosini tuzatish (siz) · 04 O'z saytingiz (siz + Gemini). («Yo'l — 4 qadam» ro'yxati olindi — takror edi, F-1015-377.)

## 2 · Amaliyot 1 · AI'siz — bo'limlar
- Sarlavha: Bosh sahifa — **qaysi bo'limlardan** tuzilgan?
- Mentor: Endi Bosh sahifani bo'limlarga ajratamiz — bu **komponent daraxti**. Har bo'lim — alohida komponent. Sahifadagi **4 ta bo'limni** bosib toping.
- Chapda «Yetkaz · Bosh» sayti (oyna 400px, ⛶ da aylantirishsiz to'liq — F-1015-379); bo'lim bosilsa o'ngda yorliq + izoh (`<Hero />` Tepa banner — aksiya va asosiy tugma · `<Categories />` Kategoriyalar qatori — Pitsa, Burger... · `<TaomList />` Taomlar grid — ichida TaomCard takrorlanadi · `<Footer />` Pastki qism — aloqa, havolalar).
- O'ngda «Komponent daraxti»: `<BoshSahifa>` · `<Navbar />` · `<Hero />` · `<Categories />` · `<TaomList>` · `<TaomCard /> // takrorlanadi` · `</TaomList>` · `<Footer />` · `</BoshSahifa>` (topilgani yorishadi)
- Tugma: «N/4 bo'limni toping» → «Davom etish».

## 3 · Amaliyot 2 · Gemini — Yetkaz uchun aniq prompt
- Sarlavha: Yetkaz uchun **aniq prompt** yozing.
- Mentor: «Bosh sahifani qur» — juda kam: AI o'zicha taxmin qiladi. Promptga uch narsani qo'shing va natija qanday aniqlashishini kuzating: **bo'limlar, har bo'lim mazmuni, ma'lumot va uslub**.
- Chapda: «+ ① Qaysi bo'limlar» · «+ ② Har bo'lim nima ko'rsatadi» · «+ ③ Ma'lumot va uslub» · «Prompt aniqligi N%» · maket («Bo'limlar aytilmagan — AI o'zicha taxmin qiladi» → bo'limlar → narxlar → ma'lumot).
- O'ngda Prompt (har aniqlik qo'shilgan sari o'sadi; boshi: `Vite + React loyiham (yetkaz) uchun ovqat yetkazib berish saytining Bosh sahifasini qur.` … `Har faylni to'liq yoz.`) · «Yana N ta aniqlik qo'shing — AI kamroq taxmin qiladi.» · «Qadamlar · 4» (oyna).
- Nishon «Prompt Sniper!».

## 4 · Amaliyot 3 · AI xatosi
- Sarlavha: AI qurdi — siz **tekshirasiz** va tuzatasiz.
- Mentor: Gemini bosh sahifani qurdi. Lekin diqqat bilan qarang — **bir narsa yetishmayapti**! AI har doim ham mukammal qilmaydi. Siz — NAZORATCHI: xatoni topib, **aniqlashtiruvchi prompt (follow-up)** berasiz.
- Chapda Gemini natijasi: «Bosh sahifani qurib bo'ldim!», kartalarda «narx?».
- O'ngda «Aniqlashtiruvchi promptni tanlang»: ✔ Har TaomCard'ga narxni qo'sh (props.narx + " so'm") · Hammasini o'chirib, qaytadan yozdir · Kartochka rangini o'zgartir. (⛶ olindi — F-1015-377.)
- Nishon «Nice Catch!».

## 5 · Amaliyot 4 · O'z saytingiz
- Sarlavha: Endi **o'z saytingizni** boshlang.
- Mentor: G'oyani tanlang — u xuddi «Yetkaz» kabi bo'laklanadi va birinchi aniq prompt tayyor bo'ladi. Yo'l o'sha: **sahifalar → bo'limlar → takrorlanuvchi karta → prompt**.
- «G'oyani tanlang» (butun eni bo'ylab, F-1015-377): Retseptlar · O'yinlar · Kutubxona · Sport klub · + O'z g'oyam (Sayt nomi · Har kartada nima turadi?).
- Tanlangach — chapda ««G'oya» bo'laklari»: 1 Sahifalar · 2 Bo'limlar: Navbar · Hero · grid · Footer · 3 Takrorlanuvchi karta `<…Card />`; «Qadamlar · 3» (oyna): Terminalda `npm create vite@latest <papka>`, `npm install`, `npm run dev` · Promptni Gemini'ga yuboring, fayllarni joylang, `Ctrl+S` · Natijani tekshiring: biror narsa yetishmasa — aniqlashtiruvchi prompt (3-amaliyotdagidek).
- O'ngda Prompt (to'liq — Gemini darsdagi kartani ko'rmaydi): `Vite + React loyiham (<papka>) uchun «<nom>» saytining Bosh sahifasini qur.` / `Bo'limlar: Navbar, Hero, <grid> grid, Footer — har biri alohida komponent (src/components).` / `Har bo'lim: …` / `Ma'lumot: elementlar App.jsx da massiv, grid ularni map bilan <Card>'ga props orqali chizsin. Kamida 4 ta element yoz.` / `Har faylni to'liq yoz.`

## 6 · Yakuniy · amaliy (yagona ballik)
- Sarlavha: Oxirgi qadam: takrorlanuvchi **komponentni** o'zingiz yarating.
- Mentor: Bo'laklashning asosi — takrorlanuvchini komponentga aylantirish. `TaomCard` komponentini e'lon qiling: **funksiya kalit so'zi** + **nom — Katta harf bilan** + **qavs ichida parametr** + **ochuvchi jingalak qavs**.
- `TaomCard.jsx`: 1-qator — input · `return (` · `<div>{props.nom} — {props.narx}</div>` · `);` · `}` · yorliqlar: 1 kalit so'z · 2 nom — Katta harf · 3 parametr qavsda · «Natija — komponent tayyor».
- To'g'ri: `function TaomCard(props) {` (`{` siz ham; m3-03 «Birinchi komponent» dagi `function GameCard(props) {` bilan bir xil shakl — 212-qonun mos).
- Izohlar (211-qonun, F-1015-380): faqat harf farqi (`Function`, `Props`, hammasi katta) → «Deyarli to'g'ri! JavaScript **katta-kichik harfni farqlaydi**: `function` va `props` — kichik harf bilan, nom — Katta harf bilan.» · `function taomCard` → «Komponent nomi **Katta harf** bilan: `TaomCard` (React shundan komponentligini biladi).» · boshqa narsa (≥6 belgi) → «Komponent `function` kalit so'zi bilan boshlanadi — «Birinchi komponent» darsidagi `GameCard` kabi: kalit so'z, nom, qavsda `props`, ochuvchi `{`.»
- Nishon «Block Builder!».

## 7 · Podium · 8 · Yakun
- «✓ React moduli tugadi» · «N/1 to'g'ri» · Siz endi React dasturchisiz.
- «Endi siz bilasiz»: Saytni bo'laklash: sahifalar (Router) + bo'limlar (komponentlar) · Takrorlanuvchi → bitta komponent + props + map · Aniq prompt: qaysi bo'limlar + har bo'lim mazmuni + ma'lumot · Qurish → tekshirish → aniqlashtiruvchi prompt bilan tuzatish · g'oya → bo'laklash → prompt → qurish → tekshirish
- «🎓 Bitiruv vazifasi» — Endi o'z saytingizni quring: O'z saytingiz — g'oyani qog'ozga bo'laklang: sahifalar, komponentlar, birinchi bo'lim prompti · Qurib boshlang — Gemini bilan bosh sahifadan boshlab, bo'lim-bo'lim quring: har bo'limga alohida aniq prompt · Portfolio — tayyor saytni deploy qilib, do'stlaringizga ko'rsating · «Modul tugadi — lekin sizning yo'lingiz endi boshlanyapti. G'oyangiz bormi? Bugun boshlang! 🚀»
- Nishonlar (4): Prompt Sniper! · Nice Catch! · Block Builder! · Site Shipped!

## Sinov (17.10)
gates 10/12 (tell 11, emoji 3 — oldin ham) · `tekshir-m313` 28/28 · `f378-tekshir` 17/17 (⛶ 1920×1080 sig'adi; yakuniy 9 yozuv) · `ru-m313` 9/9 · tekislik 0 px · `f374-nan` 0 · matn `sinov/uz-matn-umumiy.mjs`.
