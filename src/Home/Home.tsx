import React from "react"
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Linking,
} from "react-native"
import { useTranslation } from "react-i18next"

import { ENPermissionStatus } from "../PermissionsContext"
import { GlobalText } from "../components/GlobalText"
import { isPlatformiOS } from "../utils/index"

import { Layout, Spacing, Colors, Typography, Buttons } from "../styles"

interface HomeProps {
  enPermissionStatus: ENPermissionStatus
  requestPermission: () => void
}

const Home = ({
  enPermissionStatus,
  requestPermission,
}: HomeProps): JSX.Element => {
  const { t } = useTranslation()
  const [authorization, enablement] = enPermissionStatus
  const isEnabled = enablement === "ENABLED"
  const isAuthorized = authorization === "AUTHORIZED"

  const isEnabledAndAuthorized = isEnabled && isAuthorized

  const headerText = isEnabledAndAuthorized
    ? t("home.bluetooth.all_services_on_header")
    : t("home.bluetooth.tracing_off_header")
  const subheaderText = isEnabledAndAuthorized
    ? t("home.bluetooth.all_services_on_subheader")
    : t("home.bluetooth.tracing_off_subheader")
  const buttonText = t("home.bluetooth.tracing_off_button")

  const showUnauthorizedAlert = () => {
    Alert.alert(
      t("home.bluetooth.unauthorized_error_title"),
      t("home.bluetooth.unauthorized_error_message"),
      [
        {
          text: t("common.settings"),
          onPress: () => Linking.openSettings(),
        },
      ],
    )
  }

  const handleRequestPermission = () => {
    if (isAuthorized) {
      requestPermission()
    } else if (isPlatformiOS()) {
      showUnauthorizedAlert()
    }
  }

  return (
    <View style={style.container}>
      <View style={style.contentContainer}>
        <GlobalText style={style.headerText} testID={"home-header"}>
          {headerText}
        </GlobalText>
        <GlobalText style={style.subheaderText} testID={"home-subheader"}>
          {subheaderText}
        </GlobalText>
      </View>
      {!isEnabledAndAuthorized ? (
        <TouchableOpacity
          testID={"home-request-permissions-button"}
          onPress={handleRequestPermission}
          style={style.button}
        >
          <GlobalText style={style.buttonText}>{buttonText}</GlobalText>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    position: "absolute",
    top: Layout.screenHeight / 3,
    width: "100%",
  },
  headerText: {
    ...Typography.largerFont,
    ...Typography.bold,
    lineHeight: Typography.mediumLineHeight,
    color: Colors.white,
    textAlign: "center",
  },
  subheaderText: {
    ...Typography.header4,
    textAlign: "center",
    color: Colors.white,
    marginTop: Spacing.medium,
  },
  button: {
    ...Buttons.largeWhite,
    width: "100%",
  },
  buttonText: {
    ...Typography.buttonTextDark,
  },
})

export default Home
