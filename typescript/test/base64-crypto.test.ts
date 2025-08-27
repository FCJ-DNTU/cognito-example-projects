import { expect } from "chai";
import {
  encode,
  decode,
  urlSafeEncode,
  urlSafeDecode,
} from "../src/utils/crypto/base64";

describe("Crypto Base64 - Unit Test", () => {
  it("should encode and decode a string", () => {
    const input = "hello world";
    const encoded = encode(input);
    const decoded = decode(encoded);
    expect(decoded).to.equal(input);
  });

  it("should encode and decode a number", () => {
    const input = 12345;
    const encoded = encode(input);
    const decoded = decode(encoded);
    expect(decoded).to.equal(input);
  });

  it("should encode and decode an object", () => {
    const input = { foo: "bar", count: 42 };
    const encoded = encode(input);
    const decoded = decode(encoded);
    expect(decoded).to.deep.equal(input);
  });

  it("should encode and decode an array", () => {
    const input = ["a", "b", "c"];
    const encoded = encode(input);
    const decoded = decode(encoded);
    expect(decoded).to.deep.equal(input);
  });

  it("should decode object with items[] property as array", () => {
    const tupleLike = { items: [1, 2, 3] };
    const encoded = encode(tupleLike);
    const decoded = decode(encoded);
    expect(decoded).to.deep.equal({ items: [1, 2, 3] });
  });

  it("should urlSafeEncode and urlSafeDecode properly", () => {
    const input = { user: "alice", id: 99 };
    const encoded = urlSafeEncode(input);

    // base64url không có ký tự +, / hoặc = trong output
    expect(encoded).to.not.match(/[+/=]/);

    const decoded = urlSafeDecode(encoded);
    expect(decoded).to.deep.equal(input);
  });

  it("should urlSafeDecode object with items[] property as array", () => {
    const tupleLike = { items: ["x", "y"] };
    const encoded = urlSafeEncode(tupleLike);
    const decoded = urlSafeDecode(encoded);
    expect(decoded).to.deep.equal({ items: ["x", "y"] });
  });
});
