const { getFirst } = require("../src/datamix");

describe("getFirst", () => {
  it("gets the first defined value", function () {
    let user = {
      name: "Jane",
      work_phone: "0456",
      home_phone: "0123",
    };

    expect(
      getFirst(user, ['mobile_phone', 'home_phone', 'work_phone'], '?')
    ).toStrictEqual("0123");
  });

  it("defaults to defaultValue if nothing is found", function () {
    expect(
      getFirst({}, ['mobile_phone', 'home_phone', 'work_phone'], '?')
    ).toStrictEqual("?");
  });
});
