
-- ============================================================
-- GULGO : SUPER ADMIN - SECURISATION DES POLITIQUES RLS
-- Migration : 202611170002
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. DOCUMENTS : accès global réservé au SUPER_ADMIN
-- ------------------------------------------------------------

ALTER POLICY doc_all ON public.documents
USING (
    is_org_member(organization_id)
    OR public.is_platform_admin()
)
WITH CHECK (
    is_org_member(organization_id)
    OR public.is_platform_admin()
);

-- ------------------------------------------------------------
-- 2. ENTREPRISES
-- ------------------------------------------------------------

ALTER POLICY enterprise_all ON public.enterprises
USING (
    is_org_member(organization_id)
    OR public.is_platform_admin()
)
WITH CHECK (
    is_org_member(organization_id)
    OR public.is_platform_admin()
);

-- ------------------------------------------------------------
-- 3. VARIABLES D'EVALUATION : consultation
-- ------------------------------------------------------------

ALTER POLICY "Members and GULGO can view evaluation variables"
ON public.evaluation_variables
USING (
    EXISTS (
        SELECT 1
        FROM public.evaluations ev
        JOIN public.enterprises e
          ON e.id = ev.enterprise_id
        WHERE ev.id = evaluation_variables.evaluation_id
          AND (
              is_org_member(e.organization_id)
              OR public.is_platform_admin()
          )
    )
);

-- ------------------------------------------------------------
-- 4. EVALUATIONS : consultation globale
-- ------------------------------------------------------------

ALTER POLICY "GULGO staff can view evaluations"
ON public.evaluations
USING (
    public.is_platform_admin()
);

-- ------------------------------------------------------------
-- 5. MEMBRES : consultation
-- ------------------------------------------------------------

ALTER POLICY member_read ON public.organization_members
USING (
    user_id = (SELECT auth.uid())
    OR is_org_member(organization_id)
    OR public.is_platform_admin()
);

-- ------------------------------------------------------------
-- 6. MEMBRES : modification sécurisée des rôles
-- ------------------------------------------------------------

ALTER POLICY member_update ON public.organization_members
USING (
    is_client_admin(organization_id)
    OR public.is_platform_admin()
)
WITH CHECK (
    public.is_platform_admin()
    OR (
        is_client_admin(organization_id)
        AND role IN ('CLIENT_ADMIN', 'CLIENT_USER')
    )
);

-- ------------------------------------------------------------
-- 7. MEMBRES : suppression
-- ------------------------------------------------------------

ALTER POLICY member_delete ON public.organization_members
USING (
    is_client_admin(organization_id)
    OR public.is_platform_admin()
);

-- ------------------------------------------------------------
-- 8. ORGANISATIONS : consultation
-- ------------------------------------------------------------

ALTER POLICY org_read ON public.organizations
USING (
    is_org_member(id)
    OR public.is_platform_admin()
);

-- ------------------------------------------------------------
-- 9. ORGANISATIONS : modification
-- ------------------------------------------------------------

ALTER POLICY org_update ON public.organizations
USING (
    is_client_admin(id)
    OR public.is_platform_admin()
)
WITH CHECK (
    is_client_admin(id)
    OR public.is_platform_admin()
);

-- ------------------------------------------------------------
-- 10. STORAGE : consultation des documents
-- ------------------------------------------------------------

ALTER POLICY docs_read ON storage.objects
USING (
    bucket_id = 'documents'
    AND (
        is_org_member(((storage.foldername(name))[1])::uuid)
        OR public.is_platform_admin()
    )
);

-- ------------------------------------------------------------
-- 11. STORAGE : dépôt des documents
-- ------------------------------------------------------------

ALTER POLICY docs_insert ON storage.objects
WITH CHECK (
    bucket_id = 'documents'
    AND (
        is_org_member(((storage.foldername(name))[1])::uuid)
        OR public.is_platform_admin()
    )
);

-- ------------------------------------------------------------
-- 12. STORAGE : suppression des documents
-- ------------------------------------------------------------

ALTER POLICY docs_delete ON storage.objects
USING (
    bucket_id = 'documents'
    AND (
        is_org_member(((storage.foldername(name))[1])::uuid)
        OR public.is_platform_admin()
    )
);

COMMIT;
