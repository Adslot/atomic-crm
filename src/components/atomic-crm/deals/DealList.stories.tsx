import type { Meta } from "@storybook/react-vite";
import { ResourceContextProvider } from "ra-core";

import DealList from "./DealList";

import {
  StoryWrapper,
  buildCompany,
  buildContact,
  buildDeal,
  buildSale,
} from "@/test/StoryWrapper";

const meta = {
  title: "Atomic CRM/Deals/Deal List",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

const dataForAccountManagerFilter = {
  companies: [buildCompany()],
  // Each deal is owned by someone other than its contact's account manager, so
  // the filter must look at the contacts, not at the deal owner
  contacts: [
    buildContact({ id: 10, first_name: "Jane's", sales_id: 0 }),
    buildContact({ id: 11, first_name: "Marie's", sales_id: 1 }),
    buildContact({ id: 12, first_name: "Nobody's", sales_id: undefined }),
  ],
  deals: [
    buildDeal({ id: 1, name: "Jane deal", contact_ids: [10], sales_id: 1 }),
    buildDeal({
      id: 2,
      index: 1,
      name: "Marie deal",
      contact_ids: [11],
      sales_id: 0,
    }),
    buildDeal({
      id: 3,
      index: 2,
      name: "Unassigned deal",
      contact_ids: [12],
      sales_id: 0,
    }),
  ],
  sales: [
    buildSale({ administrator: true, first_name: "Jane", id: 0 }),
    buildSale({
      administrator: false,
      email: "mariecurie@atomic.dev",
      first_name: "Marie",
      id: 1,
      last_name: "Curie",
      user_id: "1",
    }),
  ],
};

export const AdminAccountManagerFilter = () => (
  <StoryWrapper data={dataForAccountManagerFilter}>
    <ResourceContextProvider value="deals">
      <DealList />
    </ResourceContextProvider>
  </StoryWrapper>
);

export const NonAdminAccountManagerFilter = () => (
  <StoryWrapper
    authProvider={{
      canAccess: async ({ resource }) => resource !== "sales",
    }}
    data={dataForAccountManagerFilter}
  >
    <ResourceContextProvider value="deals">
      <DealList />
    </ResourceContextProvider>
  </StoryWrapper>
);
