-- gulgo — Security hardening
-- Prevent users from self-joining an arbitrary organization.
-- Organization creation + first CLIENT_ADMIN membership is now atomic.

create or replace function public.create_organization_with_admin(org_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if nullif(trim(org_name), '') is null then
    raise exception 'Organization name is required';
  end if;

  if exists (
    select 1
    from public.organization_members
    where user_id = current_user_id
  ) then
    raise exception 'User already belongs to an organization';
  end if;

  insert into public.organizations(name)
  values (trim(org_name))
  returning id into new_org_id;

  insert into public.organization_members(organization_id, user_id, role)
  values (new_org_id, current_user_id, 'CLIENT_ADMIN');

  insert into public.enterprises(organization_id, legal_name)
  values (new_org_id, trim(org_name));

  return new_org_id;
end;
$$;

revoke all on function public.create_organization_with_admin(text) from public;
grant execute on function public.create_organization_with_admin(text) to authenticated;

drop policy if exists member_insert on public.organization_members;
create policy member_insert on public.organization_members
for insert to authenticated
with check (
  public.is_client_admin(organization_id)
  or public.is_gulgo_staff()
);
drop policy if exists org_insert on public.organizations;