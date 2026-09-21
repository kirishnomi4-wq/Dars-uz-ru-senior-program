---
name: tmi-taqiq-bitta-ip
description: "2026-08-03 qat'iy buyruq — ortiqcha matn (TMI) taqiqi + bir dars bitta misol-ip; barcha darslarga tegishli"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9da6704a-63dd-454a-ab77-7fe3661aa8a5
  modified: 2026-08-03T10:38:32.382Z
---

Foydalanuvchi 2026-08-03 sessiyasida QAT'IY muhrlatdi: «keraksiz tekst jalka UI to'ldirib
o'quvchi tushunmasligiga olib keladi — barcha darslarda shu bo'yicha, MD'larga qat'iy saqla».

**Why:** JsFunctions'da 918-belgilik reja-ekrani + 4 misol-olamning ipsiz almashishi o'quvchini
«mavzu nimaligini bilib bo'lmayapti» holatiga olib keldi; 4-sahifada ko'rinmas gate-vidjet darsni
butunlay to'sib qo'ydi. Ortiqcha matn = tushunishga to'siq, bezak emas.

**2026-08-03 (kechqurun) — QABUL MEZONI qo'shildi (F-0803-28, 111-qonun):**
o'quvchi ekranni **7–10 soniyada** ko'rib tushunishi shart — «nima qilishim kerak? · qayerga
bosaman? · bu ekran nimani o'rgatyapti?». Bittasi chiqmasa — ekran topshirilmaydi.
**Bo'sh joy so'z bilan to'ldirilmaydi** (bo'sh joy — dizayn elementi; ma'no bermaydigan matn
umuman kerak emas). **Olib tashlash savoli:** «bu karta/blok bo'lmasa, o'quvchi ma'noni
tushunmay qoladimi?» — HA → qoladi · YO'Q yoki shubha → olib tashlanadi.

**How to apply:**
- Har ekran topshirilishidan oldin 7–10 soniya testi (`DARS_ETALON.md` 11-D / 111-qonun;
  `MATN_KORPUS.md` 78-bo'lim). Auditor va qabulchi rol-fayllarida majburiy band.
- Har dars-matn ishida: mentor maks 2 gap · reja-ekran ta'rif aytmaydi · olib tashlash testi ·
  bir g'oya maks 2 marta (`MATN_KORPUS.md` 72, 74, 75-bo'lim).
- Har dars BITTA misol-ip (108-qonun, `DARS_ETALON.md` 11-B); JS oilasida tanlangan ip —
  **o'yin olami** (ball/jon/zarar/krit). Lavash ipi bu foydalanuvchi tomonidan RAD etilgan
  («lavash-mavash kerakmas») — yangi ip doim foydalanuvchi bilan kelishiladi.
- **Kelishilgan ip-taqsimoti (2026-08-03, F-0803-22):** M2-D2 (PmLesson4) = **kinoteatr sayti** ·
  **M2-D7 (PmLesson5, dekompozitsiya) = O'SHA kinoteatr sayti** — lavashdan almashtirildi ·
  JS oilasi = o'yin olami. M2-D7 uchun avval «o'yin klubi» tanlangan edi, keyin bekor qilindi:
  dars `pm-m2d2-features` orqali M2-D2 artefaktini o'qiydi, shuning uchun ikkalasi BIR olamda
  bo'lishi shart (96-qonun). Yangi dars ip tanlashda shu ro'yxatga qaralib, TAKRORLANMAYDI.
- **Modul-ip kalitini IKKI TOMONDAN tekshiring** (F-0803-22-B sabog'i): yozuvchi dars qanday
  SHAKLDA va NECHTA yozadi ↔ o'quvchi dars qanday shaklda va nechta kutadi. M2-D2→M2-D7
  ko'prigi kalit nomi to'g'ri bo'la turib ishlamagan — obyekt-maydoni va sanoq mos emasdi.
- Gate-vidjet 1280×720 da ko'rinishini brauzerda tekshirish (12-bo'lim bug-jadvali).
- Bog'liq: [[dars-tili-metodologiya]], [[matn-korpus-tizimi]], [[auditoriya-toshkent-osmiri]]
