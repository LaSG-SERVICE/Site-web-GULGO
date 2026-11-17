
BEGIN;

-- 1. Organisations : lecture, création, modification et suppression
DROP POLICY IF EXISTS platform_admin_full_access_organizations
ON public.organizations;

CREATE POLICY platform_admin_full_access_organizations
ON public.organizations
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());


-- 2. Membres : gestion complète des membres de toutes les organisations
DROP POLICY IF EXISTS platform_admin_full_access_members
ON public.organization_members;

CREATE POLICY platform_admin_full_access_members
ON public.organization_members
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());


-- 3. Évaluations : gestion complète de toutes les évaluations
DROP POLICY IF EXISTS platform_admin_full_access_evaluations
ON public.evaluations;

CREATE POLICY platform_admin_full_access_evaluations
ON public.evaluations
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());


-- 4. Variables : gestion complète des variables d'évaluation
DROP POLICY IF EXISTS platform_admin_full_access_evaluation_variables
ON public.evaluation_variables;

CREATE POLICY platform_admin_full_access_evaluation_variables
ON public.evaluation_variables
FOR ALL
TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

COMMIT;
