import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { SvgXml } from "react-native-svg"

import { Colors } from "../styles"

interface IconButtonProps {
  icon: string
  accessibilityLabel?: string
  size?: number
  onPress?: () => void
  color?: string
}

export const IconButton = ({
  icon,
  accessibilityLabel,
  size,
  color,
  ...otherProps
}: IconButtonProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      accessibilityLabel={accessibilityLabel}
      {...otherProps}
    >
      <SvgXml
        color={color || Colors.icon}
        xml={icon}
        width={size || 24}
        height={size || 24}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
})
