
-- =====================================================
-- GULGO : PLATFORM SUPER ADMIN
-- Migration 202611170001
-- =====================================================

-- 1. Table des super-administrateurs
CREATE TABLE IF NOT EXISTS public.platform_admins (
    user_id UUID PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Activation de RLS
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

-- 3. Fonction de vérification du super-administrateur
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.platform_admins AS pa
        WHERE pa.user_id = (SELECT auth.uid())
          AND pa.is_active = TRUE
    );
$$;

-- 4. Permissions
REVOKE ALL ON TABLE public.platform_admins FROM PUBLIC;
REVOKE ALL ON TABLE public.platform_admins FROM anon;
REVOKE ALL ON TABLE public.platform_admins FROM authenticated;

-- Autoriser uniquement la consultation de sa propre entrée
GRANT SELECT ON TABLE public.platform_admins TO authenticated;

-- 5. Sécurisation de la fonction
REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

-- 6. Politique de consultation
DROP POLICY IF EXISTS platform_admin_read_own
ON public.platform_admins;

CREATE POLICY platform_admin_read_own
ON public.platform_admins
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));
