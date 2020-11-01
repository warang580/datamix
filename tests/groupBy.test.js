const { groupBy } = require("../src/datamix");

describe("groupBy", () => {
  it("groups data by value found at path", function () {
    expect(groupBy([
      {name: "John", admin: false},
      {name: "Jane", admin: true},
      {name: "Paul", admin: false},
      {name: "Fred", admin: false}
    ], '*.admin'))
      .toStrictEqual({
        false: [
          {name: "John", admin: false},
          {name: "Paul", admin: false},
          {name: "Fred", admin: false}
        ],
        true: [
          {name: "Jane", admin: true}
        ],
      });
  });

  it("returns the whole entry", function () {
    expect(groupBy([
      {name: "Jane", roles: [{name: 'admin'}, {name: 'supervisor'}]},
      {name: "John", roles: [{name: 'supervisor'}]},
      {name: "Fred", roles: [{name: 'user'}]},
    ], "*.roles.*.name"))
    .toStrictEqual({
      admin: [
        {name: "Jane", roles: [{name: 'admin'}, {name: 'supervisor'}]},
      ],
      supervisor: [
        {name: "Jane", roles: [{name: 'admin'}, {name: 'supervisor'}]},
        {name: "John", roles: [{name: 'supervisor'}]},
      ],
      user: [
        {name: "Fred", roles: [{name: 'user'}]},
      ],
    });
  });

  it("doesn't add common data in entry", function () {
    expect(groupBy({
      name: "Jane",
      roles: [
        {name: 'admin',      active: true},
        {name: 'supervisor', active: false},
        {name: 'user',       active: true},
      ]
    }, "roles.*.active"))
    .toStrictEqual({
      true: [
        {name: 'admin', active: true},
        {name: 'user',  active: true},
      ],
      false: [
        {name: 'supervisor', active: false},
      ],
    });
  });

  it("adds all data without wildcard", function () {
    expect(groupBy({
      name: "Jane",
      roles: [
        {name: 'admin',      active: true},
        {name: 'supervisor', active: false},
        {name: 'user',       active: true},
      ]
    }, "roles.0.active"))
    .toStrictEqual({
      true: [{
        name: "Jane",
        roles: [
          {name: 'admin',      active: true},
          {name: 'supervisor', active: false},
          {name: 'user',       active: true},
        ]
      }],
    });
  });

  it("can group by callback value", function () {
    expect(groupBy([
      {name: "John", age: 16},
      {name: "Jane", age: 18},
      {name: "Paul", age: 20},
      {name: "Fred", age: 22}
    ], '*.age', age => age >= 18))
      .toStrictEqual({
        false: [
          {name: "John", age: 16},
        ],
        true: [
          {name: "Jane", age: 18},
          {name: "Paul", age: 20},
          {name: "Fred", age: 22},
        ],
      });
  });
});
