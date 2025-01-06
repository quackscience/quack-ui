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
    description: "Overview of ClickHouse metrics.",
    icon: HomeIcon,
    items: [
      {
        title: "Server Uptime (days)",
        query: `
        -- set max decimal places to 2

          SELECT 
            ROUND(uptime() / 86400, 2) AS uptime_days
        `,
        type: "card",
        description:
          "Total time the server has been running in seconds, minutes, hours, and days.",
        tiles: 1,
      },
      {
        title: "Total Databases",
        query: `
          SELECT COUNT(*) AS total_databases 
          FROM system.databases 
          WHERE name NOT IN ('system', 'information_schema')
        `,
        type: "card",
        description: "Total number of databases excluding system databases.",
        tiles: 1,
      },
      {
        title: "Total Tables",
        query: `
          SELECT COUNT(*) AS total_tables 
          FROM system.tables 
          WHERE database NOT IN ('system', 'information_schema') 
        `,
        type: "card",
        description: "Total number of user tables excluding temporary tables.",
        tiles: 1,
      },
      {
        title: "Version",
        query: `SELECT version() AS version`,
        type: "card",
        description:
          "Version of the ClickHouse server running on the current instance.",
        tiles: 1,
      },
      {
        title: "Running Queries",
        query: `SELECT 1`,
        type: "table",
        description: "Currently running queries excluding system queries.",
        tiles: 4,
      },
      {
        title: "Daily Query Count",
        description: "Number of queries per day for the last 30 days.",
        type: "chart",
        chartType: "bar",
        query: `
          SELECT 1
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
        query: `SELECT COUNT(*) AS total_tables FROM system.tables WHERE lower(database) NOT IN ('system', 'information_schema')`,
        type: "card",
        description: "Total number of user-defined tables.",
        tiles: 1,
      },
      {
        title: "Total System Tables",
        query: `SELECT COUNT(*) AS total_tables FROM system.tables WHERE lower(database) IN ('system', 'information_schema')`,
        type: "card",
        description: "Total number of system tables.",
        tiles: 1,
      },
      {
        title: "Total Temporary Tables",
        query: `SELECT COUNT(*) AS total_tables FROM system.tables WHERE is_temporary = 1`,
        type: "card",
        description: "Total number of temporary tables.",
        tiles: 1,
      },
      // card
      {
        title: "Biggest Table",
        query: `SELECT name AS table FROM system.tables WHERE database NOT IN ('system', 'information_schema') ORDER BY total_bytes DESC LIMIT 1`,
        type: "card",
        description: "Largest table in the system.",
        tiles: 1,
      },
      {
        title: "Table Cardinality",
        query: `SELECT database, name AS table, total_rows FROM system.tables WHERE database NOT IN ('system', 'information_schema') ORDER BY total_rows DESC LIMIT 10`,
        type: "table",
        description: "Number of rows in the top 10 tables.",
        tiles: 2,
      },
      {
        title: "Table Row Counts",
        query: `SELECT database, name AS table, total_rows FROM system.tables WHERE database NOT IN ('system', 'information_schema') ORDER BY total_rows DESC LIMIT 10`,
        type: "table",
        description: "Number of rows in the top 10 tables.",
        tiles: 2,
      },
      {
        title: "Table Sizes (MB)",
        query: `SELECT name AS name, total_bytes / 1024 / 1024 AS total_mb FROM system.tables WHERE database NOT IN ('system', 'information_schema') ORDER BY total_mb DESC LIMIT 20`,
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
    ],
  },
  {
    title: "Storage",
    scope: "storage",
    description: "Storage-related metrics.",
    icon: HardDriveIcon,
    items: [
      {
        title: "Disk Usage",
        query: `SELECT 
                  name,
                  round(total_space / 1024 / 1024 / 1024, 2) AS total_gb,
                  round(free_space / 1024 / 1024 / 1024, 2) AS free_gb,
                  round((1 - free_space / total_space) * 100, 2) AS used_percent
                FROM system.disks`,
        type: "table",
        description: "Detailed disk usage information.",
      },
      {
        title: "Database Sizes",
        query: `SELECT 
                  database,
                  round(sum(total_bytes) / 1024 / 1024 / 1024, 2) AS size_gb
                FROM system.tables
                GROUP BY database
                ORDER BY size_gb DESC`,
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
];
