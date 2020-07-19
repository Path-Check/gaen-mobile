import React from "react"
import { StyleSheet } from "react-native"

import { RTLEnabledText } from "../components/RTLEnabledText"

export const InfoText = ({
  titleStyle,
  descriptionStyle,
  useTitleStyle,
  useDescriptionStyle,
  title,
  description,
}) => {
  return (
    <>
      <RTLEnabledText
        use={useTitleStyle}
        style={[styles.headingSpacing, titleStyle]}
      >
        {title}
      </RTLEnabledText>
      {description && (
        <RTLEnabledText
          use={useDescriptionStyle}
          style={[styles.description, descriptionStyle]}
          testID="description"
        >
          {description}
        </RTLEnabledText>
      )}
    </>
  )
}

export const styles = StyleSheet.create({
  headingSpacing: {
    marginVertical: 30,
  },
  description: {
    marginBottom: 20,
  },
})
