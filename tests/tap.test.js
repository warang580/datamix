const { tap } = require("../src/datamix");
const sinon    = require("sinon");

describe("tap", () => {
  it("calls side-effect but returns value anyway", function () {
    let callback = sinon.fake();

    expect(tap(["a", "b"], callback)).toStrictEqual(["a", "b"]);

    expect(callback.calledWith(["a", "b"])).toBe(true);
  });

  it("can be used in reduce to simplify code", function () {
    expect([1, 2, 3].reduce((l, e) => {
      return tap(l, l => l.push(e + 1));
    }, [])).toStrictEqual([2, 3, 4]);
  });
});
