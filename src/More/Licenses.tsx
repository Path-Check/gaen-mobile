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
import env from "react-native-config"
import { useApplicationName } from "./useApplicationInfo"

import { GlobalText } from "../components/GlobalText"

import { Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

const Licenses: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()

  const privacyPolicyUrl =
    env.PRIVACY_POLICY_URL || "https://pathcheck.org/privacy-policy/"
  const healthAuthorityName =
    env.GAEN_AUTHORITY_NAME || "PathCheck Organization"
  const haAddressLine1 = env.GAEN_AUTHORITY_ADDRESS_LINE_1 || "58 Day Street"
  const haAddressLine2 = env.GAEN_AUTHORITY_ADDRESS_LINE_2 || "Box 441621"
  const haAddressLine3 =
    env.GAEN_AUTHORITY_ADDRESS_LINE_3 || "Somerville, MA 02144"
  const haAddressLine4 = env.GAEN_AUTHORITY_ADDRESS_LINE_4 || "USA"
  const healthAuthorityURL = env.GAEN_AUTHORITY_URL || "https://pathcheck.org"

  return (
    <>
      <ScrollView
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View>
          <GlobalText
            style={style.headerContent}
            testID={"licenses-legal-header"}
          >
            {applicationName}
          </GlobalText>
          <View style={style.contentTextContainer}>
            <GlobalText style={style.contentText}>
              {healthAuthorityName}
            </GlobalText>
            <GlobalText style={style.contentText}>{haAddressLine1}</GlobalText>
            {haAddressLine2 !== "N/A" && (
              <GlobalText style={style.contentText}>
                {haAddressLine2}
              </GlobalText>
            )}
            <GlobalText style={style.contentText}>{haAddressLine3}</GlobalText>
            <GlobalText style={style.contentText}>{haAddressLine4}</GlobalText>
          </View>
          <GlobalText
            onPress={() => Linking.openURL(healthAuthorityURL)}
            style={style.hyperlink}
          >
            {healthAuthorityURL}
          </GlobalText>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={style.privacyPolicy}
        onPress={() => Linking.openURL(privacyPolicyUrl)}
      >
        <GlobalText style={style.privacyPolicyText}>
          {t("label.privacy_policy")}
        </GlobalText>
        <SvgXml xml={Icons.ChevronRight} fill={Colors.white} />
      </TouchableOpacity>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  headerContent: {
    ...Typography.header2,
    marginBottom: Spacing.small,
    color: Colors.primary150,
  },
  contentTextContainer: {
    marginBottom: Spacing.small,
  },
  contentText: {
    ...Typography.secondaryContent,
    ...Typography.mediumBold,
    color: Colors.primary110,
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
    backgroundColor: Colors.primary100,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.small,
  },
  privacyPolicyText: {
    ...Typography.mainContent,
    color: Colors.white,
  },
})

export default Licenses
