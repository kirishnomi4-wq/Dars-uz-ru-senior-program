# 6-Modul (LMS: 8-Modul) · 7-dars «O'z Skill'ingizni yozing» — MD v3

Fayl: `src/6-Modull/WriteSkillLesson.jsx` · 20 ekran (kod-darsi tuzilmasi o'zgarmaydi) · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `07-WriteSkill-v2.md` (F-0929-09, F-0929-26, F-0929-27 Q1-B) · namuna: `01-SystemArchitecture-v3.md` · guruh G1 (texnik).
Menyu: `App.jsx` `m6-07` «O'z Skill'ingizni yozing» = dars nomi (DE-205) ✓ · oldingi: 6-dars (PM) «Ilova o'zi qaror qilsa, kimga tegadi?» · keyingi: 8-dars «Praktika: to'liq pipeline».
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ To'g'ri javob O'RNI o'zgarmaydi: `INLINE_KEYS = { s4: 3, s8: 0, s10: 2, s14: 3, s15: 0, practice: -1 }` · 13-ekran bo'shliqlari (✔ `name` 2-variant, `description` 1-variant, `---` 3-variant) ·
arena kaliti `[2,0,3,1,0,3,1,2,3,1,2,0]` (3/3/3/3) — faqat matn o'zgaradi.

---

## A. Darsning tayanchi

### A-1. Atamalar — 5-dars «Claude Skills — nima» bilan bir xil (bir ma'no — bir so'z, T-014)

| Atama | Darsdagi ma'nosi | Ishlatilmaydi |
|---|---|---|
| **Skill** | bitta aniq vazifa uchun qayta ishlatiladigan yozma yo'riqnoma; papkada turadi, asosiy fayli `SKILL.md` | super-kuch kartasi, karta, qobiliyat |
| **frontmatter** | fayl boshidagi ikki `---` orasi: `name` va `description` | pasport, sarlavha qismi |
| **name** | Skill nomi: kichik harf, raqam va defis (`mijoz-javobi`) | id, title |
| **description** | Skill **nima qiladi va qachon ishlatiladi** (qisqa); Claude Skill'ni shunga qarab tanlaydi | «qachon ishlaydi» maydoni |
| **body** | frontmatter'dan pastdagi qism: raqamlangan qadamlar va bitta misol; sarlavhasi erkin | qadamlar maydoni |
| **qadam** | body'dagi bitta raqamlangan ko'rsatma — AI'ga buyruq, shuning uchun sen-formada (T-002) | — |
| **qoida** | tuzatishda qo'shiladigan yangi qadam («qoida qo'shish») | — |
| **sinash** | Skill'ga haqiqiy xabar berib, javobni ko'rish; 2–3 xil holatda, biri — Skill ishlamasligi kerak bo'lgan holat | mashg'ulot maydoni, test qilish |
| **kamchilik** | javobda yetishmagan narsa (qizil yorliq) | muammo, xato, bug |
| **aniq tuzatish** | kamchilikka mos bitta qatorni aniqlashtirish yoki bitta qoida qo'shish | o'tkirlash, nishonli o'zgartirish |
| **yaxshilash sikli** | yozish → sinash → tuzatish → qayta sinash (zanjir ot-shaklda, §222/224) | iteratsiya, v1/v2 |
| **kontekst-injiniring** | AI'ga to'g'ri ma'lumot va ko'rsatma berish — 9-ekranda, harakatdan keyin, bir marta (T-011); ta'rif dars bo'yi so'zma-so'z bir xil (T-042) | — |
| **trigger** | 5-darsda izohlangan; bu darsda faqat 13-ekran xato izohida | — |

### A-2. v3 qoidalari (pilot A-7…A-11 o'z kuchida)
1. **Tushuncha-ekran = harakat → stend o'zgaradi (DE-184).** O'quvchi bitta ish qiladi (belgilaydi, almashtiradi, qo'shadi, ajratadi, yuboradi, topadi) va
   `SKILL.md` yoki chat javobi o'zgaradi. «Bosasiz → matn-karta» yo'q. Ish tugagach harakat paneli yopiladi, stend butun enga chiqib fokusga keladi (DE-199);
   stend ⛶ ichida (DE-200).
2. **Kafolat yo'q (5-dars A-4/A-5):** «bu sinovda», «ehtimoli oshadi», «yaqinlashtiradi»; «har doim», «aynan», «darrov» yozilmaydi. Natijalar — misol.
3. **Metafora yo'q.** Asosiy so'z — Skill. 5-darsning yagona o'xshatishi («yo'riqnoma») bu darsda qayta aytilmaydi.
4. **Toza yuza (185, D4):** fayl nomida, karta sarlavhasida, tugmada va chat javobida emoji yo'q (📄 ❌ ✅ 🧪 💡 🔁 😕 ⚠️ 🙏 olinadi); holat — fon va ✓ ✗ belgisi.
5. **Bitta misol-ip:** mini-do'kon (4–5-darslardagi) mijozlari; Skill `mijoz-javobi`. 6-ekranda 5-darsdagi `mahsulot-tavsifi` bir marta qaytadi (o'sha olam, P-002).

---

## Darsning ipi va bitta vizual

- **Hook:** mini-do'konga mijoz yozdi: «Telefonim buzuq keldi!». Shoshib yozilgan Skill («Muloyim javob yoz.») foydasiz javob berdi.
- **Ip — bitta Skill dars bo'yi aniqlashadi:** qismlarni baholash (2) → description (3) → qadamlar va misol (5) → bitta vazifa (6) → 3 xabarda sinash (7) →
  «tez orada» kamchiligi tuzatiladi (9) → yangi kamchilik, sikl (11) → 1-urinish bilan solishtirish (12) → fayl sintaksisi (13) → o'z Skill'i (16).
- **Bitta vizual — «Skill stendi» (0–13-ekranlar, bitta manba — 180):**
  - **chap — `SKILL.md` fayli.** Qator holatlari: bo'sh (uzuq chiziq, kulrang) · yozilgan (oq) · joriy (accent chegara) · yangi (bir lahza yashil fon) ·
    kamchilik (qizil to'lqin chiziq). Tuzatishda eski qator ustidan chiziladi, yangisi yashil kiradi.
  - **o'ng — mini-do'kon yordam chati.** Mijoz pufagi chapda, Claude javobi o'ngda (yozilib chiqadi). Javob ustida kulrang yorliq: «mijoz-javobi ishlatildi»
    yoki «Skill ishlatilmadi». Javob ostida 4 yorliq — body qadamlaridan: `uzr · yechim · muddat · yakun` (kulrang → yashil ✓ / qizil ✗).
  - Logotip va emoji yo'q (F-1004 Q3 A): chat — oddiy chizilgan oyna, sarlavhasi «Mini-do'kon · yordam».
- **Fayl versiyalari (stend shu ketma-ketlikda o'zgaradi):**

  1-urinish (0–2-ekran):
  ```
  ---
  name: mijoz-javobi
  description: javob yozish
  ---
  Muloyim javob yoz.
  ```
  Tayyor (3 va 5-ekrandan keyin):
  ```
  ---
  name: mijoz-javobi
  description: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
  ---
  # Mijozga javob
  1. Samimiy uzr so'ra.
  2. Aniq yechim taklif qil: almashtirish yoki qaytarish.
  3. Muddatni ayt.
  4. Iliq jumla bilan yakunla.
  Misol: «Uzr so'raymiz! Buzuq mahsulotni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat.»
  ```
  9-ekrandan keyin: `3. Aniq muddat ayt: kun yoki soat.` · 11-ekrandan keyin qo'shiladi: `5. Mijoz pulini so'rasa, qaytarishni taklif qil.`

---

## 0 · Kirish  ← QKirish (harakat qo'shildi)
- Eyebrow: Dars · kirish
- Sarlavha: **Skill kutilgandek ishlamasa, nima qilasiz?** (42)
- Mentor: Mini-do'kon uchun shoshib yozilgan Skill mijozlarga javob yozishi kerak. Uni sinab ko'ring.
- Maket (chap): stend — `SKILL.md` (1-urinish) va bo'sh chat; tugma (ikkinchi darajali, o'ngda): «Sinab ko'rish».
- **Harakat → Vizual o'zgarish:** «Sinab ko'rish» → chatga mijoz xabari tushadi «Telefonim buzuq keldi!», Claude javobi yozilib chiqadi
  «Murojaatingizni ko'rib chiqamiz.», mijoz yana yozadi «Telefonim nima bo'ladi?». Tugma izoh-matnga aylanadi, radio-variantlar ochiladi.
- Variantlar (radio):
  - Skill yomon chiqdi — undan voz kechaman
  - Skill noaniq — uni aniqroq qilib yozaman
  - AI aybdor — boshqa modelni sinab ko'raman
- Javob — 2-variant: **Aynan!** Skill'da qadam ham, misol ham yo'q. Bugun uni aniq yozasiz, sinaysiz va tuzatasiz. (89)
- Javob — 1 yoki 3: **Qiziq fikr!** Avval Skill'ning o'zini tekshiraylik: unda qadam ham, misol ham yo'q. (81)
✎ sarlavha 88 → 1 qator · hook javoblari 153/195 → ≤120 · «5-darsda…» ko'prigi rejaga ko'chdi (T-048) · natija-karta (❌ Natija) → chat maketi, mijoz qayta yozadi ·
javob «Kechirasiz, biz buni ko'rib chiqamiz» → «Murojaatingizni ko'rib chiqamiz» (uzr yo'q — 5-ekranda uzr qadami javobni o'zgartirishi ko'rinsin) · 3-variant uzunligi tenglashdi

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **Bugun o'z Skill'ingizni yozasiz va sinaysiz.** (44)
- Mentor: 5-darsda tayyor Skill'ni o'qidingiz — bugun uni o'zingiz yozasiz.
- Chap: «Dars oxirida — siz shunday Skill yozasiz» + stend: yakuniy `SKILL.md` (5 qadam + misol) va chatda bitta to'liq javob, 4 yorliq yashil.
- O'ng (01 · matn · teg):
  - 01 · Skill qismlarini aniq yozish · *tuzilish*
  - 02 · Bitta Skill'ga bitta vazifa berish · *vazifa*
  - 03 · Skill'ni 2–3 xil holatda sinash · *sinov*
  - 04 · Kamchilikni topib, aniq tuzatish · *kontekst-injiniring*
✎ mentor 3 gap → 1 · «Qadamlar va misol qo'shish» 01 ga qo'shildi, yangi 02 — «bitta vazifa» (6-ekran) · qiyin atama kulrang tegda (P-015) ·
teglar App.jsx `sub` («struktura, test, kontekst-injiniring») bilan — «KOD» B-13 (tavsiya: `sub` → «tuzilish, sinov, kontekst-injiniring»)

## 2 · Qaysi qism noaniq?  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · asosiy qismlar
- Sarlavha: **1-urinishning qaysi qismi noaniq?** (33)
- Mentor: SKILL.md uch qismdan iborat: name, description va body. Har qismni bosib, aniq yoki noaniqligini belgilang.
- Stend: `SKILL.md` (1-urinish) — uch qism bosiladigan (168: pulsatsiya halqasi): `name` qatori · `description` qatori · body (`Muloyim javob yoz.`); chatda 0-ekrandagi javob.
- **Harakat → Vizual o'zgarish:** qismni bosish → qism accent ramkaga olinadi, ostida ikki tugma «aniq» · «noaniq» → tanlangach haqiqiy baho ramkada yonadi:
  - `name` — yashil: «kichik harf va defis — to'g'ri»
  - `description` — qizil: «nima ham, qachon ham aytilmagan»
  - body — qizil: «qadam ham, misol ham yo'q»
  Natija qatori (har qismda bitta): «Siz: noaniq · haqiqatda: aniq» yoki «Taxminingiz to'g'ri chiqdi». 3/3 da chatdagi javob qizil ostki chiziq oladi.
- Xulosa: name joyida; description va body noaniq — ikkalasini aniq yozamiz. (66)
- Tugma (pastki): 3 qismni belgilang (N/3) → Davom etish
✎ «Qismlarni ko'rsat» → 3 matn-karta o'rniga hook faylini o'quvchi o'zi baholaydi · xulosa 140 → ≤110, kafolat («ehtimoli ancha oshadi») olindi ·
name qoidasi shu yerda ko'rinadi (5-dars A-2)

## 3 · description  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · description
- Sarlavha: **Claude Skill'ni qaysi xabarda ishlatadi?** (40)
- Mentor: Claude Skill'ni description'ga qarab tanlaydi. Uch description'ni navbat bilan qo'yib, xabarlarga qarang.
- Bashorat (ballsiz, 181): **Hozirgi «javob yozish» bilan oddiy savolda ham Skill ishlaydimi?** · Ha · Yo'q
- Stend: `description` qatori joriy; chat o'rnida — **Claude tanlovi** paneli, 3 xabar qatori:
  «Telefonim buzuq keldi!» · «Buyurtmam kechikyapti!» · «Soat nechigacha ishlaysiz?». Har qator yonida yorliq «ishlatildi» / «ishlatilmadi» va ✓ / ✗ (qaror to'g'rimi).
- Description variantlari (tugmalar, chapda):
  - `javob yozish` → ishlatildi ✓ · ishlatildi ✓ · ishlatildi ✗ — keraksiz xabarda ham ishladi
  - `Buzuq mahsulotni almashtirish uchun javob yozadi.` → ishlatildi ✓ · ishlatilmadi ✗ · ishlatilmadi ✓ — kerakli shikoyatni o'tkazib yubordi
  - `Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.` → ishlatildi ✓ · ishlatildi ✓ · ishlatilmadi ✓
- **Harakat → Vizual o'zgarish:** variantni bosish → fayldagi `description` qatori qayta yoziladi, uch xabar paneldan qayta o'tadi, yorliqlar va ✓/✗ yangilanadi;
  ✗ qatorda bir qator izoh:
  - keng: Keraksiz xabarda ham ishladi. (29)
  - tor: Kerakli shikoyatni o'tkazib yubordi. (36)
- Natija qatori: «Taxminingiz: Yo'q · haqiqatda: Ha — «javob yozish» hamma xabarga mos tushdi».
- Xulosa (3/3): Aniq «nima + qachon» bilan Skill ikki shikoyatda ishladi, oddiy savolda ishlamadi. (82)
- Tugma (pastki): Uch description'ni sinang (N/3) → Davom etish
✎ ❌/✅ kartalar + «Aniq description-chi?» → uch description sinovi; Claude tanlovi panelda ko'rinadi (5-dars A-3/A-4, ikki xato yo'li: keng va tor) ·
qoida-xulosa («description'da … body'ga yoziladi») 126 → ≤110 · fayl endi tayyor description bilan qoladi (ip)

## 4 · 1-savol  ← QTest (✔ 4-variant — o'zgarmaydi)
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Qaysi description yaxshiroq yozilgan?**
  - «Mijozlar bilan bog'liq har qanday ishni bajaradi»
  - «Chiroyli va yoqimli matnlar yozishda yordam beradi»
  - «Javob yozadi, kerak bo'lganda ishlatiladi»
  - ✔ «Mijoz shikoyat qilganda g'amxo'r javob yozadi»
- To'g'ri izohi: Unda nima qilishi ham, qachon ishlatilishi ham aniq aytilgan.
- Xato izohlari:
  - 1: Juda keng: Skill keraksiz xabarda ham ishlab ketishi mumkin. (60)
  - 2: Nima qilishi bor, lekin qachon ishlatilishi yo'q. (49)
  - 3: «Kerak bo'lganda» — qaysi vaziyatda? Bu aytilmagan. (51)
  - umumiy: Yaxshi description: nima qiladi va qachon ishlatiladi. (54)
✎ to'g'ri izohi 3 gap → 1, «To'g'ri!» olindi · xato izohlari ≤60 · variantlar o'zgarmadi (v2 da tenglashgan)

## 5 · Qadamlar va misol  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · body
- Sarlavha: **Qadam qo'shsangiz, javob qanday o'zgaradi?** (42)
- Mentor: Body'da hozircha bitta umumiy gap turibdi. Qadamlarni bittadan qo'shing va javobga qarang.
- Stend: `SKILL.md` (description tayyor, body: `Muloyim javob yoz.`) · chat: «Telefonim buzuq keldi!» → «Murojaatingizni ko'rib chiqamiz.» · yorliqlar `uzr ✗ · yechim ✗ · muddat ✗ · yakun ✗`.
- Bo'laklar (chap, 5 ta, istalgan tartibda):
  `1. Samimiy uzr so'ra.` · `2. Aniq yechim taklif qil: almashtirish yoki qaytarish.` · `3. Muddatni ayt.` · `4. Iliq jumla bilan yakunla.` ·
  `Misol: «Uzr so'raymiz! Buzuq mahsulotni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat.»`
- **Harakat → Vizual o'zgarish:** bo'lakni bosish → u body'ga yashil kiradi (birinchisida eski `Muloyim javob yoz.` ustidan chiziladi), javob qayta yoziladi va mos yorliq
  yashil bo'ladi (uzr → `uzr ✓` …). Misolsiz javob quruq: «Uzr. Almashtiramiz yoki qaytaramiz. 1 kun. Rahmat.»; misol qo'shilgach — misol ohangida:
  «Uzr so'raymiz! Buzuq telefonni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat.»
- Xulosa (5/5): Har qadam javobga bitta narsa qo'shdi, misol esa javob ohangini ko'rsatdi. (74)
- Tugma (pastki): Qadamlarni qo'shing (N/5) → Davom etish
✎ ❌ Noaniq / ✅ Aniq qadamlar (matn) → qadam qo'shilganda javob va yorliqlar o'zgaradi · «AI taxmin qiladi» mentor'dan olindi — javobning o'zi ko'rsatadi (P-036) ·
xulosa 130 → ≤110

## 6 · Bitta Skill — bitta vazifa  ← QTushuncha (qayta qurildi; eski «Skill yig'uvchi» o'rnida)
- Eyebrow: Tushuncha · bitta vazifa
- Sarlavha: **Bu qadam qaysi Skill'ga tegishli?** (33)
- Mentor: Do'kon egasi ikki vazifani bitta Skill'ga yozib qo'ydi. Har qadamni o'z Skill'iga ajrating.
- Stend (bu ekranda): chapda aralash fayl `dokon-yordamchi/SKILL.md` — description «Mijozga javob va mahsulot tavsifi yozadi.», body'da 6 qadam;
  o'ngda ikki papka-karta: `mijoz-javobi/` · `mahsulot-tavsifi/` (5-darsdagi); pastda chat: «Telefonim buzuq keldi!» →
  «Uzr so'raymiz! Telefonni 1 kun ichida almashtiramiz. Savatga qo'shing!» («Savatga qo'shing!» qizil to'lqin chiziq ostida).
- Qadamlar (aralash faylda): Samimiy uzr so'ra. · Aniq 3 jumla yoz. · Aniq yechim taklif qil. · Asosiy ustunligini ayt. · Muddatni ayt. · Oxirida «Savatga qo'shing!» deb yoz.
  (to'g'ri: 1, 3, 5 → `mijoz-javobi` · 2, 4, 6 → `mahsulot-tavsifi`)
- **Harakat → Vizual o'zgarish:** qadamni bosib, papkani bosish → qadam aralash fayldan o'sha papka fayliga ko'chib, yashil kiradi; aralash fayl kichrayadi.
  Noto'g'ri papka → qadam qaytadi, chat javobida begona bo'lak qizil yonadi, bir qator:
  - Xato: Bu qadam boshqa vazifaniki — javob aralashadi. (46)
  6/6 da aralash fayl yo'qoladi, chatda shikoyat qayta yuboriladi: «mijoz-javobi ishlatildi», javobda «Savatga qo'shing!» yo'q.
- Xulosa (6/6): Har vazifa o'z Skill'ida — shikoyatga javob endi aralashmaydi. (62)
- Tugma (pastki): Qadamlarni ajrating (N/6) → Davom etish
✎ «uchala qismni qo'shing» (2/3/5-ekran bilan takror, fayl stendda allaqachon yozilib bo'ladi) → «bitta Skill — bitta vazifa» saralash: arena 12 va kartochka 12 shu qoidani so'raydi,
v2 da u hech bir ekranda o'rgatilmagan edi (P-063) · 5-dars `mahsulot-tavsifi` bilan ko'prik

## 7 · Sinash  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · sinash
- Sarlavha: **Bitta xabarda sinash yetadimi?** (30)
- Mentor: Skill ishlashini faqat sinov ko'rsatadi. Uch xil xabarni yuboring.
- Bashorat (ballsiz): **Uch xabardan nechtasida Skill ishlashi kerak?** · 1 · 2 · 3
- Stend: tayyor `SKILL.md` · chat bo'sh. Chapda uch xabar-tugma:
  «Telefonim buzuq keldi!» · «Soat nechigacha ishlaysiz?» · «Quloqchinim kechikyapti, qachon keladi?»
- **Harakat → Vizual o'zgarish:** xabarni yuborish → chatga tushadi, javob yozilib chiqadi, yorliqlar yonadi:
  - telefon → «mijoz-javobi ishlatildi» · «Uzr so'raymiz! Buzuq telefonni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat.» · 4 yorliq ✓
  - savol → «Skill ishlatilmadi» · «Do'kon har kuni 9:00 dan 21:00 gacha ishlaydi.» · yorliqlar yo'q (bu xabarga Skill kerak emas)
  - kechikish → «mijoz-javobi ishlatildi» · «Uzr so'raymiz! Buyurtmangizni tezlashtiramiz, tez orada yetib boradi. Sabringiz uchun rahmat.» · `muddat ✗` (qizil), qolgani ✓
- Natija qatori: «Taxminingiz: 3 · haqiqatda: 2 — oddiy savolga Skill kerak emas» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa (3/3): Uch sinovdan biri kamchilikni ochdi: «tez orada» — aniq muddat emas. (68)
- Tugma (pastki): Uch xabarni yuboring (N/3) → Davom etish
✎ bitta sinov + «2–3 holatda sinang» degan matn (263 belgi, 3 gap) → o'quvchi uch holatni o'zi sinaydi, biri — Skill ishlamasligi kerak bo'lgan holat ·
uchinchi xabar kamchilikni ochadi va 9-ekranga ip bo'ladi (v2 12-ekrandagi kechikish voqeasi shu yerga ko'chdi)

## 8 · 2-savol  ← QTest (✔ 1-variant — o'zgarmaydi)
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **Skill qadamlarini kuchli qiladigan narsa qaysi?**
  - ✔ Aniq, raqamlangan qadamlar va bitta misol
  - Iloji boricha uzun va batafsil yozilgan matn
  - «Yaxshi qil» degan qisqa umumiy ko'rsatma
  - Faqat Skill'ning nomi va body sarlavhasi
- To'g'ri izohi: Qadamlar nima qilishni, misol esa kutilgan natijani ko'rsatadi.
- Xato izohlari:
  - 2: Uzun, lekin noaniq matn AI'ga yordam bermaydi. (46)
  - 3: «Yaxshi qil» bilan AI taxmin qiladi, javob har xil chiqadi. (59)
  - 4: Nom faqat Skill'ni ataydi — ishni qadamlar tushuntiradi. (56)
  - umumiy: Aniq qadamlar va bitta misol. (29)
✎ 4-variant «nomi va sarlavhasi» → «nomi va body sarlavhasi» (uzunlik tenglashdi) · to'g'ri izohi «To'g'ri!» siz, bitta gap

## 9 · Aniq tuzatish  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · aniq tuzatish
- Sarlavha: **Kamchilik faylning qaysi qatorida?** (34)
- Mentor: Skill'ni qayta yozish shart emas — qizil yorliqqa mos qatorni toping.
- Stend: tayyor `SKILL.md` (qatorlar bosiladigan) · chatda 7-ekrandagi kechikish javobi, `muddat ✗` qizil.
- **Harakat → Vizual o'zgarish:** fayldagi qatorni bosish →
  - `3. Muddatni ayt.` → qator ustidan chiziladi, o'rniga yashil kiradi `3. Aniq muddat ayt: kun yoki soat.` (yonida kulrang teg «so'zni aniqlashtirish»);
    chatda xabar qayta yuboriladi: «Uzr so'raymiz! Buyurtmangiz bugun 18:00 gacha yetib boradi. Sabringiz uchun rahmat.» — `muddat ✓` yashil.
  - boshqa qator → qator silkinadi, bir qator:
    - Xato: Bu qadam javobda bajarilgan — yorlig'i yashil. (46)
- Xulosa: Bitta qatorni aniqlashtirdingiz — javobda aniq muddat paydo bo'ldi. (67)
- Qator (xulosadan keyin, atama bir marta): AI'ga to'g'ri ma'lumot va ko'rsatma berishni kontekst-injiniring deyishadi.
- Tugma (pastki): Qatorni toping → Davom etish
✎ uch matn-karta (qoida qo'shish · so'zni aniqlashtirish · misol qo'shish) → o'quvchi kamchilik qatorini o'zi topadi, tuzatish faylda va javobda ko'rinadi ·
uch usul endi harakatda: misol qo'shish — 5-ekran, so'zni aniqlashtirish — 9, qoida qo'shish — 11 · xulosa 152 → ≤110, atama harakatdan keyin (T-011)

## 10 · 3-savol  ← QTest (✔ 3-variant — o'zgarmaydi)
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Skill natijasi chala chiqdi. Eng yaxshi qadam qaysi?**
  - Bu Skill'dan voz kechib, yangisini izlayman
  - Hamma qatorni o'chirib, noldan qayta yozaman
  - ✔ Kamchilikni topib, o'sha joyni tuzatib sinayman
  - AI aybdor deb, kuchliroq model izlab ko'raman
- To'g'ri izohi: Kichik aniq tuzatish Skill'ning ishlayotgan qismini saqlab qoladi.
- Xato izohlari:
  - 1: Skill deyarli ishlayapti — bitta joyni tuzatish yetadi. (55)
  - 2: Noldan yozsangiz, ishlayotgan qadamlar ham yo'qoladi. (53)
  - 4: Model o'sha qoladi — avval o'z Skill'ingizni tekshiring. (56)
  - umumiy: Kamchilikni toping, tuzating va qayta sinang. (45)
✎ savol «kerakli darajada emas» → «chala chiqdi» (12 so'zdan kam, S-001) · to'g'ri variant eng uzun edi (46 vs 31) → to'rttalasi 42–49 · to'g'ri izohi 2 gap → 1

## 11 · Yaxshilash sikli  ← QTushuncha (qayta qurildi)
- Eyebrow: Tushuncha · yaxshilash sikli
- Sarlavha: **Yangi kamchilik chiqsa, nima qilasiz?** (37)
- Mentor: Yangi shikoyat keldi. Halqadagi keyingi bosqichni o'zingiz bosing.
- Stend + **sikl halqasi** (stend ustida, 4 tugun, oxiridan boshiga ↻): Sinash · Kamchilikni topish · Tuzatish · Qayta sinash.
  Tugunlar: kulrang → joriy (accent) → yashil.
- **Harakat → Vizual o'zgarish:** o'quvchi halqadagi KEYINGI tugunni bosadi (1-dars 3-ekran naqshi):
  1. Sinash → chatga «Quloqchin ishlamayapti. Pulimni qaytaring!» tushadi, javob «Uzr so'raymiz! Quloqchinni bepul almashtiramiz, 1 kun ichida. Sabringiz uchun rahmat.»;
     `yechim ✗` qizil, yonida kulrang «mijoz pul so'radi».
  2. Kamchilikni topish → faylda `2. Aniq yechim taklif qil: almashtirish yoki qaytarish.` qizil to'lqin oladi — qaysi birini tanlash aytilmagan.
  3. Tuzatish → yangi qator yashil kiradi `5. Mijoz pulini so'rasa, qaytarishni taklif qil.` (teg «qoida qo'shish»).
  4. Qayta sinash → «Uzr so'raymiz! Pulingizni 1 kun ichida qaytaramiz. Sabringiz uchun rahmat.» — `yechim ✓`; halqa to'liq yashil, ↻ bir marta aylanadi.
  Noto'g'ri tugun → silkinadi, bir qator:
  - Xato (Tuzatish erta): Avval kamchilikni toping — keyin nimani tuzatishni bilasiz. (59)
  - Xato (Qayta sinash erta): Hali hech narsa tuzatilmadi. (28)
- Xulosa (4/4): Birinchi urinish mukammal bo'lishi shart emas — har aylanish Skill'ni aniqroq qiladi. (85)
- Tugma (pastki): Siklni aylantiring (N/4) → Davom etish
✎ «Keyingi qadam →» bilan 4 matn-karta + o'ngdagi «YAXSHILASH SIKLI» kartasi → o'quvchi siklni o'zi aylantiradi, yangi kamchilik (pul qaytarish) ·
v2 dagi «muloyim javob yoz» takrori olindi (hook bilan bir xil edi) · «Jarayon · …» eyebrow → «Tushuncha · …»

## 12 · 1-urinish va tayyor Skill  ← QTushuncha (qayta qurildi; case)
- Eyebrow: Hayotiy · solishtirish
- Sarlavha: **Model o'sha — javobni nima o'zgartirdi?** (39)
- Mentor: Ikkala Skill bir xil modelda ishlaydi. Uchala xabarni yuboring.
- Bashorat (ballsiz): **1-urinish uch shikoyatdan nechtasiga to'liq javob beradi?** · 0 · 1 · 2
- Ikki stend yonma-yon (telefonda ustma-ust): «1-urinish» (5 qatorli fayl) · «Hozirgi Skill» (11 qatorli fayl); har birining ostida chat va 4 yorliq.
- Uch xabar-tugma: «Telefonim buzuq keldi!» · «Quloqchinim kechikyapti, qachon keladi?» · «Quloqchin ishlamayapti. Pulimni qaytaring!»
- **Harakat → Vizual o'zgarish:** xabarni yuborish → ikkala chatga bir vaqtda tushadi; chapda har safar «Murojaatingizni ko'rib chiqamiz.» (yorliqlar ✗),
  o'ngda 7, 9, 11-ekranlardagi to'liq javoblar (yorliqlar ✓). Har stend tepasida hisoblagich: «yashil yorliq: 0/12» · «12/12».
- Natija qatori: «Taxminingiz: … · haqiqatda: 0 ta».
- Xulosa (3/3): Model o'zgarmadi: javobni aniq description, qadamlar va misol o'zgartirdi. (74)
- Tugma (pastki): Uchala xabarni yuboring (N/3) → Davom etish
✎ v2 case (kechikish: yoz → sina → tuzat) 7/9-ekranlarga o'tdi, 11 bilan takror edi · 12 — butun dars yo'li bitta solishtiruvda (1-dars 6-ekran naqshi), hook'dagi
«AI aybdor — boshqa model» variantiga javob · xulosa 121 → ≤110 · «💡 Diqqat» kartasi olindi (P-052)

## 13 · SKILL.md'ni to'ldiring (nishon)  ← QTushuncha (harakat bor edi, matn qisqardi)
- Eyebrow: Amaliyot · SKILL.md
- Sarlavha: **SKILL.md fayli qanday yoziladi?** (31)
- Mentor: Haqiqiy SKILL.md'da maydon nomlari aniq yoziladi. Uchta bo'sh joyni to'ldiring.
- Fayl (stend chap tomoni):
  ```
  ---
  ____: mijoz-javobi
  ____: Mijoz shikoyat qilganda unga g'amxo'r javob yozadi.
  ____

  # Mijozga javob
  1. Samimiy uzr so'ra.
  2. Aniq yechim taklif qil: almashtirish yoki qaytarish.
  3. Aniq muddat ayt: kun yoki soat.
  ```
- Bo'shliqlar (✔ o'rni o'zgarmaydi):
  1. Skill nomi: `title` · ✔ `name` · `id`
  2. Nima qiladi va qachon: ✔ `description` · `summary` · `trigger`
  3. Frontmatter'ni yopadigan qator: `###` · `===` · ✔ `---`
- **Harakat → Vizual o'zgarish:** variantni bosish → fayldagi `____` o'rniga so'z yashil yoziladi; xato → variant silkinadi, bir qator; 3/3 → fayl to'liq, stend fokusga.
- Xato izohlari:
  - `title`: SKILL.md'da nom uchun `name` yoziladi. (36)
  - `id`: Bunday maydon yo'q; nom `name` bilan yoziladi. (44)
  - `summary`: Bunday maydon yo'q; tavsif `description` bilan yoziladi. (54)
  - `trigger`: Ishga tushish shunday ataladi, maydon esa `description`. (54)
  - `###`: Markdown'da sarlavha belgisi — frontmatter'ni yopmaydi. (55)
  - `===`: SKILL.md'da bunday belgi ishlatilmaydi. (39)
- Xulosa (3/3): name — nom, description — nima va qachon, --- frontmatter'ni yopadi; body sarlavhasi erkin. (91)
✎ Mentor «Bu — …» bilan boshlanardi (T-029) · `trigger` izohi 85 → ≤60 · muvaffaqiyat 151 → ≤110 · body yakuniy faylning qadamlari (ip) · umumiy izoh
«Bu to'g'ri emas — qayta o'ylab ko'ring» olindi (har variantda o'z izohi bor, S-010)

## 14 · 4-savol  ← QTest (✔ 4-variant — o'zgarmaydi)
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Javob har safar narxni unutyapti. Eng aniq tuzatish qaysi?**
  - Butun Skill'ni o'chirib, boshidan qayta yozaman
  - description'ni uzunroq va batafsilroq yozaman
  - Kuchliroq model uchun ko'proq pul to'layman
  - ✔ Qadamlarga narxni ko'rsatish qoidasini qo'shaman
- To'g'ri izohi: Kamchilik bitta — narx; uni bitta qoida tuzatadi, qolgani o'zgarmaydi.
- Xato izohlari:
  - 1: Faqat narx yetishmayapti — qolgan qadamlar ishlayapti. (54)
  - 2: description qachon ishlatilishini aytadi, narxni emas. (54)
  - 3: Model emas — Skill'da narx haqida qoida yo'q. (45)
  - umumiy: Qadamlarga narx qoidasini qo'shing. (35)
✎ «» qo'shtirnoq faqat to'g'ri variantda edi → olindi · savol 14 so'z → 9 (S-001) · «Aniq muammo» → «kamchilik» (T-014)

## 15 · Jarayonni yig'ing (final)  ← QTartib (✔ tartib o'zgarmaydi)
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Skill yaratish jarayonini tartibga keltiring.** (45)
- Mentor: Darsda bosib o'tgan yo'lingizni eslang va bo'laklarni joylarga qo'ying.
- Bo'laklar (to'g'ri tartibda; ekranda aralash): Vazifani tanlash · SKILL.md yozish · Sinash · Kamchilikni topish · Tuzatib, qayta sinash
- Uyalar: raqam (1…5) + «bu yerga qo'ying» (tartibni ochmaydi)
- Maxsus xato (kamchilik sinashdan oldin): Hali sinamasdan kamchilikni qayerdan bilasiz? (45)
- Boshqa xato: Tartib xato — bo'lakni bosib qaytaring. (39)
- Xulosa (yechilgach): Skill bitta yozishda emas, sinash va tuzatish siklida tayyor bo'ladi. (69)
✎ sarlavha 65 → 1 qator · «Sinab ko'rish» → «Sinash» (sikl zanjiri bilan bir so'z, T-014) · 😕/⚠️ olindi · «✓ Jarayon tayyor: Vazifa → …» uyalardagi tartibni takrorlardi
(T-047) → bitta xulosa · bo'lak ID va tartibi o'zgarmaydi

## 16 · Amaliyot  ← amaliyot bloki (173-qonun, o'z kompyuterida; qayta qurildi)
- Eyebrow: Amaliyot · kompyuteringizda
- Sarlavha: **O'z Skill'ingizni yozing** (24)
- Mentor: Endi o'zingiz tez-tez AI'ga beradigan vazifaga Skill yozasiz. Har qadamdan keyin «Bajardim»ni bosing.
- 4 qadam (bittadan ochiladi, ✓ bilan yopiladi):
  1. **Papka** — Bitta vazifa tanlang: bitta Skill — bitta vazifa. Kompyuteringizda shu nomli papka oching (masalan `mijoz-javobi`), ichida `SKILL.md` fayli.
  2. **Yozish** — Shablonni nusxalang va `{…}` joylarni to'ldiring (qutida «Nusxalash»):
     ```
     ---
     name: {skill-nomi}
     description: {nima qiladi}. {qachon ishlatiladi}.
     ---
     # {sarlavha}
     1. {birinchi qadam}
     2. {ikkinchi qadam}
     3. {uchinchi qadam}
     Misol: {tayyor javob namunasi}
     ```
  3. **Sinash** — Uch xil xabar bilan sinang: ikkitasi vazifaga mos, bittasi mos emas. Claude'da Skill yuklash imkoni bo'lsa — papkani yuklang;
     bo'lmasa `SKILL.md` matnini gemini.google.com suhbatiga qo'yib yozing: `Shu yo'riqnoma bo'yicha javob ber: {xabar}`
  4. **Tuzatish** — Javobda nima yetishmadi? O'sha qatorni aniqlashtiring yoki bitta qoida qo'shing va qayta sinang.
- O'ngda — kutilgan natija · namuna: `mijoz-javobi`: fayl-karta (yakuniy `SKILL.md`) + chatda bitta to'liq javob, 4 yorliq yashil.
- Pastda (halol izoh, bir qator): Suhbatga qo'yilgan matnda description sinalmaydi — u faqat Claude'ga yuklanganda ishlaydi.
- Xulosa (4/4): Skill'ingiz tayyor: yozildi, uch xil xabarda sinaldi va bir marta tuzatildi. (76)
✎ besh bandli checklist + «Zo'r! Vazifani bajardingiz…» (3 gap) → 173 bloki: 4 qadam, shablon «Nusxalash», kutilgan natija o'ngda · sinash yo'li haqiqiy:
Claude'da yuklash yoki gemini.google.com (memory «sinfda-gemini»), ikkinchisining chegarasi halol aytildi · Skill yuklash menyusining nomi yozilmadi (P-028) — savol S-2

## 17 · Natijalar (podium) — o'zgarmaydi (umumiy shablon)
Q_LABELS: 1 — description · 2 — Qadamlar · 3 — Tuzatish · 4 — Aniqlik · 5 — Jarayon

## 18 · Takrorlash  ← QKartochka
- Sarlavha: **O'zingizni sinab ko'ring.** (25)

| Old tomon | Orqa | Izoh |
|---|---|---|
| Skill'ning asosiy qismlari qaysi? | name, description va body | Body ichida — qadamlar va misol |
| name qanday yoziladi? | Kichik harf, raqam va defis bilan | Masalan: mijoz-javobi |
| description'da nima yoziladi? | Skill nima qiladi va qachon ishlatiladi | Claude Skill'ni shunga qarab tanlaydi |
| Frontmatter qaysi belgi bilan ochilib-yopiladi? | --- | Ikki --- orasida name va description |
| Body sarlavhasi majburiy so'zmi? | Yo'q | Sarlavhani o'zingiz tanlaysiz |
| Qadamlarni qanday yozish kerak? | Aniq va raqamlab | Har qadam javobga bitta narsa qo'shadi |
| Misol nega foydali? | Kutilgan natijani ko'rsatadi | Javob ohangi misolga yaqinlashadi |
| Skill'ni yozib bo'lgach nima qilasiz? | 2–3 xil holatda sinaysiz | Biri — Skill ishlamasligi kerak bo'lgan holat |
| Natija chala chiqsa nima qilasiz? | Kamchilikka mos qatorni tuzatasiz | Hammasini qayta yozmaysiz |
| AI'ga to'g'ri ma'lumot va ko'rsatma berish qanday ataladi? | Kontekst-injiniring | Skill yozish — shuning bir ko'rinishi |
| Skill yaratishning sikli qanday? | Yozish, sinash, tuzatish, qayta sinash | Birinchi urinish mukammal bo'lishi shart emas |
| Bitta Skill'ga nechta vazifa yuklanadi? | Bitta aniq vazifa | Ikki vazifa bir faylda bo'lsa, javob aralashadi |

✎ 11-karta «Yoz, sina, tuzat, qayta sina» (sen-forma buyruq) → ot-shakl zanjir · izohlar darsdagi harakat natijasiga bog'landi (5, 6, 7-ekranlar) ·
«AI nimaga intilishni yaxshiroq tushunadi» → ko'rinadigan natija

## 19 · Yakun  ← QYakun
- Yorliqlar (tepada): ✓ Skill yozishni o'rgandingiz · N/5 to'g'ri
- Sarlavha: **Endi AI uchun o'z Skill'ingizni yozasiz.** (40)
- Endi siz bilasiz:
  - Skill yozish — sikl: yozish → sinash → tuzatish → qayta sinash
  - description — nima qiladi va qachon ishlatiladi; Claude Skill'ni shunga qarab tanlaydi
  - Body — aniq, raqamlangan qadamlar va bitta misol
  - Natija chala bo'lsa — kamchilikka mos qatorni tuzatasiz
  - Bitta Skill — bitta vazifa, 2–3 xil holatda sinalgan
- Uyga vazifa:
  - **Tanlang** — tez-tez AI'ga beradigan bitta vazifani tanlang
  - **Yozing** — unga SKILL.md yozing: name, description, qadamlar va misol
  - **Sinang** — 2–3 xil holatda sinab ko'ring; natija chala bo'lsa, bitta qoida qo'shib qayta sinang
- Keyingi dars — **Praktika: to'liq pipeline.** React, Node, PostgreSQL, Telegram va AI'ni bitta ishlaydigan tizimga ulaysiz.
✎ «Yaxshi Skill: bitta vazifaga, aniq, misolli…» → «Bitta Skill — bitta vazifa» (6-ekran) · 🚀 belgisi qolip standartida (QYakun) · keyingi dars tavsifi
8-dars MD v3 (G3) «bugun quramiz» bilan moslashtiriladi — «KOD» B-12

---

## Qo'shimcha matnlar

**Nishonlar (4)** — inglizcha nom qoladi (o'yin qatlami, belgisi bilan):
- ⚡ **Clear Trigger** — Yaxshi description'ni tanladingiz (4)
- 🧩 **Step Writer** — Kuchli qadamlar qoidasini 1-urinishda topdingiz (8)
- 🗂️ **Field Master** — SKILL.md'ni xatosiz to'ldirdingiz (13)
- 🔁 **Skill Cycle** — Skill yaratish jarayonini to'g'ri yig'dingiz (15)

**Qisqa takrorlash oynalari (5 × 3 karta)** — belgi emoji o'rniga koddan bitta qator (S-026):
1. (4) **description — nima va qachon**
   - `name · description · body` — Skill'ning asosiy qismlari — name, description va body.
   - `description: Mijoz shikoyat qilganda…` — description nima qilishini va qachon ishlatilishini aytadi.
   - `description: javob yozish` — Noaniq bo'lsa, Skill keraksiz xabarda ham ishlab ketishi mumkin.
   - Sinfga savol: Nega description aniq bo'lishi kerak?
2. (8) **Qadamlar va misol**
   - `1. Samimiy uzr so'ra.` — Raqamlangan qadamlar AI'ga nima qilishni aniqroq tushuntiradi.
   - `Misol: «Uzr so'raymiz! …»` — Misol kutilgan natijani ko'rsatadi.
   - `Muloyim javob yoz.` — Umumiy gap foydasiz javob beradi.
   - Sinfga savol: Skill qadamlarini nima kuchli qiladi?
3. (10) **Aniq tuzatish**
   - `muddat ✗` — Avval javobdagi aniq kamchilikni topasiz.
   - `3. Aniq muddat ayt: kun yoki soat.` — Kamchilikka mos qatorni aniqlashtirasiz.
   - `qayta sinash` — Keyin qayta sinaysiz.
   - Sinfga savol: Chala natija chiqsa, eng yaxshi qadam nima?
4. (14) **Aniq joyni tuzatish**
   - `+ 5. qoida` — Skill biror narsani unutsa, qadamlarga aniq qoida qo'shasiz.
   - `Misol: …` — Qoidani misolda ham ko'rsatasiz.
   - `1–4. qadamlar` — Qolgani joyida qoladi.
   - Sinfga savol: Skill bir narsani unutyapti — eng aniq tuzatish qanday?
5. (15) **Skill yaratish jarayoni** — chizma: Vazifa → Yozish → Sinash → Kamchilik → Tuzatish ↻
   - `SKILL.md` — Avval vazifa tanlanadi va SKILL.md yoziladi.
   - `sinash` — Keyin sinab ko'riladi va kamchilik topiladi.
   - `↻` — Tuzatib, qayta sinaladi.
   - Sinfga savol: Nega sinashdan oldin kamchilikni topib bo'lmaydi?

**Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi; ✎ — matni o'zgargan):**
1. Skill'ning asosiy qismlari qaysi? Rang, o'lcham va narx · Server, baza va dizayn · ✔ name, description va body · Rasm, video va ovoz
2. description AI'ga nimani aytadi? ✔ Skill nima qiladi va qachon ishlatiladi · Skill faylining rangi va o'lchami qanday · Xabarni kimga va qachon yuborish kerak · Skill uchun necha ball berilishi kerak ✎
3. Qadamlarni kuchli qiladigan narsa? Iloji boricha uzun matn · Faqat chiroyli sarlavha · «Yaxshi qil» degan umumiy gap · ✔ Aniq qadamlar va misol ✎
4. Kontekst-injiniring nima? Skill'ni noldan boshlab qayta yozish · ✔ AI'ga to'g'ri ma'lumot va ko'rsatma berish · Skill'ni butunlay o'chirish · AI uchun kuchliroq model sotib olish
5. Natija kutilgandek chiqmasa, eng yaxshi qadam? ✔ Kamchilikni topib, o'sha joyni tuzatib sinash · Skill'dan voz kechib, uni o'chirib tashlash · Hammasini noldan boshlab qayta yozish · AI'ni ayblab, kuchliroq model izlash ✎
6. Nega Skill'ni sinab ko'rish kerak? Chiroyliroq ko'rinishi uchun · O'quvchi ballini oshirish uchun · Eski faylni o'chirish uchun · ✔ Ishlashini ko'rib bilish uchun ✎
7. Yaxshi description qanday bo'ladi? Bitta so'zdan iborat, masalan «javob» · ✔ Nima qilishi va qachon kerakligini aytadi · Iloji boricha noaniq, har narsaga mos · Faqat emojidan iborat qisqa satr
8. Misol Skill uchun nega foydali? Faylni uzunroq qiladi · Faylga faqat bezak beradi · ✔ Kutilgan natijani ko'rsatadi · Hech qanday ta'sir qilmaydi ✎
9. Skill har safar narxni unutyapti. Eng aniq tuzatish? Skill'ni o'chirib, boshidan yozish · description'ni uzunroq qilib yozish · Kuchliroq model uchun pul to'lash · ✔ Qadamlarga narx qoidasini qo'shish ✎
10. Skill yozishning to'g'ri sikli qaysi? Bir marta yozish, hech qachon tekshirmaslik · ✔ Yozish → sinash → tuzatish → qayta sinash · Sinash → o'chirish → unutish · Ko'chirish → jo'natish → kutish
11. Noaniq description nimaga olib keladi? Skill ikki barobar tezroq ishlaydi · Hech qanday ta'sir yo'q, hammasi bir xil · ✔ Skill kerakli paytda ishlamasligi mumkin · Ball o'z-o'zidan oshib ketadi
12. Yaxshi Skill qanday bo'ladi? ✔ Bitta vazifaga, aniq va sinalgan · Iloji boricha uzun va batafsil · Ko'p vazifani birga bajaradigan · Faqat nomdan iborat bo'lgan

✎ 2 — ✔ «qachon kerak» → «qachon ishlatiladi» (ta'rif dars bo'yi bir xil, T-042), chalg'ituvchilar uzaytirildi, «qachon» endi chalg'ituvchida ham bor · 3, 8 — qisqa chalg'ituvchilar tenglashdi ·
5 — «butunlay voz kechish» qisqa edi · 6 — «… uchun» qolipi faqat chalg'ituvchilarda edi (to'g'ri javob ajralib turardi) · 9 — «» faqat ✔ da edi va ✔ eng uzun edi (47 vs 33–40) → 33–35, «AI'ga pul to'lash» → model

**Fon so'zlari (R-008):** arena — `SKILL.md` · `---` · `description` · `body` · `name:` · `frontmatter` (kod — tarjimasiz) · qadamlar · misol · yozish→sinash→tuzatish · kontekst
(+ o'yin belgilari ✗ ⚡ 📋 🧪) · uyga vazifa banneri — amaliyot · loyiha · mashq · natija (platforma standarti). Kod bosqichida har biri {uz, ru}.

---

## B. Kod bosqichida (KOD)
1. **`SKILL_VER` — bitta manba (180):** fayl versiyalari (1-urinish · tayyor · 9-dan keyin · 11-dan keyin) qatorlar massivi sifatida; 0, 1, 2, 3, 5, 7, 9, 11, 12, 13, 16-ekranlar shundan o'qiydi.
   `CHAT_CASES` — xabarlar, javoblar, Skill yorlig'i va 4 yorliq holati (har versiya uchun). `TAGS` — `uzr · yechim · muddat · yakun` (body qadamlaridan).
2. **`SkillStend` komponenti:** `SkillFile` (qator holatlari: bo'sh · yozilgan · joriy · yangi · kamchilik; tuzatishda ustidan chizish + yashil kirish) va `HelpChat`
   (mijoz/Claude pufaklari, javob yozilib chiqadi, Skill yorlig'i, 4 yorliq). Jonli maket (DE-200), `prefers-reduced-motion` da sakrash. Logotip/emoji yo'q.
3. **Qolip turlari:** 0 `QKirish` (maket + yopiq radio) · 1 `QReja` · 2, 3, 5, 6, 7, 9, 11, 12, 13 `QTushuncha` (`zoom` ⛶, `tugadi`) · 4, 8, 10, 14 `QTest`
   (`QuestionScreen` mantig'i o'zgarmaydi — jonli ball, INLINE_KEYS) · 15 `QTartib` · 18 `QKartochka` · 19 `QYakun`.
4. **Bashorat ekranlari (3, 7, 12) va 2-ekran baholashi** — ballsiz, `onAnswer` ga kirmaydi; natija qatori `QTaxmin`.
5. **5-ekran javobi bo'laklardan yig'iladi** (P-046): qo'shilgan qadamlar va misol bor-yo'qligiga qarab (misolsiz — quruq, misol bilan — misol ohangida).
6. **6-ekran yangi mexanika** (saralash, 1-dars 5-ekran naqshi): `BUILD_PARTS` o'chadi; aralash fayl + ikki papka; xato bosishda chat javobidagi begona bo'lak qizil.
7. **11-ekran halqasi:** `ITER` yangi kontent bilan, keyingi tugunni bosish (noto'g'ri tugun — silkinish + `QXato`); 4/4 da ↻ bir marta aylanadi.
8. **13-ekran:** `CARD_BLANKS` xato izohlari qisqaradi, umumiy izoh olinadi; fayl body'si yakuniy versiyadan.
9. **15-ekran:** `CARD_STRUCT` yorliqlari («Sinab ko'rish» → «Sinash»), ID va tartib o'zgarmaydi; 😕 ⚠️ olinadi; ✓-qator → `QXulosa`.
10. **16-ekran:** `ScreenLivePractice` (checklist) → 173 bloki (`ScreenBlok` naqshi: 4 qadam, `PromptBox` «Nusxalash» `{…}` joylar bilan, o'ngda fayl-karta + chat,
    pastda `.ab-tail` halol izoh). Jonli: `PRACTICE_BASE` zonasi, ball yo'q (`practice: -1` qoladi).
11. **Matnlar:** `RECAPS` belgilari emoji → koddan qator (S-026); `QUIZ_BANK` 2, 3, 5, 6, 8, 9 matni (`correct` o'zgarmaydi); `SKILL_FLASHCARDS` 6–12;
    yakun `RECAP`; 4, 8, 10, 14 testlari matni; `ACHIEVEMENTS` o'zgarmaydi.
12. **Keyingi dars tavsifi** (yakun) — 8-dars MD v3 (G3) bilan bir xil gap; hozircha v2 matni.
13. **`App.jsx` `sub`** (m6-07): «struktura, test, kontekst-injiniring» → «tuzilish, sinov, kontekst-injiniring» (T-014, reja teglari bilan bir so'z) — savol S-1.
14. **Toza yuza:** `CodeFile` nomlari va kartalardagi 📄 ❌ ✅ 🧪 💡 🔁 😕 ⚠️, chat javobidagi 🙏 olinadi (D4); arena/nishon/podium belgilari qoladi.
15. **Darvozalar:** `npm run gates -- src/6-Modull/WriteSkillLesson.jsx` 12/12 · `lint:olchov` 0 warn (hozir 23) · `lint:emoji` · `lint-qolip` (q16–q21) · `lint:layout` 1280/1366/390 · surat.

---

## Savollar (foydalanuvchi uchun)
- **S-1** `App.jsx` `sub` «struktura, test, kontekst-injiniring» ni darsdagi so'zlarga moslaymizmi («tuzilish, sinov, kontekst-injiniring»)? Tavsiya: **ha** (T-014; menyu nusxalari ham).
- **S-2** 16-ekran amaliyoti — o'z kompyuterida (papka + `SKILL.md` + sinash), TelegramBotNest repo'siz. Repo'ga Skill qo'shish (Antigravity'da ishlashi) tekshirilmagan. Tavsiya: **o'z kompyuterida** (topshiriq ruxsat bergan variant).

---

## GATE M — o'z tekshiruvim
- ✓ Oldingi/keyingi dars va menyu nomi App.jsx bilan mos (205): 6-dars PM → 7 «O'z Skill'ingizni yozing» → 8 «Praktika: to'liq pipeline»; «5-darsda» havolalari to'g'ri.
- ✓ Bitta misol-ip (mini-do'kon, `mijoz-javobi`); metafora yo'q; bitta vizual — Skill stendi (fayl + chat + 4 yorliq), 0–13-ekranlar; 6-ekranda `mahsulot-tavsifi` — o'sha olam.
- ✓ Har tushuncha-ekranda (2, 3, 5, 6, 7, 9, 11, 12, 13) «Harakat → Vizual o'zgarish» bor; hook'da ham harakat; matn-karta qolmadi.
- ✓ Sarlavha ≤55 bitta qator · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 · hook javobi ≤120 · xato izohi ≤60 — belgilar soni qavsda (skript bilan sanaldi).
- ✓ Atamalar 5-dars v2 A-bo'limi bilan bir xil (Skill, frontmatter, name, description, body, trigger); «sinash/kamchilik/aniq tuzatish» dars bo'yi bir so'z; zanjir ot-shaklda; tugma siz-formada/ot-shaklda.
- ✓ Testlar: ✔ o'rni o'zgarmagan (s4=4, s8=1, s10=3, s14=4, s15 tartib, 13-ekran bo'shliqlari, arena 3/3/3/3); 10 va 14-savolda to'g'ri variant ajralib turishi (uzunlik, «») tuzatildi; arena 6 va 9 ham.
- ✓ Final: uya izohi «bu yerga qo'ying», Mentor tartibni aytmaydi, xulosa tartibni takrorlamaydi.
- ✓ Emoji yo'q (nishon, arena, podium, QYakun standarti bundan mustasno) · kafolat gaplari yo'q («bu sinovda», «mumkin»); «har safar» faqat test vaziyatida (kamchilik ta'rifi).
- ✓ Ichki kodlar o'quvchi matnida yo'q · tarixiy voqea yo'q · «KOD» ro'yxati — 15 band.
- ✓ Karta T · P · S: T-002 (qadamlar sen-formada), T-011 (kontekst-injiniring harakatdan keyin), T-029 («Bu…» bilan boshlangan Mentor tuzatildi), T-042/T-014 (ta'rif va zanjir bir xil),
  T-047 (final ✓-qatori olindi); P-015 (reja tegi), P-028 (menyu nomi taxmin qilinmadi), P-036, P-046, P-052, P-055 (11-ekran), P-063 (bitta vazifa endi o'rgatiladi), P-064 (bashorat 3, 7, 12),
  P-067; S-001 (savollar ≤12 so'z), S-004, S-010 (umumiy «qayta o'ylang» olindi), S-026 (recap belgisi kod). PM bo'limi — tegishli emas (texnik dars).
- ✗ → ochiq: 8-dars tavsifi G3 MD v3 tayyor bo'lgach bir xillashtiriladi (B-12); S-1, S-2 javobi kutiladi.
