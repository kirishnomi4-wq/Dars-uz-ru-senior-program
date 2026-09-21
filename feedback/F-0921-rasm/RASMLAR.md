# 📷 PM darslari — rasm ro'yxati (F-0921-22, 2-qadam)

> **Nega:** 35 PM darsida jami 35 ta `<img>` bor — hammasi mentor avatari. Biznes-keyslar
> faqat emoji va matn bilan beriladi. 1-qadamda har brendga bir qatorli **izoh** qo'yildi;
> bu ro'yxat — **rasm** kerak bo'lgan joylar.
>
> **Texnik naqsh:** `Htmllesson2.jsx` dagi `PHOTO_SET` + `Photo` komponenti.
> Har rasm: `img` (to'liq URL, `go.coddycamp.uz/uploads/media_library/...`) + `emoji` + `bg` gradient.
> Rasm yuklanmasa — emoji va gradient qoladi, dars **to'xtamaydi**.
>
> **Huquq:** rasmlar foydalanuvchining media-kutubxonasiga yuklanadi; tashqi saytga havola qo'yilmaydi.
> Logotip o'rniga real joy/mahsulot fotosi afzal.

## ✅ BAJARILDI (21.09) — maket bilan, foto kutmasdan

| Dars | Nima qilindi |
|---|---|
| `PmLesson22` s6 | **Altair 8800 old paneli** — lampochkalar qatori va kichik kalitlar; ost-yozuv: «ekran ham, klaviatura ham yo'q» |
| `PmLesson24` s6 | **Bir varaqli reja** — 1-slaydda qatorlar YOPIQ («uch qator — bitta betda»), to'liq varaq 3-bosqichda ochiladi (§186) |
| `PmLesson6` s5 | **Taqdimot maketi** — o'nta varaq, birinchisi ajratilgan; nomi savol javobidan KEYIN chiqadi (§186) |

**Qolgani:** `PmLesson28` Dropbox flashkasi — **maket qilinmadi**: flashka o'quvchiga tanish narsa,
hikoya matni («flashkasi uyda qolgan») o'zi yetarli. Bezak uchun maket qo'shilmaydi.

## A · Eng kerakli (o'quvchi tasavvur qila olmaydi)

| # | Dars · ekran | Qanday rasm | Nega shart |
|---|---|---|---|
| A1 | `PmLesson1` · Facebook keys-slaydi | Garvard universiteti binosi yoki darvozasi | «Garvard» — o'quvchi uchun quruq so'z; izoh qo'yildi, rasm uni mustahkamlaydi |
| A2 | `PmLesson22` · Altair slaydi | Altair 8800 kompyuteri (1975) | 1975-yilgi kompyuter bugungi bolaga umuman tanish emas |
| A3 | `PmLesson6` · Airbnb pitch | Havo matrasi qo'yilgan xona yoki birinchi taqdimot varag'i | «Uy ijarasi» g'oyasi rasm bilan darrov tushuniladi |
| A4 | `PmLesson24` · Tesla slaydi | 2006-yilgi bir varaqli reja (uch bosqich) | «Bir varaqdagi uzoq reja» — ko'rilmasa mavhum |
| A5 | `PmLesson28` · Dropbox kartasi | Flashka yoki avtobusdagi yigit | Hikoya flashka unutilishi haqida — rasm og'riqni ko'rsatadi |

## B · Foydali (mahsulot ekrani — ko'rsa tezroq tushunadi)

| # | Dars · ekran | Qanday rasm |
|---|---|---|
| B1 | `PmLesson21` · `PmMetricsLesson` | Duolingo 🔥 streak ekrani |
| B2 | `PmLesson11` · Netflix kartasi | Netflix bosh sahifasi (ikki xil tavsiya ko'rinadigan) |
| B3 | `PmLesson8` · Stories kartasi | Telefon ekranida Stories lentasi |
| B4 | `PmLesson15` · Uzum slaydi | 2022-yilgi Uzum ilovasi yoki yetkazib berish |
| B5 | `PmLesson31` · Burbn → Instagram | Burbn ilovasining eski ekrani va yonida Instagram |
| B6 | `PmLesson9` · `PmLesson16` · Cyberpunk | O'yin ishga tushgandagi nosoz kadr |
| B7 | `PmJtbdLesson` · «uchinchi joy» | Starbucks ichi: odamlar o'tirib ishlayapti |
| B8 | `PmUserStoryLesson` · milkshake | Milkshake va mashina (ertalabki yo'l) |

## C · Rasm shart emas

- `PmLesson32` — ixcham ro'yxat (belgi · nom · o'lchov), rasm sig'maydi
- `PmLesson33` — naqshlar darsi, o'z mockuplari bor
- `PmLesson26` · `PmLesson29` · `PmLesson30` — matn va suhbat ustida quriladi

## Qanday ulayman (rasm kelgach)

1. Har darsga kichik `PHOTO_SET` qo'yiladi (yoki bitta umumiy modul — qaror foydalanuvchida).
2. `alt` matni **uz va ru** da yoziladi (ekran o'quvchisi uchun).
3. O'lcham: keys-kartasi ichida `max-width: 100%`, balandligi 120–180px; qorong'i rejimda ham tekshiriladi.
4. Har darsdan keyin: `npm run gates` + `smoke-rejim` (4 rejim, uz+ru).
