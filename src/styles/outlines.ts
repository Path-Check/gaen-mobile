import { ViewStyle } from "react-native"

import * as Colors from "./colors"
import * as Spacing from "./spacing"

export const baseBorderRadius = 8
export const borderRadiusLarge = 16
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

export const baseShadow: ViewStyle = {
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.15,
  shadowRadius: 13.16,
  elevation: 20,
}

export const lightShadow: ViewStyle = {
  ...baseShadow,
  shadowOpacity: 0.2,
  shadowColor: Colors.neutral.shade100,
}

export const separatorLine: ViewStyle = {
  height: hairline,
  backgroundColor: Colors.neutral.shade10,
  marginHorizontal: Spacing.medium,
}
