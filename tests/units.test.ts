import { UnitFactory } from "../src/units";

describe("UnitFactory", () => {
  it("should create a unit correctly with all provided properties", () => {
    const unit = UnitFactory.make(
      "U123",
      "T456",
      "P789",
      "Green Apartment",
      "Apartment",
      "GA-01",
      "Available",
      120.5,
      3,
      500000
    );

    expect(unit).toEqual({
      unit_id: "U123",
      tenant_id: "T456",
      project_id: "P789",
      name: "Green Apartment",
      type: "Apartment",
      code: "GA-01",
      availability: "Available",
      area: 120.5,
      bedrooms: 3,
      price: 500000,
    });
  });

  it("should handle floating point area and price", () => {
    const unit = UnitFactory.make(
      "id", "tid", "pid", "name", "type", "code", "avail",
      99.99, 1, 1000.50
    );

    expect(unit.area).toBe(99.99);
    expect(unit.price).toBe(1000.50);
  });
});
