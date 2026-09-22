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

## ✅ BAJARILDI (22.09) — B ro'yxatidan o'qitadigan uchtasi (F-0922-01)

| Dars | Nima qilindi |
|---|---|
| `PmLesson11` s6 · B2 | **Ikki bosh sahifa yonma-yon** — «Siz: kulgili kino» ↔ «Sinfdoshingiz: qo'rqinchli kino»; ost-yozuv «bitta xizmat — ikki xil bosh sahifa». Bashoratdan KEYINGI kalit-slaydda. Ikki tilli (uz+ru, `aria-label` ham) |
| `PmLesson21` s6 · B1 | **Streak qatori** — 🔥 7 (yetti yashil kun) ustida 🔥 0 (uch kun + uzilgan kun qizil ramkada); ost-yozuv «bitta kun tashlandi — raqam noldan boshlanadi» |
| `PmLesson31` s0 · B5 | **Kesish ro'yxati** — Burbn (check-in · rejalar · do'stlar · ball ustiga chizilgan, `rasm` yashil) → Instagram (rasm · filtr · like). 🔴 FAQAT javob berilgandan keyin chiqadi (§186) |

**Filtr (qaror 22.09):** maket **o'qitadigan** joyga qo'yiladi, bezakka emas — 156-qonunning «MAKET FILTRI»
jadvali. Shu filtr bo'yicha **qilinmadi**: B3 `PmLesson8` Stories lentasi · B4 `PmLesson15` Uzum ilova ekrani ·
B8 `PmUserStory` milkshake (uchalasi ham o'quvchiga tanish narsa yoki darsning gapini ko'rsatmaydi —
21.09 dagi Dropbox qarori bilan bir xil mantiq).

**Tuzatildi:** `PmLesson6` `DeckMock` ning `aria-label` i qattiq o'zbekcha edi — ikki tilli darsda ruscha
rejimda ekran-o'quvchisi o'zbekcha eshitardi. Endi `tr({uz,ru})`.

**Asbob:** `scripts/shot-screen.mjs` — `CLICK='<sel1>,<sel2>'` (ekran ICHIDAGI bosqichga kirish) va
`SHOT_LANG=ru` qo'shildi; rasm-importlari uchun dataurl loader (`.png` bo'lgan darsda yiqilardi).

## A · Eng kerakli (o'quvchi tasavvur qila olmaydi)

| # | Dars · ekran | Qanday rasm | Nega shart |
|---|---|---|---|
| A1 | ~~`PmLesson1`~~ ✅ **FOTO ULANDI 22.09** | Garvard universiteti binosi | Foydalanuvchi media-kutubxonaga yukladi; `PHOTO_SET`+`Photo`, `alt` uz+ru, rasm yuklanmasa 🎓 qoladi |
| A2 | `PmLesson22` · Altair slaydi | Altair 8800 kompyuteri (1975) | 1975-yilgi kompyuter bugungi bolaga umuman tanish emas |
| A3 | `PmLesson6` · Airbnb pitch | Havo matrasi qo'yilgan xona yoki birinchi taqdimot varag'i | «Uy ijarasi» g'oyasi rasm bilan darrov tushuniladi |
| A4 | `PmLesson24` · Tesla slaydi | 2006-yilgi bir varaqli reja (uch bosqich) | «Bir varaqdagi uzoq reja» — ko'rilmasa mavhum |
| A5 | `PmLesson28` · Dropbox kartasi | Flashka yoki avtobusdagi yigit | Hikoya flashka unutilishi haqida — rasm og'riqni ko'rsatadi |

## B · Foydali (mahsulot ekrani — ko'rsa tezroq tushunadi)

| # | Dars · ekran | Qanday rasm |
|---|---|---|
| B1 | ~~`PmLesson21`~~ ✅ maket · `PmMetricsLesson` | Duolingo 🔥 streak ekrani |
| B2 | ~~`PmLesson11`~~ ✅ maket | Netflix bosh sahifasi (ikki xil tavsiya ko'rinadigan) |
| B3 | `PmLesson8` · Stories kartasi ⚪ | Telefon ekranida Stories lentasi — *filtr: tanish narsa, maket qilinmadi* |
| B4 | `PmLesson15` · Uzum slaydi ⚪ | 2022-yilgi Uzum ilovasi — *filtr: ilova ekrani darsning gapini ko'rsatmaydi* |
| B5 | ~~`PmLesson31`~~ ✅ maket | Burbn ilovasining eski ekrani va yonida Instagram |
| B6 | `PmLesson9` · `PmLesson16` · Cyberpunk | O'yin ishga tushgandagi nosoz kadr |
| B7 | `PmJtbdLesson` · «uchinchi joy» | Starbucks ichi: odamlar o'tirib ishlayapti |
| B8 | `PmUserStoryLesson` · milkshake ⚪ | Milkshake va mashina — *filtr: tanish narsa, hikoya matni yetarli* |

## C · Rasm shart emas

- `PmLesson32` — ixcham ro'yxat (belgi · nom · o'lchov), rasm sig'maydi
- `PmLesson33` — naqshlar darsi, o'z mockuplari bor
- `PmLesson26` · `PmLesson29` · `PmLesson30` — matn va suhbat ustida quriladi

## Qanday ulayman (rasm kelgach)

1. Har darsga kichik `PHOTO_SET` qo'yiladi (yoki bitta umumiy modul — qaror foydalanuvchida).
2. `alt` matni **uz va ru** da yoziladi (ekran o'quvchisi uchun).
3. O'lcham: keys-kartasi ichida `max-width: 100%`, balandligi 120–180px; qorong'i rejimda ham tekshiriladi.
4. Har darsdan keyin: `npm run gates` + `smoke-rejim` (4 rejim, uz+ru).
