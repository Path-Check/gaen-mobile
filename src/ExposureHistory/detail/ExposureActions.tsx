import React, { FunctionComponent } from "react"
import { View, StyleSheet, Linking } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { Stacks } from "../../navigation"
import { GlobalText, Button } from "../../components"
import { useConnectionStatus } from "../../hooks/useConnectionStatus"

import { Colors, Iconography, Spacing, Typography } from "../../styles"
import { Icons } from "../../assets"
import { useConfigurationContext } from "../../ConfigurationContext"

const ExposureActions: FunctionComponent = () => {
  const { t } = useTranslation()
  const isInternetReachable = useConnectionStatus()
  const navigation = useNavigation()
  const {
    displayCallbackForm,
    displaySelfScreener,
    healthAuthorityName,
    healthAuthorityAdviceUrl,
  } = useConfigurationContext()

  const handleOnPressNextStep = () => {
    Linking.openURL(healthAuthorityAdviceUrl)
  }

  const displayNextStepsLink =
    !displaySelfScreener && healthAuthorityAdviceUrl !== ""

  return (
    <>
      <GlobalText style={style.bottomHeaderText}>
        {t("exposure_history.exposure_detail.ha_guidance_header")}
      </GlobalText>
      <>
        {displayCallbackForm && (
          <RequestCallBackActions healthAuthorityName={healthAuthorityName} />
        )}
        <GlobalText style={style.bottomHeaderText}>
          {t("exposure_history.exposure_detail.general_guidance", {
            healthAuthorityName,
          })}
        </GlobalText>
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
            text={t("exposure_history.exposure_detail.6ft_apart")}
          />
          <RecommendationBubble
            icon={Icons.WashHands}
            text={t("exposure_history.exposure_detail.wash_your_hands")}
          />
        </View>
        {displaySelfScreener && (
          <Button
            onPress={() => navigation.navigate(Stacks.SelfScreener)}
            label={t(
              "exposure_history.exposure_detail.personalize_my_guidance",
            )}
            customButtonStyle={style.personalizeGuidanceButton}
            customButtonInnerStyle={style.personalizeGuidanceButtonGradient}
            customTextStyle={style.personalizeGuidanceButtonText}
            hasRightArrow
            outlined
          />
        )}
        {displayNextStepsLink && (
          <View style={style.buttonContainer}>
            <Button
              onPress={handleOnPressNextStep}
              label={t("exposure_history.exposure_detail.next_steps")}
              disabled={!isInternetReachable}
              hasRightArrow
            />
          </View>
        )}
        {!isInternetReachable && (
          <GlobalText style={style.connectivityWarningText}>
            {t("exposure_history.no_connectivity_message")}
          </GlobalText>
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

  const navigateToCallbackForm = () => {
    navigation.navigate(Stacks.Callback)
  }

  return (
    <>
      <GlobalText style={style.bottomSubheaderText}>
        {t("exposure_history.exposure_detail.schedule_callback", {
          healthAuthorityName,
        })}
      </GlobalText>
      <Button
        customButtonStyle={style.requestCallbackButton}
        customButtonInnerStyle={style.requestCallbackButtonGradient}
        onPress={navigateToCallbackForm}
        label={t("exposure_history.exposure_detail.speak_with_contact_tracer")}
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
          width={Iconography.small}
          height={Iconography.small}
        />
      </View>
      <GlobalText style={style.recommendationText}>{text}</GlobalText>
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
  buttonContainer: {
    alignSelf: "flex-start",
  },
  connectivityWarningText: {
    ...Typography.error,
    marginTop: Spacing.small,
  },
  requestCallbackButton: {
    marginBottom: Spacing.small,
    width: "100%",
    alignSelf: "center",
    paddingVertical: Spacing.small,
  },
  requestCallbackButtonGradient: {
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
  personalizeGuidanceButtonGradient: {
    width: "100%",
    justifyContent: "space-between",
  },
})

export default ExposureActions
