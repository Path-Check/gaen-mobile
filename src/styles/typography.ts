import { TextStyle } from "react-native"

import * as Colors from "./colors"

// Font Size
export const xSmall = 13
export const small = 14
export const medium = 16
export const large = 18
export const xLarge = 20
export const xxLarge = 26
export const xxxLarge = 30

// Line Height
export const xSmallLineHeight = 20
export const smallLineHeight = 20
export const mediumLineHeight = 24
export const largeLineHeight = 28
export const xLargeLineHeight = 30
export const xxLargeLineHeight = 32
export const xxxLargeLineHeight = 34

// Letter Spacing
export const baseLetterSpacing = 0.25
export const mediumLetterSpacing = 0.5
export const largeLetterSpacing = 1
export const xLargeLetterSpacing = 3

// Font Weights
export const baseWeight = "400"
export const mediumWeight = "500"
export const semiBoldWeight = "600"
export const boldWeight = "700"

// Font Family
export const baseFontFamily = "IBMPlexSans"
export const mediumFontFamily = "IBMPlexSans-Medium"
export const semiBoldFontFamily = "IBMPlexSans-SemiBold"
export const boldFontFamily = "IBMPlexSans-Bold"
export const monospaceFontFamily = "IBMPlexMono"

export const base: TextStyle = {
  fontFamily: baseFontFamily,
  fontWeight: baseWeight,
  letterSpacing: baseLetterSpacing,
}

export const mediumBold: TextStyle = {
  fontFamily: mediumFontFamily,
  fontWeight: mediumWeight,
  letterSpacing: baseLetterSpacing,
}

export const semiBold: TextStyle = {
  fontFamily: semiBoldFontFamily,
  fontWeight: semiBoldWeight,
  letterSpacing: baseLetterSpacing,
}

export const bold: TextStyle = {
  fontFamily: boldFontFamily,
  fontWeight: boldWeight,
  letterSpacing: baseLetterSpacing,
}

export const monospace: TextStyle = {
  fontFamily: monospaceFontFamily,
  letterSpacing: baseLetterSpacing,
}

// Standard Font Types
export const xSmallFont: TextStyle = {
  ...base,
  fontSize: xSmall,
  lineHeight: xSmallLineHeight,
}

export const smallFont: TextStyle = {
  ...base,
  fontSize: small,
  lineHeight: smallLineHeight,
}

export const mediumFont: TextStyle = {
  ...base,
  fontSize: medium,
  lineHeight: mediumLineHeight,
}

export const largeFont: TextStyle = {
  ...base,
  fontSize: large,
  lineHeight: largeLineHeight,
}

export const xLargeFont: TextStyle = {
  ...base,
  fontSize: xLarge,
  lineHeight: xLargeLineHeight,
}

export const xxLargeFont: TextStyle = {
  ...base,
  fontSize: xxLarge,
  lineHeight: xxLargeLineHeight,
}

export const xxxLargeFont: TextStyle = {
  ...base,
  fontSize: xxxLarge,
  lineHeight: xxxLargeLineHeight,
}

// Headers
export const header1: TextStyle = {
  ...xxxLargeFont,
  ...semiBold,
  color: Colors.text.primary,
}

export const header2: TextStyle = {
  ...xxLargeFont,
  ...mediumBold,
  color: Colors.text.primary,
}

export const header3: TextStyle = {
  ...xLargeFont,
  ...mediumBold,
  color: Colors.text.primary,
}

export const header4: TextStyle = {
  ...largeFont,
  ...mediumBold,
  color: Colors.text.primary,
}

export const header5: TextStyle = {
  ...mediumFont,
  ...semiBold,
  color: Colors.neutral.shade100,
}

export const header6: TextStyle = {
  ...smallFont,
  ...mediumBold,
  letterSpacing: mediumLetterSpacing,
  color: Colors.text.primary,
}

// Content
export const body1: TextStyle = {
  ...mediumFont,
  color: Colors.neutral.shade100,
}

export const body2: TextStyle = {
  ...smallFont,
  color: Colors.neutral.shade100,
}

export const body3: TextStyle = {
  ...xSmallFont,
  color: Colors.neutral.shade100,
}

// Forms
export const formInputLabel: TextStyle = {
  ...smallFont,
  color: Colors.text.primary,
}

export const formInputText: TextStyle = {
  ...mediumFont,
  color: Colors.text.primary,
}

export const error: TextStyle = {
  ...mediumFont,
  ...semiBold,
  color: Colors.accent.danger100,
}

// Tappables
const baseButtonText: TextStyle = {
  ...mediumFont,
  ...semiBold,
}

export const buttonPrimary: TextStyle = {
  ...baseButtonText,
  color: Colors.neutral.white,
}

export const buttonPrimaryDisabled: TextStyle = {
  ...baseButtonText,
  color: Colors.neutral.shade140,
}

export const buttonFixedBottom: TextStyle = {
  ...buttonPrimary,
}

export const buttonSecondary: TextStyle = {
  ...body1,
  ...semiBold,
  color: Colors.primary.shade100,
}

export const tappableListItem: TextStyle = {
  ...body1,
  fontSize: large,
}

export const anchorLink: TextStyle = {
  ...body1,
  color: Colors.text.anchorLink,
  textDecorationLine: "underline",
}
