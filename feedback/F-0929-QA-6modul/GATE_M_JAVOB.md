# 6-Modul · GATE M javobi (05.10.2026 00:19, F-1004-64) — barcha agentlar uchun MAJBURIY qarorlar

Foydalanuvchi javobi: **13 dars ✓ (tasdiq), 35 savolning hammasi A** (sahifa https://claude.ai/artifact/ToHdYUrXZvMbS2LEn4bspU).
MD v3 + shu fayl = manba-haqiqat. MD bilan zid bo'lsa — **shu fayl yutadi** (MD'ni ham shunga moslang).

## Modul bo'yi (hamma darsga)

- **M-q0** · Atama: «Database» yoki «baza»? (1, 4-darslar xaritasi «Database»; 3, 8, 13-darslar va 5-Modul «baza»)  
  **A:** Modul bo'yi «Database» — 1-dars xaritasi nomi  
  → o'quvchi matnida «baza» (ma'lumotlar bazasi ma'nosida) → **«Database»**. Istisno: kod identifikatori, buyruq, Neon konsoli nomi.
- **M-q1** · Atama: «chegara» — 4-dars 5-Modul bilan bir xil «chegara» dedi; 6-dars (PmLesson23) hali «vakolat chegarasi» deydi  
  **A:** 6-dars ham «chegara»  
  → 4 va 6-darsda **«chegara»** («vakolat chegarasi» yo'q). 6-dars `PmLesson23` dagi 4-darsga ishora ham «chegara».
- **M-q2** · Misol-ip: 1-dars xaritasi telefon do'koni (siz ma'qullagansiz); repo darslari (4, 8–13, 9–10 ham) AvtoPizza  
  **A:** Shunday — 1-dars tushuncha misoli, repo darslari AvtoPizza; 11-dars nomidan «(mini-do'kon)» olinadi  
  → 1, 3-dars tushuncha misoli — telefon do'koni; repo darslari (4, 8–13) — **AvtoPizza**. 11-dars nomi «Loyiha kuni: mobil ilova».
- **M-q3** · Repo nomlari 8–13-darslarda bitta: body maydoni `taom`, ustun `manba` (sayt · bot · mobil), manzil `BACKEND` (config.js), `GET /menyu` faqat 8-darsda quriladi; 13-dars `kirish` ustunini qo'shmaydi  
  **A:** Shunday — 09 (`API_URL`) va 13 (`pitsa`, `kirish`) shu nomlarga keltiriladi  
  → **YAGONA NOMLAR:** body maydoni `taom` (va `manzil`) · jadval ustuni `manba`, qiymatlari `sayt` · `bot` · `mobil` · mobil ilovada backend manzili `BACKEND` (`mobile/config.js`) · `GET /menyu` faqat 8-darsda quriladi (9/10/11/13 tayyorini ishlatadi) · 13-dars `kirish` ustunini QO'SHMAYDI, `manba` ni ishlatadi · `API_URL`, `pitsa:` (body maydoni) — ishlatilmaydi.
- **M-q4** · Amaliyot bloki (`ScreenBlok`) hozir faqat 5-Modulda, 3 nusxada  
  **A:** 8/11/13 dan oldin `src/qolip/` ga `QBlok` bo'lib ko'chadi — bitta manba  
  → Amaliyot bloki umumiy qolipda: `QBlok` (`src/qolip/index.jsx`) + darsdagi ulagich — namuna `src/skelet/NamunaDars.jsx` `ScreenBlok` (asosiy seans quradi).
- **M-q5** · Loyiha kunlari (8, 11, 13) yakunida uyga vazifa (172.4 «olinadi», ish repo'da davom etadi)  
  **A:** Olinadi — 172 bo'yicha  
  → 8, 11, 13-darslar yakunida **uyga vazifa YO'Q** (172.4) — `QYakun` `uyga` berilmaydi.
- **M-q6** · PM testlarida 3 variant (QTest standarti 4 variant) — 2, 6, 12, 14-darslar  
  **A:** 4-variant qo'shiladi — oxiriga, ✔ o'rni va jonli statistika o'zgarmaydi  
  → PM testlari (2, 6, 12, 14) — **4 variant**: yangi variant OXIRIGA qo'shiladi, `correctIdx`/✔ o'rni va jonli statistika o'zgarmaydi; uzunligi boshqalar bilan teng, aniq noto'g'ri, `explainWrong` bilan.
- **M-q7** · Repo · «Ortda qoldingizmi» tegi: A1 da dars-6-NN-start, A2/A3 da dars-6-NN-done (done keyingi blok xatosini oldindan tuzatib qo'yadi)  
  **A:** Shunday — A1 start, A2/A3 done  
  → «Ortda qoldingizmi — mentor bilan `git checkout -f …`»: **A1 da `dars-6-NN-start`, A2 va A3 da `dars-6-NN-done`**.
- **M-q8** · Repo · O'quvchi repo'ni 5-Modul 3-darsda fork qilgan — yangi teglar uning fork'ida yo'q  
  **A:** Buyruq teglarni asosiy repo'dan oladi: git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags, keyin git checkout -f …  
  → Buyruq ikki qator: `git fetch https://github.com/Azizbekcrypto/TelegramBotNest --tags` keyin `git checkout -f dars-6-NN-…` (o'quvchi fork'ida yangi teglar yo'q).
- **M-q9** · Repo · Tasdiq = repo'ga yangi kod va teglar (4-dars va 8–13-darslar: dars-6-04, dars-6-08 … dars-6-13 start/done) + GitHub'ga push (Azizbekcrypto/TelegramBotNest, public)  
  **A:** Ha — tasdiqdan keyin men quraman, sinayman va push qilaman  
  → Repo ishini asosiy seans (repo-agent) quradi, sinaydi va push qiladi. Dars agentlari repo'ga TEGMAYDI.
- **M-q10** · 5-Modul · 5, 7, 9-darslardagi dars-05-start, dars-07-start, dars-09-start teglari repo'da YO'Q (ortda qolgan o'quvchi buyruqni bajara olmaydi)  
  **A:** Repo'ga 3 teg qo'shiladi (oldingi darsning done commit'iga) + GitHub push — dars kodi o'zgarmaydi  
  → Bajarildi 05.10 00:24: `dars-05-start`=`dars-04-done`, `dars-07-start`=`dars-06-done`, `dars-09-start`=`dars-07-done`, GitHub'da.

## Darsma-dars (hammasi A)

### 02 · Bitta gapni uch kishi bir xil tushunadimi? (`02-PmLesson22-v3.md`)
- **02-q0** · Q1 · 6-ekran keysida ikkinchi bashorat («tilni qachon ishga tushirishdi?») — karta S-015 bitta bashoratga ruxsat beradi → **A:** Olinadi — fakt 5-bosqich matnida qoladi
- **02-q1** · Q2 · 10-ekran darvoza-savoli 5-ekran testini takrorlaydi → **A:** Kodga bog'liq savol: «varaq1 da qaysi katak bo'sh?»

### 03 · Arxitektura patternlari (`03-ArchPatterns-v3.md`)
- **03-q0** · Q2 · Amaliyotning 3–4-qadam nomlari (bu darsda kod yozilmaydi, bot ishga tushirilmaydi) → **A:** «Tekshirish» va «Saqlash»

### 04 · AI-agent nima (`04-AgentArchitecture-v3.md`)
- **04-q0** · «Xabar» asbobi olinadi (javob bot orqali qaytadi, repo agenti ham matn qaytaradi), o'rniga «To'lov xizmati» — chegara ekrani uchun → **A:** Qabul
- **04-q1** · 16-ekran amaliyoti repo'da (173): agentga faqat o'qiydigan `getOrders` asbobi, teglar `dars-6-04-start/done` → **A:** Qabul — v2 dagi qog'oz reja uyga vazifaga ko'chadi

### 05 · Claude Skills — nima (`05-ClaudeSkills-v3.md`)
- **05-q0** · Q1 · Amaliyotda Skill qayerda sinaladi? → **A:** gemini.google.com — SKILL.md matnini suhbatga qo'yib; Claude'da qo'shish yo'li faqat halol izohda
- **05-q1** · Q2 · 9 ↔ 11-ekran mazmuni almashadi (3-savol o'z tushunchasidan keyin keladi; kalitlar joyida) → **A:** Almashadi

### 06 · Ilova o'zi qaror qilsa, kimga tegadi? (`06-PmLesson23-v3.md`)
- **06-q0** · Q1 · 10-ekrandagi oldindan beriladigan savol («Agent ishni boshlashdan oldin nima qiladi?») — kod topshirig'iga bog'liq emas → **A:** Olib tashlanadi — kod ekrani bitta ish
- **06-q1** · Q2 · Chegara ta'rifida «oldindan qilingan qaror» → «oldindan yozilgan qoida» → **A:** «qoida» — «qaror» faqat ilova ishi bo'lib qoladi

### 07 · O'z Skill'ingizni yozing (`07-WriteSkill-v3.md`)
- **07-q0** · S-1 · App.jsx `sub` «struktura, test, kontekst-injiniring» → darsdagi so'zlar «tuzilish, sinov, kontekst-injiniring» → **A:** Ha — menyu nusxalari bilan (bir ma'no — bir so'z)
- **07-q1** · S-2 · 16-ekran amaliyoti qayerda? → **A:** O'quvchining o'z kompyuterida (papka + SKILL.md + sinash), TelegramBotNest'siz

### 08 · Praktika: to'liq pipeline (`08-PipelineProject-v3.md`)
- **08-q0** · Q1 · Dars nomi 13-dars bilan bir xil shaklda → **A:** «Loyiha kuni: to'liq pipeline» (App.jsx + dars nomi)
- **08-q1** · Q4 · A2 4-qadam: Neon konsolidagi bo'lim nomi («Tables») tekshirilmagan → **A:** Aniq menyu nomisiz yoziladi («jadvallar bo'limida»), mentor ko'rsatadi

### 09 · React Native — asoslari (`09-ReactNativeBasics-v3.md`)
- **09-q0** · Backend'ga ulanish (fetch) 9-darsning o'zida — React darslarida o'tilgan; 10-dars uni takror sifatida beradi → **A:** Ha
- **09-q1** · Final «kod yo'li» zanjiriga almashadi (eski «mashq tartibi»da bir nechta to'g'ri tartib bor edi) → **A:** Ha
- **09-q2** · `mobile/` papkasini kim yaratadi? → **A:** O'quvchi o'zi (create-expo-app); teg faqat zaxira

### 10 · RN: komponent, navigatsiya, API (`10-ReactNativeApp-v3.md`)
- **10-q0** · KOD 11 · App.jsx m6-10 `sub` → «FlatList, Stack Navigator, fetch» (dars nomi o'zgarmaydi) → **A:** Ha

### 11 · Loyiha kuni: mobil ilova (`11-MobileAppPractice-v3.md`)
- **11-q0** · Dars nomi: hozir «Praktika: mobil ilova (mini-do'kon)», ip endi AvtoPizza → **A:** «Loyiha kuni: mobil ilova» — 8 va 13-dars bilan bir shakl (App.jsx + dars)

### 12 · Bugun qaysi ish boshlanadi? (`12-PmLesson24-v3.md`)
- **12-q0** · S1 · App.jsx menyu osti yozuvi «uch ufq: …» — atama darsdan oldin ko'rinadi (PM-107) → **A:** «hozir, uch oydan keyin, olti oydan keyin» deb almashtiriladi
- **12-q1** · S2 · 10-ekrandagi kutilgan terminal natijasi qachon ko'rinsin? → **A:** Boshidanoq xira — o'quvchi nimaga intilishini ko'radi

### 13 · Loyiha kuni: to'liq tizim (`13-FullSystemProject-v3.md`)
- **13-q0** · Q2 · AI nomi: 1-dars xaritasida «AI · Claude», repo'da Gemini → **A:** 13-dars repo bo'yicha «Gemini» deydi
- **13-q1** · Q3 · Web serverga chiqmaydi (frontend deploy kursda o'tilmagan): backend serverda, web laptopdan ulanadi → **A:** Shunday; web deploy Demo Day oldidan alohida

### 14 · Raqamingiz nimani isbotlaydi? (`14-PmLesson25-v3.md`)
- **14-q0** · Q1 · s5, s7, s11 testlari eslash-savoldan qo'llash-savolga (✔ o'rni o'zgarmaydi; RECAPS, Q_LABELS yangilanadi) → **A:** Ha
- **14-q1** · Q2 · 10-ekran funksiya nomi `dalillar` → `natijalar` (3 kod tekshiruvi bilan) → **A:** Ha — «natija raqami» atamasi bilan bir xil

## App.jsx va menyular
Dars nomi/`sub` o'zgarishlari (08, 11 nom · 07, 10, 12 `sub`) — **asosiy seans** qiladi (DE-205: 6 menyu fayli). Dars agentlari App.jsx ga tegmaydi;
dars ichidagi sarlavha/yakun «keyingi dars» nomlari yangi nomlarga moslanadi: m6-08 «Loyiha kuni: to'liq pipeline», m6-11 «Loyiha kuni: mobil ilova».

