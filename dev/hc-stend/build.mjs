import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
await build({ entryPoints: [join(here,'entry.jsx')], bundle: true, format: 'iife', outfile: join(here,'bundle.js'),
  jsx: 'automatic', charset: 'utf8', logLevel: 'info',
  define: { 'process.env.NODE_ENV': '"development"' } });
