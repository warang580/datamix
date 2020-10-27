const { parseJson } = require("../src/datamix");

describe("parseJson", () => {
  it("parses a valid json string", function () {
    expect(parseJson(JSON.stringify({a: 1, b: 2}))).toStrictEqual({a: 1, b: 2});
  });

  it("defaults to empty object if json is invalid", function () {
    expect(parseJson("{invalid}")).toStrictEqual({});
  });

  it("uses defaultValue if json is invalid", function () {
    expect(parseJson("{invalid}", 42)).toStrictEqual(42);
  });
});
