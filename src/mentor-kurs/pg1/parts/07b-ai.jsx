// ============================================================
//  6-bosqich · AI tavsiyasi (F-1125-01, M56). HAQIQIY AI — Claude Haiku ×2, vositasiz (oddiy chatdagi javob).
//  Savol — o'quvchi darsi m4-03 (src/4-Modull/DbSqlNosqlLesson.jsx Screen11) dagi aynan tugma: «Oddiy chat ilovasi».
//  Sxema — javobdagi SQL aynan; vaqtinchalik PostgreSQL 18 da yurgizilgan (M10).
//  Manba: feedback/F-1125-01-nest1-kuchaytirish/ai-pg1/ — 00-promptlar.md · A-oddiy/ · B-mezon/ · B-mezon-tuzatilgan/ · XULOSA.md
//  Matn MD generatoridan tashqarida (MD'da «## AI-1», «## AI-2» — hujjat), RU shu faylning oxirida ru() bilan.
// ============================================================
SPOKEN.push(['on delete cascade', 'ON DELETE CASCADE'], ['receiver id', 'receiver_id'], ['sender id', 'sender_id'], ['schema sql', 'schema.sql']);
// Topshiriqlar AI'ga o'zbekcha berilgan — ruscha darsda ham aynan shu matn (tarjima qilinmaydi)
const AIP_A = "Oddiy chat ilovasi yasamoqchiman. Qaysi baza yaxshi: PostgreSQL yoki MongoDB? Jadvallarini ham yozib ber.";
const AIP_B = ["Chat ilovasi uchun baza tanla. Avval to'rt savolga bittadan jumla bilan javob ber:", "1) ma'lumotlar bir-biriga bog'langanmi? 2) shakli qat'iymi? 3) xato pul yoki buyurtmaga zarar qiladimi? 4) ma'lumot juda katta hajmdami va tezlik muhimmi?", "Keyin tanlov va bir jumla sabab. PostgreSQL bo'lsa — users va messages uchun CREATE TABLE, MongoDB bo'lsa — Mongoose sxemasi."];
// B ning 4 javobi — aynan (ai-pg1/B-mezon/javob.md); side — o'quvchi darsidagi qaror ko'rsatkichi bo'yicha
const AIP_B4 = [
  { a: "Ha, bog'langan: har bir xabar yuboruvchi va qabul qiluvchi foydalanuvchiga tegishli.", side: 'sql' },
  { a: "Ha, shakl qat'iy: barcha foydalanuvchilar va barcha xabarlar bir xil maydonlarga ega.", side: 'sql' },
  { a: "Yo'q, to'g'ridan-to'g'ri pul yoki buyurtmaga zarar yetmaydi…", side: 'neu' },
  { a: "Hajm oshishi mumkin, ammo indekslar bilan PostgreSQL bunday yuklamani yaxshi ko'taradi.", side: 'arg' },
];
// [yozuv, A, B] — ai-pg1/A-oddiy/natija.txt va B-mezon/natija.txt; ok — baza to'xtatdi, bad — o'tib ketdi
const AIP_ROWS = [
  [{ uz: "yo'q foydalanuvchi (id 99)", ru: 'несуществующий пользователь (id 99)' }, { r: 'ERROR', n: 'messages_sender_id_fkey', ok: true }, { r: 'ERROR', n: 'messages_receiver_id_fkey', ok: true }],
  [{ uz: 'matn NULL', ru: 'текст NULL' }, { r: 'ERROR', n: 'not-null', ok: true }, { r: 'ERROR', n: 'not-null', ok: true }],
  [{ uz: 'takror username', ru: 'повторный username' }, { r: 'ERROR', n: 'users_username_key', ok: true }, { r: 'ERROR', n: 'users_username_key', ok: true }],
  [{ uz: "bo'sh matn ''", ru: "пустой текст ''" }, { r: 'INSERT 0 1', n: { uz: 'saqlandi', ru: 'сохранено' }, bad: true }, { r: 'INSERT 0 1', n: { uz: 'saqlandi', ru: 'сохранено' }, bad: true }],
  [{ uz: "suhbatga a'zo emas — yozdi", ru: 'не участник беседы — написал' }, { r: 'INSERT 0 1', n: { uz: "a'zolik tekshirilmaydi", ru: 'участие не проверяется' }, bad: true }, { r: '—', n: { uz: "suhbat jadvali yo'q", ru: 'нет таблицы бесед' } }],
  [{ uz: "xabari bor ali'ni o'chirish", ru: 'удалить ali, у которого есть сообщения' }, { r: 'ERROR', n: { uz: 'rad etildi (14-ekrandagi kabi)', ru: 'отказано (как на 14-м экране)' }, ok: true }, { r: 'DELETE 1', n: { uz: "vali'ning xabarlari 3 → 0", ru: 'сообщений vali 3 → 0' }, bad: true }],
];
const tl = (x) => (x && typeof x === 'object' ? t(x.uz, x.ru) : x);
function AipCell({ c }) {
  const col = c.bad ? T.accent : c.ok ? T.green : T.ink3;
  return <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', minWidth: 0, padding: '5px 10px', borderRadius: 8, border: `1px solid ${c.bad ? T.accent : T.line}`, background: c.bad ? '#FFF0EB' : T.paper }}>
    <b style={{ font: `700 12.5px/1.35 ${MONO}`, color: col, whiteSpace: 'nowrap' }}>{c.r}</b>
    {c.n && <span style={{ font: `12px/1.35 ${MONO}`, color: c.bad ? T.accent : T.ink2, overflowWrap: 'anywhere' }}>{tl(c.n)}</span>}
  </div>;
}
const S_PG1AI = {
  kicker: '6-bosqich · AI tavsiyasi', title: "AI'dan chat uchun baza so'radik: ikki topshiriq, ikki javob",
  segments: [
    sg('a', "O'quvchi darsidagi savolni haqiqiy AI'ga berdik: <b>chat ilovasi</b>, ikki xil topshiriq", "m4-03 da o'quvchi AI'dan baza tavsiyasini so'raydi. Darsdagi javob tayyor yozilgan: oddiy chat ilovasi uchun MongoDB. Biz xuddi shu savolni haqiqiy AI'ga berdik, Claude Haiku'ga, ikki xil topshiriq bilan: chapdagisi oddiy so'zlar bilan, o'ngdagisi to'rt mezon bilan."),
    sg('b', "Ikkala AI ham — <b>PostgreSQL</b>; bahs to'rtinchi mezonda", "Ikkala AI ham PostgreSQL'ni tanladi. Sababni to'rt mezon bilan solishtiramiz. Ma'lumot bog'langan, shakli qat'iy: bu ikkisi PostgreSQL tomonga. Pulga zarar yo'q. To'rtinchisi bahsli: AI hajm o'ssa ham PostgreSQL ko'taradi deydi, o'quvchi darsi esa aynan shu savolda NoSQL deydi."),
    sg('c', "AI xato emas — <b>javobni sabab hal qiladi</b>", "Bu AI xatosi emas. Oddiy chat uchun PostgreSQL ham to'g'ri tanlov, darsdagi NoSQL javobi millionlab oddiy xabar haqida. O'quvchi uyda AI'dan so'rasa, boshqa javob olishi mumkin. Unda shunday deysiz: javobni AI emas, sabab hal qiladi. Sizning loyihangizda to'rtinchi savolga javob qanday?"),
    sg('d', "Sxema bazada: uchta yozuvni <b>baza o'zi to'xtatdi</b>, uchtasi <b>o'tib ketdi</b>", "AI yozgan jadvallarni haqiqiy PostgreSQL'da yurgizdik. Yo'q foydalanuvchi, null matn va takror nomni ikkalasida ham baza o'zi to'xtatdi. Uchtasi o'tib ketdi: bo'sh matn ikkalasida saqlandi, A da suhbatga a'zo bo'lmagan kishi yozdi, B da esa alini o'chirganimizda valining uchta xabari ham o'chib ketdi."),
    sg('e', "Xulosa: tavsiyani <b>4 mezon bilan</b>, sxemani <b>bazada</b> tekshiring", "Xulosa. AI tavsiyasini sabab bilan qabul qiling va uni to'rt mezon bilan solishtiring. AI yozgan sxemani bazada yurgizing va kutilmagan yozuvlarni sinang: yo'q id, bo'sh matn, takror qiymat va xabari bor foydalanuvchini o'chirish. Baza faqat yozilgan qoidani tekshiradi."),
  ],
};
function ScreenAI(p) {
  return <Lesson p={p} S={S_PG1AI} scene={({ beat }) => (<>
    {beat === 0 && <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('A · oddiy topshiriq', 'A · простое задание (дано на узбекском)')}</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>«{AIP_A}»</div>
        </div>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('B · 4 mezon bilan', 'B · с 4 критериями (дано на узбекском)')}</div>
          <div style={{ display: 'grid', gap: 4, fontSize: 14, lineHeight: 1.45 }}>{AIP_B.map((x, i) => <div key={i}>{x}</div>)}</div>
        </div>
      </div>
      <div className="mk-light" style={{ padding: 14, borderLeft: `4px solid ${T.blue}` }}>
        <div className="mk-tag">{t("O'quvchi darsidagi tayyor javob · m4-03, AI tavsiyasi", 'Готовый ответ в уроке ученика · m4-03, совет ИИ')}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>{t("«Oddiy chat ilovasi yasamoqchiman» → ", '«Хочу сделать простой чат» → ')}<b style={{ color: T.blue }}>NoSQL (MongoDB)</b>{t(": «Millionlab oddiy xabar, tezlik kerak, bog'lanish kam»", ': «Миллионы простых сообщений, нужна скорость, связей мало»')}</div>
      </div>
    </>}
    {(beat === 1 || beat === 2) && <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 12 }}>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('A · javob (aynan)', 'A · ответ (дословно, на узбекском)')}</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}><b style={{ color: T.accent }}>Tavsiya: PostgreSQL.</b> «…Postgres bunday bog'lanishlarni JOIN va tashqi kalitlar bilan aniq saqlaydi… MongoDB ham ishlaydi, lekin u xabarlarning sxemasi tez-tez o'zgaradigan… loyihalarda qulayroq.»</div>
        </div>
        <div className="mk-light" style={{ padding: 14 }}>
          <div className="mk-tag">{t('B · 4 mezon (aynan) → Tanlov: PostgreSQL', 'B · 4 критерия (дословно, на узбекском) → Выбор: PostgreSQL')}</div>
          <div style={{ display: 'grid', gap: 6 }}>{AIP_B4.map((x, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '18px 1fr auto', gap: 8, alignItems: 'baseline', fontSize: 13.5, lineHeight: 1.4 }}>
            <b>{i + 1}</b><span>{x.a}</span>
            <b style={{ font: `700 12px/1.3 ${MONO}`, whiteSpace: 'nowrap', color: x.side === 'sql' ? T.accent : x.side === 'arg' ? T.blue : T.ink3 }}>{x.side === 'sql' ? '→ SQL' : x.side === 'arg' ? t('bahsli', 'спорно') : '—'}</b>
          </div>)}</div>
        </div>
      </div>
      {beat === 2 && <div className="mk-light" style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14, lineHeight: 1.5 }}>
        <div><div className="mk-tag">{t("4-savol · o'quvchi darsida", 'Вопрос 4 · в уроке ученика')}</div>{t("millionlab oddiy xabar, tezlik → ", 'миллионы простых сообщений, скорость → ')}<b style={{ color: T.blue }}>NoSQL</b></div>
        <div><div className="mk-tag">{t('4-savol · AI', 'Вопрос 4 · ИИ')}</div>{t("oddiy chat, indekslar yetadi → ", 'простой чат, индексов хватит → ')}<b style={{ color: T.accent }}>PostgreSQL</b></div>
        <div style={{ gridColumn: '1 / -1', borderTop: `1px solid ${T.line}`, paddingTop: 10 }}><b>{t('Sinfda: ', 'В классе: ')}</b>{t("«Javobni AI emas, sabab hal qiladi. Loyihangizda 4-savolga javob qanday — millionlab oddiy xabarmi yoki sinfdoshlar chatimi?»", '«Ответ решает не ИИ, а причина. Как в вашем проекте отвечаем на 4-й вопрос — миллионы простых сообщений или чат одноклассников?»')}</div>
      </div>}
    </>}
    {beat >= 3 && <div className="mk-light" style={{ padding: 14, display: 'grid', gap: 8 }}>
      <div className="mk-tag">{t("Sxema haqiqiy PostgreSQL 18 da · mentor yozuvlari (aynan javoblar)", 'Схема в настоящем PostgreSQL 18 · записи ментора (дословные ответы)')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr 1fr', gap: 8, fontSize: 13, color: T.ink3, fontWeight: 600 }}><span>{t('Yozuv', 'Запись')}</span><span>{t('A · 4 jadval', 'A · 4 таблицы')}</span><span>{t('B · 2 jadval', 'B · 2 таблицы')}</span></div>
      {AIP_ROWS.map(([q, a, b]) => <div key={q.uz} style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr 1fr', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13.5 }}>{tl(q)}</span><AipCell c={a} /><AipCell c={b} />
      </div>)}
    </div>}
    <Block at={4} beat={beat}><div className="mk-rule">{t(<><b>AI tavsiyasini tekshirish:</b> sabab — 4 mezon bilan · sxema — bazada: yo'q id · bo'sh matn (<code>''</code> ham) · takror qiymat · xabari borni o'chirish. Baza faqat yozilgan qoidani tekshiradi.</>, <><b>Проверка совета ИИ:</b> причина — по 4 критериям · схема — в базе: несуществующий id · пустой текст (и <code>''</code>) · повтор значения · удаление того, у кого есть сообщения. База проверяет только записанное правило.</>)}</div></Block>
  </>)} />;
}

// --- Tekshiruv 5: B sxemasi — ali o'chirildi, vali yozgan xabar ham yo'qoldi. Haqiqiy: ai-pg1/B-mezon/schema.sql 9–15, natija.txt ---
const LCAIP_LINES = sql(String.raw`
CREATE TABLE messages (
    id          BIGSERIAL   PRIMARY KEY,
    sender_id   BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body        TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);`).map((l, i) => ({ ...l, n: 9 + i }));
const LCAIP_FIXED = [
  ...LCAIP_LINES.slice(0, 2),
  { ...LCAIP_LINES[2], gone: true },
  { h: sqlLine('    sender_id   BIGINT      NOT NULL REFERENCES users(id),'), n: 11, neu: true },
  { ...LCAIP_LINES[3], gone: true },
  { h: sqlLine('    receiver_id BIGINT      NOT NULL REFERENCES users(id),'), n: 12, neu: true },
  ...LCAIP_LINES.slice(4),
];
const LCAIP_AFTER = psql(String.raw`
chat=# DELETE FROM users WHERE username = 'ali';
ERROR:  update or delete on table "users" violates foreign key constraint "messages_sender_id_fkey" on table "messages"
DETAIL:  Key (id)=(1) is still referenced from table "messages".
chat=# SELECT count(*) AS vali_xabarlari_keyin FROM messages WHERE sender_id = 2 OR receiver_id = 2;
 vali_xabarlari_keyin
----------------------
                    3`);
const LCAIP_TASK_PRE = '<pre class="pg-doc er" style="margin-top:12px;font-size:12px">' + escH(String.raw`chat=# DELETE FROM users WHERE username = 'ali';
DELETE 1
-- vali'ning xabarlari: 3 → 0`) + '</pre>';
function ScreenLCAI(p) {
  return <LineCheck {...p} kicker={t('Tekshiruv 5', 'Проверка 5')} eyebrow={t('Tekshiruv · 5 / 5 — qaysi satr xato?', 'Проверка · 5 / 5 — какая строка с ошибкой?')}
    title={t("AI yozgan sxema: ali o'chirildi — vali yozgan xabar ham yo'qoldi", 'Схема от ИИ: удалили ali — пропало и сообщение, которое написал vali')}
    task={t("Qoida: foydalanuvchi o'chirilsa, <b>boshqa odam yozgan xabar o'chmasligi</b> kerak. B ning sxemasida ali o'chirildi — xato yo'q, lekin vali o'zi ali'ga yozgan «Va alaykum!» ham yo'qoldi. <b>Shu xabarni o'chirgan satrni bosing.</b>", 'Правило: если пользователь удалён, <b>сообщение, которое написал другой человек, не должно пропасть</b>. В схеме B удалили ali — ошибки нет, но пропало и «Va alaykum!», которое vali сам написал ali. <b>Нажмите на строку, которая удалила это сообщение.</b>')
      + t(LCAIP_TASK_PRE, LCAIP_TASK_PRE.replace("-- vali'ning xabarlari: 3 → 0", '-- сообщений vali: 3 → 0'))}
    q={t("Beshinchi, oxirgi tekshiruv. Bu B yozgan messages jadvali, schema sql faylining to'qqizinchi satridan. Alini o'chirdik, baza xato bermadi, lekin vali o'zi aliga yozgan va alaykum xabari ham yo'qoldi. Qoida: foydalanuvchi o'chirilsa, boshqa odam yozgan xabar o'chmasligi kerak. Qaysi satr shu xabarni o'chirdi? O'sha satrni bosing.", 'Пятая, последняя проверка. Это таблица messages, которую написал B, с девятой строки файла schema sql. Мы удалили ali, база не выдала ошибку, но пропало и сообщение va alaykum, которое vali сам написал ali. Правило: если пользователь удалён, сообщение другого человека не должно пропасть. Какая строка удалила это сообщение? Нажмите на эту строку.')}
    file={t('schema.sql — B (AI javobi, aynan)', 'schema.sql — B (ответ ИИ, дословно)')} lines={LCAIP_LINES} target={3}
    fixed={LCAIP_FIXED} fixedExtra={[{ file: t("psql — chat · tuzatilgandan keyin (haqiqiy)", 'psql — chat · после исправления (настоящий)'), lines: LCAIP_AFTER }]}
    ok={t("To'g'ri. O'n ikkinchi satr: receiver id, on delete cascade. Va alaykum xabarida qabul qiluvchi ali edi. Ali o'chirilganda baza qabul qiluvchisi ali bo'lgan hamma xabarni o'zi o'chirdi va xato bermadi. O'n birinchi satrda ham shu ibora bor, u ali yozgan xabarlarni o'chirdi. Tuzatish: ikkala satrdan on delete cascade'ni olib tashlaymiz. Tuzatilgan sxemada o'chirish rad etildi, xuddi o'n to'rtinchi ekrandagidek, valining uchta xabari joyida.", 'Верно. Двенадцатая строка: receiver id, on delete cascade. В сообщении va alaykum получателем был ali. Когда ali удалили, база сама удалила все сообщения, где получатель ali, и не выдала ошибку. В одиннадцатой строке то же выражение, оно удалило сообщения, которые написал ali. Исправление: убираем on delete cascade из обеих строк. В исправленной схеме удаление отклонено, как на четырнадцатом экране, три сообщения vali на месте.')}
    okShort={t("12-satr: receiver_id … ON DELETE CASCADE — ali o'chirilganda unga kelgan hamma xabar o'chdi, vali yozgani ham. Tuzatildi: 11–12-satrdan ON DELETE CASCADE olindi → DELETE rad etildi, vali'ning 3 xabari joyida (sinab ko'rilgan).", "Строка 12: receiver_id … ON DELETE CASCADE — когда удалили ali, пропали все сообщения ему, в том числе от vali. Исправлено: ON DELETE CASCADE убран из строк 11–12 → DELETE отклонён, 3 сообщения vali на месте (проверено).")}
    hint={t("«Va alaykum!»da yuboruvchi — vali, qabul qiluvchi — ali. O'chirilgan ali shu xabarning qaysi ustunida turibdi?", 'В «Va alaykum!» отправитель — vali, получатель — ali. В какой колонке этого сообщения стоит удалённый ali?')} />;
}

// --- RU: 6-bosqich · AI tavsiyasi (show = text: ovoz matnida kod-ibora yo'q) ---
const rsA = (key, text) => ({ key, text, show: text });
ru(S_PG1AI, {
  kicker: 'Этап 6 · совет ИИ', title: 'Спросили у ИИ базу для чата: два задания, два ответа',
  segments: {
    a: rsA('Вопрос из урока ученика задали настоящему ИИ: <b>чат</b>, два разных задания', 'В m4-03 ученик просит у ИИ совет по базе. Ответ в уроке написан заранее: для простого чата — MongoDB. Мы задали тот же вопрос настоящему ИИ, Claude Haiku, двумя разными заданиями: слева простыми словами, справа с четырьмя критериями.'),
    b: rsA('Оба ИИ — <b>PostgreSQL</b>; спор в четвёртом критерии', 'Оба ИИ выбрали PostgreSQL. Сравним причину с четырьмя критериями. Данные связаны, форма строгая — оба указывают на PostgreSQL. Вреда деньгам нет. Четвёртый спорный: ИИ говорит, что PostgreSQL выдержит и рост объёма, а урок ученика именно на этом вопросе говорит NoSQL.'),
    c: rsA('ИИ не ошибся — <b>ответ решает причина</b>', 'Это не ошибка ИИ. Для простого чата PostgreSQL тоже верный выбор, а ответ NoSQL в уроке — про миллионы простых сообщений. Если ученик спросит ИИ дома, он может получить другой ответ. Тогда скажите так: ответ решает не ИИ, а причина. Как в вашем проекте отвечаем на четвёртый вопрос?'),
    d: rsA('Схема в базе: три записи <b>база остановила сама</b>, три <b>прошли</b>', 'Таблицы, написанные ИИ, мы запустили в настоящем PostgreSQL. Несуществующего пользователя, текст null и повторное имя база остановила сама в обеих схемах. Три записи прошли: пустой текст сохранился в обеих, в A написал человек, который не участник беседы, а в B при удалении ali пропали и три сообщения vali.'),
    e: rsA('Вывод: совет проверяйте <b>по 4 критериям</b>, схему — <b>в базе</b>', 'Вывод. Принимайте совет ИИ с причиной и сравнивайте его с четырьмя критериями. Схему от ИИ запустите в базе и попробуйте неожиданные записи: несуществующий id, пустой текст, повтор значения и удаление пользователя, у которого есть сообщения. База проверяет только записанное правило.'),
  },
});
