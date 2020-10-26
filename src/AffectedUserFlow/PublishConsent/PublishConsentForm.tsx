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
import { Text, LoadingIndicator } from "../../components"
import {
  useStatusBarEffect,
  AffectedUserFlowStackScreens,
  ModalStackScreens,
} from "../../navigation"
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

interface PublishConsentFormProps {
  hmacKey: string
  certificate: string
  exposureKeys: ExposureKey[]
  revisionToken: string
  storeRevisionToken: (revisionToken: string) => Promise<void>
  appPackageName: string
  regionCodes: string[]
}

const PublishConsentForm: FunctionComponent<PublishConsentFormProps> = ({
  hmacKey,
  certificate,
  exposureKeys,
  revisionToken,
  storeRevisionToken,
  appPackageName,
  regionCodes,
}) => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

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
    )
    setIsLoading(false)
    if (response.kind === "success") {
      storeRevisionToken(response.revisionToken)
      navigation.navigate(AffectedUserFlowStackScreens.AffectedUserComplete)
    } else if (response.kind === "no-op") {
      handleNoOpResponse(response)
    } else {
      handleFailureResponse(response)
    }
  }

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(ModalStackScreens.ProtectPrivacy)
  }

  return (
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
          <Text style={style.subheaderText}>
            {t("export.consent_subheader_1")}
          </Text>
          <Text style={style.bodyText}>{t("export.consent_body_1")}</Text>
          <Text style={style.subheaderText}>
            {t("export.consent_subheader_2")}
          </Text>
          <Text style={style.bodyText}>{t("export.consent_body_2")}</Text>
        </View>
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressConfirm}
          accessibilityLabel={t("export.consent_button_title")}
        >
          <Text style={style.buttonText}>
            {t("export.consent_button_title")}
          </Text>
        </TouchableOpacity>
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
      paddingTop: Spacing.medium,
      paddingHorizontal: Spacing.large,
      paddingBottom: Spacing.huge,
    },
    content: {
      marginBottom: Spacing.small,
    },
    header: {
      ...Typography.header1,
      paddingBottom: Spacing.medium,
    },
    subheaderText: {
      ...Typography.body1,
      ...Typography.mediumBold,
      color: Colors.neutral.black,
      marginBottom: Spacing.xxSmall,
    },
    bodyText: {
      ...Typography.body1,
      marginBottom: Spacing.xxLarge,
    },
    button: {
      ...Buttons.primary,
    },
    buttonText: {
      ...Typography.buttonPrimary,
    },
    bottomButtonContainer: {
      backgroundColor: Colors.secondary.shade10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: Spacing.small,
      paddingBottom: insets.bottom + Spacing.small,
    },
    bottomButtonText: {
      ...Typography.header5,
      color: Colors.primary.shade100,
      marginRight: Spacing.xSmall,
    },
  })
}

export default PublishConsentForm
