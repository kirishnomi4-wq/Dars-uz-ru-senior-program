# Nest-1 / Nest-2 — «qaysi satr» tekshiruvida tuzatilgan ko'rinishning satr raqamlari (taklif, 01.11 avtopilot; TEGILMADI)

**Holat:** avtopilot davomida yangi darslarda (Jest-1, PG-2, Jest-2, CI/CD-1, Telegraf+PG, WebSocket-1/2, Webhook) tuzatilgan ko'rinishda har satrga fayldagi haqiqiy raqam (`n`) beriladi; o'chgan satr — raqamsiz va chizilgan. Nest-1 va Nest-2 fayllariga tegilmadi (topshiriq chegarasi), shuning uchun ularda dvigatel `i + 1` sanaydi: o'chgan satrlar ham raqam oladi, keyingi raqamlar siljiydi.

**Suratlar (1920, to'g'ri javobdan keyin, 01.11):** `nest1-tekshiruv2-hozir.png` · `nest1-tekshiruv4-hozir.png` · `nest2-tekshiruv2-hozir.png`.

| Dars · ekran | Ekranda hozir | Haqiqiy faylda | Ovoz / izoh nima deydi | Ko'rinadigan muammo |
|---|---|---|---|---|
| Nest-1 · 27 (Tekshiruv 4, `orders.module.ts`) | yangi `controllers` — **9**, yangi `providers` — **11**; chizilganlar 8 va 10 | 8 va 9 | ovoz (`ok`): «sakkizinchi satrda faqat OrdersController qoldi, PaymentService to'qqizinchi satrga …» | **ovoz 8/9 deydi, ekran 9/11 ko'rsatadi** |
| Nest-1 · 19 (Tekshiruv 2, `cars.controller.ts`) | yangi satr — **13**, chizilganlar 10–12 | 10 | «yana bitta satr» (raqam aytilmaydi) | raqam siljigan, lekin ovoz bilan zid emas |
| Nest-2 · 14 (Tekshiruv 2, `car.entity.ts`) | chizilgan import — 2, chizilgan `@IsNumber()` — 13, yangi `@Column()` — **14** | import olib tashlansa — 12 (yoki import qolsa — 13) | `okShort`: «13-satr: @IsNumber …» (xato satr — to'g'ri) | tuzatilgan satr raqami eski fayl bo'yicha ham, yangi fayl bo'yicha ham to'g'ri emas |

**Taklif (bir xil usul, yangi darslardagidek):** `LC*_FIXED` massivlarida har saqlanadigan satrga `n` (yangi fayldagi raqam), o'chgan satrga `n: ''`, yangi satrga `n` + `neu`. Masalan Nest-1 · 27:

```js
const LC2_FIXED = [
  ...LC2_LINES.slice(0, 7).map((l, i) => ({ ...l, n: i + 1 })),
  { gone: true, n: '', h: LC2_LINES[7].h },
  { neu: true, n: 8, h: `  controllers: [<span class="c">OrdersController</span>],   <span class="cm">// faqat Controller qoldi</span>` },
  { gone: true, n: '', h: LC2_LINES[8].h },
  { neu: true, n: 9, h: `  providers: [<span class="c">OrdersService</span>, <span class="c">PaymentService</span>],   <span class="cm">// Service — shu yerda</span>` },
  ...LC2_LINES.slice(9).map((l, i) => ({ ...l, n: 10 + i })),
];
```

Nest-1 · 19 — yangi satr `n: 10`, keyingi ikki yopuvchi qavs 11–12; Nest-2 · 14 — import qoladimi yoki olinadimi (hozir chizilgan) — shunga qarab `@Column()` 12 yoki 13. RU qismi (`parts/08-ru.jsx` — `ru(LC1_FIXED, …)` indekslari) massiv tartibi o'zgarmasa buzilmaydi; o'zgarsa — indekslar qayta tekshiriladi.

**Ta'sir:** Nest-1 va Nest-2 `.jsx` va `.oz.jsx` qayta yasaladi, ikkala dars qayta tekshiriladi (gates, e2e UZ+RU, render). Qaror — sizniki.
