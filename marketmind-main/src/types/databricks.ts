// TypeScript types matching the Databricks table schemas

export interface Academy {
  academy_id: string;
  academy_code: string;
  community_id: string;
  product_type_id: string;
  year: number;
  quarter: number;
  capacity: number;
  venue_type: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Assessment {
  assessment_id: string;
  participant_id: string;
  session_id: string;
  assessment_type_id: string;
  skill_id: string;
  assessment_date: string;
  score: number;
  max_possible_score: number;
  assessor_staff_id: string;
  feedback_provided: boolean;
  attempt_number: number;
  grade: string;
  reassessment_required: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface AssessmentType {
  assessment_type_id: string;
  assessment_name: string;
  assessment_code: string;
  min_score: number;
  max_score: number;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Attendance {
  attendance_id: string;
  session_id: string;
  participant_id: string;
  attendance_status: 'present' | 'absent' | 'late' | 'partial';
  arrival_time_variance_mins: number;
  participation_level: string;
  behaviour_notes: string;
  left_early: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface BridgeLessonSkill {
  bridge_id: string;
  lesson_plan_id: string;
  skill_id: string;
  skill_importance: string;
  target_proficiency_level: number;
  learning_hours: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface City {
  city_id: string;
  city_name: string;
  region_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Cohort {
  cohort_id: string;
  cohort_code: string;
  academy_id: string;
  cohort_number: number;
  max_participants: number;
  day_of_week: string;
  session_time: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Community {
  community_id: string;
  city_id: string;
  community_name: string;
  postcode_area: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface LessonPlan {
  lesson_plan_id: string;
  lesson_code: string;
  lesson_title: string;
  theme_id: string;
  product_type_id: string;
  duration_minutes: number;
  difficulty_level: string;
  delivery_method: string;
  requires_equipment: boolean;
  max_participants: number;
  version: number;
  effective_from: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Outcome {
  outcome_id: string;
  participant_id: string;
  outcome_type_id: string;
  outcome_date: string;
  weeks_from_program_end: number;
  sector: string;
  hours_per_week: number;
  salary_band: string;
  employer_type: string;
  outcome_source: string;
  verified: boolean;
  recorded_by_staff_id: string;
  is_sustained_13_weeks: boolean;
  is_sustained_26_weeks: boolean;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface OutcomeType {
  outcome_type_id: string;
  outcome_name: string;
  outcome_code: string;
  outcome_category: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Participant {
  participant_id: string;
  participant_code: string;
  cohort_id: string;
  age_band: string;
  employment_status_at_entry: string;
  education_level_at_entry: string;
  referral_source: string;
  completion_status: 'enrolled' | 'in_progress' | 'completed' | 'withdrawn';
  enrollment_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface ProductType {
  product_type_id: string;
  product_type_name: string;
  product_code: string;
  duration_weeks: number;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Progress {
  progress_id: string;
  participant_id: string;
  cohort_id: string;
  week_number: number;
  progress_date: string;
  attendance_rate_pct: number;
  engagement_score: number;
  confidence_score: number;
  motivation_score: number;
  skills_progress_score: number;
  overall_progress: string;
  barriers_identified: string;
  support_provided: string;
  recorded_by_staff_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Region {
  region_id: string;
  region_name: string;
  region_code: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Session {
  session_id: string;
  session_code: string;
  cohort_id: string;
  lesson_plan_id: string;
  lead_staff_id: string;
  support_staff_id: string;
  start_time: string;
  actual_duration_minutes: number;
  session_type: string;
  sport_type_id: string;
  planned_participants: number;
  actual_participants: number;
  session_status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  weather_impact: string;
  external_visitor: boolean;
  session_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Skill {
  skill_id: string;
  skill_name: string;
  skill_category_id: string;
  min_proficiency: number;
  max_proficiency: number;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface SkillAchievement {
  achievement_id: string;
  participant_id: string;
  skill_id: string;
  initial_proficiency: number;
  current_proficiency: number;
  target_proficiency: number;
  first_assessed_date: string;
  achievement_status: string;
  evidence_type: string;
  verified_by_staff_id: string;
  last_assessed_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface SkillCategory {
  skill_category_id: string;
  category_name: string;
  category_code: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface SportParticipation {
  participation_id: string;
  participant_id: string;
  session_id: string;
  sport_type_id: string;
  participation_date: string;
  duration_minutes: number;
  intensity_level: string;
  skill_level: string;
  team_role: string;
  performance_rating: number;
  enjoyment_rating: number;
  sportsmanship_rating: number;
  injury_reported: boolean;
  coach_staff_id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface SportType {
  sport_type_id: string;
  sport_name: string;
  sport_code: string;
  is_team_sport: boolean;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface Staff {
  staff_id: string;
  staff_code: string;
  city_id: string;
  role: string;
  employment_type: string;
  years_experience: number;
  is_first_aid_certified: boolean;
  is_safeguarding_trained: boolean;
  is_coaching_qualified: boolean;
  hire_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

export interface WorkshopTheme {
  theme_id: string;
  theme_name: string;
  theme_code: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  data_source: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T[];
  rowCount?: number;
  executionTime?: number;
  error?: string;
}

export interface DashboardStats {
  totalWorkshops: number;
  activeParticipants: number;
  sessionsThisWeek: number;
  completionRate: number;
  totalStaff: number;
  totalOutcomes: number;
  averageAttendance: number;
}

export interface StatsResponse {
  success: boolean;
  stats?: DashboardStats;
  timestamp?: string;
  error?: string;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'error';
  timestamp: string;
  databricks?: {
    connected: boolean;
    host: string;
    httpPath: string;
    token: string;
  };
  error?: string;
}

// Table name union type
export type TableName =
  | 'academy'
  | 'assessment'
  | 'assessment_type'
  | 'attendance'
  | 'bridge_lesson_skill'
  | 'city'
  | 'cohort'
  | 'community'
  | 'lesson_plan'
  | 'outcome'
  | 'outcome_type'
  | 'participant'
  | 'product_type'
  | 'progress'
  | 'region'
  | 'session'
  | 'skill'
  | 'skill_achievement'
  | 'skill_category'
  | 'sport_participation'
  | 'sport_type'
  | 'staff'
  | 'workshop_theme';

// Type map for table to type mapping
export interface TableTypeMap {
  academy: Academy;
  assessment: Assessment;
  assessment_type: AssessmentType;
  attendance: Attendance;
  bridge_lesson_skill: BridgeLessonSkill;
  city: City;
  cohort: Cohort;
  community: Community;
  lesson_plan: LessonPlan;
  outcome: Outcome;
  outcome_type: OutcomeType;
  participant: Participant;
  product_type: ProductType;
  progress: Progress;
  region: Region;
  session: Session;
  skill: Skill;
  skill_achievement: SkillAchievement;
  skill_category: SkillCategory;
  sport_participation: SportParticipation;
  sport_type: SportType;
  staff: Staff;
  workshop_theme: WorkshopTheme;
}
