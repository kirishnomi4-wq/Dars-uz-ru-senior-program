#!/usr/bin/env python3
"""F-1125-01 · 3-savol, A varianti (26.11, foydalanuvchi: «hammasi yaxshi … realizatsiya»): AI tekshiruv savollari AI'ning haqiqatda yozganiga moslanadi.
CI/CD-1 20-ekran — savolda «AI `npm install` yozdi» edi; haqiqatda ikkala AI `npm ci` yozgan (manba/cicd1v2-ai/ai*/.github/workflows/*.yml).
   Ekrandagi yml ham namuna edi (5-npm-install.yml, node-version 24 — sarlavhadagi 22 bilan zid) → 1-AI fayli aynan (KOD.YML_AI1).
   To'g'ri javob: «node-version 24 va tsc, build qadamlarini qo'shish».
WebSocket-2 19-ekran — «AI: Sinadim — … panel #2 ni ko'rsatdi» edi; AI bunday demagan (manba/ws2v2-ai/ai1/00-javob.md: eski va yangi
   sahifada 4 holat solishtirgan). Omadli urinish (ai1/01a) — bizning birinchi sinovimiz. Javobga: 1-AI o'zi to'g'ri sinagan.
Jest-1 20-ekran — sarlavhada `expect(STATUS_UZ.CANCELLED).toBeTruthy()` edi; AI satri `for (const s of all) expect(STATUS_UZ[s]).toBeTruthy();`
   (manba/jest1v2-ai/ai1/texts.spec.ts 45). Shu ekranda 4-variant izohi boshqa variantniki edi («Fayl joyi va nomi o'zgarmadi») — tuzatildi.
Ishlatish (repo ildizidan): python3 feedback/F-1125-01-nest1-kuchaytirish/taklif/patch-ai3-savol.py
Har almashtirish aynan 1 marta topilishi shart — aks holda hech narsa yozilmaydi. RU: qism JSON va txt kalit bo'yicha (ru-txt.py yurgizilmaydi)."""
import json, re
from pathlib import Path
R = Path(__file__).resolve().parents[3]
F = 'feedback/F-1029-02-mentor-kurs/'
P = []  # (fayl, eski, yangi) — matn almashtirish
RU = []  # (dars-qism, kalit, yangi qiymat)

# ---------------- CI/CD-1 · 20-ekran ----------------
MD = F + '14-CICD1-mentor-v2.md'
P += [(MD, "- Sarlavha: **AI yozgan workflow: `checkout@v4` · `setup-node@v4` (`node-version: 22`) · `npm install` · `npm test`. Mashinangizda Node 24. Lentaga qo'yishdan oldin nimani o'zgartirasiz?**",
           "- Sarlavha: **1-AI yozgan workflow: `checkout@v4` · `setup-node@v4` (`node-version: 22`) · `npm ci` · `npm test`. Mashinangizda Node 24. Lentaga qo'yishdan oldin nimani o'zgartirasiz?**"),
      (MD, "- Material (`above`): yml 10 satr (AI varianti: `node-version: 22`, `- run: npm install`, `- run: npm test`); ostida `node --version` → `v24.18.0`.",
           "- Material (`above`): 1-AI fayli aynan — `ai1/.github/workflows/test.yml` qadam satrlari 12, 15–17, 21, 24 (`uses: actions/checkout@v4` … `node-version: 22`, `run: npm ci`, `run: npm test`; nom va bo'sh satrlarsiz — panel eski 6 satr balandligida); ostida `node --version` → `v24.18.0`."),
      (MD, "To'rtinchi tekshiruv. AI yozgan faylda checkout bor, setup node yigirma ikki, npm install va npm test. Mashinangizda Node yigirma to'rt.",
           "To'rtinchi tekshiruv. Bu birinchi AI yozgan fayl: checkout bor, setup node yigirma ikki, npm si ay va npm test. Mashinangizda Node yigirma to'rt."),
      (MD, "- Variantlar (to'g'risi — 3): 1 Hech narsa — checkout bor, qolgani ishlaydi · 2 Faqat `npm install` → `npm ci` — versiya muhim emas · 3 `node-version` 24, `npm ci`, `tsc` va `build` qadamlari · 4 `checkout`ni olib tashlash — `setup-node` o'zi olib keladi",
           "- Variantlar (to'g'risi — 3): 1 Hech narsa — checkout va `npm ci` bor, qolgani ishlaydi · 2 Faqat `node-version` 24 — testlar o'tsa, yetarli · 3 `node-version` 24 va `tsc`, `build` qadamlarini qo'shish · 4 `checkout`ni olib tashlash — `setup-node` o'zi olib keladi"),
      (MD, "- To'g'ri (ovoz): «To'g'ri. Uch narsa. Node version mashinangizdagi yigirma to'rt, aks holda o'n yettinchi ekrandagi qizil. Npm install o'rniga npm si ay: lentada lock'ga ishonamiz. Va tsc bilan build qadamlari: aks holda tur xatosi va yig'ilmaydigan kod yashil o'tadi. Demak, AI fayli boshlanish nuqtasi, to'rt savol esa sizniki.» · qisqa: «`node-version` = `node --version` · `npm ci` · `tsc` + `build` qadamlari. Checkout qoladi.»",
           "- To'g'ri (ovoz): «To'g'ri. Ikki narsa. Node version mashinangizdagi yigirma to'rt, aks holda o'n yettinchi ekrandagi qizil. Va tsc bilan build qadamlari: aks holda tur xatosi va yig'ilmaydigan kod yashil o'tadi. Checkout va npm si ay to'g'ri, ular qoladi. Demak, AI fayli boshlanish nuqtasi, to'rt savol esa sizniki.» · qisqa: «`node-version` = `node --version` · `tsc` + `build` qadamlari. `checkout` va `npm ci` qoladi.»"),
      (MD, "- Demak: «AI workflow'i — boshlanish nuqtasi: `node-version` meniki · `npm ci` · `tsc` va `build` · `checkout` qoladi.»",
           "- Demak: «AI workflow'i — boshlanish nuqtasi: `node-version` meniki · `tsc` va `build` qo'shiladi · `checkout` va `npm ci` qoladi.»"),
      (MD, "- Xato izohlari: 1 — «`node-version: 22` bilan `npm ci` qizil (17-ekran); `npm install` lentada lock'ni o'zgartiradi.» · 2 — «Versiya muhim: runner'dagi npm lock'ni boshqacha o'qiydi — 17-ekran.»",
           "- Xato izohlari: 1 — «`node-version: 22` bilan `npm ci` qizil (17-ekran); `tsc` qadamisiz tur xatosi yashil o'tadi (15-ekran).» · 2 — «Run yashil bo'ladi, lekin `tsc` va `build` yo'q: tur xatosi va yig'ilmaydigan kod ham yashil o'tadi (15-ekran).»"),
      (MD, "- Manba: `cicd1v2-ai/ai1/.github/workflows/test.yml`, `cicd1v2-out/21`, `14`, `10a`.",
           "- Manba: `cicd1v2-ai/ai1/.github/workflows/test.yml` (aynan; 2-AI ham `npm ci`), `cicd1v2-out/21`, `14`, `10a`."),
      ('src/mentor-kurs/cicd1/parts/07-s17-s25.jsx', "//  20 · Tekshiruv 4 — AI workflow'ni qabul qilish (5-npm-install.yml · run 21, 14, 10a)",
           "//  20 · Tekshiruv 4 — AI workflow'ni qabul qilish (1-AI test.yml aynan · run 21, 14, 10a)"),
      ('src/mentor-kurs/cicd1/parts/07-s17-s25.jsx', '''<Yml k="YML_5_NPM_INSTALL" title={t("ci.yml · AI yozgan (namuna)", "ci.yml · написал AI (образец)")} from={7} ids={{ [NV('YML_5_NPM_INSTALL')]: 'n', 10: 'i' }} focus={['n', 'i']} />''',
           '''<Yml k="YML_AI1" title={t("test.yml · 1-AI yozgan", "test.yml · написал 1-й AI")} from={10} ids={{ [NV('YML_AI1')]: 'n' }} focus={['n']} />''')]
RU += [('cicd1-2', '20.title', "Workflow от 1-го AI: checkout@v4 · setup-node@v4 (node-version: 22) · npm ci · npm test. На вашей машине Node 24. Что измените перед тем, как ставить в конвейер?"),
       ('cicd1-2', '20.q', "Вы видели workflow от AI, теперь проверим. Четвёртая проверка. Это файл первого AI: есть checkout, setup node двадцать два, npm ci и npm test. На вашей машине Node двадцать четыре. Что измените перед тем, как ставить в конвейер? Выберите вариант."),
       ('cicd1-2', '20.ok', "Верно. Две вещи. Node version — двадцать четыре, как на вашей машине, иначе красный с семнадцатого экрана. И шаги tsc и build: иначе ошибка типа и несобираемый код пройдут зелёными. Checkout и npm ci верные, они остаются. Значит, файл от AI — точка старта, а четыре вопроса — ваши."),
       ('cicd1-2', '20.okShort', "<code>node-version</code> = <code>node --version</code> · шаги <code>tsc</code> + <code>build</code>. <code>checkout</code> и <code>npm ci</code> остаются."),
       ('cicd1-2', '20.demak', "workflow от AI — точка старта: <code>node-version</code> мой · <code>tsc</code> и <code>build</code> добавляются · <code>checkout</code> и <code>npm ci</code> остаются."),
       ('cicd1-2', '20.opts.0', "Ничего — есть checkout и npm ci, остальное работает"),
       ('cicd1-2', '20.opts.1', "Только node-version 24 — раз тесты проходят, хватит"),
       ('cicd1-2', '20.opts.2', "node-version 24 и добавить шаги tsc и build"),
       ('cicd1-2', '20.wrong.0', "С node-version: 22 npm ci красный (экран 17); без tsc ошибка типа проходит зелёной (экран 15)."),
       ('cicd1-2', '20.wrong.1', "Run будет зелёным, но нет tsc и build: ошибка типа и несобираемый код тоже пройдут зелёными (экран 15).")]

# ---------------- WebSocket-2 · 19-ekran ----------------
MD = F + '21-WS2-mentor-v2.md'
P += [(MD, "## 19 · Tekshiruv 4 — «sinadim, o'tdi»  ← `MCRetry`", "## 19 · Tekshiruv 4 — hodisa kelgan sinov  ← `MCRetry`"),
      (MD, "- Sarlavha: **AI: «Sinadim — server qayta yondi, panel #2 ni ko'rsatdi». Panel logida",
           "- Sarlavha: **Birinchi sinovimizda AI tuzatgan panel #2 ni ko'rsatdi. Panel logida"),
      (MD, "To'rtinchi tekshiruv. AI aytdi: sinadim, server qayta yondi, panel ikkinchi buyurtmani ko'rsatdi. Panel logida esa",
           "To'rtinchi tekshiruv. Birinchi sinovimizda AI tuzatgan panel ikkinchi buyurtmani ko'rsatdi. Panel logida esa"),
      (MD, "Demak, avval eski kodda buzildi'ni ko'ring, keyin tuzatilganda takrorlanmadi'ni.» · qisqa:",
           "Demak, avval eski kodda buzildi'ni ko'ring, keyin tuzatilganda takrorlanmadi'ni. Birinchi AI o'zi aynan shunday sinagan: eski sahifada xato takrorlandi, yangisida yo'q.» · qisqa:"),
      ('src/mentor-kurs/ws2/parts/07-s17-s25.jsx', "//  19 · Tekshiruv 4 — «sinadim, o'tdi» (ai1/01a)", "//  19 · Tekshiruv 4 — hodisa kelgan sinov (ai1/01a — bizning birinchi sinovimiz)")]
RU += [('ws2-2', '19.title', "В нашей первой проверке панель, исправленная AI, показала #2. В логе панели после переподключения — кадр … \"orderId\":2. Что это доказывает?"),
       ('ws2-2', '19.q', "Вы видели исправления от AI, теперь проверим. Четвёртая проверка. В нашей первой проверке панель, исправленная AI, показала второй заказ. А в логе панели после переподключения пришло событие второго заказа. Что доказывает эта проверка? Выберите вариант."),
       ('ws2-2', '19.ok', "Верно. Если событие пришло, панель успела переподключиться, и обычный слушатель обновил список. Старый, неисправленный код тоже прошёл бы эту проверку. Чтобы проверка проверяла ошибку, старый код должен на ней падать. Значит, сначала увидьте «сломалось» на старом коде, потом «не повторилось» на исправленном. Первый AI сам проверял именно так: на старой странице ошибка повторилась, на новой — нет.")]

# ---------------- Jest-1 · 20-ekran ----------------
MD = F + '10-Jest1-mentor-v2.md'
P += [(MD, "- Sarlavha: **AI testi: `expect(STATUS_UZ.CANCELLED).toBeTruthy()`. Kimdir matnni «Bekor qilingan» dan «Yangi» ga o'zgartirdi. Test nima deydi?**",
           "- Sarlavha: **AI testi: `for (const s of all) expect(STATUS_UZ[s]).toBeTruthy()`. Kimdir `CANCELLED` matnini «Bekor qilingan» dan «Yangi» ga o'zgartirdi. Test nima deydi?**"),
      (MD, "To'rtinchi tekshiruv. AI testi bekor qilingan status matnini to be truthy bilan tekshiradi.",
           "To'rtinchi tekshiruv. AI testi har bir status matnini, bekor qilinganini ham, to be truthy bilan tekshiradi."),
      (MD, "· 4 — «Fayl joyi va nomi o'zgarmadi.»", "· 4 — «Test matnlarni bir-biri bilan solishtirmaydi — faqat har biri bo'sh emasmi.»")]
RU += [('jest1-2', '20.title', "Тест от AI: for (const s of all) expect(STATUS_UZ[s]).toBeTruthy(). Кто-то поменял текст CANCELLED с «Bekor qilingan» на «Yangi». Что скажет тест?"),
       ('jest1-2', '20.q', "Вы видели проверку поломкой, теперь проверим. Четвёртая проверка. Тест от AI проверяет текст каждого статуса, и «отменён» тоже, через to be truthy. Кто-то по ошибке поменял текст на «новый»: клиент видит свой отменённый заказ как новый. Что скажет тест? Выберите вариант."),
       ('jest1-2', '20.wrong.3', "Тест не сравнивает тексты между собой — только не пуст ли каждый.")]

buf = {}
for f, old, new in P:
  s = buf.setdefault(f, (R / f).read_text())
  if s.count(old) != 1: raise SystemExit(f'{f}: «{old[:70]}…» {s.count(old)} marta (1 kutilgan)')
  buf[f] = s.replace(old, new)
for q, k, v in RU:
  for ext in ('json', 'txt'):
    f = F + f'ru/qism/{q}.{ext}'
    s = buf.setdefault(f, (R / f).read_text())
    if ext == 'json':
      pat = re.compile(r'^( "' + re.escape(k) + r'": )"(?:\\.|[^"\\])*"(,?)$', re.M)
      rep = lambda m: m.group(1) + json.dumps(v, ensure_ascii=False) + m.group(2)
    else:
      pat = re.compile(r'^' + re.escape(k) + r' = .*$', re.M)
      rep = lambda m: f'{k} = {v}'
    if len(pat.findall(s)) != 1: raise SystemExit(f'{f}: kalit {k} {len(pat.findall(s))} marta (1 kutilgan)')
    buf[f] = pat.sub(rep, s)
for f, s in buf.items():
  if f.endswith('.json'): json.loads(s)  # buzilmaganmi
  (R / f).write_text(s)
print(f'{len(P)} matn almashtirish + {len(RU)} RU kalit (json+txt), {len(buf)} fayl')
