# 14-Modul (kod: `src/12-Modull`) · 5-dars (PM) «Guruh pitchingizda nimani tuzatishni aytadi?» — MD v3

Fayl: `src/12-Modull/PmPitchTrainingLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-05` · **12 ekran** (keyssiz PM shakli — tayanch 4; 12-Modul 11-dars shakli) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
✅ **Qaror-0 tasdiqlandi** (GATE M `14M-GATE-1`, 08.10.2026, F-1008-558): TAXMIN T1–T20 hammasi A — MD shunga yozilgan edi, `<!-- TAXMIN Tn -->` belgilari olib tashlandi (qayerda bo'lgani — oxirida «Qaror-0 tasdiqlangan joylar»).
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p maydonli ish bittadan karta (E 53: varaqning olti qatori ham, uch tuzatish ham) · yorliq input ichida (E 43) ·
jadval «ma'lumot», tanlov kartasi «bosiladigan» ko'rinishda (E 45) · ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · odamlar real ko'rinishda, ismsiz (D 36) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **C** (`correctIdx 2`) · 5-ekran — **A** (`correctIdx 0`) · 8-ekran — **D** (`correctIdx 3`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 470–472, grep 08.10, DE-205): `m12-04` «Loyiha kuni: demo uchun sayqal» → **`m12-05` «Guruh pitchingizda nimani tuzatishni aytadi?»** (osti: «pitch mashqi 1: guruh fidbeki va tuzatishlar ro'yxati», `type: 'PM'`) → `m12-06` «Demoga tayyorgarlik: risklar va B reja».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn: guruh to'ldirgan baholash varag'i (olti bo'lak, ✓/✗, izoh, hakam savoli) va undan chiqqan **uch bandli tuzatishlar ro'yxati**; mustaqil ish majburiy (6, 7-ekranlar). **Keyssiz** (tayanch 5). **Kod ekrani yo'q.** REPO yo'q (tayanch 3: `m14-dars-05-done` = `04-done`).
⚠️ **Real odamlar bilan ishlaydigan dars** (TAQIQLAR 0, 3; sinf 9): guruh fidbeki — **bo'lak haqida, odam haqida emas** («zerikarli», «yomon», «yoqmadi» kabi baho-so'zlar yo'q — 12-Modul `BAHO_RE` naqshi) · kim kimdan yaxshi aytgani sanalmaydi, reyting yo'q · tinglovchining ismi hech qayerga yozilmaydi ·
yakka rejim (guruh bo'lmasa) — rost yo'l, yakun buni rost aytadi · yakka rejimdagi pitch yozuvi **telefonda qoladi**, hech qayerga yuklanmaydi (TAQIQLAR 1).
Vaqt: ≈ 90 daqiqa (taqsimot — A-11; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (1.0 · **1.1 — olti bo'lak, Mentor pitchining olti gapi AYNAN** · 1.2 — hikoya · **1.5 — guruh, varaq, Mentor varag'i, yakka rejim AYNAN** · 1.14 — sonlar · 2 — atamalar · 3 — teg 05 · 4 — PM 12 shakli · 7 — 18 sinf · 8 — `pm-m12d1-pitch`, `pm-m12d2-hikoya`, `pm-m12d5-varaq` · **9 — 15 kelishuv**) ·
`00-TAQIQLAR.md` (0, 1, 2, 3, 5, 6, 7) · `00-NOMLAR.md` · `MD_AGENT_TOPSHIRIQ.md` · `MD_TOPSHIRIQ_2.md` (5-qator, «Pilotlardan saboq», 5-band eslatmasi) · pilot `01-PmInvestorPitch-v3.md` (olti bo'lak, `HAKAM_SAVOL`, `JAMOA_PITCH`) ·
12-Modul `12-PmGrowthPitch-v3.md` + `12-FILTR.md` (11-ekran: taymer, baholash varag'i, `BAHO_RE`, yakka rejim) va `src/10-Modull/PmGrowthPitchLesson.jsx` 1599–1601, 1813–1900 · 13-Modul `06-PmMoneyTalk-v3.md` + `06-FILTR.md` (juftlik va yakka rejim, sherik o'zi bosadigan tasdiq tugmasi) ·
10-Modul `11-PmPitchRehearsal-v3.md` 35, 232 (fidbek, qattiq, lekin hurmatli fidbek — ta'rif) · 12-Modul tayanchi 116-qator (mahalla futbol guruhi — Telegram guruhi, 60 kishi) · 13-Modul tayanchi 1.2 (B2B — maydon egasi) va 2 (tasdiq ta'rifi).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «12-Modulda» (baholash varag'i), «1-darsdagi» va «2-darsdagi» (shu modul). Kod raqami faqat fayl yo'lida. «Demo Day» o'quvchi matnida yo'q (tayanch 9.13); keyingi darslar ekranda va'da qilinmaydi (T-038).

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Darsning bitta natijasi** (dastur: «Guruh oldida pitch — qattiq fidbek» · natija «Tuzatishlar ro'yxati»; tayanch 1.5, 4): o'quvchi 1-darsdagi olti bo'lakli pitchini **3–4 kishilik guruhga** taymer bilan 5 daqiqada aytadi (6-ekran);
   tinglovchilar uning qurilmasida **baholash varag'ini** bittadan karta bilan to'ldiradi — har bo'lakka ✓ yoki ✗, ✗ ga izoh — va oxirida **bitta hakam savoli** yozadi; o'quvchi shu varaqdan **tuzatishlar ro'yxatini** yozadi — uch band: qaysi bo'lak · unda nima o'zgaradi (7-ekran).
   Guruh bo'lmasa — **yakka rejim**: pitchni telefoniga yozib oladi, bir marta ko'radi va varaqni o'zi to'ldiradi (tayanch 1.5). Saqlanadi `pm-m12d5-varaq` (A-12; 8-dars o'qiydi — tayanch 8). Bo'laklar bugun qayta yozilmaydi — ro'yxat — reja (bo'laklarni tuzatish — uyga vazifa ①).
   Natija to'rt holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab — sinf 6, E 54): guruh varag'i + uch tuzatish · yakka varaq + uch tuzatish · varaq bor, tuzatishlar tugamagan · varaq to'ldirilmagan. Belgi ✓ va nishon — birinchi ikki holatda.
2. **Bugungi asosiy fikr** (P-013; dars ichidagi o'q — yakunda KO'RSATILMAYDI, SABOQ E 50): Guruh varag'i bo'lakdagi kamchilikni ko'rsatadi; undan uchta aniq tuzatish chiqadi — to'qilgan son va va'dasiz. (110)
3. **O'tilgan atamalar — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; `00-MANBA.md` 4):**
   - 10-Modul (`11-PmPitchRehearsal-v3.md` 35, 232): **fidbek** — «tinglovchining pitchdagi aniq joy haqidagi fikri yoki taklifi» · **qattiq, lekin hurmatli fidbek** — qaysi joy va unda nima yetishmagani aniq aytiladi, odam haqida gap yo'q · **baholash varag'i** · **repetitsiya** · **taymer** · **zal**.
   - 12-Modul 12-darsi: baholash varag'i — qator: bo'lak nomi · savol · ✓ / ✗ · izoh (placeholder «Nima yetishmadi?»), pastda «Vaqt: m:ss» (taymerdan o'zi yoziladi) · 5:00 dan oshsa qizil «+m:ss» · «Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?» · yakka rejim («varaqni o'zingiz to'ldiring») · **halol gap** · **jonli demo** · **bo'lak**.
   - 14-Modul 1-darsi: **olti bo'lak** — Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam (atoqli, bosh harf bilan) · **hakam** (glosssiz — tayanch 9.12) · **hakam savollari** (`HAKAM_SAVOL`, oltita — tayanch 9.3) · **savol-javob** · **aniq so'rov** · **qoralama** · pitch vaqti 5:00 (40 · 30 · 90 · 60 · 30 · 50 soniya — tayanch 9.1).
   - 14-Modul 2-darsi: **hikoya** — kim · lahza · o'zgarish; Muammo bo'lagi lahza bilan boshlanadi (tayanch 1.2) · pitchni telefonga yozib, o'zi bir marta ko'rish; video telefonda qoladi.
   - 13-Modul: **yozma tasdiq** — «odamning yozma javobi; real to'lov emas» (13-Modul tayanchi 2) · **Pro** · **«Doimiy o'yin»** · **test rejim** · maydon egasi — «"Maydon Jamoa" bugun maydon egasiga xizmat qilmaydi» (13-Modul tayanchi 1.2, 2-dars Mentor jadvali).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **hakam savoli** (varaqning pastki qatori) — «Hakam savoli — tinglovchi pitchdan keyin hakam o'rnida yozgan bitta savol.» (2-ekran, 3-tugmadan keyin `QIzoh`; kartochka 4, yakun 1-qatori shu ma'noda).
     1-darsdagi oltita **hakam savoli** — varaq qatorlarida, har bo'lak yonida (kurs savollari); pastki qatordagisi — tinglovchi shu pitchdan keyin o'zi yozgan yangi savol. Ma'no bitta (hakam beradigan savol), manbasi ikkita — TAYANCHGA SAVOL 6.
   - **tuzatishlar ro'yxati** (App.jsx osti so'zi) — «Tuzatishlar ro'yxati — uch band: qaysi bo'lak va unda nima o'zgaradi.» (4-ekran, uch kartadan keyin `QIzoh`; kartochka 7, yakun 3-qatori).
     Uch band qayerdan (bu darsdagi qoida, kurs qolipi — sinf 4): avval ✗ olgan bo'laklar (izohi bilan) · ✗ uchtadan kam bo'lsa — hakam savoli (unga qaysi bo'lak javob berishi kerak — o'quvchi tanlaydi) · yana kam bo'lsa — ✓ olgan bo'lakdan biri «yanada aniqroq» (12-Modul naqshi) · ✗ uchtadan ko'p bo'lsa — eng muhim uchtasi, qolgani uyga vazifada (TAYANCHGA SAVOL 2).
     **Uch band — uch xato degani emas** (05-FILTR 3): ✗ dan chiqqani — tuzatish, hakam savolidan — aniqlashtirish, ✓ bo'lakdan — kuchaytirish; har bandda manbasi ko'rinadi (`tuzatishlar[].manba`), o'quvchiga 7-ekranda bir gap bilan aytiladi.
   - **guruh** (oddiy so'z) — darsdagi 3–4 kishilik sinfdoshlar guruhi; **tinglovchi** (oddiy so'z, 10-Modul fidbek ta'rifidagi) — guruhda pitchni tinglayotgan sinfdosh. «gapiruvchi» — faqat MD ichidagi so'z; o'quvchi matnida — «navbatingiz», «Hozir siz gapirasiz» (12-Modul), sahna yorlig'i «gapiradi».
   - **tuzatish** (oddiy so'z) — bo'lakda nima o'zgarishini aytadigan bitta gap. 7-darsdagi «Tuzatish qilindi» (agent kodni tuzatgani) bu darsda yo'q.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«guruh»** — ikki joyda uchraydi (T-015 xavfi, TAYANCHGA SAVOL 11): darsdagi 3–4 kishilik guruh (prozada, «guruhingiz», «guruh tinglaydi») · Mentor misolidagi **mahalla futbol guruhi** — doim to'liq nomi bilan (Telegram guruhi, olam matni). Tinglovchi izohidagi «guruhmi?» — olam matni (T-008).
   - **«izoh»** — faqat ✗ (yoki ✓) yonidagi tinglovchi yozuvi; test va xato izohlari o'quvchiga «izoh» deb atalmaydi (MD dagi «To'g'ri izohi» — ichki yorliq).
   - **«belgi»** — faqat ✓ yoki ✗ (varaqda). **«baho»** — o'quvchi matnida yo'q (TAQIQLAR 3 «baho-so'zlar» — faqat MD ichida); test ballari — «ball».
   - **«Jamoa»** — faqat bo'lak nomi (bosh harf) yoki «Jamoa bo'lagi»; futbol ma'nosida prozada yo'q; «Maydon Jamoa» — qo'shtirnoqda. Mentor pitch gaplaridagi «jamoaga odam yig'ishda» — olam matni (tayanch 1.1, T-008).
   - **«so'rov»** — Keyingi qadamdagi aniq so'rov (Mentor gapi «Sizdan bitta so'rov: …» — tayanch 9.4). **«Yordam»** — faqat 6, 7-ekrandagi tugma nomi.
   - **«son»** — sanalgan miqdor; **«raqam»** — faqat «Raqamlar» bo'lagi nomida.
   - **«sinov»** — o'quvchi matnida yo'q (MD_TOPSHIRIQ_2 saboq 4): guruh — «tinglovchi», «guruh»; Mentor pitchidagi «Sinab ko'rganlar» va «sinayman» — tayanch 1.1 olam matni (T-008). Kartochka ekranining platforma sarlavhasi «O'zingizni sinab ko'ring.» — qolip.
   - **«tuzatish»** — bo'lakdagi rejalashtirilgan o'zgarish; «tuzatildi» — yo'q (bo'lak bugun qayta yozilmaydi). **«mashq»** — faqat reja yorlig'ida (App.jsx osti «pitch mashqi 1»).
   - **«yozuv»** — yakka rejimdagi telefon yozuvi (video yoki ovoz). **«video»** — faqat «yozuv» bilan birga, bir marta (6-ekran yakka rejimi).
   - **Ishlatilmaydi:** baho (o'quvchi matnida), reyting, o'rin (pitchlar orasida), jyuri, komissiya, Q&A (prozada), feedback (lotincha), «zerikarli», «yomon», «yoqmadi» (izoh sifatida — faqat test distraktorida va detektor ro'yxatida), «sinov», Demo Day, investitsiya (summa), «tuzatildi», grafik (pitchda — tayanch 9.14), daftar, keys, pilot, `m12-05`, «Modul 14».
6. **Mentor misoli (tayanch 1.1, 1.5, 1.14 — AYNAN; o'quvchi matnida «Mentor misolida»):**
   - **Mentor pitchi (`JAMOA_PITCH`, tayanch 1.1 aynan — 9.2; 1-dars bilan bir manba):**

| Bo'lak (vaqt — «bu mashqda», tayanch 9.1) | Matn (o'quvchi ko'radi) | Hakam savoli (`HAKAM_SAVOL`, 9.3) |
|---|---|---|
| Muammo (40 s) | «O'yinchilar jamoaga odam yig'ishda qiynaladi. Men so'ragan 5 o'yinchidan 4 tasida oxirgi o'yinda odam yetmagan yoki kimdir kelmagan.» | «Bu muammo borligini qayerdan bilasiz?» |
| Bozor (30 s) | «Mahalla futbol guruhida — 60 kishi; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» | «Bu mahsulot yana qancha odamga kerak?» |
| Yechim (90 s, jonli demo bilan) | «Tashkilotchi o'yinni e'lon qiladi, o'yinchilar bir bosishda qo'shiladi va o'yin kuni kelishini tasdiqlaydi.» + jonli demo: «8 / 10» → «9 / 10» | «Mahsulot nima qiladi?» |
| Raqamlar (60 s) | «51 foydalanuvchi; 11 tasi — sinfdoshlarim, 7 tasi taklif havolasidan keldi. 3 tashkilotchi Pro'ga yozma tasdiq berdi — bu hali to'lov emas.» | «Bu son qayerdan va nimani sanaydi?» |
| Jamoa (30 s) | «Men — g'oya, mahsulot va kod (agent bilan). Sinab ko'rganlar — 6 tashkilotchi va o'yinchilar.» | «Buni kim qilyapti?» |
| Keyingi qadam (50 s) | «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Sizdan bitta so'rov: mahalladagi maydon egalari bilan tanishtiring.» | «Endi nima qilasiz?» |

   - **Mentor varag'i (`MENTOR_VARAQ`, tayanch 1.5 AYNAN — yangi tafsilot yo'q):** Muammo ✓ · **Bozor ✗** — izoh «60 kishi kim — o'yinchimi, guruhmi?» · Yechim ✓ · **Raqamlar ✗** — izoh «tasdiq — to'lovmi?» · Jamoa ✓ · Keyingi qadam ✓; ✓ qatorlarida izoh yo'q.
     **Hakam savoli (`MENTOR_HAKAM_SAVOL`, 1.5 aynan):** «Nega maydon egalari bunga pul to'lamaydi?». Mentor varag'ida «Vaqt» qatori yo'q — Mentor pitchining haqiqiy vaqti tayanchda yo'q (to'qilmaydi; TAYANCHGA SAVOL 5).
     Varaqni kim to'ldirgan — «guruh» (soni aytilmaydi; sahnada uch tinglovchi qiyofasi — TAYANCHGA SAVOL 8). Raqamlar gapida «bu hali to'lov emas» bor — tinglovchi baribir so'ragan: gapda «to'lov emas» deyilgan bo'lsa ham, tinglovchida «yozma tasdiq» nimani anglatishi haqida savol qolgan (05-FILTR 5; «tushunmagan» deb talqin qilinmaydi).
   - **Mentorning tuzatishlar ro'yxati (`MENTOR_TUZATISH`, 3 band; tayanchda yo'q — TAYANCHGA SAVOL 1; har band faqat bor faktdan):**

| Band · bo'lak | Manba (varaqdan) | Nima o'zgaradi (o'quvchi ko'radi) | Fakt qayerdan |
|---|---|---|---|
| 1 · Bozor | ✗ «60 kishi kim — o'yinchimi, guruhmi?» | «60 kim ekanini aytaman: mahalla futbol guruhi a'zolari» | 12-Modul tayanchi 116 (Telegram guruhi, 60 kishi) |
| 2 · Raqamlar | ✗ «tasdiq — to'lovmi?» | «Tasdiq nima ekanini aytaman: yozma javob, pul emas» | 13-Modul tayanchi 2 (tasdiq — yozma javob, real to'lov emas) |
| 3 · Keyingi qadam | hakam savoli «Nega maydon egalari bunga pul to'lamaydi?» | «Ular to'lovchi emas — faqat tanishtirish so'rayman» | 13-Modul tayanchi 1.2 (maydon egasiga xizmat qilmaydi — bugungi to'lovchi emas) + tayanch 1.1 Keyingi qadam so'rovi (tanishtirish) — ikki bor faktni birlashtiradi, yangi fakt yo'q (05-FILTR 4) |

     Uchinchi band hakam savolidan — ✗ ikkita (A-4 qoidasi). Bo'lagi Keyingi qadam: savoldagi «maydon egalari» faqat shu bo'lakda. Mentor bo'laklarni bugun qayta yozmaydi — tuzatilgan gaplar bu darsda yo'q (sinf 12: keyingi dars natijasi oldindan ochilmaydi).
   - Mentor misoli — namuna, majburiy shakl emas (sinf 4): «Mentor misolida …», «bu misolda …». Grafik pitchga qaytmaydi (tayanch 9.14).
7. **Sonlar (faqat tayanch 1.14 va 9.1):** Mentor pitchi gaplaridagi 5 dan 4 · 60 · 6 · 51 · 11 · 7 · 3 (yozma tasdiq) · «8 / 10» → «9 / 10» · vaqt 40 · 30 · 90 · 60 · 30 · 50 soniya = 5:00 · guruh 3–4 kishi · tuzatishlar 3 band.
   Har xil o'lchovdagi sonlar qo'shilmaydi (60 — guruh a'zosi, 6 — ilovadagi tashkilotchi). Pro'ni yoqqanlar, Telegram'ni ulaganlar soni — yo'q. Ikkinchi misolda (testlar) son yo'q. Boshqa son yo'q.
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** kitob almashish ilovasi pitchi (3, 5-ekran; 01 MD va 13-Modul testlari olami). Metafora yo'q. Keys yo'q (tayanch 5).
9. **Real odamlar xavfsizligi (TAQIQLAR 0, 1, 3; sinf 9):**
   - guruh — sinfdoshlar; varaq, izoh, hakam savoli va kalitda **ism, familiya, telefon yo'q** (tinglovchi ham, gapiruvchi ham); telefon shakli va «@» — bloklanadi (6-ekran tekshiruvi);
   - izoh — bo'lak haqida: baho-so'zlar («zerikarli», «yomon», «yoqmadi») detektori yo'naltiradi; masxara yo'q; varaq — guruhning bitta umumiy yozuvi (konsensus): fikrlar farq qilsa muhokama, tushunarsiz joy izohda — bitta odam fikri avtomatik ✗ bo'lmaydi, kamchilik ham yashirilmaydi (05-FILTR 1, 2);
   - pitchlar solishtirilmaydi, kim yaxshiroq aytgani sanalmaydi; Mentor ekraniga ✓/✗ soni, izoh va hakam savoli chiqmaydi — faqat «Pitchni aytdi», «Varaq saqlandi» signali; podium — faqat test ballari;
   - guruh oldida aytishni istamagan o'quvchi — yakka rejim (majburlanmaydi; yakun rost aytadi); yakka rejimdagi yozuv telefonda qoladi, hech kimga yuborilmaydi va hech qayerga yuklanmaydi;
   - hakam savolida «investitsiya», «ulush», «summa» — yo'naltiradi (TAQIQLAR 1: bu kursda pul summasi so'ralmaydi); «pul» so'zi o'zi bloklanmaydi — Mentor misolidagi hakam savolida ham bor.
10. **Kim nima yozadi:** 6-ekran — tinglovchilar (guruh rejimida) varaqni gapiruvchining qurilmasida to'ldiradi: avval tinglovchilardan biri «Biz tingladik — varaqni to'ldiramiz» tugmasini o'zi bosadi (13-Modul 6-dars «Sherigingiz o'zi bossin» naqshi), keyin olti karta va hakam savoli ·
    yakka rejimda — o'quvchi o'zi · 7-ekran — o'quvchi o'zi (tuzatishlar uning qarori; Mentor misoli faqat Yordam'da — sinf 13). Agent bu darsda ishlamaydi.
11. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas; sinf 1):** kirish va reja (0–1) ≈ 5 · Mentor varag'i va 1-savol (2–3) ≈ 10 · tuzatishlar ro'yxati va 2-savol (4–5) ≈ 10 ·
    guruhda pitch (6) ≈ 36 (Mentor ko'rsatishi ≈ 2 · guruhga bo'linish va ilovani ochish ≈ 3 · har o'quvchi 5 daqiqa pitch + 2–3 daqiqa varaq — 3 kishilik guruhda ≈ 24, 4 kishilikda ≈ 32 · saqlash ≈ 2; auditor bahosi: haqiqiy guruh bloki 35–45 — 05-FILTR 26) · tuzatishlaringiz (7) ≈ 10 · yakuniy savol, podium, kartochkalar, arena, yakun (8–11) ≈ 14 · zaxira ≈ 5. Guruh — sukutda 3 kishi.
    **Ulgurmagan o'quvchi yo'li (05-FILTR 27, 28):** 6-ekran — darsning markazi, jonli darsda **majburiy** (`optionalLive` yo'q): guruh hamma pitchni tugatadi; vaqt yetmasa 7-ekran (tuzatishlar) va kartochkalar uyga — uyga vazifa ③. Oxirgi o'quvchi majburan yakka rejimga tushirilmaydi — yakka rejim faqat o'quvchi o'zi tanlasa (guruh oldida aytishni istamasa) ·
    7-ekran — uch band to'lmasa, yozilgani saqlanadi, qolgani — uyga vazifa ③; jonli darsda Mentor 7-ekranni `optionalLive` bilan o'tkazishi mumkin · arena vaqti qisqarsa — kartochkalar uyda. Tashqi kutish yo'q (repo, build, xizmat yo'q); jonli demo ochilmasa — og'zaki (6-ekran «Pitchdan oldin»).
12. **Saqlash kalitlari (tayanch 8; sinf 3):**
    - **o'qiydi:** `pm-m12d1-pitch` (`bolaklar.muammo … keyingi` — 6-ekran Sahnasida o'quvchi bo'laklari, har birining boshi; `null` yoki kalit yo'q — bo'lak nomi va kulrang «yozilmagan») · `pm-m12d2-hikoya` (`lahza` — 6-ekran Muammo kartasida kulrang qator «Hikoyangiz: «{lahza}»»; yo'q bo'lsa — qator ko'rinmaydi).
      Boshqa kalit o'qilmaydi (trek ham — matn ikkala trekka bir xil).
    - **yozadi:** `pm-m12d5-varaq` = `{ tur: 'guruh' | 'yakka', varaq: [{ bolak, belgi: '✓' | '✗' | null, izoh }] (6), hakamSavoli, tuzatishlar: [{ bolak, nima, manba }] (3), vaqt, savedAt }` (tayanch 8 + 9.24 `vaqt`; 05-FILTR 3, 14). Maydonlar shartnomasi:
      `tur` — 6-ekran rejim tanlovi · `varaq` — oltita, tartib o'zgarmaydi (`muammo` · `bozor` · `yechim` · `raqamlar` · `jamoa` · `keyingi`); `belgi` — saqlashda hammasi `'✓'` yoki `'✗'` (`null` — faqat dars ichidagi oraliq holat, kalitga tushmaydi) · `izoh` — `string` (≤ 120; ✗ da ≥ 8 belgi, ✓ da `''` bo'lishi mumkin) ·
      `hakamSavoli` — `string` (≤ 120) yoki `null` (hali yozilmagan) · `tuzatishlar` — 0–3 band, har biri `{ bolak: <oltita id dan biri>, nima: string ≤ 120, manba: 'x' | 'savol' | 'aniqroq' }` (manba — band qayerdan: ✗ izohi · hakam savoli · ✓ bo'lak; 05-FILTR 3); to'liq ro'yxat — 3 (7-ekran har «Saqlash»da bittadan qo'shadi) · `vaqt` — `n | null`, pitch soniyasi (taymer «To'xtatish»dan; 8-dars 5:00 bilan solishtiradi — 05-FILTR 14, tayanch 9.24) · `savedAt` — har saqlashda.
      6-ekran `tur`, `varaq`, `hakamSavoli`, `vaqt` ni yozadi (`tuzatishlar: []`); 7-ekran — `tuzatishlar` ni (bitta kalit, qo'shib saqlanadi). Taymer vaqti varaqda ko'rinadi va `vaqt` ga yoziladi (TAYANCHGA SAVOL 5 — 05-FILTR 14 QABUL).
      Kalitga ism, telefon, video yoki ovoz fayli, havola yozilmaydi. Dars boshqa darsning kalitiga yozmaydi (`pm-m12d1-pitch` ga ham — bo'laklar bugun qayta yozilmaydi). Kod qoralamasi kaliti yo'q.
13. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✗ ✕ › ✎ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Guruh qiyofalari, taymer chizig'i, varaq, telefon — chizilgan (CSS/SVG), logotip yo'q.
    «Maydon Jamoa» — telefon maketida, o'z yashil rangida (11-Modul 9.62), faqat Mentor misolida (2-ekran, Yechim). Rang — faqat holat foni (D3): ✓ — `ok` · ✗ — `err` · joriy bo'lak — `accent` · to'ldiriladigan joy — uzuq chiziq (U-041). Kafolat va belgi-formula (→, =) o'quvchi izohida va test variantida yo'q.
14. **Trek (sinf 11):** PM darsi — ikkala trekka bir xil matn: «mahsulot», «pitchingiz». Jonli demo (Yechim ichida) — o'quvchining o'z qurilmasida, 12-Moduldagidek (mobil trek — telefon yoki brauzer ko'rinishi; web-trek — brauzer); ochilmasa — og'zaki. Trek kaliti o'qilmaydi.

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.1, 1.2, 1.5):** 1-darsda pitch olti bo'lakka yozildi, 2-darsda Muammo bo'lagi hikoya bilan boshlandi, 3-darsda mahsulot tezligi o'lchandi, 4-darsda demo yo'li sayqallandi. Pitch hali hech kimga to'liq aytilmagan. Bugun — birinchi marta guruh oldida, taymer bilan; guruh varag'idan uch tuzatish.
- **12-Modul ko'prigi (takrorlanmaydi):** u yerda juftlikda besh qatorli baholash varag'i va bitta bo'lakni darsning o'zida qayta yozish o'rgatilgan. Bugun — 3–4 kishilik guruh, olti qator (1-darsdagi hakam savollari bilan), pastda tinglovchining hakam savoli, natija — uch bandli tuzatishlar ro'yxati (bo'laklar bugun qayta yozilmaydi).
- **Dars ipi:** 0 — guruhning qaysi gapi pitchni tuzatishga foyda beradi? (ballsiz) → 2 — Mentor pitchini guruh tingladi: varaqqa ikki ✗ va izohlar, oxirida hakam savoli (atama «hakam savoli») → 3 — test: izoh bo'lak haqida (kitob almashish ilovasi) →
  4 — Mentor varag'idan uch tuzatish: har bandda izohga javob, yangi son va va'da yo'q (atama «tuzatishlar ro'yxati») → 5 — test: aniq tuzatish (kitob almashish ilovasi) → 6 — o'z pitchi guruhga 5 daqiqada, varaq va hakam savoli (yakka rejim bor) → 7 — o'z varag'idan uch tuzatish →
  8 — yakuniy: guruh ✗ qo'ysa nima qilasiz → podium → kartochkalar → yakun (holatga qarab); uyda — tuzatishlarni pitchga kiritish va taymer bilan bir marta aytish.
- **Bitta vizual — «Guruh varag'i sahnasi» (`GuruhVaraqSahna`, dars bo'yi; 163/180; bitta manba `JAMOA_PITCH` + `HAKAM_SAVOL` + `MENTOR_VARAQ` + `MENTOR_TUZATISH` + o'quvchi ma'lumoti `pm-m12d1-pitch`, `pm-m12d2-hikoya`, `pm-m12d5-varaq`):**
  - **guruh** (chapda): to'rt qiyofa real ko'rinishda (bosh, soch, rangli kiyim — D 36), ismsiz — o'rtada pitch aytayotgan (yorliq «gapiradi»), atrofida uch tinglovchi (yorliq «tinglaydi»); gapiruvchi ustida pufak — joriy bo'lakning birinchi gapi.
    Mentor misolida Yechim joriy bo'lganda gapiruvchi qo'lida kichik telefon (≈90×146, barqaror): «Maydon Jamoa» (o'z yashil rangida, logotipsiz) — «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10» (son bir lahza kattalashib, silliq qaytadi).
  - **taymer chizig'i** (guruh ostida, butun kenglikda; 12-Modul `TaymerChiziq` naqshi, dars ichida yoziladi — K-020): 0–5:00, olti bo'lak (40 · 30 · 90 · 60 · 30 · 50 s), har bo'lak ostida nomi; joriy — accent; ✗ olgan bo'lak — `err` chet; «savol-javob» bo'lagi bu darsda yo'q — savol varaq pastida yoziladi, javob mashq qilinmaydi (05-FILTR 25; 8-darsda qaytadi);
    o'quvchi taymerida 5:00 dan oshsa chiziq o'ngga qizil davom etadi, yonida «+m:ss».
  - **baholash varag'i** (o'ngda; jadval — «ma'lumot» ko'rinishi, E 45: to'q sarlavha qatori «Baholash varag'i · n / 6», katak chiziqlari, kulrang fon, soyasiz): olti qator — bo'lak nomi · hakam savoli (kulrang, kichik) · belgi katagi (✓ — yashil, ✗ — `err`) · izoh;
    pastda alohida qator **«Tinglovchining hakam savoli»** (bo'shi — uzuq ramka, U-041; yakka rejimda — «Hakam savoli»; 05-FILTR 24); o'quvchi varag'ida eng pastda «Vaqt: m:ss» (taymerdan o'zi yoziladi).
  - **tuzatishlar ro'yxati** (varaq ostida; 4, 7-ekranlar): sarlavha «Tuzatishlar ro'yxati · n / 3», uch qator «bo'lak · nima o'zgaradi» (bo'shi — uzuq chiziq); varaqdagi manba qator yonida kichik kulrang yorliq «ro'yxatda».
  - Ishlatiladi: 0 (guruh + to'lgan taymer, tinglovchi pufaklarida «…») · 1 (skelet, matnsiz) · 2 (to'liq: guruh, taymer, Mentor varag'i) · 3, 5, 8 (javobdan keyin kichik varaq qatori) · 4 (varaq ixcham + karta + ro'yxat) · 6 (o'quvchi bo'laklari + taymer + varaq) · 7 (varaq ixcham + karta + ro'yxat).
  - Har ekranda ≤ 3 blok: guruh va taymer — bitta blok. `prefers-reduced-motion` da yurish, uchish va to'lqin yo'q — holatlar birdan almashadi (DE-200). 393 kenglikda varaq guruh ostiga tushadi, o'lchamlar barqaror, hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Bashorat (E 42):** tanlangach yo'qolmaydi — savol va tanlangan javob ixcham qator bo'lib natijagacha turadi; natija — yashil xulosa qutisining birinchi kichik qatori: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: …»; `QIzoh` — o'sha qutining oxirgi kichik qatori.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → belgi katakka tushadi, izoh qatorga sirg'aladi, karta ro'yxatga uchadi · yangi qator ~1 s yashil yonadi · taymer chizig'i to'lib boradi. Bezak-harakat (to'xtovsiz miltillash) yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Guruh pitchingizda nimani tuzatishni aytadi?** (44) — dars nomi (DE-205)
- Mentor: Pitchingizni guruhdagi sinfdoshlaringiz eshitsa, ularning qaysi gapi sizga ko'proq foyda beradi?
- Maket (chap; `GuruhVaraqSahna` «kirish» holati): to'rt qiyofa — o'rtada gapiruvchi (yorliq «siz»), atrofida uch tinglovchi, har birining ustida bo'sh pufak «…»; ostida taymer chizig'i 5:00 gacha to'lgan (olti bo'lak nomi bilan). Varaq yo'q (≤ 3 blok: maket · variantlar · javob).
- Variantlar (radio, o'ng; bir uzunlikda, bir shaklda — P-016):
  - Qaysi bo'lakda nima yetishmagani
  - Pitchingiz ularga yoqdimi, yo'qmi
  - Guruhda kimniki yaxshiroq chiqqani
- Javob — «qaysi bo'lak»: **Aynan!** Bo'lak va unda nima yetishmagani aytilsa, nimani tuzatishni aniq bilasiz.
- Javob — «yoqdimi»: **Qiziq fikr!** Bu ham fikr, lekin u qaysi bo'lakni tuzatishni aytmaydi.
- Javob — «kimniki»: **Qiziq fikr!** Bu darsda pitchlar solishtirilmaydi — har pitch o'z bo'laklari bilan ko'riladi.
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; «qaysi bo'lak» tanlansa — taymer chizig'idagi bitta bo'lak accent halqa oladi (qaysi biri ekani yozilmaydi — 2-ekran kashfiyoti, P-036), tinglovchi pufaklaridan birida «?» paydo bo'ladi;
  qolgan ikkitasida — pufaklar «…» bo'lib qoladi, chiziqda hech bir bo'lak yonmaydi. Javob qatori chiqadi. Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — Mentor misolidagi varaqni hozir birga ko'rasiz. Kim nima tanlaganini sanamang. 12-Modulda varaq juftlikda edi; bugun pitchni 3–4 kishilik guruh tinglaydi.
✎ Hook — o'quvchining o'z pitchi (1-dars) va guruhning gapi (P-016: aniq narsa + harakat). «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067). «Qiziq fikr!» javoblari tanlovni masxara qilmaydi: «yoqdimi» ham fikr, faqat tuzatishga yo'l ko'rsatmaydi; «kimniki» — bu darsda solishtirish yo'qligi (TAQIQLAR 3) aytiladi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun pitchingizga guruh varag'idan tuzatish yozasiz.** (53) — natija va'dasi (P-014), «uchta» soni oldindan va'da qilinmaydi (05-FILTR 8)
- Mentor: Avval Mentor misolida varaqni ko'rasiz, keyin pitchingizni guruhga aytasiz.
- Chap — kulrang yorliq «pitch mashqi 1: guruh fidbeki va tuzatishlar ro'yxati» (App.jsx osti so'zma-so'z, P-015) + ostida kulrang qator: Guruh — 3–4 kishi; guruh bo'lmasa, varaqni o'zingiz to'ldirasiz.
  Vizual (`GuruhVaraqSahna`, skelet — DE-200, bir marta o'zi yuradi): to'rt nomsiz qiyofa, olti bo'sh bo'lakli taymer chizig'i 5:00 gacha yuradi; o'ngda bo'sh varaq ramkasi (olti qator chizig'i, matnsiz) va ostida uch uzuq qator. Matn yo'q — 2, 4-ekran kashfiyotini ochmaydi (P-015).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Varaqdan nimani tuzatishni o'qishni bilib olasiz · `baholash varag'i`
  - 02 · Izohdan aniq tuzatish yozishni o'rganasiz · `tuzatish`
  - 03 · Pitchingizni guruhga 5 daqiqada aytasiz · `taymer`
  - 04 · Varaqingizdan uchta tuzatish yozasiz · `tuzatishlar ro'yxati`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz · Keyingi bosiladigan joy: «Boshlaymiz» (vizual tugagach halqada).
- O'qituvchi eslatmasi: Guruhlarni hozir aytib qo'ying (3 kishi — sukut; 12–15 o'quvchi bo'lsa — to'rt-besh guruh; 4 kishilik guruhda vaqt ko'proq ketadi). Guruh oldida aytishni istamagan o'quvchi yakka rejimda ishlaydi — bu ham to'liq yo'l. Bugun bo'laklar qayta yozilmaydi: natija — uch tuzatishli ro'yxat.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011): «tuzatish» — oddiy so'z, «tuzatishlar ro'yxati» va «baholash varag'i» — faqat kulrang teglarda va App.jsx yorlig'ida. Sarlavha — natija va'dasi (P-014). 01 — 2-ekran · 02 — 4-ekran · 03 — 6-ekran · 04 — 7-ekran.
  «pitchingiz» — 1-darsda yozilgan (T-039); saqlanmagan bo'lsa ham 6-ekranda og'zaki aytiladi.

## 2 · Mentor varag'i  ← QTushuncha (markaziy; ketma-ket 3 tugma)
- Eyebrow: Tushuncha · baholash varag'i
- Sarlavha: **Mentor pitchini eshitgan guruh varaqqa nima yozdi?** (50)
- Mentor: Tugmalarni birma-bir bosing va har bosishdan keyin varaqqa qarang.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Guruh Mentor pitchining nechta bo'lagiga ✗ qo'ydi?** · Bitta · Ikkita · Uchta — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi.
- Vizual (`GuruhVaraqSahna`, to'liq; ≤ 3 blok: guruh va taymer · varaq · tugmalar qatori): **chapda** — guruh (Mentor gapiradi, uch tinglovchi; ustida yorliq «Mentor misoli · Maydon Jamoa», nom o'z yashil rangida) va taymer chizig'i (olti bo'lak, hali bo'sh) ·
  **o'ngda** — bo'sh baholash varag'i: olti qator (bo'lak nomi + `HAKAM_SAVOL` kulrang, belgi va izoh kataklari bo'sh), pastda bo'sh «Hakam savoli» qatori (uzuq ramka).
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Pitch · 2 Varaq · 3 Hakam savoli
- **Harakat → Vizual o'zgarish:**
  1. «Pitch» → taymer chizig'i bo'lak-bo'lak to'lib boradi (har bo'lak ≈ 1 s; chiziq ustida kulrang yorliq «tezlashtirilgan»), joriy bo'lak accent; Mentor pufagida joriy bo'lakning birinchi gapi almashadi (`JAMOA_PITCH`; Muammo boshida avval lahza gapi «Shanba, 18:00. Maydonda 8 kishi…» — 2-dars qarori, keyin Muammo gapi); Yechimda Mentor qo'lidagi telefonda «8 / 10» → «9 / 10». Tinglovchilar pitch davomida jim — varaq bo'sh qoladi.
     `QIzoh`: Guruh pitchni oxirigacha tinglaydi — varaq pitchdan keyin to'ldiriladi.
  2. «Varaq» → belgilar qatorlarga navbat bilan tushadi: Muammo ✓ · Bozor ✗ + izoh «60 kishi kim — o'yinchimi, guruhmi?» · Yechim ✓ · Raqamlar ✗ + izoh «tasdiq — to'lovmi?» · Jamoa ✓ · Keyingi qadam ✓ (✓ qatorlarida izoh yo'q);
     har ✗ tushganda taymer chizig'idagi o'sha bo'lak `err` chet oladi va Mentor pufagida o'sha bo'lakning gapi bir lahza qaytadi (izohdagi so'z — «60 kishi», «tasdiq» — gapda accent bilan ajraladi).
     `QIzoh`: Ikkala izoh ham bo'lak haqida: unda nima tushunarsiz qolgani yozilgan.
  3. «Hakam savoli» → varaqning pastki qatoriga tinglovchi pufagidan savol uchib tushadi: «Nega maydon egalari bunga pul to'lamaydi?»; pastki qator accent bilan bir lahza yonadi.
     `QIzoh`: Hakam savoli — tinglovchi pitchdan keyin hakam o'rnida yozgan bitta savol.
  Natija (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: ikkita».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan tugmani bosing — varaq qanday to'lishini ko'ring.
- Xulosa: Bu darsda varaqda har bo'lakka ✓ yoki ✗, ✗ yonida izoh va oxirida bitta hakam savoli turadi.
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, varaq butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy tugma (to'lqin 2–3 marta) → «Davom etish».
- Nishon yo'q (tugmali tushuncha — S-034).
- O'qituvchi eslatmasi: Bu — 12-Moduldagi baholash varag'i; bugun qatorlar olti (1-darsdagi olti bo'lak), har qatorda o'sha bo'lakning hakam savoli; pastda — tinglovchining o'z savoli. Izohlar va savol — Mentor misolida guruh yozgani, real hakamning gapi emas.
  «60 kishi» — mahalla futbol guruhi (Telegram guruhi) a'zolari; «tasdiq» — 13-Moduldagi yozma tasdiq, to'lov emas. Raqamlar gapida «bu hali to'lov emas» bor edi — tinglovchida baribir «yozma tasdiq» nimani anglatishi haqida savol qolgan. Sinfdan so'rang: gapda bor narsa haqida nega yana savol qoladi?
✎ Hook savoliga javob: ekran sarlavhasi «guruh varaqqa nima yozdi» — 0-ekrandagi «guruh nimani aytadi» savolining o'z so'zi bilan (T-064). Mentor varag'i — tayanch 1.5 aynan; ✓ qatorlarida izoh to'qilmadi.

## 3 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · izoh (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Kitob almashish pitchida Jamoa bo'lagi tushunarsiz bo'ldi. Izohga nima yozasiz?**
  - A — «Siz bugun yaxshi gapira olmadingiz»
  - B — «Hamma bo'lak yaxshi edi, izoh shart emas»
  - ✔ C — «Jamoa bo'lagida kim nima qilgani yo'q»
  - D — «Jamoa bo'lagi umuman qiziq emas edi»
- To'g'ri izohi: Izoh bo'lak haqida: unda nima yetishmagani yoziladi.
- Xato izohlari: A — Bu odam haqida — Jamoa bo'lagida nima yetishmadi? · B — Jamoa tushunarsiz edi — yashirilsa, tuzatilmaydi. · D — Bu fikr — unda nima yetishmagani yo'q. ·
  (umumiy) Mentor pitchiga yozilgan izohlar nima haqida edi?
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kitob ilovasi varag'idan bitta qator — «Jamoa · ✗ · kim nima qilgani yo'q».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Part, Not Person! — birinchi urinishda to'g'ri.
- Izoh (MD): uch distraktor uch turkumda (S-004, sinf 8): A — odam haqida (bo'lak yo'q) · B — kamchilikni yashirish (savol sharti — Jamoa tushunarsiz) · D — bo'lak nomi bor, lekin faqat fikr (nima yetishmagani yo'q). To'rttasi qo'shtirnoqli izoh shaklida; «bo'lak» B, C, D da, «Jamoa» C va D da — kalit so'z faqat to'g'rida emas.
  D — TAQIQLAR 3 dagi baho-so'z turkumi («qiziq emas») bo'lak haqida aytilgani: tinglovchi bo'lakni tilga oldi, lekin tuzatish uchun hech narsa bermadi. Savol izohni so'raydi, belgini emas — ✗ savol shartidan aniq.

## 4 · Tuzatishlar ro'yxati  ← QTushuncha (ketma-ket 3 karta — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · tuzatishlar ro'yxati
- Sarlavha: **Mentor varag'idan qanday tuzatish chiqadi?** (42)
- Mentor: Har kartada izohga javob beradigan tuzatishni tanlang — u ro'yxatga tushadi.
- Bashorat yo'q: ro'yxatdagi «n / 3» sanog'i javobni ochib qo'yardi (P-036); ekran harakatli, «Keyingi» bilan o'tilmaydi (P-064 talab qilmaydi).
- Vizual (≤ 3 blok: varaq · karta · ro'yxat): **chapda** — Mentor varag'i ixcham (Bozor va Raqamlar ✗ qatorlari va «Hakam savoli» qatori accent chegara bilan, qolgani xira) · **o'ngda** — bitta katta karta (joriy band, «N / 3»), tepasida manba qatori (izoh yoki savol), ostida uchta tuzatish varianti (har birining o'z chegarasi — E 40) ·
  **pastda** — «Tuzatishlar ro'yxati · n / 3»: uch bo'sh uzuq qator.
- Kartalar (navbat bilan; to'g'ri javob — `MENTOR_TUZATISH`, A-6 aynan; variantlar tartibi kodda qat'iy):
  1. **Bozor · ✗** — manba qatori: «60 kishi kim — o'yinchimi, guruhmi?»
     - Bozorga kattaroq son yozaman: butun shahar aholisi soni
     - ✔ 60 kim ekanini aytaman: mahalla futbol guruhi a'zolari
     - Bozor bo'lagini pitchdan butunlay olib tashlayman
  2. **Raqamlar · ✗** — manba qatori: «tasdiq — to'lovmi?»
     - ✔ Tasdiq nima ekanini aytaman: yozma javob, pul emas
     - "3 tashkilotchi Pro'ni sotib oldi" deb aytaman
     - Tasdiqlar haqida pitchda umuman hech narsa demayman
  3. **Hakam savoli** — manba qatori: «Nega maydon egalari bunga pul to'lamaydi?»; karta tepasida kulrang: Savoldagi «maydon egalari» — Keyingi qadam bo'lagida. (varaqda Keyingi qadam qatori va Sahnada shu gapdagi «maydon egalari» so'zlari accent bilan yonadi)
     - Maydon egalari ham keyin to'laydi, deb aytaman
     - So'rovdan maydon egalarini butunlay olib tashlayman
     - ✔ Ular to'lovchi emas — faqat tanishtirish so'rayman
- **Harakat → Vizual o'zgarish:** variantni bosish → to'g'ri bo'lsa: variant kartadan ro'yxatdagi navbatdagi bo'sh qatorga uchadi va «{bo'lak} · {nima o'zgaradi}» bo'lib o'tiradi (~1 s yashil); varaqdagi manba qator yonida kulrang yorliq «ro'yxatda»; keyingi karta kiradi.
  Xato → variant silkinadi, bir lahza `err` fon, bitta `QXato` (≤ 60; javobni aytmaydi):
  - «kattaroq son»: Bu son qayerdan? Manbasiz son Bozorga yozilmaydi.
  - «Bozor bo'lagini … olib tashlayman»: Bo'lak qoladi — unda nima o'zgaradi?
  - «Pro'ni sotib oldi»: Tasdiq — to'lov emas: bu gap rost bo'lmaydi.
  - «umuman hech narsa demayman»: Tasdiq — dalil: u yashirilmaydi, tushuntiriladi.
  - «keyin to'laydi»: Bu va'da — bugun bilgan narsangizni ayting.
  - «So'rovdan … olib tashlayman»: Savol qoladi — unga javob bering.
- Natija (bitta blok — E 42; `tugadi`: kartalar yopiladi, varaq va ro'yxat butun enga, ⛶ ichida — q17/q18): ro'yxatda uch qator to'la (A-6 jadvali, «Nima o'zgaradi» ustuni aynan).
  `QIzoh` (yashil xulosa qutisining oxirgi kichik qatori): Tuzatishlar ro'yxati — uch band: qaysi bo'lak va unda nima o'zgaradi.
- Xulosa: Bu misolda har tuzatish izohga yoki savolga javob beradi: to'qilgan son va va'da yo'q.
- Tugma (pastki): Kartalarni yeching (N/3) → Davom etish
- Ipucha (40 s): Qaysi gap izohga javob beradi va yangi narsa to'qimaydi?
- Keyingi bosiladigan joy: joriy kartaning uch varianti (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Fix Finder! (uch karta birinchi urinishda).
- O'qituvchi eslatmasi: ✗ ikkita — uchinchi band hakam savolidan. Bu darsda qoida shunday: avval ✗ lar, keyin hakam savoli, kerak bo'lsa ✓ bo'lakdan biri «yanada aniqroq». Mentor bugun bo'laklarni qayta yozmaydi — ro'yxat — reja.
  Maydon egasi haqida — 13-Moduldagi pul modellarida ko'rilgan: ilova bugun maydon egasiga xizmat qilmaydi, muammo gapida u yo'q — shuning uchun u bugungi to'lovchi emas; lekin Keyingi qadamda aynan ulardan tanishtirish so'raladi — tuzatish ikkisini ajratib aytadi (to'lovchi emas, faqat tanishtirish). Bu Mentorning bugungi bilgani, va'da emas (05-FILTR 4).
  «60 kim» — mahalla futbol guruhining a'zolari (Telegram guruhi); hammasi o'yinchimi — Mentor tekshirmagan, shuning uchun «o'yinchi» demaydi.
✎ Har kartadagi uch variant — uch xil yo'l: to'g'ri tuzatish · yangi narsa to'qish (kattaroq son, «sotib oldi», «keyin to'laydi») · yashirish (bo'lakni, tasdiqni, maydon egalarini olib tashlash). Bashorat yo'qligi sababi — yuqorida.

## 5 · 2-savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Tekshiruv · tuzatish (savol ustida yorliq yo'q)
- Savol: **Kitob almashish pitchida Raqamlar ✗ oldi: «son qayerdan?». Nima yozasiz?**
  - ✔ A — Raqamlar: sonning manbasini aytaman
  - B — Raqamlar: sonni ikki barobar qilaman
  - C — Raqamlar: bo'lakni olib tashlayman
  - D — Raqamlar: keyin yaxshiroq qilib aytaman
- To'g'ri izohi: Tuzatish izohga javob beradi va nima o'zgarishini aytadi.
- Xato izohlari: B — Bu son o'ylab topilgan — izoh nimani so'radi? · C — Bo'lak qoladi — unda nima o'zgaradi? · D — «Yaxshiroq» — aniq nima o'zgaradi? ·
  (umumiy) Mentor «tasdiq» izohiga qanday tuzatish yozgan edi?
- Javob topilgach (kichik, savol ostida): kitob ilovasi ro'yxatidan bitta qator — «Raqamlar · sonning manbasini aytaman».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): uch distraktor uch turkumda (S-004): B — yangi son to'qish (1-dars qoidasi: sonlar o'zingizniki) · C — bo'lakni tashlash (4-ekran) · D — mavhum va'da (nima o'zgarishi yo'q). To'rttasi «Raqamlar: …» shaklida — prefiks kalit emas.
  Savol ekrandan ko'chirilmaydi (§106): Mentor misoli emas, boshqa izoh («son qayerdan?»). Bitta javob himoyalanadi: izoh manbani so'ragan, A manbani aytadi. To'g'ri variant izohning so'zini takrorlamaydi («qayerdan» → «manba» — S-008).

## 6 · Guruhda pitch  ← QMustaqil (guruh + yakka rejim; 3 qism ketma-ket; USTAXONA)
- Eyebrow: Guruhda ish · yakka rejimda: Mustaqil ish
- Sarlavha: **Pitchingizni guruhga 5 daqiqada ayta olasizmi?** (46) · yakka rejimda: **Pitchingizni 5 daqiqada ayta olasizmi?** (38)
- Rejim (qism yorliqlaridan oldin, bir marta; ikki tugma, har birining o'z chegarasi): «Guruh tinglaydi» · «Guruh yo'q — o'zim». Jonli darsda oldindan «Guruh tinglaydi» tanlangan, mustaqil rejimda — «Guruh yo'q — o'zim»; o'quvchi almashtira oladi. Tanlov — `tur`.
- Qism yorliqlari (ot-shakl, T-073; joriysi accent, bajarilgani ✓): 1 Pitch · 2 Varaq · 3 Hakam savoli
- **Chapda — Sahna** (`GuruhVaraqSahna` «o'z» holati): guruh (yakka rejimda — bitta qiyofa va telefon belgisi «yozilmoqda») · taymer chizig'i (olti bo'lak) · gapiruvchi pufagida — o'quvchi bo'lagining boshi (`pm-m12d1-pitch`; uzun matn «…» bilan, karta cho'zilmaydi — SABOQ 29).
  Muammo bo'lagi ostida kulrang qator (`pm-m12d2-hikoya.lahza` bo'lsa): Hikoyangiz: «{lahza}». Kalit yo'q yoki bo'lak `null` — bo'lak nomi va kulrang «yozilmagan».
  **O'ngda — joriy qism** (bitta katta karta) · ostida — varaq ixcham (2-qismdan).
- **1-qism · Pitch:**
  - Mentor (guruh): Navbatingiz kelganda «5 daqiqani boshlash»ni bosing; tugatgach — «To'xtatish».
  - Mentor (yakka): Telefoningizda yozishni yoqing, so'ng «5 daqiqani boshlash»ni bosing; tugatgach — «To'xtatish».
  - «Pitchdan oldin» — bitta kulrang blok, uch qator (bosilmaydi, katakchasiz — 12-Modul naqshi):
    Guruh — 3 kishi (4 ham mumkin): navbat bilan bittangiz aytasiz, qolganlar tinglaydi. · Yechimda jonli demoni qurilmangizda ko'rsating; ochilmasa — og'zaki aytib bering. · Tinglovchilar pitch tugaguncha yozmaydi — varaq keyin to'ldiriladi: u guruhning bitta umumiy yozuvi, alohida odamlarning ovozi emas (05-FILTR 2). · Boshqa oynalarni yoping — varaqdan boshqa shaxsiy narsa ekranda bo'lmasin (05-FILTR 9).
    Yakka rejimda uchinchi qator o'rnida: Yozuv — video yoki ovoz; u telefoningizda qoladi, hech qayerga yuklanmaydi.
  - Taymer (12-Modul naqshi, o'quvchining o'z dars qurilmasida): 5 daqiqani boshlash · Hozir siz gapirasiz · m:ss · To'xtatish · Qaytadan. 5:00 dan keyin taymer to'xtamaydi — qizil «+m:ss». Taymer yurganda Sahnada joriy bo'lak (vaqt bo'yicha) accent.
  - Keyingi bosiladigan joy: «5 daqiqani boshlash» → «To'xtatish».
- **2-qism · Varaq** (bittadan karta — E 53: «{bo'lak} · N / 6»):
  - Mentor (guruh): Pitch tugagach, varaq ekrani ochiq holda qurilmangizni guruhga uzating: ular har bo'lakka birga ✓ yoki ✗ qo'yadi.
  - Mentor (yakka): Yozuvni bir marta ko'ring va har bo'lakka o'zingiz ✓ yoki ✗ qo'ying.
  - Guruh rejimida birinchi karta — tasdiq (tinglovchi o'zi bosadi; 13-Modul 6-dars naqshi): kulrang qator «Qurilmani tinglovchilar oldi.» · tugma «Biz tingladik — varaqni to'ldiramiz». Yakka rejimda o'rnida — tugma «Yozuvni ko'rdim».
  - Bo'lak kartasi: sarlavha — bo'lak nomi; ostida hakam savoli (`HAKAM_SAVOL`, kulrang) va savol «Bo'lak shu savolga javob berdimi?»; ikki tugma «✓» · «✗» (har birining o'z chegarasi); izoh maydoni (yorliq input ichida — E 43: raqam belgisi + placeholder `Nima yetishmadi?`; ✗ da majburiy, ✓ da ixtiyoriy) · «Keyingi bo'lak» o'ngda (187).
    Kartadagi doimiy kulrang qator (guruh rejimida): Belgini guruh birga tanlaydi; fikrlar farq qilsa — muhokama qiling, tushunarsiz qolgan joyni izohda yozing. (05-FILTR 1: «har xil = ✗» emas)
  - 6/6 dan keyin varaq ostida «Vaqt: m:ss» (taymerdan; `vaqt` ga yoziladi). Vaqt 5:00 dan oshgan bo'lsa — `QIzoh`: Vaqt 5 daqiqadan oshdi — bu alohida topilma: uyda qaysi bo'lak qisqarishini belgilaysiz. (05-FILTR 16: tuzatish slotini yemaydi)
- **3-qism · Hakam savoli:**
  - Mentor (guruh): Guruh hakam o'rnida bitta savol yozsin — pitchdan keyin ularda qolgan savol.
  - Mentor (yakka): Hakam o'rnida o'zingizga bitta savol yozing — pitchdan keyin sizda qolgan savol.
  (05-FILTR 22, 23: «pitchda javobi yo'q savol» emas — javob tushunarsiz qolgan savol ham sig'adi; Mentor misolidagi «tasdiq — to'lovmi?» shunday.)
  - Maydon (≤ 120; yorliq input ichida: belgi «?» + placeholder `Hakam yana nima so'raydi?`) · «Saqlash» o'ngda · kulrang qator: Bitta savol — bo'lak yoki mahsulot haqida, odam haqida emas; ism va shaxsiy ma'lumot yozilmaydi.
- Tekshiruv (`QXato`, ≤ 60; maydon ostida; «yo'naltiradi» — ikkinchi bosish bilan o'tadi, «bloklaydi» — o'tmaydi):
  - belgi tanlanmagan (bloklaydi): Bu bo'lakka ✓ yoki ✗ qo'ying.
  - ✗ da izoh 8 belgidan qisqa (bloklaydi): ✗ qo'ydingiz — nima yetishmaganini yozing.
  - izohda «yomon», «zerikarli», «yoqmadi» (yo'naltiradi; 12-Modul `BAHO_RE`): Odam haqida emas — bo'lakda nima yetishmadi?
  - oltita ✓ (yo'naltiradi; 6/6 da bir marta): Hammasi ✓ — qaysi bo'lak yanada aniqroq bo'lishi mumkin?
  - izoh yoki hakam savolida «+998», «@», «t.me/» yoki telefon shakli — 9 raqam (bloklaydi): Varaqqa telefon va akkaunt nomi yozilmaydi.
  - hakam savoli bo'sh (bloklaydi): Bitta hakam savolini yozing.
  - hakam savolida «investitsiya», «ulush», «summa» (yo'naltiradi — kurs chegarasi eslatmasi, taqiq emas): Bu kursda summa so'ralmaydi — savolni summasiz yozing.
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — tugmani yana bosing.
- **Harakat → Vizual o'zgarish:** «5 daqiqani boshlash» → taymer chizig'i to'lib boradi, joriy bo'lak accent (5:00 dan keyin qizil davom etadi); «To'xtatish» → «Vaqt» yoziladi, 2-qism yoqiladi ·
  bo'lak kartasida ✓ yoki ✗ → belgi kartadan varaqdagi o'sha qatorga uchadi (✓ — yashil, ✗ — `err`), izoh qatorga sirg'aladi, taymer chizig'idagi o'sha bo'lak chet rangini oladi; keyingi bo'lak kartasi kiradi ·
  «Saqlash» (3-qism) → savol varaqning pastki qatoriga uchadi (~1 s yashil); karta yopiladi, varaq butun enga. Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
- Xulosa (holatdan, P-046):
  - guruh: Guruh varag'i to'ldi: belgilar, izohlar va bitta hakam savoli.
  - yakka: Varaqni o'zingiz to'ldirdingiz — bu yakka rejimdagi varaq.
- Saqlash: `pm-m12d5-varaq` — `tur`, `varaq` (6), `hakamSavoli`, `vaqt` (taymer soniyasi), `tuzatishlar: []`, `savedAt` (A-12; 3-qism «Saqlash»da).
- Tugma (pastki): Uch qismni bajaring (N/3) → Davom etish (jonli darsda majburiy — `optionalLive` yo'q; 05-FILTR 28).
- Keyingi bosiladigan joy: rejim tugmasi (birinchi kirishda) → «5 daqiqani boshlash» → «To'xtatish» → tasdiq tugmasi → har kartada «✓» / «✗» (to'lqin) → izoh maydoni (✗ da) → «Keyingi bo'lak» → hakam savoli maydoni → «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Varaqim · n/6» (ixcham); 7-ekranda «Tuzatishlarim · n/3»; test, arena, podium va yakunda yo'q (E 50).
- Nishon: **Pitch Round!** (taymer to'xtatilgan va varaq bilan hakam savoli saqlangan — guruh yoki yakka; bonus, ish qilingan ekranda — P-048).
- Mentor rejimi: proyektorda katta taymer 5:00 va olti bo'lakli chiziq (navbat raqami bilan: «1-navbat» … «4-navbat»); Mentor hammaga bir vaqtda boshlatadi. Mentor statistikasi: «Pitchni aytdi» · «Varaq saqlandi» (son) — belgi, izoh va hakam savoli Mentor ekraniga ham, proyektorga ham chiqmaydi (TAQIQLAR 3).
- O'qituvchi eslatmasi: Avval ≈ 2 daqiqa — bitta ko'ngilli guruhda tinglovchi bo'lsin, siz varaqning bitta kartasini birga to'ldirib ko'rsating (izoh — bo'lak haqida). Keyin taymerni sinf bo'ylab birga boshlating: avval hamma guruhda 1-navbat, keyin 2-navbat va hokazo; varaqqa 2–3 daqiqa. Guruh — 3 kishi (12 o'quvchi — 4 guruh); vaqt yetmasa — tuzatishlar uyga, pitchlar emas (05-FILTR 27).
  Guruhga bo'linishdan oldin hamma mahsulotini bir marta ochib ko'rsin — birinchi yuklanish taymer vaqtini yemasin (05-FILTR 29). Ekranda `.env`, parol va boshqa odamlarning ma'lumoti ochiq qolmasin — guruh ko'radi.
  Tinglovchi bo'lak haqida yozadi, odam haqida emas; masxara qilinsa — to'xtating. Kimning varag'ida nechta ✗ borligini so'ramang va sanamang. Guruh oldida aytishni istamagan o'quvchi — yakka rejimda: yozib oladi, varaqni o'zi to'ldiradi.
✎ Guruh naqshi — 12-Modul 12-dars 11-ekran (taymer, varaq, yakka rejim) va 13-Modul 6-dars 7-ekran (tasdiq tugmasini sherik o'zi bosadi). Varaq bittadan karta (E 53) — 12-Moduldagi bir yo'la jadval o'rniga. Bitta varaq — gapiruvchining qurilmasida, guruh birga to'ldiradi (TAYANCHGA SAVOL 4).

## 7 · Tuzatishlaringiz  ← QMustaqil (USTAXONA — bittadan karta, 3 band; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · tuzatishlar ro'yxati
- Sarlavha: **Varaqingizdan uchta tuzatish yozing.** (36)
- Mentor: Har kartadagi izohni o'qing va shu bo'lakda nima o'zgarishini bir gapda yozing.
- Kirish (P-046): 6-ekrandagi varaq (`pm-m12d5-varaq.varaq`, `hakamSavoli`). Varaq saqlanmagan bo'lsa — karta o'rnida kulrang: Tuzatishlar varaqdan chiqadi — avval pitchni aytib, varaqni to'ldiring. (tugma «Orqaga»; «Davom etish» ochiq — `optionalLive`, yakun 4-holat).
- **Chapda — varaq ixcham** (o'quvchiniki: ✗ qatorlar `err` chet, «Hakam savoli» qatori, «Vaqt»; ro'yxatga tushgan qator yonida kulrang «ro'yxatda»). **O'ngda — bitta katta karta (joriy band «N / 3»)** · **pastda** — «Tuzatishlar ro'yxati · n / 3».
- Kartalar tartibi (oldindan qo'yiladi, o'quvchi o'zgartira oladi — A-4 qoidasi): ✗ qatorlar (varaq tartibida) → hakam savoli → kerak bo'lsa ✓ qatordan biri.
  - ✗ uchtadan ko'p bo'lsa — birinchi karta oldidan bitta tanlov: «Eng muhim uchtasini tanlang» (✗ qatorlar, har birining o'z chegarasi); kulrang: Qolgan ✗ lar — uyga vazifada.
  - Karta tepasida manba qatori: «✗ · {bo'lak} · «{izoh}»» yoki «Hakam savoli · «{hakamSavoli}»» yoki «✓ · {bo'lak} · yanada aniqroq».
  - Hakam savoli va ✓ kartasida — bo'lak tanlovi: olti bo'lak nomi (ixcham tugmalar, har birining o'z chegarasi); kulrang (hakam savoli kartasida): Bu savolga qaysi bo'lak javob berishi kerak? · (✓ kartasida): Qaysi bo'lakni yanada aniqroq qilasiz? · ✗ kartasida bo'lak qo'yilgan (tugmasi joriy).
  - Maydon (≤ 120; yorliq input ichida — E 43: raqam belgisi «1» / «2» / «3» + placeholder `Bu bo'lakda nima o'zgaradi?`) · tugmalar bir qatorda: «Saqlash» · o'ngda «Yordam».
  Kartalar ustida bir marta kulrang qator: Uch bandning hammasi xato degani emas: biri savolga javob, biri bo'lakni yanada aniq qilish bo'lishi mumkin. (05-FILTR 3)
- Tekshiruv (`QXato`, ≤ 60; maydon ostida):
  - maydon bo'sh (bloklaydi): Bu bo'lakda nima o'zgarishini yozing.
  - bo'lak tanlanmagan (bloklaydi): Avval bo'lakni tanlang.
  - bir bo'lak ikkinchi marta (yo'naltiradi): Bu bo'lak ro'yxatda bor — boshqasini tanlaysizmi?
  - «tez orada», «albatta», «yetamiz», «aniq bo'ladi» (yo'naltiradi; 12-Modul `VADA_RE`): Bu va'da — bo'lakda aynan nima o'zgaradi?
  - faqat «yaxshiroq», «chiroyliroq», «yaxshilayman» va 30 belgidan qisqa (yo'naltiradi): Nima o'zgaradi — gapni yoki sonni aniq yozing.
  - «bo'lakni olib tashla-» (yo'naltiradi): Bo'lak qoladi — unda nima o'zgaradi?
  - «+998», «@», «t.me/» yoki telefon shakli (bloklaydi): Tuzatishga telefon va akkaunt nomi yozilmaydi.
  - Yorliq (yo'naltiruvchi xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing.
- Yordam (bosilsa ochiladi; Mentor misolidan — A-6 aynan): Mentor misolida: Bozor — «60 kim ekanini aytaman: mahalla futbol guruhi a'zolari» · Raqamlar — «Tasdiq nima ekanini aytaman: yozma javob, pul emas» · Keyingi qadam — «Ular to'lovchi emas — faqat tanishtirish so'rayman».
  Har tuzatish izohga yoki savolga javob beradi. Yangi son to'qimang — faqat manbasi bor son; bilmasangiz «hali tekshirilmagan» deb yozing.
- **Harakat → Vizual o'zgarish:** bo'lak tugmasi → varaqdagi o'sha qator accent bilan yonadi; «Saqlash» → karta kichrayib ro'yxatdagi navbatdagi qatorga uchadi («{bo'lak} · {nima}», ~1 s yashil), varaqdagi manba qator yonida «ro'yxatda»; keyingi karta kiradi.
  3/3 da karta yopiladi, ro'yxat butun enga — har bandda ✎ (bosilsa o'sha band katta karta bo'lib ochiladi — SABOQ 29). Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
- Xulosa (o'quvchi ma'lumotidan, P-046; faqat 3/3 da): Tuzatishlar ro'yxatingiz tayyor: uch bo'lak va har birida nima o'zgaradi.
- Saqlash: `pm-m12d5-varaq.tuzatishlar` — har «Saqlash» bitta band `{ bolak, nima, manba: 'x' | 'savol' | 'aniqroq' }` (A-12; manba — karta turidan o'zi yoziladi); `savedAt`.
- Tugma (pastki): Uch bandni yozing (N/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: (✗ > 3 da) tanlov → bo'lak tugmalari (hakam savoli va ✓ kartasida) → maydon (accent, to'lqin) → «Saqlash» (maydon yozilgach halqada).
- Nishon: **Three Fixes!** (3/3 saqlanganda).
- Mentor rejimi: forma o'rniga Mentor misolining varag'i va tuzatishlar ro'yxati (A-6). Mentor statistikasi: «Uch tuzatish yozdi» (son).
- O'qituvchi eslatmasi: ≈ 10 daqiqa. Eng ko'p xato — «yaxshiroq aytaman» kabi mavhum gap: «Bo'lakda aynan qaysi gap yoki son o'zgaradi?» deb so'rang. ✗ olgan bo'lakni olib tashlash yoki yangi son qo'shish — tuzatish emas.
  Tuzatishlarni o'quvchi o'zi tanlaydi; siz «shu bo'lakni tuzating» demaysiz. Bugun bo'laklar qayta yozilmaydi — uyga vazifa ①.

## 8 · Yakuniy savol  ← QTest (✔ D, `correctIdx 3`; ikki qoida birga — ✗ va izoh tuzatishga aylanadi, fidbek yashirilmaydi; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q)
- Savol: **Guruh Raqamlar bo'lagingizga ✗ qo'ydi. Endi nima qilasiz?**
  - A — Tinglovchini ko'ndirib, belgini almashtiraman
  - B — Bo'lakdagi belgini o'chirib, saqlab qo'yaman
  - C — Boshqa guruhga aytib, yangi belgi olaman
  - ✔ D — Izohni o'qib, shu bo'lakka tuzatish yozaman
- To'g'ri izohi: Izoh qaysi joyni tuzatishni aytadi — u ro'yxatga yoziladi.
- Xato izohlari: A — Tinglovchi nimani tushunmadi? Izohda yozilgan. · B — Belgi o'chsa ham, kamchilik qoladi. · C — Bu guruh nimani ko'rsatdi — izohni o'qing. ·
  (umumiy) Mentor ✗ olgan bo'laklar bilan nima qildi?
- Javob topilgach (kichik): varaqdagi Raqamlar ✗ qatori ro'yxatdagi bo'sh qatorga uchadi — «Raqamlar · …» (uch nuqta — o'quvchi o'zi yozadi).
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): uch distraktor uch turkumda (sinf 8): A — tinglovchini ko'ndirish (fidbekka qarshi bahs) · B — yashirish (belgini o'chirish) · C — boshqa tinglovchi qidirish (fidbekdan qochish). To'rttasi bir shaklda («…-ib, …-aman»); «belgi» A, B, C da, «bo'lak» B va D da — kalit so'z faqat to'g'rida emas; savoldagi «Raqamlar» variantlarda takrorlanmaydi (S-008).
  A hayotda rost bo'lib qolmasin: «tushuntirib, so'rash» emas — «ko'ndirib, belgini almashtirish» (belgi tinglovchiniki). Savol 3-ekran (tinglovchi roli) va 5-ekran (tuzatish matni) dan boshqa — gapiruvchi roli (S-008).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 5, 8); 2, 4-ekranlar — ballsiz, 4-ekranda nishon; 6, 7-ekranlar «Saqlash» — Mentorga signal (`PRACTICE_BASE`, ball yo'q). Pitchlar solishtirilmaydi — podium faqat test ballari (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Izoh nima haqida» · 5 — «2 — Aniq tuzatish» · 8 — «Yakuniy — ✗ olganda nima qilasiz»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi (qolip; o'zgartirilmaydi)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi ikki holatda; sarlavha o'quvchi qilgan ishni aytadi; ustunlik tartibi — yuqoridan):
  - `tur: 'guruh'`, varaq saqlangan, tuzatishlar 3: **Guruh varag'i olindi, uchta tuzatish yozildi.** (45)
  - `tur: 'yakka'`, varaq saqlangan, tuzatishlar 3: **Varaqni o'zingiz to'ldirdingiz, uchta tuzatish yozildi.** (55)
  - varaq saqlangan, tuzatishlar 0–2: **Varaq tayyor — tuzatishlar ro'yxati hali tugamagan.** (51)
  - varaq saqlanmagan: **Varaq hali to'ldirilmagan — pitch va ro'yxat qoldi.** (51)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; 1-qator — 2-ekran xulosasi, 3-qator — ta'rif, T-042):
  - Bu darsda varaqda har bo'lakka ✓ yoki ✗, ✗ yonida izoh va oxirida bitta hakam savoli turadi.
  - Izoh bo'lak haqida: unda nima yetishmagani yoziladi, odam haqida emas.
  - Tuzatishlar ro'yxati — uch band: qaysi bo'lak va unda nima o'zgaradi.
  - Tuzatish izohga yoki savolga javob beradi: to'qilgan son va va'da qo'shilmaydi — faqat manbasi bor son.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z pitchingiz · Nechta: ikki ish · Muddat: keyingi darsgacha
  - ① Uch tuzatishni pitchingizga kiriting: har bandda aytilgan bo'lakni qayta yozing; vaqt 5 daqiqadan oshgan bo'lsa — qaysi bo'lak qisqarishini ham belgilang.
  - ② Pitchni taymer bilan bir marta ovoz chiqarib ayting — xohlasangiz tanish odamga, bo'lmasa o'zingiz telefonga yozib.
  - ③ Darsda qolgan ishni tugating: {holatga qarab — tuzatishlar ro'yxatini uchtaga yetkazing · qolgan ✗ larni ham ro'yxat ostiga yozing · (yakka rejimni o'zingiz tanlagan bo'lsangiz) pitchni telefonga yozib, varaqni o'zingiz to'ldiring}. Hammasi tugagan bo'lsa ③ ko'rinmaydi.
  - Karta ostida (bitta kulrang qator): Yozuv telefoningizda qoladi — hech qayerga yuklanmaydi; tinglovchining ismi yozilmaydi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Demoga tayyorgarlik: risklar va B reja»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada keyingi darslar aytilmaydi (T-038). «Nechta: ikki ish» — ① va ②; ③ faqat qolgan ish bo'lsa (sinf 14). ② — tanish odam ixtiyoriy («xohlasangiz» — 05-FILTR 30), bo'lmasa telefon; tanish odam ismi hech qayerga yozilmaydi; «sinov» so'zi yo'q.
  Yakun sarlavhalari kalitdan yig'iladi: `tur`, `varaq` (saqlangan-saqlanmagan), `tuzatishlar.length` (P-046). Ikkinchi sarlavha yakka rejimni rost aytadi (tayanch 1.5).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤ 48 belgi)
- **Part, Not Person!** (3-ekran, 1-savol birinchi urinishda) — Izohni bo'lak haqida yozishni tanladingiz
- **Fix Finder!** (4-ekran, uch karta birinchi urinishda) — Mentor varag'idan uch aniq tuzatishni topdingiz
- **Pitch Round!** (6-ekran, taymer to'xtatilib, varaq va hakam savoli saqlanganda — bonus) — Pitchni taymer bilan aytdingiz, varaq saqlandi
- **Three Fixes!** (7-ekran, 3/3 saqlanganda) — Varaqingizdan uchta tuzatish yozdingiz
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Pitch Round!, ish qilingan ekranda — P-048); guruh va yakka rejimda bir xil (tavsif varaqni kim to'ldirganini aytmaydi). 2-ekran (tugmali tushuncha), 5-ekran va yakuniy savol nishonsiz. Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10 — 0).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Izoh nima haqida** — 1 ✗ yonidagi izoh bo'lak haqida yoziladi. · 2 Unda nima yetishmagani aytiladi: kim, son yoki manba. · 3 Odam haqidagi gap va «qiziq emas» kabi fikr — izoh emas.
  — Sinfga savol: Mentor pitchiga yozilgan ikki izoh nima haqida edi?
- **5 · Aniq tuzatish** — 1 Tuzatish izohga javob beradi. · 2 Unda qaysi bo'lak va nima o'zgarishi yoziladi. · 3 To'qilgan son va va'da qo'shilmaydi, bo'lak olib tashlanmaydi.
  — Sinfga savol: «Keyingi safar yaxshiroq aytaman» — bunda nima yetishmaydi?
- **8 · ✗ olgan bo'lak** — 1 ✗ va izoh — tuzatish uchun material. · 2 Izohni o'qib, shu bo'lakka tuzatish yoziladi. · 3 Belgi o'chirilmaydi, tinglovchi ko'ndirilmaydi.
  — Sinfga savol: ✗ olganingizda birinchi nima qilasiz?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bu darsda varaqda nima yoziladi? | Har bo'lakka ✓ yoki ✗, ✗ yonida izoh va oxirida bitta hakam savoli | 12-Moduldagi baholash varag'i — bugun olti qator |
| Varaq qachon to'ldiriladi? | Pitch oxirigacha aytilgandan keyin | Pitch davomida tinglovchilar jim |
| ✗ yonidagi izoh nima haqida bo'ladi? | Bo'lak haqida: unda nima yetishmagani | Odam haqida gap yo'q |
| Hakam savoli nima? | Tinglovchi pitchdan keyin hakam o'rnida yozgan bitta savol | Pitchdan keyin tinglovchida qolgan savol |
| Guruhda fikrlar har xil bo'lsa, belgi qanday qo'yiladi? | Muhokama qilib, bitta belgi — tushunarsiz joy izohda | Varaq — guruhning bitta umumiy yozuvi |
| Mentor misolida guruh qaysi bo'laklarga ✗ qo'ydi? | Bozor va Raqamlar | Izohlar: «60 kishi kim — o'yinchimi, guruhmi?» va «tasdiq — to'lovmi?» |
| Tuzatishlar ro'yxati nima? | Uch band: qaysi bo'lak va unda nima o'zgaradi | Bugun bo'laklar qayta yozilmaydi |
| ✗ ikkita bo'lsa, uchinchi band qayerdan olinadi? | Hakam savolidan | Unga qaysi bo'lak javob berishi kerakligini tanlaysiz |
| Hammasi ✓ bo'lsa, tuzatish qayerdan olinadi? | Hakam savolidan va yanada aniqroq bo'ladigan bo'lakdan | Yo'q kamchilik o'ylab topilmaydi |
| Tuzatishda nima yoziladi? | Bo'lakda aynan qaysi gap yoki son o'zgarishi | To'qilgan son va va'da qo'shilmaydi — faqat manbasi bor son |
| Mentor «tasdiq — to'lovmi?» izohiga qanday tuzatish yozdi? | Tasdiq nima ekanini aytaman: yozma javob, pul emas | Gapda «to'lov emas» bor edi — tinglovchida savol qolgan |
| Guruh bo'lmasa, varaqni kim to'ldiradi? | O'zingiz: pitchni telefonga yozib, bir marta ko'rib | Yozuv telefonda qoladi |
- §145: har javobdagi so'z darsda bor (varaq, ✓/✗, izoh, hakam savoli, «pitchdan keyin» — 2 · Bozor va Raqamlar, «tasdiq» — 2, 4 · tuzatishlar ro'yxati, uch band, hakam savolidan, «yangi son va va'da» — 4 · «guruh birga tanlaydi», yakka rejim, telefon — 6 · «yanada aniqroq» — 7).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). Inkor-savol yo'q (S-006).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md05/olchov.py` (pastda «O'lchov»).
1. Bu darsda varaq qachon to'ldiriladi? (2, 6)
   - ✔ Pitch oxirigacha aytilgandan keyin
   - Har bo'lak aytilayotgan paytda
   - Pitch boshlanishidan ancha oldin
   - Faqat uyda, dars tugaganidan keyin
2. Mentor misolida guruh qaysi bo'laklarga ✗ qo'ydi? (2)
   - Muammo va Yechim
   - ✔ Bozor va Raqamlar
   - Jamoa va Raqamlar
   - Muammo va Bozor
3. Mentor tuzatishida «60 kishi» kimlar? (4)
   - Ilovadagi hamma tashkilotchilar
   - Mahalladagi hamma maydon egalari
   - ✔ Mahalla futbol guruhi a'zolari
   - Mentorning hamma sinfdoshlari
4. Guruh rejimida hakam savolini kim yozadi? (2, 6)
   - Pitch aytgan o'quvchining o'zi
   - Mentor, dars boshlanishidan oldin
   - Agent, pitch matnini o'qib chiqib
   - ✔ Tinglovchilar, pitchdan keyin
5. Guruhda fikrlar har xil bo'lsa, varaqda nima bo'ladi? (6)
   - ✔ Muhokamadan keyin bitta belgi
   - Ko'pchilik qo'yadigan ✓ belgisi
   - Qator hech qanday belgisiz qoladi
   - Ikkala belgi ham yonma-yon turadi
6. Mentor varag'ida ikkita ✗. Uchinchi tuzatish qayerdan olindi? (4)
   - Sinfdagi ovozlar sonidan
   - ✔ Guruhning hakam savolidan
   - Mentorning o'z taxminidan
   - Pitchning umumiy vaqtidan
7. Bu darsda tuzatish qanday yoziladi? (4, 7)
   - Faqat bo'lakning nomi bilan
   - Pitchdagi hamma gaplar bilan
   - ✔ Bo'lak va unda nima o'zgarishi
   - Tinglovchining ismi bilan birga
8. Mentor «tasdiq — to'lovmi?» izohiga qanday tuzatish yozdi? (4)
   - Tasdiqlarni pitchdan olib tashlash
   - "Pro'ni sotib oldi" deb aytish
   - Tasdiqlar sonini oshirib aytish
   - ✔ Tasdiq nima ekanini tushuntirish
9. Qaysi izoh bo'lak haqida yozilgan? (3)
   - ✔ «Yechimda nima qilishi aytilmadi»
   - «Siz juda hayajonlanib gapirdingiz»
   - «Umuman olganda menga yoqmadi»
   - «Mening pitchim yaxshiroq chiqdi»
10. Guruh bo'lmasa, varaqni kim to'ldiradi? (6)
    - Mentor, darsdan keyin o'zi
    - ✔ O'zingiz, yozuvni ko'rib
    - Varaqsiz qoladi — kerak emas
    - Agent, pitch matnini o'qib
11. Yakka rejimda pitch yozuvi qayerda qoladi? (6)
    - Sinfning chatiga yuboriladi
    - Mentorga havolasi yuboriladi
    - ✔ Faqat telefoningizda qoladi
    - Guruh kanaliga joylanadi
12. Hakam «Nega maydon egalari pul to'lamaydi?» desa, Mentor nima deydi? (4)
    - «Ular ham keyin to'lab beradi»
    - «Bu savolning pitchga aloqasi yo'q»
    - «Maydon egalari bizga kerak emas»
    - ✔ «Ular bugun to'lovchi emas»
- Arena yozuvlari — platforma shabloni (namuna 12-Modul YAKUNIY dagidek).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — pitch, bo'lak, varaq, izoh, hakam, savol, guruh, tinglovchi, tuzatish, taymer · uyga vazifa banneri — pitch, tuzatish, taymer, varaq (faqat so'z, emojisiz).
- Izoh (MD): 2 — boshqa juftlar Mentor varag'ida ✓ olgan bo'laklar (tayanch 1.5) · 3 — tashkilotchi (Bozordagi 6), maydon egasi (Keyingi qadam), sinfdosh (Raqamlar) — darsdagi boshqa odamlar, A-6 · 4 — guruh rejimida gapiruvchi o'zi yozmaydi (yakka rejimda — o'zi; savol «guruh rejimida» bilan himoyalangan) ·
  5 — «ko'pchilik» — muhokamasiz ovoz berish, «belgisiz», «ikkala» — darsdagi qoidaga zid (6-ekran kulrang qatori: muhokama, bitta belgi, izoh) · 6 — ovoz, taxmin, vaqt — Mentor varag'ida yo'q narsalar · 7 — tuzatish shakli (A-4) · 8 — 4-ekrandagi noto'g'ri yo'llar · 9 — odam haqida, umumiy fikr, solishtirish (TAQIQLAR 3) ·
  10 — yakka rejim (tayanch 1.5) · 11 — TAQIQLAR 1 (yozuv yuklanmaydi) · 12 — 13-Modul tayanchi 1.2 faktidan; «keyin to'laydi» — va'da, «aloqasi yo'q» — savoldan qochish, «kerak emas» — Keyingi qadamdagi so'rovga zid («bilmayman, tekshirib aytaman» kabi halol javob variantlarga olinmadi — u hayotda to'g'ri).

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmPitchTrainingLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META` `pm-m12d5-v1` · «Guruh pitchingizda nimani tuzatishni aytadi?».
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2, s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18) · s3, s5, s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s6, s7 `QMustaqil` · s9 `QNatija` · s10 `QKartochka` · s11 `QYakun`.
2. **`GuruhVaraqSahna`** — bitta vizual (180), dars ichida yoziladi (K-020; 12-Modul `BeshDaqiqaSahna` va 01 `OltiBolakSahna` dan ko'chirilmaydi): `rejim: 'kirish' | 'skelet' | 'tinglash' | 'ixcham' | 'oz'` ·
   guruh (4 qiyofa — D 36, ismsiz; yorliqlar «gapiradi» / «tinglaydi» / «siz»; pufaklar) · telefon (`JamoaTelefon` ≈ 90×146 — faqat Mentor misolida, Yechimda «8 / 10» → «9 / 10») · taymer chizig'i (`VAQT = [40, 30, 90, 60, 30, 50]`, `JAMI = 300`, `+m:ss`; «savol-javob» bo'lagi yo'q — 05-FILTR 25) ·
   varaq (jadval E 45: 6 qator + «Hakam savoli» + «Vaqt»; belgilar `ok`/`err`; «ro'yxatda» yorlig'i) · ro'yxat (3 qator «bo'lak · nima»). `reduced-motion`; 393 da varaq guruh ostida; qolip-maket izohi faylda (`// qolip-maket: …`).
3. **Bitta manbalar (P-063):** `BOLAK_ID = ['muammo', 'bozor', 'yechim', 'raqamlar', 'jamoa', 'keyingi']` · `BOLAK_NOM` (uz/ru — 01 bilan bir) · `JAMOA_PITCH` (tayanch 1.1 aynan; `birinchi` — har bo'lakning birinchi gapi — pufak uchun) · `HAKAM_SAVOL` (tayanch 9.3 aynan; 01 bilan bir) ·
   `MENTOR_VARAQ` (tayanch 1.5 aynan: `[{ bolak, belgi, izoh }]` × 6) · `MENTOR_HAKAM_SAVOL` · `MENTOR_TUZATISH` (A-6, 3 band) · `TUZATISH_KARTA` (4-ekran: 3 × `{ manba, bolak, variantlar[3], togri, xato[3] }`; to'g'ri variant matni = `MENTOR_TUZATISH[i].nima`) · `PITCHDAN_OLDIN` (3 qator + yakka varianti).
4. s0: `QKirish` — javoblar «Aynan!» / «Qiziq fikr!», ballsiz (`correct: false` hammaga — J-026); tanlovga qarab chiziqda nomsiz bo'lak halqasi yoki pufaklar «…».
5. s2: `QBashorat` (bitta · ikkita · uchta) → 3 tugma (Pitch — tezlashtirilgan taymer ≈ 6 s + pufak + telefon · Varaq — `MENTOR_VARAQ` navbat bilan, ✗ da chiziq `err` va gapdagi so'z accent · Hakam savoli — pastki qator); har tugmadan keyin `QIzoh`; natija va `QIzoh` — yashil xulosa qutisi ichida (E 42); 40 s ipucha.
6. s4: `TUZATISH_KARTA` ketma-ket (E 53); variant tugmalari (E 40); to'g'ri — ro'yxatga uchish; xato — silkinish + `QXato`; 3-kartada Keyingi qadam qatori va gapdagi «maydon egalari» accent; nishon `fixFinder` (xato 0); oxirida `QIzoh` (tuzatishlar ro'yxati ta'rifi). Bashorat yo'q (A — 4-ekran izohi).
7. s6: rejim (`guruh` | `yakka`) · 3 qism (12-Modul `Screen11` taymer naqshi: `boshla` / `toxtat` / `qayta`, `+m:ss`, vaqt bo'yicha joriy bo'lak) · tasdiq tugmasi (guruh — «Biz tingladik — varaqni to'ldiramiz», yakka — «Yozuvni ko'rdim») ·
   varaq bittadan karta (6; ✓/✗ + izoh; «Keyingi bo'lak») · hakam savoli maydoni · tekshiruv funksiyasi: belgisiz · ✗ izoh < 8 · `BAHO_RE` (12-Modul 1601 aynan) · oltita ✓ · telefon/akkaunt shakli (13-Modul 6-dars qoidasi: «+998», «@», «t.me/», 9 raqam) · hakam savoli bo'sh · `PUL_RE` (`investitsiya|ulush|summa`) ·
   o'qiydi `pm-m12d1-pitch.bolaklar` va `pm-m12d2-hikoya.lahza` (yo'q bo'lsa — A-12 holatlari); saqlash — 3-qism «Saqlash»; nishon `pitchRound`; artefakt-strip «Varaqim».
8. s7: kirish — `pm-m12d5-varaq` (varaq yo'q — kulrang qator va `optionalLive`); kartalar tartibi (✗ → hakam savoli → ✓; ✗ > 3 da tanlov); bo'lak tanlovi; maydon; tekshiruv: bo'sh · bo'lak tanlanmagan · takror bo'lak · `VADA_RE` (12-Modul 1600 aynan) · mavhum («yaxshiroq|chiroyliroq|yaxshilayman», < 30) ·
   «bo'lakni olib tashla» · telefon/akkaunt; har «Saqlash» bitta band qo'shadi; Yordam — `MENTOR_TUZATISH`; ✎ tahrirlash; nishon `threeFixes`; artefakt-strip «Tuzatishlarim».
   Tekshiruv funksiyalari — PM-108 tartibida kamida 12 namuna bilan `node` da sinaladi (apostrof `normT` bilan — 12-Modul naqshi): «zerikarli edi» → baho · «Jamoa bo'lagida kim nima qilgani yo'q» → o'tadi · «90 123 45 67» → bloklanadi · «Qancha investitsiya kerak?» → yo'naltiradi · «Nega maydon egalari bunga pul to'lamaydi?» → o'tadi · «yaxshiroq aytaman» → mavhum · «tez orada 100 ta bo'ladi» → va'da va boshqalar.
9. **Saqlash** `localStorage` `pm-m12d5-varaq` = `{ tur: 'guruh' | 'yakka', varaq: [{ bolak, belgi: '✓' | '✗' | null, izoh }] (6), hakamSavoli: string | null, tuzatishlar: [{ bolak, nima, manba }] (0–3), vaqt: n | null, savedAt }` — tayanch 8 + 9.24; maydonlar shartnomasi — A-12.
   s6 — `tur`, `varaq`, `hakamSavoli`, `vaqt`, `tuzatishlar: []`; s7 — `tuzatishlar` (birlashtiriladi; `manba` karta turidan). `pm-m12d1-pitch` ga va boshqa darsning kalitiga yozmaydi (sinf 3). Ism, telefon, yozuv fayli, havola hech qaysi maydonga yozilmaydi.
10. **App.jsx** (asosiy seans; bu agent tegmaydi): `m12-05` qatoriga `comp: PmPitchTrainingLesson` + import. `sub` o'zgarmaydi (reja yorlig'i so'zma-so'z).
11. Testlar s3/s5/s8 — `correctIdx` 2/0/3 = `INLINE_KEYS`; `RECAPS` 3/5/8 (`ic` → 1/2/3); `Q_LABELS`. Savol ustida yorliq yo'q (SABOQ 6). Kichik vizual — `QuestionScreen` `vizual`, javob topilgach (SABOQ 4). Arena `QUIZ_BANK` 12, ✔ A3 B3 C3 D3 (`set_quiz_keys` avto).
12. Jonli ball: `INLINE_KEYS` = { s3: 2, s5: 0, s8: 3, varaq: -1, tuzatish: -1, guruh: -1, royxat: -1, practice: -1 }; `SCREEN_META` == screens; `SCREEN_INTENTS`. Mentor statistikasi — faqat «Pitchni aytdi» · «Varaq saqlandi» · «Uch tuzatish yozdi» (son); belgi va matnlar Mentor ekraniga chiqmaydi.
13. `ACHIEVEMENTS` 4 (`partNotPerson`, `fixFinder`, `pitchRound`, `threeFixes`) · `FLASHCARDS` 12 · s11 `RECAP` 4 band = yakundagi «Endi siz bilasiz» so'zma-so'z · «Bugungi asosiy fikr» — yakunda yo'q (E 50) ·
    yakun sarlavhasi — `tur`, varaq va `tuzatishlar.length` dan (4 holat) · `HW_TOKENS` — faqat so'z · yordam darajalari (P-033: qulf-yorliq · ipucha 40 s · rescue 110 s).
14. Uyga vazifa — `HwCard` («Kim uchun · Nechta · Muddat», ① ② + shartli ③); alohida `.homework.jsx` yo'q.
- Darvozalar: `npm run gates -- src/12-Modull/PmPitchTrainingLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` qolip 0 · `lint:til` 0 · `lint:jsx` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30).
  ⚠️ CSS izohida va kod namunasi ichida backtik yo'q (CLAUDE.md); qo'shtirnoqli gaplar (`"Doimiy o'yin"`, `"3 tashkilotchi …"`) — JS satrida ekranlanadi.

## REPO
Amaliy blok yo'q (PM darsi, kod ekrani yo'q) — o'quvchi repo'siga ham, `maydon-jamoa` ga ham tegilmaydi. «Ortda qoldingizmi» bu darsda yo'q (tayanch 3: birinchi amaliy blokda — 3-dars).

| Teg | Holat |
|---|---|
| `m14-dars-05-start` | = `m14-dars-04-done` (sayqal: bosish javobi, joy egallovchi, qo'shilish animatsiyasi) |
| `m14-dars-05-done` | = `m14-dars-04-done` (tayanch 3 jadvali) |

## Manbalar (o'zim tekshirgan fayl va qatorlar, 08.10.2026; o'quvchiga ko'rinmaydi)
- `feedback/F-1008-14modul/00-MODUL-TAYANCH.md` 1.0, 1.1 (Mentor pitchi), 1.2 (hikoya), **1.5 (guruh, varaq, Mentor varag'i, yakka rejim)**, 1.14, 2, 3, 4, 7, 8 (`pm-m12d5-varaq` sxemasi), **9.1–9.4, 9.12–9.14** · `00-TAQIQLAR.md` · `00-NOMLAR.md` (5, 6-qator) · `00-MANBA.md` 1 (dastur 5-qator: «Guruh oldida pitch — qattiq fidbek» · «Tuzatishlar ro'yxati»), 4, 6.
- `MD_AGENT_TOPSHIRIQ.md`, `MD_TOPSHIRIQ_2.md` (5-qator, saboq 1–6, 5-band eslatmasi) · pilotlar `01-PmInvestorPitch-v3.md` (A-3…A-6, `HAKAM_SAVOL`, `JAMOA_PITCH`, 11-ekran), `07-PmDemoTest-v3.md` (tuzilish), `01/03/07-OZ-AUDIT.md`.
- `src/App.jsx` 470–472 (`m12-04`, `m12-05` nomi va osti, `m12-06`) — grep 08.10.
- `src/10-Modull/PmGrowthPitchLesson.jsx` 1599–1601 (`TEXNO_RE`, `VADA_RE`, `BAHO_RE`), 1813–1900 (juftlik ekrani: taymer, `BaholashVaragi`, `VX` xabarlari, `varaqTur`) · 12-Modul `12-PmGrowthPitch-v3.md` 11-ekran, `12-FILTR.md` 31, 32 · 12-Modul tayanchi 116 (mahalla futbol guruhi — Telegram guruhi, 60 kishi).
- 13-Modul tayanchi 1.2 (B2B — «"Maydon Jamoa" bugun maydon egasiga xizmat qilmaydi, muammo gapida yo'q»), 2 (tasdiq ta'rifi), 7 · 13-Modul `06-PmMoneyTalk-v3.md` 7-ekran va `06-FILTR.md` 4 (sherik o'zi bosadigan tugma), 7 (telefon shakli tekshiruvi).
- 10-Modul `11-PmPitchRehearsal-v3.md` 35 (fidbek, qattiq, lekin hurmatli fidbek), 210–236 (fidbek gaplarini varaqqa joylash — bugun takrorlanmaydi).
- `MATN_KORPUS.md` 1–720 (taqlid-manba) · `konveyer/1-MD.md` · `konveyer/QURISH_KARTASI.md` · `src/qolip/QOLIP.md` · `QURUVCHI_SABOQ.md` E 40–55.
- Render (Backend uyg'onishi, O'qituvchi eslatmasida) — tayanch 6 (render.com/docs/free, 06.10). Boshqa tashqi (internet) fakt bu darsda yo'q: keys yo'q, xizmat nomi, narx, limit — tilga olinmaydi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Mentorning tuzatishlar ro'yxati (`MENTOR_TUZATISH`)** tayanchda yo'q, lekin 4-ekran va 7-ekran Yordami uchun kerak. Uchala band faqat bor faktdan: Bozor — «60 kim ekanini aytaman: mahalla futbol guruhi a'zolari» (12-Modul tayanchi 116) · Raqamlar — «Tasdiq nima ekanini aytaman: yozma javob, pul emas» (13-Modul tayanchi 2) ·
   Keyingi qadam — «Ular to'lovchi emas — faqat tanishtirish so'rayman» (13-Modul tayanchi 1.2 + tayanch 1.1 so'rovi; 05-FILTR 4 bilan qayta yozildi — 8-dars «tuzatilgan holat» (tayanch 1.1, M-q3 A) bilan mos). **Taklif:** tayanch 9 ga bitta manba sifatida — 8-dars («5-dars tuzatishlari qo'llanganmi») va 13-dars shundan oladi; tuzatilgan bo'lak gaplarini 8-dars agenti to'qimasin — tayanch yozsin.
2. **Uchinchi band qoidasi:** tayanch 1.5 «tuzatishlar … varaqdagi ✗ lardan» deydi, Mentor misolida esa ✗ ikkita. Qoidam: ✗ lar → hakam savoli (bo'lagini o'quvchi tanlaydi) → ✓ bo'lakdan biri «yanada aniqroq» (12-Modul naqshi); ✗ > 3 — eng muhim uchtasi, qolgani uyga vazifa ③. **Taklif:** 1.5 ga «✗ lardan va hakam savolidan» deb qo'shish.
3. **Hakam savolining bo'lagi:** `tuzatishlar[].bolak` — oltita id dan biri; hakam savoli uchun bo'lakni o'quvchi tanlaydi (Mentor misolida — Keyingi qadam: «maydon egalari» faqat shu bo'lakda). «savol-javob» alohida `bolak` qiymati sifatida qo'shilmadi (sxema o'zgarmasin).
4. **Varaqni kim to'ldiradi:** guruh rejimida — gapiruvchining qurilmasida **bitta varaq**, tinglovchilar birga (avval biri «Biz tingladik — varaqni to'ldiramiz» ni o'zi bosadi); fikr har xil bo'lsa — ✗ va nima yetishmagani (kamchilik yashirilmaydi). Tayanchda aniqlanmagan; → **05-FILTR 1, 2: «har xil = ✗» RAD — belgini guruh birga tanlaydi (konsensus), tushunarsiz joy izohda; o'quvchiga «varaq — guruhning bitta umumiy yozuvi» aytiladi (tayanch 9.51).** har tinglovchi alohida varaq to'ldirsa — kalit o'quvchiniki bo'lgani uchun ishlamaydi.
5. **`pm-m12d5-varaq` da `vaqt` yo'q:** taymer vaqti varaqda ko'rinadi («Vaqt: m:ss», 12-Modul naqshi), kalitga yozilmaydi. **Taklif:** `vaqt: n | null` (soniya) qo'shish — 8-dars 5:00 ga sig'ishni solishtirishi uchun. → **05-FILTR 14: QABUL — `vaqt` sxemada (tayanch 9.24 rejasi); `savedAt` → `completedAt` — RAD (kurs qolipi, 02-FILTR 18).** Mentor varag'ida «Vaqt» yo'q — haqiqiy vaqti tayanchda yo'q (to'qilmadi).
   Qo'shimcha aniqlik (sxemaga zid emas): saqlangan `belgi` — faqat `'✓'` / `'✗'`; `izoh` ✓ da `''` bo'lishi mumkin; `hakamSavoli: string | null`; `tuzatishlar` 0–3.
6. **«hakam savoli» ikki manbada:** varaq qatorlaridagi oltita (1-darsdagi `HAKAM_SAVOL`) va pastki qatordagi tinglovchi savoli. Ma'no bitta — hakam beradigan savol; ta'rif faqat ikkinchisiga: «Hakam savoli — tinglovchi pitchdan keyin hakam o'rnida yozgan bitta savol.» Kalit `hakamSavoli` — faqat tinglovchiniki. Tayanch 2 ga qator kerakmi?
7. **Mentor pitchining Muammo bo'lagi va 2-darsdagi hikoya:** tayanch 1.2 «Muammo bo'lagi lahza bilan boshlanadi», 9.2 esa «olti gap — 1.1 aynan». Men 1.1 aynan oldim (2-ekran pufagida lahza yo'q). O'quvchi Sahnasida esa Muammo ostida o'z lahzasi (`pm-m12d2-hikoya.lahza`) kulrang qator. 2, 8, 13-darslar bilan bir qaror kerak: Mentor pitchida lahza aytiladimi? → **05-FILTR TS7: 2-dars qarori (02 A-6, 02-FILTR): qoralama 1.1 aynan; aytilganda Muammo lahza bilan ochiladi — 2-ekran Mentor pufagida Muammo boshida avval lahza gapi, keyin Muammo gapi; 8, 13 shunga.**
8. **Mentor misolidagi guruh** — tinglovchilar soni aytilmaydi (o'quvchi matnida «guruh»); sahnada uch tinglovchi qiyofasi (3–4 kishilik guruh bilan mos). Tayanch 1.5 «Mentor pitchiga varaq» — kim to'ldirgani yozilmagan.
9. **Yakka rejim yozuvi:** «telefonga yozib oling (video yoki ovoz)» — 2-dars qoidasi bilan bir (video telefonda qoladi, T12). Ovoz ham ruxsat — yuz ko'rsatmaslik uchun. 2-dars agenti «faqat video» desa — bir xillash kerak.
10. **Taymer chizig'idagi «savol-javob» bo'lagi** (1-dars naqshi) — hakam savoli shu yerda ko'rinadi, lekin bugun javob berilmaydi (savol-javob mashqi — dastur bo'yicha keyinroq; o'quvchi matnida va'da qilinmaydi). Shu bo'lak 5-darsda kerakmi yoki faqat varaqda qolsinmi? → **05-FILTR 25: RAD — olib tashlandi; savol varaqda, «savol-javob» 8-darsda.**
11. **«guruh» ikki ma'noda (T-015):** darsdagi 3–4 kishilik guruh (dars nomida ham) va Mentor misolidagi «mahalla futbol guruhi» (Bozor gapi va tinglovchi izohi). Yechimim: futbol guruhi doim to'liq nomi bilan (olam matni); prozada «guruh» — faqat darsdagi guruh. Tayanch 2 ga eslatma sifatida.
12. **Hakam savolidagi pul so'zlari:** «investitsiya», «ulush», «summa» — yo'naltiradi (TAQIQLAR 1 ruhida); «pul» o'zi — o'tadi (Mentor misolidagi savolda ham bor). Real hakam pul haqida so'rashi mumkin — 8-dars savol-javob mashqida bunga halol javob («bu kursda pul so'ralmaydi — bitta so'rov») kerakmi?
13. **8-dars `pm-m12d5-varaq` ni o'qiganda** `tur: 'yakka'` varaqni boshqacha ko'rsatadimi (masalan, «varaqni o'zingiz to'ldirgansiz»)? Men yakunda farqni rost aytdim; 8-darsga ham shu kerak. → **05-FILTR 13: 08 MD ga yorliq qo'shildi (5-ekran kartalari, 7-ekran 1-savol).**

## Shubhali joylar (ishonchim komil emas)
- ⛔ **«Qur» darvozasi:** 6-ekran vaqti — 3 kishilik guruhda 3 × (5 + 2–3) ≈ 24 daqiqa + tashkil (auditor bahosi 35–45; butun dars 105–125 xavfi — 05-FILTR 26); 12–15 o'quvchi bilan taymer o'lchanmaguncha «sig'adi» deyilmaydi · qurilmani tinglovchilarga uzatish va bittadan karta bilan varaq — 2 daqiqaga sig'adimi · 4-ekrandagi uch karta 1280×800 da skrollsiz sig'ishi (varaq + karta + ro'yxat) ·
  6, 7-ekran tekshiruv funksiyalari — `node` da namuna bilan · bepul Backend uyg'onishi guruh pitchini to'xtatmasligi (O'qituvchi eslatmasi — pilotda ko'riladi).
- ~~Mentor tuzatishlari 3-band~~ — auditor ko'rdi: «Ular to'lovchi emas — faqat tanishtirish so'rayman» (05-FILTR 4).
- **«60 kim — mahalla futbol guruhi a'zolari»** — tinglovchining «o'yinchimi, guruhmi?» savoliga «guruh a'zolari» deb javob beradi; hammasi o'yinchimi — Mentor tekshirmagan (O'qituvchi eslatmasi). Bozor gapining o'zi ham «Mahalla futbol guruhida — 60 kishi» — tuzatish uni faqat aniqlashtiradi.
- **Raqamlar ✗** — Mentor gapida «bu hali to'lov emas» bor, tinglovchi baribir so'ragan (tayanch 1.5 aynan). Talqin — «tinglovchida savol qolgan» (05-FILTR 5; «tushunmagan» — ortiqcha xulosa).
- **«Sinab ko'rganlar», «sinayman»** — Mentor pitch gaplarida (tayanch 1.1 aynan, olam matni); MD_TOPSHIRIQ_2 «sinov so'zi o'quvchi matnida yo'q» — gaplarni o'zgartirmadim (9.2: olti gap aynan).
- **«guruh» ikki ma'no** (TAYANCHGA SAVOL 11) va tinglovchi izohidagi «guruhmi?» — o'quvchi «qaysi guruh?» deb so'rashi mumkin; 2-ekran O'qituvchi eslatmasi shuni ochadi.
- **Arena 4 va 10** — yakka rejimda o'quvchi o'zi yozadi/to'ldiradi; 4-savol «guruh rejimida» bilan himoyalangan, 10-savol — «Guruh bo'lmasa» bilan. Distraktor «Pitch aytgan o'quvchining o'zi» faqat guruh rejimida noto'g'ri.
- **8-ekran A** («Tinglovchini ko'ndirib, belgini almashtiraman») — hayotda tinglovchi noto'g'ri eshitgan bo'lishi mumkin; variant «ko'ndirib … almashtiraman» shakli bilan noto'g'ri qilindi (tushuntirish emas, belgini o'zgartirish). Auditor ko'rsin.
- **Izoh detektori** — «yoqmadi» halol izohda ham bo'lishi mumkin («Yechimdagi demo menga tushunarsiz, yoqmadi») — yo'naltiradi, bloklamaydi (12-Modul naqshi); soxta signal — qabul qildim.
- **4-ekranda bashorat yo'q** — boshqa tushuncha-ekranlarda bor; «n / 3» sanog'i javobni ochib qo'ygani uchun olib tashladim (P-036). Bashorat kerak bo'lsa — boshqa o'lchov topilishi kerak.

---

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7, 18 band)
1. [x] **90 daqiqa — reja** — A-11: taqsimot (≈ 85 + 5 zaxira), «Ulgurmagan o'quvchi yo'li» (6 — varaqqa 2 daqiqa, oxirgi navbat — uyda yakka; 7 — yozilgani saqlanadi; `optionalLive`), ⛔ pilotda taymer; «sig'adi» yo'q. Amaliy blok yo'q — blok darajasidagi «Ulgurmasangiz» tegishli emas.
2. [x] **Tekshirilmagan tashqi qadam** — darsda tashqi xizmat yo'q; Render uyg'onishi — tayanch 6 (rasmiy), faqat O'qituvchi eslatmasida; telefon yozish vositasi — umumiy so'z («telefoningizda yozishni yoqing»), menyu nomi yo'q; ⛔ «qur»: 6-ekran vaqti, uzatish (Shubhali joylar).
3. [x] **Saqlash kaliti — shartnoma** — `pm-m12d5-varaq` tayanch 8 aynan (A-12, KOD 9): har maydon ma'nosi va tipi, `tur` (guruh / yakka), `null` holatlari; boshqa dars kalitiga yozmaydi; o'qiydi `pm-m12d1-pitch`, `pm-m12d2-hikoya`; ism, telefon, yozuv fayli, havola yo'q; `vaqt` — TAYANCHGA SAVOL 5.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida» (2, 4, 7 Yordam, kartochka 6, 11), «Bu misolda» (4 xulosa), «Bu darsda» (2 xulosa, yakun 1, kartochka 1, 7); uch band qoidasi — «bu darsda» (A-4); olti bo'lak — 1-darsdagi qolip.
5. [x] **Kafolat va sabab da'vosi yo'q** — «tuzatildi» yo'q (bo'laklar bugun yozilmaydi; ro'yxat — reja); tuzatish variantlarida va'da («keyin to'laydi») — noto'g'ri yo'l (4); `VADA_RE` (7); «yozma tasdiq — pul emas» (4, kartochka 11, arena 8).
6. [x] **Yakun, nishon — faqat rost holatda** — 11-ekran 4 holat (varaq to'ldirilmagan holati bilan — E 54); ✓ va nishon — faqat birinchi ikki holatda; yakka rejim ikkinchi sarlavhada rost aytiladi; Pitch Round! tavsifi varaqni kim to'ldirganini da'vo qilmaydi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — varaq: olti qator, ✓/✗, izoh ≥ 8 belgi ✗ da, bitta hakam savoli (6-ekran aynan shunday); tuzatishlar ro'yxati — uch band, har biri «bo'lak · nima» (7-ekran aynan); «Vaqt» — taymerdan.
8. [x] **Test: bitta himoyalanadigan javob** — s3 (odam haqida · yashirish · bo'lak nomi bilan faqat fikr), s5 (yangi son · bo'lakni tashlash · mavhum va'da), s8 (ko'ndirish · yashirish · boshqa tinglovchi); har testda uch turkum; s8 A — «ko'ndirib … almashtiraman» shakli bilan hayotda rost bo'lib qolmaydi.
9. [x] **Real odamlar xavfsizligi** — fidbek bo'lak haqida (3, 6 `BAHO_RE`, yakun 2-qatori); tinglovchi va gapiruvchi ismsiz, telefon shakli bloklanadi (6, 7); reyting yo'q, Mentor ekraniga belgi va matn chiqmaydi (6, 9); yakka rejim majburlanmaydi, yozuv telefonda (A-9, 6, yakun); hakamlar ismsiz, gapi to'qilmagan — Mentor misolidagi savol tayanch 1.5 aynan.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent ishlamaydi, tekshiruv akkaunti yo'q; varaqni guruh to'ldiradi, tuzatishni o'quvchi o'zi yozadi (A-10).
11. [x] **Web-trek teng yo'l** — matn ikkala trekka bir xil («mahsulot», «pitchingiz»); jonli demo — «qurilmangizda», ochilmasa og'zaki (6 «Pitchdan oldin»); testlar ikkala trekka to'g'ri; trek kaliti o'qilmaydi (A-14).
12. [x] **Mentor misoli ichki izchil** — Mentor pitchi 1-dars bilan bir manba (`JAMOA_PITCH`, 9.2); varaq va hakam savoli 1.5 aynan; tuzatilgan bo'lak gaplari bu darsda yo'q (8-dars natijasi oldindan ochilmaydi); grafik yo'q (9.14).
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — 7-ekranda tuzatishni o'quvchi yozadi, bo'lakni o'zi tanlaydi; Mentor tuzatishlari faqat Yordam'da «Mentor misolida»; O'qituvchi eslatmasi: «siz "shu bo'lakni tuzating" demaysiz».
14. [x] **Uyga vazifa yengil va aniq** — ikki ish (① uch bo'lakni qayta yozish, ② bir marta taymer bilan aytish) + shartli ③; ixtiyoriy narsa majburiydek aytilmaydi (② — tanish odam yoki telefon).
15. [x] **Ayb da'vosi yo'q** — xato izohlari va `QXato` aniq keyingi qadamni aytadi («izohni o'qing», «nima o'zgaradi — aniq yozing»); «sizning xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — «keyin to'laydi» (4), «keyingi safar yaxshiroq» (5) — va'da distraktor sifatida; `VADA_RE` (7); Demo Day, savol-javob mashqi, keyingi darslar — o'quvchi matnida yo'q (faqat «Keyingi dars» qatori).
17. [x] **Pul va investitsiya** — summa, ulush, «investitsiya kerak» yo'q; hakam savolida `PUL_RE` yo'naltiradi (6); Pro — test rejimda (Mentor gapi); «tasdiq — pul emas» (4, kartochka 11, arena 8).
18. [—] **Yosh va rasmiy shartlar** — bu darsda xalqaro sayt va dastur yo'q; yosh tilga olinmaydi.
+ **RAD etilganlar saqlangan:** hookdagi «Aynan!» / «Qiziq fikr!» (0) · «Keyingi dars — «…»» qatori (11) · reja sarlavhasi — natija-gap (1) · ≤ 3 blok (har ekran) · bank so'zi — keys yo'q.
+ **SABOQ E:** variant chegarasi (0, 4, 6 tugmalari) · maket kesilmaydi (⛔ 4-ekran sig'ishi) · taxmin qatori yashil xulosa ichida (2) · yorliq input ichida (6 izoh, hakam savoli; 7 maydon) · bittadan karta (6 varaq, 7 tuzatishlar, 4 kartalar) · jadval «ma'lumot» (varaq — E 45) · yakun standart, «Bugungi asosiy fikr» yo'q (11).

## O'lchov (`scratchpad/m14/md05/olchov.py` natijasi — jadval skript chiqishidan, 08.10.2026; to'liq chiqish `md05/olchov-natija.txt`)
| Nima | Soni | Eng qisqa | Eng uzun | Chegara |
|---|---|---|---|---|
| Sarlavha (0, 1, 2, 4, 6 ×2, 7, 10, 11 ×4) | 12 | 25 | 55 | ≤55, bitta qator; qavsdagi sonlar haqiqiy uzunlik bilan bir xil (skript tekshirdi) |
| Hook javobi («Aynan!» · «Qiziq fikr!» ×2, so'z bilan birga) | 3 | 68 | 91 | ≤120 |
| Hook variantlari (0) | 3 | 32 | 34 | farq 6% |
| Mentor (interaktiv 0, 2, 4, 6 ×6, 7 va reja 1 — bittadan gap) | 11 | 67 | 98 | interaktivda 1 gap ✓ |
| Xulosa (2, 4, 6 ×2, 7) | 5 | 58 | 92 | ≤110 |
| Bugungi asosiy fikr (A-2; yakunda yo'q) | 1 | 107 | 107 | ≤110 |
| `QIzoh` qatorlari (2 ×3, 4, 6) | 5 | 69 | 77 | bitta qator (≤110) |
| To'g'ri izohi (3, 5, 8) | 3 | 52 | 58 | ≤60, «To'g'ri!» siz |
| Xato izohlari (3, 5, 8 — har biri uch + umumiy) | 12 | 34 | 51 | ≤60 |
| `QXato` va tekshiruv xabarlari (4 ×6, 6 ×8, 7 ×8) | 22 | 23 | 56 | ≤60 |
| Test variantlari — s3 (✔ C) | 4 | 36 | 42 | farq 14%; ✔ 39 — eng uzun emas |
| s5 (✔ A) | 4 | 34 | 39 | farq 13%; ✔ 35 — eng uzun emas |
| s8 (✔ D) | 4 | 40 | 45 | farq 11%; ✔ 43 — eng uzun emas |
| Test savollari (so'z) | 3 | 8 | 10 | ≤12 |
| 4-ekran kartalari (3 × 3 variant; ballsiz) | 9 | 46 | 55 | har kartada farq ≤11%; ✔ hech qayerda yolg'iz eng uzun emas |
| Arena 1–12 (variantlar) | 48 | 15 (2-savol) | 35 (9, 12-savol) | har savolda farq ≤14%; ✔ hech qayerda yolg'iz eng uzun emas |
| Arena savollari (so'z) | 12 | 5 | 10 | ≤12 |
| Nishon tavsiflari | 4 | 38 | 47 | ≤48 (§63) |
| Kartochkalar (old / orqa) | 12 | 18 / 15 | 58 / 66 | 10–12 karta ✓ |
| «Endi siz bilasiz» | 4 | 69 | 92 | 3–5 qator ✓ |

Arena ✔ taqsimoti: A — 1, 5, 9 · B — 2, 6, 10 · C — 3, 7, 11 · D — 4, 8, 12 (3/3/3/3). Ekran testlari: s3 C · s5 A · s8 D (uchalasi har xil o'rinda; ketma-ket emas — P-012).
Mentor gaplari «Bu…», «Hammasini…» bilan boshlanmaydi va sarlavhani takrorlamaydi (skript — birinchi so'zlar: Pitchingizni · Avval · Tugmalarni · Har · Navbatingiz · Telefoningizda · Pitch · Yozuvni · Guruh · Hakam; takror qo'lda tekshirildi, 2 va 6-ekran Mentori shu sababli qayta yozildi).
`vositalar/mdtekshir.py`: ekran 12/12 · arena A3 B3 C3 D3 · uzun sarlavha/xulosa yo'q · keyingi dars ✓ · taqiq naqshlari — faqat meta qatorlarda (A-5 «Ishlatilmaydi», 7-ekran detektor ro'yxati, KOD 8 namunalari, sinflar ro'yxati); o'quvchi matnida 0 (qatorma-qator ko'rildi).
`npm run -s lint:til -- feedback/F-1008-14modul/05-PmPitchTraining-v3.md` — **0 error, 0 warn** (birinchi yurishda 1 warn — `toladi-fe'l`, 2-ekran harakat qatori, tuzatildi).

## Qaror-0 tasdiqlangan joylar (GATE M `14M-GATE-1`, 08.10 — hammasi A; belgilar olib tashlandi) (MD dagi `<!-- TAXMIN Tn -->` — 47 qator, 51 belgi)
| Tn | Qaror-0 savoli (tavsiya A) | Soni | Qayerda |
|---|---|---|---|
| **T1** | Olti bo'lak, 5 daqiqa + savol-javob | 11 | A-1, A-3 (1-dars qatori), A-6, A-7 · ip (taymer chizig'i, «savol-javob» bo'lagi) · 0 (maket) · 1 (reja 03) · 2 (pitch tugmasi, hakam savoli tugmasi) · 6 (sarlavha, saqlash harakati) |
| **T2** | Bozorda faqat bor sonlar | 6 | A-6 (Mentor Bozor gapi, 1-band tuzatish) · 2 (Varaq tugmasi) · 4 (1-karta) · 7 (Yordam) · arena 3 |
| **T3** | Keyingi qadamda pul emas — aniq so'rov | 7 | A-6 (Keyingi qadam gapi, 3-band tuzatish) · A-9 (hakam savolidagi pul so'zlari) · 4 (3-karta) · 6 (`PUL_RE` xabari) · 7 (Yordam) · arena 12 |
| **T4** | Teglar `m14-dars-NN` (PM: `-done` = `-start`) | 1 | REPO |
| **T11** | 5-dars: guruh, varaq ✓/✗ + hakam savoli → 3 tuzatish | 13 | Tur qatori · A-1, A-4 (hakam savoli, tuzatishlar ro'yxati) · 1 (sarlavha) · 2 (`QIzoh` hakam savoli, xulosa) · 4 (`QIzoh`) · 6 (rejim) · 7 (sarlavha) · 11 (sarlavha 1, 2; «Endi siz bilasiz» 1) |
| **T12** | Video qoidasi (telefonda qoladi, yuklanmaydi) | 6 | sarlavha qismi (⚠️ xavfsizlik) · A-3 (2-dars), A-9 · 6 («Pitchdan oldin» yakka qatori) · 11 (uyga vazifa kulrang qatori) · arena 11 |
| **T18** | Keyslar (5-dars — keyssiz) | 2 | Tur qatori · A-8 |
| **T19** | Atamalar: hakam, savol-javob | 1 | A-3 (1-dars atamalari) |
| **T20** | Nomlar: «Guruh pitchingizda nimani tuzatishni aytadi?» · «Demoga tayyorgarlik: risklar va B reja» | 4 | MD sarlavhasi · Menyu qatori · 0 (sarlavha) · 11 («Keyingi dars») |
Javob boshqacha bo'lsa: T11 (B — 5 va 8 bitta naqsh) → 2, 4, 6, 7, 11 va kalit sxemasi qayta ko'riladi · T1 (B — besh bo'lak) → varaq qatorlari, taymer chizig'i, `JAMOA_PITCH`, arena 2 · T12 (B) → 6-ekran yakka rejimi va uyga vazifa · T3, T2 → Mentor tuzatishlari 1, 3 va arena 3, 12.

## GATE M — o'z tekshiruvim (`konveyer/1-MD.md`)
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 470 `m12-04` «Loyiha kuni: demo uchun sayqal» → 471 **`m12-05` «Guruh pitchingizda nimani tuzatishni aytadi?»** → 472 `m12-06` «Demoga tayyorgarlik: risklar va B reja» (yakun qatori). Hook sarlavhasi — dars nomi; reja yorlig'i — App.jsx osti so'zma-so'z.
- [x] Bitta misol-ip — «Maydon Jamoa» (Mentor pitchi 1.1, varaq 1.5 aynan, sonlar 1.14); metafora yo'q; bitta vizual — `GuruhVaraqSahna` (guruh · taymer chizig'i · baholash varag'i · tuzatishlar ro'yxati). Ikkinchi misol faqat testda (kitob almashish ilovasi — 3, 5; P-002). Keys yo'q.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2, 4 (QTushuncha) + 0, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q — har bosish taymer chizig'ini, varaq qatorini, ro'yxatni yoki pufakni o'zgartiradi.
- [x] O'lchov (skript): sarlavha ≤55 bitta qator · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 · to'g'ri izohi ≤60 — jadval yuqorida.
- [x] Atamalar oldingi darslar bilan bir xil: fidbek, qattiq, lekin hurmatli fidbek, baholash varag'i (10, 12-Modul) · olti bo'lak, hakam, hakam savollari, savol-javob, aniq so'rov (1-dars) · hikoya, lahza (2-dars) · yozma tasdiq, Pro, «Doimiy o'yin», test rejim (13-Modul).
  Yangi — «hakam savoli» (varaqning pastki qatori) va «tuzatishlar ro'yxati» — misoldan keyin (2, 4-ekran `QIzoh`). Siz-forma; tugmalar ot-shaklda yoki siz-formada («5 daqiqani boshlash», «To'xtatish», «Keyingi bo'lak», «Saqlash», «Yakunlash →»); tinglovchining «Biz tingladik — …» va Mentor pitch gaplari — olam matni (T-008).
- [x] Testlar: 4 variant, uzunlik teng (farq ≤14%), to'g'ri javob hech qayerda yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas (s3 «Jamoa», «bo'lak» · s5 «Raqamlar:» prefiksi to'rttasida · s8 «bo'lak», «belgi»); to'g'ri variant savol so'zini takrorlamaydi (s5 «qayerdan» → «manba», s8 «Raqamlar» variantlarda yo'q — S-008). Dars yangi — ✔ o'rni birinchi marta belgilanmoqda.
- [x] Final tartib-mashqi yo'q (yakuniy — `QTest`); `QTartib` bu darsda yo'q. 4-ekran kartalarida variant tartibi kodda qat'iy, Mentor to'g'ri javobni aytmaydi.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✗ ✕ › ✎ ⛶ — belgilar) · kafolat so'zlari («darrov», «darhol», «har doim», «100%», «albatta») — o'quvchi matnida 0; «albatta» — faqat 7-ekran detektor ro'yxatida (MD ichki).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-05`, «Modul 14», A1, «TAXMIN», «Q&A», «Demo Day» — yo'q). Keys yo'q. «KOD» ro'yxati 14 band, REPO — teglar jadvali (amaliy blok yo'q).
- [x] Karta T · P · S · PM: T-008 (Mentor pitch gaplari, tinglovchi izohlari va «Biz tingladik» — olam matni) · T-011/PM-030 (hakam savoli, tuzatishlar ro'yxati — misoldan keyin; sarlavhalarda yangi atama yo'q) · T-014/T-015 (A-5: guruh ikki joyda — futbol guruhi to'liq nomi bilan; izoh, belgi, so'rov, Jamoa — bir ma'noda) ·
  T-016 (metafora yo'q) · T-029/T-047 (Mentor bashorat yorlig'ini takrorlamaydi; ekranda ko'rinib turganini ta'riflamaydi) · T-035 (o'quvchi izohida → = yo'q) · T-038 (keyingi darslar, Demo Day, savol-javob mashqi — yo'q; faqat «Keyingi dars» qatori) · T-039 («pitchingiz» — 1-darsda yozilgan; saqlanmagan holat 6-ekranda) ·
  T-042 (ta'riflar so'zma-so'z: 2 xulosa = yakun 1 = kartochka 1; tuzatishlar ro'yxati — 4 `QIzoh` = yakun 3 = kartochka 7) · T-043 («Bu misolda», «Mentor misolida», «Bu darsda») · T-064 (2-ekran sarlavhasi 0-ekran savolining o'z so'zi bilan) · T-072 ·
  P-001 · P-002 · P-008 (≤3 blok har ekranda) · P-010 · P-012 (testlar 3, 5, 8) · P-013 · P-014/P-015 (reja — natija va'dasi; matnsiz skelet; yorliq App.jsx bilan so'zma-so'z) · P-016 · P-025 · P-033 · P-036 (0-ekranda bo'lak nomi yozilmaydi; 4-ekranda bashorat olib tashlandi) ·
  P-046 (6, 7 — o'quvchi ma'lumotidan; yakun — kalitdan) · P-048 · P-052 · P-062 · P-063 (`JAMOA_PITCH`, `HAKAM_SAVOL`, `MENTOR_VARAQ`, `MENTOR_TUZATISH`) · P-064 · P-067 · S-001 (savollar 8–10 so'z) · S-002/S-004/S-010 · S-006 (inkor-savol yo'q) · S-008 · S-015 (2-ekran bashorati bir o'lchovda) · S-019 · S-020 · S-026 · S-027 · §144/§145 ·
  PM-005 (2-tur) · PM-017 · PM-018 · PM-020 · PM-021 · PM-027 · PM-108 (6, 7-ekran tekshiruvi — `node` namunalari) · J-026 · SABOQ 1–31, D 36, E 40–55.
- [x] **Qaror-0 TAXMIN** — 47 qator, 51 belgi (yuqorida); T11 javobi bu darsning 2, 4, 6, 7, 11-ekranlariga va `pm-m12d5-varaq` sxemasiga to'g'ridan-to'g'ri tegadi.
