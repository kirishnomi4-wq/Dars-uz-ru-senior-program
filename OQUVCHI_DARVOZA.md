# O'QUVCHI-SINOVI — pipeline'ga qo'shish (v2, teshiklar yamalgan)

## Yangi oqim

```
Quruvchi (+SCREEN_INTENTS) → Dizayn → Animatsiya → Jonli
    ↓
👦 O'quvchi (1-o'qish)
    ↓ hisobot
🎓 Metodist — tuzatadi / oqlaydi / rad etadi (sabab bilan)
    ↓
👦 O'quvchi (2-o'qish)
    ↓
TIL-LINT (qoladi!) → Tekshiruvchi → Verifikator
```

PM-pipeline'ga ham xuddi shu joyga kiradi: Jonli'dan keyin, Tekshiruvchi'dan oldin.

---

## SCREEN_INTENTS — Quruvchining yangi majburiyati

Har ekranga 1 gaplik niyat. Dars faylining boshida yoki yonida:

```js
// SCREEN_INTENTS — har ekran nima uchun mavjud (Quruvchi yozadi, O'quvchi tekshiradi)
const SCREEN_INTENTS = {
  s0: "Bola dars oxirida nima qila olishini ko'radi",
  s3: "Bola formulaning uch qismini birinchi marta ko'radi",
  s7: "Bola ortiqcha qismni bosib topadi",
};
```

**Yozish qoidasi:** niyat = bola nima QILADI yoki nima BILADI. «Ekran chiroyli
ko'rinadi» niyat emas. Niyatni bir gapda yoza olmasang — ekran ikkiga bo'linishi
kerak degani.

Bu «yozishdan oldingi 3 savol»ning birinchisi bilan bir xil savol — endi u
javob sifatida faylda qoladi va o'lchov-kaliti bo'ladi.

---

## O'tish shartlari (yangilangan)

2-o'qishdan keyin:

| Mezon | Talab | Izoh |
|---|---|---|
| Niyatga moslik | ≥ 13/15 ekran | O'quvchining 1-javobi ≈ SCREEN_INTENTS |
| «Bilmadim» | 0 ekran | 1-savolga javob berolmaslik |
| Gloss'siz so'z | 0 ta | Oqlanmagan va rad etilmagan |
| Gloss-tartib xatosi | 0 ta | So'z o'rgatilishidan oldin ishlatilgan |
| Ikki marta o'qilgan gap | ≤ 2 ta | Butun darsda. **Sanalmaydi:** (a) test-materiali ataylab-takror bo'lsa (takrorni ko'rish — testning o'zi), (b) distraktor-variant ustida ikkilanish (uning vazifasi shu), (c) darsning markaziy-g'oya gapi — 1 martagacha (chuqur o'ylash ≠ tushunmaslik). Faqat KO'RSATMA/IZOH-matnlarining qayta-o'qilishi sanaladi. (2026-07-24 UserStory 2-o'qish saboqi) |

**Aylanish-cheklovi:** maksimum 2 aylanish (o'qish → tuzatish → o'qish → tuzatish).
Ikkinchi aylanishdan keyin ham o'tmasa — inson-ko'rikka chiqadi, agent aylanmaydi.

---

## Oqlash / rad etish mexanizmi (aylanish-tuzog'iga qarshi)

Rol o'ynagan simulyator DOIM nimadir topadi. Shuning uchun uch himoya:

**1. Avto-oqlanish (agent darajasida).** Dars gloss bergan so'zlar hisobotga
tushmaydi. Bu darslik-oquvchi.md'ning 1-bo'limida.

**2. Metodist-oqlashi.** Hisobotdagi har topilmaga Metodist uch javobdan birini beradi:

```
| Topilma | Qaror | Sabab |
|---|---|---|
| «bo'lak» bilinmadi | OQLANDI | 41-qonun: dars formulasi o'zi o'rgatadi (s2) |
| «artefakt» bilinmadi | TUZATILDI | «natija» ga almashtirildi |
| «kuchli» chalkash | RAD | kontekstda aniq; 2-o'qish tasdiqlasa qayta ko'riladi |
```

Qaror-jadval hisobotda qoladi, Verifikator ko'radi. Sababsiz RAD taqiqlanadi.

**3. RAD-tekshiruvi.** Bir xil topilma ikkala o'qishda ham chiqsa va ikkalasida ham
RAD bo'lsa — Verifikator'ga alohida bayroq: «ikki marta rad etilgan topilma»,
inson hal qiladi.

---

## TIL-LINT qoladi — front-ajratish

| Front | Qo'riqchi | Nima tutadi |
|---|---|---|
| Mashina-to'g'rilik | TIL-LINT (grep) | Homoglif (ball-kalit sindiradi: picked↔correctIdx, arena-solishtirish), apostrof-escape, belgi-formula |
| Til-tozalik | Metodist | Taqiq so'zlar, kalka, kanselyarizm |
| Tushunish | 👦 O'quvchi | Chigal savol, gloss'siz atama, mavhum ko'rsatma, niyat-mosligi |

Uch qatlam, uch xil xato-sinf. Birortasi ikkinchisini almashtirmaydi.
Homoglif bolaning tushunishiga ta'sir qilmaydi, lekin string-solishtirishni
sindiradi — shuning uchun u lint-front, o'quvchi-front emas.

---

## Kalibrlash (joriy qilishdan oldin, bir marta)

Darvoza sifatida yoqishdan oldin ikki sinov:

**Sinov A — sezgirlik.** Agentni ESKI, tuzatilmagan darsda yuritish.
Kutilma: inson-ko'rik topgan xatolarning ko'pini topishi kerak
(metafora-fiasko, chigal savol, gloss'siz atama).

**Sinov B — shovqin.** Agentni UserStory'da (6 marta tuzatilgan) yuritish.
Kutilma: topilmalar KAM bo'lishi kerak. Ko'p topsa — rol juda qattiq
sozlangan, avto-oqlanish kengaytiriladi.

O'tish mezoni: A'da inson-topilmalarning ≥70% i, B'da ekran boshiga ≤1 topilma.
Ikkalasi bajarilsa — darvoza yoqiladi. Aks holda agent-prompt sozlanadi va qayta.

**✅ KALIBRLASH O'TDI (2026-07-24):**
- **Sinov A** (eski PmJtbdLesson-v2): o'quvchi-frontga tegishli inson-topilmalarning ~80%+ topildi
  (bosh-ish «boshning ishi?» · drel · custdev-gloss tasdiqlandi); UX-mexanika topilmalari (flip-toggle,
  mentor-reveal) topilmadi — TO'G'RI, ular tekshiruvchi-front. Bonus: JTBD-karta gloss-tartib xatosi
  (yangi xato-sinf ishladi), s12 statik-checkbox «bosib urindim», Keys/mos-yozuv/Reflection/streak glossiz.
- **Sinov B** (6x tuzatilgan PmUserStoryLesson): «bilmadim» 0/17 · niyat-moslik 16/17 ·
  ~0.6 topilma/ekran (≤1 mezoni) · rol-halolligi saqlangan (soxta topilma yo'q, «taxminan» belgilangan).
- Darvoza YOQILDI: PIPELINE.md + PM_PIPELINE.md oqimlariga 👦 (1-o'qish/2-o'qish) kiritildi.

---

## Fayl joylashuvi

```
.claude/agents/role/darslik-oquvchi.md   ← agent (tools: Read, Grep, Glob — tahrir YO'Q)
PIPELINE.md                               ← oqimga 👦 qo'shiladi (2 joy)
PM_PIPELINE.md                            ← xuddi shunday
Dars fayli                                ← SCREEN_INTENTS konstanta
```

Agent ataylab tahrir-huquqisiz: o'quvchi o'qiydi, yozmaydi. Tuzatish faqat
Metodist orqali — rol-ajratish shu bilan kafolatlanadi.
