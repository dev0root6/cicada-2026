-- CICADA test data. Safe to re-run; safe to delete later (see bottom).
-- Run lib/db/schema.sql FIRST.

-- Three test managers, one event each.
--
-- REPLACE_WITH_DIGEST is a placeholder: this file is committed, so it carries no
-- real credentials. Generate one digest per account with `npm run hash-password`
-- and paste it in before running, or create the accounts through the Team page
-- at /admin/king/team, which is the normal route.
insert into admin_users (username, password_digest, role, created_by)
values ('hack_mgr', 'REPLACE_WITH_DIGEST', 'manager', 'seed')
on conflict (username) do update set password_digest = excluded.password_digest;
insert into admin_user_events (user_id, event_slug)
select id, 'hackathon' from admin_users where username = 'hack_mgr' on conflict do nothing;

insert into admin_users (username, password_digest, role, created_by)
values ('ctf_mgr', 'REPLACE_WITH_DIGEST', 'manager', 'seed')
on conflict (username) do update set password_digest = excluded.password_digest;
insert into admin_user_events (user_id, event_slug)
select id, 'intruverse-ctf' from admin_users where username = 'ctf_mgr' on conflict do nothing;

insert into admin_users (username, password_digest, role, created_by)
values ('expo_mgr', 'REPLACE_WITH_DIGEST', 'manager', 'seed')
on conflict (username) do update set password_digest = excluded.password_digest;
insert into admin_user_events (user_id, event_slug)
select id, 'project-expo' from admin_users where username = 'expo_mgr' on conflict do nothing;

-- 18 test registrations spread across events and payment states.
insert into registrations (event_slug, team_name, contact_name, email, phone, fields, amount_paise, payment_status, cashfree_order_id)
select
  slug,
  'Test Team ' || i,
  'Test Person ' || i,
  'test' || i || '@example.com',
  '+9190000000' || lpad(i::text, 2, '0'),
  jsonb_build_object('college','Atria Institute of Technology','usn','1AT22CS' || lpad(i::text,3,'0'),'year','3rd year'),
  fee,
  (array['paid','paid','pending','failed'])[1 + (i % 4)],
  'test-order-' || slug || '-' || i
from (values
  ('hackathon',120000),('intruverse-ctf',15000),('project-expo',40000),
  ('agentic-ai',15000),('proto-race',15000),('ipl-auction',20000)
) as e(slug,fee), generate_series(1,3) as i
on conflict do nothing;

-- To remove all test data afterwards:
--   delete from registrations where cashfree_order_id like 'test-order-%';
--   delete from admin_users where created_by = 'seed';
