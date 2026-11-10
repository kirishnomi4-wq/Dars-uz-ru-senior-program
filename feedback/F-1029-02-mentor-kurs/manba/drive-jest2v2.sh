#!/usr/bin/env bash
# Jest-2 v2 mentor darsi — haqiqiy chiqishlar OrderBotNest ustida (F-1104-19, 04.11). Natija: manba/jest2v2-out/NN-*.txt
# ISHLATISH (repo ildizidan): S=<scratchpad> bash feedback/F-1029-02-mentor-kurs/manba/drive-jest2v2.sh
# `jest1-done` dan YANGI papkaga clone ($S/jest2v2-run), node_modules nusxa (supertest shu nusxaga o'rnatiladi — asl repoga tegilmaydi).
set -u
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
OUT="$ROOT/feedback/F-1029-02-mentor-kurs/manba/jest2v2-out"
SRC=/home/kali/Desktop/order-bot
R="${S:?S=scratchpad kerak}/jest2v2-run"
mkdir -p "$OUT"; rm -rf "$R"
git -c advice.detachedHead=false clone -q --branch jest1-done "$SRC" "$R" 2>/dev/null
cp -a "$SRC/node_modules" "$R/node_modules"
cd "$R"
CLEAN=(env -i HOME="$HOME" PATH="$PATH" TERM=dumb NO_COLOR=1 FORCE_COLOR=0)
run(){ echo "\$ $*"; "${CLEAN[@]}" "$@" 2>&1; echo "[chiqish kodi: $?]"; echo; }
pr(){ npx prettier --write "$@" >/dev/null 2>&1; }
T=src/api/telegram; O=src/api/order
{ node --version; git log -1 --format='HEAD %h %s' | cut -c1-60; for p in jest ts-jest @nestjs/testing typescript; do echo "$p $(node -p "require('./node_modules/$p/package.json').version")"; done; } > "$OUT/00-versiyalar.txt"

# ---------- A. Telefon: qoida telegram.service.ts ichida yashirin → alohida funksiya ----------
{ echo '# telegram.service.ts ichida:'; grep -n "PHONE" $T/telegram.service.ts; } > "$OUT/01-phone-yashirin.txt"
cat > $T/phone.ts <<'TS'
// Telefon raqami: + bilan yoki + siz, 9–13 ta raqam
export const PHONE = /^\+?\d{9,13}$/;

export const isPhone = (text: string) => PHONE.test(text.trim());
TS
cat > $T/phone.spec.ts <<'TS'
import { isPhone } from './phone';

describe('isPhone', () => {
  it.each(['+998901234567', '998901234567'])("%s — to'g'ri raqam", (s) => {
    expect(isPhone(s)).toBe(true);
  });

  it.each([
    ['12345678', '8 ta raqam — qisqa'],
    ['+99890123456789', '14 ta raqam — uzun'],
    ['abc', 'harf'],
    ['', "bo'sh"],
  ])('%s — %s', (s) => {
    expect(isPhone(s)).toBe(false);
  });

  it('mijoz probel bilan yozadi', () => {
    expect(isPhone('+998 90 123 45 67')).toBe(true);
  });
});
TS
pr $T/phone.ts $T/phone.spec.ts; cp $T/phone.spec.ts "$OUT/kod-02-phone.spec.ts"; cp $T/phone.ts "$OUT/kod-02-phone.ts"
run npx jest phone --verbose > "$OUT/02-phone-probel-fail.txt"
# tuzatish: probel va chiziqchani olib tashlab tekshiramiz
cat > $T/phone.ts <<'TS'
// Telefon raqami: + bilan yoki + siz, 9–13 ta raqam. Mijoz probel yoki chiziqcha bilan yozishi mumkin
export const PHONE = /^\+?\d{9,13}$/;

export const isPhone = (text: string) => PHONE.test(text.replace(/[\s-]/g, ''));
TS
pr $T/phone.ts; cp $T/phone.ts "$OUT/kod-03-phone.ts"
run npx jest phone --verbose > "$OUT/03-phone-tuzatildi.txt"
# chegara: 9 ta nol ham «to'g'ri»
cat >> $T/phone.spec.ts <<'TS'

describe('isPhone — qoida nimani o\'tkazib yuboradi', () => {
  it("9 ta nol ham o'tadi", () => {
    expect(isPhone('000000000')).toBe(true);
  });
});
TS
pr $T/phone.spec.ts; cp $T/phone.spec.ts "$OUT/kod-04-phone.spec.ts"
run npx jest phone --verbose > "$OUT/04-phone-nol.txt"

# ---------- B. OrderService.place: sinxron throw va rejects ----------
cat > $O/order.service.spec.ts <<'TS'
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order, User } from '../../core/entity';
import { OrderService } from './order.service';

// Baza o'rniga soxta (mock) EntityManager: findOne mahsulotni qaytaradi, query va save — yozib qoladi
const manager = {
  findOne: jest.fn(),
  query: jest.fn(),
  create: jest.fn((_cls, data) => data),
  save: jest.fn(async (o) => ({ id: 1, ...o })),
  delete: jest.fn(),
};
const dataSource = { transaction: jest.fn((cb) => cb(manager)) };

const user = { id: 1, phone: '+998901234567' } as User;
const cart = [{ product: { id: 4, name: 'Kolonka' }, qty: 2 }] as any;

let service: OrderService;
beforeEach(async () => {
  jest.clearAllMocks();
  const mod = await Test.createTestingModule({
    providers: [
      OrderService,
      { provide: getRepositoryToken(Order), useValue: {} },
      { provide: DataSource, useValue: dataSource },
    ],
  }).compile();
  service = mod.get(OrderService);
});

describe('OrderService.place', () => {
  it("telefon yo'q — darhol xato", () => {
    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow("Telefon raqami yo'q");
  });

  it("savat bo'sh — darhol xato", () => {
    expect(() => service.place(user, [])).toThrow("Savat bo'sh");
  });

  it("omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi", async () => {
    manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 1, price: 50000 });
    await expect(service.place(user, cart)).rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi');
    expect(manager.query).not.toHaveBeenCalled();
  });

  it('yetarli — jami narx hisoblanadi', async () => {
    manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 10, price: 50000 });
    const order = await service.place(user, cart);
    expect(order.total).toBe(100000);
    expect(manager.query).toHaveBeenCalledTimes(1);
  });
});
TS
pr $O/order.service.spec.ts; cp $O/order.service.spec.ts "$OUT/kod-05-order.service.spec.ts"
run npx jest order.service --verbose > "$OUT/05-order-pass.txt"

# B2–B6: variant test fayllari bitta qolipdan (Prettier'dan keyin satr raqamlari barqaror)
cp $O/order.service.spec.ts "$R/.o.bak"
spec(){ python3 "$R/.gen.py" "$1" > $O/order.service.spec.ts; pr $O/order.service.spec.ts; }
cat > "$R/.gen.py" <<'PY'
import sys
head = open(sys.argv[0].replace('.gen.py', '.o.bak')).read().split("describe('OrderService.place'")[0]
T = {
 'tel_sync': """  it("telefon yo'q — darhol xato", () => {
    expect(() => service.place({ id: 1, phone: null } as User, cart)).toThrow("Telefon raqami yo'q");
  });""",
 'tel_rejects': """  it("telefon yo'q — darhol xato", async () => {
    await expect(service.place({ id: 1, phone: null } as User, cart)).rejects.toThrow("Telefon raqami yo'q");
  });""",
 'bosh': """  it("savat bo'sh — darhol xato", () => {
    expect(() => service.place(user, [])).toThrow("Savat bo'sh");
  });""",
 'ombor_rejects': """  it("omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi", async () => {
    manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 1, price: 50000 });
    await expect(service.place(user, cart)).rejects.toThrow('Kolonka: omborda faqat 1 ta qoldi');
    expect(manager.query).not.toHaveBeenCalled();
  });""",
 'ombor_tothrow': """  it("omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi", async () => {
    manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 1, price: 50000 });
    expect(() => service.place(user, cart)).toThrow('Kolonka: omborda faqat 1 ta qoldi');
    expect(manager.query).not.toHaveBeenCalled();
  });""",
 'ombor_awaitsiz': """  it("omborda yetmaydi — tranzaksiya ichida xato, UPDATE bo'lmaydi", async () => {
    manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 1, price: 50000 });
    expect(service.place(user, cart)).rejects.toThrow('Planshet: omborda faqat 9 ta qoldi');
  });""",
 'yetarli': """  it('yetarli — jami narx hisoblanadi', async () => {
    manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 10, price: 50000 });
    const order = await service.place(user, cart);
    expect(order.total).toBe(100000);
    expect(manager.query).toHaveBeenCalledTimes(1);
  });""",
 'chegara': """  it("chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi", async () => {
    manager.findOne.mockResolvedValue({ id: 4, name: 'Kolonka', stock: 2, price: 50000 });
    const order = await service.place(user, cart);
    expect(order.total).toBe(100000);
  });""",
}
parts = sys.argv[1].split(',')
print(head + "describe('OrderService.place', () => {\n" + "\n\n".join(T[k] for k in parts) + "\n});")
PY
sed -i "s#sys.argv\[0\].replace('.gen.py', '.o.bak')#'$R/.o.bak'#" "$R/.gen.py"
spec tel_rejects,bosh,ombor_rejects,yetarli; cp $O/order.service.spec.ts "$OUT/kod-06-order-rejects.spec.ts"
run npx jest order.service -t "telefon" > "$OUT/06-rejects-sinxron.txt"
spec tel_sync,bosh,ombor_tothrow,yetarli; cp $O/order.service.spec.ts "$OUT/kod-07-order-tothrow.spec.ts"
run npx jest order.service -t "omborda" > "$OUT/07-tothrow-promise.txt"
spec tel_sync,bosh,ombor_awaitsiz,yetarli; cp $O/order.service.spec.ts "$OUT/kod-08-order-await-yoq.spec.ts"
run npx jest order.service -t "omborda" > "$OUT/08-await-unutildi.txt"
cp "$R/.o.bak" $O/order.service.spec.ts

# B5: kodni buzamiz — ombor tekshiruvi < o'rniga <= (chegara testi yo'q)
sed -i 's/        if (p.stock < c.qty) {/        if (p.stock <= c.qty) {/' $O/order.service.ts
{ grep -n "p.stock <" $O/order.service.ts; echo; run npx jest order.service; } > "$OUT/09-order-chegara-buzildi.txt"
git checkout -q -- $O/order.service.ts
# B6: chegara testi qo'shildi → buzilganda qizaradi
spec tel_sync,bosh,ombor_rejects,yetarli,chegara; cp $O/order.service.spec.ts "$OUT/kod-10-order-chegara.spec.ts"
run npx jest order.service --verbose > "$OUT/09b-chegara-testi-pass.txt"
sed -i 's/        if (p.stock < c.qty) {/        if (p.stock <= c.qty) {/' $O/order.service.ts
{ grep -n "p.stock <" $O/order.service.ts; echo; run npx jest order.service; } > "$OUT/09c-chegara-testi-buzildi.txt"
git checkout -q -- $O/order.service.ts

# ---------- C. HTTP test: saytning API'si (supertest) ----------
{ echo '$ npm i -D supertest @types/supertest'; "${CLEAN[@]}" npm i -D supertest @types/supertest --no-audit --no-fund 2>&1 | tail -2; echo "[chiqish kodi: $?]"; for p in supertest @types/supertest; do echo "$p $(node -p "require('./node_modules/$p/package.json').version")"; done; } > "$OUT/10-supertest-ornatish.txt"
cat > src/api/app.controller.spec.ts <<'TS'
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from './app.controller';

let app: INestApplication;
beforeAll(async () => {
  const mod = await Test.createTestingModule({ controllers: [AppController] }).compile();
  app = mod.createNestApplication();
  await app.init();
});
afterAll(() => app.close());

describe('HTTP: GET /', () => {
  it('200 va { ok: true }', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, service: 'order-bot' });
  });

  it("yo'q manzil — 404", async () => {
    const res = await request(app.getHttpServer()).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Cannot GET /nope');
  });
});
TS
pr src/api/app.controller.spec.ts; cp src/api/app.controller.spec.ts "$OUT/kod-11-app.controller.spec.ts"
run npx jest app.controller --verbose > "$OUT/11-http-pass.txt"
# hammasi
run npm test -- --verbose > "$OUT/12-hammasi.txt"
cp $T/phone.ts $T/phone.spec.ts $O/order.service.spec.ts src/api/app.controller.spec.ts "$OUT/" 2>/dev/null
git diff --stat > "$OUT/13-diff-stat.txt"
echo "tayyor: $OUT"
