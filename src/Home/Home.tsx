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

import { usePermissionsContext } from "../PermissionsContext"
import { Screens, useStatusBarEffect, Stacks, HomeScreens } from "../navigation"
import { useApplicationInfo } from "../More/useApplicationInfo"
import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { isPlatformiOS } from "../utils/index"
import { getLocalNames } from "../locales/languages"

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
import { useConfigurationContext } from "../ConfigurationContext"

const HomeScreen: FunctionComponent = () => {
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const navigation = useNavigation()
  const { exposureNotifications } = usePermissionsContext()
  const { applicationName } = useApplicationInfo()
  const insets = useSafeAreaInsets()
  useStatusBarEffect("light-content")
  const btStatus = useBluetoothStatus()
  const configuration = useConfigurationContext()

  const isAuthorized = exposureNotifications.status.authorized
  const isEnabled = exposureNotifications.status.enabled
  const isEnabledAndAuthorized = isEnabled && isAuthorized

  const showUnauthorizedAlert = () => {
    Alert.alert(
      t("home.bluetooth.unauthorized_error_title"),
      t("home.bluetooth.unauthorized_error_message"),
      [
        {
          text: t("common.back"),
          style: "cancel",
        },
        {
          text: t("common.settings"),
          onPress: () => Linking.openSettings(),
        },
      ],
    )
  }

  const showEnableProximityTracingAlert = () => {
    Alert.alert(
      t("onboarding.proximity_tracing_alert_header", { applicationName }),
      t("onboarding.proximity_tracing_alert_body", { applicationName }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.enable"),
          onPress: exposureNotifications.request,
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
    try {
      await Share.share({
        message: t("home.bluetooth.share_message", {
          applicationName,
          appDownloadLink: configuration.appDownloadLink,
        }),
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleOnPressFixBluetooth = () => {
    showBluetoothDisabledAlert()
  }

  const handleOnPressFixProximityTracing = () => {
    if (!isAuthorized && isPlatformiOS()) {
      showUnauthorizedAlert()
    } else {
      showEnableProximityTracingAlert()
    }
  }

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Screens.LanguageSelection)
  }

  const isProximityTracingOn = isEnabledAndAuthorized
  const isBluetoothOn = btStatus
  const appIsActive = isProximityTracingOn && isBluetoothOn

  const iosMaxHeight = insets.bottom + Layout.screenHeight * 0.475 - 10
  const androidMaxHeight = insets.bottom + Layout.screenHeight * 0.475 - 30
  const bottomContainerStyle = {
    ...style.bottomContainer,
    maxHeight: Platform.select({
      ios: iosMaxHeight,
      android: androidMaxHeight,
    }),
  }

  const iosTopSpacing = Layout.screenHeight * 0.225 - insets.top + 55
  const androidTopSpacing = Layout.screenHeight * 0.225 - insets.top + 80
  const textContainerStyle = {
    ...style.textContainer,
    top: Platform.select({
      ios: iosTopSpacing,
      android: androidTopSpacing,
    }),
  }

  const iosPaddingTop = Layout.screenHeight * 0.5 - insets.top + 300
  const androidPaddingTop = 680
  const backgroundImageStyle = {
    ...style.backgroundImage,
    paddingTop: Platform.select({
      ios: iosPaddingTop,
      android: androidPaddingTop,
    }),
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
      <ImageBackground style={backgroundImageStyle} source={backgroundImage} />
      <View style={style.languageButtonOuterContainer}>
        <TouchableOpacity
          onPress={handleOnPressSelectLanguage}
          style={style.languageButtonContainer}
        >
          <GlobalText style={style.languageButtonText}>
            {languageName}
          </GlobalText>
        </TouchableOpacity>
      </View>
      <View style={textContainerStyle}>
        <GlobalText style={style.headerText} testID={"home-header"}>
          {headerText}
        </GlobalText>
        <GlobalText style={style.subheaderText} testID={"home-subheader"}>
          {subheaderText}
        </GlobalText>
      </View>
      <SafeAreaView style={bottomContainerStyle}>
        <ScrollView contentContainerStyle={style.bottomContentContainer}>
          <TouchableOpacity
            style={style.shareContainer}
            onPress={handleOnPressShare}
            accessibilityLabel={t("home.bluetooth.share")}
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
              fixAction={handleOnPressFixBluetooth}
              testID={"home-bluetooth-status-container"}
            />
            <ActivationStatusSection
              headerText={t("home.bluetooth.proximity_tracing_header")}
              isActive={isProximityTracingOn}
              infoAction={() =>
                navigation.navigate(HomeScreens.ProximityTracingInfo)
              }
              fixAction={handleOnPressFixProximityTracing}
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
  const iconFill = isActive ? Colors.success100 : Colors.danger75

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
          <View style={style.fixButtonContainer}>
            <GlobalText style={style.fixButtonText}>
              {t("home.bluetooth.fix")}
            </GlobalText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
const activationStatusRightWidth = 70
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: "100%",
  },
  languageButtonOuterContainer: {
    position: "absolute",
    top: Layout.oneTwentiethHeight,
    width: "100%",
  },
  languageButtonContainer: {
    alignSelf: "center",
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.transparentNeutral30,
    borderRadius: Outlines.borderRadiusMax,
  },
  languageButtonText: {
    ...Typography.body3,
    letterSpacing: Typography.xLargeLetterSpacing,
    color: Colors.primary150,
    textAlign: "center",
    textTransform: "uppercase",
  },
  textContainer: {
    alignSelf: "center",
    marginHorizontal: Spacing.medium,
    position: "absolute",
    alignItems: "center",
  },
  headerText: {
    ...Typography.header1,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  subheaderText: {
    ...Typography.body1,
    fontSize: Typography.large,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: Colors.primaryLightBackground,
  },
  bottomContentContainer: {
    paddingBottom: Spacing.large,
  },
  shareContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.small,
    backgroundColor: Colors.secondary10,
    borderBottomColor: Colors.neutral10,
    borderBottomWidth: Outlines.hairline,
  },
  shareImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary50,
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
    width: activationStatusRightWidth,
    alignItems: "center",
    justifyContent: "center",
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
    borderBottomColor: Colors.neutral10,
  },
  activationStatusLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activationStatusTextContainer: {
    marginLeft: Spacing.medium,
  },
  activationStatusRightContainer: {
    width: activationStatusRightWidth,
    alignItems: "center",
  },
  fixButtonContainer: {
    alignItems: "center",
    backgroundColor: Colors.secondary50,
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.small,
    borderRadius: Outlines.baseBorderRadius,
  },
  fixButtonText: {
    ...Typography.header4,
    color: Colors.primary100,
    textTransform: "uppercase",
  },
  bottomHeaderText: {
    ...Typography.header4,
    marginBottom: Spacing.xxxSmall,
  },
  bottomBodyText: {
    ...Typography.header6,
    color: Colors.neutral100,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.small,
  },
  button: {
    alignSelf: "center",
    width: "100%",
  },
})

export default HomeScreen
