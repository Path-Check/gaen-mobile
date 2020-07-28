import React from "react"
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  View,
  ScrollView,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { RTLEnabledText } from "../components/RTLEnabledText"
import { Button } from "../components/Button"
import { useStatusBarEffect } from "../navigation"

import { Screens } from "../navigation"

import { Images, Icons } from "../assets"
import { Iconography, Spacing, Colors, Typography } from "../styles"

export const ExportIntro = (): JSX.Element => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  useStatusBarEffect("dark-content")

  const handleOnPressNext = () => {
    navigation.navigate(Screens.AffectedUserCodeInput)
  }

  const title = t("export.start_body_bluetooth")
  const body = t("export.start_title_bluetooth")

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={style.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={style.contentContainer}
          style={style.container}
        >
          <View style={style.headerContainer}>
            <View style={style.iconContainerCircle}>
              <SvgXml
                xml={Icons.Heart}
                width={Iconography.small}
                height={Iconography.small}
              />
            </View>

            <RTLEnabledText style={style.header}>{title}</RTLEnabledText>
            <RTLEnabledText style={style.contentText}>{body}</RTLEnabledText>
          </View>

          <Button label={t("common.start")} onPress={handleOnPressNext} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const style = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    padding: Spacing.large,
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingBottom: Spacing.xxHuge,
  },
  headerContainer: {
    marginBottom: Spacing.xxHuge,
  },
  header: {
    ...Typography.header2,
    color: Colors.white,
  },
  iconContainerCircle: {
    ...Iconography.largeIcon,
    backgroundColor: Colors.white,
  },
  contentText: {
    ...Typography.secondaryContent,
    color: Colors.white,
    paddingTop: Spacing.medium,
  },
})

export default ExportIntro
