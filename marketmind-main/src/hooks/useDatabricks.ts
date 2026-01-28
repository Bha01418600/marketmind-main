import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { 
  fetchTableData, 
  fetchDashboardStats, 
  checkDatabricksHealth,
  createFilter 
} from '@/lib/databricks-api';
import type { 
  TableName, 
  TableTypeMap, 
  ApiResponse, 
  StatsResponse, 
  HealthResponse 
} from '@/types/databricks';

interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
  filters?: Array<{
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
    value: unknown;
  }>;
}

/**
 * Generic hook for fetching data from any Databricks table
 */
export function useDatabricksTable<T extends TableName>(
  table: T,
  options?: QueryOptions,
  queryOptions?: Omit<UseQueryOptions<ApiResponse<TableTypeMap[T]>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['databricks', table, options],
    queryFn: () => fetchTableData(table, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...queryOptions,
  });
}

/**
 * Hook for fetching dashboard statistics
 */
export function useDashboardStats(
  queryOptions?: Omit<UseQueryOptions<StatsResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['databricks', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...queryOptions,
  });
}

/**
 * Hook for checking Databricks connection health
 */
export function useDatabricksHealth(
  queryOptions?: Omit<UseQueryOptions<HealthResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ['databricks', 'health'],
    queryFn: checkDatabricksHealth,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
    ...queryOptions,
  });
}

// Convenience hooks for common tables
export const useAcademies = (options?: QueryOptions) => useDatabricksTable('academy', options);
export const useCohorts = (options?: QueryOptions) => useDatabricksTable('cohort', options);
export const useParticipants = (options?: QueryOptions) => useDatabricksTable('participant', options);
export const useSessions = (options?: QueryOptions) => useDatabricksTable('session', options);
export const useStaff = (options?: QueryOptions) => useDatabricksTable('staff', options);
export const useLessonPlans = (options?: QueryOptions) => useDatabricksTable('lesson_plan', options);
export const useWorkshopThemes = (options?: QueryOptions) => useDatabricksTable('workshop_theme', options);
export const useProductTypes = (options?: QueryOptions) => useDatabricksTable('product_type', options);
export const useSkills = (options?: QueryOptions) => useDatabricksTable('skill', options);
export const useSkillCategories = (options?: QueryOptions) => useDatabricksTable('skill_category', options);
export const useSkillAchievements = (options?: QueryOptions) => useDatabricksTable('skill_achievement', options);
export const useAssessments = (options?: QueryOptions) => useDatabricksTable('assessment', options);
export const useAssessmentTypes = (options?: QueryOptions) => useDatabricksTable('assessment_type', options);
export const useAttendance = (options?: QueryOptions) => useDatabricksTable('attendance', options);
export const useProgress = (options?: QueryOptions) => useDatabricksTable('progress', options);
export const useOutcomes = (options?: QueryOptions) => useDatabricksTable('outcome', options);
export const useOutcomeTypes = (options?: QueryOptions) => useDatabricksTable('outcome_type', options);
export const useSportTypes = (options?: QueryOptions) => useDatabricksTable('sport_type', options);
export const useSportParticipation = (options?: QueryOptions) => useDatabricksTable('sport_participation', options);
export const useRegions = (options?: QueryOptions) => useDatabricksTable('region', options);
export const useCities = (options?: QueryOptions) => useDatabricksTable('city', options);
export const useCommunities = (options?: QueryOptions) => useDatabricksTable('community', options);

export { createFilter };
