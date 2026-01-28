import type { TableName, TableTypeMap, ApiResponse, StatsResponse, HealthResponse } from '@/types/databricks';

// Get API base URL from environment or default to relative path for Azure Static Web Apps
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
  filters?: FilterCondition[];
}

interface FilterCondition {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
  value: unknown;
}

/**
 * Fetches data from a Databricks table via Azure Functions
 */
export async function fetchTableData<T extends TableName>(
  table: T,
  options: QueryOptions = {}
): Promise<ApiResponse<TableTypeMap[T]>> {
  const params = new URLSearchParams({ table });

  if (options.limit) params.set('limit', options.limit.toString());
  if (options.offset) params.set('offset', options.offset.toString());
  if (options.orderBy) params.set('orderBy', options.orderBy);
  if (options.orderDir) params.set('orderDir', options.orderDir);
  if (options.filters?.length) params.set('filters', JSON.stringify(options.filters));

  const response = await fetch(`${API_BASE_URL}/databricks-query?${params}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch ${table}`);
  }

  return response.json();
}

/**
 * Fetches dashboard statistics from Databricks
 */
export async function fetchDashboardStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE_URL}/databricks-stats`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch stats`);
  }

  return response.json();
}

/**
 * Checks the health of the Databricks connection
 */
export async function checkDatabricksHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/databricks-health`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: Health check failed`);
  }

  return response.json();
}

/**
 * Helper to build filter conditions
 */
export function createFilter(
  column: string,
  operator: FilterCondition['operator'],
  value: unknown
): FilterCondition {
  return { column, operator, value };
}

/**
 * Convenience methods for common queries
 */
export const databricksApi = {
  // Core entities
  getAcademies: (options?: QueryOptions) => fetchTableData('academy', options),
  getCohorts: (options?: QueryOptions) => fetchTableData('cohort', options),
  getParticipants: (options?: QueryOptions) => fetchTableData('participant', options),
  getSessions: (options?: QueryOptions) => fetchTableData('session', options),
  getStaff: (options?: QueryOptions) => fetchTableData('staff', options),

  // Workshops & Lessons
  getLessonPlans: (options?: QueryOptions) => fetchTableData('lesson_plan', options),
  getWorkshopThemes: (options?: QueryOptions) => fetchTableData('workshop_theme', options),
  getProductTypes: (options?: QueryOptions) => fetchTableData('product_type', options),

  // Skills & Assessments
  getSkills: (options?: QueryOptions) => fetchTableData('skill', options),
  getSkillCategories: (options?: QueryOptions) => fetchTableData('skill_category', options),
  getSkillAchievements: (options?: QueryOptions) => fetchTableData('skill_achievement', options),
  getAssessments: (options?: QueryOptions) => fetchTableData('assessment', options),
  getAssessmentTypes: (options?: QueryOptions) => fetchTableData('assessment_type', options),

  // Attendance & Progress
  getAttendance: (options?: QueryOptions) => fetchTableData('attendance', options),
  getProgress: (options?: QueryOptions) => fetchTableData('progress', options),

  // Outcomes
  getOutcomes: (options?: QueryOptions) => fetchTableData('outcome', options),
  getOutcomeTypes: (options?: QueryOptions) => fetchTableData('outcome_type', options),

  // Sports
  getSportTypes: (options?: QueryOptions) => fetchTableData('sport_type', options),
  getSportParticipation: (options?: QueryOptions) => fetchTableData('sport_participation', options),

  // Locations
  getRegions: (options?: QueryOptions) => fetchTableData('region', options),
  getCities: (options?: QueryOptions) => fetchTableData('city', options),
  getCommunities: (options?: QueryOptions) => fetchTableData('community', options),

  // Bridge tables
  getBridgeLessonSkills: (options?: QueryOptions) => fetchTableData('bridge_lesson_skill', options),

  // Aggregates
  getDashboardStats: fetchDashboardStats,
  checkHealth: checkDatabricksHealth,
};

export default databricksApi;
