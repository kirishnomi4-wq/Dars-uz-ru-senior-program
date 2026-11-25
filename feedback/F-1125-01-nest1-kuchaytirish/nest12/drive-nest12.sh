#!/bin/bash
# F-1125-01 · Mentor Nest-1 darsidagi BARCHA holatlarni Nest 12 da haqiqatda yurgizadi (M10 — halol chiqish).
# Asos: F-1029-02 manba/drive.sh (00–08) + drive2.sh (10–14) + drive3.sh (19–21); kod — o'sha skriptlardagi dars kodi.
# 15–18 (baza ulanish xatolari) yurgizilmaydi: ular o'quvchi loyihasiga tegishli (IntroNestArxitechture — Nest 11 ga qotirilgan).
# Ishlatish: bash drive-nest12.sh <cars-api papkasi> <chiqish papkasi> <cjs|esm> [port]
set -u
P="${1:?loyiha papkasi}"; OUT="${2:?chiqish papkasi}"; V="${3:?cjs|esm}"; PORT="${4:-3000}"
HERE="$(cd "$(dirname "$0")" && pwd)"
EXT=""; [ "$V" = esm ] && EXT=".js"
mkdir -p "$OUT"; cd "$P" || exit 1
BAK="$(mktemp -d)"
run() { # $1=nom, keyin so'rovlar: "GET /yo'l" | "POST /yo'l JSON" | "POST /yo'l NOBODY"
  local name=$1; shift
  : > "$OUT/$name.curl"; rm -f "$OUT/$name.log"
  fuser -k $PORT/tcp >/dev/null 2>&1; sleep 0.5
  PORT=$PORT setsid nice -n 19 npx nest start > "$OUT/$name.log" 2>&1 &
  local pg=$!
  for i in $(seq 1 300); do
    grep -q -E "successfully started|error TS|Found [0-9]+ error" "$OUT/$name.log" && break
    kill -0 $pg 2>/dev/null || break
    sleep 0.5
  done
  sleep 1.5
  for req in "$@"; do
    read -r m u body <<< "$req"
    echo "### $m $u ${body:-}" >> "$OUT/$name.curl"
    if [ "$m" = POST ] && [ "${body:-}" = NOBODY ]; then curl -s -i -m 5 -X POST "http://localhost:$PORT$u" >> "$OUT/$name.curl" 2>&1
    elif [ "$m" = POST ]; then curl -s -i -m 5 -X POST -H 'Content-Type: application/json' -d "${body:-}" "http://localhost:$PORT$u" >> "$OUT/$name.curl" 2>&1
    else curl -s -i -m 5 "http://localhost:$PORT$u" >> "$OUT/$name.curl" 2>&1; fi
    echo >> "$OUT/$name.curl"
  done
  sleep 1
  kill -- -$pg >/dev/null 2>&1; fuser -k $PORT/tcp >/dev/null 2>&1; sleep 0.5
  sed -i 's/\x1b\[[0-9;]*m//g' "$OUT/$name.log"; echo "== $name tayyor ($(grep -c . "$OUT/$name.log") qator)"
}
ed() { python3 - "$@"; }   # ed <fayl> <<PY ... (sys.argv[1] = fayl)

{ echo "node $(node --version)"; echo "nest $(npx nest --version 2>/dev/null)"; node -e "console.log('@nestjs/core', require('./node_modules/@nestjs/core/package.json').version)"; node -e "console.log('typescript', require('./node_modules/typescript/package.json').version)"; echo "variant $V"; } > "$OUT/10-versions.txt"
find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' | sort > "$OUT/00-daraxt.txt"
mkdir -p "$OUT/00-fayllar"; cp src/main.ts src/app.module.ts src/app.controller.ts src/app.service.ts package.json tsconfig.json "$OUT/00-fayllar/"

# 0. toza loyiha
run 00-fresh "GET /" "GET /cars"

# 1. CLI bilan cars moduli — soxta terminalda (mentor ko'radigan chiqish; savol chiqsa, shu yerda ko'rinadi)
: > "$OUT/01-cli.txt"
for c in "g module cars" "g controller cars --no-spec" "g service cars --no-spec"; do
  echo "\$ nest $c" >> "$OUT/01-cli.txt"
  python3 "$HERE/pty-run.py" "$OUT/01-cli.raw" 90 '[]' -- npx nest $c 2>> "$OUT/01-cli.err"
  sed 's/\x1b\[[0-9;?]*[A-Za-z]//g; s/\r//g' "$OUT/01-cli.raw" >> "$OUT/01-cli.txt"
done
rm -f "$OUT/01-cli.raw"
cp src/cars/cars.module.ts "$OUT/01-cars.module.ts"; cp src/cars/cars.controller.ts "$OUT/01-cars.controller.ts"; cp src/cars/cars.service.ts "$OUT/01-cars.service.ts"; cp src/app.module.ts "$OUT/01-app.module.ts"
run 01-generated "GET /cars"

# 2. dars kodi: Service (ro'yxat + 3 metod), Controller (GET, GET :id, POST)
svc() { cat > src/cars/cars.service.ts <<'TS'
import { Injectable, NotFoundException } from '@nestjs/common';

export interface Car {
  id: number;
  brand: string;
  model: string;
  price: number;
}

@Injectable()
export class CarsService {
  private cars: Car[] = [
    { id: 1, brand: 'Chevrolet', model: 'Malibu', price: 250 },
    { id: 2, brand: 'Kia', model: 'K5', price: 320 },
  ];

  findAll(): Car[] {
    return this.cars;
  }

  findOne(id: number): Car {
    const car = this.cars.find((c) => c.id === id);
    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found`);
    }
    return car;
  }

  create(data: Omit<Car, 'id'>): Car {
    const car: Car = { id: this.cars.length + 1, ...data };
    this.cars.push(car);
    return car;
  }
}
TS
}
ctrl() { cat > src/cars/cars.controller.ts <<TS
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CarsService } from './cars.service$1';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { brand: string; model: string; price: number }) {
    return this.carsService.create(body);
  }
}
TS
}
svc
if [ "$V" = esm ]; then   # dars kodi AYNAN (kengaytmasiz import) — ESM loyihada nima bo'ladi?
  ctrl ""; cp src/cars/cars.controller.ts "$OUT/02x-dars-kodi-aynan.cars.controller.ts"
  run 02x-dars-kodi-aynan "GET /cars"
fi
ctrl "$EXT"
run 02-working "GET /cars" "GET /cars/1" "GET /cars/99" 'POST /cars {"brand":"Chevrolet","model":"Cobalt","price":145}' "GET /cars"
cp src/cars/cars.module.ts "$BAK/cars.module.ts"; cp src/cars/cars.service.ts "$BAK/cars.service.ts"; cp src/cars/cars.controller.ts "$BAK/cars.controller.ts"; cp src/app.module.ts "$BAK/app.module.ts"; cp src/main.ts "$BAK/main.ts"
back() { cp "$BAK/cars.module.ts" src/cars/cars.module.ts; cp "$BAK/cars.service.ts" src/cars/cars.service.ts; cp "$BAK/cars.controller.ts" src/cars/cars.controller.ts; cp "$BAK/app.module.ts" src/app.module.ts; cp "$BAK/main.ts" src/main.ts; rm -f src/cars/pricing.service.ts; rm -rf src/cars/dto; }

# 3. Buzamiz 1: providers bo'sh
ed src/cars/cars.module.ts <<'PY'
import sys,re; p=sys.argv[1]; s=open(p).read(); n=re.sub(r"providers: \[CarsService\]", "providers: []", s); assert n!=s, "providers topilmadi"; open(p,'w').write(n)
PY
cp src/cars/cars.module.ts "$OUT/03-cars.module.ts"; run 03-break-provider "GET /cars"; back

# 4. Buzamiz 4a: @Injectable() yo'q (dependency'siz Service)
ed src/cars/cars.service.ts <<'PY'
import sys; p=sys.argv[1]; s=open(p).read(); n=s.replace("@Injectable()\nexport class CarsService", "export class CarsService"); assert n!=s; open(p,'w').write(n)
PY
run 04-break-injectable "GET /cars"; back

# 5. Buzamiz 2: AppModule imports'dan CarsModule olindi
ed src/app.module.ts <<'PY'
import sys,re; p=sys.argv[1]; s=open(p).read()
m=re.search(r"imports: \[(.*?)\]\s*,\s*\n\s*controllers", s, re.S); assert m, "imports topilmadi"
inner=re.sub(r"\s*CarsModule\s*,?", "", m.group(1)); n=s[:m.start(1)]+inner+s[m.end(1):]; assert n!=s; open(p,'w').write(n)
PY
cp src/app.module.ts "$OUT/05-app.module.ts"; run 05-break-import "GET /cars" "GET /"; back

# 6. Buzamiz 3: @Controller('cars') yo'q
ed src/cars/cars.controller.ts <<'PY'
import sys; p=sys.argv[1]; s=open(p).read(); n=s.replace("@Controller('cars')\n", ""); assert n!=s; open(p,'w').write(n)
PY
run 06-break-controller "GET /cars"; back

# 7. Oddiy Error (NotFoundException o'rniga)
ed src/cars/cars.service.ts <<'PY'
import sys; p=sys.argv[1]; s=open(p).read(); n=s.replace("throw new NotFoundException(`Car with id ${id} not found`);", "throw new Error('topilmadi');"); assert n!=s; open(p,'w').write(n)
PY
run 07-plain-error "GET /cars/99"; back

# 8. yakuniy holat · 9. /cars/abc (NaN)
run 08-final "GET /cars" "GET /cars/2"
run 09-abc "GET /cars/abc"

# 11. bo'sh POST
run 11-empty-post "POST /cars {}" "POST /cars NOBODY" "GET /cars"

# 12. @Injectable yo'q + konstruktorda dependency (PricingService)
cat > src/cars/pricing.service.ts <<'TS'
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {
  withDiscount(price: number): number {
    return price > 300 ? Math.round(price * 0.9) : price;
  }
}
TS
EXT="$EXT" ed src/cars/cars.module.ts <<'PY'
import sys,os; p=sys.argv[1]; e=os.environ['EXT']; s=open(p).read()
n=s.replace("providers: [CarsService]", "providers: [CarsService, PricingService]"); assert n!=s
i=n.rfind("import "); j=n.find("\n", i); n=n[:j+1]+f"import {{ PricingService }} from './pricing.service{e}';\n"+n[j+1:]; open(p,'w').write(n)
PY
EXT="$EXT" ed src/cars/cars.service.ts <<'PY'
import sys,os; p=sys.argv[1]; e=os.environ['EXT']; s=open(p).read()
s=s.replace("import { Injectable, NotFoundException } from '@nestjs/common';", "import { Injectable, NotFoundException } from '@nestjs/common';\nimport { PricingService } from './pricing.service"+e+"';")
n=s.replace("@Injectable()\nexport class CarsService {", "// @Injectable()  <- ATAYLAB O'CHIRILDI\nexport class CarsService {\n  constructor(private readonly pricing: PricingService) {}\n"); assert n!=s
n2=n.replace("  findAll(): Car[] {\n    return this.cars;\n  }", "  findAll(): Car[] {\n    return this.cars.map((c) => ({ ...c, price: this.pricing.withDiscount(c.price) }));\n  }"); assert n2!=n; open(p,'w').write(n2)
PY
cp src/cars/cars.service.ts "$OUT/12-cars.service.ts"; run 12-no-injectable-with-dep "GET /cars" "GET /cars/1"

# 13. @Injectable yo'q, lekin @Inject(PricingService) parametr-dekoratori bor
ed src/cars/cars.service.ts <<'PY'
import sys; p=sys.argv[1]; s=open(p).read()
s=s.replace("import { Injectable, NotFoundException }", "import { Inject, Injectable, NotFoundException }")
n=s.replace("constructor(private readonly pricing: PricingService) {}", "constructor(@Inject(PricingService) private readonly pricing: PricingService) {}"); assert n!=s; open(p,'w').write(n)
PY
cp src/cars/cars.service.ts "$OUT/13-cars.service.ts"; run 13-no-injectable-inject-param "GET /cars"

# 14. @Injectable qaytarildi (oddiy konstruktor) — nazorat
ed src/cars/cars.service.ts <<'PY'
import sys; p=sys.argv[1]; s=open(p).read()
s=s.replace("import { Inject, Injectable, NotFoundException }", "import { Injectable, NotFoundException }")
s=s.replace("constructor(@Inject(PricingService) private readonly pricing: PricingService) {}", "constructor(private readonly pricing: PricingService) {}")
n=s.replace("// @Injectable()  <- ATAYLAB O'CHIRILDI\nexport class CarsService {", "@Injectable()\nexport class CarsService {"); assert n!=s; open(p,'w').write(n)
PY
run 14-injectable-back "GET /cars"; back

# 20. ParseIntPipe
ed src/cars/cars.controller.ts <<'PY'
import sys; p=sys.argv[1]; s=open(p).read()
n=s.replace("import { Body, Controller, Get, Param, Post }", "import { Body, Controller, Get, Param, ParseIntPipe, Post }").replace("findOne(@Param('id') id: string) {", "findOne(@Param('id', ParseIntPipe) id: number) {").replace("return this.carsService.findOne(Number(id));", "return this.carsService.findOne(id);"); assert n.count("ParseIntPipe")==2; open(p,'w').write(n)
PY
cp src/cars/cars.controller.ts "$OUT/20-parseint.cars.controller.ts"; run 20-parseint "GET /cars/abc" "GET /cars/1"

# 21. DTO + global ValidationPipe
[ -d node_modules/class-validator ] || nice -n 19 npm i class-validator class-transformer > "$OUT/21-npm-install.txt" 2>&1
mkdir -p src/cars/dto
cat > src/cars/dto/create-car.dto.ts <<'TS'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  price: number;
}
TS
EXT="$EXT" ed src/cars/cars.controller.ts <<'PY'
import sys,os; p=sys.argv[1]; e=os.environ['EXT']; s=open(p).read()
n=s.replace(f"import {{ CarsService }} from './cars.service{e}';", f"import {{ CarsService }} from './cars.service{e}';\nimport {{ CreateCarDto }} from './dto/create-car.dto{e}';").replace("create(@Body() body: { brand: string; model: string; price: number }) {", "create(@Body() body: CreateCarDto) {"); assert n.count("CreateCarDto")==2; open(p,'w').write(n)
PY
ed src/main.ts <<'PY'
import sys,re; p=sys.argv[1]; s=open(p).read()
s=s.replace("import { NestFactory } from '@nestjs/core';", "import { NestFactory } from '@nestjs/core';\nimport { ValidationPipe } from '@nestjs/common';")
n=re.sub(r"(\n\s*)(await app\.listen\()", r"\1app.useGlobalPipes(new ValidationPipe());\1\2", s, count=1); assert n!=s; open(p,'w').write(n)
PY
cp src/cars/cars.controller.ts "$OUT/21-dto.cars.controller.ts"; cp src/main.ts "$OUT/21-dto.main.ts"; cp src/cars/dto/create-car.dto.ts "$OUT/21-dto.create-car.dto.ts"
run 21-dto-validation "POST /cars {}" 'POST /cars {"brand":"Kia","model":"K5","price":"arzon"}' 'POST /cars {"brand":"Chevrolet","model":"Cobalt","price":145}'
back

# 22. npm run start:dev — mentor ekranda ko'radigan to'liq chiqish (kuzatuv rejimi), 40 soniya
fuser -k $PORT/tcp >/dev/null 2>&1
PORT=$PORT python3 "$HERE/pty-run.py" "$OUT/22-start-dev.raw" 40 '[]' -- npm run start:dev 2> "$OUT/22-start-dev.err"
fuser -k $PORT/tcp >/dev/null 2>&1
sed 's/\x1b\[[0-9;?]*[A-Za-z]//g; s/\x1bc//g; s/\r//g' "$OUT/22-start-dev.raw" > "$OUT/22-start-dev.txt"; rm -f "$OUT/22-start-dev.raw"
rm -rf "$BAK"; echo "HAMMASI TAYYOR ($V)"
