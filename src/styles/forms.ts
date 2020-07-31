import { ViewStyle, TextStyle, ImageStyle } from "react-native"

import * as Colors from "./colors"
import * as Spacing from "./spacing"
import * as Outlines from "./outlines"
import * as Typography from "./typography"

export const textInputFormField: TextStyle = {
  flex: 1,
  color: Colors.primaryText,
  backgroundColor: Colors.primaryBackground,
  borderRadius: Outlines.baseBorderRadius,
  borderColor: Colors.formInputBorder,
  borderWidth: Outlines.thin,
  justifyContent: "center",
  fontSize: Typography.medium,
  paddingTop: Spacing.medium,
  paddingRight: Spacing.medium,
  paddingBottom: Spacing.medium,
  paddingLeft: Spacing.medium,
}

export const required: TextStyle = {
  fontSize: Typography.smallest,
  color: Colors.primaryText,
  marginTop: Spacing.xxSmall,
}

export const checkboxIcon: ImageStyle = {
  width: 30,
  height: 30,
}

export const checkboxText: TextStyle = {
  ...Typography.mediumFont,
  color: Colors.invertedText,
}

export const textInput: TextStyle = {
  ...Typography.primaryTextInput,
  ...Outlines.textInputBorder,
  padding: Spacing.small,
  textAlign: "center",
  borderWidth: Outlines.thin,
}

export const inputIndicator: ViewStyle = {
  alignItems: "center",
  borderColor: Colors.radioBorder,
  borderWidth: Outlines.thin,
  height: Spacing.large,
  justifyContent: "center",
  marginTop: Spacing.tiny,
  marginRight: Spacing.large,
  width: Spacing.large,
}
