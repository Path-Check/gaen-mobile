import React, { FunctionComponent } from "react"
import { StyleSheet, View, Image, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { Text, Button } from "../components"
import { useStatusBarEffect, AffectedUserFlowStackScreens } from "../navigation"

import { Spacing, Colors, Typography } from "../styles"
import { Images } from "../assets"

export const ExportIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
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
      <View style={style.buttonContainer}>
        <Button
          label={t("common.start")}
          onPress={handleOnPressNext}
          hasRightArrow
        />
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.huge,
    paddingBottom: Spacing.massive,
    backgroundColor: Colors.primaryLightBackground,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: Spacing.small,
    resizeMode: "contain",
  },
  header: {
    ...Typography.header1,
    marginBottom: Spacing.xLarge,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
})

export default ExportIntro
