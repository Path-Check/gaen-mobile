import { ViewStyle } from "react-native"
import { MessageOptions } from "react-native-flash-message"

import * as Colors from "./colors"
import * as Typography from "./typography"
import * as Outlines from "./outlines"
import * as Spacing from "./spacing"

export const iconBadge: ViewStyle = {
  position: "absolute",
  right: 22,
  top: 3,
  backgroundColor: Colors.accent.warning100,
  borderRadius: 6,
  width: 12,
  height: 12,
  justifyContent: "center",
  alignItems: "center",
}

type FlashMessageOptions = Omit<MessageOptions, "message">

export const flashMessageOptions: FlashMessageOptions = {
  titleStyle: { ...Typography.header3, color: Colors.neutral.black },
  animationDuration: 100,
  floating: true,
  position: { top: Spacing.huge },
}

export const successFlashMessageOptions: FlashMessageOptions = {
  ...flashMessageOptions,
  backgroundColor: Colors.accent.success50,
}

export const errorFlashMessageOptions: FlashMessageOptions = {
  ...flashMessageOptions,
  backgroundColor: Colors.accent.danger75,
}

export const floatingContainer: ViewStyle = {
  ...Outlines.lightShadow,
  backgroundColor: Colors.background.primaryLight,
  borderRadius: Outlines.borderRadiusLarge,
  paddingVertical: Spacing.medium,
  paddingHorizontal: Spacing.large,
  marginBottom: Spacing.large,
}
