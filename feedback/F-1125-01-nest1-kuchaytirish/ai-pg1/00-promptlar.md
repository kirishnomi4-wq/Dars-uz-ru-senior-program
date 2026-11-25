# F-1125-01 · PG-1 AI bloki — haqiqiy AI yurgizishi (25.11.2026)

**Asos:** o'quvchi darsi m4-03 (`src/4-Modull/DbSqlNosqlLesson.jsx`, App.jsx `comp: DbSqlNosqlLesson`) Screen11 «AI'dan baza tavsiyasi» — o'quvchi loyihasini aytadi, AI baza va sabab aytadi, o'quvchi sababni 4 mezon bilan solishtiradi (Screen8: bog'langanmi · shakli qat'iymi · xato qimmatmi · ulkan hajm va tezlik). Darsdagi AI javobi tayyor matn: «Oddiy chat ilovasi» → NoSQL (MongoDB).
**Loyiha:** chat ilovasi — o'quvchi darsidagi aynan shu tugma; uyga vazifa misoli (onlayn do'kon) bilan to'qnashmaydi.
**AI:** Claude Haiku ×2 (agent), vositasiz — oddiy chatdagi javob.
**Savol:** haqiqiy AI darsdagi tayyor javob bilan bir xil deydimi? Sababi 4 mezonga to'g'ri keladimi? Yozgan sxemasi bazada nimani to'xtatadi?

## A · Oddiy topshiriq (o'quvchi darsidagi tugma matni + bitta so'rov)
> Oddiy chat ilovasi yasamoqchiman. Qaysi baza yaxshi: PostgreSQL yoki MongoDB? Jadvallarini ham yozib ber.

## B · Mezon tilidagi topshiriq
> Chat ilovasi uchun baza tanla. Avval to'rt savolga bittadan jumla bilan javob ber:
> 1) ma'lumotlar bir-biriga bog'langanmi? 2) shakli qat'iymi — hamma yozuv bir xilmi? 3) xato pul yoki buyurtmaga zarar qiladimi? 4) ma'lumot juda katta hajmdami va tezlik muhimmi?
> Keyin tanlov va bir jumla sabab. Tanlov PostgreSQL bo'lsa — users va messages jadvallari uchun CREATE TABLE yoz (PRIMARY KEY, NOT NULL, REFERENCES). MongoDB bo'lsa — Mongoose sxemasi.

## Agent o'rami (ikkalasiga bir xil)
«Sen oddiy chat-yordamchisan. Foydalanuvchi xabariga chatda qanday javob bersang, shunday javob ber. Hech qanday vosita ishlatma, fayl o'qima, buyruq yurgizma. Yakuniy javobing — faqat foydalanuvchiga yoziladigan matn, boshqa izohsiz.»

## Mentor tekshiruvi (`ai-tekshir-pg1.sh`)
1. Sabab — 4 mezon bilan (qo'lda, `XULOSA.md`).
2. Sxema — vaqtinchalik PostgreSQL 18 klasterida (`drive-pg1-sqlnosql.sh` uslubida) yoki mongod'da yurgiziladi + kutilmagan yozuvlar: yo'q foydalanuvchiga xabar · bo'sh matn (NULL va '') · takror username · xabari bor foydalanuvchini o'chirish.
