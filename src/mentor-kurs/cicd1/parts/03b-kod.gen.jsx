
// AVTO: feedback/F-1029-02-mentor-kurs/dev/cicd1-kod.py — OrderBotNest teglari, yml variantlari, toza-muhit chiqishlari va haqiqiy GitHub Actions run'lari (qo'lda tahrirlanmaydi)
const KOD_ORDER_36 = {
 "file": "src/api/order/order.service.ts",
 "tag": "jest2-done",
 "lines": [
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
  }
 ]
};
const KOD_USER_20 = {
 "file": "src/api/user/user.service.ts",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "  async getOrCreate(from: { id: number; first_name: string }): Promise<User> {",
   "n": 15
  },
  {
   "t": "    const telegram_id = String(from.id); // BIGINT bazadan matn bo'lib keladi — biz ham matn saqlaymiz",
   "n": 16
  },
  {
   "t": "    const role: Role = config.ADMIN_TELEGRAM_IDS.includes(from.id)",
   "n": 17
  },
  {
   "t": "      ? 'admin'",
   "n": 18
  },
  {
   "t": "      : 'customer';",
   "n": 19
  },
  {
   "t": "    let user = await this.repo.findOne({ where: { telegram_id } });",
   "n": 20
  },
  {
   "t": "    if (!user) {",
   "n": 21
  },
  {
   "t": "      user = this.repo.create({ telegram_id, name: from.first_name, role });",
   "n": 22
  },
  {
   "t": "      return this.repo.save(user);",
   "n": 23
  }
 ]
};
const KOD_PKG_TELEGRAF = {
 "file": "package.json",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "    \"reflect-metadata\": \"^0.2.2\",",
   "n": 28
  },
  {
   "t": "    \"rxjs\": \"^7.8.1\",",
   "n": 29
  },
  {
   "t": "    \"telegraf\": \"^4.16.3\",",
   "n": 30
  },
  {
   "t": "    \"typeorm\": \"^1.1.2\"",
   "n": 31
  },
  {
   "t": "  },",
   "n": 32
  }
 ]
};
const KOD_LOCK_TELEGRAF = {
 "file": "package-lock.json",
 "tag": "jest2-done",
 "lines": [
  {
   "t": "    \"node_modules/telegraf\": {",
   "n": 8158
  },
  {
   "t": "      \"version\": \"4.16.3\",",
   "n": 8159
  },
  {
   "t": "      \"resolved\": \"https://registry.npmjs.org/telegraf/-/telegraf-4.16.3.tgz\",",
   "n": 8160
  }
 ]
};
const KOD_CI_DONE = {
 "file": ".github/workflows/ci.yml",
 "tag": "cicd1-done",
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
const KOD_YML_1_TAVSIYA = {
 "file": ".github/workflows/ci.yml",
 "tag": "1-tavsiya.yml",
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
const KOD_YML_2_CHECKOUT_YOQ = {
 "file": ".github/workflows/ci.yml",
 "tag": "2-checkout-yoq.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
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
   "t": "      - uses: actions/setup-node@v4",
   "n": 7
  },
  {
   "t": "        with:",
   "n": 8
  },
  {
   "t": "          node-version: 24",
   "n": 9
  },
  {
   "t": "      - run: npm ci",
   "n": 10
  },
  {
   "t": "      - run: npm test",
   "n": 11
  }
 ]
};
const KOD_YML_3_RUNS_ON_YOQ = {
 "file": ".github/workflows/ci.yml",
 "tag": "3-runs-on-yoq.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
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
   "t": "    steps:",
   "n": 5
  },
  {
   "t": "      - uses: actions/checkout@v4",
   "n": 6
  },
  {
   "t": "      - run: npm test",
   "n": 7
  }
 ]
};
const KOD_YML_4_SURILISH_XATO = {
 "file": ".github/workflows/ci.yml",
 "tag": "4-surilish-xato.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
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
   "t": "    - uses: actions/checkout@v4",
   "n": 7
  },
  {
   "t": "      - run: npm ci",
   "n": 8
  },
  {
   "t": "      - run: npm test",
   "n": 9
  }
 ]
};
const KOD_YML_5_NPM_INSTALL = {
 "file": ".github/workflows/ci.yml",
 "tag": "5-npm-install.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
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
   "t": "      - run: npm install",
   "n": 11
  },
  {
   "t": "      - run: npm test",
   "n": 12
  }
 ]
};
const KOD_YML_6_TSC_YOQ = {
 "file": ".github/workflows/ci.yml",
 "tag": "6-tsc-yoq.yml",
 "lines": [
  {
   "t": "name: CI",
   "n": 1
  },
  {
   "t": "on: push",
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
   "t": "      - run: npm test",
   "n": 13
  }
 ]
};
const KOD_YML_AI1 = {
 "file": ".github/workflows/test.yml",
 "tag": "ai1",
 "lines": [
  {
   "t": "name: Tests",
   "n": 1
  },
  {
   "t": "",
   "n": 2
  },
  {
   "t": "on:",
   "n": 3
  },
  {
   "t": "  push:",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "jobs:",
   "n": 6
  },
  {
   "t": "  test:",
   "n": 7
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 8
  },
  {
   "t": "",
   "n": 9
  },
  {
   "t": "    steps:",
   "n": 10
  },
  {
   "t": "      - name: Kodni yuklab olish",
   "n": 11
  },
  {
   "t": "        uses: actions/checkout@v4",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "      - name: Node.js 22 o'rnatish",
   "n": 14
  },
  {
   "t": "        uses: actions/setup-node@v4",
   "n": 15
  },
  {
   "t": "        with:",
   "n": 16
  },
  {
   "t": "          node-version: 22",
   "n": 17
  },
  {
   "t": "          cache: npm",
   "n": 18
  },
  {
   "t": "",
   "n": 19
  },
  {
   "t": "      - name: Kutubxonalarni o'rnatish",
   "n": 20
  },
  {
   "t": "        run: npm ci",
   "n": 21
  },
  {
   "t": "",
   "n": 22
  },
  {
   "t": "      - name: Testlar",
   "n": 23
  },
  {
   "t": "        run: npm test",
   "n": 24
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
   "t": "",
   "n": 2
  },
  {
   "t": "on:",
   "n": 3
  },
  {
   "t": "  push:",
   "n": 4
  },
  {
   "t": "",
   "n": 5
  },
  {
   "t": "permissions:",
   "n": 6
  },
  {
   "t": "  contents: read",
   "n": 7
  },
  {
   "t": "",
   "n": 8
  },
  {
   "t": "jobs:",
   "n": 9
  },
  {
   "t": "  test:",
   "n": 10
  },
  {
   "t": "    name: Jest testlar",
   "n": 11
  },
  {
   "t": "    runs-on: ubuntu-latest",
   "n": 12
  },
  {
   "t": "",
   "n": 13
  },
  {
   "t": "    steps:",
   "n": 14
  },
  {
   "t": "      - name: Kodni olish",
   "n": 15
  },
  {
   "t": "        uses: actions/checkout@v4",
   "n": 16
  },
  {
   "t": "",
   "n": 17
  },
  {
   "t": "      - name: Node.js o'rnatish",
   "n": 18
  },
  {
   "t": "        uses: actions/setup-node@v4",
   "n": 19
  },
  {
   "t": "        with:",
   "n": 20
  },
  {
   "t": "          node-version: 22",
   "n": 21
  },
  {
   "t": "          cache: npm",
   "n": 22
  },
  {
   "t": "",
   "n": 23
  },
  {
   "t": "      - name: Bog'liqliklarni o'rnatish",
   "n": 24
  },
  {
   "t": "        run: npm ci",
   "n": 25
  },
  {
   "t": "",
   "n": 26
  },
  {
   "t": "      - name: Testlarni ishga tushirish",
   "n": 27
  },
  {
   "t": "        run: npm test",
   "n": 28
  }
 ]
};
const KOD_OUT_00 = "v24.18.0\n11.16.0\nHEAD e15a44c jest2-done: xato yo'li va chegara testlari — isPhone al\nWed Nov  4 05:19:25 PM +05 2026";
const KOD_OUT_01 = "# Toza clone (node_modules yo'q) — CI mashinasidagi kabi\n$ ls\nnest-cli.json\npackage.json\npackage-lock.json\nREADME.md\nscripts\nsrc\ntsconfig.json\n\n$ npm ci --no-audit --no-fund\nnpm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me\n\nadded 633 packages in 5s\nnpm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:\nnpm warn allow-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)\nnpm warn allow-scripts\nnpm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.\n[chiqish kodi: 0 · 5.7 s]\n\n$ npx tsc --noEmit\n[chiqish kodi: 0 · 2.6 s]\n\n$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nPASS src/api/telegram/phone.spec.ts\nPASS src/api/telegram/texts.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/app.controller.spec.ts\nPASS src/api/order/order.service.spec.ts\n\nTest Suites: 5 passed, 5 total\nTests:       25 passed, 25 total\nSnapshots:   0 total\nTime:        1.423 s\nRan all test suites.\n[chiqish kodi: 0 · 2.2 s]\n\n$ npm run build\n\n> order-bot-nest@1.0.0 build\n> nest build\n\n[chiqish kodi: 0 · 3.5 s]\n\n$ ls dist | head\napi\nconfig\ncore\ninfrastructure\nmain.d.ts\nmain.js\nmain.js.map\ntsconfig.tsbuildinfo";
const KOD_OUT_02 = "# order.service.ts 36: < → <= (chegara buzildi)\n$ npm ci && npx tsc --noEmit && npm test && npm run build\nnpm ci ✓\ntsc ✓\n> order-bot-nest@1.0.0 test\n> jest\nFAIL src/api/order/order.service.spec.ts\n  ● OrderService.place › chegara: omborda aynan 2 ta — 2 tasini olsa bo'ladi\n    Kolonka: omborda faqat 2 ta qoldi\n      35 |         if (!p) throw new Error(`Mahsulot topilmadi: ${c.product.name}`);\n      36 |         if (p.stock <= c.qty) {\n    > 37 |           throw new Error(`${p.name}: omborda faqat ${p.stock} ta qoldi`);\n         |                 ^\n      38 |         }\n      39 |         // 2) Ayiramiz. Bazadagi CHECK (stock >= 0) — oxirgi qo'riqchi: kod xato qilsa ham manfiy bo'lmaydi.\n      40 |         //    Diqqat: tranzaksiya ichida xato chiqsa, keyingi so'rovlar ham rad etiladi\nPASS src/api/app.controller.spec.ts\nPASS src/api/telegram/keyboards.spec.ts\nPASS src/api/telegram/texts.spec.ts\nPASS src/api/telegram/phone.spec.ts\nTest Suites: 1 failed, 4 passed, 5 total\nTests:       1 failed, 24 passed, 25 total\nSnapshots:   0 total\nTime:        1.159 s\nRan all test suites.\n[chiqish kodi: 1]";
const KOD_OUT_03 = "# package.json ga dayjs qo\\x27shildi, package-lock.json o\\x27zgarmadi\n$ npm ci --no-audit --no-fund\nnpm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me\n\nadded 633 packages in 5s\nnpm warn allow-scripts 1 package has install scripts not yet covered by allowScripts:\nnpm warn allow-scripts   @parcel/watcher@2.6.0 (install: node scripts/build-from-source.js)\nnpm warn allow-scripts\nnpm warn allow-scripts Run `npm approve-scripts --allow-scripts-pending` to review, or `npm approve-scripts <pkg>` to allow.\n[chiqish kodi: 0 · 5.2 s]";
const KOD_OUT_03B = "# package.json: telegraf ^4.16.3 → ^5.0.0, package-lock.json eski\n30:    \"telegraf\": \"^5.0.0\",\n$ npm ci --no-audit --no-fund\nnpm error code ETARGET\nnpm error notarget No matching version found for telegraf@^5.0.0.\nnpm error notarget In most cases you or one of your dependencies are requesting a package version that doesn't exist.\nnpm error A complete log of this run can be found in: /home/kali/.npm/_logs/2026-11-04T12_28_08_703Z-debug-0.log\n[chiqish kodi: 1]";
const KOD_OUT_03C = "# package.json: telegraf ^4.16.3 → 4.16.0 (mavjud versiya), package-lock.json da 4.16.3\n30:    \"telegraf\": \"4.16.0\",\n$ npm ci --no-audit --no-fund\nnpm error code EUSAGE\nnpm error\nnpm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.\nnpm error\nnpm error Invalid: lock file's telegraf@4.16.3 does not satisfy telegraf@4.16.0\nnpm error\nnpm error Clean install a project\nnpm error\nnpm error Usage:\nnpm error npm ci\nnpm error\nnpm error Options:\nnpm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]\nnpm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]\nnpm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]\nnpm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]\nnpm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]\nnpm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]\nnpm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]\nnpm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]\nnpm error [--no-bin-links] [--no-fund] [--dry-run]\nnpm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]\nnpm error [--workspaces] [--include-workspace-root] [--install-links]\nnpm error\nnpm error   --install-strategy\nnpm error     Sets the strategy for installing packages in node_modules.\nnpm error\nnpm error   --legacy-bundling\nnpm error     Instead of hoisting package installs in `node_modules`, install packages\nnpm error\nnpm error   --global-style\nnpm error     Only install direct dependencies in the top level `node_modules`,\nnpm error\nnpm error   --omit\nnpm error     Dependency types to omit from the installation tree on disk.\nnpm error\nnpm error   --include\nnpm error     Option that allows for defining which types of dependencies to install.\nnpm error\nnpm error   --strict-peer-deps\nnpm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_\nnpm error\nnpm error   --foreground-scripts\nnpm error     Run all build scripts (ie, `preinstall`, `install`, and\nnpm error\nnpm error   --ignore-scripts\nnpm error     If true, npm does not run scripts specified in package.json files.\nnpm error\nnpm error   --allow-directory\nnpm error     Limits the ability for npm to install dependencies from directories.\nnpm error\nnpm error   --allow-file\nnpm error     Limits the ability for npm to install dependencies from tarball files.\nnpm error\nnpm error   --allow-git\nnpm error     Limits the ability for npm to fetch dependencies from git references.\nnpm error\nnpm error   --allow-remote\nnpm error     Limits the ability for npm to fetch dependencies from urls.\nnpm error\nnpm error   --allow-scripts\nnpm error     Comma-separated list of packages whose install-time lifecycle scripts\nnpm error\nnpm error   --strict-allow-scripts\nnpm error     If `true`, turn the install-script policy from a warning into a hard\nnpm error\nnpm error   --dangerously-allow-all-scripts\nnpm error     If `true`, bypass the `allowScripts` policy entirely and run every\nnpm error\nnpm error   --audit\nnpm error     When \"true\" submit audit reports alongside the current npm command to the\nnpm error\nnpm error   --bin-links\nnpm error     Tells npm to create symlinks (or `.cmd` shims on Windows) for package\nnpm error\nnpm error   --fund\nnpm error     When \"true\" displays the message at the end of each `npm install`\nnpm error\nnpm error   --dry-run\nnpm error     Indicates that you don't want npm to make any changes and that it should\nnpm error\nnpm error   -w|--workspace\nnpm error     Enable running a command in the context of the configured workspaces of the\nnpm error\nnpm error   --workspaces\nnpm error     Set to true to run the command in the context of **all** configured\nnpm error\nnpm error   --include-workspace-root\nnpm error     Include the workspace root when workspaces are enabled for a command.\nnpm error\nnpm error   --install-links\nnpm error     When set file: protocol dependencies will be packed and installed as\nnpm error\nnpm error\nnpm error aliases: clean-install, ic, install-clean, isntall-clean\nnpm error\nnpm error Run \"npm help ci\" for more info\nnpm error A complete log of this run can be found in: /home/kali/.npm/_logs/2026-11-04T12_28_42_555Z-debug-0.log\n[chiqish kodi: 1]";
const KOD_OUT_03D = "# Lokal: npm 11 (Node 24) bilan npm ci YASHIL edi (01). Runner: Node 22 → npm 10. Shu npm 10 bilan lokalda:\n$ node --version && npm --version\nv24.18.0\n11.16.0\n$ npx -p npm@10 npm --version\n10.9.9\n$ npx -p npm@10 npm ci --no-audit --no-fund\nnpm error code EUSAGE\nnpm error\nnpm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.\nnpm error\nnpm error Missing: webpack@5.112.2 from lock file\nnpm error\nnpm error Clean install a project\nnpm error\nnpm error Usage:\nnpm error npm ci\nnpm error\nnpm error Options:\n[chiqish kodi: 1]  # (zsh: PIPESTATUS bo'sh chiqdi; npm ci EUSAGE = 1 — run 10a/19 annotatsiyasi «exit code 1»)\n\n# npm 10 lock faylni qanday o'zgartirardi (faqat ko'rish, saqlanmaydi):\n$ npx -p npm@10 npm install --package-lock-only --no-audit --no-fund && git diff --stat\nup to date in 676ms\n package-lock.json | 91 ++++++++++++++++++++++++++-----------------------------\n 1 file changed, 43 insertions(+), 48 deletions(-)\n+      \"version\": \"5.112.2\",\n+      \"peer\": true,\n+      \"peerDependenciesMeta\": {";
const KOD_OUT_04 = "# node_modules yo'q (lentada npm ci qadami tushib qolgan)\n$ npm test\n\n> order-bot-nest@1.0.0 test\n> jest\n\nsh: 1: jest: not found\n[chiqish kodi: 127 · 0.2 s]";
const KOD_OUT_05 = "$ npm run build\n\n> order-bot-nest@1.0.0 build\n> nest build\n\n[chiqish kodi: 0 · 3.3 s]\n\n$ node dist/main\n…/OrderBotNest/infrastructure/database.module.js:15\n    throw new Error('DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: postgresql://postgres:parol@localhost:5432/shop');\n    ^\n\nError: DATABASE_URL topilmadi. .env ga PostgreSQL manzilini yozing: postgresql://postgres:parol@localhost:5432/shop\n    at Object.<anonymous> (…/OrderBotNest/infrastructure/database.module.js:15:11)\n    at Module._compile (node:internal/modules/cjs/loader:1871:14)\n    at Module._extensions..js (node:internal/modules/cjs/loader:2002:10)\n[chiqish kodi: 1]";
const KOD_OUT_06 = "# user.service.ts: telegram_id = from.id (string ustuniga number)\n$ npx tsc --noEmit\nsrc/api/user/user.service.ts(20,42): error TS2322: Type '{ telegram_id: number; }' is not assignable to type 'FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined'.\n  Types of property 'telegram_id' are incompatible.\n    Type 'number' is not assignable to type 'string | FindOperator<string> | undefined'.\nsrc/api/user/user.service.ts(22,33): error TS2769: No overload matches this call.\n  Overload 1 of 3, '(entityLikeArray: DeepPartial<User>[]): User[]', gave the following error.\n    Object literal may only specify known properties, and 'telegram_id' does not exist in type 'DeepPartial<User>[]'.\n  Overload 2 of 3, '(entityLike: DeepPartial<User>): User', gave the following error.\n    Type 'number' is not assignable to type 'string'.\n[chiqish kodi: 2 · 2.1 s]\n\n# test baribir yashilmi? (ts-jest diagnostics)\nTest Suites: 5 passed, 5 total\nTests:       25 passed, 25 total\nSnapshots:   0 total\nTime:        1.234 s\n[chiqish kodi: 0 · 1.9 s]";
const KOD_OUT_07 = "$ ls\n$ npm ci --no-audit --no-fund\n[chiqish kodi: 0 · 5.7 s]\n$ npx tsc --noEmit\n[chiqish kodi: 0 · 2.6 s]\n$ npm test\n[chiqish kodi: 0 · 2.2 s]\n$ npm run build\n[chiqish kodi: 0 · 3.5 s]\n$ ls dist | head";
const KOD_OUT_08 = "# @actions/workflow-parser 0.3.61 — GitHub'ning rasmiy YAML tahlilchisi (04.11, esbuild bundle)\n--- 1-tavsiya.yml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npx tsc --noEmit\n      - run: npm test\n      - run: npm run build\n  ✓ xato yo'q (schema bo'yicha to'g'ri)\n\n--- 2-checkout-yoq.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: npm ci\n      - run: npm test\n  ✓ xato yo'q (schema bo'yicha to'g'ri)\n\n--- 3-runs-on-yoq.yml\nname: CI\non: push\njobs:\n  test:\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm test\n  XATO: 3-runs-on-yoq.yml (Line: 5, Col: 5): Required property is missing: runs-on\n\n--- 4-surilish-xato.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n  XATO: 4-surilish-xato.yml: A block sequence may not be used as an implicit map key at line 8, column 1:\n\n    - uses: actions/checkout@v4\n      - run: npm ci\n^\n\n  XATO: 4-surilish-xato.yml: Implicit keys need to be on a single line at line 8, column 7:\n\n    - uses: actions/checkout@v4\n      - run: npm ci\n      ^\n\n  XATO: 4-surilish-xato.yml: Implicit map keys need to be followed by map values at line 8, column 7:\n\n    - uses: actions/checkout@v4\n      - run: npm ci\n      ^\n\n\n--- 5-npm-install.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: npm install\n      - run: npm test\n  ✓ xato yo'q (schema bo'yicha to'g'ri)\n\n--- 6-tsc-yoq.yml\nname: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm test\n  ✓ xato yo'q (schema bo'yicha to'g'ri)";
const KOD_OUT_09 = "v24.18.0\n11.16.0\ngh version 2.100.0 (2026-09-03)\nWed Nov  4 05:51:17 PM +05 2026\nAzizbekcrypto";
const KOD_RUNS_10 = {
 "id": "41832879751",
 "n": 11,
 "title": "ci: lenta — npm ci · tsc · test · build",
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
  ]
 }
};
const KOD_RUNS_10A = {
 "id": "41831241596",
 "n": 1,
 "title": "ci: lenta — npm ci · tsc · test · build",
 "br": "ci-sinov",
 "sha": "1ab36ac",
 "st": "bad",
 "dur": "9 s",
 "at": "2026-11-04T12:40:03Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "5 s",
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
     "0 s"
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
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
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
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T12_40_08_990Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ]
 }
};
const KOD_RUNS_11 = {
 "id": "42608643059",
 "n": 44,
 "title": "sinov: chegara buzildi (< → <=)",
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
  ]
 }
};
const KOD_RUNS_12 = {
 "id": "41833077624",
 "n": 13,
 "title": "sinov: checkout qadami yo'q",
 "br": "ci-sinov",
 "sha": "33c3cc8",
 "st": "bad",
 "dur": "12 s",
 "at": "2026-11-04T12:52:46Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "9 s",
   "steps": [
    [
     "Set up job",
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
     "bad",
     "1 s"
    ],
    [
     "Run npm test",
     "skip",
     "0 s"
    ],
    [
     "Post Run actions/setup-node@v4",
     "skip",
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
  "Run npm ci": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error The `npm ci` command can only install with an existing package-lock.json or",
   "npm error npm-shrinkwrap.json with lockfileVersion >= 1. Run an install with npm@5 or",
   "npm error later to generate a package-lock.json file, then try again.",
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
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]",
   "npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]",
   "npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]",
   "npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]",
   "npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error   --install-strategy",
   "npm error     Sets the strategy for installing packages in node_modules.",
   "npm error",
   "npm error   --legacy-bundling",
   "npm error     Instead of hoisting package installs in `node_modules`, install packages",
   "npm error",
   "npm error   --global-style",
   "npm error     Only install direct dependencies in the top level `node_modules`,",
   "npm error",
   "npm error   --omit",
   "npm error     Dependency types to omit from the installation tree on disk.",
   "npm error",
   "npm error   --include",
   "npm error     Option that allows for defining which types of dependencies to install.",
   "npm error",
   "npm error   --strict-peer-deps",
   "npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_",
   "npm error",
   "npm error   --foreground-scripts",
   "npm error     Run all build scripts (ie, `preinstall`, `install`, and",
   "npm error",
   "npm error   --ignore-scripts",
   "npm error     If true, npm does not run scripts specified in package.json files.",
   "npm error",
   "npm error   --allow-directory",
   "npm error     Limits the ability for npm to install dependencies from directories.",
   "npm error",
   "npm error   --allow-file",
   "npm error     Limits the ability for npm to install dependencies from tarball files.",
   "npm error",
   "npm error   --allow-git",
   "npm error     Limits the ability for npm to fetch dependencies from git references.",
   "npm error",
   "npm error   --allow-remote",
   "npm error     Limits the ability for npm to fetch dependencies from urls."
  ]
 }
};
const KOD_RUNS_13 = {
 "id": "41833308519",
 "n": 14,
 "title": "sinov: package.json lock bilan sinxron emas",
 "br": "ci-sinov",
 "sha": "f7e6f8d",
 "st": "bad",
 "dur": "10 s",
 "at": "2026-11-04T12:54:24Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "8 s",
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
     "bad",
     "2 s"
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
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
   "$ npm ci",
   "npm error code EUSAGE",
   "npm error",
   "npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.",
   "npm error",
   "npm error Invalid: lock file's telegraf@4.16.3 does not satisfy telegraf@4.16.0",
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
   "npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts]",
   "npm error [--allow-directory <all|none|root>] [--allow-file <all|none|root>]",
   "npm error [--allow-git <all|none|root>] [--allow-remote <all|none|root>]",
   "npm error [--allow-scripts <package-list> [--allow-scripts <package-list> ...]]",
   "npm error [--strict-allow-scripts] [--dangerously-allow-all-scripts] [--no-audit]",
   "npm error [--no-bin-links] [--no-fund] [--dry-run]",
   "npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]",
   "npm error [--workspaces] [--include-workspace-root] [--install-links]",
   "npm error",
   "npm error   --install-strategy",
   "npm error     Sets the strategy for installing packages in node_modules.",
   "npm error",
   "npm error   --legacy-bundling",
   "npm error     Instead of hoisting package installs in `node_modules`, install packages",
   "npm error",
   "npm error   --global-style",
   "npm error     Only install direct dependencies in the top level `node_modules`,",
   "npm error",
   "npm error   --omit",
   "npm error     Dependency types to omit from the installation tree on disk.",
   "npm error",
   "npm error   --include",
   "npm error     Option that allows for defining which types of dependencies to install.",
   "npm error",
   "npm error   --strict-peer-deps",
   "npm error     If set to `true`, and `--legacy-peer-deps` is not set, then _any_",
   "npm error",
   "npm error   --foreground-scripts",
   "npm error     Run all build scripts (ie, `preinstall`, `install`, and",
   "npm error",
   "npm error   --ignore-scripts",
   "npm error     If true, npm does not run scripts specified in package.json files.",
   "npm error",
   "npm error   --allow-directory",
   "npm error     Limits the ability for npm to install dependencies from directories.",
   "npm error",
   "npm error   --allow-file",
   "npm error     Limits the ability for npm to install dependencies from tarball files.",
   "npm error",
   "npm error   --allow-git",
   "npm error     Limits the ability for npm to fetch dependencies from git references.",
   "npm error",
   "npm error   --allow-remote",
   "npm error     Limits the ability for npm to fetch dependencies from urls."
  ]
 }
};
const KOD_RUNS_14 = {
 "id": "41833373499",
 "n": 15,
 "title": "sinov: tsc qadami yo'q + tur xatosi",
 "br": "ci-sinov",
 "sha": "b79cc7e",
 "st": "ok",
 "dur": "25 s",
 "at": "2026-11-04T12:54:51Z",
 "jobs": [
  {
   "name": "test",
   "st": "ok",
   "dur": "19 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Run actions/checkout@v4",
     "ok",
     "0 s"
    ],
    [
     "Run actions/setup-node@v4",
     "ok",
     "7 s"
    ],
    [
     "Run npm ci",
     "ok",
     "6 s"
    ],
    [
     "Run npm test",
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
  }
 ],
 "ann": [],
 "wfIssue": false,
 "log": {
  "Run npm ci": [
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
   "Time:        1.343 s",
   "Ran all test suites."
  ]
 }
};
const KOD_RUNS_15 = {
 "id": "41833479902",
 "n": 16,
 "title": "sinov: tsc qadami bor + tur xatosi",
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
  ]
 }
};
const KOD_RUNS_16 = {
 "id": "41833570010",
 "n": 17,
 "title": "sinov: runs-on yo'q",
 "br": "ci-sinov",
 "sha": "49fa7bb",
 "st": "bad",
 "dur": "0 s",
 "at": "2026-11-04T12:56:13Z",
 "jobs": [],
 "ann": [],
 "wfIssue": true,
 "log": {}
};
const KOD_RUNS_17 = {
 "id": "41833614367",
 "n": 18,
 "title": "sinov: YAML surilish xatosi",
 "br": "ci-sinov",
 "sha": "7e5e43a",
 "st": "bad",
 "dur": "0 s",
 "at": "2026-11-04T12:56:31Z",
 "jobs": [],
 "ann": [],
 "wfIssue": true,
 "log": {}
};
const KOD_RUNS_18 = {
 "id": "41833650859",
 "n": 19,
 "title": "cicd1-done: node-version 24 — runner'dagi npm 10 lock faylni o'qiy ol…",
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
  ]
 }
};
const KOD_RUNS_19 = {
 "id": "41833774062",
 "n": 1,
 "title": "sinov: AI yozgan workflow (ai1)",
 "br": "ci-sinov",
 "sha": "a18eb0e",
 "st": "bad",
 "dur": "10 s",
 "at": "2026-11-04T12:57:40Z",
 "jobs": [
  {
   "name": "test",
   "st": "bad",
   "dur": "7 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "1 s"
    ],
    [
     "Kodni yuklab olish",
     "ok",
     "1 s"
    ],
    [
     "Node.js 22 o'rnatish",
     "ok",
     "1 s"
    ],
    [
     "Kutubxonalarni o'rnatish",
     "bad",
     "1 s"
    ],
    [
     "Testlar",
     "skip",
     "0 s"
    ],
    [
     "Post Node.js 22 o'rnatish",
     "skip",
     "0 s"
    ],
    [
     "Post Kodni yuklab olish",
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
   "Process completed with exit code 1."
  ]
 ],
 "wfIssue": false,
 "log": {
  "Kutubxonalarni o'rnatish": [
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
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T12_57_46_990Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ]
 }
};
const KOD_RUNS_20 = {
 "id": "41833834000",
 "n": 20,
 "title": "sinov: AI yozgan workflow (ai2)",
 "br": "ci-sinov",
 "sha": "d04c083",
 "st": "bad",
 "dur": "9 s",
 "at": "2026-11-04T12:58:06Z",
 "jobs": [
  {
   "name": "Jest testlar",
   "st": "bad",
   "dur": "6 s",
   "steps": [
    [
     "Set up job",
     "ok",
     "0 s"
    ],
    [
     "Kodni olish",
     "ok",
     "1 s"
    ],
    [
     "Node.js o'rnatish",
     "ok",
     "2 s"
    ],
    [
     "Bog'liqliklarni o'rnatish",
     "bad",
     "1 s"
    ],
    [
     "Testlarni ishga tushirish",
     "skip",
     "0 s"
    ],
    [
     "Post Node.js o'rnatish",
     "skip",
     "0 s"
    ],
    [
     "Post Kodni olish",
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
  "Bog'liqliklarni o'rnatish": [
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
   "npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-11-04T12_58_12_295Z-debug-0.log",
   "##[error]Process completed with exit code 1."
  ]
 }
};
const KOD_RUNS_21 = {
 "id": "41833893142",
 "n": 2,
 "title": "sinov: AI (ai1) workflow, node-version 22 → 24",
 "br": "ci-sinov",
 "sha": "a0469b6",
 "st": "ok",
 "dur": "21 s",
 "at": "2026-11-04T12:58:31Z",
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
     "Kodni yuklab olish",
     "ok",
     "0 s"
    ],
    [
     "Node.js 22 o'rnatish",
     "ok",
     "5 s"
    ],
    [
     "Kutubxonalarni o'rnatish",
     "ok",
     "7 s"
    ],
    [
     "Testlar",
     "ok",
     "1 s"
    ],
    [
     "Post Node.js 22 o'rnatish",
     "ok",
     "0 s"
    ],
    [
     "Post Kodni yuklab olish",
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
  "Kutubxonalarni o'rnatish": [
   "$ npm ci",
   "npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
   "added 633 packages, and audited 634 packages in 6s",
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
  "Testlar": [
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
   "Time:        1.346 s",
   "Ran all test suites."
  ]
 }
};
const KOD_PROMPT1 = "Bu NestJS loyihasi uchun GitHub Actions workflow yozib ber: har push'da testlar yursin.";
const KOD_PROMPT2 = "Loyiha: OrderBotNest (NestJS + Telegraf + TypeORM), package-lock.json bor, testlar Jest (npm test), turlar npx tsc --noEmit, build npm run build. Mashinamda Node <node --version raqamingiz>. Vazifa: .github/workflows/ci.yml yoz: har push va pull_requestda ubuntu-latestda: kodni olib kelish (actions/checkout@v4), Node o'rnatish (actions/setup-node@v4, node-version — mening raqamim, cache: npm), npm ci, npx tsc --noEmit, npm test, npm run build — aynan shu tartibda, har biri alohida run: qadam. Boshqa fayllarga tegma. Javobda: faylning to'liq matni.";
const KOD_VERSIONS = {
 "local": "v24.18.0\n11.16.0\nHEAD e15a44c jest2-done: xato yo'li va chegara testlari — isPhone al\nWed Nov  4 05:19:25 PM +05 2026",
 "actions": "v24.18.0\n11.16.0\ngh version 2.100.0 (2026-09-03)\nWed Nov  4 05:51:17 PM +05 2026\nAzizbekcrypto"
};
const KOD = { ORDER_36: KOD_ORDER_36, USER_20: KOD_USER_20, PKG_TELEGRAF: KOD_PKG_TELEGRAF, LOCK_TELEGRAF: KOD_LOCK_TELEGRAF, CI_DONE: KOD_CI_DONE, YML_1_TAVSIYA: KOD_YML_1_TAVSIYA, YML_2_CHECKOUT_YOQ: KOD_YML_2_CHECKOUT_YOQ, YML_3_RUNS_ON_YOQ: KOD_YML_3_RUNS_ON_YOQ, YML_4_SURILISH_XATO: KOD_YML_4_SURILISH_XATO, YML_5_NPM_INSTALL: KOD_YML_5_NPM_INSTALL, YML_6_TSC_YOQ: KOD_YML_6_TSC_YOQ, YML_AI1: KOD_YML_AI1, YML_AI2: KOD_YML_AI2, OUT: { '00': KOD_OUT_00, '01': KOD_OUT_01, '02': KOD_OUT_02, '03': KOD_OUT_03, '03b': KOD_OUT_03B, '03c': KOD_OUT_03C, '03d': KOD_OUT_03D, '04': KOD_OUT_04, '05': KOD_OUT_05, '06': KOD_OUT_06, '07': KOD_OUT_07, '08': KOD_OUT_08, '09': KOD_OUT_09 }, RUNS: { '10': KOD_RUNS_10, '10a': KOD_RUNS_10A, '11': KOD_RUNS_11, '12': KOD_RUNS_12, '13': KOD_RUNS_13, '14': KOD_RUNS_14, '15': KOD_RUNS_15, '16': KOD_RUNS_16, '17': KOD_RUNS_17, '18': KOD_RUNS_18, '19': KOD_RUNS_19, '20': KOD_RUNS_20, '21': KOD_RUNS_21 }, PROMPT1: KOD_PROMPT1, PROMPT2: KOD_PROMPT2, VERSIONS: KOD_VERSIONS };
