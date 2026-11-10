# Jest-1 v2 · AI tajribasi, 2-prompt (21-ekran, aniq shartli) — XULOSA (F-1104-01, 04.11)

Prompt: `../p2-prompt.txt` (MD 21-ekrandan aynan). Har agent `tgpg-done` ning yangi nusxasida. ai1 — Opus, ai2 — Haiku.

| | ai1 (Opus) | ai2 (Haiku) |
|---|---|---|
| Fayllar | faqat `texts.spec.ts` (210 qator) | faqat `texts.spec.ts` (148 qator) |
| Testlar | 17, yashil | 12, yashil |
| Etalonda `${som(` / `${STATUS_UZ` | yo'q | yo'q |
| `toBeTruthy` | yo'q | yo'q |
| `\u00a0` escape matni | **0** — faylda ko'rinmas belgi 17 ta | **0** — faylda ko'rinmas belgi 13 ta |
| Javobidagi da'vo | «bo'linmas probel hamma joyda … ochiq yozilgan» | «… probel … bilan yozilgan» |

Buzib tekshirish (`mutatsiya-p2.txt`, Haiku toza nusxada — `mutatsiya-p2-haiku-toza.txt`):
| Buzish | ai1 (17) | ai2 (12) |
|---|---|---|
| B1 `som` en-US | 11 | 7 |
| B2 savatda hozirgi narx | 1 | 1 |
| B3 / B4 klaviatura | 0 / 0 (promptda yo'q — kutilgan) | 0 / 0 |
| B5 `STATUS_UZ.NEW` | 5 | 3 |
| `CANCELLED` → «🆕 Yangi» | 3 | 3 |

**Saboq:** aniq shartli prompt bilan 1-promptdagi ikki zaif joy (etalon koddan, `toBeTruthy`) yo'qoldi — uch buzish ham ushlandi. Lekin «`\u00a0` bilan ochiq yoz» sharti ikkalasida ham faylda bajarilmagan, javob esa «bajardim» deydi. Ehtimoliy sabab — AI'ning fayl yozish vositasi escape'ni belgiga aylantiradi (biz ham aynan shunga tushdik, memory `tekshiruv-vositalari-tuzoqlari` 04.11); sababidan qat'i nazar, da'vo `grep -c 'u00a0'` bilan tekshiriladi.
**Halollik:** ai2 nusxasiga men bexosdan `CANCELLED` `sed` ini qo'llagan holda birinchi o'lchov qilindi — o'chirildi, toza nusxada qayta o'lchandi.
