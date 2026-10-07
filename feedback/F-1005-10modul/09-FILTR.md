# 9-dars «Loyiha kuni: prodga ko'tarish — 2-qism» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 7/10 (pedagogika 9 · code review 9 · Git/PR 8 · production yakuni 5.5). Hukm: **Qabul 12 · Qisman 2 · Savolga chiqdi 1 · Allaqachon tuzatilgan 3 · O'zgarishsiz 2**.
Auditor ham eski versiyani ko'rgan: `git add .`, «Prodga tayyor» sarlavhasi va «bir haftada» qisman 07/08-FILTR sinf-supurishida tuzatilgan edi.
Zaxira: scratchpad `09-oldin-filtr.md`, `tayanch-oldin-09filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | **`synchronize: true` yopilmagan — merge Render'ga chiqaradi (blocker)** | **Qisman + savol 09-q0** | Siz GATE M M-q2 A da «kod o'zgarmaydi, migratsiya — keyingi modullarda» deb qaror qilgansiz — o'zim bekor qilmayman. Tekshirdim: bu PR'da jadval fayllari o'zgarmaydi (8-darsda `variant` ustuni saqlanadi) — birlashtirish Database jadvaliga tegmaydi, auditor aytgan xavf aynan shu merge'da yo'q. Shunga qaramay xavf haqiqiy (jadval fayli o'zgargan kod chiqsa, TypeORM prod jadvalini o'zi o'zgartiradi; laptop ham o'sha Neon'ga yozadi). Qo'llandi: A3 4-qadam — birlashtirishdan oldin «Files changed»da `….entity.ts` yo'qligi, bor bo'lsa — mentor bilan; O'qituvchi eslatmasi; README «keyin»; REPO tekshiruvi. Kod o'zgarishi — **09-q0**. |
| 2 | Review «albatta kamchilik topadi» deb o'rgatmaslik | **Qabul** | A-bo'lim natijasi: «review'dan chiqqan (topilmasa — Mentor bergan) bitta kamchilik» + «kamchilik topmasligi ham normal»; A2 4-qadam; kamchilik atamasi; kartochka. |
| 3 | «Approve» — birlashtirish sharti emas | **Qabul** | A3 4-qadam: «Bu repo'da «Approve» birlashtirish uchun shart emas — u tuzatishni qayta ko'rganining belgisi.» TAYANCHGA SAVOL 11 yopildi. |
| 4 | Code review ta'rifi tor | **Qisman** | Ta'rif (tayanch, so'zma-so'z) qoladi; «izoh» ta'rifi kengaytirildi — «fikri yoki savoli»; kartochka izohi «Izoh savol ham bo'lishi mumkin; har review kamchilik topmaydi»; tayanch 2. Arena 2 ✔ varianti uzaymasin (36 — boshqalari 39–41). |
| 5 | «Kamida ikkita izoh» soxta kamchilik yasatadi | **Qabul** | A2 2-qadam: «savol, taklif yoki haqiqiy kamchilik bo'lishi mumkin — kamchilik bo'lmasa, uni o'ylab topmang»; O'qituvchi eslatmasiga yaxshi savol namunalari. |
| 6 | «Backend har so'rovni ko'radi» — mutlaq | **Qabul** | «chegara Backend'ga kelgan har so'rovga ishlaydi» — hook javobi (116), 0-ekran, izoh 2, A2 namunasi, `REVIEW.md`. |
| 7 | `/ega` kamchiligi 8-dars holatiga bog'liq; asosiy kamchilikni `synchronize` ga ko'chirish | **Qisman** | Bog'liqlik qayd etildi: 8-dars REPO «holat faqat o'yinchi sahifasida» — «qur» da shu holatda muzlatiladi (TAYANCHGA SAVOL 3). Ko'chirish — 09-q0 javobiga bog'liq (B tanlansa, `synchronize` ikkinchi kamchilik bo'ladi). |
| 8 | `/ega` qayta so'rovi ustma-ust ketishi mumkin | **Qabul** | A3 namunasi: «oldingi so'rov tugamasdan yangisi ketmasin»; «o'yinchi sahifasidagi qayta so'rash kodini qayta ishlat» (bitta yordamchi); REPO. |
| 9 | Ctrl+C — kechikish testi emas | **Qabul** | A3 2-qadam: «Bu tekshiruvda Backend umuman javob bermaydi; sekin javob holati o'tgan darsdagi sahnada ko'rilgan.» |
| 10 | «Prodga tayyor» PR sarlavhasi | **Allaqachon tuzatilgan** | 08-FILTR sinf-supurishi: «Prod ro'yxati: …» (4 joy). |
| 11 | PR «Sabab»da A/B — ortiqcha kuchli | **Qabul** | «B: kuzatilgan foiz yuqoriroq (A — 42 tadan 12, B — 40 tadan 17); 82 ta brauzer hali kam — hozircha qoladi, kuzatiladi»; izoh 1 javobi, `REVIEW.md`, kartochka («isbot emas»), arena 11 ✔ «Hozircha B foizi yuqoriroq chiqdi» (✔ o'rni C). |
| 12 | «Bir haftada» — 8-dars SQL bilan bir xil bo'lsin | **Qabul** | 8-dars bilan bir xil: «B ishga tushgandan beri» — A-bo'lim 5, izoh 1, PR tavsifi, kartochka, arena; tayanch 1. |
| 13 | Force push zaxirasi xavfli | **Qabul** | Uch blokda «Ortda qoldingizmi — **faqat mentor bilan** (`-f` `prod` dagi commitlaringizni o'chiradi):» — accent ogohlantirish, buyruqlardan oldin. `main` ga `-f` yo'q. |
| 14 | `git add .` | **Allaqachon tuzatilgan** | 07-FILTR sinf-supurishi: `git status` → agent aytgan fayllar va `REVIEW.md`. |
| 16 | Izoh qolipi — universal qoida emas | **Qabul** | «Bu darsdagi qolip; savol bo'lsa — «Taklif» o'rniga savolingiz» (A-bo'lim, A2 2-qadam). |
| 17 | «Approve» uchun zaxira yo'l | **Qabul** | A3 4-qadam: «Sinfdosh ulgurmasa yoki GitHub ochilmasa — mentor ko'rib, «ko'rdim» izohini qoldiradi» (P-026). |
| 15 · 4-ekran (izoh odamga emas) | — | **O'zgarishsiz** | Auditor tasdiqladi — darsning eng kuchli joylari. |
| Sarlavhalar | — | **O'zgarishsiz** | Hammasi saqlandi (auditor ham). |
| Tayanch 1–12 | Auditor qarorlari | **Allaqachon / mos** | 1, 2, 4, 6, 7, 8, 9, 10, 12 — MD bilan mos; 5 — ogohlantirish qo'shildi; 11 — 3-band; 3 — 7-band. |

**Sinf-supurish:** «har so'rovni ko'radi» — 11 MD: faqat 9-dars (6 joy). «code review topgan bitta kamchilik» — faqat 9. «bir haftadan keyin» — tayanch 1. Retry ustma-ust — 3, 8, 9-darslar endi bir xil.
lint:til 09 va tayanch — eski ogohlantirishlar (zaxira bilan bir xil), yangi topilma 0.
