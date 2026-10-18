# Tungi avtopilot — 17.10 (foydalanuvchi uxlayapti, 2–3 soat)

Topshiriq (foydalanuvchi so'zi): «LMS'dagi 6-M gacha halol vaziyatdan kelib ishlaysan, darslardan kelib chiqib; qaysidir darsda fikring yetmasa qoldirasan — kelganimda so'rayman».
Qoidalar: commit yo'q · umumiy fayllarga tegilmaydi · agent yo'q · har dars oldidan zaxira `arxiv/F-1015-<nom>-oldin/` · gates + sinov + RU + rasm · avtopilot har 15 daqiqada (CronCreate, sessiyada).
Har 12 faylda F-1012 navigatsiya diffi (commit qilinmagan) bor — zaxirada saqlanadi, qurishda o'zgartirilmaydi.

## ☀️ 2-tun yakuni (08:00) — hammasi qurildi
- **Avtopilot to'xtatildi (08:12):** navbat tugadi, qolgani faqat sizning javobingizga bog'liq (CronDelete 8e83279d).
- **12/12 praktika qurildi** (LMS 6-modulgacha): ertalabki qarorlaringiz bo'yicha A–H bajarildi — m4a-04 (Copilot Agent), m4c-04 (KitobShop ci.yml), m4c-05 (Copilot Chat: testni o'zgartirish tuzog'i + follow-up), m4c-07 (matrix, kesh, seyf). Har biri: darvozalar (bazadagidek), brauzer sinovi, RU, rasm; 13 dars Vite'da App orqali xatosiz ochiladi.
- **Sinov tutgan xatolar (tuzatildi):** m4c-04 reja ekrani oq edi (`label` tr'siz); eski darsdan qolgan ikki marta chiqadigan jurnal qatori; yakuniy savoldagi «Eslatma» 2 darsda boshqa ekranniki chiqardi (m4c-04, m3-13) — 3 darsda tiklandi.
- **Node versiyasi:** 2026 kuzi — Node 20 qo'llab-quvvatlashdan chiqqan; m4c-04 `node-version: 22`, m4c-07 matrix `[22, 24]`.
- **Drag-drop:** to'ldirilgan to'q sariq chip endi m2-12, m3-11, m4c-04/05/07 da (F-1015-357).
- **Savollar 9–12 — qaror sahifasida (suratlar bilan):** https://claude.ai/artifact/XgwGdLKqiDwgT9AWMdwYqD — 9 m3-12 Tesla/$ ↔ Chevrolet/so'm · 10 m4c-01 takror qator · 11 m4c-07 yakuniy tartib testi · 12 yopilgan m1-10/m2-11 da ham gradient.
- **✅ 10:15 — javob «9 A · 10 A · 11 A · 12 A» qo'llandi (F-1015-358):** m3-12 Chevrolet/Kia + so'm (32/32) · m4c-01 takror qator olindi · m4c-07 yakuniy: Push → Lenta → Staging → Tekshirish → Production (28/28) · m1-10/m2-11 gradient (lekin bu ikki darsda drag-drop hozir ko'rinmaydi). Smoke 16/16.
- **Ko'rish:** http://localhost:5173/#/lesson/m4a-04 (… m4c-04, m4c-05, m4c-07) → «Kodsiz, o'zim ko'raman». Commit qilinmadi.

## ☀️ Uyg'onganingizda — 2 daqiqalik xulosa (01:35 holati)
- **Qurildi (8 dars, hammasi ko'rikka tayyor):** m3-07 · m3-11 · m3-12 · m3-13 · m4-08 · m4-10 · m4-13 · m4-14 (+ kechagi m2-12). Har biri: 19–25 → 8–9 ekran, Antigravity olindi, haqiqiy VS Code + Gemini ishi, jonli maket + «kod oynasi».
- **Qurilmadi (savol kerak):** m4a-04, m4c-04, m4c-05, m4c-07 — pastda «9–12» bo'limida 2 ta savol.
- **Tekshiruv:** har darsda darvozalar (bazadagidan yomon emas), brauzer sinovi, RU yurish, rasm; hammasi App orqali haqiqiy serverda 01-ekrangacha xatosiz ochiladi (`sinov/smoke-tun.mjs`).
- **Qarab chiqish:** http://localhost:5173/#/lesson/m3-07 (… m3-11, m3-12, m3-13, m4-08, m4-10, m4-13, m4-14) → «Kodsiz, o'zim ko'raman».
- **Bitta ip:** m3-07/m3-11 robo-games → m3-12 avto-ijara (cars.json) → m4-08 avto-ijara-server (PostgreSQL) → m4-10 ikkalasini ulash → m4-13 avto-stoyanka → m4-14 sinfdosh fikri bilan yaxshilash.
- **Savollar ro'yxati (qisqa):** ① accent rangli matn kontrasti (umumiy) ② m3-07 a1 va yakuniy test bir xil qatorni so'raydi — almashtiraymi? ③ m3-12 agent o'rniga 2 Gemini prompti — yetarlimi? ④ m3-13 a4 da o'z g'oyasini yozish maydoni kerakmi? ⑤ m4-08 Postman darsi (m4-09) praktikadan keyin turibdi ⑥ m4a-04 vositasi (Gemini yoki Copilot agent) ⑦ m4c lentasi qaysi repoga va deploy qayerga.
- Commit qilinmadi. Zaxiralar `arxiv/F-1015-*-oldin/`. Qurish skriptlari `seans-vositalar/qurish/f343…f351.py` (zaxiradan qayta quradi).

## Ko'rishingiz kerak (avvalgi)
- **m2-12** (F-1015-343) qurilgan, ko'rik kutilmoqda.
- **Umumiy savol (bir marta javob bersangiz, hammasiga qo'llayman):** eski uslubdagi to'q sariq (accent #FF4F28) MATN oq fonda kontrasti 3.28 (kerak 4.5): m2-12 «5 qadam» chiplari, m3-11 menyudagi faol havola va manzil yo'li, m4-08 ko'k GET belgisi (oq matn, 3.24), m4-13 jadvaldagi ajratilgan ustun (joy_id), m4-14 band joy raqami (4.44). Matnni to'qroq rangga (masalan #B3361A) o'tkazaymi yoki brend rangi qolsinmi?

## Navbat
| # | Dars | Fayl | Holat |
|---|---|---|---|
| 1 | m3-07 Praktika: CRUD | src/3-Modull/ReactCrudPracticeLesson.jsx | ✅ qurildi (F-1015-344) — ko'rik |
| 2 | m3-11 Praktika: React Router | src/3-Modull/ReactRouterPracticeLesson.jsx | ✅ qurildi (F-1015-345) — ko'rik |
| 3 | m3-12 Loyiha kuni — AvtoIjara | src/3-Modull/ReactProjectDayLesson.jsx | ✅ qurildi (F-1015-346) — ko'rik |
| 4 | m3-13 Istalgan saytni qurish | src/3-Modull/ReactBuildSiteLesson.jsx | ✅ qurildi (F-1015-347) — ko'rik |
| 5 | m4-08 Backend CRUD — AvtoIjara | src/4-Modull/BackendCrudPracticeLesson.jsx | ✅ qurildi (F-1015-348) — ko'rik |
| 6 | m4-10 Fullstack ulash | src/4-Modull/FullstackConnectPracticeLesson.jsx | ✅ qurildi (F-1015-349) — ko'rik |
| 7 | m4-13 Loyiha kuni — AvtoStoyanka | src/4-Modull/FullstackProjectDayLesson.jsx | ✅ qurildi (F-1015-350) — ko'rik |
| 8 | m4-14 Feedback bilan yaxshilash | src/4-Modull/FullstackFeedbackLesson.jsx | ✅ qurildi (F-1015-351) — ko'rik |
| 9 | m4a-04 KitobShop backend | src/4a-Modull/NestArchPracticeLesson.jsx | ✅ qurildi (F-1015-353) — ko'rik |
| 10 | m4c-04 Loyiha kuni — to'liq lenta | src/4c-Modull/FullPipelineProjectLesson.jsx | ✅ qurildi (F-1015-354) — ko'rik |
| 11 | m4c-05 AI bilan lentani boshqarish | src/4c-Modull/AiPipelineProjectLesson.jsx | ✅ qurildi (F-1015-355) — ko'rik |
| 12 | m4c-07 Loyiha kuni: ishonchli lenta | src/4c-Modull/FullProPipelineLesson.jsx | ✅ qurildi (F-1015-356) — ko'rik |

## Darslar bo'yicha natija
(har dars tugaganda shu yerga: nima topildi · nima qurildi · qayerga qarash · savollar)

### 1 · m3-07 «Praktika: CRUD» — F-1015-344 · 22 → 8 ekran · ✅ qurildi
- **Topildi:** 22 ekran (5 MCQ, akvarium, 3 ta «checkpoint», 4 ta tushuntirish, «agentga ayting» simulyatsiyasi, kartochkalar), uyga vazifa Antigravity bilan.
  Ip: o'quvchilar m3-03 dan beri `robo-games` (Vite) loyihasida — GameCard + games ro'yxati; bu darsda shu davom etadi.
- **Qurildi:** kirish (o'zgarmadi) · **reja** — ishlaydigan namuna (qo'shish/TOP/✕ bosiladi), CRUD 4 amal jadvali, 3 blok, «Avval tayyorlaning» (robo-games + npm run dev, App.jsx/GameCard.jsx, Gemini) ·
  **a1 qo'shish (AI'siz)** — o'yin tanlab qo'shiladi, kod oynasi: `setGames([...games, {…}])` va `games = [...]`; o'ng tomonda VS Code'da 5 qadam + «Qotib qoldingizmi? Kodni ko'rish» ·
  **a2 TOP va o'chirish (Gemini)** — bosiladigan ilova + kod oynasi (map {...g} / filter), prompt (map, confirm, filter, push/splice yo'q), «Tekshiring» 3 band ·
  **a3 AI xatosi** — eski push-mutatsiya ekrani (o'zgarmadi, eyebrow «Amaliyot 3 · AI xatosi») · **s14** yakuniy (o'zgarmadi, yagona ballik) · podium · **yakun** (uyga vazifa: like map bilan, bo'sh nom, tekshiring; Antigravity olindi).
- Nishonlar: Full CRUD! (a2 Davom) · Nice Catch! (a3) · Ship It! (s14) · Level Up! (yakun) — o'zgarmadi.
- Tuzatildi yo'l-yo'lakay: faol «🔥 TOP» tugmasi kontrasti (2.79 → #B3361A), yordam ichidagi kod rangi.
- **Sinov:** gates 10/12 (tell, emoji — eski arena/statistika) · `sinov/tekshir-m307.mjs` 31/31 · RU 8 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-reactcrud-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m3-07 · **Savol:** a1 da o'quvchi qo'shishni o'zi yozadi va s14 yakuniy ham shu qatorni so'raydi — takror bo'lsa, s14 o'rniga boshqa yakuniy (masalan, filter qatori) qo'yaymi?

### 2 · m3-11 «Praktika: React Router» — F-1015-345 · 22 → 8 ekran · ✅ qurildi
- **Topildi:** 22 ekran (5 MCQ, sudrab-joylash xaritasi, «warp-portal» olami, 3 «checkpoint», agent simulyatsiyasi, kartochkalar), uyga vazifa Antigravity bilan. Ip — `robo-games` (m3-07 dan).
- **Qurildi:** kirish (o'zgarmadi) · **reja** — bosiladigan 3 sahifali namuna (menyu, kartochka → /game/3), «Manzil → sahifa» jadvali, 3 blok, «Avval tayyorlaning» (npm run dev, npm install react-router-dom, Gemini) ·
  **a1 sahifalar ro'yxati (AI'siz)** — ilovada menyu/kartochka bosiladi, kod oynasida URL, 3 ta `<Route>` (mos kelgani yashil) va `useParams() // { id: "4" }`; VS Code 5 qadam + yordam kodi ·
  **a2 GamePage va AddPage (Gemini)** — kartochka → `useParams`, `find` qiymati; «/game/99 ni ochish» → «O'yin topilmadi»; formada «Saqlash» → `navigate("/")`, yangi o'yin Bosh sahifada; prompt + «Tekshiring» 4 band ·
  **a3** eski `<a>` → `<Link>` xatosi (eyebrow «Amaliyot 3 · AI xatosi») · **s14** yakuniy Route qatori (o'zgarmadi) · podium · **yakun** (uyga vazifa: 404 sahifa, «Orqaga» tugmasi useNavigate bilan, tekshiring).
- **Sinov:** gates 10/12 (baza) · `sinov/tekshir-m311.mjs` 30/31 (yiqilgani — eski accent matn 3.28, yuqoridagi umumiy savol) · RU 8 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-reactrouter-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m3-11

### 3 · m3-12 «Loyiha kuni — AvtoIjara» — F-1015-346 · 23 → 8 ekran · ✅ qurildi
- **Topildi:** butun dars Antigravity agentiga qurilgan («jamoangizdagi agent — Antigravity», «AgentBuild» simulyatsiyasi), 5 MCQ, 4 «checkpoint», transfer ekrani, kartochkalar; arenada 3 savol agent haqida.
- **Qaror (o'zim):** agent o'rniga **2 ta Gemini prompti** (bitta qism — bitta prompt). Katalog `public/cars.json` + `fetch` (m3-08 dagi `/games.json` yo'li — haqiqatda ishlaydi). Qo'shish (POST) — server yo'q, shuning uchun uyga vazifaga state bilan.
- **Qurildi:** kirish (o'zgarmadi) · **reja** — to'liq AvtoIjara namunasi (katalog → mashina → kun −/+ → ijara → «Mening ijaralarim», jami), 3 sahifa jadvali, 3 blok, «Avval tayyorlaning» (npm create vite avto-ijara, react-router-dom, Gemini) ·
  **a1 katalog + mashina sahifasi (Gemini)** — bosiladigan natija, kod oynasi (`fetch("/cars.json")`, `cars.length`, `useParams`, `find`), `public/cars.json` nusxasi (haqiqiy JSON), prompt ·
  **a2 ijara + jami (Gemini)** — kun tanlash (1 dan pastga tushmaydi), ijara → /bookings, kod oynasi (`price * days`, `jami = 760; // for: 80*2 + 200*3`, `setBookings`), prompt, «Tekshiring» ($240, $760) ·
  **a3** eski «kun unutilgan» xatosi (matnda «Agent» → «AI») · **s14** `b.price * b.days` (o'zgarmadi; a2 prompti shu nomlarni ishlatadi) · podium · **yakun** (takrorlashdagi agent bandi almashtirildi; uyga vazifa: mashina qo'shish, ijarani bekor qilish filter bilan, tekshiring).
- Arena: Q2 «AI bilan qurish tartibi» (✔ qism → prompt → tekshirish → tuzatish), Q3 «AI'ning birinchi javobi to'liq bo'lmasa», Q12 «Men boshliq — AI quradi» — to'g'ri o'rinlar o'zgarmadi. Nishon «In Command!» matni: «Gemini'ga aniq prompt berib katalogni qurdingiz».
- **Sinov:** gates 10/12 (baza) · `sinov/tekshir-m312.mjs` 29/29 · RU 8 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-reactprojectday-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m3-12 · **Savol:** agent o'rniga Gemini (2 prompt) qarori to'g'rimi? Uyda Antigravity bo'lmasa ham ishlaydi, lekin «loyiha kuni» uchun 2 prompt kam tuyulsa, 3-promptni (mashina qo'shish) darsning o'ziga qaytaraman.

### 4 · m3-13 «Istalgan saytni qurish» — F-1015-347 · 20 → 9 ekran · ✅ qurildi
- **Topildi:** 20 ekran (5 MCQ, sahifa tanlash, rentgen, «ma'lumot qayerda», agent simulyatsiyasi «Qurar-bot» bilan, bitiruv yo'li, kartochkalar); amaliy topshiriq va uyga vazifada Antigravity.
- **Qurildi (9 ekran — m2-09 kabi 4 amaliyot):** kirish (o'zgarmadi) · **reja** — «Istalgan sayt — bir xil yo'l», Yetkaz namunasi, yo'l 4 qadam, 4 blok, «Avval tayyorlaning» (npm create vite yetkaz, components, Gemini) ·
  **a1** eski «bo'limlarni toping» (eyebrow «Amaliyot 1 · AI'siz») · **a2 Yetkaz uchun aniq prompt (Gemini)** — 3 aniqlik tugmasi, o'lchagich 0→100%, natija jonli aniqlashadi (taxmin → bo'limlar → narxlar), prompt har aniqlikda o'sadi ·
  **a3** eski «narx unutilgan» (Qurar-bot → «Gemini», «Agent» → «Gemini») · **a4 o'z saytingiz** — 4 g'oya (Retseptlar, O'yinlar, Kutubxona, Sport klub) → bo'laklar (sahifalar, bo'limlar, takrorlanuvchi karta) + VS Code 3 qadam + tayyor prompt ·
  **s14** `function TaomCard(props) {` (o'zgarmadi) · podium · **yakun** (uyga vazifa: «Gemini bilan bo'lim-bo'lim quring»).
- **Sinov:** gates 10/12 (baza) · `sinov/tekshir-m313.mjs` 26/26 · RU 9 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-reactbuildsite-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m3-13 · **Savol:** a4 da o'quvchi o'z g'oyasini yozadigan maydon (4 tadan tashqari) kerakmi?

### 5 · m4-08 «Backend CRUD — AvtoIjara» — F-1015-348 · 19 → 8 ekran · ✅ qurildi
- **Topildi:** 19 ekran («rol pasporti» ME'MOR/REJISSYOR/NAZORATCHI, 4 MCQ, pg ko'prik, POST/PUT/DELETE tushuntirishlari, doimiylik qoidasi, jonli praktika, kartochkalar); uyga vazifa Antigravity bilan.
- **Qurildi:** kirish (o'zgarmadi) · **reja** — «Mashinalar endi bazada yashaydi», Postman GET javobi namunasi, so'rov yo'li (Postman → Express → pool.query → PostgreSQL), 3 blok, «Avval tayyorlaning» (avto-ijara-server, npm install express pg, psql) ·
  **a1 cars jadvali (AI'siz)** — ustun tanlash (nom va narx shart, yil va bandmi ixtiyoriy) → CREATE TABLE + INSERT + SELECT o'zi yig'iladi, nusxalash, psql'da 4 qadam ·
  **a2 server (Gemini)** — Postman maketi: GET/POST/PUT/DELETE yuborilsa jadval o'zgaradi (201, 404 ham), kod oynasida `pool.query(... $1 ...)`; prompt (Pool, express.json, 4 endpoint, faqat $1/$2, 500, port 3000) ·
  **a3** eski «column price does not exist» · **s12** pool.query testi (yagona ballik) · podium · **yakun** (uyga vazifa: ALTER TABLE ustun, GET /api/cars/:id + 404, Postman test).
- Nishonlar: Blueprint! (a1) · Director's Cut! (a2) · Nice Catch! (a3) · Ship It! (s12 birinchi urinish) — matnlar moslandi.
- **Sinov:** gates 10/12 (baza) · `sinov/tekshir-m408.mjs` 28/29 (yiqilgani — eski ko'k GET belgisi 3.24, umumiy savol) · RU 8 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-backendcrud-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m4-08
- **Savol:** dasturda «API va Postman» darsi (m4-09) bu praktikadan **keyin** turibdi, lekin praktika Postman'ni ishlatadi (eski darsda ham shunday edi). Tartibni almashtiramizmi yoki m4-08 da faqat brauzerda GET + Postman'ni ustoz ko'rsatadimi?

### 6 · m4-10 «Fullstack ulash — AvtoIjara» — F-1015-349 · 20 → 8 ekran · ✅ qurildi
- **Topildi:** 20 ekran (rol pasporti, 4 MCQ, ikki dastur, fetch anatomiyasi, holatlar, CORS, forma, to'liq aylana, qoida, jonli praktika, kartochkalar); uyga vazifada Antigravity.
- **Ip:** front — m3-12 da qurilgan `avto-ijara` (hozir `cars.json` dan o'qiydi), back — m4-08 dagi `avto-ijara-server`. Haqiqiy nomuvofiqlik: frontda `name/price`, serverda `nom/narx` — a3 da Gemini moslaydi.
- **Qurildi:** kirish (o'zgarmadi) · **reja** — «Sayt va server gaplashadi», namunada Spark serverdan, :5173/:3000 jadvali, 3 blok, «Avval tayyorlaning» (ikki terminal, Gemini) ·
  **a1 serverga ulash (AI'siz)** — terminal maketi, ikki tugma: `fetch('/cars.json')` (eski — Spark yo'q) ↔ `fetch('http://localhost:3000/api/cars')` (xato + konsolda CORS), yangi qator nusxasi, 4 qadam ·
  **a2** eski CORS ekrani («Amaliyot 2 · CORS») · **a3 maydonlar, 3 holat, forma (Gemini)** — Yuklanmoqda/Xato/Tayyor tugmalari, forma bilan qo'shish (POST, kod oynasi), prompt + «Tekshiring» 4 band ·
  **s14** test (yagona ballik) · podium · **yakun** (uyga vazifa: ✕ bilan DELETE, holatlar, forma).
- Nishonlar: Connected! (a1) · Both Online! (CORS) · Full Stack! (a3) · Full Circle! (s14 birinchi urinish).
- **Sinov:** gates 11/12 (faqat tell — eski arena) · `sinov/tekshir-m410.mjs` 28/28 · RU 8 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-fullstackconnect-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m4-10

### 7 · m4-13 «Loyiha kuni — AvtoStoyanka» — F-1015-350 · 25 → 9 ekran · ✅ qurildi
- **Topildi:** 25 ekran (PM/UX qoidalari, 2 jadval tushuntirishi, bog'lanish, 4 MCQ, 4 «checkpoint», backend/front prompt namoyishlari, to'liq panel, xulosa, kartochkalar); «jamoangizdagi agent — Antigravity».
- **Qurildi (9 ekran):** kirish (qorovul qog'ozi, o'zgarmadi) · **reja** — qorovul paneli namunasi, «Ikki jadval — bitta bog'lanish», 4 blok, «Avval tayyorlaning» (server: express pg cors, front: vite) ·
  **a1 baza (AI'siz)** — joyni bosganda uning sessiyalari yonadi (bitta → ko'p), kod oynasi `WHERE joy_id = …`, to'liq SQL (2 jadval, REFERENCES, 8 joy) nusxasi, psql 4 qadam (FK sinovi bilan) ·
  **a2 server (Gemini)** — panelda bo'sh joy → kirish (UPDATE + INSERT), band → chiqish (UPDATE + tolov), tushum; prompt (4 endpoint, chiqqan IS NULL, SUM) ·
  **a3 qorovul paneli (Gemini)** — bo'sh joy → raqam formasi → Kirgizish (POST), band → Chiqarish (PUT), tushum; prompt (fetch, rang, forma, qayta yuklash) ·
  **a4** eski JOIN ekrani («Amaliyot 4 · JOIN») · **s16** JOIN ON (yagona ballik, o'zgarmadi) · podium · **yakun** (uyga vazifa o'zgarmadi: yangi joylar, vaqtga qarab to'lov, tushum hisoboti).
- **Sinov:** gates 11/12 (faqat emoji — eski) · `sinov/tekshir-m413.mjs` 30/31 (yiqilgani — eski jadval accent rangi, umumiy savol) · RU 9 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-fullstackprojectday-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m4-13

### 8 · m4-14 «Feedback bilan yaxshilash» — F-1015-351 · 21 → 8 ekran · ✅ qurildi
- **Topildi:** 21 ekran (aniq/umumiy fikr, 4 fikrni yig'ish, 4 MCQ, 3 upgrade tushuntirishi, sozlamalar, sayohat, qoida, jonli praktika, kartochkalar); «agent — Antigravity»; **o'ylab topilgan sinfdoshlar Aziz, Laylo, Bek, Diana** (personaj qoidasiga zid).
- **Qurildi:** kirish (ismlar olindi: «sinfdosh») · **reja** — «Ko'rsating, fikr oling, yaxshilang», dashboardli panel namunasi, sikl 5 qadam, 3 blok, «Avval tayyorlaning» (panel ishlab tursin, juft bo'lish) ·
  **a1 sinfdoshdan fikr (haqiqiy)** — 3 savol, 3 ta fikr maydoni, har biri «Aniq/Umumiy», umumiy bo'lsa «Qayta so'rang…» maslahati, saqlanadi (`ccStoyankaFikr`) ·
  **a2** eski foyda/mehnat doskasi («1-fikr…4-fikr», eyebrow «Amaliyot 2 · saralash») · **a3 upgrade (Gemini)** — Tasdiq/Dashboard/Narx sozlamasi tugmalari, panelda sinash (tasdiq so'raydi, bekor qilish, narx 15 000 bilan tushum), prompt ichiga a1 dagi **aniq** fikrlar qo'shiladi ·
  **s16** `confirm` (yagona ballik) · podium · **yakun** (uyga vazifa o'zgarmadi: fikr yig'ing, saralang, bitta upgrade).
- **Sinov:** gates 10/12 (baza) · `sinov/tekshir-m414.mjs` 26/27 (yiqilgani — eski band joy raqami 4.44) · RU 8 ekran toza · rasmlar ko'z bilan. Zaxira `arxiv/F-1015-fullstackfeedback-oldin/`.
- **Ko'ring:** http://localhost:5173/#/lesson/m4-14

### 9–12 · LMS 6 (NestJS + CI/CD) — ⏸ qurilmadi: fikrim yetmagan joylar, qaroringiz kerak
Kodga tegilmadi (m4a-04 zaxirasi olingan: `arxiv/F-1015-nestarch-oldin/`, o'zgarishsiz). Hammasi hozirgi holatda ishlaydi.

**m4a-04 «Praktika — KitobShop backend»** (23 ekran). Loyiha m4a-01 dagi tayyor repodan `git clone` (BaseService, Swagger «Try it out»); darsda agent «playbook» bilan 3 resursni (Category, Book, Order) bir nechta faylga yozadi (entity, dto, service, controller, AppModule).
- Muammo: Antigravity (18+) — agent ko'p faylni o'zi tahrirlaydi. Gemini chatida esa o'quvchi har resursga 4–5 faylni nusxalab olib-qo'yishi kerak.
- **Savol 1:** qaysi yo'l? (A) Gemini — har resursga bitta prompt, javobdagi fayllarni o'quvchi qo'yadi (sekinroq, lekin hamma uchun ochiq) · (B) VS Code'dagi Copilot Chat «Agent» rejimi — ko'p faylni o'zi tahrirlaydi (Copilot m2 dan beri o'rnatilgan; bepul limit bor) · (C) boshqa.
- Taklif tuzilmasi (javobingizdan keyin): kirish · reja · a1 Category — o'zingiz (m4a-03 dagi qadamlar, AI'siz) · a2 Book + @ManyToOne (AI) · a3 Order + @Roles (AI) · a4 «bironta buyurtma kelmayapti» xato ovi (eski s14) · test · podium · yakun.

**m4c-04 «Loyiha kuni — to'liq lenta»** (18 ekran, «uchish lentasi» metaforasi: Yig'ish → Skaner → O'lcham ramkasi → O'rash → Uchirish), **m4c-07 «Ishonchli lenta»** (20 ekran: matrix, cache, secrets, staging→production, rollback).
- Muammo: amaliy qism — o'quvchi o'z repo'siga `.github/workflows/*.yml` yozadi. Qaysi repo (m4a dagi KitobShop? m4-08 dagi avto-ijara-server?) va «Uchirish» (deploy) qayerga — darslarda aniq platforma yo'q (Render/Railway/Vercel topilmadi).
- **Savol 2:** lenta qaysi loyihaga ulanadi va deploy bosqichi haqiqiy bo'ladimi (qaysi xizmat) yoki «uchirish» faqat build bilan tugaydimi?
- Taklif (m4c-04): kirish · reja · a1 yo'l xaritasini o'zingiz yozish (install → lint → test → build; YAML nusxa + jonli «tablo») · a2 xato jurnalini o'qish (eski «TABLO qizil») · a3 Gemini bilan deploy qadami + maxfiy kalit · test · podium · yakun.

**m4c-05 «AI bilan lentani boshqarish»** (20 ekran): «Lenta yordamchisi» = Antigravity (6 joyda).
- Bu yerda ishonchim yuqoriroq: yordamchi o'rniga Gemini — o'quvchi qizil jurnalni nusxalab, aniq so'rov yozadi, javobni o'zi tekshiradi (yordamchi ba'zan adashadi — darsning asosiy g'oyasi saqlanadi). Lekin m4c-04/07 bilan bir ip bo'lishi kerak — Savol 2 javobidan keyin uchalasini birga quraman.

---
## 🔁 2-tun · 17.10 ~06:50 — foydalanuvchi qarorlari (qaror sahifasi https://claude.ai/artifact/XgwGdLKqiDwgT9AWMdwYqD)
1 → **A**: to'qroq matn `#B3361A` faqat praktikalarda. Qo'shimcha: **drag-drop chipi — to'q sariq gradient + oq matn + ⠿** (F-1002-59 qarori; m2-12 da oq variant qolib ketgan) — qaytariladi.
2 → ha: m3-07 yakuniy test → `filter` qatori. · 3 → m3-12 2 prompt qoladi. · 4 → m3-13 a4 ga «O'z g'oyam». · 5 → **A**: nazorat seansiga topshiriq (App.jsx + mentor menyusi, m4-08 ↔ m4-09).
6 → m4a-04 Copilot Chat «Agent» rejimi. · 7 → **A**: KitobShop, lenta install → lint → test → build, deploy maketda. · 8 → m4c-05 Copilot Chat.

### 2-tun navbati
| # | Ish | Holat |
|---|---|---|
| A | Rang: m3-11 menyu/manzil, m4-08 GET, m4-13 jadval ustuni, m4-14 band raqam → to'qroq; m2-12 drag-drop → gradient | ✅ (sinovlar: m212 46/46 · m311 31/31 · m408 29/29 · m413 31/31 · m414 27/27 — kontrast ham toza) |
| B | m3-07 yakuniy test → filter qatori | ✅ (`ochirish(id)` ichiga `setGames(games.filter(g => g.id !== id))`, splice eslatmasi; m307 31/31, RU toza) |
| C | m3-13 a4 «O'z g'oyam» | ✅ (sayt nomi + kartada nima → papka nomi, ElementCard, prompt; m313 28/28, RU toza) |
| D | m4-08 ↔ m4-09 tartibi — nazorat seansiga topshiriq fayli | ✅ `feedback/F-1015-amaliyot/NAZORAT-TOPSHIRIQ-m4-tartib.md` (App.jsx 300–301, mentor/lessons.jsx 167–168). Nazoratga «bajar» deysiz; LMS tartibi — siz qo'lda |
| E | m4a-04 KitobShop — Copilot agent | ✅ F-1015-353: 23 → 9 ekran (reja · a1 aniq buyruq · **a2 Copilot «Agent» — 3 playbook + 4 bandli tekshiruv + Swagger** · a3 @Roles · a4 eshik sinovi · test · podium · yakun). m4a04 27/27, RU toza. Zaxira `arxiv/F-1015-nestarch-oldin/` |
| F | m4c-04 to'liq lenta (KitobShop, deploysiz) | ✅ F-1015-354: 8 ekran (reja · a1 lenta quruvchisi · **a2 KitobShop'ga ci.yml + «git push» maketi — 5 nuqta yonadi, lint xatosi kiritilsa qizil TABLO** · a3 qizil jurnal · test · podium · yakun). m4c04 23/23, RU toza. Sinov reja ekranidagi oq ekran xatosini tutdi (tuzatildi). Zaxira `arxiv/F-1015-fullpipeline-oldin/` |
| G | m4c-05 AI yordamchi → Copilot Chat | ✅ F-1015-355: 20 → 7 ekran (reja · a1 Copilot adashadi — o'yin · **a2 KitobShop qizil testi: Copilot avval testni o'zgartiradi → «Undo» → aniqlashtiruvchi so'rov → order.ts tuzatiladi → yashil** · tartib testi · podium · yakun). «Lenta yordamchisi»/Antigravity → Copilot. m4c05 29/29, RU toza. Zaxira `arxiv/F-1015-aipipeline-oldin/` |
| + | Sinf: yakuniy savoldagi «Eslatma» noto'g'ri ekrandan chiqardi | ✅ m4c-04, m3-13 tuzatildi; m4a-04, m4-10, m4-13 da eslatma tiklandi (hammasi sinovdan o'tdi) |
| H | m4c-07 ishonchli lenta (KitobShop, deploy maketda) | ✅ F-1015-356: 20 → 7 ekran (reja · a1 4 yaxshilash + rollback — maket · **a2 KitobShop ci.yml: matrix Node 22/24, `cache: npm`, `JWT_SECRET` seyfdan; push maketi — 2 ish birga, 2-push'da kesh 38s → 6s, kalit `***`; kalitni ochiq yozsa ogohlantirish** · tartib testi · podium · yakun). m4c07 23/23, RU toza. Zaxira `arxiv/F-1015-fullpro-oldin/` |

**Yo'l-yo'lakay (ip):** m4-10 kirishi «Praktika 1'da Postman orqali bazaga Chevrolet Spark'ni qo'shgan edingiz» deydi — m4-08 ma'lumoti shunga moslandi (Chevrolet Cobalt, Malibu, Kia K5; POST → Chevrolet Spark). m4-08 29/29.
**Yangi savol (11):** m4c-07 yakuniy testi (eski darsdan) «Matrix → Cache → Secret → Staging → Production» tartibini so'raydi. Staging → Production tartibi to'g'ri, lekin `ci.yml` da matrix, cache va secret qatorlarining tartibi aslida ixtiyoriy — o'quvchi to'g'ri o'ylasa ham «xato» olishi mumkin. Testni «Push → Lenta (matrix+kesh+seyf) → Staging → Tekshirish → Production» ga almashtiraymi yoki shunday qolsinmi?

**Yangi savol (10):** m4c-01 «CI/CD nima» darsida (praktika emas, tegmadim) lenta jurnalida «✈️ Uchirish — samolyot ko'tarildi» qatori ikki marta chiqadi — m4c-04 da tuzatdim. m4c-01 da ham bir qatorni olib tashlaymi?

**Yangi savol (9):** m3-12 frontidagi mashinalar Tesla/Lamborghini ($), 4-modulda esa Chevrolet (so'm). Bir xil qilaymi (m3-12 ni Chevrolet + so'mga)? Bu m3-12 dagi xato ekrani ($760 misoli), yakuniy test va arenaga tegadi — javobingizni kutaman.
