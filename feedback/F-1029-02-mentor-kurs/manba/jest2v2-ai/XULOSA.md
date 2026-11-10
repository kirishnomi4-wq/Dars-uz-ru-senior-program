# Jest-2 v2 · AI tajribasi — XULOSA (F-1104-19, 04.11)

Prompt (ikkalasiga bir xil, ishorasiz): `p1-prompt.txt` — «order.service.ts dagi place funksiyasi va telegram.service.ts dagi telefon raqami tekshiruvi uchun edge case va xato holatlariga jest testlar yozib ber. npm test yashil bo'lsin.» Loyiha: OrderBotNest `jest1-done` (9d6b947), har agent alohida nusxada. Natijalar: `ai1/` (Opus), `ai2/` (Haiku) — `diff.patch`, `diff-stat.txt`, spec fayllari.

## Nima qildi
| | Opus (ai1) | Haiku (ai2) |
|---|---|---|
| Fayllar | 2 ta `.spec.ts` (352 qator), kodga tegmadi | 2 ta `.spec.ts` (224 qator), kodga tegmadi |
| Testlar | 50 (place 15 · telefon 25 · eski 10), yashil, `tsc` toza | 42 (place 12 · telefon 20 · eski 10), yashil, `tsc` toza |
| Promise xatosi | `await expect(run(…)).rejects.toThrow` — 10 ta; `await`siz `rejects` — 0; `toThrow` promise'da — 0 → jarayon qulamadi | `rejects.toThrow` 3, `expect(() => …).toThrow` 4 (sinxron throw uchun to'g'ri) — qulamadi |
| «Bo'lmasligi kerak» | `not.toHaveBeenCalled` 12 ta | `not.toHaveBeenCalled` 8 ta |
| Etalon koddan (`${…}`) | 0 | 0 |
| Telefon qoidasi | **Ajratmadi.** `PHONE` yashirin — butun `onText` orqali, 4 servis mock bilan (149 qator) | **Ajratmadi.** `onText` orqali, `new TelegramService(users, {}, cart, orders)` mock bilan (82 qator) |
| Probelli raqam | «o'rtada probel» `+998 90 123 45 67` → **rad etilishi kutiladi** (hozirgi xulq muhrlangan) | «ichida defis/bo'shliq» → **rad etilishi kutiladi** |
| O'z-tekshiruvi | O'zi 2 buzish qildi (`<` → `<=`, `{9,13}` → `{8,13}`), 2 test qizardi; 3 kuzatuv yozdi (manfiy `qty`, probel, sinxron throw) | — |

## Buzib tekshirish (`../jest2v2-mutatsiya.sh`, natija `mutatsiya-men.txt`, `mutatsiya-ai.txt`)
Qizargan testlar soni (0 = buzilish sezilmadi):

| Buzish | Men (25) | Opus (50) | Haiku (42) |
|---|---|---|---|
| B1 regex `{9,13}` → `{8,13}` (8 ta raqam o'tadi) | 1 | 1 | 2 |
| B2 `place`: `stock < qty` → `<=` | 1 | 1 | 1 |
| B3 `place`: `UPDATE` ombor tekshiruvidan oldin | 1 | 2 | 1 |
| B4 xabar «Telefon raqami yo'q» → «Raqam yo'q» | 1 | 3 | 3 |
| B5 bo'sh savat tekshiruvi olib tashlandi | 1 | 1 | 1 |

**Uchala to'plam beshala buzilishni ushladi.** (Birinchi o'lchovdagi xatolar — `git add -N` + `checkout` spec fayllarni bo'shatgani, untracked `phone.ts` qaytmagani — tuzatildi; `mutatsiya.txt` eski, `mutatsiya-ai.txt` va `mutatsiya-men.txt` haqiqiy.)

## Darsga saboq
1. Bu safar AI xato yo'lini **to'g'ri shaklda** yozdi: `rejects` + `await`, `not.toHaveBeenCalled`, chegara — jarayon qulagan holat chiqmadi. Darsda «AI buni xato qiladi» deb aytilmaydi; 11/13-ekrandagi tuzoqlar mentor o'zi yozganda chiqadigan tuzoqlar.
2. **Ikkala AI ham hozirgi xulqni muhrladi:** probel bilan yozilgan raqam rad etilishi «to'g'ri» deb test qilingan. Mentor 6-ekranda `replace` bilan tuzatsa, AI testi qizaradi. Test qoidani emas, kod hozir qanday ishlashini qo'riqlashi mumkin — qoidaning o'zi to'g'rimi, bu mentor qarori (6-ekran bilan bir). Bu buzib bo'lmaydigan «buzilish»: jadvalda yo'q, 21-ekranda alohida karta.
3. **Ikkala AI ham qoidani ajratmadi:** `PHONE` yashirin bo'lgani uchun uni butun handler orqali, 4 servisni soxtalab sinadi — 149 va 82 qator; `phone.ts` + `isPhone` bilan 4 qator va 8 test. AI mavjud tuzilmaga moslashadi, kodni testga qulay qilib o'zgartirishni taklif qilmaydi (Opus kuzatuvida aytdi, lekin qilmadi).
4. Mentor tekshiruvi (22-ekran): diff · `await` + `rejects` · «bo'lmasligi kerak» testi · etalon qo'lda · **har test «qoida» mi yoki «kod hozir shunday» mi** · buzib tekshirish.
