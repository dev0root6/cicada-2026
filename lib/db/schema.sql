-- CICADA admin schema. Idempotent — safe to run repeatedly.
-- Apply with `npm run db:migrate`, or paste into the Neon SQL Editor.

-- ---------------------------------------------------------------------------
-- Registrations captured from the public event forms, with Cashfree payment
-- state and on-site attendance.
-- ---------------------------------------------------------------------------
create table if not exists registrations (
  id                bigserial primary key,

  -- Which event this is for. Matches a slug in data/events.ts; deliberately not
  -- a foreign key, since events live in source control rather than the database.
  event_slug        text        not null,

  -- Primary contact. Real columns because every form needs them and the
  -- dashboard filters and sorts on them.
  team_name         text,
  contact_name      text        not null,
  email             text        not null,
  phone             text        not null,

  -- Whatever else that event's form collected. Per-event fields vary, so they
  -- live in JSON rather than forcing a migration per event.
  fields            jsonb       not null default '{}'::jsonb,

  -- Payment. amount_paise avoids floating point on currency.
  amount_paise      integer     not null default 0,
  currency          text        not null default 'INR',
  payment_status    text        not null default 'pending'
                                check (payment_status in ('pending','paid','failed','refunded','cancelled')),

  -- Cashfree correlation. order_id is ours; payment_id comes back on capture.
  cashfree_order_id text        unique,
  cashfree_payment_id text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Attendance / check-in at the venue. Added separately so the table can be
-- extended on a database that already holds registrations.
alter table registrations add column if not exists checked_in_at timestamptz;
alter table registrations add column if not exists checked_in_by text;
alter table registrations add column if not exists notes         text;

create index if not exists registrations_event_slug_idx     on registrations (event_slug);
create index if not exists registrations_payment_status_idx  on registrations (payment_status);
create index if not exists registrations_created_at_idx      on registrations (created_at desc);
create index if not exists registrations_checked_in_idx      on registrations (event_slug, checked_in_at);

-- One registration per email per event, so a refresh or double submit cannot
-- create duplicates. Partial: cancelled attempts should not block a retry.
create unique index if not exists registrations_event_email_idx
  on registrations (event_slug, lower(email))
  where payment_status <> 'cancelled';

-- ---------------------------------------------------------------------------
-- Admin and manager accounts.
--
-- The bootstrap admins live in environment variables (ADMIN_USER_*) so nobody
-- can be locked out by a bad database state. Accounts created here are the
-- ones admins add at runtime — typically one manager per event.
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  id              bigserial primary key,

  -- Stored lowercase; sign-in lowercases the input before comparing.
  username        text        not null unique,

  -- pbkdf2:<iterations>:<saltHex>:<hashHex>. Never a plaintext password.
  password_digest text        not null,

  role            text        not null default 'manager'
                              check (role in ('admin','manager')),

  -- Username of whoever created this account, for an audit trail.
  created_by      text,
  created_at      timestamptz not null default now(),

  -- Soft delete: set to revoke access while keeping the audit trail intact.
  disabled_at     timestamptz
);

create index if not exists admin_users_active_idx on admin_users (username) where disabled_at is null;

-- ---------------------------------------------------------------------------
-- Which events a manager is responsible for.
--
-- A manager sees and edits only the events listed here. Admins are not listed:
-- their access spans every event and is not stored as rows.
-- ---------------------------------------------------------------------------
create table if not exists admin_user_events (
  user_id    bigint not null references admin_users (id) on delete cascade,
  event_slug text   not null,
  primary key (user_id, event_slug)
);

create index if not exists admin_user_events_slug_idx on admin_user_events (event_slug);

-- ---------------------------------------------------------------------------
-- "Notify me" sign-ups from an event's registration page while registrations
-- are still closed. One row per email per event.
-- ---------------------------------------------------------------------------
create table if not exists registration_interest (
  id         bigserial   primary key,
  event_slug text        not null,
  email      text        not null,
  created_at timestamptz not null default now()
);

create unique index if not exists registration_interest_event_email_idx
  on registration_interest (event_slug, lower(email));

-- Set once the "registrations are open" alert reached this address, so the
-- alert can be re-run to finish a partial send without emailing anyone twice.
alter table registration_interest add column if not exists notified_at timestamptz;

create index if not exists registration_interest_pending_idx
  on registration_interest (event_slug, created_at) where notified_at is null;

-- ---------------------------------------------------------------------------
-- Small key/value switches the admin console can flip at runtime, e.g. whether
-- the /helloworld easter egg has been claimed.
-- ---------------------------------------------------------------------------
create table if not exists site_flags (
  key        text        primary key,
  value      text        not null,
  updated_by text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Every email sent from the admin Outreach page. Lets a broadcast skip people
-- who already got the same kind of email recently, and leaves an audit trail.
-- ---------------------------------------------------------------------------
create table if not exists email_log (
  id         bigserial   primary key,
  kind       text        not null,
  recipient  text        not null,
  event_slug text,
  note       text,
  sent_by    text,
  sent_at    timestamptz not null default now()
);

create index if not exists email_log_kind_recipient_idx
  on email_log (kind, lower(recipient), sent_at desc);
