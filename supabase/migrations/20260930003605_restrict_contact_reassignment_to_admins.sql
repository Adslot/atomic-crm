drop policy "Enable update for authenticated users only" on "public"."contacts";


  create policy "Enable update for authenticated users only"
  on "public"."contacts"
  as permissive
  for update
  to authenticated
using ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id))))
with check ((( SELECT public.is_admin() AS is_admin) OR (sales_id = ( SELECT public.current_sales_id() AS current_sales_id))));



