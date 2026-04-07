import { describe, it, expect } from "vitest";
import { STATES, PRESETS } from "./presets";
import type { Audience } from "./types";

describe("presets", () => {
  describe("STATES", () => {
    it("is an array", () => {
      expect(Array.isArray(STATES)).toBe(true);
    });

    it("contains all expected states", () => {
      expect(STATES).toContain("NY");
      expect(STATES).toContain("CA");
      expect(STATES).toContain("TX");
    });

    it("contains 14 states", () => {
      expect(STATES.length).toBe(14);
    });

    it("all entries are 2-letter strings", () => {
      STATES.forEach((state) => {
        expect(state).toMatch(/^[A-Z]{2}$/);
      });
    });
  });

  describe("PRESETS", () => {
    it("has parent audience presets", () => {
      expect(PRESETS.parent).toBeDefined();
      expect(Array.isArray(PRESETS.parent)).toBe(true);
    });

    it("has educator audience presets", () => {
      expect(PRESETS.educator).toBeDefined();
      expect(Array.isArray(PRESETS.educator)).toBe(true);
    });

    it("parent has 3 presets", () => {
      expect(PRESETS.parent.length).toBe(3);
    });

    it("educator has 3 presets", () => {
      expect(PRESETS.educator.length).toBe(3);
    });

    it("all presets have value and label", () => {
      Object.values(PRESETS).forEach((presetList) => {
        presetList.forEach((preset) => {
          expect(preset.value).toBeDefined();
          expect(preset.label).toBeDefined();
          expect(typeof preset.value).toBe("string");
          expect(typeof preset.label).toBe("string");
        });
      });
    });

    it("parent presets include academic", () => {
      const values = PRESETS.parent.map((p) => p.value);
      expect(values).toContain("academic");
    });

    it("educator presets include classroomConditions", () => {
      const values = PRESETS.educator.map((p) => p.value);
      expect(values).toContain("classroomConditions");
    });

    it("preset labels are non-empty", () => {
      Object.values(PRESETS).forEach((presetList) => {
        presetList.forEach((preset) => {
          expect(preset.label.length).toBeGreaterThan(0);
        });
      });
    });

    it("preset values are non-empty", () => {
      Object.values(PRESETS).forEach((presetList) => {
        presetList.forEach((preset) => {
          expect(preset.value.length).toBeGreaterThan(0);
        });
      });
    });

    it("has correct parent preset values", () => {
      const values = PRESETS.parent.map((p) => p.value).sort();
      expect(values).toEqual(["academic", "balancedFamily", "smallClassrooms"].sort());
    });

    it("has correct educator preset values", () => {
      const values = PRESETS.educator.map((p) => p.value).sort();
      expect(values).toEqual(["balancedTeaching", "classroomConditions", "resourceSupport"].sort());
    });
  });
});
