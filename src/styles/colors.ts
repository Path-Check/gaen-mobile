const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16)
  const green = parseInt(hexColor.slice(3, 5), 16)
  const blue = parseInt(hexColor.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

// Black and White
export const black = "#000000"
export const white = "#ffffff"

// Grays
export const faintGray = "#f8f8f8"
export const lightestGray = "#ededed"
export const lighterGray = "#d3d3d3"
export const lightGray = "#999999"
export const mediumGray = "#606060"
export const gray = "#333333"
export const darkGray = "#4e4e4e"
export const darkestGray = "#2e2e2e"
export const steelGray = "#9BA0AA"

// Reds
const red = "#eb0000"
const emergencyRed = "#D00000"

export const primaryRed = red
export const secondaryRed = emergencyRed

// Blues
const royalBlue = "#4051db"
const cornflowerBlue = "#5061e6"

export const primaryBlue = royalBlue
export const secondaryBlue = cornflowerBlue

// Greens
const shamrockGreen = "#41dca4"

export const primaryGreen = shamrockGreen

// Yellows
const amberYellow = "#ffcc00"
const champagneYellow = "#f9edcc"

export const primaryYellow = amberYellow
export const secondaryYellow = champagneYellow

// Violets
const jacksonsPurple = "#1f2c9b"
const vibrantViolet = "#6e50e4"
const melrose = "#a5affb"
const moonRaker = "#e5e7fa"
const faintViolet = "#f0edf4"

export const primaryViolet = jacksonsPurple
export const secondaryViolet = vibrantViolet
export const tertiaryViolet = moonRaker
export const quaternaryViolet = melrose

// Transparent
export const transparent = "rgba(0, 0, 0, 0)"
export const transparentDarkGray = applyOpacity(lighterGray, 0.8)
export const transparentDark = "rgba(0,0,0,0.7)"

// Backgrounds
export const primaryBackground = faintViolet
export const secondaryBackground = moonRaker
export const tertiaryBackground = lighterGray

export const invertedPrimaryBackground = primaryBlue
export const invertedSecondaryBackground = secondaryBlue

// Underlays
export const underlayPrimaryBackground = moonRaker

// Borders
export const primaryBorder = primaryViolet
export const secondaryBorder = lighterGray
export const radioBorder = lightGray

// Headers
export const headerBackground = primaryViolet
export const headerText = white

// Icons
export const icon = mediumGray

// Buttons
export const disabledButton = darkGray
export const disabledButtonText = quaternaryViolet

// Text
export const primaryText = darkestGray
export const secondaryText = darkGray
export const tertiaryText = secondaryBlue
export const invertedText = white

export const primaryHeaderText = black
export const secondaryHeaderText = secondaryViolet

export const linkText = primaryViolet
export const invertedLinkText = amberYellow
export const errorText = primaryRed

// Forms
export const formInputBorder = tertiaryBackground
export const placeholderTextColor = lightGray

export const success = primaryGreen
export const warning = primaryYellow

