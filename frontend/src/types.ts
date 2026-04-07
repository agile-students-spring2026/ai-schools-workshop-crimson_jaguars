export interface State {
  fips: string;
  code: string;
  name: string;
}

export interface ScoreFactors {
  student_teacher_ratio_score: number;
  size_score: number;
  funding_context_score: number;
}

export interface Score {
  overall: number;
  student_teacher_ratio: number | null;
  factors: ScoreFactors;
}

export interface District {
  leaid: string;
  name: string;
  state: string;
  city: string;
  year: number | null;
  enrollment: number | null;
  teachers_total_fte: number | null;
  free_or_reduced_price_lunch_pct: number | null;
  lowest_grade_offered: number | string | null;
  highest_grade_offered: number | string | null;
  number_of_schools: number | null;
  urban_centric_locale: number | null;
  score: Score;
}

export interface DistrictListResponse {
  count: number;
  results: District[];
}
