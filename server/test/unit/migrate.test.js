import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { listMigrationFiles, checksumOf, DEFAULT_MIGRATIONS_DIR } from '../../src/db/migrate.js';

async function tempDir(files) {
  const dir = await mkdtemp(path.join(tmpdir(), 'dars-mig-'));
  for (const [name, body] of Object.entries(files)) await writeFile(path.join(dir, name), body);
  return dir;
}

test('checksum: CRLF va LF bir xil (Windows/Linux farqi)', () => {
  assert.equal(checksumOf('select 1;\r\nselect 2;\r\n'), checksumOf('select 1;\nselect 2;\n'));
  assert.notEqual(checksumOf('select 1;'), checksumOf('select 2;'));
});

test('fayllar tartib bilan, nomi qolipga mos bo\'lmaganlar e\'tiborsiz', async () => {
  const dir = await tempDir({
    '0002_second.sql': 'select 2;',
    '0001_first.sql': 'select 1;',
    'README.md': 'x',
    '0003-bad-name.sql': 'select 3;',
    '0004_Upper.sql': 'select 4;',
  });
  try {
    const files = await listMigrationFiles(dir);
    assert.deepEqual(files.map((f) => f.id), ['0001_first', '0002_second']);
    assert.equal(files[0].checksum, checksumOf('select 1;'));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('raqam takrorlansa xato', async () => {
  const dir = await tempDir({ '0001_a.sql': 'select 1;', '0001_b.sql': 'select 1;' });
  try {
    await assert.rejects(listMigrationFiles(dir), /takrorlangan: 0001/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('repo migratsiyalari o\'qiladi va 0001 bilan boshlanadi', async () => {
  const files = await listMigrationFiles(DEFAULT_MIGRATIONS_DIR);
  assert.ok(files.length >= 1);
  assert.equal(files[0].id, '0001_live_core');
});
