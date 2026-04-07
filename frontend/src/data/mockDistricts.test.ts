import { describe, it, expect } from "vitest";
import { mockDistricts } from "./mockDistricts";

describe("mockDistricts", () => {
  it("is an array", () => {
    expect(Array.isArray(mockDistricts)).toBe(true);
  });

  it("contains districts", () => {
    expect(mockDistricts.length).toBeGreaterThan(0);
  });

  it("all districts have required properties", () => {
    mockDistricts.forEach((district) => {
      expect(district.id).toBeDefined();
      expect(district.name).toBeDefined();
      expect(district.state).toBeDefined();
      expect(district.graduationRate).toBeDefined();
      expect(district.perPupilSpending).toBeDefined();
      expect(district.studentTeacherRatio).toBeDefined();
      expect(district.enrollment).toBeDefined();
      expect(district.povertyIndex).toBeDefined();
      expect(district.score).toBeDefined();
    });
  });

  it("all numeric values are numbers", () => {
    mockDistricts.forEach((district) => {
      expect(typeof district.graduationRate).toBe("number");
      expect(typeof district.perPupilSpending).toBe("number");
      expect(typeof district.studentTeacherRatio).toBe("number");
      expect(typeof district.enrollment).toBe("number");
      expect(typeof district.povertyIndex).toBe("number");
      expect(typeof district.score).toBe("number");
    });
  });

  it("graduation rates are positive percentages", () => {
    mockDistricts.forEach((district) => {
      expect(district.graduationRate).toBeGreaterThan(0);
      expect(district.graduationRate).toBeLessThanOrEqual(100);
    });
  });

  it("poverty index values are positive percentages", () => {
    mockDistricts.forEach((district) => {
      expect(district.povertyIndex).toBeGreaterThan(0);
      expect(district.povertyIndex).toBeLessThanOrEqual(100);
    });
  });

  it("all districts are from NY", () => {
    mockDistricts.forEach((district) => {
      expect(district.state).toBe("NY");
    });
  });

  it("all district IDs are unique", () => {
    const ids = mockDistricts.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("all district names are non-empty", () => {
    mockDistricts.forEach((district) => {
      expect(district.name.length).toBeGreaterThan(0);
    });
  });

  it("enrollment is positive integer or number", () => {
    mockDistricts.forEach((district) => {
      expect(district.enrollment).toBeGreaterThan(0);
    });
  });

  it("student-teacher ratio is positive", () => {
    mockDistricts.forEach((district) => {
      expect(district.studentTeacherRatio).toBeGreaterThan(0);
    });
  });

  it("per pupil spending is positive", () => {
    mockDistricts.forEach((district) => {
      expect(district.perPupilSpending).toBeGreaterThan(0);
    });
  });

  it("score is non-negative", () => {
    mockDistricts.forEach((district) => {
      expect(district.score).toBeGreaterThanOrEqual(0);
    });
  });

  it("score is less than or equal to 100", () => {
    mockDistricts.forEach((district) => {
      expect(district.score).toBeLessThanOrEqual(100);
    });
  });

  it("has at least 10 districts", () => {
    expect(mockDistricts.length).toBeGreaterThanOrEqual(10);
  });
});
