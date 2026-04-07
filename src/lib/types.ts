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

export type Audience = "parent" | "educator";

export type PresetKey =
  | "academic"
  | "balancedFamily"
  | "smallClassrooms"
  | "classroomConditions"
  | "resourceSupport"
  | "balancedTeaching";

export type ScoredDistrict = District & { score: number };
