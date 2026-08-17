# LMS tashqi-modul sinovi — topshirish va tekshirish

> TZ: `LMS_TASHQI_MODUL_TZ.md` (10-bo'lim «Sinov-vektor», 11-bo'lim «Qabul-mezonlari»).
> Bu papkadagi ikki fayl — **haqiqiy dars emas**. Ular bitta savolga javob beradi:
> **LMS manzil orqali modulni yuklay oladimi va React BITTA nusxada qoladimi?**

## Fayllar

| Fayl | Nima |
|---|---|
| `sinov-modul.jsx` | Tashqi modul. Sof ESM, **JSX yo'q**, faqat `react` ni import qiladi. Eksportlar: `default` (tugmali komponent), `checks` (obyekt), `SINOV_VERSIYA` |

> 🔴 **Nega kengaytma `.jsx`, ichida esa JSX yo'q?** LMS yuklash oynasi faqat `.jsx`
> turini qabul qiladi (`.js` fayl ro'yxatda ko'rinmaydi — 2026-08-12 da o'lchandi).
> Fayl mazmuni sof ESM: brauzer uni kompilyatsiyasiz yuklay oladi. Kengaytma —
> shunchaki LMS talab qiladigan yorliq. TZ'dagi eski artifact manzili ham
> `…3653cce….jsx` bilan tugagan, ya'ni LMS artifactlari doim shu turda.
| `SinovDars.jsx` | Sinov darsi. Modulni manzil orqali import qiladi va ekranga chiqaradi |
| `mahalliy-sinov.png` | Bizda ishlagan holatning surati (quyida) |

## Bizda allaqachon tekshirilgan (2026-08-12)

Modul mahalliy muhitda ishga tushirildi — **ishlaydi**:

| Tekshiruv | Natija |
|---|---|
| `default` eksport turi | `function` ✅ |
| `checks.bor(...)` chaqiruvi | `true` ✅ |
| `SINOV_VERSIYA` o'qildi | `1.0.0` ✅ |
| Tugma bosildi: hisob 0 → 1 → 2 | ✅ (hook ishladi) |
| React | 19.2.7, bitta nusxa |
| Konsol xatosi | 0 |

Demak modulda muammo yo'q. Agar LMSda ishlamasa — sabab **yuklovchi tomonda**.

## Server tomoni — TEKSHIRILDI va TO'G'RI (2026-08-12)

Modul yuklangan manzil:
`https://go.coddycamp.uz/uploads/course_artifacts/2270fa1dcbebe770b3b8158dc8ff3265.jsx`

| Tekshiruv | Natija |
|---|---|
| HTTP | `200 OK` ✅ |
| `Content-Type` | `text/javascript; charset=utf-8` ✅ **(TZ 6-bo'limi bo'yicha tuzatilgan)** |
| CORS | `Access-Control-Allow-Origin: *` ✅ |
| Mazmun | mahalliy nusxa bilan **aynan bir xil** (2862 bayt) ✅ |

**Toza brauzerda (LMS'siz) ikki sinov:**

1. **Import-xaritasiz** `import(url)` → xato: `Failed to resolve module specifier "react"`.
   🔴 Bu **muvaffaqiyat belgisi**: brauzer faylni yuklab oldi, MIME turini qabul qildi va
   ES-modul sifatida tahlil qildi — faqat `react` nomini yecha olmadi (bu kutilgan, chunki
   `react` ni muhit beradi).
2. **Import-xaritasi bilan** (react CDN'dan) → modul **to'liq ishladi**: eksportlar
   `SINOV_VERSIYA · checks · default`, tugma 0 → 2, «✅ React BITTA nusxada», konsol xatosi 0.

**Xulosa:** modul, server va manzil — uchalasi ham to'g'ri. Agar LMSda ishlamasa,
sabab **LMS yuklovchisida**: u (a) manzilni yuklab olishi va (b) modulga **o'sha bitta**
`react` nusxasini berishi kerak.

---

## 🔴 LMS SINOVI NATIJASI (2026-08-12) — T-1 HALI BAJARILMAGAN

Sinov darsi LMSda ochildi. Natija:

```
Darsni kompilyatsiya qilib bo'lmadi
Bajarish xatosi: Modul topilmadi:
"https://go.coddycamp.uz/uploads/course_artifacts/2270fa1dcbebe770b3b8158dc8ff3265.jsx".
Mavjud modullar: react, react/jsx-runtime, react/jsx-dev-runtime, react-dom,
react-dom/client, framer-motion, motion/react, lucide-react, recharts, mathjs, @lesson/runtime
    at je (LessonRunnerQuestion.CxSBksv2.js:5:209)
```

**Bu xato 2026-08-10 dagi bilan so'zma-so'z bir xil** (TZ 2-bo'lim, «Sinov 2»).
Ya'ni dars-yurituvchi hamon **yopiq modul-ro'yxatidan** qidiryapti va manzilni
**yuklab olishga urinmayapti**. Faqat fayl-nomi o'zgargan (`LessonRunnerQuestion` ning
yangi xeshi) — demak deploy bo'lgan, lekin yuklovchi mantig'i tegilmagan.

### Nima tuzatilgan, nima yo'q

| Talab | Holat |
|---|---|
| Server: `Content-Type` (TZ 6-bo'lim) | ✅ **TUZATILGAN** — `text/javascript; charset=utf-8` |
| Server: CORS | ✅ ilgari ham to'g'ri edi |
| **T-1 — manzil orqali import** | 🔴 **BAJARILMAGAN** — yuklovchi o'zgarmagan |
| T-2 — bitta React | ⏸ tekshirib bo'lmadi (T-1 gacha yetmadi) |
| **T-5 — barqaror manzil** | 🔴 **BAJARILMAGAN** — manzil kontent-xeshi (`2270fa1d….jsx`), har yuklashda o'zgaradi |

### Ayb bizda emasligi — isbotlangan

Xuddi shu manzil **toza brauzerda to'liq ishlaydi** (yuqoridagi bo'limga qarang):
fayl yuklanadi, MIME qabul qilinadi, eksportlar chiqadi, komponent render bo'ladi,
tugma sanaydi. Demak muammo modулda ham, serverda ham emas — **faqat LMS yuklovchisida**.

---

## Qanday sinaladi (3 qadam)

1. **`sinov-modul.jsx` LMSga yuklanadi** (`course_artifacts`). Yuklangach manzil chiqadi, masalan
   `https://go.coddycamp.uz/uploads/course_artifacts/<hash>.js`
2. **`SinovDars.jsx` ichida bitta qator almashtiriladi** — faylning boshidagi
   `SINOV-MANZIL-BU-YERGA.js` o'rniga o'sha haqiqiy manzil yoziladi.
3. **`SinovDars.jsx` sinov darsi sifatida yuklanadi va ochiladi.**

## Kutilgan natija (ekranda nima ko'rinishi kerak)

1. Tepada to'rtta qator, **hammasi yashil ✅**:
   `T-1 Modul yuklandi` · `T-1b checks eksporti keldi` · `T-1c Versiya o'qildi: 1.0.0` · `T-2a Darsda React bor`
2. Ostida **to'q sariq ramkali quti**: «TASHQI MODUL YUKLANDI» · «Sinov moduli ishlayapti».
3. **«Bosing — hisob: 0»** tugmasi. Bosilganda hisob **1**, yana bosilganda **2** bo'ladi,
   va pastda yashil qator chiqadi: «✅ React BITTA nusxada — hook ishladi».
4. **Konsolda xato yo'q.**

## Nima noto'g'ri ketsa — nimani anglatadi

| Ekranda | Ma'nosi |
|---|---|
| «Modul topilmadi: https://…» | Yuklovchi hamon **yopiq ro'yxatdan** qidiryapti, manzilni yuklab olmayapti (TZ 2-bo'limdagi eski holat) |
| Sahifa ochiladi, lekin tugma bosilganda **«Invalid hook call»** | Modul **o'z React nusxasini** olyapti — ikki nusxa. TZ 3-bo'lim T-2 sharti bajarilmagan |
| Qator `🔴 T-1b checks eksporti keldi` | Modul yuklandi, lekin **nomli eksportlar** o'tmayapti |
| Oq ekran | Xato ushlanmayapti (TZ 11-bo'lim T-5) |

## Qolgan testlar (asosiysi o'tgach)

TZ 11-bo'limidagi T-3 (kesh) · T-4 (yangilanish ko'rinishi) · T-5 (noto'g'ri manzil) ·
T-6 (ruxsatsiz domen) · T-7 (haqiqiy dars) · T-8 (eskilar buzilmadi).

🔴 **T-7 dan oldin** haqiqiy `html-compiler.js` tayyorlanadi — hozirgi
`src/compilator/HtmlCompiler.jsx` JSX'da yozilgan, uni JSX'siz ESM ga aylantirish kerak
(TZ 9-bo'lim). Bu alohida ish.
