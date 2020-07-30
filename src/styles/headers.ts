import { TextStyle, ViewStyle } from "react-native"

import * as Colors from "./colors"

export const headerStyle: ViewStyle = {
  backgroundColor: Colors.headerBackground,
}

export const headerTitleStyle: TextStyle = {
  color: Colors.headerText,
  textTransform: "uppercase",
}
