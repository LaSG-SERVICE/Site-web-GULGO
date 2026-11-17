BEGIN;

DROP POLICY IF EXISTS docs_update ON storage.objects;

CREATE POLICY docs_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'documents'
    AND (
        public.is_org_member(
            ((storage.foldername(name))[1])::uuid
        )
        OR public.is_platform_admin()
    )
)
WITH CHECK (
    bucket_id = 'documents'
    AND (
        public.is_org_member(
            ((storage.foldername(name))[1])::uuid
        )
        OR public.is_platform_admin()
    )
);

COMMIT;