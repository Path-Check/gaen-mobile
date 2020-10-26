import React, { FunctionComponent } from "react"
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Stacks } from "../navigation"
import { useApplicationInfo } from "../hooks/useApplicationInfo"

import { Images } from "../assets"
import { Buttons, Colors, Spacing, Typography } from "../styles"

const VerifyAge: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { applicationName } = useApplicationInfo()

  const handleOnPressConfirm = () => {
    navigation.navigate(Stacks.HowItWorks)
  }

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <Image source={Images.WelcomeImage} style={style.image} />
      <Text style={style.subheader}>
        {t("onboarding.may_only_be_used", { applicationName })}
      </Text>
      <TouchableOpacity
        style={style.button}
        onPress={handleOnPressConfirm}
        accessibilityLabel={t("label.launch_get_started")}
      >
        <Text style={style.buttonText}>{t("onboarding.i_am_over_18")}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background.primaryLight,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: Spacing.large,
  },
  subheader: {
    ...Typography.header5,
    marginBottom: Spacing.large,
  },
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    ...Typography.buttonPrimary,
  },
})

export default VerifyAge
