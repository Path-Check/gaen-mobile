import React, { FunctionComponent } from "react"
import { View, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"
import { Icons } from "../assets"
import { Typography, Buttons, Iconography, Colors } from "../styles"

interface SectionButtonProps {
  text: string
}

const SectionButton: FunctionComponent<SectionButtonProps> = ({ text }) => {
  return (
    <View style={style.sectionButton}>
      <Text style={style.sectionButtonText}>{text}</Text>
      <SvgXml
        xml={Icons.ChevronRight}
        width={Iconography.xxxSmall}
        height={Iconography.xxxSmall}
        color={Colors.primary.shade110}
      />
    </View>
  )
}

const style = StyleSheet.create({
  sectionButton: {
    ...Buttons.card.base,
  },
  sectionButtonText: {
    ...Typography.button.card,
  },
})

export default SectionButton
