import React, { FunctionComponent } from "react"
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native"
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
  } = useCustomCopy()
  const { healthAuthorityVerificationCodeInfoUrl } = useConfigurationContext()

  const verificationCodeInfoText =
    verificationCodeInfo ||
    t("export.verification_code_info.info_body", { healthAuthorityName })
  const verificationCodeHowDoIGetText =
    verificationCodeHowDoIGet ||
    t("export.verification_code_info.how_do_i_get_body", {
      healthAuthorityName,
    })

  const handleOnPressLink = () => {
    const url = healthAuthorityVerificationCodeInfoUrl
    if (url) {
      Linking.openURL(url)
    }
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
          {Boolean(healthAuthorityVerificationCodeInfoUrl) && (
            <TouchableOpacity style={style.button} onPress={handleOnPressLink}>
              <Text style={style.buttonText}>{t("common.learn_more")}</Text>
              <SvgXml xml={Icons.Arrow} fill={Colors.primary.shade100} />
            </TouchableOpacity>
          )}
        </View>
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("export.verification_code_info.what_happens_header")}
          </Text>
          <Text style={style.contentText}>
            {t("export.verification_code_info.what_happens_body")}
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
    paddingTop: Spacing.small,
  },
  button: {
    ...Buttons.outlined.base,
    marginBottom: Spacing.small,
  },
  buttonText: {
    ...Typography.button.outlined,
    marginRight: Spacing.small,
  },
})

export default MoreInfo
