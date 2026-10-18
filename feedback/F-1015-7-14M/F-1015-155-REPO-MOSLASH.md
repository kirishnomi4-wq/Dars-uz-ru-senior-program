# F-1015-155 — 8-Modul darslarini TelegramBotNest repo'siga moslash (foydalanuvchi qarori «A», 17.10)

**Maqsad:** dars tuzilishi O'ZGARMAYDI (ekranlar soni, tartib, mexanika, ball, `INLINE_KEYS`/`correctIdx`, jonli relslar). Faqat
misol-ip va nomlar repo'ga keltiriladi: «telefon do'koni / mahsulot / products / orders / Express / List / Detail» → **AvtoPizza** va
repo'dagi aynan nomlar. O'quvchi darsda ko'rgan nom repo'da (github.com/Azizbekcrypto/TelegramBotNest, `yechim` tarmog'i, teglar) bir xil bo'lsin.

## Repo faktlari (manba-haqiqat; `git -C ~/Desktop/TelegramBotNest show <teg>:<fayl>` bilan tekshirish mumkin)
- **Backend:** NestJS (Node.js ustida), Telegraf bot, PostgreSQL (TypeORM), Gemini. Papka `src/`.
- **Menyu Database'da EMAS — kodda:** `src/api/menyu.ts` → `PITSALAR`: Margarita 45 000 so'm · Pepperoni 55 000 so'm · Pishloqli 50 000 so'm. `som()` narxni «45 000 so'm» qiladi.
- **`GET /menyu`** (`src/api/app.controller.ts`, 8-darsda qurilgan) → `[{ id, nom, narx }]` (narx — son).
- **`POST /buyurtma`** (`src/api/buyurtma/buyurtma.controller.ts`) — body `{ taom, manzil, manba }`; `taom` menyudagi nom bo'lmasa 400 «Bunday taom yo'q», manzil bo'sh — 400 «Manzilni yozing»; `manba`: `sayt` · `mobil` (yo'q bo'lsa `sayt`); javob `{ ok: true, id }`.
- **Jadval `buyurtmalar`** (ustunlar: `id` (uuid), `telegram_id`, `pitsa`, `manzil`, `manba` — `bot` · `sayt` · `mobil`, `created_at`). `users` — bot foydalanuvchilari. `products`/`orders` jadvallari YO'Q.
- Buyurtma yozilgach admin Telegram'da xabar oladi: «Yangi buyurtma (mobil): Pishloqli — 50 000 so'm · Sergeli, 7-uy» (13-darsdan bot va AI buyurtmasi ham — `BuyurtmaService.yoz` ichida).
- `POST /savol` — saytdagi AI savol (Gemini).
- **8-dars (`dars-6-08-*`):** `web/` — Vite + React sayt (`web/src/App.jsx`), menyu `GET /menyu` dan, «Buyurtma» → `POST /buyurtma` (`manba: 'sayt'`), CORS `localhost:5173`, `BACKEND` sayt kodida.
- **9-dars (`dars-6-09-*`):** `mobile/` — Expo (create-expo-app blank), menyu `GET /menyu` dan, Backend manzili `BACKEND` — `mobile/config.js`.
- **10-dars (`dars-6-10-*`):** `mobile/App.js` — Stack navigator: ekranlar **`Menyu`** va **`Tafsilot`** (`headerBackTitle: 'Orqaga'`); `mobile/ekranlar/Menyu.js` — `useState([])` + `useEffect` + `fetch(BACKEND + '/menyu')` + `FlatList`, `Pressable` → `navigation.navigate('Tafsilot', { pitsa: item })`; `mobile/ekranlar/Tafsilot.js` — `route.params.pitsa`, tugma «Menyuga qaytish» → `goBack()`.
- **11-dars (`dars-6-11-*`):** `mobile/savat.js` (bitta savat, Context, `jami` — `reduce`); `Tafsilot` da «Savatga qo'shish»; `mobile/ekranlar/Savat.js` — «Savat bo'sh — menyudan tanlang», «Jami: …», bo'sh savatda «Buyurtma berish» o'chiq; `mobile/ekranlar/Buyurtma.js` — manzil, «Yuborish» → har pitsa uchun `POST /buyurtma { taom, manzil, manba: 'mobil' }`, so'ng «Qabul qilindi» va savat tozalanadi; xatoda «Buyurtma ketmadi, qayta urinib ko'ring».
- **13-dars (`dars-6-13-*`):** uch kanal — sayt · mobil · bot, hammasi bitta Backend va `buyurtmalar` jadvali, `manba` ustuni kanalni ko'rsatadi; `TEST.md` jadvali: Web · Mobil · Bot × Yuborildi · Database'da · Admin xabari · Mijozga tasdiq; tekshiruv `SELECT … FROM buyurtmalar ORDER BY created_at DESC`.

## Almashtirish jadvali
| Eski | Yangi |
|---|---|
| telefon do'koni, «do'kon», mahsulot(lar) | AvtoPizza, pitsa(lar) / menyu (ma'noga qarab) |
| `GET /products` | `GET /menyu` |
| `POST /orders` | `POST /buyurtma` |
| `products` jadvali | menyu — kodda (`src/api/menyu.ts`); jadval kerak bo'lsa — faqat `buyurtmalar` |
| `orders` jadvali | `buyurtmalar` jadvali |
| Express `app.post("/orders", …)` | NestJS `buyurtma.controller.ts` (`@Post()` … ) — qisqa, repo'dagidek |
| `List` / `Detail` ekranlari | `Menyu` / `Tafsilot` |
| body `{ productId, qty }` va h.k. | `{ taom, manzil }` (+ `manba`) |
| «Node.js» (Backend ma'nosida) | «NestJS» (Backend). «Node.js» faqat runtime/o'rnatish ma'nosida qoladi |
| narxlar (mahsulot narxi) | 45 000 / 55 000 / 50 000 so'm (yuqoridagi menyu) |

## Qoidalar (majburiy)
- GATE M (`feedback/F-0929-QA-6modul/GATE_M_JAVOB.md`): M-q0 «Database» (o'quvchi matnida «baza» emas), M-q2 repo darslari — AvtoPizza, M-q3 yagona nomlar.
- Matn yozishdan OLDIN `MATN_KORPUS.md` va `MATN_ETALONI.md` ni o'qing (siz-forma, apostrof `'`, kirill yo'q, kantselyarit yo'q, sinonim taqiq). RU — tabiiy rus tili.
- Test variantlari: `correctIdx` va to'g'ri javob ma'nosi o'zgarmaydi; variant uzunliklari bir-biriga yaqin qoladi (uzunlik bilan javob bilinmasin).
- Ekran/sahna maketlari (telefon, kartochkalar, kod bloklari) ham AvtoPizza'ga: pitsa nomlari va narxlar yuqoridagi menyudan.
- **CSS izohiga backtik yozilmaydi** · `${…}` ichidagi `}` ga e'tibor (regex bilan CSS tahrirlamang) · emoji qo'shilmaydi.
- Faqat o'z faylingiz (va o'z darsining `feedback/F-0929-QA-6modul/YAKUNIY/NN-*.md` MD sinxroni). Boshqa fayl, `src/qolip`, `App.jsx` — TEGILMAYDI.
- Zaxira tayyor: `arxiv/F-1015-155-oldin/`. Darvoza: `npm run gates -- <fayl>` **12/12**, `npm run lint:til <fayl>` 0 error, `python3 feedback/F-1015-7-14M/vositalar/qavs.py <fayl>` xato 0.
- Surat: lokal vite allaqachon `http://localhost:5300` da ishlayapti (qayta ishga TUSHIRMANG). Vosita: `cd feedback/F-1015-7-14M/vositalar && node scrl.mjs <outdir> <kalit> <lessonId> <jami-ekran> <ekranlar,vergul> [uz|ru]` (lessonId — fayldagi `lessonId: '…'`; jami — SCREEN_META uzunligi). «Oldin» suratini TAHRIRDAN OLDIN oling (asosiy o'zgaradigan 3–5 ekran, uz), «keyin» — o'sha ekranlar uz + 1–2 ru. Papkalar: `feedback/F-1015-7-14M/suratlar/F-1015-155-<kalit>-oldin|keyin/`.
