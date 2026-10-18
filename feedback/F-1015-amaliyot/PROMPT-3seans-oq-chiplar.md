Praktika seansidan topshiriq (F-1015-361 davomi). Foydalanuvchi qarori ALLAQACHON berilgan (17.10, 13-A: «sudraladigan oq chiplar — hamma modullarda gradient, kartalarni alohida ko'rsat»).

Qoida: DARS_ETALON 159.15 «To'ldirilgan chip» + tekshiruvchi ov-bandi 22. Sudraladigan CHIP — fon `linear-gradient(170deg, #FF8A3D, ${T.accent})`, oq matn, chegarasiz, «⠿» ushlagich (`::before`), soya `0 8px 16px -8px rgba(255,79,40,.6), inset 0 2px 0 rgba(255,255,255,.3)`.
Namuna-qator: `src/6-Modull/SystemArchitectureLesson.jsx` `.dd-chip` va `.dd-chip::before`. Tayyor yordamchi: `feedback/F-1015-amaliyot/seans-vositalar/qurish/dd_gradient.py`.

Sizning doirangizda 4 fayl qoldi (oq fon + chegara, `cursor: grab`):
- src/4-Modull/DataIntroLesson.jsx — `.cdrag-chip` (≈3466)
- src/4-Modull/DbSqlNosqlLesson.jsx — `.qx-card` (≈2800)
- src/4a-Modull/NestArchAliveLesson.jsx — `.rz-card` (≈3590)
- src/4a-Modull/NestArchResourceLesson.jsx — `.oc-plate-chip` (≈2870)

Tartib:
1. Har birining sudrash ekranini suratga oling (`feedback/F-1015-amaliyot/seans-vositalar/sinov/f361-dd-surat.mjs` — selektorni `.dd-chip` dan o'sha klassga almashtiring).
2. Kichik chip (bir so'z/qator) → gradientga o'tkazing. Katta KARTA (ichida bir necha qator, rasm, rangli belgi) → O'ZGARTIRMANG, suratini foydalanuvchiga ko'rsating, qarorini so'rang.
3. Chipning tanlangan/joylangan holatlari (`.on`, `.in`, `.ok`, inline `style` halqa) gradient ustida ko'rinsin — kerak bo'lsa oq+accent halqa (`0 0 0 2px paper, 0 0 0 4px accent`).
4. `npm run gates -- <fayl>` (tell/emoji — HEAD bilan solishtiring) + oldin/keyin surati. Jurnalingizga F-ID bilan; praktika jurnaliga ham bir qator (F-1015-361 davomi).
Eslatma: 1–4c dagi 17 ta `.dd-chip` ni praktika seansi 12:17 da allaqachon qildi (`XABAR-3seans-dd-chip.md`) — zaxiradan tiklasangiz yo'qoladi.
