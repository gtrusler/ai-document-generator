-- Update Simple Agreement template
UPDATE document_templates
SET 
  version = '1.0',
  category = 'agreement'::template_category,
  variables = jsonb_build_object(
    'party_1_name', jsonb_build_object(
      'type', 'string',
      'required', true,
      'description', 'Full name of the first party'
    ),
    'party_2_name', jsonb_build_object(
      'type', 'string',
      'required', true,
      'description', 'Full name of the second party'
    )
  ),
  validation_rules = jsonb_build_object(
    'party_1_name', jsonb_build_object(
      'pattern', '^[A-Za-z ]{2,50}$',
      'min', 2,
      'max', 50
    ),
    'party_2_name', jsonb_build_object(
      'pattern', '^[A-Za-z ]{2,50}$',
      'min', 2,
      'max', 50
    )
  ),
  metadata = jsonb_build_object(
    'lastReviewed', now(),
    'reviewedBy', 'admin',
    'tags', array['legal', 'agreement', 'basic']
  )
WHERE name = 'Simple Agreement';

-- Update Confidentiality Agreement template
UPDATE document_templates
SET 
  version = '1.0',
  category = 'legal'::template_category,
  variables = jsonb_build_object(
    'company_name', jsonb_build_object(
      'type', 'string',
      'required', true,
      'description', 'Legal name of the company'
    ),
    'recipient_name', jsonb_build_object(
      'type', 'string',
      'required', true,
      'description', 'Full name of the recipient'
    )
  ),
  validation_rules = jsonb_build_object(
    'company_name', jsonb_build_object(
      'pattern', '^[A-Za-z0-9 .,]{2,100}$',
      'min', 2,
      'max', 100
    ),
    'recipient_name', jsonb_build_object(
      'pattern', '^[A-Za-z ]{2,50}$',
      'min', 2,
      'max', 50
    )
  ),
  metadata = jsonb_build_object(
    'lastReviewed', now(),
    'reviewedBy', 'admin',
    'tags', array['legal', 'nda', 'confidentiality'],
    'jurisdiction', 'US'
  )
WHERE name = 'Confidentiality Agreement';
