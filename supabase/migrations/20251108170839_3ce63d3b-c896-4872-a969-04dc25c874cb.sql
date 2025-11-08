-- Enums for question types and difficulty levels
create type question_type as enum ('multiple_single', 'multiple_multi', 'true_false', 'open');
create type difficulty_level as enum ('easy','medium','hard');

-- Subject taxonomy
create table subject (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Topic taxonomy with hierarchical structure
create table topic (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subject(id) on delete set null,
  name text not null,
  parent_topic_id uuid references topic(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Main questions table
create table question (
  id uuid primary key default gen_random_uuid(),
  type question_type not null default 'multiple_single',
  difficulty difficulty_level,
  stem text not null,
  stem_image_path text,
  explanation text,
  source text,
  subject_id uuid references subject(id) on delete set null,
  topic_id uuid references topic(id) on delete set null,
  owner_id uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- Apply trigger to question table
create trigger trg_question_updated
before update on question
for each row execute function update_updated_at_column();

-- Choices/alternatives table
create table choice (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references question(id) on delete cascade,
  label text not null,
  content text not null,
  is_correct boolean,
  image_path text,
  position int not null default 1,
  created_at timestamptz not null default now()
);

-- Ensure unique labels per question
create unique index uq_choice_question_label on choice (question_id, label);

-- Full-text search table
create table question_search (
  question_id uuid primary key references question(id) on delete cascade,
  tsv tsvector
);

-- Function to refresh search index
create or replace function refresh_question_search(qid uuid)
returns void language sql as $$
  insert into question_search (question_id, tsv)
  select q.id,
         setweight(to_tsvector('portuguese', coalesce(q.stem,'')), 'A') ||
         setweight(to_tsvector('portuguese', coalesce(string_agg(c.content,' '),'')), 'B')
  from question q
  left join choice c on c.question_id = q.id
  where q.id = qid
  group by q.id
  on conflict (question_id) do update
  set tsv = excluded.tsv;
$$;

-- Trigger function for search index
create or replace function trg_refresh_question_search()
returns trigger language plpgsql as $$
begin
  perform refresh_question_search(coalesce(new.id, old.id));
  return new;
end; $$;

-- Triggers to maintain search index
create trigger tsv_question_aiud
after insert or update or delete on question
for each row execute function trg_refresh_question_search();

create trigger tsv_choice_aiud
after insert or update or delete on choice
for each row execute function trg_refresh_question_search();

-- Enable RLS on all tables
alter table subject enable row level security;
alter table topic enable row level security;
alter table question enable row level security;
alter table choice enable row level security;
alter table question_search enable row level security;

-- RLS Policies for subject (public read, authenticated write)
create policy "Anyone can view subjects"
  on subject for select
  using (true);

create policy "Authenticated users can create subjects"
  on subject for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update subjects"
  on subject for update
  to authenticated
  using (true);

-- RLS Policies for topic (public read, authenticated write)
create policy "Anyone can view topics"
  on topic for select
  using (true);

create policy "Authenticated users can create topics"
  on topic for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update topics"
  on topic for update
  to authenticated
  using (true);

-- RLS Policies for question (users manage their own)
create policy "Users can view their own questions"
  on question for select
  using (auth.uid() = owner_id);

create policy "Users can create their own questions"
  on question for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Users can update their own questions"
  on question for update
  to authenticated
  using (auth.uid() = owner_id);

create policy "Users can delete their own questions"
  on question for delete
  to authenticated
  using (auth.uid() = owner_id);

-- RLS Policies for choice (inherited from question)
create policy "Users can view choices for their questions"
  on choice for select
  using (exists (
    select 1 from question
    where question.id = choice.question_id
    and question.owner_id = auth.uid()
  ));

create policy "Users can create choices for their questions"
  on choice for insert
  to authenticated
  with check (exists (
    select 1 from question
    where question.id = choice.question_id
    and question.owner_id = auth.uid()
  ));

create policy "Users can update choices for their questions"
  on choice for update
  to authenticated
  using (exists (
    select 1 from question
    where question.id = choice.question_id
    and question.owner_id = auth.uid()
  ));

create policy "Users can delete choices for their questions"
  on choice for delete
  to authenticated
  using (exists (
    select 1 from question
    where question.id = choice.question_id
    and question.owner_id = auth.uid()
  ));

-- RLS Policies for question_search (matches question policies)
create policy "Users can view search index for their questions"
  on question_search for select
  using (exists (
    select 1 from question
    where question.id = question_search.question_id
    and question.owner_id = auth.uid()
  ));