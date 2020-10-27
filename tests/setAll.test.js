const datamix = require("../src/datamix");

describe("setAll", () => {
  it("sets data in all paths", function () {
    expect(datamix.setAll([
      {id: 1, active: false}, {id: 2, active: true}, {id: 3, active: false}
    ], '*.active', true)).toStrictEqual([
      {id: 1, active: true}, {id: 2, active: true}, {id: 3, active: true}
    ]);
  });

  it("can use callback to set value", function () {
    expect(datamix.setAll([
      {id: 1, active: false}, {id: 2, active: true}, {id: 3, active: false}
    ], '*.active', a => ! a)).toStrictEqual([
      {id: 1, active: true}, {id: 2, active: false}, {id: 3, active: true}
    ]);
  });
});
