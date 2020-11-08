const { tap } = require("../src/datamix");
const sinon    = require("sinon");

describe("tap", () => {
  it("calls side-effect but returns value anyway", function () {
    let callback = sinon.fake();

    expect(tap(["a", "b"], callback)).toStrictEqual(["a", "b"]);

    expect(callback.calledWith(["a", "b"])).toBe(true);
  });
});
