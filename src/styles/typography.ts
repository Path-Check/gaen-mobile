import { TextStyle } from "react-native"

import * as Colors from "./colors"

// Font Size
export const tiny = 11
export const smallest = 12
export const smaller = 13
export const small = 15
export const medium = 17
export const large = 19
export const larger = 22
export const largest = 28
export const huge = 52

// Line Height
export const smallestLineHeight = 14
export const smallerLineHeight = 16
export const smallLineHeight = 20
export const mediumLineHeight = 24
export const largeLineHeight = 28
export const largestLineHeight = 32
export const hugeLineHeight = 50

// Letter Spacing
export const mediumLetterSpacing = 0.5

// Font Weights
export const lighterWeight = "200"
export const lightWeight = "300"
export const baseWeight = "400"
export const heavyWeight = "500"
export const heaviestWeight = "700"

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
  fontWeight: heaviestWeight,
}

export const monospace: TextStyle = {
  fontFamily: monospaceFontFamily,
}

// Standard Font Types
export const tinyFont: TextStyle = {
  ...base,
  fontSize: tiny,
  lineHeight: smallestLineHeight,
}

export const smallerFont: TextStyle = {
  ...base,
  fontSize: smaller,
  lineHeight: smallerLineHeight,
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

export const largerFont: TextStyle = {
  ...base,
  fontSize: larger,
  lineHeight: largeLineHeight,
}

export const largestFont: TextStyle = {
  ...base,
  fontSize: largest,
  lineHeight: largestLineHeight,
}

export const hugeFont: TextStyle = {
  ...base,
  fontSize: huge,
  lineHeight: hugeLineHeight,
}

// Headers
export const header1: TextStyle = {
  ...hugeFont,
  ...bold,
  color: Colors.primaryHeaderText,
}

export const header2: TextStyle = {
  ...largestFont,
  ...bold,
  color: Colors.primaryHeaderText,
}

export const header3: TextStyle = {
  ...largerFont,
  ...bold,
  color: Colors.primaryHeaderText,
}

export const header4: TextStyle = {
  ...smallFont,
  color: Colors.secondaryHeaderText,
}

export const header5: TextStyle = {
  ...mediumFont,
  ...extraBold,
  color: Colors.primaryHeaderText,
}

export const header6: TextStyle = {
  ...largerFont,
  ...bold,
  color: Colors.black,
}

// Content
export const mainContent: TextStyle = {
  ...mediumFont,
  color: Colors.primaryText,
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
  ...largerFont,
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
export const buttonText: TextStyle = {
  ...largeFont,
  ...bold,
}

export const buttonTextDark: TextStyle = {
  ...buttonText,
  color: Colors.primaryViolet,
}

export const buttonTextLight: TextStyle = {
  ...buttonText,
  color: Colors.white,
}

export const buttonTextPrimary: TextStyle = {
  ...buttonText,
  color: Colors.white,
}

export const buttonTextPrimaryDisabled: TextStyle = {
  ...buttonText,
  color: Colors.white,
}

export const buttonTextPrimaryInverted: TextStyle = {
  ...buttonText,
  color: Colors.primaryViolet,
}

export const buttonTextSecondary: TextStyle = {
  ...buttonText,
  color: Colors.darkGray,
}

export const buttonTextSecondaryInverted: TextStyle = {
  ...buttonText,
  color: Colors.white,
}
