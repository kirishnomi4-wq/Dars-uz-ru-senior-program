# JAVOB v5 — LMS-qismini yopish: 4 ta qiymat + 1 ta fayl

**Kimdan:** Dars-platforma jamoasi · **Kimga:** LMS (Coddy Camp) / School API jamoasi
**Sana:** 2026-09-03 · **Nimaga javoban:** `DARS_PLATFORM_PARTNER_IMPLEMENTATION_RU.md` v1.2 (2026-09-03)
**Bu hujjat v4 dagi S-1…S-8 ro'yxatini yopadi. Qolgan savollar shu yerda, javob shakli tayyor — to'ldirib qaytarsangiz kifoya.**

---

## 0. Holat

v1.2 uchun rahmat. **S-7** (F5 → yangi `jti`, sessiya `role + sub` orqali tiklanadi) va **S-8** (vaqtincha mentor
`temporary_group_mentor`, muddat ichida `role = mentor`) — **yopildi**, §13 ning 21 bandi qabul.

**S-1** (test-akkauntlar) va **S-5** (skrinshot-dalil) ni **biz o'zimiz yopamiz** — akkauntlarni o'zimiz olamiz,
pilot-faylni test-materialga CRM «Umumiy modullar» orqali o'zimiz qo'yamiz. Sizdan bu ikkisi uchun hech narsa kerak emas.

LMS tomonida qolgani — **4 ta qiymat va 1 ta fayl.** Ular kelgan kuni LMS-qismi yopiladi va biz backendni boshlaymiz.

---

## 1. Javob shakli (shu jadvalni to'ldiring)

| № | Savol | Sizning javobingiz |
|---|---|---|
| **S-2a** | `CODDYCAMP_LIVE_JWT_ISSUER` (`iss`) aniq qiymati | `______________` |
| **S-2b** | `CODDYCAMP_LIVE_JWT_AUDIENCE` (`aud`) aniq qiymati | `______________` |
| **S-2c** | `CODDYCAMP_LIVE_JWT_KEY_ID` (`kid`) aniq qiymati | `______________` |
| **S-2d** | Mentor-token va o'quvchi-token **bir xil** `iss` / `kid` / secret bilan chiqadimi? | ha / yo'q |
| **S-3a** | Natija-klient (`lesson_results.*`) limiti, so'rov/daqiqa | `____` |
| **S-3b** | Kontekst-klient (`integration-context`) limiti, so'rov/daqiqa | `____` |
| **S-3c** | `Retry-After` **sekundda** keladimi? | ha / yo'q |
| **S-4a** | Mentor CRM'dan bosganda JSX qaysi **domen**da ochiladi (preview URL) | `https://______________` |
| **S-4b** | O'quvchi LMS'da bosganda qaysi domenda | `https://______________` |
| **S-4c** | Staging yoki mobil-domen bormi? Bo'lsa — ro'yxat | `______________` |
| **S-6a** | `lang="uz" \| "ru"` ni **kim tanlaydi**: material-sozlama / ikkita alohida material / foydalanuvchi tili | `______________` |
| **S-6b** | Mentor va o'quvchi uchun qoida **bir xil**mi? | ha / yo'q |
| **F-1** | v1.2 havola qilgan **`dars-platform-openapi.yaml`** — yangi nusxasi (bizda 25-avgustdagi eski nusxa) | fayl |

Nega muhim, bir jumladan:
- **S-2** — tokenni tekshirishning 12 bandidan uchtasi shu qiymatlarga bog'liq; ularsiz bitta ham JWT o'tmaydi.
- **S-3** — 30 kishilik guruh bir daqiqada 30 kontekst-so'rov beradi; limit past bo'lsa dars boshida `429` yog'iladi.
- **S-4** — bizning backend CORS'ni **faqat shu ro'yxatga** ochadi; noto'g'ri bo'lsa `join` brauzerda bloklanadi.
- **S-6** — bitta JSX-material UZ va RU'da o'tiladi; komponent `lang` prop'ini qaysi manbadan olishini bilishi kerak.
- **F-1** — kontrakt o'zgargan bo'lsa (v1.2 §7/§9), backend eski yaml'ga qurilib qolmasin.

---

## 2. Keyingi tartib

| № | Kim | Nima | Qachon |
|---|---|---|---|
| 1 | **Siz** | 1-jadval — 13 katak | **Bugun** |
| 2 | Biz | Test-akkauntlar (S-1) + pilot-material va skrinshotlar (S-5) | Bugun-ertaga, sizdan bog'liq emas |
| 3 | Biz | Backend (Node + PostgreSQL) + komponent `liveToken` | 1-jadval kelgan kundan |
| 4 | Birga | §13 1–21 + bizning 5 band | Backend tayyor bo'lgach, +7 kun |
| 5 | Siz | Coin-formula mas'uli · rotatsiya `kid v2` | Prod oldidan, bloklamaydi |

Kod-ish sizda tugagan. 13 katak — bitta xabar hajmida.
