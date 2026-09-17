-- Ejecuta esto en Supabase: Project > SQL Editor > New query > Run

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  streak integer not null default 0,
  completed_today boolean not null default false,
  created_at timestamptz not null default now()
);

-- Habilita Row Level Security (obligatorio en Supabase para exponer la tabla).
alter table habits enable row level security;

-- Como este proyecto no tiene autenticación de usuarios, se permite acceso
-- público con la anon key (adecuado para un proyecto de curso/demo).
-- Si más adelante agregas login, reemplaza estas políticas por unas
-- filtradas por auth.uid().
create policy "Público puede leer hábitos"
  on habits for select
  using (true);

create policy "Público puede crear hábitos"
  on habits for insert
  with check (true);

create policy "Público puede actualizar hábitos"
  on habits for update
  using (true);

create policy "Público puede borrar hábitos"
  on habits for delete
  using (true);
