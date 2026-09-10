# F-0910-01 — o'quvchi mentordan oldin kirsa jonliga ulanmasdi (2026-09-10)

**Nima edi:** o'quvchi (Nigora, G-2) darsni 10:01 da ochdi → «Mustaqil rejim». M-2 keyin ochdi (kod 088 114) → o'quvchi ulanmadi, 👥 0.
**Sabab:** server faol solo urinishni «har doim davom» deb qaytarardi, guruhda jonli dars paydo bo'lganini tekshirmasdi; dars ham solo'da qayta so'ramasdi.
**Tuzatildi:** server (solo → avval jonli qidiruv → solo `live_started` bilan yopiladi, natija yuborilmaydi) + dars (har 20 s jim so'rov, «🎉 Mentor darsni boshladi» belgisi 8 s).

## Qayta sinov (staging)
0. **CRM test-materialiga YANGI yig'ma:** `lms/InternetLesson.jsx` (2026-09-10 12:xx). Tekshirish: faylda `LMS_SOLO_RECHECK_MS` so'zi bor.
   Staging serverda yangi kod: `https://staging-dars-api.coddycamp.uz/api/v1/health` → `"migrations":7`.
1. O-4 (yoki Nigora) LMS'da darsni ochadi — M-2 hali ochmagan → «📘 Mustaqil rejim».
2. M-2 CRM'dan G-2 (1072) darsni ochadi → «Kod: ###», 👥 0.
3. **O-4 hech narsa bosmaydi.** ≤25 s ichida belgisi: «🎉 Mentor darsni boshladi — jonli darsga ulandingiz» → 8 s dan keyin «👨‍🏫 Mentor: 1 / 22 · ism».
   M-2 belgisida 👥 1. O-4 ekrani 0-ekranga qaytadi (jonli urinish toza boshlanadi — bu to'g'ri).
4. Tab fonda bo'lsa so'rov to'xtaydi — tabga qaytganda darhol o'tadi.
5. Biz: `lms-watch` — solo `ended (live_started)`, `qo'shildi student` M-2 sessiyasida.

Kutilmagan narsa bo'lsa: skrinshot + vaqt (soat:daqiqa) shu papkaga.
