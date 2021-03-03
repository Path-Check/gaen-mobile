import React, { FunctionComponent } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { EscrowVerificationRoutes } from "../navigation"
import { Colors, Buttons, Typography } from "../styles"
import { Icons } from "../assets"

const HasVerificationCode: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  /* When user presses on the button, send them to the "input verification code" screen. */
  const handlePress = () => {
    navigation.navigate(EscrowVerificationRoutes.EscrowVerificationCodeForm)
  }

  return (
    <View style={style.maincontainer}>
      <Pressable
        style={style.button}
        onPress={handlePress}
        accessibilityLabel={t("common.submit")}
      >
        <Text style={style.buttonText}>{t("common.hascode")}</Text>
        <SvgXml xml={Icons.Arrow} fill={Colors.neutral.white} />
      </Pressable>
    </View>
  )
}

const style = StyleSheet.create({
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
  maincontainer: {
    marginBottom: 20,
  },
})

/* Export our component */
export default HasVerificationCode
