-- Registrations captured from the public event forms, with Cashfree payment state.
-- Apply with: npm run db:migrate

create table if not exists registrations (
  id                bigserial primary key,

  -- Which event this is for. Matches a slug in data/events.ts; deliberately not
  -- a foreign key, since events live in source control rather than the database.
  event_slug        text        not null,

  -- Primary contact. Kept as real columns because every form needs them and the
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

create index if not exists registrations_event_slug_idx on registrations (event_slug);
create index if not exists registrations_payment_status_idx on registrations (payment_status);
create index if not exists registrations_created_at_idx on registrations (created_at desc);

-- One registration per email per event, so a refresh or double submit cannot
-- create duplicates. Partial: cancelled attempts should not block a retry.
create unique index if not exists registrations_event_email_idx
  on registrations (event_slug, lower(email))
  where payment_status <> 'cancelled';
