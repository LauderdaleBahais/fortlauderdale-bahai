create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  status text default 'pending' check (status in ('pending', 'approved')),
  submitted_by text,
  is_holy_day boolean default false,
  created_at timestamptz default now()
);

create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  featured_image_url text,
  published boolean default false,
  author_id text,
  author_name text,
  created_at timestamptz default now()
);

create table board_threads (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  author_id text not null,
  author_name text,
  pinned boolean default false,
  created_at timestamptz default now()
);

create table board_replies (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references board_threads(id) on delete cascade,
  body text not null,
  author_id text not null,
  author_name text,
  created_at timestamptz default now()
);

create table business_listings (
  id uuid default gen_random_uuid() primary key,
  business_name text not null,
  owner_id text not null,
  owner_name text,
  category text not null,
  description text,
  website_url text,
  phone text,
  email text,
  location text,
  status text default 'pending' check (status in ('pending', 'approved', 'featured')),
  created_at timestamptz default now()
);

create table resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  description text,
  category text,
  sort_order int default 0
);

-- Seed resources
insert into resources (title, url, description, category) values
('Bahá''í World Community', 'https://www.bahai.org', 'The official website of the worldwide Bahá''í community', 'Faith'),
('Bahá''ís of the United States', 'https://www.bahai.us', 'National community website', 'Faith'),
('Bahá''í Reference Library', 'https://reference.bahai.org', 'Authoritative source of Bahá''í writings', 'Study'),
('Ruhi Institute', 'https://www.ruhi.org', 'Study circle materials and Ruhi books', 'Study'),
('Bahá''í World News Service', 'https://news.bahai.org', 'News from the worldwide Bahá''í community', 'News');

create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table email_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  unsubscribe_token uuid default gen_random_uuid() unique not null,
  subscribed boolean default true,
  created_at timestamptz default now()
);

create table devotional_gatherings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null check (type in ('Devotional', 'Study Circle', 'Children''s Class', 'Junior Youth', 'Other')),
  description text,
  location text,
  address text,
  schedule text not null,
  recurrence text default 'weekly' check (recurrence in ('weekly', 'biweekly', 'monthly', 'one-time')),
  day_of_week text,
  time_of_day text,
  host_name text,
  host_contact text,
  status text default 'pending' check (status in ('pending', 'approved')),
  submitted_by text,
  created_at timestamptz default now()
);

-- Seed 2025 Bahá'í Holy Days
insert into events (title, description, start_time, end_time, status, is_holy_day) values
('Ayyám-i-Há (Days of Ha)', 'A period of preparation before the Bahá''í Fast, associated with hospitality, charity, and gift-giving.', '2025-02-26 00:00:00+00', '2025-03-01 23:59:59+00', 'approved', true),
('The Bahá''í Fast', 'A period of fasting observed by Bahá''ís from sunrise to sunset as an act of spiritual discipline. Adults (15–70) abstain from food and drink during daylight hours.', '2025-03-02 00:00:00+00', '2025-03-20 23:59:59+00', 'approved', true),
('Naw-Rúz (Bahá''í New Year)', 'The Bahá''í New Year, coinciding with the vernal equinox. One of the nine holy days on which work is suspended.', '2025-03-20 00:00:00+00', '2025-03-20 23:59:59+00', 'approved', true),
('First Day of Ridván', 'The first day of the Festival of Ridván, commemorating Bahá''u''lláh''s declaration of His mission in the Garden of Ridván in Baghdad in 1863. Work is suspended.', '2025-04-21 00:00:00+00', '2025-04-21 23:59:59+00', 'approved', true),
('Ninth Day of Ridván', 'The ninth day of the Festival of Ridván, when Bahá''u''lláh''s family joined Him in the Garden of Ridván. Work is suspended.', '2025-04-29 00:00:00+00', '2025-04-29 23:59:59+00', 'approved', true),
('Twelfth Day of Ridván', 'The final day of the Festival of Ridván, marking Bahá''u''lláh''s departure from the Garden. Work is suspended.', '2025-05-02 00:00:00+00', '2025-05-02 23:59:59+00', 'approved', true),
('Declaration of the Báb', 'Commemorates the evening in 1844 when the Báb declared His mission to Mullá Husayn in Shiraz, Iran. Work is suspended.', '2025-05-23 00:00:00+00', '2025-05-23 23:59:59+00', 'approved', true),
('Ascension of Bahá''u''lláh', 'Commemorates the passing of Bahá''u''lláh on May 29, 1892. Observed at 3:00 a.m. Work is suspended.', '2025-05-29 00:00:00+00', '2025-05-29 23:59:59+00', 'approved', true),
('Martyrdom of the Báb', 'Commemorates the execution of the Báb on July 9, 1850, in Tabriz, Iran. Observed at noon. Work is suspended.', '2025-07-09 00:00:00+00', '2025-07-09 23:59:59+00', 'approved', true),
('Birth of the Báb', 'One of the Twin Holy Birthdays. Commemorates the birth of Siyyid Ali-Muhammad (the Báb) in 1819. Work is suspended.', '2025-10-20 00:00:00+00', '2025-10-20 23:59:59+00', 'approved', true),
('Birth of Bahá''u''lláh', 'One of the Twin Holy Birthdays. Commemorates the birth of Mirza Husayn-Ali (Bahá''u''lláh) in 1817. Work is suspended.', '2025-10-21 00:00:00+00', '2025-10-21 23:59:59+00', 'approved', true),
('Day of the Covenant', 'A day set apart by Bahá''u''lláh to honor ''Abdu''l-Bahá as the Center of the Covenant. Not a holy day on which work is suspended.', '2025-11-26 00:00:00+00', '2025-11-26 23:59:59+00', 'approved', true),
('Ascension of ''Abdu''l-Bahá', 'Commemorates the passing of ''Abdu''l-Bahá on November 28, 1921. Not a holy day on which work is suspended.', '2025-11-28 00:00:00+00', '2025-11-28 23:59:59+00', 'approved', true);

-- Seed a sample blog post
insert into blog_posts (title, slug, content, excerpt, published, author_name) values
('Welcome to the Fort Lauderdale Bahá''í Community Website',
 'welcome-to-our-new-community-website',
 '<p>We are delighted to launch this new community website as a hub for our local Bahá''í community. Here you will find information about our upcoming events, community news, and resources for deepening your understanding of the Bahá''í Faith.</p>
<p>The Bahá''í Faith teaches the oneness of God, the oneness of religion, and the oneness of humanity. Our community in Fort Lauderdale strives to live these principles through devotional gatherings, study circles, children''s classes, junior youth programs, and service to the wider community.</p>
<p>We invite everyone—Bahá''í and non-Bahá''í alike—to explore this site and join us in building a more unified and just world.</p>',
 'We are delighted to launch this new community website as a hub for our local Bahá''í community in Fort Lauderdale.',
 true,
 'The Bahá''í Community of Fort Lauderdale');
