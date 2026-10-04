import {
  ResourceContextProvider,
  useDataProvider,
  type DataProvider,
} from "ra-core";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { buildContact, buildDeal, StoryWrapper } from "@/test/StoryWrapper";
import { canAccess } from "../providers/commons/canAccess";
import type { Contact, Deal } from "../types";
import { DealShow } from "./DealShow";

const renderDealShow = ({
  deal,
  contacts = [],
  role = "admin",
}: {
  deal: Deal;
  contacts?: Contact[];
  role?: "admin" | "user";
}) => {
  let dataProvider: DataProvider | null = null;
  const DataProviderListener = () => {
    dataProvider = useDataProvider();
    return null;
  };
  const result = render(
    <StoryWrapper
      data={{ deals: [deal], contacts }}
      authProvider={{ canAccess: async (params) => canAccess(role, params) }}
    >
      <DataProviderListener />
      <ResourceContextProvider value="deals">
        <DealShow open id={String(deal.id)} />
      </ResourceContextProvider>
    </StoryWrapper>,
  );
  return { result, getDataProvider: () => dataProvider! };
};

describe("DealShow", () => {
  beforeAll(() => {
    page.viewport(1600, 900);
  });

  it("shows when the deal was received and its lead fields", async () => {
    // Arrange
    const deal = buildDeal({
      created_at: "2025-01-01T12:00:00.000Z",
      expected_closing_date: "2025-02-01",
      business_identifier: "51 824 753 556",
      enquiry_type: ["Website", "Referral"],
      value_band: "sale-10k-plus",
      lead_quality: "excellent",
    });

    // Act
    const screen = await renderDealShow({ deal }).result;

    // Assert
    await expect.element(screen.getByText("Received At")).toBeVisible();
    await expect.element(screen.getByText(/Jan 1, 2025/)).toBeVisible();
    await expect.element(screen.getByText("51 824 753 556")).toBeVisible();
    await expect.element(screen.getByText("Website, Referral")).toBeVisible();
    await expect
      .element(screen.getByRole("combobox", { name: "Value Band" }))
      .toHaveTextContent("Sale $10k+");
    await expect
      .element(screen.getByRole("combobox", { name: "Lead Quality" }))
      .toHaveTextContent("Excellent");
  });

  it("shows a dash for missing read-only lead fields and hides a missing closing date", async () => {
    // Arrange
    const deal = buildDeal({
      name: "Unpriced deal",
      amount: null,
      expected_closing_date: null,
    });

    // Act
    const screen = await renderDealShow({ deal }).result;

    // Assert
    await expect.element(screen.getByText("Unpriced deal")).toBeVisible();
    await expect
      .element(screen.getByText("Lead", { exact: true }))
      .toBeVisible();
    // Business identifier and enquiry type are the empty read-only fields
    await expect.poll(() => screen.getByText("—").elements().length).toBe(2);
    await expect
      .element(screen.getByText("Expected closing date"))
      .not.toBeInTheDocument();
  });

  it("lets a non-admin quick-edit the lead fields from the modal", async () => {
    // Arrange
    const deal = buildDeal({ amount: 1000, lead_quality: null });
    const { result, getDataProvider } = renderDealShow({ deal, role: "user" });
    const screen = await result;

    // Act
    const budget = screen.getByLabelText("Budget");
    await expect.element(budget).toHaveValue(1000);
    await budget.fill("2500");
    await screen.getByRole("combobox", { name: "Lead Quality" }).click();
    await screen.getByRole("option", { name: "Average" }).click();
    await screen.getByRole("button", { name: "Save" }).click();

    // Assert
    await expect
      .poll(async () => {
        const { data } = await getDataProvider().getOne<Deal>("deals", {
          id: deal.id,
        });
        return { amount: data.amount, lead_quality: data.lead_quality };
      })
      .toEqual({ amount: 2500, lead_quality: "average" });
  });

  it("hides the full edit and archive actions from a non-admin", async () => {
    // Arrange / Act
    const screen = await renderDealShow({ deal: buildDeal(), role: "user" })
      .result;

    // Assert
    await expect.element(screen.getByText("Acme deal")).toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: /edit/i }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("button", { name: /archive/i }))
      .not.toBeInTheDocument();
  });

  it("shows the full edit and archive actions to an admin", async () => {
    // Arrange / Act
    const screen = await renderDealShow({ deal: buildDeal() }).result;

    // Assert
    await expect
      .element(screen.getByRole("link", { name: /edit/i }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("button", { name: /archive/i }))
      .toBeVisible();
  });

  it("shows the contact details of the deal contacts", async () => {
    // Arrange
    const contact = buildContact({
      id: 7,
      first_name: "Grace",
      last_name: "Hopper",
      email_jsonb: [{ email: "grace@example.com", type: "Work" }],
      phone_jsonb: [{ number: "0400 000 000", type: "Work" }],
      postcode: "2000",
      region: "NSW",
    });
    const deal = buildDeal({
      expected_closing_date: "2025-02-01",
      contact_ids: [contact.id],
    });

    // Act
    const screen = await renderDealShow({ deal, contacts: [contact] }).result;

    // Assert
    await expect.element(screen.getByText("Grace Hopper")).toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "grace@example.com" }))
      .toHaveAttribute("href", "mailto:grace@example.com");
    await expect
      .element(screen.getByRole("link", { name: "0400 000 000" }))
      .toHaveAttribute("href", "tel:0400 000 000");
    await expect.element(screen.getByText("2000 NSW")).toBeVisible();
  });
});
