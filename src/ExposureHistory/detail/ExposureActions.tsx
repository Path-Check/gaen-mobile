import React, { FunctionComponent } from "react"
import { View, StyleSheet, Linking, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { SettingsScreens, Stacks } from "../../navigation"
import { GlobalText, Button } from "../../components"
import { useConnectionStatus } from "../../hooks/useConnectionStatus"

import { Colors, Iconography, Spacing, Typography, Buttons } from "../../styles"
import { Icons } from "../../assets"
import { useConfigurationContext } from "../../ConfigurationContext"

const ExposureActions: FunctionComponent = () => {
  const { t } = useTranslation()
  const isInternetReachable = useConnectionStatus()
  const {
    displayCallbackForm,
    healthAuthorityName,
    healthAuthorityAdviceUrl,
  } = useConfigurationContext()

  const handleOnPressNextStep = () => {
    Linking.openURL(healthAuthorityAdviceUrl)
  }

  const displayNextStepsLink = healthAuthorityAdviceUrl !== ""

  return (
    <>
      <GlobalText style={style.bottomHeaderText}>
        {t("exposure_history.exposure_detail.ha_guidance_header")}
      </GlobalText>
      {displayCallbackForm ? (
        <RequestCallBackActions healthAuthorityName={healthAuthorityName} />
      ) : (
        <>
          <GlobalText style={style.bottomSubheaderText}>
            {t("exposure_history.exposure_detail.ha_guidance_subheader", {
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
              icon={Icons.SixFeet}
              text={t("exposure_history.exposure_detail.6ft_apart")}
            />
            <RecommendationBubble
              icon={Icons.WashHands}
              text={t("exposure_history.exposure_detail.wash_your_hands")}
            />
          </View>
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
      )}
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
    navigation.navigate(Stacks.Settings, {
      screen: SettingsScreens.CallbackForm,
    })
  }

  const navigateToConnectStack = () => {
    navigation.navigate(Stacks.Connect)
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
        onPress={navigateToCallbackForm}
        label={t("exposure_history.exposure_detail.speak_with_contact_tracer")}
        hasRightArrow
      />
      <TouchableOpacity
        onPress={navigateToConnectStack}
        accessibilityLabel={t("exposure_history.exposure_detail.call_later")}
        style={style.callLaterButton}
      >
        <GlobalText style={style.callLaterButtonText}>
          {t("exposure_history.exposure_detail.call_later")}
        </GlobalText>
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
    ...Typography.header5,
    marginBottom: Spacing.xxSmall,
  },
  bottomSubheaderText: {
    ...Typography.body2,
    color: Colors.neutral100,
    marginBottom: Spacing.medium,
  },
  recommendations: {
    display: "flex",
    flexDirection: "row",
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
    backgroundColor: Colors.primaryLightBackground,
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
    padding: Spacing.small,
  },
  callLaterButton: {
    ...Buttons.primary,
    backgroundColor: Colors.secondary50,
    minWidth: "100%",
  },
  callLaterButtonText: {
    ...Typography.body1,
    ...Typography.bold,
    color: Colors.primary100,
  },
})

export default ExposureActions
