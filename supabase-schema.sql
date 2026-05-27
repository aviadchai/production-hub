-- Departments
create table departments (
  id text primary key,
  slug text unique not null,
  name_he text not null,
  name_en text not null
);

insert into departments (id, slug, name_he, name_en) values
  ('production', 'production', 'פרודקשן', 'Production'),
  ('design',     'design',     'עיצוב',    'Design'),
  ('content',    'content',    'תוכן',     'Content');

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  department_id text references departments(id),
  quarter text,
  year int,
  status text default 'active',
  created_by text,
  created_at timestamptz default now()
);

-- Scenes
create table scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Prompts
create table prompts (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references scenes(id) on delete cascade,
  prompt_text text not null default '',
  ai_model text default 'other',
  notes text,
  artlist_video_url text,
  artlist_video_src text,
  asset_width int,
  asset_height int,
  asset_ratio text,
  created_by text,
  created_at timestamptz default now()
);

-- Favorites
create table favorites (
  user_id text not null,
  prompt_id uuid references prompts(id) on delete cascade,
  primary key (user_id, prompt_id)
);

-- Comments
create table comments (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid references prompts(id) on delete cascade,
  author_name text,
  body text not null,
  created_at timestamptz default now()
);

-- Saved Prompts
create table saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  prompt_text text not null,
  created_at timestamptz default now()
);

-- project_stats view (used by API)
create view project_stats as
select
  p.*,
  d.name_en as department_name,
  count(distinct s.id)  as scenes_count,
  count(distinct pr.id) as prompts_count
from projects p
left join departments d  on d.id  = p.department_id
left join scenes s       on s.project_id = p.id
left join prompts pr     on pr.scene_id  = s.id
group by p.id, d.name_en;
