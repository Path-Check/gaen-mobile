import { ViewStyle } from "react-native"

export const xSmall = 18
export const small = 30
export const medium = 60
export const large = 70
export const extraLarge = 100

const baseIcon: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

export const xSmallIcon: ViewStyle = {
  ...baseIcon,
  height: xSmall,
  width: xSmall,
}

export const smallIcon: ViewStyle = {
  ...baseIcon,
  height: small,
  width: small,
}

export const largeIcon: ViewStyle = {
  ...baseIcon,
  height: large,
  width: large,
}

export const extraLargeIcon: ViewStyle = {
  ...baseIcon,
  height: extraLarge,
  width: extraLarge,
}
