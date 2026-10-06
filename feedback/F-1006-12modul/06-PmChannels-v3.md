# 12-Modul · 6-dars (PM) «Birinchi foydalanuvchilar sizni qayerdan topadi?» — MD v3

Fayl: `src/10-Modull/PmChannelsLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m10-06` · **16 ekran** · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Pilot qoidalari (9-Modul `QURUVCHI_SABOQ.md` 1–18, 10-Modul `QURUVCHI_SABOQ.md` 19–31 — majburiy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q ·
keyingi bosiladigan joy doim ko'rinadi (faol element halqa va yengil to'lqin bilan, Mentor aynan shu harakatni aytadi) · bashorat tanlangach yopilmaydi — ixcham qator «Taxminingiz: …» natijagacha turadi ·
kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket (bir vaqtda bitta katta karta, tayyori o'z joyiga uchadi) · «Maydon Jamoa» — telefon va brauzer maketida o'z rangida; post — chat maketida ·
ekranga kirganda bo'sh, ma'nosiz element yo'q · ekranda ≤ 3 blok · maket chapda, karta o'ngda · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`0`) · 8-ekran — **D** (`3`) · 12-ekran — **B** (`1`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 402–404, DE-205): `m10-05` «Ulanish uzilsa: buzamiz va tuzatamiz» → **`m10-06` «Birinchi foydalanuvchilar sizni qayerdan topadi?»** (osti: «kanallar va birinchi post») → `m10-07` «50 foydalanuvchiga qanday yetasiz?».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (tanlangan kanallar va birinchi post), mustaqil ish majburiy (9, 10-ekranlar). Keys — **K8 Facebook** (tayanch 5, faqat bank matni).
**Real odamlar bilan ishlaydigan dars** — `00-TAQIQLAR.md` 2-bo'lim to'liq: darsda post faqat sinf chatiga, Mentor (o'qituvchi) ko'rgach; boshqa kanallarga — uyda, ota-onaga ko'rsatib va guruh egasidan ruxsat so'rab.
Kod mexanikasi (tayanch 4): **kod oynasi** (brauzerda ishlaydigan JS) — havoladan `kanal` ni o'qish (`URLSearchParams`). Lending kodiga belgi qo'shish — uyga vazifa (agentga bitta talab; Mentor misolida teg `m12-dars-06-done`). 1-dars — Antigravity bilan amaliy topshiriq, 3-dars — bloklar: mexanika ketma-ket takrorlanmaydi.
Vaqt: ≈ 90 daqiqa — kirish va reja ≈ 5 · tushunchalar, keys va testlar (2–8) ≈ 30 · kanallaringiz (9) ≈ 10 · post: yozish, sherik, ro'yxat, yuborish (10) ≈ 20 · kod oynasi (11) ≈ 10 · yakuniy savol, podium, kartochkalar, arena ≈ 15.
  Ulgurmagan o'quvchi yo'li: 9-ekranda bitta kanal ham yetadi (`optionalLive`) · 10-ekranda Mentor ko'rib ulgurmasa — post saqlanadi, «Uyda yuboraman» · 11-ekran — kod qoralamasi saqlanadi (`pm-m10d6-code`) · yakun sarlavhasi holatga qarab (15-ekran, to'rt holat).
Manba: `00-MODUL-TAYANCH.md` (1.0 — boshlanish · 1.1 — lending (Mentor lendingi, foydalar, `qoshilmoqchiman`) · **1.6 — kanallar, uch savol, Mentor kanallari, olti bandli ro'yxat, post, o'lchov, uyga vazifa — AYNAN** · 1.7 «APK» · 1.13 — Umami sonlari · 2 — atamalar · 3 — repo, teg 06 · 5 — K8 · 6 — Umami, EAS, Instagram · 7 — sinflar · 8 — `pm-m10d6-kanallar` · 9.3, 9.11, 9.12, 9.22) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 11, 12, 22) · `00-TAQIQLAR.md` (2-bo'lim to'liq) · `00-NOMLAR.md` · 11-Modul tayanchi (1.3 — intervyu yozuvlari va «Hozir nima bilan» sanog'i · 8 — `pm-m9d3-intervyu`) · `PM_Prompt_v8.md` K8 (208–211-qatorlar) · pilotlar `01-PmLanding-v3.md`, `07-PmFiftyUsers-v3.md` (tuzilish uchun).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «11-Modul» (kod `9-Modull` — intervyular), «2-Modul» (kod `1-Modull` — Facebook voqeasi, «auditoriya»), «9-Modul» (kod `7-Modull` — Umami). Kod raqami faqat fayl yo'lida.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi (tayanch 4: «uch kanal tanlangan; birinchi post yozilgan, tekshirilgan va sinf chatiga yuborilgan»):**
   o'quvchi o'z mahsuloti uchun ko'pi bilan uchta kanalni uch savol bilan tanlaydi (9-ekran); to'rt qatorli postni yozadi, sherigi bilan o'qiydi va olti bandli ro'yxat bo'yicha tekshiradi;
   postni Mentorga (o'qituvchiga) ko'rsatadi; Mentor aytgan postlar **sinf chatiga** yuboriladi (10-ekran). Sinfdoshlar mahsulot auditoriyasi bo'lsa — bu birinchi kanal; bo'lmasa — xavfsiz mashq, haqiqiy kanallarga uyda (06-FILTR 3). Kod oynasida havoladagi kanal belgisini o'qiydi (11-ekran). Saqlanadi: `pm-m10d6-kanallar` (7, 10-darslar o'qiydi).
   Natija besh holatda bo'lishi mumkin (15-ekran sarlavhasi shunga qarab): post sinf chatida · post tayyor va Mentorga ko'rsatilgan · post yozildi, ko'rsatilmagan · kanallar tanlandi, post to'liq emas · kanal tanlash to'liq emas. Belgi ✓ va nishon — birinchi ikki holatda (sinf 1; 06-FILTR 16).
   Bugun boshqa kanallarga hech narsa yuborilmaydi — ular uyda, ruxsat bilan (uyga vazifa ②). Ilovaning o'zi odamlarga bugun yuborilmaydi; bu boshqa darsning ishi (dars ichida va'da qilinmaydi, T-038).
2. **Bugungi asosiy fikr (P-013):** Birinchi kanal — auditoriyangiz bor, siz a'zo va post yozishga ruxsat bor joy; post olti band tekshirilgach yuboriladi. (Yakunda ScoreRing ostida; kartochkalarda so'zma-so'z yo'q.)
3. **Yangi atamalar — misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042; tayanch 2 aynan):**
   - **kanal** — «Odamlar mahsulot haqida eshitadigan joy — kanal deyiladi.» (2-ekran, Mentorning birinchi joyi uch savoldan o'tgach tug'iladi). Telegram'dagisi har doim to'liq: «Telegram guruhi», «Telegram kanali» (tayanch 2).
     **Kurs qolipi (sinf 2a — «Bizda» bilan):** «Bizda kanal uch savol bilan tanlanadi: …» (2-ekran xulosasi, kartochka 2, yakun). Uch savol — tayanch 1.6 so'zma-so'z: «Auditoriyangiz shu yerdami?» · «Siz u yerda a'zomisiz?» · «U yerda post yozishga ruxsat bormi?».
   - **post** — «Kanalga yoziladigan matn — post deyiladi.» (4-ekran, Mentor postining to'rt qatori topilgach). Fe'li — **yuboriladi** («e'lon qilinadi» emas — tayanch 2).
     **Kurs qolipi:** «Bizda post to'rt qatordan iborat: kim uchun, nima foyda, bitta harakat va halol holat.» (4-ekran xulosasi, kartochka 6, yakun). Tartib — tayanch 1.6 dagidek; «kim uchun» — birinchi qator.
   - **olti bandli ro'yxat** — tayanch 1.6 so'zma-so'z (bitta manba `XAVFSIZLIK`, 9.12; 7-dars ham shuni ishlatadi) — 6-ekranda yig'iladi, 10-ekranda belgilanadi. «Bu kursda» bilan (6-ekran xulosasi) — kurs qoidasi, umumiy qonun emas.
   - **kanal belgisi** — havola oxiridagi `?kanal=sinf` qismi: tashrif qaysi kanaldan kelganini aytadi, odamni emas (11-ekran; tayanch 1.6 «belgi» — nomi TAYANCHGA SAVOL 6).
   - **tashrif** — lendingning bir marta ochilishi (tayanch 1.6 so'zi; 9-Modulda «sahifa ochilishi» — 11-ekranda bir gap bilan tenglashtiriladi, T-052). Birligi — ochilish, odam emas.
     Umami sahifa ochilishini o'zi ham sanaydi; `tashrif` hodisasi — o'sha ochilish, lekin kanal belgisi bilan: kanal bo'yicha son shu hodisadan (11-ekran kulrang qatori, uyga vazifa ①; 06-FILTR 18).
4. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - **lending · foyda · asosiy tugma** (1-dars, tayanch 1.1) — Mentor lendingi va uch foydasi aynan; «Qo'shilmoqchiman» tugmasi, Umami hodisasi `qoshilmoqchiman`.
   - **auditoriya** (2-Modul: mahsulotdan foyda oladigan aniq odamlar guruhi) · **intervyu**, **«Hozir nima bilan»** (11-Modul 3-darsi: «Hozir buni nima bilan hal qilyapsiz?» savoli va yozuv qatori) · **yozuv**.
   - **Umami** (9-Modul: saytda odamlar nima qilganini yozib boradigan xizmat) · **hodisa** — bu darsda **faqat** analitika ma'nosida (Umami'ga yoziladigan bitta harakat: `qoshilmoqchiman`, `tashrif`); ulanish hodisasi bu darsda yo'q (T-015).
   - **talab** (qayerda · nima qilsin · nima buzilmasin) · **agent** · **Antigravity** (11-Modul) · **push** (faqat `git push`) · **trek** (web-trek, mobil trek — `pm-m9d8-platforma`) · **APK** (11-Modul 15-darsi: Android telefonga o'rnatiladigan ilova fayli) · **Render** · **Expo**.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«kanal»** — faqat atama ma'nosida; Telegram'dagi kanal — «Telegram kanali» (shahar futbol Telegram kanali), guruh — «Telegram guruhi». **«guruh»** — Telegram guruhi (mahalla futbol guruhi, to'garak guruhi); dars guruhi — «sinf».
   - **«post»** — kanalga yozilgan matn; fe'li «yuborish» (6-ekrandagi 5-band «Bitta xabarni ko'p guruhga tashlamayman» — tayanch so'zi, so'zma-so'z qoladi; boshqa joyda «xabar» post ma'nosida yo'q).
   - **«e'lon»** — faqat o'yin e'loni (Mentor postidagi «o'yin e'lon qilinadi»). **«sahifa»** — lending sahifasi; Instagram'dagisi — «Instagram sahifasi» (tayanch so'zi, to'liq nom bilan).
   - **«qator»** — postning to'rt qatori; **«band»** — ro'yxatning olti bandi. **«qadam»**, **«bosqich»** — o'quvchi matnida yo'q (12-Modulda «qadam» — foydalanuvchi yo'li, «bosqich» — 7-dars rejasi); 10-ekran qismlari raqam va nom bilan («1 · Yozish»), uyga vazifa — ①②③.
   - **«tekshirish»** — o'z postini ro'yxat bo'yicha ko'rish; **«sinov»** — bu darsda yo'q (real odam bilan mahsulot sinovi emas); sherikning o'qishi — «sherigingiz o'qiydi».
   - **«tekshiruv fayli»** — mobil trek uyga vazifasidagi birinchi o'rnatish fayli (tayanch 1.6, 9.22: faqat o'z telefoniga; «sinov fayli» emas — «sinov» faqat real odam bilan).
   - **«ruxsat»** — guruh egasining roziligi; **«egasi»** — guruh egasi. **«ota-ona»** — o'quvchining ota-onasi (band 4).
   - **Ishlatilmaydi:** reklama · trafik · manba (kanal ma'nosida) · kontent · spam (o'quvchi matnida — «bitta postni ko'p guruhga yuborish») · «zo'r» · user · deploy (o'quvchi matnida — «internetga chiqarish») · «Modul 12» · pilot · keys · A1.
6. **Mentor misoli — kanallar (tayanch 1.6 aynan; `MENTOR_JOYLAR`, `MENTOR_KANALLAR`):**

| Joy | 1 · Auditoriyangiz shu yerdami? | 2 · Siz u yerda a'zomisiz? | 3 · U yerda post yozishga ruxsat bormi? | Natija |
|---|---|---|---|---|
| Mahalla futbol guruhi (Telegram guruhi, 60 kishi) | ha — 11-Modul intervyulari: 5 o'yinchidan 5 tasi Telegram guruhida «kim keladi?» deb yozishadi | ha — Mentor shu guruh a'zosi | ha — guruh egasidan ruxsat olingan | kanal |
| Shahar bo'yicha katta futbol Telegram kanali (namuna) | ? — dalil yo'q: intervyuda bu kanal tilga olinmagan; dalil yo'q — «yo'q» degani emas (06-FILTR 5) | yo'q — Mentor u yerda a'zo emas | yo'q — post yozishga ruxsat yo'q | tanlanmaydi |

   - **Mentorning uch kanali:** mahalla futbol guruhi · sinf chati · o'z Instagram sahifasi (tayanch 1.6). Sinf chati va Instagram sahifasi bo'yicha uch savolning dalili — tayanch 9.38 (Mentor misolidagi olam faktlari); darsda ular faqat natija sifatida ko'rsatiladi, dalil — O'qituvchi eslatmasida (TAYANCHGA SAVOL 3).
   - **Kanal belgilari (Mentor misoli):** `?kanal=guruh` · `?kanal=sinf` · `?kanal=instagram` (tayanch 1.6).
7. **Mentor posti (mahalla futbol guruhi; tayanch 1.6 so'zma-so'z — `MENTOR_POST`; T-008: olam ichidagi matn):**
   «Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini qurdim: o'yin e'lon qilinadi, «Qo'shilaman» bosiladi, nechta odam yig'ilgani ko'rinib turadi. Ilova ishlayapti, o'rnatish havolasi hozircha yo'q — sahifasini ko'ring: {lending manzili}»
   - ⚠️ 06-FILTR 1: avvalgi «Ilova shu hafta chiqadi» 11-Modul holatiga zid edi (ilova ishlaydi, o'rnatish havolasi yo'q — 1-dars lending matni bilan bir); «kim uchun» kuchaytirildi («Mahalla futbolchilari», 06-FILTR 10).
   - To'rt qatorga bo'linishi (4-ekran; bo'linish — MD qarori, TAYANCHGA SAVOL 4): **kim uchun** — «Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini qurdim:» ·
     **nima foyda** — «o'yin e'lon qilinadi, «Qo'shilaman» bosiladi, nechta odam yig'ilgani ko'rinib turadi.» · **halol holat** — «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q —» · **bitta harakat** — «sahifasini ko'ring: {lending manzili}».
   - Maketda `{lending manzili}` — `maydon-jamoa-….netlify.app` (1-dars namunasi, haqiqiy havola emas); 11-ekranda shu havola oxiriga `?kanal=guruh` qo'shiladi.
   - Foyda qatori — Mentor lendingidagi ikki foydaning ma'nosi (tayanch 9.2: «6-dars posti … shu foydalardan»): «Bir bosishda jamoadasiz» va «Nechta odam yig'ilganini so'rab o'tirmaysiz». 6-dars posti — **qiziqish posti**: o'rnatish havolasi hali yo'q (tayanch 1.6).
8. **Olti bandli ro'yxat (tayanch 1.6, 9.12 — so'zma-so'z; bitta manba `XAVFSIZLIK`; o'quvchi matnida tekshiruv belgilari bilan):**
   1) «Faqat o'zim a'zo bo'lgan joyga yuboraman.» · 2) «Guruhga yuborishdan oldin egasidan ruxsat so'radim.» · 3) «Postda familiya, maktab raqami, telefon va uy manzili yo'q.» ·
   4) «Postni yuborishdan oldin ota-onamga ko'rsatdim.» · 5) «Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.» · 6) «Soxta akkaunt va sotib olingan obunachi ishlatmayman.»
   Ro'yxat ostida bir qator (belgisiz): «Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.» Sinf chatida 2-band — postni Mentorga ko'rsatish bilan (sinf chatining egasi o'rnida o'qituvchi). 4-band (ota-ona) Mentor bilan **yopilmaydi**: sinf chati — darsdagi o'qituvchi nazoratidagi joy, u yerga 4-bandsiz yuboriladi; sinfdan tashqaridagi har kanalga — ota-onaga ko'rsatgandan keyin (06-FILTR 13; tayanch 9.38).
9. **Raqamlar (faqat tayanchdan, «Mentor misolida»):** mahalla futbol guruhi — 60 kishi · intervyu — 5 o'yinchidan 5 tasi (11-Modul 1.3) · Umami (lending, tayanch 1.6 va 1.13): postdan oldingi kun — tashriflar **6**, «Qo'shilmoqchiman» **2** ·
   postdan keyingi kun — tashriflar **31**, «Qo'shilmoqchiman» **17**; kanal bo'yicha `guruh` **19** · `sinf` **9** · belgisiz **3** (19 + 9 + 3 = 31). K8 — 2004-yil va «ikki yildan keyin» (bank). Boshqa son yo'q.
   O'lchov va birlik (sinf 5): tashrif — sahifaning bir marta ochilishi, odam emas · «Qo'shilmoqchiman» — tugma bosilishi · ikkalasi ayirilmaydi va foizga aylantirilmaydi. Bir kunlik son va ikki joydagi post — «kam: farq bor, lekin isbot emas» (sinf 2d).
   `instagram` belgisining soni tayanchda yo'q — darsda ko'rsatilmaydi (TAYANCHGA SAVOL 5).
10. **Keys — K8 Facebook (tayanch 5, bank matni aynan):** «2004-yilda faqat Garvard talabalari uchun ochilgan — kichik, yopiq auditoriya, xizmatni tez orada «o'zinikilarning hammasi» ishlata boshlagan.
    Keyin universitet ketidan universitet; hamma uchun — ikki yildan keyin. Auditoriyaning zichligi hajmidan muhimroq. Raqamsiz.» Ruscha asl (`PM_Prompt_v8.md:209`): «…только для студентов Гарварда — маленькая закрытая аудитория, где сервисом быстро начали пользоваться «все свои». Потом университет за университетом, и только через два года — для всех. Плотность аудитории важнее размера.»
    Brend izohlari (S-018): «Facebook — do'stlar bilan yozishadigan va yangilik ulashadigan ijtimoiy tarmoq» · «Garvard — Amerikadagi universitet» (2-Modul yozilishi). Ko'prik (umumiy joy, tenglik emas): birinchi kanal — auditoriya zich turgan bitta joy (Mentor: mahalla futbol guruhi).
    Bankdan tashqari fakt (asoschi ismi, foydalanuvchi soni, sabab) yo'q. 2-Modulda (`PmLesson1`) shu voqea «kim uchun» savoli bilan bo'lgan — bugungi savol boshqa (O'qituvchi eslatmasida).
11. **Ikkinchi misol faqat testda (P-002), o'quvchi tanigan olamdan:** sport to'garagining Telegram guruhi (3-ekran) · sinf uy vazifalari sayti posti (5-ekran; Mentorning 11-Moduldagi 4-g'oyasi: «har fan bo'yicha vazifalar bir joyda»). Arena — sinfdosh, mahalla guruhi egasi, notanish odam (bitta gapda).
12. **Toza yuza (185, D-qoidalar):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q («har doim», «darhol», «100%»); tashqi qadamlarda «odatda», «bo'lishi mumkin», «ko'rinishi kerak — tekshiring».
13. **O'smir xavfsizligi (sinf 14, TAQIQLAR 2 — to'liq):**
    - kanallar faqat o'zi a'zo bo'lgan joylar va tanish doira (2, 3, 9-ekran); guruhga — egasidan ruxsat so'rab (2, 6, 9, 10, uyga vazifa ②); yangi akkaunt talab qilinmaydi (6, 9-ekran);
    - postda familiya, maktab raqami, telefon, uy manzili, akkaunt nomi — yo'q: 6-ekran vaziyati, 10-ekran tekshiruvi (telefon raqami, «@», «t.me/» va maktab raqami bloklanadi), olti band;
    - postni yuborishdan oldin ota-ona ko'radi; sinfda — Mentor (10-ekran, uyga vazifa ②); uchrashuv taklifi — faqat kattalar bilan (6-ekran ostki qatori, arena 7, uyga vazifa ②);
    - spam, «do'stingni taklif qil — sovg'a» kabi bosim, soxta akkaunt, sotib olingan obunachi — yo'q (6-ekran 5, 6-vaziyat; olti band);
    - saqlash kalitlarida faqat kanal **turi** («sinf chati»), guruhning haqiqiy nomi va havolasi emas (9-ekran «Boshqa» qatori tekshiruvi); sherik ismi yozilmaydi (10-ekran);
    - kanal belgisi odamni emas, kanalni bildiradi (11-ekran darvoza-mashqi); Expo akkaunti ma'lumoti boshqaga berilmaydi (uyga vazifa ③).
14. **Trek (sinf 12):** lending ikkala trekda bor (1-dars) — post, kanallar, kanal belgisi ikkala trekka bir xil. Farq — faqat uyga vazifa ③: mobil trekda tekshiruv fayli, web-trekda yo'q (tayanch 1.6). Halol holat qatorida web-trek Yordami: sayt allaqachon ishlasa — shuni yozing.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.0, 1.6):** 1-darsda lending yozildi; 2–5-darslarda ilova real vaqtda yangilanadigan bo'ldi va buzib tekshirildi. Lendingni hali kam odam ochadi — bugun birinchi kanallar va birinchi post.
  11-Modul 15-darsidagi risk «50 foydalanuvchi kerak, hozir 3 sinovchi» shu darsdan yopila boshlaydi (ekranda aytilmaydi — O'qituvchi eslatmasida).
- **Dars ipi:** 0 — Mentor lendingi bir kunda 6 marta ochilgan: ko'proq odam uni qayerdan ochadi? → 2 — Mentor ikki joyni uch savoldan o'tkazadi: mahalla futbol guruhi o'tadi, katta kanal o'tmaydi (atama «kanal») → 3 — test →
  4 — Mentor postida to'rt qator topiladi (atama «post») → 5 — test: qaysi qator yo'q → 6 — olti vaziyat: olti bandli ro'yxat yig'iladi → 7 — Facebook: kichik, yopiq auditoriyadan → 8 — test →
  9 — o'quvchi o'z kanallarini tanlaydi → 10 — o'z postini yozadi, sherigi o'qiydi, ro'yxat bo'yicha tekshiradi, Mentorga ko'rsatadi (Mentor aytsa — sinf chatiga) → 11 — kod: havoladan kanal belgisi o'qiladi; Mentor misolida 6 → 31 tashrif →
  12 — yakuniy test: guruhga qachon yuboriladi → podium → kartochkalar → yakun; uyda — lendingga kanal belgisi, qolgan kanallarga post (ruxsat bilan), mobil trekda tekshiruv fayli.
- **Bitta vizual — telefondagi chatlar (`ChatTelefon`, dars bo'yi; 163/180; bitta manba `MENTOR_JOYLAR` + `MENTOR_POST` + o'quvchi ma'lumoti `pm-m10d6-kanallar`):**
  - Telefon ramkasi ≈170×272 (tayanch 9.16 o'lchami; kichraymaydi — SABOQ 22), tepada kichik yorliq **Telegram** (o'z ko'k rangida, logotipsiz). Ramka ustida yorliq: 2, 4-ekranlarda «Mentor telefoni» · 9, 10-ekranlarda «sizning telefoningiz».
  - **Holatlar (bitta komponentdan):** **ro'yxat** (chatlar ro'yxati: joy nomi, kulrang turi va kishi soni, o'ngda uch kichik belgi-katak — bo'sh / ✓ yashil / ✕ kulrang) → **chat** (bitta chat oynasi: sarlavhada joy nomi; pufakda post — qatorlar ostida rangli ingichka chiziq va yorliq) →
    **qoralama** (pufak kulrang, ostida «Yuborilmagan»; qatorlar yozilgan sari pufakka tushadi) → **yuborildi** (pufak oq, ostida ✓ «Yuborildi»; vaqt belgisi yo'q).
  - Lending maketi (`LendingSahifa`, 1-dars komponenti, ixcham) — 0 va 11-ekranlarda brauzer oynasida; Umami hisoblagichi (`UmamiSanoq`, chizilgan, logotipsiz; SABOQ 24 — bitta jonli hisoblagich, jadval emas) — 0 va 11-ekranlarda.
  - `prefers-reduced-motion` da harakat to'xtaydi, yakuniy holat birdan qo'yiladi. Vizual ⛶ ichida (q17).
- **Brend o'z maketida (PM-028/029, S-018, SABOQ 2–3):** «Maydon Jamoa» — lending maketida va post matnida, o'z yashil rangida (11-Modul 9.62); «Telegram» — telefon tepasidagi yorliqda, o'z ko'k rangida; «Facebook» — 7-ekran sahnasida, brauzer oynasida, o'z ko'k rangida. Logotip chizilmaydi.
- **Keyingi bosiladigan joy (SABOQ 11, qat'iy):** har bosqichda bitta faol element — accent halqa doim, yengil to'lqin 2–3 marta; tanlov guruhida har variantda yumshoq halqa; yoqilgan pastki tugma ham halqada. `prefers-reduced-motion` da to'lqin o'chadi, halqa qoladi.
- **Bashorat (SABOQ 11, 25):** tanlangach karta yo'qolmaydi — savol va «Taxminingiz: …» ixcham qator bo'lib natijagacha turadi; natija chiqqach taxmin qatori xulosaning birinchi qatori bo'ladi (7-ekran).
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → narsa joyidan joyiga uchadi (javob katakka, yorliq post qatoriga, band ro'yxatga, kanal telefondagi ro'yxatga) · yangi qator ~1 s yashil yonadi · hisoblagich sanab o'sadi (11-ekran 6 → 31).
  Bezak-harakat (to'xtovsiz miltillash, aylanayotgan nuqtalar) yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Birinchi foydalanuvchilar sizni qayerdan topadi?** (48) — dars nomi (DE-205)
- Mentor: Lending internetda, ochilishi esa hali kam — o'zingizga yaqin javobni belgilang.
- Maket (chap): brauzer oynasi — manzil qatori `maydon-jamoa-….netlify.app`; ichida Mentor lendingi ixcham (1-dars ko'rinishi): kichik nom **Maydon Jamoa** (o'z rangida) · sarlavha «Mahalla futboliga jamoani bir joyda yig'ing» · tugma «Qo'shilmoqchiman».
  Ostida Umami hisoblagich-karta (chizilgan, logotipsiz): kulrang yorliq «Mentor misolida · bir kun» — **Tashriflar: 6** · **«Qo'shilmoqchiman»: 2**. Sahifa atrofida bo'sh joy — hech qanday yo'l chizilmagan.
- Variantlar (radio, o'ng; bir uzunlikda):
  - Qidiruvga mahsulot nomini yozib (31)
  - Tanish guruhdagi havolani bosib (31)
  - Tasodifan sahifaga kirib qolib (30)
- Javob — «Tanish guruhdagi…»: **Aynan!** Mentor misolida odamlar tanish guruhda allaqachon yig'ilgan — havolani o'sha yerda ko'radi. (91)
- Javob — «Qidiruvga…»: **Qiziq fikr!** Qidiruvga odam nom yozadi — «Maydon Jamoa» nomini esa hali kam odam biladi. (91)
- Javob — «Tasodifan…»: **Qiziq fikr!** Tasodif ham bo'ladi, lekin uni kutib bo'lmaydi — havolani odamlarga o'zingiz ko'rsatasiz. (105)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant ixcham qator bo'lib qoladi; brauzer maketiga tanlangan yo'ldan bitta ingichka chiziq chiziladi (qidiruv qatori · chat pufagi · «?» belgisi) va Umami kartasidagi «6» accent halqa bilan yonadi (son o'zgarmaydi — 11-ekran kashfiyoti, P-036).
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni). Uchala javob ekrandagi dalilga suyanadi (T-067): sahifa bor, ochilishi esa kam.
- Ballsiz (J-026: `correct: false` hammaga; «Aynan!» / «Qiziq fikr!» — kurs qonuni T-028, T-067). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: tanlovgacha uch variant halqada (navbatma-navbat to'lqin); tanlovdan so'ng «Davom etish».
- O'qituvchi eslatmasi: Sinfdan so'rang: 1-darsdan beri lendingingizni kimlar ochdi? (uydagilar, sherik). Javobni muhokama qilmang — 2-ekranda joylar uch savol bilan tanlanadi.
  6 — Mentor misolining soni (tayanch 1.6, postdan oldingi kun); o'quvchining sahifasida son boshqacha bo'ladi. 11-Modul 15-darsidagi «50 foydalanuvchi kerak» riski shu darsdan yopila boshlaydi — o'quvchiga hozir aytmang.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingizni birinchi odamlarga tanishtirasiz.** (55)
- Mentor: Lending bor — endi uni odamlar ko'rishi kerak. Qayerda ko'rishini o'zingiz tanlaysiz, matnni ham o'zingiz yozasiz.
- Chap — «Dars oxirida: kanallar va birinchi post» (App.jsx osti so'zma-so'z — P-015; «kanallar» va «post» — kulrang yorliq ichida, atamalar 2 va 4-ekranda tug'iladi) + vizual: `ChatTelefon` skeleti —
  chatlar ro'yxatida uch kulrang qator 0.4 s oraliqda chiziladi, so'ng chat oynasida bitta bo'sh pufak-skelet paydo bo'ladi (matnsiz; kashfiyot ochilmaydi).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Mahsulotingiz haqida qayerda yozishni tanlaysiz · `kanal`
  - 02 · Yuborishdan oldin nimani tekshirishni bilib olasiz · `xavfsizlik`
  - 03 · Facebook kimlardan boshlanganini ko'rasiz · `voqea`
  - 04 · Birinchi postni yozib, sinf chatiga yuborasiz · `post`
- Harakat yo'q (reja ekrani) — vizual o'zi chiziladi. Tugmalar: Orqaga · Boshlaymiz
- Izoh (MD): sarlavhada yangi atama yo'q (T-011) — «kanal», «post» faqat kulrang yorliqda; reja ta'rif aytmaydi va uch savol, to'rt qator, olti bandni oldindan ochmaydi (P-015).
  «mahsulotingizni» — 11-Modulda o'quvchida mahsulot bor (T-039). 04 — o'quvchining harakati; Mentorga ko'rsatilmasa yuborish uyda (P-026: yakun holati).

## 2 · Uch savol  ← QTushuncha (markaziy; atama «kanal» — misoldan keyin)
- Eyebrow: Tushuncha · kanal
- Sarlavha: **Mentor mahsuloti haqida qayerda yozadi?** (39) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: Ikki joydan birini tanlayapman: har savolga kulrang yozuvga qarab «Ha» yoki «Yo'q»ni bosing.
- Vizual (SABOQ 21 — maket chapda, karta o'ngda):
  - **chapda — `ChatTelefon`** (ro'yxat holati; ramka ustida «Mentor telefoni»), ikki qator:
    **Mahalla futbol guruhi** — kulrang «Telegram guruhi · 60 kishi» · **Shahar futbol kanali** — kulrang «Telegram kanali · katta». Har qator o'ngida uch bo'sh belgi-katak. Joriy joy accent halqada.
  - **o'ngda — bitta karta «Uch savol»:** joriy savol (tayanch 1.6 so'zma-so'z) katta yozuvda, ostida kulrang qator — **Mentor yozuvi** (dalil), pastda ikki tugma **Ha** · **Yo'q**.
    Kartaning tepasida ixcham qator — uch savol raqami (1 · 2 · 3), o'tilgani ✓ yoki ✕.
- Savollar va Mentor yozuvlari (navbat bilan: avval mahalla guruhi 1 → 2 → 3, keyin shahar kanali 1 → 2 → 3; bitta manba `MENTOR_JOYLAR`, A-6 jadvali):
  - Mahalla futbol guruhi · 1 «Auditoriyangiz shu yerdami?» — yozuv: 11-Modul intervyusi, «Hozir nima bilan»: 5 o'yinchidan 5 tasi Telegram guruhida «kim keladi?» deb yozishadi. → **Ha**
  - · 2 «Siz u yerda a'zomisiz?» — yozuv: Mentor shu guruh a'zosi. → **Ha**
  - · 3 «U yerda post yozishga ruxsat bormi?» — yozuv: Guruh egasidan ruxsat olingan. → **Ha**
  - Shahar futbol kanali · 1 — yozuv: Intervyuda bu kanal tilga olinmagan — dalil yo'q. → tugmalar o'rnida kulrang katak **?** va tugma **Keyingi savol** (javob tanlanmaydi; 06-FILTR 5)
  - · 2 — yozuv: Mentor bu kanalda a'zo emas. → **Yo'q**
  - · 3 — yozuv: Kanalga post yozishga ruxsat yo'q. → **Yo'q**
- `QXato` (≤60; javobni aytmaydi — savolga qaytaradi): 1-savolda — Dalil — intervyudagi javob: unda shu joy bormi? (47) · 2-savolda — Yozuvni qayta o'qing: Mentor u yerda a'zomi? (44) · 3-savolda — Yozuvda ruxsat haqida nima deyilgan? (36)
- **Harakat → Vizual o'zgarish:**
  1. To'g'ri tugma → javob kartadan telefondagi qatorga uchadi: belgi-katak ✓ (yashil) yoki ✕ (kulrang); keyingi savol kartaga sirg'alib kiradi. Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato`.
  2. Mahalla guruhi 3/3 ✓ dan so'ng qator yashil ramka oladi, ustida yorliq **kanal** paydo bo'ladi (atama — misoldan keyin), `QIzoh`: Odamlar mahsulot haqida eshitadigan joy — kanal deyiladi. (57)
  3. Shahar kanali (? ✕ ✕) dan so'ng qator kulrang, ustidan ingichka chiziq; yorliq «tanlanmadi»; `QIzoh`: Dalil yo'q — «yo'q» degani emas: bu joyni a'zolik va ruxsat to'xtatdi. (70)
- Natija (`tugadi`): karta yo'qoladi; telefon ro'yxati butun enga — mahalla guruhi ✓✓✓, shahar kanali ?✕✕; ostiga yana ikki qator sirg'alib kiradi — **Sinf chati** · **O'z Instagram sahifasi** (belgi-kataksiz), uch qator ustida kulrang yorliq «Mentorning uch kanali».
- Xulosa: Bizda kanal uch savol bilan tanlanadi: bittasiga «yo'q» bo'lsa, u joy tanlanmaydi. (82)
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Kulrang yozuvni o'qing — u savolga nima deydi?
- Tugma (pastki): Savollarga javob bering (N/5) → Davom etish · vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: «Ha» / «Yo'q» (ikkalasi yumshoq halqada) → «Davom etish».
- O'qituvchi eslatmasi: 1-savolning dalili — 11-Moduldagi intervyu yozuvlari («Hozir nima bilan» qatori). Katta kanal — ko'p odam degani, lekin a'zo bo'lmagan va ruxsat yo'q joyga post yozilmaydi: bu kursning xavfsizlik qoidasi (Qaror-0 12).
  Sinfdan so'rang: siz a'zo bo'lgan qaysi guruhda mahsulotingiz auditoriyasi bor? Sinf chati va Instagram sahifasining dalili ekranda yo'q — so'rashsa (tayanch 9.38): «Mentor sinfida mahalla futbolida o'ynaydiganlar bor, Mentor a'zo, ruxsatni o'qituvchi beradi · Instagram — o'z sahifasi, obunachilari orasida mahalla futbolchilari bor, ruxsat o'zida».

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — o'smir olami, P-002)
- Eyebrow: Tekshiruv · uch savol
- Savol: **Sport to'garagining Telegram guruhida a'zo emassiz. Nima qilasiz?** (8 so'z) · savol ustida yorliq yo'q (SABOQ 6)
  - A — Guruhga qo'shilib, o'sha kuni post yozasiz (42)
  - B — Guruh a'zolariga birma-bir shaxsiy yozasiz (42)
  - ✔ C — O'zingiz a'zo bo'lgan joydan boshlaysiz (39)
  - D — Yangi akkaunt ochib, guruhga post yozasiz (41)
- To'g'ri izohi: Ikkinchi savolga javob «yo'q» — bu joy kanalingiz emas. (55)
- Xato izohlari: A — Qo'shilgan zahoti yozish — egasidan ruxsat so'ralmagan. (55) · B — Ular sizni tanimaydi — notanishga shaxsiy yozilmaydi. (53) ·
  D — Yangi akkaunt ham ruxsat bermaydi — egasi so'ralmagan. (54) · (umumiy) Uch savolni shu guruhga bering: qaysi biri «yo'q»? (50)
- Javob topilgach (QuestionScreen `vizual`, jonli darsda — natija ochilgandan keyin; SABOQ 4): savol ostida `ChatTelefon` ro'yxatidan bitta kichik qator — «Sport to'garagi · Telegram guruhi», belgi-kataklari: 1 — bo'sh, 2 — ✕, 3 — ✕.
- Izoh (MD): A — 3-savol (ruxsat so'ralmagan) va 2-band; B — notanish odamga shaxsiy yozish (5-band, Qaror-0 12); D — yangi akkaunt (Qaror-0 12: talab qilinmaydi; ruxsat baribir yo'q). Har biri dars qoidasi bo'yicha noto'g'ri (S-004), hayotda «to'g'ri yo'l» bo'lib qolmaydi.
  «guruh» A, B, D da; «a'zo» B va C da — kalit so'z faqat to'g'rida emas (S-003). C — 1-band ma'nosi, boshqacha so'z bilan.

## 4 · To'rt qator  ← QTushuncha (tanlash → bosish; atama «post» — misoldan keyin)
- Eyebrow: Tushuncha · post
- Sarlavha: **Mahalla guruhiga Mentor nima deb yozdi?** (39)
- Mentor: Avval o'ngdagi yorliqni tanlang, so'ng chapdagi matnda uning joyini bosing.
- Vizual:
  - **chapda — `ChatTelefon`** (chat holati, sarlavha «Mahalla futbol guruhi · 60 kishi»; ramka ustida «Mentor telefoni»): oq pufakda Mentor posti (A-7 so'zma-so'z; «Maydon Jamoa» o'z rangida, havola `maydon-jamoa-….netlify.app`).
    Post to'rt bo'lakka bo'lingan: har bo'lak ostida kulrang uzuq chiziq (U-041 — joylash zonasi).
  - **o'ngda — to'rt yorliq** (aralash tartibda; har birining ostida kulrang izoh, tayanch 1.6): **halol holat** — hozir nima tayyor · **kim uchun** — post kimga qaratilgan · **bitta harakat** — odam endi nima qiladi · **nima foyda** — odam nima oladi.
- To'g'ri joylar (A-7): kim uchun → «Mahalla futbolchilari, … qurdim:» · nima foyda → «o'yin e'lon qilinadi, … ko'rinib turadi.» · halol holat → «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q —» · bitta harakat → «sahifasini ko'ring: …».
- `QXato` (≤60; tanlangan yorliqqa qarab, joyni aytmaydi): kim uchun — Kim uchun — post kimga qaratilgan. Bu joyda shu bormi? (54) · nima foyda — Foyda — odam nima oladi. Bu joyda shu bormi? (44) ·
  bitta harakat — Harakat — odam endi nima qiladi. Bu joyda shu bormi? (52) · halol holat — Holat — hozir nima tayyor. Bu joyda shu bormi? (46)
- **Harakat → Vizual o'zgarish:** yorliqni tanlash → yorliq accent halqada, matndagi to'rt bo'lak yumshoq halqada · bo'lakni bosish → to'g'ri bo'lsa yorliq bo'lak ostiga uchadi, uzuq chiziq o'sha yorliq rangida to'liq chiziqqa aylanadi (~1 s yashil);
  noto'g'ri bo'lsa yorliq silkinib joyiga qaytadi, bitta `QXato`. Uchala yorliqdan keyin to'rtinchisi o'z joyiga o'zi uchmaydi — o'quvchi bosadi.
  4/4 dan so'ng pufak ustida yorliq **post** paydo bo'ladi (atama — misoldan keyin), `QIzoh`: Kanalga yoziladigan matn — post deyiladi. (41)
- Natija (`tugadi`): yorliqlar ustuni yo'qoladi; pufak butun enga, to'rt bo'lak ostida rangli chiziq va yorliq — kim uchun · nima foyda · halol holat · bitta harakat.
- Xulosa: Bizda post to'rt qatordan iborat: kim uchun, nima foyda, bitta harakat va halol holat. (86)
- Ipucha (40 s): Tanlangan yorliq ostidagi kulrang izohni o'qing — matnning qaysi joyi shuni aytadi?
- Tugma (pastki): Yorliqlarni joylang (N/4) → Davom etish · vizual ⛶ ichida.
- Keyingi bosiladigan joy: yorliqlar (navbatma-navbat to'lqin) → tanlangandan so'ng matndagi bo'laklar → «Davom etish».
- O'qituvchi eslatmasi: Foyda qatori — Mentor lendingidagi ikki foydaning ma'nosi: bir bosishda qo'shilish va nechta odam yig'ilgani ko'rinishi (1-dars). «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q» — halol holat: ilova ishlaydi (11-Modul), o'rnatish havolasi 7-darsda; shuning uchun harakat — lendingni ko'rish.
  Mentor postida halol holat harakatdan oldin turibdi — qatorlar tartibi postda bir xil bo'lishi shart emas, «kim uchun» esa birinchi. Post — e'lon emas: «e'lon» faqat o'yin e'loni; post yuboriladi.

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — Mentorning 11-Moduldagi 4-g'oyasi, P-002)
- Eyebrow: Tekshiruv · to'rt qator
- Iqtibos (savol ustida, `ChatTelefon` pufagida; chat sarlavhasi «Sinf chati»): «Sinfdoshlar, uy vazifalari bir joyda turadigan sayt: har fan alohida ro'yxatda. Sahifani oching: …» (namoyish matni — TAYANCHGA SAVOL 7)
- Savol: **Bu postda to'rt qatordan qaysi biri yo'q?** (7 so'z) · savol ustida yorliq yo'q
  - ✔ A — Sayt hozir qanday holatda ekani (31)
  - B — Post kimlarga qaratib yozilgani (31)
  - C — Odam saytdan nima foyda olishi (30)
  - D — Odam endi nima qilishi kerakligi (32)
- To'g'ri izohi: Sayt hozir ishlaydimi yoki hali yo'qmi — postda yozilmagan. (59)
- Xato izohlari: B — Birinchi so'zni o'qing: post kimga qaratilgan? (46) · C — «Bir joyda turadigan» — odam oladigan narsa emasmi? (51) ·
  D — Oxirgi gapda odamga nima qilish aytilgan? (41) · (umumiy) To'rt qatorni birma-bir izlang: qaysi biri topilmadi? (53)
- Javob topilgach (kichik, savol ostida): pufakdagi uch bo'lak 4-ekrandagi rangli chiziq va yorliq bilan (kim uchun · nima foyda · bitta harakat); «Sahifani oching» oldida bo'sh uzuq joy — yorliq «halol holat?».
- Izoh (MD): har variant bitta qatorning savoli (A — halol holat, B — kim uchun, C — nima foyda, D — bitta harakat): «holat», «kim», «foyda», «nima qilishi» — har biri o'z variantida, kalit so'z faqat to'g'rida emas (S-003).
  Post qasddan «halol holat»siz: sayt bormi, hali yo'qmi — bilinmaydi (S-004: B, C, D postda bor).

## 6 · Olti band  ← QTushuncha (ketma-ket, 6 vaziyat; SABOQ 9/13)
- Eyebrow: Tushuncha · xavfsizlik
- Sarlavha: **Postni yuborishdan oldin nimani tekshirasiz?** (44)
- Mentor: Har vaziyatga «Mumkin» yoki «Mumkin emas» deb javob bering.
- Vizual:
  - **chapda — ro'yxat kartasi «Yuborishdan oldin»** (sarlavha yonida hisoblagich «n / 6»): bandlar bittadan qo'shiladi, har band oldida bo'sh tekshiruv katagi (☐ — bu ekranda belgilanmaydi, 10-ekranda belgilanadi).
  - **o'ngda — bitta vaziyat kartasi** (joriy), ostida ikki tugma **Mumkin** · **Mumkin emas**. Chip qatori (ixcham): 1 · 2 · 3 · 4 · 5 · 6 (joriysi accent, o'tgani ✓).
- Vaziyatlar (tartib — bandlar tartibi; namoyish matnlari — TAYANCHGA SAVOL 8) → to'g'ri javob → qo'shiladigan band (A-8 so'zma-so'z):
  1. «Postni o'zingiz a'zo bo'lgan sinf chatiga Mentor ko'rgach yuborasiz.» → **Mumkin** → 1) «Faqat o'zim a'zo bo'lgan joyga yuboraman.»
  2. «Mahalla guruhiga egasidan so'ramasdan post yuborasiz.» → **Mumkin emas** → 2) «Guruhga yuborishdan oldin egasidan ruxsat so'radim.»
  3. «Postga maktabingiz raqami va telefoningizni yozasiz.» → **Mumkin emas** → 3) «Postda familiya, maktab raqami, telefon va uy manzili yo'q.»
  4. «Yuborishdan oldin postni ota-onangizga ko'rsatasiz.» → **Mumkin** → 4) «Postni yuborishdan oldin ota-onamga ko'rsatdim.»
  5. «Bitta postni o'nta guruhga birdaniga yuborasiz.» → **Mumkin emas** → 5) «Bitta xabarni ko'p guruhga tashlamayman, notanish odamga shaxsiy xabar yozmayman.»
  6. «Ko'proq ko'rinsin deb obunachi sotib olasiz.» → **Mumkin emas** → 6) «Soxta akkaunt va sotib olingan obunachi ishlatmayman.»
- `QXato` (≤60; tanlangan javobga qarab): 1 — A'zo bo'lgan chat, Mentor ko'rgan — qaysi band to'sadi? (55) · 2 — Guruhning egasi bor — avval undan so'raladi. (44) · 3 — Postni ko'p odam ko'radi — unda nima turibdi? (45) ·
  4 — Ota-ona ko'rishi — sizning xavfsizligingiz uchun. (49) · 5 — O'nta guruh — hammasida a'zomisiz, ruxsat bormi? (48) · 6 — Sotib olingan obunachi — halol son emas. (40)
- **Harakat → Vizual o'zgarish:** to'g'ri javob → vaziyat kartasi kichrayib chapdagi ro'yxatga uchadi va o'sha band bo'lib ochiladi (~1 s yashil), hisoblagich n / 6 sanab o'sadi; keyingi vaziyat kiradi.
  Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato`. 6/6 dan so'ng ro'yxat ostida belgisiz qator sirg'alib kiradi: **Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.**
- Natija (`tugadi`): vaziyat kartasi va chip qatori yo'qoladi; ro'yxat kartasi butun enga — olti band, bo'sh kataklar, ostki qator.
- Xulosa: Bu kursda post olti band tekshirilgandan keyin yuboriladi. (58)
- Tugma (pastki): Vaziyatlarga javob bering (N/6) → Davom etish
- Keyingi bosiladigan joy: «Mumkin» / «Mumkin emas» (ikkalasi yumshoq halqada) → «Davom etish».
- Nishon: **Safe Check!** (olti vaziyat birinchi urinishda).
- O'qituvchi eslatmasi: Ro'yxat — bu kursning qoidasi (o'smir xavfsizligi, Qaror-0 12); 7-darsda ikkinchi post ham shu ro'yxat bilan tekshiriladi (o'quvchiga aytmang). «Uchrashuv taklifi»ni ochiq gapiring: kim yozsa ham — faqat kattalar bilan.
  5-band so'zi «xabar» — tayanchdagidek qoldirildi; bu darsda u post ma'nosida. Instagram — 13 yoshdan (rasmiy qoida, tayanch 6): sahifasi yo'q o'quvchiga ochish taklif qilinmaydi.

## 7 · Facebook  ← QVoqea (PM keys K8; SABOQ 2, 3, 8, 26)
- Eyebrow: Biznes olamidan
- Sarlavha: **Facebook kimlardan boshlangan?** (30)
- Nuqtalar (3) · yorliq **Facebook · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Facebook** (o'z ko'k rangida) — do'stlar bilan yozishadigan va yangilik ulashadigan ijtimoiy tarmoq. Logotip yo'q.
- Mentor — bosqich gapini aytadi, har kadrda almashadi (≤2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket; takror matn yo'q.
- Sahna (`FacebookSahna`, chizilgan CSS/SVG; bankda yo'q narsa chizilmaydi — asoschi, foydalanuvchi soni, sabab yo'q):
  - 1/3 **Garvard** — Mentor: 2004-yilda Facebook faqat Garvard talabalari uchun ochilgan — kichik, yopiq auditoriya. Garvard — Amerikadagi universitet.
    · sahna: brauzer oynasi, tepada nom **Facebook** (o'z rangida); oynaning yonida bitta doira — ichida kulrang siluetlar guruhi (sonsiz), doira chetida qulf belgisi va yorliq «faqat Garvard talabalari».
    · bashorat (sahna ostida, bitta qator; S-015 — bitta o'lchov, o'sish tartibida: bir nechta → bir qismi → hammasi): **Yopiq auditoriyada xizmatni kimlar ishlata boshlagan?** ·
      Bir nechta qiziquvchi · Talabalarning bir qismi · O'zinikilarning hammasi — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi (P-053 `pre` kadr).
  - 2/3 **O'zinikilar** — Mentor: Xizmatni tez orada «o'zinikilarning hammasi» ishlata boshlagan.
    · sahna: doira ichidagi siluetlar birma-bir yonadi, oxirida doira to'liq yashil; qulf joyida qoladi.
  - 3/3 **Hamma uchun** — Mentor: Keyin universitet ketidan universitetga ochilgan, hamma uchun — ikki yildan keyin. Auditoriyaning zichligi hajmidan muhimroq.
    · sahna: birinchi doira yonida yangi doiralar navbat bilan paydo bo'lib yonadi (universitetlar, sonsiz), keyin hammasini katta ochiq doira o'raydi — yorliq «hamma uchun · ikki yildan keyin». Foydalanuvchi soni chizilmaydi.
- Bashorat natijasi (`QTaxmin`): «Taxminingiz: … · haqiqatda: o'zinikilarning hammasi» yoki «Taxminingiz to'g'ri chiqdi»; bashorat kartasi tanlangan variant ✓/✕ bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** «Voqea davomi» (pastki tugma, halqada) yoki bashorat varianti → Mentor gapi, kadr nomi va sahna almashadi (yangi element bir lahza ajralib kiradi).
- Xulosa (3/3 dan so'ng, pastda, yashil): Bu voqeada xizmat avval kichik, yopiq auditoriyada ochilgan. Mentorning birinchi kanali ham — o'zi a'zo guruh. (110)
- Qator (`QIzoh`, xulosadan keyin, bitta): Zich auditoriya — mahsulot kerak bo'lgan odamlar bir joyda ko'p yig'ilgani. (75) (06-FILTR 7: bank so'zi o'zgarmaydi, izoh — o'quvchi uchun)
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- O'qituvchi eslatmasi: Facebook voqeasini 2-Modulda «Sayt kim uchun?» savoli bilan ko'rgansiz — eslating; bugungi savol boshqa: birinchi odamlar qayerda. «Zich auditoriya» — mahsulot kerak bo'lgan odamlar bir joyda yig'ilgan (sinfga og'zaki izoh, bank so'zi «zichlik»).
  Ko'prik — umumiy joy: Facebook va mahalla guruhi bir narsa emas. Bankdan tashqari raqam, ism va sabab qo'shmang.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K8 (208–211-qatorlar; ruscha asli — A-10) · tayanch 5 (o'zbekcha matn, brend izohlari).

## 8 · 3-savol  ← QTest (✔ D, `correctIdx 3`; Facebook qoidasi — o'quvchining birinchi kanali)
- Eyebrow: Tekshiruv · Facebook'dagidek
- Savol: **Facebook voqeasi birinchi kanal haqida nimani eslatadi?** (7 so'z) · savol ustida yorliq yo'q
  - A — Auditoriyasi eng katta joydan boshlashni (40)
  - B — Bir kunda hamma guruhga yozib chiqishni (39)
  - C — Avval universitet talabalariga yozishni (39)
  - ✔ D — Auditoriya zich turgan joydan boshlashni (40)
- To'g'ri izohi: Bu voqeada xizmat avval kichik, yopiq auditoriyada ochilgan. (60)
- Xato izohlari: A — Facebook eng katta auditoriyadan boshlaganmi? (45) · B — Bu voqeada hamma uchun ochilish — ikki yildan keyin. (52) ·
  C — Garvard — Facebook auditoriyasi edi. Siznikichi? (48) · (umumiy) Facebook avval kimlar uchun ochilganini eslang. (47)
- Javob topilgach (kichik, savol ostida): 7-ekran 2/3 kadri — bitta yashil doira, qulf bilan.
- Izoh (MD): A va D — «auditoriya … joydan boshlashni» bir qolipda (kalit so'z faqat to'g'rida emas; «katta» ↔ «zich» — bank qarama-qarshiligi); B — bankdagi tartibga zid; C — voqeaning o'zini ko'chirish (sinf 9). S-004.

## 9 · Kanallaringiz  ← QMustaqil (USTAXONA — ketma-ket karta, ko'pi bilan 3 joy; SABOQ 9, 13, 17, 29)
- Eyebrow: Mustaqil ish · kanallar
- Sarlavha: **Kanallaringizni uch savol bilan tanlang.** (40)
- Mentor: Joy turini tanlang va uch savolga javob bering — birinchisiga dalil 11-Modul intervyularingizda.
  (`pm-m9d3-intervyu` yo'q bo'lsa — Mentor: Joy turini tanlang va uch savolga javob bering — birinchisiga dalil intervyu qog'ozingizda.)
- **Chapda — `ChatTelefon`** (ro'yxat holati; ramka ustida «sizning telefoningiz»): saqlangan joylar qatorlari, har birida uch belgi-katak; tepada hisoblagich «Kanallarim · n / 3».
- **O'ngda — bitta katta karta (joriy joy)**, to'rt qism ketma-ket:
  1. **Joy turi** — tugmalar (egaliksiz tur-nomi, KORPUS §13): Sinf chati · Maktab chati · Mahalla guruhi · To'garak guruhi · Do'stlar · O'z Instagram sahifasi · Boshqa
     («Boshqa» → qator, placeholder «Joy turi — guruh nomi emas», ≤30). Kulrang qator: Guruhning nomini emas — turini tanlang.
  2. **«Auditoriyangiz shu yerdami?»** — Ha · Yo'q. Ostida kulrang dalil qatori: `pm-m9d3-intervyu.yozuvlar[].hozir` bo'lsa — «11-Modul intervyularingiz, «Hozir nima bilan»: «{hozir}» · «{hozir}»» (har biri yonida kulrang g'oya nomi); yo'q bo'lsa — «Intervyu qog'ozingizdagi «Hozir nima bilan» qatoriga qarang.»
  3. **«Siz u yerda a'zomisiz?»** — Ha · Yo'q
  4. **«U yerda post yozishga ruxsat bormi?»** — Ha · Uyda so'rayman · Yo'q. Ostida kulrang qator turga qarab:
     Sinf chati — «Sinf chatiga ruxsatni darsda Mentor beradi — postni ko'rgach.» · O'z Instagram sahifasi — «O'z sahifangiz: ruxsat sizda. Sahifa bo'lmasa — yangi akkaunt ochish shart emas.» · qolganlari — «Guruh egasidan so'raladi.»
  «Saqlash» o'ngda (187).
- Tekshiruv (`QXato`, ≤60):
  - joy turi tanlanmagan (bloklaydi): Avval joy turini tanlang. (25)
  - «Boshqa» qatorida «@», «t.me/», «http» yoki 7+ raqam (bloklaydi): Guruh nomi va havolasi yozilmaydi — faqat turini yozing. (56)
  - shu tur ikkinchi marta: Bu tur ro'yxatda bor — boshqa joyni tanlang. (44)
  - 1 yoki 2-savolga «Yo'q» (`QIzoh`, xato emas, kulrang): Bu joy uch savoldan o'tmadi — kanallaringizga kirmaydi. (55)
- Yordam (bosilsa ochiladi — Mentor misolidan, A-6): Mentor misolida: mahalla futbol guruhi — ha · ha · ha (intervyuda 5 o'yinchidan 5 tasi Telegram guruhida; a'zo; egasidan ruxsat olingan). Shahar futbol kanali — a'zo emas, ruxsat yo'q: tanlanmadi.
- **Harakat → Vizual o'zgarish:** «Saqlash» → joy qatori kartadan telefondagi ro'yxatga uchadi, uch belgi-katak navbat bilan belgilanadi (✓ yashil · ✕ kulrang · «Uyda so'rayman» — kulrang yozuv «ruxsat kutilmoqda»; `QIzoh`: Ruxsat olingach bu joyga post yuboriladi — hozircha u kanal emas. — 06-FILTR 2), hisoblagich n / 3 sanab o'sadi;
  o'tgan joy ostida kulrang mono qator — kanal belgisi (`?kanal=sinf` kabi; KOD — tur bo'yicha, A-6). O'tmagan joy kulrang, ustidan chiziq. Pastdan keyingi bo'sh karta kiradi (3 tagacha). Tekshiruvdan o'tmagan qism `err` fon, ostida bitta `QXato`.
  Uchinchisidan so'ng (yoki «Yetarli» tugmasi bilan — kamida bitta kanal o'tgach) karta yopiladi; telefon ro'yxati butun enga, har qatorda ✎ (bosilsa o'sha joy katta karta bo'lib ochiladi — SABOQ 29).
- Xulosa (tanlovdan, P-046):
  - kamida bitta kanal o'tdi: Kanallaringiz tanlandi: «yo'q» bo'lgan joyga post yuborilmaydi. (63)
  - hech biri o'tmadi: Hozircha uch savoldan o'tgan joy yo'q — bugun postni yozib, Mentorga ko'rsatasiz. (81)
- Saqlash: `pm-m10d6-kanallar.kanallar = [{ id, nom, auditoriya, azo, ruxsat }]` (≤3; tayanch 8) — faqat **o'tgan** joylar: 1 va 2-savol «Ha», 3-savol «Ha» (`ruxsat: 'bor'`) yoki «Uyda so'rayman» (`ruxsat: 'soraladi'` — ruxsat kutilmoqda, hali kanal emas; 06-FILTR 2); `nom` — tur yozuvi («sinf chati»), guruhning haqiqiy nomi emas.
  O'tmagan joy saqlanmaydi (TAYANCHGA SAVOL 9). `id` — `k1`…`k3`, tartib o'zgarmaydi.
- Tugma (pastki): Kamida bitta joyni tekshiring (N/3) → Davom etish (`optionalLive` — jonli darsda Mentor o'tkazishi mumkin).
- Keyingi bosiladigan joy: joy turi tugmalari (navbatma-navbat to'lqin) → joriy savolning tugmalari → «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Kanallarim · n» (ixcham); 10, 11, 15-ekranlarda ko'rinadi; test, arena, podiumda yo'q.
- Nishon: **My Channels!** (kamida bitta kanal uchala savoldan o'tib saqlanganda).
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda. Mentor rejimi: forma o'rniga Mentorning uch kanali (2-ekran natijasi). Mentor statistikasi: «Kanal tanlaganlar» · «Ruxsat uyda».
- O'qituvchi eslatmasi: 10 daqiqa. Eng ko'p xato — a'zo bo'lmagan katta guruhni yoki notanishlar kanalini tanlash: «U yerda a'zomisiz? Kimdan ruxsat so'raysiz?» deb so'rang.
  Sinf chati auditoriyadan o'tmasa — bugungi post u yerda xavfsiz mashq (tanish doira, siz ko'rasiz); haqiqiy kanallarga — uyda. Sinfdoshlar auditoriya bo'lsa — sinf chati birinchi kanal (06-FILTR 3).

## 10 · Birinchi post  ← QMustaqil (juftlik + yakka rejim; 4 qism ketma-ket)
- Eyebrow: Juftlikda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Birinchi postni yozing va tekshiring.** (37)
- Mentor: Post avval Mentorga ko'rsatiladi: to'rt qatorni yozing, keyin sherigingizga o'qiting.
  Yakka rejimda: Post avval Mentorga ko'rsatiladi: to'rt qatorni yozing, keyin ovoz chiqarib o'qing.
- Chip qatori (ot-shakl, T-073): 1 Yozish · 2 Sherik · 3 Ro'yxat · 4 Yuborish · yakka: 1 Yozish · 2 O'qish · 3 Ro'yxat · 4 Yuborish
- **Chapda — `ChatTelefon`** (qoralama holati; chat sarlavhasi «Sinf chati»; ramka ustida «sizning telefoningiz»): kulrang pufak, ostida «Yuborilmagan»; qatorlar yozilgan sari pufakka tushadi.
- **O'ngda — bitta karta (joriy qism):**
  - **1 · Yozish** — to'rt maydon ketma-ket (placeholder qisqa, tayyor javobsiz — §32):
    1. **Kim uchun** — savol: Post kimga qaratilgan? · placeholder «Birinchi qator» · ≤ 100
    2. **Nima foyda** — savol: Odam nima oladi? · placeholder «Bir gap» · ≤ 120 · tepada kulrang qator (`pm-m10d1-lending` bo'lsa): Lendingdagi foydalaringiz: «{foydalar[0]}» · «{foydalar[1]}» · «{foydalar[2]}»
    3. **Bitta harakat** — savol: Odam nima qiladi? · placeholder «Bir qisqa gap» · ≤ 60 · ostida havola o'zi qo'shiladi (kulrang, tahrirlanmaydi): `{pm-m10d1-lending.manzil}?kanal=sinf`
       (`manzil` yo'q bo'lsa — kulrang qator: Lending manzili hali yo'q — Netlify'ga chiqargach havola shu yerga qo'shiladi. Bu holatda 4-qismda faqat «Uyda yuboraman».)
    4. **Halol holat** — savol: Hozir nima tayyor? · placeholder «Bir gap» · ≤ 80 · ostida kulrang qator: Hali yo'q narsa va'da qilinmaydi.
  - **2 · Sherik** — Sherigingiz postni chapdagi telefondan o'qib, har qator yonida «Bor» yoki «Topilmadi»ni bosadi (kim uchun · nima foyda · bitta harakat · halol holat).
    «Topilmadi» → o'sha qator yonida ✎ (ixtiyoriy tuzatish — 1-qism maydoni ochiladi); qizil rang yo'q. Kulrang qator: Sherigingiz ismini hech qayerga yozmang.
    Yakka rejimda **2 · O'qish**: Postni ovoz chiqarib o'qing va har qator yonida «Bor» yoki «Topilmadi»ni bosing.
  - **3 · Ro'yxat** — olti band (A-8 so'zma-so'z, `XAVFSIZLIK`), har biri tekshiruv katagi bilan; o'quvchi 1, 3, 5, 6-bandni o'zi belgilaydi.
    4-bandni — ota-onasiga ko'rsatgan bo'lsa. 2-band yonida kulrang yorliq «sinf chatida — Mentorga ko'rsatganda» (katak bu qismda yopiq); 4-band yonida «sinf chatiga shart emas — boshqa kanallardan oldin» (06-FILTR 13). Ro'yxat ostida belgisiz qator: Uchrashuv taklifi kelsa — faqat kattalar bilan. Yangi akkaunt ochish shart emas.
  - **4 · Yuborish** —
    jonli darsda: **Mentorga ko'rsating** (kulrang izoh: Mentor postni o'qiydi va sinf chatiga yuborish-yubormaslikni aytadi) → tugma **Mentorga ko'rsatdim** (o'quvchining o'z ishi — 06-FILTR 14) → 2-band katagi belgilanadi (~1 s yashil) →
    Mentor aytsa: **Nusxalash** (post matni va havola) → sinf chatiga yuborasiz → **Yubordim**; aytmasa: **Kanallarimga uyda yuboraman** (post tayyor).
    Yakka rejimda (Mentor yo'q): kulrang qator: Mentorga hali ko'rsatilmagan — post saqlanadi. Tugma: **Uyda yuboraman**.
- Tekshiruv (`QXato`, ≤60; javob maydon ostida):
  - maydon bo'sh (bloklaydi): Bu qator bo'sh — postda joyi ko'rinmay qoladi. (46)
  - 7+ raqam ketma-ket, «+998», «@» yoki «t.me/» (bloklaydi): Postga telefon va akkaunt nomi yozilmaydi. (42)
  - «N-maktab», «maktab №» (bloklaydi): Maktab raqami postga yozilmaydi. (32)
  - nima foyda yoki halol holatda va'da so'zi («tez orada», «yaqinda», «albatta») — yumshoq: Hali yo'q narsa bo'lsa — postga yozilmaydi. (43)
  - kim uchun yoki nima foydada bo'sh sifat («eng yaxshi», «zo'r», «ajoyib», «qulay») — yumshoq: Bu umumiy so'z — odam aynan nima oladi? (39)
  - Yorliq (yumshoq xatodan so'ng): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (qatorga qarab bitta qator — Mentor misolidan, A-7): kim uchun — Mentor misolida: «Mahalla futbolchilari, Shanba o'yiniga kim kelishini bitta joyda ko'rish uchun «Maydon Jamoa» ilovasini qurdim» — kimga qaratilgani birinchi so'zlarda. ·
  nima foyda — Mentor misolida: «o'yin e'lon qilinadi, «Qo'shilaman» bosiladi, nechta odam yig'ilgani ko'rinib turadi» — lending foydalaridan. · bitta harakat — Mentor misolida: «sahifasini ko'ring» — bitta ish, bitta havola. ·
  halol holat — Mentor misolida: «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q». Web-trekda sayt allaqachon ishlasa — shuni yozing.
- **Harakat → Vizual o'zgarish:** «Saqlash» (1-qism, har maydon) → qator kartadan pufakka uchib tushadi (~1 s yashil), ostida o'z rangidagi chiziq va yorliq (4-ekrandagidek); keyingi maydon kiradi ·
  «Bor» → qator yonida ✓ · «Topilmadi» → qator yonida ✎ · band katagini bosish → ✓ (yashil) · «Mentorga ko'rsatdim» → 2-band ✓ · «Yubordim» → pufak oq bo'ladi, ostidagi «Yuborilmagan» o'rniga «Yuborildi», telefon ramkasi bir lahza yashil halqa.
  Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`. 4-qismdan so'ng karta yopiladi, telefon butun enga — yakuniy post.
- Xulosa (tanlovdan, P-046):
  - «Yubordim»: Post sinf chatida: to'rt qatori yozilgan, Mentorga ko'rsatilgan. (64)
  - «Kanallarimga uyda yuboraman», Mentorga ko'rsatilgan: Post tayyor — kanallaringizga uyda, ruxsat bilan yuborasiz. (59)
  - Mentorga ko'rsatilmagan yoki yakka rejim: Post tayyor — avval Mentorga ko'rsatasiz. (41)
- Saqlash: `pm-m10d6-kanallar.post = { kim, foyda, harakat, holat }` (`harakat` — o'quvchi gapi va havola birga) · `tekshiruv: [bool × 6]` (A-8 tartibida; 4-band — faqat o'quvchi belgilaganda) · `mentorga: bool` («Mentorga ko'rsatdim») · `yuborildi: { qayerda: 'sinf chati' } | null` («Yubordim» — `{ qayerda }`, «Uyda yuboraman» — `null`) (tayanch 8).
  «Bor / Topilmadi» saqlanmaydi (kalitda joy yo'q).
- Tugma (pastki): To'rt qismni bajaring (N/4) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent, to'lqin) → «Saqlash» → «Bor» / «Topilmadi» → band kataklari → «Mentorga ko'rsatdim» → «Nusxalash» → «Yubordim».
- Nishon: **Post Ready!** (to'rt qator yozilib, 1, 3, 5, 6-band belgilanganda — juftlikda ham, yakka rejimda ham rost).
- Mentor statistikasi: «Post yozdi» · «Mentorga ko'rsatdi» · «Sinf chatiga yubordi».
- O'qituvchi eslatmasi: 20 daqiqa — 8 daqiqadan so'ng sinf bo'ylab yuring va har postni ko'ring (≈1 daqiqa): familiya, maktab raqami, telefon, manzil, akkaunt nomi va va'da bormi. Ko'rib ulgurmaganingiz — darsdan keyin ko'rasiz; o'quvchi «Uyda yuboraman»ni tanlaydi.
  Sinf chati — shu darsdagi sinfning chati (TAYANCHGA SAVOL 10). Sinf chatiga hamma yubormaydi: 2–3 ta postni o'zingiz tanlang (yoki alohida mashq chati) — 12–15 bir xil post chatni to'ldiradi; qolganlar «Mentorga ko'rsatdim» bilan tugaydi (06-FILTR 16). Sherik juftligi — o'qish va «Bor / Topilmadi», tuzatish ixtiyoriy.

## 11 · Kod yozish  ← QKod (kod oynasi; tayanch 4; PM-082)
- Eyebrow: Kod yozish
- Sarlavha: **Havoladan kanalni topadigan kod yozamiz.** (40) — PM-082(a) sarlavha oilasi (KORPUS §19, §48)
- Mentor: Har kanalga havola oxiriga belgi qo'shiladi — kod shu belgini o'qiydi.
- Darvoza-mashq (PM-082 c/e, kod oldidan, ballsiz): **Havola oxiridagi `?kanal=sinf` nimani bildiradi?** — uch tanlov:
  ✔ Tashrif qaysi kanaldan kelganini (32) · Havolani bosgan odam kimligini (30) · Sahifa qaysi tilda ochilishini (30)
  - xato («odam kimligini»): Belgi odamni emas — kanalni bildiradi: ism yozilmaydi. (54) · xato («tilda»): Til boshqa narsa: belgi kanal nomini olib keladi. (49)
  - to'g'ri tanlovdan so'ng `QIzoh`: Havola oxiridagi belgi — kanal belgisi. Tashrif — sahifaning bir marta ochilishi. (81)
- To'g'ri tanlovdan so'ng darvoza kartasi o'rnida — **Mentor misoli** (`UmamiSanoq`, chizilgan, logotipsiz; yorliq «Mentor misolida · Umami, lending»):
  - «Postdan oldingi kun — tashriflar: 6 · «Qo'shilmoqchiman»: 2» → hisoblagich sanab o'sadi → «Postdan keyingi kun — tashriflar: 31 · «Qo'shilmoqchiman»: 17»;
  - ostida bitta qator: kanal bo'yicha — `guruh` 19 · `sinf` 9 · belgisiz 3 (har biri yonida kulrang `?kanal=…`);
  - kulrang qator: Bir kishi ikki marta ochsa — ikki tashrif. Bir kunlik son — kam: farq bor, lekin isbot emas.
  - kulrang qator: Umami sahifa ochilishini o'zi ham sanaydi; kanal bo'yicha son — `tashrif` hodisasidan: unda kanal belgisi bor. (06-FILTR 18)
- Chap (vazifa, 3 band; bosiladigan katakcha emas): 1 `kanalniOl` havoladan `kanal` qiymatini qaytaradi · 2 Belgi bo'lmasa — `"belgisiz"` · 3 Namuna sahifada to'rt havola, har birining kanali bilan
- Yordam: `new URLSearchParams(belgilar)` belgilarni o'qiydi, `.get("kanal")` esa `kanal` qiymatini beradi; belgi bo'lmasa `get` — `null` qaytaradi.
  `null` bo'lsa `"belgisiz"` qaytaring — `||` yoki `if` bilan.
- O'ng: kod namunasi (o'qish uchun; nusxalanmaydi — PM-082 d, `user-select: none`) va platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi) → kod oynasi (`HtmlCompiler`).
  Mentor gapi (o'ng, tugma ustida): Tugmani bosing — kod oynasi ochiladi: kodni yozasiz va natijasini shu yerda ko'rasiz. «Kompilyator» ta'riflanmaydi — «kod oynasi».
- Kod (`app.js`):
```js
// Namuna havolalar: lending manzili va oxiridagi kanal belgisi.
// Manzil — namuna (haqiqiy sayt emas); sizda — o'z lendingingiz manzili.
const havolalar = [
  "https://maydon-jamoa.example/?kanal=guruh",
  "https://maydon-jamoa.example/?kanal=sinf",
  "https://maydon-jamoa.example/?kanal=instagram",
  "https://maydon-jamoa.example/"
];

function kanalniOl(havola) {
  const belgilar = new URL(havola).search;   // masalan: "?kanal=sinf" yoki ""
  // belgilar ichidan kanal qiymatini oling; belgi bo'lmasa — "belgisiz"
  return "";   // shu joyni siz yozasiz
}

// har havola — sahifada bitta qator (bu qism tayyor)
const joy = document.getElementById("kanallar");
havolalar.forEach(function (havola) {
  const qator = document.createElement("li");
  qator.textContent = "kanal: " + kanalniOl(havola) + " · " + havola;
  joy.appendChild(qator);
});
```
- `index.html` (tayyor, o'zgarmaydi): `<h1>Havola qaysi kanaldan?</h1>` · `<ul id="kanallar"></ul>` — `app.js` ni kod oynasi o'zi ulaydi (11-Modul 3-dars naqshi: `app.js` + `index.html`).
  `previewCss`: `#kanallar` — ro'yxat belgisiz (`list-style: none`), har qator oq karta, ingichka chegara, 8 px radius, qatorlar orasida 8 px; «kanal: …» qismi qalin.
- Kod ostida kulrang qator: Lendingning o'zida belgi sahifa ochilgan havoladan olinadi (`location.search`) — bu oynada esa namuna havolalardan.
- Kutilgan natija: to'rt qator — «kanal: guruh · https://maydon-jamoa.example/?kanal=guruh» · «kanal: sinf · …» · «kanal: instagram · …» · «kanal: belgisiz · https://maydon-jamoa.example/».
- Kod oynasi sarlavhasi: `app.js — kanalniOl funksiyasini yakunlang` · placeholder: `// belgilardan kanalni oling; bo'lmasa — "belgisiz"`
- Shart xabarlari (≤60): 1 — «guruh» belgili havoladan «guruh» chiqsin. (42) · 2 — Belgisiz havoladan «belgisiz» chiqsin. (38) · 3 — Namuna sahifada to'rt qator, har birida kanal bo'lsin. (55)
- **Harakat → Vizual o'zgarish:** darvozada to'g'ri tanlov → Umami hisoblagichi 6 → 31 sanab o'sadi, kanal qatori bo'laklari navbat bilan chiqadi; kod namunasida `?kanal=guruh` va `kanalniOl` bir lahza accent rangida ajraladi;
  kod oynasida kod ishga tushganda natija oynasida to'rt qator chiqadi; shartlar birma-bir ✓. Kod oynasidagi «Davom etish» faqat uch shart ✓ bo'lganda ochiladi.
- Hammasi bajarilgach (yashil): Kod to'rt havolaning kanalini topdi; belgisi yo'q havola — «belgisiz». (70)
- Tugmalar: Orqaga · ① Kod-savolini yeching → ② Kodni yozing → Davom etish
- Jonli darsda: Sinfda: N bajardi · N hali bajarmoqda
- Nishon: **Link Reader!** (uch shart ✓).
- Saqlash: kod oynasi qoralamasi `pm-m10d6-code` (tayanch 8).
- O'qituvchi eslatmasi: 10 daqiqa — kod 2 qator: `URLSearchParams` va `null` holati (`||` yoki `if`). Lendingning o'zida bu ish uyga vazifada agent bilan qilinadi (uyga vazifa ①): sahifa ochilganda belgi o'qiladi va Umami'ga `tashrif` hodisasi `kanal` bilan yoziladi.
  Belgi odamni aniqlamaydi: ism, login, telefon yo'q — faqat kanal turi. 31 va 19 — Mentor misolining sonlari (bir kun); o'quvchidan bunday son kutilmaydi.

## 12 · Yakuniy savol  ← QTest (✔ B, `correctIdx 1`; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv
- Savol: **Postingiz tayyor. Mahalla guruhiga uni qachon yuborasiz?** (7 so'z) · savol ustida yorliq yo'q
  - A — Hozir, darsda: guruh baribir tanish joy (39)
  - ✔ B — Ota-onaga ko'rsatib, egasi ruxsat bergach (41)
  - C — Ruxsatsiz: post foydali bo'lgani uchun (38)
  - D — Ertaga, hamma guruhlarga bir kunda yuborib (42)
- To'g'ri izohi: Guruhga post — ota-ona ko'rgach va egasi ruxsat bergach. (56)
- Xato izohlari: A — Tanish guruhning ham egasi bor — u rozimi? (42) · C — Foydali post ham ruxsat bilan yuboriladi. (41) ·
  D — Bir xil post ko'p guruhda — ro'yxatning qaysi bandi? (52) · (umumiy) Ro'yxatning 2 va 4-bandini eslang. (34)
- Javob topilgach (kichik, savol ostida): olti bandli ro'yxatning 2 va 4-bandi — yashil ✓ bilan.
- Izoh (MD): A — darsda faqat sinf chati (tayanch 1.6); C — 2-bandga zid; D — 5-bandga zid. Tire yoki ikki nuqta to'rtala variantda; «guruh» A va D da (kalit so'z faqat to'g'rida emas). «Postingiz» — ikkala trekda bor (sinf 12).

## 13 · Podium  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 1 — Uch savol · 2 — To'rt qator · 3 — Facebook · 4 — Qachon yuboriladi

## 14 · Takrorlash  ← QKartochka
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi halqa va yengil to'lqin bilan ajralib turadi, ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi). Tugma — «Yakunlash →».

| Old tomon | Orqa tomon |
|---|---|
| Kanal nima? | Odamlar mahsulot haqida eshitadigan joy |
| Bizda kanal qaysi uch savol bilan tanlanadi? | Auditoriyangiz shu yerdami? Siz u yerda a'zomisiz? U yerda post yozishga ruxsat bormi? |
| «Auditoriyangiz shu yerdami?» savoliga dalil qayerdan olinadi? | Intervyudagi «Hozir nima bilan» javobidan |
| Uch savoldan biriga «yo'q» bo'lsa, nima bo'ladi? | U joy kanal sifatida tanlanmaydi |
| Post nima? | Kanalga yoziladigan matn |
| Bizda post qaysi to'rt qatordan iborat? | Kim uchun, nima foyda, bitta harakat va halol holat |
| «Halol holat» qatoriga nima yoziladi? | Hozir nima tayyorligi; hali yo'q narsa va'da qilinmaydi |
| Guruhga post yuborishdan oldin kimdan ruxsat so'raladi? | Guruh egasidan |
| Sinf chatiga yuborishdan oldin nima qilinadi? | Post Mentorga ko'rsatiladi; ota-ona bandi — boshqa kanallardan oldin |
| Facebook avval qanday auditoriyada ochilgan? | Kichik, yopiq auditoriyada: faqat Garvard talabalari uchun |
| Kanal belgisi havolaning qayeriga qo'shiladi? | Oxiriga, masalan: ?kanal=sinf |
| Mentor misolida postdan keyingi kun eng ko'p tashrif qaysi kanaldan bo'lgan? | Mahalla futbol guruhidan (`guruh`) |

- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»
- §145: har javobdagi so'z darsda bor (kanal — 2 · uch savol — 2, 9 · «Hozir nima bilan» — 2, 9 · «yo'q» — 2 xulosa · post — 4 · to'rt qator — 4 · halol holat — 4, 10 · egasi — 2, 6 · 2 va 4-band — 10 · Garvard — 7 · belgi — 11 · `guruh` 19 — 11).
- S-027: har old tomon — to'liq savol, «?» bilan. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). Ekran testlari va arena savollari nusxasi yo'q (S-021).

## 15 · Dars yakuni  ← QYakun
- Yorliqlar (tepada): Dars tugadi · N/4 to'g'ri
- Sarlavha (holatga qarab — sinf 1; belgi ✓ va nishon birinchi ikkitasida):
  - `yuborildi` bor: **Postingiz sinf chatiga yuborildi.** (34)
  - post to'liq, `mentorga`, `yuborildi` yo'q: **Post tayyor va Mentorga ko'rsatildi.** (35)
  - post to'liq, `mentorga` yo'q: **Post yozildi — Mentorga ko'rsatish qoldi.** (40)
  - kamida bitta kanal saqlangan, post to'liq emas: **Kanallar tanlandi — postni yozib tugating.** (42)
  - kanal saqlanmagan: **Kanal tanlash boshlandi — qolganini tugating.** (45)
  Sarlavha ostida bitta chip (ro'yxat holati): «Olti band: tekshirildi» (oltitasi ✓) · «Sinf chati uchun tekshirildi — 4-band boshqa kanallardan oldin» (4-bandsiz) · «Olti band: n / 6» (06-FILTR 33).
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- Bugungi asosiy fikr (P-013; ScoreRing ostida, `small`): Birinchi kanal — auditoriyangiz bor, siz a'zo va post yozishga ruxsat bor joy; post olti band tekshirilgach yuboriladi.
- Endi siz bilasiz (asosiy fikr bu yerda takrorlanmaydi, T-048):
  - Kanal — odamlar mahsulot haqida eshitadigan joy.
  - Bizda kanal uch savol bilan tanlanadi: auditoriya shu yerdami, siz a'zomisiz, post yozishga ruxsat bormi.
  - Bizda post to'rt qatordan iborat: kim uchun, nima foyda, bitta harakat va halol holat.
  - Facebook voqeasida xizmat avval kichik, yopiq auditoriyada ochilgan.
  - Havoladagi kanal belgisi tashrif qaysi kanaldan kelganini ko'rsatadi, odamni emas.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: ota-onangiz va guruh egasi · Nechta: kamida bitta haqiqiy kanalingiz · Muddat: keyingi darsgacha
  - ① **Lendingga kanal belgisini qo'shing** (ikkala trek). Antigravity'da o'z repo'ngizni oching; `git status` — `.env` ko'rinmasin. Agentga talab (prompt qutisi, «Nusxalash»; agentga matn — buyruq shaklida, T-002):
    > Qayerda: `lending/index.html`. Boshqa fayl va papkalarga tegma.
    > Nima qilsin: sahifa ochilganda havoladagi `kanal` belgisini o'qisin (masalan, `?kanal=sinf`) va Umami'ga `tashrif` hodisasini yozsin, ma'lumotida `kanal` bo'lsin. Belgi bo'lmasa — `kanal` qiymati "belgisiz".
    > Nima buzilmasin: sahifa matni, asosiy tugma va uning Umami hodisasi o'zgarmasin. Sahifa hech qanday shaxsiy ma'lumot yig'masin. Umami yuklanmasa ham sahifa ishlasin. O'zgargan fayllarni ayt.
    Keyin: `git status` — faqat `lending/index.html` → `git add lending/index.html` → commit → `git push`; Netlify odatda o'zi yangilanadi. Lending havolasini oxiriga `?kanal=sinf` qo'shib oching —
    Umami'da `tashrif` hodisasi ko'rinishi kerak (bir daqiqa kutib yangilang; ba'zi brauzer sozlamalarida Umami yozmasligi mumkin). Umami sahifa ochilishini o'zi ham sanaydi — `tashrif` o'sha ochilishni kanal belgisi bilan yozadi. Agentning hisobotiga emas — Umami'ga qarang.
    Ishlamasa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas). Lending hali internetda bo'lmasa — avval uni Netlify'ga chiqaring (1-dars uyga vazifasi).
  - ② **Haqiqiy kanalingizga post.** Postni ota-onangizga ko'rsating (4-band). Guruh egasidan ruxsat so'rang («ruxsat kutilmoqda» bo'lgan joylar); ruxsat bo'lsa — yuboring, havola oxirida o'sha kanal belgisi bilan (kanallaringiz ro'yxatidagi kulrang qator, masalan `?kanal=guruh`).
    Har joyga bir marta; notanish odamga shaxsiy xabar yozmang; uchrashuv taklifi kelsa — faqat kattalar bilan.
  - ③ **Mobil trek — tekshiruv fayli** (web-trekda yo'q). O'rnatish faylini tayyorlab, faqat **o'z telefoningizga** o'rnating — odamlarga yubormang: unda hali telefon so'raydigan eski ro'yxatdan o'tish bor.
    Terminalda, ilova papkasida (Mentor misolida `mobil/`): `npm install --global eas-cli` → `eas login` (Expo akkauntingiz bilan; akkaunt ma'lumotini hech kimga bermang) → `eas build:configure` → agentga talab (prompt qutisi):
    > `eas.json` ga `preview` profili: Android uchun `buildType` — `apk`; `env` da `EXPO_PUBLIC_API_URL` — Render manzili. Boshqa fayllarga tegma. O'zgargan fayllarni ayt.
    → `eas build -p android --profile preview` — kalit (keystore) so'ralsa, EAS o'zi yaratadi va saqlaydi. Tayyor bo'lgach havola chiqadi: telefoningizda oching va o'rnating — Android ogohlantirish ko'rsatadi: ilova do'kondan emas, to'g'ridan-to'g'ri o'rnatiladi.
    Bepul navbat sekin bo'lishi mumkin; bepul hisobda oyiga 15 tagacha Android o'rnatish fayli tayyorlash mumkin. Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas).
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «50 foydalanuvchiga qanday yetasiz?»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · ro'yxat chipi · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- O'qituvchi eslatmasi (yakun): vaqt qolsa, ③ ning birinchi ikki buyrug'i (`npm install --global eas-cli`, `eas login`) sinfda (tayanch 1.6). Tekshiruv fayli odamlarga yuborilmaydi — odamlarga boradigan fayl 7-darsda yangidan tayyorlanadi; maqsad: akkaunt, kalit va navbat bilan bog'liq ish oldindan tugashi.
- Izoh (MD): «Kim bilan» — HwCard yorlig'i; «kim uchun» — post qatori (T-015 — ikkalasi boshqa joyda). ① — agent va o'quvchi ishi ajratilgan: qaror (belgi va hodisa) o'quvchidan, kodni agent yozadi, tekshiruvda o'quvchi Umami'ni ko'radi (sinf 13).
  ② — tanish doira, ruxsat, ota-ona (sinf 14); ③ — tayanch 1.6 va 1.7 «APK» buyruqlari aynan, 9.11 (`env`); «odatda», «bo'lishi mumkin» (sinf 2c); «tekshiruv fayli» (9.22).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Safe Check!** (6-ekran, olti vaziyat birinchi urinishda) — Olti vaziyatni birinchi urinishda to'g'ri ajratdingiz
- **My Channels!** (9-ekran, kamida bitta kanal uch savoldan o'tib saqlanganda) — Mahsulotingiz uchun kanalni uch savol bilan tanladingiz
- **Post Ready!** (10-ekran, to'rt qator va 1, 3, 5, 6-band) — Birinchi postingizni to'rt qator bilan yozib, ro'yxat bo'yicha tekshirdingiz (juftlikda ham, yakka rejimda ham rost)
- **Link Reader!** (11-ekran, uch shart ✓) — Havoladan kanal belgisini o'qiydigan kod yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus yo'q (S-034): to'rttasi ham ish qilingan ekranda.

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi (qolip yozuvlari).
- **3 · Kanal: uch savol** — 1 Auditoriyangiz shu yerdami? Dalil — intervyudagi «Hozir nima bilan» javobi. · 2 Siz u yerda a'zomisiz? · 3 U yerda post yozishga ruxsat bormi? Bittasiga «yo'q» — tanlanmaydi.
  — Sinfga savol: Siz a'zo bo'lmagan katta guruhga post yozsa bo'ladimi?
- **5 · Post: to'rt qator** — 1 Kim uchun — postning birinchi qatori. · 2 Nima foyda — odam nima oladi, bir gap. · 3 Bitta harakat — havola; halol holat — hozir nima tayyor.
  — Sinfga savol: Mentor postida «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q» qaysi qator?
- **8 · Facebook: kichik, yopiq auditoriya** — 1 2004-yilda Facebook faqat Garvard talabalari uchun ochilgan. · 2 Xizmatni tez orada «o'zinikilarning hammasi» ishlata boshlagan. · 3 Hamma uchun — ikki yildan keyin. Auditoriyaning zichligi hajmidan muhimroq.
  — Sinfga savol: Sizning auditoriyangiz qaysi bitta joyda zich turibdi?
- **12 · Yuborishdan oldin** — 1 Faqat o'zingiz a'zo bo'lgan joyga. · 2 Guruhga — egasidan ruxsat so'rab. · 3 Postni yuborishdan oldin ota-onangizga ko'rsatasiz.
  — Sinfga savol: Mahalla guruhiga post yuborishdan oldin kimlar ko'radi?

## Jonli viktorina — 12 savol (✔ o'rni: A 2·5·10 · B 3·7·11 · C 1·6·8 · D 4·9·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda (PM-65).
1. Intervyuda hamma «Telegram guruhida yozamiz» dedi. Bu qaysi savolga dalil? (2)
   - Siz bu guruhda a'zomisiz? (25)
   - Bu guruhda ruxsat bormi? (24)
   - ✔ Auditoriyangiz shu yerdami? (27)
   - Bu guruhda necha kishi bor? (27)
2. Mentor misolida shahar futbol kanali nega tanlanmadi? (2)
   - ✔ A'zo emas va ruxsat ham yo'q (28)
   - Futbol haqida yozilmas ekan (27)
   - Kanalda odam juda kam ekan (26)
   - Kanal endigina ochilgan ekan (28)
3. Sinfdoshingiz guruhga qo'shilgan kuniyoq post yubordi. Nima qilinmadi? (2, 6)
   - Postda birorta rasm yo'q edi (28)
   - ✔ Egasidan ruxsat so'ralmadi (26)
   - Post qisqaroq qilib yozilmadi (29)
   - Havola eng oxiriga yozilmadi (28)
4. Postning qaysi qatori odamni sahifaga olib boradi? (4)
   - Kim uchun — postdagi birinchi gap (33)
   - Nima foyda — odam nimani olishi (31)
   - Halol holat — hozir nima tayyor (31)
   - ✔ Bitta harakat — lending havolasi (32)
5. Postingizda «Tez orada hamma narsa bo'ladi» deb yozdingiz. Nima qilasiz? (4, 10)
   - ✔ Hozir tayyor narsani yozasiz (28)
   - Gapni oxirgi qatorga surasiz (28)
   - Gap oxiriga undov qo'yasiz (26)
   - Gapni qalin harfda yozasiz (26)
6. Postga qaysi ma'lumot yozilmaydi? (6)
   - Mahsulotning nomi (17)
   - Lendingning havolasi (20)
   - ✔ Maktabingiz raqami (18)
   - Mahsulotning foydasi (20)
7. Guruhda notanish odam uchrashishni taklif qildi. Nima qilasiz? (6)
   - Yolg'iz o'zingiz borib ko'rasiz (31)
   - ✔ Faqat kattalar bilan hal qilasiz (32)
   - Sinfdosh bilan ikkovlashib borasiz (34)
   - Unga uy manzilingizni yozasiz (29)
8. Facebook voqeasida nima hajmdan muhimroq? (7)
   - Saytdagi rasmlar ko'pligi (25)
   - Funksiyalarning ko'pligi (24)
   - ✔ Auditoriyaning zichligi (23)
   - Asoschilarning tajribasi (24)
9. Facebook hamma uchun qachon ochilgan? (7)
   - Birinchi kuniyoq (16)
   - Bir oydan keyin (15)
   - Besh yildan keyin (17)
   - ✔ Ikki yildan keyin (17)
10. Guruh egasidan ruxsat so'radingiz, javob yo'q. Nima qilasiz? (9)
   - ✔ Boshqa kanalingizdan boshlaysiz (31)
   - Javob kutmay guruhga yuborasiz (30)
   - A'zolarga alohida yozib chiqasiz (32)
   - Boshqa akkauntdan guruhga yozasiz (33)
11. Havolada `?kanal=sinf` bor. Bu belgi nimani ko'rsatadi? (11)
   - Havolani bosgan odamning ismini (31)
   - ✔ Tashrif sinf chatidan kelganini (31)
   - Sinfdagi o'quvchilar sonini (27)
   - Sinf chatidagi postlar sonini (29)
12. Mentor misolida postdan keyingi kun tashriflar — 31. Bu nima? (11)
   - Ro'yxatdan o'tgan odamlar soni (30)
   - Ilovani o'rnatgan odamlar soni (30)
   - Postni o'qigan odamlar soni (27)
   - ✔ Sahifa necha marta ochilgani (28)
- Arena yozuvlari — platforma shabloni (namuna 6-Modul YAKUNIY 14-dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — kanal · post · auditoriya · ruxsat · tashrif · belgi · Umami · lending · uyga vazifa banneri — kanal · post · ruxsat · belgi.
- Izoh (MD): 1 — kartochka 3 nusxasi emas: dalil berilgan, savol qaysi savolga tegishli; 2 — Mentor misoli (A-6); 6 — kartochkada yo'q band (3-band); 9 — bank faktidan («ikki yildan keyin»), kartochka 10 boshqa savol;
  11 — darvoza-mashqdan boshqa holat (sinf chati), «odam ismi» — xavfsizlik distraktori; 12 — birlik savoli (sinf 5): «31» javobda takrorlanmaydi (sinf 8). Distraktorlar hayotda «to'g'ri yo'l» bo'lib qolmaydi (2 B — kanal futbol haqida, 2 C — kanal katta: A-6).

---

## B. «KOD» — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/10-Modull/PmChannelsLesson.jsx` — skeletdan. Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4/s6 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3/s5/s8/s12 `QTest` (`QuestionScreen` mantig'i, DE-203) ·
   s7 `QVoqea` · s9/s10 `QMustaqil` · s11 `QKod` (`HtmlCompiler`) · s13 `QNatija` · s14 `QKartochka` · s15 `QYakun`; palitra `qolipRang('pm')`.
2. **`ChatTelefon`** — bitta vizual (180): telefon ramkasi ≈170×272 (9.16), tepada «Telegram» yorlig'i (`Brend`, o'z rangi, logotipsiz), ramka ustida yorliq («Mentor telefoni» / «sizning telefoningiz»);
   holatlar `royxat · chat · qoralama · yuborildi`; `royxat` qatori — `{ nom, tur, kishi?, belgilar: [null|true|false|'uyda'] × 3, belgi? }`; `chat` pufagi — bo'laklar `{ matn, qator }` (qator rangi `POST_QATORLAR` dan). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. Qolip-maket izohi faylda.
3. Bitta manbalar (P-063): **`UCH_SAVOL`** (3, tayanch 1.6 so'zma-so'z) · **`MENTOR_JOYLAR`** (2 × `{ nom, tur, kishi, javoblar: [{ yozuv, togri }] × 3 }`, A-6) · **`MENTOR_KANALLAR`** (3 nom) ·
   **`MENTOR_POST`** (`{ matn, bolaklar: [{ matn, qator }] × 4 }` — `bolaklar` birlashtirilsa `matn` ga aynan teng bo'lsin — quruvchi bir marta tekshiradi) · **`POST_QATORLAR`** (4 × `{ id, nom, izoh }`, tayanch 1.6 tartibi) ·
   **`XAVFSIZLIK`** (`{ bandlar: [6], ostQator }` — so'zma-so'z; 7-dars ham o'qiydi: umumiy fayl `src/10-Modull/xavfsizlik.js` yoki har darsda bir xil const — quruvchi asosiy seans bilan kelishadi, TAYANCHGA SAVOL 11) ·
   **`VAZIYATLAR`** (6 × `{ matn, mumkin: bool, band: i }`) · **`FACEBOOK_KADR`** (3 × `{ h, m }`) · **`UMAMI_MENTOR`** (`{ oldin: { tashrif: 6, bosish: 2 }, keyin: { tashrif: 31, bosish: 17 }, kanal: { guruh: 19, sinf: 9, belgisiz: 3 } }` — tayanch 1.6, 1.13) ·
   **`KANAL_TURLARI`** (7 × `{ nom, belgi }`: sinf chati `sinf` · maktab chati `maktab` · mahalla guruhi `guruh` · to'garak guruhi `togarak` · do'stlar `dostlar` · o'z Instagram sahifasi `instagram` · boshqa — yozuvdan: kichik lotin, apostrofsiz, bo'shliq o'rniga chiziqcha, ≤20; TAYANCHGA SAVOL 6).
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); `HookMaket` = `LendingSahifa` ixcham (1-dars komponenti — mavjud bo'lsa qayta ishlatiladi, bo'lmasa shu darsda ixcham nusxa; 1-dars faylidan ko'chirilmaydi — JR-14) + `UmamiSanoq` (`UMAMI_MENTOR.oldin`); tanlovda yo'l chizig'i va «6» halqasi.
5. s2: `UCH_SAVOL` × `MENTOR_JOYLAR` — 6 javob ketma-ket; to'g'ri javob katakka uchadi; xato — silkinish + `QXato` (savol bo'yicha); 3/3 dan keyin yorliq «kanal» + `QIzoh`; `tugadi` — ro'yxat butun enga, `MENTOR_KANALLAR` qatorlari sirg'alib kiradi; 40 s ipucha.
6. s4: tanlash → bosish mexanikasi (KORPUS §16); `MENTOR_POST.bolaklar` × `POST_QATORLAR`; xato — yorliq qaytadi + `QXato` (yorliq bo'yicha); 4/4 — yorliq «post» + `QIzoh`; `tugadi` — pufak butun enga.
7. s6: `VAZIYATLAR` ketma-ket (bitta katta karta — SABOQ 9); to'g'ri javob → karta ro'yxatga uchib `XAVFSIZLIK.bandlar[band]` bo'lib ochiladi (bo'sh katak ☐ bilan); 6/6 — `ostQator`; nishon `safeCheck` (birinchi urinish × 6).
8. s7: `FACEBOOK_KADR` (SABOQ 8); `FacebookSahna` — brauzer oynasi + nom «Facebook» (`Brend`, o'z rangi) + doiralar (siluet guruhi, qulf, yonish, yangi doiralar, katta ochiq doira) — son yo'q; bashorat 1/3 da (ballsiz, ixcham qator, `QTaxmin`); tugma «Voqea davomi (N/3)»; manba izohi faylda.
9. s9 artefakt: o'qiydi `pm-m9d3-intervyu` (`goyalar[].matn`, `yozuvlar[].hozir`, `yozuvlar[].goya`) — dalil qatori; kalit yo'q — umumiy kulrang qator. Forma ketma-ket (≤3 karta); «Boshqa» qatori regex (`@`, `t.me/`, `http`, `\d{7,}`) — bloklaydi;
   takror tur — `QXato`; 1/2-savol «Yo'q» — `QIzoh`, saqlanmaydi; yozadi `pm-m10d6-kanallar.kanallar` (faqat o'tganlar, `ruxsat` — «Ha» `'bor'`, «Uyda so'rayman» `'soraladi'`; 06-FILTR 2); belgi kulrang qatori — `KANAL_TURLARI`; nishon `myChannels`; artefakt-strip «Kanallarim».
10. s10: 4 qism (chip qatori, bitta karta); 1-qism — to'rt maydon, o'qiydi `pm-m10d1-lending` (`foydalar`, `manzil`), havola `manzil` + `?kanal=sinf` (oxiridagi `/` ga qarab birlashtiriladi; `manzil` yo'q — havola joyi kulrang, 4-qismda faqat «Uyda yuboraman»);
    tekshiruvlar — bo'sh (blok), telefon/«@»/«t.me/» (blok), maktab raqami (`\d+\s*-?\s*maktab`, `maktab\s*№` — blok), va'da so'zlari va bo'sh sifat (yumshoq; PM-032 — ≥8 namuna sinovi); 2-qism «Bor / Topilmadi» (saqlanmaydi, ✎ 1-qismni ochadi);
    3-qism `XAVFSIZLIK` kataklari (2 yopiq; 4 — o'quvchi belgilaydi, sinf chati uchun shart emas); 4-qism «Mentorga ko'rsatdim» (`mentorga = true`, 2 ✓; o'quvchining o'z ishi — 06-FILTR 14), «Nusxalash» (post to'rt qatori `\n` bilan + havola), «Yubordim» / «Kanallarimga uyda yuboraman»;
    yozadi `pm-m10d6-kanallar.post`, `tekshiruv`, `mentorga`, `yuborildi`; nishon `postReady`; yakka rejim — Mentor gapi va 2-qism nomi almashadi, 4-qismda faqat «Uyda yuboraman»; `optionalLive`; Mentor statistikasi.
11. s11: darvoza-mashq (3 tanlov, ballsiz) → `UmamiSanoq` (6 → 31 sanab o'sadi, kanal qatori); `HtmlCompiler` — `app.js` + `index.html` + `previewCss`; shartlar: `kanalniOl("…?kanal=guruh") === "guruh"`, `kanalniOl("https://maydon-jamoa.example/") === "belgisiz"`, `#kanallar li` soni 4 va har birida «kanal: »; qoralama `pm-m10d6-code`; nishon `linkReader`.
    ⚠️ Kod matni ichida backtik — kod satri sifatida, template-satr ichida emas (CLAUDE.md tuzog'i). Namuna manzil `maydon-jamoa.example` — `.example` zaxira domen (haqiqiy sayt emas; TAYANCHGA SAVOL 12).
12. Testlar s3/s5/s8/s12 — `correctIdx` 2/0/3/1 = `INLINE_KEYS`; `RECAPS` 3/5/8/12 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). s3/s5/s8/s12 kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
13. `ACHIEVEMENTS` 4 (`safeCheck`, `myChannels`, `postReady`, `linkReader`); s15 `RECAP` 5 band = yakundagi «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» — ScoreRing ostida (P-013);
    yakun sarlavhasi — `yuborildi`, `mentorga`, `post` to'liqligi, `kanallar.length` dan (5 holat); ro'yxat chipi — `tekshiruv` dan (uch ko'rinish); `HW_TOKENS` — faqat so'z.
14. Uyga vazifa — `HwCard` («Kim bilan · Nechta · Muddat», ①②③; ③ faqat mobil trekda — `pm-m9d8-platforma.trek`, yo'q bo'lsa ikkala yozuv bilan «mobil trekda»); ① va ③ ichida prompt qutisi («Nusxalash») — **qolipda HwCard ichida prompt qutisi yo'q**: `QPrompt` ni yakun kartasiga qo'yish yoki ichki kichik quti; alohida `.homework.jsx` yo'q.
15. App.jsx: `m10-06` qatoriga `comp: PmChannelsLesson` + import — asosiy seans (bu agent tegmaydi). Nom «Birinchi foydalanuvchilar sizni qayerdan topadi?» ✓ va osti «kanallar va birinchi post» ✓ (App.jsx 403-qator, 06.10).
16. **REPO (Mentor misoli, «qur» da, buyruq bilan):** `maydon-jamoa` → `lending/index.html`: sahifa ochilganda `?kanal=` o'qiladi va `umami.track('tashrif', { kanal })` (belgi yo'q — `'belgisiz'`), teg `m12-dars-06-done` (tayanch 3). `eas.json` — 7-dars tegida (tayanch 3); Mentorning tekshiruv fayli repo'ga yozilmaydi.
- Darvozalar: `npm run gates -- src/10-Modull/PmChannelsLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).

## Manbalar (o'zim tekshirgan rasmiy sahifalar, 06.10.2026)
- docs.umami.is/docs/tracker-functions — «umami.track(event_name: string, data: object);» · namuna «umami.track('signup-button', { plan: 'newsletter', id: 123 });» · cheklovlar: «Objects Max of 50 properties», «Strings Max length of 500» — `umami.track('tashrif', { kanal })` shakli shunga mos (uyga vazifa ① talabi mexanizmni agentga qoldiradi).
- docs.umami.is/docs/track-events — «data-umami-event="{event-name}" data-umami-event-{property}="{value}"» · «All event data will be saved as a string using this method.» · «Event names are limited to 50 characters. Event data cannot be sent without an event name.»
  (Tayanch 6 dagi «`umami.track` ga qo'shimcha ma'lumot berish yozilishi tekshirilmagan» bandi — shu ikki sahifa bilan yopiladi; Umami panelida hodisa ma'lumotini qayerda ko'rish — tekshirilmadi, Shubhali joylar.)
- developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get — «A string if the given search parameter is found; otherwise, `null`.» · …/URLSearchParams/URLSearchParams — «A leading `'?'` character is ignored.» ·
  …/API/URL/search — «If the URL does not have a search query, this property contains an empty string, `""`.» (11-ekran kodi va Yordami shunga tayanadi.)
- Tayanch 6 (06.10, asosiy seans): EAS — `npm install --global eas-cli` → `eas login` → `eas build:configure` → `eas.json` `preview`/`apk` → `eas build -p android --profile preview`; keystore — EAS yaratadi va saqlaydi; Android xavfsizlik ogohlantirishi; bepul reja oyiga 15 Android build ·
  Instagram 13 yoshdan (help.instagram.com/517920941588885) · Telegram yosh chegarasi rasmiy matnda topilmadi — darsda yosh aytilmaydi.
- help.instagram.com/1094092134264651 — 06.10 ochildi, sahifa matni yuklanmadi (faqat «Help Center» sarlavhasi); Instagram'da havola qayerga qo'yilishi rasmiy manbada tekshirilmadi — darsda aytilmaydi (Shubhali joylar).
- `PM_Prompt_v8.md:208–211` — K8 bank matni (ruscha asli A-10 da; «raqamsiz»).

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **2-ekran mexanikasi — ikki joy × uch savol, Mentor yozuvlari** («Mentor shu guruh a'zosi», «Guruh egasidan ruxsat olingan», «Mentor bu kanalda a'zo emas», «Kanalga post yozishga ruxsat yo'q») — tayanch 1.6 faktlari qayta aytilgan; «a'zo» mahalla guruhi uchun tayanchda so'zma-so'z yo'q (Qaror-0 12 qoidasidan kelib chiqadi).
2. ✅ **06-FILTR 5 dan keyin — «?» (dalil yo'q), muqobil qabul qilindi.** Eski matn: **Shahar kanalining 1-savoli — «yo'q»** (yozuv: «Intervyudagi «Hozir nima bilan» javoblarida bu kanal yo'q»). Tayanch faqat 2 va 3-savolni beradi; 11-Modul 1.3 yozuvlarida «Hozir nima bilan» — 5 tasi Telegram guruhi, shahar kanali yo'q — shundan chiqardim.
   Muqobil: 1-savol katagi «?» (dalil yo'q) bo'lib, faqat 2 va 3-savol so'raladi. Shuningdek: «shahar bo'yicha katta futbol kanali» — **Telegram kanali** deb oldim (T-015: Telegram'dagisi to'liq nom bilan); maketda nomi «Shahar futbol kanali», kishi soni o'rnida «katta».
3. **Sinf chati va Instagram sahifasining uch savol dalili** tayanchda yo'q — 2-ekranda ular faqat «Mentorning uch kanali» natijasida (belgi-kataksiz) ko'rsatiladi; O'qituvchi eslatmasida og'zaki javob. Tayanchga dalil qatori qo'shilsinmi?
4. **Mentor postining to'rt qatorga bo'linishi** (A-7; 06-FILTR 1, 10 dan keyin post yangilandi): «kim uchun» — birinchi gap qismi «Mahalla futbolchilari, … qurdim:», «halol holat» — «Ilova ishlayapti, o'rnatish havolasi hozircha yo'q —», «bitta harakat» — «hozircha sahifasini ko'ring: …». Postda holat harakatdan oldin turibdi; 4-ekran O'qituvchi eslatmasi «tartib bir xil bo'lishi shart emas, kim uchun — birinchi» deydi.
5. **`instagram` belgisining soni** — tayanch faqat `guruh` 19 · `sinf` 9 · belgisiz 3 ni beradi (jami 31); darsda `instagram` soni ko'rsatilmadi va «0» deyilmadi. «Postdan keyingi kun» — Mentor posti ikki joyga (guruh va sinf chati) yuborilgan deb oldim (10-darsdagi «post faqat ikki joyga yetdi» bilan mos).
6. **«kanal belgisi» nomi va o'quvchi kanallari belgilari** — tayanch «belgi» deydi; men «kanal belgisi» (11-ekran ta'rifi) va turlar bo'yicha belgilar ro'yxatini (`sinf`, `maktab`, `guruh`, `togarak`, `dostlar`, `instagram`, boshqa — yozuvdan) qo'ydim; belgisiz tashrif — `kanal: "belgisiz"` (tayanchda «belgisiz 3» bor, qiymat yozilishi yo'q).
7. **5-ekran namoyish posti** («Sinfdoshlar, uy vazifalari bir joyda turadigan sayt: har fan alohida ro'yxatda. Sahifani oching: …») — tayanchda yo'q; Mentorning 11-Moduldagi 4-g'oyasidan (P-002).
8. **6-ekran olti vaziyati** — tayanchda yo'q; har biri bitta band ma'nosi, o'smir olamidan (sinf chati, mahalla guruhi, maktab raqami, ota-ona, o'nta guruh, obunachi).
9. ✅ **06-FILTR 2: `ruxsat: 'bor' | 'soraladi'` (tayanch 8 yangilandi).** Eski matn: **`pm-m10d6-kanallar.kanallar` ga faqat o'tgan joylar yoziladi**; 3-savolning uchinchi javobi «Uyda so'rayman» → `ruxsat: false` (bool sxemada «hali so'ralmagan» va «yo'q» ajralmaydi — «yo'q» bo'lgan joy saqlanmagani uchun `false` = «uyda so'raladi»).
   7-dars shu qoidani bilsin: `ruxsat: false` kanalga — «avval ruxsat so'rang». Muqobil: `ruxsat: 'bor' | 'soraladi'` (sxema o'zgaradi).
10. **«Sinf chati» — qaysi chat?** Darsda post «sinf chatiga» yuboriladi (tayanch 1.6). Men uni **shu darsdagi sinfning chati** (sinfdoshlar, Mentor ko'radi) deb oldim; maktab sinfi chati — «Maktab chati» turi bilan alohida. Tayanchda aniqlik yo'q.
    Sinf chati 1-savoldan o'tmasa ham bugungi post shu yerga ketadi (tanish doira) — 9-ekran O'qituvchi eslatmasi va xulosasi shunday.
11. **`XAVFSIZLIK` bitta manba (6 va 7-darslar)** — kodda umumiy fayl kerakmi yoki ikki darsda aynan bir xil const? Quruvchi va asosiy seans hal qiladi. 10-ekran tekshiruv kataklari — `tekshiruv: [bool × 6]` (tayanch 8).
12. **Kod oynasidagi namuna manzil** `https://maydon-jamoa.example/` — `.example` zaxira domen (haqiqiy saytga olib bormaydi); Mentor lendingining haqiqiy manzili tayanchda yo'q.
13. **10-ekran tekshiruvlari** (telefon, «@», «t.me/», maktab raqami — blok; va'da so'zlari va bo'sh sifat — yumshoq) — mening ro'yxatim; 1-dars 9-ekran tekshiruvi bilan bir oila (1-dars TS 11 — «bitta funksiyaga chiqarilsinmi?»).
14. ✅ **06-FILTR 14: tugma endi «Mentorga ko'rsatdim» — o'quvchining o'z ishi; 4-band u bilan yopilmaydi.** Eski matn: **«Mentor ko'rdi» tugmasi** — Mentor postni ko'rgani 2 va 4-bandni yopadi (tayanch 1.6); kodda bu o'quvchi bosadigan tugma. Mentor panelidan tasdiq mexanizmi qolipda yo'q — kerakmi?
15. **Uyga vazifa ① talabi** (`tashrif` hodisasi sahifa ochilganda, `kanal` ma'lumoti; tugma va uning hodisasi o'zgarmasin) — tayanch 1.6 mazmuni, matni meniki. ③ talabiga «Boshqa fayllarga tegma. O'zgargan fayllarni ayt.» qo'shildi (9-Modul uch qatori).
16. **Nishon nomlari** (Safe Check!, My Channels!, Post Ready!, Link Reader!) va arena 3, 7, 10 vaziyatlari — tayanchda yo'q.

## Shubhali joylar (ishonchim komil emas)
- **Instagram'da havola qayerga qo'yiladi** — rasmiy yordam sahifasi ochilmadi (matn yuklanmadi); uchinchi tomon sahifalari post matnidagi havola bosilmasligini aytadi — tekshirilmagan. Darsda Instagram uchun joy aytilmaydi («o'z Instagram sahifangizga»); `?kanal=instagram` belgili havola bosiladigan joyda bo'lmasa, tashrif sanalmasligi mumkin.
- **Umami panelida `tashrif` hodisasining `kanal` ma'lumotini qayerda ko'rish** — hujjatda hodisa ma'lumoti yuborilishi bor, panel yorlig'i tekshirilmadi; uyga vazifa ① faqat «`tashrif` hodisasi ko'rinishi kerak» deydi. «Qur» da Mentor repo'sida sinaladi.
- **`eas build:configure` savollari** (platforma tanlovi va boshqalar) va `eas.json` ning git'ga yozilishi — tayanch 6 buyruqlarni beradi, terminaldagi savollar matni tekshirilmagan; uyga vazifa ③ da umumiy so'z. EAS navbatining haqiqiy kutish vaqti — tekshirilmagan (tayanch 6).
- **Tekshiruv fayli eski kod bilan** — telefon raqami so'raydigan ro'yxatdan o'tish (tayanch 1.6); faqat o'z telefoniga. O'quvchi uni tasodifan boshqalarga yuborishi mumkin — matnda ikki marta aytilgan (③ va O'qituvchi eslatmasi).
- **Sinf chatiga 12–15 post bir vaqtda** — 06-FILTR 16 dan keyin: chatga 2–3 tanlangan post, qolganlar Mentorga ko'rsatish bilan tugaydi. Sinf chati bo'lmagan sinfda post faqat Mentorga ko'rsatiladi — bu yo'l MD da yozilmagan (TAYANCHGA SAVOL 10 bilan bog'liq).
- **«Mentorga ko'rsatdim» — o'quvchi bosadigan tugma** (06-FILTR 14): o'quvchi o'z ishini aytadi, Mentorning tasdig'i emas; sinf chatiga yuborishni Mentor og'zaki aytadi.
- **10-ekran tekshiruv qoidalari** (telefon, «@», «t.me/», maktab raqami) — «qur» da namuna satrlar bilan sinaladi: «18:00», «8 / 10», «2026-10-10», «5-maktab», «+998 90 …» (06-FILTR 28).
- **20 daqiqada har postni ko'rish** (≈1 daqiqa × 12–15) — tig'iz; ulgurilmasa «Uyda yuboraman» yo'li bor, lekin pilotda taymer bilan o'lchanadi.
- **Bank so'zi «zichlik»** — 13 yoshli uchun og'ir; matnda bank so'zi saqlangan, izoh — O'qituvchi eslatmasida og'zaki («mahsulot kerak bo'lgan odamlar bir joyda yig'ilgan»). Bu izoh bankda yo'q — men qo'shdim.
- **Lending manzili oxiriga `?kanal=sinf` qo'shish** — manzil `/` bilan yoki usiz tugashi mumkin; ikkala shakl ham brauzerda ochiladi deb oldim (KOD 10 birlashtiradi), Netlify'da sinalmadi.
- **9-ekran dalil qatori** — `pm-m9d3-intervyu` da faqat darsda olingan 1–2 yozuv bor (uydagilari kiritilmagan — 11-Modul 9.44); qaysi g'oya final bo'lgani shu kalitda yo'q, shuning uchun har yozuv yonida g'oya nomi ko'rsatiladi.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 14 band)
1. [x] **Yakun holatga qarab** — 15-ekran: to'rt sarlavha (post sinf chatida · post yozildi · kanallar tanlandi · kanal tanlash boshlandi) + ro'yxat chipi; ✓ va nishon faqat `yuborildi` bor holatda; sarlavha o'quvchi ishini aytadi, Mentor natijasini emas.
2. [x] **Da'vo isbot emas** — (a) «Bizda kanal uch savol…» (2, 14, 15), «Bizda post to'rt qator…» (4, 14, 15), «Bu kursda post olti band…» (6); (b) «Mentor misolida» (0, 9 Yordam, 10 Yordam, 11, arena 2, 12, kartochka 12), «Mentorning uch kanali» (2);
   (c) «odatda o'zi yangilanadi», «ko'rinishi kerak», «bo'lishi mumkin» (uyga vazifa ①, ③); agent talabi — tekshiruv Umami'da, agent hisobotida emas (①); (d) «Bir kunlik son — kam: farq bor, lekin isbot emas» (11), «Tashrif — ochilish, odam emas» (11).
3. [x] **Maxfiy qiymat chiqmaydi** — uyga vazifa ① va ③: `git status` da `.env` ko'rinmasin, xato qatori agentga «`.env` qiymatlari, token va kalitlarni emas»; `EXPO_PUBLIC_API_URL` — maxfiy emas (tayanch 3); Expo akkaunti ma'lumoti hech kimga berilmaydi (③); postda shaxsiy ma'lumot yo'q (6, 10).
4. [x] **Tashqi xizmat — faqat rasmiy hujjat** — Umami (`umami.track`, hodisa ma'lumoti — Manbalar), EAS (tayanch 6), URLSearchParams (MDN); Telegram va Instagram tugma nomlari yo'q («guruhga yuboring», «o'z Instagram sahifangizga»); Telegram yosh chegarasi aytilmaydi; tekshirilmaganlar — Shubhali joylar.
5. [x] **Har sonning manbasi** — 6 · 2 · 31 · 17 · 19 · 9 · 3 — «Mentor misolida · Umami, lending» yorlig'i; birligi aytilgan (tashrif — ochilish, «Qo'shilmoqchiman» — bosish); ayirilmaydi, foizga aylanmaydi; 60 kishi, 5 dan 5 — tayanch; K8 — faqat bank (2004, ikki yil).
6. [x] **Tayanchda yo'q narsa to'qilmadi** — uch savol, Mentor kanallari, Mentor posti, olti band, Umami sonlari, K8 so'zlari va brend izohlari — aynan; o'zim qaror qilganlar — TAYANCHGA SAVOL 1–16.
7. [x] **Saqlash kaliti — o'qiydigan darsning ehtiyojidan** — `pm-m10d6-kanallar` tayanch 8 aynan (`kanallar` ≤3 `id` bilan, `post` to'rt qator, `tekshiruv` [6], `yuborildi`); `nom` — tur, haqiqiy nom emas; ish fakti (`tekshiruv`) va natija (`yuborildi`) alohida; o'tmagan joy saqlanmaydi (TS 9); kalit yo'q bo'lsa — o'quvchi o'zi yozadi (9-ekran dalil qatori, 10-ekran foyda).
8. [x] **Test: bitta himoyalanadigan javob** — s3 (A ruxsat, B notanish, D yangi akkaunt — dars qoidasiga zid), s5 (post qasddan holatsiz), s8 (A «katta» — bankka zid, B tartibga zid, C ko'chirma), s12 (A, C, D — 2, 5-bandga zid); «Hech qayerda» tipidagi variant yo'q; ✔ yolg'iz eng uzun emas (O'lchov); arena 12 — «31» javobda takrorlanmaydi.
9. [x] **Keys: bank so'zi aynan** — 7-ekran uch kadr bank matni («o'zinikilarning hammasi», «universitet ketidan universitet», «ikki yildan keyin», «Auditoriyaning zichligi hajmidan muhimroq»); brend izohlari tayanch 5; ko'prik «Bu voqeada … Mentorning birinchi kanali ham …»; natija va son qo'shilmagan.
10. [x] **90 daqiqa** — A-bo'limda taqsimot; 9-ekran — bitta kanal yetadi (`optionalLive`); 10-ekran — Mentor ko'rmasa «Uyda yuboraman»; 11 — qoralama saqlanadi; uyga vazifa ③ — EAS navbati dars oqimini to'xtatmaydi (uyda), birinchi ikki buyruq vaqt qolsa sinfda; yakun holatga qarab.
11. [x] **Bir ma'no — bir so'z** — A-5: «kanal» / «Telegram kanali» / «Telegram guruhi», «post» (yuboriladi; «xabar» faqat 5-bandda, tayanch so'zi), «e'lon» (o'yin), «hodisa» (faqat analitika), «qator» / «band», «qadam» va «bosqich» yo'q, «sinov» yo'q — «tekshiruv fayli», «push» faqat `git push`.
12. [x] **Web-trek teng yo'l** — kanallar, post, kanal belgisi ikkala trekda bir xil (lending — 1-dars, ikkala trekda); 10-ekran halol holat Yordami web-trek gapi bilan; uyga vazifa ③ — «web-trekda yo'q» ochiq aytilgan; yakuniy test va yakun ikkala trekka to'g'ri.
13. [x] **Agent va o'quvchi ishi ajratilgan** — kanalni o'quvchi tanlaydi (9), postni o'quvchi yozadi (10), belgini va hodisani o'quvchi talabda aytadi, kodni agent yozadi, tekshiruv — Umami'da o'quvchi ko'radi (①); agent tekshiruv yozuvi va `DELETE` bu darsda yo'q.
14. [x] **O'smir xavfsizligi** — A-13 to'liq: tanish doira (2, 3, 9), ruxsat (2, 6, 9, 10, ②, 12), shaxsiy ma'lumot yo'q (6, 9, 10), ota-ona va Mentor ko'radi (6, 10, ②), uchrashuv — kattalar bilan (6, arena 7, ②), spam, soxta akkaunt, obunachi yo'q (6), belgi odamni bildirmaydi (11), Expo akkaunti (③).

## O'lchov (`scratchpad/md06/olchov.py` natijasi — har o'lchangan matn yonida qavsda; jadval skript chiqishidan)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha | 14 | 25 | 55 | ≤55 |
| Xulosa | 9 | 54 | 110 | ≤110 |
| Hook javobi («Aynan!» / «Qiziq fikr!» bilan) | 3 | 91 | 105 | ≤120 |
| Xato izohi va `QXato` | 42 | 25 | 56 | ≤60 |
| To'g'ri izohi | 4 | 55 | 60 | ≤60 |
| `QIzoh` va yashil yakun | 5 | 41 | 81 | ≤110 |
| Hook variantlari | 3 | 30 | 31 | farq 3% |
| Test variantlari — s3 | 4 | 39 | 42 | farq 7%, ✔ 39 |
| Test variantlari — s5 | 4 | 30 | 32 | farq 6%, ✔ 31 |
| Test variantlari — s8 | 4 | 39 | 40 | farq 2%, ✔ 40 |
| Test variantlari — s12 | 4 | 38 | 42 | farq 10%, ✔ 41 |
| Arena 1–12 (har savolda alohida) | 48 | 15 | 34 | har savolda farq ≤15%; ✔ yolg'iz eng uzun: yo`q |

Arena savollari bo'yicha: 1: 24–27 (11%) · 2: 26–28 (7%) · 3: 26–29 (10%) · 4: 31–33 (6%) · 5: 26–28 (7%) · 6: 17–20 (15%) · 7: 29–34 (15%) · 8: 23–25 (8%) · 9: 15–17 (12%) · 10: 30–33 (9%) · 11: 27–31 (13%) · 12: 27–30 (10%)

Arena ✔ taqsimoti: A — 2, 5, 10 · B — 3, 7, 11 · C — 1, 6, 8 · D — 4, 9, 12 (3/3/3/3). Ekran testlari: s3 C · s5 A · s8 D · s12 B.
Mentor gaplari: 0, 2, 4, 6, 9, 10, 11 — bitta gap (interaktiv); 1, 7 (har kadr) — ikki gapgacha; sarlavhani takrorlamaydi (qo'lda tekshirildi). Savollar: s3 8 so'z · s5 7 · s8 7 · s12 7; arena savollari 4–10 so'z (skript bilan sanaldi).
`npm run lint:til feedback/F-1006-12modul/06-PmChannels-v3.md` — 0 error, 1 warn (`kirill-lotin-matnda`, A-10: K8 bank matnining ruscha asli — auditor solishtirishi uchun ataylab qoldirildi; o'quvchi matni emas).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 402 `m10-05` «Ulanish uzilsa: buzamiz va tuzatamiz» → 403 **`m10-06` «Birinchi foydalanuvchilar sizni qayerdan topadi?»** (osti «kanallar va birinchi post» — reja chap qatori so'zma-so'z) → 404 `m10-07` «50 foydalanuvchiga qanday yetasiz?» (yakun qatori).
- [x] Bitta misol-ip: «Maydon Jamoa» — Mentor kanallari, posti va Umami sonlari (1.6 aynan); metafora yo'q; bitta vizual — `ChatTelefon` (ro'yxat · chat · qoralama · yuborildi). Ikkinchi misol faqat testda (sport to'garagi, uy vazifalari sayti — P-002). Facebook — keys sahnasi (PM-028/029).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4, 6 (QTushuncha) + 0, 7, 9, 10, 11; testlarda javobdan keyingi kichik vizual. «bosish va matn-karta» naqshi yo'q — har bosish telefon ro'yxatini, pufakni yoki ro'yxat kartasini o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktiv ekranlarda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izoh ≤60 — jadval yuqorida.
- [x] Atamalar: lending, foyda, asosiy tugma (1-dars), auditoriya (2-Modul), intervyu va «Hozir nima bilan» (11-Modul), Umami va hodisa (9-Modul) — so'zma-so'z; yangi «kanal», «post», «kanal belgisi», «tashrif» — misoldan keyin; siz-forma, tugmalar ot-shaklda («Saqlash», «Nusxalash», «Yubordim», «Uyda yuboraman», «Mentor ko'rdi»), chip qatori ot-shaklda (10-ekran).
- [x] Testlar: 4 variant, uzunlik teng (O'lchov jadvali, farq ≤15%); to'g'ri javob hech qayerda yolg'iz eng uzun emas; kalit so'z / tire faqat to'g'rida emas (har test ostidagi «Izoh (MD)»). Arena 12 — farq ≤15%, ✔ A3 B3 C3 D3. Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`).
- [x] Emoji yo'q (o'yin qatlami mustasno) · kafolat so'zlari yo'q («darrov», «darhol», «har doim», «100%» — grep 0; «odatda», «bo'lishi mumkin», «ko'rinishi kerak», «bu voqeada», «Mentor misolida» bilan chegaralangan).
- [x] Ichki kodlar yo'q (o'quvchi matnida F-kod, `m10-NN`, «Modul 12», A1, K8 yo'q; modul raqami LMS raqamida — «11-Modul», «2-Modul»). Keys — faqat bank matni, manba qatori bilan. «KOD» ro'yxati 16 band. Manbalar — havola va sana bilan.
- [x] Karta T · P · S · PM: T-002 (agentga talab — buyruq shaklida) · T-008 (Mentor posti, namoyish posti — olam ichidagi matn) · T-011/PM-030 (kanal, post — misoldan keyin, sarlavhada yo'q) · T-014/T-015 (A-5) · T-016 (metafora yo'q) · T-020 (kafolat yo'q) ·
  T-029 (Mentor «Bu…» bilan boshlanmaydi, ekrandagini ta'riflamaydi) · T-035 (o'quvchi izohida strelka yo'q) · T-038 (keyingi dars faqat yakun qatorida; 7-dars — faqat O'qituvchi eslatmasida) · T-039 («Postingiz» — 12-ekranda, post yozilgandan keyin) · T-042 (ta'riflar so'zma-so'z: 2, 4, 14, 15) ·
  T-043 («Mentor misolida», «bu voqeada») · T-047/T-048 · T-052 (tashrif — sahifa ochilishi) · T-064 (2-ekran 0-ekran savoliga javob) · T-071/T-073 (siz-forma, ot-shakl) ·
  P-001 (bitta ip) · P-002 (ikkinchi misol testda) · P-008 (bir ekran — bir ish; 10-ekranda to'rt qism ketma-ket, bitta ish — post) · P-013 · P-014/P-015 · P-016 (hook javoblari ekrandagi dalilga suyanadi) · P-025 (uyga vazifa karta) · P-026/P-028 (tashqi qadamlar: xato yo'li bitta gap, nomlar hujjatdan) ·
  P-033 (Yordam, ipucha) · P-036 (0-ekranda son o'zgarmaydi) · P-046 (9, 10, 15-ekran o'quvchi ma'lumotidan) · P-052 (bitta vizual) · P-053 (keys sahnasi, `pre` kadr) · P-062 · P-063 (bitta manbalar) · P-067 ·
  S-001 (savollar ≤12 so'z) · S-002/S-004 · S-006 (Ha/Yo'q variantlari yo'q) · S-008 · S-009 (to'g'ri izoh ≤60, «To'g'ri!» siz) · S-010 · S-015 (7-ekran bashorati bitta o'lchov) · S-018 (Facebook, Garvard izohlari) · S-020 (ballik matnda atama glossasiz yo'q) · S-021 · S-026 · S-027 · S-034 · S-040 ·
  PM-005 (2-tur) · PM-017 (namuna — bitta olam, rost) · PM-018 (Facebook — faqat bank qarori) · PM-028/029 · J-026 (hook ballsiz) · SABOQ 1–31 (A-bo'limda va har ekranda).
