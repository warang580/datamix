const datamix = require("../src/datamix");

// @TODO

describe("_get", () => {
  it("returns a functional version of get", function () {
    let users = [{
      name: "Jane",
    }, {
      name: "Fred",
    }, {
      // unnamed
    }];

    expect(datamix.map(users, datamix._get('name', 'unnamed'))).toStrictEqual(["Jane", "Fred", "unnamed"]);
  });
});

describe("_set", () => {
  it("returns a functional version of set", function () {
    let users = [{
      connections: 1,
    }, {
      connections: 2,
    }, {
      // never connected
    }];

    expect(
      datamix
        .map(users, datamix._set('connections', c => (c||0) + 1))
        .map(datamix._get('connections', 0))
    ).toStrictEqual([2, 3, 1]);
  });
});

describe("_only", () => {
  it("returns a functional version of only", function () {
    let users = [{
      name: "Jane",
      contact: {
        email: "jane@mail.com",
      },
      address: {
        city: {
          name: "Paris",
          zipcode: "75000",
        },
      },
    }, {
      name: "Fred",
      contact: {
        email: "fred@mail.com",
      },
      address: {
        city: {
          name: "Strasbourg",
          zipcode: "67000",
        },
      },
    }];

    expect(datamix.map(users, datamix._only({
      name:  'name',
      email: 'contact.email',
      city:  'address.city.name',
    }))).toStrictEqual([
      {name: "Jane", email: "jane@mail.com", city: "Paris"},
      {name: "Fred", email: "fred@mail.com", city: "Strasbourg"},
    ]);
  });
});

describe("_getFirst", () => {
  it("returns a functional version of getFirst", function () {
    let data = [
      {a: 1, b: 2},
      {b: 2},
      {c: 3},
    ];

    expect(
      datamix.map(data, datamix._getFirst(['a', 'b'], 0))
    ).toStrictEqual([1, 2, 0]);
  });
});

describe("_getAll", () => {
  it("returns a functional version of getAll", function () {
    let users = [{
      name: "Jane",
      contacts: [{
        email: "jane@mail.com",
      }, {
        email: "john@mail.com",
      }],
    }, {
      name: "Fred",
      contacts: [{
        email: "fred@mail.com",
      }, {
        email: "judy@mail.com",
      }],
    }];

    expect(
      datamix.map(users, datamix._getAll("contacts.*.email"))
    ).toStrictEqual([["jane@mail.com", "john@mail.com"], ["fred@mail.com", "judy@mail.com"]]);
  });
});
