import React, { useState, FunctionComponent } from "react"
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import { GradientBackground } from "../components"
import { GlobalText, Button } from "../components"
import { ActivationScreens } from "../navigation"

import {
  Forms,
  Iconography,
  Colors,
  Spacing,
  Outlines,
  Typography,
} from "../styles"
import { useStatusBarEffect } from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"

const AcceptEula: FunctionComponent = () => {
  useStatusBarEffect("dark-content")
  const configuration = useConfigurationContext()
  const [boxChecked, toggleCheckbox] = useState(false)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressNext = () => {
    navigation.navigate(ActivationScreens.ActivateProximityTracing)
  }

  const linkToPrivacyPolicy = async () => {
    await Linking.openURL(configuration.healthAuthorityPrivacyPolicyUrl)
  }

  const linkToEula = async () => {
    await Promise.resolve()
  }

  const checkboxIcon = boxChecked
    ? Icons.CheckboxChecked
    : Icons.CheckboxUnchecked

  const checkboxLabel = boxChecked
    ? t("label.checked_checkbox")
    : t("label.unchecked_checkbox")

  return (
    <GradientBackground gradient={Colors.gradientPrimary10}>
      <SafeAreaView style={style.container}>
        <GlobalText style={style.headerText}>
          {t("onboarding.terms_header_title")}
        </GlobalText>
        <EulaLink
          docName={"onboarding.privacy_policy"}
          onPress={linkToPrivacyPolicy}
        />
        <EulaLink docName={"onboarding.eula"} onPress={linkToEula} />
        <View style={style.footerContainer}>
          <TouchableOpacity
            style={style.checkboxContainer}
            onPress={() => toggleCheckbox(!boxChecked)}
            accessible
            accessibilityRole="checkbox"
            accessibilityLabel={checkboxLabel}
            testID="accept-terms-of-use-checkbox"
          >
            <SvgXml
              xml={checkboxIcon}
              fill={Colors.primary100}
              width={Iconography.small}
              height={Iconography.small}
            />
            <GlobalText style={style.checkboxText}>
              {t("onboarding.eula_agree_terms_of_use")}
            </GlobalText>
          </TouchableOpacity>
          <Button
            onPress={handleOnPressNext}
            disabled={!boxChecked}
            label={t("common.continue")}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  )
}

type EulaLinkProps = {
  docName: string
  onPress: () => Promise<void>
}
const EulaLink: FunctionComponent<EulaLinkProps> = ({ docName, onPress }) => {
  const { t } = useTranslation()
  return (
    <TouchableOpacity style={style.eulaLinkContainer} onPress={onPress}>
      <View style={style.eulaTextContainer}>
        <GlobalText style={style.eulaText}>
          {t("onboarding.please_read_the")}
        </GlobalText>
        <Text> </Text>
        <GlobalText style={style.eulaLink}>{t(docName)}</GlobalText>
      </View>
      <SvgXml
        xml={Icons.Arrow}
        fill={Colors.primary100}
        style={style.eulaLinkArrow}
      />
    </TouchableOpacity>
  )
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    margin: Spacing.xxLarge,
  },
  headerText: {
    ...Typography.header1,
  },
  eulaLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.small,
    marginTop: Spacing.large,
    backgroundColor: Colors.primaryLightBackground,
    ...Outlines.lightShadow,
  },
  eulaTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
  },
  eulaText: {
    ...Typography.body1,
    fontSize: Typography.large,
  },
  eulaLink: {
    ...Typography.anchorLink,
    flexWrap: "wrap",
    fontSize: Typography.large,
  },
  eulaLinkArrow: {
    flex: 1,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Spacing.xxLarge,
    marginHorizontal: Spacing.xLarge,
  },
  checkboxText: {
    ...Forms.checkboxText,
    color: Colors.primaryText,
    flex: 1,
    paddingLeft: Spacing.medium,
    ...Typography.body1,
    fontSize: Typography.large,
  },
})

export default AcceptEula
