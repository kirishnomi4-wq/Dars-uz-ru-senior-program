# 3-dars «Loyiha kuni: jonli dashboard» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 8/10 (loyiha kuni tuzilmasi 9 · texnik oqim 8.5 · analytics atamalari 6.5). Hukm: **Qabul 15 · Qisman 2 · Rad 2 · O'zgarishsiz (auditor ham saqla dedi) 8**.
Zaxira: scratchpad `03-oldin-filtr.md`, `04-oldin-03filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Hozir saytda» — hozir saytda turganlarni sanamaydi (jim o'qiyotgan 5 daqiqadan keyin chiqadi, yopgan yana 5 daqiqa qoladi) | **Qabul** | Rost. T-044: atamaning so'zma-so'z ma'nosi dars ma'nosiga zid bo'lmaydi. Yorliq → **«Oxirgi 5 daqiqada»** (kodda `hozir` qoladi); «faol» olinmadi — lug'atda izoh talab qiladi. 3-dars 31 joy, 4-dars 7 joy, 2-dars 1 izoh, tayanch 1, 2, 4 (ishlatilmaydi ustuniga «Hozir saytda»). ⚠ Qaror-0 matnidagi «hozir saytda nechta odam» iborasiga tegadi — foydalanuvchiga aytildi. |
| 2 | «Jonli foydalanuvchilar» emas — brauzer sanaladi | **Qabul** | O'quvchi matnida «foydalanuvchi» yo'q (dastur iqtibosi faqat MD izohida); hook javoblari «turli brauzerlar». |
| 3 | 2-ekran: «foizni hisoblasa bo'ladi» — yetarli shart emas | **Qabul** | «…qadamlarni foiz bilan mazmunliroq solishtira olamiz». |
| 4 | Birinchi so'rov darhol ketsin (aks holda 5 soniya bo'sh) | **Qabul** | A2 Yordam namunasi: «kirgan zahoti bir marta, keyin har 5 soniyada»; REPO 2. |
| 5 | `setInterval` — so'rovlar ustma-ust ketishi mumkin | **Qabul** | A2 Yordam: «oldingi so'rov tugamagan bo'lsa, yangisini ustma-ust yubormasin»; REPO 2. AbortController o'rgatilmaydi. |
| 6 | Toshkent kuni — qabul tekshiruvi kerak | **Qisman** | Prompt («Kun Toshkent vaqti bilan») qoladi; REPO 2 ga muhrdan oldingi tekshiruv: 23:59 va 00:01. O'quvchi ekraniga qo'shilmadi (dars og'irlashmasin). |
| 7 | Hook sarlavhasi «kimlarni» — odam ma'nosi | **Qabul** | «"Oxirgi 5 daqiqada: 3" — bu raqam nimani sanaydi?»; variantlar «shu 5 daqiqada …» bilan, uzunlik 39–43. |
| 8 | A1 talab mashqi va inkognito testi kuchli | **O'zgarishsiz** | — |
| 9 | «5 soniya ichida oshadi» — tarmoq sekin bo'lsa yolg'on xato | **Qabul** | A2, A3, yashil xulosa, 4-dars A2: «keyingi so'rovdan keyin (tarmoqqa qarab biroz kechroq)»; 4-ekran natija qatori «odatda 5 soniya ichida». |
| 10 | Render «taxminan bir daqiqa» — tashqi xulq, qat'iy aytilmasin | **Qisman** | Fakt manbali (Render hujjati, tayanch 6, 05.10) — olib tashlanmadi; shakli yumshatildi: «kechikishi mumkin — taxminan bir daqiqagacha». |
| 11 | «Yangilandi» — raqam to'g'riligini emas, javob kelganini bildiradi | **Qabul** | A3 natija ostida `QIzoh`. |
| 12 | «Bu darsda dashboard talabida uch qaror bor» — scoped | **O'zgarishsiz** | — |
| 13 | 1-savol (telefon + laptop = +2) | **O'zgarishsiz** | — |
| 14 | 2-savol A izohi «ishlagani ham buziladi» — qat'iy | **Qabul** | «Talab juda keng: qaysi ish o'zgarishi aytilmagan.» (51) |
| 15 | Arena 7: kamayishi — 5 daqiqa + keyingi so'rov | **Qabul** | Savol Backend qoidasini so'raydi: «Sinfdosh saytni yopdi. Backend uni qachondan sanamaydi?» ✔ o'rni (C) o'zgarmadi. |
| 16 | «Egaga 5 soniya kechikish yetadi» — manbasiz qaror | **Qabul** | Kartochka: «Bu MVP'da 5 soniya tanlandi» + izoh «raqam tez yangilanadi, Backend'ga har soniyada so'rov ketmaydi». |
| 17 | Dashboard ta'rifi tor («jonli») | **Qabul** | «Kerakli raqamlarni bir sahifada ko'rsatadigan sahifa; "Maydon"da u har 5 soniyada yangilanadi» — 3-dars (A, kartochka, arena 1), 4-dars, tayanch. «(holat paneli)» birinchi marta — qoladi. |
| Sarl. 0 | «kimlarni» → «nimani» | **Qabul** | 7-band bilan. |
| Sarl. A3 | «Dashboard internetda ham yangilanadimi?» | **Rad** | Blok sarlavhalari — talab shaklida («…sin»), A1 va A2 bilan bir qolip; auditor ham «hozirgisi ishlaydi» degan. |
| Sarl. 7 | Yakun → «Dashboarddagi har raqam nimani anglatadi?» | **Rad** | Yakun sarlavhasi — natija-gap (texnik dars standarti, 204; modulning boshqa darslari ham shunday). |
| Taq. | Inkognito: har yangi oyna alohida xotira emas — hammasi yopilib yangisi ochilganda | **Qabul** | MD dagi A2 so'zlari to'g'ri edi; tayanch 2 ta'rifi aniqlashtirildi. |
| Taq. | Laptop va Render bitta Neon — o'quvchiga A3 da aytilsin | **Qabul** | A3 4-qadamiga bir qator. |
| Taq. | Toshkent kuni, javob shakli, token sahifa holatida, `/dashboard` va `/ega` hodisa yozmaydi, «Yangilandi» | **O'zgarishsiz** | Auditor tasdiqladi (tayanch 3 va 9). |

**Sinf-supurish:** «Hozir saytda» — 11 MD + tayanch + taqiqlar: 3-dars 31, 4-dars 7, 2-dars 1, tayanch 4 → almashtirildi (meta-izohlardan tashqari 0). «5 soniya ichida» — 4-dars 1 joy. «jonli ko'rsatadigan sahifa» — 4-dars, tayanch. lint:til 02, 03, 04, tayanch — 0.
