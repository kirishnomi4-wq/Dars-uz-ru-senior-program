# F-1125-01 · Nest-2 AI bloki — haqiqiy AI yurgizishi (25.11.2026)

**Asos:** o'quvchi reposi `IntroNestArxitechture` (45071ac = GitHub HEAD) + mentor 2-amaliyotda qo'shgan `car` resursi (`car-qoshish.sh`) + `npm install` + o'z bazasi (`baza.sh`). Repo qoidalari: `/api/v1` prefiksi, BaseService, `AuthGuard` + `RolesGuard` Controller ustida, ochiq yo'l `@Roles('public')`, ValidationPipe `whitelist` + `forbidNonWhitelisted`, id — uuid.
**Resurs:** `customer` (Nest-1 AI blokidagi bilan bir xil; 2-amaliyot `car` va uyga vazifa `brand` bilan to'qnashmaydi).
**AI:** Claude Haiku ×2 (agent), har biri o'z nusxasida.

## A · Oddiy topshiriq
> Loyihamga mijozlar bo'limini qo'shib ber. Mijozlar ro'yxatini ko'rish, bittasini olish, yangi mijoz qo'shish, o'zgartirish va o'chirish kerak. Mijozda ism, telefon va yosh bo'lsin, yoshi 18 dan kichik bo'lsa qo'shmasin. Ro'yxatni hamma ko'ra olsin, qo'shish, o'zgartirish va o'chirishni faqat admin qila olsin.

## B · Nest tilidagi topshiriq (repo uslubida)
> customer resursini car resursi bilan bir xil tuzilishda qo'sh.
> - core/entity/customer.entity.ts — BaseEntity'dan meros; name, phone (unique), age; core/index.ts'dan export.
> - api/customer/dto: CreateCustomerDto — class-validator: name va phone majburiy matn, age butun son, kamida 18; ApiProperty. UpdateCustomerDto — PartialType.
> - CustomerService — BaseService<CreateCustomerDto, UpdateCustomerDto, CustomerEntity> dan meros.
> - CustomerController — @Controller('customer'): POST, GET, GET :id, PATCH :id, DELETE :id. Guard'lar: AuthGuard va RolesGuard. POST, PATCH, DELETE — faqat superAdmin va admin (@Roles); GET'lar hammaga ochiq.
> - CustomerModule — TypeOrmModule.forFeature([CustomerEntity]), AppModule imports'ida.
> - Oxirida npm run build xatosiz o'tsin. Qaysi fayl yaratilgani va o'zgarganini yoz.

## Agent o'rami (ikkalasiga bir xil)
Nest-1 dagidek (faqat o'z papkasi, boshqa joyni o'qimaydi, push yo'q) + «serverni yurgizsangiz, PORT=3510 (A) / 3520 (B) bilan va keyin to'xtating».

## Mentor tekshiruvi (`ai-tekshir2.sh`)
build · server · Mapped `/api/v1/customer…` · tokensiz GET ro'yxat · tokensiz POST · superadmin token bilan POST to'g'ri · yosh 15 · bo'sh body · begona maydon (`id`) · noto'g'ri id (`abc`) · bor-yo'q uuid · tokensiz PATCH/DELETE · token bilan DELETE.
