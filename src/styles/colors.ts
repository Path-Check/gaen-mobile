const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16)
  const green = parseInt(hexColor.slice(3, 5), 16)
  const blue = parseInt(hexColor.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

// Black and White
export const black = "#000000"
export const white = "#ffffff"

// Neutrals
export const neutral10 = "#e9eaf0"
export const neutral25 = "#d8d8de"
export const neutral30 = "#d6d6da"
export const neutral75 = "#9ba0aa"
export const neutral100 = "#3c475b"
export const neutral110 = "#374357"
export const neutral125 = "#252f42"
export const neutral140 = "#1c2537"

// Primary
export const primary100 = "#4051db"
export const primary110 = "#4754c5"
export const primary125 = "#2434b6"
export const primary150 = "#192591"

// Secondary
export const secondary10 = "#f8f8ff"
export const secondary50 = "#e5e7fa"
export const secondary175 = "#d3d7f8"
export const secondary200 = "#a5affb"

// Accents
export const danger75 = "#ff7d7d"
export const danger100 = "#ff5656"
export const success100 = "#41dca4"
export const warning25 = "#f9edcc"
export const warning50 = "#f8f8ff"
export const warning100 = "#e5e7fa"

// Transparent
export const transparent = "rgba(0, 0, 0, 0)"
export const transparentNeutral30 = applyOpacity(neutral30, 0.8)

// Backgrounds
export const primaryLightBackground = white

export const invertedPrimaryBackground = primary125
export const invertedSecondaryBackground = primary100

// Underlays
export const underlayPrimaryBackground = secondary175

// Borders
export const primaryBorder = primary125
export const secondaryBorder = neutral30
export const radioBorder = neutral75

// Headers
export const headerBackground = primary125
export const headerText = white

// Icons
export const icon = neutral100

// Buttons
export const disabledButton = neutral100
export const disabledButtonText = secondary175

// Text
export const primaryText = black
export const secondaryText = neutral100
export const tertiaryText = primary100
export const invertedText = white

export const primaryHeaderText = black
export const secondaryHeaderText = neutral140

export const linkText = primary125
export const invertedLinkText = warning100
export const errorText = danger100

// Forms
export const formInputBorder = neutral10
export const placeholderTextColor = neutral75
