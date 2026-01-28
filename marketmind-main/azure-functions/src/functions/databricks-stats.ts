import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { executeQuery } from '../shared/databricks-client';

interface DashboardStats {
  totalWorkshops: number;
  activeParticipants: number;
  sessionsThisWeek: number;
  completionRate: number;
  totalStaff: number;
  totalOutcomes: number;
  averageAttendance: number;
}

export async function databricksStats(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Databricks stats function invoked');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  try {
    // Execute multiple queries in parallel for dashboard stats
    const [
      workshopsResult,
      participantsResult,
      sessionsResult,
      completionResult,
      staffResult,
      outcomesResult,
      attendanceResult,
    ] = await Promise.all([
      executeQuery<{ count: number }>('SELECT COUNT(*) as count FROM lesson_plan WHERE is_active = true'),
      executeQuery<{ count: number }>('SELECT COUNT(*) as count FROM participant WHERE is_active = true'),
      executeQuery<{ count: number }>(`
        SELECT COUNT(*) as count FROM session 
        WHERE session_date >= DATE_SUB(CURRENT_DATE(), 7) 
        AND is_active = true
      `),
      executeQuery<{ rate: number }>(`
        SELECT 
          ROUND(
            COUNT(CASE WHEN completion_status = 'completed' THEN 1 END) * 100.0 / 
            NULLIF(COUNT(*), 0), 
            1
          ) as rate 
        FROM participant 
        WHERE is_active = true
      `),
      executeQuery<{ count: number }>('SELECT COUNT(*) as count FROM staff WHERE is_active = true'),
      executeQuery<{ count: number }>('SELECT COUNT(*) as count FROM outcome WHERE is_active = true'),
      executeQuery<{ avg_rate: number }>(`
        SELECT ROUND(AVG(
          CASE 
            WHEN attendance_status = 'present' THEN 100
            WHEN attendance_status = 'late' THEN 75
            WHEN attendance_status = 'partial' THEN 50
            ELSE 0
          END
        ), 1) as avg_rate
        FROM attendance
        WHERE is_active = true
      `),
    ]);

    const stats: DashboardStats = {
      totalWorkshops: workshopsResult.data[0]?.count || 0,
      activeParticipants: participantsResult.data[0]?.count || 0,
      sessionsThisWeek: sessionsResult.data[0]?.count || 0,
      completionRate: completionResult.data[0]?.rate || 0,
      totalStaff: staffResult.data[0]?.count || 0,
      totalOutcomes: outcomesResult.data[0]?.count || 0,
      averageAttendance: attendanceResult.data[0]?.avg_rate || 0,
    };

    return {
      status: 200,
      jsonBody: {
        success: true,
        stats,
        timestamp: new Date().toISOString(),
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    context.error('Stats query failed:', error);

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

app.http('databricks-stats', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  handler: databricksStats,
});
