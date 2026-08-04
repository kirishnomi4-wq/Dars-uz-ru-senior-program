# TZ — LMS (Coddy Camp) ↔ Jonli dars: o'quvchi-shaxsni token bilan uzatish

**Versiya:** 1.1 · **Sana:** 2026-08-04 · **Buyurtmachi:** Darslik-platforma jamoasi · **Bajaruvchi:** LMS (Coddy Camp) jamoasi

---

## 1. Maqsad — nima uchun kerak

Hozir o'quvchi jonli darsga qo'shilishda **ismini qo'lda yozadi**. Natijada:
- ismlar har xil yoziladi («Ali», «ali7», «AliBek😎») — natijani jurnalga bog'lab bo'lmaydi;
- o'quvchi boshqaning ismini yozib olishi mumkin — reyting ishonchsiz;
- qurilma almashsa yoki brauzer tozalansa, o'quvchi qayta kira olmaydi («ism band»).

**Yechim:** LMS o'quvchini allaqachon taniydi (login qilgan). LMS dars-havolasiga
**imzolangan token** qo'shib beradi; dars-sahifa tokendan ism-familiya, guruh va
o'quvchi-ID'ni oladi. O'quvchi **ism yozmaydi** — faqat mentor aytgan PIN'ni kiritadi.
Ismni soxtalash imkonsiz: token imzosi maxfiy kalit bilan tekshiriladi.

Oqim:

```
O'quvchi LMS'ga kiradi → LMS'da «Darsga o'tish» tugmasi
        → LMS token yasaydi (imzolangan)
        → havola: https://<dars-domen>/<dars-sahifa>#lt=<TOKEN>
        → dars-sahifa tokenni o'qiydi → ism-maydon chiqmaydi
        → o'quvchi faqat PIN kiritadi → darsga o'z ismi bilan qo'shiladi
```

LMS tomonda **hech qanday API ochish shart emas** — butun ish «Darsga o'tish»
havolasini yasashda. Taxminiy hajm: 20–30 qator server-kod.

---

## 2. LMS qiladigan ishlar (qisqa ro'yxat)

1. Maxfiy kalit yaratish va server-muhitda saqlash (6-bo'lim).
2. «Darsga o'tish» bosilganda **JWT (HS256)** token yasash (3-bo'lim).
3. Havolani `#lt=<token>` formatida ochish (4-bo'lim).
4. Sinov-vektor bilan tekshirib, qabul-mezonlarini yopish (7–8-bo'limlar).

---

## 3. Token spetsifikatsiyasi

Format: **JWT, algoritm HS256** (HMAC-SHA256). Boshqa algoritm ishlatilmaydi
(`none`, RS256 va h.k. — taqiq; qabul-tomonda faqat HS256 tekshiriladi).

### Payload maydonlari

| Maydon | Turi | Majburiy | Tavsif | Misol |
|---|---|---|---|---|
| `sub` | string | ✅ | O'quvchining LMS'dagi **o'zgarmas ID'si**. Ism o'zgarsa ham ID o'zgarmaydi | `"st_1042"` |
| `name` | string | ✅ | To'liq ism-familiya, LMS-profildagi rasmiy yozuv (2–48 belgi) | `"Ali Valiyev"` |
| `grp` | string | ✅ | Guruh nomi (LMS'dagi rasmiy nom) | `"F7-A"` |
| `mnt` | string | ⬜ | Guruh mentorining ismi (bo'lsa) | `"Aziz aka"` |
| `iat` | number | ✅ | Token yasalgan vaqt (Unix soniya) | `1754300000` |
| `exp` | number | ✅ | Amal muddati tugashi (Unix soniya). **`iat` + 12 soat** | `1754343200` |

Qoidalar:
- `name` — aynan profildagi «Ism Familiya» (o'quvchi o'zi tahrirlaydigan nickname EMAS,
  admin/registratsiyada kiritilgan rasmiy yozuv).
- `exp` = 12 soat: bitta o'quv kuni yetadi; havola ertasiga ishlamaydi (bosilganda
  LMS yangi token bilan yangi havola beradi, shuning uchun o'quvchi buni sezmaydi).
- Token **har bosilganda yangi** yasaladi (statik saqlab qo'yilmaydi).

### Namuna payload (JSON)

```json
{ "sub": "st_1042", "name": "Ali Valiyev", "grp": "F7-A", "iat": 1754300000, "exp": 1754343200 }
```

---

## 4. Havola formati

```
https://<dars-domen>/<dars-sahifa>#lt=<JWT>
```

- Token **`#` (hash) qismida** yuboriladi, `?` (query) da EMAS. Sabab: hash-qism
  serverga, log'larga va Referer sarlavhasiga tushmaydi — token izi qolmaydi.
- Parametr nomi: `lt` (live token).
- Dars-sahifa manzillari biz tomondan alohida ro'yxat bilan beriladi (har dars —
  bitta sahifa). LMS'da har dars-kartochkaga o'z havolasi bog'lanadi.
- Havola **yangi tabda** ochilsa ham, LMS ichida **iframe**da ochilsa ham ishlaydi —
  LMS'ga qulayi tanlanadi.

---

## 5. Kod-namuna — PHP (token yasash)

Kutubxonasiz, «toza» variant — istalgan PHP 7.4+ da ishlaydi, composer shart emas.
(Loyihada `firebase/php-jwt` allaqachon bo'lsa, undan foydalanish ham mumkin —
quyida muqobil variant bor.)

### 5.1. Asosiy variant (kutubxonasiz)

```php
<?php
// JWT (HS256) — jonli darsga o'quvchi-token
function b64u(string $s): string {
  return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

function makeLiveToken(array $student, string $secret): string {
  $now = time();
  $header  = b64u(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
  $payload = b64u(json_encode([
    'sub'  => $student['id'],        // o'zgarmas o'quvchi-ID
    'name' => $student['fullName'],  // profildagi rasmiy "Ism Familiya"
    'grp'  => $student['groupName'], // guruh nomi
    'iat'  => $now,
    'exp'  => $now + 12 * 3600,      // 12 soat amal qiladi
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  $sig = b64u(hash_hmac('sha256', "$header.$payload", $secret, true));
  return "$header.$payload.$sig";
}

// Ishlatish — "Darsga o'tish" tugmasining havolasi:
$secret  = getenv('LIVE_TOKEN_SECRET');            // .env dan (7-bo'lim)
$student = [
  'id'        => 'st_' . $user->id,
  'fullName'  => $user->last_name . ' ' . $user->first_name,
  'groupName' => $group->name,
];
$url = 'https://<dars-domen>/<dars-sahifa>#lt=' . makeLiveToken($student, $secret);
```

Muhim: `JSON_UNESCAPED_UNICODE` bayrog'i shart — aks holda kirillcha ismlar
`\u04..` ko'rinishida ketadi (ishlaydi, lekin sinov-vektor mos kelmaydi).

### 5.2. Muqobil — `firebase/php-jwt` bilan (loyihada bo'lsa)

```php
use Firebase\JWT\JWT;

$token = JWT::encode([
  'sub'  => 'st_1042',
  'name' => 'Ali Valiyev',
  'grp'  => 'F7-A',
  'iat'  => time(),
  'exp'  => time() + 12 * 3600,
], $secret, 'HS256');
```

### 5.3. O'z kodini tekshirish (sinov-skript)

Quyidagini bir marta ishga tushirib, chiqqan token 7-bo'limdagi kutilgan token
bilan AYNAN bir xilligini solishtiring:

```php
<?php
// test_token.php — sinov-vektor tekshiruvi
require 'makeLiveToken.php'; // yuqoridagi funksiyalar

$secret  = 'TEST_KALIT_faqat_sinov_uchun_almashtiriladi_2026';
$student = ['id' => 'st_1042', 'fullName' => 'Ali Valiyev', 'groupName' => 'F7-A'];

// Sinov uchun vaqtni qotiramiz (haqiqiy kodda time() ishlaydi):
// makeLiveToken ichida $now = 1754300000; deb vaqtincha o'zgartiring.
echo makeLiveToken($student, $secret);
```

---

## 6. Maxfiy kalit (secret) talablari

1. **Yaratish:** kamida 32 baytlik tasodifiy qator. PHP'da bir qatorda:
   `php -r "echo bin2hex(random_bytes(32));"`
2. **Saqlash:** faqat LMS **server**-muhitida (env-o'zgaruvchi, masalan
   `LIVE_TOKEN_SECRET`). Frontend-kodga, git-repoga, brauzerga TUSHMAYDI.
3. **Almashish:** kalit ikkala tomonda bir xil bo'ladi (biz uni dars-platforma
   serveriga qo'yamiz). Almashish faqat xavfsiz kanalda — chat/email'da OCHIQ
   yuborilmaydi (bir martalik maxfiy-havola xizmatidan yoki og'zaki/qo'lda).
4. **Rotatsiya:** kalit sizib chiqqan deb gumon bo'lsa — yangi kalit yasaladi,
   ikkala tomon bir kunda almashtiradi. Eski tokenlar shu zahoti kuchdan qoladi
   (bu normal — o'quvchi LMS'dan qayta bosib kiradi).

---

## 7. Sinov-vektor (o'z kodini tekshirish uchun)

Quyidagi kirish bilan LMS-kod **aynan** quyidagi tokenni chiqarishi shart
(bir belgi ham farq qilmasin):

- Sinov-kalit: `TEST_KALIT_faqat_sinov_uchun_almashtiriladi_2026`
- Payload (kalitlar aynan shu tartibda, JSON bo'shliqsiz):
  `{"sub":"st_1042","name":"Ali Valiyev","grp":"F7-A","iat":1754300000,"exp":1754343200}`

Kutilgan token:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdF8xMDQyIiwibmFtZSI6IkFsaSBWYWxpeWV2IiwiZ3JwIjoiRjctQSIsImlhdCI6MTc1NDMwMDAwMCwiZXhwIjoxNzU0MzQzMjAwfQ.vYPyJrfTP-bUA9f4qPKnhVjv5buC9umzHsE6MNYrm9Q
```

Eslatma: JWT kutubxonasi ishlatilsa payload-kalit tartibi farq qilishi mumkin —
bu XATO EMAS (imzo baribir to'g'ri tekshiriladi). Sinov-vektor «toza» namunalar
(5-bo'lim) uchun aniq mos keladi.

---

## 8. Qabul-mezonlari (LMS tomoni «tayyor» sanaladi, qachonki)

- [ ] «Darsga o'tish» tugmasi `#lt=<token>` bilan havola ochadi (yangi tab yoki iframe).
- [ ] Token 7-bo'lim sinov-vektoriga mos (sinov-kalit bilan tekshirilgan).
- [ ] `name` — profildagi rasmiy «Ism Familiya» (nickname emas).
- [ ] `sub` — o'zgarmas o'quvchi-ID (ism o'zgarsa ham shu qoladi).
- [ ] `exp` = yasalgan vaqt + 12 soat; har bosilganda token yangidan yasaladi.
- [ ] Maxfiy kalit faqat server-muhitda; frontend/repoda yo'q.
- [ ] 2–3 haqiqiy o'quvchi-akkauntda birga sinov o'tkazildi (biz bilan kelishilgan vaqtda).

---

## 9. Savol-javob

**Token ochiq ko'rinadi-ku — bu xavfli emasmi?**
Token ichida sir yo'q (ism, guruh, ID — baribir darsda ko'rinadi). Muhimi —
uni **o'zgartirib bo'lmasligi**: bir belgi o'zgarsa imzo mos kelmay qoladi.

**O'quvchi havolani do'stiga yuborsa-chi?**
Do'sti o'sha o'quvchi nomidan kiradi — bu hozirgi «istalgan ismni yozish»dan
xavfsizroq: kamida kim kimga havola berganini aniqlash mumkin (`sub` bor).
Istalsa keyingi bosqichda qattiqroq bog'lash mumkin, hozircha shart emas.

**LMS'da o'quvchi tizimga kirmagan bo'lsa?**
«Darsga o'tish» tugmasi faqat login qilingan o'quvchiga ko'rinadi — bu LMS'ning
o'z odatiy himoyasi, qo'shimcha ish talab qilmaydi.

**Mentor ham LMS orqali kiradimi?**
Bu bosqichda YO'Q — mentor avvalgidek o'z mentor-kodi bilan kiradi. Keyingi
bosqichda xuddi shu token-mexanizmga `role: "mentor"` qo'shish mumkin (TZ v2).

---

## 10. Aloqa va tartib

1. LMS jamoasi TZ bo'yicha savollarini yozadi → javob beramiz.
2. LMS sinov-kalit bilan qurib, sinov-vektorni tekshiradi.
3. Birga jonli sinov (2–3 akkaunt) → qabul-mezonlar yopiladi.
4. Haqiqiy maxfiy kalit almashinadi → ishga tushadi.
