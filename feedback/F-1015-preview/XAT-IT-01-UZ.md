
# JSX preview — serversiz yechim (kontraktning 2.2-bandi)

Hamkasblar, salom!

`jsx_preview_mode_backend_contract.md` va `jsx_preview_mode_user_story_acceptance.md` ni o'qib chiqdik. 2.2-bandga tayangan variantni taklif qilamiz (u yerda «server sessiyasini ishlatmaydigan JSX yangi proplarni e'tiborsiz qoldirishi mumkin» deyilgan). Ya'ni preview'da dars Dars-platforma serveriga **umuman murojaat qilmaydi**.

## JSX tomonda nima qilamiz

Bu o'zgarish umumiy modulda qilinadi va 174 darsning hammasiga birdaniga tegadi.

1. `visitMode="preview"` bo'lsa, dars-api'ga birorta ham so'rov ketmaydi: `/lms/join`, `/lms/me`, `/me/progress` ham, jonli xona ham yo'q.
2. Preview doim ustun turadi: u bilan birga `liveToken` kelsa ham, token e'tiborsiz qoladi.
3. PIN-oyna chiqmaydi (AC-07). Brauzerda saqlanib qolgan eski jonli sessiya (`liveSession:<id>`) tiklanmaydi.
4. Progress, javoblar va kod faqat ochiq varaqning xotirasida turadi. `localStorage` va `sessionStorage` ga hech narsa yozilmaydi. F5 bosilsa yoki varaq yopilsa, dars noldan boshlanadi (AC-03, AC-04).
5. Mentor paneli bo'lmaydi, tepada «Oldindan ko'rish» belgisi turadi.
6. `previewRunId` qabul qilinadi, lekin serverga yuborilmaydi.
7. Dars `onFinished` ni odatdagidek chaqiradi. 2.2-band bo'yicha preview'da siz bo'sh funksiya berasiz, shuning uchun natija yaratilmaydi. JSX o'zi School API'ni chaqirmaydi.
8. `visitMode` bo'lmasa, hammasi hozirgidek ishlaydi (Davomat — AC-08, o'quvchi — AC-09).

**Iltimos:** CRM'da `visit_mode=preview` ni faqat biz darslarni qayta yuklaganimizdan keyin yoqing. Eski fayllar preview'ni tanimaydi va PIN-oyna chiqaradi.

## Savollar

1. Serversiz variant sizga mosmi? 6-banddagi preview-sessiya, jadval, 24 soatlik TTL va contract-testlar bizdan kerak emasmi? *(ha / yo'q)*
2. Preview belgisini uchta manbadan o'qiymiz: `visitMode` prop, sahifa URL'idagi `visit_mode=preview` va `window.__CC_VISIT_MODE__`. Sizda qaysi biri ishonchli? Dars iframe ichida ochiladimi? *(ha / yo'q)*
3. Uyga vazifalar ham «Bilimlar bazasi»dan preview'da ochiladimi? *(ha / yo'q)*
4. Hodisa qaysi darsda, qaysi sana va vaqtda, qaysi guruhda bo'lgan? Sababni server jurnalida tekshirish uchun kerak.
5. Staging: birga sinash uchun manzil, test-guruh va test-o'quvchini bera olasizmi?
6. Preview'da biror narsa yuborishimiz kerakmi (hodisa yoki ma'lumotli `onFinished`), yoki dars jim tursinmi? *(jim — ha / yo'q)*
7. Shu yetadimi? Bizdan yana nima kerak?
8. **Darslarni qayta yuklagunimizcha:** CRM hozirdanoq «Bilimlar bazasi»dan ochilganda `liveToken` (mentor JWT) bermay tura oladimi? Shunda eski darslar PIN-oyna chiqaradi, lekin guruhning jonli xonasiga tushmaydi, ya'ni hodisa darhol to'xtaydi. *(ha / yo'q)*

Javobingizni kutamiz. Rahmat!
