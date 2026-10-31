#!/usr/bin/env bash
# drive-nest2-extra2.sh — MD auditidagi ⚠ (tekshirilmagan) da'volar: 21 superadmin vs @Roles('admin') · 22 token eskirishi va
# POST /admin/token · 23 T2 (Entity'da @Column o'rniga @IsNumber) · 24 uyga vazifa: bor jadvalga NOT NULL brandId · 25 TS xato matnlari ·
# 26 PartialType @nestjs/mapped-types'dan → Swagger. Alohida fayl (pkill naqshi o'z shellini o'ldirmasin).
# Ishlatish: bash drive-nest2-extra2.sh <ish-papka> <out-papka>
set -u
WORK=${1:?}; OUT=${2:?}; R="$WORK/IntroNestArxitechture"; cd "$R" || exit 1
PG_PASS=$(sed -nE 's#^DEV_DB_URL=postgres://postgres:([^@]*)@.*#\1#p' /home/kali/Desktop/papku/IntroNestArxitechture/.env)
DB=nest2_mentor
PGF='^WARNING:  database .* collation version mismatch\|^DETAIL:  The database was created using collation\|^HINT:  Rebuild all objects in this database'
dbq(){ psql "postgres://postgres:${PG_PASS}@localhost:5432/$DB" -c "$1" 2>&1 | grep -v "$PGF"; }
port_pid(){ ss -ltnp 'sport = :3000' 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2; }
SRV=""
stop(){ pkill -f "nest start" 2>/dev/null; [ -n "$SRV" ] && kill "$SRV" 2>/dev/null; local p; for _ in $(seq 1 20); do p=$(port_pid); [ -z "$p" ] && break; kill "$p" 2>/dev/null; sleep 0.5; done; p=$(port_pid); [ -n "$p" ] && kill -9 "$p" 2>/dev/null; [ -n "$SRV" ] && wait "$SRV" 2>/dev/null; SRV=""; sleep 1; }
# kompilyatsiya 5–10 s oladi — port ochilguncha yoki subshell tugaguncha (crash) kutiladi, maks 90 s
up(){ for _ in $(seq 1 180); do curl -s -o /dev/null localhost:3000/api/v1 && return 0; kill -0 "$SRV" 2>/dev/null || return 1; sleep 0.5; done; return 2; }
start(){ : > "$OUT/$1"; ( npx nest start >> "$OUT/$1" 2>&1 ) & SRV=$!; up; local rc=$?; echo "   $1 → $rc (port pid $(port_pid))"; return $rc; }
req(){ local f="$OUT/$1" m=$2 p=$3 b=${4:-}; shift 3; [ $# -gt 0 ] && shift; [ "$b" = - ] && b=""
  { echo "### $m $p${b:+   body: $b}"
    if [ -n "$b" ]; then curl -s -X "$m" "localhost:3000$p" -H 'Content-Type: application/json' -d "$b" "$@" -w '\n-- status: %{http_code}\n'
    else curl -s -X "$m" "localhost:3000$p" "$@" -w '\n-- status: %{http_code}\n'; fi; echo; } >> "$f" 2>&1; }
tok(){ curl -s -X POST localhost:3000/api/v1/admin/signin -H 'Content-Type: application/json' -d "{\"username\":\"$1\",\"password\":\"$2\"}" | python3 -c 'import sys,json
try: print(json.load(sys.stdin)["data"]["token"])
except Exception: print("")'; }
clean(){ sed 's/\x1b\[[0-9;]*m//g'; }
bak(){ for f in "$@"; do cp "$R/$f" "$WORK/bak-$(echo $f | tr / _)"; done; }
restore(){ for f in "$@"; do cp "$WORK/bak-$(echo $f | tr / _)" "$R/$f"; done; }
trap 'stop' EXIT
stop
dbq "DELETE FROM books WHERE title='Test kitob';" >/dev/null

# ---------- 22 token eskirishi + POST /admin/token ----------
cp .env "$WORK/bak-env"; sed -i 's/^Access_Token_Time=.*/Access_Token_Time=5s/' .env
F=22-token-expiry.txt; : > "$OUT/$F"; start 22-token-expiry.log
J="$WORK/cookies.txt"; rm -f "$J"
{ echo "### POST /api/v1/admin/signin (cookie jar bilan)"; curl -s -c "$J" -X POST localhost:3000/api/v1/admin/signin -H 'Content-Type: application/json' -d '{"username":"superadmin","password":"Superadmin1!"}' -w '\n-- status: %{http_code}\n'; echo; echo "--- cookie:"; grep adminToken "$J" | awk '{print $6"="substr($7,1,20)"…"}'; echo; } >> "$OUT/$F"
T=$(tok superadmin 'Superadmin1!')
req $F GET /api/v1/admin/all/admin - -H "Authorization: Bearer $T"
echo "--- 6 soniya kutildi (Access_Token_Time=5s)" >> "$OUT/$F"; sleep 6
req $F GET /api/v1/admin/all/admin - -H "Authorization: Bearer $T"
req $F POST /api/v1/admin/token - -b "$J"
req $F POST /api/v1/admin/token - -b "$J" -H "Authorization: Bearer $T"
T2=$(tok superadmin 'Superadmin1!'); req $F POST /api/v1/admin/token - -b "$J" -H "Authorization: Bearer $T2"
stop; cp "$WORK/bak-env" .env

# ---------- 21 superadmin vs @Roles('admin') (KitobShop playbook qoidasi) + «tizimga kirganlar» eshigi ----------
bak src/api/book/book.controller.ts
cat > src/api/book/book.controller.ts <<'EOT'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles-decorator';
import { UserRole } from 'src/common/enum/user-enum';

@UseGuards(AuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Roles('public')
  @Get()
  findAll() {
    return this.bookService.findAll({ relations: { category: true } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
EOT
F=21-roles-superadmin.txt; : > "$OUT/$F"; start 21-roles-superadmin.log
TS=$(tok superadmin 'Superadmin1!'); TA=$(tok ali 'Developer1!')
{ echo "superadmin token: ${#TS} belgi · ali (role admin) token: ${#TA} belgi"; echo; } >> "$OUT/$F"
CAT=$(curl -s localhost:3000/api/v1/category | python3 -c 'import sys,json; print(json.load(sys.stdin)["data"][0]["id"])')
B='{"title":"Test kitob","author":"Muallif","price":1000,"categoryId":"'$CAT'"}'
echo "## @Roles('admin') POST /api/v1/book" >> "$OUT/$F"
req $F POST /api/v1/book "$B"
req $F POST /api/v1/book "$B" -H "Authorization: Bearer $TS"
req $F POST /api/v1/book "$B" -H "Authorization: Bearer $TA"
BOOK=$(curl -s localhost:3000/api/v1/book | python3 -c 'import sys,json; d=json.load(sys.stdin)["data"]; print([b for b in d if b["title"]=="Test kitob"][0]["id"])')
echo "## @Roles('public') GET /api/v1/book (tokensiz)" >> "$OUT/$F"; req $F GET /api/v1/book
echo "## @Roles YO'Q — PATCH /api/v1/book/:id («tizimga kirganlar»)" >> "$OUT/$F"
req $F PATCH /api/v1/book/$BOOK '{"price":1500}'
req $F PATCH /api/v1/book/$BOOK '{"price":1500}' -H "Authorization: Bearer $TS"
req $F PATCH /api/v1/book/$BOOK '{"price":1600}' -H "Authorization: Bearer $TA"
echo "## @Roles(UserRole.ADMIN) DELETE /api/v1/book/:id" >> "$OUT/$F"
req $F DELETE /api/v1/book/$BOOK - -H "Authorization: Bearer $TS"
req $F DELETE /api/v1/book/$BOOK - -H "Authorization: Bearer $TA"
echo "## POST /api/v1/admin tokensiz (S7 holati)" >> "$OUT/$F"; req $F POST /api/v1/admin '{}'
stop; restore src/api/book/book.controller.ts

# ---------- 23 T2: Entity'da @Column o'rniga @IsNumber ----------
dbq "DELETE FROM cars;" >/dev/null
bak src/core/entity/car.entity.ts
python3 - <<'EOF'
p='src/core/entity/car.entity.ts'; s=open(p).read()
s=s.replace("import { Column, Entity } from 'typeorm';","import { Column, Entity } from 'typeorm';\nimport { IsNumber } from 'class-validator';")
s=s.replace("  @Column()\n  price: number;","  @IsNumber()\n  price: number;")
open(p,'w').write(s)
EOF
F=23-entity-isnumber.txt; : > "$OUT/$F"; start 23-entity-isnumber.log
{ echo "--- server ishga tushdimi: $(grep -c 'successfully started' "$OUT/23-entity-isnumber.log")"; echo "--- \\d cars (price ustuni bormi?):"; dbq "\d cars" | grep -E "price|brand|model"; echo; } >> "$OUT/$F"
req $F POST /api/v1/car '{"brand":"Chevrolet","model":"Malibu","price":250}'
{ echo "--- bazada:"; dbq "select brand, model from cars;"; echo "--- query log:"; clean < "$OUT/23-entity-isnumber.log" | grep -m1 -i "query:.*INSERT\|QueryFailedError"; echo; } >> "$OUT/$F"
stop; restore src/core/entity/car.entity.ts; dbq "DELETE FROM cars;" >/dev/null
start 23b-entity-restored.log; { echo "--- tiklangandan keyin \\d cars price:"; dbq "\d cars" | grep price; } >> "$OUT/$F"; stop

# ---------- 24 uyga vazifa: bor jadvalga NOT NULL brandId (ManyToOne) ----------
: > "$OUT/24-brand-fk.txt"; start 24-brand-prep.log; req 24-brand-fk.txt POST /api/v1/car '{"brand":"Kia","model":"K5","price":320}'; stop
bak src/core/entity/car.entity.ts src/core/index.ts
cat > src/core/entity/brand.entity.ts <<'EOT'
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity('brands')
export class BrandEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  country: string;
}
EOT
echo "export * from './entity/brand.entity';" >> src/core/index.ts
python3 - <<'EOF'
p='src/core/entity/car.entity.ts'; s=open(p).read()
s=s.replace("import { Column, Entity } from 'typeorm';","import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';\nimport { BrandEntity } from './brand.entity';")
s=s.replace("  @Column({ default: true })\n  is_available: boolean;\n}","  @Column({ default: true })\n  is_available: boolean;\n\n  @ManyToOne(() => BrandEntity, { onDelete: 'CASCADE' })\n  @JoinColumn({ name: 'brandId' })\n  brand_rel: BrandEntity;\n\n  @Column()\n  brandId: string;\n}")
open(p,'w').write(s)
EOF
F=24-brand-fk.txt; start 24-brand-notnull.log
{ echo "--- cars jadvalida 1 satr bor edi; brandId NOT NULL qo'shildi. Server: successfully started = $(grep -c 'successfully started' "$OUT/24-brand-notnull.log")"; clean < "$OUT/24-brand-notnull.log" | grep -v "^\s*at " | grep -m3 -i "QueryFailedError\|contains null\|error:"; echo; } >> "$OUT/$F"
stop
sed -i "s/  @Column()\n  brandId: string;//" src/core/entity/car.entity.ts
python3 - <<'EOF'
p='src/core/entity/car.entity.ts'; s=open(p).read()
s=s.replace("  @Column()\n  brandId: string;","  @Column({ nullable: true })\n  brandId: string;")
open(p,'w').write(s)
EOF
start 24-brand-nullable.log
{ echo "--- nullable: true bilan: successfully started = $(grep -c 'successfully started' "$OUT/24-brand-nullable.log")"; dbq "\d cars" | grep -i brand; echo; } >> "$OUT/$F"
stop; restore src/core/entity/car.entity.ts src/core/index.ts; rm -f src/core/entity/brand.entity.ts
dbq "ALTER TABLE cars DROP COLUMN IF EXISTS \"brandId\"; DROP TABLE IF EXISTS brands;" >/dev/null

# ---------- 25 TS xato matnlari (kompilyatsiya) ----------
if [ "${SKIP25:-0}" != 1 ]; then
F=25-ts-errors.txt; : > "$OUT/$F"
bak src/api/car/car.service.ts src/api/car/car.controller.ts src/core/index.ts
python3 -c "
p='src/api/car/car.service.ts'; s=open(p).read(); open(p,'w').write(s.replace('    super(carRepo);\n',''))"
{ echo "## a) super(carRepo) olib tashlandi:"; timeout 60 npx nest build 2>&1 | clean | grep -B1 -A3 "error TS" | head -8; echo; } >> "$OUT/$F"; restore src/api/car/car.service.ts
python3 -c "
p='src/api/car/car.controller.ts'; s=open(p).read(); open(p,'w').write(s.replace('this.carService.findOneById(id)','this.carService.findOne(id)'))"
{ echo "## b) Controller'da findOne (BaseService'da yo'q):"; timeout 60 npx nest build 2>&1 | clean | grep -B1 -A3 "error TS" | head -8; echo; } >> "$OUT/$F"; restore src/api/car/car.controller.ts
python3 -c "
p='src/core/index.ts'; s=open(p).read(); open(p,'w').write(s.replace(\"export * from './entity/car.entity';\n\",''))"
{ echo "## c) core/index.ts'da car export yo'q:"; timeout 60 npx nest build 2>&1 | clean | grep -B1 -A3 "error TS" | head -10; echo; } >> "$OUT/$F"; restore src/core/index.ts
fi

# ---------- 26 PartialType @nestjs/mapped-types'dan → Swagger ----------
F=26-mapped-types.txt; : > "$OUT/$F"
start 26a-swagger-partial.log
{ echo "## a) PartialType @nestjs/swagger (hozirgi) — UpdateCarDto Swagger'da:"; curl -s localhost:3000/api/v1-json | python3 -c 'import sys,json; d=json.load(sys.stdin); s=d["components"]["schemas"].get("UpdateCarDto"); print(json.dumps(s)[:400] if s else "SCHEMA YOQ")
b=d["paths"]["/api/v1/car/{id}"]["patch"].get("requestBody"); print("PATCH requestBody:", json.dumps(b)[:200] if b else "YOQ")'; echo; } >> "$OUT/$F"; stop
bak src/api/car/dto/update-car.dto.ts
sed -i "s#from '@nestjs/swagger'#from '@nestjs/mapped-types'#" src/api/car/dto/update-car.dto.ts
start 26b-mapped-partial.log
{ echo "## b) PartialType @nestjs/mapped-types — UpdateCarDto Swagger'da:"; curl -s localhost:3000/api/v1-json | python3 -c 'import sys,json; d=json.load(sys.stdin); s=d["components"]["schemas"].get("UpdateCarDto"); print(json.dumps(s)[:400] if s else "SCHEMA YOQ")
b=d["paths"]["/api/v1/car/{id}"]["patch"].get("requestBody"); print("PATCH requestBody:", json.dumps(b)[:200] if b else "YOQ")'; echo; } >> "$OUT/$F"
CAR=$(curl -s localhost:3000/api/v1/car | python3 -c 'import sys,json; d=json.load(sys.stdin)["data"]; print(d[0]["id"] if d else "")')
[ -n "$CAR" ] && req $F PATCH /api/v1/car/$CAR '{"price":300}'
stop; restore src/api/car/dto/update-car.dto.ts
echo "TUGADI (extra2)"
