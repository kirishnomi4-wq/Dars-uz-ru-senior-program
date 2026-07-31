# M2-D13 — Sistemani qanday pitch qilish (SENARIY, PM_Prompt_v8 · 2-TUR)

> Holat: YOZILDI (senariy-bosqichi, 2026-07-31) → pm-metodist korrekturasi → **[GATE S]** kutmoqda.
> Fayl: `src/2-Modull/PmLesson6.jsx` (hozirgi `pm-demoday-pitch-06-v18` — «Demo Day: jonli pitch»
> BUTUNLAY almashadi; yangi `lessonId: pm-m2d13-v1`).

---

## 0. SHAPKA (kirish-ma'lumotlari)

| Maydon | Qiymat |
|---|---|
| **Modul** | 2 — «Sistemalar qanday o'ylaydi» (oy 1.5–3) |
| **Dars** | M2-D13 (modulning **13-darsi**, modulning OXIRGI o'quv darsi; keyin zaxira + Demo Day) |
| **Mavzu** | Sistemani qanday pitch qilish — o'zingiz qurgan saytni texnik bo'lmagan odamga tushuntirish |
| **TUR** | 🔴 **2-TUR (sof PM)** — o'quvchi O'Z pitch matnini YOZADI (`PMUSERSTORY_ETALON_TARIX.md` 2-bo'lim standarti) |
| **Bosh keys** | **K12 · AIRBNB PITCH DECK** (temalar: pitch tuzilishi · investorga pitch · storytelling) |
| **ISHLATILGAN_KEYS (band)** | K18 · K5 · K11 · K8 (Facebook) · **K1 UZUM — M2-D2** · **K3 INSTAGRAM — M2-D7** → K12 modulda birinchi marta ✓ |
| **Oldingi PM dars (M2-D7) TEKSHIRUV mexanikasi** | bo'laklash-doska (MVP ro'yxati) — **takrorlanmaydi** |
| **Band mexanikalar (TAQIQ)** | PmLesson3 «Demo Day»: 🎙 mikrofon-yozuv · teleprompter · 3 daqiqalik nutq-taymer · muammo-qidiruv · **texnik↔odamcha juftlik-tanlovi (s8)** · UserStory: 3 hikoya ustaxonasi · tekshiruvchi-stoli (naqsh qoladi, ko'rinish yangi) · klinika · `hikoyaYasa` kompilyatori · prioritet-doska · PmLesson1: bosqichli karta-yig'ish · `[KIM]` almashtirish kodingi · **PairTimer** · PmLesson2: OLX interfeysi |
| **Misol-ip (91 + 95 + 96-qonun)** | 🌯 **Maktab yonidagi lavash do'koni sayti** — 8–12-darslarda o'quvchi O'ZI qurgan loyiha. Tinglovchi: **🧑‍🍳 Do'kon egasi (lavash ustasi)** — saytni buyurtma qilgan, kod bilmaydigan odam. Butun dars shu bitta suhbat ichida yuradi |
| **Kirish-artefaktlar** | `pm-m2d7-mvp` (M2-D7 MVP ro'yxati) · `pm-m1d2-cards` (M1-D2 auditoriya-kartasi: `{kim, muammo, yechim}`) |
| **Chiqish-artefakt** | 🔴 `pm-m2d13-pitch` — o'quvchining **5 bo'lakli pitch matni** (modulning yakuniy artefakti) |
| **Yordamchi kalitlar** | `pm-m2d13-hook-choice` (33-qonun payoffi) · `pm-m2d13-code` (koding avto-saqlov) · `ccProgress` (F-0730-01) |
| **Tayming** | 5+2+26+16+6+10+5+4+8 = **82 daqiqa** + 8 daqiqa bufer = 90 |
| **Ekranlar** | 20 ta (s0…s19), scored: 3 ichki test + 1 yakuniy test + CodeStrike arena |

**Atama-glosslar (birinchi uchrashda, 62/39-qonun — avval hodisa, keyin nom):**
- «pitch» → avval: «qisqa qilib tushuntirib berish», keyin: «shu gapga **pitch** deyiladi — qisqa taqdimot»;
- «jargon» → avval: «faqat shu ishni qiladigan odamlar biladigan so'z», keyin: «bunday so'zlarga **jargon** — kasbiy so'z deyiladi»;
- «analogiya» → avval: «tanish narsaga o'xshatib aytish», keyin: «bunga **analogiya** — o'xshatish deyiladi»;
- «sistema» (modul nomida bor, lekin bu darsda qayta ochiladi) → «bir-biriga ulangan qismlar to'plami».

---

## 1. MARKAZIY MEXANIKA VA IMZO-VIZUAL

🔴 **Imzo-vizual: «TUSHUNISH CHIZIG'I».** Ekranning o'ng chekkasida do'kon egasining yuzi va uning
yonida vertikal chiziq turadi. Gap so'zma-so'z chiqadi: tanish so'zda chiziq yashil bo'lib
ko'tariladi, kasbiy so'zda **darhol pastga tushadi** va o'sha so'z ostida qizil chiziqcha qoladi.
Bu vizual darsning uchta joyida qaytadi (hook → so'z-elagi → ustaxona jonli-tekshiruvi) va shu
bilan bitta ma'no-ipni ushlab turadi. Bu **UserStory'ning story-silosi ham, PmLesson3'ning
mikrofoni ham EMAS** — 23-qonun (klon-taqiq) bajarildi.

**Uch yangi mexanika (shu darsniki):**
1. **🔎 SO'Z-ELAGI** — tayyor gapdagi so'zlarni bosib «kasbiy so'z» deb belgilash; belgilangan so'z
   chizilib, ostida sodda almashtiruvchi so'z ochiladi. (PmLesson3'dagi «ikkitadan bittasini tanlang»
   juftlik-tanlovi EMAS: bu yerda o'quvchi **o'zi topadi**, variant berilmaydi.)
2. **🧑‍🍳 TINGLOVCHI-JAVOBI** — gapni bosganda do'kon egasining bitta jonli javobi chiqadi
   («Bu menga nima beradi?» / «Ha, tushundim — buni bugunoq ishlataman»). Tanlov emas, **sinov**.
3. **🌯 UCH QATLAM O'XSHATISHI** — sistema uch qatlami do'konning o'z dunyosiga ko'chiriladi:
   *ko'rinadigan qism = peshtaxta · ishni bajaradigan qism = oshpaz · ma'lumot saqlanadigan joy = javon.*

---

## 2. EKRAN-RO'YXATI (20 ekran)

| № | id | eyebrow | tur | scored | O'quvchi nima qiladi | Mexanika |
|---|---|---|---|---|---|---|
| 0 | s0 | Bir suhbat | hook | ❌ | ▶ ni bosadi, gap so'zma-so'z chiqadi, tushunish chizig'i tushadi; qaysi so'z tushunishni buzganini ovoz bilan belgilaydi | tushunish chizig'i + 4 so'zdan ovoz-berish (`pm-m2d13-hook-choice`) |
| 1 | s1 | Bugungi natija | maqsad | ❌ | Kuzatadi: 5 bo'lakli pitch-karta o'z-o'zidan yozilib chiqadi, chiziq yashil turadi | jonli natija-preview (imzo-vizual bilan) |
| 2 | s2 | Kasbiy so'zlar | teoriya-1 | ❌ | Tayyor gapdagi kasbiy so'zlarni **bosib topadi**; har bosishda sodda almashtiruvchi ochiladi | 🔎 **SO'Z-ELAGI** |
| 3 | s3 | Tekshiruv | **TEST-1** | ✅ | Savolga javob beradi | `TestQ` (4 variant) |
| 4 | s4 | Birinchi gap | teoriya-2 | ❌ | Uch boshlanishni birma-bir bosadi, do'kon egasining javobini ko'radi, so'ng bittasini tanlaydi | 🧑‍🍳 **TINGLOVCHI-JAVOBI** |
| 5 | s5 | Keys 📊 | keys-slayd | ❌ | 5 slaydni bosqichma-bosqich ochadi; 2 joyda taxmin qiladi (ball yo'q) | K12 slaydlari + mikro-bashorat |
| 6 | s6 | Tekshiruv | **TEST-2** | ✅ | Savolga javob beradi | `TestQ` |
| 7 | s7 | O'xshatish | teoriya-3 | ❌ | Sistemaning uch qatlamiga do'kon dunyosidan o'xshatish tanlaydi; har tanlovni tinglovchida sinaydi | 🌯 **UCH QATLAM O'XSHATISHI** |
| 8 | s8 | Tekshiruv | **TEST-3** | ✅ | Savolga javob beradi | `TestQ` |
| 9 | s9 | Pitch matni | **USTAXONA** | ❌ (praktika-signal) | 5 bo'lakni **bittalab** yozadi; saqlashda jonli hint | qadam-indikator + yagona muharrir-karta + jargon-hint (`pm-m2d13-pitch`) |
| 10 | s10 | Tinglovchi kursisi | tekshiruv-amaliyot | ❌ | 3 tayyor pitch-gapga bittalab ✓/✕ hukm chiqaradi | 59-qonun naqshi, ko'rinish yangi (kursi + chiziq) |
| 11 | s11 | Koding | koding | ❌ (praktika-signal) | Sistemasining uch qatlamini obyektga yozib, funksiya bilan sodda gapga aylantiradi | to'liq-ekran kompilyator (`PmCompiler` qobig'i) |
| 12 | s12 | Bitta gap | modul-yakuni | ❌ | 5 bo'lakni **bitta gapga** yig'adi; matn o'qish holatida turadi | 92(e): o'qish-karta + «✎ Tahrirlash» |
| 13 | s13 | Yoddan ayting | recap | ❌ | Sherigiga aytadi → sherik uch tugmadan birini bosadi → 1 qator yozadi | tinglovchi-hukmi + Reflection |
| 14 | s14 | Yakuniy savol | **TEST-4 (final)** | ✅ | Savolga javob beradi | `TestQ`, scope: `final` |
| 15 | s15 | Uyga vazifa | shartnoma | ❌ | To'liq yoki qisqa variantni tanlaydi | topshiriq-karta (`HW_KEY`) |
| 16 | s16 | Natija | podium | ❌ | Natijani ko'radi | podium (93-qonun matnlari etalondan) |
| 17 | s17 | CODE STRIKE | arena | ✅ | 12 savol × 15 soniya | CodeStrike arena |
| 18 | sflash | Takrorlash | flashcard | ❌ | 10 kartani ochib tekshiradi | flip-kartalar |
| 19 | s19 | Yakun | summary | ❌ | Yakun-ro'yxati + nishonlar + artefakt-holati | summary |

**Test-taqsimot tekshiruvi:** s3 ← s2 teoriyasi · s6 ← s4+s5 · s8 ← s7 · s14 ← butun dars.
Ketma-ket ikki scored ekran YO'Q ✓.

---

## 3. BLOKLAR (PM_Prompt_v8 formati)

```
=== DARS ===
MODUL: 2 — Sistemalar qanday o'ylaydi
DARS: M2-D13 (modulning 13-darsi, to'rtinchi PM dars)
DARS_MAVZUSI: Sistemani qanday pitch qilish — o'zingiz qurgan saytni kod bilmaydigan odamga tushuntirish
ISHLATILGAN_KEYS: K12

=== BLOK 1: HOOK ===
VAQT: 5
KOMPONENT: Quiz (ovoz-berish, Kahoot-reveal) + imzo-vizual «tushunish chizig'i»
EKRAN: Do'kon egasi so'radi: «Saytim ichida nima bor?» Siz javob berdingiz. ▶ ni bosing — gapingiz so'zma-so'z chiqadi, yonida do'kon egasining tushunish chizig'i harakatlanadi. Qaysi so'zda chiziq pastga tushdi? O'sha so'zni belgilang.
HARAKAT: ▶ ni bosadi, gapning chiqishini kuzatadi, so'ng to'rt so'zdan bittasini belgilaydi (ovoz jonli darsda sir tutiladi, mentor ochadi).
JAVOB: «massiv» — bu so'zni faqat kod yozadigan odamlar biladi; do'kon egasi uni eshitib hech narsani tasavvur qila olmaydi.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: To'g'ri javobni aytmang — belgilangach o'zi ochiladi. Tanlov saqlanadi: keys-ekranida shu tanlov qaytariladi.

=== BLOK 2: MAQSAD ===
VAQT: 2
KOMPONENT: Natija-preview (jonli yozilish)
EKRAN: Dars oxirida o'zingiz qurgan saytni kod bilmaydigan odamga tushuntirishni bilib olasiz. Quyida besh bo'lakli yozuv o'z-o'zidan yozilib chiqadi — shu yozuvga pitch, ya'ni qisqa taqdimot deyiladi.
HARAKAT: Preview-kartaning yozilishini kuzatadi (5 bo'lak ketma-ket, tushunish chizig'i yashil turadi).
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Bitta gap: «pitch» so'zi shu ekranda birinchi marta chiqadi, ta'rifi yonida turibdi. Ortiqcha va'da qo'shmang (korpus 38).

=== BLOK 3: YADRO ===
VAQT: 26
KOMPONENT: So'z-elagi (s2) + tinglovchi-javobi (s4) + keys-slayd K12 (s5) + uch qatlam o'xshatishi (s7)
EKRAN: (s2) Quyidagi gap — sizniki. Do'kon egasi tushunmaydigan so'zlarni bosing. (s4) Uch xil boshlanish bor. Har birini bosing va do'kon egasi nima deyishini ko'ring. (s7) Saytingiz uch qatlamdan iborat. Har qatlamga do'konning o'z dunyosidan o'xshatish tanlang.
HARAKAT: (1) gapdagi kasbiy so'zlarni bosib topadi va sodda almashtiruvchisini o'qiydi; (2) uch boshlanishni sinab, tinglovchiga tushunarlisini tanlaydi; (3) K12 slaydlarini bosqichma-bosqich ochadi, ikki joyda taxmin qiladi; (4) uch qatlamga o'xshatish tanlab, tinglovchida sinaydi.
JAVOB: Kasbiy so'z tushuntirmaydi — o'xshatish tushuntiradi. Gap «nima uchun kerak»dan boshlanadi, «nimadan qurilgan»dan emas.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Frontal gap jami 10 daqiqadan oshmasin. Keys faqat bitta ekranda (s5) — undan keyin darsga qaytiladi.

=== BLOK 4: MUSTAQIL ISH ===
VAQT: 16
KOMPONENT: Ustaxona (bittalab-yozish, 5 bo'lak) + tinglovchi kursisi
EKRAN: Pitch matningizni yozing — besh bo'lak, bittalab. Har bo'lakni saqlaganingizda tushunish chizig'i uni tekshiradi.
HARAKAT: 5 maydonni ketma-ket to'ldiradi (kim uchun · qanday muammo · nima qiladi · nega ishlaydi · nima so'rayman); keyin uch tayyor pitch-gapga hukm chiqaradi.
JAVOB: 5/5 bo'lak saqlangan = qabul.
RO'YXAT: 1) Har bo'lakda kasbiy so'z yo'q 2) «Nima qiladi» bo'lagida do'kon egasi oladigan foyda aytilgan 3) «Nega ishlaydi» bo'lagida bitta o'xshatish bor
YULDUZCHA: «Nima so'rayman» bo'lagiga muddat qo'shing: do'kon egasidan aynan nima va qachongacha kerak.
YORDAM: M1-D2 auditoriya-kartangiz ochiladi — «kim uchun» va «qanday muammo» javoblari o'sha yerdan olinadi; M2-D7 ro'yxatingizdan esa eng kerakli bitta imkoniyatni tanlang.
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Frontal tushuntirmang. «Saytim HTML va JavaScript'da yozilgan» deb boshlaganlarni to'xtating: birinchi gap do'kon egasi haqida bo'lsin.

=== BLOK 5: TEKSHIRUV ===
VAQT: 6
KOMPONENT: Tinglovchi kursisi (tayyorga hukm: ✓ To'g'ri / ✕ Noto'g'ri)
EKRAN: Uch pitch-gapni tekshiring. Har birini do'kon egasi tushunadimi? Bittalab hukm chiqaring.
HARAKAT: 3 kartani bittalab baholaydi; ✕ bosilsa uchta sabab-tugmadan birini tanlaydi; yakunda uchtasi bir qatorda ko'rinadi.
JAVOB: Aynan bittasi to'g'ri (2-karta). 1-karta — kasbiy so'z bilan; 3-karta — faqat nimadan qurilgani aytilgan, foyda yo'q.
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: Ball yo'q, qizil yo'q. Noto'g'ri hukmda ham asl kamchilik aytiladi.

=== BLOK 6: KODING ===
VAQT: 10
KOMPONENT: Code Editor (to'liq-ekran kompilyator qobig'i, shu faylning o'zida)
EKRAN: Endi saytingizning uch qatlamini ekranda ko'rsatamiz. Obyektga uch qatlamni yozing, funksiya har qatlamni sodda gapga aylantirsin, sikl uchalasini chiqarsin.
HARAKAT: Boshlang'ich kodni to'ldiradi: `sistema` obyektining uch maydoni + `oddiyGap()` funksiyasi + `for` sikli; natijani jonli oynada ko'radi.
JAVOB: Uch qator ekranga chiqdi va har qatorda kasbiy so'z yo'q = qabul.
RO'YXAT: —
YULDUZCHA: `sistema` obyektiga to'rtinchi qatlam qo'shing (masalan «sayt qayerda turadi») — sikl uni ham o'zi chiqarsin, funksiyaga tegmang.
YORDAM: Funksiya ichida `return` qatori bor — unga faqat maydon nomini qo'ying. Sikl esa `Object.keys(sistema)` emas, oddiy massiv bo'ylab yuradi.
KOD: (to'liq matn — 6-bo'limda)
MAVZU: —
QISQA_VARIANT: —
SOFT: —
MENTORGA: 87-qonun: obyekt, funksiya, massiv, sikl — hammasi M2-D3…D6 da o'tilgan. Yangi sintaksis kiritilmaydi.

=== BLOK 7: RECAP ===
VAQT: 5
KOMPONENT: Reflection + tinglovchi-hukmi (juftlik)
EKRAN: Pitchingizni sherigingizga ovoz chiqarib ayting — ekranga qaramasdan. Sherigingiz uch tugmadan birini bosadi: tushundim · yarim tushundim · tushunmadim. Keyin bir qator yozing: qaysi bo'lakni soddalashtirasiz?
HARAKAT: (1) juftlikda navbatma-navbat aytadi; (2) sherik hukmini bosadi; (3) Reflection'ga bir qator yozadi.
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: —
SOFT: Juftlikda pitchni yoddan aytish + sherikning uch tugmali hukmi (tinglovchi rolida).
MENTORGA: Sinfning uchdan biri «tushunmadim» olsa — s2 so'z-elagini qayta oching, kasbiy so'zlar ro'yxatini birga o'qing.

=== BLOK 8: UYGA VAZIFA ===
VAQT: 4
KOMPONENT: SHARTNOMA (tanlov-ekrani)
EKRAN: Pitchingizni uyda kod bilmaydigan bitta odamga ayting — oila a'zosi yoki qo'shningizga. Uning bitta savoliga javob bering va o'sha savolni pitch matningiz ostiga yozib qo'ying. Keyin qaysi bo'lak tushunarsiz chiqqan bo'lsa, o'sha bo'lakni qayta yozing.
HARAKAT: 1 marta real tinglovchi oldida aytadi, savolini yozadi, bitta bo'lakni qayta yozadi.
JAVOB: —
RO'YXAT: 1) Pitch bitta real tinglovchiga aytilgan 2) Uning savoli yozib olingan 3) Bitta bo'lak qayta yozilgan
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: —
QISQA_VARIANT: Pitchni bitta odamga ayting va uning savolini yozib qo'ying.
SOFT: —
MENTORGA: Koding darsda tugallanmagan bo'lsa — qisqa variant beriladi.

=== BLOK 9: CODESTRIKE ===
VAQT: 8
KOMPONENT: CodeStrike arena
EKRAN: —
HARAKAT: 12 savollik jonli arena (har savol 15 soniya).
JAVOB: —
RO'YXAT: —
YULDUZCHA: —
YORDAM: —
KOD: —
MAVZU: Sistemani tushuntirish: kasbiy so'z (jargon) nima uchun ishlamaydi · o'xshatish tinglovchining o'z dunyosidan olinadi · gap «nima uchun kerak»dan boshlanadi · sistemaning uch qatlami (ko'rinadigan qism, ishni bajaradigan qism, ma'lumot saqlanadigan joy) · pitchning 5 bo'lagi · Airbnb pitch-slaydlari tartibi (muammo birinchi) · so'rov aniq bo'lishi.
QISQA_VARIANT: —
SOFT: —
MENTORGA: —
```

---

## 4. TEST SAVOLLARI (3 ichki + 1 yakuniy)

> Qolip: 74-qonun (a–d) · variantlar 49-qonun `opt-abc` doira-harflarida · reveal-izoh qisqa hukm+sabab.

### TEST-1 (s3, s2 so'z-elagidan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** «Ma'lumotlar bazasi» so'zi do'kon egasiga nega yetib bormaydi?
- **A.** Bu so'z juda uzun, eslab qolish qiyin. → *Uzunlik muammo emas: «peshtaxta» ham uzun, lekin tushunarli. Muammo — so'zning tanish emasligida.*
- **B. ✅ Bu so'zni faqat shu ishni qiladigan odamlar biladi — do'kon egasi uni eshitib hech narsani tasavvur qila olmaydi.** → *Ha. Kasbiy so'z (jargon) tinglovchining boshida hech qanday rasm hosil qilmaydi — shuning uchun u gapni tashlab yuboradi.*
- **C.** Bu so'z noto'g'ri ishlatilgan — to'g'risi boshqacha aytiladi. → *So'z to'g'ri ishlatilgan. Muammo aniqlikda emas, tinglovchida.*
- **D.** Do'kon egasi saytga qiziqmaydi. → *Aksincha — sayt uniki. U qiziqadi, lekin so'zni tushunmaydi.*

### TEST-2 (s6, s4 tinglovchi-javobi va s5 keysidan keyin) — to'g'ri: **C (indeks 2)**
**Savol:** Do'kon egasiga tushuntirishni qaysi gapdan boshlaysiz?
- **A.** «Saytda to'rtta sahifa va bitta ro'yxat bor.» → *Bu — nimadan qurilgani. Tinglovchi «xo'sh, menga nima?» deb qoladi.*
- **B.** «Menyu ro'yxati kodning ichida saqlanadi.» → *Bu ham qurilishi haqida, ustiga kasbiy so'z bilan.*
- **C. ✅ «Endi mijoz narxni bilish uchun telefon qilmaydi — o'zi ko'radi.»** → *Ha. Birinchi gap tinglovchi oladigan foydani aytadi; qurilishi keyin keladi.*
- **D.** «Saytni ikki hafta ishlab chiqdim.» → *Bu siz haqingizda. Tinglovchi o'zi haqidagi gapdan tez ushlaydi.*

### TEST-3 (s8, s7 uch qatlam o'xshatishidan keyin) — to'g'ri: **B (indeks 1)**
**Savol:** Qaysi o'xshatish do'kon egasi uchun ishlaydi?
- **A.** «Ma'lumot saqlanadigan joy — bu server xotirasi.» → *«Server xotirasi» — yana kasbiy so'z; o'xshatish emas, ikkinchi noma'lum so'z.*
- **B. ✅ «Ma'lumot saqlanadigan joy — oshxonadagi javon: nima borligi shu yerda turadi.»** → *Ha. O'xshatish tinglovchining O'Z dunyosidan olingan — u javonni har kuni ko'radi.*
- **C.** «Ma'lumot saqlanadigan joy — massiv ichida turadi.» → *«Massiv» — kod tili. Do'kon egasi bu so'zni bilmaydi.*
- **D.** «Ma'lumot saqlanadigan joy — kompyuterning ichki qismi.» → *Bu aniq narsani ko'rsatmaydi: «ichki qism» ham noma'lum bo'lib qolaveradi.*

### TEST-4 (s14, yakuniy — scope: `final`) — to'g'ri: **A (indeks 0)**
**Savol:** Pitchingizni eshitgan do'kon egasi «tushunmadim» dedi. Birinchi navbatda nimani tekshirasiz?
- **A. ✅ Gaplaringiz orasida faqat kod yozadigan odamlar biladigan so'zlar qolganini.** → *Ha. Tushunmaslikning birinchi sababi — kasbiy so'z. Uni tanish so'z yoki o'xshatish bilan almashtirasiz.*
- **B.** Ovozingiz yetarlicha baland chiqqanini. → *Ovoz eshitilgan — u «eshitmadim» demadi, «tushunmadim» dedi.*
- **C.** Nutqingiz necha daqiqa davom etganini. → *Uzunlik ikkinchi darajali: qisqa gap ham tushunarsiz bo'lishi mumkin.*
- **D.** Saytning rangi do'konga mos kelishini. → *Rang bu yerda hech narsani hal qilmaydi — gap so'zlarda.*

---

## 5. USTAXONA SPETSIFIKATSIYASI (s9 — 48/80/85/92-qonunlar)

**Artefakt:** `pm-m2d13-pitch` = `{ kim, muammo, qiladi, ishlaydi, soraym }` (+ `savedAt`).
**Kirish:** `pm-m1d2-cards` dan oxirgi to'liq karta (`kim`, `muammo` maydonlariga **taklif** sifatida, avtomatik to'ldirilmaydi) · `pm-m2d7-mvp` dan MVP ro'yxati (3-bo'lakda «eng kerakli bittasini tanlang» ro'yxati).
⚠️ Artefakt topilmasa — **lavash do'koni namunasi** zaxira (40-qonun: bo'sh-singan karta TAQIQ).

**Ko'rinish (80-qonun qolipi, ko'rinish shu darsniki):**
- tepada **havodagi 5 qadam-indikatori** (fonsiz doiralar): yozilgani yashil ✓ + ostida qisqa nomi,
  joriysi indigo-pulsda, kelgusilar kulrang-punktir;
- ostida **YAGONA muharrir-karta** — ekrandagi yagona karta, aksent-halqa bilan;
- o'ng chekkada **tushunish chizig'i** (imzo-vizual) — yozilayotgan matnni jonli o'lchaydi;
- yozilganlar ro'yxati yozish paytida KO'RINMAYDI; beshtasi tayyor bo'lgach to'liq enda ochiladi
  («✎ Tahrirlash» shu yerda);
- namuna **alohida «📋 Namuna» yig'ma panelida**, joriy bosqichga mos almashadi (placeholder'da EMAS).

| № | Bo'lak | Maydon savoli (yorliq) | Ipucha (placeholder, qisqa buyruq) | Yumshoq saqlash-sharti (hint) |
|---|---|---|---|---|
| 1 | **Kim uchun** | «Bu sayt kim uchun?» | «Kim foydalanadi?..» | ≥3 belgi · «hamma» / «hamma odam» yozilsa → «Bitta aniq guruh yozing: kim har kuni bu do'konga keladi?» |
| 2 | **Qanday muammo** | «Ular qanday qiyinchilikka duch keladi?» | «Nima qiyin?..» | ≥8 belgi · 1-bo'lak so'zlarini takrorlasa → «Bu yerda odam emas, uning qiyinchiligi yoziladi» |
| 3 | **Nima qiladi** | «Sayt buni qanday hal qiladi?» | «Sayt nima qiladi?..» | ≥8 belgi · **kasbiy so'z ro'yxatidan** so'z topilsa → «"massiv" so'zini do'kon egasi tushunmaydi — uning o'rniga nima deysiz?» · 2-bo'lakni so'zma-so'z takrorlasa → «Bu muammoning takrori. Sayt aynan nima qilishini yozing» |
| 4 | **Nega ishlaydi** | «Sayt buni qanday uddalaydi? Bitta o'xshatish bilan ayting» | «Nimaga o'xshaydi?..» | ≥8 belgi · kasbiy so'z topilsa → hint · o'xshatish yo'q bo'lsa (s7 dagi uchta o'xshatish so'zidan biri ham yo'q) → «Do'konning o'z dunyosidan bitta narsani eslang: peshtaxta, oshpaz, javon» |
| 5 | **Nima so'rayman** | «Do'kon egasidan aynan nima kerak?» | «Nima kerak?..» | ≥6 belgi · «hech narsa» / bo'sh iltimos → «Har pitch bitta so'rov bilan tugaydi: rasmlarmi, ruxsatmi, vaqtmi?» |

**Kasbiy so'zlar ro'yxati (jonli tekshiruv uchun, dars boshida s2 da ochilgan):**
`massiv · obyekt · funksiya · sikl · shart · kod · JavaScript · HTML · CSS · brauzer · localStorage ·
baza · ma'lumotlar bazasi · server · deploy · API · komponent · repozitoriy · front · back`

**Qulf-tugma (30/83-qonun):** yorliq bosqichga qarab o'zgaradi — «① Kim uchun ekanini yozing» →
«② Qiyinchilikni yozing» → … → «⑤ So'rovingizni yozing»; qulflangan tugma bosilsa muharrir-kartaga
smooth-scroll + uch marta silkinish.
**Bajarilish:** 5-saqlashda ekran O'ZI bajariladi (honor-tugma yo'q) → `PRACTICE_BASE + 9` signali.
**Mentor:** ≤1 gap (32b) · MentorNote'da: «Bu ishni o'quvchilar bajaradi — siz "Kim bajardi" panelida kuzatasiz».

---

## 6. KEYS-SLAYD SPETSIFIKATSIYASI (s5 — K12 · 91b/33/56/42/43-qonunlar)

**Freym (kirish-gap):** «Biznes olamidan mashhur voqea: **Airbnb**ning birinchi taqdimoti.»
**Eyebrow:** «Keys 📊» (K-kodsiz).

| Slayd | Matn (hikoya tilida, 42-korpus) | Oldidan bashorat? |
|---|---|---|
| 1 | «Ikki yigit uy ijarasi haqidagi g'oyasini pul qo'yadigan odamlarga tushuntirishi kerak edi. Ular hech qanday kod ko'rsatmadi — o'nga yaqin oddiy slayd tayyorlashdi.» | — |
| 2 | 🎲 **Bashorat-1:** «Birinchi slaydda nima turgan?» | ✅ (ball yo'q) |
| 3 | «Birinchi slaydda **odamlarning muammosi** turardi: sayohatga chiqqan odam uchun mehmonxona qimmat. Faqat shundan keyin o'z yechimlarini aytishdi.» | — |
| 4 | 🎲 **Bashorat-2:** «Har slaydda qancha gap bo'lgan?» | ✅ (ball yo'q) |
| 5 | «Har slaydda **bitta sodda fikr** turardi: muammo, yechim, bozor, mahsulot, jamoa. Shuning uchun bu taqdimot bugun ham eng ko'p o'rganiladiganlardan biri va internetda ochiq turibdi.» | — |

**Bashorat-1 variantlari (43-korpus: bitta o'lchov, zinapoya — «o'zi haqida» → «tinglovchi haqida»):**
`Kompaniya haqida ma'lumot` → `Mahsulot ekranlari` → `Odamlarning muammosi` ✅
**Bashorat-2 variantlari (zinapoya — kamdan ko'pga):**
`Har slaydda bitta sodda fikr` ✅ → `Har slaydda bir necha jumla` → `Har slaydda to'liq izoh matni`

**Hook-payoff shaxsiylashuvi (33-qonun):** 5-slaydda `pm-m2d13-hook-choice` o'qiladi — «Dars boshida
siz "massiv" so'zini belgilagandingiz. Airbnb ham xuddi shunday: tinglovchi bilmaydigan birorta so'z
slaydga kirmagan.» Tanlov bo'lmasa — umumiy matn.
**Bashorat natijasi (56-qonun):** topsa «🎯 Topdingiz!», adashsa «Adashdingiz — asl javob: …».
Taxminni takrorlamaydi, qizil yo'q.

🔗 **KO'PRIK-GAP (keys darsga qaytadi):** «Airbnb tinglovchisi ham kod bilmasdi. Endi **siz** ham
lavash do'koni egasiga xuddi shunday tushuntirasiz — birinchi gap uning muammosi bo'lsin.»

⚠️ **Keys-halolligi:** K12 banki «raqamsiz» belgili — yil, summa, foydalanuvchi soni AYTILMAYDI;
«o'nga yaqin slayd» bank matnining o'zidagi ifoda. Boshqa ekranlarda Airbnb tilga olinmaydi (91b).

---

## 7. KODING SPETSIFIKATSIYASI (s11 — 87-qonun)

**87-savol: bu darsgacha bola texnikadan aynan nimani o'rgangan?**
M2-D1 sistema/algoritm · M2-D3 `let`/`const`, ma'lumot turlari · M2-D4 `if/else` · M2-D5 `for`, massivni
aylanish · M2-D6 funksiya (parametr, `return`), massiv va obyekt · M2-D10 PERN (uch qatlam — **faqat
nazariy**) · M2-D8/D9/D11/D12 loyiha kunlari.
🔴 **Yopiladigan bo'shliq:** PERN darsi uch qatlamni **aytib berdi, lekin qo'lda yozdirmadi**. Shu
koding aynan o'sha bo'shliqni yopadi: uch qatlam o'quvchining O'Z loyihasi ma'lumotiga aylanadi.
🔴 O'tilmagan narsa YO'Q: DOM, `fetch`, klass, `map` ishlatilmaydi. Chiqarish uchun qobiq bergan tayyor
`chiqar()` buyrug'i (yonida vazifa-ta'rifi: «yozganingizni ekranga chiqaradi»).

**Sarlavha (48-korpus — natijani aytadi):** «Endi saytingizning uch qatlamini **sahifada ko'rsatamiz**.»
**Launch (50-qonun, aylantirish-vizual):** chapda kod-chip `oddiyGap(qatlam)` ➜ puls-strelka ➜ o'ngda
o'quvchining O'Z pitch bo'laklari kartasi (`pm-m2d13-pitch` dan; bo'sh bo'lsa namuna-fallback) →
bitta katta CTA «🛠 Kompilyatorni ochish».

**BOSHLANG'ICH KOD (`KOD` maydoni):**
```js
// Saytingiz uch qatlamdan iborat. Har qatlamni do'kon egasi tushunadigan tilda yozing.
const sistema = {
  korinish: "",   // ← peshtaxta: mijoz ekranda nimani ko'radi?
  ishlash:  "",   // ← oshpaz: sayt qanday ishni o'zi bajaradi?
  malumot:  ""    // ← javon: sayt nimani eslab qoladi?
};

const qatlamlar = ["korinish", "ishlash", "malumot"];
const nomlar = {
  korinish: "Ko'rinadigan qism",
  ishlash:  "Ishni bajaradigan qism",
  malumot:  "Ma'lumot saqlanadigan joy"
};

// Bu funksiya bitta qatlamni tayyor gapga aylantiradi.
function oddiyGap(qatlam) {
  return nomlar[qatlam] + ": " + /* ← shu yerga sistema ichidagi javobni qo'ying */ "";
}

// Uchala qatlamni ekranga chiqaring.
for (let i = 0; i < qatlamlar.length; i++) {
  // ← chiqar(...) ni shu yerda chaqiring
}
```

**Jonli shart-chiplar (3 ta, debounce avto-tekshiruv):**
| № | Shart (≤4 so'z) | Tekshiruv | 💡 Ipucha |
|---|---|---|---|
| 1 | Uch qatlam to'ldirilgan | `sistema` ning uchala maydoni ≥6 belgi | «Har qator ichidagi qo'shtirnoq orasiga o'z javobingizni yozing» |
| 2 | Funksiya gap qaytaradi | `oddiyGap('korinish')` natijasida qatlam javobi bor | «`return` qatoriga `sistema[qatlam]` ni qo'shing» |
| 3 | Uch qator chiqdi | natija-oynada aynan 3 qator | «Sikl ichida `chiqar(oddiyGap(qatlamlar[i]))` deb yozing» |

**Qo'shimcha darvoza (82e — honor-checkbox YO'Q):** natijadagi uch qatorda kasbiy so'zlar ro'yxatidan
so'z topilsa, chip «⚠️ Kasbiy so'z qoldi» bo'lib turadi va qaysi so'z ekani aytiladi.
**Kod nusxalanmaydi** (82d): `user-select:none`, `onCopy/onPaste` bloklangan, «🔒 qo'lda yoziladi» belgisi.
**Takrorlash-yo'li (89-qonun):** faqat erkin rejimda xira matn-havola «✓ Bu mashqni sinfda bajarganman — davom etish →».
**Avto-saqlov:** `pm-m2d13-code`.
**TAKEAWAY (65-qonun qoplamasi):** «Sistema — uch qatlam: ko'rinadigan qism, ishni bajaradigan qism va
ma'lumot saqlanadigan joy. Uchalasini o'z tilingizda ayta olsangiz — sistemani tushuntira olasiz.»

---

## 8. QOLGAN EKRANLAR — QISQA SPETSIFIKATSIYA

**s2 SO'Z-ELAGI.** Ekranda bitta gap: «Menyu massivda saqlanadi, sikl uni sahifaga chiqaradi va
localStorage buyurtmani eslab qoladi.» O'quvchi kasbiy so'zlarni bosadi (`massiv`, `sikl`,
`localStorage`); har to'g'ri bosishda so'z chiziladi va **ostida sodda almashtiruvchi** ochiladi
(`massiv → ro'yxat` · `sikl → har birini navbat bilan` · `localStorage → brauzer eslab qoladi`).
Noto'g'ri so'z bosilsa — neytral izoh: «Bu so'zni do'kon egasi biladi». Uchalasi topilgach —
**xulosa-karta** (69-qonun, maqtov emas): «Kasbiy so'z (jargon) — faqat shu ishni qiladigan odamlar
biladigan so'z. Uni tashlab yubormaysiz, tanish so'z bilan almashtirasiz.» + avto-scroll (77-qonun).

**s4 TINGLOVCHI-JAVOBI.** Uch boshlanish kartasi (94-qonun: birma-bir emas — uchalasi bosiladigan,
lekin javob faqat bosilganida chiqadi): (a) «Saytda to'rt sahifa bor» → egasi: «Xo'sh, menga nima?»
(b) «Sayt JavaScript'da yozilgan» → egasi: «Bu nima degani?» (c) «Endi mijoz narxni telefon qilmasdan
ko'radi» → egasi: «Buni bugunoq ishlataman». Uchalasi ko'rilgach (yurish-pulsi) — bittasini tanlaydi.
Xulosa: «Gap "nima uchun kerak"dan boshlanadi, "nimadan qurilgan"dan emas.»

**s7 UCH QATLAM O'XSHATISHI.** Uch qatlam qatori: har biriga 3 tanlov (bittasi do'kon dunyosidan,
ikkitasi — kasbiy so'z yoki noaniq). Tanlangach tinglovchi-javobi chiqadi. 64-qonun: tuzoqlar bitta
xato-sinfidan (kasbiy so'z), to'g'ri variant bilan ma'nodosh emas. 94-qonun: qatlamlar
**bosqichma-bosqich** ochiladi (1-qatlam tasdiqlangach 2-si), tasdiqlangani bir qatorga yig'iladi.

**s10 TINGLOVCHI KURSISI (59-qonun).** 3 tayyor pitch-gap, bittalab, `●○○ 1/3`:
1. «Menyu ma'lumotlar bazasida saqlanadi, sayt uni API orqali oladi.» → ✕ (kasbiy so'z)
2. «Mijoz endi narxni telefon qilmasdan ko'radi — menyu saytda doim yangi turadi.» → ✅
3. «Saytda beshta sahifa, ikkita tugma va bitta forma bor.» → ✕ (foyda aytilmagan)
Sabab-tugmalari (✕ bosilganda): «Kasbiy so'z bor» · «Foyda aytilmagan» · «Juda uzun» (distraktor).
Yakunda uchtasi xulosa-stripda bir qatorda.

**s12 BITTA GAP (modul-yakuni).** 5 bo'lak bitta gapga yig'iladi:
«**[kim uchun]** uchun sayt qildim — ilgari **[muammo]** edi, endi **[nima qiladi]**; u **[o'xshatish]**
kabi ishlaydi, va sizdan **[so'rov]** kerak.» Matn **o'qish holatida** ko'rsatiladi (92e), tahrir
«✎ Tahrirlash» ortida. Ostida ixcham yo'l-chizig'i: bu gapda M1-D2 «kim uchun», M2-D7 ro'yxatingiz va
8–12-darslarda qurgan saytingiz bir joyga kelgan.

**s13 RECAP.** Sarlavha: «Pitchingizni **yoddan** ayta olasizmi?» Mentor: «Ekranga qaramasdan
sherigingizga ayting. Sherigingiz uch tugmadan birini bosadi.» → Reflection: «Qaysi bo'lakni
soddalashtirasiz?» (1 qator). Yakka rejimda: uch tugma o'z-o'zini tekshirish shakliga o'tadi (36-qonun).

**s15 UYGA VAZIFA.** Topshiriq-karta, raqam-doirali 3 qadam; yorliqlar hajm bilan: «To'liq · ~20 daqiqa»
/ «Qisqa · ~10 daqiqa». Muddat-qatori YO'Q.

**s16 PODIUM / s17 ARENA / s18 FLASHCARD / s19 SUMMARY** — 93-qonun: matnlar etalondan aynan
(«Bugungi g'oliblarimiz» / yakka rejimda «Bugungi natijangiz»); mentor rejimida shaxsiy hisob va
«📊 Savollar bo'yicha» kartasi YO'Q (90-qonun · 1-D).

---

## 9. CODESTRIKE — 12 SAVOL (arena)

> 15 soniya · 3/3/3/3 taqsimot (to'g'ri indeks: 0→3, 1→3, 2→3, 3→3) · naqshsiz ketma-ketlik ·
> har savol darsda **aytilgan ekran** bilan qoplangan (65-qonun).

| № | Savol | Variantlar (✅ = to'g'ri) | Qoplama |
|---|---|---|---|
| 1 | Kasbiy so'z (jargon) nima? | **✅ Faqat shu ishni qiladigan odamlar biladigan so'z** · Uzun so'z · Xato yozilgan so'z · Chet el so'zi | s2 |
| 2 | Pitch nima? | Kod yozish tartibi · Sayt bo'limlari · **✅ Qisqa qilib tushuntirib berish** · Sayt manzili | s1 |
| 3 | Tushuntirishni nimadan boshlaysiz? | Sayt nechta sahifadan iborat · **✅ Tinglovchi oladigan foyda** · Qaysi tilda yozilgani · Necha kun ishlagan | s4 |
| 4 | «Massiv» so'zini nima bilan almashtirasiz? | Obyekt · Sikl · Baza · **✅ Ro'yxat** | s2 |
| 5 | Sistemaning ko'rinadigan qismi — do'konda nima? | Javon · Oshxona · **✅ Peshtaxta** · Ombor | s7 |
| 6 | Ma'lumot saqlanadigan joy — do'konda nima? | **✅ Javon** · Peshtaxta · Kassa · Eshik | s7 |
| 7 | Yaxshi o'xshatish qayerdan olinadi? | Kitobdan · Kod hujjatidan · Internetdan · **✅ Tinglovchining o'z hayotidan** | s7 |
| 8 | Airbnb birinchi slaydda nimani ko'rsatgan? | Jamoa · **✅ Odamlarning muammosi** · Mahsulot ekranlari · Narxlar | s5 |
| 9 | Airbnb slaydlarida har birida nima turgan? | **✅ Bitta sodda fikr** · Uzun izoh · Kod namunasi · Grafik | s5 |
| 10 | Pitch nima bilan tugaydi? | Rahmat aytish bilan · Sayt manzili bilan · Kod ko'rsatish bilan · **✅ Aniq so'rov bilan** | s9 |
| 11 | Sayt ishini o'zi bajaradigan qism do'konda kimga o'xshaydi? | Mijoz · **✅ Oshpaz** · Kuryer · Kassir | s7 |
| 12 | Tinglovchi «tushunmadim» dedi — birinchi nimani tekshirasiz? | Ovoz balandligini · Nutq uzunligini · **✅ Kasbiy so'z qolganini** · Slayd rangini | s14 · s2 |

*(To'g'ri indekslar ketma-ketligi: 0,2,1,3,2,0,3,1,0,3,1,2 — sikl-naqsh yo'q; uzunlik-tell ≤1.4×.)*

---

## 10. NISHONLAR (4 ta — inglizcha nom + o'zbekcha tavsif, 40-qonun: har biri REAL triggerga ulanadi)

| Nom | Tavsif | Trigger |
|---|---|---|
| **Jargon Buster!** | So'z-elagida uchala kasbiy so'zni o'zingiz topdingiz. | s2: 3/3 to'g'ri bosish |
| **Plain Talker!** | Pitch matningizning besh bo'lagini kasbiy so'zsiz yozdingiz. | s9: 5 bo'lak saqlangan va jargon-hint chiqmagan |
| **Good Ear!** | Tinglovchi kursisida uchala kartaga to'g'ri hukm chiqardingiz. | s10: 3/3 to'g'ri hukm |
| **System Speaker!** | Sistemaning uch qatlamini kodda o'z tilingizda ko'rsatdingiz. | s11: uchala shart-chip ✓ |

⚠️ Mentor rejimida nishonlar KO'RINMAYDI (1-D jadvali, F-0729-06).

---

## 11. FLASHCARD (10 ta — old tomoni SAVOL)

| № | Old (savol) | Orqa (javob) |
|---|---|---|
| 1 | Pitch nima? | Mahsulotni qisqa qilib tushuntirib berish. |
| 2 | Kasbiy so'z (jargon) nima? | Faqat shu ishni qiladigan odamlar biladigan so'z. |
| 3 | O'xshatish (analogiya) nima? | Notanish narsani tinglovchi taniydigan narsaga o'xshatib aytish. |
| 4 | Tushuntirish qaysi gapdan boshlanadi? | Tinglovchi oladigan foydadan. |
| 5 | Sistemaning uch qatlami qaysilar? | Ko'rinadigan qism, ishni bajaradigan qism, ma'lumot saqlanadigan joy. |
| 6 | Ko'rinadigan qism do'konda nimaga o'xshaydi? | Peshtaxtaga — mijoz shu yerda hamma narsani ko'radi. |
| 7 | Ma'lumot saqlanadigan joy do'konda nimaga o'xshaydi? | Javonga — nima borligi shu yerda turadi. |
| 8 | Pitch matni qaysi besh bo'lakdan iborat? | Kim uchun · qanday muammo · nima qiladi · nega ishlaydi · nima so'rayman. |
| 9 | Yaxshi o'xshatish qayerdan olinadi? | Tinglovchining o'z hayotidan. |
| 10 | Pitch nima bilan tugaydi? | Bitta aniq so'rov bilan. |

---

## 12. RECAP-KARTALARI (`RECAPS`, 4 qator — har biri o'z teoriyasini qayta tushuntiradi)

1. Kasbiy so'z tinglovchi boshida hech qanday rasm hosil qilmaydi — uni tanish so'z bilan almashtirasiz.
2. Tushuntirish tinglovchi oladigan foydadan boshlanadi, sayt nimadan qurilganidan emas.
3. Yaxshi o'xshatish tinglovchining o'z hayotidan olinadi: peshtaxta, oshpaz, javon.
4. Har pitch bitta aniq so'rov bilan tugaydi.

**Yakun-ro'yxati (s19, «Endi siz bilasiz» — 52-korpus: qisqa va tugal gaplar):**
- Sistemani kod bilmaydigan odamga tushuntirish mumkin.
- Kasbiy so'z tushuntirmaydi — o'xshatish tushuntiradi.
- Birinchi gap tinglovchi oladigan foydani aytadi.
- Sayt uch qatlamdan iborat: ko'rinadigan qism, ishni bajaradigan qism, ma'lumot saqlanadigan joy.
- Yakuniy fe'l (51-korpus): «Bugun sistemani tushuntirishni o'rgandik» / yakka rejimda «Endi siz
  sistemangizni tushuntira olasiz.»

---

## 13. O'Z-TEKSHIRUV (PM_Prompt_v8 yakuniy ro'yxati + PM_DARS_ETALON darvozalari)

1. VAQT: 5+2+26+16+6+10+5+4+8 = **82** ✓
2. 13 maydon har blokda, bo'shi «—» ✓
3. BLOK 4 va BLOK 8 da RO'YXAT — aynan 3 band ✓
4. BLOK 8 da EKRAN + QISQA_VARIANT ikkalasi ham to'ldirilgan ✓
5. Bosh keys K12 — 2-Modulda ishlatilmagan (band: K1, K3) ✓; «raqamsiz» belgili keysga raqam
   qo'shilmadi ✓; kundalik-misol — lavash do'koni (modul-ipi, 96-qonun) ✓
6. TEKSHIRUV mexanikasi (tinglovchi kursisi — tayyorga hukm) M2-D7 bo'laklash-doskasidan farqli ✓;
   KODING mexanikasi (obyekt+funksiya+sikl) oldingi PM darsi kodingidan farqli ✓
7. «Sen»-forma yo'q ✓ · kirill yo'q ✓ · «daftaringiz» yo'q ✓ · o'ylab topilgan personaj yo'q
   (vazifani Mentor beradi, do'kon egasi — modul-loyihasining real tinglovchisi, ism berilmaydi) ✓
8. SOFT faqat BLOK 7 da ✓
9. 91-qonun: bitta misol-ip (lavash do'koni sayti), keys BIR ekranda freym+ko'prik bilan ✓
10. 92-qonun: har ekranda bitta ish; s9 ustaxona bittalab; s12 gapirish-matni o'qish holatida ✓
11. 87-qonun: koding faqat M2-D3…D6 materialida, PERN bo'shlig'ini yopadi ✓
12. 95-qonun: misol-olam Toshkent o'smiriga yaqin (maktab yonidagi lavash do'koni) ✓
13. Sarlavhalarda yangi atama yo'q (korpus 39); atamalar birinchi uchrashda hodisadan keyin ✓

---

## 14. QAROR KUTAYOTGAN NUQTALAR (GATE S da hal qilinadi)

1. 🔴 **`pm-m2d7-mvp` kaliti hali MAVJUD EMAS** — `PmLesson5.jsx` (M2-D7) hozircha artefaktni
   localStorage'ga yozmaydi (grep: faqat live/prog kalitlari). Ikki yo'l: (a) PmLesson5'ga
   `pm-m2d7-mvp` yozuvi qo'shiladi (kichik tahrir, ammo boshqa dars fayliga tegish); (b) bu darsda
   faqat namuna-fallback ishlatiladi va kirish sifatida `pm-m1d2-cards` qoladi.
2. 🟡 **K12 M1-D12 senariysida ham bosh keys sifatida turibdi** (`pm-senariylar/M1-D12-Pitch.md`).
   Modul ichida takror yo'q (qoida modulga tegishli), lekin bitta o'quvchi ikki marta Airbnb
   pitch-deckini eshitadi. Farq bor: M1-D12 — slaydlar TARTIBI, bu dars — slaydlardagi TIL (bitta
   sodda fikr, kasbiy so'zsiz). Tasdiqlash kerak: shu farq yetarlimi yoki zaxira-hook olinsinmi.
3. 🟡 **Kompilyator chiqarish usuli:** `chiqar()` yordamchi buyrug'i qobiqdan beriladi (DOM o'tilmagan
   deb hisoblandi). Agar M2-D8/D9 loyiha kunlarida `innerHTML` amalda o'tilgan bo'lsa — topshiriqni
   to'g'ridan-to'g'ri sahifaga yozishga o'tkazish mumkin (kuchliroq bo'lardi).
