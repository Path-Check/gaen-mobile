import { TextStyle, ViewStyle } from "react-native"

import * as Colors from "./colors"
import * as Typography from "./typography"

export const headerStyle: ViewStyle = {
  backgroundColor: Colors.primary125,
}

export const headerTitleStyle: TextStyle = {
  ...Typography.mediumBold,
  color: Colors.headerText,
  letterSpacing: Typography.mediumLetterSpacing,
  textTransform: "uppercase",
}
