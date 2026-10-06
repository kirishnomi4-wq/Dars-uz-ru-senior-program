# 9-dars «Loyiha kuni: foydalanuvchini qaytaradigan eslatma» — tashqi audit (ChatGPT) Filtr bilan, 06.10.2026, F-1006-363

Filtr tartibi (`konveyer/1-MD.md`): har band → darsda bormi (grep) → fakt (tayanch, dastur, 4, 7, 8, 10-darslar, 11-Modul tayanchi, Expo rasmiy sahifasi) → qonun → tasdiqlangan qaror (Qaror-0) → auditoriya. Hukm: Qabul / Qisman / Rad + sabab.
Zaxira (tahrirdan oldin): scratchpad `zaxira-1810/` (12 MD, tayanch, jurnal — 31 fayl).

Audit bahosi 6.5/10 (pedagogika 9 · PM fikri 9 · 4 → 9 continuity 5.5 · eslatma texnikasi 5.5 · o'lchov halolligi 6 · 90 daqiqa 4.5).
Hukm (41 band): **Qabul 24 · Qisman 6 · Rad 1 · Allaqachon / o'zgarishsiz 9 · endi tegishli emas 1**.

Eng katta o'zgarish (auditor so'ramagan, lekin uning 1, 2, 17, 18, 41-bandlari va o'z tekshiruvim shunga olib keldi): **Mentor misolidan o'yin kuni 9:00 eslatmasi olib tashlandi** — 2-amaliyotda endi bitta eslatma (uch kunlik). Bu tayanch 1.9 dagi o'z qarorim edi, Qaror-0 emas; sabablari 2-bandda. Foydalanuvchiga aytiladi.

## Asosiy bandlar

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Haftasiga ko'pi bilan ikkita» o'ziga zid: 9:00 + bir soat oldin + uch kunlik = 3 | **Qabul** | Haq. Ustiga MD tayanch 9.30 bilan ham mos emas edi (tayanch: «faqat so'ralmagan eslatma sanaladi», MD: «bugungi ikkitasi sanaladi») — ikkalasi ham tushuntirib bo'lmaydigan chegara. Yangi ma'no (tayanch 9.41 b): hafta — dushanbadan yakshanbagacha; ilovaning **hamma** eslatmasi sanaladi; o'yin eslatmasi (4-dars) har doim qo'yiladi — o'yinchi o'yinga o'zi qo'shilgan; uch kunlik eslatma hafta ikkitaga to'lgan bo'lsa qo'yilmaydi. Ikki o'yinli haftada uch kunlik yo'q; uch o'yinga qo'shilgan odam uch o'yin eslatmasini oladi — bu ochiq yozildi. O'quvchi matni: «hafta ikkitaga to'lsa, ilova o'zidan qo'shmaydi» (5-ekran xulosa, kulrang qator, kartochka, «Endi siz bilasiz», arena 7). |
| 2 | Bitta o'yinga bir kunda ikki eslatma (9:00 va 17:00) — alohida qaror kerak | **Qisman** | Auditor «qolishi mumkin» deydi; men **olib tashladim**. Sabablar: (a) tayanch 9.36 i — «bitta o'yinga bitta eslatma» (4-dars auditidan); (b) dars natijasi — «**bitta** qaytaradigan eslatma» (tayanch 4, dastur); (c) Qaror-0 8 — «ilova oxirgi ochilganda rejalashtirgan» eslatma — bu aynan uch kunlik; (d) hook — ilovani ochmay qo'ygan o'yinchi, 9:00 eslatmasi esa o'yinga qo'shilgan faol o'yinchiga edi (bitta ip); (e) 41-band — vaqt. 5-ekrandagi ikkinchi «o'tadigan» matn endi 4-darsdagi o'yin eslatmasi — o'quvchi o'zi qurgan eslatma qoidadan o'tishini va haftalik sanoqqa kirishini ko'radi. |
| 3 | Uch kunlik eslatma — «ochmagan odamga» ekani yashirin | **Qabul** | 2-amaliyot «Ochish»: «U ilovani uch kun ochmagan odamga chiqadi: har kuni ochadigan odamga umuman chiqmaydi.» Kartochka (test holati kartasi o'rniga): «Mentor misolida uch kunlik eslatma kimga chiqadi?» Atama «uch kunlik eslatma» ta'rifi bilan A-bo'lim 5 va tayanch 2 da. |
| 4 | 17:00 tayanchda yo'q | **Qabul** | Tayanch 1.9 va 9.41 a ga Mentor vaqti sifatida kirdi. |
| 5 | `eslatmadan-ochdi` nimani o'lchashi noaniq | **Qabul** | Auditor tavsiyasi bo'yicha — umumiy: ilovaning **istalgan** eslatmasi (o'yin eslatmasi ham) bosilib ilova ochilgani; «uch kunlik eslatma shuncha odamni qaytardi» hech qayerda deyilmaydi (tayanch 9.41 d; 3-blok prompt, O'qituvchi eslatmasi, kartochka). O'zim tekshirgan qo'shimcha dalil: faqat uch kunlik eslatmani sanasak, tayanch 1.10 dagi «bir hafta keyin 9 qurilma» chiqa olmaydi — yangi fayl 5-kuni chiqadi, eslatma eng erta 8-kuni. |
| 6 | Sinfdagi tekshiruv bosishi haqiqiy sanoqqa aralashadi — 10-dars uchun to'siq | **Qabul** | «Og'zaki eslab qoling» yetmaydi — haq (`hodisalar` da `namuna` ustuni yo'q, sonlar kichik). 3-blok tekshiruvi (4): o'quvchi Neon'da `SELECT id, yaratilgan … WHERE nom = 'eslatmadan-ochdi'` bilan yozuvlarni ko'radi, agent shu `id` larni o'chiradi; sanoq 0 ga qaytadi. 7-dars qoidasi («o'z qurilmasi ham sanaladi») haqiqiy ochilishlar uchun qoladi — test holatidagi bosish sun'iy voqea. Arena 11, kutilgan natija yorlig'i, O'qituvchi eslatmasi, REPO 6 (Mentor ham o'chiradi). |
| 7 | Qaytganlar foizi: ikkinchi davr — faqat birinchi davr qurilmalari ichidan | **Qabul** | 9-darsda: «17 — o'sha 46 qurilmaning ichidan» (A-bo'lim 4, tayanch 1.9). Hisob qoidasi tayanch 9.41 i ga yozildi; **10-dars Filtrida** SQL shunga tekshiriladi (jurnal «Keyingi qadam» 2). |
| 8 | «46 qurilma — kam son, isbot emas» — nimaning isboti emasligi noaniq | **Qabul** | 37% — sanalgan fakt, taxmin emas. Yangi matn: 0-ekran — «taxminan 37% · shu 46 qurilma bo'yicha sanalgan»; kartochka izohi — «Shu 46 qurilmaning sanalgan soni; nega qaytmagani bundan bilinmaydi». |
| 9 | 4-darsdagi «faqat o'ziga tegishli o'yin» qoidasi 1-amaliyot bilan zid | **Qabul** | 4-dars qoidasi — 4-darsda qurilgan xabarlarga; 9-dars «2 joy qoldi» — yangi xabar. Tayanch 1.4 va 9.41 e, 4 MD A-bo'limi, 9 MD A-bo'lim 3, 1-amaliyot prompti («4-darsdagi jonli xabarlar (ular faqat menga tegishli o'yin uchun) … avvalgidek»). 4 MD o'quvchi matni («Mentor misolining uch qoidasi») allaqachon shu dars doirasida edi — o'zgarmadi. |
| 10 | 1 yoki 2 joy, 0 emas; `qoshilgan` = qo'shilgan + kelishini tasdiqlagan | Allaqachon | O'zgarishsiz. `qoshilgan` — 11-Modul tayanchi 9.86 da tekshirdim: «`qoshildi` yoki `keladi`» — mos (REPO 1, Manbalar 10). |
| 11 | «Bir xil son uchun bir marta» — qayerda eslab qolinadi | **Qabul** | «Ilova ochiq turgan davrda bir marta» (ilova xotirasida) — prompt, A-bo'lim, REPO 1; qayta ochilganda yana chiqishi mumkinligi ✎ da. |
| 12 | 1-amaliyot tekshiruvi agentga bog'langan | **Qabul** | Tayanch 9.37 h allaqachon «sherik — agentdan oldin» degan edi (3, 4, 5-darslar), 9-dars moslanmagan — tuzatildi: birinchi yo'l — sherik o'z akkauntidan (ilova o'rnatilgan telefonida yoki brauzer ko'rinishida), agent — zaxira va o'yinni kerakli holatga keltirish uchun. |
| 13 | «Ilova yopiq» modeli toza | Allaqachon | O'zgarishsiz. |
| 14 | «Bu ilovada» chegarasi yo'qolmasin | Allaqachon | 2-ekran joriy qatori va 1-savol — «Bu ilovada», «Mentor ilovasi». |
| 15 | «Rost: ilova buni oldindan biladi» — faqat rejalashtirilgan eslatma uchun mezon | **Qisman** | Tekshiruv kartasi ostiga yorliq «bu kursda · rejalashtirilgan eslatma uchun»; A-bo'lim va tayanchda qoida shu doirada. Xulosa matniga «rejalashtirilgan» so'zi qo'shilmadi — 110 belgi chegarasidan oshadi (121); xulosa «Bu kursda eslatma …» bo'lib qoldi. |
| 16 | «Hafta oxiriga o'yin bormi?» — yaxshi halol matn | Allaqachon | Saqlandi. |
| 17 | «Kelaman»da 9:00 eslatmasini bekor qilish | Endi tegishli emas | Eslatmaning o'zi olib tashlandi (band 2). |
| 18 | Yangilanishdan oldin qo'shilgan o'yinlar uchun 9:00 eslatmasi yo'q | **Qisman** | 9:00 eslatmasi yo'q — xato ham yo'q: uch kunlik eslatma har ochilishda qo'yiladi, yangi versiya birinchi ochilgandayoq ishlaydi. Qolgan savol — ilova yangilanganda 4-darsdagi rejalashtirilgan o'yin eslatmalari saqlanadimi: rasmiy sahifada yo'q → ⛔ «qur» darvozasi (Shubhali 13; saqlanmasa — «ochilganda tiklash» talabga qo'shiladi). |
| 19 | O'chirgich qayta yoqilganda aynan qaysi eslatmalar qo'yiladi | **Qabul** | Prompt: «Yoqilsa — hozirgi ma'lumotdan kerakli eslatmalar qaytadan qo'yilsin: men qo'shilgan, hali boshlanmagan o'yinlar uchun o'yin eslatmasi (bir soatdan kam qolgan bo'lsa — yo'q) va uch kunlik eslatma; o'tib ketgan o'yin uchun qo'yilmasin.» Tayanch 9.41 f, REPO 3. |
| 20 | Ilova butunlay yopiq holatdan eslatma bosilishi; takror sanash | **Qabul** | Rasmiy sahifani shu seansda qayta o'qidim (06.10, Manbalar 9): `useLastNotificationResponse`, `getLastNotificationResponseAsync`, `clearLastNotificationResponseAsync` bor; butunlay yopiq holat haqida gap **yo'q**. Prompt: «ilova fonda bo'lsa ham, butunlay yopiq bo'lsa ham; bitta bosishga bitta yozuv». Tekshiruv (1) — butunlay yopib; (4) — har bosishga bitta qator. REPO 3 — takrordan himoya. ⛔ «Qur» darvozasi: haqiqiy Android va iPhone'da sinalmaguncha muzlatilmaydi. |
| 21 | Yozuv faqat bosilganda — to'g'ri | Allaqachon | Saqlandi. |
| 22 | «Eslatma odamni qaytardimi — sanoq ko'rsatadi» — sabab da'vosi | **Qabul** | Mentor (3-blok): «Eslatma bosilib nechta qurilmada ilova ochilganini sanoq ko'rsatadi». Asosiy fikr: «… eslatma bosilib ilova ochilganini esa sanoq ko'rsatadi». «Endi siz bilasiz» 5 va 3-blok «Ochish»: «eslatma bo'lmasa ham ochgan bo'larmidi — buni aytmaydi». |
| 23 | Bitta ochilishda `ochdi` va `eslatmadan-ochdi` — ataylab ekani aytilsin | **Qabul** | 3-blok tekshiruvi (2): «Bitta ochilish ikki yozuv beradi … — bu xato emas». |
| 24 | Maxfiylik gapi | Allaqachon | Saqlandi (tayanch 9.41 a). |
| 25 | Web-trek 2-amaliyot qurilmaydi: o'zgarishlar jurnali yo'q, agent son to'qishi mumkin | **Qisman** | Tashxis to'g'ri — tayanch 1.9 dagi web qatori mening xatoim edi. Auditorning ikki yo'li (A — jurnal jadvali; B — sonsiz) o'rniga uchinchisi: sayt o'zi ko'rsatgan oxirgi holatni brauzerda saqlaydi va keyingi ochilishda yangi javob bilan solishtiradi — «Siz yo'q paytingizda: {N} ta o'yiningizda o'zgarish bo'ldi». Backend o'zgarmaydi (Render kutilmaydi), son to'qilmaydi, agentga «o'zing top» deyilmaydi; 4-darsdagi «javobni oldingisi bilan solishtirish» naqshi. Halol chegarasi `QIzoh` da: o'zgargan o'yinlar soni, oradagi har o'zgarish emas. |
| 26 | Web `xabardan-ochdi` — aniq harakat | **Qabul** | Faqat «Siz yo'q paytingizda» qatori bosilib o'yin ochilganda; sahifa ochilishi va tasmadagi oddiy xabar — yo'q. |
| 27 | O'chirgich — sozlama ko'rinishida, chiqish tugmasidan ajralsin | **Qabul** | Prompt, «Ochish», kutilgan natija. |
| 28 | Ilova o'chirgichi va telefon ruxsati — ikki holat | **Qabul** | Prompt: ruxsat berilmagan bo'lsa, o'chirgich ostida «Telefon sozlamalarida eslatmalarga ruxsat berilmagan» (`getPermissionsAsync` — rasmiy sahifada bor). |
| 29 | Hookdagi «Qiziq fikr!» ketsin | **Rad** | Qonun (T-028, T-067) — har auditda rad (tayanch 7). Taklif qilingan matnlar mazmunan MD dagi bilan bir — o'zgarmadi. |
| 30 | Hookdagi «telefon ekraniga chiqqan eslatma» | Allaqachon | Saqlandi. |
| 31 | Yangi e'lon «Yakshanba, 18:00 · Maktab maydoni · 0 / 10» tayanchda yo'q | **Qisman** | Sahna yangi karta talab qiladi — mavjud o'yinni «yangi e'lon» deb bo'lmaydi (11-Modul namuna o'yinlarini tekshirdim: to'rttasi ham band). Maydon nomi — o'sha namunalardan, kun va soat to'qnashmaydi; tayanch 9.41 a ga «sahna uchun» deb yozildi. |
| 32 | 7 / 10 → 8 / 10 | **Qabul** | Tayanch 9.41 a. |
| 33 | 1-savol; «ulanish ham yo'q» gapi bir joyda qolgan bo'lsa olib tashlansin | **Qabul** | Asosiy matnda yo'q edi; MD ning «O'lchov» bo'limida eski qator qolgan ekan («C: Ilova yopiq bo'lsa, ulanish ham yo'q…») — tuzatildi. |
| 34, 35 | 2-savol; «beshta yangi o'yin» — test ichidagi son | Allaqachon | O'zgarishsiz. |
| 36 | «Come Back» nishoni — «qaytardingiz» demasin | **Qabul** | Tavsif: «Eslatmadan ochilishni sanab, o'chirgichni tekshirdingiz». |
| 37 | Yakun sarlavhasi yaxshi; fayl navbatda bo'lsa — ko'rinsin | **Qabul** | 3-blok ostida (mobil trek) ikki tugma «Havola almashtirildi» · «Fayl navbatda»; yakunda kulrang yorliq «O'rnatish fayli navbatda» va bitta qator. |
| 38 | «Uyga vazifa yo'q» va «havola uyda almashtiriladi» zid | **Qabul** | Auditorning A yo'li: loyiha kunida «uyda» yo'q — havola keyingi dars boshida (A-bo'lim 9, 10; 3-blok; yakun; Shubhali 9). 10 MD 1-ekran O'qituvchi eslatmasiga qator qo'shildi; vaqti 10-dars Filtrida. |
| 39 | 1-amaliyot tekshiruvini 2-amaliyotdan keyinga surish xavfli | **Qabul** | Ikkala blok bitta kodga tegadi, Backend o'zgarmaydi — kutish sababi ham yo'q. «Ulgurmasangiz» endi faqat tekshiruv akkauntlarini o'chirishni kechiktiradi; «Davom etish» erta ochilmaydi. |
| 40 | Haftalik chegara — kodni o'qish tekshiruv emas, yashil qator esa «tekshirildi» deydi | **Qabul** | Yashil qator chegarani da'vo qilmaydi; ostida kulrang qator «Haftalik chegara — kodda bor, telefonda tekshirilmagan.»; tekshiruv (3) ochiq aytadi: «bu — kodni o'qish, telefondagi tekshiruv emas». Mentor repo'sida — «qur» da ko'z bilan. |
| 41 | 90 daqiqa — 110–130 | **Qisman** | Qisqardi: 2-amaliyot — bitta eslatma (≈22 → ≈18), web-trek 2-amaliyotida Backend yo'q; 3-amaliyotga vaqt qo'shildi (≈17 → ≈21: butunlay yopiq holat, tekshiruv yozuvlarini o'chirish). Jami 90 — **reja**, o'lchov emas: ⛔ «qur» pilotida taymer. Sig'masa — haftalik chegara o'quvchi blokidan chiqariladi (foydalanuvchi qarori). |
| Sarlavhalar | Reja sarlavhasi web-trek uchun umumiyroq bo'lishi mumkin | O'zgarishsiz | Auditor: «hozirgisi qolishi mumkin». Web-trek — pastki qatorda. |

## O'zim topganlar (audit aytmagan)

| № | Topilma | Nima qilindi |
|---|---|---|
| M1 | 2-amaliyotdagi «ilova ochiq tursa, eslatma ko'rinmasligi mumkin» — tayanch 9.36 i ga zid (4-darsda `setNotificationHandler` qo'yilgan, eslatma ochiq paytda ham ko'rinadi; 04-FILTR 27) | Gap olib tashlandi: «ilovani yoping — bugun yopiq holatni tekshirasiz». A-bo'lim 12, Manbalar 3, ✎. |
| M2 | **O'z xatoim:** 04-FILTR 30 («eslatma o'rnida» deyilmaydi) supurishida «faqat 04» deb yozgan edim — 09 da uch joyda bor edi (A-bo'lim ×2, reja pastki qatori) | Uchalasi tuzatildi; 12 MD da qayta qidirildi — 0. |
| M3 | MD ning haftalik chegarasi tayanch 9.30 bilan mos emas edi | Band 1 bilan birga yopildi; 9.30 — «9.41 b bilan almashtirildi». |
| M4 | Uch kunlik eslatma hisobdan chiqqan odamga ham qo'yilardi (7-dars: chiqishda eslatmalar bekor) | Prompt: «Faqat hisobga kirgan foydalanuvchiga»; «hisobdan chiqilganda bu eslatma ham bekor bo'lsin». |
| M5 | Vaqt chizig'i: `eslatmadan-ochdi` faqat uch kunlik eslatmani sanasa, 10-darsdagi «9 qurilma» mumkin emas | Band 5 qarorining dalili; tayanch 9.41 d ga yozildi. |
| M6 | Web-trek 3-amaliyot tekshiruvida web qatori yo'q edi | Qo'shildi (sinf 12). |

## «Majburiy 10 fix» — holat

| № | Fix | Holat |
|---|---|---|
| 1 | Haftalik chegara hamma eslatmagami | ✅ band 1 |
| 2 | Bir soat oldin + 9:00 + uch kunlik — ustuvorlik | ✅ band 2 (9:00 yo'q; o'yin eslatmasi har doim, uch kunlik — sig'sa) |
| 3 | `eslatmadan-ochdi` doirasi | ✅ band 5 |
| 4 | Sinfdagi tekshiruv yozuvi | ✅ band 6 |
| 5 | Butunlay yopiq holat va takror sanash | ◐ band 20 (talab va tekshiruv yozildi; ⛔ haqiqiy telefonda — «qur») |
| 6 | Yangi fayldan oldingi o'yinlar eslatmasi | ◐ band 18 (9:00 yo'q; o'yin eslatmasining saqlanishi — ⛔ «qur») |
| 7 | O'chirgich qayta yoqilganda | ✅ band 19 |
| 8 | Web «Siz yo'q paytingizda: N» manbasi | ✅ band 25 (brauzerda saqlangan holat bilan solishtirish) |
| 9 | «Uyga vazifa yo'q» va «uyda» | ✅ band 38 |
| 10 | 90 daqiqa | ⛔ «qur» darvozasi (band 41) |

## «TAYANCHGA SAVOL» bo'yicha auditor qarorlari (22 band) va uning to'rt qo'shimcha savoli
1, 3, 5, 6, 11, 17, 18, 19, 20, 21, 22 — QABUL (tayanch 9.41 a). 2 — band 31, 32. 4 — band 9. 7 — band 4. 8 — band 1. 9 — band 2, 17. 10 — band 19, 27, 28. 12 — band 5. 13 — band 25. 14 — band 26. 15 — band 38. 16 — band 12. MD dagi ro'yxat holat belgilari bilan yangilandi.
Qo'shimcha savollar: «`eslatmadan-ochdi` bir soatlik eslatmani ham sanaydimi?» — ha (band 5) · «sinfdagi yozuv 10-dars hisobotidan qanday chiqadi?» — `id` bo'yicha o'chiriladi (band 6) · «yangi faylda oldingi o'yinlar eslatmasi?» — band 18 · «o'chirgich qayta yoqilganda?» — band 19.

## Sinf-supurish (12 MD + tayanch, 06.10)

| Sinf | Qidirildi | Topildi → tuzatildi |
|---|---|---|
| O'yin kuni 9:00 eslatmasi / «uch kundan keyingi» | 12 MD + tayanch | 09 · tayanch 1.9, 3 (teg jadvali), 9.30; boshqa MD da yo'q |
| «Haftasiga ko'pi bilan ikkita» | 12 MD + tayanch | 09 · 10 (O'qituvchi eslatmasi — yangi ma'no bilan) · tayanch 1.9, 9.30 → 9.41 b |
| «Eslatma qaytardi» (sabab da'vosi) | 12 MD | 09 (Mentor, asosiy fikr, «Endi siz bilasiz») · 10 da «qaytgan-qaytmaganini son ko'rsatadi» — qaytganlar foizi haqida, sabab emas: o'zgarishsiz |
| Loyiha kunida «uyda» | 4, 9-darslar | 09 (A-bo'lim, 3-blok) · 04 — yo'q |
| «Eslatma o'rnida» (04-FILTR 30 dan qolgani) | 12 MD | 09 ×3 (M2) |
| Jonli xabar «faqat o'ziga tegishli o'yin» — doirasiz | 12 MD + tayanch | 04 A-bo'lim · tayanch 1.4 · 09 A-bo'lim; 05 — «o'ziga tegishli o'yin uchun» 4-dars xabari haqida: o'zgarishsiz |
| Tekshiruvni keyingi blokdan keyinga surish | 12 MD | 09 A1 tuzatildi · 02, 04 A1, 05 — sabab tashqi kutish (Render), 04-FILTR 38 da ko'rilgan: o'zgarishsiz · 04 A2, 07, 08 — avval eng kichik tekshiruv: o'zgarishsiz |
| Agent — birinchi tekshiruv yo'li | 12 MD | 09 A1 (9.37 h ga moslandi); 3, 4, 5 — 05-FILTR da tuzatilgan |
| «Kam son, isbot emas» — nimaning isboti | 12 MD + tayanch | 09 · 8 va 10-darsdagi «15 ta qurilma — … isbot emas» tuzatish ta'siri haqida (sabab) — to'g'ri ishlatilgan: o'zgarishsiz |

`lint:til` — 09: 0 error, 1 warn (REPO dagi «qayta hisoblanadi» — haqiqiy hisob ma'nosi) · tayanch: 0 error, 2 warn (avvaldan) · 04, 10 — pastda.

## Foydalanuvchiga (oxirida birga javob beriladigan savollar ro'yxatiga qo'shiladi)

- **(g) O'yin kuni 9:00 eslatmasi olib tashlandi** — 2-amaliyotda bitta eslatma qoldi (uch kunlik). Tayanchdagi o'z qarorimni o'zgartirdim; qaytarish kerak bo'lsa — zaxiradan tiklanadi (shunda haftalik chegara va 90 daqiqa yana ochiladi).
- **(h) «Haftasiga ko'pi bilan ikkita»ning ma'nosi** — hamma eslatma sanaladi, o'yin eslatmasi har doim qo'yiladi, ilova o'zidan uchinchisini qo'shmaydi. Boshqacha bo'lishi kerak bo'lsa — ayting.
- **(i) 90 daqiqa** — pilotda sig'masa, haftalik chegara o'quvchi blokidan chiqarilib, faqat Mentor namunasida qoladimi?
