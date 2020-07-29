import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"

import { RTLEnabledText } from "../components/RTLEnabledText"

import { Typography } from "../styles"

interface InfoTextProps {
  title: string
  description: string
}

const InfoText: FunctionComponent<InfoTextProps> = ({ title, description }) => {
  return (
    <>
      <RTLEnabledText style={style.titleContent}>{title}</RTLEnabledText>
      {description && (
        <RTLEnabledText style={style.descriptionContent} testID="description">
          {description}
        </RTLEnabledText>
      )}
    </>
  )
}

export const style = StyleSheet.create({
  titleContent: {
    ...Typography.header2,
    marginVertical: 30,
  },
  descriptionContent: {
    ...Typography.mainContent,
    marginBottom: 20,
  },
})

export default InfoText
