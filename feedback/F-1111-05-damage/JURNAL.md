# F-1111-05 — `zarar(3)` → `damage(3)` (2-M «JS: funksiya va massiv», `JsFunctionsLesson.jsx`)

## 11.11 19:40 · Fidbek → tashxis → tuzatish

**Fidbek (mentor, foydalanuvchi orqali):** `rasm/mentor-fidbek-zarar3.png` — «Funksiyani o'qing»: kodda `function damage(power) { return power * 3 }`, savol «`zarar(3)` nimani qaytaradi?». Foydalanuvchi: «to'g'irlab bering».

**Tashxis:** F-1027-01 (27.10, kod nomlari inglizcha) kodni `zarar→damage`, `kuch→power` qilib almashtirgan, lekin ekrandagi savol sarlavhasi (uz + ru) eski nomda qolgan → savolda so'ralgan funksiya kodda yo'q. LMS'ga yuboriladigan `questionText` avvaldan `damage(3)` (SAVOL_MATNLARI o'zgarmaydi).

**Sinf-supurish** (F-1027-01 lug'atlari `lugat/*.json`, 10 lug'at → 12 dars fayli; `eski(`, `` `eski` ``, `>eski<`; izoh va nasr so'zi hisobga olinmaydi): asosiy darslarda 3 qoldiq — hammasi shu darsda:
- 1225 Screen5b (s6): savol `zarar(3)` → `damage(3)` (uz + ru)
- 1155 Screen3: ru «параметр <b>kuch</b>» → `power` (uz avvaldan `power`)
- 1727 Screen15 (s16): ru «напишите функцию zarar сами» → `damage` (uz avvaldan `damage`)
Qolganlar: `src/2-moodull eski/` (arxiv, LMS'da yo'q) · JsLoops 844 «massiv» (nasr so'zi) — tegilmadi. `src/hw-qa/data.js` (QA sayti nusxasi) va `uyga-vazifa-v2/REJA.md` da eski `zarar(kuch, bonus)` — LMS emas, tegilmadi.

**Darvozalar:** 11/13 ✓; `tell` 2 + `emoji` 4 — HEAD bilan aynan bir xil (eski). **Ko'z bilan:** `rasm/jsfn-s6-uz.png` «damage(3) nimani qaytaradi?» · `rasm/jsfn-s6-ru.png` «Что вернёт damage(3)?» · `rasm/jsfn-s16-ru.png` «напишите функцию damage сами» — xatosiz.
**Qonunlashtirish:** `.claude/agents/role/darslik-tekshiruvchi.md` — F-1027-01 ov-bandiga «Matn ham» gapi.

**Keyingi:** commit → paket (F-1111-04 bilan birga) → CRM → muhr.
