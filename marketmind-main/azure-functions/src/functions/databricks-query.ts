import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { executeQuery, sanitizeTableName, isValidTable, ValidTableName } from '../shared/databricks-client';

interface QueryParams {
  table?: string;
  limit?: string;
  offset?: string;
  orderBy?: string;
  orderDir?: string;
  filters?: string;
}

interface FilterCondition {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
  value: unknown;
}

const VALID_COLUMNS: Record<ValidTableName, string[]> = {
  academy: ['academy_id', 'academy_code', 'community_id', 'product_type_id', 'year', 'quarter', 'capacity', 'venue_type', 'start_date', 'end_date', 'created_at', 'updated_at', 'is_active', 'data_source'],
  assessment: ['assessment_id', 'participant_id', 'session_id', 'assessment_type_id', 'skill_id', 'assessment_date', 'score', 'max_possible_score', 'assessor_staff_id', 'feedback_provided', 'attempt_number', 'grade', 'reassessment_required', 'created_at', 'updated_at', 'is_active', 'data_source'],
  assessment_type: ['assessment_type_id', 'assessment_name', 'assessment_code', 'min_score', 'max_score', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
  attendance: ['attendance_id', 'session_id', 'participant_id', 'attendance_status', 'arrival_time_variance_mins', 'participation_level', 'behaviour_notes', 'left_early', 'created_at', 'updated_at', 'is_active', 'data_source'],
  bridge_lesson_skill: ['bridge_id', 'lesson_plan_id', 'skill_id', 'skill_importance', 'target_proficiency_level', 'learning_hours', 'created_at', 'updated_at', 'is_active', 'data_source'],
  city: ['city_id', 'city_name', 'region_id', 'latitude', 'longitude', 'created_at', 'updated_at', 'is_active', 'data_source'],
  cohort: ['cohort_id', 'cohort_code', 'academy_id', 'cohort_number', 'max_participants', 'day_of_week', 'session_time', 'status', 'created_at', 'updated_at', 'is_active', 'data_source'],
  community: ['community_id', 'city_id', 'community_name', 'postcode_area', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
  lesson_plan: ['lesson_plan_id', 'lesson_code', 'lesson_title', 'theme_id', 'product_type_id', 'duration_minutes', 'difficulty_level', 'delivery_method', 'requires_equipment', 'max_participants', 'version', 'effective_from', 'created_at', 'updated_at', 'is_active', 'data_source'],
  outcome: ['outcome_id', 'participant_id', 'outcome_type_id', 'outcome_date', 'weeks_from_program_end', 'sector', 'hours_per_week', 'salary_band', 'employer_type', 'outcome_source', 'verified', 'recorded_by_staff_id', 'is_sustained_13_weeks', 'is_sustained_26_weeks', 'created_at', 'updated_at', 'is_active', 'data_source'],
  outcome_type: ['outcome_type_id', 'outcome_name', 'outcome_code', 'outcome_category', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
  participant: ['participant_id', 'participant_code', 'cohort_id', 'age_band', 'employment_status_at_entry', 'education_level_at_entry', 'referral_source', 'completion_status', 'enrollment_date', 'created_at', 'updated_at', 'is_active', 'data_source'],
  product_type: ['product_type_id', 'product_type_name', 'product_code', 'duration_weeks', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
  progress: ['progress_id', 'participant_id', 'cohort_id', 'week_number', 'progress_date', 'attendance_rate_pct', 'engagement_score', 'confidence_score', 'motivation_score', 'skills_progress_score', 'overall_progress', 'barriers_identified', 'support_provided', 'recorded_by_staff_id', 'created_at', 'updated_at', 'is_active', 'data_source'],
  region: ['region_id', 'region_name', 'region_code', 'created_at', 'updated_at', 'is_active', 'data_source'],
  session: ['session_id', 'session_code', 'cohort_id', 'lesson_plan_id', 'lead_staff_id', 'support_staff_id', 'start_time', 'actual_duration_minutes', 'session_type', 'sport_type_id', 'planned_participants', 'actual_participants', 'session_status', 'weather_impact', 'external_visitor', 'session_date', 'created_at', 'updated_at', 'is_active', 'data_source'],
  skill: ['skill_id', 'skill_name', 'skill_category_id', 'min_proficiency', 'max_proficiency', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
  skill_achievement: ['achievement_id', 'participant_id', 'skill_id', 'initial_proficiency', 'current_proficiency', 'target_proficiency', 'first_assessed_date', 'achievement_status', 'evidence_type', 'verified_by_staff_id', 'last_assessed_date', 'created_at', 'updated_at', 'is_active', 'data_source'],
  skill_category: ['skill_category_id', 'category_name', 'category_code', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
  sport_participation: ['participation_id', 'participant_id', 'session_id', 'sport_type_id', 'participation_date', 'duration_minutes', 'intensity_level', 'skill_level', 'team_role', 'performance_rating', 'enjoyment_rating', 'sportsmanship_rating', 'injury_reported', 'coach_staff_id', 'created_at', 'updated_at', 'is_active', 'data_source'],
  sport_type: ['sport_type_id', 'sport_name', 'sport_code', 'is_team_sport', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
  staff: ['staff_id', 'staff_code', 'city_id', 'role', 'employment_type', 'years_experience', 'is_first_aid_certified', 'is_safeguarding_trained', 'is_coaching_qualified', 'hire_date', 'created_at', 'updated_at', 'is_active', 'data_source'],
  workshop_theme: ['theme_id', 'theme_name', 'theme_code', 'category', 'description', 'created_at', 'updated_at', 'is_active', 'data_source'],
};

function isValidColumn(table: ValidTableName, column: string): boolean {
  return VALID_COLUMNS[table]?.includes(column) ?? false;
}

function buildWhereClause(table: ValidTableName, filters: FilterCondition[]): string {
  if (!filters.length) return '';

  const conditions = filters.map((filter, index) => {
    if (!isValidColumn(table, filter.column)) {
      throw new Error(`Invalid column: ${filter.column}`);
    }

    const paramName = `p${index}`;
    switch (filter.operator) {
      case 'eq':
        return `${filter.column} = :${paramName}`;
      case 'neq':
        return `${filter.column} != :${paramName}`;
      case 'gt':
        return `${filter.column} > :${paramName}`;
      case 'gte':
        return `${filter.column} >= :${paramName}`;
      case 'lt':
        return `${filter.column} < :${paramName}`;
      case 'lte':
        return `${filter.column} <= :${paramName}`;
      case 'like':
        return `${filter.column} LIKE :${paramName}`;
      case 'in':
        return `${filter.column} IN (:${paramName})`;
      default:
        throw new Error(`Invalid operator: ${filter.operator}`);
    }
  });

  return `WHERE ${conditions.join(' AND ')}`;
}

function buildParameters(filters: FilterCondition[]): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  filters.forEach((filter, index) => {
    params[`p${index}`] = filter.value;
  });
  return params;
}

export async function databricksQuery(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Databricks query function invoked');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  try {
    const params: QueryParams = Object.fromEntries(request.query.entries());
    
    if (!params.table) {
      return {
        status: 400,
        jsonBody: { error: 'Missing required parameter: table' },
        headers: { 'Access-Control-Allow-Origin': '*' },
      };
    }

    if (!isValidTable(params.table)) {
      return {
        status: 400,
        jsonBody: { error: `Invalid table name: ${params.table}` },
        headers: { 'Access-Control-Allow-Origin': '*' },
      };
    }

    const tableName = sanitizeTableName(params.table);
    const limit = Math.min(parseInt(params.limit || '100', 10), 1000);
    const offset = parseInt(params.offset || '0', 10);
    
    let orderClause = '';
    if (params.orderBy && isValidColumn(tableName, params.orderBy)) {
      const dir = params.orderDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      orderClause = `ORDER BY ${params.orderBy} ${dir}`;
    }

    let filters: FilterCondition[] = [];
    if (params.filters) {
      try {
        filters = JSON.parse(params.filters);
      } catch {
        return {
          status: 400,
          jsonBody: { error: 'Invalid filters JSON' },
          headers: { 'Access-Control-Allow-Origin': '*' },
        };
      }
    }

    const whereClause = buildWhereClause(tableName, filters);
    const queryParams = buildParameters(filters);

    const sql = `
      SELECT * FROM ${tableName}
      ${whereClause}
      ${orderClause}
      LIMIT ${limit} OFFSET ${offset}
    `.trim();

    context.log(`Executing query: ${sql}`);
    
    const result = await executeQuery(sql, Object.keys(queryParams).length ? queryParams : undefined);

    return {
      status: 200,
      jsonBody: {
        success: true,
        table: tableName,
        ...result,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    context.error('Query execution failed:', error);
    
    return {
      status: 500,
      jsonBody: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
}

app.http('databricks-query', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: databricksQuery,
});
