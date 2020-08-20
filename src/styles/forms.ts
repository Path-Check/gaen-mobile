import { ViewStyle, TextStyle, ImageStyle } from "react-native"

import * as Colors from "./colors"
import * as Spacing from "./spacing"
import * as Outlines from "./outlines"
import * as Typography from "./typography"

export const textInputFormField: TextStyle = {
  color: Colors.primaryText,
  backgroundColor: Colors.primaryLightBackground,
  borderRadius: Outlines.baseBorderRadius,
  borderColor: Colors.neutral10,
  borderWidth: Outlines.hairline,
  justifyContent: "center",
  fontSize: Typography.medium,
  paddingTop: Spacing.small,
  paddingRight: Spacing.medium,
  paddingBottom: Spacing.small,
  paddingLeft: Spacing.medium,
  textAlignVertical: "top",
}

export const required: TextStyle = {
  fontSize: Typography.xxSmall,
  color: Colors.primaryText,
  marginTop: Spacing.xxSmall,
}

export const checkboxIcon: ImageStyle = {
  width: 30,
  height: 30,
}

export const checkboxText: TextStyle = {
  ...Typography.mediumFont,
}

export const textInput: TextStyle = {
  ...Typography.primaryTextInput,
  borderRadius: Outlines.baseBorderRadius,
  borderColor: Colors.neutral10,
  borderWidth: Outlines.hairline,
  padding: Spacing.small,
  textAlign: "center",
}

export const inputIndicator: ViewStyle = {
  alignItems: "center",
  borderColor: Colors.neutral75,
  borderWidth: Outlines.thin,
  height: Spacing.large,
  justifyContent: "center",
  marginTop: Spacing.tiny,
  marginRight: Spacing.large,
  width: Spacing.large,
}
