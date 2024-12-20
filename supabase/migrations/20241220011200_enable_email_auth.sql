-- Enable email authentication
INSERT INTO auth.providers (provider_id, enabled)
VALUES ('email', true)
ON CONFLICT (provider_id)
DO UPDATE SET enabled = true;

-- Ensure the admin user exists and has the correct role
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = 'admin@example.com'
    ) THEN
        -- Create the admin user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            user_metadata
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4(),
            'authenticated',
            'authenticated',
            'admin@example.com',
            crypt('admin123', gen_salt('bf')),
            now(),
            now(),
            now(),
            jsonb_build_object('role', 'admin')
        );
    END IF;
END $$;
