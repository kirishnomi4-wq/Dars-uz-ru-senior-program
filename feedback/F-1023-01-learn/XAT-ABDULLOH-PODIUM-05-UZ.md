# PODIUM-05 — javob va tuzatish (28.10.2026)

Abdulloh, PODIUM-01…04 tasdig'i uchun rahmat. PODIUM-05 ni haqiqiy Dars API'da tekshirdik: siz topgan holat
tasdiqlandi va tuzatildi. Tuzatish **Dars API tomonida**, JSX namunasi (`internet-01-v18-codestrike-podium-v2-20261028.jsx`,
SHA `a30ae77a…85e18cb`) o'zgarmaydi.

## Nima bo'lgan edi

Dars API arena javobini **arena yakunlangandan keyin ham** qabul qilardi. Dars esa tarmoq xatosida javobni 3, 6 va 9 soniyadan
keyin qayta yuboradi. Natijada mentor arenani yakunlagach (`quiz_state: done`) kechikkan javob jadvalga tushar, o'rin esa
done paytidagi jadvaldan hisoblangan bo'lardi — sizdagi «3-o'rin, keyin 1-o'rin».

Haqiqiy serverda (staging, eski versiya) shu stsenariyni skript bilan takrorladik: done'dan keyin yuborilgan 3 ta javob va
1 ta urinish **qabul qilindi**, jadval 3 qatordan 7 qatorga o'sdi.

## Nima qilindi — serverda kafolat

Dars API migratsiyasi `0010_arena_yopilishi` (prod'da 28.10 17:49, versiya `0.1.0+0f242c77`, migratsiya 10/10):

- Sessiyada birinchi marta `done` bo'lgan vaqt saqlanadi (`quiz_done_at`). Keyin holat o'zgarsa ham (masalan `lobby` → `q`)
  u tozalanmaydi — yopilgan arena qayta ochilib to'ldirilmaydi.
- Shundan keyin **arena javoblari** (savol ekrani ≥ 100) qabul qilinmaydi: `submit_answer` → `false`, `record_attempt` → `0`.
  Bu xato emas (o'quvchiga xabar chiqmaydi), dars qayta yubormaydi.
- Javob va «yakunlash» bir lahzada kelsa — sessiya qatori qulflanadi: javob yo done'dan oldin yoziladi, yo keyin rad etiladi,
  o'rtasi yo'q.
- Darsning oddiy savollari (ekran < 100) va boshqa hamma narsa avvalgidek.

**Kafolat:** `quiz_state: done` bo'lgandan keyin `GET /api/v1/live/answers/<pin>?range=arena` jadvali o'zgarmaydi.
JSX (v2 namuna) o'rinni aynan shu, done'dan keyin yuklangan jadvaldan hisoblaydi (PODIUM-02 tuzatishi) — endi u yakuniy.
Hamma o'quvchida va istalgan vaqtda qayta hisoblansa ham bir xil chiqadi. API shartnomasi o'zgarmadi.

## Dalillar

Skript: mentor sessiya ochadi → 3 o'quvchi → 2 savol → `done` → kechikkan javoblar (o'ziniki, boshqalarniki, yangi savol,
`record_attempt`) → arena qayta ochiladi → dars-ekran savoli. 12 tekshiruv.

| Muhit | Versiya | Natija |
|---|---|---|
| staging, tuzatishdan oldin | `8c773b6d`, migratsiya 9 | 7 tekshiruv yiqildi — kechikkan javoblar qabul qilindi |
| staging, tuzatishdan keyin | `fc5ef423`, migratsiya 10 | 12/12 |
| **prod**, tuzatishdan keyin | `0f242c77`, migratsiya 10 | **12/12** |

Qo'shimcha: server integratsion testlari 86/86 (6 tasi yangi: done gacha/keyin, qayta ochish, dars-ekran savoli,
`record_attempt`, poyga ikki yo'nalishda); prod qabul tekshiruvi (faqat o'qish) 17/17; staging to'liq 19/19.

## Bitta chekka holat (ochiq aytamiz)

O'quvchi javobni **done'dan oldin** bosgan, lekin tarmoq sabab u serverga **done'dan keyin** yetib kelgan bo'lsa:
- serverda bu javob yo'q → o'rin (`podium.place`) va `arena_top_N` unda hisobga olinmaydi — hamma uchun bir xil qoida;
- darsning o'zida (`codestrike.correct`, Learn 7/12 qarori) bu javob qoladi, chunki o'quvchi haqiqatan javob bergan.

Ya'ni o'rin va Learn qarori shu chekka holatda bir savolga farq qilishi mumkin. Bizningcha bu adolatli (o'rin — vaqtida yetib
kelgan javoblar bo'yicha musobaqa, Learn — o'quvchining bilimi). Boshqacha bo'lishini xohlasangiz, ayting.

## Iltimos

Shu stsenariyni o'z tomoningizdan prod yoki QA Dars API'da qayta yurgizing: `done`dan keyin kechikkan javob jadvalga
tushmasligi va JSX o'rni o'zgarmasligi kerak. OK bo'lsa, podiumni 172 darsga yoyib, SHA ro'yxatini yuboramiz.
