import React, { FunctionComponent, useState } from "react"
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"

import { ExposureKey } from "../../exposureKey"
import { StatusBar, Text, LoadingIndicator } from "../../components"
import {
  useStatusBarEffect,
  AffectedUserFlowStackScreens,
  ModalStackScreens,
} from "../../navigation"
import { useExposureContext } from "../../ExposureContext"
import { useProductAnalyticsContext } from "../../ProductAnalytics/Context"
import { Icons } from "../../assets"
import { Colors, Spacing, Iconography, Typography, Buttons } from "../../styles"
import Logger from "../../logger"
import {
  postDiagnosisKeys,
  PostKeysError,
  PostKeysNoOp,
  PostKeysFailure,
  PostKeysNoOpReason,
} from "../exposureNotificationAPI"

type Posix = number

interface PublishConsentFormProps {
  hmacKey: string
  certificate: string
  exposureKeys: ExposureKey[]
  revisionToken: string
  storeRevisionToken: (revisionToken: string) => Promise<void>
  appPackageName: string
  regionCodes: string[]
  navigateOutOfStack: () => void
  symptomOnsetDate: Posix | null
}

const PublishConsentForm: FunctionComponent<PublishConsentFormProps> = ({
  hmacKey,
  certificate,
  exposureKeys,
  revisionToken,
  storeRevisionToken,
  appPackageName,
  regionCodes,
  navigateOutOfStack,
  symptomOnsetDate,
}) => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { trackEvent } = useProductAnalyticsContext()
  const { getCurrentExposures } = useExposureContext()

  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const [isLoading, setIsLoading] = useState(false)

  const handleNoOpResponse = (noOpResponse: PostKeysNoOp) => {
    const newKeysInserted = noOpResponse.newKeysInserted
    Logger.addMetadata("publishKeys", {
      noOpReason: noOpResponse.reason,
      errorMessage: noOpResponse.message,
      newKeysInserted,
      revisionToken,
    })
    Logger.error(
      `IncompleteKeySumbission.${noOpResponse.reason}.${noOpResponse.message}`,
    )

    const { alertTitle, alertMessage } = noOpAlertContent(noOpResponse)

    Alert.alert(alertTitle, alertMessage, [
      {
        onPress: () =>
          navigation.navigate(
            AffectedUserFlowStackScreens.AffectedUserComplete,
          ),
      },
    ])
  }

  const trackEvents = async () => {
    const currentExposures = await getCurrentExposures()
    trackEvent("product_analytics", "key_submission_consented_to")
    trackEvent(
      "epi_analytics",
      "ens_preceding_positive_diagnosis_count",
      undefined,
      currentExposures.length,
    )
  }

  const noOpAlertContent = ({ reason, newKeysInserted }: PostKeysNoOp) => {
    switch (reason) {
      case PostKeysNoOpReason.NoTokenForExistingKeys: {
        return {
          alertTitle: t(
            "export.publish_keys.no_op.no_token_for_existing_keys_title",
          ),
          alertMessage: t(
            "export.publish_keys.no_op.no_token_for_existing_keys",
            {
              newKeysInserted,
            },
          ),
        }
      }
      case PostKeysNoOpReason.EmptyExposureKeys: {
        return {
          alertTitle: t("export.publish_keys.no_op.empty_exposure_keys_title"),
          alertMessage: t("export.publish_keys.no_op.empty_exposure_keys"),
        }
      }
    }
  }

  const errorMessageTitle = (errorNature: PostKeysError) => {
    switch (errorNature) {
      case PostKeysError.Timeout: {
        return t("export.publish_keys.errors.timeout")
      }
      case PostKeysError.InternalServerError: {
        return t("export.publish_keys.errors.internal_server_error")
      }
      case PostKeysError.Unknown: {
        return t("export.publish_keys.errors.unknown")
      }
      case PostKeysError.RequestFailed: {
        return t("common.something_went_wrong")
      }
    }
  }

  const handleFailureResponse = ({ nature, message }: PostKeysFailure) => {
    Logger.addMetadata("publishKeys", {
      errorMessage: message,
      revisionToken,
    })
    Logger.error(`IncompleteKeySumbission.${nature}.${message}`)
    Alert.alert(
      errorMessageTitle(nature),
      t("export.publish_keys.errors.description", {
        message,
      }),
    )
  }

  const handleOnPressConfirm = async () => {
    setIsLoading(true)
    const response = await postDiagnosisKeys(
      exposureKeys,
      regionCodes,
      certificate,
      hmacKey,
      appPackageName,
      revisionToken,
      symptomOnsetDate,
    )
    setIsLoading(false)
    if (response.kind === "success") {
      storeRevisionToken(response.revisionToken)
      trackEvents()
      navigation.navigate(AffectedUserFlowStackScreens.AffectedUserComplete)
    } else if (response.kind === "no-op") {
      handleNoOpResponse(response)
    } else {
      handleFailureResponse(response)
    }
  }

  const handleOnPressNeverMind = () => {
    Alert.alert(
      t("export.consent_warning_title"),
      t("export.consent_warning_message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.confirm"),
          onPress: navigateOutOfStack,
          style: "destructive",
        },
      ],
    )
  }

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(ModalStackScreens.ProtectPrivacy)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <View style={style.outerContainer}>
        <ScrollView
          contentContainerStyle={style.contentContainer}
          testID="publish-consent-form"
          alwaysBounceVertical={false}
        >
          <View style={style.content}>
            <Text style={style.header}>
              {t("export.publish_consent_title_bluetooth")}
            </Text>
            <Text style={style.bodyText}>{t("export.consent_body_0")}</Text>
            <Text style={style.bodyText}>{t("export.consent_body_2")}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={style.button}
              onPress={handleOnPressConfirm}
              accessibilityLabel={t("export.consent_button_title")}
            >
              <Text style={style.buttonText}>
                {t("export.consent_button_title")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={style.buttonSecondary}
              onPress={handleOnPressNeverMind}
              accessibilityLabel={t("export.never_mind_button_title")}
            >
              <Text style={style.buttonSecondaryText}>
                {t("export.never_mind_button_title")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={style.bottomButtonContainer}
          onPress={handleOnPressProtectPrivacy}
        >
          <Text style={style.bottomButtonText}>
            {t("onboarding.protect_privacy_button")}
          </Text>
          <SvgXml
            xml={Icons.ChevronUp}
            fill={Colors.primary.shade150}
            width={Iconography.xxxSmall}
            height={Iconography.xxxSmall}
          />
        </TouchableOpacity>
        {isLoading && <LoadingIndicator />}
      </View>
    </>
  )
}

const createStyle = (insets: EdgeInsets) => {
  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: Colors.background.primaryLight,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: "space-between",
      paddingTop: Spacing.medium,
      paddingHorizontal: Spacing.large,
      paddingBottom: Spacing.small,
    },
    content: {
      marginBottom: Spacing.small,
      justifyContent: "center",
    },
    header: {
      ...Typography.header.x60,
      paddingBottom: Spacing.medium,
    },
    bodyText: {
      ...Typography.body.x30,
      marginBottom: Spacing.xxLarge,
    },
    button: {
      ...Buttons.primary.base,
    },
    buttonText: {
      ...Typography.button.primary,
    },
    buttonSecondary: {
      ...Buttons.secondary.base,
    },
    buttonSecondaryText: {
      ...Typography.button.secondary,
    },
    bottomButtonContainer: {
      backgroundColor: Colors.secondary.shade10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: Spacing.small,
      paddingHorizontal: Spacing.medium,
      paddingBottom: insets.bottom + Spacing.small,
    },
    bottomButtonText: {
      ...Typography.header.x20,
      color: Colors.primary.shade100,
      marginRight: Spacing.xSmall,
    },
  })
}

export default PublishConsentForm
