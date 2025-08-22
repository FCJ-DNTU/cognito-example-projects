// test/pcustomers.test.ts
import { expect } from "chai";

// Import from core
import { AppError } from "../src/core/error";
import { getCustomers } from "../src/core/modules/pcustomer-management/functions/get-pcustomers";

describe("getPCustomers - Unit Test", () => {
  it("should return a list of potential customers", async () => {
    const ctx = {
      runtime: "test",
      getQuery: async () => ({ limit: "10" }),
      setHTTPStatus: () => {},
      getBody: async () => ({}),
      getTempData: async () => ({}),
      getParams: async () => ({}),
      getHeaders: async () => ({}),
      setBody: () => {},
      addTempData: () => {},
      sendStreaming: () => {},
      sendJson: () => {},
      sendHTML: () => {},
      sendError: () => {},
    };

    const customers = await getCustomers(ctx as any);
    expect(customers instanceof AppError).to.be.false;
  });
});
