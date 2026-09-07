#!/usr/bin/env node
// mint-token — sinov uchun liveToken (JWT) yasaydi. LMS bo'lmagan joyda (dev/staging) ko'prikni sinash uchun.
// Secret env'dan (CODDYCAMP_LIVE_JWT_SECRET) yoki --secret. PROD secret'i bilan ishlatmang — bu faqat sinov.
//   node --env-file=.env tools/mint-token.mjs --role student --sub 34174 --name "Ali Valiyev" --crm 17226
//   node --env-file=.env tools/mint-token.mjs --role mentor  --sub 145   --name "Mentor" --gid 861
//   qo'shimcha: --ttl 3600 · --kid v1 · --iss … · --aud … · --jti … · --exp-past (muddati o'tgan) · --alg none (buzuq)
import { SignJWT } from 'jose';
import { randomUUID } from 'node:crypto';
import { keyFromSecret } from '../src/modules/lms/jwt.js';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? (args[i + 1] ?? true) : def; };
const has = (name) => args.includes(`--${name}`);

const role = opt('role', 'student');
const sub = String(opt('sub', role === 'mentor' ? '145' : '34174'));
const name = opt('name', role === 'mentor' ? 'Test Mentor' : 'Test O\'quvchi');
const secret = opt('secret', process.env.CODDYCAMP_LIVE_JWT_SECRET);
const iss = opt('iss', process.env.CODDYCAMP_LIVE_JWT_ISSUER || 'coddycamp-lms');
const aud = opt('aud', process.env.CODDYCAMP_LIVE_JWT_AUDIENCE || 'dars-platform');
const kid = opt('kid', process.env.CODDYCAMP_LIVE_JWT_KEY_ID || 'v1');
const ttl = Number(opt('ttl', 3600));
if (!secret) { console.error('secret yo\'q: CODDYCAMP_LIVE_JWT_SECRET yoki --secret'); process.exit(2); }

const now = Math.floor(Date.now() / 1000);
const iat = has('exp-past') ? now - 7200 : now;
const payload = { role, name, jti: opt('jti', randomUUID()) };
if (role === 'mentor') payload.gid = Number(opt('gid', 861));
else payload.crm_id = Number(opt('crm', 17226));

const token = await new SignJWT(payload)
  .setProtectedHeader({ alg: 'HS256', typ: 'JWT', kid })
  .setIssuer(iss).setAudience(aud).setSubject(sub)
  .setIssuedAt(iat).setNotBefore(iat).setExpirationTime(iat + ttl)
  .sign(keyFromSecret(secret));

if (has('json')) console.log(JSON.stringify({ token, payload: { ...payload, sub, iss, aud, iat, exp: iat + ttl }, kid }, null, 2));
else console.log(token);
