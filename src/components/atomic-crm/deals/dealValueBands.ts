import type { LabeledValue } from "../types";

export const dealValueBands: LabeledValue[] = [
  { value: "sale-under-2k", label: "Sale Under $2k" },
  { value: "sale-2k-to-10k", label: "Sale $2k to $10k" },
  { value: "sale-10k-plus", label: "Sale $10k+" },
  { value: "project-over-100k", label: "Project >$100k" },
  { value: "project-under-100k", label: "Project <$100k" },
];
