import React from "react"
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"

import { RTLEnabledText } from "../components/RTLEnabledText"

import { Images } from "../assets"
import { Colors, Spacing, Typography } from "../styles"

const PRIVACY_POLICY_URL = "https://pathcheck.org/privacy-policy/"

const Licenses = (): JSX.Element => {
  const { t } = useTranslation()

  const legalHeaderText = t("label.legal_page_header_bluetooth")

  const infoAddress = "info@pathcheck.org"
  const pathCheckAddress = "pathcheck.org"

  const handleOnPressOpenUrl = (url: string) => {
    return () => Linking.openURL(url)
  }

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
            {legalHeaderText}
          </RTLEnabledText>
          <View
            style={{ paddingTop: Spacing.xSmall, paddingLeft: Spacing.medium }}
          >
            <RTLEnabledText style={style.contentText}>
              {t("label.legal_page_address")}
            </RTLEnabledText>
            <View style={{ height: 20 }} />
            <RTLEnabledText
              onPress={handleOnPressOpenUrl("mailto:info@pathcheck.org")}
              style={style.hyperlink}
            >
              {infoAddress}
            </RTLEnabledText>
            <RTLEnabledText
              onPress={handleOnPressOpenUrl("https://pathcheck.org/")}
              style={style.hyperlink}
            >
              {pathCheckAddress}
            </RTLEnabledText>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={style.termsInfoRow}
        onPress={handleOnPressOpenUrl(PRIVACY_POLICY_URL)}
      >
        <RTLEnabledText
          style={{ ...Typography.mainContent, color: Colors.white }}
        >
          {t("label.privacy_policy")}
        </RTLEnabledText>
        <View style={style.arrowContainer}>
          <Image source={Images.ForeArrow} />
        </View>
      </TouchableOpacity>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.primaryBackgroundFaintShade,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerContent: {
    ...Typography.header2,
  },
  hyperlink: {
    ...Typography.secondaryContent,
    color: Colors.linkText,
    textDecorationLine: "underline",
  },
  termsInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.primaryBlue,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  arrowContainer: {
    alignSelf: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
  contentText: {
    ...Typography.secondaryContent,
  },
})

export default Licenses
