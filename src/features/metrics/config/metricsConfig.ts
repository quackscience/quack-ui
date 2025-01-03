//ignore TS check
// @ts-nocheck

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
  chartConfig?: ChartConfig;
  tiles?: number;
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
        query: `SELECT 1`,
        type: "card",
        description:
          "Total time the server has been running in seconds, minutes, hours, and days.",
        tiles: 1,
      },
      {
        title: "Total Databases",
        query: `
          SELECT count(database) as total_databases FROM (SHOW ALL TABLES)
        `,
        type: "card",
        description: "Total number of databases excluding system databases.",
        tiles: 1,
      },
      {
        title: "Total Tables",
        query: `
          SELECT count(name) as total_tables FROM (SHOW ALL TABLES);
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
        query: `SELECT count(name) as total_tables FROM (SHOW ALL TABLES);`,
        type: "card",
        description: "Total number of user-defined tables.",
        tiles: 1,
      },
      {
        title: "Total System Tables",
        query: `SELECT count(name) as total_tables FROM (SHOW ALL TABLES);`,
        type: "card",
        description: "Total number of system tables.",
        tiles: 1,
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
        title: "Queries Per Second (QPS)",
        query: `SELECT 0`,
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
    ],
  },
  {
    title: "Performance",
    scope: "performance",
    description: "Performance-related metrics.",
    icon: CpuIcon,
    items: [
      {
        title: "CPU Usage",
        query: `
          SELECT 0
        `,
        type: "chart",
        chartType: "line",
        description: "CPU usage over the last hour.",
        chartConfig: {
          indexBy: "minute",
          cpu_usage: {
            label: "CPU Usage",
            color: "hsl(var(--chart-5))",
          },
        },
        tiles: 2,
      },
    ],
  },
];
