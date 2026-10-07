/**
 * Deals are filtered by the account managers of their contacts through the
 * `contact_sales_id` filter: a sales id, or NO_ACCOUNT_MANAGER for deals none of
 * whose contacts has an account manager (including deals without contacts).
 */
export const CONTACT_SALES_FILTER = "contact_sales_id";
export const NO_ACCOUNT_MANAGER = "none";

/** Turns the `contact_sales_id` filter into a PostgREST filter on the computed column. */
export const toPostgrestContactSalesFilter = (
  filter: Record<string, unknown> = {},
): Record<string, unknown> => {
  const { [CONTACT_SALES_FILTER]: salesId, ...rest } = filter;
  if (salesId == null || salesId === "") return rest;
  return salesId === NO_ACCOUNT_MANAGER
    ? { ...rest, "contact_sales_ids@eq": "{}" }
    : { ...rest, "contact_sales_ids@cs": `{${salesId}}` };
};

/** Whether a deal matches the `contact_sales_id` filter, given its contacts' account managers. */
export const matchesContactSalesFilter = (
  salesId: unknown,
  contactSalesIds: unknown[],
): boolean => {
  const managers = new Set(
    contactSalesIds.filter((id) => id != null).map(String),
  );
  return salesId === NO_ACCOUNT_MANAGER
    ? managers.size === 0
    : managers.has(String(salesId));
};
