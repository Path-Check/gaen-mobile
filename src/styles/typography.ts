import { TextStyle } from "react-native"

import * as Colors from "./colors"

// Font Size
export const xxxSmall = 11
export const xxSmall = 12
export const xSmall = 13
export const small = 15
export const medium = 17
export const large = 19
export const xLarge = 22
export const xxLarge = 28
export const huge = 52

// Line Height
export const xxSmallLineHeight = 14
export const xSmallLineHeight = 16
export const smallLineHeight = 20
export const mediumLineHeight = 24
export const largeLineHeight = 28
export const xLargeLineHeight = 34
export const xxLargeLineHeight = 38

// Letter Spacing
export const mediumLetterSpacing = 0.5

// Font Weights
export const xLightWeight = "200"
export const lightWeight = "300"
export const baseWeight = "400"
export const heavyWeight = "500"
export const xHeavyWeight = "700"

// Font Family
export const baseFontFamily = "IBMPlexSans"
export const mediumFontFamily = "IBMPlexSans-Medium"
export const boldFontFamily = "IBMPlexSans-Bold"
export const monospaceFontFamily = "IBMPlexMono"

export const base: TextStyle = {
  fontFamily: baseFontFamily,
}

export const mediumBold: TextStyle = {
  fontFamily: mediumFontFamily,
}

export const bold: TextStyle = {
  fontFamily: boldFontFamily,
  fontWeight: heavyWeight,
}

export const extraBold: TextStyle = {
  fontFamily: boldFontFamily,
  fontWeight: xHeavyWeight,
}

export const monospace: TextStyle = {
  fontFamily: monospaceFontFamily,
}

// Standard Font Types
export const tinyFont: TextStyle = {
  ...base,
  fontSize: xxxSmall,
  lineHeight: xxSmallLineHeight,
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

export const hugeFont: TextStyle = {
  ...base,
  fontSize: huge,
  lineHeight: xxLargeLineHeight,
}

// Headers
export const header1: TextStyle = {
  ...hugeFont,
  ...bold,
  color: Colors.primaryHeaderText,
}

export const header2: TextStyle = {
  ...xxLargeFont,
  ...bold,
  color: Colors.primaryHeaderText,
}

export const header3: TextStyle = {
  ...xLargeFont,
  ...bold,
  color: Colors.secondaryHeaderText,
}

export const header4: TextStyle = {
  ...largeFont,
  ...mediumBold,
  color: Colors.secondaryHeaderText,
}

export const header5: TextStyle = {
  ...mediumFont,
  ...mediumBold,
  color: Colors.primaryHeaderText,
}

export const header6: TextStyle = {
  ...xLargeFont,
  ...bold,
  color: Colors.black,
}

// Content
export const mainContent: TextStyle = {
  ...mediumFont,
  color: Colors.secondaryText,
}

export const secondaryContent: TextStyle = {
  ...mediumFont,
  ...base,
  color: Colors.secondaryText,
}

export const tertiaryContent: TextStyle = {
  ...smallFont,
  color: Colors.tertiaryText,
}

export const quaternaryContent: TextStyle = {
  ...smallFont,
  color: Colors.invertedText,
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
  ...bold,
  color: Colors.primaryRed,
}

// Forms
export const primaryTextInput: TextStyle = {
  ...xLargeFont,
  ...extraBold,
  color: Colors.primaryText,
}

export const secondaryTextInput: TextStyle = {
  ...mediumFont,
  color: Colors.primaryText,
}

// Tappables
export const tappableListItem: TextStyle = {
  ...mediumFont,
  color: Colors.primaryViolet,
}

// Buttons
const baseButtonText: TextStyle = {
  ...largeFont,
  ...bold,
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
  color: Colors.primaryViolet,
}

export const buttonPrimaryDisabledText: TextStyle = {
  ...baseButtonText,
  color: Colors.white,
}

export const buttonPrimaryInvertedDisabledText: TextStyle = {
  ...baseButtonText,
  color: Colors.darkestGray,
}

export const buttonSecondaryText: TextStyle = {
  ...buttonTextSmall,
  color: Colors.darkGray,
}

export const buttonSecondaryInvertedText: TextStyle = {
  ...buttonTextSmall,
  color: Colors.lighterGray,
}
