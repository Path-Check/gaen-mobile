import React, { useState, FunctionComponent } from "react"
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  View,
  ScrollView,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { Icons } from "../assets"
import { Text } from "../components"
import { ActivationStackScreens, useStatusBarEffect } from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"

import {
  Buttons,
  Iconography,
  Colors,
  Spacing,
  Outlines,
  Typography,
} from "../styles"

const AcceptTermsOfService: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const configuration = useConfigurationContext()
  const [boxChecked, toggleCheckbox] = useState(false)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressNext = () => {
    navigation.navigate(ActivationStackScreens.ActivateExposureNotifications)
  }

  const checkboxIcon = boxChecked
    ? Icons.CheckboxChecked
    : Icons.CheckboxUnchecked

  const checkboxLabel = boxChecked
    ? t("label.checked_checkbox")
    : t("label.unchecked_checkbox")

  return (
    <ScrollView
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <Text style={style.headerText}>
          {t("onboarding.terms_header_title")}
        </Text>
        <View style={style.linksContainer}>
          <DocumentLink
            docName={t("onboarding.privacy_policy")}
            url={configuration.healthAuthorityPrivacyPolicyUrl}
          />
          <DocumentLink
            docName={t("onboarding.eula")}
            url={configuration.healthAuthorityEulaUrl}
          />
        </View>
      </View>
      <View>
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
            fill={Colors.primary.shade100}
            width={Iconography.small}
            height={Iconography.small}
          />
          <Text style={style.checkboxText}>
            {t("onboarding.eula_agree_terms_of_use")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnPressNext}
          disabled={!boxChecked}
          style={boxChecked ? style.button : style.buttonDisabled}
          accessibilityLabel={t("common.continue")}
        >
          <Text
            style={boxChecked ? style.buttonText : style.buttonDisabledText}
          >
            {t("common.continue")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

type DocumentLinkProps = {
  docName: string
  url: string | null
}

const DocumentLink: FunctionComponent<DocumentLinkProps> = ({
  docName,
  url,
}) => {
  const { t } = useTranslation()

  if (url === null) {
    return null
  }

  const openLink = async () => {
    await Linking.openURL(url)
  }

  return (
    <TouchableOpacity style={style.linkContainer} onPress={openLink}>
      <View style={style.linkTextContainer}>
        <Text style={style.linkText}>{t("onboarding.please_read_the")}</Text>
        <Text style={style.link}>{docName}</Text>
      </View>
      <SvgXml
        xml={Icons.Arrow}
        fill={Colors.primary.shade100}
        style={style.linkArrow}
      />
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingTop: Spacing.xLarge,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxxLarge,
  },
  headerText: {
    ...Typography.header1,
  },
  linksContainer: {
    marginBottom: Spacing.large,
  },
  linkContainer: {
    ...Outlines.lightShadow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.small,
    marginVertical: Spacing.large,
    borderRadius: Outlines.baseBorderRadius,
    backgroundColor: Colors.background.primaryLight,
  },
  linkTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
  },
  linkText: {
    ...Typography.body1,
    fontSize: Typography.large,
  },
  link: {
    ...Typography.anchorLink,
    flexWrap: "wrap",
    fontSize: Typography.large,
  },
  linkArrow: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Spacing.xxLarge,
    marginHorizontal: Spacing.xLarge,
  },
  checkboxText: {
    ...Typography.body1,
    color: Colors.text.primary,
    flex: 1,
    paddingLeft: Spacing.medium,
    fontSize: Typography.large,
  },
  button: {
    ...Buttons.primary,
    alignSelf: "center",
  },
  buttonText: {
    ...Typography.buttonPrimary,
  },
  buttonDisabled: {
    ...Buttons.primaryDisabled,
    alignSelf: "center",
  },
  buttonDisabledText: {
    ...Typography.buttonPrimaryDisabled,
  },
})

export default AcceptTermsOfService
