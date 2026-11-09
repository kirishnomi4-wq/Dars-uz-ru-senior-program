# F-1105-03 — ish rejasi (06.11.2026)

Asos: `07` va `10` (Abdulloh). Chiqarish kunini faqat foydalanuvchi aytadi. Shahzoda — foydalanuvchining ishi.

## Umumiy oqim

```
0. JSON namunalari ──► Abdulloh tasdiqlaydi
1. Biz kod yozamiz (dars-api + src/live)      ║  Abdulloh parallel: o'z qabul qiluvchisi (School API, Learn, coin)
2. Lokal sinov: soxta qabul qiluvchi + 10 ssenariy
3. QA: bitta dars, Abdulloh bilan birga — 10 ssenariy
4. Abdulloh «qabul» ──► server prod ──► 172 dars yangi versiyada (dars vaqtidan tashqari, kunni foydalanuvchi aytadi)
```

## 0. JSON namunalari (Abdullohga hujjat `13-JSON-NAMUNALAR-v1.md`)

Uch hodisa, har birida: versiya, `event_id` (har o'quvchi uchun alohida), majburiy maydonlar, vaqtlar (UTC ISO-8601), qabul javobi, takroriy yetkazish qoidasi.

| Hodisa | Qachon | Asosiy maydonlar |
|---|---|---|
| `lesson_result` | o'quvchi oxirgi ekranga birinchi yetganda; yetmaganga — sessiya yopilganda | qatnashdi, yakunladi (`completed`), qaysi ekrangacha, dars testlari natijasi |
| `arena_participation` | o'quvchi ekranida birinchi arena savoli ko'ringan lahza | o'quvchi, dars, sessiya, ko'rilgan birinchi savol, vaqt |
| `arena_result` | arena yakunida (mentor / 1 daq / 45 daq / sessiya yopilishi) | har savol javobi, ball, podium; «qatnashmadi» va «kirdi, 0 javob» ajratiladi |

Bizning taklif sifatida: «o'quv qismida qatnashgan» ta'rifi (`10`, 3.1 da ochiq).

## 1. Kod — bizning tomon

**dars-api** (`/home/kali/Desktop/dars-api-coddy`):
- migratsiya `0012` (0011 — F-1106-01 qayta yig'ish): `opened_at`; `answer_attempts.correct` → `null` ruxsat; arenada qatnashish jadvali; hodisalar har o'quvchiga;
- uch hodisani yaratish va yuborish (qayta urinish: bir xil id — bir xil mazmun);
- vaqt chegaralari: arena oxirgi savoldan 1 daq · arena 45 daq · sessiya 2 soat;
- takror: birinchi yakunlangan arena hisobga olinadi; o'quv natijasi va arena takrorlari alohida;
- yangi RPC: «arena savoli ko'rindi» (o'quvchi ekranidan);
- **eski darslar bilan moslik** — server birinchi chiqadi, eski darslar buzilmasligi shart;
- analitika view'lari (ism yo'q; matn faqat ≥5 o'quvchida takrorlangan noto'g'ri javoblar).

**src/live** (172 dars shu orqali):
- natija «Darsni yakunlash» tugmasini kutmaydi; tugma faqat chiqish;
- arena savoli ekranga chiqqanda serverga xabar;
- ekran ochilgan vaqt; practice «Bajardim» har qadam; tekshiruvsiz practice `correct: null`.

## 2. Lokal sinov

Soxta qabul qiluvchi (lokal stek) + `07` 8-bo'limdagi 10 ssenariy avtomatik test sifatida (bizning tomondan ko'rinadigan qismi).

## 3. QA — bitta dars

Taklif: `netlify-deploy-v19` (Class 2429, Learn 3170, savollar 14085/14086 — Abdulloh va Shahzoda shu darsni tekshirgan).
Abdulloh bilan birga 10 ssenariy, kompyuter + mobil.

## 4. Chiqarish

Abdulloh qabul qilgach: dars-api prod → 172 dars yangi versiyada (G retsepti: `LMS_DEPLOY.md`, `LMS_REESTR.json`). Kunni foydalanuvchi aytadi.

## Alohida — Abdulloh bizdan so'ragan (prod bazadan faqat o'qish, kirish kerak)

- prod `STALE_SESSION_MINUTES` va solo yopilish muddati;
- GW 69 sessiyasi va oktyabr yig'masi eksporti (shaxsiy ma'lumotsiz);
- 02.11 dan keyingi xabarlar: `event_id`, holat, HTTP status, xato;
- `lms_participants.crm_id` to'lyaptimi.
