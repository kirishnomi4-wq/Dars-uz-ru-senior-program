import { open } from './tc-lib.mjs';
const { b, p, log } = await open();
console.log(await p.evaluate(() => Object.keys(window.__X)));
console.log(await p.evaluate(() => window.__X.lintHtml('<h1>x</h2>')));
console.log(await p.evaluate(() => window.__X.parseCss('h1{color:red}')));
console.log(log); await b.close();
