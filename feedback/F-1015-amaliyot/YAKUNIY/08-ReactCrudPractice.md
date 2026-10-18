# 3-Modul m3-07 «Praktika: CRUD — to'liq boshqariladigan ilova» — yakuniy matn

Fayl: `src/3-Modull/ReactCrudPracticeLesson.jsx` · 8 ekran · Oldingi: «Props va qayta ishlatish» (m3-06) · Keyingi: «API bilan ishlash: GET — serverdan ma'lumot olish» (m3-08)
Ip: `robo-games` (Vite + React, m3-03 dan) — GameCard + `games` ro'yxati · AI: Gemini (Antigravity ishlatilmaydi)
React darslaridan: `useState`, props, `map` bilan chizish; bugun — spread `[...games, yangi]`, `map` + `{...g}`, `filter`
Holat: 2026-10-17 — kodga mos (F-1015-344 → 352 → 366…370 dan keyin; foydalanuvchi ko'rigi «yaxshi bo'ldi», tasdiq). `lessonId` = `react-crud-practice-p1-v18` (o'zgarmagan)
Zaxira: 22 ekranli — `arxiv/F-1015-reactcrud-oldin/`. Qurish: `qurish/f344.py` (zaxiradan) → `f344-yakun.jsx` (352) → `qurish/f366.py` → `qurish/f367.py` (joyida).

## 0 · Kirish
- Sarlavha: Kartochkalar ko'rinadi — lekin nega ularni o'zgartirib bo'lmaydi?
- Mentor: Mana "Mening o'yinlarim" ro'yxati. Yangi o'yin qo'shmoqchi bo'ling yoki bittasini o'chirmoqchi bo'ling — tugmalarni bosib ko'ring. Nima sezdingiz?
- «Mening o'yinlarim» (+ O'yin qo'shish, ✕) — tugmalar ishlamaydi.
- «Haqiqiy ilovaga, ko'rsatishdan tashqari, yana nima kerak?» (ballsiz): Hech narsa — ko'rsatgani yetadi · ✔ Qo'shish, o'zgartirish va o'chirish ham kerak · Ko'proq rang va animatsiya
- Javob (216-qonun, F-1015-393): hech narsa → «Hozir ilova faqat ko'rsatadi — bu yetmaydi.» · CRUD → «Aynan!» · rang → «Rang emas — amallar yetishmaydi.» + «Bugun qo'shish, o'zgartirish va o'chirishni qo'shamiz.»

## 1 · Reja
- Sarlavha: Bugun ro'yxat **jonlanadi**.
- Mentor: O'tgan darslarda `robo-games`'da o'yin kartochkalarini chizdingiz. Bugun ularni **qo'shasiz, TOP qilasiz va o'chirasiz** — bu CRUD amallari. Qo'shishni o'zingiz yozasiz, qolganini Gemini bilan.
- «Avval tayyorlaning · 3 qadam ▾» (oyna, F-1015-362/370): 1. VS Code'da `robo-games` papkasini oching, terminalda `npm run dev` — localhost:5173 da o'yin kartochkalari chiqadimi? · 2. `App.jsx` va `GameCard.jsx` fayllarini oching — bugun shu ikkalasida ishlaysiz. · 3. Boshqa oynada gemini.google.com'ni oching. · «Tayyor bo'lsa — «Boshlaymiz».»
- Chapda «Dars oxirida · bosib ko'ring» — `robo-games — localhost:5173`: «N ta o'yin», «+ O'yin qo'shish», kartochkalarda 🔥 TOP va ✕ — hammasi ishlaydi.
- O'ngda «CRUD — ilovaning 4 amali»: Create qo'shish `[...games, yangi]` · Read ko'rsatish `games.map(...)` · Update o'zgartirish `{ ...g, top: !g.top }` · Delete o'chirish `games.filter(...)`
- «Bugungi 3 blok»: 01 Qo'shish (o'zingiz · VS Code) · 02 TOP va o'chirish (Gemini) · 03 AI xatosini topish (siz)

## 2 · Amaliyot 1 · AI'siz — qo'shish (a1)
- Sarlavha: Yangi o'yinni ro'yxatga **qo'shing**.
- Mentor: Qo'shishning kaliti — uch nuqta: `[...games, yangi]` — «eski ro'yxatning hammasi, oxiriga yangisi». Avval shu yerda sinab ko'ring, keyin VS Code'da o'zingiz yozasiz.
  - Ekranda biror bosish bo'lsa Mentor gapi yig'iladi (kompyuterda ham, F-1015-364/366).
- Chapda «Ilova · bosib qo'shing» — ilova oynasi ichida, ro'yxat tepasida tanlash qatori (F-1015-367): + 🐷 Piggy · + 🗼 Tower of Hell · + 🐝 Bee Swarm · + 🐶 Pet Sim 99 (tugagach «↺ Boshidan»); yangi kartochka yashil ramkada.
- Ostida «App.jsx · qiymatlar hozir» — har qo'shishda qatorlar va sarlavha sariq yonadi:
```
// oxirgi amal
setGames([...games, { id: 7, name: "Bee Swarm" }]);
// hozir
games = ["Adopt Me!", "Blox Fruits", "Piggy", "Tower of Hell", "Bee Swarm"];  // games.length = 5
```
- O'ngda «VS Code'da · robo-games» (5 qadam): 1. `App.jsx` da o'yinlar state'da tursin: `const [games, setGames] = useState([...])` — o'tgan darsdagi ro'yxatingiz. · 2. Ro'yxat tepasiga input va «+ O'yin qo'shish» tugmasini qo'ying; yozilgan nom `nom` state'ida tursin. · 3. Tugma bosilganda yangi o'yin yasang: `const yangi = { id: Date.now(), name: nom }`. · 4. Ro'yxatga qo'shing: `setGames([...games, yangi])` — push emas. · 5. Saqlang — localhost:5173 da yangi kartochka chiqdimi?
- «Qotib qoldingizmi? Kodni ko'rish ▸»:
```
const [nom, setNom] = useState('');
function qoshish() {
  const yangi = { id: Date.now(), name: nom };
  setGames([...games, yangi]);
  setNom('');
}
<input value={nom} onChange={e => setNom(e.target.value)} />
<button onClick={qoshish}>+ O'yin qo'shish</button>
```

## 3 · Amaliyot 2 · Gemini — TOP va o'chirish (a2)
- Sarlavha: TOP va o'chirishni **Gemini** bilan qo'shing.
- Mentor: O'zgartirish — **map**: kerakli o'yinni topib, nusxasini o'zgartiradi, qolganiga tegmaydi. O'chirish — **filter**: shu o'yindan boshqa hammasini qoldiradi. Sinab ko'ring, keyin promptni Gemini'ga bering. (bosishda yig'iladi)
- Chapda «Ilova · bosib ko'ring» — 4 kartochka (🔥 TOP, ✕; hammasi o'chsa «↺ Boshidan») va ostida **«Tekshiring»** (F-1015-368): TOP bosilganda faqat o'sha kartochka o'zgaradimi, qolganlari joyidami? · «✕» dan keyin «Rostdan o'chirilsinmi?» so'raladimi? · Kodda `map` va `filter` bormi, `push` yoki `splice` yo'qmi?
- O'ngda:
  - **Prompt** + «Promptni nusxalash» (nusxalangach «✓ Prompt nusxalandi · Ko'rish ▾» ga yig'iladi, F-1015-366):
```
React loyihamga (robo-games) ikkita amal qo'sh. games ro'yxati App.jsx da useState'da turibdi.
1. Har kartochkada «🔥 TOP» tugmasi: bosilganda faqat shu o'yinning top qiymati almashsin — games.map bilan: g.id === id ? { ...g, top: !g.top } : g.
2. Har kartochkada «✕» tugmasi: avval confirm("Rostdan o'chirilsinmi?") bilan so'rasin, keyin games.filter(g => g.id !== id) bilan o'chirsin.
State'ni to'g'ridan o'zgartirma (push, splice yo'q) — har safar setGames'ga yangi ro'yxat ber. Funksiyalarni GameCard'ga props bilan uzat.
Har bo'limga qisqa izoh yoz. O'zgargan fayllarni to'liq qaytar.
Mana kodim:
{App.jsx va GameCard.jsx kodini shu yerga qo'ying}
```
  - «App.jsx · qiymatlar hozir» (prompt ostida; TOP/✕ da yonadi): `setGames(games.map(g => g.id === 1 ? { ...g, top: !g.top } : g));` · `games = [...]` · `top: ["Adopt Me!"];  // games.length = 4`
  - «Qadamlar · 4 ▾»: Chapdagi ilovada «🔥 TOP» va «✕»ni bosing — kod oynasida map va filter qanday ishlashini ko'ring. · «Promptni nusxalash» → gemini.google.com'ga qo'ying, oxiriga `App.jsx` va `GameCard.jsx` kodini qo'shing va yuboring. · Javobdagi fayllarni almashtiring, `Ctrl+S`. · Brauzerda va kodda «Tekshiring» ro'yxatini o'ting.
- Nishon «Full CRUD!» — «Davom etish»da.

## 4 · Amaliyot 3 · AI xatosi (eski ekran)
- Sarlavha: AI yordam beradi — siz esa tekshirasiz.
- Mentor: AI "Qo'shish"ni yozdi — lekin tugmani bosganda hech narsa bo'lmayapti! O'yin qo'shilmaydi. State darsini eslang. Qaysi qatorda xato? O'sha qatorni bosing.
- AI kodi: `const yangi = { name: "Piggy" };` · `games.push(yangi);  // yangi o'yinni qo'shdi` · `setGames(games);  // ro'yxatni yangiladi` → ✔ `games.push` qatori; «+ push (tez qo'l)» · «🪟 Oyna — ekran (React kamerasi)» · «❄️ Oyna muzladi — React o'zgarishni ko'rmadi»
- Nishon «Nice Catch!».

## 5 · Yakuniy · amaliy (yagona ballik)
- Sarlavha: Oxirgi qadam: **o'chirish** kodini o'zingiz yozing.
- Mentor: VS Code'da `App.jsx` ochiq: `ochirish(id)` funksiyasi tayyor — faqat **2-qator bo'sh**. Bosilgan o'yindan boshqa hammasi ro'yxatda qolsin.
- VS Code maketi: `function ochirish(id) {` · 2-qator — input · `}` · yorliqlar: 1 state'ni yangilash · 2 elak · 3 shu id dan boshqasi · O'ngda «Natija · ochirish(2)» (Blox Fruits xira → to'g'ri bo'lsa yo'qoladi)
- To'g'ri: `setGames(games.filter(g => g.id !== id))` (o'zgaruvchi nomi ixtiyoriy, `;` ixtiyoriy) → «✓ Mukammal! O'chirish ishladi — shu o'yindan boshqa hammasi qoldi. To'liq CRUD ilovasi sizning qo'lingizda.»
- `splice` → «splice ham push kabi eski ro'yxatni buzadi — React ko'rmaydi. Yangi ro'yxat kerak…»
- Faqat harf farqi (`setgames`, `Filter`) → «Deyarli to'g'ri! JavaScript **katta-kichik harfni farqlaydi**: `setGames`, `filter`, `id` — aynan shunday yozing.» (211-qonun, F-1015-369)
- Nishon «Ship It!».

## 6 · Podium
- «Kim g'olib?» · mustaqil rejimda: «Jonli darsda bu yerda butun guruh reytingi — 🥇🥈🥉 podium chiqadi.»

## 7 · Yakun
- «✓ Birinchi loyihangiz bitdi» · «N/1 to'g'ri» · To'liq ilovani o'zingiz bitirdingiz.
- «Endi siz bilasiz»: CRUD = ilovaning 4 amali: Create · Read · Update · Delete · Create — qo'shish: `setGames([...games, yangi])` · Update — o'zgartirish: `games.map(... ? {...g} : g)` · Delete — o'chirish: `games.filter(g => g.id !== id)` · Ro'yxatni buzma — har safar YANGI ro'yxat yasa (React shuni ko'radi)
- Uyga vazifa (VS Code'da, `robo-games` loyihangizda): ❤️ like — har kartochkaga like tugmasi: bosilsa faqat o'sha o'yinning likes soni +1 (map bilan) · Bo'sh nom — input bo'sh bo'lsa, o'yin qo'shilmasin · Tekshiring — qo'shishda `[...games]` bormi, o'chirishda `filter`'mi — o'zingiz nazorat qiling · «⚠️ Lekin sahifani yangilang — ro'yxatingiz YO'QOLADI! Chunki hammasi faqat xotirada. Keyingi darsda buni hal qilamiz: server — ma'lumot abadiy saqlanadigan joy. 🚀»
- Nishonlar (4): Full CRUD! · Nice Catch! · Ship It! · Level Up!

## Sinov (17.10)
gates 10/12 (tell, emoji — eski arena, baza bilan bir xil) · `tekshir-m307` 31/31 · `ru-m307` 8/8 (oyna ham) · `f369-harf` (m3-07 qismi 4/4) · `f366-surat` · matn `sinov/uz-matn-umumiy.mjs` chiqishidan.
