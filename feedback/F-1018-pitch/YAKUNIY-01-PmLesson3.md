# YAKUNIY · m1-12 «Demo Day — 3 daqiqalik nutq» (src/1-Modull/PmLesson3.jsx) — 18 → 10 ekran · F-1018-01 + F-1018-02 (sayt sahifasi) · 2026-10-18
Manba-haqiqat (MD = kod). Mentor: «18 slayd, men kirmayman, amaliyot qildirib gapirtiraman». Yo'nalish va 9 ekran matni foydalanuvchi tomonidan tasdiqlangan (GATE M, 18.10).
lessonId `pm-pitch-03-v19` → **`pm-pitch-03-v20`** (eski progress qayta boshlanadi). Zaxira: `arxiv/F-1018-01-oldin/PmLesson3.jsx`. Qurish: `qurish/f1018.py` (zaxiradan quradi, 12 bosqich + o'lik CSS).

## Ekranlar (10) — o'quvchi nima ko'radi, nima qiladi
| № | id | Ekran | O'quvchi | Ball |
|---|---|---|---|---|
| 1 | s0 | Kirish — ikki variant nutq | 2 variantni o'qiydi, «qaysi biri ushlaydi?» 3 variantdan tanlaydi; javob qisqa (216) | — |
| 2 | s1 | Reja — 3 daqiqa 6 bo'lak | chiziq 20·30·25·60·25·20 s; 4 qadam: aniqlaysiz · ikki ekranda yozasiz · ovoz chiqarib aytasiz · sherik bilan savol-javob | — |
| 3 | s2 | Nutq varag'i 1 — muammo + birinchi savol | sayt turi → 3 savol (chip yoki o'zi yozadi) → gap yig'iladi («Sinfdoshlarim … Mening saytim …») → **birinchi savol** maydoni (namuna mentor gapida); tugma «Javob bering (n/4)» → «Davom etish» | — (nishon Problem Finder!) |
| 4 | s3 | Nutq varag'i 2 — yechim + jonli demo | chap: tanish ilovalar jumlasi (4 tugma) + «Saytingiz nima qiladi? Bitta jumla»; o'ng: demo 3 qadam (bosib ochiladi) + sayt manzili (m1-11 Deploy `ccPitch3.link` dan to'lib keladi). «Qanday qildim» va «Keyingi qadam» tayyor gap bilan nutqqa tushadi | — |
| 5 | s4 | Test — «Jonli demoda zaldagi odamga nimani ko'rsatasiz?» | 4 variant, to'g'ri C (saytning o'zi); RECAPS {4} mentor-statistikasiga ulangan | 1 (INLINE_KEYS s4: 2) |
| 6 | s5 | Repetitsiya 1 — o'zingiz | nutq kartasi 6 qator (hammasi to'la), «✎ Tahrirlash», taymer 3:00, mikrofon; mentor: «Qanday qildim» qatori ota-ona tilida — «HTML», «CSS» demang; tugma «Sherik bilan mashqqa →» | final (s5: -1) · nishon Stage Ready! |
| 7 | s6 | Repetitsiya 2 — juftlikda (YANGI) | sherik = zaldagi ota-ona; 3 karta: «Buni rostdan o'zing qildingmi?» · «Bunga qancha vaqt ketdi?» · «Bu kimga kerak?»; har kartada «Maslahat ▾» (kuchli javob + tuzoq; 3-kartada o'quvchining o'z muammo gapi) va «✓ Javob berdim»; 3/3 → «Endi o'rin almashing» | — (nishon Answer Ready!) |
| 8 | s7 | Amaliyot — Demo Day saytida kamchilik bormi? (YANGI, F-1018-02) | «Saytni ochish ↗» (ccPitch3.link, yo'q bo'lsa maydon); 3 tekshiruv: tepada nom + yechim jumlasi · demodagi asosiy qism to'liq · telefonda matn chetga chiqmaydi; «✓ Joyida» / «✗ Kamchilik bor» → «✓ To'g'riladim»; yopiq «Gemini'ga so'rov namunasi» + Nusxalash; 3/3 → Davom | — |
| 9 | s8 | Natijalar / arena | solo: «Bugungi natijangiz» 2/2; jonli: podium + CODE STRIKE (QUIZ_BANK 12, 3/3/3/3) | — |
| 10 | s9 | Yakun | nutq kartasi + manzil · «Endi siz bilasiz» 4 band · Uyga vazifa (uyda 3 daqiqada ayting) · nishonlar 5/5 · Yakunlash | nishon Level Up! |

## Olingan (18 → 9)
Test 1 (s3) · Test 3 (s10, JS) · «Qanday qildim» juftlik-o'yini (s8 → tayyor gap) · JS tugmalar (s9) · Ota-ona savollari testi (s11 → og'zaki mashq) · Koding (s12, HtmlCompiler importi bilan) · Kartochkalar (sflash, PM3_FLASHCARDS, Flashcards) · birinchi savol ekranidagi mikrofon (gapirish repetitsiyada) · StudentPracticePulse · 64 o'lik CSS klassi (91 qator). Fayl 3 958 → 3 355 qator.

## O'zgargan matnlar
Reja (s1) mentor + 4 qadam · s2 mentor/audio + yashil karta oxiri («Endi zalga beradigan birinchi savolingizni yozing…») · s5 mentor + tugma · QUIZ_BANK 3 savol (HTML/CSS/savat → «Bu kimga kerak?» kuchli javob · sherik roli · «HTML va CSS ishlatdim» nega yetarli emas) · nishon Next Level! → **Answer Ready!** («Ota-onangiz savollariga javob berdingiz»).

## Sinov
- `npm run gates` 11/13: tell/emoji — zaxirada ham aynan shu (eski RECAPS/STATIONS emojilari, lint:til homoglif ogohlantirishi 1758-qator ham eski); undef/jsx/keys/dark/til/olchov/narrow/qolip/prompt ✓. `lint:jsx` 0. `lint:qolip` error 0 (arena 3/3/3/3).
- `sinov/tekshir-m112.mjs` **38/38** (`sinov/natija-m112.txt`): eski v19 progress → 01/09 · oqim 9 ekran (manzil Deploy'dan, 6 blok saqlov, nishonlar 5/5, onFinished tq 2 · final 1/1 · passed) · RECAPS/INLINE_KEYS mosligi · 390 px 5 ekran toshishsiz.
- `sinov/ru-m112.mjs` 10/10: pageerror 0, [object Object] 0, uz-qoldiq 0.
- Suratlar: `suratlar/` (1280: 00–08, 390: 3·4·6·7·8).

## Tuzoqlar (keyingi qurishlar uchun)
1. Flashcard blokini kesishda chegara «oxirgi FC_* dan root'gacha» deb olinsa, orada turgan AchCelebrate/AchToasts/QzBolt/CsWordmark ham ketadi — esbuild buni ko'rmaydi, faqat `undef` darvozasi ushlaydi. Chegara — aniq nom (`function AchCelebrate(`).
2. Birlashtirilgan ekranga eski ekranning `const K = …` kabi mahalliy o'zgaruvchilari ko'chirilmasa — `undef`.
3. Sinovda `innerText` CSS `text-transform: uppercase` ni qo'llaydi — matnni `/…/i` bilan tekshiring.
4. RECAPS «Eslatma» o'quvchi ekranida yo'q — faqat mentor-statistikasi (`MentorTestStats onOpenRecap`) ochadi; o'quvchi tomonda kalit-moslikni koddan tekshiring.
