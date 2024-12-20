-- Create a temporary table to store the latest template versions
CREATE TEMP TABLE latest_templates AS
SELECT DISTINCT ON (name) id, name, updated_at
FROM document_templates
ORDER BY name, updated_at DESC;

-- Update user_responses to point to the latest template versions
UPDATE user_responses ur
SET template_id = lt.id
FROM document_templates dt
JOIN latest_templates lt ON dt.name = lt.name
WHERE ur.template_id = dt.id
AND dt.id != lt.id;

-- Update document_generations to point to the latest template versions
UPDATE document_generations dg
SET template_id = lt.id
FROM document_templates dt
JOIN latest_templates lt ON dt.name = lt.name
WHERE dg.template_id = dt.id
AND dt.id != lt.id;

-- Delete duplicate templates, keeping only the latest version of each
DELETE FROM document_templates t
WHERE t.id NOT IN (
  SELECT lt.id
  FROM latest_templates lt
);

-- Clean up the temporary table
DROP TABLE latest_templates;
