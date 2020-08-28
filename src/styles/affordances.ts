import { ViewStyle } from "react-native"

import * as Colors from "./colors"

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
