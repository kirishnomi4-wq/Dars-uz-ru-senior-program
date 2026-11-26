
// ============================================================
//  25 (saytda) · Tekshiruv 5 — 2-AI (oddiy topshiriq) migratsiyasi: qaysi satr savatni mijozga bog'lamaydi (F-1125-01, M56; MD «## AI-T5»)
//  Matn shu yerda (generator o'qimaydi), RU — t(). Haqiqiy kod: feedback/F-1029-02-mentor-kurs/manba/orderbot-ai2/p1/diff.patch
//  (src/db/migrations/1762000000000-Init.ts 25–32, aynan). Yurgizilgan: orderbot-ai2/p1/07-fk-sinov.txt (AI sxemasi) va 07-fk-tuzatilgan.txt
//  (28-satrga REFERENCES users … ON DELETE CASCADE) — PostgreSQL 18.4, vaqtinchalik klaster, 26.11. Explorer daraxti yo'q — 1280 da satrlar to'liq (M61).
// ============================================================
const LC5_LINES = [
  { n: 25, h: tsLine("    await q.query(`") },
  { n: 26, h: sqlLine("      CREATE TABLE cart_items (") },
  { n: 27, h: sqlLine("        id serial PRIMARY KEY,") },
  { n: 28, h: sqlLine("        telegram_id bigint NOT NULL,") },
  { n: 29, h: sqlLine("        product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,") },
  { n: 30, h: sqlLine("        qty integer NOT NULL CHECK (qty > 0),") },
  { n: 31, h: sqlLine("        CONSTRAINT uq_cart_item UNIQUE (telegram_id, product_id)") },
  { n: 32, h: tsLine("      )`);") },
];
const LC5_FIXED = [
  ...LC5_LINES.slice(0, 3),
  { gone: true, n: '', h: LC5_LINES[3].h },
  { neu: true, n: 28, h: sqlLine("        telegram_id bigint NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,") },
  ...LC5_LINES.slice(4),
];
// 07-fk-sinov.txt (oldin) va 07-fk-tuzatilgan.txt (keyin) — bir xil senariy, qisqartirilgan; t() chizish paytida — funksiya
const LC5_RUN = () => [
  { n: '', h: '<span class="p">INSERT INTO cart_items … VALUES (999, 1, 1);</span>  <span class="cm">' + t("-- 999 — users da yo'q", '-- 999 — нет в users') + '</span>' },
  { n: '', h: t('  oldin → INSERT 0 1', '  до → INSERT 0 1') },
  { n: '', h: t('  keyin → <span class="er">ERROR: … violates foreign key constraint "cart_items_telegram_id_fkey"</span>', '  после → <span class="er">ERROR: … violates foreign key constraint "cart_items_telegram_id_fkey"</span>') },
  { n: '', h: '<span class="p">DELETE FROM users WHERE telegram_id = 5123456789;</span>  <span class="cm">' + t('-- Aziza, savatida 1 qator', '-- Азиза, в корзине 1 строка') + '</span>' },
  { n: '', h: t('  savatda qoldi: oldin → (2 rows) · keyin → <span class="ok">(0 rows)</span>', '  осталось в корзине: до → (2 rows) · после → <span class="ok">(0 rows)</span>') },
];
function ScreenAI5(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t("Tekshiruv · 5 / 5 — qaysi satr bog'lanmagan?", 'Проверка · 5 / 5 — какая строка не связана?')}
    title={t("2-AI migratsiyasi: qaysi satr savatni mijozga bog'lamaydi?", 'Миграция 2-го AI: какая строка не связывает корзину с клиентом?')}
    task={t("Qoida (<code>tgpg-done</code>): savat qatori mijozga bog'langan — mijoz yo'q bo'lsa qator yozilmaydi, mijoz o'chsa savati ham o'chadi. Bu 2-AI ning oddiy topshiriqda yozgan migratsiyasi; build va bot sinovlari (restart, ko'p mijoz) o'tgan. <b>Qaysi satr bu bog'lanishni bermaydi? Bosing.</b>", 'Правило (<code>tgpg-done</code>): строка корзины связана с клиентом — если клиента нет, строка не записывается, если клиента удалили, его корзина тоже удаляется. Это миграция, которую 2-й AI написал по простому заданию; build и проверки бота (рестарт, много клиентов) прошли. <b>Какая строка не даёт этой связи? Нажмите.</b>')}
    q={t("Beshinchi, oxirgi tekshiruv. Bu ikkinchi AI oddiy topshiriqda yozgan migratsiya: src, db, migrations papkasidagi init faylining savat jadvali. Build va bot sinovlari o'tgan. Darsdagi qoida: savat qatori mijozga bog'langan, mijoz o'chsa savati ham o'chadi. Qaysi satr bu bog'lanishni bermaydi? O'sha satrni bosing.", 'Пятая, последняя проверка. Это миграция, которую второй AI написал по простому заданию: таблица корзины в файле init в папке src, db, migrations. Build и проверки бота прошли. Правило урока: строка корзины связана с клиентом, если клиента удалили, его корзина тоже удаляется. Какая строка не даёт этой связи? Нажмите на неё.')}
    file={t('src/db/migrations/1762000000000-Init.ts · 2-AI, oddiy topshiriq', 'src/db/migrations/1762000000000-Init.ts · 2-й AI, простое задание')} lines={LC5_LINES} target={3}
    fixed={LC5_FIXED} fixedExtra={[{ file: t('psql — haqiqiy, bir xil senariy: oldin / keyin', 'psql — настоящий, один сценарий: до / после'), lines: LC5_RUN() }]}
    ok={t("To'g'ri. Yigirma sakkizinchi satrda telegram id bor, lekin users jadvaliga bog'lanish yo'q. Biz sinadik: yo'q mijozga savat qatori yozildi, mijoz o'chirilganda savati qoldi. Satrga references users va on delete cascade qo'shdik: yo'q mijozga xato chiqdi, o'chirilganda savat ham o'chdi. Demak, AI migratsiyasida har id ustuni qaysi jadvalga bog'langanini backslash d bilan tekshiring.", 'Верно. В двадцать восьмой строке есть telegram id, но нет ссылки на таблицу users. Мы проверили: для несуществующего клиента строка корзины записалась, после удаления клиента его корзина осталась. Добавили в строку references users и on delete cascade: для несуществующего клиента — ошибка, при удалении корзина тоже удалилась. Значит, в миграции от AI проверяйте через backslash d, с какой таблицей связан каждый столбец id.')}
    okShort={t("28-satr: telegram_id — users ga bog'lanish yo'q (orders da ham, 36-satr). Sinaldi: yo'q mijozga INSERT 0 1, mijoz o'chsa savat qoldi. REFERENCES users(telegram_id) ON DELETE CASCADE → foreign key xatosi, savat ham o'chdi.", 'Строка 28: telegram_id — нет ссылки на users (в orders тоже, строка 36). Проверено: для несуществующего клиента INSERT 0 1, после удаления клиента корзина осталась. REFERENCES users(telegram_id) ON DELETE CASCADE → ошибка foreign key, корзина тоже удалилась.')}
    hint={t("Bu satr id, mahsulot, son yoki takrorlanmaslik haqida. Mijozni bildiradigan ustunni toping va uning oxirida nima yo'qligiga qarang.", 'Эта строка про id, товар, количество или уникальность. Найдите столбец, который обозначает клиента, и посмотрите, чего не хватает в его конце.')} />;
}
