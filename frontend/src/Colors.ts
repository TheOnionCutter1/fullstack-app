export enum Light
{
  BACKGROUND = "#f5f0f0",
  GRAPH_TICKS = "cccccc"
}

export enum Dark
{
  BACKGROUND = "#343a40",
  GRAPH_TICKS = "#868e96"
}

export type ColorTheme = typeof Dark | typeof Light;
