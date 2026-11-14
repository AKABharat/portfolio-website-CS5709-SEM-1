const { escapeRegex } = require("../controllers/api_controller");

describe("escapeRegex", () => {
  test("leaves plain text unchanged", () => {
    expect(escapeRegex("hello world")).toBe("hello world");
  });

  test("escapes an unmatched parenthesis so it is treated literally", () => {
    // Before this fix, passing this straight to MongoDB's $regex would
    // throw "Regular expression is invalid: missing )".
    const escaped = escapeRegex("C++ (Training)");
    expect(() => new RegExp(escaped)).not.toThrow();
    expect(new RegExp(escaped, "i").test("C++ (Training) Certificate")).toBe(true);
  });

  test("escapes every regex metacharacter", () => {
    const escaped = escapeRegex(".*+?^${}()|[]\\");
    // Every character should now be escaped, so matching the literal
    // string itself still works...
    expect(new RegExp(escaped).test(".*+?^${}()|[]\\")).toBe(true);
    // ...but it no longer behaves as a wildcard pattern.
    expect(new RegExp(escaped).test("anything else")).toBe(false);
  });
});
