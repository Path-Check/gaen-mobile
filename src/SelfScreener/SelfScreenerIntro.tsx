import React, { FunctionComponent } from "react"
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { SelfScreenerStackScreens, useStatusBarEffect } from "../navigation"
import { Button, GlobalText, StatusBar } from "../components"
import { useConfigurationContext } from "../ConfigurationContext"

import {
  Colors,
  Iconography,
  Layout,
  Outlines,
  Spacing,
  Typography,
} from "../styles"
import { Images, Icons } from "../assets"

const SelfScreenerIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    emergencyPhoneNumber,
    healthAuthorityName,
  } = useConfigurationContext()

  const handleOnPressStartScreener = () => {
    navigation.navigate(SelfScreenerStackScreens.EmergencySymptomsQuestions)
  }

  const handleOnPressCancel = () => {
    navigation.goBack()
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.cancelButtonContainer}>
          <TouchableOpacity
            onPress={handleOnPressCancel}
            accessible
            accessibilityLabel={t("export.code_input_button_cancel")}
          >
            <View style={style.cancelButtonInnerContainer}>
              <SvgXml
                xml={Icons.X}
                fill={Colors.black}
                width={Iconography.xxSmall}
                height={Iconography.xxSmall}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Image source={Images.SelfScreenerIntro} style={style.image} />
        <GlobalText style={style.headerText}>
          {t("self_screener.intro.covid19_self_screener")}
        </GlobalText>
        <GlobalText style={style.subheaderText}>
          {t("self_screener.intro.find_out_how_to_care")}
        </GlobalText>
        <View style={style.bulletListContainer}>
          <View style={style.bulletRow}>
            <View style={style.bulletContainer}>
              <View style={style.bullet} />
            </View>
            <GlobalText style={style.bulletText}>
              {t("self_screener.intro.this_is_not_intended")}
            </GlobalText>
          </View>
          <View style={style.bulletRow}>
            <View style={style.bulletContainer}>
              <View style={style.bullet} />
            </View>
            <GlobalText style={style.bulletText}>
              {t("self_screener.intro.you_are_a_resident", {
                healthAuthorityName,
              })}
            </GlobalText>
          </View>
          <View style={style.bulletRow}>
            <View style={style.bulletContainer}>
              <View style={style.bullet} />
            </View>
            <GlobalText style={style.bulletText}>
              {t("self_screener.intro.this_is_based_on")}
            </GlobalText>
          </View>
          <View style={style.bulletRow}>
            <View style={style.bulletContainer}>
              <SvgXml
                xml={Icons.EmergencyPlusInCircle}
                fill={Colors.danger100}
                width={Iconography.xxSmall}
                height={Iconography.xxSmall}
              />
            </View>
            <GlobalText style={style.bulletText}>
              {t("self_screener.intro.if_this_is", { emergencyPhoneNumber })}
            </GlobalText>
          </View>
        </View>
        <Button
          onPress={handleOnPressStartScreener}
          label={t("self_screener.intro.agree_and_start_screener")}
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
        />
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: Spacing.xLarge,
  },
  cancelButtonContainer: {
    position: "absolute",
    top: Spacing.medium,
    right: Spacing.medium,
    zIndex: Layout.zLevel1,
  },
  cancelButtonInnerContainer: {
    padding: Spacing.medium,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: Spacing.xxLarge,
  },
  headerText: {
    ...Typography.header2,
    marginBottom: Spacing.xSmall,
  },
  subheaderText: {
    ...Typography.body1,
    marginBottom: Spacing.medium,
  },
  bulletListContainer: {
    marginBottom: Spacing.xxLarge,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.medium,
  },
  bulletContainer: {
    width: Spacing.xSmall,
    alignItems: "center",
  },
  bullet: {
    borderRadius: Outlines.borderRadiusMax,
    backgroundColor: Colors.primary100,
    width: Spacing.xxxSmall,
    height: Spacing.xxxSmall,
  },
  bulletText: {
    ...Typography.body2,
    marginLeft: Spacing.medium,
  },
  button: {
    width: "100%",
  },
  buttonInner: {
    width: "100%",
  },
})

export default SelfScreenerIntro
