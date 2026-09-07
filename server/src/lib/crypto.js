// Bazada saqlanadigan sessiya-tokenlar (mentor_token, player_token) uchun AES-256-GCM.
// Kalit env'da (TOKEN_ENC_KEY, base64 32 bayt). Format: v1:<iv>:<shifr>:<teg> (hammasi base64).
// Nega: F5 / boshqa qurilma holatida backend o'quvchiga o'z tokenini qaytarishi kerak,
// lekin baza-dump sizib chiqsa tokenlar ochiq turmasin.
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export function loadEncKey(base64) {
  const key = Buffer.from(String(base64 || ''), 'base64');
  if (key.length !== 32) throw new Error('TOKEN_ENC_KEY: base64 ko\'rinishida aynan 32 bayt bo\'lsin');
  return key;
}

export function encryptText(key, plain) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString('base64')}:${ct.toString('base64')}:${tag.toString('base64')}`;
}

export function decryptText(key, blob) {
  const parts = String(blob || '').split(':');
  if (parts.length !== 4 || parts[0] !== 'v1') throw new Error('shifr formati noto\'g\'ri');
  const [, iv, ct, tag] = parts;
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(ct, 'base64')), decipher.final()]).toString('utf8');
}
