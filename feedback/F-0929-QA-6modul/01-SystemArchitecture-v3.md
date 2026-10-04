# 6-Modul (LMS: 8-Modul) · 1-dars «Komponentlardan tizim» — MD v3 (PILOT)

Fayl: `src/6-Modull/SystemArchitectureLesson.jsx` · 19 ekran · faqat o'zbekcha (ru — kod bosqichida, RU_TARJIMON_SHABLON bilan)
Asos: `01-SystemArchitecture-v2.md`. v3 faqat **o'zgargan ekranlarni** to'liq yozadi; «v2 dagidek» deyilgan ekranlar matni v2 dan olinadi.
Fidbek: qator yoniga `>> ...` yozing. Bu MD tasdiqlangach (GATE M), dars shu holatga keltiriladi, keyin qolgan 13 dars shu naqshda yoziladi.
⚠️ Testlarda to'g'ri javob O'RNI o'zgarmaydi (jonli ball kaliti).

---

## A. v3 qoidalari (v2 qoidalari A-1…A-6 o'z kuchida + 04.10 qonunlari)

7. **Tushuncha-ekran = harakat → natija vizualda (DE-184).** Har tushuncha-ekranda o'quvchi bitta ish qiladi (tanlaydi, ulaydi, joylaydi, o'chiradi),
   va **tizim xaritasi yoki sayt maketi o'zgaradi**. «Bosasiz → yangi matn-karta» yo'q. Har ekran ostida **Harakat → Vizual o'zgarish** qatori yozilgan.
8. **Bitta vizual — tizim xaritasi.** Dars bo'yi bitta xarita: `Foydalanuvchi · Frontend · Backend · Database` (+ AI, Bot). Har ekran uni to'ldiradi yoki ishlatadi
   (163-qonun: bitta vizual; 180: bitta manba — `SYS_NODES` massivi).
9. **Matn o'lchovi (162/164):** sarlavha bitta qator (≤55), iloji bo'lsa savol · Mentor ≤2 gap · yashil xulosa ≤110 · hook javobi ≤120.
10. **Toza yuza (185):** tugma va variantlarda emoji yo'q; fon faqat holat (tanlangan — accent, to'g'ri — yashil, xato — qizil).
11. **Ketma-ket qadamlar (163.8):** chapda qadam-ro'yxati (o'tgani ✓), o'ngda faqat joriy qadam; «Keyingi qadam» tugmasi joriy karta ostida o'ngda (187).
    Qadamlardan oldin ballsiz bashorat (181).

---

## Darsning ipi (v2 dagidek) va bitta vizual

- **Hook:** oddiy onlayn xarid sayti → ortida 5 qism → «Sayt aslida nima?».
- **Tizim xaritasi (yangi, dars bo'yi):** chapda `Foydalanuvchi`, keyin `Frontend` → `Backend` → `Database` (vertikal ustun), Backend yonida `AI` va `Bot` uchun bo'sh
  ulanish nuqtalari. Tugunlar: kulrang (hali ochilmagan) → oq karta + nom (ochilgan) → accent chegara (joriy) → yashil (ishladi). So'rov — xaritada yuradigan kichik «konvert».
- **Sayt maketi (hook'dagi):** Telefon 2 500 000 · Quloqchin 300 000 · «Savatga» tugmasi · savat belgisi (son). Tajribalarda shu maket o'zgaradi.

---

## 0 · Kirish — v2 dagidek, matn qisqaradi
- Sarlavha: **Bitta xarid sayti ortida nechta qism ishlaydi?** (44)
- Mentor: Foydalanuvchi faqat sahifani ko'radi. Tugmani bosing — sahifa ortini ochamiz.
- Javob — 2-variant: **Aynan!** Sayt — bu tizim: beshta qism birga ishlaydi. (52)
- Javob — 1 yoki 3: **Qiziq fikr!** Ekranda bitta sahifa, lekin ortida beshta qism birga ishlaydi. (72)
- **Harakat → Vizual o'zgarish:** «Ortida nima bor?» → sayt maketi chetga suriladi, ostidan 5 tugun (kulrang) ko'rinadi — xarita shu yerda tug'iladi.
✎ hook javobi 147/165 → 52/72 (162) · tugun nomlari maketdan chiqadi, matn ro'yxati emas

## 1 · Reja — v2 dagidek
- Sarlavha: **Bugun qismlarni bitta tizimga ulaymiz.** (38)
- Mentor: Oldingi modullarda har qismni alohida qurdingiz. Bugun ularni bitta chizmaga ulaymiz — buni arxitektura deyishadi.
✎ sarlavha 1 qatorga; mentor 3 gap → 2

## 2 · Besh qism  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Tushuncha · 5 qism
- Sarlavha: **Sayt ortidagi har qism nima qiladi?** (36)
- Mentor: Maketdagi narsani bosing — u qaysi qismning ishi ekanini xarita ko'rsatadi.
- Maketda 5 nuqta (bosiladigan joy, 168-qonun: pulsatsiya halqasi):
  - mahsulot kartochkasi → **Frontend** · React — «ko'rsatadi»
  - «Savatga» bosilgach narx yig'indisi → **Backend** · Node.js (NestJS) — «hisoblaydi va tekshiradi»
  - savatdagi son (sahifa yangilansa ham turadi) → **Database** · PostgreSQL — «eslab qoladi»
  - «G'ilof ham olasizmi?» pufagi → **AI** · Claude — «maslahat beradi»
  - pastki burchakdagi Telegram belgisi → **Bot** · Telegram — «yana bir kirish yo'li»
- **Harakat → Vizual o'zgarish:** maketdagi joyni bosish → xaritada o'sha tugun kulrangdan oq kartaga aylanadi, ichida nom + 2–3 so'zli vazifa
  (yuqoridagi qo'shtirnoqli qism); maketdagi joydan tugungacha chiziq bir lahza yonadi. 5/5 da xarita to'liq.
- Xulosa (5/5): Beshta qism — bitta tizim: uchtasi asosiy, AI va Bot qo'shimcha. (61)
- Tugma (pastki): 5 qismni toping (N/5) → Davom etish
✎ 5 matn-kartasi → maket + xarita · metafora («peshtoq», «arxiv») shu ekrandan olindi — Mentor ham, karta ham aytmaydi (A-1: bir marta yetadi, bu darsda kerak bo'lmadi)

## 3 · So'rovning yo'li  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Tajriba · so'rov yo'li
- Sarlavha: **«Savatga» bosilgach so'rov qayerga boradi?** (42)
- Mentor: So'rovni o'zingiz yo'naltiring: har qadamda keyingi qismni bosing.
- Bashorat (ballsiz, 181): **Frontend'dan keyin so'rov qayerga boradi?** · Database'ga · Backend'ga — tanlov saqlanadi.
- Qadam-ro'yxati (chapda, 163.8): 1 Foydalanuvchi bosdi · 2 Frontend → Backend · 3 Backend tekshirdi · 4 Database saqladi · 5 Javob ekranga qaytdi
- **Harakat → Vizual o'zgarish:** konvert joriy tugunda turadi; o'quvchi xaritadagi KEYINGI tugunni bosadi → konvert o'sha tugunga uchadi, chiziq yashil bo'ladi,
  chapdagi qadam ✓ bo'ladi. Noto'g'ri tugun (masalan, Frontend → Database) bosilsa — tugun silkinadi, bir qator: «Bizning tizimda Frontend Database'ga to'g'ridan
  bormaydi.» (51). 5-qadamda konvert orqaga yuradi va maketdagi savat soni 0 → 1 bo'ladi.
- Joriy qadam kartasi (o'ngda, bitta qator): masalan «Backend so'rovni qabul qildi va tekshirdi.»
- Natija qatori: «Taxminingiz: Database · haqiqatda: Backend» (yoki «Taxminingiz to'g'ri chiqdi»).
- Xulosa: So'rov Frontend → Backend → Database yuradi, javob shu yo'l bilan qaytadi. (75)
- Tugma (pastki): Yo'lni yuring (N/5) → Davom etish
✎ «Keyingi qadam» bosish → o'quvchi keyingi qismni o'zi tanlaydi (184) · request/response nomi joriy kartada: «so'rov (request)», «javob (response)»

## 4 · 1-savol — v2 dagidek

## 5 · Frontend yoki Backend?  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Chegara · Frontend ↔ Backend
- Sarlavha: **Bu ishni Frontend qiladimi yoki Backend?** (40)
- Mentor: Boshida ko'pchilik shu ikkisini adashtiradi. Har ishni o'z tomoniga joylang.
- Chap — **brauzer oynasi** (Frontend), o'ng — **server qutisi** (Backend), o'rtada ingichka chiziq «API».
- 6 ish-chip (aralash): Tugmani ko'rsatadi · Narxni hisoblaydi · Rasmni ko'rsatadi · Parolni tekshiradi · Savatni chizadi · Buyurtmani Database'ga yozadi
- **Harakat → Vizual o'zgarish:** chipni bosib, tomonni bosish → to'g'ri bo'lsa chip o'sha oynaga kiradi VA oyna o'zgaradi:
  Frontend'da tugma/rasm/savat maketda paydo bo'ladi; Backend qutisida qator chiqadi: `2 500 000 + 300 000 = 2 800 000`, `parol ✓`, `INSERT buyurtma`.
  Noto'g'ri tomon → chip qaytadi, bir qator: «Narxni foydalanuvchi o'zgartira olmasin — bu Backend ishi.» (49)
- 6/6 da: o'rtadagi «API» chizig'idan bitta so'rov o'tadi (3-ekran konverti).
- Xulosa: Ko'rinadigani — Frontend, qoida va hisob — Backend; ular API orqali gaplashadi. (81)
- Tugma (pastki): 6 ishni joylang (N/6) → Davom etish
✎ «Qiladi / Qilmaydi» matn-kartalari → saralash + oynalar o'zgaradi · xulosa 193 → 81

## 6 · Database — xotira  ← TAJRIBA (saqlanadi, bashorat qo'shildi)
- Sarlavha: **Sahifani yangilasangiz, savat nima bo'ladi?** (41)
- Mentor: Ikki saytni solishtiring: birida Database yo'q, birida bor.
- Bashorat (ballsiz): Ikkalasida ham qoladi · Database'sizda yo'qoladi · Ikkalasida ham yo'qoladi
- Ikki sayt-maket yonma-yon: «Database'siz» · «Database bilan (PostgreSQL)», ikkalasida savatda Telefon, Quloqchin.
- **Harakat → Vizual o'zgarish:** «Sahifani yangilash» → ikkala maket miltillab qayta yuklanadi; chapdagi savat bo'shaydi (0), o'ngdagi joyida (2);
  xaritada Database tuguni yashil yonadi.
- Natija qatori: «Taxminingiz: … · haqiqatda: Database'sizda yo'qoldi»
- Xulosa: Database'ga yozilgan ma'lumot qoladi, faqat ekranda turgani yo'qoladi. (74)
✎ auditda eng yaxshi deb topilgan tajriba saqlandi · ❌/✅ emoji-sarlavhalar → oddiy yorliq (185) · xulosa 140 → 74 · «Qo'shimcha» kartasi olindi (takror)

## 7 · AI va Bot qayerga ulanadi?  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Qo'shimcha qismlar · AI va Bot
- Sarlavha: **AI va Bot tizimning qaysi qismiga ulanadi?** (42)
- Mentor: Ikkala qismni xaritaga ulang va saytda nima o'zgarishini ko'ring.
- Xaritada AI va Bot alohida turadi, uchta ulanish nuqtasi yonadi: Frontend · Backend · Database.
- **Harakat → Vizual o'zgarish:** AI ni bosib, nuqtani tanlash →
  - Backend → chiziq chiziladi, sayt maketida «G'ilof ham olasizmi?» pufagi paydo bo'ladi;
  - Frontend/Database → chiziq qizil uziladi, bir qator: «AI'ni Backend chaqiradi — kalit va qoidalar shu yerda.» (49)
  Bot → Backend → Telegram chat maketi chiqadi: «Telefon buyuraman» → Database jadvalida buyurtmalar soni 1 → 2.
- Xulosa: AI va Bot qo'shimcha qismlar; ikkalasi ham o'sha Backend'ga ulanadi. (74)
- Tugma (pastki): Ikkalasini ulang (N/2) → Davom etish
✎ ikki matn-karta → ulash + maket o'zgaradi · xulosa 128 → 74

## 8 · 2-savol — v2 dagidek

## 9 · Bitta qismni o'chiring  ← TAJRIBA (vizualga o'tdi)
- Sarlavha: **Bitta qismni o'chirsangiz, sayt nima bo'ladi?** (43)
- Mentor: Qismni o'chiring va saytga qarang.
- Xaritada uch tugmali kalit: Frontend · Backend · Database (yoqilgan).
- **Harakat → Vizual o'zgarish:** kalitni o'chirish → tugun kulrang, chiziq uziladi va **sayt maketi o'zgaradi**:
  - Database o'chiq → «Sahifani yangilash» bosilgach savat bo'sh (0);
  - Backend o'chiq → mahsulotlar o'rnida aylanayotgan yuklanish belgisi, «Savatga» bosilmaydi;
  - Frontend o'chiq → maket bo'sh oq oyna, Backend tuguni esa ishlab turibdi (yashil).
  Har holatda maket ostida bitta qator (≤60): «Ma'lumot saqlanmadi.» · «Javob kelmayapti.» · «Ko'radigan hech narsa yo'q.»
- Xulosa: Uchala asosiy qism kerak: biri ko'rsatadi, biri boshqaradi, biri eslab qoladi. (78)
- Tugma (pastki): 3 qismni sinang (N/3) → Davom etish
✎ oqibat-kartalari (matn) → maket o'zgaradi · xulosa 129 → 78

## 10 · Ko'p kirish yo'li  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Tizim · ko'p kirish yo'li
- Sarlavha: **Saytdan va botdan berilgan buyurtma qayerga tushadi?** (51)
- Mentor: Uchala kirish yo'lidan buyurtma bering va Database'ga qarang.
- Uch kirish maketi (kichik): brauzer · Telegram chat · telefon (191-qonun ramkasi); o'rtada bitta Backend, pastda bitta Database jadvali.
- **Harakat → Vizual o'zgarish:** har maketda «Buyurtma» bosiladi → konvert Backend'ga, undan Database jadvaliga yangi qator tushadi
  (`#1 web · Telefon`, `#2 bot · Quloqchin`, `#3 mobil · G'ilof`); qolgan ikki maketdagi «Buyurtmalar» soni ham oshadi.
- Xulosa: Backend va Database bitta, kirish yo'llari ko'p. Mobil ilovani 9–11-darslarda quramiz. (85)
- Tugma (pastki): 3 yo'ldan buyurtma bering (N/3) → Davom etish
✎ uch matn-karta → uch maket + umumiy jadval · fakt saqlandi («9–11-darslarda»)

## 11 · 3-savol — v2 dagidek

## 12 · Bitta buyurtma — butun tizim  ← CASE (163.8 + animatsiya; foydalanuvchi #1)
- Eyebrow: Hayotiy · to'liq tizim
- Sarlavha: **Ikki foydalanuvchi — bitta tizim. Nima bo'ladi?** (45)
- Mentor: Bir xaridor saytdan, ikkinchisi botdan buyurtma beradi. Qadamlarni kuzating.
- Bashorat (ballsiz): **Ikki buyurtma nechta Database'ga yoziladi?** · Bitta · Ikkita
- Chapda qadam-ro'yxati (6 qisqa band, o'tgani ✓): Saytdan buyurtma · Backend yozdi · Botdan buyurtma · Backend yozdi · AI tavsiya · Natija
- O'ngda — **tizim xaritasi** (matn-karta emas): har qadamda xaritada bitta harakat:
  1. sayt maketidan konvert Frontend → Backend ga uchadi;
  2. Database jadvalida `#1 web · Telefon` qatori paydo bo'ladi;
  3. Telegram maketida «Telefon buyuraman» xabari chiqadi;
  4. konvert Bot → **o'sha** Backend → o'sha jadvalga `#2 bot · Telefon`;
  5. AI tuguni yonadi, ikkala maketda «G'ilof ham olasizmi?» pufagi;
  6. ikkala chiziq bir vaqtda yashil yonadi.
  Joriy qadam kartasi — xarita ostida bitta qator; «Keyingi qadam» shu karta ostida o'ngda (187).
- Natija qatori: «Taxminingiz: … · haqiqatda: bitta Database».
- Xulosa: Ikki kirish yo'li, bitta Database. Shu tizimni 13-darsda to'liq qurasiz. (71)
- Tugma (pastki): Tizimni kuzating (N/6) → Davom etish
✎ 6 matn-karta pastga cho'zilardi → qadam-ro'yxati + xarita animatsiyasi (foydalanuvchi #1: «bittadan keladi, textlar kamayadi») · bashorat qo'shildi

## 13 · Chizmani o'zingiz chizing  ← TUSHUNCHA (qayta qurildi)
- Eyebrow: Amalda · chizma
- Sarlavha: **Kod yozishdan oldin tizimni chizing.** (35)
- Mentor: Tajribali dasturchi avval chizma chizadi. Qismlarni qo'shib, ularni ulang.
- Chapda bo'sh chizma maydoni va 5 tugma: + Foydalanuvchi · + Frontend · + Backend · + Database · + AI; o'ngda `arxitektura.txt`.
- **Harakat → Vizual o'zgarish:** qismni qo'shish → maydonda tugun paydo bo'ladi VA `arxitektura.txt` ga qator yoziladi; ikki tugunni ketma-ket bosish → strelka chiziladi
  va faylga `↓` yoki `↓ ↑ API (so'rov / javob)` qatori qo'shiladi. Noto'g'ri ulanish (Frontend → Database) — strelka qizil, bir qator: «So'rov Backend orqali o'tadi.» (32)
  Oxirida fayl v2 dagi chizmaga teng bo'ladi.
- Xulosa: Chizma bilan jamoaga ham, AI'ga ham tizimni bitta rasmda tushuntirasiz. (73)
- Qator (xulosadan keyin): 3-darsda tizim tuzishning sinab ko'rilgan usullarini — arxitektura patternlarini o'rganamiz.
- Tugma (pastki): Chizmani yig'ing → Davom etish
✎ tayyor chizma + «Nega muhim?» 3 matn-banddan → o'quvchi chizmani o'zi yig'adi, fayl jonli yoziladi (184) · 3 band bitta xulosaga

## 14 · 4-savol — v2 dagidek
## 15 · Yo'lni yig'ing (final) — v2 dagidek
- Xulosa (dd-done): Yo'l tayyor: Foydalanuvchi → Frontend → Backend → Database → ekran. (73)
✎ 114 → 73
## 16–17 · Natijalar, Takrorlash — v2 dagidek

## 18 · Yakun — v2 dagidek
- Sarlavha: **Endi sayt siz uchun bitta sahifa emas — tizim.** (44)
✎ ru 62 → qisqaradi (kod bosqichida)

---

## B. Kod bosqichida (KOD)
- `SYS_NODES` — bitta manba (180): tugunlar, ranglar, 2–3 so'zli vazifa; 2, 3, 5, 7, 9, 10, 12, 13-ekranlar shundan o'qiydi.
- `SysMap` komponenti: tugun holatlari (kulrang · oq · joriy · yashil · o'chiq), konvert animatsiyasi (`reduced-motion` — sakrash), chiziq yonishi.
- `SiteMock` — hook maketi, holatlari: oddiy · yuklanish · bo'sh · AI pufagi · savat soni.
- Bashorat ekranlari (3, 6, 12) — ballsiz, `onAnswer` ga kirmaydi; natija qatori bitta.
- Darvozalar: `npm run gates` 12/12 · `lint:olchov` 0 warn (shu dars) · `lint:emoji` 185 · `lint:layout` 1280/1366 · surat (1280 + 393).
