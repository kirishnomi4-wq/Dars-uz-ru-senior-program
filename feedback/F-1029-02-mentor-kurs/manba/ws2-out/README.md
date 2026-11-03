# ws2-out — WebSocket-2: o'quvchi loyihasidagi uch xato, haqiqiy Backend bilan (01.11.2026, avtopilot)

Skript: `manba/drive-ws2.sh` + `manba/ws2-sinov.js`. Backend — `maydon-jamoa` `m12-dars-04-done` (5-darsda Backend o'zgarmagan — `00-versiyalar.txt`), lokal PostgreSQL.
Ilova (Expo) o'rniga Node `socket.io-client`: `mobil/src/ulanish.ts` ning ikki versiyasi aynan — **eski** (m12-04: tinglovchi `connect` ichida, qayta so'rash va xonaga qayta kirish yo'q) va **yangi** (m12-05). Farq — `00b-ulanish-farq.txt`.
«Internet uzildi» — klient bilan Backend orasidagi TCP proksi kesildi (uchish rejimiga eng yaqin model: ulanish yo'q, Backend ishlayapti). «Yangi versiya» — Backend jarayoni qayta ishga tushirildi (Render'dagi qayta chiqarish o'rnida; Render'ning o'zi sinalmagan).

| Fayl | Usul | Eski (m12-04) | Yangi (m12-05) |
|---|---|---|---|
| 01 / 02 | internetni uzish; uzilish paytida boshqa odam qo'shildi | belgi «ulangan», ekranda **6 / 10**, Backend'da **7 / 10** — uzilish paytidagi hodisa kelmadi | qayta ulanganda `GET` → **8 / 10 = 8 / 10** |
| 03 / 04 | yangi versiya, keyin bitta o'zgarish | bitta `oyin-ozgardi` — tinglovchi **2 marta**, `GET` 2 marta | **1 marta** |
| 05 / 06 | yangi versiya, keyin ikkinchi telefon o'yinni ochdi | ikkinchi telefonda **«Hozir ko'ryapti: 1»** (kutilgan 2) — Ali xonaga qaytmagan | ikkalasida **2** |

Hammasi `m12-dars-05-done` dagi `BUZISH.md` bilan mos (1 va 3-urinish «buzildi», tuzatilgandan keyin takrorlanmadi). 2-urinish (fonga olish) Node'da sinab bo'lmaydi — kodda `AppState` qaytganda qayta so'raydi (m12-04 da ham bor), shuning uchun «buzilmadi» (⚠ telefonda sinalmagan).
Kuzatuv: 03 da hodisa Bekzodning o'z javobidan (201) oldin keldi — WebSocket-1 dagi kabi.
