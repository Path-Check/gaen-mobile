import React, { FunctionComponent } from "react"
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { GlobalText } from "../components/GlobalText"

import { Layout, Typography, Spacing, Colors, Iconography } from "../styles"
import { Icons } from "../assets"

const BluetoothInfo: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()

  return (
    <View style={style.container}>
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>
          {t("home.proximity_tracing_info_header")}
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
          <GlobalText style={style.subheaderText}>
            {t("home.proximity_tracing_info_subheader_1")}
          </GlobalText>
          <GlobalText style={style.bodyText}>
            {t("home.proximity_tracing_info_body_1")}
          </GlobalText>
          <GlobalText style={style.subheaderText}>
            {t("home.proximity_tracing_info_subheader_2")}
          </GlobalText>
          <GlobalText style={style.bodyText}>
            {t("home.proximity_tracing_info_body_2")}
          </GlobalText>
        </View>
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
    ...Typography.header3,
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
  textContainer: {
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.small,
  },
  subheaderText: {
    ...Typography.mainContent,
    ...Typography.mediumBold,
    color: Colors.primaryText,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.mainContent,
    marginBottom: Spacing.xxLarge,
  },
})
export default BluetoothInfo
