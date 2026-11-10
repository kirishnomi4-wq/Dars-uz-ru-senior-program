# F-1105-03 — Abdullohga: 32-hujjatga javob, QA jonli sinov (10.11.2026, tayyor matn — foydalanuvchi yuboradi)

---

Abdulloh, salom. 32-hujjat uchun rahmat — hammasi aniq. Jonli sinovga tayyormiz. Uchta narsa:

## 1. Sinov darsi

- Dars: «Internet qanday ishlaydi» (2-Modul, 1-dars), `lesson_id: internet-01-v18`.
- Fayl: `01-InternetLesson-v6-QA-staging.jsx` (ilova). Bu staging Dars API'ga ulangan yig'ma: yangi natija oqimi (oxirgi ekranda avtomatik `onFinished`, `schema_version: 2`, `dars_api`), versiya `v6`. Prod'dagi fayldan farqi — faqat server manzili.
- Iltimos, QA CRM'da shu darsning JSX faylini (uz va ru — bir xil fayl) shu fayl bilan almashtiring va sinov guruhidagi QA o'quvchilarga Class/kurs ruxsatini bering.
- Vaqt: `[vaqt]`. Bizdan: mentor + kuzatuv (admin va `v2-kuzatuv`).

**Sinov ssenariysi** (sizning 1–4 bandlaringiz shu ichida):
1. Mentor darsni ochadi, 3 ta QA o'quvchi kiradi (bittasi kech).
2. O'quvchi A — oxirigacha; tugma bosmaydi → `lr_` darhol, `applied`, Class yakuni.
3. O'quvchi B — yarmida chiqib ketadi → mentor yopganda `lr_` (`completed:false`).
4. Arena 2–3 savol; O'quvchi C birinchi savolni ko'radi, javob bermaydi → `ap_` + Learn avtomatik hisoblanadi.
5. Mentor arenani yopadi → har o'quvchiga `ar_`; coin to'g'ri, takroriy yuborishda qo'shimcha to'lov yo'q.
6. Learn'dan qisman coin olgan o'quvchi bilan — ikkinchi mukofot yo'q.

## 2. Staging'da eski urinishlar bo'yicha topilma (bizda tuzatildi)

Siz staging'da bayroqni yoqqaningizda (07:32 UTC) bizning server sentyabrdagi eski sinov urinishlari uchun ham v2 hodisalar yaratdi — jami 26 ta. Sizdagi 422 javoblar ham asosan ulardan: «Group and teacher do not match» (11), «result.screens.reached required» (1), «Elapsed time must use the logical end» (1). Bular eski, chala sinov ma'lumotlari — e'tibor bermang.

Tuzatish (`2cbce86`): v2 hodisalar endi faqat yangi oqim yoqilgan lahzadan keyin boshlangan urinishlar uchun yaratiladi, undan oldingilari faqat v1 da qoladi (25-kontrakt §9). Prod'da yoqilganda eski urinishlar bo'yicha hodisa bormaydi. Qo'shimcha: kirib, birorta ekran o'tmagan o'quvchida `screens.reached` endi kamida 1, `total` — darsning ekranlar soni.

Bu versiya staging'ga yuborildi, lekin deploy yiqildi (staging hozir `f65573c5`). Sabab — deploy jurnalida:
```
awk: fatal: cannot open file `.env.deploy' for reading: Permission denied
```
`RESULT_SCHEMA_V2=on` yozilganda `/srv/dars-api/staging/.env.deploy` qayta yaratilgan bo'lsa kerak — `gitlab-runner` ning o'qish ruxsati (ACL) yo'qolgan. Iltimos, serverda:
```
getfacl /srv/dars-api/prod/.env.deploy | sudo setfacl --set-file=- /srv/dars-api/staging/.env.deploy
```
(prod faylining ruxsatlari staging fayliga ko'chadi), keyin GitLab'da deploy job'ini **Retry**. Deploy bo'lganda staging Dars bir marta qayta ishga tushadi — sinovdan oldin bo'lgani ma'qul.

Prod'da bayroq yoqilganda ham shu ehtiyot: faylni joyida tahrirlang (`sudo sed -i …`) yoki keyin `getfacl` bilan `gitlab-runner` ruxsati turganini tekshiring — aks holda keyingi prod deploy shu sabab bilan yiqiladi.

## 3. Bitta savol

«Elapsed time must use the logical end, excluding worker delay» — 32-hujjatda vaqt validatsiyasini bizga moslashtirganingizni yozdingiz. Shu xato endi chiqmasligini tasdiqlaysizmi? Bizda `elapsed_sec` = mantiqiy yakun (oxirgi ekran / sessiya yopilishi / 7 kun) − ochilish; ishchi kechikishi qo'shilmaydi.

Production — kelishilganidek: QA'dagi jonli qabuldan keyin alohida. Bizda prod'da `RESULT_SCHEMA_V2` o'chiq.
