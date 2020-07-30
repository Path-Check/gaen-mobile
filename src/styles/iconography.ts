import { ViewStyle, TextStyle } from "react-native"

import * as Colors from "./colors"
import * as Spacing from "./spacing"
import * as Typography from "./typography"

export const xSmall = 18
export const small = 30
export const large = 70
export const extraLarge = 100

const baseIcon: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

export const xSmallIcon: ViewStyle = {
  ...baseIcon,
  height: xSmall,
  width: xSmall,
  borderRadius: 100,
}

export const smallIcon: ViewStyle = {
  ...baseIcon,
  height: small,
  width: small,
  borderRadius: 100,
  marginVertical: Spacing.small,
}

export const largeIcon: ViewStyle = {
  ...baseIcon,
  height: large,
  width: large,
  borderRadius: large,
  marginVertical: Spacing.large,
}

export const extraLargeIcon: ViewStyle = {
  ...baseIcon,
  height: extraLarge,
  width: extraLarge,
  borderRadius: extraLarge,
  marginVertical: Spacing.large,
}

export const largeBlueIcon: ViewStyle = {
  ...largeIcon,
  backgroundColor: Colors.tertiaryViolet,
}

export const largeGoldIcon: ViewStyle = {
  ...largeIcon,
  backgroundColor: Colors.secondaryYellow,
}

// Exposure History
export const possibleExposure: ViewStyle = {
  backgroundColor: Colors.primaryBlue,
  borderColor: Colors.primaryBlue,
}

export const expectedExposure: ViewStyle = {
  backgroundColor: Colors.primaryYellow,
  borderColor: Colors.primaryYellow,
}

export const possibleExposureText: TextStyle = {
  ...Typography.bold,
  color: Colors.white,
}

export const expectedExposureText: TextStyle = {
  ...Typography.bold,
  color: Colors.darkestGray,
}

export const noExposureText: TextStyle = {
  ...Typography.bold,
  color: Colors.primaryViolet,
}

export const todayText: TextStyle = {
  ...Typography.smallFont,
  ...Typography.bold,
  color: Colors.primaryViolet,
}
