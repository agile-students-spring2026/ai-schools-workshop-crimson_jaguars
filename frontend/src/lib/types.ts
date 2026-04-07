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