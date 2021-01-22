import React, { FunctionComponent } from "react"
import { Pressable, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"
import { ModalStackScreens } from "../navigation"

import { Icons } from "../assets"
import {
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../styles"

const CovidDataWebViewLink: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPress = async () => {
    navigation.navigate(ModalStackScreens.CovidDataWebView)
  }

  return (
    <Pressable
      style={style.container}
      onPress={handleOnPress}
      accessibilityLabel={t("home.covid_data")}
    >
      <SvgXml
        xml={Icons.BarGraph}
        fill={Colors.neutral.shade75}
        width={Iconography.xxSmall}
        height={Iconography.xxSmall}
      />

      <View style={style.textContainer}>
        <Text style={style.shareText}>{t("home.covid_data")}</Text>
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

export default CovidDataWebViewLink
