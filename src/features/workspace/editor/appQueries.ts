interface AppQuery {
  query: string;
}

export const appQueries: Record<string, AppQuery> = {
  getIntellisense: {
    query: `
    SELECT 
      table_catalog AS database,
      table_schema AS schema,
      table_name AS table,
      column_name,
      data_type AS column_type
    FROM information_schema.columns
    ORDER BY table_catalog, table_schema, table_name, column_name;
    `,
  },
  getDatabasesTables: {
    query: `
    SELECT
      table_catalog AS database_name,
      table_schema AS schema_name,
      table_name AS table_name,
      table_type
    FROM information_schema.tables
    ORDER BY table_catalog, table_schema, table_name;
    `,
  },
  getClickHouseFunctions: {
    query: `SELECT function_name AS name FROM duckdb_functions`,
  },
  getKeywords: {
    query: `SELECT keyword FROM duckdb_keywords`,
  },
};
