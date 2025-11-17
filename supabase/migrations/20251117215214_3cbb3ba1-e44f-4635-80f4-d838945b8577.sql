
-- Primeiro, vamos criar os perfis que faltam para os usuários existentes
-- que foram cadastrados mas não tiveram perfis criados

-- Criar perfil para João Batista se não existir
INSERT INTO public.user_profiles (id, role, full_name, is_active)
SELECT 'dc86b828-6458-4f7c-891c-2806caa3ed77'::uuid, 'paciente', 'João Batista', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles WHERE id = 'dc86b828-6458-4f7c-891c-2806caa3ed77'::uuid
);

-- Agora vamos corrigir a política RLS para INSERT
-- Remover a política antiga
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.user_profiles;

-- Criar nova política que permite usuários autenticados criarem seu próprio perfil
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Verificar se o trigger existe e está ativo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, full_name, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'paciente')::text,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)::text,
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Recriar o trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
