# Dars natijalari va analitika — taklif

**Kimga:** Kristina (server) · Shaxzod (product manager)
**Kimdan:** dars-platforma jamoasi · 2026-09-23

---

## 1. Hozirgi holat: natijalar allaqachon saqlanyapti

O'quvchi darsni LMS orqali ochganda natija LMS'ga yuborilishidan **oldin** bizning bazamizga yoziladi.
Bu baza sizning serveringizda, `dars-api` bilan birga Docker'da turibdi (`dars_prod`, PostgreSQL 16, har kecha zaxira olinadi).

Bazada nima bor:

| Nima | Mazmuni |
|---|---|
| Urinishlar | Qaysi o'quvchi (LMS ID), qaysi dars, jonli yoki mustaqil, qachon boshladi va tugatdi, oxirigacha yetdimi |
| Progress | Qaysi ekranda to'xtadi, har savolga bergan javobi, olgan nishonlari |
| Har bir javob | Nechanchi urinish, to'g'ri yoki xato, necha soniyada javob berdi |
| Yuborilgan natijalar | LMS'ga ketgan natijaning aynan nusxasi va u yetib bordimi-yo'qmi |
| Nishonlar | Qaysi nishon, qachon olindi |
| Jonli darslar | Mentor darsni qachon boshladi va tugatdi, qancha vaqt jim qoldi |

## 2. Muammo

Analitika uchun ma'lumotni hozir LMS'dan (`onFinished` orqali kelgan natijadan) olishga urinilyapti, bu esa qiyin va to'liq emas.
Aslida xuddi shu ma'lumot, hatto undan batafsilrog'i, bizning bazada **tayyor turibdi**.

## 3. Taklif: yangi baza emas, mavjud bazadan o'qish

Yangi baza ochish ham, ma'lumotni ko'chirish ham shart emas. Mavjud bazaga **faqat o'qish** huquqini beramiz:

1. **Biz** bazada alohida foydalanuvchi ochamiz, u faqat o'qiy oladi. Unga tayyor analitika jadvallari (view) qilamiz: dars bo'yicha, o'quvchi bo'yicha, savol bo'yicha.
2. Maxfiy narsalar (tokenlar, parollar, kalitlar) bu foydalanuvchiga **ko'rinmaydi**.
3. **Siz** MCP'ni yoki boshqa analitika vositasini shu foydalanuvchi orqali ulaysiz. Ma'lumot real vaqtda keladi.

Bu o'zgarish GitLab orqali odatdagi deploy bilan chiqadi. Bizning tomonda ish **1 kun**.

## 4. Kimdan nima kerak

| Kim | Nima |
|---|---|
| **Kristina** | 1) Yangi foydalanuvchi parolini `.env.deploy` ga qo'yish (parolni alohida yuboramiz). 2) MCP'ni bazaga Docker tarmog'i ichidan ulash. Bazaning portini tashqariga ochish shart emas |
| **Shaxzod** | Analitikada qaysi savollarga javob kerakligini aytish (masalan: «qaysi darsda o'quvchilar ko'p to'xtaydi?», «qaysi savolda ko'p xato qilinadi?»). Shunga qarab jadvallarni tayyorlaymiz |
| **Biz** | Faqat o'qiydigan foydalanuvchi, analitika jadvallari, qisqa yo'riqnoma, staging'da sinov, keyin prod |

## 5. Bilish kerak bo'lgan cheklovlar

- Bazaga faqat **LMS orqali ochilgan** darslar tushadi.
- Bazada o'quvchi faqat LMS ID bilan turadi, ism-familiya sizning tizimingizda. Bu 13–17 yoshli bolalar ma'lumoti, shuning uchun kirish faqat o'qish uchun va kerakli ustunlar bilan cheklanadi.
- Agar ma'lumot aynan sizning bazangizda turishi shart bo'lsa, uni uzluksiz ko'chirib berishimiz ham mumkin. Bu yo'l uzoqroq: bizning tomonda 3–4 ish kuni, siz bilan birga 5–7 kun.

---

**Javob kutamiz:** shu yo'l bilan ketamizmi? «Ha» bo'lsa, Shaxzoddan savollar ro'yxatini olib, ishni boshlaymiz.
