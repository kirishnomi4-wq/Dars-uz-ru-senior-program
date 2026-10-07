# 9-dars «React Native va Expo: prototip telefonda» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026

Audit bahosi 6.5/10 (pedagogika 8.5 · mobil trek 8 · web/PWA trek 6 · texnik aniqlik 6.5 · continuity 7). Hukm: **Qabul 17 · Qisman 3 · Rad 5 · Allaqachon / o'zgarishsiz 13**.
Tekshirilgan manbalar: MD o'zi (grep) · **haqiqiy sinov (06.10, scratchpad `expotest/`):** mavjud git repo ichida `npx create-expo-app@latest mobil --no-install` — Expo SDK 57 ·
support.apple.com (iPhone Safari — «Turn a website into an app», «Bookmark a website», qidiruv orqali, 06.10) · support.google.com (Android Chrome — MD dagi iqtibos) · `QOIDALAR.md` T-028, T-067 · tayanch 2, 6, 9.2.
Zaxira: scratchpad `md09/` (09, 07, tayanch).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Expo Router'da har fayl — bitta ekran» — mutlaq | **Qabul** | Ta'rif: «ekranlar fayllar bilan tuziladi; bu misolda har ekran o'z faylida»; 4-ekran nom qatori, asosiy fikr («har ekran o'z faylida»), yakun, kartochka, 6-ekran to'g'ri izohi («ekran fayli o'z manzilida ochiladi: `kirish.tsx` — `/kirish`»), tayanch 2. |
| 2 | `_layout.tsx` — ekran fayli bilan bir toifada emas | **Qabul** | 4-ekranda `_layout.tsx` qatoriga kulrang yorliq «ekran emas — ularni bog'laydi» (uch ekran fayli + bitta bog'lovchi fayl). |
| 3 | PWA ta'rifi — kurs doirasi | **Qisman** | Ta'rif qoladi (o'quvchi uchun aniq); tayanch 2 ga «bu darsda — manifest va HTTPS bilan, offline va'da qilinmaydi» qo'shildi. |
| 4 | 12-ekran: «PWA uchun manifest + HTTPS kerak» — umumiy brauzer qoidasi emas | **Qabul** | Savol: «Bugungi web-trekda saytni bosh ekranga qo'shish uchun nima tayyorlaysiz?»; to'g'ri izohi «Bugun manifest va HTTPS manzil tayyorlanadi — telefon saytni bosh ekranga shundan qo'shadi.» ✔ o'rni (C) o'zgarmadi. |
| 5 | «30 soniya ko'ring» — o'quvchiga shart qilinmasin | **Qabul** | A2 web 4-qadamidan olindi: «telefonda `….netlify.app` ni oching.» |
| 6 | Android Chrome tugma nomlari | **Rad** | Nomlar rasmiy manbadan (support.google.com, P-028) va «telefon tili boshqa bo'lsa — o'sha tildagi nomi» qatori bilan; umumiy so'z o'quvchini adashtiradi. |
| 7 | iPhone Safari yo'li tekshirilmagan — blocker | **Qabul** | Apple rasmiy yordami: Safari → «Share» → «Add to Home Screen»; ro'yxatda bo'lmasa — «Edit Actions». A2 web 4-qadamiga yozildi; qurilmada ko'rish — pilotda (MD shubhali 1 yopildi). |
| 8 | Hookda «Qiziq fikr!» — maqtov | **Rad** | QOIDALAR T-028, T-067 — kurs qonuni: xato tanlovga neytral javob (tayanch 9.76; 08-FILTR dagi tuzatish). |
| 9 | «Hech narsa chiqmaydi» — umumiy tarmoq haqiqati emas | **Qabul** | Hook to'g'ri varianti: «Prototip chiqmaydi — telefon manzilni o'zidan qidiradi»; ip qatori ham. |
| 10, 16, 20, 21, 22, 27, 29, 32 | `localhost` va Wi-Fi farqi · `View`/`Text` testi · `git add mobil` · RN animatsiya vositasini agent tanlaydi · «Stack'nikidek» · PWA offline va'da qilinmaydi · ikki trekli bloklar · avval ulanish, keyin ekranlar | O'zgarishsiz | Auditor tasdiqladi. |
| 11, 12, 35 | «QR bitta Wi-Fi'da ochiladi», «tunnel yordam beradi» — kafolat | **Qabul** | «QR odatda bitta Wi-Fi'da ochiladi»; tunnel nom qatori «… yordam berishi mumkin»; A1 «tunnel bilan urinib ko'ring»; yakun «… urinib ko'rasiz». |
| 13 | `npm i -g @expo/ngrok` — pilotsiz qat'iy qadam | **Qisman** | Qadam qoladi — manba docs.expo.dev/more/expo-cli (tayanch 6); «tunnel bilan urinib ko'ring» bilan. CLI o'zi taklif qiladimi — pilotda (MD shubhali 7). |
| 14 | iPhone'da bitta Expo akkaunti | O'zgarishsiz | Rasmiy iqtibos bilan, O'qituvchi eslatmasida ham. |
| 15 | `className` → `StyleSheet` — bir-bir almashtirish emas | Allaqachon | MD shubhali 11 va 2-ekran xulosasi «Bu misolda …»; o'quvchi CSS ni o'zi ko'chirmaydi — agent. |
| 17 | `id` 7-darsdan kanonik bo'lsin | **Qabul** | Tayanch 9.2: `namuna.js` da `id` `'1'`…`'4'`; 7-dars REPO `namuna.js` qatori; MD TS 7 yopildi. |
| 18 | Shablon tuzilishi versiyaga bog'liq — talab umumiy bo'lsin | **Qabul** | Sinov tasdiqladi: SDK 57 shablonida `src/app/` — `index.tsx`, `explore.tsx`, `_layout.tsx` (pastki tablar, `AppTabs`). Talab: «shablondagi namuna ekranlar va pastki tablar olib tashlansin (hozirgi shablonda — `explore` ekrani) — `src/app/` da faqat mahsulot ekranlari va `_layout.tsx` qolsin» (2 joy). |
| 19 | Mavjud repo ichida `create-expo-app` — ichma-ich `.git`? — blocker | **Qabul** (sinov bilan yopildi) | Haqiqiy sinov: CLI «You are creating a project inside of an existing Git repository. Skip initializing a new git repository? (Y/n)» deb so'raydi, sukut — Y; `mobil/.git` yo'q, `git status` — `?? mobil/`. A1 ga: «… deb so'rasa — Enter: yangi git ochilmaydi». Tayanch 9.78. |
| 23 | 600 px — mashq qiymati | Allaqachon | 9-ekran xulosasi «Bu misolda … 600 px dan tor oynada …»; kartochka endi «Bu darsda 600 px dan tor oynada bitta ustun». |
| 24 | «responsive» — sinonim, olib tashlansin | **Qabul** | Kartochkadan va A-bo'limdan olindi (T-014). |
| 25, 26 | Agent PNG yarata olishiga tayanmaslik; «bosh harf» ikonka — brend ixtirosi | **Qabul** | Talab: «matnsiz oddiy shakl. Ikonka faylini yarata olmasang — bitta kvadrat rasmdan shu ikki o'lchamni qanday tayyorlashni menga ayt.»; namuna — harfsiz rangli kvadrat (avvaldan). |
| 28 | Final (13) faqat mobil tartib — web o'quvchiga noteng | **Rad** | Dars nomi va dastur — «React Native va Expo»: Expo yo'li hamma uchun o'qitiladi (2–8-ekranlar); web yo'li 11–12-ekranda alohida test bilan tekshiriladi. Trekka qarab ikkinchi final — jonli ball relsiga ikkinchi kalit kerak bo'ladi. |
| 30 | `pm-m9d8-platforma` yo'q bo'lsa trek saqlanmaydi | **Qabul** | Tanlov `pm-m9d8-platforma.trek` ga yoziladi — yagona manba (yangi `pm-m9d9-trek` yo'q); tayanch 9.77. |
| 31 | 8-dars uyda o'zgarsa | Allaqachon | 08-FILTR 22 da yopilgan. |
| 33 | Netlify (9-dars) va 10-dars deploy farqi aytilsin | **Rad** | O'quvchi matnida keyingi dars va'da qilinmaydi (T-038); farqni 10-darsning o'zi ko'rsatadi (Render, Backend). |
| 34 | Yakun — holatga qarab | **Qabul** | A2 — «Prototipingiz endi o'z telefoningizda ochiladi.» · A1, A2 yo'q — «Prototip telefonda ochildi — oxirgi qadam uyda.» · A1 yo'q — «Telefonga chiqarish boshlandi — qolgani uyda.» |
| TS 4, 8 | Atamalar tayanchga · QKod kengligi | Qabul · ochiq | Tayanch 2: `manifest`, `tunnel`; 8 — mexanizm (asosiy seans), MD KOD 12 da muqobil. |

**Sinf-supurish:** «har fayl — bitta ekran» — 10–16 MD da 0 · «bitta Wi-Fi'da ochiladi» (kafolat) — faqat 9-dars · `pm-m9d9-trek` — o'zaro tekshiruv ogohlantirishi yo'qoldi.

Tekshiruv: `lint:til` 07, 09 — 0 · o'zaro tekshiruv — arena 3/3/3/3, «Keyingi dars» mos.
