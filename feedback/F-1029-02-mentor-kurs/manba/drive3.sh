#!/bin/bash
# 30.10 — mentor Nest-1 darsidagi ikki da'voni haqiqiy ishga tushirishda tekshirish (M10).
# A: darsdagi kod (nazorat) · B: ParseIntPipe · C: DTO + ValidationPipe. Chiqishlar → manba/nest-out/19-*, 20-*, 21-*
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT=/home/kali/Desktop/internetLesson/feedback/F-1029-02-mentor-kurs/manba/nest-out
PORT=3077
cd "$HERE/cars-api" || exit 1

probe() { # $1=nom, keyin "GET /yo'l" yoki "POST /yo'l BODY"
  local name=$1; shift
  rm -f "$OUT/$name.log" "$OUT/$name.curl"
  fuser -k $PORT/tcp >/dev/null 2>&1; sleep 0.5
  PORT=$PORT setsid npx nest start > "$OUT/$name.log" 2>&1 &
  local pg=$!
  for i in $(seq 1 90); do grep -q -E "successfully started|error TS|Error:" "$OUT/$name.log" && break; sleep 0.5; done
  sleep 1
  for req in "$@"; do
    read -r m u body <<< "$req"
    echo "### $m $u ${body:-}" >> "$OUT/$name.curl"
    if [ "$m" = POST ]; then curl -s -i -X POST -H 'Content-Type: application/json' -d "${body:-}" "http://localhost:$PORT$u" >> "$OUT/$name.curl"
    else curl -s -i "http://localhost:$PORT$u" >> "$OUT/$name.curl"; fi
    echo >> "$OUT/$name.curl"
  done
  kill -- -$pg >/dev/null 2>&1; fuser -k $PORT/tcp >/dev/null 2>&1; sleep 0.5
  echo "== $name tayyor"
}

# Darsdagi holat: CLI bilan cars moduli + darsdagi Service/Controller kodi
[ -d src/cars ] || { npx nest g module cars && npx nest g controller cars --no-spec && npx nest g service cars --no-spec; } > /dev/null
cp "$HERE/svc.ts" src/cars/cars.service.ts
cp "$HERE/ctrl.ts" src/cars/cars.controller.ts

# A — nazorat (darsdagi kod)
probe 19-abc-nazorat "GET /cars/abc"

# B — ParseIntPipe
sed -i "s/import { Body, Controller, Get, Param, Post } from '@nestjs\/common';/import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs\/common';/" src/cars/cars.controller.ts
sed -i "s/findOne(@Param('id') id: string) {/findOne(@Param('id', ParseIntPipe) id: number) {/; s/return this.carsService.findOne(Number(id));/return this.carsService.findOne(id);/" src/cars/cars.controller.ts
cp src/cars/cars.controller.ts "$OUT/20-parseint.cars.controller.ts"
probe 20-parseint "GET /cars/abc" "GET /cars/1"

# C — DTO + global ValidationPipe
[ -d node_modules/class-validator ] || npm i class-validator class-transformer > /dev/null 2>&1
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
sed -i "s/import { CarsService } from '.\/cars.service';/import { CarsService } from '.\/cars.service';\nimport { CreateCarDto } from '.\/dto\/create-car.dto';/" src/cars/cars.controller.ts
sed -i "s/create(@Body() body: { brand: string; model: string; price: number }) {/create(@Body() body: CreateCarDto) {/" src/cars/cars.controller.ts
sed -i "s/  const app = await NestFactory.create(AppModule);/  const app = await NestFactory.create(AppModule);\n  app.useGlobalPipes(new ValidationPipe());/; s/import { NestFactory } from '@nestjs\/core';/import { NestFactory } from '@nestjs\/core';\nimport { ValidationPipe } from '@nestjs\/common';/" src/main.ts
cp src/cars/cars.controller.ts "$OUT/21-dto.cars.controller.ts"; cp src/main.ts "$OUT/21-dto.main.ts"; cp src/cars/dto/create-car.dto.ts "$OUT/21-dto.create-car.dto.ts"
probe 21-dto-validation "POST /cars {}" 'POST /cars {"brand":"Kia","model":"K5","price":"arzon"}' 'POST /cars {"brand":"Chevrolet","model":"Cobalt","price":145}'
echo "== hammasi tayyor"
