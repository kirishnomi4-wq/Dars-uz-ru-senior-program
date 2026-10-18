# 3-Modul m3-11 «Praktika: React Router — ko'p sahifali ilova» — yakuniy matn

Fayl: `src/3-Modull/ReactRouterPracticeLesson.jsx` · 8 ekran · Oldingi: «Qachon «tayyor» deb ayta olamiz?» (m3-10, PM) · Keyingi: «Praktika: Loyiha kuni — AvtoIjara» (m3-12)
Ip: `robo-games` (m3-07 dan) — 3 sahifa: Bosh, O'yin (`/game/:id`), Qo'shish (`/add`) · AI: Gemini (Antigravity ishlatilmaydi)
Holat: 2026-10-17 — kodga mos (F-1015-345 → 357 → 369 → 370…374 dan keyin; foydalanuvchi ko'rigi «yaxshi», tasdiq). `lessonId` = `react-router-practice-p2-v18` (o'zgarmagan)
Zaxira: 22 ekranli — `arxiv/F-1015-reactrouter-oldin/`. Qurish: `qurish/f345.py` (zaxiradan) → `f367.py` (369) → `f370.py` → `f371.py` (joyida).

## 0 · Kirish
- Sarlavha: Sahifalar orasida o'tganda nega ekran oqarib ketdi?
- Mentor: Robo-games hozir bitta sahifa. Lekin haqiqiy ilovada "Bosh", "O'yin", "Qo'shish" sahifalari bor. Menyudagi havolani bosib ko'ring — diqqat qiling: sahifa qanday ochiladi?
- «Eski usul — har bosishda qayta yuklanadi» (🏠 Bosh · 🎮 O'yin · ➕ Qo'shish, robo-games.uz)
- «Instagram va Roblox sahifalar orasida bir zumda o'tadi. Nega?» (ballsiz): Har sahifa alohida HTML fayl — qayta yuklanaveradi · ✔ React Router — sahifani qayta yuklamay, faqat kerakli qismni almashtiradi · Internet juda tez bo'lgani uchun
- Javob (216-qonun, F-1015-393; avval har variantga «Aynan!» chiqardi): HTML fayl → «Ana shu eski usul — har bosishda qayta yuklaydi.» · Router → «Aynan! Router faqat kerakli qismni almashtiradi.» · internet → «Internet emas — Router faqat kerakli qismni almashtiradi.» + «Bugun robo-games'ni ko'p sahifali qilamiz.»

## 1 · Reja
- Sarlavha: robo-games **3 sahifali** bo'ladi.
- Mentor: Bugun ilovangizga Bosh, O'yin va Qo'shish sahifalari qo'shiladi va ular orasida ekran oqarmasdan yuriladi. Sahifalar ro'yxatini o'zingiz yozasiz, o'yin sahifasi va formani Gemini bilan qurasiz.
- «Avval tayyorlaning · 3 qadam ▾» (oyna): 1. VS Code'da `robo-games` papkasini oching, terminalda `npm run dev` — localhost:5173 ochiladimi? · 2. Ikkinchi terminalda: `npm install react-router-dom`. · 3. Boshqa oynada gemini.google.com'ni oching. · «Tayyor bo'lsa — «Boshlaymiz».»
- Chapda «Dars oxirida · bosib ko'ring» — 3 sahifali namuna (menyu, kartochka → `/game/3`).
- O'ngda «Manzil → sahifa»: `/` Bosh `<Home />` · `/game/:id` O'yin `<GamePage />` · `/add` Qo'shish `<AddPage />` · «Bugungi 3 blok»: 01 Sahifalar ro'yxati (o'zingiz · VS Code) · 02 O'yin sahifasi va qo'shish (Gemini) · 03 AI xatosini topish (siz)

## 2 · Amaliyot 1 · AI'siz — sahifalar ro'yxati (a1)
- Sarlavha: Sahifalar **ro'yxatini** yozing.
- Mentor: Har `<Route>` — bitta qator: manzil (`path`) va sahifa (`element`). Menyu va kartochkalarni bosing: kod oynasida qaysi qator mos kelganini ko'rasiz. Keyin VS Code'da o'zingiz yozasiz. (bosishda yig'iladi)
- Chapda «Ilova · bosib ko'ring» (blok o'ng karta bilan bir chiziqdan, F-1015-371) — manzil satri, menyu, kartochkalar; ostida «App.jsx · qiymatlar hozir» — har bosishda yonadi:
```
// oxirgi amal
<Link to="/game/1">
// hozir
URL = "/game/1";
<Route path="/" element={<Home />} />
<Route path="/game/:id" element={<GamePage />} />  // mos keldi
<Route path="/add" element={<AddPage />} />
useParams();  // { id: "1" }
```
- O'ngda «VS Code'da · robo-games» (5 qadam): 1. `main.jsx` da `<App />` ni `<BrowserRouter>` ichiga oling (import — `react-router-dom` dan). · 2. `src/pages` papkasida `Home.jsx`, `GamePage.jsx`, `AddPage.jsx` — hozircha har birida bitta sarlavha. · 3. `App.jsx` da `<Routes>` ichiga 3 ta `<Route>`: `/` → Home, `/game/:id` → GamePage, `/add` → AddPage. · 4. Tepaga menyu: `<Link to="/">` va `<Link to="/add">` — `<a>` emas. · 5. Saqlang — menyuni bosing: manzil o'zgaradimi, ekran oqarmaydimi?
- «Qotib qoldingizmi? Kodni ko'rish ▸»:
```
// main.jsx
import { BrowserRouter } from 'react-router-dom';
<BrowserRouter><App /></BrowserRouter>
// App.jsx
import { Routes, Route, Link } from 'react-router-dom';
<nav>
  <Link to="/">Bosh</Link> <Link to="/add">Qo'shish</Link>
</nav>
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/game/:id" element={<GamePage />} />
  <Route path="/add" element={<AddPage />} />
</Routes>
```

## 3 · Amaliyot 2 · Gemini — GamePage va AddPage (a2)
- Sarlavha: O'yin sahifasi va formani **Gemini** bilan quring.
- Mentor: Bitta `GamePage` istalgan o'yinni ko'rsatadi: `useParams()` manzildagi `:id`'ni beradi. Formadan keyin esa havola bosilmaydi — kodning o'zi `navigate("/")` bilan Bosh sahifaga qaytaradi. (bosishda yig'iladi)
- Chapda «Ilova · bosib ko'ring» — kartochka → `/game/:id`; «/game/99 ni ochish» → «O'yin topilmadi»; Qo'shish formasi «O'yin nomi» + Saqlash → Bosh sahifada yangi o'yin. Ostida **«Tekshiring»**: Kartochka bosilsa manzil `/game/3` bo'ladimi, o'sha o'yin chiqadimi? · Manzilga `/game/99` yozing — «O'yin topilmadi» chiqadimi? · «Saqlash»dan keyin Bosh sahifada yangi o'yin turibdimi? · Kodda `<a href>` yo'qmi — hammasi `<Link>`mi?
- O'ngda: **Prompt** («Promptni nusxalash» → bitta qatorga yig'iladi):
```
React loyihamda (robo-games) react-router-dom bor, App.jsx da 3 ta Route: /, /game/:id, /add. Ikki sahifani to'ldir:
1. GamePage: useParams() bilan id'ni olsin va games ro'yxatidan shu o'yinni find bilan topib, nomi va tavsifini ko'rsatsin. Topilmasa «O'yin topilmadi» deb yozsin.
2. Bosh sahifadagi har kartochka <Link to={`/game/${g.id}`}> bilan o'sha sahifaga olib borsin.
3. AddPage: o'yin nomi kiritiladigan forma. «Saqlash» bosilganda o'yin setGames([...games, yangi]) bilan qo'shilsin va useNavigate() bilan Bosh sahifaga qaytsin.
games state App.jsx da qolsin, sahifalarga props bilan uzatilsin. <a href> ishlatma — faqat <Link>.
Har bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.
Mana kodim:
{main.jsx, App.jsx va sahifalar kodini shu yerga qo'ying}
```
  - «App.jsx · qiymatlar hozir» (prompt ostida; `URL`, `useParams`, `games.find(...)`, `navigate("/")`, `games.length`) — har bosishda yonadi.
  - «Qadamlar · 4 ▾» (oyna, F-1015-372): Chapdagi ilovada kartochkani oching va «Qo'shish»da o'yin saqlang — kod oynasida useParams va navigate'ni ko'ring. · «Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiriga `main.jsx`, `App.jsx` va sahifalar kodini qo'shing va yuboring. · Javobdagi fayllarni almashtiring, `Ctrl+S`. · «Tekshiring» ro'yxatini brauzerda o'ting.
- Nishon «Router Built!».

## 4 · Amaliyot 3 · AI xatosi (eski ekran)
- Sarlavha: AI yordam beradi — siz esa tekshirasiz.
- Mentor: AI menyuni bir zumda yozib berdi — lekin menyudagi havolalardan birini bosganda ilova oqarib, qayta yuklanyapti! Holat ham yo'qoladi. … qaysi qator bunga sabab? Toping va bosing.
- AI kodi: `<Link to="/">Bosh</Link>` · ✔ `<a href="/add">Qo'shish</a>` · `<Link to="/game/1">O'yin</Link>` · Nishon «Nice Catch!».

## 5 · Yakuniy · amaliy (yagona ballik)
- Sarlavha: Oxirgi qadam: Qo'shish sahifasini ro'yxatga ulang.
- Mentor: VS Code'da `App.jsx` ochiq: Bosh va O'yin route'lari tayyor — faqat 4-qator bo'sh. `/add` manzilini `AddPage` sahifasiga bog'laydigan bitta Route qatorini yozing: manzil (`path`) va sahifa (`element`).
- Yorliqlar: 1 Route tegi · 2 manzil · 3 sahifa · O'ngda «Natija — robo-games.uz»: «/add sahifasi hali ulanmagan» → to'g'ri bo'lsa ulanadi.
- To'g'ri: `<Route path="/add" element={<AddPage />} />` — manzil harfi va qo'shtirnoq farqsiz (`"/Add"`, `'/add'` ham, 211-qonun); `<route` → «Teg nomi **Katta harf** bilan: `<Route`»; `addPage` → «Deyarli to'g'ri! JavaScript katta-kichik harfni farqlaydi: `<AddPage />` — aynan shunday yozing.»
- Nishon «Route Master!».

## 6 · Podium · 7 · Yakun
- «Kim g'olib?» (mustaqil rejimda podium izohi).
- «✓ Praktika tugadi» · «N/1 to'g'ri» · Ko'p sahifali ilovangiz tayyor.
- «Endi siz bilasiz»: Route = manzil → sahifa: `<Route path="/add" element={<AddPage />} />` · `<Routes>` URL'ga qarab qaysi sahifani ko'rsatishni tanlaydi · `<Link to>` qayta yuklamaydi — `<a href>` esa yuklaydi · URL parametr `/game/:id` — bitta sahifa, barcha o'yinlar (`useParams`) · `useNavigate()` — kod orqali sahifa almashtirish (POST'dan keyin Bosh'ga)
- Uyga vazifa (VS Code'da, `robo-games` loyihangizda): **404 sahifa** — `<Route path="*">` bilan «Bunday sahifa yo'q» sahifasini qo'shing (F-1015-374: avval «404 sahifa NaN» chiqardi — tuzatildi) · **«Orqaga» tugmasi** — o'yin sahifasiga useNavigate bilan Bosh sahifaga qaytaradigan tugma qo'ying · **Tekshiring** — hamma havola `<Link>`mi, `/game/:id` parametri bormi — o'zingiz nazorat qiling · «Keyingi qadam — loyiha kuni: React + API + CRUD + Router'ni birlashtirib, o'z ilovangizni boshidan oxirigacha qurasiz! 🚀»
- Nishonlar (4): Router Built! · Nice Catch! · Route Master! · Level Up!

## Sinov (17.10)
gates 10/12 (tell, emoji — eski arena, baza) · `tekshir-m311` 31/31 (371/372 dan oldin; keyingisi fonda) · `ru-m311` 8/8 · `f369-harf` (m3-11 qismi 4/4) · `f371-tekshir` (tekislik 0 px, qadam oynasi ✓) · `f374-nan` 0 · matn `sinov/uz-matn-umumiy.mjs`.
