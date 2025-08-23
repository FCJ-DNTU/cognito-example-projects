import joi from "joi";

import { toDescriptiveObject } from "../src/core/validation/joi/helper";

const schema = joi.object({
  name: joi.string().required(),
  age: joi.number().required(),
  package: joi.array().items(joi.object({ name: joi.string().required() })),
});

console.log(
  "Descriptive Object:",
  JSON.stringify(toDescriptiveObject(schema), null, 2),
);
