export type ThemeId =
  | "rosewood"
  | "teal-fresh"
  | "royal-purple"
  | "emerald"
  | "midnight-gold";

export interface Theme {
  id: ThemeId;
  name: string;
  swatches: string[];
}

export const THEMES: Theme[] = [
  {
    id: "rosewood",
    name: "Rosewood",
    swatches: ["#4C3436", "#3C2E2E", "#C38683", "#B38871"],
  },
  {
    id: "teal-fresh",
    name: "Teal Fresh",
    swatches: ["#0F4C4C", "#0A3333", "#7FB5A8", "#D9C7A7"],
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    swatches: ["#3B2340", "#2A1830", "#B79FD1", "#D8C29A"],
  },
  {
    id: "emerald",
    name: "Emerald",
    swatches: ["#123B2A", "#0C2A1E", "#8FB996", "#D9C7A7"],
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    swatches: ["#17151A", "#211E26", "#C9A227", "#E8D9A0"],
  },
];

export const DEFAULT_THEME: ThemeId = "teal-fresh";

export function isThemeId(value: unknown): value is ThemeId {
  return (
    typeof value === "string" && THEMES.some((theme) => theme.id === value)
  );
}
