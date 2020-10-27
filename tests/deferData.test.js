const datamix         = require("../src/datamix"); // @TEMP
const mix             = require("../src/datamix");
const { deferData }   = require("../src/datamix");
const { deferData:_ } = require("../src/datamix");

// @TODO

describe("deferData", () => {
  it("returns a function with one argument", function () {
    let getName = deferData(mix.get, 'name');

    expect(typeof getName).toBe("function");
    expect(getName.length).toBe(1);

    expect(getName({name: "John"})).toStrictEqual("John");
  });

  it("can be used to map data", function () {
    let users = [
      {id: 1, name: "Jane", login: "jane@mail.com"},
      {id: 2, name: "John", login: "john@mail.com"},
    ];

    expect(users.map(_(mix.set, 'admin', false))).toStrictEqual([
      {id: 1, name: "Jane", login: "jane@mail.com", admin: false},
      {id: 2, name: "John", login: "john@mail.com", admin: false},
    ]);
  });
});
