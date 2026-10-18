# 13-Modul (kod: `src/11-Modull`) · 11-dars (PM) «Mahsulotingiz hozir qayerda?» — MD v3

Fayl: `src/11-Modull/PmReflectionLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m11-11` · **12 ekran** (qisqa PM shakli — tayanch 4, 11-dars qatori; Qaror-0 18) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · kartada rangli yon chiziq yo'q · ko'p elementli mashq ketma-ket, bir vaqtda bitta katta karta (E 53) · odamlar real ko'rinishda (SABOQ 36) ·
ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 5-ekran — **D** (`3`) · 8-ekran — **A** (`0`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 454–456, grep 07.10, DE-205): `m11-10` «Loyiha kuni: taklif havolasi va mukofot» → **`m11-11` «Mahsulotingiz hozir qayerda?»** (osti: «roadmap bilan solishtirish va shaxsiy hisobot», `type: 'PM'`) → `m11-12` «Loyiha kuni: barqarorlashtirish».
Tur (PM-005): **2-tur sof PM** — artefakt yozma matn (roadmap'dagi har ishning holati va sababi + shaxsiy hisobot — uch javob), mustaqil ish majburiy (6, 7-ekranlar). **Keys — K17 Tesla** (tayanch 5, Qaror-0 21; bank so'zi aynan, raqamsiz). **Kod ekrani yo'q** (tayanch 4). REPO yo'q (tayanch 3: `m13-dars-11-done` = `10-done`).
Vaqt: ≈ 90 daqiqa (taqsimot — A-10; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (1.0 · **1.11 — roadmap'dagi ish holatlari, Mentor misoli, uch savol va Mentorning uch javobi, K17 ko'prigi — AYNAN** · 1.4, 1.8, 1.10 — telefon dalillaridagi ekran matnlari · 1.13 · 2 · 4 · 5 · 7 · 8 — `pm-m11d11-refleksiya` · 9) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 18, 21, 22) · `00-TAQIQLAR.md` (0, 1, 2, 4, 5, 6, 7) · `00-NOMLAR.md` · 11-Modul tayanchi (1.4 — uch asosiy funksiya · **1.5 — roadmap va uch ufq** · 1.9 — 15-dars holatlari · 8 — `pm-m9d6-roadmap`, `pm-m9d15-reja`) ·
12-Modul tayanchi (1.1 — lending · 1.4 — eslatma · 1.11, 9.43 a — dalil) · `PM_Prompt_v8.md` K17 (253–256-qatorlar) ·
namunalar: 12-Modul `11-PmPitchReview-v3.md` + `11-FILTR.md` (12 ekranli qisqa PM) · 11-Modul `15-PmOneOnOne-v3.md` + `15-FILTR.md` (roadmap holatlari, doska) · pilot `06-PmMoneyTalk-v3.md` (13-Modul shakli va uslubi).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «11-Modulda» (roadmap; kod `9-Modull`), «12-Modulda», «1-darsda», «4-darsda», «9-darsdagi» (shu modul); «8-Modulda» — faqat O'qituvchi eslatmasida. Kod raqami faqat fayl yo'lida.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual

1. **Darsning bitta natijasi** (dastur: «Mahsulot va roadmap; shaxsiy PM-hisobot → yozma refleksiya»; tayanch 4: «roadmap bilan solishtirish va shaxsiy hisobot»; Qaror-0 18):
   o'quvchi 11-Moduldagi roadmap'ini (`pm-m9d6-roadmap`) ochadi va har ishga **holat** qo'yadi — **bajarildi** · **kechikdi** · **olib tashlandi** (uzoqroq ufqidagi ishga — yana **uzoqroqda qoldi**) — va yoniga **bir qator sabab** yozadi;
   roadmap'da yo'q, lekin mahsulotga qo'shilgan ishlarni **yangi qo'shildi** deb qo'shadi (6-ekran). Keyin **shaxsiy hisobot** — uch savolga yozma javob (7-ekran; Qaror-0 18 aynan):
   «O'z qarorim bilan nima qildim?» · «Qaysi qarorim noto'g'ri chiqdi va buni qaysi dalil ko'rsatdi?» · «Keyingi 4 haftada nima qilaman?». Saqlanadi `pm-m11d11-refleksiya`.
   Bugun — ortga qarash: mahsulot va o'zim (tayanch 1.11). Repo'ga yozilmaydi, agent yo'q. «Keyingi 4 hafta» — o'quvchining o'z rejasi; keyingi modul va bitiruv himoyasi ekranda va'da qilinmaydi (T-038).
   Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab): solishtirish va hisobot saqlangan · faqat solishtirish · faqat hisobot · boshlangan, saqlanmagan · boshlanmagan. ✓ va nishon — faqat birinchi holatda.
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Roadmap bilan solishtirsangiz, ishlar qayerda ekani ko'rinadi; hisobotda qarorlaringiz dalil bilan yoziladi. (108)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 11-Modul 6-darsi: **roadmap** — uch ufqli reja, bitiruvgacha; **ufq**; ustun yorliqlari aynan: **Hozir · 11-Modul** · **Keyinroq · 12–13-Modul** · **Uzoqroq · bitiruvdan keyin** (11-Modul tayanchi 1.5) · **ish** — roadmap'dagi bir qator (6-darsdagi jadvalning «Ish» ustuni).
   - 11-Modul 15-darsi: **holat** — «bajarildi, kechikdi yoki boshlanmadi»; o'shanda hozir ufqidagi ishning vaqti — o'z darsi edi (11-Modul 15-FILTR 1). Bugun — ufq bo'yicha va yangi ishlar bilan (A-4; TAYANCHGA SAVOL 2).
   - 11-Modul 4–5-darslar: **muammo gapi** (bugun faqat Mentor sababida) · **uch asosiy funksiya** nomlari aynan: «O'yin e'loni va qo'shilish» · «O'yin kuni tasdiq» · «Chiqish va navbat» (11-Modul tayanchi 1.4).
   - 12-Modul: **lending** · **eslatma** · ro'yxat o'zi yangilanadi · **dalil** — «da'voni ko'rsatadigan son yoki yozuv» (11-dars; tayanch 9.43 a — son yoki yozuv · manba · qachon).
   - 13-Modul 1–10-darslar: **Pro** · **«Doimiy o'yin»** · **narx** · **xarajat** (4-dars) · **to'lov taklifi ekrani** · **test rejim** («Test rejim: pul yechilmaydi») · **suhbat** (6-dars) · **yozma tasdiq** (9-dars) · **Telegram xabari** · **taklif havolasi** · «Mentorning taxmini».
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **holat** (bu darsda) — «Bu darsda holat roadmap'dagi ish o'z ufqiga qarab qayerda ekanini aytadi; yonida — bir qator sabab.» (2-ekran xulosasi — Mentor kartalari belgilangandan keyin; yakun 1-qatori; kartochka 1).
     11-Modul 15-darsidagi «holat» bilan ko'prik (T-052): o'sha so'z; o'shanda vaqt — ishning darsi edi, bugun — ufqi; «boshlanmadi» o'rnida bugun — besh nom (2-ekran O'qituvchi eslatmasi, kartochka 3 izohi).
   - **bajarildi** — «roadmap'dagi ish o'z ufqi ichida tugagan va hozir ishlaydi» (2-ekran, 1-kartadan keyin `QIzoh`).
   - **kechikdi** — «ish o'z ufqi ichida tugamagan: keyin tugagan yoki hali yo'q» (6-ekran, o'quvchi birinchi marta bosgandan keyin `QIzoh`). Mentor misolida kechikkan ish yo'q — 2-ekran oxirgi `QIzoh` buni ochiq aytadi.
     Bu darsda keyinroq ufqidagi hali qilinmagan ish ham — kechikdi (6-ekran Yordam; TAYANCHGA SAVOL 19).
   - **olib tashlandi** — «ish endi qilinmaydi» (6-ekran, birinchi bosishdan keyin `QIzoh`). Ish doskadan o'chmaydi — nomi ustidan chiziq va sababi bilan qoladi.
   - **uzoqroqda qoldi** — «vaqti hali kelmagan ish o'z ustunida turibdi» (2-ekran, 4-kartadan keyin `QIzoh`; tayanch 1.11 Mentor misoli). Faqat «Uzoqroq · bitiruvdan keyin» ustunidagi ishga (TAYANCHGA SAVOL 1).
   - **yangi qo'shildi** — «roadmap'da yo'q edi, lekin mahsulotga qo'shildi» (2-ekran, 5-kartadan keyin `QIzoh`).
   - **sabab** — kundalik so'z; har holat yonida bitta qator (Qaror-0 18: «+ sabab»). Alohida ta'rif ekrani yo'q.
   - **shaxsiy hisobot** — «o'z qarorlaringiz haqida uch savolga yozma javob» (7-ekran, uchala javob saqlangach `QIzoh`; kartochka 10; yakun). Ta'rif meniki — TAYANCHGA SAVOL 4.
   - **qaror** — kundalik so'z: o'quvchi o'zi tanlagan narsa (agent yoki Mentor emas — 7-ekran Yordam).
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«holat»** — faqat roadmap'dagi ishning holati. Besh nom — tugma yozuvi, doska yorlig'i, kartochka va yakunda aynan bir xil. «boshlanmadi» — faqat 6-ekrandagi tarix qatorida (11-Modul 15-darsidagi holat) va O'qituvchi eslatmasidagi ko'prikda.
   - **«ish»** — roadmap qatori (11-Modul so'zi); **«funksiya»** — faqat «uch asosiy funksiya» iborasida; **«yangi ish»** — roadmap'da yo'q, lekin qilingan ish (6-ekran).
   - **«roadmap»** — o'quvchining yoki Mentorning uch ufqli rejasi (artefakt nomi). «roadmap'da yo'q» — yangi ish haqida. **«reja»** yolg'iz — faqat Tesla voqeasida («maxfiy master-reja», «reja ochiq yozilgan»); roadmap'ning sinonimi bo'lib ishlatilmaydi (T-014).
   - **«ufq»** va ustun nomlari — 11-Modul tayanchi 1.5 aynan. **«solishtirish»** — dars natijasining so'zi (App.jsx osti).
   - **«dalil»** — 12-Modul ma'nosida: son yoki yozuv (7-ekran 2-savol, 8-ekran). **«isbot»** — o'quvchi matnida yo'q.
   - **«tasdiq»** — ikki joyda, har biri o'z nomi bilan: «O'yin kuni tasdiq» — 11-Modul funksiyasining atoqli nomi (2-ekran); Mentorning 3-javobidagi «Tasdiq bergan» — 9-darsdagi yozma tasdiq (javob ostida kulrang yorliq; TAYANCHGA SAVOL 14). Dalil tugmasida — «yozma tasdiqlar».
   - **«Pro va test to'lov»** — Mentor misolidagi yangi ishning nomi (tayanch 1.11 aynan); boshqa joyda — «test rejim».
   - **«Telegram xabari»**, **«taklif havolasi»**, **«lending»**, **«eslatma»** — ish nomlari, tayanch 2 ma'nosida; Telegram — bu darsda asbob, keys emas (TAQIQLAR 8).
   - **«noto'g'ri chiqqan qaror»** — Qaror-0 18 so'zi; «xato», «xatolarim», «yutqazdim» shaxsiy hisobot haqida ishlatilmaydi.
   - **Ishlatilmaydi:** refleksiya (o'quvchi matnida; faqat kalit nomida), progress, status, retrospektiva, risk va yakkama-yakka (11-Modul 15-darsi va 12-Modul 11-darsida edi — bugun takrorlanmaydi), isbot, va'da, KPI, investor, Demo Day, 14-Modul, bitiruv himoyasi, daftar, keys, K17, pilot.
6. **Mentor misoli (tayanch 1.11 — AYNAN; o'quvchi matnida «Mentor misolida»):**
   - **Roadmap (11-Modul 1.5) — oltita ish:** Hozir · 11-Modul — «O'yin e'loni va qo'shilish» · «O'yin kuni tasdiq» · «Chiqish va navbat»; Keyinroq · 12–13-Modul — «O'yindan oldin eslatma» · «Ro'yxat o'zi yangilanadi»; Uzoqroq · bitiruvdan keyin — «Maydon pulini bo'lishish».
   - **Holatlar (1.11 aynan; `MENTOR_ROADMAP`):** uch asosiy funksiya — bajarildi (11-Modul) · o'yindan oldin eslatma — bajarildi (12-Modul) · ro'yxat o'zi yangilanadi — bajarildi (12-Modul) ·
     maydon pulini bo'lishish — uzoqroqda qoldi (sabab: muammo gapidan kelmaydi; 2-darsda solishtirildi) · yangi qo'shildi: lending, Pro va test to'lov, Telegram xabari, taklif havolasi (sabab: 50 foydalanuvchi va pul — 12–13-Modul ishi).
     Kartadagi sabab qatorlari: «11-Modulda qurildi» · «12-Modulda qurildi» · «muammo gapidan kelmaydi; 2-darsda solishtirildi» · «50 foydalanuvchi va pul — 12–13-Modul ishi» (birinchi ikkitasi — tayanchdagi qavsning gapga aylangani; TAYANCHGA SAVOL 6).
     «Chiqish va navbat» — 11-Modul tayanchi 1.9: 14-darsda navbat ikki marta ishlamadi, darsdan keyin ishladi — 11-Modul ichida. Bugun holat ufq bo'yicha — bajarildi; 1-karta ostida shu fakt kulrang qator bo'lib turadi (TAYANCHGA SAVOL 2).
   - **Mentorning uch javobi (1.11 so'zma-so'z; `MENTOR_JAVOBLAR`):** 1) «Pro'ni o'yinchiga emas, tashkilotchiga qo'ydim.» · 2) «1-darsda narxni 10 000 deb taxmin qildim; 4-darsda xarajatni qo'shib, narxni qayta ko'rdim.» ·
     3) «To'lashga tayyorligini yozgan uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinab ko'raman.» Javoblar — olam ichidagi matn (T-008). 2-javobdagi «10 000» yonida kulrang yorliq «Mentorning taxmini» (TAQIQLAR 1); 3-javob ostida kulrang: tasdiq — 9-darsdagi yozma tasdiq.
   - **Telefon dalillari (2-ekran; faqat tayanchlardagi ekran matnlari):** namuna o'yin «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «9 / 10», «Qo'shilaman», «Kelaman», «Navbatga yozilish» (11-Modul 1.4, 1.7) ·
     eslatma — sarlavha «Maydon Jamoa», matn «Bugun, 18:00 · Mahalla maydoni» (12-Modul 1.4) · ulanish belgisi «Ulangan» (12-Modul 9.1) · lending sarlavhasi «Mahalla futboliga jamoani bir joyda yig'ing» (12-Modul 1.1) ·
     to'lov taklifi ekrani «Doimiy o'yin — Pro'da» · «30 kun — 15 000 so'm» · «To'lovga o'tish» · «Test rejim: pul yechilmaydi» (13-Modul 1.4) · Telegram xabari «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni» (1.8) · lendingda «Taklif kodi: AB12CD» (1.10).
   - **Raqamlar:** 10 000 (2-javob; Mentorning taxmini) · uch tashkilotchi (3-javob; 9-dars natijasi — tayanch 1.9, 1.13) · 50 (sababda — 12-Modul maqsadi) · ekran matnlaridagi «8 / 10», «9 / 10», «3 / 10», «15 000» (narx qatori yonida «Mentorning taxmini»).
     2-ekran bashoratidagi «oltita» — Mentor roadmap'idagi ishlar soni (11-Modul 1.5). Boshqa son yo'q; keyingi darsning sonlari aytilmaydi.
7. **K17 Tesla (tayanch 5 aynan; `PM_Prompt_v8.md` K17):** bank matni — «2006-yilda Musk Tesla'ning «maxfiy master-rejasi»ni e'lon qilgan: avval qimmat sport mashinasi kichik seriyada → shu pulga arzonroq mashina → shu pulga ommaviy mashina. Reja ochiq bo'lgan va o'n yildan ortiq bajarilgan.» Raqamsiz (2006 — voqea yili, bankda bor).
   Brend izohi (S-018): «Tesla — elektromobil ishlab chiqaradigan kompaniya». Ko'prik (aynan): «Bu voqeada reja ochiq yozilgan va bosqichma-bosqich bajarilgan. Roadmap ham shuning uchun yoziladi: keyin nima bajarilganini solishtirish uchun.» — 4-ekranda xulosa va `QIzoh` ga bo'linadi (≤110).
   O'quvchi matnida bosqichlar to'liq gap bilan, strelkasiz (TAQIQLAR 5): «avval qimmat sport mashinasi kichik seriyada, ya'ni oz sonda. Uning pulidan — arzonroq mashina, uning pulidan esa — ommaviy mashina.» — «shu pulga» o'rniga «uning pulidan»: bankning ruscha aslida «o'sha pul hisobiga» ma'nosi (TAYANCHGA SAVOL 12).
   Bank aytmaydigan narsa qo'shilmaydi: bosqichlar qachon tugagani, sotuv sonlari, narxlar, «reja muvaffaqiyatli bo'ldi». «Musk» — faqat rejani e'lon qilgan kishi sifatida (mahsulot qarori). Logotip yo'q; nom o'z rangida.
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** uy vazifalari ilovasi (3-ekran) · kitob almashish ilovasi (8-ekran; 12-Modul testlari olami). Metafora yo'q.
9. **Shaxsiy hisobot, xavfsizlik va pul (TAQIQLAR 1, 3):**
   - hisobot — o'quvchining o'z matni: Mentor ekraniga, proyektorga, podiumga chiqmaydi — faqat «Hisobot yozdi» signali (KOD 9); 7-ekran tepasida shu haqda bitta kulrang qator;
   - matnda ism, telefon, akkaunt nomi yo'q (6, 7-ekran tekshiruvi bloklaydi); sinfda kim qaysi qarorini noto'g'ri deb yozgani so'ralmaydi va o'qitilmaydi;
   - bugun to'lov yo'q: Mentor 5-kartasidagi to'lov taklifi ekranida «Test rejim: pul yechilmaydi»; karta formasi chizilmaydi; 7-ekran 3-savolida real pul so'zlari — yumshoq eslatma («Bu kursda real pul olinmaydi»).
10. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 6 · holatlar (2) ≈ 12 · 1-savol (3) ≈ 3 · Tesla (4) ≈ 8 · 2-savol (5) ≈ 3 · o'z roadmap'ingiz (6) ≈ 20 · shaxsiy hisobot (7) ≈ 18 ·
    yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 17 · zaxira ≈ 3.
    **Ulgurmagan o'quvchi yo'li:** 6-ekranda ish ko'p bo'lsa — avval Hozir va Keyinroq ustunlari; Uzoqroq ustunidagi ishlar sukut bo'yicha «uzoqroqda qoldi» bo'lib turadi, faqat sababi so'raladi · 7-ekran tugamasa — yakun «hisobot hali tugamagan», uyga vazifa ③ ·
    jonli darsda 6, 7 — `optionalLive`. Tashqi kutish yo'q (repo, build, xizmat yo'q).
11. **Saqlash kalitlari (tayanch 8):**
    - **o'qiydi:** `pm-m9d6-roadmap` (`ishlar[].nom`, `ishlar[].ufq` — 0, 1, 6-ekranlar) · `pm-m9d15-reja` (`holatlar[{ ish, holat }]` — 6-ekrandagi tarix qatori; ish nomi bo'yicha moslanadi) · `pm-m11d2-model` (`model`, `kim`, `nima` — 6-ekrandagi taklif tugmasi va 7-ekran 1-savol qatori) ·
      `pm-m11d6-suhbat` (`suhbatlar[]` — faqat `tur: 'real'`, `javob` bo'yicha sanoq — 7-ekran dalil tugmasi) · `pm-m11d9-tasdiq` (`soralgan`, `hisobga: true` yozma tasdiqlar soni — dalil tugmasi; F-1007-467) · `pm-m11d1-birlik.narxTaxmin` (faqat `tur: 'real'`) va `pm-m11d4-narx.narx` (ikkalasi bo'lsa — dalil tugmasi; TAYANCHGA SAVOL 11).
      Yo'q bo'lsa: roadmap — o'quvchi ishlarni o'zi yozadi (6-ekran); qolganlari — tegishli qator yoki tugma ko'rinmaydi. `tur: 'mashq'` sonlari dalil tugmasiga kirmaydi (tayanch 9.19). `pm-m11d7-hujjat` bu darsda o'qilmaydi (TAYANCHGA SAVOL 11).
    - **yozadi:** `pm-m11d11-refleksiya` = `{ roadmapManba, ishlar: [{ nom, ufq, holat, sabab }], javoblar: { qarorim, notogri, keyingi }, savedAt, completedAt }` — maydonlar shartnomasi (F-1007-469):
      `roadmapManba` — `'saqlangan'` (`pm-m9d6-roadmap` dan) | `'qayta-yozilgan'` (topilmagan, o'quvchi eslab yozgan) ·
      `nom` — roadmap'dagi nom (o'zgarmaydi) yoki o'quvchi yozgan yangi ish nomi (≤ 60) · `ufq` — `'hozir' | 'keyinroq' | 'uzoqroq' | null` (roadmap'dan; yangi ishda `null`; maydon — TAYANCHGA SAVOL 10) ·
      `holat` — `'bajarildi' | 'kechikdi' | 'olib-tashlandi' | 'uzoqroqda' | 'yangi'` (`'uzoqroqda'` faqat `ufq: 'uzoqroq'` da, `'yangi'` faqat `ufq: null` da) · `sabab` — bitta qator, ≤ 80, bo'sh emas ·
      `ishlar` tartibi — roadmap tartibi, keyin yangi ishlar; 6-ekran «Saqlash»i yozadi (hamma ishga holat va sabab qo'yilgach) · `javoblar` — `{ qarorim, notogri, keyingi }`, har biri `string | null` (savol tartibi o'zgarsa ham ma'no qoladi), 7-ekranning har «Saqlash»i o'z maydoniga yozadi (≤ 200) · `savedAt` — oxirgi saqlash vaqti, har saqlashda yangilanadi · `completedAt` — `ishlar` va uchala javob birinchi marta to'liq saqlangan vaqt, aks holda `null` (tugatilgan kun — shu).
      Kalitga ism, login, telefon, Telegram nomi yozilmaydi. Mentor misoli kalitga yozilmaydi. Dars boshqa darsning kalitiga yozmaydi. Kod qoralamasi kaliti yo'q (kod ekrani yo'q).
12. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q («har doim», «hech qachon», «darrov», «albatta», «100%»); belgi-formula (→, ×, =) o'quvchi izohida yo'q.
13. **Kod ekrani yo'q** (tayanch 4: PM darslarida mexanika ketma-ket takrorlanmaydi — 9 — yo'q · 10 — bloklar · 11 — yo'q). **Trek:** PM darsi, blok yo'q — ikkala trekka bir xil; sarlavha va savollarda «mahsulotingiz».

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1):** 1–10-darslarda «Maydon Jamoa» pul topa boshladi: Pro (tashkilotchi uchun), test rejimdagi to'lov, narx, suhbatlar, shartlar, Telegram xabari, taklif havolasi. Roadmap esa 11-Modul 6-darsida yozilgan, 15-darsida holatlar ko'rilgan edi.
  Bugun — to'xtab, ortga qarash: avval roadmap bilan bugungi mahsulot, keyin o'z qarorlaringiz.
- **Dars ipi:** 0 — roadmap'ingiz va bugungi mahsulotingiz: nima ko'rinadi (ballsiz) → 2 — Mentor roadmap'idagi ishlar telefondagi ilova bilan: har biriga holat (atama «holat» va besh nom) → 3 — test: roadmap'da yo'q ish →
  4 — Tesla: reja ochiq yozilgan va bosqichma-bosqich bajarilgan → 5 — test: roadmap bugun nimaga kerak → 6 — o'z roadmap'ingiz: holat va sabab, yangi ishlar → 7 — shaxsiy hisobot: uch savol →
  8 — yakuniy: noto'g'ri chiqqan qarorni nima ko'rsatadi → podium → kartochkalar → yakun (holatga qarab); uyda — bitta ish bo'yicha qaror.
- **Bitta vizual — «Holat doskasi» (`HolatDoska`, dars bo'yi; 163/180; bitta manba `MENTOR_ROADMAP` + `MENTOR_JAVOBLAR` + o'quvchi ma'lumoti):**
  - **doska (asosiy):** uch ustun — «Hozir · 11-Modul» · «Keyinroq · 12–13-Modul» · «Uzoqroq · bitiruvdan keyin» (11-Modul 15-darsi doskasi ko'rinishi; ufq yorlig'i ustun tepasida) + pastda butun eni bo'ylab **«Yangi qo'shildi»** qatori (bo'sh holatda uzuq chiziq — to'ldiriladigan joy, U-041).
    Ish kartasi: nom · holat yorlig'i (bo'sh holatda kulrang «?») · ostida sabab qatori (kulrang, bitta qator). Holat ranglari (D3): bajarildi — `ok` (✓) · kechikdi — `accent` chegara · olib tashlandi — `ink2`, nom ustidan chiziq · uzoqroqda qoldi — `ink2` · yangi qo'shildi — `accentSoft` fon. Qizil yo'q — kechikish va olib tashlash xato emas.
  - **telefon «Maydon Jamoa»** (chapda, ≈ 170×272 — SABOQ 22; nom 11-Modul yashilida, logotipsiz; 0, 1-ekranda faqat kalit yo'q bo'lsa, 2-ekranda — dalil sahnasi). O'quvchi mahsuloti chizilmaydi (darsda uning ekranlari yo'q) — o'quvchida doska bitta ustunda.
  - **hisobot varag'i** (7-ekran; 8-ekranda javobdan keyin kichik): sarlavha «Shaxsiy hisobotim» (Mentor misolida — «Mentor misoli · Maydon Jamoa»), uch raqamli qator: savol — kulrang, javob — qora.
  - Ko'rinishlar: to'liq (2, 6) · kichik (0, 1, 3 va 5 javobdan keyin) · ixcham chiziq (7-ekran tepasi: «Roadmap'im · {N} ish»). 4-ekranda — keys sahnasi (P-053: keysda boshqa maket bo'lsa, sahna uning o'rnini oladi).
  - `prefers-reduced-motion` da uchish va to'lqin yo'q — yakuniy holat birdan qo'yiladi. 393 kenglikda telefon doska ustida, o'lchami kichraymaydi; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · holat tugmasi bosilganda yorliq kartaga uchadi, karta o'z ustuniga sirg'aladi · yangi ish «Yangi qo'shildi» qatoriga uchadi · javob kartadan varaqqa uchadi · hisoblagich sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **Mahsulotingiz hozir qayerda?** (28) — dars nomi (DE-205)
- Mentor: Roadmap'ingizni 11-Modulda yozgansiz. Bugungi mahsulotingizni u bilan solishtirsangiz, nima ko'rinadi?
- Maket (chap; `HolatDoska` kichik): o'quvchining roadmap'i (`pm-m9d6-roadmap` bo'lsa) — uch ustun, har ustunda ish nomlari (uzun bo'lsa «…»), har kartada kulrang «?»; pastda bo'sh uzuq qator «Yangi qo'shildi».
  Roadmap saqlanmagan bo'lsa — Mentor misoli (yorliq «Mentor misoli · Maydon Jamoa», oltita ish — A-6), chapda kichik telefon: «O'yinlar» ekrani, «Shanba, 18:00 · Mahalla maydoni · 8 / 10».
- Variantlar (radio, o'ng; bir uzunlikda — P-016):
  - Roadmap'dagi ishlar bajarildi (29)
  - Ba'zi ishlarning vaqti hali kelmagan (36)
  - Roadmap'da yo'q ishlar qo'shildi (32)
- Javob (uchalasida bir xil, maqtovsiz — J-026, KORPUS §119): Uchalasi ham uchraydi: Mentor misolida bitta roadmap'da uchalasi bor. Har ish qayerda ekanini bugun belgilaysiz. (112)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; doskadagi «?» belgilari navbat bilan (100 ms) bir lahza ko'tarilib qaytadi, «Yangi qo'shildi» qatorining uzuq chizig'i bir marta yonadi —
  qaysi ishda qaysi holat ekani ochilmaydi (2-ekran kashfiyoti, P-036). Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Javoblarni muhokama qilmang — bugun har o'quvchi o'z roadmap'ini birma-bir ko'radi. Mentor misolida: besh ish bajarildi, bittasi hali qilinmagan (uzoqroq ufqda), roadmap'da yo'q to'rtta ish qo'shilgan.
  Roadmap'i saqlanmagan o'quvchi 6-ekranda ishlarni o'zi yozadi.
✎ Hook — o'quvchi o'zi qilgan ish (11-Modulda roadmap yozdi, 12–13-Modulda mahsulotga qo'shdi) va o'z savoli (P-016). Uch variant — Mentor misolidagi uch holat turi oddiy so'z bilan; payoff hech birini rad etmaydi (KORPUS §119).

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun mahsulotingizni roadmap bilan solishtirasiz.** (50)
- Mentor: 11-Modulda roadmap bo'yicha risklarni, 12-Modulda pitchdagi dalillarni ko'rgansiz. Endi ortga qaraysiz: nima qurildi va qarorlaringiz qanday chiqdi.
- Chap — yorliq «Dars oxirida — roadmap bilan solishtirish va shaxsiy hisobot» (App.jsx osti so'zma-so'z, P-015) + vizual: `HolatDoska` o'zi yuradi (DE-200) — uch ustun yorlig'i va ish nomlari navbat bilan kiradi (o'quvchiniki yoki Mentorniki — haqiqiy mazmun, SABOQ 33),
  har kartada kulrang «?»; pastda «Yangi qo'shildi» qatori uzuq chiziq bilan chiziladi; yonida kichik varaq «Shaxsiy hisobot» — uch raqamli bo'sh uzuq qator (o'quvchi 7-ekranda to'ldiradi — U-041). Holat nomlari va savollar matni ko'rinmaydi (2, 7-ekran kashfiyoti).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · Roadmap'dagi har ish bugun qayerda ekanini belgilaysiz · `holat`
  - 02 · Roadmap'da yo'q, lekin qilingan ishlarni qo'shasiz · `yangi qo'shildi`
  - 03 · O'z qarorlaringiz haqida savollarga javob yozasiz · `shaxsiy hisobot`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: 12-Modul 11-darsida pitchdagi da'volar va dalillar, 11-Modul 15-darsida Demo Day oldidan reja va risklar ko'rilgan; bugun — ortga qarash: mahsulot va o'zingiz (tayanch 1.11). Yakkama-yakka bu darsda yo'q.
- Izoh (MD): sarlavhada yangi atama yo'q (T-011: «solishtirasiz» — fe'l; «holat», «shaxsiy hisobot» — kulrang teglarda va App.jsx ostida, P-015). Mentorning birinchi gapi — tayanch 1.11 dagi farq (11-Modul 15-dars — reja va risklar, 12-Modul 11-dars — pitch da'volari va dalillari) bir gapda; ikkinchisi — bugungi ortga qarash. 03 qatorida savollar soni yo'q — u 7-ekran sarlavhasida (P-062).

## 2 · Holatlar  ← QTushuncha (markaziy; ketma-ket 5 karta — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · holat
- Sarlavha: **Mentor roadmap'idagi ishlar bugun qayerda?** (42)
- Mentor: Telefonda — Mentorning bugungi ilovasi: har kartaga mos holatni bosing.
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 zinapoya): **Mentor roadmap'idagi oltita ishdan nechtasi bajarildi?** · 4 · 5 · 6 — tanlangach yopilmaydi: ixcham qator «Taxminingiz: N» natijagacha turadi; holat tugmalari shundan keyin yoqiladi.
- Vizual (SABOQ 21 — telefon chapda, doska o'ngda; ≤ 3 blok: telefon · doska · tugmalar qatori):
  - **chapda — telefon «Maydon Jamoa»** (dalil sahnasi, har kartada almashadi);
  - **o'ngda — `HolatDoska`** (Mentor misoli, to'liq): oltita ish kartasi uch ustunda, hammasida «?»; «Yangi qo'shildi» qatori bo'sh (uzuq); joriy karta (yoki kartalar guruhi) accent halqada;
  - **doska ostida — besh tugma** (har kartada shu tartibda): Bajarildi · Kechikdi · Olib tashlandi · Uzoqroqda qoldi · Yangi qo'shildi.
- Kartalar (navbat bilan; tayanch 1.11 tartibi; telefon matnlari — A-6):
  1. **Uch asosiy funksiya** · Hozir · 11-Modul — «O'yin e'loni va qo'shilish» · «O'yin kuni tasdiq» · «Chiqish va navbat» (doskada uchta karta birga halqada).
     Telefon: «Shanba, 18:00 · Mahalla maydoni · 8 / 10» → «Qo'shilaman» bir marta bosiladi → «9 / 10»; keyin o'yin sahifasida «Kelaman»; to'lgan o'yinda «Navbatga yozilish».
     Karta ostida kulrang qator (dalil): 11-Modul 15-darsida «kechikdi» edi — o'z darsidan keyin, 11-Modul ichida ishladi. (81) ✔ Bajarildi → uch kartaga yashil «bajarildi» yorlig'i uchadi, ostida sabab qatori «11-Modulda qurildi».
     `QIzoh` (~3 s): Bajarildi — roadmap'dagi ish o'z ufqi ichida tugagan va hozir ishlaydi. (71)
  2. **O'yindan oldin eslatma** · Keyinroq · 12–13-Modul — telefon qulf ekrani: eslatma «Maydon Jamoa» · «Bugun, 18:00 · Mahalla maydoni». ✔ Bajarildi → sabab qatori «12-Modulda qurildi».
  3. **Ro'yxat o'zi yangilanadi** · Keyinroq · 12–13-Modul — telefon: tepada ulanish belgisi «Ulangan»; «8 / 10» hech narsa bosilmasdan «9 / 10» ga o'zgaradi (kulrang kichik yorliq «hech narsa bosilmadi»). ✔ Bajarildi → sabab qatori «12-Modulda qurildi».
  4. **Maydon pulini bo'lishish** · Uzoqroq · bitiruvdan keyin — telefonda bunday ekran yo'q: kulrang qator «ilovada yo'q»; doskada karta o'z ustunida, ustidan chiziq yo'q. ✔ Uzoqroqda qoldi → kulrang «uzoqroqda qoldi» yorlig'i, sabab qatori «muammo gapidan kelmaydi; 2-darsda solishtirildi».
     `QIzoh` (~3 s): Uzoqroqda qoldi — vaqti hali kelmagan ish o'z ustunida turibdi. (63)
  5. **Roadmap'da yo'q ishlar** — telefonda navbat bilan (har biri ~1 s): brauzerda lending «Mahalla futboliga jamoani bir joyda yig'ing» · to'lov taklifi ekrani «Doimiy o'yin — Pro'da», «30 kun — 15 000 so'm» (yonida kulrang «Mentorning taxmini»), «To'lovga o'tish», pastda kulrang «Test rejim: pul yechilmaydi» ·
     Telegram chati (sarlavha «Telegram» o'z rangida): «Shanba, 18:00 o'yini yana e'lon qilindi · Mahalla maydoni» · lendingdagi qator «Taklif kodi: AB12CD». Doska ustunlari bo'ylab kulrang tekshiruv chizig'i o'tadi — bunday karta yo'q.
     ✔ Yangi qo'shildi → to'rt karta telefondan «Yangi qo'shildi» qatoriga uchadi: «Lending» · «Pro va test to'lov» · «Telegram xabari» · «Taklif havolasi»; sabab qatori «50 foydalanuvchi va pul — 12–13-Modul ishi»; qator ustida kulrang yorliq «faqat katta ishlar» (F-1007-469).
     `QIzoh` (~3 s): Yangi qo'shildi — roadmap'da yo'q edi, lekin mahsulotga qo'shildi. (66)
- **Harakat → Vizual o'zgarish:** tugmani bosish → to'g'ri bo'lsa holat yorlig'i tugmadan kartaga uchadi (~1 s rangli), ostida sabab qatori yoziladi (5-kartada kartalar «Yangi qo'shildi» qatoriga uchadi); halqa keyingi kartaga o'tadi, telefon sahnasi almashadi.
  Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-karta, «Kechikdi»: Ufqiga qarang: uchalasi qaysi modulda qurildi? (46)
  - 1, 2, 3-karta, «Olib tashlandi» yoki «Uzoqroqda qoldi»; 4-karta, «Bajarildi»: Telefonga qarang: bu ish ilovada bormi? (39)
  - 2, 3-karta, «Kechikdi»: Ufqi — 12–13-Modul. U qaysi modulda qurildi? (44)
  - 1–4-karta, «Yangi qo'shildi»: Bu ish roadmap'da bor edi — qaysi ustunda? (42)
  - 4-karta, «Kechikdi»: Uning ufqi — bitiruvdan keyin. Vaqti keldimi? (45)
  - 4-karta, «Olib tashlandi»: Mentor uni roadmap'dan o'chirdimi — ustunga qarang. (51)
  - 5-karta, «Bajarildi»: Bajarildi — roadmap'dagi ish uchun. Bular unda bormidi? (55)
  - 5-karta, boshqa tugma: Bu ishlar roadmap'ning qaysi ustunida edi? (42)
- Natija (bitta blok — E 42; `tugadi`: tugmalar yopiladi, telefon yig'iladi, doska butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 5»;
  doskada: beshta «bajarildi», bitta «uzoqroqda qoldi», «Yangi qo'shildi» qatorida to'rtta ish — har birida sabab qatori.
- Xulosa: Bu darsda holat roadmap'dagi ish o'z ufqiga qarab qayerda ekanini aytadi; yonida — bir qator sabab. (99) — atama «holat» bu darsdagi ma'nosida shu yerda (T-011)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Mentor misolida kechikkan va olib tashlangan ish yo'q — sizda bo'lishi mumkin. (78)
- Tugma (pastki): Avval belgilang → Holat qo'ying (N/5) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Telefonda bu ish bormi va doskaning qaysi ustunida turibdi? (59)
- Keyingi bosiladigan joy: bashorat variantlari → besh tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Status Check! (besh karta birinchi urinishda).
- O'qituvchi eslatmasi: 11-Modul 15-darsida holat ishning o'z darsiga qarab qo'yilgan edi — o'shanda «Chiqish va navbat» kechikdi (14-darsda ishlamadi). Bugun roadmap'ga butun yo'l bilan qaraymiz: ishning vaqti — ufqi; navbat 11-Modul ichida ishladi — bajarildi.
  O'sha darsdagi «boshlanmadi» bugun ikkiga bo'lingan: vaqti kelmagan uzoqroq ish — «uzoqroqda qoldi», vaqti o'tib, qilinmagan ish — «kechikdi». Roadmap'da yo'q to'rtta ish — Mentor roadmap darajasidagi katta ishlarni yozgan; «Hozir ko'ryapti» kabi kichik qismlar alohida sanalmagan.
  «Maydon pulini bo'lishish» 2-darsda modellar bilan solishtirilgan, lekin roadmap'dan o'chirilmagan — shuning uchun «olib tashlandi» emas. Sinfga savol: «Sizning roadmap'ingizda kechikkan ish bormi?»
✎ Kartalar — tayanch 1.11 qatorlari: uch funksiya bitta qatorda, to'rt yangi ish bitta qatorda (TAYANCHGA SAVOL 5). Besh tugma tartibi o'zgarmaydi; Mentor misolida ikkitasi («Kechikdi», «Olib tashlandi») to'g'ri javob bo'lmaydi — ular 6-ekranda o'quvchining o'z ishlarida.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — uy vazifalari ilovasi, P-002)
- Eyebrow: Tekshiruv · holat (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Uy vazifalari ilovangizda eslatma bor, lekin roadmap'da yo'q edi. Holati?** (10 so'z)
  - A — Bajarildi: ilovada hozir ishlab turibdi (39)
  - ✔ B — Yangi qo'shildi: roadmap'dan tashqari ish (41)
  - C — Kechikdi: o'z ufqidan ancha keyin qo'shildi (43)
  - D — Uzoqroqda qoldi: keyinroq kerak bo'ladi (39)
- Kalit: **B** (index 1). To'rttalasi bir shaklda («Holat: izoh»); «qo'shildi» B va C da (kalit so'z faqat to'g'rida emas); to'g'ri javob yolg'iz eng uzun emas; savoldagi «yo'q edi» javobda takrorlanmaydi (S-008).
  Distraktorlar uch xil: A — «ishlayapti»ni «bajarildi» deb o'qish (eng ko'p chalkashlik) · C — vaqt holati (roadmap'da bo'lmagan ish kechika olmaydi) · D — ufq holati (ish allaqachon bor).
- To'g'ri izohi: Roadmap'da yo'q, lekin qilingan ish — yangi qo'shildi. (54)
- Xato izohlari (≤60):
  - A: Ishlayapti — lekin u roadmap'da bormidi? (40)
  - C: Kechikish uchun ish roadmap'da bo'lishi kerak edi. (50)
  - D: Eslatma allaqachon ilovada bor — keyin emas. (44)
  - (umumiy) Bu ish roadmap'da bormidi — shundan boshlang. (45)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): kichik doska «Uy vazifalari ilovasi» — «Eslatma» kartasi «Yangi qo'shildi» qatoriga tushadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Not in Plan! — birinchi urinishda to'g'ri.
- Izoh (MD): savol 2-ekran kartasining nusxasi emas (§106): boshqa mahsulot, bitta ish, «Bajarildi» bilan chalkashlik aynan sinaladi. Ikkala trekka to'g'ri («ilova» — ikkinchi misolning o'zi).

## 4 · Tesla  ← QVoqea (PM keys K17; SABOQ 2, 3, 8, 26; P-053)
- Eyebrow: Biznes olamidan
- Sarlavha: **Tesla o'z rejasini qanday yozgan?** (33)
- Nuqtalar (3) · yorliq **Tesla · N/3** (bashorat kartasida ham). Ekranda uch blok: sahna · nuqtalar qatori · bashorat (SABOQ 26).
- Brend tanishtiruvi (1/3 sahna ustidagi bitta qator, S-018): **Tesla** (o'z rangida) — elektromobil ishlab chiqaradigan kompaniya. Logotip yo'q.
- Mentor — kadr gapini aytadi, har kadrda almashadi (≤2 gap; SABOQ 8). Sahnada faqat kadr nomi va jonli maket; takror matn yo'q.
- Sahna (`TeslaSahna`, chizilgan CSS/SVG; bankda yo'q narsa chizilmaydi — son, narx, sana 2006 dan boshqa, bosqich tugagani belgisi yo'q):
  - 1/3 **Reja e'lon qilindi** — Mentor: 2006-yilda Musk Tesla'ning «maxfiy master-rejasi»ni e'lon qilgan.
    · sahna: brauzer oynasi (nuqtalar + manzil qatori, manzilsiz), sahifa sarlavhasi «Tesla'ning maxfiy master-rejasi» («Tesla» o'z rangida); ostida uchta yopiq qator «1 · ?», «2 · ?», «3 · ?» (P-053 `pre` kadr).
    · bashorat (sahna ostida, bitta qator; S-015 — bitta o'lchov, qisqadan uzunga): **Bu reja qancha vaqt bajarilgan?** · Bir yil ichida · Bir necha yil · ✔ O'n yildan ortiq
      — tanlangach ixcham qator «Taxminingiz: …» natijagacha turadi; sahna javobni ochmaydi.
  - 2/3 **Uch bosqich** — Mentor: Rejada uch bosqich bor edi: avval qimmat sport mashinasi kichik seriyada, ya'ni oz sonda. Uning pulidan — arzonroq mashina, uning pulidan esa — ommaviy mashina.
    · sahna: brauzerdagi uch qator navbat bilan ochiladi va yonida chizilgan mashina paydo bo'ladi: 1 — qizil past sport mashinasi (oz sonli kichik siluetlar), 2 — oddiyroq mashina, 3 — mashinalar qatori;
      bosqichlar orasida tanga belgisi oldingi bosqichdan keyingisiga sirg'aladi («uning pulidan»). Raqam, narx, logotip yo'q.
  - 3/3 **Ochiq reja** — Mentor: Nomi «maxfiy» bo'lsa ham, reja hammaga ochiq bo'lgan va o'n yildan ortiq bajarilgan.
    · sahna: brauzer oynasi ustida kulrang yorliq «hammaga ochiq»; uch qator ostida vaqt chizig'i «2006 · o'n yildan ortiq» — uch bosqich reja sifatida chiziq ustida navbat bilan ko'rsatiladi: yonish ham, ✓ belgisi ham yo'q (bank bosqichlar qachon tugaganini aytmaydi; F-1007-469).
- Bashorat natijasi (yashil qutining birinchi kichik qatori — E 42): «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: o'n yildan ortiq»; bashorat kartasi tanlangan variant bilan joyida qoladi.
- **Harakat → Vizual o'zgarish:** bashorat varianti, keyin «Voqea davomi» (pastki tugma, halqada) → Mentor gapi, kadr nomi va sahna almashadi (yangi element bir lahza ajralib kiradi; 2/3 da mashinalar va tanga navbat bilan).
- Xulosa (3/3 dan so'ng, pastda, yashil): Bu voqeada reja ochiq yozilgan va bosqichma-bosqich bajarilgan. (63)
- `QIzoh` (qutining oxirgi kichik qatori): Roadmap ham shuning uchun yoziladi: keyin nima bajarilganini solishtirish uchun. (80)
- Tugma (pastki): Voqea davomi (N/3) → Davom etish
- Ipucha (40 s): Brauzerdagi reja sarlavhasiga va uch qatorga qarang. (52)
- Keyingi bosiladigan joy: bashorat variantlari → «Voqea davomi» → «Davom etish».
- Nishon yo'q (keys — ballsiz bashorat).
- O'qituvchi eslatmasi: Tesla voqeasini 8-Modulda uch ufqli reja darsida ko'rgansiz — bugungi savol boshqa: yozilgan reja keyin nima uchun kerak. Ko'prik — umumiy joy: mahsulotingiz Tesla emas, roadmap'ingiz ham o'n yillik emas.
  Bank bosqichlar qachon tugaganini, sotuv sonini, narxni aytmaydi — sahnaga son va sana qo'shmang; so'ralsa: «bu voqeada aytilmagan». «Maxfiy» — rejaning nomi; reja hammaga ochiq e'lon qilingan.
- Manba (o'quvchi ko'rmaydi): `PM_Prompt_v8.md` K17 (253–256-qatorlar; bank belgisi — raqamsiz) · tayanch 5 (o'zbekcha matn, brend izohi va ko'prik).

## 5 · 2-savol  ← QTest (✔ D, `correctIdx 3`; keys ko'prigi — o'quvchining o'z roadmap'i, ikkala trek)
- Eyebrow: Tekshiruv · roadmap (savol ustida yorliq yo'q)
- Savol: **Roadmap'ingizni 11-Modulda yozgansiz. Bugun u sizga nimaga kerak?** (8 so'z)
  - A — Mahsulotni noldan boshlab qayta qurishga (40)
  - B — Mentordan ball olish uchun ko'rsatishga (39)
  - C — Sinfdoshlar roadmap'i bilan solishtirishga (42)
  - ✔ D — Bugungi mahsulot bilan solishtirishga (37)
- Kalit: **D** (index 3). To'rttalasi bir shaklda (masdar + «-ga»), tinish belgisiz; «solishtirish» C va D da (kalit so'z faqat to'g'rida emas); to'g'ri javob yolg'iz eng uzun emas.
  Distraktorlar uch xil: A — qayta qurish (bugun hech narsa qurilmaydi — qurilganga qaraladi) · B — tashqi baho · C — boshqa narsa bilan solishtirish (bugun o'z roadmap'i o'z mahsuloti bilan).
- To'g'ri izohi: Yozilgan roadmap bilan bugungi mahsulotni solishtirasiz. (56)
- Xato izohlari (≤60):
  - A: Bugun hech narsa qurilmaydi — qurilganga qaraysiz. (50)
  - B: Roadmap — o'zingiz uchun, ball uchun emas. (42)
  - C: Sinfdoshlaringiz mahsuloti boshqa — o'zingiznikiga qarang. (58)
  - (umumiy) Tesla voqeasining oxirgi gapini eslang. (39)
- Javob topilgach (kichik, savol ostida): Mentor doskasi kichik — holat yorliqlari navbat bilan bir lahza yonadi, ustida kulrang qator «roadmap · bugungi mahsulot».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Open Plan! — birinchi urinishda to'g'ri.
- Izoh (MD): savol keys faktini emas, ko'prikni o'quvchining o'z roadmap'iga qo'yadi (12-Modul 10-dars 7-ekran naqshi); keys fakti — arena 7, 8 da. Ball beriladigan javob — tayanch 1.11 ko'prigining o'zi, bankdan chiqarilgan yangi xulosa emas (§124).

## 6 · O'z roadmap'ingiz  ← QMustaqil (USTAXONA 1/2 — ketma-ket karta; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · holat
- Sarlavha: **Roadmap'ingizdagi har ishga holat qo'ying.** (42)
- Mentor: Har kartada ishni mahsulotingiz bilan solishtiring: holatni bosing va sababini bir qatorda yozing.
- Tepada — ixcham chiziq «Roadmap'im · n / N» (holat qo'yilgan ishlar; bo'sh uzuq qatorlar yo'q — SABOQ 17).
- **Chapda — `HolatDoska`** (o'quvchi roadmap'i, to'liq; joriy ish kartasi halqada) · **o'ngda — bitta katta karta «Ish {n} / {N}»:** ish nomi · ufq yorlig'i (kulrang) ·
  kulrang tarix qatori «11-Modul 15-darsida: {holat}» (`pm-m9d15-reja.holatlar` da shu nomli ish bo'lsa; qiymati — bajarildi · kechikdi · boshlanmadi) · holat tugmalari · sabab maydoni · «Saqlash».
- **Holat tugmalari:** Bajarildi · Kechikdi · Olib tashlandi; ish «Uzoqroq · bitiruvdan keyin» ustunida bo'lsa — to'rtinchisi **Uzoqroqda qoldi** (shu ustunda oldindan tanlangan; o'quvchi o'zgartirishi mumkin). Ufqi yo'q ishda — uchta tugma.
- **Sabab maydoni** (holat tanlangach ochiladi; ≤ 80; yorliq input ichida — E 43); placeholder holatga qarab: bajarildi — «Qachon tugadi?» · kechikdi — «Keyin tugadimi yoki hali yo'qmi? Nega?» · olib tashlandi — «Nega endi kerak emas?» · uzoqroqda qoldi — «Nega hozir emas?».
- `QIzoh` (o'quvchi shu holatni birinchi marta saqlaganda, bir marta; yashil qatorda): kechikdi — Kechikdi — ish o'z ufqi ichida tugamagan: keyin tugagan yoki hali yo'q. (71) · olib tashlandi — Olib tashlandi — ish endi qilinmaydi. (37)
  Ikki atama shu yerda, o'quvchining o'z ishidan keyin tug'iladi (T-011); bajarildi, uzoqroqda qoldi, yangi qo'shildi — 2-ekranda tug'ilgan.
- **Roadmap'da yo'q ishlar** (roadmap'dagi hamma ishdan keyin, o'sha karta o'rnida): savol qatori «Roadmap'da yo'q, lekin mahsulotingizga qo'shilgan ish bormi?» · maydon «Ish nomi» (≤ 60; placeholder «Qaysi ish qo'shildi?») ·
  sabab (placeholder «Nega qo'shildi?») · «Qo'shish» · ikkinchi tugma «Yangi ish yo'q». Ko'pi bilan to'rtta — savol ostida kulrang qator: Eng muhim to'rttagacha ishni qo'shing. (38) Har biri holat «Yangi qo'shildi» bilan.
  `pm-m11d2-model.nima` bo'lsa — maydon ustida kulrang taklif tugmasi «2-darsdagi pullik qismingiz: {nima}» (bosilsa nom maydoniga yoziladi; o'quvchi o'zgartiradi yoki o'chiradi; TAYANCHGA SAVOL 11).
- **Roadmap topilmasa** (M-q5): kulrang qator «Roadmap'ingiz topilmadi — eslagan ishlaringizni yozing: nomi va ufqi. Bu asl roadmap emas, qayta yozilgani.» (107) + maydon «Ish nomi» + uch ufq tugmasi (Hozir · Keyinroq · Uzoqroq) + «Qo'shish»; 1–8 ish (eslaganicha — sonni to'ldirish uchun to'qilmaydi; F-1007-469), keyin yuqoridagi karta oqimi; kalitga `roadmapManba: 'qayta-yozilgan'`.
- Tekshiruv (`QXato`, ≤60; maydon ostida; yumshoqlari ikkinchi «Saqlash» bilan o'tadi):
  - holat tanlanmagan (bloklaydi): Avval holatni tanlang. (22)
  - sabab bo'sh (bloklaydi): Sababini bir qatorda yozing. (28)
  - sabab 80 belgidan uzun (bloklaydi): Bir qatorga sig'diring — 80 belgigacha. (39)
  - «@», «t.me/», «+998» yoki telefon shakli — 9 raqam («90 123 45 67» yoki bo'shliqsiz) (bloklaydi): Telefon va akkaunt nomi yozilmaydi. (35)
  - boshqa ketma-ket 7+ raqam (yumshoq — son bo'lishi mumkin; F-1007-464): Bu telefon raqamimi? Telefon yozilmaydi. (40)
  - «Bajarildi» va sababda «hali», «qilmadim», «qilinmadi» (yumshoq): Sababda «hali qilinmadi» bor — holatni qayta qarang. (52)
  - «Kechikdi» va sababda «kerak emas», «voz kechdim» (yumshoq): Sababga qarang: ish endi qilinmaydimi? (38)
  - yangi ish nomi roadmap'dagi ish nomi bilan bir xil (yumshoq): Bu ish roadmap'da bor — holatini o'z kartasida qo'ying. (55)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bosilsa ochiladi; «qayerga qarash», tayyor javob emas): Ishni mahsulotingizda oching — web-trekda saytingizda: u ishlayaptimi? O'z ufqi ichida tugagan va ishlayotgan ish — bajarildi; keyin tugagan yoki hali yo'q — kechikdi; endi qilmaysiz — olib tashlandi.
  Bu darsda keyinroq ufqidagi hali qilinmagan ish ham — kechikdi: 12-dars yangi ish qo'shmaydi. Roadmap'da yo'q ishni oxirida qo'shing: funksiya yoki katta qism, har tugma emas.
  Mentor misolida: «Maydon pulini bo'lishish» — uzoqroqda qoldi: muammo gapidan kelmaydi; 2-darsda solishtirildi. Olib tashlash — mag'lubiyat emas: ish endi kerak emasligini bilib oldingiz.
- **Harakat → Vizual o'zgarish:** holat tugmasi → tugma holat rangiga kiradi, sabab maydoni ochiladi (accent chegara); «Saqlash» → karta kichrayib doskadagi o'z ustuniga uchadi — holat yorlig'i va sabab qatori bilan (~1 s yashil), hisoblagich n o'sadi, keyingi ish kiradi;
  «Olib tashlandi» — doskada nom ustidan chiziq tortiladi; «Qo'shish» → yangi ish «Yangi qo'shildi» qatoriga uchadi. Hammasi tugagach karta yopiladi, doska butun enga, har kartada ✎ (bosilsa o'sha ish katta karta bo'lib ochiladi — SABOQ 29); pastki o'ngda «Saqlash» → kalit.
  Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
- Xulosa (o'quvchi ma'lumotidan, P-046): Har ishga holat va sabab qo'yildi: 6 ta ish, shundan 2 tasi yangi. (66) — namuna 6/2 · yangi ish yo'q bo'lsa: Har ishga holat va sabab qo'yildi: 5 ta ish. (44)
  Holatlar sanog'i xulosada takrorlanmaydi — u doskada ko'rinib turibdi (P-062).
- Saqlash: `pm-m11d11-refleksiya.ishlar` va `roadmapManba` (A-11 shartnomasi), `savedAt`; hammasi to'liq bo'lsa — `completedAt`.
- Tugma (pastki): Ishlarga holat qo'ying (n/N) → Saqlash → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: holat tugmalari (navbatma-navbat to'lqin) → sabab maydoni → «Saqlash» → keyingi karta; oxirida — «Qo'shish» yoki «Yangi ish yo'q» → pastki «Saqlash».
- Artefakt-strip (U-042): shu ekrandan — «Roadmap'im · {N} ish» (ixcham); 7-ekranda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon yo'q (saqlash — Mentorga signal).
- Mentor rejimi: forma o'rniga Mentor misolining to'liq doskasi (A-6). Mentor statistikasi: «Holat qo'ydi» (son).
- O'qituvchi eslatmasi: 20 daqiqa. Eng ko'p savol — «ishlayapti, lekin kech tugadi: bajarildimi?»: ufqiga qarang — ufqi ichida tugagan bo'lsa bajarildi, keyin tugagan bo'lsa kechikdi. Sababni o'quvchi yozadi, siz aytmaysiz.
  Kechikkan va olib tashlangan ish — baho emas: roadmap taxmin bilan yozilgan edi, mahsulot esa o'zgardi. Keyinroq ufqi (12–13-Modul) shu modulda tugaydi, yangi funksiya uchun loyiha kuni qolmagan — shuning uchun undagi qilinmagan ish bugun «kechikdi».
  Ish ko'p bo'lsa — avval Hozir va Keyinroq ustunlari.

## 7 · Shaxsiy hisobot  ← QMustaqil (USTAXONA 2/2 — ketma-ket 3 karta; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · shaxsiy hisobot
- Sarlavha: **O'z qarorlaringiz haqida uch savolga javob yozing.** (50)
- Mentor: O'zingiz yozing; kerak bo'lsa — chapdagi Mentor misolini oching.
- Tepada (kulrang, bitta qator): Hisobotingiz Mentor ekraniga chiqmaydi — faqat saqlangani ko'rinadi. (68)
- Qism yorliqlari (ot-shakl, T-073): 1 Qarorim · 2 Noto'g'ri chiqqan qaror · 3 Keyingi 4 hafta
- **Chapda — Mentor javobi kartasi** (kulrang yorliq «Mentor misolida», «Maydon Jamoa» o'z rangida; joriy savolga Mentorning javobi so'zma-so'z — **yopiq turadi**: kulrang tugma «Mentor misolini ko'rish», bosilsa ochiladi; keyingi savolda yana yopiq — o'quvchi avval o'zi yozadi, F-1007-469) · **o'ngda — bitta katta karta** (joriy savol, maydon, dalil tugmalari, «Saqlash») · tepada — ixcham chiziq «Roadmap'im · {N} ish» (6-ekrandan).
- Savollar (Qaror-0 18 aynan; ketma-ket):
  1. **O'z qarorim bilan nima qildim?** — Mentor misolida: «Pro'ni o'yinchiga emas, tashkilotchiga qo'ydim.»
     Maydon (≤ 200; placeholder «O'zingiz qaysi qarorni qildingiz?»). Kulrang qator (`pm-m11d2-model` bo'lsa): «2-darsdagi tanlovingiz: {model nomi}; to'laydi — {kim}.»
     (model nomlari — tayanch 2: bepul asos va pullik qo'shimcha · pullik obuna · reklama · B2B — boshqa biznes to'laydi · tranzaksiya — har to'lovdan ulush)
  2. **Qaysi qarorim noto'g'ri chiqdi va buni qaysi dalil ko'rsatdi?** — Mentor misolida: «1-darsda narxni 10 000 deb taxmin qildim; 4-darsda xarajatni qo'shib, narxni qayta ko'rdim.» («10 000» yonida kulrang «Mentorning taxmini»)
     Maydon (≤ 200; placeholder «Qaysi qaror va qaysi son yoki yozuv?»). Maydon ustida kulrang tugma **«Hozircha bunday qaror topmadim»** — bosilsa maydonga gap boshi yoziladi: «Hozircha noto'g'ri chiqqan qaror topmadim. Qayta ko'rishga sabab bo'lgan dalil: …» (o'quvchi dalilni o'zi yozadi; noto'g'ri qaror o'ylab topishga undalmaydi — F-1007-469; savol matni Qaror-0 18 aynan). Ostida kulrang qator: Dalil — son yoki yozuv; qayerdan olinganini ham yozing. (55)
     **Dalil tugmalari** (bosilsa matn maydon oxiriga qo'shiladi; faqat ma'lumot bo'lsa ko'rinadi):
     - «6-dars · suhbatlar: {n} ta — ha {a}, qimmat {b}, yo'q {c}» (`pm-m11d6-suhbat`, faqat `tur: 'real'`; 0 bo'lgan belgi tushib qoladi; «javob yo'q» bo'lsa — «javobsiz {d}»)
     - «9-dars · yozma javob so'ralgan {soralgan} kishidan {t} ta yozma tasdiq» (`pm-m11d9-tasdiq`; `hisobga: true`)
     - «Narx taxminlarim: 1-darsda {a} so'm, 4-darsda {b} so'm» (`pm-m11d1-birlik.narxTaxmin` — faqat `tur: 'real'` — va `pm-m11d4-narx.narx`; ikkalasi bo'lsa)
     - «Bugun · roadmap: {k} ta ish o'z ufqida tugamadi» (6-ekrandan; `k` > 0 bo'lsa; qaysi qarorga bog'liqligini o'quvchi yozadi)
  3. **Keyingi 4 haftada nima qilaman?** — Mentor misolida: «To'lashga tayyorligini yozgan uch tashkilotchi bilan "Doimiy o'yin"ni test rejimda sinab ko'raman.» (ostida kulrang: tasdiq — 9-darsdagi yozma tasdiq)
     Maydon (≤ 200; placeholder «Bitta aniq ish: nima qilasiz, qachon yoki kim bilan?»). Kulrang qator (6-ekrandan; bo'lsa): «Kechikkan ishlaringiz: {nomlar}» (ko'pi bilan uchta, «…» bilan).
- Tekshiruv (`QXato`, ≤60; yumshoqlari ikkinchi «Saqlash» bilan o'tadi):
  - maydon bo'sh (bloklaydi): Javobingizni bir-ikki gapda yozing. (35)
  - «@», «t.me/», «+998» yoki telefon shakli — 9 raqam («90 123 45 67» yoki bo'shliqsiz) (bloklaydi): Telefon va akkaunt nomi yozilmaydi. (35)
  - boshqa ketma-ket 7+ raqam (yumshoq — son bo'lishi mumkin; F-1007-464): Bu telefon raqamimi? Telefon yozilmaydi. (40)
  - Mentor javobi bilan bir xil (yumshoq): Bu Mentorning javobi — o'z mahsulotingiz haqida yozing. (55)
  - 2-savolda raqam yo'q, dalil tugmasi bosilmagan va «suhbat», «tasdiq», «hisob», «son», «yozuv», «sinov», «intervyu» so'zlari yo'q (yumshoq): Qaysi dalil ko'rsatdi — son yoki yozuvni qo'shing. (50)
  - 3-savolda «pul olaman», «to'lov olaman», «karta» (yumshoq): Bu kursda real pul olinmaydi — to'lov faqat test rejimda. (57)
  - 3-savol 20 belgidan qisqa (yumshoq): Bitta aniq ish yozing: nima va qachon. (38)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam: Birinchi savol — o'zingiz tanlagan narsa: kim to'laydi, nima bepul qoladi, narx, qaysi ish birinchi. Agent yoki Mentor tanlagani emas.
  Ikkinchi savol — fikringizni o'zgartirgan son yoki yozuv: suhbat, yozma tasdiq, hisob. Noto'g'ri chiqqan qaror — mag'lubiyat emas: uni dalil ko'rsatdi. Topmagan bo'lsangiz — shuni yozing va qaysi dalil qarorni qayta ko'rishga sabab bo'lganini qo'shing. Uchinchi savol — bitta aniq ish: nima qilasiz, qachon yoki kim bilan.
- **Harakat → Vizual o'zgarish:** dalil tugmasi → matn maydonga qo'shiladi, tugma ✓ bilan xiralashadi; «Saqlash» → javob kartadan hisobot varag'idagi o'z qatoriga uchadi (~1 s yashil), Mentor kartasi va savol keyingisiga almashadi.
  3/3 → karta va Mentor kartasi yopiladi, varaq «Shaxsiy hisobotim» butun enga — uch savol va javob, har birida ✎. Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
- `QIzoh` (3/3 saqlangach, yashil qutining oxirgi kichik qatori): O'z qarorlaringiz haqidagi bu uch javob — shaxsiy hisobot. (58) — atama shu yerda (T-011)
- Xulosa (holatdan, P-046): uch javob saqlangan — Shaxsiy hisobotingiz tayyor: qaror, dalil va keyingi 4 hafta. (61) · bir-ikki javob — Hisobot hali tugamagan: qolgan savolga uyda javob yozing. (57)
- Saqlash: `pm-m11d11-refleksiya.javoblar.{qarorim | notogri | keyingi}` (har savol o'z maydoniga), `savedAt`; hammasi to'liq bo'lsa — `completedAt`.
- Tugma (pastki): Savollarga javob yozing (n/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent chegara, to'lqin) → dalil tugmasi (2-savolda, bo'lsa) → «Saqlash» → keyingi savol.
- Nishon: **Look Back!** (uchala javob saqlanganda — bonus, ish bajarilgan ekranda — P-048).
- Mentor rejimi: forma o'rniga Mentorning uch javobi (A-6). Mentor statistikasi: «Hisobot yozdi» (son). Javob matni Mentor ekraniga ham, proyektorga ham uzatilmaydi (A-9).
- O'qituvchi eslatmasi: 18 daqiqa. Noto'g'ri chiqqan qaror topmagan o'quvchi «Hozircha bunday qaror topmadim»ni bosadi va qayta ko'rishga sabab bo'lgan dalilni yozadi — bu to'g'ri javob; xato qaror o'ylab topishga undamang (F-1007-469). Javoblarni ovoz chiqarib o'qitmang va sinfda solishtirmang — hisobot shaxsiy.
  Mentorning uchinchi javobi — niyat, va'da emas; bu kursda real pul yo'q: to'lov faqat test rejimda. «Keyingi 4 hafta» — o'quvchining o'z rejasi: keyingi modul va bitiruv haqida gapirmang.

## 8 · Yakuniy savol  ← QTest (✔ A, `correctIdx 0`; ikkinchi misol — kitob almashish ilovasi, P-002)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q)
- Savol: **Kitob ilovangizda to'lovni sinfdoshlardan kutdingiz. Bu qarorni qayta ko'rishga nima dalil bo'ladi?** (12 so'z)
  - ✔ A — Uch suhbatda uchalasi to'lamasligini aytdi (42)
  - B — Endi bu qaror menga negadir yoqmay qoldi (40)
  - C — Keyingi oyda narxni boshqacha qilib ko'raman (44)
  - D — Qolgan hamma qarorlarim esa to'g'ri chiqdi (42)
- Kalit: **A** (index 0). To'rttalasi — bitta gap, tinish belgisiz; «qaror» B va D da; to'g'ri javob yolg'iz eng uzun emas; uzunlik — «O'lchov».
  Distraktorlar uch xil: B — his-tuyg'u (son ham, yozuv ham yo'q) · C — kelajak rejasi (uchinchi savolning javobi) · D — boshqa qarorlar haqida gap.
- To'g'ri izohi: Uch suhbat yozuvi — dalil: son va odamlarning o'z gapi. (55)
- Xato izohlari (≤60):
  - B: Bu fikringiz — uni qaysi son yoki yozuv ko'rsatadi? (51)
  - C: Bu keyingi ish — dalil o'tgan ishdan olinadi. (45)
  - D: Savol shu qaror haqida — uning dalili qayerda? (46)
  - (umumiy) Dalil — son yoki yozuv. Qaysi variantda bor? (44)
- Javob topilgach (kichik, savol ostida): kitob ilovasi hisobot varag'i — «2 · To'lovni sinfdoshlardan kutdim» ostida yashil dalil qatori «uch suhbat: uchalasi to'lamasligini aytdi».
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): A — kichik son: uch suhbat — dalil, isbot emas (izohda «isbot» so'zi yo'q, «dalil» — 12-Modul ma'nosida; 6-dars qoidasi). Savol 7-ekranning nusxasi emas: boshqa mahsulot, tayyor variantdan tanlash.
  Arena 10, 12 bilan kalit ibora takrorlanmaydi (S-008). Ikkala trekka to'g'ri.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 3 savol (3, 5, 8); 6, 7-ekranlar «Saqlash» — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Roadmap'da yo'q ish» · 5 — «2 — Roadmap nimaga kerak» · 8 — «Yakuniy — Qayta ko'rishga dalil»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/3 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi):
  - ishlar va uch javob saqlangan: **Roadmap solishtirildi, shaxsiy hisobotingiz tayyor.** (51)
  - ishlar saqlangan, javoblar uchtadan kam: **Roadmap solishtirildi — hisobot hali tugamagan.** (47)
  - uch javob saqlangan, ishlar saqlanmagan: **Hisobot tayyor — solishtirish hali tugamagan.** (45)
  - ish boshlangan, lekin ishlar ham, uch javob ham saqlanmagan: **Solishtirish hali tugamagan — uyda tugating.** (44)
  - hech narsa boshlanmagan: **Roadmap hali solishtirilmagan — uyda boshlang.** (46)
  - `roadmapManba: 'qayta-yozilgan'` bo'lsa — sarlavha ostida kulrang qator: Roadmap qayta yozilgan — asl nusxa topilmadi. (45) (F-1007-469)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi):
  - Bu darsda holat roadmap'dagi ish o'z ufqiga qarab qayerda ekanini aytadi; yonida — bir qator sabab.
  - Roadmap'dagi ish bajarildi, kechikdi, olib tashlandi yoki uzoqroqda qoldi; roadmap'da yo'q ish — yangi qo'shildi.
  - Roadmap keyin nima bajarilganini solishtirish uchun yoziladi.
  - Shaxsiy hisobot — o'z qarorlaringiz haqida uch savolga yozma javob.
  - Noto'g'ri chiqqan qaror yonida — uni ko'rsatgan dalil: son yoki yozuv.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim bilan: o'zingiz · Nechta: bitta ish bo'yicha qaror · Muddat: keyingi darsgacha
  - ① Hali tugamagan kechikkan ishlaringizdan birini tanlang: yangi ufq berasizmi yoki olib tashlaysizmi — qaroringizni sababi bilan qog'ozga yozing. (Bunday ish bo'lmasa: uzoqroqda qolgan bitta ishni ko'rib chiqing — hali kerakmi, sababi bilan yozing.)
  - ② «Keyingi 4 hafta» javobingizdagi ishni qachon boshlashingizni yozing.
  - ③ Darsda qolgan qismni tugating: {holatga qarab — roadmap'dagi ishlarga holat va sabab qo'ying · shaxsiy hisobotning qolgan savoliga javob yozing}. Hammasi tugagan bo'lsa ③ ko'rinmaydi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: barqarorlashtirish»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada keyingi dars va keyingi modul aytilmaydi (T-038). ① — qog'ozda (repo va kalit yo'q); «Kim bilan» — HwCard yorlig'i (06 pilot bilan bir). ① ning qavsdagi qatori — hali tugamagan kechikkan ishi bo'lmagan o'quvchi uchun (6-ekran kalitidan; kech tugagan ishga yangi ufq kerak emas — F-1007-469).
  Sarlavhalar har holatda rost (E 54): «solishtirildi» — 6-ekran «Saqlash»idan keyingina; «tayyor» — uchala javob saqlangach.

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Status Check!** (2-ekran, besh karta birinchi urinishda) — Mentor ishlariga mos holat qo'ydingiz (37)
- **Not in Plan!** (3-ekran, 1-savol birinchi urinishda) — Roadmap'da yo'q ishning holatini topdingiz (42)
- **Open Plan!** (5-ekran, 2-savol birinchi urinishda) — Roadmap nimaga kerakligini topdingiz (36)
- **Look Back!** (7-ekran, uchala javob saqlanganda — bonus) — Shaxsiy hisobotingizni yozib saqladingiz (40)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Look Back!, ish qilingan ekranda — P-048). Yakuniy savol, 4 va 6-ekranlar nishonsiz (4 — ballsiz bashorat, 6 — saqlash Mentorga signal).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Roadmap'da yo'q ish** — 1 Bu darsda holat roadmap'dagi ish o'z ufqiga qarab qayerda ekanini aytadi. · 2 «Bajarildi» — roadmap'dagi ish uchun: o'z ufqi ichida tugagan va hozir ishlaydi. · 3 Roadmap'da yo'q, lekin qilingan ish — yangi qo'shildi.
  — Sinfga savol: Mahsulotingizda roadmap'da yo'q qaysi ish bor?
- **5 · Roadmap nimaga kerak** — 1 Tesla rejasi hammaga ochiq yozilgan edi. · 2 Bu voqeada reja bosqichma-bosqich bajarilgan. · 3 Roadmap ham keyin nima bajarilganini solishtirish uchun yoziladi.
  — Sinfga savol: Roadmap'ingizni oxirgi marta qachon ochgansiz?
- **8 · Noto'g'ri chiqqan qaror** — 1 Shaxsiy hisobotda o'z qaroringiz yoziladi. · 2 Noto'g'ri chiqqan qaror yonida — uni ko'rsatgan dalil: son yoki yozuv. · 3 Mentor misolida: 1-darsdagi narx taxmini va 4-darsdagi xarajat hisobi.
  — Sinfga savol: Qaysi son yoki suhbat fikringizni o'zgartirdi?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Bu darsda holat nimani aytadi? | Roadmap'dagi ish o'z ufqiga qarab qayerda ekanini | Yonida — bir qator sabab |
| «Bajarildi» qachon qo'yiladi? | Roadmap'dagi ish o'z ufqi ichida tugagan va hozir ishlaydi | Mentor misolida: uch asosiy funksiya — 11-Modulda |
| «Kechikdi» qachon qo'yiladi? | Ish o'z ufqi ichida tugamagan: keyin tugagan yoki hali yo'q | 11-Modulda ishning vaqti — o'z darsi edi, bugun — ufqi |
| «Olib tashlandi» nimani bildiradi? | Ish endi qilinmaydi | Doskada qoladi — nomi ustidan chiziq va sababi bilan |
| «Uzoqroqda qoldi» qaysi ishga qo'yiladi? | Vaqti hali kelmagan, o'z ustunida turgan ishga | Mentor misolida: maydon pulini bo'lishish |
| «Yangi qo'shildi» qaysi ishga qo'yiladi? | Roadmap'da yo'q edi, lekin mahsulotga qo'shilgan ishga | Mentor misolida: lending, Pro va test to'lov, Telegram xabari, taklif havolasi |
| Holat yonida yana nima yoziladi? | Bir qator sabab | Mentor misolida: «muammo gapidan kelmaydi; 2-darsda solishtirildi» |
| Tesla 2006-yilda nimani e'lon qilgan? | «Maxfiy master-reja»ni — u hammaga ochiq bo'lgan | Uch bosqich: qimmat sport mashinasi, arzonroq mashina, ommaviy mashina |
| Roadmap nega yozib qo'yiladi? | Keyin nima bajarilganini solishtirish uchun | Tesla voqeasida reja ochiq yozilgan va bosqichma-bosqich bajarilgan |
| Shaxsiy hisobot nima? | O'z qarorlaringiz haqida uch savolga yozma javob | Nima qildim, nima noto'g'ri chiqdi, keyingi 4 haftada nima qilaman |
| Noto'g'ri chiqqan qaror yonida nima yoziladi? | Uni ko'rsatgan dalil: son yoki yozuv | Mentor misolida: 4-darsdagi xarajat hisobi |
| Mentor Pro'ni kimga qo'ydi? | Tashkilotchiga, o'yinchiga emas | Mentorning shaxsiy hisobotidagi birinchi javob |
- §145: har javobdagi so'z darsda bor (holat, bajarildi, uzoqroqda qoldi, yangi qo'shildi, sabab — 2 · kechikdi, olib tashlandi — 6 · Tesla, maxfiy master-reja, ochiq — 4 · solishtirish — 4, 5 · shaxsiy hisobot, dalil, tashkilotchiga — 7).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 3·6·10 · C 2·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md11/olchov.py` (pastda «O'lchov»).
1. Bu darsda holat nimani aytadi? (2)
   - ✔ A — Roadmap'dagi ish ufqiga qarab qayerda ekanini (45)
   - B — Ishga qancha vaqt va qancha kuch sarflanganini (46)
   - C — Ishni kim yoki qaysi agent yozib berganini (42)
   - D — Ishning RICE bahosi hozir necha ball ekanini (44)
2. Ish o'z ufqidan keyin tugadi. Holati qanday? (2, 6)
   - A — Bajarildi: hozir ishlab turibdi (31)
   - B — Olib tashlandi: vaqti o'tib ketdi (33)
   - ✔ C — Kechikdi: ufqi ichida tugamagan (31)
   - D — Yangi qo'shildi: keyin qo'shilgan (33)
3. Mentor «Maydon pulini bo'lishish»ga qaysi holatni qo'ydi? (2)
   - A — Olib tashlandi: endi kerak emas (31)
   - ✔ B — Uzoqroqda qoldi: vaqti kelmagan (31)
   - C — Kechikdi: ufqida qilinmay qoldi (31)
   - D — Bajarildi: 2-darsda ko'rib chiqildi (35)
4. Mentor roadmap'ida qaysi ish yo'q edi? (2)
   - A — O'yin kuni kelishini tasdiqlash (31)
   - B — O'yindan oldin eslatma chiqarish (32)
   - C — Maydon pulini o'zaro bo'lishish (31)
   - ✔ D — Telegram orqali xabar yuborish (30)
5. Ishdan voz kechdingiz. Roadmap'da u qanday qoladi? (6)
   - ✔ A — «Olib tashlandi» deb, sababi bilan (34)
   - B — Butunlay o'chiriladi, izi qolmaydi (34)
   - C — «Kechikdi» deb, keyinga suriladi (32)
   - D — Holatsiz, o'z ustunida turaveradi (33)
6. Holat yonida yana nima yoziladi? (2, 6)
   - A — Ishning RICE bahosi va qaysi ufqi (33)
   - ✔ B — Nega shu holat ekanining sababi (31)
   - C — Agentga yozilgan to'liq prompt (30)
   - D — Ishning kodidan olingan bo'lak (30)
7. Tesla 2006-yilgi rejasini kimga ko'rsatgan? (4)
   - A — Faqat kompaniya ichida, yashirin (32)
   - B — Bir necha tanish odamga aytib (29)
   - ✔ C — Hamma ko'ra oladigan qilib, ochiq (33)
   - D — Hech kimga, o'zida saqlab qo'ygan (33)
8. Tesla rejasining birinchi bosqichi nima edi? (4)
   - A — Ko'pchilik uchun ommaviy mashina (32)
   - B — Narxi arzonroq bo'lgan mashina (30)
   - C — Rejani hammaga ochiq e'lon qilish (33)
   - ✔ D — Qimmat sport mashinasi, oz sonda (32)
9. Shaxsiy hisobotning birinchi savoli nima haqida? (7)
   - ✔ A — O'z qarorim bilan nima qilganim (31)
   - B — Agent men uchun nima qilib bergani (34)
   - C — Mentor ishimni qanday baholagani (32)
   - D — Roadmap'dagi qaysi ish kechikkani (33)
10. Mentor qaysi qarorini qayta ko'rganini aytdi? (7)
    - A — Pro'ni tashkilotchiga qo'yganini (32)
    - ✔ B — 1-darsda narxni qanday o'ylaganini (34)
    - C — Telegram xabarini ham qo'shganini (33)
    - D — Maydon pulini uzoqroqqa qo'yganini (34)
11. Qaysi javob «keyingi 4 hafta» uchun aniq ish? (7)
    - A — Mahsulotni yanada yaxshiroq qilaman (35)
    - B — Hamma ishni vaqtida bajarib boraman (35)
    - ✔ C — Uch tanishdan narx haqida so'rayman (35)
    - D — Ilovam juda mashhur bo'lib ketadi (33)
12. Noto'g'ri chiqqan qarorni hisobotda nima qilasiz? (7, 8)
    - A — Yashiraman: hisobotga yozmayman (31)
    - B — To'g'ri chiqqan deb yozib qo'yaman (34)
    - C — Faqat Mentorga og'zaki aytaman (30)
    - ✔ D — Uni dalili bilan yozib qo'yaman (31)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (roadmap'da yo'q ish — yangi qo'shildi) ↔ arena 2 (kechikdi), 5 (olib tashlandi) ·
  5-ekran (roadmap bugun nimaga kerak) ↔ arena 7, 8 (Tesla fakti) · 8-ekran (qaysi gap dalil) ↔ arena 10 (Mentor misoli), 12 (hisobotda nima qilasiz — harakat).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas: 1 — vaqt, agent, RICE (uch xil) · 2, 3 — boshqa holatlar · 4 — Mentor roadmap'idagi uchta haqiqiy ish (to'g'ri javob — 8-darsdagi Telegram xabari, roadmap'da yo'q edi) ·
  5 — o'chirish, kechikish, holatsiz qoldirish · 7, 8 — bank: reja ochiq, birinchi bosqich — qimmat sport mashinasi kichik seriyada · 9 — agent, Mentor bahosi, roadmap holati (uch xil) · 11 — umumiy niyat, umumiy va'da, natija da'vosi (uch xil) · 12 — yashirish, yolg'on yozish, yozmay aytish.
  Arena 4 C «Maydon pulini o'zaro bo'lishish» — roadmap'dagi «Maydon pulini bo'lishish» ishining ta'rifi (11-Modul 1.5). Arena 8 — bank faktining o'zi (§124); A, B — rejaning uchinchi va ikkinchi bosqichi, C — voqeaning rost fakti, lekin bosqich emas («rost, lekin mos emas» — S-004).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — roadmap · ufq · holat · bajarildi · kechikdi · sabab · reja · qaror · dalil · Tesla · Maydon Jamoa · uyga vazifa banneri — roadmap · holat · qaror. Emoji yo'q.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/11-Modull/PmReflectionLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m11d11-v1` (PM darslar naqshi `pm-m11dN-v1`), `lessonTitle` — «Mahsulotingiz hozir qayerda?».
2. `SCREEN_META` 12: hook · plan · concept · test · case · test · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 1, 5: 3, 8: 0 }; `holatlar: -1`, `tesla: -1` (2, 4-ekran — ballsiz; 2-ekranda nishon);
   6, 7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 3, 5, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s3/s5/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s4 `QVoqea` · s6/s7 `QMustaqil` · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`HolatDoska`** — bitta vizual (180; qolipda yo'q, yangi; 11-Modul `RejaDoska` ko'rinishiga qarab — kod ko'chirilmaydi): uch ufq ustuni («Hozir · 11-Modul» · «Keyinroq · 12–13-Modul» · «Uzoqroq · bitiruvdan keyin») + «Yangi qo'shildi» qatori;
   ish kartasi (`nom`, holat yorlig'i, sabab qatori; holatlar `bajarildi` · `kechikdi` · `olib-tashlandi` · `uzoqroqda` · `yangi` · bo'sh «?»); ranglar — D3 tokenlari (qizil yo'q); `telefon` rejimi («Maydon Jamoa», ≈ 170×272; sahnalar `elon` · `eslatma` · `jonli` · `yoq` · `yangi`);
   `varaq` rejimi («Shaxsiy hisobotim» / «Mentor misoli · Maydon Jamoa» — uch qator); ko'rinishlar `kichik` · `toliq` · `chiziq`. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: hd-karta hd-holat hd-qator`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. 393 da telefon doska ustida, kesilmaydi (E 41; DOM detektori bilan).
4. **Bitta manbalar (A-6 aynan):** `MENTOR_ROADMAP` (6 × `{ id, nom, ufq, holat, sabab, telefon }` — 1.11 holatlari) · `MENTOR_YANGI` (4 × `{ id, nom, holat: 'yangi', sabab, telefon }`) · `MENTOR_KARTALAR` (5 karta: ish id lari guruhi, to'g'ri tugma, kulrang dalil qatori) ·
   `MENTOR_JAVOBLAR` (3, so'zma-so'z; 2-javobda «Mentorning taxmini» yorlig'i, 3-javobda «tasdiq — 9-darsdagi yozma tasdiq» yorlig'i) · `TESLA_KADRLAR` (3 kadr — A-7 matni, bank aynan; bashorat variantlari). Mentor rejimi, s0 (kalit yo'q holati), s2, s6, s7 shulardan o'qiydi.
5. **s2** — `QBashorat` (4 · 5 · 6) → 5 karta, besh tugma (Bajarildi · Kechikdi · Olib tashlandi · Uzoqroqda qoldi · Yangi qo'shildi), kalit `[bajarildi, bajarildi, bajarildi, uzoqroqda, yangi]`; 1-kartada uchta ish birga, 5-kartada to'rt yangi ish «Yangi qo'shildi» qatoriga uchadi;
   `QIzoh` 1, 4, 5-kartada (~3 s); `QXato` jadvali (2-ekran); natijada xulosa + oxirgi `QIzoh`; 40 s ipucha; nishon `statusCheck`.
6. **s4** — `TeslaSahna` (P-053; chizilgan brauzer oynasi, uch mashina siluet, tanga belgisi, vaqt chizig'i «2006 · o'n yildan ortiq»; logotipsiz; bosqichga ✓ qo'yilmaydi) · `QBashorat` (Bir yil ichida · Bir necha yil · O'n yildan ortiq) · «Voqea davomi» 1/3 → 3/3 · xulosa + `QIzoh` (tayanch 1.11 ko'prigi).
7. **s6** — o'qiydi `pm-m9d6-roadmap` (`ishlar[].nom`, `ishlar[].ufq`; tartib o'zgarmaydi), `pm-m9d15-reja.holatlar` (nom bo'yicha tarix qatori), `pm-m11d2-model.nima` (taklif tugmasi); ketma-ket karta; holat tugmalari (uzoqroq ustunida — to'rtta, «Uzoqroqda qoldi» oldindan tanlangan);
   sabab maydoni (≤ 80); «Roadmap'da yo'q ishlar» (≤ 4; «Yangi ish yo'q»); roadmap yo'q — o'quvchi o'zi yozadigan oqim (1–8 ish, ufq tugmalari; `roadmapManba`); tekshiruvlar (holat · bo'sh sabab · 80+ · telefon/akkaunt — bloklaydi; «Bajarildi» + «hali/qilmadim/qilinmadi» · «Kechikdi» + «kerak emas/voz kechdim» · roadmap'dagi nom bilan bir xil yangi ish — yumshoq) —
   **PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi** (masalan: «12-Modulda qurildi» o'tadi · «hali qilinmadi» + bajarildi — yumshoq · «+998 90 …» bloklanadi · 81 belgili sabab bloklanadi · «Lending» yangi ish, roadmap'da «lending» — yumshoq; katta-kichik harf farqsiz).
   Saqlash → `pm-m11d11-refleksiya.ishlar` (A-11 shartnomasi: `ufq` va `holat` mosligi saqlashdan oldin tekshiriladi), `savedAt`. ✎ — ishni qayta ochish (o'sha tekshiruvlar bilan). Ichki holat dars progressida (yarim to'ldirilgan karta qayta ochilganda o'z joyida — E 51).
8. **s7** — o'qiydi `pm-m11d2-model` (`model`, `kim`), `pm-m11d6-suhbat` (`tur: 'real'` yozuvlar, `javob` sanog'i), `pm-m11d9-tasdiq` (`soralgan`, `tasdiqlar.filter(t => t.hisobga).length`; F-1007-467), `pm-m11d1-birlik.narxTaxmin` + `pm-m11d4-narx.narx` (ikkalasi bo'lsa), s6 natijasi (kechikkan ishlar);
   uch karta ketma-ket (chapda `MENTOR_JAVOBLAR[i]`); dalil tugmalari matnni maydon oxiriga qo'shadi (takror bosish — qo'shmaydi); tekshiruvlar (bo'sh · telefon/akkaunt — bloklaydi; Mentor javobi bilan bir xil · 2-savolda dalilsiz · 3-savolda real pul so'zlari · 3-savol 20 belgidan qisqa — yumshoq) — `node` da namunalar bilan;
   har «Saqlash» → `pm-m11d11-refleksiya.javoblar.{qarorim | notogri | keyingi}` (`savedAt`; birinchi to'liq saqlashda `completedAt`); 3/3 → varaq «Shaxsiy hisobotim», `QIzoh`; nishon `lookBack`. Ichki holat dars progressida (E 51).
9. **Mentor rejimi:** o'quvchilar ro'yxatida faqat saqlash signallari («Holat qo'ydi» · «Hisobot yozdi»; `PRACTICE_BASE`); ish nomlari, holatlar, sabablar va javob matnlari Mentorga ham uzatilmaydi va proyektorga chiqmaydi (A-9). 0-ekrandagi sinf ovozlari — faqat variantlar soni.
10. Testlar s3/s5/s8 — `correctIdx` 1/3/0 = `INLINE_KEYS`; `RECAPS` {3, 5, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 5, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
11. `ACHIEVEMENTS` 4 (`statusCheck`, `notInPlan`, `openPlan`, `lookBack`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·2·1·3·0·1·2·3·0·1·2·3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
12. s11 `QYakun`: sarlavha **besh holat** — `pm-m11d11-refleksiya` va dars progressidan (`ishlar` saqlangan / `javoblar` uchala maydoni to'la / qoralama bor / hech narsa; `roadmapManba: 'qayta-yozilgan'` — sarlavha ostida kulrang qator) (P-046, E 54); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50);
    `uyga` — `HwCard` (Kim bilan · Nechta · Muddat + ①②③; ① ning varianti — `ishlar` da `kechikdi` bor-yo'qligidan; ③ holatdan yig'iladi); `keyingi` — «Loyiha kuni: barqarorlashtirish». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
13. App.jsx `m11-11` qatoriga `comp: PmReflectionLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 455-qator). Bu agent App.jsx ga tegmaydi.
14. **REPO — yo'q** (PM darsi; tayanch 3: `m13-dars-11-done` = `10-done`).
- Darvozalar: `npm run gates -- src/11-Modull/PmReflectionLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md).

## Manbalar (07.10.2026)
- Bu darsda tashqi xizmat qadami yo'q — rasmiy tashqi sahifa **ochilmadi** (tugma, menyu, narx, limit yo'q). Telegram, lending, to'lov taklifi ekrani — faqat Mentor misolidagi ekran matnlari (tayanch 1.4, 1.8, 1.10; 12-Modul tayanchi 1.1, 1.4); Telegram — asbob, keys emas.
- K17 Tesla — faqat bank: `PM_Prompt_v8.md` K17 (253–256-qatorlar: voqea, «raqamsiz» belgisi, mavzular — roadmap, rejalash ufqlari) va tayanch 5 (o'zbekcha matn, brend izohi, ko'prik). Bankdan tashqari fakt qo'shilmagan; tashqi manba qidirilmadi (PM-016).
  K17 kursda ilgari ishlatilgani — grep 07.10: `src/6-Modull/PmLesson24.jsx` (App.jsx `m6-12` — LMS 8-Modul «Bugun qaysi ish boshlanadi?»), faqat O'qituvchi eslatmasida aytiladi.
- Roadmap, ufqlar, uch asosiy funksiya, 15-dars holatlari — 11-Modul tayanchi 1.4, 1.5, 1.9, 8 va `15-FILTR.md` 1–3; `pm-m9d15-reja.holatlar` shakli — `src/9-Modull/PmOneOnOneLesson.jsx` (8, 912-qatorlar; `{ ish, holat }`).
- Mentor holatlari, uch savol va uch javob — `00-MODUL-TAYANCH.md` 1.11 (aynan); Qaror-0 18 (uch savol so'zma-so'z); menyu — App.jsx 454–456 (grep 07.10).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Beshinchi holat «uzoqroqda qoldi»** — Qaror-0 18 da to'rtta nom (bajarildi · kechikdi · olib tashlandi · yangi qo'shildi), tayanch 1.11 Mentor misolida esa «maydon pulini bo'lishish — uzoqroqda qoldi». Men beshinchi nom qildim:
   faqat «Uzoqroq · bitiruvdan keyin» ustunidagi ishga, kalitda `'uzoqroqda'` (tayanch 8 dagi `holat` ro'yxatiga qo'shiladi). Muqobil: uzoqroq ishlarga holat qo'yilmaydi (kulrang «vaqti kelmagan») — u holda Mentorning 4-kartasi bosilmaydi. Qaror kerak.
2. **Holat ufq bo'yicha** — «bajarildi» va «kechikdi» ta'rifida «o'z ufqi ichida» (11-Modul 15-darsida — «rejadagi vaqtida», hozir ufqi uchun — o'z darsi). Sabab: tayanch 1.11 «Chiqish va navbat»ni bajarildi deydi, 11-Modul tayanchi 1.9 da u kechikdi edi (14-darsdan keyin ishladi).
   Ikkalasi rost bo'lishi uchun bugun vaqt — ufq; 1-karta ostida «11-Modul 15-darsida «kechikdi» edi — o'z darsidan keyin, 11-Modul ichida ishladi.» qatori (F-1007-469) va O'qituvchi eslatmasi farqni ochiq aytadi. Muqobil: Mentor misolida navbat — «kechikdi» (tayanch 1.11 o'zgaradi).
3. **Besh holatning ta'riflari** (A-4) — mening matnim; dars bo'yi so'zma-so'z (2, 6-ekran `QIzoh`, recap, kartochka, yakun).
4. **«Shaxsiy hisobot» ta'rifi** — «o'z qarorlaringiz haqida uch savolga yozma javob» — tayanch 2 jadvalida yo'q; qo'shishni taklif qilaman.
5. **2-ekrandagi Mentor kartalari — beshta**, tayanch 1.11 qatorlari bo'yicha: uch funksiya bitta kartada (uchta ish birga halqada), to'rt yangi ish bitta kartada. Har ish alohida karta bo'lsa — o'nta karta (vaqt ko'payadi).
6. **Mentor kartalaridagi sabab qatorlari** «11-Modulda qurildi», «12-Modulda qurildi» — tayanchdagi «(11-Modul)», «(12-Modul)» qavsining gapga aylangani; qolgan ikkitasi — tayanch so'zi aynan.
7. **2-ekran telefon dalillari** — 11, 12, 13-Modul tayanchlaridagi ekran matnlaridan tanladim (A-6); yangi matn to'qilmadi. Telegram chati sarlavhasida bot nomi yo'q (tayanchda yo'q) — faqat «Telegram».
8. **Mentorning yangi ishlari ro'yxati to'liq emas** (12-Moduldagi «Hozir ko'ryapti», jonli xabar, login, maxfiylik sahifasi, APK ham roadmap'da yo'q edi). O'qituvchi eslatmasida: «Mentor roadmap darajasidagi katta ishlarni yozgan» — bu mening izohim; tayanch 1.11 ga bir gap qo'shishni taklif qilaman.
9. **`pm-m9d15-reja`** — faqat tarix qatori («11-Modul 15-darsida: …»). 15-darsdagi uch qadam (tuzatilgan reja) bugungi doskaga ish bo'lib kirmaydi: Mentor misolida ularning bugungi holati tayanchda yo'q (masalan, «10 kishini sinovga chaqirish»). Kirsin desangiz — tayanch 1.11 ga Mentor qadamlari holatlari kerak.
10. **Kalit `pm-m11d11-refleksiya`** — tayanch 8 ga nisbatan: `ishlar[].ufq` qo'shildi (`'hozir' | 'keyinroq' | 'uzoqroq' | null` — keyin o'qiydigan dars ish qaysi ufqda bo'lganini bilsin), `holat` ga `'uzoqroqda'`, `javoblar` — `string | null` (qisman saqlash uchun). F-1007-469: `javoblar` — nomli maydonlar `{ qarorim, notogri, keyingi }`; `roadmapManba`, `completedAt` qo'shildi.
11. **O'qiladigan kalitlar:** tayanch 8 jadvali 11-darsga `pm-m11d2-model`, `pm-m11d6-suhbat`, `pm-m11d7-hujjat`, `pm-m11d9-tasdiq` ni beradi, 2-to'lqin jadvali — `pm-m9d6-roadmap`, `pm-m9d15-reja`, `pm-m11d2-model`. Men: roadmap, reja, model, suhbat, tasdiq o'qiladi;
    `pm-m11d7-hujjat` o'qilmaydi (darsda unga joy yo'q — jadvaldan olib tashlashni taklif qilaman); qo'shimcha — `pm-m11d1-birlik.narxTaxmin` va `pm-m11d4-narx.narx` (Mentorning 2-javobi naqshidagi dalil tugmasi; tayanch 8 da 11-dars ularni o'qimaydi). Tasdiq kerak.
12. **Tesla bosqichlari tarjimasi** — tayanchdagi «shu pulga» o'rniga «uning pulidan» (o'zbekchada «shu pulga» «shu narxga» deb o'qilishi mumkin; bankning ruscha aslida — «o'sha pul hisobiga»), «kichik seriyada, ya'ni oz sonda» — izoh. Bank ma'nosi o'zgarmagan.
13. **K17 bashorati** «Bu reja qancha vaqt bajarilgan?» — variantlar «Bir yil ichida» · «Bir necha yil» · «O'n yildan ortiq»: birinchi ikkitasi bankda yo'q — ular taxmin variantlari, fakt sifatida aytilmaydi (12-Modul 10-dars K5 bashorati naqshi). To'g'ri javob — bankdan.
14. **Mentorning 3-javobidagi «Tasdiq»** — 2-ekrandagi «O'yin kuni tasdiq» (funksiya nomi) bilan bitta darsda; javob aynan qoldi, ostiga kulrang «tasdiq — 9-darsdagi yozma tasdiq». Taklif: tayanch 1.11 da «Yozma tasdiq bergan uch tashkilotchi bilan …».
15. **Uyga vazifa** — bitta ish bo'yicha qaror (yangi ufq yoki olib tashlash) va «keyingi 4 hafta» ishining boshlanish vaqti; qog'ozda. Tayanchda 11-dars uyga vazifasi yo'q (4-bo'lim: PM — yakun kartasida).
16. **Yakun sarlavhalari** — besh holat (A-1, 11-ekran).
17. **Bugungi asosiy fikr** — mening matnim (A-2).
18. **Hisobot matni Mentorga uzatilmaydi** — 12-Modul 11-darsidagi «matn uzatilmaydi» naqshi; Mentor faqat signalni ko'radi. Mentor hisobotni ko'rishi kerak bo'lsa — alohida qaror (o'quvchi o'z ekranini ko'rsatadi).
19. **Keyinroq ufqidagi hali qilinmagan ish — «kechikdi»** — ufq (12–13-Modul) rasman 13-Modul oxirida tugaydi, lekin 12-dars yangi funksiya qo'shmaydi (tayanch 1.12); shu sabab bugun «kechikdi» deyiladi. O'quvchiga sabab aytilmaydi (keyingi dars va'da qilinmaydi) — faqat O'qituvchi eslatmasida.
20. **Arena 4 to'g'ri javobi** «Telegram orqali xabar yuborish» — Mentorning yangi ishi «Telegram xabari»ning ta'rifi (tayanch 2: Backend Telegram bot orqali yuboradigan xabar).

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — 6-ekran ≈ 20 (roadmap'da 6–8 ish bo'lsa, har karta ≈ 1,5–2 daqiqa), 7-ekran ≈ 18. Bu — reja: «qur» pilotida 12–15 o'quvchi bilan taymer bilan o'lchanadi.
2. **Beshinchi holat** (TAYANCHGA SAVOL 1) — Qaror-0 18 dagi to'rt nomdan farq qiladi; foydalanuvchi to'rttada qolish desa, 2-ekran 4-kartasi va 6-ekran uzoqroq ustuni qayta yoziladi.
3. **«Chiqish va navbat» — bajarildi** (TAYANCHGA SAVOL 2): 11-Modul 15-darsini eslagan o'quvchi «kechikdi» deb bosishi mumkin — xato izohi ufqqa yo'naltiradi, O'qituvchi eslatmasi farqni aytadi. Auditor «Mentor misoli izchil emas» deyishi mumkin.
4. **«Uzoqroq · bitiruvdan keyin»** — 11-Modul ufq yorlig'i aynan; bitiruv himoyasi va'da qilinmaydi, lekin «bitiruv» so'zi doskada turadi.
5. **Mentorning 3-javobi** («Doimiy o'yin»ni sinab ko'raman) — real to'lov deb o'qilishi mumkin; O'qituvchi eslatmasi «bu kursda real pul yo'q» deydi, javobning o'zi aynan.
6. **Mentor yangi ishlari to'liq emas** (TAYANCHGA SAVOL 8) — o'quvchi «"Hozir ko'ryapti" ham roadmap'da yo'q edi» desa, O'qituvchi eslatmasidagi izoh.
7. **7-ekran yumshoq tekshiruvlari** (dalil so'zlari, real pul so'zlari, Mentor javobi bilan bir xil) — erkin matnda noto'g'ri ishlashi mumkin; bloklamaydi. `node` sinovida namunalar bilan.
8. **Mentor javobi ko'rinib turishi** — nusxa olish xavfi (yumshoq tekshiruv faqat aynan bir xil matnni ushlaydi). Muqobil — Mentor javobi «Yordam» ichida (E 43); men chapdagi kartani tanladim, chunki shaxsiy hisobotning boshqa namunasi darsda yo'q.
9. **Tesla — «o'n yildan ortiq bajarilgan»** — bank bosqichlar tugaganini aytmaydi; sahnada ✓ ham, yonish ham yo'q — bosqichlar reja sifatida navbat bilan ko'rsatiladi (F-1007-469). Tayanch ko'prigidagi «bosqichma-bosqich bajarilgan» shu chegarada.
10. **3-ekran A varianti** («Bajarildi: ilovada hozir ishlab turibdi») — hayotda «qilindi» ma'nosida rost; dars qoidasi bo'yicha «bajarildi» — faqat roadmap'dagi ish. Auditor bahslashishi mumkin — savolda «roadmap'da yo'q edi» aniq aytilgan.
11. **5-ekran C varianti** («Sinfdoshlar roadmap'i bilan solishtirishga») — hayotda foydali bo'lishi mumkin; savol «bugun u sizga nimaga kerak» — o'z roadmap'i va o'z mahsuloti. Bahsli bo'lsa — boshqa distraktor.
12. **8-ekran A** — uch suhbat — kichik son; dars uni «dalil» deydi, «isbot» demaydi (6-dars qoidasi). Auditor «uch kishi kam» desa — savol «nima ko'rsatadi», «isbotlaydi» emas.
13. ✅ (F-1007-469: «Narx taxminlarim») **Dalil tugmasi «Narxingiz: 1-darsda …, 4-darsda …»** — o'quvchida ikkala son ham taxmin bo'lishi mumkin; tugma faqat sonlarni qo'yadi, «noto'g'ri edi» demaydi — qarorni o'quvchi yozadi.
14. **Ism tekshiruvi** — erkin matnda ismni dastur aniqlay olmaydi; faqat telefon va akkaunt shakli bloklanadi.

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + 13-Modul pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-10 taqsimot va «Ulgurmagan o'quvchi yo'li»; ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi; tashqi kutish yo'q.
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — tashqi xizmat qadami yo'q (Manbalar); faqat vaqt — ⛔ pilotda.
3. [x] **Saqlash kaliti — shartnoma** — A-11: har maydon, tipi, `holat` va `ufq` mosligi, `javoblar` nomli uch maydon (`string | null`), tartib, `roadmapManba`, `savedAt` (oxirgi saqlash) va `completedAt` (tugatilgan); kalitga ism yo'q; o'qiladigan kalitlar yo'q bo'lsa — nima bo'lishi yozilgan; `tur: 'mashq'` sonlari dalil tugmasiga kirmaydi; dars boshqa darsning kalitiga yozmaydi.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — xulosalar «Bu darsda …» (2-ekran, recap 3, yakun); Mentor misoli — «Mentor misolida» (2, 6, 7-ekran); uch savol — kurs topshirig'i, o'quvchining javobi o'z mahsulotidan; «Keyinroq ufqidagi ish — kechikdi» — «Bu darsda» bilan.
5. [x] **Kafolat va sabab da'vosi yo'q** — Tesla: «bosqichma-bosqich bajarilgan» — bank chegarasida, ✓ chizilmaydi (Shubhali 9); 8-ekran — «dalil», «isbot» emas; «Roadmap solishtirildi» — ish fakti; holat — sabab da'vosi emas, o'quvchining yozgan sababi.
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — yakun besh holat (11-ekran; E 54); 6, 7-ekran xulosalari holatdan; «Look Back!» faqat uchala javob saqlanganda; nishon tavsiflari qilingan ishni aytadi.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — holatlar har ishga bitta; «oltita ish» — Mentor roadmap'idagi ishlar soni; 6-ekran xulosasidagi son — o'quvchining ishlari; dalil tugmalarida birlik aytilgan (suhbat · kishi · so'm · ish).
8. [x] **Test: bitta himoyalanadigan javob** — 3, 5, 8-ekran va arena: distraktorlar uch xil turkumdan (Izoh qatorlari), kalit so'z faqat to'g'rida emas («qo'shildi» 3-ekranda B va C da, «solishtirish» 5-ekranda C va D da), to'g'ri javob yolg'iz eng uzun emas, inkor-savol yo'q; bahsli joylar — Shubhali 10–12.
9. [x] **Real odamlar xavfsizligi** — bu darsda real suhbat yo'q; hisobot shaxsiy, Mentor ekraniga va proyektorga chiqmaydi (A-9, KOD 9); sinfda o'qitilmaydi va sanalmaydi; telefon va akkaunt nomi bloklanadi.
10. [—] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — agent va tekshiruv akkaunti yo'q; ishning holatini o'quvchi o'z mahsulotini ochib o'zi belgilaydi (6-ekran Yordam).
11. [x] **Web-trek teng yo'l** — PM darsi, blok yo'q; «mahsulotingiz»; 6-ekran Yordam «web-trekda saytingizda»; kalitlar ikkala trekda bir.
12. [x] **Mentor misoli ichki izchil** — holatlar va javoblar tayanch 1.11 aynan; «Chiqish va navbat» farqi ochiq aytilgan (TAYANCHGA SAVOL 2); 10 000 (1-dars), uch tasdiq (9-dars) — tayanch 1.13 bilan bir; keyingi darsning sonlari ochilmaydi; sahna uchun yangi tafsilot — TAYANCHGA SAVOL 5–8.
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — holat, sabab, yangi ish, uch javob — o'quvchida; Mentor misoli — namuna; 7-ekran Yordam: «Agent yoki Mentor tanlagani emas».
14. [x] **Uyga vazifa yengil va aniq** — bitta qaror, bitta vaqt, ③ faqat qolgan qism bo'lsa; muddat — keyingi darsgacha; qog'ozda.
15. [x] **Ayb da'vosi yo'q** — xato izohlari harakatga chaqiradi («qarang», «qo'shing», «yozing»); «Olib tashlash — mag'lubiyat emas», «Noto'g'ri chiqqan qaror — mag'lubiyat emas» (Yordam); «xatongiz» yo'q.
16. [x] **Kelajak va'dasi yo'q** — keyingi dars va modul ekranda va'da qilinmaydi; «keyingi 4 hafta» — o'quvchining o'z rejasi; Mentorning 3-javobi — reja (O'qituvchi eslatmasi).
- [x] **12-Modul tayanchi 7 (14 band)** — holatga qarab yakun (11-ekran) · da'vo isbot emas (8-ekran, Tesla) · maxfiy qiymat yo'q (agent, `.env` bu darsda yo'q) · tashqi xizmat — yo'q · har sonning manbasi (A-6: «Mentor misolida», «Mentorning taxmini»; dalil tugmalarida dars raqami) ·
  tayanchda yo'q narsa — TAYANCHGA SAVOL · kalit o'qiydigan darsdan (14-Modul — faqat tayanchda; o'quvchiga aytilmaydi) · test bitta javob · keys: bank so'zi aynan (A-7; tarjima — TAYANCHGA SAVOL 12) · 90 daqiqa · bir ma'no — bir so'z (A-5) · web-trek teng · agent yo'q · o'smir xavfsizligi (A-9).
- [x] **13-Modulga xos (pul)** — real pul yo'q (A-9; 7-ekran 3-savol eslatmasi) · karta ma'lumoti hech qayerda (Mentor 5-kartasidagi to'lov taklifi ekranida karta formasi yo'q) · «mashq to'lov» bu darsda ko'rsatilmaydi ·
  «Test rejim: pul yechilmaydi» to'lov ekranida (2-ekran 5-karta) · narx — «Mentorning taxmini» (2-ekran telefon, 7-ekran 2-javob) · suhbat va tasdiqda bosim — bu darsda suhbat yo'q · oferta — [—] bu darsda yo'q.

## O'lchov — `md11/olchov.py` va `md11/overlap.py` natijasi (qavsdagi sonlarni `md11/fill.py` matnning o'zidan sanadi)
```
Qavsdagi uzunliklar: sanaladigan har satr belgi bilan yozildi va soni avtomatik qo'yildi (qo'lda sanalgan son yo'q); olchov.py qayta tekshirdi — mos 132,
  qolgan 25 signal — ekran, savol, bo'lim raqamlari va «(umumiy)» bilan boshlangan satrlar (ularning soni ham fill.py dan).
Sarlavhalar (7 ekran + yakunning 5 holati): 25–51 · ≤55, hammasi bitta qator.
Xulosalar: 2-ekran 99 · 4-ekran 63 · 6-ekran 66 / 44 · 7-ekran 61 / 57 · ≤110.
QIzoh va kulrang qatorlar: 37–80 (bitta qator). Ipucha: 59 · 52.
Bugungi asosiy fikr (A-2, yakunda ko'rsatilmaydi): 108 · ≤110.
Hook javobi: 112 · ≤120 (sof so'rovnoma — uchala variantga bitta javob); hook variantlari 29 · 36 · 32 (F-1007-469).
To'g'ri izohlar: 54 · 56 · 55 · ≤60.
Xato izohlari, QXato va tekshiruv xabarlari (34 ta): 22–58 · ≤60.
Nishon tavsiflari: 37 · 42 · 36 · 40 · ≤48 (KORPUS §63).
Mentor gaplari: kirish 2 gap (102) · reja 2 gap (148) · interaktiv 2, 6, 7-ekran — 1 gap (71, 98, 64) · Tesla kadrlari 1 · 2 · 1 gap;
  sarlavha so'zlari Mentorda (overlap.py): 1/3 · 1/5 · 2/5 · 2/5 · 1/6 — hech qayerda ≥50% emas; «Bu…», «Hammasini…» bilan boshlanmaydi.
Test savollari: 3-ekran 10 so'z · 5-ekran 8 · 8-ekran 9 · arena 5–8 · ≤12.
3-ekran: A 39 · ✔B 41 · C 43 · D 39 | min/max 39/43 (+10%)
5-ekran: A 40 · B 39 · C 42 · ✔D 37 | min/max 37/42 (+14%)
8-ekran: ✔A 42 · B 40 · C 44 · D 42 | min/max 40/44 (+10%)
arena 1: ✔A 45 · B 46 · C 42 · D 44 | +10% (F-1007-469)
arena 2: A 31 · B 33 · ✔C 31 · D 33 | +6%
arena 3: A 31 · ✔B 31 · C 31 · D 35 | +13%
arena 4: A 31 · B 32 · C 31 · ✔D 30 | +7%
arena 5: ✔A 34 · B 34 · C 32 · D 33 | +6%
arena 6: A 33 · ✔B 31 · C 30 · D 30 | +10%
arena 7: A 32 · B 29 · ✔C 33 · D 33 | +14%
arena 8: A 32 · B 30 · C 33 · ✔D 32 | +10%
arena 9: ✔A 31 · B 34 · C 32 · D 33 | +10%
arena 10: A 32 · ✔B 34 · C 33 · D 34 | +6%
arena 11: A 35 · B 35 · ✔C 35 · D 33 | +6%
arena 12: A 31 · B 34 · C 30 · ✔D 31 | +13%
To'g'ri variant hech bir testda yolg'iz eng uzun emas.
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```
Belgilar soni — bo'shliq bilan, `**` siz (Python `len`). `npm run lint:til feedback/F-1007-13modul/11-PmReflection-v3.md` — **0 error, 0 warn** (yakuniy yurish; lint qoidalaridagi taqiq so'zlar va kirill harf yozishda oldindan chetlab o'tildi).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 454–456 (grep 07.10) — `m11-10` «Loyiha kuni: taklif havolasi va mukofot» → **`m11-11` «Mahsulotingiz hozir qayerda?»** (osti «roadmap bilan solishtirish va shaxsiy hisobot» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m11-12` «Loyiha kuni: barqarorlashtirish» (yakundagi «Keyingi dars» qatori). 0-ekran sarlavhasi — dars nomi.
- [x] Bitta misol-ip — «Maydon Jamoa» (Mentor roadmap'i, holatlar, uch javob — tayanch 1.11); ikkinchi misol faqat testlarda (uy vazifalari, kitob almashish — P-002); keys — K17 (bank aynan); metafora yo'q; bitta vizual — `HolatDoska` (doska · telefon · hisobot varag'i); 4-ekranda keys sahnasi (P-053).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → holat yorlig'i kartaga uchadi, telefon sahnasi almashadi), 4 (bashorat va «Voqea davomi» → kadr almashadi) + 0, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python): sarlavha 25–51 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi 112 · to'g'ri izoh 54–56 · xato izohi 22–58 · nishon ≤48.
- [x] Atamalar oldingi darslar bilan bir (grep): roadmap, ufq, ustun yorliqlari, ish, uch asosiy funksiya nomlari — 11-Modul 1.4, 1.5 · holat (bajarildi, kechikdi) — 11-Modul 15-dars (ko'prik bilan) · dalil — 12-Modul 11-dars · Pro, «Doimiy o'yin», to'lov taklifi ekrani, test rejim, Telegram xabari, taklif havolasi, yozma tasdiq — 13-Modul tayanchi 2 ·
  yangi: holat (bu darsda), olib tashlandi, uzoqroqda qoldi, yangi qo'shildi, shaxsiy hisobot — misoldan keyin, ta'rif dars bo'yi bir xil · siz-forma; tugmalar ot-shaklda yoki siz-formada («Bajarildi», «Saqlash», «Qo'shish», «Yangi ish yo'q», «Voqea davomi»). ⚠️ «uzoqroqda qoldi» — TAYANCHGA SAVOL 1.
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (3–14%); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas; inkor-savol yo'q · ✔ o'rni 3-ekran B, 5-ekran D, 8-ekran A (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ — belgilar) · kafolat so'zlari yo'q («har doim», «hech qachon», «darrov», «albatta», «100%» — o'quvchi matnida 0) · xulosalar «Bu darsda …», «Bu voqeada …» bilan chegaralangan.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m11-11`, «A1», «Modul 13», K-raqam, «keys», «refleksiya» yo'q; modul raqami LMS bo'yicha — «11-Modulda», «12-Modulda»); tarixiy voqea — bank manbasi bilan (Manbalar); «KOD» ro'yxati 14 band, REPO yo'q.
- [x] Karta T · P · S · PM: T-008 (Mentor javoblari, ekran matnlari — olam ichidagi matn) · T-011/PM-030 (holat va uch nom — 2-ekranda kartadan keyin; kechikdi, olib tashlandi — 6-ekranda o'quvchi ishidan keyin; shaxsiy hisobot — 7-ekranda saqlangach) ·
  T-014/T-015 (A-5: roadmap/reja, holat, tasdiq ikki joyda o'z nomi bilan, dalil) · T-016/T-017 (metafora yo'q) · T-024 · T-029/T-047 · T-038 (keyingi dars va modul va'da qilinmaydi) · T-039 («roadmap'ingiz» — 11-Modulda bor; kalit yo'q bo'lsa — o'zi yozadi) ·
  T-042 (ta'riflar so'zma-so'z: 2, 6, 7-ekran, kartochka, recap, yakun) · T-043 («Mentor misolida», «Bu darsda») · T-045 (Tesla — bank chegarasida; «dalil, isbot emas» ruhi) · T-048 · T-049 · T-052 (11-Modul 15-dars holati ↔ bugungi holat) · T-064 ·
  P-001 · P-002 · P-004 (6, 7 — o'z roadmap'i va o'z qarorlari) · P-008 · P-012 (testlar 3, 5, 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 (kalit yo'q bo'lsa — o'zi yozadi) · P-033 · P-036 · P-046 · P-048 · P-052 · P-053 · P-055 · P-062 · P-064 · P-067 ·
  S-001 (savollar 5–10 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-018 (Tesla brend izohi) · S-019 · S-020 · S-026 · S-027 · §101/§124 (keys fakti bankdan) · §144/§145 · PM-005 (2-tur) · PM-018 · PM-021 · PM-027 · J-026 · SABOQ 1–39, E 40–55.
- [x] Pul va xavfsizlik (TAQIQLAR 1, 3): real pul yo'q, karta ma'lumoti yo'q, «Test rejim: pul yechilmaydi» to'lov ekranida, narx — «Mentorning taxmini», hisobot shaxsiy (Mentor ekraniga chiqmaydi), ism/telefon/akkaunt nomi yo'q, sinfda o'qitilmaydi va sanalmaydi.
