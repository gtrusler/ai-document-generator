-- Insert test templates
insert into document_templates (name, description, content, field_codes)
values 
  ('Simple Agreement', 
   'Basic agreement template', 
   'This agreement is between [P001:party_1_name] and [P002:party_2_name]...', 
   '["P001", "P002"]'),
  ('Confidentiality Agreement', 
   'Standard NDA template', 
   'This NDA is entered into by [P001:company_name] ("Company") and [P002:recipient_name] ("Recipient")...', 
   '["P001", "P002", "A001"]');

-- Create a test admin user role
create or replace function create_admin_user()
returns void as $$
begin
  insert into auth.users (
    instance_id,
    id,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'admin',
    'admin@example.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now()
  )
  on conflict (email) do nothing;
end;
$$ language plpgsql;

select create_admin_user();
