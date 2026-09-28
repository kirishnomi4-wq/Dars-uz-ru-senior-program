# M2-0 — JsIntroLesson: anatomiya metaforasi → FUTBOL JAMOASI (F-0926-06, foydalanuvchi «almashtirilsin» 27.09; «mayli futbol jamoasi» 27.09 kech)

Fayl: `src/2-Modull/JsIntroLesson.jsx` — FAQAT shu fayl. Tozalash-agenti allaqachon ishlagan bo'lishi mumkin — uning
o'zgarishlarini SAQLA, ustiga yoz.

## Nima uchun
MATN_ETALONI 4.1 — inson anatomiyasi metafora sifatida taqiq (til-lint `anatomiya-metaforasi` 16× 🔴). Foydalanuvchi
«almashtirilsin» dedi. Oila tanlangan: **futbol jamoasi** — darsning o'zida misol bo'lib turibdi («Futbol jamoasi,
tanangiz, hatto sayt — bari sistema»), Toshkent o'smiri uchun tanish (95-qonun), shaxsiy qahramon YO'Q (personaj taqiq:
ism qo'yilmaydi — «darvozabon», «hujumchi» rollari bor, «Ali» emas).

## Moslik jadvali (g'oya o'zgarmaydi — faqat olam)
| Darsdagi g'oya | Eski (tana) | Yangi (futbol jamoasi) |
|---|---|---|
| s0 ilgak: hamma qism birga ishlaydi | yugurish: yurak, nafas, miya | hujum: darvozabon to'pni uzatadi, yarim himoyachi pas beradi, hujumchi uradi — hammasi bir vaqtda |
| s0 «Tinch / Yugur» holati, yurak urishi indikatori | tinch / yugur, 72 zarba | **«Mashq / O'yin»** (yoki «Tinch / Hujum»), ko'rsatkich: «pas soni» yoki «tezlik» — mexanika O'SHA (tugma holatni almashtiradi, qismlar yonadi) |
| s2 komponent — o'z vazifasi | miya boshqaradi, yurak nasos, o'pka kislorod, mushak | **darvozabon** — darvozani qo'riqlaydi · **himoyachi** — hujumni to'xtatadi · **yarim himoyachi** — to'pni tarqatadi · **hujumchi** — gol uradi (4 ta, eskisi ham 4 ta) |
| s3 bog'lanish — signal o'tadi, uzilsa ishlamaydi | miya → nerv → mushak | **pas**: yarim himoyachi → hujumchi. Pas uzilsa (raqib to'pni oldi) — hujum to'xtaydi |
| s5 hamma joyda sistema | futbol jamoasi, tanangiz, sayt | futbol jamoasi, **maktab** (o'qituvchi · sinf · jadval), sayt |
| emoji | 🧠 🫀 🫁 🩸 💪 | 🧤 🛡️ 🎯 ⚽ (va ✋/🥅 kerak bo'lsa) |

## Qoidalar
- Ekranlar soni, tartibi, SCREEN_META, test kalitlari (INLINE_KEYS / correctIdx / correct), lessonId — TEGILMAYDI.
  Test savol/variant MATNI yangi olamga moslanadi, lekin to'g'ri variant O'SHA indeksda qoladi.
- **uz va ru juft** (ru: вратарь · защитник · полузащитник · нападающий · пас · атака).
- Audio `useAudio` matnlari ham moslanadi (ular ekranda ko'rinmaydi, lekin eski metaforani saqlamasin).
- Flashkarta, recap, arena (QUIZ_BANK) — anatomiya so'zi qolmasin.
- «yurak urishi» kabi CSS izohlari ham o'zgaradi (`/* p1: ... */`) — CSS izohiga BACKTIK yozilmaydi.
- Sheva yo'q, «siz»-forma, adabiy til. `MATN_KORPUS.md` §214–§217 va 4.1 bo'limini grep bilan o'qi.

## Yakunda
`node til-lint.mjs src/2-Modull/JsIntroLesson.jsx` — `anatomiya-metaforasi` 0 · `npm run gates -- src/2-Modull/JsIntroLesson.jsx` 6/6 ·
`npm run lint:jsx` TOZA · `python3 feedback/F-0926-06-tex-tozalash/keytok.py src/2-Modull/JsIntroLesson.jsx` = `JsIntroLesson.jsx 326fcefa05 34`.
Qolgan anatomiya so'zlarini qidir: `miya|yurak|o'pka|qon|tana|mushak|nerv|nafas|сердц|мозг|лёгк|кров|тел[оа]|мышц|нерв` — 0 (ibora bo'lsa hisobotda ayt).
Byudjet ≤90 chaqiriq. Hisobot: ekran bo'yicha «eski → yangi» (uz), s0 mexanikasi qanday moslandi, qaror kerak joylar.
