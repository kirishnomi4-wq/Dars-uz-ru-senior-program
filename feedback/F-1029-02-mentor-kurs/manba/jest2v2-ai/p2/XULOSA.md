# Jest-2 · 2-topshiriq «Jest tilida» — XULOSA (F-1125-01, 26.11)

Maqsad (foydalanuvchi 26.11, 2-savol A, «Faqat me'yor»): AI bo'limini Nest-1 darajasiga — bitta vazifa ikki xil topshiriq bilan (oddiy so'zlar · mavzu tili), mentor AI'ning haqiqiy satrini o'zi bosib topadi. Hayotiy misol qo'shilmaydi.
Topshiriq: `../p2-prompt.txt` (Jest tilida). Asos — 1-topshiriq (`../p1-prompt.txt`, 04.11) bilan bir xil: OrderBotNest `jest1-done` (9d6b947), git tarixsiz toza nusxa (`git archive` + `baza` commit), node_modules nusxa. Modellar ham bir xil: 1-AI Opus (agent), 2-AI Haiku (agent). Har AI o'z nusxasida, javobi aynan — `ai1/00-javob.md`, `ai2/00-javob.md`; diff — `ai*/diff.patch`.

## Natija (1-topshiriq bilan yonma-yon)
| | Oddiy (p1, 04.11) · 1-AI / 2-AI | Jest tilida (p2, 26.11) · 1-AI / 2-AI |
|---|---|---|
| Fayllar | 2 ta `.spec.ts`, kodga tegmadi · 352 / 224 qator | `phone.ts` + `phone.spec.ts` + `order.service.spec.ts`, `telegram.service.ts` da 2 satr · 114 / 90 qator |
| Testlar (eski 10 bilan) | 50 / 42 | 23 / 23 |
| Telefon qoidasi | **ajratilmadi** — butun `onText` orqali, 4 servis mock (149 / 82 qator) | **ajratildi** — `isPhone`, `it.each` 9 holat (17 qator) |
| `place` | `rejects` + `await` ✓, `not.toHaveBeenCalled` 12 / 8 | `toThrow` 2 (sinxron) + `await … rejects` 1 ✓, `not.toHaveBeenCalled` ✓, chegara (aynan 2) ✓ |
| 5 buzish (`../jest2v2-mutatsiya.sh`) | hammasi ushlandi (`../mutatsiya-ai.txt`) | hammasi ushlandi, har biri 1 test (`mutatsiya-p2.txt`) |
| Probelli raqam | rad etilishi «to'g'ri» deb muhrlandi | **yana muhrlandi**: 1-AI `phone.spec.ts` 13-satr `{ nomi: 'probel bilan', text: '+998 90 123 45 67', kutilgan: false }`, 2-AI 13-satr `['probel bilan yozilgan raqam', '90 123 45 67', false]` |
| 6-ekran tuzatishi (`replace(/[\s-]/g, '')`) | AI testi qizaradi | qizaradi: 1-AI va 2-AI — `1 failed, 22 passed` (`mutatsiya-p2.txt` B6) |

Tuzatish yurgizilgan (1-AI): `phone.ts` ga `replace` + 13-satr `kutilgan: true` → `Tests: 23 passed, 23 total` (`tuzatish-ai1.txt`).

## Darsga saboq
1. Mavzu tilidagi topshiriq tuzilishni o'zgartirdi: qoida ajratildi, testlar ikki barobardan ko'proq qisqa, beshala buzish baribir ushlandi.
2. Topshiriqda «probel bilan yozilgan raqam» holati so'ralgan, lekin kutilgan javob yozilmagan — ikkala AI javobni hozirgi koddan oldi va xatoni yana muhrladi. Qoidani (mijoz probel bilan yozsa ham qabul qilinadi) mentor aytadi.
3. So'ralmaganini qilmadi: «9 ta nol» (`000000000`, 6-ekran topilmasi) ikkala to'plamda ham yo'q — `isPhone('000000000')` hozir `true`, hech bir test sezmaydi.
4. Kichik farq: ikkala AI `isPhone` ichiga `.trim()` qo'ymadi (service ichida qoldi) — botda xulq o'zgarmagan, lekin `isPhone(' +998…')` to'g'ridan chaqirilsa `false`. Darsning `phone.ts` ida `trim()` funksiya ichida.

## Halol cheklov
Ikki model (Opus, Haiku) — mentor Gemini / Copilot ishlatadi, boshqacha yozishi mumkin. 1-AI tekshiruv paytida zaxira faylni bir lahza loyiha papkasidan bir pog'ona yuqoriga qo'ygan (scratchpad ichida, o'zi o'chirgan) — topshiriq natijasiga ta'siri yo'q. `.phone.bak` — bizning buzish skriptimizniki.
