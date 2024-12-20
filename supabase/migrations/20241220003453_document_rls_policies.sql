-- Document Templates policies
create policy "Templates are viewable by all authenticated users"
  on document_templates for select
  to authenticated
  using (true);

create policy "Only admins can insert templates"
  on document_templates for insert
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can update templates"
  on document_templates for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- User Responses policies
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
  using (auth.uid() = user_id);

-- Document Generations policies
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
  using (auth.uid() = user_id);
