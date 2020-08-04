import { ViewStyle } from "react-native"

import * as Colors from "./colors"

export const baseBorderRadius = 8
export const borderRadiusLarge = 20
export const borderRadiusMax = 500

export const hairline = 1
export const thin = 2
export const thick = 3
export const extraThick = 4

export const roundedBorder: ViewStyle = {
  borderWidth: hairline,
  borderRadius: baseBorderRadius,
}

export const ovalBorder: ViewStyle = {
  borderWidth: hairline,
  borderRadius: borderRadiusMax,
}

export const glowShadow: ViewStyle = {
  shadowColor: Colors.darkestGray,
  shadowOpacity: 0.1,
  shadowRadius: 20,
}

export const textInputBorder: ViewStyle = {
  borderWidth: 2,
  borderRadius: 10,
  borderColor: Colors.primaryViolet,
}
