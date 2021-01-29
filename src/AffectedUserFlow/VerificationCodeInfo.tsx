import React, { FunctionComponent } from "react"
import { View, ScrollView, Pressable, StyleSheet, Linking } from "react-native"
import { useTranslation } from "react-i18next"
import { useStatusBarEffect } from "../navigation/index"
import { useCustomCopy } from "../configuration/useCustomCopy"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"
import { useConfigurationContext } from "../ConfigurationContext"

import { Spacing, Typography, Colors, Buttons } from "../styles"
import { Icons } from "../assets"

const MoreInfo: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const {
    healthAuthorityName,
    verificationCodeInfo,
    verificationCodeHowDoIGet,
    verificationCodeOnSubmitInfo,
  } = useCustomCopy()
  const {
    healthAuthorityVerificationCodeInfoUrl,
    supportPhoneNumber,
  } = useConfigurationContext()

  const verificationCodeInfoText =
    verificationCodeInfo ||
    t("export.verification_code_info.info_body", { healthAuthorityName })
  const verificationCodeHowDoIGetText =
    verificationCodeHowDoIGet ||
    t("export.verification_code_info.how_do_i_get_body", {
      healthAuthorityName,
    })
  const verificationCodeOnSubmitInfoText =
    verificationCodeOnSubmitInfo ||
    t("export.verification_code_info.what_happens_body")

  const handleOnPressLink = () => {
    const url = healthAuthorityVerificationCodeInfoUrl
    if (url) {
      Linking.openURL(url)
    }
  }

  const handleOnPressSupportNumber = () => {
    Linking.openURL(`tel:${supportPhoneNumber}`)
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("export.verification_code_info.info_header")}
          </Text>
          <Text style={style.contentText}>{verificationCodeInfoText}</Text>
        </View>
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("export.verification_code_info.how_do_i_get_header")}
          </Text>
          <Text style={style.contentText}>{verificationCodeHowDoIGetText}</Text>
          {Boolean(supportPhoneNumber) && (
            <View style={style.supportNumberContainer}>
              <Text style={style.contentText}>
                {t("export.verification_code_info.contact_at", {
                  healthAuthorityName,
                })}
              </Text>

              <Pressable
                onPress={handleOnPressSupportNumber}
                style={style.supportNumberButton}
              >
                <Text style={style.supportNumberButtonText}>
                  {supportPhoneNumber}
                </Text>
              </Pressable>
            </View>
          )}
          {Boolean(healthAuthorityVerificationCodeInfoUrl) && (
            <Pressable style={style.button} onPress={handleOnPressLink}>
              <Text style={style.buttonText}>{t("common.learn_more")}</Text>
              <SvgXml xml={Icons.Arrow} fill={Colors.primary.shade100} />
            </Pressable>
          )}
        </View>
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("export.verification_code_info.what_happens_header")}
          </Text>
          <Text style={style.contentText}>
            {verificationCodeOnSubmitInfoText}
          </Text>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
    padding: Spacing.medium,
  },
  contentContainer: {
    paddingBottom: Spacing.xLarge,
  },
  headerText: {
    ...Typography.header.x20,
  },
  section: {
    paddingBottom: Spacing.xLarge,
  },
  contentText: {
    ...Typography.body.x30,
  },
  supportNumberContainer: {
    width: "100%",
    marginTop: Spacing.xSmall,
  },
  supportNumberText: {
    ...Typography.body.x30,
  },
  supportNumberButton: {
    paddingVertical: Spacing.tiny,
  },
  supportNumberButtonText: {
    ...Typography.button.anchorLink,
  },
  button: {
    ...Buttons.outlined.base,
    marginVertical: Spacing.small,
  },
  buttonText: {
    ...Typography.button.outlined,
    marginRight: Spacing.small,
  },
})

export default MoreInfo
