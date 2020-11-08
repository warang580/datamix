const { eachAsync } = require("../src/datamix");
const sinon = require("sinon");

describe("eachAsync", () => {
  it("handles arrays", async function () {
    let calls = [];

    await eachAsync([5, 10, 15], async (v, i, a) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, i, a]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were registered in time order
    expect(calls).toStrictEqual([
      [15, 2, [5, 10, 15]],
      [10, 1, [5, 10, 15]],
      [5,  0, [5, 10, 15]],
    ]);
  });

  it("handles objects", async function () {
    let calls  = [];
    let object = {10: "foo", 5: "bar", 15: "baz"};

    await eachAsync(object, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - k))

      calls.push(res);
    });

    // Checking that calls were registered in time order
    expect(calls).toStrictEqual([
      ["baz", "15", object],
      ["foo", "10", object],
      ["bar", "5",  object],
    ]);
  });

  it("ignores nil data", async function () {
    let calls = [];

    await eachAsync(undefined, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    await eachAsync(null, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([]);
  });
});
