-- Create tables
create table if not exists document_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  content text not null,
  field_codes jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  template_id uuid references document_templates not null,
  responses jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- Enable RLS
alter table document_templates enable row level security;
alter table user_responses enable row level security;
alter table document_generations enable row level security;

-- Add RLS policies for document_templates
create policy "Templates are viewable by all authenticated users"
  on document_templates for select
  to authenticated
  using (true);

create policy "Only admins can insert templates"
  on document_templates for insert
  to authenticated
  with check ((auth.jwt() ->> 'role') = 'admin');

create policy "Only admins can update templates"
  on document_templates for update
  to authenticated
  using ((auth.jwt() ->> 'role') = 'admin')
  with check ((auth.jwt() ->> 'role') = 'admin');

-- Add RLS policies for user_responses
create policy "Users can view their own responses"
  on user_responses for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own responses"
  on user_responses for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own responses"
  on user_responses for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Add RLS policies for document_generations
create policy "Users can view their own generated documents"
  on document_generations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own document generations"
  on document_generations for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own document generations"
  on document_generations for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Insert test data
insert into document_templates (name, description, content, field_codes)
values 
  ('Simple Agreement', 
   'Basic agreement template', 
   'This agreement is between [P001:party_1_name] and [P002:party_2_name]...', 
   '["P001", "P002"]'::jsonb),
  ('Confidentiality Agreement', 
   'Standard NDA template', 
   'This NDA is entered into by [P001:company_name] ("Company") and [P002:recipient_name] ("Recipient")...', 
   '["P001", "P002", "A001"]'::jsonb);
