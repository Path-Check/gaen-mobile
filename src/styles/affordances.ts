import { ViewStyle } from "react-native"
import { MessageOptions } from "react-native-flash-message"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import * as Colors from "./colors"
import * as Typography from "./typography"
import * as Outlines from "./outlines"
import * as Spacing from "./spacing"

type FlashMessageOptions = Omit<MessageOptions, "message">

type FlashMessageVariants = {
  successFlashMessageOptions: FlashMessageOptions
  errorFlashMessageOptions: FlashMessageOptions
}

export const useFlashMessageOptions = (): FlashMessageVariants => {
  const insets = useSafeAreaInsets()

  const flashMessageOptions: FlashMessageOptions = {
    titleStyle: { ...Typography.header.x40, color: Colors.neutral.black },
    animationDuration: 100,
    floating: true,
    position: { top: insets.top },
  }

  const successFlashMessageOptions: FlashMessageOptions = {
    ...flashMessageOptions,
    backgroundColor: Colors.accent.success50,
  }

  const errorFlashMessageOptions: FlashMessageOptions = {
    ...flashMessageOptions,
    backgroundColor: Colors.accent.danger75,
  }

  return { successFlashMessageOptions, errorFlashMessageOptions }
}

export const floatingContainer: ViewStyle = {
  ...Outlines.lightShadow,
  backgroundColor: Colors.background.primaryLight,
  borderRadius: Outlines.borderRadiusLarge,
  paddingVertical: Spacing.large,
  paddingHorizontal: Spacing.large,
  marginBottom: Spacing.large,
}

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
