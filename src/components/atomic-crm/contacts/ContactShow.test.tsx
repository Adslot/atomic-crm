import {
  ResourceContextProvider,
  ShowBase,
  useDataProvider,
  type DataProvider,
} from "ra-core";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { canAccess } from "../providers/commons/canAccess";
import { buildContact, StoryWrapper } from "@/test/StoryWrapper";
import { ContactAside } from "./ContactAside";
import { MobileSuccess } from "./ContactShow.mobile.stories";

const mockIsMobile = vi.hoisted(() => vi.fn(() => true));
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: mockIsMobile,
}));

describe("ContactShow", () => {
  beforeEach(() => {
    mockIsMobile.mockReturnValue(true);
  });

  it("renders a safe zero-task label before nb_tasks is available", async () => {
    const screen = await render(<MobileSuccess />);

    await expect
      .element(screen.getByRole("tab", { name: "0 tasks" }))
      .toBeVisible();
    await expect
      .poll(
        () => screen.container.textContent?.includes("%{smart_count}") ?? false,
      )
      .toBe(false);
    await expect
      .poll(() => screen.container.textContent?.includes("||||") ?? false)
      .toBe(false);
  });

  it("updates the contact status from the aside", async () => {
    mockIsMobile.mockReturnValue(false);

    let dataProvider: DataProvider | null = null;
    const contact = buildContact({ status: "warm" });

    const DataProviderListener = () => {
      dataProvider = useDataProvider();
      return null;
    };

    const screen = await render(
      <StoryWrapper data={{ contacts: [contact] }}>
        <DataProviderListener />
        <ResourceContextProvider value="contacts">
          <ShowBase id={contact.id}>
            <ContactAside />
          </ShowBase>
        </ResourceContextProvider>
      </StoryWrapper>,
    );

    await expect
      .element(screen.getByRole("combobox"))
      .toHaveTextContent("Warm");

    await screen.getByRole("combobox").click();
    await screen.getByRole("option", { name: /hot/i }).click();

    await expect
      .poll(async () => {
        const { data } = await dataProvider!.getOne("contacts", {
          id: contact.id,
        });
        return data.status;
      })
      .toBe("hot");

    await expect.element(screen.getByRole("combobox")).toHaveTextContent("Hot");
  });

  it("shows the contact postcode and region in the aside", async () => {
    // Arrange
    mockIsMobile.mockReturnValue(false);
    const contact = buildContact({ postcode: "2000", region: "NSW" });

    // Act
    const screen = await render(
      <StoryWrapper data={{ contacts: [contact] }}>
        <ResourceContextProvider value="contacts">
          <ShowBase id={contact.id}>
            <ContactAside />
          </ShowBase>
        </ResourceContextProvider>
      </StoryWrapper>,
    );

    // Assert
    await expect.element(screen.getByText("2000 NSW")).toBeVisible();
  });

  describe("delete and merge actions", () => {
    const renderAside = (role: "admin" | "user") => {
      mockIsMobile.mockReturnValue(false);
      page.viewport(1600, 900);
      const contact = buildContact();
      return render(
        <StoryWrapper
          data={{ contacts: [contact] }}
          authProvider={{
            canAccess: async (params) => canAccess(role, params),
          }}
        >
          <ResourceContextProvider value="contacts">
            <ShowBase id={contact.id}>
              <ContactAside link="show" />
            </ShowBase>
          </ResourceContextProvider>
        </StoryWrapper>,
      );
    };

    it("lets an admin delete or merge the contact", async () => {
      // Arrange / Act
      const screen = await renderAside("admin");

      // Assert
      await expect
        .element(screen.getByRole("button", { name: /delete/i }))
        .toBeVisible();
      await expect
        .element(screen.getByRole("button", { name: /merge/i }))
        .toBeVisible();
    });

    it("hides delete and merge from a non-admin", async () => {
      // Arrange / Act
      const screen = await renderAside("user");

      // Assert
      await expect
        .element(screen.getByRole("button", { name: /export to vcard/i }))
        .toBeVisible();
      await expect
        .element(screen.getByRole("button", { name: /delete/i }))
        .not.toBeInTheDocument();
      await expect
        .element(screen.getByRole("button", { name: /merge/i }))
        .not.toBeInTheDocument();
    });
  });
});
