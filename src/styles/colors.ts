import * as BrandColors from "../configuration/brandColors"

const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16)
  const green = parseInt(hexColor.slice(3, 5), 16)
  const blue = parseInt(hexColor.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

// Neutrals
export const white = "#ffffff"
export const neutral10 = "#e9eaf0"
export const neutral25 = "#d8d8de"
export const neutral30 = "#d6d6da"
export const neutral75 = "#9ba0aa"
export const neutral100 = "#3c475b"
export const neutral110 = "#374357"
export const neutral125 = "#252f42"
export const neutral140 = "#1c2537"
export const black = "#000000"

// Primary
export const primary100 = BrandColors.primary100
export const primary110 = BrandColors.primary110
export const primary125 = BrandColors.primary125
export const primary150 = BrandColors.primary150

// Secondary
export const secondary10 = BrandColors.secondary10
export const secondary50 = BrandColors.secondary50
export const secondary75 = BrandColors.secondary75
export const secondary100 = BrandColors.secondary100

// Accents
export const danger75 = "#ff7d7d"
export const danger100 = "#ff5656"
export const success100 = "#41dca4"
export const warning25 = "#f9edcc"
export const warning50 = "#ffdc6f"
export const warning100 = "#ffc000"

// Backgrounds
export const primaryLightBackground = white
export const primaryDarkBackround = primary125

// Gradients
export const gradient10Dark = "#ececff"
export const gradient10Light = primaryLightBackground
export const gradient10 = [gradient10Dark, gradient10Light]

export const gradient100Dark = BrandColors.gradient100Dark
export const gradient100Light = BrandColors.gradient100Light
export const gradient100 = [gradient100Dark, gradient100Light]

// Transparent
export const transparent = "rgba(0, 0, 0, 0)"
export const transparentNeutral30 = applyOpacity(neutral30, 0.4)

// Headers
export const headerBackground = primary125
export const headerText = white

// Buttons
export const disabledButton = neutral100
export const disabledButtonText = secondary50

// Text
export const primaryText = neutral140
export const anchorLinkText = primary100
export const errorText = danger100
export const placeholderText = neutral75
