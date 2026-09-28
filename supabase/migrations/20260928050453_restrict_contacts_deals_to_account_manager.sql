drop policy "Enable read access for authenticated users" on "public"."contact_notes";

drop policy "Enable read access for authenticated users" on "public"."contacts";

drop policy "Enable read access for authenticated users" on "public"."deal_notes";

drop policy "Enable read access for authenticated users" on "public"."deals";

drop policy "Enable read access for authenticated users" on "public"."tasks";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.current_sales_id()
 RETURNS bigint
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select id from public.sales where user_id = auth.uid();
$function$
;


  create policy "Enable read access for authenticated users"
  on "public"."contact_notes"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.contacts co
  WHERE (co.id = contact_notes.contact_id))));



  create policy "Enable read access for authenticated users"
  on "public"."contacts"
  as permissive
  for select
  to authenticated
using ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id))));



  create policy "Enable read access for authenticated users"
  on "public"."deal_notes"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.deals d
  WHERE (d.id = deal_notes.deal_id))));



  create policy "Enable read access for authenticated users"
  on "public"."deals"
  as permissive
  for select
  to authenticated
using ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) OR (EXISTS ( SELECT 1
   FROM public.contacts co
  WHERE (co.id = ANY (deals.contact_ids))))));



  create policy "Enable read access for authenticated users"
  on "public"."tasks"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.contacts co
  WHERE (co.id = tasks.contact_id))));



grant all on function public.current_sales_id() to anon;
grant all on function public.current_sales_id() to authenticated;
grant all on function public.current_sales_id() to service_role;
