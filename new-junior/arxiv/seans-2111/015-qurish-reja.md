# 15-dars «Xakaton №1» — qurish rejasi (bosh seans, 21.11 kech)

Manba: `manba/015-xakaton-1.md` v1.1 (Savollar 1–18 — A, foydalanuvchi). Bu fayl — faqat qurish tartibi va dvigatel qarorlari
(seans uzilsa shu yerdan davom). Kod — `darslar/015-xakaton-1/`, dvigatel — `studiya.js` «15-dars» bo'limi, `qobiq.js` (juftlik).

## Ekranlar (bola)
- B0 kirish · P2N savol · **BJ** juftlik tanlovi (2 karta) · **BJQ** do'st qahramoni (ikkinchi noutbuk) · **BJD** «Juftlikdasiz»
- **BT** o'yin tanlash → qismlar → «Tanladik» → «Birinchi haydovchi sichqonchani olsin.» «Tayyormiz»
- **BX** studiya (2-bekat, yasash): qismlar navbat bilan, rollar, «Almashdik»
- **BS** studiya (3-bekat, sinash ro'yxati) — BX bilan bir holat (localStorage)
- **BD** do'stlar o'ynaydi — o'sha studiya, dastur va javon yopiq (`bosh.dost`), keyin «Sizga yoqdi:», egasiga natija
- B5 natija

## Dvigatel qarorlari
1. **Bitta holat** `K+'xk'` = { oyin: 'olma'|'lab', qism: [id…], hozir, tayyor{}, kim{}, sina{}, haydovchi, dost[] }.
2. **Birlashgan Olma o'yini** — 11–12-dars `bosh.ball` + `bosh.xk`: strelka bosilsa qahramon o'zi yurmaydi, `when key` dasturchalari ishlaydi
   (4-dars); dasturchasi yo'q hodisa (kaktus, olma, oltin) — muammochasiz (faqat «tuk»/terish), agar shu qism hozirgi qism bo'lmasa.
   Kostyum/tovush bloklari olma hodisasida (7-dars bajaruvchisi).
3. **Labirint** — 9–10-dars `bosh.labirint`; yasash qismlari (2-daraja, kalit-eshik, ★ uzun) hozirgi bo'lsa — `bosh.yasash` (L2), javon o'rnida asboblar;
   2-daraja tayyor bo'lsa o'yin `darajalar: ['D1','L2']`.
4. **TOP(id).bosh** — BX/BS/BD da har qism almashganda joyida yangilanadi (`xkBosh`).
5. **Qism tayyor** = statik shart (jadval) + o'yin seansi muammochasiz tugadi (yutdi / game over / to'xtatildi, kamida 1 bosish).
6. **Juftlik** — `qobiq.js`: `K+'juft'` = 'oyin'|'ikki'; ikkinchi noutbuk QADAM[i][4] ro'yxati bo'yicha yuradi; natija ustoz orqali
   (`bildir {t:'xk'}` → ustoz qadam xabariga `xk: {qah: natija}`).
7. **Huk** — hukAvto kartalari: A (ikki bir xil dasturcha, ↑ — Bo'shvoy), B (ikki yarim o'yin — ketma-ket ikki dastur), C (to'liq o'yin).

## Tartib (har bosqichdan keyin sinov)
1. manba → dars papkasi skeleti (dars, qismlar, ekranlar, qadamlar, uslub) — statik ekranlar 1–8, 10, 12, 16–18
2. huk (2–4)
3. BT tanlash ekrani
4. BX: Olma o'yini (xk) + qismlar + rollar + karta/maslahat
5. BX: Labirint qismlari (yasash bilan)
6. BS sinash ro'yxati · 13-qadam ustoz namoyishi
7. BD do'stlar + «Sizga yoqdi:» · natija B5, sinf natijasi
8. juftlik (qobiq) + ikkinchi noutbuk + ustoz orqali natija
9. solo · `sinov/dvigatel/xakaton.mjs` · to'liq/solo/tovush sinovlari · setka (Chrome + WebKit) · matn · oltin · regressiya 1–15
