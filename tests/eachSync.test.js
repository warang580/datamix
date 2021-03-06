const { eachSync } = require("../src/datamix");
const sinon = require("sinon");

describe("eachSync", () => {
  it("handles arrays", async function () {
    let calls = [];

    await eachSync([5, 10, 15], async (v, i, a) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, i, a]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were registered in index order
    expect(calls).toStrictEqual([
      [5,  0, [5, 10, 15]],
      [10, 1, [5, 10, 15]],
      [15, 2, [5, 10, 15]]
    ]);
  });

  it("handles objects", async function () {
    let calls = [];

    await eachSync({10: "foo", 5: "bar", 15: "baz"}, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - k))

      calls.push(res);
    });

    // Checking that calls were registered in index order
    expect(calls).toStrictEqual([
      ["bar", "5",  {"10": "foo", "5": "bar", "15": "baz"}],
      ["foo", "10", {"10": "foo", "5": "bar", "15": "baz"}],
      ["baz", "15", {"10": "foo", "5": "bar", "15": "baz"}],
    ]);
  });

  it("ignores nil data", async function () {
    let calls = [];

    await eachSync(undefined, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    await eachSync(null, async (v, k, o) => {
      // Each call is shorter so we can test that it's made in correct order
      let res = await new Promise(resolve => setTimeout(() => resolve([v, k, o]), 15 - v))

      calls.push(res);
    });

    // Checking that calls were made in order
    expect(calls).toStrictEqual([]);
  });
});
