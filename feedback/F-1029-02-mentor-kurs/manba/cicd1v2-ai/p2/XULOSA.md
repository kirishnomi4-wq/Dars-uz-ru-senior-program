# CI/CD-1 · 2-topshiriq «CI tilida» — XULOSA (F-1125-01, 26.11)

Foydalanuvchi 26.11 (qaror sahifasi v8, 2-savol A — agentlarga ruxsat, darsma-dars). Topshiriq: `../p2-prompt.txt` — bosqichlar nomi bilan (lock bo'yicha o'rnatish · tur tekshiruvi · test · build), buyruqlarsiz; «Node versiyasi mening mashinamdagi bilan bir xil». Asos va modellar 1-topshiriq bilan bir xil: OrderBotNest `jest2-done` (e15a44c), git tarixsiz `git archive` nusxa; 1-AI Opus, 2-AI Haiku (agent). Javoblar aynan — `ai*/00-javob.md`.

| | Oddiy (p1, 04.11) · 1-AI / 2-AI | CI tilida (p2, 26.11) · 1-AI / 2-AI |
|---|---|---|
| `node-version` | 22 / 22 — mashinani so'ramadi | `'24.18.0'` / `'24.18.0'` — ikkalasi `node -v` ni o'zi yurgizib oldi |
| Qadamlar | checkout · setup-node · `npm ci` · `npm test` | + tur tekshiruvi (`npx tsc --noEmit` / `npm run lint` = `tsc --noEmit`) · `npm run build` |
| Actions | `@v4` / `@v4` | `@v7` / `@v4` (v7 tegi haqiqatan bor — GitHub API, 26.11) |
| Qo'shimcha | — / `permissions` | `permissions`, `timeout-minutes: 15` / `permissions` |
| Lenta | GitHub: run 19, 20 — `npm ci` ✗ (`Missing: webpack… from lock file`); 22 → 24 bilan run 21 ✓ | lokal lenta (`../../lenta-lokal.py`, toza nusxa, Node 24.18) — ikkalasi ✓ (`ai*/lenta-lokal.txt`); GitHub'da yurgizilmagan (push — foydalanuvchi ruxsati bilan) |
| 15-ekran tur xatosi | `tsc` qadami yo'q — run 14 yashil (yolg'on yashil) | ikkalasi tur tekshiruvi qadamida ✗, test va build yurmadi (`ai*/lenta-tur-xatosi.txt`) |

## Saboq
1. Mavzu tilidagi topshiriq 19-ekrandagi to'rt savolning hammasiga javob berdi: versiya mashinadan, `npm ci`, tur tekshiruvi, build. Ikkala AI versiyani taxmin qilmadi — `node -v` ni yurgizdi.
2. 1-topshiriqdagi ikki zaif joy (versiya 22, `tsc`/`build` yo'q) aniq topshiriq bilan yo'qoldi; lekin GitHub'dagi birinchi yurish hali ko'rilmagan — darsda «lokal lentada» deb aytiladi.
3. AI xato qilmagan joyda xato o'ylab topilmaydi (M56-3): «satrni bosing» 1-topshiriqdagi haqiqiy satr bilan (`node-version: 22`, run 19 → 21).

## Halol cheklov
- Opus'ning «lokal repoda `main` yo'q, `master` bor» ogohlantirishi — bizning nusxamizdan (`git init` standart nomi); haqiqiy OrderBotNest'da asosiy tarmoq `main` (`git remote show origin`). AI xatosi emas.
- Opus `npm ci` ni nusxaning o'zida yurgizib, ko'chirilgan `node_modules` dagi 29 ortiqcha paketni o'chirdi (bizning nusxa usulimiz — keyingi tag'lardan qolgan paketlar); natijaga ta'siri yo'q.
- Opus `actions/node-versions` va relizlarni tarmoqdan tekshirgan bo'lishi mumkin (javobida aytgan) — topshiriq papkasidan tashqariga fayl o'qish emas, tarmoq.
