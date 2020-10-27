const { each } = require("../src/datamix");
const sinon    = require("sinon");

describe("each", () => {
  it("behaves like Array.forEach on arrays", function () {
    let callback = sinon.fake();
    let array    = ["a", "b"];

    each(array, callback);

    expect(callback.calledWith("a", 0, array)).toBe(true);
    expect(callback.calledWith("b", 1, array)).toBe(true);
  });

  it("behaves like Array.forEach on objects", function () {
    let callback = sinon.fake();
    let object   = {a: 1, b: 2};

    each(object, callback);

    expect(callback.calledWith(1, "a", object)).toBe(true);
    expect(callback.calledWith(2, "b", object)).toBe(true);
  });

  it("ignores nil data", function () {
    let callback = sinon.fake();
    let object   = {a: 1, b: 2};

    each(null,      callback);
    each(undefined, callback);

    expect(callback.called).toBe(false);
  });
});
