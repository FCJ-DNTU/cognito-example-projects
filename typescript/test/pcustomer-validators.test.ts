import { expect } from "chai";
import {
  createPCustomerValidator,
  updatePCustomerValidator,
} from "../src/core/modules/pcustomer-management/validator";

describe("PCustomer Validators", () => {
  describe("createPCustomerValidator", () => {
    it("should pass with valid data", () => {
      const validData = {
        fullName: "Nguyen Van A",
        phone: "0912345678",
        age: 25,
        productCode: "product_code",
      };

      const { error } = createPCustomerValidator.validate(validData);
      console.log(error);
      expect(error).to.be.undefined;
    });

    it("should fail when required fields are missing", () => {
      const invalidData = {};
      const { error } = createPCustomerValidator.validate(invalidData);
      expect(error).not.to.be.undefined;
    });

    it("should fail with invalid phone number", () => {
      const invalidData = {
        fullName: "Nguyen Van B",
        phone: "123456", // sai format
        age: 30,
        productCode: "valid_code",
      };

      const { error } = createPCustomerValidator.validate(invalidData);
      expect(error).to.not.be.undefined;
    });

    it("should fail with age out of range", () => {
      const invalidData = {
        fullName: "Nguyen Van C",
        phone: "0912345678",
        age: 15, // dưới min
        productCode: "valid_code",
      };

      const { error } = createPCustomerValidator.validate(invalidData);
      expect(error).to.not.be.undefined;
    });
  });

  describe("updatePCustomerValidator", () => {
    it("should pass with partial valid data", () => {
      const partialData = { age: 45 };
      const { error } = updatePCustomerValidator.validate(partialData);
      expect(error).to.be.undefined;
    });

    it("should fail with invalid productCode format", () => {
      const invalidData = { productCode: "Invalid-Code" }; // không phải snake_case
      const { error } = updatePCustomerValidator.validate(invalidData);
      expect(error).to.not.be.undefined;
    });
  });
});
