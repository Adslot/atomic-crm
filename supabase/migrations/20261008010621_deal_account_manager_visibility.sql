drop policy "Enable read access for authenticated users" on "public"."contacts";

drop policy "Enable update for authenticated users only" on "public"."contacts";

drop policy "Enable read access for authenticated users" on "public"."deals";

drop function if exists "public"."contact_sales_ids"(deal public.deals);


  create policy "Enable read access for authenticated users"
  on "public"."contacts"
  as permissive
  for select
  to authenticated
using ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) OR (EXISTS ( SELECT 1
   FROM public.deals d
  WHERE ((d.sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) AND (contacts.id = ANY (d.contact_ids)))))));



  create policy "Enable update for authenticated users only"
  on "public"."contacts"
  as permissive
  for update
  to authenticated
using ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) OR (EXISTS ( SELECT 1
   FROM public.deals d
  WHERE ((d.sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) AND (contacts.id = ANY (d.contact_ids)))))))
with check ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) OR (EXISTS ( SELECT 1
   FROM public.deals d
  WHERE ((d.sales_id = ( SELECT public.current_sales_id() AS current_sales_id)) AND (contacts.id = ANY (d.contact_ids)))))));



  create policy "Enable read access for authenticated users"
  on "public"."deals"
  as permissive
  for select
  to authenticated
using ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id))));



