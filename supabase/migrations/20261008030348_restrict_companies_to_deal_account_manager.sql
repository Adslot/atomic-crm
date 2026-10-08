drop policy "Enable read access for authenticated users" on "public"."companies";


  create policy "Enable read access for authenticated users"
  on "public"."companies"
  as permissive
  for select
  to authenticated
using ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) OR (EXISTS ( SELECT 1
   FROM public.deals d
  WHERE ((d.company_id = companies.id) AND (d.sales_id = ( SELECT public.current_sales_id() AS current_sales_id))))) OR (EXISTS ( SELECT 1
   FROM public.contacts co
  WHERE (co.company_id = companies.id)))));



