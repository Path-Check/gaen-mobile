import React, { FunctionComponent } from "react"
import { View, StyleSheet, Linking } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ModalStackScreens } from "../../navigation"
import { Text, Button } from "../../components"
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
          <Button
            onPress={handleOnPressPersonalizeMyGuidance}
            label={t(
              "exposure_history.exposure_detail.personalize_my_guidance",
            )}
            customButtonStyle={style.personalizeGuidanceButton}
            customButtonInnerStyle={style.personalizeGuidanceButtonInner}
            customTextStyle={style.personalizeGuidanceButtonText}
            hasRightArrow
            outlined
          />
        )}
        {displayNextStepsLink && (
          <Button
            onPress={handleOnPressNextStep}
            label={t("exposure_history.exposure_detail.next_steps")}
            disabled={!isInternetReachable}
            customButtonStyle={style.button}
            customButtonInnerStyle={style.buttonInner}
            hasRightArrow
          />
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
      <Button
        onPress={handleOnPressRequestCallback}
        label={t("exposure_history.exposure_detail.speak_with_contact_tracer")}
        customButtonStyle={style.button}
        customButtonInnerStyle={style.buttonInner}
        hasRightArrow
      />
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
          fill={Colors.primary125}
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
    color: Colors.neutral100,
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
    backgroundColor: Colors.secondary10,
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
    marginBottom: Spacing.small,
    width: "100%",
    alignSelf: "center",
    paddingVertical: Spacing.small,
  },
  buttonInner: {
    ...Buttons.medium,
    width: "100%",
  },
  personalizeGuidanceButton: {
    marginBottom: Spacing.small,
    width: "100%",
    alignSelf: "center",
    borderColor: Colors.secondary100,
  },
  personalizeGuidanceButtonText: {
    ...Typography.buttonPrimary,
    color: Colors.primary110,
  },
  personalizeGuidanceButtonInner: {
    ...Buttons.medium,
    width: "100%",
    justifyContent: "space-between",
  },
})

export default ExposureActions
