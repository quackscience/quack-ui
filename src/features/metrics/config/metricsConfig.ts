import { ChartConfig } from "@/components/ui/chart";
import {
  HomeIcon,
  TableIcon,
  CombineIcon,
  TerminalSquareIcon,
  Settings2,
  HardDriveIcon,
  NetworkIcon,
  CpuIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { ReactNode, ComponentType } from "react";

export interface Metrics {
  title: string;
  description: string;
  scope: string;
  icon: React.ElementType;
  items?: MetricItem[];
}

export interface MetricItem {
  title: string;
  query: string;
  type: "card" | "table" | "chart";
  chartType?: "bar" | "line" | "area" | "pie" | "radar" | "radial";
  description: string;
  chartConfig?: CustomChartConfig;
  tiles?: number;
}

export type ChartTheme = {
  light: string;
  dark: string;
}

export type ChartDataConfig = {
  label?: ReactNode;
  icon?: ComponentType<{}>;
} & ({ color?: string; theme?: never } | { color?: never; theme: ChartTheme });

export type CustomChartConfig = {
  indexBy: string;
  [key: string]: ChartDataConfig | string | undefined;
}

export const metrics: Metrics[] = [
  {
    title: "Overview",
    scope: "overview",
    description: "Overview of DuckDB metrics.",
    icon: HomeIcon,
    items: [
      {
        title: "Server Uptime (days)",
        query: `
          SELECT 
            ROUND(SUM(julianday('now') - julianday(start_time)), 2) AS uptime_days 
          FROM pragma_database_list
          WHERE name = 'main'
        `,
        type: "card",
        description:
          "Total time the server has been running in days.",
        tiles: 1,
      },
      {
        title: "Total Databases",
        query: `
          SELECT COUNT(*) AS total_databases 
          FROM pragma_database_list 
          WHERE name NOT IN ('main', 'temp')
        `,
        type: "card",
        description: "Total number of databases excluding system databases.",
        tiles: 1,
      },
      {
        title: "Total Tables",
        query: `
          SELECT COUNT(*) AS total_tables 
          FROM information_schema.tables 
          WHERE table_schema NOT IN ('main', 'temp')
        `,
        type: "card",
        description: "Total number of user tables excluding temporary tables.",
        tiles: 1,
      },
      {
        title: "Version",
        query: `SELECT sqlite_version() AS version`,
        type: "card",
        description:
          "Version of the DuckDB server running on the current instance.",
        tiles: 1,
      },
      {
        title: "Running Queries",
        query: `SELECT * FROM pragma_busy_list`,
        type: "table",
        description: "Currently running queries.",
        tiles: 4,
      },
      {
        title: "Daily Query Count",
        description: "Number of queries per day for the last 30 days.",
        type: "chart",
        chartType: "bar",
        query: `
          SELECT COUNT(*) AS query_count, DATE(event_time) AS day 
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-30 days') 
          GROUP BY day 
          ORDER BY day
        `,
        chartConfig: {
          indexBy: "day",
          query_count: {
            label: "Query Count",
            color: "hsl(var(--chart-1))",
          },
        },
        tiles: 4,
      },
    ],
  },
  {
    title: "Tables",
    description: "Metrics related to tables.",
    scope: "tables",
    icon: TableIcon,
    items: [
      {
        title: "Total Tables",
        query: `
          SELECT COUNT(*) AS total_tables 
          FROM information_schema.tables 
          WHERE table_schema NOT IN ('main', 'temp')
        `,
        type: "card",
        description: "Total number of user-defined tables.",
        tiles: 1,
      },
      {
        title: "Total System Tables",
        query: `
          SELECT COUNT(*) AS total_tables 
          FROM information_schema.tables 
          WHERE table_schema IN ('main', 'temp')
        `,
        type: "card",
        description: "Total number of system tables.",
        tiles: 1,
      },
      {
        title: "Total Temporary Tables",
        query: `
          SELECT COUNT(*) AS total_tables 
          FROM information_schema.tables 
          WHERE table_schema LIKE 'temp%'
        `,
        type: "card",
        description: "Total number of temporary tables.",
        tiles: 1,
      },
      {
        title: "Biggest Table",
        query: `
          SELECT table_name AS table 
          FROM information_schema.tables 
          WHERE table_schema NOT IN ('main', 'temp')
          ORDER BY table_name DESC 
          LIMIT 1
        `,
        type: "card",
        description: "Largest table in the system.",
        tiles: 1,
      },
      {
        title: "Table Cardinality",
        query: `
          SELECT table_schema, table_name AS table, COUNT(*) AS total_rows 
          FROM information_schema.tables 
          WHERE table_schema NOT IN ('main', 'temp')
          GROUP BY table_schema, table_name 
          ORDER BY total_rows DESC 
          LIMIT 10
        `,
        type: "table",
        description: "Number of rows in the top 10 tables.",
        tiles: 2,
      },
      {
        title: "Table Row Counts",
        query: `
          SELECT table_schema, table_name AS table, COUNT(*) AS total_rows 
          FROM information_schema.tables 
          WHERE table_schema NOT IN ('main', 'temp')
          GROUP BY table_schema, table_name 
          ORDER BY total_rows DESC 
          LIMIT 10
        `,
        type: "table",
        description: "Number of rows in the top 10 tables.",
        tiles: 2,
      },
      {
        title: "Table Sizes (MB)",
        query: `
          SELECT table_name AS name, SUM(pgsize) / 1024 / 1024 AS total_mb 
          FROM pragma_table_info
          WHERE table_schema NOT IN ('main', 'temp')
          GROUP BY table_name 
          ORDER BY total_mb DESC 
          LIMIT 20
        `,
        type: "chart",
        chartType: "bar",
        description: "Size distribution of the top 30 largest tables.",
        chartConfig: {
          indexBy: "name",
          total_mb: {
            label: "Size (MB)",
            color: "hsl(var(--chart-2))",
          },
        },
        tiles: 2,
      },
      {
        title: "Most Used Tables",
        query: `
          SELECT table_name AS tables, COUNT(*) AS query_count 
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day') 
          GROUP BY table_name 
          ORDER BY query_count DESC 
          LIMIT 10
        `,
        type: "chart",
        chartType: "bar",
        description: "Top 10 most queried tables in the last 24 hours.",
        chartConfig: {
          indexBy: "tables",
          query_count: {
            label: "Query Count",
            color: "hsl(var(--chart-2))",
          },
        },
        tiles: 2,
      },
    ],
  },
  {
    title: "Queries",
    scope: "queries",
    description: "Comprehensive metrics related to queries in the system.",
    icon: TerminalSquareIcon,
    items: [
      {
        title: "Running Queries Count",
        query: `
          SELECT COUNT(*) AS running_queries 
          FROM pragma_busy_list
        `,
        type: "card",
        description: "Current number of active queries in the system.",
        tiles: 1,
      },
      {
        title: "Query Error Rate",
        query: `
          SELECT
            ROUND(100 * SUM(CASE WHEN type IN ('ExceptionBeforeStart', 'ExceptionWhileProcessing') THEN 1 ELSE 0 END) / COUNT(*), 2) AS error_rate
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day')
        `,
        type: "card",
        description: "Percentage of failed queries over the last 24 hours.",
        tiles: 1,
      },
      {
        title: "Average Query Duration",
        query: `
          SELECT 
            ROUND(avg(CAST(query_duration_ms AS DOUBLE)), 2) AS avg_duration_ms
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day')
        `,
        type: "card",
        description:
          "Average duration of queries executed in the last 24 hours.",
        tiles: 1,
      },
      {
        title: "Total Queries (Last 24h)",
        query: `
          SELECT COUNT(*) AS total_queries 
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day')
        `,
        type: "card",
        description: "Total number of queries executed in the last 24 hours.",
        tiles: 1,
      },
      {
        title: "Query Duration Distribution",
        query: `
          SELECT 
            CASE 
              WHEN query_duration_ms < 10 THEN '<10ms'
              WHEN query_duration_ms < 20 THEN '10ms-20ms'
              WHEN query_duration_ms < 50 THEN '20ms-50ms'
              WHEN query_duration_ms < 100 THEN '50ms-100ms'
              WHEN query_duration_ms < 200 THEN '100ms-200ms'
              WHEN query_duration_ms < 500 THEN '200ms-500ms'
              WHEN query_duration_ms < 1000 THEN '500ms-1s'
              WHEN query_duration_ms < 5000 THEN '1s-5s'
              WHEN query_duration_ms < 30000 THEN '5s-30s'
              ELSE '>30s'
            END AS duration_bucket,
            COUNT(*) AS query_count
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day')
          GROUP BY duration_bucket
          ORDER BY duration_bucket
        `,
        type: "chart",
        chartType: "bar",
        description:
          "Granular distribution of query durations over the last 24 hours.",
        chartConfig: {
          indexBy: "duration_bucket",
          query_count: {
            label: "Query Count",
            color: "hsl(var(--chart-1))",
          },
        },
        tiles: 2,
      },
      {
        title: "Queries Per Second (QPS)",
        query: `
          SELECT 
            strftime('%Y-%m-%d %H:%M', event_time) AS minute,
            COUNT(*) AS qps
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 hour')
          GROUP BY minute
          ORDER BY minute
        `,
        type: "chart",
        chartType: "area",
        description: "Rate of queries per second over the last hour.",
        chartConfig: {
          indexBy: "minute",
          qps: {
            label: "QPS",
            color: "hsl(var(--chart-3))",
          },
        },
        tiles: 2,
      },
      {
        title: "Queries Per User",
        query: `
          SELECT user, COUNT(*) AS query_count 
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day')
          GROUP BY user
          ORDER BY query_count DESC 
          LIMIT 10
        `,
        type: "table",
        description:
          "Top 10 users by the number of queries executed in the last 24 hours.",
        tiles: 4,
      },
      {
        title: "Top Slow Queries",
        query: `
          SELECT query, query_duration_ms 
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day')
          ORDER BY query_duration_ms DESC 
          LIMIT 10
        `,
        type: "table",
        description: "Top 10 slowest queries executed in the last 24 hours.",
        tiles: 4,
      },
    ],
  },
  {
    title: "Storage",
    scope: "storage",
    description: "Storage-related metrics.",
    icon: HardDriveIcon,
    items: [
      {
        title: "Database Sizes",
        query: `
          SELECT 
            name AS database,
            round(total_bytes / 1024 / 1024 / 1024, 2) AS size_gb
          FROM pragma_database_list
          WHERE name NOT IN ('main', 'temp')
          ORDER BY size_gb DESC
        `,
        type: "chart",
        chartType: "bar",
        description: "Size distribution of databases.",
        chartConfig: {
          indexBy: "database",
          size_gb: {
            label: "Size (GB)",
            color: "hsl(var(--chart-2))",
          },
        },
        tiles: 4,
      },
    ],
  },
  {
    title: "Settings & Config",
    scope: "settings",
    description: "Settings and configuration.",
    icon: Settings2,
    items: [
      {
        title: "Current Settings",
        query: `SELECT * FROM pragma_settings`,
        type: "table",
        description: "Current DuckDB settings.",
        tiles: 4,
      },
    ],
  },
  {
    title: "Query Exceptions",
    scope: "exceptions",
    description: "Overview of query exceptions in the system.",
    icon: AlertTriangleIcon,
    items: [
      {
        title: "Exceptions (Last 24h)",
        query: `
          SELECT COUNT(*) AS total_exceptions 
          FROM pragma_sql_log
          WHERE type IN ('ExceptionBeforeStart', 'ExceptionWhileProcessing') 
            AND event_time > DATE('now', '-1 day')
        `,
        type: "card",
        description:
          "Total number of exceptions recorded in the last 24 hours.",
        tiles: 1,
      },
      {
        title: "Exception Rate (Last 24h)",
        query: `
          SELECT 
            ROUND(100 * SUM(CASE WHEN type IN ('ExceptionBeforeStart', 'ExceptionWhileProcessing') THEN 1 ELSE 0 END) / COUNT(*), 2) AS exception_rate
          FROM pragma_sql_log
          WHERE event_time > DATE('now', '-1 day')
        `,
        type: "card",
        description:
          "Percentage of queries that resulted in exceptions over the last 24 hours.",
        tiles: 1,
      },
      {
        title: "Recent Exceptions",
        query: `
          SELECT 
            event_time, 
            user, 
            query, 
            exception 
          FROM pragma_sql_log
          WHERE type IN ('ExceptionBeforeStart', 'ExceptionWhileProcessing') 
            AND event_time > DATE('now', '-1 hour')
          ORDER BY event_time DESC 
          LIMIT 10
        `,
        type: "table",
        description: "Last 10 exceptions recorded in the last hour.",
        tiles: 4,
      },
      {
        title: "Exceptions by User",
        query: `
          SELECT user, COUNT(*) AS exception_count 
          FROM pragma_sql_log
          WHERE type IN ('ExceptionBeforeStart', 'ExceptionWhileProcessing') 
            AND event_time > DATE('now', '-1 day')
          GROUP BY user
          ORDER BY exception_count DESC 
          LIMIT 10
        `,
        type: "table",
        description:
          "Top 10 users with the most exceptions in the last 24 hours.",
        tiles: 4,
      },
      {
        title: "Exceptions Over Time",
        query: `
          SELECT 
            strftime('%Y-%m-%d %H:00', event_time) AS hourERROR, 
            COUNT(*) AS exception_count
          FROM pragma_sql_log
          WHERE type IN ('ExceptionBeforeStart', 'ExceptionWhileProcessing') 
            AND event_time > DATE('now', '-1 day')
          GROUP BY hourERROR
          ORDER BY hourERROR
        `,
        type: "chart",
        chartType: "line",
        description: "Count of exceptions recorded over the last 24 hours.",
        chartConfig: {
          indexBy: "hourERROR",
          exception_count: {
            label: "Exception Count",
            color: "hsl(var(--chart-2))",
          },
        },
        tiles: 2,
      },
      {
        title: "Most Common Exceptions",
        query: `
          SELECT exception, COUNT(*) AS count 
          FROM pragma_sql_log
          WHERE type IN ('ExceptionBeforeStart', 'ExceptionWhileProcessing') 
            AND event_time > DATE('now', '-1 day')
          GROUP BY exception
          ORDER BY count DESC 
          LIMIT 10
        `,
        type: "table",
        description: "Top 10 most common exceptions in the last 24 hours.",
        tiles: 2,
      },
    ],
  },
];
