# ERTALABKI HISOBOT — 21.09 tun (1–4c modullar LMS'ga tayyorlandi)

> Topshiriq (21.09 01:50): «bitta papka — hozirgi darslar, yangi avtomatlashtirishga to'liq mos; ertalab LMS'ga
> yuklayman». Javoblar: 1-A (darslar + uyga-vazifa) · 2-A · 3-A (tartib raqamli nomlar) · 4-A (faqat o'zi-yetarli
> fayllar) · 5-A (to'liq sifat-o'tishi). Qo'shimcha: **PM uyga-vazifasi topshirilganda `onFinished` avtomat ketsin.**

## 1. Yuklash papkasi — tayyor

**`yuklash-2026-09-21/`** — 7 modul papkasi, **88 fayl**: 70 dars + 18 uyga-vazifa.

| Papka | Modul | CRM bo'limi | Dars |
|---|---|---|---|
| `1-Modul` | Men internetdaman | M1 (ildiz) | 14 |
| `2-Modul` | Sistemalar qanday o'ylaydi | M2 (ildiz) | 13 |
| `3-Modul` | Frontend — React | **4-M** | 14 |
| `4-Modul` | Ma'lumot va backend | **5-M** | 15 |
| `4a-Modul` · `4b-Modul` · `4c-Modul` | NestJS · Testlash · CI/CD | **6-M** | 4 · 3 · 7 |

- Fayl nomi: `NN-DarsNomi.jsx` — **NN kursdagi tartib raqami** (`src/App.jsx` registridan, yagona haqiqat manbai).
- Uyga vazifa: `NN-PmLessonX-uyga-vazifa.jsx` — o'sha darsning yoniga qo'yilgan.
- Har modulda **`ROYXAT.md`**: tartib · tur · sarlavha · `lesson_id` · md5. Ildizda **`README.md`** — yuklash tartibi.
- Hamma fayl **prod** manzili bilan (`dars-api.coddycamp.uz`), o'zi-yetarli (qo'shimcha modul kerak emas).

## 2. Tuzatilgan nuqson — uyga vazifa LMS'da belgilanmasdi (F-0921-01)

**Topildi:** 18 ta uyga-vazifa paketining hammasida `onFinished` **faqat** «Vazifani topshirish» tugmasi bosilganda
ketardi. Tugma bosilmasa yoki sahifa yopilsa — LMS hech narsa olmasdi; qayta ochilganda ham yuborilmasdi.
Ya'ni o'quvchi vazifani bajarsa ham ptichka yonmasligi mumkin edi.

**Tuzatildi (18 paket):**
1. Bosqichlar bajarilganda topshirish **avtomat** ketadi (tugma qoladi — bosilgach «✓ Topshirildi»).
2. Yuk **muhrlanadi** — takror yuborishda aynan o'sha mazmun (LMS `idempotency_key` 409 dan himoya).
3. Vazifa qayta ochilsa va allaqachon topshirilgan bo'lsa — yuk **bir marta qayta** yuboriladi (ptichka tiklanadi).
4. Bo'sh vazifa hech qachon topshirilmaydi.

**Isbot:** yangi sinov `scripts/smoke-homework.mjs` (haqiqiy brauzer) — **36/36** (18 paket × uz/ru).

## 3. Sifat o'tishi — nima tekshirildi

| Tekshiruv | Natija |
|---|---|
| Har fayl brauzerda ochiladi va xatosiz ishlaydi | **88/88** ✓ |
| **Dars to'rt rejimda: self · mentor · jonli o'quvchi · uyda** | **70/70** ✓ (yangi sinov, F-0921-02) |
| `lesson_id` bor va serverdagi katalogda mavjud | **88/88** ✓ |
| Prod manzili to'g'ri, staging aralashmagan | **88/88** ✓ |
| Nishon kalitlari katalog bilan mos, tavsiflar uz+ru to'liq | **70/70** ✓ |
| Ruscha qoplama (uz kalitlariga nisbatan) | **70/70** ✓ |
| Yakun-ma'lumoti (LMS'ga ketadigan) — uz va ru | **70/70** ✓ (seal smoke) |
| Nishon/ball qoidalari (151–154-qonun) brauzer-probda | **160/160** ✓ |
| Darvozalar, `lint:jsx`, til/dark farqi | ✓ · farq 0 |

### Yopilgan eski bo'shliq (F-0921-02)

`mentor` va jonli `student` rejimlari shu paytgacha **faqat kod o'qish** bilan tekshirilgan edi. Endi yangi sinov
(`scripts/smoke-rejim.mjs`) har darsni to'rt rejimda haqiqiy brauzerda ochadi: dars chiziladi, matn bo'sh emas,
sahifa/konsol xatosi yo'q, mentor rejimida jonli panel ko'rinadi. **70/70 toza.** Bu — sinfda «oq ekran» xavfini
ancha kamaytiradi.

## 4. Aniqlik — `PmLesson7` yuklanmaydi

Kecha «ro'yxatda yo'q» deb belgilagandim; tekshirdim — u **eski versiya**: `src/App.jsx:45` da ochiq yozilgan
(«PM pipeline P0 — eski PmLesson7 o'rnida»), o'rnini `PmUserStoryLesson` egallagan. Faylda nishon ham, ball ham,
ruscha ham yo'q; u faqat solishtirish vositasida qoladi. Shuning uchun to'liq ro'yxat — **70 dars**.

## 5. Sizdan kutilayotgani

1. **Yuklash** — `yuklash-2026-09-21/` papkasidan modul-modul.
2. **Staging sinovi** (kechagi kelishuv) — `staging-sinov/AgentArchitectureLesson.jsx`, md5 `108e2a34…`:
   409 tuzatilgani va yakuniy test balini oxirigacha tasdiqlaydi.
3. **Axadulla javobi** — kalit qoidasi va «natija saqlangan bo'lsa qizil xato ko'rsatmaslik».

## 6. Ochiq savol (kichik)

Uyga vazifa endi bosqichlar tugashi bilan **o'zi topshiriladi** — o'quvchi «Vazifani topshirish» tugmasini bosishi
shart emas. Agar «o'quvchi o'zi bosib topshirsin» degan qoida muhim bo'lsa, ayting — avtomat topshirishni faqat
sahifadan chiqishda ishlaydigan qilib o'zgartiraman.
