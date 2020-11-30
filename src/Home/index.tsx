import React, { FunctionComponent } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import {
  AffectedUserFlowStackScreens,
  HomeStackScreens,
  ModalStackScreens,
  useStatusBarEffect,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { StatusBar, Text } from "../components"

import CovidDataCard from "../CovidData/Card"
import ExposureDetectionStatusCard from "./ExposureDetectionStatus/Card"
import SectionButton from "./SectionButton"
import ShareLink from "./ShareLink"
import CallEmergencyServices from "./CallEmergencyServices"

import { Icons, Images } from "../assets"
import {
  Outlines,
  Spacing,
  Colors,
  Typography,
  Affordances,
  Iconography,
  Buttons,
} from "../styles"

const IMAGE_HEIGHT = 170

const Home: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const {
    displayCallEmergencyServices,
    displayCovidData,
    displaySelfAssessment,
    displaySymptomHistory,
    emergencyPhoneNumber,
  } = useConfigurationContext()

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <Text style={style.headerText}>{t("screen_titles.home")}</Text>
        <ExposureDetectionStatusCard />
        {displayCovidData && <CovidDataCard />}
        <ReportTestResult />
        <ShareLink />
        {displaySelfAssessment && <SelfAssessment />}
        {displaySymptomHistory && <SymptomHistory />}
        {displayCallEmergencyServices && (
          <View style={style.callEmergencyServicesContainer}>
            <CallEmergencyServices phoneNumber={emergencyPhoneNumber} />
          </View>
        )}
      </ScrollView>
    </>
  )
}

const ReportTestResult: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleOnPressReportTestResult = () => {
    navigation.navigate(HomeStackScreens.AffectedUserStack)
  }

  const handleOnPressMoreInfo = () => {
    navigation.navigate(HomeStackScreens.AffectedUserStack, {
      screen: AffectedUserFlowStackScreens.VerificationCodeInfo,
    })
  }

  return (
    <TouchableOpacity
      onPress={handleOnPressReportTestResult}
      style={style.floatingContainer}
    >
      <View style={style.cardTopContainer}>
        <Image
          source={Images.ProtectPrivacySubmitKeys}
          style={style.image}
          width={130}
          height={IMAGE_HEIGHT}
        />
        <TouchableOpacity
          onPress={handleOnPressMoreInfo}
          style={style.moreInfoButton}
          accessibilityRole="button"
          accessibilityLabel={t("home.verification_code_card.more_info")}
        >
          <SvgXml
            xml={Icons.QuestionMark}
            fill={Colors.primary.shade125}
            width={Iconography.xxxSmall}
            height={Iconography.xxxSmall}
          />
        </TouchableOpacity>
      </View>
      <Text style={style.sectionHeaderText}>
        {t("home.have_a_positive_test")}
      </Text>
      <Text style={style.sectionBodyText}>{t("home.if_you_have_a_code")}</Text>
      <SectionButton text={t("home.submit_code")} />
    </TouchableOpacity>
  )
}

const SelfAssessment: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleOnPressTakeSelfAssessment = () => {
    navigation.navigate(ModalStackScreens.SelfAssessmentFromHome)
  }

  return (
    <TouchableOpacity
      onPress={handleOnPressTakeSelfAssessment}
      style={style.floatingContainer}
    >
      <Image
        source={Images.SelfAssessment}
        style={style.image}
        width={150}
        height={IMAGE_HEIGHT}
      />
      <Text style={style.sectionHeaderText}>{t("home.not_feeling_well")}</Text>
      <Text style={style.sectionBodyText}>
        {t("home.check_if_your_symptoms")}
      </Text>
      <SectionButton text={t("home.take_assessment")} />
    </TouchableOpacity>
  )
}

const SymptomHistory: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleOnPressSymptomHistory = () => {
    navigation.navigate(HomeStackScreens.EnterSymptoms)
  }

  return (
    <TouchableOpacity
      onPress={handleOnPressSymptomHistory}
      style={style.floatingContainer}
    >
      <Image
        source={Images.SelfAssessment}
        style={style.image}
        width={150}
        height={IMAGE_HEIGHT}
      />
      <Text style={style.sectionHeaderText}>{t("home.not_feeling_well")}</Text>
      <Text style={style.sectionBodyText}>
        {t("home.check_if_your_symptoms")}
      </Text>
      <SectionButton text={t("home.enter_symptoms")} />
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background.primaryLight,
  },
  headerText: {
    ...Typography.header.x60,
    ...Typography.style.bold,
    marginBottom: Spacing.medium,
  },
  floatingContainer: {
    ...Affordances.floatingContainer,
  },
  cardTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    resizeMode: "contain",
    marginBottom: Spacing.small,
  },
  moreInfoButton: {
    ...Buttons.circle.base,
  },
  sectionHeaderText: {
    ...Typography.header.x40,
    color: Colors.neutral.black,
    marginBottom: Spacing.xSmall,
  },
  sectionBodyText: {
    ...Typography.header.x20,
    ...Typography.style.normal,
    lineHeight: Typography.lineHeight.x40,
    color: Colors.neutral.shade100,
    marginBottom: Spacing.xLarge,
  },
  callEmergencyServicesContainer: {
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade25,
    paddingTop: Spacing.large,
  },
})

export default Home
