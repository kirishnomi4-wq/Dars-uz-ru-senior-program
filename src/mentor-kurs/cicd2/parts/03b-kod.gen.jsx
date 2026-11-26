
// AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd2-kod.py — OrderBotNest teglari, yml variantlari, chiqishlar va haqiqiy GitHub Actions run'lari (qo'lda tahrirlanmaydi)
const KOD_CI_START = {
 "file": ".github/workflows/ci.yml",
 "tag": "cicd2-start",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "          cache: npm",
   "n": 11
  },
  {
   "t": "      - run: npm ci",
   "n": 12
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 13
  },
  {
   "t": "      - run: npm test",
   "n": 14
  },
  {
   "t": "      - run: npm run build",
   "n": 15
  }
 ]
};
const KOD_CI_DONE = {
 "file": ".github/workflows/ci.yml",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "          cache: npm",
   "n": 11
  },
  {
   "t": "      - run: npm ci",
   "n": 12
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 13
  },
  {
   "t": "      - run: npm test",
   "n": 14
  },
  {
   "t": "      - run: npm run build",
   "n": 15
  },
  {
   "t": "  smoke:",
   "n": 16
  },
  {
   "t": "    needs: test",
   "n": 17
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 18
  },
  {
   "t": "    services:",
   "n": 19
  },
  {
   "t": "      postgres:",
   "n": 20
  },
  {
   "t": "        image: postgres:18",
   "n": 21
  },
  {
   "t": "        env:",
   "n": 22
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 23
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 24
  },
  {
   "t": "        ports:",
   "n": 25
  },
  {
   "t": "          - 5432:5432",
   "n": 26
  },
  {
   "t": "        options: >-",
   "n": 27
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 28
  },
  {
   "t": "          --health-interval 5s",
   "n": 29
  },
  {
   "t": "          --health-timeout 5s",
   "n": 30
  },
  {
   "t": "          --health-retries 10",
   "n": 31
  },
  {
   "t": "    steps:",
   "n": 32
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 33
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 34
  },
  {
   "t": "        with:",
   "n": 35
  },
  {
   "t": "          node-version: 24",
   "n": 36
  },
  {
   "t": "          cache: npm",
   "n": 37
  },
  {
   "t": "      - run: npm ci",
   "n": 38
  },
  {
   "t": "      - run: npm run smoke",
   "n": 39
  },
  {
   "t": "        env:",
   "n": 40
  },
  {
   "t": "          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop  # konteyner paroli — sir emas, job bilan birga o'chadi",
   "n": 41
  }
 ]
};
const KOD_README_BADGE = {
 "file": "README.md",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "[![CI](https://github.com/Azizbekcrypto/OrderBotNest/actions/workflows/ci.yml/badge.svg)](https://github.com/Azizbekcrypto/OrderBotNest/actions/workflows/ci.yml)",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "# OrderBotNest — CoddyCamp do'koni boti",
   "n": 3
  }
 ]
};
const KOD_SMOKE_URL = {
 "file": "scripts/smoke.js",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "}",
   "n": 58
  },
  {
   "t": "const baseUrl = process.env.SMOKE_DB_URL || process.env.DATABASE_URL || '';",
   "n": 59
  },
  {
   "t": "const hasDb = Boolean(pg && baseUrl);",
   "n": 60
  }
 ]
};
const KOD_SMOKE_DB = {
 "file": "scripts/smoke.js",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "  const db = `${u.pathname.slice(1) || 'shop'}_smoke`;",
   "n": 94
  },
  {
   "t": "  await adminQuery(`DROP DATABASE IF EXISTS \"${db}\"`);",
   "n": 95
  },
  {
   "t": "  await adminQuery(`CREATE DATABASE \"${db}\" TEMPLATE template0`);",
   "n": 96
  }
 ]
};
const KOD_PKG_SMOKE = {
 "file": "package.json",
 "tag": "cicd2-done",
 "lines": [
  {
   "t": "    \"migration:revert\": \"typeorm-ts-node-commonjs migration:revert -d src/infrastructure/data-source.ts\",",
   "n": 17
  },
  {
   "t": "    \"migration:generate\": \"typeorm-ts-node-commonjs migration:generate -d src/infrastructure/data-source.ts src/infrastructure/migrations/auto\",",
   "n": 18
  },
  {
   "t": "    \"smoke\": \"node scripts/smoke.js\"",
   "n": 19
  }
 ]
};
const KOD_YML_1_MATRIX = {
 "file": ".github/workflows/ci.yml",
 "tag": "1-matrix.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    strategy:",
   "n": 6
  },
  {
   "t": "      matrix:",
   "n": 7
  },
  {
   "t": "        node-version: [22, 24]",
   "n": 8
  },
  {
   "t": "    steps:",
   "n": 9
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 10
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 11
  },
  {
   "t": "        with:",
   "n": 12
  },
  {
   "t": "          node-version: ${{ matrix.node-version }}",
   "n": 13
  },
  {
   "t": "          cache: npm",
   "n": 14
  },
  {
   "t": "      - run: npm ci",
   "n": 15
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 16
  },
  {
   "t": "      - run: npm test",
   "n": 17
  },
  {
   "t": "      - run: npm run build",
   "n": 18
  }
 ]
};
const KOD_YML_2_MATRIX_FAIL_FAST_FALSE = {
 "file": ".github/workflows/ci.yml",
 "tag": "2-matrix-fail-fast-false.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    strategy:",
   "n": 6
  },
  {
   "t": "      fail-fast: false",
   "n": 7
  },
  {
   "t": "      matrix:",
   "n": 8
  },
  {
   "t": "        node-version: [22, 24]",
   "n": 9
  },
  {
   "t": "    steps:",
   "n": 10
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 11
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 12
  },
  {
   "t": "        with:",
   "n": 13
  },
  {
   "t": "          node-version: ${{ matrix.node-version }}",
   "n": 14
  },
  {
   "t": "          cache: npm",
   "n": 15
  },
  {
   "t": "      - run: npm ci",
   "n": 16
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 17
  },
  {
   "t": "      - run: npm test",
   "n": 18
  },
  {
   "t": "      - run: npm run build",
   "n": 19
  }
 ]
};
const KOD_YML_3_SMOKE_SERVICES = {
 "file": ".github/workflows/ci.yml",
 "tag": "3-smoke-services.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "          cache: npm",
   "n": 11
  },
  {
   "t": "      - run: npm ci",
   "n": 12
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 13
  },
  {
   "t": "      - run: npm test",
   "n": 14
  },
  {
   "t": "      - run: npm run build",
   "n": 15
  },
  {
   "t": "  smoke:",
   "n": 16
  },
  {
   "t": "    needs: test",
   "n": 17
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 18
  },
  {
   "t": "    services:",
   "n": 19
  },
  {
   "t": "      postgres:",
   "n": 20
  },
  {
   "t": "        image: postgres:18",
   "n": 21
  },
  {
   "t": "        env:",
   "n": 22
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 23
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 24
  },
  {
   "t": "        ports:",
   "n": 25
  },
  {
   "t": "          - 5432:5432",
   "n": 26
  },
  {
   "t": "        options: >-",
   "n": 27
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 28
  },
  {
   "t": "          --health-interval 5s",
   "n": 29
  },
  {
   "t": "          --health-timeout 5s",
   "n": 30
  },
  {
   "t": "          --health-retries 10",
   "n": 31
  },
  {
   "t": "    steps:",
   "n": 32
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 33
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 34
  },
  {
   "t": "        with:",
   "n": 35
  },
  {
   "t": "          node-version: 24",
   "n": 36
  },
  {
   "t": "          cache: npm",
   "n": 37
  },
  {
   "t": "      - run: npm ci",
   "n": 38
  },
  {
   "t": "      - run: npm run smoke",
   "n": 39
  },
  {
   "t": "        env:",
   "n": 40
  },
  {
   "t": "          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop  # konteyner paroli — sir emas, job bilan birga o'chadi",
   "n": 41
  }
 ]
};
const KOD_YML_4_SMOKE_SECRET_XATO = {
 "file": ".github/workflows/ci.yml",
 "tag": "4-smoke-secret-xato.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 8
  },
  {
   "t": "        with:",
   "n": 9
  },
  {
   "t": "          node-version: 24",
   "n": 10
  },
  {
   "t": "          cache: npm",
   "n": 11
  },
  {
   "t": "      - run: npm ci",
   "n": 12
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 13
  },
  {
   "t": "      - run: npm test",
   "n": 14
  },
  {
   "t": "      - run: npm run build",
   "n": 15
  },
  {
   "t": "  smoke:",
   "n": 16
  },
  {
   "t": "    needs: test",
   "n": 17
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 18
  },
  {
   "t": "    services:",
   "n": 19
  },
  {
   "t": "      postgres:",
   "n": 20
  },
  {
   "t": "        image: postgres:18",
   "n": 21
  },
  {
   "t": "        env:",
   "n": 22
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 23
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 24
  },
  {
   "t": "        ports:",
   "n": 25
  },
  {
   "t": "          - 5432:5432",
   "n": 26
  },
  {
   "t": "        options: >-",
   "n": 27
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 28
  },
  {
   "t": "          --health-interval 5s",
   "n": 29
  },
  {
   "t": "          --health-timeout 5s",
   "n": 30
  },
  {
   "t": "          --health-retries 10",
   "n": 31
  },
  {
   "t": "    steps:",
   "n": 32
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 33
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 34
  },
  {
   "t": "        with:",
   "n": 35
  },
  {
   "t": "          node-version: 24",
   "n": 36
  },
  {
   "t": "          cache: npm",
   "n": 37
  },
  {
   "t": "      - run: npm ci",
   "n": 38
  },
  {
   "t": "      - run: npm run smoke",
   "n": 39
  },
  {
   "t": "        env:",
   "n": 40
  },
  {
   "t": "          DATABASE_URL: ${{ secrets.DATABSE_URL }}",
   "n": 41
  }
 ]
};
const KOD_YML_5_SECRET_ECHO = {
 "file": ".github/workflows/ci.yml",
 "tag": "5-secret-echo.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  secret:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    steps:",
   "n": 6
  },
  {
   "t": "      - run: echo \"DATABASE_URL=${{ secrets.DATABASE_URL }}\"",
   "n": 7
  },
  {
   "t": "      - run: echo \"${{ secrets.DATABASE_URL }}\" | wc -c",
   "n": 8
  },
  {
   "t": "      - run: echo \"YO'Q=${{ secrets.DATABSE_URL }}\"",
   "n": 9
  }
 ]
};
const KOD_YML_AI1 = {
 "file": ".github/workflows/ci.yml",
 "tag": "ai1",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    # smoke uchun PostgreSQL: runner yonida vaqtinchalik konteyner, job tugashi bilan o'chadi",
   "n": 6
  },
  {
   "t": "    services:",
   "n": 7
  },
  {
   "t": "      postgres:",
   "n": 8
  },
  {
   "t": "        image: postgres:18",
   "n": 9
  },
  {
   "t": "        env:",
   "n": 10
  },
  {
   "t": "          POSTGRES_USER: postgres",
   "n": 11
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 12
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 13
  },
  {
   "t": "        ports:",
   "n": 14
  },
  {
   "t": "          - 5432:5432",
   "n": 15
  },
  {
   "t": "        options: >-",
   "n": 16
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 17
  },
  {
   "t": "          --health-interval 5s",
   "n": 18
  },
  {
   "t": "          --health-timeout 5s",
   "n": 19
  },
  {
   "t": "          --health-retries 10",
   "n": 20
  },
  {
   "t": "    steps:",
   "n": 21
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 22
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 23
  },
  {
   "t": "        with:",
   "n": 24
  },
  {
   "t": "          node-version: 24",
   "n": 25
  },
  {
   "t": "          cache: npm",
   "n": 26
  },
  {
   "t": "      - run: npm ci",
   "n": 27
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 28
  },
  {
   "t": "      - run: npm test",
   "n": 29
  },
  {
   "t": "      - run: npm run build",
   "n": 30
  },
  {
   "t": "      # Telegram'siz tekshiruv: restart + race. Smoke o'zi shop_smoke bazasini ochadi va oxirida o'chiradi;",
   "n": 31
  },
  {
   "t": "      # BOT_TOKEN va ADMIN_TELEGRAM_IDS ni smoke o'zi qo'yadi, Telegram'ga so'rov ketmaydi",
   "n": 32
  },
  {
   "t": "      - run: npm run smoke",
   "n": 33
  },
  {
   "t": "        env:",
   "n": 34
  },
  {
   "t": "          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop",
   "n": 35
  }
 ]
};
const KOD_YML_AI2 = {
 "file": ".github/workflows/ci.yml",
 "tag": "ai2",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: [push, pull_request]",
   "n": 2
  },
  {
   "t": "jobs:",
   "n": 3
  },
  {
   "t": "  test:",
   "n": 4
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 5
  },
  {
   "t": "    services:",
   "n": 6
  },
  {
   "t": "      postgres:",
   "n": 7
  },
  {
   "t": "        image: postgres:18",
   "n": 8
  },
  {
   "t": "        env:",
   "n": 9
  },
  {
   "t": "          POSTGRES_USER: postgres",
   "n": 10
  },
  {
   "t": "          POSTGRES_PASSWORD: postgres",
   "n": 11
  },
  {
   "t": "          POSTGRES_DB: shop",
   "n": 12
  },
  {
   "t": "        ports:",
   "n": 13
  },
  {
   "t": "          - 5432:5432",
   "n": 14
  },
  {
   "t": "        options: >-",
   "n": 15
  },
  {
   "t": "          --health-cmd \"pg_isready -U postgres\"",
   "n": 16
  },
  {
   "t": "          --health-interval 5s",
   "n": 17
  },
  {
   "t": "          --health-timeout 5s",
   "n": 18
  },
  {
   "t": "          --health-retries 10",
   "n": 19
  },
  {
   "t": "    env:",
   "n": 20
  },
  {
   "t": "      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop",
   "n": 21
  },
  {
   "t": "    steps:",
   "n": 22
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 23
  },
  {
   "t": "      - uses: actions/setup-node@v4",
   "n": 24
  },
  {
   "t": "        with:",
   "n": 25
  },
  {
   "t": "          node-version: 24",
   "n": 26
  },
  {
   "t": "          cache: npm",
   "n": 27
  },
  {
   "t": "      - run: npm ci",
   "n": 28
  },
  {
   "t": "      - run: npx tsc --noEmit",
   "n": 29
  },
  {
   "t": "      - run: npm test",
   "n": 30
  },
  {
   "t": "      - run: npm run build",
   "n": 31
  },
  {
   "t": "      - run: npm run smoke",
   "n": 32
  }
 ]
};
const KOD_OUT_00 = "$ gh secret list -R Azizbekcrypto/OrderBotNest\n\n# bor=0 · qiymat (foydalanuvchi yaratsa): postgresql://postgres:postgres@localhost:5432/shop";
const KOD_OUT_09 = "v24.18.0\n11.16.0\ngh version 2.100.0 (2026-09-03)\nWed Nov  4 07:13:33 PM +05 2026\nAzizbekcrypto";
const KOD_OUT_V1_01 = "$ cat package.json\n{\n  \"name\": \"ci-mashq\",\n  \"version\": \"1.0.0\",\n  \"scripts\": { \"test\": \"echo ok && exit 0\" }\n}";
const KOD_OUT_V1_02 = "$ npm ci\nnpm error code EUSAGE\nnpm error\nnpm error The `npm ci` command can only install with an existing package-lock.json or\nnpm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or\nnpm error later to generate a package-lock.json file, then try again.\nnpm error\nnpm error Clean install a project\nnpm error\nnpm error Usage:\nnpm error npm ci\nnpm error\nnpm error Options:\nnpm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]\nnpm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]\nnpm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]\nnpm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]\nnpm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]\nnpm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]\nnpm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]\nnpm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]\nnpm error [--no-bin-links] [--no-fund] [--dry-run]\nnpm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]\nnpm error [--workspaces] [--include-workspace-root] [--install-links]\nnpm error\nnpm error   --install-strategy\nnpm error     Sets the strategy for installing packages in node_modules.\nnpm error\nnpm error   --legacy-bundling\nnpm error     Instead of hoisting package installs in `node_modules`, install packages\nnpm error\nnpm error   --global-style\nnpm error     Only install direct dependencies in the top level `node_modules`,\nnpm error\nnpm error   --omit\nnpm error     Dependency types to omit from the installation tree on disk.\nnpm error\nnpm error   --include\nnpm error     Option that allows for defining which types of dependencies to install.\nnpm error\nnpm error   --strict-peer-deps\nnpm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_\nnpm error\nnpm error   --foreground-scripts\nnpm error     Run all build scripts (ie, `preinstall`, `install`, and\nnpm error\nnpm error   --ignore-scripts\nnpm error     If true, npm does not run scripts specified in package.json files.\nnpm error\nnpm error   --allow-directory\nnpm error     Limits the ability for npm to install dependencies from directories.\nnpm error\nnpm error   --allow-file\nnpm error     Limits the ability for npm to install dependencies from tarball files.\nnpm error\nnpm error   --allow-git\nnpm error     Limits the ability for npm to fetch dependencies from git references.\nnpm error\nnpm error   --allow-remote\nnpm error     Limits the ability for npm to fetch dependencies from urls.\nnpm error\nnpm error   --allow-scripts\nnpm error     Comma-separated list of packages whose install-time lifecycle scripts\nnpm error\nnpm error   --strict-allow-scripts\nnpm error     If `true`, turn the install-script policy from a warning into a hard\nnpm error\nnpm error   --dangerously-allow-all-scripts\nnpm error     If `true`, bypass the `allowScripts` policy entirely and run every\nnpm error\nnpm error   --audit\nnpm error     When \"true\" submit audit reports alongside the current npm command to the\nnpm error\nnpm error   --bin-links\nnpm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package\nnpm error\nnpm error   --fund\nnpm error     When \"true\" displays the message at the end of each `npm install`\nnpm error\nnpm error   --dry-run\nnpm error     Indicates that you don't want npm to make any changes and that it should\nnpm error\nnpm error   -w|--workspace\nnpm error     Enable running a command in the context of the configured workspaces of the\nnpm error\nnpm error   --workspaces\nnpm error     Set to true to run the command in the context of **all** configured\nnpm error\nnpm error   --include-workspace-root\nnpm error     Include the workspace root when workspaces are enabled for a command.\nnpm error\nnpm error   --install-links\nnpm error     When set file: protocol dependencies will be packed and installed as\nnpm error\nnpm error\nnpm error aliases: clean-install, ic, install-clean, isntall-clean\nnpm error\nnpm error Run \"npm help ci\" for more info\nnpm error A complete log of this run can be found in: /home/kali/.npm/_logs/2026-10-31T21_50_43_174Z-debug-0.log\n[chiqish kodi: 1]";
const KOD_OUT_V1_03 = "$ npm install\n\nup to date, audited 1 package in 238ms\n\nfound 0 vulnerabilities\n[chiqish kodi: 0]\n\n$ npm test\n\n> ci-mashq@1.0.0 test\n> echo ok && exit 0\n\nok\n[chiqish kodi: 0]\n\n$ ls\npackage.json\npackage-lock.json";
const KOD_OUT_V1_04 = "# \"test\": \"echo xato && exit 1\" ga o'zgartirildi\n$ npm test\n\n> ci-mashq@1.0.0 test\n> echo xato && exit 1\n\nxato\n[chiqish kodi: 1]";
const KOD_RUNS_C1_10 = {
 "id": "41832879751",
 "n": 11,
 "title": "ci: lenta — npm ci · tsc · test · build",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "ef9e667",
 "st": "ok",
 "dur": "28 s",
 "at": "2026-11-04T12:51:22Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "25 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Run npm ci",
     "ok",
     "11 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "3 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {c8b895d0-b2d8-4e7f-a2a8-63465f006925}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/56d9986e-59b9-4b78-a345-c9ae46605c9e' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +ef9e6671e0c84b98c6143ba02e5e0b3527d0bc1e:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         ef9e6671e0c84b98c6143ba02e5e0b3527d0bc1e -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "ef9e6671e0c84b98c6143ba02e5e0b3527d0bc1e"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2342) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "npm cache is not found"
  ],
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 10s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.49 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2537) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "[command]/usr/bin/tar --posix -cf cache.tzst --exclude cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --files-from manifest.txt --use-compress-program zstdmt",
   "(node:2537) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Sent 36395187 of 36395187 (100.0%), 43.3 MBs/sec",
   "Cache saved with the key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/320d9817-eee6-4594-9dc4-0b6adeca5154' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_C1_11 = {
 "id": "42608643059",
 "n": 44,
 "title": "sinov: chegara buzildi (< → <=)",
 "ev": "push",
 "br": "sinov-test-qizil",
 "sha": "fccde96",
 "st": "bad",
 "dur": "19 s",
 "at": "2026-11-09T11:23:19Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "17 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "bad",
     "2 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {788364b5-e781-41cd-8c46-a74914b93f7c}",
   "Region: eastus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/eca73341-8d7e-4e99-8c36-f87f62e3ec82' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +fccde96bd3d76ff533b5d26b057fd49736c3797c:refs/remotes/origin/sinov-test-qizil",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         fccde96bd3d76ff533b5d26b057fd49736c3797c -> origin/sinov-test-qizil",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B sinov-test-qizil refs/remotes/origin/sinov-test-qizil",
   "Switched to a new branch 'sinov-test-qizil'",
   "branch 'sinov-test-qizil' set up to track 'origin/sinov-test-qizil'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "fccde96bd3d76ff533b5d26b057fd49736c3797c"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2409) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2409) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 89.2 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/a3a0c2e4-0a8c-4a4e-97f5-d8d20a1578da/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 7s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (5 low, 17 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "FAIL src/api/order/order.service.spec.ts",
   "  ● OrderService.place › chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi",
   "    Kolonka: omborda faqat 2 ta qoldi",
   "      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);",
   "      36 |         if (p.stock <= c.qty) {",
   "    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);",
   "         |                 ^",
   "      38 |         }",
   "      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.",
   "      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi",
   "      at api/order/order.service.ts:37:17",
   "      at Object.<anonymous> (api/order/order.service.spec.ts:76:19)",
   "Test Suites: 1 failed, 4 passed, 5 total",
   "Tests:       1 failed, 24 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.421 s",
   "Ran all test suites.",
   "##[error]Process completed with exit code 1."
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/a26dc3ce-950a-4b6c-bdde-f70496decd53' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_C1_15 = {
 "id": "41833479902",
 "n": 16,
 "title": "sinov: tsc qadami bor + tur xatosi",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "9c6b5f2",
 "st": "bad",
 "dur": "21 s",
 "at": "2026-11-04T12:55:35Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "18 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npx tsc --noEmit",
     "bad",
     "2 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 2."
  ],
  [
   "failure",
   "No overload matches this call."
  ],
  [
   "failure",
   "Type '{ telegram_id: number; }' is not assignable to type 'FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined'."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {90000ca8-1c23-4925-92c4-daade293ef00}",
   "Region: westcentralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/4afb00e8-1361-4dca-af49-a18f2a97ff16' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +9c6b5f2edaf89e4ebfb0e5151ee0ffbfd6476ee6:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         9c6b5f2edaf89e4ebfb0e5151ee0ffbfd6476ee6 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "9c6b5f2edaf89e4ebfb0e5151ee0ffbfd6476ee6"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2419) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2419) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 36.3 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/70f435da-64ec-4318-9a75-9016888d7764/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit",
   "##[error]src/api/user/user.service.ts(20,42): error TS2322: Type '{ telegram_id: number; }' is not assignable to type 'FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined'.",
   "  Types of property 'telegram_id' are incompatible.",
   "    Type 'number' is not assignable to type 'string | FindOperator<string> | undefined'.",
   "##[error]src/api/user/user.service.ts(22,33): error TS2769: No overload matches this call.",
   "  Overload 1 of 3, '(entityLikeArray: DeepPartial<User>[]): User[]', gave the following error.",
   "    Object literal may only specify known properties, and 'telegram_id' does not exist in type 'DeepPartial<User>[]'.",
   "  Overload 2 of 3, '(entityLike: DeepPartial<User>): User', gave the following error.",
   "    Type 'number' is not assignable to type 'string'.",
   "##[error]Process completed with exit code 2."
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/4fad91e8-59bb-4dcc-8a20-1ccaa35c1bb5' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_C1_18 = {
 "id": "41833650859",
 "n": 19,
 "title": "cicd1-done: node-version 24 — runner'dagi npm 10 lock faylni o'qiy ol…",
 "ev": "push",
 "br": "main",
 "sha": "d789c0b",
 "st": "ok",
 "dur": "31 s",
 "at": "2026-11-04T12:56:47Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "28 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "11 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "4 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "1 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {a2f1f54d-a17c-42b0-a5aa-94675ca027b3}",
   "Region: westus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/087aa042-c057-4c95-8a08-b7aa54cafd6c' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +d789c0b677c948c16e766e5f4a7912993426c0f0:refs/remotes/origin/main",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         d789c0b677c948c16e766e5f4a7912993426c0f0 -> origin/main",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main",
   "Switched to a new branch 'main'",
   "branch 'main' set up to track 'origin/main'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "d789c0b677c948c16e766e5f4a7912993426c0f0"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2375) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "npm cache is not found"
  ],
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 11s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.486 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2560) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "[command]/usr/bin/tar --posix -cf cache.tzst --exclude cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --files-from manifest.txt --use-compress-program zstdmt",
   "(node:2560) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Sent 23527424 of 36396297 (64.6%), 22.4 MBs/sec",
   "Sent 36396297 of 36396297 (100.0%), 24.7 MBs/sec",
   "Cache saved with the key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/6abe7c37-04e0-42aa-abb1-bdf1fb065d60' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_30 = {
 "id": "41844079933",
 "n": 21,
 "title": "sinov: matrix node 22/24 (fail-fast odatiy)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "09fe858",
 "st": "bad",
 "dur": "26 s",
 "at": "2026-11-04T14:05:18Z",
 "jobs": [
  {
   "name": "test (24)",
   "st": "off",
   "dur": "22 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "6 s"
    ],
    [
     "Run npm ci",
     "ok",
     "5 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "2 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "test (22)",
   "st": "bad",
   "dur": "10 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "bad",
     "1 s"
    ],
    [
     "Run npx tsc --noEmit",
     "skip",
     "0 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "The strategy configuration was canceled because \"test._22\" failed"
  ],
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "test (24) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {1e096a36-3057-4509-9bbc-8d3a6bd268de}",
   "Region: centralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (24)"
  ],
  "test (24) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/ecbd92ba-f7f6-46cc-95f6-1b1096290cc6' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +09fe85876f0753cb6b760fd51c04dc082c733e0f:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         09fe85876f0753cb6b760fd51c04dc082c733e0f -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "09fe85876f0753cb6b760fd51c04dc082c733e0f"
  ],
  "test (24) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2186) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2186) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 62.1 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/0db50796-b664-431b-8181-9bba921e74bb/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (24) · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 5s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "test (24) · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test (24) · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.352 s",
   "Ran all test suites."
  ],
  "test (24) · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test (24) · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2375) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test (24) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/c1413941-3eef-4959-b63b-e9380eb80f7a' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (24) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "test (22) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {d00cc395-cb82-4c6f-a46c-0a2a09c017bb}",
   "Region: westus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (22)"
  ],
  "test (22) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/d5e3d864-98df-43f1-adcd-6375e9342ed8' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +09fe85876f0753cb6b760fd51c04dc082c733e0f:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         09fe85876f0753cb6b760fd51c04dc082c733e0f -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "09fe85876f0753cb6b760fd51c04dc082c733e0f"
  ],
  "test (22) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 22",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2198) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64",
   "node: v22.23.4",
   "npm: 10.9.9",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/22.23.4/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2198) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 36.7 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/8ebbcabd-bb25-42d8-8c39-48177763e3dc/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (22) · Run npm ci": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.",
   "npm error",
   "npm error Missing: webpack@5.112.2 from lock file",
   "npm error",
   "npm error Clean install a project",
   "npm error",
   "npm error Usage:",
   "npm error npm ci",
   "npm error",
   "npm error Options:",
   "npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]",
   "npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]",
   "npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]",
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error aliases: clean-install, ic, install-clean, isntall-clean",
   "npm error",
   "npm error Run \"npm help ci\" for more info",
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T14_05_26_114Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ],
  "test (22) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/879410de-c72f-43e1-a41d-1a02ec6ea226' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (22) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_31 = {
 "id": "41844193379",
 "n": 22,
 "title": "sinov: matrix node 22/24, fail-fast: false",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "a77711f",
 "st": "bad",
 "dur": "29 s",
 "at": "2026-11-04T14:06:00Z",
 "jobs": [
  {
   "name": "test (22)",
   "st": "bad",
   "dur": "10 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "bad",
     "0 s"
    ],
    [
     "Run npx tsc --noEmit",
     "skip",
     "0 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Run npm run build",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "test (24)",
   "st": "ok",
   "dur": "25 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "9 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "4 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "test (22) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {c56f1f58-7b39-41eb-ba5b-a8890f49fb27}",
   "Region: westus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (22)"
  ],
  "test (22) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/5186477b-f082-49b7-91b6-7d45d2f0afe7' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +a77711fdaa06a563454dc80ef3cf142e7a4b038d:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         a77711fdaa06a563454dc80ef3cf142e7a4b038d -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "a77711fdaa06a563454dc80ef3cf142e7a4b038d"
  ],
  "test (22) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 22",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/22.23.4/x64",
   "(node:2175) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v22.23.4",
   "npm: 10.9.9",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/22.23.4/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2175) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 37.1 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/008eaf66-7bff-43bb-9191-23f0f48dd153/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (22) · Run npm ci": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.",
   "npm error",
   "npm error Missing: webpack@5.112.2 from lock file",
   "npm error",
   "npm error Clean install a project",
   "npm error",
   "npm error Usage:",
   "npm error npm ci",
   "npm error",
   "npm error Options:",
   "npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]",
   "npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]",
   "npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]",
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error aliases: clean-install, ic, install-clean, isntall-clean",
   "npm error",
   "npm error Run \"npm help ci\" for more info",
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T14_06_14_118Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ],
  "test (22) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/9a1b64d3-657a-4093-ab08-79083ef0932f' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (22) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "test (24) · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {5daa47e8-b35f-4dad-9ced-8980a55b7842}",
   "Region: westus2",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test (24)"
  ],
  "test (24) · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/280bf65f-0c1f-43da-9028-572d29c7f2b0' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +a77711fdaa06a563454dc80ef3cf142e7a4b038d:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         a77711fdaa06a563454dc80ef3cf142e7a4b038d -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "a77711fdaa06a563454dc80ef3cf142e7a4b038d"
  ],
  "test (24) · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2664) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2664) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 28006579 of 36395187 (77.0%), 26.7 MBs/sec",
   "Received 36395187 of 36395187 (100.0%), 33.8 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/d7b43be3-38bb-4169-b13d-331ae2e35540/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test (24) · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "To address issues that do not require attention, run:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "  npm audit fix",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details."
  ],
  "test (24) · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test (24) · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.471 s",
   "Ran all test suites."
  ],
  "test (24) · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test (24) · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2858) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test (24) · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/6483a280-936c-4ffa-b7d2-688cb6b4de11' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test (24) · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_32 = {
 "id": "41845454983",
 "n": 25,
 "title": "sinov: smoke job — services: postgres:18, DATABASE_URL env (konteyner)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "9fc3af1",
 "st": "ok",
 "dur": "1 daq 6 s",
 "at": "2026-11-04T14:13:43Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "19 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "4 s"
    ],
    [
     "Run npm ci",
     "ok",
     "5 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "41 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Initialize containers",
     "ok",
     "13 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "ok",
     "10 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "9 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {b46ba1ad-0e10-4209-a226-0dc09383d7d9}",
   "Region: centralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/b9358d6d-3e75-4392-b6ac-206a1599cba5' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2163) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2163) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 59.0 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/715d2b01-c2db-4ec7-b344-fad20bb6205d/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 5s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "  npm audit fix",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "PASS src/api/telegram/keyboards.spec.ts",
   "> jest",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.07 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2361) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/6400bfe0-183a-4131-9ac3-b6ec76ac9c35' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {cf0f8035-03cb-4dd4-83e5-373f19a9a269}",
   "Region: westus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=9ab1db\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=9ab1db\"",
   "##[command]/usr/bin/docker network create --label 9ab1db github_network_e1e8a5ac7c604a12a477d8c17c48b8ba",
   "0c57e1911478ae51735ed7041cb9b4b65ffe7c052e01661990cbfae7523dcd15",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "d0fbcb0db440: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "7e6d71cb0490: Download complete",
   "cea4f0db46a6: Download complete",
   "fbc84e711712: Download complete",
   "879995175298: Download complete",
   "d89068781d71: Download complete",
   "00ff7a4924f2: Download complete",
   "d0fbcb0db440: Download complete",
   "7c25aa4e8a77: Download complete",
   "d06edb2e3f43: Download complete",
   "3795839385bc: Download complete",
   "9b1a18996a22: Download complete",
   "1b52931e2f91: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "9b1a18996a22: Pull complete",
   "fbc84e711712: Pull complete",
   "879995175298: Pull complete",
   "d89068781d71: Pull complete",
   "ef90fb83cca5: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 59b8e1225c904ca3862e1e7019730d98_postgres18_e32bb8 --label 9ab1db --network github_network_e1e8a5ac7c604a12a477d8c17c48b8ba --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "##[command]/usr/bin/docker start 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "##[command]/usr/bin/docker ps --all --filter id=0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/fc9f35a1-4ab3-4e84-8337-185c4297b51c' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "9fc3af1d5626674fc8b4eb459aa4c8d1a92dd187"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2780) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2780) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 4194304 of 36395187 (11.5%), 4.0 MBs/sec",
   "Received 36395187 of 36395187 (100.0%), 26.8 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/f6c4c064-a3d2-4fd2-94a6-a4ebd8be1a32/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 9s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3077) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/0c29c250-9d51-4668-b43d-103254d88f1f' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 59b8e1225c904ca3862e1e7019730d98_postgres18_e32bb8",
   "##[command]/usr/bin/docker logs --details 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:14:16.597 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:14:16.597 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:14:16.597 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:14:16.598 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:14:16.602 UTC [75] LOG:  database system was shut down at 2026-11-04 14:14:16 UTC",
   " 2026-11-04 14:14:16.609 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:14:44.476 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:14:44.487 UTC [73] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.012 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:14:16.252 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:14:16.253 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:14:16.258 UTC [59] LOG:  database system was shut down at 2026-11-04 14:14:16 UTC",
   " 2026-11-04 14:14:16.262 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:14:16.469 UTC [53] LOG:  received fast shutdown request",
   " .2026-11-04 14:14:16.470 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:14:16.473 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:14:16.474 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:14:16.475 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:14:16.492 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.015 s, sync=0.002 s, total=0.019 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:14:16.507 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 59b8e1225c904ca3862e1e7019730d98_postgres18_e32bb8",
   "##[command]/usr/bin/docker rm --force 0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "0b30bafbfae626e73f45833ea797b28169dd6ffb842e6eecede86f2073d351f9",
   "Remove container network: github_network_e1e8a5ac7c604a12a477d8c17c48b8ba",
   "##[command]/usr/bin/docker network rm github_network_e1e8a5ac7c604a12a477d8c17c48b8ba",
   "github_network_e1e8a5ac7c604a12a477d8c17c48b8ba"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_33 = {
 "id": "41845709717",
 "n": 26,
 "title": "sinov: secrets.DATABSE_URL — nomi xato (secret bo'lmasa ham bo'sh)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "2013fd1",
 "st": "bad",
 "dur": "54 s",
 "at": "2026-11-04T14:15:16Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "20 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "4 s"
    ],
    [
     "Run npm ci",
     "ok",
     "4 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "smoke",
   "st": "bad",
   "dur": "30 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "11 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npm run smoke",
     "bad",
     "4 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Stop containers",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "failure",
   "Process completed with exit code 2."
  ]
 ],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {78640de3-c5d5-4c20-8a55-b5fda5139b15}",
   "Region: westus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/c1e7a3b4-36c3-4a7d-92c1-38d294e7aeb4' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +2013fd1e6897d67cc81a221ba7915df00d9938b4:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         2013fd1e6897d67cc81a221ba7915df00d9938b4 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "2013fd1e6897d67cc81a221ba7915df00d9938b4"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2157) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2157) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 32200883 of 36395187 (88.5%), 30.7 MBs/sec",
   "Received 32200883 of 36395187 (88.5%), 15.4 MBs/sec",
   "Received 36395187 of 36395187 (100.0%), 13.4 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/43e3025a-926b-4b6e-a4d4-0e0fbe641377/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 4s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        0.954 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2349) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/73ce7c0f-547d-4169-9590-4fb96593fbe7' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {4c2e4fdc-c594-45a4-87c1-b7521a42927f}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=cf67ce\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=cf67ce\"",
   "##[command]/usr/bin/docker network create --label cf67ce github_network_8483ec21ac5a4bf6a734e4b15511d4b2",
   "23c9e05f5544e93ce3336012a1175687b6cdc111627473333cc4590e379a2108",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "d0fbcb0db440: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "7c25aa4e8a77: Download complete",
   "d0fbcb0db440: Download complete",
   "fbc84e711712: Download complete",
   "7e6d71cb0490: Download complete",
   "d89068781d71: Download complete",
   "00ff7a4924f2: Download complete",
   "d06edb2e3f43: Download complete",
   "879995175298: Download complete",
   "cea4f0db46a6: Download complete",
   "9b1a18996a22: Download complete",
   "3795839385bc: Download complete",
   "1b52931e2f91: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "9b1a18996a22: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 524b1dc63f1c43dc84e4f8ef8a51575c_postgres18_80f952 --label cf67ce --network github_network_8483ec21ac5a4bf6a734e4b15511d4b2 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "##[command]/usr/bin/docker start 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "##[command]/usr/bin/docker ps --all --filter id=9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "starting",
   "postgres service is starting, waiting 3 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/a3e489ba-ee11-4448-969e-343e7dfc8f1c' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +2013fd1e6897d67cc81a221ba7915df00d9938b4:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         2013fd1e6897d67cc81a221ba7915df00d9938b4 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "2013fd1e6897d67cc81a221ba7915df00d9938b4"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2760) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2760) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 123.5 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/ddaecb78-5eb4-4084-9e42-37625687027f/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== baza yo'q: hammasi xotirada (tgpg-start) ==",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "SMOKE XATO: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: ***localhost:5432/shop",
   "SMOKE XATO: Command failed: node \"/home/runner/work/OrderBotNest/OrderBotNest/scripts/smoke.js\" __step 1",
   "SMOKE XATO: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: ***localhost:5432/shop",
   "##[error]Process completed with exit code 2."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/f12bb342-e6b2-448c-8d0a-d8652f2ce2ed' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 524b1dc63f1c43dc84e4f8ef8a51575c_postgres18_80f952",
   "##[command]/usr/bin/docker logs --details 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:15:49.107 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:15:49.107 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:15:49.108 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:15:49.109 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:15:49.113 UTC [75] LOG:  database system was shut down at 2026-11-04 14:15:49 UTC",
   " 2026-11-04 14:15:49.116 UTC [1] LOG:  database system is ready to accept connections",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:15:48.786 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:15:48.786 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:15:48.790 UTC [59] LOG:  database system was shut down at 2026-11-04 14:15:48 UTC",
   " 2026-11-04 14:15:48.793 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " 2026-11-04 14:15:48.984 UTC [53] LOG:  received fast shutdown request",
   " waiting for server to shut down....2026-11-04 14:15:48.984 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:15:48.986 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:15:48.986 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:15:48.987 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:15:49.003 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.014 s, sync=0.002 s, total=0.017 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:15:49.014 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 524b1dc63f1c43dc84e4f8ef8a51575c_postgres18_80f952",
   "##[command]/usr/bin/docker rm --force 9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "9592a784e0d76b70ac6d7ebbf0a7bb59506f7928cdaf245a45d39fddff99efb5",
   "Remove container network: github_network_8483ec21ac5a4bf6a734e4b15511d4b2",
   "##[command]/usr/bin/docker network rm github_network_8483ec21ac5a4bf6a734e4b15511d4b2",
   "github_network_8483ec21ac5a4bf6a734e4b15511d4b2"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_35 = {
 "id": "41845936594",
 "n": 27,
 "title": "ci: smoke job (services: postgres:18, DATABASE_URL secret) va README …",
 "ev": "push",
 "br": "lenta-smoke",
 "sha": "70035b5",
 "st": "ok",
 "dur": "1 daq 10 s",
 "at": "2026-11-04T14:16:37Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "24 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "3 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "39 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "13 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "9 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "8 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {9aab6ec5-8739-4463-8c9c-9561c420b21b}",
   "Region: westcentralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/b2a439f3-e73a-4982-9b83-b87039c63df3' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +70035b5a01e42de2500c3180a440f42c5fc34a8a:refs/remotes/origin/lenta-smoke",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         70035b5a01e42de2500c3180a440f42c5fc34a8a -> origin/lenta-smoke",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B lenta-smoke refs/remotes/origin/lenta-smoke",
   "Switched to a new branch 'lenta-smoke'",
   "branch 'lenta-smoke' set up to track 'origin/lenta-smoke'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "70035b5a01e42de2500c3180a440f42c5fc34a8a"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2401) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2401) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 39.7 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/89067e75-5981-4542-8f55-1d40efbd81ba/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.665 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2629) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/36e495ac-67c4-4e98-865f-07e2154bc26b' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {cb307374-02f1-4f99-93ac-0fe25ec2a384}",
   "Region: westus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=dd54ac\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=dd54ac\"",
   "##[command]/usr/bin/docker network create --label dd54ac github_network_49dfbe2e200a457d8a198ce988a7c9aa",
   "2dc7e118a8ff30df1e64524fd3dd00021bea2e74fcc00b7e592780479bf7ad6f",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "d0fbcb0db440: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "fbc84e711712: Download complete",
   "879995175298: Download complete",
   "d0fbcb0db440: Download complete",
   "cea4f0db46a6: Download complete",
   "d89068781d71: Download complete",
   "7e6d71cb0490: Download complete",
   "d06edb2e3f43: Download complete",
   "7c25aa4e8a77: Download complete",
   "00ff7a4924f2: Download complete",
   "3795839385bc: Download complete",
   "9b1a18996a22: Download complete",
   "1b52931e2f91: Download complete",
   "a3fcee8384ca: Download complete",
   "ef90fb83cca5: Download complete",
   "6fc242d221a6: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "fbc84e711712: Pull complete",
   "879995175298: Pull complete",
   "d89068781d71: Pull complete",
   "9b1a18996a22: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7e6d71cb0490: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "00ff7a4924f2: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 233d5cf7cc1d425da0ea7070afcf794c_postgres18_12b520 --label dd54ac --network github_network_49dfbe2e200a457d8a198ce988a7c9aa --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "##[command]/usr/bin/docker start 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "##[command]/usr/bin/docker ps --all --filter id=667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/048da74e-12af-4528-ab94-ed6fd73f387b' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +70035b5a01e42de2500c3180a440f42c5fc34a8a:refs/remotes/origin/lenta-smoke",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         70035b5a01e42de2500c3180a440f42c5fc34a8a -> origin/lenta-smoke",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B lenta-smoke refs/remotes/origin/lenta-smoke",
   "Switched to a new branch 'lenta-smoke'",
   "branch 'lenta-smoke' set up to track 'origin/lenta-smoke'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "70035b5a01e42de2500c3180a440f42c5fc34a8a"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2774) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2774) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 4194304 of 36396297 (11.5%), 4.0 MBs/sec",
   "Received 36396297 of 36396297 (100.0%), 29.4 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/bad8e5b7-c807-482b-919a-b3932a6caf22/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3074) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/ee4814ca-9f55-44fd-b671-9df522391014' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 233d5cf7cc1d425da0ea7070afcf794c_postgres18_12b520",
   "##[command]/usr/bin/docker logs --details 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:17:16.963 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:17:16.963 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:17:16.963 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:17:16.964 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:17:16.968 UTC [75] LOG:  database system was shut down at 2026-11-04 14:17:16 UTC",
   " 2026-11-04 14:17:16.973 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:17:42.292 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:17:42.295 UTC [73] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.004 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:17:16.635 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:17:16.635 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:17:16.639 UTC [59] LOG:  database system was shut down at 2026-11-04 14:17:16 UTC",
   " 2026-11-04 14:17:16.642 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " 2026-11-04 14:17:16.838 UTC [53] LOG:  received fast shutdown request",
   " waiting for server to shut down....2026-11-04 14:17:16.838 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:17:16.840 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:17:16.841 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:17:16.841 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:17:16.858 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.014 s, sync=0.002 s, total=0.018 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:17:16.870 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 233d5cf7cc1d425da0ea7070afcf794c_postgres18_12b520",
   "##[command]/usr/bin/docker rm --force 667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "667ffecf9ed3b31c5f063cb1d5fd587a53395cb9be50e55bf165749bbdbeba0d",
   "Remove container network: github_network_49dfbe2e200a457d8a198ce988a7c9aa",
   "##[command]/usr/bin/docker network rm github_network_49dfbe2e200a457d8a198ce988a7c9aa",
   "github_network_49dfbe2e200a457d8a198ce988a7c9aa"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_36 = {
 "id": "41846225069",
 "n": 28,
 "title": "ci: smoke job (PostgreSQL xizmati) va README badge",
 "ev": "pull_request",
 "br": "lenta-smoke",
 "sha": "70035b5",
 "st": "ok",
 "dur": "1 daq 15 s",
 "at": "2026-11-04T14:18:23Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "20 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "6 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "3 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "4 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "35 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "11 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Run npm ci",
     "ok",
     "9 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "8 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {170ec72b-a97b-4fcc-930f-3e4503287225}",
   "Region: southcentralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/60cea125-ab97-4151-9650-93781530b0fc' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +ff03da35c46fdd25d23d5b4e0a73ea4ae72683db:refs/remotes/pull/1/merge",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         ff03da35c46fdd25d23d5b4e0a73ea4ae72683db -> pull/1/merge",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force refs/remotes/pull/1/merge",
   "Note: switching to 'refs/remotes/pull/1/merge'.",
   "You are in 'detached HEAD' state. You can look around, make experimental",
   "changes and commit them, and you can discard any commits you make in this",
   "state without impacting any branches by switching back to a branch.",
   "If you want to create a new branch to retain commits you create, you may",
   "do so (now or later) by using -c with the switch command. Example:",
   "  git switch -c <new-branch-name>",
   "Or undo this operation with:",
   "  git switch -",
   "Turn off this advice by setting config variable advice.detachedHead to false",
   "HEAD is now at ff03da3 Merge 70035b5a01e42de2500c3180a440f42c5fc34a8a into d789c0b677c948c16e766e5f4a7912993426c0f0",
   "[command]/usr/bin/git log -1 --format=%H",
   "ff03da35c46fdd25d23d5b4e0a73ea4ae72683db"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2339) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2339) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 59.5 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/7a5d732e-43e9-47cd-9f95-0b5f7aea7ce4/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 6s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "To address issues that do not require attention, run:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "  npm audit fix",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.324 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2537) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/b42a1ec9-09fd-4d4e-baf0-d4acf53c6266' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {7b5faeda-6cfc-4d04-adac-55a474904346}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=6b7feb\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=6b7feb\"",
   "##[command]/usr/bin/docker network create --label 6b7feb github_network_6eaae99124614777878bc29cf3885a56",
   "77bc1ed5030468d1217e075f53210b9ca71dea03ead82483139830ce6bd62d95",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "9b1a18996a22: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "fbc84e711712: Download complete",
   "d06edb2e3f43: Download complete",
   "00ff7a4924f2: Download complete",
   "7e6d71cb0490: Download complete",
   "d89068781d71: Download complete",
   "cea4f0db46a6: Download complete",
   "d0fbcb0db440: Download complete",
   "879995175298: Download complete",
   "7c25aa4e8a77: Download complete",
   "a3fcee8384ca: Download complete",
   "3795839385bc: Download complete",
   "9b1a18996a22: Download complete",
   "1b52931e2f91: Download complete",
   "6fc242d221a6: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "3795839385bc: Pull complete",
   "cea4f0db46a6: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "9b1a18996a22: Pull complete",
   "7e6d71cb0490: Pull complete",
   "ef90fb83cca5: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name e77c684bd3d8479fb9d4898c44c8d838_postgres18_06dbb9 --label 6b7feb --network github_network_6eaae99124614777878bc29cf3885a56 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "##[command]/usr/bin/docker start 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "##[command]/usr/bin/docker ps --all --filter id=3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/7fff95b8-b159-47b2-af7a-0179380130cb' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +ff03da35c46fdd25d23d5b4e0a73ea4ae72683db:refs/remotes/pull/1/merge",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         ff03da35c46fdd25d23d5b4e0a73ea4ae72683db -> pull/1/merge",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force refs/remotes/pull/1/merge",
   "Note: switching to 'refs/remotes/pull/1/merge'.",
   "You are in 'detached HEAD' state. You can look around, make experimental",
   "changes and commit them, and you can discard any commits you make in this",
   "state without impacting any branches by switching back to a branch.",
   "If you want to create a new branch to retain commits you create, you may",
   "do so (now or later) by using -c with the switch command. Example:",
   "  git switch -c <new-branch-name>",
   "Or undo this operation with:",
   "  git switch -",
   "Turn off this advice by setting config variable advice.detachedHead to false",
   "HEAD is now at ff03da3 Merge 70035b5a01e42de2500c3180a440f42c5fc34a8a into d789c0b677c948c16e766e5f4a7912993426c0f0",
   "[command]/usr/bin/git log -1 --format=%H",
   "ff03da35c46fdd25d23d5b4e0a73ea4ae72683db"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2769) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2769) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 121.4 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/36d2a9cb-b1a0-4a8b-b4b0-52c0df4439da/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 9s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3069) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/7a0ce489-cb46-4202-85b0-87a6760e63e1' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: e77c684bd3d8479fb9d4898c44c8d838_postgres18_06dbb9",
   "##[command]/usr/bin/docker logs --details 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:19:10.246 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:19:10.246 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:19:10.246 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:19:10.247 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:19:10.251 UTC [75] LOG:  database system was shut down at 2026-11-04 14:19:10 UTC",
   " 2026-11-04 14:19:10.254 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:19:34.911 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:19:34.914 UTC [73] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.004 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:19:09.926 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:19:09.927 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:19:09.931 UTC [59] LOG:  database system was shut down at 2026-11-04 14:19:09 UTC",
   " 2026-11-04 14:19:09.934 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " 2026-11-04 14:19:10.123 UTC [53] LOG:  received fast shutdown request",
   " waiting for server to shut down....2026-11-04 14:19:10.124 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:19:10.126 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:19:10.127 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:19:10.127 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:19:10.144 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.013 s, sync=0.003 s, total=0.018 s; sync files=303, longest=0.002 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:19:10.155 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: e77c684bd3d8479fb9d4898c44c8d838_postgres18_06dbb9",
   "##[command]/usr/bin/docker rm --force 3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "3839d179c792f3f4cb15b017180f5e0e31c20b3777bf7f85db4f9178e651ede6",
   "Remove container network: github_network_6eaae99124614777878bc29cf3885a56",
   "##[command]/usr/bin/docker network rm github_network_6eaae99124614777878bc29cf3885a56",
   "github_network_6eaae99124614777878bc29cf3885a56"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_37 = {
 "id": "41846525635",
 "n": 29,
 "title": "Merge pull request #1 from Azizbekcrypto/lenta-smoke",
 "ev": "push",
 "br": "main",
 "sha": "47d30ec",
 "st": "ok",
 "dur": "1 daq 1 s",
 "at": "2026-11-04T14:20:12Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "17 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "4 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "1 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "38 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "14 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "3 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "ok",
     "7 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "6 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "2 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {6fad1e66-4e7e-4450-a6ea-3cae6440cb74}",
   "Region: centralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/f32e6640-348d-4de5-8d1f-84e26acd0ebe' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08:refs/remotes/origin/main",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08 -> origin/main",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main",
   "Switched to a new branch 'main'",
   "branch 'main' set up to track 'origin/main'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2139) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2139) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 32201993 of 36396297 (88.5%), 30.7 MBs/sec",
   "Received 36396297 of 36396297 (100.0%), 34.1 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/698dfd08-fb21-4cf9-92ad-b209b9ad3aa7/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 4s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        0.975 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2336) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/7fa325c3-0244-4855-b465-b032331d3970' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261021.618",
   "Commit: 21505ad2541d5be6135ed84fc33697146cf75b8e",
   "Build Date: 2026-10-21T00:45:21Z",
   "Worker ID: {3063bb04-5f10-486e-a29b-fcb70323396c}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261025.179.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261025.179/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261025.179",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=eb96b4\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=eb96b4\"",
   "##[command]/usr/bin/docker network create --label eb96b4 github_network_0026bc8b95ee464985a82a089b21661a",
   "8680f67f596f9ac87dfcdcf257ac459c6b8caa5d42a472fccd24e34e34d0a2be",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "6fc242d221a6: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "fbc84e711712: Download complete",
   "7e6d71cb0490: Download complete",
   "00ff7a4924f2: Download complete",
   "d0fbcb0db440: Download complete",
   "d06edb2e3f43: Download complete",
   "1b52931e2f91: Download complete",
   "cea4f0db46a6: Download complete",
   "d89068781d71: Download complete",
   "7c25aa4e8a77: Download complete",
   "879995175298: Download complete",
   "6fc242d221a6: Download complete",
   "9b1a18996a22: Download complete",
   "3795839385bc: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Pull complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "3795839385bc: Pull complete",
   "cea4f0db46a6: Pull complete",
   "9b1a18996a22: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 1678c369444d4f9dad9ef6b301771181_postgres18_8b5163 --label eb96b4 --network github_network_0026bc8b95ee464985a82a089b21661a --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "##[command]/usr/bin/docker start cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "##[command]/usr/bin/docker ps --all --filter id=cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "starting",
   "postgres service is starting, waiting 3 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/953c369c-18a1-40a2-9524-e276f9ea5f4a' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08:refs/remotes/origin/main",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08 -> origin/main",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B main refs/remotes/origin/main",
   "Switched to a new branch 'main'",
   "branch 'main' set up to track 'origin/main'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "47d30ecf8dcbbdcc81c65af7339e5efd21a0ad08"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.1/x64",
   "(node:2547) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.1",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.1/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2547) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36396297 of 36396297 (100.0%), 109.2 MBs/sec",
   "Cache Size: ~35 MB (36396297 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/3557d456-7f4e-4729-9880-70d960bc14ea/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 7s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "smoke · Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2829) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/f0cafc32-b632-4bfe-adb7-a1475143c253' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 1678c369444d4f9dad9ef6b301771181_postgres18_8b5163",
   "##[command]/usr/bin/docker logs --details cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " This user must also own the server process.",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:20:46.683 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:20:46.683 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:20:46.683 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:20:46.684 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:20:46.688 UTC [76] LOG:  database system was shut down at 2026-11-04 14:20:46 UTC",
   " 2026-11-04 14:20:46.691 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:21:08.885 UTC [74] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:21:08.888 UTC [74] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.003 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4545 kB, estimate=4545 kB; lsn=0/2012268, redo lsn=0/2012210",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:20:45.931 UTC [54] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:20:45.932 UTC [54] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:20:45.935 UTC [60] LOG:  database system was shut down at 2026-11-04 14:20:44 UTC",
   " 2026-11-04 14:20:45.937 UTC [54] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:20:46.560 UTC [54] LOG:  received fast shutdown request",
   " .2026-11-04 14:20:46.560 UTC [54] LOG:  aborting any active transactions",
   " 2026-11-04 14:20:46.563 UTC [54] LOG:  background worker \"logical replication launcher\" (PID 63) exited with exit code 1",
   " 2026-11-04 14:20:46.563 UTC [58] LOG:  shutting down",
   " 2026-11-04 14:20:46.563 UTC [58] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:20:46.649 UTC [58] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.084 s, sync=0.002 s, total=0.087 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:20:46.659 UTC [54] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 1678c369444d4f9dad9ef6b301771181_postgres18_8b5163",
   "##[command]/usr/bin/docker rm --force cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "cb397a2c9ad5406fd8ed939e139a0fc506b05fcf88f25d511bc729feccaafb34",
   "Remove container network: github_network_0026bc8b95ee464985a82a089b21661a",
   "##[command]/usr/bin/docker network rm github_network_0026bc8b95ee464985a82a089b21661a",
   "github_network_0026bc8b95ee464985a82a089b21661a"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_40 = {
 "id": "41844500453",
 "n": 23,
 "title": "sinov: AI yozgan workflow — smoke + PostgreSQL xizmati (ai1)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "cbf13e3",
 "st": "ok",
 "dur": "49 s",
 "at": "2026-11-04T14:07:53Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "43 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Initialize containers",
     "ok",
     "12 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "9 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "4 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "8 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {8210330a-4c48-4b29-831f-437b936a51ab}",
   "Region: eastus2",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=17ecfa\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=17ecfa\"",
   "##[command]/usr/bin/docker network create --label 17ecfa github_network_99f62ecc73214b37843c20fd0862ac62",
   "05ce8b30e65f6f9729db53e8dff67c84dbefd98536accec1a3958b7bbf36ae9f",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "6fc242d221a6: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "7c25aa4e8a77: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "7e6d71cb0490: Download complete",
   "00ff7a4924f2: Download complete",
   "879995175298: Download complete",
   "cea4f0db46a6: Download complete",
   "d0fbcb0db440: Download complete",
   "d06edb2e3f43: Download complete",
   "7c25aa4e8a77: Download complete",
   "fbc84e711712: Download complete",
   "d89068781d71: Download complete",
   "1b52931e2f91: Download complete",
   "6fc242d221a6: Download complete",
   "9b1a18996a22: Download complete",
   "3795839385bc: Download complete",
   "a3fcee8384ca: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "9b1a18996a22: Pull complete",
   "879995175298: Pull complete",
   "fbc84e711712: Pull complete",
   "d89068781d71: Pull complete",
   "7e6d71cb0490: Pull complete",
   "00ff7a4924f2: Pull complete",
   "d0fbcb0db440: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "ef90fb83cca5: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 03fc1ae5f5cf4406b42464e953c47f36_postgres18_582b94 --label 17ecfa --network github_network_99f62ecc73214b37843c20fd0862ac62 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_USER=postgres\" -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "##[command]/usr/bin/docker start 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "##[command]/usr/bin/docker ps --all --filter id=009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "healthy",
   "postgres service is healthy."
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/8b44f089-fe13-4b15-8476-dcbb0da68fac' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +cbf13e327661a77ec44f82ec1867490e6325971a:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         cbf13e327661a77ec44f82ec1867490e6325971a -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "cbf13e327661a77ec44f82ec1867490e6325971a"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2764) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2764) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 130.0 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/3aaab27b-47d4-4fbe-8d0f-698e6e6cc2de/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 9s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.523 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3240) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/c8fef0d1-509c-47b7-a20b-63d084196ff1' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Stop containers": [
   "Print service container logs: 03fc1ae5f5cf4406b42464e953c47f36_postgres18_582b94",
   "##[command]/usr/bin/docker logs --details 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:08:04.619 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " 2026-11-04 14:08:04.619 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:08:04.619 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:08:04.620 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:08:04.624 UTC [75] LOG:  database system was shut down at 2026-11-04 14:08:04 UTC",
   " 2026-11-04 14:08:04.628 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-04 14:08:37.345 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:08:37.349 UTC [73] LOG:  checkpoint complete: wrote 43 buffers (0.3%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.002 s, sync=0.001 s, total=0.004 s; sync files=14, longest=0.001 s, average=0.001 s; distance=4857 kB, estimate=4857 kB; lsn=0/2060160, redo lsn=0/2060108",
   " This user must also own the server process.",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:08:04.294 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:08:04.295 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:08:04.299 UTC [59] LOG:  database system was shut down at 2026-11-04 14:08:04 UTC",
   " 2026-11-04 14:08:04.301 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:08:04.496 UTC [53] LOG:  received fast shutdown request",
   " .2026-11-04 14:08:04.497 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:08:04.500 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:08:04.500 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:08:04.501 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:08:04.516 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.013 s, sync=0.002 s, total=0.016 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:08:04.528 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 03fc1ae5f5cf4406b42464e953c47f36_postgres18_582b94",
   "##[command]/usr/bin/docker rm --force 009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "009acab8069312fae3edc8b161ddabb6ac2f986691bf38d0e5931b8435c788e1",
   "Remove container network: github_network_99f62ecc73214b37843c20fd0862ac62",
   "##[command]/usr/bin/docker network rm github_network_99f62ecc73214b37843c20fd0862ac62",
   "github_network_99f62ecc73214b37843c20fd0862ac62"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_41 = {
 "id": "41844703019",
 "n": 24,
 "title": "sinov: AI yozgan workflow — smoke + PostgreSQL xizmati (ai2)",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "94937cc",
 "st": "ok",
 "dur": "46 s",
 "at": "2026-11-04T14:09:08Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "42 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "12 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "3 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Run npm run smoke",
     "ok",
     "8 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "1 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261028.624",
   "Commit: 54898b74c23fde5556c9b3c3a2290865feef0dfe",
   "Build Date: 2026-10-28T21:51:42Z",
   "Worker ID: {5668318e-7b5c-4144-ba2a-8e51819adbb2}",
   "Region: eastus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261101.186.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261101.186/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261101.186",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=8d48c9\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=8d48c9\"",
   "##[command]/usr/bin/docker network create --label 8d48c9 github_network_a80041c55268404b84f5a661fc0c8901",
   "275b877d2a161f620bed410391b50d230c91656707cf312111809a689d51fd90",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "7c25aa4e8a77: Pulling fs layer",
   "d89068781d71: Pulling fs layer",
   "fbc84e711712: Pulling fs layer",
   "d0fbcb0db440: Pulling fs layer",
   "3795839385bc: Pulling fs layer",
   "9b1a18996a22: Pulling fs layer",
   "6fc242d221a6: Pulling fs layer",
   "ef90fb83cca5: Pulling fs layer",
   "d06edb2e3f43: Pulling fs layer",
   "879995175298: Pulling fs layer",
   "00ff7a4924f2: Pulling fs layer",
   "7e6d71cb0490: Pulling fs layer",
   "cea4f0db46a6: Pulling fs layer",
   "d0fbcb0db440: Download complete",
   "9b1a18996a22: Download complete",
   "00ff7a4924f2: Download complete",
   "d89068781d71: Download complete",
   "7c25aa4e8a77: Download complete",
   "1b52931e2f91: Download complete",
   "cea4f0db46a6: Download complete",
   "d06edb2e3f43: Download complete",
   "879995175298: Download complete",
   "7e6d71cb0490: Download complete",
   "fbc84e711712: Download complete",
   "a3fcee8384ca: Download complete",
   "6fc242d221a6: Download complete",
   "3795839385bc: Download complete",
   "ef90fb83cca5: Download complete",
   "d06edb2e3f43: Pull complete",
   "6fc242d221a6: Pull complete",
   "cea4f0db46a6: Pull complete",
   "3795839385bc: Pull complete",
   "9b1a18996a22: Pull complete",
   "d89068781d71: Pull complete",
   "879995175298: Pull complete",
   "fbc84e711712: Pull complete",
   "ef90fb83cca5: Pull complete",
   "d0fbcb0db440: Pull complete",
   "00ff7a4924f2: Pull complete",
   "7c25aa4e8a77: Pull complete",
   "7e6d71cb0490: Pull complete",
   "Digest: sha256:3a4264520e121176619f54ff867d12774bc81e95e7b84db58d63bccdb6144b81",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 4ada16619b124249bda547f87f48d5d2_postgres18_92190f --label 8d48c9 --network github_network_a80041c55268404b84f5a661fc0c8901 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_USER=postgres\" -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "##[command]/usr/bin/docker start 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "##[command]/usr/bin/docker ps --all --filter id=01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "starting",
   "postgres service is starting, waiting 4 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "healthy",
   "postgres service is healthy."
  ],
  "Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/e2b372b6-9f12-4605-ab5f-4177bda86cc6' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +94937cc525cfdef9fe4c901845dbeae63bbcdea3:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         94937cc525cfdef9fe4c901845dbeae63bbcdea3 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "94937cc525cfdef9fe4c901845dbeae63bbcdea3"
  ],
  "Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.2/x64",
   "(node:2891) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.2",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.2/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2891) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36395187 of 36395187 (100.0%), 138.3 MBs/sec",
   "Cache Size: ~35 MB (36395187 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/9ddc8ba4-7162-4bc8-b626-7303459056b7/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "Run npm ci": [
   "$ npm ci",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "24 vulnerabilities (4 low, 18 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "Run npx tsc --noEmit": [
   "$ npx tsc --noEmit",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop"
  ],
  "Run npm test": [
   "$ npm test",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.848 s",
   "Ran all test suites."
  ],
  "Run npm run build": [
   "$ npm run build",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "Run npm run smoke": [
   "$ npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3328) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.0",
   "Temporarily overriding HOME='/home/runner/work/_temp/46544ba3-8dc5-4430-b221-cc9d4791578a' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "Stop containers": [
   "Print service container logs: 4ada16619b124249bda547f87f48d5d2_postgres18_92190f",
   "##[command]/usr/bin/docker logs --details 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-04 14:09:18.713 UTC [1] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:09:18.714 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-04 14:09:18.714 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-04 14:09:18.717 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:09:18.721 UTC [75] LOG:  database system was shut down at 2026-11-04 14:09:18 UTC",
   " 2026-11-04 14:09:18.725 UTC [1] LOG:  database system is ready to accept connections",
   " This user must also own the server process.",
   " 2026-11-04 14:09:50.903 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-04 14:09:50.906 UTC [73] LOG:  checkpoint complete: wrote 43 buffers (0.3%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.002 s, sync=0.001 s, total=0.004 s; sync files=14, longest=0.001 s, average=0.001 s; distance=4857 kB, estimate=4857 kB; lsn=0/2060160, redo lsn=0/2060108",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-04 14:09:18.387 UTC [53] LOG:  starting PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-04 14:09:18.388 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-04 14:09:18.392 UTC [59] LOG:  database system was shut down at 2026-11-04 14:09:18 UTC",
   " 2026-11-04 14:09:18.395 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-04 14:09:18.588 UTC [53] LOG:  received fast shutdown request",
   " .2026-11-04 14:09:18.589 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-04 14:09:18.591 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-04 14:09:18.592 UTC [57] LOG:  shutting down",
   " 2026-11-04 14:09:18.592 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-04 14:09:18.610 UTC [57] LOG:  checkpoint complete: wrote 943 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.016 s, sync=0.002 s, total=0.019 s; sync files=303, longest=0.001 s, average=0.001 s; distance=4352 kB, estimate=4352 kB; lsn=0/1BA1BE0, redo lsn=0/1BA1BE0",
   " 2026-11-04 14:09:18.622 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 4ada16619b124249bda547f87f48d5d2_postgres18_92190f",
   "##[command]/usr/bin/docker rm --force 01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "01db11191d85705c29decccf4f0884031bd0d90b128ac89c2947cce4f525f179",
   "Remove container network: github_network_a80041c55268404b84f5a661fc0c8901",
   "##[command]/usr/bin/docker network rm github_network_a80041c55268404b84f5a661fc0c8901",
   "github_network_a80041c55268404b84f5a661fc0c8901"
  ],
  "Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_42 = {
 "id": "45816680844",
 "n": 47,
 "title": "sinov: CI/CD-2 2-topshiriq (CI tilida) — 1-AI ci.yml",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "3ec6233",
 "st": "ok",
 "dur": "1 daq 1 s",
 "at": "2026-11-26T12:07:10Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "23 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "3 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "2 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "3 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "33 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Initialize containers",
     "ok",
     "14 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "4 s"
    ],
    [
     "Smoke (Telegram'siz)",
     "ok",
     "6 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Stop containers",
     "ok",
     "2 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "warning",
   "actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  [
   "warning",
   "actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 ],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261111.635",
   "Commit: b8a594ea514ff44cadb5342986c68b1eac6e22ed",
   "Build Date: 2026-11-11T01:49:01Z",
   "Worker ID: {18505821-aece-4aba-9df1-fb622b3b5725}",
   "Region: westus2",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261116.202.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261116.202/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261116.202",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/48aa979c-cc29-420c-a171-495632559ab9' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +3ec6233c45c0c6b579aaf8917d0653703d0dec97:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         3ec6233c45c0c6b579aaf8917d0653703d0dec97 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "3ec6233c45c0c6b579aaf8917d0653703d0dec97"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2842) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.3/x64",
   "node: v24.22.3",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.3/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2842) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 8388608 of 36237216 (23.1%), 8.0 MBs/sec",
   "Received 36237216 of 36237216 (100.0%), 30.7 MBs/sec",
   "Cache Size: ~35 MB (36237216 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/4520d40f-b5ce-4832-a6c4-f6cdfeae4e03/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "21 vulnerabilities (19 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.43 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3038) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/468aa6b3-d019-4cab-8b52-e040c7e7ef70' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261111.635",
   "Commit: b8a594ea514ff44cadb5342986c68b1eac6e22ed",
   "Build Date: 2026-11-11T01:49:01Z",
   "Worker ID: {f7e81aea-818a-4c00-9afe-19474174318a}",
   "Region: centralus",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261122.9.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261122.9/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261122.9",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Initialize containers": [
   "##[command]/usr/bin/docker version --format '{{.Server.APIVersion}}'",
   "'1.54'",
   "Docker daemon API version: '1.54'",
   "##[command]/usr/bin/docker version --format '{{.Client.APIVersion}}'",
   "'1.54'",
   "Docker client API version: '1.54'",
   "##[command]/usr/bin/docker ps --all --quiet --no-trunc --filter \"label=be4d69\"",
   "##[command]/usr/bin/docker network prune --force --filter \"label=be4d69\"",
   "##[command]/usr/bin/docker network create --label be4d69 github_network_9a7f0839fd5342a3b460f4ce376dca31",
   "2fb7bd0f6f293154a0c075b069b6ef14e2e21f9e8e4c7138347a8de74805a791",
   "##[command]/usr/bin/docker pull postgres:18",
   "18: Pulling from library/postgres",
   "0f12a37b90bb: Pulling fs layer",
   "7fe3468bf416: Pulling fs layer",
   "1c59edd7eb40: Pulling fs layer",
   "40748add9f4f: Pulling fs layer",
   "7cb67b3b537a: Pulling fs layer",
   "61061a425fb0: Pulling fs layer",
   "8e4857f35fce: Pulling fs layer",
   "84a852dae169: Pulling fs layer",
   "0afa8bd0fe3a: Pulling fs layer",
   "a1361b767ece: Pulling fs layer",
   "c1436cf65049: Pulling fs layer",
   "edf2405c6afe: Pulling fs layer",
   "7fe3468bf416: Download complete",
   "61061a425fb0: Download complete",
   "8e4857f35fce: Download complete",
   "7cb67b3b537a: Download complete",
   "0afa8bd0fe3a: Download complete",
   "84a852dae169: Download complete",
   "1c59edd7eb40: Download complete",
   "0f12a37b90bb: Download complete",
   "59e8b6ceb028: Download complete",
   "c1436cf65049: Download complete",
   "a1361b767ece: Download complete",
   "40748add9f4f: Download complete",
   "3c65b9afb00e: Download complete",
   "8e4857f35fce: Pull complete",
   "40748add9f4f: Pull complete",
   "0f12a37b90bb: Pull complete",
   "c1436cf65049: Pull complete",
   "7fe3468bf416: Pull complete",
   "0afa8bd0fe3a: Pull complete",
   "84a852dae169: Pull complete",
   "a1361b767ece: Pull complete",
   "edf2405c6afe: Download complete",
   "61061a425fb0: Pull complete",
   "7cb67b3b537a: Pull complete",
   "1c59edd7eb40: Pull complete",
   "edf2405c6afe: Pull complete",
   "Digest: sha256:c699303802144847d238196173655dbbecf7a96aeca1565f2b02eb671a1f0b6b",
   "Status: Downloaded newer image for postgres:18",
   "docker.io/library/postgres:18",
   "##[command]/usr/bin/docker create --name 1d66a7241cfa424581a5a571ae25d968_postgres18_f07b24 --label be4d69 --network github_network_9a7f0839fd5342a3b460f4ce376dca31 --network-alias postgres -p 5432:5432 --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-timeout 5s --health-retries 10 -e \"POSTGRES_USER=postgres\" -e \"POSTGRES_PASSWORD=postgres\" -e \"POSTGRES_DB=shop\" -e GITHUB_ACTIONS=true -e CI=true postgres:18",
   "49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "##[command]/usr/bin/docker start 49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "##[command]/usr/bin/docker ps --all --filter id=49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2 --filter status=running --no-trunc --format \"{{.ID}} {{.Status}}\"",
   "49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2 Up Less than a second (health: starting)",
   "##[command]/usr/bin/docker port 49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "5432/tcp -> 0.0.0.0:5432",
   "5432/tcp -> [::]:5432",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "starting",
   "postgres service is starting, waiting 2 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "starting",
   "postgres service is starting, waiting 3 seconds before checking again.",
   "##[command]/usr/bin/docker inspect --format=\"{{if .Config.Healthcheck}}{{print .State.Health.Status}}{{end}}\" 49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "healthy",
   "postgres service is healthy."
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/503f472f-6dde-4494-9657-a9100d0f3dcc' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +3ec6233c45c0c6b579aaf8917d0653703d0dec97:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         3ec6233c45c0c6b579aaf8917d0653703d0dec97 -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "3ec6233c45c0c6b579aaf8917d0653703d0dec97"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.3/x64",
   "(node:2579) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.3",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.3/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2579) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36237216 of 36237216 (100.0%), 62.2 MBs/sec",
   "Cache Size: ~35 MB (36237216 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/f842b9c9-a1fe-430b-88f9-e0e3ce40b17a/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 4s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "21 vulnerabilities (19 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "smoke · Smoke (Telegram'siz)": [
   "npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2838) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/eee60701-6bf8-4804-9754-22ed88973979' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Stop containers": [
   "Print service container logs: 1d66a7241cfa424581a5a571ae25d968_postgres18_f07b24",
   "##[command]/usr/bin/docker logs --details 49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   " initdb: warning: enabling \"trust\" authentication for local connections",
   " The files belonging to this database system will be owned by user \"postgres\".",
   " This user must also own the server process.",
   " initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.",
   " 2026-11-26 12:07:50.302 UTC [1] LOG:  starting PostgreSQL 18.7 (Debian 18.7-1.pgdg13+5) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-26 12:07:50.302 UTC [1] LOG:  listening on IPv4 address \"0.0.0.0\", port 5432",
   " 2026-11-26 12:07:50.302 UTC [1] LOG:  listening on IPv6 address \"::\", port 5432",
   " 2026-11-26 12:07:50.310 UTC [1] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-26 12:07:50.314 UTC [75] LOG:  database system was shut down at 2026-11-26 12:07:50 UTC",
   " 2026-11-26 12:07:50.317 UTC [1] LOG:  database system is ready to accept connections",
   " 2026-11-26 12:08:07.277 UTC [73] LOG:  checkpoint starting: immediate force wait",
   " 2026-11-26 12:08:07.281 UTC [73] LOG:  checkpoint complete: wrote 3 buffers (0.0%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 1 recycled; write=0.001 s, sync=0.001 s, total=0.004 s; sync files=5, longest=0.001 s, average=0.001 s; distance=4621 kB, estimate=4621 kB; lsn=0/204A600, redo lsn=0/204A5A8",
   " The database cluster will be initialized with locale \"en_US.utf8\".",
   " The default database encoding has accordingly been set to \"UTF8\".",
   " The default text search configuration will be set to \"english\".",
   " Data page checksums are enabled.",
   " fixing permissions on existing directory /var/lib/postgresql/18/docker ... ok",
   " creating subdirectories ... ok",
   " selecting dynamic shared memory implementation ... posix",
   " selecting default \"max_connections\" ... 100",
   " selecting default \"shared_buffers\" ... 128MB",
   " selecting default time zone ... Etc/UTC",
   " creating configuration files ... ok",
   " running bootstrap script ... ok",
   " performing post-bootstrap initialization ... ok",
   " syncing data to disk ... ok",
   " Success. You can now start the database server using:",
   "     pg_ctl -D /var/lib/postgresql/18/docker -l logfile start",
   " waiting for server to start....2026-11-26 12:07:49.907 UTC [53] LOG:  starting PostgreSQL 18.7 (Debian 18.7-1.pgdg13+5) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit",
   " 2026-11-26 12:07:49.907 UTC [53] LOG:  listening on Unix socket \"/var/run/postgresql/.s.PGSQL.5432\"",
   " 2026-11-26 12:07:49.910 UTC [59] LOG:  database system was shut down at 2026-11-26 12:07:49 UTC",
   " 2026-11-26 12:07:49.913 UTC [53] LOG:  database system is ready to accept connections",
   "  done",
   " server started",
   " CREATE DATABASE",
   " /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*",
   " waiting for server to shut down...2026-11-26 12:07:50.082 UTC [53] LOG:  received fast shutdown request",
   " .2026-11-26 12:07:50.083 UTC [53] LOG:  aborting any active transactions",
   " 2026-11-26 12:07:50.085 UTC [53] LOG:  background worker \"logical replication launcher\" (PID 62) exited with exit code 1",
   " 2026-11-26 12:07:50.086 UTC [57] LOG:  shutting down",
   " 2026-11-26 12:07:50.086 UTC [57] LOG:  checkpoint starting: shutdown immediate",
   " 2026-11-26 12:07:50.178 UTC [57] LOG:  checkpoint complete: wrote 952 buffers (5.8%), wrote 3 SLRU buffers; 0 WAL file(s) added, 0 removed, 0 recycled; write=0.064 s, sync=0.008 s, total=0.093 s; sync files=303, longest=0.007 s, average=0.001 s; distance=4428 kB, estimate=4428 kB; lsn=0/1BC6EA8, redo lsn=0/1BC6EA8",
   " 2026-11-26 12:07:50.189 UTC [53] LOG:  database system is shut down",
   "  done",
   " server stopped",
   " PostgreSQL init process complete; ready for start up.",
   "Stop and remove container: 1d66a7241cfa424581a5a571ae25d968_postgres18_f07b24",
   "##[command]/usr/bin/docker rm --force 49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "49a84b9fc9a200dbefe97ac7ed8819e116b80a94ed3869b71edce163bbd20eb2",
   "Remove container network: github_network_9a7f0839fd5342a3b460f4ce376dca31",
   "##[command]/usr/bin/docker network rm github_network_9a7f0839fd5342a3b460f4ce376dca31",
   "github_network_9a7f0839fd5342a3b460f4ce376dca31"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_RUNS_43 = {
 "id": "45816907134",
 "n": 48,
 "title": "sinov: CI/CD-2 2-topshiriq (CI tilida) — 2-AI ci.yml",
 "ev": "push",
 "br": "ci-sinov",
 "sha": "e949645",
 "st": "ok",
 "dur": "58 s",
 "at": "2026-11-26T12:08:38Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "17 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "2 s"
    ],
    [
     "Run npm ci",
     "ok",
     "5 s"
    ],
    [
     "Run npx tsc --noEmit",
     "ok",
     "1 s"
    ],
    [
     "Run npm test",
     "ok",
     "2 s"
    ],
    [
     "Run npm run build",
     "ok",
     "2 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  },
  {
   "name": "smoke",
   "st": "ok",
   "dur": "37 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "1 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "4 s"
    ],
    [
     "Run npm ci",
     "ok",
     "8 s"
    ],
    [
     "PostgreSQL vaqtincha ko'tarish",
     "ok",
     "11 s"
    ],
    [
     "PostgreSQL tayyorligini kutish",
     "ok",
     "2 s"
    ],
    [
     "Smoke (Telegram'siz)",
     "ok",
     "8 s"
    ],
    [
     "PostgreSQL to'xtatish",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "ok",
     "0 s"
    ],
    [
     "Post Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Complete job",
     "ok",
     "0 s"
    ]
   ]
  }
 ],
 "ann": [
  [
   "warning",
   "actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  [
   "warning",
   "actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 ],
 "wfIssue": false,
 "log": {
  "test · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261111.635",
   "Commit: b8a594ea514ff44cadb5342986c68b1eac6e22ed",
   "Build Date: 2026-11-11T01:49:01Z",
   "Worker ID: {2867be16-0759-4bfe-9b4f-9da3d59f58fe}",
   "Region: westus3",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261122.9.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261122.9/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261122.9",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: test"
  ],
  "test · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/004356a2-6ed0-4a19-beea-5502ea4f86bd' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +e949645f9c5d8377efc202b0b049bb0d9a69c8ed:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         e949645f9c5d8377efc202b0b049bb0d9a69c8ed -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "e949645f9c5d8377efc202b0b049bb0d9a69c8ed"
  ],
  "test · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.3/x64",
   "(node:2175) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.3",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.3/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2175) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36237216 of 36237216 (100.0%), 39.4 MBs/sec",
   "Cache Size: ~35 MB (36237216 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/bc81043d-72b3-41bd-828f-f620bd10af26/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "test · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 4s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "21 vulnerabilities (19 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "test · Run npx tsc --noEmit": [
   "$ npx tsc --noEmit"
  ],
  "test · Run npm test": [
   "$ npm test",
   "> order-bot-nest@1.0.0 test",
   "> jest",
   "PASS src/api/telegram/keyboards.spec.ts",
   "PASS src/api/telegram/phone.spec.ts",
   "PASS src/api/telegram/texts.spec.ts",
   "PASS src/api/app.controller.spec.ts",
   "PASS src/api/order/order.service.spec.ts",
   "Test Suites: 5 passed, 5 total",
   "Tests:       25 passed, 25 total",
   "Snapshots:   0 total",
   "Time:        1.031 s",
   "Ran all test suites."
  ],
  "test · Run npm run build": [
   "$ npm run build",
   "> order-bot-nest@1.0.0 build",
   "> nest build"
  ],
  "test · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:2371) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "test · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/bd2e2348-8f01-4630-aa11-f97aea5506f6' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "test · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ],
  "smoke · Set up job": [
   "Current runner version: '2.338.2'",
   "Hosted Compute Agent",
   "Version: 20261111.635",
   "Commit: b8a594ea514ff44cadb5342986c68b1eac6e22ed",
   "Build Date: 2026-11-11T01:49:01Z",
   "Worker ID: {90cd9bef-ad99-4f12-bf1c-29bbc9b3076e}",
   "Region: eastus2",
   "Cloud: Azure",
   "Ubuntu",
   "26.04.1",
   "LTS",
   "Image: ubuntu-26.04",
   "Version: 20261116.202.1",
   "Included Software: https://github.com/actions/runner-images/blob/ubuntu26/20261116.202/images/ubuntu/Ubuntu2604-Readme.md",
   "Image Release: https://github.com/actions/runner-images/releases/tag/ubuntu26%2F20261116.202",
   "Contents: read",
   "Metadata: read",
   "Packages: read",
   "Secret source: Actions",
   "Cache mode: write",
   "Prepare workflow directory",
   "Prepare all required actions",
   "Getting action download info",
   "Download action repository 'actions/checkout@v4' (SHA:11d5960a326750d5838078e36cf38b85af677262)",
   "Download action repository 'actions/setup-node@v4' (SHA:49933ea5288caeca8642d1e84afbd3f7d6820020)",
   "Complete job name: smoke"
  ],
  "smoke · Run actions/checkout@v4": [
   "with:",
   "  repository: Azizbekcrypto/OrderBotNest",
   "  token: ***",
   "  ssh-strict: true",
   "  ssh-user: git",
   "  persist-credentials: true",
   "  clean: true",
   "  sparse-checkout-cone-mode: true",
   "  fetch-depth: 1",
   "  fetch-tags: false",
   "  show-progress: true",
   "  lfs: false",
   "  submodules: false",
   "  set-safe-directory: true",
   "  allow-unsafe-pr-checkout: false",
   "Syncing repository: Azizbekcrypto/OrderBotNest",
   "Working directory is '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/c7cf961c-e64e-4a4e-92c6-41f47c44674c' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "Deleting the contents of '/home/runner/work/OrderBotNest/OrderBotNest'",
   "[command]/usr/bin/git init /home/runner/work/OrderBotNest/OrderBotNest",
   "hint: Using 'master' as the name for the initial branch. This default branch name",
   "hint: will change to \"main\" in Git 3.0. To configure the initial branch name",
   "hint: to use in all of your new repositories, which will suppress this warning,",
   "hint: call:",
   "hint:",
   "hint: \tgit config --global init.defaultBranch <name>",
   "hint:",
   "hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and",
   "hint: 'development'. The just-created branch can be renamed via this command:",
   "hint:",
   "hint: \tgit branch -m <name>",
   "hint:",
   "hint: Disable this message with \"git config set advice.defaultBranchName false\"",
   "Initialized empty Git repository in /home/runner/work/OrderBotNest/OrderBotNest/.git/",
   "[command]/usr/bin/git remote add origin https://github.com/Azizbekcrypto/OrderBotNest",
   "[command]/usr/bin/git config --local gc.auto 0",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url",
   "[command]/usr/bin/git config --local http.https://github.com/.extraheader AUTHORIZATION: basic ***",
   "[command]/usr/bin/git -c protocol.version=2 fetch --no-tags --prune --no-recurse-submodules --depth=1 origin +e949645f9c5d8377efc202b0b049bb0d9a69c8ed:refs/remotes/origin/ci-sinov",
   "From https://github.com/Azizbekcrypto/OrderBotNest",
   " * [new ref]         e949645f9c5d8377efc202b0b049bb0d9a69c8ed -> origin/ci-sinov",
   "[command]/usr/bin/git sparse-checkout disable",
   "[command]/usr/bin/git config --local --unset-all extensions.worktreeConfig",
   "[command]/usr/bin/git checkout --progress --force -B ci-sinov refs/remotes/origin/ci-sinov",
   "Switched to a new branch 'ci-sinov'",
   "branch 'ci-sinov' set up to track 'origin/ci-sinov'.",
   "[command]/usr/bin/git log -1 --format=%H",
   "e949645f9c5d8377efc202b0b049bb0d9a69c8ed"
  ],
  "smoke · Run actions/setup-node@v4": [
   "with:",
   "  node-version: 24",
   "  cache: npm",
   "  always-auth: false",
   "  check-latest: false",
   "  token: ***",
   "(node:2468) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "Found in cache @ /opt/hostedtoolcache/node/24.22.3/x64",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "node: v24.22.3",
   "npm: 11.19.1",
   "yarn: 1.22.22",
   "[command]/opt/hostedtoolcache/node/24.22.3/x64/bin/npm config get cache",
   "/home/runner/.npm",
   "Cache hit for: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79",
   "(node:2468) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.",
   "Received 36237216 of 36237216 (100.0%), 112.9 MBs/sec",
   "Cache Size: ~35 MB (36237216 B)",
   "[command]/usr/bin/tar -xf /home/runner/work/_temp/d6d87c8f-44b8-4ff3-92bc-debc43b7e922/cache.tzst -P -C /home/runner/work/OrderBotNest/OrderBotNest --use-compress-program unzstd",
   "Cache restored successfully",
   "Cache restored from key: node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79"
  ],
  "smoke · Run npm ci": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 8s",
   "133 packages are looking for funding",
   "  run `npm fund` for details",
   "21 vulnerabilities (19 moderate, 2 high)",
   "To address issues that do not require attention, run:",
   "  npm audit fix",
   "To address all issues (including breaking changes), run:",
   "  npm audit fix --force",
   "Run `npm audit` for details.",
   "npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:",
   "npm warn install-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)",
   "npm warn install-scripts",
   "npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  ],
  "smoke · PostgreSQL vaqtincha ko'tarish": [
   "docker run -d --name pg-smoke -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=shop -p 5432:5432 postgres:16",
   "Unable to find image 'postgres:16' locally",
   "16: Pulling from library/postgres",
   "1be8baae3c53: Pulling fs layer",
   "9be9d0609035: Pulling fs layer",
   "111f378001d9: Pulling fs layer",
   "72bd85048465: Pulling fs layer",
   "cc2ed79b34db: Pulling fs layer",
   "3b9319a24e33: Pulling fs layer",
   "cfa3776983f1: Pulling fs layer",
   "46e4f78fd254: Pulling fs layer",
   "34ff39ac908b: Pulling fs layer",
   "91d82016f303: Pulling fs layer",
   "c362828e9ca3: Pulling fs layer",
   "40748add9f4f: Pulling fs layer",
   "e91b6b814ba6: Pulling fs layer",
   "9be9d0609035: Download complete",
   "111f378001d9: Download complete",
   "cc2ed79b34db: Download complete",
   "72bd85048465: Download complete",
   "cfa3776983f1: Download complete",
   "40748add9f4f: Download complete",
   "46e4f78fd254: Download complete",
   "1be8baae3c53: Download complete",
   "34ff39ac908b: Download complete",
   "91d82016f303: Download complete",
   "c362828e9ca3: Download complete",
   "e91b6b814ba6: Download complete",
   "3b9319a24e33: Download complete",
   "7aa47411d7c7: Download complete",
   "636bc81cf18f: Download complete",
   "40748add9f4f: Pull complete",
   "1be8baae3c53: Pull complete",
   "e91b6b814ba6: Pull complete",
   "46e4f78fd254: Pull complete",
   "111f378001d9: Pull complete",
   "9be9d0609035: Pull complete",
   "72bd85048465: Pull complete",
   "c362828e9ca3: Pull complete",
   "3b9319a24e33: Pull complete",
   "cc2ed79b34db: Pull complete",
   "34ff39ac908b: Pull complete",
   "91d82016f303: Pull complete",
   "cfa3776983f1: Pull complete",
   "Digest: sha256:07abc3f43c9395b0bdbbab36bc25ddb0e8d83cd4fcafb5fb7d6abe14ff156dd8",
   "Status: Downloaded newer image for postgres:16",
   "900dda9c6088dafdffa2fb4fd8227003f32330cb7032ee04065f8b309f441485"
  ],
  "smoke · PostgreSQL tayyorligini kutish": [
   "for i in $(seq 1 30); do",
   "  if docker exec pg-smoke pg_isready -h 127.0.0.1 -U postgres -q; then",
   "    echo \"PostgreSQL tayyor\"",
   "    exit 0",
   "  fi",
   "  sleep 2",
   "done",
   "echo \"PostgreSQL 60 soniyada tayyor bo'lmadi\"",
   "docker logs pg-smoke",
   "exit 1",
   "PostgreSQL tayyor"
  ],
  "smoke · Smoke (Telegram'siz)": [
   "npm run smoke",
   "env:",
   "  DATABASE_URL: ***localhost:5432/shop",
   "> order-bot-nest@1.0.0 smoke",
   "> node scripts/smoke.js",
   "== build ==",
   "== vaqtinchalik baza: shop_smoke ==",
   "Telegram bot ulandi",
   "  katalogda 6 ta mahsulot",
   "— restart: har qadam alohida jarayonda (server haqiqatan qayta ishga tushadi)",
   "  ✓ telefon kutish restartdan o'tdi → «Buyurtma #1 qabul qilindi!»",
   "  ✓ savat restartdan o'tdi → «Savat:»",
   "  ✓ buyurtma restartdan o'tdi → «#1 · Aziza · 120 000 so'm · 🆕 Yangi»",
   "— race: 1 ta Planshet, 5 mijoz bir vaqtda (3 raund); keyin ikki marta bekor",
   "Telegram bot ulandi",
   "  rad etilgan mijoz: «Buyurtma berilmadi: Planshet: omborda faqat 0 ta qoldi»",
   "  ✓ ortiqcha sotilmadi (sotildi/ombor): 1/0  1/0  1/0",
   "  ✓ ikki marta bir vaqtda bekor — ombor bir marta qaytdi: 0 → 1",
   "NATIJA: 5/5 ✓"
  ],
  "smoke · PostgreSQL to'xtatish": [
   "docker rm -f pg-smoke || true",
   "pg-smoke"
  ],
  "smoke · Post Run actions/setup-node@v4": [
   "Post job cleanup.",
   "(node:3025) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.",
   "(Use `node --trace-deprecation ...` to show where the warning was created)",
   "Cache hit occurred on the primary key node-cache-Linux-x64-npm-ccb2b15dd267c884b0610f9549734f2a266074ea2630c8be582139d289f32d79, not saving cache."
  ],
  "smoke · Post Run actions/checkout@v4": [
   "Post job cleanup.",
   "[command]/usr/bin/git version",
   "git version 2.56.1",
   "Temporarily overriding HOME='/home/runner/work/_temp/23030c63-1f3b-451a-ab7f-16c87a78d014' before making global git config changes",
   "Adding repository directory to the temporary git global config as a safe directory",
   "[command]/usr/bin/git config --global --add safe.directory /home/runner/work/OrderBotNest/OrderBotNest",
   "[command]/usr/bin/git config --local --name-only --get-regexp core\\.sshCommand",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'core\\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp http\\.https\\:\\/\\/github\\.com\\/\\.extraheader",
   "http.https://github.com/.extraheader",
   "[command]/usr/bin/git config --local --unset-all http.https://github.com/.extraheader",
   "[command]/usr/bin/git submodule foreach --recursive sh -c \"git config --local --name-only --get-regexp 'http\\.https\\:\\/\\/github\\.com\\/\\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :\"",
   "[command]/usr/bin/git config --local --name-only --get-regexp ^includeIf\\.gitdir:",
   "[command]/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url"
  ],
  "smoke · Complete job": [
   "Cleaning up orphan processes",
   "##[warning]Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to run on Node.js 24: actions/checkout@v4, actions/setup-node@v4. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/"
  ]
 }
};
const KOD_PROMPT1 = "OrderBotNest'da `npm run smoke` buyrug'i bor — Telegram'siz tekshiruv, unga PostgreSQL kerak (DATABASE_URL). GitHub Actions workflow'iga shu smoke'ni ham qo'shib ber: har push'da testlar va smoke yursin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), .github/workflows/ci.yml bor (job test: checkout · setup-node · npm ci · npx tsc --noEmit · npm test · npm run build). npm run smoke — Telegram'siz tekshiruv (scripts/smoke.js), unga ishlayotgan PostgreSQL va DATABASE_URL kerak; smoke <baza>_smoke bazasini o'zi ochib o'chiradi. Vazifa: ci.ymlga ikkinchi job smoke qo'sh: needs: test; services: postgres (image: postgres:18, POSTGRES_PASSWORD: postgres, POSTGRES_DB: shop, ports: 5432:5432, pg_isready healthcheck); qadamlar: checkout, setup-node (node-version — mening raqamim, cache: npm), npm ci, npm run smoke (env: DATABASE_URL: postgresql://postgres:postgres@localhost:5432/shop). Secret ishlatma — konteyner. Boshqa fayllarga tegma. Javobda faylning to'liq matni.";
const KOD_TXT_36B = "$ gh pr view 1\ntitle:\tci: smoke job (PostgreSQL xizmati) va README badge\nstate:\tOPEN\nauthor:\tAzizbekcrypto (Azizbek)\nlabels:\t\nassignees:\t\nreviewers:\t\nprojects:\t\nmilestone:\t\nnumber:\t1\nurl:\thttps://github.com/Azizbekcrypto/OrderBotNest/pull/1\nadditions:\t29\ndeletions:\t1\nauto-merge:\tdisabled\n--\nLentaga ikkinchi job: `smoke` — `services: postgres:18`, `DATABASE_URL` secret'dan, `npm run smoke`. README'da lenta nishoni (badge). CI/CD-2 mentor darsi uchun (F-1104-21).\n\n$ gh pr checks 1\nsmoke\tpass\t39s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41845936594/job/126629568615\t\nsmoke\tpass\t35s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41846225069/job/126630675440\t\ntest\tpass\t24s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41845936594/job/126629310338\t\ntest\tpass\t20s\thttps://github.com/Azizbekcrypto/OrderBotNest/actions/runs/41846225069/job/126630420521\t\n\n## API: pulls/1\n{\"base\":\"main\",\"head\":\"lenta-smoke\",\"html_url\":\"https://github.com/Azizbekcrypto/OrderBotNest/pull/1\",\"mergeable\":true,\"mergeable_state\":\"clean\",\"number\":1,\"state\":\"open\",\"title\":\"ci: smoke job (PostgreSQL xizmati) va README badge\"}";
const KOD_TXT_00 = "$ gh secret list -R Azizbekcrypto/OrderBotNest\n\n# bor=0 · qiymat (foydalanuvchi yaratsa): postgresql://postgres:postgres@localhost:5432/shop";
const KOD = { CI_START: KOD_CI_START, CI_DONE: KOD_CI_DONE, README_BADGE: KOD_README_BADGE, SMOKE_URL: KOD_SMOKE_URL, SMOKE_DB: KOD_SMOKE_DB, PKG_SMOKE: KOD_PKG_SMOKE, YML_1_MATRIX: KOD_YML_1_MATRIX, YML_2_MATRIX_FAIL_FAST_FALSE: KOD_YML_2_MATRIX_FAIL_FAST_FALSE, YML_3_SMOKE_SERVICES: KOD_YML_3_SMOKE_SERVICES, YML_4_SMOKE_SECRET_XATO: KOD_YML_4_SMOKE_SECRET_XATO, YML_5_SECRET_ECHO: KOD_YML_5_SECRET_ECHO, YML_AI1: KOD_YML_AI1, YML_AI2: KOD_YML_AI2, OUT: { '00': KOD_OUT_00, '09': KOD_OUT_09, 'v1-01': KOD_OUT_V1_01, 'v1-02': KOD_OUT_V1_02, 'v1-03': KOD_OUT_V1_03, 'v1-04': KOD_OUT_V1_04 }, RUNS: { 'c1-10': KOD_RUNS_C1_10, 'c1-11': KOD_RUNS_C1_11, 'c1-15': KOD_RUNS_C1_15, 'c1-18': KOD_RUNS_C1_18, '30': KOD_RUNS_30, '31': KOD_RUNS_31, '32': KOD_RUNS_32, '33': KOD_RUNS_33, '35': KOD_RUNS_35, '36': KOD_RUNS_36, '37': KOD_RUNS_37, '40': KOD_RUNS_40, '41': KOD_RUNS_41, '42': KOD_RUNS_42, '43': KOD_RUNS_43 }, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2, TXT_36B: KOD_TXT_36B, TXT_00: KOD_TXT_00 };
