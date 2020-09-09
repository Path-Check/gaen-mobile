import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { Platform } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import MainTabNavigator from "./MainTabNavigator"
import OnboardingStack from "./OnboardingStack"
import ActivationStack from "./ActivationStack"
import SettingsStack from "./SettingsStack"
import { useOnboardingContext } from "../OnboardingContext"
import {
  OnboardingScreens,
  AffectedUserFlowScreens,
  Screens,
  Stacks,
} from "./index"
import AffectedUserStack from "../AffectedUserFlow"
import MoreInfo from "../ExposureHistory/MoreInfo"
import ExposureDetail from "../ExposureHistory/ExposureDetail"
import ProtectPrivacy from "../Onboarding/ProtectPrivacy"
import LanguageSelection from "../Settings/LanguageSelection"

import { Headers, Colors } from "../styles"

const Stack = createStackNavigator()

const defaultScreenOptions = {
  headerShown: false,
}

const headerScreenOptions: StackNavigationOptions = {
  headerStyle: {
    ...Headers.headerStyle,
  },
  headerTitleStyle: {
    ...Headers.headerTitleStyle,
  },
  headerBackTitleVisible: false,
  headerTintColor: Colors.headerText,
  headerTitleAlign: "center",
}
const cardScreenOptions: StackNavigationOptions = {
  ...TransitionPresets.ModalPresentationIOS,
  headerShown: false,
  cardOverlayEnabled: true,
  cardShadowEnabled: true,
}

const ProtectPrivacyModal = () => {
  return <ProtectPrivacy modalStyle />
}

const ProtectPrivacyCard = () => {
  return <ProtectPrivacy />
}

const MainNavigator: FunctionComponent = () => {
  const { t } = useTranslation()
  const { onboardingIsComplete } = useOnboardingContext()

  const settingsStackTransitionPreset = Platform.select({
    ios: TransitionPresets.SlideFromRightIOS,
    android: TransitionPresets.DefaultTransition,
  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <>
          {onboardingIsComplete ? (
            <>
              <Stack.Screen
                name={"App"}
                component={MainTabNavigator}
                options={defaultScreenOptions}
              />
              <Stack.Screen
                name={Stacks.AffectedUserStack}
                component={AffectedUserStack}
                options={{
                  ...TransitionPresets.ModalTransition,
                  ...defaultScreenOptions,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name={Stacks.Settings}
                component={SettingsStack}
                options={{
                  headerShown: false,
                  ...settingsStackTransitionPreset,
                }}
              />
              <Stack.Screen
                name={AffectedUserFlowScreens.ProtectPrivacy}
                component={ProtectPrivacyModal}
                options={{
                  ...TransitionPresets.ModalTransition,
                  ...defaultScreenOptions,
                }}
              />
              <Stack.Screen
                name={Screens.MoreInfo}
                component={MoreInfo}
                options={{
                  title: t("navigation.more_info"),
                  ...headerScreenOptions,
                }}
              />
              <Stack.Screen
                name={Screens.ExposureDetail}
                component={ExposureDetail}
                options={{
                  title: t("navigation.exposure"),
                  ...headerScreenOptions,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name={Stacks.Onboarding}
                component={OnboardingStack}
                options={defaultScreenOptions}
              />
              <Stack.Screen
                name={OnboardingScreens.ProtectPrivacy}
                component={ProtectPrivacyCard}
                options={cardScreenOptions}
              />
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
            name={Screens.LanguageSelection}
            component={LanguageSelection}
            options={cardScreenOptions}
          />
        </>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
