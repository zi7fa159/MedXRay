-- Create a demo user in auth.users
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, encrypted_password)
VALUES (
  'demo-user-id-123456789',
  'demo@medxray.ai',
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo User"}',
  false,
  '$2a$10$Gg9Ot1C0dMHJEvF7nCGIj.WlAUGTCXUGOdCGbcR2vQQOv/hT6.Soe' -- Password: demo123
)
ON CONFLICT (id) DO NOTHING;

-- Create a corresponding entry in public.users
INSERT INTO public.users (id, name, full_name, email, token_identifier, created_at)
VALUES (
  'demo-user-id-123456789',
  'Demo User',
  'Demo User',
  'demo@medxray.ai',
  'demo-user-id-123456789',
  now()
)
ON CONFLICT (id) DO NOTHING;
