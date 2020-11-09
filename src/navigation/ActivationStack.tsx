import React, { FunctionComponent } from "react"
import { Platform, TouchableOpacity, StyleSheet, View } from "react-native"
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { Stacks, ActivationStackScreen, ActivationStackScreens } from "./index"
import { usePermissionsContext } from "../Device/PermissionsContext"
import ActivateExposureNotifications from "../Activation/ActivateExposureNotifications"
import ActivateLocation from "../Activation/ActivateLocation"
import NotificationPermissions from "../Activation/NotificationPermissions"
import ActivationSummary from "../Activation/ActivationSummary"
import ActivateBluetooth from "../Activation/ActivateBluetooth"
import AcceptTermsOfService from "../Activation/AcceptTermsOfService"
import ProductAnalyticsConsentForm from "../Activation/ProductAnalyticsConsentForm"
import { useConfigurationContext } from "../ConfigurationContext"

import { Icons } from "../assets"
import { Layout, Spacing, Colors, Typography } from "../styles"

type ActivationStackParams = {
  [key in ActivationStackScreen]: undefined
}

const Stack = createStackNavigator<ActivationStackParams>()

const ActivationStack: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { locationPermissions, isBluetoothOn } = usePermissionsContext()
  const {
    displayAcceptTermsOfService,
    enableProductAnalytics,
  } = useConfigurationContext()

  interface ActivationStep {
    screenName: ActivationStackScreen
    component: FunctionComponent
  }

  const activateExposureNotifications: ActivationStep = {
    screenName: ActivationStackScreens.ActivateExposureNotifications,
    component: ActivateExposureNotifications,
  }

  const activateLocation: ActivationStep = {
    screenName: ActivationStackScreens.ActivateLocation,
    component: ActivateLocation,
  }

  const notificationPermissions: ActivationStep = {
    screenName: ActivationStackScreens.NotificationPermissions,
    component: NotificationPermissions,
  }

  const baseActivationSteps: ActivationStep[] = [activateExposureNotifications]

  if (displayAcceptTermsOfService) {
    const acceptTermsOfService: ActivationStep = {
      screenName: ActivationStackScreens.AcceptTermsOfService,
      component: AcceptTermsOfService,
    }
    baseActivationSteps.unshift(acceptTermsOfService)
  }

  if (!isBluetoothOn) {
    const activateBluetooth: ActivationStep = {
      screenName: ActivationStackScreens.ActivateBluetooth,
      component: ActivateBluetooth,
    }
    baseActivationSteps.push(activateBluetooth)
  }

  const activationStepsIOS: ActivationStep[] = [
    ...baseActivationSteps,
    notificationPermissions,
  ]

  const isLocationRequired = locationPermissions !== "NotRequired"
  const activationStepsAndroid: ActivationStep[] = isLocationRequired
    ? [...baseActivationSteps, activateLocation]
    : baseActivationSteps

  const activationSteps = Platform.select({
    ios: activationStepsIOS,
    android: activationStepsAndroid,
    default: activationStepsIOS,
  })

  if (enableProductAnalytics) {
    const anonymizedDataConsent: ActivationStep = {
      screenName: ActivationStackScreens.AnonymizedDataConsent,
      component: ProductAnalyticsConsentForm,
    }
    activationSteps.push(anonymizedDataConsent)
  }

  const activationSummary: ActivationStep = {
    screenName: ActivationStackScreens.ActivationSummary,
    component: ActivationSummary,
  }
  activationSteps.push(activationSummary)

  const CloseButton = () => {
    const handleOnPressClose = () => {
      navigation.navigate(Stacks.HowItWorks)
    }

    return (
      <TouchableOpacity onPress={handleOnPressClose}>
        <SvgXml
          xml={Icons.Close}
          fill={Colors.neutral.shade140}
          style={style.closeIcon}
          accessible
          accessibilityLabel={t("common.close")}
        />
      </TouchableOpacity>
    )
  }

  const HeaderRight: FunctionComponent = () => {
    return (
      <View style={style.headerRight}>
        <CloseButton />
      </View>
    )
  }

  const screenOptions: StackNavigationOptions = {
    headerShown: true,
    headerLeft: () => null,
    headerTitleAlign: "left",
    headerTitle: t("onboarding.activation_header_title"),
    headerTitleStyle: style.headerTitle,
    gestureEnabled: false,
    headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
  }

  return (
    <Stack.Navigator
      initialRouteName={ActivationStackScreens.AcceptTermsOfService}
      screenOptions={screenOptions}
    >
      {activationSteps.map((step) => {
        return (
          <Stack.Screen
            name={step.screenName}
            component={step.component}
            key={`activation-screen-${step.screenName}`}
            options={{
              headerRight: () => HeaderRight({}),
            }}
          />
        )
      })}
    </Stack.Navigator>
  )
}

const style = StyleSheet.create({
  headerTitle: {
    ...Typography.header.x30,
    color: Colors.neutral.shade100,
    maxWidth: Layout.halfWidth,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeIcon: {
    paddingHorizontal: Spacing.large,
  },
})

export default ActivationStack
