import { TextStyle, ViewStyle } from "react-native"
import { StackNavigationOptions } from "@react-navigation/stack"

import * as Colors from "./colors"
import * as Typography from "./typography"

export const headerStyle: ViewStyle = {
  backgroundColor: Colors.primary.shade125,
}

export const headerTitleStyle: TextStyle = {
  ...Typography.style.medium,
  color: Colors.header.text,
  letterSpacing: Typography.letterSpacing.x20,
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
  headerTintColor: Colors.header.text,
  headerTitleAlign: "center",
}

export const headerMinimalOptions: StackNavigationOptions = {
  title: "",
  headerShown: true,
  headerStyle: { shadowColor: Colors.transparent.invisible },
  headerTitleContainerStyle: {
    width: "60%",
    alignItems: "center",
  },
}
