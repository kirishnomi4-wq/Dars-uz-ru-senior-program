// preview-baza-build (F-1015) — darsni O'ZGARISHSIZ (baza) umumiy modul bilan yig'adi: mutatsiya-sinovi va regressiya uchun.
// `src/live/*` importi esbuild plagini bilan `bazaLive` nusxasiga yo'naltiriladi — ish papkasidagi src/live ga TEGILMAYDI
// (memory: mutatsiya-joyida-emas). O'ram (prop → notePreviewProps) QO'SHILMAYDI — eski build-lms shakli.
import { build } from 'esbuild';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { mergeReactImports } from './react-merge.mjs';

const SRC_LIVE = resolve('src/live');

export async function buildBaza(entry, outFile, bazaLive) {
  const BAZA = resolve(bazaLive);
  const toBaza = {
    name: 'baza-live',
    setup(b) {
      b.onResolve({ filter: /(^|\/)live\// }, (a) => {
        const p = resolve(a.resolveDir, a.path);
        return p.startsWith(SRC_LIVE + '/') ? { path: join(BAZA, relative(SRC_LIVE, p)) } : undefined;
      });
    },
  };
  const r = await build({
    entryPoints: [entry], bundle: true, format: 'esm', jsx: 'preserve', charset: 'utf8',
    external: ['react', 'react-dom', 'react/jsx-runtime'], define: { __DARS_API_URL__: JSON.stringify(process.env.DARS_API_URL || '') }, // build-lms bilan bir xil
    legalComments: 'inline', write: false, logLevel: 'silent', plugins: [toBaza],
  });
  const text = mergeReactImports(r.outputFiles[0].text);
  if (text.includes(SRC_LIVE)) throw new Error('src/live ga havola qoldi');
  if (text.includes('notePreviewProps')) throw new Error('baza yig\'mada preview kodi bor — nusxa noto\'g\'ri');
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, text, 'utf8');
  return outFile;
}
