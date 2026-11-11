# Dars v2 — biz tomon prod'da tayyor, `RESULT_SCHEMA_V2=on` qilish

11 noyabr 2026 · 35- va 43-hujjatlarga javob

Salom. 43-javob uchun rahmat — JSX tekshiruvi endi yuklashni to'xtatmagani uchun 172 darsning hammasi bugun yuklandi.
Biz tomondan production tayyor. Endi faqat sizning qadamingiz qoldi — Dars API'da yangi oqimni yoqish.

## 1. Biz tomonda bajarildi

| Nima | Holat |
|---|---|
| Dars API production | `0.1.0+ab1bfa30` (10.11, 21:32), migratsiya **17** (`0017_v2_cutoff`), `result_schema_v2: off` |
| Darslar LMS'da | **172 dars** yangi versiyada (11.11, 15:09): 344 qator (uz + ru) Active, CRM'dagi har fayl bizning paket bilan md5 bo'yicha bir xil; production serverga ulangan |
| Chegara (cutoff) | v2 hodisalar faqat bayroq yoqilgandan keyin boshlangan urinishlarga — eski urinishlar qayta yuborilmaydi |
| QA jonli sinov | `lr_`, `ap_`, `ar_` — applied; Class va Learn yopildi; 39 coin |

## 2. Sizdan: bayroqni yoqish

Jonli dars yo'q paytda, serverda (`/srv/dars-api/prod`). Fayl **joyida** tahrirlanadi — qayta yaratilmaydi, `gitlab-runner` ruxsati saqlanadi (staging'dagi `chmod 600` holati takrorlanmasin):
```
cd /srv/dars-api/prod
grep -q '^RESULT_SCHEMA_V2=' .env.deploy && sudo sed -i 's/^RESULT_SCHEMA_V2=.*/RESULT_SCHEMA_V2=on/' .env.deploy || echo 'RESULT_SCHEMA_V2=on' | sudo tee -a .env.deploy >/dev/null
getfacl .env.deploy | grep gitlab-runner
docker compose -f docker-compose.deploy.yml --env-file .env.deploy up -d
```
Tekshiruv: `https://dars-api.coddycamp.uz/api/v1/health` → `"result_schema_v2":"on"`, `"migrations":17`.

Yoqilgan vaqtni bizga yozing — birinchi darsni kuzatamiz.

## 3. Yoqilgandan keyin nima bo'ladi

- O'quvchi oxirgi ekranga yetganda `lr_` darhol; yetmasa — sessiya yopilganda.
- Arenaning birinchi savoli ko'rsatilganda `ap_`.
- Sessiya yopilganda har o'quvchiga `ar_` (arena bo'lmasa — `not_started`).
- Darslar shu zahoti yangi `onFinished` yukiga o'tadi (`schema_version: 2`, `dars_api`) — darslarni qayta yuklash kerak emas.
- Eski (v1) oqim yonma-yon ishlayveradi.

## 4. Muammo bo'lsa

`RESULT_SCHEMA_V2=off` (xuddi shu buyruq, `on` → `off`) va konteynerni qayta ishga tushirish. Hammasi eskicha ishlaydi, darslarni qayta yuklash kerak emas, hech narsa o'chirilmaydi.
Qayta yoqishda `RESULT_SCHEMA_V2_FROM=<qayta yoqish vaqti, ISO>` qo'shing — o'chiq turgan paytdagi urinishlar uchun v2 yaratilmasin.

## 5. LMS tomoni

Ikkala xato tuzatildi — «Darsni yakunlash» bosilganda keyingi bosqichga o'tish va «Результат сохранён» xabari. 10 noyabr kechqurun sinab ko'rdik, ishladi. Rahmat.

Birinchi haqiqiy dars hodisalarining ID'larini kuzatuvdan keyin yuboramiz.

## 6. JSX tekshiruvi — kichik iltimos (shoshilinch emas)

Brauzer tekshiruvi ikki darsda B07 (XATO) beryapti. Bu nosozlik emas — darsning o'z ko'rinishi:

- **2-Modul 11 «CssPractice»** — blok tugaganda 4 soniyalik to'liq ekranli nishon bayrami (`.acu-overlay`) chiqadi va o'zi yopiladi (bosilsa ham yopiladi). Tekshiruv shu paytda nishon hisoblagichini («🏅 1/4») bosmoqchi bo'ladi.
- **3-Modul 13 «PracticeLesson4»** — tekshiruv nishon hisoblagichini bosib, ro'yxat oynasini (`.ach-pop`) o'zi ochadi, keyin uning ostidagi «Ментор» tugmasini bosa olmaydi.

Nishon bayrami ko'p darslarda bor, shuning uchun bu XATO boshqa darslarda ham chiqishi mumkin. Iloji bo'lsa, tekshiruv `.acu-overlay` yopilishini kutsin (yoki uni bossin) va o'zi ochgan oynani yopib, keyin keyingi tugmaga o'tsin. Hozir bu yuklashga xalaqit bermaydi.

40-hujjatdagi B06 savoli (2-Modul 09 «VS Code», «P» 919 px) ham ochiq qoldi — qaysi element ekanini ko'rsatsangiz, tuzatamiz.
