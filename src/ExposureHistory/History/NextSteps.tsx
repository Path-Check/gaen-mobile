import React, { FunctionComponent } from "react"
import { StyleSheet, Linking, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { ModalStackScreens } from "../../navigation"
import { Text } from "../../components"
import { useConnectionStatus } from "../../Device/useConnectionStatus"
import { useCustomCopy } from "../../configuration/useCustomCopy"

import { Buttons, Colors, Spacing, Typography } from "../../styles"
import { Icons } from "../../assets"
import { useConfigurationContext } from "../../ConfigurationContext"

const NextSteps: FunctionComponent = () => {
  const { t } = useTranslation()
  const isInternetReachable = useConnectionStatus()
  const navigation = useNavigation()
  const {
    displayCallbackForm,
    displaySelfAssessment,
    healthAuthorityAdviceUrl,
  } = useConfigurationContext()
  const { healthAuthorityName } = useCustomCopy()

  const handleOnPressNextStep = () => {
    Linking.openURL(healthAuthorityAdviceUrl)
  }

  const handleOnPressPersonalizeMyGuidance = () => {
    navigation.navigate(ModalStackScreens.SelfAssessmentFromExposureDetails)
  }

  const displayNextStepsLink =
    !displaySelfAssessment && healthAuthorityAdviceUrl !== ""

  return (
    <>
      {displayCallbackForm && (
        <RequestCallBackActions healthAuthorityName={healthAuthorityName} />
      )}
      {displaySelfAssessment && (
        <TouchableOpacity
          style={style.buttonOutlined}
          onPress={handleOnPressPersonalizeMyGuidance}
          accessibilityLabel={t(
            "exposure_history.exposure_detail.personalize_my_guidance",
          )}
        >
          <Text style={style.buttonOutlinedText}>
            {t("exposure_history.exposure_detail.personalize_my_guidance")}
          </Text>
          <SvgXml xml={Icons.Arrow} fill={Colors.primary.shade100} />
        </TouchableOpacity>
      )}
      {displayNextStepsLink && (
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressNextStep}
          accessibilityLabel={t("exposure_history.exposure_detail.next_steps")}
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

const style = StyleSheet.create({
  bottomSubheaderText: {
    ...Typography.body.x20,
    marginBottom: Spacing.medium,
  },
  connectivityWarningText: {
    ...Typography.utility.error,
    marginTop: Spacing.small,
  },
  button: {
    ...Buttons.thin.base,
    marginBottom: Spacing.small,
  },
  buttonText: {
    ...Typography.button.primary,
    marginRight: Spacing.small,
  },
  buttonOutlined: {
    ...Buttons.outlined.thin,
    marginBottom: Spacing.small,
  },
  buttonOutlinedText: {
    ...Typography.button.secondary,
    marginRight: Spacing.small,
  },
})

export default NextSteps
