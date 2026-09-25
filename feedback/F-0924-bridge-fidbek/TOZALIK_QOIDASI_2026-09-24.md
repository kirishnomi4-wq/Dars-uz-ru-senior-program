# Tozalik-qoidasi — 111-qonun qayta qo'llanadi (2026-09-24 ~22:50)

> Foydalanuvchi (Vercel'da joriy darsni ko'rib, rasm bilan): «1 ta page — o'quvchi qaraganda
> 7 soniyada unga tushunarli bo'lishi kerak. Keraksiz ma'lumot emas, faqat keraklisi tursin.
> Keraksiz — uni to'ldirib turuvchisi — umuman kerakmas. Bosh maqsad — o'quvchiga tushunarli
> bo'lishi.»

Bu **yangi qoida emas** — bu `DARS_ETALON.md` **111-qonun** (7–10 soniya testi + olib-tashlash-
testi, F-0803-28) ning aynan o'zi, bridge kontekstiga qayta eslatma sifatida. Umumiy tarix:
memory `tmi-taqiq-bitta-ip` / `bridge-tozalik-vs-boylik`.

## Nega hozir dolzarb
Ertalabki «sifatsiz, yupqa» fidbekka javoban kunduzi qo'shilgan **«vizual boylik» bosqichi**
(`PILOT_DIZAYN_NAQSH.md` 9–14-band: material matn, ustun yorliqlari, Zoomable, simulyatsiya-
paneli, mentor-avatar zaxirasi, o'lcham-modifikatori — barcha 7 darsga tatbiq qilingan) ba'zi
ekranlarni **111-qonundan o'tmaydigan darajada to'ldirib yuborgan**. «Yupqa/sifatsiz» va
«ortiqcha to'ldirilgan» — bir xil qonunning ikki teskari buzilishi. Muvozanat nuqtasi: PmLesson2
darajasidagi **aniqlik**, PmLesson2 darajasidagi **bezak miqdori emas**.

## Olib-tashlash-testi (111-qonun, qayta ishlatiladi)
Har elementga: **«bu karta/blok/yorliq/panel bo'lmasa, o'quvchi ekranning asosiy fikrini
yo'qotadimi?»**
- HA → qoladi.
- YO'Q yoki shubha → olib tashlanadi yoki ixchamlashtiriladi.

Qo'shimcha, ekran darajasida: ekranni 2 soniya ko'rib, ko'z birinchi qayerga tushadi — o'sha
ekranning bosh maqsadi bilan bir xilmi? Emas bo'lsa, e'tiborni tortayotgan ortiqcha element bor.

## TEGILMAYDI (GATE S / relslar)
- Senariy matni: sarlavha, savol, xulosa-gap, keys-slaydlar — so'zma-so'z qoladi.
- Ball-kalitlari, `correct`, `INLINE_KEYS`, `SCREEN_META`, arena — tegilmaydi.
- Faqat **dekorativ/qo'shimcha vizual qatlam** (material-matn qatorlari, ustun-yorliqlari,
  simulyatsiya-panellari, ortiqcha ikonka/chip) qisqartiriladi yoki olib tashlanadi — mentor-gap
  ham shu mezon bilan (NEGA + bitta chorlov, ortiq gap yo'q; Sinf 2 qolipi, `TUZATISH_SPEC.md`).

## Qayerda qo'llanadi
- **B4, B5, B6, B7** — yakuniy tekshiruv qaytadan boshlanganda, shu tozalik-tekshiruvi ham
  checklist'ga qo'shiladi (ayniqsa vizual-boylik qo'shilgan ekranlarda — har darsning kechqurungi
  jurnal-yozuvida «vizual boylik ✅» deb belgilangan joylar).
- **B1, B2, B3** — «tayyor» deb belgilangan, lekin ularga ham vizual-boylik bosqichi tegib o'tgan
  (B1 — pilot, 12:14; B2 — 12:42; B3'da kamroq boylik qo'shilgan, past ustuvorlik). Alohida
  qisqa audit+tuzatish bilan qayta ko'riladi — GATE'lar (darvozalar, kalitlar) o'zgarmasligi
  shart, faqat vizual qatlam ixchamlanadi.

## Ish tartibi (avtopilot uchun)
1. Har fayl uchun: ekranlarni birma-bir ko'rib (screenshot orqali, `shot-screen.mjs` yoki
   brauzerda), qaysi ekranda element-zichligi yuqori — belgilab olish.
2. Olib-tashlash-testini qo'llash; qisqartirish/o'chirish — GATE S matniga tegmasdan.
3. Har tahrirdan keyin `npm run gates -- <fayl>` 6/6 + `npm run lint:jsx` 0.
4. Natijani `TUNGI_JURNAL_2026-09-24.md` uslubida (yoki davomi sifatida yangi bo'lim) yozib
   borish — qaysi ekranda nima olib tashlangani/qisqartirilgani aniq (ekran raqami + nima).
