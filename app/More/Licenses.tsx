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
import { useNavigation } from "@react-navigation/native"

import { NavigationBarWrapper } from "../components/NavigationBarWrapper"
import { RTLEnabledText } from "../components/RTLEnabledText"

import { Images } from "../assets"
import { Colors, Spacing } from "../styles"

const PRIVACY_POLICY_URL = "https://pathcheck.org/privacy-policy/"

const Licenses = (): JSX.Element => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const legalHeaderText = t("label.legal_page_header_bluetooth")

  const backToMain = () => {
    navigation.goBack()
  }

  const infoAddress = "info@pathcheck.org"
  const pathCheckAddress = "pathcheck.org"

  const handleOnPressOpenUrl = (url: string) => {
    return () => Linking.openURL(url)
  }

  return (
    <NavigationBarWrapper
      title={t("screen_titles.legal")}
      onBackPress={backToMain}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        alwaysBounceVertical={false}
      >
        <View>
          <RTLEnabledText use="headline2" testID={"licenses-legal-header"}>
            {legalHeaderText}
          </RTLEnabledText>
          <View
            style={{ paddingTop: Spacing.xSmall, paddingLeft: Spacing.medium }}
          >
            <RTLEnabledText use="body2">
              {t("label.legal_page_address")}
            </RTLEnabledText>
            <View style={{ height: 20 }} />
            <RTLEnabledText
              use="body2"
              onPress={handleOnPressOpenUrl("mailto:info@pathcheck.org")}
              style={styles.hyperlink}
            >
              {infoAddress}
            </RTLEnabledText>
            <RTLEnabledText
              use="body2"
              onPress={handleOnPressOpenUrl("https://pathcheck.org/")}
              style={styles.hyperlink}
            >
              {pathCheckAddress}
            </RTLEnabledText>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.termsInfoRow}
        onPress={handleOnPressOpenUrl(PRIVACY_POLICY_URL)}
      >
        <RTLEnabledText style={{ color: Colors.white }} use="body1">
          {t("label.privacy_policy")}
        </RTLEnabledText>
        <View style={styles.arrowContainer}>
          <Image source={Images.ForeArrow} />
        </View>
      </TouchableOpacity>
    </NavigationBarWrapper>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.primaryBackgroundFaintShade,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  hyperlink: {
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
})

export default Licenses
