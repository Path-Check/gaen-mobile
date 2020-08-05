import { ViewStyle } from "react-native"

import * as Colors from "./colors"
import * as Outlines from "./outlines"
import * as Spacing from "./spacing"

const base: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: Outlines.borderRadiusMax,
}

// Size
const tiny: ViewStyle = {
  paddingTop: Spacing.xxxSmall,
  paddingBottom: Spacing.xxxSmall + 1,
}

const medium: ViewStyle = {
  paddingTop: Spacing.small,
  paddingBottom: Spacing.small + 1,
}

const large: ViewStyle = {
  paddingTop: Spacing.large,
  paddingBottom: Spacing.large + 1,
}

// Borders
const maxCornerRoundness: ViewStyle = {
  borderRadius: Outlines.borderRadiusMax,
}

// Color
const tertiaryBlue: ViewStyle = {
  backgroundColor: Colors.tertiaryViolet,
}

const transparent: ViewStyle = {
  backgroundColor: "transparent",
}

export const primary: ViewStyle = {
  ...base,
  ...large,
}

export const secondary: ViewStyle = {
  ...base,
  ...medium,
  ...transparent,
}

export const tinyRounded: ViewStyle = {
  ...base,
  ...tiny,
  ...maxCornerRoundness,
  ...tertiaryBlue,
}
