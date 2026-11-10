
// AVTO: feedback/F-1029-02-mentor-kurs/dev/tgpg-kod.py — OrderBotNest teglaridan aynan (qo'lda tahrirlanmaydi)
const KOD = {
 "START_START": {
  "file": "src/api/telegram/telegram.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "  private registerCustomer() {",
    "n": 56
   },
   {
    "t": "    this.bot.start(async (ctx) => {",
    "n": 57
   },
   {
    "t": "      const user = this.users.getOrCreate(ctx.from);",
    "n": 58
   },
   {
    "t": "      await ctx.reply(texts.start(user.name, user.role === 'admin'));",
    "n": 59
   },
   {
    "t": "    });",
    "n": 60
   }
  ]
 },
 "START_USER": {
  "file": "src/api/user/user.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "@Injectable()",
    "n": 5
   },
   {
    "t": "export class UserService {",
    "n": 6
   },
   {
    "t": "  // telegramId → foydalanuvchi. Xotirada: server qayta ishga tushsa bo'shaydi.",
    "n": 7
   },
   {
    "t": "  private readonly users = new Map<number, User>();",
    "n": 8
   },
   {
    "t": "",
    "n": 9
   },
   {
    "t": "  getOrCreate(from: { id: number; first_name: string }): User {",
    "n": 10
   },
   {
    "t": "    const bor = this.users.get(from.id);",
    "n": 11
   },
   {
    "t": "    if (bor) return bor;",
    "n": 12
   },
   {
    "t": "    const user: User = {",
    "n": 13
   },
   {
    "t": "      telegramId: from.id,",
    "n": 14
   },
   {
    "t": "      name: from.first_name,",
    "n": 15
   },
   {
    "t": "      phone: null,",
    "n": 16
   },
   {
    "t": "      role: config.ADMIN_TELEGRAM_IDS.includes(from.id) ? 'admin' : 'customer',",
    "n": 17
   },
   {
    "t": "      state: 'IDLE',",
    "n": 18
   },
   {
    "t": "    };",
    "n": 19
   },
   {
    "t": "    this.users.set(from.id, user);",
    "n": 20
   },
   {
    "t": "    return user;",
    "n": 21
   },
   {
    "t": "  }",
    "n": 22
   }
  ]
 },
 "START_ORDER": {
  "file": "src/api/order/order.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "@Injectable()",
    "n": 11
   },
   {
    "t": "export class OrderService {",
    "n": 12
   },
   {
    "t": "  // Buyurtmalar ro'yxati xotirada; id oddiy hisoblagich",
    "n": 13
   },
   {
    "t": "  private readonly orders: Order[] = [];",
    "n": 14
   },
   {
    "t": "  private nextId = 1;",
    "n": 15
   }
  ]
 },
 "START_CAT": {
  "file": "src/api/catalog/catalog.service.ts",
  "tag": "tgpg-start",
  "lines": [
   {
    "t": "// Katalog hozircha koddagi ro'yxat. Narx so'mda, stock — omborda nechta.",
    "n": 6
   },
   {
    "t": "const PRODUCTS: Product[] = [",
    "n": 7
   },
   {
    "t": "  { id: 1, name: 'Klaviatura', price: 120000, stock: 8 },",
    "n": 8
   },
   {
    "t": "  { id: 2, name: 'Sichqoncha', price: 75000, stock: 15 },",
    "n": 9
   },
   {
    "t": "  { id: 3, name: 'Quloqchin', price: 95000, stock: 5 },",
    "n": 10
   },
   {
    "t": "  { id: 4, name: 'Kolonka', price: 50000, stock: 10 },",
    "n": 11
   },
   {
    "t": "  { id: 5, name: 'Planshet', price: 300000, stock: 3 },",
    "n": 12
   },
   {
    "t": "  { id: 6, name: \"O'yinchoq\", price: 30000, stock: 4 },",
    "n": 13
   },
   {
    "t": "];",
    "n": 14
   }
  ]
 },
 "DONE_PRODUCT": {
  "file": "src/core/entity/product.entity.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';",
    "n": 1
   },
   {
    "t": "",
    "n": 2
   },
   {
    "t": "// products — PG-2 darsidagi jadvalning o'zi: id, name, price, stock",
    "n": 3
   },
   {
    "t": "@Entity('products')",
    "n": 4
   },
   {
    "t": "export class Product {",
    "n": 5
   },
   {
    "t": "  @PrimaryGeneratedColumn()",
    "n": 6
   },
   {
    "t": "  id: number;",
    "n": 7
   },
   {
    "t": "",
    "n": 8
   },
   {
    "t": "  @Column({ type: 'varchar', unique: true })",
    "n": 9
   },
   {
    "t": "  name: string;",
    "n": 10
   },
   {
    "t": "",
    "n": 11
   },
   {
    "t": "  @Column({ type: 'integer' })",
    "n": 12
   },
   {
    "t": "  price: number; // so'm",
    "n": 13
   },
   {
    "t": "",
    "n": 14
   },
   {
    "t": "  @Column({ type: 'integer', default: 0 })",
    "n": 15
   },
   {
    "t": "  stock: number; // omborda nechta; bazada CHECK (stock >= 0)",
    "n": 16
   },
   {
    "t": "}",
    "n": 17
   }
  ]
 },
 "DONE_MIG": {
  "file": "src/infrastructure/migrations/1762200000000-init.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "  public async up(q: QueryRunner): Promise<void> {",
    "n": 7
   },
   {
    "t": "    await q.query(`CREATE TABLE \"products\" (",
    "n": 8
   },
   {
    "t": "      \"id\" SERIAL PRIMARY KEY,",
    "n": 9
   },
   {
    "t": "      \"name\" VARCHAR NOT NULL UNIQUE,",
    "n": 10
   },
   {
    "t": "      \"price\" INTEGER NOT NULL,",
    "n": 11
   },
   {
    "t": "      \"stock\" INTEGER NOT NULL DEFAULT 0,",
    "n": 12
   },
   {
    "t": "      CONSTRAINT \"stock_nonneg\" CHECK (\"stock\" >= 0)",
    "n": 13
   },
   {
    "t": "    )`);",
    "n": 14
   }
  ]
 },
 "DONE_USER": {
  "file": "src/core/entity/user.entity.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "@Entity('users')",
    "n": 11
   },
   {
    "t": "export class User {",
    "n": 12
   },
   {
    "t": "  @PrimaryGeneratedColumn()",
    "n": 13
   },
   {
    "t": "  id: number;",
    "n": 14
   },
   {
    "t": "",
    "n": 15
   },
   {
    "t": "  // Telegram id 32 bitga sig'maydi (5 123 456 789) — BIGINT.",
    "n": 16
   },
   {
    "t": "  // node-pg BIGINT'ni MATN qilib qaytaradi, shuning uchun tipi string.",
    "n": 17
   },
   {
    "t": "  @Column({ name: 'telegram_id', type: 'bigint', unique: true })",
    "n": 18
   },
   {
    "t": "  telegram_id: string;",
    "n": 19
   },
   {
    "t": "",
    "n": 20
   },
   {
    "t": "  @Column({ type: 'varchar' })",
    "n": 21
   },
   {
    "t": "  name: string;",
    "n": 22
   },
   {
    "t": "",
    "n": 23
   },
   {
    "t": "  @Column({ type: 'varchar', nullable: true })",
    "n": 24
   },
   {
    "t": "  phone: string | null;",
    "n": 25
   },
   {
    "t": "",
    "n": 26
   },
   {
    "t": "  @Column({ type: 'varchar', default: 'customer' })",
    "n": 27
   },
   {
    "t": "  role: Role;",
    "n": 28
   },
   {
    "t": "",
    "n": 29
   },
   {
    "t": "  // Suhbat qaysi bosqichda — bazada, server qayta ishga tushsa ham qoladi",
    "n": 30
   },
   {
    "t": "  @Column({ type: 'varchar', default: 'IDLE' })",
    "n": 31
   },
   {
    "t": "  state: UserState;",
    "n": 32
   }
  ]
 },
 "DONE_CART": {
  "file": "src/api/cart/cart.service.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "  // Bitta so'rov: yo'q bo'lsa INSERT, bor bo'lsa qty + 1 (ON CONFLICT — UNIQUE (user_id, product_id) ustiga)",
    "n": 19
   },
   {
    "t": "  async add(user: User, productId: number): Promise<number> {",
    "n": 20
   },
   {
    "t": "    const rows: { qty: number }[] = await this.repo.query(",
    "n": 21
   },
   {
    "t": "      `INSERT INTO cart_items (user_id, product_id, qty) VALUES ($1, $2, 1)",
    "n": 22
   },
   {
    "t": "       ON CONFLICT (user_id, product_id) DO UPDATE SET qty = cart_items.qty + 1",
    "n": 23
   },
   {
    "t": "       RETURNING qty`,",
    "n": 24
   },
   {
    "t": "      [user.id, productId],",
    "n": 25
   },
   {
    "t": "    );",
    "n": 26
   },
   {
    "t": "    return rows[0].qty;",
    "n": 27
   },
   {
    "t": "  }",
    "n": 28
   }
  ]
 },
 "DONE_PLACE": {
  "file": "src/api/order/order.service.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "  place(user: User, cart: CartItem[]): Promise<Order> {",
    "n": 24
   },
   {
    "t": "    if (!user.phone) throw new Error(\"Telefon raqami yo'q\");",
    "n": 25
   },
   {
    "t": "    if (cart.length === 0) throw new Error(\"Savat bo'sh\");",
    "n": 26
   },
   {
    "t": "    return this.ds.transaction(async (m) => {",
    "n": 27
   },
   {
    "t": "      const items: OrderItem[] = [];",
    "n": 28
   },
   {
    "t": "      for (const c of cart) {",
    "n": 29
   },
   {
    "t": "        // 1) Qatorni qulflab o'qiymiz (SELECT ... FOR UPDATE): ikkinchi mijoz shu qatorni biz tugatguncha kutadi",
    "n": 30
   },
   {
    "t": "        const p = await m.findOne(Product, {",
    "n": 31
   },
   {
    "t": "          where: { id: c.product.id },",
    "n": 32
   },
   {
    "t": "          lock: { mode: 'pessimistic_write' },",
    "n": 33
   },
   {
    "t": "        });",
    "n": 34
   },
   {
    "t": "        if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);",
    "n": 35
   },
   {
    "t": "        if (p.stock < c.qty) {",
    "n": 36
   },
   {
    "t": "          throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);",
    "n": 37
   },
   {
    "t": "        }",
    "n": 38
   },
   {
    "t": "        // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.",
    "n": 39
   },
   {
    "t": "        //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi",
    "n": 40
   },
   {
    "t": "        //    («current transaction is aborted») — faqat ROLLBACK qoladi.",
    "n": 41
   },
   {
    "t": "        await m.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [",
    "n": 42
   },
   {
    "t": "          c.qty,",
    "n": 43
   },
   {
    "t": "          p.id,",
    "n": 44
   },
   {
    "t": "        ]);",
    "n": 45
   },
   {
    "t": "        items.push(",
    "n": 46
   },
   {
    "t": "          m.create(OrderItem, { product: p, qty: c.qty, price: p.price }),",
    "n": 47
   },
   {
    "t": "        );",
    "n": 48
   },
   {
    "t": "      }",
    "n": 49
   },
   {
    "t": "      const order = m.create(Order, {",
    "n": 50
   },
   {
    "t": "        user,",
    "n": 51
   },
   {
    "t": "        phone: user.phone!,",
    "n": 52
   },
   {
    "t": "        status: 'NEW',",
    "n": 53
   },
   {
    "t": "        total: items.reduce((s, i) => s + i.price * i.qty, 0),",
    "n": 54
   },
   {
    "t": "        items,",
    "n": 55
   },
   {
    "t": "      });",
    "n": 56
   },
   {
    "t": "      const saved = await m.save(order);",
    "n": 57
   },
   {
    "t": "      await m.delete(CartItem, { user: { id: user.id } });",
    "n": 58
   },
   {
    "t": "      return saved;",
    "n": 59
   },
   {
    "t": "    });",
    "n": 60
   },
   {
    "t": "  }",
    "n": 61
   }
  ]
 },
 "DONE_DS": {
  "file": "src/infrastructure/data-source.ts",
  "tag": "tgpg-done",
  "lines": [
   {
    "t": "// Bitta ulanish sozlamasi — ham Nest (DatabaseModule), ham typeorm CLI (migration:run) shuni ishlatadi",
    "n": 7
   },
   {
    "t": "export const dataSourceOptions = {",
    "n": 8
   },
   {
    "t": "  type: 'postgres' as const,",
    "n": 9
   },
   {
    "t": "  url: config.DATABASE_URL,",
    "n": 10
   },
   {
    "t": "  ssl: config.DATABASE_URL.includes('sslmode=require')",
    "n": 11
   },
   {
    "t": "    ? { rejectUnauthorized: false }",
    "n": 12
   },
   {
    "t": "    : false,",
    "n": 13
   },
   {
    "t": "  entities: [Product, User, CartItem, Order, OrderItem],",
    "n": 14
   },
   {
    "t": "  migrations: [Init1762200000000],",
    "n": 15
   },
   {
    "t": "  synchronize: false, // jadvallar faqat migratsiya bilan o'zgaradi",
    "n": 16
   },
   {
    "t": "  logging: config.DB_LOGGING ? ['query', 'error'] : ['error'],",
    "n": 17
   },
   {
    "t": "};",
    "n": 18
   },
   {
    "t": "",
    "n": 19
   }
  ]
 },
 "BUZUQ": {
  "file": "src/api/order/order.service.ts",
  "tag": "buzuq",
  "lines": [
   {
    "t": "      for (const c of cart) {",
    "n": 29
   },
   {
    "t": "        // 1) Mahsulotni o'qiymiz va omborda yetarlimi — tekshiramiz",
    "n": 30
   },
   {
    "t": "        const p = await m.findOneBy(Product, { id: c.product.id });",
    "n": 31
   },
   {
    "t": "        if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);",
    "n": 32
   },
   {
    "t": "        if (p.stock < c.qty) {",
    "n": 33
   },
   {
    "t": "          throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);",
    "n": 34
   },
   {
    "t": "        }",
    "n": 35
   },
   {
    "t": "        p.stock = p.stock - c.qty;",
    "n": 36
   },
   {
    "t": "        await m.save(p);",
    "n": 37
   },
   {
    "t": "        items.push(",
    "n": 38
   },
   {
    "t": "          m.create(OrderItem, { product: p, qty: c.qty, price: p.price }),",
    "n": 39
   },
   {
    "t": "        );",
    "n": 40
   },
   {
    "t": "      }",
    "n": 41
   }
  ]
 }
};
