-- Create document templates table
create table if not exists document_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  content text not null,
  field_codes jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user responses table
create table if not exists user_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  template_id uuid references document_templates not null,
  responses jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create document generations table
create table if not exists document_generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  template_id uuid references document_templates not null,
  response_id uuid references user_responses not null,
  status text check (status in ('draft', 'review', 'approved', 'completed')) not null,
  generated_document_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table document_templates enable row level security;
alter table user_responses enable row level security;
alter table document_generations enable row level security;
