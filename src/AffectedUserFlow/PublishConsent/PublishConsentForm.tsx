import React, { FunctionComponent, useState } from "react"
import {
  ScrollView,
  Alert,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { Button } from "../../components/Button"
import { RTLEnabledText } from "../../components/RTLEnabledText"
import * as BTNativeModule from "../../gaen/nativeModule"

import { Screens, Stacks } from "../../navigation"
import { Icons, Images } from "../../assets"
import { Colors, Spacing, Buttons, Iconography, Typography } from "../../styles"

interface PublishConsentFormProps {
  hmacKey: string
  certificate: string
}

const PublishConsentForm: FunctionComponent<PublishConsentFormProps> = ({
  hmacKey,
  certificate,
}) => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const handleOnPressConfirm = async () => {
    setIsLoading(true)
    try {
      await BTNativeModule.submitDiagnosisKeys(certificate, hmacKey)
      setIsLoading(false)
      navigation.navigate(Screens.AffectedUserComplete)
    } catch (e) {
      setIsLoading(false)
      Alert.alert(t("common.something_went_wrong"), e.message)
    }
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Stacks.More)
  }

  const title = t("export.publish_consent_title_bluetooth")
  const body = t("export.publish_consent_body_bluetooth")

  return (
    <ImageBackground
      source={Images.BlueGradientBackground}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.icon}>
            <SvgXml
              xml={Icons.Bell}
              accessible
              accessibilityLabel={t("label.bell_icon")}
              width={Iconography.small}
              height={Iconography.small}
            />
          </View>

          <View style={styles.content}>
            <RTLEnabledText style={styles.header}>{title}</RTLEnabledText>
            <RTLEnabledText style={styles.contentText}>{body}</RTLEnabledText>
          </View>

          <View>
            <Button
              loading={isLoading}
              label={t("export.consent_button_title")}
              onPress={handleOnPressConfirm}
              style={styles.button}
              textStyle={styles.buttonText}
            />
            <TouchableOpacity
              onPress={handleOnPressCancel}
              style={styles.secondaryButton}
            >
              <RTLEnabledText style={styles.secondaryButtonText}>
                {t("export.consent_button_cancel")}
              </RTLEnabledText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.huge,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    paddingBottom: Spacing.xxHuge,
  },
  header: {
    ...Typography.header2,
    color: Colors.white,
    paddingBottom: Spacing.medium,
  },
  icon: {
    ...Iconography.largeIcon,
    backgroundColor: Colors.white,
  },
  contentText: {
    ...Typography.secondaryContent,
    color: Colors.white,
  },
  button: {
    ...Buttons.primaryInverted,
  },
  buttonText: {
    ...Typography.buttonTextPrimaryInverted,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonTextSecondaryInverted,
  },
})

export default PublishConsentForm
