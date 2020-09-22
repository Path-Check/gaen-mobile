import { ViewStyle } from "react-native"
import { MessageOptions } from "react-native-flash-message"

import * as Colors from "./colors"
import * as Typography from "./typography"

export const iconBadge: ViewStyle = {
  position: "absolute",
  right: 22,
  top: 3,
  backgroundColor: Colors.warning100,
  borderRadius: 6,
  width: 12,
  height: 12,
  justifyContent: "center",
  alignItems: "center",
}

type FlashMessageOptions = Omit<MessageOptions, "message">

export const flashMessageOptions: FlashMessageOptions = {
  floating: true,
  titleStyle: { ...Typography.header3, color: Colors.black },
}

export const successFlashMessageOptions: FlashMessageOptions = {
  ...flashMessageOptions,
  backgroundColor: Colors.success100,
}

export const errorFlashMessageOptions: FlashMessageOptions = {
  ...flashMessageOptions,
  backgroundColor: Colors.danger75,
}
