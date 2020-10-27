const datamix = require("../src/datamix");
const sinon   = require("sinon");

describe("eachSync", () => {
  it("behaves like Array.forEach on arrays with asynchronous callback", async function () {
    let calls = [];

    await datamix.eachSync([5, 10, 15], async (v, i, a) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, i, a]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([
      [5,  0, [5, 10, 15]],
      [10, 1, [5, 10, 15]],
      [15, 2, [5, 10, 15]]
    ]);
  });

  it("behaves like Array.forEach on objects with asynchronous callback", async function () {
    let calls = [];

    await datamix.eachSync({5: "foo", 10: "bar", 15: "baz"}, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([
      ["foo", "5",  {"5": "foo", "10": "bar", "15": "baz"}],
      ["bar", "10", {"5": "foo", "10": "bar", "15": "baz"}],
      ["baz", "15", {"5": "foo", "10": "bar", "15": "baz"}]
    ]);
  });

  it("ignores nil data", async function () {
    let calls = [];

    await datamix.eachSync(undefined, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    await datamix.eachSync(null, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([]);
  });
});
