import React, { FunctionComponent } from "react"
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Linking,
  Platform,
} from "react-native"
import env from "react-native-config"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import {
  HomeStackScreens,
  ModalStackScreens,
  AffectedUserFlowStackScreens,
  EscrowVerificationRoutes,
  useStatusBarEffect,
} from "../navigation"
import { useConfigurationContext } from "../configuration"
import { StatusBar, Text } from "../components"

import CovidDataCard from "../CovidData/Card"
import ExposureDetectionStatusCard from "./ExposureDetectionStatus/Card"
import SectionButton from "./SectionButton"
import ShareLink from "./ShareLink"
import HealthCheckLink from "./HealthCheckLink"
import CovidDataWebViewLink from "./CovidDataWebViewLink"
import CallEmergencyServices from "./CallEmergencyServices"
import FaqButton from "./FaqButton"
import { usePermissionsContext } from "../Device/PermissionsContext"
import EnxMigrationInfo from "./EnxMigrationInfo"

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
import { ExternalLink } from "../components/ExternalLink"

const IMAGE_HEIGHT = 170

const Home: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const {
    appDownloadUrl,
    displayCallEmergencyServices,
    displayCovidData,
    displayCovidDataWebView,
    displaySelfAssessment,
    displaySymptomHistory,
    emergencyPhoneNumber,
    externalCovidDataLink,
    externalCovidDataLabel,
    externalTravelGuidanceLink,
    healthAuthorityHealthCheckUrl,
    verificationStrategy,
    enxRegion,
  } = useConfigurationContext()

  const enxComponent = Platform.OS === "ios" && (
    <EnxMigrationInfo enxRegion={enxRegion} />
  )

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <Text style={style.headerText}>{t("screen_titles.home")}</Text>
        <NotificationsOff />
        {enxComponent}
        <ExposureDetectionStatusCard />
        {displayCovidData && <CovidDataCard />}
        {verificationStrategy === "Simple" ? (
          <SimpleVerificationFlowButton />
        ) : (
          <EscrowVerificationFlowButton />
        )}
        {healthAuthorityHealthCheckUrl && (
          <HealthCheckLink healthCheckUrl={healthAuthorityHealthCheckUrl} />
        )}
        {displayCovidDataWebView && <CovidDataWebViewLink />}
        {externalCovidDataLink && (
          <ExternalLink
            icon={Icons.BarGraph}
            label={t("home.covid_data_specific", {
              label: externalCovidDataLabel,
            })}
            link={externalCovidDataLink}
          />
        )}
        {externalTravelGuidanceLink && (
          <ExternalLink
            icon={Icons.LocationPin}
            label={t("home.safe_travel_guidance")}
            link={externalTravelGuidanceLink}
          />
        )}
        {appDownloadUrl && <ShareLink appDownloadUrl={appDownloadUrl} />}
        {env.VERIFICATION_CODE_INFO_URL && <FaqButton />}
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

const NotificationsOff = () => {
  const { t } = useTranslation()
  const { notification } = usePermissionsContext()

  const handleOnPressNotificationsOff = () => {
    if (notification.status === "Denied") {
      notification.request()
    } else if (notification.status === "Blocked") {
      Linking.openSettings()
    }
  }

  const showNotificationsOff = notification.status !== "Granted"

  return showNotificationsOff ? (
    <Pressable
      style={style.notificationsOffContainer}
      onPress={handleOnPressNotificationsOff}
    >
      <View style={style.notificationsOffBellIconContainer}>
        <SvgXml
          xml={Icons.Bell}
          fill={Colors.neutral.shade100}
          width={Iconography.xxSmall}
          height={Iconography.xxSmall}
        />
      </View>
      <Text style={style.notificationsOffText}>
        {t("home.notifications_off")}
      </Text>
    </Pressable>
  ) : null
}

const SimpleVerificationFlowButton: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressReportTestResult = () => {
    navigation.navigate(HomeStackScreens.AffectedUserStack)
  }

  const handleOnPressMoreInfo = () => {
    navigation.navigate(HomeStackScreens.AffectedUserStack, {
      screen: AffectedUserFlowStackScreens.VerificationCodeInfo,
    })
  }

  const descriptionText = t("home.verification_code_card.if_you_have_a_code")
  const buttonLabelText = t("home.verification_code_card.submit_code")

  return (
    <VerificationFlowButton
      onPressReportTestResult={handleOnPressReportTestResult}
      onPressMoreInfo={handleOnPressMoreInfo}
      descriptionText={descriptionText}
      buttonLabelText={buttonLabelText}
    />
  )
}

const EscrowVerificationFlowButton: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressReportTestResult = () => {
    navigation.navigate(HomeStackScreens.EscrowVerificationStack)
  }

  const handleOnPressMoreInfo = () => {
    navigation.navigate(HomeStackScreens.EscrowVerificationStack, {
      screen: EscrowVerificationRoutes.EscrowVerificationMoreInfo,
    })
  }

  const descriptionText = t(
    "home.verification_code_card.if_you_have_a_positive_test",
  )
  const buttonLabelText = t("home.verification_code_card.report_positive_test")

  return (
    <VerificationFlowButton
      onPressReportTestResult={handleOnPressReportTestResult}
      onPressMoreInfo={handleOnPressMoreInfo}
      descriptionText={descriptionText}
      buttonLabelText={buttonLabelText}
    />
  )
}

interface VerificationFlowButtonProps {
  onPressReportTestResult: () => void
  onPressMoreInfo: () => void
  descriptionText: string
  buttonLabelText: string
}

const VerificationFlowButton: FunctionComponent<VerificationFlowButtonProps> = ({
  onPressReportTestResult,
  onPressMoreInfo,
  descriptionText,
  buttonLabelText,
}) => {
  const { t } = useTranslation()

  return (
    <View style={style.floatingContainer}>
      <View style={style.cardTopContainer}>
        <Image
          source={Images.ProtectPrivacySubmitKeys}
          style={style.image}
          width={130}
          height={IMAGE_HEIGHT}
        />
        <TouchableOpacity
          onPress={onPressMoreInfo}
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
      <Text style={style.sectionBodyText}>{descriptionText}</Text>
      <TouchableOpacity
        onPress={onPressReportTestResult}
        accessibilityRole="button"
        accessibilityHint={t("accessibility.hint.navigates_to_new_screen")}
        accessibilityLabel={buttonLabelText}
      >
        <SectionButton text={buttonLabelText} />
      </TouchableOpacity>
    </View>
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
  notificationsOffContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.xSmall,
    paddingHorizontal: Spacing.small,
    marginBottom: Spacing.small,
    borderWidth: Outlines.thin,
    borderColor: Colors.neutral.shade75,
    backgroundColor: Colors.neutral.shade5,
    borderRadius: Outlines.borderRadiusLarge,
  },
  notificationsOffBellIconContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  notificationsOffText: {
    flex: 9,
    ...Typography.body.x20,
    color: Colors.neutral.black,
  },
  callEmergencyServicesContainer: {
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade25,
    paddingTop: Spacing.large,
  },
})

export default Home
