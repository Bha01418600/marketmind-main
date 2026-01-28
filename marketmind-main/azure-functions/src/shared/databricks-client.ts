/**
 * Databricks SQL REST API Client
 * Handles all communication with Azure Databricks SQL Warehouse
 */

export interface DatabricksConfig {
  host: string;
  httpPath: string;
  token: string;
}

export interface QueryResult<T = Record<string, unknown>> {
  data: T[];
  rowCount: number;
  executionTime: number;
}

export interface DatabricksStatement {
  statement_id: string;
  status: {
    state: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'CLOSED';
    error?: {
      error_code: string;
      message: string;
    };
  };
  manifest?: {
    schema: {
      columns: Array<{
        name: string;
        type_name: string;
        position: number;
      }>;
    };
    total_row_count: number;
  };
  result?: {
    data_array?: unknown[][];
    row_count: number;
  };
}

function getConfig(): DatabricksConfig {
  const host = process.env.DATABRICKS_HOST;
  const httpPath = process.env.DATABRICKS_HTTP_PATH;
  const token = process.env.DATABRICKS_TOKEN;

  if (!host || !httpPath || !token) {
    throw new Error('Missing Databricks configuration. Ensure DATABRICKS_HOST, DATABRICKS_HTTP_PATH, and DATABRICKS_TOKEN are set.');
  }

  return { host, httpPath, token };
}

export async function executeQuery<T = Record<string, unknown>>(
  sql: string,
  parameters?: Record<string, unknown>
): Promise<QueryResult<T>> {
  const startTime = Date.now();
  const config = getConfig();
  
  const url = `https://${config.host}/api/2.0/sql/statements`;
  
  const body: Record<string, unknown> = {
    statement: sql,
    warehouse_id: config.httpPath.split('/').pop(),
    wait_timeout: '30s',
    on_wait_timeout: 'CANCEL',
  };

  if (parameters) {
    body.parameters = Object.entries(parameters).map(([name, value]) => ({
      name,
      value: String(value),
    }));
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Databricks API error [${response.status}]: ${errorText}`);
  }

  const statement: DatabricksStatement = await response.json();

  if (statement.status.state === 'FAILED') {
    throw new Error(`Query failed: ${statement.status.error?.message || 'Unknown error'}`);
  }

  if (statement.status.state !== 'SUCCEEDED') {
    throw new Error(`Unexpected query state: ${statement.status.state}`);
  }

  const columns = statement.manifest?.schema?.columns || [];
  const dataArray = statement.result?.data_array || [];

  const data: T[] = dataArray.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, index) => {
      obj[col.name] = row[index];
    });
    return obj as T;
  });

  return {
    data,
    rowCount: statement.result?.row_count || 0,
    executionTime: Date.now() - startTime,
  };
}

export async function testConnection(): Promise<boolean> {
  try {
    await executeQuery('SELECT 1 as test');
    return true;
  } catch {
    return false;
  }
}

// Sanitize table names to prevent SQL injection
const VALID_TABLES = [
  'academy', 'assessment', 'assessment_type', 'attendance', 'bridge_lesson_skill',
  'city', 'cohort', 'community', 'lesson_plan', 'outcome', 'outcome_type',
  'participant', 'product_type', 'progress', 'region', 'session', 'skill',
  'skill_achievement', 'skill_category', 'sport_participation', 'sport_type',
  'staff', 'workshop_theme'
] as const;

export type ValidTableName = typeof VALID_TABLES[number];

export function isValidTable(tableName: string): tableName is ValidTableName {
  return VALID_TABLES.includes(tableName as ValidTableName);
}

export function sanitizeTableName(tableName: string): ValidTableName {
  if (!isValidTable(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  return tableName;
}
