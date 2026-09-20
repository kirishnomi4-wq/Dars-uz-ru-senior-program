# ERTALABKI HISOBOT — 21.09 tun (1–4c modullar LMS'ga tayyorlandi)

> Topshiriq (21.09 01:50): «bitta papka — hozirgi darslar, yangi avtomatlashtirishga to'liq mos; ertalab LMS'ga
> yuklayman». Javoblar: 1-A (darslar + uyga-vazifa) · 2-A · 3-A (tartib raqamli nomlar) · 4-A (faqat o'zi-yetarli
> fayllar) · 5-A (to'liq sifat-o'tishi). Qo'shimcha: **PM uyga-vazifasi topshirilganda `onFinished` avtomat ketsin.**

## 1. Yuklash papkasi — tayyor

**`yuklash-2026-09-21/`** — 7 modul papkasi, **88 fayl**: 70 dars + 18 uyga-vazifa.

| Papka | Modul | CRM bo'limi | Dars |
|---|---|---|---|
| `1-Modul` | Men internetdaman | M1 (ildiz) | 14 |
| `2-Modul` | Sistemalar qanday o'ylaydi | M2 (ildiz) | 13 |
| `3-Modul` | Frontend — React | **4-M** | 14 |
| `4-Modul` | Ma'lumot va backend | **5-M** | 15 |
| `4a-Modul` · `4b-Modul` · `4c-Modul` | NestJS · Testlash · CI/CD | **6-M** | 4 · 3 · 7 |

- Fayl nomi: `NN-DarsNomi.jsx` — **NN kursdagi tartib raqami** (`src/App.jsx` registridan, yagona haqiqat manbai).
- Uyga vazifa: `NN-PmLessonX-uyga-vazifa.jsx` — o'sha darsning yoniga qo'yilgan.
- Har modulda **`ROYXAT.md`**: tartib · tur · sarlavha · `lesson_id` · md5. Ildizda **`README.md`** — yuklash tartibi.
- Hamma fayl **prod** manzili bilan (`dars-api.coddycamp.uz`), o'zi-yetarli (qo'shimcha modul kerak emas).

## 2. Tuzatilgan nuqson — uyga vazifa LMS'da belgilanmasdi (F-0921-01)

**Topildi:** 18 ta uyga-vazifa paketining hammasida `onFinished` **faqat** «Vazifani topshirish» tugmasi bosilganda
ketardi. Tugma bosilmasa yoki sahifa yopilsa — LMS hech narsa olmasdi; qayta ochilganda ham yuborilmasdi.
Ya'ni o'quvchi vazifani bajarsa ham ptichka yonmasligi mumkin edi.

**Tuzatildi (18 paket):**
1. Bosqichlar bajarilganda topshirish **avtomat** ketadi (tugma qoladi — bosilgach «✓ Topshirildi»).
2. Yuk **muhrlanadi** — takror yuborishda aynan o'sha mazmun (LMS `idempotency_key` 409 dan himoya).
3. Vazifa qayta ochilsa va allaqachon topshirilgan bo'lsa — yuk **bir marta qayta** yuboriladi (ptichka tiklanadi).
4. Bo'sh vazifa hech qachon topshirilmaydi.

**Isbot:** yangi sinov `scripts/smoke-homework.mjs` (haqiqiy brauzer) — **36/36** (18 paket × uz/ru).

## 3. Sifat o'tishi — nima tekshirildi

| Tekshiruv | Natija |
|---|---|
| Har fayl brauzerda ochiladi va xatosiz ishlaydi | **88/88** ✓ |
| **Dars to'rt rejimda: self · mentor · jonli o'quvchi · uyda** | **70/70** ✓ (yangi sinov, F-0921-02) |
| `lesson_id` bor va serverdagi katalogda mavjud | **88/88** ✓ |
| Prod manzili to'g'ri, staging aralashmagan | **88/88** ✓ |
| Nishon kalitlari katalog bilan mos, tavsiflar uz+ru to'liq | **70/70** ✓ |
| Ruscha qoplama (uz kalitlariga nisbatan) | **70/70** ✓ |
| Yakun-ma'lumoti (LMS'ga ketadigan) — uz va ru | **70/70** ✓ (seal smoke) |
| Nishon/ball qoidalari (151–154-qonun) brauzer-probda | **160/160** ✓ |
| Darvozalar, `lint:jsx`, til/dark farqi | ✓ · farq 0 |

### Yopilgan eski bo'shliq (F-0921-02)

`mentor` va jonli `student` rejimlari shu paytgacha **faqat kod o'qish** bilan tekshirilgan edi. Endi yangi sinov
(`scripts/smoke-rejim.mjs`) har darsni to'rt rejimda haqiqiy brauzerda ochadi: dars chiziladi, matn bo'sh emas,
sahifa/konsol xatosi yo'q, mentor rejimida jonli panel ko'rinadi. **70/70 toza.** Bu — sinfda «oq ekran» xavfini
ancha kamaytiradi.

## 4. Aniqlik — `PmLesson7` yuklanmaydi

Kecha «ro'yxatda yo'q» deb belgilagandim; tekshirdim — u **eski versiya**: `src/App.jsx:45` da ochiq yozilgan
(«PM pipeline P0 — eski PmLesson7 o'rnida»), o'rnini `PmUserStoryLesson` egallagan. Faylda nishon ham, ball ham,
ruscha ham yo'q; u faqat solishtirish vositasida qoladi. Shuning uchun to'liq ro'yxat — **70 dars**.

## 5. Sizdan kutilayotgani

1. **Yuklash** — `yuklash-2026-09-21/` papkasidan modul-modul.
2. **Staging sinovi** (kechagi kelishuv) — `staging-sinov/AgentArchitectureLesson.jsx`, md5 `108e2a34…`:
   409 tuzatilgani va yakuniy test balini oxirigacha tasdiqlaydi.
3. **Axadulla javobi** — kalit qoidasi va «natija saqlangan bo'lsa qizil xato ko'rsatmaslik».

## 5b. 👦 O'quvchi-o'qishi — topilmalar (1- va 2-modul)

**Tuzatildi (ziddiyat edi, tasdiq talab qilmaydi):**
- **JsFunctions · yakuniy topshiriq — TO'SIQ edi.** Mentor «`kuch * 3` qaytaradigan funksiya yoz» deydi va tekshiruvchi
  ham shuni kutadi, lekin yorliq/maslahat/natija namunasi eski `n * n` formulani ko'rsatardi. Maslahatga ergashgan
  o'quvchi darsdan **o'ta olmasdi**. Eski formuladan qolgan izlar tozalandi (5 joy, uz+ru), ruscha izohdagi hisob
  xatosi ham (`3 - 10 = -7` → `3 * 3 + 10 = 19`).
- **HtmlTakrorlash** — ruscha matn o'zbekcha tugma nomini aytardi («кнопкой «Nusxalash»» → «Скопировать»).

**Tasdiqingiz kerak (o'quvchi matni yoki ekran mantig'i o'zgaradi):**

| # | Dars · ekran | Muammo | Taklif |
|---|---|---|---|
| Q1 | **VsCode · 1-qadam (o'rnatish)** | Hamma qadam faqat **Windows** uchun: «Download for Windows», `.exe`, «I accept → Next → Install». Mac yoki Linux'dagi o'quvchi birinchi qadamdayoq to'xtaydi | GitLesson'dagi kabi «🛟 Boshqa tizimda?» paneli qo'shamiz: macOS (`.dmg` sudrash) va Linux (`.deb`/Software Center) uchun 2–3 qator |
| Q2 | **DeployLesson · AI qadami** | Butun qadam `gemini.google.com` javobiga bog'langan; AI ochilmasa zaxira yo'l yo'q (GitLesson'da «🛟 Ochilmadimi?» bor) | Shu ekranga ham zaxira panel: tayyor kod namunasi + «AI'siz davom etish» yo'li |
| Q3 | **CssPractice · menyu ekrani** | Mentor javobni aytib qo'yadi: «`nav` ga `display: flex` berib…», keyin «qaysi qiymat bir qatorga tizadi?» deb so'raydi | Mentordan `display: flex` olib tashlanadi (savol o'z kuchida qoladi) |
| Q4 | **CssLesson1 · yakuniy amaliy** | Mentor `h1 { color: red; }` ni to'liq beradi va input ko'rsatmasi ham aynan shu — o'quvchi ko'chiradi, eslamaydi (bu ball beradigan ekran) | Namuna ko'rsatmadan olinadi, Mentor qoidani aytadi (qaysi teg, qaysi xususiyat), aniq yozuvni o'quvchi o'zi yozadi |
| Q5 | **Htmllesson1 · yopuvchi teg** | Bitta harf yozilishi bilan maslahat to'liq javobni chiqaradi: «Yopuvchi teg `/` belgisi bilan boshlanadi: `</h1>`» | Maslahat faqat birinchi xato urinishdan keyin chiqsin (biz bu naqshni 19.09 da qo'llagandik) |

### 3- va 4-modul o'qishi (tunda)

**Tuzatildi (mantiq, matn tegilmadi) — uchtasi o'quvchini qotirib qo'yardi:**
- **DbSqlNosql s7** — «Davom etish» sanoq 1 240 505 ga yetganda ochilardi, animatsiya esa 1 240 504 da to'xtardi:
  tugma **umuman ochilmasdi**. Endi oqim tugashiga bog'landi.
- **PmLesson8 s8** — joylashgan kartani qaytarib bo'lmasdi; uchala ishni «🎯 Darrov»dan boshqa katakka qo'ygan
  o'quvchi birinchi ishni tanlay olmay qotib qolardi. Endi kartani bosib qaytarib oladi.
- **PostgresCrud s15** — narx «50 000» (probel bilan) jim rad etilardi · **FullstackFeedback s16** — `confirm()`
  qabul qilinmasdi. Ikkalasi ham endi qabul qilinadi.

**Q6 — QAROR KERAK: React API darslarida mavjud bo'lmagan server.**
`ReactApiGet` va `ReactApiPost` darslarining «Amaliyot · VS Code» qadamlari o'quvchiga
`fetch('https://robo-api.uz/games')` yozishni va «konsolda 200 OK, 3 kartochka» ko'rishni aytadi. Men tekshirdim:
**bu domen javob bermaydi** (48 joyda ishlatilgan: 30 + 18). Lokal zaxira ham berilmagan. Ya'ni bu amaliy qadamni
o'quvchi bajara olmaydi.

| Variant | Nima bo'ladi | Baho |
|---|---|---|
| **A** | Darsdagi manzil o'rniga **bizning serverda** kichik namoyish-uchi: `GET/POST/DELETE /demo/games` | ✅ dars hikoyasi saqlanadi, POST/DELETE ham ishlaydi · server ishi + deploy kerak (~yarim kun) |
| **B** | O'quvchi loyihasidagi **`games.json`** fayl: `fetch('/games.json')` | ✅ bugunoq ishlaydi, hech qanday server kerak emas · ❌ POST/DELETE darsiga yaramaydi |
| **C** | Ochiq test-API (`jsonplaceholder`) | ✅ tez · ❌ «robo-games» hikoyasi buziladi, POST natijasi saqlanmaydi |
| **D** | Hozircha tegmaymiz | ❌ o'quvchi qadamni bajara olmaydi, mentor og'zaki tushuntiradi |

**Tavsiyam:** GET darsi uchun **B** (bugunoq ishlaydi), POST/DELETE darsi uchun **A** (keyingi navbatda).
3-modul bugun boshlanmasa, shoshilinch emas.

**Boshqa topilmalar (matnga tegadi — tasdiq kutadi):** ReactBuildSite s6 javobni yonidagi izohda aytib qo'yadi ·
ReactApiGet s13 Mentor yig'ish tartibini oldindan sanaydi · ReactPropsReuse s5 «sudrang» deydi, amalda tugma bosiladi ·
FullstackConnect s1 «CORS» atamasi izohsiz (izoh faqat s10 da) · PmLesson12 s8 va PmLesson10 s8 da «Saqlash» jim
o'chib qoladi (sabab aytilmaydi) · DataIntro s15b da `id` qatorini bosganda javob-izoh chiqmaydi.

### 4a · 4b · 4c o'qishi (tunda) — qotirib qo'yadigan to'siq YO'Q

Tekshirdim: 4a amaliyotidagi tashqi repo (`github.com/Azizbekcrypto/IntroNestArxitechture`) **tirik** (200) —
bu to'siq emas. Tasodifga bog'langan darvoza yo'q, joylashtirishlar qaytariladi.

**Tuzatildi:** FullPipeline s13 — tetik maydoni faqat aynan `push` ni qabul qilardi; yaml odatiga ko'ra `push:`
yoki `on:push` yozgan o'quvchi jim rad etilardi (izoh ham chiqmasdi). Endi uchalasi ham qabul qilinadi.

**Tasdiqingiz kerak:**

| # | Dars · ekran | Muammo | Taklif |
|---|---|---|---|
| Q7 | **NestArchPractice · amaliyot** | «Agentga to'liq playbook yuboring» deyiladi, lekin **qaysi dasturga** ekani aytilmagan (faylda Gemini/Cursor umuman yo'q), «agent» va «playbook» ham izohsiz | Xotiradagi qoidangizga ko'ra `gemini.google.com` deb yozamiz va ikkala so'zga bir martalik izoh qo'shamiz |
| Q8 | **FullPipeline s6** | Qulf yorlig'i «Avval 5 nuqtani tizing» deydi, aslida esa 4 ssenariy ko'rilishi kerak — yorliq boshqa qadamni aytadi | Yorliq matni haqiqiy shartga moslanadi |
| Q9 | **GithubActions · amaliyot** | O'z repo va yashil ✓ talab qilinadi; platforma tekshirmaydi, «Bajardim» o'zi bosiladi — reposiz o'quvchi bajara olmaydi | Zaxira yo'l: repo yo'q bo'lsa nima qilish (mentor bilan birga yoki namunadagi repo) |
| Q10 | **AiPipeline s15** | 5 bo'lakli tartibda vaqt-klapani yo'q — adashgan o'quvchiga yordam chiqmaydi | Boshqa darslardagi kabi «tiqilib qolganda» maslahati qo'shiladi |

**Qayd (o'zgarish taklif qilmayman):** InternetLesson kirish ekranida qaysi variant bosilsa ham «To'g'ri yo'nalish!»
chiqadi — bu ilgak-ekran, to'g'ri/xato yo'q; ball ham bermaydi.

## 6. Ochiq savol (kichik)

Uyga vazifa endi bosqichlar tugashi bilan **o'zi topshiriladi** — o'quvchi «Vazifani topshirish» tugmasini bosishi
shart emas. Agar «o'quvchi o'zi bosib topshirsin» degan qoida muhim bo'lsa, ayting — avtomat topshirishni faqat
sahifadan chiqishda ishlaydigan qilib o'zgartiraman.
