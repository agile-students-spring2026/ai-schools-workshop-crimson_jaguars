import type { Audience, PresetKey } from "./types";

export type PresetOption = {
  value: PresetKey;
  label: string;
};

export const STATES = [
  "AL",
  "AZ",
  "CA",
  "CT",
  "FL",
  "GA",
  "IL",
  "MA",
  "NJ",
  "NY",
  "PA",
  "TX",
  "VA",
  "WA",
];

export const PRESETS: Record<Audience, PresetOption[]> = {
  parent: [
    { value: "academic", label: "Academic Focus" },
    { value: "balancedFamily", label: "Balanced Family Fit" },
    { value: "smallClassrooms", label: "Smaller Classrooms" },
  ],
  educator: [
    { value: "classroomConditions", label: "Classroom Conditions" },
    { value: "resourceSupport", label: "Resource Support" },
    { value: "balancedTeaching", label: "Balanced Teaching Fit" },
  ],
};