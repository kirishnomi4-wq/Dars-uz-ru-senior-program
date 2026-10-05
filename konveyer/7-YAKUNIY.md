# 7 · Yakuniy MD — koddan (bitta dars = bitta agent = bitta fayl)

Modul tugagach har darsning toza matni `feedback/<modul>/YAKUNIY/NN-<Nom>.md` ga yoziladi. Keyingi modullar «o'tilgan atamalar»ni shu yerdan oladi.
Boshqa hech qanday faylni tahrirlamaysiz (dars `.jsx` — faqat o'qish). Namuna: `feedback/F-0928-QA-5modul/YAKUNIY/`.

## Manba
- **Kod — yagona haqiqat** (`src/<N>-Modull/<Nom>Lesson.jsx`). Ekranlar tartibi va nomi uchun yordamchi: MD v3. Kod va MD farq qilsa — KOD yutadi, farq hisobotga.
- Ekran soni = `SCREEN_META`.
- Dars MD v3 bo'yicha qayta QURILMAGAN bo'lsa (masalan 6-Modul, 05.10: faqat kichik tuzatishlar) — MD v3 ga umuman qaramang, faqat kod.

## Format
```
# <N>-dars «<Nom>» — yakuniy matn

Fayl: `src/…/<Nom>Lesson.jsx` · <ekran soni> ekran · Keyingi dars: «…»
Holat: <sana> — kodga mos

## 0 · <ekran nomi>
- Eyebrow: … · Sarlavha: … · Mentor: …
- <karta / chat / kod / jadval / tugma — o'quvchi ko'radigan tartibda>
- Savol: … — variantlar ro'yxat bo'lib, to'g'risi oldida ✔ · Javob izohlari: …
(kod bo'lsa — ```js blokida, kodda qanday bo'lsa shunday)

## Nishonlar · ## Qisqa takrorlash oynalari · ## Jonli viktorina (12 savol) · ## Kartochkalar · ## Yakun
```
- Faqat O'QUVCHI KO'RADIGAN o'zbekcha matn. Bo'lmaydi: `✎`, «Harakat → Vizual», «KOD», A-bo'lim, mentor paneli/analitika matni, ruscha.
- So'zma-so'z (tinish, «», apostrof). Emoji yo'q (✔ — faqat to'g'ri javob belgisi). Podium — bitta qator «Natijalar (podium) — jonli reyting».
- Qisqa takrorlash oynalari — faqat o'quvchi OCHA oladiganlari (`QuestionScreen` tugmasi); `RECAPS` da bor, lekin ochilmaydigan (DragDrop final) — MD'ga emas, hisobotga.
- Arena: o'quvchi ko'radigan yozuvlar (lobby sarlavhasi «CODE STRIKE · 12 SAVOL · …», natija qatorlari) kiradi; mentor tugmalari, podium ichi — kirmaydi.
- PM darsida uy vazifasi kartasi kiritilmaydi. Amaliyot bloki: qadamlar, prompt qutisi (`{…}` bilan), xato izohi, kutilgan natija chati, «Ortda qoldingizmi…», repo teglari.

## Tekshiruv
Kodning `uz:` satrlaridan 30–40 tasini tasodifiy tanlab (skript), MD'da aynan borligini tekshiring; topilmaganlarini ko'ring (o'quvchi ko'radimi? — ko'rsa, qo'shing).
Vaqtinchalik fayllar — scratchpad ichida `<NN>-yakuniy/`. Turn-byudjeti ≤45.

## Hisobot
Fayl yo'li · ekranlar soni · tasodifiy tekshiruv (N/N, o'quvchi ko'radiganlari bo'yicha) · kod va MD farqlari (1 qatordan) · shubhali joylar.
«Shubhali joylar» — kodda ko'rilgan, lekin TUZATILMAGAN kamchiliklar (mentor aytgan tugma yo'q, atama ikki xil, ru-qoldiq, o'lik shart…): asosiy seans ularni
sinf-supurish bilan tekshiradi (bitta darsmi yoki platforma standarti — avval o'lcha) va foydalanuvchiga ro'yxat qilib beradi (05.10: 14 agent ~45 topilma).
