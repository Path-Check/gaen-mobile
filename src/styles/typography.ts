import { TextStyle } from "react-native"

import * as Colors from "./colors"

// Font Size
export const xxxSmall = 10
export const xxSmall = 11
export const xSmall = 12
export const small = 13
export const medium = 15
export const large = 17
export const xLarge = 19
export const xxLarge = 24
export const xxxLarge = 28

// Line Height
export const xxxSmallLineHeight = 10
export const xxSmallLineHeight = 12
export const xSmallLineHeight = 14
export const smallLineHeight = 18
export const mediumLineHeight = 22
export const largeLineHeight = 24
export const xLargeLineHeight = 28
export const xxLargeLineHeight = 32
export const xxxLargeLineHeight = 36

// Letter Spacing
export const baseLetterSpacing = 0.25
export const mediumLetterSpacing = 0.5

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
export const tinyFont: TextStyle = {
  ...base,
  fontSize: xxxSmall,
  lineHeight: xxxSmallLineHeight,
}

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
  ...mediumBold,
  color: Colors.primaryText,
}

export const header2: TextStyle = {
  ...xxLargeFont,
  ...mediumBold,
  color: Colors.primaryText,
}

export const header3: TextStyle = {
  ...xLargeFont,
  ...bold,
  color: Colors.neutral140,
}

export const header4: TextStyle = {
  ...largeFont,
  ...mediumBold,
  color: Colors.neutral140,
}

export const header5: TextStyle = {
  ...mediumFont,
  ...mediumBold,
  color: Colors.primaryText,
}

export const header6: TextStyle = {
  ...xLargeFont,
  ...bold,
  color: Colors.black,
}

// Content
export const mainContent: TextStyle = {
  ...mediumFont,
  color: Colors.neutral140,
}

export const secondaryContent: TextStyle = {
  ...mediumFont,
  ...base,
  color: Colors.neutral140,
}

export const tertiaryContent: TextStyle = {
  ...smallFont,
  color: Colors.primary100,
}

export const description: TextStyle = {
  ...smallFont,
  color: Colors.primaryText,
}

export const label: TextStyle = {
  ...smallFont,
  color: Colors.primaryText,
}

export const error: TextStyle = {
  ...smallFont,
  ...mediumBold,
  color: Colors.danger100,
}

// Forms
export const primaryTextInput: TextStyle = {
  ...xLargeFont,
  ...bold,
  color: Colors.primaryText,
}

export const secondaryTextInput: TextStyle = {
  ...mediumFont,
  color: Colors.primaryText,
}

// Tappables
export const tappableListItem: TextStyle = {
  ...mediumFont,
  color: Colors.primary125,
}

export const link: TextStyle = {
  ...mainContent,
  color: Colors.linkText,
  textDecorationLine: "underline",
}

// Buttons
const baseButtonText: TextStyle = {
  ...largeFont,
  ...semiBold,
}

const buttonTextSmall: TextStyle = {
  ...mediumFont,
}

export const buttonPrimaryText: TextStyle = {
  ...baseButtonText,
  color: Colors.white,
}

export const buttonPrimaryInvertedText: TextStyle = {
  ...baseButtonText,
  color: Colors.primary125,
}

export const buttonPrimaryDisabledText: TextStyle = {
  ...baseButtonText,
  color: Colors.neutral140,
}

export const buttonPrimaryInvertedDisabledText: TextStyle = {
  ...baseButtonText,
  color: Colors.neutral140,
}

export const buttonSecondaryText: TextStyle = {
  ...buttonTextSmall,
  color: Colors.neutral100,
}

export const buttonSecondaryInvertedText: TextStyle = {
  ...buttonTextSmall,
  color: Colors.neutral30,
}
