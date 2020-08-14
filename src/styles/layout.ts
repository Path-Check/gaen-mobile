import { Dimensions } from "react-native"

import * as Spacing from "./spacing"

export const screenWidth = Dimensions.get("window").width
export const screenHeight = Dimensions.get("window").height

export const halfWidth = 0.5 * screenWidth

export const oneTenthHeight = 0.1 * screenHeight
export const oneEighthHeight = 0.125 * screenHeight
export const halfHeight = 0.5 * screenHeight

export const tappableHeight = 0.1 * screenHeight

export const headerHeight = tappableHeight + Spacing.xSmall

// zIndex
export const zLevel1 = 1
export const zLevel2 = 2
export const zLevel3 = 3
