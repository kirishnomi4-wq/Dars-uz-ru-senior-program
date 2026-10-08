
## Ataylab kiritilgan o'zgarish (26.09)
- `live.recordAttempt(...)` analitika-yuki: `lang: 'uz'` → `lang: (typeof __lang !== 'undefined' && __lang === 'ru') ? 'ru' : 'uz'` — 7 faylda ham, baseline-nusxalarda ham (PmLesson15–18 bilan bir xil naqsh; ru-gate TENG saqlanishi uchun baseline ham yangilandi). Sabab: RU rejimda javob-tahlili tilini to'g'ri yozish.
- PmLesson19 koding-tekshiruvi (`evalEquals`, L1554): o'quvchi chiqargan matn ikki tilda qabul qilinadi — `kerak`|`нужно`, `yigirmata odam bor`|`двадцать человек есть` (kirill `\u` escape bilan). Sabab: RU o'quvchi ruscha chiqarsa yiqilardi. Baseline ham shunga yangilandi.
