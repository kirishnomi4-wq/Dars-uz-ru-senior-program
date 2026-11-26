
// ============================================================
//  22 (saytda) · Tekshiruv 5 — Jest tilidagi topshiriq: AI testining qaysi satri qoidaga zid (F-1125-01, M56; MD «## AI-T5»)
//  Matn shu yerda (generator o'qimaydi), RU — t(). Haqiqiy kod: feedback/F-1029-02-mentor-kurs/manba/jest2v2-ai/p2/ai1/phone.spec.ts 4–16;
//  tuzatish yurgizilgan: p2/tuzatish-ai1.txt (replace + kutilgan: true → 23 passed); faqat replace — p2/mutatsiya-p2.txt B6 (1 failed).
// ============================================================
const LC5_SRC = [
  [4, "  it.each(["],
  [5, "    { nomi: \"to'g'ri raqam\", text: '+998901234567', kutilgan: true },"],
  [6, "    { nomi: \"to'g'ri raqam, «+» siz\", text: '998901234567', kutilgan: true },"],
  [7, "    { nomi: 'eng qisqa — 9 raqam', text: '901234567', kutilgan: true },"],
  [8, "    { nomi: 'eng uzun — 13 raqam', text: '+9989012345678', kutilgan: true },"],
  [9, "    { nomi: 'bittaga qisqa — 8 raqam', text: '90123456', kutilgan: false },"],
  [10, "    { nomi: 'bittaga uzun — 14 raqam', text: '+99890123456789', kutilgan: false },"],
  [11, "    { nomi: 'harf aralashgan', text: '+99890abc4567', kutilgan: false },"],
  [12, "    { nomi: \"bo'sh satr\", text: '', kutilgan: false },"],
  [13, "    { nomi: 'probel bilan', text: '+998 90 123 45 67', kutilgan: false },"],
  [14, "  ])('$nomi: «$text» → $kutilgan', ({ text, kutilgan }) => {"],
  [15, "    expect(isPhone(text)).toBe(kutilgan);"],
  [16, "  });"],
];
const LC5_LINES = LC5_SRC.map(([n, s]) => ({ n, h: tsLine(s) }));
const LC5_FIXED = [
  ...LC5_LINES.slice(0, 9),
  { gone: true, n: '', h: LC5_LINES[9].h },
  { neu: true, n: 13, h: tsLine("    { nomi: 'probel bilan', text: '+998 90 123 45 67', kutilgan: true },") },
  ...LC5_LINES.slice(10),
];
// Explorer daraxti yo'q: 1280 da AI satrlari (aynan, M59) to'liq ko'rinsin — fayl yo'li sarlavhada. 1280×720 ga sig'ishi uchun: phone.ts dan faqat o'zgargan 5-satr, terminaldan faqat natija satri (to'liq chiqish — p2/tuzatish-ai1.txt)
const LC5_PHONE = [
  { gone: true, n: '', h: tsLine("  return PHONE.test(text);") },
  { neu: true, n: 5, h: tsLine("  return PHONE.test(text.replace(/[\\s-]/g, ''));") },
];
const LC5_RUN = [
  { n: '', h: '$ npx jest  →  Tests:       <span class="ok">23 passed</span>, 23 total' },
];
function ScreenAI5(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t('Tekshiruv · 5 / 5 — qaysi satr qoidaga zid?', 'Проверка · 5 / 5 — какая строка против правила?')}
    title={t('Jest tilidagi topshiriq: AI testining qaysi satri 6-ekrandagi qoidaga zid?', 'Задание на языке Jest: какая строка теста от AI против правила с экрана 6?')}
    task={t("Qoida (6-ekran): mijoz raqamni <b>probel bilan</b> yozsa ham bot qabul qiladi — <code>phone.ts</code> da <code>replace</code>. Bu 1-AI ning Jest tilidagi topshiriqda yozgan testi, hammasi yashil. <b>Qaysi satr qoidani emas, hozirgi xulqni muhrlaydi? Bosing.</b>", "Правило (экран 6): бот принимает номер, даже если клиент написал его <b>с пробелами</b> — в <code>phone.ts</code> есть <code>replace</code>. Это тест, который 1-й AI написал по заданию на языке Jest, всё зелёное. <b>Какая строка запечатывает не правило, а текущее поведение? Нажмите.</b>")}
    q={t("Beshinchi, oxirgi tekshiruv. Bu Jest tilidagi topshiriqda birinchi AI yozgan test: telegram papkasidagi phone spec ts fayli. Oltinchi ekranda qoida qildik: mijoz raqamni probel bilan yozsa ham bot qabul qiladi. Qaysi satr bu qoidaga zid, hozirgi xulqni muhrlaydi? O'sha satrni bosing.", 'Пятая, последняя проверка. Это тест, который первый AI написал по заданию на языке Jest: файл phone spec ts в папке telegram. На шестом экране мы сделали правило: бот принимает номер, даже если клиент написал его с пробелами. Какая строка противоречит этому правилу и запечатывает текущее поведение? Нажмите на неё.')}
    file={t('src/api/telegram/phone.spec.ts · 1-AI, Jest tilida', 'src/api/telegram/phone.spec.ts · 1-й AI, на языке Jest')} lines={LC5_LINES} target={9}
    fixed={LC5_FIXED} fixedExtra={[{ file: t("phone.ts · 6-ekrandagi tuzatish", 'phone.ts · исправление с экрана 6'), lines: LC5_PHONE }, { file: t('terminal — tuzatilgandan keyin (haqiqiy)', 'терминал — после исправления (настоящий)'), lines: LC5_RUN }]}
    ok={t("To'g'ri. O'n uchinchi satr probel bilan yozilgan raqamdan false kutadi. Bu qoida emas, kod hozir shunday ishlaydi. Oltinchi ekrandagi replace bilan tuzatsak, shu test qizaradi: yigirma uchtadan bittasi. Satrda kutilganni true qildik, hammasi yashil, sinab ko'rdik. Demak, AI testidagi har kutilgan qiymatni qoidaga solishtiring.", 'Верно. Тринадцатая строка ждёт false для номера с пробелами. Это не правило, просто код сейчас так работает. Если исправить через replace с шестого экрана, этот тест покраснеет: один из двадцати трёх. Мы поменяли ожидание на true, всё зелёное, проверили. Значит, каждое ожидаемое значение в тесте от AI сверяйте с правилом.')}
    okShort={t("13-satr: probelli raqam → false — bu hozirgi xulq, qoida emas. replace tuzatishidan keyin shu test qizaradi (1 failed); kutilgan true → 23 passed (sinab ko'rilgan).", 'Строка 13: номер с пробелами → false — это текущее поведение, а не правило. После исправления через replace этот тест краснеет (1 failed); ожидание true → 23 passed (проверено).')}
    hint={t("Bu satr qoidaga mos: raqam soni, harf yoki bo'sh satr haqida. Mijozning yozish odati bilan bog'liq satrni qidiring.", 'Эта строка соответствует правилу: она про количество цифр, буквы или пустую строку. Ищите строку, связанную с привычкой клиента писать номер.')} />;
}
