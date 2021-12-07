import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { Icons } from "../../assets"
import { SvgXml } from "react-native-svg"
import { Linking, Pressable, View, StyleSheet } from "react-native"

import { Text } from "../Text"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../../styles"

type Props = {
  icon: string
  label: string
  link: string
}

const ExternalLink: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation()

  const { icon, label, link } = props

  const handleOnPress = async () => {
    Linking.openURL(link)
  }

  return (
    <Pressable
      style={style.container}
      onPress={handleOnPress}
      accessibilityLabel={t(label)}
    >
      <SvgXml
        xml={icon}
        fill={Colors.primary.shade125}
        width={Iconography.xxxSmall}
        height={Iconography.xxxSmall}
      />

      <View style={style.textContainer}>
        <Text style={style.shareText}>{t(label)}</Text>
      </View>
      <SvgXml
        xml={Icons.ChevronRight}
        fill={Colors.neutral.shade75}
        width={Iconography.xxSmall}
        height={Iconography.xxSmall}
      />
    </Pressable>
  )
}

const style = StyleSheet.create({
  container: {
    ...Affordances.floatingContainer,
    paddingVertical: Spacing.small,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.primary.shade100,
    borderWidth: Outlines.thin,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  shareText: {
    ...Typography.body.x30,
    ...Typography.style.medium,
    color: Colors.text.primary,
  },
})

export { ExternalLink }
