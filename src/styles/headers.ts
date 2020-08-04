import { TextStyle, ViewStyle } from "react-native"

import * as Colors from "./colors"
import * as Typography from "./typography"

export const headerStyle: ViewStyle = {
  backgroundColor: Colors.headerBackground,
}

export const headerTitleStyle: TextStyle = {
  color: Colors.headerText,
  letterSpacing: Typography.mediumLetterSpacing,
  textTransform: "uppercase",
}
