import React, { FunctionComponent } from "react"
import {
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Linking,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  View,
  Share,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import env from "react-native-config"

import {
  usePermissionsContext,
  ENPermissionStatus,
} from "../PermissionsContext"
import { useStatusBarEffect, Stacks, HomeScreens } from "../navigation"
import { useApplicationInfo } from "../More/useApplicationInfo"
import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { isPlatformiOS } from "../utils/index"

import { Icons, Images } from "../assets"
import {
  Spacing,
  Colors,
  Typography,
  Layout,
  Outlines,
  Iconography,
} from "../styles"
import { useBluetoothStatus } from "./useBluetoothStatus"

const HomeScreen: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { exposureNotifications } = usePermissionsContext()
  const [
    authorization,
    enablement,
  ]: ENPermissionStatus = exposureNotifications.status
  const { applicationName } = useApplicationInfo()
  const insets = useSafeAreaInsets()
  useStatusBarEffect("light-content")
  const btStatus = useBluetoothStatus()

  const isEnabled = enablement === "ENABLED"
  const isAuthorized = authorization === "AUTHORIZED"
  const isEnabledAndAuthorized = isEnabled && isAuthorized

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

  const showBluetoothDisabledAlert = () => {
    Alert.alert(
      t("home.bluetooth.bluetooth_disabled_error_title"),
      t("home.bluetooth.bluetooth_disabled_error_message"),
      [
        {
          text: t("common.okay"),
        },
      ],
    )
  }

  const handleOnPressShare = async () => {
    const isIOS = Platform.OS === "ios"

    const appDownloadLink = isIOS
      ? env.IOS_APP_STORE_URL
      : env.ANDROID_PLAY_STORE_URL

    try {
      await Share.share({
        message: t("home.bluetooth.share_message", {
          applicationName,
          appDownloadLink,
        }),
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleOnPressBluetooth = () => {
    showBluetoothDisabledAlert()
  }

  const handleOnPressProximityTracing = () => {
    if (isAuthorized) {
      exposureNotifications.request()
    } else if (isPlatformiOS()) {
      showUnauthorizedAlert()
    }
  }

  const isProximityTracingOn = isEnabledAndAuthorized
  const isBluetoothOn = btStatus
  const appIsActive = isProximityTracingOn && isBluetoothOn

  const bottomContainerStyle = {
    ...style.bottomContainer,
    maxHeight: insets.bottom + Layout.screenHeight * 0.475,
  }

  const backgroundImage = appIsActive ? Images.HomeActive : Images.HomeInactive

  const headerText = appIsActive
    ? t("home.bluetooth.tracing_on_header")
    : t("home.bluetooth.tracing_off_header")

  const subheaderText = appIsActive
    ? t("home.bluetooth.all_services_on_subheader", { applicationName })
    : t("home.bluetooth.tracing_off_subheader")

  return (
    <View style={style.container}>
      <ImageBackground style={style.backgroundImage} source={backgroundImage} />
      <View style={style.textContainer}>
        <GlobalText style={style.headerText} testID={"home-header"}>
          {headerText}
        </GlobalText>
        <GlobalText style={style.subheaderText} testID={"home-subheader"}>
          {subheaderText}
        </GlobalText>
      </View>
      <SafeAreaView style={style.safeArea}>
        <ScrollView style={bottomContainerStyle}>
          <TouchableOpacity
            style={style.shareContainer}
            onPress={handleOnPressShare}
          >
            <View style={style.shareImageContainer}>
              <Image source={Images.HugEmoji} style={style.shareImage} />
            </View>
            <View style={style.shareTextContainer}>
              <GlobalText style={style.shareText}>
                {t("home.bluetooth.share")}
              </GlobalText>
            </View>
            <View style={style.shareIconContainer}>
              <SvgXml
                xml={Icons.Share}
                width={Iconography.small}
                height={Iconography.small}
              />
            </View>
          </TouchableOpacity>
          <View style={style.activationStatusSectionContainer}>
            <ActivationStatusSection
              headerText={t("home.bluetooth.bluetooth_header")}
              isActive={isBluetoothOn}
              infoAction={() => navigation.navigate(HomeScreens.BluetoothInfo)}
              fixAction={handleOnPressBluetooth}
              testID={"home-bluetooth-status-container"}
            />
            <ActivationStatusSection
              headerText={t("home.bluetooth.proximity_tracing_header")}
              isActive={isProximityTracingOn}
              infoAction={() =>
                navigation.navigate(HomeScreens.ProximityTracingInfo)
              }
              fixAction={handleOnPressProximityTracing}
              testID={"home-proximity-tracing-status-container"}
            />
          </View>
          <View style={style.buttonContainer}>
            <Button
              onPress={() => navigation.navigate(Stacks.AffectedUserStack)}
              label={t("home.bluetooth.report_positive_result")}
              customButtonStyle={style.button}
              hasRightArrow
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

interface ActivationStatusProps {
  headerText: string
  isActive: boolean
  infoAction: () => void
  fixAction: () => void
  testID: string
}

const ActivationStatusSection: FunctionComponent<ActivationStatusProps> = ({
  headerText,
  isActive,
  infoAction,
  fixAction,
  testID,
}) => {
  const { t } = useTranslation()

  const bodyText = isActive ? t("common.enabled") : t("common.disabled")
  const icon = isActive ? Icons.CheckInCircle : Icons.XInCircle
  const iconFill = isActive ? Colors.primaryGreen : Colors.tertiaryRed

  return (
    <TouchableOpacity
      onPress={isActive ? infoAction : fixAction}
      style={style.activationStatusContainer}
      testID={testID}
    >
      <View style={style.activationStatusLeftContainer}>
        <SvgXml
          xml={icon}
          fill={iconFill}
          width={Iconography.medium}
          height={Iconography.medium}
        />
        <View style={style.activationStatusTextContainer}>
          <GlobalText style={style.bottomHeaderText}>{headerText}</GlobalText>
          <GlobalText style={style.bottomBodyText}>{bodyText}</GlobalText>
        </View>
      </View>
      <View style={style.activationStatusRightContainer}>
        {isActive ? (
          <SvgXml xml={Icons.HomeInfo} />
        ) : (
          <View style={style.fixContainer}>
            <GlobalText style={style.fixText}>
              {t("home.bluetooth.fix")}
            </GlobalText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const backgroundImagePaddingTop = Platform.select({ ios: 500, android: 570 })

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: backgroundImagePaddingTop,
    width: "100%",
  },
  textContainer: {
    alignSelf: "center",
    marginHorizontal: Spacing.medium,
    position: "absolute",
    top: "27.5%",
    alignItems: "center",
  },
  headerText: {
    ...Typography.header1,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  subheaderText: {
    ...Typography.header5,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.primaryBackground,
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.small,
    paddingLeft: Spacing.small,
    backgroundColor: Colors.faintGray,
    borderBottomColor: Colors.lightestGray,
    borderBottomWidth: Outlines.hairline,
  },
  shareImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.tertiaryViolet,
    borderRadius: Outlines.borderRadiusMax,
    width: Iconography.medium,
    height: Iconography.medium,
  },
  shareImage: {
    width: Iconography.small,
    height: Iconography.small,
  },
  shareTextContainer: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  shareText: {
    ...Typography.header4,
  },
  shareIconContainer: {
    paddingHorizontal: Spacing.medium,
  },
  activationStatusSectionContainer: {
    marginBottom: Spacing.medium,
  },
  activationStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.large,
    marginHorizontal: Spacing.small,
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.lightestGray,
  },
  activationStatusLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activationStatusTextContainer: {
    marginLeft: Spacing.medium,
  },
  activationStatusRightContainer: {
    width: 60,
    alignItems: "center",
  },
  fixContainer: {
    alignItems: "center",
    backgroundColor: Colors.tertiaryRed,
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.small,
    borderRadius: Outlines.baseBorderRadius,
  },
  fixText: {
    ...Typography.base,
    ...Typography.bold,
    fontSize: Typography.medium,
    color: Colors.white,
  },
  bottomHeaderText: {
    ...Typography.header4,
    marginBottom: Spacing.xxxSmall,
  },
  bottomBodyText: {
    ...Typography.secondaryContent,
  },
  buttonContainer: {
    marginBottom: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  button: {
    alignSelf: "center",
    width: "100%",
  },
})

export default HomeScreen
