import { ResourceContextProvider } from "ra-core";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { buildDeal, StoryWrapper } from "@/test/StoryWrapper";
import { DealShow } from "./DealShow";

describe("DealShow", () => {
  beforeAll(() => {
    page.viewport(1600, 900);
  });

  it("shows when the deal was received and its custom fields", async () => {
    // Arrange
    const deal = buildDeal({
      created_at: "2025-01-01T12:00:00.000Z",
      expected_closing_date: "2025-02-01",
      business_identifier: "51 824 753 556",
      enquiry_type: "Website",
      value_band: "sale-10k-plus",
      lead_quality: "excellent",
    });

    // Act
    const screen = await render(
      <StoryWrapper data={{ deals: [deal] }}>
        <ResourceContextProvider value="deals">
          <DealShow open id={String(deal.id)} />
        </ResourceContextProvider>
      </StoryWrapper>,
    );

    // Assert
    await expect.element(screen.getByText("Received At")).toBeVisible();
    await expect.element(screen.getByText(/Jan 1, 2025/)).toBeVisible();
    await expect.element(screen.getByText("51 824 753 556")).toBeVisible();
    await expect.element(screen.getByText("Website")).toBeVisible();
    await expect.element(screen.getByText("Sale $10k+")).toBeVisible();
    await expect.element(screen.getByText("Excellent")).toBeVisible();
  });

  it("shows a deal that has no budget or expected closing date", async () => {
    // Arrange
    const deal = buildDeal({
      name: "Unpriced deal",
      amount: null,
      expected_closing_date: null,
    });

    // Act
    const screen = await render(
      <StoryWrapper data={{ deals: [deal] }}>
        <ResourceContextProvider value="deals">
          <DealShow open id={String(deal.id)} />
        </ResourceContextProvider>
      </StoryWrapper>,
    );

    // Assert
    await expect.element(screen.getByText("Unpriced deal")).toBeVisible();
    await expect.element(screen.getByText("Budget")).not.toBeInTheDocument();
    await expect
      .element(screen.getByText("Expected closing date"))
      .not.toBeInTheDocument();
  });
});
