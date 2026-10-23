# QA uchun namuna: `codestrike` maydoni bor JSX dars (23.10.2026)

Abdulloh, salom!

So'ragan namuna tayyor: **InternetLesson** (`lesson_id: internet-01-v18`, CRM'da Class 2374 ↔ Learn 3148).

```text
Fayl:    internet-01-v18-codestrike-20261023.jsx  (472 KB)
SHA-256: 92dcd1c78c78e6e84e55c2dd5707c063dd8cc6d4a40607da49f9365dfbced019
MD5:     fd63869bc99bf8567fdfb539ed2ee77e
```

Prod Dars API manzili bilan yig'ilgan (22.10 dagi preview-namuna kabi). Preview-tuzatish (22.10) ichida.

## Nima o'zgardi (faqat JSON)

`onFinished` JSON'ida (`question_try.answer`) ikki o'zgarish, boshqa maydonlar avvalgidek:

1. `detailsVersion: 2` → **`3`**
2. Yangi ustki maydon:

```json
"codestrike": {
  "played": true,
  "total": 12,
  "answered": 12,
  "correct": 8,
  "percent": 67,
  "passed": true,
  "mode": "student"
}
```

- `passed` = `correct >= 7` (12 dan 7).
- `played: false` → o'quvchi arenada birorta savolga javob bermagan (`answered 0`, `correct 0`, `passed false`, `mode null`).
- `mode`: `student` (sinfda, mentor bilan) yoki `solo` (yolg'iz, mentorsiz).
- Qaror **birinchi** o'yin bo'yicha: arenani qayta o'ynash, dars ichidagi «Qaytadan», `review` rejimida qayta «Tamom» — `codestrike` o'zgarmaydi (muhr ichida).
- `questions[]` ichidagi `kind: "arena"` yozuvlar avvalgidek turadi (tafsilot uchun).

Yangi: `solo` rejimda ham arena natija beradi (avval mashq edi). Solo arena javoblari bizning serverga **ketmaydi**, faqat JSON'ga.

## QA'da sinash tartibi

| # | Holat | Qanday | JSON'da kutilgan |
|---|---|---|---|
| T1 | sinfda, 8/12 | mentor darsni ochadi, arenani boshlaydi, o'quvchi 8 ta to'g'ri | `played:true, correct:8, passed:true, mode:"student"` |
| T2 | sinfda, 5/12 | o'sha, 5 ta to'g'ri | `passed:false` |
| T3 | sinfda, arena boshlanmagan | mentor arenani ochmasdan dars yakunlanadi | `played:false, passed:false` |
| T4 | uyda (solo), 7/12 | mentorsiz o'quvchi darsni ochadi, arenani o'zi o'ynaydi | `passed:true, mode:"solo"` |
| T5 | uyda, 3/12, keyin qayta o'ynab 12/12 | «Qayta o'ynash» tugmasi | `correct:3, passed:false` (birinchi o'yin) |
| T6 | T2 dan keyin review'da qayta «Tamom» | tugagan darsni qayta ochish | ikkinchi `question_try` ham `passed:false`, Learn holati o'zgarmasligi kerak |

Learn (3148) hozir bo'sh va Draft, «mavzu» orqali 2374 ga bog'lanmagan. Sinov uchun bog'lashni o'zingiz qilasizmi yoki biz CRM'da qilaylikmi, ayting.

Boshqa darslar: shu o'zgarish umumiy modulda, hamma dars qayta yig'ilganda avtomatik keladi. Muddatni Azizbek alohida aytadi.
