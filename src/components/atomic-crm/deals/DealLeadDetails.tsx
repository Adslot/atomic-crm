import { Form, required, useNotify, useTranslate, useUpdate } from "ra-core";
import type { ReactNode } from "react";
import { useFormState } from "react-hook-form";
import { Save } from "lucide-react";
import { NumberInput } from "@/components/admin/number-input";
import { SelectInput } from "@/components/admin/select-input";
import { Button } from "@/components/ui/button";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { findDealLabel } from "./dealUtils";
import { dealLeadQualities } from "./dealLeadQualities";
import { dealValueBands } from "./dealValueBands";

const EMPTY_VALUE = "—";

type QuickEditValues = Pick<
  Deal,
  "stage" | "amount" | "value_band" | "lead_quality"
>;

/**
 * The lead fields of a deal, always displayed so missing values stand out.
 * Every user can quick-edit the status, budget, value band and lead quality
 * here, even when they cannot open the full edit form.
 */
export const DealLeadDetails = ({ record }: { record: Deal }) => {
  const translate = useTranslate();
  const notify = useNotify();
  const { dealCategories, dealStages } = useConfigurationContext();
  const [update, { isPending }] = useUpdate<Deal>();

  const handleSubmit = (values: Partial<Deal>) => {
    const data: QuickEditValues = {
      stage: values.stage ?? record.stage,
      amount: values.amount ?? null,
      value_band: values.value_band ?? null,
      lead_quality: values.lead_quality ?? null,
    };
    update(
      "deals",
      { id: record.id, data, previousData: record },
      {
        onSuccess: () => notify("resources.deals.updated"),
        onError: () => notify("ra.notification.http_error", { type: "error" }),
      },
    );
  };

  return (
    <div className="m-4">
      <h3 className="text-sm font-medium mb-2">
        {translate("resources.deals.field_categories.lead")}
      </h3>
      <Form record={record} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 items-start">
          <SelectInput
            source="stage"
            choices={dealStages}
            optionText="label"
            optionValue="value"
            helperText={false}
            validate={required()}
          />
          <NumberInput source="amount" helperText={false} />
          <ReadOnlyDetail label={translate("resources.deals.fields.category")}>
            {record.category
              ? (findDealLabel(dealCategories, record.category) ??
                record.category)
              : null}
          </ReadOnlyDetail>
          <ReadOnlyDetail
            label={translate("resources.deals.fields.business_identifier")}
          >
            {record.business_identifier}
          </ReadOnlyDetail>
          <ReadOnlyDetail
            label={translate("resources.deals.fields.enquiry_type")}
          >
            {record.enquiry_type?.length
              ? record.enquiry_type.join(", ")
              : null}
          </ReadOnlyDetail>
          <SelectInput
            source="value_band"
            choices={dealValueBands}
            optionText="label"
            optionValue="value"
            helperText={false}
          />
          <SelectInput
            source="lead_quality"
            choices={dealLeadQualities}
            optionText="label"
            optionValue="value"
            helperText={false}
          />
        </div>
        <div className="flex justify-end mt-3">
          <SaveButton isSaving={isPending} />
        </div>
      </Form>
    </div>
  );
};

const SaveButton = ({ isSaving }: { isSaving: boolean }) => {
  const translate = useTranslate();
  const { isDirty } = useFormState();
  return (
    <Button
      type="submit"
      size="sm"
      disabled={!isDirty || isSaving}
      className="cursor-pointer"
    >
      <Save />
      {translate("ra.action.save")}
    </Button>
  );
};

const ReadOnlyDetail = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-medium">{label}</span>
    <span className="text-sm">{children || EMPTY_VALUE}</span>
  </div>
);
