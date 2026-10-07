# 2-dars «Hodisalar tizimi: har harakat jadvalga yoziladi» — tashqi audit (ChatGPT) Filtr bilan, 05.10.2026

Audit bahosi 8/10 (arxitektura 8.5 · pedagogika 9 · analytics aniqligi 7). Hukm: **Qabul 15 · Qisman 2 · Rad 1**. Zaxira: scratchpad `02-oldin-filtr.md`.

| № | Audit | Hukm | Nima qilindi / sabab |
|---|---|---|---|
| 1 | Umami Visitors (sessiyalar) ≠ bizning turli brauzer ID — 11-ekranda bir o'lchovdek turibdi | **Qabul** | Rost (Umami hujjati: Visitors — sessiyalar, o'z hash usuli). 11-ekran: hisoblagich yorliqlari «Umami sessiyalari» / «turli brauzer ID», har birining sanash qoidasi ostida, `QIzoh` «Ikki tizim brauzerni turlicha taniydi … teng bo'lishi shart emas», xulosa «O'z jadvalimizda qoida aniq …». Tayanch 1 va 9.3: «yaqin, lekin bir xil o'lchov emas». |
| 2 | 6-ekran sarlavhasi «Sahifani **kim** ochganini …» — brauzer ID odamni ajratmaydi | **Qabul** | «Qaysi brauzer ochganini qanday ajratamiz?» (T-044: sarlavha atamaning ma'nosiga zid bo'lmaydi). |
| 3 | `synchronize: true` prod uchun xavfsiz model bo'lib qolmasin | **Qabul** | GATE M M-q2 A: A1 O'qituvchi eslatmasi («tez ishlash uchun qulay, prod'da xavfli — 8-dars prod ro'yxatida»); 8-darsga qator qo'shildi. Migratsiya o'rgatilmaydi (keyingi modullar). |
| 4 | Final tartibda «Sayt `POST /bandlar` yuboradi» tushib qolgan | **Qabul** | 12-ekran — 6 bo'lak; xulosa va RECAPS 5 yangilandi; `FINAL_BOLAKLAR` 6. |
| 5 | A2 dagi aniq 1 · 2 · 2 faqat toza jadvalda chiqadi | **Qabul** | 4-qadam — oldin/keyin farqi: avval SQL natijasini yozib olish, keyin «oshdimi»; kutilgan natija — uch o'lchov, «toza jadvalda; sizda boshqacha bo'lishi mumkin». |
| 6 | QKod: `band-qildi` faqat muvaffaqiyatda (500, tarmoq xatosi ham bor) | **Qabul** | Starter: `409` dan keyin `if (javob.status !== 201)` → «Band qilib bo'lmadi»; vazifa 3, Yordam, shart 3; namunada `20:00` — `500`, runtime tekshiruvi qo'shildi. Repo'da `saqlandi` faqat muvaffaqiyatdan keyin chaqirilishi A2 3-qadamda aytildi. Backtik yo'q. |
| 7 | A1 promptda `brauzer_id` — «bo'sh emas» emas, 1–64 belgi | **Qabul** | A1 va «O'z g'oyangiz» promptida «satr, 1–64 belgi» — repo REPO 2 bilan bir xil. |
| 8 | 3-darsda `/dashboard` ham `ochdi` ga tushmasin | **Qabul (bor)** | 3-dars MD da allaqachon: A-3 «`/dashboard` va `/ega` ochilganda hodisa yozilmaydi», A1 «Nima buzilmasin», REPO 2; tayanch 3 (`m10-dars-02-done`). O'zgarish shart emas. |
| Hook | «Reklama to'sgichi albatta to'sadi» bo'lib qolmasin | **Qabul** | Javob: «**Bu misolda** reklama to'sgichi Umami skriptini to'sdi». 11-ekran xulosasi «sabablardan biri». |
| Hook | «Aynan!» / «Qiziq fikr!» olib tashlansin | **Rad** | Qolip qoidasi (T-028, M5-03; tayanch 7.7) — 9-Modul auditida ham shunday rad etilgan; auditor o'zi ham «qonun ruxsat bergan» deydi. |
| 2-ekran | «Har harakatni …» — universal; fire-and-forget: hodisa doim yetadi deyilmasin | **Qabul** | Xulosa: «Biz tanlagan uch harakatni … so'rov o'tsa, Backend jadvalga bitta qator yozadi»; yakun 1-qatori ham shunday. |
| 4-ekran | «Backend faqat uchta nomni yozadi» — scope; kalit — maket ekani ko'rinsin | **Qabul** | «"Maydon" Backend'i faqat shu uchta nomni qabul qiladi» (xulosa va yakun); kalit ustida «faqat shu maketda» yorlig'i. |
| 6-ekran | Brauzer ID — «anonim foydalanuvchi» deb atalmasin | **Qisman** | MD da «anonim» so'zi yo'q (grep 0) — o'zgarish shart emas; maxfiylik nuansi 6-darsda («brauzer ID shaxsiy ma'lumot emas» deyilmaydi). |
| 9-ekran | «uch son bir o'lchovda» → «o'z jadvalimizdagi uch qadam bitta qoidada» | **Qabul** | Xulosa shunday. |
| 11-ekran | Sarlavha «qaysi biri xato?» — oldindan da'vo | **Qabul** | «Ikki tizim nega bir xil son bermadi?»; O'qituvchi eslatmasi moslandi. |
| A2 | `.catch(() => {})` xatoni butunlay yutadi | **Qabul** | Prompt: «foydalanuvchiga xato ko'rsatilmasin — konsolda ogohlantirish qolsin»; REPO 4: `.catch((e) => console.warn(…))`. |
| Sarlavhalar | 6 va 11 | **Qabul** | Yuqoridagidek; 1-ekran (reja) — qoladi (auditor ham shunday). |
| Prod | Hodisa doim yetadi degan gap bo'lmasin | **Qisman** | Yakundagi «Uch hodisa jadvalda» — dars amaliyotining tekshirilgan natijasi (auditor ham qabul qiladi); umumiy gaplar «so'rov o'tsa» bilan. |

**Sinf-supurish:** «Visitors = brauzer ID», «kim ochgan», `.catch(() => {})`, «anonim» — 10 MD da qidirildi → 0 (faqat 2-darsda edi). lint:til 02 — toza.
