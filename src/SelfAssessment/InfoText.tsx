import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"

import { GlobalText } from "../components/GlobalText"

import { Typography } from "../styles"

interface InfoTextProps {
  title: string
  description: string
}

const InfoText: FunctionComponent<InfoTextProps> = ({ title, description }) => {
  return (
    <>
      <GlobalText style={style.titleContent}>{title}</GlobalText>
      {description && (
        <GlobalText style={style.descriptionContent} testID="description">
          {description}
        </GlobalText>
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
