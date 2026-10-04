import { describe, expect, it } from "vitest";

import { canAccess } from "./canAccess";

describe("canAccess", () => {
  it.each(["contacts", "companies", "deals"])(
    "prevents a non-admin from deleting %s",
    (resource) => {
      expect(canAccess("user", { action: "delete", resource })).toBe(false);
    },
  );

  it.each(["contacts", "companies"])("lets a non-admin edit %s", (resource) => {
    expect(canAccess("user", { action: "edit", resource })).toBe(true);
  });

  it("still lets a non-admin delete tasks", () => {
    expect(canAccess("user", { action: "delete", resource: "tasks" })).toBe(
      true,
    );
  });

  it.each(["contacts", "companies", "deals"])(
    "lets an admin delete %s",
    (resource) => {
      expect(canAccess("admin", { action: "delete", resource })).toBe(true);
    },
  );

  it.each(["edit", "archive"])(
    "prevents a non-admin from the %s action on deals",
    (action) => {
      expect(canAccess("user", { action, resource: "deals" })).toBe(false);
    },
  );

  it.each(["edit", "archive"])(
    "lets an admin use the %s action on deals",
    (action) => {
      expect(canAccess("admin", { action, resource: "deals" })).toBe(true);
    },
  );
});
