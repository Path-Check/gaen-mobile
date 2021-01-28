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
}
const heightThin: ViewStyle = {
  paddingVertical: Spacing.xSmall,
}

// Primary

type Primary = "base" | "disabled"
const primaryBase: ViewStyle = {
  ...base,
  ...Outlines.lightShadow,
  padding: Spacing.medium,
  borderRadius: Outlines.borderRadiusLarge,
  backgroundColor: Colors.primary.shade100,
  maxWidth: Layout.screenWidth * 0.95,
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

// Thin

type Thin = "base" | "disabled"
const thinBase: ViewStyle = {
  ...primaryBase,
  ...heightThin,
}
const thinDisabled: ViewStyle = {
  ...primaryDisabled,
  ...heightThin,
}
export const thin: Record<Thin, ViewStyle> = {
  base: thinBase,
  disabled: thinDisabled,
}

// Outlined

type Outlined = "base" | "thin"
const outlinedBase: ViewStyle = {
  ...primaryBase,
  elevation: 0,
  shadowOpacity: 0,
  backgroundColor: Colors.transparent.invisible,
  borderColor: Colors.primary.shade100,
  borderWidth: Outlines.hairline,
}
const outlinedThin: ViewStyle = {
  ...outlinedBase,
  ...heightThin,
}
export const outlined: Record<Outlined, ViewStyle> = {
  base: outlinedBase,
  thin: outlinedThin,
}

// Secondary

type Secondary = "base" | "leftIcon"
const secondaryBase: ViewStyle = {
  ...base,
  ...heightThin,
  backgroundColor: Colors.transparent.invisible,
}
const secondaryLeftIcon: ViewStyle = {
  ...secondaryBase,
  maxWidth: 260,
  alignSelf: "center",
  justifyContent: "space-between",
}
export const secondary: Record<Secondary, ViewStyle> = {
  base: secondaryBase,
  leftIcon: secondaryLeftIcon,
}

// Fixed Bottom

type FixedBottom = "base" | "disabled"
const fixedBottomBase: ViewStyle = {
  ...base,
  ...heightThin,
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

// Fixed Bottom Thin

type FixedBottomThin = "base" | "disabled"
const fixedBottomThinBase: ViewStyle = {
  ...fixedBottomBase,
  ...heightThin,
}
const fixedBottomThinDisabled: ViewStyle = {
  ...fixedBottomThinBase,
  backgroundColor: Colors.neutral.shade50,
}
export const fixedBottomThin: Record<FixedBottomThin, ViewStyle> = {
  base: fixedBottomThinBase,
  disabled: fixedBottomThinDisabled,
}

// Card

type Card = "base"
const cardBase: ViewStyle = {
  ...base,
  width: "auto",
  alignSelf: "flex-start",
  paddingVertical: Spacing.xxSmall,
  paddingHorizontal: Spacing.medium,
  borderRadius: Outlines.borderRadiusMax,
  backgroundColor: Colors.neutral.shade10,
}
export const card: Record<Card, ViewStyle> = {
  base: cardBase,
}

// Circle
const circleBase: ViewStyle = {
  height: Spacing.xxLarge,
  width: Spacing.xxLarge,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: Outlines.borderRadiusMax,
  backgroundColor: Colors.secondary.shade50,
}
type Circle = "base"
export const circle: Record<Circle, ViewStyle> = {
  base: circleBase,
}
