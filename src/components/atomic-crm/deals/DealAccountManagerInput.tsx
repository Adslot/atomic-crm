import { useGetList, useTranslate } from "ra-core";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { useIsMobile } from "@/hooks/use-mobile";

import { NO_ACCOUNT_MANAGER } from "../providers/commons/dealSalesFilter";
import type { Sale } from "../types";

/**
 * Filters deals by their account manager, with an extra option for deals
 * that have no account manager.
 */
export const DealAccountManagerInput = ({
  source,
}: {
  source: string;
  alwaysOn?: boolean;
}) => {
  const translate = useTranslate();
  const isMobile = useIsMobile();
  const { data: sales = [] } = useGetList<Sale>("sales", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "last_name", order: "ASC" },
    filter: { "disabled@neq": true },
  });
  const choices = [
    {
      id: NO_ACCOUNT_MANAGER,
      name: translate("resources.deals.filters.no_account_manager"),
    },
    ...sales.map((sale) => ({
      id: sale.id,
      name: `${sale.first_name} ${sale.last_name}`,
    })),
  ];
  return (
    <AutocompleteInput
      source={source}
      choices={choices}
      label={false}
      helperText={false}
      clearable
      modal={isMobile}
      placeholder={translate("crm.common.account_manager")}
    />
  );
};
