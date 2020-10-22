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
  backgroundColor: Colors.secondary.shade75,
}

const transparent: ViewStyle = {
  backgroundColor: "transparent",
}

const outlined: ViewStyle = {
  backgroundColor: Colors.transparent.invisible,
  borderColor: Colors.primary.shade100,
  borderWidth: Outlines.hairline,
}

export const primary: ViewStyle = {
  ...base,
  ...large,
  ...Outlines.lightShadow,
  borderRadius: Outlines.borderRadiusMax,
  paddingHorizontal: Spacing.xHuge,
  minWidth: 180,
  maxWidth: Layout.screenWidth * 0.95,
  backgroundColor: Colors.primary.shade100,
}

export const primaryThin: ViewStyle = {
  ...primary,
  ...small,
}

export const primaryOutlined: ViewStyle = {
  ...primary,
  ...outlined,
}

export const primaryThinOutlined: ViewStyle = {
  ...primary,
  ...small,
  ...outlined,
}

export const primaryDisabled: ViewStyle = {
  ...primary,
  backgroundColor: Colors.neutral.shade50,
  shadowOpacity: 0,
  elevation: 0,
}

export const primaryThinDisabled: ViewStyle = {
  ...primaryThin,
  backgroundColor: Colors.neutral.shade50,
  shadowOpacity: 0,
  elevation: 0,
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
  backgroundColor: Colors.primary.shade100,
  width: "100%",
}
