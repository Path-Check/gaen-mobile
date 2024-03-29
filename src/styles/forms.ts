import { ViewStyle, TextStyle } from "react-native"

import * as Colors from "./colors"
import * as Spacing from "./spacing"
import * as Outlines from "./outlines"
import * as Typography from "./typography"

export const textInputFormField: TextStyle = {
  color: Colors.text.primary,
  backgroundColor: Colors.background.primaryLight,
  borderRadius: Outlines.baseBorderRadius,
  borderColor: Colors.neutral.shade10,
  borderWidth: Outlines.hairline,
  justifyContent: "center",
  fontSize: Typography.size.x40,
  paddingTop: Spacing.small,
  paddingRight: Spacing.medium,
  paddingBottom: Spacing.small,
  paddingLeft: Spacing.medium,
  textAlignVertical: "top",
}

export const required: TextStyle = {
  fontSize: Typography.size.x20,
  color: Colors.text.primary,
  marginTop: Spacing.xSmall,
}

export const textInput: TextStyle = {
  ...Typography.form.inputText,
  borderRadius: Outlines.baseBorderRadius,
  borderColor: Colors.neutral.shade100,
  borderWidth: Outlines.hairline,
  paddingTop: Spacing.small - 1,
  paddingBottom: Spacing.small,
  paddingHorizontal: Spacing.small,
}

export const inputIndicator: ViewStyle = {
  alignItems: "center",
  borderColor: Colors.neutral.shade75,
  borderWidth: Outlines.thin,
  height: Spacing.large,
  justifyContent: "center",
  marginTop: Spacing.tiny,
  marginRight: Spacing.large,
  width: Spacing.large,
}

export const radioOrCheckboxContainer: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: Spacing.medium,
  paddingLeft: Spacing.medium,
  marginBottom: Spacing.medium,
  borderRadius: Outlines.baseBorderRadius,
  borderColor: Colors.secondary.shade100,
  borderWidth: Outlines.hairline,
  backgroundColor: Colors.neutral.white,
}

export const radioOrCheckboxText: TextStyle = {
  ...Typography.body.x30,
  ...Typography.base.x50,
  color: Colors.text.primary,
  width: "80%",
  marginLeft: Spacing.medium,
}
