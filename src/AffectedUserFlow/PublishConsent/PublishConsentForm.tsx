import React, { FunctionComponent, useState } from "react"
import {
  ScrollView,
  SafeAreaView,
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

import {
  AffectedUserFlowScreens,
  Screens,
  useStatusBarEffect,
} from "../../navigation"
import { Icons } from "../../assets"
import {
  Outlines,
  Colors,
  Spacing,
  Iconography,
  Typography,
  Layout,
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
      navigation.navigate(AffectedUserFlowScreens.AffectedUserComplete)
    } catch (e) {
      setIsLoading(false)
      Alert.alert(t("common.something_went_wrong"), e.message)
    }
  }
  useStatusBarEffect("dark-content")

  const handleOnPressBack = () => {
    navigation.goBack()
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.Home)
  }

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(AffectedUserFlowScreens.ProtectPrivacy)
  }

  return (
    <>
      <SafeAreaView style={style.topSafeArea} />
      <SafeAreaView style={style.bottomSafeArea}>
        <View style={style.outerContainer}>
          <View style={style.navButtonContainer}>
            <TouchableOpacity
              onPress={handleOnPressBack}
              accessible
              accessibilityLabel={t("export.code_input_button_back")}
            >
              <View style={style.backButtonInnerContainer}>
                <SvgXml
                  xml={Icons.ArrowLeft}
                  fill={Colors.black}
                  width={Iconography.xSmall}
                  height={Iconography.xSmall}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOnPressCancel}
              accessible
              accessibilityLabel={t("export.code_input_button_cancel")}
            >
              <View style={style.cancelButtonInnerContainer}>
                <SvgXml
                  xml={Icons.X}
                  fill={Colors.black}
                  width={Iconography.xSmall}
                  height={Iconography.xSmall}
                />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={style.contentContainer}
            testID="publish-consent-form"
            alwaysBounceVertical={false}
          >
            <View style={style.content}>
              <GlobalText style={style.header}>
                {t("export.publish_consent_title_bluetooth")}
              </GlobalText>
              <GlobalText style={style.bodyText}>
                {t("export.consent_body_0")}
              </GlobalText>
              <GlobalText style={style.subheaderText}>
                {t("export.consent_subheader_1")}
              </GlobalText>
              <GlobalText style={style.bodyText}>
                {t("export.consent_body_1")}
              </GlobalText>
              <GlobalText style={style.subheaderText}>
                {t("export.consent_subheader_2")}
              </GlobalText>
              <GlobalText style={style.bodyText}>
                {t("export.consent_body_2")}
              </GlobalText>
            </View>

            <Button
              loading={isLoading}
              label={t("export.consent_button_title")}
              onPress={handleOnPressConfirm}
              customButtonStyle={style.button}
            />
          </ScrollView>
          <TouchableOpacity
            style={style.bottomButtonContainer}
            onPress={handleOnPressProtectPrivacy}
          >
            <GlobalText style={style.bottomButtonText}>
              {t("onboarding.protect_privacy_button")}
            </GlobalText>
            <SvgXml
              xml={Icons.ChevronUp}
              fill={Colors.primaryBlue}
              width={Iconography.xxSmall}
              height={Iconography.xxSmall}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  )
}

const style = StyleSheet.create({
  topSafeArea: {
    backgroundColor: Colors.primaryLightBackground,
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: Colors.secondary10,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  navButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    paddingTop: 25,
    width: "100%",
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral10,
    backgroundColor: Colors.primaryLightBackground,
    zIndex: Layout.zLevel1,
  },
  backButtonInnerContainer: {
    padding: Spacing.medium,
  },
  cancelButtonInnerContainer: {
    padding: Spacing.medium,
  },
  contentContainer: {
    paddingHorizontal: Spacing.large,
    paddingTop: 105,
    paddingBottom: Spacing.huge,
  },
  content: {
    marginBottom: Spacing.small,
  },
  header: {
    ...Typography.header2,
    paddingBottom: Spacing.medium,
  },
  subheaderText: {
    ...Typography.mainContent,
    ...Typography.mediumBold,
    color: Colors.black,
    marginBottom: Spacing.xxSmall,
  },
  bodyText: {
    ...Typography.mainContent,
    marginBottom: Spacing.xxLarge,
  },
  button: {
    alignSelf: "flex-start",
  },
  bottomButtonContainer: {
    backgroundColor: Colors.secondary10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.small,
    borderTopColor: Colors.neutral25,
    borderTopWidth: Outlines.hairline,
  },
  bottomButtonText: {
    ...Typography.header5,
    color: Colors.primary100,
    marginRight: Spacing.xSmall,
  },
})

export default PublishConsentForm
