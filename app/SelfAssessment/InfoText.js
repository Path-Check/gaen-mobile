import React from "react"
import { StyleSheet } from "react-native"

import { RTLEnabledText } from "../components/RTLEnabledText"

import { Typography } from "../styles"

export const InfoText = ({ title, description }) => {
  return (
    <>
      <RTLEnabledText style={styles.titleContent}>{title}</RTLEnabledText>
      {description && (
        <RTLEnabledText style={styles.descriptionContent} testID="description">
          {description}
        </RTLEnabledText>
      )}
    </>
  )
}

export const styles = StyleSheet.create({
  titleContent: {
    ...Typography.header2,
    marginVertical: 30,
  },
  descriptionContent: {
    ...Typography.mainContent,
    marginBottom: 20,
  },
})
