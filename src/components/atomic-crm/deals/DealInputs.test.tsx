import { Form } from "ra-core";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

import { StoryWrapper } from "@/test/StoryWrapper";
import { canAccess } from "../providers/commons/canAccess";
import { DealInputs } from "./DealInputs";

const renderDealInputs = (role: "admin" | "user") =>
  render(
    <StoryWrapper
      authProvider={{ canAccess: async (params) => canAccess(role, params) }}
    >
      <Form>
        <DealInputs />
      </Form>
    </StoryWrapper>,
  );

describe("DealInputs", () => {
  beforeAll(() => {
    page.viewport(1600, 900);
  });

  it("lets an admin assign an account manager to the deal", async () => {
    // Arrange / Act
    const screen = await renderDealInputs("admin");

    // Assert
    await expect
      .element(screen.getByRole("combobox", { name: "Account manager" }))
      .toBeVisible();
  });

  it("hides the account manager from a non-admin", async () => {
    // Arrange / Act
    const screen = await renderDealInputs("user");

    // Assert
    await expect.element(screen.getByLabelText("Name")).toBeVisible();
    await expect
      .element(screen.getByRole("combobox", { name: "Account manager" }))
      .not.toBeInTheDocument();
  });
});
