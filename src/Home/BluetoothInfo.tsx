import React, { FunctionComponent } from "react"
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { Text } from "../components"

import { Layout, Typography, Spacing, Colors, Iconography } from "../styles"
import { Icons, Images } from "../assets"

const BluetoothInfo: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <Text style={style.headerText}>{t("home.bluetooth_info_header")}</Text>
        <Image source={Images.InfoHeader} style={style.headerImage} />
        <TouchableOpacity
          style={style.closeIconContainer}
          onPress={navigation.goBack}
        >
          <SvgXml
            xml={Icons.ChevronLeft}
            fill={Colors.black}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
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
    </View>
  )
}

const headerHeight = 180

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors.primaryLightBackground,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    height: headerHeight,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary10,
    zIndex: Layout.zLevel1,
  },
  headerText: {
    flex: 10,
    ...Typography.header2,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xLarge,
    color: Colors.primary150,
  },
  headerImage: {
    width: 130,
    height: 100,
    resizeMode: "cover",
  },
  closeIconContainer: {
    position: "absolute",
    left: 0,
    top: Spacing.xLarge,
    padding: Spacing.medium,
  },
  mainContentContainer: {
    paddingTop: headerHeight + Spacing.large,
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
