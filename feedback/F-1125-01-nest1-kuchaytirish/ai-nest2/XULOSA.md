# Nest-2 AI bloki — haqiqiy AI yurgizishi xulosasi (25.11.2026)

Topshiriqlar: `00-promptlar.md`. AI: Claude Haiku ×2 (agent), har biri o'z nusxasida — o'quvchi reposi (45071ac) + 2-amaliyotdagi `car` + `npm install` + o'z PostgreSQL bazasi (`baza.sh`). Tekshiruv: `ai-tekshir2.sh` (build, server, superadmin tokeni, 16 so'rov). Natijalar: `A-oddiy/`, `B-nest/`, `B-nest-tuzatilgan/`.

| | A · oddiy topshiriq | B · repo uslubidagi topshiriq |
|---|---|---|
| Besh qatlam (Entity · DTO · Service/BaseService · Controller · Module), core/index.ts, forFeature, AppModule | ✓ (telefon maydoni — `phone_number`) | ✓ |
| Himoya: guard'lar klass ustida, GET `@Roles('public')`, yozish superAdmin/admin | ✓ | ✓ |
| Terminal | 5 ta `Mapped {/api/v1/customer…}` | 5 ta |
| Tokensiz GET / POST | 200 / 401 | 200 / 401 |
| age 15 · `{}` · begona `id` · age `"20"` (matn) | 400 · 400 · 400 · 400 | 400 · 400 · 400 · 400 |
| `/customer/abc` | 400 «uuid is expected» — ParseUUIDPipe qo'ygan | **500** — `@Param('id') id: string` (car namunasidan); terminal: `QueryFailedError: invalid input syntax for type uuid: "abc"` |
| Takror telefon | **201 — ikkinchi mijoz o'sha telefon bilan** (unique yo'q; so'ralmagan) | **500** — unique bor (`UQ_…`), lekin 409 ga aylantirilmagan |
| Tokensiz PATCH/DELETE · token bilan age 12 · token bilan DELETE | 401 · 400 · 200 | 401 · 400 · 200 |

**Tuzatish (B-nest-tuzatilgan, yurgizilgan):** `findOne(@Param('id', ParseUUIDPipe) id: string)` → `/customer/abc` 400 «Validation failed (uuid is expected)», bor-yo'q uuid 404.

## Darsga haqiqiy material
1. Tuzilish va himoyani ikkala AI ham to'g'ri qildi — o'quvchi darsi m4a-04 dagi «ochiq yo'lni guard yopib qo'ydi» xatosi bu sinovda chiqmadi (darsda shunday aytiladi).
2. Begona maydonni AI emas, reponing o'zi to'xtatdi: `ValidationPipe({ whitelist, forbidNonWhitelisted })` — Nest-1 dagi takror id xatosi bu repoda mumkin emas.
3. **AI loyihadagi namunani zaifligi bilan birga ko'chiradi:** B `car.controller.ts` dagi `@Param('id') id: string` ni aynan ko'chirdi; darsning 13-ekranida `/car/1` → 500 aynan shu sababdan.
4. Takror unique qiymat: B da 500 (baza rad etdi, filtr 500 qaytardi), A da umuman to'xtatilmadi — mentor uchun kutilmagan so'rovlar ro'yxatiga «takror qiymat» qo'shildi.

## Halol cheklov
Ikkala AI bir model (Haiku). O'quvchi KitobShop'da Copilot agentidan foydalanadi — boshqa model boshqacha yozishi mumkin.
