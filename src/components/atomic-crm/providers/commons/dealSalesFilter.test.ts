import { describe, expect, it } from "vitest";

import { NO_ACCOUNT_MANAGER, toDealSalesFilter } from "./dealSalesFilter";

describe("toDealSalesFilter", () => {
  it("filters on deals without an account manager", () => {
    expect(
      toDealSalesFilter({ sales_id: NO_ACCOUNT_MANAGER, stage: "won" }),
    ).toEqual({ "sales_id@is": null, stage: "won" });
  });

  it("keeps a filter on a given account manager as is", () => {
    expect(toDealSalesFilter({ sales_id: 2 })).toEqual({ sales_id: 2 });
  });
});
