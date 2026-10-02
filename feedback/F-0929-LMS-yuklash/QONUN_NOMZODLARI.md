# Qonun nomzodlari — F-0929 LMS yuklash

Parallel seanslar paytida umumiy qonun-fayllarga yozilmaydi; muhrlash keyin bitta seansda.

## 1. `DARS_ETALON.md` — yangi qonun: dars sinf nomi LMS Tailwind sinfi bilan bir xil bo'lmasin (F-0929-91)
LMS (lms.coddycamp.uz) darsni o'z sahifasida chizadi va Tailwind CSS yuklaydi. Holat-sinfi sifatida
`fixed`, `hidden`, `block`, `flex`, `grid`, `absolute`, `relative`, `sticky`, `static`, `container`, `border`,
`invisible`, `collapse`, `truncate`, `underline`, `ring`, `shadow` kabi Tailwind nomlari ishlatilmaydi —
LMS'da ular darsning o'z CSS'idan ustun chiqib, joylashuvni buzadi. Holat-sinfiga `is-` prefiksi: `is-fixed`, `is-open`.
Istisno: `italic` (ma'nosi bir xil). To'liq ro'yxat — LMS CSS surati (`scripts/lms-host.css`, S5).

## 2. Tekshiruvchi rol-fayllari — ov-bandi
«Qator/karta joyidan ko'chib ketdi, ustma-ust tushdi» fidbeki **LMS CSS bilan** qayta chiqariladi. Bizning
brauzer-vositalar LMS CSS'siz ochadi; F-0922-55 shu sabab «takrorlanmadi» deb yopilgan edi.

## 3. `PIPELINE.md` / yuklash jarayoni (S5=A)
- `gates`: LMS-CSS sinf-to'qnashuvi darvozasi.
- Yuklash-tekshiruvi: har ekranni bosib yurish + LMS CSS bilan ochish (`smoke-lms` faqat birinchi ekranni ochadi — F-0929-90 shu teshikdan o'tgan).
- Yuklashdan oldin: yangi dars uchun GATE 3 va RU tayyorligi (ru-walk toza) + katalogda id borligi tekshiriladi (F-0929-93).

## 4. Test izohi va recap — bitta qator (30.09, QAROR: S8=A S9=A S10=B S11=B; https://claude.ai/artifact/Vqjn5YYNCNMvLFV4VfomNJ)
Foydalanuvchi (30.09): «o'quvchi uncha ko'p matnni o'qimaydi… To'g'ri … tamom, 1 qatorgina; xatoda ham shunchaki xato va qisqa tushunarli izohcha; recap ham juda uzun».
O'lchov 1–4c (70 dars): explainCorrect 268 ta, median 106 belgi, 131 tasi «To'g'ri!» bilan boshlanadi (sarlavhada ham TO'G'RI);
explainWrong 840 ta, median 70, kamida 43 tasi to'g'ri javobni so'zma-so'z aytadi; RECAPS 286 × 3 karta, ~71 so'z, har kartada «Sinfga savol».
Taklif (tavsiya A): (1) «✓ To'g'ri.» + bitta gap ≤60 belgi, «To'g'ri!» takrorlanmaydi; (2) «✗ Xato.» + tanlangan variant nega xato, ≤60 belgi,
to'g'ri javob aytilmaydi, «Qaytadan urinib ko'ring» sarlavhasi olinadi; (3) recap: «📖 Eslatma», 1 karta (sarlavha ≤6 so'z + vizual + gap ≤12 so'z),
«Sinfga savol» faqat mentor ekranida. Muhr joylari: DARS_ETALON (yangi qonun) · MATN_KORPUS (juftliklar) · MD-birinchi A-bo'limi · lint darvozasi.
Namuna nusxalari: `sahifa-izoh/A-JsVars.jsx`, `B-JsVars.jsx` (paket faylidan, src ga tegilmagan).
Yakuniy qoida (foydalanuvchi qarori bilan): to'g'ri izoh ≤60 belgi (ru ≤75), maqtovsiz · xato izoh ≤60, tanlangan variant nega xato, javob aytilmaydi,
«Yo'q/Xato» bilan boshlanmaydi · recap 3 kartagacha, har kartada BITTA gap ≤90 (ru ≤110) · «Sinfga savol» faqat mentor-jonli ekranida.
KORPUS §6 (66-qonun, arena «xato bolani nomlaydi») bilan to'qnashuv: test-izoh yorlig'i «✗ Xato.» — foydalanuvchi so'zi («xatodayam shunchaki xato»);
muhrda §6 ni arena-ball bilan chegaralash kerak. Darvoza: `vositalar/izoh.py lint` → keyin gates'ga (parallel tugagach).
5–6-Modul MD'lari (A/B seanslar) — shu qoida MD-birinchi A-bo'limiga qo'shiladi.

## 5. Kompilyator maslahat-ro'yxati — xaritadan, darvoza bilan (01.10, F-1001-90/91; QAROR: S14=C S15=B, Q1–Q12 `KOMPILYATOR_REJA.md`)
Mentor: «kompilyator goh maslahat beradi, goh yo'q; forma teglariga umuman ishlamaydi; `h6` chiqmaydi, `<` `>` qo'lda yoziladigan zamon emas».
Ildiz: avgustda ro'yxat QO'LDA yozilgan (19 teg), hech qachon darslar bilan solishtirilmagan; sinovlar faqat ro'yxatdagi teglar bilan.
**DARS_ETALON 113-qonunga yangi tomonlar (muhrlanadi):**
- Taklif-ro'yxati (teg · atribut · CSS xossa/qiymat · JS so'z/qolip) **qo'lda yozilmaydi** — `src/compilator/teg-xaritasi.json` (qaysi narsa qaysi darsda, qaysi ekranda o'rgatiladi) dan `scripts/gen-teg-royxat.mjs` yasaydi.
  Odam o'qiydigan xarita: `feedback/F-0929-LMS-yuklash/TEG_XARITASI.md`. Yangi dars yangi teg/xossa o'rgatsa — avval xarita, keyin blok.
- **Darvoza** `scripts/lint-teg-royxat.mjs` (gates.mjs ga ulanadi — parallel tugagach): blok = xarita · har bandda uz+ru izoh · 1–4c kompilyator topshiriqlari so'ragan teglar xaritada o'sha darsgacha · 1-Modulning har kompilyatorli darsi `stage` beradi.
- **O'tilmagan narsa ko'rinmaydi** (F-1001-90 bilan bir sinf): `<HtmlCompiler stage="m1-03">` — ro'yxatda faqat shu darsgacha o'tilganlar; to'liq yozilgan teg Tab bilan baribir yoyiladi. CSS maslahati CSS-1 dan, Emmet VS Code darsidan, `.class` qisqartmasi CSS-1 dan, JS maslahati JS o'zgaruvchilardan.
- **Enter/Tab:** `<` bilan ochilgan ro'yxatda Enter va Tab tanlaydi; `<`siz so'zdan ochilganda va JS'da **faqat Tab** (matndan tasodifiy teg tushmasin — F-0809-02 sinfi).
- **Sinov** `vositalar/hc-avto-sinov.mjs`: xaritadan avto-holatlar (har teg: ro'yxatda chiqadimi, Tab yoyadimi) + regressiya ro'yxati — kompilyatorga har tegishdan keyin 0 ❌.
**Tekshiruvchi ov-bandi (`darslik-tekshiruvchi.md`):** dars kod-qutisida/topshirig'ida yangi HTML teg, CSS xossa yoki JS so'z paydo bo'lsa → `teg-xaritasi.json` da bormi; yo'q bo'lsa xaritaga (dars+ekran) → `gen-teg-royxat` → `lint-teg-royxat`.
**Vosita sabog'i (`darvoza-qurishdan-oldin-qidir`):** `shot.mjs` da `press` allaqachon bor edi, qayta qo'shildi → har tugma ikki marta → 40 daqiqa soxta «darsda Tab ikki marta ishlaydi» tashxisi. Vositaga biror narsa qo'shishdan oldin `grep`.
