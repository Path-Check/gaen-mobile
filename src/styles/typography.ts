import { TextStyle } from "react-native"

import * as Colors from "./colors"
import * as Spacing from "./spacing"

type Size =
  | "x10"
  | "x15"
  | "x20"
  | "x30"
  | "x40"
  | "x50"
  | "x60"
  | "x70"
  | "x80"
export const size: Record<Size, number> = {
  x10: 10,
  x15: 11,
  x20: 13,
  x30: 14,
  x40: 16,
  x50: 18,
  x60: 20,
  x70: 26,
  x80: 30,
}

type LineHeight =
  | "x5"
  | "x10"
  | "x20"
  | "x30"
  | "x40"
  | "x50"
  | "x60"
  | "x70"
  | "x80"
export const lineHeight: Record<LineHeight, number> = {
  x5: 14,
  x10: 18,
  x20: 20,
  x30: 20,
  x40: 24,
  x50: 28,
  x60: 30,
  x70: 32,
  x80: 34,
}

type LetterSpacing = "x10" | "x20" | "x30" | "x40"
export const letterSpacing: Record<LetterSpacing, number> = {
  x10: 0.25,
  x20: 0.5,
  x30: 1,
  x40: 3,
}

type Weight = "base" | "medium" | "semibold" | "bold"
type WeightOptions = "400" | "500" | "600" | "700"
const weight: Record<Weight, WeightOptions> = {
  base: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
}

type Family = "base" | "medium" | "semibold" | "bold" | "monospace"
const family: Record<Family, string> = {
  base: "IBMPlexSans",
  medium: "IBMPlexSans-Medium",
  semibold: "IBMPlexSans-SemiBold",
  bold: "IBMPlexSans-Bold",
  monospace: "IBMPlexMono",
}

type Style = "normal" | "medium" | "semibold" | "bold" | "monospace"
export const style: Record<Style, TextStyle> = {
  normal: {
    fontFamily: family.base,
    fontWeight: weight.base,
    letterSpacing: letterSpacing.x10,
  },
  medium: {
    fontFamily: family.medium,
    fontWeight: weight.medium,
    letterSpacing: letterSpacing.x10,
  },
  semibold: {
    fontFamily: family.semibold,
    fontWeight: weight.semibold,
    letterSpacing: letterSpacing.x10,
  },
  bold: {
    fontFamily: family.bold,
    fontWeight: weight.bold,
    letterSpacing: letterSpacing.x10,
  },
  monospace: {
    fontFamily: family.monospace,
    letterSpacing: letterSpacing.x10,
  },
}

type Base = "x10" | "x20" | "x30" | "x40" | "x50" | "x60" | "x70" | "x80"
export const base: Record<Base, TextStyle> = {
  x10: {
    ...style.normal,
    fontSize: size.x10,
    lineHeight: lineHeight.x10,
    color: Colors.text.primary,
  },
  x20: {
    ...style.normal,
    fontSize: size.x20,
    lineHeight: lineHeight.x20,
    color: Colors.text.primary,
  },
  x30: {
    ...style.normal,
    fontSize: size.x30,
    lineHeight: lineHeight.x30,
    color: Colors.text.primary,
  },
  x40: {
    ...style.normal,
    fontSize: size.x40,
    lineHeight: lineHeight.x40,
    color: Colors.text.primary,
  },
  x50: {
    ...style.normal,
    fontSize: size.x50,
    lineHeight: lineHeight.x50,
    color: Colors.text.primary,
  },
  x60: {
    ...style.normal,
    fontSize: size.x60,
    lineHeight: lineHeight.x60,
    color: Colors.text.primary,
  },
  x70: {
    ...style.normal,
    fontSize: size.x70,
    lineHeight: lineHeight.x70,
    color: Colors.text.primary,
  },
  x80: {
    ...style.normal,
    fontSize: size.x80,
    lineHeight: lineHeight.x80,
    color: Colors.text.primary,
  },
}

type Header = "x10" | "x20" | "x30" | "x40" | "x50" | "x60"
export const header: Record<Header, TextStyle> = {
  x10: {
    ...base.x30,
    ...style.medium,
    letterSpacing: letterSpacing.x20,
  },
  x20: {
    ...base.x40,
    ...style.semibold,
    color: Colors.neutral.shade100,
  },
  x30: {
    ...base.x50,
    ...style.medium,
  },
  x40: {
    ...base.x60,
    ...style.medium,
  },
  x50: {
    ...base.x70,
    ...style.semibold,
  },
  x60: {
    ...base.x80,
    ...style.semibold,
  },
}

type Body = "x10" | "x20" | "x30"
export const body: Record<Body, TextStyle> = {
  x10: {
    ...base.x20,
    color: Colors.neutral.shade100,
  },
  x20: {
    ...base.x30,
    color: Colors.neutral.shade100,
  },
  x30: {
    ...base.x40,
    color: Colors.neutral.shade100,
  },
}

type Form = "inputLabel" | "inputText"
export const form: Record<Form, TextStyle> = {
  inputLabel: {
    ...base.x30,
  },
  inputText: {
    ...base.x40,
  },
}

type Utility = "error"
export const utility: Record<Utility, TextStyle> = {
  error: {
    ...header.x20,
    color: Colors.accent.danger100,
  },
}

const baseButtonText: TextStyle = {
  ...header.x20,
  textAlign: "center",
}
type Button =
  | "primary"
  | "primaryDisabled"
  | "fixedBottom"
  | "fixedBottomDisabled"
  | "secondary"
  | "card"
  | "listItem"
  | "anchorLink"
export const button: Record<Button, TextStyle> = {
  primary: {
    ...baseButtonText,
    color: Colors.neutral.white,
  },
  primaryDisabled: {
    ...baseButtonText,
    color: Colors.neutral.shade140,
  },
  fixedBottom: {
    ...baseButtonText,
    color: Colors.neutral.white,
  },
  fixedBottomDisabled: {
    ...baseButtonText,
    color: Colors.neutral.shade140,
  },
  secondary: {
    ...baseButtonText,
    color: Colors.primary.shade100,
  },
  card: {
    ...body.x20,
    ...style.bold,
    textTransform: "uppercase",
    color: Colors.primary.shade110,
    marginRight: Spacing.xSmall,
  },
  listItem: {
    ...body.x30,
    fontSize: size.x50,
  },
  anchorLink: {
    ...body.x30,
    color: Colors.text.anchorLink,
    textDecorationLine: "underline",
  },
}
