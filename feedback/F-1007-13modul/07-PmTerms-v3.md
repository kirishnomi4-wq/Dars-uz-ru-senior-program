# 13-Modul (kod: `src/11-Modull`) · 7-dars (PM + amaliyot) «Foydalanuvchiga shartlarni qanday ochiq aytasiz?» — MD v3

Fayl: `src/11-Modull/PmTermsLesson.jsx` (yangi; kod `src/skelet/NamunaDars.jsx` dan) · kalit `m11-07` · **12 ekran** (PM qismi 6 · amaliyot bloki 2 · yakuniy savol, podium, kartochkalar, yakun — 4; PM+PRAKT shakli — tayanch 4) · faqat o'zbekcha (ru — 6-RU bosqichida)
Fidbek: qator yoniga `>> …` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatda quriladi — `.jsx` hozir yo'q, hamma ekran noldan.
Quruvchi qoidalari (12-Modul `QURUVCHI_SABOQ.md` A–E majburiy; E 40–55 qat'iy): kartochkalar alohida ekran, Mentorsiz · test ustida yorliq yo'q · keyingi bosiladigan joy doim ko'rinadi (har variantning o'z yengil chegarasi — E 40; bitta navbatdagi tugma — halqa) ·
bashorat tanlangach yopilmaydi — ixcham qator natijagacha turadi, natijada u yashil xulosa qutisining birinchi kichik qatori (E 42) · ko'p elementli mashq ketma-ket, bir vaqtda bitta katta karta (E 53) · odamlar real ko'rinishda (SABOQ 36) · telefon maketi chapda, o'lchami barqaror (≈170×272) ·
ekranda ≤ 3 blok · maketda hech narsa kesilmaydi (E 41) · «Ortda qoldingizmi» darsda bir marta, birinchi blokda (SABOQ 39) · yakun — E 50 standarti («Bugungi asosiy fikr» qutisi yakunda yo'q) · yakuniy holat ixcham (1280×800 da skrollsiz).
⚠️ Testlarda to'g'ri javob O'RNI (yangi dars, kodda shunday qoladi): 3-ekran — **B** (`correctIdx 1`) · 8-ekran — **C** (`correctIdx 2`) — `INLINE_KEYS` bilan bir xil; arena 12 savol — A·B·C·D ×3.
Menyu (App.jsx 450–452, grep 07.10, DE-205): `m11-06` «Pul haqida qanday gaplashasiz?» → **`m11-07` «Foydalanuvchiga shartlarni qanday ochiq aytasiz?»** (osti: «oferta va maxfiylik siyosati saytda», `type: 'PM'`) → `m11-08` «Loyiha kuni: ketayotgan foydalanuvchini qaytarish».
Tur (PM-005): aralash — PM qismi (0–5) **2-tur sof PM** (artefakt — o'z ofertasining bandlari, yozma matn; mustaqil ish majburiy — 5-ekran) + **ikki amaliyot bloki** o'quvchining o'z repo'sida (6, 7-ekranlar). **Keyssiz** (tayanch 5, Qaror-0 21). Kod oynasi yo'q (tayanch 4: «7 — bloklar»).
⚠️ **Pul va halollik chegarasi (TAQIQLAR 1; Qaror-0 6, 13) — har ekranga tegadi:** real pul yo'q — oferta **shablon** va **«Mashq hujjati — real to'lov qabul qilinmaydi»** · sotuvchi qatori bo'sh: «[real ishga tushirishda — yuridik shaxs yoki YaTT]» · oxirida **«Bu hujjat yuridik maslahat emas.»** ·
«yurist tekshirgan», «qonunga to'liq mos» — yo'q · karta ma'lumoti hech qayerda (maketda, promptda, kalitda, namunada) yozilmaydi va chizilmaydi · har to'lov taklifi ekrani maketida «Test rejim: pul yechilmaydi» · narx — «Mentorning taxmini» ·
qonun — faqat «FK 369-modda» (ommaviy oferta) va «FK 27-modda» (ota-onaning yozma roziligi), manba `lex.uz/docs/-111189`; o'quvchi matnida — «qonunda …» (TAQIQLAR 5 oxiri).
Vaqt: ≈ 90 daqiqa (taqsimot — A-11; ⛔ reja, «qur» pilotida taymer bilan o'lchanadi).
Manba: `00-MODUL-TAYANCH.md` (1.0 — Pro, «Doimiy o'yin», avtomatik yechish yo'q · 1.4 — Mentor narxi va to'lov taklifi ekrani · **1.7 — oferta ta'rifi, Mentor ofertasi, siyosatga to'lov bandi, halollik gapi, bloklar — AYNAN** · 2 — atamalar · 3 — teg 07 · 4 — PM+PRAKT shakli · 6 — FK 27, 369 · 7 — sinflar · 8 — `pm-m11d4-narx`, `pm-m11d2-model`, `pm-m11d7-hujjat` · 9 — kelishuvlar) ·
`GATE_M_JAVOB.md` (Qaror-0 1, 2, 6, 13, 21, 22, 23) · `00-TAQIQLAR.md` (0–7) · `00-NOMLAR.md` · 12-Modul tayanchi (1.1 — lending; 1.7 — `lending/maxfiylik.html`, to'rt savol, «Hisobni o'chirish», APK; 9.28 — Netlify; 9.35 a, 9.37 g — tekshiruv akkaunti; 9.39 f — «[savol]» naqshi) ·
namunalar (tuzilish va hajm; matn ko'chirilmadi): 10-Modul `06-PmTrustAudit-v3.md` + `06-FILTR.md` (siyosat gapi kod bilan solishtiriladi, «yuridik maslahat emas», «faqat o'z saytingizda») · 12-Modul `07-PmFiftyUsers-v3.md` + `07-FILTR.md` (A2 «[savol]» naqshi, qaytarib bo'lmaydigan o'zgarish, ota-ona va tekshiruv akkaunti) · pilotlar `03` (blok shakli), `06` (12 ekranli PM shakli).
⚠️ Modul raqami o'quvchi matnida — LMS raqami: «12-Modulda» (lending, siyosat; kod `10-Modull`), «4-darsda», «5-darsda» (shu modul). Kod raqami faqat fayl yo'lida.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Darsning bitta natijasi** (dastur: «oferta, siyosat → hujjatlar saytda e'lon qilinadi» · natija «Oferta va siyosat saytda»; tayanch 4: «oferta va siyosatdagi to'lov bandi saytda»; Qaror-0 2, 13):
   o'quvchi o'z mahsuloti uchun **ofertaning olti bandini** yozadi — uchtasini o'zi (nima beriladi · narx va muddat · muddat tugasa), uchtasi shablondagi «[real ishga tushirishda …]» bo'lib qoladi (5-ekran);
   agent `lending/oferta.html` ni yasaydi va bandlarni kod bilan solishtiradi, koddan bilinmaganini «[savol]» qoldiradi — o'quvchi tekshiradi va to'ldiradi (Amaliyot 1);
   `lending/maxfiylik.html` ga **to'lov bandi** qo'shiladi (o'quvchi bitta qatorni o'zi yozadi), lending pastida va to'lov taklifi ekranida ikki havola — «{nom} shartlari» va «Maxfiylik siyosati»; push, Netlify, telefonda ochib tekshirish (Amaliyot 2).
   Saqlanadi `pm-m11d7-hujjat` (A-12; 11-dars o'qiydi). Teg `m13-dars-07-done` (tayanch 3). Natija besh holatda bo'lishi mumkin (11-ekran sarlavhasi shunga qarab; ✓ va nishon — faqat birinchisida).
   Bugun hech kimdan pul olinmaydi va hech narsa sotilmaydi; real ishga tushirish — bu kursda emas. Keyingi darslar ekranda va'da qilinmaydi (T-038).
2. **Bugungi asosiy fikr (P-013 — darsning ichki o'qi; yakunda ko'rsatilmaydi, SABOQ E 50):** Odam to'lasa — shartlarga rozi bo'ladi: ular oldindan ochiq yoziladi va faqat bugun ishlaydiganini aytadi. (106)
3. **O'tilgan — qayta o'rgatilmaydi, o'sha so'zlar bilan (T-052):**
   - 13-Modul: **Pro** (tashkilotchi uchun 30 kunlik pullik obuna) · **«Doimiy o'yin»** · **narx** — «odam to'laydigan pul» (Mentor: 30 kun — 15 000 so'm, «Mentorning taxmini», 4-dars) · **to'lov taklifi ekrani** (4-dars; Mentor matni — A-6) · **test rejim** · **mashq to'lov** va `tolovlar` jadvali (3-dars) ·
     Pro muddati (`oyinchilar.pro_gacha`, 4-dars) · Pro tugashi (5-dars: «Doimiy o'yin» to'xtaydi, e'lon qilingan o'yinlar qoladi) · Pro avtomatik yangilanmaydi — pul o'zi yechilmaydi (tayanch 1.0).
   - 10-Modul 6-darsi: **maxfiylik siyosati** — «odamga ma'lumoti bilan nima bo'lishini aytadigan sahifa»; siyosatdagi gap kod bilan solishtiriladi; «dars yuridik maslahat bermaydi».
   - 12-Modul: **lending** (`lending/`, Netlify; push'dan keyin odatda o'zi yangilanadi — 12-Modul 9.28) · `lending/maxfiylik.html` — **to'rt savol**: qaysi ma'lumot · nima uchun · kim ko'radi · qancha saqlanadi (7-dars) · agent koddan bilmagan joyni **«[savol]»** qoldiradi, o'quvchi yozadi (7-dars, 9.39 f) ·
     «Hisobni o'chirish» · **o'rnatish fayli (APK) o'zi yangilanmaydi**, brauzer ko'rinishi — qayta eksport (9.28).
   - 11-Modul: **agent** (Antigravity) · **prompt** · **talab** (qayerda · nima qilsin · nima buzilmasin) · `.env` · `git status` → `git add <fayl>` · Expo Go · trek (`pm-m9d8-platforma.trek`).
4. **Bugun yangi — har biri misoldan KEYIN, bir marta (T-011, PM-030); ta'rif dars bo'yi so'zma-so'z (T-042):**
   - **oferta** — tayanch 1.7 sodda ta'rifi, so'zma-so'z: «Oferta — hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan. Odam to'lasa — shu shartlarga rozi bo'ladi.»
     Tug'iladi 2-ekranda — tashkilotchining savollari ajratilgandan keyin (xulosa: «Odam to'lasa — shartlarga rozi bo'ladi…»; `QIzoh`: «… oferta deyiladi»). Yakun 1-qatori, kartochka 1 va arena 1 — shu so'zlar.
     Qonun (FK 369-modda — ommaviy oferta; tayanch 6) — o'quvchi matnida faqat kartochka 1 izohida («O'zbekiston qonunchiligida — ommaviy oferta (369-modda)») va O'qituvchi eslatmasida (2-ekran).
   - **band** — ofertaning bitta bo'limi: sarlavha va matn (Mentor ofertasida olti band — tayanch 1.7). Siyosatda — **to'lov bandi** (to'lov haqidagi gaplar). 4-ekranda tug'iladi (Mentor gapi va karta sarlavhasi «Band n / 6»).
   - **real ishga tushirish** — mahsulot haqiqiy pul qabul qila boshlashi; **bu kursda emas**. Halollik gapi (tayanch 1.7, TAQIQLAR 1 — so'zma-so'z, faqat T-036 bo'yicha qisqartma ochilgan — TAYANCHGA SAVOL 6):
     «Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas.» — 4-ekranda kulrang doimiy qator (darsda bir marta) va kartochka 6.
   - **«[savol]»** — agent koddan bilolmagan joy; o'quvchi o'zi yozadi (12-Modul 7-darsidan; bugun ofertada ham) — 5-ekran («Hali bilmayman»), Amaliyot 1 va 2.
   - **«Mashq hujjati — real to'lov qabul qilinmaydi»** va **«Bu hujjat yuridik maslahat emas.»** — oferta sahifasining tepa va oxirgi qatori (tayanch 1.7); 4-ekran `QIzoh` ularning vazifasini aytadi.
5. **So'zlar (bir ma'no — bir so'z, T-014/T-015; tayanch 2 «Ishlatilmaydi» ustuni):**
   - **«shart»** — to'lovchi rozi bo'ladigan narsa (ofertada yozilgan). Sahifa nomi — **«{nom} shartlari»** (Mentor: «Pro shartlari»). «qoidalar», «dogovor» (oferta ma'nosida) — yo'q.
   - **«ekran»** — bu darsda faqat **to'lov taklifi ekrani** (2-ekran tugmalari va bashoratida qisqa — «ekranda»: telefondagi o'sha ekran); dars ekranlari o'quvchi matnida «ekran» deb atalmaydi (T-064) — bo'limlar o'z nomi bilan: «Mustaqil ish», «Amaliyot 1», «Amaliyot 2».
   - **«band»** — faqat oferta va siyosat bo'limi. **«sahifa»** — faqat internet sahifasi (`oferta.html`, `maxfiylik.html`, lending).
   - **«sotuvchi»** — ofertadagi «Kim taklif qiladi» bandi (real ishga tushirishda — yuridik shaxs yoki YaTT); boshqa ma'noda yo'q.
   - **«havola»** — sahifaga olib boradigan yozuv («Pro shartlari», «Maxfiylik siyosati»); «link» yo'q.
   - **«pullik obuna»** — doim ikki so'z (A-bo'lim va kartochka izohida); o'quvchi matnida Mentor misoli — «Pro».
   - **«tekshir-»**, **«tekshiruv»** — o'z ishini ko'rish (bloklarning 4-qadami, tekshiruv akkaunti); **«test»** — faqat «test rejim»; **«sinov»** — faqat uyga vazifa ② (real odam).
   - **«to'lovchi»** — pul to'laydigan foydalanuvchi; Mentor misolida — Pro oladigan tashkilotchi (tayanch 2).
   - **Ishlatilmaydi:** shartnoma (o'quvchi matnida), dogovor, yurist, «qonunga mos», kafolat, sotuv, link, paywall, sandbox, freemium, CAC, LTV, xabar (to'lov xabari bu darsda kerak emas), obuna (yolg'iz), server, sir, «Modul 13», A1/A2, `m11-07`, keys, pilot, daftar.
6. **Mentor misoli (tayanch 1.0, 1.4, 1.7 — AYNAN; o'quvchi matnida «Mentor misolida»):**
   - **To'lov taklifi ekrani (1.4 so'zma-so'z; `MENTOR_EKRAN`):** sarlavha «Doimiy o'yin — Pro'da» · matn «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · narx «30 kun — 15 000 so'm» (yonida kulrang «Mentorning taxmini») · tugma «To'lovga o'tish» · pastda kulrang «Test rejim: pul yechilmaydi».
     7-darsdan (Amaliyot 2): «To'lovga o'tish» ostida ikki kichik havola «Pro shartlari» · «Maxfiylik siyosati» (TAYANCHGA SAVOL 2, 3).
   - **Mentor ofertasi (1.7 so'zma-so'z; `MENTOR_OFERTA`)** — `lending/oferta.html`, manzili `maydon-jamoa-….netlify.app/oferta.html` (12-Modul naqshi):

| Joy | Matn (so'zma-so'z) | 4-ekrandagi kalit |
|---|---|---|
| tepada | Mashq hujjati — real to'lov qabul qilinmaydi | — |
| sarlavha | Pro shartlari | — |
| 1 · Kim taklif qiladi | [real ishga tushirishda — yuridik shaxs yoki YaTT] | real ishga tushirishda |
| 2 · Nima beriladi | «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi | bugun |
| 3 · Narx va muddat | 30 kun, 15 000 so'm; muddat tugagach Pro o'zi to'xtaydi, pul avtomatik yechilmaydi | bugun |
| 4 · Pro tugasa | e'lon qilingan o'yinlar qoladi, yangi o'yin o'zi e'lon qilinmaydi | bugun |
| 5 · Bekor qilish va pulni qaytarish | [real ishga tushirishda yoziladi; mashqda pul yechilmaydi] | real ishga tushirishda |
| 6 · Aloqa | [real ishga tushirishda] | real ishga tushirishda |
| oxirida | Bu hujjat yuridik maslahat emas. | — |

   - **Siyosatga to'lov bandi (1.7 so'zma-so'z, 07.10 aniqlashtirilgan — tayanch 9.29; `MENTOR_TOLOV_BANDI`):** «Qaysi ma'lumot?» ga: Karta ma'lumotini Maydon Jamoa ko'rmaydi va saqlamaydi: haqiqiy to'lovda uni to'lov xizmati qabul qiladi, bu mashqda karta umuman so'ralmaydi. Biz saqlaymiz: to'lov raqami, kim to'lagani (hisob), holati (to'landi yoki rad etildi), summa, sana va Pro muddati. «Nima uchun?» ga: To'lov raqami, hisob, holat va summa — to'lovni bir marta hisoblash va «to'lovim qayerda?» savoliga javob berish uchun. Pro muddati — Pro'ni yoqish va to'xtatish uchun.
     Joyi — «Qaysi ma'lumot?» va «Nima uchun?» savollari (tayanch): «Qaysi ma'lumot?» ga — birinchi gap va «Biz saqlaymiz: to'lov raqami, summa, sana va Pro muddati.»; «Nima uchun?» ga — «To'lov raqami, summa, sana va Pro muddati — Pro'ni yoqish uchun.» (so'zlar tayanchdan; bo'linishi — TAYANCHGA SAVOL 1).
   - **Mentor siyosatining qolgan matni — o'zgarmaydi** (12-Modul 7-dars A2 va 9-dars qo'shimchasi — 9.41 a): «Kim ko'radi?», «Qancha saqlanadi?» va «Qaysi ma'lumot?», «Nima uchun?» dagi eski gaplar (7-ekran kutilgan natijasida to'liq).
7. **Raqamlar (faqat tayanch 1.4; «Mentorning taxmini»):** 30 kun — 15 000 so'm. Boshqa son yo'q: tashkilotchilar soni, suhbat va tasdiq sonlari bu darsda aytilmaydi (sinf 12). Testlardagi ikkinchi misolda son yo'q.
8. **Ikkinchi misol faqat testda (P-002), o'smir olamidan:** uy vazifalari ilovasi (3-ekran), kitob almashish ilovasi (arena 9). Metafora yo'q. Keys yo'q. Brend (Click, Payme) bu darsda tilga olinmaydi — siyosatda umumiy so'z «to'lov xizmati».
9. **Pul va halollik chegarasi (TAQIQLAR 1, 3; Qaror-0 6, 13):**
   - oferta — **shablon**, sahifa tepasida «Mashq hujjati — real to'lov qabul qilinmaydi», oxirida «Bu hujjat yuridik maslahat emas.»; o'quvchi ofertasida ham shu ikki qator va 1, 5, 6-bandlarning kvadrat qavsli matni (o'quvchi o'zgartirmaydi);
   - sotuvchi qatoriga o'quvchining ismi yoki Mentor nomi yozilmaydi; **aloqa** bandiga telefon, Telegram nomi, pochta yozilmaydi (shaxsiy ma'lumot — TAQIQLAR 3); 5-ekranda bunday yozuv bloklanadi;
   - karta ma'lumoti — siyosatda «mahsulot saqlamaydi» deb aytiladi; karta raqami, amal qilish muddati, kod — hech qayerda namuna sifatida ham yo'q; oferta sahifasida forma va to'lov tugmasi yo'q;
   - «yurist tekshirgan», «qonunga to'liq mos» — yo'q; qonun — faqat ta'rif va manba (kartochka 1, O'qituvchi eslatmasi); o'smirga yuridik maslahat berilmaydi;
   - lending, oferta va to'lov taklifi ekranida faqat hozir ishlaydigan narsa — «tez orada», «yaqinda» yo'q (sinf 16; 5-ekran tekshiruvi);
   - tekshiruv akkaunti (7-ekran, Pro'siz hisob kerak bo'lsa) — ism «tekshiruv», familiyasiz; tekshiruvdan keyin o'chiriladi (12-Modul 9.35 a, 9.37 g).
10. **Kim nima yozadi (talab zinapoyasi):** 5-ekran — o'quvchi uch bandni o'zi yozadi (yoki «Hali bilmayman» — «[savol]») · **Amaliyot 1** — tayyor talab + ikki joy oldindan to'ldirilgan (`{nom}`, `{oferta bandlari}` — 5-ekrandan); agent sahifani yasaydi, 2–4-bandlarni kod bilan solishtiradi, bilinmaganini «[savol]» qoldiradi; o'quvchi tekshiradi va «[savol]» ni yozadi ·
    **Amaliyot 2** — tayyor talab + bitta qatorni o'quvchi yozadi (`{to'lov bandi}`) + lending manzili; agent havolalarni qo'yadi va bandni kod bilan solishtiradi. Mahsulot qarori (nima beriladi, muddat tugasa nima bo'ladi, to'lovda nima saqlanadi) — o'quvchida (sinf 13).
11. **Vaqt (≈ 90 daqiqa; ⛔ reja — «qur» pilotida taymer bilan, o'lchanmaguncha da'vo emas):** kirish va reja (0–1) ≈ 5 · savollar va 1-savol (2–3) ≈ 12 · Mentor ofertasi (4) ≈ 9 · o'z bandlari (5) ≈ 8 · Amaliyot 1 ≈ 22 · Amaliyot 2 ≈ 22 (push va Netlify kutishi bilan) · yakuniy savol, podium, kartochkalar, arena (8–11) ≈ 10 · zaxira ≈ 2.
    **Ulgurmagan o'quvchi yo'li:** Amaliyot 1 — «Davom etish» 3-qadamdan keyin ochiladi (SABOQ E 55), 4-qadam — uyga vazifa ① · Amaliyot 2 — «Davom etish» 2-qadamdan keyin; push va telefonda tekshirish — uyga vazifa ① · blok bajarilgani — faqat 4-qadam «Bajardim»idan (12-Modul 9.36 h) ·
    yakun sarlavhasi holatga qarab (11-ekran). Tashqi kutish — Netlify yangilanishi (bir necha daqiqa cho'zilishi mumkin) — dars oqimini to'xtatmaydi: tekshiruv keyinroq yoki uyda.
12. **Saqlash kalitlari (tayanch 8; 2–12-darslar sxemasi aniqlashtirilmoqda — TAYANCHGA SAVOL 4, 5):**
    - **o'qiydi:** `pm-m11d4-narx` (`narx`, `davrKun`, `ekran.sarlavha`, `ekran.matn`, `ekran.tugma`) — 5-ekran va Amaliyot 2 `{to'lov tugmasi}` · `pm-m11d2-model` (`nima`) — 5-ekran kulrang qatori · `pm-m9d8-platforma` (`trek`) — Amaliyot 2 «Ochish» gapi ·
      `pm-m10d1-lending` (`manzil`) — Amaliyot 2 `{lending manzili}` (TAYANCHGA SAVOL 5). Yo'q bo'lsa: narx va manzilni o'quvchi o'zi yozadi; `nima` qatori va trek gapi — ikkala trek qatori ko'rinadi.
    - **yozadi:** `pm-m11d7-hujjat` = `{ bandlar: [{ id, matn, savol }] (6), siyosatBand, havolalar: { lending, ekran }, chiqdi, savedAt }` (tayanch 8). Maydonlar shartnomasi:
      `bandlar` — olti band, tartib o'zgarmaydi; `id` barqaror: `'kim'` · `'nima'` · `'narx'` · `'tugasa'` · `'qaytarish'` · `'aloqa'` · `matn` — band matni (`kim`, `qaytarish`, `aloqa` — shablondagi kvadrat qavsli matn, o'quvchi o'zgartirmaydi; qolgan uchtasi — o'quvchi yozgani) ·
      `savol: bool` — matnda «[savol]» qolganmi (5-ekranda «Hali bilmayman» — `true`; Amaliyot 1 4-qadamda o'quvchi ✎ bilan yozgach — `false`) — 5-ekran yozadi, Amaliyot 1 yangilaydi ·
      `siyosatBand: string | null` — o'quvchi yozgan to'lov bandi (Amaliyot 2 2-qadam «Nusxalash» bosilganda; yozilmagan — `null`) ·
      `havolalar.lending`, `havolalar.ekran`: `bool | null` — Amaliyot 2 4-qadam: «Ochildi» → `true`, «Ochilmadi» → `false`, bosilmagan → `null` (tayanchda `bool` — uch holat TAYANCHGA SAVOL 4) ·
      `chiqdi: bool | null` — oferta internetdagi lending manzilida ochildi (Amaliyot 2 4-qadam (1)); qiymatlari o'sha uch holat · `savedAt` — har saqlashda.
      Kalitga ism, telefon, Telegram nomi, karta ma'lumoti yozilmaydi. Sahifa nomi `{nom}` — dars progressida (`ccProgress`), kalitda emas (TAYANCHGA SAVOL 4). Kod qoralamasi kaliti yo'q (kod oynasi yo'q). Dars boshqa darsning kalitiga yozmaydi.
13. **Toza yuza (D4):** tugma, variant, karta, yorliqda emoji yo'q; ✓ ✕ › ✎ — belgilar. O'yin qatlami (arena, nishon medali, podium) — mustasno. Kafolat so'zlari yo'q; belgi-formula (→, ×, =) o'quvchi izohida yo'q. «Maydon Jamoa» — telefon maketida va brauzer manzilida, o'z yashil rangida (11-Modul 9.62), logotipsiz.
14. **Trek (tayanch 4):** PM qismi (0–5) — ikkala trekka bir xil. Amaliyot 1 — ikkala trekda bir xil (o'zgarish faqat `lending/` da). Amaliyot 2 — farq «Ochish» qadamidagi bitta gapda va `{to'lov taklifi ekrani}` qavsida: mobil — ilovadagi ekran (`mobil/`), tekshiruv Expo Go'da; web — saytdagi ekran. O'quvchi matnida «mahsulotingiz» (sinf 11).

## Darsning ipi va bitta vizual

- **Modul ipi (tayanch 1.4, 1.5, 1.7):** 4-darsda narx chiqarildi va to'lov taklifi ekrani qo'yildi, 5-darsda to'lov yo'li buzib tekshirildi. Ekranda esa faqat narx va qulaylik bor — to'lovchi yana nimaga rozi bo'lishi hech qayerda yozilmagan. Bugun — shartlar sahifasi va siyosatdagi to'lov bandi.
- **Dars ipi:** 0 — telefonda Mentorning to'lov taklifi ekrani: to'lashdan oldin nimani bilmoqchisiz? (ballsiz) → 2 — tashkilotchining olti savoli: javobi ekranda bormi — ikkitasi bor, to'rttasi yo'q → «oferta» → 3 — test: ofertaga nima yoziladi (uy vazifalari ilovasi) →
  4 — Mentor ofertasining olti bandi: bugun yoziladi yoki real ishga tushirishda («Mashq hujjati», «yuridik maslahat emas») → 5 — o'z ofertangizning uch bandi → Amaliyot 1 — `oferta.html`, bandlar kod bilan, «[savol]» → Amaliyot 2 — siyosatga to'lov bandi, ikki havola, push, telefon →
  8 — yakuniy: «[savol]» qolsa nima qilasiz → podium → kartochkalar → yakun (holatga qarab).
- **Bitta vizual — «To'lov taklifi ekrani va shartlar sahifasi» (`ShartlarSahna`, dars bo'yi; 163/180; bitta manba `MENTOR_EKRAN` + `MENTOR_OFERTA` + `MENTOR_TOLOV_BANDI` + o'quvchi ma'lumoti `pm-m11d4-narx`, `pm-m11d7-hujjat`):**
  - **telefon** (chapda, ≈170×272): to'lov taklifi ekrani — tepada «Maydon Jamoa» o'z yashil rangida; pastda doim kulrang «Test rejim: pul yechilmaydi» (TAQIQLAR 1). 7-darsdan «To'lovga o'tish» ostida ikki kichik havola. Karta maydoni hech bir holatda chizilmaydi.
  - **brauzer** (o'ngda): manzil satri `maydon-jamoa-….netlify.app/oferta.html` (7-ekranda — `/maxfiylik.html`); sahifa: tepada kulrang-accent qator «Mashq hujjati — real to'lov qabul qilinmaydi», sarlavha «Pro shartlari», olti band (sarlavha + matn), oxirida «Bu hujjat yuridik maslahat emas.».
    Kvadrat qavsli matn — kulrang kursiv; «[savol]» — accent uzuq ramkada (to'ldiriladigan joy — U-041).
  - **chiziq** — telefondagi havoladan brauzer sahifasiga (bosilganda chiziq bo'ylab nuqta yuguradi, sahifa ochiladi).
  - **tashkilotchi** (0, 2-ekranlar; real ko'rinishda — SABOQ 36) — telefon yonida, pufagida savol.
  - Ishlatiladi: 0 (telefon + tashkilotchi) · 1 (tayyor holat, bir marta o'zi yuradi) · 2 (telefon + savol kartasi + «Shartlar» varag'i) · 4 (brauzerdagi sahifa bandlar bilan to'lib boradi) · 5 (o'quvchi telefoni + «Ofertam» varag'i) · 6, 7 (o'ng — kutilgan natija) · 3, 8 (javobdan keyin kichik ko'rinish).
  - `prefers-reduced-motion` da uchish va yugurish yo'q — yakuniy holat birdan. 393 kenglikda telefon brauzer ustida, o'lchami barqaror; hech narsa kesilmaydi (E 41). Vizual ⛶ ichida (q17, E 48).
- **Keyingi bosiladigan joy (E 40, qat'iy):** har bosiladigan variant va tugmaning o'z yengil accent chegarasi, yengil to'lqin navbatma-navbat 2 marta, kattalashishsiz; bitta navbatdagi tugma — halqa, to'lqin 3 marta, `scale` yo'q. `prefers-reduced-motion` da to'lqin yo'q, chegara qoladi.
- **Jonli ekran (SABOQ 19):** kirishda elementlar navbat bilan (60–120 ms) · bosish → karta varaqqa yoki telefonga uchadi, band matni sahifadagi joyiga tushadi · yangi qator ~1 s yashil yonadi · hisoblagich sanab o'sadi. Bezak-harakat yo'q.

---

## 0 · Kirish  ← QKirish (sof so'rovnoma, J-026)
- Eyebrow: Kirish
- Sarlavha: **To'lashdan oldin nimani bilishni xohlaysiz?** (43)
- Mentor: Tasavvur qiling: siz mahallada o'yin yig'adigan tashkilotchisiz va «Maydon Jamoa» sizga shu taklifni ko'rsatdi. Bittasini tanlang.
- Maket (chap; `ShartlarSahna` telefon holati): Mentorning to'lov taklifi ekrani (A-6 so'zma-so'z) — «Doimiy o'yin — Pro'da» · «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» · «30 kun — 15 000 so'm» (yonida kulrang «Mentorning taxmini») · tugma «To'lovga o'tish» · pastda kulrang «Test rejim: pul yechilmaydi».
  Ramka ustida yorliq «Mentor misoli · Maydon Jamoa». Telefon yonida — tashkilotchi (real ko'rinishda, qo'lida telefon), pufagida «…».
- Variantlar (radio, o'ng; bir uzunlikda — P-016; tashkilotchining o'z savoli, T-008):
  - «30 kun tugasa, nima bo'ladi?» (30)
  - «Keyingi oy pul o'zi yechiladimi?» (34)
  - «Bekor qilsam, pulim qaytadimi?» (32)
- Javob (uchalasida bir xil, maqtovsiz — J-026, KORPUS §119): Uchalasi ham — to'lashdan oldin bilish kerak bo'lgan narsa. Odam ularning javobini qayerdan topadi? (99)
- **Harakat → Vizual o'zgarish:** variantni tanlash → tanlangan variant accent chegara bilan qotadi; tashkilotchi pufagida «…» o'rniga tanlangan savol paydo bo'ladi, ostida kichik «?» qoladi — javob qayerda ekani ochilmaydi (P-036).
  Jonli darsda — sinf ovozlari chizig'i (har variant va ovozlar soni; ism yo'q).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Bittasini tanlang → Davom etish
- Keyingi bosiladigan joy: uch variant (har birining yengil chegarasi, navbatma-navbat to'lqin) → «Davom etish».
- O'qituvchi eslatmasi: Sinfdan so'rang: «Telefoningizda biror narsa uchun to'lashdan oldin nimaga qaraysiz?» Javoblarni taxtaga yozing — ular keyin ofertaning bandlariga o'xshab chiqadi. Javoblarni hozir baholamang.
✎ Hook — o'quvchi o'zi ko'rgan narsa (4-darsdagi to'lov taklifi ekrani) va to'lovchining o'z savoli (P-016). Uch variant — Mentor ofertasining 3, 4, 5-bandlari savol shaklida; payoff hech birini rad etmaydi (KORPUS §119). «Ekranda javob yo'q» — 2-ekran kashfiyoti, bu yerda aytilmaydi.

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun to'lov shartlarini ochiq yozishni o'rganasiz.** (51)
- Mentor: Narx va to'lov yo'li tayyor — endi to'lovchi nimaga rozi bo'lishini yozamiz. Mentor misoli — namuna, ikkala amaliyot — o'z repo'ngizda.
- Chap — kulrang yorliq «oferta va maxfiylik siyosati saytda» (App.jsx osti so'zma-so'z, P-015) + ostida kulrang qator: Darsda — mashq hujjati: real to'lov qabul qilinmaydi. (53)
  Vizual (`ShartlarSahna`, tayyor holat, bir marta o'zi yuradi — DE-200): telefonda to'lov taklifi ekrani, «To'lovga o'tish» ostida ikki havola «Pro shartlari» · «Maxfiylik siyosati» → «Pro shartlari» bosiladi → chiziq bo'ylab nuqta → brauzer `maydon-jamoa-….netlify.app/oferta.html`:
  tepada «Mashq hujjati — real to'lov qabul qilinmaydi», sarlavha «Pro shartlari», olti band sarlavhasi (Kim taklif qiladi · Nima beriladi · Narx va muddat · Pro tugasa · Bekor qilish va pulni qaytarish · Aloqa) — matnsiz: band matni va qaysi biri bugun yozilishi — 4-ekran kashfiyoti (P-015); sarlavhalar — haqiqiy mazmun (SABOQ 33).
- O'ng (01 · matn · teg; tex-karta, bosilmaydi — P-015; teglar kulrang):
  - 01 · To'lovchi nimaga rozi bo'lishini bilasiz · `oferta`
  - 02 · Qaysi shart bugun yozilishini ajratasiz · `real ishga tushirish`
  - 03 · O'z shartlaringizni sahifaga yozasiz · `oferta.html`
  - 04 · Siyosatga to'lov haqida gap qo'shib, havola qo'yasiz · `maxfiylik siyosati`
- Pastki qator (mono, kichik): repo — o'z repo'ngiz · Mentor misoli `maydon-jamoa` · namuna `m13-dars-07-done`
- Harakat yo'q (reja ekrani) — vizual o'zi yuradi. Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi: Menyu ostidagi «saytda» — dars natijasi: oferta va siyosat lending sahifalari bo'lib internetda turadi. Darsda hech kim pul olmaydi va hech narsa sotmaydi; oferta — mashq hujjati. Sotuvchi, pulni qaytarish va aloqa — real ishga tushirishda (bu kursda emas).
- Izoh (MD): sarlavhada yangi atama yo'q (T-011); «oferta», «real ishga tushirish» — faqat kulrang teglarda (P-015). Chap yorliq App.jsx ostini so'zma-so'z beradi; ostidagi kulrang qator uni darsdagi haqiqatga chegaralaydi (mashq). 2-qadam «ajratasiz» — 4-ekran mexanikasi, natijasi ochilmaydi.

## 2 · To'lovchi nimaga rozi bo'ladi  ← QTushuncha (markaziy; ketma-ket 6 karta — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · shartlar
- Sarlavha: **Tashkilotchi to'lasa, nimaga rozi bo'ladi?** (42)
- Mentor: Tashkilotchining har savoli uchun tanlang: javobi to'lov taklifi ekranida bormi?
  (Birinchi harakat — bashorat; uning yo'rig'i `QBashorat` yorlig'ida, Mentor takrorlamaydi — T-047.)
- Bashorat (ballsiz, 181; `QBashorat`, yorliq «Avval o'zingiz belgilab ko'ring»; S-015 zinapoya): **Ekran olti savoldan nechtasiga javob beradi?** · 1 · 2 · 4 — tanlangach yopilmaydi: ixcham qator «Taxminingiz: N» natijagacha turadi; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: telefon · savol kartasi va tugmalar · varaq): **chapda** — telefon (A-6 to'lov taklifi ekrani) va yonida tashkilotchi · **o'rtada** — joriy savol kartasi (tashkilotchi pufagi shaklida, «Savol n / 6») va ostida ikki tugma «Ekranda bor» · «Ekranda yo'q» ·
  **o'ngda** — varaq «Shartlar» (bo'sh; ustida hisoblagich «ekranda yo'q · n»).
- Kartalar (navbat bilan; tashkilotchining gapi — T-008):
  1. «Pulimga nima olaman?» ✔ Ekranda bor → telefonda «Har hafta shu kun va soatda o'yin o'zi e'lon qilinadi.» qatori accent bilan yonadi
  2. «Qancha va necha kunga?» ✔ Ekranda bor → «30 kun — 15 000 so'm» yonadi
  3. «Keyingi oy pul o'zi yechiladimi?» ✔ Ekranda yo'q
  4. «30 kun tugasa, nima bo'ladi?» ✔ Ekranda yo'q
  5. «Bekor qilsam, pulim qaytadimi?» ✔ Ekranda yo'q
  6. «Kim bilan kelishyapman?» ✔ Ekranda yo'q
- **Harakat → Vizual o'zgarish:** «Ekranda bor» to'g'ri → telefondagi mos qator ~1 s accent bilan yonadi, karta kichrayib telefon yoniga ✓ bilan tushadi · «Ekranda yo'q» to'g'ri → karta «Shartlar» varag'iga uchib qator bo'ladi, hisoblagich o'sadi · keyingi savol kartasi kiradi.
  Xato → tugma silkinadi, karta bir lahza `err` fon, bitta `QXato` (≤60; javobni aytmaydi):
  - 1, 2-savol, «Ekranda yo'q»: Telefondagi har qatorni yana bir o'qing. (40)
  - 3-savol, «Ekranda bor»: «Test rejim» — bugungi mashq haqida, keyingi oy haqida emas. (60)
  - 4, 5, 6-savol, «Ekranda bor»: Telefonda shu savolga javob beradigan qatorni toping. (53)
  6/6 dan keyin: tugmalar va savol kartasi yopiladi; telefondagi ikki yonib turgan qator ham varaqqa ko'chadi (yonida kulrang «ekranda ham bor») — varaq «Shartlar» to'liq: olti savol.
- Natija (bitta blok — E 42; `tugadi`: harakat paneli yopiladi, telefon va varaq butun enga, ⛶ ichida — q17/q18): yashil xulosa qutisi — birinchi kichik qator taxmin: «Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 2».
- Xulosa: Odam to'lasa — shartlarga rozi bo'ladi. Bu misolda ekran ikki savolga javob beradi, to'rttasiga — yo'q. (103)
- `QIzoh` (qutining oxirgi kichik qatori — E 42): Hamma uchun ochiq taklif — nima beriladi, qancha turadi, qanday shart bilan — oferta deyiladi. (94) — atama «oferta» shu yerda tug'iladi (T-011)
- Tugma (pastki): Avval belgilang → Savollarni ajrating (N/6) → Davom etish
- Ipucha (40 s harakatsizlikda; javobni aytmaydi): Telefondagi qatorlardan biri shu savolga javob beradimi? (56)
- Keyingi bosiladigan joy: bashorat variantlari → ikki tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Ask Before Pay! (olti savol birinchi urinishda).
- O'qituvchi eslatmasi: To'lov taklifi ekrani qisqa: asosiy qulaylik va narx. Qolgan shartlar alohida sahifada yoziladi — to'lovchi uni to'lashdan oldin ochishi kerak. 3-savolda «Test rejim» qatori bugungi mashq haqida: bu kursda pul umuman yechilmaydi; keyingi oy uchun pul yechilish-yechilmasligi — ofertaning shartlaridan biri.
  Qonunda bunday taklif ommaviy oferta deb ataladi (369-modda); dars yuridik maslahat bermaydi.
✎ Savollar tartibi — to'lovchining tabiiy tartibi; 3, 4, 5-savollar 0-ekrandagi uch variant bilan bir (hook savoliga javob — T-064). Javob kaliti `[bor, bor, yo'q, yo'q, yo'q, yo'q]` — Mentor ekrani matnidan (A-6). Aloqa bandi bu yerda savol bo'lib chiqmaydi — 4-ekranda tug'iladi.

## 3 · 1-savol  ← QTest (✔ B, `correctIdx 1`; ikkinchi misol — uy vazifalari ilovasi, P-002)
- Eyebrow: Tekshiruv · oferta (savol ustida yorliq yo'q — SABOQ 6)
- Savol: **Uy vazifalari ilovangizda pullik qism bor. Ofertaga nimani yozasiz?** (67)
  - A — Yaqinda qo'shiladigan yangi qulayliklarni (41)
  - ✔ B — Pullik muddat tugasa, nima bo'lishini (37)
  - C — Ilovani hozirgacha necha kishi yuklaganini (42)
  - D — Ilova qaysi dasturlash tilida yozilganini (41)
- Kalit: **B** (index 1). To'rttalasi bir shaklda (ot-birikma, «-ni» bilan tugaydi); tire va qavs hech birida yo'q; uzunlik — «O'lchov»; to'g'ri javob yolg'iz eng uzun emas.
  Distraktorlar uch xil turkum (12-Modul 9.44 f): A — kelajak va'dasi (hozir berilmaydigan narsa) · C — ishontirish uchun son (shart emas) · D — texnik tafsilot (to'lovchiga shart emas).
- To'g'ri izohi: To'lagan odam bu shartga ham rozi bo'ladi. (42)
- Xato izohlari (≤60):
  - A: Odam to'laganda buni bugun oladimi? (35)
  - C: Bu son to'lovchiga qanday shartni aytadi? (41)
  - D: Bu to'lovchiga nima berilishini aytadimi? (41)
  - (umumiy) To'lovchi to'lashdan oldin qaysi savolga javob kutadi? (54)
- Javob topilgach (`QuestionScreen` `vizual`, kichik, savol ostida; jonli darsda — natija ochilgandan keyin; SABOQ 4): uy vazifalari ilovasining «Shartlar» varag'i — «muddat tugasa» qatori accent bilan yonadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Nishon: Open Offer! — birinchi urinishda to'g'ri.
- Izoh (MD): distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004): A — 2-ekran ta'rifi «nima beriladi» (bugun beriladigani); C, D — to'lovchi rozi bo'ladigan shart emas. Savol ekrandan ko'chirilmaydi (§106): Mentor misoli emas, boshqa mahsulot va savol «nimani yozasiz».
  «Yaqinda» — distraktor ichidagi so'z; 4-ekran va 5-ekran tekshiruvi shuni rad etadi.

## 4 · Mentor ofertasi  ← QTushuncha (ketma-ket 6 karta — SABOQ 9/13, E 53)
- Eyebrow: Tushuncha · oferta bandlari
- Sarlavha: **Mentor ofertaga qaysi shartlarni bugun yoza oladi?** (50)
- Mentor: Har band uchun tanlang: u bugun yoziladimi yoki real ishga tushirishda?
- Bashorat (ballsiz; S-015 — o'sish tartibida): **Olti banddan nechtasini Mentor bugun yoza oladi?** · 2 · 3 · 4 — tanlangach ixcham qator natijagacha turadi; tugmalar shundan keyin yoqiladi.
- Vizual (≤ 3 blok: band kartasi va tugmalar · brauzer · kulrang qator): **chapda** — joriy band kartasi («Band n / 6»: band nomi + ostida kulrang to'lovchi savoli) va ikki tugma «Bugun yoziladi» · «Real ishga tushirishda» ·
  **o'ngda** — brauzer `maydon-jamoa-….netlify.app/oferta.html`: sarlavha «Pro shartlari», olti band sarlavhasi, matn joylari uzuq chiziqli bo'sh (to'ldiriladigan joy — U-041) ·
  **tugmalar ostida — doimiy kulrang qator** (darsda bir marta — A-4): Real ishga tushirish — ota-onaning yozma roziligi va yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas. (128)
- Bandlar (navbat bilan; matn — tayanch 1.7 so'zma-so'z, A-6 jadvali):
  1. **Kim taklif qiladi** · «Kim bilan kelishyapman?» ✔ Real ishga tushirishda → kulrang «[real ishga tushirishda — yuridik shaxs yoki YaTT]»
  2. **Nima beriladi** · «Pulimga nima olaman?» ✔ Bugun yoziladi → matni (A-6): «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi
  3. **Narx va muddat** · «Qancha va necha kunga?» ✔ Bugun yoziladi → «30 kun, 15 000 so'm; muddat tugagach Pro o'zi to'xtaydi, pul avtomatik yechilmaydi» (narx yonida kulrang «Mentorning taxmini»)
  4. **Pro tugasa** · «30 kun tugasa, nima bo'ladi?» ✔ Bugun yoziladi → «e'lon qilingan o'yinlar qoladi, yangi o'yin o'zi e'lon qilinmaydi»
  5. **Bekor qilish va pulni qaytarish** · «Bekor qilsam, pulim qaytadimi?» ✔ Real ishga tushirishda → kulrang «[real ishga tushirishda yoziladi; mashqda pul yechilmaydi]»
  6. **Aloqa** · «Savol bo'lsa, kimga yozaman?» ✔ Real ishga tushirishda → kulrang «[real ishga tushirishda]»
- **Harakat → Vizual o'zgarish:** tugmani bosish → to'g'ri bo'lsa band matni kartadan brauzerdagi o'z joyiga uchadi (~1 s yashil; «Bugun» — oddiy matn, «Real ishga tushirishda» — kulrang kvadrat qavsli matn); keyingi band kartasi kiradi.
  Xato → tugma silkinadi, karta bir lahza `err`, bitta `QXato` (≤60; javobni aytmaydi):
  - 1-band, «Bugun»: Sotuvchi kim bo'ladi? Kulrang qatorni o'qing. (45)
  - 2-band, «Real»: «Doimiy o'yin» ilovada bugun ishlayaptimi? (42)
  - 3-band, «Real»: Narx va muddat bugun ilovada bormi? (35)
  - 4-band, «Real»: Pro tugaganda nima bo'lishi ilovada bugun bormi? (48)
  - 5-band, «Bugun»: Mashqda pul yechiladimi? Qaytaradigan pul bormi? (48)
  - 6-band, «Bugun»: Aloqaga kimning telefoni yoziladi — sotuvchi bormi? (51)
  6/6 dan keyin: brauzerda tepada «Mashq hujjati — real to'lov qabul qilinmaydi», oxirida «Bu hujjat yuridik maslahat emas.» bir lahza ajralib kiradi; tugmalar yopiladi, sahifa butun enga (⛶).
- Natija (bitta blok — E 42): yashil xulosa qutisi — birinchi kichik qator taxmin («Taxminingiz to'g'ri chiqdi ✓» yoki «Taxminingiz ✕ — aslida: 3»).
- Xulosa: Bu mashqda ofertaga bugun ishlaydigan narsa yoziladi; qolgani — real ishga tushirishda. (87)
- `QIzoh` (qutining oxirgi kichik qatori): «Mashq hujjati» va «yuridik maslahat emas» qatorlari sahifa mashq ekanini ochiq aytadi. (87)
- Tugma (pastki): Avval belgilang → Bandlarni ajrating (N/6) → Davom etish
- Ipucha (40 s): Bu bandni Mentor bugun rost yoza oladimi? (41)
- Keyingi bosiladigan joy: bashorat → ikki tugma (navbatma-navbat to'lqin) → «Davom etish».
- Nishon: Clause Sorter! (olti band birinchi urinishda).
- O'qituvchi eslatmasi: Sotuvchi qatori bo'sh: o'smir real to'lovni o'z nomidan qabul qilmaydi — qonunda (27-modda) 14–18 yoshli bitimni ota-onaning yozma roziligi bilan tuzadi; real sotuvchi — yuridik shaxs (ro'yxatdan o'tgan tashkilot) yoki YaTT. Bu kursda real ishga tushirish yo'q.
  Aloqa — sotuvchining rasmiy aloqasi: o'quvchining telefoni va Telegram nomi ochiq sahifaga yozilmaydi. 3-banddagi «pul avtomatik yechilmaydi» — Mentor ilovasida Pro muddati tugagach o'zi to'xtaydi (5-dars), keyingi 30 kun uchun pul so'ralmaydi.
  Mentor sahifasi — kurs shabloni: o'quvchi mahsulotida band nomi va matni boshqacha bo'ladi.
✎ Bashorat 2 · 3 · 4 — zinapoya (S-015). Bandlar tartibi — tayanch 1.7 tartibi; karta ostidagi kulrang savol — 2-ekrandagi savol (aloqa — yangi). Xulosadagi «qolgani» — sotuvchi, pulni qaytarish va aloqa bandlari (sahifada kulrang).

## 5 · Ofertangiz  ← QMustaqil (USTAXONA — ketma-ket karta, 3 qism; SABOQ 9, 13, 29, E 43, E 53)
- Eyebrow: Mustaqil ish · oferta
- Sarlavha: **Mahsulotingiz ofertasini yozing.** (32)
- Mentor: Bugun ishlaydigan bandlarni o'zingiz yozasiz, qolgan uchtasi Mentor ofertasidagidek qoladi — birinchi kartadan boshlang.
- **Chapda — telefon** (`ShartlarSahna` telefon holati: o'quvchining to'lov taklifi ekrani — `pm-m11d4-narx.ekran`; ramka ustida «4-darsdagi ekraningiz»). Kalit yo'q bo'lsa — telefon ko'rinmaydi, karta va varaq bitta ustunda (bo'sh ustun yo'q — SABOQ 20).
  **O'ngda — bitta katta karta (joriy qism)**, ostida ixcham varaq «{nom} shartlari» (`{nom}` bo'sh bo'lsa — «Ofertam»): olti band; 1, 5, 6 — kulrang tayyor matn (A-6), 2, 3, 4 — uzuq ramkali joy (U-041). Maydonlarda yorliq input ichida — raqam belgisi va qisqa savol (E 43).
- Qismlar (ketma-ket; «Saqlash» o'ngda — 187; har qismda ikkinchi tugma «Hali bilmayman» — band matni «[savol]», `savol: true`):
  1. **Nima beriladi** — nom (≤ 20; placeholder «Pullik qismingiz nomi») · matn (≤ 120; placeholder «Odam to'lasa, nima oladi?»).
     Kulrang qator (`pm-m11d2-model.nima` bo'lsa): 2-darsda yozganingiz: «{nima}». Kalit yo'q — qator ko'rinmaydi.
  2. **Narx va muddat** — narx (son, so'm; `pm-m11d4-narx.narx` dan oldindan, tahrirlanadi; yorliq «4-darsdagi narxingiz»; kalit yo'q — bo'sh, placeholder «Narx, so'm») · davr (kun; `davrKun` dan).
     Band matni o'zi yig'iladi: «{davr} kun, {narx} so'm; muddat tugagach {nom} o'zi to'xtaydi, pul avtomatik yechilmaydi» — oxirgi qism kulrang (shablondan, Mentor ofertasidagidek).
     Ostida kulrang qator: Mahsulotingizda shunday bo'lmasa — Amaliyot 1 da agent «[savol]» qoldiradi. (75)
  3. **{nom} tugasa** — matn (≤ 120; placeholder «Muddat tugasa, nima qoladi va nima to'xtaydi?»).
- Tekshiruv (`QXato`, ≤60; maydon ostida; yumshoqlari ikkinchi «Saqlash» bilan o'tadi):
  - maydon bo'sh (bloklaydi): Bu joy bo'sh — yozing yoki «Hali bilmayman»ni bosing. (53)
  - «+998», «@», «t.me/» yoki 7+ raqam ketma-ket (bloklaydi): Ofertaga telefon va akkaunt nomi yozilmaydi. (44)
  - «karta raqami», «CVV», 12+ raqam ketma-ket (bloklaydi): Karta ma'lumoti hech qayerga yozilmaydi. (40)
  - narx bo'sh yoki 0 (bloklaydi): Narxni yozing — 4-darsdagi taxminingiz. (39)
  - «tez orada», «yaqinda», «keyinroq», «qo'shamiz», «qo'shiladi» (yumshoq): Va'da emas — bugun ishlaydigan narsani yozing. (46)
  - «kafolat», «100%», «har doim», «hech qachon» (yumshoq): Kafolat so'zi o'rniga nima bo'lishini aniq yozing. (50)
  - Yorliq (yumshoq xatodan keyin): Shunday qoldirsangiz — yana «Saqlash»ni bosing. (47)
- Yordam (bosilsa ochiladi; Mentor misolidan, A-6): Mentor misolida: Pro · «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi · 30 kun, 15 000 so'm · e'lon qilingan o'yinlar qoladi, yangi o'yin o'zi e'lon qilinmaydi.
  Bandda faqat mahsulotingiz bugun qiladigan narsani yozing. 4-darsda narx yozmagan bo'lsangiz — bugungi taxminingizni yozing, u ham taxmin. Mahsulotingizda to'lovchi foydalanuvchi bo'lmasa — bandlarni 4-darsdagi to'lov taklifi ekraningiz uchun yozing.
- **Harakat → Vizual o'zgarish:** «Saqlash» → qiymat kartadan varaqdagi o'z bandiga uchadi (~1 s yashil), nom varaq sarlavhasiga «{nom} shartlari» bo'lib tushadi; narx qismida telefondagi narx qatori varaqdagi 3-bandga chiziq bilan ulanadi (SABOQ 35). Keyingi qism kiradi.
  «Hali bilmayman» → bandda accent uzuq ramkali «[savol]». 3/3 da karta yopiladi, varaq butun enga — olti band, o'quvchi bandlarida ✎ (bosilsa o'sha qism katta karta bo'lib ochiladi — SABOQ 29). Tekshiruvdan o'tmagan maydon `err` fon, ostida bitta `QXato`.
- Xulosa (holatdan, P-046):
  - «[savol]» yo'q: Bandlaringiz tayyor — Amaliyot 1 da agent ularni kod bilan solishtiradi. (72)
  - «[savol]» bor: Bandlaringiz tayyor — «[savol]» joyini kodga qarab keyin yozasiz. (65)
- Saqlash: `pm-m11d7-hujjat.bandlar` — olti band (A-12 shartnomasi); `kim`, `qaytarish`, `aloqa` — shablon matni, `savol: false`; `{nom}` — `ccProgress`.
- Tugma (pastki): Bandlarni yozing (N/3) → Davom etish (`optionalLive`).
- Keyingi bosiladigan joy: joriy maydon (accent chegara, to'lqin) → «Saqlash» → keyingi qism.
- Artefakt-strip (U-042): shu ekrandan — «Ofertam · 6 band» (ixcham); 6, 7-ekranlarda ko'rinadi; test, arena, podium va yakunda yo'q (E 50).
- Nishon yo'q (saqlash — Mentorga signal). Mentor rejimi: forma o'rniga Mentor ofertasi (A-6). Mentor statistikasi: «Bandlar saqlandi».
- O'qituvchi eslatmasi: 8 daqiqa. Narxni siz qo'ymaysiz — o'quvchining taxmini (TAQIQLAR 1). «Hali bilmayman» — halol tanlov: agent kodni ko'rsatadi, gapni o'quvchi yozadi. Sotuvchi, pulni qaytarish va aloqa bandlarini o'quvchi o'zgartirmaydi — mashqda ular kvadrat qavsda qoladi.
  Eng ko'p xato — 2-bandga «tez orada» qo'shiladigan narsani yozish: «Bugun ilovangizda bu bormi?» deb so'rang.

## 6 · Amaliyot 1 — oferta sahifasi  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈22 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Ofertangiz lendingda alohida sahifa bo'lsin.** (44)
- Mentor: Talab tayyor — bandlaringiz unga o'zi qo'yilgan; «1 · Ochish»dan boshlang.
- Model (tayanch 4, 12-Modul 9.36): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsulotida; Mentor misoli — namuna (o'ngda kutilgan natija, «Yordam»da Mentor misolidagi to'liq talab). Talab zinapoyasi: tayyor talab + ikki joy, ikkalasi 5-ekrandan oldindan. Trek: ikkala trekda bir xil — o'zgarish faqat `lending/` da.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — Antigravity'da o'z repo'ngizni oching. Terminalda `git status`: `.env` fayllari ro'yxatda ko'rinmasin; ko'rinsa, agentga: «`.env` fayllarini `.gitignore` ga qo'sh.»
     Lending — `lending/` papkasi (12-Modulda yozgansiz). Pastdagi talabda bandlaringiz turibdi — o'qib chiqing. Bu blok ikkala trekda bir xil: o'zgarish faqat `lending/` da.
  2. **Prompt** — qavslarni tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `lending/` — yangi sahifa `oferta.html`, lendingdagi boshqa sahifalar uslubida.
     > Nima qilsin: sahifa sarlavhasi — «{nom} shartlari». Sarlavha tepasida — «Mashq hujjati — real to'lov qabul qilinmaydi». Keyin olti band: har biri — sarlavha va matn; pastdagi so'zlarimni o'zgartirma. Sahifa oxirida — «Bu hujjat yuridik maslahat emas.»
     > {oferta bandlari}
     > 2, 3, 4-bandlardagi har gapni loyiha kodi bilan solishtir: kodda bo'lsa — qaysi fayl va qatordan ekanini ayt; kodda ko'rinmasa yoki boshqacha bo'lsa — o'sha gapni «[savol]» bilan almashtir va nima uchunligini ayt, o'zingdan gap qo'shma. 1, 5, 6-bandlardagi kvadrat qavsli matnga tegma.
     > Sahifada forma, to'lov tugmasi va karta haqida maydon bo'lmasin; sahifa hech qanday ma'lumot yig'masin va tashrifni sanamasin.
     > Nima buzilmasin: lendingdagi `index.html` va `maxfiylik.html` o'zgarmasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar (oldindan; o'quvchi tekshiradi):
     - {nom} — 5-ekrandagi nom; bo'sh bo'lsa kulrang «masalan: Pro»
     - {oferta bandlari} — 5-ekrandan olti qator, har biri «N. Band nomi — matn» shaklida: «1. Kim taklif qiladi — [real ishga tushirishda — yuridik shaxs yoki YaTT]» · «2. Nima beriladi — {o'quvchi matni}» · «3. Narx va muddat — {davr} kun, {narx} so'm; muddat tugagach {nom} o'zi to'xtaydi, pul avtomatik yechilmaydi» ·
       «4. {nom} tugasa — {o'quvchi matni}» · «5. Bekor qilish va pulni qaytarish — [real ishga tushirishda yoziladi; mashqda pul yechilmaydi]» · «6. Aloqa — [real ishga tushirishda]». «Hali bilmayman» bosilgan bandda — «[savol]».
       5-ekran saqlanmagan bo'lsa — kulrang namuna (Mentor bandlari) va qator: Avval «Mustaqil ish»dagi bandlarni yozing. (42)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `lending/` — yangi sahifa `oferta.html`, lendingdagi boshqa sahifalar uslubida.
     > Nima qilsin: sahifa sarlavhasi — «Pro shartlari». Sarlavha tepasida — «Mashq hujjati — real to'lov qabul qilinmaydi». Keyin olti band: har biri — sarlavha va matn; pastdagi so'zlarimni o'zgartirma. Sahifa oxirida — «Bu hujjat yuridik maslahat emas.»
     > 1. Kim taklif qiladi — [real ishga tushirishda — yuridik shaxs yoki YaTT]
     > 2. Nima beriladi — «Doimiy o'yin»: har hafta shu kun va soatda o'yin o'zi e'lon qilinadi
     > 3. Narx va muddat — 30 kun, 15 000 so'm; muddat tugagach Pro o'zi to'xtaydi, pul avtomatik yechilmaydi
     > 4. Pro tugasa — e'lon qilingan o'yinlar qoladi, yangi o'yin o'zi e'lon qilinmaydi
     > 5. Bekor qilish va pulni qaytarish — [real ishga tushirishda yoziladi; mashqda pul yechilmaydi]
     > 6. Aloqa — [real ishga tushirishda]
     > 2, 3, 4-bandlardagi har gapni loyiha kodi bilan solishtir: kodda bo'lsa — qaysi fayl va qatordan ekanini ayt; kodda ko'rinmasa yoki boshqacha bo'lsa — o'sha gapni «[savol]» bilan almashtir va nima uchunligini ayt, o'zingdan gap qo'shma. 1, 5, 6-bandlardagi kvadrat qavsli matnga tegma.
     > Sahifada forma, to'lov tugmasi va karta haqida maydon bo'lmasin; sahifa hech qanday ma'lumot yig'masin va tashrifni sanamasin.
     > Nima buzilmasin: lendingdagi `index.html` va `maxfiylik.html` o'zgarmasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — agent tugatgach `lending/oferta.html` ni brauzerda oching (12-Moduldagi lending kabi). Agentning hisobotiga emas, sahifaning o'ziga qarang: bandlar «Mustaqil ish»dagi yozuvingiz bilan bir xilmi.
     Keyin agentdan dalillarni so'rang («Nusxalash» bilan; SABOQ 52):
     > Ofertadagi 2, 3, 4-bandlarning har gapi uchun ro'yxat ber: gap · fayl · qator raqami. «[savol]» qo'ygan joyingda nima uchun qo'yganingni bir gap bilan ayt. Kodni o'zgartirma.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — agent nima desa ham, o'zingiz ko'ring:
     (1) Sahifada: tepada «Mashq hujjati — real to'lov qabul qilinmaydi», oxirida «Bu hujjat yuridik maslahat emas.»; 1, 5, 6-bandlarda kvadrat qavsli matn; forma va to'lov tugmasi yo'q.
     (2) 2, 3, 4-bandlar: agent aytgan fayl va qatorni oching — gap kodda bormi. Mentor misolida: narx — to'lov taklifi ekranida, 30 kun — to'lovdan keyin Pro muddati yoziladigan joyda.
     (3) «[savol]» qolgan bo'lsa — kod nima qilsa, shuni o'zingiz yozing; kodda yo'q narsani yozmang, bu gapni olib tashlang. Agentga: «{band}dagi «[savol]» o'rniga shuni yoz: {matn}. Faqat shu joyni o'zgartir.»
     Yozganingizni o'ngdagi varaqda ham ✎ bilan sahifadagidek qiling — «[savol]» belgisi o'chadi.
     Mos kelmagan gapni agentga yozing: «{band} kodga mos emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok): brauzer `lending/oferta.html` (lokal) — Mentor ofertasi to'liq (A-6 jadvali: tepa qatori, «Pro shartlari», olti band, oxirgi qator) ·
  ostida agent javobi kartasi (chat ko'rinishida, qisqa): «2-band — «Doimiy o'yin» va «Har hafta takrorlansin»: `mobil/`, `backend/` · 3-band — 15 000 so'm: to'lov taklifi ekrani; 30 kun: to'lovdan keyin `pro_gacha`; avtomatik yechadigan kod yo'q · 4-band — Pro tugashi: 5-darsdagi o'zgarish, `backend/` · «[savol]» — yo'q» ·
  kichik izoh: Fayl nomlari sizda boshqacha bo'ladi — gap va u qaysi faylda ekani muhim.
  ⛔ Agent javobi kartasi — namuna: Mentor repo'sida agent haqiqatan nima deyishi «qur» pilotida ko'riladi va karta shu natijaga moslanadi (TAYANCHGA SAVOL 9).
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - «[savol]» qolmagan: Oferta sahifasi tayyor: bandlar kod bilan solishtirildi. (56)
  - «[savol]» qolgan: Oferta sahifasi yozildi — «[savol]» joylari qoldi. (50)
- Qator (`QIzoh`, natija ostida, bitta): Bandni kodda o'zingiz ko'rdingiz — agentning «mos» degani yetmaydi. (67)
- Saqlanadi: `pm-m11d7-hujjat.bandlar[].matn`, `.savol` — 4-qadam (3) da ✎ bilan (A-12).
- Pastki qator (kichik; darsda bir marta — SABOQ 39): Ortda qoldingizmi — Mentor misolini o'z repo'ngizdan tashqarida, yangi papkada oching: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m13-dars-07-done` —
  oxirgi buyruqni faqat shu yangi papkada ishlating: u papkadagi o'zgarishlarni o'chiradi (`lending/oferta.html` — namuna).
- Ulgurmasangiz: 3-qadamdan keyin «Davom etish» ochiladi — 2-amaliyotga o'ting; 4-qadam — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi (12-Modul 9.36 h).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: push bu blokda yo'q — Amaliyot 2 da bitta push (oferta, siyosat va havolalar birga chiqadi). Agentning «mos» degani — da'vo (sinf 5); o'quvchi gapni kodda o'zi ko'radi.
  Kodni o'qish — tekshiruvning bir qismi: sahifadagi gap ishlatib ko'rilmagan bo'lishi mumkin (Shubhali 2).
- O'qituvchi eslatmasi: Agent shablonni va bandlarni yozadi, koddan bilinmaganini «[savol]» qoldiradi — gapni o'quvchi yozadi (12-Moduldagi siyosat naqshi). Kodda yo'q narsa ofertaga yozilmaydi: va'da yo'q.
  Mentor misolidagi 4-band kodni o'qib solishtirilgan (Pro tugashi 5-dars 1-amaliyotida qurilgan — tayanch 9.26), ishlatib ko'rilmagan.

## 7 · Amaliyot 2 — siyosat va havolalar  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈22 daq)
- Eyebrow: Amaliyot 2 · o'z repo'ngiz
- Sarlavha: **To'lovchi shartlarni to'lashdan oldin ko'rsin.** (46)
- Mentor: Siyosatga to'lov bandini o'zingiz yozasiz — mahsulotingiz to'lovda nimani saqlashini siz bilasiz; «1 · Ochish»dan boshlang.
- Talab zinapoyasi: tayyor talab + bitta qatorni o'quvchi yozadi (`{to'lov bandi}`) + lending manzili (nusxa). Trek: farq — «Ochish» dagi bitta gap va `{to'lov taklifi ekrani}` qavsi.
- Qadamlar (o'z repo'ngizda):
  1. **Ochish** — `lending/maxfiylik.html` ni oching: 12-Modulda yozgan to'rt javobingiz. Ular o'zgarmaydi — faqat to'lov bandi qo'shiladi. To'lov uchun nima saqlanishini 3-darsdagi jadvalingizdan eslang (Mentor misolida — `tolovlar`).
     Trekka qarab bir gap: mobil trek — to'lov taklifi ekrani ilovada (`mobil/`), uni Expo Go'da ochasiz · web-trek — to'lov taklifi ekrani saytingizda.
     To'lov taklifi ekrani hali yo'q bo'lsa — promptdagi 3-bandni o'chiring: havolalar faqat lendingda turadi.
  2. **Prompt** — «To'lov bandi»ni o'zingiz yozing, lending manzilini tekshiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `lending/maxfiylik.html` — «Qaysi ma'lumot?» va «Nima uchun?» javoblari; `lending/index.html` — sahifaning pastki qismi; {to'lov taklifi ekrani}.
     > Nima qilsin: 1) Maxfiylik siyosatiga to'lov bandini qo'sh, gaplarini «Qaysi ma'lumot?» va «Nima uchun?» javoblariga mos joyiga qo'y: {to'lov bandi}
     > To'lov uchun qaysi ma'lumot saqlanishini koddan tekshir va qaysi faylga qarab aytganingni ayt; kod boshqacha bo'lsa yoki koddan bilinmasa — o'sha joyni «[savol]» deb qoldir, uni men yozaman. Siyosatning boshqa gaplariga tegma.
     > 2) Lending sahifasining pastida, «Maxfiylik siyosati» yonida — «{nom} shartlari» havolasi, `oferta.html` ga.
     > 3) To'lov taklifi ekranida «{to'lov tugmasi}» ostida ikki kichik havola: «{nom} shartlari» va «Maxfiylik siyosati». Ular brauzerda {lending manzili}/oferta.html va {lending manzili}/maxfiylik.html ni ochsin.
     > Nima buzilmasin: «{to'lov tugmasi}» va mashq to'lov avvalgidek ishlasin; «Test rejim: pul yechilmaydi» qatori joyida qolsin; lending sarlavhasi, foydalar, asosiy tugma va Umami o'zgarmasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar:
     - {to'lov bandi} — **o'quvchi yozadi** (≤ 200; kulrang «masalan: Karta ma'lumotini … ko'rmaydi va saqlamaydi — uni to'lov xizmati qabul qiladi. Biz saqlaymiz: …»)
     - {lending manzili} — `pm-m10d1-lending.manzil` dan oldindan; yo'q bo'lsa — o'quvchi Netlify'dagi manzilni nusxalaydi (kulrang «masalan: maydon-jamoa-….netlify.app»)
     - {nom} — 5-ekrandan · {to'lov tugmasi} — `pm-m11d4-narx.ekran.tugma` dan (yo'q bo'lsa «To'lovga o'tish») · {to'lov taklifi ekrani} — trekdan: mobil — «ilovadagi to'lov taklifi ekrani (`mobil/`)», web — «saytdagi to'lov taklifi ekrani»
     Tekshiruv («Nusxalash» bosilganda; `QXato`, ≤60):
     - {to'lov bandi} bo'sh (bloklaydi): To'lov bandini yozing — to'lovda nima saqlanadi? (48)
     - 12+ raqam ketma-ket, «CVV» (bloklaydi): Karta ma'lumoti hech qayerga yozilmaydi. (40)
     - «karta» so'zi yo'q (yumshoq): Karta ma'lumoti kimda qolishini ham yozing. (43)
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `lending/maxfiylik.html` — «Qaysi ma'lumot?» va «Nima uchun?» javoblari; `lending/index.html` — sahifaning pastki qismi; ilovadagi to'lov taklifi ekrani (`mobil/`).
     > Nima qilsin: 1) Maxfiylik siyosatiga to'lov bandini qo'sh, gaplarini «Qaysi ma'lumot?» va «Nima uchun?» javoblariga mos joyiga qo'y — «Qaysi ma'lumot?» ga: Karta ma'lumotini Maydon Jamoa ko'rmaydi va saqlamaydi: haqiqiy to'lovda uni to'lov xizmati qabul qiladi, bu mashqda karta umuman so'ralmaydi. Biz saqlaymiz: to'lov raqami, kim to'lagani (hisob), holati (to'landi yoki rad etildi), summa, sana va Pro muddati. «Nima uchun?» ga: To'lov raqami, hisob, holat va summa — to'lovni bir marta hisoblash va «to'lovim qayerda?» savoliga javob berish uchun. Pro muddati — Pro'ni yoqish va to'xtatish uchun.
     > To'lov uchun qaysi ma'lumot saqlanishini koddan tekshir va qaysi faylga qarab aytganingni ayt; kod boshqacha bo'lsa yoki koddan bilinmasa — o'sha joyni «[savol]» deb qoldir, uni men yozaman. Siyosatning boshqa gaplariga tegma.
     > 2) Lending sahifasining pastida, «Maxfiylik siyosati» yonida — «Pro shartlari» havolasi, `oferta.html` ga.
     > 3) To'lov taklifi ekranida «To'lovga o'tish» ostida ikki kichik havola: «Pro shartlari» va «Maxfiylik siyosati». Ular brauzerda maydon-jamoa-….netlify.app/oferta.html va maydon-jamoa-….netlify.app/maxfiylik.html ni ochsin.
     > Nima buzilmasin: «To'lovga o'tish» va mashq to'lov avvalgidek ishlasin; «Test rejim: pul yechilmaydi» qatori joyida qolsin; lending sarlavhasi, foydalar, asosiy tugma va Umami o'zgarmasin. `.env` fayllariga tegma. Boshqa joyga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — agent tugatgach: `git status` — o'zgargan fayllar agent aytgani bilan bir xil, `.env` ro'yxatda yo'q; `lending/oferta.html` (Amaliyot 1) ham shu ro'yxatda. Har faylni `git add <fayl>` bilan qo'shing, `git commit -m "oferta va siyosat"`, `git push`.
     Lending push'dan keyin odatda o'zi yangilanadi — bir necha daqiqa cho'zilishi mumkin. Kutayotganda siyosatdagi «[savol]» joylarini o'zingiz yozing: agentga «Siyosatdagi «[savol]» o'rniga shuni yoz: {matn}. Faqat shu joyni o'zgartir.» → yana push.
     Xato chiqsa — xato qatorini agentga yuboring (`.env` qiymatlari, token va kalitlarni emas): «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefoningizda; har biridan keyin «Ochildi» yoki «Ochilmadi»ni tanlang:
     (1) Telefon brauzerida lending manzilingizga `/oferta.html` qo'shib oching — tepada «Mashq hujjati — real to'lov qabul qilinmaydi». → `chiqdi`
     (2) Lendingning o'zini oching: pastdagi «Maxfiylik siyosati» va «{nom} shartlari» — ikkalasi ochiladi; siyosatda «Qaysi ma'lumot?» va «Nima uchun?» ostida to'lov bandi bor. Bandning har gapini agent aytgan fayl bilan solishtiring. → `havolalar.lending`
     (3) To'lov taklifi ekranini oching — Pro'siz hisob kerak (mobil — Expo Go'da, web — saytingizda). Hisobingizda Pro yoqilgan bo'lsa — ro'yxatdan o'tish formasida tekshiruv akkaunti oching (ism «tekshiruv»), ish tugagach uni «Hisobni o'chirish» bilan o'chiring.
         «{to'lov tugmasi}» ostidagi ikki havolani bosing — brauzerda oferta va siyosat ochiladi; «{to'lov tugmasi}» avvalgidek mashq to'lov sahifasini ochadi. → `havolalar.ekran`
     «Ochilmadi» bo'lsa — agentga: «{nima}: kutganim {nima kutdim}, bo'ldi {nima bo'ldi}. Tuzat, o'zgargan fayllarni ayt.» → push → qayta oching. Lending yangilanmagan bo'lsa — bir necha daqiqadan keyin qayta oching.
     Kulrang qator (mobil trek): O'rnatish fayli va brauzer ko'rinishi o'zi yangilanmaydi: odamlardagi ilovada havolalar faqat yangi versiyada ko'rinadi. (120)
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (≤ 3 blok; bir marta o'zi yuradi):
  - brauzer `maydon-jamoa-….netlify.app/maxfiylik.html` (Mentor siyosati — 12-Modul matni + bugungi to'lov bandi; yangi gaplar accent och fonda):
    - **Maydon Jamoa · maxfiylik siyosati**
    - **Qaysi ma'lumot?** Ro'yxatdan o'tishda — ism, login va parol; parolning o'zi saqlanmaydi, o'rnida undan yasalgan satr (hash) turadi. Telefon raqami so'ralmaydi. Ilovada qadamlar sanaladi — ism va loginsiz, qurilma ID bilan. Ilova eslatmadan ochilgani ham qurilma ID bilan sanaladi.
      Lendingda Umami tashrif va tugma bosilishini sanaydi — unga ism va login yuborilmaydi. **Karta ma'lumotini Maydon Jamoa ko'rmaydi va saqlamaydi: haqiqiy to'lovda uni to'lov xizmati qabul qiladi, bu mashqda karta umuman so'ralmaydi. Biz saqlaymiz: to'lov raqami, kim to'lagani (hisob), holati (to'landi yoki rad etildi), summa, sana va Pro muddati.**
    - **Nima uchun?** Ism — o'yindagi o'yinchilar bir-birini tanishi uchun. Login va parol — hisobga kirish uchun. Qadamlar sanog'i — ilovaning qaysi joyi tushunarsizligini bilish uchun. **To'lov raqami, summa, sana va Pro muddati — Pro'ni yoqish uchun.**
    - **Kim ko'radi?** Ism — shu o'yindagi o'yinchilar. Loginni boshqa o'yinchilar ko'rmaydi. Database'ni faqat ilova egasi ko'radi.
    - **Qancha saqlanadi?** Hisob — o'zingiz o'chirguningizcha: ilovada «Hisobni o'chirish» bor. Qadamlar yozuvi — 60 kun.
    - sahifa pastida: «Pro shartlari»
  - telefon: to'lov taklifi ekrani (A-6) — «To'lovga o'tish» ostida «Pro shartlari» · «Maxfiylik siyosati», pastda kulrang «Test rejim: pul yechilmaydi»; «Pro shartlari» bosiladi → chiziq → brauzer `…/oferta.html` (kichik kadr).
  - kichik izoh: Siyosatning eski gaplari — 12-Modulda yozilgani; sizda boshqacha bo'ladi.
- Hammasi bajarilgach (yashil, holatga qarab — sinf 6):
  - uchala tekshiruv «Ochildi»: Oferta va siyosat saytda: to'lovchi ularni to'lashdan oldin ochadi. (67)
  - birortasi «Ochilmadi» yoki tanlanmagan: Sahifalar yozildi — saytda ochilishini tugatish qoldi. (54)
- Saqlanadi: `pm-m11d7-hujjat.siyosatBand` (2-qadam «Nusxalash») · `.chiqdi` ((1)) · `.havolalar.lending` ((2)) · `.havolalar.ekran` ((3)) — A-12.
- Ulgurmasangiz: 2-qadamdan keyin «Davom etish» ochiladi (SABOQ E 55); push va telefonda tekshirish — uyga vazifa ①. Blok 4-qadam «Bajardim»idan keyin bajarilgan sanaladi.
- Nishon (bonus): Terms Live! — 4-qadam «Bajardim»ida, Amaliyot 1 ham bajarilgan va uchala tekshiruv belgilangan bo'lsa (natijadan qat'i nazar — tavsif qilingan ishni aytadi; 152).
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: talab zinapoyasi — bitta qatorni o'quvchi yozadi (to'lovda nima saqlanishi — mahsulot qarori, sinf 13); qolganini agent koddan tekshiradi, bilinmaganini «[savol]» qoldiradi (12-Modul 9.39 f). Siyosatning to'rt savoli o'zgarmaydi (tayanch 1.7).
  Ikkala havola to'lov taklifi ekranida — Qaror-0 13 («ikkalasiga havola — lendingda va to'lov taklifi ekranida»; TAYANCHGA SAVOL 2). Tekshiruv akkaunti — 12-Modul 9.35 a, 9.37 g naqshi (TAYANCHGA SAVOL 12).
- O'qituvchi eslatmasi: Siyosatning to'rt savoli 10 va 12-Moduldagidek qoladi — faqat to'lov bandi qo'shiladi. Karta ma'lumoti mahsulotga kirmaydi: mashq to'lov karta so'ramaydi, haqiqiy xizmatda kartani to'lov xizmati qabul qiladi.
  Tekshiruv akkaunti — ism «tekshiruv», familiyasiz; ish tugagach o'chiriladi (12-Modul qoidasi). Havola to'lovdan oldin ko'rinishi kerak — shuning uchun to'lov taklifi ekranining o'zida. O'rnatish fayli bu darsda qayta tayyorlanmaydi (TAYANCHGA SAVOL 11).

## 8 · Yakuniy savol  ← QTest (✔ C, `correctIdx 2`; ikki blok birga — oferta va siyosatdagi «[savol]»; ikkala trekka to'g'ri)
- Eyebrow: Yakuniy tekshiruv (savol ustida yorliq yo'q)
- Savol: **Ofertangiz yoki siyosatingizda «[savol]» qoldi. Nima qilasiz?** (61)
  - A — Agentdan joyni o'zi to'ldirishini so'rayman (43)
  - B — «[savol]»ni shundayligicha qoldirib chiqaraman (46)
  - ✔ C — Kod nima qilsa, shuni o'zim yozib qo'yaman (42)
  - D — Boshqa ilovaning shartlaridan gap ko'chiraman (45)
- Kalit: **C** (index 2). To'rttalasi bir shaklda (birinchi shaxs fe'li bilan tugaydi); tire va qavs hech birida yo'q; «[savol]» — savolda va B da (kalit so'z faqat to'g'rida emas); uzunlik — «O'lchov».
  Distraktorlar uch xil turkum: A — agentga qaror berish (u koddan bilmaganini to'qiydi) · B — chala sahifa (to'lovchi shartni bilmaydi) · D — begona mahsulot shartlari (sizning mahsulotingiz haqida emas).
- To'g'ri izohi: Sahifada faqat mahsulotingiz bugun qiladigan narsa turadi. (58)
- Xato izohlari (≤60):
  - A: Agent kodda ko'rmagan narsani qayerdan oladi? (45)
  - B: To'lovchi «[savol]»dan qanday shartni bilib oladi? (50)
  - D: Boshqa ilova sizning mahsulotingiz nima qilishini biladimi? (59)
  - (umumiy) «[savol]» qayerda va nima uchun paydo bo'lgan edi? (50)
- Javob topilgach (kichik): oferta bandi — «[savol]» o'rniga kod qatoridan qisqa gap uchib kiradi, ramka uzuqdan to'liqqa o'tadi.
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».
- Izoh (MD): savol ekrandan ko'chirilmaydi (§106): Amaliyot 1 va 2 da «[savol]» yozish yo'li bor, savol esa uchta yanglish yo'lni rad ettiradi. Arena 8 («[savol]» nimani bildiradi — ma'no) bilan kalit ibora takrorlanmaydi (S-008).
  «o'zim yozib qo'yaman» — mahsulot qarori o'quvchida (sinf 13); «kod nima qilsa» — oferta bandlari mahsulot ishi haqida (2–4) va siyosatdagi to'lov bandi (saqlanadigan ma'lumot) — ikkalasi koddan tekshiriladi.

## 9 · Natijalar (podium)  ← QNatija
- Jonli reyting — qolip standarti (yakka rejimda — o'z natijasi): 2 savol (3, 8); 2, 4-ekranlar — ballsiz, nishon bilan; 5, 6, 7-ekranlar «Saqlash» / «Bajardim» — Mentorga signal (`PRACTICE_BASE`, ball yo'q).
- Mentor statistikasi yorliqlari (`Q_LABELS`): 3 — «1 — Ofertaga nima yoziladi» · 8 — «Yakuniy — «[savol]» qolsa»

## 10 · Takrorlash  ← QKartochka (alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25) — platforma sarlavhasi
- Mentor yo'q (KORPUS §61; SABOQ 16). Birinchi bosishgacha karta yuzi yengil accent chegara bilan (E 49), ostida: Kartani bosing — javob ochiladi.
  Jonli darsda (mentor boshqaruvida) o'quvchida bu ekran o'tkazib yuboriladi (skelet naqshi).
- 12 karta — «Kartochkalar (12)» jadvali (pastda) · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N.
- Tugmalar: Orqaga · Yakunlash →

## 11 · Dars yakuni  ← QYakun (SABOQ E 50 standarti)
- Yorliqlar (tepada): Dars tugadi · N/2 to'g'ri
- Sarlavha (holatga qarab — P-046, E 54; ✓ va nishon — faqat birinchi holatda; sarlavha o'quvchi qilgan ishni aytadi):
  - Amaliyot 2 bajarilgan, uchala tekshiruv «Ochildi», «[savol]» qolmagan: **Oferta va siyosat saytda — havolalar ishlaydi.** (46)
  - Amaliyot 2 bajarilgan, lekin «Ochilmadi», belgilanmagan tekshiruv yoki «[savol]» bor: **Hujjatlar yozildi — saytda tekshirish qoldi.** (44)
  - Amaliyot 1 bajarilgan, Amaliyot 2 yo'q: **Oferta yozildi — siyosat va havolalar qoldi.** (44)
  - faqat bandlar saqlangan (5-ekran): **Bandlaringiz tayyor — sahifani yozish qoldi.** (44)
  - hech narsa saqlanmagan: **Oferta hali yozilmagan — bandlarni uyda yozing.** (47)
- Arena tugmasi (o'yin qatlami, darsdan): CODE STRIKE · 12 SAVOL · 15 SONIYA · PODIUM · (jonli darsda) Mentorni kuting
- «Bugungi asosiy fikr» qutisi — yo'q (E 50; fikr A-2 da — darsning ichki o'qi).
- Endi siz bilasiz (T-048 — asosiy fikr so'zma-so'z takrorlanmaydi; 1-qator — ta'rif, T-042):
  - Oferta — hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan. Odam to'lasa — shu shartlarga rozi bo'ladi.
  - Ofertaga bugun ishlaydigan narsa yoziladi — va'da emas.
  - Bu mashqda sotuvchi, pulni qaytarish va aloqa — real ishga tushirishda; real ishga tushirish bu kursda emas.
  - Agent koddan bilmagan joyni «[savol]» qoldiradi — uni kodga qarab o'zingiz yozasiz.
  - Siyosatdagi to'lov bandi karta ma'lumoti qayerda qolishini va mahsulot nimani saqlashini aytadi.
- Uyga vazifa (`HwCard`, P-025 karta shaklida; yakunda aynan shu bandlar; alohida `.homework.jsx` yo'q): sarlavha **Uyda nima qilasiz?**
  - Kim uchun: o'z mahsulotingiz · Nechta: ikki ish · Muddat: keyingi darsgacha
  - ① Darsda qolgan ishni tugating: {holatga qarab — «[savol]» joylarini kodga qarab yozing · siyosatga to'lov bandi va havolalarni qo'shing · push qilib, telefonda oching}. Hammasi tugagan bo'lsa ① ko'rinmaydi.
  - ② Bitta tanish odam — ota-onangiz yoki sinfdoshingiz — ofertangizni telefonida ochsin. Undan so'rang: «Qaysi joyi tushunarsiz?» Tushunarsiz gapni soddaroq yozing va push qiling.
  - Karta ostida (bitta kulrang qator): Ofertaga telefoningiz, Telegram nomingiz va karta ma'lumoti yozilmaydi.
  - Tugma: Amaliy topshiriqni bajarish →
- Keyingi dars — «Loyiha kuni: ketayotgan foydalanuvchini qaytarish»
- Nishonlaringiz — n/4 (pastda; mentor rejimida yo'q).
- Tartib: belgi va sarlavha · CODE STRIKE · Endi siz bilasiz · Uyga vazifa · Keyingi dars · Nishonlaringiz. Ichki skroll qutisi yo'q (SABOQ 18). Artefakt-strip yakunda yo'q (E 50).
- Tugmalar: Orqaga · Qaytadan · Yakunlash ✓
- Izoh (MD): uyga vazifada keyingi darslar aytilmaydi (T-038). ② — bitta tanish odam, tanish doira (TAQIQLAR 3); «sinov» so'zi o'quvchi matnida ishlatilmadi — «ochsin», «so'rang». Uyga vazifa yengil: ① faqat qolgan ish bo'lsa (sinf 14).
  Yakun sarlavhalari kalitdan yig'iladi: `bandlar` (bor / yo'q) · Amaliyot 1 va 2 bayrog'i (4-qadam «Bajardim») · `chiqdi`, `havolalar` · `bandlar[].savol` (P-046).

---

## Nishonlar (4) — inglizcha nom qoladi; medal belgisi — o'yin qatlami (§184: qilingan ishni aytadi)
- **Ask Before Pay!** (2-ekran, olti savol birinchi urinishda) — Ekran qaysi savolga javob berishini topdingiz (45)
- **Open Offer!** (3-ekran, 1-savol birinchi urinishda) — Ofertaga nima yozilishini topdingiz (35)
- **Clause Sorter!** (4-ekran, olti band birinchi urinishda) — Bugun yoziladigan bandlarni ajratdingiz (39)
- **Terms Live!** (7-ekran, 4-qadam «Bajardim»; Amaliyot 1 ham bajarilgan — bonus) — Ikki amaliyotni tekshiruvigacha bajardingiz (43)
- Yozuvlar: Birinchi urinishda to'g'ri bajarsangiz — nishon sizniki. · Nishon birinchi urinish uchun edi. · Nishonlar — n/4
- Tekin bonus — bitta (Terms Live!, ish qilingan ekranda — P-048); u Amaliyot 1 bajarilgan va Amaliyot 2 da «uchala tekshiruv belgilangan» bo'lsa beriladi — natija «Ochilmadi» bo'lsa ham (tavsif tekshiruvni aytadi, «saytda» demaydi). Yakuniy savol nishonsiz. Nomlar boshqa darslarda yo'q (grep `src/`, `feedback/`, 07.10 — 0).

## Qisqa takrorlash oynalari (har ballik test — 3 karta; S-026: PM darsida emoji o'rniga raqam 1/2/3)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz. Jonli darsda mentor «Qayta tushuntirishni ochish» bosganda chiqadi.
- **3 · Ofertaga nima yoziladi** — 1 Oferta — hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan. · 2 Odam to'lasa — shu shartlarga rozi bo'ladi. · 3 Shuning uchun to'lovchi to'lashdan oldin so'raydigan narsa ofertada yoziladi.
  — Sinfga savol: To'lov taklifi ekraningiz qaysi savolga javob bermaydi?
- **8 · «[savol]» qolsa** — 1 Agent koddan bilmagan joyni «[savol]» qoldiradi. · 2 Kod nima qilsa — shuni o'zingiz yozasiz. · 3 Kodda yo'q narsa sahifaga yozilmaydi — va'da emas.
  — Sinfga savol: «[savol]» ni shundayligicha qoldirsangiz, to'lovchi nimani bilmay qoladi?

## Kartochkalar (12) — 10-ekran
| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Oferta nima? | Hamma uchun ochiq taklif: nima beriladi, qancha turadi, qanday shart bilan | O'zbekiston qonunchiligida — ommaviy oferta (369-modda) |
| Odam to'lasa, ofertaga nisbatan nima bo'ladi? | Shu shartlarga rozi bo'ladi | Shuning uchun shartlar to'lashdan oldin ochiq turadi |
| Mentor misolida to'lov taklifi ekrani qaysi shartlarni aytadi? | Nima beriladi, narx va muddat | Qolgan to'rt savolning javobi ekranda yo'q |
| Mentor ofertasi qaysi bandlardan iborat? | Kim taklif qiladi, nima beriladi, narx va muddat, Pro tugasa, bekor qilish va pulni qaytarish, aloqa | Kurs shabloni — sizda band nomlari boshqacha bo'lishi mumkin |
| Bu mashqda qaysi bandlar real ishga tushirishda yoziladi? | Kim taklif qiladi, bekor qilish va pulni qaytarish, aloqa | Ofertada ular kvadrat qavsda turadi |
| Real ishga tushirish uchun nima kerak? | Ota-onaning yozma roziligi va yuridik shaxs yoki YaTT | YaTT — yakka tartibdagi tadbirkor; bu kursda emas |
| Mentor misolida Pro tugasa, pul o'zi yechiladimi? | Yo'q — Pro o'zi to'xtaydi | Mentor ofertasining «Narx va muddat» bandi |
| Ofertaga va'da yoziladimi? | Yo'q — bugun ishlaydigan narsa yoziladi | «Tez orada», «yaqinda» — ofertada yo'q |
| Agent koddan bilmagan joyni qanday belgilaydi? | «[savol]» deb qoldiradi | Gapni kodga qarab o'zingiz yozasiz |
| Mashq ofertasining tepasida va oxirida nima yoziladi? | «Mashq hujjati — real to'lov qabul qilinmaydi» va «Bu hujjat yuridik maslahat emas.» | Sahifa mashq ekanini ochiq aytadi |
| Siyosatdagi to'lov bandi nimani aytadi? | Karta ma'lumoti qayerda qolishini va mahsulot nimani saqlashini | Mentor misolida: to'lov raqami, summa, sana va Pro muddati |
| To'lovchi shartlarni qayerdan ochadi? | To'lov taklifi ekranidagi va lendingdagi havoladan | To'lashdan oldin |
- §145: har javobdagi so'z darsda bor (oferta, rozi bo'ladi — 2 · bandlar, real ishga tushirish, «Mashq hujjati» — 4 · «[savol]» — 5, 6, 8 · to'lov bandi, havola — 7 · ota-ona, YaTT — 4-ekran kulrang qatori).
- S-027: har old tomon — to'liq savol, «?» bilan; «ta'rif → atamani toping» shakli yo'q. Bugungi asosiy fikr kartochkada so'zma-so'z yo'q (P-013). Qonun manbasi (369-modda) — 1-karta izohida (tayanch 1.7: «Manba qatori — kartochkada va O'qituvchi eslatmasida»).
- Tugmalar (qolip): O'rganilmoqda · Bildim · Takrorlash · hammasi bilinganda «Hammasini bilasiz! · 12/12 karta yodlandi · Qaytadan takrorlash»

## Jonli viktorina — 12 savol (✔ o'rni: A 1·5·9 · B 2·6·10 · C 3·7·11 · D 4·8·12 — har biri 3 marta)
Ekran testlari va kartochkalar nusxasi emas (§144, S-021): boshqa holat, boshqa so'z. Har savolni aytgan ekran — qavsda. Uzunliklar — `md07/olchov.py` (pastda «O'lchov»).
1. Oferta qanday taklif? (2)
   - ✔ A — Hamma uchun ochiq, shartlari yozilgan (37)
   - B — Faqat do'stlarga yashirin yuborilgan (36)
   - C — Narxsiz, faqat og'zaki aytilgan taklif (38)
   - D — To'lovdan keyingina ko'rsatiladigan (35)
2. Odam to'lasa, ofertaga nisbatan nima bo'ladi? (2)
   - A — Hech narsa — u faqat narxni ko'rdi (34)
   - ✔ B — Undagi shartlarga rozi bo'ladi (30)
   - C — Oferta shu zahoti bekor bo'ladi (31)
   - D — Shartlarni o'zi o'zgartira oladi (32)
3. Tashkilotchi: «Bekor qilsam, pulim qaytadimi?» Javob qayerda? (2, 4)
   - A — To'lov taklifi ekranidagi narxda (32)
   - B — Mashq to'lov sahifasi tugmasida (31)
   - ✔ C — Ofertaning bekor qilish bandida (31)
   - D — Ilovaning e'lon berish qismida (30)
4. Mentor ofertasida sotuvchi qatori nega bo'sh? (4)
   - A — Mentor o'z ismini yozishni unutgan (34)
   - B — Sotuvchini agent keyin o'zi qo'yadi (35)
   - C — Qatorni Pro olgan odam to'ldiradi (33)
   - ✔ D — Bu kursda real ishga tushirish yo'q (35)
5. Qaysi gap ofertaga yoziladi? (4, 5)
   - ✔ A — Pro tugasa, e'lon qilingan o'yin qoladi (39)
   - B — Tez orada Pro'ga yana qulaylik qo'shamiz (40)
   - C — Boshqa tashkilotchilar ham Pro'ni oldi (38)
   - D — Pro bilan har o'yiningiz to'lib boradi (38)
6. Mentor misolida Pro muddati tugasa, nima bo'ladi? (4)
   - A — Keyingi 30 kun puli o'zi yechiladi (34)
   - ✔ B — Pro o'zi to'xtaydi, pul so'ralmaydi (35)
   - C — E'lon qilingan o'yinlar o'chib ketadi (37)
   - D — O'yinchilar uchun ilova pullik bo'ladi (38)
7. Real ishga tushirish uchun nima kerak? (4)
   - A — Ilovani do'konga joylashning o'zi (33)
   - B — Sinfdoshlarning og'zaki roziligi (32)
   - ✔ C — Ota-ona yozma roziligi va sotuvchi (34)
   - D — Ofertani lendingga qo'yishning o'zi (35)
8. Agent ofertada «[savol]» qoldirdi. Bu nimani bildiradi? (6)
   - A — Bandni olib tashlash kerakligini (32)
   - B — Sahifa internetda ochilmasligini (32)
   - C — Agent uni keyin o'zi to'ldirishini (34)
   - ✔ D — Agent buni koddan bilolmaganini (31)
9. Kitob almashish ilovangiz ofertasidagi narxni qanday tekshirasiz? (6)
   - ✔ A — Ilova kodida o'zim ko'rib chiqaman (34)
   - B — Agentdan «to'g'rimi?» deb so'rayman (35)
   - C — Sinfdoshimdan narxni so'rab olaman (34)
   - D — Tekshirmayman — narx o'zgarmaydi (32)
10. Siyosatdagi to'lov bandida qaysi gap rost? (7)
    - A — Karta raqamini biz xavfsiz saqlaymiz (36)
    - ✔ B — Karta ma'lumotini mahsulot saqlamaydi (37)
    - C — To'lov haqida hech narsa saqlanmaydi (36)
    - D — Karta ma'lumotini Mentor tekshirib turadi (41)
11. Mentor misolida to'lov uchun nima saqlanadi? (7)
    - A — Karta raqami va egasining telefoni (34)
    - B — Tashkilotchining ismi va maktab raqami (38)
    - ✔ C — To'lov raqami, summa, sana va muddat (36)
    - D — Hech narsa — to'lovdan keyin o'chadi (36)
12. Tashkilotchi Pro shartlarini qachon o'qiy olishi kerak? (7)
    - A — To'lov o'tgandan keyin, chatda (30)
    - B — Pro muddati tugagan kunning o'zida (34)
    - C — Mentordan so'rab bilgan paytida (31)
    - ✔ D — To'lov tugmasini bosishdan oldin (32)
- Har savolda to'g'ri variant yolg'iz eng uzun emas (S-006); kalit ibora ekran testlari bilan takrorlanmaydi (S-008): 3-ekran (uy vazifalari ilovasi — ofertaga nima yoziladi) ↔ arena 5 (Mentor gaplaridan qaysi biri) · 8-ekran («[savol]» qolsa — harakat) ↔ arena 8 («[savol]» — ma'no).
- Distraktorlar darsning o'z qoidasi bo'yicha noto'g'ri, yolg'on fakt emas (S-004): 4 — unutish, agentga qaror, to'lovchiga qaror (uch xil) · 5 — va'da, ishontirish uchun «hamma oldi», kafolatga o'xshash natija (uch xil) · 7 — texnik qadamning o'zi, og'zaki rozilik · 9 — agent da'vosi, begona fikr, tekshirmaslik ·
  10 — karta saqlanadi deb aytish, hech narsa saqlanmaydi deb aytish, kartani Mentor ko'radi (uch xil) · 11 — karta va telefon, ism va maktab (shaxsiy ma'lumot), hech narsa · 12 — keyin, muddat oxirida, faqat so'rasa. Arena 6 — Mentor misoli (tayanch 1.0, 1.7; 5-dars Pro tugashi).
- **Fon so'zlari** (R-008, kodda {uz, ru}): arena — oferta · shart · band · narx · muddat · havola · siyosat · mashq hujjati · Maydon Jamoa · uyga vazifa banneri — oferta · shart · havola. Emoji yo'q. Kvadrat qavsli «[savol]» fon so'ziga qo'yilmaydi.
- Arena yozuvlari — umumiy shablon: «Adashdingiz — 0 ball. Keyingisida olasiz.» · «Vaqt tugadi — 0 ball. Keyingi savolda ulguring.»

---

## KOD — kod bosqichida (Quruvchi; skelet `src/skelet/NamunaDars.jsx`, qolip `src/qolip`; pilotdan nusxa yo'q — JR-14)
1. Yangi fayl `src/11-Modull/PmTermsLesson.jsx` — skeletdan; palitra `qolipRang('pm')`, `qolipCss(T)`; `LESSON_META.lessonId` `pm-m11d7-v1` (pilot naqshi `pm-m11dN-v1`), `lessonTitle` — «Foydalanuvchiga shartlarni qanday ochiq aytasiz?».
2. `SCREEN_META` 12: hook · plan · concept · test · concept · practice · practice · practice · test · stats · flashcards (`sflash`) · summary. `INLINE_KEYS` { 3: 1, 8: 2 }; `savollar: -1`, `bandlar: -1` (2, 4-ekran — ballsiz, nishon bilan);
   5, 6, 7 `practice: -1`, signal `PRACTICE_BASE + ekran`. `narrow` — 3, 8, 9-ekranlar.
   Qolip turlari: s0 `QKirish` · s1 `QReja` · s2/s4 `QTushuncha` (`zoom`, `tugadi` — q17/q18; `QBashorat` + taxmin qatori yashil xulosa qutisi ichida — E 42) · s3/s8 `QTest` (`QuestionScreen` mantig'i, DE-203) · s5 `QMustaqil` · s6/s7 `QBlok` (skeletdagi `ScreenBlok` ulagichi) · s9 `QNatija` · `sflash` `QKartochka` · s11 `QYakun`.
3. **`ShartlarSahna`** — bitta vizual (180; qolipda yo'q, yangi): rejimlar `telefon` (to'lov taklifi ekrani: `MENTOR_EKRAN` yoki o'quvchi kalitidan; «Test rejim: pul yechilmaydi» doim; ixtiyoriy ikki havola) · `brauzer` (manzil satri + sahifa: tepa qatori, sarlavha, olti band, oxirgi qator; kvadrat qavsli matn — kulrang kursiv, «[savol]» — accent uzuq ramka) ·
   `varaq` (2-ekran «Shartlar»; 5-ekran «{nom} shartlari») · `tashkilotchi` (real ko'rinish — SABOQ 36; pufak) · telefon havolasidan brauzerga chiziq. Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: ss-qator ss-band ss-havola`). Rangli yon chiziq yo'q. `reduced-motion` — o'tishsiz. 393 da telefon brauzer ustida, kesilmaydi (E 41).
4. **Bitta manbalar (A-6 aynan):** `MENTOR_EKRAN` (1.4) · `MENTOR_OFERTA` (`{ tepa, sarlavha, bandlar: [{ id, nom, matn, kalit: 'bugun' | 'real' }] × 6, oxiri }` — 1.7) · `MENTOR_TOLOV_BANDI` (1.7; ikki bo'lak — «Qaysi ma'lumot?» va «Nima uchun?») · `MENTOR_SIYOSAT` (12-Modul matni, 7-ekran kutilgan natijasi) · `HALOL_GAP` (A-4) · `TOLOVCHI_SAVOLLARI` (2-ekran, 6 × `{ matn, ekrandaBor }`).
   Mentor rejimi, s0, s2, s4, s5 (Yordam), s6/s7 (Yordam va kutilgan natija) shulardan o'qiydi.
5. **s2** — `QBashorat` (1 · 2 · 4) → 6 karta, ikki tugma («Ekranda bor» / «Ekranda yo'q»), kalit `[bor, bor, yoq, yoq, yoq, yoq]`; «bor» → telefondagi mos qator (`MENTOR_EKRAN` qatori indeksi) yonadi; «yo'q» → «Shartlar» varag'iga; `QXato` 3 turi; natijada taxmin qatori + xulosa + `QIzoh` (atama); 40 s ipucha; nishon `askBeforePay`.
6. **s4** — `QBashorat` (2 · 3 · 4) → 6 band kartasi, ikki tugma, kalit `MENTOR_OFERTA.bandlar[].kalit`; to'g'ri → matn brauzerdagi joyiga uchadi; `QXato` 6 ta; doimiy kulrang `HALOL_GAP`; 6/6 → tepa va oxirgi qator kiradi; `QIzoh`; nishon `clauseSorter`.
7. **s5** — o'qiydi `pm-m11d4-narx` (`narx`, `davrKun`, `ekran.*`) va `pm-m11d2-model` (`nima`); uch qism ketma-ket; har qismda «Hali bilmayman» (`[savol]`); 3-band matni qolipdan yig'iladi (`davrKun` bo'sh bo'lsa — «{narx} so'm; muddat tugagach …»); tekshiruvlar (bo'sh · telefon/akkaunt · karta · narx 0 — bloklaydi; va'da · kafolat so'zlari — yumshoq) —
   **PM-108 tartibida kamida 10 namuna bilan `node` da sinaladi** (masalan: «har hafta o'yin o'zi e'lon qilinadi» o'tadi · «tez orada yangi qulaylik qo'shamiz» yumshoq · «+998 90 …» bloklanadi · «aloqa: @…» bloklanadi · «100% ishlaydi» yumshoq · narx «0» bloklanadi); narx soni bo'shliq bilan («15 000»).
   Saqlash → `pm-m11d7-hujjat.bandlar` (olti band, `id` tartibi `kim · nima · narx · tugasa · qaytarish · aloqa`), `savedAt`; `{nom}` — `ccProgress`. ✎ — qismni qayta ochish (o'sha tekshiruvlar bilan).
8. **s6** (`QBlok`, 4 qadam) — prompt qavslari `{nom}`, `{oferta bandlari}` — s5 dan oldindan (qavs — `QPrompt` atrofida o'z o'rovchisi; `src/qolip` ga tegilmaydi — «qolip taklifi»); 4-qadamda o'ng varaqdagi ✎ → `bandlar[].matn`, `savol` yangilanadi; «Ortda qoldingizmi» (darsda bir marta) shu blokda; «Davom etish» 3-qadamdan keyin; yashil xulosa — `savol` bayroqlaridan (ikki holat).
9. **s7** (`QBlok`, 4 qadam) — o'qiydi `pm-m9d8-platforma.trek` (`{to'lov taklifi ekrani}` va «Ochish» gapi; yo'q — ikkala gap), `pm-m10d1-lending.manzil` (`{lending manzili}`; yo'q — bo'sh, kulrang namuna), `pm-m11d4-narx.ekran.tugma` (`{to'lov tugmasi}`; yo'q — «To'lovga o'tish»);
   `{to'lov bandi}` — o'quvchi yozadi (≤ 200; tekshiruvlar 3 ta, «Nusxalash» bosilganda) → `siyosatBand`; 4-qadamda uch tekshiruv kartasi («Ochildi» / «Ochilmadi») → `chiqdi`, `havolalar.lending`, `havolalar.ekran`; «Davom etish» 2-qadamdan keyin; nishon `termsLive` (Amaliyot 1 bayrog'i bor va uchala tekshiruv belgilanganda); yashil xulosa — ikki holat.
10. **Mentor rejimi:** o'quvchilar ro'yxatida faqat signallar («Bandlar saqlandi» · Amaliyot 1, 2 «Bajardim»; `PRACTICE_BASE`); o'quvchi band matni va siyosat bandi Mentorga ham, proyektorga ham chiqmaydi (o'z mahsuloti qarorlari; telefon yoki akkaunt tasodifan yozilsa ham ko'rinmasin). 0-ekrandagi sinf ovozlari — faqat variantlar soni.
11. Testlar s3/s8 — `correctIdx` 1/2 = `INLINE_KEYS`; `RECAPS` {3, 8} (`ic` → 1/2/3 + `ask`); `Q_LABELS` {3, 8}. Savol ustida yorliq yo'q (SABOQ 6); javobdan keyingi kichik vizual — `QuestionScreen` `vizual` (SABOQ 4).
12. `ACHIEVEMENTS` 4 (`askBeforePay`, `openOffer`, `clauseSorter`, `termsLive`) + `ACH_TRIGGERS`. `QUIZ_BANK` 12 (✔ 0·1·2·3 ×3 — arena jadvali) + `set_quiz_keys`; `QZ_BG_SHAPES` → fon so'zlari `{uz, ru}`, emoji yo'q (R-008). `FLASHCARDS` 12 ({front, back, note}) — `sflash` alohida ekranda. `SCREEN_INTENTS`.
13. s11 `QYakun`: sarlavha **besh holat** — `pm-m11d7-hujjat` dan va blok bayroqlaridan (P-046, E 54); `recap` 5 qator = «Endi siz bilasiz» so'zma-so'z; «Bugungi asosiy fikr» ko'rsatilmaydi (E 50); `uyga` — `HwCard` (Kim uchun · Nechta · Muddat + ①②; ① holatdan yig'iladi); `keyingi` — «Loyiha kuni: ketayotgan foydalanuvchini qaytarish». Yordam darajalari (P-033): qulf-yorliq · ipucha 40 s · rescue 110 s.
14. App.jsx `m11-07` qatoriga `comp: PmTermsLesson` + import — asosiy seans, «qur» bosqichida (nom va osti o'zgarmaydi — DE-205 ✓, App.jsx 451-qator). Bu agent App.jsx ga tegmaydi.
- Darvozalar: `npm run gates -- src/11-Modull/PmTermsLesson.jsx` 12/12 · `lint:olchov` 0 · `lint:emoji` (qolip) 0 · `lint:til` 0 · `lint:jsx` 0 · `stilsiz.py` (10-Modul SABOQ 31) · surat 1280 + 393 (har ekran 4 savoli — SABOQ 30) · maket kesilmasligi (E 41) · haqiqiy click bilan har tugma (E 47).
  ⚠️ CSS izohida va matn konstantalarida backtik yo'q (template-satr tuzog'i, CLAUDE.md). Kvadrat qavs «[savol]» — matn, JSX ifodasi emas (qavs ichida `{…}` yo'q).

## REPO — `maydon-jamoa` («qur» bosqichida yoziladi, push — buyruq bilan; `m13-dars-07-start` = `m13-dars-06-done` = `m13-dars-05-done` → `m13-dars-07-done`, tayanch 3)
1. **`lending/oferta.html`** — Mentor ofertasi so'zma-so'z (A-6 jadvali): tepa qatori, «Pro shartlari», olti band (sarlavha + matn), «Bu hujjat yuridik maslahat emas.»; lending uslubida (`style.css`), telefonda bir ustun; forma, to'lov tugmasi, skript va Umami yo'q (TAYANCHGA SAVOL 15).
2. **`lending/maxfiylik.html`** — to'lov bandi: «Qaysi ma'lumot?» ga ikki gap, «Nima uchun?» ga bitta gap (A-6; TAYANCHGA SAVOL 1); qolgan matn o'zgarmaydi (12-Modul 7, 9-darslar).
3. **`lending/index.html`** — sahifa pastida «Maxfiylik siyosati» yonida «Pro shartlari» (`oferta.html`). Sarlavha, foydalar, «Qo'shilmoqchiman», «Qanday qo'shilaman», Umami — o'zgarmaydi.
4. **`mobil/`** — to'lov taklifi ekrani: «To'lovga o'tish» ostida ikki kichik havola «Pro shartlari» · «Maxfiylik siyosati» — telefon brauzerida lending sahifalarini ochadi (usul — agentning tanloviga qoladi; ⛔ «qur» da Expo Go'da Android va iPhone'da sinaladi); «Test rejim: pul yechilmaydi» joyida; to'lov yo'li o'zgarmaydi.
5. **`README.md`** — «Darslar va teglar» jadvaliga 7-dars qatori. O'rnatish fayli va brauzer ko'rinishi bu tegda qayta tayyorlanmaydi (TAYANCHGA SAVOL 11).
6. ⛔ **Muhrdan oldin:** Amaliyot 1 talabi Mentor repo'sida agentga berilib, agent javobi yoziladi (6-ekran kutilgan natijasi shunga moslanadi) — ayniqsa 4-band (Pro tugasa) haqida — 07.10 hal qilindi (tayanch 9.26): Pro tugashi 5-dars 1-amaliyotida quriladi, 4-band kodda bor; 12-darsning 5-topilmasi endi boshqa (doimiy o'yinning takror yaratilishi).
   Amaliyot 2 talabi — agent `tolovlar` ustunlarini (`holat`, `oyinchi_id`) siyosat bandi bilan solishtirganda nima deydi (TAYANCHGA SAVOL 10).
7. Shart: teglar kurs boshlanishidan oldin upstream'da (`yechim` tarmog'ida).

## Manbalar (07.10.2026; o'quvchiga ko'rinmaydi)
- **FK 27-modda** — lex.uz/docs/-111189 (O'zbekiston Respublikasining kodeksi; to'liq nomi lint qoidasiga soxta tushadi — TAQIQLAR 5). **O'zim ochib o'qidim (07.10.2026):** «O'n to'rt yoshdan o'n sakkiz yoshgacha bo'lgan voyaga yetmaganlar, … bitimlarni o'z ota-onalari, farzandlikka oluvchilari yoki homiylarining yozma roziligi bilan tuzadilar.» (apostrof oddiy shaklga keltirildi)
- **FK 369-modda** — o'sha sahifa: mundarijada sarlavhasi «Ofertaga taklif etish. Ommaviy oferta» (o'zim ko'rdim, 07.10.2026); matni sahifaning men o'qiy olgan qismiga tushmadi — iqtibos tayanch 1.7 va `00-MANBA.md` 5 dan (07.10.2026): «… taklif oferta (ommaviy oferta) …».
- Mentor ofertasi, siyosat bandi, halollik gapi, bloklar — `00-MODUL-TAYANCH.md` 1.7 (aynan); to'lov taklifi ekrani va narx — 1.4; Pro, avtomatik yechish yo'q — 1.0; teg — 3; kalitlar — 8; qarorlar — `GATE_M_JAVOB.md` Qaror-0 6, 13.
- Lending va Netlify (push'dan keyin odatda o'zi yangilanadi), APK o'zi yangilanmaydi, brauzer ko'rinishi — qayta eksport: 12-Modul tayanchi 1.1, 1.7, 9.28. Tekshiruv akkaunti: 12-Modul 9.35 a, 9.37 g. «[savol]» naqshi: 12-Modul 9.39 f. Siyosat matni: 12-Modul 7-dars A2, 9.41 a.
- Tashqi xizmat qadami (tugma, menyu, narx, limit) bu darsda yo'q — Netlify va Expo Go faqat 12-Moduldagi so'z bilan; Click, Payme, Stripe tilga olinmaydi.

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Siyosat to'lov bandi ikki savolga bo'lindi** — tayanch: «… «Qaysi ma'lumot?» va «Nima uchun?» savollariga: «Karta ma'lumotini … Pro'ni yoqish uchun.»». Bo'lishim: «Qaysi ma'lumot?» — birinchi gap + «Biz saqlaymiz: to'lov raqami, summa, sana va Pro muddati.»; «Nima uchun?» — «To'lov raqami, summa, sana va Pro muddati — Pro'ni yoqish uchun.» (12-Modul «Nima uchun?» shakli: «X — … uchun»).
   So'zlar tayanchdan; «To'lov raqami, …» ikkinchi joyda takrorlanadi. Muqobil: bandni so'zma-so'z bitta joyda — «Qaysi ma'lumot?» ostida.
2. **«Maxfiylik siyosati» havolasi to'lov taklifi ekranida ham** — Qaror-0 13: «Ikkalasiga havola — lendingda va to'lov taklifi ekranida»; tayanch 1.7 va 3 da faqat «Pro shartlari». Qaror-0 ni oldim (lendingda siyosat havolasi 12-Moduldan bor).
3. **Havolalar joyi** — «To'lovga o'tish» ostida, «Test rejim» qatoridan yuqorida, ikkalasi bir qatorda. Tayanchda joy yo'q.
4. **`pm-m11d7-hujjat` aniqlashtirish:** `bandlar[].id` — `kim · nima · narx · tugasa · qaytarish · aloqa`; `savol` — matnda «[savol]» qolganmi; `havolalar.*` va `chiqdi` — `bool | null` (tayanchda `bool`; `null` — tekshirilmagan, sinf 3); `siyosatBand` — o'quvchi qatori yoki `null`.
   Sahifa nomi `{nom}` kalitda yo'q (dars progressida). 11-dars ofertani nomi bilan ko'rsatishi kerak bo'lsa — `nom: string | null` maydoni qo'shiladi.
5. **`pm-m10d1-lending.manzil` o'qiladi** (Amaliyot 2 `{lending manzili}`) — tayanch 8 da 7-dars o'qiydigan kalitlar ro'yxatida yo'q; yo'q bo'lsa o'quvchi Netlify'dan nusxalaydi. `pm-m9d8-platforma.trek` — tayanch 4 umumiy qoidasi bo'yicha.
6. **Halollik gapiga qisqartma ochilishi qo'shildi** — «… yuridik shaxs yoki YaTT (yakka tartibdagi tadbirkor) bilan; bu kursda emas.» (T-036: qisqartma birinchi ko'rinishida). Tayanch va TAQIQLAR 1 dagi gap qavssiz. «Yuridik shaxs» o'quvchi matnida izohsiz qoldi (Shubhali 7).
7. **O'quvchi ofertasining band sarlavhalari** — Mentor nomlari bilan, 4-band — «{nom} tugasa» (Mentor: «Pro tugasa»); 1, 5, 6-bandlar matni hamma o'quvchida Mentor matni bilan bir (kvadrat qavsli). 3-band qolipi: «{davr} kun, {narx} so'm; muddat tugagach {nom} o'zi to'xtaydi, pul avtomatik yechilmaydi».
8. **2-ekrandagi tashkilotchining olti savoli** — tayanchda yo'q; Mentor ofertasi bandlaridan yig'ildi (Aloqa — savolsiz, 4-ekranda). Javob kaliti Mentor to'lov taklifi ekrani matnidan (2 bor, 4 yo'q).
9. ✅ (07.10 hal qilindi — tayanch 9.26: Pro tugashi 5-dars 1-amaliyotida quriladi, 4-band kodda bor; 12-darsning 5-topilmasi — doimiy o'yinning takror yaratilishi) **Mentor ofertasining 4-bandi va 12-dars** — 1.7: «Pro tugasa — … yangi o'yin o'zi e'lon qilinmaydi»; 1.12: «Pro muddati tugagan tashkilotchining «Doimiy o'yini» yana e'lon qilindi» — 12-darsgacha tuzatilmaydi. Demak `m13-dars-07-done` da 4-band bir holatda kodga mos emas.
   Amaliyot 1 da agent 4-bandni kod bilan solishtiradi: (a) topmasa — kutilgan natija «mos» deydi, 12-dars topadi (hozirgi MD; O'qituvchi eslatmasida «ishlatib ko'rilmagan»); (b) topsa — Mentor 4-bandda «[savol]» qo'yishi va 12-dars topilmasi o'zgarishi kerak. Qaror kerak; «qur» da Mentor repo'sida agent javobi bilan tekshiriladi.
10. ✅ (07.10 hal qilindi — tayanch 1.7, 9.29: bandga kim to'lagani va holat qo'shildi) **Siyosat bandi va `tolovlar` ustunlari** — band «to'lov raqami, summa, sana va Pro muddati»ni sanaydi; `tolovlar` da yana `holat` (to'landi / rad) va `oyinchi_id` (qaysi hisob) bor. Agent kod bilan solishtirganda buni aytishi mumkin. Taklif: «Biz saqlaymiz: to'lov raqami, holati, summa, sana, qaysi hisobga tegishli va Pro muddati.»
    Shuningdek «uni to'lov xizmati qabul qiladi» — bugun mashqda karta umuman so'ralmaydi; taklif: siyosatga «Hozir to'lov — test rejimda: karta so'ralmaydi.» qatori (sinf 16: faqat hozir ishlaydigan narsa).
11. **Ilova o'zgarishi va yangi versiya** — to'lov taklifi ekranidagi havolalar `mobil/` da; o'rnatish fayli (APK) va brauzer ko'rinishi o'zi yangilanmaydi. Bu darsda yangi versiya tayyorlanmaydi (tayanchda yo'q; 12-dars — 1.12 A3). O'quvchiga halol qator (7-ekran). 4, 5-darslar bilan bitta qaror kerak (ular ham ilovani o'zgartiradi).
12. **Tekshiruv akkaunti (Pro'siz)** — to'lov taklifi ekrani faqat Pro'siz hisobda ochiladi (tayanch 1.4); 4–5-darslarda o'quvchi hisobida Pro yoqilgan bo'lishi mumkin. Yo'l: ro'yxatdan o'tish formasida «tekshiruv» hisobi → tekshiruv → «Hisobni o'chirish» (12-Modul 9.35 a, 9.37 g). Mahsulotda «Hisobni o'chirish» bo'lmasa — agent `id` bo'yicha `WHERE` bilan o'chiradi (tayanch 7 sinf 10).
13. **Uyga vazifa ②** — bitta tanish odam (ota-ona yoki sinfdosh) ofertani o'qiydi va «qaysi joyi tushunarsiz?» savoliga javob beradi. Tayanchda 7-dars uyga vazifasi yozilmagan; PM+PRAKT darsida uyga vazifa bor (tayanch 4).
14. **Modeli reklama yoki B2B bo'lgan o'quvchi** — to'lovchi foydalanuvchi emas; 5-ekran Yordamida: «bandlarni 4-darsdagi to'lov taklifi ekraningiz uchun yozing». 4-dars MD si bu holatni qanday hal qilganiga qarab moslanadi.
15. **`oferta.html` da Umami yo'q** — «sahifa hech qanday ma'lumot yig'masin va tashrifni sanamasin» (shartlar sahifasi ochilishini sanash tayanchda yo'q). Kerak bo'lsa — siyosatga ham qator kerak bo'ladi.
16. **5-ekrandagi tekshiruvlar** — telefon/akkaunt/karta — bloklaydi; va'da va kafolat so'zlari — yumshoq. Ro'yxat tayanchda yo'q; 6-dars pilot tekshiruvlari naqshida.
17. **Reja ekrani pastki qatori** — «repo — o'z repo'ngiz · Mentor misoli `maydon-jamoa` · namuna `m13-dars-07-done`» (10-Modul naqshi); pilot 06 da bu qator yo'q edi (repo'siz dars).
18. **Arena 9 — kitob almashish ilovasi** (ikkinchi misol, P-002) va 3-ekran — uy vazifalari ilovasi: 12-Modul testlari olami.

## Shubhali joylar (ishonchim komil emas)
1. ⛔ **90 daqiqa** — Amaliyot 2 ≈ 22 daqiqa ichida: siyosat bandi, ikki havola (lending va ilova), push, Netlify kutishi, telefonda uch tekshiruv va kerak bo'lsa tekshiruv akkaunti. Bu — reja: «qur» pilotida 12–15 o'quvchi bilan taymer bilan o'lchanadi; sig'masa — (3)-tekshiruv uyga ko'chadi (foydalanuvchi qarori).
2. ✅ (tayanch 9.26) **4-band va 12-dars** (TAYANCHGA SAVOL 9) — Mentor misolining ichki izchilligi (sinf 12) shu javobga bog'liq; agent haqiqatan nima deyishi «qur» da ko'riladi.
3. ⛔ **Siyosat bandi `tolovlar` bilan to'liq mos emas** (TAYANCHGA SAVOL 10) — agent «[savol]» qoldirsa, 7-ekran kutilgan natijasi bilan farq qiladi.
4. ⛔ **Ilovadagi havola telefon brauzerida ochilishi** — Expo Go'da (Android va iPhone) va saytda yangi oynada — «qur» da sinaladi; usul agentning tanloviga qoladi.
5. **Netlify yangilanishi** — «push'dan keyin odatda o'zi yangilanadi» (12-Modul 9.28); kutish vaqti o'lchanmagan — «bir necha daqiqa cho'zilishi mumkin». Web-trek saytining yangilanishi — o'quvchi 11-Modulda qanday chiqargan bo'lsa (umumiy so'z, aniq qadam yozilmadi).
6. **369-modda matni** — iqtibos tayanchdan; sahifaning o'zida sarlavhasini ko'rdim, matnini o'qiy olmadim (Manbalar). O'quvchi matnida faqat «ommaviy oferta (369-modda)» va sodda ta'rif.
7. **«Yuridik shaxs»** — 13 yoshli tushunmasligi mumkin; o'quvchi matnida izohsiz (faqat O'qituvchi eslatmasida «ro'yxatdan o'tgan tashkilot»). Kartochka 6 izohida faqat YaTT ochilgan.
8. **«Odam to'lasa — shu shartlarga rozi bo'ladi»** — tayanchning sodda ta'rifi; mashqda to'lov yo'q, shuning uchun gap real ishga tushirish holatini tasvirlaydi. Auditor «mashqda hech kim rozi bo'lmaydi-ku» deyishi mumkin — sahifa tepasidagi «Mashq hujjati» qatori shuni ochiq aytadi.
9. **Agent «o'zingdan gap qo'shma» ga amal qiladimi** — prompt ko'rsatmasi; o'quvchi baribir har gapni kodda ko'radi (4-qadam (2)). Kodni o'qish — ishlatib ko'rish emas (6-ekran izohi).
10. **Yumshoq tekshiruvlar** (va'da, kafolat so'zlari) erkin matnda noto'g'ri ishlashi mumkin; bloklamaydi. `node` sinovida namunalar bilan (KOD 7).
11. **Arena 7 «Ota-ona yozma roziligi va sotuvchi»** — «sotuvchi» qisqa: to'liq javob (yuridik shaxs yoki YaTT) kartochka 6 da; savolda qisqartma ishlatilmadi (S-020).
12. **Hook javobi «Odam ularning javobini qayerdan topadi?» savol bilan tugaydi** — keyingi bo'limga ko'prik; «javob yo'q» oldindan aytilmaydi (P-036).

## Oldindan tuzatiladigan sinflar — o'z tekshiruvim (tayanch 7: 16 band + 12-Modul tayanchi 7 + 13-Modul pul sinflari)
1. [x] **90 daqiqa — reja, o'lchov emas** — A-11 taqsimot va ulgurmagan yo'l (Amaliyot 1 — 3-qadamdan, Amaliyot 2 — 2-qadamdan keyin «Davom etish»); Netlify kutishi oqimni to'xtatmaydi; ⛔ pilotda taymer (Shubhali 1); «sig'adi» deyilmaydi.
2. [x] **Tekshirilmagan tashqi qadam — «qur» darvozasi** — Expo Go'da havola (Shubhali 4), Netlify yangilanishi («odatda», 12-Modul 9.28), Mentor repo'sida agent javobi (REPO 6) — ⛔ belgilangan; Netlify va Expo tugma nomlari yozilmadi.
3. [x] **Saqlash kaliti — shartnoma** — A-12: har maydon, tipi, `id` barqaror, `savol` ma'nosi, `bool | null` uch holat, kim yozadi (5-ekran, Amaliyot 1, 2), kalitga ism, telefon, karta yo'q; boshqa darsning kaliti faqat o'qiladi; `pm-m10d1-lending` o'qilishi — TAYANCHGA SAVOL 5.
4. [x] **Mentor misoli va kurs qolipi — umumiy qoida emas** — «Mentor misolida», «Bu mashqda», «Bu misolda» (2, 4-ekran xulosalari); olti band — «kurs shabloni» (4-ekran O'qituvchi eslatmasi, kartochka 4); o'quvchi band matni va nomi o'zida (5-ekran).
5. [x] **Kafolat va sabab da'vosi yo'q** — agentning «mos» degani da'vo (6-ekran `QIzoh`); «saytda» — faqat «Ochildi» tanlanganda (7-ekran, yakun); «qonunga mos», «yurist tekshirgan» yo'q; Pro haqida «o'zi to'xtaydi» — Mentor misolida (tayanch 1.0, 1.7), o'quvchida agent kod bilan solishtiradi.
6. [x] **Yakun, «Bajardim», yashil xabar, nishon — faqat rost holatda** — yakun besh holat (11-ekran; E 54); Amaliyot 1, 2 yashil xulosasi — ikki holat; «Terms Live!» tavsifi tekshiruvni aytadi, «saytda» demaydi; blok bajarilgani — 4-qadam «Bajardim»idan.
7. [x] **Ta'rif sanaladigan va amaliyotga mos** — oferta ta'rifi dars bo'yi so'zma-so'z; «bugun yoziladi» — ilovada bugun bor narsa (4-ekran xato izohlari shuni so'raydi); `chiqdi` — internetdagi manzilda ochilgani (o'quvchi ko'rgani).
8. [x] **Test: bitta himoyalanadigan javob** — 3, 8-ekran va arena: distraktorlar uch xil turkumdan (Izoh qatorlari), hayotda rost bo'lib qoladigan variant yo'q (arena 4 «Pro bepul» varianti olib tashlandi — yolg'on fakt edi), inkor-savol yo'q, to'g'ri javob yolg'iz eng uzun emas (O'lchov).
9. [x] **Real odamlar xavfsizligi** — real suhbat va tasdiq yo'q; uyga vazifa ② — faqat tanish odam (ota-ona yoki sinfdosh); ofertaga telefon, Telegram nomi yozilmaydi (5-ekran bloki, yakun kulrang qatori); tekshiruv akkaunti — «tekshiruv», familiyasiz, o'chiriladi; sinfda sanash yo'q (Mentor statistikasida matn yo'q).
10. [x] **Tekshiruv — o'quvchining o'z yo'li, agent — zaxira** — bandlarni kodda o'quvchi o'zi ko'radi (6-ekran 4-qadam); havolalarni telefonda o'zi ochadi (7-ekran 4-qadam); tekshiruv akkauntini o'zi ochadi va o'chiradi; agent — faqat yozadi va dalil ko'rsatadi.
11. [x] **Web-trek teng yo'l** — Amaliyot 1 ikkala trekda bir; Amaliyot 2 — `{to'lov taklifi ekrani}` va «Ochish» gapi trekdan; o'quvchi matnida «mahsulotingiz»; web-trek sayti yangilanishi to'qilmadi (Shubhali 5).
12. [x] **Mentor misoli ichki izchil** — oferta, siyosat bandi, to'lov taklifi ekrani — tayanch 1.4, 1.7 aynan; keyingi darslar sonlari ochilmadi; 4-band va 12-dars ziddiyati 07.10 hal qilindi (tayanch 9.26); yashirilmadi (TAYANCHGA SAVOL 9), siyosat bandi va `tolovlar` farqi (TAYANCHGA SAVOL 10).
13. [x] **O'quvchi talabida Mentorning qarori yo'q** — o'quvchi talabida nima beriladi, muddat tugasa nima bo'ladi, to'lovda nima saqlanadi — `{…}` va 5-ekranda o'quvchidan; koddan bilinmagani — «[savol]»; Mentor qarorlari faqat «Yordam»da.
14. [x] **Uyga vazifa yengil va aniq** — ikki band; ① faqat qolgan ish bo'lsa; ② — bitta odam, bitta savol; muddat — keyingi darsgacha.
15. [x] **Ayb da'vosi yo'q** — xato yo'li: «Shu xato chiqdi: {xato}. Tuzat.», «Ochilmadi» → aniq agent gapi va qayta ochish; «xatongiz emas», «sizda emas» yo'q.
16. [x] **Kelajak va'dasi yo'q** — oferta, lending, to'lov taklifi ekranida faqat hozir ishlaydigan narsa (4-ekran, 5-ekran tekshiruvi, 3-ekran A distraktori, arena 5); 7-ekran kulrang qatori — fakt («o'zi yangilanmaydi»), va'da emas; keyingi darslar aytilmaydi.
- [x] **12-Modul tayanchi 7 (14 band)** — holatga qarab yakun (11-ekran) · da'vo isbot emas (6-ekran `QIzoh`) · maxfiy qiymat agentga chiqmaydi (`.env` ga tegma, xato qatorida kalit yo'q) · tashqi xizmat — faqat 12-Modul so'zi (Manbalar) · har sonning manbasi («Mentorning taxmini») ·
  tayanchda yo'q narsa — TAYANCHGA SAVOL (18 band) · kalit o'qiydigan darsdan (11-dars) · test bitta javob · keys — [—] keyssiz · 90 daqiqa · bir ma'no — bir so'z (A-5) · web-trek teng · agent va o'quvchi ishi ajratilgan (A-10) · o'smir xavfsizligi (A-9).
- [x] **13-Modulga xos (pul)** — real pul yo'q (A-9; oferta tepa qatori; 4-ekran halollik qatori) · karta ma'lumoti hech qayerda (5-ekran va Amaliyot 2 tekshiruvi bloklaydi; oferta sahifasida forma yo'q; maketda karta maydoni yo'q) · «mashq to'lov» taqlid qilinmaydi — bu darsda faqat «avvalgidek ishlasin» deb tilga olinadi ·
  «Test rejim: pul yechilmaydi» har to'lov taklifi ekrani maketida (0, 1, 2, 5, 7-ekran) · narx — «Mentorning taxmini» (A-6, 0, 4-ekran) · suhbat va tasdiq — [—] bu darsda yo'q · **oferta — shablon, «Mashq hujjati», «Bu hujjat yuridik maslahat emas.»** (4, 6-ekran, kartochka 10).

## O'lchov — `md07/olchov.py` natijasi (qavsdagi sonlar skript bilan qo'yilgan: har sanaladigan matn belgilab olinib, uzunligi avtomatik yozildi)
```
Belgilar soni — bo'shliq bilan, ** siz (Python len). Qavsdagi uzunliklar: 127 ta — hammasi skript qo'ygan, qo'lda son yozilmagan (arena savollari ortidagi qavs — ekran raqami).
Sarlavhalar (13 ta, yakunning 5 holati bilan): 25–51 · ≤55, hammasi bitta qator.
Xulosalar: 2-ekran 103 · 4-ekran 87 · 5-ekran 72 / 65 · ≤110.
Bloklar yashil xulosasi: Amaliyot 1 — 56 / 50 · Amaliyot 2 — 67 / 54.
QIzoh qatorlari: 94 (2-ekran, atama) · 87 (4-ekran) · 67 (Amaliyot 1). Ipucha: 56 · 41.
Bugungi asosiy fikr (A-2, yakunda ko'rsatilmaydi): 106 · ≤110.
Hook javobi: 99 · ≤120 (sof so'rovnoma — uchala variantga bitta javob); hook variantlari 30 · 34 · 32.
To'g'ri izohlar: 3-ekran 42 · 8-ekran 58 · ≤60.
Xato izohlari, QXato va forma tekshiruvlari (26 ta): 35–60 · ≤60 (eng uzuni — 2-ekran 3-savol, 60).
Kulrang qatorlar: 1-ekran 53 · 4-ekran halollik qatori 128 (tayanch gapi, qisqartirilmaydi) · 5-ekran 75 · Amaliyot 1 42 · Amaliyot 2 (mobil) 120.
Nishon tavsiflari: 45 · 35 · 39 · 43 · ≤48 (KORPUS §63).
Mentor gaplari (`mentor.py`): kirish 2 gap (130) · reja 2 gap (135) · interaktiv 2, 4, 5-ekran va bloklar — 1 gap (71–123);
  sarlavha so'zlari Mentorda (4+ harfli so'zlar): 0/5 · 1/6 · 0/5 · 1/7 · 0/3 · 0/5 · 0/5 — hech qayerda ≥50% emas; «Bu…», «Hammasini…» bilan boshlanmaydi.
Test savollari: 3-ekran 9 so'z · 8-ekran 7 so'z · arena 3–7 so'z · ≤12.
3-ekran: A 41 · ✔B 37 · C 42 · D 41 | min/max 37/42 (+14%) | o'rtachadan eng katta og'ish 8%
8-ekran: A 43 · B 46 · ✔C 42 · D 45 | min/max 42/46 (+10%) | 5%
arena 1: ✔A 37 · B 36 · C 38 · D 35 | +9%
arena 2: A 34 · ✔B 30 · C 31 · D 32 | +13%
arena 3: A 32 · B 31 · ✔C 31 · D 30 | +7%
arena 4: A 34 · B 35 · C 33 · ✔D 35 | +6%
arena 5: ✔A 39 · B 40 · C 38 · D 38 | +5%
arena 6: A 34 · ✔B 35 · C 37 · D 38 | +12%
arena 7: A 33 · B 32 · ✔C 34 · D 35 | +9%
arena 8: A 32 · B 32 · C 34 · ✔D 31 | +10%
arena 9: ✔A 34 · B 35 · C 34 · D 32 | +9%
arena 10: A 36 · ✔B 37 · C 36 · D 41 | +14%
arena 11: A 34 · B 38 · ✔C 36 · D 36 | +12%
arena 12: A 30 · B 34 · C 31 · ✔D 32 | +13%
To'g'ri variant hech bir testda yolg'iz eng uzun emas.
ARENA ✔ taqsimoti: {'A': 3, 'B': 3, 'C': 3, 'D': 3}
```
`npm run lint:til feedback/F-1007-13modul/07-PmTerms-v3.md` — **0 error, 0 warn** (birinchi yurishda 1 error va 3 warn: lex.uz iqtibosidagi qiyshiq apostrof oddiy shaklga keltirildi; vizual tavsifidagi bitta fe'l almashdi; agent promptidagi bitta tire vergulga almashdi).

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi (205): App.jsx 450–452 (grep 07.10) — `m11-06` «Pul haqida qanday gaplashasiz?» → **`m11-07` «Foydalanuvchiga shartlarni qanday ochiq aytasiz?»** (osti «oferta va maxfiylik siyosati saytda» — 1-ekran chap yorlig'i so'zma-so'z) →
  `m11-08` «Loyiha kuni: ketayotgan foydalanuvchini qaytarish» (yakundagi «Keyingi dars» qatori).
- [x] Bitta misol-ip — «Maydon Jamoa» (to'lov taklifi ekrani, Mentor ofertasi, siyosat to'lov bandi — tayanch 1.4, 1.7); ikkinchi misol faqat testlarda (uy vazifalari, kitob almashish ilovasi — P-002); keyssiz; metafora yo'q; bitta vizual — `ShartlarSahna` (telefon · brauzer · chiziq).
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish»: 2 (tugma → telefondagi qator yonadi yoki karta «Shartlar» varag'iga uchadi), 4 (tugma → band matni brauzerdagi joyiga uchadi) + 0, 5, 6, 7; testlarda javobdan keyingi kichik vizual. «bosish → matn-karta» yo'q.
- [x] O'lchov (python, `md07/olchov.py`, `mentor.py`): sarlavha 25–51 · Mentor ≤2 gap (interaktivda 1), sarlavhani takrorlamaydi · xulosa ≤110 (65–103) · hook javobi 99 · to'g'ri izoh 42–58 · xato izohi 35–60.
- [x] Atamalar oldingi darslar bilan bir (grep, tayanch 2): Pro, «Doimiy o'yin», narx, to'lov taklifi ekrani, test rejim, mashq to'lov — 13-Modul · maxfiylik siyosati, to'rt savol, «[savol]», lending, «Hisobni o'chirish» — 10, 12-Modul · agent, prompt, talab — 11-Modul ·
  yangi: oferta, band, real ishga tushirish — misoldan keyin, ta'rif dars bo'yi bir xil · siz-forma; tugmalar ot-shaklda yoki siz-formada («Ekranda bor», «Bugun yoziladi», «Hali bilmayman», «Saqlash», «Ochildi»). Agentga prompt — buyruq shaklida (T-002).
- [x] Testlar: 4 variant, bir shaklda, farq ≤15% (5–14%); to'g'ri javob yolg'iz eng uzun emas; kalit so'z faqat to'g'rida emas («[savol]» 8-ekranda savolda va B da); inkor-savol yo'q; javobda savoldagi so'z takrorlanmaydi · ✔ o'rni 3-ekran B, 8-ekran C (yangi dars) · arena A·B·C·D ×3.
- [—] Final tartib-mashqi yo'q (PM + amaliyot darsi; yakuniy — `QTest`), uya izohi bandi tegishli emas.
- [x] Emoji yo'q (o'yin qatlami mustasno; ✓ ✕ › ✎ — belgilar) · kafolat so'zlari yo'q («har doim», «hech qachon», «darrov», «albatta», «100%» — o'quvchi matnida faqat 5-ekran tekshiruvi ro'yxatida, aniqlanadigan so'z sifatida) · xulosalar «Bu misolda», «Bu mashqda» bilan chegaralangan.
- [x] Ichki kodlar o'quvchi matnida yo'q (`m11-07`, «A1», «Modul 13», K-raqam yo'q; bloklar — «Amaliyot 1», «Amaliyot 2»; modul raqami LMS bo'yicha — «12-Modulda», «4-darsda»); qonun — kartochka 1 izohida va O'qituvchi eslatmasida, manba bilan; «KOD» ro'yxati 14 band, REPO 7 band.
- [x] Karta T · P · S · PM: T-002 (agent promptlari) · T-008 (tashkilotchi savollari, oferta va siyosat matni — olam ichidagi matn) · T-011/PM-030 (oferta — 2-ekran oxirida; band, real ishga tushirish — 4-ekranda) · T-014/T-015 (A-5: shart, ekran, band, sotuvchi, havola) · T-016/T-017 (metafora yo'q) · T-020 · T-024 ·
  T-029/T-047 · T-036 (YaTT ochildi) · T-038 (keyingi darslar va'da qilinmaydi; 7-ekran kulrang qatori — fakt) · T-039 («ofertangiz» — 5-ekrandan keyin; «ilovangizda» — 3-ekran ikkinchi misolda, pilot 06 naqshi) · T-042 (oferta ta'rifi so'zma-so'z: A-4, yakun, kartochka) · T-043 · T-045 («Odam to'lasa — rozi bo'ladi»; mashq chegarasi «Mashq hujjati» bilan) · T-048 · T-049 · T-052 · T-064 (dars ekranlari «ekran» deb atalmaydi) · T-070 ·
  P-001 · P-002 · P-004 (5, 6, 7 — o'z mahsuloti) · P-008 · P-012 (testlar 3, 8 ketma-ket emas) · P-013 · P-014/P-015 · P-016 · P-025 · P-026 · P-028 (tashqi tugma nomlari yozilmadi) · P-033 · P-036 · P-046 · P-048 · P-052 · P-055 · P-059 · P-062 · P-064 · P-067 ·
  S-001 (savollar 3–9 so'z) · S-002/S-004/S-010 · S-006 · S-008 · S-015 · S-019 · S-020 (ballik matnda YaTT ishlatilmadi) · S-026 · S-027 · §102 · §106 · §119 · §144/§145 · PM-005 (aralash) · PM-018 · PM-020 (3-band qolipi to'liq gap) · PM-021 · PM-027 · J-026 · SABOQ 1–39, E 40–55.
- [x] Pul va halollik (TAQIQLAR 1, 3; Qaror-0 6, 13): real pul yo'q; oferta — shablon, «Mashq hujjati — real to'lov qabul qilinmaydi», «Bu hujjat yuridik maslahat emas.»; sotuvchi qatori «[real ishga tushirishda — yuridik shaxs yoki YaTT]»; halollik gapi darsda bir marta (4-ekran) va kartochkada;
  qonun — «FK 369-modda», «FK 27-modda» + lex.uz faqat MD da, o'quvchi matnida «qonunda», «qonunchiligida»; karta ma'lumoti hech qayerda; «Test rejim: pul yechilmaydi» har to'lov taklifi ekrani maketida; narx — «Mentorning taxmini»; ofertaga telefon va Telegram nomi yozilmaydi.
- [ ] ⛔ «qur» darvozalari ochiq: TAYANCHGA SAVOL 9, 10 — 07.10 hal qilindi (tayanch 9.26, 9.29), Shubhali 1 (90 daqiqa), 4 (ilovadagi havola) — foydalanuvchi qarori va pilot kerak.
