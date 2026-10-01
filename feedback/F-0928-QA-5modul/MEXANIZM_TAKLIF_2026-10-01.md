# Dars qurish mexanizmi — taklif (01.10.2026, 5-Modul razrabotkasidan xulosa)

Foydalanuvchi maqsadi: u 5–6-Modul bo'yicha ko'p fidbek yuboradi, birma-bir tuzatiladi; keyin 7–14-Modul darslari yangidan quriladi.
Shu davomida HAMMA qonun, qoida, dizayn va mantiq har yangi darsda aniq ishlatilishi kerak → mexanizmni optimallashtirish.
Qaror sahifasi (vizual): artifact «Dars qurish mexanizmi» (havola — JURNAL F-1001-94). Javob kelgach — shu fayl asosida yangi seansda quriladi.

## Teshiklar (dalil — 01.10 razrabotkasi)
1. **Qoidalar 8 joyda tarqoq:** DARS_ETALON (3 239 qator), MATN_KORPUS (4 340), MATN_ETALONI, PM_DARS_ETALON, 5-Modul A1–A9/U1–U3 (`01-BotIntro-v2.md`), 6-Modul har v2 A-bo'limi, nomzodlar N1–N21 + `feedback/F-0929-LMS-yuklash/QONUN_NOMZODLARI.md`, `KORPUS_BRIDGE.md`.
2. **Bir xato darsdan darsga qaytdi:** reja qadamlari tugmaga o'xshaydi (10 → 4, 6 saytda edi) · ballsiz tanlov yashil (1 → 11) · telefonda «N-darsda» bo'linishi (1, 5, 10, 11, 12) · analitika `questionText` `tr()` da (1 → 12) · N20 ortiqcha qo'llandi (12). Sabab: sinf boshqa darslarda qidirilmaydi.
3. **Bor tekshiruvlar ishlatilmadi:** `lint:layout` (147-qonun: qirqilish, ustma-ust, chiqish, ⛶ yopilishi), `tools/page-audit.mjs`, `lint:dizayn` — `gates.mjs` ga kirmagan; 5-Modulda yangi `shots.mjs` yozildi (memory `darvoza-qurishdan-oldin-qidir` buzildi).
4. **Tekshiruvni agent o'qib qiladi:** bir dars 200–400 ming token, bir qoidani 12 agent qayta o'qiydi (memory `subagent-token-sarfi`).
5. **Konveyer shablonlari faqat 5-Modul papkasida** (`QURUVCHI_SHABLON` … `YAKUNIY_TOPSHIRIQ`, `vositalar/`).

## Taklif — oqim
Fidbek (F-ID) → tashxis + tuzatish (rozilik) → **sinf-supurish** (hamma qurilgan darsda qidirish va tuzatish) → **reestrga qator** → skript (tekshirsa bo'ladigan) yoki qurish kartasi (qolgani) → yangi dars karta bo'yicha quriladi, skriptlar tekshiradi.

## Besh qism
- **A. Qoida reestri** — bitta fayl, har qoida bir qator: `ID · qoida (bir gap) · qamrov (hamma/tex/PM) · tekshiruv (skript nomi | ko'z) · manba F-ID`. 8 joy yig'iladi, takrorlar birlashadi; batafsil matn qonun fayllarida.
- **B. Iloji boricha skript** — matn (grep): emoji, «Вы», AI/ИИ, narx U+00A0, payload o'zbekcha; ekran (1280 + 390): chiziqchada bo'linish, qirqilish, ⛶, gorizontal aylanish, ballsiz tanlov rangi. Mavjud `lint:layout`, `lint:dizayn`, `lint:tell` kengaytiriladi, bitta buyruqqa.
- **C. Qurish kartasi** — skript ko'rmaydigan qoidalar bir sahifada (A6 navbat, A8 izoh bitta gap, test halolligi, bitta ip, A2 bir ma'no — bir so'z). Reestrdan yig'iladi.
- **D. Sinf-supurish** — retsept B ga yangi qadam (CLAUDE.md o'zgarishi — rozilik bilan).
- **E. Umumiy konveyer** — MD-birinchi zanjiri va shablonlar umumiy joyga (PIPELINE + `.claude/agents/`); modul yopish darvozasi: gates + telefon + koddan yakuniy MD; oldingi modul yakuniy MD si — namuna.

## Qarorlar (sahifada)
1. Nimadan boshlaymiz — A: avval mexanizm, keyin fidbek (taklif) · B: fidbek darhol, mexanizm yonida.
2. Reestr qayerda — A: yangi `QOIDALAR.md` (taklif) · B: DARS_ETALON ichida bo'lim.
3. Umumiy qonunlarga kim yozadi — A: bitta asosiy seans, qolganlari nomzod beradi (taklif) · B: hozirgidek, faqat nomzod.
