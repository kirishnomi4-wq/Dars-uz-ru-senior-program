#!/usr/bin/env node
// telegram-check — ogohlantirish-botini sozlashda yordam: token ishlaydimi, chat_id qaysi, sinov-xabar yetib boradimi.
// Token hech qachon chiqarilmaydi. Ishlatish (env-fayldan o'qiydi):
//   node --env-file=.env.deploy.staging tools/telegram-check.mjs            # bot nomi + ko'rilgan chat_id'lar
//   node --env-file=.env.deploy.staging tools/telegram-check.mjs --send     # TELEGRAM_CHAT_ID ga sinov-xabar
// Tartib: @BotFather → /newbot → token → env-faylga TELEGRAM_BOT_TOKEN=… → botga /start yozing (yoki guruhga qo'shib xabar yozing)
// → shu skript chat_id ni ko'rsatadi → env-faylga TELEGRAM_CHAT_ID=… → --send bilan tekshiring → ikkala faylni Kristinaga.
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
if (!token) { console.error('TELEGRAM_BOT_TOKEN env\'da yo\'q (env-faylda # ni olib tashlang).'); process.exit(2); }
const api = async (m, body) => {
  const r = await fetch(`https://api.telegram.org/bot${token}/${m}`, body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : undefined);
  const j = await r.json().catch(() => ({}));
  if (!j.ok) throw new Error(`${m}: ${j.description || r.status}`);
  return j.result;
};
try {
  const me = await api('getMe');
  console.log(`bot: @${me.username} (${me.first_name}) — token ishlaydi`);
  const upd = await api('getUpdates');
  const chats = new Map();
  for (const u of upd) { const c = u.message?.chat || u.my_chat_member?.chat || u.channel_post?.chat; if (c) chats.set(c.id, c); }
  if (!chats.size) console.log('hali xabar yo\'q — botga /start yozing yoki guruhga qo\'shib biror xabar yozing, keyin qayta yuriting');
  for (const c of chats.values()) console.log(`  chat_id: ${c.id}   (${c.type}${c.title ? ` «${c.title}»` : ''}${c.username ? ` @${c.username}` : ''})`);
  if (process.argv.includes('--send')) {
    if (!chatId) { console.error('TELEGRAM_CHAT_ID env\'da yo\'q'); process.exit(2); }
    await api('sendMessage', { chat_id: chatId, text: `[dars-api sinov] ogohlantirish kanali ishlayapti — ${new Date().toISOString().slice(0, 16)}Z` });
    console.log(`sinov-xabar yuborildi → chat_id ${chatId}`);
  }
} catch (e) { console.error('xato:', e.message); process.exit(1); }
