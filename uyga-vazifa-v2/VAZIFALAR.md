# Uyga vazifalar — 2–14-modul (har dars, LMS tartibida)

> Avtopilot qoralamasi, 19.10 kech → foydalanuvchi ko'radi va fidbek beradi. Qoidalar va qarorlar — `REJA.md`.
> Uslub-namuna: mentor exam (`~/mentor_exam/bank_v3/RULES.md`) + `MATN_KORPUS.md` (siz-forma, bir gap — bir fikr, o'smir hayoti).
> PM darslar ro'yxatda ko'rinadi, lekin hozircha vazifasiz («—»).

## Qisqa xulosa (19.10, avtopilot)

**101 vazifa** (PM'dan tashqari hamma dars, LMS tartibida; skript bilan sanaldi):
**T** test — 16 · **C** LMS compiler — 8 · **C+A** compiler + agent — 5 · **F/L/R** fayl / link / skrinshot (mentor) — 72.

| Modul | Vazifa | Qayerda | Kim tekshiradi |
|---|---|---|---|
| 2 | 11 | LMS compiler + VS Code/GitHub/Netlify | AI (compiler) · mentor |
| 3 | 10 | LMS compiler | AI · LMS test |
| 4–8 | 10 · 11 · 10 · 8 · 10 | o'quvchi kompyuteri, GitHub | mentor · LMS test |
| 9–10 | 5 · 6 | darsda «Maydon», uyda **o'z MVP'i** (MD'dagi «O'z g'oyangiz» qadami) | mentor |
| 11–14 | 7 · 4 · 5 · 4 | darsning o'zi o'z repo'sida → uyda **keyingi qadam** | mentor · LMS test (11-8) |

**Qanday tuzildi:** har dars uchun darsning o'zi o'qildi (kartochkalar, testlar, amaliyot bloklari a1–a3 / MD v3). Vazifa darsdagi ishni takrorlamaydi —
undan bir qadam oldinga yuradi. Birinchi qoralamada 9 ta karta darsni takrorlagani topilib, qayta yozildi (JURNAL.md).
Dars matnining o'zida rejalangan narsa bo'lsa (3-11 «Sevimli», 3-12 «Buyurtma berish», 4-11 «Sevimlilar», 8-4 agent rejasi, 12-2 README) — vazifa shunga moslandi.

**Ko'rib chiqishda e'tibor bering** (bahsli bo'lishi mumkin):
- 2-modul 10, 11 — sizning qaroringiz yo'q edi, mening tavsiyam.
- 3-12 — avval «V URL» tavsiya qilgandim; darsning o'z testi «Buyurtma berish» deydi va 3-modul compiler'da, shuning uchun C+A.
- 4-moduldan T faqat kod yozilmaydigan tushuncha darslarida; qolgani GitHub link + skrinshot.
- LMS nomi va dars mazmuni farqi: 4-8 «fetch va axios» (axios darsda yo'q — so'ralmadi) · 6-11 «Practice 1: backend + frontend» (fayl — CI lenta) · 5-8 LMS'da JWT'dan oldin.

## Kartochka tuzilishi

| Qator | Ma'nosi |
|---|---|
| **Tur** | **T** test · **C** LMS compiler (AI tekshiradi) · **C+A** compiler + LMS agenti · **F** fayl yuklash · **L** link (GitHub / Netlify / Snack) · **R** skrinshot |
| **O'quvchiga** | vazifa matni — o'quvchi aynan shuni o'qiydi (UZ; RU — qurish bosqichida) |
| **Rasm** | bormi, nima, qanday olinadi (reference yechimdan Chrome skrinshoti yoki foydalanuvchidan) |
| **Tekshiruv** | C — AI rubrikasi (10 ball; qurishda inglizchaga o'giriladi) · F/L/R — mentor ro'yxati (☐ 3–5 band) |
| **Darsdan** | vazifa tayanadigan narsa — darsda aynan o'tilgan (kartochka, test, kod) |

Test (T) uchun bu yerda: savol + ✔ to'g'ri javob + chalg'ituvchi g'oyasi. To'liq 4 variant va hintlar — qurishda.

---

## 2-modul «Men internetdaman» (LMS bo'lim 70) — ✅ turlar foydalanuvchi qarori

| # | Dars | Vazifa |
|---|---|---|
| 1 | Internet qanday ishlaydi | **T** 5 savol |
| 2 | Kim mening foydalanuvchim? (PM) | — |
| 3 | HTML asoslari | **C** html + natija rasmi |
| 4 | HTML: rasm, struktura, forma, DevTools | **C** html + natija rasmi |
| 5 | Takrorlash: HTML ustaxonasi | **C+A** login sahifa + natija rasmi |
| 6 | Struktura — foydalanuvchi uchun qulaylik (PM) | — |
| 7 | CSS asoslari | **C** html+css + natija rasmi |
| 8 | CSS: layout, flexbox, DevTools | **C+A** html+css, dizaynga boy landing |
| 9 | VS Code | **R** skrinshot |
| 10 | HTML Praktika — Portfolio sayt | **R + F** — rasm + «Ko'nikmalarim» *(tavsiya)* |
| 11 | CSS Praktika — Demo Day saytini bezaymiz | **R** — AI yozgan CSS'ni o'zi o'zgartiradi *(tavsiya)* |
| 12 | Git va GitHub | **L** GitHub repo linki |
| 13 | Netlify va deploy | **L** Netlify linki |
| 14 | Demo Day — 3 daqiqalik nutq (PM) | — |

### 2-1 · Internet qanday ishlaydi — T (5 savol)
- **Darsdan:** brauzer (topadi → olib keladi → chizadi), domen va zona (.com, .uz, .org), IP manzil, DNS («telefon kitobi»),
  server (doim yoniq), server HTML kod yuboradi, tartib Brauzer → DNS → Server → Ekran, xato domen.
- **Savollar** (darsdagi misollardan boshqa saytlar bilan — takror emas):
  1. «kun.uz yozib Enter bosdingiz. Sahifa qaysi tartibda keladi?» ✔ Brauzer → DNS → Server → Ekran · chalg'ituvchi: DNS va Server o'rni almashgan.
  2. «Qaysi biri IP manzil?» ✔ `185.74.5.120` · chalg'ituvchi: `kun.uz`, `.uz`, `www.kun.uz`.
  3. «DNS brauzerga nima beradi?» ✔ domenning IP manzilini · chalg'ituvchi: sahifaning HTML kodi (bu serverning ishi).
  4. «Server brauzerga nima yuboradi?» ✔ HTML kod · chalg'ituvchi: tayyor sahifa rasmi, IP manzil.
  5. **Rasmli:** Chrome'ning «This site can't be reached» oynasi, manzil qatorida bitta harfi tushgan domen
     (masalan `youtbe.com`; qurishda domen haqiqatan ochilmasligi tekshiriladi — ba'zi xato domenlar sotib olingan bo'ladi).
     «Sayt nega ochilmadi?» ✔ domen xato yozilgan · chalg'ituvchi: internet o'chgan, server uxlab qoldi.
- **Rasm:** 1 ta — haqiqiy Chrome xato oynasi `coddycmp.uz` (DNS topmaydi, tekshirildi). To'liq savollar: `data/testlar.json`.
- **Tekshiruv:** LMS avtomat.

### 2-3 · HTML asoslari — C (html) + natija rasmi
- **Darsdan:** skelet (shablon): `<!DOCTYPE html>`, html/head/body, title), h1–h6, p, ul/ol/li, a + href, strong, em.
- **O'quvchiga:** «Sevimli o'yiningiz haqida sahifa yasang. Rasmdagi natijaga o'xshasin.»
  1. To'liq HTML shablonini yozing; `title` ga o'yin nomini qo'ying.
  2. `h1` — o'yin nomi. Ostida ikkita `h2`: «Nega yoqadi?» va «Qanday o'ynaladi?».
  3. «Nega yoqadi?» ostida `ul` — 3 ta sabab.
  4. «Qanday o'ynaladi?» ostida `ol` — 3 ta qadam.
  5. Bitta `p` yozing: unda bitta so'z `strong`, bitta so'z `em` bilan bo'lsin.
  6. Oxirida o'yinning rasmiy saytiga link (`a`, `href` da to'liq manzil).
- **Starter:** bo'sh fayl (shablonni o'quvchi o'zi yozadi — darsning asosiy ko'nikmasi).
- **Rasm:** reference sahifa (masalan Brawl Stars) — Chrome skrinshoti.
- **Tekshiruv (AI, 10):** shablon + title 2 · h1 + ikki h2 2 · ul 3 li 1.5 · ol 3 li 1.5 · p ichida strong va em 1.5 · a + to'liq href 1.5.
  O'yin nomi va matn erkin — jazolanmaydi.

### 2-4 · HTML: rasm, struktura, forma — C (html) + natija rasmi
- **Darsdan:** img (src, alt, yopuvchisiz), header/main/footer, div, form, label, input (type: text, email, password), button, DevTools (F12).
- **O'quvchiga:** «Sport to'garagiga yozilish sahifasini yasang. Rasmdagidek uch qismdan iborat bo'lsin.»
  1. `header` ichida `h1` — to'garak nomi.
  2. `main` ichida rasm: `src` — vazifadagi manzil, `alt` — rasmda nima borligi.
  3. Rasm ostida `form`: «Ismingiz» (`text`), «Email» (`email`), «Parol» (`password`). Har maydon oldida `label`.
  4. Forma oxirida «Yozilish» tugmasi (`button`).
  5. `footer` ichida telefon raqam va «© 2026».
- **Starter:** HTML shablon tayyor, body bo'sh; rasm manzili vazifa matnida beriladi (barqaror manzil — qurishda tanlanadi).
- **Rasm:** reference sahifa skrinshoti.
- **Tekshiruv (AI, 10):** header+h1 1.5 · main ichida img + mazmunli alt 2 · form ichida 3 input + to'g'ri type 3 · har input'ga label 1.5 · button 1 · footer 1.

### 2-5 · Takrorlash: HTMLda ishlash — C+A + natija rasmi
- **Qaror:** login sahifa; vazifada LMS compiler'dagi AI-agent borligi aytiladi → o'quvchi chiroyli, animatsiyali qiladi. Rasm — namuna yechimdan (foydalanuvchi 21.10: «o'zing qil»).
- **Darsdan:** h1, p, ul/li, strong, a + href, img (src, alt), input, label, body/head.
- **O'quvchiga:** «Rasmdagi kirish (login) sahifasini yasang. HTML'ni o'zingiz yozing. Ranglar va harakatni compiler'dagi
  AI-agentga yozdiring — unga rasmda nima borligini aniq ayting.»
  1. Logotip: `img` + `alt`.
  2. `h1` — «Xush kelibsiz» (yoki rasmdagi sarlavha).
  3. `form`: «Email» (`email`) va «Parol» (`password`), har birida `label`.
  4. «Kirish» tugmasi.
  5. «Parolni unutdingizmi?» — link (`a`).
- **Rasm:** namuna yechim skrinshoti — logotip, sarlavha, Email, Parol, «Kirish», «Parolni unutdingizmi?» (uz + ru).
- **Tekshiruv (AI, 10):** HTML qismi 7 (img+alt 1 · h1 1 · form + 2 input to'g'ri type 2 · label 1.5 · button 0.5 · link 1) ·
  rasmga o'xshashlik 2 (qismlar tartibi 1 · rang 1) · animatsiya/harakat bor 1 (`@keyframes` yoki ishlaydigan `transition`). Agent yozgan CSS jazolanmaydi.

### 2-7 · CSS asoslari — C (html+css) + natija rasmi
- **Darsdan:** selektor (teg, `.class`, `#id`), xususiyat : qiymat ;, color, background-color, font-size, font-family,
  font-weight: bold, text-align: center, padding (ichki), margin (tashqi), rang `#FF4D26` ko'rinishida, tashqi style.css.
- **O'quvchiga:** «Kino afishasi tayyor HTML'da turibdi. style.css ga qoidalar yozib, rasmdagidek qiling.»
  1. `body` — fon rangi `#F4F4F4`, shrift `Arial`.
  2. `.card` — fon oq, ichki bo'shliq `24px`, tashqi bo'shliq `40px`.
  3. `#title` — rang `#FF4D26`, o'lcham `32px`, markazda.
  4. `.genre` — qalin.
  5. `p` — o'lcham `18px`.
- **Starter:** index.html tayyor (div.card, h1#title, p.genre, p×2) + bo'sh style.css (ulangan).
- **Rasm:** reference skrinshot.
- **Tekshiruv (AI, 10):** har band 2 ball; qiymatlar aniq (rang hex katta-kichik harf farqi jazolanmaydi; `background` ham qabul).

### 2-8 · CSS: layout, flexbox — C+A (html+css) + natija rasmi
- **Qaror:** dizaynga boy, animatsiyali loyiha; compiler agentidan foydalanadi.
- **Darsdan:** `display: flex` konteynerga, flex-direction row/column, gap, justify-content (center, space-between),
  align-items: center, block vs inline, DevTools Styles.
- **O'quvchiga:** «O'zingiz yoqtirgan mavzuda (o'yin, sport jamoasi, musiqachi) bitta sahifali sayt yasang.
  Flex qoidalarini o'zingiz yozing. Ranglar, soya va harakatni AI-agent bilan qo'shing.»
  1. `.menu` — logotip chapda, linklar o'ngda (`space-between`), vertikal markazda.
  2. `.cards` — 3 ta kartochka bir qatorda, orasida `gap: 16px`.
  3. Har `.card` ichida sarlavha, matn va tugma ustma-ust (`column`).
  4. `.footer` — matn gorizontal markazda.
- **Rasm:** reference skrinshot (flex joylashuvi ko'rinadi).
- **Tekshiruv (AI, 10):** .menu flex+space-between+center 3 · .cards flex+gap 2.5 · .card column 2 · .footer center 1.5 · dizayn/animatsiya 1.
  Flex qoidalari `.menu/.cards/.card/.footer` da bo'lishi shart; agent yozgan qolgan CSS jazolanmaydi.

### 2-9 · VS Code — R (skrinshot)
- **Qaror:** VS Code'ni o'rnatib, kichik HTML+CSS saytcha qiladi, skrinshot yuklaydi.
- **Darsdan:** code.visualstudio.com, Explorer/Editor/Extensions, Live Server + «Go Live», `127.0.0.1:5500`, `!` + Enter (Emmet),
  Ctrl+S, alohida papka (`my-site`), index.html + style.css, `<link rel="stylesheet" href="style.css">`, `.card`.
- **O'quvchiga:** «Uy kompyuteringizda saytcha yasang.»
  1. VS Code va Live Server'ni o'rnating.
  2. `my-card` papkasini oching, ichida `index.html` va `style.css`.
  3. `index.html` da o'zingiz haqingizda kartochka: rasm, ism (`h2`), 2 gap (`p`).
  4. `style.css` ni ulang va kartochkani bezang (fon, padding, markaz).
  5. «Go Live» bosing va skrinshot oling: chapda Explorer'dagi ikkala fayl, yonida brauzer.
- **Tekshiruv (mentor):** ☐ Explorer'da index.html va style.css · ☐ brauzer manzili `127.0.0.1:5500` · ☐ kartochkada rasm, ism, matn
  · ☐ CSS ishlagan (fon/bo'shliq ko'rinadi).

### 2-10 · HTML Praktika — Portfolio sayt — R + F *(tavsiya)*
- **Darsdan:** A1 — header va «Men haqimda» (Gemini prompti, Live Server); A2 — menu, linklar, «Loyihalarim» (3 loyiha), «Aloqa» (pochta linki);
  A3 — dizayn; A4 — yaxshilash. Ya'ni loyihalar va pochta linki darsda qilingan.
- **Nega shu:** portfolio 11 → 12 → 13-darslarda davom etadi — uyda ham o'sha sayt; yangi qism HTML 2-darsidagi `img` va `alt` ni ishlatadi.
- **O'quvchiga:** «Portfolio'ingizga ikki narsa qo'shing. AI ishlatmang, o'zingiz yozing.»
  1. Header'ga o'z rasmingiz yoki avataringiz (`img`, mazmunli `alt`).
  2. «Ko'nikmalarim» bo'limi: `id="konikmalar"`, ichida 4 bandli ro'yxat.
  3. Menu'ga shu bo'limga link (`href="#konikmalar"`).
  4. Har loyiha ostiga bir gaplik tavsif (`p`).
  5. Live Server skrinshoti va `index.html` faylini yuklang.
- **Tekshiruv (mentor):** ☐ img + alt · ☐ bo'lim `id` va 4 `li` · ☐ menu linki ishlaydi (`#` nomi bir xil) · ☐ loyihalarda tavsif · ☐ skrinshot va fayl bir xil.

### 2-11 · CSS Praktika — Demo Day sayti — R *(tavsiya)*
- **Darsdan:** A1 — Demo Day bosh sahifasi HTML'i (Gemini); A2 — uslub tanlab, `style.css` ni Gemini yozadi; o'tilgan xossalar: color, background-color,
  font-family, font-size, font-weight, text-align, padding, margin + display: flex, gap, justify-content, align-items; DevTools (F12 → Styles).
- **Nega shu:** darsda dizaynni AI yozdi — uyda o'quvchi o'sha CSS'ni o'qib, o'zi o'zgartiradi (o'tilgan xossalar bilan).
- **O'quvchiga:** «AI yozgan style.css'ni endi o'zingiz o'zgartiring.»
  1. F12 → Styles'da sinab ko'ring, keyin 3 ta o'zgarishni `style.css` ga o'zingiz yozing: asosiy rang, kartochkalar orasidagi `gap`, kartochka ichidagi `padding`.
  2. `style.css` tepasiga izoh: qaysi 3 qatorni o'zgartirdingiz.
  3. Oldin va keyin skrinshotlari.
  4. Saytda yana qaysi 3 sahifa bo'lishini yozing — 13-darsda ularni qo'shasiz.
- **Tekshiruv (mentor):** ☐ oldin/keyin farqi ko'rinadi · ☐ izohda 3 o'zgarish · ☐ o'zgarishlar o'tilgan xossalar bilan · ☐ 3 sahifa nomi.

### 2-12 · Git va GitHub — L (repo linki)
- **Qaror:** GitHub'da repo ochib, kichik loyihasini joylaydi, linkini yuklaydi.
- **Darsdan:** Git (kompyuterda) vs GitHub (sayt), repo, `git --version`, `git add .` → `git commit -m "…"` → `git push`, `git pull`, README.
  Darsda fayl GitHub sahifasi orqali qo'yilgan; Git'ni uyda o'rnatish aytilgan.
- **O'quvchiga:** «Git'ni o'rnating va loyihangizni GitHub'ga terminaldan yuboring.»
  1. `git --version` bilan Git o'rnatilganini tekshiring.
  2. GitHub'da ochiq (public) repo oching; ichida `index.html` va `README.md` bo'lsin.
  3. README'ga loyiha nomi va u haqida 1–2 gap yozing.
  4. Kamida 2 ta commit qiling — kamida bittasi terminaldan, `-m` bilan aniq izohli.
  5. Repo linkini yuklang.
- **Tekshiruv (mentor):** ☐ link ochiladi (public) · ☐ index.html va README bor · ☐ commitlar ≥ 2, izohlari ma'noli · ☐ README'da loyiha haqida gap.

### 2-13 · Netlify va deploy — L (Netlify linki)
- **Qaror:** Demo Day saytining chala joylarini to'ldiradi, URL'ni LMS'ga yuklaydi.
- **Darsdan:** Netlify — fayllarni doim yoniq kompyuterda saqlab, link beradi; GitHub'dan Import; o'zgarish push bilan yangilanadi;
  sahifalar menu linklari bilan ulanadi; AI'ga sayt topshirig'ini aniq yozish.
- **O'quvchiga:** «Demo Day saytingizni tugatib, internetga chiqaring.»
  1. 11-darsda yozgan 3 sahifani qo'shing; har sahifada bir xil menu.
  2. Har sahifada mazmun bo'lsin — bo'sh sahifa qolmasin.
  3. O'zgarishlarni GitHub'ga yuboring — Netlify o'zi yangilaydi.
  4. Linkni telefonda ochib tekshiring.
  5. `https://….netlify.app` linkini yuklang.
- **Tekshiruv (mentor):** ☐ link ochiladi (telefonda ham) · ☐ kamida 4 sahifa, menu hammasida ishlaydi · ☐ bo'sh sahifa yo'q · ☐ Demo Day g'oyasi (nom, muammo) bosh sahifada.

---

## 3-modul «Sistemalar qanday o'ylaydi» (LMS bo'lim 73) — JS konsolda; hamma vazifa LMS compiler'da

| # | Dars | Vazifa |
|---|---|---|
| 1 | Sistema va Algoritm | ✅ **T** 3 savol + 1 rasmli (blok-sxema) |
| 2 | Muammo - Yechim (PM) | — |
| 3 | JS: O'zgaruvchilar | **C** js — o'yinchi profili |
| 4 | JS: Shart operatorlari | **C** js — baho, PIN, zaryad |
| 5 | JS: Sikllar | **C** js — narxlar ro'yxati va jamg'arma |
| 6 | JS: Funksiya va Massiv | **C** js — zarar, jon, jami(massiv) |
| 7 | Ilk mahsulot: MVP/Backlog (PM) | — |
| 8 | Practice: HTML-CSS-JS | **C** html+js + natija rasmi — 3 imkoniyat |
| 9 | Practice: AI-Agent 1 | **C+A** — promo sahifaga «Tariflar» bo'limi (prompt + tanlash) |
| 10 | Frontend va Backend | **T** 5 savol (1 sxema rasmi) |
| 11 | Practice: AI-Agent 2 | **C+A** — katalogga «Sevimli ♥» |
| 12 | Practice: MVP tayyor | **C+A** — «Buyurtma berish» tugmasi |
| 13 | Pre Demo Day: Pitch (PM) | — |

### 3-1 · Sistema va Algoritm — T (3 savol + 1 rasmli) ✅
- **Darsdan:** sistema = komponentlar + bog'lanishlar (futbol jamoasi); algoritm = qadamlar tartibi; shart («agar… bo'lsa»); sikl (takror); shart tanlaydi, sikl takrorlaydi.
- **Savollar** (darsdagi non-murabbo, soyabon, o'tirib-turish misollaridan boshqa):
  1. **Tartib:** «Choy damlash qadamlari aralashib ketdi. To'g'ri tartib qaysi?» ✔ suvni qaynatish → choynakka choy solish → qaynoq suv quyish → 5 daqiqa kutish ·
     chalg'ituvchilar: suv quyish choydan oldin, kutish boshida.
  2. **Shart:** «"Zaryad 20% dan kam bo'lsa — quvvatlagichga ulang". Bu qaysi tushuncha?» ✔ shart · chalg'ituvchi: sikl, ketma-ket qadam, komponent.
  3. **Shart yoki sikl:** «Qaysi qadam sikl?» ✔ «3-qavatgacha zinaning har pog'onasiga bittadan qadam qo'ying» ·
     chalg'ituvchilar: «Eshik qulf bo'lsa — kalitni oling» (shart), «Avval poyabzal, keyin kurtka» (tartib), «Velosipedda g'ildirak, rul, pedal bor» (sistema).
  4. **Rasmli (blok-sxema):** Boshlash → «Yomg'ir yog'yaptimi?» → Ha: soyabon oling / Yo'q: kepka kiying → Ko'chaga chiqing.
     «Yomg'ir yog'masa, sxema bo'yicha nima qilasiz?» ✔ kepka kiyaman · chalg'ituvchi: soyabon olaman, uyda qolaman, ikkalasini olaman.
- **Rasm:** blok-sxema — HTML/SVG'da chizib, Chrome skrinshoti (shakllari: oval — boshlash, romb — shart, to'rtburchak — qadam).

### 3-3 · JS: O'zgaruvchilar — C (js)
- **Darsdan:** o'zgaruvchi = nomlangan quti; `let` (o'zgaradi), `const` (o'zgarmaydi, qayta berilsa xato), `var` eski; `=` — «sol»;
  string (qo'shtirnoqda), number, boolean; `"14"` — matn; nom raqam bilan boshlanmaydi, bo'sh joysiz; `console.log`.
- **O'quvchiga:** «O'yinchi profilini o'zgaruvchilarda saqlang va konsolga chiqaring.»
  1. `const` bilan `playerName` (ismingiz, matn) va `birthYear` (son) oching.
  2. `let` bilan `score = 0` va `isOnline = true` oching.
  3. Ballni ikki marta yangilang: avval `50` qiling, keyin `score = score + 25`.
  4. Konsolga to'rt qator chiqaring: ism, tug'ilgan yil, ball, onlayn holati.
- **Kutilgan chiqish (namuna):** `Aziza` · `2011` · `75` · `true`.
- **Tekshiruv (AI, 10):** const ikki qiymatga 2 · let ikki qiymatga 2 · tur to'g'ri (ism qo'shtirnoqda, yil va ball qo'shtirnoqsiz, boolean) 2 ·
  ball ikki qadamda yangilangan va 75 2 · 4 ta console.log 2. Ism va yil erkin.

### 3-4 · JS: Shart operatorlari — C (js)
- **Darsdan:** if / else / else if; `> < >= <=`, `==`, `!=` (`===` ko'rsatilgan); `=` beradi, `==` tekshiradi; faqat bitta blok ishlaydi;
  misollar: PIN-kod, zaryad, baho (90+ → 5, 70+ → 4, 60+ → 3, qolgani → 2).
- **O'quvchiga:** «Uchta kichik tekshiruv yozing.»
  1. `let score = 78;` — baho chiqaring: 90 va undan yuqori → «Baho: 5», 70+ → «Baho: 4», 60+ → «Baho: 3», qolgani → «Baho: 2».
  2. `let pin = 1234; let entered = 1111;` — teng bo'lsa «Telefon ochildi», aks holda «PIN noto'g'ri».
  3. `let battery = 15;` — 20 dan kichik bo'lsa «Zaryad kam!», aks holda «Zaryad yetarli».
  4. `score` ni `95`, `61`, `40` qilib sinab ko'ring — har safar to'g'ri baho chiqsin. Sinab bo'lgach, `score` ni yana `78` ga qaytaring.
- **Kutilgan chiqish:** `Baho: 4` · `PIN noto'g'ri` · `Zaryad kam!`.
- **Tekshiruv (AI, 10):** baho zanjiri else if bilan, chegaralar `>=` 4 · PIN `==`/`===` bilan (`=` emas) 2 · zaryad `<` 2 · chiqish aniq 2.

### 3-5 · JS: Sikllar — C (js)
- **Darsdan:** for (boshlanish; shart; qadam), `i++`, while (shart rost turguncha), cheksiz sikl, massiv, indeks 0 dan, `.length`, `i < massiv.length`.
- **O'quvchiga:** «Do'kon narxlari bilan ishlang.»
  1. `const prices = [12000, 8000, 15000, 5000];`
  2. `for` bilan har narxni chiqaring: «1-mahsulot: 12000 so'm» … «4-mahsulot: 5000 so'm».
  3. Yana bir `for` bilan jamini hisoblang: «Jami: 40000 so'm».
  4. `while`: kuniga 3000 so'm yig'asiz. 20000 ga yetguncha necha kun ketadi? «7 kunda 21000 so'm».
  5. Shartda `4` yozmang — `prices.length` ishlating.
- **Tekshiruv (AI, 10):** 1-sikl va raqamlash (i+1) 3 · jami sikl bilan 3 · while to'g'ri to'xtaydi, natija 7 kun / 21000 2 · `.length` ishlatilgan 2.

### 3-6 · JS: Funksiya va Massiv — C (js)
- **Darsdan:** `function`, chaqirish `nom()`, parametr va argument, `return`, return yo'q → undefined, `console.log` vs `return`,
  ikki parametr vergul bilan; darsning o'yin ipi: `zarar(kuch, bonus)` = `kuch * 3 + bonus`.
  Massiv shu darsda o'tilmaydi — 5-darsdagi (Sikllar) massiv va for ishlatiladi; LMS nomi «Funksiya va Massiv».
- **O'quvchiga:** «O'yin hisobi uchun uchta funksiya yozing.»
  1. `zarar(kuch, bonus)` — `kuch` — urish kuchi, `bonus` — krit bonus. Funksiya `kuch * 3 + bonus` ni qaytarsin.
  2. `jon(qoldi, urilgan)` — `qoldi` — qahramonda qolgan jon, `urilgan` — kelgan zarba. Funksiya `qoldi - urilgan` ni qaytarsin; natija 0 dan kichik bo'lsa `0` qaytarsin — jon minusga tushmaydi.
  3. `jami(narxlar)` — `narxlar` — sonlar massivi. Funksiya `for` bilan hamma sonni qo'shib, yig'indini qaytarsin.
  4. Natijani o'zgaruvchiga saqlab chiqaring: `zarar(5, 10)` → 25, `jon(100, 25)` → 75, `jon(20, 25)` → 0, `jami([12000, 8000, 5000])` → 25000.
  5. Funksiya ichida `console.log` emas, `return` bo'lsin.
- **Tekshiruv (AI, 10):** zarar 2 · jon + manfiy holat 3 · jami for bilan 3 · natijalar saqlanib chiqarilgan, return bilan 2.

### 3-8 · Practice: HTML-CSS-JS — C (html+js) + natija rasmi
- **Darsdan:** HTML — tuzilish, CSS — ko'rinish, JS — harakat; hodisa (click, input, mouseover) → reaksiya → o'zgarish; like sanagich
  (`son = son + 1`), tungi rejim, ko'rsat/yashir, jonli salom, forma tekshiruvi (bo'sh → «Ism kiriting»). Darsda o'quvchi o'z saytiga
  tungi rejim va like qo'shgan — uyda qolgan uchtasi.
- **O'quvchiga:** «Profil sahifasi tayyor. script.js ga uch imkoniyat qo'shing (compiler'dagi AI-agentdan yordam olsangiz bo'ladi —
  lekin har qatorini tushunib oling).»
  1. «Ko'rsat / yashir» tugmasi bosilsa, «Men haqimda» bloki yashirinadi; yana bosilsa — chiqadi.
  2. Ism maydoniga yozganingiz sari ostida «Salom, <ism>!» yangilanib tursin.
  3. «Yuborish» bosilganda: ism bo'sh bo'lsa — «Ism kiriting», aks holda — «Rahmat, <ism>!».
- **Starter:** index.html (#about, #toggle, #name, #greet, #send, #msg) + style.css tayyor; script.js bo'sh.
- **Rasm:** reference sahifa skrinshoti (ism yozilgan holatda).
- **Tekshiruv (AI, 10):** ko'rsat/yashir click bilan ikki tomonga 3 · input hodisasida jonli salom 3 · bo'sh tekshiruvi if/else 3 · sahifa qayta yuklanmaydi 1.

### 3-9 · Practice: AI-Agent 1 — C+A
- **Darsdan:** o'quvchi o'z mavzusiga promo sahifa qurgan: 4 qismli prompt (mavzu · uslub · rang · bo'limlar) → maket; iteratsiya; Copilot bilan bitta bo'lim.
  «Chiroyli qil» — noaniq; «AI tezlik beradi, sifatni siz ta'minlaysiz». Oldingi darsdan (Practice: HTML-CSS-JS): hodisa → reaksiya → o'zgarish.
- **Nega shu:** darsdagi promo sahifani takrorlamaydi — unga ikki darsni birlashtiradigan yangi bo'lim qo'shiladi.
- **O'quvchiga:** «Promo sahifangizga "Tariflar" bo'limini compiler'dagi AI-agent bilan qo'shing.»
  1. Agentga bo'lim uchun aniq prompt yozing: nechta karta, har kartada nima (nom, narx, 3 ta imkoniyat), qaysi rang va uslub.
  2. Promptni `index.html` tepasiga izoh qilib qo'ying: `<!-- prompt: … -->`.
  3. 3 ta tarif kartasi, har birida «Tanlash» tugmasi.
  4. «Tanlash» bosilsa, o'sha karta ajralib tursin, pastda «Siz tanladingiz: <nom>» chiqsin; boshqasini tanlasa — almashsin.
  5. Natija bir urinishda chiqmasa — ikkinchi, aniqlashtiruvchi promptni ham izohga qo'shing.
- **Starter:** darsdagidek oddiy promo sahifa (sarlavha, tugma, 3 karta) — tayyor.
- **Tekshiruv (AI, 10):** promptda karta soni, mazmuni va uslubi aniq 3 · 3 ta tarif kartasi 2 · tanlash bitta kartani ajratadi va almashadi 3 · «Siz tanladingiz» matni 1 · uslub promptga mos 1.

### 3-10 · Frontend va Backend — T (5 savol, 1 rasmli)
- **Darsdan:** frontend (ko'rinadigan, zal) / backend (server + baza, oshxona); React — ko'rinish bloklari; Node.js — JS serverda; Express — so'rov yo'li
  (ofitsiant); PostgreSQL — doimiy ombor; izoh bazaga yozilmasa yo'qoladi; so'rov (request); stack.
- **Savollar:**
  1. «Telegram'dagi "Yuborish" tugmasi qaysi qism?» ✔ frontend · chalg'ituvchi: backend, baza, server.
  2. «Izoh yozdingiz, sahifani yangiladingiz — izoh yo'qoldi. Nega?» ✔ izoh bazaga yozilmagan · chalg'ituvchi: brauzer eski, internet sekin.
  3. «Foydalanuvchilar ro'yxati yillar davomida qayerda saqlanadi?» ✔ PostgreSQL (baza) · chalg'ituvchi: React, brauzer, Express.
  4. **Rasmli sxema:** Brauzer (React) → [ ? ] → PostgreSQL. «Bo'sh joyda nima turadi?» ✔ Node.js + Express (server) · chalg'ituvchi: yana React, Wi-Fi, DNS.
  5. «"Stack" nima?» ✔ bir loyihada birga ishlaydigan texnologiyalar to'plami · chalg'ituvchi: bitta dastur nomi, baza turi.
- **Rasm:** sxema — HTML/SVG'da chizilib skrinshot.

### 3-11 · Practice: AI-Agent 2 — C+A
- **Darsdan:** dekompozitsiya, MVP, reja → agent; jonli katalog: massiv + for (kartochkalar), if (toifa tugmalari), qidiruv.
  Darsning o'zida rejalangan: **«Sevimli» — har kartochkaga ♥ tugmasi** (dars fayli, PracticeLesson3.jsx:1403).
- **O'quvchiga:** «Mini-do'kon katalogiga "Sevimli" qo'shing. Avval rejani yozing, keyin AI-agentga bitta qadam — bitta so'rov bering.»
  1. `script.js` tepasiga izoh qilib reja yozing: qanday qadamlar, qaysi tartibda.
  2. Har kartochkada ♥ tugmasi: bosilsa qizil bo'ladi, yana bosilsa oq bo'ladi.
  3. Tepada «Sevimli: N» soni yangilanib tursin.
  4. «Faqat sevimlilar» tugmasi faqat ♥ bosilgan kartochkalarni ko'rsatsin.
- **Starter:** katalog tayyor (massiv 6 mahsulot, for bilan kartochkalar, toifa tugmalari).
- **Tekshiruv (AI, 10):** reja izohda, kamida 3 qadam 2 · ♥ ikki holat 3 · son to'g'ri yangilanadi 2 · filtr 3.

### 3-12 · Practice: MVP tayyor — C+A
- **Darsdan:** katalog → savat (massiv + push) + jami (for, funksiya); bug: narx matn bo'lib qolgan (`"3000"` → «03000»); debugging
  (nima noto'g'ri va qanday kerak deb aytish); deploy (Netlify). Darsning o'z testi: uyga vazifada do'konga **«Buyurtma berish»** tugmasi qo'shiladi (PracticeLesson4.jsx:1778).
- **O'quvchiga:** «Do'koningizga "Buyurtma berish" tugmasini qo'shing.»
  1. Savat bo'sh bo'lsa, tugma bosilganda «Savat bo'sh» chiqsin.
  2. Savatda mahsulot bo'lsa: «Buyurtma qabul qilindi: N so'm» chiqsin, savat tozalanib, jami 0 bo'lsin.
  3. Jami doim son bo'lib hisoblansin — «03000» kabi xato chiqmasin.
  4. Agar AI xato qilsa, unga nima noto'g'ri va qanday bo'lishi kerakligini yozing; o'sha so'rovni `script.js` tepasiga izoh qilib qo'ying.
- **Starter:** do'kon tayyor (katalog, savat, jami).
- **Tekshiruv (AI, 10):** bo'sh savat holati 2 · buyurtma xabari aniq summa bilan 3 · savat va jami tozalanadi 3 · jami son (Number) 2.

---

## 4-modul «Frontend — React» (LMS bo'lim 74) — o'quvchi kompyuterida (VS Code + Vite); topshirish: GitHub link (yoki fayl) + skrinshot; mentor tekshiradi

Umumiy: har React vazifasi alohida GitHub repo yoki bitta repo'da alohida papka. Mentor uchun har vazifada skrinshot ham so'raladi —
link ochib, loyihani ishga tushirmasdan ham natijani ko'rish uchun.

| # | Dars | Vazifa |
|---|---|---|
| 1 | React intro | **T** 5 savol (1 rasmli) |
| 2 | User Story (PM) | — |
| 3 | React: 1-komponent | **L + R** — GameCard 3 marta, props bilan |
| 4 | useState va useEffect | **L + R** — like, sevimli, sahifa sarlavhasi |
| 5 | Impact vs Effort (PM) | — |
| 6 | Props orqali ma'lumot uzatish | **L + R** — massivdan katalog `map` bilan |
| 7 | CRUD | **L + R** — nomni tahrirlash, «Faqat Top», bo'sh holatlar |
| 8 | fetch va axios | **L + R** — serverdan ro'yxat: yuklanish, xato |
| 9 | POST, PUT, DELETE | **L + R** — forma → POST, tahrir → PUT, o'chir → DELETE |
| 10 | Loyiha tayyorligini aniqlash (PM) | — |
| 11 | React Router | **L + R** — «Sevimlilar» sahifasi |
| 12 | React practice 1 (AvtoIjara) | **L + R** — «Qo'shish» sahifasi + saralash |
| 13 | React practice 2 (istalgan sayt) | **L** — o'z saytining bo'laklari, 2 aniq prompt, 2 bo'lim |
| 14 | Pre Demo Day: Storytelling (PM) | — |

### 4-1 · React intro — T (5 savol, 1 rasmli)
- **Darsdan:** React — JavaScript kutubxonasi (til emas), interfeys quradi; Facebook, 2013; komponent — qayta ishlatiladigan bo'lak,
  ichma-ich; Virtual DOM — xotiradagi nusxa, eskisi bilan solishtirib faqat farqni yangilaydi; React Native — telefon ilovasi.
- **Savollar:**
  1. «React nima?» ✔ interfeys quradigan JavaScript kutubxonasi · chalg'ituvchi: yangi dasturlash tili, brauzer, server.
  2. **Rasmli:** 6 ta bir xil ko'rinishdagi o'yin kartochkasi (nomi va rasmi har xil). «React'da bular qanday yasaladi?»
     ✔ bitta komponent 6 marta, har biriga boshqa ma'lumot · chalg'ituvchi: 6 ta alohida komponent, bitta katta HTML.
  3. «Kartochkada like bosildi. React nimani yangilaydi?» ✔ faqat like sonini · chalg'ituvchi: butun sahifani, kartochkalar ro'yxatini.
  4. «Virtual DOM yangi nusxani nima bilan solishtiradi?» ✔ eski nusxa bilan · chalg'ituvchi: serverdagi sahifa, CSS fayl.
  5. «React bilimi bilan telefon ilovasi nima orqali yasaladi?» ✔ React Native · chalg'ituvchi: Virtual DOM, Vite, JSX.
- **Rasm:** kartochkalar to'ri — React'da render qilinib skrinshot.

### 4-3 · React: 1-komponent — L + R
- **Darsdan:** `npm create vite@latest` → `npm install` → `npm run dev` → `localhost:5173`; App.jsx; JSX (className, `{ }`, bitta tashqi teg);
  komponent = katta harfli funksiya, JSX qaytaradi; `<GameCard name="…" />`; props. Darsdagi ip — robo-games.
- **O'quvchiga:** «Sevimli o'yinlaringiz uchun kartochka komponentini yasang.»
  1. Vite bilan yangi loyiha oching.
  2. `GameCard` komponentini alohida faylda yozing: o'yin nomi, emoji va reyting (props orqali).
  3. App'da uni 3 marta, har xil ma'lumot bilan chaqiring.
  4. Kartochkaga `className` bilan stil bering.
  5. GitHub'ga yuklang. Linkni va `localhost:5173` skrinshotini topshiring.
- **Tekshiruv (mentor):** ☐ `GameCard.jsx` alohida fayl, nomi katta harfda · ☐ App'da 3 ta chaqiruv, props har xil · ☐ `class` emas `className`
  · ☐ skrinshotda 3 ta har xil kartochka.

### 4-4 · useState va useEffect — L + R
- **Darsdan:** `const [likes, setLikes] = useState(0)`; `setLikes(likes + 1)` → qayta chizish; `likes = likes + 1` ishlamaydi;
  bir nechta state; `useEffect(…, [])` bir marta, `useEffect(…, [likes])` har o'zgarishda; `document.title`; Mount/Update/Unmount.
- **O'quvchiga:** «GameCard'ni jonlantiring.»
  1. 👍 tugmasi: har bosilganda like soni bittaga oshsin (`useState`).
  2. «⭐ Sevimli» tugmasi: bosilsa yoqiladi, yana bosilsa o'chadi (`true/false` state).
  3. Brauzer tabidagi sarlavha like soni bilan yangilansin: «12 like» (`useEffect`, `[likes]`).
  4. Konsolga kartochka birinchi chiqqanda bir marta «Kartochka chiqdi» yozilsin (`useEffect`, `[]`).
  5. Link va skrinshot (bir nechta like bosilgan holat, tab sarlavhasi ko'rinsin).
- **Tekshiruv (mentor):** ☐ likes `setLikes` bilan oshadi · ☐ sevimli boolean state · ☐ title `[likes]` effektida · ☐ `[]` effekti bir marta.

### 4-6 · Props orqali ma'lumot uzatish — L + R
- **Darsdan:** atribut → props; bir nechta props; oqim faqat pastga (App → GameCard); props read-only; ma'lumot massivda;
  `games.map(…)`; `{ }` — o'zgaruvchidan qiymat; massivga qo'shilsa kartochka o'zi chiqadi.
- **O'quvchiga:** «Kartochkalarni qo'lda yozmang — ro'yxatdan chiqaring.»
  1. App'da 6 ta o'yinli massiv: `name`, `players`, `emoji`.
  2. `games.map(...)` bilan har o'yinga `GameCard` chizing; `key` bering.
  3. Har o'yinga 4-ma'lumot qo'shing — `genre` (janr) — va GameCard uni ko'rsatsin.
  4. Massivga 7-o'yinni qo'shing — map qatoriga tegmasdan kartochka chiqsin.
  5. Link va skrinshot.
- **Tekshiruv (mentor):** ☐ massiv + map, qo'lda yozilgan GameCard yo'q · ☐ key bor · ☐ janr props orqali keladi · ☐ 7 ta kartochka.
- *Izoh:* shartli ko'rsatish (`&&`, `? :`) Props darsida o'tilmagan — shuning uchun so'ralmadi.

### 4-7 · CRUD — L + R
- **Darsdan:** a1 — qo'shish o'zingiz (`setGames([...games, yangi])`); a2 — TOP (`map` + `{...g, top: true}`) va o'chirish (`filter` + `confirm`) Gemini bilan;
  a3 — AI xatosi (`push` — React ko'rmaydi). Ma'lumot faqat xotirada.
- **O'quvchiga:** «"Mening o'yinlarim"ga CRUD'ning yetishmagan qismini qo'shing.»
  1. Har o'yinda «✏️» tugmasi: nomini o'zgartirish (`map` + `{...g, name: yangi}`).
  2. «Faqat Top» tugmasi: faqat belgilangan o'yinlar ko'rinsin; asl ro'yxat o'zgarmasin.
  3. Bo'sh nom bilan o'yin qo'shilmasin.
  4. Ro'yxat bo'sh qolsa «Hali o'yin yo'q» chiqsin.
  5. `push` yoki `splice` bo'lmasin. Link va skrinshot.
- **Tekshiruv (mentor):** ☐ tahrir map + spread · ☐ filtr faqat ko'rinishni o'zgartiradi · ☐ bo'sh nom tekshiruvi · ☐ bo'sh holat · ☐ push/splice yo'q.

### 4-8 · fetch va axios — L + R
- **Darsdan:** server — ma'lumot markazi; `fetch` → `.json()` → `setGames(data)` → `map`; `useEffect(…, [])`; GET; endpoint;
  skeleton (yuklanish); 200 OK; 404 — avval manzilni tekshirish. **Darsda faqat `fetch` o'tilgan — axios so'ralmaydi.**
- **O'quvchiga:** «Haqiqiy serverdan foydalanuvchilar ro'yxatini oling: `https://jsonplaceholder.typicode.com/users`.»
  1. Sahifa ochilganda bir marta so'rov yuborilsin (`useEffect`, `[]`).
  2. Javob kelguncha «Yuklanmoqda…» yoki kulrang kartochkalar ko'rinsin.
  3. Har foydalanuvchi kartochkasida ism, email va shahar (`address.city`).
  4. Manzilni ataylab buzing (`/userz`), konsolda `404` ni toping va skrinshot oling. Keyin tuzating.
  5. Link va ikki skrinshot: konsoldagi 404 va tuzatilgandan keyingi ro'yxat.
- **Tekshiruv (mentor):** ☐ fetch → json → set tartibi · ☐ useEffect `[]` · ☐ yuklanish holati bor · ☐ 404 skrinshoti + tuzatilgan manzil · ☐ 10 ta kartochka.
- *Izoh:* darsda xato kodda ushlanmaydi (`catch` yo'q) — 404'ni manzildan topish o'rgatilgan; vazifa shunga moslandi.

### 4-9 · POST, PUT, DELETE — L + R
- **Darsdan:** fe'l (method) GET/POST/PUT/DELETE; `fetch(url, { method, headers, body })`; `JSON.stringify` (.json() ning teskarisi);
  201 Created; PUT va DELETE uchun ID (`/games/2`); DELETE'da body yo'q va qaytarilmaydi; CRUD.
- **O'quvchiga:** «Sinov serveri bilan ishlang: `https://jsonplaceholder.typicode.com/posts`. U javob qaytaradi, lekin haqiqatan saqlamaydi.»
  1. Forma (sarlavha, matn) → `POST`; javobdagi `id` va status `201` ni sahifada ko'rsating.
  2. «Tahrirlash» tugmasi → `PUT /posts/1` yangi sarlavha bilan; javobni ko'rsating.
  3. «O'chirish» tugmasi → `DELETE /posts/1`; status `200` ni ko'rsating.
  4. Uchala so'rovda `method` to'g'ri, POST/PUT da `JSON.stringify`.
  5. Link va skrinshot (uchala javob ko'ringan holat).
- **Tekshiruv (mentor):** ☐ POST + body stringify + 201 · ☐ PUT ID bilan · ☐ DELETE ID bilan, body yo'q · ☐ javoblar ekranda.

### 4-11 · React Router — L + R
- **Darsdan:** a1 — sahifalar ro'yxati o'zingiz (BrowserRouter, Routes, Link); a2 — GamePage (`useParams` + `find`) va AddPage (forma + `useNavigate`) Gemini bilan;
  a3 — AI xatosi (`<a>` — sahifa qayta yuklanadi). Darsning o'z savoli: «Yangi "Sevimlilar" sahifasi qo'shsak, Route qatori qanday bo'ladi?»
- **O'quvchiga:** «robo-games'ga "Sevimlilar" sahifasini qo'shing.»
  1. `/favorites` Route va menu'da unga `Link`.
  2. O'yin sahifasida «⭐ Sevimliga» tugmasi; sevimlilar ro'yxati App'da saqlansin.
  3. `/favorites` da faqat sevimli o'yinlar; bo'sh bo'lsa «Hali sevimli yo'q».
  4. Menu'dagi «Sevimlilar» yonida soni: «Sevimlilar (3)».
  5. Link va skrinshot (`/favorites`).
- **Tekshiruv (mentor):** ☐ yangi Route + Link (a emas) · ☐ sevimlilar state App'da, sahifa almashsa saqlanadi · ☐ bo'sh holat · ☐ son to'g'ri.

### 4-12 · React practice 1 (AvtoIjara) — L + R
- **Darsdan:** loyiha rejasi 4 sahifa: Bosh (/) · Mashina (/car/:id) · Ijaralarim (/bookings) · Qo'shish (/add). Darsda: a1 katalog (`public/cars.json` + fetch)
  va /car/:id; a2 ijara (kun, bookings, jami — for); a3 AI xatosi (kun unutilgan). **/add sahifasi darsda qurilmagan.** Prompt = Nima + Qanday + Qayerda.
- **O'quvchiga:** «AvtoIjara'ni tugating.»
  1. `/add` sahifasi: forma (nom, kunlik narx, yil) → `setCars([...cars, yangi])` → `navigate('/')`.
  2. Bo'sh maydon bilan mashina qo'shilmasin.
  3. Katalogda «Arzon → qimmat» va «Qimmat → arzon» saralash.
  4. AI'ga yozgan promptlaringizni README'ga qo'shing (Nima + Qanday + Qayerda).
  5. Link va skrinshot (yangi qo'shilgan mashina katalogda).
- **Tekshiruv (mentor):** ☐ /add Route + forma · ☐ spread bilan qo'shiladi, navigate('/') · ☐ bo'sh maydon tekshiruvi · ☐ saralash nusxada (asl massiv buzilmaydi) · ☐ README promptlar.

### 4-13 · React practice 2 (istalgan sayt) — L
- **Darsdan:** saytni sahifalarga, sahifani bo'limlarga (Navbar, Hero, Categories, TaomList → TaomCard ×N, Footer) bo'lish;
  aniq prompt = qaysi bo'limlar + har bo'lim nima ko'rsatadi + ma'lumot/uslub; takrorlanadigan karta → komponent + props + map;
  AI unutsa — tuzatuvchi prompt. Darsning so'nggi qadami — o'z saytini bo'laklash.
- **O'quvchiga:** «O'z saytingizni (do'kon, to'garak, o'yin klubi…) bo'laklab, ikki qismini quring.»
  1. README'da: sahifalar ro'yxati va Bosh sahifaning bo'limlari.
  2. Ikki bo'lim uchun aniq prompt yozing va README'ga qo'shing.
  3. Shu ikki bo'limni quring; takrorlanadigan kartochka — alohida komponent, `map` bilan.
  4. AI biror narsani unutgan bo'lsa — tuzatuvchi promptni ham yozing.
  5. GitHub linkini topshiring.
- **Tekshiruv (mentor):** ☐ README'da bo'laklar · ☐ 2 aniq prompt (3 qismi bor) · ☐ karta komponenti + map + props · ☐ 2 bo'lim ishlaydi.

---

## 5-modul «Ma'lumot va bog'lanishlar» (LMS bo'lim 75) — backend o'quvchi kompyuterida; topshirish: GitHub link / fayl + skrinshot; mentor tekshiradi

| # | Dars | Vazifa |
|---|---|---|
| 1 | Ma'lumotlar qayerda saqlanadi? | **T** 5 savol (2 rasmli: JSON, jadval) |
| 2 | Data model (PM) | — |
| 3 | SQL va NoSQL | **T** 5 savol |
| 4 | Server yaratish | **F + R** — server.js, 3 endpoint |
| 5 | Routing | **T** 5 savol — controller kodini o'qish |
| 6 | PostgreSQL so'rovlari | **T** 5 savol — jadval rasmi bilan |
| 7 | .env va xavfsizlik (PM) | — |
| 8 | CRUD: Express + PostgreSQL | **L + R** — bitta mashina endpointi, 404 |
| 9 | API va Postman | **R** — Postman'da 5 so'rov va statuslar |
| 10 | Frontendni backendga ulash | **L + R** — narxni tahrirlash (PUT) + o'chirish (DELETE) |
| 11 | JWT va autentifikatsiya | **T** 5 savol |
| 12 | PRD yaratish (PM) | — |
| 13 | Fullstack practice 1 (AvtoStoyanka) | **L + R** — band joy va bo'sh raqam tekshiruvi |
| 14 | Fidbek asosida yaxshilash | **L + R** — 4-upgrade (joylar soni) + qayta fikr |
| 15 | Guruhda storytelling (PM) | — |

> Kuzatuv: LMS'da 8-dars (CRUD praktika) 9-dars (Postman) va 11-dars (JWT) dan oldin turibdi; dars faylining sarlavhasida esa «Auth va .env darsidan keyin»
> deyilgan. Vazifalar LMS tartibiga qarab tuzildi (8-darsda .env/JWT so'ralmaydi).

### 5-1 · Ma'lumotlar qayerda saqlanadi? — T (5 savol, 2 rasmli)
- **Darsdan:** JSON `{ }` — bitta narsa, `kalit: qiymat`, matn qo'shtirnoqda, son qo'shtirnoqsiz; jadval: qator = yozuv, ustun = maydon; `id` (PK);
  bog'lovchi ustun (FK, `posts.user_id`); bitta → ko'p; sxema; server o'chsa ma'lumot bazada (diskda) qoladi, RAM o'chadi.
- **Savollar:**
  1. **Rasmli JSON:** `{ "title": "Chorvoq", "likes": 120, "user_id": 3 }`. «Bu yozuvda nechta kalit bor?» ✔ 3 · chalg'ituvchi: 1, 6.
  2. «JSON'da qaysi qiymat to'g'ri yozilgan matn?» ✔ `"Toshkent"` · chalg'ituvchi: `Toshkent` (qo'shtirnoqsiz), `120`.
  3. **Rasmli jadvallar:** `users` (id, username) va `posts` (id, title, user_id). «"Chorvoq" posti qaysi foydalanuvchiniki?» ✔ user_id bo'yicha topilgan username.
  4. «Bitta foydalanuvchi va uning postlari qanday bog'langan?» ✔ bitta → ko'p · chalg'ituvchi: bitta → bitta, bog'lanmagan.
  5. «Server o'chib-yondi. Postlar qayerdan qaytadi?» ✔ ma'lumotlar bazasidan · chalg'ituvchi: RAM'dan, brauzerdan.
- **Rasm:** 2 ta — JSON kartasi va ikki jadval (HTML'da chizib skrinshot).

### 5-3 · SQL va NoSQL — T (5 savol)
- **Darsdan:** SQL — ustunlari oldindan belgilangan jadval (PostgreSQL, MySQL); NoSQL — erkin `{ }` hujjat (MongoDB, Firebase); JOIN; tranzaksiya;
  qaror mezonlari: bog'lanish · shakl · ishonchlilik · hajm; «NoSQL yangiroq — doim yaxshi» — mif; PostgreSQL JSON ham saqlaydi.
- **Savollar** (faqat faktli — «qaysi yaxshiroq» kabi fikr-savol yo'q):
  1. «Qaysi biri NoSQL bazasi?» ✔ MongoDB · chalg'ituvchi: PostgreSQL, MySQL.
  2. «Ikki jadvalni `id` bo'yicha bitta so'rovda birlashtiradigan amal?» ✔ JOIN · chalg'ituvchi: INSERT, WHERE.
  3. «Oxirgi chiptani ikki kishi bir vaqtda ololmasligini nima kafolatlaydi?» ✔ tranzaksiya · chalg'ituvchi: JSON, indeks.
  4. «Postlarning birida "musiqa" maydoni bor, boshqalarida yo'q. Qaysi turda yangi maydon qo'shish oson?» ✔ NoSQL · chalg'ituvchi: SQL.
  5. «PostgreSQL JSON ko'rinishidagi ma'lumotni saqlay oladimi?» ✔ ha · chalg'ituvchi: yo'q, faqat jadval.

### 5-4 · Server yaratish — F + R
- **Darsdan:** server; Node.js — JS serverda; `npm install express`, `package.json`; `app.get('/salom', …)`, `res.send(…)`, `app.listen(3000)`,
  `node server.js`, `localhost:3000/salom`; `ECONNREFUSED` — server o'chiq.
- **O'quvchiga:** «Birinchi serveringizni uyda yozing.»
  1. Yangi papkada `npm init -y` va `npm install express`.
  2. `server.js` da uchta endpoint: `/salom` → «Salom, dunyo!», `/men` → ismingiz, `/sevimli` → sevimli o'yiningiz nomi.
  3. `app.listen(3000)` va `node server.js`.
  4. Brauzerda uchala manzilni oching — har birining skrinshoti.
  5. Serverni to'xtatib (Ctrl + C) `/salom` ni yana oching — chiqqan xatoning skrinshoti. `server.js` va `package.json` ni yuklang.
- **Tekshiruv (mentor):** ☐ `package.json` da express · ☐ 3 ta `app.get` · ☐ `app.listen(3000)` · ☐ 3 skrinshot javoblari bilan · ☐ o'chiq server xatosi.

### 5-5 · Routing — T (5 savol, kod-o'qish)
- **Darsdan:** route = METHOD + PATH; GET/POST/PUT/DELETE; `/games/:id`; Express: `app.get('/games')`, `app.get('/games/:id')`, `app.post('/games')`, `req.params.id`;
  mos route yo'q → 404 (method mos kelmasa ham). F-1021-01 (21.10): dars Nest'dan Express'ga o'tkazildi — test ham Express kodida.
- **Hammasiga bitta kod** (savol tepasida, darsdagi bilan aynan): `app.get('/games', …)`, `app.get('/games/:id', … "O'yin raqami: " + req.params.id)`, `app.post('/games', …)`.
  1. «`GET /games/12` keldi. Qaysi eshik ochiladi?» ✔ GET /games/:id · chalg'ituvchi: GET /games, POST /games.
  2. «Shu so'rovda `req.params.id` nimaga teng?» ✔ `'12'` · chalg'ituvchi: `games`, `:id`.
  3. «`POST /games` qaysi eshikka tushadi?» ✔ POST /games · chalg'ituvchi: GET /games (manzil bir xil).
  4. «`DELETE /games/3` keldi. Natija?» ✔ 404 — mos route yo'q · chalg'ituvchi: app.get ishlaydi, o'yin o'chadi.
  5. «Route qaysi ikki qismdan iborat?» ✔ method va path · chalg'ituvchi: URL va port, fayl va papka.

### 5-6 · PostgreSQL so'rovlari — T (5 savol, 1 jadval rasmi)
- **Darsdan:** CREATE TABLE; `INSERT INTO products (...) VALUES (...)` (matn qo'shtirnoqda); `SELECT * / SELECT nom, narx`; WHERE; UPDATE … SET … WHERE;
  DELETE FROM … WHERE; WHERE unutilsa — hamma qator; AI yozgan SQL'ni o'qib tekshirish (jadval nomi, WHERE).
- **Rasm:** `products` jadvali — 5 qator (id, nom, narx, soni); hamma savol shu jadvalga.
  1. «`SELECT nom FROM products WHERE narx < 60000;` nechta qator qaytaradi?» ✔ (jadvalga ko'ra aniq son).
  2. «Yangi mahsulot qo'shadigan to'g'ri so'rov?» ✔ `INSERT INTO products (nom, narx, soni) VALUES ('Koptok', 45000, 8);` · chalg'ituvchi: matn qo'shtirnoqsiz, UPDATE bilan.
  3. «`UPDATE products SET narx = 99000;` bajarildi. Nima bo'ladi?» ✔ hamma mahsulot narxi 99000 · chalg'ituvchi: faqat birinchisi, xato beradi.
  4. «`id = 3` mahsulotni o'chiradigan so'rov?» ✔ `DELETE FROM products WHERE id = 3;` · chalg'ituvchi: WHERE'siz, `SELECT … DELETE`.
  5. «AI yozdi: `DELETE FROM product WHERE id = 3;`. Xato qayerda?» ✔ jadval nomi `products` · chalg'ituvchi: WHERE ortiqcha, `=` o'rniga `==`.

### 5-8 · CRUD: Express + PostgreSQL (AvtoIjara backend) — L + R
- **Darsdan:** `cars` jadvali; Express + `pool.query('…')`; `$1, $2` — qiymatni SQL'ga yopishtirmaslik; `WHERE id = $1` (`:id` dan);
  4 endpoint: `GET /api/cars`, `POST`, `PUT /:id`, `DELETE /:id`; `res.json`; 201; `500: column "price" does not exist` — ustun nomi; Postman bilan sinash.
- **O'quvchiga:** «AvtoIjara backendiga bitta mashinani olish yo'lini qo'shing.»
  1. `GET /api/cars/:id` — `WHERE id = $1` bilan bitta mashinani qaytarsin.
  2. Bunday id yo'q bo'lsa — status `404` va «Mashina topilmadi».
  3. SQL'da qiymat yopishtirilmasin — faqat `$1`.
  4. Postman'da ikki skrinshot: bor id (200) va yo'q id (404).
  5. GitHub linkini topshiring.
- **Tekshiruv (mentor):** ☐ yangi route `/:id` · ☐ `$1` ishlatilgan · ☐ 404 holati · ☐ 2 skrinshot statuslari bilan.

### 5-9 · API va Postman — R
- **Darsdan:** API — pochta; so'rov = METHOD + URL + BODY; javob = status + JSON; GET=SELECT, POST=INSERT, PUT=UPDATE, DELETE=DELETE;
  200, 201, 404; Postman — saytsiz API sinash.
- **O'quvchiga:** «8-darsdagi AvtoIjara API'ingizni Postman'da to'liq sinang.»
  1. `GET /api/cars` → 200.
  2. `POST /api/cars` (Body → raw → JSON) → 201, javobda yangi mashina.
  3. `PUT /api/cars/<id>` — narxini o'zgartiring.
  4. `DELETE /api/cars/<id>`, keyin shu id bilan `GET` → 404.
  5. Manzilda harf xato (`/api/cras`) → 404. Har so'rovning skrinshoti (status ko'rinsin).
- **Tekshiruv (mentor):** ☐ 5 skrinshot · ☐ to'g'ri method har birida · ☐ POST body JSON · ☐ statuslar 200/201/404 · ☐ DELETE'dan keyin 404.

### 5-10 · Frontendni backendga ulash — L + R
- **Darsdan:** a1 — fetch manzili cars.json → `GET /api/cars`; a2 — CORS (`app.use(cors())`); a3 — server maydonlari (nom, narx, yil), 3 holat
  (yuklanmoqda / xato / ro'yxat), POST forma. Ya'ni darsda front faqat **o'qiydi va qo'shadi**. Darsdagi prompt formasida «DELETE va PUT» faqat misol.
- **O'quvchiga:** «Katalogni to'liq boshqariladigan qiling — narxni o'zgartirish va o'chirish.»
  1. Har kartochkada «Narxni o'zgartirish»: yangi narx kiritiladi → `PUT /api/cars/:id`.
  2. «O'chirish» tugmasi: `confirm`, so'ng `DELETE /api/cars/:id`.
  3. Har amaldan keyin ro'yxat serverdan qayta olinsin.
  4. Sahifani yangilang — o'zgarishlar saqlanib qolsin (bazada).
  5. GitHub linki (front va back) va oldin/keyin skrinshoti.
- **Tekshiruv (mentor):** ☐ PUT body + JSON.stringify · ☐ DELETE + confirm · ☐ ro'yxat qayta olinadi · ☐ refresh'dan keyin ham saqlangan.

### 5-11 · JWT va autentifikatsiya — T (5 savol)
- **Darsdan:** login (email + parol) → token; `POST /api/login`; JWT 3 qism (header.payload.signature), payload'da `userId`; imzo — `JWT_SECRET`;
  `jwt.sign`, `jwt.verify`; `Authorization: Bearer <token>`; tokensiz → 401; `.env`, `process.env`, `.gitignore`.
- **Savollar:**
  1. «Login to'g'ri bo'lsa, server nima qaytaradi?» ✔ token · chalg'ituvchi: parolning o'zi, foydalanuvchilar ro'yxati.
  2. «Token har so'rovda qayerda yuboriladi?» ✔ `Authorization` sarlavhasida (Bearer) · chalg'ituvchi: manzilda, body'da parol bilan.
  3. «Himoyalangan route'ga tokensiz so'rov keldi. Status?» ✔ 401 · chalg'ituvchi: 200, 404.
  4. «Tokenning qaysi qismi soxta yasashga yo'l qo'ymaydi?» ✔ signature (imzo) · chalg'ituvchi: header, payload.
  5. «`.env` `.gitignore` da yo'q edi va GitHub'ga yuklandi. Nima xavf?» ✔ maxfiy kalit hammaga ochiladi · chalg'ituvchi: sayt sekinlashadi, kod o'chadi.

### 5-13 · Fullstack practice 1 (AvtoStoyanka) — L + R
- **Darsdan:** a1 baza o'zingiz (`joylar` + `sessiyalar`, FK `REFERENCES joylar(id)`, psql); a2 server (joylar, kirish → INSERT, chiqish → UPDATE, tushum `SUM(tolov)`);
  a3 qorovul paneli (🟩 bo'sh / 🟥 band); a4 tarix JOIN bilan (`ON sessiyalar.joy_id = joylar.id`). Ya'ni JOIN va tushum darsda qilingan.
- **O'quvchiga:** «Panel adashmasin — server noto'g'ri kirishni rad etsin.»
  1. Band joyga ikkinchi mashina kiritilsa — server rad etsin (status `400`, «Joy band»). `400` — so'rov noto'g'ri degani.
  2. Mashina raqami bo'sh bo'lsa — `400`, «Raqamni kiriting».
  3. Panel shu xabarni qorovulga ko'rsatsin.
  4. Postman yoki panelda ikkala xatoning skrinshoti + GitHub linki.
- **Tekshiruv (mentor):** ☐ kirishdan oldin joy bandligi SELECT bilan tekshiriladi · ☐ ikkala holatda 400 + aniq xabar · ☐ panel xabarni ko'rsatadi · ☐ to'g'ri kirish avvalgidek ishlaydi.

### 5-14 · Fidbek asosida yaxshilash — L + R
- **Darsdan:** a1 — haqiqiy sinfdoshdan 3 fikr (aniq / umumiy); a2 — foyda/mehnat doskasi; a3 — Gemini bilan upgrade: chiqishda tasdiq, dashboard
  (bo'sh/band/tushum), narx sozlamasi (UPDATE). Ro'yxatdagi 4-upgrade — **joylar soni** — darsda qilinmagan. Sikl: qur → ko'rsat → fikr → sarala → upgrade → **qayta test**.
- **O'quvchiga:** «Sikldagi oxirgi ikki qadamni bajaring.»
  1. «Sozlamalar»ga joylar sonini o'zgartirish: ko'paytirilsa yangi joylar qo'shilsin, kamaytirilsa faqat bo'sh joylar olib tashlansin.
  2. Band joyni olib tashlab bo'lmasin — xabar chiqsin.
  3. Panelni o'sha sinfdoshga qayta ko'rsating va yangi fikrini README'ga yozing: nima yaxshilandi, nima qoldi.
  4. GitHub linki va skrinshot (joylar soni o'zgargan panel).
- **Tekshiruv (mentor):** ☐ joy qo'shish INSERT bilan · ☐ faqat bo'sh joy o'chadi · ☐ band joy himoyalangan · ☐ README'da qayta fikr.

---

## 6-modul «NestJS + Test + CI/CD» (LMS bo'lim 90) — o'quvchi kompyuterida + GitHub; topshirish: link / fayl + skrinshot; mentor tekshiradi

| # | Dars | Vazifa |
|---|---|---|
| 1 | NestJS va arxitektura | **T** 5 savol (1 tasi papka daraxti bilan) |
| 2 | Sayt yuklamasi (PM) | — |
| 3 | Nest arxitekturasi | **L + R** — `Brand` resursini qo'lda (5 fayl) |
| 4 | NestJS practice (KitobShop) | **L + R** — `Review` resursi + rollar sinovi |
| 5 | Loyihani sinovdan o'tkazish (Jest) | **F + R** — `deliveryFee` uchun 3 test + bitta qizilni tuzatish |
| 6 | Sifat: bitta xato — nechta odam ketadi? (PM) | — |
| 7 | Edge case va error path | **F + R** — `applyCoupon` himoyasi va chegara testlari |
| 8 | CI/CD nima va nega kerak? | **T** 5 savol (1 rasmli — lenta) |
| 9 | Reliz (PM) | — |
| 10 | GitHub Actions | **L** — o'z test repo'sida birinchi ci.yml: yashil → qizil → yashil |
| 11 | Practice 1: backend + frontend | **L** — KitobShop'da to'liq lenta haqiqatan + TABLO |
| 12 | Practice 2 (AI bilan lenta) | **L** — qizil lentani Copilot bilan tuzatish, qaror README'da |
| 13 | Monitoring (PM) | — |
| 14 | Pre Demo Day: test + lint + deploy | **L** — matrix + cache + seyf haqiqiy run'da |

> Kuzatuv: LMS 11-dars nomi «Practice 1: backend + frontend», bog'langan fayl (FullPipelineProjectLesson) esa KitobShop'ga CI lenta quradi
> (deploysiz). Vazifa fayl mazmuniga ko'ra. Nomni LMS'da to'g'rilash kerakmi — foydalanuvchi hal qiladi.

### 6-1 · NestJS va arxitektura — T (5 savol, 1 rasmli)
- **Darsdan:** `git clone` → `npm install` → `.env` → `npm run start:dev`; Swagger — barcha eshiklar; tartib: Guard (token yo'q → 401) → Pipe/DTO
  (anketa xato → 400) → Controller (ofitsiant, ishni o'zi qilmaydi) → Service (asosiy ish, parol shifrlash) → Repository → PostgreSQL; Entity — jadval
  ustunlari; Module `providers` — shtat jadvali; yangi bo'lim — 5 fayl bir xil tartibda.
- **Savollar:**
  1. «So'rov eng birinchi kimga uchraydi?» ✔ Guard · chalg'ituvchi: Controller, Service.
  2. «`POST /admin` da `username` bo'sh yuborildi. Javob kodi?» ✔ 400 (DTO) · chalg'ituvchi: 401, 500.
  3. «Parolni shifrlash qaysi faylda bo'ladi?» ✔ Service · chalg'ituvchi: Controller, DTO.
  4. **Papka daraxti bilan:** `src/admin/` papkasi (entity, dto, service, controller, module). «Jadvalda qaysi ustunlar borligini qaysi fayl belgilaydi?» ✔ entity.
  5. «Yangi service yozildi, lekin Module'dagi `providers` ga qo'shilmadi. Nima bo'ladi?» ✔ Nest uni topa olmaydi, server xato beradi · chalg'ituvchi: hammasi ishlaydi.
- **Rasm o'rniga:** papka daraxti kod bloki sifatida (interfeys o'ylab chizilmaydi).

### 6-3 · Nest arxitekturasi — L + R
- **Darsdan:** resurs = 5 fayl; sikl Entity → DTO → Service (`extends BaseService`, `super(carRepo)`) → Controller (`@Post @Get @Patch @Delete`) → Module
  (`forFeature`) → AppModule `imports`; `BaseEntity` — id, created_at, updated_at tekin; `PartialType`; AppModule'ga ulanmasa — 404. Darsda `Car` qo'shilgan (WE-DO).
- **O'quvchiga:** «Xuddi shu 6 qadam bilan `Brand` (avtomobil brendi) resursini o'zingiz, agentsiz qo'shing.»
  1. Entity: `name` (matn), `country` (matn).
  2. DTO: ikkalasi `@IsString`, `@IsNotEmpty`; tahrirlash DTO — `PartialType`.
  3. Service `BaseService` dan meros; Controller — 4 ta eshik.
  4. `BrandModule` ni AppModule'ga ulang.
  5. Swagger'da ikki skrinshot: `POST /brand` → 201 va bo'sh `name` → 400. GitHub linki.
- **Tekshiruv (mentor):** ☐ 5 fayl, nomlari tartibli · ☐ DTO qoidalari · ☐ `extends BaseService` · ☐ AppModule'da · ☐ 201 va 400 skrinshotlari.

### 6-4 · NestJS practice (KitobShop) — L + R
- **Darsdan:** YOU-DO — Copilot Chat «Agent» rejimida 3 bog'langan resurs (Category, Book, Order); `@ManyToOne` (yorliq kitobda saqlanadi);
  `@Roles(ADMIN)` / `@Roles('public')`; eshik sinovi: tokensiz → 401, ruxsatsiz rol → 403; agent kodini tekshirib «Keep».
- **O'quvchiga:** «KitobShop'ga kitob sharhlari (`Review`) qo'shing — agent bilan, lekin rejani siz tuzasiz.»
  1. `Review`: `text`, `rating` (1–5), kitobga `@ManyToOne`.
  2. `GET /review` — hamma uchun ochiq; `POST` — tizimga kirganlar; `DELETE` — faqat ADMIN.
  3. Agentga yozgan promptlaringizni README'ga qo'shing.
  4. Swagger'da uch skrinshot: tokensiz `POST` → 401, oddiy foydalanuvchi `DELETE` → 403, ADMIN `DELETE` → 200.
  5. GitHub linki.
- **Tekshiruv (mentor):** ☐ ManyToOne Review → Book · ☐ rollar to'g'ri eshiklarda · ☐ 3 skrinshot statuslari bilan · ☐ README'da prompt.

### 6-5 · Loyihani sinovdan o'tkazish (Jest) — F + R
- **Darsdan:** unit-test; `npm i -D jest`, `"test": "jest"`, `npm test`; `describe` / `it` / `expect(...).toBe(...)`; PASS/FAIL, Expected/Received;
  AAA (tayyorla → chaqir → tekshir); `expect` siz test — yolg'on (doim yashil); etalon xato bo'lsa — kod to'g'ri bo'lsa ham qizil. Darsda `orderTotal` sinalgan.
- **O'quvchiga:** «KitobShop uchun yangi funksiyani testlang.»
  1. `deliveryFee(total)`: buyurtma 100 000 so'm va undan ko'p bo'lsa — 0, kam bo'lsa — 15 000.
  2. `delivery.spec.ts` da uch test: 150 000 → 0, aynan 100 000 → 0, 99 000 → 15 000. Birinchisi namuna: `it('150 000 — yetkazish bepul', () => { expect(deliveryFee(150000)).toBe(0); });` — qolgan ikkitasini o'zingiz yozing.
  3. Ataylab bitta etalonni xato yozing — `npm test` qizil chiqsin. Skrinshot (Expected/Received ko'rinsin).
  4. Etalonni tuzating — hammasi yashil. Skrinshot.
  5. `delivery.ts` va `delivery.spec.ts` fayllarini yuklang.
- **Tekshiruv (mentor):** ☐ 3 ta `it`, har birida `expect` · ☐ chegara 100 000 sinalgan · ☐ qizil skrinshotda Expected/Received · ☐ yashil skrinshot.

### 6-7 · Edge case va error path — F + R
- **Darsdan:** happy path; edge case (0, manfiy, juda katta); boundary (1 — to'g'ri, 0 — rad); NaN — jim buzilish; guard — funksiya boshidagi himoya,
  `throw new Error(...)`; `expect(() => f(...)).toThrow()` (`() =>` siz test qulaydi); guard qo'shilgach eski test yangilanadi; throw API'da 400 bo'ladi.
- **O'quvchiga:** «Kupon funksiyasini himoyalang va sinang.»
  1. `applyCoupon(total, percent)` — `total` dan `percent` foiz chegirma.
  2. Guard: `percent` 0 dan kichik yoki 100 dan katta bo'lsa — `throw`; `total` son bo'lmasa — `throw`.
  3. Testlar: happy path (100 000, 10 → 90 000); chegaralar 0 va 100 — ishlaydi; 101 va −1 — `toThrow`; `"ikki"` — `toThrow`. Namuna: `expect(() => applyCoupon(100000, 101)).toThrow();` — `() =>` siz test qulaydi.
  4. `npm test` yashil skrinshoti; ikki fayl yuklanadi.
- **Tekshiruv (mentor):** ☐ guard funksiya boshida · ☐ chegaraning ikki tomoni sinalgan · ☐ `() =>` bilan `toThrow` · ☐ NaN/matn holati · ☐ hammasi yashil.

### 6-8 · CI/CD nima va nega kerak? — T (5 savol, 1 rasmli)
- **Darsdan:** CI — har push avtomatik tekshiriladi; CD — tekshiruvdan o'tgan yuk o'zi chiqadi; lenta: Yig'ish (install) → Skaner (test) → O'lcham ramkasi (lint)
  → O'rash (build) → Uchirish (deploy); `on: push`; bitta nuqta qizil — lenta to'xtaydi; ci.yml `.github/workflows` da; maxfiy kalit — seyfda.
- **Savollar:**
  1. **Rasmli:** lenta — Yig'ish ✅, Skaner ❌, qolgani kulrang. «Endi nima bo'ladi?» ✔ lenta to'xtaydi, sayt chiqmaydi · chalg'ituvchi: Uchirish baribir ishlaydi.
  2. «`npm test` lentaning qaysi nuqtasida?» ✔ Skaner · chalg'ituvchi: Yig'ish, O'rash.
  3. «CI va CD farqi?» ✔ CI tekshiradi, CD chiqaradi · chalg'ituvchi: ikkalasi bir xil.
  4. «Lentani nima ishga tushiradi?» ✔ `on: push` · chalg'ituvchi: `runs-on`, `npm install`.
  5. «API kalitini qayerda saqlash kerak?» ✔ seyfda (secrets) · chalg'ituvchi: ci.yml ichida, README'da.
- **Rasm:** lenta sxemasi (HTML'da chizib skrinshot).

### 6-10 · GitHub Actions — L
- **Darsdan:** `.github/workflows/ci.yml` (boshqa papkada GitHub ko'rmaydi); `on: push`; `runs-on: ubuntu-latest`; job va steps; `uses: actions/checkout@v4`;
  `run: npm test`; jurnal (logs); matrix, cache, secrets, badge — tanishtirilgan. Darsda lenta maketda aylangan.
- **O'quvchiga:** «6-5/6-7 dagi test loyihangizga birinchi haqiqiy lentani (pipeline) yozing.»
  1. Loyihani GitHub'ga joylang.
  2. `.github/workflows/ci.yml`: push'da ishga tushsin, `checkout`, Node o'rnatish, `npm install`, `npm test`.
  3. Push qiling — Actions'da yashil run.
  4. Ataylab bitta testni buzing va push qiling — qizil run. Jurnaldan sababni toping.
  5. Tuzating — yana yashil. Repo linki va uchala run linki.
- **Tekshiruv (mentor):** ☐ ci.yml to'g'ri papkada · ☐ 3 run: yashil → qizil → yashil · ☐ qizil run jurnalida test nomi · ☐ steps tartibi to'g'ri.

### 6-11 · Practice 1: backend + frontend (to'liq lenta) — L
- **Darsdan:** a1 — lenta quruvchisi; a2 — KitobShop'ga haqiqiy ci.yml (checkout, setup-node, `npm ci`, test, lint, build) + **push maketi**; a3 — qizil jurnal;
  rollback, TABLO (status badge). Uchirish — maketda.
- **O'quvchiga:** «Darsda yozgan KitobShop lentasini (pipeline) haqiqatan yurgizing.»
  1. ci.yml'ni repo'ga push qiling: install → test → lint → build.
  2. Lint qoidasini ataylab buzing (masalan ishlatilmagan o'zgaruvchi) — O'lcham ramkasi qizil, keyingi nuqtalar o'tkazib yuborilgani jurnalda ko'rinsin.
  3. Tuzating — hammasi yashil.
  4. README'ga TABLO (status badge) qo'ying.
  5. Repo linki va qizil + yashil run linklari.
- **Tekshiruv (mentor):** ☐ 4 nuqta to'g'ri tartibda · ☐ lint qizil run'da build o'tkazilgan · ☐ yashil run · ☐ README'da badge.

### 6-12 · Practice 2 (AI bilan lenta) — L
- **Darsdan:** qizil chiroq → avval jurnalni o'zingiz o'qing (fayl, qator, kutildi/keldi); Copilot Chat'ga aniq so'rov; taklifni jurnaldagi sabab bilan tekshirish;
  Copilot adashishi mumkin; yakuniy qaror — sizniki.
- **O'quvchiga:** «Qizil lentani (pipeline) Copilot bilan, lekin o'z qaroringiz bilan tuzating.»
  1. KitobShop'da bitta testni buzing (masalan servisdagi hisobni o'zgartiring), push — qizil.
  2. Jurnaldan fayl, qator va «kutildi/keldi»ni README'ga yozing.
  3. Copilot'ga shu ma'lumot bilan aniq so'rov bering; so'rov matnini README'ga qo'shing.
  4. Taklifni tekshiring: sababga mos kelsa — qabul, mos kelmasa — nega rad etganingizni yozing.
  5. Yashil run. Repo linki va ikki run linki.
- **Tekshiruv (mentor):** ☐ README'da jurnal tahlili · ☐ aniq so'rov (fayl/qator bilan) · ☐ qabul/rad sababi · ☐ qizil → yashil.

### 6-14 · Pre Demo Day: test + lint + deploy (ishonchli lenta) — L
- **Darsdan:** a2 — KitobShop ci.yml: matrix (Node 22, 24), `cache: npm`, `JWT_SECRET` seyfdan — **push maketi**; staging va rollback maketda.
- **O'quvchiga:** «Ishonchli lentani (pipeline) haqiqiy run'da ko'rsating.»
  1. ci.yml'ga matrix qo'shing: Node 22 va 24 — ikki parallel job.
  2. `cache: npm` — ikkinchi run tezroq o'tsin (vaqtlarini README'ga yozing).
  3. `JWT_SECRET` ni GitHub Secrets'ga qo'ying va testda `${{ secrets.JWT_SECRET }}` orqali ishlating — jurnalda `***` ko'rinsin.
  4. Repo linki va run linki.
- **Tekshiruv (mentor):** ☐ 2 ta parallel job yashil · ☐ cache ishlagan (2-run tezroq) · ☐ kalit ci.yml'da ochiq yozilmagan, jurnalda `***` · ☐ README'da vaqtlar.

---

## 7-modul «Botlar va avtomatlashtirish» (LMS bo'lim 80) — o'quvchi kompyuterida + Telegram; topshirish: skrinshot / fayl / link; mentor tekshiradi

Umumiy: **token hech qachon** faylda, skrinshotda yoki linkda ko'rinmasin — mentor buni har vazifada birinchi tekshiradi.
AI yordamchi sifatida vazifalarda «Gemini yoki Copilot» deyiladi (Antigravity — 18+ cheklovi).

| # | Dars | Vazifa |
|---|---|---|
| 1 | Event-driven: bot qanday «o'ylaydi»? | **T** 5 savol (1 tasi chat yozuvi bilan) |
| 2 | Growth hacking (PM) | — |
| 3 | Telegram Bot API: menyu va tugmali bot | **F + R** — reply klaviatura + /help |
| 4 | Stateful logika: bot eslab qoladi | **F + R** — qog'ozdagi loyihani kodda: ismni eslab qoluvchi bot |
| 5 | Loyiha kuni: prompt orqali Telegram bot | **R + L** — 3-juft, fallback, begona odam sinovi |
| 6 | AI API botning ichida | **R + F** — botga system prompt, 3 sinov xabari |
| 7 | Loyiha kuni: bot + baza + AI + xosting | **R + L** — `/bekor` buyrug'i serverda |
| 8 | Custdev (PM) | — |
| 9 | Iteratsiya: fidbekni kodga aylantiraman | **L** — 2-fikrni tuzatish, qayta so'rash |
| 10 | AI-agent: idrok → qaror → harakat | **R + F** — 3-tool va chegara |
| 11 | Metrika nima (PM) | — |
| 12 | DAU va retention (PM) | — |
| — | Demo Day 6 | — |

### 7-1 · Event-driven: bot qanday «o'ylaydi»? — T (5 savol, 1 rasmli)
- **Darsdan:** bot — dastur boshqaradigan Telegram akkaunti; hodisa → handler → javob; token (@BotFather), `.env`; fallback handler; sikl;
  polling / webhook; «03:00 sinovi» (kompyuter o'chsa bot jim). Amaliyot: @BotFather'da bot ochish.
- **Savollar:**
  1. **Chat yozuvi bilan:** foydalanuvchi «/start», «Pitsa», «salom!!!» yuborgan. «"salom!!!" ga qaysi handler javob beradi?» ✔ fallback handler · chalg'ituvchi: start handleri, hech qaysi.
  2. «Bot uchun token nima?» ✔ botni boshqarish kaliti — hech kimga berilmaydi · chalg'ituvchi: botning foydalanuvchi nomi.
  3. «Token qayerda saqlanadi?» ✔ `.env` faylida · chalg'ituvchi: `bot.js` ichida, README'da.
  4. «Soat 03:00 da kompyuteringiz o'chiq. Bot xabarga javob beradimi?» ✔ yo'q — bot dasturi ishlamayapti · chalg'ituvchi: ha, Telegram o'zi javob beradi.
  5. «Hodisa → ? → javob. O'rtada nima?» ✔ handler · chalg'ituvchi: token, BotFather.
- **Rasm o'rniga:** chat yozuvi kod bloki sifatida (Telegram interfeysi o'ylab chizilmaydi).

### 7-3 · Telegram Bot API: menyu va tugmali bot — F + R
- **Darsdan:** Telegraf, `.env` + dotenv, `ctx`, `ctx.reply`, `bot.start`, `bot.command`, inline tugma (`Markup.inlineKeyboard`, callback → `bot.action`,
  `ctx.answerCbQuery`), reply klaviatura (bosilsa matn → `bot.hears`), fallback `bot.on('text')`, `bot.launch()`. Darsdagi amaliyot: `/menu` + 2 inline tugma.
- **O'quvchiga:** «Botingizga ikkinchi turdagi tugmalarni qo'shing.»
  1. `/start` javobi ostida reply klaviatura: «📋 Menyu» va «📞 Aloqa».
  2. «📋 Menyu» bosilsa — 3-darsdagi inline tugmalar chiqsin (`bot.hears`).
  3. «📞 Aloqa» bosilsa — telefon raqami yoki manzil.
  4. `/help` — bot nima qila olishini 3 qatorda aytsin.
  5. @BotFather'da `/setcommands` bilan buyruqlar ro'yxatini kiriting.
  6. Telegram skrinshotlari va `bot.js` (tokensiz) faylini yuklang.
- **Tekshiruv (mentor):** ☐ tokensiz fayl, `process.env.BOT_TOKEN` · ☐ `bot.hears` ikki tugmaga · ☐ `/help` · ☐ fallback oxirida · ☐ skrinshotda reply klaviatura va buyruqlar ro'yxati.

### 7-4 · Stateful logika: bot eslab qoladi — F + R
- **Darsdan:** holatsiz bot adashadi; holat (state), sessiya — `chat.id` bo'yicha; obyektdagi holat qayta ishga tushsa yo'qoladi → PostgreSQL;
  `users` (id, telegram_id, ism, holat, tanlov); oqim: xabar → SELECT → (yangi bo'lsa INSERT) → javob → UPDATE. **Amaliyot faqat qog'ozda edi** — jadval loyihasi.
- **O'quvchiga:** «Qog'ozdagi loyihangizni kodga aylantiring — Gemini yoki Copilot yordamida.»
  1. `users` jadvali: `telegram_id`, `ism`, `holat`.
  2. `/start`: yangi foydalanuvchi bo'lsa — INSERT, holat `ISM_KUTYAPMAN`, «Ismingiz nima?».
  3. Holat `ISM_KUTYAPMAN` bo'lsa, kelgan matn — ism: UPDATE, «Tanishganimdan xursandman, <ism>!».
  4. Botni to'xtatib qayta ishga tushiring — `/start` endi «Yana salom, <ism>!» desin.
  5. Telegram skrinshotlari (qayta ishga tushirishdan oldin va keyin), `bot.js` va jadval SQL'i.
- **Tekshiruv (mentor):** ☐ SELECT → INSERT/UPDATE oqimi · ☐ holat ustunida · ☐ qayta ishga tushgandan keyin ism eslab qolingan · ☐ ikki xil foydalanuvchi aralashmaydi (ikkinchi akkaunt bilan sinalgan bo'lsa — bonus).

### 7-5 · Loyiha kuni: prompt orqali istalgan Telegram bot — R + L
- **Darsdan:** `TelegramBotNest` repo'si; reja (hodisa → javob juftlari); A1 — salom va birinchi juft; A2 — tugmalar javob beradi; A3 — sinash va o'zingizniki;
  AI kodini o'qish (4 tekshiruv); xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
- **O'quvchiga:** «Botingizni boshqa odam ishlata oladigan holatga keltiring.»
  1. Rejaga 3-hodisa → javob juftini qo'shing va quring.
  2. Bot tushunmagan xabarga yo'l ko'rsatsin: «Men buni bilmayman. /start bosing».
  3. Botni oila a'zosi yoki do'stingizga bering — u yozgan 5 xabarni va bot javoblarini skrinshot qiling.
  4. Qayerda adashganini README'ga bitta gap bilan yozing.
  5. Repo linki (yoki o'z papkangiz) va skrinshotlar.
- **Tekshiruv (mentor):** ☐ 3 juft ishlaydi · ☐ fallback yo'l ko'rsatadi · ☐ boshqa odamning 5 xabari · ☐ README'da kuzatuv.

### 7-6 · AI API botning ichida — R + F
- **Darsdan:** handler javobni AI'dan oladi; system prompt — kim · qanday · nima haqida; suhbat tarixi va kontekst oynasi; temperature; hallutsinatsiya — faktni
  tekshirish; `process.env.AI_API_KEY`. **Amaliyot gemini.google.com va aistudio'da bo'lgan — kodga ulanmagan.**
- **O'quvchiga:** «System prompt'ingizni botga ulang.»
  1. Darsda yozgan system prompt'ni bot handleriga qo'ying; AI kaliti — `.env` da.
  2. Botga uch xabar yuboring: mavzuga oid savol, mavzudan tashqari savol, menyudagi narx.
  3. Mavzudan tashqari savolga bot chegarada qolsin; narx menyudagi bilan bir xil bo'lsin — bo'lmasa, system prompt'ni aniqlashtiring.
  4. Uch javob skrinshoti va yakuniy system prompt matni (alohida fayl).
- **Tekshiruv (mentor):** ☐ kalit kodda yo'q · ☐ system prompt'da kim/qanday/nima haqida · ☐ mavzudan tashqari savolga rad javob · ☐ narx to'g'ri.

### 7-7 · Loyiha kuni: bot + baza + AI + xosting — R + L
- **Darsdan:** A1 — buyurtmalar jadvali (`@Entity`, `@InjectRepository`), `/buyurtmalarim`; A2 — serverga tayyorlash (webhook, `bot.catch`, git push); A3 — Render'ga deploy.
  Natija: laptop yopiq — bot javob beradi.
- **O'quvchiga:** «Serverdagi botingizga buyurtmani bekor qilishni qo'shing.»
  1. `/bekor` — foydalanuvchining oxirgi buyurtmasini «bekor qilindi» holatiga o'tkazsin (UPDATE, o'chirmasdan).
  2. Bekor qilishdan oldin bot «Ha / Yo'q» inline tugmasi bilan so'rasin.
  3. `/buyurtmalarim` bekor qilinganini ko'rsatsin.
  4. Push qiling — Render o'zi yangilaydi. Kompyuter yopiq holatda sinang.
  5. Skrinshotlar + repo linki + bot nomi.
- **Tekshiruv (mentor):** ☐ UPDATE (DELETE emas) · ☐ tasdiq tugmalari · ☐ ro'yxatda holat · ☐ Render'da yangi versiya (deploy vaqti) · ☐ token/kalit repo'da yo'q.

### 7-9 · Iteratsiya: fidbekni kodga aylantiraman — L
- **Darsdan:** fikr turi va aniqligi; `FIKRLAR.md`; chastota × ta'sir → ★; A2 — ★ fikrni tuzatish (eskisi buzilmasin); A3 — v2 serverga + o'sha odamdan qayta so'rash.
- **O'quvchiga:** «Ikkinchi aylanani o'zingiz yuriting.»
  1. `FIKRLAR.md` dan navbatdagi (2-o'rin) fikrni tanlang; nega aynan u — bitta gap.
  2. Uni bitta aniq o'zgarish qilib yozing va tuzating; oldingi tuzatish buzilmaganini tekshiring.
  3. v3'ni serverga chiqaring.
  4. O'sha fikrni aytgan odamdan qayta so'rang va javobini `FIKRLAR.md` ga yozing.
  5. Repo linki.
- **Tekshiruv (mentor):** ☐ tanlov sababi · ☐ commit aniq o'zgarish bilan · ☐ serverda yangi versiya · ☐ qayta javob yozilgan.

### 7-10 · AI-agent: idrok et → qaror qil → harakat qil — R + F
- **Darsdan:** agent sikli: maqsad → idrok → qaror → amal → maqsadga yetdimi?; agentga uchta narsa: maqsad, tool'lar (agent chaqira oladigan funksiya), chegara (guardrail);
  tool'lar: checkOrder, saveOrder, arrangeDelivery, chargeCard, cancelOrder; pul yechishdan oldin tasdiq. Amaliyot: aistudio'da 2 ta tool (checkOrder, saveOrder).
- **O'quvchiga:** «aistudio'dagi agentingizga uchinchi tool va yangi chegara qo'shing.»
  1. `arrangeDelivery` tool'ini qo'shing: parametrlar — `manzil`, `vaqt`.
  2. Chegara: «Buyurtma bazaga yozilmaguncha yetkazib berish chaqirilmasin» va «Manzil bo'lmasa — avval so'ra».
  3. Ikki suhbat: manzilsiz buyurtma (agent manzil so'raydi) va to'liq buyurtma (checkOrder → saveOrder → arrangeDelivery tartibi).
  4. Har suhbat skrinshoti va tool'lar JSON'i (fayl).
- **Tekshiruv (mentor):** ☐ 3 ta tool JSON'da to'g'ri · ☐ chegara matni · ☐ manzilsiz holatda tool chaqirilmagan · ☐ tartib to'g'ri.

---

## 8-modul «Tizimni to'liq yig'aman» (LMS bo'lim 81) — `TelegramBotNest` repo'si (web + mobil + bot + AI); topshirish: link / fayl + skrinshot; mentor tekshiradi

| # | Dars | Vazifa |
|---|---|---|
| 1 | Front + back + baza + AI + bot: hammasi bir tizimda | **T** 5 savol (sxema rasmlari) |
| 2 | PRD: mahsulot hujjatini yozaman (PM) | — |
| 3 | MVC va mikroservislar | **T** 5 savol — fayl qaysi qism |
| 4 | AI-agent vs oddiy AI | **F** — o'z loyihangiz uchun agent rejasi (MD qarori bilan) |
| 5 | Claude Skills: AI'ning xulqini o'zgartiraman | **T** 5 savol (1 tasi SKILL.md kodi bilan) |
| 6 | AI-mahsulot etikasi (PM) | — |
| 7 | O'z Skill'imni yozaman | **F + R** — Skill'ni boshqa odam sinab ko'radi, tuzatish |
| 8 | Pipeline: React + Node + PostgreSQL + Telegram + AI | **L + R** — admin «Qabul qildim» → saytda holat |
| 9 | React Native: loyiham telefonga chiqadi | **L + R** — menyu kartasini bezash (Image, StyleSheet) |
| 10 | Navigation va AsyncStorage | **L + R** — sevimli pitsalar telefonda saqlanadi |
| 11 | Loyiha kuni: mobil versiyani yig'aman | **L + R** — «Buyurtmalarim» ekrani |
| 12 | Roadmap va RICE (PM) | — |
| 13 | Loyiha kuni: to'liq tizim end-to-end | **L** — TEST.md'ga xato holatlari va tuzatish |
| 14 | Metrikali pitch (PM) | — |

### 8-1 · Front + back + baza + AI + bot — T (5 savol, sxema rasmlari)
- **Darsdan:** mahsulot — komponentlar tizimi; Foydalanuvchi → Frontend → Backend → Database → ekranda natija; request/response; Database — doimiy xotira;
  qism o'chsa nima bo'ladi; ko'p kirish yo'li (web / bot / mobil) — bitta Backend; AI — alohida qism, Backend orqali.
- **Savollar:**
  1. «To'g'ri tartibdagi buyurtma yo'li qaysi?» ✔ Foydalanuvchi → Frontend → Backend → Database · chalg'ituvchi: Frontend → Database (to'g'ridan-to'g'ri).
  2. **Rasmli sxema:** Frontend'dan Database'ga to'g'ridan-to'g'ri strelka. «Sxemadagi xato?» ✔ so'rov Backend orqali o'tishi kerak.
  3. «Backend ishlayapti, Database o'chdi. Foydalanuvchi nimani ko'radi?» ✔ ma'lumot olinmaydi (xato) · chalg'ituvchi: hammasi ishlaydi.
  4. «Sayt, bot va mobil ilova bitta mahsulotda. Nechta Backend kerak?» ✔ bitta, umumiy · chalg'ituvchi: har biriga alohida.
  5. «AI tizimga qayerdan ulanadi?» ✔ Backend orqali · chalg'ituvchi: brauzerdan to'g'ridan-to'g'ri, Database ichida.
- **Rasm:** 1–2 sxema (HTML'da chizib skrinshot).

### 8-3 · MVC va mikroservislar — T (5 savol, kod-o'qish)
- **Darsdan:** MVC — Model (ma'lumot bilan ishlash), View (ko'rinish), Controller (so'rovni qabul qiladi); baza Model emas — Model u bilan ishlaydi;
  monolit — bitta ilova, mikroservis — bir nechta mustaqil ilova; MVC — ilova ichidagi tartib, monolit/mikroservis — tizim nechta ilovaga bo'lingani.
  Amaliyot: o'z botining `ARXITEKTURA.md` si.
- **Savollar:**
  1. «`telegram.controller.ts` MVC'ning qaysi qismi?» ✔ Controller.
  2. «Menyu ekrani (React komponent) qaysi qism?» ✔ View.
  3. «Buyurtmani Database'ga yozadigan service qaysi qism?» ✔ Model · chalg'ituvchi: PostgreSQL'ning o'zi.
  4. «Bitta Nest ilovasi — sayt, bot, admin hammasi ichida. Bu?» ✔ monolit.
  5. «To'lov alohida server, bildirishnoma alohida server. Bu?» ✔ mikroservislar · chalg'ituvchi: MVC.

### 8-4 · AI-agent vs oddiy AI — F
- **Darsdan:** oddiy AI — javob beradi; agent — maqsadga qarab o'zi keyingi qadamni tanlaydi (Idrok → Qaror → Amal); tool — agent chaqira oladigan funksiya
  (Database so'rovi, tashqi API, Telegram xabar); chegara (guardrail); qachon agent foydali. Amaliyot: botga faqat o'qiydigan tool.
  **MD v3 qarori:** «Loyihangiz uchun agentni rejalashtiring» topshirig'i darsdan uyga vazifaga o'tkazilgan.
- **O'quvchiga:** «O'z loyihangiz (bot, sayt yoki ilova) uchun agent rejasini `AGENT.md` ga yozing.»
  1. Maqsad — bitta gap.
  2. 2–3 ta tool: nomi, nima qiladi, faqat o'qiydimi yoki yozadimi.
  3. 2 ta chegara: agent nimani qilmasin.
  4. Qaysi amaldan oldin odamdan tasdiq so'raladi va nega.
  5. Loyihangizda oddiy AI yetarli bo'ladigan bitta holat — nega u yerda agent kerak emas.
- **Tekshiruv (mentor):** ☐ maqsad aniq · ☐ tool'lar o'qish/yozish bilan · ☐ chegaralar aniq amalga bog'langan · ☐ tasdiq yozadigan amalda · ☐ oddiy AI misoli asosli.

### 8-5 · Claude Skills — T (5 savol, 1 rasmli)
- **Darsdan:** Skill — papka, asosiy fayl `SKILL.md`; frontmatter (`---`, `name`, `description`, `---`) + body (qadamlar + misol); Claude oldindan faqat
  name + description'ni ko'radi, body'ni vazifa mos bo'lsa o'qiydi; natija uslubga yaqin chiqadi (so'zma-so'z emas). Amaliyot: `mahsulot-tavsifi` Skill'i.
- **Savollar:**
  1. «Claude Skill'ni ishlatish-ishlatmaslikni nimaga qarab hal qiladi?» ✔ name va description · chalg'ituvchi: body'dagi qadamlar, fayl hajmi.
  2. **SKILL.md kodi bilan** (frontmatter'da `description` yo'q). «Nima yetishmaydi?» ✔ description.
  3. «Body'ga nima yoziladi?» ✔ qadamlar va misol · chalg'ituvchi: faqat nom.
  4. «Bir xil so'rovga Skill ikki marta javob berdi — so'zlar biroz farq qildi. Bu xatomi?» ✔ yo'q — natija uslubga yaqin, so'zma-so'z emas.
  5. «Skill qanday saqlanadi?» ✔ papka, ichida SKILL.md · chalg'ituvchi: bitta .js fayl.

### 8-7 · O'z Skill'imni yozaman — F + R
- **Darsdan:** bitta Skill — bitta vazifa; name + description (nima qiladi + qachon) + body; jarayon: vazifa → yozish → sinov (2 mos + 1 mos emas) →
  kamchilik → tuzatib qayta sinash. Amaliyot: o'z Skill'i yozilgan va sinalgan.
- **O'quvchiga:** «Skill'ingizni boshqa odam sinab ko'rsin.»
  1. Do'stingiz yoki oila a'zongizga Skill nima qilishini aytmasdan, o'z so'zi bilan 3 ta so'rov yozdiring.
  2. Har so'rov natijasini README jadvaliga yozing: so'rov · Skill ishladimi · natija qoidaga mosmi.
  3. Ishlamagan joy bo'yicha `description` yoki body'ni aniqlashtiring; body'ga bitta misol qo'shing.
  4. O'sha 3 so'rovni qayta sinang.
  5. `SKILL.md` (oldin va keyin) va 2 ta skrinshot.
- **Tekshiruv (mentor):** ☐ 3 so'rov boshqa odamdan · ☐ jadval to'ldirilgan · ☐ aniq tuzatish (qaysi qator) · ☐ misol qo'shilgan · ☐ qayta sinov natijasi.

### 8-8 · Pipeline: React + Node + PostgreSQL + Telegram + AI — L + R
- **Darsdan:** A1 — sayt menyuni Backend'dan oladi; A2 — saytdagi buyurtma Database'ga va adminga (Telegram, `ADMIN_CHAT_ID`); A3 — AI javobi va butun oqimni sinash.
  Formula: prompt → AI kod → test → xato → tuzat → qayta test.
- **O'quvchiga:** «Admin buyurtmani qabul qilsa, mijoz buni saytda ko'rsin.»
  1. Adminga kelgan xabar ostida «✅ Qabul qildim» inline tugmasi.
  2. Bosilganda buyurtma holati Database'da `qabul qilindi` bo'lsin.
  3. Saytda buyurtma holati ko'rinsin (sahifa yangilanganda).
  4. Telegram va sayt skrinshotlari (oldin / keyin), repo linki.
- **Tekshiruv (mentor):** ☐ inline tugma admin xabarida · ☐ Database'da holat ustuni yangilanadi · ☐ saytda holat · ☐ oqim boshidan oxirigacha sinalgan.

### 8-9 · React Native: loyiham telefonga chiqadi — L + R
- **Darsdan:** React → mobil: `div` → `View`, `p` → `Text`, `img` → `Image`; `StyleSheet.create`, `backgroundColor` (camelCase); Expo Go — telefonda ko'rish.
  Amaliyot: AvtoPizza menyusi telefonda (backend'dan), narx o'zgarsa ilovada ham o'zgaradi.
- **O'quvchiga:** «Menyu ekranini bezang.»
  1. Har pitsaga rasm (`Image`).
  2. Narx alohida uslubda (`Text` + `StyleSheet`).
  3. Ekran tepasida AvtoPizza sarlavhasi va logotip.
  4. Hamma uslub `StyleSheet.create` ichida — `style={{…}}` emas.
  5. Telefon skrinshoti va repo linki.
- **Tekshiruv (mentor):** ☐ Image har kartada · ☐ StyleSheet.create · ☐ camelCase xossalar · ☐ telefon skrinshoti (Expo Go).

### 8-10 · Navigation va AsyncStorage — L + R
- **Darsdan:** FlatList, `navigation.navigate('Tafsilot', …)`, `route.params`, `goBack()`, `fetch` + `useEffect` (o'sha NestJS backend), AsyncStorage — telefonda saqlash.
  Amaliyot: Menyu (backend'dan) → Tafsilot → Menyuga qaytish. **AsyncStorage amaliyotda ishlatilmagan.**
- **O'quvchiga:** «Sevimli pitsalarni telefonda saqlang.»
  1. Tafsilot ekranida «⭐ Sevimli» tugmasi.
  2. Sevimlilar AsyncStorage'da saqlansin.
  3. Menyu'da sevimli pitsa yonida ⭐.
  4. Ilovani butunlay yopib qayta oching — ⭐ joyida turibdi.
  5. Ikki skrinshot (yopishdan oldin va keyin) va repo linki.
- **Tekshiruv (mentor):** ☐ AsyncStorage'ga yozish va o'qish · ☐ route.params bilan to'g'ri pitsa · ☐ menyuda belgi · ☐ qayta ochilganda saqlangan.

### 8-11 · Loyiha kuni: mobil versiyani yig'aman — L + R
- **Darsdan:** A1 — savat (`useState`, sarlavhada `savat.length`, «Jami» `reduce`); A2 — buyurtma telefondan backend'ga (o'sha jadval); A3 — sinash va ulashish (Expo Go QR).
- **O'quvchiga:** «"Buyurtmalarim" ekranini qo'shing.»
  1. Yangi ekran: telefondan berilgan buyurtmalar backend'dan olinadi (GET).
  2. Har buyurtmada taomlar, jami va vaqt.
  3. Buyurtma bo'lmasa: «Hali buyurtma yo'q».
  4. Savat ekranidan «Buyurtmalarim»ga o'tish tugmasi.
  5. Telefon skrinshoti va repo linki.
- **Tekshiruv (mentor):** ☐ ma'lumot backend'dan (qattiq yozilmagan) · ☐ jami to'g'ri · ☐ bo'sh holat · ☐ navigatsiya ishlaydi.

### 8-13 · Loyiha kuni: to'liq tizim end-to-end — L
- **Darsdan:** A1 — uchala yo'l (web, telefon, bot) bitta jadvalga; A2 — `TEST.md` jadvali (✓/✗), qizil katakni tuzatish; A3 — ishga tushirish.
  Formula: yig' → sina → xatoni top → tuzat → ishga tushir.
- **O'quvchiga:** «Tizimni xato holatlarda sinang.»
  1. `TEST.md` ga 3 ta yangi qator: bo'sh savat bilan buyurtma · Backend o'chiq paytda sayt · bot'ga noma'lum buyruq.
  2. Har birining natijasini yozing: tizim nima qildi, foydalanuvchi nima ko'rdi.
  3. Kamida bittasini tuzating (tushunarli xabar chiqsin) va qayta sinang.
  4. README'ga tizim chizmasi va uchala kirish yo'li.
  5. Repo linki.
- **Tekshiruv (mentor):** ☐ 3 yangi qator natijasi bilan · ☐ bitta tuzatish commit'i · ☐ qayta sinov ✓ · ☐ README'da chizma.

---

## 9–14-modul — umumiy qoida: «darsda Maydon, uyda o'z MVP'ingiz»

9-moduldan boshlab darslar ustozning «Maydon» loyihasida (`github.com/Azizbekcrypto/maydon`) yuradi. **Har amaliyot blokining 5-qadami — «O'z g'oyangiz»:**
o'quvchi o'z MVP'i uchun promptni to'ldirib saqlaydi va «uyda o'z papkangizda yuborasiz» deyiladi (MD v3). Shuning uchun bu modullarda uyga vazifa —
**darsdagi bloklarni o'z loyihasida bajarish**, aniq natija va mentor ro'yxati bilan. Topshirish: o'z repo linki (+ deploy manzili) + skrinshot.
AI yordamchi — vazifa matnida «agent» (darsdagi Antigravity o'rnida Gemini/Copilot ham bo'ladi; 18+ cheklovi).

## 9-modul «Loyiham kim uchun va nima uchun» (LMS bo'lim 108)

| # | Dars | Vazifa |
|---|---|---|
| 1 | Mahsulot va loyiha (PM) | — |
| 2 | Custdev: 5 ta real intervyu (PM) | — |
| 3 | Intervyu tahlili va MVP (PM) | — |
| 4 | Mini-MVP arxitekturasi | **L + R** — o'z MVP'ingiz: Backend + Database + birinchi ekran (statik) |
| 5 | Animatsiya va mikrointeraksiyalar | **L + R** — o'z MVP'ingizda 3 ta harakat |
| 6 | Birinchi kundan analitika (PM) | — |
| 7 | MVP ishlab chiqish — 1-qism | **L + R** — birinchi ekran Backend'dan, yuklanish va xato holati |
| 8 | Dizayn va MVP'ni jonlantirish (PM) | — |
| 9 | MVP ishlab chiqish — 2-qism | **L** — asosiy harakat + deploy, telefonda ochiladi |
| 10 | Real odam bilan test (PM) | — |
| 11 | Fidbek bo'yicha iteratsiya | **L** — o'z `SINOV.md`: ★ → talab → tuzatish → qayta sinov |
| 12 | Pitch (PM) | — |

### 9-4 · Mini-MVP arxitekturasi — L + R
- **Darsdan:** MVP ro'yxati → chizma: uch qism (sayt · Backend · Database); `bandlar` jadvali; o'yinchining ikki yo'li; ega kirishi; stack tanlovi; deploy — qaysi qism qayerda.
  A1 — «Maydon» fork, Backend + Neon (`DATABASE_URL`), `bandlar` jadvali; A2 — sayt va statik kataklar. Har blok 5-qadami — o'z MVP'i uchun prompt.
- **O'quvchiga:** «Darsda saqlagan ikki promptni o'z MVP'ingiz papkasida bajaring.»
  1. O'z MVP'ingiz uchun repo: `backend/` va `web/`.
  2. Backend Neon'ga ulansin; asosiy jadvalingiz yaratilsin (ustunlarini README'ga yozing).
  3. Birinchi ekran hozircha statik ma'lumot bilan chiqsin.
  4. README'ga uch qism chizmasi: sayt → Backend → Database, har biri qayerda turadi.
  5. Repo linki; Neon'dagi jadval va `localhost:5173` skrinshotlari.
- **Tekshiruv (mentor):** ☐ repo'da backend va web · ☐ jadval Neon'da, ustunlar README'da · ☐ birinchi ekran ochiladi · ☐ `.env` repo'da yo'q · ☐ chizma.

### 9-5 · Animatsiya va mikrointeraksiyalar — L + R
- **Darsdan:** transform, transition (CSS), holatni rang bilan bildirish, Motion (`motion.div`, `AnimatePresence`, `MotionConfig`), ortiqcha harakat — zarar;
  xatoni topish. Amaliyot: Maydon'ga 3 element (bosilgan katak kichrayadi, band katak rangi silliq o'zgaradi, yozuv kirib-chiqadi); CSS qismi qo'lda.
- **O'quvchiga:** «O'z MVP'ingizga uchta harakat qo'shing — har biri foydalanuvchiga nimadir aytsin.»
  1. Bosiladigan elementga bosish javobi: `transform` + `transition` (CSS'ni o'zingiz yozing).
  2. Holat o'zgarishi rang bilan, silliq.
  3. Paydo bo'ladigan / yo'qoladigan element — Motion bilan.
  4. Hech bir harakat 0.5 soniyadan uzun emas; «harakatni kamaytirish» sozlamasi yoqilgan telefonda harakat o'chadi (`MotionConfig`).
  5. Repo linki va qisqa ekran yozuvi (10–20 soniya) yoki 3 skrinshot.
- **Tekshiruv (mentor):** ☐ CSS transition qo'lda yozilgan · ☐ 3 harakat har xil vazifada · ☐ uzun/ortiqcha harakat yo'q · ☐ reduced motion hisobga olingan.

### 9-7 · MVP ishlab chiqish — 1-qism — L + R
- **Darsdan:** talabning uch qismi (qayerda · nima qilsin · nima buzilmasin); har qator — bitta tekshiruv. A1 — Backend kun bo'yicha kataklarni beradi
  (`/vaqtlar?kun=`); A2 — sayt kataklarni Backend'dan oladi, kun almashadi; A3 — «Yuklanmoqda…» va Backend javob bermasa xabar. Har blok 5-qadami — o'z g'oyasi uchun uch qator.
- **O'quvchiga:** «O'z MVP'ingizning birinchi ekranini Backend'ga ulang.»
  1. Backend birinchi ekran ro'yxatini beradigan GET yo'li (darsda yozgan talabingiz bo'yicha).
  2. Sayt ro'yxatni Backend'dan olsin (statik ma'lumot olib tashlansin).
  3. Kelguncha «Yuklanmoqda…», Backend javob bermasa — tushunarli xabar.
  4. Talabning har qatorini tekshirib, README'ga ✓ bilan yozing.
  5. Repo linki va 3 skrinshot: ro'yxat, yuklanish, xato (Backend to'xtatilgan).
- **Tekshiruv (mentor):** ☐ GET yo'li · ☐ statik ma'lumot yo'q · ☐ yuklanish va xato holati · ☐ README'da talab ✓.

### 9-9 · MVP ishlab chiqish — 2-qism — L
- **Darsdan:** A1 — band qilish (asosiy harakat; ikki oynada tekshirish, 409); A2 — ega sahifasi (`EGA_PAROLI`, `JWT_SECRET`, token); A3 — deploy: Render (backend) + Netlify (web), telefondan ochish.
- **O'quvchiga:** «MVP'ingizni internetga chiqaring.»
  1. Asosiy harakat ishlasin (yozish): ikki oynada sinang — bir xil narsani ikki kishi ololmasin (agar MVP'ingizda shunday holat bo'lsa).
  2. Faqat bir kishi ko'radigan ma'lumot bo'lsa — parol bilan himoyalangan sahifa.
  3. Backend Render'da, sayt Netlify'da; telefondan ochiladi.
  4. Netlify manzili, repo linki va telefondagi skrinshot.
- **Tekshiruv (mentor):** ☐ telefonda ochiladi · ☐ asosiy harakat ishlaydi, ma'lumot bazada · ☐ parollar `.env`/Render'da, repo'da emas · ☐ ikki oyna sinovi (kerak bo'lsa).

### 9-11 · Fidbek bo'yicha iteratsiya — L
- **Darsdan:** A1 — kuzatuv `SINOV.md` ga, «Vazifaga ta'siri», ★; A2 — ★ dan talab, agent tuzatadi, `git diff` bilan haqiqiy o'zgarishni tekshirish;
  A3 — chiqarish va o'sha vazifa bilan qayta sinov. 5-qadamlar: uyda o'z MVP'ida — uydagi sinov, ★, tuzatish, yangi odam bilan qayta sinov.
- **O'quvchiga:** «O'z MVP'ingizda kuzatish → tuzatish → qayta sinov aylanasini yuriting.»
  1. MVP'ingizni oila a'zosi yoki do'stingizga bitta vazifa bilan bering; tushuntirmasdan kuzating.
  2. `SINOV.md`: kuzatuvlar, «Vazifaga ta'siri», ★.
  3. ★ dan uch qatorli talab yozing va tuzating; `git diff` bilan faqat kerakli fayllar o'zgarganini tekshiring.
  4. Deploy qiling va o'sha vazifani yangi odamga bering; natijani `SINOV.md` ga yozing.
  5. Repo linki.
- **Tekshiruv (mentor):** ☐ kuzatuv real odamdan · ☐ ★ asosli · ☐ talab uch qatorli · ☐ tuzatish commit'i · ☐ qayta sinov natijasi.

---

## 10-modul «Gipotezani qanday tekshirish» (LMS bo'lim 109)

| # | Dars | Vazifa |
|---|---|---|
| 1 | OKR (PM) | — |
| 2 | O'z event-tracking tizimim | **L + R** — o'z MVP'ingizda 3 hodisa jadvalga yoziladi |
| 3 | Jonli mini-dashboard | **L + R** — o'z dashboard'ingiz internetda |
| 4 | A/B test (PM) | — |
| 5 | Kiberxavfsizlik asoslari | **L** — o'z MVP'ingiz auditi: uch zaiflik |
| 6 | Xavfsizlik = ishonch (PM) | — |
| 7 | Production-deploy: domen, SSL, monitoring | **L + R** — nom, HTTPS, `/health`, ikki monitor |
| 8 | Production darajasiga — 1-qism | **L** — chegara (429), kutish/xato holati, prod ro'yxati README'da |
| 9 | Production darajasiga — 2-qism va code review | **L** — o'z repo'ingizda PR + review + birlashtirish |
| 10 | Yillik himoya (PM) | — |
| 11 | Pitch repetitsiyasi (PM) | — |

### 10-2 · O'z event-tracking tizimim — L + R
- **Darsdan:** har harakat → hodisa → jadval; `hodisalar` jadvali va `POST /hodisalar`; uch chaqiruv to'g'ri joyda (QKod); `brauzer_id`;
  Neon'da `SELECT nom, COUNT(DISTINCT brauzer_id) FROM hodisalar GROUP BY nom;`; agent nima desa ham — jadvalga qarash.
- **O'quvchiga:** «O'z MVP'ingizdagi uch qadamni sanang.»
  1. Uch hodisa tanlang: ochdi → asosiy harakatni boshladi → tugatdi (README'ga yozing).
  2. `hodisalar` jadvali va `POST /hodisalar` — o'z Backend'ingizda.
  3. Uch chaqiruvni to'g'ri joyga o'zingiz yozing.
  4. Ikki brauzerdan sinang; Neon'dagi GROUP BY natijasi skrinshoti.
  5. Repo linki.
- **Tekshiruv (mentor):** ☐ 3 hodisa foydalanuvchi o'tadigan tartibda · ☐ chaqiruvlar to'g'ri joyda (masalan «tugatdi» — muvaffaqiyatdan keyin) · ☐ brauzer_id bilan sanaladi · ☐ Neon skrinshoti.

### 10-3 · Jonli mini-dashboard — L + R
- **Darsdan:** A1 — Backend bugungi raqamlarni beradi, `/dashboard` parol bilan; A2 — raqamlar 5 soniyada o'zi yangilanadi; A3 — internetda, sinfdosh kirsa raqam oshadi, «Yangilandi: 18:45:05».
- **O'quvchiga:** «O'z MVP'ingiz uchun dashboard.»
  1. `/dashboard` — faqat parol bilan; 10-2 dagi uch qadam bugungi soni.
  2. Sahifani yangilamasdan 5 soniyada bir yangilansin; «Yangilandi: …» vaqti.
  3. Egaga kerak bo'lgan yana bitta qator (o'zingiz tanlang, sababi README'da).
  4. Internetda: do'stingiz MVP'ingizni ochsin — raqam oshganini skrinshot qiling.
  5. Repo linki va dashboard manzili.
- **Tekshiruv (mentor):** ☐ parolsiz ochilmaydi · ☐ avto-yangilanish · ☐ internetda ishlaydi · ☐ qo'shimcha qator asosli.

### 10-5 · Kiberxavfsizlik asoslari — L
- **Darsdan:** SQL injection (matn qo'shib yasalgan so'rov → parametrli so'rov, `find({ where: { … } })`); XSS (`dangerouslySetInnerHTML`); kodda maxfiy kalit
  (`|| '…'` zaxira kalit); ega kirishiga 2FA; tekshirish — kodni o'qib uch belgini ko'rish; push'dan oldin `git status`.
- **O'quvchiga:** «O'z MVP'ingizni uch zaiflik bo'yicha tekshiring va README'ga audit yozing.»
  1. Har so'rov parametrli — matn qo'shib yasalgan SQL yo'q.
  2. Kodda birorta kalit yoki parol yo'q (zaxira qiymat ham) — hammasi `.env`/Render'da.
  3. Foydalanuvchi yozgan matn sahifaga xavfsiz chiqadi (`dangerouslySetInnerHTML` yo'q).
  4. README'da jadval: zaiflik · qayerda tekshirdim (fayl) · natija · tuzatdimmi.
  5. Ega sahifangiz bo'lsa — 2FA (ixtiyoriy). Repo linki.
- **Tekshiruv (mentor):** ☐ kodda qidiruvda kalit/parol yo'q · ☐ so'rovlar parametrli · ☐ XSS yo'q · ☐ audit jadvali fayl nomlari bilan · ☐ topilgan bo'lsa — tuzatish commit'i.

### 10-7 · Production-deploy: domen, SSL va monitoring — L + R
- **Darsdan:** A1 — sayt nomi (Netlify), `WEB_ORIGIN` (CORS), HTTPS tekshiruvi; A2 — `GET /health` → `{"holat":"ok"}`; A3 — UptimeRobot: sayt va `/health` monitori, ogohlantirish (vaqtinchalik `/yoq`).
- **O'quvchiga:** «O'z MVP'ingizni haqiqiy prod holatiga keltiring.»
  1. Netlify'da tushunarli nom; Backend'da `WEB_ORIGIN` yangi manzil.
  2. `https://` — brauzer ogohlantirishsiz.
  3. `GET /health`.
  4. UptimeRobot'da ikki monitor (sayt va `/health`) — ikkalasi «Up».
  5. Manzil, repo linki va UptimeRobot skrinshoti.
- **Tekshiruv (mentor):** ☐ nom va HTTPS · ☐ `/health` ochiladi · ☐ 2 monitor Up · ☐ CORS yangi manzilga.

### 10-8 · Production darajasiga — 1-qism — L
- **Darsdan:** prod ro'yxati; `prod` tarmog'i; A1 — so'rovlar chegarasi (429) yozadigan va parol tekshiradigan yo'llarga; A2 — Backend kechiksa/javob bermasa sayt aytadi;
  A3 — A/B yakuni va README (prod ro'yxati, gipoteza natijasi).
- **O'quvchiga:** «Eng yaxshi loyihangizni prod ro'yxati bo'yicha prodga ko'taring.»
  1. `prod` tarmog'ida ishlang.
  2. Yozadigan va parol tekshiradigan yo'llarga chegara — ortiqcha so'rovga 429.
  3. Backend kechiksa yoki javob bermasa — foydalanuvchiga nima qilish kerakligi aytiladi.
  4. README'da prod ro'yxati: bugungi ishlar, auditdan qolganlari, gipotezangiz natijasi.
  5. Repo linki (`prod` tarmog'i).
- **Tekshiruv (mentor):** ☐ 429 ishlaydi (skrinshot yoki sinov) · ☐ kutish va xato holati · ☐ README prod ro'yxati · ☐ ishlar `prod` tarmog'ida.

### 10-9 · Production darajasiga — 2-qism va code review — L
- **Darsdan:** A1 — PR, har o'zgarish yonida sabab (agent ro'yxatini GitHub'dagi fayllar bilan solishtirish); A2 — juftlikda code review (kamida 2 izoh, «Viewed»,
  Sabab + Qaror javoblari); A3 — tuzatish, `REVIEW.md`, birlashtirish.
- **O'quvchiga:** «O'z loyihangizda PR jarayonini oxirigacha olib boring.»
  1. `prod` → `main` PR: tavsifda har o'zgarish va sababi.
  2. Sinfdoshingiz kamida 2 izoh qoldirsin; har biriga «Sabab» va «Qaror» bilan javob bering.
  3. «Tuzataman» degan izohni tuzating; `REVIEW.md` ga izoh-javoblarni yozing.
  4. PR'ni birlashtiring.
  5. PR linki.
- **Tekshiruv (mentor):** ☐ tavsifda sabablar · ☐ ≥ 2 izoh va javoblar · ☐ tuzatish commit'i · ☐ birlashtirilgan (merged) · ☐ REVIEW.md.

---

## 11–14-modul — muhim farq: darslar endi o'quvchining O'Z repo'sida

11-moduldan boshlab amaliyot bloklari «Maydon»da emas — **«Antigravity'da o'z repo'ngizni oching»**. Demak darsdagi ishni uyda takrorlatish ma'nosiz.
Bu modullarda uyga vazifa — **darsdan keyingi qadam**: xato holatlari, chetlab o'tishga urinish, ikkinchi qurilma / real odam bilan sinov, real ma'lumot.
Mobil trek (Expo) va web-trek (Vite, Netlify) — vazifa ikkalasiga ham yoziladi.

## 11-modul «Final loyiha: g'oya va rivojlantirish» (LMS bo'lim 110) — atamalar: qism · ilova/sayt · chizma («sxema», «frontend» yo'q)

| # | Dars | Vazifa |
|---|---|---|
| 1–6 | G'oya, RICE, Custdev ×2, PRD, roadmap (PM) | — |
| 7 | Figma o'rniga jonli prototip | **L** — prototipni 2 odamda sinash, 1 tuzatish |
| 8 | Arxitektura, stek va platforma tanlovi | **T** 5 savol |
| 9 | React Native'ni yangilash va Expo | **R + L** — ikkinchi telefonda / boshqa o'lchamda sinash |
| 10 | Vibe-coding: poydevor — baza, avtorizatsiya, deploy | **R + L** — kirishning 3 xato holati |
| 11 | Vibe-coding: 1-funksiya | **R + L** — formaning chekka holatlari (Backend 400 + xabar) |
| 12 | Vibe-coding: 2-funksiya | **R + L** — ruxsatni chetlab o'tishga urinish (401/403) |
| 13 | Auditoriya bilan test (PM) | — |
| 14 | Vibe-coding: 3-funksiya | **L** — `TEST.md`: uch funksiya, telefonda to'liq tekshiruv |
| 15–16 | Mentor 1:1, pitch (PM) | — |
| — | Demo Day 7 | — |

### 11-7 · Figma o'rniga jonli prototip — L
- **Darsdan:** ekranlar (wireframe) qog'ozda (QMustaqil, 15 daq); prototip — bosiladigan ekranlar; talab; A1 — o'z repo, `prototip/` (Vite), bosiladigan ekranlar,
  telefon ko'rinishida tekshirish; A2 — uch animatsiya va GitHub. QKod — sonni silliq yangilash.
- **O'quvchiga:** «Prototipingizni ikki odamda sinang — kod yozishdan oldin.»
  1. Ikki odamga (oila, do'st) bitta vazifa bering: asosiy yo'lni bosib o'tish. Tushuntirmang.
  2. README'ga «Prototip sinovi»: kim, qanday vazifa, qayerda to'xtadi yoki adashdi.
  3. Ikkalasi to'xtagan joyni tuzating (ekran yoki tugma yozuvi); push qiling.
  4. Repo linki.
- **Tekshiruv (mentor):** ☐ 2 ta real odam · ☐ to'xtagan joy aniq yozilgan · ☐ tuzatish commit'i · ☐ prototip hali ham bosiladi.

### 11-8 · Arxitektura, stek va platforma tanlovi — T (5 savol)
- **Darsdan:** uch qism (ilova · Backend · Database), uch jadval, boshqa odam o'zgartiradigan joylar (real vaqt nuqtalari); ekran qachon yangilanadi — ilova qayta
  so'raganda (QKod «Yangilash» bilan so'rash); platforma — to'rt savol: qayerda ochadi · telefon imkoniyati kerakmi · link bilan ulashish muhimmi · qaysi stekni yaxshi bilasiz;
  trek faqat birinchi qismni almashtiradi; stek: NestJS + Render · Neon · Expo yoki React (Vite) + Netlify. Amaliyot: README «Arxitektura».
- **Savollar:**
  1. «Foydalanuvchi mahsulotni ko'chada, telefonda ochadi; unga eslatma kelishi kerak. Qaysi trek?» ✔ mobil · chalg'ituvchi: web.
  2. «To'rt savoldan qaysi biri web tomonga tortadi?» ✔ link bilan tez ulashish muhim bo'lsa · chalg'ituvchi: telefon kamerasi kerak bo'lsa.
  3. «Mobil trekdan web-trekka o'tdingiz. Qaysi qism boshqa texnologiyaga o'tadi?» ✔ faqat ilova (sayt bo'ladi) · chalg'ituvchi: Backend ham, Database ham.
  4. «2-telefonda kimdir qo'shildi. 1-telefondagi "8 / 10" qachon "9 / 10" bo'ladi?» ✔ ilova qayta so'raganda · chalg'ituvchi: o'sha soniyada o'zi.
  5. «Ilovaning ko'rinishi (ranglar, dizayn) to'rt savolga kiradimi?» ✔ yo'q · chalg'ituvchi: ha, birinchi savol.

### 11-9 · React Native'ni yangilash va Expo — R + L
- **Darsdan:** mobil trek — Expo Go'da prototip telefonda (A1), telefonda jonli: animatsiyalar (A2); web-trek — telefon kengligida (390 px) bitta ustun (A1), PWA + Netlify (A2).
  QKod — telefonda kartalarni ustma-ust qo'yish.
- **O'quvchiga:** «Prototipingiz boshqa telefonda ham buzilmasin.»
  1. Ikkinchi qurilmada oching: boshqa odamning telefoni (mobil trek — Expo Go; web-trek — Netlify manzili).
  2. Kichik ekranni ham tekshiring (web-trekda DevTools'da 360 px).
  3. Uzilgan yozuv, sig'magan tugma yoki ustma-ust tushgan joyni toping va tuzating.
  4. Ikki qurilma skrinshoti (tuzatishdan keyin) va repo linki.
- **Tekshiruv (mentor):** ☐ ikki xil qurilma · ☐ kichik ekranda yozuvlar uzilmagan · ☐ tuzatish commit'i (yoki «muammo yo'q» + isbot skrinshoti).

### 11-10 · Vibe-coding: poydevor — baza, avtorizatsiya, deploy — R + L
- **Darsdan:** A1 — Database va kirish (ro'yxatdan o'tish, kirish, `JWT_SECRET`, Neon); A2 — Backend Render'da, tokensiz → 401; A3 — ilova Backend'ga ulanadi
  (`EXPO_PUBLIC_API_URL` / `VITE_API_URL`), token saqlanadi, asosiy ro'yxat Backend'dan.
- **O'quvchiga:** «Kirish xato holatlarda nima deyishini tekshiring va tuzating.»
  1. Noto'g'ri parol bilan kiring — ilova tushunarli xabar bersin.
  2. Bor telefon/login bilan qayta ro'yxatdan o'ting — Backend rad etsin, ilova sababini aytsin.
  3. Internetni o'chirib kiring — ilova qotib qolmasin, xabar bersin.
  4. Qaysi biri yomon chiqqan bo'lsa — tuzating.
  5. Uch holat skrinshoti va repo linki.
- **Tekshiruv (mentor):** ☐ uch holat sinalgan · ☐ har birida tushunarli xabar (texnik xato matni emas) · ☐ ikki marta ro'yxatdan o'tish Backend'da to'xtatiladi · ☐ `.env` repo'da yo'q.

### 11-11 · Vibe-coding: 1-funksiya — R + L
- **Darsdan:** A1 — funksiyaning birinchi qismi (e'lon berish), natija ro'yxatda; A2 — asosiy harakat (qo'shilish), natija Database'da, bo'lmasligi kerak bo'lgan holatda
  Backend yozmaydi; A3 — ro'yxat yangilanishi (pastga tortish / «Yangilash»).
- **O'quvchiga:** «1-funksiyangiz formasini chekka holatlarda sinang.»
  1. Uch chekka holatni sinang: bo'sh maydon · juda uzun matn (500+ belgi) · noto'g'ri format (masalan sana yoki son o'rniga harf).
  2. Har birida Backend yozmasin (400) va ilova nima noto'g'riligini aytsin.
  3. Neon'da noto'g'ri yozuv qolmaganini tekshiring.
  4. Uch holat skrinshoti va repo linki.
- **Tekshiruv (mentor):** ☐ uch holat · ☐ tekshiruv Backend'da (faqat ilovada emas) · ☐ ilova xabari aniq · ☐ Database'da yaroqsiz qator yo'q.

### 11-12 · Vibe-coding: 2-funksiya — R + L
- **Darsdan:** A1 — asosiy harakat va ruxsat (ruxsatni Backend beradi); A2 — natija boshqa telefonda (ikki akkaunt); A3 — tugma faqat ruxsat bor joyda.
- **O'quvchiga:** «Tugmani yashirish yetmaydi — Backend ham ruxsatsiz so'rovni to'xtatsinmi, tekshiring.»
  1. Tugma yo'q holatda o'sha amalni to'g'ridan-to'g'ri Backend'ga yuboring (Postman yoki brauzer konsoli): tokensiz — 401 kutiladi.
  2. Boshqa akkaunt tokeni bilan, ruxsat yo'q holatda — 403 kutiladi.
  3. Kutilgan javob kelmasa — Backend'ni tuzating va qayta sinang.
  4. Ikki so'rov skrinshoti (status ko'rinsin) va repo linki.
- **Tekshiruv (mentor):** ☐ tokensiz → 401 · ☐ ruxsatsiz akkaunt → 403 · ☐ Database'da o'zgarish yo'q · ☐ tuzatish (kerak bo'lsa) commit'i.

### 11-14 · Vibe-coding: 3-funksiya — L
- **Darsdan:** A1 — Backend: yangi harakat Database'ga; A2 — bir vaqtda bosish (ikki marta tez / ikki odam bir lahzada); A3 — ilova telefonda, oldingi funksiyalar bilan.
- **O'quvchiga:** «Uchala funksiyani deploy qilingan versiyada to'liq tekshiring.»
  1. Repo ildizida `TEST.md`: har funksiya uchun ikki qator — asosiy holat va bitta chekka holat.
  2. Har qatorni telefonda, internetdagi versiyada bajaring: ✓ yoki ✗ va nima bo'ldi.
  3. ✗ bo'lsa — tuzating va qatorni qayta tekshiring.
  4. Repo linki.
- **Tekshiruv (mentor):** ☐ 3 funksiya × 2 holat · ☐ internetdagi versiyada sinalgan · ☐ ✗ lar tuzatilgan yoki sababi yozilgan · ☐ oldingi funksiyalar buzilmagan.

---

## 12-modul «Real vaqt va ishga tushirish» (LMS bo'lim 111)

| # | Dars | Vazifa |
|---|---|---|
| 1 | Landing va kopirayting (PM) | — |
| 2 | WebSocket: real vaqt asoslari | **R + L** — README «Real vaqt» + ikki qurilma sinovi |
| 3 | Real vaqt funksiyasi spetsifikatsiyasi (PM) | — |
| 4 | Jonli bildirishnomalar va presence | **R + L** — eslatma haqiqiy vaqtda (mobil) / tasma saqlanadi (web) |
| 5 | «Buz va tuzat»: ulanish uzilishi va reconnect | **L** — yana ikki buzish usuli `BUZISH.md` da |
| 6–8 | Kanallar, 50 foydalanuvchi, xulq tahlili (PM) | — |
| 9 | Real vaqt retention-mexanikasi | **R + L** — 3 kunlik real sanoq va qaror |
| 10–12 | 50 foydalanuvchi, mentor 1:1, metrikali pitch (PM) | — |

### 12-2 · WebSocket: real vaqt asoslari — R + L
- **Darsdan:** so'rov/javob vs ochiq ulanish; konvert ichida nima bor; kim ulanayotgani; tinglovchi (QKod — hodisa kelganda sonni qayta so'rash); ulanish belgisi;
  o'z sxemasi (QMustaqil). A1 — ilova Backend'ga ulanadi va belgi ko'rsatadi; **A2 — sxema README'da («vaqt qolmasa — uyga vazifa», MD 02-FILTR 11)**.
- **O'quvchiga:** «Real vaqtni hujjatlang va ikki qurilmada isbotlang.»
  1. README'ning «Real vaqt» bo'limi: darsdagi sxemangiz jadval ko'rinishida (agar darsda ulgurmagan bo'lsangiz).
  2. Ikki qurilmada oching: birida o'zgartiring — ikkinchisida sahifani yangilamasdan o'zgarsin.
  3. Ulanish belgisi «ulangan» holatda ko'rinsin.
  4. 10–20 soniyalik video yoki ikki skrinshot (oldin/keyin) va repo linki.
- **Tekshiruv (mentor):** ☐ README jadvali sxemaga mos · ☐ ikkinchi qurilmada o'zi yangilanadi · ☐ belgi bor.

### 12-4 · Jonli bildirishnomalar va presence — R + L
- **Darsdan:** A1 — «Hozir ko'ryapti» soni; A2 — ochiq ilovada jonli xabar (foydalanuvchining o'ziga tegishli o'zgarishda); A3 — mobil: ilova yopiq paytda eslatma
  (**test holatida** sinalgan); web: «Xabarlar» tasmasi.
- **O'quvchiga:** «Darsda test holatida sinalgan narsani haqiqiy sharoitda tekshiring.»
  - Mobil trek: eslatmani haqiqiy vaqtga qo'ying (masalan ertangi tadbirdan 1 soat oldin) — telefoningizga kelgan bildirishnoma skrinshoti.
  - Web-trek: «Xabarlar» tasmasi sahifa yangilangandan keyin ham saqlanib tursin (oxirgi 10 ta) — oldin/keyin skrinshot.
  - Ikkala trek: «Hozir ko'ryapti» — ikki qurilmada son 2 bo'lgani skrinshoti.
  - Repo linki.
- **Tekshiruv (mentor):** ☐ eslatma test emas, haqiqiy vaqtda kelgan / tasma saqlanadi · ☐ presence ikki qurilmada · ☐ xabar matni foydalanuvchiga tushunarli.

### 12-5 · «Buz va tuzat»: ulanish uzilishi va reconnect — L
- **Darsdan:** buzish rejasi (har usuldan oldin «Nima kutaman»); A1 — uch usul bilan buzish va yozuv (Nima qildim · Nima kutdim · Nima bo'ldi · Buzildi/Buzilmadi);
  A2 — tuzatish va o'sha usul bilan qayta tekshirish. QKod — tinglovchi bir marta qo'shiladi.
- **O'quvchiga:** «Yana ikki usul bilan buzib ko'ring.»
  1. Sekin internet: DevTools → Network → «Slow 4G» (yoki telefonda zaif signal).
  2. Ilovani fonda 10 daqiqa qoldirib, qayta oching.
  3. Har usuldan oldin «Nima kutaman», keyin «Nima bo'ldi» — `BUZISH.md` ga.
  4. «Buzildi» bo'lsa — tuzating va o'sha usul bilan qayta tekshiring.
  5. Repo linki.
- **Tekshiruv (mentor):** ☐ 2 yangi yozuv to'liq · ☐ «Nima kutdim» oldin yozilgan (taxmin emas) · ☐ buzilgan bo'lsa — tuzatish va qayta tekshiruv.

### 12-9 · Real vaqt retention-mexanikasi — R + L
- **Darsdan:** A1 — ilova ochiq paytda foydali jonli xabar; A2 — ilova yopiq paytda qaytaradigan eslatma (test holatida); A3 — eslatmadan ochilganlar sanog'i va o'chirgich.
- **O'quvchiga:** «Eslatma haqiqatan qaytaryaptimi — real son bilan tekshiring.»
  1. 3 kun davomida sanoq sahifangizdan har kuni bir marta son yozing: eslatma yuborildi · eslatmadan ochildi · o'chirganlar.
  2. README'ga jadval va bitta qaror: eslatma matni yoki vaqtini o'zgartirasizmi — nega.
  3. Qaror bo'yicha bitta o'zgarish qiling (yoki «o'zgarish kerak emas» — sababi bilan).
  4. Sanoq sahifasi skrinshoti va repo linki.
- **Tekshiruv (mentor):** ☐ 3 kunlik sonlar · ☐ qaror songa asoslangan · ☐ o'chirgich ishlaydi (kamida bitta sinov) · ☐ o'zgarish commit'i yoki asosli «kerak emas».

---

## 13-modul «O'sish va monetizatsiya» (LMS bo'lim 112) — real pul yo'q, faqat mashq (test) to'lov

| # | Dars | Vazifa |
|---|---|---|
| 1–2 | Yunit-ekonomika, monetizatsiya modellari (PM) | — |
| 3 | Webhook va to'lovning ichki tuzilishi | **R + L** — 4-tekshiruv: summa mos kelmasa rad |
| 4 | Narx va paywall (PM) | — |
| 5 | To'lov integratsiyasi + «to'lovni buz» | **R + L** — «To'lovlarim» sahifasi |
| 6–7 | Pul haqida suhbat, yuridik minimum (PM) | — |
| 8 | Retention-mexanikalar (Telegram xabari) | **R + L** — 2 real foydalanuvchi ulanadi, haftalik chegara isboti |
| 9 | Monetizatsiya nazorat nuqtasi (PM) | — |
| 10 | Growth: referal tizim | **R + L** — haqiqiy taklif + o'zini taklif qilish urinishi |
| 11 | Refleksiya (PM) | — |
| 12 | Sayqallash va barqarorlashtirish | **L** — sinfdosh tekshiruvi `XATOLAR.md` ga, 1 tuzatish |

### 13-3 · Webhook va to'lovning ichki tuzilishi — R + L
- **Darsdan:** to'lov xizmati → `POST /tolov/webhook` → Backend; imzo tekshiruvi; takror tekshiruvi (QKod — bitta to'lov bir marta yoziladi); `tolovlar` jadvali; Pro muddati;
  A1 — yo'l va jadval; A2 — mashq to'lov va uch tekshiruv (imzo · takror · rad). Kalit qiymati hech qayerda yo'q (`TOLOV_KALITI` — faqat nomi).
- **O'quvchiga:** «To'rtinchi tekshiruvni qo'shing: summa mos kelmasa — rad.»
  1. To'lov xabaridagi summa tarif narxidan kam bo'lsa — Backend Pro bermasin va sababini yozib qo'ysin.
  2. Mashq to'lovni kam summa bilan yuboring — rad etilganini ko'ring.
  3. To'g'ri summa bilan — Pro ochilsin.
  4. Neon'dagi `tolovlar` jadvali skrinshoti (ikkala holat) va repo linki.
- **Tekshiruv (mentor):** ☐ summa tekshiruvi Backend'da · ☐ kam summa → Pro yo'q · ☐ to'g'ri summa → Pro · ☐ kalit kodda yo'q.

### 13-5 · To'lov integratsiyasi + «to'lovni buz» — R + L
- **Darsdan:** A1 — to'lovning qolgan holatlari ilovada (kutilmoqda, muvaffaqiyatli, rad); A2 — to'rt usul bilan buzish (`BUZISH.md` «To'lov»); A3 — tuzatish va o'sha usul bilan qayta.
- **O'quvchiga:** «Foydalanuvchi o'z to'lovlarini ko'ra olsin.»
  1. «To'lovlarim» sahifasi: sana, summa, holat (muvaffaqiyatli / rad / kutilmoqda).
  2. Faqat o'z to'lovlari — boshqa akkauntnikini ko'rmasin (ikki akkaunt bilan sinang).
  3. To'lov yo'q bo'lsa — «Hali to'lov yo'q».
  4. Skrinshot va repo linki.
- **Tekshiruv (mentor):** ☐ ma'lumot Backend'dan · ☐ faqat o'z to'lovlari (token bo'yicha) · ☐ bo'sh holat · ☐ holat yozuvi tushunarli.

### 13-8 · Retention-mexanikalar (Telegram xabari) — R + L
- **Darsdan:** A1 — bot va ulanish (kodli link); A2 — haqiqiy o'zgarishda Telegram xabari + haftalik chegara; A3 — bir bosishda o'chirish, ochilishlar sanog'i, siyosat.
- **O'quvchiga:** «Telegram xabarini haqiqiy foydalanuvchilarda ko'ring.»
  1. Ikki do'stingiz Telegram'ni mahsulotingizga ulasin.
  2. Haqiqiy o'zgarish yuz berganda xabar ularga borsin — skrinshot (ruxsat bilan).
  3. Shu hafta ikkinchi marta o'zgarish bo'lsa — chegara ishlab, xabar ketmaganini log yoki jadvaldan ko'rsating.
  4. Sanoq sahifasidagi «Telegram'dan ochdi» soni skrinshoti va repo linki.
- **Tekshiruv (mentor):** ☐ 2 ta real ulanish · ☐ xabar haqiqiy o'zgarishda · ☐ haftalik chegara isboti · ☐ o'chirish linki xabarda bor.

### 13-10 · Growth: referal tizim — R + L
- **Darsdan:** A1 — har hisobning taklif kodi va linki; A2 — formada taklif kodi, taklif qilgan hisob topiladi, sanoq; A3 — mukofot (test rejimdagi Pro muddati)
  va uch shart; tekshiruv akkauntlari bilan sinalgan.
- **O'quvchiga:** «Taklif tizimini haqiqiy odam bilan sinang.»
  1. Do'stingizni o'z linkingiz bilan taklif qiling; u ro'yxatdan o'tib, asosiy harakatni bajarsin.
  2. Mukofot shartlarga mos tushganda berilganini ko'rsating.
  3. O'zingizni o'zingiz taklif qilishga urinib ko'ring (ikkinchi akkaunt, o'sha qurilma) — qoida bo'yicha rad etilishi kerak.
  4. Skrinshotlar va repo linki.
- **Tekshiruv (mentor):** ☐ real taklif sanoqda · ☐ mukofot faqat shart bajarilganda · ☐ o'zini taklif qilish rad etiladi (yoki topilgan teshik tuzatilgan).

### 13-12 · Sayqallash va barqarorlashtirish — L
- **Darsdan:** A1 — besh yo'l bo'yicha tekshiruv («Nima kutaman» oldin); A2 — eng muhim 1–2 topilmani tuzatish, `git diff` bilan; A3 — qayta tekshiruv, `XATOLAR.md`, yangi versiya.
- **O'quvchiga:** «Mahsulotingizni boshqa odam tekshirsin.»
  1. Sinfdoshingiz besh yo'lingizni sizsiz bosib chiqsin; u topganini `XATOLAR.md` ga qo'shing.
  2. Sinfdoshingiz topgan va siz topmagan bittasini tuzating.
  3. O'sha usul bilan qayta tekshiring va yangi versiyani chiqaring.
  4. Repo linki.
- **Tekshiruv (mentor):** ☐ sinfdosh topilmalari alohida belgilangan · ☐ bitta tuzatish · ☐ qayta tekshiruv natijasi · ☐ yangi versiya chiqarilgan.

---

## 14-modul «Bitiruvchi va mahsulot tezligi» (LMS bo'lim 113)

| # | Dars | Vazifa |
|---|---|---|
| 1–2 | Investor pitch, storytelling (PM) | — |
| 3 | Performance: mahsulot tezligi | **L** — asosiy ekranni ham o'lchash, `TEZLIK.md` 2-bo'lim |
| 4 | Final sayqal: demo uchun animatsiyalar | **R + L** — demo yo'lining qolgan ekranlari uch qoida bo'yicha |
| 5 | Pitch-trening 1 (PM) | — |
| 6 | Mahsulot demosiga tayyorgarlik | **L + R** — uydagi bosh repetitsiya va B reja mashqi |
| 7–8 | Demo-test, Pitch-trening 2 (PM) | — |
| 9 | Video-portfolio | **L** — video linki (3:00 gacha, maxfiy narsa yo'q) |
| 10–14 | Frilans, xalqaro dasturlar, 6 oylik reja, repetitsiya, uchrashuv (PM) | — |
| — | Demo Day 8, Bitiruv marosimi | — |

### 14-3 · Performance: mahsulot tezligi — L
- **Darsdan:** Lighthouse (Incognito, «Analyze page load»), to'rt son «Oldin»; dalilli tuzatish (rasm hajmi, keraksiz kutubxona — 0–2 ta); xuddi shu sharoitda «Keyin»;
  `TEZLIK.md`. QKod — rasm joyi oldindan, keyin yuklash (tugma joyida qoladi). Darsda o'lchangani — **lending**.
- **O'quvchiga:** «Endi mahsulotingizning eng ko'p ochiladigan ekranini o'lchang.»
  1. O'sha ekranda «Oldin» — to'rt son (darsdagi sharoitda).
  2. Bitta dalilli tuzatish (rasm, keraksiz kod yoki rasm joyi) — dalili yo'q bo'lsa, «tuzatish kerak emas» va sababi.
  3. «Keyin» — xuddi shu sharoitda.
  4. `TEZLIK.md` ga ikkinchi bo'lim; repo linki.
- **Tekshiruv (mentor):** ☐ ikkala ustun to'la · ☐ sharoit bir xil (Incognito, o'sha qurilma) · ☐ tuzatish dalil bilan · ☐ natija halol yozilgan (yaxshilanmagan bo'lsa ham).

### 14-4 · Final sayqal: demo uchun animatsiyalar — R + L
- **Darsdan:** demo yo'lidagi uch joy: A1 — bosish javobi (bosilishi bilan o'zgaradi, qayta bosilmaydi); A2 — yuklanish holati (Slow 4G'da bo'sh joy qolmaydi);
  A3 — muvaffaqiyatda kichik harakat + «harakat kamaytirilgan» holat; yangi versiya.
- **O'quvchiga:** «Demo yo'lining qolgan ekranlarini o'sha uch qoida bo'yicha tekshiring.»
  1. Jadval: har ekran · bosish javobi · yuklanish holati · muvaffaqiyat javobi — ✓ / ✗.
  2. ✗ lardan ikkitasini tuzating.
  3. Slow 4G'da butun demo yo'lini bosib chiqing.
  4. Jadval (README yoki `SAYQAL.md`), oldin/keyin skrinshot va repo linki.
- **Tekshiruv (mentor):** ☐ demo yo'lining hamma ekrani jadvalda · ☐ 2 tuzatish · ☐ Slow 4G'da bo'sh ekran yo'q · ☐ ikki marta bosish muammosi yo'q.

### 14-6 · Mahsulot demosiga tayyorgarlik — L + R
- **Darsdan:** A1 — ssenariy (5 qadam + «Keyin») va risklar → `DEMO.md`; A2 — namuna akkaunt, Backend'ni uyg'otish, B reja (demo videosi); A3 — demo o'tishi (≤ 90 soniya) va teg.
- **O'quvchiga:** «Uyda bosh repetitsiya qiling — B reja bilan.»
  1. Oila a'zosi yoki do'stingiz oldida demoni `DEMO.md` bo'yicha o'ting; vaqtni yozing.
  2. Ikkinchi o'tishda o'rtasida internetni o'chiring — B reja (video) bilan davom eting; necha soniyada o'tganingizni yozing.
  3. Demo kunidan bir kun oldin: Backend uyg'otish va namuna akkaunt bilan kirish ishlashini tekshiring.
  4. `DEMO.md` ga ikki o'tish vaqti va eshitgan bitta savol; repo linki.
- **Tekshiruv (mentor):** ☐ 2 o'tish vaqti · ☐ B rejaga o'tish mashq qilingan · ☐ namuna akkaunt ishlaydi · ☐ teg tekshirilgan versiyada.

### 14-9 · Video-portfolio — L
- **Darsdan:** A1 — ssenariy: Kimman · Nima qurdim · Qanday ishlayman; A2 — yozish (maxfiy ro'yxat, kamera faqat ota-ona roziligi bilan, video repo'dan tashqarida);
  A3 — tekshirish: maxfiy joylar, vaqt (3:00 gacha), kim ko'radi («Ota-onam rozi» / «Hali gaplashmadim»).
- **O'quvchiga:** «Videongizni yakunlab, linkini topshiring.»
  1. «Hali gaplashmadim» bo'lsa — avval ota-onangizga ko'rsating va roziligini oling.
  2. Videoni YouTube'ga «Ro'yxatda yo'q» (unlisted) yoki Google Drive'ga yuklang («link bor kishilar ko'radi»).
  3. Linkni o'zingiz boshqa brauzerda ochib tekshiring.
  4. Linkni topshiring.
- **Tekshiruv (mentor):** ☐ link ochiladi · ☐ 3:00 gacha · ☐ uch bo'lak bor · ☐ parol, `.env`, token, boshqa odamning ma'lumoti ko'rinmaydi.
