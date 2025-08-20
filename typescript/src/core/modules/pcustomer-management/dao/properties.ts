const pcustomerProperties = {
  id: { type: "string" },
  fullName: { type: "string" },
  phone: { type: "string" },
  age: { type: "number" },
  type: { type: "string" },
  productCode: { type: "string" },
  createAt: { type: "string" },
};

const {
  id: ida,
  createAt: caa,
  type: ta,
  ...pcustomerToAddProperties
} = pcustomerProperties;

const {
  id: idb,
  createAt: cab,
  type: tb,
  ...pcustomerToUpdateProperties
} = pcustomerProperties;

export {
  pcustomerProperties,
  pcustomerToAddProperties,
  pcustomerToUpdateProperties,
};
