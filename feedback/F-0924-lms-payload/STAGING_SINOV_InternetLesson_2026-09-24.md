# Staging sinovi — InternetLesson, `onFinished` v2 (F-0924-20) · 2026-09-24

> Maqsad: LMS qo'shimcha maydonli payloadni qabul qiladimi, o'quvchi qizil xato ko'rmaydimi.
> O'tsa — 104 dars + 18 uyga vazifa paketiga tarqatiladi. O'tmasa — pastdagi rollback.

## 1. Fayl

| | |
|---|---|
| Yuklanadigan fayl | `lms-staging/InternetLesson.jsx` |
| Hajm · md5 | 479 071 bayt · `d1fb0b9fe1d6938bdd70f622d174d7dc` |
| API | `https://staging-dars-api.coddycamp.uz` (yig'mada 2 joy) |
| Rollback (o'zgarishsiz v1, staging URL) | `feedback/F-0924-lms-payload/rollback/InternetLesson.v1-staging.jsx` · 475 814 bayt · `4bff5ad350850001b7440d0634364584` |

Qayerga: staging'dagi 2848 sinov-joyi (18.09 va 20.09 da shu joy ishlatilgan). Yuklagach CRM'dagi fayl hajmi 479 071 bo'lishi kerak.

## 2. Nima o'zgardi (dars kodi TEGILMAGAN — faqat `src/live/`)

Payloadga `buildResultDetails` ichida qo'shildi, ya'ni muhr (`sealPayload`) ICHIDA:

| Maydon | Ma'nosi |
|---|---|
| `detailsVersion: 2` | sxema raqami |
| `missed[]` | birinchi urinishda xato qilingan test-savollar `question_id` ro'yxati |
| `totalScreens` | darsdagi ekranlar soni (InternetLesson: 22) |
| `startedAt`, `finishedAt` | o'tish boshlanishi va yakuni (UTC ISO) |
| `retake` | `{pressed:false}` · `{pressed:true, lastPass:{totalQuestions, correctAnswers, scorePercent, durationSec}}` · `null` = saqlov yo'q |
| `truncated`, `truncatedFields` | hajm-shifti (48 KB) ishlagan bo'lsa `true` + nima qisqargani; odatda `false` |

Asosiy raqamlar (`passed`, `scorePercent`, `questions[]`) avvalgidek — «Qaytadan» bo'lsa birinchi o'tishdan (151-qonun).
Namuna: `smoke-internet-v2-payload.json` (oddiy) · `smoke-internet-v2-retake-payload.json` («Qaytadan» bosilgan).

## 3. Bizda tekshirilgani (24.09 13:40–13:45)

- unit `src/live/resultDetails.test.mjs` **18/18** (5 yangi: v2 maydonlar · progClear-kontekst · «Qaytadan» · muhr ichida bir xil bayt · hajm-shifti)
- `gates` InternetLesson: esbuild ✓ · jsx ✓ · keys ✓ · prompt ✓ · **dark 🔴 (11) · til 🔴 (1 «-ku»)** — fayl HEAD bilan AYNAN bir xil, bu eski qarz, shu ishdan emas
- `lint:jsx` 166 fayl toza
- smoke `onFinished` brauzerda: manba ✓ · **yig'ilgan staging fayl ✓** · «Qaytadan» yo'li ✓ (`retake.pressed:true`) · PmUserStoryLesson ✓ (boshqa naqsh) — pageerror 0

## 4. Sinov qadamlari (test-o'quvchi bilan)

1. Brauzer: `Ctrl+Shift+R`. DevTools → Network, filtr `question_try`.
2. Darsni o'tish: bir savolda **ataylab xato** → to'g'rilash → oxirigacha → «Keyingi dars →».
3. Kutiladi: `question_try` → **HTTP 200**, javobda `correct: true`; so'rov tanasi (Payload) → `answer` ichida `"detailsVersion":2` bor; `next_lesson_access` → **completed**; ekranda yashil «Dars muvaffaqiyatli yakunlandi», qizil YO'Q.
4. Takror-sinovlar (har birida yana `question_try` 200, **409 yo'q**):
   - yakun tugmasini **ikki marta** bosish;
   - **F5** → yana bosish;
   - **«Qaytadan»** → oxirigacha → bosish (payloadda `retake.pressed:true`).
5. Axadullaga: dars ID, vaqt, `question_try` so'rovining Content-Length (Network → Headers). U CRM'da saqlangan `answer` uzunligi bilan solishtiradi.

## 5. Yiqilsa

Vaqt · dars ID · Network'dagi `question_try` va `next_lesson_access` **javoblari** (tokensiz) · konsol xatosi → menga. Rollback: 1-bo'limdagi v1 faylni o'sha joyga qaytarib yuklash.

## 6. O'tsa — keyingi qadam

`smoke:onfinished` 104 darsda → `smoke-homework` 18 → yuklash papkasi qayta → JSX_NATIJA hujjati v2 (Shaxzod/Axadulla) → uyga vazifa paketlariga ham v2 (18 fayl, alohida). Commit — buyruq bilan.

---

## 8. 2-o'tish natijasi — 24.09 14:00–14:08 (HAR 17,4 MB, tahlil: `HAR_TAHLIL_2026-09-24_1408.md`)

**Yangi urinish ham QABUL QILINDI — 22.09 xato-holati endi yashil:**
- 14:00:19 «Qaytadan boshlash» → bizning server yangi urinish ochdi (`39e65639`), rejim **`student`** (jonli sessiya 191047 `live` edi).
- 14:08:23 «Darsni yakunlash» → `question_try` **200**, `answer` 6 164 b, `liveMode:"student"`, `detailsVersion:2`, `durationSec:483`, **0/5 birinchi urinish, `passed:false`**, har savolda 2–4 urinish, 4 tasi keyin yechilgan (`solved:true`) — aynan 22.09 da qizil xato bergan holat; CRM `correct:true`, echo ma'no bo'yicha AYNAN; `next_lesson_access` **200 completed**, `points:0, coins:0` (LMS ikkinchi yakunga mukofot BERMADI); ekranda «Tabriklaymiz».
- LMS tomonda 4xx/5xx/409 — **0**.

**Bitta 409 bor, lekin u BIZNING staging serverdan, LMS'dan emas:** 14:06:03 da jonli sessiya 191047 `ended` bo'ldi (mentor tomonidan yakunlangan bo'lsa kerak) → server o'quvchi urinishini yakunladi; o'quvchi 4-ekranda davom etayotgan edi → 14:06:17 `PUT /me/progress` → **409 `attempt_finished`** («Bu urinish yakunlangan…»). Klient buni jim qabul qiladi (progressSync: 409 → urinish `finished`), o'quvchi qizil toast ko'rmadi, sarlavha «Yakunlandi — javoblaringiz saqlandi» bo'ldi; keyingi `submit_answer/record_attempt` 200. Konsoldagi «🔴 1» — ehtimol shu. Payloadga ta'siri yo'q.

**Hali LMS'da isbotlanmagani:**
- **Ikki marta bosish** — HAR 14:08:43 da saqlangan, ikkinchi bosish undan keyin; `sinov-2.har` diskda YO'Q (dialog yopilgan). Yangi urinishda faqat 1 ta `question_try`. Muhr faqat unit-testda (18/18).
- **Dars ichidagi «Qaytadan»** (`retake.pressed:true`) — sarlavhadagi «Qaytadan boshlash» server-urinish ochadi, `retake` ga tegmaydi; brauzer-smoke'da isbotlangan, LMS'da yo'q.
- Rejim **`self`/solo** (jonli sessiyasiz) yo'li — ikkala o'tish jonli/review edi.

**Xulosa:** LMS qo'shimcha maydonli payloadni ikki xil rejimda saqladi, o'quvchi xato ko'rmadi. Tarqatish uchun bloklovchi topilma YO'Q. Qolgan uch band — qo'shimcha ishonch, xavf-belgisi emas.

---

## 9. 3-o'tish natijasi — 14:08–14:20 (`sinov-2.har`, tahlil: `HAR_TAHLIL_2026-09-24_1420.md`)

**Uchinchi rejim — `solo` — ham qabul qilindi. Endi uchala rejim isbotlangan:**

| Vaqt | Rejim (bizning server) | `question_try` | Payload | CRM |
|---|---|---|---|---|
| 14:00:04 | `review` (18.09 urinishi) | 200 | 1/5, `passed:false`, v2 | echo aynan, completed, points 3 |
| 14:08:23 | `student` (jonli 191047) | 200 | 0/5, `passed:false`, 2–4 urinish, v2 | echo aynan, completed, points 0 |
| 14:12:26 | **`solo`** (`/lms/restart` 14:08:49, urinish `30cd8fdb`) | 200 | 1/5, `passed:false`, 1–4 urinish, 5/5 solved, 4/4 nishon, `durationSec 216`, v2 | echo aynan, completed, points 0 |

LMS tomonda 4xx/5xx/409 — 0 (yagona 409 — 14:06:17, bizning server, §8). O'quvchi qizil ko'rmadi.

**«Ikki marta bosish» haqida — nega bo'lmadi va bu nimani anglatadi:**
- InternetLesson'da «Darsni yakunlash» faqat «Tabriklaymiz» oynasini ochadi, tarmoqqa hech narsa ketmaydi. Yuboradigan tugma — **«Tamom»** (`finishLesson` → `onFinished`).
- «Tamom» dan **1 soniya** ichida LMS `question_try` → `next_lesson_access` → **kurs sahifasiga o'tib ketadi** (14:12:27–28: `profile`, `module_lessons`, `course_student`). Shu sabab bir ochilishda ikkinchi «Tamom» bosib bo'lmaydi.
- Foydalanuvchining «X → yana Darsni yakunlash» harakati **hech qanday so'rov yubormagan** (14:12:28 dan 14:20:46 gacha HAR'da faqat bildirishnoma-poll). Ya'ni «qabul qilinmadi» EMAS, «yuborilmadi» — xato ham, muvaffaqiyat ham yo'q, birinchi «Tamom» yagona natija.
- Demak «bir kalit — ikki mazmun» (20.09 dagi 409) holati bu darsda LMS oqimidan chiqmaydi. Muhr (`sealPayload`) qo'shimcha himoya bo'lib qoladi (unit 18/18). **Real takror-yo'l bittagina:** tugagan darsni qayta ochib (review) «Tamom» bosish → yangi kalit → CRM'da yangi yozuv (14:00:04 da ko'rildi; LMS unga mukofot bermaydi — `points 0`).

**LMS'da isbotlanmagan (xavf emas):** dars ichidagi pastki «Qaytadan» (`retake.pressed:true`) — smoke'da ✓; F5 → «Tamom» (F5 dan keyin LMS review ochadi → yangi kalit, muhr saqlovdan aynan o'sha mazmunni beradi — unit ✓).

**Yakuniy hukm:** InternetLesson v2 payloadi LMS'da uch rejimda saqlandi, o'quvchi hech qachon xato ko'rmadi. Tarqatishga bloklovchi topilma YO'Q.
