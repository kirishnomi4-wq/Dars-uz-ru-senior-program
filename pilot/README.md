# pilot/ — LMS `liveToken` pilot-darsi (2026-08-27)

**Maqsad:** LMS jamoasi «`liveToken` qo'shilgan JSX'ni yuboring» dedi. Bu papka —
o'sha fayl. Asl darsga (`src/1-Modull/InternetLesson.jsx`, `lms/InternetLesson.jsx`)
**tegilmagan**; pilot — alohida nusxa.

| Fayl | Nima |
|---|---|
| `InternetLesson.liveToken.jsx` | **LMS'ga yuboriladigan fayl** (yig'ilgan, bitta fayl, 427 KB) |
| `src/InternetLesson.liveToken.jsx` | Manba (asl darsning nusxasi + 4 o'zgarish) |
| `smoke-livetoken.mjs` | Brauzer-sinov: tokensiz · student · mentor · buzuq · keyin-keladi |

## Nima qo'shildi (faqat 4 joy)

1. `lmsTokenPeek()` — JWT payload'ni **imzosiz** o'qiydi (faqat ko'rsatish uchun).
2. `LmsTokenBadge` — pastki-chap burchakda kichik belgi: token kelganmi, `role/sub/name/gid/crm_id`,
   header `alg/typ/kid`, `iss/aud/exp/jti`.
3. `export default function HtmlLesson({ lang, onFinished, liveToken })` — yangi prop.
4. `useEffect([liveToken])` — prop avval `null`, keyin kelsa belgi yangilanadi (LMS §4 talabi).

## Nima QILMAYDI (ataylab)

- Imzo tekshirmaydi, claim'larga ishonmaydi, ism/rolni darsga qo'llamaydi — PIN-oqim o'zgarishsiz.
- Tokenni hech qayerga yubormaydi, `console`/localStorage'ga yozmaydi.
- Haqiqiy tekshiruv (HS256, iss/aud/kid, jti↔sessiya) — backend, 2026-09-02 dan keyin.

## LMS jamoasi bu fayl bilan nimani tekshiradi

- §13-1: `liveToken`siz ochilsa — «LMS-token: kelmadi (oddiy rejim)», dars ishlaydi.
- §13-2 (qisman): token kelsa — «LMS-token keldi ✅» + `role: student · sub · name`.
- Biz: real LMS-token header'ida `kid`/`typ` qanday chiqishini ko'ramiz (JAVOB v2 §6.4).

## Qayta yig'ish

```
node scripts/build-lms.mjs pilot/src/InternetLesson.liveToken.jsx   # → lms/InternetLesson.liveToken.jsx
mv lms/InternetLesson.liveToken.jsx pilot/                            # lms/ da qoldiq qolmasin
node pilot/smoke-livetoken.mjs                                        # 5 holat, oq ekran yo'q
```

Darvozalar: `node gates.mjs pilot/src/InternetLesson.liveToken.jsx` — esbuild/jsx/prompt toza;
dark+til topilmalari asl fayl bilan aynan bir xil (5 error / 7 warn — eski, pilotniki emas).
