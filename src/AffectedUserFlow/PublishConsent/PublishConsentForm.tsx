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

import { Button } from "../../components/Button"
import { GlobalText } from "../../components/GlobalText"

import { Screens } from "../../navigation"
import { Icons } from "../../assets"
import {
  Outlines,
  Colors,
  Spacing,
  Buttons,
  Iconography,
  Typography,
} from "../../styles"
import { useExposureContext } from "../../ExposureContext"

interface PublishConsentFormProps {
  hmacKey: string
  certificate: string
}

const PublishConsentForm: FunctionComponent<PublishConsentFormProps> = ({
  hmacKey,
  certificate,
}) => {
  const strategy = useExposureContext()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const handleOnPressConfirm = async () => {
    setIsLoading(true)
    try {
      await strategy.submitDiagnosisKeys(certificate, hmacKey)
      setIsLoading(false)
      navigation.navigate(Screens.AffectedUserComplete)
    } catch (e) {
      setIsLoading(false)
      Alert.alert(t("common.something_went_wrong"), e.message)
    }
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.Home)
  }

  const title = t("export.publish_consent_title_bluetooth")
  const body = t("export.publish_consent_body_bluetooth")

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      testID="publish-consent-form"
    >
      <View style={style.iconContainerCircle}>
        <SvgXml
          xml={Icons.Bell}
          width={Iconography.small}
          height={Iconography.small}
        />
      </View>

      <View style={style.content}>
        <GlobalText style={style.header}>{title}</GlobalText>
        <GlobalText style={style.contentText}>{body}</GlobalText>
      </View>

      <View style={style.buttonsContainer}>
        <Button
          invert
          loading={isLoading}
          label={t("export.consent_button_title")}
          onPress={handleOnPressConfirm}
        />
        <TouchableOpacity
          onPress={handleOnPressCancel}
          style={style.secondaryButton}
          accessibilityLabel={t("export.consent_button_cancel")}
        >
          <GlobalText style={style.secondaryButtonText}>
            {t("export.consent_button_cancel")}
          </GlobalText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBlue,
  },
  contentContainer: {
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.xxxHuge,
    paddingBottom: Spacing.huge,
  },
  content: {
    paddingBottom: Spacing.xxHuge,
  },
  header: {
    ...Typography.header2,
    color: Colors.white,
    paddingBottom: Spacing.medium,
  },
  iconContainerCircle: {
    ...Iconography.largeIcon,
    borderRadius: Outlines.borderRadiusMax,
    backgroundColor: Colors.primaryBackground,
    marginBottom: Spacing.large,
  },
  contentText: {
    ...Typography.secondaryContent,
    color: Colors.white,
  },
  buttonsContainer: {
    alignSelf: "flex-start",
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondaryInvertedText,
  },
})

export default PublishConsentForm
