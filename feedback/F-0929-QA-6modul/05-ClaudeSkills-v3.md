# 6-Modul (LMS: 8-Modul) · 5-dars «Claude Skills — nima» — MD v3

Fayl: `src/6-Modull/ClaudeSkillsLesson.jsx` · 20 ekran · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `05-ClaudeSkills-v2.md` va hozirgi kod. Deyarli hamma ekran o'zgargani uchun to'liq yozildi; «v2 dagidek» — faqat podium.
Oldingi dars: 4 «AI-agent nima» · keyingi: 6 «Ilova o'zi qaror qilsa, kimga tegadi?» (PM) · Skill yozish — 7 «O'z Skill'ingizni yozing» (App.jsx `m6-04…07`).
Fidbek: qator yoniga `>> ...` yozing. Tasdiqlangach (GATE M) dars shu holatga keltiriladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi: s4 = 4-variant · s8 = 1 · s10 = 3 · s14 = 4 · s15 tartib (`INLINE_KEYS { s4: 3, s8: 0, s10: 2, s14: 3, s15: 0 }`); arena 3/3/3/3.

---

## A. Darsning tayanchi

**Claude Skills — texnik tayanch (v2 dan o'zgarishsiz, dars bo'yi shu):**
1. **Skill** — bitta aniq vazifani qanday bajarishni tushuntiradigan, **qayta ishlatiladigan yozma yo'riqnoma**. U papkada saqlanadi: asosiy fayl — `SKILL.md`,
   kerak bo'lsa yonida qo'shimcha fayllar (namunalar, skriptlar).
2. **SKILL.md = frontmatter + body.** Frontmatter — fayl boshida, ikki `---` orasida; ikki majburiy maydon: `name` (kichik harflar, raqam va defis)
   va `description` (nima qiladi **va** qachon ishlatiladi). Body — qadamlar va misol.
3. **Claude Skill'ni qanday ishlatadi:** oldindan faqat har Skill'ning `name` va `description`'ini ko'radi. Vazifa mos deb topsa, `SKILL.md`'ning to'liq
   matnini o'qiydi; qo'shimcha fayllarni faqat kerak bo'lganda ochadi (*progressive disclosure*).
4. **Qarorni Claude qiladi** — qat'iy mexanizm emas. Aniq description Skill'ning to'g'ri paytda ochilish **ehtimolini** oshiradi.
5. **Natija** bir xil uslubga **yaqinlashadi**; AI har safar so'zma-so'z bir xil yozmaydi.

**v3 qoidalari (04.10, F-1004):**
6. **Har tushuncha-ekran — harakat (DE-184).** O'quvchi bitta ish qiladi (yuboradi, joylaydi, o'chiradi, tanlaydi) va **Skill xaritasi yoki mahsulot kartochkasi
   o'zgaradi**. «Tugmani bosing → matn-karta» yo'q. Ish tugagach harakat paneli yopiladi, natija fokusga (199).
7. **Atamalar (bir ma'no — bir so'z, T-014):** Skill · SKILL.md · frontmatter · `name` · `description` · body · vazifa · papka · kontekst oynasi
   (5-Modul «Bot ichida AI» darsidagi nom) · system prompt (o'sha dars) · tool (4-dars) · progressive disclosure (9-ekranda bir marta, qavsda izoh) ·
   trigger (13-ekranda bir marta — 7-dars izohsiz ishlatadi). «Yuklash», «javon», «karta yonadi», «super-kuch» — yo'q.
8. **Metafora:** bitta — yangi xodimga beriladigan qo'llanma (2-ekran Mentorida, «o'xshatish mumkin» shaklida, bir marta).
9. **Misol-ip:** o'quvchining mini-do'koni (modul ipi, 3–4 va 6-darslar bilan bir xil) · mahsulot — charm hamyon, 120 000 so'm. Ikkinchi mahsulot (krossovka)
   faqat 13-ekranda — Skill boshqa mahsulotda ham ishlashini ko'rsatish uchun.
10. **Toza yuza (185, D4):** tugma, variant, chip, karta sarlavhasida emoji yo'q; SKILL.md matnidan ham emoji olinadi (KOD-4). Fon — faqat holat (D3).

---

## Darsning ipi va bitta vizual

- **Hook:** mini-do'kon mahsulot kartochkasi → AI'dan ikki marta tavsif so'raladi → ikki xil chiqadi → «Nega?».
- **Skill xaritasi (dars bo'yi, yangi):** chapda **Vazifa** — chat oynasi (foydalanuvchi xabari; yuborilganda kichik «konvert» bo'lib uchadi) ·
  o'rtada **Claude** tuguni (chizilgan doira + nom, logotip yo'q) va uning ostida **kontekst oynasi** — 10 katak, hisoblagich `n / 10`
  (doim turadigan qatorlar: `system prompt` · har Skill uchun bitta yupqa `name + description` qatori) · o'ngda **Skill'lar papkasi** — uch papka-karta:
  `mahsulot-tavsifi/` · `mijoz-xati/` · `hisobot-sql/`.
  Papka-karta 3 qatlam: (1) `name` + `description` — doim ko'rinadi; (2) body — kulrang skelet chiziqlar, ochilganda matn; (3) qo'shimcha fayl
  (`namunalar.md`, faqat `mahsulot-tavsifi`'da) — eng chuqurda, «kerak bo'lsa» yorlig'i bilan.
  Holatlar: kulrang (yopiq) → accent chegara (Claude description'ni solishtiryapti) → yashil (ochildi: body kontekst oynasiga oqib tushadi) → xira (mos kelmadi).
- **Mahsulot kartochkasi (natija):** mini-do'kon sahifasi bo'lagi — rasm-skelet, «Charm hamyon», «120 000 so'm», tavsif maydoni, «Savatga» tugmasi;
  ustida kulrang yorliq «namuna natija». Tavsif maydoni Skill'siz / Skill bilan o'zgaradi; ikki urinish yonma-yon ko'rsatilishi mumkin.
- **Bitta manba (180):** `SKILLS` — uch Skill'ning name, description, body qadamlari, misol; SKILL.md fayli, papka-kartalar, kontekst oynasi, 6/12/16-ekranlar
  shundan o'qiydi. `TAVSIF` — kartochkadagi natija matnlari bitta joyda.

**SKILL.md (dars bo'yi shu fayl, emojisiz):**
```
---
name: mahsulot-tavsifi
description: Mini-do'kon mahsulotlari uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.
---
# Mahsulot tavsifi yozish
1. Aniq 3 jumla yoz.
2. Iliq, do'stona ohang.
3. Materiali yoki asosiy ustunligini ayt.
4. Narxni eslat.
5. Oxirida: "Savatga qo'shing!"

Misol: "Yengil va pishiq charm hamyon. Kundalik uchun qulay. Atigi 120 000 so'm — Savatga qo'shing!"
```
✎ «1 ta emoji» qadami va misoldagi 👜 olindi (D4) · 6-ekrandagi body'ning alohida (biroz boshqa) nusxasi olinadi — bitta manba

**Natija matnlari (`TAVSIF`, mahsulot kartochkasida):**
- Skill'siz / umumiy: «Bu yuqori sifatli charm hamyon zamonaviy dizayni bilan ajralib turadi va uzoq muddat xizmat qiladi…» (uzun, narxsiz)
- Hook 1-urinish: «Bu ajoyib mahsulot bo'lib, sizga juda yoqadi va…» · 2-urinish: «Hamyon. Narxi 120000.»
- Skill bilan: «Yengil va pishiq charm hamyon. Kundalik uchun qulay. Atigi 120 000 so'm — Savatga qo'shing!»
- Skill bilan, 2-urinish (6, 12-ekran): «Yumshoq charmdan qulay hamyon. Har kuni cho'ntakda yuradi. Atigi 120 000 so'm — Savatga qo'shing!»
- Krossovka (13-ekran): «Yengil va qulay krossovka. Har kuni kiyishga mos. Atigi 350 000 so'm — Savatga qo'shing!»

---

## 0 · Kirish  ← QKirish
- Eyebrow: Dars · kirish
- Sarlavha: **Nega AI har safar boshqacha tavsif yozadi?** (42)
- Mentor: O'tgan darsda agentga maqsad va tool'lar berdik. Endi bir xil so'rovni ikki marta yuborib, natijaga qarang.
- Maket (chap): mahsulot kartochkasi (tavsif maydoni bo'sh) + chat qatori «Mahsulot tavsifi yoz» · tugma «So'rovni yuboring (0/2)».
- **Harakat → Vizual o'zgarish:** tugmani ikki marta bosish → kartochkaning tavsif maydoniga har safar boshqa matn tushadi: 1-urinish — uzun, narxsiz;
  2-urinish — quruq «Hamyon. Narxi 120000.». Birinchisi xira bo'lib chetga suriladi, ikkalasi yonma-yon «1-urinish · 2-urinish» yorlig'i bilan.
  2/2 dan keyin o'ngdagi variantlar ochiladi.
- Savol (variantlar ustida): **AI kerakli uslubda yozishi uchun nima qilasiz?**
  - Har safar uzun ko'rsatmani qaytadan yozaman
  - Ko'rsatmani bir marta yozib, saqlab qo'yaman
  - Iloji yo'q — AI baribir har xil yozadi
- Javob — 2-variant: **Aynan!** Saqlangan yo'riqnomani Claude'da Skill deyishadi — bugun uning ichini ochamiz. (85)
- Javob — 1 yoki 3: **Qiziq fikr!** So'zlar biroz farq qiladi, lekin saqlangan yo'riqnoma uslubni yaqinlashtiradi — Claude'da bu Skill. (111)
✎ sarlavha 76 → 42, bitta qator (164) · hook javobi 237/208 → 85/111 (162) · 3-variantdagi «har doim» (kafolat so'zi) → «baribir»; javob uning rost tomonini tan oladi
(so'zlar haqiqatan farq qiladi, P-016) · Mentor javobni aytmaydi («bir marta tushuntirish» olindi) · 4-darsdagi atama: «asboblar» → «tool'lar» · ❌-sarlavhali matn-blok → kartochka maketi

## 1 · Reja  ← QReja
- Eyebrow: Reja
- Sarlavha: **AI'ga saqlanadigan yo'riqnoma beramiz: Claude Skill.** (52)
- Mentor: Bir xil ishni AI'ga qayta-qayta tushuntirmaslik uchun qoida bir marta yoziladi. Bugun tayyor Skill'ni o'qib, qanday ishlashini ko'ramiz.
- Chap: «Dars oxirida tayyor SKILL.md'ni o'qiysiz va Claude uni qachon ochishini ayta olasiz.» + **Skill xaritasi** (kichik, jonli): vazifa konverti Claude'ga uchadi →
  uch papkaning description qatori bo'ylab yuradi → `mahsulot-tavsifi` yashil ochiladi → kartochkaga tavsif tushadi; sokin takrorlanadi.
- O'ng — 4 qadam:
  - 01 · Skill nima — saqlanadigan yozma yo'riqnoma · *tushuncha*
  - 02 · SKILL.md: frontmatter va body · *tuzilish*
  - 03 · Claude Skill'ni qanday tanlaydi va ochadi · *ishlash*
  - 04 · Tayyor Skill'ni tahlil qilish · *tahlil*
- Tugma: Boshlaymiz
✎ Mentor 3 gap → 2, ta'rif aytilmaydi (2-ekranga, P-015) · chapdagi statik SKILL.md → jonli xarita (DE-201) · telefonda «4 qadamni ko'rish» almashtirgichi qolip QReja'ga

## 2 · Oddiy so'rov va Skill  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Tushuncha · Skill
- Sarlavha: **Oddiy so'rov va Skill: qaysi biri saqlanadi?** (44)
- Mentor: Skill'ni yangi xodimga beriladigan «bizda shunday qilinadi» qo'llanmasiga o'xshatish mumkin, faqat AI uchun. Yangi suhbat oching va ikki tomonga qarang.
- Bashorat (ballsiz, 181): **Yangi suhbat ochsangiz, yo'riqnoma nima bo'ladi?** · Ikkalasida qoladi · Faqat Skill'da qoladi · Ikkalasida yo'qoladi
- Chap — **chat oynasi** «Oddiy so'rov»: pufakda o'quvchi yozgan qoida «Tavsif 3 jumla bo'lsin, narxni ayt, oxirida "Savatga qo'shing!"».
  O'ng — **Skill xaritasi**: Claude va `mahsulot-tavsifi/` papkasi (ichida `SKILL.md` · `namunalar.md`).
- **Harakat → Vizual o'zgarish:** «Yangi suhbat» → chap oyna tozalanadi (pufak xira bo'lib yo'qoladi, kulrang «yangi suhbat» chizig'i); keyin ikki tomonga ham
  «Charm hamyon uchun tavsif yoz» o'zi yuboriladi: chapda kartochkaga umumiy, narxsiz javob tushadi va bir qator «Yo'riqnoma suhbat bilan birga o'chdi.» (37);
  o'ngda konvert Claude'dan papkaga uchadi, papka yashil ochiladi, kartochkaga Skill bilan tavsif tushadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: faqat Skill'da qoldi»
- Xulosa: Oddiy so'rov bitta suhbatda qoladi, Skill esa papkada saqlanadi va qayta ishlatiladi. (85)
- Tugma (pastki): Yangi suhbat oching → Davom etish
✎ «Hayotdan misol?» → 3 emojili matn-karta (nota · xodim · AI) olindi — o'xshatish bitta, Mentorda (A-8) · ta'rif-kartasi («Skill nima?») o'rniga harakat: suhbat tozalanadi,
Skill qoladi (DE-184) · xulosa 130 → 85 · Skill = papka (SKILL.md + qo'shimcha fayl) endi xaritada ko'rinadi, matnda emas

## 3 · SKILL.md tuzilishi  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Tuzilish · SKILL.md
- Sarlavha: **SKILL.md qanday tuzilgan?** (25)
- Mentor: Mana mini-do'kon uchun haqiqiy Skill fayli. Har yorliqni fayldagi o'z joyiga qo'ying.
- Chap — 3 yorliq: Frontmatter · description · Body. O'ng — SKILL.md fayli (uch zona sokin pulsda — bosiladigan joy, 168).
- **Harakat → Vizual o'zgarish:** yorliqni tanlab, fayldagi zonani bosish → to'g'ri bo'lsa zona accent qavsga olinadi va yorliq unga yopishadi, qavs yonida
  2–4 so'zli izoh: frontmatter — «Skill haqida qisqa ma'lumot» (`name` qatori ostida kulrang: «kichik harflar va defis») · description — «nima va qachon» ·
  body — «qadamlar va misol». Noto'g'ri zona → zona silkinadi, bir qator (≤60):
  - description: «description frontmatter ichida — ikki --- orasida turadi.» (57)
  - Body: «Body pastda, frontmatter tugagandan keyin boshlanadi.» (53)
  - Frontmatter: «Frontmatter faylning eng yuqorisida turadi.» (43)
  3/3 da xaritadagi `mahsulot-tavsifi/` papka-kartasi ikki qatlamga bo'linadi: ustida name + description, ostida body.
- Xulosa: Frontmatter Skill nima va qachon kerakligini aytadi, body — ishni qanday bajarishni. (84)
- Tugma (pastki): Yorliqlarni joylang (N/3) → Davom etish
✎ uch chip → o'ng tomonda matn-karta → yorliqni fayldagi joyiga qo'yish, fayl o'zi belgilanadi (DE-184) · «description qatorini alohida ko'ramiz» gapi olindi (5-ekran o'zi
ko'rsatadi, P-036) · xulosa 113 → 84 · `name` qoidasi qavs ostida saqlandi (7-darsda kerak)

## 4 · 1-savol  ← QTest
- Eyebrow: Mashq · 1-savol · «To'g'ri javobni tanlang»
- Savol: **Skill Claude'ning ishiga qanday ta'sir qiladi?**
  - Claude'ni shunchaki tezroq ishlashga majbur qiladi
  - Claude modelini boshqa, kuchliroq modelga almashtiradi
  - Claude'ni internetga ulab, yangi ma'lumot beradi
  - ✔ Vazifani qanday bajarish kerakligini aniq ko'rsatadi
- Kalit: `INLINE_KEYS.s4 = 3` (4-variant) — o'zgarmaydi
- To'g'ri izohi: Skill modelni o'zgartirmaydi — Claude'ga vazifani qanday bajarishni ko'rsatadi. (79)
- Xato izohlari:
  - 1: Skill tezlik haqida emas — ish qanday bajarilishi haqida. (57)
  - 2: Model o'sha qoladi — Claude yo'riqnomaga qarab ishlaydi. (56)
  - 3: Skill internetga ulamaydi — u yozma yo'riqnoma. (47)
  - umumiy: Skill Claude'ga vazifani qanday bajarishni ko'rsatadi. (54)
✎ to'g'ri izohi 2 gap → 1, «To'g'ri!» olindi · variantlar 48–54 belgi (teng)

## 5 · description  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Frontmatter · description
- Sarlavha: **Claude kerakli Skill'ni qayerdan biladi?** (40)
- Mentor: Claude'da o'nlab Skill bo'lishi mumkin. description qatorini bo'laklardan yig'ing va Claude nimani ko'rishiga qarang.
- Chap — SKILL.md frontmatter'i, `description:` qatorida ikki bo'sh uya: «nima qiladi» · «qachon ishlatiladi». Ostida 4 bo'lak (aralash):
  «Mahsulot uchun qisqa sotuvchi tavsif yozish.» · «Mahsulot nomi berilganda ishlatiladi.» · «Juda foydali va yaxshi Skill.» · «Mening birinchi Skill'im.»
  O'ng — Skill xaritasi: Claude va uch papka-karta (faqat ustki qatlam).
- **Harakat → Vizual o'zgarish:** bo'lakni uyaga qo'yish → `description:` qatoriga o'sha so'zlar yoziladi VA `mahsulot-tavsifi/` papka-kartasining ustki qatlamida
  ham shu qator paydo bo'ladi. Noto'g'ri bo'lak → bo'lak qaytadi, bir qator:
  - «Juda foydali…»: «Bu maqtov — Claude undan vazifani bilib olmaydi.» (48)
  - «Mening birinchi…»: «Bu Skill nima qilishini aytmaydi.» (33)
  2/2 da Claude tugunidan uch papkaga yupqa chiziqlar tushadi va kontekst oynasida uch qator paydo bo'ladi — har Skill'ning faqat name + description'i;
  papkalarning body qatlami kulrang (yopiq) qoladi, yonida kulrang belgi «hali o'qilmagan».
- Xulosa: Claude oldindan faqat name va description'ni ko'radi, shuning uchun description nima va qachonni aytadi. (104)
- Tugma (pastki): description'ni yig'ing (N/2) → Davom etish
✎ «Nega muhim?» → 2 emojili matn-karta → description'ni yig'ish + xaritada «Claude oldindan ko'radigan narsa» (DE-184) · sarlavha 73 → 40, savol · xulosa 217 → 104 ·
«trigger» atamasi 13-ekranga ko'chdi (harakatdan keyin, T-011) · tuzoq-bo'laklar bitta xato-sinfda: «maqtov, vazifa yo'q» (S-040)

## 6 · Body — qadamlar  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Body · yo'riqnoma
- Sarlavha: **Qadamlar natijani qanday o'zgartiradi?** (38)
- Mentor: Body — Skill'ning asosiy yo'riqnomasi. Qadamlarni birma-bir qo'shing va mahsulot kartochkasiga qarang.
- Chap — SKILL.md body: boshida bitta noaniq qator «Yaxshi tavsif yoz.»; ostida 6 bo'lak: SKILL.md'ning 5 qadami + «Misol».
  O'ng — mahsulot kartochkasi (boshida umumiy, uzun, narxsiz tavsif).
- **Harakat → Vizual o'zgarish:** bo'lakni bosish → body'ga raqamli qator yoziladi (noaniq qator chiziladi) VA kartochkadagi tavsif o'zgaradi, o'zgargan joy bir lahza
  yashil ostiga chiziladi:
  - «Aniq 3 jumla yoz.» → uzun matn 3 jumlaga qisqaradi
  - «Iliq, do'stona ohang.» → «Kundalik uchun qulay» kabi iliq so'z
  - «Materiali yoki asosiy ustunligini ayt.» → «pishiq charm»
  - «Narxni eslat.» → «Atigi 120 000 so'm»
  - «Oxirida: "Savatga qo'shing!"» → tavsif shu so'z bilan tugaydi
  - «Misol» → body ostiga misol qatori; kartochkada ikkinchi urinish yonma-yon chiqadi — so'zlari biroz boshqa, uslubi bir xil
- Xulosa: Aniq qadamlar va misol natijani bir xil uslubga yaqinlashtiradi; so'zlar biroz farq qilishi mumkin. (99)
- Tugma (pastki): Qadamlarni qo'shing (N/6) → Davom etish
✎ «Nega bunday aniq?» → 2 emojili matn-karta → har qadam kartochkani o'zgartiradi (DE-184) · Mentor «Tugmani bosing» olindi · body nusxasi `SKILLS`'dan (180) ·
«ehtimoli kamayadi» ruhi saqlandi: ikkinchi urinish ko'rsatiladi, «aynan bir xil» va'da qilinmaydi (A-5)

## 7 · Claude o'rnida (markaziy, nishon)  ← TAJRIBA (saqlanadi, xaritaga o'tdi)
- Eyebrow: Markaziy · Skill'ni tanlash
- Sarlavha: **Claude o'rnida qaysi Skill'ni tanlaysiz?** (40)
- Mentor: Avval Skill'siz javobni ko'ring. Keyin description'larga qarab vazifaga mos papkani bosing.
- Vazifa (chat, chapda): «Charm hamyon uchun sotuvchi tavsif yoz»
- O'ng — Skill xaritasi: uch papka-karta, faqat ustki qatlam (name + description); pastda mahsulot kartochkasi.
  - `mahsulot-tavsifi` — mahsulot uchun qisqa sotuvchi tavsif yozish
  - `mijoz-xati` — mijozga rasmiy xat yozish
  - `hisobot-sql` — sotuv hisoboti uchun SQL yozish
- **Harakat → Vizual o'zgarish:** (1) «Skill'siz yuboring» → konvert Claude'ga boradi, papkalarga tegmaydi; kartochkaga umumiy, narxsiz tavsif tushadi, yorliq «Skill'siz».
  (2) papkani bosish → to'g'ri (`mahsulot-tavsifi`): konvert papkaga uchadi, papka yashil ochiladi, body kontekst oynasiga oqadi; kartochkaga Skill bilan tavsif tushadi,
  yorliq «Skill bilan», eski javob xira bo'lib yonida turadi (oldin · keyin). Noto'g'ri papka → papka silkinadi, yopiq qoladi, bir qator:
  «Bu Skill'ning description'i boshqa ish haqida.» (46)
- Nishon sharti (AchRule, MATN_KORPUS §183) — o'zgarmaydi.
- Xulosa: Bir xil Claude, bir xil vazifa — Skill natijani siz yozgan qoidalarga yaqinlashtirdi. (85)
- Tugma (pastki): Skill'siz yuboring → To'g'ri Skill'ni tanlang → Davom etish
✎ mexanika va nishonlar (Right Skill, Before/After bonus) o'zgarmaydi · radio-ro'yxat → xaritadagi papkalar, javob kartochkada (oldin · keyin) · ❌/✅ sarlavhalar va
natijadagi 👜 olindi · xato izohi 94 → 46 · sarlavha 1 qatorda, savol

## 8 · 2-savol  ← QTest
- Eyebrow: Mashq · 2-savol · «To'g'ri javobni tanlang»
- Savol: **SKILL.md'dagi description nima uchun kerak?**
  - ✔ Claude Skill'ni qaysi vazifada ishlatishni bilishi uchun
  - Skill faylini chiroyli va bezakli qilib ko'rsatish uchun
  - Faqat odam o'qishi uchun — Claude uni umuman ko'rmaydi
  - Qaysi AI modeli ishlashini oldindan tanlab berish uchun
- Kalit: `INLINE_KEYS.s8 = 0` (1-variant) — o'zgarmaydi
- To'g'ri izohi: Claude oldindan description'ni ko'radi va vazifa mos kelsa, Skill'ni ochadi. (76)
- Xato izohlari:
  - 2: description bezak emas — Claude shunga qarab tanlaydi. (54)
  - 3: Aksincha — Claude description'ni oldindan ko'radi. (50)
  - 4: Model tanlanmaydi — description vazifani aytadi. (48)
  - umumiy: description Skill qaysi vazifada kerakligini aytadi. (52)
✎ to'g'ri variant eng uzun edi (55 / 46–49) → to'rttasi 54–56 · to'g'ri izohi 2 gap → 1

## 9 · Faqat mos Skill ochiladi  ← TUSHUNCHA (qayta qurildi; v2 dagi 11-ekran shu yerga)
- Eyebrow: Tushuncha · Skill'ning ochilishi
- Sarlavha: **Claude nega hamma Skill'ni birdan ochmaydi?** (43)
- Mentor: Bot darslaridan eslang: AI bir so'rovda ko'ra oladigan matn hajmi — kontekst oynasi — cheklangan. Vazifani yuboring va oynaga qarang.
- Bashorat (ballsiz): **Vazifa kelganda nechta Skill to'liq ochiladi?** · Bittasi ham · Bittasi · Uchalasi
- Skill xaritasi to'liq: chatda «Charm hamyon uchun tavsif yoz» · Claude · kontekst oynasi `4 / 10` (system prompt + uch name + description qatori) · uch papka yopiq.
- **Harakat → Vizual o'zgarish:** «Vazifani yuboring» → konvert Claude'ga; Claude uch papkaning description qatori bo'ylab navbat bilan o'tadi (accent chegara);
  `mahsulot-tavsifi` yashil ochiladi — body 3 katakka oqib tushadi, hisoblagich `7 / 10`, qolgan 3 katak bo'sh, yorlig'i «ish uchun joy»; `mijoz-xati` va
  `hisobot-sql` xira, kontekstga kirmaydi; `namunalar.md` kulrang qoladi («kerak bo'lsa»). Kontekst oynasi ustida kulrang uzuq soya-qator:
  «Uchala body kirsa, oyna to'lib qolardi.» (39) — boshqa matn yo'q.
- Natija qatori: «Taxminingiz: … · haqiqatda: bittasi»
- Xulosa: Faqat mos Skill to'liq ochiladi — buni progressive disclosure (bosqichma-bosqich ochish) deyishadi. (99)
- Tugma (pastki): Vazifani yuboring → Davom etish
✎ **9 ↔ 11 almashdi:** 10-ekrandagi 3-savol («body qachon o'qiladi?») endi o'z tushunchasidan keyin keladi; oldin u 11-ekranda — savoldan KEYIN — o'rgatilardi
(`SCREEN_META` id va `scored` o'zgarmaydi, kalitlar shu joyida) · «kontekst oynasi» 5-Modul nomi bilan bog'landi (T-052) · xulosa 262 → 99 · bashorat qo'shildi ·
qo'shimcha fayl (3-qatlam) xaritada ko'rinadi — A-3 to'liq

## 10 · 3-savol  ← QTest
- Eyebrow: Mashq · 3-savol · «To'g'ri javobni tanlang»
- Savol: **Skill'ning to'liq matni (body) qachon o'qiladi?**
  - Har bir so'rovda — hamma Skill doim to'liq ochiq
  - Faqat kechasi yoki oldindan belgilangan vaqtda
  - ✔ Claude vazifani shu Skill'ga mos deb topganda
  - Hech qachon — Claude faqat Skill nomini ko'radi
- Kalit: `INLINE_KEYS.s10 = 2` (3-variant) — o'zgarmaydi
- To'g'ri izohi: Claude oldindan faqat name va description'ni ko'radi, body'ni mos vazifada ochadi. (82)
- Xato izohlari:
  - 1: Hammasi ochilsa, kontekst oynasi bekorga to'lardi. (50)
  - 2: Vaqtga emas — vazifa mos kelishiga bog'liq. (43)
  - 4: Body ham o'qiladi, lekin faqat kerak bo'lganda. (47)
  - umumiy: Body Claude vazifa mos deb topganda o'qiladi. (45)
✎ variantlar 45–48 (oldin 37–48) · to'g'ri izohidan «progressive disclosure» atamasi olindi — u 9-ekranda tug'iladi · xato izohi 1: «AI'ning ish joyi» → «kontekst oynasi»

## 11 · Skill va system prompt  ← TUSHUNCHA (qayta qurildi; v2 dagi 9-ekran shu yerga)
- Eyebrow: Farq · system prompt va Skill
- Sarlavha: **Skill system prompt'dan nimasi bilan farq qiladi?** (49)
- Mentor: Bot darslarida system prompt'ni ko'rgansiz — bot uni har xabarda oladi. Uch xabarni yuboring va kontekst oynasini kuzating.
- Bashorat (ballsiz): **Uch xabardan nechtasida Skill ochiladi?** · Hech birida · Bittasida · Uchalasida
- Chapda chat va uch xabar-tugma: «Salom!» · «Charm hamyon uchun tavsif yoz» · «Rahmat!». O'ngda Skill xaritasi; kontekst oynasining eng yuqori qatori —
  `system prompt`: «Sen mini-do'kon yordamchisisan. Samimiy gapir.»
- **Harakat → Vizual o'zgarish:** har xabarni yuborish → chatda AI javobi chiqadi va kontekst oynasida `system prompt` qatori har safar bir lahza yonadi (doim ishlaydi);
  `mahsulot-tavsifi` papkasi faqat 2-xabarda yashil ochiladi va kartochkaga tavsif tushadi; 1 va 3-xabarda papkalar yopiq qoladi.
  Javoblar: «Salom! Qanday yordam beray?» · Skill bilan tavsif · «Arzimaydi! Yana savol bo'lsa, yozing.»
- Natija qatori: «Taxminingiz: … · haqiqatda: bittasida»
- Xulosa: System prompt har xabarda ishlaydi, Skill esa faqat mos vazifada ochiladi. (74)
- Tugma (pastki): Uch xabarni yuboring (N/3) → Davom etish
✎ «Skill-chi?» → matn-karta → uch xabar, oynada farq ko'rinadi (DE-184) · Mentor ta'rifni takrorlamaydi, xaritaga yuboradi · xulosa 165 → 74 ·
system prompt matni AI'ga buyruq — sen-formada qoladi (T-002)

## 12 · Bitta qismi bo'lmasa  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Tahlil · tayyor Skill
- Sarlavha: **Bitta qismi bo'lmasa, Skill nima bo'ladi?** (41)
- Mentor: 7-darsda o'zingiz Skill yozasiz, shuning uchun har qism nega kerakligini hozir sinang. Qismni o'chiring va natijaga qarang.
- Chapda SKILL.md, uch qism yonida kalit (yoqilgan): description · qadamlar · misol. O'ngda Skill xaritasi bo'lagi (vazifa → Claude → papka) va mahsulot kartochkasi.
- **Harakat → Vizual o'zgarish:** kalitni o'chirish → fayldagi qism kulrang, ustidan chiziladi va natija o'zgaradi; kartochka ostida bir qator (≤60):
  - description o'chiq → konvert papkaga bormaydi, kartochkaga umumiy, narxsiz tavsif: «Claude bu Skill'ni qachon ochishni bilmaydi.» (44)
  - qadamlar o'chiq → papka ochiladi, lekin kartochkada uzun tavsif, narx yo'q: «Qadam yo'q — AI nimani yozishni taxmin qiladi.» (46)
  - misol o'chiq → ikki urinish yonma-yon, uslubi sezilarli farq qiladi: «Misol yo'q — ikki urinish uslubi ko'proq farq qiladi.» (53)
  Kalitni qayta yoqish → qism va natija tiklanadi.
- Xulosa: Yaxshi Skill = aniq description + aniq qadamlar + misol. Bittasi bo'lmasa, natija yomonlashadi. (95)
- Tugma (pastki): 3 qismni sinang (N/3) → Davom etish
✎ uch mezon-chip → javob-karta («Ha: …») → olib tashlash sinovi: qism o'chadi, natija buziladi (1-dars 9-ekran naqshi, DE-184) · formula saqlandi (auditda eng kuchli
joy), xulosa 159 → 95 · «7-darsda» fakti saqlandi (F-0929-25)

## 13 · Bu Skill qaysi vazifada ishga tushadi (nishon)  ← TAJRIBA (saqlanadi, xaritaga o'tdi)
- Eyebrow: Amaliy · qaysi vazifada
- Sarlavha: **Bu Skill qaysi vazifada ishga tushadi?** (38)
- Mentor: Claude o'rnida bo'ling: description'ga qarab, shu Skill'ni ochadigan xabarni bosing.
- O'ngda `mahsulot-tavsifi/` papka-kartasi (name + description ko'rinadi) va mahsulot kartochkasi (bo'sh). Chapda chat — uch xabar-pufak (bosiladi):
  - «Mijozga rasmiy uzr xati yoz»
  - ✔ «Yangi krossovka uchun sotuvchi tavsif yoz»
  - «Sotuv hisobotini SQL'da chiqar»
- **Harakat → Vizual o'zgarish:** xabarni bosish → konvert papkaga uchadi; mos kelmasa — papka yopiq qoladi, konvert chatga qaytadi, bir qator:
  - 1: «Bu xat vazifasi — description mos kelmaydi.» (43)
  - 3: «Bu hisobot vazifasi — unga boshqa Skill kerak.» (46)
  mos kelsa — papka yashil ochiladi, kartochkada krossovka chiqadi (rasm-skelet, «350 000 so'm», Skill bilan tavsif).
- Nishon sharti (AchRule) — o'zgarmaydi (Right Trigger, birinchi urinish).
- Xulosa: Vazifa description'ga mos kelsa, Skill ishga tushadi — inglizcha buni trigger deyishadi. (88)
- Tugma (pastki): Mos xabarni tanlang → Davom etish
✎ Mentor description'ni qayta aytmaydi — u kartada ko'rinib turibdi (T-047) · «✅ To'g'ri!» → bitta yashil xulosa, 134 → 88 · «trigger» shu yerda bir marta (7-dars uchun) ·
ro'yxat → xabar-pufak + papka + kartochka

## 14 · 4-savol  ← QTest
- Eyebrow: Mashq · 4-savol · «To'g'ri javobni tanlang»
- Savol: **Bir xil vazifani AI'ga qayta-qayta tushuntiryapsiz. Eng yaxshi yechim qaysi?**
  - Har safar qo'lda, boshidan tushuntiraveraman
  - Bu vazifa uchun AI'dan butunlay voz kechaman
  - Kuchliroq va qimmatroq AI modelini olaman
  - ✔ Vazifa uchun saqlanadigan yo'riqnoma yozaman
- Kalit: `INLINE_KEYS.s14 = 3` (4-variant) — o'zgarmaydi
- To'g'ri izohi: Takrorlanadigan vazifa uchun yo'riqnoma bir marta SKILL.md'ga yoziladi va qayta ishlatiladi. (92)
- Xato izohlari:
  - 1: Qayta-qayta tushuntirish vaqt oladi, natija ham har xil. (56)
  - 2: Voz kechish yechim emas — AI bu ishda yordam bera oladi. (56)
  - 3: Muammo model kuchida emas — sizga bir xil uslub kerak. (54)
  - umumiy: Takrorlanadigan vazifaga Skill yoziladi. (40)
✎ to'g'ri variant hook'dagi 2-variant bilan so'zma-so'z bir xil edi («…bir marta yozib, saqlab qo'yaman») → boshqa so'z bilan (S-008) · variantlar 41–44

## 15 · Tartibni yig'ing (final)  ← QTartib
- Eyebrow: Yakuniy · amaliy
- Sarlavha: **Skill qanday ishga tushadi?** (27)
- Mentor: Claude Skill'ni qanday ishlatishini eslang. Bo'laklarni to'g'ri tartibda joylang.
- Bo'laklar (to'g'ri tartibda): Vazifa keladi · description mos keladi · Skill ochiladi · Yo'riqnomaga amal qilinadi · Natija
- Uya izohi: «bu yerga qo'ying» (har uyada; raqam uyada bor)
- Xato: Tartib xato — bo'lakni bosib qaytaring va qayta joylang. (56)
- **Harakat → Vizual o'zgarish (tugagach, 199):** tartib paneli yopiladi, Skill xaritasi butun enga chiqib bir marta yuradi: konvert → description'lar → papka ochiladi →
  kartochkaga tavsif tushadi.
- Xulosa: Tartib tayyor: vazifa → description mos → Skill ochiladi → yo'riqnomaga amal → natija. (86)
- Kalit: `INLINE_KEYS.s15 = 0` (to'liq to'g'ri tartib) — o'zgarmaydi · nishon Skill Flow
✎ 🔴 Mentor «Vazifa kelgan paytdan boshlang» 1-uyani aytib qo'yardi → olindi (GATE M «Mentor tartibni aytmaydi») · xato qatoridan ⚠️ olindi · xulosa 128 → 86 ·
tugagach xarita (bitta vizual) javobni ko'rsatadi

## 16 · Amaliyot · SKILL.md  ← amaliyot bloki (173)
- Eyebrow: Amaliyot · SKILL.md · joy: «kompyuteringizda»
- Sarlavha: **Tayyor Skill'ni kompyuteringizda yarating va sinang** (51)
- Mentor: Darsdagi Skill'ni haqiqiy faylga aylantiramiz. Har qadamni bajarib, «Bajardim»ni bosing.
- Chapda 4 qadam (bittadan ochiladi, ↻ qaytaradi):
  1. **Ochish** — Antigravity'da yangi papka oching: `mahsulot-tavsifi`. Ichida `SKILL.md` faylini yarating.
  2. **Nusxalash** — Quti ichidagi matnni «Nusxalash» bilan `SKILL.md`'ga qo'ying. `{…}` joyiga o'z mahsulot turingizni yozing.
     Quti (`PromptBox`): darsdagi SKILL.md, faqat description qatori — `Mini-do'kon {mahsulot turi} uchun qisqa sotuvchi tavsif yozish. Mahsulot nomi berilganda ishlatiladi.`
  3. **Sinash** — gemini.google.com'da yangi suhbat oching. SKILL.md matnini qo'yib, yozing: `{mahsulot nomi} uchun tavsif yoz`.
     Natija qoidaga mos chiqmasa — so'rov oxiriga qo'shing: `SKILL.md'dagi qadamlarga amal qil.`
  4. **Tekshirish** — Natijani SKILL.md bilan solishtiring: 3 jumlami, narx bormi, «Savatga qo'shing!» bilan tugadimi? Yana bir marta so'rab, uslubni solishtiring.
- O'ngda — kutilgan natija (bitta vizual): fayl-karta (papka daraxti `mahsulot-tavsifi/` → `SKILL.md`) va ostida chat: «Charm hamyon uchun tavsif yoz» →
  Skill bilan tavsif. Yorliq: «kutilgan natija · namuna: charm hamyon».
- Pastda (`.ab-tail`): «Claude'da bu papka Skill sifatida qo'shiladi va kerak bo'lganda o'zi ochiladi; bu yerda yo'riqnomani suhbatga o'zingiz berasiz.»
- Xulosa (oxirgi «Bajardim»dan keyin): SKILL.md kompyuteringizda tayyor. 7-darsda o'z vazifangiz uchun Skill yozasiz. (78)
- Jonli: `PRACTICE_BASE` zonasi, ball yo'q (`INLINE_KEYS.practice = -1` — o'zgarmaydi).
✎ «qog'ozda yoki kompyuteringizda reja» → haqiqiy fayl, haqiqiy sinov (173) · «Hali faylni yaratmaysiz» olindi · o'z Skill'ini noldan yozish 7-darsda qoladi —
bu yerda tayyor Skill nusxalanadi va bitta qatori moslanadi · halol izoh: chatga qo'yish Skill yuklash emas (A-3, P-028)

## 17 · Natijalar (podium) — v2 dagidek (umumiy shablon)

## 18 · Kartochkalar  ← QKartochka (12)

| Old tomon | Orqa | Izoh |
|---|---|---|
| Claude Skill nima? | AI uchun qayta ishlatiladigan yozma yo'riqnoma | Bitta aniq vazifani qanday bajarishni tushuntiradi |
| Skill'ning asosiy fayli qanday nomlanadi? | SKILL.md | Papkada turadi; yonida qo'shimcha fayllar bo'lishi mumkin |
| SKILL.md qaysi ikki qismdan iborat? | Frontmatter va body | Frontmatter — qisqa ma'lumot, body — yo'riqnoma |
| Frontmatter faylning qayerida turadi? | Eng yuqorida, ikki --- chiziq orasida | Ichida name va description bo'ladi |
| name qanday yoziladi? | Kichik harflar va defis bilan | Masalan: mahsulot-tavsifi |
| Claude oldindan nimani ko'rib turadi? | Har Skill'ning name va description'i | To'liq matnni kerak bo'lganda ochadi |
| description'da nima yoziladi? | Skill nima qiladi va qachon ishlatiladi | Claude Skill'ni shunga qarab tanlaydi |
| Body ichida nima bo'ladi? | Aniq qadamlar va misol | Misol kutilgan natijani ko'rsatadi |
| To'liq body qachon o'qiladi? | Claude vazifa mos deb topganda | Qolgan Skill'lar yopiq qoladi |
| Faqat kerakli Skill'ning ochilishi qanday ataladi? | Progressive disclosure | Bosqichma-bosqich ochish — kontekst oynasi band bo'lmaydi |
| System prompt va Skill farqi? | System prompt — doim; Skill — kerak bo'lganda | System prompt umumiy ohangni, Skill bitta ishni belgilaydi |
| Skill'ning ishga tushishi inglizcha qanday ataladi? | Trigger | Vazifa description'ga mos kelganda bo'ladi |

✎ «Qanday vazifa Skill uchun eng mos?» (4-savol va arena 9 bilan uch marta takror) → «trigger» kartasi (7-dars uni izohsiz ishlatadi) · «nomi» → «name» (atama bir xil)

## 19 · Yakun  ← QYakun
- Yorliqlar (tepada): ✓ Skill o'qishni o'rgandingiz · N/5 to'g'ri
- Sarlavha: **Endi AI'ga aniq, saqlanadigan yo'riqnoma bera olasiz.** (53)
- CTA: CODE STRIKE + arena (darsdan)
- Endi siz bilasiz:
  - Skill — AI uchun qayta ishlatiladigan yozma yo'riqnoma; asosiy fayli — SKILL.md
  - SKILL.md: frontmatter (name + description) va body (qadamlar + misol)
  - Claude oldindan faqat name va description'ni ko'radi; body'ni mos vazifada ochadi
  - Aniq description Skill'ni to'g'ri paytda ochishga yordam beradi
  - Yaxshi Skill = aniq description + aniq qadamlar + misol
- Uyga vazifa (`uyga`):
  - **Sinang** — SKILL.md'ingizni yana ikki xil mahsulot bilan sinab ko'ring
  - **Tahlil** — natija qadamlarga mosmi: 3 jumla, narx, «Savatga qo'shing!»?
  - **Rejalashtiring** — loyihangizda qaysi takrorlanadigan vazifaga Skill kerak? 7-darsda shunga yozasiz
- Keyingi dars — «Ilova o'zi qaror qilsa, kimga tegadi?». Mini-do'koningizda ilova o'zi qilmaydigan ishlarni va ular kimga tegishini yozasiz.
✎ «description aniq bo'lsa, Skill kerakli paytda ishlaydi» (kafolat) → «…ochishga yordam beradi» (A-4) · uyga vazifa amaliyot fayliga bog'landi («O'qing» → «Sinang») ·
🚀 va 📝 olindi (qolip `QYakun`, 204)

---

## Nishonlar (4) — o'yin qatlami, inglizcha nom qoladi
- 🎯 **Right Skill** — vazifaga mos Skill'ni description'dan topdingiz (7)
- ⚡ **Right Trigger** — Skill qaysi vazifada ishga tushishini to'g'ri tanladingiz (13)
- 🔀 **Before/After** — Skill'siz va Skill bilan farqni ko'rdingiz (7, bonus)
- 🏆 **Skill Flow** — Skill ishlash tartibini to'g'ri yig'dingiz (15)

## Qisqa takrorlash oynalari (5 test × 3 karta) — matn v2 dagidek, belgi o'zgaradi
Belgi: emoji o'rniga raqam 1 · 2 · 3; kodli kartada koddan bitta qator (S-026).
1. (4) **Skill — yozma yo'riqnoma:** Skill Claude'ga bitta vazifani qanday bajarishni ko'rsatadi. · Model o'zgarmaydi — o'sha Claude yo'riqnomaga qarab ishlaydi. ·
   Natija bir xil uslubga yaqinlashadi. · Sinfga savol: Skill oddiy so'rovdan (prompt) nimasi bilan farq qiladi?
2. (8) **description — qachon kerak:** `description: …` Claude oldindan faqat name va description'ni ko'radi. · Vazifa mos kelsa — Skill ochiladi. ·
   Noaniq description → Skill kerakli paytda ochilmasligi mumkin. · Sinfga savol: Nega description aniq bo'lishi kerak?
3. (10) **Progressive disclosure:** To'liq matn faqat vazifa mos kelganda ochiladi. · Qolgan Skill'lar yopiq qoladi — kontekst oynasi band bo'lmaydi. ·
   Har so'rovda hammasini ochish — joyni bekorga to'ldirardi. · Sinfga savol: Body qachon o'qiladi?
4. (14) **Takror vazifa → Skill:** Yo'riqnomani bir marta yozasiz. · Claude shu vazifada unga qarab ishlaydi. · Qayta-qayta tushuntirish kerak bo'lmaydi. ·
   Sinfga savol: Qanday vazifa Skill uchun eng mos?
5. (15) **Skill ishlash tartibi:** Avval vazifa keladi. · description mos keladi → Skill ochiladi → yo'riqnomaga amal qilinadi. · Oxirida natija.
   (zanjir: Vazifa → description → Skill → Amal → Natija) · Sinfga savol: Nega tartib muhim?
✎ 3-oyna endi o'z tushunchasidan (9-ekran) keyin chiqadi · 2-oynada «ishlamasligi» → «ochilmasligi» (bir ma'no — bir so'z)

## Jonli viktorina (12 savol, ✔ o'rni o'zgarmaydi — faqat matn)
1. Claude Skill nima? Kuchliroq AI modelining maxsus nomi · Internetdan yangi ma'lumot oladigan qidiruv · ✔ AI uchun qayta ishlatiladigan yo'riqnoma · Dastur ikonkasi saqlanadigan fayl
2. SKILL.md qaysi ikki qismdan iborat? ✔ Frontmatter va body · Rasm va ovoz fayllari · Parol va foydalanuvchi nomi · Server va baza manzili
3. description nima uchun kerak? Skill faylini chiroyli ko'rsatish uchun · AI modelini boshqasiga almashtirish uchun · Faqat odam o'qishi uchun, Claude uchun emas · ✔ Skill qachon kerakligini aytish uchun
4. Skill body'sida odatda nima bo'ladi? Faqat Skill nomi · ✔ Aniq qadamlar va misol · Foydalanuvchi paroli · AI modelining versiyasi
5. Progressive disclosure nima? Hamma Skill doim to'liq ochiq turadi · Skill faqat kechasi ishlaydi · Skill AI javobini tezlashtiradi · ✔ To'liq matn kerak bo'lganda ochiladi
6. Claude oldindan nimani ko'rib turadi? ✔ Skill'lar nomi va description'ini · Har bir Skill'ning butun matnini · Foydalanuvchining eski suhbatlarini · Kompyuterdagi barcha fayllarni
7. Skill oddiy so'rovdan (prompt) nimasi bilan farq qiladi? Skill — bir marta aytiladigan gap · ✔ Skill saqlanadi va qayta ishlatiladi · Skill AI modelini kuchliroq qiladi · Skill Claude'ni internetga ulaydi
8. Yaxshi Skill'ning belgisi qaysi? Uzun, chalkash va tartibsiz yozilgan matn · Faqat bitta so'zdan iborat matn · ✔ Aniq description, qadamlar va misol · Ko'p rangli bezaklar va emoji
9. Qanday vazifa Skill uchun eng mos? ✔ Qayta-qayta bajariladigan vazifa · Bir martagina bo'ladigan tasodifiy ish · Faqat rasm chizish bilan bog'liq ish · Faqat o'yin o'ynash bilan bog'liq ish
10. Skill natijaga qanday ta'sir qiladi? Natijani har safar butunlay tasodifiy qiladi · Natijaga hech qanday ta'sir qilmaydi · AI javobini ancha sekinlashtirib qo'yadi · ✔ Natijani siz yozgan uslubga yaqinlashtiradi
11. System prompt va Skill farqi qaysi? System prompt va Skill — aynan bir narsa · System prompt — kechasi; Skill — kunduzi · ✔ System prompt — doim; Skill — kerak bo'lganda · Skill — eng kuchli va qimmat AI modelining nomi
12. Noaniq description qanday oqibatga olib keladi? Skill boshqalaridan ancha tezroq ishlaydi · ✔ Skill kerakli paytda ochilmasligi mumkin · AI modeli o'z-o'zidan o'zgarib qoladi · Kompyuterning internet aloqasi uziladi

Kalit (kod bilan bir xil): C · A · D · B · D · A · B · C · A · D · C · B = 3/3/3/3.
✎ 1, 3, 8, 11-savollarda to'g'ri variant yagona eng uzun edi; 7, 9, 10, 12-da farq 10+ belgi → variantlar tenglashdi · 11-savolda «—;» shakli faqat to'g'rida edi
→ 2-variant ham shu shaklda · 12: «ishlamasligi» → «ochilmasligi» · 7-savol: «so'rov (prompt)dan» → «so'rovdan (prompt)» (qo'shimcha qavsdan keyin turmaydi)

**Fon so'zlari (R-008, arena foni):** SKILL.md · description · trigger · name · body · frontmatter · Skill'siz → Skill · progressive · kontekst oynasi · uslub
(belgilar ✓ ✗ ⚡ 📋 — o'yin qatlami). Kod bosqichida `{uz, ru}`: «Skill'siz → Skill», «kontekst oynasi», «uslub» tarjima qilinadi, qolgani atama.
**Uyga vazifa banneri:** amaliyot · loyiha · mashq · natija (o'zgarmaydi, `{uz, ru}` bor).

---

## B. Kod bosqichida (KOD)
1. **`SKILLS` — bitta manba (180):** uch Skill (name, description, body qadamlari, misol, qo'shimcha fayl). SkillMd (1, 3, 5, 6, 12, 16), papka-kartalar (2, 5, 7, 9, 11, 13),
   kontekst oynasi shundan o'qiydi; 6-ekrandagi alohida body nusxasi va `SHELF`/`CARD_OPTS` takrorlari olinadi. `TAVSIF` — kartochka matnlari.
2. **`SkillMap`:** Vazifa (chat) · Claude tuguni (chizilgan, logotipsiz) · kontekst oynasi (`n / 10`, bo'sh kataklar boshidan ko'rinadi, P-056) · 3 papka-karta (3 qatlam);
   holatlar kulrang · accent · yashil · xira; konvert animatsiyasi (`prefers-reduced-motion` — sakrash); `// qolip-maket:` e'loni.
3. **`MahsulotMock`:** rasm-skelet, nom, narx, tavsif maydoni; holatlar bo'sh · Skill'siz · Skill bilan · ikki urinish yonma-yon; «namuna natija» yorlig'i;
   6-ekran uchun `tavsifYasa(qoidalar)` (qo'shilgan qadamlardan matn yig'iladi, o'zgargan joy yashil ostiga chiziladi).
4. **SKILL.md matni:** «1 ta emoji» qadami va misoldagi 👜 olinadi (D4); 7-ekran natijasi ham emojisiz.
5. **Qolipga o'tkazish:** 0 `QKirish` · 1 `QReja` · 2, 3, 5, 6, 9, 11, 12 `QTushuncha` (`zoom` + `tugadi`, q17/q18) · 7, 13 `QTushuncha` (nishon mantig'i, `AchMissCtx`
   o'zgarmaydi) · 4, 8, 10, 14 `QTest` (darsning `QuestionScreen` mantig'i, `correctIdx` o'zgarmaydi) · 15 `QTartib` · 18 `QKartochka` · 19 `QYakun`.
6. **9 ↔ 11 mazmuni almashadi:** `screens[9]` = progressive disclosure, `screens[11]` = system prompt; `SCREEN_META` id/scored/scope, `INLINE_KEYS`, `RECAPS`, `Q_LABELS`
   o'zgarmaydi (faqat s9/s11 `type` qiymati almashadi).
7. **Bashorat (ballsiz, 181):** 2, 9, 11-ekran — `QBashorat` + `QTaxmin`, `onAnswer`'ga kirmaydi.
8. **Hook:** 3-variant matni («baribir»), ikki javob qisqaradi; tugma «So'rovni yuboring (N/2)», natija kartochkada.
9. **Testlar:** variant matnlari (s8, s10, s14) tenglashadi, `correctIdx` o'zgarmaydi; `explainCorrect` bitta gap, «To'g'ri!» siz; xato izohlari ≤60 (`lint:olchov`).
10. **Arena `QUIZ_BANK`:** 1, 3, 7, 8, 9, 10, 11, 12-savollarda variant matni; `correct` qiymatlari o'zgarmaydi (q23 3/3/3/3).
11. **`RECAPS`:** `ic` emoji → raqam yoki kod qatori (S-026); 8-oynada «ochilmasligi».
12. **`QZ_BG_SHAPES`:** so'zlar `{uz, ru}` (R-008), «kontekst» → «kontekst oynasi».
13. **Amaliyot:** `ScreenLivePractice` → `ScreenBlok` (173: 4 qadam, `PromptBox` «Nusxalash» + `{…}` pill, o'ngda fayl-karta + chat, `.ab-tail`); jonli `PRACTICE_BASE`,
    `INLINE_KEYS.practice = -1` o'zgarmaydi. Namuna — 5-Modul `BotAiProjectLesson.jsx` `ScreenBlok`.
14. **Kartochka 12:** «Qanday vazifa Skill uchun eng mos?» → «trigger» kartasi.
15. **15-ekran:** Mentor yangi matn, xato qatoridan ⚠️ olinadi, tugagach `SkillMap` bir marta yuradi (199).
16. **Yakun:** `QYakun` (🚀, 📝 olinadi), recap 4-band yangi matn, uyga vazifa 3 band yangi.
17. **Darvozalar:** `npm run gates -- src/6-Modull/ClaudeSkillsLesson.jsx` 12/12 · `lint:olchov` 0 warn (hozir 26) · `lint:emoji` 0 · `lint:qolip` q13–q21 · `lint:jsx` ·
    `lint:layout` 1280/1366/390 · surat (1280 + 393).

**REPO:** yo'q (amaliyot o'quvchining kompyuterida, `TelegramBotNest`'ga tegilmaydi).
**Menyu nomi (DE-205):** «Claude Skills — nima» — App.jsx bilan bir xil, o'zgarmaydi.

---

## GATE M — o'z tekshiruvim
- [✓] Oldingi/keyingi dars va menyu nomi App.jsx bilan mos: m6-04 «AI-agent nima» → m6-05 «Claude Skills — nima» → m6-06 «Ilova o'zi qaror qilsa, kimga tegadi?»; 7-dars havolasi to'g'ri
- [✓] Bitta misol-ip (mini-do'kon, charm hamyon; krossovka — faqat 13-ekranda, o'sha olamda) · metafora bitta, bir marta (2-ekran) · bitta vizual dars bo'yi — Skill xaritasi + mahsulot kartochkasi
- [✓] Har tushuncha-ekranda «Harakat → Vizual o'zgarish» bor: 0, 2, 3, 5, 6, 7, 9, 11, 12, 13, 15 (tugagach)
- [✓] Sarlavha ≤55 bitta qator (25–53) · Mentor ≤2 gap, sarlavhani takrorlamaydi · xulosa ≤110 (74–104) · hook javobi ≤120 (85/111) · xato izohi ≤60 (33–57) — skript bilan o'lchandi
- [✓] Atamalar oldingi darslar bilan bir xil: tool (4-dars), system prompt va kontekst oynasi (5-Modul «Bot ichida AI»), mini-do'kon (3/4/6-dars) — grep · siz-forma; tugma siz-formada,
  zanjir ot-shaklda; AI'ga beriladigan matn (SKILL.md, system prompt, prompt) sen-formada (T-002)
- [✓] Testlar: uzunlik teng (farq ≤6), to'g'ri variant yagona eng uzun emas (8, arena 1/3/8/11 tuzatildi) · ✔ o'rni o'zgarmagan (s4=3, s8=0, s10=2, s14=3; arena 3/3/3/3)
- [✓] Final: uya izohi «bu yerga qo'ying» tartibni ochmaydi · Mentor tartibni aytmaydi (eski «Vazifa kelgan paytdan boshlang» olindi)
- [✓] Emoji yo'q (nishon va arena foni — o'yin qatlami) · kafolat gaplari yo'q («har doim» hook variantidan olindi; «aynan bir xil» va'da qilinmaydi)
- [✓] Ichki kodlar yo'q (o'quvchi matnida «Modul 8», «T6» yo'q; «Bot darslari», «7-darsda» — o'quvchi taniydigan nom) · tarixiy voqea yo'q · «KOD» ro'yxati — 17 band
- [✓] Karta T · P · S ko'rildi: T-011 (progressive disclosure, trigger — harakatdan keyin) · T-016/017 (bitta o'xshatish) · T-047 (13-ekran Mentori) · P-015 (reja ta'rif aytmaydi) ·
  P-016 (hook javobi variantning rost tomonini tan oladi) · P-036 · P-052 · P-056 (kontekst oynasi n/N) · P-057 · P-064 (bashorat 2/9/11) · P-067 · P-068 · S-006/008 · S-026 · S-040
- [✗→savol] P-028: amaliyotdagi «Claude'da Skill qo'shish» yo'li (tarif, menyu nomi) tekshirilmagan — shuning uchun sinov gemini.google.com'da, Claude haqida faqat halol
  `.ab-tail` qatori; foydalanuvchi qarori kerak (quyida)

## Foydalanuvchi uchun savollar
1. **Amaliyotda sinov qayerda?** Tavsiya: gemini.google.com (sinfda shu ishlatiladi), SKILL.md matnini suhbatga qo'yib; Claude'da Skill qo'shishni faqat
   `.ab-tail` qatorida aytamiz — tarif va menyu nomlarini tekshirmagan holda yozmaymiz (P-028).
2. **9 ↔ 11 almashuvi:** tavsiya — almashtirish (3-savol «body qachon o'qiladi?» endi o'z tushunchasidan keyin; kalitlar joyida qoladi).
