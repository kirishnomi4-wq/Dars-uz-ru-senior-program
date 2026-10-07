# 14-Modul (kod: `src/12-Modull`) · 13-dars (PM) «Demo Day'ga tayyormisiz?» — MD v3 <!-- TAXMIN T20 -->

Fayl: `src/12-Modull/PmDressRehearsalLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m12-13` · **12 ekran** (PM keyssiz — 12-Modul 11-dars shakli, tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
⚠️ **TAXMIN:** Qaror-0 javobi hali yo'q — `<!-- TAXMIN Tn -->` belgili qatorlar tavsiya (A) variantga tayanadi (ro'yxat — oxirida «TAXMIN belgilari»). Javob boshqacha bo'lsa, aynan shu qatorlar tuzatiladi.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p maydonli ish ketma-ket, bir vaqtda bitta katta karta (E 53) · yorliq input ichida (E 43) · telefon maketi o'lchami barqaror (≈170×272) ·
ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 4-ekran — **C** (`correctIdx 2`) · 8-ekran — **A** (`correctIdx 0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 478–480, grep 08.10, DE-205): `m12-12` «Keyingi olti oyda nima qilasiz?» → **`m12-13` «Demo Day'ga tayyormisiz?»** (osti: «hakamlar oldidan to'liq repetitsiya», `type: 'PM'`, `comp` hali yo'q) → `m12-14` «Zaxira dars: zalni tayyorlash» (`type: 'Rezerv'`, `comp` siz). <!-- TAXMIN T20 -->
Tur (PM-005): **2-tur sof PM** — artefakt: o'quvchining o'z chiqishi va unga to'ldirilgan **hakam varag'i** (real odam — Mentor, mehmon yoki guruhdagi tinglovchi — yoki yakka rejimda o'zi). Mustaqil ish majburiy (5, 6, 7-ekranlar). **Keyssiz** (tayanch 5). Kod ekrani yo'q. **REPO yo'q** (tayanch 3: `m14-dars-13-done` = `07-done`).
⚠️ **Halollik va xavfsizlik chegarasi (TAQIQLAR 0, 1, 3; tayanch 1.13) — har ekranga tegadi:** hakam, mehmon, tinglovchi — **ismsiz**, gapi o'ylab topilmaydi (hakam savollari — kurs savollari, `HAKAM_SAVOL`, tayanch 9.3) · hakam varag'ida izoh maydoni yo'q — faqat belgilar (baho-so'zlar «zerikarli», «yomon» kirmaydi) ·
**Mentor misolining to'liq repetitsiyasi va hakam varag'i to'qilmaydi** — ⛔ «qur» pilotida haqiqiy chiqishdan; MD da faqat Mentor **rejasi** (vaqt taqsimoti, demo stsenariysi, B reja) va belgilangan **mashq vaziyatlari** · sinfda kim kimdan yaxshi chiqqani sanalmaydi (podium — faqat test ballari) ·
investitsiya summasi yo'q (pitch bo'laklari matni bu darsda ko'rsatilmaydi) · «sinov» so'zi yo'q (guruh — «tinglovchi», «hakam»; T10). <!-- TAXMIN T10 -->
Vaqt: ≈ 90 daqiqa (taqsimot — A-11; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (1.0 · **1.13 — AYNAN** · 1.1 (olti bo'lak) · 1.6 (demo stsenariysi, B reja, demo joyi) · 1.8 (savol-javob qoidasi) · 1.14 · 2 (hakam varag'i, savol-javob, demo o'tishi) · 4 · 6 (Render) · 7 — 18 sinf · 8 — `pm-m12d13-repetitsiya` · **9.1–9.3, 9.6, 9.8, 9.9, 9.10, 9.13**) ·
`00-TAQIQLAR.md` (0–8) · `00-NOMLAR.md` (13, 14, 16-qatorlar) · `00-MANBA.md` (1 — dastur 13 va 16-qatorlar) · `qaror-0.json` (T1, T8–T12, T17, T19, T20) · `MD_AGENT_TOPSHIRIQ.md` · `MD_TOPSHIRIQ_2.md` (13-qator, eslatma 13, «Pilotlardan saboq») ·
pilotlar (tuzilish va saboqlar; matn ko'chirilmadi): `01-PmInvestorPitch-v3.md` (hakam, savol-javob, `HAKAM_SAVOL`) · `07-PmDemoTest-v3.md` (demo o'tishi, B reja, `DemoSahna`) · namunalar: 11-Modul `16-PmPrototypePitch-v3.md` + `16-FILTR.md` · 12-Modul `12-PmGrowthPitch-v3.md` (11-ekran — juftlikda pitch, `TaymerChiziq`, varaq) + `12-FILTR.md` · 12-Modul `11-PmPitchReview-v3.md` (PM 12 shakli).
⚠️ Modul raqami o'quvchi matnida — LMS raqami yoki dars raqami («6-darsda», «8-darsda»); kod raqami faqat fayl yo'lida. «Demo Day» o'quvchi matnida — **faqat shu darsda ruxsat** (tayanch 9.13: Demo Day formatidagi repetitsiya); Demo Day natijasi va'da qilinmaydi.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Darsning bitta natijasi** (dastur 13-qator — general repetitsiya: real hakamlar oldida to'liq o'tish, asl matni «Manbalar»da; tayanch 1.13, 4 — «to'liq o'tish + hakam varag'i»): <!-- TAXMIN T11 -->
   o'quvchi chiqishdan oldin to'rt narsani tekshiradi (5-ekran) → o'z chiqishini **Demo Day formatida** boshidan oxirigacha o'tadi: pitch 5:00 (jonli demo Yechim ichida) va savol-javob — 3 savol (6-ekran) → hakam (Mentor, mehmon yoki guruhdagi tinglovchi) **hakam varag'ini** to'ldiradi: vaqt · demo · har savolga javob (7-ekran). <!-- TAXMIN T1 --> <!-- TAXMIN T17 -->
   Saqlanadi `pm-m12d13-repetitsiya` (A-12; keyingi dars o'qimaydi — tayanch 8). Repo'ga yozilmaydi. Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab; ✓ — faqat birinchisida).
   Faqat shu A-bo'limda: Demo Day 8 — 16-qator (`comp` siz); bu dars uning tartibini takrorlaydi (T17). Ekranda Demo Day natijasi va keyingi qatorlar va'da qilinmaydi (T-038). <!-- TAXMIN T17 -->
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Pitch, demo va savollar birga faqat to'liq repetitsiyada ko'rinadi; hakam varag'i nimani tuzatishni aytadi. (107)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052; grep 08.10):**
   - 9–12-Modul: **pitch** · **zal** · **repetitsiya** («sahnadan oldin pitchni ovoz chiqarib aytib ko'rish» — 9-Modul) · **taymer** · **baholash varag'i** (har bo'lakka ✓/✗ va izoh — 10, 12-Modul; shu modulda 5-dars) · **fidbek** · **jonli demo** · **namuna akkaunt** (`namuna = true`, sanoqqa kirmaydi — 11, 12-Modul) · **ulanish belgisi** («Ulanmoqda…» — 12-Modul 2-darsi).
   - 1-dars (shu modul): **olti bo'lak** — Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam; jonli demo — Yechim ichida · **hakam** («Pitchni baholaydigan odam — investor yoki tadbirkor — hakam deyiladi.» — 1-darsda tug'ilgan, tayanch 9.12; bu darsda glosssiz) · **savol-javob** · hakam savollari (`HAKAM_SAVOL`). <!-- TAXMIN T1 --> <!-- TAXMIN T19 -->
   - 5-dars: **guruh** (3–4 kishi) va **yakka rejim** · baholash varag'i · fidbek bo'lak haqida, odam haqida emas (TAQIQLAR 3). <!-- TAXMIN T11 -->
   - 6, 7-darslar: **demo stsenariysi** · **demo o'tishi** · **B reja** (60 soniyalik ekran videosi) va **B reja gapi** · Backend'ni **uyg'otish** · demo holatini **boshiga qaytarish** (tayanch 9.10) · ikkinchi qurilma — telefon brauzeri (9.6). <!-- TAXMIN T8 --> <!-- TAXMIN T10 -->
   - 8-dars (08 MD): pitch taymer 5:00 bilan, jonli demo Yechim ichida, sherikka (juftlik yoki yakka) · «Keyingi bo'lak» tugmasi · savol-javob mashqi — 3 savol, har javob 1 daqiqagacha; javob son yoki fakt bilan, bilmasa — **«tekshirib aytaman»** (tayanch 1.8). Bugungi farq: guruh va hakam, to'xtamasdan, varaq — butun chiqishga. <!-- TAXMIN T11 -->
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **to'liq repetitsiya** (menyu ostidagi so'z; tayanch 1.13 «to'liq o'tish»): «Pitch, jonli demo va savol-javobni Demo Day'dagidek to'xtamasdan o'tish — to'liq repetitsiya deyiladi.» Tug'iladi 2-ekranda, 3-tugmadan keyin (`QIzoh`). Sarlavhalarda yo'q (T-011). <!-- TAXMIN T11 -->
   - **hakam varag'i** (tayanch 2 — 13-dars): «Butun chiqishga — vaqt, demo va savollarga javobga — belgi qo'yiladigan varaq hakam varag'i deyiladi.» Tug'iladi 3-ekranda, uch vaziyatdan keyin. 5-darsdagi baholash varag'idan farqi (T-052): u — har bo'lakka; bu — butun chiqishga (tayanch 1.13). <!-- TAXMIN T19 -->
   - **chiqish** (oddiy so'z, tayanch 9.13: «hakamlar oldida chiqish») — bitta o'quvchining pitchi va savol-javobi birga. **mehmon** — darsga taklif qilingan katta yoshli odam (hakam o'rnida; ismsiz; kimligi — tashkilotchi bilan, TAYANCHGA SAVOL 6).
   - **hakam varag'i belgilari** (bitta manba `VARAQ_BELGI`): vaqt — **«Sig'di»** (5:00 gacha) · **«Oshdi»**; demo — **«Ishladi»** · **«B reja»** · **«Ishlamadi»**; har savol — **«Son yoki fakt bilan»** · **«Tekshirib aytaman»** · **«Javob savolga tegmadi»** (1.8 qoidasidan).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«repetitsiya»** — bu darsda faqat «to'liq repetitsiya» (butun chiqish); «progon», «general repetitsiya», «generalka» — yo'q. **«demo o'tishi»** — chiqish ichidagi jonli demo (6, 7-dars ma'nosi; T10). <!-- TAXMIN T10 -->
   - **«chiqish»** — pitch va savol-javob birga; **«pitch»** — 5 daqiqalik qism; **«savol-javob»** — pitchdan keyingi qism. «Q&A», «intervyu» — yo'q.
   - **«hakam»** — chiqishga belgi qo'yadigan odam (bu darsda: Mentor, mehmon yoki tinglovchilardan biri); **«tinglovchi»** — guruhdagi qolganlar (5-dars so'zi). «jyuri», «komissiya», «sinovchi», «sinov» — yo'q.
   - **«mehmon»** — taklif qilingan katta yoshli odam; 12-Moduldagi «mehmon ko'rinishi» (kirmagan odamning ekrani) bu darsda ishlatilmaydi (T-015).
   - **«belgi»** — hakam varag'idagi tanlov (yuqoridagi uch guruh); «baho», «ball» — faqat test va podium uchun.
   - **«to'xtamasdan»** — taymer yurganda «Qaytadan» yo'q; demo ochilmasa — B reja yoki og'zaki aytish, taymer yuraveradi (bu mashqdagi qoida — TAYANCHGA SAVOL 8).
   - **«son»** — sanalgan miqdor; **«Raqamlar»** — faqat bo'lak nomi. **«so'rov»** — faqat Keyingi qadamdagi (bu darsda tilga olinmaydi); **«Yordam»** — faqat 5-ekrandagi tugma.
   - **Ishlatilmaydi:** progon, sinov (demo haqida), demo-test, Q&A, storytelling, performance, feature freeze, «stress», «baho» (varaq haqida), investitsiya (summa), «zo'r», A1/A2, `m12-13`, «Modul 14», keys, pilot, daftar.
6. **Mentor misoli (tayanch 1.6, 1.8, 1.13, 9.1, 9.3, 9.6, 9.9 — AYNAN; o'quvchi matnida «Mentor misolida», «Mentor rejasida»):**
   - **Demo Day 8 tartibi (T17; dastur — App.jsx 482 osti, `00-NOMLAR.md` 16):** hakamlar — 5–7 investor va tadbirkor; har o'quvchiga — 5 daqiqa pitch va savol-javob. **Bu darsdagi to'liq repetitsiya shu tartibda** (bu mashqda): pitch 5:00, jonli demo Yechim ichida → savol-javob, 3 savol, har javob 1 daqiqagacha → hakam varag'i. <!-- TAXMIN T17 --> <!-- TAXMIN T1 -->
     Demo Day'dagi savollar soni va savol-javob vaqti dasturda yozilmagan — o'quvchi matnida «bu mashqda 3 savol» (sinf 4).
   - **Pitch vaqti (9.1, `CHIQISH_VAQT`):** Muammo 40 · Bozor 30 · Yechim (jonli demo bilan) 90 · Raqamlar 60 · Jamoa 30 · Keyingi qadam 50 soniya = 5:00; savol-javob — 3 × 1 daqiqagacha. Butun chiqish — **8 daqiqagacha** (5 + 3; hisob, Mentorning natijasi emas — TAYANCHGA SAVOL 14). <!-- TAXMIN T1 -->
   - **Demo stsenariysi (1.6; `MENTOR_STSENARIY`, 5 qadam):** 1 Kirish · 2 «O'yinlar» (e'lon «Shanba, 18:00 · Mahalla maydoni · 8 / 10») · 3 O'yinga qo'shilish («Qo'shilaman») · 4 Ikkinchi telefonda son o'zgaradi («8 / 10» → «9 / 10») · 5 «Hozir ko'ryapti». Mentor rejasi — 60–90 soniya. <!-- TAXMIN T8 -->
   - **Demo joyi (1.6, 9.6):** laptopdagi brauzerda Mentor ilovasining brauzer ko'rinishi (`maydon-jamoa-….netlify.app`) proyektorga · telefon brauzeri — ikkinchi qurilma (ikkinchi o'yinchi), APK yoki Expo Go emas. <!-- TAXMIN T8 -->
   - **B reja (1.6, 9.9):** 60 soniyalik ekran videosi, laptopda. **B reja gapi** (Mentor misolida, aynan; `B_REJA_GAPI`): «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» <!-- TAXMIN T8 -->
   - **Chiqishdan oldin (1.13, `TAYYORLOV`, 4 karta):** Backend uyg'otildi · B reja video ochiladi · namuna akkaunt · telefon zaryadi. Mentor misolida (Yordam): Backend — Render bepul xizmati, bitta so'rov bilan uyg'onadi (15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa — tayanch 6) · video — laptopda · laptopda va telefonda — namuna akkauntlar · telefon — ikkinchi o'yinchi. <!-- TAXMIN T8 -->
   - **Hakam savollari (9.3; `HAKAM_SAVOL`, 7 ta — bitta manba, 1-dars bilan bir; kurs savollari, real hakam gapi emas):** Muammo — «Bu muammo borligini qayerdan bilasiz?» · Bozor — «Bu mahsulot yana qancha odamga kerak?» · Yechim — «Mahsulot nima qiladi?» ·
     Raqamlar — «Bu son qayerdan va nimani sanaydi?» · Jamoa — «Buni kim qilyapti?» · Keyingi qadam — «Endi nima qilasiz?» · `hozir` — «Odamlar hozir bu ishni nima bilan qiladi?» (tayanch 1.8). <!-- TAXMIN T19 -->
   - **Mashq vaziyatlari (3-ekran, `VAZIYAT`; Mentor chiqishining natijasi EMAS — kulrang yorliq «mashq vaziyati»; javob matnlari tayanch faktlaridan — TAYANCHGA SAVOL 15):**
     1. Demo — «Yechimda laptop «Ulanmoqda…» ko'rsatdi. B reja gapi aytildi, video oxirigacha ko'rsatildi.» → **B reja** <!-- TAXMIN T8 -->
     2. Bozor savoli — «Bu mahsulot yana qancha odamga kerak?» · javob: «Boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman.» → **Tekshirib aytaman** (1.1 Bozor gapidan) <!-- TAXMIN T2 -->
     3. Jamoa savoli — «Buni kim qilyapti?» · javob: «Ilovada o'yin e'loni, qo'shilish va eslatma bor.» → **Javob savolga tegmadi** (imkoniyatlar — 1.0 dan; fakt bor, savolga javob yo'q; 08 MD dagi Mentor javoblari bilan to'qnashmaydi)
   - **Mentor misolining to'liq repetitsiyasi (vaqt, demo belgisi, savollar) va hakam varag'i — ⛔ «qur» pilotida** (Mentor o'z chiqishini mehmon yoki boshqa o'qituvchi oldida o'tadi; natija qanday chiqsa — shunday yoziladi). MD da `{pilotda}`.
   - **Mentor pitchining matni** o'quvchi ekranida ko'rsatilmaydi — sahnada faqat bo'lak nomlari va vaqt. Mentor chiqishi («qur», Mentor rejimi) — **8-darsdagi yakuniy pitch** (9.2): Muammo, Yechim, Jamoa — tayanch 1.1 aynan; Bozor, Raqamlar, Keyingi qadam — 5-dars `MENTOR_TUZATISH` qo'llangan matn (08 MD TAYANCHGA SAVOL 3). Bitta manba `JAMOA_PITCH_FINAL` — 08 bilan umumiy (TAYANCHGA SAVOL 11). <!-- TAXMIN T1 -->
7. **Raqamlar (faqat tayanch va dastur):** 5:00 (300 soniya) · 40 · 30 · 90 · 60 · 30 · 50 soniya (9.1) · 3 savol, 1 daqiqagacha (1.8) · 8 daqiqagacha (hisob) · demo 60–90 soniya, B reja 60 soniya (1.14) · «8 / 10» → «9 / 10» · Render: 15 daqiqa, ≈1 daqiqa (tayanch 6) ·
   5–7 investor va tadbirkor (dastur; faqat O'qituvchi eslatmasida). Boshqa son yo'q: foydalanuvchi, tashkilotchi, tasdiq sonlari bu darsda aytilmaydi (sinf 12). Mentor chiqishining vaqti — ⛔ pilot.
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** kitob almashish ilovasi (4-ekran; 7-dars testi bilan bir olam). Metafora yo'q. Keys yo'q. Brend (Render, Netlify) — faqat 11–13-Modul so'zi bilan, Yordam va O'qituvchi eslatmasida.
9. **Xavfsizlik va halollik (TAQIQLAR 0, 1, 3; sinf 9):**
   - hakam, mehmon, tinglovchi — ismsiz; ism hech qaysi maydonga, kalitga, proyektorga yozilmaydi; mehmonning savoli («Boshqa savol») matni yozilmaydi;
   - hakam varag'ida izoh maydoni yo'q — faqat belgilar; og'zaki fikr — bo'lak haqida, odam haqida emas («zerikarli», «yomon» kabi baho-so'zlar yo'q — 7-ekran O'qituvchi eslatmasi);
   - kim kimdan tez o'tgani yoki kimning varag'i yaxshi chiqqani sanalmaydi va e'lon qilinmaydi; Mentor ro'yxatida — faqat signallar; proyektorga vaqt va belgilar chiqmaydi;
   - demo — namuna akkaunt bilan, real odamlar qo'shilmagan o'yinda (12-Modul 9.44 c); shaxsiy hisob ekranda zalga ko'rinmaydi (5-ekran 3-karta); laptopda `.env`, Neon va boshqa oynalar yopiq;
   - B reja video — laptopda, hech qayerga yuklanmaydi; uyda yozib olinsa — telefonda qoladi (T12); <!-- TAXMIN T12 -->
   - kafolat yo'q: «Demo Day'da ishlaydi», «tayyorsiz» deyilmaydi — natija faqat hakam varag'ida.
10. **Kim nima qiladi:** 5-ekran — o'quvchi o'zi (o'z laptopi va telefoni) · 6-ekran — gapiruvchi o'quvchi; taymer va savollar — hakam qo'lida (yakka rejimda — o'zi) · 7-ekran — belgilarni hakam qo'yadi, gapiruvchi o'zgartirmaydi. Agent bu darsda ishlamaydi; kod o'zgarmaydi (tayanch 1.0).
11. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · butun chiqish (2) ≈ 7 · hakam varag'i (3) ≈ 6 · 1-savol (4) ≈ 2 · chiqishdan oldin (5) ≈ 7 ·
    to'liq repetitsiya va varaq guruhda (6–7) ≈ 45 (3–4 kishilik guruhda har chiqish ≈ 8 daqiqa + varaq ≈ 2; 4 kishi ≈ 40, almashish ≈ 5) · yakuniy savol (8) ≈ 2 · podium, kartochkalar, arena, yakun (9–11) ≈ 12 · zaxira ≈ 4.
    **Ulgurmagan o'quvchi yo'li:** 6-ekranda «Navbatim kelmadi» (ikkinchi tugma) — 6, 7-ekranlar o'tkazib yuboriladi; to'liq repetitsiya — uyga vazifa ①; yakun sarlavhasi shuni rost aytadi (E 54) · varaq to'ldirilmasa — 7-ekranni keyin ham ochish mumkin; yakun «hali to'ldirilmagan».
    Vaqt qolsa — 1–2 ko'ngilli butun sinf oldida, Mentor va mehmon hakam (Mentor rejimi; 90 daqiqa hisobida yo'q).
12. **Saqlash kalitlari (tayanch 8; 2–13-darslar sxemasi aniqlashtiriladi — taklif TAYANCHGA SAVOL 1):**
    - **o'qiydi (faqat ko'rsatilgan maydonlar; maydon yo'q bo'lsa — pastdagi zaxira yo'l):** `pm-m12d8-final` — faqat `vaqt`, `savollar` (tayanch 8 maydonlari; 08 taklifidagi `tur`, `bolaklar` va `tuzatildi` o'qilmaydi) — `vaqt` (0-ekran maketi, 7-ekran 1-karta kulrang qatori) · `savollar[].savol` (6-ekran: «8-darsda bo'lgan» yorlig'i; TAYANCHGA SAVOL 4) <!-- TAXMIN T11 --> ·
      `pm-m12d6-demo` — `uygotish`, `video` (5-ekran 1, 2-karta), `stsenariy` (6-ekran Yechim ostidagi besh qadam), `otishVaqt` (0-ekran maketi, 6-ekran kulrang qatori) <!-- TAXMIN T9 --> ·
      `pm-m12d7-tekshiruv` — `urinishlar[].qayta`, `.buzildi`, `.tuzatishQilindi` (5-ekran ogohlantirishi — tayanch 8, 9.8: «13-dars o'qiydi»; jadval qatorida yo'q — TAYANCHGA SAVOL 3).
      Yo'q bo'lsa: 0-ekran — Mentor rejasi (yorliq «Mentor misoli») · 5-ekran — kulrang qatorlar ko'rinmaydi, tanlov o'quvchida · 6-ekran — Yechim ostida «jonli demo», 8-darsda bo'lgan savol belgilanmaydi. `pm-m12d1-pitch` — o'qilmaydi (TAYANCHGA SAVOL 3).
    - **yozadi:** `pm-m12d13-repetitsiya` = `{ vaqt: n | null, demo: 'ishladi' | 'b-reja' | 'ishlamadi' | null, savollar: n, varaq: [{ band, belgi }], tur: 'hakam' | 'guruh' | 'yakka', savedAt }` — tayanch 8 maydonlari aynan + `tur` va `vaqt | null` (TAYANCHGA SAVOL 1). Maydonlar shartnomasi:
      `vaqt` — **pitch** vaqti, soniya (6-ekran «To'xtatish»; savol-javobsiz); `null` — pitch o'tilmagan · `demo` — 7-ekran 2-karta · `savollar` — 6-ekranda berilgan savollar soni (0–3) ·
      `varaq` — hakam varag'ining qatorlari, tartib o'zgarmaydi: `{ band: 'vaqt', belgi: 'sigdi' | 'oshdi' }` (taymerdan o'zi; `vaqt` ≤ 300 → `sigdi`) · `{ band: 'demo', belgi: 'ishladi' | 'b-reja' | 'ishlamadi' | null }` (= `demo`) ·
      har savolga `{ band: 'savol:<id>', belgi: 'fakt' | 'tekshiraman' | 'tegmadi' | null }`, `<id>` — `HAKAM_SAVOL` kaliti (`muammo` · `bozor` · `yechim` · `raqamlar` · `jamoa` · `keyingi` · `hozir`) yoki `boshqa` (hakamning o'z savoli; matni yozilmaydi) ·
      `tur` — 6-ekran tanlovi: `hakam` (Mentor yoki mehmon) · `guruh` (guruhdagi tinglovchi) · `yakka` (o'zi — mashq) · `savedAt` — har saqlashda. 6-ekran `vaqt`, `savollar`, `tur` va varaq qatorlarini (`belgi: null`) yozadi; 7-ekran «Saqlash» belgilarni yozadi.
      Kalitga ism, hakam yoki mehmon ismi, savol matni, login yozilmaydi. Dars boshqa darsning kalitiga yozmaydi. 5-ekrandagi to'rt tanlov — dars holatida (`ccProgress`), kalitga emas (TAYANCHGA SAVOL 2).
13. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Belgi-formula (→, ×, =) o'quvchi izohida va test variantida yo'q — «8 / 10» → «9 / 10» harakat bilan ko'rinadi.
    «Maydon Jamoa» — laptop brauzeri va telefon maketida, o'z yashil rangida (11-Modul 9.62), logotipsiz. Hakam qiyofalari — chizilgan, real ko'rinishda, ismsiz (D 36). Rang — faqat holat foni (D3): «Sig'di», «Ishladi», «Son yoki fakt bilan» — `ok` · «B reja», «Tekshirib aytaman» — `accent` · «Oshdi», «Ishlamadi», «Javob savolga tegmadi» — `err`.
14. **Trek (sinf 11):** demo ikkala trekda laptop brauzerida (mobil trek — brauzer ko'rinishi, web-trek — sayt), ikkinchi qurilma — telefon brauzeri (9.6). O'quvchi matnida «mahsulotingiz», «demo yo'lingiz». Butun dars ikkala trekka bir xil. <!-- TAXMIN T8 -->

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.1, 1.5–1.8, 1.13):** 1-darsda olti bo'lakli pitch yozildi, 5-darsda guruh fidbek berdi, 6–7-darslarda demo tayyorlandi va buzib tekshirildi, 8-darsda pitch jonli demo bilan taymerda sherikka aytildi va savol-javob mashq qilindi. **Bugun — hammasi bitta chiqishda, to'xtamasdan, Demo Day formatida, hakam oldida.** <!-- TAXMIN T11 -->
- **Dars ipi:** 0 — pitch, demo va savol-javob birga qanday chiqishini qayerdan bilasiz? → 2 — Mentor chiqishi chiziqda yig'iladi: pitch 5:00, demo Yechim ichida, savol-javob, demo ochilmasa — B reja, taymer to'xtamaydi («to'liq repetitsiya») →
  3 — hakam butun chiqishga belgi qo'yadi: uch mashq vaziyati («hakam varag'i») → 4 — test: kitob ilovasida demo ochilmadi → 5 — chiqishdan oldin to'rt narsa → 6 — o'z chiqishi, guruhda, hakam bilan → 7 — hakam varag'i → 8 — yakuniy: vaqt oshdi, endi nima → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «Chiqish sahnasi» (`ChiqishSahna`, dars bo'yi; 163/180; bitta manba `CHIQISH_VAQT` + `MENTOR_STSENARIY` + `HAKAM_SAVOL` + `VARAQ_BELGI` + o'quvchi ma'lumoti `pm-m12d13-repetitsiya`):** <!-- TAXMIN T8 -->
  - **taymer chizig'i** (tepada, butun kenglikda; 12-Modul `TaymerChiziq` naqshi): olti bo'lak `[40, 30, 90, 60, 30, 50]` soniya, har biri ostida nomi; 5:00 dan keyin alohida **savol-javob** bo'lagi — uch katak (har biri 1:00 gacha); 5:00 dan oshsa — qizil davomi «+m:ss».
  - **laptop brauzeri** (pastda chapda; yorliq «laptop · proyektorga»): manzil satri `maydon-jamoa-….netlify.app`, «O'yinlar» / «O'yin» ekrani, «Qo'shilaman»; ulanish belgisi; B reja kadrida — video oynasi «60 soniya» (o'ynatish chizig'i).
  - **telefon** (pastda o'ngda, ≈170×272; yorliq «2-qurilma · telefon brauzeri»): «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10». «Maydon Jamoa» nomi o'z yashil rangida.
  - **hakamlar** (taymer ustida): uchta chizilgan qiyofa, real ko'rinishda, ismsiz; savol pufagi (`HAKAM_SAVOL`).
  - **hakam varag'i** (3, 7-ekranlarda — sahna o'rnida yoki o'ng ustunda): uch bo'lim — «Vaqt» (m:ss + belgi) · «Demo» (uch belgi) · «Savol-javob» (har savol qatori + uch belgi); sarlavha 3-ekran oxirigacha yozilmaydi.
  - Ishlatiladi: 0 (uch alohida karta + bo'sh uzuq chiziq) · 1 (matnsiz skelet o'zi yuradi) · 2 (to'liq sahna) · 3 (varaq) · 4, 8 (javobdan keyin kichik ko'rinish) · 6 (taymer va savol-javob bo'lagi) · 7 (varaq).
  - Son almashganda bir lahza kattalashib qaytadi; `prefers-reduced-motion` da yurish va miltillash yo'q — holatlar birdan almashadi (DE-200). 393 kenglikda telefon laptop ostiga tushadi, o'lchami barqaror; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → bo'lak taymerga, savol katakka, belgi varaq qatoriga uchadi · yangi qator ~1 s yashil yonadi · taymer chizig'i to'lib boradi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish
- Eyebrow: Kirish
- Sarlavha: **Demo Day'ga tayyormisiz?** (24) — dars nomi (DE-205) <!-- TAXMIN T20 -->
- Mentor: Pitch, demo va savol-javobni oldingi darslarda mashq qildingiz. Hakamlar oldidagidek hammasi birga qanday chiqishini qayerdan bilasiz? (134)
- Maket (chap; `ChiqishSahna` «kirish» holati): uchta alohida karta, oralarida bo'sh joy — «Pitch · 5:00» (`pm-m12d8-final.vaqt` bo'lsa ostida kulrang «8-darsda: {m:ss}») · «Demo o'tishi» (`pm-m12d6-demo.otishVaqt` bo'lsa — «6-darsda: {s} soniya») · «Savol-javob · 3 savol».
  Ostida — bo'sh uzuq chiziq (keyingi taymer joyi), o'rtasida «?»; tepada uchta hakam qiyofasi. Kalitlar bo'lmasa — Mentor rejasi (yorliq «Mentor misoli»: «Pitch · 5:00» · «Demo o'tishi · 60–90 soniya» · «Savol-javob · 3 savol»). <!-- TAXMIN T11 -->
- Variantlar (radio, o'ng; bir uzunlikda, bir shaklda — P-016):
  - Mashqlardagi vaqtlarni qo'shib chiqaman (39)
  - ✔ Hammasini bir marta birga o'tib ko'raman (40)
  - Demo Day kunining o'zida bilib olaman (37)
- Javob:
  - to'g'riga: **Aynan!** Qayerda qoqilishini faqat butun chiqishni bir marta to'xtamasdan o'tib bilasiz. (86)
  - «qo'shib»ga: **Qiziq fikr!** Qo'shish taxmin beradi, lekin demoga o'tish va savollar ham vaqt oladi. (83)
  - «Demo Day kuni»ga: **Qiziq fikr!** O'sha kuni bilsangiz, nimanidir tuzatishga vaqt qolmaydi. (69)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; uch karta uzuq chiziq tomon bir oz suriladi va to'xtaydi, «?» joyida qoladi — qanday birlashishi sahnada ochilmaydi (P-036); javob qatori chiqadi.
- Ballsiz (hook; jonli darsda sinf ovozlari chizig'i — har variant va ovozlar soni; ism yo'q). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Sinfdan so'rang: «Pitch, demo va savollarni hakam oldida, to'xtamasdan, bir marta o'tgan kim bor?» Qo'l ko'tartirmang — savol o'ylash uchun. Bugungi dars Demo Day formatida o'tadi; Demo Day 8 — menyuda 16-qator.
✎ Hook — o'quvchining o'z ishi (1, 5–8-darslardagi mashqlar) va o'z savoli (P-016). «Aynan!» / «Qiziq fikr!» — kurs qonuni (T-028, T-067). Payoff boshqa variantlarni yolg'onga chiqarmaydi: qo'shish — taxmin, Demo Day kuni — kech. Javob Mentor gapida aytilmaydi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun chiqishingizni hakamlar oldidagidek o'tasiz.** (50)
- Mentor: Guruhda bir-biringizga hakam bo'lasiz; Mentor va mehmon ham guruhlarga qo'shiladi. (82)
- Chap — kulrang yorliq «hakamlar oldidan to'liq repetitsiya» (App.jsx osti so'zma-so'z, P-015).
  Vizual (`ChiqishSahna` skeleti, bir marta o'zi yuradi — DE-200): taymer chizig'ining olti kulrang bo'lagi birma-bir to'q bo'ladi, keyin uzuq savol-javob bo'lagi yonadi; ostida bo'sh varaq — uch kulrang qator. Matnsiz — 2, 3-ekran kashfiyotini ochmaydi (P-015).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Butun chiqish qaysi tartibda o'tishini bilib olasiz · `to'liq repetitsiya`
  - 02 · Hakam chiqishga qanday belgi qo'yishini bilasiz · `hakam varag'i`
  - 03 · Chiqishdan oldin demo qurilmalarini tekshirasiz · `B reja`
  - 04 · Chiqishingizni o'tasiz, hakam varaqni to'ldiradi · `savol-javob`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz · Keyingi bosiladigan joy: «Boshlaymiz» (vizual tugagach halqada).
- O'qituvchi eslatmasi: Guruhlar 3–4 kishidan (5-darsdagidek). Mehmon bo'lsa — uni sinfga tanishtiring, ismini doskaga yozmang. Bugun repo'ga tegilmaydi, kod o'zgarmaydi.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011; «to'liq repetitsiya», «hakam varag'i» — faqat kulrang teg va App.jsx ostida). Sarlavha — natija va'dasi (P-014). «chiqishingizni» — pitch o'quvchida bor (1, 8-darslar; T-039).
  02 — 3-ekran; 03 — 5-ekran; 04 — 6, 7-ekranlar.

## 2 · Butun chiqish  ← QTushuncha (markaziy; ketma-ket 3 tugma)
- Eyebrow: Tushuncha · butun chiqish
- Sarlavha: **Pitch, demo va savollar birga qanday o'tadi?** (44) — 0-ekran savoliga javob beradigan ekran (T-064)
- Mentor: Tugmalarni birma-bir bosing va Mentor chiqishi chiziqda qanday yig'ilishiga qarang. (83)
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 — bitta o'lchov, o'sish tartibida): **Mentor misolida butun chiqish necha daqiqagacha boradi?** (55) · 5 daqiqagacha · 8 daqiqagacha · 12 daqiqagacha — tanlangach ixcham qator; tugmalar shundan keyin yoqiladi. <!-- TAXMIN T1 -->
- Vizual (`ChiqishSahna`, ≤ 3 blok: sahna · tugmalar qatori · natija): tepada — hakamlar; o'rtada — bo'sh taymer chizig'i (uzuq); pastda — laptop brauzeri va telefon. Ustida kulrang yorliq «Mentor misoli · reja».
- Tugmalar (ixcham, bir qatorda; joriysi accent, bosilgani ✓): 1 Pitch va jonli demo · 2 Savol-javob · 3 Demo ochilmasa
- **Harakat → Vizual o'zgarish:**
  1. «Pitch va jonli demo» → taymer chizig'ida olti bo'lak navbat bilan yonadi (Muammo · Bozor · Yechim · Raqamlar · Jamoa · Keyingi qadam; ostida vaqtlari), 5:00 belgisi yonadi; Yechim bo'lagi kengayib, ichida demo stsenariysining besh qadami yonadi:
     laptopda «O'yinlar» → «Qo'shilaman», telefonda «8 / 10» o'zi «9 / 10» bo'ladi, «Hozir ko'ryapti». <!-- TAXMIN T8 -->
     `QIzoh`: Mentor rejasida Yechim — 90 soniya, ichidagi demo — 60–90 soniya: demo cho'zilsa, pitch ham cho'ziladi. (103)
  2. «Savol-javob» → 5:00 dan keyin uchta katak qo'shiladi (har biri 1:00 gacha); hakam pufaklarida navbat bilan uch savol: «Bu mahsulot yana qancha odamga kerak?» · «Bu son qayerdan va nimani sanaydi?» · «Odamlar hozir bu ishni nima bilan qiladi?»; chiziq oxirida «8:00». <!-- TAXMIN T19 -->
     `QIzoh`: Bu mashqda 3 savolni hakam tanlaydi — ular oldindan ma'lum emas; har javobga 1 daqiqagacha. (91) <!-- TAXMIN T1 -->
  3. «Demo ochilmasa» → Yechimda laptop «Ulanmoqda…» ko'rsatadi; yonida xira «Qaytadan» tugmasi paydo bo'ladi va ustidan chiziladi; laptop ustida pufak — B reja gapi «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.»;
     laptopda video oynasi «60 soniya» o'ynaydi; taymer chizig'i shu payt ham to'xtamasdan yuradi. <!-- TAXMIN T8 -->
     `QIzoh`: Pitch, jonli demo va savol-javobni Demo Day'dagidek to'xtamasdan o'tish — to'liq repetitsiya deyiladi. (102) — atama shu yerda tug'iladi (T-011) <!-- TAXMIN T11 -->
  Natija (yashil xulosa qutisining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 8 daqiqagacha».
  Ipucha (40 s harakatsizlikda; javobni aytmaydi): Yoqilgan tugmani bosing — chiziqqa nima qo'shiladi? (51)
- Xulosa: Bu mashqda chiqish 8 daqiqagacha; demo ochilmasa ham taymer to'xtamaydi — B reja ishga tushadi. (95) <!-- TAXMIN T1 -->
- Tugma (pastki): Avval belgilang → Tugmalarni bosing (N/3) → Davom etish · `tugadi`: tugmalar qatori yo'qoladi, sahna butun enga (DE-199); vizual ⛶ ichida (q17).
- Keyingi bosiladigan joy: bashorat variantlari → joriy tugma (to'lqin 2–3 marta) → «Davom etish».
- Nishon yo'q (tugmali tushuncha — 01 pilot naqshi).
- O'qituvchi eslatmasi: Demo Day 8 tartibi (dastur, menyuning 16-qatori): hakamlar — 5–7 investor va tadbirkor; har o'quvchiga 5 daqiqa pitch va savol-javob. Savollar soni dasturda yozilmagan — bu mashqda 3 ta. <!-- TAXMIN T17 -->
  3-tugmadagi holat — «agar demo ochilmasa» mashqi, Mentorning natijasi emas. «To'xtamasdan» — bu darsdagi qoida: Demo Day'da pitchni boshidan boshlash vaqt oladi; B reja video bo'lmasa — Yechimni og'zaki aytib berish (11-Modul yo'li).
  Vaqt taqsimoti — bu mashqda (1-dars); o'quvchi pitchida boshqacha bo'lishi mumkin, jami 5:00.
✎ Uchala tugma yangi narsani qo'shadi: vaqt (demo cho'zilsa, pitch cho'ziladi) · savol-javob (savollarni hakam tanlaydi) · qoida (to'xtamaydi). Atama — 3-tugmadan keyin, hodisadan keyin (T-011). B reja gapi — tayanch 9.9 aynan.

## 3 · Hakam varag'i  ← QTushuncha (ketma-ket 3 vaziyat — SABOQ 9, E 53)
- Eyebrow: Tushuncha · hakam belgilari
- Sarlavha: **Hakam butun chiqishga qanday belgi qo'yadi?** (43)
- Mentor: Har vaziyatni o'qing va varaqdagi mos belgini bosing. (53)
- Bashorat yo'q — har vaziyatda o'quvchining o'zi tanlaydi (P-064: bashorat 2-ekranda).
- Vizual (≤ 3 blok: vaziyat kartasi · varaq · natija): **chapda** — joriy vaziyat kartasi («Vaziyat n / 3»; ustida kulrang yorliq «mashq vaziyati»; kartada chizilgan kichik sahna: laptop yoki hakam pufagi) ·
  **o'ngda** — varaq (sarlavhasiz; uch bo'lim): «Vaqt» (kulrang «m:ss — taymer yozadi») · «Demo» (uch belgi: Ishladi · B reja · Ishlamadi) · «Savol-javob» (savol qatori va uch belgi: Son yoki fakt bilan · Tekshirib aytaman · Javob savolga tegmadi); joriy bo'lim — accent chegara.
- Vaziyatlar (navbat bilan; matn — A-6 `VAZIYAT` aynan; ✔ o'rni — 2, 2, 3):
  1. Yechimda laptop «Ulanmoqda…» ko'rsatdi. B reja gapi aytildi, video oxirigacha ko'rsatildi. (90) · bo'lim «Demo» <!-- TAXMIN T8 -->
     - Ishladi · ✔ B reja · Ishlamadi
  2. Hakam: «Bu mahsulot yana qancha odamga kerak?» Javob: «Boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman.» · bo'lim «Savol-javob» <!-- TAXMIN T2 -->
     - Son yoki fakt bilan · ✔ Tekshirib aytaman · Javob savolga tegmadi
  3. Hakam: «Buni kim qilyapti?» Javob: «Ilovada o'yin e'loni, qo'shilish va eslatma bor.» · bo'lim «Savol-javob»
     - Son yoki fakt bilan · Tekshirib aytaman · ✔ Javob savolga tegmadi
- **Harakat → Vizual o'zgarish:** to'g'ri belgi → belgi vaziyat kartasidan varaqdagi o'z qatoriga uchadi va ~1 s rangli yonadi (B reja, Tekshirib aytaman — accent · Javob savolga tegmadi — `err`); keyingi vaziyat kiradi.
  Xato → belgi silkinadi, bir lahza `err`, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-vaziyat, «Ishladi»: Jonli demo ochildimi yoki video ko'rsatildimi? (46)
  - 1-vaziyat, «Ishlamadi»: Hakam Yechimni videoda ko'rdimi yoki yo'qmi? (44)
  - 2-vaziyat, «Son yoki fakt bilan»: Javobda son bormi? Yoki «tekshirib aytaman» deyildimi? (54)
  - 2-vaziyat, «Javob savolga tegmadi»: Javob aynan shu savol haqida — faqat son hali yo'q. (51)
  - 3-vaziyat, «Son yoki fakt bilan»: Fakt bor — u mahsulotni kim qilayotganini aytdimi? (50)
  - 3-vaziyat, «Tekshirib aytaman»: Javobda «tekshirib aytaman» degan gap bormi? (44)
  3/3 dan keyin: vaziyat kartasi yopiladi; varaq butun enga, tepasida sarlavha yoziladi: **Hakam varag'i** (harflar navbat bilan).
- Natija (bitta blok — E 42; `tugadi`): yashil xulosa qutisi.
- Xulosa: Bu mashqda hakam varag'ida uch narsa: vaqt, demo va har savolga javob. (70)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Butun chiqishga — vaqt, demo va savollarga javobga — belgi qo'yiladigan varaq hakam varag'i deyiladi. (101) — atama shu yerda tug'iladi (T-011) <!-- TAXMIN T19 -->
- Tugma (pastki): Belgilarni qo'ying (N/3) → Davom etish
- Ipucha (40 s): Vaziyatda nima bo'ldi — varaqdagi qaysi so'z shuni aytadi? (58)
- Keyingi bosiladigan joy: joriy bo'limning uch belgisi (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Right Marks! (uch vaziyat birinchi urinishda).
- O'qituvchi eslatmasi: 5-darsdagi baholash varag'i — har bo'lakka ✓/✗ va izoh; hakam varag'i — butun chiqishga, izohsiz, uch narsa. «Vaqt» ni hakam belgilamaydi — taymer o'zi yozadi (5:00 gacha — «Sig'di»).
  «Tekshirib aytaman» — halol javob (8-dars): u «Javob savolga tegmadi» emas, lekin uyga vazifada shu savolga javob tayyorlanadi. 3-vaziyatda javobda fakt bor, lekin savol mahsulotni kim qilayotgani haqida edi.
  Vaziyatlar — mashq uchun; Mentorning haqiqiy chiqishi «qur» pilotida. Tinglovchi hakam bo'lganda ham belgi chiqish haqida, odam haqida emas.
✎ Uch vaziyat — eng ko'p adashtiradigan uch farq: B reja va «Ishladi» · halol «tekshirib aytaman» va «tegmadi» · faktli, lekin savolga tegmagan javob. Javob matnlari — tayanch faktlaridan (TAYANCHGA SAVOL 15), Mentor natijasi emas.

## 4 · 1-savol  ← QTest (✔ C, `correctIdx 2`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: 1-savol (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Kitob ilovangiz chiqishida demo ochilmadi, video tayyor. Nima qilasiz?** (70)
  - A — Taymerni to'xtatib, demoni boshidan boshlayman (46)
  - B — Internet qaytishini hakam bilan birga kutaman (45)
  - ✔ C — B reja gapini aytib, videoni ko'rsataman (40)
  - D — Demoni tashlab, keyingi bo'lakka o'taman (40)
- Kalit: **C** (index 2). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); tire va qavs hech birida yo'q; «demo» A, D da — kalit so'z faqat to'g'rida emas; uzunlik — «O'lchov».
  Distraktorlar uch xil turkum: A — qayta boshlash (to'liq repetitsiya qoidasi) · B — kutish (vaqt ketadi, taymer yuradi) · D — dalilsiz o'tish (video tayyor turibdi, hakam Yechimni ko'rmaydi).
- To'g'ri izohi: B reja Yechimni ko'rsatadi, taymer esa to'xtamaydi. (51)
- Xato izohlari (≤60):
  - A: To'liq repetitsiyada taymer to'xtatiladimi? (43)
  - B: Kutganingizda taymer yuradi — vaqt qayerga ketadi? (50)
  - D: Video tayyor — hakam Yechimni ko'rmay qoladimi? (47)
  - (umumiy) Demo ochilmasa, to'liq repetitsiyada nima qilinadi? (51)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kitob ilovasining laptop maketi — video oynasi va ustida taymer chizig'i to'xtamasdan yuradi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Keep Going! — birinchi urinishda to'g'ri.
- Izoh (MD): savol 2-ekrandan ko'chirilmaydi (§106): Mentor misoli emas, boshqa mahsulot va «nima qilasiz». «video tayyor» — D ni (og'zaki aytish — video yo'q bo'lganda to'g'ri yo'l) yopadi: distraktor hayotda rost bo'lib qolmaydi (S-004).
  B — Backend uyg'onishini kutish ham bir daqiqagacha cho'zilishi mumkin (tayanch 6) — taymer yurganda bu vaqt pitchdan ketadi.

## 5 · Chiqishdan oldin  ← QMustaqil (USTAXONA 1/3 — ketma-ket karta, 4 qism; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · chiqishdan oldin
- Sarlavha: **Chiqishdan oldin to'rt narsani tekshiring.** (42)
- Mentor: Har kartadagi ishni laptop va telefoningizda qiling, keyin nima ko'rganingizni belgilang. (89)
- Tepada raqamli doiralar 1/2/3/4 (Backend · B reja video · Namuna akkaunt · Telefon; joriy — accent, belgilangani ✓) — miqdor shu vizualda va sarlavhada (P-062).
- Doiralar ostida kulrang qator (faqat `pm-m12d7-tekshiruv` da `buzildi === true` urinish bo'lsa va uning `qayta` qiymati `'takrorlanmadi'` bo'lmasa): 7-darsda «{usul}» hali ochiq qolgan — chiqishda buzilsa, B rejaga o'tasiz. (74) (`{usul}` — «Tarmoq uzilishi» · «Bo'sh ma'lumot» · «Ikki marta bosish»)
- **Bitta katta karta (joriy qism)** — ish (bir gap) va tanlov tugmalari (har birining o'z chegarasi); tanlov — «nima ko'rdingiz» (honor-belgi emas — KORPUS §19):
  1. **Backend** — Laptopda demo yo'lingizni oching: Backend 6-darsdagidek bitta so'rov bilan uyg'onadi. (85) · «Ro'yxat ochildi» · «Ochilmadi»
     «Ochilmadi» (yoki `pm-m12d6-demo.uygotish` `true` emas) — kulrang qator: Bepul Backend uxlagan bo'lsa, birinchi ochilish bir daqiqagacha cho'zilishi mumkin — kutib, yangilang. (102)
  2. **B reja video** — Laptopda B reja videosini oching va boshini ko'ring. (52) · «Video ochildi» · «Video hali yo'q»
     «Video hali yo'q» (yoki `pm-m12d6-demo.video` `true` emas) — kulrang qator: Video yo'q bo'lsa, demo ochilmaganda Yechimni og'zaki aytib berasiz. (68)
  3. **Namuna akkaunt** — Laptop va telefonda demo yo'liga qaysi hisob bilan kirgansiz? (61) · «Ikkalasida namuna akkaunt» · «Shaxsiy hisobim ochiq»
     «Shaxsiy hisobim ochiq» — kulrang qator: Shaxsiy ism va yozuvlar ekranda zalga ko'rinadi — namuna akkauntga o'ting. (74)
  4. **Telefon** — Telefonda demo yo'li brauzerda ochiqmi, zaryadi yetadimi? (57) · «Ochiq, zaryadi bor» · «Quvvatga uladim» · «Telefon yo'q» <!-- TAXMIN T8 -->
     «Telefon yo'q» — kulrang qator: Ikkinchi qurilma — laptopdagi boshqa brauzer oynasi, boshqa namuna akkaunt bilan. (81)
  Karta ostida tugmalar bir qatorda: «Keyingi» (asosiy; to'rtinchi kartada — «Saqlash») · o'ngda «Yordam».
- Yordam (bosilsa ochiladi; Mentor misolidan, A-6): Mentor misolida: (1) Backend — Render bepul xizmati: 15 daqiqa so'rovsiz qolsa uxlaydi, bitta so'rov bilan uyg'onadi · (2) B reja — 60 soniyalik ekran videosi, laptopda · (3) laptopda ham, telefonda ham — namuna akkaunt · (4) telefon — ikkinchi o'yinchi, brauzerda. <!-- TAXMIN T8 -->
  Chiqishgacha 15 daqiqadan ko'p o'tsa — demo yo'lini yana bir marta oching.
- Tekshiruv (`QXato`, ≤60; «Keyingi» yoki «Saqlash» bosilganda): tanlov yo'q (bloklaydi): Nima ko'rganingizni belgilang. (30)
- **Harakat → Vizual o'zgarish:** tanlov → doira ✓ (yashil) yoki halqa (accent — yo'li kulrang qatorda yozildi); «Keyingi» → karta ixcham qatorga yig'ilib tepaga tushadi (qism · tanlov); keyingi karta kiradi; «Saqlash» → to'rt qator bitta ixcham qator bo'ladi: «Chiqishdan oldin · {k} ✓» (SABOQ 17). Saqlangan qism ✎ bilan qayta ochiladi.
- Xulosa (o'quvchi tanlovidan, P-046; holatga qarab):
  - to'rttasi tayyor: To'rttasi tayyor: demo yo'li ochiq, video bor, namuna akkaunt bilan kirgansiz. (78)
  - aks holda: {k} tasi tayyor; qolganining yo'li kartada yozildi. (51)
- Saqlash: dars holatida (`ccProgress`; 11-ekran sarlavhasi va uyga vazifa ① uchun) — kalitga emas (A-12; TAYANCHGA SAVOL 2).
- Tugma (pastki): Kartalarni belgilang (N/4) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy kartadagi tanlov tugmalari (to'lqin) → «Keyingi» / «Saqlash».
- Nishon: Ready Check! (to'rt karta belgilanganda — tanlovdan qat'i nazar; ish qilingan ekran — P-048).
- Mentor rejimi: forma o'rniga Mentor misolining to'rt kartasi (Yordam matni). Mentor statistikasi: «Chiqishga tayyorlanganlar» (signal; kim nima tanlagani ko'rinmaydi).
- O'qituvchi eslatmasi: 7 daqiqa. Demo — namuna akkaunt bilan va real odamlar qo'shilmagan o'yinda (12-Modul): har bosish real o'yinchilarga xabar yubormasin. Telefon — brauzerda, APK emas (tayanch 9.6).
  Guruhda navbat uzoq bo'lsa, Backend yana uxlashi mumkin — har o'quvchi o'z navbatidan oldin demo yo'lini yana ochadi. Sinf tarmog'i 12–15 qurilmada sekinlashishi mumkin — pilotda ko'riladi.
✎ To'rt qism — tayanch 1.13 aynan. Har kartada «nima ko'rdingiz» tanlovi va noxush holat uchun bitta yo'l (B reja, og'zaki, namuna akkaunt, boshqa oyna) — sinf 15 (ayb emas, keyingi qadam).

## 6 · To'liq repetitsiya  ← QMustaqil (USTAXONA 2/3 — guruh, hakam bilan; yakka rejim bor)
- Eyebrow: Mustaqil ish · to'liq repetitsiya
- Sarlavha: **Chiqishingizni boshidan oxirigacha o'ting.** (42)
- Mentor: Hakam kimligini tanlang, so'ng hakam «5 daqiqani boshlash»ni bossin. (68)
  Yakka rejimda (tanlov «O'zim — yakka»): «5 daqiqani boshlash»ni bosing va butun chiqishni ovoz chiqarib o'ting. (71)
- **Tepada — hakam tanlovi** (yorliq input ichida — kulrang «Hakam kim?», E 43; har tugmaning o'z chegarasi): «Mentor yoki mehmon» · «Guruhdagi tinglovchi» · «O'zim — yakka» → `tur`.
- Ostida tugmalar (ixcham, bir qatorda; joriysi accent): 1 Pitch · 2 Savol-javob
- **1 · Pitch:**
  - «Pitchdan oldin» — bitta kulrang blok (bosilmaydi, katakchasiz — korpus §19): Dars sahifasi va demo — laptopda ikki oynada; taymerni hakam boshqaradi. (72) · Navbatingizgacha 15 daqiqadan ko'p o'tgan bo'lsa — demo yo'lini yana oching. (76)
    `pm-m12d6-demo.otishVaqt` > 90 bo'lsa uchinchi qator: 6-darsda demo o'tishingiz {s} soniya edi — bu mashqdagi Yechimdan uzun. (71) <!-- TAXMIN T9 -->
  - Taymer (`ChiqishSahna` taymer chizig'i, olti bo'lak): «5 daqiqani boshlash» · «Keyingi bo'lak» (hakam bosadi; ixtiyoriy — 8-darsdagidek) · «To'xtatish». Joriy bo'lak — «Keyingi bo'lak» bosilsa shu bo'yicha, aks holda reja vaqti bo'yicha accent; Yechim ostida kulrang besh qadam (`pm-m12d6-demo.stsenariy`; yo'q bo'lsa — «jonli demo»); 5:00 dan oshsa — qizil «+m:ss».
    Taymer yurganda «Qaytadan» yo'q (to'liq repetitsiya qoidasi). To'xtatilgach — «Pitch: m:ss» qotadi; noto'g'ri boshlangan bo'lsa (birinchi 30 soniyada to'xtatilgan) — ↻ «Qaytadan boshlash».
  - Taymer ostida kulrang qator (bitta; `video` va 5-ekran tanlovidan): video bor — Demo ochilmasa — B reja gapini ayting va videoni oching; taymer yuraveradi. (75) · video yo'q — Demo ochilmasa — Yechimni og'zaki aytib bering; taymer yuraveradi. (66) <!-- TAXMIN T8 -->
- **2 · Savol-javob** (pitch to'xtatilgach yoqiladi):
  - Yo'riq (bir qator): Hakam savolni ovoz chiqarib bersin va uning tugmasini bossin — javobga 1 daqiqa. (80)
  - Savol tugmalari (`HAKAM_SAVOL`, 7 ta; tugmada savolning o'zi): 8-darsda berilganlari (`pm-m12d8-final.savollar[].savol`) — kulrang yorliq «8-darsda bo'lgan» (bosilsa ham bo'ladi) · oxirida «Boshqa savol» (hakam o'zi so'raydi; matni yozilmaydi). <!-- TAXMIN T19 -->
  - Savol tugmasi → savol taymer chizig'ining savol-javob bo'lagidagi katakka uchadi, 1:00 chizig'i yura boshlaydi; «To'xtatish» → katak qotadi (belgisiz — belgi 7-ekranda). 1:00 dan oshsa — katak qizil «+m:ss» (saqlanmaydi). 3 savoldan keyin savol tugmalari yopiladi.
  - Yakka rejimda: savol tugmalari o'rnida dars savollarni navbat bilan ko'rsatadi (3 ta, 8-darsda bo'lmaganlaridan, tasodifiy); javobni ovoz chiqarib aytasiz va «To'xtatish»ni bosasiz.
- Tekshiruv (`QXato`, ≤60): hakam tanlanmagan — «5 daqiqani boshlash» yopiq, yorliq: Avval hakam kimligini tanlang. (30)
- **Harakat → Vizual o'zgarish:** «5 daqiqani boshlash» → taymer chizig'i to'lib boradi, joriy bo'lak accent bilan almashadi, 5:00 dan oshsa chiziq qizil davom etadi · «To'xtatish» → vaqt qotadi, «Savol-javob» tugmasi halqaga oladi ·
  savol tugmasi → savol katakka uchadi, 1 daqiqa chizig'i yuradi · «To'xtatish» → katak qotadi; uchinchi katakdan keyin savol-javob bo'lagi yashil chet oladi.
- Xulosa (o'quvchi ma'lumotidan, P-046; holatga qarab):
  - hakam bilan: Chiqish o'tildi: pitch {m:ss}, {n} ta savol. Endi qurilmani hakamga bering. (75)
  - yakka rejimda: Chiqish o'tildi: pitch {m:ss}, {n} ta savol. Endi varaqni o'zingiz to'ldirasiz. (79)
- Saqlash: «To'xtatish» (pitch) → `pm-m12d13-repetitsiya.vaqt`, `.tur`, `.varaq[0]` (`band: 'vaqt'`), `savedAt` · har savol «To'xtatish» → `.savollar` (+1), `.varaq` ga `{ band: 'savol:<id>', belgi: null }` (A-12).
- Chiqishdan keyin (kulrang qator, xulosa ostida): Demo holatini boshiga qaytaring: keyingi chiqish ham o'sha holatdan boshlansin. (79) (Mentor misolida — o'yindan chiqish, yana «8 / 10»; tayanch 9.10)
- Tugmalar: Orqaga · «Navbatim kelmadi» (ikkinchi, chegarali; 6, 7-ekranlarni o'tkazib, 8-ekranga) · Davom etish (pitch to'xtatilgach va kamida bitta savoldan keyin).
- Keyingi bosiladigan joy: hakam tanlovi (har tugmaning o'z chegarasi) → «5 daqiqani boshlash» (halqa) → «To'xtatish» → savol tugmalari (navbatma-navbat to'lqin) → «To'xtatish» → «Davom etish».
- Nishon yo'q (7-ekranda).
- Mentor rejimi: proyektorda katta taymer 5:00, savol-javob bo'lagi va savol tugmalari — vaqt qolsa, ko'ngilli butun sinf oldida o'tadi, Mentor va mehmon hakam (90 daqiqa hisobida yo'q). O'quvchilar ro'yxatida — faqat signallar: «Pitch o'tildi» · «Varaq saqlandi»; vaqt va belgilar proyektorga chiqmaydi.
  Mentor statistikasi: «Chiqishni o'tganlar» · «5 daqiqaga sig'ganlar» (son) · «Hakam: Mentor yoki mehmon · tinglovchi · yakka» (sonlar). ⛔ Mentor misolining o'z chiqishi — pilotda (A-6).
- O'qituvchi eslatmasi: ≈45 daqiqa (6–7 birga). Guruh 3–4: A gapiradi, B — hakam (taymer, savollar, varaq), qolganlar — tinglovchi; keyin almashadi. Har chiqish ≈ 8 daqiqa, varaq ≈ 2. <!-- TAXMIN T11 -->
  Mentor va mehmon guruhlarni aylanadi: har biri bir guruhda bitta chiqishga hakam bo'ladi (tanlov «Mentor yoki mehmon»), keyin boshqa guruhga — hamma chiqishga yetmaydi, qolganiga guruhdagi tinglovchi hakam. Mehmon ismsiz; savolini o'zi beradi («Boshqa savol»), matni yozilmaydi.
  Kim kimdan tez o'tgani sanalmaydi. Demo — namuna akkaunt bilan, real odamlar qo'shilmagan o'yinda. Laptopda `.env`, Neon va boshqa oynalar yopiq — ekran guruhga ko'rinadi.
✎ «To'xtamasdan» — taymer yurganda «Qaytadan» yo'q (2-ekran qoidasi); B reja yoki og'zaki yo'l kulrang qatorda. Savollar 8-darsdagidan boshqasi bo'lsin (yorliq bilan) — Demo Day'da savollar oldindan ma'lum emas; lekin bloklanmaydi.

## 7 · Hakam varag'i  ← QMustaqil (USTAXONA 3/3 — ketma-ket karta; SABOQ 9, 29, E 53)
- Eyebrow: Mustaqil ish · hakam varag'i
- Sarlavha: **Hakam chiqishingizga qanday belgi qo'ydi?** (41)
- Mentor: Dars ochiq qurilmangizni hakamga bering: u har kartada bittasini tanlaydi. (74)
  Yakka rejimda: Har kartada bittasini o'zingiz tanlang — bu mashq varag'i. (58)
- **Tepada — ixcham chiziq «Hakam varag'i · n / N»** (N = 2 + berilgan savollar soni): qator nomlari, belgilangani rangli (bo'sh uzuq qatorlar yo'q, SABOQ 17).
- **Markazda — bitta katta karta (joriy):**
  1. **Vaqt** — «Pitch: m:ss» va belgi o'zi: «Sig'di» (5:00 gacha, yashil) yoki «Oshdi · +m:ss» (qizil); hakam bosmaydi. «Keyingi bo'lak» bosilgan bo'lsa — olti bo'lak vaqti kichik chiziqda, rejadan eng ko'p oshgani accent (faqat ekranda, kalitga yozilmaydi). `pm-m12d8-final.vaqt` bo'lsa — kulrang qator: «8-darsda: {m:ss}». Tugma «Keyingi».
  2. **Demo** — Jonli demo qanday o'tdi? (24) · «Ishladi» · «B reja» · «Ishlamadi»
  3–5. **{n}-savol** — savolning o'zi (6-ekrandan; «Boshqa savol» — «Hakamning o'z savoli») · «Son yoki fakt bilan» · «Tekshirib aytaman» · «Javob savolga tegmadi»
  Oxirgi kartada «Saqlash» (o'ngda). Saqlashdan oldin hakam ixcham qatordagi ✎ bilan belgini o'zgartira oladi; saqlangandan keyin ✎ yo'q — belgi hakamniki.
- Tekshiruv (`QXato`, ≤60): belgisiz «Keyingi» yoki «Saqlash» (bloklaydi): Bitta belgini tanlang. (22)
- **Harakat → Vizual o'zgarish:** belgi → karta ixcham qatorga yig'ilib tepaga tushadi (qator · belgi, rangli — A-13), keyingi karta kiradi · «Saqlash» → karta yopiladi; varaq butun enga — uch bo'lim, sarlavha «Hakam varag'i · {Mentor yoki mehmon | tinglovchi | o'zim}»; varaq bir marta yengil yonadi.
- Xulosa (o'quvchi ma'lumotidan, P-046; holatga qarab):
  - hammasi yashil yoki accent («Sig'di», «Ishladi», har savol «Son yoki fakt bilan» yoki «Tekshirib aytaman»): Varaq saqlandi: vaqtga sig'dingiz, demo ishladi, savollarga javob bor. (70)
  - aks holda: Varaq saqlandi. Tuzatiladigan joy: {vaqt · demo · n-savol} — uyga vazifada. (75)
- `QIzoh` (faqat «Oshdi» bo'lsa; qutining oxirgi kichik qatori): Vaqt oshsa — eng uzun chiqqan bo'lakdan bitta gapni olib, taymer bilan qayta o'lchang. (86)
- Saqlash: `pm-m12d13-repetitsiya.demo`, `.varaq[].belgi`, `savedAt` (A-12).
- Tugma (pastki): Har kartaga belgi (n/N) → Davom etish
- Keyingi bosiladigan joy: joriy kartaning belgilari (har birining o'z chegarasi, to'lqin) → «Keyingi» / «Saqlash» → «Davom etish».
- Nishon (bonus): Full Rehearsal! — varaq saqlanganda (belgilardan qat'i nazar — tavsif qilingan ishni aytadi; P-048).
- Mentor rejimi: Mentor statistikasi: «Varaqni saqlaganlar» · «Demo: ishladi · B reja · ishlamadi» (sonlar). Kim qanday belgi olgani ro'yxatda va proyektorda ko'rinmaydi.
- O'qituvchi eslatmasi: Hakam varaqqa izoh yozmaydi. Og'zaki fikr bersa — bo'lak haqida, odam haqida emas: «zerikarli», «yomon» kabi baho-so'zlar yo'q (TAQIQLAR 3); mehmonni ham oldindan shunga yo'naltiring.
  Gapiruvchi hakam qo'ygan belgini o'zgartirmaydi. «Tekshirib aytaman» — halol javob; uyga vazifada shu savolga javob tayyorlanadi. «B reja» — B reja ishladi, lekin demo nega ochilmagani ochiq qoldi.
✎ Varaq — tayanch 1.13 dagi uch narsa: vaqt, demo, savollarga javob. Izoh maydoni yo'q — TAQIQLAR 3 va kalitda shaxsiy gap yo'q (sinf 3, 9).

## 8 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikki qoida birga — hakam varag'i va pitch vaqti; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy savol (savol ustida yorliq yo'q)
- Savol: **Varaqda: vaqt oshgan, demo ishlagan. Endi nima qilasiz?** (55)
  - ✔ A — Ortiqcha gapni olib, taymer bilan qayta o'lchayman (50)
  - B — Ishlagan demoni olib, o'rniga videoni qo'yaman (46)
  - C — Savol-javob vaqtidan olib, pitchni uzaytiraman (46)
  - D — Pitchni o'zgartirmay, keyingi safar tezroq aytaman (50)
- Kalit: **A** (index 0). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); «olib» A, B, C da — kalit so'z faqat to'g'rida emas; uzunlik — «O'lchov».
  Distraktorlar uch xil turkum: B — ishlagan demoni olib tashlash (boshqa qator) · C — chiqish tartibini buzish (savol-javob vaqti pitchga o'tmaydi) · D — o'zgarishsiz qoldirish (va'da, o'lchovsiz).
- To'g'ri izohi: Qisqartirilgan pitch yana taymer bilan o'lchanadi. (50)
- Xato izohlari (≤60):
  - B: Demo ishlagan — nega uni olib tashlaysiz? (41)
  - C: Bu mashqda pitchga 5 daqiqa; savol-javob vaqti alohida. (55)
  - D: O'zgarmagan pitch yana o'sha vaqtni olmaydimi? (46)
  - (umumiy) Vaqt oshsa, pitchdan nimani olasiz? (35)
- Javob topilgach (kichik): hakam varag'ining «Vaqt» qatori — «Oshdi» yonida kulrang «qayta o'lchash» joyi accent uzuq ramka bilan yonadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol ekrandan ko'chirilmaydi (§106): 7-ekranda `QIzoh` qoidani aytadi, savol esa varaqni o'qib, keyingi ishni tanlashni so'raydi. Arena 12 (taymerni kim boshqaradi) bilan kalit ibora takrorlanmaydi (S-008).
  D — «tezroq aytish» hayotda ba'zan yordam berishi mumkin, lekin variant «o'zgartirmay» va «keyingi safar» deydi — o'lchovsiz va'da (sinf 5, 16).

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 2 savol (4, 8); 2, 3-ekranlar — ballsiz (3 — nishon bilan); 5, 6, 7-ekranlar — Mentorga signal (`PRACTICE_BASE`, ball yo'q). Sinfda kim kimdan yaxshi chiqqani sanalmaydi — podium faqat test ballari (TAQIQLAR 3).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 4 — «1 — Demo ochilmasa» · 8 — «Yakuniy — Vaqt oshsa»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi (qolip; o'zgartirilmaydi)
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi; ustunlik tartibi — yuqoridan):
  - varaq saqlangan, `tur` — `hakam` yoki `guruh`; «Sig'di», «Ishladi», hech bir savol «Javob savolga tegmadi» emas: **To'liq repetitsiya o'tdi — hakam varag'i saqlandi.** (50)
  - varaq saqlangan, `tur` — `hakam` yoki `guruh`; «Oshdi», «B reja», «Ishlamadi» yoki «Javob savolga tegmadi» bor: **To'liq repetitsiya o'tdi — tuzatiladigan joy bor.** (49)
  - varaq saqlangan, `tur` — `yakka`: **Chiqish yakka o'tildi — varaqni o'zingiz to'ldirdingiz.** (55)
  - pitch o'tilgan (`vaqt` bor), varaq saqlanmagan: **Chiqish o'tildi — hakam varag'i hali to'ldirilmagan.** (52)
  - pitch o'tilmagan (`vaqt` yo'q; «Navbatim kelmadi» ham shu): **To'liq repetitsiya hali o'tilmagan — uyda o'ting.** (49)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; 1-qator — ta'rif, T-042):
  - Pitch, jonli demo va savol-javobni Demo Day'dagidek to'xtamasdan o'tish — to'liq repetitsiya. (93)
  - Bu mashqda chiqish 8 daqiqagacha: 5 daqiqa pitch va 3 ta savol. (63) <!-- TAXMIN T1 -->
  - Demo ochilmasa — B reja gapi va video; taymer to'xtamaydi. (58) <!-- TAXMIN T8 -->
  - Hakam varag'ida uch narsa belgilanadi: vaqt, demo va har savolga javob. (71)
  - Javobni bilmasangiz, «tekshirib aytaman» deysiz — son o'ylab topilmaydi. (72)
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: oila a'zosi yoki do'stingiz · Nechta: 1 to'liq repetitsiya · Muddat: keyingi darsgacha
  - ① {holatga qarab — bir yoki bir nechta qator; hammasi joyida bo'lsa ① ko'rinmaydi}:
    «Oshdi» — Eng uzun chiqqan bo'lakdan bitta gapni oling va pitchni taymer bilan qayta o'lchang. ·
    «B reja» yoki «Ishlamadi» — Demo nega ochilmaganini 7-darsdagidek buzish yozuvi bilan yozing va Mentorga ko'rsating. ·
    «Javob savolga tegmadi» yoki «Tekshirib aytaman» — Shu savolga son yoki fakt bilan javob tayyorlang. ·
    pitch o'tilmagan — Chiqishdan oldin to'rt narsani tekshirib, butun chiqishni taymer bilan o'ting.
  - ② Tanish odamga butun chiqishingizni bir marta, taymer bilan ayting. U darsdagi hakam savollaridan uchtasini bersin, siz har biriga 1 daqiqada javob bering.
  - Karta ostida (bitta kulrang qator): Uning ismi hech qayerga yozilmaydi; yozib olsangiz, video telefoningizda qoladi. (80) <!-- TAXMIN T12 -->
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Zaxira dars: zalni tayyorlash» <!-- TAXMIN T20 -->
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada keyingi qatorlar (Zaxira dars, Demo Day) aytilmaydi (T-038). ① — kod tuzatish emas: 14-Modulda kod faqat 3, 4, 6, 7-darslarda o'zgaradi (tayanch 1.0) — demo nosozligi Mentorga ko'rsatiladi (TAYANCHGA SAVOL 12).
  ② — tanish doira, ismsiz (TAQIQLAR 3); yozib olish ixtiyoriy, video hech qayerga yuklanmaydi (T12). Yakun sarlavhalari kalitdan va dars holatidan yig'iladi: `vaqt`, `demo`, `varaq[].belgi`, `tur`, 7-ekran «Saqlash» bayrog'i (P-046).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi, ≤48 belgi)
- **Right Marks!** (3-ekran, uch vaziyat birinchi urinishda) — Uch vaziyatga to'g'ri belgi qo'ydingiz (38)
- **Keep Going!** (4-ekran, 1-savol birinchi urinishda) — Demo ochilmaganda B rejani tanladingiz (38)
- **Ready Check!** (5-ekran, to'rt karta belgilanganda) — Chiqishdan oldin to'rt narsani tekshirdingiz (44)
- **Full Rehearsal!** (7-ekran, hakam varag'i saqlanganda — bonus) — Chiqishni o'tib, hakam varag'ini saqladingiz (44)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Full Rehearsal!, ish qilingan ekranda — P-048); belgilar qanday chiqsa ham beriladi (tavsif varaq saqlanganini aytadi, «yaxshi chiqdingiz» demaydi). Ready Check! — ish (to'rt karta) uchun. Yakuniy savol nishonsiz. Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 08.10 — 0).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **4 · Demo ochilmasa** — 1 To'liq repetitsiyada taymer to'xtamaydi. · 2 Video tayyor bo'lsa — B reja gapi va video. · 3 Mentor misolida: «Internet uzildi — shu demoning 60 soniyalik videosini ko'rsataman.» <!-- TAXMIN T8 -->
  — Sinfga savol: Sizning B reja gapingiz qanday?
- **8 · Vaqt oshsa** — 1 Varaqda «Oshdi» bo'lsa — pitch qisqartiriladi. · 2 Eng uzun chiqqan bo'lakdan bitta gap olinadi; demo va savol-javob joyida qoladi. · 3 Qisqartirilgan pitch yana taymer bilan o'lchanadi.
  — Sinfga savol: Pitchingizdagi qaysi gap ortiqcha?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| To'liq repetitsiya nima? | Pitch, jonli demo va savol-javobni Demo Day'dagidek to'xtamasdan o'tish | Bu darsda — guruhda, hakam bilan |
| Bu mashqda butun chiqish qancha vaqtgacha? | 8 daqiqagacha: 5 daqiqa pitch va 3 ta savol | Har javobga 1 daqiqagacha |
| Jonli demo pitchning qayerida? | Yechim bo'lagi ichida | Mentor rejasida — 60–90 soniya |
| To'liq repetitsiyada demo ochilmasa nima qilinadi? | B reja gapi aytiladi va video ko'rsatiladi | Taymer to'xtamaydi |
| Video yo'q bo'lsa, demo ochilmaganda nima qilasiz? | Yechimni og'zaki aytib berasiz | Taymer yuraveradi |
| Hakam varag'i nima? | Butun chiqishga — vaqt, demo va savollarga javobga — belgi qo'yiladigan varaq | Baholash varag'i esa har bo'lakka |
| Hakam varag'ida demoga qaysi belgilar bor? | «Ishladi», «B reja» yoki «Ishlamadi» | Belgini hakam qo'yadi |
| Savolga javob qanday belgilanadi? | «Son yoki fakt bilan», «Tekshirib aytaman» yoki «Javob savolga tegmadi» | «Tekshirib aytaman» — halol javob |
| Chiqishdan oldin qaysi to'rt narsa tekshiriladi? | Backend uyg'otilgani, B reja video, namuna akkaunt va telefon zaryadi | Bu darsdagi ro'yxat |
| Nega demo namuna akkaunt bilan ko'rsatiladi? | Shaxsiy ism va yozuvlar zalga ko'rinmasligi uchun | Namuna akkaunt sanoqqa kirmaydi |
| Pitch vaqti oshsa nima qilasiz? | Eng uzun chiqqan bo'lakdan bitta gapni olib, taymer bilan qayta o'lchaysiz | Savol-javob vaqti pitchga o'tmaydi |
| Hakamning ismi varaqda qayerda turadi? | Hech qayerda: varaqda faqat belgilar | Hakam — ismsiz |
- §145: har javobdagi so'z darsda bor (to'liq repetitsiya, 8 daqiqa, Yechim ichida, B reja, og'zaki — 2 · hakam varag'i, belgilar — 3 · to'rt narsa, namuna akkaunt — 5 · ortiqcha gap, qayta o'lchash — 7, 8 · ismsiz — 6, 7).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md13/olchov.py` (pastda «O'lchov»).
1. To'liq repetitsiyada demo ochilmadi. Taymer nima bo'ladi? (2, 4)
   - ✔ To'xtamaydi, chiqish davom etadi (32)
   - Pauza qilinib, keyin davom etadi (32)
   - Nolga qaytib, boshidan boshlanadi (33)
   - Demo ochilguncha kutib turadi (29)
2. Bu mashqda pitchdan keyin hakam nechta savol beradi? (2)
   - Bitta savol (11)
   - ✔ Uchta savol (11)
   - Oltita savol (12)
   - Beshta savol (12)
3. Hakam varag'i nimaga belgi qo'yadi? (3)
   - Har bo'lakdagi gapga alohida-alohida (36)
   - Slaydlarning ko'rinishi va rangiga (34)
   - ✔ Vaqt, demo va savollarga javobga (32)
   - Ilova kodining hajmi va tezligiga (33)
4. Javob: «Bilmayman, bu sonni keyin aniqlab beraman». Varaqda qaysi belgi? (3, 7)
   - Son yoki fakt bilan (19)
   - Javob savolga tegmadi (21)
   - Belgisiz qoldiriladi (20)
   - ✔ «Tekshirib aytaman» (19)
5. Chiqishdan oldin Backend nega uyg'otiladi? (5)
   - ✔ Demo sekin ochilmasligi uchun (29)
   - Hakam kodni ko'ra olishi uchun (30)
   - Video tezroq ochilishi uchun (28)
   - Telefon zaryadi tejalishi uchun (31)
6. Demo yo'liga qaysi hisob bilan kirasiz? (5)
   - Shaxsiy hisobingiz bilan (24)
   - ✔ Namuna akkauntingiz bilan (25)
   - Sinfdoshning hisobi bilan (25)
   - Hakam bergan hisob bilan (24)
7. Pitch 5:20 da tugadi. Varaqda vaqt qatori qanday? (7)
   - Sig'di — chunki to'xtatildi (27)
   - Belgisiz — hakam bilmaydi (25)
   - ✔ Oshdi — taymer qizil bo'ldi (27)
   - B reja — vaqt yetmay qoldi (26)
8. Mentor misolida B reja video qayerda turadi? (2, 5)
   - Hakamning telefonida turadi (27)
   - Sinf chatida, havola bilan (26)
   - Ochiq video saytida turadi (26)
   - ✔ Demo ochiq turgan laptopda (26)
9. «Odamlar hozir bu ishni nima bilan qiladi?» Javobda nima aytasiz? (3, 6)
   - ✔ Ular hozir qaysi yo'l bilan qilishini (37)
   - Ilovangizdagi barcha imkoniyatlarni (35)
   - Kelgusi oyda chiqadigan yangiliklarni (37)
   - Savolga emas, pitchdagi gapingizni (34)
10. Hakam varag'ida hakamning ismi qayerda turadi? (7)
    - Varaq tepasida, sarlavhada (26)
    - ✔ Hech qayerda — hakam ismsiz (27)
    - Har belgining yonida yozilib (28)
    - Mentor statistikasida, ochiq (28)
11. Chiqishdan keyin demo holati nima qilinadi? (6)
    - O'sha holatda qoldiriladi (25)
    - Hakamga topshirib qo'yiladi (27)
    - ✔ Boshiga qaytarib qo'yiladi (26)
    - Hammasi o'chirib tashlanadi (27)
12. Guruhda taymerni kim boshqaradi? (6)
    - Gapirayotgan o'quvchining o'zi (30)
    - Mentor, proyektordagi taymerda (30)
    - Hech kim — chiqish taymersiz (28)
    - ✔ Hakam bo'lib turgan tinglovchi (30)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 4-ekran (kitob ilovasi — nima qilasiz) ↔ arena 1 (taymer nima bo'ladi) · 8-ekran (vaqt oshdi — nima qilasiz) ↔ arena 7 (varaqda qanday qator) va arena 12 (kim boshqaradi).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, har savolda kamida ikki xil turkum (S-004): 1 — pauza, nolga qaytish, kutish (qoida) · 2 — sonlar (bitta · olti — bo'laklar soni · besh) · 3 — baholash varag'i, ko'rinish, kod (3-darsdagi tezlik) · 4 — fakt, tegmadi, belgisiz (savolda belgi nomi aytilmaydi — javobni ma'nosidan topadi) ·
  5 — hakamga kod, video, telefon · 6 — shaxsiy, boshqa odam hisobi · 7 — noto'g'ri belgi, belgisiz, boshqa qator (savolda «oshdi» so'zi yo'q; 5:20 — mashq soni, S-019) · 8 — hakamga, ommaviy chat va sayt (video qoidasi — T12) · 9 — imkoniyatlar ro'yxati, kelajak, savoldan qochish · 10 — ochiq ism (TAQIQLAR 3) · 11 — qoldirish, topshirish, o'chirish · 12 — gapiruvchi, Mentor, taymersiz.
  2-savol: «Oltita» — olti bo'lak bilan aralashtiruvchi son; Demo Day'da savollar soni dasturda yozilmagan — savol «bu mashqda» bilan chegaralangan.
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — chiqish · pitch · demo · hakam · varaq · taymer · B reja · savol-javob · Maydon Jamoa · uyga vazifa banneri — chiqish · taymer · hakam savoli. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/12-Modull/PmDressRehearsalLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m12d13-v1` (13-Modul naqshi `pm-m11dN-v1`), `lessonTitle` — «Demo Day'ga tayyormisiz?».
2. `SCREEN_META` 12: hook · plan · concept · concept · test · practice · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 4: 2, 8: 0 }; `chiqish: -1` (2-ekran), `varaq: -1` (3-ekran — ballsiz, nishon bilan); 5, 6, 7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 4, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s3 `QTushuncha` (`zoom`, `tugadi` — q17/q18; s2 da `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s4/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5/s6/s7 `QMustaqil` · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`ChiqishSahna`** — bitta vizual (180; qolipda yo'q, yangi; 12-Modul `TaymerChiziq` va `BeshDaqiqaSahna` dan ko'chirilmaydi — dars ichida, K-020): qismlar `taymer` (olti bo'lak + savol-javob bo'lagi 3 katak; `sekund`, `joriy`, oshganda qizil «+m:ss») · `laptop` (brauzer: manzil satri, «O'yinlar»/«O'yin», «Qo'shilaman», ulanish belgisi; B reja kadri — video oynasi) ·
   `telefon` (≈170×272; «8 / 10» → «9 / 10») · `hakamlar` (3 qiyofa, ismsiz; pufak) · `varaq` (uch bo'lim; qatorlar `VARAQ_BELGI` dan, rang — A-13). Rejimlar: `kirish` (uch alohida karta + uzuq chiziq) · `skelet` (1-ekran) · `chiqish` (2-ekran: 3 tugma bosqichi) · `varaq` (3, 7-ekran) · `taymer` (6-ekran).
   Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: cs-tugma cs-belgi cs-savol`). `reduced-motion` — o'tishsiz. 393 da telefon laptop ostida, kesilmaydi (E 41). Rangli yon chiziq yo'q.
4. **Taymer:** vaqt `Date.now()` farqidan olinadi (oyna almashganda yoki fon oynada ham to'g'ri — dars sahifasi va demo bir laptopda); `setInterval` faqat chizish uchun. Taymer yurganda «Qaytadan» yo'q; birinchi 30 soniyada to'xtatilsa — ↻ «Qaytadan boshlash». Savol taymeri — 60 soniya, oshsa qizil.
5. **Bitta manbalar (A-6 aynan):** `CHIQISH_VAQT` (`[40, 30, 90, 60, 30, 50]` + savol 3 × 60) · `BOLAK_NOM` (olti bo'lak, 1-dars bilan bir) · `MENTOR_STSENARIY` (5 qadam) · `B_REJA_GAPI` · `JAMOA_PITCH_FINAL` (faqat Mentor rejimi va «qur»; 08 dars bilan bitta manba — TAYANCHGA SAVOL 11) · `HAKAM_SAVOL` (7: olti bo'lak kaliti + `hozir`; matni 1-dars `HAKAM_SAVOL` bilan so'zma-so'z) ·
   `TAYYORLOV` (4 × `{ id: 'backend' | 'video' | 'namuna' | 'telefon', ish, tanlovlar: [{ t, tayyor: bool }], yol }`) · `VARAQ_BELGI` (`vaqt`: sigdi/oshdi · `demo`: ishladi/b-reja/ishlamadi · `savol`: fakt/tekshiraman/tegmadi — `{ uz, rang }`) · `VAZIYAT` (3-ekran: 3 × `{ matn, bolim: 'demo' | 'savol', savol?, togri }`).
6. **s2** — `QBashorat` (5 · 8 · 12 daqiqagacha) → 3 tugma; 1 — olti bo'lak yonadi + Yechimda besh qadam (laptop, telefon «8 / 10» → «9 / 10») + `QIzoh` · 2 — savol-javob bo'lagi, 3 pufak + `QIzoh` · 3 — «Ulanmoqda…», «Qaytadan» chiziladi, B reja pufagi va video, taymer yuraveradi + `QIzoh` (atama); natijada taxmin qatori + xulosa; 40 s ipucha.
7. **s3** — 3 vaziyat ketma-ket (`VAZIYAT`), har birida o'z bo'limining 3 belgisi (✔ o'rni 2, 2, 3); to'g'ri → belgi varaq qatoriga uchadi; `QXato` 6 turi; 3/3 da varaq sarlavhasi yoziladi; xulosa + `QIzoh`; nishon `rightMarks`.
8. **s5** — o'qiydi `pm-m12d7-tekshiruv` (`urinishlar[]`: `buzildi === true` va `qayta !== 'takrorlanmadi'` bo'lsa — kulrang ogohlantirish, `usul` nomi bilan), `pm-m12d6-demo` (`uygotish`, `video` — kulrang qatorlar); 4 karta ketma-ket (`TAYYORLOV`); tanlovsiz «Keyingi» bloklanadi;
   natija dars holatida (`ccProgress`, kalitga emas); xulosa — tanlovlardan; nishon `readyCheck` (4 karta belgilanganda).
9. **s6** — hakam tanlovi (`tur`) → taymer (KOD 4) → savol tugmalari (`HAKAM_SAVOL` + «Boshqa savol»; `pm-m12d8-final.savollar[].savol` — 08 MD da savol **matni**: `HAKAM_SAVOL` matni bilan so'zma-so'z solishtiriladi va mos kelganiga «8-darsda bo'lgan» yorlig'i; TAYANCHGA SAVOL 4) · yakka rejimda — 3 savol tasodifiy, 8-darsdagilardan boshqa (yetmasa — ulardan ham);
   kulrang qatorlar (`otishVaqt` > 90 · video bor/yo'q — 5-ekran tanlovi ustun); «Navbatim kelmadi» — 7-ekranni o'tkazib 8 ga; «Davom etish» — `vaqt !== null` va `savollar >= 1`. Saqlash — A-12 (pitch to'xtatilganda va har savoldan keyin).
10. **s7** — kartalar: `vaqt` (o'zi) · `demo` · har savol; belgisiz o'tish bloklanadi; saqlashgacha ✎, saqlangandan keyin yo'q; saqlash — `demo`, `varaq[].belgi`, `savedAt`; xulosa — ikki holat; `QIzoh` — faqat `oshdi`; nishon `fullRehearsal` (saqlanganda).
11. **Mentor rejimi:** o'quvchilar ro'yxatida faqat signallar («Chiqishga tayyorlandi» · «Pitch o'tildi» · «Varaq saqlandi»; `PRACTICE_BASE`); vaqt, belgilar va savol matnlari Mentorga ro'yxatda va proyektorga chiqmaydi — faqat sonlar (A-9). 6-ekranda proyektor uchun katta taymer va savol tugmalari (ko'ngilli).
    0-ekrandagi sinf ovozlari — faqat variantlar soni. Kim kimdan tez o'tgani sanalmaydi.
12. Testlar s4/s8 — `correctIdx` 2/0 = `INLINE_KEYS`; `RECAPS` {4, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {4, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
13. `ACHIEVEMENTS` 4 (`rightMarks`, `keepGoing`, `readyCheck`, `fullRehearsal`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
14. s11 `QYakun`: sarlavha **besh holat** — `pm-m12d13-repetitsiya` (`vaqt`, `demo`, `varaq[].belgi`, `tur`) va 7-ekran «Saqlash» bayrog'idan (P-046, E 54; ustunlik tartibi — 11-ekran); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50);
    `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②; ① holatdan yig'iladi, bir nechta qator bo'lishi mumkin); `keyingi` — «Zaxira dars: zalni tayyorlash». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
15. App.jsx `m12-13` qatoriga `comp: PmDressRehearsalLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 479-qator). Bu agent App.jsx ga tegmaydi.
- Darvozalar: `npm run gates -- src/12-Modull/PmDressRehearsalLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47) · taymer fon oynada (KOD 4) brauzerda sinaladi.
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md). «…» ichidagi qo'shtirnoqlar JS satrida ekranlanadi.

## REPO
Amaliy blok yo'q (PM darsi, kod ekrani yo'q) — o'quvchi repo'siga ham, `maydon-jamoa` ga ham tegilmaydi; demo o'quvchining o'z mahsulotida, mavjud holatida ko'rsatiladi. <!-- TAXMIN T4 -->

| Teg | Holat |
|---|---|
| `m14-dars-13-start` | = `m14-dars-12-done` |
| `m14-dars-13-done` | = `m14-dars-13-start` = `m14-dars-07-done` (tayanch 3 jadvali: 08…13-done = 07-done) |

«Ortda qoldingizmi» bu darsda yo'q (tayanch 3: birinchi amaliy blokda — 3-dars).
⛔ **«qur» uchun (Mentor misoli):** Mentor o'z chiqishini `m14-dars-07-done` holatidagi «Maydon Jamoa» bilan (laptop brauzerida brauzer ko'rinishi, telefon brauzeri — ikkinchi qurilma) mehmon yoki boshqa o'qituvchi oldida o'tadi; pitch vaqti, demo belgisi, 3 savol va belgilari — haqiqiy natijadan (Mentor rejimi, 6, 7-ekranlar).
Natija qanday chiqsa — shunday yoziladi; sabab to'qilmaydi.

## Manbalar (08.10.2026; o'quvchiga ko'rinmaydi)
- Dars mazmuni — `00-MODUL-TAYANCH.md` 1.13 (aynan: Demo Day 8 formatida to'liq o'tish, hakam varag'i — butun chiqish, demo oldidan to'rt narsa), 1.6 (demo stsenariysi, B reja, demo joyi), 1.8 (savol-javob qoidasi), 1.1 (olti bo'lak), 1.14; atamalar — 2; kalit — 8; to'lqin kelishuvlari — 9.1, 9.2, 9.3, 9.6, 9.8, 9.9, 9.10, 9.13.
- Dastur — `00-MANBA.md` 1 (13-qator: «Генеральная репетиция — Real hakamlar oldidan to'liq progon»; 16-qator: «Demo Day 8 — hakamlar: 5–7 investor va tadbirkor · 5 daqiqa pitch + Q&A»). Menyu — `src/App.jsx` 478–482 (grep 08.10).
- **Render** bepul xizmati: 15 daqiqa so'rovsiz qolsa uxlaydi, uyg'onishi ≈1 daqiqa — tayanch 6 va `00-MANBA.md` 5 (render.com/docs/free, 06.10.2026). Yangi tashqi fakt bu darsda yo'q.
- Taymer chizig'i va varaq naqshi — `src/10-Modull/PmGrowthPitchLesson.jsx` 780 (`TaymerChiziq`), 12-Modul `12-PmGrowthPitch-v3.md` 11-ekran (varaq, «Pitchdan oldin», guruh yo'rig'i) va `12-FILTR.md` 22, 23, 31, 32 (demo real odamlarsiz, «o'zgartirildi» va qayta baholash).
- Namuna akkaunt (`namuna = true`, sanoqqa kirmaydi) — 12-Modul tayanchi 9.44 c; telefon brauzeri — ikkinchi qurilma — 14-Modul tayanch 9.6 (07 pilot TS 4). Hakam ta'rifi va `HAKAM_SAVOL` — `01-PmInvestorPitch-v3.md` A-4, A-6.
- Ekran yozish vositasi, proyektor ulanishi, telefon modeli — tilga olinmadi (tayanch 6: tekshirilmagan).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **`pm-m12d13-repetitsiya` sxemasi** (tayanch 8: «2–13-darslar sxemasi aniqlashtiriladi»): `vaqt` — **pitch** vaqti, soniya, savol-javobsiz; pitch o'tilmagan bo'lsa `null` (tayanchda `n`) · `savollar` — berilgan savollar soni (0–3) · `varaq` — qatorlar `vaqt` · `demo` · `savol:<id>` (A-12; `demo` qatori = `demo` maydoni) ·
   **qo'shimcha `tur: 'hakam' | 'guruh' | 'yakka'`** — kim to'ldirgani (sinf 3: real/mashq; 5-dars `pm-m12d5-varaq.tur` naqshi). Taklif: tayanch 8 ga shunday yozilsin.
2. **5-ekran tanlovlari kalitga yozilmaydi** — dars holatida (`ccProgress`): faqat yakun va uyga vazifa ① uchun; keyingi dars o'qimaydi. Kerak bo'lsa: `tayyorlov: { backend, video, namuna, telefon: bool | null }`.
3. **Qo'shimcha o'qish:** `pm-m12d7-tekshiruv` (`urinishlar[].qayta`, `.buzildi`) — jadval qatorida yo'q, lekin tayanch 8 va 9.8 «13-dars o'qiydi» deydi — 5-ekran ogohlantirishi uchun o'qidim. `pm-m12d1-pitch` — tayanch 8 da 13 o'quvchi sifatida bor, **o'qimadim**: chiqishda pitch matni ekranda ko'rsatilmaydi (yoddan aytiladi).
4. **`pm-m12d8-final.savollar[].savol`** — 08 MD (A-12) da savol **matni** (1-savol — 5-darsdagi erkin hakam savoli bo'lishi mumkin). 13-dars `HAKAM_SAVOL` matni bilan so'zma-so'z solishtiradi (KOD 9); taklif: 8-dars `id` ham yozsin (`HAKAM_SAVOL` kaliti yoki `boshqa`) — solishtirish ishonchli bo'ladi.
5. **Hakam savollari — 7 ta** (9.3: `HAKAM_SAVOL` 6 + «Odamlar hozir bu ishni nima bilan qiladi?»). 1.8 dagi «Keyingi olti oyda nima qilasiz?» 9.3 ro'yxatida yo'q — qo'shmadim; 12-dars rejasidan keyin mos kelishi mumkin — qaror.
6. **Mehmon** — kim (taklif: boshqa guruh o'qituvchisi yoki ota-onalardan biri; tashkilotchi bilan kelishiladi), bo'lmasa — Mentor yolg'iz. Ismi darsda, kalitda, doskada yozilmaydi; savoli o'zi beradi («Boshqa savol»), matni saqlanmaydi.
7. **Guruh rotatsiyasi** — 12–15 o'quvchi, 90 daqiqa: Mentor va mehmon hamma chiqishga hakam bo'la olmaydi → guruhda tinglovchilardan biri hakam (`tur: 'guruh'`), Mentor va mehmon guruhlarni aylanadi. Muqobil — hamma butun sinf oldida (≈ 15 × 10 daqiqa — sig'maydi).
8. **«To'xtamasdan» qoidasi** (taymer yurganda «Qaytadan» yo'q; demo ochilmasa B reja yoki og'zaki) — tayanchda yo'q; «to'liq o'tish» va Demo Day formatidan men chiqardim (o'quvchi matnida «bu mashqda», «Demo Day'dagidek»).
9. **Vaqt belgisi** — «Sig'di» ≤ 5:00 (300 s), «Oshdi» > 5:00 — 9.1 jami; hakam bosmaydi, taymer o'zi yozadi.
10. **Hakam varag'i belgilari:** demo — «Ishladi» · «B reja» · «Ishlamadi» (tayanch 8 qiymatlari); savol — «Son yoki fakt bilan» · «Tekshirib aytaman» · «Javob savolga tegmadi» (1.8 qoidasidan); izoh maydoni yo'q (TAQIQLAR 3, sinf 9).
11. **Mentor pitchining matni 13-darsda o'quvchi ekranida ko'rsatilmaydi** (faqat bo'lak nomlari va vaqt). Mentor chiqishi — 8-darsdagi yakuniy pitch (9.2): Muammo, Yechim, Jamoa — 1.1 aynan; Bozor — «Mahalla futbolining Telegram guruhida — 60 a'zo; ilovada — 6 tashkilotchi. Boshqa mahallalarni hali tekshirmaganmiz.» ·
    Raqamlar — «… 3 tashkilotchi Pro uchun to'lashga tayyorligini yozdi — real to'lov hali yo'q.» · Keyingi qadam — «Uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinayman. Ilova hozir maydon egalariga xizmat qilmaydi — sizdan bitta so'rov: ular bilan tanishtiring.» (08 MD TS 3, 05 `MENTOR_TUZATISH` dan; 08 TS 3 tasdiqlansa — tayanch 1.1 ga «tuzatilgan holat» qatori).
    13-dars 3-ekran 2-vaziyatidagi javob («Boshqa mahallalarni hali tekshirmaganmiz — tekshirib aytaman.») tuzatilgan Bozor gapi bilan mos. O'quvchi pitchi ham ekranda ko'rsatilmaydi (yoddan aytiladi), shuning uchun 08 TS 4(c) dagi `pm-m12d8-final.bolaklar` 13-dars uchun shart emas.
12. **Demo ochilmasa yoki B rejaga o'tilsa — tuzatish qayerda?** Tayanch 1.0: kod faqat 3, 4, 6, 7-darslarda o'zgaradi. 13-darsda uyga vazifa ① — buzish yozuvi va Mentorga ko'rsatish; agentga tuzattirish — «Zaxira dars»dami yoki uydami — qaror.
13. **Ikkinchi misol (4-ekran)** — kitob almashish ilovasi (7-dars testi bilan bir olam; P-002).
14. **«8 daqiqagacha»** — 5:00 + 3 × 1 daqiqa (bu mashqdagi hisob). Demo Day'dagi savol-javob vaqti dasturda yozilmagan — o'quvchi matnida «bu mashqda».
15. **3-ekran vaziyatlari** — mashq vaziyatlari, Mentorning haqiqiy natijasi emas (yorliq «mashq vaziyati»); javob matnlari tayanch faktlaridan: «Boshqa mahallalarni hali tekshirmaganmiz» (1.1 Bozor), «o'yin e'loni, qo'shilish va eslatma» (1.0). Yangi son yo'q.
16. **Nishon nomlari** — Right Marks! · Keep Going! · Ready Check! · Full Rehearsal! (grep 08.10 — boshqa darslarda yo'q).
17. **`pm-m12d6-demo.otishVaqt`** — 6-ekranda bu mashqdagi Yechim vaqti (90 s) bilan solishtiriladi (bir o'lchov — soniya); 0-ekran maketida ko'rsatiladi. `otishVaqt` 6-darsda nimani o'lchashi (demo stsenariysining o'zimi) — 6 MD bilan kelishuv.
18. **Modul bo'yi bir mexanika va bir so'z (08, 05 MD lari bilan, 03:57 holati):** 6-ekrandagi «Keyingi bo'lak» (hakam bosadi, ixtiyoriy; bo'lak vaqtlari faqat ekranda) — 08 MD 6-ekran va TS 9 naqshi · guruhdagi odamlar — «tinglovchi» (05 MD so'zi), hakam bo'lgani — «hakam»; `tur: 'guruh'` — 05 `pm-m12d5-varaq.tur` bilan bir ·
    «tekshirib aytaman» va `HAKAM_SAVOL` (7) — 08 MD bilan aynan; 08 dagi Mentor javoblari (`MENTOR_JAVOB`) 13-darsda takrorlanmaydi — 3-ekran vaziyatlari boshqa savollarda (Bozor, Jamoa), to'qnashuv yo'q.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — 6–7-ekranlar ≈ 45 daqiqa: 4 kishilik guruhda 4 × (8 + 2) = 40 + almashish. 3 kishilik guruh tezroq. «Qur» pilotida 12–15 o'quvchi bilan taymer; sig'masa — 4-kishi uyga vazifa ① ga (foydalanuvchi qarori).
2. ⛔ **Mentor misolining to'liq repetitsiyasi va hakam varag'i** — pilotda; MD da faqat reja va mashq vaziyatlari. Mentor rejimidagi namuna shu natijaga bog'liq (REPO).
3. ⛔ **Bitta laptopda dars sahifasi va demo** — ikki oyna; taymerni hakam boshqaradi. Oyna almashganda taymer to'g'ri yurishi (KOD 4) va hakam qulay bosishi — pilotda. Muqobil: taymer hakamning o'z qurilmasida (lekin kalit gapiruvchining qurilmasida).
4. **Sinf tarmog'i** — 4 guruhda bir vaqtda 4 jonli demo va Backend uyg'onishi; sekinlashsa — B reja mashqi o'z-o'zidan bo'ladi, lekin «Ishlamadi» belgisi tarmoq aybi bo'lishi mumkin — 7-ekran O'qituvchi eslatmasi «B reja — demo nega ochilmagani ochiq qoldi» bilan.
5. **Tinglovchi hakam xolisligi** — do'stlik sababli hammasiga yashil belgi qo'yishi mumkin; `tur: 'guruh'` bilan ajratilgan, belgi faqat uch narsaga (sodda, tekshirsa bo'ladigan). Auditor ko'rsin.
6. **«Tekshirib aytaman»** — halol javob, lekin uchala savolga shu javob berilsa ham yakun 1-holatda («tegmadi» yo'q). Uyga vazifa ① shu savollarni qamraydi. Ehtimol, 2 va undan ko'p «Tekshirib aytaman» — 2-holat bo'lishi kerak — qaror.
7. **«Qaytadan» yo'qligi** — o'quvchi adashib boshlasa: birinchi 30 soniyada ↻ bor; keyin yo'q. Real Demo Day'da hakamlar qayta boshlashga ruxsat berishi mumkin — darsda «bu mashqda» qoidasi.
8. **Render 15 daqiqa** — guruhda navbat kutayotganda Backend uxlaydi; 6-ekran kulrang qatori va 5-ekran Yordami. Boshqa Backend xizmatida uxlash qoidasi boshqacha — «bepul Backend uxlagan bo'lsa» umumiy gap bilan.
9. **2-ekran 3-tugmasi** — «Qaytadan» tugmasi chizib o'chiriladi: o'quvchi buni Demo Day'ning rasmiy qoidasi deb o'ylashi mumkin; O'qituvchi eslatmasida «bu darsdagi qoida» deyilgan.
10. **Kartochkalar ekrani sarlavhasi «O'zingizni sinab ko'ring.»** — qolip (platforma) sarlavhasi; «sinab» ildizi darsda faqat shu yerda (07 pilot naqshi).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 18 band)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-11 taqsimot (≈86 + 4 zaxira) va ulgurmagan yo'l («Navbatim kelmadi», uyga vazifa ①, yakun 5-holat); ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi.
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — ikki oynali laptop va taymer (Shubhali 3), sinf tarmog'i (4), Mentor chiqishi (REPO ⛔); Render — faqat tayanch 6 fakti; proyektor va telefon modeli tilga olinmadi; tugma va menyu nomlari yozilmadi.
3. [x] **Saqlash kaliti — shartnoma** — A-12: tayanch 8 maydonlari aynan, har maydon ma'nosi, tipi, `null` holati, `varaq` qatorlari va belgilari, `tur` (real/mashq — TAYANCHGA SAVOL 1); ism, savol matni, login yozilmaydi; boshqa darslarning kalitlari faqat o'qiladi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor rejasida» (2-ekran `QIzoh`), «Bu mashqda» (2, 3-ekran xulosalari, kartochka 2, «Endi siz bilasiz» 2), «Mentor misolida» (5-ekran Yordam, takrorlash 4), «mashq vaziyati» (3-ekran); 3 savol, to'rt narsa — «bu darsda».
5. [x] **Kafolat va sabab da'vosi yo'q** — «tayyorsiz», «Demo Day'da ishlaydi» yo'q; natija — faqat hakam varag'ida; «B reja» belgisi «demo nega ochilmagani ochiq» (7-ekran eslatmasi); 4-ekran B izohi «bir daqiqagacha cho'zilishi mumkin».
6. [x] **Yakun, «Bajardim», nishon — faqat rost holatda** — yakun besh holat, «hech narsa» holati alohida (11-ekran; E 54); yakka rejim alohida sarlavha; 5, 7-ekran xulosalari tanlovdan; Full Rehearsal! tavsifi saqlashni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — «Sig'di» = 5:00 gacha; savol belgilari — javobda son yoki fakt bormi, «tekshirib aytaman» bormi, savolga tegdimi; to'liq repetitsiya va hakam varag'i ta'rifi dars bo'yi so'zma-so'z (2, 3-ekran, yakun, kartochka 1, 6).
8. [x] **Test: bitta himoyalanadigan javob** — 4-ekran: «video tayyor» D ni yopadi; 8-ekran: D «o'zgartirmay … keyingi safar» — o'lchovsiz; arena: har savolda kamida ikki turkum, inkor-savol yo'q, to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [x] **Real odamlar xavfsizligi** — hakam, mehmon, tinglovchi, tanish odam ismsiz (A-9, 6, 7-ekran, yakun); izoh maydoni yo'q; fidbek bo'lak haqida; podium — faqat test ballari; Mentor ro'yxatida faqat signallar; demo — namuna akkaunt, real odamlarsiz.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bu darsda agent va tekshiruv akkaunti yo'q; chiqishni o'quvchi o'zi o'tadi, belgini hakam qo'yadi.
11. [x] **Web-trek teng yo'l** — demo ikkala trekda laptop brauzerida, ikkinchi qurilma — telefon brauzeri yoki boshqa brauzer oynasi (5-ekran 4-karta); «demo yo'lingiz», «mahsulotingiz» (A-14).
12. [x] **Mentor misoli ichki izchil** — vaqt taqsimoti 9.1, B reja gapi 9.9, demo stsenariysi 1.6, `HAKAM_SAVOL` 9.3 aynan; Mentor pitchi matni o'quvchi ekranida yo'q, Mentor chiqishi — 8-dars yakuniy pitchi (TAYANCHGA SAVOL 11); keyingi qatorlar natijasi ochilmaydi.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — o'quvchi o'z demosini, o'z B reja yo'lini (video yoki og'zaki) tanlaydi; savolni hakam tanlaydi; Mentor misoli faqat Yordam va Mentor rejimida.
14. [x] **Uyga vazifa yengil va aniq** — ① faqat varaqdagi tuzatiladigan joy bo'lsa (holatdan), ② — bitta tanish odam, bitta repetitsiya; muddat — keyingi darsgacha; kod tuzatish yo'q.
15. [x] **Ayb da'vosi yo'q** — 5-ekran kartalarida noxush holatga bitta yo'l («kutib, yangilang», «og'zaki aytib berasiz», «namuna akkauntga o'ting», «boshqa brauzer oynasi»); «xatongiz emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — Demo Day natijasi va'da qilinmaydi; «Demo Day» faqat format sifatida (9.13); uyga vazifada keyingi qatorlar yo'q; arena 9 — «Kelgusi oyda chiqadigan yangilik» distraktor.
17. [x] **Pul va investitsiya** — bu darsda pul yo'q; pitch matni ko'rsatilmaydi; investitsiya summasi tilga olinmaydi; investor — faqat Demo Day hakamlari tarkibida (O'qituvchi eslatmasi).
18. [—] **Yosh va rasmiy shartlar** — bu darsda xalqaro sayt va dastur yo'q; Render — faqat tayanch 6 dagi rasmiy fakt bilan.
- [x] **RAD etilganlar (qayta ochilmaydi):** hookdagi «Aynan!» / «Qiziq fikr!» (0-ekran) · yakundagi «Keyingi dars — «…»» qatori (11-ekran) · Reja sarlavhasi — natija-gap (1-ekran) · ekranda ≤3 blok · keyssiz.
- [x] **12-Modul SABOQ E:** har variantning o'z chegarasi (E 40) · maketda hech narsa kesilmaydi (E 41) · taxmin qatori yashil xulosa ichida (2-ekran, E 42) · yorliq input ichida (6-ekran hakam tanlovi — E 43) · bittadan karta (3, 5, 7-ekran — E 53) · yakun standarti (E 50) · sarlavha har holatda rost (E 54).

## O'lchov
`md13/olchov.py` natijasi (qavsdagi sonlar skript bilan qo'yilgan: sanaladigan har matn ⟦…⟧ bilan belgilab yozildi, skript uzunligini qo'ydi):
```
Belgilar soni — bo'shliq bilan, ** siz (Python len). Qavsdagi uzunliklar: 150 ta — hammasi skript qo'ygan (⟦…⟧ markeridan), qo'lda son yozilmagan.
Sarlavha: 13 ta · 24–55 · ≤55
Xulosa: 8 ta · 51–95 · ≤110
Asosiy fikr: 1 ta · 107–107 · ≤110
Hook javobi: 3 ta · 69–86 · ≤120
Hook varianti: 3 ta · 37–40
To'g'ri izoh: 2 ta · 50–51 · ≤60
Xato izohi / QXato: 17 ta · 22–55 · ≤60
QIzoh: 5 ta · 86–103 · ≤110
Ipucha: 2 ta · 51–58 · ≤60
Test savoli: 2 ta · 55–70
Bashorat savoli: 1 ta · 55–55
Nishon: 4 ta · 38–44 · ≤48
Endi siz bilasiz: 5 ta · 58–93
Boshqa (kulrang, karta, yo'riq): 19 ta · 24–102
Mentor 0: 2 gap (134)
Mentor 1: 1 gap (82)
Mentor 2: 1 gap (83)
Mentor 3: 1 gap (53)
Mentor 5: 1 gap (89)
Mentor 6: 1 gap (68)
Mentor 6: 1 gap (71)
Mentor 7: 1 gap (74)
Mentor 7: 1 gap (58)
Test savoli 4: 9 so'z (70 belgi)
Test savoli 8: 8 so'z (55 belgi)
4-ekran: 46 · 45 · ✔40 · 40 | min/max 40/46 (+15%) | o'rtachadan eng katta og'ish 8%
8-ekran: ✔50 · 46 · 46 · 50 | min/max 46/50 (+9%) | o'rtachadan eng katta og'ish 4%
arena 1: ✔32 · 32 · 33 · 29 | min/max 29/33 (+14%) | o'rtachadan eng katta og'ish 8%
arena 2: 11 · ✔11 · 12 · 12 | min/max 11/12 (+9%) | o'rtachadan eng katta og'ish 4%
arena 3: 36 · 34 · ✔32 · 33 | min/max 32/36 (+12%) | o'rtachadan eng katta og'ish 7%
arena 4: 19 · 21 · 20 · ✔19 | min/max 19/21 (+11%) | o'rtachadan eng katta og'ish 6%
arena 5: ✔29 · 30 · 28 · 31 | min/max 28/31 (+11%) | o'rtachadan eng katta og'ish 5%
arena 6: 24 · ✔25 · 25 · 24 | min/max 24/25 (+4%) | o'rtachadan eng katta og'ish 2%
arena 7: 27 · 25 · ✔27 · 26 | min/max 25/27 (+8%) | o'rtachadan eng katta og'ish 5%
arena 8: 27 · 26 · 26 · ✔26 | min/max 26/27 (+4%) | o'rtachadan eng katta og'ish 3%
arena 9: ✔37 · 35 · 37 · 34 | min/max 34/37 (+9%) | o'rtachadan eng katta og'ish 5%
arena 10: 26 · ✔27 · 28 · 28 | min/max 26/28 (+8%) | o'rtachadan eng katta og'ish 5%
arena 11: 25 · 27 · ✔26 · 27 | min/max 25/27 (+8%) | o'rtachadan eng katta og'ish 5%
arena 12: 30 · 30 · 28 · ✔30 | min/max 28/30 (+7%) | o'rtachadan eng katta og'ish 5%
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```
Tekshiruv: chegaradan oshgan matn yo'q; test va arena variantlarida farq ≤15% (arena 2 — bir so'zli sonlar, «… savol»); to'g'ri javob hech qayerda yolg'iz eng uzun emas.

## TAXMIN belgilari
Jami 58 ta `<!-- TAXMIN Tn -->` belgisi (qavsda — nechta). Qaror-0 javobi boshqacha bo'lsa — aynan shu joylar tuzatiladi.
- **T1** (9) — olti bo'lak, pitch 5:00 + savol-javob (3 savol), vaqt taqsimoti — A. Darsning tayanchi — tushunchalar, ata · 2 · Butun chiqish · 11 · Dars yakuni
- **T2** (2) — Bozor — «hali tekshirilmagan» (3-ekran 2-vaziyat javobi) — A. Darsning tayanchi — tushunchalar, ata · 3 · Hakam varag'i
- **T4** (1) — teglar `m14-dars-NN` (PM: `-done` = `-start`) — REPO
- **T8** (16) — demo laptop brauzerida, telefon — ikkinchi qurilma, B reja — 60 soniyalik video, uyg'otish — A. Darsning tayanchi — tushunchalar, ata · Darsning ipi va bitta vizual · 2 · Butun chiqish · 3 · Hakam varag'i · 5 · Chiqishdan oldin · 6 · To'liq repetitsiya · 11 · Dars yakuni · Qisqa takrorlash oynalari
- **T9** (2) — 6-dars loyiha kuni shakli → `pm-m12d6-demo` (video, uyg'otish, stsenariy, otishVaqt) — A. Darsning tayanchi — tushunchalar, ata · 6 · To'liq repetitsiya
- **T10** (3) — «demo o'tishi», «sinov» so'zi yo'q — boshi · A. Darsning tayanchi — tushunchalar, ata
- **T11** (9) — pitch darslari farqi: 13 — Demo Day formatida to'liq repetitsiya, hakam varag'i (Mentor, mehmon) — A. Darsning tayanchi — tushunchalar, ata · Darsning ipi va bitta vizual · 0 · Kirish · 2 · Butun chiqish · 6 · To'liq repetitsiya
- **T12** (2) — video qoidasi — hech qayerga yuklanmaydi, telefonda qoladi — A. Darsning tayanchi — tushunchalar, ata · 11 · Dars yakuni
- **T17** (4) — Demo Day 8 tartibi 13-dars MD sida (general repetitsiya — o'sha formatda) — A. Darsning tayanchi — tushunchalar, ata · 2 · Butun chiqish
- **T19** (6) — atamalar: hakam, savol-javob, hakam varag'i — A. Darsning tayanchi — tushunchalar, ata · 2 · Butun chiqish · 3 · Hakam varag'i · 6 · To'liq repetitsiya
- **T20** (4) — dars nomlari (13 va keyingi qator «Zaxira dars: zalni tayyorlash») — boshi · 0 · Kirish · 11 · Dars yakuni

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 478–480 (grep 08.10) — `m12-12` «Keyingi olti oyda nima qilasiz?» → **`m12-13` «Demo Day'ga tayyormisiz?»** (osti «hakamlar oldidan to'liq repetitsiya» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m12-14` «Zaxira dars: zalni tayyorlash» (yakundagi «Keyingi dars» qatori; `comp` siz). Hook sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» chiqishi (vaqt taqsimoti 9.1, demo stsenariysi va B reja 1.6, 9.9); ikkinchi misol faqat testda (kitob almashish ilovasi — P-002); keyssiz; metafora yo'q; bitta vizual — `ChiqishSahna` (taymer · laptop · telefon · hakamlar · varaq).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → chiziq yuradi, demo, savol kataklari, B reja), 3 (belgi → varaq qatoriga uchadi) + 0, 5, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md13/olchov.py`): sarlavha ≤55 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · to'g'ri izoh va xato izohi ≤60 — «O'lchov» bo'limi.
- [x] Atamalar oldingi darslar bilan bir (grep, tayanch 2; A-3): pitch, repetitsiya, taymer, baholash varag'i, namuna akkaunt — 9–12-Modul · olti bo'lak, hakam, savol-javob — 1-dars · demo stsenariysi, demo o'tishi, B reja, uyg'otish — 6, 7-darslar · «tekshirib aytaman» — 8-dars;
  yangi: to'liq repetitsiya, hakam varag'i — misoldan keyin, ta'rif dars bo'yi bir xil · siz-forma; tugmalar ot-shaklda yoki siz-formada («5 daqiqani boshlash», «To'xtatish», «Saqlash», «Keyingi», «Navbatim kelmadi»).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (O'lchov); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas; inkor-savol yo'q · ✔ o'rni 4-ekran C, 8-ekran A (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM 12 shakli; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ ↻ ⛶ — belgilar) · kafolat so'zlari yo'q · xulosalar «Bu mashqda» bilan chegaralangan · «sinov» — o'quvchi matnida yo'q (faqat qolip sarlavhasi).
- [x] Ichki kodlar o'quvchi matnida yo'q (`m12-13`, «Modul 14», K-raqam, «pilot», «TAXMIN» yo'q; modul/dars raqami — «6-darsda», «7-darsda», «8-darsda»); «KOD» ro'yxati 15 band, REPO — teglar jadvali va ⛔.
- [x] Karta T · P · S · PM: T-008 (B reja gapi, vaziyatlardagi javoblar — olam matni) · T-011/PM-030 (to'liq repetitsiya — 2-ekran 3-tugmasidan keyin; hakam varag'i — 3-ekran oxirida; sarlavhalarda yo'q) · T-014/T-015 (A-5: chiqish · pitch · savol-javob; mehmon — bir ma'noda) · T-016/T-017 (metafora yo'q) ·
  T-020 · T-024 · T-029/T-047 (Mentor bashorat yorlig'ini takrorlamaydi) · T-035 (o'quvchi matnida → yo'q) · T-038 (keyingi qatorlar — faqat «Keyingi dars») · T-039 («chiqishingiz» — pitch bor) · T-042 · T-043 · T-045 · T-048 · T-049 · T-052 (baholash varag'i bilan bog'landi) · T-064 · T-070 ·
  P-001 · P-002 · P-004 · P-008 · P-012 (testlar 4, 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-033 · P-036 (0-ekran birlashishni ochmaydi) · P-046 · P-048 · P-052 · P-062 (5-ekran) · P-063 (`HAKAM_SAVOL`, `CHIQISH_VAQT`, `VARAQ_BELGI`) · P-064 · P-067 ·
  S-001 · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 (arena 7: savolda 5:20 — mashq soni, javobda son yo'q) · S-020 · S-026 · S-027 · §19 (5-ekran — honor-belgi emas) · §102 · §106 · §144/§145 · PM-005 (2-tur) · PM-018 · PM-021 · PM-027 · J-026 · SABOQ 1–39, E 40–55.
- [x] Halollik va xavfsizlik (TAQIQLAR 0, 1, 3; tayanch 1.13): hakam, mehmon ismsiz, gapi to'qilmagan; Mentor chiqishi to'qilmagan (⛔); izoh maydoni yo'q; podium — test ballari; demo — namuna akkaunt bilan; «Demo Day» — faqat shu darsda, format sifatida (9.13).
- [ ] ⛔ «qur» darvozalari ochiq: Mentor chiqishi (REPO), ikki oynali laptop va taymer (Shubhali 3), 90 daqiqa (Shubhali 1) — pilot va foydalanuvchi qarori kerak; TAYANCHGA SAVOL 1 (`tur`, `vaqt | null`), 12 (demo tuzatish joyi) — qaror kerak.
