import { Pipeline } from "../../../context/pipeline";

// Import functions
import { getCustomer } from "../functions/get-pcustomer";

// Import types
import type { TRuntimeContext } from "../../../context/runtime-context";

const getCustomerPipeline = new Pipeline<TRuntimeContext>(
  "Get Customer Pipeline",
);
getCustomerPipeline.addStep(getCustomer);

export { getCustomerPipeline };
