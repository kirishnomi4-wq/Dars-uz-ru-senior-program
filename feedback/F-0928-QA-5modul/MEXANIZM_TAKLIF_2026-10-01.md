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

## Qaror (02.10.2026 02:18 `date`, F-1002-50) — 1A · 2A · 3A
Foydalanuvchi: «Mexanizm — qarorlarim (1–3): 1) A — avval mexanizm, keyin fidbek 2) A — yangi fayl QOIDALAR.md 3) A — bitta asosiy seans».
Qurish — yangi seansda; o'sha seans umumiy qonun fayllariga yozadigan yagona (asosiy) seans.

## Qurish tartibi — yangi asosiy seans (har bosqich oxirida foydalanuvchi ko'rigi)
0. **Toza boshlanish.** Boshqa seanslar yopiq. Ularning commit qilinmagan ishi alohida commit qilinadi (buyruq bilan), aks holda yangi o'zgarish eskisiga aralashadi. 02.10 holati: umumiy qonun/jarayon fayllari 29.09 09:27 dan (11 fayl, +114 qator: retsept F, `gates` ga tell/emoji, til-lint qoidalari) · 6-Modul (14 fayl) · 1–4-Modul va kompilyator (~70 fayl) — hammasi uncommitted.
1. **`QOIDALAR.md`** — 8 manbadan yig'iladi; har qator `ID · qoida (bir gap) · qamrov · tekshiruv · manba F-ID`. Takrorlar birlashadi, bir-biriga zid qoidalar alohida ro'yxat (foydalanuvchi hal qiladi). «Tekshiruv» ustuni bo'sh qolmaydi: skript nomi yoki «karta».
2. **Skriptlar.** Avval borini o'lchash: `lint:layout`, `tools/page-audit.mjs`, `lint:dizayn`, `lint:tell` 5-Modulning 12 darsida yurgiziladi. Har yangi yoki kengaytirilgan detektor ikki sinovdan o'tadi: git tarixidagi xatoli versiyada xatoni topadi, tuzatilgan versiyada jim turadi. Shu isbotsiz detektor `gates` ga kirmaydi.
3. **Qurish kartasi** — reestrning «karta» qatorlari, bir sahifa; `QURUVCHI_SHABLON` qoidalarni qayta yozmaydi, kartaga havola qiladi.
4. **Retsept B ga sinf-supurish** (CLAUDE.md — rozilik bilan): tuzatilgan har xato hamma qurilgan darslarda qidiriladi; jurnalga natija yoziladi, topilmasa ham («qidirildi: N dars, 0»).
5. **Konveyer umumiy joyga** — shablonlar va `vositalar/` shu papkadan PIPELINE yoniga / `.claude/agents/` ga; modul yopish darvozasi bitta buyruq (gates + telefon + koddan yakuniy MD).
6. **Sinov:** yangi darvozalar 5- va 6-Modulning hamma darsida yurgiziladi → topilmalar ro'yxati. Shundan keyin fidbek davri boshlanadi.

## Holat (04.10.2026 23:00, ASOSIY seans — foydalanuvchi: «5-6 ni yopib mexanizmni to'liq sozlaylik, ertadan yangi darslar»)
- 0 ✅ (02.10) · 1 ✅ `QOIDALAR.md` (398 qator) · 2 ✅ darvozalar (`gates` 12; lint-qolip q1–q23; layout F/G; sarlavha; til sen-imperativ).
- **3 ✅ qurish kartasi** — `konveyer/QURISH_KARTASI.md`, reestrdan avtomatik (`npm run karta`, 110 qoida), qo'lda tahrirlanmaydi (JR-15).
- **4 ✅ retsept B ga sinf-supurish** — CLAUDE.md B 3a (JR-04).
- **5 ✅ konveyer umumiy joyga** — `konveyer/` (README zanjir + `1-MD` … `7-YAKUNIY`, `vositalar/`), yangi dars skeleti `src/skelet/NamunaDars.jsx`,
  modul yopish bitta buyruq `npm run modul:yopish` (JR-03, JR-14). Eski shablonlar «ESKI (tarix)» belgisi bilan qoldi.
- 6 (sinov) — `modul:yopish` 5-Modulda yurdi: ru qoldiq (3/4/7/9) va dizayn chiziqlari (1/4/11) topildi → qaror-sahifa Q5; birinchi to'liq sinov — 6-Modul G1.

