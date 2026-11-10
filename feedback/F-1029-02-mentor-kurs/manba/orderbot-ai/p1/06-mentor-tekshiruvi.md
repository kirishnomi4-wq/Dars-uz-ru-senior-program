# Mentor tekshiruvi — Prompt 1 (orderbot-ai-tekshir.sh 1, toza baza shop_v)
- tsc ✓ · nest build ✓ · seed 1: «6 ta qo'shildi» · seed 2: «0 ta qo'shildi, 6 tasi bor edi» ✓ · migratsiya o'zi yurdi (migrations: 1 qator) ✓ · `\d products`: PK, UQ_products_name, CHK_products_stock ✓.
- Bot senariysi: katalog sahifalash ✓, Planshet «omborda faqat 3 ta qoldi» ✓.
- **TOPILMA (oraliq holat):** restartdan keyin buyurtma #1 yo'q («Hozircha buyurtma yo'q»), savat bo'sh — bu kutilgan (hali xotirada). Lekin bazada ombor KAMAYGAN qoldi: Klaviatura 8→7, Kolonka 10→8. Ya'ni buyurtma yo'qoldi, mahsulot ombordan «ketdi». Bosqichma-bosqich ko'chirishda yarim-bazada holat ma'lumotni buzadi → darsda: «har bosqichdan keyin tekshiring, oraliq holatni prodga chiqarmang».
- AI o'zi aytgan chetga chiqish (await) — asosli: async servis chaqiruvchilarni ham o'zgartiradi. Darsda: AI javobidagi «chetga chiqdim» qismini o'qing.
- AI ish papkasidan tashqariga `psql.sh` yozdi — mayda, lekin «AI qayerga yozdi» — git status bilan ko'ring.
