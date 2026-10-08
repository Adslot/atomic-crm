// FIXME: This should be exported from the ra-core package
type CanAccessParams<
  RecordType extends Record<string, any> = Record<string, any>,
> = {
  action: string;
  resource: string;
  record?: RecordType;
};

export const canAccess = <
  RecordType extends Record<string, any> = Record<string, any>,
>(
  role: string,
  params: CanAccessParams<RecordType>,
) => {
  if (role === "admin") {
    return true;
  }

  // Non admins can't access the sales resource
  if (params.resource === "sales") {
    return false;
  }

  // Non admins can't access the configuration resource
  if (params.resource === "configuration") {
    return false;
  }

  // Non admins can't edit deals (beyond the quick edit in the deal modal) or archive them
  if (
    params.resource === "deals" &&
    (params.action === "edit" || params.action === "archive")
  ) {
    return false;
  }

  // Non admins can't delete contacts, companies or deals
  if (
    params.action === "delete" &&
    ["contacts", "companies", "deals"].includes(params.resource)
  ) {
    return false;
  }

  return true;
};
