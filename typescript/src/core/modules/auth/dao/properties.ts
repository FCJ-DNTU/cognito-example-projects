const signInDataProperties = {
  username: { type: "string" },
  password: { type: "string" },
};

const signInResultProperties = {
  auth: {
    type: "object",
    properties: {
      idToken: { type: "string" },
      accessToken: { type: "string" },
      refreshToken: { type: "string" },
      expiresIn: { type: "number" },
    },
  },
};

const refreshTokensDataProperties = {
  refreshToken: { type: "string" },
};

const refreshTokensResultProperties = {
  auth: {
    type: "object",
    properties: {
      idToken: { type: "string" },
      accessToken: { type: "string" },
      refreshToken: { type: "string" },
      expiresIn: { type: "number" },
    },
  },
};

export {
  signInDataProperties,
  signInResultProperties,
  refreshTokensDataProperties,
  refreshTokensResultProperties,
};
