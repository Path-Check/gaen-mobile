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

import { GlobalText } from "../components/GlobalText"

import { Layout, Typography, Spacing, Colors, Iconography } from "../styles"
import { Icons, Images } from "../assets"

const BluetoothInfo: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>
          {t("home.bluetooth_info_header")}
        </GlobalText>
        <TouchableOpacity
          style={style.closeIconContainer}
          onPress={navigation.goBack}
        >
          <SvgXml
            xml={Icons.XInCircle}
            fill={Colors.neutral30}
            width={Iconography.small}
            height={Iconography.small}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={style.mainContentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.textContainer}>
          <GlobalText style={style.bodyText}>
            {t("home.bluetooth_info_body")}
          </GlobalText>
        </View>
        <Image source={Images.PhonesSharingCodes} style={style.image} />
      </ScrollView>
    </View>
  )
}

const headerHeight = 70

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors.primaryLightBackground,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary10,
    zIndex: Layout.zLevel1,
    height: headerHeight,
  },
  headerText: {
    flex: 10,
    ...Typography.header2,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    color: Colors.primary125,
  },
  closeIconContainer: {
    flex: 1,
    alignItems: "flex-end",
    padding: Spacing.medium,
  },
  mainContentContainer: {
    paddingTop: headerHeight + Spacing.large,
    paddingBottom: Spacing.huge,
  },
  image: {
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
