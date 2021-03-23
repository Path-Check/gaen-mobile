import React, { FunctionComponent } from "react"
import { Linking, Pressable, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import env from "react-native-config"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"

import { Icons } from "../assets"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../styles"

const FaqButton: FunctionComponent = () => {
  const { t } = useTranslation()

  const handleOnPress = async () => {
    Linking.openURL(env.VERIFICATION_CODE_INFO_URL)
  }

  return (
    <Pressable
      style={style.container}
      onPress={handleOnPress}
      accessibilityLabel={t("home.covid_data")}
    >
      <SvgXml
        xml={Icons.QuestionMark}
        fill={Colors.primary.shade125}
        width={Iconography.xxxSmall}
        height={Iconography.xxxSmall}
      />

      <View style={style.textContainer}>
        <Text style={style.shareText}>{t("home.view_faq")}</Text>
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

export default FaqButton
