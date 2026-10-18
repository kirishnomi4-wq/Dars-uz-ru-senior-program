# Nazorat seansiga topshiriq — m4-08 ↔ m4-09 tartibi (F-1015-352, 17.10)

**Kimdan:** praktika seansi (avtopilot). **Qaror:** foydalanuvchi, 17.10 ertalab (qaror sahifasi, 5-savol, javob A).
**Nega:** «Praktika: Backend CRUD» (m4-08) Postman'ni ishlatadi, lekin «API va Postman» darsi (m4-09) undan keyin turibdi. Postman darsi oldin bo'lishi kerak.
**Umumiy fayl** — kelishuvga ko'ra faqat nazorat tegadi. Praktika seansi bu fayllarga tegmadi.

## O'zgarish (faqat `n` va qator tartibi; kalitlar, comp, lessonId, progress — o'zgarmaydi)

### 1. `src/App.jsx` (5-blok, slug `m4`)
Hozir (300–301-qator):
```
{ key: 'm4-08', n: 8,  type: 'Proyekt', … title: 'Praktika: Backend CRUD — AvtoIjara', … comp: BackendCrudPracticeLesson },
{ key: 'm4-09', n: 9,  type: 'Kod',     … title: 'API va Postman — front backend bilan qanday gaplashadi', … comp: ApiPostmanLesson },
```
Bo'ladi — ikki qatorning o'rni almashadi va `n` raqamlari:
```
{ key: 'm4-09', n: 8,  type: 'Kod',     … title: 'API va Postman — front backend bilan qanday gaplashadi', … comp: ApiPostmanLesson },
{ key: 'm4-08', n: 9,  type: 'Proyekt', … title: 'Praktika: Backend CRUD — AvtoIjara', … comp: BackendCrudPracticeLesson },
```

### 2. `src/mentor/lessons.jsx` (167–168-qator)
`be-08` (Praktika: Backend CRUD) va `be-09` (API nima + Postman) qatorlarining o'rni va `n` raqami xuddi shunday almashadi (`be-09` → n: 8, `be-08` → n: 9). Kalitlar o'zgarmaydi.

## Tekshirish
- `npx esbuild src/App.jsx --bundle …` toza; `npm run lint:jsx` 0.
- Saytda 4-modul ro'yxati: 8 — API va Postman, 9 — Praktika: Backend CRUD, 10 — Praktika: Fullstack ulash.
- «Keyingi dars» yozuvlari: m4-07 (PmLesson12), m4-08, m4-09 da aniq dars nomi aytilmaydi — tuzatish kerak emas (praktika seansi grep qildi).

## Foydalanuvchiga (LMS)
LMS'dagi 4-modul (LMS 5) dars tartibini qo'lda almashtirish kerak — darslar LMS'ga foydalanuvchi tomonidan yuklanadi.
