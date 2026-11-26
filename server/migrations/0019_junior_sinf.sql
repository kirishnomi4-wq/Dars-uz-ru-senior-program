-- 0019_junior_sinf — Junior kursi (9–13 yosh) uchun sinf aloqasi (18.11.2026).
--  Junior darsida ustoz va o'quvchi XABAR almashadi (qadam, tanlangan qahramon, bolaning bloklari, gapi, «sahna tayyor»…).
--  Mavjud jonli-API faqat ekran raqami va 0–999 javobni tashiydi — Junior'ga yetmaydi. Bu migratsiya faqat QO'SHADI:
--  jonli sessiya (live_sessions), mentor va o'yinchi kalitlari o'sha-o'zi; AI Startup darslari bu jadvallarga tegmaydi.
--  Tartib: har sessiya o'z hisoblagichi bilan (junior_sinf.n) — qator qulfi bilan oshadi, shuning uchun xabarlar
--  raqam tartibida saqlanadi (bigserial'da kech tugagan yozuv o'quvchi «dan» dan oldin tushib qolishi mumkin edi).

create table if not exists junior_sinf (
  pin text primary key references live_sessions (pin) on delete cascade,
  n   bigint not null default 0
);

create table if not exists junior_xabarlar (
  pin   text   not null references live_sessions (pin) on delete cascade,
  n     bigint not null,
  kim   text   not null check (kim = 'ustoz' or kim ~ '^[0-9a-f-]{36}$'),
  xabar jsonb  not null,
  at    timestamptz not null default now(),
  primary key (pin, n)
);
create index if not exists junior_xabarlar_at_idx on junior_xabarlar (at);

-- Yozish: kalit tekshiriladi (ustoz — session_secrets, o'quvchi — player_secrets), sessiya jonli bo'lishi shart.
-- O'quvchi xabarida `kim` maydoni server tomonidan o'yinchi id'siga almashtiriladi (boshqa bola nomidan yozib bo'lmaydi).
create or replace function junior_yubor(p_pin text, p_kim text, p_token text, p_xabar jsonb)
returns bigint
language plpgsql
as $$
declare
  v_n bigint;
  v_x jsonb := p_xabar;
begin
  if p_kim = 'ustoz' then
    if not exists (select 1 from session_secrets s where s.pin = p_pin and s.mentor_token = p_token) then
      raise exception 'Ruxsat yo''q';
    end if;
  else
    if not exists (
      select 1 from player_secrets ps join live_players lp on lp.id = ps.player_id
       where ps.player_id::text = p_kim and ps.token = p_token and lp.pin = p_pin
    ) then
      raise exception 'Ruxsat yo''q';
    end if;
    v_x := jsonb_set(v_x, '{kim}', to_jsonb(p_kim));
  end if;
  if not exists (select 1 from live_sessions where pin = p_pin and status = 'live') then
    raise exception 'Dars tugagan';
  end if;

  insert into junior_sinf (pin, n) values (p_pin, 1)
    on conflict (pin) do update set n = junior_sinf.n + 1
    returning n into v_n;
  insert into junior_xabarlar (pin, n, kim, xabar) values (p_pin, v_n, p_kim, v_x);
  return v_n;
end;
$$;

-- O'qish: ustoz — hammaning xabari (o'zinikidan tashqari); o'quvchi — faqat ustozniki.
-- p_dan < 0 → faqat joriy raqam (birinchi ulanish: eski xabarlar qayta ishlanmaydi). Bir so'rovda ko'pi bilan 300 ta.
create or replace function junior_oqi(p_pin text, p_kim text, p_token text, p_dan bigint)
returns table (n bigint, xabar jsonb)
language plpgsql
as $$
declare
  v_jami bigint;
begin
  if p_kim = 'ustoz' then
    if not exists (select 1 from session_secrets s where s.pin = p_pin and s.mentor_token = p_token) then
      raise exception 'Ruxsat yo''q';
    end if;
  else
    if not exists (
      select 1 from player_secrets ps join live_players lp on lp.id = ps.player_id
       where ps.player_id::text = p_kim and ps.token = p_token and lp.pin = p_pin
    ) then
      raise exception 'Ruxsat yo''q';
    end if;
  end if;

  select coalesce((select js.n from junior_sinf js where js.pin = p_pin), 0) into v_jami;
  -- birinchi qator — joriy raqam (xabar null), keyin yangi xabarlar tartib bilan
  return query select v_jami, null::jsonb;
  if p_dan < 0 then return; end if;
  return query
    select x.n, x.xabar from (
      select jx.n, jx.xabar from junior_xabarlar jx
       where jx.pin = p_pin and jx.n > p_dan and jx.kim <> p_kim
         and (p_kim = 'ustoz' or jx.kim = 'ustoz')
       order by jx.n desc limit 300
    ) x order by x.n asc;
end;
$$;
