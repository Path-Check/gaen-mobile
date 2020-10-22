import React, { FunctionComponent } from "react"
import { ScrollView, View, Image, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "../components"

import { Typography, Spacing, Colors } from "../styles"
import { Images } from "../assets"

const BluetoothInfo: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.mainContentContainer}
      alwaysBounceVertical={false}
    >
      <View style={style.textContainer}>
        <Text style={style.bodyText}>{t("home.bluetooth_info_body")}</Text>
      </View>
      <Image
        source={Images.ProtectPrivacyReceiveKeys}
        style={style.bodyImage}
      />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  mainContentContainer: {
    paddingTop: Spacing.large,
    paddingBottom: Spacing.huge,
  },
  bodyImage: {
    width: "100%",
    height: 290,
    resizeMode: "contain",
  },
  textContainer: {
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.small,
  },
  bodyText: {
    ...Typography.body1,
  },
})
export default BluetoothInfo
