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

import { GlobalText } from "../components/GlobalText"

import { Layout, Typography, Spacing, Colors, Iconography } from "../styles"
import { Icons, Images } from "../assets"

const ProtectPrivacy: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
    >
      <View style={style.topScroll} />
      <View style={style.headerContainer}>
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
        <GlobalText style={style.headerText}>
          {t("onboarding.protect_privacy.header")}
        </GlobalText>
      </View>
      <View style={style.mainContentContainer}>
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
          bodyText={t("onboarding.protect_privacy.body_3")}
        />
        <Section
          image={Images.CodesAndPhone}
          subheaderText={t("onboarding.protect_privacy.subheader_4")}
          bodyText={t("onboarding.protect_privacy.body_4")}
        />
        <Section
          image={Images.PersonWithCodesInBackground}
          subheaderText={t("onboarding.protect_privacy.subheader_5")}
          bodyText={t("onboarding.protect_privacy.body_5")}
        />
      </View>
    </ScrollView>
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
  contentContainer: {
    paddingBottom: Spacing.xxxHuge,
  },
  headerContainer: {
    backgroundColor: Colors.faintGray,
  },
  closeIconContainer: {
    alignSelf: "flex-end",
    padding: Spacing.medium,
  },
  headerText: {
    ...Typography.header2,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    color: Colors.primaryViolet,
  },
  mainContentContainer: {},
  image: {
    width: "100%",
    height: 300,
    marginTop: Spacing.small,
    marginBottom: Spacing.medium,
    resizeMode: "contain",
  },
  textContainer: {
    paddingHorizontal: Spacing.large,
  },
  subheaderText: {},
  bodyText: {},
  topScroll: {
    position: "absolute",
    top: -Layout.screenHeight,
    left: 0,
    right: 0,
    height: Layout.screenHeight,
    backgroundColor: Colors.faintGray,
  },
})

export default ProtectPrivacy
