import { TextStyle, ViewStyle } from "react-native"
import { StackNavigationOptions } from "@react-navigation/stack"

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

export const headerScreenOptions: StackNavigationOptions = {
  headerStyle: {
    ...headerStyle,
  },
  headerTitleStyle: {
    ...headerTitleStyle,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.headerText,
  headerTitleAlign: "center",
}

export const headerMinimalOptions: StackNavigationOptions = {
  title: "",
  headerShown: true,
  headerStyle: { shadowColor: Colors.transparent },
}
