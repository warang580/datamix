const datamix = require("../src/datamix");

describe("defaultsTo", () => {
  it("returns value itself if non-nil", function () {
    expect(datamix.defaultsTo(['a', 'b'])).toStrictEqual(['a', 'b']);
  });

  it("returns array by default if value is nil", function () {
    expect(datamix.defaultsTo(undefined)).toStrictEqual([]);
  });

  it("returns defaultValue when set if value is nil", function () {
    expect(datamix.defaultsTo(undefined, {})).toStrictEqual({});
  });
});
