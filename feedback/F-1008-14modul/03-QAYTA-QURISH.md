# 3-dars «Mahsulot tezligi» — qayta qurish spetsifikatsiyasi (F-1008-594; 08.10.2026)

> Asos: foydalanuvchi ko'rigi F-1008-580…593 (rasmlar `rasm/F-1008-580…593-*.png`) va ikki qarori (08.10, AskUserQuestion):
> **(A) tanish brend saytlari — texnik darslarda (3, 4, 6, 7); pitch darslarida (1, 2, 5, 8, 13) Mentorning o'z mahsuloti qoladi.**
> **(B) 11-ekran — kod oynasi o'rniga haqiqiy Lighthouse hisobotidan tuzatish tanlash.**
> Foydalanuvchi so'zi: «futbol jamoasi kerakmas — odamlar biladigan saytlar bo'lsin; o'zi tanigan saytning sekin yuklanishini ko'rsa «vauv» deydi, qiziqishi uyg'onadi; keyin o'z saytining tezligini oshiradi» · «mehr berilmagan, realga o'xshamayapti».
> Bu fayl 03 MD ning sahna va 11-ekran bo'limlari ustidan turadi (ziddiyatda shu fayl to'g'ri); MD ning qolgan matni (sarlavhalar, Mentor gaplari, testlar, bloklar) — o'zgarmaydi, faqat pastdagi «Matn o'zgarishlari» ro'yxati.
> Yakuniy MD (konveyer 8) shu faylni MD ichiga birlashtiradi.

## 1. Sonlar — faqat haqiqiy o'lchov (yagona manba)
`vositalar/olchov-2026-10-08.json` — 08.10.2026, Lighthouse 13.5.0, Mobile (simulated throttling), har sayt **bir o'lchov**. Kodga `TANISH_SAYT` konstantasi sifatida aynan shu sonlar kiradi (yaxlitlash shu fayldagidek).

| Sayt | Mobile baho | Desktop | FCP | Speed Index | LCP | TBT | CLS | Ishlatiladi |
|---|---|---|---|---|---|---|---|---|
| YouTube | 31 | 28 | 6,3 s | 7,1 s | 7,8 s | 1 997 ms | 0,001 | 0 (hook), 1, 4 (LCP — matn bloki) |
| OLX | 30 | 60 | 3,1 s | 10,8 s | 7,5 s | 7 725 ms | 0,066 | 1, 4 (LCP — e'lon rasmi), 9 (TBT, keraksiz JS 1 354 KiB), 11 |
| Kun.uz | 54 | 74 | 1,7 s | 6,4 s | 3,8 s | 2 141 ms | 0,006 | 1, 2 (Mobile ↔ Desktop: 74 · FCP 0,8 · SI 1,6 · LCP 3,5 · TBT 174 · CLS 0) |
| Texnomart | 9 | — | 1,8 s | 13,0 s | 19,8 s | 5 170 ms | 1,544 | 5 (CLS — pastki qism 5 marta siljigan) |
| Olcha | 36 | — | 1,6 s | 9,6 s | 6,1 s | 4 114 ms | 0,106 | 11 (6 ta rasmda `width`/`height` yo'q) |

**Halol qoidalar (o'quvchi matnida aynan shu ruhda):**
- Har son yonida kichik kulrang manba qatori: «Lighthouse · Mobile · 08.10.2026, bir o'lchov» (birinchi marta to'liq, keyin «08.10 o'lchovi»).
- Sayt haqida baho yo'q («yomon sayt», «sekin sayt» — yo'q). Gap shakli: «bu o'lchovda baho 31 chiqdi» · «katta saytlarda ham baho past chiqishi mumkin: Mobile rejimi sekin telefon va internetni taqlid qiladi».
- Lighthouse UI so'zlari (FCP, LCP, TBT, CLS, Speed Index, «Reduce unused JavaScript» …) — inglizcha, UI yozuvi sifatida; izoh o'zbekcha.
- Sayt nomi — o'z rangida matn, **faqat tasdiqlangan rang**: YouTube `#FF0000` · Texnomart `#FBC100` (sayt `theme-color`, 08.10; sariq matn o'qilmaydi — `ink` matn + sariq nuqta). OLX, Kun.uz, Olcha — rang tasdiqlanmagan (kadr 124 px): qurishda saytning sarlavhasidan 390 px skrinshot bilan o'lchanadi va shu faylga yoziladi; ungacha nom `ink` rangida (taxminiy rang yo'q); **logotip, sayt surati (skrinshot) yo'q** — skrinshotda tasodifiy e'lon/yangilik/reklama chiqadi (08.10 kadrlari tekshirildi: Kun.uz da o'smirga noo'rin sarlavha va to'liq ekran reklama).
- Sayt sahifasi — **soddalashtirilgan maket** (tanish tuzilish: qidiruv satri, kategoriya belgilari, kartalar — kulrang joylar, matn yo'q yoki umumiy so'z), ostida kichik yorliq «soddalashtirilgan sahna». Maketda real e'lon/yangilik/odam yo'q.

## 2. Ekranlar — yangi sahna (matnlar MD dan, faqat ✎ joylar yangi)

### 0 · Kirish (F-580: variantlar uzun, sahifa xunuk)
- Maket — **telefon brauzeri** (≈260×470, telefon ramkasi, manzil satri `youtube.com`), sahifa — YouTube'ning soddalashtirilgan bosh sahifasi (tepada nom «YouTube» o'z rangida, qidiruv satri, 3 ta video kartasi — kulrang to'rtburchak + ikki kulrang chiziq).
- «Ochish» → **qora ekran ≈2 s** (Lighthouse kadrlarida sahifa 2,3 s qora turgan — `kadr` tekshirilgan) → qidiruv satri → kartalar birma-bir; ostida taymer «0,0 s … 7,8 s» (LCP vaqtigacha, soddalashtirilgan tezlikda — yorliq «sahnada tezlashtirilgan»).
- Javobdan keyin maket ostida Lighthouse doirasi **31** (qizil) + manba qatori. Hook javobi MD dagidek.
- Joylashuv: maket chapda (ustun 300 px), variantlar o'ngda **max 460 px** — variant kartalari ekran bo'yi cho'zilmaydi; o'ng ustun tepadan, maket bilan bir balandlikda markazlanadi (13-Modul P2).

### 1 · Reja (F-581, F-592: «Dars oxirida» maketi real emas; ikki «—» doira hech narsani o'zgartirmaydi)
- «Dars oxirida» chap qism: tepada **uch haqiqiy doira** yonma-yon — YouTube 31 · OLX 30 · Kun.uz 54 (nomlari o'z rangida, ostida «08.10 o'lchovi»); ✎ ostida bitta gap: «Tanish saytlar ham shunday o'lchanadi — bugun o'z lendingingizni o'lchaysiz.»
- Ostida `TEZLIK.md` kartasi — **o'quvchining o'z** sonlari (`pm-m12d3-tezlik.oldin/keyin`), yo'q bo'lsa ustunlarda kulrang «o'lchaysiz» (son ham, «—» ham emas).
- Mentor bilan taqqoslash doirasi («Oldin · Keyin» ikki «—») — olib tashlanadi.

### 2 · Lighthouse bahosi (F-582: panel real emas)
- Brauzer: Kun.uz soddalashtirilgan bosh sahifasi (nom o'z rangida, katta yangilik rasmi joyi, 4 ta yangilik qatori — kulrang chiziqlar).
- Panel — **Chrome DevTools'dagi Lighthouse hisobotiga o'xshash**: tepada yorliqlar qatori (`Mode: Navigation` · `Device: Mobile | Desktop` · `Categories: Performance`), «Analyze page load»; natija: katta doira (rang — oraliq bo'yicha), ostida «Performance», kulrang «Values are estimated and may vary»;
  **METRICS** sarlavhasi va ikki ustunli 5 metrika — har biri oldida Lighthouse belgisi: qizil ▲ (yomon) · to'q sariq ■ (o'rtacha) · yashil ● (yaxshi), nomi, qiymati katta. Mobile: FCP 1,7 s ● · LCP 3,8 s ■ · TBT 2 140 ms ▲ · CLS 0,006 ● · Speed Index 6,4 s ▲ → baho **54**.
- «Desktop» → xuddi shu sahifa: **74** (FCP 0,8 s · LCP 3,5 s · TBT 174 ms · CLS 0 · SI 1,6 s), yorliq «boshqa sharoit», 2 s dan keyin Mobile'ga qaytadi. Halol izoh (MD QIzoh bor) — o'zgarmaydi.

### 4 · LCP (F-584: yaqqol emas)
- OLX soddalashtirilgan bosh sahifasi: qidiruv satri, kategoriya belgilari (8 ta doira), «Рекомендованное» — 2 e'lon kartasi (birinchisining **rasmi — LCP elementi**, kulrang joy → rasm). Vaqt chizig'i: ochildi · birinchi matn **3,1 s** · eng katta narsa **7,5 s** · (haqiqiy FCP/LCP).
- 2-qadam — sahifadagi elementlardan «eng katta»sini bosish (qidiruv · kategoriya · e'lon rasmi); to'g'ri — e'lon rasmi; ✎ izoh: «Bu o'lchovda eng katta narsa — e'lon rasmi; YouTube'da esa matn bloki edi.» (rasmiy: LCP — rasm yoki matn bloki).

### 5 · CLS (F-585: yaqqol emas)
- 1-qadam (haqiqiy hodisa): Texnomart soddalashtirilgan sahifasi — pastki qism 5 marta sakraydi (har sakrashda qizil iz, hisoblagich «siljish: 1 … 5»), panelda CLS **1,544** qizil ▲ (rasmiy chegara 0,1).
- 2-qadam (sabab va tuzatish — namuna sahifa, yorliq «namuna»): rasm kelganda tugma pastga suriladi → o'chirgich `width` va `height` → joy oldindan band, tugma joyida. Kod kartasi o'zgarmaydi.
- Ikki holat yonma-yon ko'rinishi (o'lchamsiz · o'lcham bilan) — kattaroq (har biri ≈220 px), sakrash animatsiyasi aniq (0,4 s, qizil iz qoladi).

### 7 · Keyin yuklash (F-586, F-591: maket kichik va bo'sh)
- Haqiqiy saytga da'vo yo'q (Lighthouse 13 da alohida audit yo'q) — **«e'lonlar sahifasi (namuna)»**: telefon brauzeri ≈260×470, 6 e'lon kartasi (rasm joyi + ikki kulrang chiziq), «birinchi ekran» chizig'i aniq; pastdagi kartalar rasmlari «hali yuklanmagan» (kulrang + `lazy` yorlig'i) → aylantirganda birma-bir yuklanadi.
- O'ngda «Yuklanmoqda» ro'yxati va vaqt chizig'i — MD dagidek, lekin har qator real rasm nomi o'rniga «1-e'lon rasmi» … «6-e'lon rasmi».

### 9 · TBT va kod hajmi
- Ilova sahifasi o'rniga **OLX soddalashtirilgan sahifasi**; panel: TBT **7 725 ms** ▲, «Reduce JavaScript execution time 13,2 s», «Reduce unused JavaScript — Est savings of 1 354 KiB» (inglizcha — UI yozuvi, ostida o'zbekcha izoh).
- Kod ustuni: «sahifa kodi» · «kerakli kutubxonalar» · «ishlatilmaydigan kod ≈1,3 MB» (kulrang, chizilgan) — «Olib tashlash» bosilganda chiqib ketadi (namuna — ✎ yorliq «agar olib tashlansa — soddalashtirilgan sahna»; OLX haqida «olib tashladi» deyilmaydi).
- `IlovaSahifa` (Maydon Jamoa kartasi) — olib tashlanadi.

### 11 · ✎ YANGI — Haqiqiy hisobotdan tuzatish tanlash (F-587, qaror B) — `QTushuncha` (ballsiz mashq, `practice: -1`)
- Eyebrow: Mashq · haqiqiy hisobot
- Sarlavha: **Hisobotdagi topilmaga qaysi tuzatish mos?** (41)
- Mentor: Bu topilmalar — tanish saytlarning 08.10 hisobotidan. Har kartaga mos tuzatishni tanlang.
- Karta dastasi (SABOQ P4/P8 naqshi, bittadan, «1 / 3»): har kartada sayt nomi (o'z rangida), Lighthouse belgisi va UI yozuvi + o'zbekcha izoh:
  1. **OLX** ▲ `Reduce unused JavaScript` — «Est savings of 1 354 KiB» · izoh: «Sahifa ishlatmaydigan kod ham yuklanadi.» → to'g'ri: **Keraksiz kodni olib tashlash**
  2. **Olcha** ■ `Image elements do not have explicit width and height` — «6 ta rasm» · izoh: «Rasmlarda o'lcham yozilmagan.» → to'g'ri: **Rasmga width va height yozish**
  3. **OLX** ▲ `Total Blocking Time` — «7 725 ms» · izoh: «Ochilishda brauzer kod bilan band bo'lgan.» → to'g'ri: **Keraksiz kodni olib tashlash**
- Uch tugma (har kartada bir xil, har biri o'z chegarasi): «Rasmga width va height yozish» · «Keraksiz kodni olib tashlash» · «Pastdagi rasmga loading="lazy" qo'yish».
  Xato — `QXato` (≤60): «Bu topilma boshqa narsa haqida: izohni qayta o'qing.»
- Tugagach xulosa: «Hisobotdagi topilma qaysi tuzatish kerakligini ko'rsatadi; qilishdan oldin dalilni tekshirasiz.» (≤110) · `QIzoh`: «1-amaliyotda o'z lendingingiz uchun agent shunday ro'yxat beradi — siz tanlaysiz.»
- O'qituvchi eslatmasi: «Topilmalar — 08.10.2026 dagi bitta Lighthouse o'lchovidan (Mobile); qayta o'lchansa son biroz farq qiladi. «Est savings» — Lighthouse taxmini, kafolat emas.»
- Kod oynasi (`HtmlCompiler`, `namuna.js`, `pm-m12d3-code`) — olib tashlanadi; `width`/`height`/`loading` ni qo'lda yozish 5- va 7-ekran kod kartalarida ko'rinadi, o'z lendingida — A2 da agent qiladi.

### 13–15 · Bloklar — kutilgan natija (F-592)
- «kutilgan natija · namuna: Maydon Jamoa» → **«kutilgan natija»**: `TEZLIK.md` maketi o'quvchining o'z sonlari bilan (kalitdan; yo'q bo'lsa kulrang «shu yerga yozasiz»), Mentor sonlari (`MENTOR_OLCHOV`) va bo'sh «—» doiralar — olib tashlanadi.
- A1 «Agent ro'yxati» maketi — namuna qatorlar «rasm fayli · hajmi · pastda · `width` yo'q» (kulrang, son yo'q).
- «Ortda qoldingizmi» — `maydon-jamoa` repo'si hali yo'q (GitHub 404, 08.10) → qator olib tashlanadi (A1 dagi o'z lendingi bilan ishlaydi).

## 3. Global (SABOQ P7–P11 bilan bir) — 03 da allaqachon qilingan
⛶ burchakda · kartochka neytral · yakuniy tartib karta dastasi · blok tugagach kam element.

## 4. Matn o'zgarishlari (o'quvchi ko'radigan — MD ga yakuniy bosqichda)
- 1-ekran O'qituvchi eslatmasi: «11-ekran (kod oynasi)» → «11-ekran (haqiqiy hisobot mashqi)».
- 0-ekran: maket ostidagi manba qatori (yangi) · 1-ekran ✎ gap · 4-ekran ✎ izoh · 11-ekran — butunlay yangi (yuqorida).
- Kartochka/arena/test matnida «kod oynasi» yoki «Maydon Jamoa» bo'lsa — qurishda grep, sahnaga mos almashtiriladi (ro'yxat hisobotga).
- `QUIZ_BANK`, testlar (3, 6, 8, 10) — o'zgarmaydi (✔ o'rni ham).

## 5. Qolgan texnik darslar (4, 6, 7) — MD yozilgan, kod yo'q
Sahna misollari shu jadvaldagi saytlardan, faqat haqiqiy son (yangi o'lchov kerak bo'lsa — sana bilan, `vositalar/olchov-*.json`); o'quvchining o'z mahsuloti — amaliyot bloklarida. Mentorning «Maydon Jamoa» si — faqat pitch darslarida (tayanch 9.91).

## 6. Qurildi (14:39, Opus agent + asosiy seans) — yakuniy MD ga ko'chiriladigan yangi matnlar
- 0: «sahnada tezlashtirilgan» · «YouTube · Performance» · «Lighthouse · Mobile · 08.10.2026, bir o'lchov»; «Ochish» telefon ekrani o'rtasida, hook telefoni 390 px (asosiy seans — F-580 davomi).
- 1: «Tanish saytlar ham shunday o'lchanadi — bugun o'z lendingingizni o'lchaysiz.» · «08.10 o'lchovi» · `TEZLIK.md` «o'lchaysiz» · Ustoz «…12-ekran (haqiqiy hisobot mashqi)…».
- 2: «soddalashtirilgan sahna»; tugagan holatda telefon yashirinadi (sig'ish). Ustoz — Kun.uz 08.10 o'lchovi, Mobile 54 / Desktop 74.
- 4: Mentor «Sahifani qadamma-qadam oching — «Sekin ochish» ni bosing.» · «E'lonlar» · «birinchi matn · 3,1 s» · «eng katta narsa · 7,5 s» · xulosa «Bu o'lchovda eng katta narsa — e'lon rasmi; YouTube'da esa matn bloki edi.»
- 5: «namuna» · «siljish: N» · «pastki qism 5 marta siljigan · rasmiy chegara: 0,1».
- 7: «e'lonlar sahifasi (namuna)» · «E'lonlar» · «1-e'lon rasmi» … «6-e'lon rasmi».
- 9: Mentor «Endi sahifani oching va «Qidirish» ni bosib ko'ring — «Ochish va bosish» ni bosing.» · «Sahifa ishlatmaydigan kod ham yuklanadi — «Olib tashlash» ni bosing.» · «sahifa kodi» · «ishlatilmaydigan kod ≈1,3 MB» · «agar olib tashlansa — soddalashtirilgan sahna».
- 11: spetsifikatsiyadagidek + «Avval tanlang», «6 ta rasm», eyebrow «Mashq · haqiqiy hisobot».
- 13–15: «kutilgan natija» · «shu yerga yozasiz» · namuna qatorlar; «Ortda qoldingizmi» olib tashlandi.
- Chetlashishlar: Kun.uz TBT 2 141 (JSON) · «13,2 s» qo'yilmadi (JSON da yo'q) · OLX/Kun.uz/Olcha nomi `ink` (rang tasdiqlanmagan).

