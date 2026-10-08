set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.contact_sales_ids(deal public.deals)
 RETURNS bigint[]
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  select coalesce(array_agg(distinct co.sales_id) filter (where co.sales_id is not null), '{}')
  from public.contacts co
  where co.id = any(deal.contact_ids);
$function$
;

grant all on function public.contact_sales_ids(public.deals) to anon;
grant all on function public.contact_sales_ids(public.deals) to authenticated;
grant all on function public.contact_sales_ids(public.deals) to service_role;
