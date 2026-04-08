export type Audience = "parent" | "educator";

export type PresetKey =
  | "academic"
  | "balancedFamily"
  | "smallClassrooms"
  | "classroomConditions"
  | "resourceSupport"
  | "balancedTeaching";

export type UserSelections = {
  audience: Audience;
  state: string;
  preset: PresetKey;
};

export type District = {
  id: string;
  name: string;
  state: string;
  graduationRate: number;
  perPupilSpending: number;
  studentTeacherRatio: number;
  enrollment: number;
  povertyIndex: number;
};

export type ScoredDistrict = District & { score: number };
