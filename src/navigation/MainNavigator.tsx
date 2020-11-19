import React, { FunctionComponent, useRef } from "react"
import {
  createStackNavigator,
  TransitionPresets,
  HeaderStyleInterpolators,
} from "@react-navigation/stack"
import { Platform } from "react-native"
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useOnboardingContext } from "../OnboardingContext"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"

import { ModalStackScreens, HomeStackScreens } from "./index"
import { WelcomeStackScreens, Stacks } from "./index"
import MainTabNavigator from "./MainTabNavigator"
import HowItWorksStack from "./HowItWorksStack"
import ActivationStack from "./ActivationStack"
import SettingsStack from "./SettingsStack"
import Welcome from "../Welcome"
import AgeVerification from "../modals/AgeVerification"
import LanguageSelection from "../modals/LanguageSelection"
import ProtectPrivacy from "../modals/ProtectPrivacy"
import AffectedUserStack from "./AffectedUserFlowStack"
import SelfAssessmentStack from "./SelfAssessmentStack"
import ExposureDetectionStatusScreen from "../Home/ExposureDetectionStatus/Screen"
import BluetoothInfo from "../Home/BluetoothInfo"
import ExposureNotificationsInfo from "../Home/ExposureNotificationsInfo"
import LocationInfo from "../Home/LocationInfo"
import CallbackStack from "./CallbackStack"
import CovidDataDashboard from "../CovidData/Dashboard"

import { applyModalHeader } from "./ModalHeader"
import { applyHeaderLeftBackButton } from "../navigation/HeaderLeftBackButton"

import { Headers } from "../styles"

const Stack = createStackNavigator()

const defaultScreenOptions = {
  headerShown: false,
  headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
}

const settingsStackTransitionPreset = Platform.select({
  ios: TransitionPresets.SlideFromRightIOS,
  android: TransitionPresets.DefaultTransition,
})

const linking: LinkingOptions = {
  prefixes: ["pathcheck://"],
  config: {
    screens: {
      ExposureHistoryFlow: "exposureHistory",
    },
  },
}

const MainNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const { isOnboardingComplete } = useOnboardingContext()
  const { trackScreenView } = useProductAnalyticsContext()
  const navigationRef = useRef<NavigationContainerRef>(null)
  const routeNameRef = useRef<string>()

  const setInitialRoute = () => {
    routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name
  }

  const trackPageView = () => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = navigationRef?.current?.getCurrentRoute()?.name

    if (currentRouteName && previousRouteName !== currentRouteName) {
      trackScreenView(currentRouteName)
    }

    routeNameRef.current = currentRouteName
  }

  return (
    <NavigationContainer
      linking={linking}
      onReady={setInitialRoute}
      ref={navigationRef}
      onStateChange={trackPageView}
    >
      <Stack.Navigator headerMode="screen" screenOptions={defaultScreenOptions}>
        {isOnboardingComplete ? (
          <>
            <Stack.Screen name={"App"} component={MainTabNavigator} />
            <Stack.Screen
              name={Stacks.Settings}
              component={SettingsStack}
              options={settingsStackTransitionPreset}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name={WelcomeStackScreens.Welcome}
              component={Welcome}
            />
            <Stack.Screen
              name={ModalStackScreens.AgeVerification}
              component={AgeVerification}
              options={{
                ...TransitionPresets.ModalTransition,
                headerShown: false,
              }}
            />
            <Stack.Screen name={Stacks.HowItWorks}>
              {(props) => (
                <HowItWorksStack {...props} mountLocation="Onboarding" />
              )}
            </Stack.Screen>
            <Stack.Screen
              name={Stacks.Activation}
              component={ActivationStack}
              options={{
                ...defaultScreenOptions,
                gestureEnabled: false,
              }}
            />
          </>
        )}
        <Stack.Screen
          name={ModalStackScreens.LanguageSelection}
          component={LanguageSelection}
          options={{
            ...TransitionPresets.ModalTransition,
            headerShown: true,
            header: applyModalHeader(t("screen_titles.select_language")),
          }}
        />
        <Stack.Screen
          name={ModalStackScreens.ProtectPrivacy}
          component={ProtectPrivacy}
          options={{
            ...TransitionPresets.ModalTransition,
            headerShown: true,
            header: applyModalHeader(t("screen_titles.protect_privacy")),
          }}
        />
        <Stack.Screen
          name={Stacks.AffectedUserStack}
          component={AffectedUserStack}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name={ModalStackScreens.HowItWorksReviewFromSettings}>
          {(props) => <HowItWorksStack {...props} mountLocation="Settings" />}
        </Stack.Screen>
        <Stack.Screen
          name={ModalStackScreens.SelfAssessmentFromExposureDetails}
        >
          {(props) => {
            return (
              <SelfAssessmentStack
                {...props}
                destinationOnCancel={Stacks.ExposureHistoryFlow}
              />
            )
          }}
        </Stack.Screen>
        <Stack.Screen name={ModalStackScreens.SelfAssessmentFromHome}>
          {(props) => {
            return (
              <SelfAssessmentStack
                {...props}
                destinationOnCancel={Stacks.Home}
              />
            )
          }}
        </Stack.Screen>
        <Stack.Screen
          name={HomeStackScreens.ExposureDetectionStatus}
          component={ExposureDetectionStatusScreen}
          options={{
            ...Headers.headerMinimalOptions,
            headerLeft: applyHeaderLeftBackButton(),
          }}
        />
        <Stack.Screen
          name={HomeStackScreens.BluetoothInfo}
          component={BluetoothInfo}
          options={{
            ...TransitionPresets.ModalTransition,
            headerShown: true,
            header: applyModalHeader(t("screen_titles.bluetooth")),
          }}
        />
        <Stack.Screen
          name={HomeStackScreens.ExposureNotificationsInfo}
          component={ExposureNotificationsInfo}
          options={{
            ...TransitionPresets.ModalTransition,
            headerShown: true,
            header: applyModalHeader(t("screen_titles.exposure_notifications")),
          }}
        />
        <Stack.Screen
          name={HomeStackScreens.LocationInfo}
          component={LocationInfo}
          options={{
            ...TransitionPresets.ModalTransition,
            headerShown: true,
            header: applyModalHeader(t("screen_titles.location")),
          }}
        />
        <Stack.Screen
          name={ModalStackScreens.CallbackStack}
          component={CallbackStack}
        />
        <Stack.Screen
          name={HomeStackScreens.CovidDataDashboard}
          component={CovidDataDashboard}
          options={{
            ...Headers.headerMinimalOptions,
            headerLeft: applyHeaderLeftBackButton(),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
