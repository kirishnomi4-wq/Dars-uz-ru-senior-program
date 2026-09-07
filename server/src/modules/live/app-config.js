// app_config — SQL funksiyalar o'qiydigan kichik kalit-qiymat jadvali (hozircha faqat mentor_code).
// Sir env'da turadi (LIVE_MENTOR_CODE), startda bazaga sinxronlanadi — SQL fayllarda sir yo'q.
// PIN-yo'lidagi mentor-kod: create_session / set_quiz_keys shu qiymat bilan solishtiradi.

export const MENTOR_CODE_KEY = 'mentor_code';

/**
 * @param {import('pg').Pool} pool
 * @param {{ liveMentorCode?: string }} config
 * @param {import('pino').Logger} log
 */
export async function syncAppConfig(pool, config, log) {
  if (!config.liveMentorCode) {
    log.warn("LIVE_MENTOR_CODE berilmagan — PIN-yo'lida mentor sessiya ocha olmaydi (create_session rad etadi)");
    return { synced: false };
  }
  await pool.query(
    `insert into app_config (key, value) values ($1, $2)
     on conflict (key) do update set value = excluded.value, updated_at = now()
     where app_config.value is distinct from excluded.value`,
    [MENTOR_CODE_KEY, config.liveMentorCode],
  );
  log.info({ key: MENTOR_CODE_KEY }, 'app_config sinxronlandi');
  return { synced: true };
}
