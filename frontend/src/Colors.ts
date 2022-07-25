export enum Light
{
  BACKGROUND = "#f5f0f0",
  GRAPH_TICKS = "#cccccc",
  TICKS_LABELS = "#0"
}

export enum Dark
{
  BACKGROUND = "#343a40",
  GRAPH_TICKS = "#495057",
  TICKS_LABELS = "#ced4da"
}

export type ColorTheme = typeof Dark | typeof Light;
