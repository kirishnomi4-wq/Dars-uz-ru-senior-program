import fs from 'node:fs';
import path from 'node:path';
import { parseWorkflow, NoOperationTraceWriter } from '../wfp/node_modules/@actions/workflow-parser/dist/index.js';
const dir = process.argv[2];
for (const f of fs.readdirSync(dir).sort()) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const r = parseWorkflow({ name: f, content }, new NoOperationTraceWriter());
  const errs = r.context.errors.getErrors();
  console.log(`--- ${f}`);
  console.log(content.trimEnd());
  console.log(errs.length ? errs.map((e) => '  XATO: ' + e.message).join('\n') : '  ✓ xato yo\'q (schema bo\'yicha to\'g\'ri)');
  console.log();
}
