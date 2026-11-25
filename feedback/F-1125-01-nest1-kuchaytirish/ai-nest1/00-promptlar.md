# F-1125-01 · 3-ish · Nest-1 AI bloki — haqiqiy AI yurgizishi (25.11.2026)

> **2-yurgizish (17:18) — darsga shu ketadi.** 1-yurgizish (`users`, pastda) Nest-1 uyga vazifasi bilan to'qnashdi («cars-api'ga users modulini o'zingiz qo'shing»); foydalanuvchi 3-savolga «A» javob berdi: ikki AI qayta, resurs **customers** (ijarachilar). Topshiriqlar xuddi shu qolipda, faqat resurs va maydonlar boshqa:
> - **A2 · oddiy:** «Loyihamga mijozlar bo'limini qo'shib ber. Mashinani ijaraga oladigan mijozlar ro'yxatini ko'rish, bittasini id bo'yicha olish va yangi mijoz qo'shish kerak. Mijozda ism, telefon va yosh bo'lsin. Yoshi 18 dan kichik bo'lsa, qo'shmasin.»
> - **B2 · Nest tilida:** A1/B1 dagi B qolipi, `users` → `customers`, maydonlar (id, name, phone, age).
> Nusxalar: `scratchpad/ai-nest1-v2/{oddiy,nest}/cars-api` (asos commit `baza`). Natijalar: `A2-oddiy/`, `B2-nest/`.
>
> Quyidagisi — 1-yurgizish (`users`), natijalari `A-oddiy/`, `B-nest/`, `XULOSA.md` — darsga kirmaydi, solishtirish uchun saqlanadi.

**Maqsad:** mentor Nest-1 darsiga «O'quvchi AI bilan quradi — siz nimani tekshirasiz» ekrani va «satrni bosing» tekshiruvi uchun HAQIQIY AI kodi (M10: o'ylab topilmaydi).
**Asos:** darsning 3-amaliyotdan keyingi holati — `cars-api` (Nest 12.6.1, CommonJS, cars moduli: GET /cars, GET /cars/:id, POST /cars). Har AI o'z nusxasida, git asos commit `baza`.
**AI:** Claude Haiku (agent, ikkalasi bir xil model — farq faqat topshiriqda). O'quvchi va mentor Gemini / Antigravity / Copilot ishlatadi; boshqa model boshqacha yozishi mumkin — darsda shunday aytiladi.
**Biznes qoida ataylab qo'shilgan:** «yoshi 18 dan kichik bo'lsa qo'shmasin» — o'quvchi darsining debugging qadami (m4a-01: AI qatorni noto'g'ri faylga qo'ygan) shu turdagi xato haqida. Tekshiruv qaysi faylga tushishini kuzatamiz.

## A · Oddiy topshiriq (o'quvchi yozadigandek)
> Loyihamga users bo'limini qo'shib ber. Foydalanuvchilar ro'yxatini ko'rish, bittasini id bo'yicha olish va yangi foydalanuvchi qo'shish kerak. Foydalanuvchida ism, email va yosh bo'lsin. Yoshi 18 dan kichik bo'lsa, qo'shmasin.

## B · Nest tilidagi topshiriq (qolip)
> NestJS'da users moduli yarat.
> - Fayllar CLI bilan: `nest g module users` · `nest g controller users --no-spec` · `nest g service users --no-spec`.
> - UsersService: ro'yxat xotirada (id, name, email, age); metodlar findAll, findOne(id), create(data). Topilmasa NotFoundException. Yoshi 18 dan kichik bo'lsa BadRequestException — bu tekshiruv Service'da bo'lsin.
> - UsersController: GET /users, GET /users/:id (id ParseIntPipe bilan), POST /users. Controller faqat so'rovdan oladi, Service'ni chaqiradi va natijani qaytaradi — hisob va tekshiruv yo'q.
> - UsersModule controllers va providers'da, AppModule imports'ida bo'lsin.
> - Oxirida `npm run build` xatosiz o'tsin. Qaysi fayl yaratilgani va o'zgarganini yoz.

## Agentga beriladigan o'ram (ikkalasiga bir xil)
> You are the AI coding assistant inside a learner's VS Code. The open project is the folder `<nusxa>/cars-api`. Work only inside that folder (read, edit, run commands there). Do not open, search or read any other directory on this computer. Do not push or publish anything. Treat the request below exactly as the user typed it and do what a coding assistant normally does. When done, reply briefly: which files you created or changed and how you checked it.

## Mentor tekshiruvi (AI'dan keyin, o'zim)
`git diff baza` · `npm run build` · server + so'rovlar: GET /users, GET /users/1, GET /users/99, GET /users/abc, POST to'g'ri, POST yosh 15, POST bo'sh `{}` · terminaldagi Mapped satrlari · 4 savol: providers/controllers · AppModule imports · logika Service'dami · decorator'lar.
