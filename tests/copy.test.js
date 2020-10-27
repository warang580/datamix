const { copy } = require("../src/datamix");

describe("copy", () => {
  it("copies arrays", function () {
    let oldArray = [1, 2, 3];
    let newArray = copy(oldArray);

    newArray.push(4);

    expect(oldArray).toStrictEqual([1, 2, 3]);
    expect(newArray).toStrictEqual([1, 2, 3, 4]);
  });

  it("copies objects", function () {
    let oldObject = {a: 1, b: 2, c: 3};
    let newObject = copy(oldObject);

    newObject['d'] = 4;

    expect(oldObject).toStrictEqual({a: 1, b: 2, c: 3});
    expect(newObject).toStrictEqual({a: 1, b: 2, c: 3, d: 4});
  });

  it("return plain values as-is", function () {
    let values = [42, "hello", null, undefined];

    values.forEach(value => {
      expect(copy(value)).toStrictEqual(value);
    });
  });
});
