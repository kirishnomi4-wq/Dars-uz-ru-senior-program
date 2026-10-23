# F-1022-01 · m3-10 «Qachon «tayyor» deb ayta olamiz?» — qayta yozish (ekranma-ekran)

> Holat: **22.10 19:30 — KODGA O'TKAZILDI** (`src/3-Modull/PmLesson9.jsx`, uz+ru). Foydalanuvchi tasdig'i 22.10 («qolgani yoqdi»); qo'shimcha: atama ochiq aytiladi — yakun «Endi siz bilasiz» 2-qatori «Bu ro'yxat — qabul shartlari: AI'ga yozishdan oldin yoziladi, keyin o'zingiz tekshirasiz» (Cyberpunk ko'prigi va 09-ro'yxat sarlavhasi avvaldan atamani aytardi). Gates 12/13 — faqat `emoji` yiqiladi, u HEAD'da ham 6 error (161-qonun bu darsdan keyin kirgan, bu tahrirdan emas). `dasturchi-topshiriq` 0. Uy vazifasi tegilmadi.
> Manba-fidbek: 22.10, mentor (real dars, LMS preview): «shu slaydni ma'nosini tushunmadim» + «PM dars slaydlarini tushuntirib bersangiz».
> Foydalanuvchi: «o'quvchimiz PM emas, 10 ta dasturchisi yo'q — startapchi, AI bilan o'zi quradi».

## 0. Nima o'zgaradi, nima qoladi

**O'quvchi roli (yangi):** o'quvchi — maktab bufeti uchun sayt qilayotgan startapchi. Kodni o'zi yozadi, AI'dan (gemini.google.com) yordam oladi.
Darsda ish beriladigan dasturchi, jamoa, rahbar YO'Q. «Tayyor» deydigan tomon — **AI**: u doim ishonch bilan «Tayyor, hammasi ishlaydi» deydi.

**Qoladi (o'zgarmaydi):** bufet misol-ipi · to'rt shartli buyurtma oynasi (s4) · Cyberpunk 2077 voqeasi · `qabulQilinadimi` koding · ekranlar soni (16) · ball-kalitlari va test javoblari (`s3 s5 s7 s11` to'g'ri javob indeksi o'zgarmaydi) · uy vazifasi tuzilmasi.

**O'zgaradi:** «dasturchi»ga ishora qiluvchi 22 joy (dars) · kirish-ekranda mentor ekrani javobni oldindan ochib qo'yishi · har ekranda mentor uchun «Bu slayd nima uchun» qatori.

Belgilar: ❌ hozir → ✅ yangi. Ko'rsatilmagan matn o'zgarmaydi.

---

## 01 / 16 · s0 · Kirish (mentor tushunmagan slayd)

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Yuqori yozuv | Kirish · dasturchi topshirdi | Kirish · AI «tayyor» dedi |
| Sarlavha | Dasturchi «tayyor» dedi. *Ishonasizmi?* | AI «tayyor» dedi. *Ishonasizmi?* |
| Mentor gapi | Maktab bufeti saytiga «Buyurtma berish» tugmasini qo'shishni dasturchidan so'ragandingiz. Bugun u yozdi: «Tayyor, ishlaydi». | Siz maktab bufeti uchun sayt qilyapsiz. Gemini'dan «Buyurtma berish» tugmasini so'radingiz. U kod berdi va yozdi: «Tayyor, hammasi ishlaydi». |
| 1-variant | 👍 Ishonaman — dasturchi tekshirgandir | 👍 Ishonaman — AI tekshirgandir |
| 2-variant | 🤔 O'zim ochib ko'raman | (o'zgarmaydi) |
| Natija-matn | Ochib ko'ramiz: tugma ishlaydi. Lekin **bo'sh** buyurtma ham ketaverdi. | (o'zgarmaydi) |

**Vizual nuqson (tuzatiladi):**
- Hozir mentor ekranida natija (buyurtmalar ro'yxati + «bo'sh buyurtma ham ketaverdi») **o'quvchilar tanlashidan oldin** ochiq turadi — proyektorda javob ko'rinib qoladi. Kodda: `opened = picked !== null || isMentor`.
  ✅ Mentor ekranida natija **«Natijani ochish»** tugmasi bosilgandagina chiqadi (test-ekranlardagi «Avval natijani oching» bilan bir xil yo'l). Ovoz-diagrammasi tanlov paytida ko'rinib turadi.
- Hozir bo'sh buyurtma qatorida ham **yashil** «yuborildi ✓» — xato «yaxshi» bo'lib ko'rinadi.
  ✅ Bo'sh qator qizil fonda, belgisi «yuborildi ⚠».

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** AI «tayyor» desa ham, o'zingiz ochib ko'rmaguncha ishonib bo'lmasligini o'quvchi o'z ko'zi bilan ko'radi.
> Ovozlar bo'linadi. «Ishonaman» deganlar ko'p bo'lsa — bu ham dars: tekshirmasdan ishonilgan joyda keyin muammo chiqadi. Javobni oldindan aytmang — hamma tanlagach «Natijani ochish»ni bosing.

---

## 02 / 16 · s1 · Maqsad

Matn o'zgarmaydi (sarlavha: «Bugun «tayyor» so'zini *uchta aniq shartga* aylantirasiz»).

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** dars oxirida nima bo'lishini oldindan ko'rsatadi — «tayyor» degan bitta so'z uchta tekshiriladigan shartga aylanadi.
> Ro'yxat yozilib bo'lgunicha gapirmang — vizual o'zi tanishtiradi.

---

## 03 / 16 · s2 · Ikki karta

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Sarlavha | Dasturchi «ishlaydi» dedi — bu *«tayyor»* deganimi? | AI «ishlaydi» dedi — bu *«tayyor»* deganimi? |
| 1-karta sarlavhasi | Dasturchi «ishlaydi» deganda | AI «ishlaydi» deganda |
| 1-karta matni | Kod ishladi, tugma bosildi, buyurtma ketdi | (o'zgarmaydi) |
| 2-karta matni | Siz va dasturchi kelishgan hamma shart bajarildi | Siz oldindan yozgan hamma shart bajarildi |
| Xulosa | «Ishlaydi» — bitta yo'l tekshirilgan… | (o'zgarmaydi) |

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** «ishlaydi» va «tayyor» bir narsa emasligini o'quvchi ikki kartani solishtirib o'zi topadi.

---

## 04 / 16 · s3 · Test «ishlaydi»

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Savol | Dasturchi «ishlaydi» dedi. Bu nimani anglatadi? | AI «ishlaydi» dedi. Bu nimani anglatadi? |
| Yordam | Dasturchi qaysi holatni bosib ko'rganini o'ylang. | «Ishlaydi» deyilganda qaysi holat sinalganini o'ylang. |

Variantlar, to'g'ri javob, izohlar — o'zgarmaydi.

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** «ishlaydi» faqat bitta — hammasi to'g'ri kiritilgan — yo'l ekanini mustahkamlaydi.

---

## 05 / 16 · s4 · Sinov: buyurtma oynasi

Matn o'zgarmaydi (dasturchi yo'q).

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** darsning yuragi — o'quvchi oynani o'zi bosib, to'rt shartdan faqat bittasi bajarilganini topadi.
> (Hozirgi eslatma qoladi: «tez ikki marta bosish»ga turtki bering, qaysi shart bajarilmaganini AYTMANG.)

---

## 06 / 16 · s5 · Test «hamma shart»

| | ❌ hozir | ✅ yangi |
|---|---|---|
| 2-variant | Yo'q — dasturchi hali kodni yozmagan | Yo'q — AI hali kodni oxirigacha yozmagan |

Qolgani o'zgarmaydi.

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** bitta shart bajarilmasa ham ish «tayyor» emas — shartlar orasida «eng muhimi» yo'q.

---

## 07 / 16 · s6 · Cyberpunk 2077 · 08 / 16 · s7 · Test «nosozlik narxi»

Matn o'zgarmaydi. Ko'prik gapi allaqachon o'quvchining o'ziga qaytadi: «…Endi shunday ro'yxatni o'z ishingizga yozasiz».

**Mentor eslatmasi (s6):**
> **Bu slayd nima uchun:** katta studiya ham «ishlaydi» degan so'zga ishonib chiqargan — natijada odamlarning ishonchi yo'qolgan. Oldindan yozilgan shartlar ro'yxati (qabul shartlari) shundan saqlaydi.

**Mentor eslatmasi (s7):**
> **Bu slayd nima uchun:** nosozlikning eng qimmat narxi — pul emas, ishonch.

---

## 09 / 16 · s8 · Mustaqil ish: uchta shart

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Mentor gapi (o'z ishi bor) | O'tgan darsda «birinchi qilinadigan» deb tanlagan ishingiz pastda turibdi — dasturchi «tayyor» deganda aynan shu uchta shartni tekshirasiz. | O'tgan darsda «birinchi qilinadigan» deb tanlagan ishingiz pastda turibdi. Uni AI'dan so'rashdan oldin uchta shart yozing — AI «tayyor» desa, aynan shu uchtasini tekshirasiz. |
| Mentor gapi (o'z ishi yo'q) | Boshlash uchun bufet ishini olamiz: «Buyurtma berish» tugmasi pastda turibdi — dasturchi «tayyor» deganda aynan shu uchta shartni tekshirasiz. | Boshlash uchun bufet ishini olamiz: «Buyurtma berish» tugmasi pastda turibdi. AI «tayyor» desa, aynan shu uchta shartni tekshirasiz. |

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** o'quvchi o'z ishiga tekshirib bo'ladigan uchta shart yozadi — darsning asosiy natijasi.
> ❌ hozir: «…shartlarni dasturchi bilan BIRGA o'qib chiqing — u «bu qanday tekshiriladi?» deb so'rasa, shart yaxshi yozilmagan…»
> ✅ yangi: «Eng ko'p adashiladigan joy — shartlarni ishdan KEYIN yozish. Juftlikda: sherigingiz shartlaringizni o'qiydi. U «buni qanday tekshiraman?» deb so'rasa — shart qayta yoziladi.»

---

## 10 / 16 · s9 · Qabul tartibi (5 qadam)

| Qadam | ❌ hozir | ✅ yangi |
|---|---|---|
| 1 | Shartlarni yozamiz | (o'zgarmaydi) |
| 2 | Shartlarni dasturchiga beramiz | Shartlarni promptga qo'shamiz |
| 3 | Dasturchi kodni yozadi | AI kodni yozadi |
| 4 | Har shartni birma-bir tekshiramiz | Har shartni o'zimiz bosib tekshiramiz |
| 5 | Hammasi bajarilsa, «tayyor» deymiz | (o'zgarmaydi) |

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Yordam | Bitta savol yetadi: shartlar ish boshlanishidan OLDIN yoziladimi yoki keyinmi? | Bitta savol yetadi: shartlar AI'ga yozishdan OLDIN yoziladimi yoki keyinmi? |
| To'g'ri bo'lganda | ✅ Shartlar ish boshlanishidan oldin yoziladi — keyin bahs qolmaydi. | ✅ Shartlar AI'ga yozishdan oldin yoziladi — keyin «tayyor»mi yoki yo'qmi, ro'yxatga qarab bilasiz. |

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** shartlar kod yozilishidan OLDIN yozilishini o'quvchi tartib orqali o'zi joylaydi.

---

## 11 / 16 · s10 · Koding `qabulQilinadimi`

Matn o'zgarmaydi (dasturchi yo'q).

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** shartni kod ham tekshira oladi — o'quvchi uchta shartni bitta funksiyaga aylantiradi.
> (Hozirgi eslatma qoladi.)

---

## 12 / 16 · s11 · Yakuniy test · 13 / 16 · s12 · Refleksiya · 14 / 16 · s13 · Natijalar

Matn o'zgarmaydi.

**Mentor eslatmalari:**
> s11 — **Bu slayd nima uchun:** tekshirib bo'ladigan shartni («bo'sh buyurtma yuborilsa, xabar chiqadi») baho-so'zdan («chiroyli», «qulay») ajrata olishini tekshiradi.
> s12 — **Bu slayd nima uchun:** o'quvchi uchta shartini ekranga qaramasdan aytadi — eslab qolganini ko'rsatadi.
> s13 — **Bu slayd nima uchun:** sinf natijasi va g'oliblar.

---

## 15 / 16 · s14 · Takrorlash kartalari

| | ❌ hozir | ✅ yangi |
|---|---|---|
| Karta 2 (savol) | Dasturchiga oldindan beriladigan shartlar ro'yxati qanday ataladi? | Kod yozilishidan oldin yoziladigan shartlar ro'yxati qanday ataladi? |
| Karta 3 (javob) | Ish boshlanishidan oldin | AI'ga yozishdan oldin |
| Karta 8 (savol) | Yozilgan shartlarni kimga berasiz? | Yozilgan shartlarni qayerga qo'shasiz? |
| Karta 8 (javob) | Ishni bajaradigan dasturchiga | AI'ga yuboradigan promptingizga |

Qolgan 6 karta o'zgarmaydi.

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** to'qqizta karta bilan o'quvchi o'zini o'zi tekshiradi.

---

## 16 / 16 · s15 · Yakun (arena + uy vazifasi)

Matn o'zgarmaydi.

**Mentor eslatmasi:**
> **Bu slayd nima uchun:** CodeStrike arenasi, uy vazifasi va nishonlar.

---

## UY VAZIFASI — TEGILMAYDI

`PmLesson9.homework.jsx` o'zgarmaydi (foydalanuvchi 22.10: «PM darsi uyga vazifasini umuman o'ylama»; memory `pm-homework-tegilmaydi`). Lint `.homework` fayllarni o'tkazib yuboradi.

---

## TAKRORLANMASLIK — 7 qatlam (alohida tasdiq bilan)

Ildiz-sabab: senariy-qonun `PM_Prompt_v8.md` «РОЛЬ» bo'limida o'quvchining **darsdagi roli** yozilmagan («Ученики уже пишут код» — xolos). Shuning uchun senariylar klassik «PM → dasturchilar jamoasi» olamiga tushib ketgan.

1. **Senariy-prompt** (`PM_Prompt_v8.md`, РОЛЬ): «Ученик — стартапер-одиночка: сам пишет код с помощью AI (gemini.google.com). В сценарии нет программиста, команды или начальника, которым ученик раздаёт задачи. „Готово“ говорит AI — ученик проверяет».
2. **Qonun** (`PM_DARS_ETALON.md`, yangi 110-qonun): «O'QUVCHI — AI BILAN O'ZI QURADIGAN STARTAPCHI». «Dasturchi» faqat (a) haqiqiy voqeadagi uchinchi shaxs (Cyberpunk studiyasi), (b) kasb nomi («Frontend dasturchi») sifatida.
3. **Korpus** (`MATN_KORPUS.md`): juftlik ❌ «Dasturchidan so'ragandingiz» → ✅ «Gemini'dan so'radingiz» + sabab + F-1022-01.
4. **Lint** (`til-lint-rules.json` + `til-lint.mjs` ga `onlyFiles` imkoniyati): `dasturchi-topshiriq` qoidasi, **faqat PM va bridge darslarida**, `error`. Texnik darslarda «dasturchi» = o'quvchining o'zi («dasturchining, ya'ni sizning ishingiz») — ular tegilmaydi. O'lchov (22.10): qolip 64 qatorni ushlaydi; texnik darslardagi 10 tasi — to'g'ri ishlatilgan, `onlyFiles` ularni chiqaradi. Hali tuzatilmagan PM darslar vaqtincha `allowFiles` ro'yxatida (KATTA yopilgach ro'yxat o'chiriladi) — yangi dars darrov ushlanadi. `npm run gates` ichida ishlaydi.
5. **Rol-fayllar**: `pm-auditor` va `pm-tekshiruvchi` ga ov-band «O'quvchi roli: kim ish beradi, kim quradi, kim «tayyor» deydi?».
6. **👦 O'quvchi-darvoza** (`OQUVCHI_DARVOZA.md`): savol «Bu vaziyat menda bo'ladimi? Menda dasturchi bormi?» — «yo'q» bo'lsa darvozadan o'tmaydi.
7. **Mentor uchun «Bu slayd nima uchun»** — mexanizm: `MentorNote` har ekranda shu qatorni avtomatik chiqaradi (manba — `SCREEN_INTENTS`, mentor tilida qayta yoziladi). Eslatmasi yo'q ekranda ham chiqadi. Qolip/skeletga kiradi — yangi dars uni avtomatik oladi.

**Sinf-supurish (KATTA_TOZALASH ga):**
- Shu rol-muammo kuchli: `PmLesson22` (20 joy), `PmLesson13` (9), `PmLesson8` (9, shu modul — m3-05), `PmLesson16` (6) + uy vazifalari; yengil (1–2 joy): ~10 dars, `BridgeNimaQuramiz` (9).
- Mentor ekrani natijani oldindan ochishi (`picked !== null || isMentor`): 32 dars (PM + bridge).
