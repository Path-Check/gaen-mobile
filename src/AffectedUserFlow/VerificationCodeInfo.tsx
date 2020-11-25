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

import { Spacing, Typography, Colors, Buttons } from "../styles"
import { Icons } from "../assets"

const MoreInfo: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const { healthAuthorityName, verificationCode } = useCustomCopy()

  const infoText =
    verificationCode?.info ||
    t("export.verification_code_info_body", { healthAuthorityName })
  const howDoIGetText =
    verificationCode?.howDoIGet ||
    t("export.how_do_i_get_body", { healthAuthorityName })

  const handleOnPressLink = () => {
    Linking.openUrl("")
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("export.verification_code_info_header")}
          </Text>
          <Text style={style.contentText}>{infoText}</Text>
        </View>
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("export.how_do_i_get_header")}
          </Text>
          <Text style={style.contentText}>{howDoIGetText}</Text>
        </View>
        <TouchableOpacity style={style.button} onPress={handleOnPressLink}>
          <Text style={style.buttonText}>{t("common.learn_more")}</Text>
          <SvgXml xml={Icons.Arrow} fill={Colors.primary.shade100} />
        </TouchableOpacity>
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
