// Telegram-ogohlantirish (ixtiyoriy): TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID berilsa yuboradi, aks holda jim.
// Bloklamaydi, xatoni yutadi (ogohlantirish yiqilsa asosiy ish yiqilmasin). Matnda token/JWT/ism bo'lmasin.
export function createNotifier({ botToken, chatId, log, fetchImpl = globalThis.fetch, env = 'prod' }) {
  if (!botToken || !chatId) return async () => {};
  let lastSentAt = 0;
  return async function notify(text) {
    try {
      // 2 s ichida ketma-ket xabarlar birlashmaydi, lekin toshqin bo'lmasin: minimal oraliq
      const now = Date.now();
      if (now - lastSentAt < 500) await new Promise((r) => setTimeout(r, 500));
      lastSentAt = Date.now();
      const r = await fetchImpl(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: `[dars-api ${env}] ${String(text).slice(0, 3500)}`, disable_web_page_preview: true }),
      });
      if (!r.ok) log.warn({ status: r.status }, 'telegram: yuborilmadi');
    } catch (err) {
      log.warn({ err: { message: err?.message } }, 'telegram: xato');
    }
  };
}
