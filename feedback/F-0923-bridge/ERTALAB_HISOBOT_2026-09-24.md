# Ertalabki hisobot · Bridge (o'tish) darslari · 2026-09-24

> To'liq jurnal: `TUNGI_JURNAL_2026-09-24.md` · reja: `RAZRABOTKA_REJA_2026-09-24.md`.
> Commit YO'Q · deploy YO'Q. LMS darslari, `src/live/`, `src/pm/`, `lms/`, `server/`, mentor sayti — tegilmagan (`git status` bilan tekshirildi).

## 1. Qisqasi

- **Yettala dars qurildi va bitta saytga yig'iladi.** `npm run build:bridge` → `dist-bridge/`, toza.
- **Yettala dars to'liq zanjirdan o'tdi va yakuniy verifikator imzoladi.** GATE 2 va GATE 3 (sizning ko'rigingiz) qoldi. Yakuniy qabulchi (pm-qabulchi) tunda yuritilmadi — vaqt yetmadi; xohlasangiz, ko'rikdan oldin yuritaman.
- **Jonli ball eski Supabase'da ishlaydi.** Tungi tahrirlardan keyin qayta sinaldi (07:40–07:57): har darsda mentor + 2 o'quvchi, bazada 14 javob, 7 to'g'ri, podium 4/4 · 0/4, sessiya yopilgan. Bazaning o'zidan tekshirdim.
- **Sizning matningiz saqlandi.** Metodistlar uch darsda siz yozgan yoki qabul qilgan matnni o'zgartirib yuborgan edi — hammasini senariydagi so'zma-so'z holatga qaytardim. Ularning takliflari 3-bo'limda, qaror sizniki.
- **Tunda ~74 daqiqa yo'qoldi:** 02:06–03:20 API limiti (HTTP 429). Fayllar butun qoldi.

## 2. Darslar holati

| Dars | Qurish · dizayn · jonli | 👦 o'quvchi o'qishi | Tekshiruvchi | Yakuniy verifikator |
|---|---|---|---|---|
| 1-o'tish 1-dars «Kim uchun qilyapmiz?» | ✅ | 2-o'qish O'TDI | ✅ | ✅ IMZO |
| 2-o'tish 2-dars «Muammoni topamiz» | ✅ | 2-o'qish O'TDI | ✅ | ✅ IMZO |
| 2-o'tish 3-dars «Birinchi versiya» | ✅ | 2-o'qish O'TDI | qaytardi → tuzatildi | ✅ IMZO |
| 3/4-o'tish 1-dars «Kim uchun va qanday muammo?» | ✅ | 2-o'qish O'TDI | ✅ | ✅ IMZO |
| 3/4-o'tish 2-dars «Nima quramiz» | ✅ | 2-o'qish O'TDI | qaytardi → tuzatildi | ✅ IMZO |
| 3-o'tish 3-dars «Qanday ko'rsatamiz?» | ✅ | 2-o'qish O'TDI | qaytardi → tuzatildi | ✅ IMZO |
| 4-o'tish 3-dars «Ma'lumot, ishonch» | ✅ | 2-o'qish O'TDI* | qaytardi → tuzatildi | ✅ IMZO |

\* Sizning matningizni hisobga olmasa O'TDI; hisobga olsa — 6 gap ikki marta o'qiladi (takliflar 3.8-bandda).

**Verifikator nimani tekshirdi (7 dars):** har faylda darvozalar 6/6 · `build:bridge` toza · UZ va RU da bosh sahifa → o'tish → dars → 1-ekran, test, flashcard, podium, yakun, CodeStrike — sahifa xatosi 0 · 1280×800 da (tepa menyu bilan) aylantirish 0 · 1-o'tish 1-dars RU 15-ekranda so'z bo'linishi yo'q · UZ/RU tugmasi dars ichida ishlaydi.

**Jonli qayta sinov (07:40–07:57, bazadan tekshirilgan):**

| Dars | PIN | Javob | To'g'ri |
|---|---|---|---|
| 1-o'tish 1-dars | 691281 | 14 | 7 |
| 2-o'tish 2-dars | 715574 | 14 | 7 |
| 2-o'tish 3-dars | 658270 | 14 | 7 |
| 3/4-o'tish 1-dars | 510334 | 14 | 7 |
| 3/4-o'tish 2-dars | 329137 | 14 | 7 |
| 3-o'tish 3-dars | 049054 | 14 | 7 |
| 4-o'tish 3-dars | 960875 | 14 | 7 |

## 3. Sizdan qaror kerak

Har band — sizning matningiz yoki qaroringiz; tunda tegilmagan yoki qaytarilgan. «Hammasini qabul» desangiz, bir yo'la kiritiladi; band raqamini aytsangiz — faqat o'sha.

### 3.1. Hamma darsga tegishli
1. **Keys ekranida bashorat bitta.** Etalon kamida ikkita talab qiladi, senariyda bitta. Qo'shilsinmi yoki shunday qolsinmi?
2. **Arena va yakun bitta sahifa.** Loyiha qonuni shunday talab qiladi; senariyda ikki ekran edi. Mazmun to'liq.
3. **«O'zicha chora izlaydi».** 3/4-o'tish 1-darsda «muammoni o'zicha hal qilishga urinadi» bo'ldi (o'quvchi «chora»ni tushunmadi). 2-o'tish 2-darsda hali «chora». Hamma darsda bir xil bo'lsinmi?
4. **Futbol tayyor g'oyasi va 4-o'tish 3-dars.** U darsda «maydon» — ma'lumot maydoni; futbol g'oyasi esa futbol maydoni haqida. Shunday qolsinmi yoki futbol g'oyasida «futbol joyi»?
5. **Takror xato-sinf.** Ikki darsda yonib-o'chuvchi ishora faqat bitta (noto'g'ri) variantga yonardi — tuzatildi. Tekshiruvchi rol-fayliga shu haqda ov-bandi qo'shaymi?

### 3.2. 1-o'tish 1-dars «Kim uchun qilyapmiz?»
1. **10↔11-ekran.** Sizning 10-ekran sarlavhangiz «E'lon berish»ni ajratadi, 3-test «qidiruv qatori»ni so'raydi. Metodist sarlavhaga tegmasdan test savolini o'zgartirdi: «…nega sahifadagi eng katta joyni egallaydi?» (kalit o'zgarmagan). Ma'qulmi?
2. **15-ekran.** Isbot bo'limi matni kulrang chiziqqa aylandi (400 belgi uchun; matn 13-ekranda bor).

### 3.3. 2-o'tish 2-dars «Muammoni topamiz»
1. 2-ekran «Tanlagan g'oyangiz» — sizning matningiz; o'quvchi hali g'oya tanlamagan. Hozir mentor og'zaki aytadi.
2. 12-ekranda muammosiz narsa «yechim» deb ataladi — 10-ekrandagi ta'rifga zid. 12-ekran 407 belgi.

### 3.4. 2-o'tish 3-dars «Birinchi versiya»
1. **15-ekran 5-savol** «Tinglovchidan keyin nima qilishini so'raysiz?» — ikki o'qishda ham qoqiltirdi. Taklif: «Oxirida tinglovchidan nima qilishni so'raysiz?»
2. **6-ekran.** O'quvchi ⚡ «Keyingi versiya» va 🌱 «Keyinga qoldirilganlar»ni bir xil deb o'qidi. Metodist uchala izohni birga chiqargan edi — bu sizning D-5 qaroringizga zid, **qaytardim**. Taklif: izohda navbatni aytish — ⚡ «birinchi versiyadan keyin navbat shunga keladi», 🌱 «navbati eng oxirida».
3. **1- va 2-test.** Metodist sizning xato variantlaringizni almashtirgan edi — **qaytardim**. Qoldiq xavf: javobni variant shaklidan topsa bo'ladi. Metodist variantlari zaxirada.

### 3.5. 3/4-o'tish 1-dars «Kim uchun va qanday muammo?»
1. **3-ekran xulosasining oxirgi gapi** — metodist o'zgartirgan edi, **qaytardim**. O'quvchi «Ular» kimligini bir o'qishda tushunmagan. Taklif: «Ikkala o'quvchi ham avval kerakli narsani qidiradi. Shu birinchi ish sahifada ko'zga tashlanib tursin — Uzumda qidiruv qatori eng tepada.»
2. 1- va 3-test xato variantlari oldingi darslardagidan farq qila boshladi (shakldan topilmasin deb). Ma'qulmi?
3. 6-ekran oxirgi slaydi ≈447 belgi (sizning matn).

### 3.6. 3/4-o'tish 2-dars «Nima quramiz»
1. **Metodist 7 gapda sizning qabul qilgan matningizni o'zgartirgan edi** (2-ekran maqsadi · 5-ekran «ro'yxatni biz o'zimiz tuzdik» · 8-ekran «ikkita sodda mezon» va xulosa · 13-ekran ko'prik · 16-ekran AI maqsad-gapi · 17-ekran yo'riq) — **hammasi qaytarildi**. Oqibat: 8-ekrandagi «mezon» yana izohsiz (o'quvchi tushunmagan). Metodist varianti zaxirada — masalan «ikki sodda mezonga, ya'ni ikki savolga qarab».
2. **10-ekran qabul shartlari ta'rifi** — uzun sifatdosh zanjiri. Taklif: «"Ishlaydi" — biror holatda to'g'ri natija berdi. "Tayyor" — oldindan kelishilgan hamma shart bajarildi. … Shu shartlar ro'yxati **qabul shartlari** deyiladi.» + ixtiyoriy «"Chiroyli", "qulay" kabi so'zni tekshirib bo'lmaydi».
3. **3-test:** «Avval qilinadi» xato varianti → «Avval qilinadi — qurish uzoq, demak hozirdan boshlaymiz». **4-test:** 1-variant → «Safar tugagach, 5 yulduzli baho oynasi chiroyli ko'rinadi».
4. 13- va 15-ekran namunalari futbolga bog'langan — neytral namunalar taklif qilingan. 13-ekran sarlavhasi (ixtiyoriy): «G'oyangizga bitta hikoya yoza olasizmi?»
5. 400 belgi: 5-ekran 564 · 8-ekran ~800 · 20-ekran 542.

### 3.7. 3-o'tish 3-dars «Qanday ko'rsatamiz?»
1. **12-ekran savollari:** «Saytning ishlashini tinglovchi biladigan qaysi narsaga o'xshatasiz?» · «Oxirida tinglovchidan nima iltimos qilasiz?» Savollardagi «ular» sinf/kiyim g'oyasida birlikdagi odam bilan mos emas.
2. **Airbnb keysi:** «mahsulot» va «yechim» farqi · «o'ntacha oddiy varaq bilan» → «pul beradigan odamlarga o'ntacha oddiy slayd bilan».
3. **4-test lead:** «Sinf sardori uchun sayt qurdingiz: sardor unda kim pul berganini belgilaydi.»
4. **14-ekran sarlavhasi:** «baho» eMaktab bahosi bilan chalkashadi → «Endi siz tinglovchisiz. Har ko'rsatuvda nima to'g'ri, nima xato?»
5. **15-ekran sarlavhasi** faqat «besh gap» deydi, kadrlar ham tahrirlanadi → «Besh gap va uch kadringizda qaysi so'z tushunarsiz qoldi?»
6. **1-test:** «farzand» so'zi faqat to'g'ri variantda — ikki xato variant taklifi bor.

### 3.8. 4-o'tish 3-dars «Ma'lumot, ishonch»
O'quvchi 6–8 gapni ikki marta o'qidi — hammasi senariydagi matn, tegilmadi. 17 ta taklif: **`TAKLIF_4otish_3dars_2026-09-24.md`**. Eng muhimlari:
1. Markaziy ibora «ma'lumotni zarar yopadi» (6-ekran, flashcard, yakun) → «Maydonni yopish-yopmaslikni zarar hal qiladi».
2. 6-ekran «kanal ilovamizda» → «ilovamizda» · «ikki holat» → «ikki tomon bor: «Hammaga ochiq» va «Faqat egasiga»».
3. 8-ekran: sarlavha «har va'dani» → «har gapni» · «kontaktlar kabi…» → «boshida ko'rgan telefon kontaktlari kabi…».
4. Dars nomidagi «ishonch» darsda ochilmagan → 6-ekranga bir gap: «Odam ilovaga ma'lumotini ishonib beradi — yopiq maydon shu ishonchni saqlaydi.»
5. 1-, 2-, 4-test — javob shakldan topiladi; har biriga bitta xato variant taklifi.

## 4. Platforma kuzatuvlari (darsga emas)

- **Arena:** o'quvchi o'z ekranida bir ball (mahalliy vaqt), TOP-5 da boshqasini (server vaqti) ko'radi — eski darslarda ham shunday. KATTA_TOZALASH nomzodi.
- **Jonli rejim:** flashcard o'quvchiga ham ko'rinadi · hook javobi sinf ovoz berishidan oldin proyektorda ochiladi · keys ekranida mentor bashoratsiz «Davom etish»ni bossa, slaydlar ko'rsatilmay o'tadi (7 darsda bir xil naqsh — KATTA_TOZALASH nomzodi).
- **Supabase:** `record_attempt` yo'q — adapter jim o'tkazadi (analitika kerak emas deb kelishilgan). Sessiya yopilgach mentor tomonda bitta `quiz_control` 400 (ballga ta'siri yo'q). Uzilgan sinovdan PIN 697471 «live» holatida qolgan (test ma'lumoti).
- **Karta:** o'quvchi kartasini o'zbekcha yozgan bo'lsa, RU rejimda yig'ma gap aralash tilda chiqadi (o'quvchi matni o'zgartirilmaydi).

## 5. Qanday ko'rish va chiqarish

```
npm run dev:bridge        # lokal: http://localhost:5173/bridge.html
npm run build:bridge      # dist-bridge/ — Vercel uchun
```
Bosh sahifa: 4 o'tish kartasi → darslar → dars. UZ/RU tugmasi tepada. Jonli rejim: mentor kodi — eski Supabase sinov-kodi (hujjatga yozilmaydi).

**Vercel ✅ (08:30, sizning buyrug'ingiz bilan):** https://coddycamp-bridge.vercel.app — 7 dars ochiladi, sahifa xatosi 0. 3-bo'limdagi qarorlar kiritilsa, qayta chiqariladi.
Commit ham sizning buyrug'ingiz bilan; hozir yangi fayllar hammasi UNCOMMITTED (`src/bridge/`, `vite.bridge.config.js`, `bridge.html`, `pm-senariylar/BRIDGE-*`, `feedback/F-0923-bridge/`, `MATN_KORPUS.md` §201–§208, `package.json` 2 skript).

---
*Yakuniy variant: 08:02. Avtopilot to'xtatildi.*
