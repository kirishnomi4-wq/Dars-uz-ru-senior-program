# P5 — matn takliflari (4c + 6-Modull) — darsga TEGILMAGAN, tasdiq kutadi

Manba: B to'lqin P5 partiyasi (2026-09-18 tun). KORPUS §63 (48 belgi), §133 (tavsif rost), §184 (bonus tavsifi qilingan
ishni aytadi) o'qildi. Hech bir taklif darsga qo'llanmagan.

| Dars · ekran | ❌ hozirgi (aynan iqtibos) | ✅ taklif (uz · ru) | Sabab |
|---|---|---|---|
| CiCdIntroLesson · s9 · `clearedForTakeoff` (bonus, `desc`) | «Barcha buyumlarni tuzatib, samolyotni ko'tardingiz» · «Вы исправили все вещи и подняли самолёт» | «Chamadonni lentadan to'liq yashil o'tkazdingiz» (46) · «Вы провели чемодан по ленте до зелёного» | Qum-quti ekrani: faqat buzuq bo'lmagan buyumni (masalan `savatcha.js`) tanlagan o'quvchi hech narsa tuzatmasdan yashil oladi — «barcha buyumlarni tuzatib» shu yo'lda yolg'on (§133). Taklif ekranning o'z savolini («Chamadonni yig'ing va lentaga to'liq yashil o'tkazing») aytadi — hamma yo'lda rost (§184). |
| FullPipelineProjectLesson · s10 · v2 yorlig'i | `tag`: «yashil, oxirgi ishlagan» · «зелёная, последняя рабочая» | «yashil» · «зелёная» (v1 bilan bir xil) | Topshiriq «qaysi versiya oxirgi ishlagan?» — yorliq javobni o'zi yozib qo'ygan; tanlov o'qishga aylanadi va `safeReturn` nishoni deyarli kafolatli. Yorliqsiz o'quvchi o'ylaydi: buzuq v3 dan oldingi yashil — v2 (v1 undan ham eski). Mentor matni («Jurnaldan qaysi versiya oxirgi ishlagan versiya ekanini toping») o'zgarmaydi. |
| PmLesson17 · s9 · `eyebrow` | `eyebrow="Tekshiruv · darvoza"` (ru yo'q — ruscha darsda ham o'zbekcha chiqadi) | `tr({ uz: 'Tekshiruv · darvoza', ru: 'Проверка · ворота' })` | i18n-qarz (matn mazmuni o'zgarmaydi). Doiradan tashqari — faqat qayd. |

## Yon-kuzatuvlar (matn emas — qaror uchun)

- **ClaudeSkillsLesson s7 · `beforeAfter`** (to'g'ridan-to'g'ri `earn`, `data.bonus`): xatodan keyin ham beriladi — direktiva
  bo'yicha BONUS, tegilmadi. Darsda boshqa kafolatli nishon yo'q (`graduate` yo'q) → 152-qonun 1-band chegarasida.
  152-reyestrga qo'shilishi kerak.
- **PmLesson24 s9:** «Keyingi ish →» xato tanlov bilan ham ochiladi — topshiriq xato joylashuv bilan yopilishi mumkin (UX-savol,
  151 ga zid emas: birinchi xato `missed` ga yoziladi).
- **PmLesson25 s4 · `proofFinder`** (`ACH_EXTRA`): tanlov qotmaydi, qayta tanlab olsa bo'ladi — T9 (tashqi nishonlar) ishi, tegilmadi.
