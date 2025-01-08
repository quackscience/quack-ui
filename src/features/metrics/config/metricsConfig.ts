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
        query: `SELECT version() AS version`,
        type: "card",
        description:
          "Version of the DuckDB server running on the current instance.",
        tiles: 1,
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
];
