import React, { FunctionComponent } from "react"
import { View, StyleSheet, Linking, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ModalStackScreens } from "../../navigation"
import { Text } from "../../components"
import { useConnectionStatus } from "../../hooks/useConnectionStatus"

import { Buttons, Colors, Iconography, Spacing, Typography } from "../../styles"
import { Icons } from "../../assets"
import { useConfigurationContext } from "../../ConfigurationContext"

const ExposureActions: FunctionComponent = () => {
  const { t } = useTranslation()
  const isInternetReachable = useConnectionStatus()
  const navigation = useNavigation()
  const {
    displayCallbackForm,
    displaySelfAssessment,
    healthAuthorityName,
    healthAuthorityAdviceUrl,
    measurementSystem,
  } = useConfigurationContext()

  const handleOnPressNextStep = () => {
    Linking.openURL(healthAuthorityAdviceUrl)
  }

  const handleOnPressPersonalizeMyGuidance = () => {
    navigation.navigate(ModalStackScreens.SelfAssessmentFromExposureDetails)
  }

  const displayNextStepsLink =
    !displaySelfAssessment && healthAuthorityAdviceUrl !== ""

  const stayApartRecommendationText =
    measurementSystem === "Imperial"
      ? t("exposure_history.exposure_detail.6ft_apart")
      : t("exposure_history.exposure_detail.2m_apart")

  return (
    <>
      <Text style={style.bottomHeaderText}>
        {t("exposure_history.exposure_detail.ha_guidance_header")}
      </Text>
      <>
        {displayCallbackForm && (
          <RequestCallBackActions healthAuthorityName={healthAuthorityName} />
        )}
        <Text style={style.bottomHeaderText}>
          {t("exposure_history.exposure_detail.general_guidance", {
            healthAuthorityName,
          })}
        </Text>
        <View style={style.recommendations}>
          <RecommendationBubble
            icon={Icons.IsolateBubbles}
            text={t("exposure_history.exposure_detail.isolate")}
          />
          <RecommendationBubble
            icon={Icons.Mask}
            text={t("exposure_history.exposure_detail.wear_a_mask")}
          />
          <RecommendationBubble
            icon={Icons.StayApart}
            text={stayApartRecommendationText}
          />
          <RecommendationBubble
            icon={Icons.WashHands}
            text={t("exposure_history.exposure_detail.wash_your_hands")}
          />
        </View>
        {displaySelfAssessment && (
          <TouchableOpacity
            style={style.button}
            onPress={handleOnPressPersonalizeMyGuidance}
            accessibilityLabel={t(
              "exposure_history.exposure_detail.personalize_my_guidance",
            )}
          >
            <Text style={style.buttonText}>
              {t("exposure_history.exposure_detail.personalize_my_guidance")}
            </Text>
            <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
          </TouchableOpacity>
        )}
        {displayNextStepsLink && (
          <TouchableOpacity
            style={style.button}
            onPress={handleOnPressNextStep}
            accessibilityLabel={t(
              "exposure_history.exposure_detail.next_steps",
            )}
            disabled={!isInternetReachable}
          >
            <Text style={style.buttonText}>
              {t("exposure_history.exposure_detail.next_steps")}
            </Text>
            <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
          </TouchableOpacity>
        )}
        {!isInternetReachable && (
          <Text style={style.connectivityWarningText}>
            {t("exposure_history.no_connectivity_message")}
          </Text>
        )}
      </>
    </>
  )
}

type RequestCallBackActionsProps = {
  healthAuthorityName: string
}

const RequestCallBackActions: FunctionComponent<RequestCallBackActionsProps> = ({
  healthAuthorityName,
}) => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleOnPressRequestCallback = () => {
    navigation.navigate(ModalStackScreens.CallbackStack)
  }

  return (
    <>
      <Text style={style.bottomSubheaderText}>
        {t("exposure_history.exposure_detail.schedule_callback", {
          healthAuthorityName,
        })}
      </Text>
      <TouchableOpacity
        style={style.button}
        onPress={handleOnPressRequestCallback}
        accessibilityLabel={t(
          "exposure_history.exposure_detail.speak_with_contact_tracer",
        )}
      >
        <Text style={style.buttonText}>
          {t("exposure_history.exposure_detail.speak_with_contact_tracer")}
        </Text>
        <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
      </TouchableOpacity>
    </>
  )
}

type RecommendationBubbleProps = {
  text: string
  icon: string
}
const RecommendationBubble: FunctionComponent<RecommendationBubbleProps> = ({
  text,
  icon,
}) => {
  return (
    <View style={style.recommendation}>
      <View style={style.recommendationBubbleCircle}>
        <SvgXml
          xml={icon}
          fill={Colors.primary.shade125}
          width={Iconography.small}
          height={Iconography.small}
        />
      </View>
      <Text style={style.recommendationText}>{text}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  bottomHeaderText: {
    ...Typography.header4,
    marginBottom: Spacing.xxSmall,
  },
  bottomSubheaderText: {
    ...Typography.body1,
    color: Colors.neutral.shade100,
    marginBottom: Spacing.medium,
  },
  recommendations: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: Spacing.xxxLarge,
  },
  recommendation: {
    display: "flex",
    alignItems: "center",
  },
  recommendationBubbleCircle: {
    ...Iconography.smallIcon,
    borderRadius: 50,
    backgroundColor: Colors.secondary.shade10,
    padding: Spacing.xLarge,
    marginBottom: Spacing.xSmall,
  },
  recommendationText: {
    ...Typography.body3,
  },
  connectivityWarningText: {
    ...Typography.error,
    marginTop: Spacing.small,
  },
  button: {
    ...Buttons.primaryThin,
    width: "100%",
    marginBottom: Spacing.small,
  },
  buttonText: {
    ...Typography.buttonPrimary,
    marginRight: Spacing.small,
  },
})

export default ExposureActions
