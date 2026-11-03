# CI/CD-2 (GitHub Actions) — lokal tayyorgarlik chiqishlari (01.11.2026, avtopilot)

Yasash: `S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-cicd2.sh`. 00–05 — lokal. **01.11 18:20–18:43 — GitHub Actions'da 28 ta haqiqiy tajriba** (`drive-cicd2-actions.sh`, repo `kirishnomi4-wq/mentor-ci-sinov`, private) → `10–61` fayllar, jamlanma: **`06-actions-xulosa.md`**, run linklari `runlar.tsv`.

| Fayl | Nima |
|---|---|
| 00 | Node 24.18 · npm 11.16 |
| 01 | o'quvchi m4c-03 «Repongiz yo'qmi?» namunasi `package.json` (`"test": "echo ok && exit 0"`), lock fayl yo'q |
| 02 | shu repoda `npm ci` → `The npm ci command can only install with an existing package-lock.json …` (kod 1) — GitHub'ning tayyor Node andozasi `npm ci` ishlatadi |
| 03 | `npm install` (kod 0, lock yaratiladi) · `npm test` → `ok` (kod 0) |
| 04 | test buzish uchun skript `echo xato && exit 1` ga o'zgartirilsa → kod 1 (namunada test doim yashil) |

## GitHub sahifalari skrinshotlari (foydalanuvchi, 01.11 19:27–19:33, kirishnomi4-wq)
| Fayl | Run | Izoh (Annotations) |
|---|---|---|
| `30-actions-sahifa-skrinshot.png` | #16 on: once | `Invalid workflow file: .github/workflows/ci.yml#L1` · `(Line: 2, Col: 5): Unexpected value 'once'` — tahlilchi bilan aynan |
| `31-actions-sahifa-skrinshot.png` | #17 runs-on yo'q | `…ci.yml#L1` · `(Line: 5, Col: 5): Required property is missing: runs-on` — aynan |
| `32-actions-sahifa-skrinshot.png` | #18 surilish | `…ci.yml#L4` · `You have an error in your yaml syntax on line 4` — xato 8-qatorda (tahlilchi: line 8) |
| `34-actions-sahifa-skrinshot.png` | #19 echo «: » | `…ci.yml#L8` · `You have an error in your yaml syntax on line 8` — qator to'g'ri, matn umumiy |
| `21-actions-sahifa-skrinshot.png` | #2 sinov: buzildi | Status Failure · Total duration 1m 5s · job `test 1m 3s` · `1 error and 1 notice`: `Process completed with exit code 1.` + ubuntu-latest → Ubuntu 26 eslatmasi |
| `runlar-royxati-skrinshot.png` | ro'yxat | «27 workflow runs» · qator: nom · `CI #27: Commit 1ffb523 pushed by kirishnomi4-wq` · tarmoq belgisi · vaqt; fayl xatosi qatorlarida vaqt o'rnida «Failure»; #20 my-laptop — kulrang (!) belgi, 3m 13s |
Fayl xatosi run'larida sahifa: «This workflow graph cannot be shown», Total duration «–», orqaga havola «.github/workflows/ci.yml» (oddiy run'da «CI»). Secret sozlamalari sahifasi — ko'rilmagan (500, manzil xato).
