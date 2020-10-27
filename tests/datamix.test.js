const datamix = require("../src/datamix");
const { get } = require("../src/datamix");

describe("datamix", () => {
  it("can be used an object with functions", function () {
    expect(datamix.paths(datamix).length).toBeGreaterThan(0);
  });

  it("can be used by destructuring", function () {
    expect(get).toStrictEqual(datamix.get);
  });
});
