import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  ImageSourcePropType,
} from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "../components"
import { useApplicationName } from "../hooks/useApplicationInfo"

import { Typography, Spacing, Colors } from "../styles"
import { Images } from "../assets"
import { useStatusBarEffect } from "../navigation"

const ProtectPrivacy: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()

  return (
    <View style={style.container}>
      <ScrollView contentContainerStyle={style.mainContentContainer}>
        <Section
          image={Images.ProtectPrivacyTop}
          subheaderText={t("onboarding.protect_privacy.subheader_1")}
          bodyText={t("onboarding.protect_privacy.body_1")}
        />
        <Section
          image={Images.ProtectPrivacyExchangeKeys}
          subheaderText={t("onboarding.protect_privacy.subheader_2")}
          bodyText={t("onboarding.protect_privacy.body_2", { applicationName })}
        />
        <Section
          image={Images.ProtectPrivacySubmitKeys}
          subheaderText={t("onboarding.protect_privacy.subheader_3")}
          bodyText={t("onboarding.protect_privacy.body_3", {
            applicationName,
          })}
        />
        <Section
          image={Images.ProtectPrivacyReceiveKeys}
          subheaderText={t("onboarding.protect_privacy.subheader_4")}
          bodyText={t("onboarding.protect_privacy.body_4", {
            applicationName,
          })}
        />
        <Section
          image={Images.ProtectPrivacyReceiveNotification}
          subheaderText={t("onboarding.protect_privacy.subheader_5", {
            applicationName,
          })}
          bodyText={t("onboarding.protect_privacy.body_5", {
            applicationName,
          })}
        />
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors.primaryLightBackground,
  },
  mainContentContainer: {
    paddingVertical: Spacing.large,
  },
})

export default ProtectPrivacy

interface SectionProps {
  image: ImageSourcePropType
  subheaderText: string
  bodyText: string
}

const Section: FunctionComponent<SectionProps> = ({
  image,
  subheaderText,
  bodyText,
}) => {
  return (
    <View>
      <Image source={image} style={sectionStyle.image} />
      <View style={sectionStyle.textContainer}>
        <Text style={sectionStyle.subheaderText}>{subheaderText}</Text>
        <Text style={sectionStyle.bodyText}>{bodyText}</Text>
      </View>
    </View>
  )
}

const sectionStyle = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
    marginBottom: Spacing.xLarge,
    resizeMode: "contain",
  },
  textContainer: {
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.huge,
  },
  subheaderText: {
    ...Typography.header5,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body1,
    marginBottom: Spacing.medium,
  },
})
