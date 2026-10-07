# 11-Modul · 7-dars «Jonli prototip: qog'ozdan bosiladigan ekrangacha» — MD v3

Fayl: `src/9-Modull/LivePrototypeLesson.jsx` (kalit `m9-07`, App.jsx `type: 'Kod'`) · **20 ekran** (15 dars ekrani + 2 amaliyot bloki + podium, kartochkalar, yakun) · faqat o'zbekcha (ru — 6-RU bosqichida)
Dars yangi — hamma ekran noldan, to'liq yozildi. TEX (modulning texnik cho'qqisi), keyssiz. Qolip: texnik dars (QTushuncha, QKod, QTest, QMustaqil, QTartib) + 2 amaliyot bloki (QBlok).
Menyu nomi (DE-205, App.jsx `m9-07`): «Jonli prototip: qog'ozdan bosiladigan ekrangacha» · osti «wireframe → talab → bosiladigan prototip» ·
oldingi `m9-06` «Bitiruvgacha nimani qachon qurasiz?» · keyingi `m9-08` «Arxitektura va platforma: web yoki mobil ilova».
Namuna: 9-Modul `05-Animation-v3.md` (tuzilish, QKod, takrorlash) · `04-MvpArchitecture-v3.md` (bloklar) · `08-PmDesignMotion-v3.md` (talab tanlash mexanikasi).
Fidbek: qator yoniga `>> …` yozing. Tasdiqlangach (GATE M) dars shu holatda quriladi — `.jsx` ga hozir tegilmaydi. ⚠️ Testlarda to'g'ri javob O'RNI (shu MD dagi ✔) qurilgandan keyin o'zgarmaydi.
Testlar: 4-ekran **B** · 7-ekran **C** · 9-ekran **A** · 13-ekran **D** · 14-ekran (final tartib, sentinel `0`) · arena A·B·C·D ×3.
Vaqt: ≈ 90 daqiqa — 0–4 ≈ 12 · 5 (qog'ozda) ≈ 17 · 6–14 ≈ 25 · A1 ≈ 20 · A2 ≈ 12 · podium, kartochkalar, yakun ≈ 5.

---

## A. Darsning tayanchi — tushunchalar, atamalar, misol-ip, bitta vizual (163/180)

1. **Bitta natija (dastur v9 · tayanch 4):** dars oxirida o'quvchida **o'z final repo'si** bor (GitHub'da o'zi ochgan, `git clone` qilingan, Qaror-0 6), unda `prototip/` —
   qog'ozdagi wireframe'dan qurilgan **jonli prototip**: 2–3 ekran bosiladi, ma'lumot namuna, uch animatsiya; `README.md` da talab va wireframe surati.
   Mentor misoli — «Maydon Jamoa», repo `maydon-jamoa`, teg `m11-dars-07-done` (tayanch 3; `m11-dars-07-start` = `main`, bo'sh README).
2. **Bugungi asosiy fikr (P-013):** Qog'ozdagi wireframe ekranni agentga aniq ko'rsatadi; namuna ma'lumot va animatsiya uni Backend'siz bosiladigan, jonli prototipga aylantiradi.
3. **Oldingi darsdan keladigan narsa** (tayanch 1.4–1.5, aynan): PRD dagi uchta asosiy funksiya; roadmap'da birinchisi — **o'yin e'loni va qo'shilish**
   («tashkilotchi e'lon beradi (kun, soat, maydon, nechta odam kerak); o'yinchi «Qo'shilaman» ni bosadi; «8 / 10» o'zgaradi»). Bugungi prototip — shu funksiyaning ekranlari
   (tayanch 1.6: uch ekran). Darsda funksiya **nomi bilan** aytiladi (F1/F2/F3 — faqat MD/kodda). O'quvchining o'z PRD si — `pm-m9d5-prd` (5-ekran o'qiydi).
4. **Atamalar (bir ma'no — bir so'z, T-014; tayanch 2-bo'lim, aynan):**
   - **wireframe** — ekranning qog'ozdagi sodda chizmasi: qayerda nima turadi; bugungi mashqda rang va shrift tanlanmaydi — bu ta'rif qismi emas, mashq qoidasi (07-FILTR 4) (3-ekranda, saralashdan **keyin** tug'iladi; T-011). Undan oldin — «qog'ozdagi chizma».
     «eskiz», «maket» (wireframe ma'nosida) o'quvchi matnida yo'q. «chizma» so'zi bu darsda faqat qog'ozdagi chizma ma'nosida (8-darsdagi arxitektura chizmasi bilan aralashmaydi).
   - **prototip** — bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar (6-ekranda, harakatdan keyin). **jonli prototip** — animatsiyasi bor prototip (11-ekranda). «MVP», «demo-versiya» — prototip ma'nosida yo'q.
   - **Figma** — ekran dizayni chiziladigan dastur; o'quvchi matnida **bir marta** (5-ekran Mentor gapi; dastur nomi «Figma o'rniga jonli prototip»). Kartochka va arenada yo'q.
   - **talab** — agentga yoziladigan matn: qayerda · nima qilsin · nima buzilmasin (9-Moduldan; 8-ekranda bir gap bilan tenglashtiriladi, T-052). PRD ma'nosida «talab» yo'q (T-015).
     Blokning 2-qadam nomi platforma standartida «Prompt» qoladi, ichidagi matn — talab (9M-08 kelishuvi).
   - **namuna ma'lumot** — haqiqiy emas, misol uchun yozilgan ma'lumot; prototipda `prototip/src/namuna.js` faylida (tayanch 3).
   - **ekran** — ilovaning bitta ko'rinishi: **O'yinlar** · **O'yin** · **E'lon berish** (tayanch 1.6, aynan). «sahifa» — faqat brauzer sahifasi ma'nosida («sahifani yangilang»).
   - **o'yin kartasi** (qisqasi **karta**) — O'yinlar ekranidagi bitta e'lon: kun, soat, maydon, «8 / 10». Kartochka (takrorlash) bilan aralashmasligi uchun o'quvchi matnida «o'yin kartasi» yoki «karta».
   - **tashkilotchi · o'yinchi** — ismsiz (tayanch 1). **qo'shilganlar** — O'yin ekranidagi doiralar (ism yo'q). Tugma nomlari: «Qo'shilaman» · «E'lon berish» (O'yinlar ekranida) · «Yuborish» (forma).
   - **animatsiya**, **`transform`**, **`transition`**, **Motion** — 9-Modul `m7-05` va `m7-08` so'zlari, yangi qoida o'rgatilmaydi (faqat eslatma va qo'llash). Motion — «Motion» (oldingi nomi bu modulda aytilmaydi).
   - **agent** — Antigravity · **repo**, **GitHub**, `git clone`, `git push` — oldingi modullardan. **tekshirish** — o'z ishini ko'rish (sinov — faqat real odam bilan; bu darsda sinov yo'q).
5. **Uch animatsiya (tayanch 1.6, aynan):** 1) karta bosilganda kichrayib qaytadi (`transform` + `transition`) · 2) «Qo'shilaman» dan keyin «8 / 10» → «9 / 10» silliq o'zgaradi
   (bu darsda: son almashadi va bir lahza kattalashib, silliq joyiga qaytadi — `transform` + `transition`; TAYANCHGA SAVOL 5) · 3) ekrandan ekranga o'tish (Motion).
6. **Talab (tayanch 1.6, aynan):** qayerda — `prototip/` · nima qilsin — uch ekran wireframe suratidagidek, namuna ma'lumot bilan, bosiladi · nima buzilmasin — haqiqiy ma'lumot va Backend yo'q.
   Agent promptlari — T-002 istisnosi (sen-buyruq: «yarat», «tegma», «ayt»). Xato yo'li har blokda bitta gap: «Shu xato chiqdi: {xato}. Tuzat.»
7. **Platforma hali tanlanmagan** (8-dars): prototip vaqtincha brauzerda — React (Vite) + Motion; bu final platforma (web yoki mobil) tanlovini majburlamaydi (07-FILTR 1), namuna ma'lumot, 2–3 ekran bosiladi (Qaror-0 8). O'quvchi matnida platforma tanlovi va'da qilinmaydi (T-038) — faqat «Keyingi dars» qatorida.
8. **Metafora yo'q.** Qahramon yo'q — vazifani Mentor beradi; odamlar — tashkilotchi, o'yinchi. Keys yo'q (TEX, Qaror-0 17).
9. **Toza yuza (185, D4):** tugma, variant, karta, yorliq va maketlarda emoji yo'q; telefon ramkasi va qog'oz chizilgan (CSS/SVG), logotip yo'q; rang — faqat holat foni. O'yin qatlami (arena, nishon, podium) — mustasno.
10. **Manbalar (o'quvchiga ko'rinmaydi, 06.10.2026 tekshirildi):**
    - GitHub — docs.github.com, «Creating a new repository» sahifasi: 1-qadam «+» → **New repository** ·
      «Repository name» · «Choose a repository visibility» (Public / Private) · «You can create a README» · «Click **Create repository**». (1-Modul `GitLesson` ham shu nomlar bilan: «+» · «New repository» · «Repository name» · «Create repository».)
    - Motion — motion.dev/docs/react-quick-start: «Motion for React (previously Framer Motion)», `npm install motion`, `import { motion } from "motion/react"`, `AnimatePresence` — «exit animations».
      `AnimateNumber` — Motion+ (pullik) — shuning uchun son animatsiyasi `transform` + `transition` bilan (QKod, A2 talabi).
    - Antigravity — antigravity.google/docs/cli/prompting: rasm qo'yish (Ctrl+V) **faqat CLI** uchun yozilgan; Editor ichidagi agent paneli uchun rasmiy yozuv topilmadi → surat repo'ga fayl bo'lib qo'yiladi,
      ekranlar talabda so'z bilan ham yoziladi (Shubhali 1).
    - Vite — dev server odatdagi porti 5173 (vite.dev/config/server-options) — o'quvchi matnida «terminal ko'rsatgan manzil (odatda `localhost:5173`)».
    - Chrome telefon ko'rinishi — F12, Ctrl+Shift+M (9-Modul `m7-08` A1 bilan aynan).

## Darsning ipi va bitta vizual

- **Ip (P-001/004):** «Maydon Jamoa» — mahalladagi mini-futbol uchun jamoa yig'adigan mahsulot (platforma 8-darsda tanlanadi — 07-FILTR 31). O'tgan darsda roadmap tayyor: birinchi — o'yin e'loni va qo'shilish.
  Bugun shu funksiya qog'ozda chiziladi → talab bo'ladi → agent bosiladigan ekranlar quradi → uch animatsiya bilan jonli bo'ladi. O'quvchi shu yo'lni o'z mahsulotida bosib o'tadi (5-ekran, A1, A2).
- **Hook:** PRD ni agentga bitta gapda berdik → agent bitta uzun ekran qurdi → o'yin kartasi bosilsa hech narsa ochilmaydi → «ekranlar qanday bo'lishi hech qayerda chizilmagan».
- **Bitta vizual — «Maydon Jamoa» telefoni** (bitta manba `JAMOA_EKRANLAR` + `NAMUNA_OYINLAR`, 163/180): telefon ramkasi (191), ichida uch ekran, **uch holatda** — bir xil joylashuv:
  - **qog'oz** — oq qog'oz foni, qalam chizig'i (kulrang, qo'lda chizilgandek), rangsiz; yozuvlar qo'lyozma uslubida; ekranlar orasida strelkalar.
  - **prototip** — toza ekran, namuna ma'lumot bilan, bosiladi; animatsiyasiz (hamma narsa bir zumda almashadi).
  - **jonli** — o'sha prototip + uch animatsiya (karta kichrayib qaytadi · son kattalashib qaytadi · ekranlar silliq almashadi).
  - **O'yinlar** ekrani: sarlavha «O'yinlar» · 4 ta o'yin kartasi (kun va soat · maydon · «n / m») · pastda tugma «E'lon berish».
  - **O'yin** ekrani: tepada «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · qo'shilganlar — 10 ta joy: 8 ta to'la doira, 2 ta bo'sh (uzuq chiziq, U-041) · tugma «Qo'shilaman».
    Bosilgach: «9 / 10», 9-doira to'liq bo'ladi, ostida «Siz»; tugma o'chiq holatda «Qo'shildingiz».
  - **E'lon berish** ekrani: tepada «‹ O'yinlar» · forma: Kun · Soat · Maydon · Nechta odam · tugma «Yuborish» → O'yinlar ekraniga qaytadi, yangi e'lon ro'yxatda (faqat ochiq sahifada).
  - **Namuna ma'lumot `NAMUNA_OYINLAR`** (TAYANCHGA SAVOL 3): Shanba, 18:00 · Mahalla maydoni · 8 / 10 — Shanba, 20:00 · Maktab maydoni · 6 / 10 — Yakshanba, 10:00 · Park maydoni · 4 / 8 —
    Yakshanba, 17:00 · Mahalla maydoni · 9 / 10. Ro'yxat kun tartibida, kun sarlavhalari yo'q (kun kartaning o'zida; 13-dars tuzatishi bilan to'qnashmaydi).
  - Ishlatilishi: 0 (agent qurgan bitta ekran — shu ma'lumotdan) · 1 (uch holat ketma-ket) · 2–3, 5 (qog'oz) · 6 (prototip, O'yin) · 8, 10 (qog'oz + prototip yonma-yon) · 11 (prototip → jonli) · A1, A2 kutilgan natija.
    `prefers-reduced-motion` da vizualning o'z harakati to'xtaydi (DE-200).
- **Prototip yo'li** (bitta manba `PROTOTIP_YOLI`, 1-ekran qadamlari va 14-ekran finali, P-063): Qog'ozda ekranlarni chizish · Surat bilan talab yozish · Agent qurgan ekranlarni qog'ozdagi bilan solishtirish · Uch animatsiya qo'shish.
- **Yakun:** o'z repo'ngizda jonli prototip · keyingi dars — uning ortidagi qismlar va platforma.

---

## 0 · Kirish — agent qurgan ekran  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **O'yin kartasini bosdingiz — nega hech narsa ochilmadi?** (54)
- Mentor: PRD dagi birinchi funksiyani agentga bitta gapda berdik — agent qurgan ekranda Shanba 18:00 dagi o'yin kartasini bosing.
- Maket (chap):
  - tepada agent chati, ikki pufak (T-008 — chat matni): siz → «PRD dagi o'yin e'loni va qo'shilish funksiyasini ilova qilib ber.» · Antigravity → «Tayyor! Ilova ochiladi.»
  - ostida telefon (prototip holati, lekin agent qurgan shaklda): bitta uzun ekran «Maydon Jamoa» — tepada forma (Kun · Soat · Maydon · Nechta odam · «Yuborish»),
    pastda 4 ta o'yin kartasi, har kartada «Qo'shilaman». Shanba 18:00 kartasi atrofida yengil halqa (faol element, SABOQ 11).
- **Harakat → Vizual o'zgarish:** kartani bosish → karta bir lahza bosilgandek bo'ladi, lekin hech qanday ekran ochilmaydi; telefon ostida kulrang qator chiqadi:
  «O'yin ekrani yo'q — kim qo'shilgani ko'rinmaydi». Shundan keyin o'ngdagi variantlar faollashadi (bosilmaguncha xira).
- Variantlar (radio, ballsiz):
  - Agent kodni hali oxirigacha yozmagan (36)
  - ✔ O'yin ekranini hech kim chizmagan (33)
  - Telefon bosilganini sezmay qoldi (32)
- Javob — 2-variant: **Aynan!** Bu misolda PRD da nima qilinishi yozilgan, ekranlar esa chizilmagan — ekranlar tuzilishini agent o'zi tanladi. (117)
- Javob — 1-variant: **Qiziq fikr!** Agent «Tayyor!» dedi va kod ishlayapti — lekin O'yin ekrani umuman yo'q. (84) — neytral javob, T-028 / T-067 (07-FILTR 10 tuzatildi)
- Javob — 3-variant: **Qiziq fikr!** Bosish ishladi — lekin kartaga hech qanday ekran ulanmagan. (71)
- Javobdan keyin: telefon ostidagi qatorga ikkinchi qator qo'shiladi — «PRD: nima qilinadi ✓ · ekranlar: chizilmagan». Tanlangan variant ixcham qator bo'lib qoladi (SABOQ 11).
- Ballsiz (J-026: `correct: false` hammaga). Tugma: Davom etish

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun qog'ozdan bosiladigan ekrangacha borasiz.** (47)
- Mentor: Avval Maydon Jamoa misolida ko'rasiz, keyin o'z mahsulotingiz uchun o'z repo'ngizda qilasiz.
- Chap — «Dars oxirida»: telefon bir marta o'zi o'ynaydi (DE-200): O'yin ekrani **qog'oz** holatida (qalam chiziqlari) → **prototip** holatiga o'tadi (toza, namuna ma'lumot) →
  «Qo'shilaman» bosiladi → son «8» → «9», bir lahza kattalashib qaytadi (**jonli**).
- O'ng — qadamlar (tex-karta «01 · matn · teg», bosilmaydi; `PROTOTIP_YOLI` dan; teglar App.jsx `sub` bilan — P-015):
  - 01 · Qog'ozda ekranlarni chizish · `wireframe`
  - 02 · Surat bilan talab yozish · `talab`
  - 03 · Agent qurgan ekranlarni qog'ozdagi bilan solishtirish · `prototip`
  - 04 · Uch animatsiya qo'shish · `Motion`
- Pastki qator (mono, kichik): o'z repo'ngiz — bugun ochasiz · Mentor misoli `maydon-jamoa` · tayyor holat `m11-dars-07-done`
- Tugmalar: Orqaga · Boshlaymiz
- O'qituvchi eslatmasi (platforma): telefon ko'rinishi — prototipni kichik ekranda tekshirish uchun; final platforma hali tanlanmagan (07-FILTR 32).
- O'qituvchi eslatmasi (dars hajmi): 5-ekranga (qog'ozda chizish) 15 daqiqa taymer bor — vaqtdan oshirmang; A2 ulgurmasa, uyga vazifaning 1-bandi o'sha.

## 2 · Funksiyadan ekranlarga  ← QTushuncha
- Eyebrow: Tushuncha · ekranlar
- Sarlavha: **Bitta funksiya qaysi ekranlarga bo'linadi?** (42)
- Mentor: Roadmap'dagi birinchi funksiya — o'yin e'loni va qo'shilish: avval gapni tanlang, so'ng mos ekranni bosing.
- Chap — karta «O'yin e'loni va qo'shilish» (bu misolda PRD dan), ichida to'rt gap-tugma (birinchisi halqada):
  1. Tashkilotchi kun, soat, maydon va nechta odamni yozadi
  2. O'yinchi kun bo'yicha o'yinlarni ko'radi
  3. O'yinchi bitta o'yinni ochib, kim qo'shilganini ko'radi
  4. O'yinchi «Qo'shilaman» ni bosadi va «8 / 10» o'zgaradi
- O'ng — qog'oz ustida uch bo'sh telefon ramkasi (qalam chizig'i, ichi bo'sh), tepasida nomlari: **O'yinlar** · **O'yin** · **E'lon berish**. Hisoblagich: «Joylandi: 0 / 4».
- **Harakat → Vizual o'zgarish:** gapni tanlash → gap-tugma ajraladi; ramkani bosish →
  - to'g'ri ramka → gap kichrayib ramkaga uchib kiradi va qalam chizig'idagi bo'lakka aylanadi: 1 → E'lon berish ichida to'rt maydon va tugma · 2 → O'yinlar ichida to'rt karta ·
    3 → O'yin ichida qo'shilganlar doiralari · 4 → O'yin ichida «Qo'shilaman» tugmasi va «8 / 10»; hisoblagich oshadi;
  - boshqa ramka → ramka silkinadi, bir qator (`QXato`, ≤60): «Bu ish boshqa ekranda bajariladi.» (33)
  4/4 da ramkalar orasida qalam strelkalari chiziladi: O'yinlar kartasi → O'yin · «E'lon berish» → E'lon berish.
- Xulosa: Bu misolda funksiya gaplari O'yinlar, O'yin va E'lon berish ekranlariga bo'lindi. (81)
- Tugadi (199): gap-tugmalar paneli yopiladi, uch ramka strelkalari bilan butun enga; vizual ⛶ ichida (q17). Tugma (pastki): Gaplarni joylang (N/4) → Davom etish

## 3 · Qog'ozga nima tushadi?  ← QTushuncha (saralash)
- Eyebrow: Tushuncha · wireframe
- Sarlavha: **O'yinlar ekrani qog'ozda qanday chiziladi?** (42)
- Mentor: Har bo'lak uchun tanlang: «Qog'ozga» yoki «Chizilmaydi».
- Chap — olti bo'lak-karta, bittadan chiqadi (SABOQ 13); har birida ikki tugma «Qog'ozga» · «Chizilmaydi»:
  1. «O'yinlar» sarlavhasi
  2. O'yin kartasi: kun, soat, maydon, «8 / 10»
  3. «E'lon berish» tugmasining joyi
  4. Kartadan O'yin ekraniga strelka
  5. Tugmaning yashil rangi
  6. Sarlavhaning shrifti
- O'ng — qog'oz varag'i, ichida bo'sh telefon ramkasi (O'yinlar ekrani), ostida kulrang ustun «Chizilmaydi» (uzuq chiziqli joy). Hisoblagich: «Saralandi: 0 / 6».
- **Harakat → Vizual o'zgarish:**
  - «Qog'ozga» (1–4) → bo'lak qog'ozda qalam bilan chiziladi o'z joyida: sarlavha yozuvi · to'rt karta to'rtburchagi ichida «Sh 18:00 · Mahalla · 8/10» · pastda tugma to'rtburchagi · ramkadan tashqariga strelka «→ O'yin»;
  - «Chizilmaydi» (5–6) → bo'lak kulrang ustunga tushadi, qog'oz o'zgarmaydi;
  - adashgan tanlov → bo'lak silkinadi, bir qator (≤60): 1–4 uchun «Busiz ekranda qayerda nima turishi noma'lum qoladi.» (51) · 5–6 uchun «Qog'ozdagi chizma rangsiz — bu keyin tanlanadi.» (47)
- Nom qatori (6/6 dan keyin, bitta): Ekranning qog'ozdagi bunday sodda chizmasi wireframe deyiladi: qayerda nima turadi.
- Xulosa: Bugungi wireframe joyni va o'tishni ko'rsatadi: kartalar, tugmalar, strelkalar; rang va shrift tanlanmaydi. (107)
- Tugadi (199): bo'laklar paneli yopiladi, qog'ozdagi wireframe butun enga; vizual ⛶ ichida. Tugma (pastki): Bo'laklarni saralang (N/6) → Davom etish

## 4 · 1-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 1-savol
- Savol: **Wireframe chizyapsiz. Unga nima kiradi?** (5 so'z)
  - «Qo'shilaman» tugmasining rangi
  - ✔ «Qo'shilaman» tugmasining joyi
  - «O'yinlar» sarlavhasining shrifti
  - «Maydon Jamoa» logotipining shakli
- Kalit: **B** (index 1). Variantlar bir shaklda («… -ning …»), qo'shtirnoq to'rttalasida; uzunlik — skript o'lchovi pastda (GATE M).
- To'g'ri izohi: Wireframe qayerda nima turishini ko'rsatadi — rang va shrift keyin tanlanadi.
- Xato izohlari (≤60):
  - A: Bugungi wireframe'da rang tanlanmaydi — faqat joy. (50)
  - C: Shrift — ko'rinish; wireframe uni ko'rsatmaydi. (47)
  - D: Logotip chizilmaydi: wireframe sodda shakllardan iborat. (56)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 5 · O'z mahsulotingiz qog'ozda  ← QMustaqil (15 daqiqa taymer)
- Eyebrow: Mustaqil ish · qog'ozda
- Sarlavha: **Mahsulotingiz ekranlarini qog'ozga chizing** (42)
- Mentor: Ekranni Figma kabi dasturda ham chizish mumkin, bugun esa qog'oz va qalam yetadi — shu chizmadan prototip quramiz. Har ekranni chizgach, uni shu yerga yozing.
- Tepada — PRD dagi funksiyalaringiz (`pm-m9d5-prd.funksiyalar`, uch tugma, birinchisi tanlangan): «Qaysi funksiya ekranlarini chizasiz?»
  PRD saqlanmagan bo'lsa — bitta maydon: «Birinchi funksiyangizni bir gapda yozing» (ipucha: «masalan: o'yin e'loni va qo'shilish»).
- Taymer: «15:00» va tugma «Taymerni boshlash» (ikkinchi tugma); vaqt tugasa yorliq: «Vaqt tugadi — chizganingizni yozing».
- Doiralar 1 / 2 / 3 (ekranlar; 3-doira ostida kichik yorliq «kerak bo'lsa»), har doirada forma:
  - «Ekran nomi» — ipucha «masalan: O'yinlar»
  - «Unda nima turadi» — ipucha «masalan: o'yinlar ro'yxati, har kartada soat»
  - «Asosiy tugma va u qaysi ekranni ochadi» — ipucha «masalan: karta → O'yin»
- Yordam (ochiladigan): Qaysi ekranlar kerakligini bilmasangiz, funksiyangiz gaplarini oling: kim nima qiladi va bu qaysi ekranda bo'ladi?
- Shart xabari (Saqlash bosilganda, ≤60): «Kamida ikki ekranning nomi va tugmasini yozing.» (47)
- Tugma (o'ngda): Saqlash → `pm-m9d7-wireframe` (TAYANCHGA SAVOL 2).
- **Harakat → Vizual o'zgarish:** formada maydon yozish → yonidagi kichik qog'oz ramkasida shu ekran nomi qalam bilan yoziladi, tugma maydoni to'lsa — ramkadan keyingi ramkaga strelka chiziladi;
  «Saqlash» → forma yopiladi, ramkalar bitta qatorga yig'iladi (SABOQ 17: «Ekranlar · 3 · ✓»).
- Xulosa (saqlagach): Wireframe'ingiz tayyor. Uni telefoningiz bilan suratga oling — amaliyotda kerak bo'ladi. (88)
- O'qituvchi eslatmasi: chizishga 15 daqiqa; qog'oz va qalam darsdan oldin tayyor tursin. Surat tiniq bo'lsin — yozuvlar o'qilsin.
- Tugma (pastki): Saqlang → Davom etish

## 6 · Bosiladi, lekin saqlamaydi  ← QTushuncha (bashorat + harakat)
- Eyebrow: Tushuncha · prototip
- Sarlavha: **Bosiladigan ekranlar uchun Backend kerakmi?** (43)
- Mentor: Bu misolda Maydon Jamoa ekranlari namuna ma'lumot bilan qurilgan — «Qo'shilaman» ni bosing, keyin sahifani yangilang.
- Bashorat (ballsiz, 181; tanlangach ixcham qator bo'lib qoladi): **Sahifa yangilansa, nima ko'rinadi?** · «8 / 10» · «9 / 10»
- Chap — telefon (**prototip** holati, O'yin ekrani): «‹ O'yinlar» · «Shanba, 18:00» · «Mahalla maydoni» · «8 / 10» · 8 doira + 2 bo'sh joy · «Qo'shilaman» (halqada).
  Telefon ustida brauzer qatori va tugma «Yangilash» (↻; avval xira, «Qo'shilaman» dan keyin faollashadi).
- O'ng — fayl kartasi `prototip/src/namuna.js` (3–4 qator, P-065):
  ```js
  export const oyinlar = [
    { kun: 'Shanba', soat: '18:00', maydon: 'Mahalla maydoni', qoshilgan: 8, kerak: 10 },
    // … yana 3 ta o'yin
  ];
  ```
  ostida ikki kulrang yorliq: «Backend — yo'q» · «Database — yo'q».
- **Harakat → Vizual o'zgarish:** «Qo'shilaman» → «9 / 10», 9-doira to'liq bo'ladi, ostida «Siz», tugma «Qo'shildingiz» (o'chiq); `namuna.js` dagi `qoshilgan: 8` o'zgarmaydi (kulrang izoh: «fayl o'zgarmadi»).
  «Yangilash» → ekran bir lahza oqaradi va qayta chiziladi: «8 / 10», 8 doira, «Qo'shilaman» qaytdi; `qoshilgan: 8` qatori bir marta yonadi (ma'lumot shu yerdan keldi).
- Nom qatori (yangilashdan keyin, bitta): Bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar prototip deyiladi.
- Natija qatori: «Taxminingiz: … · haqiqatda: 8 / 10» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: Bu prototip bosiladi, lekin ma'lumotni saqlamaydi: ma'lumot `namuna.js` da, Backend yo'q. (89)
- Tugadi (199) · Tugma (pastki): Qo'shiling va yangilang (N/2) → Davom etish

## 7 · 2-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 2-savol
- Savol: **Prototipda yangi o'yin e'lon qildingiz. Sahifa yangilansa, e'lon nima bo'ladi?** (10 so'z) — 6-ekran bashoratining nusxasi emas: o'sha qoida, boshqa ekran
  - Ro'yxatda qoladi — Database'ga yozildi
  - Ro'yxatda qoladi — brauzer eslab qoldi
  - ✔ Yo'qoladi — namuna boshidan ochiladi
  - Hammaga ko'rinadi — Backend yubordi
- Kalit: **C** (index 2). To'rttalasi «natija — sabab» shaklida, tire hammasida.
- To'g'ri izohi: Bu prototip ma'lumotni saqlamaydi: yangilanganda ro'yxat `namuna.js` dan qayta ochiladi.
- Xato izohlari (≤60):
  - A: Bu prototipda Database yo'q — e'lon hech qayerga yozilmadi. (59)
  - B: Bu prototipda brauzerga hech narsa yozilmaydi. (46)
  - D: Prototipda Backend yo'q — e'lonni hech kim olmaydi. (51)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 8 · Wireframe'dan talabga  ← QTushuncha (uch qatorni tanlash)
- Eyebrow: Tushuncha · talab
- Sarlavha: **Wireframe suratidan tashqari agentga nima yoziladi?** (51)
- Mentor: Har qator uchun bittasini tanlang va agent nima qurishini ko'ring.
- Chap — talab uch qismdan (`QQadamlar` uslubida: 1 Qayerda · 2 Nima qilsin · 3 Nima buzilmasin; joriy — accent, o'tgani ✓); tepada kichik surat «wireframe.jpg» (qog'ozdagi uch ekran). Har qismda ikki variant:
  - Qayerda: «Loyihada» · «`prototip/` papkasida»
  - Nima qilsin: «Chiroyli ilova qilsin» · «Uch ekran suratdagidek, namuna ma'lumot bilan, bosiladi»
  - Nima buzilmasin: «Hech narsa yozilmagan» · «Haqiqiy ma'lumot va Backend yo'q»
- O'ng — repo daraxti (papka va fayllar) + telefon (agent qurgan natija; maket misol — agent shunday qilishi mumkin).
- **Harakat → Vizual o'zgarish:** variantni tanlash → daraxt va telefon shu talab bo'yicha o'zgaradi:
  - «Loyihada» → fayllar repo ildiziga sochilib tushadi (`src/`, `index.html`, `package.json` — `README.md` yonida) · `QXato`: Joy aytilmasa, agent fayllarni boshqa joyga qo'yishi mumkin. (60)
  - «Chiroyli ilova qilsin» → telefonda wireframe'da yo'q ekranlar chiqadi («Kirish», «Chat») · `QXato`: Ish aniq aytilmasa, agent bo'sh joyni o'zi to'ldirishi mumkin. (62)
  - «Hech narsa yozilmagan» → daraxtda `backend/` papkasi paydo bo'ladi · `QXato`: Aytilmasa, agent Backend ham qurib ketishi mumkin. (50)
  - aniq variant → o'sha qism ✓: `prototip/` papkasi bitta tugun bo'lib yig'iladi · telefonda uch ekran wireframe'dagidek, namuna ma'lumot bilan · `backend/` yo'q.
  3/3 da pastda talab bitta qutida yig'iladi (mono):
  «Qayerda: `prototip/` papkasi. Nima qilsin: wireframe suratidagidek uch ekran — O'yinlar, O'yin, E'lon berish; namuna ma'lumot bilan; ekranlar bosiladi. Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q.»
- Nom qatori (3/3 dan keyin): Uch qatorli bu matn — 9-Moduldagi talab; wireframe surati unga ilova.
- Xulosa: Surat ekranlarni ko'rsatadi, talab esa joyni, ishni va nimaga tegmaslikni aytadi. (81)
- Tugadi (199): variantlar yopiladi, daraxt, telefon va yig'ilgan talab butun enga; vizual ⛶ ichida. Tugma (pastki): Uch qismni tanlang (N/3) → Davom etish

## 9 · 3-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 3-savol
- Savol: **Talabning «nima buzilmasin» qatoriga nimani yozasiz?** (6 so'z)
  - ✔ Haqiqiy ma'lumot va Backend bo'lmasin
  - Uch ekran wireframe suratidagidek bo'lsin
  - Hamma fayl `prototip/` papkasida tursin
  - Ekranlar bir-biriga bosib o'tilsin
- Kalit: **A** (index 0). Uch xato variant — talabning boshqa qatorlari (rost, lekin bu qatorga mos emas — S-004); to'rttalasi «… -sin» shaklida.
- To'g'ri izohi: Bu qator agentga nimaga tegmaslikni aytadi: bugun haqiqiy ma'lumot ham, Backend ham yo'q.
- Xato izohlari (≤60):
  - B: Bu — «nima qilsin» qatori: ekranlar qanday bo'lishi. (52)
  - C: Bu — «qayerda» qatori: fayllar qaysi papkada. (45)
  - D: Bu ham «nima qilsin» qatorida: ekranlar bosilishi. (50)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 10 · Agent qurganini tekshirish  ← QTushuncha (farqni topish, 3 ta)
- Eyebrow: Tekshirish
- Sarlavha: **Agent qurgan ekranlar wireframe'ga mosmi?** (41)
- Mentor: Agent ba'zi joyni taxmin qilishi mumkin — tepada bor, pastda yo'q bo'lakni bosing.
- Tepada — wireframe (qog'oz holati, uch ekran yonma-yon) · pastda — agent qurgan prototip (uch ekran yonma-yon, bir xil tartibda; solishtirish sahnasi, P-057). Hisoblagich: «Farq: 0 / 3».
  Yashirilgan uch farq (prototipda yo'q): 1) O'yinlar kartalarida «8 / 10» · 2) O'yin ekranida qo'shilganlar doiralari · 3) E'lon berish formasida «Nechta odam» maydoni.
- **Harakat → Vizual o'zgarish:** wireframe'dagi bo'lakni bosish →
  - prototipda yo'q bo'lsa → bo'lak qizil chiziq bilan belgilanadi, prototipdagi o'sha joyda uzuq chiziqli bo'sh to'rtburchak chiqadi (U-041), ostidagi «tuzatish talabi» qutisiga bir qator qo'shiladi; hisoblagich oshadi;
  - prototipda bor bo'lsa → bo'lak silkinadi, bir qator (≤60): «Bu joy ekranda bor — boshqasini qidiring.» (41)
  3/3 da quti to'liq talabga yig'iladi (mono, «Nusxalash» yo'q — bu yerda faqat ko'rinadi):
  «`prototip/`: wireframe'dagidek qilinsin — O'yinlar kartalariga «8 / 10», O'yin ekraniga qo'shilganlar, E'lon berish formasiga «Nechta odam» qo'shilsin. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
  Keyin prototipdagi uchala bo'sh joyda yetishmagan bo'lak paydo bo'ladi (agent tuzatdi) va qizil belgilar yashilga o'tadi.
- Xulosa: Agent qurganini wireframe bilan solishtirasiz; farqlarni bitta tuzatish talabida yuborasiz. (91)
- Tugadi (199) · Tugma (pastki): Farqlarni toping (N/3) → Davom etish

## 11 · Uch animatsiya  ← QTushuncha (uch kalit)
- Eyebrow: Tushuncha · jonli prototip
- Sarlavha: **Animatsiya prototipga nima qo'shadi?** (36)
- Mentor: 9-Modulda Maydon kataklariga animatsiya yozgansiz, usullari o'sha — har kalitni yoqing va telefonda tekshirib ko'ring.
- Chap — uch kalit (bittadan faollashadi, joriysi halqada), har birida teg:
  1. Karta kichrayib qaytadi · `transform` + `transition`
  2. Son kattalashib, silliq qaytadi · `transition`
  3. Ekranlar silliq almashadi · Motion
- O'ng — telefon (**prototip** holati, O'yinlar ekranidan boshlanadi), ustida kichik yorliq «prototip». Hisoblagich: «Tekshirildi: 0 / 3».
- **Harakat → Vizual o'zgarish:**
  - 1-kalit yoqildi → O'yinlar kartasi halqada; kartani bosish → karta 0,15 soniyada kichrayib qaytadi va O'yin ekrani ochiladi (hali birdan);
  - 2-kalit → «Qo'shilaman» halqada; bosish → «8» → «9», son bir lahza kattalashib, 0,3 soniyada joyiga qaytadi;
  - 3-kalit → «‹ O'yinlar» halqada; bosish → O'yin ekrani o'ngga chiqib ketadi, O'yinlar chapdan silliq kiradi (0,3 soniya); keyingi har o'tish ham silliq.
  Kalit yoqilmagan holatda o'sha harakat birdan bo'ladi (farq ko'rinsin). 3/3 da telefon ustidagi yorliq «prototip» → «jonli prototip» ga almashadi.
- Nom qatori (3/3 dan keyin): Animatsiyasi bor prototipni bu kursda jonli prototip deymiz. (07-FILTR 3)
- Xulosa: Uch animatsiya o'yinchiga javob beradi: bosildi, son o'zgardi, yangi ekran ochildi. (83)
- Tugadi (199) · Tugma (pastki): Uch kalitni tekshiring (N/3) → Davom etish
- O'qituvchi eslatmasi: bu yerda yangi qoida yo'q — 9-Modul 5 va 8-darslardagi `transform`, `transition`, Motion qayta ishlatiladi; 2–3 daqiqa yetadi.

## 12 · Son silliq yangilanadi  ← QKod
- Eyebrow: Kod yozish · son
- Sarlavha: **«9 / 10» ni silliq ko'rsatadigan kod yozamiz.** (45) — §19 sarlavha oilasi
- Mentor: Shu animatsiyani kod oynasida CSS bilan o'zingiz terib yozasiz — nusxalab bo'lmaydi: qo'lda yozganda o'rganiladi.
- Chap — vazifa (3 band):
  1. `.son` qoidasiga qo'shing: `transition: transform 0.3s;`
  2. `.son.yangi` qoidasini yozing: `transform: scale(1.3);`
  3. Natija oynasida «Qo'shilaman» ni bosing — son kattalashib, silliq qaytsin.
- Yordam: Son kattalashmasa, `.son.yangi` da ikki klass orasida bo'sh joy yo'qligini va `0.3s` da «s» harfi borligini tekshiring.
- Tugma (o'ngda): Bajardim — shartlar ✓ bo'lgach ochiladi.
- O'ng — platforma tugmasi «Kompilyatorni ochish» (nomi tegilmaydi; ostida bir qator: «Kod oynasi ochiladi — kodni yozasiz va natijasini shu yerda ko'rasiz.») → `HtmlCompiler`, fayllar:
  - `index.html` — tayyor, o'zgarmaydi:
    ```html
    <div class="oyin">
      <p>Shanba, 18:00 · Mahalla maydoni</p>
      <p class="hisob"><span class="son">8</span> / 10</p>
      <button class="tugma">Qo'shilaman</button>
    </div>
    ```
  - `app.js` — tayyor, o'zgarmaydi:
    ```js
    const son = document.querySelector('.son');
    const tugma = document.querySelector('.tugma');
    tugma.addEventListener('click', () => {
      son.textContent = 9;
      son.classList.add('yangi');
      setTimeout(() => son.classList.remove('yangi'), 300);
      tugma.disabled = true;
      tugma.textContent = "Qo'shildingiz";
    });
    ```
  - `style.css` — o'quvchi yozadi (boshlang'ich holat):
    ```css
    .son {
      display: inline-block;
      /* 1) transition shu yerga */
    }
    /* 2) .son.yangi qoidasi shu yerga */
    ```
- Kod oynasi sarlavhasi: `style.css — sonni silliq kattalashtiring`
- Shart xabarlari (≤60):
  - 1 — `.son` dagi `transition` da `transform` va vaqt bo'lsin. (56)
  - 2 — `.son.yangi` ichida `transform: scale(1.3)` bo'lsin. (52)
- **Harakat → Vizual o'zgarish:** o'quvchi yozadi → natija oynasida o'yin qatori; har shart bajarilganda ✓; «Qo'shilaman» → «8» → «9», son 0,3 soniyada kattalashadi va 0,3 soniyada silliq qaytadi,
  tugma «Qo'shildingiz». Kod o'zgarsa natija oynasi boshidan ochiladi (yana «8»). «Bajardim» → panel yopiladi, natija oynasi fokusga (199).
- Xulosa: Son almashganda bir lahza kattalashib qaytadi — o'yinchi «9 / 10» bo'lganini sezadi. (84)

## 13 · 4-savol ✔ (jonli ball)  ← QTest
- Eyebrow: Mashq · 4-savol
- Savol: **«Qo'shilaman» bosilganda son sakrab kattalashadi. Nimani qo'shasiz?** (7 so'z)
  - `.son` ga `transition: opacity 0.3s`
  - `.tugma` ga `transition: transform 0.3s`
  - `.son.yangi` ga `transform: scale(1)`
  - ✔ `.son` ga `transition: transform 0.3s`
- Kalit: **D** (index 3). To'rttalasi «`selektor` ga `xususiyat: qiymat`» shaklida; `transition` uchta variantda, `transform` uchta variantda (kalit so'z faqat to'g'rida emas).
- To'g'ri izohi: `transition` `.son` da tursa, son silliq kattalashadi va silliq qaytadi.
- Xato izohlari (≤60):
  - A: `opacity` shaffoflikni silliq qiladi, o'lcham esa sakraydi. (59)
  - B: Bu tugmaga vaqt beradi — son esa sakrashda qoladi. (50)
  - C: `scale(1)` o'lchamni o'zgartirmaydi — son kattalashmaydi. (57)
- Jonli darsda: bitta urinish. Xatodan keyin: «Qisqa takrorlash».

## 14 · Qog'ozdan jonli prototipgacha (final)  ← QTartib (ball · sentinel `0`)
- Eyebrow: Yakuniy · tartib
- Sarlavha: **Qog'ozdan jonli prototipgacha qaysi tartibda borasiz?** (53)
- Mentor: Bo'laklarni bajariladigan tartibda joylang.
- Bo'laklar (to'g'ri tartibda, `PROTOTIP_YOLI` — 1-ekran bilan bitta manba): Qog'ozda ekranlarni chizish · Surat bilan talab yozish · Agent qurgan ekranlarni qog'ozdagi bilan solishtirish · Uch animatsiya qo'shish
- Uyalar: 4 ta, har birida «bu yerga qo'ying» (tartibni ochmaydi).
- Xato: Tartib xato — bo'lakni bosib qaytaring. (39)
- Xulosa (yechilgach, bir marta): Avval qog'oz va talab, keyin tekshirish; animatsiya ekranlar to'g'ri bo'lgandan keyin qo'shiladi. (97)

## 15 · Amaliyot 1 — repo va bosiladigan ekranlar  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈20 daq)
- Eyebrow: Amaliyot 1 · o'z repo'ngiz
- Sarlavha: **Repo oching va ekranlaringizni bosiladigan qiling.** (50)
- Mentor: Hamma qadamni o'z mahsulotingiz bilan qilasiz, o'ngda — namuna; «1 · Ochish»dan boshlang.
- Model (tayanch 4, Qaror-0 6 — 06.10 01:08): to'rt qadamning hammasi o'quvchining o'z repo'sida, o'z mahsuloti bilan; Mentor misoli — faqat namuna: o'ngda kutilgan natija,
  `{…}` joylari yonida kulrang «masalan: …», «Yordam»da Mentor misolidagi to'liq talab. 5-qadam yo'q.
- Qadamlar (bittadan ochiladi, har birida «Bajardim»; «Avval bajaring» qulfi):
  1. **Ochish** — GitHub'da o'ng yuqoridagi «+» ni bosing va «New repository» ni tanlang. «Repository name» — mahsulotingiz nomi, lotin harfida, bo'sh joysiz (kulrang: «masalan: maydon-jamoa»);
     Public; README qo'shishni yoqing; «Create repository». Nom band desa — oxiriga raqam qo'shing. Kulrang qator: Repo ochiq — unga telefon raqami, manzil kabi shaxsiy ma'lumot yozmang. (07-FILTR 6)
     Terminalda: `git clone https://github.com/{login}/{repo}.git` · `cd {repo}` — papkani Antigravity'da oching.
     Wireframe suratini telefoningizdan kompyuterga o'tkazing va repo papkasiga `wireframe.jpg` nomi bilan qo'ying. 5-darsda yozgan `PRD.md` ni ham shu papkaga ko'chiring.
  2. **Prompt** — (ustida kulrang qator: Prototip brauzerda quriladi; telefon ko'rinishi — kichik ekranda tekshirish uchun, final platforma hali tanlanmagan.) qavslar mustaqil ishdagi yozuvingizdan to'ldirilgan; tekshiring, bo'sh qavsni yozing, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `prototip/` papkasi — yangi React + Vite loyihasi; `README.md`.
     > Nima qilsin: `wireframe.jpg` dagi ekranlar — {ekranlar va ulardagi narsalar}. Ma'lumot `prototip/src/namuna.js` da: {namuna ma'lumot}.
     > Ekranlar bir-biriga bosib o'tilsin: {qaysi tugma qaysi ekranni ochadi}. `README.md` ga shu talabni va `wireframe.jpg` suratini qo'sh.
     > Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q — hammasi faqat ochiq sahifada. `prototip/` va `README.md` dan tashqariga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna (Mentor misolidan):
     - {ekranlar va ulardagi narsalar} — «masalan: O'yinlar — o'yin kartalari: kun, soat, maydon, «8 / 10»; O'yin — qo'shilganlar, «Qo'shilaman»; E'lon berish — forma»
     - {namuna ma'lumot} — «masalan: 4 ta o'yin, Shanba va Yakshanba»
     - {qaysi tugma qaysi ekranni ochadi} — «masalan: karta → O'yin, «E'lon berish» → forma; «Qo'shilaman» sonni bittaga oshirsin»
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab:
     > Qayerda: `prototip/` papkasi — yangi React + Vite loyihasi; `README.md`.
     > Nima qilsin: `wireframe.jpg` dagi ekranlar — O'yinlar: o'yin kartalari, har birida kun, soat, maydon, «8 / 10», pastda «E'lon berish»; O'yin: «‹ O'yinlar», kun, soat, maydon, «8 / 10», qo'shilganlar (10 ta joy, ismsiz doiralar), «Qo'shilaman»;
     > E'lon berish: kun, soat, maydon, nechta odam, «Yuborish». Ma'lumot `prototip/src/namuna.js` da: 4 ta o'yin, Shanba va Yakshanba.
     > Ekranlar bir-biriga bosib o'tilsin: karta → O'yin, «E'lon berish» → E'lon berish, «Yuborish» → O'yinlar; «Qo'shilaman» sonni bittaga oshirsin. `README.md` ga shu talabni va `wireframe.jpg` suratini qo'sh.
     > Nima buzilmasin: haqiqiy ma'lumot va Backend yo'q — hammasi faqat ochiq sahifada. `prototip/` va `README.md` dan tashqariga tegma, o'zgargan fayllarni ayt.
  3. **Ishga tushirish** — terminalda `cd prototip`, `npm install`, `npm run dev` — xato yo'q. Brauzerda terminal ko'rsatgan manzilni oching (odatda `localhost:5173`).
     Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — telefon ko'rinishi: F12, keyin Ctrl+Shift+M (Mac: Cmd+Option+I, keyin Cmd+Shift+M). Talabning har qatorini tekshiring:
     qayerda — repo'da `prototip/` papkasi bor, `README.md` da talab va surat · nima qilsin — har tugma kerakli ekranni ochadi, ekranlar wireframe suratingizdagidek ·
     nima buzilmasin — `backend/` papkasi yo'q, sahifa yangilansa namuna boshidan ochiladi. Farq bo'lsa, agentga:
     «{nima} wireframe'dagidek emas: {qanday bo'lsin}. Boshqa joyga tegma, o'zgargan fayllarni ayt.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon, uch ekran navbat bilan o'zi almashadi; **prototip** holati; o'quvchi o'zinikini shunga solishtiradi):
  - O'yinlar: Shanba, 18:00 · Mahalla maydoni · 8 / 10 — Shanba, 20:00 · Maktab maydoni · 6 / 10 — Yakshanba, 10:00 · Park maydoni · 4 / 8 — Yakshanba, 17:00 · Mahalla maydoni · 9 / 10 · «E'lon berish»
  - O'yin: Shanba, 18:00 · Mahalla maydoni · 8 / 10 · qo'shilganlar · «Qo'shilaman»
  - E'lon berish: Kun · Soat · Maydon · Nechta odam · «Yuborish»
  - ostida kichik repo daraxti: `README.md` · `PRD.md` · `wireframe.jpg` · `prototip/` › `src/namuna.js`
- Hammasi bajarilgach (yashil): Repo ochildi, ekranlar bosiladi va wireframe bilan bir xil. (59)
- Pastki qator (kichik): Ortda qoldingizmi — Mentor misolini alohida papkada ochib ko'ring: `git clone https://github.com/Azizbekcrypto/maydon-jamoa` · `cd maydon-jamoa` · `git checkout -f m11-dars-07-done`,
  keyin `prototip/` da `npm install`, `npm run dev`. Qanday ishlashini ko'rasiz va o'z repo'ngizdagi qadamni shunga qarab qaytarasiz.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `{ekranlar va ulardagi narsalar}` va `{qaysi tugma qaysi ekranni ochadi}` — `pm-m9d7-wireframe` dan (ekran nomi + «nima turadi»; «asosiy tugma»); `{namuna ma'lumot}` — o'quvchi yozadi;
  yozuv saqlanmagan bo'lsa — hamma qavs bo'sh, faqat kulrang «masalan». «Public» — Qaror-0 da yo'q tafsilot: o'qituvchi repo'ni ko'ra olishi uchun (TAYANCHGA SAVOL 6).
  Talab zinapoyasi (tayanch 4) 7-dars uchun belgilanmagan — bu yerda tayyor talab + uchta joy (TAYANCHGA SAVOL 1).

## 16 · Amaliyot 2 — uch animatsiya va GitHub  ← amaliyot bloki (QBlok + `ScreenBlok`, ≈12 daq)
- Eyebrow: Amaliyot 2 · jonli prototip
- Sarlavha: **Prototipingizga uch animatsiya qo'shing.** (40)
- Mentor: Animatsiyani agent yozadi, talabni siz berasiz — «1 · Ochish»dan boshlang.
- Qadamlar (o'z repo'ngizda, o'z mahsulotingiz bilan):
  1. **Ochish** — `prototip/` ishlab tursin (`npm run dev`), brauzerda telefon ko'rinishi ochiq.
  2. **Prompt** — qavslarni to'ldiring, «Nusxalash»ni bosing va Antigravity'ga yuboring:
     > Qayerda: `prototip/` — `motion` paketini o'rnat.
     > Nima qilsin: {bosiladigan karta yoki tugma} bosilganda kichrayib qaytsin — `transform` va `transition`, 0,15 soniya. {o'zgaradigan son yoki yozuv} o'zgarganda bir lahza kattalashib, 0,3 soniyada silliq qaytsin.
     > Ekrandan ekranga o'tish Motion bilan silliq bo'lsin — 0,3 soniya.
     > Nima buzilmasin: ekranlar, namuna ma'lumot va bosish yo'llari o'zgarmasin; qurilmada harakat kamaytirilgan bo'lsa, kichrayish va surilish bo'lmasin. Boshqa joyga tegma, o'zgargan fayllarni ayt.
     Qavslar yonida kulrang namuna: {bosiladigan karta yoki tugma} — «masalan: o'yin kartasi» · {o'zgaradigan son yoki yozuv} — «masalan: «8 / 10» dagi son».
     Yordam (ochiladigan) — Mentor misolidagi to'liq talab: o'sha talab, qavslar o'rnida «o'yin kartasi» va ««8 / 10» dagi son».
  3. **Ishga tushirish** — sahifa o'zi yangilandi, terminalda xato yo'q. Xato bo'lsa: «Shu xato chiqdi: {xato}. Tuzat.»
  4. **Tekshirish** — talabning har qatori: bosiladigan joy kichrayib qaytadimi · son yoki yozuv kattalashib qaytadimi · ekranlar silliq almashadimi · ekranlar va bosish yo'llari o'sha-o'shami.
     Hammasi mos bo'lsa — GitHub'ga: repo papkasida `git status` — o'zgargan fayllar agent aytgan ro'yxat bilan bir xil bo'lsin; shularni qo'shing:
     `git add README.md PRD.md wireframe.jpg prototip`, `git commit -m "jonli prototip"`, `git push`. GitHub'da repo sahifasini yangilang — README'da talab va wireframe surati ko'rinadi.
     `git push` xato bersa: «Shu xato chiqdi: {xato}. Tuzat.»
- O'ng tomon — «kutilgan natija · namuna: Maydon Jamoa» (telefon, **jonli** holat, o'zi aylanadi): karta bosiladi va kichrayib qaytadi → O'yin ekrani silliq kiradi → «Qo'shilaman» → «8» → «9» kattalashib qaytadi →
  «‹ O'yinlar» → ro'yxat silliq qaytadi. Ostida GitHub sahifasining kichik ko'rinishi: `maydon-jamoa` · `README.md` — «Talab» bo'limi va qog'ozdagi uch ekran surati.
- Hammasi bajarilgach (yashil): Prototip jonli: karta, son va ekranlar bosishga javob beradi; README'da talab va surat. (87)
- Pastki qator: yo'q — «Ortda qoldingizmi» faqat A1 da, darsda bir marta (foydalanuvchi, F-1006-271).
- Nishon (bonus): Live Prototype — oxirgi «Bajardim»da.
- Tugmalar: Orqaga · Avval bajaring → Davom etish
- ✎ MD izohi: `motion` faqat shu blokda o'rnatiladi (A1 da yo'q). Animatsiya vaqtlari 9-Modul bilan bir: 0,15 s (kichrayish) va 0,3 s (o'tish, son). README talab va surati A1 da agent yozgan; bu yerda faqat push.

## 17 · Natijalar (podium) — umumiy shablon
- Jonli reyting: 4 savol + final + 2 blok «Bajardim» (`PRACTICE_BASE`).
- Savol yorliqlari (`Q_LABELS`): 4 — «1 — Wireframe'da nima bor» · 7 — «2 — Yangilangan prototip» · 9 — «3 — Nima buzilmasin» · 13 — «4 — Silliq son» · 14 — «Yakuniy — prototip yo'li»

## 18 · Takrorlash  ← QKartochka (12 karta, alohida ekran — SABOQ 12, 16)
- Eyebrow: Takrorlash
- Sarlavha: **O'zingizni sinab ko'ring.** (25)
- Mentor yo'q (SABOQ 16). Karta ostida, birinchi bosishgacha: «Kartani bosing — javob ochiladi»; karta yuzi halqada.
- Kartochkalar — pastdagi «Kartochkalar (12)» jadvali · hisoblagichlar: ↻ O'rganilmoqda · N · ✓ Bildim · N
- Tugmalar (karta ochilgach): ✗ Takrorlash · ✓ Bildim · hammasi bilinganda: Hammasini bilasiz! · 12/12 atama yodlandi · ↻ Qaytadan takrorlash
- Tugmalar: Orqaga · Yakunlash →

## 19 · Yakun  ← QYakun (texnik darslar standarti, 192/204)
- Yuqori yorliqlar: ✓ Jonli prototip tayyor (A2 bajarilgan bo'lsa; A1 — «✓ Prototip bosiladi»; A1 yo'q — yorliq yo'q) · {N}/5 to'g'ri
- Sarlavha (holatga qarab, P-046; 07-FILTR 36): A2 bajarilgan — **Qog'ozdagi ekranlaringiz endi bosiladi va jonli.** (48) · A1 bajarilgan, A2 yo'q — **Bosiladigan prototipingiz tayyor — animatsiya uyda.** (51) ·
  A1 bajarilmagan — **Prototip boshlandi — qolgan qadamlar uyda.** (42)
- CTA: CODE STRIKE (arena) — jonli darsda: Mentorni kuting
- Bugungi asosiy fikr (`small`, ScoreRing'dan keyin, P-013): Qog'ozdagi wireframe ekranni agentga aniq ko'rsatadi; namuna ma'lumot va animatsiya uni Backend'siz bosiladigan, jonli prototipga aylantiradi.
- Endi siz bilasiz (5):
  - Wireframe — ekranning qog'ozdagi sodda chizmasi: qayerda nima turadi.
  - Talab uch qatordan iborat: qayerda, nima qilsin, nima buzilmasin; wireframe surati unga ilova.
  - Bu prototip bosiladi, lekin ma'lumotni saqlamaydi: ma'lumot namuna, Backend yo'q.
  - Agent qurganini wireframe bilan solishtirib, farqlarni bitta tuzatish talabida yuborasiz.
  - Uch animatsiya prototipni jonli qiladi: karta, son va ekranlar orasidagi o'tish.
- Uyga vazifa (`uyga`, karta: kim uchun — o'z mahsulotingiz · muddat — keyingi darsgacha):
  1. **Tugatish** — darsda ulgurmagan qadamlarni o'z repo'ngizda bajaring: ekranlar bosilsin, uch animatsiya ishlasin.
  2. **README** — `README.md` da talab va wireframe surati tursin, GitHub'ga yuborilgan bo'lsin.
  3. **Tekshirish** — prototipni telefon ko'rinishida bosib chiqing: wireframe'dagi har tugma kerakli ekranni ochadimi?
- Keyingi dars — «Arxitektura va platforma: web yoki mobil ilova»: prototip tayyor, endi uning ortida qanday qismlar turishi va qaysi platforma kerakligi navbati.
- Nishonlaringiz — N/4
- Tugmalar: Orqaga · Qaytadan · Yakunlash

---

## Nishonlar (4) — inglizcha nom va medal (o'yin qatlami)
- **Paper First** — wireframe'ga nima kirishini topdingiz (4-ekran, 1-savol)
- **Sample Data** — prototip nimani saqlamasligini bildingiz (7-ekran, 2-savol)
- **Clear Request** — talabning «nima buzilmasin» qatorini topdingiz (9-ekran, 3-savol)
- **Live Prototype** — ikkala amaliyot blokini oxirigacha bajardingiz (16-ekran, oxirgi «Bajardim») — bonus, birinchi urinish sharti yo'q (152)
- Nishon olinganda: <nishon nomi> · <tavsifi> · bosib davom eting

## Qisqa takrorlash oynalari (5) — har ballik testga 3 karta (S-026: kod qatori bor joyda kod, qolganida raqam)
Oyna yorlig'i: Qayta tushuntirish · tugmalar: ← Oldingi · Keyingisi → · ✓ Tushunarli — davom etamiz

1. 1-savol (4-ekran) — «Wireframe — joy, rang emas»
   - 1 · Wireframe — ekranning qog'ozdagi sodda chizmasi: qayerda nima turadi.
   - 2 · Qog'ozga sarlavha, kartalar, tugmaning joyi va ekranlar orasidagi strelka chiziladi.
   - 3 · Rang, shrift va logotip chizilmaydi — ular keyin tanlanadi.
   - Sinfga savol: «Qo'shilaman» qayerda turishini qog'ozda qanday ko'rsatasiz?
2. 2-savol (7-ekran) — «Prototip saqlamaydi»
   - Ma'lumot namuna fayldan keladi · `qoshilgan: 8, kerak: 10`
   - «Qo'shilaman» dan keyin «9 / 10» faqat ochiq sahifada turadi · `src/namuna.js` o'zgarmaydi
   - Yangilansa, namuna boshidan ochiladi — yana «8 / 10» · `prototip/src/namuna.js`
   - Sinfga savol: Sahifa yangilanganda «8 / 10» qayerdan keladi?
3. 3-savol (9-ekran) — «Talabning uch qatori»
   - Qayerda — papka · `prototip/`
   - Nima qilsin — wireframe suratidagidek uch ekran, namuna ma'lumot bilan, bosiladi · `wireframe.jpg`
   - Nima buzilmasin — haqiqiy ma'lumot va Backend yo'q · `backend/` yo'q
   - Sinfga savol: «Nima buzilmasin» qatori bo'lmasa, agent nima qilishi mumkin?
4. 4-savol (13-ekran) — «Son silliq qaytadi»
   - Son kattalashadi · `.son.yangi { transform: scale(1.3); }`
   - O'zgarishga vaqt beriladi · `.son { transition: transform 0.3s; }`
   - `transition` `.son` da — o'sishda ham, qaytishda ham silliq · `setTimeout(…, 300)`
   - Sinfga savol: `transition` faqat `.son.yangi` da tursa, qaytishda nima bo'ladi?
5. Final (14-ekran) — «Qog'ozdan jonli prototipgacha»
   - 1 · Qog'ozda ekranlarni chizish · 2 · Surat bilan talab yozish
   - 3 · Agent qurgan ekranlarni qog'ozdagi bilan solishtirish
   - 4 · Uch animatsiya qo'shish
   - Sinfga savol: Nega animatsiya ekranlar tekshirilgandan keyin qo'shiladi?

## Kartochkalar (12)

| Old tomon (savol) | Orqa (javob) | Izoh |
|---|---|---|
| Wireframe nima? | Ekranning qog'ozdagi sodda chizmasi | Qayerda nima turadi |
| Wireframe'ga nima chizilmaydi? | Rang, shrift va logotip | Ular wireframe'dan keyin tanlanadi |
| Bu misolda o'yin e'loni funksiyasi qaysi ekranlarga bo'lindi? | O'yinlar, O'yin va E'lon berish | Har gap — o'zi bajariladigan ekranda |
| Prototip nima? | Bosiladigan, lekin hali haqiqiy ma'lumotsiz ekranlar | Ma'lumot — `namuna.js` da |
| Prototipda sahifa yangilansa, «9 / 10» nima bo'ladi? | «8 / 10» ga qaytadi | Bu prototip ma'lumotni saqlamaydi |
| Talab qaysi uch qatordan iborat? | Qayerda · nima qilsin · nima buzilmasin | Wireframe surati — talabga ilova |
| Bu darsda «nima buzilmasin» qatoriga nima yoziladi? | Haqiqiy ma'lumot va Backend yo'q | Prototip Backend'siz ishlaydi |
| Agent «Tayyor!» degach nima qilasiz? | Bosib, wireframe bilan solishtiraman | Farqlar — bitta tuzatish talabida |
| Bu kursda jonli prototip nima? | Animatsiyasi bor prototip | Karta, son va ekranlar orasidagi o'tish |
| Son silliq kattalashib qaytishi uchun `.son` ga nima yoziladi? | `transition: transform 0.3s;` | `.son.yangi` da — `transform: scale(1.3)` |
| Bu prototipda ekrandan ekranga silliq o'tishni nima qiladi? | Motion | Paket `motion` — 9-Modulda tanishgansiz |
| GitHub'da yangi repo qayerdan ochiladi? | «+» → «New repository» | Keyin kompyuterga `git clone` |

## Jonli viktorina (arena, 12 savol) — ✔ o'rni A·B·C·D ×3 (aylanma), ekran savollarining nusxasi emas (§144)
1. Wireframe nimani ko'rsatadi? ✔ Ekranda qayerda nima turishini · Tugmalar qaysi rangda bo'lishini · Sarlavha qaysi shriftda yozilishini · Ma'lumot qayerda saqlanishini
2. Tashkilotchi kun va soatni qaysi ekranda yozadi? O'yinlar ekranida · ✔ E'lon berish ekranida · O'yin ekranida · Kirish ekranida
3. Prototip qanday ekranlar? Do'konga chiqqan birinchi versiya · Qog'ozdagi rangsiz, sodda chizma · ✔ Bosiladigan, lekin haqiqiy ma'lumotsiz · Backend va Database'ning to'liq chizmasi
4. Prototipdagi o'yinlar ro'yxati qayerdan keladi? Database'dagi `oyinlar` jadvalidan · Backend'dagi yo'ldan · Telegram guruhidan · ✔ `namuna.js` faylidan ✎ F-1006-281: texnik atama faqat to'g'ri variantda edi (lint-tell, quruvchi)
5. Bu darsda talabning «qayerda» qatoriga nima yoziladi? ✔ `prototip/` papkasi · Telefon ekrani · GitHub sahifasi · `backend/` papkasi
6. Wireframe surati talabda nimaga kerak? Agentga ekran ranglarini tanlab beradi · ✔ Ekranlar qanday joylashganini ko'rsatadi · Agentga Backend'ni ulashga yordam beradi · Talabning uch qatori o'rniga yuboriladi
7. Agent «Tayyor!» dedi. Keyin nima qilasiz? Tekshirmasdan, uni GitHub'ga yuboraman · Talabni boshidan qayta yozaman · ✔ Bosib, wireframe bilan solishtiraman · Avval uch animatsiyani qo'shaman
8. Uchta farq topdingiz. Agentga qanday yozasiz? Loyihani o'chirib, boshidan yozdiraman · Faqat eng kattasini yozaman · Hech narsa — agent o'zi topadi · ✔ Uchalasini bitta tuzatish talabida
9. Jonli prototip qanday prototip? ✔ Animatsiyasi bor prototip · Telefonga o'rnatilgan prototip · Backend'ga ulangan prototip · Rangli chizilgan prototip
10. Karta bosilganda kichrayib qaytishi uchun nima kerak? `transition` va `font-size` · ✔ `transform` va `transition` · `initial` va `exit` · `display` va `width`
11. Bu prototipda ekrandan ekranga silliq o'tishni nima qiladi? `:active` holati · `scale(1.3)` qiymati · ✔ Motion kutubxonasi · `setTimeout` funksiyasi
12. GitHub'dagi repo'ni kompyuterga qaysi buyruq ko'chiradi? `git push` · `git commit` · `git status` · ✔ `git clone`

Kalitlar: A · B · C · D · A · B · C · D · A · B · C · D.
Fon so'zlari (`QZ_BG_SHAPES`, kod so'zlari — ru'da ham o'sha; R-008): wireframe · talab · prototip · `prototip/` · `namuna.js` · `transform` · `transition` · Motion · `git clone` · README · «8 / 10» · Maydon Jamoa

---

## KOD — razrabotkada qolipda yo'q yoki qo'shimcha kod kerak bo'ladigan joylar
1. **Skelet:** `src/skelet/NamunaDars.jsx` dan (JR-14). `SCREEN_META` 20 ekran: hook · rule · exploration ×2 · test · practice(mustaqil) · exploration · test · exploration · test · exploration(tekshirish) ·
   exploration · practice(kod) · test · test(final, `scope: 'final'`) · practice(blok) ×2 · stats · flashcards · summary. `INLINE_KEYS`: s4 **1 (B)** · s7 **2 (C)** · s9 **0 (A)** · s13 **3 (D)** · s14 sentinel **0**;
   QMustaqil (5), QKod (12) va bloklar (15, 16) — `practice: -1`. `LESSON_META.lessonId` — `m9-07-v1`.
2. **Bitta manba (180):** `JAMOA_EKRANLAR` (uch ekran va ulardagi bo'laklar), `NAMUNA_OYINLAR` (4 o'yin), `PROTOTIP_YOLI` (4 bo'lak — 1-ekran qadamlari va 14-ekran finali). 0–3, 5, 6, 8, 10, 11, 15, 16-ekranlar shundan o'qiydi.
3. **`JamoaTelefon`** komponenti: telefon ramkasi (191), uch ekran, holatlar `qogoz` (qalam chizig'i, rangsiz, qo'lyozma shrift — tizim shrifti, tashqi shrift yuklanmaydi) · `prototip` · `jonli` (uch animatsiya alohida yoqiladi: `karta`, `son`, `otish`);
   0-ekran uchun `agent` varianti (bitta uzun ekran: forma + kartalar). Bosiladigan qismlar faylda e'lon qilinadi (`// qolip-maket: jt-karta jt-qoshil jt-orqaga jt-elon jt-yangila`).
   `prefers-reduced-motion` da maketning o'z harakati to'xtaydi (DE-200). Logotip/emoji yo'q (D4).
4. **Motion darsning o'zida:** platformada `motion` paketi yo'q (9-Modul KOD 4 bilan bir) — 11-ekran va bloklar natijasidagi ekran o'tishi CSS/JS bilan **taqlid qilinadi**; matnda «Motion» — repo'dagi haqiqiy paket.
5. **2-ekran:** gap-tugma → ramka (avval tanlash, so'ng bosish — §16); to'g'ri juftlik jadvali `JAMOA_EKRANLAR` dan; 4/4 da strelkalar.
6. **3-ekran:** olti bo'lak bittadan (SABOQ 13), ikki tugma «Qog'ozga» / «Chizilmaydi»; qog'ozda qalam-chizish animatsiyasi (SVG `stroke-dashoffset`, reduced-motion da bir zumda).
7. **5-ekran (QMustaqil):** taymer 15:00 (qolipda yo'q — kichik `useTaymer`; sahifa yangilansa qolgan vaqt saqlanmaydi, «Taymerni boshlash» qayta bosiladi); `pm-m9d5-prd` o'qiladi (yo'q bo'lsa — erkin qator);
   saqlash `pm-m9d7-wireframe` = `{ funksiya, ekranlar: [{ nom, nima, tugma }] (2–3) }`; tekshiruv — kamida 2 ekranda `nom` va `tugma` bo'sh emas. Yonidagi qog'oz ramkalari formadan jonli chiziladi.
8. **6-ekran:** «Yangilash» — telefon ichidagi holatni boshlang'ichga qaytaradi (haqiqiy sahifa yangilanmaydi); `namuna.js` kartasidagi qator yonishi.
9. **8-ekran:** `QQadamlar` uslubida 3 qism, har qismda 2 variant; noaniq variant → daraxt/telefon «agent shunday qilishi mumkin» holatiga (oldindan chizilgan uch holat) + `QXato`; aniq → ✓; 3/3 da talab qutisi (mono).
10. **10-ekran:** solishtirish sahnasi (P-057) — tepada `qogoz`, pastda `prototip` (uch farq yashirilgan holat); bosish nuqtalari wireframe bo'laklarida; 3/3 da tuzatish talabi qutisi va prototip «tuzatilgan» holatga o'tadi.
11. **11-ekran:** uch kalit `JamoaTelefon` ning `jonli` bayroqlarini yoqadi; har kalitdan keyin tegishli element halqada (SABOQ 11); 3/3 da yorliq «prototip» → «jonli prototip».
12. **12-ekran (QKod) → `HtmlCompiler`** (ko'p fayl: `index.html`, `app.js` tayyor · `style.css` o'quvchi). Tekshiruvlar (stylesheet parse, regex emas): `.son` dagi `transition` ro'yxatida `transform` (yoki `all`) va birligi bor vaqt ·
    `.son.yangi` da `transform: scale(x)`, 1.1 ≤ x ≤ 1.5. «Bajardim» shartlar ✓ bo'lgach ochiladi (§19). Qoralama kaliti `pm-m9d7-code`.
    ⚠️ `style.css` starter `.jsx` ichida shablon-satr — CSS izohida backtik yo'q (CLAUDE.md; starter izohlari backtiksiz yozildi).
13. **15, 16-ekran** — `ScreenBlok` (skeletdagi ulagich) + `QPrompt` (2-qadamlar; `{…}` joylari). A1 2-qadamda `{ekranlar va ulardagi narsalar}` va `{qaysi tugma qaysi ekranni ochadi}` `pm-m9d7-wireframe` dan oldindan yoziladi
    (tahrirlanadi); har `{…}` yonida kulrang «masalan: …» (Mentor misolidan); «Yordam» — Mentor misolidagi to'liq talab (ochiladigan). 4 qadam, 5-qadam yo'q (tayanch 4, 06.10 01:08).
    ⚠️ Qolipda yo'q (11-Modulning hamma bloklari uchun — `src/qolip` asosiy seansniki): `QPrompt` da `{…}` joyi yonida kulrang «masalan: …» va oldindan yozilgan, tahrirlanadigan qiymat;
    qadam ichida ochiladigan «Yordam» (to'liq namuna talab); `QM.ortda` yorlig'i hozir «Ortda qoldingizmi — mentor bilan:» — 11-Modul modelida «Mentor misolini ochib ko'ring» (yorliq matni — asosiy seans qarori). O'ngda `JamoaTelefon` (A1 — `prototip`, A2 — `jonli`, o'zi aylanadi) + repo daraxti / GitHub sahifasi ko'rinishi.
    `ortda`: Mentor repo'si buyruqlari (tayanch 3) — faqat A1 da, darsda bir marta (F-1006-271). `ACH_TRIGGERS`: A2 oxirgi «Bajardim» → Live Prototype.
14. `RECAPS` 5 (kalit = 4, 7, 9, 13, 14) · `Q_LABELS` {4, 7, 9, 13, 14} · `ACHIEVEMENTS` 4 · `QUIZ_BANK` 12 (to'g'ri javob 3/3/3/3) · flashcard 12 (alohida ekran, Mentor yo'q, «Kartani bosing — javob ochiladi», SABOQ 16) ·
    `HW_TOKENS` fon so'zlari {uz, ru} (skelet namunasidagi `hodisa` so'zi olinadi).
15. Test savoli ustida «To'g'ri javobni tanlang» yorlig'i yo'q (SABOQ 6) — skeletdan ko'chirilmaydi.
16. **Darvozalar:** `npm run gates -- src/9-Modull/LivePrototypeLesson.jsx` 12/12 · `npm run lint:jsx` · `lint:olchov` 0 · `lint:emoji` · `lint:layout` 1280/1366/390 · surat 1280 + 393.

## REPO — `maydon-jamoa` (yangi; «qur» bosqichida yoziladi, GitHub'da ochish va push — buyruq bilan; `m11-dars-07-start` = `main` → `m11-dars-07-done`)
1. `wireframe.jpg` (repo ildizida) — qog'ozda qalam bilan chizilgan uch ekran (O'yinlar · O'yin · E'lon berish), telefonda olingan surat; haqiqiy qog'oz surati (P-028 — o'quvchi ko'radigan fayl).
2. `prototip/` — React + Vite (`npm create vite@latest`, `react` shabloni), `motion` paketi. `src/namuna.js` — 4 o'yin (`NAMUNA_OYINLAR` bilan aynan: `id` (`'1'`…`'4'`), `kun`, `soat`, `maydon`, `qoshilgan`, `kerak` — `id` 9-dars `[id].tsx` uchun, 09-FILTR 17).
   Uch ekran: O'yinlar (kartalar, «E'lon berish») · O'yin («‹ O'yinlar», tafsilot, qo'shilganlar doiralari, «Qo'shilaman» → son +1, «Qo'shildingiz») · E'lon berish (forma, «Yuborish» → ro'yxatga qo'shiladi, faqat React state).
   Navigatsiya — React state (router kutubxonasi shart emas; agent tanlaydi — tayanchda yo'q).
3. Animatsiyalar: karta `transform: scale(0.95)` + `transition: transform 0.15s` · son `motion.span` (kattalashib qaytadi, 0.3 s) yoki CSS `transform` + `transition` · ekran o'tishi `AnimatePresence` + `motion.div`
   (`initial`/`animate`/`exit`, 0.3 s) · `<MotionConfig reducedMotion="user">`. Backend'ga so'rov yo'q, `localStorage` yo'q.
4. `README.md` — «Maydon Jamoa» bir gap · «Talab» bo'limi (A1 talabi, Mentor qiymatlari bilan) · `![wireframe](wireframe.jpg)` · «Ishga tushirish: `cd prototip` · `npm install` · `npm run dev`» · «Darslar va teglar» jadvaliga `m11-dars-07-done` qatori.
5. **Muhrdan oldin haqiqiy sinov (P-028):** toza papkada `git clone` → `git checkout -f m11-dars-07-done` → `npm install` → `npm run dev`; Chrome telefon ko'rinishida uch ekran, uch animatsiya; OS da harakatni kamaytirish → kichrayish va surilish o'chadi.
   Antigravity'da A1/A2 talablari bilan bo'sh repo'dan bir marta qurib ko'riladi (agent surat faylini o'qiy oladimi — Shubhali 1).

---

## TAYANCHGA SAVOL (o'zim qaror qildim — tasdiq kerak)
1. **Talab zinapoyasi 7-darsda:** blok modeli tayanch 4 bo'yicha (06.10 01:08: 4 qadam, hammasi o'z repo'sida, `{…}` yonida «masalan», «Yordam»da Mentor talabi, 5-qadam yo'q) — qo'llandi.
   Zinapoya esa faqat 10–14-darslar uchun yozilgan; 7-darsda o'zim tanladim: A1 — tayyor talab + uchta joy (ikkitasi mustaqil ishdan oldindan yoziladi), A2 — tayyor talab + ikkita joy.
   README + push — A2 4-qadamida («Tekshirish» oxirida, 10-Modul naqshi), alohida qadam emas.
2. **Yangi saqlash kaliti `pm-m9d7-wireframe`** `{ funksiya, ekranlar: [{ nom, nima, tugma }] }` — 5-ekran yozadi, A1 prompti o'qiydi. Tayanch 8-bo'limda yo'q. 9-dars (ekranlarni Expo'ga ko'chirish) ham o'qishi mumkin.
3. **Namuna ma'lumot — yopildi: tayanch 9.2** (07-FILTR 7). 4 o'yin — Shanba 18:00 Mahalla maydoni 8/10 · Shanba 20:00 Maktab maydoni 6/10 · Yakshanba 10:00 Park maydoni 4/8 · Yakshanba 17:00 Mahalla maydoni 9/10; maydon nomlari umumiy (tuman nomi yo'q).
   Kun — kartaning o'zida, kun sarlavhalari yo'q (13-dars tuzatishi «har kun o'z sarlavhasi bilan» real ilovada bo'ladi — to'qnashmaydi).
4. **Qo'shilganlar** — ismsiz doiralar (tayanch 1: odamlar ismsiz); qo'shilgandan keyin tugma «Qo'shildingiz» (o'chiq) — tayanchda tugmaning keyingi holati yo'q.
5. **«8 / 10» → «9 / 10» silliq o'zgaradi** — bu darsda «son almashadi va bir lahza kattalashib, silliq qaytadi» (`transform` + `transition`) deb aniqlandi. Sabab: kod oynasida faqat 9-Modulda o'tilgan CSS bilan yozish mumkin;
   Motion'ning tayyor son komponenti (`AnimateNumber`) — pullik Motion+. Repo'da shu ko'rinish Motion yoki CSS bilan (agent tanlaydi).
6. **Repo ko'rinishi Public — yopildi: GATE M 07-q0 A** (foydalanuvchi, 06.10); A1 da «shaxsiy ma'lumot yozmang» qatori (07-FILTR 6). Eski izoh: Qaror-0 da yo'q. Private kerak bo'lsa — 1-qadam bir so'z o'zgaradi.
7. **Wireframe surati joyi** — `wireframe.jpg` repo ildizida (README yonida); tayanch 3 da faqat «README.md — talab va wireframe surati». Surat telefondan kompyuterga — umumiy so'z bilan («o'tkazing»), aniq yo'l yozilmadi.
8. **Prototipda faqat birinchi funksiya** (o'yin e'loni va qo'shilish) — tayanch 1.6 uch ekrani shunday. «Kelaman» va «Chiqish»/navbat prototipda yo'q; o'quvchi o'z PRD sidan bitta funksiyani tanlaydi (5-ekran).
9. **Texnologiya promptda:** A1 «yangi React + Vite loyihasi», A2 «`motion` paketini o'rnat» — repo yangi va bo'sh, stack hali README da yo'q (P-060 «texnologiya repo'da» shu sababli bajarilmaydi). Tayanch 3 dagi `prototip/` steki bilan mos.
10. **Push buyrug'i darsda:** o'quvchi o'z repo'siga `git push` qiladi (10-Modul push odati: `git status` → `git add <fayl>` → commit → push). Mentor repo'siga push — faqat «qur» da, buyruq bilan.

## Shubhali joylar (ishonchim komil emas)
1. **Antigravity surat faylini o'qiydimi:** rasmiy hujjatda rasm qo'yish faqat Antigravity CLI uchun yozilgan (antigravity.google/docs/cli/prompting); Editor'dagi agent paneli uchun rasmiy yozuv topilmadi.
   Shuning uchun A1 talabi ekranlarni **so'z bilan ham** aytadi (`{ekranlar va ulardagi narsalar}`) — surat o'qilmasa ham agent quradi. REPO 5 da sinab ko'riladi.
2. **GitHub README yorlig'i:** rasmiy hujjat «You can create a README» deydi; formadagi aniq yozuv (eski «Add a README file» katagi yoki yangi «Add README» kaliti) ko'rilmadi — matnda umumiy so'z: «README qo'shishni yoqing».
   «+» · «New repository» · «Repository name» · «Public» · «Create repository» — rasmiy hujjatdan aynan.
3. **«Nom band desa — oxiriga raqam qo'shing»** — GitHub bir akkauntda bir xil nomli repo'ga ruxsat bermaydi (umumiy bilim); xabar matni yozilmadi.
4. **`git push` va kirish:** yangi o'quvchi kompyuterida push GitHub'ga kirishni so'rashi mumkin; xato yo'li — «Shu xato chiqdi: {xato}. Tuzat.» (agent yo'l ko'rsatadi). Kirish oynasi nomi yozilmadi (P-028).
5. **0-ekran da'vosi** «agent bitta uzun ekran qurdi» — bu misoldagi holat («Bu misolda …» bilan), agent har safar shunday qiladi demaydi (T-043).
6. ~~**5-ekran Mentor gapi** «… odatda Figma …»~~ — **yopildi (07-FILTR 13):** «Figma kabi dasturda ham chizish mumkin». Eski izoh: — umumiy bilim, statistika emas; Figma'da ham bosiladigan prototip qilish mumkin — matn buni inkor qilmaydi, faqat «bugun qog'oz va kod» deydi.
7. **8-ekran noaniq variantlar natijasi** (fayllar sochiladi, «Kirish»/«Chat» ekranlari, `backend/`) — agent shunday qilishi **mumkin** (maket misol, 9M-08 naqshi), kafolat emas; `QXato` lar «mumkin» bilan.
8. **«qo'lyozma uslubi»** qog'oz holatida — tashqi shrift yuklanmaydi (KOD 3); qalam chizig'i ko'rinishi vizual bosqichda namuna bilan solishtiriladi.
9. **Vaqt:** ≈ 90 daqiqaga zich (15 daqiqa qog'oz + ikki blok). Ulgurmasa A2 uyga vazifaning 1-bandiga o'tadi (O'qituvchi eslatmasi, 1-ekran).

---

## GATE M — o'z tekshiruvim
- [x] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): `m9-06` «Bitiruvgacha nimani qachon qurasiz?» → **`m9-07` «Jonli prototip: qog'ozdan bosiladigan ekrangacha»** (osti «wireframe → talab → bosiladigan prototip») → `m9-08` «Arxitektura va platforma: web yoki mobil ilova»; reja teglari `sub` bilan.
- [x] Bitta misol-ip («Maydon Jamoa», hook → bloklar); metafora yo'q; bitta vizual — `JamoaTelefon` uch holatda (qog'oz · prototip · jonli); o'quvchining o'z mahsuloti — 5-ekran va bloklar.
- [x] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 2, 3, 6, 8, 10, 11 (va 0, 5, 12, 14, 15, 16) — matn-karta yo'q; bashorat (6) tanlangach ixcham qator bo'lib qoladi.
- [x] Sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — o'lchov skripti (scratchpad `md07/olchov.py`, 06.10): sarlavhalar 25–54 · xulosalar 81–97 · hook javoblari 82–108 («Aynan!»/«Qiziq fikr!» bilan) · test xato izohlari 45–59 · `QXato` qatorlari 50–60 · Mentor hamma ekranda 1–2 gap.
- [x] Atamalar tayanch 2-bo'lim bilan aynan (wireframe, prototip, jonli prototip, Figma — bir marta, talab, namuna ma'lumot, tashkilotchi, o'yinchi); 9-Modul so'zlari (`transform`, `transition`, Motion, Antigravity, «Shu xato chiqdi…»);
      siz-forma; ketma-ketlik va yorliq ot-shaklda (`PROTOTIP_YOLI`), tugma siz-formada yoki ot («Yuborish», «Saqlash»); agent promptlari sen-buyruqda (T-002).
- [x] Testlar: variantlar bir shaklda, uzunligi o'rtachadan −11%…+9% (to'g'ri javob hech qayerda yolg'iz eng uzun emas; arena ham tekshirildi); qo'shtirnoq/kod/tire faqat to'g'rida emas · ✔: s4 B · s7 C · s9 A · s13 D · arena A·B·C·D ×3.
- [x] Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi; tartib 1-ekran qadamlari bilan bitta manba (P-063).
- [x] Emoji yo'q (nishon medali, arena, podium — o'yin qatlami) · kafolat gaplari yo'q («har doim», «100%», «darrov», «darhol», «albatta» — yo'q; «odatda» ikki joyda: Figma gapi, Vite porti).
- [x] Ichki kodlar o'quvchi matnida yo'q (F1–F3, `m9-07`, modul kod raqami); modul raqami LMS bo'yicha («9-Modulda»); tarixiy voqea yo'q; tashqi xizmat nomlari rasmiy hujjatdan (A-10) yoki umumiy so'z + Shubhali 2–4 · «KOD» (16) va «REPO» (5) ro'yxati to'liq.
- [x] Karta T · P · S ko'rildi: T-002 (promptlar) · T-008 (0-ekran chati) · T-011 (wireframe, prototip, jonli prototip — harakatdan keyin; sarlavhalarda yangi atama yo'q, «Wireframe» sarlavhada faqat 3-ekrandan keyin) ·
      T-014/015 («chizma» faqat qog'ozdagi; «keyinroq» ishlatilmadi — roadmap ufqi; «karta» — o'yin kartasi, kartochka emas) · T-016/017 · T-024 · T-029 · T-039 («ekranlaringiz», «wireframe'ingiz» — 5-ekranda yaratilgandan keyin) ·
      T-043 («bu misolda», «mumkin») · T-045 (prototip saqlamaydi — rost; Figma inkor qilinmadi) · T-052 (talab — 9-Modul) · T-064 (dars ekrani «ekran» deb atalmadi: «mustaqil ishdagi yozuvingiz») ·
      P-001/002/004 · P-008 · P-013 · P-015 · P-016 · P-025 · P-026 (har tashqi qadamda xato yo'li bitta gap) · P-028 · P-036 · P-040 (10-ekran «0 / 3») · P-046 · P-052 · P-057 (10-ekran) · P-059 · P-062 · P-063 · P-064 (6-ekran) · P-065 (6-ekran `namuna.js`) · P-067 ·
      S-001 · S-002 · S-004 · S-006 · S-008 · S-010 · S-018 (brend yo'q) · S-020 · S-026 · S-040 (3-ekran bo'laklari bir xato-sinf: ko'rinish) · SABOQ 6, 11, 12, 13, 16, 17.
