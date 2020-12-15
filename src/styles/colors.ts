import * as BrandColors from "../../config/brandColors"

const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16)
  const green = parseInt(hexColor.slice(3, 5), 16)
  const blue = parseInt(hexColor.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

type Neutral =
  | "white"
  | "shade5"
  | "shade10"
  | "shade25"
  | "shade30"
  | "shade50"
  | "shade75"
  | "shade100"
  | "shade110"
  | "shade125"
  | "shade140"
  | "black"
export const neutral: Record<Neutral, string> = {
  white: "#ffffff",
  shade5: "#edeef3",
  shade10: "#e9eaf0",
  shade25: "#d8d8de",
  shade30: "#d6d6da",
  shade50: "#c5c5c9",
  shade75: "#9ba0aa",
  shade100: "#3c475b",
  shade110: "#374357",
  shade125: "#252f42",
  shade140: "#1c2537",
  black: "#000000",
}

type Primary = "shade100" | "shade110" | "shade125" | "shade150"
export const primary: Record<Primary, string> = {
  shade100: BrandColors.primary100,
  shade110: BrandColors.primary110,
  shade125: BrandColors.primary125,
  shade150: BrandColors.primary150,
}

type Secondary = "shade10" | "shade50" | "shade75" | "shade100"
export const secondary: Record<Secondary, string> = {
  shade10: BrandColors.secondary10,
  shade50: BrandColors.secondary50,
  shade75: BrandColors.secondary75,
  shade100: BrandColors.secondary100,
}

type Accent =
  | "danger10"
  | "danger25"
  | "danger75"
  | "danger100"
  | "danger150"
  | "success10"
  | "success25"
  | "success50"
  | "success100"
  | "warning25"
  | "warning50"
  | "warning100"
export const accent: Record<Accent, string> = {
  danger10: "fff0f0",
  danger25: "#ffe0e0",
  danger75: "#ff7d7d",
  danger100: "#ff5656",
  danger150: "#c23838",
  success10: "#f2fcf4",
  success25: "#deffe4",
  success50: "#5bd9a2",
  success100: "#24a36c",
  warning25: "#f9edcc",
  warning50: "#ffdc6f",
  warning100: "#cf8321",
}

type Background = "primaryLight" | "primaryDark" | "secondaryLight"
export const background: Record<Background, string> = {
  primaryLight: neutral.white,
  primaryDark: primary.shade125,
  secondaryLight: secondary.shade10,
}

type Transparent = "invisible" | "neutral30"
export const transparent: Record<Transparent, string> = {
  invisible: "rgba(0, 0, 0, 0)",
  neutral30: applyOpacity(neutral.shade30, 0.4),
}

type Header = "background" | "text"
export const header: Record<Header, string> = {
  background: primary.shade125,
  text: neutral.white,
}

type Text = "primary" | "anchorLink" | "error" | "placeholder"
export const text: Record<Text, string> = {
  primary: neutral.shade140,
  anchorLink: primary.shade100,
  error: accent.danger100,
  placeholder: neutral.shade75,
}

type RiskLevel = "low" | "medium" | "high" | "critical" | "unknown" | "extreme"
export const riskLevel: Record<RiskLevel, string> = {
  low: "#1ea652",
  medium: "#a6882d",
  high: "#d16615",
  critical: "#ce0022",
  unknown: neutral.black,
  extreme: "#640014",
}
