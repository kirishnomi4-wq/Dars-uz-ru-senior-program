---
name: boshqaruv-dispetcher
description: "CLAUDE.md dispetcher-mexanizmi (2026-07-24): 4 hujjat-tur, vaziyat→retsept jadvali (A yangi dars · B feedback F-ID bilan · C yaxshilash · D commit), uy-tartibi (arxiv/, feedback/, OQUVCHI_DARVOZA ildizda)"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2bb3619-50aa-4005-b86f-49c1f16d7c15
  modified: 2026-07-24T20:05:35.032Z
---

2026-07-24: foydalanuvchi «MD/rollar ko'payib ketdi, mexanizm kerak, shaffof bo'lsin» dedi → **CLAUDE.md dispetcher** yaratildi (repo ildizida, har seansda avto-yuklanadi). Tuzilma: hujjat-xarita (QONUN/JARAYON/HOLAT/ROLLAR) + vaziyat-jadvali + 4 retsept (A yangi PM dars · **B feedback: F-MMDD-NN ID → tashxis-avval → tuzatish → qonunlashtirish-marshruti (so'z→lug'at · UX→ETALON-qonun · bug-sinf→tekshiruvchi-rol · jarayon→PIPELINE) → STATE-jurnal** · C yaxshilash · D commit).

**Uy-tartibi ko'chirishlari:** `.claude/PIPELINE_QOSHIMCHA_v2.md` → `OQUVCHI_DARVOZA.md` (ildiz, referenslar yangilandi) · L1_TARIX/AVTOPILOT_CHECKPOINT/TIL_LINT_HISOBOT → `arxiv/` (rol-fayllardagi havolalar `arxiv/L1_TARIX.md`ga yangilandi) · rasm-annotatsiyalar + METODIST-prompt-fidbek → `feedback/` (public/ = faqat sayt-fayllar) · `darslik-qabulchi.md` ildizdan → `.claude/agents/role/` (oqimga hali ulanmagan).

**F-0724-01 (birinchi retsept-B ishlashi, 2026-07-24):** `prompt-lint.mjs` yaratildi — rol/qonun/jarayon MD'larda ARALASH-YOZUV homoglif-so'z detektori (`npm run lint:prompt`, `--fix` bilan tuzatadi). Aqlli istisnolar: sof-kirill ru-namunalar, ruscha defis-birikmalar («PM-уроков» qonuniy), jurnal-misollar (satrda «xatoWord→tuzatilgan» qayd bo'lsa skip). 8 xato tuzatildi (metodist 1, tekshiruvchi 4, PM_DARS_ETALON 2, RU_I18N_SPEC 1); MATN_ETALONI 8 hit = jurnal-misollar (tegilmadi), PM_Prompt_v8 11 hit = ruscha-birikmalar (qonuniy). Hujjat-MD tahrirlangan seans yakunida shu darvoza yuritiladi (CLAUDE.md 4-tamoyil + PIPELINE 9-qoida).

**Why:** foydalanuvchi so'zi qaysi retseptga tushishi va natija qayerga yozilishi oldindan ma'lum bo'lsin — shaffoflik.
**How to apply:** har so'rovda avval CLAUDE.md vaziyat-jadvalidan retseptni top; feedback kelsa F-ID ber va 4-marshrutdan AYNAN bittasiga muhrla; CLAUDE.md'ni o'zgartirish = jarayon-o'zgarish, faqat foydalanuvchi roziligi bilan. Bog'liq: [[pipeline-qoidalari]], [[pm-etalon-yaxshilash]], [[diagnose-before-fix]].
