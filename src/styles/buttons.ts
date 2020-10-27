import { ViewStyle } from "react-native"

import * as Colors from "./colors"
import * as Outlines from "./outlines"
import * as Spacing from "./spacing"
import * as Layout from "./layout"

const base: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  maxWidth: Layout.screenWidth * 0.95,
}

type Primary = "base" | "disabled"
const primaryBase: ViewStyle = {
  ...base,
  ...Outlines.lightShadow,
  paddingVertical: Spacing.large,
  borderRadius: Outlines.borderRadiusMax,
  backgroundColor: Colors.primary.shade100,
}
const primaryDisabled: ViewStyle = {
  ...primaryBase,
  shadowOpacity: 0,
  elevation: 0,
  backgroundColor: Colors.neutral.shade50,
}
export const primary: Record<Primary, ViewStyle> = {
  base: primaryBase,
  disabled: primaryDisabled,
}

type Thin = "base" | "disabled"
const thinBase: ViewStyle = {
  ...primaryBase,
  paddingVertical: Spacing.medium,
}
const thinDisabled: ViewStyle = {
  ...primaryDisabled,
  ...thinBase,
}
export const thin: Record<Thin, ViewStyle> = {
  base: thinBase,
  disabled: thinDisabled,
}

type Outlined = "base" | "thin"
const outlinedBase: ViewStyle = {
  ...primaryBase,
  backgroundColor: Colors.transparent.invisible,
  borderColor: Colors.primary.shade100,
  borderWidth: Outlines.hairline,
}
const outlinedThin: ViewStyle = {
  ...outlinedBase,
  ...thinBase,
}
export const outlined: Record<Outlined, ViewStyle> = {
  base: outlinedBase,
  thin: outlinedThin,
}

type Secondary = "base"
const secondaryBase: ViewStyle = {
  ...base,
  paddingVertical: Spacing.medium,
  backgroundColor: Colors.transparent.invisible,
}
export const secondary: Record<Secondary, ViewStyle> = {
  base: secondaryBase,
}

type Card = "base"
const cardBase: ViewStyle = {
  ...base,
  alignSelf: "flex-start",
  paddingVertical: Spacing.xxSmall,
  paddingHorizontal: Spacing.medium,
  borderRadius: Outlines.borderRadiusMax,
  backgroundColor: Colors.neutral.shade10,
}
export const card: Record<Card, ViewStyle> = {
  base: cardBase,
}

type FixedBottom = "base" | "disabled"
const fixedBottomBase: ViewStyle = {
  ...base,
  paddingVertical: Spacing.medium,
  backgroundColor: Colors.primary.shade100,
}
const fixedBottomDisabled: ViewStyle = {
  ...fixedBottomBase,
  backgroundColor: Colors.neutral.shade50,
}
export const fixedBottom: Record<FixedBottom, ViewStyle> = {
  base: fixedBottomBase,
  disabled: fixedBottomDisabled,
}

type FixedBottomThin = "base" | "disabled"
const fixedBottomThinBase: ViewStyle = {
  ...fixedBottomBase,
  paddingVertical: Spacing.small,
}
const fixedBottomThinDisabled: ViewStyle = {
  ...fixedBottomThinBase,
  backgroundColor: Colors.neutral.shade50,
}
export const fixedBottomThin: Record<FixedBottomThin, ViewStyle> = {
  base: fixedBottomThinBase,
  disabled: fixedBottomThinDisabled,
}
