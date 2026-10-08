/**
 * The deals account manager filter (`sales_id`) takes a sales id, or
 * NO_ACCOUNT_MANAGER for deals that have no account manager.
 */
export const NO_ACCOUNT_MANAGER = "none";

/** Turns the NO_ACCOUNT_MANAGER value into a PostgREST "is null" filter. */
export const toDealSalesFilter = (
  filter: Record<string, unknown> = {},
): Record<string, unknown> => {
  if (filter.sales_id !== NO_ACCOUNT_MANAGER) return filter;
  const { sales_id: _salesId, ...rest } = filter;
  return { ...rest, "sales_id@is": null };
};
