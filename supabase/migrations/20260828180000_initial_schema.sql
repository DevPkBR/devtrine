begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_]{3,30}$'),
  name text not null check (char_length(name) between 1 and 80),
  bio text check (bio is null or char_length(bio) <= 300),
  avatar_path text,
  links jsonb not null default '[]'::jsonb check (jsonb_typeof(links) = 'array'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 50),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 50),
  slug text not null unique check (slug ~ '^[a-z0-9.+#-]+$'),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) between 1 and 5000),
  url text not null check (url ~* '^https?://'),
  thumbnail_path text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    (status = 'draft' and published_at is null)
    or (status = 'published' and published_at is not null)
  )
);

create table public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (project_id, technology_id)
);

create table public.project_likes (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (project_id, user_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table public.saved_projects (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (project_id, user_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('profile', 'project', 'comment')),
  target_id uuid not null,
  reason text not null check (char_length(reason) between 1 and 500),
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed', 'actioned')),
  created_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz
);

create index projects_author_created_idx on public.projects(author_id, created_at desc);
create index projects_published_idx on public.projects(published_at desc) where status = 'published';
create index projects_category_published_idx on public.projects(category_id, published_at desc) where status = 'published';
create index comments_project_created_idx on public.comments(project_id, created_at);
create index follows_following_idx on public.follows(following_id);
create index reports_status_created_idx on public.reports(status, created_at);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger comments_set_updated_at before update on public.comments
for each row execute function public.set_updated_at();

insert into public.categories (name, slug) values
  ('Web', 'web'),
  ('Mobile', 'mobile'),
  ('Design', 'design'),
  ('Open source', 'open-source');

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.technologies enable row level security;
alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.saved_projects enable row level security;
alter table public.reports enable row level security;

create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users create their own profile" on public.profiles for insert to authenticated
with check ((select auth.uid()) = id);
create policy "Users update their own profile" on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Categories are publicly readable" on public.categories for select using (true);
create policy "Technologies are publicly readable" on public.technologies for select using (true);
create policy "Authenticated users add technologies" on public.technologies for insert to authenticated
with check ((select auth.uid()) is not null);

create policy "Published projects and own drafts are readable" on public.projects for select
using (status = 'published' or (select auth.uid()) = author_id);
create policy "Users create their own projects" on public.projects for insert to authenticated
with check ((select auth.uid()) = author_id);
create policy "Users update their own projects" on public.projects for update to authenticated
using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "Users delete their own projects" on public.projects for delete to authenticated
using ((select auth.uid()) = author_id);

create policy "Project technologies follow project visibility" on public.project_technologies for select
using (exists (select 1 from public.projects p where p.id = project_id and (p.status = 'published' or p.author_id = (select auth.uid()))));
create policy "Owners add project technologies" on public.project_technologies for insert to authenticated
with check (exists (select 1 from public.projects p where p.id = project_id and p.author_id = (select auth.uid())));
create policy "Owners remove project technologies" on public.project_technologies for delete to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and p.author_id = (select auth.uid())));

create policy "Likes follow project visibility" on public.project_likes for select
using (exists (select 1 from public.projects p where p.id = project_id and (p.status = 'published' or p.author_id = (select auth.uid()))));
create policy "Users like as themselves" on public.project_likes for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
create policy "Users remove their own likes" on public.project_likes for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Comments follow project visibility" on public.comments for select
using (exists (select 1 from public.projects p where p.id = project_id and (p.status = 'published' or p.author_id = (select auth.uid()))));
create policy "Users comment as themselves" on public.comments for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
create policy "Users update their own comments" on public.comments for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users delete their own comments" on public.comments for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Follows are publicly readable" on public.follows for select using (true);
create policy "Users follow as themselves" on public.follows for insert to authenticated
with check ((select auth.uid()) = follower_id);
create policy "Users unfollow as themselves" on public.follows for delete to authenticated
using ((select auth.uid()) = follower_id);

create policy "Users read their own saves" on public.saved_projects for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users save as themselves" on public.saved_projects for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
create policy "Users remove their own saves" on public.saved_projects for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read their own reports" on public.reports for select to authenticated
using ((select auth.uid()) = reporter_id);
create policy "Users submit reports as themselves" on public.reports for insert to authenticated
with check ((select auth.uid()) = reporter_id and status = 'pending');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 512000, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('project-thumbnails', 'project-thumbnails', true, 512000, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public images are readable" on storage.objects for select
using (bucket_id in ('avatars', 'project-thumbnails'));
create policy "Users upload images in their folder" on storage.objects for insert to authenticated
with check (
  bucket_id in ('avatars', 'project-thumbnails')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Users update images in their folder" on storage.objects for update to authenticated
using (
  bucket_id in ('avatars', 'project-thumbnails')
  and (storage.foldername(name))[1] = (select auth.uid())::text
) with check (
  bucket_id in ('avatars', 'project-thumbnails')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "Users delete images in their folder" on storage.objects for delete to authenticated
using (
  bucket_id in ('avatars', 'project-thumbnails')
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

commit;
