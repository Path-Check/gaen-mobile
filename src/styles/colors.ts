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
export const primary100 = "#4051db"
export const primary110 = "#4754c5"
export const primary125 = "#2434b6"
export const primary150 = "#192591"

// Secondary
export const secondary10 = "#f8f8ff"
export const secondary50 = "#e5e7fa"
export const secondary75 = "#d3d7f8"
export const secondary100 = "#a5affb"

// Accents
export const danger75 = "#ff7d7d"
export const danger100 = "#ff5656"
export const success100 = "#41dca4"
export const warning25 = "#f9edcc"
export const warning50 = "#ffdc6f"
export const warning100 = "#ffc000"

// Gradients
export const gradientPrimary10 = ["#ececff", "#ffffff"]
export const gradientPrimary100 = ["#3a4cd7", "#6979f8"]
export const gradientPrimary100Lighter = "#6979f8"
export const gradientPrimary110 = ["#4051db", "#6e50e4"]
export const gradientNeutral75 = ["#3c475b", "#9ba0aa"]

// Transparent
export const transparent = "rgba(0, 0, 0, 0)"
export const transparentNeutral30 = applyOpacity(neutral30, 0.4)

// Backgrounds
export const primaryLightBackground = white
export const primaryDarkBackround = primary125

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
