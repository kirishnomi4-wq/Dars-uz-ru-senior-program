
// ============================================================
//  20 (saytda) · Tekshiruv 5 — 2-AI (CI tilida): qaysi satr lentani loyihadagidan boshqa bazada sinaydi (F-1125-01, M56; MD «## AI-T5»)
//  Matn shu yerda (generator o'qimaydi), RU — t(). Haqiqiy kod: feedback/F-1029-02-mentor-kurs/manba/cicd2v2-ai/p2/ai2/.github/workflows/ci.yml
//  17–29 va 42–45 (aynan, dasturda ko'chirilgan; 30–41 kutish sikli «…»). Run 43 (GitHub) yashil — PostgreSQL 16 da; README: PostgreSQL 18.
//  Tuzatish yurgizilgan: smoke PostgreSQL 18.4 da 5/5 (p2/ai2/smoke-pg18-lokal.txt); GitHub'da postgres:18 — run 42 (1-AI fayli). Explorer yo'q (M61-3).
// ============================================================
const LC5_SRC = [
  [17, "  smoke:"],
  [18, "    needs: test"],
  [19, "    runs-on: ubuntu-latest"],
  [20, "    steps:"],
  [21, "      - uses: actions/checkout@v4"],
  [22, "      - uses: actions/setup-node@v4"],
  [23, "        with:"],
  [24, "          node-version: 24"],
  [25, "          cache: npm"],
  [26, "      - run: npm ci"],
  [27, "      - name: PostgreSQL vaqtincha ko'tarish"],
  [28, "        run: |"],
  [29, "          docker run -d --name pg-smoke -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=shop -p 5432:5432 postgres:16"],
  [42, "      - name: Smoke (Telegram'siz)"],
  [43, "        run: npm run smoke"],
  [44, "        env:"],
  [45, "          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop"],
];
// 29-satr 1280 da uzun (113 belgi) — o'zgarmaydi, faqat ekran tor bo'lsa keyingi qatorga o'tadi (M61-3: postgres:16 ko'rinsin)
const WRAP = (h) => '<span style="white-space:pre-wrap;overflow-wrap:anywhere">' + h + '</span>';
const LC5_LINES = (() => { const a = LC5_SRC.map(([n, s]) => ({ n, h: !s ? '' : n === 29 ? WRAP(yamlLine(s)) : yamlLine(s) })); a.splice(13, 0, { n: '', h: '<span class="cm">…</span>' }); return a; })();
const LC5_TARGET = LC5_LINES.findIndex((l) => l.n === 29);
const LC5_FIXED = LC5_LINES.flatMap((l) => (l.n === 29 ? [{ ...l, n: '', gone: true }, { n: 29, neu: true, h: WRAP(yamlLine(LC5_SRC.find(([n]) => n === 29)[1].replace('postgres:16', 'postgres:18'))) }] : [l]));
const LC5_RUN = () => [
  { n: '', h: t('<span class="p">lokal · PostgreSQL 18.4</span> · npm run smoke → <span class="ok">NATIJA: 5/5 ✓</span>', '<span class="p">локально · PostgreSQL 18.4</span> · npm run smoke → <span class="ok">NATIJA: 5/5 ✓</span>') },
  { n: '', h: t('<span class="p">GitHub · run 42</span> (1-AI, services: postgres:18) · <span class="ok">success</span>, smoke 5/5', '<span class="p">GitHub · run 42</span> (1-й AI, services: postgres:18) · <span class="ok">success</span>, smoke 5/5') },
];
function ScreenAI5(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t('Tekshiruv · 5 / 5 — qaysi satr?', 'Проверка · 5 / 5 — какая строка?')}
    title={t("Run 43 yashil, lekin loyiha PostgreSQL 18 da. 2-AI faylining qaysi satri lentani boshqa versiyada sinaydi?", 'Run 43 зелёный, но проект на PostgreSQL 18. Какая строка файла 2-го AI проверяет на конвейере другую версию?')}
    task={t("Qoida: lenta loyihadagi bilan bir xil muhitni sinaydi (CI/CD-1 dagi <code>node-version</code> kabi). README: «NestJS + Telegraf + TypeORM + <b>PostgreSQL 18</b>». Bu 2-AI ning CI tilidagi topshiriqdagi smoke job'i; run 43 yashil, smoke 5/5. <b>Qaysi satr bazani boshqa versiyada ko'taradi? Bosing.</b>", 'Правило: конвейер проверяет ту же среду, что и проект (как <code>node-version</code> в CI/CD-1). README: «NestJS + Telegraf + TypeORM + <b>PostgreSQL 18</b>». Это smoke job 2-го AI по заданию на языке CI; run 43 зелёный, smoke 5/5. <b>Какая строка поднимает базу другой версии? Нажмите.</b>')}
    q={t("Beshinchi, oxirgi tekshiruv. Bu ikkinchi AI CI tilidagi topshiriqda yozgan smoke job'i, github papkasidagi workflows ichidagi ci yml. Run qirq uch yashil, smoke besh besh. Lekin loyiha README'sida PostgreSQL o'n sakkiz. Qaysi satr lentadagi bazani boshqa versiyada ko'taradi? O'sha satrni bosing.", 'Пятая, последняя проверка. Это smoke job, который второй AI написал по заданию на языке CI, файл ci yml в папке workflows внутри github. Run сорок три зелёный, smoke пять из пяти. Но в README проекта PostgreSQL восемнадцать. Какая строка поднимает базу на конвейере в другой версии? Нажмите на неё.')}
    file={t('.github/workflows/ci.yml · 2-AI, CI tilida (smoke job)', '.github/workflows/ci.yml · 2-й AI, на языке CI (smoke job)')} lines={LC5_LINES} target={LC5_TARGET}
    fixed={LC5_FIXED} fixedExtra={[{ file: t('tuzatilgandan keyin — haqiqiy', 'после исправления — настоящий'), lines: LC5_RUN() }]}
    ok={t("To'g'ri. Yigirma to'qqizinchi satr bazani postgres o'n olti bilan ko'taradi. Run yashil, lekin lenta loyihadagi o'n sakkiz emas, boshqa versiyani sinadi. CI/CD-1 dagi node version kabi: yashil, lekin boshqa muhitda. O'n sakkizga o'zgartirdik: smoke o'n sakkizda ham besh besh. Demak, AI yozgan versiya raqamini README yoki loyiha bilan solishtiring.", 'Верно. Двадцать девятая строка поднимает базу на postgres шестнадцать. Run зелёный, но конвейер проверил не восемнадцатую версию проекта, а другую. Как node version в CI/CD-1: зелёный, но в другой среде. Мы поменяли на восемнадцать: smoke и на восемнадцатой пять из пяти. Значит, номер версии, который написал AI, сверяйте с README или проектом.')}
    okShort={<span dangerouslySetInnerHTML={html(t("29-satr: <code>postgres:16</code> — README'da PostgreSQL 18. Run 43 yashil, lekin boshqa versiyada. <code>postgres:18</code> bilan smoke 5/5 (lokal, PostgreSQL 18.4) va run 42 ham yashil.", 'Строка 29: <code>postgres:16</code> — в README PostgreSQL 18. Run 43 зелёный, но на другой версии. С <code>postgres:18</code> smoke 5/5 (локально, PostgreSQL 18.4), run 42 тоже зелёный.'))} />}
    hint={t("Bu satr job nomi, qadam nomi, buyruq yoki muhit o'zgaruvchisi haqida. Bazani ko'taradigan satrni toping va oxiridagi raqamga qarang.", 'Эта строка про имя job, имя шага, команду или переменную окружения. Найдите строку, которая поднимает базу, и посмотрите на число в конце.')} />;
}
