# Nest-1 AI bloki — haqiqiy AI yurgizishi xulosasi (25.11.2026)

## ★ 2-yurgizish — `customers` (darsga SHU ketadi; foydalanuvchi 3-savol «A»)
Natijalar: `A2-oddiy/`, `B2-nest/`, tuzatilganlari `A2-oddiy-tuzatilgan/`, `B2-nest-tuzatilgan/` (`RES=customers bash ai-tekshir.sh …`).

| | A2 · oddiy topshiriq | B2 · Nest tilidagi topshiriq |
|---|---|---|
| Fayllar | customers.module · controller · service + o'zi qo'shgan `customers.service.spec.ts` | module · controller · service (CLI bilan) |
| Ro'yxatlar · logika · decorator'lar | ✓ · yosh qoidasi Service'da ✓ · ✓ | ✓ · Service'da ✓ · ✓ |
| Terminal | 3 ta `Mapped {/customers…}` ✓ | 3 ta ✓ |
| `GET /customers/abc` | **404 «Customer with id NaN not found»** — ParseIntPipe yo'q, `Number(id)` (controller 15–16-satr) | 400 «Validation failed» (ParseIntPipe so'ralgan edi) ✓ |
| Yosh 15 | 400 | 400 |
| Bo'sh `POST {}` | 400 «name is required» (o'zi qo'shgan) | **201 `{"id":4}`** — bo'sh mijoz |
| Yosh matn `"16"` | 400 «age must be an integer» | 400 (`"16" < 18`) |
| Body'da `"id": 1` | e'tiborga olinmadi, id 4 | **201, ikkinchi `id: 1`** — 36-satr `const customer: Customer = { id: this.nextId++, ...data };` |

**Tuzatishlar (sinab ko'rilgan):** B2 — `{ ...data, id: this.nextId++ }` → soxta id e'tiborga olinmadi, yangi id 5 (bo'sh POST baribir 201 — DTO + ValidationPipe ishi). A2 — `@Param('id', ParseIntPipe) id: number` → `/customers/abc` 400 «Validation failed (numeric string is expected)».

**Xulosa (2 yurgizishdan):** har AI topshiriqda yozilmagan narsani o'tkazib yubordi: oddiy topshiriq — Nest'ga xos ParseIntPipe'ni (2-yurgizishda; 1-yurgizishda qo'ygan edi), Nest topshirig'i — kiruvchi ma'lumot tekshiruvini (ikkala yurgizishda ham). Tuzilish (4 savol) to'rttala natijada to'g'ri. B dagi takror id xatosi ikki yurgizishda ham bir xil shaklda chiqdi (`{ id, ...data }`). `import type` (TS1272) ikkala AI'da ham yana uchradi va o'zlari tuzatdi.

---

## 1-yurgizish — `users` (darsga kirmaydi: Nest-1 uyga vazifasi bilan to'qnashgan)

Topshiriqlar: `00-promptlar.md`. AI: Claude Haiku (agent), har biri o'z nusxasida (`cars-api`, darsning 3-amaliyotdan keyingi holati, Nest 12.6.1 CJS). Tekshiruv: `ai-tekshir.sh` (build + server + 11 so'rov), natijalar `A-oddiy/`, `B-nest/`, `B-nest-tuzatilgan/`.

| | A · oddiy topshiriq | B · Nest tilidagi topshiriq |
|---|---|---|
| Fayllar | users.module · controller · service + **o'zi qo'shgan** users.service.spec.ts | users.module · controller · service (CLI bilan, so'ralgandek) |
| Ro'yxatlar | controllers/providers ✓ · AppModule imports ✓ · terminalda 3 ta Mapped /users ✓ | xuddi shunday ✓ |
| Logika qayerda | yosh tekshiruvi Service'da ✓ | Service'da ✓ |
| `id` | ParseIntPipe ✓ (`/users/abc` → 400) | ParseIntPipe ✓ |
| Yosh 15 | 400 «age must be at least 18» | 400 «User must be at least 18 years old» |
| Bo'sh POST `{}` | 400 «name is required» (o'zi qo'shgan tekshiruv) | **201 `{"id":4}`** — bo'sh foydalanuvchi yaratildi |
| Yosh matn `"16"` | 400 «age must be an integer» | 400 (matn `"16" < 18` JavaScript'da son sifatida solishtiriladi) |
| Body'da `"id":1` | e'tiborga olinmadi, id 4 | **201, ikkinchi `id: 1`** — `const user: User = { id, ...data };` (40-satr): body'dagi id yangi id'ni bosib ketadi |

## Darsga haqiqiy material
1. Ikkala AI ham strukturani to'g'ri qildi: 4 savol (fayllar · ro'yxatlar · logika Service'da · decorator'lar) ikkalasida ✓. Bu haqiqat — darsda «AI strukturada adashadi» deb aytilmaydi.
2. Xato so'rov bilan chiqdi, struktura bilan emas: B da bo'sh POST 201 va soxta `id` → takror id. Odatiy so'rovlar (200, 404, 400) ikkalasida ham to'g'ri — faqat «kutilmagan» so'rov xatoni ochdi.
3. Kutilmagan natija: aniq Nest topshirig'i berilgan AI aynan so'ralganini qildi va so'ralmaganini (kiruvchi ma'lumotni tekshirish) qilmadi; oddiy topshiriqli AI o'zidan tekshiruv qo'shdi. Demak topshiriq fayllarni joyiga qo'yadi, lekin tekshiruvni mentor/o'quvchi o'zi so'rashi yoki sinab ko'rishi kerak.
4. Tuzatish (B-nest-tuzatilgan): `{ ...data, id }` — soxta id e'tiborga olinmaydi, yangi id 5. Bo'sh POST baribir 201 — bu DTO + ValidationPipe ishi (darsning 20-ekranida aytilgan).
5. Qo'shimcha haqiqiy fakt: Nest 12 qolipida (isolatedModules + emitDecoratorMetadata) Controller'da interfeys oddiy import bilan olinsa — `error TS1272: A type referenced in a decorated signature must be imported with 'import type'…` (`B-nest/05-import-type-siz.txt`). A shu xatoga duch kelib, o'zi `import type` bilan tuzatgan.

## Halol cheklov
Ikkala AI bir model (Haiku). O'quvchi Gemini, mentor Antigravity/Copilot ishlatadi — boshqa model boshqacha yozishi mumkin. Darsda «biz sinagan AI'da shunday chiqdi» deb aytiladi; xato o'ylab topilmaydi.
