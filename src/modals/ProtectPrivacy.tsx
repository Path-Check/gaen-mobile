import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  View,
  ScrollView,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"

import { GlobalText } from "../components"
import { useApplicationName } from "../hooks/useApplicationInfo"

import { Layout, Typography, Spacing, Colors, Iconography } from "../styles"
import { Icons, Images } from "../assets"
import { useStatusBarEffect } from "../navigation"

const ProtectPrivacy: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>
          {t("onboarding.protect_privacy.header")}
        </GlobalText>
        <TouchableOpacity
          style={style.closeIconContainer}
          onPress={navigation.goBack}
        >
          <SvgXml
            xml={Icons.XInCircle}
            fill={Colors.neutral30}
            width={Iconography.small}
            height={Iconography.small}
          />
        </TouchableOpacity>
      </View>
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

const createStyle = (insets: EdgeInsets) => {
  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      backgroundColor: Colors.primaryLightBackground,
    },
    headerContainer: {
      position: "absolute",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: Colors.secondary10,
      zIndex: Layout.zLevel1,
      paddingTop: insets.top + Spacing.xxxSmall,
    },
    headerText: {
      flex: 10,
      ...Typography.header1,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.large,
      color: Colors.primary125,
    },
    closeIconContainer: {
      flex: 1,
      alignItems: "flex-end",
      padding: Spacing.medium,
    },
    mainContentContainer: {
      paddingBottom: Spacing.large,
      paddingTop: 170,
    },
  })
}

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
        <GlobalText style={sectionStyle.subheaderText}>
          {subheaderText}
        </GlobalText>
        <GlobalText style={sectionStyle.bodyText}>{bodyText}</GlobalText>
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
