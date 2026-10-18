# 3-Modul m3-12 «Praktika: Loyiha kuni — AvtoIjara» — yakuniy matn

Fayl: `src/3-Modull/ReactProjectDayLesson.jsx` · **9 ekran** · Oldingi: «Praktika: React Router — ko'p sahifali ilova» (m3-11) · Keyingi: «Praktika: Istalgan saytni qurish — bo'laklash + aniq prompt» (m3-13)
Ip: yangi `avto-ijara` loyihasi (Vite + React + react-router-dom) — Chevrolet/Kia, so'mda (4-Modul serveri bilan bir xil) · AI: Gemini, har qism — bitta prompt (Antigravity agenti olindi)
Holat: 2026-10-17 — kodga mos (F-1015-346 → 357 → 358 → 369 → 370…376 dan keyin; foydalanuvchi «yaxshi bo'ldi», tasdiq). `lessonId` = `react-project-day-p3-v18` (o'zgarmagan; total 8 → 9 — saqlangan holat tozalanadi)
Zaxira: 23 ekranli — `arxiv/F-1015-reactprojectday-oldin/` · 8 ekranli — `arxiv/F-1015-376-oldin/`. Qurish: `qurish/f346.py` → f358 → `f367.py` → `f370.py` → `f371.py` → `f375.py` → `f376.py` + `f376-ekranlar.jsx`.

## 0 · Kirish
- Sarlavha: 4 ta alohida kuchni bitta ilovaga birlashtira olamizmi?
- Mentor: Bu modulda 4 ta kuch o'rgandingiz — har biri alohida. Bugun ularni bitta haqiqiy ilovaga qo'shamiz: AvtoIjara (mashina ijara sayti). To'rttala kuchni bosib eslang.
- Kartalar: Komponent + props + map · State (xotira) · API — server (CRUD) · Router (sahifalar) → savol (ballsiz): Yo'q — har biri alohida narsa · ✔ Ha — bitta to'liq ilovaga birlashadi · Faqat kattalar buni qila oladi
- Javob (216-qonun, F-1015-393): alohida → «Har biri — bitta ilovaning qismi.» · birlashadi → «Aynan!» · kattalar → «Siz ham qila olasiz — AI yordamida.» + «Bugun bo'sh sahifadan to'liq AvtoIjara ilovasini qurasiz.»

## 1 · Reja
- Sarlavha: Bugun **AvtoIjara** saytini qurasiz.
- Mentor: Modulda o'rganganingiz — komponent, state, fetch va Router — bitta saytga birlashadi. Ilovani **qismlarga bo'lib**, har qismni Gemini'ga alohida prompt bilan berasiz va har qadamdan keyin brauzerda tekshirasiz.
- «Avval tayyorlaning · 3 qadam ▾» (oyna): 1. Terminalda: `npm create vite@latest avto-ijara` (React, JavaScript), keyin `cd avto-ijara`, `npm install` va `npm install react-router-dom`. · 2. `npm run dev` — localhost:5173 ochiladimi? Papkani VS Code'da oching. · 3. Boshqa oynada gemini.google.com'ni oching.
- Chapda «Dars oxirida · bosib ko'ring» — to'liq AvtoIjara namunasi (katalog → mashina → kun −/+ → Ijaraga olish → Mening ijaralarim, jami).
- O'ngda «3 sahifa»: `/` Bosh — mashinalar katalogi · `/car/:id` Mashina — tafsilot va kun tanlash · `/bookings` Mening ijaralarim — jami narx · «Bugungi 4 blok»: 01 Katalog (Gemini) · 02 Mashina sahifasi va kun (Gemini) · 03 Ijaralar va jami narx (Gemini) · 04 AI xatosini topish (siz)

## 2 · Amaliyot 1 · Gemini — Katalog (a1)
- Sarlavha: **Katalogni** quring.
- Mentor: Birinchi qism — faqat Bosh sahifa: mashinalar `cars.json` faylidan `fetch` bilan keladi va kartochka bo'lib chiqadi. (bosishda yig'iladi)
- Chapda «Natija · bosib ko'ring» — 4 kartochka (Chevrolet Cobalt 280 000 · Chevrolet Malibu 520 000 · Kia K5 610 000 · Chevrolet Tracker 400 000 so'm/kun); «↻ Qayta yuklash» → «Yuklanmoqda...» → kartochkalar.
  «Tekshiring»: 4 ta kartochka chiqdimi — nomi va kunlik narxi bilan? · Sahifani yangilang — bir lahza «Yuklanmoqda...» ko'rinadimi?
- O'ngda:
  - **public/cars.json · 4 mashina** — kichik karta: «Ko'rish» (oynada JSON) · «Nusxalash» (haqiqiy JSON: id, name, price, seats, desc)
  - **Prompt**: `Vite + React loyiham (avto-ijara) bor, react-router-dom o'rnatilgan. Bosh sahifani qur (src/pages/Home.jsx, App.jsx da Route path="/"):` / `public/cars.json dan fetch bilan mashinalarni yuklasin (useEffect + useState) va har birini kartochka qilib chiqarsin: nomi va kunlik narxi (so'm/kun). Yuklanayotganda «Yuklanmoqda...» yozsin.` / `Har bo'limga qisqa izoh yoz. Fayllarni to'liq yoz.`
  - «avto-ijara · qiymatlar hozir»: `fetch("/cars.json");` → `setCars(data);` · `yuklanmoqda = true/false;` · `cars.length = 4;  // cars.json dan`
  - «Qadamlar · 4» (oyna): `public` papkasida `cars.json` faylini yarating va «Nusxalash» bilan olingan ro'yxatni qo'ying. · «Promptni nusxalash» → gemini.google.com'ga yuboring. · Javobdagi fayllarni `src` ga qo'ying (`pages` papkasini yarating), `Ctrl+S`. · «Tekshiring» ro'yxatini brauzerda o'ting.
- Nishon «In Command!» — «Davom etish»da.

## 3 · Amaliyot 2 · Gemini — Mashina sahifasi va kun (a2)
- Sarlavha: Mashina sahifasi va **ijara narxi**.
- Mentor: Kartochka bosilsa `/car/:id` ochiladi: `useParams` id'ni beradi. Kun tanlansa, narx `price * days` bilan darhol hisoblanadi.
- Chapda — katalog → mashina sahifasi, kun −/+ (1 dan pastga tushmaydi), «Narx: 520 000 × 3 = 1 560 000 so'm». «Tekshiring»: Kartochka bosilsa manzil `/car/2` bo'lib, o'sha mashina ochiladimi? · Kun 1 dan pastga tushmaydimi? · Kun o'zgarsa, narx ham darhol o'zgaradimi?
- O'ngda — **Prompt**: `AvtoIjara saytimga mashina sahifasini qo'sh (kodim pastda):` / `1. /car/:id sahifasi: useParams bilan id'ni olsin va cars dan find bilan topib — nomi, narxi, o'rindiqlari va tavsifini ko'rsatsin.` / `2. Bosh sahifadagi har kartochka <Link> bilan shu sahifaga olib borsin.` / `3. Sahifada kun tanlash: «−» va «+», kamida 1 kun; ostida «Narx: price × kun» darhol yangilansin.` / `Har bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.` / `Mana kodim:` / `{App.jsx va sahifalar kodini shu yerga qo'ying}`
  - Kod oynasi: `<Link to="/car/2">` · `URL = "/car/2";` · `const { id } = useParams();  // "2"` · `cars.find(c => c.id === Number(id));  // "Chevrolet Malibu"` · `price * days;  // 520000 * 3 = 1560000` · kun o'zgarsa `setDays(N);`
  - «Qadamlar · 4»: Chapda kartochkani bosing va kunni o'zgartiring — kod oynasida `useParams` va `price * days` ni ko'ring. · «Promptni nusxalash» → gemini.google.com, oxiriga `App.jsx` va sahifalar kodini qo'shing va yuboring. · Javobdagi fayllarni almashtiring, `Ctrl+S`. · «Tekshiring» ro'yxatini brauzerda o'ting.

## 4 · Amaliyot 3 · Gemini — Ijaralar va jami (a3)
- Sarlavha: Ijaralar va **jami narx**.
- Mentor: Ijaralar `bookings` ro'yxatida turadi. «Mening ijaralarim» sahifasi ularni ko'rsatadi, jami esa `for` bilan yig'iladi.
- Chapda — Cobalt sahifasi, kun, «Ijaraga olish · 840 000 so'm» → /bookings (har ijara: nomi, kun × narx, summa; Jami). «Tekshiring»: Ikki ijara oling — «Mening ijaralarim»da ikkalasi ham bormi? · Jami har bir ijara narxining yig'indisiga tengmi? · Bosh sahifaga o'tib qayting — ijaralar joyidami?
- O'ngda — **Prompt**: `AvtoIjara saytimga ijaralarni qo'sh (kodim pastda):` / `1. Mashina sahifasidagi «Ijaraga olish» bosilganda ijara bookings ro'yxatiga qo'shilsin: setBookings([...bookings, { id, name, price, days }]). bookings state App.jsx da tursin.` / `2. Yangi sahifa «Mening ijaralarim» (/bookings): har ijara — nomi, kun va price * days; pastda jami — for sikli bilan yig'indi. Menyuga <Link> qo'sh.` / `Har bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.` / `Mana kodim:` / `{App.jsx va sahifalar kodini shu yerga qo'ying}`
  - Kod oynasi: `setBookings([...bookings, { name: "Chevrolet Malibu", price: 520000, days: 3 }]);` · `bookings.length = 2;` · `jami = 2120000;  // for: 280000*2 + 520000*3`
  - «Qadamlar · 4»: Chapda ijaraga oling va «Mening ijaralarim»ni oching — kod oynasida `setBookings` va `jami` ni ko'ring. · (nusxalash, almashtirish, tekshiring — a2 kabi)
- Nishon «Shipped It!» — «Davom etish»da.

## 5 · Amaliyot 4 · AI xatosi (eski ekran)
- Sarlavha: AI yordam beradi — siz esa tekshirasiz.
- Mentor: Mijoz shikoyat qildi: jami narx noto'g'ri! Malibu 3 kun (520 000 so'm) + Cobalt 2 kun (280 000 so'm) — jami 2 120 000 so'm bo'lishi kerak, lekin 800 000 so'm chiqyapti. AI qaysidir qatorda kunni unutgan. Toping.
- AI kodi: `const jami = bookings.reduce(` · ✔ `(s, b) => s + b.car.price` · `, 0);` → «* b.days qo'shish» → «✓ Tuzatildi — endi kun ham hisobga olinadi!» · «Mening ijaralarim» maketi: 800 000 so'm ✗ → 2 120 000 so'm
- Nishon «Bug Hunter!».

## 6 · Yakuniy · amaliy (yagona ballik)
- Sarlavha: Oxirgi qadam: ilovaning o'zagini o'zingiz yozing.
- Mentor: VS Code'da jami narx hisobi ochiq — faqat 3-qator bo'sh. Har ijara uchun narx × kun ni yozing. Mana shu — AvtoIjara'ning asosiy mantiqi.
- `Bookings.jsx`: `(s, b) => s +   // b: { price, days }` · 3-qator — input · `, 0);` · yorliqlar 1 narx · 2 ko'paytirish · «Natija — Mening ijaralarim»
- To'g'ri: `b.price * b.days` yoki `b.days * b.price` (`b.car.price` ham) · faqat harf farqi → «Deyarli to'g'ri! JavaScript **katta-kichik harfni farqlaydi**: `b.price`, `b.days` — aynan shunday yozing.» (211-qonun)
- Nishon «Level Up!».

## 7 · Podium · 8 · Yakun
- Podium yorlig'i «1 — Yakuniy» (Q_LABELS 6).
- «✓ Loyiha kuni tugadi» · «N/1 to'g'ri» · To'liq ilovani AI bilan qurdingiz.
- «Endi siz bilasiz»: Loyihani bo'laklash: sahifalar + ma'lumot + amallar · Yaxshi prompt = Nima + Qanday + Qayerda (aniq → aniq natija) · Har qism — alohida prompt, har qadamdan keyin brauzerda tekshirish · Iteratsiya: natijani ko'rib, aniqlashtiruvchi prompt · Debug: kodni o'qib xatoni topish (jami = kun × narx)
- Uyga vazifa (VS Code'da, `avto-ijara` loyihangizda): Mashina qo'shish — `/add` sahifasi: forma, `setCars([...cars, yangi])` va `navigate('/')` — Gemini bilan · Ijarani bekor qilish — «Mening ijaralarim»da har ijaraga ✕: `filter` bilan o'chirsin, jami qayta hisoblansin · Tekshiring — har promptdan keyin brauzerda sinang: jami to'g'rimi, sahifa almashsa ma'lumot qoladimi · «Keyingi va oxirgi qadam: o'z bitiruv loyihangizni katta bo'laklarga ajratib, noldan qurishni boshlaysiz! 🚀»
- Nishonlar (4): In Command! · Shipped It! · Bug Hunter! · Level Up!

## Sinov (17.10)
gates 10/12 (tell 8, emoji 2 — 376 dan oldin ham shuncha) · `tekshir-m312` (9 ekranga qayta yozilgan) 39/39 · `ru-m312` 9/9 · `f369-harf` (m3-12 qismi 4/4) · `f371-tekshir` (tekislik 0 px, qadam oynasi ✓) · `f374-nan` 0 · matn `sinov/uz-matn-umumiy.mjs`.
