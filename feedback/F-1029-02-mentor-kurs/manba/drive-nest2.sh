#!/usr/bin/env bash
# drive-nest2.sh — Nest-2 mentor darsi (M10, M22-3): o'quvchi reposini (IntroNestArxitechture) GitHub'dan
# yangi papkaga clone qilib, lokal PostgreSQL 17 da haqiqiy ishga tushiradi va darsda ko'rsatiladigan
# HAR holatni yozib oladi. Natijalar: <out>/NN-*.  Parol hech qaysi chiqishga yozilmaydi.
# Ishlatish: bash drive-nest2.sh <ish-papka> <out-papka>
set -u
WORK=${1:?ish papka}; OUT=${2:?out papka}
REPO=https://github.com/Azizbekcrypto/IntroNestArxitechture.git
PG_PASS=$(sed -nE 's#^DEV_DB_URL=postgres://postgres:([^@]*)@.*#\1#p' /home/kali/Desktop/papku/IntroNestArxitechture/.env)
DB=nest2_mentor; DBP=nest2_prod
PGADMIN="postgres://postgres:${PG_PASS}@localhost:5432/postgres"
mkdir -p "$WORK" "$OUT"
J="$OUT/_jurnal.log"; : > "$J"
log(){ echo "[$(date +%H:%M:%S)] $*" | tee -a "$J"; }

SRV_PID=""
kill_srv(){ pkill -f "node dist/main" 2>/dev/null; fuser -k 3000/tcp 2>/dev/null; [ -n "$SRV_PID" ] && { kill "$SRV_PID" 2>/dev/null; wait "$SRV_PID" 2>/dev/null; }; SRV_PID=""; sleep 1; true; }
start_srv(){ # $1 = server-log fayli ; .env joyida bo'lishi kerak. 0 — port ochildi, 1 — jarayon tugadi (crash), 2 — kutish tugadi
  local f="$OUT/$1"; : > "$f"
  ( cd "$WORK/IntroNestArxitechture" && npx nest start >> "$f" 2>&1 ) &
  SRV_PID=$!
  for _ in $(seq 1 160); do
    curl -s -o /dev/null localhost:3000/api/v1 && return 0
    kill -0 "$SRV_PID" 2>/dev/null || { wait "$SRV_PID" 2>/dev/null; SRV_PID=""; return 1; }
    sleep 0.5
  done
  return 2
}
req(){ # req <fayl> <METHOD> <path> [body|-] [qo'shimcha curl argumentlari...]
  local f="$OUT/$1" m=$2 p=$3 b=${4:-}; shift 3; [ $# -gt 0 ] && shift; [ "$b" = - ] && b=""
  { echo "### $m $p${b:+   body: $b}"
    if [ -n "$b" ]; then curl -s -X "$m" "localhost:3000$p" -H 'Content-Type: application/json' -d "$b" "$@" -w '\n-- status: %{http_code}\n'
    else curl -s -X "$m" "localhost:3000$p" "$@" -w '\n-- status: %{http_code}\n'; fi
    echo; } >> "$f" 2>&1
}
# psql: bu kompyuterdagi eski bazalar «collation version mismatch» OGOHLANTIRISHI beradi — faqat shu uch qator filtrlanadi (ERROR qoladi).
# CREATE DATABASE template1 dan yiqiladi (template1 ham mismatch) — TEMPLATE template0 bilan (31.10 topilmasi; o'quvchi kompyuteriga taalluqli emas).
PGF='^WARNING:  database .* collation version mismatch\|^DETAIL:  The database was created using collation\|^HINT:  Rebuild all objects in this database'
dbq(){ psql "postgres://postgres:${PG_PASS}@localhost:5432/$1" -c "$2" 2>&1 | grep -v "$PGF"; }
dbreset(){ psql "$PGADMIN" -q -c "DROP DATABASE IF EXISTS $1 WITH (FORCE);" 2>&1 | grep -v "$PGF"; }
dbcreate(){ psql "$PGADMIN" -q -c "CREATE DATABASE $1 TEMPLATE template0;" 2>&1 | grep -v "$PGF"; }
write_env(){ # $1 NODE_ENV · $2 superadmin to'ldirilsinmi (1/0) · $3 dev baza nomi
  local ne=$1 sa=$2 db=$3
  { echo "PORT=3000"; echo; echo "NODE_ENV=$ne"; echo; echo "# DB"
    echo "DEV_DB_URL=postgres://postgres:${PG_PASS}@localhost:5432/${db}"
    echo "PROD_DB_URL=postgres://postgres:${PG_PASS}@localhost:5432/${DBP}"; echo
    if [ "$sa" = 1 ]; then cat <<'EOT'
# JWT
Access_Token_Key=mentor-kurs-access-key
Access_Token_Time=24h
Refresh_Token_Key=mentor-kurs-refresh-key
Refresh_Token_Time=30d

# Superadmin
USER_NAME=superadmin
EMAIL=super@admin.uz
FULL_NAME=Super Admin
PHONE=+998901234567
PASSWORD=Superadmin1!
EOT
    else sed -n '/^# JWT/,$p' .env.example; fi; } > .env
}
token_of(){ curl -s -X POST localhost:3000/api/v1/admin/signin -H 'Content-Type: application/json' -d "{\"username\":\"$1\",\"password\":\"$2\"}" | python3 -c 'import sys,json
try: print(json.load(sys.stdin)["data"]["token"])
except Exception as e: print("")'; }
srvtail(){ { echo "--- server log (oxirgi $2 satr):"; tail -n "$2" "$OUT/$1"; echo; } >> "$OUT/$3"; }

trap 'kill_srv' EXIT
cd "$WORK"
kill_srv

# ---------- 00 versiyalar ----------
{ echo "node $(node --version)"; echo "npm $(npm --version)"; echo "nest CLI (global) $(nest --version 2>/dev/null)"; psql --version; pg_lsclusters 2>/dev/null; date; } > "$OUT/00-versions.txt"
log "00 versiyalar yozildi"

# ---------- 01 clone ----------
rm -rf IntroNestArxitechture
git clone "$REPO" > "$OUT/01-clone.log" 2>&1
cd IntroNestArxitechture
{ git log -1 --format='HEAD %h · %ad · %s' --date=short; echo; echo "--- .env.example:"; cat .env.example; echo; echo "--- fayllar:"; find src -type f | sort; } >> "$OUT/01-clone.log"
log "01 clone: $(git log -1 --format=%h)"

# ---------- 02 npm install ----------
S=$(date +%s); npm install > "$OUT/02-npm-install.log" 2>&1; E=$(date +%s)
{ echo; echo "--- davomiyligi: $((E-S)) s"; echo "--- class-validator: $(node -p "require('./node_modules/class-validator/package.json').version" 2>/dev/null || echo MAVJUD-EMAS)"; echo "--- typeorm: $(node -p "require('./node_modules/typeorm/package.json').version")"; echo "--- @nestjs/core: $(node -p "require('./node_modules/@nestjs/core/package.json').version")"; } >> "$OUT/02-npm-install.log"
log "02 npm install $((E-S)) s"

# ---------- 03 class-validator yo'q (iyundagi node_modules holati) ----------
mv node_modules/class-validator ../cv-away
start_srv 03-no-class-validator.log; log "03 class-validator yo'q → $?"
kill_srv; mv ../cv-away node_modules/class-validator

# ---------- 04 .env yo'q ----------
rm -f .env
start_srv 04-no-env.log; log "04 .env yo'q → $?"
kill_srv

# ---------- 05 .env bor (namuna, superadmin bo'sh), baza yaratilmagan ----------
dbreset $DB >/dev/null; dbreset $DBP >/dev/null
write_env dev 0 $DB
start_srv 05-env-no-db.log; log "05 baza yo'q → $?"
kill_srv

# ---------- 06 createdb → birinchi muvaffaqiyatli start (superadmin maydonlari BO'SH) ----------
log "06 createdb: $(dbcreate $DB | tr -d '\n')"
start_srv 06-first-start-blank-superadmin.log; R=$?; log "06 birinchi start (superadmin bo'sh) → $R"
F=06-requests.txt; : > "$OUT/$F"
{ echo "--- admins jadvali (superadmin .env'da bo'sh edi):"; dbq $DB "select username, full_name, phone_number, role, is_active from admins;"; echo; } >> "$OUT/$F"
{ echo "--- Swagger sahifasi sarlavhasi:"; curl -s localhost:3000/api/v1 | grep -o '<title>[^<]*</title>'; echo; } >> "$OUT/$F"
{ echo "--- Swagger JSON — route'lar:"; curl -s localhost:3000/api/v1-json | python3 -c 'import sys,json
d=json.load(sys.stdin)
print("title:",d["info"]["title"],"| version:",d["info"]["version"])
for p,ms in d["paths"].items():
  for m in ms: print(f"  {m.upper():6} {p}")'; echo; } >> "$OUT/$F"
req $F GET /admin
req $F GET /api/v1/admin
req $F POST /api/v1/admin/signin '{"username":"undefined","password":"undefined"}'
req $F POST /api/v1/admin/signin '{"username":"superadmin","password":"Superadmin1!"}'
kill_srv

# ---------- 07 superadmin to'ldirilgan .env → signin → token ----------
dbreset $DB >/dev/null; log "07 createdb: $(dbcreate $DB | tr -d '\n')"
write_env dev 1 $DB
start_srv 07-start-ok.log; log "07 start (superadmin to'ldirilgan) → $?"
F=07-signin.txt; : > "$OUT/$F"
{ echo "--- admins jadvali:"; dbq $DB "select username, full_name, role, is_active, created_at from admins;"; echo; echo "--- jadval tuzilishi (\\d admins):"; dbq $DB "\d admins"; echo; } >> "$OUT/$F"
req $F POST /api/v1/admin/signin '{"username":"superadmin","password":"Superadmin1!"}' -i
req $F POST /api/v1/admin/signin '{"username":"superadmin","password":"notogri"}'
req $F POST /api/v1/admin/signin '{"username":"kimdir","password":"Superadmin1!"}'
req $F POST /api/v1/admin/signin '{"username":"superadmin"}'
TOKEN=$(token_of superadmin 'Superadmin1!'); echo "token uzunligi: ${#TOKEN}" >> "$OUT/$F"
SUPER_ID=$(dbq $DB "select id from admins where role='superAdmin' limit 1" | sed -n 3p | tr -d ' ')
echo "superadmin id: $SUPER_ID" >> "$OUT/$F"

# ---------- 08 token bilan so'rovlar ----------
F=08-auth-requests.txt; : > "$OUT/$F"
A=(-H "Authorization: Bearer $TOKEN")
req $F GET /api/v1/admin - "${A[@]}"
req $F GET '/api/v1/admin?page=1&limit=5' - "${A[@]}"
req $F GET /api/v1/admin/all/admin - "${A[@]}"
req $F GET "/api/v1/admin/$SUPER_ID" - "${A[@]}"
req $F GET /api/v1/admin/11111111-2222-3333-4444-555555555555 - "${A[@]}"
req $F GET /api/v1/admin/abc - "${A[@]}"
srvtail 07-start-ok.log 25 $F
req $F GET /api/v1/admin/all/admin - -H "Authorization: Bearer notogri.token.qiymat"
req $F GET /api/v1/admin/all/admin - -H "Authorization: $TOKEN"
log "08 auth so'rovlar yozildi"

# ---------- 09 ValidationPipe: DTO xatolari (admin) ----------
F=09-validation.txt; : > "$OUT/$F"
req $F POST /api/v1/admin '{}' "${A[@]}"
req $F POST /api/v1/admin '{"username":"ali","phone_number":"+998901112233","full_name":"Ali Valiyev","password":"123"}' "${A[@]}"
req $F POST /api/v1/admin '{"username":"ali","phone_number":"+998901112233","full_name":"Ali Valiyev","password":"Developer1!","color":"qizil"}' "${A[@]}"
req $F POST /api/v1/admin '{"username":"ali","phone_number":"+998901112233","full_name":"Ali Valiyev","password":"Developer1!"}' "${A[@]}"
req $F POST /api/v1/admin '{"username":"ali","phone_number":"+998901112233","full_name":"Ali Valiyev","password":"Developer1!"}' "${A[@]}"
req $F POST /api/v1/admin '{"username":"vali","phone_number":"+998901112233","full_name":"Vali Aliyev","password":"Developer1!"}' "${A[@]}"
{ echo "--- admins jadvali endi:"; dbq $DB "select username, role, is_active from admins order by created_at;"; echo; } >> "$OUT/$F"
log "09 validatsiya yozildi"

# ---------- 10 RolesGuard: oddiy admin ----------
F=10-roles.txt; : > "$OUT/$F"
T2=$(token_of ali 'Developer1!'); echo "ali token uzunligi: ${#T2}" >> "$OUT/$F"
ALI_ID=$(dbq $DB "select id from admins where username='ali'" | sed -n 3p | tr -d ' '); echo "ali id: $ALI_ID" >> "$OUT/$F"
B=(-H "Authorization: Bearer $T2")
req $F POST /api/v1/admin '{"username":"hasan","phone_number":"+998901113344","full_name":"Hasan","password":"Developer1!"}' "${B[@]}"
req $F GET /api/v1/admin - "${B[@]}"
req $F GET "/api/v1/admin/$ALI_ID" - "${B[@]}"
req $F GET "/api/v1/admin/$SUPER_ID" - "${B[@]}"
req $F PATCH "/api/v1/admin/$ALI_ID" '{"full_name":"Ali Valiyev (yangi)"}' "${B[@]}"
req $F DELETE "/api/v1/admin/$ALI_ID" - "${B[@]}"
req $F POST /api/v1/admin/token -
log "10 rollar yozildi"
kill_srv

# ---------- 11 cars resursi — o'quvchi darsi m4a-03 ning 5 qadami ----------
mkdir -p src/api/car/dto
cat > src/core/entity/car.entity.ts <<'EOT'
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity('cars')
export class CarEntity extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  price: number;

  @Column({ default: true })
  is_available: boolean;
}
EOT
cat >> src/core/index.ts <<'EOT'
export * from './entity/car.entity';
EOT
cat > src/api/car/dto/create-car.dto.ts <<'EOT'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({ example: 'Chevrolet' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'Malibu' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 250 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}
EOT
cat > src/api/car/dto/update-car.dto.ts <<'EOT'
import { PartialType } from '@nestjs/swagger';
import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {}
EOT
cat > src/api/car/car.service.ts <<'EOT'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CarEntity } from 'src/core';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService extends BaseService<CreateCarDto, UpdateCarDto, CarEntity> {
  constructor(
    @InjectRepository(CarEntity) private readonly carRepo: Repository<CarEntity>,
  ) {
    super(carRepo);
  }
}
EOT
cat > src/api/car/car.controller.ts <<'EOT'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Body() dto: CreateCarDto) {
    return this.carService.create(dto);
  }

  @Get()
  findAll() {
    return this.carService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.carService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(id);
  }
}
EOT
cat > src/api/car/car.module.ts <<'EOT'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarEntity } from 'src/core';
import { CarService } from './car.service';
import { CarController } from './car.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CarEntity])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
EOT
python3 - <<'EOF'
p='src/api/app.module.ts'; s=open(p).read()
s=s.replace("import { AuthModule } from './auth/auth.module';","import { AuthModule } from './auth/auth.module';\nimport { CarModule } from './car/car.module';")
s=s.replace("    AuthModule,\n","    AuthModule,\n    CarModule,\n")
open(p,'w').write(s)
EOF
cp -r src/api/car "$OUT/src-car"; cp src/core/entity/car.entity.ts "$OUT/src-car/"; cp src/core/index.ts "$OUT/src-car/core-index.ts"; cp src/api/app.module.ts "$OUT/src-car/app.module.ts"
start_srv 11-cars-start.log; log "11 cars start → $?"
F=11-cars-requests.txt; : > "$OUT/$F"
{ echo "--- jadvallar (\\dt):"; dbq $DB "\dt"; echo; echo "--- cars tuzilishi (\\d cars) — synchronize o'zi yaratdi:"; dbq $DB "\d cars"; echo; } >> "$OUT/$F"
{ echo "--- Swagger JSON — car route'lari:"; curl -s localhost:3000/api/v1-json | python3 -c 'import sys,json
d=json.load(sys.stdin)
for p,ms in d["paths"].items():
  if "car" in p:
    for m in ms: print(f"  {m.upper():6} {p}")'; echo; } >> "$OUT/$F"
req $F POST /api/v1/car '{"brand":"Chevrolet","model":"Malibu","price":250}'
req $F POST /api/v1/car '{"brand":"Kia","model":"K5","price":320,"is_available":false}'
CAR_ID=$(curl -s localhost:3000/api/v1/car | python3 -c 'import sys,json; print(json.load(sys.stdin)["data"][0]["id"])')
echo "birinchi mashina id: $CAR_ID" >> "$OUT/$F"
req $F GET /api/v1/car
req $F GET "/api/v1/car/$CAR_ID"
req $F PATCH "/api/v1/car/$CAR_ID" '{"price":240}'
req $F GET /api/v1/car/11111111-2222-3333-4444-555555555555
req $F GET /api/v1/car/1
srvtail 11-cars-start.log 20 $F
req $F POST /api/v1/car '{}'
req $F POST /api/v1/car '{"brand":"Chevrolet","model":"Cobalt","price":"arzon"}'
req $F POST /api/v1/car '{"brand":"Chevrolet","model":"Cobalt","price":"145"}'
req $F POST /api/v1/car '{"brand":"Chevrolet","model":"Cobalt","price":145,"color":"oq"}'
req $F GET /car
req $F GET /cars
req $F DELETE "/api/v1/car/$CAR_ID"
req $F GET "/api/v1/car/$CAR_ID"
{ echo "--- cars jadvali (psql):"; dbq $DB "select brand, model, price, is_available, left(id::text,8) as id8 from cars;"; echo; } >> "$OUT/$F"
kill_srv

# ---------- 12 buzamiz 1: forFeature yo'q ----------
cp src/api/car/car.module.ts "$WORK/car.module.bak"
sed -i 's#  imports: \[TypeOrmModule.forFeature(\[CarEntity\])\],#  imports: [],#' src/api/car/car.module.ts
start_srv 12-break-forfeature.log; log "12 forFeature yo'q → $?"
kill_srv; cp "$WORK/car.module.bak" src/api/car/car.module.ts

# ---------- 13 buzamiz 2: CarModule AppModule imports'da yo'q ----------
cp src/api/app.module.ts "$WORK/app.module.bak"
sed -i '/^    CarModule,$/d' src/api/app.module.ts
start_srv 13-break-appmodule.log; log "13 AppModule'da CarModule yo'q → $?"
F=13-break-appmodule.txt; : > "$OUT/$F"
{ echo "--- terminalda car Mapped satrlari soni: $(grep -c 'api/v1/car' "$OUT/13-break-appmodule.log")"; echo; } >> "$OUT/$F"
req $F GET /api/v1/car
req $F GET /api/v1/admin/all/admin - "${A[@]}"
kill_srv; cp "$WORK/app.module.bak" src/api/app.module.ts

# ---------- 14 buzamiz 3: NODE_ENV noto'g'ri (prod) ----------
write_env prod 1 $DB
start_srv 14-nodeenv-prod-no-db.log; log "14a NODE_ENV=prod, db_prod yo'q → $?"
kill_srv
dbcreate $DBP
start_srv 14-nodeenv-prod-empty-db.log; log "14b NODE_ENV=prod, bo'sh baza (synchronize false) → $?"
F=14-nodeenv.txt; : > "$OUT/$F"
{ echo "--- $DBP jadvallari:"; dbq $DBP "\dt"; echo; } >> "$OUT/$F"
req $F GET /api/v1/car
kill_srv
write_env dev 1 $DB

# ---------- 15 port band ----------
start_srv 15-port-busy-first.log; log "15 birinchi server → $?"
( cd "$WORK/IntroNestArxitechture" && timeout 20 node dist/main.js > "$OUT/15-port-busy-second.log" 2>&1 )
kill_srv

# ---------- 16 @ManyToOne: Category + Book (o'quvchi darsi m4a-04) ----------
mkdir -p src/api/category/dto src/api/book/dto
cat > src/core/entity/category.entity.ts <<'EOT'
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;
}
EOT
cat > src/core/entity/book.entity.ts <<'EOT'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { CategoryEntity } from './category.entity';

@Entity('books')
export class BookEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  price: number;

  @Column({ default: false })
  is_featured: boolean;

  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column()
  categoryId: string;
}
EOT
cat >> src/core/index.ts <<'EOT'
export * from './entity/category.entity';
export * from './entity/book.entity';
EOT
cat > src/api/category/dto/create-category.dto.ts <<'EOT'
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Detektiv' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
EOT
cat > src/api/category/dto/update-category.dto.ts <<'EOT'
import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
EOT
cat > src/api/category/category.service.ts <<'EOT'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CategoryEntity } from 'src/core';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService extends BaseService<CreateCategoryDto, UpdateCategoryDto, CategoryEntity> {
  constructor(@InjectRepository(CategoryEntity) private readonly repo: Repository<CategoryEntity>) {
    super(repo);
  }
}
EOT
cat > src/api/category/category.controller.ts <<'EOT'
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
EOT
cat > src/api/category/category.module.ts <<'EOT'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/core';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
EOT
cat > src/api/book/dto/create-book.dto.ts <<'EOT'
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Sherlok Holms' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Artur Konan Doyl' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'uuid — mavjud kategoriya' })
  @IsUUID()
  categoryId: string;
}
EOT
cat > src/api/book/dto/update-book.dto.ts <<'EOT'
import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
EOT
cat > src/api/book/book.service.ts <<'EOT'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/infrastructure/base/base.service';
import { BookEntity } from 'src/core';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService extends BaseService<CreateBookDto, UpdateBookDto, BookEntity> {
  constructor(@InjectRepository(BookEntity) private readonly repo: Repository<BookEntity>) {
    super(repo);
  }
}
EOT
cat > src/api/book/book.controller.ts <<'EOT'
import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Get()
  findAll() {
    return this.bookService.findAll({ relations: { category: true } });
  }
}
EOT
cat > src/api/book/book.module.ts <<'EOT'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/core';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
EOT
python3 - <<'EOF'
p='src/api/app.module.ts'; s=open(p).read()
s=s.replace("import { CarModule } from './car/car.module';","import { CarModule } from './car/car.module';\nimport { CategoryModule } from './category/category.module';\nimport { BookModule } from './book/book.module';")
s=s.replace("    CarModule,\n","    CarModule,\n    CategoryModule,\n    BookModule,\n")
open(p,'w').write(s)
EOF
mkdir -p "$OUT/src-book"; cp -r src/api/category src/api/book "$OUT/src-book/"; cp src/core/entity/category.entity.ts src/core/entity/book.entity.ts "$OUT/src-book/"
start_srv 16-book-start.log; log "16 Category+Book start → $?"
F=16-book-requests.txt; : > "$OUT/$F"
{ echo "--- books tuzilishi (\\d books):"; dbq $DB "\d books"; echo; } >> "$OUT/$F"
req $F POST /api/v1/category '{"name":"Detektiv"}'
CAT_ID=$(curl -s localhost:3000/api/v1/category | python3 -c 'import sys,json; print(json.load(sys.stdin)["data"][0]["id"])')
echo "kategoriya id: $CAT_ID" >> "$OUT/$F"
req $F POST /api/v1/book "{\"title\":\"Sherlok Holms\",\"author\":\"Artur Konan Doyl\",\"price\":45000,\"categoryId\":\"$CAT_ID\"}"
req $F GET /api/v1/book
req $F POST /api/v1/book '{"title":"Kitob","author":"Muallif","price":1000,"categoryId":"11111111-2222-3333-4444-555555555555"}'
srvtail 16-book-start.log 20 $F
req $F POST /api/v1/book '{"title":"Kitob","author":"Muallif","price":1000,"categoryId":"1"}'
kill_srv

# ---------- 17 yakuniy holat ----------
{ git status --short; echo; echo "--- qo'shilgan fayllar:"; git status --short | awk '{print $2}'; echo; echo "--- bazadagi jadvallar:"; dbq $DB "\dt"; } > "$OUT/17-git-status.txt"
dbreset $DBP >/dev/null
log "TUGADI — natijalar: $OUT"
