import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, StyleSheet, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { GlobalText, Button } from "../components"
import { Typography, Spacing, Colors } from "../styles"
import { useStatusBarEffect } from "../navigation"
import { Images } from "../assets"
import { useCallbackFormContext } from "./CallbackFormContext"

const Success: FunctionComponent = () => {
  const { t } = useTranslation()
  const { callBackRequestCompleted } = useCallbackFormContext()
  const navigation = useNavigation()
  useStatusBarEffect("light-content", Colors.headerBackground)

  navigation.setOptions({
    headerLeft: null,
    title: t("callback.success_requested"),
  })

  const handleOnPressGotIt = () => {
    callBackRequestCompleted()
  }

  return (
    <ScrollView contentContainerStyle={style.contentContainer}>
      <Image
        source={Images.PersonAndHealthExpert}
        style={style.image}
        accessible
        accessibilityLabel={t("onboarding.welcome_image_label")}
      />
      <GlobalText style={style.header}>
        {t("callback.success_header")}
      </GlobalText>
      <GlobalText style={style.body}>{t("callback.success_body")}</GlobalText>
      <Button
        label={t("callback.success_got_it")}
        onPress={handleOnPressGotIt}
      />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing.large,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.medium,
  },
  body: {
    ...Typography.body1,
    marginBottom: Spacing.large,
  },
  image: {
    width: "97%",
    height: 220,
    marginBottom: Spacing.huge,
  },
})

export default Success
