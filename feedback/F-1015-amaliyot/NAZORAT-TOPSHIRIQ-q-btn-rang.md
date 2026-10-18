# NAZORAT TOPSHIRIG'I · F-1015-360 · asosiy tugma `.q-btn` rangi (foydalanuvchi qarori 14-B, 17.10)

**Qaror:** fon `#D93A16` (hozir `${Q.accent}` = #FF4F28), yozuv oq — kontrast 3.28 → **4.60** (me'yor 4.5). Suratlar: https://claude.ai/artifact/XgwGdLKqiDwgT9AWMdwYqD (14-savol).
**Fayl:** `src/qolip/qolipCss.js:25` — `.q-btn { … border: 1.5px solid ${Q.accent}; … background: ${Q.accent}; color: #fff; … }`
**O'zgarish:** shu qatorda `border` va `background` rangini `#D93A16` ga (yoki qolip palitrasiga yangi token, masalan `Q.accentBtn`). `.q-2` (ikkinchi daraja), `:hover` (brightness), `:disabled` — o'zgarmaydi.
`:focus-visible` outline `${Q.accent}` qoladi.
**Ta'sir:** 78 dars (qolip-darslar). Keyin: `npm run gates` bir nechta qolip-darsda + bitta darsni ko'z bilan.
**Praktika seansi tegmagan** — umumiy fayl, faqat nazorat orqali.
