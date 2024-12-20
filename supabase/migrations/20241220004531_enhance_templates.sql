-- Add additional fields to document_templates
ALTER TABLE document_templates
ADD COLUMN IF NOT EXISTS version text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS variables jsonb,
ADD COLUMN IF NOT EXISTS validation_rules jsonb,
ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Create template categories enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_category') THEN
        CREATE TYPE template_category AS ENUM ('agreement', 'letter', 'legal', 'form');
    END IF;
END $$;

-- Create an index on template name and version
DROP INDEX IF EXISTS idx_template_name_version;
CREATE UNIQUE INDEX idx_template_name_version 
ON document_templates(name, COALESCE(version, 'latest'));

-- Alter category column to use enum type
ALTER TABLE document_templates 
ALTER COLUMN category TYPE template_category USING 
  CASE 
    WHEN category = 'agreement' THEN 'agreement'::template_category
    WHEN category = 'letter' THEN 'letter'::template_category
    WHEN category = 'legal' THEN 'legal'::template_category
    WHEN category = 'form' THEN 'form'::template_category
    ELSE NULL
  END;
