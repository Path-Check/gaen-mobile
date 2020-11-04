import React, { FunctionComponent } from "react"
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { useStatusBarEffect, AffectedUserFlowStackScreens } from "../navigation"
import { Text } from "../components"

import { Spacing, Colors, Typography, Buttons } from "../styles"
import { Icons, Images } from "../assets"

export const ExportIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressNext = () => {
    navigation.navigate(AffectedUserFlowStackScreens.AffectedUserCodeInput)
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <Image
          source={Images.HowItWorksValueProposition}
          style={style.image}
          accessible
          accessibilityLabel={t("export.person_and_health_expert")}
        />
        <Text style={style.header}>{t("export.start_header_bluetooth")}</Text>
      </View>
      <TouchableOpacity
        style={style.button}
        onPress={handleOnPressNext}
        accessibilityLabel={t("common.start")}
      >
        <Text style={style.buttonText}>{t("common.start")}</Text>
        <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
      </TouchableOpacity>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.massive,
    backgroundColor: Colors.background.primaryLight,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: Spacing.small,
  },
  header: {
    ...Typography.header.x60,
    marginBottom: Spacing.xLarge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
})

export default ExportIntro
