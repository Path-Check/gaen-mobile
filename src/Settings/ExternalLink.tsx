import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, Linking } from "react-native"

import { GlobalText } from "../components"
import { Typography } from "../styles"

interface ExternalLinkProps {
  url: string
  label: string
}

const ExternalLink: FunctionComponent<ExternalLinkProps> = ({ url, label }) => {
  const handleOnPressLink = () => {
    Linking.openURL(url)
  }

  return (
    <TouchableOpacity onPress={handleOnPressLink} accessibilityLabel={label}>
      <GlobalText style={style.externalLinkText}>{label}</GlobalText>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  externalLinkText: {
    ...Typography.anchorLink,
  },
})

export default ExternalLink
