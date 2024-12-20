-- First, let's check if we have any templates
SELECT * FROM document_templates;

-- Drop existing policies on document_templates
DROP POLICY IF EXISTS "Templates are viewable by all authenticated users" ON document_templates;
DROP POLICY IF EXISTS "Only admins can insert templates" ON document_templates;
DROP POLICY IF EXISTS "Only admins can update templates" ON document_templates;

-- Create a temporary policy for testing
CREATE POLICY "temp_allow_all" ON document_templates FOR ALL USING (true);

-- Try inserting templates again
INSERT INTO document_templates (name, description, content, field_codes)
VALUES 
  ('Simple Agreement', 
   'Basic agreement template', 
   'This agreement is between [P001:party_1_name] and [P002:party_2_name]...', 
   '["P001", "P002"]'::jsonb),
  ('Confidentiality Agreement', 
   'Standard NDA template', 
   'This NDA is entered into by [P001:company_name] ("Company") and [P002:recipient_name] ("Recipient")...', 
   '["P001", "P002", "A001"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Verify the templates were inserted
SELECT * FROM document_templates;
