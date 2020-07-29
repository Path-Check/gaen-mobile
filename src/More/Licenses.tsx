import React, { FunctionComponent } from "react"
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { getApplicationName } from "react-native-device-info"

import { RTLEnabledText } from "../components/RTLEnabledText"

import { Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

const Licenses: FunctionComponent = () => {
  const { t } = useTranslation()

  const infoEmailAddress = "info@pathcheck.org"
  const infoEmailLink = "mailto:info@pathcheck.org"
  const pathCheckWebAddress = "pathcheck.org"
  const pathCheckUrl = "https://pathcheck.org/"
  const privacyPolicyUrl = "https://pathcheck.org/privacy-policy/"

  return (
    <>
      <ScrollView
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View>
          <RTLEnabledText
            style={style.headerContent}
            testID={"licenses-legal-header"}
          >
            {getApplicationName()}
          </RTLEnabledText>
          <RTLEnabledText style={style.contentText}>
            {t("label.legal_page_address")}
          </RTLEnabledText>
          <RTLEnabledText
            onPress={() => Linking.openURL(infoEmailLink)}
            style={style.hyperlink}
          >
            {infoEmailAddress}
          </RTLEnabledText>
          <RTLEnabledText
            onPress={() => Linking.openURL(pathCheckUrl)}
            style={style.hyperlink}
          >
            {pathCheckWebAddress}
          </RTLEnabledText>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={style.privacyPolicy}
        onPress={() => Linking.openURL(privacyPolicyUrl)}
      >
        <RTLEnabledText style={style.privacyPolicyText}>
          {t("label.privacy_policy")}
        </RTLEnabledText>
        <SvgXml xml={Icons.ChevronRight} fill={Colors.white} />
      </TouchableOpacity>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundFaintShade,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  headerContent: {
    ...Typography.header3,
    marginBottom: Spacing.small,
  },
  contentText: {
    ...Typography.secondaryContent,
    marginBottom: Spacing.small,
  },
  hyperlink: {
    ...Typography.secondaryContent,
    color: Colors.linkText,
    textDecorationLine: "underline",
  },
  privacyPolicy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primaryBlue,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
  },
  privacyPolicyText: {
    ...Typography.mainContent,
    color: Colors.white,
  },
})

export default Licenses
