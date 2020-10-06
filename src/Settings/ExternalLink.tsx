import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, Linking } from "react-native"

import { Text } from "../components"
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
      <Text style={style.externalLinkText}>{label}</Text>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  externalLinkText: {
    ...Typography.anchorLink,
  },
})

export default ExternalLink
