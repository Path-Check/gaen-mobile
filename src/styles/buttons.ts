import { ViewStyle } from "react-native"

import * as Colors from "./colors"
import * as Outlines from "./outlines"
import * as Spacing from "./spacing"
import * as Layout from "./layout"

const base: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "flex-start",
}

// Size
const tiny: ViewStyle = {
  paddingTop: Spacing.xxxSmall,
  paddingBottom: Spacing.xxxSmall + 1,
}

const small: ViewStyle = {
  paddingTop: Spacing.xSmall,
  paddingBottom: Spacing.xSmall + 1,
}

export const medium: ViewStyle = {
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
  backgroundColor: Colors.secondary75,
}

const transparent: ViewStyle = {
  backgroundColor: "transparent",
}

export const primary: ViewStyle = {
  ...base,
  ...large,
  borderRadius: Outlines.borderRadiusMax,
  paddingHorizontal: Spacing.xHuge,
  minWidth: 180,
  maxWidth: Layout.screenWidth * 0.95,
  backgroundColor: Colors.primary100,
}

export const primaryThin: ViewStyle = {
  ...primary,
  ...small,
}

export const primaryDisabled: ViewStyle = {
  ...primary,
  backgroundColor: Colors.neutral50,
}

export const secondary: ViewStyle = {
  ...base,
  ...medium,
  ...transparent,
  paddingHorizontal: Spacing.huge,
}

export const tinyRounded: ViewStyle = {
  ...base,
  ...tiny,
  ...maxCornerRoundness,
  ...tertiaryBlue,
}

export const fixedBottom: ViewStyle = {
  ...base,
  paddingTop: Spacing.medium,
  paddingBottom: Spacing.medium,
  backgroundColor: Colors.primary100,
  width: "100%",
}
