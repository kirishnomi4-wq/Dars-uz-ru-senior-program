# Xat IT jamoaga — 01 (F-1015-02, tuzatildi F-1015-03) · 15.10.2026

## RU (yuboriladigan matn)

**Тема: JSX preview — реализация без backend (п. 2.2 контракта)**

Коллеги, прочитали контракт и user story. Предлагаем вариант по п. 2.2 («JSX, который не использует backend-сессии, может игнорировать props»): в preview урок вообще не обращается к Dars-platforma.

**Что делаем в JSX (общий модуль, все 174 урока):**
1. При `visitMode="preview"` нет ни одного запроса к dars-api: ни `/lms/join`, ни `/lms/me`, ни `/me/progress`, ни live-комнаты.
2. Preview всегда главнее: если вместе с ним пришёл `liveToken`, токен игнорируется.
3. PIN-окно не показывается (AC-07). Старая live-сессия из браузера (`liveSession:<id>`) не восстанавливается.
4. Прогресс, ответы и код хранятся только в памяти вкладки. В `localStorage`/`sessionStorage` ничего не пишется, после F5 или закрытия — чистый старт (AC-03, AC-04).
5. Панели ментора нет, вверху метка «Предпросмотр».
6. `previewRunId` принимаем, на сервер не отправляем.
7. `onFinished` урок вызывает как обычно; по п. 2.2 вы передаёте в preview no-op, поэтому результат не создаётся. Сам JSX School API не вызывает.
8. Без `visitMode` всё работает как сейчас (Davomat — AC-08, ученик — AC-09).

Просим включать `visit_mode=preview` в CRM только после того, как мы перезальём уроки — старые файлы покажут PIN-окно.

**Вопросы:**
1. Вариант без backend вам подходит? Preview-сессия, таблица, TTL 24 ч и contract-тесты из п. 6 от нас не нужны? (да/нет)
2. Мы читаем признак preview из трёх источников: prop `visitMode`, `visit_mode=preview` в URL страницы и `window.__CC_VISIT_MODE__`. Какой из них у вас надёжный? Урок открывается внутри iframe — да/нет?
3. Домашние задания тоже открываются в preview из Bilimlar bazasi? (да/нет)
4. Инцидент: какой урок, дата/время, группа? Нужно для проверки причины в логах сервера.
5. Staging: адрес, тестовая группа и тестовый ученик для совместной проверки?
6. Нужно ли в preview что-то отправлять (событие, onFinished с данными), или урок должен молчать? (молчать — да/нет)
7. Этого достаточно? Что ещё нужно от нас?
8. До перезаливки: может ли CRM уже сейчас НЕ выдавать `liveToken` (JWT ментора) при открытии из Bilimlar bazasi? Тогда старые уроки покажут PIN-окно, но в live-комнату группы не попадут — инцидент прекратится сразу. (да/нет)

---

## UZ (tarjima — foydalanuvchi uchun)

**Mavzu: JSX preview — serversiz yechim (kontraktning 2.2-bandi)**

Hamkasblar, kontrakt va user story'ni o'qidik. 2.2-bandga tayangan variantni taklif qilamiz («server sessiyasini ishlatmaydigan JSX yangi proplarni e'tiborsiz qoldirishi mumkin»): preview'da dars Dars-platforma serveriga umuman murojaat qilmaydi.

**JSX'da nima qilamiz (umumiy modul, 174 darsning hammasi):**
1. `visitMode="preview"` bo'lsa, dars-api'ga birorta ham so'rov ketmaydi: `/lms/join`, `/lms/me`, `/me/progress` ham, jonli xona ham yo'q.
2. Preview doim ustun: u bilan birga `liveToken` kelsa ham, token e'tiborsiz qoladi.
3. PIN-oyna chiqmaydi (AC-07). Brauzerdagi eski jonli sessiya (`liveSession:<id>`) tiklanmaydi.
4. Progress, javoblar va kod faqat varaq xotirasida turadi. `localStorage`/`sessionStorage`ga hech narsa yozilmaydi, F5 yoki yopilgandan keyin dars noldan boshlanadi (AC-03, AC-04).
5. Mentor paneli yo'q, tepada «Предпросмотр» belgisi.
6. `previewRunId` qabul qilinadi, serverga yuborilmaydi.
7. Dars `onFinished`ni odatdagidek chaqiradi; 2.2-band bo'yicha preview'da siz bo'sh funksiya berasiz, shuning uchun natija yaratilmaydi. JSX o'zi School API'ni chaqirmaydi.
8. `visitMode` bo'lmasa, hammasi hozirgidek ishlaydi (Davomat — AC-08, o'quvchi — AC-09).

CRM'da `visit_mode=preview`ni faqat biz darslarni qayta yuklaganimizdan keyin yoqishingizni so'raymiz — eski fayllar PIN-oyna chiqaradi.

**Savollar:**
1. Serversiz variant sizga mosmi? Preview-sessiya, jadval, 24 soatlik TTL va 6-banddagi contract-testlar bizdan kerak emasmi? (ha/yo'q)
2. Preview belgisini uch manbadan o'qiymiz: `visitMode` prop, sahifa URL'idagi `visit_mode=preview` va `window.__CC_VISIT_MODE__`. Sizda qaysi biri ishonchli? Dars iframe ichida ochiladimi — ha/yo'q?
3. Uyga vazifalar ham «Bilimlar bazasi»dan preview'da ochiladimi? (ha/yo'q)
4. Hodisa: qaysi dars, sana/vaqt, guruh? Server jurnalida sababni tekshirish uchun kerak.
5. Staging: birga sinash uchun manzil, test-guruh va test-o'quvchi?
6. Preview'da biror narsa yuborishimiz kerakmi (hodisa, ma'lumotli onFinished) yoki dars jim tursinmi? (jim — ha/yo'q)
7. Shu yetadimi? Bizdan yana nima kerak?
8. Qayta yuklashdan oldin: CRM hozirdanoq «Bilimlar bazasi»dan ochilganda `liveToken` (mentor JWT) bermay tura oladimi? Shunda eski darslar PIN-oyna chiqaradi, lekin guruhning jonli xonasiga tushmaydi — hodisa darhol to'xtaydi. (ha/yo'q)
