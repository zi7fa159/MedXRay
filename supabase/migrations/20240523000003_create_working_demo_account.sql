-- Create a demo user with proper credentials
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'demo@medxray.ai',
  '$2a$10$Gg9Ot1C0dMHJEvF7nCGIj.WlAUGTCXUGOdCGbcR2vQQOv/hT6.Soe',  -- Password: demo123
  NOW(),
  NULL,
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create a corresponding entry in public.users
INSERT INTO public.users (id, name, full_name, email, token_identifier, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Demo User',
  'Demo User',
  'demo@medxray.ai',
  '11111111-1111-1111-1111-111111111111',
  NOW()
);
