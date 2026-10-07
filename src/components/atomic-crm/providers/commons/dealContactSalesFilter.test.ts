import { describe, expect, it } from "vitest";

import {
  matchesContactSalesFilter,
  NO_ACCOUNT_MANAGER,
  toPostgrestContactSalesFilter,
} from "./dealContactSalesFilter";

describe("toPostgrestContactSalesFilter", () => {
  it("filters on deals whose contacts include the account manager", () => {
    expect(
      toPostgrestContactSalesFilter({ contact_sales_id: 2, stage: "won" }),
    ).toEqual({ "contact_sales_ids@cs": "{2}", stage: "won" });
  });

  it("filters on deals whose contacts have no account manager", () => {
    expect(
      toPostgrestContactSalesFilter({ contact_sales_id: NO_ACCOUNT_MANAGER }),
    ).toEqual({ "contact_sales_ids@eq": "{}" });
  });

  it("leaves other filters untouched when no account manager is selected", () => {
    expect(toPostgrestContactSalesFilter({ stage: "won" })).toEqual({
      stage: "won",
    });
  });
});

describe("matchesContactSalesFilter", () => {
  it("matches a deal with a contact managed by the account manager", () => {
    expect(matchesContactSalesFilter("2", [1, 2])).toBe(true);
    expect(matchesContactSalesFilter(3, [1, 2])).toBe(false);
  });

  it("treats a deal without managed contacts as having no account manager", () => {
    expect(matchesContactSalesFilter(NO_ACCOUNT_MANAGER, [null])).toBe(true);
    expect(matchesContactSalesFilter(NO_ACCOUNT_MANAGER, [])).toBe(true);
    expect(matchesContactSalesFilter(NO_ACCOUNT_MANAGER, [1])).toBe(false);
  });
});
