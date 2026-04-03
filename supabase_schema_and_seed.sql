-- Enable the pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================
-- 1. CLEANUP (Optional)
-- ==========================================
-- DROP TABLE IF EXISTS public.ticker_messages CASCADE;
-- DROP TABLE IF EXISTS public.member_notifications CASCADE;
-- DROP TABLE IF EXISTS public.notifications CASCADE;
-- DROP TABLE IF EXISTS public.exam_answers CASCADE;
-- DROP TABLE IF EXISTS public.exam_sessions CASCADE;
-- DROP TABLE IF EXISTS public.exam_permissions CASCADE;
-- DROP TABLE IF EXISTS public.exam_questions CASCADE;
-- DROP TABLE IF EXISTS public.exams CASCADE;
-- DROP TABLE IF EXISTS public.questions CASCADE;
-- DROP TABLE IF EXISTS public.subjects CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;


-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- Profiles
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('admin', 'member')),
  full_name text not null,
  member_code text unique,
  status text default 'active',
  photo_url text,
  exams_taken int default 0,
  avg_score numeric default 0,
  created_at timestamp with time zone default now()
);

-- Subjects
CREATE TABLE public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_te text,
  created_at timestamp with time zone default now()
);

-- Questions
CREATE TABLE public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects on delete cascade,
  text text not null,
  text_te text,
  options jsonb not null, -- Array of strings e.g. ["Option A", "Option B"]
  options_te jsonb,
  correct_answer int not null, -- Index of correct option (0, 1, 2, 3)
  created_at timestamp with time zone default now()
);

-- Exams
CREATE TABLE public.exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_te text,
  description text,
  status text default 'open' check (status in ('open', 'published', 'closed', 'draft')),
  duration_minutes int not null default 60,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Exam Questions
CREATE TABLE public.exam_questions (
  exam_id uuid references public.exams on delete cascade,
  question_id uuid references public.questions on delete cascade,
  order_idx int not null,
  marks int default 1,
  primary key (exam_id, question_id)
);

-- Exam Permissions (Which members can take which exam)
CREATE TABLE public.exam_permissions (
  exam_id uuid references public.exams on delete cascade,
  member_id uuid references public.profiles on delete cascade,
  primary key (exam_id, member_id)
);

-- Exam Sessions
CREATE TABLE public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references public.exams on delete cascade,
  member_id uuid references public.profiles on delete cascade,
  start_time timestamp with time zone default now(),
  end_time timestamp with time zone,
  status text default 'in_progress' check (status in ('in_progress', 'submitted', 'abandoned')),
  violations_count int default 0,
  score numeric,
  created_at timestamp with time zone default now()
);

-- Exam Answers
CREATE TABLE public.exam_answers (
  session_id uuid references public.exam_sessions on delete cascade,
  question_id uuid references public.questions on delete cascade,
  selected_option int,
  primary key (session_id, question_id)
);

-- Notifications
CREATE TABLE public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_te text,
  message text not null,
  message_te text,
  recipient_type text not null,
  status text default 'sent',
  scheduled_at timestamp with time zone,
  sent_by uuid references public.profiles on delete set null,
  is_ticker boolean default false,
  created_at timestamp with time zone default now()
);

-- Member Notifications (Inbox)
CREATE TABLE public.member_notifications (
  notification_id uuid references public.notifications on delete cascade,
  member_id uuid references public.profiles on delete cascade,
  is_read boolean default false,
  created_at timestamp with time zone default now(),
  primary key (notification_id, member_id)
);

-- Ticker Messages
CREATE TABLE public.ticker_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  message_te text,
  is_active boolean default true,
  order_idx int default 0,
  created_at timestamp with time zone default now()
);

-- ==========================================
-- 3. RLS POLICIES (Bypassing for ease of demo via Anon Key)
-- ==========================================
-- Note: In a real prod environment, you would restrict these strictly.
-- But since it's a test environment MVP, we are fully unlocking tables to allow testing.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticker_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.subjects FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.questions FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.exams FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.exam_questions FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.exam_permissions FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.exam_sessions FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.exam_answers FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.member_notifications FOR ALL USING (true);
CREATE POLICY "Allow All" ON public.ticker_messages FOR ALL USING (true);


-- ==========================================
-- 4. INSERT MOCK DATA & TEST CREDENTIALS
-- ==========================================

-- First we create some specific user UUIDs
DO $$
DECLARE
    admin_uuid uuid := 'a1aa1111-1a1a-1111-a1a1-111111111110';
    member_uuid uuid := 'a2aa2222-2a2a-2222-a2a2-222222222220';
    subject_uuid uuid := 'e3ee3333-3e3e-3333-e3e3-333333333330';
    exam_uuid uuid := 'e4ee4444-4e4e-4444-e4e4-444444444440';
    q1_uuid uuid := 'f5ff5555-5f5f-5555-f5f5-555555555551';
    q2_uuid uuid := 'f5ff5555-5f5f-5555-f5f5-555555555552';
BEGIN
    -- 1. Create User in auth.users
    -- Admin: admin@srisoultech.com / password123
    INSERT INTO auth.users (id, instance_id, role, aud, email, raw_app_meta_data, raw_user_meta_data, is_super_admin, encrypted_password, created_at, updated_at, confirmation_token, email_confirmed_at)
    VALUES 
    (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@srisoultech.com', '{"provider":"email","providers":["email"]}', '{}', false, crypt('password123', gen_salt('bf')), now(), now(), '', now())
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (admin_uuid, admin_uuid, admin_uuid, format('{"sub":"%s","email":"%s"}', admin_uuid, 'admin@srisoultech.com')::jsonb, 'email', now(), now(), now())
    ON CONFLICT (provider, provider_id) DO NOTHING;

    -- Member: member@srisoultech.com / password123
    INSERT INTO auth.users (id, instance_id, role, aud, email, raw_app_meta_data, raw_user_meta_data, is_super_admin, encrypted_password, created_at, updated_at, confirmation_token, email_confirmed_at)
    VALUES 
    (member_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member@srisoultech.com', '{"provider":"email","providers":["email"]}', '{}', false, crypt('password123', gen_salt('bf')), now(), now(), '', now())
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (member_uuid, member_uuid, member_uuid, format('{"sub":"%s","email":"%s"}', member_uuid, 'member@srisoultech.com')::jsonb, 'email', now(), now(), now())
    ON CONFLICT (provider, provider_id) DO NOTHING;

    -- 2. Populate Profiles
    INSERT INTO public.profiles (id, role, full_name, member_code, status, exams_taken, avg_score)
    VALUES 
    (admin_uuid, 'admin', 'System Admin', 'ADM001', 'active', 0, 0),
    (member_uuid, 'member', 'Test Student', 'STU001', 'active', 0, 0)
    ON CONFLICT (id) DO NOTHING;

    -- 3. Populate Subjects & Questions
    INSERT INTO public.subjects (id, name, name_te) VALUES (subject_uuid, 'Computer Science', 'కంప్యూటర్ సైన్స్') ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.questions (id, subject_id, text, text_te, options, options_te, correct_answer) VALUES 
    (q1_uuid, subject_uuid, 'What is 2+2?', '2+2 ఎంత?', '["2", "3", "4", "5"]'::jsonb, '["2", "3", "4", "5"]'::jsonb, 2),
    (q2_uuid, subject_uuid, 'Which data structure uses LIFO?', 'LIFO ఏ డేటా స్ట్రక్చర్ ఉపయోగిస్తుంది?', '["Queue", "Stack", "Tree", "Graph"]'::jsonb, '["క్యూ", "స్టాక్", "ట్రీ", "గ్రాఫ్"]'::jsonb, 1)
    ON CONFLICT (id) DO NOTHING;

    -- 4. Create an Open Exam
    INSERT INTO public.exams (id, title, title_te, description, status, duration_minutes) VALUES 
    (exam_uuid, 'CS Fundamentals Level 1', 'CS ఫండమెంటల్స్ లెవల్ 1', 'Basic CS Test', 'open', 60)
    ON CONFLICT (id) DO NOTHING;

    -- Link questions to Exam
    INSERT INTO public.exam_questions (exam_id, question_id, order_idx, marks) VALUES 
    (exam_uuid, q1_uuid, 0, 1),
    (exam_uuid, q2_uuid, 1, 1)
    ON CONFLICT (exam_id, question_id) DO NOTHING;

    -- Link member to Exam Permissions
    INSERT INTO public.exam_permissions (exam_id, member_id) VALUES 
    (exam_uuid, member_uuid)
    ON CONFLICT (exam_id, member_id) DO NOTHING;

    -- 5. Seed Ticker Messages
    INSERT INTO public.ticker_messages (message, message_te, order_idx) VALUES 
    ('Welcome to the new SriSoulTech Portal!', 'కొత్త శ్రీసోల్‌టెక్ పోర్టల్‌కు స్వాగతం!', 1),
    ('CS Fundamentals Exam is now open!', 'CS ఫండమెంటల్స్ పరీక్ష ఇప్పుడు తెరవబడింది!', 2);

END $$;
