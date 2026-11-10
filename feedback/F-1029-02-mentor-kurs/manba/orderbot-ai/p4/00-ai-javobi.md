# AI javobi — Prompt 4 (04.11)
- Migratsiya 1793733945621-CreateOrders: orders (telegram_id BIGINT → users RESTRICT, phone, total CHECK ≥0, status CHECK IN, created_at, IDX), order_items (order CASCADE, product RESTRICT, qty CHECK >0, price CHECK ≥0, UNIQUE(order,product)).
- order.entity, order-item.entity; umumiy bigint.transformer (takrorni o'zi yig'di).
- place(user) bitta dataSource.transaction: 1) users FOR UPDATE (bir mijozning ikki checkout'i navbat bilan) 2) savat product_id tartibida (deadlock yo'q) 3) UPDATE … WHERE stock >= qty RETURNING (qulf + tekshiruv bitta so'rovda) 4) orders + order_items 5) DELETE cart_items. Xato → ROLLBACK, savat qoladi.
- setStatus: orders FOR UPDATE; CANCELLED → order_items bo'yicha stock qaytadi; ikki marta bekor → bir marta qaytadi.
- catalog.take/giveBack ga ixtiyoriy manager (tranzaksiya ichida).
- O'zi sinagan: oddiy buyurtma; ikki mahsulotli savatda biri yetmasa hech narsa o'zgarmadi; oxirgi Planshet ikki mijoz; bir mijoz ikki parallel checkout → bitta buyurtma; order_items'ga trigger bilan xato → ROLLBACK; restart → /orders 3 ta; ikki marta bekor; #4 yo'q (ROLLBACK sequence sarfladi).
- texts.ts, keyboards.ts diff 0.
