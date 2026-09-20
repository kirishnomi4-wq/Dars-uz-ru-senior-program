# «Natijani saqlab bo'lmadi» — 409 `submission_key_mismatch` (2026-09-20, staging sinovi)

Axadulla, salom. 18.09 dagi savolimizga qo'shimcha: bugun sababni oxirigacha aniqladik. Quyida — muammo, bizning
tomondan nima tuzatilgani va sizdan nima kerakligi.

## 1. Muammo (o'quvchi nimani ko'radi)

O'quvchi darsni yakunlaganda qizil xabar chiqadi: **«Natijani saqlab bo'lmadi. Qayta urinib ko'ring.»**
Shu paytda **rasmiy natija aslida saqlangan**: bizning server School API'ga yuborgan va **201** olgan (tanga, nishonlar,
to'g'ri javoblar — hammasi joyida). Ya'ni o'quvchi natijasi yo'qolmagan, lekin u «yo'qoldi» deb o'ylaydi.

## 2. Dalil (staging, dars 2848, savol 16594, bitta o'quvchi)

`POST go.coddycamp.uz/app/index.php?action=question_try` (vaqtlar UTC):

| Vaqt | `idempotency_key` | Javob |
|---|---|---|
| 13:38:48 … 13:45:23 — **23 ta so'rov** | `91b56f81-…` (hammasida bir xil) | **409** `submission_key_mismatch` |
| **13:45:29** | `737a1ef2-…` (LMS yangi kalit berdi) | **200 OK** |
| 13:45:30 … 13:47:06 — 8 ta so'rov | `737a1ef2-…` | **409** |

So'rovlar orasidagi **yagona farq — mazmun**: `durationSec` 473 → 475 → 476 → 516 → 654 → 864 …
Xulosa: qoida «bir kalit — bir mazmun». Kalit yangilanganda (13:45:29) birinchi yuborish darhol qabul qilingan.

## 3. Biz tomondan sabab va tuzatish

**Sabab (bizniki):** dars har «Yakunlash» bosilganda yakun-ma'lumotni qaytadan yig'ardi — o'tgan vaqt o'zgaradi, ya'ni
bitta kalit ostida har safar boshqa mazmun ketardi.

**Tuzatdik (bugun):** yakun-ma'lumot birinchi yuborishda muhrlanadi va brauzer saqlovida qoladi:
- sahifa yangilansa yoki o'quvchi qayta kirsa — **aynan o'sha bayt** yuboriladi;
- o'quvchi yangi urinish boshlasa («Qaytadan») — yangi urinish, yangi muhr, yangi mazmun.

Ya'ni bundan keyin bizdan bitta kalit ostida **faqat bir xil mazmun** chiqadi.

## 4. Sizdan kerak (uchta savol)

1. **Kalit nimaga bog'langan?** Dars ochilishigami, (o'quvchi + savol) juftligigami, yoki mazmun xeshigami?
   13:45:29 dagi 200 — yangi urinishda kalit yangilanishini ko'rsatadi; shuni tasdiqlaysizmi?
2. **Aynan bir xil takroriy yuborish** (masalan o'quvchi tugmani ikki marta bossa) — **200** qaytadimi, ya'ni idempotent
   hisoblanadimi? 18.09 dagi sinovimizda shunday edi.
3. **Eng muhimi — o'quvchiga ko'rinadigan xabar.** Rasmiy natija saqlangan bo'lsa, `question_try` dagi 409 uchun
   o'quvchiga qizil xato **ko'rsatmaslik** mumkinmi (jim qayd etib qo'yish)? Dushanbadan darslar boshlanadi —
   bu birinchi taassurotga to'g'ridan-to'g'ri ta'sir qiladi.

## 5. Qo'shimcha kuzatuv

Bitta «Yakunlash» dan keyin 4 soniya ichida **~15 ta bir xil so'rov** ketgan (13:45:19–23). Bu sizning tomondagi
qayta-urinish siyosatimi? Bilsak, biz ham o'z tomonimizdan tugmani birinchi yuborishdan keyin qisqa vaqtga bloklaymiz.

---

Qisqacha: sabab topildi, bizning qismimiz tuzatildi. Sizdan — kalit qoidasini tasdiqlash va 409 da o'quvchiga xato
ko'rsatmaslik. Kerak bo'lsa, brauzer yozuvini (tokensiz) yuboramiz.
