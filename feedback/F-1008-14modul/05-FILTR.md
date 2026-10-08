# 5-dars «Guruh pitchingizda nimani tuzatishni aytadi?» — tashqi audit (ChatGPT) Filtr bilan, 08.10.2026 (F-1008-563)

Filtr tartibi — `01-FILTR.md` dagidek. Zaxira: scratchpad `zaxira-05/`. Skript: scratchpad `f05_tuzat.py` (65 juftlik, har biri faylda aynan bir marta — skript tekshirgan).
Audit bahosi 7/10. Hukm: **Qabul 21 · Qisman 4 · Rad 3 · Allaqachon 9** (35 band + sarlavha + 13 TS + 8 shart; takrorlar birlashtirildi).
⚠️ **Tasdiqlangan matnga tegadigan Qabul (foydalanuvchiga alohida):** tayanch 1.5 «✗ lardan» qoidasi o'zgarmadi, lekin Mentor uchinchi tuzatishi (tayanchda yo'q — TS1) qayta yozildi (4-band); `pm-m12d5-varaq` sxemasiga `vaqt` (9.24 rejasi) va `tuzatishlar[].manba` qo'shildi (3, 14-bandlar).

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | «Fikringiz har xil bo'lsa — ✗» — bitta odam fikri avtomatik guruh hukmi | **Qabul** | 6-ekran kulrang qatori → «Belgini guruh birga tanlaydi; fikrlar farq qilsa — muhokama qiling, tushunarsiz qolgan joyni izohda yozing.»; A-9, kartochka 5, arena 5 (✔ «Muhokamadan keyin bitta belgi», 29 — ±15% ichida), §145, TS4. 9.51. |
| 2 | Bitta varaq — attributsiya yo'qoladi; «guruhning bitta umumiy yozuvi» aytilsin | **Qabul** | «Pitchdan oldin» blokiga qator; A-9. Individual attributsiya kerak emas (maxfiylik). 9.51. |
| 3 | Uch tuzatishni majburlash — «3 xato» ma'nosi | Qisman | 3 band qoldi (tayanch 1.5, GATE M T11); lekin tur ajratildi: ✗ — tuzatish · hakam savoli — aniqlashtirish · ✓ — kuchaytirish (`tuzatishlar[].manba: 'x' \| 'savol' \| 'aniqroq'`); 7-ekran kulrang qatori «Uch bandning hammasi xato degani emas…»; A-4. 9.52. |
| 4 | Mentor 3-tuzatishi hakam savoliga to'liq javob bermaydi (so'rov ↔ xizmat qilmaydi ziddiyati) | **Qabul** | → «Ular to'lovchi emas — faqat tanishtirish so'rayman» (49; 4-ekran ✔ yolg'iz eng uzun emas — 46/51): ikki bor faktni birlashtiradi (13-Modul 1.2 + tayanch 1.1 so'rovi), yangi fakt yo'q; 8-dars «tuzatilgan holat» (1.1, M-q3 A) bilan mos. A-6, 4-ekran karta, Yordam, eslatma, arena 12 (✔ «Ular bugun to'lovchi emas», 26), TS1, Shubhali. 9.53. |
| 5 | Raqamlar ✗ talqini «tushunmagan» — inference | **Qabul** | → «gapda «to'lov emas» deyilgan bo'lsa ham, tinglovchida «yozma tasdiq» nimani anglatishi haqida savol qolgan» (A-6, 2-ekran eslatmasi, kartochka 11, Shubhali). 9.53. |
| 6 | Bozor tuzatishi — «guruh a'zolari», o'yinchi demaslik — saqlang | Allaqachon | O'zgarishsiz. |
| 7 | Hook «Aynan!» / «Qiziq fikr!» | **Rad** | T-028, T-067, tayanch 7 (01–04-FILTR bilan bir). |
| 8 | Reja sarlavhasi «uchta tuzatish yozasiz» — natija va'dasi | Qisman | Savol shakli RAD (P-014); «uchta» soni olindi → «Bugun pitchingizga guruh varag'idan tuzatish yozasiz.» (52). |
| 9 | Qurilmani tinglovchilarga berish — shaxsiy ma'lumot xavfi | **Qabul** | Mentor: «varaq ekrani ochiq holda qurilmangizni uzating»; «Pitchdan oldin»: «Boshqa oynalarni yoping — varaqdan boshqa shaxsiy narsa ekranda bo'lmasin». 9.51. |
| 10 | Validator yetarli emas — learner qoidasi va o'qituvchi nazorati | **Qabul** | Hakam savoli kulrang qatoriga «ism va shaxsiy ma'lumot yozilmaydi»; O'qituvchi eslatmasi (nazorat) bor edi. |
| 11 | Yakka rejim video yoki ovoz — 2-dars bilan sync | Qisman | 5-dars: video yoki ovoz (bor edi); 2-dars: «Yuzingiz ko'rinishi shart emas — ovoz yetadi» — amalda teng; 2-dars matni o'zgarmadi (tayanch 1.2 «videoga yozish», GATE M). 9.56. |
| 12 | Yakka rejim — to'liq ekvivalent, saqlang | Allaqachon | O'zgarishsiz. |
| 13 | Yakka varaq emas — tashqi fidbek — 8-dars ko'rsatsin | **Qabul** | **Sinf-supurish 08 MD:** 5-ekran kartalari ustida va 7-ekran 1-savolda `tur` ga qarab yorliq («5-darsdagi guruh varag'i» / «5-darsda o'zingiz to'ldirgan varaq»). TS13. 9.56. |
| 14 | `vaqt` sxemaga — QAT'IY | **Qabul** | `pm-m12d5-varaq.vaqt: n \| null` (pitch soniyasi, «To'xtatish»dan) — A-12, 6-ekran saqlash, KOD 9, tayanch 8 (9.24 rejasi bajarildi). 9.55. |
| 15 | `savedAt` → `updatedAt` / `completedAt` | **Rad** | Kurs qolipi (02-FILTR 18, 03-FILTR 35); tugallik maydonlardan chiqariladi. |
| 16 | Vaqt oshishi — tuzatish slotini yemasin | **Qabul** | 6/6 `QIzoh` → «bu alohida topilma: uyda qaysi bo'lak qisqarishini belgilaysiz»; uyga vazifa ①. Sxemada alohida maydon yo'q — `vaqt` dan chiqadi. 9.55. |
| 17 | Bir bo'lak ikki marta — soft, QABUL | Allaqachon | O'zgarishsiz. |
| 18 | «Yangi son yozmang» broad → «to'qimang, manbasi bor son» | **Qabul** | 7 Yordam, «Endi siz bilasiz» 4, kartochka 10, takrorlash 5, 4-ekran xulosa, A-2 (110). 9.52. |
| 19 | `VADA_RE` «aniq bo'ladi» — soft, QABUL | Allaqachon | Yo'naltiradi, bloklamaydi. |
| 20 | 3-savol «qiziq emas» distraktori — QABUL | Allaqachon | O'zgarishsiz. |
| 21 | 4-ekran 3-karta — Mentor wordingini qayta yozish | **Qabul** | 4-band. |
| 22 | «Pitchda javobi yo'q savol» — Mentor misoli bilan ziddiyat | **Qabul** | 3-qism Mentor (guruh, yakka) → «pitchdan keyin qolgan savol»; kartochka 4 izohi. 9.54. |
| 23 | Ta'rif yaxshi, instruction tuzatilsin | **Qabul** | 22-band bilan bir (ta'rif o'zgarmadi). |
| 24 | UI: «Tinglovchining hakam savoli» | **Qabul** | Varaq pastki qatori yorlig'i (yakka rejimda «Hakam savoli»); kalit `hakamSavoli` o'zgarmadi. 9.54. |
| 25 | Taymerdagi «savol-javob» bo'lagi bu darsda keraksiz | **Qabul** | Olib tashlandi (bitta vizual, 2-ekran 3-tugma, 6-ekran saqlash, KOD 2, 5); 8-darsda qaytadi. TS10 RAD. 9.54. |
| 26 | 28 daqiqa — ideal minimum; real 35–45, dars 105–125 | **Qabul** | A-11: guruh sukutda 3 kishi, varaqqa 2–3 daqiqa, Mentor ko'rsatishi 2; auditor bahosi ⛔ ga; Reja va 6-ekran O'qituvchi eslatmasi. 9.55. |
| 27 | Oxirgi o'quvchi «uyda yakka» — teng emas | **Qabul** | Guruh hamma pitchni tugatadi; vaqt yetmasa — 7-ekran va kartochkalar uyga; yakka rejim faqat o'quvchi o'zi tanlasa. A-11, eslatmalar, uyga vazifa ③. 9.55. |
| 28 | 6-ekran `optionalLive` — darsning markazi | **Qabul** | 6-ekran jonli darsda majburiy (`optionalLive` olindi); 7-ekranda qoldi. 9.55. |
| 29 | Render 15/1 daqiqa — time-sensitive, kerak emas | **Qabul** | O'qituvchi eslatmasi → «hamma mahsulotini bir marta ochib ko'rsin — birinchi yuklanish taymer vaqtini yemasin» (sonlar olindi). 9.55. |
| 30 | Uyga vazifa ② — tanish odam ixtiyoriy | **Qabul** | → «xohlasangiz tanish odamga, bo'lmasa o'zingiz telefonga yozib»; Izoh. 9.56. |
| 31–34 | Yakun 4 holat · Pitch Round! · Mentor statistikasi · podium | Allaqachon | O'zgarishsiz. |
| 35 | 6/6 ✓ + bitta savol — uchinchi bandni to'qimaslik | Qisman | 3-band bilan: ✓ bo'lakdan «yanada aniqroq» — kuchaytirish deb belgilanadi (`manba: 'aniqroq'`), «xato» deb ko'rsatilmaydi; 3 band qoladi (tayanch). |
| S | Sarlavhalar: asosiy QAT'IY QABUL; Reja → savol | Qisman | 8-band. |
| TS | 1 → 4 · 2 → 3 · 3 ✓ · 4 → 1, 2 · 5 → 14 · 6 → 24 · 7 → 2-dars qarori (02 A-6: qoralama 1.1 aynan, aytilganda Muammo lahza bilan — 2-ekran pufagi shunga) · 8 ✓ · 9 → 11 · 10 → 25 (RAD) · 11 ✓ · 12 — `PUL_RE` xabari «kurs chegarasi eslatmasi» shaklida · 13 → 13; 14–21 → 1, 3, 22, 13, 14, 9, 27, 28 | — | Hammasi mos bandlarda. |

**8 hard fix:** 1 ✓ · 2 ✓ · 3 ✓ (tur) · 4 ✓ · 5 ✓ · 6 ✓ · 7 ✓ · 8 Rad (hook — qonun) / Qisman (reja — «uchta» olindi).

## Sinf-supurish (13 MD + tayanch, grep)
- `tur` yorlig'i — 08 MD (5-ekran kartalari, 7-ekran 1-savol) qo'shildi; 13 — `pm-m12d5-varaq` ni o'qimaydi.
- «Fikringiz har xil — ✗» — faqat 05.
- «pitchda javobi yo'q savol» — 08 (7-ekran savol-javob) tekshiriladi 8-dars auditida; 05 da tuzatildi.
- Taymerdagi «savol-javob» bo'lagi — 01 (tug'iladi, qoladi), 08 (mashq — qoladi), 05 (olindi).
- Render 15/1 daqiqa sonlari — 06, 07 MD larda (Backend uyg'otish — o'sha darsning mavzusi, rasmiy manba) — 6-dars auditida qaraladi.

## Tekshiruv
`lint:til` 05, 08, tayanch — 0 error · `mdtekshir.py` 05/08 — 12/12 ekran, arena 3/3/3/3, uzun 0 · `kesishma.py` takror 0 · `lint:prompt` ✓.
