# Kechki sinov — qadamma-qadam yo'riqnoma (2026-09-09)

Ishlatish: foydalanuvchi «boshladik» deydi → Claude `lms-watch` ni yoqadi → har qadamni shu yerdan aytadi →
foydalanuvchi «bo'ldi» deydi → Claude logdan tasdiqlaydi → keyingi qadam. Shoshilmaymiz, birma-bir.

## Akkauntlar
| Belgi | Login | Parol | Rol |
|---|---|---|---|
| M-1 | +998800850202 | (o'zingizda) | O'qituvchi, guruh **1071** |
| M-2 | +998800850303 | | O'qituvchi 2, guruh **1072** |
| T-1 | +998800850101 | | TA, 1071 |
| O-1 | 998945848654 | | o'quvchi, 1071 faol |
| O-3 | 998935885045 | | o'quvchi, 1071 **muzlatilgan** |
| O-4 | 998504595975 | | o'quvchi, 1072 |
| O-5 | 998950145778 | | o'quvchi, 1071 + 1072 |

Guruhlar: https://go.coddycamp.uz/account/group_list/detail/1071 · .../1072
Berilmagan: X-1 (guruhsiz) va V-1 (vaqtincha mentor) → band 8, 9a, 9b ochiq qoladi.

## 0. Tayyorgarlik (sinovdan OLDIN, shart)

**0a. CRM test-materialiga yangi yig'ma.**
Fayl: `lms/InternetLesson.jsx` (2026-09-09 da qayta yig'ilgan).
Eski nusxa qolsa — sinov behuda: `elapsed_ms`, `at`, `earned_at`, `solved` yana eskicha chiqadi.
Tekshirish: yuklangan faylni ochib `ccDetails:` so'zini qidiring — bo'lsa yangi nusxa.

**0b. O'quvchi brauzerida DevTools.**
O-1 tabida dars ochilishidan OLDIN: `F12` → **Network** → **Preserve log** belgisini yoqing.
Dars tugagach shu yerdan LMS frontining so'rovi topiladi → **Request payload** → faylga saqlanadi
(`onFinished` JSON — Axadulla shuni so'rayapti). Zaxira yo'l: LMS jamoasi bazasidan chiqarib beradi.

## 1. Qadamlar

| # | Kim | Nima qiladi | Nimani kutamiz |
|---|---|---|---|
| 1 | M-1 | 1071 guruhidan darsni ochadi | watch: `YANGI live · gid 1071` · ekranda «Kod: ###» |
| 2 | O-1 | LMS'da darsni ochadi (DevTools yoqiq!) | PIN so'ralmaydi, ism LMS'dan keladi |
| 3 | O-1 | F5 bosadi, keyin inkognitoda ham ochadi | o'yinchi soni o'zgarmaydi |
| 4 | O-5 | LMS'da ochadi | ikkinchi o'quvchi qo'shiladi, PIN yo'q |
| 5 | O-3 | ochadi (muzlatilgan) | tushunarli xabar, oq ekran EMAS; watch'da yangi yozuv yo'q |
| 6 | O-4 | ochadi (1072, dars ochilmagan) | «Mustaqil rejim» |
| 7 | M-1 | 1072 sahifasidan urinadi | ruxsat yo'q; 1071 sessiyasi davom etadi |
| 8 | O-1 | **darsni oxirigacha o'tadi**: bitta savolda avval XATO keyin to'g'ri · **s15 savoliga javob** (Unicode dalili) · 2+ yutuq | urinishlar o'sadi |
| 9 | M-1 | «Erkin qilish» | natija ketadi: HTTP 201 |
| 10 | O-1 | brauzerdan `onFinished` JSON ni saqlaydi (0b) | fayl qo'lda |
| 11 | Claude | `sinov-natija.mjs --gid 1071 --onfinished <fayl>` | 5 tekshiruv ✓ · xabar tayyor |
| 12 | T-1 | 1071 dan dars ochadi | yangi sessiya, eskisi almashadi |
| 13 | O-1 | darsni qayta ochadi | «Ko'rish rejimi», javoblari ko'rinadi |
| 14 | O-1 | «Qaytadan boshlash» → 3-ekranda yopadi → boshqa qurilmada ochadi | 3-ekrandan davom etadi |
| 15 | M-1 + M-2 | ikkalasi bir vaqtda dars ochadi (1071 va 1072) → O-5 kiradi | «Qaysi darsga kirasiz?» tanlovi |
| 16 | Foydalanuvchi | CRM'ga ikkinchi dars (HtmlLesson1) va eski JSX (`16-eski-InternetLesson-177ee1a.jsx`) | ishlaydi · PIN-darvoza, oq ekran yo'q |

## 2. Sinovdan keyin
- Claude: dalillarni yig'adi, Axadulla'ga xabar-loyihasini beradi (foydalanuvchi yuboradi)
- Protokol §4 jadvali va §5.2 to'ldiriladi, STATE'ga raund-yozuv
