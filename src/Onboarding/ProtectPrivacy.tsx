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
import env from "react-native-config"

import { GlobalText } from "../components/GlobalText"

import { Layout, Typography, Spacing, Colors, Iconography } from "../styles"
import { Icons, Images } from "../assets"

const ProtectPrivacy: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const applicationName = env.IN_APP_NAME

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
            fill={Colors.lighterGray}
            width={Iconography.small}
            height={Iconography.small}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={style.mainContentContainer}>
        <Section
          image={Images.PersonOnPhoneWithCode}
          subheaderText={t("onboarding.protect_privacy.subheader_1")}
          bodyText={t("onboarding.protect_privacy.body_1")}
        />
        <Section
          image={Images.PhonesSharingCodes}
          subheaderText={t("onboarding.protect_privacy.subheader_2")}
          bodyText={t("onboarding.protect_privacy.body_2")}
        />
        <Section
          image={Images.PersonWithPhoneAndCode}
          subheaderText={t("onboarding.protect_privacy.subheader_3")}
          bodyText={t("onboarding.protect_privacy.body_3", {
            applicationName,
          })}
        />
        <Section
          image={Images.CodesAndPhone}
          subheaderText={t("onboarding.protect_privacy.subheader_4")}
          bodyText={t("onboarding.protect_privacy.body_4", {
            applicationName,
          })}
        />
        <Section
          image={Images.PersonWithCodesInBackground}
          subheaderText={t("onboarding.protect_privacy.subheader_5")}
          bodyText={t("onboarding.protect_privacy.body_5", {
            applicationName,
          })}
        />
      </ScrollView>
    </View>
  )
}

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
      <Image source={image} style={style.image} />
      <View style={style.textContainer}>
        <GlobalText style={style.subheaderText}>{subheaderText}</GlobalText>
        <GlobalText style={style.bodyText}>{bodyText}</GlobalText>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors.primaryBackground,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.faintGray,
    zIndex: Layout.zLevel1,
  },
  headerText: {
    flex: 10,
    ...Typography.header3,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    color: Colors.primaryViolet,
  },
  closeIconContainer: {
    flex: 1,
    alignItems: "flex-end",
    padding: Spacing.medium,
  },
  mainContentContainer: {
    paddingTop: 130,
    paddingBottom: Spacing.xxxHuge,
  },
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
    ...Typography.mainContent,
    ...Typography.mediumBold,
    color: Colors.black,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.mainContent,
    marginBottom: Spacing.medium,
  },
})

export default ProtectPrivacy
